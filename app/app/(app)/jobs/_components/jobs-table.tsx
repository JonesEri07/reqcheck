"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Filter,
  MoreHorizontal,
  Users,
  Briefcase,
  Calendar,
  ExternalLink,
  Eye,
  Edit,
  Archive,
  Trash2,
  Columns3Cog,
} from "lucide-react";
import { JobStatus, JobSource } from "@/lib/db/schema";
import { SkillIcon } from "@/components/skill-icon";
import { JobSourceBadge } from "@/components/job-source-badge";
import type { JobWithCounts } from "@/lib/jobs/queries";

interface JobsTableProps {
  jobs: JobWithCounts[];
}

type SortField =
  | "title"
  | "status"
  | "source"
  | "applicationCount"
  | "lastApplicationAt"
  | "createdAt";

export function JobsTable({ jobs }: JobsTableProps) {
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [columnVisibility, setColumnVisibility] = useState({
    title: true,
    status: true,
    skills: true,
    applications: true,
    source: true,
    lastActivity: true,
    created: false,
  });

  // Sort jobs (jobs are already filtered by parent)
  const sortedJobs = useMemo(() => {
    const sorted = [...jobs];
    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case "title":
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case "status":
          aValue = a.status;
          bValue = b.status;
          break;
        case "source":
          aValue = a.source;
          bValue = b.source;
          break;
        case "applicationCount":
          aValue = a.applicationCount;
          bValue = b.applicationCount;
          break;
        case "lastApplicationAt":
          aValue = a.lastApplicationAt?.getTime() || 0;
          bValue = b.lastApplicationAt?.getTime() || 0;
          break;
        case "createdAt":
          aValue = a.createdAt.getTime();
          bValue = b.createdAt.getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [jobs, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const getStatusBadgeVariant = (status: JobStatus) => {
    switch (status) {
      case JobStatus.OPEN:
        return "default";
      case JobStatus.DRAFT:
        return "secondary";
      case JobStatus.ARCHIVED:
        return "outline";
      default:
        return "outline";
    }
  };

  const formatDate = (date: Date | null | undefined) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString();
  };

  const formatRelativeDate = (date: Date | null | undefined) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return formatDate(date);
  };

  return (
    <div className="space-y-4 min-w-0">
      {/* Table */}
      <div className="border rounded-lg max-w-full overflow-x-auto min-w-0">
        <Table className="min-w-[900px]">
          <TableHeader>
            <TableRow>
              {columnVisibility.title && (
                <TableHead className="min-w-[200px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("title")}
                  >
                    Title
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.status && (
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("status")}
                  >
                    Status
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.skills && (
                <TableHead className="min-w-[200px]">Skills</TableHead>
              )}
              {columnVisibility.applications && (
                <TableHead className="w-[140px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("applicationCount")}
                  >
                    Applications
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.source && (
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("source")}
                  >
                    Source
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.lastActivity && (
                <TableHead className="w-[140px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("lastApplicationAt")}
                  >
                    Last Activity
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.created && (
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              <TableHead className="w-[50px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8">
                      <Columns3Cog className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.title}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          title: checked,
                        }))
                      }
                    >
                      Title
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.status}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          status: checked,
                        }))
                      }
                    >
                      Status
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.skills}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          skills: checked,
                        }))
                      }
                    >
                      Skills
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.applications}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          applications: checked,
                        }))
                      }
                    >
                      Applications
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.source}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          source: checked,
                        }))
                      }
                    >
                      Source
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.lastActivity}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          lastActivity: checked,
                        }))
                      }
                    >
                      Last Activity
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.created}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          created: checked,
                        }))
                      }
                    >
                      Created
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedJobs.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    Object.values(columnVisibility).filter(Boolean).length + 1
                  }
                  className="text-center py-8 text-muted-foreground"
                >
                  No jobs found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              sortedJobs.map((job) => (
                <TableRow key={job.id} className="hover:bg-accent/50">
                  {columnVisibility.title && (
                    <TableCell>
                      <Link
                        href={`/app/jobs/${job.id}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {job.title}
                      </Link>
                      <div className="text-sm text-muted-foreground mt-1">
                        {job.externalJobId}
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.status && (
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(job.status as JobStatus)}
                      >
                        {job.status}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.skills && (
                    <TableCell>
                      {job.skills && job.skills.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                          {job.skills.slice(0, 3).map((skill) => (
                            <Badge
                              key={skill.id}
                              variant="outline"
                              className="text-xs gap-1"
                            >
                              <SkillIcon
                                name={skill.skillName}
                                iconSvg={skill.iconSvg}
                                className="h-3 w-3"
                              />
                              {skill.skillName}
                            </Badge>
                          ))}
                          {job.skills.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{job.skills.length - 3}
                            </Badge>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No skills
                        </span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.applications && (
                    <TableCell>
                      <Link
                        href={`/app/jobs/${job.id}#applications`}
                        className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                      >
                        <Users className="h-3.5 w-3.5" />
                        {job.applicationCount}
                      </Link>
                    </TableCell>
                  )}
                  {columnVisibility.source && (
                    <TableCell>
                      <JobSourceBadge source={job.source as JobSource} />
                    </TableCell>
                  )}
                  {columnVisibility.lastActivity && (
                    <TableCell className="text-sm text-muted-foreground">
                      {formatRelativeDate(job.lastApplicationAt)}
                    </TableCell>
                  )}
                  {columnVisibility.created && (
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(job.createdAt)}
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/app/jobs/${job.id}`}>
                            <Eye className="h-4 w-4 mr-2" />
                            Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <Archive className="h-4 w-4 mr-2" />
                          Archive
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
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
