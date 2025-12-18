import { eq, and, isNull, ilike, or, asc } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { tags } from "@/lib/db/schema";

/**
 * Get all tags for a team (excluding deleted)
 */
export async function getTeamTags(
  teamId: number,
  options?: { search?: string }
) {
  const conditions = [eq(tags.teamId, teamId), isNull(tags.deletedAt)];

  if (options?.search) {
    conditions.push(
      or(
        ilike(tags.name, `%${options.search}%`),
        ilike(tags.slug, `%${options.search.toLowerCase()}%`)
      )!
    );
  }

  return await db
    .select()
    .from(tags)
    .where(and(...conditions))
    .orderBy(asc(tags.name));
}

/**
 * Get tags for a specific challenge question
 */
export async function getQuestionTags(questionId: string) {
  const questionTags = await db.query.clientChallengeQuestionTags.findMany({
    where: (cqt, { eq }) => eq(cqt.clientChallengeQuestionId, questionId),
    with: {
      tag: true,
    },
  });

  return questionTags
    .map((qt) => qt.tag)
    .filter((tag): tag is NonNullable<typeof tag> => tag !== null);
}

/**
 * Get tags available to add to a question (team tags not already on the question)
 */
export async function getAvailableTagsForQuestion(
  questionId: string,
  teamId: number
) {
  // Get tags already on the question
  const questionTags = await getQuestionTags(questionId);
  const questionTagIds = questionTags.map((tag) => tag.id);

  // Get all team tags
  const allTeamTags = await getTeamTags(teamId);

  // Filter out tags already on the question
  return allTeamTags.filter((tag) => !questionTagIds.includes(tag.id));
}

/**
 * Get tag by ID
 */
export async function getTagById(tagId: string, teamId: number) {
  const result = await db
    .select()
    .from(tags)
    .where(
      and(eq(tags.id, tagId), eq(tags.teamId, teamId), isNull(tags.deletedAt))
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get tag by slug (for uniqueness checking)
 */
export async function getTagBySlug(slug: string, teamId: number) {
  const result = await db
    .select()
    .from(tags)
    .where(
      and(eq(tags.slug, slug), eq(tags.teamId, teamId), isNull(tags.deletedAt))
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}
