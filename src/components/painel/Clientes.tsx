'use client';
import { useMemo, useState } from 'react';
import { dataHora, dinheiro, foneExib, waDo, type Lead } from './util';
import { Kpi } from './Leads';

/* Clientes = pessoas com pelo menos uma venda fechada, agrupadas pelo telefone. */
export default function Clientes({ leads, abrir }: { leads: Lead[]; abrir: (id: string) => void }) {
  const [q, setQ] = useState('');
  const clientes = useMemo(() => {
    const m = new Map<string, { chave: string; nome: string; telefone: string | null; cidade: string; compras: Lead[]; ultimo: string; leadId: string }>();
    leads.filter((l) => l.status === 'venda').forEach((l) => {
      const chave = (l.telefone || '').replace(/\D/g, '') || l.id;
      const c = m.get(chave) || { chave, nome: l.nome || '—', telefone: l.telefone, cidade: [l.cidade, l.uf].filter(Boolean).join('/'), compras: [], ultimo: l.created_at, leadId: l.id };
      c.compras.push(l);
      const d = l.venda_at || l.created_at;
      if (d > c.ultimo) { c.ultimo = d; c.leadId = l.id; }
      m.set(chave, c);
    });
    return [...m.values()].sort((a, b) => b.ultimo.localeCompare(a.ultimo));
  }, [leads]);
  const t = q.trim().toLowerCase();
  const lista = clientes.filter((c) => !t || [c.nome, c.telefone, c.cidade].join(' ').toLowerCase().includes(t));
  const total = clientes.reduce((a, c) => a + c.compras.reduce((s, l) => s + (Number(l.venda) || 0), 0), 0);
  const recompra = clientes.filter((c) => c.compras.length > 1).length;
  return (
    <>
      <div className="kpis">
        <Kpi l="Clientes" v={String(clientes.length)} />
        <Kpi l="Faturado" v={dinheiro(total)} cor="var(--gold-ink)" />
        <Kpi l="Ticket médio" v={clientes.length ? dinheiro(total / clientes.length) : '—'} />
        <Kpi l="Compraram mais de uma vez" v={String(recompra)} />
      </div>
      <div className="ptool"><input className="psearch" type="search" placeholder="Buscar por nome, telefone ou cidade" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      <div className="ptable">
        <table>
          <thead><tr><th>Nome</th><th>Telefone</th><th>Cidade</th><th>Mesas compradas</th><th className="num">Compras</th><th className="num">Faturado</th><th>Última compra</th></tr></thead>
          <tbody>
            {lista.map((c) => (
              <tr key={c.chave} onClick={() => abrir(c.leadId)}>
                <td><b>{c.nome}</b></td>
                <td>{c.telefone ? <a href={waDo(c.telefone)} target="_blank" rel="noopener" onClick={(e) => e.stopPropagation()}>{foneExib(c.telefone)}</a> : '—'}</td>
                <td>{c.cidade || '—'}</td>
                <td>{[...new Set(c.compras.map((l) => l.modelo).filter(Boolean))].join(', ') || '—'}</td>
                <td className="num">{c.compras.length}</td>
                <td className="num">{dinheiro(c.compras.reduce((s, l) => s + (Number(l.venda) || 0), 0))}</td>
                <td>{dataHora(c.ultimo)}</td>
              </tr>
            ))}
            {!lista.length && <tr><td colSpan={7} className="vazio">Ainda não há clientes. Um lead vira cliente quando o status muda para “Venda fechada”.</td></tr>}
          </tbody>
        </table>
      </div>
    </>
  );
}
