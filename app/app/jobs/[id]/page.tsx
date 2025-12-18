import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import { getJobWithSkillsAndQuestionWeights } from "@/lib/jobs/queries";
import { getApplicationsForJob } from "@/lib/applications/queries";
import { Page } from "@/components/page";
import { JobDetailsPageClient } from "./_components/job-details-page-client";

export default async function JobDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  // Get the job with all related data
  const job = await getJobWithSkillsAndQuestionWeights(id, team.id);

  if (!job) {
    redirect("/app/jobs");
  }

  // Get applications for this job
  const applications = await getApplicationsForJob(id, team.id);

  return (
    <Page className="relative">
      <JobDetailsPageClient
        job={job as any}
        applications={applications}
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
