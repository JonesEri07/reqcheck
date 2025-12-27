"use server";

import { db } from "@/lib/db/drizzle";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { createCheckoutSessionForNewUser } from "@/lib/payments/stripe";
import { PlanName } from "@/lib/db/schema";
import { redirect } from "next/navigation";

const checkEmailSchema = z.object({
  email: z.string().email(),
});

function getPlanNameFromIdentifier(identifier: string): PlanName | null {
  if (identifier === "basic") return PlanName.BASIC;
  if (identifier === "pro-monthly") return PlanName.PRO;
  return null;
}

export async function processCheckoutAction(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; redirectTo?: string }> {
  try {
    const email = formData.get("email") as string;
    const planTypeParam = formData.get("planType") as string;

    if (!email) {
      return { error: "Email is required" };
    }

    if (!planTypeParam) {
      return { error: "Plan type is required" };
    }

    // Validate email format
    const validated = checkEmailSchema.safeParse({ email });
    if (!validated.success) {
      return {
        error: "Please enter a valid email address",
      };
    }

    const normalizedEmail = validated.data.email.toLowerCase().trim();

    // Check if user exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, normalizedEmail))
      .limit(1);

    // If user exists, redirect to sign-in
    if (existingUser.length > 0) {
      return {
        redirectTo: `/sign-in?email=${encodeURIComponent(normalizedEmail)}`,
      };
    }

    // User doesn't exist, proceed to checkout
    const planType = getPlanNameFromIdentifier(planTypeParam);
    if (!planType) {
      return { error: "Invalid plan type" };
    }

    // Get price IDs
    const basicMonthlyPriceId = process.env.STRIPE_PRICE_BASIC_MONTHLY || "";
    const basicMeterPriceId =
      process.env.STRIPE_PRICE_BASIC_METER_USAGE || "";
    const proMonthlyPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY || "";
    const proMeterPriceId = process.env.STRIPE_PRICE_PRO_METER_USAGE || "";

    let priceId: string;
    let meterPriceId: string;

    if (planType === PlanName.BASIC) {
      priceId = basicMonthlyPriceId;
      meterPriceId = basicMeterPriceId;
    } else {
      priceId = proMonthlyPriceId;
      meterPriceId = proMeterPriceId;
    }

    if (!priceId || !meterPriceId) {
      return { error: "Price IDs not configured" };
    }

    const checkoutUrl = await createCheckoutSessionForNewUser({
      priceId,
      meterPriceId,
      planType,
      email: normalizedEmail,
    });

    // redirect() throws a special error that must be re-thrown
    redirect(checkoutUrl);
  } catch (error: any) {
    // Re-throw redirect errors - they should not be caught
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: error.message || "An error occurred" };
  }
}

export async function createCheckoutForNewUserAction(
  prevState: any,
  formData: FormData
): Promise<{ checkoutUrl?: string; error?: string }> {
  try {
    const planTypeParam = formData.get("planType") as string;
    const email = formData.get("email") as string;

    if (!planTypeParam) {
      return { error: "Plan type is required" };
    }

    if (!email) {
      return { error: "Email is required" };
    }

    const planType = getPlanNameFromIdentifier(planTypeParam);
    if (!planType) {
      return { error: "Invalid plan type" };
    }

    // Get price IDs
    const basicMonthlyPriceId = process.env.STRIPE_PRICE_BASIC_MONTHLY || "";
    const basicMeterPriceId =
      process.env.STRIPE_PRICE_BASIC_METER_USAGE || "";
    const proMonthlyPriceId = process.env.STRIPE_PRICE_PRO_MONTHLY || "";
    const proMeterPriceId = process.env.STRIPE_PRICE_PRO_METER_USAGE || "";

    let priceId: string;
    let meterPriceId: string;

    if (planType === PlanName.BASIC) {
      priceId = basicMonthlyPriceId;
      meterPriceId = basicMeterPriceId;
    } else {
      priceId = proMonthlyPriceId;
      meterPriceId = proMeterPriceId;
    }

    if (!priceId || !meterPriceId) {
      return { error: "Price IDs not configured" };
    }

    const checkoutUrl = await createCheckoutSessionForNewUser({
      priceId,
      meterPriceId,
      planType,
      email: email.toLowerCase().trim(),
    });

    // redirect() throws a special error that must be re-thrown
    redirect(checkoutUrl);
  } catch (error: any) {
    // Re-throw redirect errors - they should not be caught
    if (error?.digest?.startsWith("NEXT_REDIRECT")) {
      throw error;
    }
    return { error: error.message || "Failed to create checkout session" };
  }
}

