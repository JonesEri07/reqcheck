import { getTeamForUser } from "@/lib/db/queries";
import { getClientSkillsWithGlobal } from "@/lib/skills/queries";

export async function GET(request: Request) {
  const team = await getTeamForUser();

  if (!team) {
    return Response.json({ error: "Team not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;

  const skills = await getClientSkillsWithGlobal(team.id);

  // Filter by search if provided
  let filteredSkills = skills;
  if (search) {
    const searchLower = search.toLowerCase();
    filteredSkills = skills.filter(
      (skill) =>
        skill.skillName.toLowerCase().includes(searchLower) ||
        skill.skillNormalized.includes(searchLower) ||
        skill.description?.toLowerCase().includes(searchLower) ||
        (skill.aliases || []).some((alias) =>
          alias.toLowerCase().includes(searchLower)
        )
    );
  }

  return Response.json(filteredSkills);
}
