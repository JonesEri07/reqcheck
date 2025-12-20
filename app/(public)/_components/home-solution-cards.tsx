"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Shield, Eye } from "lucide-react";

interface SolutionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function SolutionCard({ icon, title, description }: SolutionCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export function SolutionSection() {
  return (
    <section className="py-16 bg-gradient-to-b from-background via-accent/90 to-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            How reqCHECK Stops the Spam
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <SolutionCard
            icon={<Shield className="h-6 w-6 text-primary" />}
            title="Filters Unqualified Applications"
            description="Candidates verify their skills before applying. Only those who pass can submit their application."
          />
          <SolutionCard
            icon={<Eye className="h-6 w-6 text-primary" />}
            title="Glimpse Into Expected Work"
            description="Candidates get a preview of the work they'll be expected to be familiar with. This transparency helps them self-assess before applying."
          />
          <SolutionCard
            icon={<Shield className="h-6 w-6 text-primary" />}
            title="Verified Token Protection"
            description="Backend-verified tokens prevent candidates from skipping the verification form. Only verified applicants get into your inbox."
          />
        </div>
      </div>
    </section>
  );
}
