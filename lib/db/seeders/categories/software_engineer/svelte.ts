import { SkillSeedData } from "../../types";

export const svelteSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Svelte",
      skillNormalized: "svelte",
      aliases: ["sveltekit"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI scaffolds a Svelte project?",
        options: ["npm create svelte@latest", "npx create-react-app", "vue create", "ng new"],
        correctAnswer: "npm create svelte@latest",
        explanation:
          "npm create svelte@latest (or pnpm dlx) bootstraps Svelte/SvelteKit projects with template options.",
      },
      associatedSkills: ["svelte"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which syntax declares a component prop?",
        options: ["export let count = 0;", "props.count = 0;", "const props = {}", "this.prop count;"],
        correctAnswer: "export let count = 0;",
        explanation:
          "In Svelte, exporting a let variable (export let count) makes it a component prop.",
      },
      associatedSkills: ["svelte"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which tag wraps reactive statements?",
        options: ["$: count = a + b;", "react { ... }", "@reactive count", "useEffect(() => ...)"],
        correctAnswer: "$: count = a + b;",
        explanation:
          "$: indicates a reactive statement that re-runs whenever its dependencies change.",
      },
      associatedSkills: ["svelte"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive binds an input's value to a variable?",
        options: ["bind:value={name}", "on:input={name}", "@bind value={name}", "v-model='name'"],
        correctAnswer: "bind:value={name}",
        explanation:
          "bind:value allows two-way binding between an input value and a component variable.",
      },
      associatedSkills: ["svelte"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file configures SvelteKit routing/layouts?",
        options: ["src/routes", "pages/", "router/", "app/routes"],
        correctAnswer: "src/routes",
        explanation:
          "SvelteKit uses filesystem-based routing under src/routes with +page.svelte/+page.ts etc.",
      },
      associatedSkills: ["svelte"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the reactive statement that recomputes total.",
        segments: [
          { text: "$: total = ", block: false },
          { text: "items", block: true },
          { text: ".reduce((sum, item) => sum + item.price, 0);", block: false },
        ],
        blocks: ["items", "sum", "count"],
        correctAnswer: ["items"],
        explanation:
          "Reactive statements $: total = ... depend on items; when items changes, the statement re-runs.",
      },
      associatedSkills: ["svelte"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which hook runs on the server in SvelteKit to load data for a page?",
        options: ["export const load = async () => {}", "onMount", "getStaticProps", "loader()"],
        correctAnswer: "export const load = async () => {}",
        explanation:
          "SvelteKit pages export a load function (server/load or +page.ts) to fetch data before rendering.",
      },
      associatedSkills: ["svelte"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which transition helper animates elements entering and leaving the DOM?",
        options: ["transition:fade", "animate:flip", "motion:animate", "use:animate"],
        correctAnswer: "transition:fade",
        explanation:
          "Svelte provides built-in transitions (fade, fly, slide) applied via transition: directive.",
      },
      associatedSkills: ["svelte"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which adapter deploys SvelteKit to serverless environments like Vercel?",
        options: [
          "@sveltejs/adapter-auto (or adapter-vercel)",
          "@sveltejs/adapter-static only",
          "@sveltejs/adapter-node",
          "Sapper adapter",
        ],
        correctAnswer: "@sveltejs/adapter-auto (or adapter-vercel)",
        explanation:
          "Adapter-auto selects environment-specific adapters (e.g., Vercel, Netlify); adapter-vercel explicitly targets Vercel serverless.",
      },
      associatedSkills: ["svelte"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which store type exposes a subscribe method and run-once updates for derived values?",
        options: ["Derived store via derived()", "Writable store only", "Context store", "useState"],
        correctAnswer: "Derived store via derived()",
        explanation:
          "derived(stores, fn) computes values from other stores and updates when dependencies change.",
      },
      associatedSkills: ["svelte"],
    },
  ],
};
