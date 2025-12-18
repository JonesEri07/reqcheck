"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Mail, Briefcase, TrendingUp, TrendingDown } from "lucide-react";
import { format } from "date-fns";
import { useMemo } from "react";

interface ApplicantDetailsProps {
  email: string;
  applications: Array<{
    id: string;
    email: string;
    verified: boolean;
    score: number | null;
    passed: boolean | null;
    completedAt: Date | null;
    createdAt: Date;
    job: {
      id: string;
      title: string;
      externalJobId: string;
      status: string;
    } | null;
  }>;
}

export function ApplicantDetails({
  email,
  applications,
}: ApplicantDetailsProps) {
  // Calculate statistics
  const stats = useMemo(() => {
    const total = applications.length;
    const completed = applications.filter(
      (app) => app.completedAt !== null
    ).length;
    const passed = applications.filter((app) => app.passed === true).length;
    const failed = applications.filter((app) => app.passed === false).length;
    const pending = applications.filter(
      (app) => app.completedAt === null
    ).length;

    const passRate =
      completed > 0 ? Math.round((passed / completed) * 100 * 10) / 10 : 0;

    const averageScore =
      applications
        .filter((app) => app.score !== null)
        .reduce((sum, app) => sum + (app.score || 0), 0) /
      (applications.filter((app) => app.score !== null).length || 1);

    // Get unique jobs
    const uniqueJobs = new Set(
      applications
        .map((app) => app.job?.id)
        .filter((id): id is string => id !== undefined && id !== null)
    ).size;

    return {
      total,
      completed,
      passed,
      failed,
      pending,
      passRate,
      averageScore: Math.round(averageScore),
      uniqueJobs,
    };
  }, [applications]);

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Applications
            </CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <CardDescription className="mt-1">
              Across {stats.uniqueJobs} job{stats.uniqueJobs !== 1 ? "s" : ""}
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Pass Rate</CardTitle>
            {stats.passRate >= 50 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.passRate}%</div>
            <CardDescription className="mt-1">
              {stats.passed} passed, {stats.failed} failed
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.averageScore > 0 ? `${stats.averageScore}%` : "—"}
            </div>
            <CardDescription className="mt-1">
              {stats.completed > 0
                ? `Based on ${stats.completed} completed`
                : "No completed applications"}
            </CardDescription>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Mail className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <CardDescription className="mt-1">
              {stats.pending === 1 ? "Pending" : "Pending applications"}
            </CardDescription>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Applications</CardTitle>
          <CardDescription>
            Complete history of applications submitted by this candidate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Job</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8">
                      <p className="text-sm text-muted-foreground">
                        No applications found.
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  applications.map((application) => (
                    <TableRow key={application.id}>
                      <TableCell>
                        {application.job ? (
                          <Link
                            href={`/app/jobs/${application.job.id}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {application.job.title}
                          </Link>
                        ) : (
                          <span className="text-muted-foreground">
                            Unknown Job
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        {application.completedAt === null ? (
                          <Badge variant="secondary">In Progress</Badge>
                        ) : application.passed === true ? (
                          <Badge className="bg-green-500">Passed</Badge>
                        ) : application.passed === false ? (
                          <Badge variant="destructive">Failed</Badge>
                        ) : (
                          <Badge variant="outline">Completed</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {application.score !== null
                          ? `${application.score}%`
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {format(new Date(application.createdAt), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        {application.completedAt
                          ? format(
                              new Date(application.completedAt),
                              "MMM d, yyyy"
                            )
                          : "—"}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" asChild>
                          <Link href={`/app/applications/${application.id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
