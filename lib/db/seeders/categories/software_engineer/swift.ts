import { SkillSeedData } from "../../types.js";

export const swiftSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Swift",
      skillNormalized: "swift",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs a Swift script?",
        options: ["swift main.swift", "swiftc --run main.swift", "swift run main.swift", "swift exec main"],
        correctAnswer: "swift main.swift",
        explanation:
          "swift filename.swift executes the script/interprets Swift code; swiftc compiles to binaries.",
      },
      associatedSkills: ["swift"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword declares a constant?",
        options: ["let", "var", "const", "static"],
        correctAnswer: "let",
        explanation:
          "Swift uses let for constants and var for mutable variables.",
      },
      associatedSkills: ["swift"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package manager builds server-side Swift projects?",
        options: ["Swift Package Manager (swift build)", "CocoaPods", "Gradle", "Cargo"],
        correctAnswer: "Swift Package Manager (swift build)",
        explanation:
          "Swift Package Manager (SPM) uses Package.swift and commands like swift build/test/run.",
      },
      associatedSkills: ["swift"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which UI framework builds iOS interfaces with declarative syntax?",
        options: ["SwiftUI", "UIKit only", "Jetpack Compose", "React"],
        correctAnswer: "SwiftUI",
        explanation:
          "SwiftUI provides declarative views for Apple platforms; UIKit/APPKit remain for imperative UI.",
      },
      associatedSkills: ["swift"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword introduces protocol conformance?",
        options: ["struct User: Codable", "struct User implements Codable", "struct User extends Codable", "struct User inherits Codable"],
        correctAnswer: "struct User: Codable",
        explanation:
          "Protocols are adopted with a colon (struct User: Codable, Identifiable).",
      },
      associatedSkills: ["swift"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the async/await networking example.",
        segments: [
          { text: "let (data, _) = try await URLSession.shared.", block: false },
          { text: "data", block: true },
          { text: "(for: request)", block: false },
        ],
        blocks: ["data", "fetch", "download"],
        correctAnswer: ["data"],
        explanation:
          "URLSession.shared.data(for:) returns data/response asynchronously when using async/await.",
      },
      associatedSkills: ["swift"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which property wrapper stores a value observable by SwiftUI views?",
        options: ["@State", "@Binding", "@ObservedObject", "@EnvironmentObject"],
        correctAnswer: "@State",
        explanation:
          "@State creates view-local state. @Binding exposes state references, and ObservedObject/EnvironmentObject handle external models.",
      },
      associatedSkills: ["swift"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which concurrency primitive isolates mutable state to avoid data races?",
        options: ["Actors", "DispatchQueue.main.async", "OperationQueue", "NSThread"],
        correctAnswer: "Actors",
        explanation:
          "Swift actors serialize access to their mutable state, preventing data races in concurrent code.",
      },
      associatedSkills: ["swift"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which attribute exposes asynchronous sequences via AsyncSequence?",
        options: [
          "AsyncStream/AsyncThrowingStream",
          "Combine Publisher",
          "DispatchSource",
          "NotificationCenter",
        ],
        correctAnswer: "AsyncStream/AsyncThrowingStream",
        explanation:
          "AsyncStream bridges callback-based APIs into AsyncSequence, enabling async for-await loops.",
      },
      associatedSkills: ["swift"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which feature marks APIs as available only on certain platforms or OS versions?",
        options: [
          "@available(iOS 16, *)",
          "#if os(iOS)",
          "@platform(iOS)",
          "@requires(iOS16)",
        ],
        correctAnswer: "@available(iOS 16, *)",
        explanation:
          "@available attributes declare platform/OS minimums, letting the compiler enforce runtime availability checks.",
      },
      associatedSkills: ["swift"],
    },
  ],
};
