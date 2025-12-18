import { SkillSeedData } from "../../types.js";

export const htmlSeed: SkillSeedData = {
  skills: [
    {
      skillName: "HTML",
      skillNormalized: "html",
      aliases: ["html5", "hypertext markup language"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this HTML create?\n\n```html\n<ul>\n  <li>Apple</li>\n  <li>Banana</li>\n</ul>\n```",
        options: [
          "A bulleted list",
          "A numbered list",
          "A table",
          "Two paragraphs",
        ],
        correctAnswer: "A bulleted list",
        explanation: "<ul> creates an unordered (bulleted) list.",
      },
      associatedSkills: ["html"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Fill in the blank: The largest heading uses ___ tag.",
        options: ["<h1>", "<h2>", "<h6>", "<head>"],
        correctAnswer: "<h1>",
        explanation: "<h1> is the largest heading, <h6> is the smallest.",
      },
      associatedSkills: ["html"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          'Fill in the blank:\n\n```html\n<img src="photo.jpg" ___="Description">\n```',
        options: ["alt", "title", "text", "description"],
        correctAnswer: "alt",
        explanation: "alt attribute provides alternative text for images.",
      },
      associatedSkills: ["html"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          'Fill in the blank:\n\n```html\n<___ href="https://example.com">Link</___>\n```',
        options: ["a", "link", "url", "href"],
        correctAnswer: "a",
        explanation: "<a> tag creates a hyperlink with href attribute.",
      },
      associatedSkills: ["html"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this create?\n\n```html\n<ol>\n  <li>First</li>\n  <li>Second</li>\n</ol>\n```",
        options: [
          "A numbered list",
          "A bulleted list",
          "A table",
          "Two paragraphs",
        ],
        correctAnswer: "A numbered list",
        explanation: "<ol> creates an ordered (numbered) list.",
      },
      associatedSkills: ["html"],
    },
  ],
};
