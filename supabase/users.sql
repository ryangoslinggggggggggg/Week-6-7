-- Users table for signup/login
-- Run once in: Supabase dashboard > SQL Editor > New query > Run

create table if not exists public.users (
  id            bigint generated always as identity primary key,
  username      text not null unique check (username = lower(username)),
  password_hash text not null,
  created_at    timestamptz not null default now()
);

-- Row Level Security ON with NO policies = the public/publishable key cannot read or write this table.
-- Only the server (using the secret/service_role key) can access it.
alter table public.users enable row level security;
