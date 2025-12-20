"use client";

import { useState, useMemo, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Search,
  Filter,
  Clock,
  FileQuestion,
  Tag as TagIcon,
  Plus,
  ChevronRight,
  AlertCircle,
  Columns3Cog,
} from "lucide-react";
import type { QuestionWithTags } from "@/lib/skills/queries";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import type { TeamDataWithMembers } from "@/lib/db/schema";
import {
  getQuestionLimit,
  hasReachedQuestionLimit,
  getRemainingQuestionSlots,
} from "@/lib/constants/tier-limits";
import { PlanName } from "@/lib/db/schema";
import { Card, CardContent } from "@/components/ui/card";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface ChallengeQuestionsTableProps {
  questions: QuestionWithTags[];
  skillId: string;
}

type QuestionType = "multiple_choice" | "fill_blank_blocks";

export function ChallengeQuestionsTable({
  questions,
  skillId,
}: ChallengeQuestionsTableProps) {
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<QuestionType | "all">("all");
  const [hasTimeLimitFilter, setHasTimeLimitFilter] = useState<
    "all" | "yes" | "no"
  >("all");
  const [tagFilter, setTagFilter] = useState<string | "all">("all");
  const [sortField, setSortField] = useState<
    "type" | "prompt" | "timeLimit" | "createdAt"
  >("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [columnVisibility, setColumnVisibility] = useState({
    type: true,
    prompt: true,
    timeLimit: true,
    tags: true,
    createdAt: false,
  });

  const router = useRouter();

  // Fetch team data to get tier information
  const { data: teamData } = useSWR<TeamDataWithMembers>("/api/team", fetcher);
  const planName = (teamData?.planName as PlanName) || PlanName.BASIC;
  const questionLimit = getQuestionLimit(planName);
  const currentQuestionCount = questions.length;
  const isLimitReached = hasReachedQuestionLimit(
    currentQuestionCount,
    planName
  );
  const remainingSlots = getRemainingQuestionSlots(
    currentQuestionCount,
    planName
  );

  // Only render after mount to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Get unique tags and types for filters
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    questions.forEach((q) => {
      q.tags?.forEach((tag) => tagSet.add(tag.id));
    });
    return Array.from(tagSet)
      .map((tagId) => {
        const tag = questions
          .flatMap((q) => q.tags || [])
          .find((t) => t.id === tagId);
        return tag;
      })
      .filter((tag): tag is NonNullable<typeof tag> => tag !== undefined);
  }, [questions]);

  const allTypes = useMemo(() => {
    const types = new Set<QuestionType>();
    questions.forEach((q) => {
      if (q.type) types.add(q.type as QuestionType);
    });
    return Array.from(types);
  }, [questions]);

  // Filter and sort questions
  const filteredAndSortedQuestions = useMemo(() => {
    let filtered = questions.filter((q) => {
      // Search filter
      if (search) {
        const searchLower = search.toLowerCase();
        const matchesPrompt = q.prompt?.toLowerCase().includes(searchLower);
        const matchesType = q.type?.toLowerCase().includes(searchLower);
        if (!matchesPrompt && !matchesType) return false;
      }

      // Type filter
      if (typeFilter !== "all" && q.type !== typeFilter) return false;

      // Time limit filter
      if (hasTimeLimitFilter === "yes" && !q.timeLimitSeconds) return false;
      if (hasTimeLimitFilter === "no" && q.timeLimitSeconds) return false;

      // Tag filter
      if (tagFilter !== "all") {
        const hasTag = q.tags?.some((tag) => tag.id === tagFilter);
        if (!hasTag) return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      let aVal: any;
      let bVal: any;

      switch (sortField) {
        case "type":
          aVal = a.type || "";
          bVal = b.type || "";
          break;
        case "prompt":
          aVal = a.prompt || "";
          bVal = b.prompt || "";
          break;
        case "timeLimit":
          aVal = a.timeLimitSeconds ?? 0;
          bVal = b.timeLimitSeconds ?? 0;
          break;
        case "createdAt":
          aVal = a.createdAt?.getTime() || 0;
          bVal = b.createdAt?.getTime() || 0;
          break;
      }

      if (typeof aVal === "string" && typeof bVal === "string") {
        return sortDirection === "asc"
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal);
      }

      return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
    });

    return filtered;
  }, [
    questions,
    search,
    typeFilter,
    hasTimeLimitFilter,
    tagFilter,
    sortField,
    sortDirection,
  ]);

  const handleSort = (field: typeof sortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getTypeLabel = (type: string | null) => {
    if (!type) return "Unknown";
    return type === "multiple_choice"
      ? "Multiple Choice"
      : type === "fill_blank_blocks"
        ? "Fill in the Blank"
        : type;
  };

  const getTypeBadgeVariant = (type: string | null) => {
    if (type === "multiple_choice") return "default";
    if (type === "fill_blank_blocks") return "secondary";
    return "outline";
  };

  // Prevent hydration mismatch by not rendering Select components until mounted
  if (!mounted) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="h-10 w-full border rounded-md bg-muted animate-pulse" />
          </div>
          <div className="h-10 w-[180px] border rounded-md bg-muted animate-pulse" />
          <div className="h-10 w-[180px] border rounded-md bg-muted animate-pulse" />
        </div>
        <div className="border rounded-lg">
          <div className="h-64 bg-muted animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search bar - full width on all screens */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by prompt or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Filters - responsive grid layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          <Select
            value={typeFilter}
            onValueChange={(v) => setTypeFilter(v as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              {allTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {getTypeLabel(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={hasTimeLimitFilter}
            onValueChange={(v) => setHasTimeLimitFilter(v as any)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Time limit" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Questions</SelectItem>
              <SelectItem value="yes">Has Time Limit</SelectItem>
              <SelectItem value="no">No Time Limit</SelectItem>
            </SelectContent>
          </Select>
          {allTags.length > 0 && (
            <Select value={tagFilter} onValueChange={(v) => setTagFilter(v)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by tag" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tags</SelectItem>
                {allTags.map((tag) => (
                  <SelectItem key={tag.id} value={tag.id}>
                    {tag.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>
      <div className="flex gap-2"></div>

      {/* Question limit indicator */}
      {isLimitReached && (
        <Card className="border-amber-500 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100 mb-1">
                  Question Limit Reached
                </p>
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  You've reached the maximum of {questionLimit} questions for
                  your {planName} plan.{" "}
                  <Link
                    href="/app/team/subscription"
                    className="font-medium underline hover:no-underline"
                  >
                    Upgrade to Pro
                  </Link>{" "}
                  to create up to 50 questions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredAndSortedQuestions.length} of {questions.length}{" "}
        question{questions.length !== 1 ? "s" : ""}
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {columnVisibility.type && (
                <TableHead className="w-[150px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("type")}
                  >
                    Type
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.prompt && (
                <TableHead>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("prompt")}
                  >
                    Prompt
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.timeLimit && (
                <TableHead className="w-[120px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("timeLimit")}
                  >
                    Time Limit
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              {columnVisibility.tags && (
                <TableHead className="w-[200px]">Tags</TableHead>
              )}
              {columnVisibility.createdAt && (
                <TableHead className="w-[150px]">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 -ml-3 gap-2"
                    onClick={() => handleSort("createdAt")}
                  >
                    Created
                    <ArrowUpDown className="h-3 w-3" />
                  </Button>
                </TableHead>
              )}
              <TableHead className="w-[50px]">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="secondary" size="icon" className="h-8 w-8">
                      <Columns3Cog className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-[200px]">
                    <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.type}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          type: checked,
                        }))
                      }
                    >
                      Type
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.prompt}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          prompt: checked,
                        }))
                      }
                    >
                      Prompt
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.timeLimit}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          timeLimit: checked,
                        }))
                      }
                    >
                      Time Limit
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.tags}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          tags: checked,
                        }))
                      }
                    >
                      Tags
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={columnVisibility.createdAt}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          createdAt: checked,
                        }))
                      }
                    >
                      Created At
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedQuestions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    Object.values(columnVisibility).filter(Boolean).length + 1
                  }
                  className="text-center py-8 text-muted-foreground"
                >
                  No questions found matching your filters.
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedQuestions.map((question) => (
                <TableRow
                  key={question.id}
                  onClick={() =>
                    router.push(
                      `/app/skills/${skillId}/challenges/${question.id}`
                    )
                  }
                  className="cursor-pointer hover:bg-muted"
                >
                  {columnVisibility.type && (
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(question.type)}>
                        {getTypeLabel(question.type)}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.prompt && (
                    <TableCell className="">
                      <p className="text-sm font-medium line-clamp-2">
                        {question.prompt || "No prompt"}
                      </p>
                    </TableCell>
                  )}
                  {columnVisibility.timeLimit && (
                    <TableCell>
                      {question.timeLimitSeconds ? (
                        <div className="flex items-center gap-1.5 text-sm">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                          <span>{question.timeLimitSeconds}s</span>
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No limit
                        </span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.tags && (
                    <TableCell>
                      {question.tags && question.tags.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {question.tags.map((tag) => (
                            <Badge
                              key={tag.id}
                              variant="outline"
                              className="text-xs"
                            >
                              <TagIcon className="h-2.5 w-2.5 mr-1" />
                              {tag.name}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">
                          No tags
                        </span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.createdAt && (
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {question.createdAt
                          ? new Date(question.createdAt).toLocaleDateString()
                          : "—"}
                      </span>
                    </TableCell>
                  )}
                  <TableCell>
                    <ChevronRight className="h-4 w-4" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
