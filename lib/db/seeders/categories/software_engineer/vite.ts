import { SkillSeedData } from "../../types.js";

export const viteSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Vite",
      skillNormalized: "vite",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI scaffolds a new Vite project?",
        options: ["npm create vite@latest", "npx create-react-app", "vue create", "vite init"],
        correctAnswer: "npm create vite@latest",
        explanation:
          "npm create vite@latest (or pnpm dlx) bootstraps framework templates for Vite.",
      },
      associatedSkills: ["vite"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command starts the dev server with hot module replacement?",
        options: ["npm run dev", "vite start", "npm start", "yarn serve"],
        correctAnswer: "npm run dev",
        explanation:
          "Vite templates map npm run dev to vite dev, launching the HMR-enabled dev server.",
      },
      associatedSkills: ["vite"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which config file customizes plugins, aliases, and build options?",
        options: ["vite.config.ts/js", "vite.json", "vitefile.js", "webpack.config.js"],
        correctAnswer: "vite.config.ts/js",
        explanation:
          "Vite uses ESM configs (vite.config.ts/js) exporting defineConfig for server/build settings.",
      },
      associatedSkills: ["vite"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command bundles the project for production?",
        options: ["npm run build", "vite bundle", "npm run prod", "rollup build"],
        correctAnswer: "npm run build",
        explanation:
          "npm run build invokes vite build (powered by Rollup) to emit optimized production assets.",
      },
      associatedSkills: ["vite"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which environment variable prefix exposes values to client code?",
        options: ["VITE_", "PUBLIC_", "REACT_APP_", "NEXT_PUBLIC_"],
        correctAnswer: "VITE_",
        explanation:
          "Only variables prefixed VITE_ are statically injected into client bundles; others remain server-only.",
      },
      associatedSkills: ["vite"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the alias configuration snippet.",
        segments: [
          { text: "resolve: {\n  alias: {\n    '@': path.", block: false },
          { text: "resolve", block: true },
          { text: "(__dirname, 'src')\n  }\n}", block: false },
        ],
        blocks: ["resolve", "join", "alias"],
        correctAnswer: ["resolve"],
        explanation:
          "Common alias setup uses path.resolve(__dirname, 'src') within resolve.alias.",
      },
      associatedSkills: ["vite"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which official plugin enables React Fast Refresh in Vite?",
        options: [
          "@vitejs/plugin-react",
          "@vitejs/plugin-vue",
          "vite-plugin-svelte",
          "@vitejs/plugin-legacy",
        ],
        correctAnswer: "@vitejs/plugin-react",
        explanation:
          "@vitejs/plugin-react configures Babel, JSX, and Fast Refresh for React projects.",
      },
      associatedSkills: ["vite"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which option proxies API calls during development?",
        options: ["server.proxy", "devServer.proxy", "proxyServer", "build.proxy"],
        correctAnswer: "server.proxy",
        explanation:
          "In vite.config, server.proxy maps routes (e.g., '/api') to backend targets for local dev.",
      },
      associatedSkills: ["vite"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which Rollup option lets you customize chunk splitting (e.g., vendor chunk)?",
        options: [
          "build.rollupOptions.output.manualChunks",
          "optimizeDeps.include",
          "assetsInclude",
          "cssCodeSplit",
        ],
        correctAnswer: "build.rollupOptions.output.manualChunks",
        explanation:
          "manualChunks controls how Rollup splits bundles, allowing vendor/framework chunk strategies.",
      },
      associatedSkills: ["vite"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do you configure Vite for SSR entry points?",
        options: [
          "Provide ssr entry files via build.rollupOptions.input/ssr config",
          "Set ssr: true globally",
          "Use webpack server build",
          "Serve with Express only",
        ],
        correctAnswer: "Provide ssr entry files via build.rollupOptions.input/ssr config",
        explanation:
          "Vite SSR uses separate entry modules referenced by build.ssr/input; the dev server uses server.ssrLoadModule.",
      },
      associatedSkills: ["vite"],
    },
  ],
};
