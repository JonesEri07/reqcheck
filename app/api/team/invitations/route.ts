import { NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import { getInvitationsForTeam } from "@/lib/db/queries";
import { requireTeamOwner } from "@/lib/auth/privileges";

export async function GET() {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    // Require team owner
    try {
      await requireTeamOwner(team.id);
    } catch (error: any) {
      return NextResponse.json(
        { error: error.message || "Unauthorized" },
        { status: 403 }
      );
    }

    const invitations = await getInvitationsForTeam(team.id);

    return NextResponse.json(invitations);
  } catch (error: any) {
    console.error("Error fetching invitations:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

