import "server-only";
import { db } from "../drizzle";
import { skillTaxonomy, challengeQuestions } from "../schema";
import { dataAnalystSeed } from "./categories/data_analyst/index";
import { softwareEngineerSeed } from "./categories/software_engineer/index";
import type { SkillDefinition, QuestionDefinition } from "./types";
import { eq } from "drizzle-orm";

/**
 * Seeds skills and challenge questions from category seeders.
 * This is the production seeder that should be run in production environments.
 */
export async function seedSkillsAndQuestions() {
  console.log("Seeding skills and challenge questions...");

  // Collect all skills and questions from both categories
  const allSkills: SkillDefinition[] = [
    ...dataAnalystSeed.skills,
    ...softwareEngineerSeed.skills,
  ];
  const allQuestions: QuestionDefinition[] = [
    ...dataAnalystSeed.questions,
    ...softwareEngineerSeed.questions,
  ];

  // Deduplicate skills by skillNormalized
  const uniqueSkillsMap = new Map<string, SkillDefinition>();
  for (const skill of allSkills) {
    const normalized = skill.skillNormalized.toLowerCase();
    if (!uniqueSkillsMap.has(normalized)) {
      uniqueSkillsMap.set(normalized, skill);
    } else {
      // Merge aliases if skill already exists
      const existing = uniqueSkillsMap.get(normalized)!;
      const mergedAliases = [
        ...new Set([...existing.aliases, ...skill.aliases]),
      ];
      uniqueSkillsMap.set(normalized, {
        ...existing,
        aliases: mergedAliases,
      });
    }
  }

  const uniqueSkills = Array.from(uniqueSkillsMap.values());
  console.log(`Found ${uniqueSkills.length} unique skills to seed`);

  // Insert skills into skillTaxonomy
  const skillTaxonomyMap = new Map<string, string>(); // skillNormalized -> skillTaxonomyId

  for (const skill of uniqueSkills) {
    try {
      const normalized = skill.skillNormalized.toLowerCase();

      // Check if skill already exists
      const existing = await db.query.skillTaxonomy.findFirst({
        where: (st, { eq }) => eq(st.skillNormalized, normalized),
      });

      if (existing) {
        // Update aliases if skill exists
        await db
          .update(skillTaxonomy)
          .set({
            aliases: skill.aliases,
            updatedAt: new Date(),
          })
          .where(eq(skillTaxonomy.id, existing.id));

        skillTaxonomyMap.set(normalized, existing.id);
      } else {
        // Insert new skill
        const [inserted] = await db
          .insert(skillTaxonomy)
          .values({
            skillName: skill.skillName,
            skillNormalized: normalized,
            aliases: skill.aliases,
          })
          .returning();

        skillTaxonomyMap.set(normalized, inserted.id);
      }
    } catch (error: any) {
      console.error(`Failed to insert/update skill ${skill.skillName}:`, error);
    }
  }

  console.log(`Inserted ${skillTaxonomyMap.size} skills into skillTaxonomy`);

  // Insert challenge questions
  let questionsInserted = 0;
  let questionsSkipped = 0;

  for (const questionDef of allQuestions) {
    // Find the skill taxonomy ID for each associated skill
    // Questions can have multiple associated skills, we'll link to the first one found
    let skillTaxonomyId: string | null = null;

    for (const associatedSkill of questionDef.associatedSkills) {
      const normalized = associatedSkill.toLowerCase();
      const taxonomyId = skillTaxonomyMap.get(normalized);
      if (taxonomyId) {
        skillTaxonomyId = taxonomyId;
        break;
      }
    }

    if (!skillTaxonomyId) {
      console.warn(
        `Skipping question - no skill taxonomy found for skills: ${questionDef.associatedSkills.join(", ")}`
      );
      questionsSkipped++;
      continue;
    }

    try {
      // Transform question structure to new schema: type, prompt, config
      // Old structure: { type, question, options, segments, blocks, correctAnswer, explanation, imageUrl?, imageAlt? }
      // New structure: type, prompt, config: { options, correctAnswer } | { templateSource, segments, extraBlanks, blocks, correctAnswer }
      const {
        type,
        question: prompt,
        options,
        segments: oldSegments,
        blocks,
        correctAnswer,
        explanation,
        imageUrl,
        imageAlt,
      } = questionDef.question as any;

      let config: any;

      if (type === "multiple_choice") {
        // Multiple choice config
        config = {
          options: options || [],
          correctAnswer: correctAnswer || "",
        };
      } else if (type === "fill_blank_blocks") {
        // Transform old segments format { text: string, block: boolean }[] to new Segment[]
        // Old format: [{ text: "function", block: true }, { text: "\n  ", block: false }]
        // New format: [{ type: "blank", text: "function" }, { type: "newline" }, { type: "text", text: "  " }]
        const newSegments: Array<
          | { type: "text"; text: string }
          | { type: "blank"; text: string }
          | { type: "newline" }
          | { type: "tab" }
        > = [];

        if (oldSegments) {
          for (const seg of oldSegments) {
            if (seg.block) {
              // Block segment becomes a blank
              newSegments.push({ type: "blank", text: seg.text });
            } else {
              // Text segment needs to be split by newlines and tabs
              const text = seg.text;

              // Handle empty text segments
              if (!text) {
                continue;
              }

              // Split by newlines first, then by tabs
              const newlineParts = text.split("\n");

              for (let i = 0; i < newlineParts.length; i++) {
                const part = newlineParts[i];

                // Split each part by tabs
                const tabParts = part.split("\t");

                for (let j = 0; j < tabParts.length; j++) {
                  const tabPart = tabParts[j];

                  // Add text segment if non-empty
                  if (tabPart) {
                    newSegments.push({ type: "text", text: tabPart });
                  }

                  // Add tab segment after each tab (except the last one)
                  if (j < tabParts.length - 1) {
                    newSegments.push({ type: "tab" });
                  }
                }

                // Add newline segment after each newline (except the last one)
                if (i < newlineParts.length - 1) {
                  newSegments.push({ type: "newline" });
                }
              }
            }
          }
        }

        // Generate templateSource from segments if not provided
        // templateSource should contain [[blank:text]] markers and literal newlines/tabs
        const questionData = questionDef.question as any;
        let templateSource = questionData.templateSource;

        if (!templateSource) {
          templateSource = newSegments
            .map((seg) => {
              if (seg.type === "blank") {
                return `[[blank:${seg.text}]]`;
              } else if (seg.type === "newline") {
                return "\n";
              } else if (seg.type === "tab") {
                return "\t";
              } else {
                return seg.text || "";
              }
            })
            .join("");
        }

        // extraBlanks are blocks that aren't in the correct answer
        const correctAnswerArray = Array.isArray(correctAnswer)
          ? correctAnswer
          : [correctAnswer].filter(Boolean);
        const extraBlanks = (blocks || []).filter(
          (block: string) => !correctAnswerArray.includes(block)
        );

        config = {
          templateSource,
          segments: newSegments,
          extraBlanks,
          blocks: blocks || [],
          correctAnswer: correctAnswerArray,
        };
      } else {
        throw new Error(`Unknown question type: ${type}`);
      }

      // Store difficulty in config as well (for backward compatibility)
      config.difficulty = questionDef.difficulty;
      if (explanation) {
        config.explanation = explanation;
      }

      await db.insert(challengeQuestions).values({
        skillTaxonomyId,
        type,
        prompt,
        config,
      });
      questionsInserted++;
    } catch (error: any) {
      console.error(`Failed to insert question:`, error);
      questionsSkipped++;
    }
  }

  console.log(
    `Inserted ${questionsInserted} challenge questions (${questionsSkipped} skipped)`
  );
  console.log("Skills and challenge questions seeding completed.");
}
