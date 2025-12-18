"use client";

import { useCallback } from "react";
import { useTierProtection } from "./tier-protection-context";
import type { PlanName } from "@/lib/db/schema";

interface UseTierLimitProtectedCallbackConfig {
  currentCount: number;
  planName: PlanName | null | undefined;
  limitType: "customQuestions" | "customSkills";
  dialogTitle?: string;
  dialogDescription?: string | React.ReactNode;
  featureName?: string;
}

interface UseTierFeatureProtectedCallbackConfig {
  planName: PlanName | null | undefined;
  minimumTier: PlanName;
  dialogTitle?: string;
  dialogDescription?: string | React.ReactNode;
  featureName?: string;
}

type UseTierProtectedCallbackConfig =
  | UseTierLimitProtectedCallbackConfig
  | UseTierFeatureProtectedCallbackConfig;

/**
 * Type guard to check if config is for limit protection
 */
function isLimitConfig(
  config: UseTierProtectedCallbackConfig
): config is UseTierLimitProtectedCallbackConfig {
  return "limitType" in config;
}

/**
 * Hook that returns a protected callback function.
 * The callback will only execute if tier limits are not reached or feature access is available.
 * If limit is reached or feature is not available, shows upgrade dialog and prevents execution.
 *
 * Supports two modes:
 * 1. Limit protection - checks if a limit (e.g., custom questions) has been reached
 * 2. Feature protection - checks if the plan meets the minimum tier requirement for a feature
 *
 * @example Limit protection:
 * const handleCreate = useTierProtectedCallback({
 *   currentCount: totalQuestions,
 *   planName,
 *   limitType: "customQuestions", // or "customSkills"
 *   callback: () => setCreateSheetOpen(true),
 * });
 *
 * @example Feature protection:
 * const handleConnect = useTierProtectedCallback({
 *   planName,
 *   minimumTier: PlanName.PRO,
 *   featureName: "ATS Integrations",
 *   callback: () => router.push("/app/integrations/greenhouse"),
 * });
 */
export function useTierProtectedCallback<T extends (...args: any[]) => any>(
  config: UseTierProtectedCallbackConfig,
  callback: T
): T {
  const { checkTierLimit, checkFeatureAccess } = useTierProtection();

  return useCallback(
    ((...args: Parameters<T>) => {
      let canProceed: boolean;

      if (isLimitConfig(config)) {
        // Limit-based protection
        canProceed = checkTierLimit({
          currentCount: config.currentCount,
          planName: config.planName as string | null | undefined,
          limitType: config.limitType,
          dialogTitle: config.dialogTitle,
          dialogDescription: config.dialogDescription,
          featureName: config.featureName,
        });
      } else {
        // Feature-based protection
        canProceed = checkFeatureAccess({
          planName: config.planName as string | null | undefined,
          minimumTier: config.minimumTier,
          dialogTitle: config.dialogTitle,
          dialogDescription: config.dialogDescription,
          featureName: config.featureName,
        });
      }

      // Only execute callback if check passes
      if (canProceed) {
        return callback(...args);
      }
    }) as T,
    [checkTierLimit, checkFeatureAccess, config, callback]
  );
}
