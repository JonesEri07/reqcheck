"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JobForm } from "@/app/app/jobs/create/_components/job-form";
import { JobApplications } from "./job-applications";
import type { JobSource, JobStatus } from "@/lib/db/schema";

interface JobDetailsTabsProps {
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
  onDirtyChange?: (isDirty: boolean) => void;
  onPendingChange?: (pending: boolean) => void;
}

export function JobDetailsTabs({
  job,
  applications,
  teamDefaults,
  onDirtyChange,
  onPendingChange,
}: JobDetailsTabsProps) {
  const [activeTab, setActiveTab] = useState("details");

  useEffect(() => {
    // Check if URL hash is #applications on mount
    if (window.location.hash === "#applications") {
      setActiveTab("applications");
    }

    // Listen for hash changes
    const handleHashChange = () => {
      if (window.location.hash === "#applications") {
        setActiveTab("applications");
      } else if (window.location.hash === "#details" || !window.location.hash) {
        setActiveTab("details");
      }
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
      <TabsList>
        <TabsTrigger value="details">Details</TabsTrigger>
        <TabsTrigger value="applications">
          Applications ({applications.length})
        </TabsTrigger>
      </TabsList>

      <TabsContent value="details" className="space-y-6">
        <JobForm
          teamDefaults={teamDefaults}
          initialData={job}
          mode="edit"
          onDirtyChange={onDirtyChange}
          onPendingChange={onPendingChange}
        />
      </TabsContent>

      <TabsContent value="applications" className="space-y-6">
        <JobApplications jobId={job.id} applications={applications} />
      </TabsContent>
    </Tabs>
  );
}
