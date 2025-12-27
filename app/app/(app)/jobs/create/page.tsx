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
          defaultQuestionCount: (() => {
            const qc = team.defaultQuestionCount as any;
            if (qc && typeof qc === "object" && qc.type === "fixed") {
              return qc.value;
            }
            // Legacy: if it's a number, return it
            if (typeof qc === "number") {
              return qc;
            }
            return 5;
          })(),
          defaultQuestionTimeLimitSeconds:
            team.defaultQuestionTimeLimitSeconds || 0,
        }}
      />
    </Page>
  );
}
