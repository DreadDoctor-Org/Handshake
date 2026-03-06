-- Create payments audit table for transaction tracking
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  payment_method text not null default 'crypto' check (payment_method in ('crypto')),
  amount_usd decimal(10, 2),
  transaction_id text not null,
  crypto_tx_hash text,
  status text not null default 'pending' check (status in ('pending', 'completed', 'failed', 'cancelled')),
  metadata jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.payments enable row level security;

-- Create RLS policies
create policy "payments_select_own" on public.payments
  for select using (auth.uid() = user_id);

create policy "payments_insert_own" on public.payments
  for insert with check (auth.uid() = user_id);
