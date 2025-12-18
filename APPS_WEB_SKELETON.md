# reqCHECK Web Application - Skeleton Documentation

## Overview

The **apps/web** application is a Next.js-based dashboard and marketing website for reqCHECK, a skills verification platform that prevents unqualified job applications by gating job forms with skills-first verification challenges.

**Purpose**: Provide a comprehensive dashboard for companies to manage jobs, skills, challenges, integrations, billing, and analytics, plus a public-facing marketing site with documentation.

**Tech Stack**:

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: PostgreSQL via Prisma ORM
- **Authentication**: Stack Auth (Neon Auth)
- **Payments**: Stripe (Embedded Checkout, Subscriptions, Metered Billing)
- **File Storage**: AWS S3 (for challenge question images)
- **State Management**: React Server Components + Client Components
- **UI Components**: Shared `@reqcheck/ui` package (shadcn/ui based)

---

## Project Structure

```
apps/web/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public marketing pages (no auth required)
│   │   ├── _components/         # Marketing page components
│   │   ├── changelog/           # Product changelog page
│   │   ├── docs/                # Documentation pages
│   │   ├── pricing/             # Pricing page
│   │   ├── roadmap/             # Product roadmap page
│   │   ├── layout.tsx           # Public layout (header/footer)
│   │   └── page.tsx             # Landing/home page
│   ├── app/                     # Protected dashboard routes
│   │   ├── (protected)/         # Main app routes (auth required)
│   │   │   ├── _components/     # Shared dashboard components
│   │   │   ├── admin/           # Admin-only routes
│   │   │   ├── applications/   # Applications management
│   │   │   ├── dashboard/       # Main dashboard/home
│   │   │   ├── integrations/    # ATS integrations (Greenhouse, etc.)
│   │   │   ├── jobs/            # Job management
│   │   │   ├── notifications/   # User notifications
│   │   │   ├── settings/        # Company settings
│   │   │   ├── skills/          # Skills library management
│   │   │   ├── support/         # Support/FAQ page
│   │   │   ├── layout.tsx       # Protected layout (sidebar, header)
│   │   │   └── page.tsx        # App home/welcome page
│   │   ├── onboarding/          # Onboarding flow (multi-step wizard)
│   │   └── layout.tsx           # App root layout
│   ├── api/                     # API routes
│   │   ├── cron/                # Scheduled jobs
│   │   ├── support/             # Support ticket submission
│   │   ├── uploads/             # File upload endpoints
│   │   └── v1/                  # Versioned API endpoints
│   ├── handler/                 # Auth handler routes (Stack Auth)
│   ├── layout.tsx               # Root layout (fonts, providers)
│   └── loading.tsx              # Global loading UI
├── components/                  # Shared client components
├── hooks/                       # Custom React hooks
├── lib/                         # Utility functions and server-side logic
├── public/                      # Static assets
├── stack/                       # Stack Auth client/server setup
└── package.json
```

---

## Public Pages (`app/(public)/`)

### 1. Landing Page (`page.tsx`)

**Route**: `/`
**Purpose**: Marketing homepage showcasing reqCHECK's value proposition
**Content**:

- Hero section: "Stop AI Resume Spam. Start Hiring Real Candidates."
- Problem section: AI bots flooding inboxes
- Solution section: How reqCHECK stops spam
- Features: Skill library, custom control, question formats
- How it works: 4-step process
- Benefits: For companies and candidates
- Mobile-first design showcase
- CTA section with pricing link
  **Components Used**:
- `AnimatedSection`, `AnimatedCard` (animations)
- `FeatureCard`, `StepCard`, `BenefitsCard`
- `SectionHeader`, `SkillMarquee`
- Navigation component

### 2. Pricing Page (`pricing/page.tsx`)

**Route**: `/pricing`
**Purpose**: Display pricing tiers and plans
**Content**:

- Pricing cards for FREE, PRO_MONTHLY, PRO_ANNUAL, ENTERPRISE
- Feature comparison table
- Usage limits per plan
- Stripe checkout integration
- FAQ section
  **Key Features**:
- Plan selection
- Stripe Embedded Checkout integration
- Plan comparison matrix

### 3. Documentation (`docs/`)

**Route**: `/docs`
**Purpose**: Comprehensive product documentation
**Structure**:

- `/docs` - Documentation hub/index
- `/docs/getting-started` - Quick start guide
- `/docs/installation` - Installation instructions
- `/docs/widget-integration` - Widget integration guide
- `/docs/skills-challenges` - Skills and challenges documentation
  - `/docs/skills-challenges/multiple-choice` - MCQ format docs
  - `/docs/skills-challenges/fill-in-the-blank` - FITB format docs
- `/docs/integrations` - ATS integration guides
  - `/docs/integrations/greenhouse` - Greenhouse setup
  - `/docs/integrations/lever` - Lever setup (roadmap)
  - `/docs/integrations/ashby` - Ashby setup (roadmap)
- `/docs/api` - API reference documentation
  **Layout**: Sidebar navigation with nested sections

### 4. Changelog (`changelog/page.tsx`)

**Route**: `/changelog`
**Purpose**: Product updates and release notes
**Content**: Chronological list of product updates

### 5. Roadmap (`roadmap/page.tsx`)

**Route**: `/roadmap`
**Purpose**: Public product roadmap
**Content**: Future features and planned improvements

---

## Protected Dashboard Pages (`app/app/(protected)/`)

### 1. App Home (`page.tsx`)

**Route**: `/app`
**Purpose**: Welcome page after login, redirects to dashboard if onboarding complete
**Content**:

- Welcome message with user name
- Setup checklist (if quick setup completed)
- "What's New" section
- Helpful resources section
- CTA to go to dashboard
  **Redirects**:
- If not authenticated → `/handler/sign-in?redirect=/app`
- If onboarding incomplete → `/app/onboarding`
- If onboarding complete → `/app/dashboard`

### 2. Dashboard (`dashboard/page.tsx`)

**Route**: `/app/dashboard`
**Purpose**: Main analytics and overview dashboard
**Content**:

- **Metrics Cards**:
  - Total verification attempts
  - Pass rate percentage
  - Fail rate percentage
  - Usage vs. plan quota
- **Charts**:
  - Attempts over time (line/area chart)
  - Pass/fail breakdown (pie/bar chart)
  - Usage trends
- **Recent Activity**:
  - Latest verification attempts
  - Recent job updates
  - System notifications
- **Quick Actions**:
  - Create new job
  - View applications
  - Manage skills
- **Upgrade Nudges**: If approaching plan limits
  **Components**:
- `dashboard-header.tsx` - Page header with filters
- `chart-area-interactive.tsx` - Interactive charts (recharts)
- `applications-table.tsx` - Recent attempts table
  **Filters**: Time range, job filter

### 3. Jobs Management (`jobs/`)

**Route**: `/app/jobs`
**Purpose**: Manage all jobs (synced from ATS or manually created)

#### Jobs List (`jobs/page.tsx`)

**Content**:

- **Table View**:
  - Job title
  - Status (OPEN/DRAFT/ARCHIVED)
  - Source (MANUAL/GREENHOUSE)
  - Last sync date
  - Widget attached indicator
  - Skills count
  - Actions (view, edit, archive)
- **Filters**:
  - Status filter
  - Source filter
  - Search by title
- **Actions**:
  - Create new job button
  - Bulk archive
  - Sync jobs (if Greenhouse connected)
    **Components**:
- `jobs-table.tsx` - Main jobs table
- `job-status-badge.tsx` - Status indicator
- `job-source-badge.tsx` - Source indicator

#### Job Detail (`jobs/[jobId]/page.tsx`)

**Route**: `/app/jobs/[jobId]`
**Purpose**: Detailed job configuration and management
**Content**:

- **Job Info**:
  - Title, description, externalJobId
  - Status toggle
  - Source and sync info
- **Skills Management**:
  - List of assigned skills with weights
  - Drag-and-drop reordering
  - Add/remove skills
  - Skill weight sliders
  - Auto-detected skills indicator
- **Challenge Configuration**:
  - Pass threshold (default 60%)
  - Question count (up to 5)
  - Per-question timer override
  - Widget mode defaults (protect/gate/inline)
  - CTA copy customization
- **Recent Attempts**:
  - Table of verification attempts for this job
  - Filter by outcome (pass/fail)
  - View attempt details
- **Actions**:
  - Save changes
  - Archive job
  - Delete job
    **Components**:
- `job-detail-client.tsx` - Main client component
- Skills manager with drag-and-drop
- Challenge config form

#### Create Job (`jobs/create/page.tsx`)

**Route**: `/app/jobs/create`
**Purpose**: Create a new manual job
**Content**:

- **Form Fields**:
  - Job title (required)
  - Job description
  - External job ID (required, unique per company)
  - Status (default: DRAFT)
- **Skills Selection**:
  - Search and filter skills
  - Add skills to job
  - Set initial weights
  - Auto-detection preview
- **Initial Configuration**:
  - Pass threshold
  - Question count
  - Widget mode
    **Components**:
- `job-skills-manager.tsx` - Skills selection interface
- `job-skills-desktop-view.tsx` - Desktop layout
- `job-skills-mobile-view.tsx` - Mobile layout

### 4. Applications (`applications/page.tsx`)

**Route**: `/app/applications`
**Purpose**: View and manage verification attempts/applications
**Content**:

- **Table View**:
  - Candidate email
  - Job title
  - Verification status (passed/failed)
  - Score percentage
  - Completed date
  - Actions (view details)
- **Filters**:
  - Job filter
  - Status filter (passed/failed)
  - Date range
  - Search by email
- **Export**: CSV export (Pro+)
- **Details Modal**:
  - Full attempt details
  - Question-by-question breakdown
  - Time taken
  - Verification token info
    **Components**:
- `applications-client.tsx` - Main client component with table

### 5. Skills Library (`skills/`)

**Route**: `/app/skills`
**Purpose**: Manage skills taxonomy (native + custom)

#### Skills List (`skills/page.tsx`)

**Content**:

- **Table/Grid View**:
  - Skill name
  - Category
  - Type (native/custom)
  - Question count
  - Usage count
  - Average pass rate
  - Actions (view, edit)
- **Filters**:
  - Category filter (native + custom categories)
  - Type filter (native/custom)
  - Search by name
- **Actions**:
  - Create custom skill
  - Create custom category
  - Import skills
    **Components**:
- `client-skills-table.tsx` - Skills table
- `client-skills-header.tsx` - Header with filters
- `global-skills-browser-modal.tsx` - Browse all skills modal

#### Skill Detail (`skills/[skillId]/page.tsx`)

**Route**: `/app/skills/[skillId]`
**Purpose**: View and manage a specific skill
**Content**:

- **Skill Info**:
  - Name, aliases
  - Category
  - Type (native/custom)
  - Weight
  - Visibility
  - Stats (usage, pass rate)
- **Challenge Questions**:
  - List of questions for this skill
  - Question type, difficulty, weight
  - Actions (view, edit, archive)
  - Create new question button
- **Usage**:
  - Jobs using this skill
  - Recent verification attempts
    **Actions**:
- Edit skill (custom only)
- Archive skill
- Create question

#### Create Challenge Question (`skills/[skillId]/challenge/create/page.tsx`)

**Route**: `/app/skills/[skillId]/challenge/create`
**Purpose**: Create a new challenge question
**Content**:

- **Question Type Selection** (locked after creation):
  - Multiple Choice (single select)
  - Fill in the Blank
- **Question Form**:
  - Prompt/statement
  - Correct answer(s)
  - Distractor options
  - Difficulty level
  - Weight
  - Optional image upload
  - Optional timer override
  - Skill mappings (can map to multiple skills)
- **Live Preview**: Real-time preview of question rendering
- **Tags**: Add tags for better matching
  **Components**:
- `question-type-selector.tsx` - Type selection
- `multiple-choice-form.tsx` - MCQ form
- `fill-in-blank-form.tsx` - FITB form
- `fill-blank-editor.tsx` - Interactive FITB editor
- `image-upload.tsx` - Image upload component
- `question-preview-overlay.tsx` - Live preview
- `tags-input.tsx` - Tag management

#### Challenge Question Detail (`skills/[skillId]/challenge/[challengeId]/page.tsx`)

**Route**: `/app/skills/[skillId]/challenge/[challengeId]`
**Purpose**: View and edit a challenge question
**Content**: Same as create page but with existing data loaded

### 6. Integrations (`integrations/page.tsx`)

**Route**: `/app/integrations`
**Purpose**: Manage ATS integrations and API keys
**Content**:

- **Greenhouse Integration** (Pro+):
  - Connection status
  - Board token input
  - Sync frequency (HOURLY/DAILY/WEEKLY/MANUALLY)
  - Last sync date
  - Manual sync button
  - Jobs synced count
- **API Keys**:
  - List of API keys
  - Key name, prefix, created date, last used
  - Create new key button
  - Revoke key action
- **Domain Whitelist**:
  - List of whitelisted domains
  - Add/remove domains
  - Domain validation
- **Webhooks** (Enterprise):
  - Webhook URL configuration
  - Webhook secret
  - Test webhook button
    **Components**:
- `integrations-list.tsx` - Integration cards

### 7. Settings (`settings/page.tsx`)

**Route**: `/app/settings`
**Purpose**: Company-wide settings and configuration
**Content**:

- **Tabs**:
  1. **Billing**:
     - Current plan display
     - Usage meter (applications used vs. included)
     - Next invoice date
     - Stripe portal link (manage subscription)
     - Upgrade/downgrade options
     - Overage rates
  2. **Team**:
     - Team members list
     - Invite member button
     - Remove member action
     - Role management (Admin/Editor/Viewer - future)
     - Seat limits (based on plan)
  3. **API**:
     - API keys management (same as integrations page)
     - API documentation link
  4. **Organization**:
     - Company name
     - Default pass threshold (company-wide)
     - Default question timer (company-wide)
     - Default question count
     - Domain whitelist
     - Default widget mode
     - Default CTA copy
     - Tag match weights
     - Challenge question sync preference
  5. **Compliance** (Enterprise): - SSO configuration - DPA/SLA links
     **Components**:
- `settings-tabs.tsx` - Tab navigation
- `plan-badge.tsx` - Plan indicator

### 8. Support (`support/page.tsx`)

**Route**: `/app/support`
**Purpose**: Support resources and ticket submission
**Content**:

- **FAQ Section**:
  - Common questions and answers
  - Categorized by topic
- **Support Ticket Form**:
  - Type selection (bug/feature/question)
  - Subject
  - Description
  - Submit to Moxie CRM
- **Resources**:
  - Documentation links
  - Video tutorials
  - Community links
    **Components**:
- `faq-section.tsx` - FAQ accordion
- `support-grid-cards.tsx` - Resource cards

### 9. Notifications (`notifications/page.tsx`)

**Route**: `/app/notifications`
**Purpose**: View and manage user notifications
**Content**:

- **Notifications List**:
  - Type (APPLICATION_RECEIVED, APPLICATION_VERIFIED, JOB_POSTED, etc.)
  - Message
  - Status (UNREAD/READ/ARCHIVED)
  - Timestamp
  - Actions (mark read, archive)
- **Filters**:
  - Status filter
  - Type filter
- **Actions**:
  - Mark all as read
  - Clear all
    **Components**:
- `notifications-list.tsx` - Notifications table
- `notifications-button.tsx` - Header notification bell

### 10. Admin Routes (`admin/`)

**Route**: `/app/admin/*`
**Purpose**: Admin-only features
**Content**:

- **Promotional Skills** (`admin/promotional-skills/page.tsx`):
  - Manage promotional/featured skills
  - Upvote tracking
  - Skill promotion workflow

---

## Onboarding Flow (`app/onboarding/`)

**Route**: `/app/onboarding`
**Purpose**: Multi-step onboarding wizard for new users
**Steps**:

1. **Welcome & Company Setup**:
   - Company name
   - Welcome message
2. **Plan Selection**:
   - Choose plan (FREE/PRO_MONTHLY/PRO_ANNUAL/ENTERPRISE)
   - Stripe Embedded Checkout integration
   - Payment method collection (even for Free - for overages)
3. **Domain Whitelist**:
   - Add domains where widget will load
   - Domain validation
4. **ATS Integration** (Pro+):
   - Connect Greenhouse
   - Board token input
   - Initial sync trigger
5. **Skills Selection**:
   - Browse and select baseline skills
   - Skills to track for auto-detection
6. **Settings Configuration**:
   - Default pass threshold
   - Default question timer
   - Default question count
   - Widget defaults
7. **Completion**:
   - Summary
   - Next steps
   - Redirect to dashboard
     **Components**:

- `onboarding-flow.tsx` - Main wizard component
- `onboarding-header.tsx` - Progress indicator
- `checkout-sidebar.tsx` - Stripe checkout sidebar
- `settings-input-field.tsx` - Reusable input field
- Steps components in `steps/` directory

---

## API Routes (`app/api/`)

### Widget API (`api/v1/widget/`)

#### Config Endpoint (`api/v1/widget/config/route.ts`)

**Method**: GET
**Purpose**: Validate widget can render for given company/job/domain
**Query Params**:

- `companyId`: Company ID
- `jobId`: External job ID
- `origin`: Request origin (for domain whitelist check)
  **Response**:
- `canRender`: boolean
- `error`: string (if can't render)
- `errorCode`: string (COMPANY_NOT_FOUND, DOMAIN_NOT_WHITELISTED, JOB_NOT_FOUND, etc.)
- `config`: Widget configuration if can render

#### Questions Endpoint (`api/v1/widget/questions/route.ts`)

**Method**: GET
**Purpose**: Get questions for a job
**Query Params**:

- `jobId`: External job ID
- `companyId`: Company ID
  **Response**:
- `questions`: Array of question objects
- `jobId`: Job ID
- `passThreshold`: Required score percentage
- Question selection algorithm based on skill weights

#### Start Attempt (`api/v1/widget/attempts/start/route.ts`)

**Method**: POST
**Purpose**: Start a verification attempt
**Body**:

- `email`: Candidate email
- `jobId`: External job ID
  **Response**:
- `sessionToken`: Session token
- `attemptId`: Attempt ID
- Rate limiting and cooldown checks

#### Submit Attempt (`api/v1/widget/attempts/submit/route.ts`)

**Method**: POST
**Purpose**: Submit answers and get result
**Body**:

- `sessionToken`: Session token
- `attemptId`: Attempt ID
- `answers`: Array of { questionId, answer }
  **Response**:
- `passed`: boolean
- `score`: Percentage score
- `requiredScore`: Required threshold
- `totalQuestions`: Total questions
- `verificationToken`: Token for ATS verification (1 hour TTL)
- `tokenExpiresAt`: Token expiration
- `cooldownUntil`: Cooldown expiration (if failed)

#### Attempt Status (`api/v1/widget/attempts/status/route.ts`)

**Method**: GET
**Purpose**: Check verification status for email/job
**Query Params**:

- `email`: Candidate email
- `jobId`: External job ID
  **Response**:
- `verified`: boolean
- `passed`: boolean
- `score`: Percentage
- `completedAt`: ISO timestamp
- `tokenExpiresAt`: Token expiration

### Verification API (`api/v1/verify/route.ts`)

**Method**: POST
**Purpose**: ATS backend calls this to verify candidate before accepting application
**Headers**:

- `x-api-key`: API key
  **Body**:
- `email`: Candidate email
- `externalJobId`: External job ID
  **Response**:
- `verified`: boolean
- `passed`: boolean
- `score`: Percentage
- `completedAt`: ISO timestamp
- `tokenExpiresAt`: Token expiration

### File Upload (`api/uploads/challenge-image/route.ts`)

**Method**: POST
**Purpose**: Upload image for challenge question
**Auth**: Required (user must be authenticated)
**Body**: Multipart form data with image file
**Response**:

- `url`: S3 URL of uploaded image
- `key`: S3 key

### Support (`api/support/moxie/route.ts`)

**Method**: POST
**Purpose**: Submit support ticket to Moxie CRM
**Body**:

- `type`: Ticket type
- `subject`: Subject
- `comment`: Description
  **Response**: Ticket creation result

### Cron Jobs (`api/cron/cleanup-archived-jobs/route.ts`)

**Method**: GET
**Purpose**: Scheduled job to clean up archived jobs
**Auth**: Cron secret validation
**Function**: Archive old jobs, cleanup data

---

## Key Components

### Shared Dashboard Components (`app/app/(protected)/_components/`)

- **`app-sidebar.tsx`**: Main navigation sidebar with collapsible sections
- **`nav-main.tsx`**: Primary navigation items
- **`nav-secondary.tsx`**: Secondary navigation (settings, support)
- **`nav-user.tsx`**: User menu with profile/logout
- **`site-header.tsx`**: Top header bar
- **`global-search.tsx`**: Global search functionality
- **`mode-toggle.tsx`**: Dark/light mode toggle
- **`setup-checklist.tsx`**: Setup progress checklist
- **`whats-new-section.tsx`**: Product updates section
- **`resources-section.tsx`**: Helpful resources links
- **`setup-fab.tsx`**: Floating action button for quick setup

### Challenge Question Components (`components/challenge-question/`)

- **`question-type-selector.tsx`**: Select question type (MCQ/FITB)
- **`multiple-choice-form.tsx`**: MCQ question form
- **`fill-in-blank-form.tsx`**: FITB question form
- **`fill-blank-editor.tsx`**: Interactive FITB editor with blank creation
- **`image-upload.tsx`**: Image upload for questions
- **`question-preview-overlay.tsx`**: Live preview of question
- **`question-preview-wrapper.tsx`**: Preview container
- **`question-form-layout.tsx`**: Form layout wrapper
- **`question-header.tsx`**: Question form header
- **`question-config-card.tsx`**: Configuration card
- **`tags-input.tsx`**: Tag input component
- **`prompt-markdown.tsx`**: Markdown prompt renderer

### Skills Library Components (`components/global-skills-library/`)

- **`global-skills-library.tsx`**: Main skills browser
- **`skills-table.tsx`**: Skills table view
- **`skills-card-list.tsx`**: Skills card grid view
- **`search-and-filters.tsx`**: Search and filter controls
- **`filter-panel.tsx`**: Filter sidebar
- **`filter-group.tsx`**: Filter group component
- **`active-filter-badges.tsx`**: Active filter indicators
- **`add-custom-skill-modal.tsx`**: Create custom skill modal
- **`skills-header.tsx`**: Skills page header
- **`skills-pagination.tsx`**: Pagination component

### Other Shared Components

- **`animated-card.tsx`**: Animated card wrapper
- **`animated-section.tsx`**: Animated section wrapper
- **`skill-icon.tsx`**: Skill icon component
- **`usage-meter.tsx`**: Usage vs. quota meter
- **`toast-maker.tsx`**: Toast notification helper
- **`widget-integration-code-blocks.tsx`**: Code snippet display

---

## Data Models (Key Prisma Models)

### Company

- Company metadata, billing info, settings
- Relations: jobs, skills, integrations, apiKeys, applications

### Job

- Job title, description, externalJobId, status
- Relations: company, jobSkills, verificationAttempts

### JobSkill

- Links job to skill with weight
- Relations: job, clientSkill, questionWeights

### ClientSkill

- Company-specific skill instance
- Relations: company, skillTaxonomy, challengeQuestions, jobSkills

### SkillTaxonomy

- Global skill taxonomy (native + custom)
- Relations: clientSkills, skillCategory

### ChallengeQuestion

- Question data (type, prompt, answers, etc.)
- Relations: clientSkill, tags

### VerificationAttempt

- Verification attempt record
- Relations: job, company
- Fields: email, score, passed, verificationToken, tokenExpiresAt, cooldownUntil

### CompanyIntegration

- ATS integration config (Greenhouse, etc.)
- Relations: company

### CompanyApiKey

- API keys for verification endpoint
- Relations: company

---

## Key Features & Functionality

### 1. Job Management

- Create manual jobs or sync from Greenhouse
- Auto-detect skills from job description
- Configure challenge parameters per job
- Archive/delete jobs

### 2. Skills Management

- Browse native skill taxonomy
- Create custom skills and categories
- Map questions to skills
- Weight skills per job

### 3. Challenge Questions

- Multiple question types (MCQ, FITB)
- Image support
- Timer support
- Difficulty levels
- Tag-based matching
- Live preview

### 4. Widget Configuration

- Domain whitelist
- Widget mode selection (protect/gate/inline)
- CTA customization
- Default settings

### 5. Billing & Usage

- Stripe subscription management
- Metered usage tracking
- Overage billing
- Plan upgrades/downgrades
- Usage meters

### 6. Integrations

- Greenhouse ATS sync
- API key management
- Webhook configuration (Enterprise)

### 7. Analytics

- Verification attempt metrics
- Pass/fail rates
- Usage trends
- Per-job analytics

### 8. Authentication & Authorization

- Stack Auth integration
- Team-based access
- Role-based permissions (future)

---

## Environment Variables

```env
# Database
DATABASE_URL=

# Auth
STACK_PROJECT_ID=
STACK_API_KEY=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# AWS S3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
AWS_S3_BUCKET_NAME=

# App
NEXT_PUBLIC_DASHBOARD_URL=
NEXT_PUBLIC_API_URL=

# Moxie CRM (Support)
MOXIE_API_KEY=
MOXIE_API_URL=
```

---

## Build & Deployment

### Development

```bash
cd apps/web
pnpm install
pnpm dev
```

### Production Build

```bash
pnpm build
pnpm start
```

### Key Dependencies

- `next`: 16.0.3
- `react`: 19.1.1
- `@reqcheck/db`: Workspace package (Prisma client)
- `@reqcheck/ui`: Workspace package (shared UI components)
- `@stackframe/stack`: Auth
- `stripe`: Payments
- `@aws-sdk/client-s3`: File storage
- `@tanstack/react-table`: Tables
- `recharts`: Charts
- `zod`: Validation

---

## Important Notes for Rebuilding

1. **Authentication**: Uses Stack Auth (Neon Auth) - requires Stack project setup
2. **Database**: PostgreSQL with Prisma - schema in `packages/database/prisma/schema.prisma`
3. **Shared Packages**: Depends on `@reqcheck/ui` and `@reqcheck/db` workspace packages
4. **File Uploads**: S3 integration for challenge question images
5. **Billing**: Stripe Embedded Checkout for subscriptions, metered billing for usage
6. **Widget Integration**: Widget script loads from `/public/widget.js` (built from `apps/widget`)
7. **API Security**: API keys required for `/api/v1/verify` endpoint
8. **Domain Whitelist**: Widget only loads on whitelisted domains
9. **Rate Limiting**: Cooldown periods for failed attempts (24 hours)
10. **Grace Mode**: Widget fails silently if API unreachable (allows form submission)

---

## Testing Considerations

- Widget integration testing with test pages
- API endpoint testing
- Stripe webhook testing
- File upload testing
- Authentication flow testing
- Onboarding flow testing
- Job sync testing (Greenhouse)

---

This skeleton document provides a comprehensive overview of the web application structure, pages, components, and functionality. Use this as a blueprint for rebuilding the application in a fresh monorepo.
