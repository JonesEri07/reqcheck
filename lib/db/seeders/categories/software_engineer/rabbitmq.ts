import { SkillSeedData } from "../../types.js";

export const rabbitmqSeed: SkillSeedData = {
  skills: [
    {
      skillName: "RabbitMQ",
      skillNormalized: "rabbitmq",
      aliases: ["rabbit mq"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which protocol does RabbitMQ implement by default?",
        options: ["AMQP 0-9-1", "MQTT", "STOMP", "Kafka"],
        correctAnswer: "AMQP 0-9-1",
        explanation:
          "RabbitMQ primarily speaks AMQP 0-9-1 but also supports MQTT, STOMP, and AMQP 1.0 via plugins.",
      },
      associatedSkills: ["rabbitmq"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which component routes messages to queues based on bindings?",
        options: ["Exchange", "Virtual host", "Channel", "Connection"],
        correctAnswer: "Exchange",
        explanation:
          "Publishers send messages to exchanges, which route messages to queues using bindings.",
      },
      associatedSkills: ["rabbitmq"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command-line tool manages RabbitMQ?",
        options: ["rabbitmqctl", "mqadmin", "rabbitadmin", "amqpctl"],
        correctAnswer: "rabbitmqctl",
        explanation:
          "rabbitmqctl (and rabbitmq-diagnostics) manage clusters, queues, users, and policies.",
      },
      associatedSkills: ["rabbitmq"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which flag ensures queues survive broker restarts?",
        options: [
          "Declare queue as durable",
          "exclusive=true",
          "auto_delete=true",
          "mandatory",
        ],
        correctAnswer: "Declare queue as durable",
        explanation:
          "Durable queues and persistent messages (delivery_mode=2) guarantee survivability across restarts.",
      },
      associatedSkills: ["rabbitmq"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which RabbitMQ concept scopes exchanges, queues, and bindings?",
        options: ["Virtual host (vhost)", "Cluster", "Node", "Policy"],
        correctAnswer: "Virtual host (vhost)",
        explanation:
          "Virtual hosts isolate sets of exchanges/queues, providing multi-tenancy within a cluster.",
      },
      associatedSkills: ["rabbitmq"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the shell command that enables the management UI plugin.",
        segments: [
          { text: "rabbitmq-plugins enable ", block: false },
          { text: "rabbitmq_management", block: true },
          { text: "", block: false },
        ],
        blocks: ["rabbitmq_management", "management_ui", "management_plugin"],
        correctAnswer: ["rabbitmq_management"],
        explanation:
          "Enabling rabbitmq_management provides the HTTP API and dashboard at :15672.",
      },
      associatedSkills: ["rabbitmq"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which exchange type routes messages only to queues whose binding key exactly matches the routing key?",
        options: ["direct exchange", "fanout", "topic", "headers"],
        correctAnswer: "direct exchange",
        explanation:
          "Direct exchanges deliver messages to queues with a binding key equal to the message's routing key.",
      },
      associatedSkills: ["rabbitmq"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "What ensures consumers do not overwhelm themselves with too many unacked messages?",
        options: [
          "basic.qos(prefetch_count)",
          "auto_ack=true",
          "mandatory flag",
          "publisher confirms",
        ],
        correctAnswer: "basic.qos(prefetch_count)",
        explanation:
          "Setting prefetch_count (QoS) limits how many unacknowledged messages a consumer can hold, enabling fair dispatch.",
      },
      associatedSkills: ["rabbitmq"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To ensure a publisher knows messages reached durable storage, which feature should be enabled?",
        options: [
          "Publisher confirms (confirm_select)",
          "Mandatory flag",
          "Transactions (tx.select)",
          "Nack with requeue",
        ],
        correctAnswer: "Publisher confirms (confirm_select)",
        explanation:
          "Publisher confirms provide asynchronous acks/nacks from the broker once messages are persisted.",
      },
      associatedSkills: ["rabbitmq"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which policy type mirrors queues across nodes for high availability?",
        options: [
          "Classic quorum queues or mirrored queues (ha-mode)",
          "Lazy queues",
          "Shovel",
          "Federation",
        ],
        correctAnswer: "Classic quorum queues or mirrored queues (ha-mode)",
        explanation:
          "Ha-mode (classic mirrored) or quorum queues replicate messages across nodes, ensuring failover if a node dies.",
      },
      associatedSkills: ["rabbitmq"],
    },
  ],
};
