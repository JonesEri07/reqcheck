import { db } from "@/lib/db/drizzle";
import { teamIntegrations, teams, SyncFrequency } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { syncGreenhouseJobs } from "./greenhouse/sync";
import { IntegrationType, type GreenhouseConfig } from "./types";

/**
 * Batch sync all integrations with a specific sync frequency
 *
 * @param syncFrequency - The sync frequency to process (HOURLY, DAILY, WEEKLY)
 * @returns Summary of sync results
 */
export async function batchSyncIntegrations(
  syncFrequency: SyncFrequency
): Promise<{
  integrationsProcessed: number;
  integrationsSucceeded: number;
  integrationsFailed: number;
  totalJobsCreated: number;
  totalJobsUpdated: number;
  errors: Array<{ integrationId: string; teamId: number; error: string }>;
}> {
  const errors: Array<{
    integrationId: string;
    teamId: number;
    error: string;
  }> = [];
  let integrationsProcessed = 0;
  let integrationsSucceeded = 0;
  let integrationsFailed = 0;
  let totalJobsCreated = 0;
  let totalJobsUpdated = 0;

  try {
    // Get all integrations with the specified sync frequency
    const integrations = await db
      .select()
      .from(teamIntegrations)
      .where(eq(teamIntegrations.syncFrequency, syncFrequency));

    if (integrations.length === 0) {
      return {
        integrationsProcessed: 0,
        integrationsSucceeded: 0,
        integrationsFailed: 0,
        totalJobsCreated: 0,
        totalJobsUpdated: 0,
        errors: [],
      };
    }

    // Process each integration
    for (const integration of integrations) {
      integrationsProcessed++;

      try {
        // Get team to get tag weights
        const team = await db
          .select()
          .from(teams)
          .where(eq(teams.id, integration.teamId))
          .limit(1);

        if (team.length === 0) {
          errors.push({
            integrationId: integration.id,
            teamId: integration.teamId,
            error: "Team not found",
          });
          integrationsFailed++;
          continue;
        }

        const teamRecord = team[0];
        const tagMatchWeight = parseFloat(teamRecord.tagMatchWeight || "1.5");
        const tagNoMatchWeight = parseFloat(
          teamRecord.tagNoMatchWeight || "1.0"
        );

        const config = integration.config as any;

        // Sync based on integration type
        if (integration.integration === IntegrationType.GREENHOUSE) {
          const greenhouseConfig = config as GreenhouseConfig;

          if (!greenhouseConfig?.boardToken) {
            errors.push({
              integrationId: integration.id,
              teamId: integration.teamId,
              error: "Missing Greenhouse board token",
            });
            integrationsFailed++;
            continue;
          }

          const result = await syncGreenhouseJobs(
            integration.teamId,
            greenhouseConfig,
            tagMatchWeight,
            tagNoMatchWeight
          );

          if (!result.success) {
            errors.push({
              integrationId: integration.id,
              teamId: integration.teamId,
              error: result.error || "Sync failed",
            });
            integrationsFailed++;
            continue;
          }

          // Update lastSyncAt on success
          await db
            .update(teamIntegrations)
            .set({
              lastSyncAt: new Date(),
              updatedAt: new Date(),
            })
            .where(eq(teamIntegrations.id, integration.id));

          integrationsSucceeded++;
          totalJobsCreated += result.jobsCreated;
          totalJobsUpdated += result.jobsUpdated;

          console.log(
            `Successfully synced integration ${integration.id} for team ${integration.teamId}: ${result.jobsCreated} created, ${result.jobsUpdated} updated`
          );
        } else {
          // Unsupported integration type - skip but don't count as error
          console.warn(
            `Unsupported integration type: ${integration.integration} for integration ${integration.id}`
          );
        }
      } catch (error: any) {
        const errorMessage = error.message || "Unknown error";
        errors.push({
          integrationId: integration.id,
          teamId: integration.teamId,
          error: errorMessage,
        });
        integrationsFailed++;
        console.error(
          `Error syncing integration ${integration.id} for team ${integration.teamId}:`,
          errorMessage
        );
      }
    }

    return {
      integrationsProcessed,
      integrationsSucceeded,
      integrationsFailed,
      totalJobsCreated,
      totalJobsUpdated,
      errors,
    };
  } catch (error: any) {
    console.error("Error in batch sync:", error);
    throw error;
  }
}
