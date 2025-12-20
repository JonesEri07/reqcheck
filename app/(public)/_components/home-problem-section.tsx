"use client";

import { Bot } from "lucide-react";

export function ProblemSection() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
            <Bot className="h-8 w-8 text-destructive animate-pulse" />
          </div>
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            AI Bots Are Flooding Your Inbox
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Every job posting attracts hundreds of AI-generated resumes. You
            spend hours sifting through spam, fake credentials, and unqualified
            candidates. The signal-to-noise ratio is broken.
          </p>
        </div>
      </div>
    </section>
  );
}
