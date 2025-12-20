"use client";

import { useState, useEffect, useRef } from "react";
import Script from "next/script";
import useSWR from "swr";
import { TestConfig } from "../_components/test-config";
import { ArrowLeft, Code, Copy, Check } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

interface CallbackEvent {
  type: "success" | "failure" | "complete";
  timestamp: Date;
  data: { passed: boolean; score: number };
}

export default function ProgrammaticDemoPage() {
  const { data: teamData } = useSWR<{ id?: number }>("/api/team", fetcher);
  const companyId = teamData?.id?.toString() || "";
  const [selectedJobId, setSelectedJobId] = useState<string>("");
  const widgetInitialized = useRef(false);

  // Callback events log
  const [callbackEvents, setCallbackEvents] = useState<CallbackEvent[]>([]);
  const eventsEndRef = useRef<HTMLDivElement>(null);

  // Test verify
  const [testEmail, setTestEmail] = useState("");
  const [testRedirectUrl, setTestRedirectUrl] = useState("");

  // Config code dialog
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [copied, setCopied] = useState(false);

  const scrollToBottom = () => {
    eventsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [callbackEvents]);

  // Initialize widget when script loads and job is selected
  useEffect(() => {
    if (
      widgetInitialized.current &&
      companyId &&
      selectedJobId &&
      typeof window !== "undefined" &&
      (window as any).ReqCheck
    ) {
      // Initialize widget with autoInit: false for programmatic control
      (window as any).ReqCheck.init(
        {
          companyId,
          jobId: selectedJobId,
          autoInit: false, // Programmatic mode - we control when to trigger
        },
        {
          onSuccess: (result: { passed: boolean; score: number }) => {
            setCallbackEvents((prev) => [
              ...prev,
              {
                type: "success",
                timestamp: new Date(),
                data: result,
              },
            ]);
          },
          onFailure: (result: { passed: boolean; score: number }) => {
            setCallbackEvents((prev) => [
              ...prev,
              {
                type: "failure",
                timestamp: new Date(),
                data: result,
              },
            ]);
          },
          onComplete: (result: { passed: boolean; score: number }) => {
            setCallbackEvents((prev) => [
              ...prev,
              {
                type: "complete",
                timestamp: new Date(),
                data: result,
              },
            ]);
          },
        }
      );
    }
  }, [companyId, selectedJobId, widgetInitialized.current]);

  const handleTestVerify = () => {
    if (
      typeof window !== "undefined" &&
      (window as any).ReqCheck &&
      testEmail &&
      selectedJobId
    ) {
      (window as any).ReqCheck.verify(
        testEmail,
        selectedJobId,
        testRedirectUrl || undefined
      );
    }
  };

  const clearEvents = () => {
    setCallbackEvents([]);
  };

  // Generate config code
  const generateConfigCode = () => {
    const configLines = [
      `  companyId: "${companyId}",`,
      `  jobId: "${selectedJobId}",`,
      `  autoInit: false, // Programmatic control`,
    ];

    const configStr = `{\n${configLines.join("\n")}\n}`;

    return `// Initialize widget (call once on page load)
ReqCheck.init(
${configStr},
  {
    onSuccess: (result) => {
      console.log("Verification passed!", result);
      // Handle success - redirect, enable form, etc.
    },
    onFailure: (result) => {
      console.log("Verification failed", result);
      // Handle failure - show message, etc.
    },
    onComplete: (result) => {
      console.log("Verification completed", result);
      // Always called after success or failure
    },
  }
);

// Trigger verification programmatically (call anytime)
ReqCheck.verify(
  "candidate@example.com", // Email
  "${selectedJobId}",      // Job ID
  "https://example.com/apply" // Optional redirect URL
);`;
  };

  const handleCopyConfig = async () => {
    const code = generateConfigCode();
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
      {/* Load widget script */}
      <Script
        src="/widget.js"
        data-reqcheck-company={companyId}
        data-reqcheck-auto-init="false"
        data-reqcheck-test-mode="true"
        strategy="afterInteractive"
        onLoad={() => {
          widgetInitialized.current = true;
        }}
      />

      <div className="min-h-screen bg-background">
        {/* Header */}
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
                <h1 className="text-lg font-semibold">Programmatic API Demo</h1>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column: Configuration */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Configuration</CardTitle>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowConfigDialog(true)}
                      className="h-8 w-8"
                    >
                      <Code className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TestConfig
                    companyId={companyId}
                    selectedJobId={selectedJobId}
                    onJobChange={setSelectedJobId}
                  />

                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Programmatic API:</strong> Use{" "}
                      <code className="bg-background px-1.5 py-0.5 rounded text-xs">
                        ReqCheck.verify()
                      </code>{" "}
                      to trigger verification at any time from your JavaScript
                      code. The widget will show the full-page modal (email →
                      quiz) and call your callbacks when complete.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Test Verify Method</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="candidate@example.com"
                    />
                  </div>

                  <div>
                    <Label>Redirect URL (optional)</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      If provided, user will be redirected here after passing
                      verification
                    </p>
                    <Input
                      type="url"
                      value={testRedirectUrl}
                      onChange={(e) => setTestRedirectUrl(e.target.value)}
                      placeholder="https://example.com/apply"
                    />
                  </div>

                  <Button
                    onClick={handleTestVerify}
                    disabled={!testEmail || !selectedJobId}
                    className="w-full"
                  >
                    Trigger Verification
                  </Button>

                  <p className="text-xs text-muted-foreground">
                    This will call{" "}
                    <code className="bg-muted px-1 py-0.5 rounded">
                      ReqCheck.verify(email, jobId, redirectUrl)
                    </code>{" "}
                    and show the verification modal.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column: Events */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Callback Events</CardTitle>
                    <Button variant="outline" size="sm" onClick={clearEvents}>
                      Clear
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[600px] overflow-y-auto space-y-2">
                    {callbackEvents.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        No events yet. Click "Trigger Verification" to see
                        callback events here.
                      </p>
                    ) : (
                      callbackEvents.map((event, index) => (
                        <div
                          key={index}
                          className="p-3 border rounded-lg bg-muted/50"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                event.type === "success"
                                  ? "default"
                                  : event.type === "failure"
                                    ? "destructive"
                                    : "secondary"
                              }
                            >
                              {event.type.toUpperCase()}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {event.timestamp.toLocaleTimeString()}
                            </span>
                          </div>
                          <pre className="text-xs bg-background p-2 rounded overflow-x-auto">
                            {JSON.stringify(event.data, null, 2)}
                          </pre>
                        </div>
                      ))
                    )}
                    <div ref={eventsEndRef} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Config Code Dialog */}
      <Dialog open={showConfigDialog} onOpenChange={setShowConfigDialog}>
        <DialogContent className="max-w-3xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Programmatic API Code</DialogTitle>
            <DialogDescription>
              Copy this code to use the programmatic API in your application.
              Styles are automatically applied from your team settings.
            </DialogDescription>
          </DialogHeader>
          <div className="relative">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm max-h-[60vh]">
              <code className="text-xs">{generateConfigCode()}</code>
            </pre>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopyConfig}
              className="absolute top-4 right-4"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
