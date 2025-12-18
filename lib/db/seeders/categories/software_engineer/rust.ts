import { SkillSeedData } from "../../types.js";

export const rustSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Rust",
      skillNormalized: "rust",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command initializes a new Rust binary project?",
        options: ["cargo new my-app", "rustc new my-app", "cargo init --lib", "rustup create"],
        correctAnswer: "cargo new my-app",
        explanation:
          "cargo new scaffolds src/main.rs and Cargo.toml for a new binary project.",
      },
      associatedSkills: ["rust"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword declares an immutable variable?",
        options: ["let", "mut", "var", "const fn"],
        correctAnswer: "let",
        explanation:
          "Variables are immutable by default with let; add mut to make them mutable.",
      },
      associatedSkills: ["rust"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package manager/download command adds a dependency?",
        options: ["cargo add serde", "rustup add serde", "npm install serde", "cargo install serde"],
        correctAnswer: "cargo add serde",
        explanation:
          "cargo add (from cargo-edit) updates Cargo.toml dependencies; cargo install installs binaries.",
      },
      associatedSkills: ["rust"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which macro prints to stdout with a newline?",
        options: ["println!", "print!", "format!", "dbg!"],
        correctAnswer: "println!",
        explanation:
          "println! formats arguments and writes to stdout terminated with a newline.",
      },
      associatedSkills: ["rust"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which ownership rule prevents double-free bugs?",
        options: [
          "Values have a single owner; moving transfers ownership",
          "Garbage collector frees automatically",
          "Reference counting for all types",
          "Manual free() required",
        ],
        correctAnswer: "Values have a single owner; moving transfers ownership",
        explanation:
          "Rust's ownership system enforces a single owner per value; move semantics prevent use-after-free.",
      },
      associatedSkills: ["rust"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the Result-returning function signature.",
        segments: [
          { text: "fn read_config() -> ", block: false },
          { text: "Result<String, std::io::Error>", block: true },
          { text: " {\n  std::fs::read_to_string(\"config.toml\")\n}", block: false },
        ],
        blocks: [
          "Result<String, std::io::Error>",
          "Option<String>",
          "String",
        ],
        correctAnswer: ["Result<String, std::io::Error>"],
        explanation:
          "Returning Result<T, E> conveys success/error; std::fs::read_to_string already returns this type.",
      },
      associatedSkills: ["rust"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which trait must a type implement to be printable with {:?}?",
        options: ["Debug", "Display", "Clone", "Copy"],
        correctAnswer: "Debug",
        explanation:
          "The {:?} formatter requires Debug; derive(Debug) implements it automatically for most structs.",
      },
      associatedSkills: ["rust"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "What does the ? operator do inside a function returning Result?",
        options: [
          "Propagates errors by early-returning Err",
          "Unwraps values ignoring errors",
          "Converts Option to Result",
          "Performs pattern matching",
        ],
        correctAnswer: "Propagates errors by early-returning Err",
        explanation:
          "The ? operator returns Err early if present, otherwise yields the Ok value, simplifying error handling.",
      },
      associatedSkills: ["rust"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which concurrency primitive allows threads to share data safely via atomic reference counting?",
        options: ["Arc<T>", "Rc<T>", "Mutex<T>", "Cell<T>"],
        correctAnswer: "Arc<T>",
        explanation:
          "Arc<T> is a thread-safe reference-counted pointer (atomic); Rc<T> is not thread safe.",
      },
      associatedSkills: ["rust"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which keyword enables trait objects for dynamic dispatch?",
        options: ["dyn", "impl", "trait", "mut"],
        correctAnswer: "dyn",
        explanation:
          "Trait objects use dyn Trait (e.g., Box<dyn Write>) to enable dynamic dispatch at runtime.",
      },
      associatedSkills: ["rust"],
    },
  ],
};
