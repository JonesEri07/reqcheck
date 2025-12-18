import { db } from "@/lib/db/drizzle";
import {
  jobs,
  jobSkills,
  jobSkillQuestionWeights,
  JobStatus,
  JobSource,
  SyncBehavior,
} from "@/lib/db/schema";
import { eq, and, inArray } from "drizzle-orm";
import { fetchGreenhouseJobs, type GreenhouseJob } from "./client";
import { applyPostFetchFilters } from "./filters";
import type {
  GreenhouseConfig,
  PostFetchFilter,
} from "@/lib/integrations/types";
import { autoDetectJobSkillsAndWeights } from "@/lib/jobs/auto-detect";
import type { ClientSkill } from "@/lib/jobs/auto-detect";
import type { QuestionWithTags } from "@/lib/skills/queries";
import { getClientSkillsForTeam } from "@/lib/skills/queries";
import { getChallengeQuestionsForSkill } from "@/lib/skills/queries";

/**
 * Decode HTML entities in a string (server-side compatible)
 * Converts entities like &amp;lt; to <, &amp;gt; to >, etc.
 * Handles nested entities like &amp;lt; which becomes <
 */
function decodeHtmlEntities(text: string): string {
  if (!text) return text;

  // Handle nested entities by decoding multiple times until no more changes
  // Example: &amp;lt; -> &lt; -> <
  let decoded = text;
  let previous = "";

  while (decoded !== previous) {
    previous = decoded;

    // Decode numeric entities first (decimal and hex)
    decoded = decoded.replace(/&#(\d+);/g, (_, num) =>
      String.fromCharCode(parseInt(num, 10))
    );
    decoded = decoded.replace(/&#x([0-9a-fA-F]+);/gi, (_, hex) =>
      String.fromCharCode(parseInt(hex, 16))
    );

    // Decode named entities - must decode &amp; first since other entities may contain it
    decoded = decoded
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
      .replace(/&#39;/g, "'")
      .replace(/&nbsp;/g, " ");
  }

  return decoded;
}

/**
 * Strip all HTML tags from text, preserving text content
 * This prevents HTML tags from interfering with skill detection
 */
function stripHtmlTags(text: string): string {
  if (!text) return text;

  // Remove all HTML tags, including self-closing tags
  // This regex matches < followed by any characters until >
  let stripped = text.replace(/<[^>]*>/g, "");

  // Also handle HTML comments
  stripped = stripped.replace(/<!--[\s\S]*?-->/g, "");

  // Clean up multiple whitespace characters
  stripped = stripped.replace(/\s+/g, " ").trim();

  return stripped;
}

/**
 * Sync Greenhouse jobs to database
 */
export async function syncGreenhouseJobs(
  teamId: number,
  config: GreenhouseConfig,
  tagMatchWeight: number,
  tagNoMatchWeight: number
): Promise<{
  success: boolean;
  jobsCreated: number;
  jobsUpdated: number;
  jobsSkipped: number;
  error?: string;
}> {
  try {
    // 1. Fetch jobs from Greenhouse
    const greenhouseJobs = await fetchGreenhouseJobs(config.boardToken);

    // 2. Get available skills and questions for filtering and auto-detect
    const availableSkills = await getClientSkillsForTeam(teamId);
    const allQuestionsMap = new Map<string, QuestionWithTags[]>();
    for (const skill of availableSkills) {
      const questions = await getChallengeQuestionsForSkill(skill.id, teamId);
      allQuestionsMap.set(skill.id, questions);
    }

    // 3. Apply post-fetch filters
    const filteredJobs = applyPostFetchFilters(
      greenhouseJobs,
      config.postFetchFilters || [],
      availableSkills
    );

    let jobsCreated = 0;
    let jobsUpdated = 0;
    let jobsSkipped = 0;

    // 4. Process each filtered job
    for (const greenhouseJob of filteredJobs) {
      const externalJobId = String(greenhouseJob.id);

      // Check if job already exists
      const existingJob = await db
        .select()
        .from(jobs)
        .where(
          and(
            eq(jobs.teamId, teamId),
            eq(jobs.externalJobId, externalJobId),
            eq(jobs.source, JobSource.GREENHOUSE)
          )
        )
        .limit(1);

      if (existingJob.length === 0) {
        // New job - create with auto-detect
        await createJobWithAutoDetect(
          teamId,
          greenhouseJob,
          availableSkills,
          allQuestionsMap,
          tagMatchWeight,
          tagNoMatchWeight
        );
        jobsCreated++;
      } else {
        // Existing job - update based on syncBehavior
        const job = existingJob[0];
        await updateExistingJob(
          job.id,
          greenhouseJob,
          config.syncBehavior,
          availableSkills,
          allQuestionsMap,
          tagMatchWeight,
          tagNoMatchWeight
        );
        jobsUpdated++;
      }
    }

    return {
      success: true,
      jobsCreated,
      jobsUpdated,
      jobsSkipped,
    };
  } catch (error: any) {
    console.error("Greenhouse sync error:", error);
    return {
      success: false,
      jobsCreated: 0,
      jobsUpdated: 0,
      jobsSkipped: 0,
      error: error.message || "Sync failed",
    };
  }
}

/**
 * Create a new job with auto-detected skills
 */
async function createJobWithAutoDetect(
  teamId: number,
  greenhouseJob: GreenhouseJob,
  availableSkills: ClientSkill[],
  allQuestions: Map<string, QuestionWithTags[]>,
  tagMatchWeight: number,
  tagNoMatchWeight: number
) {
  // Decode HTML entities and strip HTML tags
  const decodedContent = greenhouseJob.content
    ? stripHtmlTags(decodeHtmlEntities(greenhouseJob.content))
    : null;

  // Run auto-detect
  const detected = autoDetectJobSkillsAndWeights(
    greenhouseJob.title,
    greenhouseJob.content || "",
    availableSkills,
    allQuestions,
    tagMatchWeight,
    tagNoMatchWeight
  );

  // Create job
  const [newJob] = await db
    .insert(jobs)
    .values({
      teamId,
      externalJobId: String(greenhouseJob.id),
      title: greenhouseJob.title,
      description: decodedContent,
      status: JobStatus.OPEN,
      source: JobSource.GREENHOUSE,
    })
    .returning();

  // Create job skills
  if (detected.jobSkills.length > 0) {
    await db.insert(jobSkills).values(
      detected.jobSkills.map((js) => ({
        jobId: newJob.id,
        clientSkillId: js.clientSkillId,
        skillName: js.skillName,
        weight: String(js.weight),
        required: js.required,
        manuallyAdded: js.manuallyAdded,
      }))
    );

    // Get the created job skills to map question weights
    const createdJobSkills = await db
      .select()
      .from(jobSkills)
      .where(eq(jobSkills.jobId, newJob.id));

    const jobSkillMap = new Map(
      createdJobSkills.map((js) => [js.clientSkillId, js.id])
    );

    // Create question weights
    if (detected.questionWeights.length > 0) {
      await db.insert(jobSkillQuestionWeights).values(
        detected.questionWeights
          .map((qw) => {
            const jobSkillId = jobSkillMap.get(qw.clientSkillId);
            if (!jobSkillId) return null;
            return {
              jobSkillId,
              clientChallengeQuestionId: qw.clientChallengeQuestionId,
              weight: String(qw.weight),
              source: "auto",
            };
          })
          .filter((qw): qw is NonNullable<typeof qw> => qw !== null)
      );
    }
  }
}

/**
 * Update an existing job based on syncBehavior
 */
async function updateExistingJob(
  jobId: string,
  greenhouseJob: GreenhouseJob,
  syncBehavior: SyncBehavior,
  availableSkills: ClientSkill[],
  allQuestions: Map<string, QuestionWithTags[]>,
  tagMatchWeight: number,
  tagNoMatchWeight: number
) {
  // Decode HTML entities and strip HTML tags
  const decodedContent = greenhouseJob.content
    ? stripHtmlTags(decodeHtmlEntities(greenhouseJob.content))
    : null;

  // Update job title and description, mark as active
  await db
    .update(jobs)
    .set({
      title: greenhouseJob.title,
      description: decodedContent,
      status: JobStatus.OPEN,
      updatedAt: new Date(),
    })
    .where(eq(jobs.id, jobId));

  // Get current job skills
  const currentJobSkills = await db
    .select()
    .from(jobSkills)
    .where(eq(jobSkills.jobId, jobId));

  // Run auto-detect
  const detected = autoDetectJobSkillsAndWeights(
    greenhouseJob.title,
    greenhouseJob.content || "",
    availableSkills,
    allQuestions,
    tagMatchWeight,
    tagNoMatchWeight
  );

  // Apply syncBehavior
  switch (syncBehavior) {
    case SyncBehavior.REPLACE_ALL:
      // Remove all current job skills and question weights
      const jobSkillIds = currentJobSkills.map((js) => js.id);
      if (jobSkillIds.length > 0) {
        // Delete all question weights for this job's skills
        await db
          .delete(jobSkillQuestionWeights)
          .where(inArray(jobSkillQuestionWeights.jobSkillId, jobSkillIds));
      }

      // Delete all job skills
      await db.delete(jobSkills).where(eq(jobSkills.jobId, jobId));

      // Create new job skills and weights
      if (detected.jobSkills.length > 0) {
        await db.insert(jobSkills).values(
          detected.jobSkills.map((js) => ({
            jobId,
            clientSkillId: js.clientSkillId,
            skillName: js.skillName,
            weight: String(js.weight),
            required: js.required,
            manuallyAdded: js.manuallyAdded,
          }))
        );

        // Get created job skills and create question weights
        const createdJobSkills = await db
          .select()
          .from(jobSkills)
          .where(eq(jobSkills.jobId, jobId));

        const jobSkillMap = new Map(
          createdJobSkills.map((js) => [js.clientSkillId, js.id])
        );

        if (detected.questionWeights.length > 0) {
          await db.insert(jobSkillQuestionWeights).values(
            detected.questionWeights
              .map((qw) => {
                const jobSkillId = jobSkillMap.get(qw.clientSkillId);
                if (!jobSkillId) return null;
                return {
                  jobSkillId,
                  clientChallengeQuestionId: qw.clientChallengeQuestionId,
                  weight: String(qw.weight),
                  source: "auto",
                };
              })
              .filter((qw): qw is NonNullable<typeof qw> => qw !== null)
          );
        }
      }
      break;

    case SyncBehavior.KEEP_MANUAL:
      // Remove all non-manual job skills and their question weights
      const nonManualJobSkills = currentJobSkills.filter(
        (js) => !js.manuallyAdded
      );
      const nonManualJobSkillIds = nonManualJobSkills.map((js) => js.id);

      if (nonManualJobSkillIds.length > 0) {
        // Delete question weights for non-manual skills
        await db
          .delete(jobSkillQuestionWeights)
          .where(
            inArray(jobSkillQuestionWeights.jobSkillId, nonManualJobSkillIds)
          );

        // Delete non-manual job skills
        await db
          .delete(jobSkills)
          .where(inArray(jobSkills.id, nonManualJobSkillIds));
      }

      // Get existing skill IDs to ignore
      const existingSkillIds = new Set(
        currentJobSkills.map((js) => js.clientSkillId)
      );

      // Run auto-detect and only add new skills
      const newSkills = detected.jobSkills.filter(
        (js) => !existingSkillIds.has(js.clientSkillId)
      );

      if (newSkills.length > 0) {
        await db.insert(jobSkills).values(
          newSkills.map((js) => ({
            jobId,
            clientSkillId: js.clientSkillId,
            skillName: js.skillName,
            weight: String(js.weight),
            required: js.required,
            manuallyAdded: js.manuallyAdded,
          }))
        );

        // Create question weights for new skills
        const createdJobSkills = await db
          .select()
          .from(jobSkills)
          .where(eq(jobSkills.jobId, jobId));

        const jobSkillMap = new Map(
          createdJobSkills.map((js) => [js.clientSkillId, js.id])
        );

        const newQuestionWeights = detected.questionWeights.filter(
          (qw) => !existingSkillIds.has(qw.clientSkillId)
        );

        if (newQuestionWeights.length > 0) {
          await db.insert(jobSkillQuestionWeights).values(
            newQuestionWeights
              .map((qw) => {
                const jobSkillId = jobSkillMap.get(qw.clientSkillId);
                if (!jobSkillId) return null;
                return {
                  jobSkillId,
                  clientChallengeQuestionId: qw.clientChallengeQuestionId,
                  weight: String(qw.weight),
                  source: "auto",
                };
              })
              .filter((qw): qw is NonNullable<typeof qw> => qw !== null)
          );
        }
      }
      break;

    case SyncBehavior.SMART:
      // Keep all current job skills and question weights
      // Run auto-detect
      const currentSkillIds = new Set(
        currentJobSkills.map((js) => js.clientSkillId)
      );
      const manualSkillIds = new Set(
        currentJobSkills
          .filter((js) => js.manuallyAdded)
          .map((js) => js.clientSkillId)
      );

      // Add new skills not already present
      const skillsToAdd = detected.jobSkills.filter(
        (js) => !currentSkillIds.has(js.clientSkillId)
      );

      if (skillsToAdd.length > 0) {
        await db.insert(jobSkills).values(
          skillsToAdd.map((js) => ({
            jobId,
            clientSkillId: js.clientSkillId,
            skillName: js.skillName,
            weight: String(js.weight),
            required: js.required,
            manuallyAdded: js.manuallyAdded,
          }))
        );

        // Create question weights for new skills
        const createdJobSkills = await db
          .select()
          .from(jobSkills)
          .where(eq(jobSkills.jobId, jobId));

        const jobSkillMap = new Map(
          createdJobSkills.map((js) => [js.clientSkillId, js.id])
        );

        const newQuestionWeights = detected.questionWeights.filter(
          (qw) => !currentSkillIds.has(qw.clientSkillId)
        );

        if (newQuestionWeights.length > 0) {
          await db.insert(jobSkillQuestionWeights).values(
            newQuestionWeights
              .map((qw) => {
                const jobSkillId = jobSkillMap.get(qw.clientSkillId);
                if (!jobSkillId) return null;
                return {
                  jobSkillId,
                  clientChallengeQuestionId: qw.clientChallengeQuestionId,
                  weight: String(qw.weight),
                  source: "auto",
                };
              })
              .filter((qw): qw is NonNullable<typeof qw> => qw !== null)
          );
        }
      }

      // Remove non-manual skills that are not detected
      const detectedSkillIds = new Set(
        detected.jobSkills.map((js) => js.clientSkillId)
      );
      const skillsToRemove = currentJobSkills.filter(
        (js) => !js.manuallyAdded && !detectedSkillIds.has(js.clientSkillId)
      );

      for (const skillToRemove of skillsToRemove) {
        // Delete question weights
        await db
          .delete(jobSkillQuestionWeights)
          .where(eq(jobSkillQuestionWeights.jobSkillId, skillToRemove.id));
        // Delete job skill
        await db.delete(jobSkills).where(eq(jobSkills.id, skillToRemove.id));
      }
      break;
  }
}
