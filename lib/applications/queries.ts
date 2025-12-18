import { eq, and, desc } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  applications,
  verificationAttempts,
  jobs,
  applicationQuestionHistory,
} from "@/lib/db/schema";

export async function getApplicationsForTeam(teamId: number) {
  return await db.query.applications.findMany({
    where: (applications, { eq }) => eq(applications.teamId, teamId),
    with: {
      job: {
        columns: {
          id: true,
          title: true,
          externalJobId: true,
        },
      },
    },
    orderBy: (applications, { desc }) => [desc(applications.createdAt)],
  });
}

export async function getApplicationById(
  applicationId: string,
  teamId: number
) {
  const result = await db
    .select()
    .from(applications)
    .where(
      and(eq(applications.id, applicationId), eq(applications.teamId, teamId))
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

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
    .from(applications)
    .where(eq(applications.jobId, jobId))
    .orderBy(desc(applications.createdAt));
}

export async function getApplicationWithAttempt(
  applicationId: string,
  teamId: number
) {
  const application = await getApplicationById(applicationId, teamId);
  if (!application) {
    return null;
  }

  const attempt = application.verificationAttemptId
    ? await db
        .select()
        .from(verificationAttempts)
        .where(eq(verificationAttempts.id, application.verificationAttemptId))
        .limit(1)
    : null;

  return {
    ...application,
    attempt: attempt && attempt.length > 0 ? attempt[0] : null,
  };
}

/**
 * Get application with job and question history
 */
export async function getApplicationWithDetails(
  applicationId: string,
  teamId: number
) {
  const application = await db.query.applications.findFirst({
    where: (applications, { eq, and }) =>
      and(eq(applications.id, applicationId), eq(applications.teamId, teamId)),
    with: {
      job: true,
      questionHistory: {
        orderBy: (history, { desc }) => [desc(history.createdAt)],
      },
    },
  });

  return application;
}

/**
 * Get recent applications for dashboard table
 * Includes job title by joining with jobs table
 */
export async function getRecentApplicationsForTeam(
  teamId: number,
  limit: number = 10
) {
  return await db
    .select({
      id: applications.id,
      email: applications.email,
      jobTitle: jobs.title,
      score: applications.score,
      passed: applications.passed,
      completedAt: applications.completedAt,
    })
    .from(applications)
    .innerJoin(jobs, eq(applications.jobId, jobs.id))
    .where(eq(applications.teamId, teamId))
    .orderBy(desc(applications.completedAt))
    .limit(limit);
}

/**
 * Get all applications for a specific email address within a team
 * Returns applications with job information
 */
export async function getApplicationsByEmail(email: string, teamId: number) {
  return await db.query.applications.findMany({
    where: (applications, { eq, and }) =>
      and(eq(applications.email, email), eq(applications.teamId, teamId)),
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
    orderBy: (applications, { desc }) => [desc(applications.createdAt)],
  });
}
