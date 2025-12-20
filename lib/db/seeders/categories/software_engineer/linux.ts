import { SkillSeedData } from "../../types";

export const linuxSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Linux",
      skillNormalized: "linux",
      aliases: ["unix", "bash", "shell scripting"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command lists files in a directory?",
        options: ["ls", "cd", "pwd", "cat"],
        correctAnswer: "ls",
        explanation:
          "ls shows directory contents; with flags you can sort or display metadata.",
      },
      associatedSkills: ["linux"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command displays the current working directory?",
        options: ["pwd", "whoami", "dir", "env"],
        correctAnswer: "pwd",
        explanation:
          "pwd prints the absolute path of the shell’s current directory.",
      },
      associatedSkills: ["linux"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command changes file permissions?",
        options: ["chmod", "chown", "mv", "touch"],
        correctAnswer: "chmod",
        explanation:
          "chmod modifies read/write/execute permissions via symbolic or numeric modes.",
      },
      associatedSkills: ["linux"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command streams real-time output of a log file?",
        options: ["tail -f /var/log/syslog", "cat /var/log/syslog", "less /var/log/syslog", "head /var/log/syslog"],
        correctAnswer: "tail -f /var/log/syslog",
        explanation:
          "tail -f follows appended lines, useful for monitoring logs.",
      },
      associatedSkills: ["linux"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command installs packages on Debian/Ubuntu?",
        options: ["apt-get install", "yum install", "pacman -S", "brew install"],
        correctAnswer: "apt-get install",
        explanation:
          "apt-get (or apt) manages packages on Debian-based systems; other commands correspond to different distros.",
      },
      associatedSkills: ["linux"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the bash loop that iterates over *.log files and prints their names.",
        segments: [
          { text: "for file in ", block: false },
          { text: "*.log", block: true },
          { text: "; do\n  echo \"$file\"\ndone", block: false },
        ],
        blocks: ["*.log", "$*.log", "*.txt"],
        correctAnswer: ["*.log"],
        explanation:
          "Shell globbing expands *.log to log files; quoting $file preserves spaces.",
      },
      associatedSkills: ["linux"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which tool filters command output using regular expressions?",
        options: ["grep", "sed", "awk", "cut"],
        correctAnswer: "grep",
        explanation:
          "grep searches text using regex patterns; other tools transform or slice text differently.",
      },
      associatedSkills: ["linux"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which file stores environment variables for a single shell session initialization (bash)?",
        options: [".bashrc", "/etc/profile", ".bash_history", "/etc/shadow"],
        correctAnswer: ".bashrc",
        explanation:
          ".bashrc runs for interactive shells, letting users define aliases and exports; /etc/profile applies system-wide.",
      },
      associatedSkills: ["linux"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which command lists open files and the processes using them?",
        options: ["lsof", "netstat", "du", "top"],
        correctAnswer: "lsof",
        explanation:
          "lsof (list open files) shows file descriptors per process, helpful for diagnosing leaks or port usage.",
      },
      associatedSkills: ["linux"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To diagnose high CPU usage, which command displays per-process resource utilization in real time?",
        options: ["top (or htop)", "df -h", "free -m", "uname -a"],
        correctAnswer: "top (or htop)",
        explanation:
          "top provides interactive monitoring of CPU/memory per process; htop adds a richer UI.",
      },
      associatedSkills: ["linux"],
    },
  ],
};
