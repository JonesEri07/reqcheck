"use client";

import { Card } from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export function PromotionalBanner() {
  return (
    <Card className="mb-8 border-primary/50 bg-primary/5">
      <div className="px-6 py-4 flex items-center gap-3">
        <div className="flex-shrink-0">
          <Sparkles className="h-5 w-5 text-primary" />
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-foreground mb-1">
            Limited Time Offer
          </h3>
          <p className="text-sm text-muted-foreground">
            Get <strong className="text-foreground">1 month of Pro free</strong>{" "}
            when you sign up for Pro Monthly or Pro Yearly. Applied
            automatically at checkout.
          </p>
        </div>
      </div>
    </Card>
  );
}
