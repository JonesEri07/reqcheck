"use client";

import { useActionState, useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { updateTeamSettings } from "../actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import useSWR from "swr";
import { SyncChallengeQuestions } from "@/lib/db/schema";
import type { ActionState } from "@/lib/auth/proxy";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function TeamSettings() {
  const { data: teamData, mutate } = useSWR<any>("/api/team", fetcher);
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    updateTeamSettings,
    {}
  );

  useToastAction(state);

  const [formData, setFormData] = useState<{
    defaultQuestionTimeLimitSeconds: string;
    defaultPassThreshold: number;
    defaultQuestionCountType: "fixed" | "skillCount";
    defaultQuestionCountValue: number;
    defaultQuestionCountMultiplier: number;
    defaultQuestionCountMaxLimit: number;
    tagMatchWeight: string;
    tagNoMatchWeight: string;
    syncChallengeQuestions: SyncChallengeQuestions;
  } | null>(null);

  useEffect(() => {
    if (teamData) {
      const questionCount = teamData.defaultQuestionCount;
      const isSkillCount =
        questionCount &&
        typeof questionCount === "object" &&
        questionCount.type === "skillCount";

      // Ensure syncChallengeQuestions is a valid enum value
      const syncValue =
        teamData.syncChallengeQuestions &&
        Object.values(SyncChallengeQuestions).includes(
          teamData.syncChallengeQuestions as SyncChallengeQuestions
        )
          ? (teamData.syncChallengeQuestions as SyncChallengeQuestions)
          : SyncChallengeQuestions.NONE;

      setFormData({
        defaultQuestionTimeLimitSeconds:
          teamData.defaultQuestionTimeLimitSeconds?.toString() || "",
        defaultPassThreshold: teamData.defaultPassThreshold ?? 60,
        defaultQuestionCountType: isSkillCount ? "skillCount" : "fixed",
        defaultQuestionCountValue: isSkillCount
          ? 5
          : questionCount &&
              typeof questionCount === "object" &&
              questionCount.type === "fixed"
            ? questionCount.value
            : typeof questionCount === "number"
              ? questionCount
              : 5,
        defaultQuestionCountMultiplier: isSkillCount
          ? ((questionCount as any)?.multiplier ?? 1.5)
          : 1.5,
        defaultQuestionCountMaxLimit: isSkillCount
          ? ((questionCount as any)?.maxLimit ?? 50)
          : 50,
        tagMatchWeight: teamData.tagMatchWeight ?? "1.5",
        tagNoMatchWeight: teamData.tagNoMatchWeight ?? "1.0",
        syncChallengeQuestions: syncValue,
      });
    }
  }, [teamData]);

  useEffect(() => {
    if (state?.success) {
      mutate();
    }
  }, [state?.success, mutate]);

  if (!teamData || !formData) {
    return null;
  }

  return (
    <Card id="team-settings">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle>Widget & Default Settings</CardTitle>
            <CardDescription>
              Configure default behavior for widgets and challenge questions
            </CardDescription>
          </div>
          <Button type="submit" form="team-settings-form" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form id="team-settings-form" action={formAction} className="space-y-6">
          {/* Default Question Time Limit */}
          <div className="space-y-2">
            <Label htmlFor="defaultQuestionTimeLimitSeconds">
              Default Question Time Limit (seconds)
            </Label>
            <p className="text-sm text-muted-foreground">
              Maximum time allowed per question. 0 = no limit.
            </p>
            <Input
              id="defaultQuestionTimeLimitSeconds"
              name="defaultQuestionTimeLimitSeconds"
              type="number"
              min="0"
              max="3600"
              value={formData.defaultQuestionTimeLimitSeconds}
              onChange={(e) =>
                setFormData((prev) =>
                  prev
                    ? {
                        ...prev,
                        defaultQuestionTimeLimitSeconds: e.target.value,
                      }
                    : prev
                )
              }
              placeholder="No limit"
            />
          </div>

          {/* Default Pass Threshold */}
          <div className="space-y-2">
            <Label htmlFor="defaultPassThreshold">
              Default Pass Threshold (%)
            </Label>
            <p className="text-sm text-muted-foreground">
              Minimum score percentage required to pass (0-100)
            </p>
            <Input
              id="defaultPassThreshold"
              name="defaultPassThreshold"
              type="number"
              min="0"
              max="100"
              value={formData.defaultPassThreshold}
              onChange={(e) =>
                setFormData((prev) =>
                  prev
                    ? {
                        ...prev,
                        defaultPassThreshold: parseInt(e.target.value) || 60,
                      }
                    : prev
                )
              }
              required
            />
          </div>

          {/* Default Question Count */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="defaultQuestionCountType">
                Default Question Count Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Choose how to determine the number of questions per quiz
              </p>
              <Select
                value={formData.defaultQuestionCountType}
                onValueChange={(value: "fixed" | "skillCount") =>
                  setFormData((prev) =>
                    prev ? { ...prev, defaultQuestionCountType: value } : prev
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select mode..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fixed">Fixed Number</SelectItem>
                  <SelectItem value="skillCount">
                    Based on Skill Count
                  </SelectItem>
                </SelectContent>
              </Select>
              <input
                type="hidden"
                name="defaultQuestionCountType"
                value={formData.defaultQuestionCountType}
              />
            </div>

            {formData.defaultQuestionCountType === "fixed" ? (
              <div className="space-y-2">
                <Label htmlFor="defaultQuestionCountValue">
                  Question Count
                </Label>
                <p className="text-sm text-muted-foreground">
                  Fixed number of questions to show (1-100)
                </p>
                <Input
                  id="defaultQuestionCountValue"
                  name="defaultQuestionCountValue"
                  type="number"
                  min="1"
                  max="100"
                  step="1"
                  value={formData.defaultQuestionCountValue}
                  onChange={(e) =>
                    setFormData((prev) =>
                      prev
                        ? {
                            ...prev,
                            defaultQuestionCountValue:
                              parseInt(e.target.value) || 5,
                          }
                        : prev
                    )
                  }
                  required
                />
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="defaultQuestionCountMultiplier">
                    Multiplier
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Multiply eligible skill count by this value (rounds up to
                    nearest whole number)
                  </p>
                  <Input
                    id="defaultQuestionCountMultiplier"
                    name="defaultQuestionCountMultiplier"
                    type="number"
                    min="1"
                    step="0.1"
                    value={formData.defaultQuestionCountMultiplier}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              defaultQuestionCountMultiplier:
                                parseFloat(e.target.value) || 1.5,
                            }
                          : prev
                      )
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="defaultQuestionCountMaxLimit">
                    Maximum Limit
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Cap the calculated count at this maximum (1-100)
                  </p>
                  <Input
                    id="defaultQuestionCountMaxLimit"
                    name="defaultQuestionCountMaxLimit"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    value={formData.defaultQuestionCountMaxLimit}
                    onChange={(e) =>
                      setFormData((prev) =>
                        prev
                          ? {
                              ...prev,
                              defaultQuestionCountMaxLimit:
                                parseInt(e.target.value) || 50,
                            }
                          : prev
                      )
                    }
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Example: If a job has 4 eligible skills and multiplier is 1.5,
                  the count would be ⌈4 × 1.5⌉ = 6 questions (capped by max
                  limit if set).
                </p>
              </div>
            )}
          </div>

          {/* Tag Match Weight */}
          <div className="space-y-2">
            <Label htmlFor="tagMatchWeight">Tag Match Weight</Label>
            <p className="text-sm text-muted-foreground">
              Weight given to a job skill question if any tag is found in job
              title/description (0-10)
            </p>
            <Input
              id="tagMatchWeight"
              name="tagMatchWeight"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.tagMatchWeight}
              onChange={(e) =>
                setFormData((prev) =>
                  prev ? { ...prev, tagMatchWeight: e.target.value } : prev
                )
              }
              required
            />
          </div>

          {/* Tag No Match Weight */}
          <div className="space-y-2">
            <Label htmlFor="tagNoMatchWeight">Tag No Match Weight</Label>
            <p className="text-sm text-muted-foreground">
              Weight given to a job skill question if no tag is found in job
              title/description (0-10)
            </p>
            <Input
              id="tagNoMatchWeight"
              name="tagNoMatchWeight"
              type="number"
              step="0.1"
              min="0"
              max="10"
              value={formData.tagNoMatchWeight}
              onChange={(e) =>
                setFormData((prev) =>
                  prev ? { ...prev, tagNoMatchWeight: e.target.value } : prev
                )
              }
              required
            />
          </div>

          {/* Sync Challenge Questions */}
          <div className="space-y-2">
            <Label htmlFor="syncChallengeQuestions">
              Sync Challenge Questions
            </Label>
            <p className="text-sm text-muted-foreground">
              Determines if curated challenge questions are cloned to client
              skill challenge table
            </p>
            <Select
              value={formData.syncChallengeQuestions}
              onValueChange={(value) =>
                setFormData((prev) =>
                  prev
                    ? {
                        ...prev,
                        syncChallengeQuestions: value as SyncChallengeQuestions,
                      }
                    : prev
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select sync option..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={SyncChallengeQuestions.NONE}>
                  None
                </SelectItem>
                <SelectItem value={SyncChallengeQuestions.REQCHECK}>
                  reqCHECK
                </SelectItem>
              </SelectContent>
            </Select>
            <input
              type="hidden"
              name="syncChallengeQuestions"
              value={formData.syncChallengeQuestions}
            />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
