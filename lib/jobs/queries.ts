import { eq, and, desc, count } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  applications,
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
      applications: {
        columns: {
          id: true,
        },
      },
    },
    orderBy: (jobs, { desc }) => [desc(jobs.createdAt)],
  });

  // Transform to include counts and skills
  const jobsWithCounts = jobsList.map((job) => ({
    ...job,
    applicationCount: job.applications?.length ?? 0,
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
