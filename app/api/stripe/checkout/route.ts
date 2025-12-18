import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  users,
  teams,
  teamMembers,
  BillingPlan,
  PlanName,
  SubscriptionStatus,
} from "@/lib/db/schema";
import { setSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/payments/stripe";
import Stripe from "stripe";

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
  if (name === "FREE" || name.includes("FREE")) return PlanName.FREE;
  if (name === "PRO" || name.includes("PRO")) return PlanName.PRO;
  if (name === "ENTERPRISE" || name.includes("ENTERPRISE"))
    return PlanName.ENTERPRISE;
  // Default to PRO if product name doesn't match
  return PlanName.PRO;
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.redirect(new URL("/pricing", request.url));
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["customer", "subscription"],
    });

    if (!session.customer || typeof session.customer === "string") {
      throw new Error("Invalid customer data from Stripe.");
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    if (!subscriptionId) {
      throw new Error("No subscription found for this session.");
    }

    let subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product"],
    });

    const plan = subscription.items.data[0]?.price;

    if (!plan) {
      throw new Error("No plan found for this subscription.");
    }

    // Determine plan name and billing plan from the subscription
    const product = plan.product as Stripe.Product;
    const planName = mapProductNameToPlanName(product.name) || PlanName.PRO;

    // Determine billing interval from the price
    const interval = plan.recurring?.interval || "month";
    const billingPlan =
      interval === "year" ? BillingPlan.ANNUAL : BillingPlan.MONTHLY;

    // Map Stripe status to our enum
    const subscriptionStatus =
      mapStripeStatusToSubscriptionStatus(subscription.status) ||
      SubscriptionStatus.ACTIVE;

    // Add metered usage price to subscription if it was specified in metadata
    // This is required because checkout sessions don't support multiple prices with different intervals
    // (e.g., yearly subscription + monthly metered usage)
    const meterPriceId = subscription.metadata?.meterPriceId;
    if (meterPriceId && meterPriceId.trim() !== "") {
      try {
        // Check if metered price is already in the subscription
        const hasMeterPrice = subscription.items.data.some(
          (item) => item.price.id === meterPriceId
        );

        if (!hasMeterPrice) {
          // Add the metered usage price as a subscription item
          // For metered billing, quantity is omitted - Stripe handles it automatically
          await stripe.subscriptionItems.create({
            subscription: subscriptionId,
            price: meterPriceId,
          });
        }
      } catch (error) {
        console.error("Error adding metered price to subscription:", error);
        // Continue even if adding metered price fails - subscription is still valid
      }
    }

    const userId = session.client_reference_id;
    if (!userId) {
      throw new Error("No user ID found in session's client_reference_id.");
    }

    const user = await db
      .select()
      .from(users)
      .where(eq(users.id, Number(userId)))
      .limit(1);

    if (user.length === 0) {
      throw new Error("User not found in database.");
    }

    const userTeam = await db
      .select({
        teamId: teamMembers.teamId,
      })
      .from(teamMembers)
      .where(eq(teamMembers.userId, user[0].id))
      .limit(1);

    if (userTeam.length === 0) {
      throw new Error("User is not associated with any team.");
    }

    // Update team subscription data
    await db
      .update(teams)
      .set({
        stripeCustomerId: customerId,
        stripeSubscriptionId: subscriptionId,
        planName: planName,
        billingPlan: billingPlan,
        subscriptionStatus: subscriptionStatus,
        updatedAt: new Date(),
      })
      .where(eq(teams.id, userTeam[0].teamId));

    await setSession(user[0]);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  } catch (error) {
    console.error("Error handling successful checkout:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
