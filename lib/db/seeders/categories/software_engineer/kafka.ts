import { SkillSeedData } from "../../types.js";

export const kafkaSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Kafka",
      skillNormalized: "kafka",
      aliases: ["apache kafka"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Kafka stores messages inside which logical structure?",
        options: ["Topics", "Queues", "Buckets", "Collections"],
        correctAnswer: "Topics",
        explanation:
          "Kafka topics partition event streams, with partitions enabling parallelism and ordering guarantees.",
      },
      associatedSkills: ["kafka"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI command produces messages to a topic?",
        options: [
          "kafka-console-producer.sh",
          "kafka-console-consumer.sh",
          "kafka-topics.sh",
          "kafka-reassign-partitions.sh",
        ],
        correctAnswer: "kafka-console-producer.sh",
        explanation:
          "kafka-console-producer reads stdin and publishes to the target topic for quick testing.",
      },
      associatedSkills: ["kafka"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does the replication factor define?",
        options: [
          "Number of copies of each partition",
          "Number of consumers",
          "Message batch size",
          "Schema registry count",
        ],
        correctAnswer: "Number of copies of each partition",
        explanation:
          "Replication factor ensures durability; at least one replica is elected leader while others are followers.",
      },
      associatedSkills: ["kafka"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which component coordinates partition leadership and metadata?",
        options: ["Kafka brokers with ZooKeeper or KRaft", "Producers", "Consumers", "Kafka Connect"],
        correctAnswer: "Kafka brokers with ZooKeeper or KRaft",
        explanation:
          "Kafka stores cluster metadata in ZooKeeper (or KRaft in newer versions) to manage broker coordination.",
      },
      associatedSkills: ["kafka"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Consumer offsets track what?",
        options: [
          "The last read position per partition",
          "Producer throughput",
          "Broker disk usage",
          "Schema versions",
        ],
        correctAnswer: "The last read position per partition",
        explanation:
          "Offsets represent sequential positions; committing offsets allows consumers to resume where they left off.",
      },
      associatedSkills: ["kafka"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which acknowledgement level guarantees that the leader and all in-sync replicas have persisted a message before acknowledging?",
        options: ["acks=all (-1)", "acks=1", "acks=0", "acks=leader"],
        correctAnswer: "acks=all (-1)",
        explanation:
          "acks=all waits for all ISR replicas to persist the record, maximizing durability.",
      },
      associatedSkills: ["kafka"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the consumer configuration that auto commits offsets every five seconds.",
        segments: [
          { text: "props.put(\"enable.auto.commit\", \"true\");\nprops.put(\"auto.commit.interval.ms\", \"", block: false },
          { text: "5000", block: true },
          { text: "\");", block: false },
        ],
        blocks: ["5000", "1000", "true"],
        correctAnswer: ["5000"],
        explanation:
          "Setting auto commit interval controls how often the consumer commits offsets when enable.auto.commit is true.",
      },
      associatedSkills: ["kafka"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which tool moves data between Kafka and external systems via connectors?",
        options: ["Kafka Connect", "Kafka Streams", "MirrorMaker", "ksqlDB"],
        correctAnswer: "Kafka Connect",
        explanation:
          "Kafka Connect provides source/sink connectors with scalable workers to integrate databases, storage, etc.",
      },
      associatedSkills: ["kafka"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "When designing multi-datacenter Kafka clusters with async replication, which tool mirrors topics?",
        options: [
          "MirrorMaker 2",
          "Kafka Streams",
          "ksqlDB",
          "Cruise Control",
        ],
        correctAnswer: "MirrorMaker 2",
        explanation:
          "MirrorMaker 2 replicates topics between clusters for disaster recovery or geo-redundancy.",
      },
      associatedSkills: ["kafka"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To minimize rebalancing overhead during consumer group changes, which partition assignment strategy provides sticky assignments?",
        options: [
          "CooperativeStickyAssignor",
          "RangeAssignor",
          "RoundRobinAssignor",
          "Legacy StickyAssignor",
        ],
        correctAnswer: "CooperativeStickyAssignor",
        explanation:
          "The cooperative sticky assignor reduces partition ownership churn and supports incremental cooperative rebalancing.",
      },
      associatedSkills: ["kafka"],
    },
  ],
};
