import { SkillSeedData } from "../../types";

export const nestjsSeed: SkillSeedData = {
  skills: [
    {
      skillName: "NestJS",
      skillNormalized: "nestjs",
      aliases: ["nest"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "NestJS is built on top of which Node.js framework?",
        options: ["Express (default) with optional Fastify adapter", "Koa", "Hapi", "Next.js"],
        correctAnswer: "Express (default) with optional Fastify adapter",
        explanation:
          "Nest wraps Express by default but can switch to Fastify for better performance.",
      },
      associatedSkills: ["nestjs"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which decorator marks a class as an injectable service?",
        options: ["@Injectable()", "@Service()", "@Provider()", "@Component()"],
        correctAnswer: "@Injectable()",
        explanation:
          "@Injectable() tells Nest’s DI container the class can be injected into constructors.",
      },
      associatedSkills: ["nestjs"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI command generates a new NestJS project?",
        options: ["npx @nestjs/cli new app", "npm init nest app", "nest build", "nest run"],
        correctAnswer: "npx @nestjs/cli new app",
        explanation:
          "The Nest CLI scaffolds modules, controllers, and testing setup automatically.",
      },
      associatedSkills: ["nestjs"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which decorator registers a controller route handler?",
        options: ["@Get()", "@Route()", "@Handler()", "@Request()"],
        correctAnswer: "@Get()",
        explanation:
          "Method decorators like @Get, @Post, etc., map HTTP verbs to controller methods.",
      },
      associatedSkills: ["nestjs"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you define module imports/providers/controllers?",
        options: ["@Module() metadata", "app.config.ts", "nest.json", "main.ts only"],
        correctAnswer: "@Module() metadata",
        explanation:
          "@Module({ imports, controllers, providers }) organizes the dependency graph.",
      },
      associatedSkills: ["nestjs"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the DTO validation setup using class-validator decorators.",
        segments: [
          { text: "export class CreateUserDto {\n  @", block: false },
          { text: "IsEmail", block: true },
          { text: "()\n  email: string;\n}\n", block: false },
        ],
        blocks: ["IsEmail", "IsString", "IsUUID"],
        correctAnswer: ["IsEmail"],
        explanation:
          "class-validator decorators (IsEmail, IsString, etc.) work with ValidationPipe for automatic request validation.",
      },
      associatedSkills: ["nestjs"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which NestJS feature intercepts requests/responses for cross-cutting concerns like logging?",
        options: ["Interceptors", "Guards", "Pipes", "Filters"],
        correctAnswer: "Interceptors",
        explanation:
          "Interceptors can transform responses, extend behavior, and measure execution time.",
      },
      associatedSkills: ["nestjs"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which module integrates with TypeORM for database access?",
        options: [
          "TypeOrmModule.forRoot({ ... })",
          "SequelizeModule.forRoot",
          "MongooseModule.forFeature",
          "PrismaModule.forRoot",
        ],
        correctAnswer: "TypeOrmModule.forRoot({ ... })",
        explanation:
          "TypeOrmModule configures connections and repositories for entities using TypeORM.",
      },
      associatedSkills: ["nestjs"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To ensure request-scoped providers don’t leak state globally, which scope should you use?",
        options: [
          "Scope.REQUEST",
          "Scope.DEFAULT",
          "Scope.TRANSIENT",
          "Scope.GLOBAL",
        ],
        correctAnswer: "Scope.REQUEST",
        explanation:
          "Setting { scope: Scope.REQUEST } creates a new instance per request context, useful for per-request state or DI tokens.",
      },
      associatedSkills: ["nestjs"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which approach enables microservices communication over transport layers like Redis or NATS?",
        options: [
          "Using ClientsModule + MicroserviceOptions (client proxies)",
          "Running GraphQL module only",
          "Using Express middleware",
          "Enabling Swagger",
        ],
        correctAnswer: "Using ClientsModule + MicroserviceOptions (client proxies)",
        explanation:
          "Nest microservices use client proxies (ClientsModule.register) and microservice servers created via NestFactory.createMicroservice with transport configs.",
      },
      associatedSkills: ["nestjs"],
    },
  ],
};
