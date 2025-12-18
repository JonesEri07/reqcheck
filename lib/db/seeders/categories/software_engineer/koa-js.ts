import { SkillSeedData } from "../../types.js";

export const koaJsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Koa.js",
      skillNormalized: "koa.js",
      aliases: ["koa"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which statement creates a new Koa application instance?",
        options: [
          "const app = new Koa();",
          "const app = express();",
          "const app = koa();",
          "const app = Koa();",
        ],
        correctAnswer: "const app = new Koa();",
        explanation:
          "Koa exports a constructor; you instantiate it with new Koa() before registering middleware.",
      },
      associatedSkills: ["koa.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you start a Koa server listening on port 4000?",
        options: ["app.listen(4000);", "app.run(4000);", "app.start(4000);", "app.server(4000);"],
        correctAnswer: "app.listen(4000);",
        explanation:
          "Koa inherits from Node’s http.Server, so listen() binds the port.",
      },
      associatedSkills: ["koa.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which middleware function signature is idiomatic in Koa?",
        options: ["async (ctx, next)", "(req, res, next)", "(context)", "(ctx)"],
        correctAnswer: "async (ctx, next)",
        explanation:
          "Koa middleware is async functions receiving context (ctx) and next to compose downstream calls.",
      },
      associatedSkills: ["koa.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you set the response body?",
        options: ["ctx.body = 'Hello';", "res.send('Hello')", "ctx.response('Hello')", "ctx.sendBody('Hello')"],
        correctAnswer: "ctx.body = 'Hello';",
        explanation:
          "Assigning ctx.body automatically sets the HTTP response payload for the request.",
      },
      associatedSkills: ["koa.js"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package commonly adds router support to Koa?",
        options: ["@koa/router", "koa-router (deprecated)", "express-router", "hapi-router"],
        correctAnswer: "@koa/router",
        explanation:
          "@koa/router is the maintained router for Koa, enabling HTTP method + path matching.",
      },
      associatedSkills: ["koa.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the middleware that logs method and URL.",
        segments: [
          { text: "app.use(async (ctx, next) => {\n  console.log(ctx.", block: false },
          { text: "method", block: true },
          { text: ", ctx.", block: false },
          { text: "url", block: true },
          { text: ");\n  await next();\n});", block: false },
        ],
        blocks: ["method", "path", "url", "body"],
        correctAnswer: ["method", "url"],
        explanation:
          "ctx.method and ctx.url expose HTTP metadata; awaiting next ensures downstream middleware executes.",
      },
      associatedSkills: ["koa.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which middleware handles errors globally without duplicating try/catch?",
        options: [
          "Wrap app.use(async (ctx, next) => { try { await next(); } catch (err) { ... } });",
          "Use Express error handlers",
          "Enable Koa auto catch flag",
          "throw new Error() inside router",
        ],
        correctAnswer:
          "Wrap app.use(async (ctx, next) => { try { await next(); } catch (err) { ... } });",
        explanation:
          "An early app-level middleware can wrap downstream calls in try/catch to set status codes and body for errors.",
      },
      associatedSkills: ["koa.js"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "How do you parse JSON bodies in Koa without writing manual buffering?",
        options: ["Use koa-bodyparser", "ctx.request.json()", "express.json()", "Node body-parser"],
        correctAnswer: "Use koa-bodyparser",
        explanation:
          "koa-bodyparser middleware parses JSON, form, or text payloads and populates ctx.request.body.",
      },
      associatedSkills: ["koa.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "For long-lived websocket connections, what approach integrates best with Koa?",
        options: [
          "Mount ws server and share Koa's HTTP server handle",
          "Use express-ws middleware",
          "Koa has built-in websockets",
          "Use SSE only",
        ],
        correctAnswer: "Mount ws server and share Koa's HTTP server handle",
        explanation:
          "Libraries like ws can reuse the server returned by app.listen, letting you handle upgrade requests alongside Koa routes.",
      },
      associatedSkills: ["koa.js"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which pattern prevents blocking the event loop when composing CPU-heavy operations inside Koa routes?",
        options: [
          "Offload work to worker threads / message queues",
          "Use synchronous loops",
          "Call setTimeout to yield",
          "Increase Node heap size",
        ],
        correctAnswer: "Offload work to worker threads / message queues",
        explanation:
          "Koa relies on the Node event loop; CPU-heavy logic should run outside the request path (worker threads or background jobs) to keep responses fast.",
      },
      associatedSkills: ["koa.js"],
    },
  ],
};
