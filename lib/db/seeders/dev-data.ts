import { db } from "../drizzle";
import { users, teams, teamMembers } from "../schema";
import { hashPassword } from "@/lib/auth/session";

/**
 * Seeds development/testing data: admin user, team, and team members.
 * This should only be used in development/local testing environments.
 */
export async function seedDevData() {
  console.log("Seeding development data (user, team, team members)...");

  const email = "test@test.com";
  const password = "admin123";
  const passwordHash = await hashPassword(password);

  // Check if user already exists
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  if (existingUser) {
    console.log("Test user already exists, skipping user creation.");
    return;
  }

  const [user] = await db
    .insert(users)
    .values([
      {
        email: email,
        passwordHash: passwordHash,
        role: "owner",
      },
    ])
    .returning();

  console.log("Initial user created.");

  const [team] = await db
    .insert(teams)
    .values({
      name: "Test Team",
    })
    .returning();

  await db.insert(teamMembers).values({
    teamId: team.id,
    userId: user.id,
    role: "owner",
  });

  console.log("Development data seeding completed.");
}
