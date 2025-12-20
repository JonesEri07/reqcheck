import { SkillSeedData } from "../../types";

export const jenkinsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Jenkins",
      skillNormalized: "jenkins",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file defines a pipeline as code for Jenkins?",
        options: ["Jenkinsfile", "jenkins.yml", "pipeline.config", "ci.toml"],
        correctAnswer: "Jenkinsfile",
        explanation:
          "Declarative or scripted pipelines live in a Jenkinsfile stored in source control.",
      },
      associatedSkills: ["jenkins"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Jenkins plugin provides Git SCM integration?",
        options: ["Git plugin", "SVN plugin", "Blue Ocean", "Pipeline: Stage View"],
        correctAnswer: "Git plugin",
        explanation:
          "The Git plugin handles cloning repositories, polling, and credentials for Git-based jobs.",
      },
      associatedSkills: ["jenkins"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Jenkins concept represents a worker machine running builds?",
        options: ["Agent (node)", "Stage", "Step", "Shared library"],
        correctAnswer: "Agent (node)",
        explanation:
          "Agents (formerly slaves) run on separate machines/containers that execute pipeline steps.",
      },
      associatedSkills: ["jenkins"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which pipeline block defines sequential sections such as Build or Deploy?",
        options: ["stage('Build') { ... }", "step('Build')", "agent", "environment"],
        correctAnswer: "stage('Build') { ... }",
        explanation:
          "Stages group pipeline steps for visualization and conditional execution.",
      },
      associatedSkills: ["jenkins"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which syntax declaratively configures pipelines?",
        options: ["pipeline { ... }", "node { ... }", "script { ... }", "groovy {}"],
        correctAnswer: "pipeline { ... }",
        explanation:
          "Declarative pipelines start with pipeline { agent any ... } and are simpler than scripted pipelines (node blocks).",
      },
      associatedSkills: ["jenkins"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the declarative pipeline snippet that sets environment variables.",
        segments: [
          { text: "pipeline {\n  agent any\n  environment {\n    NODE_ENV = \"production\"\n    ", block: false },
          { text: "API_URL", block: true },
          { text: " = credentials('api-url')\n  }\n", block: false },
        ],
        blocks: ["API_URL", "API-URL", "URL_API"],
        correctAnswer: ["API_URL"],
        explanation:
          "Environment blocks declare key = value pairs; credentials() injects secret text tied to Jenkins credentials.",
      },
      associatedSkills: ["jenkins"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which block allows scripted Groovy inside a declarative pipeline?",
        options: ["script { ... }", "groovy { ... }", "code { ... }", "execute { ... }"],
        correctAnswer: "script { ... }",
        explanation:
          "script blocks escape to scripted pipeline syntax for complex logic not supported declaratively.",
      },
      associatedSkills: ["jenkins"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "You need to share common functions between pipelines. Which Jenkins feature supports this?",
        options: [
          "Shared libraries",
          "Matrix builds",
          "Blue Ocean",
          "Credentials binding",
        ],
        correctAnswer: "Shared libraries",
        explanation:
          "Shared libraries store Groovy helpers or steps in SCM and are imported via @Library annotation.",
      },
      associatedSkills: ["jenkins"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which analytics plugin visualizes build health and lead time across pipelines?",
        options: ["Blue Ocean", "Git Parameter", "Copy Artifact", "Mailer"],
        correctAnswer: "Blue Ocean",
        explanation:
          "Blue Ocean provides modern visualization for pipelines, stages, and parallel branches, aiding observability.",
      },
      associatedSkills: ["jenkins"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To prevent compromised plugins, which Jenkins security practice is recommended?",
        options: [
          "Lock down plugin installation to trusted administrators and keep Jenkins LTS updated",
          "Allow anonymous plugin uploads",
          "Disable CSRF protection",
          "Run Jenkins as root",
        ],
        correctAnswer:
          "Lock down plugin installation to trusted administrators and keep Jenkins LTS updated",
        explanation:
          "Plugins run on the master; limiting who can install them and staying on supported LTS versions mitigates many vulnerabilities.",
      },
      associatedSkills: ["jenkins"],
    },
  ],
};
