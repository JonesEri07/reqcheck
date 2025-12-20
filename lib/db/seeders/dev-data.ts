import { db } from "../drizzle";
import { users, teams, teamMembers } from "../schema";
import { hashPassword } from "@/lib/auth/session";

/**
 * Seeds development/testing data: admin user, team, and team members.
 * This should only be used in development/local testing environments.
 */
export async function seedDevData() {
  console.log("Seeding development data (user, team, team members)...");
  // Note: test@test.com user has been removed. Use demo@reqcheck.com for demos.
  console.log("No development data to seed. Use demo@reqcheck.com for demos.");
}
