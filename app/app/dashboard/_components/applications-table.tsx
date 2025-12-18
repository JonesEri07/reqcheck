"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  MoreHorizontal,
  Eye,
} from "lucide-react";

export interface Application {
  id: string;
  email: string;
  name?: string | null;
  jobTitle: string;
  score: number | null;
  passed: boolean | null;
  completedAt: string | null;
}

interface ApplicationsTableProps {
  data: Application[];
}

const formatRelativeTime = (dateString: string | null): string => {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600)
    return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400)
    return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  return date.toLocaleDateString();
};

export function ApplicationsTable({ data }: ApplicationsTableProps) {
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [visibleColumns, setVisibleColumns] = useState({
    candidate: true,
    job: true,
    score: true,
    status: true,
    completed: true,
    actions: true,
  });

  const columns = [
    { key: "candidate", label: "Candidate" },
    { key: "job", label: "Job" },
    { key: "score", label: "Score" },
    { key: "status", label: "Status" },
    { key: "completed", label: "Completed" },
    { key: "actions", label: "Actions" },
  ];

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end);
  }, [data, page, pageSize]);

  const totalPages = Math.ceil(data.length / pageSize);

  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>
            Latest verification attempts and results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            No applications yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Recent Applications</CardTitle>
            <CardDescription>
              Latest verification attempts and results
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  Columns
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {columns.map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.key}
                    checked={
                      visibleColumns[column.key as keyof typeof visibleColumns]
                    }
                    onCheckedChange={(checked) =>
                      setVisibleColumns((prev) => ({
                        ...prev,
                        [column.key]: checked,
                      }))
                    }
                  >
                    {column.label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button asChild variant="outline" size="sm">
              <Link href="/app/applications">View All</Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              {visibleColumns.candidate && <TableHead>Candidate</TableHead>}
              {visibleColumns.job && <TableHead>Job</TableHead>}
              {visibleColumns.score && (
                <TableHead className="text-right">Score</TableHead>
              )}
              {visibleColumns.status && <TableHead>Status</TableHead>}
              {visibleColumns.completed && <TableHead>Completed</TableHead>}
              {visibleColumns.actions && (
                <TableHead className="w-[50px]"></TableHead>
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((application) => (
              <TableRow key={application.id}>
                {visibleColumns.candidate && (
                  <TableCell>
                    <div>
                      {application.name ? (
                        <>
                      <div className="font-medium text-foreground">
                            {application.name}
                      </div>
                          <Link
                            href={`/app/applicants/${encodeURIComponent(application.email)}`}
                            className="text-sm text-primary hover:underline"
                          >
                            {application.email}
                          </Link>
                        </>
                      ) : (
                        <Link
                          href={`/app/applicants/${encodeURIComponent(application.email)}`}
                          className="font-medium text-primary hover:underline"
                        >
                          {application.email}
                        </Link>
                      )}
                    </div>
                  </TableCell>
                )}
                {visibleColumns.job && (
                  <TableCell className="text-foreground">
                    {application.jobTitle}
                  </TableCell>
                )}
                {visibleColumns.score && (
                  <TableCell className="text-right">
                    {application.score !== null ? `${application.score}%` : "—"}
                  </TableCell>
                )}
                {visibleColumns.status && (
                  <TableCell>
                    <Badge
                      variant={
                        application.passed === true ? "default" : "destructive"
                      }
                    >
                      {application.passed === true ? "Passed" : "Failed"}
                    </Badge>
                  </TableCell>
                )}
                {visibleColumns.completed && (
                  <TableCell className="text-muted-foreground">
                    {formatRelativeTime(application.completedAt)}
                  </TableCell>
                )}
                {visibleColumns.actions && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/app/applications/${application.id}`}
                            className="flex items-center gap-2"
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
            <span className="hidden md:inline ml-2">
              • {data.length} application{data.length !== 1 ? "s" : ""} total
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
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
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
      </CardContent>
    </Card>
  );
}
