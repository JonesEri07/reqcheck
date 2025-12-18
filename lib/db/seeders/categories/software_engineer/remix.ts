import { SkillSeedData } from "../../types.js";

export const remixSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Remix",
      skillNormalized: "remix",
      aliases: ["remix.run"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command scaffolds a new Remix app?",
        options: ["npx create-remix@latest", "npx create-react-app", "npm init remix-app", "remix init"],
        correctAnswer: "npx create-remix@latest",
        explanation:
          "npx create-remix@latest bootstraps a Remix project with prompts for deployment targets.",
      },
      associatedSkills: ["remix"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which directory holds route modules?",
        options: ["app/routes", "src/pages", "routes/", "pages/"],
        correctAnswer: "app/routes",
        explanation:
          "Files inside app/routes map directly to URL segments.",
      },
      associatedSkills: ["remix"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which export loads data server-side for a route?",
        options: ["export const loader", "export const getServerSideProps", "export const fetchData", "export const useLoader"],
        correctAnswer: "export const loader",
        explanation:
          "Remix routes export a loader function that runs on the server before rendering.",
      },
      associatedSkills: ["remix"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which hook accesses loader data inside a component?",
        options: ["useLoaderData", "useRouteData", "useData", "useContext"],
        correctAnswer: "useLoaderData",
        explanation:
          "useLoaderData returns whatever the route's loader resolved.",
      },
      associatedSkills: ["remix"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which component performs client-side navigation?",
        options: ["<Link>", "<a>", "<Navigate>", "<RouterLink>"],
        correctAnswer: "<Link>",
        explanation:
          "Remix re-exports React Router's <Link> to navigate without page reloads.",
      },
      associatedSkills: ["remix"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the action export that processes POST submissions.",
        segments: [
          { text: "export const ", block: false },
          { text: "action", block: true },
          { text: ": ActionFunction = async ({ request }) => {\n  const formData = await request.formData();\n  return redirect('/thanks');\n};", block: false },
        ],
        blocks: ["action", "loader", "submit"],
        correctAnswer: ["action"],
        explanation:
          "Routes export action functions for handling form submissions and mutations.",
      },
      associatedSkills: ["remix"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which API streams deferred data to the client?",
        options: ["defer()", "stream()", "lazy()", "Suspense only"],
        correctAnswer: "defer()",
        explanation:
          "Remix's defer helper allows loaders to stream promises while rendering partial UI.",
      },
      associatedSkills: ["remix"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which hook lets you force a loader to re-run after a mutation?",
        options: ["useRevalidator", "useEffect", "useFetcher", "useMatches"],
        correctAnswer: "useRevalidator",
        explanation:
          "useRevalidator returns revalidate() to re-run loaders and refresh data.",
      },
      associatedSkills: ["remix"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which deployment target lets Remix run on edge workers?",
        options: ["Remix App Server on Cloudflare Workers", "Node only", "Static export", "Electron"],
        correctAnswer: "Remix App Server on Cloudflare Workers",
        explanation:
          "Remix can target Cloudflare Workers and other edge runtimes using the Remix App Server adapter.",
      },
      associatedSkills: ["remix"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do child routes reuse parent loader data without extra fetches?",
        options: [
          "Call useMatches() and read parentRoute.data",
          "Refetch in useEffect",
          "Store data globally",
          "Pass data through props manually",
        ],
        correctAnswer: "Call useMatches() and read parentRoute.data",
        explanation:
          "useMatches exposes each matched route's loader data, so child routes can read parent data directly.",
      },
      associatedSkills: ["remix"],
    },
  ],
};
