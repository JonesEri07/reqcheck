import * as React from "react";
import { cn } from "@/lib/utils";

interface FillInTheBlankExampleProps {
  question: string | React.ReactNode;
  blanks: Array<{ id: string; correctAnswer: string }>;
  options: string[];
  selectedAnswers?: Record<string, string>;
  showImage?: boolean;
  imageAlt?: string;
  showTimer?: boolean;
  timeLimit?: number;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

export function FillInTheBlankExample({
  question,
  blanks,
  options,
  selectedAnswers = {},
  showImage = false,
  imageAlt = "Question image",
  showTimer = false,
  timeLimit,
  className,
  variant = "default",
}: FillInTheBlankExampleProps) {
  const isDetailed = variant === "detailed";

  // Render question - can be string or custom ReactNode
  const renderQuestion = () => {
    if (typeof question === "string") {
      return (
        <p className={cn("text-sm", isDetailed && "text-base")}>{question}</p>
      );
    }
    return (
      <div className={cn("text-sm", isDetailed && "text-base")}>{question}</div>
    );
  };

  return (
    <div
      className={cn(
        "rounded-lg border bg-muted/50 p-4",
        isDetailed && "bg-background border-2",
        className
      )}
    >
      {/* Header with timer */}
      {(showTimer || isDetailed) && (
        <div className="mb-3 flex items-center justify-between">
          {showTimer && timeLimit && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <svg
                className="size-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>{timeLimit} seconds</span>
            </div>
          )}
        </div>
      )}

      {/* Image */}
      {showImage && (
        <div className="mb-3 flex items-center justify-center rounded border bg-background p-4">
          <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
            <svg
              className="size-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span>{imageAlt}</span>
          </div>
        </div>
      )}

      {/* Question with blanks */}
      <div className="mb-4">{renderQuestion()}</div>

      {/* Blanks display */}
      {typeof question === "string" && blanks.length > 0 && (
        <div className="mb-4 rounded border bg-background p-3 font-mono text-sm">
          <div className="flex flex-wrap items-center gap-2">
            {blanks.map((blank, index) => {
              const selected = selectedAnswers[blank.id];
              const isCorrect = selected === blank.correctAnswer;
              const hasSelection = selected !== undefined;

              return (
                <React.Fragment key={blank.id}>
                  {index > 0 && (
                    <span className="text-muted-foreground">...</span>
                  )}
                  <span
                    className={cn(
                      "inline-block rounded border-2 border-dashed px-2 py-1",
                      hasSelection
                        ? isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : "border-red-500 bg-red-50 dark:bg-red-950"
                        : "border-yellow-400 bg-yellow-100 dark:bg-yellow-900/30"
                    )}
                  >
                    {hasSelection ? (
                      <span
                        className={cn(
                          isCorrect
                            ? "text-green-900 dark:text-green-100"
                            : "text-red-900 dark:text-red-100"
                        )}
                      >
                        {selected}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">[blank]</span>
                    )}
                  </span>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Options pool */}
      <div>
        <p className="mb-2 text-xs font-medium text-muted-foreground">
          Available blocks:
        </p>
        <div className="flex flex-wrap gap-2">
          {options.map((option, index) => {
            const isCorrect = blanks.some((b) => b.correctAnswer === option);
            const isUsed = Object.values(selectedAnswers).includes(option);

            return (
              <div
                key={index}
                className={cn(
                  "rounded border px-2 py-1 text-xs transition-colors",
                  isCorrect
                    ? "border-primary/50 bg-primary/10"
                    : "border-muted-foreground/30 bg-muted",
                  isUsed && "opacity-50"
                )}
              >
                {option}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
