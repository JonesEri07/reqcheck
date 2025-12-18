import { PlanName } from "@/lib/db/schema";

/**
 * Maximum number of challenge questions allowed per skill based on team tier
 */
export const TIER_QUESTION_LIMITS: Record<PlanName, number> = {
  [PlanName.FREE]: 10,
  [PlanName.PRO]: 50,
  [PlanName.ENTERPRISE]: 50, // Same as Pro for now
} as const;

/**
 * Maximum number of custom questions allowed total (across all skills) based on team tier
 */
export const TIER_CUSTOM_QUESTION_LIMITS: Record<PlanName, number> = {
  [PlanName.FREE]: 10,
  [PlanName.PRO]: 500,
  [PlanName.ENTERPRISE]: 500, // Same as Pro for now
} as const;

/**
 * Maximum number of jobs allowed total (across all statuses) based on team tier
 */
export const TIER_JOB_LIMITS: Record<PlanName, number> = {
  [PlanName.FREE]: 10,
  [PlanName.PRO]: 100,
  [PlanName.ENTERPRISE]: 500,
} as const;

/**
 * Get the maximum number of questions allowed per skill for a given plan tier
 */
export function getQuestionLimit(
  planName: PlanName | null | undefined
): number {
  if (!planName) {
    return TIER_QUESTION_LIMITS[PlanName.FREE];
  }
  return TIER_QUESTION_LIMITS[planName] ?? TIER_QUESTION_LIMITS[PlanName.FREE];
}

/**
 * Get the maximum number of custom questions allowed total (across all skills) for a given plan tier
 */
export function getCustomQuestionLimit(
  planName: PlanName | null | undefined
): number {
  if (!planName) {
    return TIER_CUSTOM_QUESTION_LIMITS[PlanName.FREE];
  }
  return (
    TIER_CUSTOM_QUESTION_LIMITS[planName] ??
    TIER_CUSTOM_QUESTION_LIMITS[PlanName.FREE]
  );
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
 * Check if a team has reached their total custom question limit (across all skills)
 */
export function hasReachedCustomQuestionLimit(
  currentCount: number,
  planName: PlanName | null | undefined
): boolean {
  const limit = getCustomQuestionLimit(planName);
  return currentCount >= limit;
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
 * Get remaining custom question slots for a team (total across all skills)
 */
export function getRemainingCustomQuestionSlots(
  currentCount: number,
  planName: PlanName | null | undefined
): number {
  const limit = getCustomQuestionLimit(planName);
  return Math.max(0, limit - currentCount);
}

/**
 * Get the maximum number of jobs allowed total for a given plan tier
 */
export function getJobLimit(planName: PlanName | null | undefined): number {
  if (!planName) {
    return TIER_JOB_LIMITS[PlanName.FREE];
  }
  return TIER_JOB_LIMITS[planName] ?? TIER_JOB_LIMITS[PlanName.FREE];
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
