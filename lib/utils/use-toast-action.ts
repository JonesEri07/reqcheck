"use client";

import { useEffect } from "react";
import { showToastFromAction } from "./toast-action";
import type { ActionState } from "@/lib/auth/proxy";

/**
 * React hook to automatically show toasts from action state
 *
 * Usage:
 * ```tsx
 * const [state, formAction, pending] = useActionState(signUp, { error: '' });
 * useToastAction(state);
 * ```
 */
export function useToastAction(
  state: ActionState | null | undefined,
  options?: {
    onSuccess?: () => void;
    onError?: () => void;
  }
) {
  useEffect(() => {
    showToastFromAction(state, options);
  }, [state, options]);
}
