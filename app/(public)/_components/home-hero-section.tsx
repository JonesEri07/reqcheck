"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-background via-accent/10 to-background py-20 lg:py-32">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Stop AI Resume Spam.
            <span className="block text-primary">
              Start Hiring Real Candidates.
            </span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
            AI bots are flooding your inbox with spam applications. reqCHECK
            filters out unqualified candidates before they apply, so you only
            review real candidates with verified skills.
          </p>
          <div className="flex-col space-y-2">
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-lg"
              >
                <Link href="/pricing">Get Started</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg"
              >
                <Link href="/docs">View Docs</Link>
              </Button>
            </div>
            <div>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg"
              >
                <Link href="/widget-demo">Try Interactive Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
