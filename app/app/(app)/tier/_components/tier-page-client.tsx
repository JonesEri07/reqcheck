"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ContactSalesButton } from "@/components/contact-sales-button";
import {
  AlertCircle,
  Users,
  Check,
  X,
  ArrowRight,
  Building2,
  Loader2,
} from "lucide-react";
import {
  TIER_QUESTION_LIMITS,
  TIER_CUSTOM_SKILL_LIMITS,
  TIER_JOB_LIMITS,
} from "@/lib/constants/tier-limits";
import { BILLING_CAPS } from "@/lib/constants/billing";
import { PlanName } from "@/lib/db/schema";
import useSWR from "swr";
import { useActionState, startTransition } from "react";
import {
  checkoutAction,
  createTeamAndCheckoutAction,
} from "@/lib/payments/actions";
import { useToastAction } from "@/lib/utils/use-toast-action";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ActionState } from "@/lib/auth/proxy";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface TierPageClientProps {
  scenario: "no-team" | "inactive-subscription" | "no-subscription";
  teamName?: string;
  planName?: PlanName | null;
  teamId?: number;
}

export function TierPageClient({
  scenario,
  teamName,
  planName,
  teamId,
}: TierPageClientProps) {
  const { data: priceIds } = useSWR<{
    basicMonthly: string;
    basicMeter: string;
    proMonthly: string;
    proMeter: string;
  }>("/api/pricing/ids", fetcher);

  // State for team name input (no-team scenario)
  const [teamNameInput, setTeamNameInput] = useState("");
  const [showPricing, setShowPricing] = useState(scenario !== "no-team");

  // Checkout action for existing teams
  const [checkoutState, checkoutFormAction, isCheckoutPending] = useActionState(
    teamId ? checkoutAction : async () => ({ error: "No team found" }),
    {} as ActionState
  );

  // Create team and checkout action for no-team scenario
  const [createTeamState, createTeamFormAction, isCreateTeamPending] =
    useActionState(createTeamAndCheckoutAction, {});

  useToastAction(checkoutState);
  useToastAction(createTeamState);

  // Handle redirect when checkout URL is returned
  useEffect(() => {
    if (checkoutState?.checkoutUrl) {
      window.location.href = checkoutState.checkoutUrl;
    }
    if (createTeamState?.checkoutUrl) {
      window.location.href = createTeamState.checkoutUrl;
    }
  }, [checkoutState?.checkoutUrl, createTeamState?.checkoutUrl]);

  const handleCheckout = (
    priceId: string,
    meterPriceId: string,
    planType: string
  ) => {
    if (!teamId) return;

    startTransition(() => {
      const formData = new FormData();
      formData.append("priceId", priceId);
      formData.append("meterPriceId", meterPriceId);
      formData.append("planType", planType);
      checkoutFormAction(formData);
    });
  };

  const handleCreateTeamAndCheckout = (
    priceId: string,
    meterPriceId: string,
    planType: string
  ) => {
    if (!teamNameInput.trim()) {
      return;
    }

    startTransition(() => {
      const formData = new FormData();
      formData.append("teamName", teamNameInput.trim());
      formData.append("priceId", priceId);
      formData.append("meterPriceId", meterPriceId);
      formData.append("planType", planType);
      createTeamFormAction(formData);
    });
  };

  if (scenario === "no-team") {
    return (
      <div className="container mx-auto max-w-6xl px-4 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Users className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Create Your Team</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            You're no longer part of any team. Create your own team and choose a
            plan to get started with reqCHECK.
          </p>
        </div>

        {!showPricing ? (
          <Card className="max-w-md mx-auto mb-8">
            <CardHeader>
              <CardTitle>Team Name</CardTitle>
              <CardDescription>Enter a name for your team</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="teamName">Team Name</Label>
                <Input
                  id="teamName"
                  value={teamNameInput}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setTeamNameInput(e.target.value)
                  }
                  placeholder="My Team"
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                    if (e.key === "Enter" && teamNameInput.trim()) {
                      setShowPricing(true);
                    }
                  }}
                />
              </div>
              <Button
                onClick={() => setShowPricing(true)}
                className="w-full"
                disabled={!teamNameInput.trim()}
              >
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="max-w-md mx-auto mb-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Team Name</p>
                      <p className="font-semibold">
                        {teamNameInput || "My Team"}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPricing(false)}
                    >
                      Change
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
              <PricingCard
                name="Basic"
                price={15}
                interval="month"
                basicCap={BILLING_CAPS[PlanName.BASIC]}
                usageRate={0.75}
                features={[
                  `${TIER_QUESTION_LIMITS[PlanName.BASIC]} questions per skill`,
                  `${TIER_CUSTOM_SKILL_LIMITS[PlanName.BASIC]} custom skills`,
                  `${TIER_JOB_LIMITS[PlanName.BASIC]} active jobs`,
                ]}
                limitations={[
                  "No additional team members",
                  "No ATS integrations",
                ]}
                monthlyPriceId={priceIds?.basicMonthly}
                meterPriceId={priceIds?.basicMeter}
                isBasic={true}
                teamId={undefined}
                onSelectPlan={handleCreateTeamAndCheckout}
                isPending={isCreateTeamPending}
              />
              <PricingCard
                name="Pro"
                price={129}
                interval="month"
                basicCap={BILLING_CAPS[PlanName.PRO]}
                usageRate={"0.35"}
                features={[
                  `${TIER_QUESTION_LIMITS[PlanName.PRO]} questions per skill`,
                  `${TIER_CUSTOM_SKILL_LIMITS[PlanName.PRO]} custom skills`,
                  `${TIER_JOB_LIMITS[PlanName.PRO]} active jobs`,
                  "5 additional team members",
                  "ATS integrations",
                ]}
                limitations={[]}
                monthlyPriceId={priceIds?.proMonthly}
                meterPriceId={priceIds?.proMeter}
                isBasic={false}
                teamId={undefined}
                onSelectPlan={handleCreateTeamAndCheckout}
                isPending={isCreateTeamPending}
              />
            </div>

            <div className="text-center">
              <Card className="max-w-2xl mx-auto">
                <CardHeader>
                  <CardTitle>Enterprise</CardTitle>
                  <CardDescription>
                    Custom pricing and dedicated support for large organizations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ContactSalesButton className="w-full" />
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    );
  }

  // Scenario: Inactive subscription (has subscription but not active)
  if (scenario === "inactive-subscription") {
    const previousPlan =
      planName === PlanName.BASIC
        ? "Basic"
        : planName === PlanName.PRO
          ? "Pro"
          : null;

    return (
      <div className="container mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Subscription Inactive</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Your team <strong>{teamName}</strong> subscription is inactive.{" "}
            {previousPlan
              ? `You were previously on the ${previousPlan} plan.`
              : ""}{" "}
            Choose a plan below to restore access to your data.
          </p>
        </div>

        <div className="bg-muted/50 rounded-lg p-6 mb-8">
          <div className="flex items-start gap-4">
            <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="font-semibold mb-2">Your Data is Safe</h3>
              <p className="text-sm text-muted-foreground">
                All your jobs, skills, applications, and settings are preserved.
                Once you reactivate your subscription, you'll have immediate
                access to everything.
              </p>
            </div>
          </div>
        </div>

        {previousPlan && (
          <div className="mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Resume Previous Plan</CardTitle>
                <CardDescription>
                  Reactivate your {previousPlan} subscription
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    const planType =
                      planName === PlanName.BASIC ? "BASIC" : "PRO";
                    const priceId =
                      planName === PlanName.BASIC
                        ? priceIds?.basicMonthly
                        : priceIds?.proMonthly;
                    const meterPriceId =
                      planName === PlanName.BASIC
                        ? priceIds?.basicMeter
                        : priceIds?.proMeter;
                    if (priceId && meterPriceId) {
                      handleCheckout(priceId, meterPriceId, planType);
                    }
                  }}
                  className="w-full"
                  disabled={!priceIds || isCheckoutPending}
                >
                  {isCheckoutPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Resume {previousPlan} Plan
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-center mb-4">
            {previousPlan ? "Or Choose a Different Plan" : "Choose a Plan"}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <PricingCard
            name="Basic"
            price={15}
            interval="month"
            basicCap={BILLING_CAPS[PlanName.BASIC]}
            usageRate={0.75}
            features={[
              `${TIER_QUESTION_LIMITS[PlanName.BASIC]} questions per skill`,
              `${TIER_CUSTOM_SKILL_LIMITS[PlanName.BASIC]} custom skills`,
              `${TIER_JOB_LIMITS[PlanName.BASIC]} active jobs`,
            ]}
            limitations={["No additional team members", "No ATS integrations"]}
            monthlyPriceId={priceIds?.basicMonthly}
            meterPriceId={priceIds?.basicMeter}
            isBasic={true}
            teamId={teamId}
            onSelectPlan={handleCheckout}
            isPending={isCheckoutPending}
            highlight={planName === PlanName.BASIC}
          />
          <PricingCard
            name="Pro"
            price={129}
            interval="month"
            basicCap={BILLING_CAPS[PlanName.PRO]}
            usageRate={"0.35"}
            features={[
              `${TIER_QUESTION_LIMITS[PlanName.PRO]} questions per skill`,
              `${TIER_CUSTOM_SKILL_LIMITS[PlanName.PRO]} custom skills`,
              `${TIER_JOB_LIMITS[PlanName.PRO]} active jobs`,
              "5 additional team members",
              "ATS integrations",
            ]}
            limitations={[]}
            monthlyPriceId={priceIds?.proMonthly}
            meterPriceId={priceIds?.proMeter}
            isBasic={false}
            teamId={teamId}
            onSelectPlan={handleCheckout}
            isPending={isCheckoutPending}
            highlight={planName === PlanName.PRO}
          />
        </div>

        <div className="text-center">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>
                Custom pricing and dedicated support for large organizations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ContactSalesButton className="w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Scenario: No subscription (team exists but never had a subscription)
  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
          <Building2 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h1 className="text-4xl font-bold mb-4">Choose a Plan</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Your team <strong>{teamName}</strong> needs a subscription to access
          reqCHECK. Choose a plan below to get started.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <PricingCard
          name="Basic"
          price={15}
          interval="month"
          basicCap={BILLING_CAPS[PlanName.BASIC]}
          usageRate={0.75}
          features={[
            `${TIER_QUESTION_LIMITS[PlanName.BASIC]} questions per skill`,
            `${TIER_CUSTOM_SKILL_LIMITS[PlanName.BASIC]} custom skills`,
            `${TIER_JOB_LIMITS[PlanName.BASIC]} active jobs`,
          ]}
          limitations={["No additional team members", "No ATS integrations"]}
          monthlyPriceId={priceIds?.basicMonthly}
          meterPriceId={priceIds?.basicMeter}
          isBasic={true}
          teamId={teamId}
          onSelectPlan={handleCheckout}
          isPending={isCheckoutPending}
        />
        <PricingCard
          name="Pro"
          price={129}
          interval="month"
          basicCap={BILLING_CAPS[PlanName.PRO]}
          usageRate={"0.35"}
          features={[
            `${TIER_QUESTION_LIMITS[PlanName.PRO]} questions per skill`,
            `${TIER_CUSTOM_SKILL_LIMITS[PlanName.PRO]} custom skills`,
            `${TIER_JOB_LIMITS[PlanName.PRO]} active jobs`,
            "5 additional team members",
            "ATS integrations",
          ]}
          limitations={[]}
          monthlyPriceId={priceIds?.proMonthly}
          meterPriceId={priceIds?.proMeter}
          isBasic={false}
          teamId={teamId}
          onSelectPlan={handleCheckout}
          isPending={isCheckoutPending}
        />
      </div>

      <div className="text-center">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Enterprise</CardTitle>
            <CardDescription>
              Custom pricing and dedicated support for large organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ContactSalesButton className="w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

interface PricingCardProps {
  name: string;
  price: number;
  interval: string;
  basicCap: number;
  usageRate: number | string;
  features: string[];
  limitations: string[];
  monthlyPriceId?: string;
  meterPriceId?: string;
  isBasic: boolean;
  highlight?: boolean;
}

function PricingCard({
  name,
  price,
  interval,
  basicCap,
  usageRate,
  features,
  limitations,
  monthlyPriceId,
  meterPriceId,
  isBasic,
  teamId,
  onSelectPlan,
  isPending,
  highlight,
}: PricingCardProps & {
  teamId?: number;
  onSelectPlan?: (
    priceId: string,
    meterPriceId: string,
    planType: string
  ) => void;
  isPending?: boolean;
  highlight?: boolean;
}) {
  const handleSelectPlan = () => {
    if (!monthlyPriceId || !meterPriceId || !onSelectPlan) {
      return;
    }

    onSelectPlan(monthlyPriceId, meterPriceId, isBasic ? "BASIC" : "PRO");
  };

  return (
    <Card className={`relative ${highlight ? "ring-2 ring-primary" : ""}`}>
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-2xl">{name}</CardTitle>
          <div className="flex items-center gap-2">
            {highlight && (
              <Badge variant="outline" className="ml-2">
                Previous Plan
              </Badge>
            )}
            {!isBasic && !highlight && (
              <Badge variant="default" className="ml-2">
                Popular
              </Badge>
            )}
          </div>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-bold">${price}</span>
          <span className="text-muted-foreground">/{interval}</span>
        </div>
        <CardDescription className="mt-2">
          {basicCap} included applications, then ${usageRate}/application
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h4 className="font-semibold mb-2 text-sm">Features:</h4>
          <ul className="space-y-2">
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        {limitations.length > 0 && (
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground">
              Limitations:
            </h4>
            <ul className="space-y-2">
              {limitations.map((limitation, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm text-muted-foreground"
                >
                  <X className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{limitation}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <Button
          onClick={handleSelectPlan}
          className="w-full"
          variant={isBasic ? "outline" : "default"}
          disabled={!monthlyPriceId || !meterPriceId || isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Select {name}
              <ArrowRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
