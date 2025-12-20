import { SkillSeedData } from "../../types";

export const haskellSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Haskell",
      skillNormalized: "haskell",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword defines a function in Haskell?",
        options: ["=", "def", "function", "fun"],
        correctAnswer: "=",
        explanation:
          "Haskell functions are defined by writing f x = expression; the equals sign binds the definition.",
      },
      associatedSkills: ["haskell"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which operator composes two functions?",
        options: [".", "++", ">>", "<*>"],
        correctAnswer: ".",
        explanation:
          "The (.) operator composes functions right-to-left: (f . g) x == f (g x).",
      },
      associatedSkills: ["haskell"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does the :: operator denote?",
        options: [
          "Type annotation",
          "List concatenation",
          "Pattern match",
          "Module import",
        ],
        correctAnswer: "Type annotation",
        explanation:
          "value :: Type declares the type signature of a function or expression.",
      },
      associatedSkills: ["haskell"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function applies another function to every element of a list?",
        options: ["map", "foldr", "filter", "concat"],
        correctAnswer: "map",
        explanation:
          "map :: (a -> b) -> [a] -> [b] transforms each element without mutating the original list.",
      },
      associatedSkills: ["haskell"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which tool loads Haskell modules interactively?",
        options: ["ghci", "stack run", "cabal build", "npm start"],
        correctAnswer: "ghci",
        explanation:
          "GHCi is the interactive REPL for Haskell, allowing you to load modules and evaluate expressions.",
      },
      associatedSkills: ["haskell"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the type signature of a polymorphic Maybe helper.",
        segments: [
          { text: "maybeMap :: (a -> b) -> Maybe a -> ", block: false },
          { text: "Maybe b", block: true },
          { text: "\n", block: false },
        ],
        blocks: ["Maybe b", "Either b", "b"],
        correctAnswer: ["Maybe b"],
        explanation:
          "Mapping over Maybe keeps the Maybe context, returning Just (f a) or Nothing.",
      },
      associatedSkills: ["haskell"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which monad is typically used for sequencing IO operations?",
        options: ["IO", "State", "Reader", "Writer"],
        correctAnswer: "IO",
        explanation:
          "The IO monad encapsulates side effects; do notation sequences IO actions deterministically.",
      },
      associatedSkills: ["haskell"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which language extension allows type-safe generics on data declarations?",
        options: [
          "DeriveGeneric",
          "StrictData",
          "OverloadedStrings",
          "NoImplicitPrelude",
        ],
        correctAnswer: "DeriveGeneric",
        explanation:
          "DeriveGeneric lets the compiler auto-derive instances for the Generic class, useful for serialization libraries.",
      },
      associatedSkills: ["haskell"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To ensure constant-space right folds over large lists, which function should you prefer?",
        options: ["foldl'", "foldl", "foldr", "scanl"],
        correctAnswer: "foldl'",
        explanation:
          "foldl' (from Data.List) is the strict variant that avoids building large thunks, preventing space leaks.",
      },
      associatedSkills: ["haskell"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which concurrency primitive allows lightweight threads to communicate via shared variables with transactional semantics?",
        options: ["STM (Software Transactional Memory)", "MVars", "Chan", "TMVar only"],
        correctAnswer: "STM (Software Transactional Memory)",
        explanation:
          "STM lets you compose transactions over TVars atomically, avoiding locks and deadlocks in concurrent programs.",
      },
      associatedSkills: ["haskell"],
    },
  ],
};
