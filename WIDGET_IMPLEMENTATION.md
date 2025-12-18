# Widget Implementation Summary

## Overview

The ReqCheck widget has been implemented as a monorepo package that builds to a single CDN-served JavaScript file. The widget integrates with the existing Next.js application and uses the same API infrastructure.

## Structure

```
reqcheck/
├── packages/
│   └── widget/              # Widget package
│       ├── src/
│       │   ├── index.ts     # Main widget entry point
│       │   └── api.ts       # API client for widget endpoints
│       ├── package.json
│       ├── vite.config.ts   # Build configuration
│       └── tsconfig.json
├── app/api/v1/
│   └── widget/              # Widget API routes
│       ├── validate/        # Validate widget can render
│       ├── questions/       # Get/generate quiz questions
│       └── attempts/         # Start, submit, check status
├── lib/
│   ├── widget/              # Widget utilities
│   │   ├── quiz-generation.ts    # Quiz generation algorithm
│   │   ├── job-questions.ts      # Get questions for job
│   │   └── answer-validation.ts  # Validate answers
│   ├── utils/
│   │   ├── cors.ts          # CORS middleware
│   │   └── email.ts         # Email normalization
│   └── auth/
│       └── api-key.ts       # API key verification
└── public/
    └── widget.js            # Built widget (generated)
```

## API Endpoints

### Widget Endpoints (Public, CORS-enabled)

1. **GET /api/v1/widget/validate** - Validate widget can render
   - Query params: `companyId`, `jobId`, `origin`
   - Returns: `{ canRender, error?, config? }`

2. **GET /api/v1/widget/questions** - Get questions for quiz
   - Query params: `companyId`, `jobId`, `email?`
   - Returns: `{ questions, jobId, passThreshold, cached }`
   - Implements 24-hour caching per email-job combination

3. **POST /api/v1/widget/attempts/start** - Start verification attempt
   - Body: `{ email, jobId, companyId }`
   - Returns: `{ sessionToken, attemptId }`

4. **POST /api/v1/widget/attempts/submit** - Submit answers
   - Body: `{ sessionToken, attemptId, answers, timeTakenSeconds }`
   - Returns: `{ passed, score, requiredScore, verificationToken, ... }`

5. **GET /api/v1/widget/attempts/status** - Check verification status
   - Query params: `email`, `jobId`, `companyId`
   - Returns: `{ verified, passed, score, completedAt, tokenExpiresAt }`

### Verification Endpoint (API Key Required)

6. **POST /api/v1/verify** - ATS backend verification
   - Headers: `x-api-key: <api-key>`
   - Body: `{ email, externalJobId }`
   - Returns: `{ verified, passed, score, completedAt, tokenExpiresAt }`

## Features

### Quiz Generation

- **Weighted Random Selection**: Uses skill weights and question weights for fair but relevant quiz generation
- **24-Hour Caching**: Same applicant gets same quiz for 24 hours per job
- **Question Types**: Supports multiple choice and fill-in-the-blank questions
- **Automatic Filtering**: Only includes questions with weight > 0

### Widget Modes

1. **Protect Mode**: Attaches to forms, verifies before submission
2. **Gate Mode**: Attaches to links/buttons, verifies before navigation

### Answer Validation

- Multiple choice: Case-insensitive string comparison
- Fill blank blocks: Array comparison with case-insensitive matching

## Building

```bash
# Build widget only
pnpm build:widget

# Build widget + Next.js app
pnpm build:all
```

The widget is output to `public/widget.js` and automatically served by Vercel with CDN caching.

## Deployment

1. **Build**: The widget is built as part of the Next.js build process
2. **Hosting**: Vercel automatically serves `public/widget.js` with global CDN
3. **URL**: `https://reqcheck.io/widget.js` (or your domain)

## Usage

### Basic Integration

```html
<script
  src="https://reqcheck.io/widget.js"
  data-reqcheck-company="your-company-id"
></script>

<form data-reqcheck-mode="protect" data-reqcheck-job="job_123">
  <input type="email" name="email" data-reqcheck-email-field="true" required />
  <button type="submit">Submit</button>
</form>
```

### Programmatic API

```javascript
ReqCheck.init({
  companyId: "123",
  jobId: "job_456",
});

ReqCheck.verify("candidate@example.com", "job_456", "https://redirect.url");
```

## Next Steps

1. **Enhanced UI**: Improve the quiz modal with better styling and UX
2. **Question Display**: Implement proper fill-in-the-blank editor
3. **Timer Support**: Add countdown timer for time-limited questions
4. **Error Handling**: Improve error messages and retry logic
5. **Analytics**: Add tracking for quiz completion rates
6. **Testing**: Add unit tests for quiz generation and answer validation
7. **Production Cache**: Replace in-memory cache with Redis for distributed caching

## Notes

- The widget uses vanilla JavaScript (no React) for maximum compatibility
- All API routes include CORS headers for cross-origin requests
- Email normalization removes +aliases for consistent lookups
- Verification tokens expire after 1 hour
- Failed attempts have a 24-hour cooldown period
