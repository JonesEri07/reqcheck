"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Users,
  Calendar,
  MoreHorizontal,
  Eye,
  Edit,
  Archive,
  Trash2,
  Briefcase,
} from "lucide-react";
import { JobStatus, JobSource } from "@/lib/db/schema";
import { SkillIcon } from "@/components/skill-icon";
import { JobSourceBadge } from "@/components/job-source-badge";
import type { JobWithCounts } from "@/lib/jobs/queries";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface JobsCardViewProps {
  jobs: JobWithCounts[];
}

export function JobsCardView({ jobs }: JobsCardViewProps) {
  // Jobs are already filtered by parent component

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

  const formatRelativeDate = (date: Date | null | undefined) => {
    if (!date) return "Never";
    const now = new Date();
    const diff = now.getTime() - new Date(date).getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      {jobs.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              No jobs found matching your filters.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map((job) => (
            <Card
              key={job.id}
              className="hover:shadow-md transition-shadow relative group"
            >
              <CardHeader className="pb-3">
                {/* External Job ID */}
                <div className="text-xs text-muted-foreground absolute top-1 left-6 items-center">
                  <Briefcase className="h-2.5 w-2.5 inline mr-1.5" />
                  {job.externalJobId}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base line-clamp-2 mb-2">
                      <Link
                        href={`/app/jobs/${job.id}`}
                        className="hover:text-primary transition-colors"
                      >
                        {job.title}
                      </Link>
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant={getStatusBadgeVariant(job.status as JobStatus)}
                      >
                        {job.status}
                      </Badge>
                      <JobSourceBadge source={job.source as JobSource} />
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
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
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Skills */}
                {job.skills && job.skills.length > 0 ? (
                  <div>
                    <div className="text-xs font-medium text-muted-foreground mb-1.5">
                      Skills ({job.skills.length})
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 4).map((skill) => (
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
                      {job.skills.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{job.skills.length - 4}
                        </Badge>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    No skills assigned
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center gap-4 pt-2 border-t">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={`/app/jobs/${job.id}#applications`}
                          className="flex items-center gap-1.5 text-sm hover:text-primary transition-colors"
                        >
                          <Users className="h-4 w-4" />
                          <span className="font-medium">
                            {job.applicationCount}
                          </span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Applications for this job</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Last Activity */}
                {job.lastApplicationAt && (
                  <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5" />
                    Last activity: {formatRelativeDate(job.lastApplicationAt)}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
