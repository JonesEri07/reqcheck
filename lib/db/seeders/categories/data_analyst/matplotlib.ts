import { SkillSeedData } from "../../types.js";

export const matplotlibSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Matplotlib",
      skillNormalized: "matplotlib",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which import is the conventional alias for Matplotlib's plotting module?",
        options: [
          "import matplotlib.pyplot as plt",
          "import matplotlib as plot",
          "import pyplot as matplotlib",
          "import plotly.express as plt",
        ],
        correctAnswer: "import matplotlib.pyplot as plt",
        explanation:
          "By convention analysts import matplotlib.pyplot as plt before creating figures and axes.",
      },
      associatedSkills: ["matplotlib"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command displays the current Matplotlib figure window?",
        options: ["plt.show()", "plt.plot()", "plt.figure()", "plt.savefig()"],
        correctAnswer: "plt.show()",
        explanation:
          "plt.show() renders the current figure, either inline (Jupyter) or by opening a window in desktop environments.",
      },
      associatedSkills: ["matplotlib"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function creates a line chart of y values?",
        options: ["plt.plot(y)", "plt.bar(y)", "plt.scatter(y)", "plt.hist(y)"],
        correctAnswer: "plt.plot(y)",
        explanation:
          "plt.plot draws lines or markers connecting the sequence of y-values (optionally using x-values).",
      },
      associatedSkills: ["matplotlib"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you add a title to the current axes?",
        options: ["plt.title('Sales')", "plt.name('Sales')", "plt.caption('Sales')", "plt.label('Sales')"],
        correctAnswer: "plt.title('Sales')",
        explanation:
          "plt.title sets the title text for the active axes.",
      },
      associatedSkills: ["matplotlib"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which command saves the current figure to disk?",
        options: [
          "plt.savefig('chart.png')",
          "plt.write('chart.png')",
          "plt.export('chart.png')",
          "plt.tofile('chart.png')",
        ],
        correctAnswer: "plt.savefig('chart.png')",
        explanation:
          "plt.savefig writes the active figure to image formats like PNG, SVG, or PDF.",
      },
      associatedSkills: ["matplotlib"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which method creates subplots and returns figure/axes objects for further customization?",
        options: [
          "fig, ax = plt.subplots()",
          "plt.subplot(0)",
          "plt.grid()",
          "plt.axis('off')",
        ],
        correctAnswer: "fig, ax = plt.subplots()",
        explanation:
          "plt.subplots returns a Figure and Axes objects so you can call methods like ax.plot() directly.",
      },
      associatedSkills: ["matplotlib"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "How do you rotate x-axis tick labels by 45 degrees?",
        options: [
          "plt.xticks(rotation=45)",
          "plt.rotatex(45)",
          "plt.ticklabelx(45)",
          "plt.axisx(45)",
        ],
        correctAnswer: "plt.xticks(rotation=45)",
        explanation:
          "The xticks helper accepts a rotation keyword to change tick label orientation.",
      },
      associatedSkills: ["matplotlib"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which function creates a color-coded matrix plot for correlation tables?",
        options: ["plt.imshow(matrix, cmap='coolwarm')", "plt.boxplot(matrix)", "plt.violinplot(matrix)", "plt.hexbin(matrix)"],
        correctAnswer: "plt.imshow(matrix, cmap='coolwarm')",
        explanation:
          "imshow displays 2D arrays as images. With a diverging colormap it becomes a quick heatmap for correlations.",
      },
      associatedSkills: ["matplotlib"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How can you share the same y-axis range across multiple subplots?",
        options: [
          "fig, axes = plt.subplots(2, sharey=True)",
          "plt.sameaxis('y')",
          "plt.axislink()",
          "plt.linked('y')",
        ],
        correctAnswer: "fig, axes = plt.subplots(2, sharey=True)",
        explanation:
          "Passing sharey=True when creating subplots ensures the axes share limits and tick labels.",
      },
      associatedSkills: ["matplotlib"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which Matplotlib object would you customize to globally change font sizes and colors?",
        options: ["plt.rcParams", "plt.context", "plt.globalStyle", "plt.figureOptions"],
        correctAnswer: "plt.rcParams",
        explanation:
          "rcParams is a dictionary-like object controlling global defaults such as font sizes, colors, and line widths.",
      },
      associatedSkills: ["matplotlib"],
    },
  ],
};
