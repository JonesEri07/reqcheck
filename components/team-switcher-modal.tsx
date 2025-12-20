"use client";

import { useState, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useActionState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, Check } from "lucide-react";
import { switchTeam } from "@/app/(public)/(auth)/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import useSWR, { mutate } from "swr";
import { cn } from "@/lib/utils";
import { ActionState } from "@/lib/auth/proxy";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

type Team = {
  id: number;
  name: string;
  role: string;
  joinedAt: string;
  isCurrent: boolean;
};

type TeamSwitcherModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TeamSwitcherModal({
  open,
  onOpenChange,
}: TeamSwitcherModalProps) {
  const router = useRouter();
  const { data: teams, isLoading } = useSWR<Team[]>("/api/teams", fetcher, {
    revalidateOnFocus: false,
  });

  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    switchTeam,
    {}
  );
  const [isTransitionPending, startTransition] = useTransition();

  useToastAction(state);

  // Close modal and refresh on success
  useEffect(() => {
    if (state.success) {
      onOpenChange(false);
      // Refresh team data
      mutate("/api/team");
      mutate("/api/teams");
      // Refresh the page to ensure all data is updated
      router.refresh();
    }
  }, [state.success, onOpenChange, router]);

  const handleSwitchTeam = (teamId: number) => {
    const formData = new FormData();
    formData.append("teamId", teamId.toString());
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Switch Team</DialogTitle>
          <DialogDescription>
            Select a team to switch to. You'll be able to access all resources
            for the selected team.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : !teams || teams.length === 0 ? (
            <div className="py-8 text-center text-sm text-muted-foreground">
              You are not a member of any teams.
            </div>
          ) : (
            <div className="space-y-2">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleSwitchTeam(team.id)}
                  disabled={isPending || isTransitionPending || team.isCurrent}
                  className={cn(
                    "w-full flex items-center justify-between rounded-lg border p-4 text-left transition-colors hover:bg-accent hover:text-accent-foreground",
                    team.isCurrent && "bg-accent",
                    (isPending || isTransitionPending || team.isCurrent) &&
                      "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-muted-foreground capitalize">
                        {team.role}
                      </div>
                    </div>
                  </div>
                  {team.isCurrent && <Check className="h-5 w-5 text-primary" />}
                  {(isPending || isTransitionPending) && !team.isCurrent && (
                    <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
