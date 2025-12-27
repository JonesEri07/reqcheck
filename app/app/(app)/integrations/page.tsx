import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import { getIntegrationsForTeam } from "@/lib/integrations/queries";
import { requireTeamOwner } from "@/lib/auth/privileges";
import { Page } from "@/components/page";
import { ContentHeader } from "@/components/content-header";
import { IntegrationsGrid } from "./_components/integrations-grid";
import { Eye } from "lucide-react";

export default async function IntegrationsPage() {
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  let isViewOnly = false;
  try {
    await requireTeamOwner(team.id);
  } catch {
    isViewOnly = true;
  }

  const integrations = await getIntegrationsForTeam(team.id);

  return (
    <Page>
      <ContentHeader
        title="Integrations"
        actions={
          isViewOnly
            ? [
                {
                  label: "View Only",
                  variant: "secondary",
                  disabled: true,
                  icon: <Eye className="h-4 w-4" />,
                },
              ]
            : undefined
        }
      />
      <IntegrationsGrid integrations={integrations} isViewOnly={isViewOnly} />
    </Page>
  );
}
