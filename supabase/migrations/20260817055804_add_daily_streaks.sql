-- Daily engagement streaks for signed-in players.
-- The server calculates dates in the product's Almaty timezone.
create table public.player_streaks (
  user_id uuid primary key default auth.uid() references auth.users (id) on delete cascade,
  current_streak integer not null default 1 check (current_streak > 0),
  longest_streak integer not null default 1 check (longest_streak > 0),
  last_played_on date not null default (timezone('Asia/Almaty', now())::date),
  updated_at timestamptz not null default now()
);

alter table public.player_streaks enable row level security;

create policy "read own streak"
  on public.player_streaks for select
  using (auth.uid() = user_id);

create policy "insert own streak"
  on public.player_streaks for insert
  with check (auth.uid() = user_id);

create policy "update own streak"
  on public.player_streaks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

grant select, insert, update on public.player_streaks to authenticated;

create function public.record_daily_play()
returns public.player_streaks
language plpgsql
security invoker
set search_path = ''
as $$
declare
  result public.player_streaks;
  play_date date := timezone('Asia/Almaty', now())::date;
begin
  if auth.uid() is null then
    raise exception 'Sign in to record a daily streak';
  end if;

  insert into public.player_streaks as streak (
    user_id, current_streak, longest_streak, last_played_on
  )
  values (auth.uid(), 1, 1, play_date)
  on conflict (user_id) do update set
    current_streak = case
      when streak.last_played_on = excluded.last_played_on then streak.current_streak
      when streak.last_played_on = excluded.last_played_on - 1 then streak.current_streak + 1
      else 1
    end,
    longest_streak = greatest(
      streak.longest_streak,
      case
        when streak.last_played_on = excluded.last_played_on then streak.current_streak
        when streak.last_played_on = excluded.last_played_on - 1 then streak.current_streak + 1
        else 1
      end
    ),
    last_played_on = excluded.last_played_on,
    updated_at = now()
  returning * into result;

  return result;
end;
$$;

revoke all on function public.record_daily_play() from public;
grant execute on function public.record_daily_play() to authenticated;
