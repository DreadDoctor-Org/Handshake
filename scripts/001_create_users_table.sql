-- Create users table with payment tracking
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  username text unique not null,
  payment_method text not null check (payment_method in ('stripe', 'crypto')),
  transaction_id text,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'completed', 'failed')),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.users enable row level security;

-- Create RLS policies
create policy "Users can view their own profile" on public.users
  for select using (auth.uid() = id);

create policy "Users can update their own profile" on public.users
  for update using (auth.uid() = id);

create policy "Allow inserts for new users during signup" on public.users
  for insert with check (auth.uid() = id);

create policy "Service role can select all users for admin" on public.users
  for select using (
    (select auth.jwt() ->> 'role') = 'service_role'
  );
