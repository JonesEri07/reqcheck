import { Circle } from "lucide-react";

export interface SetupStep {
  id: string;
  title: string;
  icon: React.ReactNode;
  proOnly?: boolean;
  instructions: string[];
  docLink?: string;
  routeLink?: string;
}

export const setupSteps: SetupStep[] = [
  {
    id: "company-configuration",
    title: "Check and set company default configuration values",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Settings > Configuration",
      "Review Team Settings section",
      "Set default pass threshold and question count",
    ],
    routeLink: "/app/settings/configuration#team-settings",
    docLink: "/docs/settings",
  },
  {
    id: "whitelist-urls",
    title: "Setup whitelist URLs",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Settings > Configuration",
      "Navigate to Whitelist URLs section",
      "Add domains where the widget will be allowed",
    ],
    routeLink: "/app/settings/web#whitelist-urls",
    docLink: "/docs/settings",
  },
  {
    id: "api-token",
    title: "Generate API key",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Settings > Configuration",
      "Navigate to API Keys section",
      "Click 'Generate New Token' and copy securely",
    ],
    routeLink: "/app/settings/web#api-keys",
    docLink: "/docs/api",
  },
  {
    id: "add-skills",
    title: "Add skills to their library that they hire for",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Navigate to Skills Library",
      "Browse or search for skills you hire for",
      "Add skills to your library",
    ],
    routeLink: "/app/skills",
    docLink: "/docs/skills-challenges",
  },
  {
    id: "customize-challenge",
    title: "Customize a challenge question (any)",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Skills Library",
      "Select a skill you added",
      "Click on any question to customize it",
    ],
    routeLink: "/app/skills",
    docLink: "/docs/skills-challenges",
  },
  {
    id: "custom-challenge",
    title: "Create a custom challenge question",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Skills Library",
      "Select a skill",
      "Click 'Create Custom Question'",
      "Configure your custom question",
    ],
    routeLink: "/app/skills",
    docLink: "/docs/skills-challenges",
  },
  {
    id: "add-job",
    title: "Add new job",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Navigate to Jobs",
      "Click 'Create Job'",
      "Fill in job details and select skills",
    ],
    routeLink: "/app/jobs",
    docLink: "/docs/jobs",
  },
  {
    id: "integrate-ats",
    title: "Setup integrations",
    icon: <Circle className="h-4 w-4" />,
    proOnly: true,
    instructions: [
      "Go to Integrations",
      "Connect your ATS (Greenhouse, Lever, Ashby, etc.)",
      "Configure sync settings",
    ],
    routeLink: "/app/integrations",
    docLink: "/docs/integrations",
  },
  {
    id: "widget-code",
    title: "Get widget integration code",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Go to Widget Integration (sidebar navigation)",
      "Follow the interactive decision tree",
      "Copy your personalized integration code",
    ],
    routeLink: "/app/widget-integration",
    docLink: "/docs/widget-integration",
  },
  {
    id: "verify-widget",
    title: "Verify widget shows up",
    icon: <Circle className="h-4 w-4" />,
    instructions: [
      "Visit your job posting page",
      "Verify the widget loads correctly",
      "Test the verification flow",
    ],
  },
];
