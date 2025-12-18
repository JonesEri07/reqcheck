"use server";

import { getTeamForUser, getUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import {
  jobs,
  applications,
  clientSkills,
  clientChallengeQuestions,
  notifications,
  NotificationStatus,
  teamMembers,
  ActivityType,
  users,
  type NewActivityLog,
  activityLogs,
} from "@/lib/db/schema";
import { eq, and, or, ilike, isNull } from "drizzle-orm";
import { validatedActionWithUser } from "@/lib/auth/proxy";
import { z } from "zod";

async function logActivity(
  teamId: number | null | undefined,
  userId: number,
  type: ActivityType
) {
  if (teamId === null || teamId === undefined) {
    return;
  }
  const newActivity: NewActivityLog = {
    teamId,
    userId,
    action: type,
    ipAddress: "",
  };
  await db.insert(activityLogs).values(newActivity);
}

export interface GlobalSearchResult {
  jobs: Array<{
    id: string;
    title: string;
    externalJobId: string;
    status: string;
  }>;
  applications: Array<{
    id: string;
    email: string;
    jobTitle: string | null;
  }>;
  skills: Array<{
    id: string;
    skillName: string;
  }>;
  questions: Array<{
    id: string;
    prompt: string;
    skillName: string;
    skillId: string;
  }>;
}

export async function globalSearch(
  query: string
): Promise<GlobalSearchResult | { error: string }> {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" };
    }

    if (!query || query.trim().length === 0) {
      return {
        jobs: [],
        applications: [],
        skills: [],
        questions: [],
      };
    }

    const searchTerm = `%${query.trim()}%`;

    // Search jobs
    const jobsResults = await db
      .select({
        id: jobs.id,
        title: jobs.title,
        externalJobId: jobs.externalJobId,
        status: jobs.status,
      })
      .from(jobs)
      .where(
        and(
          eq(jobs.teamId, team.id),
          isNull(jobs.archivedAt),
          or(
            ilike(jobs.title, searchTerm),
            ilike(jobs.externalJobId, searchTerm),
            ilike(jobs.description, searchTerm)
          )!
        )
      )
      .limit(5);

    // Search applications by email
    const applicationsResults = await db
      .select({
        id: applications.id,
        email: applications.email,
        jobId: applications.jobId,
      })
      .from(applications)
      .where(
        and(
          eq(applications.teamId, team.id),
          ilike(applications.email, searchTerm)
        )
      )
      .limit(5);

    // Get job titles for applications
    const applicationJobIds = applicationsResults.map((app) => app.jobId);
    const applicationJobs =
      applicationJobIds.length > 0
        ? await db
            .select({
              id: jobs.id,
              title: jobs.title,
            })
            .from(jobs)
            .where(
              and(
                eq(jobs.teamId, team.id),
                or(...applicationJobIds.map((id) => eq(jobs.id, id)))!
              )
            )
        : [];

    const jobTitleMap = new Map(
      applicationJobs.map((job) => [job.id, job.title])
    );

    const applicationsWithJobTitles = applicationsResults.map((app) => ({
      id: app.id,
      email: app.email,
      jobTitle: jobTitleMap.get(app.jobId) || null,
    }));

    // Search skills
    const skillsResults = await db
      .select({
        id: clientSkills.id,
        skillName: clientSkills.skillName,
      })
      .from(clientSkills)
      .where(
        and(
          eq(clientSkills.teamId, team.id),
          or(
            ilike(clientSkills.skillName, searchTerm),
            ilike(clientSkills.skillNormalized, searchTerm)
          )!
        )
      )
      .limit(5);

    // Search questions by prompt
    const questionsResults = await db
      .select({
        id: clientChallengeQuestions.id,
        prompt: clientChallengeQuestions.prompt,
        clientSkillId: clientChallengeQuestions.clientSkillId,
      })
      .from(clientChallengeQuestions)
      .where(
        and(
          eq(clientChallengeQuestions.teamId, team.id),
          ilike(clientChallengeQuestions.prompt, searchTerm)
        )
      )
      .limit(5);

    // Get skill names for questions
    const questionSkillIds = questionsResults.map((q) => q.clientSkillId);
    const questionSkills =
      questionSkillIds.length > 0
        ? await db
            .select({
              id: clientSkills.id,
              skillName: clientSkills.skillName,
            })
            .from(clientSkills)
            .where(
              and(
                eq(clientSkills.teamId, team.id),
                or(...questionSkillIds.map((id) => eq(clientSkills.id, id)))!
              )
            )
        : [];

    const skillNameMap = new Map(
      questionSkills.map((skill) => [skill.id, skill.skillName])
    );

    const questionsWithSkillNames = questionsResults.map((q) => ({
      id: q.id,
      prompt: q.prompt,
      skillName: skillNameMap.get(q.clientSkillId) || "Unknown Skill",
      skillId: q.clientSkillId,
    }));

    return {
      jobs: jobsResults,
      applications: applicationsWithJobTitles,
      skills: skillsResults,
      questions: questionsWithSkillNames,
    };
  } catch (error: any) {
    console.error("Global search error:", error);
    return { error: error.message || "Search failed" };
  }
}

/**
 * Mark a notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<{ success: string } | { error: string }> {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" };
    }

    // Verify notification belongs to team
    const notification = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.teamId, team.id)
        )
      )
      .limit(1);

    if (notification.length === 0) {
      return { error: "Notification not found" };
    }

    // Update notification status
    await db
      .update(notifications)
      .set({
        status: NotificationStatus.READ,
        readAt: new Date(),
      })
      .where(eq(notifications.id, notificationId));

    return { success: "Notification marked as read" };
  } catch (error: any) {
    console.error("Mark notification as read error:", error);
    return { error: error.message || "Failed to mark notification as read" };
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<
  { success: string } | { error: string }
> {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" };
    }

    // Update all unread notifications for the team
    await db
      .update(notifications)
      .set({
        status: NotificationStatus.READ,
        readAt: new Date(),
      })
      .where(
        and(
          eq(notifications.teamId, team.id),
          eq(notifications.status, NotificationStatus.UNREAD),
          isNull(notifications.archivedAt)
        )
      );

    return { success: "All notifications marked as read" };
  } catch (error: any) {
    console.error("Mark all notifications as read error:", error);
    return {
      error: error.message || "Failed to mark all notifications as read",
    };
  }
}

/**
 * Accept team invitation from notification
 */
const acceptTeamInvitationSchema = z.object({
  notificationId: z.string().uuid(),
});

export const acceptTeamInvitation = validatedActionWithUser(
  acceptTeamInvitationSchema,
  async (data, _, user) => {
    const { notificationId } = data;

    try {
      // Get the notification
      const [notification] = await db
        .select()
        .from(notifications)
        .where(
          and(
            eq(notifications.id, notificationId),
            eq(notifications.type, "TEAM_INVITATION")
          )
        )
        .limit(1);

      if (!notification) {
        return { error: "Notification not found" };
      }

      // Get invitation details from metadata
      const metadata = notification.metadata as {
        invitationTeamId?: number;
        invitationTeamName?: string;
        role?: string;
      };

      if (!metadata?.invitationTeamId || !metadata?.role) {
        return { error: "Invalid invitation notification" };
      }

      const invitationTeamId = metadata.invitationTeamId;
      const role = metadata.role;

      // Check if user is already a member of this team
      const existingMember = await db.query.teamMembers.findFirst({
        where: and(
          eq(teamMembers.userId, user.id),
          eq(teamMembers.teamId, invitationTeamId)
        ),
      });

      if (existingMember) {
        // User is already a member, just mark notification as read
        await db
          .update(notifications)
          .set({
            status: NotificationStatus.READ,
            readAt: new Date(),
          })
          .where(eq(notifications.id, notificationId));

        return {
          error: "You are already a member of this team",
        };
      }

      // Add user to the team
      await db.insert(teamMembers).values({
        userId: user.id,
        teamId: invitationTeamId,
        role,
      });

      // Set this team as the user's current team if they don't have one
      const currentUser = await getUser();
      if (currentUser && !currentUser.currentTeamId) {
        await db
          .update(users)
          .set({ currentTeamId: invitationTeamId })
          .where(eq(users.id, user.id));
      }

      // Mark notification as read
      await db
        .update(notifications)
        .set({
          status: NotificationStatus.READ,
          readAt: new Date(),
        })
        .where(eq(notifications.id, notificationId));

      // Log activity
      await logActivity(
        invitationTeamId,
        user.id,
        ActivityType.ACCEPT_INVITATION
      );

      return {
        success: `You've joined ${metadata.invitationTeamName || "the team"}!`,
      };
    } catch (error: any) {
      console.error("Accept team invitation error:", error);
      return {
        error: error.message || "Failed to accept team invitation",
      };
    }
  }
);

/**
 * Archive a notification
 */
export async function archiveNotification(
  notificationId: string
): Promise<{ success: string } | { error: string }> {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return { error: "Team not found" };
    }

    // Verify notification belongs to team
    const notification = await db
      .select()
      .from(notifications)
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.teamId, team.id)
        )
      )
      .limit(1);

    if (notification.length === 0) {
      return { error: "Notification not found" };
    }

    // Archive notification
    await db
      .update(notifications)
      .set({
        status: NotificationStatus.ARCHIVED,
        archivedAt: new Date(),
      })
      .where(eq(notifications.id, notificationId));

    return { success: "Notification archived" };
  } catch (error: any) {
    console.error("Archive notification error:", error);
    return { error: error.message || "Failed to archive notification" };
  }
}
