-- Devine academic platform schema (v2)
-- Run in Supabase SQL editor or via migration

create extension if not exists "pgcrypto";

-- Programs
create table if not exists programs (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade default auth.uid(),
  title text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table programs add column if not exists owner_id uuid references auth.users(id) on delete cascade;
alter table programs alter column owner_id set default auth.uid();
alter table programs alter column owner_id set not null;

create index if not exists idx_programs_owner_id on programs(owner_id);

-- Program membership (future expansion)
create table if not exists program_members (
  program_id uuid not null references programs(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'member',
  created_at timestamptz not null default now(),
  primary key (program_id, user_id)
);

alter table program_members drop constraint if exists program_members_role_check;
alter table program_members
  add constraint program_members_role_check
  check (role in ('owner', 'admin', 'staff', 'member'));

create index if not exists idx_program_members_user on program_members(user_id);

-- Academic domains (top-level divisions)
create table if not exists domains (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) default auth.uid(),
  code text,
  title text not null,
  description text,
  status text not null default 'active',
  created_at timestamptz not null default now()
);

alter table domains add column if not exists created_by uuid references auth.users(id);
alter table domains add column if not exists status text;
alter table domains alter column created_by set default auth.uid();
alter table domains alter column created_by set not null;
alter table domains alter column status set default 'active';
alter table domains alter column status set not null;

alter table domains drop constraint if exists domains_status_check;
alter table domains
  add constraint domains_status_check
  check (status in ('active', 'inactive', 'archived'));

create index if not exists idx_domains_created_by on domains(created_by);

-- Courses
create table if not exists courses (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references programs(id) on delete cascade,
  created_by uuid not null references auth.users(id) default auth.uid(),
  title text not null,
  description text,
  code text,
  department_or_domain text,
  credits_or_weight numeric,
  level text,
  learning_outcomes text,
  syllabus text,
  status text not null default 'active',
  domain_id uuid references domains(id) on delete set null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table courses add column if not exists created_by uuid references auth.users(id);
alter table courses add column if not exists code text;
alter table courses add column if not exists department_or_domain text;
alter table courses add column if not exists credits_or_weight numeric;
alter table courses add column if not exists level text;
alter table courses add column if not exists learning_outcomes text;
alter table courses add column if not exists syllabus text;
alter table courses add column if not exists status text;
alter table courses add column if not exists domain_id uuid references domains(id);
alter table courses alter column created_by set default auth.uid();
alter table courses alter column created_by set not null;
alter table courses alter column status set default 'active';
alter table courses alter column status set not null;

create index if not exists idx_courses_program_id on courses(program_id);
create index if not exists idx_courses_domain_id on courses(domain_id);

update courses set status = 'active' where status is null;

alter table courses drop constraint if exists courses_status_check;
alter table courses
  add constraint courses_status_check
  check (status in ('active', 'inactive', 'draft', 'archived'));

alter table courses drop constraint if exists courses_credits_check;
alter table courses
  add constraint courses_credits_check
  check (credits_or_weight is null or credits_or_weight >= 0);

-- Course prerequisites
create table if not exists course_prerequisites (
  course_id uuid not null references courses(id) on delete cascade,
  prerequisite_course_id uuid not null references courses(id) on delete cascade,
  created_by uuid not null references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now(),
  primary key (course_id, prerequisite_course_id)
);

alter table course_prerequisites add column if not exists created_by uuid references auth.users(id);
alter table course_prerequisites alter column created_by set default auth.uid();
alter table course_prerequisites alter column created_by set not null;

alter table course_prerequisites drop constraint if exists course_prerequisites_self_check;
alter table course_prerequisites
  add constraint course_prerequisites_self_check
  check (course_id <> prerequisite_course_id);

create index if not exists idx_course_prerequisites_prereq
  on course_prerequisites(prerequisite_course_id);

-- Modules
create table if not exists modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references courses(id) on delete cascade,
  created_by uuid not null references auth.users(id) default auth.uid(),
  title text not null,
  overview text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table modules add column if not exists created_by uuid references auth.users(id);
alter table modules alter column created_by set default auth.uid();
alter table modules alter column created_by set not null;

alter table modules drop constraint if exists modules_position_check;
alter table modules add constraint modules_position_check check (position >= 0);

create unique index if not exists idx_modules_course_position on modules(course_id, position);
create index if not exists idx_modules_course_id on modules(course_id);

-- Assignments
create table if not exists assignments (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  created_by uuid not null references auth.users(id) default auth.uid(),
  title text not null,
  instructions text not null,
  assignment_type text not null default 'general',
  due_at timestamptz,
  created_at timestamptz not null default now()
);

alter table assignments add column if not exists created_by uuid references auth.users(id);
alter table assignments add column if not exists assignment_type text;
alter table assignments alter column created_by set default auth.uid();
alter table assignments alter column created_by set not null;
alter table assignments alter column assignment_type set default 'general';
alter table assignments alter column assignment_type set not null;

alter table assignments drop constraint if exists assignments_type_check;
alter table assignments
  add constraint assignments_type_check
  check (
    assignment_type in (
      'general',
      'essay',
      'analysis',
      'exegesis',
      'translation',
      'problem_set',
      'presentation',
      'other'
    )
  );

create index if not exists idx_assignments_module_id on assignments(module_id);

-- Readings
create table if not exists readings (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references modules(id) on delete cascade,
  created_by uuid not null references auth.users(id) default auth.uid(),
  title text not null,
  author text,
  source_type text,
  primary_or_secondary text,
  tradition_or_era text,
  pages_or_length text,
  estimated_hours numeric,
  reference_url_or_citation text,
  status text not null default 'not_started',
  notes text,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table readings add column if not exists created_by uuid references auth.users(id);
alter table readings add column if not exists position integer;
alter table readings add column if not exists status text;
alter table readings add column if not exists estimated_hours numeric;
alter table readings alter column created_by set default auth.uid();
alter table readings alter column created_by set not null;
alter table readings alter column status set default 'not_started';
alter table readings alter column status set not null;
alter table readings alter column position set default 0;
alter table readings alter column position set not null;

alter table readings drop constraint if exists readings_position_check;
alter table readings add constraint readings_position_check check (position >= 0);
alter table readings drop constraint if exists readings_hours_check;
alter table readings add constraint readings_hours_check check (estimated_hours is null or estimated_hours >= 0);
alter table readings drop constraint if exists readings_status_check;
alter table readings
  add constraint readings_status_check
  check (status in ('not_started', 'in_progress', 'complete', 'skipped'));

create unique index if not exists idx_readings_module_position on readings(module_id, position);
create index if not exists idx_readings_module_id on readings(module_id);

-- Submissions
create table if not exists submissions (
  id uuid primary key default gen_random_uuid(),
  assignment_id uuid not null references assignments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  version integer not null,
  is_final boolean not null default false,
  created_at timestamptz not null default now(),
  unique (assignment_id, user_id, version)
);

alter table submissions drop constraint if exists submissions_version_check;
alter table submissions add constraint submissions_version_check check (version >= 1);

create index if not exists idx_submissions_assignment_user on submissions(assignment_id, user_id);
create unique index if not exists idx_submissions_final_unique
  on submissions(assignment_id, user_id)
  where is_final;
create unique index if not exists idx_submissions_id_version on submissions(id, version);

-- Critiques
create table if not exists critiques (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references submissions(id) on delete cascade,
  submission_version integer not null,
  model text,
  prompt_version text,
  overall_verdict text,
  thesis_strength text,
  structural_failures text[] not null default '{}',
  unsupported_claims text[] not null default '{}',
  vague_terms text[] not null default '{}',
  strongest_objection text,
  doctrinal_or_historical_imprecision text[] not null default '{}',
  rewrite_priorities text[] not null default '{}',
  score numeric,
  critique_json jsonb not null,
  created_at timestamptz not null default now()
);

alter table critiques add column if not exists submission_version integer;
alter table critiques add column if not exists model text;
alter table critiques add column if not exists prompt_version text;
alter table critiques add column if not exists overall_verdict text;
alter table critiques add column if not exists thesis_strength text;
alter table critiques add column if not exists structural_failures text[] not null default '{}';
alter table critiques add column if not exists unsupported_claims text[] not null default '{}';
alter table critiques add column if not exists vague_terms text[] not null default '{}';
alter table critiques add column if not exists strongest_objection text;
alter table critiques add column if not exists doctrinal_or_historical_imprecision text[] not null default '{}';
alter table critiques add column if not exists rewrite_priorities text[] not null default '{}';
alter table critiques add column if not exists score numeric;
alter table critiques add column if not exists critique_json jsonb;
alter table critiques alter column critique_json set default '{}'::jsonb;

alter table critiques drop column if exists summary;
alter table critiques drop column if exists strengths;
alter table critiques drop column if exists weaknesses;
alter table critiques drop column if exists suggestions;
alter table critiques drop column if exists raw;

update critiques c
set submission_version = s.version
from submissions s
where c.submission_id = s.id
  and c.submission_version is null;

update critiques set critique_json = '{}'::jsonb where critique_json is null;
alter table critiques alter column critique_json set not null;
alter table critiques alter column submission_version set not null;

create index if not exists idx_critiques_submission_id on critiques(submission_id);

alter table critiques drop constraint if exists critiques_submission_version_fkey;
alter table critiques
  add constraint critiques_submission_version_fkey
  foreign key (submission_id, submission_version)
  references submissions(id, version)
  on delete cascade;

-- Concepts
create table if not exists concepts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null default 'term',
  description text,
  related_course_id uuid references courses(id) on delete set null,
  related_module_id uuid references modules(id) on delete set null,
  status text not null default 'active',
  created_by uuid not null references auth.users(id) default auth.uid(),
  created_at timestamptz not null default now()
);

alter table concepts add column if not exists created_by uuid references auth.users(id);
alter table concepts add column if not exists status text;
alter table concepts add column if not exists type text;
alter table concepts alter column created_by set default auth.uid();
alter table concepts alter column created_by set not null;
alter table concepts alter column status set default 'active';
alter table concepts alter column status set not null;
alter table concepts alter column type set default 'term';
alter table concepts alter column type set not null;

alter table concepts drop constraint if exists concepts_type_check;
alter table concepts
  add constraint concepts_type_check
  check (type in ('term', 'thinker', 'council', 'doctrine', 'debate', 'distinction', 'other'));

alter table concepts drop constraint if exists concepts_status_check;
alter table concepts
  add constraint concepts_status_check
  check (status in ('active', 'draft', 'archived'));

create index if not exists idx_concepts_course_id on concepts(related_course_id);
create index if not exists idx_concepts_module_id on concepts(related_module_id);

-- Submission version integrity
create or replace function enforce_submission_version()
returns trigger as $$
declare
  max_version integer;
  lock_key bigint;
begin
  lock_key := hashtext(new.assignment_id::text || ':' || new.user_id::text);
  perform pg_advisory_xact_lock(lock_key);

  select coalesce(max(version), 0)
    into max_version
  from submissions
  where assignment_id = new.assignment_id
    and user_id = new.user_id;

  if new.version is null then
    new.version := max_version + 1;
  elsif new.version <> max_version + 1 then
    raise exception 'Invalid submission version %; expected %', new.version, max_version + 1;
  end if;

  return new;
end;
$$ language plpgsql;

create or replace function set_critique_submission_version()
returns trigger as $$
declare
  current_version integer;
begin
  select version into current_version
  from submissions
  where id = new.submission_id;

  if current_version is null then
    raise exception 'Submission not found for critique.';
  end if;

  if new.submission_version is null then
    new.submission_version := current_version;
  elsif new.submission_version <> current_version then
    raise exception 'Critique submission version mismatch.';
  end if;

  return new;
end;
$$ language plpgsql;

create or replace function prevent_submission_identity_change()
returns trigger as $$
begin
  if new.assignment_id <> old.assignment_id
     or new.user_id <> old.user_id
     or new.version <> old.version then
    raise exception 'Submission identity fields are immutable.';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists submissions_version_integrity on submissions;
drop trigger if exists critiques_set_submission_version on critiques;
drop trigger if exists submissions_immutable_fields on submissions;

create trigger submissions_version_integrity
before insert on submissions
for each row execute function enforce_submission_version();

create trigger critiques_set_submission_version
before insert on critiques
for each row execute function set_critique_submission_version();

create trigger submissions_immutable_fields
before update on submissions
for each row execute function prevent_submission_identity_change();

-- RLS
alter table programs enable row level security;
alter table program_members enable row level security;
alter table domains enable row level security;
alter table courses enable row level security;
alter table course_prerequisites enable row level security;
alter table modules enable row level security;
alter table assignments enable row level security;
alter table readings enable row level security;
alter table submissions enable row level security;
alter table critiques enable row level security;
alter table concepts enable row level security;

-- Drop existing policies for clean re-apply
Drop policy if exists "Programs are readable by authenticated users" on programs;
Drop policy if exists "Courses are readable by authenticated users" on courses;
Drop policy if exists "Modules are readable by authenticated users" on modules;
Drop policy if exists "Assignments are readable by authenticated users" on assignments;
Drop policy if exists "Users can view their submissions" on submissions;
Drop policy if exists "Users can create their submissions" on submissions;
Drop policy if exists "Users can update their submissions" on submissions;
Drop policy if exists "Users can view critiques for their submissions" on critiques;
Drop policy if exists "Users can create critiques for their submissions" on critiques;

Drop policy if exists "Programs select" on programs;
Drop policy if exists "Programs insert" on programs;
Drop policy if exists "Programs update" on programs;
Drop policy if exists "Programs delete" on programs;
Drop policy if exists "Program members select" on program_members;
Drop policy if exists "Program members insert" on program_members;
Drop policy if exists "Program members update" on program_members;
Drop policy if exists "Program members delete" on program_members;
Drop policy if exists "Domains select" on domains;
Drop policy if exists "Domains insert" on domains;
Drop policy if exists "Domains update" on domains;
Drop policy if exists "Domains delete" on domains;
Drop policy if exists "Courses select" on courses;
Drop policy if exists "Courses insert" on courses;
Drop policy if exists "Courses update" on courses;
Drop policy if exists "Courses delete" on courses;
Drop policy if exists "Course prerequisites select" on course_prerequisites;
Drop policy if exists "Course prerequisites insert" on course_prerequisites;
Drop policy if exists "Course prerequisites delete" on course_prerequisites;
Drop policy if exists "Modules select" on modules;
Drop policy if exists "Modules insert" on modules;
Drop policy if exists "Modules update" on modules;
Drop policy if exists "Modules delete" on modules;
Drop policy if exists "Assignments select" on assignments;
Drop policy if exists "Assignments insert" on assignments;
Drop policy if exists "Assignments update" on assignments;
Drop policy if exists "Assignments delete" on assignments;
Drop policy if exists "Readings select" on readings;
Drop policy if exists "Readings insert" on readings;
Drop policy if exists "Readings update" on readings;
Drop policy if exists "Readings delete" on readings;
Drop policy if exists "Submissions select" on submissions;
Drop policy if exists "Submissions insert" on submissions;
Drop policy if exists "Submissions update" on submissions;
Drop policy if exists "Critiques select" on critiques;
Drop policy if exists "Critiques insert" on critiques;
Drop policy if exists "Concepts select" on concepts;
Drop policy if exists "Concepts insert" on concepts;
Drop policy if exists "Concepts update" on concepts;
Drop policy if exists "Concepts delete" on concepts;

-- Programs: owner + members
create policy "Programs select" on programs
  for select to authenticated
  using (
    owner_id = auth.uid()
    or exists (
      select 1 from program_members pm
      where pm.program_id = programs.id
        and pm.user_id = auth.uid()
    )
  );

create policy "Programs insert" on programs
  for insert to authenticated
  with check (owner_id = auth.uid());

create policy "Programs update" on programs
  for update to authenticated
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Programs delete" on programs
  for delete to authenticated
  using (owner_id = auth.uid());

-- Program members
create policy "Program members select" on program_members
  for select to authenticated
  using (
    user_id = auth.uid()
    or exists (
      select 1 from programs p
      where p.id = program_members.program_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Program members insert" on program_members
  for insert to authenticated
  with check (
    exists (
      select 1 from programs p
      where p.id = program_members.program_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Program members update" on program_members
  for update to authenticated
  using (
    exists (
      select 1 from programs p
      where p.id = program_members.program_id
        and p.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from programs p
      where p.id = program_members.program_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Program members delete" on program_members
  for delete to authenticated
  using (
    exists (
      select 1 from programs p
      where p.id = program_members.program_id
        and p.owner_id = auth.uid()
    )
  );

-- Domains
create policy "Domains select" on domains
  for select to authenticated
  using (
    created_by = auth.uid()
    or exists (
      select 1
      from courses c
      join programs p on p.id = c.program_id
      where c.domain_id = domains.id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1
      from courses c
      join program_members pm on pm.program_id = c.program_id
      where c.domain_id = domains.id
        and pm.user_id = auth.uid()
    )
  );

create policy "Domains insert" on domains
  for insert to authenticated
  with check (created_by = auth.uid());

create policy "Domains update" on domains
  for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "Domains delete" on domains
  for delete to authenticated
  using (created_by = auth.uid());

-- Courses
create policy "Courses select" on courses
  for select to authenticated
  using (
    exists (
      select 1 from programs p
      where p.id = courses.program_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from program_members pm
      where pm.program_id = courses.program_id
        and pm.user_id = auth.uid()
    )
  );

create policy "Courses insert" on courses
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      exists (
        select 1 from programs p
        where p.id = courses.program_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1 from program_members pm
        where pm.program_id = courses.program_id
          and pm.user_id = auth.uid()
          and pm.role in ('owner', 'admin', 'staff')
      )
    )
  );

create policy "Courses update" on courses
  for update to authenticated
  using (
    exists (
      select 1 from programs p
      where p.id = courses.program_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from program_members pm
      where pm.program_id = courses.program_id
        and pm.user_id = auth.uid()
        and pm.role in ('owner', 'admin', 'staff')
    )
  )
  with check (
    created_by = auth.uid()
    or exists (
      select 1 from programs p
      where p.id = courses.program_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Courses delete" on courses
  for delete to authenticated
  using (
    exists (
      select 1 from programs p
      where p.id = courses.program_id
        and p.owner_id = auth.uid()
    )
  );

-- Course prerequisites
create policy "Course prerequisites select" on course_prerequisites
  for select to authenticated
  using (
    exists (
      select 1 from courses c
      join programs p on p.id = c.program_id
      where c.id = course_prerequisites.course_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from courses c
      join program_members pm on pm.program_id = c.program_id
      where c.id = course_prerequisites.course_id
        and pm.user_id = auth.uid()
    )
  );

create policy "Course prerequisites insert" on course_prerequisites
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      exists (
        select 1 from courses c
        join programs p on p.id = c.program_id
        where c.id = course_prerequisites.course_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1 from courses c
        join program_members pm on pm.program_id = c.program_id
        where c.id = course_prerequisites.course_id
          and pm.user_id = auth.uid()
          and pm.role in ('owner', 'admin', 'staff')
      )
    )
    and (
      exists (
        select 1 from courses c
        join programs p on p.id = c.program_id
        where c.id = course_prerequisites.prerequisite_course_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1 from courses c
        join program_members pm on pm.program_id = c.program_id
        where c.id = course_prerequisites.prerequisite_course_id
          and pm.user_id = auth.uid()
          and pm.role in ('owner', 'admin', 'staff')
      )
    )
  );

create policy "Course prerequisites delete" on course_prerequisites
  for delete to authenticated
  using (
    exists (
      select 1 from courses c
      join programs p on p.id = c.program_id
      where c.id = course_prerequisites.course_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from courses c
      join program_members pm on pm.program_id = c.program_id
      where c.id = course_prerequisites.course_id
        and pm.user_id = auth.uid()
        and pm.role in ('owner', 'admin', 'staff')
    )
  );

-- Modules
create policy "Modules select" on modules
  for select to authenticated
  using (
    exists (
      select 1 from courses c
      join programs p on p.id = c.program_id
      where c.id = modules.course_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from courses c
      join program_members pm on pm.program_id = c.program_id
      where c.id = modules.course_id
        and pm.user_id = auth.uid()
    )
  );

create policy "Modules insert" on modules
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      exists (
        select 1 from courses c
        join programs p on p.id = c.program_id
        where c.id = modules.course_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1 from courses c
        join program_members pm on pm.program_id = c.program_id
        where c.id = modules.course_id
          and pm.user_id = auth.uid()
          and pm.role in ('owner', 'admin', 'staff')
      )
    )
  );

create policy "Modules update" on modules
  for update to authenticated
  using (
    exists (
      select 1 from courses c
      join programs p on p.id = c.program_id
      where c.id = modules.course_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from courses c
      join program_members pm on pm.program_id = c.program_id
      where c.id = modules.course_id
        and pm.user_id = auth.uid()
        and pm.role in ('owner', 'admin', 'staff')
    )
  )
  with check (
    created_by = auth.uid()
    or exists (
      select 1 from courses c
      join programs p on p.id = c.program_id
      where c.id = modules.course_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Modules delete" on modules
  for delete to authenticated
  using (
    exists (
      select 1 from courses c
      join programs p on p.id = c.program_id
      where c.id = modules.course_id
        and p.owner_id = auth.uid()
    )
  );

-- Assignments
create policy "Assignments select" on assignments
  for select to authenticated
  using (
    exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join programs p on p.id = c.program_id
      where m.id = assignments.module_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join program_members pm on pm.program_id = c.program_id
      where m.id = assignments.module_id
        and pm.user_id = auth.uid()
    )
  );

create policy "Assignments insert" on assignments
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      exists (
        select 1 from modules m
        join courses c on c.id = m.course_id
        join programs p on p.id = c.program_id
        where m.id = assignments.module_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1 from modules m
        join courses c on c.id = m.course_id
        join program_members pm on pm.program_id = c.program_id
        where m.id = assignments.module_id
          and pm.user_id = auth.uid()
          and pm.role in ('owner', 'admin', 'staff')
      )
    )
  );

create policy "Assignments update" on assignments
  for update to authenticated
  using (
    exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join programs p on p.id = c.program_id
      where m.id = assignments.module_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join program_members pm on pm.program_id = c.program_id
      where m.id = assignments.module_id
        and pm.user_id = auth.uid()
        and pm.role in ('owner', 'admin', 'staff')
    )
  )
  with check (
    created_by = auth.uid()
    or exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join programs p on p.id = c.program_id
      where m.id = assignments.module_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Assignments delete" on assignments
  for delete to authenticated
  using (
    exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join programs p on p.id = c.program_id
      where m.id = assignments.module_id
        and p.owner_id = auth.uid()
    )
  );

-- Readings
create policy "Readings select" on readings
  for select to authenticated
  using (
    exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join programs p on p.id = c.program_id
      where m.id = readings.module_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join program_members pm on pm.program_id = c.program_id
      where m.id = readings.module_id
        and pm.user_id = auth.uid()
    )
  );

create policy "Readings insert" on readings
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      exists (
        select 1 from modules m
        join courses c on c.id = m.course_id
        join programs p on p.id = c.program_id
        where m.id = readings.module_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1 from modules m
        join courses c on c.id = m.course_id
        join program_members pm on pm.program_id = c.program_id
        where m.id = readings.module_id
          and pm.user_id = auth.uid()
          and pm.role in ('owner', 'admin', 'staff')
      )
    )
  );

create policy "Readings update" on readings
  for update to authenticated
  using (
    exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join programs p on p.id = c.program_id
      where m.id = readings.module_id
        and p.owner_id = auth.uid()
    )
    or exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join program_members pm on pm.program_id = c.program_id
      where m.id = readings.module_id
        and pm.user_id = auth.uid()
        and pm.role in ('owner', 'admin', 'staff')
    )
  )
  with check (
    created_by = auth.uid()
    or exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join programs p on p.id = c.program_id
      where m.id = readings.module_id
        and p.owner_id = auth.uid()
    )
  );

create policy "Readings delete" on readings
  for delete to authenticated
  using (
    exists (
      select 1 from modules m
      join courses c on c.id = m.course_id
      join programs p on p.id = c.program_id
      where m.id = readings.module_id
        and p.owner_id = auth.uid()
    )
  );

-- Submissions
create policy "Submissions select" on submissions
  for select to authenticated
  using (auth.uid() = user_id);

create policy "Submissions insert" on submissions
  for insert to authenticated
  with check (auth.uid() = user_id);

create policy "Submissions update" on submissions
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Critiques
create policy "Critiques select" on critiques
  for select to authenticated
  using (
    exists (
      select 1 from submissions s
      where s.id = critiques.submission_id
        and s.user_id = auth.uid()
    )
  );

create policy "Critiques insert" on critiques
  for insert to authenticated
  with check (
    exists (
      select 1 from submissions s
      where s.id = critiques.submission_id
        and s.user_id = auth.uid()
    )
  );

-- Concepts
create policy "Concepts select" on concepts
  for select to authenticated
  using (
    created_by = auth.uid()
    or (
      related_course_id is not null
      and (
        exists (
          select 1 from courses c
          join programs p on p.id = c.program_id
          where c.id = concepts.related_course_id
            and p.owner_id = auth.uid()
        )
        or exists (
          select 1 from courses c
          join program_members pm on pm.program_id = c.program_id
          where c.id = concepts.related_course_id
            and pm.user_id = auth.uid()
        )
      )
    )
    or (
      related_module_id is not null
      and (
        exists (
          select 1 from modules m
          join courses c on c.id = m.course_id
          join programs p on p.id = c.program_id
          where m.id = concepts.related_module_id
            and p.owner_id = auth.uid()
        )
        or exists (
          select 1 from modules m
          join courses c on c.id = m.course_id
          join program_members pm on pm.program_id = c.program_id
          where m.id = concepts.related_module_id
            and pm.user_id = auth.uid()
        )
      )
    )
  );

create policy "Concepts insert" on concepts
  for insert to authenticated
  with check (
    created_by = auth.uid()
    and (
      related_course_id is null
      or exists (
        select 1 from courses c
        join programs p on p.id = c.program_id
        where c.id = concepts.related_course_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1 from courses c
        join program_members pm on pm.program_id = c.program_id
        where c.id = concepts.related_course_id
          and pm.user_id = auth.uid()
          and pm.role in ('owner', 'admin', 'staff')
      )
    )
    and (
      related_module_id is null
      or exists (
        select 1 from modules m
        join courses c on c.id = m.course_id
        join programs p on p.id = c.program_id
        where m.id = concepts.related_module_id
          and p.owner_id = auth.uid()
      )
      or exists (
        select 1 from modules m
        join courses c on c.id = m.course_id
        join program_members pm on pm.program_id = c.program_id
        where m.id = concepts.related_module_id
          and pm.user_id = auth.uid()
          and pm.role in ('owner', 'admin', 'staff')
      )
    )
  );

create policy "Concepts update" on concepts
  for update to authenticated
  using (created_by = auth.uid())
  with check (created_by = auth.uid());

create policy "Concepts delete" on concepts
  for delete to authenticated
  using (created_by = auth.uid());
