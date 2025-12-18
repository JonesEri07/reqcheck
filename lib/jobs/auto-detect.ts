/**
 * Auto-detection utilities for job skills and question weights
 * Based on AUTO_DETECTION_AND_QUIZ_GENERATION.md
 */

import type { QuestionWithTags } from "@/lib/skills/queries";
import type { InferSelectModel } from "drizzle-orm";
import { clientSkills } from "@/lib/db/schema";

export type ClientSkill = InferSelectModel<typeof clientSkills>;
export type ClientChallengeQuestion = QuestionWithTags;

/**
 * Normalize text for matching (lowercase, trim)
 */
function normalizeText(text: string): string {
  return text.toLowerCase().trim();
}

/**
 * Check if a normalized skill name is found in normalized text
 * Uses word boundary matching to avoid false positives
 */
function isSkillFoundInText(
  normalizedSkill: string,
  normalizedText: string
): boolean {
  // For single character skills like "r", use exact word matching
  if (normalizedSkill.length === 1) {
    // Match as whole word (surrounded by non-word characters or start/end)
    const regex = new RegExp(`\\b${normalizedSkill}\\b`, "i");
    return regex.test(normalizedText);
  }

  // For multi-word skills, check if the normalized skill appears as a whole
  // This handles cases like "react native" vs "react"
  return normalizedText.includes(normalizedSkill);
}

/**
 * Find all match positions of a skill in text
 * Returns array of [startIndex, endIndex] pairs
 */
function findSkillMatches(
  normalizedSkill: string,
  normalizedText: string
): Array<[number, number]> {
  const matches: Array<[number, number]> = [];

  if (normalizedSkill.length === 1) {
    // For single character, find all word boundary matches
    const regex = new RegExp(`\\b${normalizedSkill}\\b`, "gi");
    let match;
    while ((match = regex.exec(normalizedText)) !== null) {
      matches.push([match.index, match.index + normalizedSkill.length]);
    }
  } else {
    // For multi-word, find all occurrences
    let startIndex = 0;
    while (true) {
      const index = normalizedText.indexOf(normalizedSkill, startIndex);
      if (index === -1) break;
      matches.push([index, index + normalizedSkill.length]);
      startIndex = index + 1;
    }
  }

  return matches;
}

/**
 * Check if two ranges overlap
 */
function rangesOverlap(
  [start1, end1]: [number, number],
  [start2, end2]: [number, number]
): boolean {
  return start1 < end2 && start2 < end1;
}

/**
 * Check if a skill is mentioned in the title
 */
function isInTitle(normalizedSkill: string, jobTitle: string): boolean {
  const normalizedTitle = normalizeText(jobTitle);
  return isSkillFoundInText(normalizedSkill, normalizedTitle);
}

/**
 * Check if a skill is mentioned in the first paragraph
 */
function isInFirstParagraph(
  normalizedSkill: string,
  description: string
): boolean {
  if (!description) return false;
  const firstParagraph = description.split(/\n\n|\. /)[0];
  const normalizedParagraph = normalizeText(firstParagraph);
  return isSkillFoundInText(normalizedSkill, normalizedParagraph);
}

/**
 * Count how many times a skill is mentioned in the description
 */
function countMentions(normalizedSkill: string, description: string): number {
  if (!description) return 0;
  const normalizedDesc = normalizeText(description);

  // For single character skills, count word boundaries
  if (normalizedSkill.length === 1) {
    const regex = new RegExp(`\\b${normalizedSkill}\\b`, "gi");
    const matches = normalizedDesc.match(regex);
    return matches ? matches.length : 0;
  }

  // For multi-word, count occurrences
  return normalizedDesc.split(normalizedSkill).length - 1;
}

/**
 * Calculate skill weight based on position and frequency
 */
export function calculateSkillWeight(
  normalizedSkill: string,
  jobTitle: string,
  description: string
): number {
  let weight = 1.0;

  // Factor 1: Position (max +1.0)
  if (isInTitle(normalizedSkill, jobTitle)) weight += 1.0;
  else if (isInFirstParagraph(normalizedSkill, description)) weight += 0.5;

  // Factor 2: Frequency (max +0.6)
  const mentions = countMentions(normalizedSkill, description);
  weight += Math.min(mentions * 0.2, 0.6);

  // Cap between 0.5 and 3.0
  return Math.max(0.5, Math.min(3.0, weight));
}

/**
 * Check if any question tags match the job title or description
 */
function hasTagMatch(
  question: ClientChallengeQuestion,
  jobTitle: string,
  description: string
): boolean {
  const searchText = `${jobTitle} ${description || ""}`.toLowerCase();
  return question.tags.some((tag) =>
    searchText.includes(tag.name.toLowerCase())
  );
}

/**
 * Auto-detect skills from job title and description
 */
export function detectSkills(
  jobTitle: string,
  description: string,
  availableSkills: ClientSkill[]
): Array<{ skill: ClientSkill; weight: number }> {
  const normalizedTitle = normalizeText(jobTitle);
  const normalizedDescription = normalizeText(description || "");
  const normalizedText = `${normalizedTitle} ${normalizedDescription}`;

  const detected: Array<{ skill: ClientSkill; weight: number }> = [];
  const matchedSkillNormalized = new Set<string>(); // Track matched normalized skill names
  const excludedSkillNormalized = new Set<string>(); // Track excluded shorter skills

  // Sort skills by normalized name length (longest first) to handle nested skills
  // This ensures "tailwind css" is checked before "css"
  const sortedSkills = [...availableSkills].sort((a, b) => {
    const aLength = a.skillNormalized.length;
    const bLength = b.skillNormalized.length;
    if (aLength !== bLength) {
      return bLength - aLength; // Longer first
    }
    return a.skillNormalized.localeCompare(b.skillNormalized);
  });

  for (const skill of sortedSkills) {
    const normalizedSkill = skill.skillNormalized;

    // Skip if this skill is already matched or excluded
    if (
      matchedSkillNormalized.has(normalizedSkill) ||
      excludedSkillNormalized.has(normalizedSkill)
    ) {
      continue;
    }

    let skillMatched = false;
    let matchPositionsForSkill: Array<[number, number]> = [];

    // Check if normalized skill name is found in the text
    if (isSkillFoundInText(normalizedSkill, normalizedText)) {
      skillMatched = true;
      matchPositionsForSkill = findSkillMatches(
        normalizedSkill,
        normalizedText
      );
    }

    // Also check aliases (normalized)
    if (!skillMatched && skill.aliases && skill.aliases.length > 0) {
      for (const alias of skill.aliases) {
        const normalizedAlias = normalizeText(alias);
        if (isSkillFoundInText(normalizedAlias, normalizedText)) {
          skillMatched = true;
          matchPositionsForSkill = findSkillMatches(
            normalizedAlias,
            normalizedText
          );
          break;
        }
      }
    }

    if (skillMatched) {
      // Mark this skill as matched
      matchedSkillNormalized.add(normalizedSkill);

      // Check shorter skills that are substrings of this longer skill
      // Only exclude them if ALL their matches overlap with this longer skill's matches
      for (const otherSkill of availableSkills) {
        const otherNormalized = otherSkill.skillNormalized;

        // Check if this is a nested skill (shorter and substring of longer)
        if (
          otherNormalized.length < normalizedSkill.length &&
          normalizedSkill.includes(otherNormalized) &&
          !matchedSkillNormalized.has(otherNormalized)
        ) {
          // Find all match positions of the shorter skill
          const shorterMatches = findSkillMatches(
            otherNormalized,
            normalizedText
          );

          // Check if ALL shorter skill matches overlap with longer skill matches
          const allOverlap = shorterMatches.every((shorterMatch) =>
            matchPositionsForSkill.some((longerMatch) =>
              rangesOverlap(shorterMatch, longerMatch)
            )
          );

          // Only exclude if all matches overlap (meaning shorter skill only appears as part of longer)
          if (allOverlap && shorterMatches.length > 0) {
            excludedSkillNormalized.add(otherNormalized);
          }
        }
      }

      const weight = calculateSkillWeight(
        normalizedSkill,
        jobTitle,
        description || ""
      );
      detected.push({ skill, weight });
    }
  }

  // Sort by weight descending
  detected.sort((a, b) => b.weight - a.weight);

  return detected;
}

/**
 * Calculate question weight based on tag matching
 */
export function calculateQuestionWeight(
  question: ClientChallengeQuestion,
  jobTitle: string,
  description: string,
  tagMatchWeight: number,
  tagNoMatchWeight: number
): number {
  const hasMatch = hasTagMatch(question, jobTitle, description);
  return hasMatch ? tagMatchWeight : tagNoMatchWeight;
}

/**
 * Auto-detect skills and assign question weights
 */
export function autoDetectJobSkillsAndWeights(
  jobTitle: string,
  description: string,
  availableSkills: ClientSkill[],
  allQuestions: Map<string, ClientChallengeQuestion[]>, // skillId -> questions
  tagMatchWeight: number,
  tagNoMatchWeight: number
): {
  jobSkills: Array<{
    clientSkillId: string;
    skillName: string;
    weight: number;
    required: boolean;
    manuallyAdded: boolean;
  }>;
  questionWeights: Array<{
    clientSkillId: string;
    clientChallengeQuestionId: string;
    weight: number;
  }>;
} {
  // Detect skills
  const detectedSkills = detectSkills(jobTitle, description, availableSkills);

  const jobSkills = detectedSkills.map(({ skill, weight }) => ({
    clientSkillId: skill.id,
    skillName: skill.skillName,
    weight: parseFloat(weight.toFixed(2)),
    required: true,
    manuallyAdded: false,
  }));

  // Calculate question weights for each detected skill
  const questionWeights: Array<{
    clientSkillId: string;
    clientChallengeQuestionId: string;
    weight: number;
  }> = [];

  for (const { skill } of detectedSkills) {
    const questions = allQuestions.get(skill.id) || [];
    for (const question of questions) {
      const weight = calculateQuestionWeight(
        question,
        jobTitle,
        description || "",
        tagMatchWeight,
        tagNoMatchWeight
      );
      questionWeights.push({
        clientSkillId: skill.id,
        clientChallengeQuestionId: question.id,
        weight: parseFloat(weight.toFixed(2)),
      });
    }
  }

  return { jobSkills, questionWeights };
}
