"use client";

import { SkillCard } from "./skill-card";
import { Card, CardContent } from "@/components/ui/card";

interface SkillsGridProps {
  skills: any[];
  variant: "client" | "global";
  onUpdate?: () => void;
}

export function SkillsGrid({ skills, variant, onUpdate }: SkillsGridProps) {
  if (skills.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">
            {variant === "client"
              ? "No skills in your library yet. Browse the global library to add skills."
              : "No skills found. Try adjusting your search."}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {skills.map((skill) => (
        <SkillCard
          key={skill.id}
          skill={skill}
          variant={variant}
          onUpdate={onUpdate}
        />
      ))}
    </div>
  );
}
