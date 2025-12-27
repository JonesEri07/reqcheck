import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import { getClientSkillById } from "@/lib/skills/queries";
import { getTeamTags } from "@/lib/tags/queries";
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
import { CreateChallengeForm } from "./_components/create-challenge-form";

export default async function CreateChallengePage({
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

  // Get available tags for the team
  const availableTags = await getTeamTags(team.id);

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
              <Link href={`/app/skills/${id}`}>{skill.skillName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Create Challenge</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Challenge Question</h1>
          <p className="text-muted-foreground mt-2">
            Add a new challenge question for {skill.skillName}
          </p>
        </div>

        <CreateChallengeForm
          skillId={id}
          skillName={skill.skillName}
          skillIconSvg={skill.iconSvg}
          availableTags={availableTags}
          defaultTimeLimitSeconds={team.defaultQuestionTimeLimitSeconds}
        />
      </div>
    </Page>
  );
}
