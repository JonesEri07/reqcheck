import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import {
  getClientSkillById,
  getChallengeQuestionById,
  getQuestionApplicationHistory,
  getQuestionJobAssociations,
} from "@/lib/skills/queries";
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
import { EditChallengeForm } from "./_components/edit-challenge-form";
import { ChallengeInsights } from "./_components/challenge-insights";
import { DeleteChallengeButton } from "./_components/delete-challenge-button";
import { DuplicateChallengeButton } from "./_components/duplicate-challenge-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function ChallengeQuestionDetailsPage({
  params,
}: {
  params: Promise<{ id: string; questionId: string }>;
}) {
  const { id, questionId } = await params;
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  // Get the client skill
  const skill = await getClientSkillById(id, team.id);

  if (!skill) {
    redirect("/app/skills");
  }

  // Get the challenge question
  const question = await getChallengeQuestionById(questionId, id, team.id);

  if (!question) {
    redirect(`/app/skills/${id}`);
  }

  // Get available tags for the team
  const availableTags = await getTeamTags(team.id);

  // Get insights data
  const [applicationHistory, jobAssociations] = await Promise.all([
    getQuestionApplicationHistory(questionId),
    getQuestionJobAssociations(questionId, team.id),
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
            <BreadcrumbLink asChild>
              <Link href={`/app/skills/${id}`}>{skill.skillName}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Challenge: {question.id}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="space-y-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold">Edit Challenge Question</h1>
            <p className="text-muted-foreground mt-2">
              Update challenge question for {skill.skillName}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <DuplicateChallengeButton questionId={questionId} skillId={id} />
            <DeleteChallengeButton
              questionId={questionId}
              skillId={id}
              questionPrompt={question.prompt}
            />
          </div>
        </div>

        <Tabs defaultValue="edit" className="space-y-6">
          <TabsList>
            <TabsTrigger value="edit">Edit Question</TabsTrigger>
            <TabsTrigger value="insights">Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="edit" className="space-y-6">
            <EditChallengeForm
              key={questionId}
              question={question}
              skillId={id}
              skillName={skill.skillName}
              skillIconSvg={skill.iconSvg}
              availableTags={availableTags}
              defaultTimeLimitSeconds={team.defaultQuestionTimeLimitSeconds}
            />
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <ChallengeInsights
              applicationHistory={applicationHistory as any}
              jobAssociations={jobAssociations as any}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Page>
  );
}
