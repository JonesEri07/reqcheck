import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { teamIntegrations } from "@/lib/db/schema";

/**
 * Get team integration by integration type
 */
export async function getTeamIntegrationByType(
  teamId: number,
  integrationType: string
) {
  return await db.query.teamIntegrations.findFirst({
    where: (integrations, { eq, and }) =>
      and(
        eq(integrations.teamId, teamId),
        eq(integrations.integration, integrationType)
      ),
  });
}

/**
 * Get all integrations for a team
 */
export async function getIntegrationsForTeam(teamId: number) {
  return await db.query.teamIntegrations.findMany({
    where: (integrations, { eq }) => eq(integrations.teamId, teamId),
    orderBy: (integrations, { desc }) => [desc(integrations.createdAt)],
  });
}
