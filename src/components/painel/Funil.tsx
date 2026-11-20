'use client';
import { useState } from 'react';
import { CLASSES, PERFIL_NOME, STATUS } from '@/lib/leads';
import { atualizarLead } from './db';
import { diasDesde, dinheiro, type Lead } from './util';

/* Quadro por etapa: arraste o card para mudar o status (ou clique para abrir a ficha). */
export default function Funil({ leads, abrir, onChange }: { leads: Lead[]; abrir: (id: string) => void; onChange: (l: Lead) => void }) {
  const [sobre, setSobre] = useState<string | null>(null);
  const mover = async (id: string, status: string) => {
    const l = leads.find((x) => x.id === id);
    if (!l || l.status === status) return;
    const patch = { status, venda_at: status === 'venda' ? l.venda_at || new Date().toISOString() : null };
    onChange({ ...l, ...patch });
    const { error } = await atualizarLead(id, patch);
    if (error) { alert('Não foi possível mover: ' + error.message); onChange(l); }
  };
  return (
    <div className="fn-scroll">
      <div className="fn">
        {STATUS.map((s) => {
          const col = leads.filter((l) => l.status === s.k);
          const soma = col.reduce((a, l) => a + (Number(s.k === 'venda' ? l.venda : l.orcamento) || 0), 0);
          return (
            <section key={s.k} className={`fn-col${sobre === s.k ? ' over' : ''}`}
              onDragOver={(e) => { e.preventDefault(); setSobre(s.k); }} onDragLeave={() => setSobre(null)}
              onDrop={(e) => { e.preventDefault(); setSobre(null); mover(e.dataTransfer.getData('text/plain'), s.k); }}>
              <header style={{ borderTopColor: s.cor }}><b>{s.label}</b><span>{col.length}{soma ? ' · ' + dinheiro(soma) : ''}</span></header>
              <div className="fn-cards">
                {col.map((l) => {
                  const k = l.classificacao ? CLASSES[l.classificacao as keyof typeof CLASSES] : null;
                  return (
                    <article key={l.id} className="fn-card" draggable onDragStart={(e) => e.dataTransfer.setData('text/plain', l.id)} onClick={() => abrir(l.id)}>
                      <b>{l.nome || 'Sem nome'}</b>
                      <small>{[l.perfil && PERFIL_NOME[l.perfil], l.modelo].filter(Boolean).join(' · ') || '—'}</small>
                      <div className="fn-meta">
                        {k && <span className="badge" style={{ background: k.cor }}>{k.label}</span>}
                        <span>{diasDesde(l.created_at)}d</span>
                        {(l.venda || l.orcamento) ? <span>{dinheiro(l.venda || l.orcamento)}</span> : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
