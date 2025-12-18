/**
 * Full-page modal component for quiz
 * Two-step: email input → quiz wizard
 */

import type { QuizQuestion } from "./api";
import { saveProgress, submitAttempt } from "./api";

/**
 * Render markdown text to DOM elements
 * Supports: code blocks, inline code, bold, italic, lists, line breaks
 */
function renderMarkdown(text: string): HTMLElement {
  const container = document.createElement("div");
  container.style.cssText = "line-height: 1.6;";

  // First, extract code blocks
  // Pattern: ```language\ncontent``` or ```\ncontent``` or ```language content```
  // More flexible - handles optional language, optional newline, and any whitespace
  // Match: ``` followed by optional language, optional whitespace, optional newline, content, then ```
  const codeBlockRegex = /```(\w+)?\s*\n?([\s\S]*?)```/g;
  const parts: Array<{
    type: "code" | "text";
    content: string;
    language?: string;
  }> = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  // Reset regex lastIndex to avoid issues with multiple calls
  codeBlockRegex.lastIndex = 0;

  while ((match = codeBlockRegex.exec(text)) !== null) {
    // Add text before code block
    if (match.index > lastIndex) {
      const textBefore = text.slice(lastIndex, match.index);
      if (textBefore.trim()) {
        parts.push({ type: "text", content: textBefore });
      }
    }
    // Add code block (trim only leading/trailing newlines, preserve internal formatting)
    let codeContent = match[2] || "";
    // Remove leading newlines
    codeContent = codeContent.replace(/^\n+/, "");
    // Remove trailing newlines
    codeContent = codeContent.replace(/\n+$/, "");
    parts.push({
      type: "code",
      content: codeContent,
      language: match[1] || undefined,
    });
    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    const textAfter = text.slice(lastIndex);
    if (textAfter.trim()) {
      parts.push({ type: "text", content: textAfter });
    }
  }

  // If no code blocks, treat entire text as text
  if (parts.length === 0) {
    parts.push({ type: "text", content: text });
  }

  // Render each part
  parts.forEach((part) => {
    if (part.type === "code") {
      const codeBlock = document.createElement("div");
      codeBlock.style.cssText = `
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 6px;
        padding: 1rem;
        margin: 0.5rem 0;
        overflow-x: auto;
      `;
      const pre = document.createElement("pre");
      pre.style.cssText = `
        margin: 0;
        font-family: monospace;
        font-size: 0.875rem;
        white-space: pre;
        color: #1f2937;
      `;
      const code = document.createElement("code");
      code.textContent = part.content;
      code.style.cssText = "color: #1f2937;";
      pre.appendChild(code);
      codeBlock.appendChild(pre);
      container.appendChild(codeBlock);
    } else {
      // Parse text for inline markdown and lists
      renderTextMarkdown(part.content, container);
    }
  });

  return container;
}

/**
 * Render text with inline markdown (bold, italic, code, lists)
 */
function renderTextMarkdown(text: string, container: HTMLElement): void {
  const lines = text.split("\n");
  let inList = false;
  let listElement: HTMLUListElement | HTMLOListElement | null = null;

  for (const line of lines) {
    // Check for list items
    const unorderedMatch = line.match(/^[\s]*[-*]\s+(.+)$/);
    const orderedMatch = line.match(/^[\s]*\d+\.\s+(.+)$/);

    if (unorderedMatch || orderedMatch) {
      if (!inList) {
        inList = true;
        listElement = unorderedMatch
          ? document.createElement("ul")
          : document.createElement("ol");
        listElement.style.cssText = `
          margin: 0.5rem 0;
          padding-left: 1.5rem;
          color: #1f2937;
        `;
        container.appendChild(listElement);
      }
      const item = document.createElement("li");
      item.style.cssText = "margin: 0.25rem 0; color: #1f2937;";
      renderInlineMarkdown(
        unorderedMatch?.[1] || orderedMatch?.[1] || "",
        item
      );
      listElement!.appendChild(item);
    } else {
      if (inList) {
        inList = false;
        listElement = null;
      }
      if (line.trim()) {
        const p = document.createElement("p");
        p.style.cssText = "margin: 0.5rem 0; color: #1f2937;";
        renderInlineMarkdown(line, p);
        container.appendChild(p);
      } else if (lines.length > 1) {
        // Empty line - add spacing (but not for single-line text)
        const br = document.createElement("br");
        container.appendChild(br);
      }
    }
  }
}

/**
 * Render inline markdown (bold, italic, inline code)
 */
function renderInlineMarkdown(text: string, container: HTMLElement): void {
  // Pattern priority: inline code, bold, italic
  const patterns = [
    { regex: /`([^`]+)`/g, tag: "code" },
    { regex: /\*\*([^*]+)\*\*/g, tag: "strong" },
    { regex: /__([^_]+)__/g, tag: "strong" },
    { regex: /\*([^*]+)\*/g, tag: "em" },
    { regex: /_([^_]+)_/g, tag: "em" },
  ];

  let remaining = text;
  let lastIndex = 0;
  const matches: Array<{
    index: number;
    length: number;
    tag: string;
    content: string;
  }> = [];

  // Find all matches (process in priority order)
  for (let patternIndex = 0; patternIndex < patterns.length; patternIndex++) {
    const pattern = patterns[patternIndex];
    const regex = new RegExp(pattern.regex.source, "g");
    let match: RegExpExecArray | null;
    while ((match = regex.exec(text)) !== null) {
      if (!match[1]) continue;
      // Check for overlaps with higher-priority matches only
      // Lower-priority matches that overlap with higher-priority ones are skipped
      const overlaps = matches.some(
        (m) =>
          (match!.index >= m.index && match!.index < m.index + m.length) ||
          (m.index >= match!.index && m.index < match!.index + match![0].length)
      );
      if (!overlaps) {
        matches.push({
          index: match.index,
          length: match[0].length,
          tag: pattern.tag,
          content: match[1],
        });
      }
    }
  }

  // Sort by index
  matches.sort((a, b) => a.index - b.index);

  // Build DOM
  if (matches.length > 0) {
    // We have matches - process them
    for (const match of matches) {
      // Add text before
      if (match.index > lastIndex) {
        const textBefore = text.slice(lastIndex, match.index);
        if (textBefore) {
          container.appendChild(document.createTextNode(textBefore));
        }
      }

      // Add markdown element
      const element = document.createElement(match.tag);
      if (match.tag === "code") {
        element.style.cssText = `
          background: #f3f4f6;
          padding: 0.125rem 0.375rem;
          border-radius: 4px;
          font-family: monospace;
          font-size: 0.875em;
          color: #1f2937;
        `;
      } else {
        element.style.cssText = "color: #1f2937;";
      }
      element.textContent = match.content;
      container.appendChild(element);

      lastIndex = match.index + match.length;
    }

    // Add remaining text after last match
    if (lastIndex < text.length) {
      const textAfter = text.slice(lastIndex);
      if (textAfter) {
        container.appendChild(document.createTextNode(textAfter));
      }
    }
  } else {
    // No matches - just add the text as-is
    container.appendChild(document.createTextNode(text));
  }
}

export interface ModalResult {
  passed: boolean;
  score: number;
  verificationToken?: string;
}

export function createModal(
  onClose: (result: ModalResult | null) => void
): HTMLElement {
  const modal = document.createElement("div");
  modal.className = "reqcheck-modal";
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
  `;

  // Prevent backdrop clicks from closing modal
  modal.onclick = (e) => {
    if (e.target === modal) {
      e.stopPropagation();
    }
  };

  const content = document.createElement("div");
  content.style.cssText = `
    background: white;
    border-radius: 12px;
    max-width: 700px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    position: relative;
  `;

  // Prevent clicks inside content from bubbling to modal
  content.onclick = (e) => {
    e.stopPropagation();
  };

  // Close button (X icon)
  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.setAttribute("aria-label", "Close");
  closeBtn.style.cssText = `
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: transparent;
    border: none;
    font-size: 2rem;
    color: #6b7280;
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.2s;
    z-index: 1;
    line-height: 1;
  `;
  closeBtn.onmouseenter = () => {
    closeBtn.style.background = "#f3f4f6";
    closeBtn.style.color = "#1f2937";
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.background = "transparent";
    closeBtn.style.color = "#6b7280";
  };
  closeBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose(null); // Abandoned
  };

  content.appendChild(closeBtn);
  modal.appendChild(content);

  return modal;
}

export function showEmailStep(
  modalContent: HTMLElement,
  onEmailSubmit: (email: string) => void
): void {
  modalContent.innerHTML = "";

  const container = document.createElement("div");
  container.style.cssText = `
    padding: 3rem 2rem;
  `;

  const title = document.createElement("h2");
  title.textContent = "Enter Your Email";
  title.style.cssText = `
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
    font-weight: 600;
    color: #1f2937;
    text-align: center;
  `;

  const description = document.createElement("p");
  description.textContent =
    "We'll use this to track your verification progress.";
  description.style.cssText = `
    margin: 0 0 2rem 0;
    color: #6b7280;
    text-align: center;
    font-size: 0.875rem;
  `;

  const form = document.createElement("form");
  form.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
  `;
  form.onsubmit = (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();
    if (email && email.includes("@")) {
      onEmailSubmit(email);
    }
  };

  const emailInput = document.createElement("input");
  emailInput.type = "email";
  emailInput.placeholder = "candidate@example.com";
  emailInput.required = true;
  emailInput.style.cssText = `
    padding: 0.75rem;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.2s;
    background: white;
    color: #1f2937;
  `;
  emailInput.onfocus = () => {
    emailInput.style.borderColor = "#000000";
  };
  emailInput.onblur = () => {
    emailInput.style.borderColor = "#d1d5db";
  };

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.textContent = "Continue";
  submitBtn.style.cssText = `
    padding: 0.75rem;
    background: #000000;
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: background 0.2s;
  `;
  submitBtn.onmouseenter = () => {
    submitBtn.style.background = "#1f2937";
  };
  submitBtn.onmouseleave = () => {
    submitBtn.style.background = "#000000";
  };

  form.appendChild(emailInput);
  form.appendChild(submitBtn);

  container.appendChild(title);
  container.appendChild(description);
  container.appendChild(form);
  modalContent.appendChild(container);
}

/**
 * Show results step after quiz completion
 */
export function showResultsStep(
  modalContent: HTMLElement,
  passed: boolean,
  score: number,
  passThreshold: number,
  onClose: () => void
): void {
  modalContent.innerHTML = "";

  const container = document.createElement("div");
  container.style.cssText = `
    padding: 3rem 2rem;
    text-align: center;
  `;

  // Result icon/emoji
  const icon = document.createElement("div");
  icon.style.cssText = `
    font-size: 4rem;
    margin-bottom: 1.5rem;
  `;
  icon.textContent = passed ? "✓" : "✗";
  container.appendChild(icon);

  // Result title
  const title = document.createElement("h2");
  title.style.cssText = `
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: ${passed ? "#059669" : "#dc2626"};
  `;
  title.textContent = passed ? "Verification Passed!" : "Verification Failed";
  container.appendChild(title);

  // Score information
  const scoreText = document.createElement("p");
  scoreText.style.cssText = `
    font-size: 1.125rem;
    color: #6b7280;
    margin: 0 0 0.5rem 0;
  `;
  scoreText.textContent = `Score: ${score}%`;
  container.appendChild(scoreText);

  const thresholdText = document.createElement("p");
  thresholdText.style.cssText = `
    font-size: 0.875rem;
    color: #9ca3af;
    margin: 0 0 2rem 0;
  `;
  thresholdText.textContent = `Required: ${passThreshold}%`;
  container.appendChild(thresholdText);

  // Close button
  const closeBtn = document.createElement("button");
  closeBtn.textContent = passed ? "Continue" : "Close";
  closeBtn.style.cssText = `
    background: ${passed ? "#059669" : "#dc2626"};
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  `;
  closeBtn.onmouseenter = () => {
    closeBtn.style.opacity = "0.9";
    closeBtn.style.transform = "scale(1.02)";
  };
  closeBtn.onmouseleave = () => {
    closeBtn.style.opacity = "1";
    closeBtn.style.transform = "scale(1)";
  };
  closeBtn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClose();
  };
  container.appendChild(closeBtn);

  modalContent.appendChild(container);
}

export function showQuizStep(
  modalContent: HTMLElement,
  questions: QuizQuestion[],
  passThreshold: number,
  sessionToken: string,
  attemptId: string,
  startIndex: number = 0,
  existingAnswers: Array<{
    questionId: string;
    answer: string | string[];
  }> = [],
  onComplete: (result: ModalResult) => void,
  onProgress?: (currentIndex: number) => void
): void {
  let currentIndex = startIndex;
  const answers = [...existingAnswers];
  const quizStartTime = Date.now();

  const renderQuestion = async () => {
    if (currentIndex >= questions.length) {
      // All questions answered - submit
      await submitQuiz();
      return;
    }

    const question = questions[currentIndex];
    const questionNum = currentIndex + 1;
    const totalQuestions = questions.length;

    modalContent.innerHTML = "";

    const container = document.createElement("div");
    container.style.cssText = `
      padding: 2rem;
    `;

    // Skill name badge (if available)
    if (question.skillName) {
      const skillBadge = document.createElement("div");
      skillBadge.style.cssText = `
        display: inline-block;
        padding: 0.375rem 0.75rem;
        background: #f3f4f6;
        border-radius: 6px;
        font-size: 0.875rem;
        font-weight: 500;
        color: #6b7280;
        margin-bottom: 1rem;
      `;
      skillBadge.textContent = question.skillName;
      container.appendChild(skillBadge);
    }

    // Progress indicator
    const progress = document.createElement("div");
    progress.style.cssText = `
      margin-bottom: 1.5rem;
    `;
    const progressBar = document.createElement("div");
    progressBar.style.cssText = `
      height: 4px;
      background: #e5e7eb;
      border-radius: 2px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    `;
    const progressFill = document.createElement("div");
    progressFill.style.cssText = `
      height: 100%;
      background: #000000;
      width: ${((currentIndex + 1) / totalQuestions) * 100}%;
      transition: width 0.3s;
    `;
    progressBar.appendChild(progressFill);
    const progressText = document.createElement("div");
    progressText.textContent = `Question ${questionNum} of ${totalQuestions}`;
    progressText.style.cssText = `
      font-size: 0.875rem;
      color: #6b7280;
      text-align: center;
    `;
    progress.appendChild(progressBar);
    progress.appendChild(progressText);

    // Question
    const questionDiv = document.createElement("div");
    questionDiv.style.cssText = `
      margin-bottom: 2rem;
    `;

    const promptContainer = document.createElement("div");
    promptContainer.style.cssText = `
      margin: 0 0 1.5rem 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: #1f2937;
    `;
    const markdownContent = renderMarkdown(question.prompt);
    promptContainer.appendChild(markdownContent);
    questionDiv.appendChild(promptContainer);

    // Question content based on type
    if (question.type === "multiple_choice") {
      // Use options from stored question (already randomized and persisted)
      const options = question.config.options || [];
      const existingAnswer = answers.find((a) => a.questionId === question.id);

      // Store all labels to update styles together
      const allLabels: HTMLElement[] = [];

      options.forEach((option: string) => {
        const label = document.createElement("label");
        const isSelected = existingAnswer && existingAnswer.answer === option;

        label.style.cssText = `
          display: block;
          padding: 1rem;
          margin: 0.5rem 0;
          border: 2px solid ${isSelected ? "#000000" : "#e5e7eb"};
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          color: #1f2937;
          background: ${isSelected ? "#f9fafb" : "transparent"};
        `;

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = `question-${question.id}`;
        radio.value = option;
        if (isSelected) {
          radio.checked = true;
        }

        radio.onchange = () => {
          // Reset all labels for this question
          allLabels.forEach((l) => {
            l.style.borderColor = "#e5e7eb";
            l.style.background = "transparent";
          });
          // Highlight selected label
          label.style.borderColor = "#000000";
          label.style.background = "#f9fafb";
        };

        label.setAttribute("for", `question-${question.id}-${option}`);
        radio.id = `question-${question.id}-${option}`;
        label.appendChild(radio);
        label.appendChild(document.createTextNode(` ${option}`));

        allLabels.push(label);
        questionDiv.appendChild(label);
      });
    } else if (question.type === "fill_blank_blocks") {
      const config = question.config as any;
      const segments = config.segments || [];

      // Use shuffled options from stored question (already randomized and persisted)
      // Fallback to generating from correctAnswer/extraBlanks if not present (for backwards compatibility)
      const shuffledOptions = config.shuffledOptions || [
        ...(config.correctAnswer || []),
        ...(config.extraBlanks || []),
      ];

      // Get existing answer (array of strings in order of blanks)
      const existingAnswer = answers.find((a) => a.questionId === question.id);
      let currentAnswers: (string | null)[] = [];

      if (existingAnswer && Array.isArray(existingAnswer.answer)) {
        // Restore existing answers
        currentAnswers = [...existingAnswer.answer];
      }

      // Count blanks and ensure answer array matches blank count
      const blankCount = segments.filter((s: any) => s.type === "blank").length;
      // Pad or trim to match blank count
      while (currentAnswers.length < blankCount) {
        currentAnswers.push(null);
      }
      currentAnswers = currentAnswers.slice(0, blankCount);

      // Options pool will be calculated dynamically in updateFillBlankUI

      // Create code block container
      const codeBlock = document.createElement("div");
      codeBlock.style.cssText = `
        background: #f3f4f6;
        border: 1px solid #e5e7eb;
        border-radius: 8px;
        padding: 1rem;
        margin-bottom: 1.5rem;
        overflow-x: auto;
      `;

      const pre = document.createElement("pre");
      pre.style.cssText = `
        margin: 0;
        font-family: monospace;
        font-size: 0.875rem;
        white-space: pre;
        color: #1f2937;
        line-height: 1.6;
      `;

      const code = document.createElement("code");
      let blankIndex = 0;

      segments.forEach((segment: any, segIndex: number) => {
        if (segment.type === "text") {
          const span = document.createElement("span");
          span.textContent = segment.text;
          code.appendChild(span);
        } else if (segment.type === "blank") {
          const blankSpan = document.createElement("span");
          const currentBlankIndex = blankIndex++;
          const filledValue = currentAnswers[currentBlankIndex];

          if (filledValue) {
            // Filled blank - fit to content
            blankSpan.style.cssText = `
              display: inline-block;
              width: min-content;
              min-width: 60px;
              height: 24px;
              margin: 0 4px;
              padding: 2px 8px;
              border: 2px solid #000000;
              border-radius: 4px;
              background: #ffffff;
              cursor: pointer;
              transition: all 0.2s;
              vertical-align: middle;
              line-height: 20px;
              font-size: 0.875rem;
              color: #1f2937;
              white-space: nowrap;
            `;
            blankSpan.textContent = filledValue;
          } else {
            // Empty blank - fixed width
            blankSpan.style.cssText = `
              display: inline-block;
              width: 80px;
              height: 24px;
              margin: 0 4px;
              padding: 2px 8px;
              border: 2px dashed #9ca3af;
              border-radius: 4px;
              background: #f9fafb;
              cursor: pointer;
              transition: all 0.2s;
              vertical-align: middle;
              line-height: 20px;
              font-size: 0.875rem;
              color: #9ca3af;
            `;
            blankSpan.textContent = "____";
          }

          // Click on blank to remove it
          blankSpan.onclick = () => {
            if (filledValue) {
              // Return to pool
              currentAnswers[currentBlankIndex] = null;
              // Update UI
              updateFillBlankUI();
            }
          };

          blankSpan.onmouseenter = () => {
            if (filledValue) {
              blankSpan.style.background = "#fee2e2";
              blankSpan.style.borderColor = "#dc2626";
            }
          };

          blankSpan.onmouseleave = () => {
            if (filledValue) {
              blankSpan.style.background = "#ffffff";
              blankSpan.style.borderColor = "#000000";
            }
          };

          code.appendChild(blankSpan);
        } else if (segment.type === "newline") {
          code.appendChild(document.createElement("br"));
        } else if (segment.type === "tab") {
          const tab = document.createElement("span");
          tab.textContent = "\t";
          code.appendChild(tab);
        }
      });

      pre.appendChild(code);
      codeBlock.appendChild(pre);
      questionDiv.appendChild(codeBlock);

      // Options pool
      const optionsLabel = document.createElement("p");
      optionsLabel.textContent = "Click an option to fill the earliest blank:";
      optionsLabel.style.cssText = `
        margin: 0 0 0.75rem 0;
        font-size: 0.875rem;
        font-weight: 500;
        color: #1f2937;
      `;
      questionDiv.appendChild(optionsLabel);

      const optionsContainer = document.createElement("div");
      optionsContainer.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      `;

      const updateFillBlankUI = () => {
        // Recalculate used counts
        const currentUsedCounts = new Map<string, number>();
        currentAnswers.forEach((answer) => {
          if (answer !== null) {
            currentUsedCounts.set(
              answer,
              (currentUsedCounts.get(answer) || 0) + 1
            );
          }
        });

        // Recalculate available options
        const currentOptionCounts = new Map<string, number>();
        shuffledOptions.forEach((opt: string) => {
          currentOptionCounts.set(opt, (currentOptionCounts.get(opt) || 0) + 1);
        });

        const currentAvailableOptions = shuffledOptions.filter(
          (opt: string) => {
            const used = currentUsedCounts.get(opt) || 0;
            const total = currentOptionCounts.get(opt) || 0;
            return used < total;
          }
        );

        // Clear and rebuild code block
        code.innerHTML = "";
        blankIndex = 0;

        segments.forEach((segment: any) => {
          if (segment.type === "text") {
            const span = document.createElement("span");
            span.textContent = segment.text;
            code.appendChild(span);
          } else if (segment.type === "blank") {
            const blankSpan = document.createElement("span");
            const currentBlankIndex = blankIndex++;
            const filledValue = currentAnswers[currentBlankIndex];

            if (filledValue) {
              // Filled blank - fit to content
              blankSpan.style.cssText = `
                display: inline-block;
                width: min-content;
                min-width: 60px;
                height: 24px;
                margin: 0 4px;
                padding: 2px 8px;
                border: 2px solid #000000;
                border-radius: 4px;
                background: #ffffff;
                cursor: pointer;
                transition: all 0.2s;
                vertical-align: middle;
                line-height: 20px;
                font-size: 0.875rem;
                color: #1f2937;
                white-space: nowrap;
              `;
              blankSpan.textContent = filledValue;
            } else {
              // Empty blank - fixed width
              blankSpan.style.cssText = `
                display: inline-block;
                width: 80px;
                height: 24px;
                margin: 0 4px;
                padding: 2px 8px;
                border: 2px dashed #9ca3af;
                border-radius: 4px;
                background: #f9fafb;
                cursor: pointer;
                transition: all 0.2s;
                vertical-align: middle;
                line-height: 20px;
                font-size: 0.875rem;
                color: #9ca3af;
              `;
              blankSpan.textContent = "____";
            }

            blankSpan.onclick = () => {
              if (filledValue) {
                currentAnswers[currentBlankIndex] = null;
                updateFillBlankUI();
              }
            };

            blankSpan.onmouseenter = () => {
              if (filledValue) {
                blankSpan.style.background = "#fee2e2";
                blankSpan.style.borderColor = "#dc2626";
              }
            };

            blankSpan.onmouseleave = () => {
              if (filledValue) {
                blankSpan.style.background = "#ffffff";
                blankSpan.style.borderColor = "#000000";
              }
            };

            code.appendChild(blankSpan);
          } else if (segment.type === "newline") {
            code.appendChild(document.createElement("br"));
          } else if (segment.type === "tab") {
            const tab = document.createElement("span");
            tab.textContent = "\t";
            code.appendChild(tab);
          }
        });

        // Update options pool
        optionsContainer.innerHTML = "";
        currentAvailableOptions.forEach((option: string) => {
          const optionBtn = document.createElement("button");
          optionBtn.textContent = option;
          optionBtn.style.cssText = `
            padding: 0.5rem 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            background: white;
            color: #1f2937;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
          `;

          optionBtn.onmouseenter = () => {
            optionBtn.style.background = "#f3f4f6";
            optionBtn.style.borderColor = "#000000";
          };

          optionBtn.onmouseleave = () => {
            optionBtn.style.background = "white";
            optionBtn.style.borderColor = "#d1d5db";
          };

          optionBtn.onclick = () => {
            // Find earliest empty blank
            const firstEmptyIndex = currentAnswers.findIndex((a) => a === null);
            if (firstEmptyIndex !== -1) {
              currentAnswers[firstEmptyIndex] = option;
              updateFillBlankUI();
            }
          };

          optionsContainer.appendChild(optionBtn);
        });
      };

      // Initial render
      updateFillBlankUI();
      questionDiv.appendChild(optionsContainer);

      // Store answer getter for submission
      (questionDiv as any).getAnswer = () => {
        return currentAnswers.filter((a) => a !== null) as string[];
      };
    }

    // Submit button
    const submitBtn = document.createElement("button");
    submitBtn.type = "button";
    submitBtn.textContent =
      currentIndex === questions.length - 1 ? "Submit Quiz" : "Next Question";
    submitBtn.style.cssText = `
      width: 100%;
      padding: 0.75rem;
      background: #000000;
      color: white;
      border: none;
      border-radius: 6px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: background 0.2s;
    `;
    submitBtn.onmouseenter = () => {
      submitBtn.style.background = "#1f2937";
    };
    submitBtn.onmouseleave = () => {
      submitBtn.style.background = "#000000";
    };
    submitBtn.onclick = async () => {
      // Get answer
      let answer: string | string[] = "";

      if (question.type === "multiple_choice") {
        const selected = document.querySelector<HTMLInputElement>(
          `input[name="question-${question.id}"]:checked`
        );
        answer = selected?.value || "";
      } else if (question.type === "fill_blank_blocks") {
        // Get answer from the custom getter
        const getAnswer = (questionDiv as any).getAnswer;
        if (getAnswer) {
          answer = getAnswer();
        } else {
          answer = [];
        }
      }

      // Validate answer based on type
      if (question.type === "fill_blank_blocks") {
        // For fill blank, check if all blanks are filled
        const config = question.config as any;
        const blankCount = (config.segments || []).filter(
          (s: any) => s.type === "blank"
        ).length;
        if (!Array.isArray(answer) || answer.length < blankCount) {
          alert(`Please fill all ${blankCount} blanks`);
          return;
        }
      } else if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        alert("Please provide an answer");
        return;
      }

      // Update answers array
      const existingIndex = answers.findIndex(
        (a) => a.questionId === question.id
      );
      if (existingIndex >= 0) {
        answers[existingIndex] = { questionId: question.id, answer };
      } else {
        answers.push({ questionId: question.id, answer });
      }

      // Check if this is the last question
      if (currentIndex === questions.length - 1) {
        // Last question - submit quiz
        await submitQuiz();
      } else {
        // Save progress and move to next question
        try {
          await saveProgress(sessionToken, attemptId, question.id, answer);
          currentIndex++;
          if (onProgress) {
            onProgress(currentIndex);
          }
          await renderQuestion();
        } catch (error: any) {
          alert(`Error saving progress: ${error.message}`);
        }
      }
    };

    container.appendChild(progress);
    container.appendChild(questionDiv);
    container.appendChild(submitBtn);
    modalContent.appendChild(container);
  };

  const submitQuiz = async () => {
    try {
      // Get all answers for final submission (in order matching questions)
      const finalAnswers = questions.map((q) => {
        const answer = answers.find((a) => a.questionId === q.id);
        // For fill_blank_blocks, ensure answer is an array
        const answerValue =
          answer?.answer || (q.type === "fill_blank_blocks" ? [] : "");
        return {
          questionId: q.id,
          answer: answerValue,
        };
      });

      const timeTakenSeconds = Math.floor((Date.now() - quizStartTime) / 1000);

      const result = await submitAttempt(
        sessionToken,
        attemptId,
        finalAnswers,
        timeTakenSeconds
      );

      // Show results step instead of immediately calling onComplete
      showResultsStep(
        modalContent,
        result.passed,
        result.score,
        passThreshold,
        () => {
          onComplete({
            passed: result.passed,
            score: result.score,
            verificationToken: result.verificationToken || undefined,
          });
        }
      );
    } catch (error: any) {
      alert(`Error submitting quiz: ${error.message}`);
    }
  };

  renderQuestion();
}
