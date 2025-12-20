import { PricingCards } from "./_components/pricing-cards";
import { PromotionalBanner } from "./_components/promotional-banner";
import { getCouponUsage } from "@/lib/payments/coupon-utils";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  // Pass Stripe price IDs from environment variables
  const priceIds = {
    basicMeter: process.env.STRIPE_PRICE_BASIC_METER_USAGE || "",
    basicMonthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || "",
    proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    proMeter: process.env.STRIPE_PRICE_PRO_METER_USAGE || "",
  };

  // Get coupon usage information
  const couponId = process.env.STRIPE_COUPON_EARLY_ADOPTER;
  const couponUsage = couponId
    ? await getCouponUsage(couponId, 25, new Date("2026-01-01"))
    : { remaining: 0, total: 25, used: 0, available: false };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Choose Your Plan
        </h1>
        <p className="text-lg text-muted-foreground">
          Pay as you use with free monthly caps. Upgrade anytime.
        </p>
      </div>

      {couponUsage.available && (
        <PromotionalBanner remaining={couponUsage.remaining} />
      )}

      <PricingCards priceIds={priceIds} />
    </main>
  );
}
