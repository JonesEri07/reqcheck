import { SkillSeedData } from "../../types";

export const csharpSeed: SkillSeedData = {
  skills: [
    {
      skillName: "C#",
      skillNormalized: "c#",
      aliases: ["csharp"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword defines a variable whose type is inferred from the initializer?",
        options: ["var", "auto", "dynamic", "let"],
        correctAnswer: "var",
        explanation:
          "var lets the compiler infer the type at compile time; the variable remains statically typed.",
      },
      associatedSkills: ["c#"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which interface enables iteration with foreach?",
        options: [
          "IEnumerable",
          "IDisposable",
          "IComparable",
          "IFormattable",
        ],
        correctAnswer: "IEnumerable",
        explanation:
          "Implementing IEnumerable (and IEnumerator) allows objects to be enumerated with foreach.",
      },
      associatedSkills: ["c#"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which statement releases unmanaged resources deterministically?",
        options: ["using (var stream = ...) { ... }", "lock(obj)", "yield return", "await Task.Delay()"],
        correctAnswer: "using (var stream = ...) { ... }",
        explanation:
          "The using statement ensures IDisposable.Dispose runs when the block exits.",
      },
      associatedSkills: ["c#"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which access modifier restricts members to the current class only?",
        options: ["private", "protected", "internal", "public"],
        correctAnswer: "private",
        explanation:
          "private members are accessible only within the same class.",
      },
      associatedSkills: ["c#"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which operator performs null-coalescing?",
        options: ["??", "?:", "??=", "?.?"],
        correctAnswer: "??",
        explanation:
          "The null-coalescing operator returns the left operand if non-null, otherwise the right operand.",
      },
      associatedSkills: ["c#"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which feature enables asynchronous methods to pause until awaited operations complete?",
        options: ["async/await", "yield return", "LINQ", "tuple deconstruction"],
        correctAnswer: "async/await",
        explanation:
          "The async modifier and await keyword build state machines that resume after awaited tasks complete.",
      },
      associatedSkills: ["c#"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which LINQ method filters a sequence based on a predicate?",
        options: ["Where", "Select", "OrderBy", "Aggregate"],
        correctAnswer: "Where",
        explanation:
          "Enumerable.Where returns elements that satisfy the predicate.",
      },
      associatedSkills: ["c#"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which keyword prevents a class from being inherited?",
        options: ["sealed", "abstract", "static", "readonly"],
        correctAnswer: "sealed",
        explanation:
          "sealed classes cannot be used as base classes, preventing further inheritance.",
      },
      associatedSkills: ["c#"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which feature allows pattern matching on object types and properties in switch expressions?",
        options: [
          "C# pattern matching (switch expression with when clauses)",
          "Dynamic dispatch",
          "Generics",
          "Extension methods",
        ],
        correctAnswer:
          "C# pattern matching (switch expression with when clauses)",
        explanation:
          "Modern switch expressions support type/relational patterns, enabling concise conditional logic.",
      },
      associatedSkills: ["c#"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which construct ensures thread-safe lazy initialization without explicit locks?",
        options: [
          "Lazy<T>",
          "Task.Run",
          "MemoryCache",
          "ConcurrentQueue",
        ],
        correctAnswer: "Lazy<T>",
        explanation:
          "Lazy<T> handles thread-safe initialization of a value the first time it’s accessed, using specified modes.",
      },
      associatedSkills: ["c#"],
    },
  ],
};
