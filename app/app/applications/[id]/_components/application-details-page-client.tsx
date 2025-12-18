"use client";

import { ContentHeader } from "@/components/content-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationDetails } from "./application-details";
import { ApplicationQuestionHistory } from "./application-question-history";
import { ApplicationInsights } from "./application-insights";
import type { JobStatus, JobSource } from "@/lib/db/schema";

interface ApplicationDetailsPageClientProps {
  application: {
    id: string;
    email: string;
    verified: boolean;
    score: number | null;
    passed: boolean | null;
    completedAt: Date | null;
    createdAt: Date;
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
    questionHistory: Array<{
      id: string;
      questionPreview: string | null;
      skillName: string;
      skillNormalized: string;
      questionData: any;
      skillData: any;
      answer: any;
      createdAt: Date;
      question: {
        id: string;
        type: string;
        prompt: string;
        config: any;
        imageUrl: string | null;
        imageAltText: string | null;
        timeLimitSeconds: number | null;
      } | null;
    }>;
  };
}

export function ApplicationDetailsPageClient({
  application,
}: ApplicationDetailsPageClientProps) {
  return (
    <>
      <ContentHeader
        title={`Application: ${application.email}`}
        subtitle={application.job?.title || "Unknown Job"}
        breadcrumbs={[
          { label: "Applications", href: "/app/applications" },
          { label: application.email },
        ]}
      />
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="questions">
            Questions ({application.questionHistory.length})
          </TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <ApplicationDetails application={application} />
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <ApplicationQuestionHistory
            questionHistory={application.questionHistory}
          />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <ApplicationInsights
            questionHistory={application.questionHistory}
            application={application}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
