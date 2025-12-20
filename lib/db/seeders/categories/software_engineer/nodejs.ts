import { SkillSeedData } from "../../types";

export const nodejsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Node.js",
      skillNormalized: "nodejs",
      aliases: ["node", "nodejs"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs a Node.js script?",
        options: ["node app.js", "npm run node app.js", "run node app.js", "deno run app.js"],
        correctAnswer: "node app.js",
        explanation:
          "node <file> executes JavaScript files using the Node runtime.",
      },
      associatedSkills: ["nodejs"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which built-in module handles filesystem operations?",
        options: ["fs", "path", "http", "stream"],
        correctAnswer: "fs",
        explanation:
          "The fs module provides read/write operations for files and directories.",
      },
      associatedSkills: ["nodejs"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which statement imports a CommonJS module?",
        options: ["const http = require('http');", "import http from 'http';", "using http from 'http';", "module http = require();"],
        correctAnswer: "const http = require('http');",
        explanation:
          "CommonJS modules use require(); ES modules use import syntax when enabled.",
      },
      associatedSkills: ["nodejs"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which flag enables ECMAScript modules without .mjs extension?",
        options: [
          "Set \"type\": \"module\" in package.json",
          "--modules true",
          "Use node --esm",
          "No flag required",
        ],
        correctAnswer: "Set \"type\": \"module\" in package.json",
        explanation:
          "Setting type=module treats .js files as ESM; default is CommonJS.",
      },
      associatedSkills: ["nodejs"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which runtime method schedules a callback on the next tick of the event loop?",
        options: ["process.nextTick", "setTimeout(fn, 0)", "queueMicrotask", "setImmediate"],
        correctAnswer: "process.nextTick",
        explanation:
          "process.nextTick queues microtasks that run before other event loop phases; setImmediate runs after I/O events.",
      },
      associatedSkills: ["nodejs"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the snippet that promisifies fs.readFile.",
        segments: [
          { text: "import { readFile } from 'fs';\nimport { promisify } from 'util';\n\nconst readFileAsync = ", block: false },
          { text: "promisify", block: true },
          { text: "(readFile);\n", block: false },
        ],
        blocks: ["promisify", "Promise", "asyncify"],
        correctAnswer: ["promisify"],
        explanation:
          "util.promisify converts callback-based APIs into promise-returning functions.",
      },
      associatedSkills: ["nodejs"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which module spawns child processes for executing shell commands?",
        options: ["child_process", "cluster", "worker_threads", "os"],
        correctAnswer: "child_process",
        explanation:
          "child_process provides spawn, exec, execFile, and fork for running external programs.",
      },
      associatedSkills: ["nodejs"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which pattern prevents blocking the event loop when handling CPU-intensive work?",
        options: [
          "Use worker_threads or offload to separate services",
          "Use setTimeout recursion",
          "Call await delay",
          "Increase node --max-old-space-size",
        ],
        correctAnswer: "Use worker_threads or offload to separate services",
        explanation:
          "Worker threads or background services handle CPU tasks without blocking Node’s single-threaded event loop.",
      },
      associatedSkills: ["nodejs"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "What does the cluster module do?",
        options: [
          "Forks multiple worker processes sharing the same server port",
          "Runs WebSockets",
          "Implements database clusters",
          "Enables microservices",
        ],
        correctAnswer:
          "Forks multiple worker processes sharing the same server port",
        explanation:
          "Cluster spawns worker processes to utilize multi-core CPUs while sharing sockets via the master process.",
      },
      associatedSkills: ["nodejs"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which flag enables experimental fetch API support in Node 18-?",
        options: ["--experimental-fetch", "--enable-fetch", "--fetch", "--http-client"],
        correctAnswer: "--experimental-fetch",
        explanation:
          "Before Node 18 stabilized fetch, it required --experimental-fetch; modern versions enable it by default.",
      },
      associatedSkills: ["nodejs"],
    },
  ],
};
