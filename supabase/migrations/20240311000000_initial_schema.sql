-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  full_name text,
  avatar_url text,
  website text,
  bio text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trading_accounts table
create table public.trading_accounts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  account_name text not null,
  broker text not null,
  account_number text,
  server text,
  is_demo boolean default false,
  is_public boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create trading_stats table
create table public.trading_stats (
  id uuid default uuid_generate_v4() primary key,
  account_id uuid references public.trading_accounts(id) on delete cascade not null,
  total_gain numeric(10,2),
  win_rate numeric(5,2),
  risk_ratio numeric(5,2),
  total_trades integer,
  profitable_trades integer,
  losing_trades integer,
  average_win numeric(10,2),
  average_loss numeric(10,2),
  largest_win numeric(10,2),
  largest_loss numeric(10,2),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
alter table public.profiles enable row level security;
alter table public.trading_accounts enable row level security;
alter table public.trading_stats enable row level security;

-- Profiles policies
create policy "Public profiles are viewable by everyone"
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- Trading accounts policies
create policy "Public trading accounts are viewable by everyone"
  on public.trading_accounts for select
  using ( is_public = true );

create policy "Users can view their own private accounts"
  on public.trading_accounts for select
  using ( auth.uid() = user_id );

create policy "Users can insert their own trading accounts"
  on public.trading_accounts for insert
  with check ( auth.uid() = user_id );

create policy "Users can update their own trading accounts"
  on public.trading_accounts for update
  using ( auth.uid() = user_id );

create policy "Users can delete their own trading accounts"
  on public.trading_accounts for delete
  using ( auth.uid() = user_id );

-- Trading stats policies
create policy "Public trading stats are viewable by everyone"
  on public.trading_stats for select
  using (
    exists (
      select 1 from public.trading_accounts
      where id = trading_stats.account_id
      and is_public = true
    )
  );

create policy "Users can view their own private stats"
  on public.trading_stats for select
  using (
    exists (
      select 1 from public.trading_accounts
      where id = trading_stats.account_id
      and user_id = auth.uid()
    )
  );

create policy "Users can insert stats for their own accounts"
  on public.trading_stats for insert
  with check (
    exists (
      select 1 from public.trading_accounts
      where id = trading_stats.account_id
      and user_id = auth.uid()
    )
  );

create policy "Users can update stats for their own accounts"
  on public.trading_stats for update
  using (
    exists (
      select 1 from public.trading_accounts
      where id = trading_stats.account_id
      and user_id = auth.uid()
    )
  );

-- Functions
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'username', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$;

-- Triggers
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user(); 