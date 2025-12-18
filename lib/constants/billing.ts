import { PlanName } from "@/lib/db/schema";

/**
 * Billing caps for each plan tier
 * Maps PlanName enum to included application limits
 */
export const BILLING_CAPS: Record<PlanName, number> = {
  [PlanName.FREE]: 50,
  [PlanName.PRO]: 500,
  [PlanName.ENTERPRISE]: 10000, // High cap for enterprise (should be configurable per customer)
} as const;

/**
 * URL-friendly plan identifiers used in query parameters and routes
 * Maps to combinations of PlanName and BillingPlan enums
 */
export const PLAN_IDENTIFIERS = {
  FREE: "free",
  PRO_MONTHLY: "pro-monthly",
  PRO_ANNUAL: "pro-annual",
} as const;

export type PlanIdentifier =
  (typeof PLAN_IDENTIFIERS)[keyof typeof PLAN_IDENTIFIERS];

/**
 * Helper to get PlanName from plan identifier
 */
export function getPlanNameFromIdentifier(
  identifier: string | null | undefined
): PlanName | null {
  if (!identifier) return null;
  switch (identifier) {
    case PLAN_IDENTIFIERS.FREE:
      return PlanName.FREE;
    case PLAN_IDENTIFIERS.PRO_MONTHLY:
    case PLAN_IDENTIFIERS.PRO_ANNUAL:
      return PlanName.PRO;
    default:
      return null;
  }
}
