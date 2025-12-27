"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

type IntegrationMode = "protect" | "gate" | "inline" | null;
type EmailField = "yes" | "no" | null;
type InitMethod = "auto" | "manual" | "programmatic" | null;
type TestMode = boolean;

interface IntegrationSummaryProps {
  mode: IntegrationMode;
  emailField: EmailField;
  initMethod: InitMethod;
  testMode: TestMode;
  companyId: string;
}

export function IntegrationSummary({
  mode,
  emailField,
  initMethod,
  testMode,
  companyId,
}: IntegrationSummaryProps) {
  const hasAnySelection = mode !== null;

  if (!hasAnySelection) {
    return (
      <aside className="hidden xl:block w-64 shrink-0">
        <div className="sticky top-14 self-start max-h-[calc(100vh-6rem)] overflow-auto py-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Integration Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Select your integration options to see your custom code blocks
                and summary.
              </p>
            </CardContent>
          </Card>
        </div>
      </aside>
    );
  }

  const modeDescriptions: Record<Exclude<IntegrationMode, null>, string> = {
    protect:
      "Blocks form submission with a semi-transparent overlay until verification passes.",
    gate: "Intercepts clicks on CTAs (buttons, links) to show verification before redirecting.",
    inline:
      "Renders the widget inline on your page without blocking, giving you full control.",
  };

  const emailDescriptions: Record<Exclude<EmailField, null>, string> = {
    yes: "Smart email detection enabled - widget checks if email already passed verification.",
    no: "Email will be collected in the verification modal when user clicks to unlock.",
  };

  const initDescriptions: Record<Exclude<InitMethod, null>, string> = {
    auto: "Widget automatically finds and initializes all elements with data-reqcheck-mode attributes.",
    manual: "You control when and how the widget initializes.",
    programmatic:
      "Use JavaScript API to trigger verification programmatically.",
  };

  const getCodeBlockSummary = () => {
    if (!mode || !initMethod) return null;

    const blocks: string[] = [];

    // Always need the script tag
    blocks.push(
      `1. Add the widget script to your <head> tag. This loads the reqCHECK widget library with your company ID (${companyId}).`
    );

    // Mode-specific code
    if (mode === "protect") {
      blocks.push(
        `2. Add data-reqcheck-mode="protect" and data-reqcheck-job="YOUR_EXTERNAL_JOB_ID" to your form element. Replace YOUR_EXTERNAL_JOB_ID with the external job ID you registered in your dashboard. This enables form protection with overlay blocking.`
      );
      // TODO: Email field step - Evaluate later
      // if (emailField === "yes") {
      //   blocks.push(
      //     `3. Add data-reqcheck-email-field="true" to your email input. This enables email-based verification checking - when the applicant types their email, the widget checks if they've already passed verification. If verified, submission is allowed. If not, they're prompted to complete the quiz. This also acts as a security check if someone bypasses the widget.`
      //   );
      // }
    } else if (mode === "gate") {
      blocks.push(
        `2. Add data-reqcheck-mode="gate" and data-reqcheck-job="YOUR_EXTERNAL_JOB_ID" to your CTA element (button or link). Replace YOUR_EXTERNAL_JOB_ID with the external job ID you registered in your dashboard. This intercepts clicks to show verification before redirecting.`
      );
      // TODO: Email field step - Evaluate later
      // if (emailField === "yes") {
      //   blocks.push(
      //     `3. Add data-reqcheck-email-field="true" to your email input if you have one. This enables email-based verification checking - when the applicant types their email, the widget checks if they've already passed verification. If verified, they can proceed. If not, they're prompted to complete the quiz.`
      //   );
      // }
    } else if (mode === "inline") {
      blocks.push(
        `2. Add data-reqcheck-mode="inline" and data-reqcheck-job="YOUR_EXTERNAL_JOB_ID" to a container element where you want the widget to render. Replace YOUR_EXTERNAL_JOB_ID with the external job ID you registered in your dashboard.`
      );
      blocks.push(
        `3. Add data-reqcheck-blocked-by="inline" to elements that should be blocked until verification passes.`
      );
    }

    // Init method specific
    if (initMethod === "manual") {
      blocks.push(
        `3. Add data-reqcheck-auto-init="false" to the script tag and use ReqCheck.init() with jobId set to your external job ID to control initialization.`
      );
    } else if (initMethod === "programmatic") {
      blocks.push(
        `3. Use ReqCheck.verify() in your JavaScript with jobId set to your external job ID to trigger verification programmatically.`
      );
    }

    // Test mode
    if (testMode) {
      blocks.push(
        `4. Add data-reqcheck-test-mode="true" to enable test mode (widget renders but doesn't enforce verification).`
      );
    }

    return blocks;
  };

  const codeBlocks = getCodeBlockSummary();

  return (
    <aside className="hidden xl:block w-64 shrink-0">
      <div className="sticky top-14 self-start max-h-[calc(100vh-6rem)] overflow-auto py-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Integration Summary</CardTitle>
            <CardDescription className="text-xs">
              Your selected configuration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {mode && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="h-3 w-3 text-primary" />
                    <span className="text-sm font-medium">
                      {mode === "protect"
                        ? "Protect Mode"
                        : mode === "gate"
                          ? "Gate Mode"
                          : "Inline Mode"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-5">
                    {modeDescriptions[mode]}
                  </p>
                </div>
              )}

              {/* TODO: Email field step - Evaluate later */}
              {/* {mode && mode !== "inline" && emailField && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="h-3 w-3 text-primary" />
                    <span className="text-sm font-medium">
                      Email Field: {emailField === "yes" ? "Yes" : "No"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-5">
                    {emailDescriptions[emailField]}
                  </p>
                </div>
              )} */}

              {initMethod && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="h-3 w-3 text-primary" />
                    <span className="text-sm font-medium">
                      {initMethod === "auto"
                        ? "Auto-init"
                        : initMethod === "manual"
                          ? "Manual Init"
                          : "Programmatic API"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-5">
                    {initDescriptions[initMethod]}
                  </p>
                </div>
              )}

              {testMode && (
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Check className="h-3 w-3 text-primary" />
                    <span className="text-sm font-medium">Test Mode</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-5">
                    Widget renders without backend enforcement.
                  </p>
                </div>
              )}
            </div>

            {codeBlocks && codeBlocks.length > 0 && (
              <div className="pt-4 border-t">
                <h4 className="text-sm font-semibold mb-2">Your Code Blocks</h4>
                <ol className="space-y-2 text-xs text-muted-foreground">
                  {codeBlocks.map((block, index) => (
                    <li key={index} className="pl-2">
                      {block}
                    </li>
                  ))}
                </ol>
                <div className="mt-3 p-2 rounded border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950">
                  <p className="text-xs text-orange-900 dark:text-orange-100">
                    <strong>Remember:</strong> Replace{" "}
                    <code className="bg-orange-100 dark:bg-orange-900 px-1 py-0.5 rounded">
                      YOUR_EXTERNAL_JOB_ID
                    </code>{" "}
                    with the external job ID you registered in your dashboard.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
}
