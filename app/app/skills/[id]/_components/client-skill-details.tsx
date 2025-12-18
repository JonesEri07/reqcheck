"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkillIcon } from "@/components/skill-icon";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SkillTypeBadge } from "@/components/skill-type-badge";
import { Pencil, Trash2, Plus, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useActionState, startTransition } from "react";
import type { ClientSkill } from "@/lib/db/schema";
import { EditSkillSheet } from "./edit-skill-sheet";
import { deleteClientSkill } from "@/app/app/skills/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import type { ActionState } from "@/lib/auth/proxy";
import { RemoveSkillDialog } from "@/app/app/skills/_components/remove-skill-dialog";
import { ChallengeQuestionsTable } from "./challenge-questions-table";
import { SkillInsights, type ApplicationHistoryItem } from "./skill-insights";
import { SkillJobsList } from "./skill-jobs-list";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { QuestionWithTags } from "@/lib/skills/queries";
import useSWR from "swr";
import type { TeamDataWithMembers } from "@/lib/db/schema";
import {
  hasReachedCustomQuestionLimit,
  getCustomQuestionLimit,
} from "@/lib/constants/tier-limits";
import { PlanName } from "@/lib/db/schema";
import { useTierProtectedCallback } from "@/components/tier-protection/use-tier-protected-callback";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface JobAssociation {
  id: string;
  weight: string;
  source: string;
  job: {
    id: string;
    title: string;
    externalJobId: string;
  } | null;
}

interface ClientSkillDetailsProps {
  skill: ClientSkill;
  questions: QuestionWithTags[];
  applicationHistory?: ApplicationHistoryItem[];
  jobAssociations?: JobAssociation[];
}

export function ClientSkillDetails({
  skill,
  questions,
  applicationHistory = [],
  jobAssociations = [],
}: ClientSkillDetailsProps) {
  const router = useRouter();
  const [editSheetOpen, setEditSheetOpen] = useState(false);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(deleteClientSkill, {});

  useToastAction(removeState);

  // Fetch team data to get tier information
  const { data: teamData } = useSWR<TeamDataWithMembers>("/api/team", fetcher);
  // Fetch total custom questions count
  const { data: customQuestionsData } = useSWR<{ count: number }>(
    "/api/skills/custom-questions-count",
    fetcher
  );

  const planName = (teamData?.planName as PlanName) || PlanName.FREE;
  const customQuestionLimit = getCustomQuestionLimit(planName);
  const currentTotalCount = customQuestionsData?.count ?? 0;
  const isLimitReached = hasReachedCustomQuestionLimit(
    currentTotalCount,
    planName
  );

  // Protected callback for creating challenge questions
  const handleCreateChallenge = useTierProtectedCallback(
    {
      currentCount: currentTotalCount,
      planName,
      limitType: "customQuestions",
      dialogTitle: "Custom Question Limit Reached",
      dialogDescription:
        planName === "PRO" || planName === "ENTERPRISE" ? (
          <>
            You've reached the maximum of {customQuestionLimit} custom questions
            for your {planName} plan.
            <br />
            <br />
            This is the highest limit available. Consider removing unused
            questions to free up space.
          </>
        ) : (
          <>
            You've reached the maximum of {customQuestionLimit} custom questions
            for your {planName} plan.
            <br />
            <br />
            Upgrade to Pro to create up to 500 custom questions across all your
            skills.
          </>
        ),
      featureName: "custom questions",
    },
    () => {
      router.push(`/app/skills/${skill.id}/challenges/create`);
    }
  );

  const handleEditSuccess = () => {
    router.refresh();
  };

  const handleRemoveClick = () => {
    setShowRemoveDialog(true);
  };

  const handleRemoveConfirm = () => {
    const formData = new FormData();
    formData.set("id", skill.id);
    setShowRemoveDialog(false);
    startTransition(() => {
      removeAction(formData);
    });
  };

  // Redirect to skills library on successful removal
  useEffect(() => {
    if (removeState?.success) {
      router.push("/app/skills");
    }
  }, [removeState?.success, router]);

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          {/* First row: Icon, Skill name, Buttons */}
          <div className="flex items-center justify-between gap-4 mb-3">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <SkillIcon
                name={skill.skillName}
                className="w-8 h-8 flex-shrink-0"
                iconSvg={skill.iconSvg || undefined}
              />
              <CardTitle className="text-left">{skill.skillName}</CardTitle>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setEditSheetOpen(true)}
                className="gap-2"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemoveClick}
                className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                disabled={isRemovePending}
              >
                <Trash2 className="h-4 w-4" />
                Remove
              </Button>
            </div>
          </div>
          {/* Second row: Aliases, Badge */}
          <div className="flex items-center justify-between gap-4">
            {skill.aliases && skill.aliases.length > 0 ? (
              <div className="flex flex-wrap gap-1.5 flex-1">
                {skill.aliases.map((alias, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {alias}
                  </Badge>
                ))}
              </div>
            ) : (
              <div className="flex-1" />
            )}
            <div className="flex-shrink-0">
              <SkillTypeBadge isLinked={!!skill.skillTaxonomyId} />
            </div>
          </div>
        </CardHeader>
      </Card>

      {skill.description && (
        <Card>
          <CardHeader>
            <CardTitle>Description</CardTitle>
            <CardDescription className="flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              Internal use only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{skill.description}</p>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="details" className="space-y-6">
        <TabsList>
          <TabsTrigger value="details">Challenges</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Challenge Questions</CardTitle>
                  <CardDescription>
                    Manage challenge questions for this skill
                    {!isLimitReached && (
                      <span className="ml-1">
                        ({currentTotalCount}/{customQuestionLimit} total)
                      </span>
                    )}
                  </CardDescription>
                </div>
                <Button
                  size="sm"
                  className="gap-2"
                  onClick={handleCreateChallenge}
                >
                  <Plus className="h-4 w-4" />
                  Challenge
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {questions.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <p className="text-sm text-muted-foreground">
                    No challenge questions yet. Add your first question to get
                    started.
                  </p>
                  <Button
                    size="sm"
                    className="gap-2"
                    onClick={handleCreateChallenge}
                  >
                    <Plus className="h-4 w-4" />
                    Add Challenge Question
                  </Button>
                </div>
              ) : (
                <ChallengeQuestionsTable
                  questions={questions}
                  skillId={skill.id}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-6">
          <SkillJobsList jobAssociations={jobAssociations} />
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          <SkillInsights
            applicationHistory={applicationHistory}
            jobAssociations={jobAssociations}
            questionCount={questions.length}
          />
        </TabsContent>
      </Tabs>

      <EditSkillSheet
        open={editSheetOpen}
        onOpenChange={setEditSheetOpen}
        skill={skill}
        onSuccess={handleEditSuccess}
      />

      {/* Remove Skill Confirmation Dialog */}
      <RemoveSkillDialog
        open={showRemoveDialog}
        onOpenChange={setShowRemoveDialog}
        skillName={skill.skillName}
        jobCount={skill.usageCount}
        onConfirm={handleRemoveConfirm}
        isPending={isRemovePending}
      />
    </div>
  );
}
