import { NextRequest, NextResponse } from "next/server";
import { batchSyncIntegrations } from "@/lib/integrations/batch-sync";
import { SyncFrequency } from "@/lib/db/schema";

/**
 * POST /api/cron/sync-integrations-hourly
 * Hourly cron job to sync integrations with HOURLY sync frequency
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

    // Run batch sync for hourly integrations
    const result = await batchSyncIntegrations(SyncFrequency.HOURLY);

    return NextResponse.json({
      success: true,
      frequency: "HOURLY",
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in hourly integration sync cron job:", error);
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
 * GET /api/cron/sync-integrations-hourly
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

    // Run batch sync for hourly integrations
    const result = await batchSyncIntegrations(SyncFrequency.HOURLY);

    return NextResponse.json({
      success: true,
      frequency: "HOURLY",
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Error in hourly integration sync cron job:", error);
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
