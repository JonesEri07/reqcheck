CREATE TABLE "email_verifications" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar(255) NOT NULL,
	"otp" varchar(6) NOT NULL,
	"expires_at" timestamp NOT NULL,
	"verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"password_hash" text,
	"team_name" varchar(100),
	"plan" varchar(20),
	"invite_id" varchar(50)
);
--> statement-breakpoint
ALTER TABLE "teams" ALTER COLUMN "stop_widget_at_free_cap" SET DEFAULT true;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "monthly_billing_cycle_start" timestamp;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "monthly_billing_cycle_end" timestamp;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "annual_billing_cycle_start" timestamp;--> statement-breakpoint
ALTER TABLE "teams" ADD COLUMN "annual_billing_cycle_end" timestamp;--> statement-breakpoint
CREATE INDEX "email_verifications_email_idx" ON "email_verifications" USING btree ("email");--> statement-breakpoint
CREATE INDEX "email_verifications_otp_idx" ON "email_verifications" USING btree ("otp");--> statement-breakpoint
CREATE INDEX "email_verifications_expires_at_idx" ON "email_verifications" USING btree ("expires_at");--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "webhook_url";--> statement-breakpoint
ALTER TABLE "teams" DROP COLUMN "webhook_secret";