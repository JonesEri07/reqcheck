"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Stethoscope, Briefcase, Wrench, GraduationCap } from "lucide-react";

interface IndustryCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function IndustryCard({ icon, title, description }: IndustryCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
          {icon}
        </div>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
    </Card>
  );
}

export function IndustrySection() {
  return (
    <section id="industries" className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Not Just for Tech—Works for Every Industry
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            reqCHECK isn't limited to software engineering. Verify skills for
            any role, in any industry. From healthcare to finance, construction
            to customer service—if it requires skills, reqCHECK can verify them.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <IndustryCard
            icon={<Stethoscope className="h-6 w-6 text-primary" />}
            title="Healthcare"
            description="Verify medical knowledge, certifications, and clinical skills for nurses, technicians, and support staff."
          />
          <IndustryCard
            icon={<Briefcase className="h-6 w-6 text-primary" />}
            title="Finance & Sales"
            description="Test financial knowledge, compliance understanding, and customer service skills before interviews."
          />
          <IndustryCard
            icon={<Wrench className="h-6 w-6 text-primary" />}
            title="Skilled Trades"
            description="Verify technical knowledge, safety protocols, and trade-specific expertise for electricians, plumbers, and more."
          />
          <IndustryCard
            icon={<GraduationCap className="h-6 w-6 text-primary" />}
            title="Education & Training"
            description="Assess teaching methods, subject knowledge, and educational qualifications for educators and trainers."
          />
        </div>
        <div className="mt-12 text-center">
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="pt-6">
              <p className="text-muted-foreground mb-4">
                <strong className="text-foreground">
                  Custom skills for any role.
                </strong>{" "}
                Create skill assessments tailored to your industry, role, or
                company-specific requirements. No technical knowledge required.
              </p>
              <Button asChild variant="outline">
                <Link href="/docs/skills-challenges">Learn more</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
