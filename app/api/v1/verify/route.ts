import { NextRequest, NextResponse } from "next/server";
import { verifyApiKey } from "@/lib/auth/api-key";
import { getJobByExternalId } from "@/lib/jobs/queries";
import { normalizeEmail } from "@/lib/utils/email";
import { db } from "@/lib/db/drizzle";
import { verificationAttempts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * POST /api/v1/verify
 * ATS backend calls this to verify candidate before accepting application
 * Requires API key authentication
 */
export async function POST(request: NextRequest) {
  try {
    // Get API key from header
    const apiKey = request.headers.get("x-api-key");
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing x-api-key header" },
        { status: 401 }
      );
    }

    // Verify API key
    const teamId = await verifyApiKey(apiKey);
    if (!teamId) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Parse request body
    const body = await request.json();
    const { email, externalJobId } = body;

    if (!email || !externalJobId) {
      return NextResponse.json(
        { error: "Missing required fields: email, externalJobId" },
        { status: 400 }
      );
    }

    // Get job
    const job = await getJobByExternalId(externalJobId, teamId);
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Normalize email
    const emailNormalized = normalizeEmail(email);

    // Get most recent completed attempt
    const attempt = await db.query.verificationAttempts.findFirst({
      where: and(
        eq(verificationAttempts.emailNormalized, emailNormalized),
        eq(verificationAttempts.jobId, job.id)
      ),
      orderBy: [desc(verificationAttempts.completedAt)],
    });

    if (!attempt || !attempt.completedAt) {
      return NextResponse.json({
        verified: false,
        passed: false,
      });
    }

    // Check if verification token is still valid (24 hour TTL)
    const isTokenValid =
      attempt.verificationToken &&
      attempt.tokenExpiresAt &&
      new Date(attempt.tokenExpiresAt) > new Date();

    return NextResponse.json({
      verified: isTokenValid && attempt.passed === true,
      passed: attempt.passed || false,
      score: attempt.score || 0,
      completedAt: attempt.completedAt.toISOString(),
      tokenExpiresAt: attempt.tokenExpiresAt?.toISOString() || null,
    });
  } catch (error: any) {
    console.error("Error verifying candidate:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
