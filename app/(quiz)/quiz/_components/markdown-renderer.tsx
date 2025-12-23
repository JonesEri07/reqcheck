"use client";

import { useMemo } from "react";

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
  const codeBlockRegex = /```(\w+)?\s*\n?([\s\S]*?)```/g;
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
      content: (match[2] || "").replace(/^\n+/, "").replace(/\n+$/, ""),
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

function parseTextMarkdown(text: string): MarkdownPart[] {
  const parts: MarkdownPart[] = [];
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
      if (!inList) {
        // Flush any accumulated text
        if (textLines.length > 0) {
          parts.push({ type: "text", content: textLines.join("\n") });
          textLines = [];
        }
        inList = true;
        isOrdered = !!orderedMatch;
        listItems = [];
      }
      listItems.push(unorderedMatch?.[1] || orderedMatch?.[1] || "");
    } else {
      if (inList) {
        // Flush list
        parts.push({ type: "list", items: listItems, ordered: isOrdered });
        listItems = [];
        inList = false;
      }
      if (line.trim()) {
        textLines.push(line);
      } else if (lines.length > 1) {
        textLines.push("");
      }
    }
  }

  // Flush remaining list
  if (inList && listItems.length > 0) {
    parts.push({ type: "list", items: listItems, ordered: isOrdered });
  }

  // Flush remaining text
  if (textLines.length > 0) {
    parts.push({ type: "text", content: textLines.join("\n") });
  }

  return parts;
}

function parseInlineMarkdown(text: string): MarkdownPart[] {
  const parts: MarkdownPart[] = [];
  let remaining = text;
  let lastIndex = 0;

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

  matches.sort((a, b) => a.index - b.index);

  for (const match of matches) {
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index);
      if (textBefore) {
        parts.push({ type: "text", content: textBefore });
      }
    }
    parts.push({
      type: match.type,
      content: match.content,
    } as MarkdownPart);
    lastIndex = match.index + match.length;
  }

  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex);
    if (textAfter) {
      parts.push({ type: "text", content: textAfter });
    }
  }

  if (parts.length === 0) {
    parts.push({ type: "text", content: text });
  }

  return parts;
}

function renderInlineMarkdown(part: MarkdownPart, index: number) {
  switch (part.type) {
    case "codeInline":
      return (
        <code
          key={index}
          className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono"
        >
          {part.content}
        </code>
      );
    case "bold":
      return <strong key={index}>{part.content}</strong>;
    case "italic":
      return <em key={index}>{part.content}</em>;
    case "text":
      return <span key={index}>{part.content}</span>;
    default:
      return null;
  }
}

export function MarkdownRenderer({ text }: { text: string }) {
  const parts = useMemo(() => parseMarkdown(text), [text]);

  return (
    <div className="space-y-3">
      {parts.map((part, index) => {
        if (part.type === "code") {
          return (
            <div
              key={index}
              className="bg-muted border border-border rounded-lg p-4 overflow-x-auto"
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
              className={`space-y-1 ${
                part.ordered ? "list-decimal ml-6" : "list-disc ml-6"
              }`}
            >
              {part.items.map((item, itemIndex) => (
                <li key={itemIndex}>
                  {parseInlineMarkdown(item).map((inlinePart, inlineIndex) =>
                    renderInlineMarkdown(inlinePart, inlineIndex)
                  )}
                </li>
              ))}
            </ListTag>
          );
        }
        // Render inline markdown for text parts
        const textLines = part.content.split("\n");
        return (
          <div key={index} className="space-y-1">
            {textLines.map((line, lineIndex) => (
              <p
                key={lineIndex}
                className={`text-lg ${
                  lineIndex === 0 && index === 0 ? "font-semibold" : ""
                }`}
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
  );
}

