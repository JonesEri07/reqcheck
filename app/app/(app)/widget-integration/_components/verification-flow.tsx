"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowDown, CheckCircle2, XCircle } from "lucide-react";

export function VerificationFlow() {
  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-14 self-start max-h-[calc(100vh-6rem)] overflow-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Verification Flow</CardTitle>
            <CardDescription className="text-xs">
              How backend verification works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  1
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Applicant Passes Quiz</p>
                  <p className="text-xs text-muted-foreground">
                    Candidate completes reqCHECK skills assessment and passes
                    the threshold
                  </p>
                </div>
              </div>

              <div className="flex justify-center py-1">
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  2
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Submits Application</p>
                  <p className="text-xs text-muted-foreground">
                    Applicant submits job application to your company's system
                  </p>
                </div>
              </div>

              <div className="flex justify-center py-1">
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                  3
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">Verify with reqCHECK</p>
                  <p className="text-xs text-muted-foreground">
                    Your backend calls reqCHECK API with email and external job
                    ID
                  </p>
                </div>
              </div>

              <div className="flex justify-center py-1">
                <ArrowDown className="h-4 w-4 text-muted-foreground" />
              </div>

              {/* Step 4 - Decision */}
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                    4
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Verification Result</p>
                  </div>
                </div>

                {/* Valid Path */}
                <div className="ml-9 space-y-2 rounded-lg border border-green-200 bg-green-50 p-3 dark:border-green-900 dark:bg-green-950">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Valid & Passed
                    </p>
                  </div>
                  <p className="text-xs text-green-800 dark:text-green-200">
                    Add applicant to your system and process application
                  </p>
                </div>

                {/* Invalid Path */}
                <div className="ml-9 space-y-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-destructive" />
                    <p className="text-sm font-medium text-destructive">
                      Invalid or Failed
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Reject application - verification not found or score too low
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> Verification results expire after 1 hour.
                Always verify server-side before processing applications.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
