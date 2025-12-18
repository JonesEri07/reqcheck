import { NextRequest, NextResponse } from "next/server";
import { reportBatchUsageToStripe } from "@/lib/payments/stripe";

/**
 * POST /api/cron/report-stripe-usage
 * Nightly batch job to report unreported applications to Stripe
 *
 * This endpoint should be called by a cron service (e.g., Vercel Cron, GitHub Actions, etc.)
 *
 * Security: Validate cron secret if CRON_SECRET is set in environment variables
 */
export async function POST(request: NextRequest) {
  try {
    // Optional: Validate cron secret for security
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Run batch reporting
    const result = await reportBatchUsageToStripe();

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in cron job for Stripe usage reporting:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/cron/report-stripe-usage
 * Allow GET requests for cron services that don't support POST
 */
export async function GET(request: NextRequest) {
  try {
    // Optional: Validate cron secret for security
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret) {
      const authHeader = request.headers.get("authorization");
      const secretParam = request.nextUrl.searchParams.get("secret");

      if (authHeader !== `Bearer ${cronSecret}` && secretParam !== cronSecret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
    }

    // Run batch reporting
    const result = await reportBatchUsageToStripe();

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in cron job for Stripe usage reporting:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
