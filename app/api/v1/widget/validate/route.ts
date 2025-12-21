import { NextRequest, NextResponse } from "next/server";
import { withCors, handleOptions } from "@/lib/utils/cors";
import { getJobByExternalId } from "@/lib/jobs/queries";
import { isOriginWhitelisted } from "@/lib/widget/whitelist";
import { getJobQuestionsForQuiz } from "@/lib/widget/job-questions";
import { db } from "@/lib/db/drizzle";
import { teams, jobs } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { JobStatus } from "@/lib/db/schema";

/**
 * GET /api/v1/widget/validate
 * Validates that a widget can render for a given company/job/domain
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const companyId = searchParams.get("companyId");
  const jobId = searchParams.get("jobId"); // external job ID
  const origin = searchParams.get("origin") || request.headers.get("origin");
  const testMode = searchParams.get("testMode") === "true";

  if (!companyId || !jobId) {
    const response = NextResponse.json(
      { error: "Missing companyId or jobId", canRender: false },
      { status: 400 }
    );
    return withCors(response, request);
  }

  try {
    // Get team by ID (companyId is teamId)
    const teamId = parseInt(companyId, 10);
    if (isNaN(teamId)) {
      const response = NextResponse.json(
        {
          error: "Invalid companyId",
          errorCode: "COMPANY_NOT_FOUND",
          canRender: false,
        },
        { status: 400 }
      );
      return withCors(response, request);
    }

    const team = await db.query.teams.findFirst({
      where: eq(teams.id, teamId),
    });

    if (!team) {
      const response = NextResponse.json(
        {
          error: "Company not found",
          errorCode: "COMPANY_NOT_FOUND",
          canRender: false,
        },
        { status: 404 }
      );
      return withCors(response, request);
    }

    // Get job by external ID
    const job = await getJobByExternalId(jobId, teamId);

    if (!job) {
      const response = NextResponse.json(
        {
          error: "Job not found",
          errorCode: "JOB_NOT_FOUND",
          canRender: false,
        },
        { status: 404 }
      );
      return withCors(response, request);
    }

    // Check if job is open
    if (job.status !== JobStatus.OPEN) {
      const response = NextResponse.json(
        {
          error: "Job is not open",
          errorCode: "JOB_NOT_OPEN",
          canRender: false,
        },
        { status: 400 }
      );
      return withCors(response, request);
    }

    // Check whitelist URLs
    const whitelistUrls = team.whitelistUrls || [];

    // Allow localhost in development for testing
    const isLocalhost =
      origin &&
      (origin.includes("localhost") ||
        origin.includes("127.0.0.1") ||
        origin.includes("::1"));

    // Check if origin is reqcheck.io (always allowed)
    const isReqcheckDomain =
      origin &&
      (() => {
        try {
          const originUrl = new URL(origin);
          return (
            originUrl.hostname === "reqcheck.io" ||
            originUrl.hostname.endsWith(".reqcheck.io")
          );
        } catch {
          return false;
        }
      })();

    if (whitelistUrls.length === 0) {
      // In development, allow localhost even without whitelist
      // Also allow reqcheck.io domain without whitelist
      if (
        (isLocalhost && process.env.NODE_ENV === "development") ||
        isReqcheckDomain
      ) {
        // Allow localhost for testing or reqcheck.io domain
      } else {
        const response = NextResponse.json(
          {
            error:
              "No whitelist URLs configured. Please add at least one whitelist URL in Settings > Configuration.",
            errorCode: "NO_WHITELIST",
            canRender: false,
          },
          { status: 400 }
        );
        return withCors(response, request);
      }
    } else if (origin && !isLocalhost && !isReqcheckDomain) {
      // Only check whitelist if not localhost and not reqcheck.io
      if (!isOriginWhitelisted(origin, whitelistUrls)) {
        const response = NextResponse.json(
          {
            error: `Origin "${origin}" is not whitelisted. Please add it to your whitelist URLs in Settings > Configuration.`,
            errorCode: "DOMAIN_NOT_WHITELISTED",
            canRender: false,
          },
          { status: 403 }
        );
        return withCors(response, request);
      }
    }

    // Check if at least one question can be generated
    const skillsWithQuestions = await getJobQuestionsForQuiz(
      job.id,
      teamId,
      team.defaultQuestionTimeLimitSeconds ?? null
    );
    const totalEligibleQuestions = skillsWithQuestions.reduce(
      (sum, skill) => sum + skill.questions.length,
      0
    );

    if (totalEligibleQuestions === 0) {
      const response = NextResponse.json(
        {
          error: "No questions available for this job",
          errorCode: "NO_QUESTIONS_AVAILABLE",
          canRender: false,
        },
        { status: 400 }
      );
      return withCors(response, request);
    }

    // Widget can render
    const response = NextResponse.json({
      canRender: true,
      config: {
        passThreshold: job.passThreshold,
        questionCount: job.questionCount,
        jobId: job.id,
      },
      widgetStyles: team.widgetStyles || null,
    });

    return withCors(response, request);
  } catch (error: any) {
    console.error("Error validating widget:", error);
    const response = NextResponse.json(
      {
        error: error.message || "Internal server error",
        errorCode: "INTERNAL_ERROR",
        canRender: false,
      },
      { status: 500 }
    );
    return withCors(response, request);
  }
}

export async function OPTIONS(request: NextRequest) {
  return handleOptions(request);
}
