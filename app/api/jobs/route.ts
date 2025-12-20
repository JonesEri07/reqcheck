import { NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import { getJobsForTeam } from "@/lib/jobs/queries";
import { db } from "@/lib/db/drizzle";

/**
 * GET /api/jobs
 * Get all jobs for the current team (for demo/testing)
 * Falls back to demo team if user is not logged in
 */
export async function GET() {
  try {
    let team = await getTeamForUser();

    // If no team found (user not logged in), try to get demo team
    if (!team) {
      const demoUser = await db.query.users.findFirst({
        where: (users, { eq }) => eq(users.email, "demo@reqcheck.com"),
      });

      if (demoUser) {
        const teamMember = await db.query.teamMembers.findFirst({
          where: (teamMembers, { eq }) => eq(teamMembers.userId, demoUser.id),
          with: {
            team: {
              with: {
                teamMembers: {
                  with: {
                    user: {
                      columns: {
                        id: true,
                        name: true,
                        email: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (teamMember?.team) {
          team = teamMember.team;
        } else {
          return NextResponse.json([], { status: 200 });
        }
      } else {
        return NextResponse.json([], { status: 200 });
      }
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
