import { eq, and, desc, isNull, count } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import { notifications, NotificationStatus } from "@/lib/db/schema";

export interface NotificationWithRelations {
  id: string;
  teamId: number;
  jobId: string | null;
  applicationId: string | null;
  type: string;
  title: string;
  message: string;
  metadata: any;
  status: string;
  createdAt: Date;
  readAt: Date | null;
  archivedAt: Date | null;
  job: {
    id: string;
    title: string;
    externalJobId: string;
  } | null;
  application: {
    id: string;
    email: string;
  } | null;
}

/**
 * Get all notifications for a team
 */
export async function getNotificationsForTeam(
  teamId: number,
  options?: {
    includeArchived?: boolean;
    limit?: number;
  }
) {
  const conditions = [eq(notifications.teamId, teamId)];

  if (!options?.includeArchived) {
    conditions.push(isNull(notifications.archivedAt));
  }

  const notificationsList = await db.query.notifications.findMany({
    where: (notifications, { eq, and, isNull }) =>
      and(
        eq(notifications.teamId, teamId),
        options?.includeArchived ? undefined : isNull(notifications.archivedAt)
      ),
    with: {
      job: {
        columns: {
          id: true,
          title: true,
          externalJobId: true,
        },
      },
      application: {
        columns: {
          id: true,
          email: true,
        },
      },
    },
    orderBy: (notifications, { desc }) => [desc(notifications.createdAt)],
    limit: options?.limit,
  });

  return notificationsList;
}

/**
 * Get unread notification count for a team
 */
export async function getUnreadNotificationCount(teamId: number) {
  const result = await db
    .select({ count: count() })
    .from(notifications)
    .where(
      and(
        eq(notifications.teamId, teamId),
        eq(notifications.status, NotificationStatus.UNREAD),
        isNull(notifications.archivedAt)
      )
    );

  return Number(result[0]?.count || 0);
}

/**
 * Get recent notifications for a team (for dropdown)
 */
export async function getRecentNotificationsForTeam(
  teamId: number,
  limit: number = 5
) {
  return await getNotificationsForTeam(teamId, {
    includeArchived: false,
    limit,
  });
}
