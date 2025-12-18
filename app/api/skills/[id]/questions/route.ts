import { NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import { getChallengeQuestionsForSkill } from "@/lib/skills/queries";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const team = await getTeamForUser();
    if (!team) {
      return NextResponse.json({ error: "Team not found" }, { status: 404 });
    }

    const { id } = await params;

    const questions = await getChallengeQuestionsForSkill(id, team.id);

    return NextResponse.json(questions);
  } catch (error: any) {
    console.error("Error fetching questions:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch questions" },
      { status: 500 }
    );
  }
}

