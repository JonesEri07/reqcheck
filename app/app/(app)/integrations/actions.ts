"use server";

import { z } from "zod";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  teamIntegrations,
  teams,
  SyncFrequency,
  SyncBehavior,
} from "@/lib/db/schema";
import { validatedActionWithUser, type ActionState } from "@/lib/auth/proxy";
import { getTeamForUser } from "@/lib/db/queries";
import { requireTeamOwner } from "@/lib/auth/privileges";
import { getTeamIntegrationByType } from "@/lib/integrations/queries";
import type {
  GreenhouseConfig,
  PostFetchFilter,
} from "@/lib/integrations/types";
import { IntegrationType } from "@/lib/integrations/types";
import { syncGreenhouseJobs } from "@/lib/integrations/greenhouse/sync";

// Helper to parse nested form data
function parseNestedFormData(formData: FormData, prefix: string) {
  const result: Record<string, any> = {};
  for (const [key, value] of formData.entries()) {
    if (key.startsWith(prefix)) {
      const nestedKey = key.replace(prefix, "").replace(/^\[|\]$/g, "");
      result[nestedKey] = value;
    }
  }
  return result;
}

// Greenhouse connect schema - handles flat form data
const connectGreenhouseSchema = z.object({
  integrationType: z.string().transform((val) => val as IntegrationType),
  "config[boardToken]": z.string().min(1, "Board token is required"),
  "config[syncFrequency]": z
    .string()
    .transform((val) => val as SyncFrequency)
    .pipe(z.nativeEnum(SyncFrequency)),
  "config[syncBehavior]": z
    .string()
    .transform((val) => val as SyncBehavior)
    .pipe(z.nativeEnum(SyncBehavior)),
  "config[postFetchFilters]": z
    .string()
    .default("[]")
    .transform((val) => {
      if (!val || val === "[]") return [];
      try {
        return JSON.parse(val) as PostFetchFilter[];
      } catch {
        return [];
      }
    })
    .pipe(
      z.array(
        z.object({
          type: z.enum([
            "ignore_if_contains",
            "only_if_contains",
            "metadata_exists",
            "metadata_matches",
            "has_detected_skill",
          ]),
          value: z.string().optional(),
          field: z.string().optional(),
        })
      )
    ),
});

export const connectGreenhouse = validatedActionWithUser(
  connectGreenhouseSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    // Check if integration already exists
    const existing = await getTeamIntegrationByType(
      team.id,
      IntegrationType.GREENHOUSE
    );

    if (existing) {
      return {
        error: "Greenhouse integration is already connected",
      } as ActionState;
    }

    // Create integration
    const config: GreenhouseConfig = {
      boardToken: data["config[boardToken]"],
      syncFrequency: data["config[syncFrequency]"],
      syncBehavior: data["config[syncBehavior]"],
      postFetchFilters: data["config[postFetchFilters]"] || [],
    };

    await db.insert(teamIntegrations).values({
      teamId: team.id,
      integration: IntegrationType.GREENHOUSE,
      config: config as any,
      syncFrequency: config.syncFrequency,
      syncBehavior: config.syncBehavior,
    });

    return {
      success: "Greenhouse integration connected successfully",
    } as ActionState;
  }
);

// Update integration schema
const updateGreenhouseSchema = z.object({
  integrationId: z.string().uuid(),
  "config[boardToken]": z.string().min(1, "Board token is required"),
  "config[syncFrequency]": z
    .string()
    .transform((val) => val as SyncFrequency)
    .pipe(z.nativeEnum(SyncFrequency)),
  "config[syncBehavior]": z
    .string()
    .transform((val) => val as SyncBehavior)
    .pipe(z.nativeEnum(SyncBehavior)),
  "config[postFetchFilters]": z
    .string()
    .default("[]")
    .transform((val) => {
      if (!val || val === "[]") return [];
      try {
        return JSON.parse(val) as PostFetchFilter[];
      } catch {
        return [];
      }
    })
    .pipe(
      z.array(
        z.object({
          type: z.enum([
            "ignore_if_contains",
            "only_if_contains",
            "metadata_exists",
            "metadata_matches",
            "has_detected_skill",
          ]),
          value: z.string().optional(),
          field: z.string().optional(),
        })
      )
    ),
});

export const updateGreenhouse = validatedActionWithUser(
  updateGreenhouseSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    // Verify integration belongs to team
    const integration = await db
      .select()
      .from(teamIntegrations)
      .where(eq(teamIntegrations.id, data.integrationId))
      .limit(1);

    if (integration.length === 0) {
      return { error: "Integration not found" } as ActionState;
    }

    if (integration[0].teamId !== team.id) {
      return { error: "Unauthorized" } as ActionState;
    }

    // Update integration
    const config: GreenhouseConfig = {
      boardToken: data["config[boardToken]"],
      syncFrequency: data["config[syncFrequency]"],
      syncBehavior: data["config[syncBehavior]"],
      postFetchFilters: data["config[postFetchFilters]"] || [],
    };

    await db
      .update(teamIntegrations)
      .set({
        config: config as any,
        syncFrequency: config.syncFrequency,
        syncBehavior: config.syncBehavior,
        updatedAt: new Date(),
      })
      .where(eq(teamIntegrations.id, data.integrationId));

    return {
      success: "Greenhouse integration updated successfully",
    } as ActionState;
  }
);

// Disconnect integration
const disconnectIntegrationSchema = z.object({
  integrationId: z.string().uuid(),
});

export const disconnectIntegration = validatedActionWithUser(
  disconnectIntegrationSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    // Verify integration belongs to team
    const integration = await db
      .select()
      .from(teamIntegrations)
      .where(eq(teamIntegrations.id, data.integrationId))
      .limit(1);

    if (integration.length === 0) {
      return { error: "Integration not found" } as ActionState;
    }

    if (integration[0].teamId !== team.id) {
      return { error: "Unauthorized" } as ActionState;
    }

    // Delete integration
    await db
      .delete(teamIntegrations)
      .where(eq(teamIntegrations.id, data.integrationId));

    return { success: "Integration disconnected successfully" } as ActionState;
  }
);

// Sync integration
const syncIntegrationSchema = z.object({
  integrationId: z.string().uuid(),
});

export const syncIntegration = validatedActionWithUser(
  syncIntegrationSchema,
  async (data, formData, user) => {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" } as ActionState;
    }

    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return {
        error:
          error.message || "You must be a team owner to perform this action",
      } as ActionState;
    }

    // Get integration
    const integration = await db
      .select()
      .from(teamIntegrations)
      .where(eq(teamIntegrations.id, data.integrationId))
      .limit(1);

    if (integration.length === 0) {
      return { error: "Integration not found" } as ActionState;
    }

    if (integration[0].teamId !== team.id) {
      return { error: "Unauthorized" } as ActionState;
    }

    const int = integration[0];
    const config = int.config as any;

    // Get team settings for weights
    const teamRecord = await db
      .select()
      .from(teams)
      .where(eq(teams.id, team.id))
      .limit(1);

    if (teamRecord.length === 0) {
      return { error: "Team not found" } as ActionState;
    }

    const tagMatchWeight = parseFloat(teamRecord[0].tagMatchWeight || "1.5");
    const tagNoMatchWeight = parseFloat(
      teamRecord[0].tagNoMatchWeight || "1.0"
    );

    // Sync based on integration type
    if (int.integration === IntegrationType.GREENHOUSE) {
      const greenhouseConfig = config as GreenhouseConfig;
      const result = await syncGreenhouseJobs(
        team.id,
        greenhouseConfig,
        tagMatchWeight,
        tagNoMatchWeight
      );

      if (!result.success) {
        return { error: result.error || "Sync failed" } as ActionState;
      }

      // Update lastSyncAt
      await db
        .update(teamIntegrations)
        .set({
          lastSyncAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(teamIntegrations.id, data.integrationId));

      return {
        success: `Sync completed: ${result.jobsCreated} created, ${result.jobsUpdated} updated`,
        jobsCreated: result.jobsCreated,
        jobsUpdated: result.jobsUpdated,
      } as ActionState;
    }

    return { error: "Unsupported integration type" } as ActionState;
  }
);
