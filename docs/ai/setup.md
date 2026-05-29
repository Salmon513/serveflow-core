# AI Setup

## Required Environment Variables

Add these to `apps/backend/.env`:

```bash
AI_PROVIDER=gemini
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

These variables are validated at backend startup.

## Endpoints

- `POST /ai/faq`
- `POST /ai/booking-intent`

## Local Frontend Testing

The frontend homepage includes two minimal testers.

By default it targets:

`http://localhost:3000`

If your backend runs elsewhere, change the backend base URL in the tester UI.
