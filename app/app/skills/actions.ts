"use server";

import { z } from "zod";
import { eq, and, or, ilike, inArray, sql, isNull, count } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  clientSkills,
  clientChallengeQuestions,
  skillTaxonomy,
  challengeQuestions,
  teams,
  type NewClientSkill,
  type NewClientChallengeQuestion,
  SyncChallengeQuestions,
} from "@/lib/db/schema";
import { validatedActionWithUser, type ActionState } from "@/lib/auth/proxy";
import { getTeamForUser, getUser } from "@/lib/db/queries";
import {
  uploadImageToSupabase,
  generateChallengeImagePath,
} from "@/lib/storage/supabase";
import { clientChallengeQuestionTags, tags } from "@/lib/db/schema";
import type {
  MultipleChoiceQuestion,
  FillBlankBlocksQuestion,
} from "@/challenge-question-types";
import {
  getQuestionLimit,
  hasReachedQuestionLimit,
  getCustomQuestionLimit,
  hasReachedCustomQuestionLimit,
} from "@/lib/constants/tier-limits";
import { PlanName } from "@/lib/db/schema";

const createClientSkillSchema = z.object({
  skillName: z.string().min(1).max(255),
  description: z
    .string()
    .max(2000, "Description cannot exceed 2000 characters")
    .optional(),
  categoryId: z.string().uuid().optional(),
  skillTaxonomyId: z.string().uuid().optional(),
  aliases: z
    .union([
      z.array(z.string().max(255, "Each alias cannot exceed 255 characters")),
      z.string().transform((str, ctx) => {
        try {
          const parsed = JSON.parse(str);
          if (Array.isArray(parsed)) {
            // Validate each alias
            for (const alias of parsed) {
              if (typeof alias !== "string") {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Aliases must be strings",
                });
                return z.NEVER;
              }
              if (alias.length > 255) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  message: "Each alias cannot exceed 255 characters",
                });
                return z.NEVER;
              }
            }
            return parsed;
          }
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid aliases format",
          });
          return z.NEVER;
        } catch {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid aliases format",
          });
          return z.NEVER;
        }
      }),
    ])
    .optional(),
  iconSvg: z
    .string()
    .max(10000, "Icon SVG cannot exceed 10000 characters")
    .nullable()
    .optional(),
});

const updateClientSkillSchema = createClientSkillSchema.partial().extend({
  id: z.string().uuid(),
});

// Challenge question config schemas
const multipleChoiceConfigSchema = z
  .object({
    options: z
      .array(z.string().max(500, "Each option cannot exceed 500 characters"))
      .min(2, "Multiple choice questions must have at least 2 options")
      .max(8, "Multiple choice questions cannot have more than 8 options"),
    correctAnswer: z.string().min(1, "Please select a correct answer"),
  })
  .refine(
    (data) => {
      // Check for duplicate options (case-insensitive, trimmed)
      const normalizedOptions = data.options.map((opt) =>
        opt.trim().toLowerCase()
      );
      const uniqueOptions = new Set(normalizedOptions);
      return uniqueOptions.size === normalizedOptions.length;
    },
    {
      message: "Answer options must be unique",
      path: ["options"],
    }
  );

const fillBlankBlocksConfigSchema = z.object({
  templateSource: z
    .string()
    .max(5000, "Template cannot exceed 5000 characters"),
  segments: z.array(
    z.union([
      z.object({ type: z.literal("text"), text: z.string() }),
      z.object({
        type: z.literal("blank"),
        text: z
          .string()
          .max(500, "Blank answer text cannot exceed 500 characters"),
      }),
      z.object({ type: z.literal("newline") }),
      z.object({ type: z.literal("tab") }),
    ])
  ),
  extraBlanks: z
    .array(
      z.string().max(500, "Distractor option cannot exceed 500 characters")
    )
    .max(20, "Cannot have more than 20 distractor options"),
  blocks: z.array(z.string()),
  correctAnswer: z.array(z.string()),
});

const createChallengeQuestionSchema = z.preprocess(
  (data) => {
    const obj = data as Record<string, unknown>;
    // Parse config from JSON string
    if (typeof obj.config === "string") {
      try {
        obj.config = JSON.parse(obj.config);
      } catch {
        // Leave as string, validation will catch it
      }
    }
    // Convert timeLimitSeconds from string to number
    // Empty string means use team default (null), 0 means no limit
    if (typeof obj.timeLimitSeconds === "string") {
      if (obj.timeLimitSeconds === "") {
        obj.timeLimitSeconds = undefined; // Use team default
      } else {
        const num = parseInt(obj.timeLimitSeconds, 10);
        obj.timeLimitSeconds = isNaN(num) ? undefined : num; // 0 is valid (no limit)
      }
    }
    return obj;
  },
  z.object({
    skillId: z.string().uuid(),
    type: z.enum(["multiple_choice", "fill_blank_blocks"]),
    prompt: z.string().min(1).max(5000, "Prompt cannot exceed 5000 characters"),
    config: z.union([multipleChoiceConfigSchema, fillBlankBlocksConfigSchema]),
    imageUrl: z.string().optional().nullable(),
    imageAltText: z
      .string()
      .max(500, "Image alt text cannot exceed 500 characters")
      .optional()
      .nullable(),
    timeLimitSeconds: z.number().int().min(0).optional(),
  })
);

const updateChallengeQuestionSchema = z.preprocess(
  (data) => {
    const obj = data as Record<string, unknown>;
    // Parse config from JSON string
    if (typeof obj.config === "string") {
      try {
        obj.config = JSON.parse(obj.config);
      } catch {
        // Leave as string, validation will catch it
      }
    }
    // Convert timeLimitSeconds from string to number
    // Empty string means use team default (null), 0 means no limit
    if (typeof obj.timeLimitSeconds === "string") {
      if (obj.timeLimitSeconds === "") {
        obj.timeLimitSeconds = undefined; // Use team default
      } else {
        const num = parseInt(obj.timeLimitSeconds, 10);
        obj.timeLimitSeconds = isNaN(num) ? undefined : num; // 0 is valid (no limit)
      }
    }
    return obj;
  },
  z.object({
    id: z.string().uuid(),
    skillId: z.string().uuid(),
    type: z.enum(["multiple_choice", "fill_blank_blocks"]).optional(),
    prompt: z
      .string()
      .min(1)
      .max(5000, "Prompt cannot exceed 5000 characters")
      .optional(),
    config: z
      .union([multipleChoiceConfigSchema, fillBlankBlocksConfigSchema])
      .optional(),
    imageUrl: z.string().optional().nullable(),
    imageAltText: z
      .string()
      .max(500, "Image alt text cannot exceed 500 characters")
      .optional()
      .nullable(),
    timeLimitSeconds: z.number().int().min(0).optional(),
  })
);

/**
 * Check for duplicate skill names and aliases across ClientSkills and SkillTaxonomy
 */
export const checkSkillDuplicates = validatedActionWithUser(
  z.object({
    skillName: z.string().min(1),
    aliases: z.union([z.array(z.string()), z.string()]).optional(),
  }),
  async (
    data,
    formData,
    user
  ): Promise<
    ActionState & { duplicates?: { name?: boolean; aliases?: string[] } }
  > => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Parse aliases if it's a JSON string
    let parsedAliases: string[] = [];
    if (data.aliases) {
      if (Array.isArray(data.aliases)) {
        parsedAliases = data.aliases;
      } else if (typeof data.aliases === "string") {
        try {
          parsedAliases = JSON.parse(data.aliases);
        } catch {
          parsedAliases = [];
        }
      }
    }

    const skillName = data.skillName.toLowerCase().trim();
    const allAliases = [
      ...parsedAliases,
      skillName, // Also check the skill name itself
    ].map((a) => a.toLowerCase().trim());

    // Check ClientSkills for this team
    const clientSkillsList = await db
      .select({
        skillName: clientSkills.skillName,
        skillNormalized: clientSkills.skillNormalized,
        aliases: clientSkills.aliases,
      })
      .from(clientSkills)
      .where(eq(clientSkills.teamId, team.id));

    // Check SkillTaxonomy (global skills)
    const globalSkillsList = await db
      .select({
        skillName: skillTaxonomy.skillName,
        skillNormalized: skillTaxonomy.skillNormalized,
        aliases: skillTaxonomy.aliases,
      })
      .from(skillTaxonomy);

    const duplicates: {
      name?: boolean;
      aliases?: string[];
    } = {};

    // Check if skill name matches
    const normalizedName = skillName.toLowerCase().trim();
    const nameExists =
      clientSkillsList.some((s) => s.skillNormalized === normalizedName) ||
      globalSkillsList.some((s) => s.skillNormalized === normalizedName);

    if (nameExists) {
      duplicates.name = true;
    }

    // Check aliases
    const duplicateAliases: string[] = [];
    for (const alias of allAliases) {
      const aliasLower = alias.toLowerCase().trim();
      const aliasExists =
        clientSkillsList.some(
          (s) =>
            s.skillNormalized === aliasLower ||
            (s.aliases || []).some((a) => a.toLowerCase() === aliasLower)
        ) ||
        globalSkillsList.some(
          (s) =>
            s.skillNormalized === aliasLower ||
            (s.aliases || []).some((a) => a.toLowerCase() === aliasLower)
        );

      if (aliasExists && aliasLower !== normalizedName) {
        duplicateAliases.push(alias);
      }
    }

    if (duplicateAliases.length > 0) {
      duplicates.aliases = duplicateAliases;
    }

    if (
      duplicates.name ||
      (duplicates.aliases && duplicates.aliases.length > 0)
    ) {
      return { duplicates } as ActionState & { duplicates: typeof duplicates };
    }

    return { success: "No duplicates found" } as ActionState;
  }
);

/**
 * Check alias validation rules:
 * - PREVENT: Alias matches another skill's name (normalized) - forbidden
 * - WARN: Alias matches another skill's alias (different skill) - allowed but warned
 * - FORBID: Alias matches another alias in the same skill - forbidden
 */
/**
 * Check alias validation rules:
 * - PREVENT: Alias matches another skill's name (normalized) - forbidden
 * - WARN: Alias matches another skill's alias (different skill) - allowed but warned
 * - FORBID: Alias matches another alias in the same skill - forbidden
 * This is a server action that can be called directly (not through useActionState)
 */
export async function checkAliasAvailability({
  alias,
  skillId,
  currentAliases,
}: {
  alias: string;
  skillId?: string;
  currentAliases?: string[];
}): Promise<
  ActionState & {
    canAdd?: boolean;
    warning?: string;
    error?: string;
    matchesSkillName?: boolean;
    matchesOtherAlias?: boolean;
    matchesSameSkillAlias?: boolean;
    matchedGlobalSkill?: {
      id: string;
      name: string;
    };
  }
> {
  const user = await getUser();
  if (!user) {
    return { error: "User is not authenticated" } as ActionState;
  }

  const team = await getTeamForUser();
  if (!team) {
    return { error: "Team not found" } as ActionState;
  }

  const aliasNormalized = alias.toLowerCase().trim();

  // FORBID: Check if alias already exists in current skill's aliases
  if (currentAliases && currentAliases.length > 0) {
    const normalizedCurrentAliases = currentAliases.map((a) =>
      a.toLowerCase().trim()
    );
    if (normalizedCurrentAliases.includes(aliasNormalized)) {
      return {
        error: "This alias already exists for this skill",
        canAdd: false,
        matchesSameSkillAlias: true,
      } as ActionState & {
        canAdd: boolean;
        matchesSameSkillAlias: boolean;
      };
    }
  }

  // PREVENT: Check if alias matches another skill's name (normalized)
  const matchingSkillNameClient = await db
    .select({
      id: clientSkills.id,
      skillName: clientSkills.skillName,
      skillNormalized: clientSkills.skillNormalized,
    })
    .from(clientSkills)
    .where(
      skillId
        ? and(
            eq(clientSkills.teamId, team.id),
            sql`${clientSkills.id} != ${skillId}`,
            sql`LOWER(${clientSkills.skillNormalized}) = ${aliasNormalized}`
          )
        : and(
            eq(clientSkills.teamId, team.id),
            sql`LOWER(${clientSkills.skillNormalized}) = ${aliasNormalized}`
          )
    )
    .limit(1);

  const matchingSkillNameGlobal = await db
    .select({
      id: skillTaxonomy.id,
      skillName: skillTaxonomy.skillName,
      skillNormalized: skillTaxonomy.skillNormalized,
    })
    .from(skillTaxonomy)
    .where(sql`LOWER(${skillTaxonomy.skillNormalized}) = ${aliasNormalized}`)
    .limit(1);

  if (matchingSkillNameClient.length > 0) {
    const skillName = matchingSkillNameClient[0]?.skillName;
    return {
      error: `This alias matches the skill name "${skillName}". Aliases cannot match skill names.`,
      canAdd: false,
      matchesSkillName: true,
    } as ActionState & {
      canAdd: boolean;
      matchesSkillName: boolean;
    };
  }

  if (matchingSkillNameGlobal.length > 0) {
    const globalSkill = matchingSkillNameGlobal[0];
    return {
      error: `This alias matches the global skill name "${globalSkill.skillName}". Aliases cannot match skill names.`,
      canAdd: false,
      matchesSkillName: true,
      matchedGlobalSkill: {
        id: globalSkill.id,
        name: globalSkill.skillName,
      },
    } as ActionState & {
      canAdd: boolean;
      matchesSkillName: boolean;
      matchedGlobalSkill: { id: string; name: string };
    };
  }

  // WARN: Check if alias matches another ClientSkill's alias (different skill)
  // Only check ClientSkills since global skills won't be auto-connected to jobs
  const matchingAliasClient = await db
    .select({
      id: clientSkills.id,
      skillName: clientSkills.skillName,
      aliases: clientSkills.aliases,
    })
    .from(clientSkills)
    .where(
      skillId
        ? and(
            eq(clientSkills.teamId, team.id),
            sql`${clientSkills.id} != ${skillId}`,
            sql`LOWER(${aliasNormalized}) = ANY(SELECT LOWER(unnest(${clientSkills.aliases})))`
          )
        : and(
            eq(clientSkills.teamId, team.id),
            sql`LOWER(${aliasNormalized}) = ANY(SELECT LOWER(unnest(${clientSkills.aliases})))`
          )
    )
    .limit(5);

  if (matchingAliasClient.length > 0) {
    const skillNames = matchingAliasClient.map((s) => s.skillName).join(", ");
    return {
      success: "Alias can be added",
      canAdd: true,
      warning: `This alias is also used by: ${skillNames}. Both skills may be auto-connected to jobs mentioning this alias.`,
      matchesOtherAlias: true,
    } as ActionState & {
      canAdd: boolean;
      warning: string;
      matchesOtherAlias: boolean;
    };
  }

  return {
    success: "Alias is available",
    canAdd: true,
  } as ActionState & { canAdd: boolean };
}

export const createClientSkill = validatedActionWithUser(
  createClientSkillSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    const skillNormalized = data.skillName.toLowerCase().trim();

    // Check for duplicates before creating
    const checkFormData = new FormData();
    checkFormData.set("skillName", data.skillName);
    if (data.aliases) {
      checkFormData.set(
        "aliases",
        JSON.stringify(Array.isArray(data.aliases) ? data.aliases : [])
      );
    }
    const duplicateCheck = (await checkSkillDuplicates(
      {},
      checkFormData
    )) as ActionState & { duplicates?: { name?: boolean; aliases?: string[] } };
    if (duplicateCheck.duplicates) {
      if (duplicateCheck.duplicates.name) {
        return {
          error: "A skill with this name already exists",
        } as ActionState;
      }
      if (
        duplicateCheck.duplicates.aliases &&
        duplicateCheck.duplicates.aliases.length > 0
      ) {
        return {
          error: `These aliases already exist: ${duplicateCheck.duplicates.aliases.join(", ")}`,
        } as ActionState;
      }
    }

    const newSkill: NewClientSkill = {
      teamId: team.id,
      skillName: data.skillName,
      skillNormalized,
      description: data.description || null,
      categoryId: data.categoryId || null,
      skillTaxonomyId: data.skillTaxonomyId || null,
      iconSvg: data.iconSvg || null,
    };

    const [createdSkill] = await db
      .insert(clientSkills)
      .values(newSkill)
      .returning();

    // Add aliases if provided
    if (
      data.aliases &&
      Array.isArray(data.aliases) &&
      data.aliases.length > 0
    ) {
      await db
        .update(clientSkills)
        .set({ aliases: data.aliases })
        .where(eq(clientSkills.id, createdSkill.id));
    }

    return {
      success: "Skill created successfully",
      skillId: createdSkill.id,
    } as ActionState;
  }
);

export const updateClientSkill = validatedActionWithUser(
  updateClientSkillSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    const { id, ...updateData } = data;

    // Parse aliases if provided as JSON string
    if (formData.has("aliases")) {
      const aliasesStr = formData.get("aliases") as string;
      try {
        updateData.aliases = JSON.parse(aliasesStr);
      } catch {
        return { error: "Invalid aliases format" } as ActionState;
      }
    }

    // Parse iconSvg if provided
    if (formData.has("iconSvg")) {
      const iconSvgStr = (formData.get("iconSvg") as string) || "";
      // Allow empty string to clear the icon (set to null)
      // Use null explicitly for empty strings so the update check below works
      if (iconSvgStr.trim() === "") {
        (updateData as any).iconSvg = null;
      } else {
        updateData.iconSvg = iconSvgStr;
      }
    }

    // Verify skill belongs to team
    const existingSkill = await db
      .select()
      .from(clientSkills)
      .where(and(eq(clientSkills.id, id), eq(clientSkills.teamId, team.id)))
      .limit(1);

    if (existingSkill.length === 0) {
      return { error: "Skill not found" } as ActionState;
    }

    const updateFields: any = {
      updatedAt: new Date(),
    };

    if (updateData.skillName) {
      updateFields.skillName = updateData.skillName;
      updateFields.skillNormalized = updateData.skillName.toLowerCase().trim();
    }
    if (updateData.description !== undefined) {
      updateFields.description = updateData.description || null;
    }
    if (updateData.categoryId !== undefined) {
      updateFields.categoryId = updateData.categoryId || null;
    }
    if (updateData.skillTaxonomyId !== undefined) {
      updateFields.skillTaxonomyId = updateData.skillTaxonomyId || null;
    }
    if (updateData.aliases !== undefined) {
      updateFields.aliases = updateData.aliases;
    }
    if (updateData.iconSvg !== undefined) {
      updateFields.iconSvg = updateData.iconSvg || null;
    }

    await db
      .update(clientSkills)
      .set(updateFields)
      .where(eq(clientSkills.id, id));

    return { success: "Skill updated successfully" } as ActionState;
  }
);

export const deleteClientSkill = validatedActionWithUser(
  z.object({ id: z.string().uuid() }),
  async (data, _, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify skill belongs to team
    const existingSkill = await db
      .select()
      .from(clientSkills)
      .where(
        and(eq(clientSkills.id, data.id), eq(clientSkills.teamId, team.id))
      )
      .limit(1);

    if (existingSkill.length === 0) {
      return { error: "Skill not found" } as ActionState;
    }

    // Delete the skill (hard delete)
    await db.delete(clientSkills).where(eq(clientSkills.id, data.id));

    return { success: "Skill deleted successfully" } as ActionState;
  }
);

/**
 * Check for duplicate aliases across ClientSkills only
 * (SkillTaxonomy is excluded since global skills won't be auto-connected to jobs)
 * Returns conflicts grouped by alias with all skills that use each alias
 * This is a server action that can be called directly (not through useActionState)
 */
export async function checkDuplicateAliases(): Promise<
  ActionState & {
    hasDuplicates?: boolean;
    conflicts?: Array<{
      alias: string;
      skills: Array<{
        id: string;
        name: string;
        type: "client";
      }>;
    }>;
  }
> {
  const user = await getUser();
  if (!user) {
    return { error: "User is not authenticated" } as ActionState;
  }

  const team = await getTeamForUser();
  if (!team) {
    return { error: "Team not found" } as ActionState;
  }

  // Get all client skills for this team
  const clientSkillsList = await db
    .select({
      id: clientSkills.id,
      skillName: clientSkills.skillName,
      aliases: clientSkills.aliases,
    })
    .from(clientSkills)
    .where(eq(clientSkills.teamId, team.id));

  // Build a map of alias -> skills that use it
  const aliasMap = new Map<
    string,
    Array<{ id: string; name: string; type: "client" }>
  >();

  // Process client skills
  for (const skill of clientSkillsList) {
    const aliases = skill.aliases || [];
    for (const alias of aliases) {
      const normalized = alias.toLowerCase().trim();
      if (!aliasMap.has(normalized)) {
        aliasMap.set(normalized, []);
      }
      aliasMap.get(normalized)!.push({
        id: skill.id,
        name: skill.skillName,
        type: "client",
      });
    }
  }

  // Find aliases used by multiple skills
  const conflicts: Array<{
    alias: string;
    skills: Array<{ id: string; name: string; type: "client" }>;
  }> = [];

  for (const [alias, skills] of aliasMap.entries()) {
    if (skills.length > 1) {
      conflicts.push({ alias, skills });
    }
  }

  return {
    success: conflicts.length > 0 ? "Duplicates found" : "No duplicates",
    hasDuplicates: conflicts.length > 0,
    conflicts: conflicts.length > 0 ? conflicts : undefined,
  } as ActionState & {
    hasDuplicates: boolean;
    conflicts?: typeof conflicts;
  };
}

// Challenge Question Actions
export const createChallengeQuestion = validatedActionWithUser(
  createChallengeQuestionSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify skill belongs to team
    const skill = await db
      .select()
      .from(clientSkills)
      .where(
        and(eq(clientSkills.id, data.skillId), eq(clientSkills.teamId, team.id))
      )
      .limit(1);

    if (skill.length === 0) {
      return { error: "Skill not found" } as ActionState;
    }

    // Check custom question limit based on team tier (total across all skills)
    const planName = (team.planName as PlanName) || PlanName.FREE;
    const customQuestionLimit = getCustomQuestionLimit(planName);

    // Count total existing custom questions for the team (across all skills)
    const totalCustomQuestions = await db
      .select({ count: count() })
      .from(clientChallengeQuestions)
      .where(eq(clientChallengeQuestions.teamId, team.id));

    const currentTotalCount = Number(totalCustomQuestions[0]?.count ?? 0);

    // Check if adding one more question would exceed the total custom question limit
    if (currentTotalCount >= customQuestionLimit) {
      return {
        error: `You've reached the maximum of ${customQuestionLimit} custom questions for your ${planName} plan. Upgrade to Pro to create up to 500 custom questions.`,
      } as ActionState;
    }

    const newQuestion: NewClientChallengeQuestion = {
      teamId: team.id,
      clientSkillId: data.skillId,
      type: data.type,
      prompt: data.prompt,
      config: data.config,
      imageUrl: null, // Will be set after image upload
      imageAltText: data.imageAltText || null,
      timeLimitSeconds: data.timeLimitSeconds || null,
    };

    const [createdQuestion] = await db
      .insert(clientChallengeQuestions)
      .values(newQuestion)
      .returning();

    // Upload image after question is created (if provided)
    const imageFile = formData.get("imageFile");
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      try {
        // Generate path with the actual question ID
        const path = generateChallengeImagePath(
          team.id,
          createdQuestion.id,
          imageFile.name
        );

        // Upload image
        const uploadResult = await uploadImageToSupabase(imageFile, path);

        if (uploadResult.error) {
          // If image upload fails, delete the question and return error
          await db
            .delete(clientChallengeQuestions)
            .where(eq(clientChallengeQuestions.id, createdQuestion.id));
          return {
            error: `Failed to upload image: ${uploadResult.error}`,
          } as ActionState;
        }

        // Update question with image URL
        await db
          .update(clientChallengeQuestions)
          .set({ imageUrl: uploadResult.url })
          .where(eq(clientChallengeQuestions.id, createdQuestion.id));
      } catch (error: any) {
        // If image upload fails, delete the question and return error
        await db
          .delete(clientChallengeQuestions)
          .where(eq(clientChallengeQuestions.id, createdQuestion.id));
        return {
          error: `Failed to upload image: ${error.message || "Unknown error"}`,
        } as ActionState;
      }
    }

    // Add tags after question is created (if provided)
    const tagIdsStr = formData.get("tagIds");
    if (tagIdsStr && typeof tagIdsStr === "string") {
      try {
        const tagIds = JSON.parse(tagIdsStr);
        if (Array.isArray(tagIds) && tagIds.length > 0) {
          // Verify all tags belong to team
          const teamTags = await db
            .select()
            .from(tags)
            .where(
              and(
                eq(tags.teamId, team.id),
                isNull(tags.deletedAt),
                inArray(tags.id, tagIds)
              )
            );

          if (teamTags.length === tagIds.length) {
            // Insert tags (ignore duplicates)
            await db
              .insert(clientChallengeQuestionTags)
              .values(
                tagIds.map((tagId) => ({
                  clientChallengeQuestionId: createdQuestion.id,
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
              .where(inArray(tags.id, tagIds));
          }
        }
      } catch (error: any) {
        // If tag parsing fails, just log it (tags are optional)
        console.error("Failed to parse tag IDs:", error);
      }
    }

    return {
      success: "Challenge question created successfully",
      questionId: createdQuestion.id,
    } as ActionState;
  }
);

export const updateChallengeQuestion = validatedActionWithUser(
  updateChallengeQuestionSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    const { id, skillId, ...updateData } = data;

    // Verify question belongs to team and skill
    const existingQuestion = await db
      .select()
      .from(clientChallengeQuestions)
      .where(
        and(
          eq(clientChallengeQuestions.id, id),
          eq(clientChallengeQuestions.teamId, team.id),
          eq(clientChallengeQuestions.clientSkillId, skillId)
        )
      )
      .limit(1);

    if (existingQuestion.length === 0) {
      return { error: "Question not found" } as ActionState;
    }

    const updateFields: any = {};

    if (updateData.type !== undefined) {
      updateFields.type = updateData.type;
    }
    if (updateData.prompt !== undefined) {
      updateFields.prompt = updateData.prompt;
    }
    if (updateData.config !== undefined) {
      updateFields.config = updateData.config;
    }
    if (updateData.imageAltText !== undefined) {
      updateFields.imageAltText = updateData.imageAltText;
    }
    if (updateData.timeLimitSeconds !== undefined) {
      updateFields.timeLimitSeconds = updateData.timeLimitSeconds || null;
    }

    // Handle image upload if new file provided
    const imageFile = formData.get("imageFile");
    if (imageFile && imageFile instanceof File && imageFile.size > 0) {
      try {
        // Generate path with the question ID
        const path = generateChallengeImagePath(team.id, id, imageFile.name);

        // Upload image
        const uploadResult = await uploadImageToSupabase(imageFile, path);

        if (uploadResult.error) {
          return {
            error: `Failed to upload image: ${uploadResult.error}`,
          } as ActionState;
        }

        // Update question with image URL
        updateFields.imageUrl = uploadResult.url;
      } catch (error: any) {
        return {
          error: `Failed to upload image: ${error.message || "Unknown error"}`,
        } as ActionState;
      }
    } else if (updateData.imageUrl !== undefined) {
      // If imageUrl is explicitly set to null (removing image)
      updateFields.imageUrl = updateData.imageUrl;
    }

    await db
      .update(clientChallengeQuestions)
      .set(updateFields)
      .where(eq(clientChallengeQuestions.id, id));

    // Update tags if provided
    const tagIdsStr = formData.get("tagIds");
    if (tagIdsStr && typeof tagIdsStr === "string") {
      try {
        const tagIds = JSON.parse(tagIdsStr);
        if (Array.isArray(tagIds)) {
          // Get existing tags before removing
          const existingTags = await db
            .select()
            .from(clientChallengeQuestionTags)
            .where(
              eq(clientChallengeQuestionTags.clientChallengeQuestionId, id)
            );
          const existingTagIds = existingTags.map((t) => t.tagId);

          // Remove all existing tags for this question
          await db
            .delete(clientChallengeQuestionTags)
            .where(
              eq(clientChallengeQuestionTags.clientChallengeQuestionId, id)
            );

          // Decrement usage counts for removed tags
          if (existingTagIds.length > 0) {
            await db
              .update(tags)
              .set({
                usageCount: sql`GREATEST(0, ${tags.usageCount} - 1)`,
              })
              .where(inArray(tags.id, existingTagIds));
          }

          // Add new tags if any
          if (tagIds.length > 0) {
            // Verify all tags belong to team
            const teamTags = await db
              .select()
              .from(tags)
              .where(
                and(
                  eq(tags.teamId, team.id),
                  isNull(tags.deletedAt),
                  inArray(tags.id, tagIds)
                )
              );

            // Only add tags if all tags are valid
            if (teamTags.length === tagIds.length) {
              await db
                .insert(clientChallengeQuestionTags)
                .values(
                  tagIds.map((tagId) => ({
                    clientChallengeQuestionId: id,
                    tagId: tagId,
                  }))
                )
                .onConflictDoNothing();

              // Update usage counts for new tags (only increment if not already counted)
              const newTagIds = tagIds.filter(
                (tagId) => !existingTagIds.includes(tagId)
              );
              if (newTagIds.length > 0) {
                await db
                  .update(tags)
                  .set({
                    usageCount: sql`${tags.usageCount} + 1`,
                  })
                  .where(inArray(tags.id, newTagIds));
              }
            } else {
              // Log warning if tag verification fails
              console.warn(
                `Tag verification failed: expected ${tagIds.length} tags, found ${teamTags.length}. Tag IDs:`,
                tagIds
              );
            }
          }
        }
      } catch (error: any) {
        // If tag parsing fails, just log it (tags are optional)
        console.error("Failed to parse tag IDs:", error);
      }
    }

    return { success: "Question updated successfully" } as ActionState;
  }
);

export const deleteChallengeQuestion = validatedActionWithUser(
  z.object({
    id: z.string().uuid(),
  }),
  async (data, _, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Verify question belongs to team
    const existingQuestion = await db
      .select()
      .from(clientChallengeQuestions)
      .where(
        and(
          eq(clientChallengeQuestions.id, data.id),
          eq(clientChallengeQuestions.teamId, team.id)
        )
      )
      .limit(1);

    if (existingQuestion.length === 0) {
      return { error: "Question not found" } as ActionState;
    }

    await db
      .delete(clientChallengeQuestions)
      .where(eq(clientChallengeQuestions.id, data.id));

    return { success: "Question deleted successfully" } as ActionState;
  }
);

/**
 * Duplicate a challenge question
 */
export const duplicateChallengeQuestion = validatedActionWithUser(
  z.object({
    id: z.string().uuid(),
  }),
  async (data, _, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Get the existing question with tags
    const existingQuestion = await db.query.clientChallengeQuestions.findFirst({
      where: (questions, { eq, and }) =>
        and(eq(questions.id, data.id), eq(questions.teamId, team.id)),
      with: {
        tags: {
          with: {
            tag: true,
          },
        },
      },
    });

    if (!existingQuestion) {
      return { error: "Question not found" } as ActionState;
    }

    // Create new question with same data
    // Deep clone config to avoid reference issues - this preserves all fields
    const originalConfig = existingQuestion.config;

    // Debug: Log original config structure to help diagnose issues
    if (!originalConfig || typeof originalConfig !== "object") {
      return {
        error: "Invalid question config: config is missing or not an object",
      } as ActionState;
    }

    let clonedConfig: MultipleChoiceQuestion | FillBlankBlocksQuestion;

    try {
      // Deep clone the entire config object to preserve all fields
      // This will preserve all properties including nested objects and arrays
      clonedConfig = JSON.parse(JSON.stringify(originalConfig)) as
        | MultipleChoiceQuestion
        | FillBlankBlocksQuestion;

      // Verify the clone preserved all keys from the original
      const originalKeys = Object.keys(originalConfig);
      const clonedKeys = Object.keys(clonedConfig);
      if (originalKeys.length !== clonedKeys.length) {
        console.warn(
          `Config clone may have lost fields. Original keys: ${originalKeys.join(", ")}, Cloned keys: ${clonedKeys.join(", ")}`
        );
      }

      // Validate that all required fields are present based on type
      if (existingQuestion.type === "multiple_choice") {
        const mcConfig = clonedConfig as MultipleChoiceQuestion;
        // Ensure all required fields exist
        if (!mcConfig.options || !Array.isArray(mcConfig.options)) {
          return {
            error:
              "Invalid multiple choice config: missing or invalid options array",
          } as ActionState;
        }
        if (
          !mcConfig.correctAnswer ||
          typeof mcConfig.correctAnswer !== "string"
        ) {
          return {
            error:
              "Invalid multiple choice config: missing or invalid correctAnswer",
          } as ActionState;
        }
        // Ensure correctAnswer is one of the options
        if (!mcConfig.options.includes(mcConfig.correctAnswer)) {
          return {
            error:
              "Invalid multiple choice config: correctAnswer must be one of the options",
          } as ActionState;
        }
      } else if (existingQuestion.type === "fill_blank_blocks") {
        const fbConfig = clonedConfig as FillBlankBlocksQuestion;
        // Ensure all required fields exist
        if (
          !fbConfig.templateSource ||
          typeof fbConfig.templateSource !== "string"
        ) {
          return {
            error:
              "Invalid fill blank config: missing or invalid templateSource",
          } as ActionState;
        }
        if (!fbConfig.segments || !Array.isArray(fbConfig.segments)) {
          return {
            error:
              "Invalid fill blank config: missing or invalid segments array",
          } as ActionState;
        }
        if (!fbConfig.extraBlanks || !Array.isArray(fbConfig.extraBlanks)) {
          return {
            error:
              "Invalid fill blank config: missing or invalid extraBlanks array",
          } as ActionState;
        }
        if (!fbConfig.blocks || !Array.isArray(fbConfig.blocks)) {
          return {
            error: "Invalid fill blank config: missing or invalid blocks array",
          } as ActionState;
        }
        if (!fbConfig.correctAnswer || !Array.isArray(fbConfig.correctAnswer)) {
          return {
            error:
              "Invalid fill blank config: missing or invalid correctAnswer array",
          } as ActionState;
        }
      } else {
        return {
          error: `Unknown question type: ${existingQuestion.type}`,
        } as ActionState;
      }
    } catch (error: any) {
      return {
        error: `Failed to clone config: ${error.message || "Unknown error"}`,
      } as ActionState;
    }

    const newQuestion: NewClientChallengeQuestion = {
      teamId: team.id,
      clientSkillId: existingQuestion.clientSkillId,
      type: existingQuestion.type,
      prompt: existingQuestion.prompt,
      config: clonedConfig,
      imageUrl: existingQuestion.imageUrl, // Copy image URL (same image reference)
      imageAltText: existingQuestion.imageAltText,
      timeLimitSeconds: existingQuestion.timeLimitSeconds,
    };

    const [createdQuestion] = await db
      .insert(clientChallengeQuestions)
      .values(newQuestion)
      .returning();

    // Copy tags if they exist
    if (existingQuestion.tags && existingQuestion.tags.length > 0) {
      const tagIds = existingQuestion.tags
        .map((cqt) => cqt.tag?.id)
        .filter((id): id is string => id !== undefined);

      if (tagIds.length > 0) {
        // Insert tags
        await db
          .insert(clientChallengeQuestionTags)
          .values(
            tagIds.map((tagId) => ({
              clientChallengeQuestionId: createdQuestion.id,
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
          .where(sql`${tags.id} = ANY(${tagIds})`);
      }
    }

    return {
      success: "Challenge question duplicated successfully",
      questionId: createdQuestion.id,
    } as ActionState;
  }
);

/**
 * Add a global skill to the client library
 */
export const addSkillFromGlobal = validatedActionWithUser(
  z.object({
    skillTaxonomyId: z.string().uuid(),
  }),
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    // Get the global skill
    const globalSkill = await db
      .select()
      .from(skillTaxonomy)
      .where(eq(skillTaxonomy.id, data.skillTaxonomyId))
      .limit(1);

    if (globalSkill.length === 0) {
      return { error: "Global skill not found" } as ActionState;
    }

    const skill = globalSkill[0];

    // Check if already in library
    const existing = await db
      .select()
      .from(clientSkills)
      .where(
        and(
          eq(clientSkills.teamId, team.id),
          eq(clientSkills.skillTaxonomyId, skill.id)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return { error: "Skill already in your library" } as ActionState;
    }

    // Get team settings for sync challenge questions
    const teamSettings = await db
      .select()
      .from(teams)
      .where(eq(teams.id, team.id))
      .limit(1);

    // Create client skill linked to global skill with aliases
    const newSkill: NewClientSkill = {
      teamId: team.id,
      skillName: skill.skillName,
      skillNormalized: skill.skillNormalized,
      description: null,
      categoryId: null,
      skillTaxonomyId: skill.id,
      aliases: skill.aliases || [],
    };

    const [createdSkill] = await db
      .insert(clientSkills)
      .values(newSkill)
      .returning();

    // Clone challenge questions if sync is enabled
    if (
      teamSettings.length > 0 &&
      teamSettings[0].syncChallengeQuestions === SyncChallengeQuestions.REQCHECK
    ) {
      const globalQuestions = await db
        .select()
        .from(challengeQuestions)
        .where(eq(challengeQuestions.skillTaxonomyId, skill.id));

      if (globalQuestions.length > 0) {
        const questionsToInsert: NewClientChallengeQuestion[] =
          globalQuestions.map((q) => ({
            teamId: team.id,
            clientSkillId: createdSkill.id,
            type: q.type,
            prompt: q.prompt,
            config: q.config,
            imageUrl: null,
            imageAltText: null,
            timeLimitSeconds: null,
          }));

        await db.insert(clientChallengeQuestions).values(questionsToInsert);
      }
    }

    return {
      success: "Skill added to your library",
      skillId: createdSkill.id,
    } as ActionState;
  }
);
