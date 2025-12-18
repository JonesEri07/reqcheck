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
import { useActionState, startTransition } from "react";
import {
  TeamDataWithMembers,
  PlanName,
  SubscriptionStatus,
  BillingPlan,
} from "@/lib/db/schema";
import useSWR from "swr";
import { Loader2, ArrowUp, ArrowDown, X, Check } from "lucide-react";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type ActionState = {
  error?: string;
  success?: string;
};

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function SubscriptionPage() {
  const router = useRouter();
  const { data: teamData } = useSWR<
    TeamDataWithMembers & { currentUserRole?: string }
  >("/api/team", fetcher);

  useEffect(() => {
    if (teamData && teamData.currentUserRole !== "owner") {
      router.push("/app/settings/general");
    }
  }, [teamData, router]);

  // Don't render if not owner (will redirect)
  if (teamData && teamData.currentUserRole !== "owner") {
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
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Subscription Management
        </h1>
        <p className="text-gray-600">
          Manage your subscription, upgrade, downgrade, or cancel.
        </p>
      </div>

      {/* Current Subscription */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Subscription</CardTitle>
          <CardDescription>
            Your current plan and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="text-lg font-semibold">
                {currentPlan === PlanName.FREE && "Free"}
                {currentPlan === PlanName.PRO && "Pro"}
                {currentPlan === PlanName.ENTERPRISE && "Enterprise"}
              </p>
            </div>
            {isActive && (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Billing Cycle</p>
                  <p className="text-lg">
                    {currentBillingPlan === BillingPlan.ANNUAL
                      ? "Annual"
                      : currentBillingPlan === BillingPlan.MONTHLY
                        ? "Monthly"
                        : "Usage-based only"}
                  </p>
                </div>
                {subscriptionDetails?.subscription?.current_period_end && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Next Billing Date
                    </p>
                    <p className="text-lg">
                      {(() => {
                        const periodEnd =
                          subscriptionDetails.subscription.current_period_end;
                        if (!periodEnd || typeof periodEnd !== "number") {
                          return "N/A";
                        }
                        const date = new Date(periodEnd * 1000);
                        if (isNaN(date.getTime())) {
                          return "N/A";
                        }
                        return date.toLocaleDateString();
                      })()}
                    </p>
                  </div>
                )}
              </>
            )}
            {isCancelling && (
              <div className="bg-muted/50 border border-border rounded-md p-4">
                <p className="text-sm text-foreground">
                  Your subscription will be cancelled at the end of the current
                  billing period. You'll retain all features until then.
                </p>
              </div>
            )}
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
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Pro Monthly</h3>
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
                <div className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Pro Annual</h3>
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
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
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
                      <div className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="font-semibold text-lg">
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
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-semibold text-lg">Enterprise</h3>
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
            <div className="border rounded-lg p-4">
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
    </main>
  );
}
