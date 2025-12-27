"use client";

import { useState, useEffect, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { updateClientSkill } from "../actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import useSWR from "swr";

interface ResolveAliasConflictsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  conflicts: Array<{
    alias: string;
    skills: Array<{ id: string; name: string; type: "client" }>;
  }>;
  onResolved?: () => void;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function ResolveAliasConflictsDialog({
  open,
  onOpenChange,
  conflicts,
  onResolved,
}: ResolveAliasConflictsDialogProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [state, formAction] = useActionState(updateClientSkill, {});

  // Fetch all client skills to get current aliases
  const { data: clientSkills } = useSWR(
    open ? "/api/skills/client" : null,
    fetcher
  );

  useToastAction(state);

  // Refresh on success
  useEffect(() => {
    if ((state as any)?.success) {
      router.refresh();
      onResolved?.();
    }
  }, [(state as any)?.success, router, onResolved]);

  const getCurrentAliases = (skillId: string): string[] => {
    const skill = (clientSkills || []).find((s: any) => s.id === skillId);
    return skill?.aliases || [];
  };

  const handleRemoveAlias = (skillId: string, aliasToRemove: string) => {
    const currentAliases = getCurrentAliases(skillId);
    const updatedAliases = currentAliases.filter(
      (a) => a.toLowerCase().trim() !== aliasToRemove.toLowerCase().trim()
    );

    const formData = new FormData();
    formData.set("id", skillId);
    formData.set("aliases", JSON.stringify(updatedAliases));

    startTransition(() => {
      formAction(formData);
    });
  };

  const handleRemoveFromAll = (alias: string) => {
    const conflict = conflicts.find(
      (c) => c.alias.toLowerCase() === alias.toLowerCase()
    );
    if (!conflict) return;

    // Remove alias from all skills (all are client skills now)
    conflict.skills.forEach((skill) => {
      handleRemoveAlias(skill.id, alias);
    });
  };

  if (conflicts.length === 0) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Resolve Alias Conflicts</DialogTitle>
          <DialogDescription>
            The following aliases are used by multiple skills. Remove aliases
            from specific skills to resolve conflicts.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {conflicts.map((conflict) => (
            <div
              key={conflict.alias}
              className="border rounded-lg p-4 space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-mono">
                    {conflict.alias}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    used by {conflict.skills.length} skill
                    {conflict.skills.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveFromAll(conflict.alias)}
                  className="text-xs"
                >
                  Remove from all skills
                </Button>
              </div>

              <div className="space-y-2">
                {conflict.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-2 bg-muted rounded"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{skill.name}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        handleRemoveAlias(skill.id, conflict.alias)
                      }
                      disabled={isPending}
                      className="h-7 text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
