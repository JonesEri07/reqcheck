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
  TrendingUp,
  Activity,
} from "lucide-react";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateStopWidgetAtFreeCap } from "@/app/app/settings/configuration/actions";

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SubscriptionPage() {
  const router = useRouter();
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

  useEffect(() => {
    // Only redirect if we have data AND the role is explicitly not owner
    // Don't redirect if teamData is still loading (currentUserRole is undefined)
    if (
      teamData &&
      teamData.currentUserRole !== undefined &&
      teamData.currentUserRole !== "owner"
    ) {
      router.push("/app/settings/general");
    }
  }, [teamData, router]);

  // Don't render if not owner (will redirect)
  // But wait for data to load first
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
    proMonthly: string;
    proAnnual: string;
    proMeter: string;
    freeMeter: string;
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

  // Show toasts for all actions
  useToastAction(upgradeState);
  useToastAction(downgradeState);
  useToastAction(cancelState);
  useToastAction(reactivateState);

  const currentPlan = teamData?.planName || PlanName.FREE;
  const currentBillingPlan = teamData?.billingPlan || BillingPlan.FREE;
  const subscriptionStatus = teamData?.subscriptionStatus;
  const isActive = subscriptionStatus === SubscriptionStatus.ACTIVE;
  const isCancelling = subscriptionDetails?.subscription?.cancel_at_period_end;

  // Usage data
  const planName = (teamData?.planName as PlanName) || PlanName.FREE;
  const usageLimit = BILLING_CAPS[planName];
  const actualUsage = teamData?.billingUsage?.actualApplications || 0;
  const includedApplications =
    teamData?.billingUsage?.includedApplications || usageLimit;
  const overageApplications = Math.max(0, actualUsage - includedApplications);
  const remaining = Math.max(0, usageLimit - actualUsage);
  const usagePercentage =
    usageLimit > 0 ? Math.min(100, (actualUsage / usageLimit) * 100) : 0;
  const stopWidgetAtFreeCap = teamData?.stopWidgetAtFreeCap ?? true;

  const [
    updateStopWidgetState,
    updateStopWidgetAction,
    isUpdateStopWidgetPending,
  ] = useActionState<ActionState, FormData>(async (prevState, formData) => {
    const result = await updateStopWidgetAtFreeCap(prevState, formData);
    return result as ActionState;
  }, {});

  useToastAction(updateStopWidgetState);

  // Refresh team data after successful update
  useEffect(() => {
    if (updateStopWidgetState?.success) {
      mutateTeamData();
    }
  }, [updateStopWidgetState?.success, mutateTeamData]);

  const handleStopWidgetToggle = (checked: boolean) => {
    startTransition(() => {
      const formData = new FormData();
      formData.append("stopWidgetAtFreeCap", checked ? "true" : "false");
      updateStopWidgetAction(formData);
    });
  };

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
    startTransition(() => {
      const formData = new FormData();
      if (newPriceId) {
        formData.append("priceId", newPriceId);
      }
      if (newMeterPriceId) {
        formData.append("meterPriceId", newMeterPriceId);
      }
      downgradeAction(formData);
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

  if (!priceIds) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <>
      <h1 className="text-lg lg:text-2xl font-medium text-foreground mb-6">
        Subscription Management
      </h1>

      {/* Usage & Billing Overview */}
      <Card className="mb-6 border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Usage & Billing Overview
              </CardTitle>
              <CardDescription className="mt-1">
                Monitor your current plan usage and billing information
              </CardDescription>
            </div>
            <form action={customerPortalAction}>
              <Button type="submit" variant="outline">
                View History
              </Button>
            </form>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Current Plan Info */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-muted/50 rounded-lg border">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
              <p className="text-2xl font-bold text-foreground">
                {currentPlan === PlanName.FREE && "Free"}
                {currentPlan === PlanName.PRO && "Pro"}
                {currentPlan === PlanName.ENTERPRISE && "Enterprise"}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {(() => {
                  if (isActive) {
                    return currentBillingPlan === BillingPlan.ANNUAL
                      ? "Billed annually"
                      : currentBillingPlan === BillingPlan.MONTHLY
                        ? "Billed monthly"
                        : "Usage-based only";
                  }
                  if (subscriptionStatus === SubscriptionStatus.PAUSED) {
                    return "Subscription paused";
                  }
                  if (subscriptionStatus === SubscriptionStatus.CANCELLED) {
                    return "Subscription cancelled";
                  }
                  return "No active subscription";
                })()}
              </p>
            </div>
          </div>

          {/* Usage Metrics */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <p className="text-sm font-medium">
                  Application Usage This Month
                </p>
              </div>
              <p className="text-sm font-semibold">
                {actualUsage.toLocaleString()} total
              </p>
            </div>

            {/* Usage Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                <p className="text-xs text-muted-foreground mb-1">
                  Free Tier Included
                </p>
                <p className="text-2xl font-bold text-foreground">
                  {usageLimit.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {actualUsage <= usageLimit
                    ? `${(usageLimit - actualUsage).toLocaleString()} remaining`
                    : "Limit reached"}
                </p>
              </div>
              {overageApplications > 0 ? (
                <div className="p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <p className="text-xs text-amber-700 dark:text-amber-400 mb-1">
                    Overage Usage
                  </p>
                  <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                    {overageApplications.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Charged per application
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-background rounded-lg border">
                  <p className="text-xs text-muted-foreground mb-1">
                    Overage Usage
                  </p>
                  <p className="text-2xl font-bold text-foreground">0</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Within free tier
                  </p>
                </div>
              )}
            </div>

            {/* Progress Bar - Show visual of free tier usage */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Free tier usage</span>
                <span>
                  {Math.min(actualUsage, usageLimit).toLocaleString()} /{" "}
                  {usageLimit.toLocaleString()}
                </span>
              </div>
              <div className="relative h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full transition-all duration-500 ${
                    actualUsage >= usageLimit
                      ? "bg-amber-500"
                      : usagePercentage >= 75
                        ? "bg-amber-500"
                        : "bg-primary"
                  }`}
                  style={{
                    width: `${Math.min(usagePercentage, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* Stop Widget at Free Cap Setting */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5 flex-1">
                <Label
                  htmlFor="stopWidgetAtFreeCap"
                  className="text-sm font-medium"
                >
                  Stop Widget at Free Cap
                </Label>
                <p className="text-xs text-muted-foreground">
                  Automatically disable the widget when the free tier limit is
                  reached
                </p>
              </div>
              <Switch
                id="stopWidgetAtFreeCap"
                checked={stopWidgetAtFreeCap}
                onCheckedChange={handleStopWidgetToggle}
                disabled={isUpdateStopWidgetPending}
              />
            </div>
          </div>
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
              {/* Upgrade to Pro Monthly */}
              {currentPlan === PlanName.FREE && priceIds.proMonthly && (
                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Pro Monthly
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        $99/month • 500 free applications • ATS integrations
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

              {/* Upgrade to Pro Annual */}
              {currentPlan === PlanName.FREE && priceIds.proAnnual && (
                <div className="border border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg text-foreground">
                        Pro Annual
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        $990/year • 500 free applications • ATS integrations
                      </p>
                    </div>
                    <Button
                      onClick={() =>
                        handleUpgrade(priceIds.proAnnual, priceIds.proMeter)
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
                    Full annual charge. Annual period starts today. Changes take
                    effect immediately.
                  </p>
                </div>
              )}

              {/* Switch between Monthly/Annual for Pro */}
              {currentPlan === PlanName.PRO && (
                <>
                  {currentBillingPlan === BillingPlan.MONTHLY &&
                    priceIds.proAnnual && (
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              Pro Annual
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              $990/year • Save $198/year
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              handleUpgrade(
                                priceIds.proAnnual,
                                priceIds.proMeter
                              )
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
                                Switch to Annual
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          You'll be charged a prorated amount. Changes take
                          effect immediately.
                        </p>
                      </div>
                    )}
                  {currentBillingPlan === BillingPlan.ANNUAL &&
                    priceIds.proMonthly && (
                      <div className="border border-border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg text-foreground">
                              Pro Monthly
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              $99/month
                            </p>
                          </div>
                          <Button
                            onClick={() =>
                              handleDowngrade(
                                priceIds.proMonthly,
                                priceIds.proMeter
                              )
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
                                Switch to Monthly
                              </>
                            )}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Changes will take effect at the end of your current
                          annual billing period.
                        </p>
                      </div>
                    )}
                </>
              )}

              {/* Upgrade to Enterprise */}
              {(currentPlan === PlanName.FREE ||
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

      {/* Downgrade to Free */}
      {isActive && currentPlan === PlanName.PRO && priceIds.freeMeter && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Downgrade to Free</CardTitle>
            <CardDescription>
              Switch to the free plan at the end of your billing period
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border border-border rounded-lg p-4">
              <p className="text-sm text-muted-foreground mb-4">
                You'll lose access to Pro features at the end of your current
                billing period. You'll keep all privileges until then.
              </p>
              <Button
                onClick={() => handleDowngrade("", priceIds.freeMeter)}
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
                    Downgrade to Free
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
    </>
  );
}
