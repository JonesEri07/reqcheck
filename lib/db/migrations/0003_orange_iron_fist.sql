CREATE TABLE "changelog" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"version" varchar(50) NOT NULL,
	"release_date" timestamp NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "current_team_id" integer;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "notification_preferences" jsonb DEFAULT '{}'::jsonb;--> statement-breakpoint
CREATE INDEX "changelog_release_date_idx" ON "changelog" USING btree ("release_date");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_current_team_id_teams_id_fk" FOREIGN KEY ("current_team_id") REFERENCES "public"."teams"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "monthly_billing_cycle_start";--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "monthly_billing_cycle_end";--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "annual_billing_cycle_start";--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "annual_billing_cycle_end";--> statement-breakpoint
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_team_id_unique" UNIQUE("user_id","team_id");