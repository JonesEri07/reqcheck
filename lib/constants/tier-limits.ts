import { PlanName } from "@/lib/db/schema";

/**
 * Maximum number of challenge questions allowed per skill based on team tier
 */
export const TIER_QUESTION_LIMITS: Record<PlanName, number> = {
  [PlanName.BASIC]: 10,
  [PlanName.PRO]: 50,
  [PlanName.ENTERPRISE]: 50, // Same as Pro for now
} as const;

/**
 * Maximum number of custom skills allowed based on team tier
 */
export const TIER_CUSTOM_SKILL_LIMITS: Record<PlanName, number> = {
  [PlanName.BASIC]: 10,
  [PlanName.PRO]: 500,
  [PlanName.ENTERPRISE]: 500, // Same as Pro for now
} as const;

/**
 * Maximum number of jobs allowed total (across all statuses) based on team tier
 */
export const TIER_JOB_LIMITS: Record<PlanName, number> = {
  [PlanName.BASIC]: 10,
  [PlanName.PRO]: 100,
  [PlanName.ENTERPRISE]: 500,
} as const;

/**
 * Maximum number of team members allowed based on team tier
 */
export const TIER_TEAM_MEMBER_LIMITS: Record<PlanName, number> = {
  [PlanName.BASIC]: 1, // Owner only
  [PlanName.PRO]: 6, // Owner + 5 additional
  [PlanName.ENTERPRISE]: 21, // Owner + 20 additional
} as const;

/**
 * Get the maximum number of questions allowed per skill for a given plan tier
 */
export function getQuestionLimit(
  planName: PlanName | null | undefined
): number {
  if (!planName) {
    return TIER_QUESTION_LIMITS[PlanName.BASIC];
  }
  return TIER_QUESTION_LIMITS[planName] ?? TIER_QUESTION_LIMITS[PlanName.BASIC];
}

/**
 * Get the maximum number of custom skills allowed for a given plan tier
 */
export function getCustomSkillLimit(
  planName: PlanName | null | undefined
): number {
  if (!planName) {
    return TIER_CUSTOM_SKILL_LIMITS[PlanName.BASIC];
  }
  return (
    TIER_CUSTOM_SKILL_LIMITS[planName] ??
    TIER_CUSTOM_SKILL_LIMITS[PlanName.BASIC]
  );
}

/**
 * @deprecated Use getCustomSkillLimit instead. This function is kept for backward compatibility.
 */
export function getCustomQuestionLimit(
  planName: PlanName | null | undefined
): number {
  return getCustomSkillLimit(planName);
}

/**
 * Check if a team has reached their question limit per skill
 */
export function hasReachedQuestionLimit(
  currentCount: number,
  planName: PlanName | null | undefined
): boolean {
  const limit = getQuestionLimit(planName);
  return currentCount >= limit;
}

/**
 * Check if a team has reached their custom skills limit
 */
export function hasReachedCustomSkillLimit(
  currentCount: number,
  planName: PlanName | null | undefined
): boolean {
  const limit = getCustomSkillLimit(planName);
  return currentCount >= limit;
}

/**
 * @deprecated Use hasReachedCustomSkillLimit instead. This function is kept for backward compatibility.
 */
export function hasReachedCustomQuestionLimit(
  currentCount: number,
  planName: PlanName | null | undefined
): boolean {
  return hasReachedCustomSkillLimit(currentCount, planName);
}

/**
 * Get remaining question slots for a team per skill
 */
export function getRemainingQuestionSlots(
  currentCount: number,
  planName: PlanName | null | undefined
): number {
  const limit = getQuestionLimit(planName);
  return Math.max(0, limit - currentCount);
}

/**
 * Get remaining custom skill slots for a team
 */
export function getRemainingCustomSkillSlots(
  currentCount: number,
  planName: PlanName | null | undefined
): number {
  const limit = getCustomSkillLimit(planName);
  return Math.max(0, limit - currentCount);
}

/**
 * @deprecated Use getRemainingCustomSkillSlots instead. This function is kept for backward compatibility.
 */
export function getRemainingCustomQuestionSlots(
  currentCount: number,
  planName: PlanName | null | undefined
): number {
  return getRemainingCustomSkillSlots(currentCount, planName);
}

/**
 * Get the maximum number of jobs allowed total for a given plan tier
 */
export function getJobLimit(planName: PlanName | null | undefined): number {
  if (!planName) {
    return TIER_JOB_LIMITS[PlanName.BASIC];
  }
  return TIER_JOB_LIMITS[planName] ?? TIER_JOB_LIMITS[PlanName.BASIC];
}

/**
 * Check if a team has reached their job limit
 */
export function hasReachedJobLimit(
  currentCount: number,
  planName: PlanName | null | undefined
): boolean {
  const limit = getJobLimit(planName);
  return currentCount >= limit;
}

/**
 * Get remaining job slots for a team
 */
export function getRemainingJobSlots(
  currentCount: number,
  planName: PlanName | null | undefined
): number {
  const limit = getJobLimit(planName);
  return Math.max(0, limit - currentCount);
}

/**
 * Get the maximum number of team members allowed for a given plan tier
 */
export function getTeamMemberLimit(
  planName: PlanName | null | undefined
): number {
  if (!planName) {
    return TIER_TEAM_MEMBER_LIMITS[PlanName.BASIC];
  }
  return (
    TIER_TEAM_MEMBER_LIMITS[planName] ??
    TIER_TEAM_MEMBER_LIMITS[PlanName.BASIC]
  );
}

/**
 * Check if a team has reached their team member limit
 */
export function hasReachedTeamMemberLimit(
  currentCount: number,
  planName: PlanName | null | undefined
): boolean {
  const limit = getTeamMemberLimit(planName);
  return currentCount >= limit;
}

/**
 * Get remaining team member slots for a team
 */
export function getRemainingTeamMemberSlots(
  currentCount: number,
  planName: PlanName | null | undefined
): number {
  const limit = getTeamMemberLimit(planName);
  return Math.max(0, limit - currentCount);
}

/**
 * Plan tier hierarchy for feature access checks
 * Higher number = higher tier
 */
const PLAN_TIER_LEVELS: Record<PlanName, number> = {
  [PlanName.BASIC]: 0,
  [PlanName.PRO]: 1,
  [PlanName.ENTERPRISE]: 2,
} as const;

/**
 * Minimum tier required for features
 */
export const FEATURE_MINIMUM_TIERS = {
  PRO_PLUS: PlanName.PRO, // Pro or Enterprise
  ENTERPRISE: PlanName.ENTERPRISE, // Enterprise only
} as const;

/**
 * Check if a plan meets the minimum tier requirement for a feature
 * @param planName - Current plan name
 * @param minimumTier - Minimum tier required (e.g., PlanName.PRO for Pro+ features)
 * @returns true if plan meets or exceeds the minimum tier requirement
 */
export function hasFeatureAccess(
  planName: PlanName | null | undefined,
  minimumTier: PlanName
): boolean {
  if (!planName) {
    return minimumTier === PlanName.BASIC;
  }

  const currentTierLevel = PLAN_TIER_LEVELS[planName] ?? 0;
  const requiredTierLevel = PLAN_TIER_LEVELS[minimumTier] ?? 0;

  return currentTierLevel >= requiredTierLevel;
}

/**
 * Check if a plan is Pro or higher (Pro+)
 * @param planName - Current plan name
 * @returns true if plan is PRO or ENTERPRISE
 */
export function isProPlus(planName: PlanName | null | undefined): boolean {
  return hasFeatureAccess(planName, PlanName.PRO);
}
