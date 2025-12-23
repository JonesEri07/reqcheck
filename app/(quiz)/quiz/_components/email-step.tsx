"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { checkQuizStatus, startHostedQuiz } from "../actions";

type EmailStepProps = {
  companyId: string;
  jobId: string;
  redirectPass: string;
  redirectFail: string;
  testMode?: boolean;
  onStatusChecked: (status: {
    status: "passed" | "failed" | "in_progress" | null;
    attempt?: any;
  }) => void;
  onQuizStarted: (data: {
    sessionToken: string;
    attemptId: string;
    questions: any[];
    redirectToken: string;
    testMode?: boolean;
  }) => void;
};

export function EmailStep({
  companyId,
  jobId,
  redirectPass,
  redirectFail,
  testMode = false,
  onStatusChecked,
  onQuizStarted,
}: EmailStepProps) {
  const [email, setEmail] = useState("");
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Please enter a valid email address");
      return;
    }

    setPending(true);

    try {
      // First check status
      const statusResult = await checkQuizStatus({
        companyId,
        jobId,
        email,
        testMode,
      });

      if (statusResult?.error) {
        toast.error(statusResult.error);
        setPending(false);
        return;
      }

      // If status check returned a status (passed, failed, or in_progress), handle it
      // Note: null status means no existing attempt, so we continue to start new quiz
      if (
        statusResult?.status !== undefined &&
        statusResult.status !== null &&
        statusResult.status !== "abandoned"
      ) {
        setPending(false);
        onStatusChecked({
          status: statusResult.status,
          attempt: statusResult.attempt,
        });
        return;
      }

      // If no status (no attempt), start new quiz
      const startResult = await startHostedQuiz({
        companyId,
        jobId,
        email,
        redirectPass,
        redirectFail,
        testMode,
      });

      if (startResult?.error) {
        toast.error(startResult.error);
        setPending(false);
        return;
      }

      if (startResult?.sessionToken && startResult?.attemptId) {
        setPending(false);
        onQuizStarted({
          sessionToken: startResult.sessionToken,
          attemptId: startResult.attemptId,
          questions: startResult.questions || [],
          redirectToken: startResult.redirectToken || "",
          testMode: startResult.testMode || testMode,
        });
      } else {
        // Unexpected response - no session token
        console.error("Unexpected startHostedQuiz response:", startResult);
        toast.error("Failed to start quiz. Please try again.");
        setPending(false);
      }
    } catch (error: any) {
      console.error("Error in handleSubmit:", error);
      toast.error(error.message || "An error occurred. Please try again.");
      setPending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Modal-like container matching widget style */}
      <div className="relative bg-card rounded-xl max-w-[700px] w-full max-h-[90vh] flex flex-col shadow-2xl">
        {/* TEST MODE indicator tab - centered along top edge */}
        {testMode && (
          <div className="absolute -top-[30px] left-1/2 -translate-x-1/2 bg-yellow-500 text-white px-6 py-1.5 rounded-t-lg text-xs font-semibold uppercase tracking-wide z-10 shadow-lg whitespace-nowrap">
            TEST MODE
          </div>
        )}

        {/* Content wrapper (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-12 text-center">
            {/* Title */}
            <h2 className="text-3xl font-semibold text-foreground mb-2">
              Enter Your Email
            </h2>

            {/* Description */}
            <p className="text-sm text-muted-foreground opacity-80 mb-8">
              We'll use this to track your verification progress.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                type="email"
                placeholder="candidate@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={pending}
                autoFocus
                className="w-full"
              />

              <Button
                type="submit"
                disabled={pending || !email || !email.includes("@")}
                className="w-full"
              >
                {pending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Footer with "Powered by reqCHECK" */}
        <div className="px-8 py-4 border-t border-border bg-muted/30 rounded-b-xl text-center">
          <p className="text-xs text-muted-foreground opacity-70 font-medium">
            Powered by reqCHECK
          </p>
        </div>
      </div>
    </div>
  );
}
