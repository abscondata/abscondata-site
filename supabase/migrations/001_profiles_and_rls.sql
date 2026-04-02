-- Profiles table for role-based access
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null unique,
  role text not null default 'va' check (role in ('owner', 'va'))
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles: users can read their own profile
create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

-- Profiles: owners can read all profiles
create policy "Owners can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

-- Auto-create profile on signup via trigger
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (new.id, new.email, 'va');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS for tasks: VAs see only their assigned tasks, owners see all
alter table public.tasks enable row level security;

create policy "Owners can do everything on tasks"
  on public.tasks for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

create policy "VAs can read their assigned tasks"
  on public.tasks for select
  using (
    assigned_va = (select email from public.profiles where id = auth.uid())
  );

create policy "VAs can update their assigned tasks"
  on public.tasks for update
  using (
    assigned_va = (select email from public.profiles where id = auth.uid())
  );

-- RLS for clients: owners only
alter table public.clients enable row level security;

create policy "Owners can do everything on clients"
  on public.clients for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

-- RLS for exceptions: owners only
alter table public.exceptions enable row level security;

create policy "Owners can do everything on exceptions"
  on public.exceptions for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

-- RLS for weekly_reports: owners only
alter table public.weekly_reports enable row level security;

create policy "Owners can do everything on weekly_reports"
  on public.weekly_reports for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

-- RLS for task_logs: owners see all, VAs can insert
alter table public.task_logs enable row level security;

create policy "Owners can do everything on task_logs"
  on public.task_logs for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

create policy "VAs can insert task_logs"
  on public.task_logs for insert
  with check (true);

-- RLS for sops: owners only
alter table public.sops enable row level security;

create policy "Owners can do everything on sops"
  on public.sops for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );

-- RLS for files: owners only
alter table public.files enable row level security;

create policy "Owners can do everything on files"
  on public.files for all
  using (
    exists (
      select 1 from public.profiles
      where id = auth.uid() and role = 'owner'
    )
  );
