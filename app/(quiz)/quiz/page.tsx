"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { EmailStep } from "./_components/email-step";
import { QuizWizard } from "./_components/quiz-wizard";
import { StatusCheck } from "./_components/status-check";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Loader2 } from "lucide-react";
import { validateJob } from "./actions";

type QuizState =
  | { type: "validating" }
  | { type: "email" }
  | { type: "quiz"; data: QuizData }
  | { type: "error"; message: string }
  | { type: "loading" };

type QuizData = {
  sessionToken: string;
  attemptId: string;
  questions: any[];
  redirectToken: string;
  startIndex?: number;
  testMode?: boolean;
};

function QuizPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [state, setState] = useState<QuizState>({ type: "loading" });
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const validateAndLoad = async () => {
      // Validate required params
      const companyId = searchParams.get("companyId");
      const jobId = searchParams.get("jobId");
      const redirectPass = searchParams.get("redirectPass");
      const redirectFail = searchParams.get("redirectFail");
      const emailParam = searchParams.get("email");
      const testModeParam = searchParams.get("testMode");
      const isTestMode = testModeParam === "true";

      if (!companyId || !jobId || !redirectPass || !redirectFail) {
        setState({
          type: "error",
          message:
            "Missing required parameters. Please provide companyId, jobId, redirectPass, and redirectFail.",
        });
        return;
      }

      // Validate redirect URLs
      try {
        new URL(redirectPass);
        new URL(redirectFail);
      } catch {
        setState({
          type: "error",
          message: "Invalid redirect URLs. Both redirectPass and redirectFail must be valid URLs.",
        });
        return;
      }

      // Validate job exists and is accessible
      setState({ type: "validating" });
      const validationResult = await validateJob({
        companyId,
        jobId,
        testMode: isTestMode,
      });

      if (!validationResult.valid || validationResult.error) {
        setState({
          type: "error",
          message: validationResult.error || "Job validation failed",
        });
        return;
      }

      if (emailParam) {
        setEmail(emailParam);
        // Auto-check status if email provided
        // This will be handled by EmailStep component
      }

      setState({ type: "email" });
    };

    validateAndLoad();
  }, [searchParams]);

  const handleStatusChecked = (status: {
    status: "passed" | "failed" | "in_progress" | null;
    attempt?: any;
  }) => {
    if (status.status === "passed" || status.status === "failed") {
      // StatusCheck component will handle redirect
      const redirectUrl =
        status.status === "passed"
          ? searchParams.get("redirectPass")!
          : searchParams.get("redirectFail")!;
      const url = new URL(redirectUrl);
      url.searchParams.set("status", status.status);
      if (status.attempt?.score !== undefined) {
        url.searchParams.set("score", status.attempt.score.toString());
      }
      handleRedirect(url.toString());
      return;
    }

    if (status.status === "in_progress" && status.attempt) {
      // Resume quiz - need to get questions
      handleResume(status.attempt);
    } else {
      // No attempt, start new quiz
      // This will be handled by EmailStep
    }
  };

  const handleResume = async (attempt: any) => {
    try {
      const companyId = searchParams.get("companyId")!;
      const jobId = searchParams.get("jobId")!;
      const baseUrl = window.location.origin;

      // Get current attempt to get questions
      const response = await fetch(
        `${baseUrl}/api/v1/widget/attempts/current?companyId=${companyId}&jobId=${jobId}&email=${email}`
      );

      if (!response.ok) {
        throw new Error("Failed to get current attempt");
      }

      const data = await response.json();
      if (data.status === "in_progress" && data.attempt?.questionsShown) {
        // Find first unanswered question
        const firstUnansweredIndex = data.attempt.questionsShown.findIndex(
          (q: any, idx: number) => {
            const answer = data.attempt.answers?.[idx];
            return !answer || answer.answer === null;
          }
        );

        setState({
          type: "quiz",
          data: {
            sessionToken: attempt.sessionToken,
            attemptId: attempt.id,
            questions: data.attempt.questionsShown,
            redirectToken: attempt.redirectToken,
            startIndex: firstUnansweredIndex >= 0 ? firstUnansweredIndex : 0,
          },
        });
      } else {
        // Fallback: start new quiz
        handleQuizStarted({
          sessionToken: attempt.sessionToken,
          attemptId: attempt.id,
          questions: [],
          redirectToken: attempt.redirectToken,
        });
      }
    } catch (error) {
      console.error("Error resuming quiz:", error);
      setState({
        type: "error",
        message: "Failed to resume quiz. Please try starting a new quiz.",
      });
    }
  };

  const handleQuizStarted = (data: QuizData) => {
    setState({ type: "quiz", data });
  };

  const handleRedirect = (url: string) => {
    window.location.href = url;
  };

  if (state.type === "loading" || state.type === "validating") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          <div className="text-muted-foreground">
            {state.type === "validating" ? "Validating job..." : "Loading..."}
          </div>
        </div>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Unable to start quiz</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              <p className="text-sm text-destructive">{state.message}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (state.type === "quiz") {
    return <QuizWizard {...state.data} />;
  }

  // Email step
  const companyId = searchParams.get("companyId")!;
  const jobId = searchParams.get("jobId")!;
  const redirectPass = searchParams.get("redirectPass")!;
  const redirectFail = searchParams.get("redirectFail")!;
  const testModeParam = searchParams.get("testMode");
  const isTestMode = testModeParam === "true";

  return (
    <EmailStep
      companyId={companyId}
      jobId={jobId}
      redirectPass={redirectPass}
      redirectFail={redirectFail}
      testMode={isTestMode}
      onStatusChecked={handleStatusChecked}
      onQuizStarted={handleQuizStarted}
    />
  );
}

export default function QuizPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <div className="text-muted-foreground">Loading...</div>
          </div>
        </div>
      }
    >
      <QuizPageContent />
    </Suspense>
  );
}

