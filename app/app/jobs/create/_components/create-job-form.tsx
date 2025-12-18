"use client";

import { useState, useEffect, useMemo, startTransition } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { createJob, autoDetectJobSkills } from "@/app/app/jobs/actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { JobSourceBadge } from "@/components/job-source-badge";
import { JobSource } from "@/lib/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Loader2, ChevronDown, Info, X } from "lucide-react";
import type { ActionState } from "@/lib/auth/proxy";
import useSWR from "swr";
import { JobSkillsManager } from "./job-skills-manager";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface CreateJobFormProps {
  teamDefaults: {
    defaultPassThreshold: number;
    defaultQuestionCount: number;
    defaultQuestionTimeLimitSeconds: number;
  };
}

interface JobSkillFormData {
  clientSkillId: string;
  skillName: string;
  weight: number;
  required: boolean;
  manuallyAdded: boolean;
  questionWeights: Array<{
    clientChallengeQuestionId: string;
    questionPrompt: string;
    weight: number;
    timeLimitSeconds: number | null;
    questionTimeLimitSeconds: number | null; // From the question itself
  }>;
}

export function CreateJobForm({ teamDefaults }: CreateJobFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    externalJobId: "",
    title: "",
    description: "",
    passThreshold: null as number | null,
    questionCount: null as number | null,
  });

  const [jobSkills, setJobSkills] = useState<JobSkillFormData[]>([]);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [showAutoDetectInfo, setShowAutoDetectInfo] = useState(false);

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    createJob,
    {}
  );

  useToastAction(state);

  // Fetch available skills
  const { data: availableSkills } = useSWR("/api/skills/client", fetcher);

  // Redirect on success
  useEffect(() => {
    if (state?.success && "jobId" in state) {
      router.push(`/app/jobs/${state.jobId}`);
    }
  }, [state?.success, state, router]);

  const [autoDetectState, setAutoDetectState] = useState<
    ActionState & {
      jobSkills?: any[];
      questionWeights?: any[];
      detectMode?: string;
    }
  >({});

  const [autoDetectActionState, autoDetectAction, isAutoDetectingAction] =
    useActionState<ActionState, FormData>(autoDetectJobSkills, {});

  // Sync autoDetectActionState to autoDetectState, preserving detectMode
  useEffect(() => {
    if (autoDetectActionState && "jobSkills" in autoDetectActionState) {
      setAutoDetectState((prev) => ({
        ...autoDetectActionState,
        detectMode: prev.detectMode, // Preserve the mode
      }));
    }
  }, [autoDetectActionState]);

  useEffect(() => {
    if (autoDetectState?.jobSkills && autoDetectState?.questionWeights) {
      // Transform detected data - fetch question details for each skill
      const transformSkills = async (
        mode: "replace" | "keepManual" | "smart"
      ) => {
        const detectedSkillsWithQuestions = await Promise.all(
          autoDetectState.jobSkills!.map(async (js) => {
            // Fetch questions for this skill
            const questionsResponse = await fetch(
              `/api/skills/${js.clientSkillId}/questions`
            );
            const questions = questionsResponse.ok
              ? await questionsResponse.json()
              : [];

            // Map question weights for this skill
            const questionWeights = questions.map((q: any) => {
              const qw = autoDetectState.questionWeights?.find(
                (qw) =>
                  qw.clientSkillId === js.clientSkillId &&
                  qw.clientChallengeQuestionId === q.id
              );
              return {
                clientChallengeQuestionId: q.id,
                questionPrompt: q.prompt || "",
                weight: qw?.weight || 1.0,
                timeLimitSeconds: null,
                questionTimeLimitSeconds: q.timeLimitSeconds,
                questionType: q.type,
                questionConfig: q.config,
                questionImageUrl: q.imageUrl,
                questionImageAltText: q.imageAltText,
              };
            });

            return {
              clientSkillId: js.clientSkillId,
              skillName: js.skillName,
              weight: js.weight,
              required: js.required,
              manuallyAdded: false, // All detected skills are auto-detected
              questionWeights,
            };
          })
        );

        // Apply mode logic using current jobSkills state
        setJobSkills((currentJobSkills) => {
          if (mode === "replace") {
            // Replace All: Remove all current jobSkills and use detected ones
            return detectedSkillsWithQuestions;
          } else if (mode === "keepManual") {
            // Keep Manual: Clear all non-manually added JobSkills, then add detected ones
            // (skip any detected skill that matches a manually added one)
            const manualSkills = currentJobSkills.filter(
              (js) => js.manuallyAdded
            );
            const manualSkillIds = new Set(
              manualSkills.map((js) => js.clientSkillId)
            );

            // Filter out detected skills that match manual ones (skip them)
            const newDetectedSkills = detectedSkillsWithQuestions.filter(
              (ds) => !manualSkillIds.has(ds.clientSkillId)
            );

            // Return manual skills + new detected skills (auto-detected ones were cleared)
            return [...manualSkills, ...newDetectedSkills];
          } else if (mode === "smart") {
            // Smart: Keep all current JobSkills, add newly discovered ones,
            // ignore already present ones, remove auto-detected ones no longer detected
            const currentSkillIds = new Set(
              currentJobSkills.map((js) => js.clientSkillId)
            );
            const detectedSkillIds = new Set(
              detectedSkillsWithQuestions.map((ds) => ds.clientSkillId)
            );

            // Keep all current skills (both manual and auto-detected)
            // But remove auto-detected skills that are no longer detected
            const skillsToKeep = currentJobSkills.filter((js) => {
              // Always keep manual skills
              if (js.manuallyAdded) return true;
              // Keep auto-detected skills only if they're still detected
              return detectedSkillIds.has(js.clientSkillId);
            });

            // Add newly discovered skills that aren't currently listed
            const newDetectedSkills = detectedSkillsWithQuestions.filter(
              (ds) => !currentSkillIds.has(ds.clientSkillId)
            );

            return [...skillsToKeep, ...newDetectedSkills];
          }
          return currentJobSkills;
        });

        setIsAutoDetecting(false);
        setShowAutoDetectInfo(true); // Show info banner after auto-detect completes
      };

      // Get mode from autoDetectState if stored, default to "replace"
      const mode = autoDetectState.detectMode || "replace";
      transformSkills(mode as "replace" | "keepManual" | "smart");
    }
  }, [autoDetectState]);

  const handleAutoDetect = (mode: "replace" | "keepManual" | "smart") => {
    if (!formData.title) {
      return;
    }
    setIsAutoDetecting(true);
    const formDataForDetect = new FormData();
    formDataForDetect.append("title", formData.title);
    if (formData.description) {
      formDataForDetect.append("description", formData.description);
    }

    // Store mode before triggering action
    setAutoDetectState((prev) => ({ ...prev, detectMode: mode }));

    startTransition(() => {
      autoDetectAction(formDataForDetect);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    // Serialize arrays as JSON strings for FormData
    const jobSkillsForSubmit = jobSkills.map((js) => ({
      clientSkillId: js.clientSkillId,
      weight: js.weight,
      required: js.required,
      manuallyAdded: js.manuallyAdded,
    }));

    const questionWeightsForSubmit: any[] = [];
    jobSkills.forEach((js) => {
      js.questionWeights.forEach((qw) => {
        questionWeightsForSubmit.push({
          clientSkillId: js.clientSkillId,
          clientChallengeQuestionId: qw.clientChallengeQuestionId,
          weight: qw.weight,
          timeLimitSeconds: qw.timeLimitSeconds,
        });
      });
    });

    formDataObj.append("jobSkills", JSON.stringify(jobSkillsForSubmit));
    formDataObj.append(
      "questionWeights",
      JSON.stringify(questionWeightsForSubmit)
    );

    startTransition(() => {
      formAction(formDataObj);
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Job Information */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>Job Information</CardTitle>
              <CardDescription>
                Basic information about the job posting
              </CardDescription>
            </div>
            <JobSourceBadge source={JobSource.MANUAL} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="externalJobId">
              External Job ID <span className="text-destructive">*</span>
            </Label>
            <Input
              id="externalJobId"
              name="externalJobId"
              value={formData.externalJobId}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  externalJobId: e.target.value,
                }))
              }
              required
              placeholder="e.g., JOB-12345"
            />
            <p className="text-sm text-muted-foreground">
              Unique identifier for this job in your external system
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Job Title <span className="text-destructive">*</span>
            </Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
              placeholder="e.g., Senior React Developer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={8}
              placeholder="Enter the full job description..."
              maxLength={50000}
            />
            <p className="text-sm text-muted-foreground">
              {formData.description.length} / 50,000 characters
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="passThreshold">Pass Threshold (%)</Label>
              <Input
                id="passThreshold"
                name="passThreshold"
                type="number"
                min="0"
                max="100"
                value={formData.passThreshold ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    passThreshold: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                placeholder={`Default: ${teamDefaults.defaultPassThreshold}%`}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to use team default (
                {teamDefaults.defaultPassThreshold}%)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="questionCount">Question Count</Label>
              <Input
                id="questionCount"
                name="questionCount"
                type="number"
                min="1"
                value={formData.questionCount ?? ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    questionCount: e.target.value
                      ? parseInt(e.target.value)
                      : null,
                  }))
                }
                placeholder={`Default: ${teamDefaults.defaultQuestionCount}`}
              />
              <p className="text-sm text-muted-foreground">
                Leave empty to use team default (
                {teamDefaults.defaultQuestionCount})
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Job Skills & Question Weights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Skills & Challenge Questions</CardTitle>
              <CardDescription>
                Configure which skills and questions are used for this job
              </CardDescription>
            </div>
            <div className="flex flex-col gap-2 justify-end">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={
                      isAutoDetecting ||
                      isAutoDetectingAction ||
                      !formData.title
                    }
                  >
                    {isAutoDetecting || isAutoDetectingAction ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Detecting...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Auto Detect
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <DropdownMenuItem
                    onClick={() => handleAutoDetect("replace")}
                    disabled={isAutoDetecting || isAutoDetectingAction}
                    className="flex flex-col items-start gap-1"
                  >
                    <span className="font-medium">Replace All</span>
                    <span className="text-xs text-muted-foreground">
                      Replace all skills with detected ones
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAutoDetect("keepManual")}
                    disabled={isAutoDetecting || isAutoDetectingAction}
                    className="flex flex-col items-start gap-1"
                  >
                    <span className="font-medium">
                      Keep Manually Added Skills
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Keep manual skills, add new detected ones
                    </span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleAutoDetect("smart")}
                    disabled={isAutoDetecting || isAutoDetectingAction}
                    className="flex flex-col items-start gap-1"
                  >
                    <span className="font-medium">Smart</span>
                    <span className="text-xs text-muted-foreground">
                      Add new, remove old auto-detected, keep all manual
                    </span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              {showAutoDetectInfo && (
                <div>
                  <span className="text-sm text-muted-foreground">
                    Missing skills? Check your{" "}
                    <Link
                      href="/app/skills"
                      className="text-accent-foreground underline"
                    >
                      library
                    </Link>
                  </span>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <JobSkillsManager
            jobSkills={jobSkills}
            setJobSkills={setJobSkills}
            availableSkills={availableSkills || []}
            defaultQuestionTimeLimitSeconds={
              teamDefaults.defaultQuestionTimeLimitSeconds
            }
          />
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Job"
          )}
        </Button>
      </div>
    </form>
  );
}
