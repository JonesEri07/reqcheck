import { SkillSeedData } from "../../types.js";

export const postgresqlSeed: SkillSeedData = {
  skills: [
    {
      skillName: "PostgreSQL",
      skillNormalized: "postgresql",
      aliases: ["postgres", "pg"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command-line client connects to PostgreSQL?",
        options: ["psql", "mysql", "mongo", "sqlite3"],
        correctAnswer: "psql",
        explanation:
          "psql is PostgreSQL's interactive terminal and runs SQL commands against databases.",
      },
      associatedSkills: ["postgresql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which data type stores JSON documents natively?",
        options: ["jsonb", "text", "varchar", "xml"],
        correctAnswer: "jsonb",
        explanation:
          "jsonb stores normalized binary JSON, enabling indexing and efficient queries.",
      },
      associatedSkills: ["postgresql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which SQL keyword returns the first N rows?",
        options: ["LIMIT", "TOP", "ROWNUM", "FETCH FIRST"],
        correctAnswer: "LIMIT",
        explanation:
          "PostgreSQL uses LIMIT <n> [OFFSET m] to constrain result sets.",
      },
      associatedSkills: ["postgresql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which default schema contains user tables?",
        options: ["public", "dbo", "main", "default"],
        correctAnswer: "public",
        explanation:
          "Unless otherwise set, objects are created in the public schema, accessible via search_path.",
      },
      associatedSkills: ["postgresql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command lists databases in psql?",
        options: ["\\l", "\\dt", "\\du", "\\q"],
        correctAnswer: "\\l",
        explanation:
          "\\l (or \\list) displays databases; \\dt lists tables, \\du lists roles.",
      },
      associatedSkills: ["postgresql"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the statement that adds a GIN index on a jsonb column.",
        segments: [
          { text: "CREATE INDEX idx_data_tags ON events USING ", block: false },
          { text: "GIN", block: true },
          { text: " (tags);", block: false },
        ],
        blocks: ["GIN", "BTREE", "HASH"],
        correctAnswer: ["GIN"],
        explanation:
          "GIN indexes support jsonb containment queries; BTREE suits scalar equality/range comparisons.",
      },
      associatedSkills: ["postgresql"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which feature replicates WAL changes to standby servers for high availability?",
        options: ["Streaming replication", "Logical decoding only", "Triggers", "Foreign data wrapper"],
        correctAnswer: "Streaming replication",
        explanation:
          "Streaming replication sends WAL segments to standby servers, enabling hot standby and failover.",
      },
      associatedSkills: ["postgresql"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which SQL clause updates rows if they conflict during INSERT?",
        options: [
          "ON CONFLICT ... DO UPDATE",
          "MERGE INTO",
          "UPSERT ROW",
          "REPLACE ROW",
        ],
        correctAnswer: "ON CONFLICT ... DO UPDATE",
        explanation:
          "PostgreSQL implements upsert via INSERT ... ON CONFLICT (columns) DO UPDATE/NOTHING.",
      },
      associatedSkills: ["postgresql"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To scale reads/have logical subscriptions, which feature streams table changes to consumers?",
        options: [
          "Logical replication slots (pgoutput)",
          "Foreign tables",
          "Materialized views",
          "HOT updates",
        ],
        correctAnswer: "Logical replication slots (pgoutput)",
        explanation:
          "Logical replication slots decode WAL into row-level changes for subscribers or CDC pipelines.",
      },
      associatedSkills: ["postgresql"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which extension provides time-series capabilities (compression, hypertables)?",
        options: ["TimescaleDB", "PostGIS", "pg_cron", "citext"],
        correctAnswer: "TimescaleDB",
        explanation:
          "TimescaleDB builds on PostgreSQL to add hypertables, policies, and chunk compression for time-series data.",
      },
      associatedSkills: ["postgresql"],
    },
  ],
};
