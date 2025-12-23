"use client";

import { useEffect } from "react";

type StatusCheckProps = {
  status: "passed" | "failed" | "in_progress" | null;
  attempt?: {
    id: string;
    sessionToken?: string;
    redirectToken?: string;
    score?: number;
    passed?: boolean;
  };
  redirectPass: string;
  redirectFail: string;
  onRedirect: (url: string) => void;
  onResume: (data: {
    sessionToken: string;
    attemptId: string;
    redirectToken: string;
  }) => void;
};

export function StatusCheck({
  status,
  attempt,
  redirectPass,
  redirectFail,
  onRedirect,
  onResume,
}: StatusCheckProps) {
  useEffect(() => {
    if (!status) {
      return;
    }

    if (status === "passed" || status === "failed") {
      // Use redirect URLs from props (already validated)
      const redirectUrl = status === "passed" ? redirectPass : redirectFail;

      // Add status params
      const url = new URL(redirectUrl);
      url.searchParams.set("status", status);
      if (attempt?.score !== undefined) {
        url.searchParams.set("score", attempt.score.toString());
      }

      onRedirect(url.toString());
    } else if (status === "in_progress" && attempt?.sessionToken && attempt?.redirectToken) {
      // Resume quiz
      onResume({
        sessionToken: attempt.sessionToken,
        attemptId: attempt.id,
        redirectToken: attempt.redirectToken,
      });
    }
  }, [status, attempt, redirectPass, redirectFail, onRedirect, onResume]);

  return null; // This component just handles side effects
}

