import { SkillSeedData } from "../../types.js";

export const goSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Go",
      skillNormalized: "go",
      aliases: ["golang"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command initializes a new Go module?",
        options: [
          "go mod init example.com/app",
          "go init",
          "go new module",
          "go get init",
        ],
        correctAnswer: "go mod init example.com/app",
        explanation:
          "go mod init sets up go.mod with the module path, enabling dependency management.",
      },
      associatedSkills: ["go"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword declares a function in Go?",
        options: ["func", "function", "def", "fn"],
        correctAnswer: "func",
        explanation:
          "Functions start with func name(params) returnTypes { ... }.",
      },
      associatedSkills: ["go"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which built-in tool formats Go source code?",
        options: ["gofmt", "goformat", "clang-format", "prettier"],
        correctAnswer: "gofmt",
        explanation:
          "gofmt enforces idiomatic formatting, usually run via gofmt or gofmt -w .",
      },
      associatedSkills: ["go"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package provides HTTP client/server primitives?",
        options: ["net/http", "http/net", "http", "net"],
        correctAnswer: "net/http",
        explanation:
          "net/http offers ServeMux, http.Client, and helpers for building HTTP services.",
      },
      associatedSkills: ["go"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which statement declares and initializes a map?",
        options: [
          "m := map[string]int{\"foo\": 1}",
          "map m = {\"foo\":1}",
          "var m map[string]int = []",
          "m := []map{}",
        ],
        correctAnswer: "m := map[string]int{\"foo\": 1}",
        explanation:
          "map[keyType]valueType literal syntax initializes a map with entries.",
      },
      associatedSkills: ["go"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the goroutine pattern that processes jobs via a channel.",
        segments: [
          { text: "jobs := make(chan string)\ngo ", block: false },
          { text: "func", block: true },
          { text: "() {\n  for job := range jobs {\n    fmt.Println(job)\n  }\n}()\n\njobs <- \"cleanup\"\nclose(jobs)", block: false },
        ],
        blocks: ["func", "go", "chan"],
        correctAnswer: ["func"],
        explanation:
          "Using go func() { ... } launch goroutines; reading from range jobs processes until the channel closes.",
      },
      associatedSkills: ["go"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which interface is satisfied by types that implement the Error() string method?",
        options: ["error", "fmt.Stringer", "io.Reader", "context.Context"],
        correctAnswer: "error",
        explanation:
          "The built-in error interface has a single Error() string method and is used throughout Go for error handling.",
      },
      associatedSkills: ["go"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How do you run unit tests in the current module with verbose output?",
        options: ["go test ./... -v", "go test -v *", "go run tests", "go build -test"],
        correctAnswer: "go test ./... -v",
        explanation:
          "./... tells go test to recurse through packages, and -v prints each test's status.",
      },
      associatedSkills: ["go"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To avoid data races when sharing mutable state, which Go construct is recommended?",
        options: [
          "Channels or sync.Mutex guarding shared data",
          "Global variables without locking",
          "Atomic pointers only",
          "Sleep statements",
        ],
        correctAnswer: "Channels or sync.Mutex guarding shared data",
        explanation:
          "Idiomatic Go uses channels to communicate state or sync primitives such as Mutex/RWMutex to protect shared memory.",
      },
      associatedSkills: ["go"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "What's the effect of running go build ./... inside a module?",
        options: [
          "Builds all packages in the module tree, ensuring compile-time safety",
          "Runs tests automatically",
          "Installs binaries globally",
          "Formats code",
        ],
        correctAnswer:
          "Builds all packages in the module tree, ensuring compile-time safety",
        explanation:
          "go build ./... compiles packages recursively, catching type errors even without running binaries.",
      },
      associatedSkills: ["go"],
    },
  ],
};
