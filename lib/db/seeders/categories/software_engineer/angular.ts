import { SkillSeedData } from "../../types";

export const angularSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Angular",
      skillNormalized: "angular",
      aliases: ["angularjs", "angular2"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Which Angular CLI command scaffolds a brand new workspace and application?",
        options: [
          "ng new my-app",
          "ng serve",
          "ng generate component",
          "npm start",
        ],
        correctAnswer: "ng new my-app",
        explanation:
          "ng new creates a fresh workspace with an initial application, routing, and configuration files.",
      },
      associatedSkills: ["angular"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which decorator marks a class as an Angular component?",
        options: ["@Component", "@Injectable", "@Directive", "@Pipe"],
        correctAnswer: "@Component",
        explanation:
          "@Component tells Angular that a class has a template, styles, and metadata for rendering.",
      },
      associatedSkills: ["angular"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question:
          "Which binding syntax renders the value of a component property inside a template?",
        options: ["{{ propertyName }}", "[property]", "(event)", "[[(...]]"],
        correctAnswer: "{{ propertyName }}",
        explanation:
          "Interpolation {{ }} binds a template expression to text content inside the DOM.",
      },
      associatedSkills: ["angular"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Angular service manages navigation and URLs?",
        options: ["RouterModule", "HttpClientModule", "FormsModule", "CommonModule"],
        correctAnswer: "RouterModule",
        explanation:
          "RouterModule configures routes, enabling component navigation and deep linking.",
      },
      associatedSkills: ["angular"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command compiles and serves the app with live reload?",
        options: ["ng serve", "ng build", "ng lint", "ng version"],
        correctAnswer: "ng serve",
        explanation:
          "ng serve starts the dev server, watches files, and reloads the browser automatically.",
      },
      associatedSkills: ["angular"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which RxJS operator inside a component unsubscribes automatically when the component is destroyed?",
        options: [
          "takeUntil(destroy$)",
          "map",
          "switchMap",
          "shareReplay(1)",
        ],
        correctAnswer: "takeUntil(destroy$)",
        explanation:
          "takeUntil tied to a Subject fired in ngOnDestroy prevents memory leaks from long-lived subscriptions.",
      },
      associatedSkills: ["angular"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which change detection strategy reduces unnecessary checks by diffing @Input references?",
        options: [
          "ChangeDetectionStrategy.OnPush",
          "ChangeDetectionStrategy.Default",
          "TrackBy",
          "Zone.js",
        ],
        correctAnswer: "ChangeDetectionStrategy.OnPush",
        explanation:
          "OnPush runs change detection only when input references change or an observable emits, improving performance.",
      },
      associatedSkills: ["angular"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which module should you import to use reactive forms APIs like FormGroup and FormControl?",
        options: [
          "ReactiveFormsModule",
          "FormsModule",
          "BrowserModule",
          "HttpClientModule",
        ],
        correctAnswer: "ReactiveFormsModule",
        explanation:
          "ReactiveFormsModule exposes FormBuilder, FormGroup, validators, and other reactive form primitives.",
      },
      associatedSkills: ["angular"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which build configuration flag enables Ahead-of-Time (AOT) compilation and production optimizations?",
        options: [
          "ng build --configuration production",
          "ng serve --watch",
          "ng lint --fix",
          "tsc --project tsconfig.json",
        ],
        correctAnswer: "ng build --configuration production",
        explanation:
          "The production configuration turns on AOT, minification, and bundle optimization for deployment.",
      },
      associatedSkills: ["angular"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which token allows intercepting HTTP requests globally to add headers or handle errors?",
        options: [
          "HTTP_INTERCEPTORS",
          "APP_INITIALIZER",
          "LOCALE_ID",
          "NG_VALUE_ACCESSOR",
        ],
        correctAnswer: "HTTP_INTERCEPTORS",
        explanation:
          "Providing HTTP_INTERCEPTORS with multi: true registers interceptors that wrap HttpClient calls.",
      },
      associatedSkills: ["angular"],
    },
  ],
};
