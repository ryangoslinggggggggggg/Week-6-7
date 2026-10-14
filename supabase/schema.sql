-- SnoopySnacks database schema + seed data for Supabase (Postgres)
-- Run this once in: Supabase dashboard > SQL Editor > New query > Run

create table if not exists public.snacks (
  id          bigint generated always as identity primary key,
  name        text    not null,
  category    text    not null,
  description text,
  price       numeric(10,2) not null check (price >= 0),
  available   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists snacks_category_idx on public.snacks (lower(category));

-- Row Level Security: anyone can read snacks, only the service role can change them
alter table public.snacks enable row level security;

drop policy if exists "Public can read snacks" on public.snacks;
create policy "Public can read snacks"
  on public.snacks for select
  using (true);

-- Seed data (only inserts if the table is empty)
insert into public.snacks (name, category, description, price, available)
select * from (values
  ('Snoopy Cookie', 'Cookies', 'A snack that would not only fill your stomach but also your heart', 89, true),
  ('Chocolate Chip Cookie', 'Cookies', 'Soft and chewy chocolate chip cookies', 79, true),
  ('Red Velvet Cookie', 'Cookies', 'Rich red velvet with white chocolate', 99, true),
  ('Biscoff Cookies', 'Cookies', 'Biscoff cookies brings the perfect balance of rich, caramelized flavor and crunch.', 99, true),
  ('Pistachio Ice Cream', 'Ice Cream', 'Pistachio Ice Cream talaga ang the best', 129, true),
  ('3 Swirled Scoop Strawberry Ice Cream', 'Ice Cream', 'Soft and Sweet Strawberry from Baguio', 109, true),
  ('Caramelized Ice Cream', 'Ice Cream', 'Mas matamis pa sa mga salita niya', 119, true),
  ('Biscoff Ice Cream', 'Ice Cream', 'Biscoff Ice Cream on top', 139, true),
  ('Classic Cheese Pizza', 'Pizza', 'Cheese Pull', 459, true),
  ('Pepperoni Pizza', 'Pizza', 'No regrets when you order this', 489, true),
  ('Buffalo Chicken Pizza', 'Pizza', 'Best one so far', 529, true),
  ('Hawaiian Pizza', 'Pizza', 'Hindi mawawala', 409, true),
  ('Soda', 'Drinks', 'Don''t forget to drink water', 39, true),
  ('Boba', 'Drinks', 'No regrets when you order this', 119, true),
  ('Coffee', 'Drinks', 'Best one so far', 149, true),
  ('Matcha', 'Drinks', 'Hindi mawawala', 139, true),
  ('Double Cheeseburger', 'Burgers', 'Don''t forget to drink water', 179, true),
  ('Bacon Burger', 'Burgers', 'No regrets when you order this', 119, true),
  ('Chicken Burger', 'Burgers', 'Best one so far', 99, true),
  ('Cheeseburger', 'Burgers', 'Hindi mawawala', 129, true),
  ('Glazed Donut', 'Donuts', 'Don''t forget to drink water', 39, true),
  ('Black Jack Donut', 'Donuts', 'No regrets when you order this', 49, true),
  ('Blueberry Glazed Donut', 'Donuts', 'Best one so far', 49, true),
  ('Alcapone Donut', 'Donuts', 'Hindi mawawala', 49, true)
) as v(name, category, description, price, available)
where not exists (select 1 from public.snacks);
