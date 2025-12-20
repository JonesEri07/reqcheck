import { SkillSeedData } from "../../types";

export const nextjsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Next.js",
      skillNormalized: "next.js",
      aliases: ["nextjs", "next"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command starts the Next.js development server?",
        options: ["npm run dev", "next start", "next build", "npm run preview"],
        correctAnswer: "npm run dev",
        explanation:
          "npm run dev (which runs next dev) starts the hot-reloading dev server.",
      },
      associatedSkills: ["next.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you place static route components using the App Router?",
        options: ["app/route/page.tsx", "pages/index.js", "src/routes.ts", "routes/page.tsx"],
        correctAnswer: "app/route/page.tsx",
        explanation:
          "In the App Router, directories under app/ define nested routes; each folder typically includes a page.tsx.",
      },
      associatedSkills: ["next.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which data fetching function runs on the server at request time (Pages Router)?",
        options: ["getServerSideProps", "getStaticProps", "useEffect", "fetchClient"],
        correctAnswer: "getServerSideProps",
        explanation:
          "getServerSideProps executes on the server for every request, enabling SSR data fetching with access to headers/cookies.",
      },
      associatedSkills: ["next.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command compiles the production build?",
        options: ["next build", "next lint", "npm start", "next test"],
        correctAnswer: "next build",
        explanation:
          "next build compiles server/client bundles and analyzes routes for production deployment.",
      },
      associatedSkills: ["next.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directory hosts static assets served from the site root?",
        options: ["public/", "static/", "assets/", "dist/"],
        correctAnswer: "public/",
        explanation:
          "Files in /public are served as-is at /. For example public/logo.png becomes /logo.png.",
      },
      associatedSkills: ["next.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the dynamic route definition for product pages in the Pages Router.",
        segments: [
          { text: "pages/", block: false },
          { text: "[slug]", block: true },
          { text: "/index.tsx", block: false },
        ],
        blocks: ["[slug]", "[...slug]", "slug"],
        correctAnswer: ["[slug]"],
        explanation:
          "Dynamic segments are wrapped in brackets (e.g., pages/[slug].tsx) to capture params via useRouter().",
      },
      associatedSkills: ["next.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which React feature does Next.js use to enable streaming and partial rendering in the App Router?",
        options: [
          "React Server Components",
          "Suspense boundaries only",
          "Legacy SSR only",
          "Hydration fallback",
        ],
        correctAnswer: "React Server Components",
        explanation:
          "Next.js App Router uses React Server Components to fetch data on the server and stream UI with Suspense.",
      },
      associatedSkills: ["next.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which built-in config helps protect API routes by limiting domains for fetch requests (CORS)?",
        options: ["NextResponse with middleware", "next.config.js rewrites", "Headers API only", "getStaticPaths fallback"],
        correctAnswer: "NextResponse with middleware",
        explanation:
          "Next.js middleware (edge) can inspect requests and set CORS headers using NextResponse for API routes.",
      },
      associatedSkills: ["next.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To share runtime environment variables across server and client components, which approach should you use?",
        options: [
          "Prefix client-exposed env vars with NEXT_PUBLIC_ and load others via process.env on the server",
          "Use dotenv for both client/server without prefixes",
          "Expose secrets in public runtime config",
          "Import env from node_modules",
        ],
        correctAnswer:
          "Prefix client-exposed env vars with NEXT_PUBLIC_ and load others via process.env on the server",
        explanation:
          "Only env vars prefixed with NEXT_PUBLIC_ are bundled client-side; server components read process.env directly.",
      },
      associatedSkills: ["next.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which caching strategy ensures ISR pages revalidate every 60 seconds without full rebuilds?",
        options: [
          "export const revalidate = 60 (App Router) or revalidate: 60 in getStaticProps",
          "Use getServerSideProps only",
          "Disable caching entirely",
          "Use SWR on the client",
        ],
        correctAnswer:
          "export const revalidate = 60 (App Router) or revalidate: 60 in getStaticProps",
        explanation:
          "Incremental Static Regeneration revalidates static pages on demand, keeping builds fast while staying fresh.",
      },
      associatedSkills: ["next.js"],
    },
  ],
};
