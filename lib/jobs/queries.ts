import { eq, and, desc, count, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  verificationAttempts,
  jobs,
  jobSkills,
  jobSkillQuestionWeights,
  clientSkills,
} from "@/lib/db/schema";

export type JobWithCounts = Awaited<ReturnType<typeof getJobsForTeam>>[0];

export async function getJobsForTeam(teamId: number) {
  const jobsList = await db.query.jobs.findMany({
    where: (jobs, { eq }) => eq(jobs.teamId, teamId),
    with: {
      jobSkills: {
        with: {
          clientSkill: true,
        },
      },
    },
    orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
  });

  // Get application counts for each job (passed verification attempts)
  const jobIds = jobsList.map((job) => job.id);
  const applicationCounts = new Map<string, number>();

  if (jobIds.length > 0) {
    const counts = await db
      .select({
        jobId: verificationAttempts.jobId,
        count: count(verificationAttempts.id),
      })
      .from(verificationAttempts)
      .where(
        and(
          eq(verificationAttempts.passed, true),
          isNotNull(verificationAttempts.completedAt)
        )
      )
      .groupBy(verificationAttempts.jobId);

    for (const count of counts) {
      applicationCounts.set(count.jobId, Number(count.count));
    }
  }

  // Transform to include counts and skills
  const jobsWithCounts = jobsList.map((job) => ({
    ...job,
    applicationCount: applicationCounts.get(job.id) ?? 0,
    skills: job.jobSkills
      .map((js) => {
        const clientSkill = js.clientSkill;
        if (!clientSkill) return null;
        return {
          id: clientSkill.id,
          skillName: clientSkill.skillName,
          iconSvg: clientSkill.iconSvg,
          weight: js.weight?.toString() || "1.0",
          required: js.required,
          manuallyAdded: js.manuallyAdded,
        };
      })
      .filter((skill): skill is NonNullable<typeof skill> => skill !== null),
  }));

  return jobsWithCounts;
}

export async function getJobById(jobId: string, teamId: number) {
  const result = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.id, jobId), eq(jobs.teamId, teamId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getJobWithSkills(jobId: string, teamId: number) {
  const job = await getJobById(jobId, teamId);
  if (!job) {
    return null;
  }

  const jobSkillsList = await db
    .select({
      jobSkill: jobSkills,
      clientSkill: clientSkills,
    })
    .from(jobSkills)
    .innerJoin(clientSkills, eq(jobSkills.clientSkillId, clientSkills.id))
    .where(eq(jobSkills.jobId, jobId));

  return {
    ...job,
    skills: jobSkillsList,
  };
}

/**
 * Get job with all skills and question weights for edit form
 */
export async function getJobWithSkillsAndQuestionWeights(
  jobId: string,
  teamId: number
) {
  const job = await getJobById(jobId, teamId);
  if (!job) {
    return null;
  }

  // Get all job skills with their client skills
  const jobSkillsList = await db
    .select({
      jobSkill: jobSkills,
      clientSkill: clientSkills,
    })
    .from(jobSkills)
    .innerJoin(clientSkills, eq(jobSkills.clientSkillId, clientSkills.id))
    .where(eq(jobSkills.jobId, jobId));

  // Get all question weights for this job by joining through jobSkills
  const questionWeightsList = await db
    .select({
      questionWeight: jobSkillQuestionWeights,
      jobSkillId: jobSkills.id,
    })
    .from(jobSkillQuestionWeights)
    .innerJoin(jobSkills, eq(jobSkillQuestionWeights.jobSkillId, jobSkills.id))
    .where(eq(jobSkills.jobId, jobId));

  // Group question weights by jobSkillId for easier lookup
  const questionWeightsByJobSkillId = new Map<
    string,
    Array<(typeof questionWeightsList)[0]["questionWeight"]>
  >();
  for (const item of questionWeightsList) {
    const existing = questionWeightsByJobSkillId.get(item.jobSkillId) || [];
    existing.push(item.questionWeight);
    questionWeightsByJobSkillId.set(item.jobSkillId, existing);
  }

  return {
    ...job,
    jobSkills: jobSkillsList.map((item) => ({
      jobSkill: item.jobSkill,
      clientSkill: item.clientSkill,
      questionWeights: questionWeightsByJobSkillId.get(item.jobSkill.id) || [],
    })),
  };
}

/**
 * Get job by external job ID and team ID
 * Used by widget API to find jobs by their external identifier
 */
export async function getJobByExternalId(
  externalJobId: string,
  teamId: number
) {
  const result = await db
    .select()
    .from(jobs)
    .where(and(eq(jobs.externalJobId, externalJobId), eq(jobs.teamId, teamId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
