import { SkillSeedData } from "../../types";

export const typescriptSeed: SkillSeedData = {
  skills: [
    {
      skillName: "TypeScript",
      skillNormalized: "typescript",
      aliases: ["ts"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command compiles TypeScript to JavaScript?",
        options: ["tsc", "ts-build", "node ts", "tscompile"],
        correctAnswer: "tsc",
        explanation:
          "TypeScript ships with the tsc CLI to transpile .ts/.tsx files.",
      },
      associatedSkills: ["typescript"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword defines a type alias?",
        options: ["type Point = { x: number }", "alias Point", "typedef Point", "interface Point ="],
        correctAnswer: "type Point = { x: number }",
        explanation:
          "type aliases create named types that can represent unions, primitives, or object shapes.",
      },
      associatedSkills: ["typescript"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which configuration file customizes compiler options?",
        options: ["tsconfig.json", "typescript.config.js", "ts.config", "tssettings.json"],
        correctAnswer: "tsconfig.json",
        explanation:
          "tsconfig.json defines compilerOptions, include/exclude paths, module targets, etc.",
      },
      associatedSkills: ["typescript"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which operator narrows unions by checking runtime type?",
        options: ["typeof / instanceof", "??", "!", "=>"],
        correctAnswer: "typeof / instanceof",
        explanation:
          "TypeScript uses control-flow analysis with typeof/instanceof to narrow union types in conditional blocks.",
      },
      associatedSkills: ["typescript"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which utility makes all properties in a type optional?",
        options: ["Partial<T>", "Required<T>", "Pick<T, K>", "Readonly<T>"],
        correctAnswer: "Partial<T>",
        explanation:
          "Partial<T> sets each property to optional by mapping them to T[P] | undefined.",
      },
      associatedSkills: ["typescript"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the generic function signature.",
        segments: [
          { text: "function identity<", block: false },
          { text: "T", block: true },
          { text: ">(value: T): T {\n  return value;\n}", block: false },
        ],
        blocks: ["T", "K", "V"],
        correctAnswer: ["T"],
        explanation:
          "Generics use type parameters inside angle brackets (function identity<T>(...)).",
      },
      associatedSkills: ["typescript"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which compiler option ensures all files are type-checked strictly?",
        options: [
          "\"strict\": true",
          "\"noEmit\": true",
          "\"allowJs\": false",
          "\"isolatedModules\": true",
        ],
        correctAnswer: "\"strict\": true",
        explanation:
          "\"strict\": true enables the strict type-checking family (strictNullChecks, noImplicitAny, etc.).",
      },
      associatedSkills: ["typescript"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which utility extracts a subset of properties from a type?",
        options: ["Pick<Type, Keys>", "Omit<Type, Keys>", "Exclude<Type, Union>", "Record<Key, Type>"],
        correctAnswer: "Pick<Type, Keys>",
        explanation:
          "Pick<Type, Keys> constructs a type with only the specified keys from Type.",
      },
      associatedSkills: ["typescript"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which conditional type removes null and undefined from a union?",
        options: ["NonNullable<T>", "Exclude<T, null>", "Extract<T, U>", "Awaited<T>"],
        correctAnswer: "NonNullable<T>",
        explanation:
          "NonNullable<T> is defined as T extends null | undefined ? never : T, eliminating nullish values.",
      },
      associatedSkills: ["typescript"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which feature infers literal string unions from object constants?",
        options: [
          "as const assertions",
          "interface declarations",
          "type guards",
          "Tuple types",
        ],
        correctAnswer: "as const assertions",
        explanation:
          "Appending as const to objects/arrays preserves literal types (e.g., ['red','blue'] as const yields 'red' | 'blue').",
      },
      associatedSkills: ["typescript"],
    },
  ],
};
