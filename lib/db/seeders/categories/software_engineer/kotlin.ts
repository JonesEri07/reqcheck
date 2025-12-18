import { SkillSeedData } from "../../types.js";

export const kotlinSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Kotlin",
      skillNormalized: "kotlin",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword declares an immutable variable in Kotlin?",
        options: ["val", "var", "let", "const"],
        correctAnswer: "val",
        explanation:
          "val references cannot be reassigned (similar to final), whereas var allows reassignment.",
      },
      associatedSkills: ["kotlin"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function prints to the console?",
        options: ["println(\"Hello\")", "System.out.println()", "console.log()", "printLine()"],
        correctAnswer: "println(\"Hello\")",
        explanation:
          "println is part of Kotlin's standard library for writing to stdout.",
      },
      associatedSkills: ["kotlin"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does the ? suffix indicate in a Kotlin type?",
        options: ["The type is nullable", "The type is generic", "The value is optional like Swift", "It’s a suspend function"],
        correctAnswer: "The type is nullable",
        explanation:
          "String? allows null references; plain String enforces non-null values under Kotlin's null-safety.",
      },
      associatedSkills: ["kotlin"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which construct iterates over a list?",
        options: [
          "for (item in items)",
          "foreach(item in items)",
          "items.forLoop",
          "loop items",
        ],
        correctAnswer: "for (item in items)",
        explanation:
          "Kotlin uses for-in loops and supports sequences, ranges, and destructuring in loops.",
      },
      associatedSkills: ["kotlin"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which data type represents a read-only list?",
        options: ["List<T>", "MutableList<T>", "ArrayList<T>", "LinkedList<T>"],
        correctAnswer: "List<T>",
        explanation:
          "List<T> is immutable, while MutableList<T> supports add/remove operations.",
      },
      associatedSkills: ["kotlin"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the extension function that capitalizes the first letter of a string.",
        segments: [
          { text: "fun String.", block: false },
          { text: "capitalizeFirst", block: true },
          { text: "(): String {\n  if (this.isEmpty()) return this\n  return this[0].uppercaseChar() + substring(1)\n}", block: false },
        ],
        blocks: ["capitalizeFirst", "capitalize", "titleCase"],
        correctAnswer: ["capitalizeFirst"],
        explanation:
          "Extension functions are declared as fun ReceiverType.functionName(); String receivers can add custom helpers.",
      },
      associatedSkills: ["kotlin"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which coroutine builder launches work that doesn't return a result?",
        options: ["launch", "async", "runBlocking", "withContext"],
        correctAnswer: "launch",
        explanation:
          "launch returns a Job for fire-and-forget work; async returns Deferred for result retrieval.",
      },
      associatedSkills: ["kotlin"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which keyword injects dependencies by delegating property initialization?",
        options: ["by", "delegate", "lateinit", "inject"],
        correctAnswer: "by",
        explanation:
          "The by keyword delegates property behavior (e.g., lazy, observable, or custom delegates).",
      },
      associatedSkills: ["kotlin"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which feature ensures exhaustive handling of sealed class subclasses when used with when expressions?",
        options: [
          "Sealed classes with when expression",
          "Inline classes",
          "Enum classes only",
          "Data classes",
        ],
        correctAnswer: "Sealed classes with when expression",
        explanation:
          "Kotlin enforces exhaustiveness for when expressions covering all sealed class subtypes without needing else.",
      },
      associatedSkills: ["kotlin"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "In multiplatform projects, which construct shares code across JVM, JS, and native targets?",
        options: [
          "expect/actual declarations",
          "Platform-specific modules only",
          "Java interop only",
          "External modules",
        ],
        correctAnswer: "expect/actual declarations",
        explanation:
          "expect/actual pairs declare common APIs with platform-specific implementations, enabling code sharing across targets.",
      },
      associatedSkills: ["kotlin"],
    },
  ],
};
