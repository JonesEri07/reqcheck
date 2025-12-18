"use server";

import { redirect } from "next/navigation";
import {
  createCheckoutSession,
  createCustomerPortalSession,
  changeSubscriptionPlan,
  cancelSubscriptionAtPeriodEnd,
  reactivateSubscription,
} from "./stripe";
import { withTeam } from "@/lib/auth/proxy";
import { PlanName } from "@/lib/db/schema";
import {
  PLAN_IDENTIFIERS,
  getPlanNameFromIdentifier,
} from "@/lib/constants/billing";

export const checkoutAction = withTeam(async (formData, team) => {
  const priceId = formData.get("priceId") as string;
  const meterPriceId = formData.get("meterPriceId") as string;
  const planTypeParam = formData.get("planType") as string;

  // Convert plan type string to PlanName enum
  const planType = planTypeParam
    ? getPlanNameFromIdentifier(planTypeParam) || PlanName.PRO
    : PlanName.PRO;

  // For Free tier, only meterPriceId is required
  if (planType === PlanName.FREE) {
    if (!meterPriceId || meterPriceId.trim() === "") {
      throw new Error("Meter price ID is required for Free tier checkout");
    }
    await createCheckoutSession({
      team: team,
      meterPriceId: meterPriceId,
      planType: PlanName.FREE,
    });
    return;
  }

  // For Pro tier, priceId is required
  if (!priceId || priceId.trim() === "") {
    throw new Error("Price ID is required for Pro checkout");
  }

  await createCheckoutSession({
    team: team,
    priceId: priceId,
    meterPriceId: meterPriceId,
    planType: planType,
  });
});

export const customerPortalAction = withTeam(async (_, team) => {
  const portalSession = await createCustomerPortalSession(team);
  redirect(portalSession.url);
});

type ActionState = {
  error?: string;
  success?: string;
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
