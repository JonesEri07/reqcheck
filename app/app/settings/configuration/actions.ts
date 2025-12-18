"use server";

import { z } from "zod";
import { eq, and, isNull } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { teams, SyncChallengeQuestions } from "@/lib/db/schema";
import { validatedActionWithUser } from "@/lib/auth/proxy";
import { requireTeamOwner } from "@/lib/auth/privileges";
import { getTeamForUser } from "@/lib/db/queries";
import type { ActionState } from "@/lib/auth/proxy";

// Update team settings schema
const updateTeamSettingsSchema = z.object({
  stopWidgetAtFreeCap: z
    .string()
    .optional()
    .transform((val) => val === "true" || val === "on"),
  defaultQuestionTimeLimitSeconds: z
    .string()
    .optional()
    .transform((val) => {
      if (!val || val.trim() === "") return 0; // Empty string = 0 (no limit)
      const parsed = parseInt(val, 10);
      return isNaN(parsed) ? 0 : parsed; // Invalid = 0 (no limit)
    })
    .refine((val) => val >= 0 && val <= 3600, {
      message: "Time limit must be between 0 and 3600 seconds (0 = no limit)",
    }),
  defaultPassThreshold: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 60))
    .refine((val) => val >= 0 && val <= 100, {
      message: "Pass threshold must be between 0 and 100",
    }),
  defaultQuestionCountType: z.enum(["fixed", "skillCount"]).optional(),
  defaultQuestionCountValue: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : null)),
  defaultQuestionCountMultiplier: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : null)),
  defaultQuestionCountMaxLimit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : null)),
  tagMatchWeight: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : 1.5))
    .refine((val) => val >= 0 && val <= 10, {
      message: "Tag match weight must be between 0 and 10",
    }),
  tagNoMatchWeight: z
    .string()
    .optional()
    .transform((val) => (val ? parseFloat(val) : 1.0))
    .refine((val) => val >= 0 && val <= 10, {
      message: "Tag no match weight must be between 0 and 10",
    }),
  syncChallengeQuestions: z
    .nativeEnum(SyncChallengeQuestions)
    .optional()
    .default(SyncChallengeQuestions.NONE),
});

// Simple action for updating just stopWidgetAtFreeCap (auto-save)
const updateStopWidgetAtFreeCapSchema = z.object({
  stopWidgetAtFreeCap: z
    .string()
    .transform((val) => val === "true" || val === "on"),
});

export const updateStopWidgetAtFreeCap = validatedActionWithUser(
  updateStopWidgetAtFreeCapSchema,
  async (data, _, user) => {
    const team = await getTeamForUser();

    if (!team) {
      return { error: "User is not part of a team" } as ActionState;
    }

    // Require team owner privilege
    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    await db
      .update(teams)
      .set({
        stopWidgetAtFreeCap: data.stopWidgetAtFreeCap,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, team.id));

    return { success: "Setting updated successfully" } as ActionState;
  }
);

export const updateTeamSettings = validatedActionWithUser(
  updateTeamSettingsSchema,
  async (data, _, user) => {
    const team = await getTeamForUser();

    if (!team) {
      return { error: "User is not part of a team" } as ActionState;
    }

    // Require team owner privilege
    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    // Build defaultQuestionCount object based on type
    let defaultQuestionCount:
      | { type: "fixed"; value: number }
      | { type: "skillCount"; multiplier: number; maxLimit: number };

    if (data.defaultQuestionCountType === "skillCount") {
      const multiplier = data.defaultQuestionCountMultiplier ?? 1.5;
      const maxLimit = data.defaultQuestionCountMaxLimit ?? 50;
      if (multiplier < 1) {
        return {
          error: "Multiplier must be 1 or higher",
        } as ActionState;
      }
      if (maxLimit < 1 || maxLimit > 100) {
        return {
          error: "Max limit must be between 1 and 100",
        } as ActionState;
      }
      defaultQuestionCount = { type: "skillCount", multiplier, maxLimit };
    } else {
      // Fixed mode (default)
      const value = data.defaultQuestionCountValue ?? 5;
      if (value < 1 || value > 100) {
        return {
          error: "Question count must be between 1 and 100",
        } as ActionState;
      }
      defaultQuestionCount = { type: "fixed", value: Math.round(value) };
    }

    await db
      .update(teams)
      .set({
        stopWidgetAtFreeCap:
          data.stopWidgetAtFreeCap ?? team.stopWidgetAtFreeCap,
        defaultQuestionTimeLimitSeconds:
          data.defaultQuestionTimeLimitSeconds !== undefined
            ? data.defaultQuestionTimeLimitSeconds
            : team.defaultQuestionTimeLimitSeconds,
        defaultPassThreshold:
          data.defaultPassThreshold ?? team.defaultPassThreshold,
        defaultQuestionCount: defaultQuestionCount as any,
        tagMatchWeight: data.tagMatchWeight
          ? data.tagMatchWeight.toString()
          : team.tagMatchWeight,
        tagNoMatchWeight: data.tagNoMatchWeight
          ? data.tagNoMatchWeight.toString()
          : team.tagNoMatchWeight,
        syncChallengeQuestions:
          data.syncChallengeQuestions ?? team.syncChallengeQuestions,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, team.id));

    return { success: "Team settings updated successfully" } as ActionState;
  }
);

// Update whitelist URLs schema
const updateWhitelistUrlsSchema = z.object({
  urls: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return [];
      return val
        .split("\n")
        .map((url) => url.trim())
        .filter((url) => url.length > 0);
    })
    .refine(
      (urls) => {
        const urlPattern = /^https?:\/\/.+/;
        return urls.every((url) => urlPattern.test(url));
      },
      {
        message: "All URLs must be valid HTTP/HTTPS URLs",
      }
    ),
});

export const updateWhitelistUrls = validatedActionWithUser(
  updateWhitelistUrlsSchema,
  async (data, _, user) => {
    const team = await getTeamForUser();

    if (!team) {
      return { error: "User is not part of a team" } as ActionState;
    }

    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    await db
      .update(teams)
      .set({
        whitelistUrls: data.urls,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, team.id));

    return { success: "Whitelist URLs updated successfully" } as ActionState;
  }
);

// Update webhook schema
const updateWebhookSchema = z.object({
  webhookUrl: z
    .string()
    .url("Must be a valid URL")
    .optional()
    .or(z.literal("")),
  webhookSecret: z.string().optional(),
});

export const updateWebhook = validatedActionWithUser(
  updateWebhookSchema,
  async (data, _, user) => {
    const team = await getTeamForUser();

    if (!team) {
      return { error: "User is not part of a team" } as ActionState;
    }

    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    // Note: webhookUrl and webhookSecret need to be added to the teams table
    // For now, this is a placeholder that will need schema migration
    await db
      .update(teams)
      .set({
        updatedAt: new Date(),
      })
      .where(eq(teams.id, team.id));

    return {
      success: "Webhook settings updated successfully",
      error: "Webhook fields not yet implemented in database schema",
    } as ActionState;
  }
);

// Create API key schema
const createApiKeySchema = z.object({
  name: z.string().min(1, "Name is required").max(255, "Name too long"),
});

export const createApiKey = validatedActionWithUser(
  createApiKeySchema,
  async (data, _, user) => {
    const team = await getTeamForUser();

    if (!team) {
      return { error: "User is not part of a team" } as ActionState;
    }

    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    // Generate API key
    const { randomBytes } = await import("crypto");
    const apiKey = `req_${randomBytes(32).toString("hex")}`;
    const keyPrefix = apiKey.substring(0, 12);
    const { hash } = await import("bcryptjs");
    const hashedKey = await hash(apiKey, 10);

    // Store in database
    const { teamApiKeys } = await import("@/lib/db/schema");
    await db.insert(teamApiKeys).values({
      teamId: team.id,
      name: data.name,
      keyPrefix,
      hashedKey,
      createdByUserId: user.id,
    });

    // Return the key (only shown once)
    return {
      success: "API key created successfully",
      apiKey, // This will be shown to the user once
    } as ActionState;
  }
);

// Revoke API key schema
const revokeApiKeySchema = z.object({
  keyId: z.string().uuid("Invalid key ID"),
});

export const revokeApiKey = validatedActionWithUser(
  revokeApiKeySchema,
  async (data, _, user) => {
    const team = await getTeamForUser();

    if (!team) {
      return { error: "User is not part of a team" } as ActionState;
    }

    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    const { teamApiKeys } = await import("@/lib/db/schema");
    await db
      .update(teamApiKeys)
      .set({
        revokedAt: new Date(),
      })
      .where(
        and(
          eq(teamApiKeys.id, data.keyId),
          eq(teamApiKeys.teamId, team.id),
          isNull(teamApiKeys.revokedAt)
        )
      );

    return { success: "API key revoked successfully" } as ActionState;
  }
);
