"use client";

import { useState, useActionState, startTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { createChallengeQuestion } from "@/app/app/skills/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { MultipleChoiceForm } from "./multiple-choice-form";
import { FillBlankEditor } from "./fill-blank-editor";
import { ChallengeImageUpload } from "./challenge-image-upload";
import { ChallengeQuestionPreview } from "@/components/challenge-question-preview";
import { TagSelector, type Tag } from "@/components/tag-selector";
import { getTeamTags } from "@/lib/tags/queries";
import { MarkdownHelpDialog } from "@/components/markdown-help-dialog";
import type {
  MultipleChoiceQuestion,
  FillBlankBlocksQuestion,
} from "@/challenge-question-types";

interface CreateChallengeFormProps {
  skillId: string;
  skillName: string;
  skillIconSvg?: string | null;
  availableTags: Tag[];
  defaultTimeLimitSeconds: number;
}

export function CreateChallengeForm({
  skillId,
  skillName,
  skillIconSvg,
  availableTags: initialAvailableTags,
  defaultTimeLimitSeconds,
}: CreateChallengeFormProps) {
  const router = useRouter();
  const [questionType, setQuestionType] = useState<
    "multiple_choice" | "fill_blank_blocks"
  >("multiple_choice");
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAltText, setImageAltText] = useState<string | null>(null);
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number | null>(null);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [availableTags, setAvailableTags] =
    useState<Tag[]>(initialAvailableTags);

  // Refresh available tags when a new tag is created
  const handleTagCreated = async (newTag: Tag) => {
    // Add the new tag to available tags optimistically
    setAvailableTags((prev) => {
      if (!prev.some((t) => t.id === newTag.id)) {
        return [...prev, newTag];
      }
      return prev;
    });
    // Also refresh from server to get full tag data
    try {
      const response = await fetch("/api/tags");
      if (response.ok) {
        const tags = await response.json();
        setAvailableTags(tags);
      }
    } catch (error) {
      console.error("Failed to refresh tags:", error);
    }
  };

  // Create preview URL from staged file
  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewImageUrl(url);
      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewImageUrl(null);
    }
  }, [imageFile]);

  // Multiple choice state
  const [multipleChoiceConfig, setMultipleChoiceConfig] =
    useState<MultipleChoiceQuestion>({
      options: [],
      correctAnswer: "",
    });

  // Fill blank state
  const [fillBlankConfig, setFillBlankConfig] =
    useState<FillBlankBlocksQuestion>({
      templateSource: "",
      segments: [],
      extraBlanks: [],
      blocks: [],
      correctAnswer: [],
    });

  const [state, formAction, pending] = useActionState(createChallengeQuestion, {
    error: "",
    fieldErrors: {},
  });

  useToastAction(state);

  // Extract field errors and normalize nested paths
  const rawFieldErrors = state?.fieldErrors || {};
  const fieldErrors: Record<string, string> = {};

  // Normalize field errors - handle nested paths like "config.options" -> "config"
  Object.entries(rawFieldErrors).forEach(([path, message]) => {
    // If it's a nested path starting with "config", use "config" as the key
    if (path.startsWith("config.")) {
      fieldErrors.config = message;
    } else {
      fieldErrors[path] = message;
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("skillId", skillId);
    formData.append("type", questionType);
    formData.append("prompt", prompt);

    if (questionType === "multiple_choice") {
      formData.append(
        "config",
        JSON.stringify({
          options: multipleChoiceConfig.options,
          correctAnswer: multipleChoiceConfig.correctAnswer,
        })
      );
    } else {
      formData.append("config", JSON.stringify(fillBlankConfig));
    }

    // Pass image file directly (will be uploaded after question is saved)
    if (imageFile) {
      formData.append("imageFile", imageFile);
    }
    if (imageAltText) {
      formData.append("imageAltText", imageAltText);
    }
    // Append timeLimitSeconds if it's explicitly set (including 0 for no limit)
    // null means use team default, so we don't append it
    if (timeLimitSeconds !== null) {
      formData.append("timeLimitSeconds", timeLimitSeconds.toString());
    }

    // Add selected tag IDs
    if (selectedTags.length > 0) {
      formData.append(
        "tagIds",
        JSON.stringify(selectedTags.map((tag) => tag.id))
      );
    }

    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle success redirect
  useEffect(() => {
    if ((state as any)?.success) {
      startTransition(() => {
        router.push(`/app/skills/${skillId}`);
        router.refresh();
      });
    }
  }, [(state as any)?.success, router, skillId]);

  const currentConfig =
    questionType === "multiple_choice" ? multipleChoiceConfig : fillBlankConfig;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Tags */}
      <TagSelector
        selectedTags={selectedTags}
        availableTags={availableTags}
        onTagsChange={setSelectedTags}
        onCreateTag={handleTagCreated}
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="justify-between flex">
              <CardTitle>Question Details</CardTitle>
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={questionType}
                  onValueChange={(value) =>
                    setQuestionType(
                      value as "multiple_choice" | "fill_blank_blocks"
                    )
                  }
                >
                  <SelectTrigger
                    aria-invalid={!!fieldErrors.type}
                    className={fieldErrors.type ? "border-destructive" : ""}
                  >
                    <SelectValue placeholder="Select question type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">
                      Multiple Choice
                    </SelectItem>
                    <SelectItem value="fill_blank_blocks">
                      Fill in the Blank
                    </SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.type && (
                  <p className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 animate-pulse" />
                    {fieldErrors.type}
                  </p>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <Separator />

              {/* Prompt */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="prompt">Question Prompt *</Label>
                  <MarkdownHelpDialog />
                </div>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Enter your question here..."
                  rows={4}
                  required
                  maxLength={5000}
                  aria-invalid={!!fieldErrors.prompt}
                  className={fieldErrors.prompt ? "border-destructive" : ""}
                />
                <div className="flex items-center justify-between">
                  {fieldErrors.prompt ? (
                    <p className="flex items-center gap-2 text-sm text-destructive">
                      <AlertCircle className="h-4 w-4 animate-pulse" />
                      {fieldErrors.prompt}
                    </p>
                  ) : (
                    <div />
                  )}
                  <p className="text-sm text-muted-foreground">
                    {prompt.length}/5000
                  </p>
                </div>
              </div>

              {/* Question Type Specific Form */}
              {questionType === "multiple_choice" ? (
                <MultipleChoiceForm
                  value={multipleChoiceConfig}
                  onChange={setMultipleChoiceConfig}
                />
              ) : (
                <FillBlankEditor
                  value={fillBlankConfig}
                  onChange={setFillBlankConfig}
                />
              )}
              {fieldErrors.config && (
                <p className="flex items-center gap-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4 animate-pulse" />
                  {fieldErrors.config}
                </p>
              )}

              {/* <Separator /> */}
              <Separator />

              {/* Image Upload */}
              <ChallengeImageUpload
                imageUrl={imageUrl}
                imageFile={imageFile}
                imageAltText={imageAltText}
                onImageChange={setImageUrl}
                onImageFileChange={setImageFile}
                onAltTextChange={setImageAltText}
                skillId={skillId}
              />

              <Separator />

              {/* Time Limit */}
              <div className="space-y-2">
                <Label htmlFor="timeLimit">
                  Time Limit (seconds, optional)
                </Label>
                <Input
                  id="timeLimit"
                  type="number"
                  min="0"
                  value={
                    timeLimitSeconds !== null ? timeLimitSeconds.toString() : ""
                  }
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "") {
                      setTimeLimitSeconds(null);
                    } else {
                      const numValue = parseInt(value, 10);
                      setTimeLimitSeconds(isNaN(numValue) ? null : numValue);
                    }
                  }}
                  placeholder={
                    defaultTimeLimitSeconds === 0
                      ? "No limit (team default)"
                      : `${defaultTimeLimitSeconds} (team default)`
                  }
                  aria-invalid={!!fieldErrors.timeLimitSeconds}
                  className={
                    fieldErrors.timeLimitSeconds ? "border-destructive" : ""
                  }
                />
                {fieldErrors.timeLimitSeconds ? (
                  <p className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 animate-pulse" />
                    {fieldErrors.timeLimitSeconds}
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {timeLimitSeconds === null
                      ? defaultTimeLimitSeconds === 0
                        ? "Using team default: No limit"
                        : `Using team default: ${defaultTimeLimitSeconds} seconds`
                      : timeLimitSeconds === 0
                        ? "No limit (overrides team default)"
                        : `${timeLimitSeconds} seconds (overrides team default)`}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={pending}>
              {pending ? "Creating..." : "Create Challenge Question"}
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {prompt ? (
                <ChallengeQuestionPreview
                  type={questionType}
                  prompt={prompt}
                  config={currentConfig}
                  imageUrl={previewImageUrl || imageUrl}
                  imageAltText={imageAltText}
                  timeLimitSeconds={timeLimitSeconds}
                  skillName={skillName}
                  skillIconSvg={skillIconSvg}
                />
              ) : (
                <p className="text-sm text-muted-foreground text-center py-8">
                  Enter a prompt to see preview
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
