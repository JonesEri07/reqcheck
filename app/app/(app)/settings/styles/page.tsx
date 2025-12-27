"use client";

import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WidgetStyles } from "../configuration/_components/widget-styles";
import useSWR from "swr";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function StylesSkeleton() {
  return (
    <div className="space-y-6">
      <Card className="h-64 animate-pulse">
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
    </div>
  );
}

export default function StylesPage() {
  const router = useRouter();
  const { data: teamData } = useSWR<{ currentUserRole?: string }>(
    "/api/team",
    fetcher
  );

  useEffect(() => {
    // Only redirect if we have data AND the role is explicitly not owner
    // Don't redirect if teamData is still loading (currentUserRole is undefined)
    if (
      teamData &&
      teamData.currentUserRole !== undefined &&
      teamData.currentUserRole !== "owner"
    ) {
      router.push("/app/settings/general");
    }
  }, [teamData, router]);

  // Don't render if not owner (will redirect)
  // But wait for data to load first
  if (
    teamData &&
    teamData.currentUserRole !== undefined &&
    teamData.currentUserRole !== "owner"
  ) {
    return null;
  }

  return (
    <>
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        Styles
      </h1>
      <Suspense fallback={<StylesSkeleton />}>
        <div className="space-y-6">
          <WidgetStyles />
        </div>
      </Suspense>
    </>
  );
}
