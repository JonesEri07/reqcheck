import { SkillSeedData } from "../../types";

export const apacheSparkSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Apache Spark",
      skillNormalized: "apache spark",
      aliases: ["spark", "pyspark"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Spark abstraction represents an immutable distributed collection?",
        options: ["RDD", "UDF", "Driver", "Accumulator"],
        correctAnswer: "RDD",
        explanation:
          "Resilient Distributed Datasets (RDDs) are Spark's original core abstraction for distributed data.",
      },
      associatedSkills: ["apache spark"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method in PySpark reads a CSV file into a DataFrame?",
        options: [
          "spark.read.csv(\"path\")",
          "spark.write.csv(\"path\")",
          "spark.sql(\"SELECT *\")",
          "spark.stop()",
        ],
        correctAnswer: "spark.read.csv(\"path\")",
        explanation:
          "spark.read.csv loads a CSV file into a Spark DataFrame with optional schema and options.",
      },
      associatedSkills: ["apache spark"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What component coordinates all executors in a Spark application?",
        options: ["Driver", "Executor", "Worker", "Shuffle service"],
        correctAnswer: "Driver",
        explanation:
          "The driver process orchestrates jobs, schedules tasks, and communicates with cluster managers and executors.",
      },
      associatedSkills: ["apache spark"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Spark API is best suited for SQL-style analytics?",
        options: ["Spark SQL/DataFrame API", "GraphX", "MLlib", "Structured Streaming"],
        correctAnswer: "Spark SQL/DataFrame API",
        explanation:
          "DataFrames and Spark SQL provide optimized relational operations that feel like SQL queries.",
      },
      associatedSkills: ["apache spark"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which transformation returns a new RDD or DataFrame without triggering execution?",
        options: ["map", "collect", "count", "show"],
        correctAnswer: "map",
        explanation:
          "Transformations like map, filter, or select build a logical plan. Actions such as collect or count trigger execution.",
      },
      associatedSkills: ["apache spark"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which command registers a DataFrame as a temporary SQL view?",
        options: [
          "df.createOrReplaceTempView(\"name\")",
          "df.cache(\"name\")",
          "spark.catalog.clearCache()",
          "df.write.saveAsTable(\"name\")",
        ],
        correctAnswer: "df.createOrReplaceTempView(\"name\")",
        explanation:
          "createOrReplaceTempView makes the DataFrame queryable via spark.sql within the current session.",
      },
      associatedSkills: ["apache spark"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which file format is typically preferred for columnar analytics in Spark?",
        options: ["Parquet", "CSV", "Text", "JSON"],
        correctAnswer: "Parquet",
        explanation:
          "Parquet is columnar, compressed, and splittable, making it efficient for Spark workloads.",
      },
      associatedSkills: ["apache spark"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "What does the persist(StorageLevel.MEMORY_AND_DISK) call do?",
        options: [
          "Keeps partitions in memory and spills to disk if needed",
          "Writes output to S3",
          "Shuts down idle executors",
          "Triggers an action immediately",
        ],
        correctAnswer: "Keeps partitions in memory and spills to disk if needed",
        explanation:
          "Persisting with MEMORY_AND_DISK caches partitions in RAM but falls back to disk when memory pressure occurs.",
      },
      associatedSkills: ["apache spark"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which Spark feature lets you process late-arriving data with update semantics?",
        options: [
          "Structured Streaming with watermarking",
          "RDD checkpoints",
          "Accumulator variables",
          "Broadcast joins",
        ],
        correctAnswer: "Structured Streaming with watermarking",
        explanation:
          "Watermarks in Structured Streaming allow Spark to handle late data while bounding state for stateful aggregations.",
      },
      associatedSkills: ["apache spark"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which join strategy is best when one table is tiny and the other is massive?",
        options: [
          "Broadcast hash join",
          "Sort-merge join",
          "Shuffle hash join",
          "Cartesian product",
        ],
        correctAnswer: "Broadcast hash join",
        explanation:
          "Broadcasting the small dataset to each executor avoids shuffling the large table and speeds up the join.",
      },
      associatedSkills: ["apache spark"],
    },
  ],
};
