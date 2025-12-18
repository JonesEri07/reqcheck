"use client";

import { useState, useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Clock, Info, CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { SkillIcon } from "@/components/skill-icon";
import type {
  MultipleChoiceQuestion,
  FillBlankBlocksQuestion,
  Segment,
} from "@/challenge-question-types";
import {
  isMultipleChoiceConfig,
  isFillBlankBlocksConfig,
} from "@/challenge-question-types";

// Parse prompt text to support markdown features
type MarkdownPart =
  | { type: "text"; content: string }
  | { type: "code"; content: string; language?: string }
  | { type: "codeInline"; content: string }
  | { type: "bold"; content: string }
  | { type: "italic"; content: string }
  | { type: "list"; items: string[]; ordered: boolean };

function parseMarkdown(prompt: string): MarkdownPart[] {
  const parts: MarkdownPart[] = [];
  let remaining = prompt;

  // First, extract code blocks (they have highest priority)
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;
  const codeBlockMatches: Array<{
    index: number;
    length: number;
    language?: string;
    content: string;
  }> = [];

  let match;
  while ((match = codeBlockRegex.exec(prompt)) !== null) {
    codeBlockMatches.push({
      index: match.index,
      length: match[0].length,
      language: match[1] || undefined,
      content: match[2],
    });
  }

  // Process text segments between code blocks
  let lastIndex = 0;
  for (const codeBlock of codeBlockMatches) {
    // Add text before code block
    if (codeBlock.index > lastIndex) {
      const textBefore = prompt.slice(lastIndex, codeBlock.index);
      if (textBefore.trim()) {
        parts.push(...parseTextMarkdown(textBefore));
      }
    }

    // Add code block
    parts.push({
      type: "code",
      content: codeBlock.content,
      language: codeBlock.language,
    });

    lastIndex = codeBlock.index + codeBlock.length;
  }

  // Add remaining text after last code block
  if (lastIndex < prompt.length) {
    const textAfter = prompt.slice(lastIndex);
    if (textAfter.trim()) {
      parts.push(...parseTextMarkdown(textAfter));
    }
  }

  // If no code blocks found, parse entire prompt as text
  if (parts.length === 0) {
    return parseTextMarkdown(prompt);
  }

  return parts;
}

// Parse text markdown (bold, italic, inline code, lists)
function parseTextMarkdown(text: string): MarkdownPart[] {
  const parts: MarkdownPart[] = [];

  // Check for lists first (lines starting with - or * or numbers)
  const lines = text.split("\n");
  let inList = false;
  let listItems: string[] = [];
  let isOrdered = false;
  let textLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const unorderedMatch = line.match(/^[\s]*[-*]\s+(.+)$/);
    const orderedMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);

    if (unorderedMatch || orderedMatch) {
      // Flush any accumulated text lines before starting list
      if (textLines.length > 0) {
        const textContent = textLines.join("\n");
        if (textContent.trim()) {
          parts.push({ type: "text", content: textContent });
        }
        textLines = [];
      }

      if (!inList) {
        // Start new list
        inList = true;
        isOrdered = !!orderedMatch;
        listItems = [];
      }
      if (unorderedMatch && unorderedMatch[1]) {
        listItems.push(unorderedMatch[1]);
      } else if (orderedMatch && orderedMatch[1]) {
        listItems.push(orderedMatch[1]);
      }
    } else {
      // End current list if exists
      if (inList) {
        parts.push({ type: "list", items: listItems, ordered: isOrdered });
        inList = false;
        listItems = [];
      }
      // Accumulate text lines (keep as text, parse inline markdown when rendering)
      textLines.push(line);
    }
  }

  // Close any remaining list
  if (inList) {
    parts.push({ type: "list", items: listItems, ordered: isOrdered });
  }

  // Flush any remaining text lines
  if (textLines.length > 0) {
    const textContent = textLines.join("\n");
    if (textContent.trim()) {
      parts.push({ type: "text", content: textContent });
    }
  }

  return parts.length > 0 ? parts : [{ type: "text", content: text }];
}

// Parse inline markdown (bold, italic, inline code)
function parseInlineMarkdown(text: string): MarkdownPart[] {
  const parts: MarkdownPart[] = [];
  let remaining = text;
  let lastIndex = 0;

  // Pattern: inline code, bold, italic (in that order of priority)
  const patterns = [
    { regex: /`([^`]+)`/g, type: "codeInline" as const },
    { regex: /\*\*([^*]+)\*\*/g, type: "bold" as const },
    { regex: /__([^_]+)__/g, type: "bold" as const },
    { regex: /\*([^*]+)\*/g, type: "italic" as const },
    { regex: /_([^_]+)_/g, type: "italic" as const },
  ];

  const matches: Array<{
    index: number;
    length: number;
    type: "codeInline" | "bold" | "italic";
    content: string;
  }> = [];

  for (const pattern of patterns) {
    const regex = new RegExp(pattern.regex.source, "g");
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (!match[1]) continue;
      // Check if this match overlaps with a higher priority match
      const matchIndex = match.index;
      const matchLength = match[0].length;
      const overlaps = matches.some(
        (m) =>
          (matchIndex >= m.index && matchIndex < m.index + m.length) ||
          (m.index >= matchIndex && m.index < matchIndex + matchLength)
      );
      if (!overlaps) {
        matches.push({
          index: matchIndex,
          length: matchLength,
          type: pattern.type,
          content: match[1],
        });
      }
    }
  }

  // Sort matches by index
  matches.sort((a, b) => a.index - b.index);

  // Build parts
  for (const match of matches) {
    // Add text before match
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index);
      if (textBefore) {
        parts.push({ type: "text", content: textBefore });
      }
    }

    // Add markdown element
    parts.push({
      type: match.type,
      content: match.content,
    } as MarkdownPart);

    lastIndex = match.index + match.length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex);
    if (textAfter) {
      parts.push({ type: "text", content: textAfter });
    }
  }

  return parts.length > 0 ? parts : [{ type: "text", content: text }];
}

// Render inline markdown elements
function renderInlineMarkdown(
  part: MarkdownPart,
  index: number
): React.ReactNode {
  if (part.type === "text") {
    return <span key={index}>{part.content}</span>;
  }
  if (part.type === "codeInline") {
    return (
      <code
        key={index}
        className="px-1.5 py-0.5 rounded bg-muted text-sm font-mono"
      >
        {part.content}
      </code>
    );
  }
  if (part.type === "bold") {
    return <strong key={index}>{part.content}</strong>;
  }
  if (part.type === "italic") {
    return <em key={index}>{part.content}</em>;
  }
  return null;
}

interface ChallengeQuestionPreviewProps {
  type: "multiple_choice" | "fill_blank_blocks";
  prompt: string;
  config: MultipleChoiceQuestion | FillBlankBlocksQuestion;
  imageUrl?: string | null;
  imageAltText?: string | null;
  timeLimitSeconds?: number | null;
  skillName?: string | null;
  skillIconSvg?: string | null;
  className?: string;
  // Answer display props (optional - when provided, shows answers and hides shuffling info)
  selectedAnswer?: string | string[]; // For multiple_choice: string, for fill_blank_blocks: string[]
  correctAnswer?: string | string[]; // For multiple_choice: string, for fill_blank_blocks: string[]
}

export function ChallengeQuestionPreview({
  type,
  prompt,
  config,
  imageUrl,
  imageAltText,
  timeLimitSeconds,
  skillName,
  skillIconSvg,
  className,
  selectedAnswer,
  correctAnswer,
}: ChallengeQuestionPreviewProps) {
  return (
    <Card className={className}>
      <CardContent className="pt-6 space-y-4">
        {/* Header with skill name/icon and timer */}
        <div className="flex items-center justify-between">
          {skillName && (
            <div className="flex items-center gap-2">
              <SkillIcon
                name={skillName}
                iconSvg={skillIconSvg}
                className="w-5 h-5"
              />
              <span className="text-sm font-medium">{skillName}</span>
            </div>
          )}
          {timeLimitSeconds && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{timeLimitSeconds}s</span>
            </div>
          )}
        </div>

        {/* Prompt */}
        <div className="prose prose-sm max-w-none space-y-3">
          {parseMarkdown(prompt).map((part, index) => {
            if (part.type === "code") {
              return (
                <div
                  key={index}
                  className="relative rounded-lg border bg-muted p-4 overflow-x-auto"
                >
                  <pre className="text-sm font-mono whitespace-pre">
                    <code>{part.content}</code>
                  </pre>
                </div>
              );
            }
            if (part.type === "list") {
              const ListTag = part.ordered ? "ol" : "ul";
              return (
                <ListTag
                  key={index}
                  className={`text-base space-y-1 ${
                    part.ordered ? "list-decimal ml-6" : "list-disc ml-6"
                  }`}
                >
                  {part.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {parseInlineMarkdown(item).map(
                        (inlinePart, inlineIndex) =>
                          renderInlineMarkdown(inlinePart, inlineIndex)
                      )}
                    </li>
                  ))}
                </ListTag>
              );
            }
            // Render inline markdown for text parts
            // Split by newlines to preserve line breaks, but render inline markdown within each line
            const textLines = part.content.split("\n");
            return (
              <div key={index} className="space-y-1">
                {textLines.map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    className={`text-base ${lineIndex === 0 && index === 0 ? "font-medium" : ""}`}
                  >
                    {line.trim() ? (
                      parseInlineMarkdown(line).map((inlinePart, inlineIndex) =>
                        renderInlineMarkdown(inlinePart, inlineIndex)
                      )
                    ) : (
                      <span>&nbsp;</span>
                    )}
                  </p>
                ))}
              </div>
            );
          })}
        </div>

        {/* Image */}
        {imageUrl && (
          <div className="relative w-full rounded-lg border overflow-hidden bg-muted">
            <Image
              src={imageUrl}
              alt={imageAltText || "Question image"}
              width={800}
              height={400}
              className="w-full h-auto object-contain"
            />
          </div>
        )}

        {/* Question Content */}
        {type === "multiple_choice" && isMultipleChoiceConfig(config) && (
          <MultipleChoicePreview
            config={config}
            selectedAnswer={
              typeof selectedAnswer === "string" ? selectedAnswer : undefined
            }
            correctAnswer={
              typeof correctAnswer === "string" ? correctAnswer : undefined
            }
          />
        )}

        {type === "fill_blank_blocks" && isFillBlankBlocksConfig(config) && (
          <FillBlankPreview
            config={config}
            selectedAnswers={
              Array.isArray(selectedAnswer) ? selectedAnswer : undefined
            }
            correctAnswers={
              Array.isArray(correctAnswer) ? correctAnswer : undefined
            }
          />
        )}

        {/* Shuffling Information - Only show when not displaying answers */}
        {!selectedAnswer && !correctAnswer && (
          <div className="pt-4 border-t">
            <div className="flex items-start gap-2 p-3 rounded-lg border bg-muted/50">
              <Info className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                {type === "multiple_choice"
                  ? "Answer options will be randomly shuffled for each applicant session to prevent answer pattern memorization."
                  : "The pool of blank options (correct answers and distractors) will be randomly shuffled for each applicant session to prevent answer pattern memorization."}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MultipleChoicePreview({
  config,
  selectedAnswer,
  correctAnswer,
}: {
  config: MultipleChoiceQuestion;
  selectedAnswer?: string;
  correctAnswer?: string;
}) {
  // When showing answers, use the stored config (which reflects the randomized version)
  // Otherwise, randomize to represent how it will appear to applicants
  const options = useMemo(() => config.options, [config.options]);
  const [shuffledOptions, setShuffledOptions] = useState(options);

  useEffect(() => {
    // Only shuffle if not showing answers (answers reflect the actual randomized version)
    if (!selectedAnswer && !correctAnswer) {
      const shuffled = [...options].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    } else {
      // Use original order when showing answers (stored data reflects actual order)
      setShuffledOptions(options);
    }
  }, [options, selectedAnswer, correctAnswer]);

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium">Select the correct answer:</p>
      <div className="space-y-2">
        {shuffledOptions.map((option, index) => {
          const isSelected = selectedAnswer === option;
          const isCorrect = correctAnswer === option;
          const showAnswerIndicators =
            selectedAnswer !== undefined || correctAnswer !== undefined;

          return (
            <div
              key={index}
              className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                showAnswerIndicators
                  ? isSelected && isCorrect
                    ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800"
                    : isSelected && !isCorrect
                      ? "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800"
                      : isCorrect && !isSelected
                        ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800"
                        : "bg-card border-border"
                  : "bg-card hover:bg-accent cursor-pointer"
              }`}
            >
              <div className="flex-shrink-0 w-5 h-5 rounded-full border-2 border-border mt-0.5 flex items-center justify-center">
                {showAnswerIndicators && (
                  <>
                    {isSelected && isCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                    {isSelected && !isCorrect && (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    {isCorrect && !isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 opacity-50" />
                    )}
                  </>
                )}
              </div>
              <span className="text-sm flex-1">{option}</span>
              {showAnswerIndicators && (
                <div className="flex items-center gap-2 text-xs">
                  {isSelected && (
                    <span className="font-medium text-muted-foreground">
                      Selected
                    </span>
                  )}
                  {isCorrect && !isSelected && (
                    <span className="font-medium text-muted-foreground">
                      Correct
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FillBlankPreview({
  config,
  selectedAnswers,
  correctAnswers,
}: {
  config: FillBlankBlocksQuestion;
  selectedAnswers?: string[];
  correctAnswers?: string[];
}) {
  // Combine correct answers and extra blanks for display (show all, including duplicates)
  // When showing answers, use the stored config (which reflects the randomized version)
  // Otherwise, randomize to represent how it will appear to applicants
  const allOptions = useMemo(
    () => [...config.correctAnswer, ...config.extraBlanks],
    [config.correctAnswer, config.extraBlanks]
  );
  const [shuffledOptions, setShuffledOptions] = useState(allOptions);

  useEffect(() => {
    // Only shuffle if not showing answers (answers reflect the actual randomized version)
    if (!selectedAnswers && !correctAnswers) {
      const shuffled = [...allOptions].sort(() => Math.random() - 0.5);
      setShuffledOptions(shuffled);
    } else {
      // Use original order when showing answers (stored data reflects actual order)
      setShuffledOptions(allOptions);
    }
  }, [allOptions, selectedAnswers, correctAnswers]);

  const showAnswerIndicators =
    selectedAnswers !== undefined || correctAnswers !== undefined;

  // Pre-calculate blank indices for each segment
  const blankIndexMap = useMemo(() => {
    const map = new Map<number, number>();
    let blankIndex = 0;
    config.segments.forEach((segment, index) => {
      if (segment.type === "blank") {
        map.set(index, blankIndex++);
      }
    });
    return map;
  }, [config.segments]);

  return (
    <div className="space-y-4">
      {/* Code block with blanks */}
      <div className="relative rounded-lg border bg-muted p-4">
        <pre className="text-sm overflow-x-auto whitespace-pre-wrap font-mono">
          <code>
            {config.segments.map((segment, index) => {
              if (segment.type === "text") {
                return <span key={index}>{segment.text}</span>;
              } else if (segment.type === "blank") {
                const blankIndex = blankIndexMap.get(index) ?? 0;
                const selectedAnswer = selectedAnswers?.[blankIndex];
                const correctAnswer = correctAnswers?.[blankIndex];
                const isCorrect =
                  selectedAnswer === correctAnswer &&
                  selectedAnswer !== undefined;
                const hasIncorrect =
                  selectedAnswer !== undefined &&
                  selectedAnswer !== correctAnswer;

                return (
                  <span
                    key={index}
                    className={`inline-block min-w-[80px] h-6 rounded mx-1 border-2 ${
                      showAnswerIndicators
                        ? isCorrect
                          ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                          : hasIncorrect
                            ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                            : "border-dashed border-primary bg-primary/5"
                        : "border-dashed border-primary bg-primary/5"
                    }`}
                    style={{ position: "relative", top: "4px" }}
                    title={
                      showAnswerIndicators
                        ? selectedAnswer
                          ? `Selected: ${selectedAnswer}${correctAnswer ? ` | Correct: ${correctAnswer}` : ""}`
                          : correctAnswer
                            ? `Correct: ${correctAnswer}`
                            : undefined
                        : undefined
                    }
                  >
                    {showAnswerIndicators && selectedAnswer && (
                      <span className="px-1 text-xs font-medium">
                        {selectedAnswer}
                      </span>
                    )}
                  </span>
                );
              } else if (segment.type === "newline") {
                return <br key={index} />;
              } else if (segment.type === "tab") {
                return <span key={index}>{"\t"}</span>;
              }
              return null;
            })}
          </code>
        </pre>
      </div>

      {/* Answer options */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Select answers for the blanks:</p>
        <div className="flex flex-wrap gap-2">
          {shuffledOptions.map((option, index) => {
            // Check if this option was selected for any blank
            const isSelected = selectedAnswers?.includes(option);
            const isCorrect = correctAnswers?.includes(option);
            const isSelectedAndCorrect = isSelected && isCorrect;
            const isSelectedButIncorrect = isSelected && !isCorrect;

            return (
              <div
                key={index}
                className={`inline-flex items-center justify-center min-w-[80px] h-10 px-3 rounded-md border text-sm font-medium transition-colors ${
                  showAnswerIndicators
                    ? isSelectedAndCorrect
                      ? "border-green-500 bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-300"
                      : isSelectedButIncorrect
                        ? "border-red-500 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-300"
                        : isCorrect && !isSelected
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300 opacity-50"
                          : "border-border bg-background"
                    : "border-border bg-background hover:bg-accent hover:text-accent-foreground cursor-pointer"
                }`}
              >
                {option}
                {showAnswerIndicators && (
                  <span className="ml-2">
                    {isSelectedAndCorrect && (
                      <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                    {isSelectedButIncorrect && (
                      <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    )}
                    {isCorrect && !isSelected && (
                      <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 opacity-50" />
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
