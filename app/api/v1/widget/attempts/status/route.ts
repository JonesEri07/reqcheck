import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "@/lib/utils/cors";
import { getJobByExternalId } from "@/lib/jobs/queries";
import { normalizeEmail } from "@/lib/utils/email";
import { db } from "@/lib/db/drizzle";
import { teams, verificationAttempts } from "@/lib/db/schema";
import { eq, and, desc } from "drizzle-orm";

/**
 * GET /api/v1/widget/attempts/status
 * Check verification status for email/job
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");
  const jobId = searchParams.get("jobId"); // external job ID
  const companyId = searchParams.get("companyId");

  if (!email || !jobId || !companyId) {
    const response = NextResponse.json(
      { error: "Missing required parameters: email, jobId, companyId" },
      { status: 400 }
    );
    return withCors(response, request);
  }

  try {
    // Get team
    const teamId = parseInt(companyId, 10);
    if (isNaN(teamId)) {
      const response = NextResponse.json(
        { error: "Invalid companyId" },
        { status: 400 }
      );
      return withCors(response, request);
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      const response = NextResponse.json(
        { error: "Company not found" },
        { status: 404 }
      );
      return withCors(response, request);
    }

    // Get job
    const job = await getJobByExternalId(jobId, teamId);
    if (!job) {
      const response = NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
      return withCors(response, request);
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
      const response = NextResponse.json({
        verified: false,
        passed: false,
      });
      return withCors(response, request);
    }

    const response = NextResponse.json({
      verified: true,
      passed: attempt.passed || false,
      score: attempt.score || 0,
      completedAt: attempt.completedAt.toISOString(),
      tokenExpiresAt: attempt.tokenExpiresAt?.toISOString() || null,
    });

    return withCors(response, request);
  } catch (error: any) {
    console.error("Error checking status:", error);
    const response = NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
    return withCors(response, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
