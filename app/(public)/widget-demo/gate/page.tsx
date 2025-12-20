"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import useSWR from "swr";
import { TestConfig } from "../_components/test-config";
import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GateModeDemoPage() {
  const { data: teamData } = useSWR<{ id?: number }>("/api/team", fetcher);
  const companyId = teamData?.id?.toString() || "";
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const widgetInitialized = useRef(false);

  // Re-initialize widget when jobId changes
  useEffect(() => {
    if (selectedJobId && widgetInitialized.current) {
      // Widget is already loaded, manually re-initialize gate elements
      if (typeof window !== "undefined" && (window as any).ReqCheck) {
        const gateElements = document.querySelectorAll<HTMLElement>(
          "[data-reqcheck-mode='gate']"
        );
        gateElements.forEach((element) => {
          (window as any).ReqCheck.initElement(element, selectedJobId);
        });
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
          widgetInitialized.current = true;
          // If jobId is already selected, initialize gate elements
          if (selectedJobId) {
            setTimeout(() => {
              if (typeof window !== "undefined" && (window as any).ReqCheck) {
                const gateElements = document.querySelectorAll<HTMLElement>(
                  "[data-reqcheck-mode='gate']"
                );
                gateElements.forEach((element) => {
                  (window as any).ReqCheck.initElement(element, selectedJobId);
                });
              }
            }, 100);
          }
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

        {/* Main content - realistic job posting page */}
        <main className="container mx-auto px-4 py-12 max-w-3xl">
          <div className="space-y-8">
            {/* Job posting header */}
            <div className="space-y-4">
              <h1 className="text-3xl font-bold">Senior Software Engineer</h1>
              <div className="flex flex-wrap gap-4 text-muted-foreground">
                <span>San Francisco, CA</span>
                <span>•</span>
                <span>Full-time</span>
                <span>•</span>
                <span>Remote</span>
              </div>
            </div>

            {/* Job description */}
            <div className="prose prose-sm max-w-none">
              <h2 className="text-xl font-semibold mb-3">About the Role</h2>
              <p className="text-muted-foreground mb-4">
                We're looking for an experienced software engineer to join our
                team. You'll work on building scalable systems, collaborating
                with cross-functional teams, and contributing to our product
                roadmap.
              </p>

              <h2 className="text-xl font-semibold mb-3">Requirements</h2>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">
                <li>5+ years of software engineering experience</li>
                <li>Strong proficiency in TypeScript and React</li>
                <li>Experience with distributed systems</li>
                <li>Excellent communication skills</li>
              </ul>
            </div>

            {/* Application CTAs - exactly as client would implement */}
            <div className="border-t pt-8 space-y-4">
              <h2 className="text-xl font-semibold mb-4">Apply Now</h2>

              {/* Link example */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Apply via Greenhouse
                </p>
                <a
                  href="https://jobs.example.com/apply/123"
                  data-reqcheck-mode="gate"
                  data-reqcheck-job={selectedJobId}
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  Continue to Application
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>

              <div className="h-px bg-border" />

              {/* Button example */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Apply via LinkedIn
                </p>
                <button
                  data-reqcheck-mode="gate"
                  data-reqcheck-job={selectedJobId}
                  data-reqcheck-redirect="https://linkedin.com/jobs/apply/456"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Apply on LinkedIn
                </button>
              </div>

              <div className="h-px bg-border" />

              {/* Another link example */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">
                  Apply via Company Portal
                </p>
                <a
                  href="https://company.com/careers/apply"
                  data-reqcheck-mode="gate"
                  data-reqcheck-job={selectedJobId}
                  className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
                >
                  Go to Application Portal
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>

            {/* Info note */}
            <div className="text-xs text-muted-foreground text-center pt-4">
              Clicking any application link will require reqCHECK verification
              before redirecting.
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
