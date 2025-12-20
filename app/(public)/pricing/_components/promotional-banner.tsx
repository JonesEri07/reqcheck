"use client";

import { Badge } from "@/components/ui/badge";
import { Sparkles } from "lucide-react";

interface PromotionalBannerProps {
  remaining: number;
}

export function PromotionalBanner({ remaining }: PromotionalBannerProps) {
  return (
    <div className="mb-6 rounded-lg border border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 px-4 py-3">
      <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">Limited Time:</span>
        </div>
        <span className="text-muted-foreground">
          Get <strong className="text-foreground">1 month of Pro free</strong>{" "}
          when you sign up
        </span>
        {remaining > 0 && (
          <Badge
            variant="secondary"
            className="bg-primary/10 text-primary hover:bg-primary/20"
          >
            {remaining} {remaining === 1 ? "spot" : "spots"} left
          </Badge>
        )}
      </div>
    </div>
  );
}
