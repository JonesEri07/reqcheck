import { SkillSeedData } from "../../types.js";

export const clojureSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Clojure",
      skillNormalized: "clojure",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which collection literal creates a vector in Clojure?",
        options: ["[1 2 3]", "{:a 1}", "(1 2 3)", "#{1 2 3}"],
        correctAnswer: "[1 2 3]",
        explanation:
          "Square brackets denote vectors, while parentheses are lists, braces are maps, and #{} are sets.",
      },
      associatedSkills: ["clojure"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you call a function named inc on the value 5?",
        options: ["(inc 5)", "inc(5)", "inc 5", "(5 inc)"],
        correctAnswer: "(inc 5)",
        explanation:
          "Clojure uses prefix notation, so the function name comes first followed by its arguments.",
      },
      associatedSkills: ["clojure"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which core function concatenates two sequences?",
        options: ["concat", "merge", "into", "zipmap"],
        correctAnswer: "concat",
        explanation:
          "concat lazily joins sequences, keeping them immutable and returning a new lazy seq.",
      },
      associatedSkills: ["clojure"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does the threading macro ->> do?",
        options: [
          "Inserts the previous value as the last argument",
          "Inserts as the first argument",
          "Creates a transducer",
          "Mutates state",
        ],
        correctAnswer: "Inserts the previous value as the last argument",
        explanation:
          "->> threads expressions by placing the result in the last argument position, useful for sequence pipelines.",
      },
      associatedSkills: ["clojure"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which REPL shortcut reloads changed namespaces during development?",
        options: [
          "(require 'foo :reload)",
          "(reload! foo)",
          "(ns foo)",
          "(refresh foo)",
        ],
        correctAnswer: "(require 'foo :reload)",
        explanation:
          "Adding :reload tells require to re-read the namespace file without restarting the REPL.",
      },
      associatedSkills: ["clojure"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Fill in the destructuring form that pulls :first and :last from a map.",
        segments: [
          { text: "(let [{", block: false },
          { text: ":keys", block: true },
          { text: " [first-name last-name]}", block: false },
          { text: " person]\n  (str first-name \" \" last-name))", block: false },
        ],
        blocks: [":keys", ":as", ":or", ":sym"],
        correctAnswer: [":keys"],
        explanation:
          ":keys turns keywords into local names matching their keyword names, allowing direct binding.",
      },
      associatedSkills: ["clojure"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which reference type provides coordinated, synchronous updates with software transactional memory?",
        options: ["refs", "atoms", "agents", "vars"],
        correctAnswer: "refs",
        explanation:
          "Refs must be altered within dosync transactions and guarantee coordinated changes across multiple references.",
      },
      associatedSkills: ["clojure"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which library namespaces are required to define specs and validate data?",
        options: [
          "clojure.spec.alpha and clojure.spec.test.alpha",
          "clojure.data.json and clojure.test",
          "clojure.walk and clojure.set",
          "clojure.edn and clojure.string",
        ],
        correctAnswer: "clojure.spec.alpha and clojure.spec.test.alpha",
        explanation:
          "Specs live under clojure.spec.alpha, and the companion testing tools are in clojure.spec.test.alpha.",
      },
      associatedSkills: ["clojure"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which tool would you choose to create a lazy, composable transformation pipeline without realizing intermediate sequences?",
        options: ["Transducers", "Reducers", "Persistent lists", "Protocols"],
        correctAnswer: "Transducers",
        explanation:
          "Transducers decouple transformation logic from the input/output context, enabling efficient pipelines across seqs, channels, or core.async.",
      },
      associatedSkills: ["clojure"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "You need Java interop to call a static method on java.time.Instant. What is the idiomatic syntax?",
        options: [
          "(. java.time.Instant now)",
          "(java.time.Instant/now)",
          "java.time.Instant.now()",
          "(Instant.now)",
        ],
        correctAnswer: "(java.time.Instant/now)",
        explanation:
          "Class/method are separated by '/', letting Clojure compile to the proper static invocation.",
      },
      associatedSkills: ["clojure"],
    },
  ],
};
