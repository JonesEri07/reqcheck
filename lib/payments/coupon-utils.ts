import { stripe } from "./stripe";

/**
 * Check if a Stripe coupon is still valid
 * @param couponId - The Stripe coupon ID to check
 * @returns true if coupon exists and is valid, false otherwise
 */
export async function isCouponValid(
  couponId: string | undefined
): Promise<boolean> {
  if (!couponId) {
    return false;
  }

  try {
    const coupon = await stripe.coupons.retrieve(couponId);
    return coupon.valid;
  } catch (error) {
    console.error("Error retrieving coupon:", error);
    return false;
  }
}

/**
 * Get coupon usage information
 * @param couponId - The Stripe coupon ID to check
 * @param maxUses - Maximum number of uses allowed (default: 25)
 * @param cutoffDate - Date after which coupon is no longer valid (default: Jan 1, 2026)
 * @returns Object with remaining uses and whether coupon is available
 */
export async function getCouponUsage(
  couponId: string | undefined,
  maxUses: number = 25,
  cutoffDate: Date = new Date("2026-01-01")
): Promise<{
  remaining: number;
  total: number;
  used: number;
  available: boolean;
}> {
  if (!couponId) {
    return { remaining: 0, total: maxUses, used: 0, available: false };
  }

  // Check if we're past the cutoff date
  const now = new Date();
  if (now >= cutoffDate) {
    return { remaining: 0, total: maxUses, used: maxUses, available: false };
  }

  try {
    const coupon = await stripe.coupons.retrieve(couponId);
    
    // Get times redeemed (0 if null/undefined)
    const used = coupon.times_redeemed || 0;
    
    // Calculate remaining (maxUses - used, but not less than 0)
    const remaining = Math.max(0, maxUses - used);
    
    // Coupon is available if it's valid, not expired, and has remaining uses
    const available = coupon.valid && remaining > 0 && now < cutoffDate;

    return {
      remaining,
      total: maxUses,
      used,
      available,
    };
  } catch (error) {
    console.error("Error retrieving coupon usage:", error);
    return { remaining: 0, total: maxUses, used: 0, available: false };
  }
}
