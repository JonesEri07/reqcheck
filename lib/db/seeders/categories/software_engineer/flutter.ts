import { SkillSeedData } from "../../types.js";

export const flutterSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Flutter",
      skillNormalized: "flutter",
      aliases: ["dart flutter"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command creates a new Flutter project?",
        options: [
          "flutter create my_app",
          "flutter init my_app",
          "dart create flutter",
          "flutter new project",
        ],
        correctAnswer: "flutter create my_app",
        explanation:
          "flutter create scaffolds lib/main.dart, platform folders, and configuration files.",
      },
      associatedSkills: ["flutter"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which widget renders text on screen?",
        options: ["Text", "Container", "Scaffold", "Column"],
        correctAnswer: "Text",
        explanation:
          "The Text widget displays a string with styling options such as fontSize and color.",
      },
      associatedSkills: ["flutter"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which widget provides basic material design visual layout?",
        options: ["Scaffold", "MaterialApp", "Stack", "Center"],
        correctAnswer: "Scaffold",
        explanation:
          "Scaffold offers app bars, drawers, floating action buttons, and body slots for Material apps.",
      },
      associatedSkills: ["flutter"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Hot reload in Flutter is triggered by?",
        options: [
          "Pressing r in the terminal or using IDE integration",
          "Restarting the device",
          "Reinstalling the app",
          "Changing pubspec.yaml",
        ],
        correctAnswer: "Pressing r in the terminal or using IDE integration",
        explanation:
          "flutter run supports hot reload to quickly update the running app while preserving state.",
      },
      associatedSkills: ["flutter"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file lists dependencies for Flutter projects?",
        options: ["pubspec.yaml", "package.json", "build.gradle", "Cargo.toml"],
        correctAnswer: "pubspec.yaml",
        explanation:
          "pubspec.yaml declares dependencies, assets, fonts, and project metadata for Dart/Flutter.",
      },
      associatedSkills: ["flutter"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the stateful widget boilerplate.",
        segments: [
          { text: "class Counter extends ", block: false },
          { text: "StatefulWidget", block: true },
          { text: " {\n  const Counter({super.key});\n\n  @override\n  State<Counter> createState() => _CounterState();\n}\n\nclass _CounterState extends State<Counter> {\n  int value = 0;\n\n  @override\n  Widget build(BuildContext context) {\n    return Text('$value');\n  }\n}", block: false },
        ],
        blocks: ["StatefulWidget", "StatelessWidget", "State"],
        correctAnswer: ["StatefulWidget"],
        explanation:
          "Using StatefulWidget lets you manage mutable state through the associated State class.",
      },
      associatedSkills: ["flutter"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which widget listens to a stream and rebuilds when new values arrive?",
        options: ["StreamBuilder", "FutureBuilder", "ValueListenableBuilder", "AnimatedBuilder"],
        correctAnswer: "StreamBuilder",
        explanation:
          "StreamBuilder takes a Stream and builder callback to render snapshots as they emit events.",
      },
      associatedSkills: ["flutter"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which architecture pattern helps separate UI from business logic in Flutter?",
        options: ["BLoC (Business Logic Component)", "MVC only", "jQuery", "Flux capacitor"],
        correctAnswer: "BLoC (Business Logic Component)",
        explanation:
          "BLoC leverages streams to manage state, making widgets reactive and testable.",
      },
      associatedSkills: ["flutter"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To reduce build sizes, which Flutter command analyzes and suggests tree-shaking improvements?",
        options: [
          "flutter build apk --analyze-size",
          "flutter analyze",
          "flutter doctor --size",
          "dart compile",
        ],
        correctAnswer: "flutter build apk --analyze-size",
        explanation:
          "--analyze-size generates a size analysis JSON you can inspect to see which packages contribute to output size.",
      },
      associatedSkills: ["flutter"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which tool allows you to share UI code while integrating with native platform features?",
        options: [
          "Platform channels",
          "Navigator 2.0",
          "Widget inspector",
          "Hot restart",
        ],
        correctAnswer: "Platform channels",
        explanation:
          "Platform channels let Dart communicate with Android/iOS code, enabling access to sensors, payments, etc.",
      },
      associatedSkills: ["flutter"],
    },
  ],
};
