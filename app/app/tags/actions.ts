"use server";

import { z } from "zod";
import { eq, and, isNull, sql } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { tags, clientChallengeQuestionTags } from "@/lib/db/schema";
import { validatedActionWithUser, type ActionState } from "@/lib/auth/proxy";
import { getTeamForUser } from "@/lib/db/queries";
import { getTagBySlug } from "@/lib/tags/queries";

// Helper to create slug from name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

const createTagSchema = z.object({
  name: z.string().min(1).max(100, "Tag name cannot exceed 100 characters"),
  description: z.string().optional().nullable(),
  color: z.string().max(50).optional().nullable(),
});

const updateTagSchema = createTagSchema.extend({
  id: z.string().uuid(),
});

const deleteTagSchema = z.object({
  id: z.string().uuid(),
});

/**
 * Create a new tag
 */
export const createTag = validatedActionWithUser(
  createTagSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    const slug = createSlug(data.name);

    // Check if tag with this slug already exists
    const existingTag = await getTagBySlug(slug, team.id);
    if (existingTag) {
      return {
        error: "A tag with this name already exists",
        fieldErrors: {
          name: "A tag with this name already exists",
        },
      } as ActionState;
    }

    const [createdTag] = await db
      .insert(tags)
      .values({
        teamId: team.id,
        name: data.name,
        slug: slug,
        description: data.description || null,
        color: data.color || null,
      })
      .returning();

    return {
      success: "Tag created successfully",
      tagId: createdTag.id,
    } as ActionState;
  }
);

/**
 * Update a tag
 */
export const updateTag = validatedActionWithUser(
  updateTagSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify tag belongs to team
    const existingTag = await db
      .select()
      .from(tags)
      .where(
        and(
          eq(tags.id, data.id),
          eq(tags.teamId, team.id),
          isNull(tags.deletedAt)
        )
      )
      .limit(1);

    if (existingTag.length === 0) {
      return { error: "Tag not found" } as ActionState;
    }

    // If name changed, check for slug conflicts
    if (data.name !== existingTag[0].name) {
      const slug = createSlug(data.name);
      const conflictingTag = await getTagBySlug(slug, team.id);
      if (conflictingTag && conflictingTag.id !== data.id) {
        return {
          error: "A tag with this name already exists",
          fieldErrors: {
            name: "A tag with this name already exists",
          },
        } as ActionState;
      }

      await db
        .update(tags)
        .set({
          name: data.name,
          slug: slug,
          description: data.description ?? null,
          color: data.color ?? null,
          updatedAt: new Date(),
        })
        .where(eq(tags.id, data.id));
    } else {
      await db
        .update(tags)
        .set({
          description: data.description ?? null,
          color: data.color ?? null,
          updatedAt: new Date(),
        })
        .where(eq(tags.id, data.id));
    }

    return {
      success: "Tag updated successfully",
    } as ActionState;
  }
);

/**
 * Delete a tag (soft delete)
 */
export const deleteTag = validatedActionWithUser(
  deleteTagSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify tag belongs to team
    const existingTag = await db
      .select()
      .from(tags)
      .where(
        and(
          eq(tags.id, data.id),
          eq(tags.teamId, team.id),
          isNull(tags.deletedAt)
        )
      )
      .limit(1);

    if (existingTag.length === 0) {
      return { error: "Tag not found" } as ActionState;
    }

    // Soft delete
    await db
      .update(tags)
      .set({
        deletedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(tags.id, data.id));

    return {
      success: "Tag deleted successfully",
    } as ActionState;
  }
);

/**
 * Add tags to a challenge question
 */
export const addTagsToQuestion = validatedActionWithUser(
  z.object({
    questionId: z.string().uuid(),
    tagIds: z.array(z.string().uuid()),
  }),
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify question belongs to team
    const question = await db.query.clientChallengeQuestions.findFirst({
      where: (q, { eq, and }) =>
        and(eq(q.id, data.questionId), eq(q.teamId, team.id)),
    });

    if (!question) {
      return { error: "Question not found" } as ActionState;
    }

    // Verify all tags belong to team
    const teamTags = await db
      .select()
      .from(tags)
      .where(
        and(
          eq(tags.teamId, team.id),
          isNull(tags.deletedAt),
          sql`${tags.id} = ANY(${data.tagIds})`
        )
      );

    if (teamTags.length !== data.tagIds.length) {
      return { error: "One or more tags not found" } as ActionState;
    }

    // Insert tags (ignore duplicates)
    if (data.tagIds.length > 0) {
      await db
        .insert(clientChallengeQuestionTags)
        .values(
          data.tagIds.map((tagId) => ({
            clientChallengeQuestionId: data.questionId,
            tagId: tagId,
          }))
        )
        .onConflictDoNothing();

      // Update usage counts
      await db
        .update(tags)
        .set({
          usageCount: sql`${tags.usageCount} + 1`,
        })
        .where(sql`${tags.id} = ANY(${data.tagIds})`);
    }

    return {
      success: "Tags added successfully",
    } as ActionState;
  }
);

/**
 * Remove tags from a challenge question
 */
export const removeTagsFromQuestion = validatedActionWithUser(
  z.object({
    questionId: z.string().uuid(),
    tagIds: z.array(z.string().uuid()),
  }),
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify question belongs to team
    const question = await db.query.clientChallengeQuestions.findFirst({
      where: (q, { eq, and }) =>
        and(eq(q.id, data.questionId), eq(q.teamId, team.id)),
    });

    if (!question) {
      return { error: "Question not found" } as ActionState;
    }

    // Remove tags
    if (data.tagIds.length > 0) {
      await db
        .delete(clientChallengeQuestionTags)
        .where(
          and(
            eq(
              clientChallengeQuestionTags.clientChallengeQuestionId,
              data.questionId
            ),
            sql`${clientChallengeQuestionTags.tagId} = ANY(${data.tagIds})`
          )
        );

      // Update usage counts
      await db
        .update(tags)
        .set({
          usageCount: sql`GREATEST(${tags.usageCount} - 1, 0)`,
        })
        .where(sql`${tags.id} = ANY(${data.tagIds})`);
    }

    return {
      success: "Tags removed successfully",
    } as ActionState;
  }
);
