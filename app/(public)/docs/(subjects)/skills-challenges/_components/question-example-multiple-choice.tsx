import * as React from "react";
import { cn } from "@/lib/utils";

interface MultipleChoiceExampleProps {
  question: string | React.ReactNode;
  options: (string | React.ReactNode)[];
  correctAnswerIndex: number;
  selectedIndex?: number;
  showImage?: boolean;
  imageAlt?: string;
  showTimer?: boolean;
  timeLimit?: number;
  className?: string;
  variant?: "default" | "compact" | "detailed";
}

export function MultipleChoiceExample({
  question,
  options,
  correctAnswerIndex,
  selectedIndex,
  showImage = false,
  imageAlt = "Question image",
  showTimer = false,
  timeLimit,
  className,
  variant = "default",
}: MultipleChoiceExampleProps) {
  const isCompact = variant === "compact";
  const isDetailed = variant === "detailed";

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

      {/* Question */}
      {typeof question === "string" ? (
        <p
          className={cn(
            "mb-3 font-medium",
            isCompact ? "text-sm" : "text-sm",
            isDetailed && "text-base"
          )}
        >
          {question}
        </p>
      ) : (
        <div className="mb-3">{question}</div>
      )}

      {/* Options */}
      <div className={cn("space-y-2", isCompact && "space-y-1.5")}>
        {options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isCorrect = index === correctAnswerIndex;
          const showCorrect = selectedIndex !== undefined && isCorrect;

          return (
            <div
              key={index}
              className={cn(
                "flex items-center gap-2 rounded border bg-background p-2 text-xs transition-colors",
                isCompact && "p-1.5",
                isSelected &&
                  (isCorrect
                    ? "border-green-500 bg-green-50 dark:bg-green-950"
                    : "border-red-500 bg-red-50 dark:bg-red-950"),
                showCorrect && !isSelected && "border-green-300",
                !isSelected && "border-muted-foreground/30"
              )}
            >
              <div
                className={cn(
                  "flex size-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected
                    ? isCorrect
                      ? "border-green-600 bg-green-600"
                      : "border-red-600 bg-red-600"
                    : "border-muted-foreground/40"
                )}
              >
                {isSelected && <div className="size-2 rounded-full bg-white" />}
              </div>
              <span
                className={cn(
                  "flex-1",
                  isSelected &&
                    isCorrect &&
                    "font-medium text-green-900 dark:text-green-100",
                  isSelected && !isCorrect && "text-red-900 dark:text-red-100"
                )}
              >
                {option}
              </span>
              {showCorrect && (
                <svg
                  className="size-4 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
