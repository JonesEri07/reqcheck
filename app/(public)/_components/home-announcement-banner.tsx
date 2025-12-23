"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, X } from "lucide-react";

export function AnnouncementBanner() {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was previously dismissed
    const isDismissed = localStorage.getItem(
      "hosted-quiz-announcement-dismissed"
    );
    if (isDismissed === "true") {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem("hosted-quiz-announcement-dismissed", "true");
  };

  if (dismissed) {
    return null;
  }

  return (
    <div className="border-b border-primary/20 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <Badge
              variant="secondary"
              className="bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border-yellow-500/30"
            >
              New Feature!
            </Badge>
            <span className="font-semibold text-foreground">
              Hosted Quiz Page
            </span>
          </div>
          <span className="text-muted-foreground">
            Perfect for job boards with limited control
          </span>
          <Button asChild variant="outline" size="sm" className="h-7">
            <Link href="/docs/widget-integration#hosted-quiz-page">
              Learn More
            </Link>
          </Button>
          <button
            onClick={handleDismiss}
            className="ml-auto text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Dismiss announcement"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
