import { SkillSeedData } from "../../types";

export const aspnetSeed: SkillSeedData = {
  skills: [
    {
      skillName: "ASP.NET",
      skillNormalized: "asp.net",
      aliases: ["aspnet", "asp net core"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command scaffolds a new ASP.NET Core Web API project?",
        options: [
          "dotnet new webapi",
          "dotnet run",
          "dotnet publish",
          "dotnet ef migrations add",
        ],
        correctAnswer: "dotnet new webapi",
        explanation:
          "dotnet new webapi creates a new project using the ASP.NET Core Web API template with WeatherForecast sample controller.",
      },
      associatedSkills: ["asp.net"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which pipeline method registers HTTP request/response middleware?",
        options: ["app.Use...", "builder.Services.Add...", "builder.Host.Configure...", "app.MapGrpcService"],
        correctAnswer: "app.Use...",
        explanation:
          "app.UseX methods register middleware components executed in order for each request.",
      },
      associatedSkills: ["asp.net"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which attribute decorates a controller action that responds to HTTP GET?",
        options: ["[HttpGet]", "[HttpPost]", "[Route]", "[ApiController]"],
        correctAnswer: "[HttpGet]",
        explanation:
          "[HttpGet] marks the action as handling GET requests for the configured route.",
      },
      associatedSkills: ["asp.net"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which service collection method enables dependency injection for controllers?",
        options: [
          "builder.Services.AddControllers()",
          "builder.Services.AddRazorPages()",
          "builder.Services.AddHostedService()",
          "builder.Services.AddLogging()",
        ],
        correctAnswer: "builder.Services.AddControllers()",
        explanation:
          "AddControllers registers controller services and MVC infrastructure needed for Web API endpoints.",
      },
      associatedSkills: ["asp.net"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which configuration file holds environment-specific settings like connection strings?",
        options: [
          "appsettings.Development.json",
          "launchSettings.json",
          "global.json",
          "csproj",
        ],
        correctAnswer: "appsettings.Development.json",
        explanation:
          "appsettings.Environment.json overrides base appsettings.json values for the current environment.",
      },
      associatedSkills: ["asp.net"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which middleware automatically serializes validation errors when [ApiController] is used?",
        options: [
          "Automatic Model State Validation",
          "Cors middleware",
          "Routing middleware",
          "Static files middleware",
        ],
        correctAnswer: "Automatic Model State Validation",
        explanation:
          "[ApiController] attribute enables automatic 400 responses when ModelState is invalid, saving boilerplate checks.",
      },
      associatedSkills: ["asp.net"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which object maps configuration sections to typed options classes?",
        options: [
          "IOptions<T>",
          "ILogger<T>",
          "IHostedService",
          "IHttpClientFactory",
        ],
        correctAnswer: "IOptions<T>",
        explanation:
          "IOptions<T> (and IOptionsMonitor/IOptionsSnapshot) bind configuration sections to POCOs for DI consumption.",
      },
      associatedSkills: ["asp.net"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which method registers Entity Framework Core DbContext services?",
        options: [
          "builder.Services.AddDbContext<AppDbContext>(...)",
          "app.UseAuthentication()",
          "builder.Services.AddEndpoints",
          "app.MapControllers()",
        ],
        correctAnswer: "builder.Services.AddDbContext<AppDbContext>(...)",
        explanation:
          "AddDbContext wires up EF Core, connection strings, and context lifetime for dependency injection.",
      },
      associatedSkills: ["asp.net"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which interface enables custom middleware implementation?",
        options: [
          "IMiddleware",
          "IHostedService",
          "IApplicationBuilder",
          "IFormFile",
        ],
        correctAnswer: "IMiddleware",
        explanation:
          "Implementing IMiddleware allows middleware to be resolved via DI, promoting scoped dependencies.",
      },
      associatedSkills: ["asp.net"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which authentication handler verifies JWT access tokens issued by external authorities?",
        options: [
          "AddAuthentication().AddJwtBearer(...)",
          "AddAuthorization()",
          "AddCookie()",
          "AddGoogle()",
        ],
        correctAnswer: "AddAuthentication().AddJwtBearer(...)",
        explanation:
          "AddJwtBearer configures JWT validation (issuer, audience, signing keys) for securing APIs with bearer tokens.",
      },
      associatedSkills: ["asp.net"],
    },
  ],
};
