"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, X } from "lucide-react";
import type { MultipleChoiceQuestion } from "@/challenge-question-types";

interface MultipleChoiceFormProps {
  value: MultipleChoiceQuestion;
  onChange: (value: MultipleChoiceQuestion) => void;
  error?: string;
}

export function MultipleChoiceForm({
  value,
  onChange,
  error,
}: MultipleChoiceFormProps) {
  const [options, setOptions] = useState<string[]>(
    value.options.length > 0 ? value.options : [""]
  );

  const handleOptionChange = (index: number, newValue: string) => {
    const newOptions = [...options];
    newOptions[index] = newValue;
    setOptions(newOptions);
    const validOptions = newOptions.filter((opt) => opt.trim() !== "");

    // If the changed option was the correct answer, update or clear it
    const oldOptionTrimmed = options[index].trim();
    const newValueTrimmed = newValue.trim();
    let newCorrectAnswer = value.correctAnswer;

    if (oldOptionTrimmed === value.correctAnswer) {
      if (newValueTrimmed === "") {
        // Option was correct answer and is now empty, clear correct answer
        newCorrectAnswer = "";
      } else {
        // Option was correct answer and text changed, update correct answer
        newCorrectAnswer = newValueTrimmed;
      }
    }

    onChange({
      options: validOptions,
      correctAnswer: newCorrectAnswer,
    });
  };

  const handleAddOption = () => {
    const newOptions = [...options, ""];
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions.length > 0 ? newOptions : [""]);

    // If removed option was the correct answer, clear it
    const removedOptionTrimmed = options[index].trim();
    if (value.correctAnswer === removedOptionTrimmed) {
      onChange({
        options: newOptions.filter((opt) => opt.trim() !== ""),
        correctAnswer: "",
      });
    } else {
      onChange({
        options: newOptions.filter((opt) => opt.trim() !== ""),
        correctAnswer: value.correctAnswer,
      });
    }
  };

  const handleCorrectAnswerChange = (answer: string) => {
    onChange({
      ...value,
      correctAnswer: answer,
    });
  };

  const validOptions = options.filter((opt) => opt.trim() !== "");
  const maxOptionsReached = options.length >= 8;

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Answer Options</Label>
        <p className="text-sm text-muted-foreground">
          Add at least 2 options (maximum 8). Select which one is the correct
          answer.
        </p>
      </div>

      <RadioGroup
        value={value.correctAnswer}
        onValueChange={handleCorrectAnswerChange}
      >
        <div className="space-y-3">
          {options.map((option, index) => {
            const optionValue = option.trim();
            const isValidOption = optionValue !== "";

            return (
              <div key={index} className="flex items-center gap-2">
                <div className="flex-shrink-0">
                  <RadioGroupItem
                    value={optionValue}
                    id={`option-${index}`}
                    disabled={!isValidOption}
                  />
                </div>
                <Input
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                {options.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveOption(index)}
                    className="flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </RadioGroup>

      <div className="space-y-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddOption}
          disabled={maxOptionsReached}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Option
        </Button>
        {maxOptionsReached && (
          <p className="text-sm text-muted-foreground">
            Maximum of 8 options reached. Remove an option to add another.
          </p>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {validOptions.length < 2 && (
        <p className="text-sm text-muted-foreground">
          Add at least 2 options to continue
        </p>
      )}
    </div>
  );
}
