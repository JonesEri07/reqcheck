import { SkillSeedData } from "../../types";

export const cypressSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Cypress",
      skillNormalized: "cypress",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command visits a URL before running assertions?",
        options: ["cy.visit()", "cy.go()", "cy.url()", "cy.location()"],
        correctAnswer: "cy.visit()",
        explanation:
          "cy.visit loads a page or route so the rest of the test can interact with the DOM.",
      },
      associatedSkills: ["cypress"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does cy.get('input[name=email]') return?",
        options: ["A chainable containing matched elements", "The raw DOM node", "A promise", "An assertion"],
        correctAnswer: "A chainable containing matched elements",
        explanation:
          "cy.get returns a Cypress chainable that resolves to DOM elements and supports further commands/assertions.",
      },
      associatedSkills: ["cypress"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which assertion syntax is built into Cypress by default?",
        options: ["Chai + jQuery", "Jest expect", "Node assert", "Vitest"],
        correctAnswer: "Chai + jQuery",
        explanation:
          "Cypress ships with Chai, Chai-jQuery, and Sinon-Chai, so you can use should() and expect() assertions out of the box.",
      },
      associatedSkills: ["cypress"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you place reusable commands such as cy.login()?",
        options: [
          "cypress/support/commands.ts",
          "cypress/fixtures",
          "cypress.config.ts",
          "package.json",
        ],
        correctAnswer: "cypress/support/commands.ts",
        explanation:
          "Custom commands belong in the support layer so Cypress loads them before each spec.",
      },
      associatedSkills: ["cypress"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI flag runs Cypress tests headlessly in Chrome?",
        options: [
          "cypress run --browser chrome",
          "cypress open --headless",
          "cypress run --headed",
          "cypress test --ci",
        ],
        correctAnswer: "cypress run --browser chrome",
        explanation:
          "The run command defaults to headless mode; specifying --browser selects Chrome instead of Electron.",
      },
      associatedSkills: ["cypress"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the stubbed network call that waits for the response before continuing.",
        segments: [
          { text: "cy.", block: true },
          { text: "(\"GET\", \"/api/todos\").as(\"todos\");\ncy.visit(\"/dashboard\");\ncy.", block: false },
          { text: "wait", block: true },
          { text: "(\"@", block: false },
          { text: "todos", block: true },
          { text: "\");", block: false },
        ],
        blocks: ["intercept", "request", "wait", "todos", "fixture"],
        correctAnswer: ["intercept", "wait", "todos"],
        explanation:
          "cy.intercept stubs the HTTP request, .as names the route, and cy.wait('@todos') pauses until it resolves.",
      },
      associatedSkills: ["cypress"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which option makes Cypress retry assertions for a custom timeout?",
        options: [
          ".should('have.text', 'Ready', { timeout: 10000 })",
          "cy.setTimeout(10000)",
          "cy.wrap(...).retry(10000)",
          "cy.waitUntil(...)",
        ],
        correctAnswer: ".should('have.text', 'Ready', { timeout: 10000 })",
        explanation:
          "Many Cypress commands accept a { timeout } option that controls the auto-retry window.",
      },
      associatedSkills: ["cypress"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "You need to seed test data before specs run and clean up afterward. Where should you place cy.task handlers?",
        options: [
          "In cypress.config.ts under setupNodeEvents",
          "Inside each spec file",
          "In cypress/support/e2e.ts",
          "In package.json scripts",
        ],
        correctAnswer: "In cypress.config.ts under setupNodeEvents",
        explanation:
          "cy.task delegates to Node handlers defined via setupNodeEvents, making it easy to call scripts outside the browser context.",
      },
      associatedSkills: ["cypress"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which approach prevents Cypress command chains from running out of order when mixing async code?",
        options: [
          "Always return cy commands from .then() callbacks",
          "Wrap cy commands in Promise.resolve",
          "Use async/await on cy commands",
          "Disable command queueing",
        ],
        correctAnswer: "Always return cy commands from .then() callbacks",
        explanation:
          "Cypress queues commands; returning cy commands keeps the chain intact instead of letting user Promises break the flow.",
      },
      associatedSkills: ["cypress"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "You want parallelization across multiple CI containers. What two things must be configured?",
        options: [
          "Dashboard project recording key and --parallel flag",
          "cy.parallel(true) in support file",
          "sharding spec files manually only",
          "Using Firefox browser",
        ],
        correctAnswer: "Dashboard project recording key and --parallel flag",
        explanation:
          "Parallel run coordination requires the Cypress Dashboard project key and invoking cypress run --record --parallel so specs are load-balanced.",
      },
      associatedSkills: ["cypress"],
    },
  ],
};
