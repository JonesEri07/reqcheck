import { SkillSeedData } from "../../types.js";

export const lessSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Less",
      skillNormalized: "less",
      aliases: ["less css"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file extension is used for Less stylesheets?",
        options: [".less", ".scss", ".sass", ".styl"],
        correctAnswer: ".less",
        explanation:
          "Less files use the .less extension and compile to CSS.",
      },
      associatedSkills: ["less"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which syntax declares a variable in Less?",
        options: ["@primary-color: #3498db;", "$primary-color: #3498db;", "--primary: #3498db;", "var(--primary);"],
        correctAnswer: "@primary-color: #3498db;",
        explanation:
          "Less variables start with @; they can be reused across styles.",
      },
      associatedSkills: ["less"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you compile Less to CSS via CLI?",
        options: [
          "lessc styles.less styles.css",
          "sass styles.less styles.css",
          "npm less styles.less",
          "less compile styles.less",
        ],
        correctAnswer: "lessc styles.less styles.css",
        explanation:
          "lessc is the official compiler; many build tools run it under the hood.",
      },
      associatedSkills: ["less"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which feature lets you nest selectors inside parent blocks?",
        options: ["Nesting", "Mixins", "Imports", "Guards"],
        correctAnswer: "Nesting",
        explanation:
          "Less supports nested selectors similar to Sass, improving readability.",
      },
      associatedSkills: ["less"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive includes another Less file?",
        options: ["@import \"buttons.less\";", "import buttons.less;", "@use \"buttons\";", "@include \"buttons\";"],
        correctAnswer: "@import \"buttons.less\";",
        explanation:
          "@import merges external Less files during compilation (before Preprocessor 3's inline default).",
      },
      associatedSkills: ["less"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "What is a mixin in Less?",
        options: [
          "Reusable group of declarations that can accept parameters",
          "A partial file import",
          "A function returning numeric values only",
          "A CSS variable alias",
        ],
        correctAnswer: "Reusable group of declarations that can accept parameters",
        explanation:
          "Mixins allow injecting reusable styles; parameterized mixins behave like functions.",
      },
      associatedSkills: ["less"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the mixin call that passes arguments.",
        segments: [
          { text: ".button(@bg, @color) {\n  background: @bg;\n  color: @color;\n}\n\n.primary {\n  .button(", block: false },
          { text: "@blue", block: true },
          { text: ", white);\n}\n", block: false },
        ],
        blocks: ["@blue", "@primary", "#blue"],
        correctAnswer: ["@blue"],
        explanation:
          "Less mixins accept arguments by position: .mixin(@arg1, @arg2).",
      },
      associatedSkills: ["less"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which guard syntax applies a mixin only when a condition is true?",
        options: [
          ".mixin(@size) when (@size > 10) { ... }",
          ".mixin if @size > 10 { ... }",
          ".mixin[ size > 10 ] { ... }",
          ".mixin(@size) => { ... }",
        ],
        correctAnswer: ".mixin(@size) when (@size > 10) { ... }",
        explanation:
          "Less guards use when clauses to apply mixins conditionally.",
      },
      associatedSkills: ["less"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To avoid generating unused CSS, which Less feature can inline the output only when invoked?",
        options: [
          "Guarded mixins + namespaced mixins",
          "@import (reference) file.less",
          "Detached rulesets",
          "CSS custom properties",
        ],
        correctAnswer: "@import (reference) file.less",
        explanation:
          "Using @import (reference) allows referencing mixins without emitting CSS unless they’re used.",
      },
      associatedSkills: ["less"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which build pipeline ensures Less compiles alongside autoprefixing and minification?",
        options: [
          "Use PostCSS + autoprefixer after less-loader in webpack",
          "Run lessc only",
          "Use CSS Modules alone",
          "Run Babel on .less files",
        ],
        correctAnswer: "Use PostCSS + autoprefixer after less-loader in webpack",
        explanation:
          "A typical chain is less-loader -> postcss-loader (autoprefixer) -> css-loader to generate optimized CSS bundles.",
      },
      associatedSkills: ["less"],
    },
  ],
};
