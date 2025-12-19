# ReqCheck Widget

The ReqCheck widget is a CDN-served JavaScript library that can be embedded on job application pages to verify candidate skills through interactive quizzes.

## Building

```bash
# From root directory
pnpm build:widget

# Or from widget directory
cd packages/widget
pnpm build
```

The built widget will be output to `public/widget.js` and can be served via CDN.

## Usage

### Basic Integration

```html
<script
  src="https://reqcheck.io/widget.js"
  data-reqcheck-company="your-company-id"
></script>
```

### Protect Mode (Form Protection)

```html
<form data-reqcheck-mode="protect" data-reqcheck-job="job_123">
  <input type="email" name="email" data-reqcheck-email-field="true" required />
  <button type="submit">Submit Application</button>
</form>
```

### Gate Mode (Link Protection)

```html
<a
  href="https://jobs.example.com/apply/123"
  data-reqcheck-mode="gate"
  data-reqcheck-job="job_456"
>
  Apply Now
</a>
```

### Inline Mode (On Your Honor)

```html
<div data-reqcheck-mode="inline" data-reqcheck-job="job_123">
  <!-- Widget will render here -->
</div>
```

### Programmatic API

```javascript
ReqCheck.init({
  companyId: "your-company-id",
  mode: "gate",
  jobId: "job_123", // External job ID (from your dashboard, NOT the database ID)
  callbacks: {
    onSuccess: (result) => {
      console.log("Verification passed!", result);
    },
    onFailure: (result) => {
      console.log("Verification failed", result);
    },
    onComplete: (result) => {
      console.log("Verification completed", result);
    },
  },
});

// The jobId parameter must be the external job ID registered in your dashboard
ReqCheck.verify("email@example.com", "job_123", "https://redirect-url.com");
```

**Important:** The `jobId` parameter in both `ReqCheck.init()` and `ReqCheck.verify()` must be the **external job ID** you registered when creating the job in your reqCHECK dashboard. This is **not** the internal database ID. The external job ID is the identifier you use to link your external job posting system with reqCHECK.

## Widget Styling

Widget styles are configured server-side in your reqCHECK dashboard under **Settings > Configuration > Widget Styles**. The widget automatically fetches and applies these styles when it initializes.

### Available Style Properties

- **Font Color** - Color for all text in the widget
- **Background Color** - Background color for modals and overlays
- **Button Color** - Background color for all buttons
- **Button Text Color** - Text color for buttons
- **Accent Color** - Color for selected answers, progress bars, and success states

Styles are applied automatically to all widget instances for your team. No client-side configuration is required.

## Callback Events

Subscribe to widget events to handle verification results:

```javascript
ReqCheck.init({
  companyId: "your-company-id",
  jobId: "job_123",
  callbacks: {
    // Called when verification passes
    onSuccess: (result) => {
      console.log("Passed!", result);
      // result.passed = true
      // result.score = 85
    },

    // Called when verification fails
    onFailure: (result) => {
      console.log("Failed", result);
      // result.passed = false
      // result.score = 65
    },

    // Called when verification completes (pass or fail)
    onComplete: (result) => {
      console.log("Completed", result);
      // result.passed = true/false
      // result.score = 85
    },
  },
});
```

### Callback Result Object

All callbacks receive a result object with:

```typescript
{
  passed: boolean; // Whether verification passed
  score: number; // Score percentage (0-100)
}
```

## Development

The widget is built using Vite and outputs a single IIFE bundle that can be loaded via script tag.
