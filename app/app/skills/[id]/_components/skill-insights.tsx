"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  XCircle,
  Clock,
  TrendingUp,
  FileQuestion,
  Briefcase,
  Link2,
} from "lucide-react";
import Link from "next/link";

export interface ApplicationHistoryItem {
  id: string;
  questionPreview: string | null;
  skillName: string;
  answer: any;
  createdAt: Date;
  verificationAttempt: {
    id: string;
    email: string;
    score: number | null;
    passed: boolean | null;
    completedAt: Date | null;
    job: {
      id: string;
      title: string;
      externalJobId: string;
    } | null;
  } | null;
  question: {
    id: string;
  } | null;
}

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

interface SkillInsightsProps {
  applicationHistory: ApplicationHistoryItem[];
  jobAssociations: JobAssociation[];
  questionCount: number;
}

export function SkillInsights({
  applicationHistory,
  jobAssociations,
  questionCount,
}: SkillInsightsProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const totalAttempts = applicationHistory.length;
    const completedAttempts = applicationHistory.filter(
      (h) => h.verificationAttempt?.completedAt !== null
    ).length;
    const passedAttempts = applicationHistory.filter(
      (h) => h.verificationAttempt?.passed === true
    ).length;
    const failedAttempts = applicationHistory.filter(
      (h) => h.verificationAttempt?.passed === false
    ).length;

    const averageScore =
      applicationHistory
        .filter((h) => h.verificationAttempt?.score !== null)
        .reduce((sum, h) => sum + (h.verificationAttempt?.score || 0), 0) /
      (completedAttempts || 1);

    const passRate =
      completedAttempts > 0 ? (passedAttempts / completedAttempts) * 100 : 0;

    // Get unique questions attempted
    const uniqueQuestions = new Set(
      applicationHistory
        .map((h) => h.question?.id)
        .filter((id): id is string => id !== null && id !== undefined)
    ).size;

    return {
      totalAttempts,
      completedAttempts,
      passedAttempts,
      failedAttempts,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate * 10) / 10,
      uniqueQuestions,
    };
  }, [applicationHistory]);

  // Get unique jobs
  const uniqueJobs = useMemo(() => {
    const jobMap = new Map<string, { title: string; count: number }>();
    applicationHistory.forEach((h) => {
      const attempt = h.verificationAttempt;
      if (attempt?.job) {
        const jobId = attempt.job.id;
        const existing = jobMap.get(jobId);
        if (existing) {
          existing.count++;
        } else {
          jobMap.set(jobId, {
            title: attempt.job.title,
            count: 1,
          });
        }
      }
    });
    return Array.from(jobMap.entries()).map(([id, data]) => ({
      id,
      ...data,
    }));
  }, [applicationHistory]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Attempts
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttempts}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedAttempts} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.passRate}%</div>
            <p className="text-xs text-muted-foreground">
              {stats.passedAttempts} passed, {stats.failedAttempts} failed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageScore}%</div>
            <p className="text-xs text-muted-foreground">
              Based on {stats.completedAttempts} completed attempts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Questions Used
            </CardTitle>
            <FileQuestion className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.uniqueQuestions}</div>
            <p className="text-xs text-muted-foreground">
              of {questionCount} total questions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Job Associations */}
      {jobAssociations.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Job Associations</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {jobAssociations.map((association) => (
                <div
                  key={association.id}
                  className="flex items-center justify-between p-3 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {association.job?.title || "Unknown Job"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {association.source === "manual"
                          ? "Manually added"
                          : "Auto-detected"}
                      </p>
                    </div>
                  </div>
                  {association.job && (
                    <Link
                      href={`/app/jobs/${association.job.id}`}
                      className="text-sm text-primary hover:underline"
                    >
                      View Job
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Activity */}
      {applicationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Question</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applicationHistory.slice(0, 10).map((history) => (
                    <TableRow key={history.id}>
                      <TableCell className="font-medium">
                        {history.verificationAttempt?.email || "Unknown"}
                      </TableCell>
                      <TableCell>
                        {history.questionPreview ? (
                          <span className="text-sm">
                            {history.questionPreview.length > 50
                              ? `${history.questionPreview.substring(0, 50)}...`
                              : history.questionPreview}
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Question deleted
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {history.verificationAttempt?.job ? (
                          <Link
                            href={`/app/jobs/${history.verificationAttempt.job.id}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {history.verificationAttempt.job.title}
                          </Link>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            Unknown
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {history.verificationAttempt?.completedAt ? (
                          history.verificationAttempt.passed ? (
                            <Badge variant="default" className="gap-1">
                              <CheckCircle2 className="h-3 w-3" />
                              Passed
                            </Badge>
                          ) : (
                            <Badge variant="destructive" className="gap-1">
                              <XCircle className="h-3 w-3" />
                              Failed
                            </Badge>
                          )
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <Clock className="h-3 w-3" />
                            In Progress
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {history.verificationAttempt?.score !== null ? (
                          <span className="text-sm">
                            {history?.verificationAttempt?.score}%
                          </span>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            -
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {new Date(history.createdAt).toLocaleDateString()}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {applicationHistory.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm font-medium mb-1">No activity yet</p>
            <p className="text-sm text-muted-foreground text-center">
              Once applicants start taking challenges for this skill, insights
              will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
