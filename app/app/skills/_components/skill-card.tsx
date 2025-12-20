"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SkillIcon } from "@/components/skill-icon";
import { Plus, X, Briefcase, FileQuestion, Check } from "lucide-react";
import { useActionState, startTransition } from "react";
import {
  addSkillFromGlobal,
  deleteClientSkill,
} from "@/app/app/skills/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SkillTypeBadge } from "@/components/skill-type-badge";
import { RemoveSkillDialog } from "./remove-skill-dialog";
import type { ActionState } from "@/lib/auth/proxy";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SkillCardProps {
  skill: {
    id: string;
    skillName: string;
    skillNormalized?: string;
    aliases?: string[];
    skillTaxonomy?: {
      id: string;
      skillName: string;
      aliases?: string[];
    } | null;
    // For client skills
    jobCount?: number;
    challengeQuestionCount?: number;
    // For global skills - indicates if already in library
    clientSkillId?: string;
    iconSvg?: string | null;
  };
  variant: "client" | "global";
  onUpdate?: () => void;
}

export function SkillCard({ skill, variant, onUpdate }: SkillCardProps) {
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [addState, addAction, isAddPending] = useActionState<
    ActionState,
    FormData
  >(addSkillFromGlobal, {});

  const [removeState, removeAction, isRemovePending] = useActionState<
    ActionState,
    FormData
  >(deleteClientSkill, {});

  useToastAction(addState);
  useToastAction(removeState);

  const handleAdd = () => {
    // For global skills, use the skill.id directly as it's the taxonomy ID
    const taxonomyId =
      variant === "global" ? skill.id : skill.skillTaxonomy?.id;
    if (!taxonomyId) return;
    const formData = new FormData();
    formData.set("skillTaxonomyId", taxonomyId);
    startTransition(() => {
      addAction(formData);
    });
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

  // Update parent when action succeeds
  useEffect(() => {
    if (removeState?.success) {
      onUpdate?.();
    }
  }, [removeState?.success, onUpdate]);

  // Also update on add success
  useEffect(() => {
    if (addState?.success) {
      onUpdate?.();
    }
  }, [addState?.success, onUpdate]);

  const isPending = isAddPending || isRemovePending;
  const skillName = skill.skillName;
  const aliases =
    variant === "client"
      ? skill.aliases || skill.skillTaxonomy?.aliases || []
      : skill.aliases || [];

  const detailUrl =
    variant === "global"
      ? `/app/skills/global/${skill.id}`
      : `/app/skills/${skill.id}`;

  const handleCardClick = () => {
    window.location.href = detailUrl;
  };

  const handleActionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <Card
      className="flex justify-between hover:shadow-lg hover:scale-[1.02] transition-all duration-200 cursor-pointer group"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-3">
        {/* Top Row: Icon, Name, Action Button */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-shrink-0">
            <SkillIcon
              name={skillName}
              className="w-6 h-6 text-muted-foreground group-hover:text-foreground transition-colors"
              iconSvg={skill.iconSvg || undefined}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base font-medium truncate">{skillName}</h3>
          </div>
          <div className="flex-shrink-0" onClick={handleActionClick}>
            {variant === "global" ? (
              skill.clientSkillId ? (
                <Button
                  asChild
                  size="sm"
                  variant="secondary"
                  className="h-8 gap-1.5"
                  onClick={handleActionClick}
                >
                  <Link href={`/app/skills/${skill.clientSkillId}`}>
                    <Check className="h-3.5 w-3.5" />
                    <span className="text-xs">In Library</span>
                  </Link>
                </Button>
              ) : (
                <Button
                  size="sm"
                  disabled={isAddPending}
                  className="h-8 gap-1.5"
                  onClick={(e) => {
                    handleActionClick(e);
                    handleAdd();
                  }}
                >
                  {isAddPending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Plus className="h-3.5 w-3.5" />
                  )}
                  <span className="text-xs">Add</span>
                </Button>
              )
            ) : (
              <>
                <Button
                  size="icon"
                  disabled={isRemovePending}
                  className="size-8 text-destructive hover:text-foreground bg-transparent hover:bg-destructive"
                  onClick={(e) => {
                    handleActionClick(e);
                    handleRemoveClick();
                  }}
                >
                  {isRemovePending ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                </Button>
                <RemoveSkillDialog
                  open={showRemoveDialog}
                  onOpenChange={setShowRemoveDialog}
                  skillName={skillName}
                  jobCount={skill.jobCount}
                  onConfirm={handleRemoveConfirm}
                  isPending={isRemovePending}
                />
              </>
            )}
          </div>
        </div>

        {/* Aliases Row: Horizontal Scroll */}
        {aliases.length > 0 ? (
          <div className="overflow-x-auto -mx-1 px-1">
            <div className="flex gap-1.5 min-w-max">
              {aliases.map((alias, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs whitespace-nowrap"
                >
                  {alias}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <span className="text-sm text-muted-foreground">No aliases</span>
        )}
      </CardHeader>

      {/* Bottom Half: Only for Client Skills */}
      {variant === "client" && (
        <CardContent className="pt-0 border-t">
          <div className="flex items-center gap-4 pt-3">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Briefcase className="h-4 w-4" />
                    <span>{skill.jobCount ?? 0}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Jobs using this skill</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <FileQuestion className="h-4 w-4" />
                    <span>{skill.challengeQuestionCount ?? 0}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Challenge questions for this skill</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <SkillTypeBadge
              isLinked={!!skill.skillTaxonomy}
              className="ml-auto"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
