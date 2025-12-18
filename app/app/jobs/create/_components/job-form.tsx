"use client";

import { useState, useEffect, useMemo, startTransition } from "react";
import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useToastAction } from "@/lib/utils/use-toast-action";
import {
  createJob,
  updateJob,
  autoDetectJobSkills,
} from "@/app/app/jobs/actions";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { JobSourceBadge } from "@/components/job-source-badge";
import { JobSource } from "@/lib/db/schema";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sparkles, Loader2, ChevronDown } from "lucide-react";
import type { ActionState } from "@/lib/auth/proxy";
import useSWR from "swr";
import { JobSkillsManager, type JobSkillFormData } from "./job-skills-manager";
import Link from "next/link";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface JobFormProps {
  teamDefaults: {
    defaultPassThreshold: number;
    defaultQuestionCount: number;
    defaultQuestionTimeLimitSeconds: number;
  };
  initialData?: {
    id: string;
    externalJobId: string;
    title: string;
    description: string | null;
    passThreshold: number | null;
    questionCount: number | null;
    source: JobSource;
    jobSkills: Array<{
      jobSkill: {
        id: string;
        clientSkillId: string;
        weight: string;
        required: boolean;
        manuallyAdded: boolean;
      };
      clientSkill: {
        id: string;
        skillName: string;
      };
      questionWeights: Array<{
        clientChallengeQuestionId: string;
        weight: string;
        timeLimitSeconds: number | null;
      }>;
    }>;
  };
  mode?: "create" | "edit";
  onDirtyChange?: (isDirty: boolean) => void;
  onPendingChange?: (pending: boolean) => void;
}

export function JobForm({
  teamDefaults,
  initialData,
  mode = "create",
  onDirtyChange,
  onPendingChange,
}: JobFormProps) {
  const router = useRouter();
  // Parse questionCount from initialData
  const parseQuestionCount = (qc: any) => {
    if (!qc) return { type: "teamDefault" as const };
    if (typeof qc === "object" && qc.type === "skillCount") {
      return {
        type: "skillCount" as const,
        multiplier: qc.multiplier ?? 1.5,
        maxLimit: qc.maxLimit ?? 50,
      };
    }
    if (typeof qc === "object" && qc.type === "fixed") {
      return {
        type: "fixed" as const,
        value: qc.value ?? 5,
      };
    }
    // Legacy: if it's a number, treat as fixed
    if (typeof qc === "number") {
      return {
        type: "fixed" as const,
        value: qc,
      };
    }
    return { type: "teamDefault" as const };
  };

  const initialQuestionCount = parseQuestionCount(initialData?.questionCount);

  const [formData, setFormData] = useState({
    externalJobId: initialData?.externalJobId || "",
    title: initialData?.title || "",
    description: initialData?.description || "",
    passThreshold: initialData?.passThreshold ?? null,
    questionCountType: initialQuestionCount.type,
    questionCountValue:
      initialQuestionCount.type === "fixed" ? initialQuestionCount.value : 5,
    questionCountMultiplier:
      initialQuestionCount.type === "skillCount"
        ? initialQuestionCount.multiplier
        : 1.5,
    questionCountMaxLimit:
      initialQuestionCount.type === "skillCount"
        ? initialQuestionCount.maxLimit
        : 50,
  });

  const [jobSkills, setJobSkills] = useState<JobSkillFormData[]>([]);
  const [isAutoDetecting, setIsAutoDetecting] = useState(false);
  const [showAutoDetectInfo, setShowAutoDetectInfo] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const action = mode === "create" ? createJob : updateJob;
  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    action,
    {}
  );

  useToastAction(state);

  // Fetch available skills
  const { data: availableSkills } = useSWR("/api/skills/client", fetcher);

  // Initialize jobSkills from initialData if in edit mode
  useEffect(() => {
    if (mode === "edit" && initialData) {
      const loadJobSkills = async () => {
        const skillsWithQuestions = await Promise.all(
          initialData.jobSkills.map(async (js) => {
            // Fetch questions for this skill
            const questionsResponse = await fetch(
              `/api/skills/${js.clientSkill.id}/questions`
            );
            const questions = questionsResponse.ok
              ? await questionsResponse.json()
              : [];

            // Map question weights
            const questionWeights = questions.map((q: any) => {
              const qw = js.questionWeights.find(
                (qw) => qw.clientChallengeQuestionId === q.id
              );
              return {
                clientChallengeQuestionId: q.id,
                questionPrompt: q.prompt || "",
                weight: qw ? parseFloat(qw.weight) : 1.0,
                timeLimitSeconds: qw?.timeLimitSeconds ?? null,
                questionTimeLimitSeconds: q.timeLimitSeconds,
                questionType: q.type,
                questionConfig: q.config,
                questionImageUrl: q.imageUrl,
                questionImageAltText: q.imageAltText,
              };
            });

            return {
              clientSkillId: js.clientSkill.id,
              skillName: js.clientSkill.skillName,
              weight: parseFloat(js.jobSkill.weight),
              required: js.jobSkill.required,
              manuallyAdded: js.jobSkill.manuallyAdded,
              questionWeights,
            };
          })
        );
        setJobSkills(skillsWithQuestions);
      };
      loadJobSkills();
    }
  }, [mode, initialData]);

  // Detect dirty state
  useEffect(() => {
    if (mode === "edit" && initialData && jobSkills.length > 0) {
      const currentState = {
        formData,
        jobSkills: JSON.stringify(
          jobSkills.map((js) => ({
            clientSkillId: js.clientSkillId,
            weight: js.weight,
            required: js.required,
            manuallyAdded: js.manuallyAdded,
            questionWeights: js.questionWeights.map((qw) => ({
              clientChallengeQuestionId: qw.clientChallengeQuestionId,
              weight: qw.weight,
              timeLimitSeconds: qw.timeLimitSeconds,
            })),
          }))
        ),
      };
      const originalQuestionCount = parseQuestionCount(
        initialData.questionCount
      );
      const originalState = {
        formData: {
          externalJobId: initialData.externalJobId,
          title: initialData.title,
          description: initialData.description || "",
          passThreshold: initialData.passThreshold,
          questionCountType: originalQuestionCount.type,
          questionCountValue:
            originalQuestionCount.type === "fixed"
              ? originalQuestionCount.value
              : 5,
          questionCountMultiplier:
            originalQuestionCount.type === "skillCount"
              ? originalQuestionCount.multiplier
              : 1.5,
          questionCountMaxLimit:
            originalQuestionCount.type === "skillCount"
              ? originalQuestionCount.maxLimit
              : 50,
        },
        jobSkills: JSON.stringify(
          initialData.jobSkills.map((js) => ({
            clientSkillId: js.clientSkill.id,
            weight: parseFloat(js.jobSkill.weight),
            required: js.jobSkill.required,
            manuallyAdded: js.jobSkill.manuallyAdded,
            questionWeights: js.questionWeights.map((qw) => ({
              clientChallengeQuestionId: qw.clientChallengeQuestionId,
              weight: parseFloat(qw.weight),
              timeLimitSeconds: qw.timeLimitSeconds,
            })),
          }))
        ),
      };
      const dirty =
        JSON.stringify(currentState) !== JSON.stringify(originalState);
      setIsDirty(dirty);
      onDirtyChange?.(dirty);
    }
  }, [formData, jobSkills, mode, initialData, onDirtyChange]);

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      if (mode === "create" && "jobId" in state) {
        router.push(`/app/jobs/${state.jobId}`);
      } else if (mode === "edit") {
        // Refresh the page to show updated data
        router.refresh();
        setIsDirty(false);
      }
    }
  }, [state?.success, state, router, mode]);

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
        detectMode: prev.detectMode,
      }));
    }
  }, [autoDetectActionState]);

  useEffect(() => {
    if (autoDetectState?.jobSkills && autoDetectState?.questionWeights) {
      const transformSkills = async (
        mode: "replace" | "keepManual" | "smart"
      ) => {
        const detectedSkillsWithQuestions = await Promise.all(
          autoDetectState.jobSkills!.map(async (js) => {
            const questionsResponse = await fetch(
              `/api/skills/${js.clientSkillId}/questions`
            );
            const questions = questionsResponse.ok
              ? await questionsResponse.json()
              : [];

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
              manuallyAdded: false,
              questionWeights,
            };
          })
        );

        setJobSkills((currentJobSkills) => {
          if (mode === "replace") {
            return detectedSkillsWithQuestions;
          } else if (mode === "keepManual") {
            const manualSkills = currentJobSkills.filter(
              (js) => js.manuallyAdded
            );
            const manualSkillIds = new Set(
              manualSkills.map((js) => js.clientSkillId)
            );
            const newDetectedSkills = detectedSkillsWithQuestions.filter(
              (ds) => !manualSkillIds.has(ds.clientSkillId)
            );
            return [...manualSkills, ...newDetectedSkills];
          } else if (mode === "smart") {
            const currentSkillIds = new Set(
              currentJobSkills.map((js) => js.clientSkillId)
            );
            const detectedSkillIds = new Set(
              detectedSkillsWithQuestions.map((ds) => ds.clientSkillId)
            );
            const skillsToKeep = currentJobSkills.filter((js) => {
              if (js.manuallyAdded) return true;
              return detectedSkillIds.has(js.clientSkillId);
            });
            const newDetectedSkills = detectedSkillsWithQuestions.filter(
              (ds) => !currentSkillIds.has(ds.clientSkillId)
            );
            return [...skillsToKeep, ...newDetectedSkills];
          }
          return currentJobSkills;
        });

        setIsAutoDetecting(false);
        setShowAutoDetectInfo(true);
      };

      const detectMode = autoDetectState.detectMode || "replace";
      transformSkills(detectMode as "replace" | "keepManual" | "smart");
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

    setAutoDetectState((prev) => ({ ...prev, detectMode: mode }));

    startTransition(() => {
      autoDetectAction(formDataForDetect);
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formDataObj = new FormData(form);

    if (mode === "edit" && initialData) {
      formDataObj.append("id", initialData.id);
    }

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

  // Notify parent of pending state changes
  useEffect(() => {
    onPendingChange?.(pending);
  }, [pending, onPendingChange]);

  // Expose cancel handler for parent components
  const handleCancel = () => {
    if (mode === "edit" && initialData) {
      const resetQuestionCount = parseQuestionCount(initialData.questionCount);
      setFormData({
        externalJobId: initialData.externalJobId,
        title: initialData.title,
        description: initialData.description || "",
        passThreshold: initialData.passThreshold,
        questionCountType: resetQuestionCount.type,
        questionCountValue:
          resetQuestionCount.type === "fixed" ? resetQuestionCount.value : 5,
        questionCountMultiplier:
          resetQuestionCount.type === "skillCount"
            ? resetQuestionCount.multiplier
            : 1.5,
        questionCountMaxLimit:
          resetQuestionCount.type === "skillCount"
            ? resetQuestionCount.maxLimit
            : 50,
      });
      // Reset jobSkills would require reloading, so we'll just mark as not dirty
      setIsDirty(false);
      onDirtyChange?.(false);
    } else {
      router.back();
    }
  };

  // Handle cancel event in edit mode
  useEffect(() => {
    if (mode === "edit") {
      const form = document.getElementById("job-form");
      const cancelHandler = () => {
        handleCancel();
      };
      form?.addEventListener("cancel", cancelHandler);
      return () => {
        form?.removeEventListener("cancel", cancelHandler);
      };
    }
  }, [mode, initialData]);

  return (
    <form id="job-form" onSubmit={handleSubmit} className="space-y-6">
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
            <div className="flex items-center gap-2">
              {initialData && <JobSourceBadge source={initialData.source} />}
              {!initialData && <JobSourceBadge source={JobSource.MANUAL} />}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="externalJobId">
              External Job ID <span className="text-destructive">*</span>
            </Label>
            {mode === "edit" ? (
              <Input
                id="externalJobId"
                name="externalJobId"
                value={formData.externalJobId}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            ) : (
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
            )}
            <p className="text-sm text-muted-foreground">
              Unique identifier for this job in your external system
              {mode === "edit" && " (cannot be edited)"}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              Job Title <span className="text-destructive">*</span>
            </Label>
            {mode === "edit" &&
            initialData &&
            initialData.source !== JobSource.MANUAL ? (
              <Input
                id="title"
                name="title"
                value={formData.title}
                readOnly
                className="bg-muted cursor-not-allowed"
              />
            ) : (
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
            )}
            {mode === "edit" &&
              initialData &&
              initialData.source !== JobSource.MANUAL && (
                <p className="text-sm text-muted-foreground">
                  Title is managed by the integration and cannot be edited
                </p>
              )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            {mode === "edit" &&
            initialData &&
            initialData.source !== JobSource.MANUAL ? (
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                readOnly
                rows={8}
                className="bg-muted cursor-not-allowed"
              />
            ) : (
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
            )}
            {mode === "edit" &&
            initialData &&
            initialData.source !== JobSource.MANUAL ? (
              <p className="text-sm text-muted-foreground">
                Description is managed by the integration and cannot be edited
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {formData.description.length} / 50,000 characters
              </p>
            )}
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

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="questionCountType">Question Count</Label>
                <Select
                  name="questionCountType"
                  value={formData.questionCountType}
                  onValueChange={(
                    value: "teamDefault" | "fixed" | "skillCount"
                  ) =>
                    setFormData((prev) => ({
                      ...prev,
                      questionCountType: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teamDefault">
                      Use Team Default
                    </SelectItem>
                    <SelectItem value="fixed">Fixed Number</SelectItem>
                    <SelectItem value="skillCount">
                      Based on Skill Count
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {formData.questionCountType === "teamDefault"
                    ? `Will use team default setting`
                    : formData.questionCountType === "fixed"
                      ? "Set a fixed number of questions"
                      : "Calculate based on eligible skill count"}
                </p>
              </div>

              {formData.questionCountType === "fixed" && (
                <div className="space-y-2">
                  <Label htmlFor="questionCountValue">Question Count</Label>
                  <Input
                    id="questionCountValue"
                    name="questionCountValue"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={formData.questionCountValue}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        questionCountValue: parseInt(e.target.value) || 5,
                      }))
                    }
                  />
                </div>
              )}

              {formData.questionCountType === "skillCount" && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="questionCountMultiplier">Multiplier</Label>
                    <Input
                      id="questionCountMultiplier"
                      name="questionCountMultiplier"
                      type="number"
                      min="1"
                      step="0.1"
                      value={formData.questionCountMultiplier}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          questionCountMultiplier:
                            parseFloat(e.target.value) || 1.5,
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Multiply eligible skill count by this value (minimum 1.0)
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="questionCountMaxLimit">Maximum Limit</Label>
                    <Input
                      id="questionCountMaxLimit"
                      name="questionCountMaxLimit"
                      type="number"
                      min="1"
                      max="100"
                      step="1"
                      value={formData.questionCountMaxLimit}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          questionCountMaxLimit: parseInt(e.target.value) || 50,
                        }))
                      }
                    />
                    <p className="text-xs text-muted-foreground">
                      Cap the calculated count at this maximum (1-100)
                    </p>
                  </div>
                </div>
              )}
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
    </form>
  );
}
