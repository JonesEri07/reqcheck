"use client";

import { CheckCircle2, Smartphone } from "lucide-react";

// Mobile Mockup Component
function MobileMockup() {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="rounded-lg border-4 border-foreground/20 bg-foreground/5 p-2 shadow-2xl">
        {/* Browser frame */}
        <div className="mb-2 flex items-center gap-2 rounded-t-lg bg-foreground/10 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive"></div>
            <div className="h-3 w-3 rounded-full bg-accent"></div>
            <div className="h-3 w-3 rounded-full bg-primary"></div>
          </div>
          <div className="flex-1 rounded bg-foreground/10 px-3 py-1 text-xs text-muted-foreground">
            reqcheck.io/widget
          </div>
        </div>
        {/* Question card mockup */}
        <div className="rounded-lg bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-muted"></div>
            <div className="h-4 w-16 rounded bg-muted"></div>
          </div>
          <div className="mb-4 space-y-2">
            <div className="h-3 w-full rounded bg-muted"></div>
            <div className="h-3 w-3/4 rounded bg-muted"></div>
          </div>
          <div className="mb-4 rounded bg-muted p-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-primary">function</div>
              <div className="text-accent-foreground">calculateSum</div>
              <div className="text-muted-foreground">{"{"}</div>
              <div className="ml-4 text-muted-foreground">...</div>
              <div className="text-muted-foreground">{"}"}</div>
            </div>
          </div>
          <div className="mb-4 space-y-2">
            <div className="h-10 rounded border-2 border-border bg-background"></div>
            <div className="h-10 rounded border-2 border-border bg-background"></div>
            <div className="h-10 rounded border-2 border-border bg-background"></div>
          </div>
          <div className="h-10 rounded bg-primary"></div>
          <div className="mt-4 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className={`h-2 w-2 rounded-full ${
                  dot === 1 ? "bg-primary" : "bg-muted"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function MobileSection() {
  return (
    <section
      id="mobile"
      className="py-16 bg-background relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 blur-3xl"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Smartphone className="h-8 w-8 text-primary" />
              <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                Built for mobile
              </h2>
            </div>
            <p className="text-lg text-muted-foreground mb-6">
              Most candidates apply from their phone. reqCHECK's widget is fully
              responsive and optimized for mobile devices. Candidates can verify
              their skills on any device, anywhere.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  Touch-optimized interface
                </span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground">
                  Fast loading on slow connections
                </span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <MobileMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
