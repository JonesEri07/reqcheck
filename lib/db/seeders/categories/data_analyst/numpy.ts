import { SkillSeedData } from "../../types.js";

export const numpySeed: SkillSeedData = {
  skills: [
    {
      skillName: "NumPy",
      skillNormalized: "numpy",
      aliases: ["numpy"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which import statement brings NumPy into a script with the standard alias?",
        options: [
          "import numpy as np",
          "import numpy as num",
          "from numpy import pandas",
          "import np as numpy",
        ],
        correctAnswer: "import numpy as np",
        explanation:
          "The conventional alias is np, so most documentation assumes import numpy as np.",
      },
      associatedSkills: ["numpy"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you create a NumPy array from a Python list?",
        options: [
          "np.array([1, 2, 3])",
          "np.list([1, 2, 3])",
          "np.frame([1, 2, 3])",
          "np.dict([1, 2, 3])",
        ],
        correctAnswer: "np.array([1, 2, 3])",
        explanation:
          "np.array converts sequences (lists, tuples) into NumPy arrays.",
      },
      associatedSkills: ["numpy"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which attribute returns the shape of an array?",
        options: ["arr.shape", "arr.size", "arr.dtype", "arr.index"],
        correctAnswer: "arr.shape",
        explanation:
          "The shape attribute is a tuple describing the dimensions (rows, columns, ...).",
      },
      associatedSkills: ["numpy"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function creates an array filled with zeros?",
        options: ["np.zeros((2,2))", "np.empty([2])", "np.ones(0)", "np.zero_array()"],
        correctAnswer: "np.zeros((2,2))",
        explanation:
          "np.zeros takes a shape tuple and fills the array with floating-point zeros by default.",
      },
      associatedSkills: ["numpy"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "How do you compute the element-wise sum of two arrays a and b?",
        options: ["np.add(a, b)", "a.sum(b)", "np.total(a, b)", "sum(a, b)"],
        correctAnswer: "np.add(a, b)",
        explanation:
          "np.add performs vectorized addition and is equivalent to a + b when arrays share a compatible shape.",
      },
      associatedSkills: ["numpy"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which NumPy concept lets you operate on arrays of different shapes by expanding dimensions?",
        options: ["Broadcasting", "Vectorization", "Transposition", "Concatenation"],
        correctAnswer: "Broadcasting",
        explanation:
          "Broadcasting automatically stretches dimensions of size 1 to match the other operand when rules allow.",
      },
      associatedSkills: ["numpy"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "What does arr.reshape(2, 3) do?",
        options: [
          "Returns a view of arr with shape (2, 3) if compatible",
          "Sorts the array",
          "Converts arr to a list",
          "Removes NaN values",
        ],
        correctAnswer: "Returns a view of arr with shape (2, 3) if compatible",
        explanation:
          "reshape changes how the data are interpreted without copying when possible.",
      },
      associatedSkills: ["numpy"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which function stacks arrays vertically (row-wise)?",
        options: ["np.vstack([a, b])", "np.hstack([a, b])", "np.concatenate([a, b], axis=1)", "np.stack([a, b], axis=2)"],
        correctAnswer: "np.vstack([a, b])",
        explanation:
          "vstack stacks arrays along the first axis (rows), while hstack stacks along columns.",
      },
      associatedSkills: ["numpy"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which function computes the matrix product of two 2D arrays respecting linear algebra rules?",
        options: ["np.matmul(A, B)", "np.multiply(A, B)", "np.dot(A, B.T)", "A * B"],
        correctAnswer: "np.matmul(A, B)",
        explanation:
          "np.matmul (or the @ operator) performs matrix multiplication, respecting inner dimensions and broadcasting for stacks.",
      },
      associatedSkills: ["numpy"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which method ensures an array uses 32-bit floating point precision?",
        options: [
          "arr.astype(np.float32)",
          "arr.setdtype('float32')",
          "np.float32(arr.shape)",
          "arr.float32()",
        ],
        correctAnswer: "arr.astype(np.float32)",
        explanation:
          "astype returns a copy of the array with the requested dtype, which is useful for memory control.",
      },
      associatedSkills: ["numpy"],
    },
  ],
};
