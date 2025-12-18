import { SkillSeedData } from "../../types.js";

export const vueSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Vue.js",
      skillNormalized: "vue.js",
      aliases: ["vue", "vuejs", "vue3"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI scaffolds Vue 3 applications?",
        options: ["npm create vue@latest", "vue create app", "npx create-react-app", "vite init vue"],
        correctAnswer: "npm create vue@latest",
        explanation:
          "Vue 3 uses npm create vue@latest (or pnpm dlx) to bootstrap new projects.",
      },
      associatedSkills: ["vue.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive binds attributes dynamically?",
        options: [":href (v-bind:href)", "v-if", "v-show", "v-for"],
        correctAnswer: ":href (v-bind:href)",
        explanation:
          "v-bind:href or :href binds expressions to attributes; shorthand :attr is commonly used.",
      },
      associatedSkills: ["vue.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive enables two-way binding?",
        options: ["v-model", "v-bind", "v-slot", "v-transition"],
        correctAnswer: "v-model",
        explanation:
          "v-model binds inputs, selects, and components to reactive data with two-way synchronization.",
      },
      associatedSkills: ["vue.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file bootstraps the Vue app when using Vite?",
        options: ["src/main.ts", "App.vue", "vue.config.js", "index.html"],
        correctAnswer: "src/main.ts",
        explanation:
          "main.ts creates the Vue application (createApp(App)) and mounts it to the DOM.",
      },
      associatedSkills: ["vue.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Composition API hook runs after the component mounts?",
        options: ["onMounted", "mounted()", "useMounted", "afterMount"],
        correctAnswer: "onMounted",
        explanation:
          "onMounted(() => { ... }) registers a lifecycle hook triggered after the component has been mounted.",
      },
      associatedSkills: ["vue.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the <script setup> snippet defining props.",
        segments: [
          { text: "<script setup lang=\"ts\">\nconst props = ", block: false },
          { text: "defineProps", block: true },
          { text: "<{ title: string }>();\n</script>\n", block: false },
        ],
        blocks: ["defineProps", "defineEmits", "withDefaults"],
        correctAnswer: ["defineProps"],
        explanation:
          "In <script setup>, defineProps is a compiler macro for accessing component props.",
      },
      associatedSkills: ["vue.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which API creates reactive state primitives?",
        options: ["ref()", "useState()", "reactiveVar()", "signal()"],
        correctAnswer: "ref()",
        explanation:
          "ref() returns a reactive reference whose .value holds the underlying data; reactive() handles objects.",
      },
      associatedSkills: ["vue.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which official router integrates with Vue 3?",
        options: ["vue-router@4", "react-router", "next/router", "svelte-routing"],
        correctAnswer: "vue-router@4",
        explanation:
          "Vue 3 uses vue-router v4 (createRouter/createWebHistory) for client-side routing.",
      },
      associatedSkills: ["vue.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which state management library provides a minimal store for Vue 3?",
        options: ["Pinia", "Vuex 4", "Redux", "MobX"],
        correctAnswer: "Pinia",
        explanation:
          "Pinia is the official Vue 3 store solution, offering type-safe stores and a Composition API-friendly API.",
      },
      associatedSkills: ["vue.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which macro allows destructuring props without losing reactivity?",
        options: ["toRefs()", "reactive()", "shallowRef()", "markRaw()"],
        correctAnswer: "toRefs()",
        explanation:
          "toRefs(reactiveObject) returns refs for each property, preserving reactivity when destructuring.",
      },
      associatedSkills: ["vue.js"],
    },
  ],
};
