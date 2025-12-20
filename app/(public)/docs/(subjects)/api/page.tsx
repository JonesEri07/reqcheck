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

export default function APIPage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="api-reference"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          API Reference
        </h1>
        <p className="text-muted-foreground text-lg">
          Complete API documentation for programmatic access to reqCHECK.
        </p>
      </div>

      <div className="space-y-8">
        <Card id="authentication">
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
            <CardDescription>How to authenticate API requests</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              All API requests require authentication using an API key. Generate
              API keys from Settings → API & Webhooks in your dashboard.
            </p>
            <p>
              Include your API key in the{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-sm">
                x-api-key
              </code>{" "}
              header:
            </p>
            <div className="rounded-lg border bg-muted p-4">
              <pre className="text-sm overflow-x-auto">
                {`x-api-key: rk_live_your_api_key_here`}
              </pre>
            </div>
            <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                Security: API keys are only used in your backend for token
                verification. Never commit them to version control, expose them
                in client-side code, or include them in the widget script. The
                widget uses Company ID, not API keys.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="base-url">
          <CardHeader>
            <CardTitle>Base URL</CardTitle>
            <CardDescription>API endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <code className="bg-muted px-2 py-1 rounded text-sm">
              https://api.reqcheck.com/v1
            </code>
          </CardContent>
        </Card>

        <Card id="endpoints">
          <CardHeader>
            <CardTitle>Endpoints</CardTitle>
            <CardDescription>Available API endpoints</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="verify" className="w-full">
              <TabsList>
                <TabsTrigger value="verify">Verify</TabsTrigger>
                <TabsTrigger value="jobs">Jobs</TabsTrigger>
                <TabsTrigger value="applications">Applications</TabsTrigger>
                <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              </TabsList>
              <TabsContent value="verify" className="space-y-4">
                <div id="-verify-endpoint" className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold">POST /api/v1/verify</h4>
                    <p className="text-muted-foreground text-sm mb-2">
                      Check if a candidate has passed verification for a
                      specific job. This endpoint is called from your backend
                      when processing application submissions.
                    </p>
                    <div className="rounded-lg border bg-muted p-4 mb-4">
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
                    <div className="space-y-2">
                      <h5 className="font-semibold text-sm">Request Body</h5>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside">
                        <li>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            externalJobId
                          </code>{" "}
                          (string, required) - The external job ID
                        </li>
                        <li>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            email
                          </code>{" "}
                          (string, required) - The candidate's email address
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2 mt-4">
                      <h5 className="font-semibold text-sm">
                        Response (200 OK)
                      </h5>
                      <div className="rounded-lg border bg-muted p-4">
                        <pre className="text-sm overflow-x-auto">
                          {`{
  "verified": true,
  "passed": true,
  "score": 85,
  "completedAt": "2024-01-15T10:30:00Z",
  "expiresAt": "2024-01-15T11:30:00Z"
}`}
                        </pre>
                      </div>
                      <ul className="space-y-1 text-sm text-muted-foreground list-disc list-inside mt-2">
                        <li>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            verified
                          </code>{" "}
                          (boolean) - Whether a valid verification was found
                        </li>
                        <li>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            passed
                          </code>{" "}
                          (boolean) - Whether the candidate passed the quiz
                        </li>
                        <li>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            score
                          </code>{" "}
                          (number, optional) - The candidate's score percentage
                        </li>
                        <li>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            completedAt
                          </code>{" "}
                          (string, optional) - ISO 8601 timestamp when
                          verification completed
                        </li>
                        <li>
                          <code className="bg-muted px-1 py-0.5 rounded text-xs">
                            expiresAt
                          </code>{" "}
                          (string, optional) - ISO 8601 timestamp when
                          verification expires
                        </li>
                      </ul>
                    </div>
                    <div className="space-y-2 mt-4">
                      <h5 className="font-semibold text-sm">
                        Response (404 Not Found)
                      </h5>
                      <div className="rounded-lg border bg-muted p-4">
                        <pre className="text-sm overflow-x-auto">
                          {`{
  "verified": false,
  "message": "No valid verification found. Candidate must complete skill quiz."
}`}
                        </pre>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Returns 404 if no valid verification found within 1-hour
                        TTL.
                      </p>
                    </div>
                    <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950 mt-4">
                      <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                        Important: Verifications are stored server-side in the
                        VerificationAttempt table with a 1-hour expiry. No
                        tokens are injected into forms. This endpoint should
                        only be called from your backend, never from frontend
                        code.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="jobs" className="space-y-4">
                <div id="-jobs-endpoint" className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold">List Jobs</h4>
                    <div className="rounded-lg border bg-muted p-4">
                      <pre className="text-sm overflow-x-auto">
                        {`GET /jobs

Response:
{
  "data": [
    {
      "id": "job_123",
      "externalJobId": "EXT-12345",
      "title": "Senior Software Engineer",
      "status": "OPEN",
      "skills": ["react", "typescript"],
      "createdAt": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "pageSize": 20,
    "total": 42
  }
}`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Create Job</h4>
                    <div className="rounded-lg border bg-muted p-4">
                      <pre className="text-sm overflow-x-auto">
                        {`POST /jobs
Content-Type: application/json

{
  "externalJobId": "EXT-12345",
  "title": "Senior Software Engineer",
  "description": "We are looking for...",
  "passThreshold": 60
}

Response:
{
  "id": "job_123",
  "externalJobId": "EXT-12345",
  "title": "Senior Software Engineer",
  "status": "OPEN",
  "createdAt": "2024-01-01T00:00:00Z"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="applications" className="space-y-4">
                <div id="-applications-endpoint" className="space-y-4">
                  <div>
                    <h4 className="mb-2 font-semibold">List Applications</h4>
                    <div className="rounded-lg border bg-muted p-4">
                      <pre className="text-sm overflow-x-auto">
                        {`GET /applications?jobId=job_123

Response:
{
  "data": [
    {
      "id": "app_123",
      "email": "candidate@example.com",
      "score": 85,
      "passed": true,
      "completedAt": "2024-01-01T00:00:00Z"
    }
  ]
}`}
                      </pre>
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 font-semibold">Verify Token</h4>
                    <div className="rounded-lg border bg-muted p-4">
                      <pre className="text-sm overflow-x-auto">
                        {`POST /verify-token
Content-Type: application/json

{
  "token": "reqcheck_token_...",
  "jobId": "EXT-12345",
  "email": "candidate@example.com"
}

Response:
{
  "valid": true,
  "jobId": "job_123",
  "email": "candidate@example.com",
  "expiresAt": "2024-01-01T01:00:00Z"
}`}
                      </pre>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="webhooks" className="space-y-4">
                <div id="-webhooks-endpoint" className="space-y-4">
                  <p className="text-muted-foreground">
                    Configure webhooks to receive real-time events when
                    applications are submitted or verification attempts
                    complete.
                  </p>
                  <div>
                    <h4 className="mb-2 font-semibold">Webhook Events</h4>
                    <ul className="space-y-2 list-disc list-inside">
                      <li>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">
                          verification.passed
                        </code>{" "}
                        - Candidate passed verification
                      </li>
                      <li>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">
                          verification.failed
                        </code>{" "}
                        - Candidate failed verification
                      </li>
                      <li>
                        <code className="bg-muted px-1 py-0.5 rounded text-sm">
                          application.submitted
                        </code>{" "}
                        - Application form submitted
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card id="rate-limits">
          <CardHeader>
            <CardTitle>Rate Limits</CardTitle>
            <CardDescription>API usage limits</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>API requests are rate-limited to ensure fair usage:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Basic:</strong> 100 requests/hour
              </li>
              <li>
                <strong>Pro:</strong> 1,000 requests/hour
              </li>
              <li>
                <strong>Enterprise:</strong> Custom limits based on contract
              </li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Rate limit headers are included in all responses:
              <code className="bg-muted px-1 py-0.5 rounded text-sm ml-1">
                X-RateLimit-Remaining
              </code>
            </p>
          </CardContent>
        </Card>

        <DocBuffer />
      </div>
    </DocsPageWrapper>
  );
}
