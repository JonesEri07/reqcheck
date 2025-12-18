import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    proAnnual: process.env.STRIPE_PRICE_PRO_ANNUAL || "",
    proMeter: process.env.STRIPE_PRICE_PRO_METER_USAGE || "",
    freeMeter: process.env.STRIPE_PRICE_FREE_METER_USAGE || "",
  });
}
