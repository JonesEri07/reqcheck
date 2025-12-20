import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "@/lib/utils/cors";
import { validateAnswer } from "@/lib/widget/answer-validation";
import { db } from "@/lib/db/drizzle";
import {
  verificationAttempts,
  jobs,
  verificationQuestionHistory,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";
import { incrementBillingUsage } from "@/lib/db/queries";

/**
 * POST /api/v1/widget/attempts/submit
 * Submit answers and get result
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken, attemptId, answers, timeTakenSeconds } = body;

    if (!sessionToken || !attemptId || !answers || !Array.isArray(answers)) {
      const response = NextResponse.json(
        { error: "Missing required fields: sessionToken, attemptId, answers" },
        { status: 400 }
      );
      return withCors(response, request);
    }

    // Check if this is a test mode attempt (IDs start with "test_")
    const isTestMode =
      attemptId.startsWith("test_") || sessionToken.startsWith("test_");

    // In test mode, skip all DB operations and return results without creating records
    if (isTestMode) {
      // In test mode, questions are not stored in DB, so we validate if questions are provided
      // Otherwise, we return a mock result (for demo purposes)
      const { questions } = body;

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

      const response = NextResponse.json({
        passed,
        score,
        requiredScore: passThreshold,
        totalQuestions,
        verificationToken: passed ? randomBytes(32).toString("hex") : null,
        tokenExpiresAt: passed
          ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
          : null,
        cooldownUntil: passed
          ? null
          : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        testMode: true,
      });

      return withCors(response, request);
    }

    // Get attempt
    const attempt = await db.query.verificationAttempts.findFirst({
      where: eq(verificationAttempts.sessionToken, sessionToken),
      with: {
        job: true,
      },
    });

    if (!attempt || attempt.id !== attemptId) {
      const response = NextResponse.json(
        { error: "Invalid session token or attempt ID" },
        { status: 401 }
      );
      return withCors(response, request);
    }

    if (attempt.completedAt) {
      const response = NextResponse.json(
        { error: "Attempt already completed" },
        { status: 400 }
      );
      return withCors(response, request);
    }

    // Get questions from question history
    const questionHistory = await db.query.verificationQuestionHistory.findMany(
      {
        where: (history, { eq }) =>
          eq(history.verificationAttemptId, attemptId),
        orderBy: (history, { asc }) => [asc(history.order)],
      }
    );

    if (questionHistory.length === 0) {
      const response = NextResponse.json(
        { error: "No questions found for this attempt" },
        { status: 400 }
      );
      return withCors(response, request);
    }

    // Update answers in question history
    let correctCount = 0;
    for (const answerData of answers) {
      const { questionId, answer } = answerData;

      // Find the question in history
      const questionRecord = questionHistory.find(
        (q) => q.questionId === questionId || q.id === questionId
      );

      if (!questionRecord) {
        continue; // Skip invalid question IDs
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

    // Use passThreshold from attempt (stored at start) or fall back to job's current threshold
    const passThreshold =
      attempt.passThreshold || attempt.job.passThreshold || 70;
    const passed = score >= passThreshold;

    // Generate verification token if passed (24 hour TTL)
    let verificationToken: string | null = null;
    let tokenExpiresAt: Date | null = null;

    if (passed) {
      verificationToken = randomBytes(32).toString("hex");
      tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    }

    // Extract device type from user agent if available
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
        // referralSource can be added later if tracked in widget
      })
      .where(eq(verificationAttempts.id, attemptId));

    // Increment billing usage for all completed attempts (pass or fail)
    // Only incomplete (abandoned) attempts are not counted
    // This is done asynchronously to not block the response
    incrementBillingUsage(attempt.teamId).catch((error) => {
      console.error(
        `Failed to increment billing usage for team ${attempt.teamId}:`,
        error
      );
    });

    const response = NextResponse.json({
      passed,
      score,
      requiredScore: passThreshold,
      totalQuestions,
      verificationToken,
      tokenExpiresAt: tokenExpiresAt?.toISOString() || null,
      cooldownUntil: passed
        ? null
        : new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hour cooldown if failed
    });

    return withCors(response, request);
  } catch (error: any) {
    console.error("Error submitting attempt:", error);
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
