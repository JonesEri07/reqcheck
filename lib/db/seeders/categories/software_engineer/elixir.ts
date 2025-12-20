import { SkillSeedData } from "../../types";

export const elixirSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Elixir",
      skillNormalized: "elixir",
      aliases: ["phoenix"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which operator forwards the result of one expression into the next function call?",
        options: ["|>", "|", "=>", "::"],
        correctAnswer: "|>",
        explanation:
          "The pipe operator |>, pronounced 'pipe', inserts the left-hand value as the first argument to the next function.",
      },
      associatedSkills: ["elixir"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does iex -S mix do?",
        options: [
          "Starts an interactive Elixir shell with the Mix project loaded",
          "Compiles and runs tests",
          "Scaffolds a Phoenix app",
          "Installs dependencies",
        ],
        correctAnswer: "Starts an interactive Elixir shell with the Mix project loaded",
        explanation:
          "iex -S mix boots the Mix build tool first, then opens iex so project modules are available.",
      },
      associatedSkills: ["elixir"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which data type represents an immutable key-value collection?",
        options: ["Map", "Tuple", "Keyword list", "Binary"],
        correctAnswer: "Map",
        explanation:
          "Maps (e.g., %{a: 1}) store key/value pairs with fast access, while keyword lists retain order.",
      },
      associatedSkills: ["elixir"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What is the file extension for Elixir source modules?",
        options: [".ex", ".exs only", ".beam", ".erl"],
        correctAnswer: ".ex",
        explanation:
          ".ex files contain compiled modules; .exs files are script-like and usually not compiled.",
      },
      associatedSkills: ["elixir"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Mix command creates a new Phoenix application?",
        options: [
          "mix phx.new blog",
          "mix new blog",
          "mix phoenix.init blog",
          "mix ecto.create blog",
        ],
        correctAnswer: "mix phx.new blog",
        explanation:
          "mix phx.new scaffolds a Phoenix web application with endpoints, contexts, and assets.",
      },
      associatedSkills: ["elixir"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the GenServer callback that initializes state.",
        segments: [
          { text: "def init(", block: false },
          { text: "initial_state", block: true },
          { text: ") do\n  {:ok, initial_state}\nend", block: false },
        ],
        blocks: ["initial_state", "opts", "args"],
        correctAnswer: ["initial_state"],
        explanation:
          "init/1 receives the arguments passed to start_link and must return {:ok, state} to set the GenServer state.",
      },
      associatedSkills: ["elixir"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which macro defines a supervision tree that automatically restarts child processes?",
        options: ["Supervisor.start_link/2", "Task.async/1", "Agent.start_link/1", "Registry.start_link/1"],
        correctAnswer: "Supervisor.start_link/2",
        explanation:
          "Supervisors monitor child processes, applying restart strategies like :one_for_one when processes crash.",
      },
      associatedSkills: ["elixir"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "In Phoenix Contexts, why would you create an Accounts context?",
        options: [
          "To isolate user-related schemas and business logic",
          "To define custom mix tasks",
          "To configure Ecto repos",
          "To manage static assets",
        ],
        correctAnswer: "To isolate user-related schemas and business logic",
        explanation:
          "Contexts group related domain logic, providing clear boundaries and reducing coupling between controllers and schemas.",
      },
      associatedSkills: ["elixir"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which OTP construct enables distributed message passing and fault tolerance across nodes?",
        options: [
          "BEAM processes with mailboxes",
          "Ports",
          "ETS tables",
          "Mix releases",
        ],
        correctAnswer: "BEAM processes with mailboxes",
        explanation:
          "Every Elixir process is lightweight, isolated, and communicates via mailboxes, allowing massive concurrency and distributed supervision.",
      },
      associatedSkills: ["elixir"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To metaprogram and inject code at compile time, which feature would you leverage?",
        options: ["Macros", "Protocols", "Behaviours", "Structs"],
        correctAnswer: "Macros",
        explanation:
          "Macros operate on quoted AST and expand during compilation, enabling DSLs or compile-time code generation.",
      },
      associatedSkills: ["elixir"],
    },
  ],
};
