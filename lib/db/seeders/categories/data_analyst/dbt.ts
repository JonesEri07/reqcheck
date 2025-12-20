import { SkillSeedData } from "../../types";

export const dbtSeed: SkillSeedData = {
  skills: [
    {
      skillName: "dbt",
      skillNormalized: "dbt",
      aliases: ["data build tool"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does dbt stand for?",
        options: [
          "Data Build Tool",
          "Data Binary Translator",
          "Dashboards by Tableau",
          "Data Binding Template",
        ],
        correctAnswer: "Data Build Tool",
        explanation:
          "dbt stands for Data Build Tool and focuses on SQL-based transformations.",
      },
      associatedSkills: ["dbt"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file defines your target warehouse credentials in dbt?",
        options: [
          "profiles.yml",
          "dbt_project.yml",
          "packages.yml",
          "schema.yml",
        ],
        correctAnswer: "profiles.yml",
        explanation:
          "profiles.yml lives outside the project root and stores connection info for development/production targets.",
      },
      associatedSkills: ["dbt"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs all models in a project?",
        options: ["dbt run", "dbt test", "dbt seed", "dbt docs generate"],
        correctAnswer: "dbt run",
        explanation:
          "dbt run compiles and executes SELECT statements to build models in the data warehouse.",
      },
      associatedSkills: ["dbt"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you declare tests and documentation for a model?",
        options: ["schema.yml", "manifest.json", "profiles.yml", "target/"],
        correctAnswer: "schema.yml",
        explanation:
          "schema.yml files describe models, columns, tests, and docs via YAML definitions.",
      },
      associatedSkills: ["dbt"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which folder contains SQL select statements defining models?",
        options: ["models/", "macros/", "analysis/", "tests/"],
        correctAnswer: "models/",
        explanation:
          "models/ holds .sql files that dbt compiles and materializes as views/tables.",
      },
      associatedSkills: ["dbt"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which materialization rebuilds the entire table each run?",
        options: [
          "table",
          "incremental",
          "view",
          "ephemeral",
        ],
        correctAnswer: "table",
        explanation:
          "table materialization creates/overwrites a physical table, ensuring a fresh rebuild each run.",
      },
      associatedSkills: ["dbt"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which macro renders environment-specific logic within SQL templates?",
        options: [
          "Jinja templating ({{ }})",
          "SQLAlchemy",
          "Ansible filters",
          "Liquid template",
        ],
        correctAnswer: "Jinja templating ({{ }})",
        explanation:
          "dbt uses Jinja for templating, enabling macros, conditionals, and loops inside SQL files.",
      },
      associatedSkills: ["dbt"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which command executes tests defined in schema.yml?",
        options: ["dbt test", "dbt seed", "dbt snapshot", "dbt clean"],
        correctAnswer: "dbt test",
        explanation:
          "dbt test runs generic/singular tests declared in schema.yml, failing the build on data quality issues.",
      },
      associatedSkills: ["dbt"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which materialization stores only new/updated records based on unique keys?",
        options: [
          "incremental",
          "snapshot",
          "table",
          "view",
        ],
        correctAnswer: "incremental",
        explanation:
          "Incremental models insert/update rows matching a unique key, improving performance on large fact tables.",
      },
      associatedSkills: ["dbt"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which command builds historical slowly changing dimension tables by tracking changes over time?",
        options: [
          "dbt snapshot",
          "dbt archive",
          "dbt run-operation",
          "dbt deps",
        ],
        correctAnswer: "dbt snapshot",
        explanation:
          "Snapshots capture row versions over time, enabling SCD Type 2 behavior within dbt.",
      },
      associatedSkills: ["dbt"],
    },
  ],
};
