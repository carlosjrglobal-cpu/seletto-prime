import { canal } from '@/lib/leads';

export type Nota = { ts: string; txt: string };
export type Lead = {
  id: string; created_at: string;
  nome: string | null; telefone: string | null; email: string | null; cidade: string | null; uf: string | null;
  formulario: string | null; perfil: string | null; investimento: string | null; prazo: string | null; papel: string | null;
  jogos: string | null; empresa: string | null; cnpj: string | null; modelo: string | null; tamanho: string | null; mensagem: string | null;
  respostas: Record<string, string> | null; classificacao: string | null;
  origem: string | null; utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; utm_term: string | null;
  utm_content: string | null; gclid: string | null; gbraid: string | null; wbraid: string | null; fbclid: string | null;
  referrer: string | null; landing_page: string | null; wa_clicked_at: string | null;
  status: string; origem_manual: string | null; orcamento: number; venda: number; venda_at: string | null;
  perdido_motivo: string | null; notas: Nota[];
};
export type Gasto = { month: string; meta: number; google: number; outros: number };

export const canalDe = (l: Lead) => canal(l as unknown as Parameters<typeof canal>[0]);
export const mesDe = (iso: string) => iso.slice(0, 7);
export function nomeMes(k: string) {
  if (k === 'todos') return 'Todos os meses';
  const [y, m] = k.split('-').map(Number);
  const s = new Date(y, m - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return s.charAt(0).toUpperCase() + s.slice(1);
}
export const dinheiro = (n: number) => (n || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
export const pct = (a: number, b: number) => (b ? Math.round((a / b) * 1000) / 10 + '%' : '—');
export function dataHora(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }) + ' · ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}
export const diasDesde = (iso: string) => Math.max(0, Math.floor((Date.now() - new Date(iso).getTime()) / 86400000));
export function ciclo(l: Lead) {
  if (!l.venda_at) return null;
  return Math.max(0, Math.round((new Date(l.venda_at).getTime() - new Date(l.created_at).getTime()) / 86400000));
}
export const foneExib = (f: string | null) => {
  const d = (f || '').replace(/\D/g, '').replace(/^55(?=\d{10,11}$)/, '');
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return f || '—';
};
export const waDo = (f: string | null, txt = '') => {
  let d = (f || '').replace(/\D/g, '');
  if (d.length <= 11) d = '55' + d;
  return `https://wa.me/${d}${txt ? '?text=' + encodeURIComponent(txt) : ''}`;
};
export const cnpjExib = (c: string | null) => (c && c.length === 14 ? c.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5') : c || '—');

export function csv(leads: Lead[]) {
  const cols: (keyof Lead)[] = ['created_at', 'nome', 'telefone', 'cidade', 'uf', 'perfil', 'investimento', 'prazo', 'papel', 'jogos', 'empresa', 'cnpj', 'modelo', 'classificacao', 'status', 'orcamento', 'venda', 'origem', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'wa_clicked_at'];
  const q = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return '﻿' + [cols.join(';'), ...leads.map((l) => cols.map((c) => q(l[c])).join(';'))].join('\n');
}
