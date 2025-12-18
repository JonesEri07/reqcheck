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
import {
  ArrowRight,
  Bot,
  Shield,
  Eye,
  Clock,
  Book,
  Edit,
  SquareCheck,
  Pencil,
  Image,
  Timer,
  Bolt,
  Users,
  CircleCheck,
  FileText,
  CheckCircle2,
  XCircle,
  Smartphone,
  Briefcase,
  Stethoscope,
  GraduationCap,
  Wrench,
} from "lucide-react";

// Skill Marquee Component
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

  return (
    <div className="overflow-hidden py-8">
      <div className="flex animate-marquee space-x-8">
        {[...skills, ...skills].map((skill, index) => (
          <span
            key={index}
            className="text-lg font-medium text-muted-foreground whitespace-nowrap"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}

// Mobile Mockup Component
function MobileMockup() {
  return (
    <div className="relative mx-auto max-w-sm">
      <div className="rounded-lg border-4 border-foreground/20 bg-foreground/5 p-2 shadow-2xl">
        {/* Browser frame */}
        <div className="mb-2 flex items-center gap-2 rounded-t-lg bg-foreground/10 px-3 py-2">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-destructive"></div>
            <div className="h-3 w-3 rounded-full bg-accent"></div>
            <div className="h-3 w-3 rounded-full bg-primary"></div>
          </div>
          <div className="flex-1 rounded bg-foreground/10 px-3 py-1 text-xs text-muted-foreground">
            reqcheck.io/widget
          </div>
        </div>
        {/* Question card mockup */}
        <div className="rounded-lg bg-card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="h-4 w-24 rounded bg-muted"></div>
            <div className="h-4 w-16 rounded bg-muted"></div>
          </div>
          <div className="mb-4 space-y-2">
            <div className="h-3 w-full rounded bg-muted"></div>
            <div className="h-3 w-3/4 rounded bg-muted"></div>
          </div>
          <div className="mb-4 rounded bg-muted p-3 font-mono text-xs">
            <div className="space-y-1">
              <div className="text-primary">function</div>
              <div className="text-accent-foreground">calculateSum</div>
              <div className="text-muted-foreground">{"{"}</div>
              <div className="ml-4 text-muted-foreground">...</div>
              <div className="text-muted-foreground">{"}"}</div>
            </div>
          </div>
          <div className="mb-4 space-y-2">
            <div className="h-10 rounded border-2 border-border bg-background"></div>
            <div className="h-10 rounded border-2 border-border bg-background"></div>
            <div className="h-10 rounded border-2 border-border bg-background"></div>
          </div>
          <div className="h-10 rounded bg-primary"></div>
          <div className="mt-4 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((dot) => (
              <div
                key={dot}
                className={`h-2 w-2 rounded-full ${
                  dot === 1 ? "bg-primary" : "bg-muted"
                }`}
              ></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <main>
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-background via-accent/10 to-background py-20 lg:py-32">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-foreground tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Stop AI Resume Spam.
              <span className="block text-primary">
                Start Hiring Real Candidates.
              </span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto">
              AI bots are flooding your inbox with fake applications. reqCHECK
              filters out unqualified candidates before they apply, so you only
              review real candidates with verified skills.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 text-lg"
              >
                <Link href="/pricing">Get Started Free</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg"
              >
                <Link href="/docs">View Docs</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-8 py-6 text-lg"
              >
                <Link href="#demo">Try Interactive Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Problem Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 mb-6">
              <Bot className="h-8 w-8 text-destructive animate-pulse" />
            </div>
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              AI Bots Are Flooding Your Inbox
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Every job posting attracts hundreds of AI-generated resumes. You
              spend hours sifting through spam, fake credentials, and
              unqualified candidates. The signal-to-noise ratio is broken.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Solution Section */}
      <section className="py-16 bg-gradient-to-b from-background via-accent/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How reqCHECK Stops the Spam
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Filters Unqualified Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Candidates verify their skills before applying. Only those who
                  pass can submit their application.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Eye className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Glimpse Into Expected Work</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Candidates get a preview of the work they'll be expected to be
                  familiar with. This transparency helps them self-assess before
                  applying.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Verified Token Protection</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Backend-verified tokens prevent candidates from skipping the
                  verification form. Only verified applicants get into your
                  inbox.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 4. Skills Library Section */}
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
                  community-driven taxonomy that keeps up with technology
                  trends.
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

      {/* 5. How It Works Section */}
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              How It Works
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Bolt className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-semibold text-primary mb-2">
                  5-minute setup
                </div>
                <CardTitle className="text-lg">Add Widget</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Copy a single script tag into your job posting page. No
                  backend changes required.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-semibold text-primary mb-2">
                  5 quick questions
                </div>
                <CardTitle className="text-lg">
                  Candidate Verifies Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Candidates answer skill-specific questions. Takes 2-3 minutes.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <CircleCheck className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-semibold text-primary mb-2">
                  Form unlocks on pass
                </div>
                <CardTitle className="text-lg">Only Qualified Apply</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Application form only appears if they pass. Unqualified
                  candidates never see it.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div className="text-sm font-semibold text-primary mb-2">
                  Spam-free inbox
                </div>
                <CardTitle className="text-lg">
                  Review Real Candidates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every application in your inbox is from a verified, qualified
                  candidate.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 6. For Every Industry Section */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl mb-4">
              Not Just for Tech—Works for Every Industry
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              reqCHECK isn't limited to software engineering. Verify skills for
              any role, in any industry. From healthcare to finance,
              construction to customer service—if it requires skills, reqCHECK
              can verify them.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Stethoscope className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Healthcare</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Verify medical knowledge, certifications, and clinical skills
                  for nurses, technicians, and support staff.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Finance & Sales</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Test financial knowledge, compliance understanding, and
                  customer service skills before interviews.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <Wrench className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Skilled Trades</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Verify technical knowledge, safety protocols, and
                  trade-specific expertise for electricians, plumbers, and more.
                </CardDescription>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Education & Training</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Assess teaching methods, subject knowledge, and educational
                  qualifications for educators and trainers.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
          <div className="mt-12 text-center">
            <Card className="bg-muted/50 border-dashed">
              <CardContent className="pt-6">
                <p className="text-muted-foreground mb-4">
                  <strong className="text-foreground">
                    Custom skills for any role.
                  </strong>{" "}
                  Create skill assessments tailored to your industry, role, or
                  company-specific requirements. No technical knowledge
                  required.
                </p>
                <Button asChild variant="outline">
                  <Link href="/docs/skills-challenges">Learn How It Works</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 7. Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-background via-accent/10 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
              Why Companies Choose reqCHECK
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">For Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Reduce application volume while improving quality
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Save time reviewing applications
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Get instant quality signals for every candidate
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      No backend integration required—works with any ATS
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">For Candidates</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Know exactly what skills are required before applying
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Quick verification, not a lengthy take-home
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Fair assessment—everyone answers the same questions
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      Only qualified candidates waste time—others self-select
                      out
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* 8. Mobile-First Section */}
      <section className="py-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Smartphone className="h-8 w-8 text-primary" />
                <h2 className="text-3xl font-bold text-foreground sm:text-4xl">
                  Built for mobile
                </h2>
              </div>
              <p className="text-lg text-muted-foreground mb-6">
                Most candidates apply from their phone. reqCHECK's widget is
                fully responsive and optimized for mobile devices. Candidates
                can verify their skills on any device, anywhere.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    Touch-optimized interface
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    Fast loading on slow connections
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                  <span className="text-muted-foreground">
                    Works offline with sync
                  </span>
                </li>
              </ul>
            </div>
            <div className="relative">
              <MobileMockup />
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final CTA Section */}
      <section className="py-20 bg-gradient-to-b from-background via-accent/10 to-background">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-foreground sm:text-5xl mb-6">
            Stop the Spam. Start Hiring Real Candidates.
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Get started free with 100 applications per month. No credit card
            required.
          </p>
          <Button asChild size="lg" className="rounded-full px-12 py-6 text-lg">
            <Link href="/pricing">Get Started Free</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
