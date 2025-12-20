"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface BenefitItemProps {
  text: string;
}

function BenefitItem({ text }: BenefitItemProps) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
      <span className="text-muted-foreground">{text}</span>
    </li>
  );
}

interface BenefitsCardProps {
  title: string;
  benefits: string[];
}

function BenefitsCard({ title, benefits }: BenefitsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {benefits.map((benefit, index) => (
            <BenefitItem key={index} text={benefit} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export function BenefitsSection() {
  const companyBenefits = [
    "Reduce application volume while improving quality",
    "Save time reviewing applications",
    "Get instant quality signals for every candidate",
    "No backend integration required—works with any ATS",
  ];

  const candidateBenefits = [
    "Know exactly what skills are required before applying",
    "Quick verification, not a lengthy take-home",
    "Fair assessment—everyone answers the same questions",
    "Only qualified candidates waste time—others self-select out",
  ];

  return (
    <section
      id="benefits"
      className="py-16 bg-gradient-to-b from-background via-accent/90 to-background"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
            Why Companies Choose reqCHECK
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <BenefitsCard title="For Companies" benefits={companyBenefits} />
          <BenefitsCard title="For Candidates" benefits={candidateBenefits} />
        </div>
      </div>
    </section>
  );
}
