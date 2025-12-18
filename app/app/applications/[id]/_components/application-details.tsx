"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import Link from "next/link";
import { JobStatusBadge } from "@/components/job-status-badge";
import { JobSourceBadge } from "@/components/job-source-badge";
import { JobStatus, JobSource } from "@/lib/db/schema";

interface ApplicationDetailsProps {
  application: {
    id: string;
    email: string;
    verified: boolean;
    score: number | null;
    passed: boolean | null;
    completedAt: Date | null;
    startedAt: Date;
    referralSource: string | null;
    deviceType: string | null;
    job: {
      id: string;
      title: string;
      externalJobId: string;
      status: JobStatus;
      source: JobSource;
      passThreshold: number | null;
      questionCount: number | null;
    } | null;
  };
}

export function ApplicationDetails({ application }: ApplicationDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Application Info */}
      <Card>
        <CardHeader>
          <CardTitle>Application Information</CardTitle>
          <CardDescription>Details about this application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Candidate Email
              </label>
              <p className="text-sm font-medium">{application.email}</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Status
              </label>
              <div>
                {application.completedAt === null ? (
                  <Badge variant="secondary">In Progress</Badge>
                ) : application.passed === true ? (
                  <Badge className="bg-green-500">Passed</Badge>
                ) : application.passed === false ? (
                  <Badge variant="destructive">Failed</Badge>
                ) : (
                  <Badge variant="outline">Completed</Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Score
              </label>
              <p className="text-sm">
                {application.score !== null ? `${application.score}%` : "—"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Verified
              </label>
              <div>
                {application.verified ? (
                  <Badge variant="default">Verified</Badge>
                ) : (
                  <Badge variant="secondary">Not Verified</Badge>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Submitted
              </label>
              <p className="text-sm">
                {application.startedAt
                  ? format(
                      new Date(application.startedAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )
                  : "—"}
              </p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">
                Completed
              </label>
              <p className="text-sm">
                {application.completedAt
                  ? format(
                      new Date(application.completedAt),
                      "MMM d, yyyy 'at' h:mm a"
                    )
                  : "—"}
              </p>
            </div>
            {application.referralSource && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Referral Source
                </label>
                <p className="text-sm">{application.referralSource}</p>
              </div>
            )}
            {application.deviceType && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Device Type
                </label>
                <p className="text-sm capitalize">{application.deviceType}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Job Information */}
      {application.job && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle>Job Information</CardTitle>
                <CardDescription>
                  The job this application was submitted for
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <JobSourceBadge source={application.job.source} />
                <JobStatusBadge status={application.job.status} />
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  Job Title
                </label>
                <Link
                  href={`/app/jobs/${application.job.id}`}
                  className="text-sm font-medium text-primary hover:underline block"
                >
                  {application.job.title}
                </Link>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">
                  External Job ID
                </label>
                <p className="text-sm">{application.job.externalJobId}</p>
              </div>
              {application.job.passThreshold !== null && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Pass Threshold
                  </label>
                  <p className="text-sm">{application.job.passThreshold}%</p>
                </div>
              )}
              {application.job.questionCount !== null && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">
                    Question Count
                  </label>
                  <p className="text-sm">{application.job.questionCount}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
