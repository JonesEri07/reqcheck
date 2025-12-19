import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "@/lib/utils/cors";
import { getJobByExternalId } from "@/lib/jobs/queries";
import { normalizeEmail } from "@/lib/utils/email";
import { db } from "@/lib/db/drizzle";
import { teams, verificationAttempts } from "@/lib/db/schema";
import { eq, and, desc, gte, asc } from "drizzle-orm";

/**
 * GET /api/v1/widget/attempts/current
 * Get current attempt for email/job (within last 24 hours)
 * Returns attempt status: "passed", "failed", "in_progress", "abandoned", or null
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const jobId = searchParams.get("jobId"); // external job ID
  const companyId = searchParams.get("companyId");

  if (!email || !jobId || !companyId) {
    const response = NextResponse.json(
      { error: "Missing required parameters: email, jobId, companyId" },
      { status: 400 }
    );
    return withCors(response, request);
  }

  try {
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

    // Get job
    const job = await getJobByExternalId(jobId, teamId);
    if (!job) {
      const response = NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
      return withCors(response, request);
    }

    // Normalize email
    const emailNormalized = normalizeEmail(email);

    // Get attempts within last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const attempts = await db
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

    if (attempts.length === 0) {
      const response = NextResponse.json({
        status: null,
        attempt: null,
      });
      return withCors(response, request);
    }

    const attempt = attempts[0];
    const now = new Date();
    const startedAt = new Date(attempt.startedAt);
    const age = now.getTime() - startedAt.getTime();
    const twentyFourHours = 24 * 60 * 60 * 1000;

    // Determine status
    let status: "passed" | "failed" | "in_progress" | "abandoned" | null = null;
    let questionHistory: Awaited<
      ReturnType<typeof db.query.verificationQuestionHistory.findMany>
    > = [];

    if (attempt.completedAt) {
      // Completed
      if (attempt.passed) {
        status = "passed";
      } else {
        status = "failed";
      }
    } else if (attempt.abandonedAt) {
      // Already marked as abandoned
      status = "abandoned";
    } else if (age >= twentyFourHours) {
      // Outside 24h window - mark as abandoned
      await db
        .update(verificationAttempts)
        .set({ abandonedAt: new Date() })
        .where(eq(verificationAttempts.id, attempt.id));
      status = "abandoned";
    } else {
      // Still within 24h window, check if in progress
      // Fetch question history to determine progress
      questionHistory = await db.query.verificationQuestionHistory.findMany({
        where: (history, { eq }) =>
          eq(history.verificationAttemptId, attempt.id),
        orderBy: (history, { asc }) => [asc(history.order)],
      });

      // Count questions with non-null answers
      const answeredCount = questionHistory.filter(
        (q) => q.answer !== null && q.answer !== undefined
      ).length;

      if (answeredCount < questionHistory.length) {
        status = "in_progress";
      } else {
        // All questions answered but not completed - mark as abandoned
        await db
          .update(verificationAttempts)
          .set({ abandonedAt: new Date() })
          .where(eq(verificationAttempts.id, attempt.id));
        status = "abandoned";
      }
    }

    // Fetch question history for response if not already fetched
    if (questionHistory.length === 0) {
      questionHistory = await db.query.verificationQuestionHistory.findMany({
        where: (history, { eq }) =>
          eq(history.verificationAttemptId, attempt.id),
        orderBy: (history, { asc }) => [asc(history.order)],
      });
    }

    // Calculate time remaining if failed or abandoned
    let timeRemaining: number | null = null;
    if (status === "failed" || status === "abandoned") {
      const timeRemainingMs = twentyFourHours - age;
      if (timeRemainingMs > 0) {
        timeRemaining = Math.ceil(timeRemainingMs / (60 * 60 * 1000)); // hours
      }
    }

    // Get first unanswered question index if in progress
    let firstUnansweredIndex: number | null = null;
    if (status === "in_progress") {
      // Find first question with null/undefined answer
      firstUnansweredIndex = questionHistory.findIndex(
        (q) => q.answer === null || q.answer === undefined
      );
      if (firstUnansweredIndex === -1) {
        firstUnansweredIndex = questionHistory.length; // All answered, next would be at end
      }
    }

    // Build questionsShown and answers arrays from question history for backward compatibility
    // Reconstruct full QuizQuestion objects from questionData (same as start endpoint)
    // Ensure questionHistory is an array (safety check)
    const safeQuestionHistory = Array.isArray(questionHistory)
      ? questionHistory
      : [];

    const questionsShown = safeQuestionHistory.map((history) => {
      const questionData = (history.questionData as any) || {};
      return {
        id: history.questionId || history.id,
        type: questionData.type || "multiple_choice",
        prompt: questionData.prompt || history.questionPreview || "",
        config: questionData.config || {},
        imageUrl: questionData.imageUrl || null,
        imageAltText: questionData.imageAltText || null,
        timeLimitSeconds: questionData.timeLimitSeconds || null,
        skillId: history.clientSkillId,
        skillName: history.skillName,
      };
    });

    // Build answers array in the format expected by the widget
    const answers = safeQuestionHistory.map((history) => {
      if (history.answer === null || history.answer === undefined) {
        return null;
      }
      // Extract answer data from JSONB
      const answerData = (history.answer as any) || {};
      return {
        questionId: history.questionId || history.id,
        question:
          questionsShown.find(
            (q) => q.id === (history.questionId || history.id)
          ) || null,
        answer: answerData.answer || null,
        isCorrect: answerData.isCorrect || false,
        answeredAt: answerData.answeredAt || null,
      };
    });

    const response = NextResponse.json({
      status,
      attempt: {
        id: attempt.id,
        sessionToken: attempt.sessionToken,
        questionsShown,
        answers,
        startedAt: attempt.startedAt.toISOString(),
        completedAt: attempt.completedAt?.toISOString() || null,
        passed: attempt.passed,
        score: attempt.score,
      },
      timeRemaining, // hours until can retry
      firstUnansweredIndex, // index of first unanswered question (0-based)
    });

    return withCors(response, request);
  } catch (error: any) {
    console.error("Error getting current attempt:", error);
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
