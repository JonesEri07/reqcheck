import { SkillSeedData } from "../../types.js";

export const bigquerySeed: SkillSeedData = {
  skills: [
    {
      skillName: "BigQuery",
      skillNormalized: "bigquery",
      aliases: ["google bigquery"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which SQL dialect does BigQuery use by default today?",
        options: ["Standard SQL", "Legacy SQL", "MySQL dialect", "Oracle SQL"],
        correctAnswer: "Standard SQL",
        explanation:
          "Modern BigQuery projects default to Google Standard SQL, which is ANSI-compliant and more expressive than Legacy SQL.",
      },
      associatedSkills: ["bigquery"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What statement lists the first 10 rows of a table named analytics.events?",
        options: [
          "SELECT * FROM `analytics.events` LIMIT 10;",
          "SHOW TABLE analytics.events LIMIT 10;",
          "DESCRIBE analytics.events;",
          "LIST analytics.events;",
        ],
        correctAnswer: "SELECT * FROM `analytics.events` LIMIT 10;",
        explanation:
          "BigQuery tables are referenced using backticks around project.dataset.table, and LIMIT controls row count.",
      },
      associatedSkills: ["bigquery"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which BigQuery storage option keeps data in a managed columnar format?",
        options: ["Native BigQuery tables", "Cloud SQL", "Cloud Storage buckets", "Local SSD"],
        correctAnswer: "Native BigQuery tables",
        explanation:
          "BigQuery stores native tables in a proprietary columnar format inside Google's infrastructure.",
      },
      associatedSkills: ["bigquery"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which clause estimates cost before running a query?",
        options: ["EXPLAIN", "DRY RUN", "CREATE VIEW", "EXPORT DATA"],
        correctAnswer: "DRY RUN",
        explanation:
          "Adding OPTIONS (dry_run=true) or using the dry run setting estimates bytes processed without running the query.",
      },
      associatedSkills: ["bigquery"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which BigQuery object stores reusable SQL logic?",
        options: ["Views", "Buckets", "Functions", "Partitions"],
        correctAnswer: "Views",
        explanation:
          "Views encapsulate SQL queries so you can reference them like a table and centralize logic.",
      },
      associatedSkills: ["bigquery"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "How do you reference a partitioned date column when querying an ingestion-time partitioned table?",
        options: ["_PARTITIONTIME", "_PARTITIONDATE", "_INGESTIONDATE", "_PARTITIONID"],
        correctAnswer: "_PARTITIONTIME",
        explanation:
          "_PARTITIONTIME is injected by BigQuery for ingestion-time partitioned tables and can be filtered to reduce scanned bytes.",
      },
      associatedSkills: ["bigquery"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which BigQuery feature lets you query data stored in Cloud Storage without loading it first?",
        options: ["External tables", "Temporary tables", "Snapshots", "Materialized views"],
        correctAnswer: "External tables",
        explanation:
          "External tables point to data in Cloud Storage, Google Drive, or Bigtable and let you query it in place.",
      },
      associatedSkills: ["bigquery"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which statement would you use to create a materialized view for faster repeated aggregations?",
        options: [
          "CREATE MATERIALIZED VIEW ... AS SELECT ...",
          "CREATE SNAPSHOT TABLE ...",
          "CREATE EXTERNAL TABLE ...",
          "CREATE FUNCTION ...",
        ],
        correctAnswer: "CREATE MATERIALIZED VIEW ... AS SELECT ...",
        explanation:
          "Materialized views store the precomputed results of a query and update them incrementally, reducing scan costs.",
      },
      associatedSkills: ["bigquery"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How can you reduce costs when joining a large fact table with a small dimension table?",
        options: [
          "Use hash partitioning on the join key and cluster the dimension",
          "Disable slot reservations",
          "Turn on dry run",
          "Increase the number of slots manually",
        ],
        correctAnswer: "Use hash partitioning on the join key and cluster the dimension",
        explanation:
          "Partitioning and clustering help prune data before join operations, minimizing bytes processed.",
      },
      associatedSkills: ["bigquery"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which syntax lets you call a user-defined table function stored in another dataset?",
        options: [
          "SELECT * FROM `project.dataset.function_name`(args)",
          "CALL dataset.function(args)",
          "EXEC function_name(args)",
          "RUN FUNCTION dataset.function(args)",
        ],
        correctAnswer: "SELECT * FROM `project.dataset.function_name`(args)",
        explanation:
          "SQL UDFs and table functions are invoked using the SELECT ... FROM function() syntax with fully-qualified names.",
      },
      associatedSkills: ["bigquery"],
    },
  ],
};
