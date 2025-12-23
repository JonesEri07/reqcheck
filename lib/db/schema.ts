import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  integer,
  uuid,
  jsonb,
  numeric,
  boolean,
  index,
  unique,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export enum ActivityType {
  SIGN_UP = "SIGN_UP",
  SIGN_IN = "SIGN_IN",
  SIGN_OUT = "SIGN_OUT",
  UPDATE_PASSWORD = "UPDATE_PASSWORD",
  DELETE_ACCOUNT = "DELETE_ACCOUNT",
  UPDATE_ACCOUNT = "UPDATE_ACCOUNT",
  CREATE_TEAM = "CREATE_TEAM",
  UPDATE_TEAM = "UPDATE_TEAM",
  REMOVE_TEAM_MEMBER = "REMOVE_TEAM_MEMBER",
  UPDATE_TEAM_MEMBER = "UPDATE_TEAM_MEMBER",
  INVITE_TEAM_MEMBER = "INVITE_TEAM_MEMBER",
  ACCEPT_INVITATION = "ACCEPT_INVITATION",
}

export enum BillingPlan {
  MONTHLY = "MONTHLY", // Monthly billing interval
}

export enum JobStatus {
  OPEN = "OPEN",
  DRAFT = "DRAFT",
  ARCHIVED = "ARCHIVED",
}

export enum WaitlistStatus {
  PENDING = "PENDING",
  CONTACTED = "CONTACTED",
  CONVERTED = "CONVERTED",
  DECLINED = "DECLINED",
}

export enum NotificationType {
  APPLICATION_RECEIVED = "APPLICATION_RECEIVED",
  APPLICATION_VERIFIED = "APPLICATION_VERIFIED",
  JOB_POSTED = "JOB_POSTED",
  JOB_UPDATED = "JOB_UPDATED",
  INTEGRATION_SYNC_COMPLETE = "INTEGRATION_SYNC_COMPLETE",
  SYSTEM_ALERT = "SYSTEM_ALERT",
  TEAM_INVITATION = "TEAM_INVITATION",
  QUICK_SETUP_COMPLETE = "QUICK_SETUP_COMPLETE",
}

export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
  ARCHIVED = "ARCHIVED",
}

export enum SyncChallengeQuestions {
  NONE = "NONE",
  REQCHECK = "REQCHECK",
}

export enum SyncFrequency {
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MANUALLY = "MANUALLY",
}

export enum JobSource {
  MANUAL = "MANUAL",
  GREENHOUSE = "GREENHOUSE",
}

export enum PlanName {
  BASIC = "BASIC",
  PRO = "PRO",
  ENTERPRISE = "ENTERPRISE",
}

export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELLED = "CANCELLED",
  PAUSED = "PAUSED",
}

export enum SyncBehavior {
  REPLACE_ALL = "REPLACE_ALL",
  KEEP_MANUAL = "KEEP_MANUAL",
  SMART = "SMART",
}

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: varchar("role", { length: 20 }).notNull().default("member"),
  currentTeamId: integer("current_team_id").references(() => teams.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  deletedAt: timestamp("deleted_at"),
  notificationPreferences: jsonb("notification_preferences").default({}),
});

export const emailVerifications = pgTable(
  "email_verifications",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).notNull(),
    otp: varchar("otp", { length: 6 }).notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    verified: boolean("verified").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    // Store sign-up data temporarily until OTP is verified
    passwordHash: text("password_hash"),
    teamName: varchar("team_name", { length: 100 }),
    plan: varchar("plan", { length: 20 }), // basic, pro-monthly
    inviteId: varchar("invite_id", { length: 50 }),
  },
  (table) => ({
    emailIdx: index("email_verifications_email_idx").on(table.email),
    otpIdx: index("email_verifications_otp_idx").on(table.otp),
    expiresAtIdx: index("email_verifications_expires_at_idx").on(
      table.expiresAt
    ),
  })
);

export const teams = pgTable(
  "teams",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    // Existing Stripe fields
    stripeCustomerId: text("stripe_customer_id").unique(),
    stripeSubscriptionId: text("stripe_subscription_id").unique(),
    planName: varchar("plan_name", { length: 50 }), // PlanName enum: BASIC, PRO, ENTERPRISE, or null
    subscriptionStatus: varchar("subscription_status", { length: 20 }), // SubscriptionStatus enum: ACTIVE, CANCELLED, PAUSED, or null
    // Billing
    billingPlan: varchar("billing_plan", { length: 20 }), // BillingPlan enum: MONTHLY, or null for teams without subscriptions
    // Settings
    whitelistUrls: text("whitelist_urls").array().default([]),
    onboardingComplete: boolean("onboarding_complete").notNull().default(false),
    quickSetupDidComplete: boolean("quick_setup_did_complete")
      .notNull()
      .default(false),
    stopWidgetAtFreeCap: boolean("stop_widget_at_free_cap")
      .notNull()
      .default(false),
    // Defaults
    defaultQuestionTimeLimitSeconds: integer(
      "default_question_time_limit_seconds"
    )
      .notNull()
      .default(0),
    defaultPassThreshold: integer("default_pass_threshold")
      .notNull()
      .default(60),
    defaultQuestionCount: jsonb("default_question_count")
      .$type<
        | { type: "fixed"; value: number }
        | { type: "skillCount"; multiplier: number; maxLimit: number }
      >()
      .notNull()
      .default({ type: "fixed", value: 5 }),
    // Weights
    tagMatchWeight: numeric("tag_match_weight", { precision: 3, scale: 2 })
      .notNull()
      .default("1.5"),
    tagNoMatchWeight: numeric("tag_no_match_weight", { precision: 3, scale: 2 })
      .notNull()
      .default("1.0"),
    // Sync
    syncChallengeQuestions: varchar("sync_challenge_questions", { length: 20 })
      .notNull()
      .default(SyncChallengeQuestions.NONE),
    // Widget Styles
    widgetStyles: jsonb("widget_styles").$type<{
      fontColor?: string;
      backgroundColor?: string;
      buttonColor?: string;
      buttonTextColor?: string;
      accentColor?: string; // For selected answers, progress bars, etc.
    }>(),
  },
  (table) => ({
    billingPlanIdx: index("teams_billing_plan_idx").on(table.billingPlan),
    subscriptionStatusIdx: index("teams_subscription_status_idx").on(
      table.subscriptionStatus
    ),
  })
);

export const teamMembers = pgTable(
  "team_members",
  {
    id: serial("id").primaryKey(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id),
    role: varchar("role", { length: 50 }).notNull(),
    joinedAt: timestamp("joined_at").notNull().defaultNow(),
  },
  (table) => ({
    userTeamUnique: unique("team_members_user_id_team_id_unique").on(
      table.userId,
      table.teamId
    ),
  })
);

export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  userId: integer("user_id").references(() => users.id),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp").notNull().defaultNow(),
  ipAddress: varchar("ip_address", { length: 45 }),
});

export const invitations = pgTable("invitations", {
  id: serial("id").primaryKey(),
  teamId: integer("team_id")
    .notNull()
    .references(() => teams.id),
  email: varchar("email", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).notNull(),
  invitedBy: integer("invited_by")
    .notNull()
    .references(() => users.id),
  invitedAt: timestamp("invited_at").notNull().defaultNow(),
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
});

// Core Team Tables
export const teamIntegrations = pgTable(
  "team_integrations",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" })
      .unique(),
    integration: varchar("integration", { length: 255 }).notNull(), // name of the integration (e.g. greenhouse, lever, workday, etc.)
    config: jsonb("config"), // JSONB for integration-specific configuration such as keys, tokens, filters, etc.
    lastSyncAt: timestamp("last_sync_at"),
    syncFrequency: varchar("sync_frequency", {
      length: 20,
    })
      .notNull()
      .default(SyncFrequency.MANUALLY),
    syncBehavior: varchar("sync_behavior", {
      length: 20,
    })
      .notNull()
      .default(SyncBehavior.REPLACE_ALL),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    teamIdIdx: index("team_integrations_team_id_idx").on(table.teamId),
  })
);

export const teamBillingUsage = pgTable(
  "team_billing_usage",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    // Cycle tracking
    cycleStart: timestamp("cycle_start").notNull(),
    cycleEnd: timestamp("cycle_end").notNull(),
    // Usage tracking
    includedApplications: integer("included_applications").notNull().default(0),
    actualApplications: integer("actual_applications").notNull().default(0),
    // Stripe sync
    meteredPriceId: text("metered_price_id"),
    stripeReported: boolean("stripe_reported").notNull().default(false),
    lastStripeSyncAt: timestamp("last_stripe_sync_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    teamIdCycleUnique: unique(
      "team_billing_usage_team_id_cycle_start_unique"
    ).on(table.teamId, table.cycleStart),
    teamIdIdx: index("team_billing_usage_team_id_idx").on(table.teamId),
    cycleStartIdx: index("team_billing_usage_cycle_start_idx").on(
      table.cycleStart
    ),
    stripeReportedIdx: index("team_billing_usage_stripe_reported_idx").on(
      table.stripeReported
    ),
  })
);

export const teamApiKeys = pgTable(
  "team_api_keys",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    name: varchar("name", { length: 255 }).notNull(),
    keyPrefix: varchar("key_prefix", { length: 255 }).notNull(),
    hashedKey: text("hashed_key").notNull(),
    createdByUserId: integer("created_by_user_id").references(() => users.id),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    lastUsedAt: timestamp("last_used_at"),
    revokedAt: timestamp("revoked_at"),
  },
  (table) => ({
    hashedKeyUnique: unique("team_api_keys_hashed_key_unique").on(
      table.hashedKey
    ),
    teamIdIdx: index("team_api_keys_team_id_idx").on(table.teamId),
    keyPrefixIdx: index("team_api_keys_key_prefix_idx").on(table.keyPrefix),
  })
);

// Job & Application Tables
export const jobs = pgTable(
  "jobs",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    // Job identification
    externalJobId: varchar("external_job_id", { length: 255 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    // Challenge settings
    passThreshold: integer("pass_threshold"),
    questionCount: jsonb("question_count").$type<
      | { type: "fixed"; value: number }
      | { type: "skillCount"; multiplier: number; maxLimit: number }
      | null
    >(),
    // Status
    status: varchar("status", { length: 20 }).notNull().default(JobStatus.OPEN),
    // Source tracking
    source: varchar("source", { length: 20 })
      .notNull()
      .default(JobSource.MANUAL),
    archivedAt: timestamp("archived_at"),
    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    lastApplicationAt: timestamp("last_application_at"),
  },
  (table) => ({
    teamIdExternalJobIdUnique: unique("jobs_team_id_external_job_id_unique").on(
      table.teamId,
      table.externalJobId
    ),
    teamIdStatusIdx: index("jobs_team_id_status_idx").on(
      table.teamId,
      table.status
    ),
    teamIdExternalJobIdIdx: index("jobs_team_id_external_job_id_idx").on(
      table.teamId,
      table.externalJobId
    ),
    teamIdSourceStatusIdx: index("jobs_team_id_source_status_idx").on(
      table.teamId,
      table.source,
      table.status
    ),
    statusArchivedAtIdx: index("jobs_status_archived_at_idx").on(
      table.status,
      table.archivedAt
    ),
  })
);

export const jobSkills = pgTable(
  "job_skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    // Skill reference (always ClientSkill)
    clientSkillId: uuid("client_skill_id")
      .notNull()
      .references(() => clientSkills.id, { onDelete: "cascade" }),
    // Skill metadata
    required: boolean("required").notNull().default(true),
    weight: numeric("weight", { precision: 3, scale: 2 })
      .notNull()
      .default("1.0"),
    // Tracking
    manuallyAdded: boolean("manually_added").notNull().default(false),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    jobIdClientSkillIdUnique: unique(
      "job_skills_job_id_client_skill_id_unique"
    ).on(table.jobId, table.clientSkillId),
    jobIdIdx: index("job_skills_job_id_idx").on(table.jobId),
    clientSkillIdIdx: index("job_skills_client_skill_id_idx").on(
      table.clientSkillId
    ),
  })
);

export const verificationAttempts = pgTable(
  "verification_attempts",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // References
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    jobId: uuid("job_id")
      .notNull()
      .references(() => jobs.id, { onDelete: "cascade" }),
    // Candidate identity
    email: varchar("email", { length: 255 }).notNull(),
    emailNormalized: varchar("email_normalized", { length: 255 }).notNull(),
    // Session
    sessionToken: text("session_token").unique(),
    // Attempt tracking
    startedAt: timestamp("started_at").notNull(),
    completedAt: timestamp("completed_at"),
    abandonedAt: timestamp("abandoned_at"),
    retryCount: integer("retry_count").notNull().default(0),
    // Results
    score: integer("score"),
    passThreshold: integer("pass_threshold"),
    passed: boolean("passed"),
    timeTakenSeconds: integer("time_taken_seconds"),
    // Verification token (if passed)
    verificationToken: text("verification_token").unique(),
    tokenExpiresAt: timestamp("token_expires_at"),
    // Redirect token for hosted quiz page (contains signed redirect URLs)
    redirectToken: text("redirect_token"),
    // Metadata
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    referralSource: varchar("referral_source", { length: 255 }),
    deviceType: varchar("device_type", { length: 50 }),
    // Billing
    stripeReported: boolean("stripe_reported").notNull().default(false),
  },
  (table) => ({
    emailNormalizedJobIdStartedAtIdx: index(
      "verification_attempts_email_normalized_job_id_started_at_idx"
    ).on(table.emailNormalized, table.jobId, table.startedAt),
    sessionTokenIdx: index("verification_attempts_session_token_idx").on(
      table.sessionToken
    ),
    verificationTokenIdx: index(
      "verification_attempts_verification_token_idx"
    ).on(table.verificationToken),
    jobIdCompletedAtIdx: index(
      "verification_attempts_job_id_completed_at_idx"
    ).on(table.jobId, table.completedAt),
    teamIdCompletedAtIdx: index(
      "verification_attempts_team_id_completed_at_idx"
    ).on(table.teamId, table.completedAt),
    passedScoreIdx: index("verification_attempts_passed_score_idx").on(
      table.passed,
      table.score
    ),
  })
);

// Skill & Question Tables
export const tags = pgTable(
  "tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    patterns: text("patterns").array().default([]),
    usageCount: integer("usage_count").notNull().default(0),
    color: varchar("color", { length: 50 }),
    sortOrder: integer("sort_order"),
    deletedAt: timestamp("deleted_at"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    teamIdSlugDeletedAtUnique: unique("tags_team_id_slug_deleted_at_unique").on(
      table.teamId,
      table.slug,
      table.deletedAt
    ),
    teamIdIdx: index("tags_team_id_idx").on(table.teamId),
  })
);

export const skillTaxonomy = pgTable(
  "skill_taxonomy",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    skillName: varchar("skill_name", { length: 255 }).notNull().unique(),
    skillNormalized: varchar("skill_normalized", { length: 255 }).notNull(),
    // Aliases
    aliases: text("aliases").array().default([]),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    skillNormalizedIdx: index("skill_taxonomy_skill_normalized_idx").on(
      table.skillNormalized
    ),
  })
);

export const promotionalSkills = pgTable(
  "promotional_skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Matching words (union of all normalized skill names + aliases from upvotes)
    matchingWords: text("matching_words").array().default([]),
    // Upvote tracking
    upvoteCount: integer("upvote_count").notNull().default(1),
    // Name frequency tracking (for canonical name selection)
    nameFrequency: jsonb("name_frequency").notNull().default("{}"),
    // Promotion tracking
    promotedAt: timestamp("promoted_at"),
    promotedToTaxonomyId: uuid("promoted_to_taxonomy_id")
      .unique()
      .references(() => skillTaxonomy.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    upvoteCountIdx: index("promotional_skills_upvote_count_idx").on(
      table.upvoteCount
    ),
    promotedAtIdx: index("promotional_skills_promoted_at_idx").on(
      table.promotedAt
    ),
  })
);

export const promotionalSkillUpvotes = pgTable(
  "promotional_skill_upvotes",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    promotionalSkillId: uuid("promotional_skill_id")
      .notNull()
      .references(() => promotionalSkills.id, { onDelete: "cascade" }),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    // The skill name the team used
    skillName: varchar("skill_name", { length: 255 }).notNull(),
    // The aliases they provided
    aliases: text("aliases").array().default([]),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    promotionalSkillIdTeamIdUnique: unique(
      "promotional_skill_upvotes_promotional_skill_id_team_id_unique"
    ).on(table.promotionalSkillId, table.teamId),
    promotionalSkillIdIdx: index(
      "promotional_skill_upvotes_promotional_skill_id_idx"
    ).on(table.promotionalSkillId),
    teamIdIdx: index("promotional_skill_upvotes_team_id_idx").on(table.teamId),
  })
);

export const skillCategories = pgTable(
  "skill_categories",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    description: text("description"),
    parentId: uuid("parent_id"),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    sortOrder: integer("sort_order"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
    deletedAt: timestamp("deleted_at"),
  },
  (table) => ({
    teamIdSlugDeletedAtUnique: unique(
      "skill_categories_team_id_slug_deleted_at_unique"
    ).on(table.teamId, table.slug, table.deletedAt),
    teamIdIdx: index("skill_categories_team_id_idx").on(table.teamId),
  })
);

export const clientSkills = pgTable(
  "client_skills",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    skillTaxonomyId: uuid("skill_taxonomy_id").references(
      () => skillTaxonomy.id,
      { onDelete: "set null" }
    ),
    categoryId: uuid("category_id").references(() => skillCategories.id, {
      onDelete: "set null",
    }),
    skillName: varchar("skill_name", { length: 255 }).notNull(),
    skillNormalized: varchar("skill_normalized", { length: 255 }).notNull(),
    description: text("description"),
    metadata: jsonb("metadata"),
    usageCount: integer("usage_count").notNull().default(0),
    // Override fields (can override library defaults)
    weight: numeric("weight", { precision: 3, scale: 2 }),
    aliases: text("aliases").array().default([]),
    // Custom icon SVG code for custom skills
    iconSvg: text("icon_svg"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    teamIdSkillNormalizedUnique: unique(
      "client_skills_team_id_skill_normalized_unique"
    ).on(table.teamId, table.skillNormalized),
    skillTaxonomyIdIdx: index("client_skills_skill_taxonomy_id_idx").on(
      table.skillTaxonomyId
    ),
    categoryIdIdx: index("client_skills_category_id_idx").on(table.categoryId),
  })
);

export const clientChallengeQuestions = pgTable(
  "client_challenge_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    // Skill association
    clientSkillId: uuid("client_skill_id")
      .notNull()
      .references(() => clientSkills.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    prompt: text("prompt").notNull(),
    config: jsonb("config").notNull(),
    imageUrl: text("image_url"),
    imageAltText: text("image_alt_text"),
    timeLimitSeconds: integer("time_limit_seconds"),
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    teamIdIdx: index("client_challenge_questions_team_id_idx").on(table.teamId),
    clientSkillIdIdx: index(
      "client_challenge_questions_client_skill_id_idx"
    ).on(table.clientSkillId),
  })
);

export const clientChallengeQuestionTags = pgTable(
  "client_challenge_question_tags",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    clientChallengeQuestionId: uuid("client_challenge_question_id")
      .notNull()
      .references(() => clientChallengeQuestions.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    clientChallengeQuestionIdTagIdUnique: unique(
      "client_challenge_question_tags_client_challenge_question_id_tag_id_unique"
    ).on(table.clientChallengeQuestionId, table.tagId),
    clientChallengeQuestionIdIdx: index(
      "client_challenge_question_tags_client_challenge_question_id_idx"
    ).on(table.clientChallengeQuestionId),
    tagIdIdx: index("client_challenge_question_tags_tag_id_idx").on(
      table.tagId
    ),
  })
);

export const challengeQuestions = pgTable(
  "challenge_questions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Question content (stored as JSONB for flexibility)
    type: text("type").notNull(),
    prompt: text("prompt").notNull(),
    config: jsonb("config").notNull(),
    // Library metadata
    skillTaxonomyId: uuid("skill_taxonomy_id")
      .notNull()
      .references(() => skillTaxonomy.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    skillTaxonomyIdIdx: index("challenge_questions_skill_taxonomy_id_idx").on(
      table.skillTaxonomyId
    ),
  })
);

export const jobSkillQuestionWeights = pgTable(
  "job_skill_question_weights",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    jobSkillId: uuid("job_skill_id")
      .notNull()
      .references(() => jobSkills.id, { onDelete: "cascade" }),
    clientChallengeQuestionId: uuid("client_challenge_question_id")
      .notNull()
      .references(() => clientChallengeQuestions.id, { onDelete: "cascade" }),
    // Weight for THIS job
    weight: numeric("weight", { precision: 4, scale: 2 })
      .notNull()
      .default("1.0"),
    // Time limit override for THIS job (only applies if question.timeLimitSeconds is null)
    timeLimitSeconds: integer("time_limit_seconds"),
    // Source of this weighting
    source: varchar("source", { length: 20 }).notNull().default("auto"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    jobSkillIdClientChallengeQuestionIdUnique: unique(
      "job_skill_question_weights_job_skill_id_client_challenge_question_id_unique"
    ).on(table.jobSkillId, table.clientChallengeQuestionId),
    jobSkillIdIdx: index("job_skill_question_weights_job_skill_id_idx").on(
      table.jobSkillId
    ),
    clientChallengeQuestionIdIdx: index(
      "job_skill_question_weights_client_challenge_question_id_idx"
    ).on(table.clientChallengeQuestionId),
  })
);

// Other Tables
export const enterpriseWaitlist = pgTable(
  "enterprise_waitlist",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // Always required
    contactEmail: varchar("contact_email", { length: 255 }).notNull().unique(),
    contactName: varchar("contact_name", { length: 255 }),
    companyName: varchar("company_name", { length: 255 }),
    currentATS: varchar("current_ats", { length: 255 }),
    expectedVolume: varchar("expected_volume", { length: 255 }),
    message: text("message"),
    // Status tracking
    status: varchar("status", { length: 20 })
      .notNull()
      .default(WaitlistStatus.PENDING),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    statusIdx: index("enterprise_waitlist_status_idx").on(table.status),
    createdAtIdx: index("enterprise_waitlist_created_at_idx").on(
      table.createdAt
    ),
  })
);

export const notifications = pgTable(
  "notifications",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    // References
    teamId: integer("team_id")
      .notNull()
      .references(() => teams.id, { onDelete: "cascade" }),
    // Optional references to related entities
    jobId: uuid("job_id").references(() => jobs.id, { onDelete: "cascade" }),
    verificationAttemptId: uuid("verification_attempt_id").references(
      () => verificationAttempts.id,
      { onDelete: "cascade" }
    ),
    // Notification content
    type: varchar("type", { length: 50 }).notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    message: text("message").notNull(),
    metadata: jsonb("metadata"),
    // Status
    status: varchar("status", { length: 20 })
      .notNull()
      .default(NotificationStatus.UNREAD),
    // Timestamps
    createdAt: timestamp("created_at").notNull().defaultNow(),
    readAt: timestamp("read_at"),
    archivedAt: timestamp("archived_at"),
  },
  (table) => ({
    teamIdStatusCreatedAtIdx: index(
      "notifications_team_id_status_created_at_idx"
    ).on(table.teamId, table.status, table.createdAt),
    teamIdCreatedAtIdx: index("notifications_team_id_created_at_idx").on(
      table.teamId,
      table.createdAt
    ),
    statusIdx: index("notifications_status_idx").on(table.status),
    readAtIdx: index("notifications_read_at_idx").on(table.readAt),
  })
);

export const verificationQuestionHistory = pgTable(
  "verification_question_history",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    verificationAttemptId: uuid("verification_attempt_id")
      .notNull()
      .references(() => verificationAttempts.id, { onDelete: "cascade" }),
    // Question reference (may be null if deleted)
    questionId: uuid("question_id").references(
      () => clientChallengeQuestions.id,
      { onDelete: "set null" }
    ),
    // Skill reference (may be null if deleted) - skill this question tested
    clientSkillId: uuid("client_skill_id").references(() => clientSkills.id, {
      onDelete: "set null",
    }),
    // Denormalized for display (always available even if question/skill deleted)
    questionPreview: text("question_preview"),
    skillName: varchar("skill_name", { length: 255 }).notNull(),
    skillNormalized: varchar("skill_normalized", { length: 255 }).notNull(),
    // Full snapshots for recovery
    questionData: jsonb("question_data").notNull(),
    skillData: jsonb("skill_data").notNull(),
    answer: jsonb("answer"),
    order: integer("order").notNull().default(0),
    createdAt: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => ({
    verificationAttemptIdIdx: index(
      "verification_question_history_verification_attempt_id_idx"
    ).on(table.verificationAttemptId),
    questionIdIdx: index("verification_question_history_question_id_idx").on(
      table.questionId
    ),
    clientSkillIdIdx: index(
      "verification_question_history_client_skill_id_idx"
    ).on(table.clientSkillId),
  })
);

export const changelog = pgTable(
  "changelog",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    version: varchar("version", { length: 50 }).notNull(),
    releaseDate: timestamp("release_date").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => ({
    releaseDateIdx: index("changelog_release_date_idx").on(table.releaseDate),
  })
);

export const teamsRelations = relations(teams, ({ many, one }) => ({
  teamMembers: many(teamMembers),
  activityLogs: many(activityLogs),
  invitations: many(invitations),
  integration: one(teamIntegrations),
  billingUsage: many(teamBillingUsage),
  apiKeys: many(teamApiKeys),
  jobs: many(jobs),
  verificationAttempts: many(verificationAttempts),
  tags: many(tags),
  promotionalSkillUpvotes: many(promotionalSkillUpvotes),
  skillCategories: many(skillCategories),
  clientSkills: many(clientSkills),
  clientChallengeQuestions: many(clientChallengeQuestions),
  notifications: many(notifications),
}));

export const usersRelations = relations(users, ({ many }) => ({
  teamMembers: many(teamMembers),
  invitationsSent: many(invitations),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
  team: one(teams, {
    fields: [invitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(users, {
    fields: [invitations.invitedBy],
    references: [users.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  user: one(users, {
    fields: [teamMembers.userId],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  team: one(teams, {
    fields: [activityLogs.teamId],
    references: [teams.id],
  }),
  user: one(users, {
    fields: [activityLogs.userId],
    references: [users.id],
  }),
}));

// Core Team Relations
export const teamIntegrationsRelations = relations(
  teamIntegrations,
  ({ one }) => ({
    team: one(teams, {
      fields: [teamIntegrations.teamId],
      references: [teams.id],
    }),
  })
);

export const teamBillingUsageRelations = relations(
  teamBillingUsage,
  ({ one }) => ({
    team: one(teams, {
      fields: [teamBillingUsage.teamId],
      references: [teams.id],
    }),
  })
);

export const teamApiKeysRelations = relations(teamApiKeys, ({ one }) => ({
  team: one(teams, {
    fields: [teamApiKeys.teamId],
    references: [teams.id],
  }),
  createdByUser: one(users, {
    fields: [teamApiKeys.createdByUserId],
    references: [users.id],
  }),
}));

// Job & Application Relations
export const jobsRelations = relations(jobs, ({ many, one }) => ({
  team: one(teams, {
    fields: [jobs.teamId],
    references: [teams.id],
  }),
  jobSkills: many(jobSkills),
  verificationAttempts: many(verificationAttempts),
  notifications: many(notifications),
}));

export const jobSkillsRelations = relations(jobSkills, ({ many, one }) => ({
  job: one(jobs, {
    fields: [jobSkills.jobId],
    references: [jobs.id],
  }),
  clientSkill: one(clientSkills, {
    fields: [jobSkills.clientSkillId],
    references: [clientSkills.id],
  }),
  questionWeights: many(jobSkillQuestionWeights),
}));

export const verificationAttemptsRelations = relations(
  verificationAttempts,
  ({ many, one }) => ({
    team: one(teams, {
      fields: [verificationAttempts.teamId],
      references: [teams.id],
    }),
    job: one(jobs, {
      fields: [verificationAttempts.jobId],
      references: [jobs.id],
    }),
    questionHistory: many(verificationQuestionHistory),
    notifications: many(notifications),
  })
);

// Skill & Question Relations
export const tagsRelations = relations(tags, ({ many, one }) => ({
  team: one(teams, {
    fields: [tags.teamId],
    references: [teams.id],
  }),
  clientChallengeQuestionTags: many(clientChallengeQuestionTags),
}));

export const skillTaxonomyRelations = relations(
  skillTaxonomy,
  ({ many, one }) => ({
    clientSkills: many(clientSkills),
    challengeQuestions: many(challengeQuestions),
    promotedFrom: one(promotionalSkills, {
      fields: [skillTaxonomy.id],
      references: [promotionalSkills.promotedToTaxonomyId],
    }),
  })
);

export const promotionalSkillsRelations = relations(
  promotionalSkills,
  ({ many, one }) => ({
    promotedToTaxonomy: one(skillTaxonomy, {
      fields: [promotionalSkills.promotedToTaxonomyId],
      references: [skillTaxonomy.id],
    }),
    upvotes: many(promotionalSkillUpvotes),
  })
);

export const promotionalSkillUpvotesRelations = relations(
  promotionalSkillUpvotes,
  ({ one }) => ({
    promotionalSkill: one(promotionalSkills, {
      fields: [promotionalSkillUpvotes.promotionalSkillId],
      references: [promotionalSkills.id],
    }),
    team: one(teams, {
      fields: [promotionalSkillUpvotes.teamId],
      references: [teams.id],
    }),
  })
);

export const skillCategoriesRelations = relations(
  skillCategories,
  ({ many, one }) => ({
    parent: one(skillCategories, {
      fields: [skillCategories.parentId],
      references: [skillCategories.id],
      relationName: "SkillCategoryHierarchy",
    }),
    children: many(skillCategories, {
      relationName: "SkillCategoryHierarchy",
    }),
    team: one(teams, {
      fields: [skillCategories.teamId],
      references: [teams.id],
    }),
    clientSkills: many(clientSkills),
  })
);

export const clientSkillsRelations = relations(
  clientSkills,
  ({ many, one }) => ({
    team: one(teams, {
      fields: [clientSkills.teamId],
      references: [teams.id],
    }),
    skillTaxonomy: one(skillTaxonomy, {
      fields: [clientSkills.skillTaxonomyId],
      references: [skillTaxonomy.id],
    }),
    category: one(skillCategories, {
      fields: [clientSkills.categoryId],
      references: [skillCategories.id],
    }),
    jobSkills: many(jobSkills),
    challengeQuestions: many(clientChallengeQuestions),
    verificationHistory: many(verificationQuestionHistory),
  })
);

export const clientChallengeQuestionsRelations = relations(
  clientChallengeQuestions,
  ({ many, one }) => ({
    team: one(teams, {
      fields: [clientChallengeQuestions.teamId],
      references: [teams.id],
    }),
    clientSkill: one(clientSkills, {
      fields: [clientChallengeQuestions.clientSkillId],
      references: [clientSkills.id],
    }),
    tags: many(clientChallengeQuestionTags),
    verificationHistory: many(verificationQuestionHistory),
    jobSkillQuestionWeights: many(jobSkillQuestionWeights),
  })
);

export const clientChallengeQuestionTagsRelations = relations(
  clientChallengeQuestionTags,
  ({ one }) => ({
    clientChallengeQuestion: one(clientChallengeQuestions, {
      fields: [clientChallengeQuestionTags.clientChallengeQuestionId],
      references: [clientChallengeQuestions.id],
    }),
    tag: one(tags, {
      fields: [clientChallengeQuestionTags.tagId],
      references: [tags.id],
    }),
  })
);

export const challengeQuestionsRelations = relations(
  challengeQuestions,
  ({ one }) => ({
    skillTaxonomy: one(skillTaxonomy, {
      fields: [challengeQuestions.skillTaxonomyId],
      references: [skillTaxonomy.id],
    }),
  })
);

export const jobSkillQuestionWeightsRelations = relations(
  jobSkillQuestionWeights,
  ({ one }) => ({
    jobSkill: one(jobSkills, {
      fields: [jobSkillQuestionWeights.jobSkillId],
      references: [jobSkills.id],
    }),
    clientChallengeQuestion: one(clientChallengeQuestions, {
      fields: [jobSkillQuestionWeights.clientChallengeQuestionId],
      references: [clientChallengeQuestions.id],
    }),
  })
);

// Other Relations
export const notificationsRelations = relations(notifications, ({ one }) => ({
  team: one(teams, {
    fields: [notifications.teamId],
    references: [teams.id],
  }),
  job: one(jobs, {
    fields: [notifications.jobId],
    references: [jobs.id],
  }),
  verificationAttempt: one(verificationAttempts, {
    fields: [notifications.verificationAttemptId],
    references: [verificationAttempts.id],
  }),
}));

export const verificationQuestionHistoryRelations = relations(
  verificationQuestionHistory,
  ({ one }) => ({
    verificationAttempt: one(verificationAttempts, {
      fields: [verificationQuestionHistory.verificationAttemptId],
      references: [verificationAttempts.id],
    }),
    question: one(clientChallengeQuestions, {
      fields: [verificationQuestionHistory.questionId],
      references: [clientChallengeQuestions.id],
    }),
    clientSkill: one(clientSkills, {
      fields: [verificationQuestionHistory.clientSkillId],
      references: [clientSkills.id],
    }),
  })
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Team = typeof teams.$inferSelect;
export type NewTeam = typeof teams.$inferInsert;
export type TeamMember = typeof teamMembers.$inferSelect;
export type NewTeamMember = typeof teamMembers.$inferInsert;
export type ActivityLog = typeof activityLogs.$inferSelect;
export type NewActivityLog = typeof activityLogs.$inferInsert;
export type Invitation = typeof invitations.$inferSelect;
export type NewInvitation = typeof invitations.$inferInsert;
export type TeamDataWithMembers = Team & {
  teamMembers: (TeamMember & {
    user: Pick<User, "id" | "name" | "email">;
  })[];
};

// Core Team Types
export type TeamIntegration = typeof teamIntegrations.$inferSelect;
export type NewTeamIntegration = typeof teamIntegrations.$inferInsert;
export type TeamBillingUsage = typeof teamBillingUsage.$inferSelect;
export type NewTeamBillingUsage = typeof teamBillingUsage.$inferInsert;
export type TeamApiKey = typeof teamApiKeys.$inferSelect;
export type NewTeamApiKey = typeof teamApiKeys.$inferInsert;

// Job & Application Types
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type JobSkill = typeof jobSkills.$inferSelect;
export type NewJobSkill = typeof jobSkills.$inferInsert;
export type VerificationAttempt = typeof verificationAttempts.$inferSelect;
export type NewVerificationAttempt = typeof verificationAttempts.$inferInsert;

// Skill & Question Types
export type Tag = typeof tags.$inferSelect;
export type NewTag = typeof tags.$inferInsert;
export type SkillTaxonomy = typeof skillTaxonomy.$inferSelect;
export type NewSkillTaxonomy = typeof skillTaxonomy.$inferInsert;
export type PromotionalSkill = typeof promotionalSkills.$inferSelect;
export type NewPromotionalSkill = typeof promotionalSkills.$inferInsert;
export type PromotionalSkillUpvote =
  typeof promotionalSkillUpvotes.$inferSelect;
export type NewPromotionalSkillUpvote =
  typeof promotionalSkillUpvotes.$inferInsert;
export type SkillCategory = typeof skillCategories.$inferSelect;
export type NewSkillCategory = typeof skillCategories.$inferInsert;
export type ClientSkill = typeof clientSkills.$inferSelect;
export type NewClientSkill = typeof clientSkills.$inferInsert;
export type ClientChallengeQuestion =
  typeof clientChallengeQuestions.$inferSelect;
export type NewClientChallengeQuestion =
  typeof clientChallengeQuestions.$inferInsert;
export type ClientChallengeQuestionTag =
  typeof clientChallengeQuestionTags.$inferSelect;
export type NewClientChallengeQuestionTag =
  typeof clientChallengeQuestionTags.$inferInsert;
export type ChallengeQuestion = typeof challengeQuestions.$inferSelect;
export type NewChallengeQuestion = typeof challengeQuestions.$inferInsert;
export type JobSkillQuestionWeight =
  typeof jobSkillQuestionWeights.$inferSelect;
export type NewJobSkillQuestionWeight =
  typeof jobSkillQuestionWeights.$inferInsert;

// Other Types
export type EnterpriseWaitlist = typeof enterpriseWaitlist.$inferSelect;
export type NewEnterpriseWaitlist = typeof enterpriseWaitlist.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type NewNotification = typeof notifications.$inferInsert;
export type VerificationQuestionHistory =
  typeof verificationQuestionHistory.$inferSelect;
export type NewVerificationQuestionHistory =
  typeof verificationQuestionHistory.$inferInsert;
export type Changelog = typeof changelog.$inferSelect;
export type NewChangelog = typeof changelog.$inferInsert;
