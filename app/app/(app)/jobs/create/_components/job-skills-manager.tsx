"use client";

import { useState, useEffect, useMemo } from "react";
import { SkillIcon } from "@/components/skill-icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ChallengeQuestionPreview } from "@/components/challenge-question-preview";
import { Trash2, Plus, Eye, ExternalLink } from "lucide-react";
import Link from "next/link";

interface JobSkillsManagerProps {
  jobSkills: JobSkillFormData[];
  setJobSkills: (skills: JobSkillFormData[]) => void;
  availableSkills: any[];
  defaultQuestionTimeLimitSeconds: number;
}

export interface JobSkillFormData {
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
    // Full question data for preview
    questionType?: string;
    questionConfig?: any;
    questionImageUrl?: string | null;
    questionImageAltText?: string | null;
  }>;
}

export function JobSkillsManager({
  jobSkills,
  setJobSkills,
  availableSkills,
  defaultQuestionTimeLimitSeconds,
}: JobSkillsManagerProps) {
  const [addSkillOpen, setAddSkillOpen] = useState(false);
  const [skillSearch, setSkillSearch] = useState("");
  const [previewQuestion, setPreviewQuestion] = useState<{
    question: any;
    skillName: string;
  } | null>(null);

  // Get skills that aren't already added
  const availableSkillsToAdd = useMemo(() => {
    const addedSkillIds = new Set(jobSkills.map((js) => js.clientSkillId));
    return availableSkills.filter((skill) => !addedSkillIds.has(skill.id));
  }, [availableSkills, jobSkills]);

  // Filter skills based on search
  const filteredSkillsToAdd = useMemo(() => {
    if (!skillSearch) return availableSkillsToAdd;
    const searchLower = skillSearch.toLowerCase();
    return availableSkillsToAdd.filter(
      (skill) =>
        skill.skillName.toLowerCase().includes(searchLower) ||
        skill.skillNormalized?.includes(searchLower) ||
        skill.description?.toLowerCase().includes(searchLower) ||
        (skill.aliases || []).some((alias: string) =>
          alias.toLowerCase().includes(searchLower)
        )
    );
  }, [availableSkillsToAdd, skillSearch]);

  const handleAddSkill = async (skill: any) => {
    // Fetch questions for this skill
    const questionsResponse = await fetch(`/api/skills/${skill.id}/questions`);
    const questions = questionsResponse.ok
      ? await questionsResponse.json()
      : [];

    const newSkill: JobSkillFormData = {
      clientSkillId: skill.id,
      skillName: skill.skillName,
      weight: 1.0,
      required: true,
      manuallyAdded: true,
      questionWeights: questions.map((q: any) => ({
        clientChallengeQuestionId: q.id,
        questionPrompt: q.prompt || "",
        weight: 1.0,
        timeLimitSeconds: null,
        questionTimeLimitSeconds: q.timeLimitSeconds,
        questionType: q.type,
        questionConfig: q.config,
        questionImageUrl: q.imageUrl,
        questionImageAltText: q.imageAltText,
      })),
    };

    setJobSkills([...jobSkills, newSkill]);
    setAddSkillOpen(false);
    setSkillSearch("");
  };

  const handleRemoveSkill = (skillId: string) => {
    setJobSkills(jobSkills.filter((js) => js.clientSkillId !== skillId));
  };

  const updateSkillWeight = (skillId: string, weight: number) => {
    setJobSkills(
      jobSkills.map((js) =>
        js.clientSkillId === skillId
          ? { ...js, weight: Math.max(0.5, Math.min(3.0, weight)) }
          : js
      )
    );
  };

  const updateQuestionWeight = (
    skillId: string,
    questionId: string,
    weight: number
  ) => {
    setJobSkills(
      jobSkills.map((js) =>
        js.clientSkillId === skillId
          ? {
              ...js,
              questionWeights: js.questionWeights.map((qw) =>
                qw.clientChallengeQuestionId === questionId
                  ? { ...qw, weight: Math.max(0, Math.min(10, weight)) }
                  : qw
              ),
            }
          : js
      )
    );
  };

  const updateQuestionTimeLimit = (
    skillId: string,
    questionId: string,
    timeLimitSeconds: number | null
  ) => {
    setJobSkills(
      jobSkills.map((js) =>
        js.clientSkillId === skillId
          ? {
              ...js,
              questionWeights: js.questionWeights.map((qw) =>
                qw.clientChallengeQuestionId === questionId
                  ? { ...qw, timeLimitSeconds }
                  : qw
              ),
            }
          : js
      )
    );
  };

  // Get effective time limit for a question
  const getEffectiveTimeLimit = (
    question: JobSkillFormData["questionWeights"][0]
  ) => {
    // If question has its own time limit, use that (cannot override)
    if (question.questionTimeLimitSeconds !== null) {
      return question.questionTimeLimitSeconds;
    }
    // If override is set, use that
    if (question.timeLimitSeconds !== null) {
      return question.timeLimitSeconds;
    }
    // Otherwise use team default
    return defaultQuestionTimeLimitSeconds || null;
  };

  if (jobSkills.length === 0 && availableSkillsToAdd.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No skills available to add.</p>
        <p className="text-sm mt-2">
          Create skills in your Skills Library first.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Add Skill Button */}
      {availableSkillsToAdd.length > 0 && (
        <Popover open={addSkillOpen} onOpenChange={setAddSkillOpen}>
          <PopoverTrigger asChild>
            <Button type="button" variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Skill
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[300px] p-0" align="start">
            <Command>
              <CommandInput
                placeholder="Search skills..."
                value={skillSearch}
                onValueChange={setSkillSearch}
              />
              <CommandList>
                <CommandEmpty>No skills found.</CommandEmpty>
                <CommandGroup>
                  {filteredSkillsToAdd.map((skill) => (
                    <CommandItem
                      key={skill.id}
                      onSelect={() => handleAddSkill(skill)}
                      className="cursor-pointer"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <SkillIcon name={skill.skillName} className="h-4 w-4" />
                        <span>{skill.skillName}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

      {/* Skills List */}
      {jobSkills.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground border rounded-lg">
          <p>No skills added yet.</p>
          <p className="text-sm mt-2">
            Use the &quot;Auto Detect&quot; button above or click &quot;Add
            Skill&quot; to manually add skills.
          </p>
        </div>
      ) : (
        <Accordion type="multiple" className="space-y-2">
          {jobSkills.map((skill) => {
            // Use question data from skill.questionWeights
            const questionsWithWeights = skill.questionWeights;

            return (
              <AccordionItem
                key={skill.clientSkillId}
                value={skill.clientSkillId}
                className="border rounded-lg overflow-visible"
              >
                <div className="sticky top-[60px] z-10 bg-background border-b rounded-lg shadow-sm">
                  <AccordionTrigger className="hover:no-underline hover:bg-accent px-4 bg-background cursor-pointer">
                    <div className="flex items-center justify-between flex-1 pr-4">
                      <div className="flex items-center gap-3">
                        <SkillIcon name={skill.skillName} className="h-5 w-5" />
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/app/skills/${skill.clientSkillId}`}
                            className="font-medium hover:underline group relative inline-flex items-center gap-1.5"
                          >
                            <span className="font-medium">
                              {skill.skillName}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200 ease-in-out" />
                          </Link>
                          {skill.manuallyAdded && (
                            <Badge variant="secondary" className="text-xs">
                              Manual
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`skill-weight-header-${skill.clientSkillId}`}
                            className="text-sm text-muted-foreground"
                          >
                            Weight:
                          </Label>
                          <Input
                            id={`skill-weight-header-${skill.clientSkillId}`}
                            type="number"
                            min="0.5"
                            max="3.0"
                            step="0.1"
                            value={skill.weight}
                            onChange={(e) => {
                              e.stopPropagation();
                              updateSkillWeight(
                                skill.clientSkillId,
                                parseFloat(e.target.value) || 1.0
                              );
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-20 h-8 text-sm"
                          />
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {skill.questionWeights.length}{" "}
                          {skill.questionWeights.length === 1
                            ? "question"
                            : "questions"}
                        </span>
                        <div
                          role="button"
                          tabIndex={0}
                          className="inline-flex items-center justify-center rounded-md h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveSkill(skill.clientSkillId);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveSkill(skill.clientSkillId);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  </AccordionTrigger>
                </div>
                <AccordionContent className="pt-4 pb-6 px-4">
                  <div className="space-y-6">
                    {/* Questions List */}
                    <div className="space-y-3">
                      <Label>Challenge Questions</Label>
                      {questionsWithWeights.length === 0 ? (
                        <p className="text-sm text-muted-foreground py-4">
                          No questions available for this skill.
                        </p>
                      ) : (
                        <div className="space-y-3">
                          {questionsWithWeights.map((question: any) => {
                            const effectiveTimeLimit = getEffectiveTimeLimit({
                              questionTimeLimitSeconds:
                                question.questionTimeLimitSeconds,
                              timeLimitSeconds: question.timeLimitSeconds,
                              clientChallengeQuestionId:
                                question.clientChallengeQuestionId,
                              questionPrompt: question.questionPrompt,
                              weight: question.weight,
                            });
                            const canOverrideTime =
                              question.questionTimeLimitSeconds === null;

                            return (
                              <div
                                key={question.clientChallengeQuestionId}
                                className="border rounded-lg p-4 space-y-3"
                              >
                                <div className="flex items-start justify-between">
                                  <div className="space-y-1 flex-1">
                                    <p className="text-sm font-medium">
                                      {question.questionPrompt ||
                                        "Untitled Question"}
                                    </p>
                                    {effectiveTimeLimit !== null && (
                                      <p className="text-xs text-muted-foreground">
                                        Time limit: {effectiveTimeLimit}s
                                        {!canOverrideTime && " (from question)"}
                                        {canOverrideTime &&
                                          question.timeLimitSeconds !== null &&
                                          " (overridden)"}
                                        {canOverrideTime &&
                                          question.timeLimitSeconds === null &&
                                          ` (team default: ${defaultQuestionTimeLimitSeconds}s)`}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-2">
                                      <Label
                                        htmlFor={`ignore-${question.clientChallengeQuestionId}`}
                                        className="text-xs text-muted-foreground"
                                      >
                                        Ignore
                                      </Label>
                                      <Switch
                                        id={`ignore-${question.clientChallengeQuestionId}`}
                                        checked={(question.weight || 0) === 0}
                                        onCheckedChange={(checked) => {
                                          updateQuestionWeight(
                                            skill.clientSkillId,
                                            question.clientChallengeQuestionId,
                                            checked ? 0 : 1.0
                                          );
                                        }}
                                      />
                                    </div>
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() =>
                                        setPreviewQuestion({
                                          question,
                                          skillName: skill.skillName,
                                        })
                                      }
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                                {(question.weight || 0) === 0 ? (
                                  <div className="bg-muted rounded-lg p-4 text-center">
                                    <p className="text-sm text-muted-foreground">
                                      This question will be ignored as a
                                      possible quiz challenge question for this
                                      job.
                                    </p>
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`q-weight-${question.clientChallengeQuestionId}`}
                                        className="text-xs"
                                      >
                                        Question Weight
                                      </Label>
                                      <Input
                                        id={`q-weight-${question.clientChallengeQuestionId}`}
                                        type="number"
                                        min="0"
                                        max="10"
                                        step="0.1"
                                        value={question.weight || 1.0}
                                        onChange={(e) =>
                                          updateQuestionWeight(
                                            skill.clientSkillId,
                                            question.clientChallengeQuestionId,
                                            parseFloat(e.target.value) || 0
                                          )
                                        }
                                      />
                                      <p className="text-xs text-muted-foreground">
                                        Weight for this question (0 - 10)
                                      </p>
                                    </div>
                                    <div className="space-y-2">
                                      <Label
                                        htmlFor={`q-time-${question.clientChallengeQuestionId}`}
                                        className="text-xs"
                                      >
                                        Time Limit Override (seconds)
                                      </Label>
                                      {canOverrideTime ? (
                                        <>
                                          <Input
                                            id={`q-time-${question.clientChallengeQuestionId}`}
                                            type="number"
                                            min="1"
                                            max="3600"
                                            value={
                                              question.timeLimitSeconds ?? ""
                                            }
                                            onChange={(e) =>
                                              updateQuestionTimeLimit(
                                                skill.clientSkillId,
                                                question.clientChallengeQuestionId,
                                                e.target.value
                                                  ? parseInt(e.target.value)
                                                  : null
                                              )
                                            }
                                            placeholder={`Default: ${defaultQuestionTimeLimitSeconds || "None"}`}
                                          />
                                          <p className="text-xs text-muted-foreground">
                                            Leave empty to use team default
                                          </p>
                                        </>
                                      ) : (
                                        <>
                                          <Input
                                            id={`q-time-${question.clientChallengeQuestionId}`}
                                            value={effectiveTimeLimit || ""}
                                            disabled
                                            className="bg-muted"
                                          />
                                          <p className="text-xs text-muted-foreground">
                                            Question has its own time limit
                                          </p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* Preview Dialog */}
      <Dialog
        open={previewQuestion !== null}
        onOpenChange={(open) => !open && setPreviewQuestion(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Question Preview</DialogTitle>
          </DialogHeader>
          {previewQuestion && previewQuestion.question.questionType && (
            <ChallengeQuestionPreview
              type={
                previewQuestion.question.questionType as
                  | "multiple_choice"
                  | "fill_blank_blocks"
              }
              prompt={previewQuestion.question.questionPrompt || ""}
              config={previewQuestion.question.questionConfig || {}}
              imageUrl={previewQuestion.question.questionImageUrl}
              imageAltText={previewQuestion.question.questionImageAltText}
              timeLimitSeconds={getEffectiveTimeLimit({
                questionTimeLimitSeconds:
                  previewQuestion.question.questionTimeLimitSeconds,
                timeLimitSeconds: previewQuestion.question.timeLimitSeconds,
                clientChallengeQuestionId:
                  previewQuestion.question.clientChallengeQuestionId,
                questionPrompt: previewQuestion.question.questionPrompt,
                weight: previewQuestion.question.weight,
              })}
              skillName={previewQuestion.skillName}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
