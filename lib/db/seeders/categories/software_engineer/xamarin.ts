import { SkillSeedData } from "../../types";

export const xamarinSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Xamarin",
      skillNormalized: "xamarin",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which language is primarily used for Xamarin apps?",
        options: ["C#", "Java", "Swift", "Kotlin"],
        correctAnswer: "C#",
        explanation:
          "Xamarin uses the .NET runtime and C# to target iOS, Android, and Windows.",
      },
      associatedSkills: ["xamarin"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which UI framework provides shared UI components in Xamarin?",
        options: ["Xamarin.Forms", "SwiftUI", "Jetpack Compose", "React Native"],
        correctAnswer: "Xamarin.Forms",
        explanation:
          "Xamarin.Forms (evolving into .NET MAUI) lets developers define shared UI markup rendered natively.",
      },
      associatedSkills: ["xamarin"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Microsoft toolchain builds Xamarin apps on Windows?",
        options: ["Visual Studio with Xamarin workload", "Xcode", "Android Studio", "VS Code only"],
        correctAnswer: "Visual Studio with Xamarin workload",
        explanation:
          "Visual Studio (Windows/macOS) installs Xamarin workload for building and debugging mobile apps.",
      },
      associatedSkills: ["xamarin"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which project type shares business logic without shared UI?",
        options: ["Xamarin.Native projects (iOS/Android)", "Xamarin.Forms", "MAUI class library", "UWP app"],
        correctAnswer: "Xamarin.Native projects (iOS/Android)",
        explanation:
          "Xamarin.iOS/Xamarin.Android share C# business logic but use native UI frameworks.",
      },
      associatedSkills: ["xamarin"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which pattern is commonly used for state management in Xamarin.Forms?",
        options: ["MVVM", "MVC", "Flux", "BLoC"],
        correctAnswer: "MVVM",
        explanation:
          "Xamarin.Forms encourages MVVM with data binding between ViewModels and XAML views.",
      },
      associatedSkills: ["xamarin"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the XAML snippet binding a Label to a ViewModel property.",
        segments: [
          { text: "<Label Text=\"{Binding ", block: false },
          { text: "Title", block: true },
          { text: "}\" />", block: false },
        ],
        blocks: ["Title", "title", "text"],
        correctAnswer: ["Title"],
        explanation:
          "XAML binds UI elements to ViewModel properties using {Binding PropertyName}.",
      },
      associatedSkills: ["xamarin"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which tool packages Xamarin.Android apps?",
        options: ["MSBuild / dotnet build", "Gradle CLI", "xcodebuild", "webpack"],
        correctAnswer: "MSBuild / dotnet build",
        explanation:
          "dotnet build / MSBuild produce APK/AAB packages using Xamarin.Android tooling.",
      },
      associatedSkills: ["xamarin"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which service compiles iOS builds from Windows machines?",
        options: ["Pair to Mac build host", "Azure DevOps only", "Local simulator", "Android emulator"],
        correctAnswer: "Pair to Mac build host",
        explanation:
          "Xamarin requires macOS for iOS compilation; Visual Studio pairs to a Mac build host over the network.",
      },
      associatedSkills: ["xamarin"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which approach shares platform-specific functionality (camera, sensors) with shared code?",
        options: [
          "DependencyService / platform-specific dependency injection",
          "Global static singletons",
          "Reflection on platform assemblies",
          "XAML behaviors only",
        ],
        correctAnswer: "DependencyService / platform-specific dependency injection",
        explanation:
          "Xamarin.Forms uses DependencyService or built-in DI to resolve platform-specific implementations at runtime.",
      },
      associatedSkills: ["xamarin"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which evolution of Xamarin.Forms unifies project structure under .NET 7+?",
        options: [".NET MAUI", "Blazor Hybrid", "React Native", "Flutter"],
        correctAnswer: ".NET MAUI",
        explanation:
          ".NET Multi-platform App UI (MAUI) succeeds Xamarin.Forms, consolidating iOS/Android/Windows/macOS projects under a single .NET SDK.",
      },
      associatedSkills: ["xamarin"],
    },
  ],
};
