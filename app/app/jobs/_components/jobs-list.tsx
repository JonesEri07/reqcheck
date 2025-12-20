"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LayoutGrid, Table2, Search } from "lucide-react";
import { JobsTable } from "./jobs-table";
import { JobsCardView } from "./jobs-card-view";
import { JobStatus, JobSource } from "@/lib/db/schema";
import type { JobWithCounts } from "@/lib/jobs/queries";

interface JobsListProps {
  jobs: JobWithCounts[];
}

type ViewMode = "table" | "cards";

const VIEW_MODE_STORAGE_KEY = "jobs-view-mode";

export function JobsList({ jobs }: JobsListProps) {
  const [viewMode, setViewMode] = useState<ViewMode>("table");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<JobStatus | "all">("all");
  const [sourceFilter, setSourceFilter] = useState<JobSource | "all">("all");

  // Get unique sources from jobs
  const availableSources = useMemo(() => {
    const sources = new Set<JobSource>();
    jobs.forEach((job) => {
      sources.add(job.source as JobSource);
    });
    return Array.from(sources).sort();
  }, [jobs]);

  // Filter jobs (shared between both views)
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        if (
          !job.title.toLowerCase().includes(searchLower) &&
          !job.externalJobId.toLowerCase().includes(searchLower) &&
          !job.description?.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all" && job.status !== statusFilter) {
        return false;
      }

      // Source filter
      if (sourceFilter !== "all" && job.source !== sourceFilter) {
        return false;
      }

      return true;
    });
  }, [jobs, search, statusFilter, sourceFilter]);

  // Load view mode preference from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(VIEW_MODE_STORAGE_KEY);
    if (saved === "table" || saved === "cards") {
      setViewMode(saved);
    }
  }, []);

  // Save view mode preference to localStorage
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    localStorage.setItem(VIEW_MODE_STORAGE_KEY, mode);
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by title, ID, or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as JobStatus | "all")}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value={JobStatus.OPEN}>Open</SelectItem>
            <SelectItem value={JobStatus.DRAFT}>Draft</SelectItem>
            <SelectItem value={JobStatus.ARCHIVED}>Archived</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={sourceFilter}
          onValueChange={(v) => setSourceFilter(v as JobSource | "all")}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {availableSources.map((source) => (
              <SelectItem key={source} value={source}>
                {source === JobSource.MANUAL
                  ? "Manual"
                  : source === JobSource.GREENHOUSE
                    ? "Greenhouse"
                    : source}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results count and View Toggle */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredJobs.length} of {jobs.length} job
          {jobs.length !== 1 ? "s" : ""}
        </div>
        <div className="flex items-center gap-1 border rounded-md p-1">
          <Button
            variant={viewMode === "table" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleViewModeChange("table")}
            className="gap-2"
          >
            <Table2 className="h-4 w-4" />
            Table
          </Button>
          <Button
            variant={viewMode === "cards" ? "default" : "ghost"}
            size="sm"
            onClick={() => handleViewModeChange("cards")}
            className="gap-2"
          >
            <LayoutGrid className="h-4 w-4" />
            Cards
          </Button>
        </div>
      </div>

      {/* Render appropriate view */}
      {viewMode === "table" ? (
        <JobsTable jobs={filteredJobs} />
      ) : (
        <JobsCardView jobs={filteredJobs} />
      )}
    </div>
  );
}
