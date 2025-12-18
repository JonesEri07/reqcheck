import { SkillSeedData } from "../../types.js";

export const azureSeed: SkillSeedData = {
  skills: [
    {
      skillName: "Azure",
      skillNormalized: "azure",
      aliases: ["microsoft azure", "azure cloud"],
    },
  ],
  questions: [
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which CLI command logs you into Azure interactively?",
        options: ["az login", "az account set", "az configure", "az ad sp create"],
        correctAnswer: "az login",
        explanation:
          "az login authenticates the CLI session using browser/device code flow.",
      },
      associatedSkills: ["azure"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which Azure service hosts Linux or Windows VMs?",
        options: ["Azure Virtual Machines", "Azure Functions", "Azure DevOps", "Azure CDN"],
        correctAnswer: "Azure Virtual Machines",
        explanation:
          "Azure Virtual Machines provide IaaS compute for running custom OS images and applications.",
      },
      associatedSkills: ["azure"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which storage option delivers object/blob storage?",
        options: [
          "Azure Blob Storage",
          "Azure Queue Storage",
          "Azure Table Storage",
          "Azure Disk Storage",
        ],
        correctAnswer: "Azure Blob Storage",
        explanation:
          "Blob Storage handles unstructured objects, offering hot/cool/archive tiers.",
      },
      associatedSkills: ["azure"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which managed PaaS service runs containerized web apps without managing servers?",
        options: [
          "Azure App Service",
          "Azure Kubernetes Service",
          "Azure Batch",
          "Azure Container Registry",
        ],
        correctAnswer: "Azure App Service",
        explanation:
          "App Service hosts web apps/APIs with integrated CI/CD, scaling, and SSL.",
      },
      associatedSkills: ["azure"],
    },
    {
      difficulty: "easy",
      question: {
        type: "multiple_choice",
        question: "Which identity service issues tokens for Azure resources?",
        options: [
          "Azure Active Directory (Azure AD)",
          "Azure Monitor",
          "Azure Policy",
          "Azure Advisor",
        ],
        correctAnswer: "Azure Active Directory (Azure AD)",
        explanation:
          "Azure AD handles authentication (users, service principals, managed identities) for Azure resources.",
      },
      associatedSkills: ["azure"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which command deploys infrastructure defined in an ARM/Bicep template?",
        options: [
          "az deployment group create",
          "az group create",
          "az resource list",
          "az aks create",
        ],
        correctAnswer: "az deployment group create",
        explanation:
          "az deployment group create applies a template to a resource group, creating or updating resources declaratively.",
      },
      associatedSkills: ["azure"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which service offers managed Kubernetes control plane in Azure?",
        options: [
          "Azure Kubernetes Service (AKS)",
          "Azure Container Instances",
          "Azure Service Fabric",
          "Azure Batch",
        ],
        correctAnswer: "Azure Kubernetes Service (AKS)",
        explanation:
          "AKS provisions worker nodes, integrates with Azure AD, and offloads control-plane management to Microsoft.",
      },
      associatedSkills: ["azure"],
    },
    {
      difficulty: "medium",
      question: {
        type: "multiple_choice",
        question: "Which managed database provides globally distributed NoSQL with tunable throughput?",
        options: [
          "Azure Cosmos DB",
          "Azure SQL Database",
          "Azure Database for PostgreSQL",
          "Azure Synapse Analytics",
        ],
        correctAnswer: "Azure Cosmos DB",
        explanation:
          "Cosmos DB offers multiple APIs (SQL, MongoDB, Cassandra) with multi-region replication and throughput control.",
      },
      associatedSkills: ["azure"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which policy service enforces organization-wide guardrails like allowed SKUs or regions?",
        options: ["Azure Policy", "Azure Advisor", "Azure Sentinel", "Azure Migrate"],
        correctAnswer: "Azure Policy",
        explanation:
          "Azure Policy evaluates resources for compliance and can deny deployments that violate rules.",
      },
      associatedSkills: ["azure"],
    },
    {
      difficulty: "hard",
      question: {
        type: "multiple_choice",
        question: "Which feature manages secrets/keys/certificates for apps without storing them in code?",
        options: [
          "Azure Key Vault",
          "Azure Monitor",
          "Azure Blueprints",
          "Azure CDN",
        ],
        correctAnswer: "Azure Key Vault",
        explanation:
          "Key Vault provides secure storage and RBAC/managed identity integration so apps can fetch secrets at runtime.",
      },
      associatedSkills: ["azure"],
    },
  ],
};
