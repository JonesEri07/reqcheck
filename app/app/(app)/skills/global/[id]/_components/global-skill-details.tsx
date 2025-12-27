"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkillIcon } from "@/components/skill-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { AddToLibraryButton } from "./add-to-library-button";
import type { SkillTaxonomy, ChallengeQuestion } from "@/lib/db/schema";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { ChallengeQuestionPreview } from "@/components/challenge-question-preview";

interface GlobalSkillDetailsProps {
  skill: SkillTaxonomy;
  isInLibrary: boolean;
  clientSkillId?: string;
  questions: ChallengeQuestion[];
}

export function GlobalSkillDetails({
  skill,
  isInLibrary,
  clientSkillId,
  questions,
}: GlobalSkillDetailsProps) {
  const aliases = skill.aliases || [];
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <SkillIcon name={skill.skillName} className="w-8 h-8" />
              <div>
                <CardTitle>{skill.skillName}</CardTitle>
                <CardDescription className="mt-1">
                  Curated by reqCHECK
                </CardDescription>
              </div>
            </div>
            {isInLibrary && clientSkillId ? (
              <Button variant="secondary" size="sm" className="gap-2" asChild>
                <Link href={`/app/skills/${clientSkillId}`}>
                  <Check className="h-4 w-4" />
                  In Library
                </Link>
              </Button>
            ) : (
              <AddToLibraryButton skillTaxonomyId={skill.id} />
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {aliases.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">
                  Aliases
                </h3>
                <div className="flex flex-wrap gap-2">
                  {aliases.map((alias, index) => (
                    <Badge key={index} variant="outline">
                      {alias}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="relative">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {questions.length > 0 && questions.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => api?.scrollPrev()}
                    disabled={current === 1}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    <span className="sr-only">Previous slide</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => api?.scrollNext()}
                    disabled={current === count}
                  >
                    <ChevronRight className="h-4 w-4" />
                    <span className="sr-only">Next slide</span>
                  </Button>
                </>
              )}
              <CardTitle>Challenge Questions</CardTitle>
            </div>
            {questions.length > 0 && questions.length > 1 && (
              <span className="text-sm text-muted-foreground">
                {current} / {count}
              </span>
            )}
          </div>
          <CardDescription>
            {questions.length > 0
              ? `${questions.length} challenge question${questions.length !== 1 ? "s" : ""} available for this skill`
              : "No challenge questions available for this skill yet."}
          </CardDescription>
        </CardHeader>
        <CardContent className="max-w-full">
          {questions.length > 0 ? (
            <div className="flex">
              <Carousel
                setApi={setApi}
                opts={{
                  align: "start",
                  loop: false,
                }}
                className="w-full"
              >
                <CarouselContent className="-ml-2 md:-ml-4">
                  {questions.map((question) => (
                    <CarouselItem
                      key={question.id}
                      className="pl-2 md:pl-4 basis-full w-0 flex"
                    >
                      <ChallengeQuestionPreview
                        type={
                          question.type as
                            | "multiple_choice"
                            | "fill_blank_blocks"
                        }
                        prompt={question.prompt}
                        config={question.config as any}
                        skillName={skill.skillName}
                        className="h-full w-full"
                      />
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">
              Challenge questions from the global library will be shown here
              when available.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
