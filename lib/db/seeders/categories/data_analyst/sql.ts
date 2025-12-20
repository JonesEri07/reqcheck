import { SkillSeedData } from "../../types";

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
          "What does this return?\n\n```sql\nSELECT SUM(amount) FROM sales;\n```",
        options: [
          "Total of all amounts",
          "All sales records",
          "Number of sales",
          "Average amount",
        ],
        correctAnswer: "Total of all amounts",
        explanation: "SUM() adds up all values in the amount column.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this return?\n\n```sql\nSELECT AVG(price) FROM products;\n```",
        options: [
          "Average price",
          "All prices",
          "Total price",
          "Highest price",
        ],
        correctAnswer: "Average price",
        explanation: "AVG() calculates the average value.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Fill in the blank:\n\n```sql\nSELECT ___(score) FROM results;\n```\n\n(Find highest value)",
        options: ["MAX", "TOP", "HIGHEST", "BIGGEST"],
        correctAnswer: "MAX",
        explanation: "MAX() returns the highest value.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this return?\n\n```sql\nSELECT COUNT(*) FROM users WHERE active = true;\n```",
        options: [
          "Number of active users",
          "All active users",
          "All users",
          "User names",
        ],
        correctAnswer: "Number of active users",
        explanation: "COUNT(*) counts rows matching the WHERE condition.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this do?\n\n```sql\nSELECT category, SUM(revenue) FROM sales GROUP BY category;\n```",
        options: [
          "Groups by category and sums revenue",
          "Sorts by category",
          "Filters by category",
          "Joins categories",
        ],
        correctAnswer: "Groups by category and sums revenue",
        explanation: "GROUP BY groups rows, SUM() aggregates values per group.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this return?\n\n```sql\nSELECT * FROM orders WHERE order_date >= '2024-01-01';\n```",
        options: [
          "Orders from 2024-01-01 onwards",
          "All orders",
          "Only orders on 2024-01-01",
          "Orders before 2024-01-01",
        ],
        correctAnswer: "Orders from 2024-01-01 onwards",
        explanation: ">= means 'greater than or equal to'.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Fill in the blank:\n\n```sql\nSELECT ___(price) FROM products;\n```\n\n(Calculate average)",
        options: ["AVG", "MEAN", "AVERAGE", "CALC_AVG"],
        correctAnswer: "AVG",
        explanation: "AVG() calculates the average of numeric values.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this do?\n\n```sql\nSELECT customer_id, COUNT(*) as order_count\nFROM orders\nGROUP BY customer_id\nHAVING COUNT(*) > 5;\n```",
        options: [
          "Finds customers with more than 5 orders",
          "Finds all customers",
          "Counts all orders",
          "Finds orders with id > 5",
        ],
        correctAnswer: "Finds customers with more than 5 orders",
        explanation: "HAVING filters groups after GROUP BY.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this return?\n\n```sql\nSELECT MIN(price), MAX(price) FROM products;\n```",
        options: [
          "Lowest and highest prices",
          "All prices",
          "Average price",
          "Price count",
        ],
        correctAnswer: "Lowest and highest prices",
        explanation: "MIN() returns lowest, MAX() returns highest.",
      },
      associatedSkills: ["sql"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Fill in the blank:\n\n```sql\nSELECT department, AVG(salary)\nFROM employees\nGROUP BY department\n___ AVG(salary) > 50000;\n```",
        options: ["HAVING", "WHERE", "FILTER", "CONDITION"],
        correctAnswer: "HAVING",
        explanation: "HAVING filters groups, WHERE filters rows.",
      },
      associatedSkills: ["sql"],
    },
  ],
};

