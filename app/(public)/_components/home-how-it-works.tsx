"use client";

import { useEffect, useRef, useState } from "react";
import {
  BookOpen,
  Edit,
  RefreshCw,
  Code,
  Shield,
  CheckCircle2,
  Mail,
  Database,
  FileCode,
  Zap,
} from "lucide-react";

interface StepData {
  icon: React.ReactNode;
  title: string;
  description: string;
  subNote?: string;
  visual: React.ReactNode;
}

// Visual Components for each step
function SkillsLibraryVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="rounded-lg border-2 border-border bg-card p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            <div className="h-4 w-32 rounded bg-muted"></div>
          </div>
          <div className="space-y-2">
            {["React", "TypeScript", "Node.js", "Python", "AWS"].map(
              (skill, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 rounded-lg border border-border bg-background p-3"
                >
                  <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center">
                    <div className="h-4 w-4 rounded bg-primary/20"></div>
                  </div>
                  <div className="flex-1 h-4 rounded bg-muted"></div>
                  <div className="h-6 w-6 rounded border-2 border-primary"></div>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuestionEditorVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="rounded-lg border-2 border-border bg-card p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Edit className="h-5 w-5 text-primary" />
            <div className="h-4 w-40 rounded bg-muted"></div>
          </div>
          <div className="space-y-3">
            <div className="h-3 w-full rounded bg-muted"></div>
            <div className="h-3 w-3/4 rounded bg-muted"></div>
            <div className="rounded border-2 border-border bg-background p-4 font-mono text-xs space-y-2">
              <div className="text-primary">function</div>
              <div className="text-muted-foreground ml-4">...</div>
            </div>
            <div className="flex gap-2">
              {["Senior", "Front End", "Backend"].map((tag, i) => (
                <div
                  key={i}
                  className="px-2 py-1 rounded bg-primary/10 text-xs text-primary"
                >
                  {tag}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function JobSyncVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="flex items-center justify-center gap-4">
          <div className="rounded-lg border-2 border-border bg-card p-4 shadow-lg">
            <Database className="h-8 w-8 text-primary mb-2" />
            <div className="h-3 w-24 rounded bg-muted mb-2"></div>
            <div className="h-2 w-16 rounded bg-muted"></div>
          </div>
          <div className="flex flex-col gap-2">
            <RefreshCw className="h-6 w-6 text-primary animate-spin" />
            <Zap className="h-6 w-6 text-primary" />
          </div>
          <div className="rounded-lg border-2 border-primary bg-primary/5 p-4 shadow-lg">
            <div className="h-8 w-8 rounded bg-primary/20 mb-2"></div>
            <div className="h-3 w-20 rounded bg-primary/30 mb-2"></div>
            <div className="space-y-1">
              <div className="h-2 w-16 rounded bg-primary/20"></div>
              <div className="h-2 w-12 rounded bg-primary/20"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WidgetCodeVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="rounded-lg border-2 border-border bg-card p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Code className="h-5 w-5 text-primary" />
            <div className="h-4 w-32 rounded bg-muted"></div>
          </div>
          <div className="rounded bg-background p-4 font-mono text-sm">
            <div className="text-muted-foreground">&lt;script</div>
            <div className="text-primary ml-4">src="reqcheck.io/widget"</div>
            <div className="text-muted-foreground ml-4">
              data-company-id="..."
            </div>
            <div className="text-muted-foreground">&gt;&lt;/script&gt;</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizWidgetVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-sm">
        <div className="rounded-lg border-4 border-foreground/20 bg-foreground/5 p-4 shadow-2xl">
          <div className="mb-3 flex items-center gap-2 rounded-t-lg bg-foreground/10 px-3 py-2">
            <Shield className="h-4 w-4 text-primary" />
            <div className="h-3 w-32 rounded bg-muted"></div>
          </div>
          <div className="rounded-lg bg-card p-4">
            <div className="mb-3 h-4 w-3/4 rounded bg-muted"></div>
            <div className="mb-4 space-y-2">
              <div className="h-10 rounded border-2 border-border bg-background"></div>
              <div className="h-10 rounded border-2 border-border bg-background"></div>
              <div className="h-10 rounded border-2 border-primary bg-primary/10"></div>
            </div>
            <div className="h-10 rounded bg-primary"></div>
            <div className="mt-4 flex justify-center gap-1">
              {[1, 2, 3, 4, 5].map((dot) => (
                <div
                  key={dot}
                  className={`h-2 w-2 rounded-full ${
                    dot === 3 ? "bg-primary" : "bg-muted"
                  }`}
                ></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function APIVerificationVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="space-y-4">
          <div className="rounded-lg border-2 border-border bg-card p-4 shadow-lg">
            <div className="h-4 w-32 rounded bg-muted mb-2"></div>
            <div className="h-3 w-24 rounded bg-muted"></div>
          </div>
          <div className="flex justify-center">
            <div className="flex items-center gap-2 rounded-lg border-2 border-primary bg-primary/10 px-4 py-2">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              <div className="h-4 w-40 rounded bg-primary/20"></div>
            </div>
          </div>
          <div className="rounded-lg border-2 border-border bg-card p-4 shadow-lg">
            <div className="flex items-center gap-2 mb-2">
              <FileCode className="h-4 w-4 text-primary" />
              <div className="h-3 w-24 rounded bg-muted"></div>
            </div>
            <div className="font-mono text-xs text-muted-foreground">
              POST /api/verify
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InboxVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="rounded-lg border-2 border-border bg-card p-6 shadow-lg">
          <div className="flex items-center gap-2 mb-4">
            <Mail className="h-5 w-5 text-primary" />
            <div className="h-4 w-32 rounded bg-muted"></div>
          </div>
          <div className="space-y-2">
            {[
              { verified: true, name: "John Doe" },
              { verified: true, name: "Jane Smith" },
              { verified: false, name: "Bot User" },
            ].map((item, i) => (
              <div
                key={i}
                className={`flex items-center gap-3 rounded-lg border-2 p-3 ${
                  item.verified
                    ? "border-primary bg-primary/5"
                    : "border-destructive/50 bg-destructive/5 opacity-50"
                }`}
              >
                {item.verified ? (
                  <CheckCircle2 className="h-5 w-5 text-primary" />
                ) : (
                  <div className="h-5 w-5 rounded-full border-2 border-destructive"></div>
                )}
                <div className="flex-1">
                  <div className="h-4 w-32 rounded bg-muted mb-1"></div>
                  <div className="h-3 w-24 rounded bg-muted"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const STEPS: StepData[] = [
  {
    icon: <BookOpen className="h-8 w-8" />,
    title: "Select the skills you hire for",
    description:
      "Browse our skill library and add the skills relevant to your hiring needs. Build your customized skill taxonomy.",
    visual: <SkillsLibraryVisual />,
  },
  {
    icon: <Edit className="h-8 w-8" />,
    title: "Customize challenge questions",
    description:
      "Tailor questions to match your requirements. Adjust difficulty, time limits, and question formats.",
    subNote:
      "Tag questions to match them with job categories such as Senior, Front End, etc.",
    visual: <QuestionEditorVisual />,
  },
  {
    icon: <RefreshCw className="h-8 w-8" />,
    title: "Sync your jobs to our system",
    description:
      "Connect your job board or ATS. We'll automatically detect and match skills for each job posting.",
    visual: <JobSyncVisual />,
  },
  {
    icon: <Code className="h-8 w-8" />,
    title: "Add widget script to your job board pages",
    description:
      "Copy and paste one line of code into your job posting pages. No backend changes required.",
    visual: <WidgetCodeVisual />,
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title:
      "Applicants must pass randomized challenge quiz to gain access to the form",
    description:
      "Candidates answer skill-specific questions. The application form only unlocks if they pass the threshold.",
    visual: <QuizWidgetVisual />,
  },
  {
    icon: <CheckCircle2 className="h-8 w-8" />,
    title: "Double layer protection: Verify in your backend with our API",
    description:
      "Your backend verifies every application submission with our API to ensure the candidate passed the quiz.",
    visual: <APIVerificationVisual />,
  },
  {
    icon: <Mail className="h-8 w-8" />,
    title: "Only verified applicants get into your inbox",
    description:
      "Unqualified candidates and bots are filtered out. You only review applications from verified, qualified candidates.",
    visual: <InboxVisual />,
  },
];

function StepCard({
  step,
  index,
  isActive,
  progress,
}: {
  step: StepData;
  index: number;
  isActive: boolean;
  progress: number;
}) {
  const opacity = isActive ? 1 : 0;
  const scale = isActive ? 1 : 0.9;
  const translateY = isActive ? 0 : 30;

  return (
    <div
      className="absolute inset-0 flex items-center justify-center px-4 sm:px-6 lg:px-8 transition-all duration-700 ease-out"
      style={{
        opacity,
        transform: `translateY(${translateY}px) scale(${scale})`,
        pointerEvents: isActive ? "auto" : "none",
        visibility: isActive ? "visible" : "hidden",
      }}
    >
      {/* Background visual for smaller screens */}
      <div className="xl:hidden absolute inset-0 mt-[100px] flex items-center justify-center opacity-25 pointer-events-none">
        <div className="w-full max-w-md h-full max-h-md">{step.visual}</div>
      </div>

      {/* Content - split layout on xl, centered on smaller */}
      <div className="relative z-10 w-full max-w-7xl self-start mt-[100px] xl:mt-0 xl:self-center">
        <div className="flex flex-col xl:flex-row xl:items-center xl:gap-12">
          {/* Text content */}
          <div className="flex-1 xl:text-left text-center space-y-6 xl:pt-0 items-start">
            <div
              className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 text-primary mb-4 transition-transform duration-500 xl:mx-0 mx-auto"
              style={{
                transform: `scale(${0.8 + progress * 0.2})`,
              }}
            >
              {step.icon}
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-center xl:justify-start gap-3">
                {/* <span className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground text-lg font-bold">
                  {index + 1}
                </span> */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-foreground">
                  {step.title}
                </h3>
              </div>
              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl xl:max-w-none mx-auto xl:mx-0">
                {step.description}
              </p>
              {step.subNote && (
                <p className="text-sm text-muted-foreground italic max-w-xl xl:max-w-none mx-auto xl:mx-0">
                  {step.subNote}
                </p>
              )}
            </div>
          </div>

          {/* Visual representation - only on xl screens */}
          <div className="hidden xl:flex flex-1 items-center justify-center h-full min-h-[400px]">
            <div
              className="w-full max-w-lg transition-transform duration-500"
              style={{
                transform: `scale(${0.9 + progress * 0.1})`,
              }}
            >
              {step.visual}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeStep, setActiveStep] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isInPinnedSection, setIsInPinnedSection] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const containerTop = rect.top;
      const containerHeight = rect.height;

      // Check if we're in the pinned section
      const isPinned =
        containerTop <= 0 && containerTop + containerHeight > windowHeight;
      setIsInPinnedSection(isPinned);

      if (isPinned) {
        // Calculate progress through the section
        const scrollAmount = Math.abs(containerTop);
        const maxScroll = containerHeight - windowHeight;
        const progress = Math.min(scrollAmount / maxScroll, 1);

        // Determine active step based on progress
        const stepProgress = progress * STEPS.length;
        const currentStep = Math.min(
          Math.floor(stepProgress),
          STEPS.length - 1
        );
        const stepLocalProgress = stepProgress - currentStep;

        setActiveStep(currentStep);
        setScrollProgress(stepLocalProgress);
      } else if (containerTop > 0) {
        // Before the section - show first step
        setActiveStep(0);
        setScrollProgress(0);
      } else {
        // Past the section - show last step
        setActiveStep(STEPS.length - 1);
        setScrollProgress(1);
      }
    };

    // Use requestAnimationFrame for smooth scrolling
    let rafId: number | null = null;
    const scrollHandler = () => {
      rafId = requestAnimationFrame(() => {
        handleScroll();
        rafId = null;
      });
    };

    window.addEventListener("scroll", scrollHandler, { passive: true });
    window.addEventListener("resize", scrollHandler);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", scrollHandler);
      window.removeEventListener("resize", scrollHandler);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  return (
    <section
      id="how-it-works"
      className="relative bg-gradient-to-b from-background via-accent/90 to-background"
    >
      {/* Header - fixed above pinned section */}
      <div className="relative z-1 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              How It Works
            </h2>
            <p className="mt-4 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto">
              Complete end-to-end process from setup to verified applications
            </p>
          </div>
        </div>
      </div>

      {/* Pinned scroll section */}
      <div
        ref={containerRef}
        className="relative"
        style={{
          height: `${STEPS.length * 100}vh`,
        }}
      >
        {/* Step indicator dots - only visible when in pinned section */}
        {isInPinnedSection && (
          <div className="fixed top-1/2 right-8 -translate-y-1/2 z-20 hidden lg:flex flex-col gap-3 transition-opacity duration-300">
            {STEPS.map((_, index) => (
              <div
                key={index}
                className="relative"
                style={{
                  transition: "all 0.3s ease-out",
                }}
              >
                <div
                  className={`w-3 h-3 rounded-full border-2 transition-all duration-300 ${
                    index === activeStep
                      ? "bg-primary border-primary scale-125"
                      : "bg-transparent border-border"
                  }`}
                />
                {index === activeStep && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-primary animate-ping" />
                    <div
                      className="text-xs text-foreground absolute inset-0"
                      style={{ transform: "translate(2px, -2px)" }}
                    >
                      {index + 1}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Step cards - positioned absolutely, overlapping */}
        <div className="sticky top-0 h-screen overflow-hidden">
          {STEPS.map((step, index) => (
            <StepCard
              key={index}
              step={step}
              index={index}
              isActive={index === activeStep}
              progress={index === activeStep ? scrollProgress : 0}
            />
          ))}
        </div>
      </div>

      {/* Spacer after section */}
      <div className="h-32" />
    </section>
  );
}
