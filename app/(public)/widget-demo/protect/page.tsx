"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import useSWR from "swr";
import { TestConfig } from "../_components/test-config";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function ProtectModeDemoPage() {
  const { data: teamData } = useSWR<{ id?: number }>("/api/team", fetcher);
  const companyId = teamData?.id?.toString() || "";
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const formRef = useRef<HTMLFormElement>(null);
  const widgetInitialized = useRef(false);

  // Re-initialize widget when jobId changes
  useEffect(() => {
    if (selectedJobId && widgetInitialized.current && formRef.current) {
      // Widget is already loaded, manually initialize this form
      if (typeof window !== "undefined" && (window as any).ReqCheck) {
        const ReqCheck = (window as any).ReqCheck;
        // Check if initElement exists and is a function
        if (ReqCheck.initElement && typeof ReqCheck.initElement === "function") {
          try {
            ReqCheck.initElement(formRef.current, selectedJobId);
          } catch (error) {
            console.error("Error initializing widget:", error);
            // Retry after a short delay
            setTimeout(() => {
              if (ReqCheck.initElement && formRef.current) {
                try {
                  ReqCheck.initElement(formRef.current, selectedJobId);
                } catch (retryError) {
                  console.error("Error retrying widget initialization:", retryError);
                }
              }
            }, 500);
          }
        }
      }
    }
  }, [selectedJobId]);

  // Note: companyId will be available even when not logged in (uses demo team)

  return (
    <>
      {/* Load widget script - exactly as client would */}
      {companyId && (
      <Script
          key={companyId} // Force re-render when companyId changes
        src="/widget.js"
        data-reqcheck-company={companyId}
        data-reqcheck-test-mode="true"
        strategy="afterInteractive"
        onLoad={() => {
          // Wait a bit for widget to fully initialize
          setTimeout(() => {
          widgetInitialized.current = true;
          // If jobId is already selected, initialize the form
          if (selectedJobId && formRef.current) {
              const tryInit = () => {
              if (typeof window !== "undefined" && (window as any).ReqCheck) {
                  const ReqCheck = (window as any).ReqCheck;
                  // Check if initElement exists and is a function
                  if (ReqCheck.initElement && typeof ReqCheck.initElement === "function") {
                    try {
                      ReqCheck.initElement(formRef.current!, selectedJobId);
                    } catch (error) {
                      console.error("Error initializing widget on load:", error);
                      // Retry after delay
                      setTimeout(tryInit, 300);
              }
                  } else {
                    // Widget not ready yet, retry
                    setTimeout(tryInit, 300);
          }
                } else {
                  // Widget not loaded yet, retry
                  setTimeout(tryInit, 300);
                }
              };
              tryInit();
            }
          }, 300);
        }}
      />
      )}

      <div className="min-h-screen bg-background">
        {/* Minimal header */}
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Link href="/widget-demo">
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

        {/* Main content - realistic job application form */}
        <main className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="space-y-6">
            {/* Job posting header */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Senior Software Engineer</h2>
              <p className="text-muted-foreground">
                San Francisco, CA • Full-time • Remote
              </p>
            </div>

            {/* Application form - exactly as client would implement */}
            <form
              ref={formRef}
              data-reqcheck-mode="protect"
              data-reqcheck-job={selectedJobId}
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
                  data-reqcheck-email-field="true"
                  required
                  placeholder="you@example.com"
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  We'll use this to verify your application
                </p>
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

              <div>
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium mb-1.5"
                >
                  Resume <span className="text-destructive">*</span>
                </label>
                <input
                  id="resume"
                  name="resume"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  required
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div>
                <label
                  htmlFor="cover-letter"
                  className="block text-sm font-medium mb-1.5"
                >
                  Cover Letter
                </label>
                <textarea
                  id="cover-letter"
                  name="cover-letter"
                  rows={4}
                  placeholder="Tell us why you're interested in this position..."
                  className="w-full px-3 py-2 border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
              >
                Submit Application
              </button>
            </form>

            {/* Info note */}
            <div className="text-xs text-muted-foreground text-center">
              This form is protected by reqCHECK verification. Complete the quiz
              to submit your application.
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
