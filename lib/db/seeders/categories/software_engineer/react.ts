import { SkillSeedData } from "../../types";

export const reactSeed: SkillSeedData = {
  skills: [
    {
      skillName: "React",
      skillNormalized: "react",
      aliases: ["reactjs", "react.js"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which hook replaces class component lifecycle methods for side effects?",
        options: ["useEffect", "useState", "useMemo", "useReducer"],
        correctAnswer: "useEffect",
        explanation:
          "useEffect runs after render and handles effects previously handled in lifecycle methods.",
      },
      associatedSkills: ["react"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which statement creates local component state in a function component?",
        options: [
          "const [count, setCount] = useState(0);",
          "this.state = { count: 0 };",
          "state count = 0;",
          "useReducer({ count: 0 })",
        ],
        correctAnswer: "const [count, setCount] = useState(0);",
        explanation:
          "useState returns a state value and setter, enabling local state in function components.",
      },
      associatedSkills: ["react"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which prop do you pass to components rendered via React Router <Link>?",
        options: ["to", "href", "route", "path"],
        correctAnswer: "to",
        explanation:
          "<Link to=\"/dashboard\"> uses the to prop to navigate without full page reloads.",
      },
      associatedSkills: ["react"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does JSX compile into?",
        options: ["React.createElement calls", "HTML strings", "DOM nodes directly", "JSON"],
        correctAnswer: "React.createElement calls",
        explanation:
          "JSX is syntactic sugar for React.createElement (or the configured JSX factory), producing React elements.",
      },
      associatedSkills: ["react"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which tool bootstraps a React app with sensible defaults?",
        options: [
          "create-react-app",
          "ng new",
          "vue create",
          "npm init express",
        ],
        correctAnswer: "create-react-app",
        explanation:
          "npx create-react-app scaffolds a React application with Webpack, Babel, and dev server set up.",
      },
      associatedSkills: ["react"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the memoized value example.",
        segments: [
          { text: "const total = useMemo(() => items.reduce((sum, i) => sum + i.price, 0), [", block: false },
          { text: "items", block: true },
          { text: "]);", block: false },
        ],
        blocks: ["items", "total", "sum"],
        correctAnswer: ["items"],
        explanation:
          "Memoized values should list dependencies (items) to recompute when data changes.",
      },
      associatedSkills: ["react"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which hook is best suited for managing complex state transitions?",
        options: ["useReducer", "useState", "useRef", "useLayoutEffect"],
        correctAnswer: "useReducer",
        explanation:
          "useReducer centralizes state transitions via a reducer function, ideal for complex or multi-step updates.",
      },
      associatedSkills: ["react"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Why should keys be stable on list items?",
        options: [
          "To help React identify items across re-renders and avoid unnecessary DOM operations",
          "For styling only",
          "To store local state",
          "To enable CSS animations",
        ],
        correctAnswer:
          "To help React identify items across re-renders and avoid unnecessary DOM operations",
        explanation:
          "Stable keys let React reconcile lists efficiently; unstable/random keys cause state loss and extra renders.",
      },
      associatedSkills: ["react"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which API defers expensive renders by prioritizing urgent updates?",
        options: ["useTransition", "Suspense", "useDeferredValue", "useImperativeHandle"],
        correctAnswer: "useTransition",
        explanation:
          "useTransition lets you mark state updates as non-urgent, allowing React to keep the UI responsive.",
      },
      associatedSkills: ["react"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which pattern avoids prop drilling by sharing data globally?",
        options: [
          "React Context API",
          "Higher Order Components only",
          "Ref forwarding",
          "ReactDOM.render",
        ],
        correctAnswer: "React Context API",
        explanation:
          "Context provides values to nested components without passing props explicitly at every level.",
      },
      associatedSkills: ["react"],
    },
  ],
};
