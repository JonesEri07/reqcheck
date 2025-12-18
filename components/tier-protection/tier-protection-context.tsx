"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import {
  getCustomQuestionLimit,
  hasReachedCustomQuestionLimit,
} from "@/lib/constants/tier-limits";
import type { PlanName } from "@/lib/db/schema";

interface TierLimitCheckConfig {
  currentCount: number;
  planName: string | null | undefined;
  limitType: "customQuestions";
  dialogTitle?: string;
  dialogDescription?: string | ReactNode;
  featureName?: string;
}

interface TierProtectionContextValue {
  showUpgradeDialog: (config: UpgradeDialogConfig) => void;
  hideUpgradeDialog: () => void;
  checkTierLimit: (config: TierLimitCheckConfig) => boolean;
}

export interface UpgradeDialogConfig {
  title: string;
  description: string | ReactNode;
  currentLimit: number;
  upgradeLimit?: number; // Optional - only shown if showUpgrade is true
  featureName?: string;
  showUpgrade?: boolean; // Whether to show upgrade option (default: true)
  planName?: string; // Current plan name for display
}

const TierProtectionContext = createContext<
  TierProtectionContextValue | undefined
>(undefined);

export function useTierProtection() {
  const context = useContext(TierProtectionContext);
  if (!context) {
    throw new Error(
      "useTierProtection must be used within TierProtectionProvider"
    );
  }
  return context;
}

interface TierProtectionProviderProps {
  children: ReactNode;
}

export function TierProtectionProvider({
  children,
}: TierProtectionProviderProps) {
  const [dialogConfig, setDialogConfig] = useState<UpgradeDialogConfig | null>(
    null
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const showUpgradeDialog = (config: UpgradeDialogConfig) => {
    setDialogConfig(config);
    setIsDialogOpen(true);
  };

  const hideUpgradeDialog = () => {
    setIsDialogOpen(false);
    // Clear config after animation completes
    setTimeout(() => setDialogConfig(null), 200);
  };

  const checkTierLimit = (config: TierLimitCheckConfig): boolean => {
    const {
      currentCount,
      planName,
      limitType,
      dialogTitle,
      dialogDescription,
      featureName = "this feature",
    } = config;

    // Get the appropriate limit based on limit type
    const getLimit = () => {
      switch (limitType) {
        case "customQuestions":
          return getCustomQuestionLimit(planName as PlanName);
        default:
          return 0;
      }
    };

    // Check if limit is reached
    const checkLimit = () => {
      switch (limitType) {
        case "customQuestions":
          return hasReachedCustomQuestionLimit(
            currentCount,
            planName as PlanName
          );
        default:
          return false;
      }
    };

    const limit = getLimit();
    const isLimitReached = checkLimit();

    // If limit not reached, return true to allow action
    if (!isLimitReached) {
      return true;
    }

    // Check if user is already on Pro or Enterprise (no upgrade available)
    const isProOrEnterprise = planName === "PRO" || planName === "ENTERPRISE";
    const showUpgrade = !isProOrEnterprise;

    // Default dialog content
    const defaultTitle = dialogTitle || "Limit Reached";
    const defaultDescription =
      dialogDescription ||
      (showUpgrade
        ? `You've reached the maximum of ${limit} ${featureName} for your ${
            planName || "Free"
          } plan. Upgrade to Pro to create up to ${
            limitType === "customQuestions" ? 500 : limit
          } ${featureName}.`
        : `You've reached the maximum of ${limit} ${featureName} for your ${
            planName || "Pro"
          } plan. This is the highest limit available.`);

    // Show dialog and return false to prevent action
    showUpgradeDialog({
      title: defaultTitle,
      description: defaultDescription,
      currentLimit: limit,
      upgradeLimit: showUpgrade
        ? limitType === "customQuestions"
          ? 500
          : limit
        : undefined,
      featureName,
      showUpgrade,
      planName: planName || undefined,
    });

    return false;
  };

  return (
    <TierProtectionContext.Provider
      value={{ showUpgradeDialog, hideUpgradeDialog, checkTierLimit }}
    >
      {children}
      {dialogConfig && (
        <UpgradeDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={dialogConfig.title}
          description={dialogConfig.description}
          currentLimit={dialogConfig.currentLimit}
          upgradeLimit={dialogConfig.upgradeLimit}
          featureName={dialogConfig.featureName}
          showUpgrade={dialogConfig.showUpgrade ?? true}
          planName={dialogConfig.planName}
        />
      )}
    </TierProtectionContext.Provider>
  );
}
