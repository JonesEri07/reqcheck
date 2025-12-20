import { SkillSeedData } from "../../types";

export const matlabSeed: SkillSeedData = {
  skills: [
    {
      skillName: "MATLAB",
      skillNormalized: "matlab",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does the colon operator (:) do in MATLAB?",
        options: [
          "Creates evenly spaced vectors",
          "Declares a function",
          "Starts a comment",
          "Imports a package",
        ],
        correctAnswer: "Creates evenly spaced vectors",
        explanation:
          "The colon operator is commonly used to build ranges (1:10) or specify row/column slices.",
      },
      associatedSkills: ["matlab"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command loads variables from a MAT-file named data.mat?",
        options: ["load('data.mat')", "import data.mat", "readtable('data.mat')", "scan('data.mat')"],
        correctAnswer: "load('data.mat')",
        explanation:
          "load reads MAT-files into the workspace so variables become available for further processing.",
      },
      associatedSkills: ["matlab"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you create a 3×3 matrix of zeros?",
        options: ["zeros(3)", "zeros(3,0)", "zeros(0,3)", "zeros([1 9])"],
        correctAnswer: "zeros(3)",
        explanation:
          "Calling zeros(3) returns a 3×3 matrix. You can also specify rows and columns explicitly with zeros(3,3).",
      },
      associatedSkills: ["matlab"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function plots y versus x in MATLAB?",
        options: ["plot(x, y)", "draw(x, y)", "graph(y, x)", "chart(x, y)"],
        correctAnswer: "plot(x, y)",
        explanation:
          "plot is the basic 2D plotting function that draws y-values against corresponding x-values.",
      },
      associatedSkills: ["matlab"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which symbol starts a comment in MATLAB scripts?",
        options: ["%", "//", "#", "--"],
        correctAnswer: "%",
        explanation:
          "MATLAB uses the percent symbol to start single-line comments inside scripts and functions.",
      },
      associatedSkills: ["matlab"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which function solves a system of linear equations Ax = b efficiently?",
        options: ["x = A\\b", "x = inv(A)*b", "x = solve(A, b)", "x = det(A)/b"],
        correctAnswer: "x = A\\b",
        explanation:
          "The backslash operator uses optimized factorization routines and is preferred over explicitly computing inv(A).",
      },
      associatedSkills: ["matlab"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "What does the linspace(0, 1, 5) command return?",
        options: [
          "A row vector with 5 values between 0 and 1 inclusive",
          "A column vector of zeros",
          "A logarithmic sequence",
          "Five random values",
        ],
        correctAnswer: "A row vector with 5 values between 0 and 1 inclusive",
        explanation:
          "linspace generates linearly spaced values, so linspace(0,1,5) returns [0 0.25 0.5 0.75 1].",
      },
      associatedSkills: ["matlab"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which toolbox would you typically use for signal processing workflows?",
        options: [
          "Signal Processing Toolbox",
          "Statistics and Machine Learning Toolbox",
          "Optimization Toolbox",
          "Econometrics Toolbox",
        ],
        correctAnswer: "Signal Processing Toolbox",
        explanation:
          "Specialized toolboxes extend MATLAB. Frequency filters, FFT tools, and spectral analysis live in the Signal Processing Toolbox.",
      },
      associatedSkills: ["matlab"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which function converts a MATLAB table into a dataset suitable for machine learning workflows?",
        options: ["table2array", "struct2table", "mat2cell", "char"],
        correctAnswer: "table2array",
        explanation:
          "table2array removes metadata and returns a numeric array, which many algorithms in Statistics and Machine Learning Toolbox expect.",
      },
      associatedSkills: ["matlab"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How can you improve performance when looping over large arrays?",
        options: [
          "Preallocate output arrays before the loop",
          "Call clear all inside the loop",
          "Use global variables for every loop",
          "Open a new figure each iteration",
        ],
        correctAnswer: "Preallocate output arrays before the loop",
        explanation:
          "Preallocating avoids repeated memory reallocation and is a common best practice for performance-critical MATLAB code.",
      },
      associatedSkills: ["matlab"],
    },
  ],
};
