import { SkillSeedData } from "../../types.js";

export const tensorflowSeed: SkillSeedData = {
  skills: [
    {
      skillName: "TensorFlow",
      skillNormalized: "tensorflow",
      aliases: ["tensor flow"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which API builds models by stacking layers sequentially in TensorFlow Keras?",
        options: [
          "tf.keras.Sequential([...])",
          "tf.keras.Model.subclass()",
          "tf.data.Dataset",
          "tf.estimator.Estimator",
        ],
        correctAnswer: "tf.keras.Sequential([...])",
        explanation:
          "Sequential provides a linear stack of layers; it's the simplest way to define feedforward networks.",
      },
      associatedSkills: ["tensorflow"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which function compiles a Keras model with loss, optimizer, and metrics?",
        options: [
          "model.compile(loss='mse', optimizer='adam', metrics=['mae'])",
          "model.fit(...)",
          "model.summary()",
          "tf.keras.preprocessing()",
        ],
        correctAnswer: "model.compile(loss='mse', optimizer='adam', metrics=['mae'])",
        explanation:
          "compile configures the training step by setting loss, optimizers, and evaluation metrics.",
      },
      associatedSkills: ["tensorflow"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which TensorFlow object efficiently feeds batches from NumPy arrays?",
        options: [
          "tf.data.Dataset.from_tensor_slices((X, y))",
          "tf.constant(X)",
          "tf.keras.backend.variable(X)",
          "tf.io.TFRecordReader",
        ],
        correctAnswer: "tf.data.Dataset.from_tensor_slices((X, y))",
        explanation:
          "tf.data.Dataset provides scalable data pipelines; from_tensor_slices creates datasets from in-memory arrays.",
      },
      associatedSkills: ["tensorflow"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which optimizer is commonly used for deep learning due to adaptive learning rates?",
        options: [
          "tf.keras.optimizers.Adam",
          "tf.keras.optimizers.SGD(momentum=0)",
          "tf.keras.optimizers.Adadelta",
          "tf.keras.optimizers.RMSprop",
        ],
        correctAnswer: "tf.keras.optimizers.Adam",
        explanation:
          "Adam adapts learning rates using momentum and RMSProp ideas, making it a popular default optimizer.",
      },
      associatedSkills: ["tensorflow"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which method prints a summary of layers, output shapes, and parameters?",
        options: ["model.summary()", "model.plot()", "model.describe()", "model.inspect()"],
        correctAnswer: "model.summary()",
        explanation:
          "summary lists each layer, its output shape, and parameter counts—useful for sanity checks.",
      },
      associatedSkills: ["tensorflow"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which callback stops training when validation loss stops improving?",
        options: [
          "tf.keras.callbacks.EarlyStopping",
          "tf.keras.callbacks.ModelCheckpoint",
          "tf.keras.callbacks.TensorBoard",
          "tf.keras.callbacks.ReduceLROnPlateau",
        ],
        correctAnswer: "tf.keras.callbacks.EarlyStopping",
        explanation:
          "EarlyStopping monitors metrics and halts training when patience is exceeded, reducing overfitting.",
      },
      associatedSkills: ["tensorflow"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which dataset format does TensorFlow recommend for large-scale input pipelines?",
        options: [
          "TFRecord",
          "CSV",
          "JSON",
          "Excel XLSX",
        ],
        correctAnswer: "TFRecord",
        explanation:
          "TFRecord stores serialized tf.Example objects and integrates tightly with tf.data for scalable IO.",
      },
      associatedSkills: ["tensorflow"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which API is best for building custom training loops?",
        options: [
          "tf.GradientTape",
          "model.fit",
          "tf.keras.Sequential",
          "tf.saved_model.load",
        ],
        correctAnswer: "tf.GradientTape",
        explanation:
          "GradientTape records operations for automatic differentiation, enabling manual forward/backward loops.",
      },
      associatedSkills: ["tensorflow"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which strategy distributes training across multiple GPUs on one machine?",
        options: [
          "tf.distribute.MirroredStrategy()",
          "tf.distribute.TPUStrategy()",
          "tf.distribute.experimental.ParameterServerStrategy()",
          "tf.distribute.MultiWorkerMirroredStrategy()",
        ],
        correctAnswer: "tf.distribute.MirroredStrategy()",
        explanation:
          "MirroredStrategy mirrors model variables on each GPU and performs synchronous all-reduce updates.",
      },
      associatedSkills: ["tensorflow"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "How do you convert a trained Keras model to the SavedModel format for deployment?",
        options: [
          "model.save('path', save_format='tf')",
          "tf.saved_model.load('path')",
          "model.to_csv('path')",
          "tf.keras.utils.plot_model(model)",
        ],
        correctAnswer: "model.save('path', save_format='tf')",
        explanation:
          "Calling model.save with save_format='tf' exports a SavedModel directory that can be served or reloaded elsewhere.",
      },
      associatedSkills: ["tensorflow"],
    },
  ],
};
