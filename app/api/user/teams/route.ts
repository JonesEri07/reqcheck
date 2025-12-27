import { NextResponse } from "next/server";
import { getAllTeamsForUser } from "@/lib/db/queries";

export async function GET() {
  try {
    const teams = await getAllTeamsForUser();
    return NextResponse.json({ teams });
  } catch (error: any) {
    console.error("Error fetching user teams:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch teams" },
      { status: 500 }
    );
  }
}

