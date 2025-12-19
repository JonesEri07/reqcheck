import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "@/lib/utils/cors";
import { getJobByExternalId } from "@/lib/jobs/queries";
import { normalizeEmail } from "@/lib/utils/email";
import {
  calculateQuestionCount,
  getQuestionCountSetting,
} from "@/lib/widget/question-count";
import { db } from "@/lib/db/drizzle";
import {
  teams,
  verificationAttempts,
  jobs,
  SubscriptionStatus,
  verificationQuestionHistory,
  clientSkills,
} from "@/lib/db/schema";
import { eq, and, desc, gte, lte, isNotNull, isNull } from "drizzle-orm";
import { randomBytes } from "crypto";
import { getCurrentBillingUsage } from "@/lib/db/queries";
import { BILLING_CAPS } from "@/lib/constants/billing";
import { PlanName } from "@/lib/db/schema";

/**
 * POST /api/v1/widget/attempts/start
 * Start a verification attempt
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, jobId: externalJobId, companyId, testMode } = body;

    if (!email || !externalJobId || !companyId) {
      const response = NextResponse.json(
        { error: "Missing required fields: email, jobId, companyId" },
        { status: 400 }
      );
      return withCors(response, request);
    }

    const isTestMode = testMode === true;

    // Get team
    const teamId = parseInt(companyId, 10);
    if (isNaN(teamId)) {
      const response = NextResponse.json(
        { error: "Invalid companyId" },
        { status: 400 }
      );
      return withCors(response, request);
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      const response = NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
      return withCors(response, request);
    }

    // Skip subscription and billing checks in test mode
    if (!isTestMode) {
      // Check subscription status - must be ACTIVE
      if (team.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
        const response = NextResponse.json(
          {
            error:
              "Subscription is not active. Please activate your subscription to use the widget.",
          },
          { status: 403 }
        );
        return withCors(response, request);
      }

      // Check billing usage if stopWidgetAtFreeCap is enabled
      if (team.stopWidgetAtFreeCap) {
        const billingUsage = await getCurrentBillingUsage(teamId);
        const planName = (team.planName as PlanName) || PlanName.FREE;
        const billingCap = BILLING_CAPS[planName];

        // Only check if billing usage record exists (billing cycle is active)
        if (billingUsage) {
          // Use actualApplications from billing usage (tracks all completed attempts - pass or fail)
          // Plus count in-progress attempts (potential seats that haven't been completed yet)
          const cycleStart = billingUsage.cycleStart;
          const cycleEnd = billingUsage.cycleEnd;
          const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

          // Count in-progress attempts (not completed, not abandoned, within 24h) - these are potential seats
          // In-progress = completedAt is null AND abandonedAt is null AND startedAt is within 24 hours
          const inProgressAttempts = await db
            .select()
            .from(verificationAttempts)
            .where(
              and(
                eq(verificationAttempts.teamId, teamId),
                gte(verificationAttempts.startedAt, cycleStart),
                lte(verificationAttempts.startedAt, cycleEnd),
                isNull(verificationAttempts.completedAt),
                isNull(verificationAttempts.abandonedAt),
                gte(verificationAttempts.startedAt, twentyFourHoursAgo)
              )
            );

          // Total seats used = completed applications + in-progress attempts
          const completedApplications = billingUsage.actualApplications || 0;
          const potentialSeats = inProgressAttempts.length;
          const totalSeatsUsed = completedApplications + potentialSeats;

          if (totalSeatsUsed >= billingCap) {
            const response = NextResponse.json(
              {
                error: `Free tier limit reached. You've used ${totalSeatsUsed} of ${billingCap} free applications this month. Please upgrade to continue.`,
              },
              { status: 403 }
            );
            return withCors(response, request);
          }
        }
        // If billingUsage is null, allow the attempt (billing cycle may not be initialized yet)
      }
    }

    // Get job
    const job = await getJobByExternalId(externalJobId, teamId);
    if (!job) {
      const response = NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
      return withCors(response, request);
    }

    // In test mode, skip DB operations and resume checks
    if (isTestMode) {
      // Generate questions but don't create DB records
      const { getJobQuestionsForQuiz } =
        await import("@/lib/widget/job-questions");
      const { generateQuiz } = await import("@/lib/widget/quiz-generation");
      const skillsWithQuestions = await getJobQuestionsForQuiz(
        job.id,
        teamId,
        team.defaultQuestionTimeLimitSeconds ?? null
      );

      // Calculate question count based on settings and eligible skill count
      const eligibleSkillCount = skillsWithQuestions.length;
      const questionCountSetting = getQuestionCountSetting(
        job.questionCount as any,
        (team.defaultQuestionCount as any) || { type: "fixed", value: 5 }
      );
      const maxQuestionCount = calculateQuestionCount(
        questionCountSetting,
        eligibleSkillCount
      );

      const quiz = generateQuiz(skillsWithQuestions, maxQuestionCount);

      if (quiz.length === 0) {
        const response = NextResponse.json(
          { error: "Failed to generate quiz" },
          { status: 500 }
        );
        return withCors(response, request);
      }

      // Randomize options for each question
      const randomizedQuiz = quiz.map((question: any) => {
        const randomizedQuestion = { ...question };

        if (question.type === "multiple_choice" && question.config?.options) {
          const shuffledOptions = [...question.config.options].sort(
            () => Math.random() - 0.5
          );
          randomizedQuestion.config = {
            ...question.config,
            options: shuffledOptions,
          };
        } else if (
          question.type === "fill_blank_blocks" &&
          question.config?.correctAnswer &&
          question.config?.extraBlanks
        ) {
          const allOptions = [
            ...question.config.correctAnswer,
            ...question.config.extraBlanks,
          ];
          const shuffledOptions = [...allOptions].sort(
            () => Math.random() - 0.5
          );
          randomizedQuestion.config = {
            ...question.config,
            shuffledOptions,
          };
        }

        return randomizedQuestion;
      });

      // Generate fake session token and attempt ID for test mode
      const sessionToken = `test_${randomBytes(16).toString("hex")}`;
      const attemptId = `test_${randomBytes(16).toString("hex")}`;

      const response = NextResponse.json({
        sessionToken,
        attemptId,
        questions: randomizedQuiz,
        testMode: true,
      });
      return withCors(response, request);
    }

    // Normalize email
    const emailNormalized = normalizeEmail(email);

    // Check for recent failed attempts (cooldown)
    // TODO: Implement cooldown logic based on retryCount
    // For now, allow attempts

    // Check for existing attempt within 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const existingAttempts = await db
      .select()
      .from(verificationAttempts)
      .where(
        and(
          eq(verificationAttempts.emailNormalized, emailNormalized),
          eq(verificationAttempts.jobId, job.id),
          gte(verificationAttempts.startedAt, twentyFourHoursAgo)
        )
      )
      .orderBy(desc(verificationAttempts.startedAt))
      .limit(1);

    // If there's an existing in-progress attempt, return it
    if (existingAttempts.length > 0) {
      const existing = existingAttempts[0];
      if (!existing.completedAt && !existing.abandonedAt) {
        // In progress - return existing attempt
        // Get questions from question history
        const questionHistory =
          await db.query.verificationQuestionHistory.findMany({
            where: (history, { eq }) =>
              eq(history.verificationAttemptId, existing.id),
            orderBy: (history, { asc }) => [asc(history.order)],
          });

        // Reconstruct questions from history
        const questions = questionHistory.map((history) => {
          const questionData = history.questionData as any;
          return {
            id: history.questionId || history.id,
            type: questionData.type,
            prompt: questionData.prompt,
            config: questionData.config,
            imageUrl: questionData.imageUrl || null,
            imageAltText: questionData.imageAltText || null,
            timeLimitSeconds: questionData.timeLimitSeconds || null,
            skillId: history.clientSkillId,
            skillName: history.skillName,
            answer: history.answer, // Include existing answer if any
          };
        });

        const response = NextResponse.json({
          sessionToken: existing.sessionToken,
          attemptId: existing.id,
          resumed: true,
          questions,
        });
        return withCors(response, request);
      }
    }

    // Get questions for the quiz (will be cached by email+job)
    const { getJobQuestionsForQuiz } =
      await import("@/lib/widget/job-questions");
    const { generateQuiz } = await import("@/lib/widget/quiz-generation");
    const skillsWithQuestions = await getJobQuestionsForQuiz(
      job.id,
      teamId,
      team.defaultQuestionTimeLimitSeconds ?? null
    );

    // Calculate question count based on settings and eligible skill count
    const eligibleSkillCount = skillsWithQuestions.length;
    const questionCountSetting = getQuestionCountSetting(
      job.questionCount as any,
      (team.defaultQuestionCount as any) || { type: "fixed", value: 5 }
    );
    const maxQuestionCount = calculateQuestionCount(
      questionCountSetting,
      eligibleSkillCount
    );

    const quiz = generateQuiz(skillsWithQuestions, maxQuestionCount);

    if (quiz.length === 0) {
      const response = NextResponse.json(
        { error: "Failed to generate quiz" },
        { status: 500 }
      );
      return withCors(response, request);
    }

    // Randomize options for each question and persist the order
    const randomizedQuiz = quiz.map((question: any) => {
      const randomizedQuestion = { ...question };

      if (question.type === "multiple_choice" && question.config?.options) {
        // Shuffle multiple choice options
        const shuffledOptions = [...question.config.options].sort(
          () => Math.random() - 0.5
        );
        randomizedQuestion.config = {
          ...question.config,
          options: shuffledOptions,
        };
      } else if (
        question.type === "fill_blank_blocks" &&
        question.config?.correctAnswer &&
        question.config?.extraBlanks
      ) {
        // Shuffle fill-in-the-blank pool options
        const allOptions = [
          ...question.config.correctAnswer,
          ...question.config.extraBlanks,
        ];
        const shuffledOptions = [...allOptions].sort(() => Math.random() - 0.5);
        randomizedQuestion.config = {
          ...question.config,
          shuffledOptions, // Store shuffled order
        };
      }

      return randomizedQuestion;
    });

    // Generate session token
    const sessionToken = randomBytes(32).toString("hex");

    // Get IP and user agent
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      null;
    const userAgent = request.headers.get("user-agent") || null;

    // Get pass threshold from job (default to 70 if not set)
    const passThreshold = job.passThreshold || 70;

    // Create verification attempt
    const [attempt] = await db
      .insert(verificationAttempts)
      .values({
        teamId,
        jobId: job.id,
        email,
        emailNormalized,
        sessionToken,
        passThreshold, // Store pass threshold at time of attempt
        startedAt: new Date(),
        retryCount: 0,
        ipAddress,
        userAgent,
      })
      .returning();

    // Populate question history for this attempt
    // Get skill data for each question
    const questionHistoryData = await Promise.all(
      randomizedQuiz.map(async (question: any, index: number) => {
        // Get skill info from the question data
        const skillId = question.skillId;
        const skill = skillId
          ? await db.query.clientSkills.findFirst({
              where: eq(clientSkills.id, skillId),
            })
          : null;

        const skillName =
          question.skillName || skill?.skillName || "Unknown Skill";
        const skillNormalized = skillName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "");

        return {
          verificationAttemptId: attempt.id,
          questionId: question.id || null,
          clientSkillId: skillId || null,
          questionPreview: question.prompt?.substring(0, 100) || null,
          skillName,
          skillNormalized,
          questionData: {
            type: question.type,
            prompt: question.prompt,
            config: question.config,
            imageUrl: question.imageUrl || null,
            imageAltText: question.imageAltText || null,
            timeLimitSeconds: question.timeLimitSeconds || null,
          },
          skillData: skill
            ? {
                id: skill.id,
                skillName: skill.skillName,
                skillNormalized: skill.skillNormalized,
              }
            : {
                skillName,
                skillNormalized,
              },
          answer: null, // Will be populated when submitted
          order: index, // Maintain order as questions were generated
          createdAt: new Date(),
        };
      })
    );

    // Insert question history records
    if (questionHistoryData.length > 0) {
      await db.insert(verificationQuestionHistory).values(questionHistoryData);
    }

    const response = NextResponse.json({
      sessionToken: attempt.sessionToken,
      attemptId: attempt.id,
      questions: randomizedQuiz, // Return the questions with randomized options
    });

    return withCors(response, request);
  } catch (error: any) {
    console.error("Error starting attempt:", error);
    const response = NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
    return withCors(response, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
