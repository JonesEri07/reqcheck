# Auto-Detection and Quiz Generation

This document explains how the auto-detection process works when jobs are added and how the widget generates quizzes for applicants.

## Auto-Detection Process

When a job is added (manually or via integration sync), a skill detection process can be triggered (manually or automatically if from sync).

### Skill Detection

The system identifies skills mentioned in the job title and description, then assigns skill level weights based on:

1. **Position in Title**: Skills mentioned in the job title receive higher weight
2. **Position in Description**: Skills mentioned in the first paragraph receive moderate weight
3. **Frequency**: Skills mentioned multiple times receive additional weight

#### Skill Weight Calculation

```typescript
function isInTitle(skill: string, jobTitle: string): boolean {
  return jobTitle.toLowerCase().includes(skill.toLowerCase());
}

function isInFirstParagraph(skill: string, description: string): boolean {
  return description.toLowerCase().includes(skill.toLowerCase());
}

function countMentions(skill: string, description: string): number {
  return description.toLowerCase().split(skill.toLowerCase()).length - 1;
}

export default function calculateSkillWeight(
  skill: string,
  jobTitle: string,
  description: string
): number {
  let weight = 1.0;

  // Factor 1: Position (max +1.0)
  if (isInTitle(skill, jobTitle)) weight += 1.0;
  else if (isInFirstParagraph(skill, description)) weight += 0.5;

  // Factor 2: Frequency (max +0.6)
  const mentions = countMentions(skill, description);
  weight += Math.min(mentions * 0.2, 0.6);

  // Cap between 0.5 and 3.0
  return Math.max(0.5, Math.min(3.0, weight));
}
```

**Important**: Skill detection uses normalized exact matching. For example, the skill "R" would not be detected in words that just contain the letter 'r'.

### Challenge Question Weight Assignment

For each detected skill, the system loops through all challenge questions associated with that skill and assigns weights based on tag matching:

1. **Tag Match**: If any of the question's tags are found in the job title or description:
   - The question receives the **Tag Match Weight** (defined in Team Settings)
   - This weight is typically higher to promote relevant questions

2. **No Tag Match**: If none of the question's tags are found in the job title or description:
   - The question receives the **No Tag Match Weight** (defined in Team Settings)
   - This weight is typically lower

3. **Weight of 0**: Questions with a weight of 0 are not eligible for that job and will not be considered in quiz generation.

### Example

**Job Description:**

```
Senior React Developer

We need a senior developer with strong React experience.
Must have: React, TypeScript
Nice to have: Python, AWS
```

**Process:**

1. Skills detected: "React" (high weight - in title), "TypeScript" (moderate weight), "Python" (lower weight), "AWS" (lower weight)
2. For each React challenge question:
   - If question has tag "Senior" → receives Tag Match Weight (e.g., 2.0)
   - If question has tag "Entry" → receives No Tag Match Weight (e.g., 0.5)
   - If question has no tags → receives No Tag Match Weight (e.g., 0.5)

This helps ensure that Senior-level tagged questions are more likely to be used for Senior positions, while Entry-level questions are less likely.

## Quiz Generation

The widget placed on user application pages generates a randomized quiz per applicant-session. The quiz generation follows a weighted random selection process.

### Prerequisites

Before generating a quiz, the system first checks if a quiz can be generated:

- At least one challenge question from any skill must be available
- If no questions are available, the widget does not render and the page acts as if the widget is not present

### Quiz Generation Algorithm

The widget detects the Job this quiz is for, pulls in the connected/detected skills and their questions with their weights, then follows this process:

```
while number of questions selected < maxQuestionCount AND there are more skill-challenges still available:
  1. From eligible remaining skills (skills that have unused eligible challenge questions):
     - Eligible means: challenge questions not already included in quiz AND without weight of 0
     - Randomly select a skill using weighted distribution (based on skill weights)

  2. From the selected skill, randomly select an eligible challenge question:
     - Eligible means: question not already included in quiz AND without weight of 0
     - Use weighted distribution (based on question weights from tag matching)

  3. Update pool of available skills/challenge questions for next loop iteration
     - Remove selected question from available pool
     - If skill has no more eligible questions, remove skill from available pool

return quiz of challenge questions
```

### Caching

The generated quiz is cached and keyed to:

- **Applicant email** + **job_id**
- **Cache duration**: 24 hours

This means:

- The same applicant taking the quiz for the same job within 24 hours will receive the same quiz
- Different applicants or different jobs will receive different quizzes
- After 24 hours, a new quiz will be generated for the same applicant-job combination

### Widget Rendering Logic

The widget rendering is independent of applicant email:

1. **First Check**: Can a quiz be generated?
   - Check if at least one challenge question from any skill is available
   - If no questions available → do not render widget

2. **If Quiz Can Be Generated**:
   - Render widget according to widget configuration
   - When applicant email is provided:
     - Check if cached quiz exists for that email-job_id combination
     - If cached quiz exists and is less than 24 hours old → use cached quiz
     - Otherwise → generate new quiz and cache it

3. **If Quiz Cannot Be Generated**:
   - Widget does not render
   - Page acts as if widget is not present

## Weight Configuration

Weights are configured in Team Settings:

- **Tag Match Weight**: Applied when question tags are found in job title/description
- **Tag No Match Weight**: Applied when question tags are not found in job title/description
- **Weight of 0**: Excludes question from quiz generation for that job

These weights help give questions a greater chance of being selected for the generated quiz, but selection is not guaranteed - it uses weighted random distribution.

## Use Cases

### Job Level Matching

- Tag questions as "Senior", "Mid-Level", or "Entry"
- Senior positions will more likely receive Senior-tagged questions
- Entry positions will more likely receive Entry-tagged questions

### Focus Area Matching

- Tag questions as "Frontend", "Backend", "Full-Stack", "DevOps"
- Frontend positions will more likely receive Frontend-tagged questions
- Backend positions will more likely receive Backend-tagged questions

### Custom Categories

- Create custom tags that match your team's specific job categories
- Examples: "API Design", "Security", "Performance", "Testing"

## Summary

The auto-detection and quiz generation system works together to:

1. **Automatically identify relevant skills** from job postings
2. **Assign appropriate weights** to challenge questions based on tag matching
3. **Generate relevant quizzes** using weighted random selection
4. **Cache quizzes** for 24 hours per applicant-job combination
5. **Ensure quality** by only including eligible questions (weight > 0)

This system helps streamline the relevance of skills and specific challenge questions for given jobs, promoting appropriate questions (e.g., Senior-level questions for Senior positions) while still maintaining randomization for fairness.
