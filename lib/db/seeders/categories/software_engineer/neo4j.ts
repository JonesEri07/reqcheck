import { SkillSeedData } from "../../types.js";

export const neo4jSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Neo4j",
      skillNormalized: "neo4j",
      aliases: ["graph database"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which query language is used to interact with Neo4j?",
        options: ["Cypher", "SQL", "Gremlin", "SPARQL"],
        correctAnswer: "Cypher",
        explanation:
          "Neo4j uses the declarative Cypher query language to create, match, and modify graph data.",
      },
      associatedSkills: ["neo4j"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Cypher clause matches existing nodes and relationships?",
        options: ["MATCH", "CREATE", "MERGE", "RETURN"],
        correctAnswer: "MATCH",
        explanation:
          "MATCH finds patterns in the graph, optionally combined with WHERE to filter results.",
      },
      associatedSkills: ["neo4j"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which syntax creates a node with the Person label?",
        options: ["CREATE (:Person {name: 'Ada'})", "CREATE NODE Person('Ada')", "INSERT Person('Ada')", "ADD NODE Person"],
        correctAnswer: "CREATE (:Person {name: 'Ada'})",
        explanation:
          "Cypher uses parentheses for nodes, colon for labels, and maps for properties.",
      },
      associatedSkills: ["neo4j"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which built-in function counts matched nodes?",
        options: ["count()", "sum()", "size()", "collect()"],
        correctAnswer: "count()",
        explanation:
          "count(expression) returns the number of rows or items; commonly used with RETURN count(*)",
      },
      associatedSkills: ["neo4j"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does MERGE do?",
        options: [
          "Finds or creates a pattern atomically",
          "Deletes nodes",
          "Creates relationships only",
          "Performs schema migrations",
        ],
        correctAnswer: "Finds or creates a pattern atomically",
        explanation:
          "MERGE ensures the specified pattern exists; if not, it creates it, similar to SQL UPSERT.",
      },
      associatedSkills: ["neo4j"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the Cypher query that finds friends-of-friends.",
        segments: [
          { text: "MATCH (:Person {name: \"Alice\"})-[:FRIEND]->(:Person)-[:FRIEND]->(fof)\nRETURN ", block: false },
          { text: "distinct", block: true },
          { text: " fof.name;", block: false },
        ],
        blocks: ["distinct", "all", "unique"],
        correctAnswer: ["distinct"],
        explanation:
          "distinct removes duplicates so each friend-of-friend appears once.",
      },
      associatedSkills: ["neo4j"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which index type improves lookup of nodes by label + property?",
        options: [
          "BTREE or RANGE index",
          "FULLTEXT index",
          "Composite text index",
          "Graph index",
        ],
        correctAnswer: "BTREE or RANGE index",
        explanation:
          "Neo4j's BTREE (aka RANGE) indexes accelerate equality/range queries for labeled properties.",
      },
      associatedSkills: ["neo4j"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How do you delete a node and its relationships in Cypher?",
        options: [
          "MATCH (n {id: 1}) DETACH DELETE n",
          "DELETE NODE 1",
          "DROP (n)",
          "REMOVE n",
        ],
        correctAnswer: "MATCH (n {id: 1}) DETACH DELETE n",
        explanation:
          "DETACH DELETE removes the node along with attached relationships; DELETE alone fails if relationships exist.",
      },
      associatedSkills: ["neo4j"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which APOC procedure helps run parameterized subqueries for complex data transformations?",
        options: [
          "apoc.cypher.run",
          "apoc.load.csv",
          "apoc.periodic.iterate",
          "apoc.refactor.mergeNodes",
        ],
        correctAnswer: "apoc.cypher.run",
        explanation:
          "apoc.cypher.run executes dynamic Cypher fragments, enabling reusable transformations and custom logic.",
      },
      associatedSkills: ["neo4j"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To partition a large dataset across multiple Neo4j clusters, which strategy is common?",
        options: [
          "Use Fabric (federated graphs) or custom sharding logic",
          "Rely on automatic sharding",
          "Use SQL replication",
          "Store everything in a single node",
        ],
        correctAnswer: "Use Fabric (federated graphs) or custom sharding logic",
        explanation:
          "Neo4j Fabric lets you query multiple databases/clusters; sharding often requires explicit federation strategies.",
      },
      associatedSkills: ["neo4j"],
    },
  ],
};
