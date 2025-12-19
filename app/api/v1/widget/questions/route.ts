import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "@/lib/utils/cors";
import { getJobByExternalId } from "@/lib/jobs/queries";
import { getJobQuestionsForQuiz } from "@/lib/widget/job-questions";
import { generateQuiz } from "@/lib/widget/quiz-generation";
import {
  calculateQuestionCount,
  getQuestionCountSetting,
} from "@/lib/widget/question-count";
import { db } from "@/lib/db/drizzle";
import { teams } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Simple in-memory cache for quiz generation
// In production, use Redis or similar for distributed caching
const quizCache = new Map<string, { quiz: any[]; expiresAt: number }>();

/**
 * GET /api/v1/widget/questions
 * Get questions for a job (generates quiz using weighted random selection)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const jobId = searchParams.get("jobId"); // external job ID
  const email = searchParams.get("email"); // optional: for caching

  if (!companyId || !jobId) {
    const response = NextResponse.json(
      { error: "Missing companyId or jobId" },
      { status: 400 }
    );
    return withCors(response, request);
  }

  try {
    // Get team by ID
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

    // Get job by external ID
    const job = await getJobByExternalId(jobId, teamId);

    if (!job) {
      const response = NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
      return withCors(response, request);
    }

    // Check cache if email provided (24 hour cache per email-job combination)
    const cacheKey = email
      ? `quiz:${email.toLowerCase()}:${job.id}`
      : `quiz:anonymous:${job.id}:${Date.now()}`; // Anonymous gets unique cache key

    const cached = quizCache.get(cacheKey);
    const now = Date.now();
    const cacheExpiry = 24 * 60 * 60 * 1000; // 24 hours

    if (cached && cached.expiresAt > now) {
      // Return cached quiz
      const response = NextResponse.json({
        questions: cached.quiz,
        jobId: job.id,
        passThreshold: job.passThreshold || 70, // Default 70%
        cached: true,
      });
      return withCors(response, request);
    }

    // Get all questions for this job with weights
    const skillsWithQuestions = await getJobQuestionsForQuiz(
      job.id,
      teamId,
      team.defaultQuestionTimeLimitSeconds ?? null
    );

    // Check if we have any eligible questions
    const totalEligibleQuestions = skillsWithQuestions.reduce(
      (sum, skill) => sum + skill.questions.length,
      0
    );

    if (totalEligibleQuestions === 0) {
      const response = NextResponse.json(
        { error: "No questions available for this job", canGenerate: false },
        { status: 400 }
      );
      return withCors(response, request);
    }

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

    // Generate quiz
    const quiz = generateQuiz(skillsWithQuestions, maxQuestionCount);

    if (quiz.length === 0) {
      const response = NextResponse.json(
        { error: "Failed to generate quiz", canGenerate: false },
        { status: 500 }
      );
      return withCors(response, request);
    }

    // Cache the quiz (24 hours)
    quizCache.set(cacheKey, {
      quiz,
      expiresAt: now + cacheExpiry,
    });

    // Clean up expired cache entries (simple cleanup, in production use TTL)
    if (quizCache.size > 1000) {
      for (const [key, value] of quizCache.entries()) {
        if (value.expiresAt <= now) {
          quizCache.delete(key);
        }
      }
    }

    const response = NextResponse.json({
      questions: quiz,
      jobId: job.id,
      passThreshold: job.passThreshold || 70,
      cached: false,
    });

    return withCors(response, request);
  } catch (error: any) {
    console.error("Error generating quiz:", error);
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
