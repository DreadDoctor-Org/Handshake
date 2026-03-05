-- Create users table with payment tracking
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  payment_method text not null default 'pending' check (payment_method in ('stripe', 'crypto', 'pending')),
  transaction_id text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'completed', 'failed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- Create RLS policies
create policy "users_select_own" on public.users
  for select using (auth.uid() = id);

create policy "users_update_own" on public.users
  for update using (auth.uid() = id);

create policy "users_insert_own" on public.users
  for insert with check (auth.uid() = id);
