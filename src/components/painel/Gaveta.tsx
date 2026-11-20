'use client';
import { useEffect, useState } from 'react';
import { modelos } from '@/data/site';
import { CANAIS, CLASSES, corporativo, mascaraFone, PERFIL_NOME, PERFIS, soDigitos, STATUS, UFS } from '@/lib/leads';
import { atualizarLead, excluirLead, inserirLead } from './db';
import { canalDe, cnpjExib, dataHora, foneExib, waDo, type Lead, type Nota } from './util';

/* ---------- Ficha do lead (ver e editar) ---------- */
export function Gaveta({ lead, onClose, onSaved, onDeleted }: { lead: Lead; onClose: () => void; onSaved: (l: Lead) => void; onDeleted: (id: string) => void }) {
  const [e, setE] = useState({ status: lead.status, origem_manual: lead.origem_manual || '', orcamento: String(lead.orcamento || ''), venda: String(lead.venda || ''), perdido_motivo: lead.perdido_motivo || '' });
  const [notas, setNotas] = useState<Nota[]>(lead.notas || []);
  const [nova, setNova] = useState('');
  const [salvando, setSalvando] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    const k = (ev: KeyboardEvent) => { if (ev.key === 'Escape') onClose(); };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [onClose]);

  const salvar = async (notasNovas = notas) => {
    setSalvando(true);
    const venda = Number(e.venda) || 0;
    const patch: Partial<Lead> = {
      status: e.status, origem_manual: e.origem_manual || null, orcamento: Number(e.orcamento) || 0, venda,
      perdido_motivo: e.status === 'perdido' ? e.perdido_motivo || null : null, notas: notasNovas,
      // carimbo do fechamento: entra quando vira venda, sai se deixar de ser
      venda_at: e.status === 'venda' ? lead.venda_at || new Date().toISOString() : null,
    };
    const { error } = await atualizarLead(lead.id, patch);
    setSalvando(false);
    if (error) { setMsg('Erro ao salvar: ' + error.message); return; }
    setMsg('Salvo.');
    onSaved({ ...lead, ...patch } as Lead);
  };
  const addNota = () => {
    if (!nova.trim()) return;
    const n = [{ ts: new Date().toISOString(), txt: nova.trim() }, ...notas];
    setNotas(n); setNova(''); salvar(n);
  };
  const excluir = async () => {
    if (!confirm(`Excluir o lead de ${lead.nome || 'sem nome'}? Isso não pode ser desfeito.`)) return;
    const { error } = await excluirLead(lead.id);
    if (error) { setMsg('Erro ao excluir: ' + error.message); return; }
    onDeleted(lead.id);
  };

  const c = CANAIS[canalDe(lead)];
  const cl = lead.classificacao ? CLASSES[lead.classificacao as keyof typeof CLASSES] : null;
  const resp = Object.entries(lead.respostas || {});
  const origem = (['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'gclid', 'fbclid', 'referrer', 'landing_page'] as const).filter((k) => lead[k]);
  const primeiroNome = (lead.nome || '').split(' ')[0];

  return (
    <aside className="gav" role="dialog" aria-modal="true" aria-label={`Lead ${lead.nome || ''}`}>
      <header className="gav__top">
        <div>
          <h2>{lead.nome || 'Sem nome'}</h2>
          <p>{dataHora(lead.created_at)} · {lead.formulario === 'orcamento' ? 'Formulário de orçamento' : lead.formulario === 'contato' ? 'Página de contato' : 'Cadastro manual'}</p>
        </div>
        <button className="gav__x" onClick={onClose} aria-label="Fechar">✕</button>
      </header>
      <div className="gav__body">
        <div className="gav__badges">
          {cl && <span className="badge" style={{ background: cl.cor }}>{cl.label}</span>}
          <span className="badge out" style={{ color: c.cor, borderColor: c.cor }}>{c.label}</span>
          {lead.wa_clicked_at ? <span className="badge out ok">Clicou no WhatsApp</span> : <span className="badge out">Não clicou no WhatsApp</span>}
        </div>
        {cl && <p className="gav__acao">Ação sugerida: <b>{cl.acao}</b></p>}

        <section className="gav__sec">
          <h3>Contato</h3>
          <dl className="dl">
            <dt>WhatsApp</dt><dd>{lead.telefone ? <a href={waDo(lead.telefone, `Olá, ${primeiroNome}! Aqui é da Seletto Prime.`)} target="_blank" rel="noopener">{foneExib(lead.telefone)} ↗</a> : '—'}</dd>
            <dt>Cidade</dt><dd>{[lead.cidade, lead.uf].filter(Boolean).join(' / ') || '—'}</dd>
            {lead.email && <><dt>E-mail</dt><dd>{lead.email}</dd></>}
          </dl>
        </section>

        <section className="gav__sec">
          <h3>Projeto</h3>
          <dl className="dl">
            <dt>Perfil</dt><dd>{lead.perfil ? PERFIL_NOME[lead.perfil] : '—'}</dd>
            {resp.filter(([k]) => k !== 'perfil').map(([k, v]) => <Par key={k} k={k} v={v} />)}
            {corporativo(lead.perfil) && <><dt>{lead.perfil === 'condominio' ? 'Condomínio' : 'Empresa'}</dt><dd>{lead.empresa || '—'}</dd><dt>CNPJ</dt><dd>{lead.cnpj ? cnpjExib(lead.cnpj) : 'Informa depois'}</dd></>}
            {lead.modelo && <><dt>Modelo</dt><dd>{lead.modelo}</dd></>}
            {lead.tamanho && <><dt>Tamanho</dt><dd>{lead.tamanho}</dd></>}
            {lead.mensagem && <><dt>Mensagem</dt><dd>{lead.mensagem}</dd></>}
          </dl>
        </section>

        <section className="gav__sec">
          <h3>Atendimento</h3>
          <div className="gav__grid">
            <label>Status<select value={e.status} onChange={(x) => setE({ ...e, status: x.target.value })}>{STATUS.map((s) => <option key={s.k} value={s.k}>{s.label}</option>)}</select></label>
            <label>Origem (corrigir)<select value={e.origem_manual} onChange={(x) => setE({ ...e, origem_manual: x.target.value })}><option value="">Automática ({c.label})</option>{Object.entries(CANAIS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></label>
            <label>Valor orçado (R$)<input type="number" min="0" step="100" value={e.orcamento} onChange={(x) => setE({ ...e, orcamento: x.target.value })} /></label>
            <label>Valor vendido (R$)<input type="number" min="0" step="100" value={e.venda} onChange={(x) => setE({ ...e, venda: x.target.value })} /></label>
            {e.status === 'perdido' && <label className="full">Motivo da perda<input value={e.perdido_motivo} onChange={(x) => setE({ ...e, perdido_motivo: x.target.value })} placeholder="Preço, prazo, desistiu…" /></label>}
          </div>
          <div className="gav__save"><button className="pbtn" disabled={salvando} onClick={() => salvar()}>{salvando ? 'Salvando…' : 'Salvar alterações'}</button>{msg && <span>{msg}</span>}</div>
        </section>

        <section className="gav__sec">
          <h3>Anotações</h3>
          <div className="gav__nota">
            <textarea value={nova} onChange={(x) => setNova(x.target.value)} placeholder="Ex.: enviei orçamento da Zeus 2,30 m em lã cinza" />
            <button className="pbtn sec" onClick={addNota} disabled={!nova.trim()}>Adicionar</button>
          </div>
          <ul className="timeline">
            {notas.map((n) => <li key={n.ts}><time>{dataHora(n.ts)}</time><p>{n.txt}</p></li>)}
            {!notas.length && <li className="vazio">Nenhuma anotação ainda.</li>}
          </ul>
        </section>

        {origem.length > 0 && (
          <section className="gav__sec">
            <h3>Origem da visita</h3>
            <dl className="dl small">{origem.map((k) => <Par key={k} k={k} v={String(lead[k])} />)}</dl>
          </section>
        )}
        <button className="pbtn danger" onClick={excluir}>Excluir lead</button>
      </div>
    </aside>
  );
}

function Par({ k, v }: { k: string; v: string }) {
  return <><dt>{k}</dt><dd>{v}</dd></>;
}

/* ---------- Cadastro manual (lead que chegou por telefone, loja, indicação) ---------- */
export function NovoLead({ onClose, onCreated }: { onClose: () => void; onCreated: (l: Lead) => void }) {
  const [f, setF] = useState({ nome: '', telefone: '', cidade: '', uf: '', perfil: 'residencial', origem_manual: 'direto', modelo: '', mensagem: '' });
  const [erro, setErro] = useState('');
  const salvar = async () => {
    if (!f.nome.trim()) return setErro('Informe o nome.');
    const row = {
      formulario: 'manual', nome: f.nome.trim(), telefone: soDigitos(f.telefone) ? '+55' + soDigitos(f.telefone) : null,
      cidade: f.cidade || null, uf: f.uf || null, perfil: f.perfil, origem_manual: f.origem_manual, modelo: f.modelo || null, mensagem: f.mensagem || null,
    };
    const { data, error } = await inserirLead(row as Partial<Lead>);
    if (error) return setErro(error.message);
    onCreated(data as Lead);
  };
  return (
    <aside className="gav" role="dialog" aria-modal="true" aria-label="Novo lead">
      <header className="gav__top"><div><h2>Novo lead</h2><p>Contato que chegou por telefone, loja ou indicação</p></div><button className="gav__x" onClick={onClose} aria-label="Fechar">✕</button></header>
      <div className="gav__body">
        <div className="gav__grid">
          <label className="full">Nome<input value={f.nome} onChange={(e) => setF({ ...f, nome: e.target.value })} /></label>
          <label>WhatsApp<input value={f.telefone} onChange={(e) => setF({ ...f, telefone: mascaraFone(e.target.value) })} placeholder="(00) 00000-0000" /></label>
          <label>Origem<select value={f.origem_manual} onChange={(e) => setF({ ...f, origem_manual: e.target.value })}>{Object.entries(CANAIS).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}</select></label>
          <label>Cidade<input value={f.cidade} onChange={(e) => setF({ ...f, cidade: e.target.value })} /></label>
          <label>UF<select value={f.uf} onChange={(e) => setF({ ...f, uf: e.target.value })}><option value="">—</option>{UFS.map((u) => <option key={u}>{u}</option>)}</select></label>
          <label>Perfil<select value={f.perfil} onChange={(e) => setF({ ...f, perfil: e.target.value })}>{PERFIS.map((p) => <option key={p.k} value={p.k}>{PERFIL_NOME[p.k]}</option>)}</select></label>
          <label>Modelo<select value={f.modelo} onChange={(e) => setF({ ...f, modelo: e.target.value })}><option value="">—</option>{modelos.map((m) => <option key={m.slug}>{m.nome}</option>)}</select></label>
          <label className="full">Observação<textarea value={f.mensagem} onChange={(e) => setF({ ...f, mensagem: e.target.value })} /></label>
        </div>
        {erro && <p className="perr">{erro}</p>}
        <div className="gav__save"><button className="pbtn" onClick={salvar}>Criar lead</button></div>
      </div>
    </aside>
  );
}
