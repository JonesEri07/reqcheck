import { SkillSeedData } from "../../types.js";

export const ionicSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Ionic",
      skillNormalized: "ionic",
      aliases: ["ionic framework"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI command generates a new Ionic Angular app?",
        options: [
          "ionic start my-app tabs --type angular",
          "ionic create my-app",
          "npm init ionic",
          "ng new ionic",
        ],
        correctAnswer: "ionic start my-app tabs --type angular",
        explanation:
          "ionic start scaffolds apps with starters (tabs, blank, sidemenu) for Angular/React/Vue.",
      },
      associatedSkills: ["ionic"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Ionic component renders a cross-platform button?",
        options: ["ion-button", "Button", "ionic-button", "ion-btn"],
        correctAnswer: "ion-button",
        explanation:
          "ion-button automatically adapts styling per platform and supports fill, color, and expand props.",
      },
      associatedSkills: ["ionic"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package provides native runtime capabilities like camera access?",
        options: [
          "@capacitor/core",
          "@ionic/angular",
          "cordova.js",
          "expo",
        ],
        correctAnswer: "@capacitor/core",
        explanation:
          "Ionic recommends Capacitor for native plugins; @capacitor/core plus platform packages bridge to native APIs.",
      },
      associatedSkills: ["ionic"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file defines global Ionic theme variables?",
        options: ["src/theme/variables.scss", "styles.css", "ionic.config.json", "capacitor.config.ts"],
        correctAnswer: "src/theme/variables.scss",
        explanation:
          "variables.scss exposes CSS variables for colors, typography, and component styling across the app.",
      },
      associatedSkills: ["ionic"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which component organizes tab-based navigation?",
        options: ["ion-tabs", "ion-router", "ion-nav", "ion-stack"],
        correctAnswer: "ion-tabs",
        explanation:
          "ion-tabs combines ion-tab-bar and ion-tab-button components to handle multiple tab stacks.",
      },
      associatedSkills: ["ionic"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the Ionic React import for the IonPage layout component.",
        segments: [
          { text: "import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from ", block: false },
          { text: "@ionic/react", block: true },
          { text: ";\n", block: false },
        ],
        blocks: ["@ionic/react", "@ionic/core", "@ionic/angular"],
        correctAnswer: ["@ionic/react"],
        explanation:
          "@ionic/react exports React bindings for Ionic components, while @ionic/angular provides Angular modules.",
      },
      associatedSkills: ["ionic"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which navigation strategy ensures native-like transitions on iOS/Android?",
        options: [
          "IonRouterOutlet with IonReactRouter/IonVueRouter",
          "React Router BrowserRouter only",
          "Window.location.assign",
          "Manual DOM manipulation",
        ],
        correctAnswer: "IonRouterOutlet with IonReactRouter/IonVueRouter",
        explanation:
          "IonRouterOutlet wraps React/Vue router outlets to apply animated transitions and preserve view stacks.",
      },
      associatedSkills: ["ionic"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which Capacitor command syncs native platform projects with the latest web code and plugins?",
        options: ["npx cap sync", "npx cap add", "npx cap open", "ionic build"],
        correctAnswer: "npx cap sync",
        explanation:
          "cap sync copies the web build to iOS/Android, updates native dependencies, and ensures plugins are registered.",
      },
      associatedSkills: ["ionic"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "You need offline-ready PWAs with background sync. Which Ionic/Capacitor capability supports this?",
        options: [
          "Service workers configured via @ionic/pwa-elements",
          "IonRefresher",
          "IonSlides",
          "NavController push()",
        ],
        correctAnswer: "Service workers configured via @ionic/pwa-elements",
        explanation:
          "Registering a service worker (e.g., using @capacitor/app manifest or Angular service worker) enables offline caching and background sync for PWAs.",
      },
      associatedSkills: ["ionic"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To share UI logic across Ionic Angular and Capacitor native plugins, which architecture is recommended?",
        options: [
          "Use Capacitor plugins for native features while keeping UI in a single framework codebase",
          "Maintain separate native apps",
          "Embed Ionic app inside WebView manually",
          "Rely solely on Cordova",
        ],
        correctAnswer:
          "Use Capacitor plugins for native features while keeping UI in a single framework codebase",
        explanation:
          "Capacitor encourages a single codebase for web UI plus thin native layers that expose required device functionality.",
      },
      associatedSkills: ["ionic"],
    },
  ],
};
