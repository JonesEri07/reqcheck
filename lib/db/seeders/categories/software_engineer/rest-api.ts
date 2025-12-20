import { SkillSeedData } from "../../types";

export const restApiSeed: SkillSeedData = {
  skills: [
    {
      skillName: "REST API",
      skillNormalized: "rest api",
      aliases: ["rest", "restful"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What HTTP status code is returned for a successful GET request?",
        options: ["200", "201", "404", "500"],
        correctAnswer: "200",
        explanation: "HTTP status code 200 indicates a successful GET request.",
      },
      associatedSkills: ["rest api"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Fill in the blank: Use ___ to create a new resource.",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: "POST",
        explanation:
          "POST method is used to create new resources in REST APIs.",
      },
      associatedSkills: ["rest api"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What HTTP method is used to delete a resource?",
        options: ["GET", "POST", "PUT", "DELETE"],
        correctAnswer: "DELETE",
        explanation: "DELETE method removes a resource.",
      },
      associatedSkills: ["rest api"],
    },
  ],
};

