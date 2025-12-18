import { SkillSeedData } from "../../types.js";

export const jquerySeed: SkillSeedData = {
  skills: [
    {
      skillName: "JQuery",
      skillNormalized: "jquery",
      aliases: ["jquery"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which selector grabs all paragraph elements?",
        options: ["$('p')", "$('#p')", "$('.p')", "$('p#')"],
        correctAnswer: "$('p')",
        explanation:
          "$('p') selects every <p> element using CSS selector semantics.",
      },
      associatedSkills: ["jquery"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you run code when the DOM is ready?",
        options: [
          "$(document).ready(function() { ... });",
          "window.onload = ...;",
          "$ready(function)",
          "document.onReady()",
        ],
        correctAnswer: "$(document).ready(function() { ... });",
        explanation:
          "jQuery's ready helper runs once the DOM is parsed without waiting for images.",
      },
      associatedSkills: ["jquery"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method changes the text content of a selected element?",
        options: [".text('hello')", ".value('hello')", ".html()", ".appendTo()"],
        correctAnswer: ".text('hello')",
        explanation:
          ".text() sets or gets the text content, escaping HTML automatically.",
      },
      associatedSkills: ["jquery"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which jQuery method performs AJAX GET requests?",
        options: ["$.get('/api')", "$.fetch()", "$.ajaxGet()", "$.http()"],
        correctAnswer: "$.get('/api')",
        explanation:
          "$.get() is a shorthand for $.ajax with method GET, returning a jqXHR promise.",
      },
      associatedSkills: ["jquery"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method adds a CSS class?",
        options: [".addClass('active')", ".class('active')", ".cssClass()", ".attrClass()"],
        correctAnswer: ".addClass('active')",
        explanation:
          ".addClass adds one or more classes; .removeClass removes them.",
      },
      associatedSkills: ["jquery"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the event delegation pattern for dynamically added items.",
        segments: [
          { text: "$(document).on('click', '", block: false },
          { text: ".todo-item", block: true },
          { text: "', function () {\n  alert($(this).text());\n});", block: false },
        ],
        blocks: [".todo-item", "#todo-item", "todo-item"],
        correctAnswer: [".todo-item"],
        explanation:
          ".on(event, selector, handler) attaches a delegated listener to a static ancestor.",
      },
      associatedSkills: ["jquery"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which method fades an element out over 400ms by default?",
        options: [".fadeOut()", ".slideUp()", ".hide()", ".collapse()"],
        correctAnswer: ".fadeOut()",
        explanation:
          ".fadeOut animates opacity to zero; duration defaults to 400ms if not provided.",
      },
      associatedSkills: ["jquery"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which statement correctly chains multiple operations?",
        options: [
          "$('#msg').text('Saved').addClass('success').fadeIn();",
          "$('#msg').text('Saved') + addClass('success');",
          "$('#msg').text('Saved'); addClass('success');",
          "$('#msg').text('Saved').then(addClass('success'));",
        ],
        correctAnswer: "$('#msg').text('Saved').addClass('success').fadeIn();",
        explanation:
          "jQuery methods return the jQuery object, enabling fluent chaining.",
      },
      associatedSkills: ["jquery"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "To avoid global $ conflicts, which technique should you use?",
        options: [
          "Wrap code in (function ($) { ... })(jQuery);",
          "Disable other libraries",
          "Rename jQuery core",
          "Use globalThis.jQuery only",
        ],
        correctAnswer: "Wrap code in (function ($) { ... })(jQuery);",
        explanation:
          "Immediately invoked wrappers pass jQuery into a local $ parameter, preventing naming conflicts with other frameworks.",
      },
      associatedSkills: ["jquery"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Which method returns a promise compatible object for AJAX workflows?",
        options: ["$.ajax()", "$.promise()", "$.fetch()", "$.async()"],
        correctAnswer: "$.ajax()",
        explanation:
          "$.ajax returns a jqXHR object implementing Promise/A+ style methods (done, fail, then).",
      },
      associatedSkills: ["jquery"],
    },
  ],
};
