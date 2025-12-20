import { SkillSeedData } from "../../types";

export const mongodbSeed: SkillSeedData = {
  skills: [
    {
      skillName: "MongoDB",
      skillNormalized: "mongodb",
      aliases: ["mongo"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "What does this MongoDB query do?\n\n```javascript\ndb.users.find({ age: { $gt: 18 } })\n```",
        options: [
          "Finds users older than 18",
          "Finds users 18 and younger",
          "Finds 18 users",
          "Deletes users",
        ],
        correctAnswer: "Finds users older than 18",
        explanation: "$gt means 'greater than' in MongoDB.",
      },
      associatedSkills: ["mongodb"],
    },
  ],
};

