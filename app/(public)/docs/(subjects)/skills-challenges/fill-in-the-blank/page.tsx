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
import { Badge } from "@/components/ui/badge";
import { DocBuffer } from "@/app/(public)/docs/_components/doc-buffer";
import { FillInTheBlankExample } from "../_components/question-example-fill-in-the-blank";

export default function FillInTheBlankPage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="fill-in-the-blank"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          Fill in the Blank Questions
        </h1>
        <p className="text-muted-foreground text-lg">
          Create interactive questions where candidates arrange text blocks to
          complete statements or code.
        </p>
      </div>

      <div className="space-y-8">
        <Card id="overview">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              How fill in the blank questions work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Fill in the blank questions present a block of text with empty
              spaces (blanks). Candidates are given a pool of text blocks and
              must arrange them in the correct order. This format is ideal for
              testing syntax, terminology, and structured knowledge.
            </p>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Key Features:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Text block with multiple blank spaces</li>
                <li>Pool of option blocks (correct answers + distractors)</li>
                <li>Must place blocks in correct order</li>
                <li>Optional image attachment</li>
                <li>Optional time limit</li>
                <li>Supports all difficulty levels</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card id="standard-examples">
          <CardHeader>
            <CardTitle>Standard Examples</CardTitle>
            <CardDescription>
              Typical fill in the blank questions for technical roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">JavaScript/TypeScript</p>
              <FillInTheBlankExample
                question={
                  <div className="bg-background border rounded p-3 font-mono text-sm">
                    <span className="text-muted-foreground">import</span>{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    <span className="text-muted-foreground">from</span>{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>
                    <span className="text-muted-foreground">;</span>
                  </div>
                }
                blanks={[
                  { id: "1", correctAnswer: "{ useState }" },
                  { id: "2", correctAnswer: "'react'" },
                ]}
                options={[
                  "{ useState }",
                  "'react'",
                  "{ useEffect }",
                  "'./components'",
                  "React",
                ]}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">SQL Queries</p>
              <FillInTheBlankExample
                question={
                  <div className="bg-background border rounded p-3 font-mono text-sm">
                    <span className="text-muted-foreground">SELECT</span>{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    <span className="text-muted-foreground">FROM users</span>{" "}
                    <span className="text-muted-foreground">WHERE</span>{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>
                    <span className="text-muted-foreground">;</span>
                  </div>
                }
                blanks={[
                  { id: "1", correctAnswer: "*" },
                  { id: "2", correctAnswer: "status = 'active'" },
                ]}
                options={[
                  "*",
                  "name, email",
                  "id = 1",
                  "status = 'active'",
                  "ORDER BY",
                ]}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">API Endpoints</p>
              <FillInTheBlankExample
                question={
                  <div className="bg-background border rounded p-3 font-mono text-sm">
                    <span className="text-muted-foreground">GET</span>{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>
                    <span className="text-muted-foreground">/api/</span>
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>
                    <span className="text-muted-foreground">/</span>
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>
                  </div>
                }
                blanks={[
                  { id: "1", correctAnswer: "v1" },
                  { id: "2", correctAnswer: "users" },
                  { id: "3", correctAnswer: "123" },
                ]}
                options={["v1", "users", "123", "posts", "v2"]}
              />
            </div>
          </CardContent>
        </Card>

        <Card id="language-learning-style">
          <CardHeader>
            <CardTitle>Language Learning Style</CardTitle>
            <CardDescription>
              Using fill in the blank for language and terminology
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This format is excellent for testing terminology, definitions, and
              structured knowledge similar to language learning applications.
            </p>

            <div>
              <p className="text-sm font-medium mb-3">Technical Terminology</p>
              <FillInTheBlankExample
                question={
                  <div className="bg-background border rounded p-3 text-sm">
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    is a design pattern that allows objects to communicate
                    without being tightly coupled. It uses a{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    to manage the communication.
                  </div>
                }
                blanks={[
                  { id: "1", correctAnswer: "Observer Pattern" },
                  { id: "2", correctAnswer: "Subject" },
                ]}
                options={[
                  "Observer Pattern",
                  "Subject",
                  "Singleton Pattern",
                  "Observer",
                  "Factory Pattern",
                ]}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Process Flow</p>
              <FillInTheBlankExample
                question={
                  <div className="bg-background border rounded p-3 text-sm">
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    → Design →{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    → Testing →{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    → Maintenance
                  </div>
                }
                blanks={[
                  { id: "1", correctAnswer: "Planning" },
                  { id: "2", correctAnswer: "Implementation" },
                  { id: "3", correctAnswer: "Deployment" },
                ]}
                options={[
                  "Planning",
                  "Implementation",
                  "Deployment",
                  "Requirements",
                  "Documentation",
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <Card id="non-tech-examples">
          <CardHeader>
            <CardTitle>Non-Technical Use Cases</CardTitle>
            <CardDescription>
              Fill in the blank questions across different industries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Marketing Funnels</p>
              <FillInTheBlankExample
                question={
                  <div className="bg-background border rounded p-3 text-sm">
                    Awareness →{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    → Consideration →{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    → Purchase → Retention
                  </div>
                }
                blanks={[
                  { id: "1", correctAnswer: "Interest" },
                  { id: "2", correctAnswer: "Intent" },
                ]}
                options={["Interest", "Intent", "Evaluation", "Research"]}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Sales Process</p>
              <FillInTheBlankExample
                question={
                  <div className="bg-background border rounded p-3 text-sm">
                    BANT stands for{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>
                    , Authority,{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>
                    , and Timeline.
                  </div>
                }
                blanks={[
                  { id: "1", correctAnswer: "Budget" },
                  { id: "2", correctAnswer: "Need" },
                ]}
                options={["Budget", "Need", "Business", "Decision"]}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Legal Definitions</p>
              <FillInTheBlankExample
                question={
                  <div className="bg-background border rounded p-3 text-sm">
                    A{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    is a legal document that grants permission to use
                    intellectual property in exchange for{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>
                    .
                  </div>
                }
                blanks={[
                  { id: "1", correctAnswer: "License" },
                  { id: "2", correctAnswer: "Royalties" },
                ]}
                options={[
                  "License",
                  "Payment",
                  "Contract",
                  "Royalties",
                  "Agreement",
                ]}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Medical Procedures</p>
              <FillInTheBlankExample
                question={
                  <div className="bg-background border rounded p-3 text-sm">
                    Before surgery, patients must undergo{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    and provide{" "}
                    <span className="bg-yellow-100 dark:bg-yellow-900/30 px-2 py-1 rounded border-2 border-dashed border-yellow-400">
                      [blank]
                    </span>{" "}
                    consent.
                  </div>
                }
                blanks={[
                  { id: "1", correctAnswer: "Pre-operative assessment" },
                  { id: "2", correctAnswer: "Informed" },
                ]}
                options={[
                  "Pre-operative assessment",
                  "Informed",
                  "Physical examination",
                  "Written",
                  "Blood work",
                ]}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg border p-6">
          <div>
            <h3 className="mb-2 font-semibold">Explore Other Question Types</h3>
            <p className="text-muted-foreground text-sm">
              Learn about multiple choice questions for simpler answer
              selection.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs/skills-challenges/multiple-choice">
              Multiple Choice
            </Link>
          </Button>
        </div>
        <DocBuffer />
      </div>
    </DocsPageWrapper>
  );
}
