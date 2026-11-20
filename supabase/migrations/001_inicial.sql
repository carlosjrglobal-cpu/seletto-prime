-- ============================================================
-- Seletto Prime — banco do painel de leads (projeto Supabase próprio)
-- Rodar em: Supabase → SQL Editor → New query → colar → Run.
-- Idempotente: pode rodar de novo sem quebrar.
-- ============================================================

-- ---------- LEADS ----------
create table if not exists public.leads (
  id              uuid primary key default gen_random_uuid(),
  created_at      timestamptz not null default now(),

  -- contato
  nome            text,
  telefone        text,
  email           text,
  cidade          text,
  uf              text,

  -- qualificação (formulário /orcamento)
  formulario      text,                       -- orcamento | contato | manual
  perfil          text,                       -- residencial | sala_jogos | condominio | empresa
  investimento    text,                       -- faixa exatamente como escolhida
  prazo           text,                       -- prazo (R/J) ou fase da compra (C/H)
  papel           text,                       -- participação no projeto (C/H)
  jogos           text,                       -- jogos desejados (sala de jogos)
  empresa         text,                       -- condomínio / razão social
  cnpj            text,                       -- só dígitos
  modelo          text,                       -- modelo de interesse
  tamanho         text,
  mensagem        text,
  respostas       jsonb not null default '{}'::jsonb,  -- todas as perguntas e respostas
  classificacao   text,                       -- prioritario | avaliacao | nutricao
  aceite_privacidade_at timestamptz,

  -- origem
  origem          text,
  utm_source      text,
  utm_medium      text,
  utm_campaign    text,
  utm_term        text,
  utm_content     text,
  gclid           text,
  gbraid          text,
  wbraid          text,
  fbclid          text,
  referrer        text,
  landing_page    text,

  -- eventos do funil
  wa_clicked_at   timestamptz,                -- clicou em "Falar com um especialista"

  -- gestão no painel
  status          text not null default 'novo',  -- novo|atendimento|orcamento|negociacao|venda|semresposta|perdido
  origem_manual   text,
  orcamento       numeric not null default 0,
  venda           numeric not null default 0,
  venda_at        timestamptz,                -- ciclo = venda_at - created_at
  perdido_motivo  text,
  notas           jsonb not null default '[]'::jsonb  -- [{ts, txt}]
);
create index if not exists leads_created_idx on public.leads (created_at desc);
create index if not exists leads_status_idx  on public.leads (status);

-- ---------- INVESTIMENTO EM ANÚNCIOS (relatórios: CPL, ROAS, ROI) ----------
create table if not exists public.ad_spend (
  month   text primary key,            -- 'YYYY-MM'
  meta    numeric not null default 0,
  google  numeric not null default 0,
  outros  numeric not null default 0
);

-- ============================================================
-- RLS
-- ============================================================
alter table public.leads    enable row level security;
alter table public.ad_spend enable row level security;

-- Formulário público: visitante só INSERE, e só um lead "cru"
-- (não consegue gravar venda, status ou anotações).
drop policy if exists leads_insert_publico on public.leads;
create policy leads_insert_publico on public.leads
  for insert to anon
  with check (
        status = 'novo'
    and coalesce(venda, 0) = 0
    and coalesce(orcamento, 0) = 0
    and venda_at is null
    and wa_clicked_at is null
    and notas = '[]'::jsonb
  );

-- Painel (usuário logado): tudo.
drop policy if exists leads_painel on public.leads;
create policy leads_painel on public.leads
  for all to authenticated using (true) with check (true);

drop policy if exists ad_spend_painel on public.ad_spend;
create policy ad_spend_painel on public.ad_spend
  for all to authenticated using (true) with check (true);

-- ============================================================
-- Clique no WhatsApp (medido separado do envio do formulário).
-- O visitante não pode ler nem editar leads; esta função só
-- carimba a hora do primeiro clique do lead que ele acabou de criar.
-- ============================================================
create or replace function public.registrar_clique_whatsapp(p_id uuid)
returns void
language sql
security definer
set search_path = public
as $$
  update public.leads
     set wa_clicked_at = now()
   where id = p_id
     and wa_clicked_at is null
     and created_at > now() - interval '1 day';
$$;
revoke all on function public.registrar_clique_whatsapp(uuid) from public;
grant execute on function public.registrar_clique_whatsapp(uuid) to anon, authenticated;

-- ============================================================
-- Tempo real: o painel avisa na hora quando entra lead novo
-- (seção 9 do PDF: "Prioritário → aviso imediato ao comercial").
-- ============================================================
do $$
begin
  if not exists (select 1 from pg_publication_tables where pubname = 'supabase_realtime' and tablename = 'leads') then
    alter publication supabase_realtime add table public.leads;
  end if;
end $$;
