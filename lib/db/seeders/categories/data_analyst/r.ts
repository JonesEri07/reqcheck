import { SkillSeedData } from "../../types.js";

export const rSeed: SkillSeedData = {
  skills: [
    {
      skillName: "R",
      skillNormalized: "r",
      aliases: ["r programming", "r language"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which assignment operator is idiomatic in R scripts?",
        options: ["<-", "=", ":=", "=>"],
        correctAnswer: "<-",
        explanation:
          "While = also works, the left arrow (<-) is the conventional assignment operator in R.",
      },
      associatedSkills: ["r"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function previews the first rows of a data frame df?",
        options: ["head(df)", "top(df)", "first(df)", "preview(df)"],
        correctAnswer: "head(df)",
        explanation:
          "head displays the first n rows (6 by default), similar to pandas head().",
      },
      associatedSkills: ["r"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which package provides the tidyverse collection?",
        options: ["library(tidyverse)", "library(base)", "library(data.table)", "library(MASS)"],
        correctAnswer: "library(tidyverse)",
        explanation:
          "Installing/loading tidyverse brings in ggplot2, dplyr, tidyr, readr, etc., for modern R workflows.",
      },
      associatedSkills: ["r"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function reads a CSV into a data frame using base R?",
        options: ["read.csv('file.csv')", "load.csv('file.csv')", "import_csv('file.csv')", "scan('file.csv')"],
        correctAnswer: "read.csv('file.csv')",
        explanation:
          "read.csv is the base R helper for CSV ingestion; readr::read_csv is the tidyverse alternative.",
      },
      associatedSkills: ["r"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which symbol begins a comment in R?",
        options: ["#", "//", "%", "--"],
        correctAnswer: "#",
        explanation:
          "R uses the hash symbol to comment out code or explain logic inline.",
      },
      associatedSkills: ["r"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which dplyr verb selects rows matching a logical expression?",
        options: [
          "filter(df, mpg > 30)",
          "select(df, mpg)",
          "mutate(df, mpg = mpg * 1.6)",
          "arrange(df, mpg)",
        ],
        correctAnswer: "filter(df, mpg > 30)",
        explanation:
          "filter keeps rows where the condition is TRUE, similar to SQL WHERE.",
      },
      associatedSkills: ["r"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which ggplot layer creates a bar chart of counts?",
        options: [
          "geom_bar()",
          "geom_line()",
          "geom_point()",
          "geom_boxplot()",
        ],
        correctAnswer: "geom_bar()",
        explanation:
          "geom_bar visualizes counts per category; with stat=\"identity\" it plots pre-aggregated values.",
      },
      associatedSkills: ["r"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which function combines data frames by rows while matching columns?",
        options: ["bind_rows(df1, df2)", "merge(df1, df2)", "cbind(df1, df2)", "stack(df1, df2)"],
        correctAnswer: "bind_rows(df1, df2)",
        explanation:
          "bind_rows (dplyr) appends rows, auto-aligning columns and inserting NA where needed.",
      },
      associatedSkills: ["r"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which tool builds reproducible analysis documents mixing prose and R code?",
        options: [
          "R Markdown (rmarkdown)",
          "Shiny",
          "Plumber",
          "Packrat",
        ],
        correctAnswer: "R Markdown (rmarkdown)",
        explanation:
          "R Markdown renders notebooks/reports (HTML, PDF, Word) that combine code chunks and commentary.",
      },
      associatedSkills: ["r"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which function creates interactive dashboards/apps entirely in R?",
        options: [
          "shinyApp(ui, server)",
          "plumber::plumb()",
          "flexdashboard()",
          "blogdown::serve_site()",
        ],
        correctAnswer: "shinyApp(ui, server)",
        explanation:
          "Shiny builds reactive web apps by pairing a UI definition with server logic, enabling interactive analytics.",
      },
      associatedSkills: ["r"],
    },
  ],
};
