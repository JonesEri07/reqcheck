import { SkillSeedData } from "../../types";

export const phpSeed: SkillSeedData = {
  skills: [
    {
      skillName: "PHP",
      skillNormalized: "php",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which tags start and end a PHP script?",
        options: ["<?php ... ?>", "<php> ... </php>", "<? ... ?>", "<script> ... </script>"],
        correctAnswer: "<?php ... ?>",
        explanation:
          "PHP code is enclosed by <?php ... ?> tags; short_open_tag is discouraged for portability.",
      },
      associatedSkills: ["php"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword defines a function?",
        options: ["function", "def", "fn", "lambda"],
        correctAnswer: "function",
        explanation:
          "PHP functions begin with function name(params) { ... }.",
      },
      associatedSkills: ["php"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which superglobal contains POST request data?",
        options: ["$_POST", "$POST", "request.post", "$_REQUEST only"],
        correctAnswer: "$_POST",
        explanation:
          "$_POST is an associative array of variables passed via HTTP POST; $_REQUEST merges GET/POST/COOKIE if enabled.",
      },
      associatedSkills: ["php"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command-line tool installs dependencies in Composer?",
        options: ["composer install", "php install", "composer get", "npm install"],
        correctAnswer: "composer install",
        explanation:
          "Composer is PHP's dependency manager; composer install reads composer.lock to install packages.",
      },
      associatedSkills: ["php"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which operator concatenates strings?",
        options: [".", "+", "++", "&"],
        correctAnswer: ".",
        explanation:
          "PHP uses the dot operator for string concatenation (e.g., $full = $first . $last).",
      },
      associatedSkills: ["php"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the PDO connection snippet.",
        segments: [
          { text: "$pdo = new PDO('mysql:host=localhost;dbname=app', ", block: false },
          { text: "$user", block: true },
          { text: ", $password, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);", block: false },
        ],
        blocks: ["$user", "$username", "USER"],
        correctAnswer: ["$user"],
        explanation:
          "PDO constructor accepts DSN, username, password, and options such as ERRMODE_EXCEPTION.",
      },
      associatedSkills: ["php"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which statement enables strict typing within a PHP file?",
        options: [
          "declare(strict_types=1);",
          "use strict;",
          "<?strict>",
          "strict(true);",
        ],
        correctAnswer: "declare(strict_types=1);",
        explanation:
          "declare(strict_types=1) must appear at the top of the file to enforce scalar type declarations strictly.",
      },
      associatedSkills: ["php"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which PHP feature uses namespaces/autoloading to resolve classes without manual require statements?",
        options: [
          "Composer autoload (PSR-4)",
          "include_once",
          "require",
          "eval",
        ],
        correctAnswer: "Composer autoload (PSR-4)",
        explanation:
          "Composer's autoload functionality maps namespaces to directories (PSR-4) so classes load automatically.",
      },
      associatedSkills: ["php"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which interface is required for custom session handlers?",
        options: [
          "SessionHandlerInterface",
          "SessionInterface",
          "CustomSession",
          "SessionProvider",
        ],
        correctAnswer: "SessionHandlerInterface",
        explanation:
          "Implementing SessionHandlerInterface allows custom storage backends via session_set_save_handler.",
      },
      associatedSkills: ["php"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To prevent SQL injection in legacy code that still uses mysqli, which API should you adopt?",
        options: [
          "Prepared statements with parameter binding (mysqli_stmt)",
          "String concatenation with addslashes",
          "Magic quotes",
          "client_escape()",
        ],
        correctAnswer: "Prepared statements with parameter binding (mysqli_stmt)",
        explanation:
          "Using parameterized queries (e.g., $stmt = $mysqli->prepare(...); $stmt->bind_param(...)) mitigates injection attacks.",
      },
      associatedSkills: ["php"],
    },
  ],
};
