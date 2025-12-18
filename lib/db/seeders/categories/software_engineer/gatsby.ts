import { SkillSeedData } from "../../types.js";

export const gatsbySeed: SkillSeedData = {
  skills: [
    {
      skillName: "Gatsby",
      skillNormalized: "gatsby",
      aliases: ["gatsbyjs"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command scaffolds a new Gatsby site using the CLI?",
        options: [
          "npx gatsby new my-site",
          "gatsby init my-site",
          "npm create gatsby-app",
          "npx create-react-app",
        ],
        correctAnswer: "npx gatsby new my-site",
        explanation:
          "gatsby new downloads starters and installs dependencies for a fresh project.",
      },
      associatedSkills: ["gatsby"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which data layer does Gatsby use to combine sources at build time?",
        options: ["GraphQL", "REST", "SQL", "SOAP"],
        correctAnswer: "GraphQL",
        explanation:
          "Gatsby builds a GraphQL data layer (via gatsby-source plugins) that components query during build.",
      },
      associatedSkills: ["gatsby"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which file configures plugins, metadata, and site options?",
        options: ["gatsby-config.ts", "gatsby-node.ts", "package.json", "gatsby-browser.ts"],
        correctAnswer: "gatsby-config.ts",
        explanation:
          "gatsby-config exports siteMetadata and plugins array that define data sources, transformers, manifests, etc.",
      },
      associatedSkills: ["gatsby"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs Gatsby in development with hot reload?",
        options: ["gatsby develop", "gatsby serve", "gatsby build", "npm start"],
        correctAnswer: "gatsby develop",
        explanation:
          "gatsby develop spins up a dev server with fast refresh and GraphiQL explorer.",
      },
      associatedSkills: ["gatsby"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which folder holds page components that automatically become routes?",
        options: ["src/pages", "src/routes", "pages/", "app/pages"],
        correctAnswer: "src/pages",
        explanation:
          "Files under src/pages map to routes without additional configuration (e.g., src/pages/about.tsx -> /about).",
      },
      associatedSkills: ["gatsby"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the GraphQL page query that fetches site title.",
        segments: [
          { text: "export const query = graphql`\n  query LayoutQuery {\n    site {\n      ", block: false },
          { text: "siteMetadata", block: true },
          { text: " {\n        title\n      }\n    }\n  }\n`;\n", block: false },
        ],
        blocks: ["siteMetadata", "metadata", "config"],
        correctAnswer: ["siteMetadata"],
        explanation:
          "siteMetadata holds custom fields defined in gatsby-config and is accessible via GraphQL.",
      },
      associatedSkills: ["gatsby"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which API file lets you create pages programmatically during the build?",
        options: [
          "gatsby-node.ts",
          "gatsby-ssr.ts",
          "gatsby-browser.ts",
          "gatsby-config.ts",
        ],
        correctAnswer: "gatsby-node.ts",
        explanation:
          "The createPages Node API inside gatsby-node enables dynamic route creation based on data sources.",
      },
      associatedSkills: ["gatsby"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which plugin optimizes image loading with blur-up placeholders and responsive sizes?",
        options: [
          "gatsby-plugin-image",
          "gatsby-plugin-sharp",
          "gatsby-plugin-assets",
          "gatsby-plugin-picture",
        ],
        correctAnswer: "gatsby-plugin-image",
        explanation:
          "gatsby-plugin-image plus sharp transforms enable performant responsive images via StaticImage and GatsbyImage.",
      },
      associatedSkills: ["gatsby"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Incremental builds reduce build time by reprocessing only changed content. Which hosting provider natively supports this feature?",
        options: ["Gatsby Cloud (or Netlify with plugins)", "GitHub Pages only", "Any static S3 bucket automatically", "Localhost"],
        correctAnswer: "Gatsby Cloud (or Netlify with plugins)",
        explanation:
          "Incremental builds require build caches and hooks; Gatsby Cloud provides first-class support with content updates triggering partial rebuilds.",
      },
      associatedSkills: ["gatsby"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To secure client-only routes (e.g., /app/*) you should use which approach?",
        options: [
          "Wrap routes in <PrivateRoute> that checks auth inside gatsby-browser.ts",
          "Disable Gatsby's router",
          "Serve them via gatsby build only",
          "Use SSR exclusively",
        ],
        correctAnswer: "Wrap routes in <PrivateRoute> that checks auth inside gatsby-browser.ts",
        explanation:
          "Client-only routes require runtime authentication checks; implementing PrivateRoute via wrapPageElement ensures gating without touching static routes.",
      },
      associatedSkills: ["gatsby"],
    },
  ],
};
