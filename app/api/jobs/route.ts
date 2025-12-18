import { NextRequest, NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import { getJobsForTeam } from "@/lib/jobs/queries";

/**
 * GET /api/jobs
 * Get all jobs for the current team (for demo/testing)
 */
export async function GET() {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const jobs = await getJobsForTeam(team.id);

    // Return simplified job list for demo
    return NextResponse.json(
      jobs.map((job) => ({
        id: job.id,
        externalJobId: job.externalJobId,
        title: job.title,
        status: job.status,
      }))
    );
  } catch (error: any) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
