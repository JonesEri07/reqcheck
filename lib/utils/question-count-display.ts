/**
 * Utility functions for displaying question count settings
 */

export type QuestionCountSetting =
  | { type: "fixed"; value: number }
  | { type: "skillCount"; multiplier: number; maxLimit: number }
  | null
  | undefined;

/**
 * Format a question count setting for display
 */
export function formatQuestionCountSetting(
  setting: QuestionCountSetting
): string {
  if (!setting) {
    return "Team Default";
  }

  if (setting.type === "fixed") {
    return `${setting.value} questions`;
  }

  if (setting.type === "skillCount") {
    return `Skills × ${setting.multiplier} (max ${setting.maxLimit})`;
  }

  return "Team Default";
}

/**
 * Get a simple numeric value for backward compatibility
 * Returns the fixed value if type is "fixed", otherwise returns null
 */
export function getQuestionCountValue(
  setting: QuestionCountSetting
): number | null {
  if (!setting) {
    return null;
  }

  if (setting.type === "fixed") {
    return setting.value;
  }

  return null;
}
