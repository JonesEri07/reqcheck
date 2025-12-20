import { SkillSeedData } from "../../types";

export const flaskSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Flask",
      skillNormalized: "flask",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which object creates a Flask application?",
        options: [
          "app = Flask(__name__)",
          "app = flask.newApp()",
          "app = create_app()",
          "app = FlaskApp()",
        ],
        correctAnswer: "app = Flask(__name__)",
        explanation:
          "Passing __name__ lets Flask locate templates and static files relative to the module.",
      },
      associatedSkills: ["flask"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which decorator registers a view function for GET requests?",
        options: [
          "@app.route('/')",
          "@app.get('/')",
          "@app.view('/')",
          "@app.controller('/')",
        ],
        correctAnswer: "@app.route('/')",
        explanation:
          "By default, route allows GET; you can set methods=['POST'] etc. as needed.",
      },
      associatedSkills: ["flask"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you place HTML templates for render_template?",
        options: ["templates/ directory", "static/", "public/", "app/"],
        correctAnswer: "templates/ directory",
        explanation:
          "Flask looks for templates relative to the templates folder unless configured otherwise.",
      },
      associatedSkills: ["flask"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you access form data inside a POST handler?",
        options: ["request.form", "request.body", "request.params", "request.payload"],
        correctAnswer: "request.form",
        explanation:
          "Flask's request object exposes form data for form-encoded submissions via request.form dictionary-like access.",
      },
      associatedSkills: ["flask"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command enables auto reload in development?",
        options: [
          "FLASK_ENV=development flask run",
          "flask run --prod",
          "python app.py",
          "flask serve",
        ],
        correctAnswer: "FLASK_ENV=development flask run",
        explanation:
          "Setting FLASK_ENV=development or FLASK_DEBUG=1 turns on debug mode with auto reload and debugger.",
      },
      associatedSkills: ["flask"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the blueprint registration snippet.",
        segments: [
          { text: "from flask import Flask\nfrom .auth import auth_bp\n\napp = Flask(__name__)\napp.", block: false },
          { text: "register_blueprint", block: true },
          { text: "(auth_bp, url_prefix=\"/auth\")", block: false },
        ],
        blocks: ["register_blueprint", "include_blueprint", "mount_blueprint"],
        correctAnswer: ["register_blueprint"],
        explanation:
          "Blueprints modularize routes; register_blueprint attaches them with optional prefixes.",
      },
      associatedSkills: ["flask"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which object should you use to manage database connections across threads?",
        options: [
          "Flask application context + scoped sessions",
          "Global module-level connection",
          "Thread local dictionary manually",
          "SQLAlchemy raw engine only",
        ],
        correctAnswer: "Flask application context + scoped sessions",
        explanation:
          "Using Flask's app context with SQLAlchemy scoped_session ensures each request gets its own DB session.",
      },
      associatedSkills: ["flask"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which extension provides schema validation/serialization similar to Pydantic?",
        options: ["Marshmallow", "WTForms", "Celery", "Gunicorn"],
        correctAnswer: "Marshmallow",
        explanation:
          "Marshmallow integrates with Flask via flask-marshmallow to define schemas, validation, and serialization.",
      },
      associatedSkills: ["flask"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To stream large responses without loading everything into memory, what feature should you use?",
        options: [
          "Flask Response(generator_function())",
          "Send_file with as_attachment",
          "app.stream = True",
          "Threading mixin",
        ],
        correctAnswer: "Flask Response(generator_function())",
        explanation:
          "Returning a Response built from a generator yields chunks incrementally, ideal for streaming large files or SSE.",
      },
      associatedSkills: ["flask"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How can you scale Flask across multiple CPU cores in production?",
        options: [
          "Run under Gunicorn/Uvicorn with multiple workers or use a WSGI server behind a load balancer",
          "Enable threaded=True on flask run",
          "Use Flask's development server only",
          "Set app.concurrency = 'auto'",
        ],
        correctAnswer:
          "Run under Gunicorn/Uvicorn with multiple workers or use a WSGI server behind a load balancer",
        explanation:
          "The built-in server is single-threaded; production deployments use WSGI servers (Gunicorn, uWSGI) with multiple worker processes.",
      },
      associatedSkills: ["flask"],
    },
  ],
};
