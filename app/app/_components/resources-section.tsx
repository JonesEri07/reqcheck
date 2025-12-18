import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Book, Code, HelpCircle, Video } from "lucide-react";

export function ResourcesSection() {
  const resources = [
    {
      title: "Documentation",
      description: "Comprehensive guides and API reference",
      href: "/docs",
      icon: Book,
    },
    {
      title: "Integration Guide",
      description: "Learn how to integrate the widget",
      href: "/docs/widget-integration",
      icon: Code,
    },
    {
      title: "Video Tutorials",
      description: "Step-by-step video guides",
      href: "#",
      icon: Video,
    },
    {
      title: "Help Center",
      description: "Get answers to common questions",
      href: "#",
      icon: HelpCircle,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Helpful Resources</CardTitle>
        <CardDescription>
          Quick links to get you started and find help
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.title}
                href={resource.href}
                className="flex items-start gap-3 p-4 rounded-lg border border-border hover:bg-accent transition-colors"
              >
                <Icon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {resource.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
