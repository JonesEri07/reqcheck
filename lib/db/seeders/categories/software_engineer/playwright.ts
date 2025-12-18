import { SkillSeedData } from "../../types.js";

export const playwrightSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Playwright",
      skillNormalized: "playwright",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs Playwright tests via the CLI?",
        options: ["npx playwright test", "npm run cypress", "npx vitest", "node playwright"],
        correctAnswer: "npx playwright test",
        explanation:
          "Playwright ships with a test runner invoked via npx playwright test by default.",
      },
      associatedSkills: ["playwright"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which import provides Playwright's test and expect APIs?",
        options: [
          "import { test, expect } from '@playwright/test';",
          "import { describe, it } from 'playwright';",
          "const pw = require('playwright');",
          "import { playwright } from '@playwright/core';",
        ],
        correctAnswer: "import { test, expect } from '@playwright/test';",
        explanation:
          "The @playwright/test package exposes test, expect, and fixtures for E2E testing.",
      },
      associatedSkills: ["playwright"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method navigates to a URL in a Playwright test?",
        options: [
          "await page.goto('https://example.com');",
          "await browser.goto('url');",
          "await visit('url');",
          "await page.navigate('url');",
        ],
        correctAnswer: "await page.goto('https://example.com');",
        explanation:
          "page.goto loads the specified URL and waits for the load state (by default load).",
      },
      associatedSkills: ["playwright"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which config flag enables headed mode during debugging?",
        options: ["npx playwright test --headed", "--browser headed", "--watch headed", "--debug-head"],
        correctAnswer: "npx playwright test --headed",
        explanation:
          "--headed launches visible browser windows, useful for local debugging.",
      },
      associatedSkills: ["playwright"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you record a new test script interactively?",
        options: [
          "npx playwright codegen https://example.com",
          "npx playwright record",
          "playwright new test",
          "npx playwright run --record",
        ],
        correctAnswer: "npx playwright codegen https://example.com",
        explanation:
          "codegen launches a browser, records actions, and outputs Playwright test code.",
      },
      associatedSkills: ["playwright"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the locator assertion that waits for text to be visible.",
        segments: [
          { text: "await page.getByRole('heading', { name: 'Dashboard' }).", block: false },
          { text: "toBeVisible", block: true },
          { text: "();", block: false },
        ],
        blocks: ["toBeVisible", "toHaveText", "toContain"],
        correctAnswer: ["toBeVisible"],
        explanation:
          "Playwright's expect(locator).toBeVisible() waits for the locator to be visible before asserting.",
      },
      associatedSkills: ["playwright"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which config option controls parallel workers?",
        options: ["workers: 4", "parallel: true", "threads: 4", "shards: 4"],
        correctAnswer: "workers: 4",
        explanation:
          "Setting workers in playwright.config.ts limits how many worker processes execute tests concurrently.",
      },
      associatedSkills: ["playwright"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How do you reuse authentication state across tests?",
        options: [
          "Use globalSetup to sign in and save storageState JSON",
          "Enable cookies: true in config",
          "Set reuseAuth: true",
          "Use context.persist()",
        ],
        correctAnswer: "Use globalSetup to sign in and save storageState JSON",
        explanation:
          "Recording storageState in globalSetup and referencing it via use: { storageState } reuses sessions without re-login.",
      },
      associatedSkills: ["playwright"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which reporter uploads traces, videos, and screenshots to Playwright Cloud for debugging?",
        options: [
          "playwright-cloud reporter",
          "list reporter",
          "dot reporter",
          "junit reporter",
        ],
        correctAnswer: "playwright-cloud reporter",
        explanation:
          "When connected to Playwright Cloud, enabling the playwright-cloud reporter automatically uploads artifacts for analysis.",
      },
      associatedSkills: ["playwright"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To shard tests across CI jobs without overlap, which CLI flags should you use?",
        options: [
          "--shard=1/3, --shard=2/3, etc.",
          "--split=3",
          "--ci-shard",
          "--chunk 3",
        ],
        correctAnswer: "--shard=1/3, --shard=2/3, etc.",
        explanation:
          "Playwright's --shard=m/n executes only the m-th shard of n, enabling manual sharding across CI jobs.",
      },
      associatedSkills: ["playwright"],
    },
  ],
};
