import { SkillSeedData } from "../../types.js";

export const seabornSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Seaborn",
      skillNormalized: "seaborn",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which import brings Seaborn into a notebook with the standard alias?",
        options: [
          "import seaborn as sns",
          "import seaborn as sb",
          "from seaborn import pandas",
          "import sns as seaborn",
        ],
        correctAnswer: "import seaborn as sns",
        explanation:
          "Seaborn is almost always imported as sns, mirroring matplotlib.pyplot as plt.",
      },
      associatedSkills: ["seaborn"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Seaborn function draws a histogram with a kernel density estimate?",
        options: ["sns.histplot(data, kde=True)", "sns.lineplot()", "sns.barplot()", "sns.countplot()"],
        correctAnswer: "sns.histplot(data, kde=True)",
        explanation:
          "histplot replaced distplot to show histograms; passing kde=True overlays the density curve.",
      },
      associatedSkills: ["seaborn"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function creates a scatter plot with optional categorical hue?",
        options: [
          "sns.scatterplot(data=df, x='age', y='income', hue='region')",
          "sns.catplot(kind='bar')",
          "sns.boxplot()",
          "sns.heatmap()",
        ],
        correctAnswer:
          "sns.scatterplot(data=df, x='age', y='income', hue='region')",
        explanation:
          "scatterplot provides flexible scatter plots with color encoding for categorical variables.",
      },
      associatedSkills: ["seaborn"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Seaborn theme function quickly changes the global style?",
        options: [
          "sns.set_theme(style='darkgrid')",
          "plt.style.use('ggplot')",
          "sns.theme('darkgrid')",
          "sns.palette('muted')",
        ],
        correctAnswer: "sns.set_theme(style='darkgrid')",
        explanation:
          "sns.set_theme() applies consistent background, grid, and palette across plots.",
      },
      associatedSkills: ["seaborn"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function draws a categorical bar chart with confidence intervals?",
        options: [
          "sns.barplot(x='region', y='sales', data=df)",
          "sns.swarmplot()",
          "sns.histplot()",
          "sns.regplot()",
        ],
        correctAnswer: "sns.barplot(x='region', y='sales', data=df)",
        explanation:
          "barplot aggregates y by x category and displays error bars for the estimator (mean by default).",
      },
      associatedSkills: ["seaborn"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which Seaborn function pairs numeric variables into a grid of scatter plots and histograms?",
        options: [
          "sns.pairplot(df)",
          "sns.jointplot()",
          "sns.catplot()",
          "sns.displot()",
        ],
        correctAnswer: "sns.pairplot(df)",
        explanation:
          "pairplot automatically charts pairwise scatter plots and optional hist/KDE on the diagonal.",
      },
      associatedSkills: ["seaborn"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which function visualizes correlation matrices effectively?",
        options: [
          "sns.heatmap(df.corr(), annot=True)",
          "sns.violinplot()",
          "sns.stripplot()",
          "sns.regplot()",
        ],
        correctAnswer: "sns.heatmap(df.corr(), annot=True)",
        explanation:
          "heatmap displays 2D data with colors; passing df.corr() shows correlations and annot=True adds labels.",
      },
      associatedSkills: ["seaborn"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which figure-level function creates multi-facet categorical plots via tidy syntax?",
        options: [
          "sns.catplot(data=df, x='category', y='value', col='region')",
          "sns.distplot()",
          "sns.residplot()",
          "sns.ecdfplot()",
        ],
        correctAnswer:
          "sns.catplot(data=df, x='category', y='value', col='region')",
        explanation:
          "catplot is a figure-level interface to categorical plots (strip, box, bar) and can facet by rows/columns.",
      },
      associatedSkills: ["seaborn"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which Seaborn function overlays a regression line with confidence intervals on scatter data?",
        options: [
          "sns.regplot(x='x', y='y', data=df)",
          "sns.relplot()",
          "sns.boxenplot()",
          "sns.stripplot()",
        ],
        correctAnswer: "sns.regplot(x='x', y='y', data=df)",
        explanation:
          "regplot fits a simple linear regression and shows a 95% confidence interval by default.",
      },
      associatedSkills: ["seaborn"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How can you customize a Seaborn palette to match brand colors?",
        options: [
          "sns.set_palette(['#002855', '#E87722'])",
          "plt.colorbar()",
          "sns.theme_palette('brand')",
          "sns.palplot('brand')",
        ],
        correctAnswer: "sns.set_palette(['#002855', '#E87722'])",
        explanation:
          "set_palette accepts a list of colors (hex/RGB) that applies to subsequent plots.",
      },
      associatedSkills: ["seaborn"],
    },
  ],
};
