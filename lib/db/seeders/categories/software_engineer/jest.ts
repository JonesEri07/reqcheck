import { SkillSeedData } from "../../types";

export const jestSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Jest",
      skillNormalized: "jest",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs Jest tests in a Node project?",
        options: ["npx jest", "npm run mocha", "yarn testcafe", "node jest"],
        correctAnswer: "npx jest",
        explanation:
          "npx jest (or npm run test if configured) executes Jest’s CLI runner.",
      },
      associatedSkills: ["jest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which matcher checks equality of primitive values?",
        options: [
          "expect(value).toBe(42)",
          "expect(value).toEqual(42)",
          "expect(value).toMatchObject(42)",
          "expect(value).toContain(42)",
        ],
        correctAnswer: "expect(value).toBe(42)",
        explanation:
          "toBe uses Object.is semantics and is ideal for primitives; toEqual performs deep equality.",
      },
      associatedSkills: ["jest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function groups related tests with a description?",
        options: ["describe()", "group()", "suite()", "scenario()"],
        correctAnswer: "describe()",
        explanation:
          "describe blocks wrap multiple test cases, improving readability and hooks scoping.",
      },
      associatedSkills: ["jest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which hook runs before each test in a block?",
        options: ["beforeEach", "beforeAll", "setup", "init"],
        correctAnswer: "beforeEach",
        explanation:
          "beforeEach is re-executed for every test, making it suitable for resetting shared state.",
      },
      associatedSkills: ["jest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you mock a module automatically?",
        options: [
          "jest.mock('path/to/module')",
          "require.mock('module')",
          "sinon.stub('module')",
          "mock.module('name')",
        ],
        correctAnswer: "jest.mock('path/to/module')",
        explanation:
          "jest.mock hoists to the top of the file and replaces the module with an auto-mocked version.",
      },
      associatedSkills: ["jest"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the async test that waits for a resolved promise.",
        segments: [
          { text: "test('loads user', async () => {\n  await expect(fetchUser()).", block: false },
          { text: "resolves", block: true },
          { text: ".toEqual({ id: 1 });\n});", block: false },
        ],
        blocks: ["resolves", "rejects", "throws"],
        correctAnswer: ["resolves"],
        explanation:
          "Using resolves/ rejects helps assert async behavior without try/catch boilerplate.",
      },
      associatedSkills: ["jest"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which config option enables collecting coverage reports?",
        options: [
          "\"collectCoverage\": true",
          "\"coverage\": true",
          "\"coverageThreshold\": true",
          "\"verbose\": true",
        ],
        correctAnswer: "\"collectCoverage\": true",
        explanation:
          "Setting collectCoverage collects coverage info from instrumented files; coverageThreshold enforces limits.",
      },
      associatedSkills: ["jest"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which CLI flag runs only tests related to changed files in Git?",
        options: ["--watch", "--onlyChanged", "--runInBand", "--bail"],
        correctAnswer: "--onlyChanged",
        explanation:
          "--onlyChanged (or --watch with filters) scopes test runs to files impacted by Git changes, speeding feedback loops.",
      },
      associatedSkills: ["jest"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To share mock logic across many tests, which approach is recommended?",
        options: [
          "Use __mocks__/ manual mocks with jest.mock",
          "Copy/paste mock implementations",
          "Mutate require cache manually",
          "Mock within every test file separately",
        ],
        correctAnswer: "Use __mocks__/ manual mocks with jest.mock",
        explanation:
          "Placing manual mocks in __mocks__ directories lets jest.mock automatically use them, ensuring consistency.",
      },
      associatedSkills: ["jest"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which strategy helps avoid flakiness when mocking timers or intervals?",
        options: [
          "Use jest.useFakeTimers() with jest.advanceTimersByTime()",
          "Leave real timers active",
          "Use await new Promise(setTimeout)",
          "Mock Date.now manually only",
        ],
        correctAnswer: "Use jest.useFakeTimers() with jest.advanceTimersByTime()",
        explanation:
          "Fake timers give deterministic control over setTimeout/setInterval, eliminating race conditions in time-dependent tests.",
      },
      associatedSkills: ["jest"],
    },
  ],
};
