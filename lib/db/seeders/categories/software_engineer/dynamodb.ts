import { SkillSeedData } from "../../types.js";

export const dynamodbSeed: SkillSeedData = {
  skills: [
    {
      skillName: "DynamoDB",
      skillNormalized: "dynamodb",
      aliases: ["dynamo"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which key attribute is mandatory for every DynamoDB table?",
        options: [
          "Partition key",
          "Sort key",
          "Global secondary index",
          "Local secondary index",
        ],
        correctAnswer: "Partition key",
        explanation:
          "Every table must have a partition (hash) key to determine item placement; sort keys are optional.",
      },
      associatedSkills: ["dynamodb"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which operation retrieves a single item by key?",
        options: ["GetItem", "Query", "Scan", "BatchWriteItem"],
        correctAnswer: "GetItem",
        explanation:
          "GetItem directly fetches one item using primary key values, consuming consistent read capacity.",
      },
      associatedSkills: ["dynamodb"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you enable automatic removal of expired items?",
        options: ["Time to Live (TTL)", "Streams", "Backups", "DAX"],
        correctAnswer: "Time to Live (TTL)",
        explanation:
          "TTL deletes items whose configured attribute timestamp is older than the current time.",
      },
      associatedSkills: ["dynamodb"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What is DynamoDB Streams used for?",
        options: [
          "Capturing item-level changes",
          "Serving HTTP responses",
          "Backing up tables automatically",
          "Encrypting data at rest",
        ],
        correctAnswer: "Capturing item-level changes",
        explanation:
          "Streams provide a time-ordered sequence of changes for triggers, event sourcing, or Lambda processing.",
      },
      associatedSkills: ["dynamodb"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which capacity mode bills you strictly per request without managing WCU/RCU settings?",
        options: ["On-demand", "Provisioned", "Reserved", "Auto scaling"],
        correctAnswer: "On-demand",
        explanation:
          "On-demand capacity automatically accommodates spikes and charges per read/write request unit consumed.",
      },
      associatedSkills: ["dynamodb"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "To query by a non-key attribute while keeping base table throughput unaffected, which feature should you use?",
        options: [
          "Global secondary index (GSI)",
          "Local secondary index (LSI)",
          "Scan with FilterExpression",
          "DAX caching layer",
        ],
        correctAnswer: "Global secondary index (GSI)",
        explanation:
          "GSIs maintain their own partition/sort keys and throughput, enabling alternative access patterns.",
      },
      associatedSkills: ["dynamodb"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the PartiQL statement that deletes an item by primary key.",
        segments: [
          { text: "DELETE FROM Orders WHERE orderId = ", block: true },
          { text: " ? AND customerId = ?;", block: false },
        ],
        blocks: [":orderId", "?", "orderId", "=", "SET"],
        correctAnswer: ["?"],
        explanation:
          "PartiQL uses positional parameters marked with ? to bind key values at runtime.",
      },
      associatedSkills: ["dynamodb"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which API guarantees that either all writes succeed or none do?",
        options: [
          "TransactWriteItems",
          "BatchWriteItem",
          "BatchGetItem",
          "UpdateItem",
        ],
        correctAnswer: "TransactWriteItems",
        explanation:
          "Transactions ensure ACID semantics across up to 25 items or tables, unlike batch operations which may succeed partially.",
      },
      associatedSkills: ["dynamodb"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "You observe hot partitions caused by uneven key distribution. Which mitigation helps without redesigning keys?",
        options: [
          "Enable adaptive capacity and auto scaling",
          "Switch to strongly consistent reads",
          "Increase DynamoDB Streams shards",
          "Disable encryption at rest",
        ],
        correctAnswer: "Enable adaptive capacity and auto scaling",
        explanation:
          "Adaptive capacity reallocates throughput to the busiest partitions, reducing throttling when access patterns spike.",
      },
      associatedSkills: ["dynamodb"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which caching layer provides microsecond latency read replicas for DynamoDB without changing application logic?",
        options: ["DAX (DynamoDB Accelerator)", "Elasticache Redis", "CloudFront", "S3 Transfer Acceleration"],
        correctAnswer: "DAX (DynamoDB Accelerator)",
        explanation:
          "DAX is a managed, write-through cache on top of DynamoDB with SDK support, reducing read latency for eventually consistent workloads.",
      },
      associatedSkills: ["dynamodb"],
    },
  ],
};
