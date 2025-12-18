import { getTeamForUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { teamApiKeys } from "@/lib/db/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { requireTeamOwner } from "@/lib/auth/privileges";

export async function GET() {
  const team = await getTeamForUser();

  if (!team) {
    return Response.json({ error: "Team not found" }, { status: 404 });
  }

  // Require team owner
  try {
    await requireTeamOwner(team.id);
  } catch (error: any) {
    return Response.json(
      { error: error.message || "Unauthorized" },
      { status: 403 }
    );
  }

  // Fetch all API keys for the team
  const keys = await db
    .select({
      id: teamApiKeys.id,
      name: teamApiKeys.name,
      keyPrefix: teamApiKeys.keyPrefix,
      createdAt: teamApiKeys.createdAt,
      lastUsedAt: teamApiKeys.lastUsedAt,
      revokedAt: teamApiKeys.revokedAt,
    })
    .from(teamApiKeys)
    .where(eq(teamApiKeys.teamId, team.id))
    .orderBy(desc(teamApiKeys.createdAt));

  return Response.json(keys);
}
