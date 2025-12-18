/**
 * Quiz Generation Utility
 * Implements weighted random selection algorithm for generating quizzes
 */

export interface SkillWithQuestions {
  skillId: string;
  skillName: string;
  weight: number;
  questions: QuestionWithWeight[];
}

export interface QuestionWithWeight {
  questionId: string;
  weight: number;
  question: any; // Full question object
}

/**
 * Select an item from an array using weighted random distribution
 */
function weightedRandomSelect<T>(
  items: T[],
  getWeight: (item: T) => number
): T | null {
  if (items.length === 0) return null;

  // Calculate total weight
  const totalWeight = items.reduce((sum, item) => sum + getWeight(item), 0);
  if (totalWeight === 0) return null;

  // Generate random number between 0 and totalWeight
  let random = Math.random() * totalWeight;

  // Find the item that corresponds to this random value
  for (const item of items) {
    const weight = getWeight(item);
    random -= weight;
    if (random <= 0) {
      return item;
    }
  }

  // Fallback to last item (shouldn't happen, but just in case)
  return items[items.length - 1];
}

/**
 * Generate a quiz using weighted random selection with fairness constraint
 *
 * Algorithm:
 * while number of questions selected < maxQuestionCount AND there are more skill-challenges still available:
 *   1. Track which skills have been selected in the current "fairness cycle"
 *   2. If there are skills that haven't been selected yet in this cycle:
 *      - Only consider those skills (but still use weighted distribution)
 *   3. Once all skills have been selected at least once, reset the cycle
 *   4. From eligible skills, randomly select a skill using weighted distribution
 *   5. From the selected skill, randomly select an eligible challenge question using weighted distribution
 *   6. Update pool of available skills/challenge questions
 *
 * This ensures:
 * - Each skill gets at least one question before any skill gets a second
 * - Skill weights still influence selection probability
 * - After the first cycle, normal weighted selection continues
 */
export function generateQuiz(
  skillsWithQuestions: SkillWithQuestions[],
  maxQuestionCount: number
): any[] {
  const selectedQuestions: any[] = [];

  // Filter to only skills that have eligible questions (weight > 0)
  let availableSkills = skillsWithQuestions
    .map((skill) => ({
      ...skill,
      questions: skill.questions.filter((q) => q.weight > 0),
      selectedInCycle: false, // Track if this skill has been selected in current cycle
    }))
    .filter((skill) => skill.questions.length > 0);

  while (
    selectedQuestions.length < maxQuestionCount &&
    availableSkills.length > 0
  ) {
    // Step 1: Check if there are skills that haven't been selected in this cycle
    const unselectedSkills = availableSkills.filter(
      (skill) => !skill.selectedInCycle
    );

    // Step 2: If all skills have been selected, reset the cycle
    if (unselectedSkills.length === 0) {
      availableSkills.forEach((skill) => {
        skill.selectedInCycle = false;
      });
      // Re-check unselected skills after reset
      const resetUnselected = availableSkills.filter(
        (skill) => !skill.selectedInCycle
      );
      if (resetUnselected.length === 0) {
        // This shouldn't happen, but break to avoid infinite loop
        break;
      }
    }

    // Step 3: Select from unselected skills (if any) or all skills (after cycle reset)
    // This ensures fairness: each skill gets at least one question before any gets a second
    const skillsToConsider =
      unselectedSkills.length > 0 ? unselectedSkills : availableSkills;

    // Step 4: Select a skill using weighted distribution (weights still matter!)
    const selectedSkill = weightedRandomSelect(
      skillsToConsider,
      (skill) => skill.weight
    );

    if (!selectedSkill) break;

    // Step 5: Mark this skill as selected in the current cycle
    selectedSkill.selectedInCycle = true;

    // Step 6: Select a question from the selected skill using weighted distribution
    const selectedQuestion = weightedRandomSelect(
      selectedSkill.questions,
      (q) => q.weight
    );

    if (!selectedQuestion) {
      // No eligible questions in this skill, remove it
      availableSkills = availableSkills.filter(
        (skill) => skill.skillId !== selectedSkill.skillId
      );
      continue;
    }

    // Add question to quiz with skill name and ID
    selectedQuestions.push({
      ...selectedQuestion.question,
      skillId: selectedSkill.skillId,
      skillName: selectedSkill.skillName,
    });

    // Step 7: Remove selected question from available pool
    selectedSkill.questions = selectedSkill.questions.filter(
      (q) => q.questionId !== selectedQuestion.questionId
    );

    // If skill has no more eligible questions, remove it from available pool
    if (selectedSkill.questions.length === 0) {
      availableSkills = availableSkills.filter(
        (skill) => skill.skillId !== selectedSkill.skillId
      );
    }
  }

  return selectedQuestions;
}
