import { SkillSeedData } from "../../types";

export const oracleSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Oracle",
      skillNormalized: "oracle",
      aliases: ["oracle database"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which SQL*Plus command connects to an Oracle database?",
        options: ["sqlplus user/password@ORCL", "connect ORCL user password", "oracle login", "sqlconnect user"],
        correctAnswer: "sqlplus user/password@ORCL",
        explanation:
          "sqlplus uses user/password@serviceName to connect via TNS aliases or EZConnect.",
      },
      associatedSkills: ["oracle"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which data type stores variable-length strings up to 4,000 bytes?",
        options: ["VARCHAR2", "CHAR", "CLOB", "NVARCHAR2"],
        correctAnswer: "VARCHAR2",
        explanation:
          "VARCHAR2 stores variable character data up to 4000 bytes (extended data types allow more).",
      },
      associatedSkills: ["oracle"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which tool manages Oracle schemas, tables, and PL/SQL objects via GUI?",
        options: ["SQL Developer", "pgAdmin", "SSMS", "DataGrip only"],
        correctAnswer: "SQL Developer",
        explanation:
          "Oracle SQL Developer is the official GUI for database management.",
      },
      associatedSkills: ["oracle"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which SQL clause limits rows in Oracle 12c+?",
        options: ["FETCH FIRST 10 ROWS ONLY", "LIMIT 10", "TOP 10", "ROWNUM LIMIT 10"],
        correctAnswer: "FETCH FIRST 10 ROWS ONLY",
        explanation:
          "Oracle 12c introduced ANSI-compliant FETCH FIRST; older versions rely on ROWNUM filters.",
      },
      associatedSkills: ["oracle"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which feature stores compiled procedural code in Oracle?",
        options: ["PL/SQL packages", "Stored procs only", "Triggers only", "External procedures"],
        correctAnswer: "PL/SQL packages",
        explanation:
          "Packages group procedures, functions, and variables, promoting modular PL/SQL design.",
      },
      associatedSkills: ["oracle"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the query returning session info for the current user.",
        segments: [
          { text: "SELECT * FROM ", block: false },
          { text: "v$session", block: true },
          { text: " WHERE audsid = USERENV('SESSIONID');", block: false },
        ],
        blocks: ["v$session", "dba_users", "user_tables"],
        correctAnswer: ["v$session"],
        explanation:
          "V$SESSION stores active session metadata; filtering by USERENV('SESSIONID') returns the current session.",
      },
      associatedSkills: ["oracle"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which partitioning strategy splits data by range of values (e.g., dates)?",
        options: ["Range partitioning", "Hash partitioning", "List partitioning", "Composite range-hash only"],
        correctAnswer: "Range partitioning",
        explanation:
          "Range partitioning divides tables by value intervals (e.g., per month), simplifying pruning and maintenance.",
      },
      associatedSkills: ["oracle"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which Oracle feature provides row-level security policies enforced by the database?",
        options: [
          "Virtual Private Database (VPD) / Fine-Grained Access Control",
          "Materialized views",
          "Data Guard",
          "Flashback Query",
        ],
        correctAnswer: "Virtual Private Database (VPD) / Fine-Grained Access Control",
        explanation:
          "VPD policies modify queries transparently to enforce row-level filtering based on session context.",
      },
      associatedSkills: ["oracle"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which technology replicates Oracle databases asynchronously for disaster recovery?",
        options: ["Data Guard (physical/logical standby)", "GoldenGate only", "Streams", "RAC"],
        correctAnswer: "Data Guard (physical/logical standby)",
        explanation:
          "Data Guard maintains standby databases via redo apply; GoldenGate provides logical replication but Data Guard is built-in for DR.",
      },
      associatedSkills: ["oracle"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which approach captures table changes for downstream ETL without triggers?",
        options: [
          "Change Data Capture (CDC) using LogMiner or GoldenGate",
          "Manual polling only",
          "DBMS_ALERT",
          "Flashback Table",
        ],
        correctAnswer: "Change Data Capture (CDC) using LogMiner or GoldenGate",
        explanation:
          "LogMiner/GoldenGate read redo logs to emit change streams, enabling CDC without trigger overhead.",
      },
      associatedSkills: ["oracle"],
    },
  ],
};
