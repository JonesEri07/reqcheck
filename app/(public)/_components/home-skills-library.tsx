import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Book, Edit, SquareCheck, Pencil, Image, Timer } from "lucide-react";
import { SkillIcon } from "@/components/skill-icon";

function SkillMarquee() {
  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Python",
    "Node.js",
    "SQL",
    "AWS",
    "Docker",
    "Git",
    "MongoDB",
    "PostgreSQL",
    "GraphQL",
  ];

  const duplicatedSkills = [...skills, ...skills, ...skills];

  return (
    <div className="overflow-hidden py-2 relative">
      <div className="flex animate-marquee space-x-8 will-change-transform">
        {duplicatedSkills.map((skill, index) => (
          <span
            key={`${skill}-${index}`}
            className="text-lg font-medium text-muted-foreground whitespace-nowrap flex items-center gap-2 flex-shrink-0"
          >
            <SkillIcon name={skill} className="w-4 h-4" />
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

export function HomeSkillsLibrary() {
  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
            Ready-to-use skill library + custom control
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <Card className="bg-muted">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Book className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Curated skill taxonomy</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Start with our library of verified skills. We maintain a
                community-driven taxonomy that keeps up with technology trends.
              </CardDescription>
            </CardContent>
          </Card>
          <Card className="bg-muted">
            <CardHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Edit className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>Layer in your own rules</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Add custom skills, adjust weights, and fine-tune question
                selection to match your exact requirements.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="mb-12">
          <h3 className="text-2xl font-semibold text-foreground text-center mb-8">
            Question formats recruits actually enjoy
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                  <SquareCheck className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Multiple choice</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Quick, standardized assessment of knowledge
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                  <Pencil className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Fill in the blank</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Test understanding through code completion
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                  <Image className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Image-aware</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Questions that reference diagrams and screenshots
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10 mb-3">
                  <Timer className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-base">Optional timers</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm">
                  Add time pressure when it matters
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="text-center mb-8">
          <Button
            asChild
            size="lg"
            variant="outline"
            className="rounded-full px-8 py-6 text-lg"
          >
            <Link href="#demo">Try Interactive Demo</Link>
          </Button>
        </div>

        <div className="pt-8">
          <Separator className="mb-8" />
          <SkillMarquee />
          <p className="text-center text-muted-foreground mt-4">Plus more!</p>
        </div>
      </div>
    </section>
  );
}
