"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState, startTransition } from "react";
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
import { deleteJob } from "@/app/app/(app)/jobs/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import type { ActionState } from "@/lib/auth/proxy";

interface DeleteJobButtonProps {
  jobId: string;
  jobTitle: string;
}

export function DeleteJobButton({ jobId, jobTitle }: DeleteJobButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const [state, formAction, pending] = useActionState<ActionState, FormData>(
    deleteJob,
    {}
  );

  useToastAction(state);

  const handleDelete = () => {
    const formData = new FormData();
    formData.append("id", jobId);

    startTransition(() => {
      formAction(formData);
    });
  };

  // Redirect on success
  useEffect(() => {
    if (state?.success) {
      setOpen(false);
      router.push("/app/jobs");
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={pending}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Job</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete &quot;{jobTitle}&quot;? This action
            cannot be undone. All associated applications and data will be
            permanently removed.
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
