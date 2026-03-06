-- Create comprehensive users table for admin management
create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  username text unique not null,
  full_name text,
  payment_method text not null default 'crypto' check (payment_method in ('crypto')),
  transaction_id text unique,
  payment_amount decimal(10, 2) default 50.00,
  payment_status text not null default 'pending' check (payment_status in ('pending', 'completed', 'failed', 'verified')),
  account_status text not null default 'inactive' check (account_status in ('inactive', 'active', 'suspended')),
  admin_notes text,
  country text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  verified_at timestamp with time zone
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

-- Admin policy to allow admin access (requires is_admin claim)
create policy "admin_all_access" on public.users
  for all using ((select auth.jwt() ->> 'role') = 'service_role' or exists (
    select 1 from public.users where id = auth.uid() and account_status = 'admin'
  ));
