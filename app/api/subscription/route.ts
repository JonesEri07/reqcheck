import { NextRequest, NextResponse } from "next/server";
import { getTeamForUser } from "@/lib/db/queries";
import { getSubscriptionDetails } from "@/lib/payments/stripe";

export async function GET(request: NextRequest) {
  try {
    const team = await getTeamForUser();
    if (!team || !team.stripeSubscriptionId) {
      return NextResponse.json(
        { error: "No active subscription found" },
        { status: 404 }
      );
    }

    const subscriptionDetails = await getSubscriptionDetails(team);
    if (!subscriptionDetails) {
      return NextResponse.json(
        { error: "Could not retrieve subscription details" },
        { status: 404 }
      );
    }

    return NextResponse.json(subscriptionDetails);
  } catch (error: any) {
    console.error("Error fetching subscription details:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch subscription details" },
      { status: 500 }
    );
  }
}
