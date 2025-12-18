"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { UpgradeDialog } from "@/components/upgrade-dialog";
import {
  getCustomQuestionLimit,
  hasReachedCustomQuestionLimit,
  getCustomSkillLimit,
  hasReachedCustomSkillLimit,
  hasFeatureAccess,
} from "@/lib/constants/tier-limits";
import { PlanName } from "@/lib/db/schema";

interface TierLimitCheckConfig {
  currentCount: number;
  planName: string | null | undefined;
  limitType: "customQuestions" | "customSkills";
  dialogTitle?: string;
  dialogDescription?: string | ReactNode;
  featureName?: string;
}

interface FeatureAccessCheckConfig {
  planName: string | null | undefined;
  minimumTier: PlanName;
  dialogTitle?: string;
  dialogDescription?: string | ReactNode;
  featureName?: string;
}

interface TierProtectionContextValue {
  showUpgradeDialog: (config: UpgradeDialogConfig) => void;
  hideUpgradeDialog: () => void;
  checkTierLimit: (config: TierLimitCheckConfig) => boolean;
  checkFeatureAccess: (config: FeatureAccessCheckConfig) => boolean;
}

export interface UpgradeDialogConfig {
  title: string;
  description: string | ReactNode;
  currentLimit?: number; // Optional - undefined for feature checks, number for limit checks
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
            limitType === "customQuestions" || limitType === "customSkills"
              ? 500
              : limit
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
        ? limitType === "customQuestions" || limitType === "customSkills"
          ? 500
          : limit
        : undefined,
      featureName,
      showUpgrade,
      planName: planName || undefined,
    });

    return false;
  };

  const checkFeatureAccess = (config: FeatureAccessCheckConfig): boolean => {
    const {
      planName,
      minimumTier,
      dialogTitle,
      dialogDescription,
      featureName = "this feature",
    } = config;

    const planNameEnum = (planName as PlanName) || PlanName.FREE;

    // Check if plan meets minimum tier requirement
    if (hasFeatureAccess(planNameEnum, minimumTier)) {
      return true;
    }

    // Determine upgrade target based on minimum tier
    const upgradeTarget =
      minimumTier === PlanName.PRO
        ? "Pro"
        : minimumTier === PlanName.ENTERPRISE
          ? "Enterprise"
          : "Pro";

    // Check if user is already on the required tier or higher (shouldn't happen, but handle gracefully)
    const isAlreadyOnRequiredTier =
      minimumTier === PlanName.PRO &&
      (planName === "PRO" || planName === "ENTERPRISE");
    const isAlreadyOnEnterprise =
      minimumTier === PlanName.ENTERPRISE && planName === "ENTERPRISE";
    const showUpgrade = !isAlreadyOnRequiredTier && !isAlreadyOnEnterprise;

    // Default dialog content
    const defaultTitle = dialogTitle || "Upgrade Required";
    const defaultDescription =
      dialogDescription ||
      (showUpgrade
        ? `${featureName} is available on ${upgradeTarget}+ plans. Upgrade to ${upgradeTarget} to access this feature.`
        : `${featureName} is not available on your current plan.`);

    // Show dialog and return false to prevent action
    showUpgradeDialog({
      title: defaultTitle,
      description: defaultDescription,
      currentLimit: undefined, // Not applicable for feature checks - hide limit section
      upgradeLimit: undefined, // Not applicable for feature checks
      featureName,
      showUpgrade,
      planName: planName || undefined,
    });

    return false;
  };

  return (
    <TierProtectionContext.Provider
      value={{
        showUpgradeDialog,
        hideUpgradeDialog,
        checkTierLimit,
        checkFeatureAccess,
      }}
    >
      {children}
      {dialogConfig && (
        <UpgradeDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          title={dialogConfig.title}
          description={dialogConfig.description}
          {...(dialogConfig.currentLimit !== undefined && {
            currentLimit: dialogConfig.currentLimit,
          })}
          upgradeLimit={dialogConfig.upgradeLimit}
          featureName={dialogConfig.featureName}
          showUpgrade={dialogConfig.showUpgrade ?? true}
          planName={dialogConfig.planName}
        />
      )}
    </TierProtectionContext.Provider>
  );
}
