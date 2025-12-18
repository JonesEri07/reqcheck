import { SkillSeedData } from "../../types.js";

export const scikitLearnSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Scikit-learn",
      skillNormalized: "scikit-learn",
      aliases: ["sklearn", "scikit learn"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which module contains the train_test_split utility in scikit-learn?",
        options: [
          "sklearn.model_selection",
          "sklearn.preprocessing",
          "sklearn.metrics",
          "sklearn.pipeline",
        ],
        correctAnswer: "sklearn.model_selection",
        explanation:
          "train_test_split resides in sklearn.model_selection along with other resampling helpers.",
      },
      associatedSkills: ["scikit-learn"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which estimator fits ordinary least squares regression?",
        options: [
          "LinearRegression()",
          "KMeans()",
          "RandomForestClassifier()",
          "LogisticRegression()",
        ],
        correctAnswer: "LinearRegression()",
        explanation:
          "LinearRegression implements ordinary least squares for continuous targets.",
      },
      associatedSkills: ["scikit-learn"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which helper computes classification accuracy?",
        options: [
          "accuracy_score(y_true, y_pred)",
          "mean_squared_error(y_true, y_pred)",
          "roc_auc_score(y_true, y_score)",
          "r2_score(y_true, y_pred)",
        ],
        correctAnswer: "accuracy_score(y_true, y_pred)",
        explanation:
          "accuracy_score measures the proportion of correct predictions for classifiers.",
      },
      associatedSkills: ["scikit-learn"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which transformer standardizes features to zero mean and unit variance?",
        options: [
          "StandardScaler()",
          "MinMaxScaler()",
          "LabelEncoder()",
          "PolynomialFeatures()",
        ],
        correctAnswer: "StandardScaler()",
        explanation:
          "StandardScaler subtracts each feature's mean and divides by its standard deviation.",
      },
      associatedSkills: ["scikit-learn"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function loads the Iris dataset bundled with scikit-learn?",
        options: [
          "sklearn.datasets.load_iris()",
          "sklearn.io.read('iris')",
          "sklearn.dataframe('iris')",
          "sklearn.pipeline.load('iris')",
        ],
        correctAnswer: "sklearn.datasets.load_iris()",
        explanation:
          "load_iris returns a Bunch object with data, targets, and metadata for the classic Iris dataset.",
      },
      associatedSkills: ["scikit-learn"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which helper runs k-fold cross-validation and returns scores?",
        options: [
          "cross_val_score(estimator, X, y, cv=5)",
          "GridSearchCV(estimator).fit(X, y)",
          "train_test_split(X, y)",
          "learning_curve(estimator)",
        ],
        correctAnswer: "cross_val_score(estimator, X, y, cv=5)",
        explanation:
          "cross_val_score automates k-fold splits, fits the estimator, and returns an array of validation scores.",
      },
      associatedSkills: ["scikit-learn"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which pipeline component lets you search hyperparameters over a parameter grid?",
        options: [
          "GridSearchCV",
          "OneHotEncoder",
          "FeatureUnion",
          "SelectKBest",
        ],
        correctAnswer: "GridSearchCV",
        explanation:
          "GridSearchCV exhaustively evaluates combinations of hyperparameters using cross-validation.",
      },
      associatedSkills: ["scikit-learn"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which metric is appropriate for evaluating imbalanced binary classifiers?",
        options: ["ROC AUC", "Mean Absolute Error", "Explained Variance", "Davies–Bouldin index"],
        correctAnswer: "ROC AUC",
        explanation:
          "Area under the ROC curve summarizes true-positive vs false-positive rates and is robust to imbalance.",
      },
      associatedSkills: ["scikit-learn"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which utility stacks preprocessing steps and an estimator so the entire workflow can be tuned together?",
        options: ["Pipeline([...])", "ColumnTransformer([...])", "BaggingClassifier()", "VotingRegressor()"],
        correctAnswer: "Pipeline([...])",
        explanation:
          "Pipeline chains transformers and estimators, ensuring consistent fit/predict sequences and enabling joint hyperparameter tuning.",
      },
      associatedSkills: ["scikit-learn"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which technique helps prevent data leakage when scaling features before cross-validation?",
        options: [
          "Wrap the scaler and model inside a Pipeline",
          "Scale the entire dataset once before splitting",
          "Use StandardScaler with with_mean=False",
          "Increase max_iter of the estimator",
        ],
        correctAnswer: "Wrap the scaler and model inside a Pipeline",
        explanation:
          "Placing preprocessing inside a Pipeline ensures each fold fits scalers only on the training portion, preventing leakage.",
      },
      associatedSkills: ["scikit-learn"],
    },
  ],
};
