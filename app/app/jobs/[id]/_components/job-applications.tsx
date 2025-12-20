"use client";

import { useState, useMemo, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import Link from "next/link";
import {
  ChevronRight,
  Search,
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

type ApplicationStatus = "all" | "in-progress" | "passed" | "failed";

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
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Filter applications
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        if (!app.email.toLowerCase().includes(searchLower)) {
          return false;
        }
      }

      // Status filter
      if (statusFilter !== "all") {
        if (statusFilter === "in-progress" && app.completedAt !== null) {
          return false;
        }
        if (statusFilter === "passed" && app.passed !== true) {
          return false;
        }
        if (statusFilter === "failed" && app.passed !== false) {
          return false;
        }
      }

      return true;
    });
  }, [applications, search, statusFilter]);

  // Paginate filtered applications
  const paginatedApplications = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return filteredApplications.slice(start, end);
  }, [filteredApplications, page, pageSize]);

  const totalPages = Math.ceil(filteredApplications.length / pageSize);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter]);

  // Calculate insights from all applications (not filtered)
  const totalApplications = applications.length;
  const failedApplications = applications.filter(
    (app) => app.passed === false
  ).length;
  const passedApplications = applications.filter(
    (app) => app.passed === true
  ).length;
  const averageScore =
    totalApplications > 0
      ? applications
          .filter((app) => app.score !== null)
          .reduce((sum, app) => sum + (app.score || 0), 0) / totalApplications
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
            <CardDescription>Failed</CardDescription>
            <CardTitle className="text-2xl">{failedApplications}</CardTitle>
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
            <div className="space-y-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value) =>
                    setStatusFilter(value as ApplicationStatus)
                  }
                >
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="passed">Passed</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={pageSize.toString()}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-full sm:w-[120px]">
                    <SelectValue placeholder="Page size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 per page</SelectItem>
                    <SelectItem value="25">25 per page</SelectItem>
                    <SelectItem value="50">50 per page</SelectItem>
                    <SelectItem value="100">100 per page</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Results count */}
              {filteredApplications.length !== applications.length && (
                <div className="text-sm text-muted-foreground">
                  Showing {filteredApplications.length} of {applications.length}{" "}
                  application{applications.length !== 1 ? "s" : ""}
                </div>
              )}

              {/* Table */}
              {filteredApplications.length === 0 ? (
                <p className="text-sm text-muted-foreground py-8 text-center">
                  No applications match your filters.
                </p>
              ) : (
                <>
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
                      {paginatedApplications.map((application) => (
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
                              onClick={(e) => {
                                // Prevent row click (router.push) when clicking the link
                                e.stopPropagation();
                              }}
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
                              ? format(
                                  new Date(application.startedAt),
                                  "MMM d, yyyy"
                                )
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

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-sm text-muted-foreground">
                        Page {page} of {totalPages}
                        <span className="hidden md:inline ml-2">
                          • {filteredApplications.length} application
                          {filteredApplications.length !== 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(1)}
                          disabled={page === 1}
                          className="hidden md:flex"
                        >
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            setPage((p) => Math.min(totalPages, p + 1))
                          }
                          disabled={page === totalPages}
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setPage(totalPages)}
                          disabled={page === totalPages}
                          className="hidden md:flex"
                        >
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
