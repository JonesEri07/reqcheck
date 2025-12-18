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
import { updateChallengeQuestion } from "@/app/app/skills/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { MultipleChoiceForm } from "../../create/_components/multiple-choice-form";
import { FillBlankEditor } from "../../create/_components/fill-blank-editor";
import { ChallengeImageUpload } from "../../create/_components/challenge-image-upload";
import { ChallengeQuestionPreview } from "@/components/challenge-question-preview";
import { TagSelector, type Tag } from "@/components/tag-selector";
import { MarkdownHelpDialog } from "@/components/markdown-help-dialog";
import type {
  MultipleChoiceQuestion,
  FillBlankBlocksQuestion,
} from "@/challenge-question-types";
import type { QuestionWithTags } from "@/lib/skills/queries";
import {
  isMultipleChoiceConfig,
  isFillBlankBlocksConfig,
} from "@/challenge-question-types";

interface EditChallengeFormProps {
  question: QuestionWithTags;
  skillId: string;
  skillName: string;
  skillIconSvg?: string | null;
  availableTags: Tag[];
  defaultTimeLimitSeconds: number;
}

export function EditChallengeForm({
  question,
  skillId,
  skillName,
  skillIconSvg,
  availableTags: initialAvailableTags,
  defaultTimeLimitSeconds,
}: EditChallengeFormProps) {
  const router = useRouter();
  const [questionType, setQuestionType] = useState<
    "multiple_choice" | "fill_blank_blocks"
  >(question.type as "multiple_choice" | "fill_blank_blocks");

  // Initialize form state from question
  const [prompt, setPrompt] = useState(question.prompt || "");
  const [multipleChoiceConfig, setMultipleChoiceConfig] =
    useState<MultipleChoiceQuestion>(
      isMultipleChoiceConfig(question.config)
        ? (question.config as MultipleChoiceQuestion)
        : { options: [], correctAnswer: "" }
    );
  const [fillBlankConfig, setFillBlankConfig] =
    useState<FillBlankBlocksQuestion>(
      isFillBlankBlocksConfig(question.config)
        ? (question.config as FillBlankBlocksQuestion)
        : {
            templateSource: "",
            segments: [],
            extraBlanks: [],
            blocks: [],
            correctAnswer: [],
          }
    );
  const [imageUrl, setImageUrl] = useState<string | null>(
    question.imageUrl || null
  );
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageAltText, setImageAltText] = useState<string | null>(
    question.imageAltText || null
  );
  const [timeLimitSeconds, setTimeLimitSeconds] = useState<number | null>(
    question.timeLimitSeconds
  );
  const [selectedTags, setSelectedTags] = useState<Tag[]>(question.tags || []);
  const [availableTags, setAvailableTags] =
    useState<Tag[]>(initialAvailableTags);

  const [state, formAction, pending] = useActionState(updateChallengeQuestion, {
    error: "",
    fieldErrors: {},
  } as any);

  useToastAction(state as any);

  // Debug: Log state changes to help diagnose issues
  useEffect(() => {
    console.log("Form state changed:", {
      hasError: !!(state as any)?.error,
      error: (state as any)?.error,
      hasFieldErrors: !!(state as any)?.fieldErrors,
      fieldErrors: (state as any)?.fieldErrors,
      hasSuccess: !!(state as any)?.success,
      success: (state as any)?.success,
      pending,
      questionId: question.id,
    });
  }, [state, pending, question.id]);

  // Sync form state when question prop changes (e.g., after duplication)
  useEffect(() => {
    setPrompt(question.prompt || "");
    setQuestionType(question.type as "multiple_choice" | "fill_blank_blocks");
    if (isMultipleChoiceConfig(question.config)) {
      setMultipleChoiceConfig(question.config as MultipleChoiceQuestion);
    } else if (isFillBlankBlocksConfig(question.config)) {
      setFillBlankConfig(question.config as FillBlankBlocksQuestion);
    }
    setImageUrl(question.imageUrl || null);
    setImageFile(null); // Reset image file when question changes
    setImageAltText(question.imageAltText || null);
    setTimeLimitSeconds(question.timeLimitSeconds);
    setSelectedTags(question.tags || []);
  }, [
    question.id,
    question.prompt,
    question.type,
    question.config,
    question.imageUrl,
    question.imageAltText,
    question.timeLimitSeconds,
    question.tags,
  ]);

  // Refresh available tags when a new tag is created
  const handleTagCreated = async (newTag: Tag) => {
    setAvailableTags((prev) => {
      if (!prev.some((t) => t.id === newTag.id)) {
        return [...prev, newTag];
      }
      return prev;
    });
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
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setPreviewImageUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewImageUrl(null);
    }
  }, [imageFile]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate that we have a valid question ID
    if (!question.id) {
      console.error("Cannot submit: question.id is missing");
      return;
    }

    // Validate that we have a valid prompt
    if (!prompt || prompt.trim().length === 0) {
      console.error("Cannot submit: prompt is empty");
      return;
    }

    const formData = new FormData();
    formData.append("id", question.id);
    formData.append("skillId", skillId);
    formData.append("type", questionType);
    formData.append("prompt", prompt.trim());

    // Add config based on type
    let configToSend: MultipleChoiceQuestion | FillBlankBlocksQuestion;
    if (questionType === "multiple_choice") {
      configToSend = multipleChoiceConfig;
      // Validate multiple choice config
      if (!configToSend.options || configToSend.options.length < 2) {
        console.error(
          "Cannot submit: multiple choice needs at least 2 options"
        );
        return;
      }
      if (!configToSend.correctAnswer) {
        console.error("Cannot submit: multiple choice needs a correct answer");
        return;
      }
    } else {
      configToSend = fillBlankConfig;
      // Validate fill blank config
      if (
        !configToSend.templateSource ||
        configToSend.templateSource.trim().length === 0
      ) {
        console.error("Cannot submit: fill blank needs template source");
        return;
      }
    }

    // Validate config before sending
    const configString = JSON.stringify(configToSend);
    formData.append("config", configString);

    // Pass image file directly (will be uploaded after question is saved)
    if (imageFile) {
      formData.append("imageFile", imageFile);
    } else if (imageUrl) {
      // If no new file but imageUrl exists, preserve it
      formData.append("imageUrl", imageUrl);
    }
    if (imageAltText !== null && imageAltText !== undefined) {
      formData.append("imageAltText", imageAltText);
    }
    // Append timeLimitSeconds if it's explicitly set (including 0 for no limit)
    // null means use team default, so we don't append it
    if (timeLimitSeconds !== null) {
      formData.append("timeLimitSeconds", timeLimitSeconds.toString());
    }

    // Always send tag IDs (even if empty array) so server knows to update tags
    formData.append(
      "tagIds",
      JSON.stringify(selectedTags.map((tag) => tag.id))
    );

    startTransition(() => {
      formAction(formData);
    });
  };

  // Handle success redirect
  useEffect(() => {
    if ((state as any)?.success) {
      startTransition(() => {
        router.refresh();
      });
    }
  }, [(state as any)?.success, router]);

  const currentConfig =
    questionType === "multiple_choice" ? multipleChoiceConfig : fillBlankConfig;

  const fieldErrors = (state as any)?.fieldErrors || {};

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
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Question Details</CardTitle>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={pending}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={pending}>
                  {pending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Question Type */}
              <div className="space-y-2">
                <Label>Question Type</Label>
                <Select
                  value={questionType}
                  onValueChange={(value) =>
                    setQuestionType(
                      value as "multiple_choice" | "fill_blank_blocks"
                    )
                  }
                  disabled
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
                <p className="text-xs text-muted-foreground">
                  Question type cannot be changed after creation
                </p>
                {fieldErrors.type && (
                  <p className="flex items-center gap-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4 animate-pulse" />
                    {fieldErrors.type}
                  </p>
                )}
              </div>

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
                questionId={question.id}
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
