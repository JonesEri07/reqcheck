"use client";

import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamSettings } from "./_components/team-settings";
import { WhitelistSettings } from "./_components/whitelist-settings";
import { ApiKeySettings } from "./_components/api-key-settings";
import { WebhookSettings } from "./_components/webhook-settings";
import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function ConfigurationSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="h-64 animate-pulse">
          <CardHeader>
            <div className="h-6 w-48 bg-muted rounded" />
            <div className="h-4 w-64 bg-muted rounded mt-2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="h-10 w-full bg-muted rounded" />
              <div className="h-10 w-full bg-muted rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

export default function ConfigurationPage() {
  const router = useRouter();
  const { data: teamData } = useSWR<{ currentUserRole?: string }>(
    "/api/team",
    fetcher
  );

  useEffect(() => {
    if (teamData && teamData.currentUserRole !== "owner") {
      router.push("/app/settings/general");
    }
  }, [teamData, router]);

  // Don't render if not owner (will redirect)
  if (teamData && teamData.currentUserRole !== "owner") {
    return null;
  }

  return (
    <>
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        Configuration
      </h1>
      <Suspense fallback={<ConfigurationSkeleton />}>
        <div className="space-y-6">
          <TeamSettings />
          <WhitelistSettings />
          <ApiKeySettings />
          <WebhookSettings />
        </div>
      </Suspense>
    </>
  );
}
