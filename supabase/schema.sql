create extension if not exists pgcrypto;

alter table if exists public.usuarios
  add column if not exists created_at timestamptz default now();

alter table if exists public.submissoes
  add column if not exists created_at timestamptz default now();

create table if not exists public.flag_catalog (
  numero integer primary key,
  titulo text not null,
  descricao text not null,
  pontos integer not null check (pontos > 0),
  ativa boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.flag_observacoes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.usuarios(id) on delete cascade,
  numero integer not null,
  observacao text not null default '',
  updated_by uuid not null references public.usuarios(id) on delete cascade,
  updated_at timestamptz not null default now(),
  constraint flag_observacoes_user_flag_unique unique (user_id, numero)
);

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

create unique index if not exists usuarios_login_unique_idx
  on public.usuarios (login);

create unique index if not exists flags_user_numero_unique_idx
  on public.flags (user_id, numero);

create index if not exists submissoes_user_created_idx
  on public.submissoes (user_id, created_at desc);

create index if not exists submissoes_flag_correta_idx
  on public.submissoes (flag_id, correta);

create index if not exists ctf_competitions_created_at_idx
  on public.ctf_competitions (created_at desc);

insert into public.flag_catalog (numero, titulo, descricao, pontos, ativa)
values
  (1, 'Flag 1', 'Desafio 1. Atualize esta descrição no painel administrativo.', 100, true),
  (2, 'Flag 2', 'Desafio 2. Atualize esta descrição no painel administrativo.', 200, true),
  (3, 'Flag 3', 'Desafio 3. Atualize esta descrição no painel administrativo.', 300, true),
  (4, 'Flag 4', 'Desafio 4. Atualize esta descrição no painel administrativo.', 400, true),
  (5, 'Flag 5', 'Desafio 5. Atualize esta descrição no painel administrativo.', 500, true)
on conflict (numero) do nothing;



alter table public.usuarios
  add nome text ;


  