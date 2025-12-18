"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Briefcase,
  Mail,
  Code,
  FileQuestion,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { globalSearch, type GlobalSearchResult } from "../actions";

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<GlobalSearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const performSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await globalSearch(query);
      if ("error" in searchResults) {
        setResults(null);
      } else {
        setResults(searchResults);
      }
    } catch (error) {
      console.error("Search error:", error);
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Set new timer
      debounceTimerRef.current = setTimeout(() => {
        performSearch(value);
      }, 300);
    },
    [performSearch]
  );

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const hasResults =
    results &&
    (results.jobs.length > 0 ||
      results.applications.length > 0 ||
      results.skills.length > 0 ||
      results.questions.length > 0);

  const totalResults =
    results &&
    results.jobs.length +
      results.applications.length +
      results.skills.length +
      results.questions.length;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Search className="h-4 w-4" />
          <span className="hidden md:inline">Search...</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] p-0" align="start">
        <Command shouldFilter={false}>
          <CommandInput
            placeholder="Search jobs, applications, skills, questions..."
            value={searchQuery}
            onValueChange={handleSearchChange}
          />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}

            {!isLoading && !searchQuery && (
              <CommandEmpty>
                <div className="py-6 text-center text-sm text-muted-foreground">
                  Start typing to search across jobs, applications, skills, and
                  questions
                </div>
              </CommandEmpty>
            )}

            {!isLoading &&
              searchQuery &&
              (!hasResults || totalResults === 0) && (
                <CommandEmpty>No results found</CommandEmpty>
              )}

            {!isLoading && hasResults && results && (
              <>
                {results.jobs.length > 0 && (
                  <CommandGroup heading="Jobs">
                    {results.jobs.map((job) => (
                      <CommandItem
                        key={job.id}
                        asChild
                        onSelect={() => setIsOpen(false)}
                      >
                        <Link
                          href={`/app/jobs/${job.id}`}
                          className="flex items-center gap-2 w-full"
                        >
                          <Briefcase className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {job.title}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {job.externalJobId}
                            </div>
                          </div>
                          <Badge
                            variant={
                              job.status === "OPEN" ? "default" : "secondary"
                            }
                            className="text-xs"
                          >
                            {job.status}
                          </Badge>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {results.applications.length > 0 && (
                  <CommandGroup heading="Applications">
                    {results.applications.map((application) => (
                      <CommandItem
                        key={application.id}
                        asChild
                        onSelect={() => setIsOpen(false)}
                      >
                        <Link
                          href={`/app/applicants/${encodeURIComponent(application.email)}`}
                          className="flex items-center gap-2 w-full"
                        >
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {application.email}
                            </div>
                            {application.jobTitle && (
                              <div className="text-xs text-muted-foreground truncate">
                                {application.jobTitle}
                              </div>
                            )}
                          </div>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {results.skills.length > 0 && (
                  <CommandGroup heading="Skills">
                    {results.skills.map((skill) => (
                      <CommandItem
                        key={skill.id}
                        asChild
                        onSelect={() => setIsOpen(false)}
                      >
                        <Link
                          href={`/app/skills/${skill.id}`}
                          className="flex items-center gap-2 w-full"
                        >
                          <Code className="h-4 w-4 text-muted-foreground" />
                          <div className="font-medium truncate">
                            {skill.skillName}
                          </div>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}

                {results.questions.length > 0 && (
                  <CommandGroup heading="Questions">
                    {results.questions.map((question) => (
                      <CommandItem
                        key={question.id}
                        asChild
                        onSelect={() => setIsOpen(false)}
                      >
                        <Link
                          href={`/app/skills/${question.skillId}/challenges/${question.id}`}
                          className="flex items-center gap-2 w-full"
                        >
                          <FileQuestion className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">
                              {question.prompt.length > 60
                                ? `${question.prompt.substring(0, 60)}...`
                                : question.prompt}
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {question.skillName}
                            </div>
                          </div>
                        </Link>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
