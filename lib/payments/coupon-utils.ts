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
