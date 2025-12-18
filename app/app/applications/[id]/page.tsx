import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import { getApplicationWithDetails } from "@/lib/applications/queries";
import { Page } from "@/components/page";
import { ApplicationDetailsPageClient } from "./_components/application-details-page-client";

export default async function ApplicationDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  // Get the application with all related data
  const application = await getApplicationWithDetails(id, team.id);

  if (!application) {
    redirect("/app/applications");
  }

  return (
    <Page className="relative">
      <ApplicationDetailsPageClient application={application as any} />
    </Page>
  );
}
