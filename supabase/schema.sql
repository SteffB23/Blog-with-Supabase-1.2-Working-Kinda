-- Enable RLS
alter table if exists public.posts enable row level security;
alter table if exists public.comments enable row level security;

-- Create tables
create table if not exists public.posts (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  content text not null,
  author_id uuid references auth.users(id) not null,
  author_name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  cover_image text
);

create table if not exists public.comments (
  id uuid default gen_random_uuid() primary key,
  content text not null,
  author_id uuid references auth.users(id) not null,
  author_name text not null,
  post_id uuid references public.posts(id) on delete cascade not null,
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create RLS policies
create policy "Users can read all posts"
  on posts for select
  to authenticated
  using (true);

create policy "Users can insert their own posts"
  on posts for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Users can update their own posts"
  on posts for update
  to authenticated
  using (auth.uid() = author_id);

create policy "Users can delete their own posts"
  on posts for delete
  to authenticated
  using (auth.uid() = author_id);

create policy "Users can read all comments"
  on comments for select
  to authenticated
  using (true);

create policy "Users can insert their own comments"
  on comments for insert
  to authenticated
  with check (auth.uid() = author_id);

create policy "Users can update their own comments"
  on comments for update
  to authenticated
  using (auth.uid() = author_id);

create policy "Users can delete their own comments"
  on comments for delete
  to authenticated
  using (auth.uid() = author_id);