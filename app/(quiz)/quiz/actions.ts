"use server";

import { z } from "zod";
import { db } from "@/lib/db/drizzle";
import {
  teams,
  verificationAttempts,
  jobs,
  SubscriptionStatus,
  PlanName,
  verificationQuestionHistory,
  clientSkills,
} from "@/lib/db/schema";
import { eq, and, desc, gte, isNull } from "drizzle-orm";
import { getJobByExternalId } from "@/lib/jobs/queries";
import { normalizeEmail } from "@/lib/utils/email";
import {
  signRedirectToken,
  verifyRedirectToken,
  validateRedirectUrl,
} from "@/lib/utils/redirect-token";
import {
  checkRateLimit,
  recordAttempt,
  getClientIp,
} from "@/lib/utils/rate-limit";
import { getCurrentBillingUsage } from "@/lib/db/queries";
import { BILLING_CAPS } from "@/lib/constants/billing";
import { headers } from "next/headers";
import { randomBytes } from "crypto";
import { getJobQuestionsForQuiz } from "@/lib/widget/job-questions";
import { generateQuiz } from "@/lib/widget/quiz-generation";
import {
  calculateQuestionCount,
  getQuestionCountSetting,
} from "@/lib/widget/question-count";
import { validatedAction } from "@/lib/auth/proxy";

type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any;
};

const validateJobSchema = z.object({
  companyId: z.string(),
  jobId: z.string(),
  testMode: z.boolean().optional(),
});

export async function validateJob(
  data: z.infer<typeof validateJobSchema>
): Promise<ActionState> {
  try {
    const { companyId, jobId, testMode } = data;
    const isTestMode = testMode === true;

    // Get team
    const teamId = parseInt(companyId, 10);
    if (isNaN(teamId)) {
      return { error: "Invalid quiz link", valid: false };
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      return { error: "Invalid quiz link", valid: false };
    }

    // Check subscription status (skip in test mode, don't expose to user)
    if (!isTestMode && team.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
      return {
        error: "This quiz is currently unavailable",
        valid: false,
      };
    }

    // Get job
    const job = await getJobByExternalId(jobId, teamId);
    if (!job) {
      return { error: "Invalid quiz link", valid: false };
    }

    // Check if quiz can be generated (has eligible questions)
    const skillsWithQuestions = await getJobQuestionsForQuiz(
      job.id,
      teamId,
      team.defaultQuestionTimeLimitSeconds ?? null
    );

    const totalEligibleQuestions = skillsWithQuestions.reduce(
      (sum, skill) => sum + skill.questions.length,
      0
    );

    if (totalEligibleQuestions === 0) {
      return {
        error: "This quiz is currently unavailable",
        valid: false,
      };
    }

    return {
      valid: true,
      jobTitle: job.title,
      companyName: team.name,
    };
  } catch (error: any) {
    console.error("Error validating job:", error);
    return {
      error: "This quiz is currently unavailable",
      valid: false,
    };
  }
}

const checkQuizStatusSchema = z.object({
  companyId: z.string(),
  jobId: z.string(),
  email: z.string().email(),
  testMode: z.boolean().optional(),
});

export async function checkQuizStatus(
  data: z.infer<typeof checkQuizStatusSchema>
): Promise<ActionState> {
  try {
    const { companyId, jobId, email, testMode } = data;
    const isTestMode = testMode === true;

    // In test mode, always return no existing attempt
    if (isTestMode) {
      return {
        status: null,
        attempt: null,
      };
    }

    // Get team
    const teamId = parseInt(companyId, 10);
    if (isNaN(teamId)) {
      return { error: "Invalid quiz link" };
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      return { error: "Invalid quiz link" };
    }

    // Get job
    const job = await getJobByExternalId(jobId, teamId);
    if (!job) {
      return { error: "Invalid quiz link" };
    }

    // Normalize email
    const emailNormalized = normalizeEmail(email);

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

    if (existingAttempts.length === 0) {
      return {
        status: null,
        attempt: null,
      };
    }

    const attempt = existingAttempts[0];

    // Determine status
    let status: "passed" | "failed" | "in_progress" | "abandoned" | null = null;

    if (attempt.completedAt) {
      status = attempt.passed ? "passed" : "failed";
    } else if (attempt.abandonedAt) {
      status = "abandoned";
    } else {
      status = "in_progress";
    }

    return {
      status,
      attempt: {
        id: attempt.id,
        sessionToken: attempt.sessionToken,
        redirectToken: attempt.redirectToken,
        score: attempt.score,
        passed: attempt.passed,
      },
    };
  } catch (error: any) {
    console.error("Error checking quiz status:", error);
    return { error: "This quiz is currently unavailable" };
  }
}

const startHostedQuizSchema = z.object({
  companyId: z.string(),
  jobId: z.string(),
  email: z.string().email(),
  redirectPass: z.string().url(),
  redirectFail: z.string().url(),
  testMode: z.boolean().optional(),
});

export async function startHostedQuiz(
  data: z.infer<typeof startHostedQuizSchema>
): Promise<ActionState> {
  try {
    const { companyId, jobId, email, redirectPass, redirectFail, testMode } =
      data;
    const isTestMode = testMode === true;

    // Validate redirect URLs
    if (!validateRedirectUrl(redirectPass)) {
      return { error: "Invalid redirectPass URL (must be HTTPS)" };
    }
    if (!validateRedirectUrl(redirectFail)) {
      return { error: "Invalid redirectFail URL (must be HTTPS)" };
    }

    // Get team
    const teamId = parseInt(companyId, 10);
    if (isNaN(teamId)) {
      return { error: "Invalid quiz link" };
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      return { error: "Invalid quiz link" };
    }

    // Check subscription status (skip in test mode, don't expose to user)
    if (!isTestMode && team.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
      return {
        error: "This quiz is currently unavailable",
      };
    }

    // Check rate limits (skip in test mode)
    if (!isTestMode) {
      const headersList = await headers();
      const ip = getClientIp(
        new Request("http://localhost", {
          headers: Object.fromEntries(headersList.entries()),
        })
      );
      const rateLimitCheck = checkRateLimit(ip, email);
      if (rateLimitCheck.limited) {
        return {
          error: "Please try again later",
          resetAt: rateLimitCheck.resetAt,
        };
      }
    }

    // Get job
    const job = await getJobByExternalId(jobId, teamId);
    if (!job) {
      return { error: "Invalid quiz link" };
    }

    // Check billing usage if stopWidgetAtFreeCap is enabled (skip in test mode)
    if (!isTestMode && team.stopWidgetAtFreeCap) {
      const billingUsage = await getCurrentBillingUsage(teamId);
      const planName = (team.planName as PlanName) || PlanName.BASIC;
      const billingCap = BILLING_CAPS[planName];

      if (billingUsage) {
        const cycleStart = billingUsage.cycleStart;
        const cycleEnd = billingUsage.cycleEnd;
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const inProgressAttempts = await db
          .select()
          .from(verificationAttempts)
          .where(
            and(
              eq(verificationAttempts.teamId, teamId),
              gte(verificationAttempts.startedAt, cycleStart),
              isNull(verificationAttempts.completedAt),
              isNull(verificationAttempts.abandonedAt),
              gte(verificationAttempts.startedAt, twentyFourHoursAgo)
            )
          );

        const completedApplications = billingUsage.actualApplications || 0;
        const potentialSeats = inProgressAttempts.length;
        const totalSeatsUsed = completedApplications + potentialSeats;

        if (totalSeatsUsed >= billingCap) {
          return {
            error: "This quiz is currently unavailable",
          };
        }
      }
    }

    // Normalize email
    const emailNormalized = normalizeEmail(email);

    // Check for existing in-progress attempt (skip in test mode)
    if (!isTestMode) {
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

      if (existingAttempts.length > 0) {
        const existing = existingAttempts[0];
        if (!existing.completedAt && !existing.abandonedAt) {
          // In progress - return existing attempt with redirect token
          return {
            status: "in_progress",
            attemptId: existing.id,
            sessionToken: existing.sessionToken,
            redirectToken: existing.redirectToken,
          };
        }
      }
    }

    // Use quiz generation logic directly (same as widget API)

    // Get questions for the quiz
    const skillsWithQuestions = await getJobQuestionsForQuiz(
      job.id,
      teamId,
      team.defaultQuestionTimeLimitSeconds ?? null
    );

    // Calculate question count
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
      return { error: "This quiz is currently unavailable" };
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
        const shuffledOptions = allOptions.sort(() => Math.random() - 0.5);
        randomizedQuestion.config = {
          ...question.config,
          shuffledOptions,
        };
      }

      return randomizedQuestion;
    });

    // Generate session token (test mode uses test_ prefix)
    const sessionToken = isTestMode
      ? `test_${randomBytes(16).toString("hex")}`
      : randomBytes(32).toString("hex");

    // Get IP and user agent (reuse headersList from rate limiting check above, or get fresh in test mode)
    let ipAddress: string | null = null;
    let userAgent: string | null = null;
    if (!isTestMode) {
      const headersList = await headers();
      ipAddress =
        headersList.get("x-forwarded-for") ||
        headersList.get("x-real-ip") ||
        null;
      userAgent = headersList.get("user-agent") || null;
    }

    // Get pass threshold
    const passThreshold = job.passThreshold || 70;

    // In test mode, skip DB operations
    if (isTestMode) {
      // Generate fake attempt ID for redirect token
      const fakeAttemptId = `test_${randomBytes(16).toString("hex")}`;
      const redirectToken = await signRedirectToken({
        redirectPass,
        redirectFail,
        attemptId: fakeAttemptId,
        companyId: teamId,
        jobId: job.id,
      });

      // Record attempt for rate limiting (skip in test mode)
      // recordAttempt(ip, email);

      return {
        success: "Quiz started",
        sessionToken,
        attemptId: fakeAttemptId,
        questions: randomizedQuiz,
        redirectToken,
        testMode: true,
      };
    }

    // Normal mode: Create verification attempt
    const [attempt] = await db
      .insert(verificationAttempts)
      .values({
        teamId,
        jobId: job.id,
        email,
        emailNormalized,
        sessionToken,
        passThreshold,
        startedAt: new Date(),
        retryCount: 0,
        ipAddress,
        userAgent,
      })
      .returning();

    // Generate redirect token with actual attemptId
    const redirectToken = await signRedirectToken({
      redirectPass,
      redirectFail,
      attemptId: attempt.id,
      companyId: teamId,
      jobId: job.id,
    });

    // Update attempt with redirect token
    await db
      .update(verificationAttempts)
      .set({ redirectToken })
      .where(eq(verificationAttempts.id, attempt.id));

    // Populate question history
    const questionHistoryData = await Promise.all(
      randomizedQuiz.map(async (question: any, index: number) => {
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
          answer: null,
          order: index,
          createdAt: new Date(),
        };
      })
    );

    // Insert question history records
    if (questionHistoryData.length > 0) {
      await db.insert(verificationQuestionHistory).values(questionHistoryData);
    }

    // Record attempt for rate limiting
    const headersList = await headers();
    const ip = getClientIp(
      new Request("http://localhost", {
        headers: Object.fromEntries(headersList.entries()),
      })
    );
    recordAttempt(ip, email);

    return {
      success: "Quiz started",
      sessionToken: attempt.sessionToken,
      attemptId: attempt.id,
      questions: randomizedQuiz,
      redirectToken,
    };
  } catch (error: any) {
    console.error("Error starting hosted quiz:", error);
    return { error: "This quiz is currently unavailable" };
  }
}

const submitHostedQuizSchema = z.object({
  sessionToken: z.string(),
  attemptId: z.string(),
  answers: z.string(), // JSON string from FormData
  timeTakenSeconds: z.string().optional(), // String from FormData, will parse
  questions: z.string().optional(), // JSON string from FormData
  redirectToken: z.string().optional(),
});

export const submitHostedQuiz = validatedAction(
  submitHostedQuizSchema,
  async (data, formData) => {
    try {
      // Parse JSON strings from FormData
      let answers: Array<{
        questionId: string;
        answer: string | string[];
      }> = [];
      try {
        answers = JSON.parse(data.answers);
      } catch (e) {
        return { error: "Invalid answers format" };
      }

      const timeTakenSeconds = data.timeTakenSeconds
        ? parseInt(data.timeTakenSeconds, 10)
        : undefined;

      let questions: any[] | undefined;
      if (data.questions) {
        try {
          questions = JSON.parse(data.questions);
        } catch (e) {
          // Ignore parse error for questions
        }
      }

      const { sessionToken, attemptId, redirectToken } = data;

      // Check if this is a test mode attempt (IDs start with "test_")
      const isTestMode =
        attemptId.startsWith("test_") || sessionToken.startsWith("test_");

      // Import widget submit logic directly to avoid HTTP call
      const { validateAnswer } = await import("@/lib/widget/answer-validation");
      const { incrementBillingUsage } = await import("@/lib/db/queries");
      const { randomBytes } = await import("crypto");

      // In test mode, skip DB operations and calculate score directly
      if (isTestMode) {
        let score = 0;
        let correctCount = 0;
        const totalQuestions = answers.length;
        const passThreshold = 70; // Default threshold for test mode

        // If questions are provided, validate answers properly
        if (questions && Array.isArray(questions) && questions.length > 0) {
          for (const answerData of answers) {
            const { questionId, answer } = answerData;

            // Find the question
            const question = questions.find((q: any) => q.id === questionId);

            if (question) {
              const isCorrect = validateAnswer(
                question.type,
                question.config,
                answer
              );

              if (isCorrect) {
                correctCount++;
              }
            }
          }

          score =
            totalQuestions > 0
              ? Math.round((correctCount / totalQuestions) * 100)
              : 0;
        } else {
          // No questions provided - return mock result (70% pass rate for demo)
          const mockCorrectCount = Math.floor(totalQuestions * 0.7);
          score =
            totalQuestions > 0
              ? Math.round((mockCorrectCount / totalQuestions) * 100)
              : 0;
        }

        const passed = score >= passThreshold;

        // Get redirect token from request (passed from client)
        if (redirectToken) {
          try {
            const redirectPayload = await verifyRedirectToken(redirectToken);
            const redirectUrl = passed
              ? redirectPayload.redirectPass
              : redirectPayload.redirectFail;

            // Add status params to redirect URL
            const url = new URL(redirectUrl);
            url.searchParams.set("status", passed ? "passed" : "failed");
            url.searchParams.set("score", score.toString());

            return {
              success: "Quiz submitted",
              passed,
              score,
              redirectUrl: url.toString(),
              testMode: true,
            };
          } catch (error) {
            console.error(
              "Error verifying redirect token in test mode:",
              error
            );
          }
        }

        return {
          success: "Quiz submitted",
          passed,
          score,
          testMode: true,
        };
      }

      // Normal mode: Get attempt from DB
      const attempt = await db.query.verificationAttempts.findFirst({
        where: eq(verificationAttempts.sessionToken, sessionToken),
        with: {
          job: true,
        },
      });

      if (!attempt || attempt.id !== attemptId) {
        return { error: "Invalid session token or attempt ID" };
      }

      if (attempt.completedAt) {
        return { error: "Attempt already completed" };
      }

      // Get questions from question history
      const questionHistory =
        await db.query.verificationQuestionHistory.findMany({
          where: (history, { eq }) =>
            eq(history.verificationAttemptId, attemptId),
          orderBy: (history, { asc }) => [asc(history.order)],
        });

      if (questionHistory.length === 0) {
        return { error: "No questions found for this attempt" };
      }

      // Update answers and calculate score
      let correctCount = 0;
      for (const answerData of answers) {
        const { questionId, answer } = answerData;

        const questionRecord = questionHistory.find(
          (q) => q.questionId === questionId || q.id === questionId
        );

        if (!questionRecord) {
          continue;
        }

        const questionData = questionRecord.questionData as any;
        const isCorrect = validateAnswer(
          questionData.type,
          questionData.config,
          answer
        );

        if (isCorrect) {
          correctCount++;
        }

        // Update the answer in question history
        await db
          .update(verificationQuestionHistory)
          .set({
            answer: {
              questionId,
              answer,
              isCorrect,
              answeredAt: new Date().toISOString(),
            },
          })
          .where(eq(verificationQuestionHistory.id, questionRecord.id));
      }

      const totalQuestions = questionHistory.length;
      const score =
        totalQuestions > 0
          ? Math.round((correctCount / totalQuestions) * 100)
          : 0;

      const passThreshold =
        attempt.passThreshold || attempt.job.passThreshold || 70;
      const passed = score >= passThreshold;

      // Generate verification token if passed
      let verificationToken: string | null = null;
      let tokenExpiresAt: Date | null = null;

      if (passed) {
        verificationToken = randomBytes(32).toString("hex");
        tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      }

      // Extract device type from user agent
      let deviceType: string | null = null;
      if (attempt.userAgent) {
        const ua = attempt.userAgent.toLowerCase();
        if (
          ua.includes("mobile") ||
          ua.includes("android") ||
          ua.includes("iphone")
        ) {
          deviceType = "mobile";
        } else if (ua.includes("tablet") || ua.includes("ipad")) {
          deviceType = "tablet";
        } else {
          deviceType = "desktop";
        }
      }

      // Update attempt
      await db
        .update(verificationAttempts)
        .set({
          score,
          passed,
          completedAt: new Date(),
          timeTakenSeconds: timeTakenSeconds || null,
          verificationToken,
          tokenExpiresAt,
          deviceType,
        })
        .where(eq(verificationAttempts.id, attemptId));

      // Increment billing usage
      incrementBillingUsage(attempt.teamId).catch((error) => {
        console.error(
          `Failed to increment billing usage for team ${attempt.teamId}:`,
          error
        );
      });

      // Get redirect token and extract URLs
      if (!attempt.redirectToken) {
        return { error: "Missing redirect token" };
      }

      const redirectPayload = await verifyRedirectToken(attempt.redirectToken);
      const redirectUrl = passed
        ? redirectPayload.redirectPass
        : redirectPayload.redirectFail;

      // Add status params to redirect URL
      const url = new URL(redirectUrl);
      url.searchParams.set("status", passed ? "passed" : "failed");
      url.searchParams.set("score", score.toString());

      return {
        success: "Quiz submitted",
        passed,
        score,
        redirectUrl: url.toString(),
      };
    } catch (error: any) {
      console.error("Error submitting hosted quiz:", error);
      return { error: "This quiz is currently unavailable" };
    }
  }
);
