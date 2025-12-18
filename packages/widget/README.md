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

### Programmatic API

```javascript
ReqCheck.init({
  companyId: "your-company-id",
  mode: "gate",
  jobId: "job_123",
});

ReqCheck.verify({
  jobId: "job_123",
  onSuccess: (result) => {
    window.location.href = "https://jobs.example.com/apply/123";
  },
  onFailure: (result) => {
    alert(`Score too low: ${result.score}%`);
  },
});
```

## Development

The widget is built using Vite and outputs a single IIFE bundle that can be loaded via script tag.
