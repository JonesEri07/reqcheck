import { SkillSeedData } from "../../types.js";

export const mobxSeed: SkillSeedData = {
  skills: [
    {
      skillName: "MobX",
      skillNormalized: "mobx",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which decorator marks a value as observable in MobX 6 (with decorators enabled)?",
        options: ["@observable", "@state", "@computed", "@action"],
        correctAnswer: "@observable",
        explanation:
          "@observable marks class properties so MobX can track reads/writes and trigger reactions.",
      },
      associatedSkills: ["mobx"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which utility wraps React components to re-render when observables change?",
        options: ["observer", "useState", "memo", "autorun"],
        correctAnswer: "observer",
        explanation:
          "observer from mobx-react-lite turns functional components into reactive observers.",
      },
      associatedSkills: ["mobx"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which MobX configuration enables decorators in MobX 6+?",
        options: ["makeAutoObservable or makeObservable", "configure({ enforceActions: \"always\" })", "autorun()", "createStore()"],
        correctAnswer: "makeAutoObservable or makeObservable",
        explanation:
          "MobX 6 requires makeObservable/makeAutoObservable to annotate class fields when decorators are disabled by default.",
      },
      associatedSkills: ["mobx"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which concept represents derived values that cache until observables change?",
        options: ["Computed values", "Actions", "Reactions", "Stores"],
        correctAnswer: "Computed values",
        explanation:
          "Computed values derive from observables and recompute lazily only when dependencies change.",
      },
      associatedSkills: ["mobx"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package integrates MobX with React function components?",
        options: [
          "mobx-react-lite",
          "mobx-react-classic",
          "redux-react",
          "mobx-angular",
        ],
        correctAnswer: "mobx-react-lite",
        explanation:
          "mobx-react-lite is the smaller React binding for MobX, supporting hooks and observer HOC.",
      },
      associatedSkills: ["mobx"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the store setup using makeAutoObservable.",
        segments: [
          { text: "class TodoStore {\n  todos = []\n\n  constructor() {\n    ", block: false },
          { text: "makeAutoObservable", block: true },
          { text: "(this)\n  }\n}\n", block: false },
        ],
        blocks: ["makeAutoObservable", "makeObservable", "autorun"],
        correctAnswer: ["makeAutoObservable"],
        explanation:
          "makeAutoObservable automatically infers observables, computed values, and actions from class members.",
      },
      associatedSkills: ["mobx"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which API runs a side effect whenever observed values change and disposes automatically?",
        options: ["autorun", "reaction", "when", "observer"],
        correctAnswer: "autorun",
        explanation:
          "autorun executes immediately and re-runs when observables accessed inside change; it returns a disposer for cleanup.",
      },
      associatedSkills: ["mobx"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "To enforce state mutations within actions, which configuration should you enable?",
        options: [
          "configure({ enforceActions: \"always\" })",
          "configure({ computedRequiresReaction: true })",
          "autorun(() => {})",
          "runInActionDisabled: false",
        ],
        correctAnswer: "configure({ enforceActions: \"always\" })",
        explanation:
          "enforceActions ensures observables are mutated only within annotated actions/runInAction, preventing accidental updates in views.",
      },
      associatedSkills: ["mobx"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which pattern helps avoid stale references when using async flows with MobX actions?",
        options: [
          "wrap async blocks with runInAction",
          "mutate observables outside actions",
          "disable strict mode",
          "use computed for async results",
        ],
        correctAnswer: "wrap async blocks with runInAction",
        explanation:
          "runInAction batches observable updates after promises resolve, keeping actions synchronous and preventing inconsistent state.",
      },
      associatedSkills: ["mobx"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which helper tracks asynchronous state (pending/fulfilled/rejected) declaratively?",
        options: [
          "flow / flowResult",
          "reaction",
          "when",
          "autorun",
        ],
        correctAnswer: "flow / flowResult",
        explanation:
          "flow decorators create generator-based async actions that MobX tracks; flowResult helps consume results with proper typing.",
      },
      associatedSkills: ["mobx"],
    },
  ],
};
