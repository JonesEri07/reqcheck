"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface RemoveSkillDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  skillName: string;
  jobCount?: number;
  onConfirm: () => void;
  isPending?: boolean;
}

export function RemoveSkillDialog({
  open,
  onOpenChange,
  skillName,
  jobCount,
  onConfirm,
  isPending = false,
}: RemoveSkillDialogProps) {
  const jobCountNum = jobCount ? jobCount : 0;
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove Skill from Library?</AlertDialogTitle>
          <AlertDialogDescription>
            This will disconnect "{skillName}" from all jobs and it will no
            longer be auto-detected. This action cannot be undone.
          </AlertDialogDescription>
          <AlertDialogFooter>
            {jobCountNum > 0 && (
              <span className="block mt-2 font-medium text-foreground">
                This skill is currently connected to {jobCount}{" "}
                {jobCount === 1 ? "job" : "jobs"}.
              </span>
            )}
          </AlertDialogFooter>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isPending}
          >
            {isPending ? "Removing..." : "Remove Skill"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
