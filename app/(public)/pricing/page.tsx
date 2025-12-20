import { PricingCards } from "./_components/pricing-cards";
import { PromotionalBanner } from "./_components/promotional-banner";
import { isCouponValid } from "@/lib/payments/coupon-utils";

// Prices are fresh for one hour max
export const revalidate = 3600;

export default async function PricingPage() {
  // Pass Stripe price IDs from environment variables
  const priceIds = {
    freeMeter: process.env.STRIPE_PRICE_FREE_METER_USAGE || "",
    proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    proAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL || "",
    proMeter: process.env.STRIPE_PRICE_PRO_METER_USAGE || "",
  };

  // Check if promotional coupon is valid
  const couponId = process.env.STRIPE_COUPON_EARLY_ADOPTER;
  const showPromotion = couponId ? await isCouponValid(couponId) : false;

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

      {showPromotion && <PromotionalBanner />}

      <PricingCards priceIds={priceIds} />
    </main>
  );
}
