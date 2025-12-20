import { SkillSeedData } from "../../types";

export const mysqlSeed: SkillSeedData = {
  skills: [
    {
      skillName: "MySQL",
      skillNormalized: "mysql",
      aliases: ["mariadb"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command creates a new database in MySQL?",
        options: [
          "CREATE DATABASE analytics;",
          "NEW DATABASE analytics;",
          "ADD DATABASE analytics;",
          "database create analytics;",
        ],
        correctAnswer: "CREATE DATABASE analytics;",
        explanation:
          "CREATE DATABASE defines a schema container for tables and privileges.",
      },
      associatedSkills: ["mysql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which data type stores variable-length strings up to 255 chars?",
        options: ["VARCHAR", "CHAR", "TEXT", "BLOB"],
        correctAnswer: "VARCHAR",
        explanation:
          "VARCHAR(N) stores strings up to N characters with dynamic length; CHAR is fixed-width.",
      },
      associatedSkills: ["mysql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which clause filters rows returned by SELECT?",
        options: ["WHERE", "GROUP BY", "ORDER BY", "LIMIT"],
        correctAnswer: "WHERE",
        explanation:
          "WHERE restricts rows before aggregation; HAVING filters after GROUP BY.",
      },
      associatedSkills: ["mysql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command shows all tables in the current database?",
        options: ["SHOW TABLES;", "LIST TABLES;", "DESCRIBE DATABASE;", "SHOW DATABASES;"],
        correctAnswer: "SHOW TABLES;",
        explanation:
          "SHOW TABLES lists table names within the selected database; SHOW DATABASES lists schemas.",
      },
      associatedSkills: ["mysql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which SQL clause sorts query results?",
        options: ["ORDER BY", "SORT BY", "ARRANGE BY", "ALIGN BY"],
        correctAnswer: "ORDER BY",
        explanation:
          "ORDER BY column ASC|DESC sorts result sets.",
      },
      associatedSkills: ["mysql"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the query that returns total sales per customer.",
        segments: [
          { text: "SELECT customer_id, SUM(total) AS total_spent\nFROM orders\n", block: false },
          { text: "GROUP BY", block: true },
          { text: " customer_id;", block: false },
        ],
        blocks: ["GROUP BY", "HAVING", "ORDER BY"],
        correctAnswer: ["GROUP BY"],
        explanation:
          "Aggregations require GROUP BY to specify grouping columns; otherwise MySQL may reject the query (unless using non-standard SQL modes).",
      },
      associatedSkills: ["mysql"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which index type enforces uniqueness on a column?",
        options: ["UNIQUE index", "FULLTEXT index", "HASH index", "SPATIAL index"],
        correctAnswer: "UNIQUE index",
        explanation:
          "UNIQUE indexes guarantee no duplicate values, optionally allowing one NULL unless configured otherwise.",
      },
      associatedSkills: ["mysql"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which storage engine is default in modern MySQL versions?",
        options: ["InnoDB", "MyISAM", "Memory", "Archive"],
        correctAnswer: "InnoDB",
        explanation:
          "InnoDB supports transactions, row-level locking, and foreign keys, making it the default engine.",
      },
      associatedSkills: ["mysql"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To avoid locking issues during long-running reports, which transaction isolation or access pattern should you use?",
        options: [
          "Use READ COMMITTED or snapshot replication (e.g., read replica)",
          "Use SERIALIZABLE everywhere",
          "Disable autocommit on reporting queries",
          "Lock tables with LOCK TABLES",
        ],
        correctAnswer:
          "Use READ COMMITTED or snapshot replication (e.g., read replica)",
        explanation:
          "Running heavy reads on replicas or with lower isolation reduces contention; SERIALIZABLE causes more locking.",
      },
      associatedSkills: ["mysql"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which MySQL feature allows sharding a table horizontally across servers?",
        options: ["MySQL Fabric / application-level sharding", "Partitioned tables only", "Foreign keys", "Temporary tables"],
        correctAnswer: "MySQL Fabric / application-level sharding",
        explanation:
          "Native MySQL lacks transparent cross-shard distribution; sharding is typically implemented via Fabric or custom logic plus replication.",
      },
      associatedSkills: ["mysql"],
    },
  ],
};
