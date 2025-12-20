import { SkillSeedData } from "../../types";

export const gitSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Git",
      skillNormalized: "git",
      aliases: ["git version control", "version control"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command stages all modified and new files for commit?",
        options: [
          "git add .",
          "git commit -am",
          "git status -s",
          "git stage -A",
        ],
        correctAnswer: "git add .",
        explanation:
          "git add . updates the index with all tracked/untracked changes in the current directory tree.",
      },
      associatedSkills: ["git"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command creates a new branch and switches to it?",
        options: [
          "git checkout -b feature/login",
          "git branch feature/login",
          "git switch feature/login",
          "git merge feature/login",
        ],
        correctAnswer: "git checkout -b feature/login",
        explanation:
          "checkout -b (or switch -c) creates the branch and moves HEAD to it in a single step.",
      },
      associatedSkills: ["git"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you view concise commit history with one line per commit?",
        options: [
          "git log --oneline",
          "git log --patch",
          "git show --all",
          "git reflog",
        ],
        correctAnswer: "git log --oneline",
        explanation:
          "--oneline shows abbreviated SHA and subject, making history easier to scan.",
      },
      associatedSkills: ["git"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file tells Git to ignore build artifacts?",
        options: [".gitignore", ".gitkeep", "gitconfig", ".npmrc"],
        correctAnswer: ".gitignore",
        explanation:
          ".gitignore lists patterns that Git should treat as untracked so that they aren’t committed accidentally.",
      },
      associatedSkills: ["git"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command downloads remote changes for the current branch?",
        options: ["git pull", "git fetch --all", "git push", "git stash"],
        correctAnswer: "git pull",
        explanation:
          "git pull is shorthand for git fetch followed by git merge (or rebase) of the remote tracking branch.",
      },
      associatedSkills: ["git"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "You committed sensitive data. Which command replaces the last commit with amended contents?",
        options: [
          "git commit --amend",
          "git reset --hard HEAD^",
          "git revert HEAD",
          "git cherry-pick HEAD^",
        ],
        correctAnswer: "git commit --amend",
        explanation:
          "Amend rewrites the most recent commit using the currently staged changes, preserving commit order.",
      },
      associatedSkills: ["git"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the command that rebases interactive history for the last 3 commits.",
        segments: [
          { text: "git rebase ", block: false },
          { text: "-i", block: true },
          { text: " HEAD~3", block: false },
        ],
        blocks: ["-i", "--merge", "--onto"],
        correctAnswer: ["-i"],
        explanation:
          "-i HEAD~3 opens the interactive editor so you can reorder, squash, or edit the last three commits.",
      },
      associatedSkills: ["git"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How do you apply stashed changes and keep them in the stash list?",
        options: [
          "git stash apply",
          "git stash pop",
          "git stash drop",
          "git stash save",
        ],
        correctAnswer: "git stash apply",
        explanation:
          "apply replays the stash without removing it, whereas pop removes it after application.",
      },
      associatedSkills: ["git"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "You must rewrite a branch to remove a file from all history. Which tool should you use?",
        options: [
          "git filter-repo (or git filter-branch)",
          "git clean -fd",
          "git revert",
          "git bisect",
        ],
        correctAnswer: "git filter-repo (or git filter-branch)",
        explanation:
          "filter-repo can purge paths from every commit, rewriting history; revert only adds inverse commits.",
      },
      associatedSkills: ["git"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To identify the commit that introduced a regression, which command performs a binary search through history?",
        options: ["git bisect", "git blame", "git grep", "git verify-pack"],
        correctAnswer: "git bisect",
        explanation:
          "git bisect automates testing commits between known good and bad points to find the culprit quickly.",
      },
      associatedSkills: ["git"],
    },
  ],
};
