/**
 * Challenge Question Types
 *
 * These types define the structure for challenge questions stored in the database.
 * The database schema stores:
 * - `type`: "multiple_choice" | "fill_blank_blocks"
 * - `prompt`: string (the question text)
 * - `config`: JSONB containing type-specific configuration
 * - `imageUrl`: optional string
 * - `imageAltText`: optional string
 * - `timeLimitSeconds`: optional number
 */

export type Segment =
  | { type: "text"; text: string }
  | { type: "blank"; text: string } // text is the correct answer
  | { type: "newline" }
  | { type: "tab" };

export type MultipleChoiceQuestion = {
  options: string[];
  correctAnswer: string;
};

export type FillBlankBlocksQuestion = {
  templateSource: string;
  segments: Segment[];
  extraBlanks: string[];
  blocks: string[];
  correctAnswer: string[];
};

/**
 * Type guard to check if a config is a MultipleChoiceQuestion
 */
export function isMultipleChoiceConfig(
  config: unknown
): config is MultipleChoiceQuestion {
  return (
    typeof config === "object" &&
    config !== null &&
    "options" in config &&
    "correctAnswer" in config &&
    Array.isArray((config as any).options) &&
    typeof (config as any).correctAnswer === "string"
  );
}

/**
 * Type guard to check if a config is a FillBlankBlocksQuestion
 */
export function isFillBlankBlocksConfig(
  config: unknown
): config is FillBlankBlocksQuestion {
  return (
    typeof config === "object" &&
    config !== null &&
    "templateSource" in config &&
    "segments" in config &&
    "extraBlanks" in config &&
    "blocks" in config &&
    "correctAnswer" in config &&
    Array.isArray((config as any).segments) &&
    Array.isArray((config as any).extraBlanks) &&
    Array.isArray((config as any).blocks) &&
    Array.isArray((config as any).correctAnswer)
  );
}
