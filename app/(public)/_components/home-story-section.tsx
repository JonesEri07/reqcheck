"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { X, CheckCircle2, Mail, Clock, UserCheck } from "lucide-react";

interface StoryCardProps {
  title: string;
  icon: React.ReactNode;
  items: {
    icon: React.ReactNode;
    text: string;
    variant: "negative" | "positive";
  }[];
  variant: "before" | "after";
}

function StoryCard({ title, icon, items, variant }: StoryCardProps) {
  return (
    <Card
      className={`h-full ${
        variant === "before"
          ? "border-destructive/20 bg-destructive/5"
          : "border-primary/20 bg-primary/5"
      }`}
    >
      <CardHeader>
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-12 h-12 rounded-lg ${
              variant === "before" ? "bg-destructive/10" : "bg-primary/10"
            }`}
          >
            {icon}
          </div>
          <CardTitle className="text-2xl">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li key={index} className="flex items-start gap-3">
              <div
                className={`mt-0.5 flex-shrink-0 ${
                  item.variant === "negative"
                    ? "text-destructive"
                    : "text-primary"
                }`}
              >
                {item.icon}
              </div>
              <span className="text-muted-foreground leading-relaxed">
                {item.text}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function StorySection() {
  const beforeItems = [
    {
      icon: <Mail className="h-5 w-5" />,
      text: "Hundreds of applications flood your inbox within hours of posting",
      variant: "negative" as const,
    },
    {
      icon: <X className="h-5 w-5" />,
      text: "Most are AI-generated spam from bots mass-applying to hundreds of jobs daily",
      variant: "negative" as const,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      text: "You spend hours manually filtering through fake resumes and unverified credentials",
      variant: "negative" as const,
    },
    {
      icon: <X className="h-5 w-5" />,
      text: "Real candidates get buried under the noise, making it nearly impossible to find quality hires",
      variant: "negative" as const,
    },
  ];

  const afterItems = [
    {
      icon: <Mail className="h-5 w-5" />,
      text: "Only qualified applications reach your inbox",
      variant: "positive" as const,
    },
    {
      icon: <CheckCircle2 className="h-5 w-5" />,
      text: "Every candidate has verified their skills before applying",
      variant: "positive" as const,
    },
    {
      icon: <Clock className="h-5 w-5" />,
      text: "You review real candidates quickly, focusing on quality over quantity",
      variant: "positive" as const,
    },
    {
      icon: <UserCheck className="h-5 w-5" />,
      text: "AI bots are automatically filtered out, so quality candidates shine through",
      variant: "positive" as const,
    },
  ];

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            The Recruiter's Dilemma
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Imagine this scenario: AI bots are mass-applying to hundreds of
            jobs, making it increasingly difficult to find real candidates.
            Here's how reqCHECK could change that.
          </p>
        </div> */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StoryCard
            variant="before"
            title="Before reqCHECK"
            icon={<X className="h-6 w-6 text-destructive" />}
            items={beforeItems}
          />
          <StoryCard
            variant="after"
            title="After reqCHECK"
            icon={<CheckCircle2 className="h-6 w-6 text-primary" />}
            items={afterItems}
          />
        </div>
      </div>
    </section>
  );
}
