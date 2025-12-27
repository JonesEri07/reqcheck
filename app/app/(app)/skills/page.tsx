"use client";

import { useState, useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Search, Plus, AlertTriangle, X } from "lucide-react";
import { SkillsGrid } from "./_components/skills-grid";
import useSWR from "swr";
import { ContentHeader } from "@/components/content-header";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import { CreateSkillSheet } from "./_components/create-skill-sheet";
import { checkDuplicateAliases } from "./actions";
import { Card } from "@/components/ui/card";
import { ResolveAliasConflictsDialog } from "./_components/resolve-alias-conflicts-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type SkillFilter = "all" | "custom" | "linked";

export default function SkillsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [skillFilter, setSkillFilter] = useState<SkillFilter>("all");
  const [createSheetOpen, setCreateSheetOpen] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState<{
    hasDuplicates: boolean;
    conflicts?: Array<{
      alias: string;
      skills: Array<{ id: string; name: string; type: "client" }>;
    }>;
  } | null>(null);
  const [showWarningBanner, setShowWarningBanner] = useState(true);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch client skills
  const {
    data: clientSkills,
    mutate: mutateClientSkills,
    isLoading: isLoadingClient,
  } = useSWR(
    `/api/skills/client${debouncedSearch ? `?search=${encodeURIComponent(debouncedSearch)}` : ""}`,
    fetcher
  );

  // Check for duplicate aliases
  useEffect(() => {
    const checkDuplicates = async () => {
      const result = await checkDuplicateAliases();
      if ("hasDuplicates" in result) {
        setDuplicateWarning({
          hasDuplicates: result.hasDuplicates || false,
          conflicts: result.conflicts,
        });
      }
    };
    checkDuplicates();
  }, [clientSkills]);

  const handleUpdate = () => {
    mutateClientSkills();
  };

  // Filter skills based on selected filter
  const filteredSkills = useMemo(() => {
    if (!clientSkills) return [];

    if (skillFilter === "all") {
      return clientSkills;
    }

    if (skillFilter === "custom") {
      return clientSkills.filter((skill: any) => !skill.skillTaxonomy);
    }

    if (skillFilter === "linked") {
      return clientSkills.filter((skill: any) => skill.skillTaxonomy !== null);
    }

    return clientSkills;
  }, [clientSkills, skillFilter]);

  return (
    <Page>
      <ContentHeader
        title="Skills Library"
        subtitle="Manage the skills in your library"
        actions={[
          {
            label: "Explore/Add Skills",
            href: "/app/skills/explore",
            asChild: true,
          },
          // {
          //   label: "Create Custom Skill",
          //   onClick: () => setCreateSheetOpen(true),
          //   icon: <Plus className="h-4 w-4" />,
          // },
        ]}
      />

      <div className="space-y-6">
        {/* Duplicate Alias Warning Banner */}
        {duplicateWarning?.hasDuplicates && showWarningBanner && (
          <Card className="border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/20">
            <div className="px-6 py-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                  Duplicate Aliases Detected
                </h3>
                <p className="text-sm text-yellow-800 dark:text-yellow-200 mb-3">
                  Some aliases are used by multiple skills. This may cause both
                  skills to be auto-connected to jobs mentioning those aliases.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setResolveDialogOpen(true)}
                  className="border-yellow-600 text-yellow-900 hover:bg-yellow-100 dark:border-yellow-500 dark:text-yellow-100 dark:hover:bg-yellow-900/20"
                >
                  Resolve Conflicts
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowWarningBanner(false)}
                className="h-6 w-6 p-0 text-yellow-600 hover:text-yellow-900 dark:text-yellow-500 dark:hover:text-yellow-100"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        )}

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search your skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select
            value={skillFilter}
            onValueChange={(value) => setSkillFilter(value as SkillFilter)}
          >
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
              <SelectItem value="linked">Linked</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoadingClient ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : (
          <SkillsGrid
            skills={filteredSkills}
            variant="client"
            onUpdate={handleUpdate}
          />
        )}
      </div>

      <CreateSkillSheet
        open={createSheetOpen}
        onOpenChange={setCreateSheetOpen}
        onSuccess={handleUpdate}
      />

      {duplicateWarning?.conflicts && (
        <ResolveAliasConflictsDialog
          open={resolveDialogOpen}
          onOpenChange={setResolveDialogOpen}
          conflicts={duplicateWarning.conflicts}
          onResolved={() => {
            handleUpdate();
            // Re-check duplicates after resolution
            checkDuplicateAliases().then((result) => {
              if ("hasDuplicates" in result) {
                setDuplicateWarning({
                  hasDuplicates: result.hasDuplicates || false,
                  conflicts: result.conflicts,
                });
              }
            });
          }}
        />
      )}
    </Page>
  );
}
