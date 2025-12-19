"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Check, Copy } from "lucide-react";

type CodeBlockProps = {
  code: string;
  language?: string;
  showCopy?: boolean;
};

function CodeBlock({ code, language, showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const copyToClipboard = () => {
    navigator.clipboard.writeText(code);
    toast.success("Copied to clipboard");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative rounded-lg border bg-muted p-4">
      {showCopy && (
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
      )}
      <pre className="text-sm overflow-x-auto pr-10">
        <code>{code}</code>
      </pre>
    </div>
  );
}

type WidgetCodeBlocksProps = {
  companyId?: string;
};

export function BasicIntegrationCode({ companyId }: WidgetCodeBlocksProps) {
  const companyPlaceholder = companyId || "your-company-id";
  const code = `<!-- In <head> - set once -->
<script src="https://cdn.reqcheck.io/widget.js" 
        data-reqcheck-company="${companyPlaceholder}"></script>

<!-- On any page, any element -->
<!-- data-reqcheck-job uses your external job ID (from dashboard) -->
<form data-reqcheck-mode="protect" data-reqcheck-job="job_123">
  <!-- Your form fields -->
  <input type="email" name="email" data-reqcheck-email-field="true" required />
</form>

<!-- Or for external links -->
<a href="https://jobs.greenhouse.io/apply/123" 
   data-reqcheck-mode="gate" 
   data-reqcheck-job="job_456">
  Apply Now
</a>`;

  return <CodeBlock code={code} />;
}

export function ProtectModeCode(_: WidgetCodeBlocksProps) {
  const code = `<!-- data-reqcheck-job uses your external job ID (from dashboard) -->
<form data-reqcheck-mode="protect" data-reqcheck-job="job_123">
  <!-- Email field enables smart resume/24h checks -->
  <input type="email" name="email" data-reqcheck-email-field="true" required />
  <input type="text" name="name" required />
  <button type="submit">Submit Application</button>
</form>`;

  return <CodeBlock code={code} />;
}

export function GateModeCode(_: WidgetCodeBlocksProps) {
  const code = `<!-- data-reqcheck-job uses your external job ID (from dashboard) -->
<a href="https://jobs.greenhouse.io/apply/123" 
   data-reqcheck-mode="gate" 
   data-reqcheck-job="job_456">
  Apply Now
</a>

<!-- Or with button -->
<button onclick="applyViaLinkedIn()" 
        data-reqcheck-mode="gate" 
        data-reqcheck-job="job_789">
  Apply via LinkedIn
</button>`;

  return <CodeBlock code={code} />;
}

export function InlineModeCode(_: WidgetCodeBlocksProps) {
  const code = `<div class="job-posting">
  <h2>Senior Software Engineer</h2>
  <p>Job description...</p>
  
  <!-- Widget renders here -->
  <!-- data-reqcheck-job uses your external job ID (from dashboard) -->
  <div data-reqcheck-mode="inline" data-reqcheck-job="job_789">
  </div>
  
  <!-- This button is blocked until quiz passes -->
  <a href="https://apply.workday.com/123" 
     data-reqcheck-blocked-by="inline">
    Apply Now
  </a>
</div>`;

  return <CodeBlock code={code} />;
}

export function EmailCaptureCode(_: WidgetCodeBlocksProps) {
  const code = `<input
  type="email" 
  name="email"
  required 
  data-reqcheck-email-field="true" <!-- Smart detection: blur to compare with stored email, show check/CTA/warning -->
/>
<!-- Widget monitors this field and checks verification status on blur. -->`;

  return <CodeBlock code={code} />;
}

export function ProgrammaticCode({ companyId }: WidgetCodeBlocksProps) {
  const companyPlaceholder = companyId || "your-company-id";
  const code = `<!-- Load widget script (auto-init disabled for programmatic control) -->
<script src="https://cdn.reqcheck.io/widget.js" 
        data-reqcheck-company="${companyPlaceholder}"
        data-reqcheck-auto-init="false"></script>

<script>
  // Initialize widget once (call on page load)
  ReqCheck.init(
    {
      companyId: "${companyPlaceholder}",
      jobId: "job_123", // External job ID (from your dashboard, not the database ID)
      autoInit: false, // Programmatic control
    },
    {
      onSuccess: (result) => {
        console.log("Verification passed!", result);
        // Handle success - redirect, enable form, etc.
        window.location.href = "https://greenhouse.io/apply/123";
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
      "job_123",                // External job ID (must match the external job ID from your dashboard)
      "https://greenhouse.io/apply/123" // Optional redirect URL
    );
  }
</script>

<button onclick="handleApply()">Apply Now</button>`;

  return <CodeBlock code={code} />;
}

export function BackendVerificationCode(_: WidgetCodeBlocksProps) {
  const code = `POST /api/v1/verify
Content-Type: application/json
x-api-key: YOUR_API_KEY

{
  "externalJobId": "job_123", // External job ID (from dashboard, not database ID)
  "email": "candidate@example.com"
}`;

  return <CodeBlock code={code} />;
}
