import type { GreenhouseJob } from "./client";
import type { PostFetchFilter } from "@/lib/integrations/types";
import type { ClientSkill } from "@/lib/jobs/auto-detect";

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
 * Apply post-fetch filters to Greenhouse jobs
 * Filters are ANDed together - all filters must pass for a job to be included
 */
export function applyPostFetchFilters(
  jobs: GreenhouseJob[],
  filters: PostFetchFilter[],
  availableSkills?: ClientSkill[]
): GreenhouseJob[] {
  if (!filters || filters.length === 0) {
    return jobs;
  }

  return jobs.filter((job) => {
    // Combine title and content for text searches
    const searchableText = `${job.title} ${job.content}`.toLowerCase();
    const normalizedText = normalizeText(`${job.title} ${job.content || ""}`);

    // All filters must pass (AND logic)
    for (const filter of filters) {
      switch (filter.type) {
        case "ignore_if_contains":
          if (!filter.value) {
            return false; // Missing required value
          }
          if (searchableText.includes(filter.value.toLowerCase())) {
            return false; // Exclude this job
          }
          break;

        case "only_if_contains":
          if (!filter.value) {
            return false; // Missing required value
          }
          if (!searchableText.includes(filter.value.toLowerCase())) {
            return false; // Exclude this job
          }
          break;

        case "metadata_exists":
          if (!filter.value) {
            return false; // Missing required value
          }
          if (!job.metadata || !(filter.value in job.metadata)) {
            return false; // Exclude this job
          }
          break;

        case "metadata_matches":
          if (!filter.value) {
            return false; // Missing required value
          }
          if (
            !job.metadata ||
            !job.metadata[filter.field || filter.value] ||
            String(job.metadata[filter.field || filter.value]) !== filter.value
          ) {
            return false; // Exclude this job
          }
          break;

        case "has_detected_skill":
          if (!availableSkills) {
            return false; // Can't check without skills
          }

          // Check if any client skill name (or aliases) normalized is found in the normalized description
          const hasSkillMatch = availableSkills.some((skill) => {
            // Check skill name (normalized) using proper matching logic
            if (isSkillFoundInText(skill.skillNormalized, normalizedText)) {
              return true;
            }

            // Check aliases (normalized) using proper matching logic
            if (skill.aliases && skill.aliases.length > 0) {
              return skill.aliases.some((alias) => {
                const normalizedAlias = normalizeText(alias);
                return isSkillFoundInText(normalizedAlias, normalizedText);
              });
            }

            return false;
          });

          if (!hasSkillMatch) {
            return false; // No skills found, exclude
          }
          break;

        default:
          // Unknown filter type, include the job
          break;
      }
    }

    return true; // Include this job (all filters passed)
  });
}
