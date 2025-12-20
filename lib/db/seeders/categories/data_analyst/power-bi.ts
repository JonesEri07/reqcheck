import { SkillSeedData } from "../../types";

export const powerBiSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Power BI",
      skillNormalized: "power bi",
      aliases: ["powerbi", "microsoft power bi"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Power BI component is used to author data models and reports on a desktop?",
        options: [
          "Power BI Desktop",
          "Power BI Report Server",
          "Power BI Mobile",
          "Power BI Gateway",
        ],
        correctAnswer: "Power BI Desktop",
        explanation:
          "Power BI Desktop is the Windows application analysts use to connect, model, and build interactive reports before publishing.",
      },
      associatedSkills: ["power bi"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which language powers calculated columns and measures in Power BI?",
        options: ["DAX", "M", "SQL", "Python"],
        correctAnswer: "DAX",
        explanation:
          "Data Analysis Expressions (DAX) is the formula language for defining measures, calculated columns, and tables.",
      },
      associatedSkills: ["power bi"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which view lets you build interactive dashboards in the Power BI service?",
        options: ["Dashboard view", "Data view", "Model view", "Query view"],
        correctAnswer: "Dashboard view",
        explanation:
          "Dashboards in the service pin visuals from reports and combine them into a single tiled canvas for monitoring KPIs.",
      },
      associatedSkills: ["power bi"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which feature connects on-premises data sources to the cloud service securely?",
        options: [
          "On-premises data gateway",
          "Dataflow",
          "Workspace",
          "Streaming dataset",
        ],
        correctAnswer: "On-premises data gateway",
        explanation:
          "The gateway acts as a bridge between on-premises data sources and Power BI cloud refresh operations.",
      },
      associatedSkills: ["power bi"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file extension represents a Power BI Desktop report?",
        options: [".pbix", ".pbit", ".rdl", ".pbids"],
        correctAnswer: ".pbix",
        explanation:
          "PBIX files contain the data model, queries, and report layout created in Power BI Desktop.",
      },
      associatedSkills: ["power bi"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which area in Power BI Desktop shows relationships between tables?",
        options: ["Model view", "Report view", "Data view", "Dashboard view"],
        correctAnswer: "Model view",
        explanation:
          "Model view displays tables, fields, and relationship lines, allowing you to edit cardinality and cross-filter direction.",
      },
      associatedSkills: ["power bi"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which transformation language drives Power Query steps?",
        options: ["M", "T-SQL", "R", "Scala"],
        correctAnswer: "M",
        explanation:
          "Power Query records transformations as M scripts, which you can view/edit in the Advanced Editor.",
      },
      associatedSkills: ["power bi"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which feature enables row-level security in Power BI datasets?",
        options: ["Defining roles and DAX filters", "Workspaces", "Dataflows", "Usage metrics"],
        correctAnswer: "Defining roles and DAX filters",
        explanation:
          "You create security roles and apply DAX filter expressions to limit visible data after publishing.",
      },
      associatedSkills: ["power bi"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which DAX function evaluates an expression in a modified filter context, often for time intelligence?",
        options: ["CALCULATE", "SUMX", "FILTER", "VALUES"],
        correctAnswer: "CALCULATE",
        explanation:
          "CALCULATE redefines filter context, making it the powerhouse function for time-intelligence and conditional aggregations.",
      },
      associatedSkills: ["power bi"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which approach improves DirectQuery performance when joining fact tables?",
        options: [
          "Modeling star schemas and reducing bi-directional relationships",
          "Enabling automatic page refresh",
          "Switching to PBIDS format",
          "Publishing multiple workspaces",
        ],
        correctAnswer:
          "Modeling star schemas and reducing bi-directional relationships",
        explanation:
          "DirectQuery benefits from clean star schemas and minimal cross-filtering, reducing query complexity at the source.",
      },
      associatedSkills: ["power bi"],
    },
  ],
};
