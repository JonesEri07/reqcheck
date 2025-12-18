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

export default function AshbyIntegrationPage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="ashby-integration"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          Ashby Integration
        </h1>
        <p className="text-muted-foreground text-lg">
          Full integration with Ashby coming in Q2 2026.
        </p>
      </div>

      <div className="space-y-8">
        <Card id="coming-soon">
          <CardHeader>
            <CardTitle>Coming Q2 2026</CardTitle>
            <CardDescription>
              We&apos;re working on a full integration with Ashby
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              We&apos;re currently developing a comprehensive integration with
              Ashby that will include:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Automatic job posting sync</li>
              <li>Real-time application updates</li>
              <li>Seamless skill verification workflow</li>
              <li>Advanced reporting and analytics</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-4">
              This integration will be available for Enterprise plans. Sign up
              to be notified when it launches.
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg border p-6">
          <div>
            <h3 className="mb-2 font-semibold">Get Notified</h3>
            <p className="text-muted-foreground text-sm">
              We&apos;ll let you know when the Ashby integration is available.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/handler/sign-up">Sign Up for Updates</Link>
          </Button>
        </div>
      </div>
    </DocsPageWrapper>
  );
}
