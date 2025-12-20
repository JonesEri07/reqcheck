import { SkillSeedData } from "../../types";

export const hapiJsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Hapi.js",
      skillNormalized: "hapi.js",
      aliases: ["hapi"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which object creates a Hapi server instance?",
        options: [
          "Hapi.server({ port: 3000 })",
          "express()",
          "new Koa()",
          "http.createServer()",
        ],
        correctAnswer: "Hapi.server({ port: 3000 })",
        explanation:
          "The Hapi module exports server() to configure host, port, routes, and plugins.",
      },
      associatedSkills: ["hapi.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method registers routes on a Hapi server?",
        options: ["server.route()", "server.get()", "app.use()", "router.add()"],
        correctAnswer: "server.route()",
        explanation:
          "server.route accepts objects or arrays defining method, path, handler, and options.",
      },
      associatedSkills: ["hapi.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which validation library integrates with Hapi for request schemas?",
        options: ["Joi", "Yup", "Zod", "Class-validator"],
        correctAnswer: "Joi",
        explanation:
          "Joi (from the Hapi ecosystem) defines schemas for payload, params, and query validation via route.options.validate.",
      },
      associatedSkills: ["hapi.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which property inside a route specifies HTTP method?",
        options: ["method", "verb", "type", "action"],
        correctAnswer: "method",
        explanation:
          "Routes use method: 'GET' | 'POST' etc., along with path and handler.",
      },
      associatedSkills: ["hapi.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which call starts listening for requests?",
        options: ["await server.start()", "server.listen()", "app.run()", "server.begin()"],
        correctAnswer: "await server.start()",
        explanation:
          "server.start() initializes connections and must be awaited before accepting traffic.",
      },
      associatedSkills: ["hapi.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which extension point lets you run logic right before a response is sent?",
        options: ["onPreResponse", "onRequest", "onCredentials", "onPostStart"],
        correctAnswer: "onPreResponse",
        explanation:
          "server.ext('onPreResponse', handler) can inspect/modify responses or handle Boom errors globally.",
      },
      associatedSkills: ["hapi.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the plugin signature used to extend a Hapi server.",
        segments: [
          { text: "export const loggingPlugin = {\n  name: \"logging\",\n  register: async (server: Hapi.Server, ", block: false },
          { text: "options", block: true },
          { text: ") => {\n    server.ext(\"onRequest\", (request, h) => {\n      console.log(request.method, request.path);\n      return h.continue;\n    });\n  },\n};", block: false },
        ],
        blocks: ["options", "next", "config"],
        correctAnswer: ["options"],
        explanation:
          "Plugins expose register(server, options) to hook into lifecycle events or decorate server methods.",
      },
      associatedSkills: ["hapi.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How do you send a Boom-powered HTTP error inside a route handler?",
        options: [
          "throw Boom.badRequest('Invalid payload')",
          "return h.error(400)",
          "new Error(400)",
          "return Boom()",
        ],
        correctAnswer: "throw Boom.badRequest('Invalid payload')",
        explanation:
          "Boom helpers produce consistent error responses; throwing them allows Hapi to format the HTTP response automatically.",
      },
      associatedSkills: ["hapi.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To protect routes with authentication strategies, which configuration option should you use?",
        options: [
          "options.auth",
          "options.security",
          "options.guard",
          "options.policy",
        ],
        correctAnswer: "options.auth",
        explanation:
          "Setting options.auth to a strategy name (or { strategy, scope }) enforces Hapi auth pipelines for the route.",
      },
      associatedSkills: ["hapi.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which Hapi feature allows request lifecycle customization without mutating global state?",
        options: [
          "Decorators (server.decorate / request.decorate)",
          "Global variables",
          "Express middleware compatibility layer",
          "Manual prototype mutation",
        ],
        correctAnswer: "Decorators (server.decorate / request.decorate)",
        explanation:
          "Decorators add properties or methods to the server, request, or toolkit in a namespaced, testable way.",
      },
      associatedSkills: ["hapi.js"],
    },
  ],
};
