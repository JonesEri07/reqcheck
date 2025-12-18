"use client";

import { useActionState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { deleteChallengeQuestion } from "@/app/app/skills/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";

interface DeleteChallengeButtonProps {
  questionId: string;
  skillId: string;
  questionPrompt: string;
}

export function DeleteChallengeButton({
  questionId,
  skillId,
  questionPrompt,
}: DeleteChallengeButtonProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(deleteChallengeQuestion, {
    error: "",
  });

  useToastAction(state);

  // Redirect to skill page after successful deletion
  useEffect(() => {
    if ((state as any)?.success) {
      router.push(`/app/skills/${skillId}`);
    }
  }, [(state as any)?.success, router, skillId]);

  const handleDelete = () => {
    const formData = new FormData();
    formData.append("id", questionId);
    startTransition(() => {
      formAction(formData);
    });
  };

  // Truncate prompt for display in dialog
  const truncatedPrompt =
    questionPrompt.length > 50
      ? `${questionPrompt.substring(0, 50)}...`
      : questionPrompt;

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          disabled={pending}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Challenge Question</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this challenge question?
            {truncatedPrompt && (
              <>
                <br />
                <br />
                <strong>&quot;{truncatedPrompt}&quot;</strong>
              </>
            )}
            <br />
            <br />
            This action cannot be undone. All data associated with this question
            will be permanently deleted.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={pending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {pending ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
