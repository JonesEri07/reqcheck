"use server";

import { redirect } from "next/navigation";
import {
  createCheckoutSession,
  getCheckoutSessionUrl,
  createCustomerPortalSession,
  changeSubscriptionPlan,
  cancelSubscriptionAtPeriodEnd,
  reactivateSubscription,
} from "./stripe";
import { withTeam } from "@/lib/auth/proxy";
import {
  PlanName,
  BillingPlan,
  teams,
  teamMembers,
  ActivityType,
} from "@/lib/db/schema";
import {
  PLAN_IDENTIFIERS,
  getPlanNameFromIdentifier,
} from "@/lib/constants/billing";
import { getUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { eq } from "drizzle-orm";
import { activityLogs, type NewActivityLog } from "@/lib/db/schema";

/**
 * Log activity to the activity log
 */
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

/**
 * Create a team and return checkout URL for users without a team
 */
export const createTeamAndCheckoutAction = async (
  prevState: ActionState,
  formData: FormData
): Promise<ActionState> => {
  try {
    const user = await getUser();
    if (!user) {
      return { error: "You must be logged in to create a team" };
    }

    const teamName = formData.get("teamName") as string;
    const priceId = formData.get("priceId") as string;
    const meterPriceId = formData.get("meterPriceId") as string;
    const planTypeParam = formData.get("planType") as string;

    if (!teamName || teamName.trim() === "") {
      return { error: "Team name is required" };
    }

    // Convert plan type string to PlanName enum
    // Handle both "BASIC"/"PRO" (from client) and "basic"/"pro-monthly" (from URL params)
    let planType: PlanName;
    if (planTypeParam) {
      // Try to get from identifier first (handles "basic", "pro-monthly")
      const fromIdentifier = getPlanNameFromIdentifier(planTypeParam);
      if (fromIdentifier) {
        planType = fromIdentifier;
      } else {
        // Handle direct enum values ("BASIC", "PRO")
        const upperParam = planTypeParam.toUpperCase();
        if (upperParam === "BASIC") {
          planType = PlanName.BASIC;
        } else if (upperParam === "PRO") {
          planType = PlanName.PRO;
        } else {
          planType = PlanName.PRO; // Default fallback
        }
      }
    } else {
      planType = PlanName.PRO; // Default fallback
    }

    // For BASIC and PRO tiers, both priceId and meterPriceId are required
    if (!priceId || priceId.trim() === "") {
      return { error: "Price ID is required for checkout" };
    }

    if (!meterPriceId || meterPriceId.trim() === "") {
      return { error: "Meter price ID is required for checkout" };
    }

    // Create a new team for the user
    const [createdTeam] = await db
      .insert(teams)
      .values({
        name: teamName.trim(),
        billingPlan: BillingPlan.MONTHLY,
      })
      .returning();

    if (!createdTeam) {
      return { error: "Failed to create team. Please try again." };
    }

    // Add user as owner to the team
    await db.insert(teamMembers).values({
      userId: user.id,
      teamId: createdTeam.id,
      role: "owner",
    });

    // Log activity
    await logActivity(createdTeam.id, user.id, ActivityType.CREATE_TEAM);

    // Get checkout URL
    const checkoutUrl = await getCheckoutSessionUrl({
      team: createdTeam,
      priceId: priceId,
      meterPriceId: meterPriceId,
      planType: planType,
    });

    return { checkoutUrl, success: "Redirecting to checkout..." };
  } catch (error: any) {
    return { error: error.message || "Failed to create team and checkout" };
  }
};

const checkoutActionWithTeam = withTeam(
  async (formData, team): Promise<ActionState> => {
    try {
      const priceId = formData.get("priceId") as string;
      const meterPriceId = formData.get("meterPriceId") as string;
      const planTypeParam = formData.get("planType") as string;

      // Convert plan type string to PlanName enum
      // Handle both "BASIC"/"PRO" (from client) and "basic"/"pro-monthly" (from URL params)
      let planType: PlanName;
      if (planTypeParam) {
        // Try to get from identifier first (handles "basic", "pro-monthly")
        const fromIdentifier = getPlanNameFromIdentifier(planTypeParam);
        if (fromIdentifier) {
          planType = fromIdentifier;
        } else {
          // Handle direct enum values ("BASIC", "PRO")
          const upperParam = planTypeParam.toUpperCase();
          if (upperParam === "BASIC") {
            planType = PlanName.BASIC;
          } else if (upperParam === "PRO") {
            planType = PlanName.PRO;
          } else {
            planType = PlanName.PRO; // Default fallback
          }
        }
      } else {
        planType = PlanName.PRO; // Default fallback
      }

      // For BASIC and PRO tiers, both priceId and meterPriceId are required
      if (!priceId || priceId.trim() === "") {
        return { error: "Price ID is required for checkout" };
      }

      if (!meterPriceId || meterPriceId.trim() === "") {
        return { error: "Meter price ID is required for checkout" };
      }

      // Get checkout URL instead of redirecting (for useActionState compatibility)
      const checkoutUrl = await getCheckoutSessionUrl({
        team: team,
        priceId: priceId,
        meterPriceId: meterPriceId,
        planType: planType,
      });

      return { checkoutUrl, success: "Redirecting to checkout..." };
    } catch (error: any) {
      return { error: error.message || "Failed to create checkout session" };
    }
  }
);

// Adapt for useActionState
export const checkoutAction = adaptForUseActionState(checkoutActionWithTeam);

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});

type ActionState = {
  error?: string;
  success?: string;
  checkoutUrl?: string;
};

// Wrapper to adapt withTeam actions for useActionState
function adaptForUseActionState<T extends ActionState>(
  action: (formData: FormData) => Promise<T>
) {
  return async (prevState: T, formData: FormData): Promise<T> => {
    return action(formData);
  };
}

export const upgradeSubscriptionAction = adaptForUseActionState(
  withTeam(async (formData, team): Promise<ActionState> => {
    try {
      const newPriceId = formData.get("priceId") as string;
      const newMeterPriceId = formData.get("meterPriceId") as string | null;

      if (!newPriceId) {
        return { error: "Price ID is required" };
      }

      await changeSubscriptionPlan({
        team,
        newPriceId,
        newMeterPriceId: newMeterPriceId || undefined,
        isUpgrade: true,
      });

      return { success: "Subscription upgraded successfully" };
    } catch (error: any) {
      return { error: error.message || "Failed to upgrade subscription" };
    }
  })
);

export const downgradeSubscriptionAction = adaptForUseActionState(
  withTeam(async (formData, team): Promise<ActionState> => {
    try {
      const newPriceId = formData.get("priceId") as string;
      const newMeterPriceId = formData.get("meterPriceId") as string | null;

      if (!newPriceId) {
        return { error: "Price ID is required" };
      }

      await changeSubscriptionPlan({
        team,
        newPriceId,
        newMeterPriceId: newMeterPriceId || undefined,
        isUpgrade: false,
      });

      return {
        success:
          "Subscription will be downgraded at the end of your current billing period",
      };
    } catch (error: any) {
      return { error: error.message || "Failed to schedule downgrade" };
    }
  })
);

export const cancelSubscriptionAction = adaptForUseActionState(
  withTeam(async (_, team): Promise<ActionState> => {
    try {
      await cancelSubscriptionAtPeriodEnd(team);
      return {
        success:
          "Subscription will be cancelled at the end of your current billing period",
      };
    } catch (error: any) {
      return { error: error.message || "Failed to cancel subscription" };
    }
  })
);

export const reactivateSubscriptionAction = adaptForUseActionState(
  withTeam(async (_, team): Promise<ActionState> => {
    try {
      await reactivateSubscription(team);
      return { success: "Subscription reactivated successfully" };
    } catch (error: any) {
      return { error: error.message || "Failed to reactivate subscription" };
    }
  })
);
