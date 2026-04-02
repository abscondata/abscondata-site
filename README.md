# Devine

Private academic platform MVP built with Next.js (App Router), Supabase, and Vercel AI SDK.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment variables:

```bash
# copy and fill in values
cp .env.example .env.local
```

3. Create the database schema in Supabase:

- Open your Supabase project SQL editor.
- Run the SQL in `supabase/schema.sql`.

4. Start the dev server:

```bash
npm run dev
```

## AI Critique Configuration

The critique system uses the Vercel AI SDK with AI Gateway by default.

- `AI_GATEWAY_API_KEY` is required for local development.
- `AI_MODEL` defaults to `openai/gpt-5.4` if not set.

On Vercel, you can use OIDC-based credentials through the AI Gateway instead of local API keys.

## Project Structure

- `src/app/(protected)` — authenticated routes
- `src/app/login` — auth UI
- `src/legacy/dashboard` — previous dashboard implementation (kept for reference)
- `src/app/(protected)/programs/new` — create program
- `src/app/(protected)/courses/new` — create course
- `src/app/(protected)/modules/new` — create module
- `src/app/(protected)/assignments/new` — create assignment
- `src/lib/actions.ts` — server actions
- `src/lib/ai/critique.ts` — critique generation logic
- `src/lib/supabase` — Supabase clients
- `supabase/schema.sql` — database schema and policies
