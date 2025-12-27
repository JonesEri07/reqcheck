import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import { getApplicationsByEmail } from "@/lib/applications/queries";
import { Page } from "@/components/page";
import { ContentHeader } from "@/components/content-header";
import { ApplicantDetails } from "./_components/applicant-details";

export default async function ApplicantDetailsPage({
  params,
}: {
  params: Promise<{ email: string }>;
}) {
  const { email } = await params;
  const decodedEmail = decodeURIComponent(email);
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  // Get all applications for this email
  const applicantApplications = await getApplicationsByEmail(
    decodedEmail,
    team.id
  );

  if (applicantApplications.length === 0) {
    redirect("/app/applications");
  }

  return (
    <Page>
      <ContentHeader title={`Applicant: ${decodedEmail}`} />
      <ApplicantDetails
        email={decodedEmail}
        applications={applicantApplications}
      />
    </Page>
  );
}
