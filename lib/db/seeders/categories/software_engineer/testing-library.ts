import { SkillSeedData } from "../../types.js";

export const testingLibrarySeed: SkillSeedData = {
  skills: [
    {
      skillName: "Testing Library",
      skillNormalized: "testing library",
      aliases: ["react testing library"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package renders React components for Testing Library tests?",
        options: ["@testing-library/react", "enzyme", "react-test-renderer", "chai-dom"],
        correctAnswer: "@testing-library/react",
        explanation:
          "@testing-library/react exposes render, screen, and fireEvent utilities for DOM-based tests.",
      },
      associatedSkills: ["testing library"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which global object exposes queries like getByRole or findByText?",
        options: ["screen", "render", "document", "query"],
        correctAnswer: "screen",
        explanation:
          "screen re-exports all queries bound to the document body from the last render.",
      },
      associatedSkills: ["testing library"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which matcher library extends Jest for DOM assertions?",
        options: ["@testing-library/jest-dom", "chai-dom", "jest-extended", "enzyme"],
        correctAnswer: "@testing-library/jest-dom",
        explanation:
          "Import '@testing-library/jest-dom' to use matchers like toBeInTheDocument, toHaveStyle, etc.",
      },
      associatedSkills: ["testing library"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which query is preferred when locating elements?",
        options: [
          "getByRole with accessible name",
          "getByTestId",
          "querySelectorAll",
          "getElementsByClassName",
        ],
        correctAnswer: "getByRole with accessible name",
        explanation:
          "Testing Library encourages queries that resemble user interactions, starting with getByRole/label text.",
      },
      associatedSkills: ["testing library"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which API simulates user interactions more realistically than fireEvent?",
        options: ["@testing-library/user-event", "enzyme", "jest.mock", "sinon"],
        correctAnswer: "@testing-library/user-event",
        explanation:
          "user-event simulates real user events (typing, tabbing, clicks) with proper async behavior.",
      },
      associatedSkills: ["testing library"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the user-event example that types into an input.",
        segments: [
          { text: "const input = screen.getByLabelText('Email');\nawait userEvent.", block: false },
          { text: "type", block: true },
          { text: "(input, 'test@example.com');", block: false },
        ],
        blocks: ["type", "enter", "write"],
        correctAnswer: ["type"],
        explanation:
          "userEvent.type simulates typing, dispatching the appropriate keyboard events.",
      },
      associatedSkills: ["testing library"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which query waits for asynchronous DOM updates before resolving?",
        options: ["findByRole", "getByRole", "queryByRole", "screen.waitForRole"],
        correctAnswer: "findByRole",
        explanation:
          "findBy queries return promises and wait up to the timeout for matching elements to appear.",
      },
      associatedSkills: ["testing library"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which helper reruns assertions until they pass or timeout?",
        options: ["waitFor", "act", "rerender", "flushPromises"],
        correctAnswer: "waitFor",
        explanation:
          "waitFor keeps running the callback until it stops throwing, useful for asserting asynchronous side effects.",
      },
      associatedSkills: ["testing library"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which strategy reduces flakiness when testing components rendered in portals/modals?",
        options: [
          "Render into a custom container and query via screen",
          "Mock document.body manually",
          "Disable portals",
          "Use enzyme mount",
        ],
        correctAnswer: "Render into a custom container and query via screen",
        explanation:
          "Pass container to render() or query document.body directly; portals render in body but remain accessible to screen queries.",
      },
      associatedSkills: ["testing library"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which accessibility-first approach ensures long-term maintainable tests?",
        options: [
          "Prefer semantic queries (role, label, text) before test IDs",
          "Use brittle CSS selectors",
          "Snapshot everything",
          "Mock DOM APIs",
        ],
        correctAnswer: "Prefer semantic queries (role, label, text) before test IDs",
        explanation:
          "Testing Library's guiding principle is to test in ways similar to how users interact with the UI, improving resilience.",
      },
      associatedSkills: ["testing library"],
    },
  ],
};
