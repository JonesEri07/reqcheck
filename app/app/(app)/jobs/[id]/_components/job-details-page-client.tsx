"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { ContentHeader } from "@/components/content-header";
import { JobDetailsTabs } from "./job-details-tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { JobSourceBadge } from "@/components/job-source-badge";
import { JobStatusBadge } from "@/components/job-status-badge";
import type { JobSource, JobStatus } from "@/lib/db/schema";

// Dynamically import JobMoreActionsMenu to avoid hydration mismatch
const JobMoreActionsMenu = dynamic(
  () =>
    import("./job-more-actions-menu").then((mod) => ({
      default: mod.JobMoreActionsMenu,
    })),
  { ssr: false }
);

interface JobDetailsPageClientProps {
  job: {
    id: string;
    externalJobId: string;
    title: string;
    description: string | null;
    passThreshold: number | null;
    questionCount: number | null;
    source: JobSource;
    status: JobStatus;
    jobSkills: Array<{
      jobSkill: {
        id: string;
        clientSkillId: string;
        weight: string;
        required: boolean;
        manuallyAdded: boolean;
      };
      clientSkill: {
        id: string;
        skillName: string;
      };
      questionWeights: Array<{
        clientChallengeQuestionId: string;
        weight: string;
        timeLimitSeconds: number | null;
      }>;
    }>;
  };
  applications: Array<{
    id: string;
    email: string;
    score: number | null;
    passed: boolean | null;
    completedAt: Date | null;
    startedAt: Date;
  }>;
  teamDefaults: {
    defaultPassThreshold: number;
    defaultQuestionCount: number;
    defaultQuestionTimeLimitSeconds: number;
  };
}

export function JobDetailsPageClient({
  job,
  applications,
  teamDefaults,
}: JobDetailsPageClientProps) {
  const [isDirty, setIsDirty] = useState(false);
  const [pending, setPending] = useState(false);
  // Local state to track job status for optimistic updates
  const [jobStatus, setJobStatus] = useState<JobStatus>(job.status);

  // Sync local status with prop when it changes (e.g., after router.refresh())
  useEffect(() => {
    setJobStatus(job.status);
  }, [job.status]);

  const handleSave = () => {
    const form = document.getElementById("job-form") as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  const handleCancel = () => {
    const form = document.getElementById("job-form");
    if (form) {
      form.dispatchEvent(
        new Event("cancel", { bubbles: true, cancelable: true })
      );
    }
  };

  const actions = isDirty
    ? [
        {
          label: "Save Changes",
          onClick: handleSave,
          disabled: pending,
        },
        {
          label: "Cancel",
          onClick: handleCancel,
          variant: "outline" as const,
          disabled: pending,
        },
        {
          component: (
            <JobMoreActionsMenu
              jobId={job.id}
              jobTitle={job.title}
              currentStatus={jobStatus}
            />
          ),
        },
      ]
    : [
        {
          component: (
            <JobMoreActionsMenu
              jobId={job.id}
              jobTitle={job.title}
              currentStatus={jobStatus}
            />
          ),
        },
      ];

  return (
    <>
      <ContentHeader
        title={job.title}
        subtitle={
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm text-muted-foreground">
              External ID: {job.externalJobId}
            </span>
            <JobSourceBadge source={job.source} />
            <JobStatusBadge status={jobStatus} />
          </div>
        }
        breadcrumbs={[
          { label: "Jobs", href: "/app/jobs" },
          { label: `Job: ${job.id}` },
        ]}
        actions={actions}
      />
      <JobDetailsTabs
        job={job}
        applications={applications}
        teamDefaults={teamDefaults}
        onDirtyChange={setIsDirty}
        onPendingChange={setPending}
      />
    </>
  );
}
