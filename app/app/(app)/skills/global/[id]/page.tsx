import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import {
  getGlobalSkills,
  getClientSkillsWithGlobal,
  getGlobalChallengeQuestionsForSkill,
} from "@/lib/skills/queries";
import { Page } from "@/components/page";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import Link from "next/link";
import { GlobalSkillDetails } from "./_components/global-skill-details";
import SyncBehavior from "../../explore/_components/sync-behavior";

export default async function GlobalSkillDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  // Get the global skill
  const globalSkills = await getGlobalSkills({ limit: 1000 });
  const skill = globalSkills.find((s) => s.id === id);

  if (!skill) {
    redirect("/app/skills");
  }

  // Check if skill is already in client library and get the client skill
  const clientSkills = await getClientSkillsWithGlobal(team.id);
  const clientSkill = clientSkills.find(
    (cs) => cs.skillTaxonomyId === skill.id
  );
  const isInLibrary = !!clientSkill;

  // Get challenge questions for this global skill
  const questions = await getGlobalChallengeQuestionsForSkill(skill.id);

  return (
    <Page>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/app/skills">Skills Library</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/app/skills/explore">Explore</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{skill.skillName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <GlobalSkillDetails
        skill={skill}
        isInLibrary={isInLibrary}
        clientSkillId={clientSkill?.id}
        questions={questions}
      />
      <SyncBehavior teamData={team} />
    </Page>
  );
}
