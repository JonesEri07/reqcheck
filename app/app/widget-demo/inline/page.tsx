"use client";

import { useState } from "react";
import Script from "next/script";
import useSWR from "swr";
import { TestConfig } from "../_components/test-config";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function InlineModeDemoPage() {
  const { data: teamData } = useSWR<{ id?: number }>("/api/team", fetcher);
  const companyId = teamData?.id?.toString() || "";
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  if (!companyId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">
          Please log in to access the widget demo.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Load widget script - exactly as client would */}
      <Script
        src="/widget.js"
        data-reqcheck-company={companyId}
        strategy="afterInteractive"
      />

      <div className="min-h-screen bg-background">
        {/* Minimal header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/app/widget-demo">
                  <Button variant="ghost" size="sm">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Demos
                  </Button>
                </Link>
                <h1 className="text-lg font-semibold">Job Application</h1>
              </div>
            </div>
          </div>
        </header>

        {/* Test config - only visible in demo */}
        <div className="container mx-auto px-4 py-4">
          <TestConfig
            companyId={companyId}
            selectedJobId={selectedJobId}
            onJobChange={setSelectedJobId}
          />
        </div>

        {/* Main content - realistic job application page with inline widget */}
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            {/* Job posting header */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Senior Software Engineer</h2>
              <p className="text-muted-foreground">
                San Francisco, CA • Full-time • Remote
              </p>
            </div>

            {/* Application form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert("Form submitted! (This is a demo)");
              }}
              className="space-y-6 bg-card border rounded-lg p-6"
            >
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium mb-1.5"
                >
                  Email Address <span className="text-destructive">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium mb-1.5"
                >
                  Full Name <span className="text-destructive">*</span>
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* Inline widget placeholder */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Complete Verification
                </h3>
                <div
                  data-reqcheck-mode="inline"
                  data-reqcheck-job={selectedJobId}
                  className="min-h-[200px] border-2 border-dashed rounded-lg p-6 flex items-center justify-center text-muted-foreground"
                >
                  <div className="text-center">
                    <p className="font-medium mb-2">Inline Mode</p>
                    <p className="text-sm">
                      Inline mode is not yet implemented. This is where the quiz
                      would render inline.
                    </p>
                  </div>
                </div>
              </div>

              {/* Submit button - blocked until verification passes */}
              <button
                type="submit"
                data-reqcheck-blocked-by="inline"
                className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled
              >
                Submit Application
              </button>
            </form>

            {/* Info note */}
            <div className="text-xs text-muted-foreground text-center">
              Complete the inline verification quiz above to enable form
              submission.
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
