import { db } from "../drizzle";
import {
  verificationAttempts,
  verificationQuestionHistory,
  jobs,
  clientSkills,
  clientChallengeQuestions,
} from "../schema";
import { eq } from "drizzle-orm";
import { normalizeEmail } from "@/lib/utils/email";

/**
 * Seeds test applications (verification attempts) with question history.
 * This should only be used in development/local testing environments.
 * @param teamId - Optional team ID to seed applications for. If not provided, will use "Test Team".
 */
export async function seedApplications(teamId?: number) {
  console.log("Seeding applications (verification attempts)...");

  // Get the team - either by ID or by name
  let team;
  if (teamId) {
    team = await db.query.teams.findFirst({
      where: (teams, { eq }) => eq(teams.id, teamId),
    });
    if (!team) {
      console.log(`Team with ID ${teamId} not found.`);
      return;
    }
  } else {
    team = await db.query.teams.findFirst({
      where: (teams, { eq }) => eq(teams.name, "Test Team"),
    });
    if (!team) {
      console.log(
        "Test team not found. Run seedDevData first or provide a teamId."
      );
      return;
    }
  }

  console.log(`Seeding applications for team: ${team.name} (ID: ${team.id})`);

  // Get jobs for this team
  const teamJobs = await db.query.jobs.findMany({
    where: (jobs, { eq }) => eq(jobs.teamId, team.id),
    limit: 5,
  });

  if (teamJobs.length === 0) {
    console.log("No jobs found. Create some jobs first.");
    return;
  }

  // Get client skills and questions
  const skills = await db.query.clientSkills.findMany({
    where: (skills, { eq }) => eq(skills.teamId, team.id),
    limit: 10,
  });

  if (skills.length === 0) {
    console.log("No skills found. Add skills to your library first.");
    return;
  }

  // Get questions for these skills
  const skillIds = skills.map((s) => s.id);
  const allQuestions = await db.query.clientChallengeQuestions.findMany({
    where: (questions, { eq }) => eq(questions.teamId, team.id),
    limit: 50,
  });
  const questions = allQuestions.filter((q) =>
    skillIds.includes(q.clientSkillId)
  );

  if (questions.length === 0) {
    console.log("No questions found. Add questions to your skills first.");
    return;
  }

  // Create sample verification attempts (applications)
  const sampleEmails = [
    "john.doe@example.com",
    "jane.smith@example.com",
    "bob.johnson@example.com",
    "alice.williams@example.com",
    "charlie.brown@example.com",
    "diana.prince@example.com",
    "frank.miller@example.com",
    "grace.hopper@example.com",
  ];

  const attemptsToInsert = [];

  for (let i = 0; i < sampleEmails.length; i++) {
    const email = sampleEmails[i];
    const emailNormalized = normalizeEmail(email);
    const job = teamJobs[i % teamJobs.length];
    const isCompleted = i < 6; // First 6 are completed
    const passed = i < 4; // First 4 passed
    const score = isCompleted
      ? passed
        ? 75 + Math.floor(Math.random() * 20)
        : 40 + Math.floor(Math.random() * 20)
      : null;

    const createdAt = new Date(Date.now() - i * 24 * 60 * 60 * 1000);
    const completedAt = isCompleted ? createdAt : null;

    // Create verification attempt (only for passed ones - these are "applications")
    if (passed && isCompleted) {
      const [attempt] = await db
        .insert(verificationAttempts)
      .values({
        teamId: team.id,
        jobId: job.id,
        email: email,
          emailNormalized: emailNormalized,
        score: score,
          passed: true,
          completedAt: completedAt,
        referralSource: i % 2 === 0 ? "LinkedIn" : "Company Website",
          deviceType:
            i % 3 === 0 ? "desktop" : i % 3 === 1 ? "mobile" : "tablet",
          startedAt: createdAt,
          passThreshold: job.passThreshold || 70,
          stripeReported: false,
      })
      .returning();

    // Add question history for completed applications
      // Select 3-5 random questions
      const selectedQuestions = questions
        .sort(() => Math.random() - 0.5)
        .slice(0, 3 + Math.floor(Math.random() * 3));

      for (let j = 0; j < selectedQuestions.length; j++) {
        const question = selectedQuestions[j];
        const skill = skills.find((s) => s.id === question.clientSkillId);
        const isCorrect =
          j < Math.ceil(selectedQuestions.length * (score! / 100));

        // Extract question data
        const questionData = question.config as any;
        const questionPrompt = question.prompt;

        // Create answer based on question type
        let answer: any = {};
        if (question.type === "multiple_choice" && questionData.options) {
          const selectedOption = isCorrect
            ? questionData.correctAnswer
            : questionData.options.find(
                (opt: string) => opt !== questionData.correctAnswer
              );
          answer = {
            questionId: question.id,
            answer: selectedOption,
            isCorrect,
            answeredAt: new Date(createdAt.getTime() + j * 60000).toISOString(),
          };
        } else if (
          question.type === "fill_blank_blocks" &&
          questionData.segments
        ) {
          const blanks = questionData.segments.filter(
            (seg: any) => seg.type === "blank"
          );
          const answers = blanks.map((_: any, idx: number) => {
            if (isCorrect) {
              return questionData.correctAnswer[idx] || `answer${idx + 1}`;
            }
            return `wrong${idx + 1}`;
          });
          answer = {
            questionId: question.id,
            answer: answers,
            isCorrect,
            answeredAt: new Date(createdAt.getTime() + j * 60000).toISOString(),
          };
        }

        await db.insert(verificationQuestionHistory).values({
          verificationAttemptId: attempt.id,
          questionId: question.id,
          clientSkillId: question.clientSkillId,
          questionPreview: questionPrompt.substring(0, 100),
          skillName: skill?.skillName || "Unknown Skill",
          skillNormalized: skill?.skillNormalized || "unknown",
          questionData: {
            type: question.type,
            prompt: questionPrompt,
            config: questionData,
            imageUrl: question.imageUrl || null,
            imageAltText: question.imageAltText || null,
            timeLimitSeconds: question.timeLimitSeconds || null,
          },
          skillData: skill || {},
          answer: answer,
          createdAt: new Date(createdAt.getTime() + j * 60000), // 1 minute apart
        });
      }

      attemptsToInsert.push(attempt);
    }
  }

  console.log(
    `Created ${attemptsToInsert.length} applications (verification attempts) with question history.`
  );
}
