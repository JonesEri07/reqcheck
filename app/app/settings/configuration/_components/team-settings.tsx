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

  const [formData, setFormData] = useState({
    stopWidgetAtFreeCap: false,
    defaultQuestionTimeLimitSeconds: "",
    defaultPassThreshold: 60,
    defaultQuestionCount: 5,
    tagMatchWeight: "1.5",
    tagNoMatchWeight: "1.0",
    syncChallengeQuestions: SyncChallengeQuestions.NONE,
  });

  useEffect(() => {
    if (teamData) {
      setFormData({
        stopWidgetAtFreeCap: teamData.stopWidgetAtFreeCap ?? false,
        defaultQuestionTimeLimitSeconds:
          teamData.defaultQuestionTimeLimitSeconds?.toString() || "",
        defaultPassThreshold: teamData.defaultPassThreshold ?? 60,
        defaultQuestionCount: teamData.defaultQuestionCount ?? 5,
        tagMatchWeight: teamData.tagMatchWeight ?? "1.5",
        tagNoMatchWeight: teamData.tagNoMatchWeight ?? "1.0",
        syncChallengeQuestions:
          teamData.syncChallengeQuestions ?? SyncChallengeQuestions.NONE,
      });
    }
  }, [teamData]);

  useEffect(() => {
    if (state?.success) {
      mutate();
    }
  }, [state?.success, mutate]);

  if (!teamData) {
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
          {/* Stop Widget at Free Cap */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="stopWidgetAtFreeCap">
                Stop Widget at Free Cap
              </Label>
              <p className="text-sm text-muted-foreground">
                Automatically disable the widget when the free tier limit is
                reached
              </p>
            </div>
            <Switch
              id="stopWidgetAtFreeCap"
              name="stopWidgetAtFreeCap"
              checked={formData.stopWidgetAtFreeCap}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  stopWidgetAtFreeCap: checked,
                }))
              }
            />
            <input
              type="hidden"
              name="stopWidgetAtFreeCap"
              value={formData.stopWidgetAtFreeCap ? "true" : "false"}
            />
          </div>

          {/* Default Question Time Limit */}
          <div className="space-y-2">
            <Label htmlFor="defaultQuestionTimeLimitSeconds">
              Default Question Time Limit (seconds)
            </Label>
            <p className="text-sm text-muted-foreground">
              Maximum time allowed per question. Leave empty for no limit.
            </p>
            <Input
              id="defaultQuestionTimeLimitSeconds"
              name="defaultQuestionTimeLimitSeconds"
              type="number"
              min="1"
              max="3600"
              value={formData.defaultQuestionTimeLimitSeconds}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  defaultQuestionTimeLimitSeconds: e.target.value,
                }))
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
                setFormData((prev) => ({
                  ...prev,
                  defaultPassThreshold: parseInt(e.target.value) || 60,
                }))
              }
              required
            />
          </div>

          {/* Default Question Count */}
          <div className="space-y-2">
            <Label htmlFor="defaultQuestionCount">Default Question Count</Label>
            <p className="text-sm text-muted-foreground">
              Number of questions to show by default (1-50)
            </p>
            <Input
              id="defaultQuestionCount"
              name="defaultQuestionCount"
              type="number"
              min="1"
              max="50"
              value={formData.defaultQuestionCount}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  defaultQuestionCount: parseInt(e.target.value) || 5,
                }))
              }
              required
            />
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
                setFormData((prev) => ({
                  ...prev,
                  tagMatchWeight: e.target.value,
                }))
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
                setFormData((prev) => ({
                  ...prev,
                  tagNoMatchWeight: e.target.value,
                }))
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
              name="syncChallengeQuestions"
              value={formData.syncChallengeQuestions}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  syncChallengeQuestions: value as SyncChallengeQuestions,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue />
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
