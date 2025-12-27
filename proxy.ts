import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { signToken, verifyToken } from "@/lib/auth/session";
import { getTeamForUser } from "@/lib/db/queries";
import { SubscriptionStatus } from "@/lib/db/schema";

const protectedRoutePrefixes = ["/app"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = request.cookies.get("session");
  const isProtectedRoute = protectedRoutePrefixes.some((prefix) =>
    pathname.startsWith(prefix)
  );

  // For protected routes, verify the session is valid
  if (isProtectedRoute) {
    if (!sessionCookie) {
      return NextResponse.redirect(new URL("/sign-in", request.url));
    }

    try {
      // Verify the session token is valid
      await verifyToken(sessionCookie.value);

      // Allow access to /app/tier and /app/onboarding pages
      if (pathname === "/app/tier" || pathname === "/app/onboarding") {
        return NextResponse.next();
      }

      // Check if user has a team (required for app access)
      const team = await getTeamForUser();
      if (!team) {
        // No team found - redirect to tier page
        return NextResponse.redirect(new URL("/app/tier", request.url));
      }

      // Check onboarding status
      if (!team.onboardingComplete && pathname !== "/app/onboarding") {
        return NextResponse.redirect(new URL("/app/onboarding", request.url));
      }

      // Check if they have an active subscription
      // All users must have an active subscription to access the app
      const hasActiveSubscription =
        team.stripeSubscriptionId &&
        team.subscriptionStatus === SubscriptionStatus.ACTIVE;

      // If no active subscription, redirect to tier page to select a plan
      if (!hasActiveSubscription) {
        return NextResponse.redirect(new URL("/app/tier", request.url));
      }
    } catch (error) {
      // Invalid or expired session - redirect to sign-in
      console.error("Error verifying session:", error);
      const response = NextResponse.redirect(new URL("/sign-in", request.url));
      response.cookies.delete("session");
      return response;
    }
  }

  let res = NextResponse.next();

  // Refresh session cookie on GET requests if valid
  if (sessionCookie && request.method === "GET") {
    try {
      const parsed = await verifyToken(sessionCookie.value);
      const expiresInOneDay = new Date(Date.now() + 24 * 60 * 60 * 1000);

      res.cookies.set({
        name: "session",
        value: await signToken({
          ...parsed,
          expires: expiresInOneDay.toISOString(),
        }),
        httpOnly: true,
        secure: true,
        sameSite: "lax",
        expires: expiresInOneDay,
      });
    } catch (error) {
      console.error("Error updating session:", error);
      res.cookies.delete("session");
      // If this was a protected route, we already handled it above
      // But if it becomes invalid during refresh, redirect
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL("/sign-in", request.url));
      }
    }
  }

  return res;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
  runtime: "nodejs",
};
