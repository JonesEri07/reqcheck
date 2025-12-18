import { NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import { clientChallengeQuestions } from "@/lib/db/schema";
import { db } from "@/lib/db/drizzle";
import { eq, count } from "drizzle-orm";

export async function GET() {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ count: 0 });
    }

    // Count total custom questions for the team (across all skills)
    const result = await db
      .select({ count: count() })
      .from(clientChallengeQuestions)
      .where(eq(clientChallengeQuestions.teamId, team.id));

    const totalCount = Number(result[0]?.count ?? 0);

    return NextResponse.json({ count: totalCount });
  } catch (error: any) {
    console.error("Error fetching custom questions count:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch count" },
      { status: 500 }
    );
  }
}
