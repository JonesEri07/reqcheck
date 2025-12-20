import Stripe from "stripe";
import { redirect } from "next/navigation";
import {
  Team,
  teams,
  PlanName,
  SubscriptionStatus,
  BillingPlan,
  verificationAttempts,
} from "@/lib/db/schema";
import { eq, and, gte, lte, isNotNull } from "drizzle-orm";
import { db } from "@/lib/db/drizzle";
import {
  getTeamByStripeCustomerId,
  getUser,
  updateTeamSubscription,
  updateBillingUsageForUpgrade,
  getOrCreateCurrentBillingUsage,
} from "@/lib/db/queries";
import { BILLING_CAPS } from "@/lib/constants/billing";
import { teamBillingUsage } from "@/lib/db/schema";

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

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export async function createCheckoutSession({
  team,
  priceId,
  meterPriceId,
  planType,
}: {
  team: Team | null;
  priceId?: string;
  meterPriceId?: string;
  planType?: PlanName;
}) {
  const user = await getUser();

  if (!team || !user) {
    const params = new URLSearchParams();
    if (priceId) params.set("priceId", priceId);
    if (meterPriceId) params.set("meterPriceId", meterPriceId);
    if (planType) params.set("planType", planType);
    redirect(`/sign-up?redirect=checkout&${params.toString()}`);
  }

  // For Free tier, create subscription with only metered pricing (no base price)
  if (planType === PlanName.FREE && meterPriceId) {
    if (!meterPriceId || meterPriceId.trim() === "") {
      throw new Error("Meter price ID is required for Free tier checkout");
    }

    // Create or get Stripe customer
    let customerId = team.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          teamId: team.id.toString(),
          userId: user.id.toString(),
        },
      });
      customerId = customer.id;

      // Update team with customer ID
      await db
        .update(teams)
        .set({ stripeCustomerId: customerId })
        .where(eq(teams.id, team.id));
    }

    // Create subscription with only metered pricing (no base price)
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      customer: customerId,
      line_items: [
        {
          price: meterPriceId,
          // For metered billing, quantity is omitted - Stripe handles it automatically
        },
      ],
      success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/pricing`,
      client_reference_id: user.id.toString(),
      subscription_data: {
        metadata: {
          teamId: team.id.toString(),
          planType: PlanName.FREE,
          meterPriceId: meterPriceId,
        },
      },
    });

    redirect(session.url!);
  }

  // For Pro tier, create subscription with base price and metered usage
  if (!priceId || priceId.trim() === "") {
    throw new Error("Price ID is required for Pro checkout");
  }

  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
    {
      price: priceId,
      quantity: 1,
    },
  ];

  // Note: Cannot include metered usage price in checkout session if it has different billing interval
  // (e.g., yearly subscription + monthly metered usage = conflict)
  // We'll add the metered price to the subscription after it's created (via checkout callback)
  // Store meterPriceId in metadata so we can add it later

  // Check for early adopter coupon
  // Note: Stripe doesn't allow both allow_promotion_codes and discounts
  // If we have a valid coupon, apply it automatically; otherwise allow promotion codes
  let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
  let allowPromotionCodes = true;

  if (process.env.STRIPE_COUPON_EARLY_ADOPTER) {
    try {
      const coupon = await stripe.coupons.retrieve(
        process.env.STRIPE_COUPON_EARLY_ADOPTER
      );
      if (coupon.valid) {
        discounts = [
          {
            coupon: process.env.STRIPE_COUPON_EARLY_ADOPTER,
          },
        ];
        // Don't allow promotion codes if we're applying a discount automatically
        allowPromotionCodes = false;
      }
    } catch (error) {
      console.error("Error retrieving early adopter coupon:", error);
      // Continue without coupon if it doesn't exist or is invalid
      // In this case, allow promotion codes so users can enter it manually
    }
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "subscription",
    success_url: `${process.env.BASE_URL}/api/stripe/checkout?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.BASE_URL}/pricing`,
    customer: team.stripeCustomerId || undefined,
    client_reference_id: user.id.toString(),
    subscription_data: {
      metadata: {
        teamId: team.id.toString(),
        planType: planType || PlanName.PRO,
        meterPriceId: meterPriceId || "", // Store for reference
      },
    },
  };

  // Only set one: either discounts (automatic) or allow_promotion_codes (manual)
  if (discounts) {
    sessionParams.discounts = discounts;
  } else {
    sessionParams.allow_promotion_codes = allowPromotionCodes;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  redirect(session.url!);
}

export async function createCustomerPortalSession(team: Team) {
  if (!team.stripeCustomerId || !team.stripeSubscriptionId) {
    redirect("/pricing");
  }

  // Get subscription to find products and prices
  const subscription = await stripe.subscriptions.retrieve(
    team.stripeSubscriptionId,
    { expand: ["items.data.price.product"] }
  );

  // Get all unique products from subscription items
  const products = new Set<string>();
  const prices: string[] = [];

  for (const item of subscription.items.data) {
    const price = item.price;
    const productId =
      typeof price.product === "string" ? price.product : price.product.id;
    products.add(productId);
    prices.push(price.id);
  }

  let configuration: Stripe.BillingPortal.Configuration;
  const configurations = await stripe.billingPortal.configurations.list();

  if (configurations.data.length > 0) {
    configuration = configurations.data[0];
  } else {
    // Create configuration with all products from the subscription
    configuration = await stripe.billingPortal.configurations.create({
      business_profile: {
        headline: "Manage your subscription",
      },
      features: {
        subscription_update: {
          enabled: true,
          default_allowed_updates: ["price", "quantity", "promotion_code"],
          proration_behavior: "create_prorations",
          products: Array.from(products).map((productId) => ({
            product: productId,
            prices: prices,
          })),
        },
        subscription_cancel: {
          enabled: true,
          mode: "at_period_end",
          cancellation_reason: {
            enabled: true,
            options: [
              "too_expensive",
              "missing_features",
              "switched_service",
              "unused",
              "other",
            ],
          },
        },
        payment_method_update: {
          enabled: true,
        },
      },
    });
  }

  return stripe.billingPortal.sessions.create({
    customer: team.stripeCustomerId,
    return_url: `${process.env.BASE_URL}/app/team`,
    configuration: configuration.id,
  });
}

export async function handleSubscriptionChange(
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;
  const subscriptionId = subscription.id;
  const status = subscription.status;

  const team = await getTeamByStripeCustomerId(customerId);

  if (!team) {
    console.error("Team not found for Stripe customer:", customerId);
    return;
  }

  const subscriptionStatus = mapStripeStatusToSubscriptionStatus(status);

  if (status === "active" || status === "trialing") {
    const plan = subscription.items.data[0]?.price;
    const product = plan?.product as Stripe.Product;
    const planName = mapProductNameToPlanName(product?.name) || PlanName.PRO;

    // Determine billing interval from the price
    const interval = plan?.recurring?.interval || "month";
    const billingPlan =
      interval === "year" ? BillingPlan.ANNUAL : BillingPlan.MONTHLY;

    // Get billing cycle dates from Stripe subscription
    const sub = subscription as unknown as {
      current_period_start: number;
      current_period_end: number;
    };
    const periodStartTimestamp = sub.current_period_start;
    const periodEndTimestamp = sub.current_period_end;
    const periodStart = new Date(periodStartTimestamp * 1000);
    const periodEnd = new Date(periodEndTimestamp * 1000);

    // Find metered price ID from subscription items
    const meteredPriceItem = subscription.items.data.find(
      (item) => item.price.recurring?.usage_type === "metered"
    );
    const meteredPriceId = meteredPriceItem?.price.id || null;

    // Get included applications cap based on plan
    const includedApplications =
      BILLING_CAPS[planName] ?? BILLING_CAPS[PlanName.FREE];

    // Update subscription data
    const updateData: Parameters<typeof updateTeamSubscription>[1] = {
      stripeSubscriptionId: subscriptionId,
      planName: planName,
      subscriptionStatus: subscriptionStatus || SubscriptionStatus.ACTIVE,
      billingPlan: billingPlan,
    };

    await updateTeamSubscription(team.id, updateData);

    // Update or create billing usage record with current cycle dates
    // This ensures we have the latest billing cycle dates from Stripe
    if (
      periodStartTimestamp &&
      periodEndTimestamp &&
      !isNaN(periodStart.getTime()) &&
      !isNaN(periodEnd.getTime())
    ) {
      // Check if a billing usage record exists for this cycle
      const existingUsage = await db
        .select()
        .from(teamBillingUsage)
        .where(
          and(
            eq(teamBillingUsage.teamId, team.id),
            eq(teamBillingUsage.cycleStart, periodStart)
          )
        )
        .limit(1);

      if (existingUsage.length > 0) {
        // Update existing record with latest cycle end date and plan info
        await db
          .update(teamBillingUsage)
          .set({
            cycleEnd: periodEnd,
            includedApplications: includedApplications,
            meteredPriceId: meteredPriceId || existingUsage[0].meteredPriceId,
            updatedAt: new Date(),
          })
          .where(eq(teamBillingUsage.id, existingUsage[0].id));
      } else {
        // Create new billing usage record for this cycle
        // This happens when a new billing period starts (e.g., invoice.paid event)
        await db.insert(teamBillingUsage).values({
          teamId: team.id,
          cycleStart: periodStart,
          cycleEnd: periodEnd,
          includedApplications: includedApplications,
          actualApplications: 0, // Will be updated as applications are created
          meteredPriceId: meteredPriceId,
        });
      }
    }
  } else {
    await updateTeamSubscription(team.id, {
      stripeSubscriptionId: null,
      planName: null,
      subscriptionStatus: subscriptionStatus,
      billingPlan: BillingPlan.FREE,
    });
  }
}

export async function getStripePrices() {
  const prices = await stripe.prices.list({
    expand: ["data.product"],
    active: true,
    type: "recurring",
  });

  return prices.data.map((price) => ({
    id: price.id,
    productId:
      typeof price.product === "string" ? price.product : price.product.id,
    unitAmount: price.unit_amount,
    currency: price.currency,
    interval: price.recurring?.interval,
    trialPeriodDays: price.recurring?.trial_period_days,
  }));
}

/**
 * Upgrade or downgrade a subscription
 * For upgrades: immediate with proration
 * For downgrades: schedule for period end
 */
export async function changeSubscriptionPlan({
  team,
  newPriceId,
  newMeterPriceId,
  isUpgrade,
}: {
  team: Team;
  newPriceId: string;
  newMeterPriceId?: string;
  isUpgrade: boolean;
}) {
  if (!team.stripeSubscriptionId) {
    throw new Error("No active subscription found");
  }

  const subscription = await stripe.subscriptions.retrieve(
    team.stripeSubscriptionId,
    { expand: ["items.data.price.product"] }
  );

  // Find the base subscription item (non-metered)
  const baseItem = subscription.items.data.find(
    (item) => item.price.recurring?.usage_type !== "metered"
  );

  if (!baseItem) {
    throw new Error("No base subscription item found");
  }

  if (isUpgrade) {
    // Immediate upgrade with proration
    const updateParams: Stripe.SubscriptionUpdateParams = {
      items: [
        {
          id: baseItem.id,
          price: newPriceId,
        },
      ],
      proration_behavior: "create_prorations",
    };

    // Update metered price if provided
    if (newMeterPriceId) {
      const meterItem = subscription.items.data.find(
        (item) => item.price.recurring?.usage_type === "metered"
      );

      if (meterItem) {
        // Update existing metered item
        updateParams.items!.push({
          id: meterItem.id,
          price: newMeterPriceId,
        });
      } else {
        // Add new metered item
        updateParams.items!.push({
          price: newMeterPriceId,
        });
      }
    }

    // Determine the new plan name and billing plan from the new price before updating
    // Fetch the new price to get its product name and interval
    const newPrice = await stripe.prices.retrieve(newPriceId, {
      expand: ["product"],
    });
    const newProduct = newPrice.product as Stripe.Product;
    const newPlanName =
      mapProductNameToPlanName(newProduct?.name) || PlanName.PRO;

    // Determine billing plan from the price interval
    const interval = newPrice.recurring?.interval || "month";
    const newBillingPlan =
      interval === "year" ? BillingPlan.ANNUAL : BillingPlan.MONTHLY;

    // Update Stripe subscription
    await stripe.subscriptions.update(team.stripeSubscriptionId, updateParams);

    // Get updated subscription to get billing cycle dates
    const updatedSubscription: Stripe.Subscription =
      await stripe.subscriptions.retrieve(team.stripeSubscriptionId);

    const periodStartTimestamp = (
      updatedSubscription as unknown as { current_period_start: number }
    ).current_period_start;
    const periodEndTimestamp = (
      updatedSubscription as unknown as { current_period_end: number }
    ).current_period_end;

    // Get billing cycle dates for team update
    const periodStart = new Date(periodStartTimestamp * 1000);
    const periodEnd = new Date(periodEndTimestamp * 1000);

    // Update team record with new billing plan
    const updateData: Parameters<typeof updateTeamSubscription>[1] = {
      stripeSubscriptionId: team.stripeSubscriptionId,
      planName: newPlanName,
      subscriptionStatus: SubscriptionStatus.ACTIVE,
      billingPlan: newBillingPlan,
    };

    await updateTeamSubscription(team.id, updateData);

    // Update billing usage record with retroactive cap (Option 1)
    // This treats existing usage against the new cap (e.g., 89/500 instead of 39 overages)
    // Only update billing usage if we have valid timestamps
    if (
      periodStartTimestamp &&
      periodEndTimestamp &&
      typeof periodStartTimestamp === "number" &&
      typeof periodEndTimestamp === "number" &&
      !isNaN(periodStart.getTime()) &&
      !isNaN(periodEnd.getTime())
    ) {
      await updateBillingUsageForUpgrade(
        team.id,
        newPlanName,
        newMeterPriceId || null,
        periodStart,
        periodEnd
      );
    }
  } else {
    // Schedule downgrade for period end
    // For downgrades, we update with proration_behavior: "none"
    // The price change happens immediately but user keeps current features until period end
    // Note: For true "at period end" scheduling, we'd use subscription schedules,
    // but this simpler approach works for most cases

    const updateParams: Stripe.SubscriptionUpdateParams = {
      proration_behavior: "none", // No proration for downgrades
    };

    // If newPriceId is empty, we're downgrading to Free (remove base subscription)
    if (!newPriceId || newPriceId.trim() === "") {
      // Downgrade to Free: remove base subscription item, keep only metered
      updateParams.items = [
        {
          id: baseItem.id,
          deleted: true, // Remove the base subscription item
        },
      ];

      // Update or add metered price if provided
      if (newMeterPriceId) {
        const meterItem = subscription.items.data.find(
          (item) => item.price.recurring?.usage_type === "metered"
        );

        if (meterItem) {
          updateParams.items.push({
            id: meterItem.id,
            price: newMeterPriceId,
          });
        } else {
          updateParams.items.push({
            price: newMeterPriceId,
          });
        }
      }
    } else {
      // Regular downgrade: change to new price
      updateParams.items = [
        {
          id: baseItem.id,
          price: newPriceId,
        },
      ];

      // Update metered price if provided
      if (newMeterPriceId) {
        const meterItem = subscription.items.data.find(
          (item) => item.price.recurring?.usage_type === "metered"
        );

        if (meterItem) {
          updateParams.items.push({
            id: meterItem.id,
            price: newMeterPriceId,
          });
        } else {
          updateParams.items.push({
            price: newMeterPriceId,
          });
        }
      }
    }

    await stripe.subscriptions.update(team.stripeSubscriptionId, updateParams);
  }
}

/**
 * Cancel subscription at period end
 */
export async function cancelSubscriptionAtPeriodEnd(team: Team) {
  if (!team.stripeSubscriptionId) {
    throw new Error("No active subscription found");
  }

  await stripe.subscriptions.update(team.stripeSubscriptionId, {
    cancel_at_period_end: true,
  });
}

/**
 * Reactivate a subscription that's scheduled to cancel
 */
export async function reactivateSubscription(team: Team) {
  if (!team.stripeSubscriptionId) {
    throw new Error("No active subscription found");
  }

  await stripe.subscriptions.update(team.stripeSubscriptionId, {
    cancel_at_period_end: false,
  });
}

/**
 * Get subscription details with upcoming invoice preview
 */
export async function getSubscriptionDetails(team: Team) {
  if (!team.stripeSubscriptionId) {
    return null;
  }

  const subscription = await stripe.subscriptions.retrieve(
    team.stripeSubscriptionId,
    {
      expand: [
        "items.data.price.product",
        "latest_invoice",
        "default_payment_method",
      ],
    }
  );

  // Extract serializable fields from Stripe subscription object
  const sub = subscription as unknown as {
    current_period_start: number;
    current_period_end: number;
    cancel_at_period_end: boolean;
    canceled_at: number | null;
  };

  return {
    subscription: {
      id: subscription.id,
      status: subscription.status,
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      cancel_at_period_end: sub.cancel_at_period_end,
      canceled_at: sub.canceled_at,
      items: subscription.items.data.map((item) => ({
        id: item.id,
        price: {
          id: item.price.id,
          unit_amount: item.price.unit_amount,
          currency: item.price.currency,
          recurring: item.price.recurring
            ? {
                interval: item.price.recurring.interval,
                usage_type: item.price.recurring.usage_type,
              }
            : null,
          product:
            typeof item.price.product === "string"
              ? item.price.product
              : (item.price.product as Stripe.Product).deleted
                ? (item.price.product as Stripe.Product).id
                : {
                    id: (item.price.product as Stripe.Product).id,
                    name: (item.price.product as Stripe.Product).name,
                  },
        },
      })),
    },
  };
}

/**
 * Report usage to Stripe for a single application
 * Uses Stripe's Meters API to report billing meter events
 * @deprecated Use reportBatchUsageToStripe for better performance
 */
export async function reportUsageToStripe(teamId: number): Promise<void> {
  try {
    // Get team with subscription info
    const team = await db
      .select()
      .from(teams)
      .where(eq(teams.id, teamId))
      .limit(1);

    if (!team[0] || !team[0].stripeCustomerId) {
      // No Stripe customer, skip reporting
      return;
    }

    // Report usage to Stripe using Meters API
    // Event name should match the meter configured in Stripe dashboard
    await stripe.billing.meterEvents.create({
      event_name: "applications_processed",
      payload: {
        value: "1", // 1 application processed
        stripe_customer_id: team[0].stripeCustomerId,
      },
      // Optional: include identifier for idempotency
      identifier: `app_${teamId}_${Date.now()}`,
    });
  } catch (error: any) {
    // Log error but don't throw - we don't want to block application creation if Stripe reporting fails
    console.error(
      `Error reporting usage to Stripe for team ${teamId}:`,
      error.message
    );
  }
}

/**
 * Batch report usage to Stripe for all unreported applications
 * Groups applications by team and reports the count for each team
 * Marks applications as reported after successful reporting
 *
 * @returns Object with summary of reporting results
 */
export async function reportBatchUsageToStripe(): Promise<{
  teamsProcessed: number;
  applicationsReported: number;
  errors: Array<{ teamId: number; error: string }>;
}> {
  const errors: Array<{ teamId: number; error: string }> = [];
  let teamsProcessed = 0;
  let applicationsReported = 0;

  try {
    // Get all unreported verification attempts (passed applications) grouped by team
    const unreportedAttempts = await db
      .select({
        teamId: verificationAttempts.teamId,
        id: verificationAttempts.id,
      })
      .from(verificationAttempts)
      .where(
        and(
          eq(verificationAttempts.stripeReported, false),
          eq(verificationAttempts.passed, true),
          isNotNull(verificationAttempts.completedAt)
        )
      );

    if (unreportedAttempts.length === 0) {
      return { teamsProcessed: 0, applicationsReported: 0, errors: [] };
    }

    // Group attempts by team
    const attemptsByTeam = new Map<number, string[]>();
    for (const attempt of unreportedAttempts) {
      const teamAttempts = attemptsByTeam.get(attempt.teamId) || [];
      teamAttempts.push(attempt.id);
      attemptsByTeam.set(attempt.teamId, teamAttempts);
    }

    // Process each team
    for (const [teamId, attemptIds] of attemptsByTeam.entries()) {
      try {
        // Get team with Stripe customer ID
        const team = await db
          .select()
          .from(teams)
          .where(eq(teams.id, teamId))
          .limit(1);

        if (!team[0] || !team[0].stripeCustomerId) {
          // No Stripe customer, mark as reported to avoid retrying
          await db
            .update(verificationAttempts)
            .set({ stripeReported: true })
            .where(
              and(
                eq(verificationAttempts.teamId, teamId),
                eq(verificationAttempts.stripeReported, false),
                eq(verificationAttempts.passed, true),
                isNotNull(verificationAttempts.completedAt)
              )
            );
          continue;
        }

        const count = attemptIds.length;

        // Report usage to Stripe using Meters API
        // Report the count as a single event with value = count
        await stripe.billing.meterEvents.create({
          event_name: "applications_processed",
          payload: {
            value: count.toString(), // Total count of applications for this team
            stripe_customer_id: team[0].stripeCustomerId,
          },
          // Include identifier for idempotency
          identifier: `batch_${teamId}_${Date.now()}`,
        });

        // Mark all attempts as reported
        await db
          .update(verificationAttempts)
          .set({ stripeReported: true })
          .where(
            and(
              eq(verificationAttempts.teamId, teamId),
              eq(verificationAttempts.stripeReported, false),
              eq(verificationAttempts.passed, true),
              isNotNull(verificationAttempts.completedAt)
            )
          );

        teamsProcessed++;
        applicationsReported += count;

        console.log(
          `Successfully reported ${count} application(s) for team ${teamId}`
        );
      } catch (error: any) {
        // Log error but continue processing other teams
        const errorMessage = error.message || "Unknown error";
        errors.push({ teamId, error: errorMessage });
        console.error(
          `Error reporting usage to Stripe for team ${teamId}:`,
          errorMessage
        );
      }
    }

    return { teamsProcessed, applicationsReported, errors };
  } catch (error: any) {
    console.error("Error in batch reporting to Stripe:", error);
    throw error;
  }
}

export async function getStripeProducts() {
  const products = await stripe.products.list({
    active: true,
    expand: ["data.default_price"],
  });

  return products.data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    defaultPriceId:
      typeof product.default_price === "string"
        ? product.default_price
        : product.default_price?.id,
  }));
}
