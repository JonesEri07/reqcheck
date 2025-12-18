import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import {
  getClientSkillById,
  getChallengeQuestionsForSkill,
  getSkillApplicationHistory,
  getSkillJobAssociations,
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
import { ClientSkillDetails } from "./_components/client-skill-details";

export default async function ClientSkillDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  // Get the client skill
  const skill = await getClientSkillById(id, team.id);

  if (!skill) {
    redirect("/app/skills");
  }

  // Get challenge questions for this skill
  const questions = await getChallengeQuestionsForSkill(id, team.id);

  // Get insights data
  const [applicationHistory, jobAssociations] = await Promise.all([
    getSkillApplicationHistory(id),
    getSkillJobAssociations(id, team.id),
  ]);

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
            <BreadcrumbPage>{skill.skillName}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ClientSkillDetails
        skill={skill}
        questions={questions}
        applicationHistory={applicationHistory as any}
        jobAssociations={jobAssociations as any}
      />
    </Page>
  );
}
