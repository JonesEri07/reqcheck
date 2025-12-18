# reqCHECK Architecture & Organization Guide

## Purpose

This document defines the architectural patterns, organizational principles, and coding standards for rebuilding reqCHECK. It focuses on **structure, flow, and organization** while leaving implementation details open for optimization.

**Goal**: Ensure the rebuilt codebase is maintainable, scalable, modular, and follows industry best practices.

---

## Table of Contents

1. [Architectural Principles](#architectural-principles)
2. [Monorepo Structure](#monorepo-structure)
3. [Application Architecture](#application-architecture)
4. [File Organization Standards](#file-organization-standards)
5. [Module Boundaries & Separation of Concerns](#module-boundaries--separation-of-concerns)
6. [Extension Points](#extension-points)
7. [Code Organization Patterns](#code-organization-patterns)
8. [Data Flow & State Management](#data-flow--state-management)
9. [API Design Patterns](#api-design-patterns)
10. [Testing Organization](#testing-organization)

---

## Architectural Principles

### 1. Separation of Concerns

- **UI Layer**: React components handle presentation only
- **Business Logic**: Server actions, API routes, and service functions
- **Data Layer**: Prisma models and database queries
- **Integration Layer**: External service clients (Stripe, S3, ATS)

### 2. Modularity

- Each feature should be self-contained with clear boundaries
- Shared code lives in packages, not duplicated
- Dependencies flow downward (app → packages, not vice versa)

### 3. Extensibility

- New features should integrate without modifying core
- Plugin-like architecture for integrations (ATS, payment providers)
- Question types should be easily extensible
- Widget modes should be easily addable

### 4. Type Safety

- TypeScript throughout (no `any` types)
- Shared types in packages where appropriate
- API contracts defined with types
- Database schema drives types (Prisma)

### 5. Performance First

- Server Components by default, Client Components when needed
- Lazy loading for heavy components
- Optimistic UI updates where appropriate
- Efficient data fetching (avoid over-fetching)

### 6. Developer Experience

- Clear file organization (easy to find code)
- Consistent naming conventions
- Comprehensive error handling
- Helpful error messages

---

## Monorepo Structure

### Package Organization

```
reqcheck-v2/
├── apps/
│   ├── web/              # Next.js dashboard + marketing
│   └── widget/           # Embeddable React widget
├── packages/
│   ├── database/         # Prisma schema + client
│   ├── ui/               # Shared UI components (shadcn/ui)
│   ├── utils/            # Shared utilities
│   ├── types/            # Shared TypeScript types
│   ├── eslint-config/    # Shared ESLint config
│   └── typescript-config/# Shared TS config
└── [root config files]
```

### Package Dependencies

**Dependency Flow** (no circular dependencies):

```
apps/web ──┐
           ├──→ packages/ui
           ├──→ packages/database
           └──→ packages/utils

apps/widget ──┐
              ├──→ packages/ui
              └──→ packages/utils

packages/ui ──→ packages/utils
packages/database ──→ (external: Prisma)
```

**Rules**:

- Apps can depend on packages, never vice versa
- Packages can depend on other packages (downward only)
- Shared business logic → `packages/utils`
- Shared UI → `packages/ui`
- Database access → `packages/database`

---

## Application Architecture

### apps/web Architecture

#### Route Organization (Next.js App Router)

```
app/
├── (public)/              # Public routes (no auth)
│   ├── layout.tsx         # Public layout
│   ├── page.tsx          # Landing page
│   └── [feature]/        # Feature routes
│
├── app/                  # Protected routes
│   ├── (protected)/      # Main app (auth required)
│   │   ├── layout.tsx    # App layout (sidebar, header)
│   │   ├── page.tsx      # App home
│   │   └── [feature]/    # Feature routes
│   │
│   └── onboarding/       # Onboarding (separate layout)
│       └── page.tsx
│
└── api/                  # API routes
    └── v1/               # Versioned API
        └── [endpoint]/
```

#### Layout Hierarchy

1. **Root Layout** (`app/layout.tsx`)
   - Providers (theme, auth)
   - Fonts
   - Global styles

2. **Public Layout** (`app/(public)/layout.tsx`)
   - Public header/footer
   - No auth required

3. **App Layout** (`app/app/(protected)/layout.tsx`)
   - Sidebar navigation
   - Header with user menu
   - Auth required

4. **Feature Layouts** (as needed)
   - Feature-specific navigation
   - Feature-specific providers

### apps/widget Architecture

#### Module Organization

```
src/
├── core/                 # Core widget logic
│   └── widget.tsx       # Main orchestrator
│
├── modes/                # Widget mode implementations
│   ├── protect.tsx
│   ├── gate.tsx
│   └── inline.tsx
│
├── components/           # Reusable components
│   ├── challenge-flow.tsx
│   ├── question-renderer.tsx
│   └── result-display.tsx
│
├── api/                 # API client
│   └── client.ts
│
├── utils/               # Utilities
│   └── session.ts
│
└── index.tsx            # Entry point
```

#### Component Hierarchy

```
Widget (core/widget.tsx)
  └── Mode Component (modes/[mode].tsx)
      └── ChallengeFlow (components/challenge-flow.tsx)
          └── QuestionRenderer (components/question-renderer.tsx)
          └── ResultDisplay (components/result-display.tsx)
```

---

## File Organization Standards

### Naming Conventions

#### Files

- **Components**: PascalCase (`UserProfile.tsx`, `JobCard.tsx`)
- **Utilities**: camelCase (`formatDate.ts`, `validateEmail.ts`)
- **Types**: PascalCase (`User.ts`, `JobConfig.ts`)
- **Constants**: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`, `MAX_RETRIES.ts`)
- **Hooks**: camelCase with `use` prefix (`useAuth.ts`, `useJobData.ts`)
- **Server Actions**: camelCase (`createJob.ts`, `updateSettings.ts`)

#### Directories

- **Feature-based**: kebab-case (`job-management/`, `skills-library/`)
- **Component groups**: kebab-case (`challenge-question/`, `global-skills-library/`)
- **Utilities**: singular (`utils/`, `hooks/`, `lib/`)

### Directory Structure Patterns

#### Feature Route Pattern

```
app/app/(protected)/jobs/
├── page.tsx                    # List page
├── layout.tsx                  # Feature layout (optional)
├── [id]/
│   ├── page.tsx               # Detail page
│   └── edit/
│       └── page.tsx           # Edit page
├── create/
│   └── page.tsx               # Create page
├── _components/                # Feature-specific components
│   ├── jobs-table.tsx
│   └── job-card.tsx
└── actions.ts                  # Server actions
```

#### Component Group Pattern

```
components/challenge-question/
├── index.ts                    # Public exports
├── types.ts                    # Component-specific types
├── constants.ts                # Component constants
├── question-form.tsx           # Main component
├── question-preview.tsx        # Sub-component
└── _components/                # Internal sub-components
    └── answer-input.tsx
```

#### API Route Pattern

```
app/api/v1/widget/
├── config/
│   └── route.ts               # GET /api/v1/widget/config
├── questions/
│   └── route.ts               # GET /api/v1/widget/questions
└── attempts/
    ├── start/
    │   └── route.ts           # POST /api/v1/widget/attempts/start
    ├── submit/
    │   └── route.ts           # POST /api/v1/widget/attempts/submit
    └── status/
        └── route.ts           # GET /api/v1/widget/attempts/status
```

### File Organization Rules

1. **Co-location**: Related files stay together
   - Component + types + constants in same directory
   - Server action + validation schema together

2. **Barrel Exports**: Use `index.ts` for clean imports

   ```typescript
   // components/challenge-question/index.ts
   export { QuestionForm } from "./question-form";
   export { QuestionPreview } from "./question-preview";
   export type { QuestionFormProps } from "./types";
   ```

3. **Private Files**: Prefix with `_` for internal files
   - `_components/` - Internal sub-components
   - `_utils.ts` - Internal utilities
   - `_types.ts` - Internal types

4. **Separation by Concern**:
   - `actions.ts` - Server actions
   - `queries.ts` - Data fetching functions
   - `mutations.ts` - Data mutation functions
   - `validations.ts` - Validation schemas (Zod)

---

## Module Boundaries & Separation of Concerns

### Layer Boundaries

#### 1. Presentation Layer

**Location**: `components/`, `app/**/page.tsx`
**Responsibility**:

- Render UI
- Handle user interactions
- Display data
- Form validation (client-side)

**Should NOT**:

- Direct database access
- Business logic
- External API calls (except widget API)

#### 2. Application Layer

**Location**: `app/**/actions.ts`, `lib/**/`
**Responsibility**:

- Business logic
- Data transformation
- Validation (server-side)
- Orchestration

**Should NOT**:

- Direct database queries (use data layer)
- UI rendering
- External service implementation details

#### 3. Data Layer

**Location**: `packages/database/`, `lib/**/queries.ts`
**Responsibility**:

- Database queries
- Data access patterns
- Query optimization

**Should NOT**:

- Business logic
- UI concerns
- External service calls

#### 4. Integration Layer

**Location**: `lib/**/integrations/`, `lib/**/services/`
**Responsibility**:

- External service clients
- API integrations
- Third-party SDKs

**Should NOT**:

- Business logic (delegate to application layer)
- Database access
- UI concerns

### Module Communication Rules

```
Presentation → Application → Data → Database
     ↓              ↓
  Widget API    External Services
```

**Rules**:

- Presentation calls Application layer functions
- Application layer calls Data layer functions
- Data layer uses Prisma client
- Integration layer is called by Application layer
- No skipping layers (e.g., Presentation → Data is forbidden)

### Feature Modules

Each feature should be self-contained:

```
feature-name/
├── components/          # Feature UI components
├── lib/                 # Feature business logic
│   ├── queries.ts       # Data fetching
│   ├── mutations.ts    # Data mutations
│   └── validations.ts  # Validation schemas
├── types.ts            # Feature types
└── constants.ts        # Feature constants
```

**Dependencies**:

- Can import from shared packages
- Can import from other features (sparingly)
- Should not create circular dependencies

---

## Extension Points

### 1. Question Types

**Location**: `components/challenge-question/question-types/`

**Pattern**:

```typescript
// question-types/base.ts
export interface QuestionType {
  name: string;
  render: (props: RenderProps) => React.ReactNode;
  validate: (answer: unknown) => boolean;
}

// question-types/multiple-choice.ts
export const MultipleChoiceType: QuestionType = {
  name: 'multiple_choice',
  render: (props) => <MultipleChoiceRenderer {...props} />,
  validate: (answer) => typeof answer === 'string',
};

// question-types/registry.ts
export const questionTypeRegistry = new Map<string, QuestionType>([
  ['multiple_choice', MultipleChoiceType],
  ['fill_blank_blocks', FillBlankType],
]);
```

**Adding New Type**:

1. Create type implementation in `question-types/`
2. Register in `registry.ts`
3. Update types in `types.ts`
4. Add to database schema if needed

### 2. Widget Modes

**Location**: `apps/widget/src/modes/`

**Pattern**:

```typescript
// modes/base.ts
export interface WidgetMode {
  name: string;
  detect: (element: HTMLElement) => boolean;
  render: (props: ModeProps) => React.ReactNode;
}

// modes/registry.ts
export const modeRegistry = new Map<string, WidgetMode>([
  ["protect", ProtectMode],
  ["gate", GateMode],
  ["inline", InlineMode],
]);
```

**Adding New Mode**:

1. Create mode implementation in `modes/`
2. Register in `registry.ts`
3. Update widget core to use registry

### 3. ATS Integrations

**Location**: `lib/integrations/ats/`

**Pattern**:

```typescript
// integrations/ats/base.ts
export interface ATSIntegration {
  name: string;
  syncJobs: (config: IntegrationConfig) => Promise<Job[]>;
  validateConfig: (config: unknown) => boolean;
}

// integrations/ats/registry.ts
export const atsRegistry = new Map<string, ATSIntegration>([
  ["greenhouse", GreenhouseIntegration],
  // Future: ['lever', LeverIntegration],
]);
```

**Adding New Integration**:

1. Create integration in `integrations/ats/`
2. Register in `registry.ts`
3. Add UI in `app/app/(protected)/integrations/`
4. Add database fields if needed

### 4. Payment Providers

**Location**: `lib/integrations/payments/`

**Pattern**: Similar to ATS integrations

- Base interface
- Provider implementations
- Registry pattern

### 5. Notification Channels

**Location**: `lib/notifications/channels/`

**Pattern**: Similar registry pattern for email, SMS, webhooks, etc.

---

## Code Organization Patterns

### 1. Server Actions Pattern

**Location**: `app/**/actions.ts`

**Structure**:

```typescript
// actions.ts
"use server";

import { z } from "zod";
import { prisma } from "@reqcheck/db";
import { requireAuth } from "@/lib/auth";
import { createJobSchema } from "./validations";

export async function createJob(input: z.infer<typeof createJobSchema>) {
  // 1. Auth check
  const { user, company } = await requireAuth();

  // 2. Validation
  const validated = createJobSchema.parse(input);

  // 3. Business logic
  const job = await prisma.job.create({
    data: {
      ...validated,
      companyId: company.id,
    },
  });

  // 4. Return result
  return { success: true, job };
}
```

**Rules**:

- All server actions in `actions.ts` files
- Use Zod for validation
- Always check auth
- Return consistent response shapes
- Handle errors gracefully

### 2. Data Fetching Pattern

**Location**: `lib/**/queries.ts` or `app/**/page.tsx` (Server Components)

**Structure**:

```typescript
// lib/jobs/queries.ts
import { prisma } from '@reqcheck/db';

export async function getJobsForCompany(companyId: string) {
  return prisma.job.findMany({
    where: { companyId },
    include: {
      jobSkills: {
        include: { clientSkill: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });
}

// app/app/(protected)/jobs/page.tsx
import { getJobsForCompany } from '@/lib/jobs/queries';

export default async function JobsPage() {
  const { company } = await requireAuth();
  const jobs = await getJobsForCompany(company.id);

  return <JobsTable jobs={jobs} />;
}
```

**Rules**:

- Queries in `lib/**/queries.ts`
- Use in Server Components or Server Actions
- Include related data efficiently
- Use Prisma select/include wisely

### 3. Component Composition Pattern

**Structure**:

```typescript
// components/job-card.tsx
export function JobCard({ job }: { job: Job }) {
  return (
    <Card>
      <JobCardHeader job={job} />
      <JobCardBody job={job} />
      <JobCardActions job={job} />
    </Card>
  );
}

// components/job-card/_components/header.tsx
export function JobCardHeader({ job }: { job: Job }) {
  return (
    <CardHeader>
      <JobTitle job={job} />
      <JobStatusBadge status={job.status} />
    </CardHeader>
  );
}
```

**Rules**:

- Compose complex components from smaller ones
- Keep components focused (single responsibility)
- Use `_components/` for internal sub-components
- Export main component, keep internals private

### 4. Form Handling Pattern

**Structure**:

```typescript
// app/app/(protected)/jobs/create/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createJobSchema } from '../validations';
import { createJob } from '../actions';

export function CreateJobForm() {
  const form = useForm({
    resolver: zodResolver(createJobSchema),
  });

  const handleSubmit = async (data: FormData) => {
    const result = await createJob(data);
    if (result.success) {
      router.push(`/app/jobs/${result.job.id}`);
    }
  };

  return <Form onSubmit={handleSubmit}>...</Form>;
}
```

**Rules**:

- Use react-hook-form for complex forms
- Validate with Zod schemas
- Server actions for submission
- Optimistic UI where appropriate

### 5. Error Handling Pattern

**Structure**:

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500
  ) {
    super(message);
  }
}

// lib/jobs/actions.ts
export async function createJob(input: CreateJobInput) {
  try {
    // ... logic
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError("Failed to create job", "JOB_CREATE_FAILED", 500);
  }
}

// app/app/(protected)/jobs/create/page.tsx
export function CreateJobForm() {
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (data: FormData) => {
    try {
      await createJob(data);
    } catch (error) {
      setError(error instanceof AppError ? error.message : "An error occurred");
    }
  };
}
```

**Rules**:

- Custom error classes for different error types
- Consistent error response shapes
- User-friendly error messages
- Log errors server-side

---

## Data Flow & State Management

### Server Components (Default)

**Use When**:

- Static content
- Data fetching
- No interactivity needed

**Pattern**:

```typescript
// Server Component
export default async function Page() {
  const data = await fetchData();
  return <DisplayComponent data={data} />;
}
```

### Client Components

**Use When**:

- User interactions (clicks, form inputs)
- Browser APIs (localStorage, window)
- State management (useState, useEffect)
- Event handlers

**Pattern**:

```typescript
"use client";

export function InteractiveComponent() {
  const [state, setState] = useState();
  // ... interactivity
}
```

### State Management Strategy

1. **Server State**: React Server Components + Server Actions
2. **Client State**: React hooks (useState, useReducer)
3. **Form State**: react-hook-form
4. **Global State**: Context API (sparingly, for theme, auth)
5. **URL State**: Next.js searchParams, router

**Avoid**:

- Redux/Zustand for simple state (use React hooks)
- Global state for component-local state
- Prop drilling (use composition instead)

---

## API Design Patterns

### RESTful API Structure

```
/api/v1/
├── widget/              # Widget endpoints
│   ├── config          # GET - Widget configuration
│   ├── questions       # GET - Questions for job
│   └── attempts/       # Attempt management
│       ├── start       # POST - Start attempt
│       ├── submit      # POST - Submit answers
│       └── status      # GET - Check status
│
├── verify              # POST - ATS verification endpoint
│
└── [future endpoints]
```

### API Route Pattern

```typescript
// app/api/v1/widget/config/route.ts
import { NextRequest, NextResponse } from "next/server";
import { validateRequest } from "@/lib/api/validation";
import { getWidgetConfig } from "@/lib/widget/config";

export async function GET(request: NextRequest) {
  try {
    // 1. Validate request
    const params = validateRequest(request);

    // 2. Business logic
    const config = await getWidgetConfig(params);

    // 3. Return response
    return NextResponse.json(config);
  } catch (error) {
    // 4. Error handling
    return NextResponse.json(
      { error: error.message },
      { status: error.statusCode || 500 }
    );
  }
}
```

### API Response Shapes

**Success**:

```typescript
{
  data: T,
  meta?: { ... }
}
```

**Error**:

```typescript
{
  error: string,
  code: string,
  details?: unknown
}
```

### API Versioning

- Use `/api/v1/` for versioned endpoints
- Keep backward compatibility within version
- New versions for breaking changes

---

## Testing Organization

### Test File Locations

```
feature-name/
├── components/
│   ├── component.tsx
│   └── component.test.tsx      # Co-located tests
│
├── lib/
│   ├── function.ts
│   └── function.test.ts        # Co-located tests
│
└── __tests__/                  # Integration tests
    └── feature.test.ts
```

### Test Types

1. **Unit Tests**: Test individual functions/components
2. **Integration Tests**: Test feature workflows
3. **E2E Tests**: Test full user flows (Playwright/Cypress)

### Testing Patterns

```typescript
// lib/jobs/queries.test.ts
import { describe, it, expect } from "vitest";
import { getJobsForCompany } from "./queries";

describe("getJobsForCompany", () => {
  it("returns jobs for company", async () => {
    const jobs = await getJobsForCompany("company-id");
    expect(jobs).toBeDefined();
  });
});
```

---

## Key Principles Summary

1. **Feature-Based Organization**: Group related code by feature
2. **Layer Separation**: Clear boundaries between presentation, application, data, integration
3. **Co-location**: Keep related files together
4. **Barrel Exports**: Use index.ts for clean imports
5. **Type Safety**: TypeScript everywhere, no `any`
6. **Server First**: Use Server Components by default
7. **Extension Points**: Registry patterns for extensibility
8. **Consistent Patterns**: Follow established patterns throughout
9. **Error Handling**: Graceful error handling at all layers
10. **Performance**: Optimize data fetching, lazy load when needed

---

## Migration Notes

When rebuilding:

1. **Start with Structure**: Set up directory structure first
2. **Define Boundaries**: Establish layer boundaries early
3. **Build Core First**: Core features before extensions
4. **Add Extensions**: Use extension points for new features
5. **Refactor Incrementally**: Don't try to perfect everything at once

---

This guide provides the architectural foundation for rebuilding reqCHECK with clean, maintainable, and extensible code. Follow these patterns and principles to ensure the codebase remains organized and scalable as it grows.
