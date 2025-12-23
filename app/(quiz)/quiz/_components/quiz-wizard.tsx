"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { submitHostedQuiz } from "../actions";
import { MarkdownRenderer } from "./markdown-renderer";
import { X } from "lucide-react";
import type { ActionState } from "@/lib/auth/proxy";

type Question = {
  id: string;
  type: "multiple_choice" | "fill_blank_blocks";
  prompt: string;
  config: any;
  imageUrl?: string | null;
  imageAltText?: string | null;
  timeLimitSeconds?: number | null;
  skillName?: string;
  answer?: any; // For resume
};

type QuizWizardProps = {
  questions: Question[];
  sessionToken: string;
  attemptId: string;
  redirectToken: string;
  startIndex?: number; // For resume
  testMode?: boolean;
};

export function QuizWizard({
  questions,
  sessionToken,
  attemptId,
  redirectToken,
  startIndex = 0,
  testMode = false,
}: QuizWizardProps) {
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [submitState, submitAction, submitPending] = useActionState<
    ActionState,
    FormData
  >(submitHostedQuiz, { error: "" });
  const [isPending, startTransition] = useTransition();

  useToastAction(submitState);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;
  const progress = ((currentIndex + 1) / questions.length) * 100;

  // Initialize answers from existing question answers (for resume)
  useEffect(() => {
    const initialAnswers: Record<string, any> = {};
    questions.forEach((q) => {
      if (q.answer !== null && q.answer !== undefined) {
        initialAnswers[q.id] = q.answer;
      }
    });
    setAnswers(initialAnswers);
  }, [questions]);

  // Handle timer
  useEffect(() => {
    if (!currentQuestion?.timeLimitSeconds) {
      setTimeRemaining(null);
      return;
    }

    setTimeRemaining(currentQuestion.timeLimitSeconds);
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(interval);
          handleNext(); // Auto-advance when time runs out
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [currentIndex, currentQuestion?.timeLimitSeconds]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const saveProgress = async (questionId: string, answer: any) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
      await fetch(`${baseUrl}/api/v1/widget/attempts/progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionToken,
          attemptId,
          questionId,
          answer,
        }),
      });
    } catch (error) {
      console.error("Failed to save progress:", error);
    }
  };

  const handleNext = async () => {
    if (!canProceed()) {
      return; // Don't advance without valid answer
    }
    const answer = answers[currentQuestion.id];

    // Save progress (skip in test mode)
    if (!testMode) {
      await saveProgress(currentQuestion.id, answer);
    }

    if (isLastQuestion) {
      // Submit quiz
      const allAnswers = questions.map((q) => ({
        questionId: q.id,
        answer: answers[q.id] || (q.type === "fill_blank_blocks" ? [] : ""),
      }));

      startTransition(() => {
        const formData = new FormData();
        formData.append("sessionToken", sessionToken);
        formData.append("attemptId", attemptId);
        formData.append("answers", JSON.stringify(allAnswers));
        // Include questions and redirectToken for test mode
        if (testMode) {
          formData.append("questions", JSON.stringify(questions));
          formData.append("redirectToken", redirectToken);
        }
        submitAction(formData);
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Handle redirect on completion
  useEffect(() => {
    if (
      submitState &&
      "redirectUrl" in submitState &&
      submitState.redirectUrl
    ) {
      window.location.href = submitState.redirectUrl;
    }
  }, [submitState]);

  const canProceed = () => {
    const answer = answers[currentQuestion.id];
    if (currentQuestion.type === "multiple_choice") {
      return !!answer && answer !== "";
    } else if (currentQuestion.type === "fill_blank_blocks") {
      const blankCount =
        currentQuestion.config.segments?.filter((s: any) => s.type === "blank")
          .length || 0;
      if (blankCount === 0) return true;
      return (
        Array.isArray(answer) &&
        answer.length === blankCount &&
        answer.every((a) => a !== null && a !== undefined && a !== "")
      );
    }
    return false;
  };

  if (!currentQuestion) {
    return <div>No questions available</div>;
  }

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

        {/* Close button (X icon) - top right */}
        <button
          onClick={() => {
            // Abandon quiz - redirect to fail URL
            if (redirectToken) {
              // In a real implementation, we'd verify the token and get the fail URL
              // For now, just show a message
              if (
                confirm(
                  "Are you sure you want to leave? Your progress will be saved."
                )
              ) {
                window.location.href = "/";
              }
            }
          }}
          className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-all z-10"
          aria-label="Close"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Content wrapper (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Skill name badge (if available) */}
            {currentQuestion.skillName && (
              <div className="inline-block px-3 py-1.5 bg-muted rounded-md text-sm font-medium text-muted-foreground opacity-80 mb-4">
                {currentQuestion.skillName}
              </div>
            )}

            {/* Progress indicator */}
            <div className="mb-6">
              {/* Progress bar */}
              <div className="h-1 bg-muted rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              {/* Progress text */}
              <div className="flex justify-between items-center text-sm text-muted-foreground opacity-80">
                <span>
                  Question {currentIndex + 1} of {questions.length}
                </span>
                {/* Timer display (if question has time limit) */}
                {timeRemaining !== null && (
                  <span
                    className={`font-semibold ${
                      timeRemaining <= 10
                        ? "text-destructive"
                        : timeRemaining <= 30
                          ? "text-orange-500"
                          : "text-foreground"
                    }`}
                  >
                    {timeRemaining}s
                  </span>
                )}
              </div>
            </div>

            {/* Question prompt with markdown support */}
            <div className="mb-6 text-foreground">
              <MarkdownRenderer text={currentQuestion.prompt} />
            </div>

            {/* Question image (if present) */}
            {currentQuestion.imageUrl && (
              <div className="mb-6 flex justify-center">
                <img
                  src={currentQuestion.imageUrl}
                  alt={currentQuestion.imageAltText || "Question image"}
                  className="max-w-full h-auto max-h-[200px] object-contain rounded-lg border border-border bg-muted"
                />
              </div>
            )}

            {/* Question content based on type */}
            {currentQuestion.type === "multiple_choice" && (
              <div className="space-y-2 mb-6">
                {currentQuestion.config.options?.map((option: string) => {
                  const isSelected = answers[currentQuestion.id] === option;
                  return (
                    <label
                      key={option}
                      className={`block p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        isSelected
                          ? "border-primary bg-muted"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <input
                        type="radio"
                        name={`question-${currentQuestion.id}`}
                        value={option}
                        checked={isSelected}
                        onChange={() =>
                          handleAnswerChange(currentQuestion.id, option)
                        }
                        className="mr-3"
                      />
                      <span className="text-foreground">{option}</span>
                    </label>
                  );
                })}
              </div>
            )}

            {currentQuestion.type === "fill_blank_blocks" && (
              <FillBlankBlocksQuestion
                question={currentQuestion}
                answer={answers[currentQuestion.id] || []}
                onChange={(answer) =>
                  handleAnswerChange(currentQuestion.id, answer)
                }
              />
            )}

            {/* Submit button (full width, disabled until answer provided) */}
            <Button
              onClick={handleNext}
              disabled={!canProceed() || submitPending || isPending}
              className="w-full"
            >
              {submitPending || isPending
                ? "Submitting..."
                : isLastQuestion
                  ? "Submit Quiz"
                  : "Next Question"}
            </Button>
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

function FillBlankBlocksQuestion({
  question,
  answer,
  onChange,
}: {
  question: Question;
  answer: string[];
  onChange: (answer: string[]) => void;
}) {
  const segments = question.config.segments || [];
  const blankCount = segments.filter((s: any) => s.type === "blank").length;
  const shuffledOptions = question.config.shuffledOptions || [
    ...(question.config.correctAnswer || []),
    ...(question.config.extraBlanks || []),
  ];

  // Initialize selectedOptions: answer array maps to blanks in order, remaining are null
  const initializeSelectedOptions = (
    answerArray: string[]
  ): (string | null)[] => {
    const result: (string | null)[] = Array(blankCount).fill(null);
    // Fill blanks in order with answer values
    // Answer array contains only filled values (no nulls), in order of blanks
    if (Array.isArray(answerArray)) {
      for (let i = 0; i < Math.min(answerArray.length, blankCount); i++) {
        result[i] = answerArray[i];
      }
    }
    return result;
  };

  const [selectedOptions, setSelectedOptions] = useState<(string | null)[]>(
    () => initializeSelectedOptions(Array.isArray(answer) ? answer : [])
  );

  // Only sync from answer prop on mount or when answer changes externally (e.g., resume)
  // Use a ref to track the last synced answer to avoid unnecessary resets
  const lastSyncedAnswerRef = useRef<string>(
    JSON.stringify(Array.isArray(answer) ? answer : [])
  );

  useEffect(() => {
    const answerArray = Array.isArray(answer) ? answer : [];
    const answerStr = JSON.stringify(answerArray);

    // Only update if answer changed externally (not from our own onChange calls)
    if (answerStr !== lastSyncedAnswerRef.current) {
      setSelectedOptions(initializeSelectedOptions(answerArray));
      lastSyncedAnswerRef.current = answerStr;
    }
  }, [answer, blankCount]);

  // Calculate available options (accounting for duplicates)
  // Count how many times each option is used
  const usedCounts = new Map<string, number>();
  selectedOptions.forEach((opt) => {
    if (opt !== null) {
      usedCounts.set(opt, (usedCounts.get(opt) || 0) + 1);
    }
  });

  // Count total occurrences of each option in shuffledOptions
  const optionCounts = new Map<string, number>();
  shuffledOptions.forEach((opt: string) => {
    optionCounts.set(opt, (optionCounts.get(opt) || 0) + 1);
  });

  // Build available options array (can include duplicates if not all are used)
  const availableOptions: string[] = [];
  shuffledOptions.forEach((opt: string) => {
    const used = usedCounts.get(opt) || 0;
    const total = optionCounts.get(opt) || 0;
    if (used < total) {
      availableOptions.push(opt);
    }
  });

  const handleBlankClick = (blankIndex: number) => {
    const newSelected = [...selectedOptions];
    newSelected[blankIndex] = null;
    setSelectedOptions(newSelected);
    // Update the ref to prevent useEffect from resetting
    const filtered = newSelected.filter((s) => s !== null) as string[];
    lastSyncedAnswerRef.current = JSON.stringify(filtered);
    onChange(filtered);
  };

  const handleOptionClick = (option: string) => {
    const firstEmptyIndex = selectedOptions.findIndex((s) => s === null);
    if (firstEmptyIndex !== -1) {
      const newSelected = [...selectedOptions];
      newSelected[firstEmptyIndex] = option;
      setSelectedOptions(newSelected);
      // Update the ref to prevent useEffect from resetting
      const filtered = newSelected.filter((s) => s !== null) as string[];
      lastSyncedAnswerRef.current = JSON.stringify(filtered);
      onChange(filtered);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      {/* Code block container */}
      <div className="bg-muted border border-border rounded-lg p-4 overflow-x-auto">
        <pre className="text-sm font-mono whitespace-pre leading-relaxed">
          <code className="text-foreground">
            {segments.map((segment: any, index: number) => {
              if (segment.type === "text") {
                return <span key={index}>{segment.text}</span>;
              } else if (segment.type === "blank") {
                const blankIndex = segments
                  .slice(0, index)
                  .filter((s: any) => s.type === "blank").length;
                const value = selectedOptions[blankIndex];
                return (
                  <span
                    key={index}
                    onClick={() => handleBlankClick(blankIndex)}
                    className={`inline-block min-w-[60px] h-6 mx-1 px-2 py-0.5 border-2 rounded-md align-middle text-center cursor-pointer transition-all ${
                      value
                        ? "border-primary bg-background text-foreground"
                        : "border-dashed border-muted-foreground/50 bg-muted-foreground/10 text-muted-foreground"
                    }`}
                  >
                    {value || "____"}
                  </span>
                );
              } else if (segment.type === "newline") {
                return <br key={index} />;
              } else if (segment.type === "tab") {
                return <span key={index}>&nbsp;&nbsp;&nbsp;&nbsp;</span>;
              }
              return null;
            })}
          </code>
        </pre>
      </div>

      {/* Options label */}
      <p className="text-sm font-medium text-foreground">
        Click an option to fill the earliest blank:
      </p>

      {/* Options pool */}
      <div className="flex flex-wrap gap-2">
        {availableOptions.map((option: string, index: number) => (
          <button
            key={`${option}-${index}`}
            type="button"
            onClick={() => handleOptionClick(option)}
            className="px-3 py-2 text-sm font-medium border border-border rounded-md bg-background text-foreground hover:border-primary hover:bg-muted transition-all cursor-pointer"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
}
