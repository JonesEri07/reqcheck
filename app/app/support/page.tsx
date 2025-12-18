"use client";

import { useState, useMemo } from "react";
import { ContentHeader } from "@/components/content-header";
import { Page } from "@/components/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Bug, Lightbulb, Headphones, Search } from "lucide-react";
import Link from "next/link";

interface FAQItem {
  question: string;
  answer: string;
  category?: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How do I create a new job posting?",
    answer:
      "Navigate to the Jobs page and click 'Create Job'. Fill in the job title, description, and select the required skills. You can use the auto-detect feature to automatically identify skills from the job description, or manually add skills from your library.",
    category: "Jobs",
  },
  {
    question: "How do I add skills to my library?",
    answer:
      "Go to the Skills page and browse the global skill library. Click 'Add' on any skill to add it to your library with pre-configured challenge questions. You can also create custom skills by clicking 'Create Skill' and adding your own challenge questions.",
    category: "Skills",
  },
  {
    question: "How does the widget integration work?",
    answer:
      "The widget integration allows you to embed skill verification challenges directly into your ATS or job board. Go to the Widget Integration page and use the interactive decision tree to get your personalized integration code. Add the provided code snippet to your job posting pages.",
    category: "Integration",
  },
  {
    question: "What happens when a candidate completes a challenge?",
    answer:
      "When a candidate completes a challenge, their results are automatically recorded and an application is created. You'll see their application status (passed/failed), scores, and detailed responses in the Applications page. Failed applications are automatically filtered out to prevent spam and unqualified candidates.",
    category: "Applications",
  },
  {
    question: "Can I customize challenge questions?",
    answer:
      "Yes! You can create custom challenge questions for any skill in your library. Navigate to a skill's detail page, click 'Create Challenge', and choose between multiple-choice or fill-in-the-blank question types. You can also edit existing questions by clicking on them.",
    category: "Skills",
  },
  {
    question: "How do I view application results?",
    answer:
      "Visit the Applications page to see all candidate submissions. Click on any application to view detailed results, including individual question responses, scores, and completion time. You can also filter by job, status, or date. Click on a candidate's email to see all their applications across different jobs.",
    category: "Applications",
  },
  {
    question: "What is the difference between FREE and PRO plans?",
    answer:
      "The FREE plan includes 10 questions per skill, 10 total custom questions, 10 jobs, and 50 applications per month. The PRO plan offers 50 questions per skill, 500 total custom questions, 100 jobs, and 500 applications per month, plus integrations with ATS systems like Greenhouse. Check the Pricing page for detailed feature comparisons.",
    category: "Billing",
  },
  {
    question: "How do I whitelist domains for the widget?",
    answer:
      "Go to Settings > Configuration and scroll to the Whitelist URLs section. Add the domains (one per line) where you want to allow the widget to be embedded. This helps prevent unauthorized use of your widget on other sites. URLs must be valid HTTP/HTTPS URLs.",
    category: "Configuration",
  },
  {
    question: "Can I export application data?",
    answer:
      "Currently, application data can be viewed in the dashboard and applications pages. Export functionality is coming soon in a future update. Contact support if you need bulk data access or have specific export requirements.",
    category: "Data",
  },
  {
    question: "How do I connect integrations like Greenhouse?",
    answer:
      "Go to the Integrations page and click on the integration you want to connect (e.g., Greenhouse). Enter your API credentials and configure sync settings including sync frequency and behavior. You can set up post-fetch filters to only sync jobs that meet certain criteria, such as jobs that contain specific skills.",
    category: "Integration",
  },
];

export default function SupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showFeatureDialog, setShowFeatureDialog] = useState(false);

  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) {
      return FAQ_ITEMS;
    }
    const query = searchQuery.toLowerCase();
    return FAQ_ITEMS.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category?.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleFeatureRequest = () => {
    setShowFeatureDialog(true);
  };

  const handleFeatureRequestConfirm = () => {
    window.open(
      "https://cire-studios.moxieapp.com/public/reqcheck-feature-request",
      "_blank",
      "noopener,noreferrer"
    );
    setShowFeatureDialog(false);
  };

  return (
    <Page>
      <ContentHeader
        title="Support"
        subtitle="Get help, report issues, or request new features. Check our FAQ below before submitting a report."
      />
      <div className="space-y-8">
        {/* Support Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Bug Report Card */}
          <Card
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() =>
              window.open(
                "https://cire-studios.moxieapp.com/public/reqcheck-report-bug",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Bug className="h-5 w-5 text-destructive" />
                <CardTitle>Bug Report</CardTitle>
              </div>
              <CardDescription>
                Report a bug or issue you've encountered
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Feature Request Card */}
          <Card
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={handleFeatureRequest}
          >
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                <CardTitle>Feature Request</CardTitle>
              </div>
              <CardDescription>
                Suggest a new feature or improvement
              </CardDescription>
            </CardHeader>
          </Card>

          {/* Contact Support Card */}
          <Card
            className="cursor-pointer hover:bg-accent transition-colors"
            onClick={() =>
              window.open(
                "https://cire-studios.moxieapp.com/public/30-minute-support",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
          <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <Headphones className="h-5 w-5 text-primary" />
                <CardTitle>Contact Support</CardTitle>
              </div>
            <CardDescription>
                Schedule time to work with a representative
            </CardDescription>
          </CardHeader>
        </Card>
        </div>

        {/* FAQ Section */}
        <div className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-muted-foreground mb-4">
              Search for answers to common questions before submitting a report
            </p>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search FAQs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground border rounded-lg">
              <p>No FAQs found matching your search</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {filteredFAQs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="text-left hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-2">
                      <p className="text-muted-foreground">{faq.answer}</p>
                      {faq.category && (
                        <p className="text-xs text-muted-foreground mt-2">
                          Category: {faq.category}
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </div>
      </div>

      {/* Feature Request Confirmation Dialog */}
      <AlertDialog open={showFeatureDialog} onOpenChange={setShowFeatureDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Check Roadmap First</AlertDialogTitle>
            <AlertDialogDescription>
              Before submitting a feature request, please check our roadmap to
              see if your feature is already planned or in development.{" "}
              <Link
                href="/roadmap"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:no-underline"
              >
                View Roadmap
              </Link>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleFeatureRequestConfirm}>
              Yes, I've checked the roadmap
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Page>
  );
}
