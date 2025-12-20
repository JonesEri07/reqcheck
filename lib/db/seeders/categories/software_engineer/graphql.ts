import { SkillSeedData } from "../../types";

export const graphqlSeed: SkillSeedData = {
  skills: [
    {
      skillName: "GraphQL",
      skillNormalized: "graphql",
      aliases: ["apollo", "apollo graphql"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which transport protocol is most commonly used for GraphQL APIs on the web?",
        options: ["HTTP", "FTP", "SMTP", "WebRTC"],
        correctAnswer: "HTTP",
        explanation:
          "Most GraphQL servers expose a single HTTP endpoint that handles queries and mutations over POST (and optionally GET).",
      },
      associatedSkills: ["graphql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which operation is used to modify data in GraphQL?",
        options: ["mutation", "query", "subscription", "fragment"],
        correctAnswer: "mutation",
        explanation:
          "Mutations resemble queries but convey intent to change data and often return updated fields.",
      },
      associatedSkills: ["graphql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What keyword defines reusable selections in GraphQL?",
        options: ["fragment", "partial", "include", "spread"],
        correctAnswer: "fragment",
        explanation:
          "Fragments capture groups of fields that can be spread into multiple selections, reducing duplication.",
      },
      associatedSkills: ["graphql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "GraphQL requests must specify which operation field?",
        options: ["selection set", "table name", "REST verb", "resource id"],
        correctAnswer: "selection set",
        explanation:
          "Every query/mutation selects a tree of fields that the server resolves; clients control exactly which fields they get.",
      },
      associatedSkills: ["graphql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which scalar type represents true/false values in GraphQL?",
        options: ["Boolean", "ID", "String", "JSON"],
        correctAnswer: "Boolean",
        explanation:
          "GraphQL's built-in scalars include Int, Float, String, Boolean, and ID.",
      },
      associatedSkills: ["graphql"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which directive conditionally includes a field based on a Boolean variable?",
        options: ["@include(if: $cond)", "@skip(if: $cond)", "@defer", "@stream"],
        correctAnswer: "@include(if: $cond)",
        explanation:
          "@include adds a field only when the expression evaluates true; @skip does the opposite.",
      },
      associatedSkills: ["graphql"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the schema snippet defining a nullable list of non-nullable strings.",
        segments: [
          { text: "type Query {\n  tags: ", block: false },
          { text: "[String!]", block: true },
          { text: "\n}\n", block: false },
        ],
        blocks: ["[String!]", "[String]", "String!"],
        correctAnswer: ["[String!]"],
        explanation:
          "In GraphQL type syntax, [String!] is a list whose entries are non-null, but the list itself may be null unless you add '!'.",
      },
      associatedSkills: ["graphql"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which transport extension enables GraphQL subscriptions over WebSockets?",
        options: [
          "graphql-ws protocol",
          "Server-Sent Events",
          "HTTP long polling",
          "gRPC streaming",
        ],
        correctAnswer: "graphql-ws protocol",
        explanation:
          "Most GraphQL servers implement subscriptions using the graphql-ws (or legacy subscriptions-transport-ws) WebSocket protocol.",
      },
      associatedSkills: ["graphql"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To avoid N+1 resolver problems, which technique batches field resolutions efficiently?",
        options: ["DataLoader pattern", "Fragments", "@include directives", "Naming conventions"],
        correctAnswer: "DataLoader pattern",
        explanation:
          "Libraries like DataLoader group multiple resolver requests per key into a single backend call, preventing N+1 issues.",
      },
      associatedSkills: ["graphql"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Schema stitching or federation requires which architectural component to compose multiple services?",
        options: [
          "Gateway that merges subgraph schemas",
          "Single monolithic resolver",
          "REST proxy",
          "Direct database access",
        ],
        correctAnswer: "Gateway that merges subgraph schemas",
        explanation:
          "Federated GraphQL architectures use a gateway (e.g., Apollo Gateway) that composes multiple subgraphs into a single schema for clients.",
      },
      associatedSkills: ["graphql"],
    },
  ],
};
