"use client";

import { useState, useEffect } from "react";
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

interface SetupStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  proOnly?: boolean;
  instructions: string[];
  docLink?: string;
  routeLink?: string;
}

const setupSteps: SetupStep[] = [
  {
    id: "company-configuration",
    title: "Check and set company default configuration values",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Settings > Configuration",
      "Review Team Settings section",
      "Set default pass threshold and question count",
    ],
    routeLink: "/app/settings/configuration#team-settings",
    docLink: "/docs/settings",
  },
  {
    id: "whitelist-urls",
    title: "Setup whitelist URLs",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Settings > Configuration",
      "Navigate to Whitelist URLs section",
      "Add domains where the widget will be allowed",
    ],
    routeLink: "/app/settings/web#whitelist-urls",
    docLink: "/docs/settings",
  },
  {
    id: "api-token",
    title: "Generate API key",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Settings > Configuration",
      "Navigate to API Keys section",
      "Click 'Generate New Token' and copy securely",
    ],
    routeLink: "/app/settings/web#api-keys",
    docLink: "/docs/api",
  },
  {
    id: "add-skills",
    title: "Add skills to their library that they hire for",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Navigate to Skills Library",
      "Browse or search for skills you hire for",
      "Add skills to your library",
    ],
    routeLink: "/app/skills",
    docLink: "/docs/skills-challenges",
  },
  {
    id: "customize-challenge",
    title: "Customize a challenge question (any)",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Skills Library",
      "Select a skill you added",
      "Click on any question to customize it",
    ],
    routeLink: "/app/skills",
    docLink: "/docs/skills-challenges",
  },
  {
    id: "custom-challenge",
    title: "Create a custom challenge question",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Skills Library",
      "Select a skill",
      "Click 'Create Custom Question'",
      "Configure your custom question",
    ],
    routeLink: "/app/skills",
    docLink: "/docs/skills-challenges",
  },
  {
    id: "add-job",
    title: "Add new job",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Navigate to Jobs",
      "Click 'Create Job'",
      "Fill in job details and select skills",
    ],
    routeLink: "/app/jobs",
    docLink: "/docs/jobs",
  },
  {
    id: "integrate-ats",
    title: "Setup integrations",
    icon: <Circle className="h-4 w-4" />,
    proOnly: true,
    instructions: [
      "Go to Integrations",
      "Connect your ATS (Greenhouse, Lever, Ashby, etc.)",
      "Configure sync settings",
    ],
    routeLink: "/app/integrations",
    docLink: "/docs/integrations",
  },
  {
    id: "widget-code",
    title: "Get widget integration code",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Widget Integration (sidebar navigation)",
      "Follow the interactive decision tree",
      "Copy your personalized integration code",
    ],
    routeLink: "/app/widget-integration",
    docLink: "/docs/widget-integration",
  },
  {
    id: "verify-widget",
    title: "Verify widget shows up",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Visit your job posting page",
      "Verify the widget loads correctly",
      "Test the verification flow",
    ],
  },
];

interface SetupFabProps {
  team: Team;
}

export function SetupFab({ team }: SetupFabProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

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

  const incompleteCount = setupSteps.filter(
    (step) => !completedSteps.has(step.id)
  ).length;

  const handleMarkComplete = (stepId: string) => {
    setCompletedSteps((prev) => new Set([...prev, stepId]));
  };

  const handleCompleteSetup = async () => {
    // TODO: Call server action to mark quickSetupDidComplete = true
    // For now, just close
    setIsExpanded(false);
  };

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
                </div>
              );
            })}
          </div>
          {allCompleted && (
            <Button onClick={handleCompleteSetup} className="w-full" size="lg">
              Complete Setup
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
