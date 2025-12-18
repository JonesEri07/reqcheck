import { getTeamForUser } from "@/lib/db/queries";
import {
  getGlobalSkills,
  getClientSkillsWithGlobal,
} from "@/lib/skills/queries";

export async function GET(request: Request) {
  const team = await getTeamForUser();

  if (!team) {
    return Response.json({ error: "Team not found" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") || undefined;
  const limit = searchParams.get("limit")
    ? parseInt(searchParams.get("limit")!, 10)
    : undefined;

  // Get all global skills (CURATED and VERIFIED), not just available ones
  // We need to get all skills and filter manually since getGlobalSkills only accepts one status
  // Don't pass search to getGlobalSkills since it doesn't search aliases - we'll filter client-side
  const allSkills = await getGlobalSkills({
    limit: limit ? limit * 3 : undefined, // Get more to account for filtering
  });

  // Get client skills to check which global skills are already in library
  const clientSkills = await getClientSkillsWithGlobal(team.id);
  const clientSkillTaxonomyIds = new Set(
    clientSkills
      .map((cs) => cs.skillTaxonomyId)
      .filter((id): id is string => id !== null)
  );

  // Filter by search if provided (for aliases since DB query doesn't search them)
  // All skills in skillTaxonomy are considered curated (promoted from promotionalSkills)
  const searchLower = search?.toLowerCase();
  const filteredSkills = allSkills
    .filter(
      (skill) =>
        !searchLower ||
        skill.skillName.toLowerCase().includes(searchLower) ||
        skill.skillNormalized.includes(searchLower) ||
        (skill.aliases || []).some((alias) =>
          alias.toLowerCase().includes(searchLower)
        )
    )
    .sort((a, b) => a.skillName.localeCompare(b.skillName))
    .slice(0, limit); // Apply limit after filtering

  // Transform to match expected format and mark which are already in library
  const transformedSkills = filteredSkills.map((skill) => {
    const clientSkill = clientSkills.find(
      (cs) => cs.skillTaxonomyId === skill.id
    );
    return {
      id: skill.id,
      skillName: skill.skillName,
      skillNormalized: skill.skillNormalized,
      aliases: skill.aliases || [],
      description: null,
      // Include client skill ID if already in library for linking
      clientSkillId: clientSkill?.id,
    };
  });

  return Response.json(transformedSkills);
}
