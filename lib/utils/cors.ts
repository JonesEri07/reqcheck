import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * CORS headers for widget API routes
 * Allows cross-origin requests from customer sites
 */
export function withCors(
  response: NextResponse,
  request: NextRequest
): NextResponse {
  const origin = request.headers.get("origin");

  // Allow requests from any origin (widget is embedded on customer sites)
  // In production, you might want to restrict this to specific domains
  if (origin) {
    response.headers.set("Access-Control-Allow-Origin", origin);
  } else {
    // Fallback: allow all origins if no origin header
    response.headers.set("Access-Control-Allow-Origin", "*");
  }

  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, x-api-key"
  );
  response.headers.set("Access-Control-Allow-Credentials", "true");
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  return response;
}

/**
 * Handle OPTIONS preflight requests
 */
export function handleOptions(request: NextRequest): NextResponse {
  const response = new NextResponse(null, { status: 204 });
  return withCors(response, request);
}
