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
import { CheckCircle2, XCircle, Clock, TrendingUp, Link2 } from "lucide-react";
import Link from "next/link";
import type { ApplicationHistoryItem } from "../../../_components/skill-insights";

interface JobAssociation {
  id: string;
  weight: string;
  source: string;
  jobSkill: {
    job: {
      id: string;
      title: string;
      externalJobId: string;
    } | null;
    skill: {
      skillName: string;
    } | null;
  } | null;
}

interface ChallengeInsightsProps {
  applicationHistory: ApplicationHistoryItem[];
  jobAssociations: JobAssociation[];
}

export function ChallengeInsights({
  applicationHistory,
  jobAssociations,
}: ChallengeInsightsProps) {
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

    return {
      totalAttempts,
      completedAttempts,
      passedAttempts,
      failedAttempts,
      averageScore: Math.round(averageScore),
      passRate: Math.round(passRate * 10) / 10,
    };
  }, [applicationHistory]);

  // Get unique jobs
  const uniqueJobs = useMemo(() => {
    const jobMap = new Map<string, { title: string; count: number }>();
    applicationHistory.forEach((h) => {
      if (h.verificationAttempt?.job) {
        const jobId = h.verificationAttempt.job.id;
        const existing = jobMap.get(jobId);
        if (existing) {
          existing.count++;
        } else {
          jobMap.set(jobId, {
            title: h.verificationAttempt.job.title,
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
              Job Associations
            </CardTitle>
            <Link2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobAssociations.length}</div>
            <p className="text-xs text-muted-foreground">
              Jobs using this question
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Attempts */}
      {applicationHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Attempts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Job</TableHead>
                    <TableHead>Result</TableHead>
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
                        {history.verificationAttempt?.job ? (
                          <Link
                            href={`/app/jobs/${history.verificationAttempt.job.id}`}
                            className="text-primary hover:underline"
                          >
                            {history.verificationAttempt.job.title}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
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
                          <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            Incomplete
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        {history.verificationAttempt?.score !== null
                          ? `${history.verificationAttempt?.score}%`
                          : "-"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(history.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {applicationHistory.length > 10 && (
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Showing 10 of {applicationHistory.length} attempts
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Job Associations */}
      {jobAssociations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Job Associations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Job</TableHead>
                    <TableHead>Skill</TableHead>
                    <TableHead>Weight</TableHead>
                    <TableHead>Source</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {jobAssociations.map((association) => (
                    <TableRow key={association.id}>
                      <TableCell className="font-medium">
                        {association.jobSkill?.job ? (
                          <Link
                            href={`/app/jobs/${association.jobSkill.job.id}`}
                            className="text-primary hover:underline"
                          >
                            {association.jobSkill.job.title}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {association.jobSkill?.skill?.skillName || "N/A"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            parseFloat(association.weight) === 0
                              ? "destructive"
                              : parseFloat(association.weight) >= 1.5
                                ? "default"
                                : "secondary"
                          }
                        >
                          {association.weight}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {association.source === "auto" ? "Auto" : "Manual"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {applicationHistory.length === 0 && jobAssociations.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <p className="text-center text-muted-foreground">
              No insights available yet. This question hasn&apos;t been used in
              any applications or job associations.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
