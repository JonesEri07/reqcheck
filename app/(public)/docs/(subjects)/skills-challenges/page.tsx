import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DocsPageWrapper } from "@/app/(public)/docs/_components/docs-page-wrapper";
import { DocBuffer } from "@/app/(public)/docs/_components/doc-buffer";

export default function SkillsChallengesPage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="skills-challenges"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          Skills & Challenges
        </h1>
        <p className="text-muted-foreground text-lg">
          Learn how reqCHECK organizes skills and creates challenge quizzes.
        </p>
      </div>

      <div className="space-y-8">
        <Card id="skill-taxonomy">
          <CardHeader>
            <CardTitle>Skills Library</CardTitle>
            <CardDescription>
              How skills are organized and found
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>reqCHECK maintains a library of skills. Each skill includes:</p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Name:</strong> The official skill name (e.g., "React",
                "TypeScript")
              </li>
              <li>
                <strong>Aliases:</strong> Other names or abbreviations people
                might use (e.g., "reactjs", "react.js")
              </li>
              <li>
                <strong>Challenge Questions:</strong> A collection of questions
                used to test candidates on this skill
              </li>
            </ul>
            <p>
              Skills can be <strong>Curated</strong> (maintained by reqCHECK
              with verified questions) or <strong>Custom</strong> (created by
              your organization for your specific needs).
            </p>
            <p className="text-sm text-muted-foreground">
              Custom skills are unique to your organization. If enough users
              create the same custom skill, it has the opportunity to become a
              curated skill maintained by reqCHECK with verified question pools.
            </p>
          </CardContent>
        </Card>

        <Card id="auto-detection">
          <CardHeader>
            <CardTitle>Automatic Skill Detection</CardTitle>
            <CardDescription>
              How reqCHECK finds skills in your job descriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>When you create a job posting, reqCHECK automatically:</p>
            <ol className="space-y-2 list-decimal list-inside">
              <li>
                Scans your job title and description for skill names and
                keywords
              </li>
              <li>
                Matches those keywords to skills in the library (even if spelled
                slightly differently)
              </li>
              <li>
                Picks the most relevant skills based on how often they appear
                and the context
              </li>
              <li>
                Selects appropriate challenge questions from the skill's
                question collection
              </li>
            </ol>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Example:</p>
              <p className="text-sm text-muted-foreground">
                A job description mentioning "React", "TypeScript", and
                "Node.js" will automatically be assigned those three skills, and
                candidates will be tested with questions from those skill
                collections.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card id="challenge-questions">
          <CardHeader>
            <CardTitle>Challenge Questions</CardTitle>
            <CardDescription>
              How questions are generated and presented
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Each quiz includes randomly selected questions from the skills
              detected in the job. reqCHECK offers two question types:
            </p>
            <div className="grid gap-4 md:grid-cols-2">
              {/* Multiple Choice Card */}
              <Link
                href="/docs/skills-challenges/multiple-choice"
                className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">
                        Multiple Choice
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Select the correct answer from 2-5 options
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg
                        className="size-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="9"
                          strokeWidth="2"
                          strokeDasharray="2 2"
                        />
                        <circle cx="12" cy="12" r="3" fill="currentColor" />
                      </svg>
                    </div>
                  </div>

                  {/* Visual Example */}
                  <div className="rounded-lg border bg-muted/30 p-4">
                    <div className="mb-3 h-2 w-3/4 rounded bg-muted-foreground/20" />
                    <div className="space-y-2">
                      {[1, 2, 3, 4].map((idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 rounded border border-muted-foreground/20 bg-background p-2"
                        >
                          <div className="flex size-4 shrink-0 items-center justify-center rounded-full border-2 border-muted-foreground/30">
                            {idx === 1 && (
                              <div className="size-2 rounded-full bg-muted-foreground/40" />
                            )}
                          </div>
                          <div className="h-2 flex-1 rounded bg-muted-foreground/10" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-primary group-hover:underline">
                  Learn more
                  <svg
                    className="ml-1 size-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>

              {/* Fill in the Blank Card */}
              <Link
                href="/docs/skills-challenges/fill-in-the-blank"
                className="group relative overflow-hidden rounded-lg border bg-card p-6 transition-all hover:border-primary hover:shadow-md"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="mb-1 text-lg font-semibold">
                        Fill in the Blank
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Arrange text blocks to complete the statement
                      </p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-2">
                      <svg
                        className="size-5 text-primary"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Visual Example */}
                  <div className="rounded-lg border bg-muted/30 p-4 space-y-3">
                    <div className="rounded border bg-background p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-12 rounded bg-muted-foreground/20" />
                        <div className="h-6 w-16 rounded border-2 border-dashed border-muted-foreground/30 bg-muted-foreground/5" />
                        <div className="h-6 w-10 rounded bg-muted-foreground/20" />
                        <div className="h-6 w-16 rounded border-2 border-dashed border-muted-foreground/30 bg-muted-foreground/5" />
                        <div className="h-6 w-8 rounded bg-muted-foreground/20" />
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3].map((idx) => (
                        <div
                          key={idx}
                          className={`h-6 rounded border px-2 ${
                            idx < 2
                              ? "w-16 border-muted-foreground/30 bg-muted-foreground/10"
                              : "w-20 border-muted-foreground/20 bg-muted-foreground/5"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm text-primary group-hover:underline">
                  Learn more
                  <svg
                    className="ml-1 size-4 transition-transform group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Question Options:</p>
              <ul className="space-y-2 list-disc list-inside text-sm text-muted-foreground">
                <li>
                  <strong>Images:</strong> Add images to make questions more
                  visual
                </li>
                <li>
                  <strong>Time Limits:</strong> Set how long candidates have to
                  answer (30 seconds to 10 minutes)
                </li>
                <li>
                  <strong>Priority:</strong> Mark questions as higher priority
                  to increase their chance of being selected
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card id="pass-threshold">
          <CardHeader>
            <CardTitle>Pass Threshold</CardTitle>
            <CardDescription>How candidates pass or fail</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              By default, candidates need to score 60% or higher to pass. This
              threshold can be customized:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Per Job:</strong> Set a custom threshold for specific
                jobs
              </li>
              <li>
                <strong>Organization Default:</strong> Set a default threshold
                for all jobs
              </li>
            </ul>
            <p>
              If a candidate fails, they can retry after 24 hours. This prevents
              spam while giving candidates a chance to improve.
            </p>
          </CardContent>
        </Card>

        <Card id="custom-questions">
          <CardHeader>
            <CardTitle>Custom Questions</CardTitle>
            <CardDescription>
              Create your own challenge questions with tagging
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Create your own challenge questions tailored to your
              organization's needs. Your custom questions are private to your
              organization and can be tagged to help reqCHECK pick the most
              relevant ones for each job.
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Create questions for your specific needs:</strong> Write
                questions that test knowledge unique to your industry or tools
              </li>
              <li>
                <strong>Use your own questions instead of defaults:</strong>{" "}
                Replace or add to the curated questions with your own for
                specific skills
              </li>
              <li>
                <strong>Tag questions for better matching:</strong> Add tags to
                help reqCHECK automatically pick the most relevant questions for
                each job
              </li>
              <li>
                <strong>Keep track of your questions:</strong> Maintain a
                history of all your questions over time
              </li>
            </ul>

            <div className="mt-6 space-y-4">
              <h4 className="font-semibold">Question Tagging</h4>
              <p className="text-sm text-muted-foreground">
                Tags help reqCHECK match questions to job descriptions. When you
                post a job, questions with tags that match words in the job
                description are more likely to be selected for the quiz.
              </p>

              <div className="rounded-lg border bg-muted/50 p-4 space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">
                    How Tag Matching Works:
                  </p>
                  <ol className="space-y-2 list-decimal list-inside text-sm text-muted-foreground">
                    <li>
                      Create tags in your organization's tag library (e.g.,
                      "Frontend", "API Design", "Security")
                    </li>
                    <li>Add tags to questions when creating or editing them</li>
                    <li>
                      When you post a job, reqCHECK looks for tag names in the
                      job description
                    </li>
                    <li>
                      Questions with matching tags are more likely to be
                      selected (you can adjust this in settings)
                    </li>
                    <li>
                      Questions without matching tags can still be selected,
                      just less often
                    </li>
                  </ol>
                </div>

                <div className="pt-2 border-t">
                  <p className="text-sm font-medium mb-2">Tag Features:</p>
                  <ul className="space-y-1 list-disc list-inside text-sm text-muted-foreground">
                    <li>
                      <strong>Flexible matching:</strong> Tags can use patterns
                      to match variations of keywords
                    </li>
                    <li>
                      <strong>Multiple tags per question:</strong> Add several
                      tags to cover different topics in one question
                    </li>
                    <li>
                      <strong>Your organization only:</strong> Tags are private
                      to your organization and can be reused across questions
                    </li>
                    <li>
                      <strong>Adjustable importance:</strong> Control how much
                      tags influence question selection in your settings
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                  Example:
                </p>
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  A question tagged with "React" and "Hooks" will be more likely
                  to appear in a job posting that mentions "React hooks" or
                  "React development". This helps ensure candidates are tested
                  on topics most relevant to the specific role.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg border p-6">
          <div>
            <h3 className="mb-2 font-semibold">Ready to streamline?</h3>
            <p className="text-muted-foreground text-sm">
              Learn about ATS integrations to automatically sync jobs and
              skills.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs/integrations">Next: Integrations</Link>
          </Button>
        </div>
        <DocBuffer />
      </div>
    </DocsPageWrapper>
  );
}
