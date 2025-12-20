import { db } from "../drizzle";
import {
  users,
  teams,
  teamMembers,
  clientSkills,
  clientChallengeQuestions,
  challengeQuestions,
  skillTaxonomy,
  jobs,
  jobSkills,
  jobSkillQuestionWeights,
  SyncChallengeQuestions,
  JobSource,
  SubscriptionStatus,
  PlanName,
} from "../schema";
import { hashPassword } from "@/lib/auth/session";
import { eq, and } from "drizzle-orm";
import {
  autoDetectJobSkillsAndWeights,
  type ClientSkill,
} from "@/lib/jobs/auto-detect";
import { getChallengeQuestionsForSkill } from "@/lib/skills/queries";
import type { InferSelectModel } from "drizzle-orm";

/**
 * Seeds demo data for widget demo pages: demo user, team, skills, questions, and job.
 * This is used for public widget demo pages when users are not logged in.
 */
export async function seedDemoData() {
  console.log("Seeding demo data (user, team, skills, questions, job)...");

  const email = "demo@reqcheck.com";
  const password = "demo123";
  const passwordHash = await hashPassword(password);

  // Check if demo user already exists
  const existingUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.email, email),
  });

  let user: InferSelectModel<typeof users> | undefined;
  let team: InferSelectModel<typeof teams> | undefined;

  if (existingUser) {
    console.log("Demo user already exists, using existing user.");
    user = existingUser;

    // Find existing team for this user
    const teamMember = await db.query.teamMembers.findFirst({
      where: (teamMembers, { eq }) => eq(teamMembers.userId, user!.id),
      with: {
        team: true,
      },
    });

    if (teamMember?.team) {
      team = teamMember.team;
      console.log("Using existing demo team.");

      // Ensure demo team has active subscription status
      if (team && team.subscriptionStatus !== SubscriptionStatus.ACTIVE) {
        await db
          .update(teams)
          .set({
            planName: PlanName.PRO,
            subscriptionStatus: SubscriptionStatus.ACTIVE,
          })
          .where(eq(teams.id, team.id));

        // Refresh team data
        const teamId = team.id;
        const updatedTeam = await db.query.teams.findFirst({
          where: (teams, { eq }) => eq(teams.id, teamId),
        });
        if (updatedTeam) {
          team = updatedTeam;
        }
        console.log("Updated demo team subscription status to ACTIVE.");
      }
    } else {
      // Create team if it doesn't exist
      [team] = await db
        .insert(teams)
        .values({
          name: "Demo Team",
          syncChallengeQuestions: SyncChallengeQuestions.REQCHECK,
          planName: PlanName.PRO,
          subscriptionStatus: SubscriptionStatus.ACTIVE,
        })
        .returning();

      if (team) {
        await db.insert(teamMembers).values({
          teamId: team.id,
          userId: user!.id,
          role: "owner",
        });
      }
      console.log("Created demo team.");
    }
  } else {
    // Create user
    [user] = await db
      .insert(users)
      .values([
        {
          email: email,
          passwordHash: passwordHash,
          role: "owner",
        },
      ])
      .returning();

    console.log("Demo user created.");

    // Create team with sync enabled and active subscription for demo
    [team] = await db
      .insert(teams)
      .values({
        name: "Demo Team",
        syncChallengeQuestions: SyncChallengeQuestions.REQCHECK,
        planName: PlanName.PRO,
        subscriptionStatus: SubscriptionStatus.ACTIVE,
      })
      .returning();

    await db.insert(teamMembers).values({
      teamId: team.id,
      userId: user.id,
      role: "owner",
    });

    console.log("Demo team created.");
  }

  // Skills to add: JavaScript, CSS, Tailwind, React, React Native, HTML
  const skillNames = [
    "JavaScript",
    "CSS",
    "Tailwind",
    "React",
    "React Native",
    "HTML",
  ];

  // Find skill taxonomy entries - query each skill individually
  const foundSkills: Array<typeof skillTaxonomy.$inferSelect> = [];
  for (const skillName of skillNames) {
    const normalized = skillName.toLowerCase();
    const skill = await db.query.skillTaxonomy.findFirst({
      where: (taxonomy, { eq }) => eq(taxonomy.skillNormalized, normalized),
    });

    if (skill) {
      foundSkills.push(skill);
    } else {
      console.warn(`Skill "${skillName}" not found in skill taxonomy.`);
    }
  }

  console.log(`Found ${foundSkills.length} skills in taxonomy.`);

  // Add skills to client library and sync questions
  const clientSkillMap = new Map<string, string>(); // skillTaxonomyId -> clientSkillId

  for (const globalSkill of foundSkills) {
    // Check if already in library
    const existing = await db.query.clientSkills.findFirst({
      where: (skills, { eq, and }) =>
        and(
          eq(skills.teamId, team.id),
          eq(skills.skillTaxonomyId, globalSkill.id)
        ),
    });

    if (existing) {
      console.log(`Skill "${globalSkill.skillName}" already in library.`);
      clientSkillMap.set(globalSkill.id, existing.id);

      // Still sync questions for existing skills to ensure they're up to date
      const globalQuestions = await db
        .select()
        .from(challengeQuestions)
        .where(eq(challengeQuestions.skillTaxonomyId, globalSkill.id));

      if (globalQuestions.length > 0) {
        // Get existing questions for this skill to avoid duplicates
        const existingQuestions = await db
          .select()
          .from(clientChallengeQuestions)
          .where(
            and(
              eq(clientChallengeQuestions.teamId, team.id),
              eq(clientChallengeQuestions.clientSkillId, existing.id)
            )
          );

        // Create a set of existing prompts for quick lookup
        const existingPrompts = new Set(existingQuestions.map((q) => q.prompt));

        // Filter out questions that already exist
        const questionsToInsert = globalQuestions
          .filter((q) => !existingPrompts.has(q.prompt))
          .map((q) => ({
            teamId: team.id,
            clientSkillId: existing.id,
            type: q.type,
            prompt: q.prompt,
            config: q.config,
            imageUrl: null,
            imageAltText: null,
            timeLimitSeconds: null,
          }));

        if (questionsToInsert.length > 0) {
          await db.insert(clientChallengeQuestions).values(questionsToInsert);
          console.log(
            `Synced ${questionsToInsert.length} new questions for existing skill "${globalSkill.skillName}" (${globalQuestions.length - questionsToInsert.length} already existed).`
          );
        }
      }

      continue;
    }

    // Create client skill
    const [createdSkill] = await db
      .insert(clientSkills)
      .values({
        teamId: team.id,
        skillName: globalSkill.skillName,
        skillNormalized: globalSkill.skillNormalized,
        skillTaxonomyId: globalSkill.id,
        aliases: globalSkill.aliases || [],
      })
      .returning();

    clientSkillMap.set(globalSkill.id, createdSkill.id);
    console.log(`Added skill "${globalSkill.skillName}" to library.`);

    // Sync challenge questions from global taxonomy
    const globalQuestions = await db
      .select()
      .from(challengeQuestions)
      .where(eq(challengeQuestions.skillTaxonomyId, globalSkill.id));

    if (globalQuestions.length > 0) {
      // Get existing questions for this skill to avoid duplicates
      const existingQuestions = await db
        .select()
        .from(clientChallengeQuestions)
        .where(
          and(
            eq(clientChallengeQuestions.teamId, team.id),
            eq(clientChallengeQuestions.clientSkillId, createdSkill.id)
          )
        );

      // Create a set of existing prompts for quick lookup
      const existingPrompts = new Set(existingQuestions.map((q) => q.prompt));

      // Filter out questions that already exist
      const questionsToInsert = globalQuestions
        .filter((q) => !existingPrompts.has(q.prompt))
        .map((q) => ({
          teamId: team.id,
          clientSkillId: createdSkill.id,
          type: q.type,
          prompt: q.prompt,
          config: q.config,
          imageUrl: null,
          imageAltText: null,
          timeLimitSeconds: null,
        }));

      if (questionsToInsert.length > 0) {
        await db.insert(clientChallengeQuestions).values(questionsToInsert);
        console.log(
          `Synced ${questionsToInsert.length} new questions for "${globalSkill.skillName}" (${globalQuestions.length - questionsToInsert.length} already existed).`
        );
      } else {
        console.log(
          `All ${globalQuestions.length} questions for "${globalSkill.skillName}" already exist.`
        );
      }
    }
  }

  // Create a job with description including those skill names
  const jobDescription = `We are looking for a talented Frontend Developer to join our team. 

The ideal candidate should have strong experience with JavaScript, HTML, and CSS. Experience with modern frameworks like React and React Native is highly preferred. Knowledge of Tailwind CSS for styling is a plus.

Responsibilities:
- Develop responsive web applications using JavaScript, HTML, and CSS
- Build React components and applications
- Work with React Native for mobile development
- Style applications using Tailwind CSS
- Collaborate with design and backend teams

Requirements:
- Strong proficiency in JavaScript
- Solid understanding of HTML and CSS
- Experience with React framework
- Familiarity with React Native
- Knowledge of Tailwind CSS`;

  // Check if job already exists
  const existingJob = await db.query.jobs.findFirst({
    where: (jobs, { eq, and }) =>
      and(eq(jobs.teamId, team.id), eq(jobs.title, "Frontend Developer")),
  });

  let job: InferSelectModel<typeof jobs> | undefined;
  if (existingJob) {
    console.log("Demo job already exists, using existing job.");
    job = existingJob;
  } else {
    // Create job
    [job] = await db
      .insert(jobs)
      .values({
        teamId: team.id,
        externalJobId: "demo-frontend-developer",
        title: "Frontend Developer",
        description: jobDescription,
        source: JobSource.MANUAL,
      })
      .returning();

    console.log("Demo job created.");

    // Get all available client skills for auto-detect
    const availableClientSkills: ClientSkill[] = await db
      .select()
      .from(clientSkills)
      .where(eq(clientSkills.teamId, team.id));

    // Get all questions for all skills
    const allQuestionsMap = new Map<
      string,
      Awaited<ReturnType<typeof getChallengeQuestionsForSkill>>
    >();
    for (const skill of availableClientSkills) {
      const questions = await getChallengeQuestionsForSkill(skill.id, team.id);
      allQuestionsMap.set(skill.id, questions);
    }

    // Get team settings for weights
    const teamRecord = await db.query.teams.findFirst({
      where: (teams, { eq }) => eq(teams.id, team.id),
    });

    const tagMatchWeight = parseFloat(teamRecord?.tagMatchWeight || "1.5");
    const tagNoMatchWeight = parseFloat(teamRecord?.tagNoMatchWeight || "1.0");

    // Run auto-detection (job is guaranteed to be defined here since we just created it)
    if (!job) {
      throw new Error("Failed to create demo job");
    }

    const detected = autoDetectJobSkillsAndWeights(
      job.title,
      job.description || "",
      availableClientSkills,
      allQuestionsMap,
      tagMatchWeight,
      tagNoMatchWeight
    );

    // Create job skills
    const skillIdToJobSkillId = new Map<string, string>();
    if (detected.jobSkills.length > 0) {
      const jobId = job.id; // Capture job.id to avoid TS error
      const jobSkillsToInsert = detected.jobSkills.map((js) => ({
        jobId: jobId,
        clientSkillId: js.clientSkillId,
        weight: js.weight.toString(),
        required: js.required,
        manuallyAdded: js.manuallyAdded,
      }));

      const insertedJobSkills = await db
        .insert(jobSkills)
        .values(jobSkillsToInsert)
        .returning();

      // Map clientSkillId to jobSkillId
      insertedJobSkills.forEach((js) => {
        skillIdToJobSkillId.set(js.clientSkillId, js.id);
      });

      console.log(`Created ${insertedJobSkills.length} job skills.`);
    }

    // Create question weights
    if (detected.questionWeights.length > 0) {
      const questionWeightsToInsert = detected.questionWeights
        .filter((qw) => skillIdToJobSkillId.has(qw.clientSkillId))
        .map((qw) => ({
          jobSkillId: skillIdToJobSkillId.get(qw.clientSkillId)!,
          clientChallengeQuestionId: qw.clientChallengeQuestionId,
          weight: qw.weight.toString(),
          timeLimitSeconds: null,
          source: "auto" as const,
        }));

      if (questionWeightsToInsert.length > 0) {
        await db
          .insert(jobSkillQuestionWeights)
          .values(questionWeightsToInsert);
        console.log(
          `Created ${questionWeightsToInsert.length} question weights.`
        );
      }
    }
  }

  console.log("Demo data seeding completed.");
  if (!user || !team || !job) {
    throw new Error("Failed to create demo data: missing user, team, or job");
  }
  return { userId: user.id, teamId: team.id, jobId: job.id };
}
