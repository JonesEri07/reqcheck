import { SkillSeedData } from "../../types";

export const seleniumSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Selenium",
      skillNormalized: "selenium",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Selenium library controls browsers via WebDriver in Python?",
        options: ["selenium.webdriver", "puppeteer", "playwright", "beautifulsoup"],
        correctAnswer: "selenium.webdriver",
        explanation:
          "selenium.webdriver provides WebDriver APIs for interacting with browsers.",
      },
      associatedSkills: ["selenium"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which driver executable automates Google Chrome?",
        options: ["ChromeDriver", "GeckoDriver", "IEDriverServer", "SafariDriver"],
        correctAnswer: "ChromeDriver",
        explanation:
          "ChromeDriver bridges Selenium and Chrome's DevTools protocol.",
      },
      associatedSkills: ["selenium"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method finds a single element using a CSS selector?",
        options: [
          "driver.findElement(By.cssSelector(\".btn\"))",
          "driver.find(By.css(\".btn\"))",
          "driver.locate(By.css)",
          "document.querySelector()",
        ],
        correctAnswer: "driver.findElement(By.cssSelector(\".btn\"))",
        explanation:
          "findElement accepts By locators such as By.cssSelector for CSS queries.",
      },
      associatedSkills: ["selenium"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which option runs Selenium tests without a visible browser window?",
        options: ["Headless mode", "Incognito mode", "Responsive mode", "Safe mode"],
        correctAnswer: "Headless mode",
        explanation:
          "Setting headless = true on ChromeOptions/FirefoxOptions launches browsers without UI—ideal for CI.",
      },
      associatedSkills: ["selenium"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which wait strategy polls until a supplied condition is satisfied?",
        options: [
          "Explicit wait (WebDriverWait + ExpectedConditions)",
          "Thread.sleep",
          "Implicit wait",
          "Promise.delay",
        ],
        correctAnswer: "Explicit wait (WebDriverWait + ExpectedConditions)",
        explanation:
          "WebDriverWait combined with ExpectedConditions polls for states like elementToBeClickable without blocking unnecessarily.",
      },
      associatedSkills: ["selenium"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the code that switches into an iframe named \"editor\".",
        segments: [
          { text: "driver.switchTo().", block: false },
          { text: "frame", block: true },
          { text: "(\"editor\");", block: false },
        ],
        blocks: ["frame", "window", "defaultContent"],
        correctAnswer: ["frame"],
        explanation:
          "switchTo().frame(identifier) focuses on iframe content; defaultContent() switches back.",
      },
      associatedSkills: ["selenium"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which architecture distributes Selenium tests across multiple machines?",
        options: [
          "Selenium Grid hub + nodes",
          "Docker Compose alone",
          "Cypress Dashboard",
          "Chrome DevTools Protocol",
        ],
        correctAnswer: "Selenium Grid hub + nodes",
        explanation:
          "Selenium Grid uses a hub to route commands to registered nodes, enabling parallel cross-browser testing.",
      },
      associatedSkills: ["selenium"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which ExpectedConditions helper ensures an element is visible and enabled before clicking?",
        options: [
          "elementToBeClickable",
          "presenceOfElementLocated",
          "stalenessOf",
          "textToBePresentInElement",
        ],
        correctAnswer: "elementToBeClickable",
        explanation:
          "elementToBeClickable waits until the element is visible and enabled to receive clicks.",
      },
      associatedSkills: ["selenium"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which strategy reduces flaky tests in dynamic frontends?",
        options: [
          "Use explicit waits with resilient data-test locators",
          "Add Thread.sleep everywhere",
          "Disable JavaScript",
          "Run tests only locally",
        ],
        correctAnswer: "Use explicit waits with resilient data-test locators",
        explanation:
          "Combining explicit waits and stable locators (data-test IDs) handles dynamic DOM updates better than fixed sleeps.",
      },
      associatedSkills: ["selenium"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which API enables remote Selenium sessions on services like Sauce Labs or BrowserStack?",
        options: [
          "RemoteWebDriver pointing to the provider endpoint",
          "driver.enableRemote(true)",
          "ChromeOptions.add_argument(\"--remote\")",
          "Grid only",
        ],
        correctAnswer: "RemoteWebDriver pointing to the provider endpoint",
        explanation:
          "RemoteWebDriver connects to remote WebDriver endpoints (Selenium Grid/SaaS) using desired capabilities to describe browser/platform.",
      },
      associatedSkills: ["selenium"],
    },
  ],
};
