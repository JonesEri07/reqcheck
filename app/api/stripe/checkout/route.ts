import { eq } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  users,
  teams,
  teamMembers,
  BillingPlan,
  PlanName,
  SubscriptionStatus,
  ActivityType,
} from "@/lib/db/schema";
import { setSession } from "@/lib/auth/session";
import { NextRequest, NextResponse } from "next/server";
import { stripe, handleSubscriptionChange } from "@/lib/payments/stripe";
import Stripe from "stripe";
import { randomBytes } from "crypto";

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
      expand: ["customer", "subscription", "customer_details"],
    });

    // Debug logging
    console.log("[Checkout] Session mode:", session.mode);
    console.log("[Checkout] Session metadata:", session.metadata);
    console.log("[Checkout] Has subscription:", !!session.subscription);

    if (!session.customer) {
      throw new Error("No customer found in session.");
    }

    const customerId =
      typeof session.customer === "string"
        ? session.customer
        : session.customer.id;

    const newSubscriptionId =
      typeof session.subscription === "string"
        ? session.subscription
        : session.subscription?.id;

    // For subscription mode, require subscription
    if (!newSubscriptionId) {
      throw new Error("No subscription found for this session.");
    }

    let subscription = await stripe.subscriptions.retrieve(newSubscriptionId, {
      expand: ["items.data.price.product"],
    });

    // Get email from session (preferred: customer_details, fallback: metadata or customer object)
    const customerEmail =
      session.customer_details?.email ||
      session.metadata?.email ||
      (typeof session.customer !== "string" &&
      "email" in session.customer &&
      !("deleted" in session.customer)
        ? (session.customer as Stripe.Customer).email
        : null);

    if (!customerEmail) {
      throw new Error("No email found in checkout session.");
    }

    // Determine plan name from base price product
    const basePriceItem = subscription.items.data.find(
      (item) => item.price.recurring?.usage_type !== "metered"
    );
    let planName: PlanName;
    if (basePriceItem) {
      const product = basePriceItem.price.product as Stripe.Product;
      planName = mapProductNameToPlanName(product.name) || PlanName.PRO;
    } else {
      planName = PlanName.PRO;
    }

    const billingPlan = BillingPlan.MONTHLY;
    const subscriptionStatus =
      mapStripeStatusToSubscriptionStatus(subscription.status) ||
      SubscriptionStatus.ACTIVE;

    // Check if this is a new user checkout (from email modal)
    const isNewUserCheckout = session.metadata?.isNewUser === "true";

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, customerEmail.toLowerCase().trim()))
      .limit(1);

    let user;
    let team;
    let isNewUser = false;

    if (existingUser.length > 0) {
      // EXISTING USER - Handle subscription conflict
      user = existingUser[0];

      // Get their team
      const userTeam = await db
        .select({
          teamId: teamMembers.teamId,
        })
        .from(teamMembers)
        .where(eq(teamMembers.userId, user.id))
        .limit(1);

      if (userTeam.length === 0) {
        throw new Error("User is not associated with any team.");
      }

      // Get full team data
      const [teamData] = await db
        .select()
        .from(teams)
        .where(eq(teams.id, userTeam[0].teamId))
        .limit(1);

      if (!teamData) {
        throw new Error("Team not found.");
      }

      team = teamData;

      // Check if they already have an active subscription
      if (
        team.stripeSubscriptionId &&
        team.subscriptionStatus === SubscriptionStatus.ACTIVE
      ) {
        // They have an active subscription - update it instead of creating duplicate
        console.log(
          `[Checkout] Existing user with active subscription. Updating existing subscription instead of creating duplicate.`
        );

        // Get the new price IDs from the checkout subscription
        const newBasePriceId = basePriceItem?.price.id;
        const meteredPriceItem = subscription.items.data.find(
          (item) => item.price.recurring?.usage_type === "metered"
        );
        const newMeterPriceId = meteredPriceItem?.price.id;

        // Determine if this is an upgrade or downgrade
        const currentPlan = team.planName || PlanName.BASIC;
        const isUpgrade =
          (currentPlan === PlanName.BASIC && planName === PlanName.PRO) ||
          (currentPlan === PlanName.PRO && planName === PlanName.ENTERPRISE);

        // Update existing subscription instead of using the new one
        const { changeSubscriptionPlan } =
          await import("@/lib/payments/stripe");

        if (newBasePriceId && newMeterPriceId) {
          await changeSubscriptionPlan({
            team: team,
            newPriceId: newBasePriceId,
            newMeterPriceId: newMeterPriceId,
            isUpgrade: isUpgrade,
          });
        }

        // Cancel the newly created subscription (since we're using the existing one)
        try {
          await stripe.subscriptions.cancel(newSubscriptionId);
          console.log(
            `[Checkout] Cancelled duplicate subscription: ${newSubscriptionId}`
          );
        } catch (cancelError) {
          console.error(
            `[Checkout] Error cancelling duplicate subscription:`,
            cancelError
          );
          // Continue anyway - the existing subscription is updated
        }

        // Update customer ID if it changed
        if (team.stripeCustomerId !== customerId) {
          await db
            .update(teams)
            .set({
              stripeCustomerId: customerId,
              updatedAt: new Date(),
            })
            .where(eq(teams.id, team.id));
        }

        await setSession(user);
        return NextResponse.redirect(new URL("/app", request.url));
      } else {
        // Existing user but no active subscription - use the new subscription
        console.log(
          `[Checkout] Existing user without active subscription. Activating new subscription.`
        );

        await db
          .update(teams)
          .set({
            stripeCustomerId: customerId,
            stripeSubscriptionId: newSubscriptionId,
            planName: planName,
            billingPlan: billingPlan,
            subscriptionStatus: subscriptionStatus,
            updatedAt: new Date(),
          })
          .where(eq(teams.id, team.id));

        await handleSubscriptionChange(subscription);
        await setSession(user);

        return NextResponse.redirect(new URL("/app", request.url));
      }
    } else {
      // NEW USER - Create account
      isNewUser = true;

      // Generate a random password (user can reset it later)
      const { hashPassword } = await import("@/lib/auth/session");
      const randomPassword = randomBytes(32).toString("hex");
      const passwordHash = await hashPassword(randomPassword);

      // Create user
      const [createdUser] = await db
        .insert(users)
        .values({
          email: customerEmail.toLowerCase().trim(),
          passwordHash: passwordHash,
          role: "owner",
        })
        .returning();

      if (!createdUser) {
        throw new Error("Failed to create user.");
      }

      user = createdUser;

      // Create team with temporary name (will be updated in onboarding)
      const [createdTeam] = await db
        .insert(teams)
        .values({
          name: `${customerEmail}'s Team`, // Temporary name
          stripeCustomerId: customerId,
          stripeSubscriptionId: newSubscriptionId,
          planName: planName,
          billingPlan: billingPlan,
          subscriptionStatus: subscriptionStatus,
          onboardingComplete: false, // Will be set to true after onboarding
        })
        .returning();

      if (!createdTeam) {
        // Rollback user creation
        await db.delete(users).where(eq(users.id, createdUser.id));
        throw new Error("Failed to create team.");
      }

      team = createdTeam;

      // Create team member
      await db.insert(teamMembers).values({
        userId: createdUser.id,
        teamId: createdTeam.id,
        role: "owner",
      });

      // Log activities
      const { logActivity } = await import("@/lib/payments/actions");
      await logActivity(
        createdTeam.id,
        createdUser.id,
        ActivityType.CREATE_TEAM
      );
      await logActivity(createdTeam.id, createdUser.id, ActivityType.SIGN_UP);

      // Initialize billing usage
      await handleSubscriptionChange(subscription);

      // Set session
      await setSession(createdUser);

      // Redirect to onboarding
      return NextResponse.redirect(new URL("/app/onboarding", request.url));
    }
  } catch (error) {
    console.error("Error handling successful checkout:", error);
    return NextResponse.redirect(new URL("/error", request.url));
  }
}
