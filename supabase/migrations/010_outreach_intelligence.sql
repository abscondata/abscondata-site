-- Lead segmentation
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS segment text;
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS personalization_line text;

-- Response pipeline tracking
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS response_status text DEFAULT 'no_response';
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS response_notes text;
ALTER TABLE outreach_leads ADD COLUMN IF NOT EXISTS response_date timestamptz;

-- Email sequence variants
CREATE TABLE IF NOT EXISTS email_sequences (
  id bigint generated always as identity primary key,
  name text not null,
  step1_subject text,
  step1_body text,
  step2_subject text,
  step2_body text,
  step3_subject text,
  step3_body text,
  active boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

ALTER TABLE email_sequences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage sequences" ON email_sequences
  FOR ALL USING (is_owner());

-- Seed Variant A
INSERT INTO email_sequences (name, step1_subject, step1_body, step2_subject, step2_body, step3_subject, step3_body, active) VALUES (
  'Variant A — Current',
  '{{companyName}} back office operations',
  'Hi {{firstName}},

{{personalization}}

I run Abscondata, a managed back-office service for small service businesses in Florida. We handle invoicing, payment follow-ups, review requests, and weekly reporting so the owner can stop drowning in admin.

Flat monthly rate. Month-to-month. Florida-based.

Worth a quick call to see if it fits?

Robin
Abscondata',
  're: {{companyName}} back office operations',
  'Hi {{firstName}},

Following up on my note from earlier this week.

What an engagement looks like: we use your existing tools (QuickBooks, your CRM, Google Business Profile, whatever you have). A trained operator handles invoicing and follow-ups every day, you get a weekly summary of what was done, and you stay in control of everything that goes out.

No software to buy. No long contracts. 30-day cancel anytime.

Open to a 15-minute call this week?

Robin
Abscondata',
  '{{companyName}}',
  'Hi {{firstName}},

Last note from me.

If back-office work is something you want off your plate, here is the link to share what you need: https://abscondata.com/onboarding

If not, no problem. I will leave you alone.

Robin
Abscondata',
  true
);
