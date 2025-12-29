import { NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import { db } from "@/lib/db/drizzle";
import { jobs, teamMembers, clientSkills, clientChallengeQuestions } from "@/lib/db/schema";
import { eq, count, isNull, and, sql } from "drizzle-orm";

export async function GET() {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json(
        { error: "Team not found" },
        { status: 404 }
      );
    }

    // Count total jobs (all statuses, not archived)
    const totalJobsResult = await db
      .select({ count: count() })
      .from(jobs)
      .where(
        and(
          eq(jobs.teamId, team.id),
          isNull(jobs.archivedAt)
        )
      );

    const totalJobs = Number(totalJobsResult[0]?.count ?? 0);

    // Count active jobs (OPEN status, not archived)
    const activeJobsResult = await db
      .select({ count: count() })
      .from(jobs)
      .where(
        and(
          eq(jobs.teamId, team.id),
          eq(jobs.status, "OPEN"),
          isNull(jobs.archivedAt)
        )
      );

    const activeJobs = Number(activeJobsResult[0]?.count ?? 0);

    // Count team members
    const teamMembersResult = await db
      .select({ count: count() })
      .from(teamMembers)
      .where(eq(teamMembers.teamId, team.id));

    const teamMembersCount = Number(teamMembersResult[0]?.count ?? 0);

    // Count custom skills (skills where skillTaxonomyId is null)
    const customSkillsResult = await db
      .select({ count: count() })
      .from(clientSkills)
      .where(
        and(
          eq(clientSkills.teamId, team.id),
          sql`${clientSkills.skillTaxonomyId} IS NULL`
        )
      );

    const customSkillsCount = Number(customSkillsResult[0]?.count ?? 0);

    // Get max questions per skill (find the skill with the most questions)
    const maxQuestionsResult = await db
      .select({
        skillId: clientChallengeQuestions.clientSkillId,
        questionCount: count(clientChallengeQuestions.id),
      })
      .from(clientChallengeQuestions)
      .innerJoin(
        clientSkills,
        eq(clientChallengeQuestions.clientSkillId, clientSkills.id)
      )
      .where(eq(clientSkills.teamId, team.id))
      .groupBy(clientChallengeQuestions.clientSkillId)
      .orderBy(sql`${count(clientChallengeQuestions.id)} DESC`)
      .limit(1);

    const maxQuestionsPerSkill = maxQuestionsResult[0]
      ? Number(maxQuestionsResult[0].questionCount ?? 0)
      : 0;

    return NextResponse.json({
      totalJobs,
      activeJobs,
      teamMembers: teamMembersCount,
      customSkills: customSkillsCount,
      maxQuestionsPerSkill,
    });
  } catch (error: any) {
    console.error("Error fetching usage statistics:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch usage statistics" },
      { status: 500 }
    );
  }
}

