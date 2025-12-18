import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import { ContentHeader } from "@/components/content-header";
import { Page } from "@/components/page";
import { CreateJobForm } from "./_components/create-job-form";

export default async function CreateJobPage() {
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  return (
    <Page className="relative">
      <ContentHeader
        title="Create Job"
        breadcrumbs={[
          { label: "Jobs", href: "/app/jobs" },
          { label: "Create Job" },
        ]}
      />
      <CreateJobForm
        teamDefaults={{
          defaultPassThreshold: team.defaultPassThreshold || 60,
          defaultQuestionCount: team.defaultQuestionCount || 5,
          defaultQuestionTimeLimitSeconds:
            team.defaultQuestionTimeLimitSeconds || 0,
        }}
      />
    </Page>
  );
}
