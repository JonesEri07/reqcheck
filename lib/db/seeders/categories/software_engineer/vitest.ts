import { SkillSeedData } from "../../types";

export const vitestSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Vitest",
      skillNormalized: "vitest",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs Vitest in watch mode?",
        options: ["npx vitest", "npm run test -- --watch", "vitest-cli watch", "npx jest"],
        correctAnswer: "npx vitest",
        explanation:
          "Vitest installs as a CLI executable; npx vitest starts the watch runner by default.",
      },
      associatedSkills: ["vitest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which config file customizes Vitest when using Vite?",
        options: ["vite.config.ts with test:{ ... }", "vitest.config.js only", "jest.config.js", "test.config.json"],
        correctAnswer: "vite.config.ts with test:{ ... }",
        explanation:
          "Vitest piggybacks on Vite config; define test: { globals: true, environment: 'jsdom' } inside vite.config.",
      },
      associatedSkills: ["vitest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which environment simulates the DOM for React/Vue tests?",
        options: ["environment: 'jsdom'", "environment: 'node'", "environment: 'happy-dom'", "environment: 'browserless'"],
        correctAnswer: "environment: 'jsdom'",
        explanation:
          "Set test.environment to 'jsdom' (or 'happy-dom') to provide DOM APIs for component tests.",
      },
      associatedSkills: ["vitest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which matcher library integrates seamlessly with Vitest?",
        options: ["expect from vitest", "chai", "jest", "assert"],
        correctAnswer: "expect from vitest",
        explanation:
          "Vitest exposes expect, vi, and test APIs modeled after Jest.",
      },
      associatedSkills: ["vitest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which helper mocks modules/functions?",
        options: ["vi.mock()", "jest.mock()", "chai.spy()", "sinon.stub()"],
        correctAnswer: "vi.mock()",
        explanation:
          "Vitest provides vi.mock(), vi.fn(), vi.spyOn() for dependency mocking.",
      },
      associatedSkills: ["vitest"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the async test syntax.",
        segments: [
          { text: "it('fetches data', async () => {\n  const res = await fetchUser();\n  expect(res.ok).", block: false },
          { text: "toBe", block: true },
          { text: "(true);\n});", block: false },
        ],
        blocks: ["toBe", "toEqual", "toStrictEqual"],
        correctAnswer: ["toBe"],
        explanation:
          "Vitest reuses Jest-style expect matchers such as toBe for primitive equality.",
      },
      associatedSkills: ["vitest"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which flag runs tests once and exits (CI mode)?",
        options: ["vitest run", "vitest ci", "vitest --single", "vitest --no-watch"],
        correctAnswer: "vitest run",
        explanation:
          "vitest run executes the suite once without watch—ideal for CI pipelines.",
      },
      associatedSkills: ["vitest"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which config option enforces coverage thresholds?",
        options: ["test.coverage", "coverageThreshold", "enforceCoverage", "nycConfig"],
        correctAnswer: "test.coverage",
        explanation:
          "Configure coverage via test: { coverage: { provider: 'istanbul', thresholds: { lines: 80 } } } in vite.config.",
      },
      associatedSkills: ["vitest"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which option isolates filesystem mocks to prevent leakage between tests?",
        options: ["test.isolate = true", "restoreMocks: true", "globals: false", "setupFiles"],
        correctAnswer: "test.isolate = true",
        explanation:
          "Vitest isolates modules between tests by default; ensure test.isolate true or use vi.resetModules to avoid shared mocks.",
      },
      associatedSkills: ["vitest"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which approach integrates Vitest with component testing libraries like Testing Library?",
        options: [
          "Install @testing-library/* and run vitest with jsdom",
          "Use Jest runner",
          "Switch to Cypress component testing",
          "Disable HMR",
        ],
        correctAnswer:
          "Install @testing-library/* and run vitest with jsdom",
        explanation:
          "Vitest + jsdom environment plus @testing-library/react enables React component tests with minimal config.",
      },
      associatedSkills: ["vitest"],
    },
  ],
};
