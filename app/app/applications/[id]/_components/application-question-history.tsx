"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChallengeQuestionPreview } from "@/components/challenge-question-preview";
import { SkillIcon } from "@/components/skill-icon";
import { format } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";

interface ApplicationQuestionHistoryProps {
  questionHistory: Array<{
    id: string;
    questionPreview: string | null;
    skillName: string;
    skillNormalized: string;
    questionData: any;
    skillData: any;
    answer: any;
    createdAt: Date;
    question: {
      id: string;
      type: string;
      prompt: string;
      config: any;
      imageUrl: string | null;
      imageAltText: string | null;
      timeLimitSeconds: number | null;
    } | null;
  }>;
}

export function ApplicationQuestionHistory({
  questionHistory,
}: ApplicationQuestionHistoryProps) {
  if (questionHistory.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Question History</CardTitle>
          <CardDescription>
            Questions answered during this application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            No question history available for this application.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Question History</CardTitle>
          <CardDescription>
            {questionHistory.length} question
            {questionHistory.length !== 1 ? "s" : ""} answered during this
            application
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {questionHistory.map((history, index) => {
              const questionData = history.questionData;
              const answerData = history.answer;
              const isCorrect = answerData?.isCorrect ?? false;

              // Determine question type and config
              const questionType =
                history.question?.type ||
                questionData?.type ||
                (questionData?.question?.type
                  ? questionData.question.type
                  : "multiple_choice");

              const questionConfig =
                history.question?.config ||
                questionData?.config ||
                questionData?.question ||
                {};

              const questionPrompt =
                history.question?.prompt ||
                history.questionPreview ||
                questionData?.prompt ||
                questionData?.question?.question ||
                "Question preview not available";

              return (
                <Card key={history.id} className="border-2">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <SkillIcon
                          name={history.skillName}
                          className="h-5 w-5"
                        />
                        <div>
                          <CardTitle className="text-base">
                            Question {index + 1}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {history.skillName}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {answerData && (
                          <Badge
                            variant={isCorrect ? "default" : "destructive"}
                            className="gap-1.5"
                          >
                            {isCorrect ? (
                              <>
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Correct
                              </>
                            ) : (
                              <>
                                <XCircle className="h-3.5 w-3.5" />
                                Incorrect
                              </>
                            )}
                          </Badge>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(history.createdAt), "MMM d, h:mm a")}
                        </span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Question Preview with Answer Indicators */}
                    <ChallengeQuestionPreview
                      type={
                        questionType as "multiple_choice" | "fill_blank_blocks"
                      }
                      prompt={questionPrompt}
                      config={questionConfig}
                      imageUrl={history.question?.imageUrl || null}
                      imageAltText={history.question?.imageAltText || null}
                      timeLimitSeconds={
                        history.question?.timeLimitSeconds || null
                      }
                      skillName={history.skillName}
                      selectedAnswer={
                        questionType === "multiple_choice"
                          ? answerData?.selectedOption
                          : answerData?.answers
                      }
                      correctAnswer={
                        questionType === "multiple_choice"
                          ? questionConfig?.correctAnswer
                          : questionConfig?.correctAnswer
                      }
                    />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
