import { SkillSeedData } from "../../types";

export const sassSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Sass",
      skillNormalized: "sass",
      aliases: ["scss", "syntactically awesome stylesheets"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file extension represents the SCSS syntax?",
        options: [".scss", ".sass", ".csss", ".sassc"],
        correctAnswer: ".scss",
        explanation:
          "SCSS syntax uses .scss files; the older indented syntax uses .sass.",
      },
      associatedSkills: ["sass"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI compiles Sass to CSS?",
        options: ["sass styles.scss styles.css", "npm sass styles.scss", "scss compile", "sassc styles.scss"],
        correctAnswer: "sass styles.scss styles.css",
        explanation:
          "The Dart Sass CLI (sass) compiles input to output; optional --watch re-compiles on change.",
      },
      associatedSkills: ["sass"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which syntax declares a Sass variable?",
        options: ["$primary-color: #0af;", "@primary-color: #0af;", "var(--primary)", "-primary-color: #0af;"],
        correctAnswer: "$primary-color: #0af;",
        explanation:
          "Sass variables start with $ and can be used anywhere after declaration.",
      },
      associatedSkills: ["sass"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which mixin syntax includes reusable declarations?",
        options: ["@mixin button { ... }", ".mixin button { ... }", "@include button: {}", "@function button {}"],
        correctAnswer: "@mixin button { ... }",
        explanation:
          "Define mixins with @mixin and include them using @include.",
      },
      associatedSkills: ["sass"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive imports partials without generating extra CSS files?",
        options: ["@use 'layout';", "@import url('layout');", "@require 'layout';", "@include 'layout';"],
        correctAnswer: "@use 'layout';",
        explanation:
          "@use is the recommended module system; partial filenames start with _ and are not emitted as separate CSS files.",
      },
      associatedSkills: ["sass"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the mixin include statement.",
        segments: [
          { text: ".btn-primary {\n  @", block: false },
          { text: "include", block: true },
          { text: " button($primary-color);\n}", block: false },
        ],
        blocks: ["include", "mixin", "use"],
        correctAnswer: ["include"],
        explanation:
          "@include applies a mixin with optional arguments to the current selector.",
      },
      associatedSkills: ["sass"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which feature allows referencing parent selectors inside nested rules?",
        options: ["& (parent selector)", "@parent", "$parent", "@extend"],
        correctAnswer: "& (parent selector)",
        explanation:
          "The ampersand & stands in for the current parent selector when nesting, enabling modifiers like &--primary.",
      },
      associatedSkills: ["sass"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which Sass module rule prevents variables from polluting the global namespace?",
        options: ["@use with prefixing", "@import", "@extend", "@forward only"],
        correctAnswer: "@use with prefixing",
        explanation:
          "@use 'colors' as c; scopes variables to the c namespace, avoiding global collisions.",
      },
      associatedSkills: ["sass"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which directive forwards members of a module for re-export?",
        options: ["@forward", "@export", "@expose", "@import"],
        correctAnswer: "@forward",
        explanation:
          "@forward re-exports mixins/functions/variables from a module, letting you build index modules.",
      },
      associatedSkills: ["sass"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which strategy organizes design tokens across projects using the module system?",
        options: [
          "Split tokens into modules and @forward them through an index",
          "@import everything into a single file",
          "Use CSS custom properties only",
          "Define tokens inline with components",
        ],
        correctAnswer: "Split tokens into modules and @forward them through an index",
        explanation:
          "Combining @use/@forward lets you create shared token modules with controlled exposure and overrides.",
      },
      associatedSkills: ["sass"],
    },
  ],
};
