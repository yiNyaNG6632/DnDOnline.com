create table public.player_achievements (
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  achievement_id text not null check (achievement_id in (
    'first_play', 'first_memory', 'memory_master', 'secret_finder',
    'room_clear', 'streak_keeper', 'dream_complete'
  )),
  unlocked_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

alter table public.player_achievements enable row level security;

create policy "read own achievements"
  on public.player_achievements for select
  using (auth.uid() = user_id);

create policy "unlock own achievements"
  on public.player_achievements for insert
  with check (auth.uid() = user_id);

grant select, insert on public.player_achievements to authenticated;

create function public.unlock_achievement(target_id text)
returns boolean
language plpgsql
security invoker
set search_path = ''
as $$
declare
  inserted_count integer;
begin
  if auth.uid() is null then
    raise exception 'Sign in to unlock achievements';
  end if;

  if target_id not in (
    'first_play', 'first_memory', 'memory_master', 'secret_finder',
    'room_clear', 'streak_keeper', 'dream_complete'
  ) then
    raise exception 'Unknown achievement';
  end if;

  insert into public.player_achievements (user_id, achievement_id)
  values (auth.uid(), target_id)
  on conflict do nothing;

  get diagnostics inserted_count = row_count;
  return inserted_count > 0;
end;
$$;

revoke all on function public.unlock_achievement(text) from public;
grant execute on function public.unlock_achievement(text) to authenticated;
