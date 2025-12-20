import { SkillSeedData } from "../../types";

export const cassandraSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Cassandra",
      skillNormalized: "cassandra",
      aliases: ["apache cassandra"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Cassandra is best described as what type of database?",
        options: [
          "Distributed wide-column NoSQL store",
          "Relational OLTP database",
          "Graph database",
          "Time-series database",
        ],
        correctAnswer: "Distributed wide-column NoSQL store",
        explanation:
          "Cassandra stores data in partitioned wide rows and scales horizontally across commodity nodes.",
      },
      associatedSkills: ["cassandra"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which query language is used to interact with Cassandra?",
        options: ["CQL (Cassandra Query Language)", "SQL", "Cypher", "SPARQL"],
        correctAnswer: "CQL (Cassandra Query Language)",
        explanation:
          "CQL resembles SQL but is tailored to Cassandra's distributed data model and limitations.",
      },
      associatedSkills: ["cassandra"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which concept determines how data is distributed across nodes?",
        options: [
          "Partition key",
          "Clustering column",
          "Materialized view",
          "Secondary index",
        ],
        correctAnswer: "Partition key",
        explanation:
          "The partition key hashes to a token that decides which nodes store a row, impacting data distribution and query patterns.",
      },
      associatedSkills: ["cassandra"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command-line shell ships with Cassandra?",
        options: ["cqlsh", "psql", "mongo", "redis-cli"],
        correctAnswer: "cqlsh",
        explanation:
          "cqlsh provides an interactive shell for running CQL statements against the cluster.",
      },
      associatedSkills: ["cassandra"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which replication property controls how many replicas must acknowledge a write?",
        options: ["Consistency level", "Replication factor", "Snitch", "Seed list"],
        correctAnswer: "Consistency level",
        explanation:
          "Consistency level (e.g., ONE, QUORUM, ALL) defines the number of replicas that must respond for an operation to succeed.",
      },
      associatedSkills: ["cassandra"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which Cassandra component keeps recently written data in memory before flushing to disk?",
        options: [
          "Memtable",
          "Commit log",
          "SSTable",
          "Hinted handoff queue",
        ],
        correctAnswer: "Memtable",
        explanation:
          "Memtables are in-memory data structures that accumulate writes until they are flushed as SSTables.",
      },
      associatedSkills: ["cassandra"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which operation combines SSTables and discards tombstones to reclaim space?",
        options: ["Compaction", "Repair", "Hinted handoff", "Streaming"],
        correctAnswer: "Compaction",
        explanation:
          "Compaction merges SSTables, removes obsolete data/tombstones, and improves read performance.",
      },
      associatedSkills: ["cassandra"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which command repairs inconsistencies between replicas?",
        options: [
          "nodetool repair",
          "nodetool flush",
          "nodetool cleanup",
          "nodetool status",
        ],
        correctAnswer: "nodetool repair",
        explanation:
          "Repair compares partitions across replicas and heals differences, ensuring eventual consistency.",
      },
      associatedSkills: ["cassandra"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which strategy replicates data evenly across racks for high availability?",
        options: [
          "NetworkTopologyStrategy",
          "SimpleStrategy",
          "LocalStrategy",
          "HashStrategy",
        ],
        correctAnswer: "NetworkTopologyStrategy",
        explanation:
          "NetworkTopologyStrategy lets you specify per-datacenter replication factors, distributing replicas across racks.",
      },
      associatedSkills: ["cassandra"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which practice avoids wide partitions that degrade read/write performance?",
        options: [
          "Choosing partition keys that evenly distribute data",
          "Using ALLOW FILTERING on queries",
          "Increasing gc_grace_seconds",
          "Setting consistency level ALL",
        ],
        correctAnswer: "Choosing partition keys that evenly distribute data",
        explanation:
          "Designing partition keys to prevent hotspots keeps partitions manageable and avoids overloaded nodes.",
      },
      associatedSkills: ["cassandra"],
    },
  ],
};
