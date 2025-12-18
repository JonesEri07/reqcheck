import { NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import { clientSkills } from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { eq, count, isNull, and, sql } from "drizzle-orm";

export async function GET() {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ count: 0 });
    }

    // Count total custom skills for the team (skills where skillTaxonomyId is null)
    const result = await db
      .select({ count: count() })
      .from(clientSkills)
      .where(
        and(
          eq(clientSkills.teamId, team.id),
          sql`${clientSkills.skillTaxonomyId} IS NULL`
        )
      );

    const totalCount = Number(result[0]?.count ?? 0);

    return NextResponse.json({ count: totalCount });
  } catch (error: any) {
    console.error("Error fetching custom skills count:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch count" },
      { status: 500 }
    );
  }
}
