import { NextRequest, NextResponse } from "next/server";
import { runSeeders, type SeedOptions } from "@/lib/db/seed-api";

/**
 * POST /api/admin/seed
 * Run database seeders on production
 *
 * Security: Requires ADMIN_SECRET environment variable
 *
 * Body:
 * {
 *   "skills": boolean,
 *   "dev": boolean,
 *   "demo": boolean,
 *   "applications": boolean,
 *   "teamId": number (optional, for applications seeder)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Validate admin secret
    const adminSecret = process.env.ADMIN_SECRET;
    if (!adminSecret) {
      return NextResponse.json(
        { error: "ADMIN_SECRET not configured" },
        { status: 500 }
      );
    }

    const authHeader = request.headers.get("authorization");

    if (authHeader !== `Bearer ${adminSecret}`) {
      return NextResponse.json(
        { error: `${JSON.stringify(request.headers)} !== ${adminSecret}` },
        { status: 401 }
      );
    }

    // Parse request body
    const body = await request.json().catch(() => ({}));
    const options: SeedOptions = {
      skills: body.skills === true,
      dev: body.dev === true,
      demo: body.demo === true,
      applications: body.applications === true,
      teamId: body.teamId ? parseInt(String(body.teamId), 10) : undefined,
    };

    // Validate at least one seeder is requested
    if (
      !options.skills &&
      !options.dev &&
      !options.demo &&
      !options.applications
    ) {
      return NextResponse.json(
        {
          error: "At least one seeder must be specified",
          available: ["skills", "dev", "demo", "applications"],
        },
        { status: 400 }
      );
    }

    // Run seeders
    const result = await runSeeders(options);

    return NextResponse.json({
      success: result.success,
      message: result.message,
      results: result.results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error running seeders:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/admin/seed
 * Get information about available seeders
 */
export async function GET() {
  return NextResponse.json({
    available: ["skills", "dev", "demo", "applications"],
    description: {
      skills: "Seed skills and challenge questions (production)",
      dev: "Seed development data (local testing)",
      demo: "Seed demo data for widget demos",
      applications: "Seed application data (requires teamId)",
    },
    usage: {
      method: "POST",
      auth: "Bearer <ADMIN_SECRET>",
      body: {
        skills: "boolean",
        dev: "boolean",
        demo: "boolean",
        applications: "boolean",
        teamId: "number (optional, for applications)",
      },
    },
  });
}
