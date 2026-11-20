'use client';
import { useEffect, useState } from 'react';
import { CANAIS, CLASSES, PERFIL_NOME, PERFIS, STATUS } from '@/lib/leads';
import { salvarGasto as gravarGasto } from './db';
import { canalDe, ciclo, dinheiro, nomeMes, pct, type Gasto, type Lead } from './util';
import { Kpi } from './Leads';

export default function Relatorios({ leads, mes, gastos, onGasto }: { leads: Lead[]; mes: string; gastos: Gasto[]; onGasto: (g: Gasto) => void }) {
  const doMes = mes === 'todos'
    ? gastos.reduce((a, g) => ({ month: 'todos', meta: a.meta + +g.meta, google: a.google + +g.google, outros: a.outros + +g.outros }), { month: 'todos', meta: 0, google: 0, outros: 0 })
    : gastos.find((g) => g.month === mes) || { month: mes, meta: 0, google: 0, outros: 0 };
  const [g, setG] = useState(doMes);
  const [salvo, setSalvo] = useState('');
  useEffect(() => { setG(doMes); setSalvo(''); }, [mes, gastos]); // eslint-disable-line react-hooks/exhaustive-deps

  const salvarGasto = async () => {
    if (mes === 'todos') return;
    const row = { month: mes, meta: +g.meta || 0, google: +g.google || 0, outros: +g.outros || 0 };
    const { error } = await gravarGasto(row);
    setSalvo(error ? 'Erro: ' + error.message : 'Salvo.');
    if (!error) onGasto(row);
  };

  const gasto = (+g.meta || 0) + (+g.google || 0) + (+g.outros || 0);
  const vendas = leads.filter((l) => l.status === 'venda');
  const fat = vendas.reduce((a, l) => a + (Number(l.venda) || 0), 0);
  const orcado = leads.reduce((a, l) => a + (Number(l.orcamento) || 0), 0);
  const pagos = leads.filter((l) => ['meta', 'google', 'pago'].includes(canalDe(l)));
  const fatPago = pagos.filter((l) => l.status === 'venda').reduce((a, l) => a + (Number(l.venda) || 0), 0);
  const ciclos = vendas.map(ciclo).filter((n): n is number => n != null);
  const forms = leads.filter((l) => l.formulario === 'orcamento');
  const cliques = forms.filter((l) => l.wa_clicked_at).length;

  const grupo = (chave: (l: Lead) => string | null, ordem: { k: string; label: string; cor: string }[]) =>
    ordem.map((o) => ({ ...o, n: leads.filter((l) => chave(l) === o.k).length })).filter((o) => o.n > 0);
  const porOrigem = grupo(canalDe, Object.entries(CANAIS).map(([k, v]) => ({ k, ...v }))).sort((a, b) => b.n - a.n);
  const porClasse = grupo((l) => l.classificacao, Object.entries(CLASSES).map(([k, v]) => ({ k, label: v.label, cor: v.cor })));
  const porPerfil = grupo((l) => l.perfil, PERFIS.map((p) => ({ k: p.k, label: PERFIL_NOME[p.k], cor: '#c6a15b' })));
  const porStatus = grupo((l) => l.status, STATUS);

  // leads por dia (mês escolhido) ou por mês (todos)
  const serie = (() => {
    const m = new Map<string, number>();
    leads.forEach((l) => { const k = mes === 'todos' ? l.created_at.slice(0, 7) : l.created_at.slice(8, 10); m.set(k, (m.get(k) || 0) + 1); });
    return [...m.entries()].sort();
  })();
  const maxSerie = Math.max(1, ...serie.map(([, n]) => n));

  return (
    <>
      <div className="spend">
        <div><b>Investimento em anúncios — {nomeMes(mes)}</b><small>{mes === 'todos' ? 'Escolha um mês no topo para lançar o gasto.' : 'Digite o gasto do mês em cada plataforma. CPL, ROAS e ROI são calculados com as vendas do período.'}</small></div>
        <div className="spend__ins">
          {(['meta', 'google', 'outros'] as const).map((k) => (
            <label key={k}><span>{k === 'meta' ? 'Meta' : k === 'google' ? 'Google' : 'Outros'} R$</span>
              <input type="number" min="0" step="100" value={g[k]} disabled={mes === 'todos'} onChange={(e) => setG({ ...g, [k]: e.target.value as unknown as number })} /></label>
          ))}
          {mes !== 'todos' && <button className="pbtn" onClick={salvarGasto}>Salvar</button>}
          {salvo && <small>{salvo}</small>}
        </div>
      </div>

      <div className="kpis">
        <Kpi l="Leads" v={String(leads.length)} s={`${pagos.length} de mídia paga`} />
        <Kpi l="Custo por lead (CPL)" v={gasto && pagos.length ? dinheiro(gasto / pagos.length) : '—'} s="gasto ÷ leads pagos" />
        <Kpi l="Vendas" v={String(vendas.length)} s={`conversão ${pct(vendas.length, leads.length)}`} />
        <Kpi l="Faturamento" v={dinheiro(fat)} s={vendas.length ? 'ticket ' + dinheiro(fat / vendas.length) : undefined} cor="var(--gold-ink)" />
        <Kpi l="ROAS" v={gasto ? (fatPago / gasto).toFixed(1).replace('.', ',') + 'x' : '—'} s="vendas de mídia paga ÷ gasto" />
        <Kpi l="ROI" v={gasto ? pct(fatPago - gasto, gasto) : '—'} />
        <Kpi l="Ciclo médio de venda" v={ciclos.length ? Math.round(ciclos.reduce((a, b) => a + b, 0) / ciclos.length) + ' dias' : '—'} s="do lead à venda" />
        <Kpi l="Formulário → WhatsApp" v={pct(cliques, forms.length)} s={`${cliques} de ${forms.length} clicaram`} />
      </div>

      <div className="rgrid">
        <Barras titulo="Leads por origem" sub="De onde vieram os contatos" itens={porOrigem} total={leads.length} />
        <Barras titulo="Classificação" sub="Prioridade sugerida pelo formulário" itens={porClasse} total={leads.length} />
        <Barras titulo="Perfil do projeto" sub="O que cada lead procura" itens={porPerfil} total={leads.length} />
        <Barras titulo="Funil de status" sub="Em que pé está cada lead" itens={porStatus} total={leads.length} />
        <div className="pcard">
          <h3>Orçado × vendido</h3><small>Volume financeiro do período</small>
          <div className="vs"><div><span>Em orçamentos</span><b>{dinheiro(orcado)}</b></div><div><span>Em vendas</span><b style={{ color: '#16a34a' }}>{dinheiro(fat)}</b></div></div>
          <Barra label="Taxa de fechamento" n={vendas.length} total={leads.filter((l) => l.orcamento > 0 || l.status === 'venda').length} cor="#16a34a" />
        </div>
        <div className="pcard">
          <h3>{mes === 'todos' ? 'Leads por mês' : 'Leads por dia'}</h3><small>{nomeMes(mes)}</small>
          <div className="serie">{serie.map(([k, n]) => <div key={k} title={`${k}: ${n}`}><span style={{ height: (n / maxSerie) * 100 + '%' }} /><small>{mes === 'todos' ? k.slice(5) + '/' + k.slice(2, 4) : k}</small></div>)}</div>
        </div>
      </div>
    </>
  );
}

function Barras({ titulo, sub, itens, total }: { titulo: string; sub: string; itens: { k: string; label: string; cor: string; n: number }[]; total: number }) {
  return (
    <div className="pcard">
      <h3>{titulo}</h3><small>{sub}</small>
      <div className="bars">{itens.map((i) => <Barra key={i.k} label={i.label} n={i.n} total={total} cor={i.cor} />)}{!itens.length && <p className="vazio">Sem dados no período.</p>}</div>
    </div>
  );
}
function Barra({ label, n, total, cor }: { label: string; n: number; total: number; cor: string }) {
  return <div className="bar"><span>{label}</span><div><i style={{ width: (total ? (n / total) * 100 : 0) + '%', background: cor }} /></div><b>{n} <small>{pct(n, total)}</small></b></div>;
}
