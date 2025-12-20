import { SkillSeedData } from "../../types";

export const firebaseSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Firebase",
      skillNormalized: "firebase",
      aliases: ["firestore"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Firebase product provides serverless NoSQL document storage?",
        options: ["Cloud Firestore", "Realtime Database", "Cloud Storage", "Cloud Functions"],
        correctAnswer: "Cloud Firestore",
        explanation:
          "Cloud Firestore stores JSON-like documents in collections with powerful querying and indexing.",
      },
      associatedSkills: ["firebase"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which SDK import initializes Firebase in a web app?",
        options: [
          "import { initializeApp } from \"firebase/app\";",
          "import firebase from \"firebase\";",
          "const firebase = require(\"firebase-admin\");",
          "import { firebaseApp } from \"firebase/firestore\";",
        ],
        correctAnswer: "import { initializeApp } from \"firebase/app\";",
        explanation:
          "All client SDKs start by calling initializeApp with the config object returned from the console.",
      },
      associatedSkills: ["firebase"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Firebase feature handles user authentication flows like email/password?",
        options: ["Firebase Authentication", "Cloud Messaging", "Hosting", "Crashlytics"],
        correctAnswer: "Firebase Authentication",
        explanation:
          "Firebase Auth provides client SDKs and backend services for sign-in, tokens, and providers.",
      },
      associatedSkills: ["firebase"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you configure security rules for Firestore?",
        options: [
          "firestore.rules",
          "firebase.json",
          ".firebaserc",
          "rules.config.js",
        ],
        correctAnswer: "firestore.rules",
        explanation:
          "Firestore security rules live in firestore.rules and can be deployed via the CLI for granular access control.",
      },
      associatedSkills: ["firebase"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command deploys your Firebase project from the CLI?",
        options: [
          "firebase deploy",
          "firebase push",
          "firebase release",
          "firebase publish",
        ],
        correctAnswer: "firebase deploy",
        explanation:
          "firebase deploy uploads hosting assets, functions, rules, or firestore indexes based on firebase.json configuration.",
      },
      associatedSkills: ["firebase"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which Firestore query is valid without composite indexes?",
        options: [
          "Single-field inequality, single orderBy on same field",
          "Two inequality filters on different fields",
          "orderBy on field not in select",
          "Multiple not-in filters",
        ],
        correctAnswer: "Single-field inequality, single orderBy on same field",
        explanation:
          "Firestore supports inequality (>, <, !=) on one field per query, requiring orderBy on that field, otherwise composite indexes are needed.",
      },
      associatedSkills: ["firebase"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the Cloud Function that triggers on document creation.",
        segments: [
          { text: "exports.notifyNewUser = functions.firestore.document(\"users/{userId}\")\n  .onCreate(async (snap, context) => {\n    const data = snap.", block: false },
          { text: "data", block: true },
          { text: "();\n    await sendWelcomeEmail(data.email);\n  });", block: false },
        ],
        blocks: ["data", "val", "json", "body"],
        correctAnswer: ["data"],
        explanation:
          "In Firestore triggers, snap.data() returns the new document contents.",
      },
      associatedSkills: ["firebase"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How do you reduce cold start latency for heavy Cloud Functions?",
        options: [
          "Use minInstances in the function configuration",
          "Deploy to multiple regions in one function",
          "Switch to Blaze plan only",
          "Bundle node_modules manually",
        ],
        correctAnswer: "Use minInstances in the function configuration",
        explanation:
          "Setting minInstances keeps warm instances running, improving latency for infrequent invocations (available on paid plans).",
      },
      associatedSkills: ["firebase"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Your Firestore document growth causes contention when multiple clients write to the same doc. What architecture mitigates this?",
        options: [
          "Sharded counters across subcollections",
          "Increase write throughput via rules",
          "Use Cloud Storage instead",
          "Disable offline persistence",
        ],
        correctAnswer: "Sharded counters across subcollections",
        explanation:
          "Sharded counters spread writes across documents, then aggregate to avoid transaction contention on a single document.",
      },
      associatedSkills: ["firebase"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To access Google services from Cloud Functions securely without storing service account keys, what should you use?",
        options: [
          "Workload Identity Federation / default service account",
          "Embed service account JSON in code",
          "Use Firebase anonymous auth",
          "Manually refresh OAuth tokens",
        ],
        correctAnswer: "Workload Identity Federation / default service account",
        explanation:
          "Functions run with a service account identity and can call Google APIs via Application Default Credentials without embedding secrets.",
      },
      associatedSkills: ["firebase"],
    },
  ],
};
