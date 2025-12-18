import { NextRequest, NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import { getTeamTags } from "@/lib/tags/queries";

export async function GET(request: NextRequest) {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tags = await getTeamTags(team.id);

    return NextResponse.json(tags);
  } catch (error: any) {
    console.error("Error fetching tags:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch tags" },
      { status: 500 }
    );
  }
}
