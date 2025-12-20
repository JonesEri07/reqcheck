import { SkillSeedData } from "../../types";

export const pandasSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Pandas",
      skillNormalized: "pandas",
      aliases: [],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which import statement brings pandas into a script with the standard alias?",
        options: [
          "import pandas as pd",
          "import pandas as pn",
          "from pandas import numpy",
          "import pd as pandas",
        ],
        correctAnswer: "import pandas as pd",
        explanation:
          "Most documentation assumes pandas is imported as pd for concise code.",
      },
      associatedSkills: ["pandas"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function reads a CSV file into a DataFrame?",
        options: [
          "pd.read_csv('file.csv')",
          "pd.load('file.csv')",
          "pd.csv('file.csv')",
          "pd.read('file.csv')",
        ],
        correctAnswer: "pd.read_csv('file.csv')",
        explanation:
          "pd.read_csv is the go-to helper for CSV ingestion and supports dozens of options.",
      },
      associatedSkills: ["pandas"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you view the first five rows of a DataFrame df?",
        options: ["df.head()", "df.first()", "df.top()", "df.preview()"],
        correctAnswer: "df.head()",
        explanation:
          "head() displays the first n rows (5 by default), making it a quick inspection tool.",
      },
      associatedSkills: ["pandas"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which attribute returns column names of a DataFrame?",
        options: ["df.columns", "df.schema", "df.names", "df.keys"],
        correctAnswer: "df.columns",
        explanation:
          "df.columns is an Index listing the labels assigned to each column.",
      },
      associatedSkills: ["pandas"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you select the column named 'revenue'?",
        options: ["df['revenue']", "df.revenue()", "df.column('revenue')", "df.select('revenue')"],
        correctAnswer: "df['revenue']",
        explanation:
          "Using bracket notation returns a Series for the column. Attribute access df.revenue also works when names are valid identifiers.",
      },
      associatedSkills: ["pandas"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which method drops rows with missing values in place?",
        options: [
          "df.dropna(inplace=True)",
          "df.fillna(inplace=True)",
          "df.remove_na()",
          "df.delete_missing()",
        ],
        correctAnswer: "df.dropna(inplace=True)",
        explanation:
          "dropna removes rows/columns containing NaN. Passing inplace=True mutates the original DataFrame.",
      },
      associatedSkills: ["pandas"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "How do you group by the column 'region' and compute the mean of all numeric columns?",
        options: [
          "df.groupby('region').mean()",
          "df.group('region').avg()",
          "df.aggregate('region', 'mean')",
          "df.region.mean()",
        ],
        correctAnswer: "df.groupby('region').mean()",
        explanation:
          "groupby followed by aggregation (mean) produces grouped statistics for each region.",
      },
      associatedSkills: ["pandas"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which merge operation keeps only the intersection of keys from both DataFrames?",
        options: [
          "pd.merge(left, right, how='inner')",
          "pd.merge(left, right, how='left')",
          "pd.merge(left, right, how='outer')",
          "pd.merge(left, right, how='right')",
        ],
        correctAnswer: "pd.merge(left, right, how='inner')",
        explanation:
          "Inner joins return rows whose keys appear in both tables, which is the default merge behavior.",
      },
      associatedSkills: ["pandas"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which method converts categorical text labels to one-hot encoded columns?",
        options: [
          "pd.get_dummies(df['country'])",
          "df.astype('category')",
          "df.to_numpy()",
          "df.rank(method='dense')",
        ],
        correctAnswer: "pd.get_dummies(df['country'])",
        explanation:
          "get_dummies expands categorical columns into indicator columns for modeling or analysis.",
      },
      associatedSkills: ["pandas"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How can you optimize memory usage when loading large CSV files?",
        options: [
          "Specify dtype for columns when calling read_csv",
          "Use df.copy() repeatedly",
          "Turn off garbage collection",
          "Store data in Python lists",
        ],
        correctAnswer: "Specify dtype for columns when calling read_csv",
        explanation:
          "Passing dtypes (e.g., {'id': 'int32'}) prevents pandas from upcasting to larger types and reduces memory footprint.",
      },
      associatedSkills: ["pandas"],
    },
  ],
};
