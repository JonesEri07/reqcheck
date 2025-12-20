import { SkillSeedData } from "../../types";

export const redisSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Redis",
      skillNormalized: "redis",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command-line tool interacts with Redis?",
        options: ["redis-cli", "mongo", "psql", "etcdctl"],
        correctAnswer: "redis-cli",
        explanation:
          "redis-cli connects via TCP or UNIX socket to send commands.",
      },
      associatedSkills: ["redis"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command sets a key to a string value?",
        options: ["SET key value", "PUT key value", "ADD key value", "INSERT key value"],
        correctAnswer: "SET key value",
        explanation:
          "SET stores string values; combined with EX seconds it can set TTLs.",
      },
      associatedSkills: ["redis"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which data structure stores unique members without order?",
        options: ["Set", "List", "String", "Hash"],
        correctAnswer: "Set",
        explanation:
          "Redis sets (SADD/SMEMBERS) ensure uniqueness, enabling operations like SINTER/UNION.",
      },
      associatedSkills: ["redis"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command checks if a key exists?",
        options: ["EXISTS key", "HAS key", "KEYS key", "PING key"],
        correctAnswer: "EXISTS key",
        explanation:
          "EXISTS returns 1 if the key exists, 0 otherwise (or count for multiple keys).",
      },
      associatedSkills: ["redis"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which configuration setting enables persistence via snapshotting?",
        options: ["RDB save points", "AOF fsync always", "appendonly no", "replica-read-only"],
        correctAnswer: "RDB save points",
        explanation:
          "Defining save <seconds> <changes> in redis.conf triggers RDB snapshots at intervals.",
      },
      associatedSkills: ["redis"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the command to add a member with a score to a sorted set.",
        segments: [
          { text: "ZADD leaderboard ", block: false },
          { text: "100", block: true },
          { text: " alice", block: false },
        ],
        blocks: ["100", "SCORE", "1.0"],
        correctAnswer: ["100"],
        explanation:
          "ZADD takes score member pairs; sorted sets order members by score for ranking queries.",
      },
      associatedSkills: ["redis"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which Redis feature groups commands into atomic sequences executed on the server?",
        options: [
          "MULTI/EXEC transactions",
          "Lua scripting only",
          "Pipelines",
          "Cluster slots",
        ],
        correctAnswer: "MULTI/EXEC transactions",
        explanation:
          "MULTI queues commands, EXEC executes them atomically; WATCH implements optimistic concurrency.",
      },
      associatedSkills: ["redis"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which mechanism replicates data to read replicas for HA?",
        options: [
          "Replicaof (slaveof) configuration",
          "appendonly yes",
          "CLUSTER ADDSLOTS",
          "CONFIG SET requirepass",
        ],
        correctAnswer: "Replicaof (slaveof) configuration",
        explanation:
          "Setting replicaof <host> <port> creates a replica streaming updates from the primary.",
      },
      associatedSkills: ["redis"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which eviction policy retains recently accessed keys while evicting the least recently used ones?",
        options: ["volatile-lru", "allkeys-random", "noeviction", "volatile-ttl"],
        correctAnswer: "volatile-lru",
        explanation:
          "volatile-lru evicts least recently used keys among those with TTL; allkeys-lru applies to all keys.",
      },
      associatedSkills: ["redis"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which feature runs server-side Lua scripts atomically?",
        options: ["EVAL / EVALSHA", "Lua pipelines", "Scripting cluster", "module load"],
        correctAnswer: "EVAL / EVALSHA",
        explanation:
          "EVAL executes Lua scripts atomically; EVALSHA caches scripts by SHA for faster repeated execution.",
      },
      associatedSkills: ["redis"],
    },
  ],
};
