"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Link2 } from "lucide-react";
import Link from "next/link";

interface JobAssociation {
  id: string;
  weight: string;
  source: string;
  job: {
    id: string;
    title: string;
    externalJobId: string;
  } | null;
}

interface SkillJobsListProps {
  jobAssociations: JobAssociation[];
}

export function SkillJobsList({ jobAssociations }: SkillJobsListProps) {
  if (jobAssociations.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-sm font-medium mb-1">No jobs connected</p>
          <p className="text-sm text-muted-foreground text-center">
            This skill is not currently associated with any jobs. Add it to a
            job to start using it in your hiring process.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Link2 className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Connected Jobs</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {jobAssociations.map((association) => (
            <div
              key={association.id}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Briefcase className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {association.job?.title || "Unknown Job"}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant={
                        association.source === "manual"
                          ? "secondary"
                          : "outline"
                      }
                      className="text-xs"
                    >
                      {association.source === "manual"
                        ? "Manually added"
                        : "Auto-detected"}
                    </Badge>
                    {association.weight && (
                      <span className="text-xs text-muted-foreground">
                        Weight: {association.weight}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {association.job && (
                <Link
                  href={`/app/jobs/${association.job.id}`}
                  className="text-sm text-primary hover:underline flex-shrink-0 ml-4"
                >
                  View Job →
                </Link>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
