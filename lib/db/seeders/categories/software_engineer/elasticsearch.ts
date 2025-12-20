import { SkillSeedData } from "../../types";

export const elasticsearchSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Elasticsearch",
      skillNormalized: "elasticsearch",
      aliases: ["elastic", "elk"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which REST endpoint checks cluster health?",
        options: [
          "GET /_cluster/health",
          "GET /_cat/indices",
          "GET /_search",
          "GET /_nodes/stats",
        ],
        correctAnswer: "GET /_cluster/health",
        explanation:
          "The cluster health API returns green/yellow/red states plus shard info to monitor resiliency.",
      },
      associatedSkills: ["elasticsearch"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which field type stores full-text data analyzed into tokens?",
        options: ["text", "keyword", "integer", "boolean"],
        correctAnswer: "text",
        explanation:
          "text fields pass values through an analyzer for inverted index search, while keyword fields keep exact values.",
      },
      associatedSkills: ["elasticsearch"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does an index represent in Elasticsearch?",
        options: [
          "A logical namespace for documents and shards",
          "A single document",
          "A SQL table row",
          "Only metadata",
        ],
        correctAnswer: "A logical namespace for documents and shards",
        explanation:
          "Indices are analogous to databases/tables that route documents to underlying shards.",
      },
      associatedSkills: ["elasticsearch"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command lists indices along with health and size?",
        options: [
          "GET /_cat/indices?v",
          "GET /_cluster/settings",
          "POST /_bulk",
          "GET /_mget",
        ],
        correctAnswer: "GET /_cat/indices?v",
        explanation:
          "_cat APIs provide human-readable summaries; _cat/indices shows status, docs, and store size.",
      },
      associatedSkills: ["elasticsearch"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which analyzer removes stop words and lowercases tokens by default?",
        options: ["standard", "keyword", "whitespace", "fingerprint"],
        correctAnswer: "standard",
        explanation:
          "The standard analyzer tokenizes on word boundaries, lowercases, and removes most English stop words.",
      },
      associatedSkills: ["elasticsearch"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the bool query to match documents tagged 'error' OR 'warning'.",
        segments: [
          { text: "{\n  \"query\": {\n    \"bool\": {\n      \"should\": [\n        { \"term\": { \"level\": \"error\" } },\n        { \"term\": { \"level\": \"warning\" } }\n      ],\n      \"", block: false },
          { text: "minimum_should_match", block: true },
          { text: "\": 1\n    }\n  }\n}", block: false },
        ],
        blocks: ["minimum_should_match", "must", "filter", "boost"],
        correctAnswer: ["minimum_should_match"],
        explanation:
          "minimum_should_match ensures at least one should clause matches even when no must clauses exist.",
      },
      associatedSkills: ["elasticsearch"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which aggregation would you use to compute the average duration field?",
        options: ["avg", "terms", "date_histogram", "top_hits"],
        correctAnswer: "avg",
        explanation:
          "The avg aggregation calculates the mean numeric value for matching documents.",
      },
      associatedSkills: ["elasticsearch"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How do you ensure a field can be both analyzed for search and kept as an exact keyword?",
        options: [
          "Use multi-fields with a keyword subfield",
          "Create two separate indices",
          "Enable eager_global_ordinals",
          "Store the field twice in the same mapping",
        ],
        correctAnswer: "Use multi-fields with a keyword subfield",
        explanation:
          "Multi-fields let you index the same logical field with different analyzers (e.g., text + keyword).",
      },
      associatedSkills: ["elasticsearch"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "You need zero-downtime reindexing when a mapping change is required. What is the typical approach?",
        options: [
          "Create a new index, reindex data, and switch an alias atomically",
          "Update mapping in place via PUT _mapping",
          "Restart the cluster",
          "Delete the index and recreate it",
        ],
        correctAnswer: "Create a new index, reindex data, and switch an alias atomically",
        explanation:
          "Most mapping changes require a new index; using aliases allows seamless switchover without downtime.",
      },
      associatedSkills: ["elasticsearch"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Snapshots store backups in external repositories. Which of the following is true?",
        options: [
          "Snapshots are incremental, storing only changed segments",
          "Snapshots block writes until completion",
          "Snapshots can only target local disk",
          "Snapshots require the cluster to be green first",
        ],
        correctAnswer: "Snapshots are incremental, storing only changed segments",
        explanation:
          "Elasticsearch snapshots are incremental and can be stored on S3, Azure, etc., minimizing storage usage while allowing restores.",
      },
      associatedSkills: ["elasticsearch"],
    },
  ],
};
