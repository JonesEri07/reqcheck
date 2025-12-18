import { SkillSeedData } from "../../types.js";

export const cppSeed: SkillSeedData = {
  skills: [
    {
      skillName: "C++",
      skillNormalized: "c++",
      aliases: ["cpp", "cplusplus"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the statement that prints Hello World to stdout.",
        segments: [
          { text: "#include <iostream>\n\nint main() {\n  ", block: false },
          { text: "std::cout", block: true },
          { text: " << \"Hello World\"", block: false },
          { text: ";", block: false },
          { text: "\n  return 0;\n}", block: false },
        ],
        blocks: ["std::cout", "std::cin", "printf", "std::cerr"],
        correctAnswer: ["std::cout"],
        explanation:
          "std::cout from <iostream> writes to stdout using operator<< syntax.",
      },
      associatedSkills: ["c++"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which header provides std::vector?",
        options: ["<vector>", "<array>", "<list>", "<deque>"],
        correctAnswer: "<vector>",
        explanation:
          "std::vector is defined in the <vector> header in the C++ Standard Library.",
      },
      associatedSkills: ["c++"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword initializes a constructor delegation list?",
        options: [" : ", "::", "->", "="],
        correctAnswer: " : ",
        explanation:
          "The member initializer list uses a colon to initialize base classes and members before the constructor body.",
      },
      associatedSkills: ["c++"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which smart pointer expresses unique ownership?",
        options: [
          "std::unique_ptr<T>",
          "std::shared_ptr<T>",
          "std::weak_ptr<T>",
          "std::auto_ptr<T>",
        ],
        correctAnswer: "std::unique_ptr<T>",
        explanation:
          "unique_ptr enforces exclusive ownership and deletes the resource when it goes out of scope.",
      },
      associatedSkills: ["c++"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword prevents implicit conversions on a constructor?",
        options: ["explicit", "constexpr", "mutable", "inline"],
        correctAnswer: "explicit",
        explanation:
          "Marking a constructor explicit prevents the compiler from using it for implicit conversions.",
      },
      associatedSkills: ["c++"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which cast converts a pointer up or down the inheritance hierarchy with runtime checking?",
        options: [
          "dynamic_cast",
          "static_cast",
          "reinterpret_cast",
          "const_cast",
        ],
        correctAnswer: "dynamic_cast",
        explanation:
          "dynamic_cast performs safe downcasts/upcasts on polymorphic types and returns nullptr on failure.",
      },
      associatedSkills: ["c++"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which feature enables compile-time polymorphism via templates?",
        options: ["Function templates", "Virtual functions", "Operator overloading", "Lambda expressions"],
        correctAnswer: "Function templates",
        explanation:
          "Templates allow writing generic functions/classes instantiated with different types at compile time.",
      },
      associatedSkills: ["c++"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which standard header provides threading primitives like std::thread?",
        options: ["<thread>", "<future>", "<mutex>", "<condition_variable>"],
        correctAnswer: "<thread>",
        explanation:
          "The <thread> header defines std::thread and related utilities for launching OS threads.",
      },
      associatedSkills: ["c++"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which rule expresses that if a class defines a destructor, copy constructor, or copy assignment, it likely needs all three (or none)?",
        options: [
          "Rule of Three/Five",
          "Rule of Zero",
          "Law of Demeter",
          "Liskov Substitution Principle",
        ],
        correctAnswer: "Rule of Three/Five",
        explanation:
          "The Rule of Three/Five reminds developers to define appropriate special member functions when managing resources manually.",
      },
      associatedSkills: ["c++"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which concurrency primitive protects shared data by blocking other threads?",
        options: ["std::mutex", "std::promise", "std::chrono", "std::vector"],
        correctAnswer: "std::mutex",
        explanation:
          "std::mutex provides mutual exclusion; std::lock_guard/unique_lock manage its lock/unlock lifetime.",
      },
      associatedSkills: ["c++"],
    },
  ],
};
