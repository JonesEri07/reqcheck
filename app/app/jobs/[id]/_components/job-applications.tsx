"use client";

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
import { format } from "date-fns";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

interface JobApplicationsProps {
  jobId: string;
  applications: Array<{
    id: string;
    email: string;
    score: number | null;
    passed: boolean | null;
    completedAt: Date | null;
    startedAt: Date;
  }>;
}

export function JobApplications({ jobId, applications }: JobApplicationsProps) {
  // Calculate insights
  const router = useRouter();
  const totalApplications = applications.length;
  const completedApplications = applications.filter(
    (app) => app.completedAt !== null
  ).length;
  const passedApplications = applications.filter(
    (app) => app.passed === true
  ).length;
  const averageScore =
    completedApplications > 0
      ? applications
          .filter((app) => app.score !== null)
          .reduce((sum, app) => sum + (app.score || 0), 0) /
        completedApplications
      : 0;

  return (
    <div className="space-y-6">
      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Applications</CardDescription>
            <CardTitle className="text-2xl">{totalApplications}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Completed</CardDescription>
            <CardTitle className="text-2xl">{completedApplications}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Passed</CardDescription>
            <CardTitle className="text-2xl">{passedApplications}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Average Score</CardDescription>
            <CardTitle className="text-2xl">
              {averageScore > 0 ? `${averageScore.toFixed(1)}%` : "N/A"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
          <CardDescription>
            All applications submitted for this job
          </CardDescription>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">
              No applications yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Score</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>
                    <span className="w-[50px]"></span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.map((application) => (
                  <TableRow
                    key={application.id}
                    className="cursor-pointer"
                    onClick={() => {
                      router.push(
                        `/app/applicants/${encodeURIComponent(application.email)}`
                      );
                    }}
                  >
                    <TableCell>
                      <Link
                        href={`/app/applicants/${encodeURIComponent(application.email)}`}
                        className="font-medium text-primary hover:underline"
                      >
                        {application.email}
                      </Link>
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
                    <TableCell>
                      {application.score !== null
                        ? `${application.score}%`
                        : "—"}
                    </TableCell>
                    <TableCell>
                      {application.startedAt
                        ? format(new Date(application.startedAt), "MMM d, yyyy")
                        : "—"}
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
                      <ChevronRight className="h-4 w-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
