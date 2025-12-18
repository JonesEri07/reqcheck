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

export default function GreenhouseIntegrationPage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="greenhouse-integration"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          Greenhouse Integration
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect reqCHECK with Greenhouse to automatically sync job postings
          and streamline your hiring process.
        </p>
      </div>

      <div className="space-y-8">
        <Card id="overview">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              What you can do with the Greenhouse integration
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              The Greenhouse integration allows you to automatically sync job
              postings from your Greenhouse ATS to reqCHECK. This enables:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Automatic daily sync of new and updated job postings</li>
              <li>Automatic skill detection for each job</li>
              <li>Seamless application flow with skill verification</li>
              <li>Real-time updates when job descriptions change</li>
            </ul>
          </CardContent>
        </Card>

        <Card id="setup">
          <CardHeader>
            <CardTitle>Setup Guide</CardTitle>
            <CardDescription>Step-by-step setup instructions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div id="-get-job-board-token" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                1
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Get Your Job Board Token</h3>
                <p className="text-muted-foreground text-sm">
                  In Greenhouse, navigate to Configure → Job Board → API Tokens.
                  Create a new token with read access to job postings.
                </p>
              </div>
            </div>
            <div id="-connect-reqcheck" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                2
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Connect in reqCHECK</h3>
                <p className="text-muted-foreground text-sm">
                  Go to Integrations in your reqCHECK dashboard. Paste your
                  Greenhouse Job Board token and click &quot;Connect&quot;.
                </p>
              </div>
            </div>
            <div id="-enable-auto-sync" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                3
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Enable Auto Sync</h3>
                <p className="text-muted-foreground text-sm">
                  Toggle on &quot;Auto Sync&quot; to automatically sync jobs
                  daily. You can also trigger manual syncs from the dashboard.
                </p>
              </div>
            </div>
            <div id="-verify-jobs" className="flex gap-4">
              <div className="bg-primary text-primary-foreground flex size-10 shrink-0 items-center justify-center rounded-full font-semibold">
                4
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Verify Jobs</h3>
                <p className="text-muted-foreground text-sm">
                  After the first sync, verify that your jobs appear in the
                  reqCHECK dashboard with correct titles and descriptions.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card id="sync-behavior">
          <CardHeader>
            <CardTitle>Sync Behavior</CardTitle>
            <CardDescription>How job syncing works</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>When auto-sync is enabled, reqCHECK will:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Pull new job postings from Greenhouse daily</li>
              <li>Update existing jobs when descriptions change</li>
              <li>Archive jobs that are closed or deleted in Greenhouse</li>
              <li>Automatically detect skills for each job</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Manual syncs are also available from the dashboard if you need to
              update jobs immediately.
            </p>
          </CardContent>
        </Card>

        <Card id="troubleshooting">
          <CardHeader>
            <CardTitle>Troubleshooting</CardTitle>
            <CardDescription>Common issues and solutions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="mb-2 font-semibold">Jobs not syncing</h4>
              <p className="text-muted-foreground text-sm">
                Verify that your Job Board token has read access and is not
                expired. Check the integration status in your reqCHECK
                dashboard.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Incorrect job data</h4>
              <p className="text-muted-foreground text-sm">
                If job titles or descriptions are incorrect, verify the data in
                Greenhouse first. The sync will update on the next automatic or
                manual sync.
              </p>
            </div>
            <div>
              <h4 className="mb-2 font-semibold">Skills not detected</h4>
              <p className="text-muted-foreground text-sm">
                If skills are not being automatically detected, you can manually
                override them in the job settings within reqCHECK.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg border p-6">
          <div>
            <h3 className="mb-2 font-semibold">Need Help?</h3>
            <p className="text-muted-foreground text-sm">
              Contact support if you&apos;re experiencing issues with the
              Greenhouse integration.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/handler/sign-up">Contact Support</Link>
          </Button>
        </div>
      </div>
    </DocsPageWrapper>
  );
}
