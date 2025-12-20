import { SkillSeedData } from "../../types";

export const pytestSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Pytest",
      skillNormalized: "pytest",
      aliases: ["py.test"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs pytest?",
        options: ["pytest", "py.test run", "python pytest", "pytest run"],
        correctAnswer: "pytest",
        explanation:
          "Installing pytest exposes the pytest CLI entrypoint; simply running pytest discovers tests.",
      },
      associatedSkills: ["pytest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which naming convention does pytest auto-discover?",
        options: [
          "Files named test_*.py and functions/classes named test*",
          "Files ending *.spec",
          "Functions starting with check_",
          "Only classes derived from TestCase",
        ],
        correctAnswer: "Files named test_*.py and functions/classes named test*",
        explanation:
          "Pytest auto-discovers modules prefixed with test_ and functions/classes prefixed with test.",
      },
      associatedSkills: ["pytest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which decorator marks a test as expected to fail?",
        options: ["@pytest.mark.xfail", "@pytest.mark.skip", "@pytest.mark.fail", "@pytest.xfail"],
        correctAnswer: "@pytest.mark.xfail",
        explanation:
          "xfail marks tests as expected failures; unexpected passes are reported separately.",
      },
      associatedSkills: ["pytest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which fixture scopes setup to each test function by default?",
        options: ["function scope", "module scope", "session scope", "class scope"],
        correctAnswer: "function scope",
        explanation:
          "Fixtures default to scope='function', meaning they run once per test using them.",
      },
      associatedSkills: ["pytest"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which option shows failing tests with local variable values?",
        options: ["-vv", "-x", "--maxfail=1", "-q"],
        correctAnswer: "-vv",
        explanation:
          "-vv increases verbosity and shows full assertion introspection for failing tests.",
      },
      associatedSkills: ["pytest"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the fixture that yields a database connection and closes it after the test.",
        segments: [
          { text: "@pytest.fixture\ndef db():\n    conn = connect()\n    yield conn\n    ", block: false },
          { text: "conn.close", block: true },
          { text: "()", block: false },
        ],
        blocks: ["conn.close", "close(conn)", "conn.stop"],
        correctAnswer: ["conn.close"],
        explanation:
          "Fixtures can yield to provide resources; code after yield runs as teardown.",
      },
      associatedSkills: ["pytest"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which plugin executes tests in parallel via worker processes?",
        options: [
          "pytest-xdist",
          "pytest-parallel",
          "pytest-runner",
          "pytest-concurrency",
        ],
        correctAnswer: "pytest-xdist",
        explanation:
          "pytest-xdist adds -n auto/4 to run tests in parallel processes or across hosts.",
      },
      associatedSkills: ["pytest"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which hook allows customizing command-line options or environment?",
        options: [
          "pytest_addoption(parser)",
          "pytest_configure(config)",
          "pytest_collection_modifyitems",
          "pytest_runtest_call",
        ],
        correctAnswer: "pytest_addoption(parser)",
        explanation:
          "pytest_addoption lets plugins/fixtures register custom CLI flags and ini options.",
      },
      associatedSkills: ["pytest"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do you parameterize fixtures dynamically based on other fixtures?",
        options: [
          "Use @pytest.fixture(params=...) and indirect parametrization",
          "Use nested for loops in tests",
          "Call fixture() manually",
          "Set env vars",
        ],
        correctAnswer: "Use @pytest.fixture(params=...) and indirect parametrization",
        explanation:
          "Parametrized fixtures (params=[...]) combined with indirect=True allow test cases to drive fixture values.",
      },
      associatedSkills: ["pytest"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which strategy captures logs per test without polluting global handlers?",
        options: [
          "Use the built-in caplog fixture",
          "Use logging.basicConfig in each test",
          "Disable logging entirely",
          "Redirect stdout manually",
        ],
        correctAnswer: "Use the built-in caplog fixture",
        explanation:
          "caplog allows asserting log output per test and resets handlers between tests.",
      },
      associatedSkills: ["pytest"],
    },
  ],
};
