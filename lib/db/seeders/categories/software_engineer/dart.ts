import { SkillSeedData } from "../../types.js";

export const dartSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Dart",
      skillNormalized: "dart",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword declares a variable whose value cannot change after assignment?",
        options: ["final", "var", "late", "dynamic"],
        correctAnswer: "final",
        explanation:
          "final variables are initialized once and cannot be reassigned, while var can be reassigned.",
      },
      associatedSkills: ["dart"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does the trailing ? denote in a Dart type such as String??",
        options: [
          "The type is nullable",
          "The type is dynamic",
          "It is a list",
          "It refers to a generic",
        ],
        correctAnswer: "The type is nullable",
        explanation:
          "With sound null safety, adding ? makes a type nullable; otherwise variables must hold non-null values.",
      },
      associatedSkills: ["dart"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which statement prints to the console?",
        options: ["print('Hello');", "console.log('Hello');", "System.out('Hello');", "log('Hello')"],
        correctAnswer: "print('Hello');",
        explanation:
          "Dart uses the print function for stdout in both CLI and Flutter apps.",
      },
      associatedSkills: ["dart"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which collection literal creates a growable list?",
        options: [
          "[1, 2, 3]",
          "{'a': 1}",
          "Set.of([1,2])",
          "<int>{}",
        ],
        correctAnswer: "[1, 2, 3]",
        explanation:
          "Square brackets create List literals; by default they are growable unless declared const.",
      },
      associatedSkills: ["dart"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you import another Dart file from lib/services/auth.dart?",
        options: [
          "import 'package:project/services/auth.dart';",
          "import './services/auth';",
          "require('services/auth.dart');",
          "use services.auth;",
        ],
        correctAnswer: "import 'package:project/services/auth.dart';",
        explanation:
          "Package-style imports resolve to lib/ paths and are recommended for shared modules.",
      },
      associatedSkills: ["dart"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the async function that awaits an HTTP call.",
        segments: [
          { text: "Future<String> loadUser() async {\n  final response = await ", block: false },
          { text: "http.get", block: true },
          { text: "(", block: false },
          { text: "Uri.parse", block: true },
          { text: "(\"https://api.dev/user\"));\n  return response.body;\n}", block: false },
        ],
        blocks: ["http.get", "http.post", "Uri.parse", "Uri.http"],
        correctAnswer: ["http.get", "Uri.parse"],
        explanation:
          "http.get returns a Future<Response>, and Uri.parse constructs a URI object from a string.",
      },
      associatedSkills: ["dart"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which mixin syntax lets a class share reusable method implementations?",
        options: [
          "class MyWidget with TapHandler {}",
          "class MyWidget extends mixin TapHandler {}",
          "class MyWidget implements TapHandler only",
          "mixin MyWidget on TapHandler {}",
        ],
        correctAnswer: "class MyWidget with TapHandler {}",
        explanation:
          "The with keyword composes mixins into a class, giving access to their methods and fields.",
      },
      associatedSkills: ["dart"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which statement is true about Streams in Dart?",
        options: [
          "They deliver asynchronous sequences of values over time",
          "They are the same as Futures",
          "They cannot be transformed",
          "They must always be broadcast",
        ],
        correctAnswer: "They deliver asynchronous sequences of values over time",
        explanation:
          "Streams emit multiple events, unlike Futures which deliver a single value; you can transform or listen to them.",
      },
      associatedSkills: ["dart"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To perform heavy CPU work without blocking the main isolate, what should you use?",
        options: ["Spawn a new Isolate", "Use compute() synchronously", "Wrap in Future.delayed", "Call Timer.run"],
        correctAnswer: "Spawn a new Isolate",
        explanation:
          "Isolates run in separate memory heaps and are the Dart primitive for parallel CPU-bound work.",
      },
      associatedSkills: ["dart"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which feature allows you to create type-safe APIs that still accept generic type parameters with constraints?",
        options: [
          "Generics with extends bounds (List<T extends num>)",
          "late final",
          "Cascade notation",
          "Extension methods",
        ],
        correctAnswer: "Generics with extends bounds (List<T extends num>)",
        explanation:
          "Adding extends to a type parameter restricts acceptable types while preserving compile-time safety.",
      },
      associatedSkills: ["dart"],
    },
  ],
};
