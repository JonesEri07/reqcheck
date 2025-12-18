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

      // Check if user has a team (required for app access)
      const team = await getTeamForUser();
      if (!team) {
        // No team found - redirect to pricing to sign up
        return NextResponse.redirect(new URL("/pricing", request.url));
      }

      // Check if they have an active subscription
      // Allow access if:
      // 1. They have an active subscription, OR
      // 2. They're on Free plan (for now, we'll allow Free users to access app)
      //    but they'll need to add payment method if they exceed free cap
      const hasActiveSubscription =
        team.stripeSubscriptionId &&
        team.subscriptionStatus === SubscriptionStatus.ACTIVE;

      const isFreePlan = !team.planName || team.planName === "FREE";

      // If no active subscription and not on Free plan, redirect to pricing
      if (!hasActiveSubscription && !isFreePlan) {
        return NextResponse.redirect(new URL("/pricing", request.url));
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
