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
import { MultipleChoiceExample } from "../_components/question-example-multiple-choice";

export default function MultipleChoicePage() {
  return (
    <DocsPageWrapper>
      <div className="mb-12">
        <h1
          id="multiple-choice"
          className="mb-4 text-4xl font-bold tracking-tight"
        >
          Multiple Choice Questions
        </h1>
        <p className="text-muted-foreground text-lg">
          Create questions where candidates select the correct answer from
          multiple options.
        </p>
      </div>

      <div className="space-y-8">
        <Card id="overview">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
            <CardDescription>
              How multiple choice questions work
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              Multiple choice questions present a prompt with 2-5 answer
              options. Candidates must select the single correct answer. This
              format is ideal for testing knowledge, concepts, and terminology.
            </p>
            <div className="rounded-lg border bg-muted/50 p-4">
              <p className="text-sm font-medium mb-2">Key Features:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>2-5 answer options per question</li>
                <li>Only one correct answer</li>
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
              Typical multiple choice questions for technical roles
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Programming Concepts</p>
              <MultipleChoiceExample
                question={
                  <>
                    What does the React hook{" "}
                    <code className="bg-muted px-1 py-0.5 rounded text-xs">
                      useEffect
                    </code>{" "}
                    do?
                  </>
                }
                options={[
                  "Manages component lifecycle and side effects",
                  "Handles form validation",
                  "Creates new components",
                  "Manages routing",
                ]}
                correctAnswerIndex={0}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Database Knowledge</p>
              <MultipleChoiceExample
                question="What is the primary purpose of a database index?"
                options={[
                  "To improve query performance",
                  "To store backup data",
                  "To encrypt sensitive information",
                  "To validate data types",
                ]}
                correctAnswerIndex={0}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">API Design</p>
              <MultipleChoiceExample
                question="What HTTP status code indicates a successful resource creation?"
                options={[
                  "200 OK",
                  "201 Created",
                  "204 No Content",
                  "301 Moved Permanently",
                ]}
                correctAnswerIndex={1}
              />
            </div>
          </CardContent>
        </Card>

        <Card id="visual-examples">
          <CardHeader>
            <CardTitle>Visual & Image-Based Questions</CardTitle>
            <CardDescription>
              Using images to test practical knowledge
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Multiple choice questions can include images, diagrams, or
              screenshots to test visual recognition and tool familiarity.
            </p>

            <div>
              <p className="text-sm font-medium mb-3">
                Design Tool Recognition
              </p>
              <MultipleChoiceExample
                question="What tool does this icon represent, and what is its primary function?"
                options={[
                  "Clone Stamp Tool - duplicates pixels from one area",
                  "Brush Tool - paints with selected color",
                  "Eraser Tool - removes pixels",
                  "Magic Wand - selects similar colored areas",
                ]}
                correctAnswerIndex={0}
                showImage={true}
                imageAlt="PhotoShop tool icon"
              />
              <p className="text-sm text-muted-foreground mt-2 italic">
                Perfect for design roles, UI/UX positions, and creative fields
                where tool familiarity matters.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Diagram Recognition</p>
              <MultipleChoiceExample
                question="What type of relationship is shown between the Users and Orders tables?"
                options={[
                  "One-to-many relationship",
                  "Many-to-many relationship",
                  "One-to-one relationship",
                  "No relationship",
                ]}
                correctAnswerIndex={0}
                showImage={true}
                imageAlt="Database schema diagram"
              />
            </div>
          </CardContent>
        </Card>

        <Card id="code-block-examples">
          <CardHeader>
            <CardTitle>Code Block Formatting</CardTitle>
            <CardDescription>
              Include syntax-highlighted code blocks in your questions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Questions support code block formatting with syntax highlighting.
            </p>

            <div>
              <p className="text-sm font-medium mb-3">Code Output Analysis</p>
              <MultipleChoiceExample
                question={
                  <div className="space-y-3">
                    <p>What will this code output?</p>
                    <pre className="overflow-x-auto rounded-lg border bg-muted p-3 text-xs">
                      <code>{`const numbers = [1, 2, 3, 4, 5];
const result = numbers
  .filter(n => n % 2 === 0)
  .map(n => n * 2);
console.log(result);`}</code>
                    </pre>
                  </div>
                }
                options={[
                  "[2, 4, 6, 8, 10]",
                  "[4, 8]",
                  "An error",
                  "Undefined",
                ]}
                correctAnswerIndex={1}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Syntax Recognition</p>
              <MultipleChoiceExample
                question={
                  <div className="space-y-3">
                    <p>What TypeScript feature is demonstrated in this code?</p>
                    <pre className="overflow-x-auto rounded-lg border bg-muted p-3 text-xs">
                      <code>{`interface User {
  name: string;
  age?: number;
}

function greet(user: User): string {
  return \`Hello, \${user.name}\`;
}`}</code>
                    </pre>
                  </div>
                }
                options={[
                  "Optional properties and type annotations",
                  "Generic types and constraints",
                  "Union types and type guards",
                  "Decorators and metadata",
                ]}
                correctAnswerIndex={0}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">API Response Analysis</p>
              <MultipleChoiceExample
                question={
                  <div className="space-y-3">
                    <p>What HTTP status code should this endpoint return?</p>
                    <pre className="overflow-x-auto rounded-lg border bg-muted p-3 text-xs">
                      <code>{`POST /api/users
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com"
}

// User successfully created`}</code>
                    </pre>
                  </div>
                }
                options={[
                  "200 OK",
                  "201 Created",
                  "204 No Content",
                  "400 Bad Request",
                ]}
                correctAnswerIndex={1}
              />
            </div>
          </CardContent>
        </Card>

        <Card id="non-tech-examples">
          <CardHeader>
            <CardTitle>Non-Technical Use Cases</CardTitle>
            <CardDescription>
              Multiple choice questions across different industries
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-3">Marketing & Analytics</p>
              <MultipleChoiceExample
                question="What does CTR stand for in digital marketing?"
                options={[
                  "Click-Through Rate",
                  "Cost Per Transaction",
                  "Customer Target Ratio",
                  "Conversion Time Rate",
                ]}
                correctAnswerIndex={0}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Sales & CRM</p>
              <MultipleChoiceExample
                question='In a sales pipeline, what stage typically comes after "Qualification"?'
                options={[
                  "Proposal or Demo",
                  "Contract Negotiation",
                  "Closing",
                  "Onboarding",
                ]}
                correctAnswerIndex={0}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Finance & Accounting</p>
              <MultipleChoiceExample
                question="Which accounting principle requires expenses to be matched with revenues in the same period?"
                options={[
                  "Matching Principle",
                  "Revenue Recognition",
                  "Conservatism Principle",
                  "Materiality Principle",
                ]}
                correctAnswerIndex={0}
                showImage={true}
                imageAlt="Financial statement"
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Healthcare & Medical</p>
              <MultipleChoiceExample
                question="What does HIPAA stand for?"
                options={[
                  "Health Insurance Portability and Accountability Act",
                  "Healthcare Information Privacy and Access Act",
                  "Hospital Information Protection and Access Act",
                  "Health Information Privacy and Authorization Act",
                ]}
                correctAnswerIndex={0}
              />
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Legal & Compliance</p>
              <MultipleChoiceExample
                question="What type of clause is highlighted in this contract?"
                options={[
                  "Non-compete clause",
                  "Confidentiality clause",
                  "Termination clause",
                  "Indemnification clause",
                ]}
                correctAnswerIndex={0}
                showImage={true}
                imageAlt="Contract clause"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between rounded-lg border p-6">
          <div>
            <h3 className="mb-2 font-semibold">Explore Other Question Types</h3>
            <p className="text-muted-foreground text-sm">
              Learn about fill in the blank questions for more interactive
              challenges.
            </p>
          </div>
          <Button variant="outline" asChild>
            <Link href="/docs/skills-challenges/fill-in-the-blank">
              Fill in the Blank
            </Link>
          </Button>
        </div>
        <DocBuffer />
      </div>
    </DocsPageWrapper>
  );
}
