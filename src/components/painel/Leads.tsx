'use client';
import { useMemo, useState } from 'react';
import { CANAIS, CLASSES, PERFIL_NOME, PERFIS, STATUS, statusDe } from '@/lib/leads';
import { canalDe, csv, dataHora, dinheiro, foneExib, pct, waDo, type Lead } from './util';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function Leads({ leads, abrir, novo }: { leads: Lead[]; abrir: (id: string) => void; novo: () => void }) {
  const [q, setQ] = useState('');
  const [orig, setOrig] = useState('todos');
  const [st, setSt] = useState('todos');
  const [cl, setCl] = useState('todos');
  const [pf, setPf] = useState('todos');

  const lista = useMemo(() => {
    const t = norm(q.trim());
    return leads.filter((l) =>
      (orig === 'todos' || canalDe(l) === orig) && (st === 'todos' || l.status === st) && (cl === 'todos' || l.classificacao === cl) &&
      (pf === 'todos' || l.perfil === pf) &&
      (!t || norm([l.nome, l.cidade, l.empresa, l.modelo, l.telefone].join(' ')).includes(t)));
  }, [leads, q, orig, st, cl, pf]);

  const prio = leads.filter((l) => l.classificacao === 'prioritario').length;
  const formularios = leads.filter((l) => l.formulario === 'orcamento').length;
  const cliques = leads.filter((l) => l.formulario === 'orcamento' && l.wa_clicked_at).length;
  const vendas = leads.filter((l) => l.status === 'venda');
  const fat = vendas.reduce((a, l) => a + (Number(l.venda) || 0), 0);
  const origens = Object.keys(CANAIS).filter((k) => leads.some((l) => canalDe(l) === k));

  const baixar = () => {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv(lista)], { type: 'text/csv;charset=utf-8' }));
    a.download = `leads-seletto-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
  };

  return (
    <>
      <div className="kpis">
        <Kpi l="Leads no período" v={String(leads.length)} />
        <Kpi l="Prioritários" v={String(prio)} s={pct(prio, leads.length) + ' do total'} cor="#16a34a" />
        <Kpi l="Clicaram no WhatsApp" v={String(cliques)} s={`${pct(cliques, formularios)} de ${formularios} formulários`} />
        <Kpi l="Vendas" v={String(vendas.length)} s={dinheiro(fat)} cor="var(--gold-ink)" />
      </div>
      <div className="ptool">
        <input className="psearch" type="search" placeholder="Buscar por nome, cidade, empresa, modelo…" value={q} onChange={(e) => setQ(e.target.value)} />
        <select value={cl} onChange={(e) => setCl(e.target.value)} aria-label="Classificação"><option value="todos">Toda classificação</option>{Object.entries(CLASSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select>
        <select value={pf} onChange={(e) => setPf(e.target.value)} aria-label="Perfil"><option value="todos">Todos os perfis</option>{PERFIS.map((p) => <option key={p.k} value={p.k}>{PERFIL_NOME[p.k]}</option>)}</select>
        <select value={st} onChange={(e) => setSt(e.target.value)} aria-label="Status"><option value="todos">Todos os status</option>{STATUS.map((s) => <option key={s.k} value={s.k}>{s.label}</option>)}</select>
        <button className="pbtn sec" onClick={baixar}>Exportar CSV</button>
        <button className="pbtn" onClick={novo}>+ Adicionar lead</button>
      </div>
      <div className="chips-p">
        <button className={orig === 'todos' ? 'on' : ''} onClick={() => setOrig('todos')}>Todas as origens</button>
        {origens.map((k) => <button key={k} className={orig === k ? 'on' : ''} onClick={() => setOrig(k)} style={{ '--c': CANAIS[k].cor } as React.CSSProperties}>{CANAIS[k].label}</button>)}
      </div>
      <div className="ptable">
        <table>
          <thead><tr><th>Data</th><th>Nome</th><th>Contato</th><th>Projeto</th><th>Investimento · prazo</th><th>Classificação</th><th>Origem</th><th>Status</th><th className="num">Valor</th></tr></thead>
          <tbody>
            {lista.map((l) => {
              const c = CANAIS[canalDe(l)]; const s = statusDe(l.status); const k = l.classificacao ? CLASSES[l.classificacao as keyof typeof CLASSES] : null;
              return (
                <tr key={l.id} onClick={() => abrir(l.id)} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter') abrir(l.id); }}>
                  <td className="nowrap">{dataHora(l.created_at)}</td>
                  <td><b>{l.nome || '—'}</b>{l.empresa && <small>{l.empresa}</small>}</td>
                  <td className="nowrap">{l.telefone ? <a href={waDo(l.telefone)} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>{foneExib(l.telefone)}</a> : '—'}<small>{[l.cidade, l.uf].filter(Boolean).join('/')}</small></td>
                  <td>{l.perfil ? PERFIL_NOME[l.perfil] : '—'}{l.modelo && <small>{l.modelo}</small>}</td>
                  <td>{l.investimento || '—'}{l.prazo && <small>{l.prazo}</small>}</td>
                  <td className="nowrap">{k ? <span className="badge" style={{ background: k.cor }}>{k.label}</span> : '—'}</td>
                  <td className="nowrap"><span className="dot" style={{ background: c.cor }} />{c.label}</td>
                  <td className="nowrap"><span className="badge out" style={{ color: s.cor, borderColor: s.cor }}>{s.label}</span></td>
                  <td className="num">{l.venda ? <b className="ok">{dinheiro(l.venda)}</b> : l.orcamento ? dinheiro(l.orcamento) : '—'}{(l.venda || l.orcamento) ? <small>{l.venda ? 'vendido' : 'orçado'}</small> : null}</td>
                </tr>
              );
            })}
            {!lista.length && <tr><td colSpan={9} className="vazio">Nenhum lead encontrado com esses filtros.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}

export function Kpi({ l, v, s, cor }: { l: string; v: string; s?: string; cor?: string }) {
  return <div className="kpi"><span>{l}</span><b style={cor ? { color: cor } : undefined}>{v}</b>{s && <small>{s}</small>}</div>;
}
