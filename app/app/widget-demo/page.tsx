"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ContentHeader } from "@/components/content-header";
import { Page } from "@/components/page";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormInput, Link as LinkIcon, Code, ArrowRight } from "lucide-react";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function WidgetDemoPage() {
  const { data: teamData } = useSWR<{ id?: number }>("/api/team", fetcher);

  const companyId = teamData?.id?.toString() || "";

  if (!companyId) {
    return (
      <Page>
        <ContentHeader title="Widget Demo" />
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">
              Please log in to access the widget demo.
            </p>
          </CardContent>
        </Card>
      </Page>
    );
  }

  return (
    <Page>
      <ContentHeader title="Widget Demo & Testing" />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Demo Pages</CardTitle>
            <CardDescription>
              Test each widget mode in a realistic environment that mirrors how
              clients would integrate the widget on their websites.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Protect Mode */}
            <Link href="/app/widget-demo/protect">
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <FormInput className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Protect Mode</CardTitle>
                        <CardDescription>
                          Form protection - verifies before form submission
                        </CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Test how the widget blocks form submission until
                    verification is complete. Includes smart email detection and
                    overlay blocking.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Gate Mode */}
            <Link href="/app/widget-demo/gate">
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <LinkIcon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Gate Mode</CardTitle>
                        <CardDescription>
                          Link/button protection - verifies before navigation
                        </CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Test how the widget intercepts link and button clicks,
                    requiring verification before redirecting to external ATS
                    systems.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Inline Mode */}
            <Link href="/app/widget-demo/inline">
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Code className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">Inline Mode</CardTitle>
                        <CardDescription>
                          Inline rendering - quiz appears directly on the page
                        </CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Test how the widget renders inline within your page layout.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Programmatic API */}
            <Link href="/app/widget-demo/programmatic">
              <Card className="hover:border-primary transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Code className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">
                          Programmatic API
                        </CardTitle>
                        <CardDescription>
                          Test the programmatic API with editable config values
                        </CardDescription>
                      </div>
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Edit configuration values, style overrides, and see callback
                    events in real-time. Perfect for testing customizations.
                  </p>
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>

        {/* Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>About These Demos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              Each demo page simulates a real client integration. The widget
              script is loaded exactly as clients would load it, and the HTML
              structure matches what clients would implement.
            </p>
            <p>
              The only difference is a small test configuration panel at the top
              that lets you select which job to test with. Everything else
              behaves exactly as it would on a client's website.
            </p>
            <div className="pt-2">
              <p className="font-medium text-foreground mb-2">What to test:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Widget initialization and validation</li>
                <li>Smart email detection on blur events</li>
                <li>Quiz generation and progression</li>
                <li>Progress saving and resume functionality</li>
                <li>Form blocking and unlocking</li>
                <li>Link/button interception</li>
                <li>24-hour cooldown handling</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </Page>
  );
}
