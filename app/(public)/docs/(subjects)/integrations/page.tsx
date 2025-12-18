import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ContactSalesButton } from "@/components/contact-sales-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DocsPageWrapper } from "@/app/(public)/docs/_components/docs-page-wrapper";
import { DocBuffer } from "@/app/(public)/docs/_components/doc-buffer";

export default function IntegrationsPage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="ats-integrations"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          ATS Integrations
        </h1>
        <p className="text-muted-foreground text-lg">
          Connect reqCHECK with your existing Applicant Tracking System.
        </p>
      </div>

      <div className="space-y-8">
        <Card id="available-integrations">
          <CardHeader>
            <CardTitle>Available Integrations</CardTitle>
            <CardDescription>Supported ATS platforms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
              <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                <Badge className="mr-2 bg-blue-600 text-white border-blue-600">
                  Pro+
                </Badge>
                ATS integration requires a Pro+ plan or higher.
              </p>
            </div>
            <div className="space-y-4">
              <Link
                href="/docs/integrations/greenhouse"
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Greenhouse</h3>
                    <Badge>Pro+</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Connect via Greenhouse Job Board token. Automatic daily sync
                    of job postings.
                  </p>
                </div>
              </Link>
              <Link
                href="/docs/integrations/lever"
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Lever</h3>
                    <Badge variant="secondary">Enterprise</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Full integration with Lever ATS. Coming Q2 2026.
                  </p>
                </div>
              </Link>
              <Link
                href="/docs/integrations/ashby"
                className="flex items-center justify-between rounded-lg border p-4 hover:bg-muted/50 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Ashby</h3>
                    <Badge variant="secondary">Enterprise</Badge>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Full integration with Ashby. Coming Q2 2026.
                  </p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card id="manual-job-management">
          <CardHeader>
            <CardTitle>Manual Job Management</CardTitle>
            <CardDescription>
              Creating and managing jobs without integrations
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              If you don&apos;t use a supported ATS, or prefer manual control,
              you can create and manage jobs directly in the reqCHECK dashboard:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Create jobs manually with title and description</li>
              <li>Set external job IDs to match your system</li>
              <li>Override auto-detected skills</li>
              <li>Configure challenge settings per job</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              Manual jobs work exactly the same as synced jobs—the widget
              doesn&apos;t distinguish between them.
            </p>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg border p-6">
          <div>
            <h3 className="mb-2 font-semibold">
              Need Enterprise Integrations?
            </h3>
            <p className="text-muted-foreground text-sm">
              Contact sales to discuss custom integrations for your ATS.
            </p>
          </div>
          <ContactSalesButton variant="outline" />
        </div>
        <DocBuffer />
      </div>
    </DocsPageWrapper>
  );
}
