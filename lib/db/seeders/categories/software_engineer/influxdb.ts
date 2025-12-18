import { SkillSeedData } from "../../types.js";

export const influxdbSeed: SkillSeedData = {
  skills: [
    {
      skillName: "InfluxDB",
      skillNormalized: "influxdb",
      aliases: ["time series database"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "InfluxDB is optimized for which workload?",
        options: [
          "Time-series data",
          "Document storage",
          "Graph queries",
          "Full-text search",
        ],
        correctAnswer: "Time-series data",
        explanation:
          "InfluxDB focuses on high-ingest, time-ordered measurements like metrics or IoT events.",
      },
      associatedSkills: ["influxdb"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which language is used for querying InfluxDB 2.x?",
        options: ["Flux", "SQL", "Cypher", "Gremlin"],
        correctAnswer: "Flux",
        explanation:
          "InfluxDB 2.x introduces Flux, a functional data scripting language for querying and processing time-series data.",
      },
      associatedSkills: ["influxdb"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which InfluxDB concept groups measurements sharing retention policies?",
        options: ["Bucket", "Database", "Collection", "Topic"],
        correctAnswer: "Bucket",
        explanation:
          "Buckets replace databases/retention policies, pairing a data store with retention duration.",
      },
      associatedSkills: ["influxdb"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which line protocol field represents timestamp?",
        options: ["The trailing integer", "First token", "Measurement name", "Tag set"],
        correctAnswer: "The trailing integer",
        explanation:
          "Line protocol uses measurement, tags, fields, and finally an optional nanosecond timestamp integer.",
      },
      associatedSkills: ["influxdb"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you write data via CLI?",
        options: [
          "influx write --bucket myBucket",
          "influx insert",
          "write influxdb",
          "curl /write only",
        ],
        correctAnswer: "influx write --bucket myBucket",
        explanation:
          "The influx CLI write command ingests line protocol data into a bucket.",
      },
      associatedSkills: ["influxdb"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the Flux query that aggregates CPU usage per host.",
        segments: [
          { text: "from(bucket: \"system\")\n  |> range(start: -1h)\n  |> filter(fn: (r) => r._measurement == \"cpu\" and r._field == \"usage_system\")\n  |> ", block: false },
          { text: "group", block: true },
          { text: "(columns: [\"host\"])\n  |> mean()", block: false },
        ],
        blocks: ["group", "filter", "rename"],
        correctAnswer: ["group"],
        explanation:
          "Grouping by host ensures the mean is computed per host instead of across the entire dataset.",
      },
      associatedSkills: ["influxdb"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which feature down-samples data by automatically writing aggregated points to another bucket?",
        options: [
          "Tasks",
          "Kapacitor alerts",
          "Annotations",
          "Checks",
        ],
        correctAnswer: "Tasks",
        explanation:
          "Tasks scheduled Flux scripts to roll up metrics (e.g., average per hour) into a separate bucket.",
      },
      associatedSkills: ["influxdb"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which API authentication mechanism should production workloads use?",
        options: [
          "Tokens scoped to organizations/buckets",
          "Username/password in query params",
          "Anonymous access",
          "Cookies",
        ],
        correctAnswer: "Tokens scoped to organizations/buckets",
        explanation:
          "InfluxDB 2.x uses tokens with read/write permissions per bucket, set in the Authorization header.",
      },
      associatedSkills: ["influxdb"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To retain raw high-frequency data briefly but keep rollups long term, which design is recommended?",
        options: [
          "Separate buckets with different retention policies",
          "Single bucket with infinite retention",
          "Manual exports to CSV",
          "Rely on client caching",
        ],
        correctAnswer: "Separate buckets with different retention policies",
        explanation:
          "Use a short-retention bucket for raw data and another bucket storing down-sampled points for long-term analytics.",
      },
      associatedSkills: ["influxdb"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which storage engine improvement in InfluxDB IOx (InfluxDB 3.0) enhances query performance on large datasets?",
        options: [
          "Apache Arrow columnar storage",
          "MySQL row storage",
          "Flat files only",
          "LevelDB",
        ],
        correctAnswer: "Apache Arrow columnar storage",
        explanation:
          "IOx stores data in Apache Arrow format, improving analytical queries and enabling object storage tiers.",
      },
      associatedSkills: ["influxdb"],
    },
  ],
};
