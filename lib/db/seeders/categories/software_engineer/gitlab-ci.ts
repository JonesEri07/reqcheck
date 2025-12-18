import { SkillSeedData } from "../../types.js";

export const gitlabCiSeed: SkillSeedData = {
  skills: [
    {
      skillName: "GitLab CI",
      skillNormalized: "gitlab ci",
      aliases: ["gitlab cicd"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What is the default name of the GitLab CI configuration file?",
        options: [".gitlab-ci.yml", "gitlab-ci.yaml", "ci.yml", "pipeline.yml"],
        correctAnswer: ".gitlab-ci.yml",
        explanation:
          "GitLab automatically detects .gitlab-ci.yml at the repository root to configure pipelines.",
      },
      associatedSkills: ["gitlab ci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword defines the Docker image a job will run in?",
        options: ["image", "services", "stage", "script"],
        correctAnswer: "image",
        explanation:
          "Setting image: node:20 ensures the job executes using that container, simplifying tooling installation.",
      },
      associatedSkills: ["gitlab ci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you specify the order of jobs in a pipeline?",
        options: [
          "Assign jobs to stages defined in stages:",
          "Name jobs alphabetically",
          "Use job priorities",
          "Define dependencies only",
        ],
        correctAnswer: "Assign jobs to stages defined in stages:",
        explanation:
          "stages: [build, test, deploy] establishes order; jobs in the same stage run in parallel.",
      },
      associatedSkills: ["gitlab ci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword caches directories between pipeline runs?",
        options: ["cache", "artifacts", "before_script", "variables"],
        correctAnswer: "cache",
        explanation:
          "cache paths store files on the runner; GitLab restores them on subsequent jobs sharing the cache key.",
      },
      associatedSkills: ["gitlab ci"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which GitLab UI feature displays pipeline status on merge requests?",
        options: ["Pipelines widget", "Artifacts tab", "Snippets", "Wiki"],
        correctAnswer: "Pipelines widget",
        explanation:
          "Merge requests show pipeline results and allow reruns/approvals in the Pipelines widget.",
      },
      associatedSkills: ["gitlab ci"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the job definition that only runs on merge requests.",
        segments: [
          { text: "test:\n  stage: test\n  script:\n    - npm test\n  only:\n    - ", block: false },
          { text: "merge_requests", block: true },
          { text: "\n", block: false },
        ],
        blocks: ["merge_requests", "main", "tags"],
        correctAnswer: ["merge_requests"],
        explanation:
          "The only keyword restricts the job to merge request pipelines, preventing runs on other refs.",
      },
      associatedSkills: ["gitlab ci"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which keyword downloads job artifacts from previous stages?",
        options: ["needs", "dependencies", "before_script", "retry"],
        correctAnswer: "dependencies",
        explanation:
          "dependencies lists upstream jobs whose artifacts should be downloaded for the current job.",
      },
      associatedSkills: ["gitlab ci"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "You must run jobs on a specific self-hosted runner. Which keyword enforces this?",
        options: [
          "tags",
          "rules",
          "extends",
          "retry",
        ],
        correctAnswer: "tags",
        explanation:
          "Self-hosted runners are registered with tags; jobs run only on runners that match the specified tags.",
      },
      associatedSkills: ["gitlab ci"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which feature lets you split a single logical job into multiple child pipelines for parallelism?",
        options: [
          "Parent-child pipelines (trigger keyword)",
          "matrix strategy",
          "Dynamic environments",
          "Scheduled pipelines",
        ],
        correctAnswer: "Parent-child pipelines (trigger keyword)",
        explanation:
          "Using trigger: include with strategy: depend creates child pipelines that can run concurrently and report status to the parent.",
      },
      associatedSkills: ["gitlab ci"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To secure deployments, how can you require approvals before running jobs in a protected environment?",
        options: [
          "Use environment: name with required approvals configured in the UI",
          "Set allow_failure: true",
          "Use only:variables",
          "Set when: manual without protections",
        ],
        correctAnswer:
          "Use environment: name with required approvals configured in the UI",
        explanation:
          "Protected environments enforce deploy freezes, required approvers, and ensure only authorized personnel can run manual jobs.",
      },
      associatedSkills: ["gitlab ci"],
    },
  ],
};
