import { SkillSeedData } from "../../types.js";

export const reduxSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Redux",
      skillNormalized: "redux",
      aliases: ["redux toolkit"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which hook accesses the Redux store state in React components?",
        options: ["useSelector", "useState", "useContext", "useStoreState"],
        correctAnswer: "useSelector",
        explanation:
          "useSelector selects state from the Redux store within React components.",
      },
      associatedSkills: ["redux"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which hook dispatches actions?",
        options: ["useDispatch", "useAction", "useStore", "useReducer"],
        correctAnswer: "useDispatch",
        explanation:
          "useDispatch returns the store's dispatch function so components can dispatch actions.",
      },
      associatedSkills: ["redux"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Redux Toolkit slices combine which pieces?",
        options: ["reducer + actions + initialState", "store + middleware", "reducers + selectors", "hooks + sagas"],
        correctAnswer: "reducer + actions + initialState",
        explanation:
          "createSlice generates action creators and reducers together, encapsulating the slice state.",
      },
      associatedSkills: ["redux"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which middleware handles async logic in Redux Toolkit by default?",
        options: ["redux-thunk", "redux-saga", "redux-observable", "no middleware"],
        correctAnswer: "redux-thunk",
        explanation:
          "configureStore adds redux-thunk by default, allowing action creators that return functions.",
      },
      associatedSkills: ["redux"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What function combines multiple reducers into the root reducer?",
        options: ["combineReducers", "composeReducers", "mergeReducers", "createStore"],
        correctAnswer: "combineReducers",
        explanation:
          "combineReducers merges slice reducers into a single root reducer mapping state keys to reducers.",
      },
      associatedSkills: ["redux"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the thunk that dispatches an action after fetching data.",
        segments: [
          { text: "export const fetchUsers = () => async (dispatch) => {\n  const res = await api.getUsers();\n  dispatch(", block: false },
          { text: "usersReceived", block: true },
          { text: "(res));\n};", block: false },
        ],
        blocks: ["usersReceived", "setUsers", "usersReducer"],
        correctAnswer: ["usersReceived"],
        explanation:
          "Thunks return async functions receiving dispatch; inside dispatch(actionCreator(payload)) updates state.",
      },
      associatedSkills: ["redux"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which library memoizes derived data to avoid unnecessary recomputations?",
        options: ["Reselect", "Redux Persist", "React Query", "Immer"],
        correctAnswer: "Reselect",
        explanation:
          "Reselect's createSelector memoizes selectors so expensive calculations run only when inputs change.",
      },
      associatedSkills: ["redux"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "What does Immer (used by Redux Toolkit) enable reducers to do?",
        options: [
          "Write immutable updates using mutable-looking syntax",
          "Dispatch async actions automatically",
          "Persist state to localStorage",
          "Serialize actions",
        ],
        correctAnswer: "Write immutable updates using mutable-looking syntax",
        explanation:
          "Immer proxies draft state so reducers can 'mutate' drafts while producing immutable copies.",
      },
      associatedSkills: ["redux"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which middleware uses generator functions to orchestrate complex async flows?",
        options: ["redux-saga", "redux-thunk", "redux-observable", "redux-logger"],
        correctAnswer: "redux-saga",
        explanation:
          "redux-saga leverages ES6 generators (yield) to manage side effects like API calls, retries, and races declaratively.",
      },
      associatedSkills: ["redux"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How can you add reducers dynamically when code splitting routes?",
        options: [
          "Call store.replaceReducer with a reducer composed of existing plus new slices",
          "Dispatch an INIT action",
          "Wrap route components with connect",
          "Use React Suspense",
        ],
        correctAnswer:
          "Call store.replaceReducer with a reducer composed of existing plus new slices",
        explanation:
          "Dynamic reducer injection uses store.replaceReducer to add slices lazily, supporting route-based code splitting.",
      },
      associatedSkills: ["redux"],
    },
  ],
};
