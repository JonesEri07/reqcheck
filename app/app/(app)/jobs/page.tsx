import { redirect } from "next/navigation";
import { ContentHeader } from "@/components/content-header";
import { Page } from "@/components/page";
import { Plus } from "lucide-react";
import { getTeamForUser } from "@/lib/db/queries";
import { getJobsForTeam } from "@/lib/jobs/queries";
import { JobsList } from "./_components/jobs-list";

export default async function JobsPage() {
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  const jobs = await getJobsForTeam(team.id);

  return (
    <Page>
      <ContentHeader
        title="Jobs"
        actions={[
          {
            label: "Create Job",
            href: "/app/jobs/create",
            icon: <Plus className="h-4 w-4" />,
            asChild: true,
          },
        ]}
      />
      <JobsList jobs={jobs} />
    </Page>
  );
}
