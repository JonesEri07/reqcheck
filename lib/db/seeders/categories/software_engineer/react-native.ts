import { SkillSeedData } from "../../types";

export const reactNativeSeed: SkillSeedData = {
  skills: [
    {
      skillName: "React Native",
      skillNormalized: "react native",
      aliases: ["reactnative"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI creates a bare React Native project?",
        options: [
          "npx react-native init MyApp",
          "npx create-react-app",
          "npm init expo",
          "npx native init",
        ],
        correctAnswer: "npx react-native init MyApp",
        explanation:
          "The React Native CLI scaffolds native iOS/Android projects with npx react-native init.",
      },
      associatedSkills: ["react native"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which core component renders text?",
        options: ["<Text>", "<Label>", "<Typography>", "<Span>"],
        correctAnswer: "<Text>",
        explanation:
          "React Native uses Text for displaying strings; styles are applied via the style prop.",
      },
      associatedSkills: ["react native"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which module handles styling similar to CSS?",
        options: ["StyleSheet.create()", "CSSModules", "styled-components only", "StyleManager"],
        correctAnswer: "StyleSheet.create()",
        explanation:
          "StyleSheet.create defines immutable style objects with CSS-like properties in JavaScript.",
      },
      associatedSkills: ["react native"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package provides components/APIs for Expo managed apps?",
        options: ["expo", "react-native-web", "react-native-gesture-handler", "metro"],
        correctAnswer: "expo",
        explanation:
          "Expo provides SDKs and CLIs for building React Native apps without touching native code initially.",
      },
      associatedSkills: ["react native"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you reload a React Native app in Metro by default?",
        options: ["Press r in Metro terminal", "npm restart", "cmd+r in VSCode", "yarn reload"],
        correctAnswer: "Press r in Metro terminal",
        explanation:
          "Pressing r reloads the bundler; on device emulator, shake or use menu for reload options.",
      },
      associatedSkills: ["react native"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the code to import a PNG asset.",
        segments: [
          { text: "import Logo from './assets/logo", block: false },
          { text: ".png", block: true },
          { text: "';\n\n<Image source={Logo} />", block: false },
        ],
        blocks: [".png", ".jpg", ".svg"],
        correctAnswer: [".png"],
        explanation:
          "Metro bundler supports static resources via import statements referencing the file extension.",
      },
      associatedSkills: ["react native"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which library handles navigation stacks on iOS/Android?",
        options: [
          "@react-navigation/native",
          "react-router-dom",
          "@expo/router only",
          "next/navigation",
        ],
        correctAnswer: "@react-navigation/native",
        explanation:
          "React Navigation is the de facto routing library for React Native, offering stack/tab/drawer navigators.",
      },
      associatedSkills: ["react native"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which API runs native code on the UI thread for fluid gestures/animations?",
        options: [
          "react-native-reanimated (worklets)",
          "Animated.timing only",
          "useEffect",
          "LayoutAnimation",
        ],
        correctAnswer: "react-native-reanimated (worklets)",
        explanation:
          "Reanimated 2+ runs worklets on the UI thread to avoid bridge bottlenecks, enabling smooth gestures.",
      },
      associatedSkills: ["react native"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which strategy reduces bundle size by splitting business logic across native architecture boundaries?",
        options: [
          "TurboModules + Fabric (new architecture)",
          "Using Context API",
          "Minifying CSS",
          "Switching to React web",
        ],
        correctAnswer: "TurboModules + Fabric (new architecture)",
        explanation:
          "Adopting the new architecture (TurboModules/Fabric) reduces bridge overhead and allows lazy loading modules.",
      },
      associatedSkills: ["react native"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do you integrate native iOS/Android code for features not available in JavaScript?",
        options: [
          "Create Native Modules/ViewManagers bridging Swift/Kotlin to JS",
          "Use useEffect to call system APIs",
          "Wrap code in if (Platform.OS)",
          "Install expo-router",
        ],
        correctAnswer: "Create Native Modules/ViewManagers bridging Swift/Kotlin to JS",
        explanation:
          "Native Modules expose platform APIs to JavaScript via the bridge; ViewManagers render custom native UI components.",
      },
      associatedSkills: ["react native"],
    },
  ],
};
