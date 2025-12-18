/**
 * Toast Action Pattern
 *
 * This file defines the standard pattern for handling server action results
 * with toast notifications throughout the app.
 *
 * All server actions should return an ActionState with optional:
 * - error: string - Error message to display
 * - success: string - Success message to display
 * - toastType: 'error' | 'success' | 'info' | 'warning' - Optional override
 *
 * Client components should use the useToastAction hook to automatically
 * show toasts based on action results.
 */

import { toast } from "sonner";
import type { ActionState } from "@/lib/auth/proxy";

/**
 * Shows a toast notification based on action state
 * @param state - The action state returned from a server action
 * @param options - Optional configuration
 */
export function showToastFromAction(
  state: ActionState | null | undefined,
  options?: {
    onSuccess?: () => void;
    onError?: () => void;
  }
) {
  if (!state) return;

  // Only show toast for server errors (not validation errors)
  // Validation errors should be displayed inline next to fields
  if (state.error && !state.fieldErrors) {
    toast.error(state.error);
    options?.onError?.();
  } else if (state.success) {
    toast.success(state.success);
    options?.onSuccess?.();
  }
}

/**
 * Type guard to check if an action state has an error
 */
export function hasError(state: ActionState | null | undefined): boolean {
  return !!state?.error;
}

/**
 * Type guard to check if an action state has success
 */
export function hasSuccess(state: ActionState | null | undefined): boolean {
  return !!state?.success;
}
