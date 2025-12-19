/**
 * Get all questions for a job with their weights for quiz generation
 */
import { db } from "@/lib/db/drizzle";
import {
  jobs,
  jobSkills,
  jobSkillQuestionWeights,
  clientSkills,
  clientChallengeQuestions,
} from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { getChallengeQuestionsForSkill } from "@/lib/skills/queries";
import type { SkillWithQuestions, QuestionWithWeight } from "./quiz-generation";

export async function getJobQuestionsForQuiz(
  jobId: string,
  teamId: number,
  defaultQuestionTimeLimitSeconds: number | null = null
): Promise<SkillWithQuestions[]> {
  // Get all job skills with their weights
  const jobSkillsList = await db
    .select({
      jobSkill: jobSkills,
      clientSkill: clientSkills,
    })
    .from(jobSkills)
    .innerJoin(clientSkills, eq(jobSkills.clientSkillId, clientSkills.id))
    .where(eq(jobSkills.jobId, jobId));

  // Get all question weights for this job
  const questionWeightsList = await db
    .select({
      questionWeight: jobSkillQuestionWeights,
      jobSkillId: jobSkills.id,
    })
    .from(jobSkillQuestionWeights)
    .innerJoin(jobSkills, eq(jobSkillQuestionWeights.jobSkillId, jobSkills.id))
    .where(eq(jobSkills.jobId, jobId));

  // Group question weights by jobSkillId
  const questionWeightsByJobSkillId = new Map<
    string,
    Array<(typeof questionWeightsList)[0]["questionWeight"]>
  >();
  for (const item of questionWeightsList) {
    const existing = questionWeightsByJobSkillId.get(item.jobSkillId) || [];
    existing.push(item.questionWeight);
    questionWeightsByJobSkillId.set(item.jobSkillId, existing);
  }

  // Build skills with questions
  const skillsWithQuestions: SkillWithQuestions[] = [];

  for (const item of jobSkillsList) {
    const { jobSkill, clientSkill } = item;
    const questionWeights = questionWeightsByJobSkillId.get(jobSkill.id) || [];

    // Get all questions for this skill
    const allQuestions = await getChallengeQuestionsForSkill(
      clientSkill.id,
      teamId
    );

    // Map questions with their weights
    const questionsWithWeights: QuestionWithWeight[] = allQuestions.map(
      (question) => {
        // Find weight for this question
        const questionWeight = questionWeights.find(
          (qw) => qw.clientChallengeQuestionId === question.id
        );

        // Use weight from jobSkillQuestionWeights, or default to 1.0 if not found
        const weight = questionWeight
          ? parseFloat(questionWeight.weight.toString())
          : 1.0;

        // Determine timeLimitSeconds with correct precedence:
        // 1. ClientChallengeQuestion.timeLimitSeconds (if non-null, including 0)
        // 2. JobSkillQuestionWeight.timeLimitSeconds (if non-null, including 0)
        // 3. Team defaultQuestionTimeLimitSeconds (0 = no limit)
        let timeLimitSeconds: number | null = null;
        if (
          question.timeLimitSeconds !== null &&
          question.timeLimitSeconds !== undefined
        ) {
          // ClientChallengeQuestion has a time limit set (including 0 for no limit)
          timeLimitSeconds = question.timeLimitSeconds;
        } else if (
          questionWeight?.timeLimitSeconds !== null &&
          questionWeight?.timeLimitSeconds !== undefined
        ) {
          // JobSkillQuestionWeight has a time limit set (including 0 for no limit)
          timeLimitSeconds = questionWeight.timeLimitSeconds;
        } else {
          // Use team default (0 = no limit)
          timeLimitSeconds = defaultQuestionTimeLimitSeconds ?? null;
        }

        return {
          questionId: question.id,
          weight,
          question: {
            id: question.id,
            type: question.type,
            prompt: question.prompt,
            config: question.config,
            imageUrl: question.imageUrl,
            imageAltText: question.imageAltText,
            timeLimitSeconds,
          },
        };
      }
    );

    // Only include skills that have at least one question with weight > 0
    const eligibleQuestions = questionsWithWeights.filter((q) => q.weight > 0);
    if (eligibleQuestions.length > 0) {
      skillsWithQuestions.push({
        skillId: clientSkill.id,
        skillName: clientSkill.skillName,
        weight: parseFloat(jobSkill.weight?.toString() || "1.0"),
        questions: eligibleQuestions,
      });
    }
  }

  return skillsWithQuestions;
}
