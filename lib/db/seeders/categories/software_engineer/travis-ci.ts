import { SkillSeedData } from "../../types.js";

export const travisCiSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Travis CI",
      skillNormalized: "travis ci",
      aliases: ["travis"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file configures Travis CI?",
        options: [".travis.yml", "travis.config.json", "ci.yml", ".circleci/config.yml"],
        correctAnswer: ".travis.yml",
        explanation:
          "Travis reads settings from .travis.yml in the repository root.",
      },
      associatedSkills: ["travis ci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which YAML key defines the programming language/runtime?",
        options: ["language: node_js", "runtime: node", "env: node", "stack: node"],
        correctAnswer: "language: node_js",
        explanation:
          "language sets the build environment (e.g., language: node_js, python, go).",
      },
      associatedSkills: ["travis ci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which section defines commands run after dependencies install?",
        options: ["script:", "after_success:", "deploy:", "services:"],
        correctAnswer: "script:",
        explanation:
          "By default Travis runs npm test/mvn test under script:, where you customize test/build commands.",
      },
      associatedSkills: ["travis ci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directive caches dependencies between builds?",
        options: ["cache:", "save_cache:", "persist:", "store_artifacts"],
        correctAnswer: "cache:",
        explanation:
          "cache: npm, cache: pip, or directories reduce build time by reusing dependencies.",
      },
      associatedSkills: ["travis ci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which format sets environment variables for all jobs?",
        options: ["env: global:", "environment:", ".env", "vars:"],
        correctAnswer: "env: global:",
        explanation:
          "env: global: defines environment variables available across matrix jobs; env: matrix: sets per-job vars.",
      },
      associatedSkills: ["travis ci"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the matrix entry that tests two Node versions.",
        segments: [
          { text: "node_js:\n  - ", block: false },
          { text: "\"16\"", block: true },
          { text: "\n  - \"18\"\n", block: false },
        ],
        blocks: ["\"16\"", "v16", "16.x"],
        correctAnswer: ["\"16\""],
        explanation:
          "node_js arrays list versions as strings, e.g., node_js: ['16', '18'].",
      },
      associatedSkills: ["travis ci"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which section deploys artifacts only on tagged commits?",
        options: ["deploy: on: tags: true", "after_deploy:", "release:", "publish:"],
        correctAnswer: "deploy: on: tags: true",
        explanation:
          "Travis deploy providers (e.g., npm, GitHub releases) can be gated via deploy: on: tags: true.",
      },
      associatedSkills: ["travis ci"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which service key spins up Docker for integration tests?",
        options: ["services: docker", "addons: docker", "enable_docker: true", "docker: enabled"],
        correctAnswer: "services: docker",
        explanation:
          "Adding services: docker provisions the Docker daemon so builds can run docker-compose, etc.",
      },
      associatedSkills: ["travis ci"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which strategy hides secrets when building public repos?",
        options: [
          "Encrypt environment variables via travis encrypt",
          "Store secrets in .travis.yml in plain text",
          "Use public env variables",
          "Hardcode secrets in code",
        ],
        correctAnswer: "Encrypt environment variables via travis encrypt",
        explanation:
          "Use travis encrypt (or repo settings) to store secure env vars; Travis redacts them in logs.",
      },
      associatedSkills: ["travis ci"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do you manually trigger a job only on changes to a specific directory?",
        options: [
          "Use conditions: changes: paths:",
          "Use before_script",
          "Set skip ci",
          "Use cron builds",
        ],
        correctAnswer: "Use conditions: changes: paths:",
        explanation:
          "Travis build conditions allow expressions like if: type = push AND branch = main AND changes = src/**.",
      },
      associatedSkills: ["travis ci"],
    },
  ],
};
