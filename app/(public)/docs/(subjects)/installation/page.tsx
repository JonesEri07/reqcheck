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

export default function InstallationPage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="installation"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          Installation
        </h1>
        <p className="text-muted-foreground text-lg">
          Quick start guide to get reqCHECK installed and working in minutes.
          For detailed configuration options, see the{" "}
          <Link
            href="/docs/widget-integration"
            className="text-primary hover:underline"
          >
            Widget Integration
          </Link>{" "}
          guide.
        </p>
      </div>

      <div className="space-y-8">
        <Card id="prerequisites">
          <CardHeader>
            <CardTitle>Prerequisites</CardTitle>
            <CardDescription>
              What you need before getting started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>A reqCHECK account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>
                  Access to your job application pages (HTML/JavaScript)
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary">✓</span>
                <span>Your Company ID from the dashboard settings</span>
              </li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              Note: API keys are only needed for backend verification lookup,
              not for the widget integration. The widget uses your Company ID.
            </p>
          </CardContent>
        </Card>

        <Card id="step-1-get-company-id">
          <CardHeader>
            <CardTitle>Step 1: Get Your Company ID</CardTitle>
            <CardDescription>
              Find your company ID in the dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ol className="space-y-4 list-decimal list-inside">
              <li>
                <p className="inline">Log in to your reqCHECK dashboard</p>
              </li>
              <li>
                <p className="inline">Navigate to Settings → Company</p>
              </li>
              <li>
                <p className="inline">Copy your Company ID</p>
              </li>
            </ol>
            <p className="text-sm text-muted-foreground">
              You'll need this Company ID for the widget script. API keys are
              only used for backend verification lookup, not in the widget.
            </p>
          </CardContent>
        </Card>

        <Card id="step-2-load-widget-script">
          <CardHeader>
            <CardTitle>Step 2: Load Widget Script</CardTitle>
            <CardDescription>
              Add the widget script to your site
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Add the widget script to your{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">
                &lt;head&gt;
              </code>{" "}
              section. The script loads once and works across all pages.
            </p>
            <div className="rounded-lg border bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                {`<!DOCTYPE html>
<html>
<head>
  <title>Job Application</title>
  <script src="https://cdn.reqcheck.io/widget.js" 
          data-reqcheck-company="your-company-id"></script>
</head>
<body>
  <!-- Your page content -->
</body>
</html>`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              The widget automatically scans for elements with{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                data-reqcheck-mode
              </code>{" "}
              and initializes them.
            </p>
          </CardContent>
        </Card>

        <Card id="step-3-configure-widget-modes">
          <CardHeader>
            <CardTitle>Step 3: Configure Widget Modes</CardTitle>
            <CardDescription>
              Add mode attributes to your elements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Add{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">
                data-reqcheck-mode
              </code>{" "}
              and{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">
                data-reqcheck-job
              </code>{" "}
              to your elements. Three modes available:
            </p>
            <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
              <li>
                <strong className="text-foreground">protect</strong> - Form
                overlay mode (traditional application forms)
              </li>
              <li>
                <strong className="text-foreground">gate</strong> - Redirect
                protection mode (external ATS links, buttons)
              </li>
              <li>
                <strong className="text-foreground">inline</strong> - Custom
                placement mode (widget renders in specific location)
              </li>
            </ul>
            <div className="rounded-lg border bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                {`<!-- Example: protect mode for forms -->
<form data-reqcheck-mode="protect" data-reqcheck-job="job_123">
  <input type="email" name="email" required />
  <button type="submit">Submit</button>
</form>

<!-- Example: gate mode for external links -->
<a href="https://jobs.greenhouse.io/apply/123" 
   data-reqcheck-mode="gate" 
   data-reqcheck-job="job_456">
  Apply Now
</a>`}
              </pre>
            </div>
            <p className="text-sm text-muted-foreground">
              <strong>Need more details?</strong> See the{" "}
              <Link
                href="/docs/widget-integration#widget-modes"
                className="text-primary hover:underline"
              >
                Widget Integration guide
              </Link>{" "}
              for detailed mode explanations, initialization options, and
              advanced configuration.
            </p>
          </CardContent>
        </Card>

        <Card id="step-4-verify-backend">
          <CardHeader>
            <CardTitle>Step 4: Verify in Your Backend</CardTitle>
            <CardDescription>
              Check verification status when processing applications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              When a candidate passes verification, reqCHECK stores the result
              server-side with a 1-hour expiry. In your backend, call the
              Verification API to check if they passed before accepting the
              application.
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
              API keys are generated from Settings → API & Webhooks in your
              dashboard and should only be used in your backend, never exposed
              in frontend code. Returns 404 if no valid verification found
              (within 1 hour).
            </p>
            <p className="text-sm text-muted-foreground">
              <strong>Full API documentation:</strong> See the{" "}
              <Link
                href="/docs/api#-verify-endpoint"
                className="text-primary hover:underline"
              >
                API Reference
              </Link>{" "}
              for complete endpoint documentation, response formats, and error
              handling.
            </p>
          </CardContent>
        </Card>

        <Card id="content-security-policy">
          <CardHeader>
            <CardTitle>Content Security Policy (CSP)</CardTitle>
            <CardDescription>
              Required CSP directives for reqCHECK widget
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If your site uses Content Security Policy headers, you'll need to
              allow reqCHECK domains. The required directives include:
            </p>
            <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
              <li>
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  script-src
                </code>{" "}
                - Allow widget JavaScript
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  connect-src
                </code>{" "}
                - Allow API calls
              </li>
              <li>
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  style-src
                </code>{" "}
                - Allow widget styling
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              <strong>Need platform-specific examples?</strong> See the{" "}
              <Link
                href="/docs/widget-integration#content-security-policy"
                className="text-primary hover:underline"
              >
                Widget Integration guide
              </Link>{" "}
              for complete CSP examples in Nginx, Apache, Next.js, and meta
              tags.
            </p>
          </CardContent>
        </Card>

        <Card id="browser-support">
          <CardHeader>
            <CardTitle>Browser Support</CardTitle>
            <CardDescription>
              Supported browsers and feature detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Supported Browsers</h4>
              <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                <li>Chrome/Edge: Last 2 major versions</li>
                <li>Firefox: Last 2 major versions</li>
                <li>Safari: Last 2 major versions</li>
                <li>Mobile: iOS Safari 14+, Chrome Android 90+</li>
              </ul>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Not Supported</h4>
              <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                <li>Internet Explorer (any version)</li>
                <li>Opera Mini</li>
              </ul>
            </div>
            <p className="text-sm text-muted-foreground">
              The widget uses modern JavaScript (ES6+, Fetch API, Promises) and
              falls back gracefully in unsupported browsers with a message:
              "Please upgrade your browser to apply."
            </p>
            <p className="text-sm text-muted-foreground">
              To manually test support:{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                ReqCheck.isSupported()
              </code>
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg border p-6">
          <div>
            <h3 className="mb-2 font-semibold">Ready to integrate?</h3>
            <p className="text-muted-foreground text-sm">
              Continue to the widget integration guide for detailed
              configuration options.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs/widget-integration">Widget Integration</Link>
          </Button>
        </div>

        <DocBuffer />
      </div>
    </DocsPageWrapper>
  );
}
