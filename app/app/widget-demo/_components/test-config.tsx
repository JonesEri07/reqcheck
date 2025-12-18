"use client";

import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TestConfigProps {
  companyId: string;
  selectedJobId: string;
  onJobChange: (jobId: string) => void;
}

export function TestConfig({
  companyId,
  selectedJobId,
  onJobChange,
}: TestConfigProps) {
  const { data: jobsData } = useSWR<any[]>("/api/jobs", fetcher);

  // Get first job as default
  useEffect(() => {
    if (jobsData && jobsData.length > 0 && !selectedJobId) {
      onJobChange(jobsData[0].externalJobId || "");
    }
  }, [jobsData, selectedJobId, onJobChange]);

  return (
    <div className="mb-6 p-4 bg-muted/50 rounded-lg border border-dashed">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <Label className="text-xs text-muted-foreground mb-1 block">
            Test Configuration
          </Label>
          <Select value={selectedJobId} onValueChange={onJobChange}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="Select a job" />
            </SelectTrigger>
            <SelectContent>
              {jobsData?.map((job) => (
                <SelectItem key={job.id} value={job.externalJobId || job.id}>
                  {job.title} ({job.externalJobId || job.id})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="text-xs text-muted-foreground">
          Company ID:{" "}
          <code className="bg-background px-1.5 py-0.5 rounded">
            {companyId}
          </code>
        </div>
      </div>
    </div>
  );
}
