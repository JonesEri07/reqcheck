/**
 * Question Count Calculation Utility
 * Calculates the number of questions to generate based on settings and eligible skill count
 */

export type QuestionCountSetting =
  | { type: "fixed"; value: number }
  | { type: "skillCount"; multiplier: number; maxLimit: number };

/**
 * Calculate the question count based on settings and eligible skill count
 *
 * @param setting - The question count setting (from job or team default)
 * @param eligibleSkillCount - The number of eligible skills for the job
 * @returns The calculated question count
 */
export function calculateQuestionCount(
  setting: QuestionCountSetting | null | undefined,
  eligibleSkillCount: number
): number {
  // If no setting provided, default to 5
  if (!setting) {
    return 5;
  }

  if (setting.type === "fixed") {
    return setting.value;
  }

  if (setting.type === "skillCount") {
    // Calculate: eligibleSkillCount * multiplier, rounded up
    const calculated = Math.ceil(eligibleSkillCount * setting.multiplier);
    // Cap by maxLimit if provided
    return setting.maxLimit > 0
      ? Math.min(calculated, setting.maxLimit)
      : calculated;
  }

  // Fallback
  return 5;
}

/**
 * Get question count setting from job, falling back to team default
 *
 * @param jobQuestionCount - Question count setting from job (can be null to use team default)
 * @param teamDefaultQuestionCount - Team default question count setting
 * @returns The question count setting to use
 */
export function getQuestionCountSetting(
  jobQuestionCount: QuestionCountSetting | null | undefined,
  teamDefaultQuestionCount: QuestionCountSetting
): QuestionCountSetting {
  // If job has a setting, use it; otherwise use team default
  return jobQuestionCount || teamDefaultQuestionCount;
}
