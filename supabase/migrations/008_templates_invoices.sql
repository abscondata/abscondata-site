-- Template enabled toggle
ALTER TABLE task_templates ADD COLUMN IF NOT EXISTS enabled boolean DEFAULT true;

-- Client invoices for billing tracking
CREATE TABLE IF NOT EXISTS client_invoices (
  id bigint generated always as identity primary key,
  client_id bigint references clients(id) on delete cascade,
  invoice_date date not null,
  amount decimal(10,2) not null,
  status text default 'sent' check (status in ('sent', 'paid', 'overdue')),
  notes text,
  created_at timestamptz default now()
);

ALTER TABLE client_invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owners manage invoices" ON client_invoices
  FOR ALL USING (is_owner());
