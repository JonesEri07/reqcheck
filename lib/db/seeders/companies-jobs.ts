// Seed data for jobs
// Jobs will have descriptions that can be used for skill detection
// All jobs will be seeded to the organization specified in SEED_ORGANIZATION_ID

export interface JobSeedData {
  externalJobId: string;
  title: string;
  description: string;
  status: "open" | "draft" | "archived";
}

export const testJobs: JobSeedData[] = [
  {
    externalJobId: "job_001",
    title: "Senior Software Engineer",
    description: `We are looking for a Senior Software Engineer to join our team. 
    
Requirements:
- 5+ years of experience with JavaScript, TypeScript, and React
- Strong experience with Node.js and REST APIs
- Knowledge of PostgreSQL and SQL
- Experience with AWS cloud services
- Familiarity with Docker and CI/CD pipelines
- Strong problem-solving skills and ability to work in an agile environment

You will be working on our core product platform, building scalable backend services and modern frontend applications.`,
    status: "open",
  },
  {
    externalJobId: "job_002",
    title: "Data Analyst",
    description: `Join our data team as a Data Analyst!

We need someone with:
- Experience with SQL and data analysis
- Knowledge of Python for data processing
- Experience with Tableau or similar visualization tools
- Understanding of statistics and data modeling
- Ability to create dashboards and reports
- Experience with ETL processes

You'll be analyzing customer data, creating reports, and helping drive data-driven decisions.`,
    status: "open",
  },
  {
    externalJobId: "job_003",
    title: "Full Stack Developer",
    description: `Full Stack Developer position at a fast-growing startup.

Skills needed:
- React and JavaScript/TypeScript
- Python or Node.js for backend development
- Experience with databases (PostgreSQL preferred)
- Git version control
- REST API design and development
- Testing experience (unit and integration tests)

We're building a modern SaaS platform and need someone who can work across the stack.`,
    status: "open",
  },
  {
    externalJobId: "job_004",
    title: "Product Manager",
    description: `Product Manager role focusing on product strategy and roadmap.

Requirements:
- Experience with agile methodologies (Scrum, Kanban)
- Strong product strategy skills
- Experience with Jira and product management tools
- Ability to write user stories and manage backlogs
- Stakeholder management experience
- Experience with MVP development and product launches

You'll work closely with engineering, design, and business teams to define and deliver product features.`,
    status: "open",
  },
];
