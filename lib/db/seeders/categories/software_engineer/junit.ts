import { SkillSeedData } from "../../types";

export const junitSeed: SkillSeedData = {
  skills: [
    {
      skillName: "JUnit",
      skillNormalized: "junit",
      aliases: ["junit5"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which annotation marks a test method in JUnit 5?",
        options: ["@Test", "@RunWith", "@Before", "@Spec"],
        correctAnswer: "@Test",
        explanation:
          "@Test identifies test methods recognized by the JUnit Jupiter engine.",
      },
      associatedSkills: ["junit"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which assertion checks equality between expected and actual values?",
        options: [
          "Assertions.assertEquals(expected, actual)",
          "Assertions.assertSame(expected, actual)",
          "Assertions.assertTrue(actual)",
          "Assertions.fail()",
        ],
        correctAnswer: "Assertions.assertEquals(expected, actual)",
        explanation:
          "assertEquals compares two values and fails with a descriptive message when they differ.",
      },
      associatedSkills: ["junit"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which annotation runs before each test method?",
        options: ["@BeforeEach", "@BeforeAll", "@AfterEach", "@Setup"],
        correctAnswer: "@BeforeEach",
        explanation:
          "Methods annotated @BeforeEach execute before every test, ideal for resetting fixtures.",
      },
      associatedSkills: ["junit"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you disable a test temporarily?",
        options: ["@Disabled", "@Ignore", "@Skip", "@Pending"],
        correctAnswer: "@Disabled",
        explanation:
          "@Disabled prevents a test from running and can include a reason string.",
      },
      associatedSkills: ["junit"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which dependency includes JUnit Jupiter API in Maven?",
        options: [
          "<artifactId>junit-jupiter</artifactId>",
          "<artifactId>junit</artifactId>",
          "<artifactId>junit-platform</artifactId>",
          "<artifactId>testng</artifactId>",
        ],
        correctAnswer: "<artifactId>junit-jupiter</artifactId>",
        explanation:
          "JUnit Jupiter includes the new API and engine; junit-vintage supports legacy tests.",
      },
      associatedSkills: ["junit"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the parameterized test declaration using a CSV source.",
        segments: [
          { text: "@ParameterizedTest\n@CsvSource({\"2,4\", \"3,9\"})\nvoid squares(int input, int expected) {\n  Assertions.assertEquals(expected, ", block: false },
          { text: "input * input", block: true },
          { text: ");\n}\n", block: false },
        ],
        blocks: ["input * input", "Math.pow(input, input)", "expected * input"],
        correctAnswer: ["input * input"],
        explanation:
          "Parameterized tests read CSV rows; the assertion compares expected to computed output.",
      },
      associatedSkills: ["junit"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which annotation ensures a method runs once before all tests in the class?",
        options: ["@BeforeAll", "@BeforeEach", "@Setup", "@AllTests"],
        correctAnswer: "@BeforeAll",
        explanation:
          "@BeforeAll methods must be static (or use @TestInstance(Lifecycle.PER_CLASS)) and execute once per class.",
      },
      associatedSkills: ["junit"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which feature allows grouping assertions so all failures are reported together?",
        options: [
          "Assertions.assertAll(...)",
          "Assertions.assertThrows",
          "Dynamic tests",
          "Assumptions.assumeTrue",
        ],
        correctAnswer: "Assertions.assertAll(...)",
        explanation:
          "assertAll executes lambda suppliers and reports every failure, useful for validating multiple related fields.",
      },
      associatedSkills: ["junit"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "How do you create tests dynamically at runtime based on a data set?",
        options: [
          "@TestFactory with DynamicTest stream",
          "@RepeatedTest",
          "ParameterizedTest",
          "@TestTemplate",
        ],
        correctAnswer: "@TestFactory with DynamicTest stream",
        explanation:
          "@TestFactory methods return collections/streams of DynamicTest instances built programmatically.",
      },
      associatedSkills: ["junit"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To integrate Spring context with JUnit 5, which extension should you use?",
        options: [
          "@ExtendWith(SpringExtension.class)",
          "@RunWith(SpringRunner.class)",
          "@SpringBootTest",
          "@SpringJUnit",
        ],
        correctAnswer: "@ExtendWith(SpringExtension.class)",
        explanation:
          "SpringExtension integrates with the Jupiter extension model, enabling dependency injection and test slices.",
      },
      associatedSkills: ["junit"],
    },
  ],
};
