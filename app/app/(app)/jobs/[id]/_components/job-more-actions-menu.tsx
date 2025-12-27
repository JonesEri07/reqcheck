"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useActionState, startTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import {
  MoreHorizontal,
  FileText,
  Archive,
  ArchiveRestore,
  Trash2,
} from "lucide-react";
import {
  updateJobStatus,
  archiveJob,
  unarchiveJob,
  deleteJob,
} from "@/app/app/(app)/jobs/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { JobStatus } from "@/lib/db/schema";
import type { ActionState } from "@/lib/auth/proxy";

interface JobMoreActionsMenuProps {
  jobId: string;
  jobTitle: string;
  currentStatus: JobStatus;
}

export function JobMoreActionsMenu({
  jobId,
  jobTitle,
  currentStatus,
}: JobMoreActionsMenuProps) {
  const router = useRouter();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  // Local state to track current status for optimistic updates
  const [localStatus, setLocalStatus] = useState<JobStatus>(currentStatus);

  const [statusState, statusAction, isStatusPending] = useActionState<
    ActionState,
    FormData
  >(updateJobStatus, {});
  const [archiveState, archiveAction, isArchivePending] = useActionState<
    ActionState,
    FormData
  >(archiveJob, {});
  const [unarchiveState, unarchiveAction, isUnarchivePending] = useActionState<
    ActionState,
    FormData
  >(unarchiveJob, {});
  const [deleteState, deleteAction, isDeletePending] = useActionState<
    ActionState,
    FormData
  >(deleteJob, {});

  useToastAction(statusState);
  useToastAction(archiveState);
  useToastAction(unarchiveState);
  useToastAction(deleteState);

  // Sync local status with prop when it changes
  useEffect(() => {
    setLocalStatus(currentStatus);
  }, [currentStatus]);

  // Revert optimistic update on error
  useEffect(() => {
    if (statusState?.error) {
      setLocalStatus(currentStatus);
    }
    if (archiveState?.error) {
      setLocalStatus(currentStatus);
    }
    if (unarchiveState?.error) {
      setLocalStatus(currentStatus);
    }
  }, [
    statusState?.error,
    archiveState?.error,
    unarchiveState?.error,
    currentStatus,
  ]);

  // Refresh on success - local status is already updated optimistically
  useEffect(() => {
    if (
      statusState?.success ||
      archiveState?.success ||
      unarchiveState?.success
    ) {
      router.refresh();
    }
  }, [
    statusState?.success,
    archiveState?.success,
    unarchiveState?.success,
    router,
  ]);

  // Redirect on delete success
  useEffect(() => {
    if (deleteState?.success) {
      setDeleteDialogOpen(false);
      router.push("/app/jobs");
      router.refresh();
    }
  }, [deleteState?.success, router]);

  const handleToggleStatus = () => {
    const newStatus =
      localStatus === JobStatus.OPEN ? JobStatus.DRAFT : JobStatus.OPEN;
    // Optimistically update local status
    setLocalStatus(newStatus);
    const formData = new FormData();
    formData.append("id", jobId);
    formData.append("status", newStatus);

    startTransition(() => {
      statusAction(formData);
    });
  };

  const handleArchive = () => {
    // Optimistically update local status
    setLocalStatus(JobStatus.ARCHIVED);
    const formData = new FormData();
    formData.append("id", jobId);

    startTransition(() => {
      archiveAction(formData);
    });
  };

  const handleUnarchive = () => {
    // Optimistically update local status
    setLocalStatus(JobStatus.OPEN);
    const formData = new FormData();
    formData.append("id", jobId);

    startTransition(() => {
      unarchiveAction(formData);
    });
  };

  const handleDelete = () => {
    const formData = new FormData();
    formData.append("id", jobId);

    startTransition(() => {
      deleteAction(formData);
    });
  };

  const handleDeleteClick = () => {
    // Close dropdown first, then open dialog after a brief delay
    setDropdownOpen(false);
    // Use setTimeout to ensure dropdown closes before dialog opens
    setTimeout(() => {
      setDeleteDialogOpen(true);
    }, 100);
  };

  const isPending =
    isStatusPending ||
    isArchivePending ||
    isUnarchivePending ||
    isDeletePending;
  const isActive = localStatus === JobStatus.OPEN;
  const isArchived = localStatus === JobStatus.ARCHIVED;

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" disabled={isPending}>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={handleToggleStatus}
            disabled={isPending || isArchived}
          >
            <FileText className="h-4 w-4 mr-2" />
            {isActive ? "Set as Draft" : "Set as Active"}
          </DropdownMenuItem>
          {isArchived ? (
            <DropdownMenuItem onClick={handleUnarchive} disabled={isPending}>
              <ArchiveRestore className="h-4 w-4 mr-2" />
              Unarchive
            </DropdownMenuItem>
          ) : (
            <DropdownMenuItem onClick={handleArchive} disabled={isPending}>
              <Archive className="h-4 w-4 mr-2" />
              Archive
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDeleteClick}
            disabled={isPending}
            variant="destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          setDeleteDialogOpen(open);
          // Ensure dropdown is closed when dialog closes
          if (!open) {
            setDropdownOpen(false);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete &quot;{jobTitle}&quot;? This
              action cannot be undone. All associated applications and data will
              be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeletePending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeletePending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeletePending ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
