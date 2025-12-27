import { redirect } from "next/navigation";
import { getTeamForUser, getUser } from "@/lib/db/queries";
import { SubscriptionStatus, PlanName } from "@/lib/db/schema";
import { TierPageClient } from "./_components/tier-page-client";

export default async function TierPage() {
  const user = await getUser();
  if (!user) {
    redirect("/sign-up");
  }

  const team = await getTeamForUser();

  // Scenario 1: User has no team
  if (!team) {
    return <TierPageClient scenario="no-team" />;
  }

  // Scenario 2 & 3: User has team but subscription is missing or inactive
  const hasActiveSubscription =
    team.stripeSubscriptionId &&
    team.subscriptionStatus === SubscriptionStatus.ACTIVE;

  if (!hasActiveSubscription) {
    // Scenario 2: Team has a subscription but it's inactive (has stripeSubscriptionId)
    // Scenario 3: Team has no subscription at all (no stripeSubscriptionId)
    const hasInactiveSubscription = !!team.stripeSubscriptionId;
    
    return (
      <TierPageClient
        scenario={hasInactiveSubscription ? "inactive-subscription" : "no-subscription"}
        teamName={team.name}
        planName={team.planName as PlanName | null}
        teamId={team.id}
      />
    );
  }

  // If they have an active subscription, redirect to dashboard
  redirect("/app/dashboard");
}

