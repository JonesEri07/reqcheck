CREATE TABLE "activity_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"user_id" integer,
	"action" text NOT NULL,
	"timestamp" timestamp DEFAULT now() NOT NULL,
	"ip_address" varchar(45)
);
--> statement-breakpoint
CREATE TABLE "application_question_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"application_id" uuid NOT NULL,
	"question_id" uuid,
	"client_skill_id" uuid,
	"question_preview" text,
	"skill_name" varchar(255) NOT NULL,
	"skill_normalized" varchar(255) NOT NULL,
	"question_data" jsonb NOT NULL,
	"skill_data" jsonb NOT NULL,
	"answer" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "applications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"job_id" uuid NOT NULL,
	"verification_attempt_id" uuid,
	"email" varchar(255) NOT NULL,
	"verified" boolean NOT NULL,
	"score" integer,
	"passed" boolean,
	"completed_at" timestamp,
	"referral_source" varchar(255),
	"device_type" varchar(50),
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "applications_verification_attempt_id_unique" UNIQUE("verification_attempt_id")
);
--> statement-breakpoint
CREATE TABLE "challenge_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" jsonb NOT NULL,
	"skill_taxonomy_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_challenge_question_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"client_challenge_question_id" uuid NOT NULL,
	"tag_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "client_challenge_question_tags_client_challenge_question_id_tag_id_unique" UNIQUE("client_challenge_question_id","tag_id")
);
--> statement-breakpoint
CREATE TABLE "client_challenge_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"client_skill_id" uuid NOT NULL,
	"question" jsonb NOT NULL,
	"time_limit_seconds" integer,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "client_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"skill_taxonomy_id" uuid,
	"category_id" uuid,
	"skill_name" varchar(255) NOT NULL,
	"skill_normalized" varchar(255) NOT NULL,
	"description" text,
	"metadata" jsonb,
	"status" varchar(20) DEFAULT 'ACTIVE' NOT NULL,
	"usage_count" integer DEFAULT 0 NOT NULL,
	"weight" numeric(3, 2),
	"aliases" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "client_skills_team_id_skill_normalized_unique" UNIQUE("team_id","skill_normalized")
);
--> statement-breakpoint
CREATE TABLE "enterprise_waitlist" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"contact_email" varchar(255) NOT NULL,
	"contact_name" varchar(255),
	"company_name" varchar(255),
	"current_ats" varchar(255),
	"expected_volume" varchar(255),
	"message" text,
	"status" varchar(20) DEFAULT 'PENDING' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "enterprise_waitlist_contact_email_unique" UNIQUE("contact_email")
);
--> statement-breakpoint
CREATE TABLE "invitations" (
	"id" serial PRIMARY KEY NOT NULL,
	"team_id" integer NOT NULL,
	"email" varchar(255) NOT NULL,
	"role" varchar(50) NOT NULL,
	"invited_by" integer NOT NULL,
	"invited_at" timestamp DEFAULT now() NOT NULL,
	"status" varchar(20) DEFAULT 'pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_skill_question_weights" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_skill_id" uuid NOT NULL,
	"client_challenge_question_id" uuid NOT NULL,
	"weight" numeric(3, 2) DEFAULT '1.0' NOT NULL,
	"time_limit_seconds" integer,
	"source" varchar(20) DEFAULT 'auto' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_skill_question_weights_job_skill_id_client_challenge_question_id_unique" UNIQUE("job_skill_id","client_challenge_question_id")
);
--> statement-breakpoint
CREATE TABLE "job_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"job_id" uuid NOT NULL,
	"client_skill_id" uuid NOT NULL,
	"skill_name" varchar(255) NOT NULL,
	"required" boolean DEFAULT true NOT NULL,
	"weight" numeric(3, 2) DEFAULT '1.0' NOT NULL,
	"manually_added" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "job_skills_job_id_client_skill_id_unique" UNIQUE("job_id","client_skill_id")
);
--> statement-breakpoint
CREATE TABLE "jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"external_job_id" varchar(255) NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"pass_threshold" integer,
	"question_count" integer,
	"status" varchar(20) DEFAULT 'OPEN' NOT NULL,
	"source" varchar(20) DEFAULT 'MANUAL' NOT NULL,
	"archived_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"last_application_at" timestamp,
	CONSTRAINT "jobs_team_id_external_job_id_unique" UNIQUE("team_id","external_job_id")
);
--> statement-breakpoint
CREATE TABLE "notifications" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"job_id" uuid,
	"application_id" uuid,
	"type" varchar(50) NOT NULL,
	"title" varchar(255) NOT NULL,
	"message" text NOT NULL,
	"metadata" jsonb,
	"status" varchar(20) DEFAULT 'UNREAD' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"read_at" timestamp,
	"archived_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "promotional_skill_upvotes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"promotional_skill_id" uuid NOT NULL,
	"team_id" integer NOT NULL,
	"skill_name" varchar(255) NOT NULL,
	"aliases" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promotional_skill_upvotes_promotional_skill_id_team_id_unique" UNIQUE("promotional_skill_id","team_id")
);
--> statement-breakpoint
CREATE TABLE "promotional_skills" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"matching_words" text[] DEFAULT '{}',
	"upvote_count" integer DEFAULT 1 NOT NULL,
	"name_frequency" jsonb DEFAULT '{}' NOT NULL,
	"promoted_at" timestamp,
	"promoted_to_taxonomy_id" uuid,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "promotional_skills_promoted_to_taxonomy_id_unique" UNIQUE("promoted_to_taxonomy_id")
);
--> statement-breakpoint
CREATE TABLE "skill_categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"parent_id" uuid,
	"team_id" integer NOT NULL,
	"sort_order" integer,
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "skill_categories_team_id_slug_deleted_at_unique" UNIQUE("team_id","slug","deleted_at")
);
--> statement-breakpoint
CREATE TABLE "skill_taxonomy" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"skill_name" varchar(255) NOT NULL,
	"skill_normalized" varchar(255) NOT NULL,
	"status" varchar(20) DEFAULT 'COMMUNITY' NOT NULL,
	"adoption_count" integer DEFAULT 0 NOT NULL,
	"created_by_team_id" integer,
	"aliases" text[] DEFAULT '{}',
	"metadata" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "skill_taxonomy_skill_name_unique" UNIQUE("skill_name")
);
--> statement-breakpoint
CREATE TABLE "tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"description" text,
	"team_id" integer NOT NULL,
	"patterns" text[] DEFAULT '{}',
	"usage_count" integer DEFAULT 0 NOT NULL,
	"color" varchar(50),
	"sort_order" integer,
	"deleted_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "tags_team_id_slug_deleted_at_unique" UNIQUE("team_id","slug","deleted_at")
);
--> statement-breakpoint
CREATE TABLE "team_api_keys" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"key_prefix" varchar(255) NOT NULL,
	"hashed_key" text NOT NULL,
	"created_by_user_id" integer,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"last_used_at" timestamp,
	"revoked_at" timestamp,
	CONSTRAINT "team_api_keys_hashed_key_unique" UNIQUE("hashed_key")
);
--> statement-breakpoint
CREATE TABLE "team_billing_usage" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"cycle_start" timestamp NOT NULL,
	"cycle_end" timestamp NOT NULL,
	"included_applications" integer DEFAULT 0 NOT NULL,
	"actual_applications" integer DEFAULT 0 NOT NULL,
	"overage_applications" integer DEFAULT 0 NOT NULL,
	"metered_price_id" text,
	"stripe_reported" boolean DEFAULT false NOT NULL,
	"last_stripe_sync_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_billing_usage_team_id_cycle_start_unique" UNIQUE("team_id","cycle_start")
);
--> statement-breakpoint
CREATE TABLE "team_integrations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"greenhouse_board_token" text,
	"greenhouse_last_sync_at" timestamp,
	"greenhouse_sync_frequency" varchar(20) DEFAULT 'MANUALLY' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "team_integrations_team_id_unique" UNIQUE("team_id")
);
--> statement-breakpoint
CREATE TABLE "team_members" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer NOT NULL,
	"team_id" integer NOT NULL,
	"role" varchar(50) NOT NULL,
	"joined_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "teams" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"stripe_customer_id" text,
	"stripe_subscription_id" text,
	"stripe_product_id" text,
	"plan_name" varchar(50),
	"subscription_status" varchar(20),
	"billing_plan" varchar(20) DEFAULT 'FREE' NOT NULL,
	"webhook_url" text,
	"webhook_secret" text,
	"whitelist_urls" text[] DEFAULT '{}',
	"onboarding_complete" boolean DEFAULT false NOT NULL,
	"quick_setup_did_complete" boolean DEFAULT false NOT NULL,
	"stop_widget_at_free_cap" boolean DEFAULT false NOT NULL,
	"default_question_time_limit_seconds" integer,
	"default_pass_threshold" integer DEFAULT 60 NOT NULL,
	"default_question_count" integer DEFAULT 5 NOT NULL,
	"tag_match_weight" numeric(3, 2) DEFAULT '1.5' NOT NULL,
	"tag_no_match_weight" numeric(3, 2) DEFAULT '1.0' NOT NULL,
	"sync_challenge_questions" varchar(20) DEFAULT 'NONE' NOT NULL,
	CONSTRAINT "teams_stripe_customer_id_unique" UNIQUE("stripe_customer_id"),
	CONSTRAINT "teams_stripe_subscription_id_unique" UNIQUE("stripe_subscription_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100),
	"email" varchar(255) NOT NULL,
	"password_hash" text NOT NULL,
	"role" varchar(20) DEFAULT 'member' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "validation_results" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"job_id" uuid,
	"url" text NOT NULL,
	"valid" boolean NOT NULL,
	"checks" jsonb NOT NULL,
	"errors" jsonb,
	"extracted_data" jsonb,
	"screenshot" text,
	"validated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_attempts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"team_id" integer NOT NULL,
	"job_id" uuid NOT NULL,
	"email" varchar(255) NOT NULL,
	"email_normalized" varchar(255) NOT NULL,
	"session_token" text,
	"questions_shown" jsonb,
	"started_at" timestamp NOT NULL,
	"completed_at" timestamp,
	"abandoned_at" timestamp,
	"retry_count" integer DEFAULT 0 NOT NULL,
	"answers" jsonb,
	"score" integer,
	"total_questions" integer,
	"passed" boolean,
	"time_taken_seconds" integer,
	"verification_token" text,
	"token_expires_at" timestamp,
	"ip_address" varchar(45),
	"user_agent" text,
	CONSTRAINT "verification_attempts_session_token_unique" UNIQUE("session_token"),
	CONSTRAINT "verification_attempts_verification_token_unique" UNIQUE("verification_token")
);
--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_question_history" ADD CONSTRAINT "application_question_history_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_question_history" ADD CONSTRAINT "application_question_history_question_id_client_challenge_questions_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."client_challenge_questions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "application_question_history" ADD CONSTRAINT "application_question_history_client_skill_id_client_skills_id_fk" FOREIGN KEY ("client_skill_id") REFERENCES "public"."client_skills"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "applications" ADD CONSTRAINT "applications_verification_attempt_id_verification_attempts_id_fk" FOREIGN KEY ("verification_attempt_id") REFERENCES "public"."verification_attempts"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "challenge_questions" ADD CONSTRAINT "challenge_questions_skill_taxonomy_id_skill_taxonomy_id_fk" FOREIGN KEY ("skill_taxonomy_id") REFERENCES "public"."skill_taxonomy"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_challenge_question_tags" ADD CONSTRAINT "client_challenge_question_tags_client_challenge_question_id_client_challenge_questions_id_fk" FOREIGN KEY ("client_challenge_question_id") REFERENCES "public"."client_challenge_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_challenge_question_tags" ADD CONSTRAINT "client_challenge_question_tags_tag_id_tags_id_fk" FOREIGN KEY ("tag_id") REFERENCES "public"."tags"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_challenge_questions" ADD CONSTRAINT "client_challenge_questions_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_challenge_questions" ADD CONSTRAINT "client_challenge_questions_client_skill_id_client_skills_id_fk" FOREIGN KEY ("client_skill_id") REFERENCES "public"."client_skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_skills" ADD CONSTRAINT "client_skills_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_skills" ADD CONSTRAINT "client_skills_skill_taxonomy_id_skill_taxonomy_id_fk" FOREIGN KEY ("skill_taxonomy_id") REFERENCES "public"."skill_taxonomy"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_skills" ADD CONSTRAINT "client_skills_category_id_skill_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."skill_categories"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "invitations" ADD CONSTRAINT "invitations_invited_by_users_id_fk" FOREIGN KEY ("invited_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_skill_question_weights" ADD CONSTRAINT "job_skill_question_weights_job_skill_id_job_skills_id_fk" FOREIGN KEY ("job_skill_id") REFERENCES "public"."job_skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_skill_question_weights" ADD CONSTRAINT "job_skill_question_weights_client_challenge_question_id_client_challenge_questions_id_fk" FOREIGN KEY ("client_challenge_question_id") REFERENCES "public"."client_challenge_questions"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_skills" ADD CONSTRAINT "job_skills_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_skills" ADD CONSTRAINT "job_skills_client_skill_id_client_skills_id_fk" FOREIGN KEY ("client_skill_id") REFERENCES "public"."client_skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "jobs" ADD CONSTRAINT "jobs_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_application_id_applications_id_fk" FOREIGN KEY ("application_id") REFERENCES "public"."applications"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotional_skill_upvotes" ADD CONSTRAINT "promotional_skill_upvotes_promotional_skill_id_promotional_skills_id_fk" FOREIGN KEY ("promotional_skill_id") REFERENCES "public"."promotional_skills"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotional_skill_upvotes" ADD CONSTRAINT "promotional_skill_upvotes_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "promotional_skills" ADD CONSTRAINT "promotional_skills_promoted_to_taxonomy_id_skill_taxonomy_id_fk" FOREIGN KEY ("promoted_to_taxonomy_id") REFERENCES "public"."skill_taxonomy"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_categories" ADD CONSTRAINT "skill_categories_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "skill_taxonomy" ADD CONSTRAINT "skill_taxonomy_created_by_team_id_teams_id_fk" FOREIGN KEY ("created_by_team_id") REFERENCES "public"."teams"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tags" ADD CONSTRAINT "tags_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_api_keys" ADD CONSTRAINT "team_api_keys_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_api_keys" ADD CONSTRAINT "team_api_keys_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_billing_usage" ADD CONSTRAINT "team_billing_usage_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_integrations" ADD CONSTRAINT "team_integrations_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "validation_results" ADD CONSTRAINT "validation_results_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "validation_results" ADD CONSTRAINT "validation_results_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_attempts" ADD CONSTRAINT "verification_attempts_team_id_teams_id_fk" FOREIGN KEY ("team_id") REFERENCES "public"."teams"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_attempts" ADD CONSTRAINT "verification_attempts_job_id_jobs_id_fk" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "application_question_history_application_id_idx" ON "application_question_history" USING btree ("application_id");--> statement-breakpoint
CREATE INDEX "application_question_history_question_id_idx" ON "application_question_history" USING btree ("question_id");--> statement-breakpoint
CREATE INDEX "application_question_history_client_skill_id_idx" ON "application_question_history" USING btree ("client_skill_id");--> statement-breakpoint
CREATE INDEX "applications_job_id_verified_score_idx" ON "applications" USING btree ("job_id","verified","score");--> statement-breakpoint
CREATE INDEX "applications_job_id_completed_at_idx" ON "applications" USING btree ("job_id","completed_at");--> statement-breakpoint
CREATE INDEX "applications_team_id_created_at_idx" ON "applications" USING btree ("team_id","created_at");--> statement-breakpoint
CREATE INDEX "challenge_questions_skill_taxonomy_id_idx" ON "challenge_questions" USING btree ("skill_taxonomy_id");--> statement-breakpoint
CREATE INDEX "client_challenge_question_tags_client_challenge_question_id_idx" ON "client_challenge_question_tags" USING btree ("client_challenge_question_id");--> statement-breakpoint
CREATE INDEX "client_challenge_question_tags_tag_id_idx" ON "client_challenge_question_tags" USING btree ("tag_id");--> statement-breakpoint
CREATE INDEX "client_challenge_questions_team_id_idx" ON "client_challenge_questions" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "client_challenge_questions_client_skill_id_idx" ON "client_challenge_questions" USING btree ("client_skill_id");--> statement-breakpoint
CREATE INDEX "client_skills_skill_taxonomy_id_idx" ON "client_skills" USING btree ("skill_taxonomy_id");--> statement-breakpoint
CREATE INDEX "client_skills_category_id_idx" ON "client_skills" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "enterprise_waitlist_status_idx" ON "enterprise_waitlist" USING btree ("status");--> statement-breakpoint
CREATE INDEX "enterprise_waitlist_created_at_idx" ON "enterprise_waitlist" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "job_skill_question_weights_job_skill_id_idx" ON "job_skill_question_weights" USING btree ("job_skill_id");--> statement-breakpoint
CREATE INDEX "job_skill_question_weights_client_challenge_question_id_idx" ON "job_skill_question_weights" USING btree ("client_challenge_question_id");--> statement-breakpoint
CREATE INDEX "job_skills_job_id_idx" ON "job_skills" USING btree ("job_id");--> statement-breakpoint
CREATE INDEX "job_skills_client_skill_id_idx" ON "job_skills" USING btree ("client_skill_id");--> statement-breakpoint
CREATE INDEX "jobs_team_id_status_idx" ON "jobs" USING btree ("team_id","status");--> statement-breakpoint
CREATE INDEX "jobs_team_id_external_job_id_idx" ON "jobs" USING btree ("team_id","external_job_id");--> statement-breakpoint
CREATE INDEX "jobs_team_id_source_status_idx" ON "jobs" USING btree ("team_id","source","status");--> statement-breakpoint
CREATE INDEX "jobs_status_archived_at_idx" ON "jobs" USING btree ("status","archived_at");--> statement-breakpoint
CREATE INDEX "notifications_team_id_status_created_at_idx" ON "notifications" USING btree ("team_id","status","created_at");--> statement-breakpoint
CREATE INDEX "notifications_team_id_created_at_idx" ON "notifications" USING btree ("team_id","created_at");--> statement-breakpoint
CREATE INDEX "notifications_status_idx" ON "notifications" USING btree ("status");--> statement-breakpoint
CREATE INDEX "notifications_read_at_idx" ON "notifications" USING btree ("read_at");--> statement-breakpoint
CREATE INDEX "promotional_skill_upvotes_promotional_skill_id_idx" ON "promotional_skill_upvotes" USING btree ("promotional_skill_id");--> statement-breakpoint
CREATE INDEX "promotional_skill_upvotes_team_id_idx" ON "promotional_skill_upvotes" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "promotional_skills_upvote_count_idx" ON "promotional_skills" USING btree ("upvote_count");--> statement-breakpoint
CREATE INDEX "promotional_skills_promoted_at_idx" ON "promotional_skills" USING btree ("promoted_at");--> statement-breakpoint
CREATE INDEX "skill_categories_team_id_idx" ON "skill_categories" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "skill_taxonomy_skill_normalized_idx" ON "skill_taxonomy" USING btree ("skill_normalized");--> statement-breakpoint
CREATE INDEX "skill_taxonomy_status_idx" ON "skill_taxonomy" USING btree ("status");--> statement-breakpoint
CREATE INDEX "skill_taxonomy_adoption_count_idx" ON "skill_taxonomy" USING btree ("adoption_count");--> statement-breakpoint
CREATE INDEX "tags_team_id_idx" ON "tags" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_api_keys_team_id_idx" ON "team_api_keys" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_api_keys_key_prefix_idx" ON "team_api_keys" USING btree ("key_prefix");--> statement-breakpoint
CREATE INDEX "team_billing_usage_team_id_idx" ON "team_billing_usage" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "team_billing_usage_cycle_start_idx" ON "team_billing_usage" USING btree ("cycle_start");--> statement-breakpoint
CREATE INDEX "team_billing_usage_stripe_reported_idx" ON "team_billing_usage" USING btree ("stripe_reported");--> statement-breakpoint
CREATE INDEX "team_integrations_team_id_idx" ON "team_integrations" USING btree ("team_id");--> statement-breakpoint
CREATE INDEX "teams_billing_plan_idx" ON "teams" USING btree ("billing_plan");--> statement-breakpoint
CREATE INDEX "teams_subscription_status_idx" ON "teams" USING btree ("subscription_status");--> statement-breakpoint
CREATE INDEX "validation_results_team_id_validated_at_idx" ON "validation_results" USING btree ("team_id","validated_at");--> statement-breakpoint
CREATE INDEX "verification_attempts_email_normalized_job_id_started_at_idx" ON "verification_attempts" USING btree ("email_normalized","job_id","started_at");--> statement-breakpoint
CREATE INDEX "verification_attempts_session_token_idx" ON "verification_attempts" USING btree ("session_token");--> statement-breakpoint
CREATE INDEX "verification_attempts_verification_token_idx" ON "verification_attempts" USING btree ("verification_token");--> statement-breakpoint
CREATE INDEX "verification_attempts_job_id_completed_at_idx" ON "verification_attempts" USING btree ("job_id","completed_at");--> statement-breakpoint
CREATE INDEX "verification_attempts_team_id_completed_at_idx" ON "verification_attempts" USING btree ("team_id","completed_at");--> statement-breakpoint
CREATE INDEX "verification_attempts_passed_score_idx" ON "verification_attempts" USING btree ("passed","score");