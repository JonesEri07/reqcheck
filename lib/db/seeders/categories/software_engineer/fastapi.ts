import { SkillSeedData } from "../../types.js";

export const fastapiSeed: SkillSeedData = {
  skills: [
    {
      skillName: "FastAPI",
      skillNormalized: "fastapi",
      aliases: ["fast api"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which object is used to create a FastAPI application instance?",
        options: [
          "FastAPI()",
          "Flask()",
          "Sanic()",
          "APIRouter()",
        ],
        correctAnswer: "FastAPI()",
        explanation:
          "You import FastAPI from fastapi and instantiate it to register routes and middleware.",
      },
      associatedSkills: ["fastapi"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which dependency handles automatic JSON serialization of responses?",
        options: [
          "Pydantic models",
          "Marshmallow schemas",
          "SQLAlchemy",
          "Jinja2 templates",
        ],
        correctAnswer: "Pydantic models",
        explanation:
          "FastAPI relies on Pydantic BaseModel classes to validate and serialize request and response payloads.",
      },
      associatedSkills: ["fastapi"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs a FastAPI app using Uvicorn in reload mode?",
        options: [
          "uvicorn main:app --reload",
          "fastapi run main.py",
          "python main.py --hot",
          "uvicorn run main",
        ],
        correctAnswer: "uvicorn main:app --reload",
        explanation:
          "Uvicorn is the recommended ASGI server; --reload watches files during development.",
      },
      associatedSkills: ["fastapi"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you declare a query parameter with a default value?",
        options: [
          "def read_items(skip: int = 0): ...",
          "def read_items(skip = Query(0)): ...",
          "def read_items(*, skip: int): ...",
          "def read_items(skip: Query[int]): ...",
        ],
        correctAnswer: "def read_items(skip: int = 0): ...",
        explanation:
          "FastAPI inspects function signatures; default values become optional query parameters.",
      },
      associatedSkills: ["fastapi"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which interactive documentation UI is bundled by default?",
        options: ["Swagger UI", "Postman", "GraphiQL", "Stoplight"],
        correctAnswer: "Swagger UI",
        explanation:
          "FastAPI automatically exposes Swagger UI at /docs (and ReDoc at /redoc) based on the OpenAPI schema.",
      },
      associatedSkills: ["fastapi"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the dependency injection example that provides a database session.",
        segments: [
          { text: "def get_db():\n    db = SessionLocal()\n    try:\n        yield db\n    finally:\n        db.close()\n\n@app.get(\"/users\")\nasync def list_users(db: ", block: false },
          { text: "Session", block: true },
          { text: " = Depends(", block: false },
          { text: "get_db", block: true },
          { text: ")):\n    return db.query(User).all()", block: false },
        ],
        blocks: ["Session", "Depends", "get_db", "Request"],
        correctAnswer: ["Session", "get_db"],
        explanation:
          "Type-annotating the parameter with Session (or SessionLocal) and setting Depends(get_db) injects the yielded session.",
      },
      associatedSkills: ["fastapi"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which import provides HTTPException to raise structured errors?",
        options: [
          "from fastapi import HTTPException",
          "from starlette.responses import HTTPException",
          "from fastapi.exceptions import ValidationError",
          "from pydantic import BaseModel",
        ],
        correctAnswer: "from fastapi import HTTPException",
        explanation:
          "HTTPException status_code/message pairs integrate with FastAPI’s error handlers and auto docs.",
      },
      associatedSkills: ["fastapi"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "You want to mount an APIRouter under /admin with its own tags. What should you do?",
        options: [
          "app.include_router(admin_router, prefix=\"/admin\", tags=[\"admin\"])",
          "admin_router.mount(\"/admin\")",
          "app.router('/admin', admin_router)",
          "Use app.mount('admin', admin_router)",
        ],
        correctAnswer: "app.include_router(admin_router, prefix=\"/admin\", tags=[\"admin\"])",
        explanation:
          "include_router registers the router plus shared configuration like prefix, tags, dependencies, and responses.",
      },
      associatedSkills: ["fastapi"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which middleware should wrap FastAPI when serving behind a proxy like Nginx to ensure correct client IPs?",
        options: [
          "from starlette.middleware.trustedhost import TrustedHostMiddleware",
          "from fastapi.middleware.gzip import GZipMiddleware",
          "from starlette.middleware.base import BaseHTTPMiddleware",
          "Use CORSMiddleware",
        ],
        correctAnswer: "from starlette.middleware.trustedhost import TrustedHostMiddleware",
        explanation:
          "TrustedHostMiddleware validates Host headers, preventing host header attacks when FastAPI is behind reverse proxies.",
      },
      associatedSkills: ["fastapi"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Background tasks should execute after returning a response. Which helper provides this?",
        options: [
          "BackgroundTasks from fastapi",
          "asyncio.create_task",
          "Celery worker",
          "ThreadPoolExecutor",
        ],
        correctAnswer: "BackgroundTasks from fastapi",
        explanation:
          "Injecting BackgroundTasks allows you to add callables that run once the response is sent, without blocking the request.",
      },
      associatedSkills: ["fastapi"],
    },
  ],
};
