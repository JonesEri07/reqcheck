import { SkillSeedData } from "../../types";

export const redshiftSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Redshift",
      skillNormalized: "redshift",
      aliases: ["amazon redshift", "aws redshift"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Amazon Redshift is best described as which type of AWS service?",
        options: [
          "Managed cloud data warehouse",
          "Streaming message bus",
          "Document database",
          "Queueing service",
        ],
        correctAnswer: "Managed cloud data warehouse",
        explanation:
          "Redshift is AWS's columnar MPP data warehouse optimized for analytical queries.",
      },
      associatedSkills: ["redshift"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which SQL command copies data from Amazon S3 into a Redshift table?",
        options: [
          "COPY table FROM 's3://bucket/path' CREDENTIALS ...",
          "LOAD DATA INFILE ...",
          "INSERT OVERWRITE",
          "BULK INSERT",
        ],
        correctAnswer:
          "COPY table FROM 's3://bucket/path' CREDENTIALS ...",
        explanation:
          "COPY is the preferred high-performance bulk load command for Redshift.",
      },
      associatedSkills: ["redshift"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which node type hosts only storage and relies on a leader node for coordination?",
        options: [
          "Compute nodes",
          "Leader nodes",
          "Primary nodes",
          "Replica nodes",
        ],
        correctAnswer: "Compute nodes",
        explanation:
          "In Redshift, compute nodes store data and execute queries as directed by the leader node.",
      },
      associatedSkills: ["redshift"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which column encoding can dramatically reduce table size?",
        options: ["Column compression (encodings)", "Row-level encryption", "Row padding", "Bitmap indexes"],
        correctAnswer: "Column compression (encodings)",
        explanation:
          "Choosing appropriate column encodings (e.g., ZSTD, LZO) reduces storage footprint and improves scan performance.",
      },
      associatedSkills: ["redshift"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which SQL command reclaims space after massive deletes?",
        options: ["VACUUM", "OPTIMIZE TABLE", "FLUSH TABLE", "COMPACT"],
        correctAnswer: "VACUUM",
        explanation:
          "VACUUM reorganizes tables, sorts data, and reclaims deleted space in Redshift.",
      },
      associatedSkills: ["redshift"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which distribution style minimizes data movement for fact-to-dimension joins?",
        options: [
          "DISTSTYLE KEY on the join column",
          "DISTSTYLE EVEN",
          "DISTSTYLE ALL on the fact",
          "DISTSTYLE AUTO on the dimension",
        ],
        correctAnswer: "DISTSTYLE KEY on the join column",
        explanation:
          "Key distribution collocates rows sharing the same key, reducing redistribution during joins.",
      },
      associatedSkills: ["redshift"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which table property ensures frequently used small tables are replicated to all nodes?",
        options: [
          "DISTSTYLE ALL",
          "SORTKEY",
          "ENCODING AUTO",
          "MAXBLOCKSIZE",
        ],
        correctAnswer: "DISTSTYLE ALL",
        explanation:
          "DISTSTYLE ALL copies the entire table to each compute node, ideal for small dimension tables joined often.",
      },
      associatedSkills: ["redshift"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which service provides temporary isolation for short-lived workloads without affecting other queries?",
        options: [
          "Concurrency Scaling",
          "Spectrum",
          "Elastic Resize",
          "WLm queue hopping",
        ],
        correctAnswer: "Concurrency Scaling",
        explanation:
          "Concurrency Scaling spins up transient compute clusters to handle bursts, maintaining performance for other workloads.",
      },
      associatedSkills: ["redshift"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which feature lets you query data in Amazon S3 without loading it into Redshift tables?",
        options: [
          "Redshift Spectrum",
          "AWS Glue",
          "Aurora Serverless",
          "Neptune",
        ],
        correctAnswer: "Redshift Spectrum",
        explanation:
          "Spectrum allows external tables that reference S3 data and pushes down filters to the S3 layer.",
      },
      associatedSkills: ["redshift"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which best practice improves WLM performance for mixed workloads?",
        options: [
          "Configure multiple queues with memory percent and slot settings",
          "Keep all queries in the default queue",
          "Disable automatic WLM",
          "Set max_concurrency_scaling_clusters to zero",
        ],
        correctAnswer:
          "Configure multiple queues with memory percent and slot settings",
        explanation:
          "Proper WLM configuration isolates ETL, ad-hoc, and reporting queries to avoid resource contention.",
      },
      associatedSkills: ["redshift"],
    },
  ],
};
