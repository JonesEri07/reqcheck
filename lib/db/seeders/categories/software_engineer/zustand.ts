import { SkillSeedData } from "../../types";

export const zustandSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Zustand",
      skillNormalized: "zustand",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command installs Zustand for React apps?",
        options: ["npm install zustand", "npm install redux", "npm install jotai", "npm install mobx"],
        correctAnswer: "npm install zustand",
        explanation:
          "Install via npm/pnpm/yarn add zustand to use the state management hooks.",
      },
      associatedSkills: ["zustand"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which helper creates a Zustand store?",
        options: ["create()", "configureStore()", "createStore()", "makeStore()"],
        correctAnswer: "create()",
        explanation:
          "Zustand exports create(set => ({ ... })) to define store state and actions.",
      },
      associatedSkills: ["zustand"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which React hook subscribes to the Zustand store?",
        options: ["useStore", "useSelector", "useState", "useReducer"],
        correctAnswer: "useStore",
        explanation:
          "Zustand stores expose a custom hook (const useStore = create(...); ) that components call to select state.",
      },
      associatedSkills: ["zustand"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which middleware persists state to storage?",
        options: ["persist middleware", "logger middleware", "immer middleware", "devtools middleware"],
        correctAnswer: "persist middleware",
        explanation:
          "Zustand's persist middleware syncs store slices to localStorage/AsyncStorage.",
      },
      associatedSkills: ["zustand"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which middleware integrates with Redux DevTools?",
        options: ["devtools", "logger", "persist", "immer"],
        correctAnswer: "devtools",
        explanation:
          "devtools middleware wires the store to Redux DevTools for time-travel debugging.",
      },
      associatedSkills: ["zustand"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the store definition using Immer middleware.",
        segments: [
          { text: "const useStore = create(", block: false },
          { text: "immer", block: true },
          { text: "((set) => ({ count: 0, increment: () => set((state) => { state.count += 1; }) })));", block: false },
        ],
        blocks: ["immer", "persist", "devtools"],
        correctAnswer: ["immer"],
        explanation:
          "Immer middleware allows writing mutating logic while Zustand produces immutable updates.",
      },
      associatedSkills: ["zustand"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which pattern selects only part of the store to minimize re-renders?",
        options: [
          "useStore(selector, shallow)",
          "useStore() with entire state",
          "Context providers",
          "Redux connect",
        ],
        correctAnswer: "useStore(selector, shallow)",
        explanation:
          "Passing a selector and optional shallow comparison keeps components from re-rendering when unrelated state changes.",
      },
      associatedSkills: ["zustand"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which utility merges multiple slices into one store?",
        options: ["combine()", "compose()", "merge()", "createStore()"],
        correctAnswer: "combine()",
        explanation:
          "The combine helper from zustand/middleware merges initial state and actions from multiple slices.",
      },
      associatedSkills: ["zustand"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which approach hydrates server-rendered stores in Next.js or Remix?",
        options: [
          "Create store per request and serialize snapshot to clients",
          "Use a global singleton store",
          "Disable SSR",
          "Use React Context only",
        ],
        correctAnswer: "Create store per request and serialize snapshot to clients",
        explanation:
          "SSR requires creating a store per request, populating it, serializing the snapshot, then rehydrating on the client to avoid cross-request leaks.",
      },
      associatedSkills: ["zustand"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which middleware logs state changes for debugging?",
        options: ["logger", "persist", "redux", "subscribeWithSelector"],
        correctAnswer: "logger",
        explanation:
          "logger middleware prints actions and state diffs, useful for debugging state transitions.",
      },
      associatedSkills: ["zustand"],
    },
  ],
};
