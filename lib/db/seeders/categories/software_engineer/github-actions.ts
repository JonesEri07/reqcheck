import { SkillSeedData } from "../../types.js";

export const githubActionsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "GitHub Actions",
      skillNormalized: "github actions",
      aliases: ["gh actions"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do GitHub Actions workflow files live?",
        options: [
          ".github/workflows/",
          "github/actions/",
          ".github/actions.yml",
          ".github/ci/",
        ],
        correctAnswer: ".github/workflows/",
        explanation:
          "Workflows are YAML files under .github/workflows and run automatically based on on: triggers.",
      },
      associatedSkills: ["github actions"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which trigger runs a workflow on every push to main?",
        options: [
          "on:\n  push:\n    branches: [main]",
          "on: push main",
          "trigger: push main",
          "when: push main",
        ],
        correctAnswer:
          "on:\n  push:\n    branches: [main]",
        explanation:
          "The on.push.branches array filters branch names; each push to main triggers the workflow.",
      },
      associatedSkills: ["github actions"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which job runner executes workflows provided by GitHub?",
        options: ["ubuntu-latest", "self-hosted", "macos-13", "windows-2022"],
        correctAnswer: "ubuntu-latest",
        explanation:
          "ubuntu-latest is a GitHub-hosted runner image with common toolchains; other labels exist for Mac/Windows or self-hosted runners.",
      },
      associatedSkills: ["github actions"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you cache dependencies between workflow runs?",
        options: [
          "Use actions/cache with a key",
          "Use GitHub Packages",
          "Use npm ci",
          "Use checkout@v4",
        ],
        correctAnswer: "Use actions/cache with a key",
        explanation:
          "actions/cache caches directories keyed by e.g. lockfile checksums to speed up subsequent runs.",
      },
      associatedSkills: ["github actions"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which expression accesses a repository secret named NPM_TOKEN?",
        options: [
          "${{ secrets.NPM_TOKEN }}",
          "${{ env.NPM_TOKEN }}",
          "$NPM_TOKEN",
          "${{ inputs.NPM_TOKEN }}",
        ],
        correctAnswer: "${{ secrets.NPM_TOKEN }}",
        explanation:
          "secrets.* references repository or organization secrets securely within workflow steps.",
      },
      associatedSkills: ["github actions"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the workflow step that uses checkout and setup-node.",
        segments: [
          { text: "    - name: Check out repository\n      uses: ", block: false },
          { text: "actions/checkout@v4", block: true },
          { text: "\n    - name: Set up Node.js\n      uses: ", block: false },
          { text: "actions/setup-node@v4", block: true },
          { text: "\n      with:\n        node-version: 20\n", block: false },
        ],
        blocks: [
          "actions/checkout@v4",
          "actions/setup-node@v4",
          "actions/upload-artifact@v3",
        ],
        correctAnswer: [
          "actions/checkout@v4",
          "actions/setup-node@v4",
        ],
        explanation:
          "Most JS workflows start by checking out the repo and installing a Node runtime using these maintained actions.",
      },
      associatedSkills: ["github actions"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which key ensures one workflow run per branch executes at a time (canceling in-progress runs)?",
        options: [
          "concurrency: my-workflow-${{ github.ref }}",
          "workflow_dispatch",
          "needs: build",
          "if: github.event_name == 'push'",
        ],
        correctAnswer: "concurrency: my-workflow-${{ github.ref }}",
        explanation:
          "Setting concurrency.group to include the ref cancels previous in-flight runs for that branch when a new run starts.",
      },
      associatedSkills: ["github actions"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "To reuse logic, which feature allows workflows to call other workflows like functions?",
        options: [
          "Reusable workflows via workflow_call",
          "Composite actions only",
          "Matrix strategy",
          "Environment protection rules",
        ],
        correctAnswer: "Reusable workflows via workflow_call",
        explanation:
          "Declaring on: workflow_call exposes inputs/secrets so other workflows can call it via uses: ./.github/workflows/deploy.yml.",
      },
      associatedSkills: ["github actions"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Self-hosted runners require additional security hardening. Which practice is recommended?",
        options: [
          "Configure ephemeral runners and restrict repository access",
          "Expose runners on public networks without firewalls",
          "Use root login for job execution",
          "Disable auto-updates",
        ],
        correctAnswer: "Configure ephemeral runners and restrict repository access",
        explanation:
          "Self-hosted runners should be ephemeral or regularly cleaned, network-restricted, and scoped to trusted repositories to reduce supply-chain risk.",
      },
      associatedSkills: ["github actions"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "You need deployments to wait for manual approval. Which feature supports this?",
        options: [
          "Environments with required reviewers",
          "workflow_dispatch only",
          "Needs condition",
          "Manual jobs (deprecated)",
        ],
        correctAnswer: "Environments with required reviewers",
        explanation:
          "Environments allow protection rules; setting required reviewers pauses jobs targeting that environment until approved.",
      },
      associatedSkills: ["github actions"],
    },
  ],
};
