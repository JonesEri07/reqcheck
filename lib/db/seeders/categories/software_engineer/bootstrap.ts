import { SkillSeedData } from "../../types.js";

export const bootstrapSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Bootstrap",
      skillNormalized: "bootstrap",
      aliases: ["bootstrap css"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Which CDN link includes the latest Bootstrap 5 CSS in an HTML head?",
        options: [
          '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css">',
          '<script src="bootstrap.js"></script>',
          '<link rel="stylesheet" href="tailwind.css">',
          '<style>@import "bootstrap"</style>',
        ],
        correctAnswer:
          '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap/dist/css/bootstrap.min.css">',
        explanation:
          "Including the CDN CSS file loads Bootstrap's styles without installing locally.",
      },
      associatedSkills: ["bootstrap"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which utility class centers text?",
        options: ["text-center", "align-middle", "justify-content-center", "mx-auto"],
        correctAnswer: "text-center",
        explanation:
          "text-center sets text-align: center on the element.",
      },
      associatedSkills: ["bootstrap"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which class creates a responsive grid row?",
        options: ["row", "col", "container-fluid", "text-start"],
        correctAnswer: "row",
        explanation:
          "row wraps columns (.col-*) inside the Bootstrap grid system.",
      },
      associatedSkills: ["bootstrap"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which component class styles a primary button?",
        options: ["btn btn-primary", "button-primary", "bg-primary", "btn btn-outline"],
        correctAnswer: "btn btn-primary",
        explanation:
          "Buttons require the .btn base class plus a contextual variant such as btn-primary.",
      },
      associatedSkills: ["bootstrap"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which class adds horizontal padding equal to Bootstrap's gutter?",
        options: ["px-3", "ps-0", "py-3", "mx-3"],
        correctAnswer: "px-3",
        explanation:
          "Spacing utilities use axis abbreviations; px-3 applies padding-left/right set to the 3 spacing unit.",
      },
      associatedSkills: ["bootstrap"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which class hides an element on small screens but shows it on md and above?",
        options: [
          "d-none d-md-block",
          "d-md-none",
          "visually-hidden",
          "invisible",
        ],
        correctAnswer: "d-none d-md-block",
        explanation:
          "d-none removes display on all breakpoints; adding d-md-block overrides to block on md+.",
      },
      associatedSkills: ["bootstrap"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which JavaScript bundle is required for dropdowns or modals to function?",
        options: [
          "bootstrap.bundle.min.js",
          "bootstrap.min.css",
          "polyfills.js",
          "popper.css",
        ],
        correctAnswer: "bootstrap.bundle.min.js",
        explanation:
          "The bundle includes Popper and Bootstrap JS to power interactive components.",
      },
      associatedSkills: ["bootstrap"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which layout class constrains content to the full width of the viewport?",
        options: [
          "container-fluid",
          "container",
          "w-100",
          "mx-auto",
        ],
        correctAnswer: "container-fluid",
        explanation:
          "container-fluid spans 100% width; container has breakpoint-based max widths.",
      },
      associatedSkills: ["bootstrap"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which Sass variable overrides the primary brand color before compiling custom Bootstrap builds?",
        options: [
          "$primary",
          "$brand-base",
          "$btn-primary-bg",
          "$accent-color",
        ],
        correctAnswer: "$primary",
        explanation:
          "Bootstrap exposes Sass variables like $primary to customize theme colors.",
      },
      associatedSkills: ["bootstrap"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which utility ensures equal height columns within a row using flexbox?",
        options: [
          "align-items-stretch d-flex",
          "g-3",
          "flex-column",
          "justify-content-between",
        ],
        correctAnswer: "align-items-stretch d-flex",
        explanation:
          "Bootstrap rows already use flex; applying align-items-stretch (or d-flex wrappers) ensures columns stretch equally.",
      },
      associatedSkills: ["bootstrap"],
    },
  ],
};
