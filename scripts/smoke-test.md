# Smoke Test — Client 1 Pre-Launch Checklist

**Run this checklist start-to-finish in production (or staging that mirrors prod) before Client 1 onboards.**
**Target time: 15 minutes.** Stop and fix immediately if any check fails.

---

## 0. Pre-flight (do this first, ~2 min)

[ ] **0.1** — Confirm all migrations through `014_drop_dead_send_logs.sql` have been applied to the production Supabase project. Verify in the Supabase SQL editor:
```sql
SELECT routine_name FROM information_schema.routines
WHERE routine_schema = 'public' AND routine_name = 'is_owner';
```
Should return one row. If empty, run `012_is_owner_function.sql`.

[ ] **0.2** — Confirm Vercel production env vars are set in Project Settings → Environment Variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ANTHROPIC_API_KEY`
- `APOLLO_API_KEY`

[ ] **0.3** — Open production URL in a clean browser session (incognito). Open browser DevTools console — leave it open for the entire smoke test.

---

## 1. Owner login + dashboard load (~1 min)

[ ] **1.1** — Log in as the owner account at `/login`. Should redirect to `/dashboard` with no errors in console.

[ ] **1.2** — Owner overview renders with: greeting, action strip cards (review/new/onboarding counts), recent activity, client health, last 7 days chart, today's progress, motivation quote at bottom.

[ ] **1.3** — No `is_owner() does not exist` error in console (would indicate migration 012 not applied).

[ ] **1.4** — Click each top-nav link: Overview, Queue, Clients, Imports, Outreach, Activity, SOPs, Onboarding, Settings. Every page loads. No console errors.

---

## 2. Onboarding submission → client conversion (~3 min)

[ ] **2.1** — Open `/onboarding` in a separate incognito window (public form).

[ ] **2.2** — Submit a test submission with: company "Smoke Test Co", contact "Test User", email `smoketest+1@example.com`, phone, industry "plumbing", at least 1 service selected, 1 platform selected. Confirm success page.

[ ] **2.3** — Back in the owner dashboard, navigate to `/dashboard/onboarding`. The new submission appears at the top with status "pending".

[ ] **2.4** — Click "Convert to Client" on the submission. **Expected toast: "Submission converted to client"** (no warnings).

[ ] **2.5** — Click through to the new client detail page. Verify:
- Client name "Smoke Test Co" displayed
- Services section shows the selected service
- Platforms section shows the selected platform
- Active Tasks section shows ≥1 starter task (from task_templates)

[ ] **2.6** — If the toast in 2.4 included `(warnings: ...)`, **STOP**. The cascading insert error-checking is now surfacing a real failure. Check the browser console for the `[convertSubmission]` error log and resolve before continuing.

---

## 3. Queue: AI draft → approve → sent → log (~3 min)

[ ] **3.1** — Navigate to `/dashboard/queue`. The starter task from step 2 should be visible with status NEW.

[ ] **3.2** — Click the task to expand it. Click "Generate Draft". Either:
- ✅ Success: AI draft populates the read-only textarea, toast says "AI draft generated"
- OR ✅ Acceptable error: toast shows "AI draft generation failed: <reason>" or "AI drafts not configured" — but **does not crash the page**

[ ] **3.3** — If draft generated successfully, click "Start Working" (NEW → READY_FOR_REVIEW). Toast: "Task moved to review".

[ ] **3.4** — In the editable Final Draft textarea, edit the draft slightly (any change). Click outside to blur — toast: "Draft saved".

[ ] **3.5** — Click "Approve" (READY_FOR_REVIEW → APPROVED). Toast: "Task approved".

[ ] **3.6** — Click "Mark Sent" (APPROVED → SENT). Toast: **"Task marked as sent"** with NO warning suffix. If the toast says `(warning: send log not written ...)`, **STOP** — the send_log table or RLS is misconfigured.

[ ] **3.7** — Verify in Supabase SQL editor:
```sql
SELECT id, recipient_name, sent_content, sent_at FROM send_log ORDER BY sent_at DESC LIMIT 1;
```
Should return the just-sent task with the edited content. If zero rows, send_log writes are silently failing.

[ ] **3.8** — Click "Close Task" (SENT → CLOSED). Task disappears from active filters.

---

## 4. Keyboard shortcuts (~30 sec)

[ ] **4.1** — Open another NEW task in the queue. Press `A` — should approve (only valid from READY_FOR_REVIEW; NEW tasks won't react). Press `Esc` — collapses the task.

[ ] **4.2** — Expand a task in READY_FOR_REVIEW status, press `A` — task approves. Toast appears.

---

## 5. Exception handling (~1 min)

[ ] **5.1** — In the queue, expand a NEW task. Click "Needs Info", enter a note, click "Mark Waiting". Status → WAITING_ON_MISSING_DATA.

[ ] **5.2** — Click the task again. From WAITING, click "Ready for Review", then on the next state click "Reject", enter a reason, confirm. Status → EXCEPTION.

[ ] **5.3** — On an EXCEPTION task, click "Retry". Task moves back to NEW. Toast confirms.

[ ] **5.4** — Navigate to `/dashboard/exceptions`. Page loads without error. (Will be empty since the test exception was retried — that's fine.)

---

## 6. VA shared queue access (~2 min)

[ ] **6.1** — Sign out. Sign in as a VA-role user (one with `profiles.role = 'va'`).

[ ] **6.2** — Dashboard loads with the VA overview (showing review count, waiting count, recent activity).

[ ] **6.3** — Navigate to `/dashboard/queue`. **VA should see the shared queue with all open tasks** (Option A: shared queue, no per-VA filtering). If the queue is empty even though tasks exist, migration 013 was not applied.

[ ] **6.4** — Try to navigate directly to `/dashboard/clients` in the URL bar. Should redirect to `/dashboard` (owner-only enforcement).

[ ] **6.5** — Try `/dashboard/onboarding`, `/dashboard/imports`, `/dashboard/outreach`, `/dashboard/sops`, `/dashboard/settings`, `/dashboard/activity` — each redirects to `/dashboard` for VA users.

[ ] **6.6** — Sign out, sign back in as owner.

---

## 7. Lead pull + segmentation (~1 min) — only if Apollo budget allows

**Skip this section if Apollo credits are tight. Lead system was tested in prior sessions.**

[ ] **7.1** — Navigate to `/dashboard/outreach`. Page loads. The "Optimal Send Times" info card is visible at the top.

[ ] **7.2** — If any leads have null segment, the "Backfill Segments" button is visible — click it. Toast: "Backfilled X leads".

[ ] **7.3** — Verify in Supabase:
```sql
SELECT COUNT(*) FROM outreach_leads WHERE segment IS NULL;
```
Should be 0 after backfill.

[ ] **7.4** — Click "Generate New Batch" (consumes Apollo credits). After completion, verify new leads have non-null `segment` and `personalization_line`:
```sql
SELECT segment, personalization_line FROM outreach_leads ORDER BY created_at DESC LIMIT 5;
```

---

## 8. Empty state spot checks (~30 sec)

[ ] **8.1** — Navigate to `/dashboard/imports`. If no imports yet, EmptyState renders (does not crash).

[ ] **8.2** — Navigate to `/dashboard/sops`. SOP editor loads, even with zero SOPs.

[ ] **8.3** — Navigate to `/dashboard/activity`. Activity log loads. If no events, empty state renders.

[ ] **8.4** — Navigate to `/dashboard/settings`. Account section, system info, and task templates section all render.

---

## 9. Console + DB final sweep (~1 min)

[ ] **9.1** — Browser console: scan for any red errors accumulated during the test. Anything starting with `[updateTaskStatus]`, `[convertSubmission]`, `[createClientManual]`, `[generateAiDraft]`, `[batchGenerateDrafts]` is a real failure surfaced by the audit fixes — investigate the row in question.

[ ] **9.2** — Supabase SQL editor sanity:
```sql
-- task_events should have rows for the smoke test transitions
SELECT event_type, created_at FROM task_events ORDER BY created_at DESC LIMIT 10;

-- send_log should have at least one row from step 3.6
SELECT COUNT(*) FROM send_log WHERE sent_at > now() - interval '1 hour';
```

[ ] **9.3** — Clean up test data (optional but recommended):
```sql
-- Replace 'Smoke Test Co' if you used a different name
DELETE FROM clients WHERE name = 'Smoke Test Co';
-- Cascades to client_services, client_platforms, tasks, task_events, send_log via FK
```

---

## Pass criteria

All checked items pass with **no console errors** and **no toast warnings** that include `(warning: ...)`.

If any step fails, the priority order for investigation is:
1. Migration not applied → re-run the relevant SQL file
2. Vercel env var missing → set in Project Settings, redeploy
3. RLS policy failure → check Supabase logs
4. Application bug → check the browser console for the `[function_name]` error log added by audit fixes

## Owner sign-off

Tester: _______________________  Date: _______________________
Result: [ ] PASS — cleared for Client 1   [ ] FAIL — see notes:
