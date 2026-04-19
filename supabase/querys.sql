end $$;

-- 2.5 Seed básico de catálogo (caso vazio)
insert into public.flag_catalog (numero, titulo, descricao, pontos, ativa)
values
  (1, 'Flag 1', 'Desafio 1. Atualize esta descrição no painel administrativo.', 100, true),
  (2, 'Flag 2', 'Desafio 2. Atualize esta descrição no painel administrativo.', 200, true),
  (3, 'Flag 3', 'Desafio 3. Atualize esta descrição no painel administrativo.', 300, true),
  (4, 'Flag 4', 'Desafio 4. Atualize esta descrição no painel administrativo.', 400, true),
  (5, 'Flag 5', 'Desafio 5. Atualize esta descrição no painel administrativo.', 500, true)
on conflict (numero) do nothing;

create table if not exists public.ctf_competitions (
  id uuid primary key default gen_random_uuid(),
  started_at timestamptz not null,
  ends_at timestamptz not null,
  finished_at timestamptz,
  created_by uuid not null references public.usuarios(id) on delete cascade,
  updated_by uuid not null references public.usuarios(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint ctf_competitions_ends_after_start check (ends_at > started_at)
);

create index if not exists ctf_competitions_created_at_idx
  on public.ctf_competitions (created_at desc);

-- =====================================================================
-- 3) Limpeza de legado (tabelas não usadas pelo projeto)
-- =====================================================================

drop table if exists public.solve;
drop table if exists public.submission;
drop table if exists public.challenge_flag;
drop table if exists public.challenge;
drop table if exists public."user";

commit;
