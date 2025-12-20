import { SkillSeedData } from "../../types";

export const tableauSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Tableau",
      skillNormalized: "tableau",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Tableau component lets you explore data fields and build worksheets?",
        options: ["Data pane", "Dashboard pane", "Analytics pane", "Format pane"],
        correctAnswer: "Data pane",
        explanation:
          "The Data pane lists all dimensions and measures from your data source, allowing drag-and-drop exploration.",
      },
      associatedSkills: ["tableau"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you create a quick filter for a dimension?",
        options: [
          "Right-click the dimension and choose 'Show Filter'",
          "Drag the dimension to Pages",
          "Use Worksheet → Duplicate",
          "Switch to Presentation Mode",
        ],
        correctAnswer: "Right-click the dimension and choose 'Show Filter'",
        explanation:
          "Showing the filter adds a control to the worksheet or dashboard so viewers can slice the data.",
      },
      associatedSkills: ["tableau"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which shelf controls the type of visualization (bars, lines, scatter) in Tableau?",
        options: ["Marks card", "Pages shelf", "Tooltip shelf", "Filter shelf"],
        correctAnswer: "Marks card",
        explanation:
          "The Marks card lets you toggle between mark types, color, size, labels, etc.",
      },
      associatedSkills: ["tableau"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Tableau object lets you build multi-sheet layouts for stakeholders?",
        options: ["Dashboards", "Stories", "Workbooks", "Bookmarks"],
        correctAnswer: "Dashboards",
        explanation:
          "Dashboards combine multiple worksheets and interactive elements into a single view.",
      },
      associatedSkills: ["tableau"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What does dragging a dimension to the Columns shelf do?",
        options: [
          "Creates column headers for that dimension",
          "Applies a filter to the view",
          "Changes color encoding",
          "Exports data to CSV",
        ],
        correctAnswer: "Creates column headers for that dimension",
        explanation:
          "Columns (and Rows) define the layout of axes and headers in a Tableau worksheet.",
      },
      associatedSkills: ["tableau"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which feature lets you summarize multiple metrics in a single horizontal view for categories?",
        options: ["Show Me → Highlight Table", "Bins", "Sort descending", "Set actions"],
        correctAnswer: "Show Me → Highlight Table",
        explanation:
          "Highlight tables color each cell according to measure intensity, making comparisons easier.",
      },
      associatedSkills: ["tableau"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "How can you build a calculated field that returns profit ratio?",
        options: [
          "SUM([Profit]) / SUM([Sales])",
          "[Profit] - [Sales]",
          "WINDOW_SUM([Profit])",
          "LOOKUP([Profit], 1)",
        ],
        correctAnswer: "SUM([Profit]) / SUM([Sales])",
        explanation:
          "Aggregating Profit and Sales before dividing produces the profit ratio metric needed in many dashboards.",
      },
      associatedSkills: ["tableau"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which Tableau feature lets dashboard actions filter other worksheets?",
        options: [
          "Dashboard → Actions → Add Filter Action",
          "Worksheet → Export",
          "Story → Add Caption",
          "Format → Shading",
        ],
        correctAnswer: "Dashboard → Actions → Add Filter Action",
        explanation:
          "Filter actions connect source and target worksheets so clicking one view filters the others.",
      },
      associatedSkills: ["tableau"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which layout feature lets you swap worksheets in and out using a parameter?",
        options: [
          "Sheet swapping parameter action",
          "Fixed dash sizing",
          "Story caption",
          "Export dashboard",
        ],
        correctAnswer: "Sheet swapping parameter action",
        explanation:
          "A parameter tied to sheet visibility can control which worksheet displays in a container, enabling sheet swapping.",
      },
      associatedSkills: ["tableau"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How can you optimize a dashboard that queries multiple slow views?",
        options: [
          "Use extract data sources and limit quick filters",
          "Increase story points",
          "Disable tooltips",
          "Set the dashboard to full screen",
        ],
        correctAnswer: "Use extract data sources and limit quick filters",
        explanation:
          "Extracts reduce live query latency and minimizing high-cardinality quick filters improves performance.",
      },
      associatedSkills: ["tableau"],
    },
  ],
};
