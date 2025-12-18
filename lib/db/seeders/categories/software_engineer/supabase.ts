import { SkillSeedData } from "../../types.js";

export const supabaseSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Supabase",
      skillNormalized: "supabase",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which open-source database powers Supabase?",
        options: ["PostgreSQL", "MySQL", "MongoDB", "SQLite"],
        correctAnswer: "PostgreSQL",
        explanation:
          "Supabase builds on PostgreSQL for SQL queries, triggers, functions, and RLS policies.",
      },
      associatedSkills: ["supabase"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI manages Supabase projects locally?",
        options: ["supabase", "supa-cli", "sbctl", "pgcli"],
        correctAnswer: "supabase",
        explanation:
          "The supabase CLI (supabase start/stop/functions) orchestrates local Postgres, auth, storage, and functions.",
      },
      associatedSkills: ["supabase"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which product handles authentication flows like OTP and OAuth?",
        options: ["Supabase Auth", "Edge Functions", "Realtime", "Storage"],
        correctAnswer: "Supabase Auth",
        explanation:
          "Supabase Auth (GoTrue) provides email/password, OTP, and third-party providers out of the box.",
      },
      associatedSkills: ["supabase"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which feature streams database changes over websockets?",
        options: ["Realtime", "Edge Functions", "Auth", "Studio"],
        correctAnswer: "Realtime",
        explanation:
          "Supabase Realtime tails the Postgres WAL and pushes inserts/updates/deletes to clients via websockets.",
      },
      associatedSkills: ["supabase"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which security feature enforces per-row access rules?",
        options: ["Postgres Row Level Security (RLS)", "Edge Middleware", "Storage policies only", "Vercel Middleware"],
        correctAnswer: "Postgres Row Level Security (RLS)",
        explanation:
          "Supabase leverages Postgres RLS to enforce tenant-specific access by referencing auth.uid().",
      },
      associatedSkills: ["supabase"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the JavaScript query that filters rows.",
        segments: [
          { text: "const { data, error } = await supabase\n  .from('profiles')\n  .", block: false },
          { text: "select", block: true },
          { text: "('*')\n  .eq('id', user.id);", block: false },
        ],
        blocks: ["select", "get", "query"],
        correctAnswer: ["select"],
        explanation:
          "Supabase JS client chains .from().select().eq() to perform PostgREST queries.",
      },
      associatedSkills: ["supabase"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which command starts the local Supabase stack (Postgres, auth, storage, realtime)?",
        options: ["supabase start", "supabase serve", "supabase up", "supa run"],
        correctAnswer: "supabase start",
        explanation:
          "supabase start spins up Docker containers with the Supabase stack for local development.",
      },
      associatedSkills: ["supabase"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which service runs TypeScript/JavaScript functions at the edge?",
        options: ["Supabase Edge Functions (Deno)", "Cloudflare Workers", "Storage", "Realtime"],
        correctAnswer: "Supabase Edge Functions (Deno)",
        explanation:
          "Supabase Edge Functions run Deno code; deploy via supabase functions deploy.",
      },
      associatedSkills: ["supabase"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do you restrict users to only their own rows in a table?",
        options: [
          "Enable RLS and create policies using auth.uid()",
          "Disable anon key",
          "Use storage policies",
          "Store user data client-side",
        ],
        correctAnswer: "Enable RLS and create policies using auth.uid()",
        explanation:
          "RLS policies referencing auth.uid() ensure only the owning user can select/insert/update their rows.",
      },
      associatedSkills: ["supabase"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "What is the recommended procedure to rotate service_role/anon keys?",
        options: [
          "Generate new keys, update secrets in apps, then revoke old keys",
          "Delete the project and recreate it",
          "Restart Postgres",
          "Keys cannot be rotated",
        ],
        correctAnswer:
          "Generate new keys, update secrets in apps, then revoke old keys",
        explanation:
          "Supabase lets you regenerate keys in the dashboard; update environments before revoking to avoid downtime.",
      },
      associatedSkills: ["supabase"],
    },
  ],
};
