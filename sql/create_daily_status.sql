-- Enable pgcrypto for UUID generation
create extension if not exists "pgcrypto";

-- Drop table to ensure fresh schema with correct constraints (fixes UPSERT issues)
drop table if exists daily_status cascade;

-- Create daily_status table
create table daily_status (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  energy_level text check (energy_level in ('high', 'medium', 'low')),
  mood text check (mood in ('good', 'meh', 'difficult')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, date)
);

-- Enable RLS
alter table daily_status enable row level security;

-- Policies (Drop first to avoid errors if re-running)
drop policy if exists "Users can view their own daily status" on daily_status;
drop policy if exists "Users can insert/update their own daily status" on daily_status;

create policy "Users can view their own daily status"
  on daily_status for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own daily status"
  on daily_status for all
  using (auth.uid() = user_id);

-- Create index for faster querying by date
create index if not exists daily_status_user_date_idx on daily_status(user_id, date);
