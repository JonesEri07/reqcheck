import { SkillSeedData } from "../../types.js";

export const springBootSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Spring Boot",
      skillNormalized: "spring boot",
      aliases: ["spring", "springframework"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI initializes a Spring Boot project?",
        options: ["spring init", "mvn spring:new", "gradle init --spring", "start-spring"],
        correctAnswer: "spring init",
        explanation:
          "The Spring CLI (spring init) or start.spring.io generates Boot projects with chosen dependencies.",
      },
      associatedSkills: ["spring boot"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which annotation marks the main application class?",
        options: ["@SpringBootApplication", "@EnableAutoConfiguration", "@Component", "@Configuration"],
        correctAnswer: "@SpringBootApplication",
        explanation:
          "@SpringBootApplication combines @Configuration, @EnableAutoConfiguration, and @ComponentScan.",
      },
      associatedSkills: ["spring boot"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which configuration file uses YAML in Spring Boot?",
        options: ["application.yml", "boot.yaml", "config.yaml", "spring.yml"],
        correctAnswer: "application.yml",
        explanation:
          "Spring Boot auto-loads application.properties or application.yml from the classpath.",
      },
      associatedSkills: ["spring boot"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which annotation exposes REST endpoints returning JSON?",
        options: ["@RestController", "@Controller", "@Service", "@Repository"],
        correctAnswer: "@RestController",
        explanation:
          "@RestController combines @Controller and @ResponseBody, returning JSON/XML responses directly.",
      },
      associatedSkills: ["spring boot"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which property sets the HTTP port at runtime?",
        options: ["server.port=8081", "spring.port=8081", "http.port=8081", "boot.port=8081"],
        correctAnswer: "server.port=8081",
        explanation:
          "Setting server.port overrides the embedded container port in application properties.",
      },
      associatedSkills: ["spring boot"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the configuration properties binding example.",
        segments: [
          { text: "@ConfigurationProperties(prefix = \"storage\")\n", block: false },
          { text: "data class StorageProps(var location: String = \"uploads\")", block: true },
          { text: "\n", block: false },
        ],
        blocks: [
          "data class StorageProps(var location: String = \"uploads\")",
          "class StorageProps",
          "@Bean StorageProps",
        ],
        correctAnswer: ["data class StorageProps(var location: String = \"uploads\")"],
        explanation:
          "Binding configuration to data classes/POJOs requires @ConfigurationProperties on the class.",
      },
      associatedSkills: ["spring boot"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which starter dependency adds Spring MVC plus embedded Tomcat?",
        options: [
          "spring-boot-starter-web",
          "spring-boot-starter-data-jpa",
          "spring-boot-starter-security",
          "spring-boot-starter-test",
        ],
        correctAnswer: "spring-boot-starter-web",
        explanation:
          "spring-boot-starter-web pulls in Spring MVC, Jackson, validation, and Tomcat.",
      },
      associatedSkills: ["spring boot"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which annotation schedules cron or fixed-delay tasks?",
        options: ["@Scheduled", "@Async", "@Transactional", "@EnableCaching"],
        correctAnswer: "@Scheduled",
        explanation:
          "@Scheduled methods run at fixed delays, fixed rates, or cron expressions when @EnableScheduling is present.",
      },
      associatedSkills: ["spring boot"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which actuator endpoint exposes health info, and how is it secured?",
        options: [
          "/actuator/health protected via Spring Security rules",
          "/health open over HTTP",
          "/metrics only over JMX",
          "/server/status unprotected",
        ],
        correctAnswer: "/actuator/health protected via Spring Security rules",
        explanation:
          "Actuator exposes /actuator/health; restrict access with Spring Security and management.endpoints.web.exposure.include.",
      },
      associatedSkills: ["spring boot"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which approach compiles Spring Boot apps to GraalVM native images for faster startup?",
        options: [
          "Spring Native / AOT with GraalVM native-image",
          "Deploy as WAR to Tomcat",
          "Enable DevTools",
          "Use Kotlin coroutines",
        ],
        correctAnswer: "Spring Native / AOT with GraalVM native-image",
        explanation:
          "Spring Native (AOT) integrates with GraalVM native-image to produce native executables with low startup time and memory footprint.",
      },
      associatedSkills: ["spring boot"],
    },
  ],
};
