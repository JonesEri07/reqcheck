import { SkillSeedData } from "../../types.js";

export const plotlySeed: SkillSeedData = {
  skills: [
    {
      skillName: "Plotly",
      skillNormalized: "plotly",
      aliases: ["dash"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which high-level Plotly library is commonly used in Python?",
        options: [
          "plotly.express as px",
          "plotly.graph_objects as plt",
          "plotly.hi as hi",
          "plotly.chart as pc",
        ],
        correctAnswer: "plotly.express as px",
        explanation:
          "Plotly Express (imported as px) offers concise functions for building interactive figures.",
      },
      associatedSkills: ["plotly"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Plotly figure method displays the chart in a Jupyter notebook?",
        options: ["fig.show()", "fig.plot()", "fig.render()", "fig.open()"],
        correctAnswer: "fig.show()",
        explanation:
          "Calling show on a figure renders it in notebooks, dashboards, or exported HTML.",
      },
      associatedSkills: ["plotly"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Plotly Express function creates a scatter plot?",
        options: ["px.scatter(df, x='a', y='b')", "px.line()", "px.bar()", "px.pie()"],
        correctAnswer: "px.scatter(df, x='a', y='b')",
        explanation:
          "px.scatter builds interactive scatter plots with automatic hover tooltips.",
      },
      associatedSkills: ["plotly"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which plotly figure property controls hover label text?",
        options: ["hover_data", "xaxis.title", "template", "fig.colorway"],
        correctAnswer: "hover_data",
        explanation:
          "Passing hover_data to Plotly Express allows you to show or hide fields in the hover tooltip.",
      },
      associatedSkills: ["plotly"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Plotly object lets you change layout properties such as titles or legend position?",
        options: ["fig.update_layout(...)", "fig.modify_axes(...)", "fig.options(...)", "fig.decorate(...)"],
        correctAnswer: "fig.update_layout(...)",
        explanation:
          "update_layout edits figure-level settings like titles, legend orientation, margins, and annotations.",
      },
      associatedSkills: ["plotly"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "How do you add a reference line to an existing Plotly Express figure?",
        options: [
          "fig.add_hline(y=100)",
          "fig.draw_line(y=100)",
          "fig.line.add(100)",
          "fig.layout.line(100)",
        ],
        correctAnswer: "fig.add_hline(y=100)",
        explanation:
          "add_hline and add_vline helpers insert horizontal/vertical shapes without rebuilding the entire figure.",
      },
      associatedSkills: ["plotly"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which Plotly function builds a choropleth map using geographic data?",
        options: [
          "px.choropleth(df, locations='country', color='value')",
          "px.map(df)",
          "px.geo(df)",
          "px.scatter_geo(df, hover_name='country')",
        ],
        correctAnswer: "px.choropleth(df, locations='country', color='value')",
        explanation:
          "px.choropleth fills regions based on a color scale derived from metric values.",
      },
      associatedSkills: ["plotly"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which Plotly component lets you build interactive web apps without writing JavaScript?",
        options: ["Dash", "Streamlit", "Tableau", "Power BI"],
        correctAnswer: "Dash",
        explanation:
          "Dash (by Plotly) uses Python callbacks and layout components to build interactive dashboards on top of Plotly figures.",
      },
      associatedSkills: ["plotly"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How can you reuse a color palette across multiple Plotly figures?",
        options: [
          "Define a template via plotly.io.templates['custom']",
          "Call plt.set_palette()",
          "Store colors in pandas",
          "Set fig.color='global'",
        ],
        correctAnswer: "Define a template via plotly.io.templates['custom']",
        explanation:
          "Plotly templates capture default layout/trace attributes. Assigning it to fig.update_layout(template='custom') reuses the styling.",
      },
      associatedSkills: ["plotly"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which approach improves performance when rendering large datasets?",
        options: [
          "Use WebGL-based traces like scattergl",
          "Increase the figure size drastically",
          "Disable hover info",
          "Switch to CSV export",
        ],
        correctAnswer: "Use WebGL-based traces like scattergl",
        explanation:
          "Scattergl and other *gl traces render thousands of points efficiently using the GPU.",
      },
      associatedSkills: ["plotly"],
    },
  ],
};
