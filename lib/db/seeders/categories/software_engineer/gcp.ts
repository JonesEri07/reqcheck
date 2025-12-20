import { SkillSeedData } from "../../types";

export const gcpSeed: SkillSeedData = {
  skills: [
    {
      skillName: "GCP",
      skillNormalized: "gcp",
      aliases: ["google cloud", "google cloud platform"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which service provides object storage similar to Amazon S3?",
        options: [
          "Cloud Storage",
          "Cloud SQL",
          "BigQuery",
          "Persistent Disks",
        ],
        correctAnswer: "Cloud Storage",
        explanation:
          "Cloud Storage buckets store unstructured data and integrate with signed URLs, lifecycle rules, and multi-region replication.",
      },
      associatedSkills: ["gcp"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which managed SQL database supports MySQL, PostgreSQL, and SQL Server engines?",
        options: [
          "Cloud SQL",
          "Spanner",
          "Firestore",
          "Bigtable",
        ],
        correctAnswer: "Cloud SQL",
        explanation:
          "Cloud SQL is a managed relational service for popular open-source RDBMS engines, handling backups and patching.",
      },
      associatedSkills: ["gcp"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which product analyzes large datasets using SQL without managing servers?",
        options: ["BigQuery", "Dataproc", "Dataflow", "Pub/Sub"],
        correctAnswer: "BigQuery",
        explanation:
          "BigQuery is a serverless data warehouse that runs SQL queries at petabyte scale with on-demand pricing.",
      },
      associatedSkills: ["gcp"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which tool manages infrastructure using declarative configs on GCP?",
        options: ["Deployment Manager", "Cloud Code", "Cloud Shell", "Artifact Registry"],
        correctAnswer: "Deployment Manager",
        explanation:
          "Deployment Manager deploys resources defined in YAML/Jinja/Python templates similar to CloudFormation.",
      },
      associatedSkills: ["gcp"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which resource ensures least-privilege access to other services?",
        options: ["IAM roles and service accounts", "VPC firewalls only", "Cloud Armor", "Cloud CDN"],
        correctAnswer: "IAM roles and service accounts",
        explanation:
          "IAM service accounts represent workloads and can be granted fine-grained roles for specific APIs.",
      },
      associatedSkills: ["gcp"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the gcloud command to deploy a new Cloud Run service.",
        segments: [
          { text: "gcloud run deploy my-api --", block: false },
          { text: "image", block: true },
          { text: "=us-docker.pkg.dev/project/app/api:latest --", block: false },
          { text: "platform", block: true },
          { text: " managed --region=us-central1", block: false },
        ],
        blocks: ["image", "source", "platform", "service"],
        correctAnswer: ["image", "platform"],
        explanation:
          "Deploying Cloud Run requires specifying the container image and platform (managed or gke).",
      },
      associatedSkills: ["gcp"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which service provides publish/subscribe messaging with at-least-once delivery?",
        options: ["Pub/Sub", "Cloud Tasks", "Cloud Functions", "Memorystore"],
        correctAnswer: "Pub/Sub",
        explanation:
          "Pub/Sub decouples services through asynchronous messaging with push/pull subscriptions and dead-letter queues.",
      },
      associatedSkills: ["gcp"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "You need a regional, horizontally scalable NoSQL database for time-series data. Which should you choose?",
        options: ["Cloud Bigtable", "Firestore", "Cloud SQL", "Memorystore"],
        correctAnswer: "Cloud Bigtable",
        explanation:
          "Bigtable is a wide-column store optimized for low-latency, high-throughput workloads such as IoT or analytics.",
      },
      associatedSkills: ["gcp"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To provide globally consistent transactions across regions, which database should you deploy?",
        options: ["Cloud Spanner", "BigQuery", "Firestore in Datastore mode", "Cloud SQL"],
        correctAnswer: "Cloud Spanner",
        explanation:
          "Cloud Spanner offers globally distributed, strongly consistent relational storage with SQL and horizontal scaling.",
      },
      associatedSkills: ["gcp"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which service provides managed SSL termination and autoscaling for HTTP(S) traffic across multiple backends?",
        options: [
          "Cloud Load Balancing",
          "Cloud Armor",
          "Cloud CDN alone",
          "VPC peering",
        ],
        correctAnswer: "Cloud Load Balancing",
        explanation:
          "Cloud Load Balancing offers global anycast IPs, autoscaling, health checks, and integrates with backend services across regions.",
      },
      associatedSkills: ["gcp"],
    },
  ],
};
