"use client";

import { useCallback } from "react";
import { useTierProtection } from "./tier-protection-context";
import type { PlanName } from "@/lib/db/schema";

interface UseTierProtectedCallbackConfig {
  currentCount: number;
  planName: PlanName | null | undefined;
  limitType: "customQuestions";
  dialogTitle?: string;
  dialogDescription?: string | React.ReactNode;
  featureName?: string;
}

/**
 * Hook that returns a protected callback function.
 * The callback will only execute if tier limits are not reached.
 * If limit is reached, shows upgrade dialog and prevents execution.
 *
 * @example
 * const handleCreate = useTierProtectedCallback({
 *   currentCount: totalQuestions,
 *   planName,
 *   limitType: "customQuestions",
 *   callback: () => setCreateSheetOpen(true),
 * });
 */
export function useTierProtectedCallback<T extends (...args: any[]) => any>(
  config: UseTierProtectedCallbackConfig,
  callback: T
): T {
  const { checkTierLimit } = useTierProtection();

  return useCallback(
    ((...args: Parameters<T>) => {
      // Check tier limit first
      const canProceed = checkTierLimit({
        currentCount: config.currentCount,
        planName: config.planName as string | null | undefined,
        limitType: config.limitType,
        dialogTitle: config.dialogTitle,
        dialogDescription: config.dialogDescription,
        featureName: config.featureName,
      });

      // Only execute callback if limit check passes
      if (canProceed) {
        return callback(...args);
      }
    }) as T,
    [
      checkTierLimit,
      config.currentCount,
      config.planName,
      config.limitType,
      config.dialogTitle,
      config.dialogDescription,
      config.featureName,
      callback,
    ]
  );
}
