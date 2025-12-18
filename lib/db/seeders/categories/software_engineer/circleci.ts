import { SkillSeedData } from "../../types.js";

export const circleciSeed: SkillSeedData = {
  skills: [
    {
      skillName: "CircleCI",
      skillNormalized: "circleci",
      aliases: ["circle ci"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file name does CircleCI look for at the root of the repo by default?",
        options: [
          ".circleci/config.yml",
          "circle.yml",
          ".circleci.yml",
          "circleci.config",
        ],
        correctAnswer: ".circleci/config.yml",
        explanation:
          "All CircleCI pipelines start from .circleci/config.yml, which can define version, orbs, jobs, and workflows.",
      },
      associatedSkills: ["circleci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which top-level key declares the CircleCI configuration schema version?",
        options: ["version", "workflows", "jobs", "executors"],
        correctAnswer: "version",
        explanation:
          "The optional version key (commonly 2.1) tells CircleCI which features and syntax to enable.",
      },
      associatedSkills: ["circleci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which executor lets you run jobs on a pre-built Linux Docker image?",
        options: ["docker", "machine", "macos", "windows"],
        correctAnswer: "docker",
        explanation:
          "Docker executors pull the specified image and run steps inside containers, ideal for Linux CI.",
      },
      associatedSkills: ["circleci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What feature should you use to reuse common job logic across projects?",
        options: ["Orbs", "Contexts", "Filters", "Artifacts"],
        correctAnswer: "Orbs",
        explanation:
          "Orbs package executors, commands, and jobs so teams can share reusable CI logic.",
      },
      associatedSkills: ["circleci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which built-in step caches dependencies between CircleCI runs?",
        options: [
          "save_cache",
          "store_artifacts",
          "persist_to_workspace",
          "attach_workspace",
        ],
        correctAnswer: "save_cache",
        explanation:
          "save_cache uploads files keyed by a checksum so restore_cache can pull them in subsequent runs.",
      },
      associatedSkills: ["circleci"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which step shares build outputs between jobs within the same workflow?",
        options: [
          "persist_to_workspace",
          "store_artifacts",
          "save_cache",
          "setup_remote_docker",
        ],
        correctAnswer: "persist_to_workspace",
        explanation:
          "persist_to_workspace copies files to CircleCI's workspace so other jobs can attach and continue work.",
      },
      associatedSkills: ["circleci"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How do you limit a workflow to only run on the main branch?",
        options: [
          "Add filters: { branches: { only: main } } to the workflow job",
          "Set workflows.main.only: main",
          "Define BRANCH=main in environment variables",
          "Use when: on_success",
        ],
        correctAnswer: "Add filters: { branches: { only: main } } to the workflow job",
        explanation:
          "Branch filters on a workflow job specify allowed or ignored branches, preventing runs on other refs.",
      },
      associatedSkills: ["circleci"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the CircleCI step that restores a cache before installing packages.",
        segments: [
          { text: "      - ", block: false },
          { text: "restore_cache", block: true },
          { text: ":\n          ", block: false },
          { text: "keys", block: true },
          { text: ":\n            - v1-npm-{{ checksum \"package-lock.json\" }}\n", block: false },
        ],
        blocks: ["restore_cache", "save_cache", "keys", "name"],
        correctAnswer: ["restore_cache", "keys"],
        explanation:
          "restore_cache uses keys to locate a previously saved cache like an npm install directory.",
      },
      associatedSkills: ["circleci"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "You need to build Docker images inside a Docker executor. Which configuration is required?",
        options: [
          "Add setup_remote_docker to provision a sibling Docker engine",
          "Switch to a machine executor",
          "Enable privileged: true on the docker executor",
          "Use store_artifacts to enable Docker",
        ],
        correctAnswer: "Add setup_remote_docker to provision a sibling Docker engine",
        explanation:
          "setup_remote_docker starts a remote Docker daemon accessible via the DOCKER_HOST env, enabling docker build inside docker executors.",
      },
      associatedSkills: ["circleci"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "A workflow should deploy only when tests succeed AND the commit has a semantic tag. How can you enforce this?",
        options: [
          "Use workflow requires between jobs plus filters on the deploy job",
          "Set context constraints on deploy job",
          "Add approval jobs to each branch",
          "Persist artifacts before requiring deploy",
        ],
        correctAnswer: "Use workflow requires between jobs plus filters on the deploy job",
        explanation:
          "Workflow graph dependencies (requires) guarantee deploy waits for tests, while tag filters ensure deploy only runs for matching git refs.",
      },
      associatedSkills: ["circleci"],
    },
  ],
};
