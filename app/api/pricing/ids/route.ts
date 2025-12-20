import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    basicMonthly: process.env.STRIPE_PRICE_BASIC_MONTHLY || "",
    basicMeter: process.env.STRIPE_PRICE_BASIC_METER_USAGE || "",
    proMonthly: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    proMeter: process.env.STRIPE_PRICE_PRO_METER_USAGE || "",
  });
}
