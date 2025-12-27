"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { useActionState, startTransition } from "react";
import { addSkillFromGlobal } from "@/app/app/(app)/skills/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import type { ActionState } from "@/lib/auth/proxy";

interface AddToLibraryButtonProps {
  skillTaxonomyId: string;
}

export function AddToLibraryButton({
  skillTaxonomyId,
}: AddToLibraryButtonProps) {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    addSkillFromGlobal,
    {}
  );

  useToastAction(state);

  const handleClick = () => {
    const formData = new FormData();
    formData.set("skillTaxonomyId", skillTaxonomyId);
    startTransition(() => {
      formAction(formData);
    });
  };

  // Refresh on success
  useEffect(() => {
    if (state?.success) {
      router.refresh();
    }
  }, [state?.success, router]);

  return (
    <Button onClick={handleClick} disabled={isPending} className="gap-2">
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
      Add to Library
    </Button>
  );
}
