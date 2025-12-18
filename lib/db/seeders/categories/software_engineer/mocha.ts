import { SkillSeedData } from "../../types.js";

export const mochaSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Mocha",
      skillNormalized: "mocha",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs Mocha tests using npx?",
        options: ["npx mocha", "npm test mocha", "node mocha", "mocha run"],
        correctAnswer: "npx mocha",
        explanation:
          "npx mocha executes Mocha from node_modules without a global install.",
      },
      associatedSkills: ["mocha"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which global Mocha function defines a test suite?",
        options: ["describe()", "suite()", "it()", "context() only"],
        correctAnswer: "describe()",
        explanation:
          "describe (alias context) groups related tests; it() defines individual test cases.",
      },
      associatedSkills: ["mocha"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which assertion library pairs well with Mocha out of the box?",
        options: ["Chai", "Jest expect", "Jasmine", "AVA"],
        correctAnswer: "Chai",
        explanation:
          "Mocha is assertion-agnostic; many teams use Chai's expect/should/assert styles.",
      },
      associatedSkills: ["mocha"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which option keeps Mocha watching files for changes?",
        options: ["--watch", "--grep", "--recursive", "--bail"],
        correctAnswer: "--watch",
        explanation:
          "--watch reruns tests whenever dependent files change.",
      },
      associatedSkills: ["mocha"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which hook runs once before all tests in a suite?",
        options: ["before()", "beforeEach()", "after()", "setup()"],
        correctAnswer: "before()",
        explanation:
          "before executes once per suite; beforeEach runs before every test case.",
      },
      associatedSkills: ["mocha"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the async test using done callbacks.",
        segments: [
          { text: "it('fetches data', function (", block: false },
          { text: "done", block: true },
          { text: ") {\n  fetchData().then(() => done()).catch(done);\n});", block: false },
        ],
        blocks: ["done", "next", "cb"],
        correctAnswer: ["done"],
        explanation:
          "Mocha treats tests as async when they accept a done callback; calling done signals completion or failure when passed an error.",
      },
      associatedSkills: ["mocha"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "To run a single failing test quickly, which modifier should you use?",
        options: ["it.only()", "it.skip()", "describe.only()", "test.only()"],
        correctAnswer: "it.only()",
        explanation:
          ".only focuses the run on specific tests or suites, useful for debugging.",
      },
      associatedSkills: ["mocha"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which reporter outputs test results in the default hierarchical style?",
        options: ["spec", "dot", "nyan", "tap"],
        correctAnswer: "spec",
        explanation:
          "spec is Mocha's default reporter, printing describe/it hierarchy with pass/fail indicators.",
      },
      associatedSkills: ["mocha"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which command-line option sets a global timeout for asynchronous tests?",
        options: ["--timeout <ms>", "--slow <ms>", "--delay", "--retries"],
        correctAnswer: "--timeout <ms>",
        explanation:
          "Mocha's --timeout config applies to tests and hooks; exceeding it fails the test unless set to 0 (no limit).",
      },
      associatedSkills: ["mocha"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To ensure promises are handled without done callbacks, which pattern should you follow?",
        options: [
          "Return the promise from the test function",
          "Use synchronous functions only",
          "Use generator functions",
          "Throw inside setTimeout",
        ],
        correctAnswer: "Return the promise from the test function",
        explanation:
          "Mocha treats returned promises as async completion signals, failing tests if the promise rejects.",
      },
      associatedSkills: ["mocha"],
    },
  ],
};
