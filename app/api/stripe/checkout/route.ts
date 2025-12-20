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
import { stripe, handleSubscriptionChange } from "@/lib/payments/stripe";
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
  if (name === "BASIC" || name.includes("BASIC")) return PlanName.BASIC;
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
      expand: ["customer", "subscription", "setup_intent"],
    });

    // Debug logging
    console.log("[Checkout] Session mode:", session.mode);
    console.log("[Checkout] Session metadata:", session.metadata);
    console.log("[Checkout] Has subscription:", !!session.subscription);
    console.log("[Checkout] Has setup_intent:", !!session.setup_intent);

    if (!session.customer || typeof session.customer === "string") {
      throw new Error("Invalid customer data from Stripe.");
    }

    const customerId = session.customer.id;
    const subscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    // For subscription mode, require subscription
    if (!subscriptionId) {
      throw new Error("No subscription found for this session.");
    }

    let subscription = await stripe.subscriptions.retrieve(subscriptionId, {
      expand: ["items.data.price.product"],
    });

    // All subscriptions now have base price + metered pricing (combined in checkout)
    const basePriceItem = subscription.items.data.find(
      (item) => item.price.recurring?.usage_type !== "metered"
    );
    const meteredPriceItem = subscription.items.data.find(
      (item) => item.price.recurring?.usage_type === "metered"
    );

    // Determine plan name from base price product
    let planName: PlanName;
    if (basePriceItem) {
      const product = basePriceItem.price.product as Stripe.Product;
      planName = mapProductNameToPlanName(product.name) || PlanName.PRO;
    } else {
      // Fallback: if no base price, default to PRO
      planName = PlanName.PRO;
    }

    // All subscriptions use monthly billing
    const billingPlan = BillingPlan.MONTHLY;

    // Map Stripe status to our enum
    const subscriptionStatus =
      mapStripeStatusToSubscriptionStatus(subscription.status) ||
      SubscriptionStatus.ACTIVE;

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

    // Create/update billing usage record for the current billing cycle
    // This ensures billing usage is initialized on first checkout
    await handleSubscriptionChange(subscription);

    await setSession(user[0]);
    return NextResponse.redirect(new URL("/app", request.url));
  } catch (error) {
    console.error("Error handling successful checkout:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
