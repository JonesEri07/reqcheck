"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { CheckCircle2, Circle, Settings, ExternalLink } from "lucide-react";
import type { TeamIntegration, TeamDataWithMembers } from "@/lib/db/schema";
import {
  AVAILABLE_INTEGRATIONS,
  IntegrationType,
} from "@/lib/integrations/types";
import { SyncFrequency, PlanName } from "@/lib/db/schema";
import { useTierProtectedCallback } from "@/components/tier-protection/use-tier-protected-callback";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface IntegrationsGridProps {
  integrations: TeamIntegration[];
  isViewOnly: boolean;
}

export function IntegrationsGrid({
  integrations,
  isViewOnly,
}: IntegrationsGridProps) {
  const router = useRouter();
  const { data: teamData } = useSWR<TeamDataWithMembers>("/api/team", fetcher);
  const integrationMap = new Map(
    integrations.map((int) => [int.integration, int])
  );

  const planName = (teamData?.planName as PlanName) || PlanName.FREE;

  // Protected callback for connecting to integrations (Pro+ feature)
  const handleConnect = useTierProtectedCallback(
    {
      planName,
      minimumTier: PlanName.PRO,
      featureName: "ATS Integrations",
      dialogTitle: "Upgrade to Pro+ Required",
      dialogDescription:
        "ATS integrations are available on Pro+ plans. Upgrade to Pro to connect with Greenhouse and other ATS platforms.",
    },
    (integrationType: IntegrationType) => {
      router.push(`/app/integrations/${integrationType}`);
    }
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.values(AVAILABLE_INTEGRATIONS).map((integrationMeta) => {
        const integration = integrationMap.get(integrationMeta.type);
        const isConnected = !!integration;
        const config = integration?.config as any;

        return (
          <Card key={integrationMeta.type}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      {integrationMeta.type === IntegrationType.GREENHOUSE && (
                        <Image
                          src="/images/icons/GREENHOUSE_ICON_GREEN.svg"
                          alt="Greenhouse"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
                      )}
                      {integrationMeta.name}
                    </div>
                    {isConnected && (
                      <Badge variant="default" className="gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Connected
                      </Badge>
                    )}
                    {!isConnected && (
                      <Badge variant="outline" className="gap-1">
                        <Circle className="h-3 w-3" />
                        Not Connected
                      </Badge>
                    )}
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {integrationMeta.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isConnected && integration && (
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">
                      Sync Frequency:
                    </span>
                    <Badge variant="secondary">
                      {integration.syncFrequency}
                    </Badge>
                  </div>
                  {integration.lastSyncAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="text-foreground">
                        {formatDistanceToNow(new Date(integration.lastSyncAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                  )}
                  {!integration.lastSyncAt && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Last Sync:</span>
                      <span className="text-muted-foreground">Never</span>
                    </div>
                  )}
                </div>
              )}
              {!isConnected && (
                <p className="text-sm text-muted-foreground">
                  Connect to start syncing jobs automatically
                </p>
              )}
            </CardContent>
            <CardFooter className="flex gap-2">
              {isConnected ? (
                <Button asChild variant="default" className="flex-1">
                  <Link href={`/app/integrations/${integrationMeta.type}`}>
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Link>
                </Button>
              ) : (
                <Button
                  variant="default"
                  className="flex-1"
                  disabled={isViewOnly}
                  onClick={() => handleConnect(integrationMeta.type)}
                >
                  Connect
                </Button>
              )}
              {integrationMeta.documentationUrl && (
                <Button asChild variant="outline" size="icon">
                  <a
                    href={integrationMeta.documentationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
