"use client";

import { useMemo } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, XCircle, TrendingUp, Clock } from "lucide-react";

interface ApplicationInsightsProps {
  questionHistory: Array<{
    id: string;
    answer: any;
    createdAt: Date;
  }>;
  application: {
    score: number | null;
    passed: boolean | null;
    completedAt: Date | null;
    createdAt: Date;
  };
}

export function ApplicationInsights({
  questionHistory,
  application,
}: ApplicationInsightsProps) {
  const stats = useMemo(() => {
    const totalQuestions = questionHistory.length;
    const correctAnswers = questionHistory.filter(
      (h) => h.answer?.isCorrect === true
    ).length;
    const incorrectAnswers = questionHistory.filter(
      (h) => h.answer?.isCorrect === false
    ).length;
    const accuracy =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Calculate time taken if completed
    let timeTaken: number | null = null;
    if (application.completedAt) {
      timeTaken =
        (application.completedAt.getTime() - application.createdAt.getTime()) /
        1000; // seconds
    }

    return {
      totalQuestions,
      correctAnswers,
      incorrectAnswers,
      accuracy: Math.round(accuracy * 10) / 10,
      timeTaken,
    };
  }, [questionHistory, application]);

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Questions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalQuestions}</div>
            <p className="text-xs text-muted-foreground">Questions answered</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Correct Answers
            </CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.correctAnswers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalQuestions > 0
                ? `${stats.accuracy}% accuracy`
                : "No questions answered"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Incorrect Answers
            </CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.incorrectAnswers}</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalQuestions > 0
                ? `${Math.round(
                    (stats.incorrectAnswers / stats.totalQuestions) * 100
                  )}% of total`
                : "No questions answered"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Time Taken</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.timeTaken !== null ? formatTime(stats.timeTaken) : "—"}
            </div>
            <p className="text-xs text-muted-foreground">
              {application.completedAt
                ? "Time to complete"
                : "Not completed yet"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Overall Score */}
      {application.score !== null && (
        <Card>
          <CardHeader>
            <CardTitle>Overall Score</CardTitle>
            <CardDescription>Final score for this application</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold">{application.score}%</div>
              <div className="flex-1">
                <div className="w-full bg-muted rounded-full h-2.5">
                  <div
                    className={`h-2.5 rounded-full ${
                      application.passed ? "bg-green-500" : "bg-destructive"
                    }`}
                    style={{ width: `${application.score}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {application.passed
                    ? "Application passed the verification"
                    : application.passed === false
                      ? "Application did not meet the pass threshold"
                      : "Score calculated"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
