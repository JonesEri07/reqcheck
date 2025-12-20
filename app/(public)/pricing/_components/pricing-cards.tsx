"use client";

import React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactSalesButton } from "@/components/contact-sales-button";
import {
  TIER_QUESTION_LIMITS,
  TIER_CUSTOM_SKILL_LIMITS,
  TIER_JOB_LIMITS,
} from "@/lib/constants/tier-limits";
import { BILLING_CAPS } from "@/lib/constants/billing";
import { PlanName } from "@/lib/db/schema";

interface PriceIds {
  basicMeter: string;
  basicMonthly: string;
  proMonthly: string;
  proMeter: string;
}

export function PricingCards({ priceIds }: { priceIds: PriceIds }) {
  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <PricingCard
        name="Basic"
        price={15}
        interval="month"
        basicCap={BILLING_CAPS[PlanName.BASIC]}
        usageRate={0.75}
        features={[
          `${TIER_QUESTION_LIMITS[PlanName.BASIC]} questions per skill`,
          `${TIER_CUSTOM_SKILL_LIMITS[PlanName.BASIC]} custom skills`,
          `${TIER_JOB_LIMITS[PlanName.BASIC]} active jobs`,
        ]}
        limitations={["No additional team members", "No ATS integrations"]}
        monthlyPriceId={priceIds.basicMonthly}
        meterPriceId={priceIds.basicMeter}
        isBasic={true}
      />
      <PricingCard
        name="Pro"
        price={129}
        interval="month"
        basicCap={BILLING_CAPS[PlanName.PRO]}
        usageRate={"0.35"}
        features={[
          "ATS integrations with auto sync",
          `${TIER_QUESTION_LIMITS[PlanName.PRO]} questions per skill`,
          `${TIER_CUSTOM_SKILL_LIMITS[PlanName.PRO]} custom skills`,
          `${TIER_JOB_LIMITS[PlanName.PRO]} active jobs`,
          "5 additional team members",
        ]}
        monthlyPriceId={priceIds.proMonthly}
        meterPriceId={priceIds.proMeter}
        isPopular={true}
      />
      <PricingCard
        name="Enterprise"
        price={null}
        interval="negotiated"
        basicCap={null}
        usageRate={null}
        features={[
          // `${BILLING_CAPS[PlanName.ENTERPRISE].toLocaleString()} free applications per month`,
          "All Pro features",
          // `Max ${TIER_QUESTION_LIMITS[PlanName.ENTERPRISE]} questions per skill`,
          // `Up to ${TIER_CUSTOM_SKILL_LIMITS[PlanName.ENTERPRISE]} custom skills`,
          // `Up to ${TIER_JOB_LIMITS[PlanName.ENTERPRISE]} jobs total`,
          "20 additional team members",
          "Dedicated support",
          "Custom pricing and terms",
        ]}
        isEnterprise={true}
      />
    </div>
  );
}

function PricingCard({
  name,
  price,
  basicCap,
  usageRate,
  features,
  limitations,
  monthlyPriceId,
  meterPriceId,
  isBasic,
  isPopular,
  isEnterprise,
}: {
  name: string;
  price: number | null;
  interval: string;
  basicCap: number | null;
  usageRate: number | string | null;
  features: string[];
  limitations?: string[];
  monthlyPriceId?: string;
  meterPriceId?: string;
  isBasic?: boolean;
  isPopular?: boolean;
  isEnterprise?: boolean;
}) {
  const currentPrice = price;
  const currentPriceId = monthlyPriceId;

  return (
    <Card
      className={`relative ${
        isPopular ? "border-primary border-2 bg-primary/5" : "border-2"
      }`}
    >
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="default">Most Popular</Badge>
        </div>
      )}

      <CardHeader>
        <div className="flex md:flex-col lg:flex-row items-center justify-between">
          <CardTitle className="text-2xl">{name}</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        {isEnterprise ? (
          <>
            <p className="text-sm text-muted-foreground mb-2">
              Contact us for pricing
            </p>
            {basicCap !== null && (
              <p className="text-sm text-muted-foreground mb-6">
                {basicCap.toLocaleString()} free applications/month included
              </p>
            )}
          </>
        ) : (
          <>
            <p className="text-4xl font-bold text-foreground mb-2">
              {currentPrice !== null ? (
                <>
                  ${currentPrice.toLocaleString()}
                  <span className="text-lg text-muted-foreground font-normal">
                    {" "}
                    /month
                  </span>
                </>
              ) : (
                "Custom"
              )}
            </p>

            {basicCap !== null && usageRate !== null && (
              <p className="text-sm text-muted-foreground mb-6">
                {basicCap} free applications/month, then ${usageRate}
                /application
              </p>
            )}
          </>
        )}

        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-foreground text-sm">{feature}</span>
            </li>
          ))}
          {limitations?.map((limitation, index) => (
            <li key={`limitation-${index}`} className="flex items-start">
              <X className="h-5 w-5 text-muted-foreground mr-2 mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground text-sm">
                {limitation}
              </span>
            </li>
          ))}
        </ul>

        {isEnterprise ? (
          <ContactSalesButton variant="outline" className="w-full" />
        ) : isBasic ? (
          <Button asChild variant="outline" className="w-full">
            <Link href="/sign-up?plan=basic">Get Started</Link>
          </Button>
        ) : currentPriceId ? (
          <Button asChild className="w-full">
            <Link href="/sign-up?plan=pro-monthly">Get Started</Link>
          </Button>
        ) : (
          <div className="text-sm text-muted-foreground text-center py-2">
            Pricing not available at this time
          </div>
        )}
      </CardContent>
    </Card>
  );
}
