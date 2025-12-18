import { SkillSeedData } from "../../types.js";

export const snowflakeSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Snowflake",
      skillNormalized: "snowflake",
      aliases: ["snowflake data warehouse"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Snowflake organizes data objects under which three-level hierarchy?",
        options: [
          "database.schema.table",
          "project.dataset.table",
          "catalog.database.schema",
          "bucket.folder.object",
        ],
        correctAnswer: "database.schema.table",
        explanation:
          "Snowflake follows the SQL hierarchy of database → schema → table, referenced with fully qualified names.",
      },
      associatedSkills: ["snowflake"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command creates a virtual warehouse for compute?",
        options: [
          "CREATE WAREHOUSE analytics_wh;",
          "CREATE DATABASE analytics;",
          "CREATE STAGE analytics_stage;",
          "CREATE PIPE analytics_pipe;",
        ],
        correctAnswer: "CREATE WAREHOUSE analytics_wh;",
        explanation:
          "Virtual warehouses provide compute resources. They can be independently sized, started, and suspended.",
      },
      associatedSkills: ["snowflake"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file format is commonly used to load structured data into Snowflake stages?",
        options: ["JSON, CSV, or Parquet", "XLSX only", "DOCX", "PDF"],
        correctAnswer: "JSON, CSV, or Parquet",
        explanation:
          "Snowflake supports structured data via CSV/TSV, JSON, and Parquet files placed in internal or external stages.",
      },
      associatedSkills: ["snowflake"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which SQL statement loads data from a named stage into a target table?",
        options: [
          "COPY INTO target_table FROM @stage/files;",
          "INSERT OVERWRITE target_table",
          "LOAD DATA INPATH",
          "MERGE INTO target_table",
        ],
        correctAnswer: "COPY INTO target_table FROM @stage/files;",
        explanation:
          "COPY INTO is the Snowflake command used to load staged files into tables.",
      },
      associatedSkills: ["snowflake"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which concept allows zero-copy cloning of databases or tables?",
        options: ["CLONE", "SNAPSHOT", "BACKUP", "CACHE"],
        correctAnswer: "CLONE",
        explanation:
          "Creating a clone references existing micro-partitions, enabling rapid branching without duplicating data.",
      },
      associatedSkills: ["snowflake"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which Snowflake feature automatically partitions data for pruning?",
        options: [
          "Micro-partitions",
          "Buckets",
          "Shards",
          "HFiles",
        ],
        correctAnswer: "Micro-partitions",
        explanation:
          "Snowflake stores data in micro-partitions and maintains metadata for pruning without manual partitioning.",
      },
      associatedSkills: ["snowflake"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which command grants a role access to a warehouse?",
        options: [
          "GRANT USAGE ON WAREHOUSE warehouse_name TO ROLE analyst;",
          "GRANT WAREHOUSE TO ROLE analyst;",
          "GRANT ROLE analyst ON WAREHOUSE;",
          "ALTER ROLE analyst SET warehouse",
        ],
        correctAnswer: "GRANT USAGE ON WAREHOUSE warehouse_name TO ROLE analyst;",
        explanation:
          "Granting USAGE on the warehouse allows the role to start and use the compute resource.",
      },
      associatedSkills: ["snowflake"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which feature continuously ingests files from cloud storage with minimal latency?",
        options: [
          "Snowpipe",
          "External table",
          "Streams",
          "Tasks",
        ],
        correctAnswer: "Snowpipe",
        explanation:
          "Snowpipe listens for notifications from cloud storage and loads new data with serverless compute.",
      },
      associatedSkills: ["snowflake"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which SQL construct enables change data capture by tracking inserts/updates/deletes?",
        options: ["Streams", "Views", "Stages", "Sequences"],
        correctAnswer: "Streams",
        explanation:
          "Streams track changes to tables over time so downstream tasks can process incremental data.",
      },
      associatedSkills: ["snowflake"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which approach optimizes cost for unpredictable workloads?",
        options: [
          "Auto-suspend warehouses and enable auto-resume",
          "Use maximum-size warehouses always",
          "Disable resource monitors",
          "Clone warehouses frequently",
        ],
        correctAnswer: "Auto-suspend warehouses and enable auto-resume",
        explanation:
          "Auto-suspend turns off compute when idle, and auto-resume brings it back online automatically, minimizing credits consumed.",
      },
      associatedSkills: ["snowflake"],
    },
  ],
};
