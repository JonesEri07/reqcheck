"use server";

import { z } from "zod";
import { eq, and, count } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  jobs,
  jobSkills,
  jobSkillQuestionWeights,
  teams,
  type NewJob,
  JobSource,
  JobStatus,
} from "@/lib/db/schema";
import { validatedActionWithUser, type ActionState } from "@/lib/auth/proxy";
import { getTeamForUser } from "@/lib/db/queries";
import { getJobLimit, hasReachedJobLimit } from "@/lib/constants/tier-limits";
import { PlanName } from "@/lib/db/schema";
import {
  getClientSkillsForTeam,
  getChallengeQuestionsForSkill,
} from "@/lib/skills/queries";
import { autoDetectJobSkillsAndWeights } from "@/lib/jobs/auto-detect";

const jobSkillSchema = z.object({
  clientSkillId: z.string().uuid(),
  weight: z.number().min(0.5).max(3.0),
  required: z.boolean().default(true),
  manuallyAdded: z.boolean().default(false),
});

const questionWeightSchema = z.object({
  clientSkillId: z.string().uuid(),
  clientChallengeQuestionId: z.string().uuid(),
  weight: z.number().min(0).max(10),
  timeLimitSeconds: z.number().int().positive().max(3600).nullable().optional(),
});

const createJobSchema = z.object({
  externalJobId: z.string().min(1).max(255),
  title: z.string().min(1).max(255),
  description: z
    .string()
    .max(50000, "Job description cannot exceed 50000 characters")
    .optional(),
  passThreshold: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null))
    .pipe(z.number().int().min(0).max(100).nullable().optional()),
  questionCountType: z.enum(["fixed", "skillCount", "teamDefault"]).optional(),
  questionCountValue: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : null)),
  questionCountMultiplier: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : null)),
  questionCountMaxLimit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null)),
  jobSkills: z
    .string()
    .optional()
    .transform((val) => (val ? JSON.parse(val) : []))
    .pipe(z.array(jobSkillSchema).default([])),
  questionWeights: z
    .string()
    .optional()
    .transform((val) => (val ? JSON.parse(val) : []))
    .pipe(z.array(questionWeightSchema).default([])),
});

const updateJobSchema = createJobSchema.partial().extend({
  id: z.string().uuid(),
});

export const createJob = validatedActionWithUser(
  createJobSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Check job limit
    const planName = (team.planName as PlanName) || PlanName.BASIC;
    const currentJobCount = await db
      .select({ count: count() })
      .from(jobs)
      .where(eq(jobs.teamId, team.id));

    const totalJobs = currentJobCount[0]?.count || 0;
    if (hasReachedJobLimit(totalJobs, planName)) {
      const limit = getJobLimit(planName);
      return {
        error: `You've reached the maximum of ${limit} jobs for your ${planName} plan. Upgrade to create more jobs.`,
      } as ActionState;
    }

    // Create job
    const newJob: NewJob = {
      teamId: team.id,
      externalJobId: data.externalJobId,
      title: data.title,
      description: data.description || null,
      passThreshold: data.passThreshold ?? null,
      questionCount: (() => {
        // If teamDefault, set to null (will use team default)
        if (
          data.questionCountType === "teamDefault" ||
          !data.questionCountType
        ) {
          return null;
        }

        if (data.questionCountType === "fixed") {
          const value = data.questionCountValue;
          if (!value || value < 1 || value > 100) {
            return null; // Invalid, will use team default
          }
          return { type: "fixed", value: Math.round(value) } as any;
        }

        if (data.questionCountType === "skillCount") {
          const multiplier = data.questionCountMultiplier ?? 1.5;
          const maxLimit = data.questionCountMaxLimit ?? 50;
          if (multiplier < 1 || maxLimit < 1 || maxLimit > 100) {
            return null; // Invalid, will use team default
          }
          return { type: "skillCount", multiplier, maxLimit } as any;
        }

        return null;
      })(),
      source: JobSource.MANUAL,
    };

    const [createdJob] = await db.insert(jobs).values(newJob).returning();

    // Create job skills
    const skillIdToJobSkillId = new Map<string, string>();
    if (data.jobSkills.length > 0) {
      const jobSkillsToInsert = data.jobSkills.map((js) => ({
        jobId: createdJob.id,
        clientSkillId: js.clientSkillId,
        weight: js.weight.toString(),
        required: js.required,
        manuallyAdded: js.manuallyAdded,
      }));

      const insertedJobSkills = await db
        .insert(jobSkills)
        .values(jobSkillsToInsert)
        .returning();

      // Map clientSkillId to jobSkillId
      insertedJobSkills.forEach((js) => {
        skillIdToJobSkillId.set(js.clientSkillId, js.id);
      });
    }

    // Create question weights
    if (data.questionWeights.length > 0) {
      const questionWeightsToInsert = data.questionWeights
        .filter((qw) => skillIdToJobSkillId.has(qw.clientSkillId))
        .map((qw) => ({
          jobSkillId: skillIdToJobSkillId.get(qw.clientSkillId)!,
          clientChallengeQuestionId: qw.clientChallengeQuestionId,
          weight: qw.weight.toString(),
          timeLimitSeconds: qw.timeLimitSeconds ?? null,
          source: "manual" as const,
        }));

      if (questionWeightsToInsert.length > 0) {
        await db
          .insert(jobSkillQuestionWeights)
          .values(questionWeightsToInsert);
      }
    }

    return {
      success: "Job created successfully",
      jobId: createdJob.id,
    } as ActionState;
  }
);

export const autoDetectJobSkills = validatedActionWithUser(
  z.object({
    title: z.string().min(1).max(255),
    description: z.string().max(50000).optional(),
  }),
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Get team settings for weights
    const teamRecord = await db.query.teams.findFirst({
      where: eq(teams.id, team.id),
    });

    if (!teamRecord) {
      return { error: "Team not found" } as ActionState;
    }

    const tagMatchWeight = parseFloat(teamRecord.tagMatchWeight || "1.5");
    const tagNoMatchWeight = parseFloat(teamRecord.tagNoMatchWeight || "1.0");

    // Get all available skills
    const availableSkills = await getClientSkillsForTeam(team.id);

    // Get all questions for all skills
    const allQuestionsMap = new Map<
      string,
      Awaited<ReturnType<typeof getChallengeQuestionsForSkill>>
    >();
    for (const skill of availableSkills) {
      const questions = await getChallengeQuestionsForSkill(skill.id, team.id);
      allQuestionsMap.set(skill.id, questions);
    }

    // Run auto-detection
    const detected = autoDetectJobSkillsAndWeights(
      data.title,
      data.description || "",
      availableSkills,
      allQuestionsMap,
      tagMatchWeight,
      tagNoMatchWeight
    );

    return {
      success: "Skills detected successfully",
      jobSkills: detected.jobSkills,
      questionWeights: detected.questionWeights,
    } as ActionState;
  }
);

export const updateJob = validatedActionWithUser(
  updateJobSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    const {
      id,
      jobSkills: jobSkillsData,
      questionWeights: questionWeightsData,
      ...updateData
    } = data;

    // Verify job belongs to team and get current job data
    const existingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, id), eq(jobs.teamId, team.id)))
      .limit(1);

    if (existingJob.length === 0) {
      return { error: "Job not found" } as ActionState;
    }

    const currentJob = existingJob[0];

    // Remove view-only fields from updateData
    // External Job ID is always view-only in edit mode
    delete updateData.externalJobId;

    // Title and description are view-only if source is not MANUAL
    if (currentJob.source !== JobSource.MANUAL) {
      delete updateData.title;
      delete updateData.description;
    }

    // Clean up updateData - remove undefined values
    const cleanedUpdateData: Record<string, any> = {};
    Object.keys(updateData).forEach((key) => {
      if (updateData[key as keyof typeof updateData] !== undefined) {
        cleanedUpdateData[key] = updateData[key as keyof typeof updateData];
      }
    });

    // Update job basic fields only if there's something to update
    if (Object.keys(cleanedUpdateData).length > 0) {
      await db
        .update(jobs)
        .set({
          ...cleanedUpdateData,
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, id));
    } else {
      // Still update the updatedAt timestamp
      await db
        .update(jobs)
        .set({
          updatedAt: new Date(),
        })
        .where(eq(jobs.id, id));
    }

    // Update job skills and question weights only if explicitly provided
    // jobSkills and questionWeights are always provided together from the form
    if (jobSkillsData !== undefined && questionWeightsData !== undefined) {
      // Get existing job skills
      const existingJobSkills = await db
        .select()
        .from(jobSkills)
        .where(eq(jobSkills.jobId, id));

      // Delete all existing job skills (cascade will delete question weights)
      if (existingJobSkills.length > 0) {
        await db.delete(jobSkills).where(eq(jobSkills.jobId, id));
      }

      // Insert new job skills if provided
      if (jobSkillsData.length > 0) {
        const jobSkillsToInsert = jobSkillsData.map((js) => ({
          jobId: id,
          clientSkillId: js.clientSkillId,
          weight: js.weight.toString(),
          required: js.required,
          manuallyAdded: js.manuallyAdded,
        }));

        const insertedJobSkills = await db
          .insert(jobSkills)
          .values(jobSkillsToInsert)
          .returning();

        // Map clientSkillId to jobSkillId
        const skillIdToJobSkillId = new Map<string, string>();
        insertedJobSkills.forEach((js) => {
          skillIdToJobSkillId.set(js.clientSkillId, js.id);
        });

        // Insert question weights if provided
        if (questionWeightsData.length > 0) {
          const questionWeightsToInsert = questionWeightsData
            .filter((qw) => skillIdToJobSkillId.has(qw.clientSkillId))
            .map((qw) => ({
              jobSkillId: skillIdToJobSkillId.get(qw.clientSkillId)!,
              clientChallengeQuestionId: qw.clientChallengeQuestionId,
              weight: qw.weight.toString(),
              timeLimitSeconds: qw.timeLimitSeconds ?? null,
              source: "manual" as const,
            }));

          if (questionWeightsToInsert.length > 0) {
            await db
              .insert(jobSkillQuestionWeights)
              .values(questionWeightsToInsert);
          }
        }
      }
    }

    return { success: "Job updated successfully" } as ActionState;
  }
);

export const updateJobStatus = validatedActionWithUser(
  z.object({
    id: z.string().uuid(),
    status: z.nativeEnum(JobStatus),
  }),
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify job belongs to team
    const existingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, data.id), eq(jobs.teamId, team.id)))
      .limit(1);

    if (existingJob.length === 0) {
      return { error: "Job not found" } as ActionState;
    }

    // If changing from ARCHIVED to another status, clear archivedAt
    const updateData: any = {
      status: data.status,
      updatedAt: new Date(),
    };

    if (
      existingJob[0].status === JobStatus.ARCHIVED &&
      data.status !== JobStatus.ARCHIVED
    ) {
      updateData.archivedAt = null;
    }

    await db.update(jobs).set(updateData).where(eq(jobs.id, data.id));

    return { success: "Job status updated successfully" } as ActionState;
  }
);

export const archiveJob = validatedActionWithUser(
  z.object({ id: z.string().uuid() }),
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify job belongs to team
    const existingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, data.id), eq(jobs.teamId, team.id)))
      .limit(1);

    if (existingJob.length === 0) {
      return { error: "Job not found" } as ActionState;
    }

    await db
      .update(jobs)
      .set({
        status: JobStatus.ARCHIVED,
        archivedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, data.id));

    return { success: "Job archived successfully" } as ActionState;
  }
);

export const unarchiveJob = validatedActionWithUser(
  z.object({ id: z.string().uuid() }),
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify job belongs to team
    const existingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, data.id), eq(jobs.teamId, team.id)))
      .limit(1);

    if (existingJob.length === 0) {
      return { error: "Job not found" } as ActionState;
    }

    await db
      .update(jobs)
      .set({
        status: JobStatus.OPEN,
        archivedAt: null,
        updatedAt: new Date(),
      })
      .where(eq(jobs.id, data.id));

    return { success: "Job unarchived successfully" } as ActionState;
  }
);

export const deleteJob = validatedActionWithUser(
  z.object({ id: z.string().uuid() }),
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify job belongs to team
    const existingJob = await db
      .select()
      .from(jobs)
      .where(and(eq(jobs.id, data.id), eq(jobs.teamId, team.id)))
      .limit(1);

    if (existingJob.length === 0) {
      return { error: "Job not found" } as ActionState;
    }

    await db.delete(jobs).where(eq(jobs.id, data.id));

    return { success: "Job deleted successfully" } as ActionState;
  }
);
