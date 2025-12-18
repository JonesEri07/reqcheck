import {
  eq,
  and,
  desc,
  asc,
  or,
  ilike,
  notInArray,
  inArray,
  count,
} from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  clientSkills,
  clientChallengeQuestions,
  challengeQuestions,
  skillTaxonomy,
  jobSkills,
  tags,
} from "@/lib/db/schema";
import type { InferSelectModel } from "drizzle-orm";

export type QuestionWithTags = InferSelectModel<
  typeof clientChallengeQuestions
> & {
  tags: Array<InferSelectModel<typeof tags>>;
};

export async function getClientSkillsForTeam(teamId: number) {
  return await db
    .select()
    .from(clientSkills)
    .where(eq(clientSkills.teamId, teamId))
    .orderBy(desc(clientSkills.createdAt));
}

export async function getClientSkillById(skillId: string, teamId: number) {
  const result = await db
    .select()
    .from(clientSkills)
    .where(and(eq(clientSkills.id, skillId), eq(clientSkills.teamId, teamId)))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function getChallengeQuestionsForSkill(
  skillId: string,
  teamId: number
): Promise<QuestionWithTags[]> {
  const questions = await db.query.clientChallengeQuestions.findMany({
    where: (questions, { eq, and }) =>
      and(eq(questions.clientSkillId, skillId), eq(questions.teamId, teamId)),
    with: {
      tags: {
        with: {
          tag: true,
        },
      },
    },
    orderBy: (questions, { desc }) => [desc(questions.createdAt)],
  });

  // Transform to include tags array and flatten structure
  // The relation 'tags' refers to clientChallengeQuestionTags join table
  // Each item has a 'tag' property that contains the actual tag
  return questions.map((q) => ({
    ...q,
    tags: (q.tags || [])
      .map((cqt) => cqt.tag)
      .filter((tag): tag is NonNullable<typeof tag> => tag !== null),
  })) as QuestionWithTags[];
}

export async function getChallengeQuestionById(
  questionId: string,
  skillId: string,
  teamId: number
): Promise<QuestionWithTags | null> {
  const question = await db.query.clientChallengeQuestions.findFirst({
    where: (questions, { eq, and }) =>
      and(
        eq(questions.id, questionId),
        eq(questions.clientSkillId, skillId),
        eq(questions.teamId, teamId)
      ),
    with: {
      tags: {
        with: {
          tag: true,
        },
      },
    },
  });

  if (!question) {
    return null;
  }

  return {
    ...question,
    tags: (question.tags || [])
      .map((cqt) => cqt.tag)
      .filter((tag): tag is NonNullable<typeof tag> => tag !== null),
  } as QuestionWithTags;
}

/**
 * Get application history for a challenge question
 */
export async function getQuestionApplicationHistory(questionId: string) {
  const history = await db.query.applicationQuestionHistory.findMany({
    where: (history, { eq }) => eq(history.questionId, questionId),
    with: {
      application: {
        with: {
          job: true,
        },
      },
    },
    orderBy: (history, { desc }) => [desc(history.createdAt)],
    limit: 100, // Limit to most recent 100
  });

  return history;
}

/**
 * Get job associations for a challenge question (via jobSkillQuestionWeights)
 */
export async function getQuestionJobAssociations(
  questionId: string,
  teamId: number
) {
  const weights = await db.query.jobSkillQuestionWeights.findMany({
    where: (weights, { eq }) =>
      eq(weights.clientChallengeQuestionId, questionId),
    with: {
      jobSkill: {
        with: {
          job: true,
          clientSkill: true,
        },
      },
    },
  });

  // Filter to only include jobs from this team
  return weights.filter(
    (w) => w.jobSkill?.job !== null && w.jobSkill.job.teamId === teamId
  );
}

/**
 * Get application history for all questions in a skill
 */
export async function getSkillApplicationHistory(skillId: string) {
  const history = await db.query.applicationQuestionHistory.findMany({
    where: (history, { eq }) => eq(history.clientSkillId, skillId),
    with: {
      application: {
        with: {
          job: true,
        },
      },
      question: {
        columns: {
          id: true,
        },
      },
    },
    orderBy: (history, { desc }) => [desc(history.createdAt)],
    limit: 500, // Limit to most recent 500
  });

  return history;
}

/**
 * Get job associations for a skill (via jobSkills)
 */
export async function getSkillJobAssociations(skillId: string, teamId: number) {
  const jobSkills = await db.query.jobSkills.findMany({
    where: (jobSkills, { eq }) => eq(jobSkills.clientSkillId, skillId),
    with: {
      job: true,
      clientSkill: true,
    },
  });

  // Filter to only include jobs from this team and transform to match expected structure
  return jobSkills
    .filter((js) => js.job !== null && js.job.teamId === teamId)
    .map((js) => ({
      id: js.id,
      weight: js.weight?.toString() || "1.0",
      source: js.manuallyAdded ? "manual" : "auto",
      job: js.job,
    }));
}

export async function getSkillWithQuestions(skillId: string, teamId: number) {
  const skill = await getClientSkillById(skillId, teamId);
  if (!skill) {
    return null;
  }

  const questions = await getChallengeQuestionsForSkill(skillId, teamId);

  return {
    ...skill,
    questions,
  };
}

/**
 * Get all global skills (skillTaxonomy) with optional filtering
 * All skills in skillTaxonomy are considered curated (promoted from promotionalSkills)
 */
export async function getGlobalSkills(options?: {
  search?: string;
  limit?: number;
  excludeClientSkillIds?: string[];
}) {
  const conditions = [];

  if (options?.search) {
    conditions.push(
      or(
        ilike(skillTaxonomy.skillName, `%${options.search}%`),
        ilike(
          skillTaxonomy.skillNormalized,
          `%${options.search.toLowerCase()}%`
        )
      )!
    );
  }

  const baseQuery = db.select().from(skillTaxonomy);
  const queryWithWhere =
    conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

  const queryWithLimit = options?.limit
    ? queryWithWhere.limit(options.limit)
    : queryWithWhere;

  return await queryWithLimit.orderBy(asc(skillTaxonomy.skillName));
}

/**
 * Get global skills that are NOT in the client library
 */
export async function getAvailableGlobalSkills(
  teamId: number,
  options?: {
    search?: string;
    limit?: number;
  }
) {
  // Get all client skill taxonomy IDs for this team
  const clientSkillTaxonomyIds = await db
    .select({ skillTaxonomyId: clientSkills.skillTaxonomyId })
    .from(clientSkills)
    .where(eq(clientSkills.teamId, teamId));

  const taxonomyIds = clientSkillTaxonomyIds
    .map((s) => s.skillTaxonomyId)
    .filter((id): id is string => id !== null);

  // Get global skills excluding those already in client library
  // All skills in skillTaxonomy are considered curated (promoted from promotionalSkills)
  const conditions = [];

  if (taxonomyIds.length > 0) {
    conditions.push(notInArray(skillTaxonomy.id, taxonomyIds));
  }

  if (options?.search) {
    conditions.push(
      or(
        ilike(skillTaxonomy.skillName, `%${options.search}%`),
        ilike(
          skillTaxonomy.skillNormalized,
          `%${options.search.toLowerCase()}%`
        )
      )!
    );
  }

  const baseQuery = db.select().from(skillTaxonomy);
  const queryWithWhere =
    conditions.length > 0 ? baseQuery.where(and(...conditions)) : baseQuery;

  const queryWithLimit = options?.limit
    ? queryWithWhere.limit(options.limit)
    : queryWithWhere;

  return await queryWithLimit.orderBy(asc(skillTaxonomy.skillName));
}

/**
 * Get client skills with their linked global skill info and counts
 */
export async function getClientSkillsWithGlobal(teamId: number) {
  const skills = await db.query.clientSkills.findMany({
    where: eq(clientSkills.teamId, teamId),
    with: {
      skillTaxonomy: true,
      category: true,
    },
    orderBy: (clientSkills, { asc }) => [asc(clientSkills.skillName)],
  });

  // Get counts for each skill
  const skillsWithCounts = await Promise.all(
    skills.map(async (skill) => {
      const [jobCountResult, questionCountResult] = await Promise.all([
        db
          .select({ count: count() })
          .from(jobSkills)
          .where(eq(jobSkills.clientSkillId, skill.id)),
        db
          .select({ count: count() })
          .from(clientChallengeQuestions)
          .where(eq(clientChallengeQuestions.clientSkillId, skill.id)),
      ]);

      return {
        ...skill,
        jobCount: jobCountResult[0]?.count ?? 0,
        challengeQuestionCount: questionCountResult[0]?.count ?? 0,
      };
    })
  );

  // Sort alphabetically by skill name after adding counts
  skillsWithCounts.sort((a, b) => a.skillName.localeCompare(b.skillName));

  return skillsWithCounts;
}

/**
 * Get global challenge questions for a skill taxonomy
 */
export async function getGlobalChallengeQuestionsForSkill(
  skillTaxonomyId: string
) {
  return await db
    .select()
    .from(challengeQuestions)
    .where(eq(challengeQuestions.skillTaxonomyId, skillTaxonomyId))
    .orderBy(desc(challengeQuestions.createdAt));
}
