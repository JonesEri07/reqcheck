"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { SkillsGrid } from "../_components/skills-grid";
import useSWR from "swr";
import { ContentHeader } from "@/components/content-header";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateSkillSheet } from "../_components/create-skill-sheet";
import { SyncChallengeQuestions, PlanName } from "@/lib/db/schema";
import { useTierProtectedCallback } from "@/components/tier-protection/use-tier-protected-callback";
import type { TeamDataWithMembers } from "@/lib/db/schema";
import SyncBehavior from "./_components/sync-behavior";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ExploreSkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [createSheetOpen, setCreateSheetOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch global skills
  const {
    data: globalSkills,
    mutate: mutateGlobalSkills,
    isLoading: isLoadingGlobal,
  } = useSWR(
    `/api/skills/global${debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : ""}`,
    fetcher
  );

  // Fetch team settings for sync behavior
  const { data: teamData } = useSWR<
    TeamDataWithMembers & {
      syncChallengeQuestions?: SyncChallengeQuestions;
    }
  >("/api/team", fetcher);

  // Fetch total custom questions count
  const { data: customQuestionsData } = useSWR<{ count: number }>(
    "/api/skills/custom-questions-count",
    fetcher
  );

  const planName = (teamData?.planName as PlanName) || PlanName.FREE;
  const currentTotalCount = customQuestionsData?.count ?? 0;

  // Protected callback for creating custom skill
  const handleCreateCustomSkill = useTierProtectedCallback(
    {
      currentCount: currentTotalCount,
      planName,
      limitType: "customQuestions",
      dialogTitle: "Custom Question Limit Reached",
      dialogDescription:
        planName === "PRO" || planName === "ENTERPRISE" ? (
          <>
            You've reached the maximum of 500 custom questions for your{" "}
            {planName} plan.
            <br />
            <br />
            This is the highest limit available. Consider removing unused
            questions to free up space before creating new skills.
          </>
        ) : (
          <>
            You've reached the maximum of 10 custom questions for your{" "}
            {planName} plan.
            <br />
            <br />
            Upgrade to Pro to create up to 500 custom questions across all your
            skills.
          </>
        ),
      featureName: "custom questions",
    },
    () => setCreateSheetOpen(true)
  );

  const handleUpdate = () => {
    mutateGlobalSkills();
  };

  return (
    <Page>
      <ContentHeader
        title="Explore Skills"
        subtitle="Browse the global skills library or create a custom skill"
        actions={[
          {
            label: "Create Custom Skill",
            onClick: handleCreateCustomSkill,
            icon: <Plus className="h-4 w-4" />,
          },
        ]}
        breadcrumbs={[
          { label: "Skills Library", href: "/app/skills" },
          { label: "Explore", href: "/app/skills/explore" },
        ]}
      />

      <div className="space-y-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search global skills..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {isLoadingGlobal ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : globalSkills && globalSkills.length > 0 ? (
          <SkillsGrid
            skills={globalSkills}
            variant="global"
            onUpdate={handleUpdate}
          />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No skills found</CardTitle>
              <CardDescription>
                {searchQuery
                  ? `No skills match "${searchQuery}". Try a different search or create a custom skill.`
                  : "No skills available. Create a custom skill to get started."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleCreateCustomSkill}>
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Skill
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      <CreateSkillSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        onSuccess={handleUpdate}
      />

      {/* Sync Behavior Info Pill */}
      {teamData && <SyncBehavior teamData={teamData} />}
    </Page>
  );
}
