import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocsPageWrapper } from "@/app/(public)/docs/_components/docs-page-wrapper";
import { DocBuffer } from "@/app/(public)/docs/_components/doc-buffer";

const codeSnippet = `<!-- In <head> - set once -->
<script src="https://cdn.reqcheck.io/widget.js" 
        data-reqcheck-company="your-company-id"></script>

<!-- On any page, any element -->
<form data-reqcheck-mode="protect" data-reqcheck-job="job_123">
  <!-- your existing application fields -->
</form>

<!-- Or for external links -->
<a href="https://jobs.greenhouse.io/apply/123" 
   data-reqcheck-mode="gate" 
   data-reqcheck-job="job_456">
  Apply Now
</a>`;

const manualInitSnippet = `<!-- Optional: disable auto-init -->
<script src="https://cdn.reqcheck.io/widget.js" 
        data-reqcheck-company="your-company-id"
        data-reqcheck-auto-init="false"></script>

<script>
  // Manual control
  ReqCheck.init({
    companyId: "your-company-id",
    mode: "gate",
    jobId: "job_123",
    selector: "#custom-apply-btn"
  });
</script>`;

export default function GettingStartedPage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="getting-started"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          Getting Started
        </h1>
        <p className="text-muted-foreground text-lg">
          Welcome to reqCHECK! This guide will help you get up and running in
          minutes.
        </p>
      </div>

      <div className="space-y-8">
        <Card id="what-is-reqcheck">
          <CardHeader>
            <CardTitle>What is reqCHECK?</CardTitle>
            <CardDescription>Understanding the core concept</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              reqCHECK is a gate-first skill verification platform that overlays
              your existing job application forms. Instead of allowing anyone to
              submit an application, candidates must first pass a short skill
              verification challenge.
            </p>
            <p>
              Think of it like reCAPTCHA for job applications—but instead of
              proving you&apos;re human, candidates prove they understand the
              job&apos;s core skills.
            </p>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Key Benefits:</p>
              <ul className="text-muted-foreground space-y-1 text-sm list-disc list-inside">
                <li>Reduce unqualified applicants</li>
                <li>Save 5-10 hours per role on manual screening</li>
                <li>Improve candidate experience with instant feedback</li>
                <li>Keep your ATS clean and spam-free</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card id="quick-start">
          <CardHeader>
            <CardTitle>Quick Start</CardTitle>
            <CardDescription>
              Connect reqCHECK to your existing application form in three simple
              steps
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-6 text-muted-foreground text-base leading-relaxed">
              <div id="-load-widget-script">
                <h3 className="mb-2 font-semibold text-foreground">
                  1. Load the widget script
                </h3>
                <p>
                  Add the widget script to your{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    &lt;head&gt;
                  </code>{" "}
                  section with your company ID. The script loads once and works
                  across all pages.
                </p>
              </div>
              <div id="-choose-widget-mode">
                <h3 className="mb-2 font-semibold text-foreground">
                  2. Choose a widget mode
                </h3>
                <p>
                  Add{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    data-reqcheck-mode
                  </code>{" "}
                  and{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    data-reqcheck-job
                  </code>{" "}
                  to your elements. Three modes available:
                </p>
                <ul className="mt-2 space-y-1 list-disc list-inside text-sm">
                  <li>
                    <strong>protect</strong> - Form overlay mode (traditional
                    application forms)
                  </li>
                  <li>
                    <strong>gate</strong> - Redirect protection mode (external
                    ATS links, buttons)
                  </li>
                  <li>
                    <strong>inline</strong> - Custom placement mode (widget
                    renders in specific location)
                  </li>
                </ul>
              </div>
              <div id="-auto-initialization">
                <h3 className="mb-2 font-semibold text-foreground">
                  3. Auto-initialization
                </h3>
                <p>
                  The widget automatically scans for elements with{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    data-reqcheck-mode
                  </code>{" "}
                  and initializes them. No additional code needed! You can
                  disable auto-init and control timing manually if needed{" "}
                  <Button variant="link">
                    <Link href="#manual-initialization">see below</Link>.
                  </Button>
                </p>
              </div>
            </div>

            <div className="bg-muted rounded-xl p-5 text-sm overflow-x-auto">
              <pre className="text-xs leading-relaxed">{codeSnippet}</pre>
            </div>

            <div
              id="-Manual-Initialization"
              className="space-y-2 text-sm text-muted-foreground"
            >
              <p className="font-medium text-foreground">
                Optional: manual initialization
              </p>
              <p>
                If you need to wait for consent banners, dynamic routing, or
                other app state, leave off{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  data-reqcheck-company
                </code>{" "}
                and call{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  ReqCheck.init
                </code>{" "}
                yourself once you&apos;re ready:
              </p>
              <div className="bg-muted rounded-xl p-5 text-sm overflow-x-auto">
                <pre className="text-xs leading-relaxed">
                  {manualInitSnippet}
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="backend-verification">
          <CardHeader>
            <CardTitle>Backend Verification</CardTitle>
            <CardDescription>
              Checking verification status in your backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              When a candidate passes verification, reqCHECK stores the result
              server-side with a 1-hour expiry. When the candidate submits their
              application form, your backend should call the Verification API to
              check if they passed before accepting the application. Remember to
              include the{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                x-api-key
              </code>{" "}
              header with an API key generated from the dashboard.
            </p>
            <div className="rounded-lg border bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                {`POST /api/v1/verify
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "externalJobId": "job_123",
  "email": "candidate@example.com"
}`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              The API returns verification status including whether they passed,
              their score, and when they completed the quiz. Returns 404 if no
              valid verification found (within 1 hour).
            </p>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Security: API keys are only used in your backend for
                verification lookup. Never expose them in frontend code or
                include them in the widget script. Verifications are stored
                server-side - no tokens are injected into forms.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="how-it-works">
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>The verification flow</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div id="-candidate-clicks-apply" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                1
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Candidate Clicks Apply</h3>
                <p className="text-muted-foreground text-sm">
                  A candidate visits your job application page and clicks the
                  &quot;Apply&quot; button.
                </p>
              </div>
            </div>
            <div id="-widget-overlay-appears" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                2
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Widget Overlay Appears</h3>
                <p className="text-muted-foreground text-sm">
                  The reqCHECK widget overlays the form, asking the candidate to
                  verify their skills before proceeding.
                </p>
              </div>
            </div>
            <div id="-email-capture" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                3
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Email Capture</h3>
                <p className="text-muted-foreground text-sm">
                  The candidate enters their email address. This enables rate
                  limiting and prevents spam.
                </p>
              </div>
            </div>
            <div id="-skill-challenge" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                4
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Skill Challenge</h3>
                <p className="text-muted-foreground text-sm">
                  The candidate answers up to 5 questions tailored to the
                  job&apos;s detected skills. Questions are automatically
                  generated based on the job description.
                </p>
              </div>
            </div>
            <div id="-pass-or-fail" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                5
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Pass or Fail</h3>
                <p className="text-muted-foreground text-sm">
                  If they pass (≥60% by default, configured in dashboard), the
                  verification is stored server-side with a 1-hour expiry. The
                  widget performs mode-specific action (unlock form, redirect,
                  or enable elements). If they fail, they see a message with
                  retry information.
                </p>
              </div>
            </div>
            <div id="-backend-verification-step" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                6
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Backend Verification</h3>
                <p className="text-muted-foreground text-sm">
                  When the candidate submits their application, your backend
                  calls the Verification API with their email and job ID to
                  check if they passed before accepting the application.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="next-steps">
          <CardHeader>
            <CardTitle>Next Steps</CardTitle>
            <CardDescription>Continue your journey</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h3 className="font-semibold">Installation Guide</h3>
                <p className="text-muted-foreground text-sm">
                  Learn how to install and configure reqCHECK
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/docs/installation">Read Guide</Link>
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div>
                <h3 className="font-semibold">Widget Integration</h3>
                <p className="text-muted-foreground text-sm">
                  Step-by-step widget integration instructions
                </p>
              </div>
              <Button variant="outline" asChild>
                <Link href="/docs/widget-integration">Read Guide</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        <DocBuffer />
      </div>
    </DocsPageWrapper>
  );
}
