import { NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import {
  getRecentNotificationsForTeam,
  getUnreadNotificationCount,
} from "@/lib/notifications/queries";

export async function GET() {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const [notifications, unreadCount] = await Promise.all([
      getRecentNotificationsForTeam(team.id, 5),
      getUnreadNotificationCount(team.id),
    ]);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error: any) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}
