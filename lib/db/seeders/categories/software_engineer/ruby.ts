import { SkillSeedData } from "../../types.js";

export const rubySeed: SkillSeedData = {
  skills: [
    {
      skillName: "Ruby",
      skillNormalized: "ruby",
      aliases: ["ruby on rails", "rails"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command runs a Ruby script?",
        options: ["ruby app.rb", "rb app.rb", "run ruby app.rb", "rails run app.rb"],
        correctAnswer: "ruby app.rb",
        explanation:
          "The ruby CLI executes .rb files; rails/apps wrap Ruby but ruby is the base interpreter.",
      },
      associatedSkills: ["ruby"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which keyword defines a method in Ruby?",
        options: ["def", "function", "method", "lambda"],
        correctAnswer: "def",
        explanation:
          "Methods are defined with def name(args); end closes the definition.",
      },
      associatedSkills: ["ruby"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which built-in package manager installs gems?",
        options: ["gem install", "bundle install", "pip install", "npm install"],
        correctAnswer: "gem install",
        explanation:
          "gem install package fetches RubyGems; bundler uses Gemfile but gem is the base CLI.",
      },
      associatedSkills: ["ruby"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does string interpolation look like in Ruby?",
        options: ['"Hello #{name}"', '"Hello ${name}"', '"Hello %s"', '"Hello " + name'],
        correctAnswer: '"Hello #{name}"',
        explanation:
          "#{expr} interpolates values inside double-quoted strings.",
      },
      associatedSkills: ["ruby"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which tool creates new Rails applications?",
        options: ["rails new myapp", "ruby on rails create", "bundle new", "rake new"],
        correctAnswer: "rails new myapp",
        explanation:
          "rails new scaffolds a Rails app with Gemfile, config, and directories.",
      },
      associatedSkills: ["ruby"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the block that iterates over an array.",
        segments: [
          { text: "[1, 2, 3].", block: false },
          { text: "each", block: true },
          { text: " do |n|\n  puts n\nend", block: false },
        ],
        blocks: ["each", "map", "collect"],
        correctAnswer: ["each"],
        explanation:
          "each yields each element to the block; map would return a new array.",
      },
      associatedSkills: ["ruby"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which syntax defines keyword arguments with default values?",
        options: [
          "def greet(name: 'world')",
          "def greet(name = 'world':)",
          "def greet(*name)",
          "def greet(name)",
        ],
        correctAnswer: "def greet(name: 'world')",
        explanation:
          "Keyword arguments use name: value syntax, optionally with defaults.",
      },
      associatedSkills: ["ruby"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which feature lets you share methods across classes without inheritance?",
        options: ["Modules included via include/extend", "Interfaces", "Traits", "Structs"],
        correctAnswer: "Modules included via include/extend",
        explanation:
          "Ruby modules can be included to share instance methods or extended for class methods.",
      },
      associatedSkills: ["ruby"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which garbage collector design in MRI Ruby reduces pause times?",
        options: [
          "Incremental + generational RGenGC",
          "Reference counting only",
          "Mark-and-sweep without generations",
          "Copying GC only",
        ],
        correctAnswer: "Incremental + generational RGenGC",
        explanation:
          "Ruby 2.1+ introduced RGenGC, combining incremental and generational collection to cut pause times.",
      },
      associatedSkills: ["ruby"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which Ruby 3 feature enables parallel execution of isolated actors?",
        options: ["Ractors", "Fibers only", "Green threads", "EventMachine"],
        correctAnswer: "Ractors",
        explanation:
          "Ractors provide isolated actors that communicate via message passing, enabling parallel execution across CPU cores.",
      },
      associatedSkills: ["ruby"],
    },
  ],
};
