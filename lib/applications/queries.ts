import { eq, and, desc, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  verificationAttempts,
  jobs,
  verificationQuestionHistory,
} from "@/lib/db/schema";

/**
 * Get all applications (passed verification attempts) for a team
 * Returns with verified: true (all passed attempts are automatically verified)
 */
export async function getApplicationsForTeam(teamId: number) {
  const attempts = await db.query.verificationAttempts.findMany({
    where: (attempts, { eq, and, isNotNull }) =>
      and(
        eq(attempts.teamId, teamId),
        eq(attempts.passed, true),
        isNotNull(attempts.completedAt)
      ),
    with: {
      job: {
        columns: {
          id: true,
          title: true,
          externalJobId: true,
        },
      },
    },
    orderBy: (attempts, { desc }) => [desc(attempts.completedAt)],
  });

  // Add verified: true to all results (all passed attempts are verified)
  return attempts.map((attempt) => ({
    ...attempt,
    verified: true,
  }));
}

/**
 * Get application (verification attempt) by ID
 * Returns with verified: true (all passed attempts are automatically verified)
 */
export async function getApplicationById(
  applicationId: string,
  teamId: number
) {
  const result = await db
    .select()
    .from(verificationAttempts)
    .where(
      and(
        eq(verificationAttempts.id, applicationId),
        eq(verificationAttempts.teamId, teamId),
        eq(verificationAttempts.passed, true),
        isNotNull(verificationAttempts.completedAt)
      )
    )
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  // Add verified: true (all passed attempts are verified)
  return {
    ...result[0],
    verified: true,
  };
}

/**
 * Get all applications (passed verification attempts) for a job
 */
export async function getApplicationsForJob(jobId: string, teamId: number) {
  // Verify job belongs to team
  const job = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.teamId, teamId)))
    .limit(1);

  if (job.length === 0) {
    return [];
  }

  return await db
        .select()
        .from(verificationAttempts)
    .where(
      and(
        eq(verificationAttempts.jobId, jobId),
        eq(verificationAttempts.passed, true),
        isNotNull(verificationAttempts.completedAt)
      )
    )
    .orderBy(desc(verificationAttempts.completedAt));
}

/**
 * Get application with job and question history
 * Uses verificationQuestionHistory table for questions and answers
 */
export async function getApplicationWithDetails(
  applicationId: string,
  teamId: number
) {
  const attempt = await db.query.verificationAttempts.findFirst({
    where: (attempts, { eq, and, isNotNull }) =>
      and(
        eq(attempts.id, applicationId),
        eq(attempts.teamId, teamId),
        eq(attempts.passed, true),
        isNotNull(attempts.completedAt)
      ),
    with: {
      job: true,
    },
  });

  if (!attempt) {
    return null;
  }

  // Get question history from verificationQuestionHistory table
  const questionHistory = await db.query.verificationQuestionHistory.findMany({
    where: (history, { eq }) => eq(history.verificationAttemptId, attempt.id),
    with: {
    question: {
        columns: {
          id: true,
          type: true,
          prompt: true,
          config: true,
          imageUrl: true,
          imageAltText: true,
          timeLimitSeconds: true,
        },
      },
    },
    orderBy: (history, { asc }) => [asc(history.createdAt)],
  });

  // Transform to match expected format
  const transformedHistory = questionHistory.map((history) => {
    const answerData = history.answer as any;
    const questionData = history.questionData as any;

        return {
      id: history.id,
      questionPreview: history.questionPreview,
      skillName: history.skillName,
      skillNormalized: history.skillNormalized,
          questionData: {
        type: questionData.type,
        prompt: questionData.prompt,
        config: questionData.config,
          },
      skillData: history.skillData as any,
          answer: answerData
            ? {
            questionId: answerData.questionId,
                answer: answerData.answer,
                selectedOption:
              questionData.type === "multiple_choice"
                    ? answerData.selectedOption || answerData.answer
                    : undefined,
                answers:
              questionData.type === "fill_blank_blocks"
                    ? answerData.answers ||
                      (Array.isArray(answerData.answer)
                        ? answerData.answer
                        : undefined)
                    : undefined,
                isCorrect: answerData.isCorrect,
                answeredAt: answerData.answeredAt,
              }
            : null,
      createdAt: history.createdAt,
      question: history.question
        ? {
            id: history.question.id,
            type: history.question.type,
            prompt: history.question.prompt,
            config: history.question.config as any,
            imageUrl: history.question.imageUrl,
            imageAltText: history.question.imageAltText,
            timeLimitSeconds: history.question.timeLimitSeconds,
          }
        : null,
        };
      });

  return {
    ...attempt,
    verified: true, // All passed attempts are automatically verified
    questionHistory: transformedHistory,
  };
}

/**
 * Get recent applications (passed verification attempts) for dashboard table
 * Includes job title by joining with jobs table
 */
export async function getRecentApplicationsForTeam(
  teamId: number,
  limit: number = 10
) {
  return await db
    .select({
      id: verificationAttempts.id,
      email: verificationAttempts.email,
      jobTitle: jobs.title,
      score: verificationAttempts.score,
      passed: verificationAttempts.passed,
      completedAt: verificationAttempts.completedAt,
    })
    .from(verificationAttempts)
    .innerJoin(jobs, eq(verificationAttempts.jobId, jobs.id))
    .where(
      and(
        eq(verificationAttempts.teamId, teamId),
        eq(verificationAttempts.passed, true),
        isNotNull(verificationAttempts.completedAt)
      )
    )
    .orderBy(desc(verificationAttempts.completedAt))
    .limit(limit);
}

/**
 * Get all applications (passed verification attempts) for a specific email address within a team
 * Returns applications with job information
 * All results have verified: true (all passed attempts are automatically verified)
 */
export async function getApplicationsByEmail(email: string, teamId: number) {
  const attempts = await db.query.verificationAttempts.findMany({
    where: (attempts, { eq, and, isNotNull }) =>
      and(
        eq(attempts.email, email),
        eq(attempts.teamId, teamId),
        eq(attempts.passed, true),
        isNotNull(attempts.completedAt)
      ),
    with: {
      job: {
        columns: {
          id: true,
          title: true,
          externalJobId: true,
          status: true,
        },
      },
    },
    orderBy: (attempts, { desc }) => [desc(attempts.completedAt)],
  });

  // Add verified: true to all results
  return attempts.map((attempt) => ({
    ...attempt,
    verified: true,
  }));
}
