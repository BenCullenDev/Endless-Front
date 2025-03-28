-- Check if the table exists and drop it if it does
drop table if exists public.characters;

-- Create characters table
create table public.characters (
    id uuid default gen_random_uuid() primary key,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    user_id uuid references auth.users(id) not null unique,
    name text not null,
    constraint one_character_per_user unique (user_id)
);

-- Enable RLS
alter table public.characters enable row level security;

-- Create policies
create policy "Users can view their own character"
    on public.characters for select
    using (auth.uid() = user_id);

create policy "Users can create their own character"
    on public.characters for insert
    with check (auth.uid() = user_id);

-- Grant necessary permissions
grant usage on schema public to authenticated;
grant all on public.characters to authenticated; 