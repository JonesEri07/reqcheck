import { SyncFrequency, SyncBehavior } from "@/lib/db/schema";

/**
 * Base integration config interface
 */
export interface BaseIntegrationConfig {
  syncFrequency: SyncFrequency;
  syncBehavior: SyncBehavior;
}

/**
 * Post-fetch filter types
 */
export type PostFetchFilterType =
  | "ignore_if_contains"
  | "only_if_contains"
  | "metadata_exists"
  | "metadata_matches"
  | "has_detected_skill";

export interface PostFetchFilter {
  type: PostFetchFilterType;
  value?: string; // The value to check against (e.g., text to search for, metadata key, etc.) - not required for "has_detected_skill"
  field?: string; // For metadata filters, the metadata field name
}

/**
 * Greenhouse integration configuration
 */
export interface GreenhouseConfig extends BaseIntegrationConfig {
  boardToken: string;
  postFetchFilters?: PostFetchFilter[];
}

/**
 * Union type for all integration configs
 */
export type IntegrationConfig = GreenhouseConfig;

/**
 * Integration type names
 */
export enum IntegrationType {
  GREENHOUSE = "greenhouse",
  // Future: LEVER = "lever",
  // Future: WORKDAY = "workday",
}

/**
 * Integration metadata
 */
export interface IntegrationMetadata {
  type: IntegrationType;
  name: string;
  description: string;
  icon?: string;
  documentationUrl?: string;
}

/**
 * Available integrations metadata
 */
export const AVAILABLE_INTEGRATIONS: Record<
  IntegrationType,
  IntegrationMetadata
> = {
  [IntegrationType.GREENHOUSE]: {
    type: IntegrationType.GREENHOUSE,
    name: "Greenhouse",
    description: "Sync jobs from Greenhouse Job Board API",
    documentationUrl:
      "https://developers.greenhouse.io/job-board.html#introduction",
  },
};
