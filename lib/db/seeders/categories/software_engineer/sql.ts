import { SkillSeedData } from "../../types.js";

export const sqlSeed: SkillSeedData = {
  skills: [
    {
      skillName: "SQL",
      skillNormalized: "sql",
      aliases: ["structured query language"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this return?\n\n```sql\nSELECT COUNT(*) FROM users;\n```",
        options: ["All users", "The number of users", "User names", "An error"],
        correctAnswer: "The number of users",
        explanation: "COUNT(*) returns the total number of rows.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Fill in the blank:\n\n```sql\n___ * FROM products;\n```",
        options: ["SELECT", "GET", "FETCH", "READ"],
        correctAnswer: "SELECT",
        explanation: "SELECT is used to retrieve data from a table.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this return?\n\n```sql\nSELECT name FROM users WHERE id = 5;\n```",
        options: [
          "Name of user with id 5",
          "All user names",
          "5 user names",
          "An error",
        ],
        correctAnswer: "Name of user with id 5",
        explanation: "WHERE filters rows where id equals 5.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Fill in the blank:\n\n```sql\n___ INTO users (name) VALUES ('John');\n```",
        options: ["INSERT", "ADD", "CREATE", "NEW"],
        correctAnswer: "INSERT",
        explanation: "INSERT adds new rows to a table.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this return?\n\n```sql\nSELECT * FROM orders WHERE status = 'pending';\n```",
        options: [
          "All pending orders",
          "All orders",
          "Only 'pending' text",
          "An error",
        ],
        correctAnswer: "All pending orders",
        explanation: "WHERE clause filters rows matching the condition.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Fill in the blank:\n\n```sql\n___ users SET email = 'test@example.com' WHERE id = 1;\n```",
        options: ["UPDATE", "MODIFY", "CHANGE", "EDIT"],
        correctAnswer: "UPDATE",
        explanation: "UPDATE modifies existing rows in a table.",
      },
      associatedSkills: ["sql"],
    },
  ],
};
