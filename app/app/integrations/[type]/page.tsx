import { redirect } from "next/navigation";
import { getTeamForUser } from "@/lib/db/queries";
import { getTeamIntegrationByType } from "@/lib/integrations/queries";
import { requireTeamOwner } from "@/lib/auth/privileges";
import { Page } from "@/components/page";
import { ContentHeader } from "@/components/content-header";
import { IntegrationDetails } from "./_components/integration-details";
import {
  IntegrationType,
  AVAILABLE_INTEGRATIONS,
} from "@/lib/integrations/types";
import Image from "next/image";
import { TeamIntegration } from "@/lib/db/schema";
import {
  Breadcrumb,
  BreadcrumbLink,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default async function IntegrationDetailPage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const { type } = await params;
  const team = await getTeamForUser();

  if (!team) {
    redirect("/pricing");
  }

  // Verify integration type is valid
  if (!Object.values(IntegrationType).includes(type as IntegrationType)) {
    redirect("/app/integrations");
  }

  // Require team owner
  try {
    await requireTeamOwner(team.id);
  } catch {
    redirect("/app/integrations");
  }

  const integration = await getTeamIntegrationByType(team.id, type);
  const integrationMeta = AVAILABLE_INTEGRATIONS[type as IntegrationType];

  return (
    <Page>
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/app/integrations">Integrations</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{integrationMeta.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div className="flex items-center gap-2">
        {type === IntegrationType.GREENHOUSE && (
          <div className="flex items-center bg-secondary p-3 rounded-md w-10 h-10 mb-4">
            <Image
              src="/images/icons/GREENHOUSE_ICON_GREEN.svg"
              alt="Greenhouse"
              width={20}
              height={20}
              className="object-contain"
            />
          </div>
        )}
        <ContentHeader title={`${integrationMeta.name} Integration`} />
      </div>
      <IntegrationDetails
        integrationType={type as IntegrationType}
        integration={integration as TeamIntegration}
        integrationMeta={integrationMeta}
      />
    </Page>
  );
}
