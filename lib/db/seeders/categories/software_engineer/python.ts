import { SkillSeedData } from "../../types.js";

export const pythonSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Python",
      skillNormalized: "python",
      aliases: ["py", "python3", "python2"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs a Python script with Python 3?",
        options: ["python3 app.py", "py2 app.py", "run python app.py", "pip python app.py"],
        correctAnswer: "python3 app.py",
        explanation:
          "python3 invokes the Python 3 interpreter, ensuring compatibility even when python defaults to 2.x.",
      },
      associatedSkills: ["python"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword defines a function?",
        options: ["def", "function", "fn", "lambda"],
        correctAnswer: "def",
        explanation:
          "Functions begin with def name(args): followed by an indented block.",
      },
      associatedSkills: ["python"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which built-in data structure preserves insertion order and allows duplicates?",
        options: ["list", "set", "dict (pre-3.7)", "frozenset"],
        correctAnswer: "list",
        explanation:
          "Lists maintain order and allow duplicates; sets enforce uniqueness, dicts also maintain insertion order since 3.7 but enforce unique keys.",
      },
      associatedSkills: ["python"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which tool installs packages from PyPI?",
        options: ["pip", "npm", "gem", "cargo"],
        correctAnswer: "pip",
        explanation:
          "pip install <package> fetches packages from PyPI; pipx or poetry wrap pip for isolated envs.",
      },
      associatedSkills: ["python"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword handles exceptions?",
        options: ["try/except", "try/catch", "guard", "handle"],
        correctAnswer: "try/except",
        explanation:
          "Python uses try/except/finally/else constructs to catch and manage exceptions.",
      },
      associatedSkills: ["python"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the context manager that opens a file and ensures it closes.",
        segments: [
          { text: "with open('data.txt', 'r') as ", block: false },
          { text: "fh", block: true },
          { text: ":\n    contents = fh.read()", block: false },
        ],
        blocks: ["fh", "file", "fopen"],
        correctAnswer: ["fh"],
        explanation:
          "with open(...) as fh creates a context manager that auto-closes the file handle.",
      },
      associatedSkills: ["python"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which built-in module provides asynchronous event loops?",
        options: ["asyncio", "multiprocessing", "threading", "queue"],
        correctAnswer: "asyncio",
        explanation:
          "asyncio offers event loops, tasks, and async/await primitives for concurrency.",
      },
      associatedSkills: ["python"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which packaging tool creates isolated environments in the standard library?",
        options: ["venv", "conda", "virtualenvwrapper", "pipenv"],
        correctAnswer: "venv",
        explanation:
          "venv (python3 -m venv venv) ships with Python and creates isolated virtual environments.",
      },
      associatedSkills: ["python"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which data model method customizes attribute access on objects?",
        options: ["__getattr__", "__len__", "__iter__", "__repr__"],
        correctAnswer: "__getattr__",
        explanation:
          "__getattr__(self, name) runs when an attribute isn't found normally, enabling dynamic proxies or defaults.",
      },
      associatedSkills: ["python"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which concurrency primitive allows true parallel CPU execution in CPython?",
        options: [
          "multiprocessing.Process",
          "threading.Thread",
          "asyncio Task",
          "contextlib.contextmanager",
        ],
        correctAnswer: "multiprocessing.Process",
        explanation:
          "multiprocessing spawns separate processes bypassing the GIL, allowing parallel CPU-bound operations.",
      },
      associatedSkills: ["python"],
    },
  ],
};
