"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView, Decoration, WidgetType } from "@codemirror/view";
import { Extension, StateField } from "@codemirror/state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, X, Code, AlertTriangle } from "lucide-react";
import type {
  FillBlankBlocksQuestion,
  Segment,
} from "@/challenge-question-types";
import { useTheme } from "next-themes";

interface FillBlankEditorProps {
  value: FillBlankBlocksQuestion;
  onChange: (value: FillBlankBlocksQuestion) => void;
  error?: string;
}

interface BlankRange {
  from: number;
  to: number;
  text: string;
}

export function FillBlankEditor({
  value,
  onChange,
  error,
}: FillBlankEditorProps) {
  const { theme } = useTheme();
  const editorRef = useRef<any>(null);
  const [code, setCode] = useState(value.templateSource || "");
  const [selectedRange, setSelectedRange] = useState<BlankRange | null>(null);
  const [blanks, setBlanks] = useState<BlankRange[]>([]);
  const [extraBlanks, setExtraBlanks] = useState<string[]>(
    value.extraBlanks || []
  );
  const [newDistractor, setNewDistractor] = useState("");
  const selectedRangeRef = useRef<BlankRange | null>(null);
  const [showOverlapDialog, setShowOverlapDialog] = useState(false);
  const [overlapMessage, setOverlapMessage] = useState("");
  const [showDistractorDialog, setShowDistractorDialog] = useState(false);
  const [distractorMessage, setDistractorMessage] = useState("");
  const previousCodeRef = useRef<string>("");

  // Parse templateSource to find all existing blank markers and their positions
  const parseExistingBlanks = (templateSource: string): BlankRange[] => {
    const existingBlanks: BlankRange[] = [];
    const blankRegex = /\[\[blank:([^\]]+)\]\]/g;
    let match;

    while ((match = blankRegex.exec(templateSource)) !== null) {
      existingBlanks.push({
        from: match.index,
        to: match.index + match[0].length, // Full length of [[blank:text]]
        text: match[1], // The actual text inside the blank
      });
    }

    return existingBlanks.sort((a, b) => a.from - b.from);
  };

  // Initialize blanks from templateSource
  useEffect(() => {
    if (value.templateSource) {
      const parsedBlanks = parseExistingBlanks(value.templateSource);
      setBlanks(parsedBlanks);
      setCode(value.templateSource);
      previousCodeRef.current = value.templateSource;
    }
  }, [value.templateSource]);

  // Update code when templateSource changes externally
  useEffect(() => {
    if (value.templateSource && value.templateSource !== code) {
      const parsedBlanks = parseExistingBlanks(value.templateSource);
      setBlanks(parsedBlanks);
      setCode(value.templateSource);
    }
  }, [value.templateSource]);

  const handleCodeChange = (newCode: string) => {
    const previousCode = previousCodeRef.current;

    // Check if a `]` was deleted that's part of a blank marker
    // Find all blank markers in previous code
    const blankRegex = /\[\[blank:([^\]]+)\]\]/g;
    const previousBlanks: Array<{ from: number; to: number; text: string }> =
      [];
    let match;
    while ((match = blankRegex.exec(previousCode)) !== null) {
      previousBlanks.push({
        from: match.index,
        to: match.index + match[0].length,
        text: match[1],
      });
    }

    // Check if any blank marker is now broken (missing closing `]]`)
    for (const blank of previousBlanks) {
      const markerText = `[[blank:${blank.text}]]`;
      const expectedEnd = blank.from + markerText.length;

      // Check if the marker at this position is now incomplete
      if (blank.from < newCode.length) {
        const currentAtPosition = newCode.slice(
          blank.from,
          Math.min(expectedEnd, newCode.length)
        );

        // If we have the opening but not the complete closing, remove the entire marker
        if (
          currentAtPosition.startsWith("[[blank:") &&
          !currentAtPosition.endsWith("]]")
        ) {
          // Find where the broken marker actually ends
          // Calculate where the text part should be
          const textStart = blank.from + 8; // Length of "[[blank:"
          const textEnd = textStart + blank.text.length;

          // Find where the broken marker actually ends
          let brokenEnd = textEnd;

          // Check if there's a single `]` remaining (one was deleted, one remains)
          if (brokenEnd < newCode.length && newCode[brokenEnd] === "]") {
            brokenEnd = brokenEnd + 1; // Include the remaining `]`
          }

          // Make sure we don't go beyond the expected marker end
          // The marker should be at most: [[blank:text]] = 8 + text.length + 2
          const maxMarkerEnd = blank.from + 8 + blank.text.length + 2;
          brokenEnd = Math.min(brokenEnd, maxMarkerEnd);

          // Also ensure we don't go beyond the actual code length
          brokenEnd = Math.min(brokenEnd, newCode.length);

          // Replace the broken marker with just the text
          const newCodeFixed =
            newCode.slice(0, blank.from) +
            blank.text +
            newCode.slice(brokenEnd);

          previousCodeRef.current = newCodeFixed;
          setCode(newCodeFixed);
          const parsedBlanks = parseExistingBlanks(newCodeFixed);
          setBlanks(parsedBlanks);
          updateSegments(newCodeFixed, parsedBlanks);
          return;
        }
      }
    }

    previousCodeRef.current = newCode;
    setCode(newCode);
    // Re-parse blanks from updated code
    const parsedBlanks = parseExistingBlanks(newCode);
    setBlanks(parsedBlanks);
    updateSegments(newCode, parsedBlanks);
  };

  const handleUpdate = (viewUpdate: any) => {
    // Only update if selection actually changed to prevent infinite loops
    const selection = viewUpdate.state.selection.main;
    const newFrom = selection.from;
    const newTo = selection.to;

    // Check if selection changed using ref to avoid unnecessary re-renders
    const current = selectedRangeRef.current;
    if (current?.from === newFrom && current?.to === newTo) {
      return; // No change, skip update
    }

    if (newFrom !== newTo) {
      const selectedText = viewUpdate.state.doc.sliceString(newFrom, newTo);
      const newRange = {
        from: newFrom,
        to: newTo,
        text: selectedText,
      };
      selectedRangeRef.current = newRange;
      setSelectedRange(newRange);
    } else {
      selectedRangeRef.current = null;
      setSelectedRange(null);
    }
  };

  // Check if a selection overlaps with any existing blank marker
  const checkOverlap = (
    from: number,
    to: number,
    existingBlanks: BlankRange[]
  ): boolean => {
    return existingBlanks.some(
      (blank) =>
        (from >= blank.from && from < blank.to) ||
        (to > blank.from && to <= blank.to) ||
        (from <= blank.from && to >= blank.to)
    );
  };

  // Check if current selection overlaps with an existing blank
  const isSelectionOverlappingBlank = useMemo(() => {
    if (!selectedRange) return false;
    const existingBlanks = parseExistingBlanks(code);
    return checkOverlap(selectedRange.from, selectedRange.to, existingBlanks);
  }, [selectedRange, code]);

  // Get the blank text if selection overlaps
  const overlappingBlankText = useMemo(() => {
    if (!selectedRange || !isSelectionOverlappingBlank) return null;
    const existingBlanks = parseExistingBlanks(code);
    const overlappingBlank = existingBlanks.find(
      (blank) =>
        (selectedRange.from >= blank.from && selectedRange.from < blank.to) ||
        (selectedRange.to > blank.from && selectedRange.to <= blank.to) ||
        (selectedRange.from <= blank.from && selectedRange.to >= blank.to)
    );
    return overlappingBlank?.text || null;
  }, [selectedRange, code, isSelectionOverlappingBlank]);

  // Check if selected text is empty after trimming
  const isSelectionEmpty = useMemo(() => {
    if (!selectedRange) return true;
    return selectedRange.text.trim() === "";
  }, [selectedRange]);

  const handleMarkAsBlank = () => {
    if (!selectedRange) return;

    // Parse existing blanks from current code
    const existingBlanks = parseExistingBlanks(code);

    // Check if selection overlaps with existing blanks
    if (checkOverlap(selectedRange.from, selectedRange.to, existingBlanks)) {
      setOverlapMessage(
        "This selection overlaps with an existing blank. Please select a different range."
      );
      setShowOverlapDialog(true);
      return;
    }

    // Check if selection is within a blank marker (can't mark blank markers as blanks)
    const selectedText = code.slice(selectedRange.from, selectedRange.to);
    if (selectedText.includes("[[blank:") || selectedText.includes("]]")) {
      setOverlapMessage(
        "Cannot mark blank markers as blanks. Please select regular text."
      );
      setShowOverlapDialog(true);
      return;
    }

    if (!selectedText.trim()) {
      setOverlapMessage("Please select valid text to mark as blank.");
      setShowOverlapDialog(true);
      return;
    }

    // Check character limit for blank text (500 characters)
    const trimmedText = selectedText.trim();
    if (trimmedText.length > 500) {
      setOverlapMessage(
        `Blank text cannot exceed 500 characters. Selected text is ${trimmedText.length} characters.`
      );
      setShowOverlapDialog(true);
      return;
    }

    // Replace selected text with [[blank:text]] marker
    const newCode =
      code.slice(0, selectedRange.from) +
      `[[blank:${selectedText.trim()}]]` +
      code.slice(selectedRange.to);

    setCode(newCode);
    const newBlanks = parseExistingBlanks(newCode);
    setBlanks(newBlanks);
    setSelectedRange(null);
    updateSegments(newCode, newBlanks);
  };

  const handleRemoveBlank = (index: number) => {
    const blankToRemove = blanks[index];
    // Replace [[blank:text]] with just the text
    const newCode =
      code.slice(0, blankToRemove.from) +
      blankToRemove.text +
      code.slice(blankToRemove.to);

    setCode(newCode);
    const newBlanks = parseExistingBlanks(newCode);
    setBlanks(newBlanks);
    updateSegments(newCode, newBlanks);
  };

  const updateSegments = (
    templateSource: string,
    blankRanges: BlankRange[],
    currentExtraBlanks?: string[]
  ) => {
    const blanksToUse = currentExtraBlanks ?? extraBlanks;
    // Reconstruct base source by replacing [[blank:text]] with text
    let baseSource = templateSource;
    const blankRegex = /\[\[blank:([^\]]+)\]\]/g;
    const replacements: Array<{ from: number; to: number; text: string }> = [];

    let match;
    while ((match = blankRegex.exec(templateSource)) !== null) {
      replacements.push({
        from: match.index,
        to: match.index + match[0].length,
        text: match[1],
      });
    }

    // Replace from end to start to preserve positions
    replacements
      .sort((a, b) => b.from - a.from)
      .forEach((replacement) => {
        baseSource =
          baseSource.slice(0, replacement.from) +
          replacement.text +
          baseSource.slice(replacement.to);
      });

    // Parse baseSource into segments
    const segments: Segment[] = [];
    let position = 0;
    const sortedBlanks = [...blankRanges].sort((a, b) => a.from - b.from);

    // Map templateSource positions to baseSource positions
    sortedBlanks.forEach((blank) => {
      // Calculate offset: how many extra characters from previous blanks
      let offset = 0;
      for (const prevBlank of sortedBlanks) {
        if (prevBlank.from < blank.from) {
          const markerLength = `[[blank:${prevBlank.text}]]`.length;
          const textLength = prevBlank.text.length;
          offset += markerLength - textLength;
        }
      }

      const baseFrom = blank.from - offset;

      // Add text before blank
      if (baseFrom > position) {
        const textBefore = baseSource.slice(position, baseFrom);
        if (textBefore) {
          const parts = textBefore.split(/(\n|\t)/);
          parts.forEach((part) => {
            if (part === "\n") {
              segments.push({ type: "newline" });
            } else if (part === "\t") {
              segments.push({ type: "tab" });
            } else if (part) {
              segments.push({ type: "text", text: part });
            }
          });
        }
      }

      // Add blank
      segments.push({
        type: "blank",
        text: blank.text,
      });

      position = baseFrom + blank.text.length;
    });

    // Add remaining text
    if (position < baseSource.length) {
      const remainingText = baseSource.slice(position);
      const parts = remainingText.split(/(\n|\t)/);
      parts.forEach((part) => {
        if (part === "\n") {
          segments.push({ type: "newline" });
        } else if (part === "\t") {
          segments.push({ type: "tab" });
        } else if (part) {
          segments.push({ type: "text", text: part });
        }
      });
    }

    // Generate blocks (all unique answers)
    const correctAnswers = blankRanges.map((b) => b.text);
    const allBlocks = [...new Set([...correctAnswers, ...blanksToUse])];

    onChange({
      templateSource,
      segments,
      extraBlanks: blanksToUse,
      blocks: allBlocks,
      correctAnswer: correctAnswers,
    });
  };

  const handleAddDistractor = () => {
    if (!newDistractor.trim()) return;
    if (extraBlanks.length >= 20) {
      setDistractorMessage(
        "Maximum of 20 distractor options reached. Remove a distractor to add another."
      );
      setShowDistractorDialog(true);
      return;
    }
    const newExtraBlanks = [...extraBlanks, newDistractor.trim()];
    setExtraBlanks(newExtraBlanks);
    setNewDistractor("");
    updateSegments(code, blanks, newExtraBlanks);
  };

  const handleRemoveDistractor = (index: number) => {
    const newExtraBlanks = extraBlanks.filter((_, i) => i !== index);
    setExtraBlanks(newExtraBlanks);
    updateSegments(code, blanks, newExtraBlanks);
  };

  // Create CodeMirror decoration extension to hide [[blank:...]] brackets and highlight text
  const blankDecorations = useMemo(() => {
    const isDark = theme === "dark";
    const highlightColor = isDark ? "#60a5fa" : "#2563eb";
    const highlightBg = isDark
      ? "rgba(59, 130, 246, 0.25)"
      : "rgba(59, 130, 246, 0.15)";

    return StateField.define({
      create() {
        return Decoration.none;
      },
      update(decorations, tr) {
        decorations = decorations.map(tr.changes);

        // Find all [[blank:...]] markers and create decorations
        const newDecorations: any[] = [];
        const blankRegex = /\[\[blank:([^\]]+)\]\]/g;
        const text = tr.state.doc.toString();
        let match;

        while ((match = blankRegex.exec(text)) !== null) {
          const from = match.index;
          const to = match.index + match[0].length;
          const blankText = match[1];

          // Replace the entire [[blank:text]] marker with a highlighted widget showing just the text
          class BlankWidget extends WidgetType {
            constructor(
              private text: string,
              private bg: string,
              private color: string
            ) {
              super();
            }
            toDOM() {
              const span = document.createElement("span");
              span.textContent = this.text;
              span.style.cssText = `background-color: ${this.bg}; color: ${this.color}; border: 1px dashed ${this.color}; padding: 2px 6px; border-radius: 4px; font-weight: 500; display: inline-block;`;
              return span;
            }
            eq(other: WidgetType) {
              return (
                other instanceof BlankWidget &&
                this.text === (other as BlankWidget).text
              );
            }
            ignoreEvent() {
              return false;
            }
          }

          const blankWidget = Decoration.replace({
            widget: new BlankWidget(blankText, highlightBg, highlightColor),
            inclusive: false,
          }).range(from, to);

          newDecorations.push(blankWidget);
        }

        return decorations.update({
          add: newDecorations,
        });
      },
      provide: (f) => EditorView.decorations.from(f),
    });
  }, [theme, code, blanks]);

  // Create custom theme that matches app colors
  const createCustomTheme = (): Extension => {
    const isDark = theme === "dark";

    const colors = isDark
      ? {
          background: "#0a0a0a",
          foreground: "#fafafa",
          muted: "#262626",
          mutedForeground: "#a3a3a3",
          accent: "#27272a",
          ring: "#3b82f6",
          selection: "#3b82f6",
        }
      : {
          background: "#ffffff",
          foreground: "#09090b",
          muted: "#f4f4f5",
          mutedForeground: "#71717a",
          accent: "#f4f4f5",
          ring: "#3b82f6",
          selection: "#3b82f6",
        };

    return EditorView.theme({
      "&": {
        backgroundColor: colors.background,
        color: colors.foreground,
      },
      ".cm-content": {
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily:
          "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, 'Liberation Mono', monospace",
        fontSize: "14px",
        lineHeight: "1.5",
        padding: "12px",
      },
      ".cm-editor": {
        backgroundColor: colors.background,
      },
      ".cm-focused": {
        outline: `2px solid ${colors.ring}`,
        outlineOffset: "-1px",
      },
      ".cm-gutters": {
        backgroundColor: colors.muted,
        color: colors.mutedForeground,
        border: "none",
      },
      ".cm-lineNumbers .cm-gutterElement": {
        color: colors.mutedForeground,
        minWidth: "3ch",
      },
      ".cm-selectionBackground": {
        backgroundColor: `${colors.selection} !important`,
        opacity: "0.5",
      },
      ".cm-selectionMatch": {
        backgroundColor: `${colors.selection} !important`,
        opacity: "0.5",
      },
      ".cm-selection": {
        backgroundColor: `${colors.selection} !important`,
        opacity: "0.5",
      },
      ".cm-cursor": {
        borderLeftColor: colors.foreground,
        borderLeftWidth: "2px",
      },
      ".cm-activeLine": {
        backgroundColor: colors.muted,
      },
      ".cm-activeLineGutter": {
        backgroundColor: colors.muted,
        color: colors.foreground,
      },
    });
  };

  // Combine extensions
  const extensions = useMemo(
    () => [createCustomTheme(), blankDecorations],
    [createCustomTheme, blankDecorations]
  );

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Text Template</Label>
        <p className="text-sm text-muted-foreground">
          Type or paste your text. Select text and click "Mark as Blank" to
          create fill-in-the-blank questions.
        </p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* <Code className="h-4 w-4 text-muted-foreground" /> */}
            <span className="text-sm text-muted-foreground">Blank Editor</span>
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleMarkAsBlank}
            className="gap-2"
            disabled={
              !selectedRange || isSelectionOverlappingBlank || isSelectionEmpty
            }
          >
            Mark as Blank
          </Button>
        </div>

        <div className="border rounded-lg overflow-hidden bg-background">
          <CodeMirror
            value={code}
            height="300px"
            extensions={extensions}
            onChange={handleCodeChange}
            onUpdate={handleUpdate}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              dropCursor: false,
              allowMultipleSelections: false,
            }}
          />
        </div>

        {selectedRange && (
          <div className="space-y-1">
            {isSelectionOverlappingBlank && overlappingBlankText ? (
              <p className="text-sm text-destructive flex items-center gap-2">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  Selected blank: &quot;
                  <span className="font-mono font-semibold">
                    {overlappingBlankText}
                  </span>
                  &quot; - Cannot mark an existing blank as blank
                </span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Selected: &quot;{selectedRange.text}&quot;
              </p>
            )}
          </div>
        )}
      </div>

      {/* Blanks List */}
      {blanks.length > 0 && (
        <div className="space-y-2 pt-4 border-t">
          <Label>Blanks ({blanks.length})</Label>
          <div className="flex flex-wrap gap-2">
            {blanks.map((blank, index) => (
              <Badge key={index} variant="secondary" className="gap-1.5 pr-1">
                <span className="text-muted-foreground">{index + 1}</span>
                <code className="text-sm">{blank.text}</code>
                <button
                  type="button"
                  onClick={() => handleRemoveBlank(index)}
                  className="ml-1 hover:bg-destructive/20 rounded p-0.5"
                  aria-label={`Remove blank ${index + 1}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Distractor Options */}
      <div className="space-y-2 pt-4 border-t">
        <Label>Distractor Options (Optional)</Label>
        <p className="text-sm text-muted-foreground">
          Add incorrect answer options to increase difficulty (maximum 20).
        </p>
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newDistractor}
              onChange={(e) => setNewDistractor(e.target.value)}
              placeholder="Enter distractor option"
              maxLength={500}
              disabled={extraBlanks.length >= 20}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddDistractor();
                }
              }}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleAddDistractor}
              disabled={extraBlanks.length >= 20 || !newDistractor.trim()}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {newDistractor.length}/500
            </p>
            <p className="text-sm text-muted-foreground">
              {extraBlanks.length}/20 distractors
            </p>
          </div>
          {extraBlanks.length >= 20 && (
            <p className="text-sm text-muted-foreground">
              Maximum of 20 distractor options reached. Remove a distractor to
              add another.
            </p>
          )}
        </div>
        {extraBlanks.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {extraBlanks.map((distractor, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {distractor}
                <button
                  type="button"
                  onClick={() => handleRemoveDistractor(index)}
                  className="ml-1 hover:bg-destructive/20 rounded"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {/* Overlap Warning Dialog */}
      <AlertDialog open={showOverlapDialog} onOpenChange={setShowOverlapDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot Mark as Blank</AlertDialogTitle>
            <AlertDialogDescription>{overlapMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowOverlapDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Distractor Error Dialog */}
      <AlertDialog
        open={showDistractorDialog}
        onOpenChange={setShowDistractorDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cannot Add Distractor</AlertDialogTitle>
            <AlertDialogDescription>{distractorMessage}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowDistractorDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
