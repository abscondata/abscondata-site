# Production-Readiness Audit — Client 1 Pre-Launch

**Date:** Phase 1 read-only audit
**Scope:** Next.js + Supabase + Vercel dashboard at `C:\Users\Robin\abscondata-site`
**Goal:** Identify every blocker before Client 1 onboards in 4–6 weeks

---

## EXECUTIVE SUMMARY

**Status:** NOT PRODUCTION-READY. Three CRITICAL blockers, six HIGH issues, plus several MEDIUM hardening gaps.

**Top 3 blockers (must fix before Client 1):**
1. **`is_owner()` SQL function is referenced by 4 RLS policies but never defined.** Tables `daily_snapshots`, `client_invoices`, `email_sequences` (and the consolidated migration 011 that recreates them) will fail policy evaluation at runtime. Anything reading or writing those tables will silently return zero rows or error.
2. **VAs cannot see any tasks.** The schema (`tasks.assigned_va` column + RLS policy in `001_profiles_and_rls.sql:52-62`) filters task visibility by `assigned_va = profile.email`. The application never sets `assigned_va` on any insert path. Net effect: VA login will show an empty queue.
3. **`send_log` insert on task SENT silently swallows all errors** (`queue/actions.ts:83` uses `.catch(() => {})`). The audit trail Robin needs for client disputes can fail without anyone noticing.

Everything else is fixable with surgical changes. None of the fixes require new tables, new pages, or refactors.

---

## 1. ENV VAR CHECK

### Variables referenced in code

| Var | Files | Server/Client | In `.env.local`? | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | `lib/supabase/{client,server}.ts`, `app/onboarding/actions.ts` | Both | ✅ | Required |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `lib/supabase/{client,server}.ts`, `app/onboarding/actions.ts` | Both | ✅ | Required |
| `SUPABASE_SERVICE_ROLE_KEY` | (defined but **never imported in code**) | — | ✅ | Present in `.env.local` only — currently unused. No security violation. |
| `ANTHROPIC_API_KEY` | `dashboard/queue/ai-draft.ts:64`, `dashboard/clients/[id]/batch-ai.ts:11`, `dashboard/settings/page.tsx:13` | Server only | ✅ | Required for AI drafts |
| `APOLLO_API_KEY` | `dashboard/outreach/apollo-pull.ts:111` | Server only | ✅ | Required for lead pulls |
| `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA` | `dashboard/settings/page.tsx:14` | Server | ⚠️ Not in `.env.local` (Vercel auto-injects in prod) | Has `\|\| null` fallback — display only, non-blocking |
| `VERCEL_OIDC_TOKEN` | (Vercel CLI artifact, not used in code) | — | ✅ | No action needed |

### Findings

- ✅ **No client-context leak.** `SUPABASE_SERVICE_ROLE_KEY`, `ANTHROPIC_API_KEY`, and `APOLLO_API_KEY` are only referenced from server actions (`"use server"` files). No `"use client"` file imports them.
- ⚠️ **Vercel production env vars cannot be verified from this audit** (no Vercel API access). Robin must manually confirm `ANTHROPIC_API_KEY`, `APOLLO_API_KEY`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are set in Vercel project settings before Client 1 onboards. The smoke test in Phase 3 will include this.
- ✅ All env reads have null-safe handling (`if (!apiKey) return ...`).

**Severity:** None — env wiring looks clean. The risk is operational (Vercel config), not code.

---

## 2. SUPABASE SCHEMA CHECK

### Tables defined in `supabase/migrations/`

Created via `CREATE TABLE`:
`profiles` (001), `client_configs` (002), `task_source_data` (002), `task_events` (002), `send_logs` (002, plural — see note), `client_services` (004), `client_platforms` (004), `onboarding_submissions` (004), `task_templates` (004), `imports` (004), `outreach_leads` (005), `daily_snapshots` (006), `client_invoices` (008), `send_log` (009, singular — different table from 002), `email_sequences` (010)

Tables `ALTER`ed and referenced but **NOT created** in any migration in this repo:
`clients`, `tasks`, `exceptions`, `weekly_reports`, `task_logs`, `sops`, `files`

→ These exist in Supabase (the dashboard uses them daily) but their `CREATE TABLE` definitions are not in version-controlled migrations. They presumably came from an earlier ad-hoc setup before migrations were tracked.

### Tables referenced by application code (`.from("...")`)

19 unique tables: `clients`, `tasks`, `exceptions`, `weekly_reports`, `profiles`, `task_logs`, `task_events`, `task_source_data`, `client_configs`, `send_logs`, `task_templates`, `imports`, `onboarding_submissions`, `client_services`, `client_platforms`, `outreach_leads`, `daily_snapshots`, `client_invoices`, `send_log`, `sops`, `email_sequences`

All 19 exist in Supabase (assuming the un-versioned base tables are present).

### CRITICAL: `is_owner()` function is undefined

Four RLS policies call `is_owner()`:
- `006_daily_snapshots.sql:16` — `daily_snapshots`
- `008_templates_invoices.sql:18` — `client_invoices`
- `010_outreach_intelligence.sql:28` — `email_sequences`
- `011_consolidated_tonight.sql:21,40,90` — recreates all three

Search for `CREATE FUNCTION ... is_owner` across all migrations: **zero matches.** The function does not exist in version control.

If `is_owner()` does not exist in the actual Supabase database either, every policy that references it will throw `function is_owner() does not exist` and return no rows. The dashboard pages that read these tables will silently render empty UIs, and inserts will fail.

**Action:** Robin needs to either (a) confirm `is_owner()` exists in Supabase (created out-of-band before tonight's session) or (b) add a migration that creates it.

Recommended definition (matches the inline policy pattern used in `001_profiles_and_rls.sql`):
```sql
CREATE OR REPLACE FUNCTION public.is_owner()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'owner'
  );
$$;
```

### `send_log` vs `send_logs` — two tables

- `send_logs` (plural) created in `002_v1_execution_spine.sql`
- `send_log` (singular) created in `009_send_log_onboarding.sql`

Code at `queue/actions.ts:75` writes to `send_log` (singular). The plural `send_logs` table is never read or written by current code. Not a blocker, but technical debt — one table is dead.

### RLS coverage

Every table created in migrations has `ENABLE ROW LEVEL SECURITY` and at least one policy. ✅

### Type assertion bypasses (`as any`)

The TypeScript types in `src/lib/database.types.ts` were generated before tonight's columns/tables were added. Code uses `as any` to bypass:

| File | Line | Table |
|---|---|---|
| `clients/[id]/actions.ts` | 26 | `client_platforms` (platform_url) |
| `clients/[id]/actions.ts` | 42 | `clients` (onboarding_sop_reviewed) |
| `clients/new/actions.ts` | 51 | `client_platforms` (platform_url) |
| `outreach/actions.ts` | 32 | `outreach_leads` (response_*) |
| `settings/template-actions.ts` | 65 | `task_templates` (enabled) |
| `queue/page.tsx` | 38 | `task_templates` (enabled) |
| `queue/actions.ts` | 74 | `send_log` |
| `outreach/page.tsx` (multiple) | — | `outreach_leads`, `email_sequences` |
| `outreach/backfill-actions.ts` | — | `outreach_leads` |
| `clients/[id]/batch-ai.ts` (and several `dbAny` casts) | — | `client_invoices`, `daily_snapshots` |

**Risk:** Functional today, but any column rename or removal will not be caught by the type checker. Low priority — fix by regenerating types post-migration.

### Severity summary

| Issue | Severity |
|---|---|
| `is_owner()` function undefined | **CRITICAL** |
| Base tables (`clients`, `tasks`, etc.) not in version-controlled migrations | MEDIUM (operational — bootstrap risk) |
| Dead `send_logs` table | LOW |
| `as any` type bypasses | LOW |

---

## 3. CORE FLOW INVENTORY

### a) Onboarding submission → client → starter tasks — **WORKS**

- Public form: `src/app/onboarding/page.tsx`
- Submission insert: `src/app/onboarding/actions.ts` → `onboarding_submissions`
- Conversion (owner-triggered): `dashboard/onboarding/actions.ts:6-94` `convertSubmission()`
  - Creates `clients` (line 22, error checked)
  - Creates `client_services` (line 44, **no error check**)
  - Creates `client_platforms` (line 52, **no error check**)
  - Pulls templates and inserts `tasks` (lines 67-78, **no error check**)

**Finding:** Cascading inserts after the initial `clients` insert do not check for errors. If `client_services` or `tasks` insert fails (e.g., RLS policy issue, FK violation), the conversion returns success and Robin sees a "converted" client with no services/tasks.

**Severity:** HIGH

### b) Lead pull → outreach_leads → segmentation — **WORKS**

- Entry: `dashboard/outreach/apollo-pull.ts:108` `pullFromApollo()`
- Calls `classifySegment()` and `generatePersonalizationLine()` from `src/lib/lead-classification.ts` at insert time (lines 183-184)
- Segment + personalization_line populated on every new lead

**Note:** There is a CSV import path (`dashboard/imports/`) but it imports invoice/payment task data, not outreach leads. Outreach is Apollo-only. This matches the intended architecture.

**Severity:** None

### c) Task status transitions (NEW → READY → APPROVED → SENT → CLOSED) — **WORKS** with caveats

- File: `dashboard/queue/actions.ts:19-102` `updateTaskStatus()`
- `VALID_TRANSITIONS` (lines 10-17) enforces a state machine including paths to/from `EXCEPTION`
- Update + `task_events` insert (lines 56, 62-68)

**Finding 1 (HIGH):** The `task_events.insert()` at line 62 is awaited but the error is never checked. If event logging fails, the status transition still returns success and the audit log silently loses an entry.

**Finding 2 (HIGH — see Flow h):** `send_log` insert silently swallows errors.

### d) AI draft generation — **WORKS** with caveats

- File: `dashboard/queue/ai-draft.ts:60-145` `generateAiDraft()`
- ✅ API key check at line 64 with friendly error message
- ✅ Wrapped in try/catch
- ✅ SDK call at line 109-115 with explicit model `claude-sonnet-4-20250514`
- ❌ **No timeout configured** — relies on Anthropic SDK default (~10 minutes). A hung request could lock up the queue UI.
- ❌ **No retry logic** — a transient 429 or 503 surfaces immediately as a hard error.
- ❌ **`batchGenerateDrafts()`** loops with 500ms delay but counts failures without surfacing them per-task to Robin.

**Severity:** MEDIUM. Single-draft path is acceptable for Client 1 (Robin will retry manually). Batch path needs at minimum a per-task error toast or summary so Robin knows which tasks didn't get drafted.

### e) VA role view — task filtering — **BROKEN**

- File: `dashboard/queue/page.tsx:15-19`
- Query: `supabase.from("tasks").select("*").in("status", [...])` — no `assigned_va` filter

**The schema does have a filter mechanism:** `tasks.assigned_va` column (in `database.types.ts:56`) plus RLS policies in `001_profiles_and_rls.sql:52-62` that restrict VA selects/updates to rows where `assigned_va = (select email from profiles where id = auth.uid())`.

**The bug:** Application code **never sets `assigned_va` on any task insert.** Searched all of `src/`:
- `createManualTask` (queue/actions.ts:97-158) — does not set `assigned_va`
- `convertSubmission` (onboarding/actions.ts) — does not set
- `bulkCreateTasks` (clients/[id]/bulk-actions.ts) — does not set
- `processImport` (imports/actions.ts) — does not set
- `createClientManual` (clients/new/actions.ts) — does not set

**Net effect:** When a VA logs in:
- The owner's policy gives owners full access ✅
- The VA's policy filters to `assigned_va = va.email`, but no row matches → **VA sees zero tasks**
- The page does NOT crash (the query just returns `[]`), but the queue is empty and unworkable

**Severity:** **CRITICAL** if the launch plan includes a VA. If Robin is the only operator at launch, this is HIGH priority but not blocking.

### f) Owner view — all clients/tasks/exceptions — **WORKS**

- `dashboard/clients/page.tsx:15` enforces owner role check
- `dashboard/exceptions/page.tsx:13` enforces owner role check
- Both fetch unfiltered data; owner RLS allows full access

### g) Morning briefing dashboard (empty + populated) — **WORKS**

- `dashboard/page.tsx` and `components/owner-overview.tsx`
- All fetches use `Promise.all` with `?? 0` and `?? []` defaults
- `OwnerOverview` renders empty states for client health, recent activity, and trend chart
- `captureDailySnapshot()` is fire-and-forget (`.catch(() => {})` at line 60) — non-blocking, acceptable design

**Caveat:** Trend chart depends on `daily_snapshots` table being readable. If `is_owner()` is undefined (Section 2), the snapshot read returns nothing and the chart silently disappears. Not a crash, but a symptom of the deeper bug.

### h) Send log on SENT — **BROKEN (silent failure)**

- `dashboard/queue/actions.ts:71-84`
- Insert wrapped in `.catch(() => {})` at line 83
- Task is marked SENT and the user gets a success toast even if the audit log was not written

**Severity:** **HIGH.** This is the audit trail Robin needs for client disputes. Silent failure here means a client could ask "did you send the invoice on the 5th?" and the system would have no record.

**Fix:** Replace `.catch(() => {})` with proper error logging (`console.error`) and at minimum include the failure in the toast message so Robin knows.

### i) Exception routing — **WORKS**

- Exception state reachable from any non-terminal status via `updateTaskStatus(taskId, "EXCEPTION", { rejection_reason })`
- Exception fields populated at lines 48-52
- `retryException()` and `closeException()` actions defined and wired into the queue UI
- `dashboard/exceptions/page.tsx` is owner-restricted and lists exceptions

---

## 4. ERROR HANDLING CHECK

### Server actions — silent insert failures

| File | Line(s) | Issue | Severity |
|---|---|---|---|
| `queue/actions.ts` | 62-68 | `task_events.insert()` not error-checked | HIGH |
| `queue/actions.ts` | 75-83 | `send_log.insert()` with `.catch(() => {})` | HIGH |
| `clients/new/actions.ts` | 44-46 | `client_services.insert()` not checked | HIGH |
| `clients/new/actions.ts` | 50-58 | `client_platforms.insert()` not checked | HIGH |
| `clients/new/actions.ts` | 67-77 | `tasks.insert()` (templates) not checked | HIGH |
| `onboarding/actions.ts` | 44-49 | `client_services.insert()` not checked | HIGH |
| `onboarding/actions.ts` | 52-62 | `client_platforms.insert()` not checked | HIGH |
| `onboarding/actions.ts` | 73-83 | `tasks.insert()` (templates) not checked | HIGH |
| `imports/actions.ts` | 87-93 | `task_source_data.insert()` not checked | MEDIUM |
| `queue/actions.ts` (createManualTask) | 127-141 | `task_source_data.insert()` not checked | MEDIUM |

**Pattern:** Every action correctly handles errors on its primary insert (the `clients` insert, the `tasks` insert) but cascading inserts (services, platforms, child tasks, source data, events) are fired and forgotten. None are wrapped individually.

### Anthropic API calls

`dashboard/queue/ai-draft.ts:109-115` and the loop in `dashboard/clients/[id]/batch-ai.ts`:
- ✅ Wrapped in try/catch
- ✅ API key check upfront
- ❌ No timeout — SDK default may be too high for an interactive UI
- ❌ No retry/backoff for transient errors
- ❌ Batch path doesn't surface per-task failures to the user beyond a count

### Other wins

- `updateTaskStatus`, `updateTaskDraft`, `retryException`, `closeException`, `createClientManual`, `convertSubmission`, `processImport`, `markSopReviewed`, `setClientActive`, all `outreach/*` actions, `stats/captureDailySnapshot` — all return structured `{ success, message }` and check their primary errors.

---

## 5. EMPTY STATE CHECK

| Page | Empty State | Risk |
|---|---|---|
| `dashboard/page.tsx` (owner) | All counts coalesced to 0; arrays default to `[]` | ✅ HANDLED |
| `dashboard/page.tsx` (VA) | Same pattern | ✅ HANDLED |
| `queue/page.tsx` | `(tasks ?? []).map()` everywhere | ✅ HANDLED |
| `clients/page.tsx` | Explicit `EmptyState` at zero rows | ✅ HANDLED |
| `clients/[id]/page.tsx` | Uses `.single()` on `clients` (line 53). If client missing → calls `notFound()` which renders the 404 page. Acceptable. | ✅ HANDLED |
| `clients/[id]/page.tsx` (sections) | Active tasks, services, platforms, imports — all conditionally rendered with empty fallbacks | ✅ HANDLED |
| `onboarding/page.tsx` | `EmptyState` when `submissions` empty | ✅ HANDLED |
| `outreach/page.tsx` | Builds batches from `allLeads ?? []` safely; `recentLeads ?? []` | ✅ HANDLED |
| `imports/page.tsx` | `EmptyState` on empty imports | ✅ HANDLED |
| `activity/page.tsx` | Passes data to client component which handles empty | ✅ HANDLED |
| `sops/page.tsx` | Passes `sops ?? []` to editor; editor shows empty state | ✅ HANDLED |
| `settings/page.tsx` | Passes `templates ?? []` | ✅ HANDLED |
| `exceptions/page.tsx` | `(exceptions ?? []).map()` + empty fallback | ✅ HANDLED |

**Subtle risk:** `clients/[id]/page.tsx` line 53 uses `.single()` on the client fetch. If the client ID doesn't exist, `.single()` returns an error, then `if (!client) notFound()` triggers. This is correct, but worth noting that `.single()` is the only place this pattern is safe — anywhere else, `.single()` on a missing row would crash.

I checked for other `.single()` usages: they appear in profile fetches (e.g., `profile = await supabase.from("profiles").select("*").eq("id", user.id).single()`). These are gated by `!user → redirect("/login")`, then auto-create if profile is missing in `dashboard/layout.tsx:25-37`. Safe.

**Severity:** None — empty states are well-handled across the dashboard. Tonight's hardening passes paid off.

---

## 6. AUTH CHECK

### Middleware

**No `middleware.ts` exists** at root or in `src/`. There is no centralized auth boundary. Every dashboard page enforces auth in its own server component.

### Per-page auth pattern

Every dashboard page follows this pattern at the top:
```ts
const { data: { user } } = await supabase.auth.getUser();
if (!user) redirect("/login");
```

`dashboard/layout.tsx:10-44` also enforces this and creates a profile if missing.

### Owner-only pages (verified)

The following pages add `if (profile?.role !== "owner") redirect("/dashboard")`:
- `dashboard/clients/page.tsx`
- `dashboard/clients/[id]/page.tsx`
- `dashboard/clients/new/page.tsx` (server-loaded portion)
- `dashboard/imports/page.tsx`
- `dashboard/outreach/page.tsx`
- `dashboard/onboarding/page.tsx`
- `dashboard/activity/page.tsx`
- `dashboard/sops/page.tsx`
- `dashboard/settings/page.tsx`
- `dashboard/exceptions/page.tsx`
- `dashboard/reports/page.tsx`
- `dashboard/tasks/page.tsx`

VA-accessible pages:
- `dashboard/page.tsx` — renders different overview by role
- `dashboard/queue/page.tsx` — accessible to both (but see Flow E: VAs see no tasks anyway)

### Authorization gaps

- ✅ A logged-out user hitting `/dashboard/anything` is redirected to `/login` by both the layout AND the page.
- ✅ A VA hitting an owner-only page is redirected to `/dashboard`.
- ⚠️ **Defense-in-depth:** With no `middleware.ts`, every new page is one-line-away from being unprotected. A single missed `redirect()` ships a hole. Recommend adding a minimal middleware that gates `/dashboard/*` on `auth.getUser()`.
- ✅ No `app/api/` directory exists, so no API route auth gaps.

### Server actions

Server actions in this codebase generally call `await supabase.auth.getUser()` to identify the actor (used as `actor_id` in events). They do NOT explicitly enforce role checks at the action level — they rely on RLS policies to enforce authorization at the database layer.

**Risk:** This is correct only if (a) RLS policies are correct and (b) `is_owner()` works. With `is_owner()` undefined (Section 2), the role check at the database layer for `daily_snapshots`, `client_invoices`, and `email_sequences` is broken.

---

## CONSOLIDATED SEVERITY LIST

### CRITICAL (must fix before Client 1)

1. **`is_owner()` SQL function undefined** — 4 RLS policies will fail evaluation. Add a migration that creates the function. (1 file, 5 minutes)
2. **VAs cannot see any tasks** — `assigned_va` is never populated by application code. Either set `assigned_va` on task creation (defaults to client owner's VA, or null = visible to all VAs) OR change the RLS policy to broaden VA access. Decide before fix. (2-3 files, ~20 minutes — needs design decision)
3. **`send_log` silent error swallow** — `.catch(() => {})` at `queue/actions.ts:83`. Replace with `console.error` + include failure in returned message. (1 file, 5 minutes)

### HIGH (should fix before Client 1)

4. **Cascading insert errors not checked** in `convertSubmission`, `createClientManual`, and `updateTaskStatus`. A single FK or RLS failure creates a half-onboarded client or a status change with no audit trail. (3 files, ~30 minutes)
5. **`task_events.insert()` not error-checked** at `queue/actions.ts:62`. Same pattern fix.
6. **Anthropic API: no timeout, no retry.** Add `timeout: 30000` (30s) to the SDK call at minimum; optional 1-retry on transient errors. (1 file, 10 minutes)
7. **`batchGenerateDrafts` doesn't surface per-task failures.** At minimum, push the failed task IDs to the toast message so Robin knows what to retry. (1 file, 10 minutes)

### MEDIUM (hardening — can defer to post-launch)

8. **No `middleware.ts`** — defense-in-depth gap. Add a small middleware that gates `/dashboard/*`. (1 new file, 10 minutes)
9. **Type assertion bypasses (`as any`)** — regenerate `database.types.ts` after migrations are confirmed in production. (1 file regen)
10. **Vercel production env vars** — Robin must manually verify in Vercel project settings. Not a code change; covered by smoke test.

### LOW (technical debt)

11. **Dead `send_logs` table** (plural) from migration 002 — never read or written. Leave in place; no action.
12. **Base tables (`clients`, `tasks`, `exceptions`, etc.) not in version-controlled migrations** — bootstrap risk for any future Supabase clone. Document or capture as a SQL dump. Not blocking Client 1.

---

## WHAT WORKS WELL (do not touch)

- Queue state machine and exception workflow
- Onboarding form → submission → owner review flow (the data path itself; only the cascading inserts need error checks)
- Apollo lead pull + segmentation + personalization
- Empty state rendering across every dashboard page
- Per-page auth enforcement (the pattern is consistent and correct, just lacks defense-in-depth)
- Daily snapshot capture (fire-and-forget design is appropriate)
- Toast notification system
- Exception routing UI

---

## PROPOSED PHASE 2 PLAN (do not execute until approved)

If approved, fixes will be applied in this order, one commit per fix:

1. `audit-fix: define is_owner() SQL function` — new migration `012_is_owner_function.sql`
2. `audit-fix: surface send_log insert failures` — replace silent catch in `queue/actions.ts`
3. `audit-fix: error-check task_events insert` — add error check at `queue/actions.ts:62-68`
4. `audit-fix: error-check cascading inserts in convertSubmission` — `onboarding/actions.ts`
5. `audit-fix: error-check cascading inserts in createClientManual` — `clients/new/actions.ts`
6. `audit-fix: VA task assignment` — set `assigned_va` on task inserts (DESIGN DECISION REQUIRED — see below)
7. `audit-fix: Anthropic API timeout + per-task failure surfacing` — `queue/ai-draft.ts` + `clients/[id]/batch-ai.ts`
8. `audit-fix: add middleware for /dashboard/*` — new `middleware.ts`

### DESIGN DECISION NEEDED for fix #6

The `tasks.assigned_va` column expects an email string. The application has no UI to assign tasks to VAs. Three options:

- **Option A (least change):** Drop the VA-restrictive RLS policy and let VAs see all non-CLOSED tasks. Matches the current intended behavior of "VA picks tasks from a shared queue."
- **Option B (default assignment):** On every task insert, set `assigned_va` to a configurable default VA email (e.g., a `default_va_email` env var). Requires Robin to maintain the env var.
- **Option C (proper assignment UI):** Add an assignment dropdown to tasks. Out of scope for tonight's audit work — would violate "no new features."

**Recommended: Option A** for Client 1 launch. It matches Robin's actual operating model (one shared queue) and removes the VA-visibility bug with minimum surface area. Confirm before I proceed.

---

## NEXT STEPS

This is the end of Phase 1. **I am stopping here and waiting for your review** before touching any code.

When you're ready, reply with:
- **"approve audit, proceed to Phase 2 with Option A"** (or B / C) — I'll fix in the order above, one commit each.
- **"approve some, defer others"** — list which severities to fix now vs. later.
- **questions** — anything you want me to dig into deeper before fixing.

I will not modify code, run migrations, or create new files until you approve.
