import { SkillSeedData } from "../../types.js";

export const lookerSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Looker",
      skillNormalized: "looker",
      aliases: ["google looker"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Looker artifact defines reusable explores, views, and models?",
        options: ["LookML project", "Dashboard tile", "Alert", "Board"],
        correctAnswer: "LookML project",
        explanation:
          "LookML projects store the .lkml files that describe explores, joins, and measures available to end users.",
      },
      associatedSkills: ["looker"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which object do business users interact with to build ad-hoc queries?",
        options: ["Explores", "Git branches", "Connections", "Public API tokens"],
        correctAnswer: "Explores",
        explanation:
          "Explores expose the fields defined in LookML so users can drag dimensions and measures into queries.",
      },
      associatedSkills: ["looker"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Looker feature lets you schedule query results to email or Slack?",
        options: ["Delivery schedules", "Boards", "Looks", "Spaces"],
        correctAnswer: "Delivery schedules",
        explanation:
          "Delivery schedules are available on Looks and dashboards so results can be pushed to destinations on a cadence.",
      },
      associatedSkills: ["looker"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you define database credentials for Looker models?",
        options: ["Connections in the Admin panel", "Explore actions", "Dashboard filters", "Schedules page"],
        correctAnswer: "Connections in the Admin panel",
        explanation:
          "Connections store host, database, and credential information so Looker can run SQL against your warehouse.",
      },
      associatedSkills: ["looker"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which LookML parameter defines how a measure should aggregate?",
        options: ["type: sum", "link:", "sql_table_name:", "always_filter:"],
        correctAnswer: "type: sum",
        explanation:
          "Measures include a type parameter such as sum, avg, count, etc., which determines the SQL aggregation.",
      },
      associatedSkills: ["looker"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "How do you create a reusable filter that applies to every query in an Explore?",
        options: [
          "Use always_filter in the Explore definition",
          "Create a dashboard-level filter",
          "Add a table calculation",
          "Build a derived table",
        ],
        correctAnswer: "Use always_filter in the Explore definition",
        explanation:
          "always_filter enforces a LookML-defined filter whenever users query that Explore to enforce row-level constraints.",
      },
      associatedSkills: ["looker"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which Git workflow is recommended when editing LookML?",
        options: [
          "Create a development branch, commit changes, then deploy to production",
          "Edit files directly in production mode",
          "Use dashboards to edit LookML",
          "Only admins may edit LookML",
        ],
        correctAnswer: "Create a development branch, commit changes, then deploy to production",
        explanation:
          "Looker encourages Git-based development so changes can be reviewed and deployed safely.",
      },
      associatedSkills: ["looker"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which Looker feature lets you reference SQL results from a custom query as a reusable Explore?",
        options: [
          "Persistent derived tables (PDTs)",
          "Look-linked dashboards",
          "Alerts",
          "User attributes",
        ],
        correctAnswer: "Persistent derived tables (PDTs)",
        explanation:
          "PDTs materialize the SQL defined in LookML so other Explores can join to the precomputed results.",
      },
      associatedSkills: ["looker"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How can you customize row-level security so each user only sees their region's data?",
        options: [
          "Use user attributes combined with access_filters",
          "Create a separate dashboard per region",
          "Disable caching",
          "Turn on development mode globally",
        ],
        correctAnswer: "Use user attributes combined with access_filters",
        explanation:
          "User attributes capture metadata such as region and access_filters enforce those values in LookML explores.",
      },
      associatedSkills: ["looker"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which API endpoint would you use to programmatically run a saved Look and download results?",
        options: [
          "POST /looks/{look_id}/run/{result_format}",
          "GET /dashboards/{dashboard_id}",
          "POST /login",
          "DELETE /looks/{look_id}",
        ],
        correctAnswer: "POST /looks/{look_id}/run/{result_format}",
        explanation:
          "The Looks API allows you to run stored queries and retrieve results in formats like json, csv, or xlsx.",
      },
      associatedSkills: ["looker"],
    },
  ],
};
