import { redirect } from "next/navigation";
import { ContentHeader } from "@/components/content-header";
import { Page } from "@/components/page";
import { getTeamForUser } from "@/lib/db/queries";
import { getApplicationsForTeam } from "@/lib/applications/queries";
import { getJobsForTeam } from "@/lib/jobs/queries";
import { ApplicationsList } from "./_components/applications-list";

export default async function ApplicationsPage() {
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  // Fetch applications and jobs
  const [applications, jobs] = await Promise.all([
    getApplicationsForTeam(team.id),
    getJobsForTeam(team.id),
  ]);

  return (
    <Page>
      <ContentHeader title="Applications" />
      <ApplicationsList
        applications={applications}
        jobs={jobs.map((job) => ({
          id: job.id,
          title: job.title,
        }))}
      />
    </Page>
  );
}
