import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "@/lib/utils/cors";
import { validateAnswer } from "@/lib/widget/answer-validation";
import { db } from "@/lib/db/drizzle";
import {
  verificationAttempts,
  verificationQuestionHistory,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/v1/widget/attempts/progress
 * Save progress after answering a question (incremental save)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionToken, attemptId, questionId, answer } = body;

    if (!sessionToken || !attemptId || !questionId || answer === undefined) {
      const response = NextResponse.json(
        {
          error:
            "Missing required fields: sessionToken, attemptId, questionId, answer",
        },
        { status: 400 }
      );
      return withCors(response, request);
    }

    // Get attempt
    const attempt = await db.query.verificationAttempts.findFirst({
      where: eq(verificationAttempts.sessionToken, sessionToken),
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

    // Get question history for this attempt (ordered by order field)
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

    // Find the question in history
    const questionRecord = questionHistory.find(
      (q) => q.questionId === questionId || q.id === questionId
    );

    if (!questionRecord) {
      const response = NextResponse.json(
        { error: "Question not found in quiz" },
        { status: 400 }
      );
      return withCors(response, request);
    }

    // Get question data from history
    const questionData = questionRecord.questionData as any;
    const isCorrect = validateAnswer(
      questionData.type,
      questionData.config,
      answer
    );

    // Update answer in question history
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

    // Clear abandonedAt if it was set (user is making progress)
    await db
      .update(verificationAttempts)
      .set({
        abandonedAt: null,
      })
      .where(eq(verificationAttempts.id, attemptId));

    // Check if this is the last question (count answered questions)
    const answeredCount = questionHistory.filter(
      (q) => q.answer !== null
    ).length;
    const isLastQuestion = answeredCount >= questionHistory.length;

    const response = NextResponse.json({
      success: true,
      isLastQuestion,
      totalAnswered: answeredCount,
      totalQuestions: questionHistory.length,
    });

    return withCors(response, request);
  } catch (error: any) {
    console.error("Error saving progress:", error);
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
