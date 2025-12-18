import { SkillSeedData } from "../../types.js";

export const javascriptSeed: SkillSeedData = {
  skills: [
    {
      skillName: "JavaScript",
      skillNormalized: "javascript",
      aliases: ["js", "es6", "es2015", "ecmascript"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "fill_blank_blocks",
        question:
          "Complete the function so it returns the sum of two arguments using classic function syntax.",
        segments: [
          { text: "function", block: true },
          { text: " add(", block: false },
          { text: "a", block: true },
          { text: ", ", block: false },
          { text: "b", block: true },
          { text: ") ", block: false },
          { text: "{", block: true },
          { text: "\n  ", block: false },
          { text: "return", block: true },
          { text: " a + b;\n", block: false },
          { text: "}", block: true },
        ],
        blocks: [
          "function",
          "return",
          "{",
          "}",
          "a",
          "b",
          "const",
          "let",
          "=>",
        ],
        correctAnswer: ["function", "a", "b", "{", "return", "}"],
        explanation:
          "Use the function keyword with parameters a and b, open the body with {, return their sum, then close with }.",
      },
      associatedSkills: ["javascript"],
    },
    {
      difficulty: "easy",
      question: {
        type: "fill_blank_blocks",
        question:
          "Complete the DOM helper so it writes “Hello” into the element with id demo.",
        segments: [
          { text: "function", block: true },
          { text: " showMessage() ", block: false },
          { text: "{", block: true },
          { text: "\n  ", block: false },
          { text: "document", block: true },
          { text: ".", block: false },
          { text: "getElementById", block: true },
          { text: "('demo').", block: false },
          { text: "innerHTML", block: true },
          { text: " = 'Hello';\n", block: false },
          { text: "}", block: true },
        ],
        blocks: [
          "function",
          "{",
          "}",
          "document",
          "getElementById",
          "innerHTML",
          "console.log",
          "querySelector",
          "textContent",
        ],
        correctAnswer: [
          "function",
          "{",
          "document",
          "getElementById",
          "innerHTML",
          "}",
        ],
        explanation:
          "A DOM update requires document.getElementById('demo').innerHTML. Remember to open and close the function body with braces.",
      },
      associatedSkills: ["javascript"],
    },
    {
      difficulty: "easy",
      question: {
        type: "fill_blank_blocks",
        question:
          "Finish the arrow function so it doubles the provided number.",
        segments: [
          { text: "const", block: true },
          { text: " double = ", block: false },
          { text: "(x)", block: true },
          { text: " ", block: false },
          { text: "=>", block: true },
          { text: " x * ", block: false },
          { text: "2", block: true },
          { text: ";", block: false },
        ],
        blocks: ["const", "let", "(x)", "(value)", "=>", "=> {}", "2", "4"],
        correctAnswer: ["const", "(x)", "=>", "2"],
        explanation:
          "Declare the arrow function with const, keep the single parameter (x), use the => arrow, and multiply by 2.",
      },
      associatedSkills: ["javascript"],
    },
    {
      difficulty: "easy",
      question: {
        type: "fill_blank_blocks",
        question:
          "Complete the statement so the variable count stores the number 10.",
        segments: [
          { text: "let", block: true },
          { text: " count = ", block: false },
          { text: "10", block: true },
          { text: ";", block: false },
        ],
        blocks: ["let", "variable", "10", "20", "0"],
        correctAnswer: ["let", "10"],
        explanation:
          "Use let to declare a mutable variable and assign the numeric literal 10.",
      },
      associatedSkills: ["javascript"],
    },
    {
      difficulty: "easy",
      question: {
        type: "fill_blank_blocks",
        question:
          "Fill in the call so the greet function executes with the argument 'John'.",
        segments: [
          { text: "greet", block: true },
          { text: "(", block: false },
          { text: "'John'", block: true },
          { text: ");", block: false },
        ],
        blocks: ["greet", "call", "run", "'John'", "'Jane'", "'Anna'"],
        correctAnswer: ["greet", "'John'"],
        explanation:
          "Call the function by name and pass the string 'John' as the single argument.",
      },
      associatedSkills: ["javascript"],
    },
  ],
};
