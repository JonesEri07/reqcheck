import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Book, Code, Plug, Rocket, Settings, Sparkles } from "lucide-react";

const docSections = [
  {
    title: "Getting Started",
    description: "Learn the basics and get up and running quickly",
    href: "/docs/getting-started",
    icon: Rocket,
  },
  {
    title: "Installation",
    description: "Step-by-step guide to installing and configuring reqCHECK",
    href: "/docs/installation",
    icon: Settings,
  },
  {
    title: "Widget Integration",
    description: "How to integrate the reqCHECK widget into your job pages",
    href: "/docs/widget-integration",
    icon: Code,
  },
  {
    title: "Skills & Challenges",
    description: "Understanding the skill taxonomy and challenge system",
    href: "/docs/skills-challenges",
    icon: Sparkles,
  },
  {
    title: "ATS Integrations",
    description: "Connect reqCHECK with your existing ATS systems",
    href: "/docs/integrations",
    icon: Plug,
  },
  {
    title: "API Reference",
    description: "Complete API documentation for programmatic access",
    href: "/docs/api",
    icon: Book,
  },
];

export default function DocsPage() {
  return (
    <div className="container mx-auto max-w-6xl px-4 py-16">
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-5xl">
          Documentation
        </h1>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          Everything you need to know about reqCHECK, from installation to
          advanced integrations.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {docSections.map((section) => (
          <Card
            key={section.href}
            className="hover:border-primary transition-colors"
          >
            <CardHeader>
              <div className="bg-primary/10 mb-4 flex size-12 items-center justify-center rounded-lg">
                <section.icon className="text-primary size-6" />
              </div>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>{section.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" asChild>
                <Link href={section.href}>Read More</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-16 rounded-lg border bg-muted/50 p-8">
        <h2 className="mb-4 text-2xl font-semibold">Quick Start</h2>
        <p className="text-muted-foreground mb-6">
          Get reqCHECK up and running in under 5 minutes.
        </p>
        <div className="space-y-4">
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-semibold">
              1
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Sign up for an account</h3>
              <p className="text-muted-foreground text-sm">
                Create your reqCHECK account and complete the onboarding wizard.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-semibold">
              2
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Add the widget script</h3>
              <p className="text-muted-foreground text-sm">
                Copy the widget script tag and add it to your job application
                pages.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-semibold">
              3
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Configure your jobs</h3>
              <p className="text-muted-foreground text-sm">
                Skills are automatically detected, or you can manually configure
                them in the dashboard.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="bg-primary text-primary-foreground flex size-8 shrink-0 items-center justify-center rounded-full font-semibold">
              4
            </div>
            <div>
              <h3 className="mb-1 font-semibold">Start verifying candidates</h3>
              <p className="text-muted-foreground text-sm">
                Widget is now live and candidates can start verifying their
                skills before applying to your jobs.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Button asChild>
            <Link href="/docs/getting-started">Get Started Guide</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
