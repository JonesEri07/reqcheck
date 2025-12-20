import { SkillSeedData } from "../../types";

export const cssSeed: SkillSeedData = {
  skills: [
    {
      skillName: "CSS",
      skillNormalized: "css",
      aliases: ["css3", "cascading style sheets"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What color will the text be?\n\n```css\n.title {\n  color: blue;\n}\n```",
        options: ["Blue", "Red", "Black", "Green"],
        correctAnswer: "Blue",
        explanation: "color property sets the text color.",
      },
      associatedSkills: ["css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Fill in the blank: Use ___ to select an element by ID.",
        options: ["#", ".", "*", "@"],
        correctAnswer: "#",
        explanation: "# selects by ID, . selects by class.",
      },
      associatedSkills: ["css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Fill in the blank:\n\n```css\n.box {\n  ___: 20px;\n}\n```\n\n(Adds space inside the element)",
        options: ["padding", "margin", "spacing", "border"],
        correctAnswer: "padding",
        explanation: "padding adds space inside, margin adds space outside.",
      },
      associatedSkills: ["css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Fill in the blank:\n\n```css\n.heading {\n  ___: bold;\n}\n```",
        options: ["font-weight", "text-bold", "bold", "font-style"],
        correctAnswer: "font-weight",
        explanation: "font-weight property makes text bold.",
      },
      associatedSkills: ["css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this do?\n\n```css\n@media (max-width: 768px) {\n  .menu { display: none; }\n}\n```",
        options: [
          "Hides menu on small screens",
          "Shows menu always",
          "Sets width to 768px",
          "Creates a menu",
        ],
        correctAnswer: "Hides menu on small screens",
        explanation: "Media query applies styles based on screen size.",
      },
      associatedSkills: ["css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this create?\n\n```css\n.container {\n  display: flex;\n}\n```",
        options: [
          "A flexbox container",
          "A grid container",
          "A table",
          "A block element",
        ],
        correctAnswer: "A flexbox container",
        explanation: "display: flex creates a flexbox layout.",
      },
      associatedSkills: ["css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Fill in the blank:\n\n```css\n.text {\n  ___: red;\n}\n```",
        options: ["color", "text-color", "font-color", "text"],
        correctAnswer: "color",
        explanation: "color property sets text color.",
      },
      associatedSkills: ["css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does :hover do?\n\n```css\n.button:hover {\n  background: green;\n}\n```",
        options: [
          "Styles button on hover",
          "Styles button always",
          "Styles button on click",
          "Nothing",
        ],
        correctAnswer: "Styles button on hover",
        explanation: ":hover applies styles when mouse hovers over element.",
      },
      associatedSkills: ["css"],
    },
  ],
};

