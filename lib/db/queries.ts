import {
  desc,
  and,
  eq,
  isNull,
  isNotNull,
  gte,
  lte,
  sql,
  count,
} from "drizzle-orm";
import { db } from "./drizzle";
import {
  activityLogs,
  teamMembers,
  teams,
  users,
  PlanName,
  SubscriptionStatus,
  BillingPlan,
  teamBillingUsage,
  verificationAttempts,
  jobs,
  JobStatus,
  invitations,
} from "./schema";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth/session";
import { BILLING_CAPS } from "@/lib/constants/billing";
import type { PublicUser } from "@/lib/types/public-user";

export async function getUser() {
  const sessionCookie = (await cookies()).get("session");
  if (!sessionCookie || !sessionCookie.value) {
    return null;
  }

  const sessionData = await verifyToken(sessionCookie.value);
  if (
    !sessionData ||
    !sessionData.user ||
    typeof sessionData.user.id !== "number"
  ) {
    return null;
  }

  if (new Date(sessionData.expires) < new Date()) {
    return null;
  }

  const user = await db
    .select()
    .from(users)
    .where(and(eq(users.id, sessionData.user.id), isNull(users.deletedAt)))
    .limit(1);

  if (user.length === 0) {
    return null;
  }

  return user[0];
}

export async function getTeamByStripeCustomerId(customerId: string) {
  const result = await db
    .select()
    .from(teams)
    .where(eq(teams.stripeCustomerId, customerId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

export async function updateTeamSubscription(
  teamId: number,
  subscriptionData: {
    stripeSubscriptionId: string | null;
    planName: PlanName | null;
    subscriptionStatus: SubscriptionStatus | null;
    billingPlan?: BillingPlan;
  }
) {
  await db
    .update(teams)
    .set({
      ...subscriptionData,
      updatedAt: new Date(),
    })
    .where(eq(teams.id, teamId));
}

export async function getUserWithTeam(userId: number) {
  const result = await db
    .select({
      user: users,
      teamId: teamMembers.teamId,
    })
    .from(users)
    .leftJoin(teamMembers, eq(users.id, teamMembers.userId))
    .where(eq(users.id, userId))
    .limit(1);

  return result[0];
}

export async function getActivityLogs() {
  const user = await getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  return await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      timestamp: activityLogs.timestamp,
      ipAddress: activityLogs.ipAddress,
      userName: users.name,
    })
    .from(activityLogs)
    .leftJoin(users, eq(activityLogs.userId, users.id))
    .where(eq(activityLogs.userId, user.id))
    .orderBy(desc(activityLogs.timestamp))
    .limit(10);
}

export async function getTeamForUser() {
  const user = await getUser();
  if (!user) {
    return null;
  }

  // If user has a currentTeamId, use it
  if (user.currentTeamId) {
    const result = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.userId, user.id),
        eq(teamMembers.teamId, user.currentTeamId)
      ),
      with: {
        team: {
          with: {
            teamMembers: {
              with: {
                user: {
                  columns: {
                    id: true,
                    name: true,
                    email: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (result?.team) {
      return result.team;
    }
  }

  // If no currentTeamId or team not found, get first team and set it
  const firstTeamResult = await db.query.teamMembers.findFirst({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        with: {
          teamMembers: {
            with: {
              user: {
                columns: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (firstTeamResult?.team) {
    // Update user's currentTeamId if it's different
    if (user.currentTeamId !== firstTeamResult.team.id) {
      await db
        .update(users)
        .set({
          currentTeamId: firstTeamResult.team.id,
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));
    }
    return firstTeamResult.team;
  }

  return null;
}

/**
 * Get all teams that the current user is a member of
 * @returns Array of teams with team member info
 */
export async function getAllTeamsForUser() {
  const user = await getUser();
  if (!user) {
    return [];
  }

  const results = await db.query.teamMembers.findMany({
    where: eq(teamMembers.userId, user.id),
    with: {
      team: {
        columns: {
          id: true,
          name: true,
          createdAt: true,
        },
      },
    },
    orderBy: (teamMembers, { desc }) => [desc(teamMembers.joinedAt)],
  });

  return results.map((result) => ({
    id: result.team.id,
    name: result.team.name,
    role: result.role,
    joinedAt: result.joinedAt,
    isCurrent: result.team.id === user.currentTeamId,
  }));
}

/**
 * Update the user's current team
 * @param teamId The team ID to set as current
 * @returns true if successful, false otherwise
 */
export async function setCurrentTeamForUser(teamId: number) {
  const user = await getUser();
  if (!user) {
    return false;
  }

  // Verify user is a member of this team
  const teamMember = await db.query.teamMembers.findFirst({
    where: and(eq(teamMembers.userId, user.id), eq(teamMembers.teamId, teamId)),
  });

  if (!teamMember) {
    return false;
  }

  // Update user's currentTeamId
  await db
    .update(users)
    .set({
      currentTeamId: teamId,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return true;
}

/**
 * Get the current user's team member record with role
 * @param teamId Optional team ID. If not provided, uses user's current team
 * @returns Team member record with role, or null if not a member
 */
export async function getCurrentUserTeamMember(teamId?: number) {
  const user = await getUser();
  if (!user) {
    return null;
  }

  // If teamId is provided, query for that specific team
  if (teamId) {
    const result = await db.query.teamMembers.findFirst({
      where: and(
        eq(teamMembers.userId, user.id),
        eq(teamMembers.teamId, teamId)
      ),
    });
    return result || null;
  }

  // Otherwise, get user's current team member record
  const currentTeam = await getTeamForUser();
  if (!currentTeam) {
    return null;
  }

  const result = await db.query.teamMembers.findFirst({
    where: and(
      eq(teamMembers.userId, user.id),
      eq(teamMembers.teamId, currentTeam.id)
    ),
  });

  return result || null;
}

/**
 * Get all invitations for a team
 */
export async function getInvitationsForTeam(teamId: number) {
  return await db.query.invitations.findMany({
    where: eq(invitations.teamId, teamId),
    with: {
      invitedBy: {
        columns: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: (invitations, { desc }) => [desc(invitations.invitedAt)],
  });
}

/**
 * Get the current billing cycle usage record for a team
 */
export async function getCurrentBillingUsage(teamId: number) {
  const now = new Date();

  const usage = await db
    .select()
    .from(teamBillingUsage)
    .where(
      and(
        eq(teamBillingUsage.teamId, teamId),
        lte(teamBillingUsage.cycleStart, now),
        gte(teamBillingUsage.cycleEnd, now)
      )
    )
    .limit(1);

  return usage.length > 0 ? usage[0] : null;
}

/**
 * Get or create the current billing cycle usage record
 */
export async function getOrCreateCurrentBillingUsage(
  teamId: number,
  cycleStart: Date,
  cycleEnd: Date
) {
  const existing = await getCurrentBillingUsage(teamId);
  if (existing) {
    return existing;
  }

  // Get team's plan to set correct includedApplications cap
  const [team] = await db
    .select({ planName: teams.planName })
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1);

  const planName = (team?.planName as PlanName) || PlanName.FREE;
  const includedApplications =
    BILLING_CAPS[planName] ?? BILLING_CAPS[PlanName.FREE];

  // Create new usage record for the current cycle
  const [newUsage] = await db
    .insert(teamBillingUsage)
    .values({
      teamId,
      cycleStart,
      cycleEnd,
      includedApplications,
      actualApplications: 0,
    })
    .returning();

  return newUsage;
}

/**
 * Update billing usage record when upgrading plan (retroactive cap)
 * This implements Option 1: treat existing usage against the new cap
 */
export async function updateBillingUsageForUpgrade(
  teamId: number,
  newPlanName: PlanName,
  newMeterPriceId: string | null,
  subscriptionPeriodStart: Date,
  subscriptionPeriodEnd: Date
) {
  // Determine the new included applications cap based on plan
  const newIncludedApplications =
    BILLING_CAPS[newPlanName] ?? BILLING_CAPS[PlanName.FREE];

  // Get or create the current billing cycle usage record
  const usage = await getOrCreateCurrentBillingUsage(
    teamId,
    subscriptionPeriodStart,
    subscriptionPeriodEnd
  );

  // Update the usage record with new cap
  await db
    .update(teamBillingUsage)
    .set({
      includedApplications: newIncludedApplications,
      meteredPriceId: newMeterPriceId || usage.meteredPriceId,
      updatedAt: new Date(),
    })
    .where(eq(teamBillingUsage.id, usage.id));

  return {
    ...usage,
    includedApplications: newIncludedApplications,
    meteredPriceId: newMeterPriceId || usage.meteredPriceId,
  };
}

/**
 * Increment actualApplications count when a verification attempt is completed
 * Counts all completed attempts (pass or fail) - only incomplete (abandoned) attempts are not counted
 */
export async function incrementBillingUsage(teamId: number): Promise<void> {
  const billingUsage = await getCurrentBillingUsage(teamId);
  if (!billingUsage) {
    // No billing cycle record exists yet - skip increment
    // This can happen for free tier teams before first subscription
    return;
  }

  // Get the correct includedApplications cap
  // If includedApplications is 0 or not set, look up the team's plan
  let includedApplications = billingUsage.includedApplications || 0;
  if (includedApplications === 0) {
    const [team] = await db
      .select({ planName: teams.planName })
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    const planName = (team?.planName as PlanName) || PlanName.FREE;
    includedApplications =
      BILLING_CAPS[planName] ?? BILLING_CAPS[PlanName.FREE];

    // Update the billing usage record with the correct cap
    await db
      .update(teamBillingUsage)
      .set({
        includedApplications,
        updatedAt: new Date(),
      })
      .where(eq(teamBillingUsage.id, billingUsage.id));
  }

  // Increment actualApplications
  const newActualApplications = (billingUsage.actualApplications || 0) + 1;

  await db
    .update(teamBillingUsage)
    .set({
      actualApplications: newActualApplications,
      updatedAt: new Date(),
    })
    .where(eq(teamBillingUsage.id, billingUsage.id));
}

/**
 * Get non-sensitive user data for public routes
 * Returns null if user is not logged in
 */
export async function getUserPublicData(): Promise<PublicUser> {
  const user = await getUser();
  if (!user) {
    return null;
  }

  const team = await getTeamForUser();
  return {
    name: user.name,
    email: user.email,
    teamName: team?.name || null,
  };
}

export interface DashboardStats {
  totalApplications: number;
  applicationChange: number; // Percentage change
  passRate: number; // Percentage
  passRateChange: number; // Percentage change
  activeJobs: number;
  preventedApplicants: number; // Count of failed applications (spam/unfit prevented)
  preventedApplicantsChange: number; // Percentage change
  usage: number;
  usageLimit: number;
  usagePercentage: number;
  remaining: number;
  planName: PlanName;
}

/**
 * Get dashboard statistics for a team
 * TODO: Implement actual calculations with date comparisons
 */
export async function getDashboardStats(
  teamId: number
): Promise<DashboardStats> {
  const now = new Date();
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const twoMonthsAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

  // Get current month applications (passed verification attempts)
  const currentMonthApps = await db
    .select({ count: count(verificationAttempts.id) })
    .from(verificationAttempts)
    .where(
      and(
        eq(verificationAttempts.teamId, teamId),
        eq(verificationAttempts.passed, true),
        isNotNull(verificationAttempts.completedAt),
        gte(verificationAttempts.completedAt, oneMonthAgo)
      )
    );

  // Get previous month applications
  const previousMonthApps = await db
    .select({ count: count(verificationAttempts.id) })
    .from(verificationAttempts)
    .where(
      and(
        eq(verificationAttempts.teamId, teamId),
        eq(verificationAttempts.passed, true),
        isNotNull(verificationAttempts.completedAt),
        gte(verificationAttempts.completedAt, twoMonthsAgo),
        lte(verificationAttempts.completedAt, oneMonthAgo)
      )
    );

  const totalApplications = Number(currentMonthApps[0]?.count || 0);
  const prevTotal = Number(previousMonthApps[0]?.count || 0);
  const applicationChange =
    prevTotal > 0
      ? ((totalApplications - prevTotal) / prevTotal) * 100
      : totalApplications > 0
        ? 100
        : 0;

  // Get pass rate for current month
  // Note: All applications are passed=true by definition, so pass rate is 100%
  // But we calculate based on all attempts (passed + failed)
  const allAttemptsCurrent = await db
    .select({ count: count(verificationAttempts.id) })
    .from(verificationAttempts)
    .where(
      and(
        eq(verificationAttempts.teamId, teamId),
        isNotNull(verificationAttempts.completedAt),
        gte(verificationAttempts.completedAt, oneMonthAgo)
      )
    );

  const allAttemptsCount = Number(allAttemptsCurrent[0]?.count || 0);
  const passRate =
    allAttemptsCount > 0 ? (totalApplications / allAttemptsCount) * 100 : 0;

  // Get previous month pass rate
  const allAttemptsPrevious = await db
    .select({ count: count(verificationAttempts.id) })
    .from(verificationAttempts)
    .where(
      and(
        eq(verificationAttempts.teamId, teamId),
        isNotNull(verificationAttempts.completedAt),
        gte(verificationAttempts.completedAt, twoMonthsAgo),
        lte(verificationAttempts.completedAt, oneMonthAgo)
      )
    );

  const prevAllAttemptsCount = Number(allAttemptsPrevious[0]?.count || 0);
  const prevPassedCount = prevTotal;
  const prevPassRate =
    prevAllAttemptsCount > 0
      ? (prevPassedCount / prevAllAttemptsCount) * 100
      : 0;

  const passRateChange =
    prevPassRate > 0 ? passRate - prevPassRate : passRate > 0 ? passRate : 0;

  // Get active jobs
  const activeJobsResult = await db
    .select({ count: count(jobs.id) })
    .from(jobs)
    .where(
      and(
        eq(jobs.teamId, teamId),
        eq(jobs.status, JobStatus.OPEN),
        isNull(jobs.archivedAt)
      )
    );

  const activeJobs = Number(activeJobsResult[0]?.count || 0);

  // Get prevented applicants (failed verification attempts) for current month
  const failedAttempts = await db
    .select({ count: count(verificationAttempts.id) })
    .from(verificationAttempts)
    .where(
      and(
        eq(verificationAttempts.teamId, teamId),
        eq(verificationAttempts.passed, false),
        isNotNull(verificationAttempts.completedAt),
        gte(verificationAttempts.completedAt, oneMonthAgo)
      )
    );

  const preventedApplicants = Number(failedAttempts[0]?.count || 0);

  // Get previous month prevented applicants
  const prevFailedAttempts = await db
    .select({ count: count(verificationAttempts.id) })
    .from(verificationAttempts)
    .where(
      and(
        eq(verificationAttempts.teamId, teamId),
        eq(verificationAttempts.passed, false),
        isNotNull(verificationAttempts.completedAt),
        gte(verificationAttempts.completedAt, twoMonthsAgo),
        lte(verificationAttempts.completedAt, oneMonthAgo)
      )
    );

  const prevPrevented = Number(prevFailedAttempts[0]?.count || 0);
  const preventedApplicantsChange =
    prevPrevented > 0
      ? ((preventedApplicants - prevPrevented) / prevPrevented) * 100
      : preventedApplicants > 0
        ? 100
        : 0;

  // Get usage from billing
  const usage = await getCurrentBillingUsage(teamId);
  const team = await db
    .select()
    .from(teams)
    .where(eq(teams.id, teamId))
    .limit(1);

  const planNameRaw = team[0]?.planName;
  const planName: PlanName =
    planNameRaw && Object.values(PlanName).includes(planNameRaw as PlanName)
      ? (planNameRaw as PlanName)
      : PlanName.FREE;
  const usageLimit = BILLING_CAPS[planName];
  const actualUsage = usage?.actualApplications || 0;
  const usagePercentage = usageLimit > 0 ? (actualUsage / usageLimit) * 100 : 0;
  const remaining = Math.max(0, usageLimit - actualUsage);

  return {
    totalApplications,
    applicationChange: Math.round(applicationChange * 10) / 10,
    passRate: Math.round(passRate * 10) / 10,
    passRateChange: Math.round(passRateChange * 10) / 10,
    activeJobs,
    preventedApplicants,
    preventedApplicantsChange: Math.round(preventedApplicantsChange * 10) / 10,
    usage: actualUsage,
    usageLimit,
    usagePercentage: Math.round(usagePercentage * 10) / 10,
    remaining,
    planName,
  };
}

export interface ChartDataPoint {
  date: string;
  passed: number;
  failed: number;
}

/**
 * Get chart data for dashboard
 * Returns data points for the last 30 days
 * TODO: Implement actual date-based grouping
 */
export async function getDashboardChartData(
  teamId: number
): Promise<ChartDataPoint[]> {
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  // Get all verification attempts from last 30 days (both passed and failed)
  const allAttempts = await db
    .select({
      passed: verificationAttempts.passed,
      completedAt: verificationAttempts.completedAt,
    })
    .from(verificationAttempts)
    .where(
      and(
        eq(verificationAttempts.teamId, teamId),
        isNotNull(verificationAttempts.completedAt),
        gte(verificationAttempts.completedAt, thirtyDaysAgo)
      )
    )
    .orderBy(desc(verificationAttempts.completedAt));

  // Group by date (simplified - in production, use SQL date functions)
  const dataMap = new Map<string, { passed: number; failed: number }>();

  allAttempts.forEach((attempt) => {
    if (!attempt.completedAt) return;
    const date = new Date(attempt.completedAt).toISOString().split("T")[0];
    if (!dataMap.has(date)) {
      dataMap.set(date, { passed: 0, failed: 0 });
    }
    const dayData = dataMap.get(date)!;
    if (attempt.passed) {
      dayData.passed++;
    } else {
      dayData.failed++;
    }
  });

  // Convert to array and fill missing dates
  const result: ChartDataPoint[] = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    const dayData = dataMap.get(dateStr) || { passed: 0, failed: 0 };
    result.push({
      date: dateStr,
      passed: dayData.passed,
      failed: dayData.failed,
    });
  }

  return result;
}
