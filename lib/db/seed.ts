import { seedSkillsAndQuestions } from "./seeders/skills-questions.js";
import { seedDevData } from "./seeders/dev-data.js";
import { seedApplications } from "./seeders/applications.js";

/**
 * Seed CLI - Run specific seeders based on command line arguments
 *
 * Usage:
 *   npm run seed                    # Run all seeders (dev + production)
 *   npm run seed -- --skills        # Run only skills/questions seeder (production)
 *   npm run seed -- --dev           # Run only dev data seeder (local testing)
 *   npm run seed -- --applications  # Run only applications seeder (local testing)
 *   npm run seed -- --applications --teamId=1  # Seed applications for specific team ID
 *   npm run seed -- --all           # Run all seeders (same as default)
 */

async function main() {
  const args = process.argv.slice(2);
  const seedAll = args.length === 0 || args.includes("--all");
  const seedSkills = seedAll || args.includes("--skills");
  const seedDev = seedAll || args.includes("--dev");
  const seedApps = seedAll || args.includes("--applications");

  // Extract teamId from arguments (--teamId=1 or --teamId 1)
  let teamId: number | undefined;
  const teamIdArg = args.find((arg) => arg.startsWith("--teamId="));
  if (teamIdArg) {
    const id = parseInt(teamIdArg.split("=")[1], 10);
    if (!isNaN(id)) {
      teamId = id;
    }
  } else {
    const teamIdIndex = args.indexOf("--teamId");
    if (teamIdIndex !== -1 && args[teamIdIndex + 1]) {
      const id = parseInt(args[teamIdIndex + 1], 10);
      if (!isNaN(id)) {
        teamId = id;
      }
    }
  }

  try {
    if (seedSkills) {
      await seedSkillsAndQuestions();
    }

    if (seedDev) {
      await seedDevData();
    }

    if (seedApps) {
      await seedApplications(teamId);
    }

    if (!seedSkills && !seedDev && !seedApps) {
      console.log(
        "No seeders specified. Use --skills, --dev, --applications, or --all"
      );
      process.exit(1);
    }
  } catch (error) {
    console.error("Seed process failed:", error);
    process.exit(1);
  } finally {
    console.log("Seed process finished. Exiting...");
    process.exit(0);
  }
}

main();
