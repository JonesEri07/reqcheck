import { SkillSeedData } from "../../types";

export const scalaSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Scala",
      skillNormalized: "scala",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which tool compiles and runs Scala projects with build definitions?",
        options: ["sbt", "mvn", "gradle", "cargo"],
        correctAnswer: "sbt",
        explanation:
          "sbt (Simple Build Tool) is Scala's standard build tool for compiling, testing, and running projects.",
      },
      associatedSkills: ["scala"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword declares an immutable value?",
        options: ["val", "var", "let", "const"],
        correctAnswer: "val",
        explanation:
          "Variables declared with val are immutable; var creates mutable references.",
      },
      associatedSkills: ["scala"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which REPL/CLI command runs a Scala source file?",
        options: ["scala Main.scala", "run Main.scala", "javac Main.scala", "cargo run"],
        correctAnswer: "scala Main.scala",
        explanation:
          "The scala executable can run scripts directly or provide a REPL; scalac produces .class files.",
      },
      associatedSkills: ["scala"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which standard collection is immutable by default?",
        options: ["List", "ArrayBuffer", "mutable.Map", "StringBuilder"],
        correctAnswer: "List",
        explanation:
          "scala.collection.immutable.List is immutable; mutable variants exist under scala.collection.mutable.",
      },
      associatedSkills: ["scala"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which construct performs exhaustive pattern matching?",
        options: ["match expressions", "switch", "if/else chains", "goto"],
        correctAnswer: "match expressions",
        explanation:
          "match expressions deconstruct values (especially case classes) and warn when cases are non-exhaustive.",
      },
      associatedSkills: ["scala"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the case class definition.",
        segments: [
          { text: "case class ", block: false },
          { text: "User", block: true },
          { text: "(id: Int, name: String)\n", block: false },
        ],
        blocks: ["User", "case", "class"],
        correctAnswer: ["User"],
        explanation:
          "Case classes automatically generate equals, hashCode, copy, and pattern matching support.",
      },
      associatedSkills: ["scala"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which syntax introduces contextual parameters (implicits) in Scala 3?",
        options: ["using ... and given ...", "implicit def", "@context", "with implicit"],
        correctAnswer: "using ... and given ...",
        explanation:
          "Scala 3 replaces many implicit keywords with using (parameters) and given (instances) for clarity.",
      },
      associatedSkills: ["scala"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which library provides pure functional effects and structured concurrency?",
        options: ["ZIO or Cats Effect", "Play Framework", "Akka HTTP", "Doobie"],
        correctAnswer: "ZIO or Cats Effect",
        explanation:
          "ZIO and Cats Effect implement IO monads for concurrency, resource safety, and functional programming in Scala.",
      },
      associatedSkills: ["scala"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which compiler flag helps migrate Scala 2 code to Scala 3 by enabling new source semantics?",
        options: ["-Xsource:3", "-Ytasty-reader", "-language:future", "-Xfuture"],
        correctAnswer: "-Xsource:3",
        explanation:
          "Using -Xsource:3 on Scala 2.13 opts into Scala 3 syntax/behavior, easing migration.",
      },
      associatedSkills: ["scala"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which concurrency model enables distributed actor systems in Scala?",
        options: ["Akka Cluster actors", "Future.sequence only", "Servlet threads", "Slick streams"],
        correctAnswer: "Akka Cluster actors",
        explanation:
          "Akka Cluster builds on the actor model, providing supervision, sharding, and location transparency across JVM nodes.",
      },
      associatedSkills: ["scala"],
    },
  ],
};
