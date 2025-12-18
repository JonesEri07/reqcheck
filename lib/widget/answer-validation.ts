/**
 * Answer validation utilities
 */
import {
  isMultipleChoiceConfig,
  isFillBlankBlocksConfig,
  type MultipleChoiceQuestion,
  type FillBlankBlocksQuestion,
} from "@/challenge-question-types";

export interface AnswerResult {
  isCorrect: boolean;
}

/**
 * Validate a multiple choice answer
 */
function validateMultipleChoice(
  config: MultipleChoiceQuestion,
  answer: string
): boolean {
  // Case-insensitive, trimmed comparison
  return (
    config.correctAnswer.trim().toLowerCase() === answer.trim().toLowerCase()
  );
}

/**
 * Validate a fill blank blocks answer
 * Supports multiple options with same text - any option with correct text satisfies the blank
 */
function validateFillBlankBlocks(
  config: FillBlankBlocksQuestion,
  answer: string[]
): boolean {
  if (!Array.isArray(answer)) return false;
  if (answer.length !== config.correctAnswer.length) return false;

  // Compare each answer by text value (case-insensitive, trimmed)
  // Multiple options can have the same text, so we check if the provided text matches the correct text
  for (let i = 0; i < answer.length; i++) {
    const correctText = config.correctAnswer[i]?.trim().toLowerCase();
    const providedText = answer[i]?.trim().toLowerCase();

    // Text comparison - any option with the correct text value satisfies this blank
    if (correctText !== providedText) {
      return false;
    }
  }

  return true;
}

/**
 * Validate an answer based on question type
 */
export function validateAnswer(
  questionType: string,
  config: unknown,
  answer: string | string[]
): boolean {
  if (questionType === "multiple_choice") {
    if (!isMultipleChoiceConfig(config)) return false;
    if (typeof answer !== "string") return false;
    return validateMultipleChoice(config, answer);
  }

  if (questionType === "fill_blank_blocks") {
    if (!isFillBlankBlocksConfig(config)) return false;
    if (!Array.isArray(answer)) return false;
    return validateFillBlankBlocks(config, answer);
  }

  return false;
}
