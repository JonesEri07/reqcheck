import { SkillSeedData } from "../../types";

export const laravelSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Laravel",
      skillNormalized: "laravel",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Artisan command scaffolds a new Laravel project (via installer)?",
        options: [
          "laravel new blog",
          "php artisan make:project blog",
          "composer create-project laravel/laravel blog",
          "php artisan init blog",
        ],
        correctAnswer: "laravel new blog",
        explanation:
          "Using the Laravel installer (or composer create-project) generates a new application skeleton.",
      },
      associatedSkills: ["laravel"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Blade syntax echoes a variable with HTML escaping?",
        options: ["{{ $name }}", "{!! $name !!}", "@echo $name", "<?php echo $name ?>"],
        correctAnswer: "{{ $name }}",
        explanation:
          "Blade's double curly braces escape output by default, preventing XSS.",
      },
      associatedSkills: ["laravel"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which ORM does Laravel ship with?",
        options: ["Eloquent", "Doctrine", "ActiveRecord", "Hibernate"],
        correctAnswer: "Eloquent",
        explanation:
          "Eloquent is Laravel’s ActiveRecord-style ORM providing fluent query builders and relationships.",
      },
      associatedSkills: ["laravel"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where are route definitions for web requests stored by default?",
        options: ["routes/web.php", "routes/api.php", "app/Http/routes.php", "config/routes.php"],
        correctAnswer: "routes/web.php",
        explanation:
          "Laravel splits route files into web.php (stateful web routes) and api.php (stateless API routes).",
      },
      associatedSkills: ["laravel"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which helper returns JSON responses from controllers?",
        options: ["return response()->json($data);", "return json($data);", "return ResponseJSON($data);", "return toJson($data);"],
        correctAnswer: "return response()->json($data);",
        explanation:
          "response()->json builds JSON responses with headers and status codes.",
      },
      associatedSkills: ["laravel"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the migration snippet that creates a users table with timestamps.",
        segments: [
          { text: "Schema::create('users', function (Blueprint $table) {\n    $table->id();\n    $table->string('email')->unique();\n    $table->", block: false },
          { text: "timestamps", block: true },
          { text: "();\n});", block: false },
        ],
        blocks: ["timestamps", "softDeletes", "rememberToken"],
        correctAnswer: ["timestamps"],
        explanation:
          "$table->timestamps() adds created_at and updated_at columns automatically.",
      },
      associatedSkills: ["laravel"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which middleware protects routes against CSRF attacks?",
        options: [
          "VerifyCsrfToken",
          "EncryptCookies",
          "TrimStrings",
          "Authenticate",
        ],
        correctAnswer: "VerifyCsrfToken",
        explanation:
          "VerifyCsrfToken middleware validates the CSRF token stored in sessions for POST/PUT/DELETE requests.",
      },
      associatedSkills: ["laravel"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which feature schedules recurring tasks from code without OS-level cron changes?",
        options: ["Laravel scheduler via app/Console/Kernel", "Queue workers", "Broadcast events", "Seeder classes"],
        correctAnswer: "Laravel scheduler via app/Console/Kernel",
        explanation:
          "The scheduler uses schedule() definitions in Console\Kernel; a single cron entry runs artisan schedule:run every minute.",
      },
      associatedSkills: ["laravel"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which queue driver offers distributed job processing backed by Redis?",
        options: ["redis", "sync", "database", "sqs"],
        correctAnswer: "redis",
        explanation:
          "config/queue.php can use redis for high-throughput queue workers; sync executes immediately, database uses relational tables, sqs uses AWS.",
      },
      associatedSkills: ["laravel"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To build realtime broadcasting with presence channels, which stack is recommended?",
        options: [
          "Laravel Echo + Pusher (or Laravel WebSockets)",
          "Polling routes/web.php",
          "Blade components only",
          "Email notifications",
        ],
        correctAnswer: "Laravel Echo + Pusher (or Laravel WebSockets)",
        explanation:
          "Laravel broadcasting integrates with Echo client and drivers like Pusher or self-hosted websockets for realtime updates.",
      },
      associatedSkills: ["laravel"],
    },
  ],
};
