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
import { DocsPageWrapper } from "@/app/(public)/docs/_components/docs-page-wrapper";
import { DocBuffer } from "@/app/(public)/docs/_components/doc-buffer";
import {
  BasicIntegrationCode,
  ProtectModeCode,
  GateModeCode,
  InlineModeCode,
  EmailCaptureCode,
  BackendVerificationCode,
  ProgrammaticCode,
} from "./_components/widget-integration-code-blocks";

export default function WidgetIntegrationPage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="widget-integration"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          Widget Integration
        </h1>
        <p className="text-muted-foreground text-lg">
          Detailed guide to integrating and customizing the reqCHECK widget with
          accurate, resilient behavior across all modes.
        </p>
      </div>

      <div className="space-y-8">
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
                  Throughout this documentation, references to{" "}
                  <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-xs font-mono">
                    jobId
                  </code>{" "}
                  or{" "}
                  <code className="bg-blue-100 dark:bg-blue-900/50 px-1 py-0.5 rounded text-xs font-mono">
                    data-reqcheck-job
                  </code>{" "}
                  refer to the <strong>external job ID</strong> you registered
                  when creating the job in your reqCHECK dashboard. This is the
                  identifier that links your external job posting system (e.g.,
                  Greenhouse, Workday) with reqCHECK, and is{" "}
                  <strong>not</strong> the same as the internal database ID.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="lifecycle">
          <CardHeader>
            <CardTitle>Widget Lifecycle & Guardrails</CardTitle>
            <CardDescription>
              Safety checks before anything renders
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <ul className="list-disc list-inside space-y-1">
              <li>
                On load we validate the provided company + job id, ensure the
                job has at least one skill with weight &gt; 0, and that at least
                one of those skills has a challenge question with weight &gt; 0.
              </li>
              <li>
                If any check fails, the widget silently bails and hides itself
                so the user can proceed normally (no blocking, no errors).
              </li>
              <li>
                All network or rendering errors are handled the same way: fail
                closed, allow the candidate to continue without interruptions.
              </li>
            </ul>
            <p className="font-medium text-foreground">
              Result: the widget only appears when there is a valid, scorable
              quiz. Otherwise it behaves like it was never on the page.
            </p>
          </CardContent>
        </Card>

        <Card id="basic-integration">
          <CardHeader>
            <CardTitle>Basic Integration</CardTitle>
            <CardDescription>The simplest way to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Load the widget script once in your{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">
                &lt;head&gt;
              </code>
              , then add mode attributes to your elements. The widget auto-scans
              and initializes only when guardrails pass.
            </p>
            <BasicIntegrationCode />
          </CardContent>
        </Card>

        <Card id="widget-modes">
          <CardHeader>
            <CardTitle>Widget Modes</CardTitle>
            <CardDescription>
              Three modes for different use cases
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="protect" className="w-full">
              <TabsList>
                <TabsTrigger value="protect">protect</TabsTrigger>
                <TabsTrigger value="gate">gate</TabsTrigger>
                <TabsTrigger value="inline">inline</TabsTrigger>
              </TabsList>
              <TabsContent value="protect" className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">Form Protection Mode</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Use for traditional application forms. Semi-transparent
                    overlay covers the form with a CTA to unlock. If an email is
                    already stored locally, we check for an attempt within the
                    last 24 hours and show current progress on the overlay.
                  </p>
                  <ProtectModeCode />
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Behavior:</strong> CTA opens a full-page modal.
                    First step collects email (skipped when already stored). We
                    check for an attempt within the last 24 hours; if none, we
                    generate a new quiz, otherwise we resume progress. On pass,
                    overlay disappears and the form is usable; we store a
                    temporary validation key for backend retrieval. On fail, we
                    record the failed attempt and show that a retry is available
                    in 24 hours while the form remains blocked.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="gate" className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">
                    Gate/Redirect Protection Mode
                  </h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Use for native CTAs such as external ATS links, "Apply with
                    Greenhouse" buttons, or email links. We intercept the CTA to
                    show the full-page modal if no local session token exists.
                  </p>
                  <GateModeCode />
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Behavior:</strong> Same modal flow as protect
                    (resume attempts within 24 hours, generate a quiz if none).
                    On pass, we call the original handler or redirect to the
                    intended destination. On fail, the attempt is logged and the
                    user sees that they can retry in 24 hours.
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="inline" className="space-y-4">
                <div>
                  <h4 className="mb-2 font-semibold">Inline Widget Mode</h4>
                  <p className="text-muted-foreground text-sm mb-4">
                    Use for custom placement when you want full control. Widget
                    renders inline without an overlay; applicants can ignore it,
                    but backend validation can still enforce verification.
                  </p>
                  <InlineModeCode />
                  <p className="text-sm text-muted-foreground mt-2">
                    <strong>Behavior:</strong> Same modal/email flow as protect
                    but without a blocking overlay. On pass, enables elements
                    with{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      data-reqcheck-blocked-by="inline"
                    </code>
                    . On fail, shows failure state in place and logs the
                    attempt; retry window is 24 hours.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card id="initialization-options">
          <CardHeader>
            <CardTitle>Initialization Options</CardTitle>
            <CardDescription>
              Auto-init, manual control, or programmatic trigger
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="auto" className="w-full">
              <TabsList>
                <TabsTrigger value="auto">Auto-init</TabsTrigger>
                <TabsTrigger value="manual">Manual</TabsTrigger>
                <TabsTrigger value="programmatic">Programmatic</TabsTrigger>
              </TabsList>
              <TabsContent value="auto" className="space-y-4">
                <div>
                  <p className="text-muted-foreground">
                    By default, the widget automatically finds and initializes
                    all{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      [data-reqcheck-mode]
                    </code>{" "}
                    elements. No additional code needed.
                  </p>
                  <div className="rounded-lg border bg-muted p-4">
                    <pre className="text-sm overflow-x-auto">
                      {`<script src="https://cdn.reqcheck.io/widget.js" 
        data-reqcheck-company="your-company-id"></script>
<!-- Automatically finds and initializes all [data-reqcheck-mode] elements -->`}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="manual" className="space-y-4">
                <div>
                  <p className="text-muted-foreground">
                    Disable auto-init and control when/how to initialize:
                  </p>
                  <div className="rounded-lg border bg-muted p-4">
                    <pre className="text-sm overflow-x-auto">
                      {`<script src="https://cdn.reqcheck.io/widget.js" 
        data-reqcheck-company="your-company-id"
        data-reqcheck-auto-init="false"></script>

<script>
  // They control when/how to init
  ReqCheck.init({
    companyId: "your-company-id",
    mode: "gate",
    jobId: "job_123",
    selector: "#custom-apply-btn"
  });
  
  // Or init specific element
  ReqCheck.initElement(document.querySelector('#my-form'));
</script>`}
                    </pre>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="programmatic" className="space-y-4">
                <div>
                  <p className="text-muted-foreground mb-4">
                    Use programmatic API to trigger verification from JavaScript
                    code. Best for SPAs, custom application flows, or when you
                    need full control over when verification happens.
                  </p>
                  <ProgrammaticCode />
                  <div className="space-y-2 text-sm mt-4">
                    <p className="font-medium">Programmatic API Behavior:</p>
                    <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                      <li>
                        Call{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          ReqCheck.verify(email, externalJobId, redirectUrl)
                        </code>{" "}
                        to trigger verification (where{" "}
                        <code className="bg-muted px-1 py-0.5 rounded text-xs">
                          externalJobId
                        </code>{" "}
                        is the external job ID from your dashboard)
                      </li>
                      <li>
                        Widget shows the full-page modal (email → quiz) same as
                        other modes
                      </li>
                      <li>
                        Callbacks fire when verification completes (success,
                        failure, or complete)
                      </li>
                      <li>
                        If redirectUrl provided and user passes, they're
                        redirected automatically
                      </li>
                      <li>
                        Styles are automatically applied from your team settings
                        (no client-side configuration needed)
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card id="email-capture">
          <CardHeader>
            <CardTitle>Email Capture</CardTitle>
            <CardDescription>
              Required before quiz, with optional smart detection
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              All modes require email capture before showing the quiz. You can
              enable smart email detection to compare the blurred email against
              any local session and check backend status automatically.
            </p>
            <EmailCaptureCode />
            <div className="space-y-2 text-sm">
              <p className="font-medium">Smart Email Detection Behavior:</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>User types email → tabs away</li>
                <li>
                  Widget checks if it matches a stored email; if different, it
                  checks that email against backend sessions
                </li>
                <li>
                  If already passed: Shows reqCHECK checkmark ✓ next to the
                  field
                </li>
                <li>
                  If no attempt: Exposes CTA to launch quiz inline/full-page
                </li>
                <li>
                  If failed within 24h: Shows "Try again in X hours" warning
                </li>
              </ul>
              <p className="text-muted-foreground mt-2">
                <strong>Fallback:</strong> Without{" "}
                <code className="bg-muted px-1 py-0.5 rounded text-xs">
                  data-reqcheck-email-field
                </code>
                , user must click the blocked element to trigger the quiz.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="styling-customization">
          <CardHeader>
            <CardTitle>Widget Styling</CardTitle>
            <CardDescription>
              Customize widget appearance from your dashboard
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Widget styles are configured server-side in your reqCHECK
              dashboard under <strong>Settings → Styles</strong>. The widget
              automatically fetches and applies these styles when it
              initializes.
            </p>
            <div className="rounded-lg border bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                {`Available Style Properties:
- Font Color: Color for all text in the widget
- Background Color: Background color for modals and overlays
- Button Color: Background color for all buttons
- Button Text Color: Text color for buttons
- Accent Color: Color for selected answers, progress bars, and success states`}
              </pre>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">How It Works:</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>
                  Configure styles in <strong>Settings → Styles</strong> in your
                  dashboard
                </li>
                <li>
                  Styles are automatically applied to all widget instances for
                  your team
                </li>
                <li>
                  No client-side configuration needed - styles are fetched from
                  the backend
                </li>
                <li>
                  Widget is fully responsive and adapts to mobile viewports
                  automatically
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card id="pass-threshold">
          <CardHeader>
            <CardTitle>Pass Threshold</CardTitle>
            <CardDescription>Configured in dashboard only</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Pass threshold is configured in your dashboard (per job or
              company-wide default, 60% default). There is no client-side
              override to prevent gaming. The widget respects backend settings
              automatically.
            </p>
          </CardContent>
        </Card>

        <Card id="callbacks-events">
          <CardHeader>
            <CardTitle>Callbacks & Events</CardTitle>
            <CardDescription>Listen for verification events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Listen for verification events to track in analytics or trigger
              custom behavior:
            </p>
            <div className="rounded-lg border bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                {`ReqCheck.on('verified', (result) => {
  // { passed: true, score: 85, email: "...", jobId: "..." }
  console.log('Candidate passed!', result);
  
  // Track in analytics
  gtag('event', 'reqcheck_passed', { score: result.score });
});

ReqCheck.on('failed', (result) => {
  // { passed: false, score: 45, requiredScore: 60 }
  console.log('Candidate failed', result);
});

ReqCheck.on('abandoned', () => {
  // User closed quiz without completing
  console.log('Quiz abandoned');
});`}
              </pre>
            </div>
          </CardContent>
        </Card>

        <Card id="test-mode">
          <CardHeader>
            <CardTitle>Test Mode</CardTitle>
            <CardDescription>
              Test integration without enforcing verification
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Enable test mode to render and test the widget without backend
              enforcement:
            </p>
            <div className="rounded-lg border bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                {`<script src="https://cdn.reqcheck.io/widget.js" 
  data-reqcheck-company="your-company-id"
  data-reqcheck-test-mode="true"
</script>`}
              </pre>
            </div>
            <div className="space-y-2 text-sm">
              <p className="font-medium">Test Mode Behavior:</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>Widget renders and functions normally</li>
                <li>Quiz appears and can be completed</li>
                <li>But: Backend doesn't enforce verification</li>
                <li>Applications proceed even without passing</li>
                <li>Shows "TEST MODE" badge in widget</li>
              </ul>
              <p className="text-muted-foreground mt-2">
                Use for: Staging environments, testing integration, previewing
                widget before going live.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="content-security-policy">
          <CardHeader>
            <CardTitle>Content Security Policy (CSP)</CardTitle>
            <CardDescription>
              Required CSP directives for reqCHECK
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="meta" className="w-full">
              <TabsList>
                <TabsTrigger value="meta">Meta Tag</TabsTrigger>
                <TabsTrigger value="nginx">Nginx</TabsTrigger>
                <TabsTrigger value="apache">Apache</TabsTrigger>
                <TabsTrigger value="nextjs">Next.js</TabsTrigger>
              </TabsList>
              <TabsContent value="meta" className="space-y-4">
                <div className="rounded-lg border bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`<meta http-equiv="Content-Security-Policy" content="
  script-src 'self' https://cdn.reqcheck.io;
  connect-src 'self' https://api.reqcheck.io;
  style-src 'self' https://cdn.reqcheck.io 'unsafe-inline';
  img-src 'self' https://cdn.reqcheck.io data:;
  font-src 'self' https://cdn.reqcheck.io;
">`}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="nginx" className="space-y-4">
                <div className="rounded-lg border bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`add_header Content-Security-Policy "
  script-src 'self' https://cdn.reqcheck.io;
  connect-src 'self' https://api.reqcheck.io;
  style-src 'self' https://cdn.reqcheck.io 'unsafe-inline';
" always;`}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="apache" className="space-y-4">
                <div className="rounded-lg border bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`Header set Content-Security-Policy "
  script-src 'self' https://cdn.reqcheck.io;
  connect-src 'self' https://api.reqcheck.io;
  style-src 'self' https://cdn.reqcheck.io 'unsafe-inline';
"`}
                  </pre>
                </div>
              </TabsContent>
              <TabsContent value="nextjs" className="space-y-4">
                <div className="rounded-lg border bg-muted p-4">
                  <pre className="text-sm overflow-x-auto">
                    {`// next.config.js
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: \`
      script-src 'self' https://cdn.reqcheck.io;
      connect-src 'self' https://api.reqcheck.io;
      style-src 'self' https://cdn.reqcheck.io 'unsafe-inline';
    \`.replace(/\\s{2,}/g, ' ').trim()
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};`}
                  </pre>
                </div>
              </TabsContent>
            </Tabs>
            <div className="mt-4 space-y-2 text-sm">
              <p className="font-medium">Why each directive is needed:</p>
              <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    script-src
                  </code>{" "}
                  - Allows widget JavaScript to load
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    connect-src
                  </code>{" "}
                  - Allows API calls to reqCHECK backend
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    style-src 'unsafe-inline'
                  </code>{" "}
                  - Allows widget styling (we'll work on removing this
                  requirement)
                </li>
                <li>
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    img-src
                  </code>{" "}
                  /{" "}
                  <code className="bg-muted px-1 py-0.5 rounded text-xs">
                    font-src
                  </code>{" "}
                  - For widget assets
                </li>
              </ul>
              <p className="text-muted-foreground mt-2">
                <strong>Testing CSP:</strong> Open browser console and look for
                CSP violation errors. If widget doesn't appear, likely CSP is
                blocking it.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="backend-verification">
          <CardHeader>
            <CardTitle>Backend Verification</CardTitle>
            <CardDescription>
              Check verification status in your backend
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              When a candidate passes verification, reqCHECK stores the result
              server-side with a 1-hour expiry. When they submit their
              application, your backend should call the Verification API to
              check if they passed.
            </p>
            <BackendVerificationCode />
            <p className="text-sm text-muted-foreground">
              Returns verification status including whether they passed, their
              score, and when they completed. Returns 404 if no valid
              verification found (within 1 hour).
            </p>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Important: API keys are only used in your backend for
                verification lookup. Never expose them in frontend code or
                include them in the widget script. Verifications are stored
                server-side - no tokens are injected into forms.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="multi-language-support">
          <CardHeader>
            <CardTitle>Multi-Language Support</CardTitle>
            <CardDescription>Current status and roadmap</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              <strong>Status:</strong> Coming Q2 2026
            </p>
            <p className="text-sm text-muted-foreground">
              Planned languages: English, Spanish, French, German, Portuguese
            </p>
            <p className="text-sm text-muted-foreground">
              For now, all content is English only.
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg border p-6">
          <div>
            <h3 className="mb-2 font-semibold">Need Help?</h3>
            <p className="text-muted-foreground text-sm">
              Check the API reference for more advanced integration options.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs/api">API Reference</Link>
          </Button>
        </div>
        <DocBuffer />
      </div>
    </DocsPageWrapper>
  );
}
