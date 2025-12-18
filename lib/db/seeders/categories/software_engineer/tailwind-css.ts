import { SkillSeedData } from "../../types.js";

export const tailwindCssSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Tailwind CSS",
      skillNormalized: "tailwind css",
      aliases: ["tailwind", "tailwindcss"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command installs Tailwind CSS via npm?",
        options: [
          "npm install -D tailwindcss postcss autoprefixer",
          "npm install tailwind",
          "yarn add tailwind-runtime",
          "npx create-tailwind",
        ],
        correctAnswer: "npm install -D tailwindcss postcss autoprefixer",
        explanation:
          "Tailwind requires tailwindcss plus PostCSS/autoprefixer as devDependencies.",
      },
      associatedSkills: ["tailwind css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which config file customizes Tailwind?",
        options: ["tailwind.config.ts/js", "tailwind.json", "tw.config", "postcss.config.js only"],
        correctAnswer: "tailwind.config.ts/js",
        explanation:
          "Running npx tailwindcss init generates tailwind.config.js (or .ts) for theme/extensions.",
      },
      associatedSkills: ["tailwind css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive injects Tailwind base styles?",
        options: ["@tailwind base;", "@tailwind utilities;", "@apply base;", "@use base;"],
        correctAnswer: "@tailwind base;",
        explanation:
          "Tailwind CSS files typically include @tailwind base; @tailwind components; @tailwind utilities;",
      },
      associatedSkills: ["tailwind css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which class adds margin-top of 4 in Tailwind’s default scale?",
        options: ["mt-4", "m-4-top", "margin-top-4", "mt4"],
        correctAnswer: "mt-4",
        explanation:
          "Tailwind utility mt-4 applies margin-top with spacing scale value 1rem by default.",
      },
      associatedSkills: ["tailwind css"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which class applies flexbox layout with items centered?",
        options: [
          "flex items-center",
          "display-flex text-center",
          "flexbox center",
          "grid items-center",
        ],
        correctAnswer: "flex items-center",
        explanation:
          "flex sets display flex, and items-center vertically centers items along the cross axis.",
      },
      associatedSkills: ["tailwind css"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the responsive class that adds padding on medium screens.",
        segments: [
          { text: "class=\"p-2 ", block: false },
          { text: "md:p-6", block: true },
          { text: "\"", block: false },
        ],
        blocks: ["md:p-6", "medium:p-6", "p-md-6"],
        correctAnswer: ["md:p-6"],
        explanation:
          "Tailwind uses breakpoint prefixes (md:) to apply utilities at specific min-widths.",
      },
      associatedSkills: ["tailwind css"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which config property extends the default color palette?",
        options: ["theme.extend.colors", "theme.colors.extend", "extendTheme.colors", "config.colors"],
        correctAnswer: "theme.extend.colors",
        explanation:
          "Tailwind config uses module.exports = { theme: { extend: { colors: { brand: '#...' } } } }.",
      },
      associatedSkills: ["tailwind css"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which plugin enables form-specific styling resets?",
        options: [
          "@tailwindcss/forms",
          "@tailwindcss/typography",
          "@tailwindcss/aspect-ratio",
          "@tailwindcss/container",
        ],
        correctAnswer: "@tailwindcss/forms",
        explanation:
          "The official @tailwindcss/forms plugin applies better defaults for form inputs/selects.",
      },
      associatedSkills: ["tailwind css"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which strategy minimizes CSS size in production?",
        options: [
          "Enable content purging (content paths) and use JIT",
          "Disable minification",
          "Use inline styles",
          "Import entire CDN build",
        ],
        correctAnswer: "Enable content purging (content paths) and use JIT",
        explanation:
          "Tailwind scans files listed in content array and generates only used classes; JIT builds on demand.",
      },
      associatedSkills: ["tailwind css"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do you create reusable component styles in Tailwind?",
        options: [
          "Use @layer components with @apply",
          "Define CSS variables only",
          "Use SCSS mixins",
          "Wrap components in styled-components",
        ],
        correctAnswer: "Use @layer components with @apply",
        explanation:
          "Tailwind allows custom component classes inside @layer components { .btn { @apply ... } } to avoid inline duplication.",
      },
      associatedSkills: ["tailwind css"],
    },
  ],
};
