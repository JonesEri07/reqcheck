"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-b from-background via-accent/10 to-background">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
          <span className="block">
            Stop the <span className="text-destructive">Spam.</span>
          </span>
          <span className="block">
            Start Hiring <span className="text-primary">Real Candidates.</span>
          </span>
        </h2>
        <p className="text-xl text-muted-foreground mb-8">
          Get started with 50 applications per month.
        </p>
        <Button asChild size="lg" className="rounded-full px-12 py-6 text-lg">
          <Link href="/pricing">Get Started</Link>
        </Button>
      </div>
    </section>
  );
}
