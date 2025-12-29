"use client";

import { Button } from "@/components/ui/button";
import { ContactSalesButton } from "@/components/contact-sales-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  upgradeSubscriptionAction,
  downgradeSubscriptionAction,
  cancelSubscriptionAction,
  reactivateSubscriptionAction,
} from "@/lib/payments/actions";
import { customerPortalAction } from "@/lib/payments/actions";
import { useActionState, startTransition } from "react";
import {
  TeamDataWithMembers,
  PlanName,
  SubscriptionStatus,
  BillingPlan,
} from "@/lib/db/schema";
import { BILLING_CAPS } from "@/lib/constants/billing";
import useSWR from "swr";
import {
  Loader2,
  ArrowUp,
  ArrowDown,
  X,
  Check,
  AlertTriangle,
  Info,
} from "lucide-react";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
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
  TIER_QUESTION_LIMITS,
  TIER_CUSTOM_SKILL_LIMITS,
  TIER_JOB_LIMITS,
  TIER_TEAM_MEMBER_LIMITS,
  getQuestionLimit,
  getCustomSkillLimit,
  getJobLimit,
  getTeamMemberLimit,
} from "@/lib/constants/tier-limits";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface UsageStats {
  totalJobs: number;
  activeJobs: number;
  teamMembers: number;
  customSkills: number;
  maxQuestionsPerSkill: number;
}

export default function SubscriptionPage() {
  const router = useRouter();
  const [showDowngradeDialog, setShowDowngradeDialog] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState<Set<string>>(
    new Set()
  );
  const [pendingDowngrade, setPendingDowngrade] = useState<{
    priceId: string;
    meterPriceId?: string;
  } | null>(null);
  const { data: teamData, mutate: mutateTeamData } = useSWR<
    TeamDataWithMembers & {
      currentUserRole?: string;
      billingUsage?: {
        actualApplications: number;
        includedApplications: number;
      } | null;
      stopWidgetAtFreeCap?: boolean;
    }
  >("/api/team", fetcher);

  const { data: usageStats } = useSWR<UsageStats>(
    teamData ? "/api/team/usage" : null,
    fetcher
  );

  useEffect(() => {
    if (
      teamData &&
      teamData.currentUserRole !== undefined &&
      teamData.currentUserRole !== "owner"
    ) {
      router.push("/app/settings/general");
    }
  }, [teamData, router]);

  if (
    teamData &&
    teamData.currentUserRole !== undefined &&
    teamData.currentUserRole !== "owner"
  ) {
    return null;
  }

  const { data: subscriptionDetails } = useSWR(
    teamData?.stripeSubscriptionId
      ? `/api/subscription?subscriptionId=${teamData.stripeSubscriptionId}`
      : null,
    fetcher
  );
  const { data: priceIds } = useSWR<{
    basicMonthly: string;
    basicMeter: string;
    proMonthly: string;
    proMeter: string;
  }>("/api/pricing/ids", fetcher);

  const [upgradeState, upgradeAction, isUpgradePending] = useActionState<
    ActionState,
    FormData
  >(upgradeSubscriptionAction, {});

  const [downgradeState, downgradeAction, isDowngradePending] = useActionState<
    ActionState,
    FormData
  >(downgradeSubscriptionAction, {});

  const [cancelState, cancelAction, isCancelPending] = useActionState<
    ActionState,
    FormData
  >(cancelSubscriptionAction, {});

  const [reactivateState, reactivateAction, isReactivatePending] =
    useActionState<ActionState, FormData>(reactivateSubscriptionAction, {});

  useToastAction(upgradeState);
  useToastAction(downgradeState);
  useToastAction(cancelState);
  useToastAction(reactivateState);

  const currentPlan = teamData?.planName || PlanName.BASIC;
  const subscriptionStatus = teamData?.subscriptionStatus;
  const isActive = subscriptionStatus === SubscriptionStatus.ACTIVE;
  const isCancelling = subscriptionDetails?.subscription?.cancel_at_period_end;

  // Usage data
  const planName = (teamData?.planName as PlanName) || PlanName.BASIC;
  const usageLimit = BILLING_CAPS[planName] ?? BILLING_CAPS[PlanName.BASIC];
  const actualUsage = teamData?.billingUsage?.actualApplications || 0;
  const includedApplications =
    teamData?.billingUsage?.includedApplications || usageLimit;
  const overageApplications = Math.max(0, actualUsage - includedApplications);

  // Calculate usage percentages and determine if nearing limits
  const applicationsPercentage =
    usageLimit > 0 ? Math.min(100, (actualUsage / usageLimit) * 100) : 0;

  const activeJobsCount = usageStats?.activeJobs || 0;
  const jobsLimit = getJobLimit(planName);
  const jobsPercentage =
    jobsLimit > 0 ? Math.min(100, (activeJobsCount / jobsLimit) * 100) : 0;

  const teamMembersCount = usageStats?.teamMembers || 0;
  const teamMembersLimit = getTeamMemberLimit(planName);
  const teamMembersPercentage =
    teamMembersLimit > 0
      ? Math.min(100, (teamMembersCount / teamMembersLimit) * 100)
      : 0;

  const customSkillsCount = usageStats?.customSkills || 0;
  const customSkillsLimit = getCustomSkillLimit(planName);
  const customSkillsPercentage =
    customSkillsLimit > 0
      ? Math.min(100, (customSkillsCount / customSkillsLimit) * 100)
      : 0;

  // Check if any limit exceeds 85% for alert banner
  const isNearingLimit = useMemo(() => {
    return (
      applicationsPercentage >= 85 ||
      jobsPercentage >= 85 ||
      teamMembersPercentage >= 85 ||
      customSkillsPercentage >= 85
    );
  }, [
    applicationsPercentage,
    jobsPercentage,
    teamMembersPercentage,
    customSkillsPercentage,
  ]);

  // Get plan pricing
  const planPricing = useMemo(() => {
    if (currentPlan === PlanName.BASIC) return { price: 15, name: "Basic" };
    if (currentPlan === PlanName.PRO) return { price: 129, name: "Pro" };
    if (currentPlan === PlanName.ENTERPRISE)
      return { price: null, name: "Enterprise" };
    return { price: 15, name: "Basic" };
  }, [currentPlan]);

  // Get next invoice date and amount
  const nextInvoiceDate = useMemo(() => {
    if (!subscriptionDetails?.subscription?.current_period_end) return null;
    return new Date(
      subscriptionDetails.subscription.current_period_end * 1000
    ).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, [subscriptionDetails]);

  const nextInvoiceAmount = useMemo(() => {
    if (!subscriptionDetails?.subscription?.items) return null;
    const baseItem = subscriptionDetails.subscription.items.find(
      (item: any) => item.price.recurring?.usage_type !== "metered"
    );
    if (!baseItem?.price?.unit_amount) return null;
    return (baseItem.price.unit_amount / 100).toFixed(2);
  }, [subscriptionDetails]);

  // Overage rates based on plan
  const overageRates = useMemo(() => {
    if (planName === PlanName.BASIC) {
      return { application: 0.75 };
    }
    if (planName === PlanName.PRO) {
      return { application: 0.35 };
    }
    return { application: null }; // Enterprise - custom pricing
  }, [planName]);

  const handleUpgrade = (newPriceId: string, newMeterPriceId: string) => {
    if (!newPriceId) return;
    startTransition(() => {
      const formData = new FormData();
      formData.append("priceId", newPriceId);
      if (newMeterPriceId) {
        formData.append("meterPriceId", newMeterPriceId);
      }
      upgradeAction(formData);
    });
  };

  const handleDowngrade = (newPriceId: string, newMeterPriceId?: string) => {
    if (!newPriceId && !newMeterPriceId) return;
    setPendingDowngrade({ priceId: newPriceId, meterPriceId: newMeterPriceId });
    setShowDowngradeDialog(true);
  };

  const confirmDowngrade = () => {
    if (!pendingDowngrade) return;
    setShowDowngradeDialog(false);
    startTransition(() => {
      const formData = new FormData();
      if (pendingDowngrade.priceId) {
        formData.append("priceId", pendingDowngrade.priceId);
      }
      if (pendingDowngrade.meterPriceId) {
        formData.append("meterPriceId", pendingDowngrade.meterPriceId);
      }
      downgradeAction(formData);
      setPendingDowngrade(null);
    });
  };

  const handleCancel = () => {
    startTransition(() => {
      cancelAction(new FormData());
    });
  };

  const handleReactivate = () => {
    startTransition(() => {
      reactivateAction(new FormData());
    });
  };

  const dismissAlert = (alertId: string) => {
    setDismissedAlerts((prev) => new Set(prev).add(alertId));
  };

  if (!priceIds || !teamData) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        Subscription & Billing
      </h1>

      {/* Alert Banner - Show when nearing limits */}
      {isNearingLimit && !dismissedAlerts.has("limit-warning") && isActive && (
        <Alert className="mb-6 border-amber-500 bg-amber-500/10">
          <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          <AlertDescription className="flex items-center justify-between">
            <span>
              You're nearing your limits. You've used over 85% of at least one
              quota. Upgrade your plan to unlock more capacity and avoid service
              interruptions.
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-4 h-auto p-1"
              onClick={() => dismissAlert("limit-warning")}
            >
              <X className="h-4 w-4" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Current Plan Card */}
        <Card>
          <CardHeader>
            <CardTitle>Current Plan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold text-foreground">
                {planPricing.name} Plan
              </p>
              {planPricing.price !== null ? (
                <p className="text-lg text-muted-foreground">
                  ${planPricing.price.toLocaleString()} / month
                </p>
              ) : (
                <p className="text-lg text-muted-foreground">Custom pricing</p>
              )}
            </div>
            {isActive && nextInvoiceDate && (
              <p className="text-sm text-muted-foreground">
                Next renewal on {nextInvoiceDate}
              </p>
            )}
            {isActive && (
              <form action={customerPortalAction}>
                <Button type="submit" variant="outline" className="w-full">
                  Manage Billing in Stripe
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Next Invoice Card */}
        {isActive && nextInvoiceDate && nextInvoiceAmount && (
          <Card>
            <CardHeader>
              <CardTitle>Next Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Due Date</p>
                <p className="text-lg font-semibold text-foreground">
                  {nextInvoiceDate}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Amount</p>
                <p className="text-2xl font-bold text-foreground">
                  ${nextInvoiceAmount}
                </p>
              </div>
              <form action={customerPortalAction}>
                <Button type="submit" variant="link" className="p-0 h-auto">
                  View Past Invoices
                </Button>
              </form>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Current Usage Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Usage</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Verified Candidates (Applications) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Verified Candidates
              </span>
              <span className="text-sm text-muted-foreground">
                {actualUsage.toLocaleString()} / {usageLimit.toLocaleString()}
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  applicationsPercentage >= 100
                    ? "bg-destructive"
                    : applicationsPercentage >= 85
                      ? "bg-amber-500"
                      : "bg-primary"
                }`}
                style={{
                  width: `${Math.min(applicationsPercentage, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(applicationsPercentage)}% used
            </p>
          </div>

          {/* Active Job Posts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Active Job Posts
              </span>
              <span className="text-sm text-muted-foreground">
                {activeJobsCount.toLocaleString()} /{" "}
                {jobsLimit.toLocaleString()}
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  jobsPercentage >= 100
                    ? "bg-destructive"
                    : jobsPercentage >= 85
                      ? "bg-amber-500"
                      : "bg-primary"
                }`}
                style={{
                  width: `${Math.min(jobsPercentage, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(jobsPercentage)}% used
            </p>
          </div>

          {/* Team Seats */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">
                Team Seats
              </span>
              <span className="text-sm text-muted-foreground">
                {teamMembersCount.toLocaleString()} /{" "}
                {teamMembersLimit.toLocaleString()}
              </span>
            </div>
            <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  teamMembersPercentage >= 100
                    ? "bg-destructive"
                    : teamMembersPercentage >= 85
                      ? "bg-amber-500"
                      : "bg-primary"
                }`}
                style={{
                  width: `${Math.min(teamMembersPercentage, 100)}%`,
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {Math.round(teamMembersPercentage)}% used
            </p>
          </div>

          {/* Custom Skills (optional, if you want to show it) */}
          {customSkillsLimit > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  Custom Skills
                </span>
                <span className="text-sm text-muted-foreground">
                  {customSkillsCount.toLocaleString()} /{" "}
                  {customSkillsLimit.toLocaleString()}
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    customSkillsPercentage >= 100
                      ? "bg-destructive"
                      : customSkillsPercentage >= 85
                        ? "bg-amber-500"
                        : "bg-primary"
                  }`}
                  style={{
                    width: `${Math.min(customSkillsPercentage, 100)}%`,
                  }}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(customSkillsPercentage)}% used
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade/Downgrade Options */}
      {isActive && currentPlan !== PlanName.ENTERPRISE && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Change Plan</CardTitle>
            <CardDescription>
              Upgrade for immediate access or downgrade at period end
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentPlan === PlanName.BASIC && priceIds.proMonthly && (
                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Pro
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        $129/month • 500 free applications • ATS integrations
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        handleUpgrade(priceIds.proMonthly, priceIds.proMeter)
                      }
                      disabled={isUpgradePending}
                    >
                      {isUpgradePending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Upgrading...
                        </>
                      ) : (
                        <>
                          <ArrowUp className="mr-2 h-4 w-4" />
                          Upgrade Now
                        </>
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    You'll be charged a prorated amount for the remainder of
                    this month. Changes take effect immediately.
                  </p>
                </div>
              )}

              {(currentPlan === PlanName.BASIC ||
                currentPlan === PlanName.PRO) && (
                <div className="border border-border rounded-lg p-4 bg-muted/50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Enterprise
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        All Pro features • Dedicated support
                      </p>
                    </div>
                    <ContactSalesButton variant="outline" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Enterprise plans require custom pricing. Please contact our
                    sales team to upgrade.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Downgrade to Basic */}
      {isActive &&
        currentPlan === PlanName.PRO &&
        priceIds.basicMeter &&
        priceIds.basicMonthly && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Downgrade to Basic</CardTitle>
              <CardDescription>
                Switch to the basic plan at the end of your billing period
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border border-border rounded-lg p-4">
                <p className="text-sm text-muted-foreground mb-4">
                  You'll lose access to Pro features at the end of your current
                  billing period. You'll keep all privileges until then.
                </p>
                <Button
                  onClick={() =>
                    handleDowngrade(priceIds.basicMonthly, priceIds.basicMeter)
                  }
                  disabled={isDowngradePending}
                  variant="outline"
                >
                  {isDowngradePending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    <>
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Downgrade to Basic
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      {/* Cancel Subscription */}
      {isActive && !isCancelling && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Cancel Subscription</CardTitle>
            <CardDescription>
              Cancel your subscription at the end of the billing period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/10">
              <p className="text-sm text-foreground mb-4">
                Your subscription will be cancelled at the end of your current
                billing period. You'll retain all features and privileges until
                then. To request a refund, please contact support.
              </p>
              <Button
                onClick={handleCancel}
                disabled={isCancelPending}
                variant="destructive"
              >
                {isCancelPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <X className="mr-2 h-4 w-4" />
                    Cancel Subscription
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Reactivate Subscription */}
      {isActive && isCancelling && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Reactivate Subscription</CardTitle>
            <CardDescription>
              Keep your subscription active beyond the current period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-primary/50 rounded-lg p-4 bg-primary/10">
              <p className="text-sm text-foreground mb-4">
                Your subscription is scheduled to cancel. Click below to
                reactivate and continue your subscription.
              </p>
              <Button
                onClick={handleReactivate}
                disabled={isReactivatePending}
                variant="default"
              >
                {isReactivatePending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Reactivate Subscription
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Downgrade Confirmation Dialog */}
      <AlertDialog
        open={showDowngradeDialog}
        onOpenChange={setShowDowngradeDialog}
      >
        <AlertDialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle>Confirm Downgrade to Basic</AlertDialogTitle>
            <AlertDialogDescription>
              Please review the following changes that will take effect at the
              start of your next billing cycle:
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-4 py-4">
            {teamData?.teamMembers && teamData.teamMembers.length > 1 && (
              <div className="border border-destructive/50 rounded-lg p-4 bg-destructive/10">
                <h4 className="font-semibold text-destructive mb-2">
                  ⚠️ Team Members Will Lose Access
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  You currently have {teamData.teamMembers.length} team member
                  {teamData.teamMembers.length !== 1 ? "s" : ""} (including
                  yourself). Basic plans only support a single user (the owner).
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>
                    All team members except you will lose access to the team at
                    the start of your next billing cycle.
                  </strong>{" "}
                  Make sure to communicate this change with your team before
                  downgrading.
                </p>
              </div>
            )}

            <div className="border border-border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Tier Cap Changes</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Questions per skill:
                  </span>
                  <span className="font-medium">
                    {TIER_QUESTION_LIMITS[PlanName.PRO]} →{" "}
                    {TIER_QUESTION_LIMITS[PlanName.BASIC]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Custom skills:</span>
                  <span className="font-medium">
                    {TIER_CUSTOM_SKILL_LIMITS[PlanName.PRO]} →{" "}
                    {TIER_CUSTOM_SKILL_LIMITS[PlanName.BASIC]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Total jobs:</span>
                  <span className="font-medium">
                    {TIER_JOB_LIMITS[PlanName.PRO]} →{" "}
                    {TIER_JOB_LIMITS[PlanName.BASIC]}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">
                    Included applications:
                  </span>
                  <span className="font-medium">
                    {BILLING_CAPS[PlanName.PRO]} →{" "}
                    {BILLING_CAPS[PlanName.BASIC]}
                  </span>
                </div>
              </div>
            </div>

            <div className="border border-border rounded-lg p-4 bg-muted/50">
              <h4 className="font-semibold mb-3">Feature Changes</h4>
              <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                <li>Team members feature will be removed</li>
                <li>Lower limits on questions, skills, and jobs</li>
                <li>Reduced included application cap</li>
              </ul>
            </div>

            <div className="border border-primary/50 rounded-lg p-4 bg-primary/10">
              <p className="text-sm font-medium text-foreground mb-1">
                ⏰ When Changes Take Effect
              </p>
              <p className="text-sm text-muted-foreground">
                All changes will take effect at the start of your next billing
                cycle. You'll keep all Pro features and access until then.
              </p>
            </div>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setPendingDowngrade(null)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDowngrade}
              disabled={isDowngradePending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDowngradePending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Scheduling...
                </>
              ) : (
                "Confirm Downgrade"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
