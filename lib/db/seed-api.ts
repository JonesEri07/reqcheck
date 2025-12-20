import "server-only";
import { seedSkillsAndQuestions } from "./seeders/skills-questions";
import { seedDevData } from "./seeders/dev-data";
import { seedApplications } from "./seeders/applications";
import { seedDemoData } from "./seeders/demo-data";

export interface SeedOptions {
  skills?: boolean;
  dev?: boolean;
  demo?: boolean;
  applications?: boolean;
  teamId?: number;
}

export interface SeedResult {
  success: boolean;
  message: string;
  results: {
    skills?: { success: boolean; message: string };
    dev?: { success: boolean; message: string };
    demo?: { success: boolean; message: string };
    applications?: { success: boolean; message: string };
  };
}

/**
 * Run seeders programmatically (for API use)
 */
export async function runSeeders(options: SeedOptions): Promise<SeedResult> {
  const results: SeedResult["results"] = {};
  const errors: string[] = [];

  try {
    if (options.skills) {
      try {
        await seedSkillsAndQuestions();
        results.skills = {
          success: true,
          message: "Skills and questions seeded successfully",
        };
      } catch (error: any) {
        results.skills = {
          success: false,
          message: error.message || "Failed to seed skills",
        };
        errors.push(`Skills: ${results.skills.message}`);
      }
    }

    if (options.dev) {
      try {
        await seedDevData();
        results.dev = {
          success: true,
          message: "Dev data seeded successfully",
        };
      } catch (error: any) {
        results.dev = {
          success: false,
          message: error.message || "Failed to seed dev data",
        };
        errors.push(`Dev: ${results.dev.message}`);
      }
    }

    if (options.demo) {
      try {
        await seedDemoData();
        results.demo = {
          success: true,
          message: "Demo data seeded successfully",
        };
      } catch (error: any) {
        results.demo = {
          success: false,
          message: error.message || "Failed to seed demo data",
        };
        errors.push(`Demo: ${results.demo.message}`);
      }
    }

    if (options.applications) {
      try {
        await seedApplications(options.teamId);
        results.applications = {
          success: true,
          message: `Applications seeded successfully${options.teamId ? ` for team ${options.teamId}` : ""}`,
        };
      } catch (error: any) {
        results.applications = {
          success: false,
          message: error.message || "Failed to seed applications",
        };
        errors.push(`Applications: ${results.applications.message}`);
      }
    }

    const allSuccess = Object.values(results).every((r) => r?.success);
    return {
      success: allSuccess,
      message:
        errors.length > 0
          ? errors.join("; ")
          : "All seeders completed successfully",
      results,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Unexpected error during seeding",
      results,
    };
  }
}
