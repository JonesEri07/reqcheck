"use client";

import { useState, useEffect, useRef } from "react";
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
  const inlineElementRef = useRef<HTMLDivElement>(null);
  const widgetInitialized = useRef(false);

  // Re-initialize inline elements when jobId changes
  useEffect(() => {
    if (selectedJobId && widgetInitialized.current) {
      setTimeout(() => {
        if (typeof window !== "undefined" && (window as any).ReqCheck) {
          const inlineElements = document.querySelectorAll<HTMLElement>(
            "[data-reqcheck-mode='inline']"
          );
          inlineElements.forEach((element) => {
            (window as any).ReqCheck.initElement(element, selectedJobId);
          });
        }
      }, 100);
    }
  }, [selectedJobId]);

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
        data-reqcheck-test-mode="true"
        strategy="afterInteractive"
        onLoad={() => {
          widgetInitialized.current = true;
          if (selectedJobId) {
            setTimeout(() => {
              if (typeof window !== "undefined" && (window as any).ReqCheck) {
                const inlineElements = document.querySelectorAll<HTMLElement>(
                  "[data-reqcheck-mode='inline']"
                );
                inlineElements.forEach((element) => {
                  (window as any).ReqCheck.initElement(element, selectedJobId);
                });
              }
            }, 100);
          }
        }}
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

              {/* Inline widget */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">
                  Complete Verification
                </h3>
                <div
                  ref={inlineElementRef}
                  data-reqcheck-mode="inline"
                  data-reqcheck-job={selectedJobId}
                  className="min-h-[200px]"
                >
                  {/* Widget will render here */}
                </div>
              </div>

              {/* Submit button - note: inline mode doesn't block, it's "on your honor" */}
              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Submit Application
              </button>
            </form>

            {/* Info note */}
            <div className="text-xs text-muted-foreground text-center">
              Complete the inline verification quiz above. This is an "on your
              honor" approach - the form is not blocked.
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
