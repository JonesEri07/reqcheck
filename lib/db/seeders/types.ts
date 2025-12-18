// Type definitions for seed data

export interface SkillDefinition {
  skillName: string;
  skillNormalized: string;
  aliases: string[];
  categorySlug?: string;
}

export interface QuestionDefinition {
  difficulty: "easy" | "medium" | "hard";
  question: {
    type: "multiple_choice" | "fill_blank_blocks";
    question: string;
    options?: string[];
    segments?: { text: string; block: boolean }[];
    blocks?: string[];
    correctAnswer: string | string[];
    explanation: string;
  };
  associatedSkills: string[];
}

export interface SkillSeedData {
  skills: SkillDefinition[];
  questions: QuestionDefinition[];
}
