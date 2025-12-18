"use client";

import React from "react";
import Link from "next/link";
import { Check, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ContactSalesButton } from "@/components/contact-sales-button";

interface PriceIds {
  freeMeter: string;
  proMonthly: string;
  proAnnual: string;
  proMeter: string;
}

export function PricingCards({ priceIds }: { priceIds: PriceIds }) {
  const [selectedProInterval, setSelectedProInterval] = React.useState<
    "month" | "year"
  >("month");

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      <PricingCard
        name="Free"
        price={0}
        interval="month"
        freeCap={50}
        usageRate={0.25}
        features={[
          "50 free applications per month",
          "$0.25/application after free cap",
          "Credit card required for usage over cap",
          "Max 10 questions per skill",
          "No additional team members",
        ]}
        limitations={["No ATS integrations"]}
        meterPriceId={priceIds.freeMeter}
        isFree={true}
      />
      <PricingCard
        name="Pro"
        price={99}
        interval="month"
        yearlyPrice={990}
        yearlyInterval="year"
        freeCap={500}
        usageRate={"0.10"}
        features={[
          "500 free applications per month",
          "$0.10/application after free cap",
          "ATS integrations with auto sync",
          "Max 50 questions per skill",
          "Up to 5 additional team members",
        ]}
        monthlyPriceId={priceIds.proMonthly}
        yearlyPriceId={priceIds.proAnnual}
        meterPriceId={priceIds.proMeter}
        selectedInterval={selectedProInterval}
        onIntervalChange={setSelectedProInterval}
        isPopular={true}
      />
      <PricingCard
        name="Enterprise"
        price={null}
        interval="negotiated"
        freeCap={null}
        usageRate={null}
        features={[
          "All Pro features",
          "Up to 20 additional team members",
          "Dedicated support",
        ]}
        isEnterprise={true}
      />
    </div>
  );
}

function PricingCard({
  name,
  price,
  yearlyPrice,
  freeCap,
  usageRate,
  features,
  limitations,
  monthlyPriceId,
  yearlyPriceId,
  selectedInterval,
  onIntervalChange,
  isFree,
  isPopular,
  isEnterprise,
}: {
  name: string;
  price: number | null;
  interval: string;
  yearlyPrice?: number;
  yearlyInterval?: string;
  freeCap: number | null;
  usageRate: number | string | null;
  features: string[];
  limitations?: string[];
  monthlyPriceId?: string;
  yearlyPriceId?: string;
  meterPriceId?: string;
  selectedInterval?: "month" | "year";
  onIntervalChange?: (interval: "month" | "year") => void;
  isFree?: boolean;
  isPopular?: boolean;
  isEnterprise?: boolean;
}) {
  const currentPrice =
    selectedInterval === "year" && yearlyPrice !== undefined
      ? yearlyPrice
      : price;
  const currentPriceId =
    selectedInterval === "year" && yearlyPriceId
      ? yearlyPriceId
      : monthlyPriceId;

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
        <CardTitle className="text-2xl">{name}</CardTitle>
      </CardHeader>

      <CardContent>
        {isEnterprise ? (
          <p className="text-sm text-muted-foreground mb-6">
            Contact us for pricing
          </p>
        ) : (
          <>
            {yearlyPrice !== undefined && onIntervalChange && (
              <div className="mb-4 flex gap-2 justify-center">
                <Button
                  type="button"
                  variant={selectedInterval === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onIntervalChange("month")}
                >
                  Monthly
                </Button>
                <Button
                  type="button"
                  variant={selectedInterval === "year" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onIntervalChange("year")}
                >
                  Yearly
                </Button>
              </div>
            )}

            <p className="text-4xl font-bold text-foreground mb-2">
              {currentPrice === 0 ? (
                "Free"
              ) : currentPrice !== null ? (
                <>
                  ${currentPrice.toLocaleString()}
                  {selectedInterval === "year" && (
                    <span className="text-lg text-muted-foreground font-normal">
                      {" "}
                      /year
                    </span>
                  )}
                  {selectedInterval !== "year" && (
                    <span className="text-lg text-muted-foreground font-normal">
                      {" "}
                      /month
                    </span>
                  )}
                </>
              ) : (
                "Custom"
              )}
            </p>

            {freeCap !== null && usageRate !== null && (
              <p className="text-sm text-muted-foreground mb-6">
                {freeCap} free applications/month, then ${usageRate}/application
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
        ) : isFree ? (
          <Button asChild variant="outline" className="w-full">
            <Link href="/sign-up?plan=free">Get Started</Link>
          </Button>
        ) : currentPriceId ? (
          <Button asChild className="w-full">
            <Link
              href={`/sign-up?plan=${
                selectedInterval === "year" ? "pro-annual" : "pro-monthly"
              }`}
            >
              Get Started
            </Link>
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
