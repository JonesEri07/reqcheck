"use client";

import Link from "next/link";
import { ExternalLink, CheckCircle2, Circle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { setupSteps, type SetupStep } from "./setup-steps";
import { Team } from "@/lib/db/schema";
import { useState, useEffect } from "react";

interface QuickSetupStepsAccordionProps {
  team: Team;
}

export function QuickSetupStepsAccordion({
  team,
}: QuickSetupStepsAccordionProps) {
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  // Load completed steps from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("setup-completed-steps");
    if (stored) {
      setCompletedSteps(new Set(JSON.parse(stored)));
    }
  }, []);

  const isBasicUser = !team.planName || team.planName === "BASIC";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Setup Steps</CardTitle>
        <CardDescription>
          Reference guide for the quick setup steps you completed
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" className="w-full">
          {setupSteps.map((step) => {
            const isCompleted = completedSteps.has(step.id);
            const isProOnly = step.proOnly;
            const isDisabled = isProOnly && isBasicUser;

            return (
              <AccordionItem key={step.id} value={step.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex items-center gap-3 flex-1">
                    {isCompleted ? (
                      <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    )}
                    <span
                      className={
                        isCompleted
                          ? "text-muted-foreground line-through"
                          : "text-foreground"
                      }
                    >
                      {step.title}
                    </span>
                    {isProOnly && (
                      <Badge variant="secondary" className="text-xs">
                        Pro
                      </Badge>
                    )}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="pl-8 space-y-4">
                    <ul className="text-sm text-muted-foreground space-y-2 ml-6 list-disc">
                      {step.instructions.map((instruction, idx) => (
                        <li key={idx}>{instruction}</li>
                      ))}
                    </ul>
                    <div className="flex items-center gap-3 flex-wrap">
                      {step.routeLink && (
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={step.routeLink}
                            className="inline-flex items-center gap-1"
                          >
                            Go to page
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                      {step.docLink && (
                        <Button variant="outline" size="sm" asChild>
                          <Link
                            href={step.docLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1"
                          >
                            Documentation
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </CardContent>
    </Card>
  );
}
