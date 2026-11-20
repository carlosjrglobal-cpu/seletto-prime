'use client';
import type { Session } from '@supabase/supabase-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Logo } from '@/components/Icon';
import Clientes from '@/components/painel/Clientes';
import { emDemo, leadsDemo, setDemo } from '@/components/painel/db';
import Funil from '@/components/painel/Funil';
import { Gaveta, NovoLead } from '@/components/painel/Gaveta';
import Leads from '@/components/painel/Leads';
import Relatorios from '@/components/painel/Relatorios';
import { mesDe, nomeMes, type Gasto, type Lead } from '@/components/painel/util';
import { PERFIL_NOME } from '@/lib/leads';
import { supa, supaConfigurado } from '@/lib/supabase';

type Aba = 'leads' | 'funil' | 'clientes' | 'relatorios';
const ABAS: { k: Aba; label: string; d: string }[] = [
  { k: 'leads', label: 'Leads', d: 'M3 5h18M3 12h18M3 19h18' },
  { k: 'funil', label: 'Funil', d: 'M3 4h5v16H3zM10 4h5v11h-5zM17 4h4v7h-4z' },
  { k: 'clientes', label: 'Clientes', d: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8M22 21v-2a4 4 0 0 0-3-3.9' },
  { k: 'relatorios', label: 'Relatórios', d: 'M4 20V10M10 20V4M16 20v-7M22 20H2' },
];

export default function Painel() {
  const [pronto, setPronto] = useState(false);
  const [sessao, setSessao] = useState<Session | null>(null);
  const [demo, setDemoState] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [aba, setAba] = useState<Aba>('leads');
  const [mes, setMes] = useState(() => new Date().toISOString().slice(0, 7));
  const [aberto, setAberto] = useState<string | null>(null);
  const [novo, setNovo] = useState(false);
  const [menu, setMenu] = useState(false);
  const [aviso, setAviso] = useState<string | null>(null);
  const [erro, setErro] = useState('');

  // sessão / demonstração
  useEffect(() => {
    const d = new URLSearchParams(location.search).get('demo') === '1';
    setDemo(d); setDemoState(d);
    if (d) { const x = leadsDemo(); setLeads(x.leads); setGastos(x.gastos); setPronto(true); return; }
    if (!supaConfigurado) { setPronto(true); return; }
    supa().auth.getSession().then(({ data }) => { setSessao(data.session); setPronto(true); });
    const { data: sub } = supa().auth.onAuthStateChange((_e, s) => setSessao(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  const carregar = useCallback(async () => {
    const [l, g] = await Promise.all([
      supa().from('leads').select('*').order('created_at', { ascending: false }).limit(5000),
      supa().from('ad_spend').select('*'),
    ]);
    if (l.error) { setErro('Não foi possível carregar os leads: ' + l.error.message); return; }
    setErro('');
    setLeads((l.data || []) as Lead[]);
    setGastos((g.data || []) as Gasto[]);
  }, []);

  // dados + aviso em tempo real de lead novo
  useEffect(() => {
    if (!sessao || emDemo()) return;
    carregar();
    const canal = supa().channel('leads-novos')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'leads' }, (p) => {
        const l = p.new as Lead;
        setLeads((xs) => (xs.some((x) => x.id === l.id) ? xs : [l, ...xs]));
        const txt = `${l.classificacao === 'prioritario' ? 'Lead PRIORITÁRIO' : 'Novo lead'}: ${l.nome || 'sem nome'}${l.perfil ? ' · ' + PERFIL_NOME[l.perfil] : ''}`;
        setAviso(txt);
        if (l.classificacao === 'prioritario' && 'Notification' in window && Notification.permission === 'granted') new Notification('Seletto Prime', { body: txt });
      })
      .subscribe();
    return () => { supa().removeChannel(canal); };
  }, [sessao, carregar]);

  useEffect(() => { if (!aviso) return; const t = setTimeout(() => setAviso(null), 8000); return () => clearTimeout(t); }, [aviso]);

  const meses = useMemo(() => {
    const s = new Set(leads.map((l) => mesDe(l.created_at)));
    s.add(new Date().toISOString().slice(0, 7));
    return ['todos', ...[...s].sort().reverse()];
  }, [leads]);
  const doMes = useMemo(() => (mes === 'todos' ? leads : leads.filter((l) => mesDe(l.created_at) === mes)), [leads, mes]);
  const atualiza = (l: Lead) => setLeads((xs) => xs.map((x) => (x.id === l.id ? l : x)));
  const leadAberto = leads.find((l) => l.id === aberto) || null;

  if (!pronto) return <div className="plogin"><p>Carregando…</p></div>;
  if (!supaConfigurado && !demo) return <Configurar />;
  if (!sessao && !demo) return <Login />;

  const titulo = ABAS.find((a) => a.k === aba)!.label;
  return (
    <div className="papp">
      <aside className={`pside${menu ? ' on' : ''}`}>
        <div className="pside__logo"><Logo /><span>Painel</span></div>
        <nav>
          {ABAS.map((a) => (
            <button key={a.k} className={aba === a.k ? 'on' : ''} onClick={() => { setAba(a.k); setMenu(false); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d={a.d} /></svg>{a.label}
            </button>
          ))}
        </nav>
        <div className="pside__foot">
          {demo ? <b>Modo demonstração</b> : <>Logado como<b>{sessao?.user.email}</b></>}
          {!demo && 'Notification' in globalThis && typeof Notification !== 'undefined' && Notification.permission === 'default' && (
            <button onClick={() => Notification.requestPermission()}>Ativar avisos de lead prioritário</button>
          )}
          {!demo && <button onClick={() => supa().auth.signOut()}>Sair da conta →</button>}
        </div>
      </aside>
      {menu && <div className="pscrim" onClick={() => setMenu(false)} />}
      <div className="pmain">
        <header className="ptop">
          <button className="ptop__menu" onClick={() => setMenu(true)} aria-label="Abrir menu">☰</button>
          <h1>{titulo}<span>.</span></h1>
          <label className="ptop__mes">Mês de referência
            <select value={mes} onChange={(e) => setMes(e.target.value)}>{meses.map((m) => <option key={m} value={m}>{nomeMes(m)}</option>)}</select>
          </label>
          {!demo && <button className="pbtn sec" onClick={carregar} title="Recarregar">↻</button>}
        </header>
        {demo && <p className="pdemo">Modo demonstração: dados fictícios, nada é gravado. Para usar com dados reais, entre pelo endereço do painel sem <code>?demo=1</code>.</p>}
        {erro && <p className="perr">{erro}</p>}
        <div className="pview">
          {aba === 'leads' && <Leads leads={doMes} abrir={setAberto} novo={() => setNovo(true)} />}
          {aba === 'funil' && <Funil leads={doMes} abrir={setAberto} onChange={atualiza} />}
          {aba === 'clientes' && <Clientes leads={leads} abrir={setAberto} />}
          {aba === 'relatorios' && <Relatorios leads={doMes} mes={mes} gastos={gastos} onGasto={(g) => setGastos((xs) => [...xs.filter((x) => x.month !== g.month), g])} />}
        </div>
      </div>
      {(leadAberto || novo) && <div className="pscrim on" onClick={() => { setAberto(null); setNovo(false); }} />}
      {leadAberto && <Gaveta key={leadAberto.id} lead={leadAberto} onClose={() => setAberto(null)} onSaved={atualiza} onDeleted={(id) => { setLeads((xs) => xs.filter((x) => x.id !== id)); setAberto(null); }} />}
      {novo && <NovoLead onClose={() => setNovo(false)} onCreated={(l) => { setLeads((xs) => [l, ...xs]); setNovo(false); setAberto(l.id); }} />}
      {aviso && <div className="ptoast" role="status">{aviso}</div>}
    </div>
  );
}

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [ent, setEnt] = useState(false);
  const entrar = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnt(true); setErro('');
    const { error } = await supa().auth.signInWithPassword({ email, password: senha });
    setEnt(false);
    if (error) setErro(error.message === 'Invalid login credentials' ? 'E-mail ou senha incorretos.' : error.message);
  };
  return (
    <div className="plogin">
      <form className="plogin__card" onSubmit={entrar}>
        <div className="plogin__logo"><Logo /></div>
        <p className="plogin__sub">Painel de leads</p>
        <label>E-mail<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="username" required /></label>
        <label>Senha<input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} autoComplete="current-password" required /></label>
        <button className="pbtn" disabled={ent}>{ent ? 'Entrando…' : 'Entrar →'}</button>
        {erro && <p className="perr">{erro}</p>}
        <small>Acesso restrito à equipe Seletto Prime.</small>
      </form>
    </div>
  );
}

function Configurar() {
  return (
    <div className="plogin">
      <div className="plogin__card wide">
        <div className="plogin__logo"><Logo /></div>
        <p className="plogin__sub">Painel ainda não conectado ao banco</p>
        <ol>
          <li>Crie um projeto em <b>supabase.com</b> (plano gratuito).</li>
          <li>No <b>SQL Editor</b>, rode o arquivo <code>supabase/migrations/001_inicial.sql</code>.</li>
          <li>Em <b>Authentication → Users</b>, crie o usuário da equipe (e-mail e senha).</li>
          <li>Em <b>Project Settings → API</b>, copie a <i>Project URL</i> e a chave <i>anon public</i>.</li>
          <li>No GitHub do site: <b>Settings → Secrets and variables → Actions → Variables</b>, crie <code>NEXT_PUBLIC_SUPABASE_URL</code> e <code>NEXT_PUBLIC_SUPABASE_ANON_KEY</code> e publique de novo.</li>
        </ol>
        <a className="pbtn" href="?demo=1">Ver o painel em modo demonstração →</a>
      </div>
    </div>
  );
}
