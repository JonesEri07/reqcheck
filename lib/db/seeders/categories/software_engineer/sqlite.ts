import { SkillSeedData } from "../../types.js";

export const sqliteSeed: SkillSeedData = {
  skills: [
    {
      skillName: "SQLite",
      skillNormalized: "sqlite",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI opens an interactive SQLite shell?",
        options: ["sqlite3", "psql", "mysql", "mongo"],
        correctAnswer: "sqlite3",
        explanation:
          "sqlite3 file.db opens the database file (creating it if missing) in an interactive shell.",
      },
      associatedSkills: ["sqlite"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command shows all tables in SQLite?",
        options: [".tables", "\\dt", "SHOW TABLES;", "PRAGMA tables;"],
        correctAnswer: ".tables",
        explanation:
          "Within sqlite3, .tables lists tables; .schema shows CREATE statements.",
      },
      associatedSkills: ["sqlite"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file format stores SQLite databases?",
        options: ["Single cross-platform file", "Client-server binary log", "Multiple shards", "JSON only"],
        correctAnswer: "Single cross-platform file",
        explanation:
          "SQLite stores all data in a single file, making it easy to embed or ship with applications.",
      },
      associatedSkills: ["sqlite"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which pragma enables foreign key enforcement?",
        options: ["PRAGMA foreign_keys = ON;", "PRAGMA fk = TRUE;", "SET foreign_keys = 1;", "ALTER DATABASE enable_fk;"],
        correctAnswer: "PRAGMA foreign_keys = ON;",
        explanation:
          "Foreign keys are disabled by default; PRAGMA foreign_keys = ON enables enforcement per connection.",
      },
      associatedSkills: ["sqlite"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which data type stores arbitrary text strings?",
        options: ["TEXT", "BLOB", "INTEGER", "REAL"],
        correctAnswer: "TEXT",
        explanation:
          "SQLite uses dynamic typing, but TEXT columns store strings under Unicode encoding.",
      },
      associatedSkills: ["sqlite"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the SQL that upserts rows using ON CONFLICT.",
        segments: [
          { text: "INSERT INTO inventory(id, quantity) VALUES(?, ?)\nON CONFLICT(id) DO UPDATE SET quantity = ", block: false },
          { text: "excluded", block: true },
          { text: ".quantity;", block: false },
        ],
        blocks: ["excluded", "conflict", "new"],
        correctAnswer: ["excluded"],
        explanation:
          "The excluded table references values that would have been inserted, allowing updates.",
      },
      associatedSkills: ["sqlite"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which journaling mode provides crash protection with better concurrent reads?",
        options: ["WAL (Write-Ahead Logging)", "DELETE", "TRUNCATE", "OFF"],
        correctAnswer: "WAL (Write-Ahead Logging)",
        explanation:
          "PRAGMA journal_mode = WAL stores writes in a separate log, improving read concurrency.",
      },
      associatedSkills: ["sqlite"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which command imports CSV data into a table from the sqlite3 shell?",
        options: [
          ".mode csv\n.import file.csv table_name",
          "COPY ... FROM csv",
          ".import csv file table",
          "LOAD CSV file table",
        ],
        correctAnswer: ".mode csv\n.import file.csv table_name",
        explanation:
          "Set .mode csv, then .import file.csv table to bulk load CSV content.",
      },
      associatedSkills: ["sqlite"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which feature enables encryption-at-rest in SQLite?",
        options: [
          "SEE/SQLCipher extensions",
          "PRAGMA secure=ON",
          "Default binary format",
          "WAL journal",
        ],
        correctAnswer: "SEE/SQLCipher extensions",
        explanation:
          "SQLite Encryption Extension (SEE) or SQLCipher provide AES encryption for database files.",
      },
      associatedSkills: ["sqlite"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which pragma optimizes queries by gathering statistics on indexes?",
        options: [
          "ANALYZE",
          "OPTIMIZE",
          "VACUUM",
          "AUTOINDEX",
        ],
        correctAnswer: "ANALYZE",
        explanation:
          "ANALYZE gathers statistics used by the query planner to choose efficient index strategies.",
      },
      associatedSkills: ["sqlite"],
    },
  ],
};
