import { SkillSeedData } from "../../types.js";

export const expressJsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Express.js",
      skillNormalized: "express.js",
      aliases: ["express", "expressjs"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which statement creates an Express application instance?",
        options: [
          "const app = express();",
          "const app = new ExpressApp();",
          "const app = createServer();",
          "const app = http.express();",
        ],
        correctAnswer: "const app = express();",
        explanation:
          "Calling the express function returns the app object used to register middleware and routes.",
      },
      associatedSkills: ["express.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method registers JSON body parsing in Express 4.16+?",
        options: [
          "app.use(express.json())",
          "app.use(bodyParser.text())",
          "app.use(express.urlencoded())",
          "app.use(jsonParser())",
        ],
        correctAnswer: "app.use(express.json())",
        explanation:
          "Express ships built-in json() middleware that replaces the older body-parser dependency for JSON payloads.",
      },
      associatedSkills: ["express.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which object contains route parameters such as /users/:id?",
        options: ["req.params", "req.query", "req.body", "req.route"],
        correctAnswer: "req.params",
        explanation:
          "Route parameters (e.g., :id) are available via req.params.id inside the handler.",
      },
      associatedSkills: ["express.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method sends a JSON response with automatic content-type?",
        options: ["res.json()", "res.sendFile()", "res.render()", "res.download()"],
        correctAnswer: "res.json()",
        explanation:
          "res.json serializes the value and sets Content-Type: application/json.",
      },
      associatedSkills: ["express.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you place static assets like images or CSS?",
        options: [
          "app.use(express.static('public'))",
          "app.static('public')",
          "app.assets('public')",
          "res.static('public')",
        ],
        correctAnswer: "app.use(express.static('public'))",
        explanation:
          "express.static serves files from the specified directory when registered with app.use.",
      },
      associatedSkills: ["express.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the router-level middleware that checks authentication.",
        segments: [
          { text: "const router = express.Router();\nrouter.use(", block: false },
          { text: "requireAuth", block: true },
          { text: ");\nrouter.get(\"/profile\", ", block: false },
          { text: "controller.show", block: true },
          { text: ");", block: false },
        ],
        blocks: ["requireAuth", "controller.show", "next", "express.json"],
        correctAnswer: ["requireAuth", "controller.show"],
        explanation:
          "router.use(requireAuth) applies middleware to subsequent routes; router.get pairs the path with the controller action.",
      },
      associatedSkills: ["express.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which signature is required for Express error-handling middleware?",
        options: [
          "(err, req, res, next)",
          "(req, res, next)",
          "(req, res)",
          "(err, req, res)",
        ],
        correctAnswer: "(err, req, res, next)",
        explanation:
          "Express recognizes error handlers by functions that accept four arguments with err first.",
      },
      associatedSkills: ["express.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How can you structure APIs into modules to avoid a monolithic app.js?",
        options: [
          "Use express.Router() instances per domain",
          "Create multiple Express apps",
          "Invoke app.split()",
          "Register controllers in package.json",
        ],
        correctAnswer: "Use express.Router() instances per domain",
        explanation:
          "Routers encapsulate routes and middleware and can be mounted at path prefixes (e.g., app.use('/users', userRouter)).",
      },
      associatedSkills: ["express.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "In Node 18+, which native API can replace third-party body parsers for streaming file uploads?",
        options: [
          "busboy/stream combiner",
          "fs.promises.readFile",
          "node:buffer",
          "crypto.subtle",
        ],
        correctAnswer: "busboy/stream combiner",
        explanation:
          "Libraries like busboy integrate with Express via req.pipe to stream multipart forms without loading entire files into memory.",
      },
      associatedSkills: ["express.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To avoid unhandled promise rejections in async route handlers, which pattern should you adopt?",
        options: [
          "Wrap handlers with a helper that catches errors and calls next(err)",
          "Use synchronous code only",
          "Disable async by setting express.async = false",
          "Call process.on('unhandledRejection')",
        ],
        correctAnswer: "Wrap handlers with a helper that catches errors and calls next(err)",
        explanation:
          "Express does not automatically catch Promise rejections, so wrapping async handlers ensures errors propagate to central middleware.",
      },
      associatedSkills: ["express.js"],
    },
  ],
};
