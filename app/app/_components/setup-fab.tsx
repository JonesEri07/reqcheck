"use client";

import { useState, useEffect, useActionState, startTransition } from "react";
import {
  X,
  CheckCircle2,
  Circle,
  ExternalLink,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Team } from "@/lib/db/schema";
import Link from "next/link";
import { completeQuickSetup } from "../actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { useRouter } from "next/navigation";
import { setupSteps } from "./setup-steps";

interface SetupFabProps {
  team: Team;
}

export function SetupFab({ team }: SetupFabProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [state, formAction, pending] = useActionState(completeQuickSetup, {});
  const router = useRouter();

  useToastAction(state);

  // Load completed steps from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("setup-completed-steps");
    if (stored) {
      setCompletedSteps(new Set(JSON.parse(stored)));
    } else {
      // Auto-expand on first visit
      setIsExpanded(true);
    }
  }, []);

  // Save completed steps to localStorage
  useEffect(() => {
    if (completedSteps.size > 0) {
      localStorage.setItem(
        "setup-completed-steps",
        JSON.stringify(Array.from(completedSteps))
      );
    }
  }, [completedSteps]);

  // Don't show if setup is complete
  if (team.quickSetupDidComplete) {
    return null;
  }

  const isFreeUser = !team.planName || team.planName === "FREE";

  // Filter out Pro-only steps from completion count for FREE users
  const incompleteCount = setupSteps.filter(
    (step) => !completedSteps.has(step.id) && !(step.proOnly && isFreeUser)
  ).length;

  const handleMarkComplete = (stepId: string) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]));
  };

  const handleCompleteSetup = () => {
    const formData = new FormData();
    startTransition(() => {
      formAction(formData);
    });
  };

  // Close and refresh when setup is completed
  useEffect(() => {
    if (state && typeof state === "object" && "success" in state) {
      const actionState = state as { success?: string; error?: string };
      if (actionState.success) {
        setIsExpanded(false);
        router.refresh();
      }
    }
  }, [state, router]);

  const allCompleted = incompleteCount === 0;

  if (!isExpanded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => setIsExpanded(true)}
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 relative"
        >
          <ListChecks className="h-6 w-6" />
          {incompleteCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs animate-pulse"
            >
              {incompleteCount}
            </Badge>
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-h-[80vh]">
      <Card className="shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3">
          <CardTitle className="text-lg">Quick Setup</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsExpanded(false)}
            className="h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground">
            {incompleteCount} step{incompleteCount !== 1 ? "s" : ""} remaining
          </div>
          <div className="max-h-[400px] overflow-y-auto space-y-3">
            {setupSteps.map((step) => {
              const isCompleted = completedSteps.has(step.id);
              const isProOnly = step.proOnly;
              const isFreeUser = !team.planName || team.planName === "FREE";
              const isDisabled = isProOnly && isFreeUser;

              return (
                <div
                  key={step.id}
                  className={`p-3 rounded-lg border ${
                    isCompleted
                      ? "bg-muted/50 border-muted"
                      : "bg-background border-border"
                  } ${isDisabled ? "opacity-50" : ""}`}
                >
                  <div className="flex items-start gap-3">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4
                          className={`font-medium text-sm ${
                            isCompleted
                              ? "text-muted-foreground line-through"
                              : "text-foreground"
                          }`}
                        >
                          {step.title}
                        </h4>
                        {isProOnly && (
                          <Badge variant="secondary" className="text-xs">
                            Pro
                          </Badge>
                        )}
                      </div>
                      <ul className="text-xs text-muted-foreground space-y-1 ml-6 list-disc">
                        {step.instructions.map((instruction, idx) => (
                          <li key={idx}>{instruction}</li>
                        ))}
                      </ul>
                      <div className="flex items-center gap-2 mt-2">
                        {step.routeLink && (
                          <Link
                            href={step.routeLink}
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Go to page
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                        {step.docLink && (
                          <Link
                            href={step.docLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1"
                          >
                            Documentation
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                  {!isCompleted && (
                    <>
                      {isProOnly && isFreeUser ? (
                        <Button
                          variant="default"
                          size="sm"
                          className="mt-2 w-full"
                          asChild
                        >
                          <Link href="/app/team/subscription">
                            Upgrade to Pro
                          </Link>
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => handleMarkComplete(step.id)}
                          disabled={isDisabled}
                        >
                          Mark as completed
                        </Button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          {allCompleted && (
            <Button
              onClick={handleCompleteSetup}
              className="w-full"
              size="lg"
              disabled={pending}
            >
              {pending ? "Completing..." : "Complete Setup"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
