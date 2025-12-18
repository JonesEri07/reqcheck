import { SkillSeedData } from "../../types.js";

export const nuxtJsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Nuxt.js",
      skillNormalized: "nuxt.js",
      aliases: ["nuxt", "nuxtjs"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command scaffolds a Nuxt 3 project?",
        options: ["npx nuxi init my-app", "npm init nuxt-app", "nuxt create", "npx create-nuxt"],
        correctAnswer: "npx nuxi init my-app",
        explanation:
          "Nuxt 3 uses the nuxi CLI to initialize projects with TypeScript support.",
      },
      associatedSkills: ["nuxt.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directory defines routed pages automatically?",
        options: ["pages/", "routes/", "src/components/", "app/"],
        correctAnswer: "pages/",
        explanation:
          "Nuxt auto-generates Vue Router routes based on the pages/ directory structure.",
      },
      associatedSkills: ["nuxt.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs Nuxt in development mode?",
        options: ["npm run dev", "nuxt start", "nuxt build", "nuxi preview"],
        correctAnswer: "npm run dev",
        explanation:
          "npm run dev (nuxi dev) launches the dev server with hot module replacement.",
      },
      associatedSkills: ["nuxt.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you place composables for automatic auto-import?",
        options: ["composables/", "utils/", "plugins/", "middleware/"],
        correctAnswer: "composables/",
        explanation:
          "Functions inside composables/ are auto-imported by Nuxt and can be used without manual imports.",
      },
      associatedSkills: ["nuxt.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file configures Nuxt modules, runtime config, and build options?",
        options: ["nuxt.config.ts", "nuxt.config.json", "nuxt.js", "config/nuxt.ts"],
        correctAnswer: "nuxt.config.ts",
        explanation:
          "nuxt.config.ts holds modules, vite build options, runtime config, and route rules.",
      },
      associatedSkills: ["nuxt.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the server route (Nitro endpoint) that returns JSON.",
        segments: [
          { text: "// server/api/hello.get.ts\nexport default ", block: false },
          { text: "defineEventHandler", block: true },
          { text: "(() => ({ message: 'hi' }));\n", block: false },
        ],
        blocks: ["defineEventHandler", "defineNitroRoute", "useNitro"],
        correctAnswer: ["defineEventHandler"],
        explanation:
          "server/api/*.ts exports handlers via defineEventHandler, giving access to H3 utilities.",
      },
      associatedSkills: ["nuxt.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which composable fetches data server-side with caching by default?",
        options: ["useFetch", "useAsyncData only", "useState", "useLazyFetch"],
        correctAnswer: "useFetch",
        explanation:
          "useFetch wraps useAsyncData + $fetch, automatically caching server results and hydrating to the client.",
      },
      associatedSkills: ["nuxt.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which directory registers plugins that run before app initialization?",
        options: ["plugins/", "modules/", "layouts/", "middleware/"],
        correctAnswer: "plugins/",
        explanation:
          "Files under plugins/ export functions that Nuxt executes before mounting the app, useful for injecting libraries.",
      },
      associatedSkills: ["nuxt.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do you enable hybrid rendering where some routes are statically generated and others use SSR/on-demand rendering?",
        options: [
          "Use route rules (nitro) with prerender + caching options per route",
          "Disable Nitro entirely",
          "Use SPA mode only",
          "Build two separate apps",
        ],
        correctAnswer: "Use route rules (nitro) with prerender + caching options per route",
        explanation:
          "nuxt.config.ts routeRules let you set { '/blog/**': { prerender: true }, '/admin/**': { ssr: true } } for per-route behaviors.",
      },
      associatedSkills: ["nuxt.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which feature deploys serverless endpoints and static assets using the same build output?",
        options: [
          "Nitro server",
          "Vue CLI",
          "Webpack only",
          "Cloudflare Pages exclusively",
        ],
        correctAnswer: "Nitro server",
        explanation:
          "Nuxt 3 uses Nitro to bundle server handlers for Node, serverless, or edge targets alongside static assets.",
      },
      associatedSkills: ["nuxt.js"],
    },
  ],
};
