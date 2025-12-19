"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, Copy, CheckCircle2, Play } from "lucide-react";
import { toast } from "sonner";
import useSWR from "swr";
import { IntegrationSummary } from "./_components/integration-summary";
import { VerificationFlow } from "./_components/verification-flow";
import { cn } from "@/lib/utils";
import { ContentHeader } from "@/components/content-header";
import { Page } from "@/components/page";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function CodeBlock({ code, label }: { code: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-2">
      {label && <p className="text-sm font-medium text-foreground">{label}</p>}
      <div className="relative rounded-lg border bg-muted p-4">
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 h-7 w-7"
          onClick={copyToClipboard}
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
        <pre className="text-sm overflow-x-auto pr-10">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

type IntegrationMode = "protect" | "gate" | "inline" | null;
type EmailField = "yes" | "no" | null;
type InitMethod = "auto" | "manual" | "programmatic" | null;
type TestMode = boolean;

export default function WidgetIntegrationPage() {
  const { data: teamData } = useSWR<{ id?: number }>("/api/team", fetcher);
  const companyId = teamData?.id?.toString() || "your-company-id";

  const [mode, setMode] = useState<IntegrationMode>(null);
  const [emailField, setEmailField] = useState<EmailField>(null);
  const [initMethod, setInitMethod] = useState<InitMethod>(null);
  const [testMode, setTestMode] = useState<TestMode>(false);
  const [selectedFramework, setSelectedFramework] = useState<string>("nodejs");
  const [activeTab, setActiveTab] = useState<string>("integration");

  const generateCodeBlocks = () => {
    if (!initMethod) return [];
    // Programmatic doesn't need mode, but other init methods do
    if (initMethod !== "programmatic" && !mode) return [];

    const blocks: Array<{ code: string; label: string }> = [];

    // Programmatic mode doesn't need mode-specific HTML
    if (initMethod === "programmatic") {
      // Script tag for programmatic (auto-init disabled)
      let scriptTag = `<script src="https://cdn.reqcheck.io/widget.js" 
  data-reqcheck-company="${companyId}"
  data-reqcheck-auto-init="false"`;

      if (testMode) {
        scriptTag += `\n  data-reqcheck-test-mode="true"`;
      }

      scriptTag += `>\n</script>`;

      blocks.push({
        code: scriptTag,
        label: "1. Add this to your <head> tag:",
      });

      // Programmatic initialization and verification code
      let programmaticCode = `<script>
  // Initialize widget once (call on page load)
  ReqCheck.init(
    {
      companyId: "${companyId}",
      jobId: "YOUR_EXTERNAL_JOB_ID", // External job ID (from your dashboard, NOT the database ID)
      autoInit: false, // Programmatic control
    },
    {
      onSuccess: (result) => {
        console.log("Verification passed!", result);
        // Handle success - redirect, enable form, etc.
        window.location.href = "https://example.com/apply";
      },
      onFailure: (result) => {
        console.log("Verification failed", result);
        // Handle failure - show message, etc.
        alert(\`Score too low: \${result.score}%\`);
      },
      onComplete: (result) => {
        console.log("Verification completed", result);
        // Always called after success or failure
      },
    }
  );

  // Trigger verification programmatically (call anytime)
  function handleApply() {
    ReqCheck.verify(
      "candidate@example.com", // Email
      "YOUR_EXTERNAL_JOB_ID",   // External job ID (must match the external job ID from your dashboard)
      "https://example.com/apply" // Optional redirect URL
    );
  }
</script>

<button onclick="handleApply()">Apply Now</button>`;

      blocks.push({
        code: programmaticCode,
        label: "2. Add this JavaScript and button to your page:",
      });
    } else {
      // Script tag for non-programmatic modes
      let scriptTag = `<script src="https://cdn.reqcheck.io/widget.js" 
  data-reqcheck-company="${companyId}"`;

      if (initMethod === "manual") {
        scriptTag += `\n  data-reqcheck-auto-init="false"`;
      }

      if (testMode) {
        scriptTag += `\n  data-reqcheck-test-mode="true"`;
      }

      scriptTag += `>\n</script>`;

      blocks.push({
        code: scriptTag,
        label: "1. Add this to your <head> tag:",
      });

      // Mode-specific code
      if (mode === "protect") {
        let formCode = `<!-- data-reqcheck-job uses your external job ID (from dashboard) -->\n<form data-reqcheck-mode="protect" data-reqcheck-job="YOUR_EXTERNAL_JOB_ID">\n`;
        // TODO: Email field step - Evaluate later
        // if (emailField === "yes") {
        //   formCode += `  <input type="email" name="email" data-reqcheck-email-field="true" required />\n`;
        // }
        formCode += `  <!-- Your other form fields -->\n`;
        formCode += `  <button type="submit">Submit Application</button>\n`;
        formCode += `</form>`;

        blocks.push({
          code: formCode,
          label: "2. Add this to your form element:",
        });
      } else if (mode === "gate") {
        let gateCode = `<!-- data-reqcheck-job uses your external job ID (from dashboard) -->\n<a href="https://jobs.greenhouse.io/apply/123" \n   data-reqcheck-mode="gate" \n   data-reqcheck-job="YOUR_EXTERNAL_JOB_ID">\n  Apply Now\n</a>`;

        // TODO: Email field step - Evaluate later
        // if (emailField === "yes") {
        //   gateCode += `\n\n<!-- If you have an email field, add this attribute: -->\n<input type="email" name="email" data-reqcheck-email-field="true" required />`;
        // }

        blocks.push({
          code: gateCode,
          label: "2. Add this to your CTA element (button or link):",
        });
      } else if (mode === "inline") {
        let inlineCode = `<div class="job-posting">\n  <h2>Senior Software Engineer</h2>\n  <p>Job description...</p>\n  \n  <!-- Widget renders here -->\n  <!-- data-reqcheck-job uses your external job ID (from dashboard) -->\n  <div data-reqcheck-mode="inline" data-reqcheck-job="YOUR_EXTERNAL_JOB_ID">\n  </div>\n  \n  <!-- This button is blocked until quiz passes -->\n  <a href="https://apply.workday.com/123" \n     data-reqcheck-blocked-by="inline">\n    Apply Now\n  </a>\n</div>`;

        blocks.push({
          code: inlineCode,
          label: "2. Add this to your page:",
        });
      }

      // Init method specific code (only for manual, not programmatic)
      if (initMethod === "manual") {
        let manualCode = `<script>\n  // Control when/how to init\n  ReqCheck.init({\n    companyId: "${companyId}",\n    jobId: "YOUR_EXTERNAL_JOB_ID", // Replace with your external job ID\n  });\n  \n  // Or init specific element\n  ReqCheck.initElement(document.querySelector('[data-reqcheck-mode]'));\n</script>`;

        blocks.push({
          code: manualCode,
          label: "3. Add this JavaScript to control initialization:",
        });
      }
    }

    return blocks;
  };

  const codeBlocks = generateCodeBlocks();
  const showCodeBlocks =
    (mode !== null && initMethod !== null) || initMethod === "programmatic";

  return (
    <Page className="p-0">
      <div className="flex w-full">
        {/* Main Content */}
        <div className="flex-1 min-w-0 p-4 lg:p-8">
          <div className="max-w-4xl">
            <ContentHeader
              title="Widget Integration"
              subtitle={`Follow the steps below to get your custom integration code. Your company ID (${companyId}) is pre-filled in all examples.`}
              actions={[
                {
                  label: "Test Widget Integration",
                  href: "/app/widget-demo",
                  variant: "outline",
                  icon: <Play className="h-4 w-4" />,
                  onClick: () => {
                    window.open("/app/widget-demo", "_blank");
                  },
                },
              ]}
            />

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 bg-background">
                <TabsTrigger value="integration">
                  Widget Integration
                </TabsTrigger>
                <TabsTrigger value="api">API</TabsTrigger>
              </TabsList>

              <TabsContent value="integration" className="space-y-6">
                <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30">
                  <CardContent className="pt-6">
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                          About Job IDs
                        </h3>
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          All references to{" "}
                          <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-xs font-mono">
                            YOUR_EXTERNAL_JOB_ID
                          </code>{" "}
                          in the generated code refer to the{" "}
                          <strong>external job ID</strong> you registered when
                          creating the job in your reqCHECK dashboard. This is
                          the identifier that links your external job posting
                          system with reqCHECK, and is <strong>not</strong> the
                          same as the internal database ID.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Step 1: Integration Mode (skip if programmatic) */}
                {initMethod !== "programmatic" && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        {mode ? (
                          <>
                            <CheckCircle2 className="h-5 w-5 text-primary" />
                            <span>Step 1: Integration Type</span>
                          </>
                        ) : (
                          <span>
                            Step 1: What type of integration do you need?
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-4 md:grid-cols-3">
                        <button
                          onClick={() => {
                            setMode("protect");
                            // Protect mode supports email field, so keep it if switching from gate
                            // If switching from inline, emailField is already null
                          }}
                          className={cn(
                            "text-left p-4 rounded-lg border transition-colors relative",
                            mode === "protect"
                              ? "border-primary bg-accent"
                              : "hover:border-primary hover:bg-accent"
                          )}
                        >
                          {mode === "protect" && (
                            <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                          )}
                          <h3 className="font-semibold mb-2">Protect Mode</h3>
                          <p className="text-sm text-muted-foreground">
                            Blocks form submission with a semi-transparent
                            overlay. Best for traditional application forms
                            where you want to prevent submission until
                            verification passes.
                          </p>
                        </button>
                        <button
                          onClick={() => {
                            setMode("gate");
                            // Gate mode supports email field, so keep it if switching from protect
                            // If switching from inline, emailField is already null
                          }}
                          className={cn(
                            "text-left p-4 rounded-lg border transition-colors relative",
                            mode === "gate"
                              ? "border-primary bg-accent"
                              : "hover:border-primary hover:bg-accent"
                          )}
                        >
                          {mode === "gate" && (
                            <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                          )}
                          <h3 className="font-semibold mb-2">Gate Mode</h3>
                          <p className="text-sm text-muted-foreground">
                            Intercepts clicks on CTAs (buttons, links) to
                            external ATS systems. Best for "Apply with
                            Greenhouse" buttons or redirect links.
                          </p>
                        </button>
                        <button
                          onClick={() => {
                            setMode("inline");
                            // Inline mode doesn't use email field, so clear it
                            setEmailField(null);
                          }}
                          className={cn(
                            "text-left p-4 rounded-lg border transition-colors relative",
                            mode === "inline"
                              ? "border-primary bg-accent"
                              : "hover:border-primary hover:bg-accent"
                          )}
                        >
                          {mode === "inline" && (
                            <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                          )}
                          <h3 className="font-semibold mb-2">Inline Mode</h3>
                          <p className="text-sm text-muted-foreground">
                            Renders the widget inline on your page without
                            blocking. Best for custom placements where you want
                            full control over layout.
                          </p>
                        </button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* TODO: Step 2: Email Field (conditional) - Evaluate later */}
                {/* {mode && mode !== "inline" && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {emailField ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>Step 2: Email Field</span>
                        </>
                      ) : (
                        <span>
                          Step 2: Enable email-based verification check?
                          (Optional)
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-2">
                      <button
                        onClick={() => setEmailField("yes")}
                        className={cn(
                          "text-left p-4 rounded-lg border transition-colors relative",
                          emailField === "yes"
                            ? "border-primary bg-accent"
                            : "hover:border-primary hover:bg-accent"
                        )}
                      >
                        {emailField === "yes" && (
                          <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                        )}
                        <h3 className="font-semibold mb-2">
                          Yes, enable check
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Widget checks if the email has already passed
                          verification when entered. If verified, allows
                          submission. If not, prompts to complete the quiz. Also
                          acts as a security check if someone bypasses the
                          widget.
                        </p>
                      </button>
                      <button
                        onClick={() => setEmailField("no")}
                        className={cn(
                          "text-left p-4 rounded-lg border transition-colors relative",
                          emailField === "no"
                            ? "border-primary bg-accent"
                            : "hover:border-primary hover:bg-accent"
                        )}
                      >
                        {emailField === "no" && (
                          <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                        )}
                        <h3 className="font-semibold mb-2">No, skip check</h3>
                        <p className="text-sm text-muted-foreground">
                          Widget will always show verification prompt regardless
                          of email. Use this if you don't have an email field or
                          want to require verification upfront.
                        </p>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              )} */}

                {/* Step 1 or 2: Initialization Method (Step 1 if programmatic, Step 2 otherwise) */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {initMethod ? (
                        <>
                          <CheckCircle2 className="h-5 w-5 text-primary" />
                          <span>
                            {initMethod === "programmatic"
                              ? "Step 1: Integration Method"
                              : "Step 2: Initialization Method"}
                          </span>
                        </>
                      ) : (
                        <span>
                          {mode
                            ? "Step 2: How do you want to initialize the widget?"
                            : "Step 1: How do you want to integrate the widget?"}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 md:grid-cols-3">
                      <button
                        onClick={() => {
                          setInitMethod("auto");
                          // Auto-init requires a mode
                          if (!mode) {
                            setMode("gate"); // Default to gate
                          }
                        }}
                        className={cn(
                          "text-left p-4 rounded-lg border transition-colors relative",
                          initMethod === "auto"
                            ? "border-primary bg-accent"
                            : "hover:border-primary hover:bg-accent"
                        )}
                      >
                        {initMethod === "auto" && (
                          <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                        )}
                        <h3 className="font-semibold mb-2">Auto-init</h3>
                        <p className="text-sm text-muted-foreground">
                          Widget automatically finds and initializes all
                          elements with data-reqcheck-mode attributes. No
                          additional JavaScript needed.
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setInitMethod("manual");
                          // Manual init requires a mode
                          if (!mode) {
                            setMode("gate"); // Default to gate
                          }
                        }}
                        className={cn(
                          "text-left p-4 rounded-lg border transition-colors relative",
                          initMethod === "manual"
                            ? "border-primary bg-accent"
                            : "hover:border-primary hover:bg-accent"
                        )}
                      >
                        {initMethod === "manual" && (
                          <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                        )}
                        <h3 className="font-semibold mb-2">Manual Init</h3>
                        <p className="text-sm text-muted-foreground">
                          You control when and how the widget initializes.
                          Useful for dynamic content or conditional rendering.
                        </p>
                      </button>
                      <button
                        onClick={() => {
                          setInitMethod("programmatic");
                          setMode(null); // Programmatic doesn't use modes
                        }}
                        className={cn(
                          "text-left p-4 rounded-lg border transition-colors relative",
                          initMethod === "programmatic"
                            ? "border-primary bg-accent"
                            : "hover:border-primary hover:bg-accent"
                        )}
                      >
                        {initMethod === "programmatic" && (
                          <CheckCircle2 className="absolute top-2 right-2 h-5 w-5 text-primary" />
                        )}
                        <h3 className="font-semibold mb-2">Programmatic API</h3>
                        <p className="text-sm text-muted-foreground">
                          Use JavaScript API to trigger verification
                          programmatically. Best for SPAs or custom application
                          flows. No HTML data attributes needed.
                        </p>
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* Step 3: Test Mode (optional) */}
                {showCodeBlocks && (
                  <Card>
                    <CardHeader>
                      <CardTitle>
                        Step 3: Additional Options (Optional)
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold mb-1">Test Mode</h3>
                          <p className="text-sm text-muted-foreground">
                            Enable test mode to render widget without backend
                            enforcement. Useful for staging environments.
                          </p>
                        </div>
                        <Button
                          variant={testMode ? "default" : "outline"}
                          onClick={() => setTestMode(!testMode)}
                        >
                          {testMode ? "Enabled" : "Enable"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Code Blocks */}
                {showCodeBlocks && (
                  <>
                    <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/30">
                      <CardHeader>
                        <CardTitle className="text-blue-900 dark:text-blue-100">
                          Replace Job ID Placeholder
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-blue-800 dark:text-blue-200 mb-3">
                          Replace{" "}
                          <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-xs font-mono">
                            YOUR_EXTERNAL_JOB_ID
                          </code>{" "}
                          in the code below with the external job ID you
                          registered when creating the job in your reqCHECK
                          dashboard. This must match exactly what you entered
                          when creating the job.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/app/jobs">
                            View Your Registered Jobs →
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader>
                        <CardTitle>Your Integration Code</CardTitle>
                        <CardDescription>
                          Copy and paste these code blocks into your
                          application. Remember to replace{" "}
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            YOUR_EXTERNAL_JOB_ID
                          </code>{" "}
                          with your actual external job ID.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        {codeBlocks.map((block, index) => (
                          <CodeBlock
                            key={index}
                            code={block.code}
                            label={block.label}
                          />
                        ))}
                      </CardContent>
                    </Card>
                  </>
                )}
              </TabsContent>

              <TabsContent value="api" className="space-y-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-bold mb-2">
                    Backend Verification API
                  </h2>
                  <p className="text-muted-foreground">
                    When a candidate passes verification, reqCHECK stores the
                    result server-side with a 1-hour expiry. Use these examples
                    to verify candidates in your backend before accepting
                    applications.
                  </p>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>API Endpoint</CardTitle>
                    <CardDescription>
                      POST /api/v1/verify - Check verification status
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Request Headers:
                      </p>
                      <CodeBlock
                        code={`x-api-key: YOUR_API_KEY
Content-Type: application/json`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">Request Body:</p>
                      <CodeBlock
                        code={`{
  "externalJobId": "YOUR_EXTERNAL_JOB_ID", // Must match the external job ID registered in your dashboard
  "email": "candidate@example.com"
}`}
                      />
                      <p className="text-sm text-muted-foreground mt-2">
                        <strong>Important:</strong> The{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          externalJobId
                        </code>{" "}
                        must match the external job ID you registered when
                        creating the job in your reqCHECK dashboard.{" "}
                        <Link
                          href="/app/jobs"
                          className="text-primary hover:underline"
                        >
                          View your registered jobs →
                        </Link>
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Success Response (200):
                      </p>
                      <CodeBlock
                        code={`{
  "verified": true,
  "passed": true,
  "score": 85,
  "completedAt": "2024-01-15T10:30:00Z"
}`}
                      />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-2">
                        Not Found Response (404):
                      </p>
                      <CodeBlock
                        code={`{
  "error": "No verification found",
  "message": "No valid verification found for this email and job ID"
}`}
                      />
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                        Important: API keys are only used in your backend for
                        verification lookup. Never expose them in frontend code.
                        Get your API key from{" "}
                        <Link
                          href="/app/settings/configuration"
                          className="underline hover:no-underline"
                        >
                          Settings → Configuration
                        </Link>
                        .
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle>Framework Examples</CardTitle>
                        <CardDescription>
                          Choose your backend framework to see a complete
                          example
                        </CardDescription>
                      </div>
                      <Select
                        value={selectedFramework}
                        onValueChange={setSelectedFramework}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="nodejs">Node.js</SelectItem>
                          <SelectItem value="python">Python</SelectItem>
                          <SelectItem value="php">PHP</SelectItem>
                          <SelectItem value="ruby">Ruby</SelectItem>
                          <SelectItem value="go">Go</SelectItem>
                          <SelectItem value="nextjs">Next.js</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedFramework === "nodejs" && (
                        <CodeBlock
                          code={`// Using fetch
async function verifyCandidate(email, externalJobId) {
  // externalJobId must match the external job ID registered in your reqCHECK dashboard
  const response = await fetch('https://api.reqcheck.io/api/v1/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REQCHECK_API_KEY
    },
    body: JSON.stringify({
      email,
      externalJobId // Must match the external job ID from your dashboard
    })
  });

  if (response.status === 404) {
    return { verified: false, passed: false };
  }

  if (!response.ok) {
    throw new Error(\`Verification failed: \${response.statusText}\`);
  }

  return await response.json();
}

// Usage in Express route
app.post('/api/application', async (req, res) => {
  const { email, jobId } = req.body; // jobId should be your external job ID
  
  const verification = await verifyCandidate(email, jobId);
  
  if (!verification.verified || !verification.passed) {
    return res.status(403).json({ 
      error: 'Verification required' 
    });
  }
  
  // Process application...
  res.json({ success: true });
});`}
                          label="Node.js / Express Example"
                        />
                      )}

                      {selectedFramework === "python" && (
                        <CodeBlock
                          code={`import requests
import os

def verify_candidate(email, external_job_id):
    # external_job_id must match the external job ID registered in your reqCHECK dashboard
    response = requests.post(
        'https://api.reqcheck.io/api/v1/verify',
        headers={
            'Content-Type': 'application/json',
            'x-api-key': os.environ.get('REQCHECK_API_KEY')
        },
        json={
            'email': email,
            'externalJobId': external_job_id  # Must match the external job ID from your dashboard
        }
    )
    
    if response.status_code == 404:
        return {'verified': False, 'passed': False}
    
    response.raise_for_status()
    return response.json()

# Usage in Flask route
from flask import request, jsonify

@app.route('/api/application', methods=['POST'])
def submit_application():
    data = request.json
    email = data.get('email')
    job_id = data.get('jobId')  # Should be your external job ID
    
    verification = verify_candidate(email, job_id)
    
    if not verification.get('verified') or not verification.get('passed'):
        return jsonify({'error': 'Verification required'}), 403
    
    # Process application...
    return jsonify({'success': True})`}
                          label="Python / Flask Example"
                        />
                      )}

                      {selectedFramework === "php" && (
                        <CodeBlock
                          code={`<?php
function verifyCandidate($email, $externalJobId) {
    // $externalJobId must match the external job ID registered in your reqCHECK dashboard
    $apiKey = getenv('REQCHECK_API_KEY');
    
    $ch = curl_init('https://api.reqcheck.io/api/v1/verify');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'Content-Type: application/json',
        'x-api-key: ' . $apiKey
    ]);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([
        'email' => $email,
        'externalJobId' => $externalJobId  // Must match the external job ID from your dashboard
    ]));
    
    $response = curl_exec($ch);
    $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    
    if ($httpCode === 404) {
        return ['verified' => false, 'passed' => false];
    }
    
    if ($httpCode !== 200) {
        throw new Exception('Verification failed');
    }
    
    return json_decode($response, true);
}

// Usage in route
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'];
    $jobId = $data['jobId'];  // Should be your external job ID
    
    $verification = verifyCandidate($email, $jobId);
    
    if (!$verification['verified'] || !$verification['passed']) {
        http_response_code(403);
        echo json_encode(['error' => 'Verification required']);
        exit;
    }
    
    // Process application...
    echo json_encode(['success' => true]);
}
?>`}
                          label="PHP Example"
                        />
                      )}

                      {selectedFramework === "ruby" && (
                        <CodeBlock
                          code={`require 'net/http'
require 'json'
require 'uri'

def verify_candidate(email, external_job_id)
  # external_job_id must match the external job ID registered in your reqCHECK dashboard
  uri = URI('https://api.reqcheck.io/api/v1/verify')
  http = Net::HTTP.new(uri.host, uri.port)
  http.use_ssl = true
  
  request = Net::HTTP::Post.new(uri)
  request['Content-Type'] = 'application/json'
  request['x-api-key'] = ENV['REQCHECK_API_KEY']
  request.body = {
    email: email,
    externalJobId: external_job_id  # Must match the external job ID from your dashboard
  }.to_json
  
  response = http.request(request)
  
  if response.code == '404'
    return { verified: false, passed: false }
  end
  
  unless response.code == '200'
    raise "Verification failed: #{response.code}"
  end
  
  JSON.parse(response.body)
end

# Usage in Rails controller
class ApplicationsController < ApplicationController
  def create
    email = params[:email]
    job_id = params[:job_id]  # Should be your external job ID
    
    verification = verify_candidate(email, job_id)
    
    unless verification['verified'] && verification['passed']
      render json: { error: 'Verification required' }, status: :forbidden
      return
    end
    
    # Process application...
    render json: { success: true }
  end
end`}
                          label="Ruby / Rails Example"
                        />
                      )}

                      {selectedFramework === "go" && (
                        <CodeBlock
                          code={`package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "io"
    "net/http"
    "os"
)

type VerificationRequest struct {
    Email         string \`json:"email"\`
    ExternalJobID string \`json:"externalJobId"\`  // Must match the external job ID from your dashboard
}

type VerificationResponse struct {
    Verified    bool   \`json:"verified"\`
    Passed      bool   \`json:"passed"\`
    Score       int    \`json:"score"\`
    CompletedAt string \`json:"completedAt"\`
}

func verifyCandidate(email, externalJobID string) (*VerificationResponse, error) {
    // externalJobID must match the external job ID registered in your reqCHECK dashboard
    apiKey := os.Getenv("REQCHECK_API_KEY")
    
    reqBody := VerificationRequest{
        Email:         email,
        ExternalJobID: externalJobID,  // Must match the external job ID from your dashboard
    }
    
    jsonData, err := json.Marshal(reqBody)
    if err != nil {
        return nil, err
    }
    
    req, err := http.NewRequest("POST", "https://api.reqcheck.io/api/v1/verify", bytes.NewBuffer(jsonData))
    if err != nil {
        return nil, err
    }
    
    req.Header.Set("Content-Type", "application/json")
    req.Header.Set("x-api-key", apiKey)
    
    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        return nil, err
    }
    defer resp.Body.Close()
    
    if resp.StatusCode == 404 {
        return &VerificationResponse{Verified: false, Passed: false}, nil
    }
    
    if resp.StatusCode != 200 {
        return nil, fmt.Errorf("verification failed: %d", resp.StatusCode)
    }
    
    body, err := io.ReadAll(resp.Body)
    if err != nil {
        return nil, err
    }
    
    var verification VerificationResponse
    if err := json.Unmarshal(body, &verification); err != nil {
        return nil, err
    }
    
    return &verification, nil
}

// Usage in handler
func submitApplication(w http.ResponseWriter, r *http.Request) {
    var data struct {
        Email string \`json:"email"\`
        JobID string \`json:"jobId"\`  // Should be your external job ID
    }
    
    json.NewDecoder(r.Body).Decode(&data)
    
    verification, err := verifyCandidate(data.Email, data.JobID)
    if err != nil || !verification.Verified || !verification.Passed {
        http.Error(w, "Verification required", http.StatusForbidden)
        return
    }
    
    // Process application...
    json.NewEncoder(w).Encode(map[string]bool{"success": true})
}`}
                          label="Go Example"
                        />
                      )}

                      {selectedFramework === "nextjs" && (
                        <CodeBlock
                          code={`// app/api/application/route.ts
import { NextRequest, NextResponse } from 'next/server';

async function verifyCandidate(email: string, externalJobId: string) {
  // externalJobId must match the external job ID registered in your reqCHECK dashboard
  const response = await fetch('https://api.reqcheck.io/api/v1/verify', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.REQCHECK_API_KEY!
    },
    body: JSON.stringify({
      email,
      externalJobId  // Must match the external job ID from your dashboard
    })
  });

  if (response.status === 404) {
    return { verified: false, passed: false };
  }

  if (!response.ok) {
    throw new Error(\`Verification failed: \${response.statusText}\`);
  }

  return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, jobId } = body;  // jobId should be your external job ID

    const verification = await verifyCandidate(email, jobId);

    if (!verification.verified || !verification.passed) {
      return NextResponse.json(
        { error: 'Verification required' },
        { status: 403 }
      );
    }

    // Process application...
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}`}
                          label="Next.js API Route Example"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Summary Sidebar */}
        {activeTab === "integration" ? (
          <IntegrationSummary
            mode={mode}
            emailField={emailField}
            initMethod={initMethod}
            testMode={testMode}
            companyId={companyId}
          />
        ) : (
          <VerificationFlow />
        )}
      </div>
    </Page>
  );
}
