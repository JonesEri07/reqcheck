import {
  getTeamForUser,
  updateTeamSubscription,
  getCurrentUserTeamMember,
  getCurrentBillingUsage,
} from "@/lib/db/queries";
import { stripe } from "@/lib/payments/stripe";
import { BillingPlan, PlanName, SubscriptionStatus } from "@/lib/db/schema";
import Stripe from "stripe";
import { db } from "@/lib/db/drizzle";
import { users, teams, teamMembers } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

/**
 * Maps Stripe subscription status to our SubscriptionStatus enum
 */
function mapStripeStatusToSubscriptionStatus(
  stripeStatus: string
): SubscriptionStatus | null {
  const status = stripeStatus.toLowerCase();
  switch (status) {
    case "active":
    case "trialing":
      return SubscriptionStatus.ACTIVE;
    case "canceled":
    case "cancelled":
    case "unpaid":
    case "past_due":
      return SubscriptionStatus.CANCELLED;
    case "paused":
      return SubscriptionStatus.PAUSED;
    default:
      return null;
  }
}

/**
 * Maps Stripe product name to our PlanName enum
 */
function mapProductNameToPlanName(
  productName: string | null | undefined
): PlanName | null {
  if (!productName) return null;
  const name = productName.toUpperCase();
  if (name === "BASIC" || name.includes("BASIC")) return PlanName.BASIC;
  if (name === "PRO" || name.includes("PRO")) return PlanName.PRO;
  if (name === "ENTERPRISE" || name.includes("ENTERPRISE"))
    return PlanName.ENTERPRISE;
  // Default to PRO if product name doesn't match
  return PlanName.PRO;
}

export async function GET() {
  let team = await getTeamForUser();

  // If no team found (user not logged in), try to get demo team
  if (!team) {
    const demoUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.email, "demo@reqcheck.com"),
    });

    if (demoUser) {
      const teamMember = await db.query.teamMembers.findFirst({
        where: (teamMembers, { eq }) => eq(teamMembers.userId, demoUser.id),
        with: {
          team: {
            with: {
              teamMembers: {
                with: {
                  user: {
                    columns: {
                      id: true,
                      name: true,
                      email: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (teamMember?.team) {
        team = teamMember.team;
      } else {
        return Response.json(null);
      }
    } else {
      return Response.json(null);
    }
  }

  // Get current user's team member record with role
  const currentUserTeamMember = await getCurrentUserTeamMember(team.id);

  // Get current billing usage
  const billingUsage = await getCurrentBillingUsage(team.id);

  // If we have a subscription ID but no status, verify with Stripe
  if (team.stripeSubscriptionId && !team.subscriptionStatus) {
    try {
      const subscription = await stripe.subscriptions.retrieve(
        team.stripeSubscriptionId,
        { expand: ["items.data.price.product"] }
      );

      // Determine plan name and billing plan from subscription
      const plan = subscription.items.data[0]?.price;
      const product = plan?.product as Stripe.Product;
      const planName =
        mapProductNameToPlanName(product?.name) ||
        (team.planName as PlanName) ||
        PlanName.PRO;

      // All subscriptions use monthly billing
      const billingPlan = BillingPlan.MONTHLY;

      // Map Stripe status to our enum
      const subscriptionStatus =
        mapStripeStatusToSubscriptionStatus(subscription.status) ||
        SubscriptionStatus.ACTIVE;

      // Update the team with the current subscription status
      const updateData: Parameters<typeof updateTeamSubscription>[1] = {
        stripeSubscriptionId: subscription.id,
        planName: planName,
        subscriptionStatus: subscriptionStatus,
        billingPlan: billingPlan,
      };

      await updateTeamSubscription(team.id, updateData);

      // Return updated team data
      const updatedTeam = await getTeamForUser();
      if (!updatedTeam) {
        return Response.json(null);
      }
      const updatedUserTeamMember = await getCurrentUserTeamMember(
        updatedTeam.id
      );
      const updatedBillingUsage = await getCurrentBillingUsage(updatedTeam.id);
      return Response.json({
        ...updatedTeam,
        currentUserRole: updatedUserTeamMember?.role || null,
        billingUsage: updatedBillingUsage,
      });
    } catch (error) {
      console.error("Error verifying subscription with Stripe:", error);
      // Return team data anyway, even if Stripe verification fails
    }
  }

  return Response.json({
    ...team,
    currentUserRole: currentUserTeamMember?.role || null,
    billingUsage: billingUsage,
  });
}
