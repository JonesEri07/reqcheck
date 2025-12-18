"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Eye, Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import type { Application } from "@/lib/db/schema";

interface ApplicationsListProps {
  applications: Array<{
    id: string;
    email: string;
    verified: boolean;
    score: number | null;
    passed: boolean | null;
    completedAt: Date | null;
    createdAt: Date;
    job: {
      id: string;
      title: string;
      externalJobId: string;
    } | null;
  }>;
  jobs: Array<{
    id: string;
    title: string;
  }>;
}

type StatusFilter = "all" | "passed" | "failed";

export function ApplicationsList({
  applications,
  jobs,
}: ApplicationsListProps) {
  const [search, setSearch] = useState("");
  const [jobFilter, setJobFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [jobPopoverOpen, setJobPopoverOpen] = useState(false);
  const [jobSearch, setJobSearch] = useState("");

  // Reset search when popover closes
  useEffect(() => {
    if (!jobPopoverOpen) {
      setJobSearch("");
    }
  }, [jobPopoverOpen]);

  // Get selected job name for display
  const selectedJob = jobs.find((j) => j.id === jobFilter);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        if (
          !app.email.toLowerCase().includes(searchLower) &&
          !app.job?.title.toLowerCase().includes(searchLower) &&
          !app.job?.externalJobId.toLowerCase().includes(searchLower)
        ) {
          return false;
        }
      }

      // Job filter
      if (jobFilter !== "all" && app.job?.id !== jobFilter) {
        return false;
      }

      // Status filter
      if (statusFilter === "passed" && app.passed !== true) {
        return false;
      }
      if (statusFilter === "failed" && app.passed !== false) {
        return false;
      }

      return true;
    });
  }, [applications, search, jobFilter, statusFilter]);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by email, job title, or job ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Popover open={jobPopoverOpen} onOpenChange={setJobPopoverOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={jobPopoverOpen}
              className="w-[200px] justify-between"
            >
              {jobFilter === "all"
                ? "All Jobs"
                : selectedJob
                  ? selectedJob.title
                  : "Select job..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command shouldFilter={false}>
              <CommandInput
                placeholder="Search jobs..."
                value={jobSearch}
                onValueChange={setJobSearch}
              />
              <CommandList>
                <CommandEmpty>No jobs found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    value="all"
                    onSelect={() => {
                      setJobFilter("all");
                      setJobPopoverOpen(false);
                      setJobSearch("");
                    }}
                    className="cursor-pointer"
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        jobFilter === "all" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All Jobs
                  </CommandItem>
                  {jobs
                    .filter((job) => {
                      if (!jobSearch) return true;
                      return job.title
                        .toLowerCase()
                        .includes(jobSearch.toLowerCase());
                    })
                    .map((job) => (
                      <CommandItem
                        key={job.id}
                        value={job.title}
                        onSelect={() => {
                          setJobFilter(job.id);
                          setJobPopoverOpen(false);
                          setJobSearch("");
                        }}
                        className="cursor-pointer"
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            jobFilter === job.id ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {job.title}
                      </CommandItem>
                    ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as StatusFilter)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="passed">Passed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredApplications.length} of {applications.length}{" "}
        application{applications.length !== 1 ? "s" : ""}
      </div>

      {/* Applications Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Score</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Completed</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8">
                  <p className="text-sm text-muted-foreground">
                    No applications found matching your filters.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              filteredApplications.map((application) => (
                <TableRow key={application.id}>
                  <TableCell>
                    <Link
                      href={`/app/applicants/${encodeURIComponent(application.email)}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {application.email}
                    </Link>
                  </TableCell>
                  <TableCell>
                    {application.job ? (
                      <Link
                        href={`/app/jobs/${application.job.id}`}
                        className="text-primary hover:underline"
                      >
                        {application.job.title}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">Unknown Job</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {application.passed === true ? (
                      <Badge className="bg-green-500">Passed</Badge>
                    ) : application.passed === false ? (
                      <Badge variant="destructive">Failed</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {application.score !== null ? `${application.score}%` : "—"}
                  </TableCell>
                  <TableCell>
                    {format(new Date(application.createdAt), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell>
                    {application.completedAt
                      ? format(new Date(application.completedAt), "MMM d, yyyy")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href={`/app/applications/${application.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
