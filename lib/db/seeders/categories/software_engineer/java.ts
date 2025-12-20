import { SkillSeedData } from "../../types";

export const javaSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Java",
      skillNormalized: "java",
      aliases: ["java8", "java11", "java17"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword defines a class in Java?",
        options: ["class", "struct", "def", "function"],
        correctAnswer: "class",
        explanation:
          "Java uses the class keyword to declare classes: public class Foo { }.",
      },
      associatedSkills: ["java"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method serves as the entry point for standalone Java applications?",
        options: [
          "public static void main(String[] args)",
          "public void run()",
          "public static void start()",
          "int main()",
        ],
        correctAnswer: "public static void main(String[] args)",
        explanation:
          "The JVM looks for a public static void main method to start execution.",
      },
      associatedSkills: ["java"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which collection maintains insertion order and allows duplicates?",
        options: ["ArrayList", "HashSet", "TreeSet", "HashMap"],
        correctAnswer: "ArrayList",
        explanation:
          "ArrayList is an ordered list backing array; sets enforce uniqueness.",
      },
      associatedSkills: ["java"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword prevents a variable from being reassigned?",
        options: ["final", "const", "static", "val"],
        correctAnswer: "final",
        explanation:
          "final variables can only be assigned once, enforcing immutability references.",
      },
      associatedSkills: ["java"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package provides Stream API classes?",
        options: ["java.util.stream", "java.io", "java.nio.file", "java.util.concurrent"],
        correctAnswer: "java.util.stream",
        explanation:
          "java.util.stream contains Stream, IntStream, Collectors, etc., introduced in Java 8.",
      },
      associatedSkills: ["java"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the try-with-resources statement that auto closes a BufferedReader.",
        segments: [
          { text: "try (BufferedReader reader = Files.newBufferedReader(path)) {\n  return reader.readLine();\n} ", block: false },
          { text: "catch", block: true },
          { text: " (IOException ex) {\n  throw new UncheckedIOException(ex);\n}\n", block: false },
        ],
        blocks: ["catch", "finally", "throw"],
        correctAnswer: ["catch"],
        explanation:
          "try-with-resources ensures AutoCloseable resources close automatically; a catch handles IOExceptions.",
      },
      associatedSkills: ["java"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which interface enables functional-style lambda expressions with a single abstract method?",
        options: ["FunctionalInterface", "Serializable", "Runnable only", "Cloneable"],
        correctAnswer: "FunctionalInterface",
        explanation:
          "@FunctionalInterface marks interfaces meant for lambdas; the compiler enforces one abstract method.",
      },
      associatedSkills: ["java"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which Map implementation preserves insertion order while providing near HashMap performance?",
        options: ["LinkedHashMap", "TreeMap", "ConcurrentHashMap", "Hashtable"],
        correctAnswer: "LinkedHashMap",
        explanation:
          "LinkedHashMap maintains a double-linked list of entries to preserve iteration order.",
      },
      associatedSkills: ["java"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To avoid false sharing in high-throughput counters, which JDK class provides striped atomic increments?",
        options: [
          "LongAdder",
          "AtomicInteger",
          "AtomicLongArray",
          "Semaphore",
        ],
        correctAnswer: "LongAdder",
        explanation:
          "LongAdder spreads contention across multiple cells, outperforming AtomicLong under heavy contention.",
      },
      associatedSkills: ["java"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which garbage collector provides low-latency, region-based collection for large heaps in Java 11+?",
        options: ["G1 GC", "Serial GC", "Parallel GC", "CMS (deprecated)"],
        correctAnswer: "G1 GC",
        explanation:
          "Garbage-First (G1) is the default in modern JVMs, offering predictable pause times by collecting regions incrementally.",
      },
      associatedSkills: ["java"],
    },
  ],
};
