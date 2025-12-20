import { SkillSeedData } from "../../types";

export const cloudformationSeed: SkillSeedData = {
  skills: [
    {
      skillName: "CloudFormation",
      skillNormalized: "cloudformation",
      aliases: ["aws cloudformation"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which template section declares user-supplied values such as InstanceType?",
        options: ["Parameters", "Resources", "Mappings", "Outputs"],
        correctAnswer: "Parameters",
        explanation:
          "Parameters make templates reusable by letting callers pass values at stack creation time.",
      },
      associatedSkills: ["cloudformation"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "What is the minimum required section in every CloudFormation template?",
        options: ["Resources", "Parameters", "Mappings", "Conditions"],
        correctAnswer: "Resources",
        explanation:
          "Only Resources is mandatory; templates without resources do nothing and fail validation.",
      },
      associatedSkills: ["cloudformation"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which intrinsic function substitutes variable values inside a string?",
        options: ["Fn::Sub", "Fn::GetAtt", "Fn::Join", "Ref"],
        correctAnswer: "Fn::Sub",
        explanation:
          "Fn::Sub expands ${VarName} placeholders using parameter, resource, or mapping values.",
      },
      associatedSkills: ["cloudformation"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which feature lets you preview stack updates before execution?",
        options: ["Change sets", "Stack sets", "Drift detection", "Exports"],
        correctAnswer: "Change sets",
        explanation:
          "Change sets show the proposed resource modifications before you execute the update.",
      },
      associatedSkills: ["cloudformation"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Where do you declare values that other stacks can import?",
        options: ["Outputs with Export", "Mappings", "Conditions", "Metadata"],
        correctAnswer: "Outputs with Export",
        explanation:
          "Outputs optionally include Export: Name, enabling Fn::ImportValue from other stacks.",
      },
      associatedSkills: ["cloudformation"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which resource type would you include to deploy another template as part of your stack?",
        options: ["AWS::CloudFormation::Stack", "AWS::CloudFormation::Macro", "AWS::Lambda::Function", "AWS::CDK::App"],
        correctAnswer: "AWS::CloudFormation::Stack",
        explanation:
          "AWS::CloudFormation::Stack resources create nested stacks, allowing modular template composition.",
      },
      associatedSkills: ["cloudformation"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question:
          "Which built-in condition function checks whether a parameter equals a specific value?",
        options: ["Fn::Equals", "Fn::If", "Fn::And", "Fn::Not"],
        correctAnswer: "Fn::Equals",
        explanation:
          "Fn::Equals compares two values and returns true/false so you can gate resources via Conditions.",
      },
      associatedSkills: ["cloudformation"],
    },
    {
      difficulty: "medium",
      question: {
        type: "fill_blank_blocks",
        question: "Complete the YAML snippet that looks up an AMI ID per region:",
        segments: [
          { text: "Mappings:\n  AmiMap:\n    us-east-1:\n      HVM: ami-0123\nResources:\n  Ec2:\n    Type: AWS::EC2::Instance\n    Properties:\n      ImageId: ", block: false },
          { text: "Fn::FindInMap", block: true },
          { text: ": [AmiMap, ", block: false },
          { text: "Ref", block: true },
          { text: ": \"AWS::Region\", HVM]", block: false },
        ],
        blocks: ["Fn::FindInMap", "Fn::GetAtt", "Ref", "Fn::ImportValue"],
        correctAnswer: ["Fn::FindInMap", "Ref"],
        explanation:
          "FindInMap retrieves a value from Mappings; Ref \"AWS::Region\" passes the current region key.",
      },
      associatedSkills: ["cloudformation"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "You must deploy identical stacks across multiple accounts and regions from a central admin account. Which feature is designed for this?",
        options: [
          "StackSets with delegated administrator",
          "Nested stacks",
          "Change sets",
          "CloudFormation macros",
        ],
        correctAnswer: "StackSets with delegated administrator",
        explanation:
          "StackSets orchestrate stack instances across accounts/regions, optionally via delegated administrators in AWS Organizations.",
      },
      associatedSkills: ["cloudformation"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question:
          "Drift detection reports unmanaged changes to a stack. Which states allow you to detect drift?",
        options: [
          "Only for UPDATE_COMPLETE stacks",
          "Any stack except DELETE_IN_PROGRESS",
          "Only CREATE_COMPLETE stacks",
          "Only stacks created in the last 24h",
        ],
        correctAnswer: "Any stack except DELETE_IN_PROGRESS",
        explanation:
          "Drift detection can run on most active stacks; the limitation is stacks being deleted or rolled back.",
      },
      associatedSkills: ["cloudformation"],
    },
  ],
};
