"use client";

import { useActionState, useEffect, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { duplicateChallengeQuestion } from "@/app/app/skills/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";

interface DuplicateChallengeButtonProps {
  questionId: string;
  skillId: string;
}

export function DuplicateChallengeButton({
  questionId,
  skillId,
}: DuplicateChallengeButtonProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(
    duplicateChallengeQuestion,
    {
      error: "",
    }
  );

  useToastAction(state);

  // Redirect to the new duplicated question after successful duplication
  useEffect(() => {
    if ((state as any)?.success && (state as any)?.questionId) {
      const newQuestionId = (state as any).questionId;
      startTransition(() => {
        // Use replace to avoid adding to history stack
        router.replace(`/app/skills/${skillId}/challenges/${newQuestionId}`);
      });
    }
  }, [(state as any)?.success, (state as any)?.questionId, router, skillId]);

  const handleDuplicate = () => {
    const formData = new FormData();
    formData.append("id", questionId);
    startTransition(() => {
      formAction(formData);
    });
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleDuplicate}
      disabled={pending}
    >
      <Copy className="h-4 w-4 mr-2" />
      {pending ? "Duplicating..." : "Duplicate"}
    </Button>
  );
}
