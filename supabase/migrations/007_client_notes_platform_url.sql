-- Client notes column (may already exist from initial schema)
ALTER TABLE clients ADD COLUMN IF NOT EXISTS notes text;

-- Platform URL column for quick links
ALTER TABLE client_platforms ADD COLUMN IF NOT EXISTS platform_url text;
