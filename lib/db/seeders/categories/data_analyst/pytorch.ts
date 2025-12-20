import { SkillSeedData } from "../../types";

export const pytorchSeed: SkillSeedData = {
  skills: [
    {
      skillName: "PyTorch",
      skillNormalized: "pytorch",
      aliases: ["pytorch"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which import brings PyTorch tensors into a script?",
        options: ["import torch", "import pytorch as torch", "from torch import keras", "import tensorflow as torch"],
        correctAnswer: "import torch",
        explanation:
          "PyTorch is accessed via the torch package, which exposes tensors, nn modules, optimizers, etc.",
      },
      associatedSkills: ["pytorch"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which object stores learnable layers in PyTorch?",
        options: [
          "torch.nn.Module subclass",
          "torch.Tensor",
          "torch.optim.Optimizer",
          "torch.utils.data.Dataset",
        ],
        correctAnswer: "torch.nn.Module subclass",
        explanation:
          "Models inherit from nn.Module, defining layers in __init__ and forward logic in forward().",
      },
      associatedSkills: ["pytorch"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which API automatically tracks gradients during forward passes?",
        options: [
          "torch.autograd",
          "torch.no_grad",
          "torch.export",
          "torch.compile",
        ],
        correctAnswer: "torch.autograd",
        explanation:
          "autograd records operations on tensors with requires_grad=True to compute gradients via backprop.",
      },
      associatedSkills: ["pytorch"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which object iterates mini-batches from a Dataset?",
        options: [
          "torch.utils.data.DataLoader",
          "torch.optim.DataLoader",
          "torch.batch.Manager",
          "torch.nn.Sequencer",
        ],
        correctAnswer: "torch.utils.data.DataLoader",
        explanation:
          "DataLoader wraps a Dataset and provides batched, optionally shuffled iterators.",
      },
      associatedSkills: ["pytorch"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which device string moves tensors to GPU when available?",
        options: ["device = torch.device('cuda')", "device = 'gpu0'", "device = torch.gpu()", "device='nvidia'"],
        correctAnswer: "device = torch.device('cuda')",
        explanation:
          "Creating tensors/modules on torch.device('cuda') copies them to GPU memory if CUDA is available.",
      },
      associatedSkills: ["pytorch"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which optimizer updates parameters using adaptive learning rates?",
        options: [
          "torch.optim.Adam",
          "torch.optim.SGD(lr=0.01)",
          "torch.optim.Adagrad",
          "torch.optim.LBFGS",
        ],
        correctAnswer: "torch.optim.Adam",
        explanation:
          "Adam is widely used for deep nets thanks to adaptive step sizes and momentum.",
      },
      associatedSkills: ["pytorch"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which context disables gradient tracking during evaluation?",
        options: [
          "with torch.no_grad():",
          "with torch.grad():",
          "with torch.autocast():",
          "with torch.compile():",
        ],
        correctAnswer: "with torch.no_grad():",
        explanation:
          "torch.no_grad reduces memory usage by preventing autograd from storing history during inference.",
      },
      associatedSkills: ["pytorch"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which module provides common convolution, pooling, and activation layers?",
        options: [
          "torch.nn",
          "torch.fx",
          "torch.distributed",
          "torchviz",
        ],
        correctAnswer: "torch.nn",
        explanation:
          "torch.nn contains layer classes (Conv2d, Linear, ReLU, etc.) used in Module definitions.",
      },
      associatedSkills: ["pytorch"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which utility exports a trained PyTorch model for deployment in other runtimes?",
        options: [
          "torch.onnx.export(model, sample_input, 'model.onnx')",
          "torch.save(model, 'model.sql')",
          "torch.nn.utils.model_to_tf(model)",
          "torch.compile(model)",
        ],
        correctAnswer: "torch.onnx.export(model, sample_input, 'model.onnx')",
        explanation:
          "Exporting to ONNX enables running the model in ONNX Runtime, TensorRT, or other inference engines.",
      },
      associatedSkills: ["pytorch"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which distributed utility replicates a model across GPUs to enable data-parallel training?",
        options: [
          "torch.nn.parallel.DistributedDataParallel",
          "torch.multiprocessing.Queue",
          "torchtext.distribute",
          "torch.nn.DataParallelCPU",
        ],
        correctAnswer: "torch.nn.parallel.DistributedDataParallel",
        explanation:
          "DistributedDataParallel is the recommended approach for multi-GPU training—it synchronizes gradients efficiently.",
      },
      associatedSkills: ["pytorch"],
    },
  ],
};
