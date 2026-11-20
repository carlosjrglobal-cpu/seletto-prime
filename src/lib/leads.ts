/* =====================================================================
   Regras de lead — compartilhadas pelo site (/orcamento, /contato) e pelo painel.
   Baseado em "Formulário de qualificação de leads — Versão 1.0 (nov/2026)".
   ===================================================================== */
import { supa, supaConfigurado } from './supabase';

/* ---------------- Funil de qualificação ---------------- */
export type Perfil = 'residencial' | 'sala_jogos' | 'condominio' | 'empresa';
export type Pergunta = { id: string; titulo: string; ajuda?: string; opcoes: string[] };

export const PERFIS: { k: Perfil; titulo: string; desc: string; icone: string }[] = [
  { k: 'residencial', titulo: 'Mesa 3 em 1 para residência', desc: 'Bilhar, jantar e tênis de mesa para a sua casa', icone: 'layers' },
  { k: 'sala_jogos', titulo: 'Sala de jogos completa', desc: 'Bilhar com pebolim, poker, ping pong e mais', icone: 'bilhar' },
  { k: 'condominio', titulo: 'Condomínio / área comum', desc: 'Salão de jogos e espaços de convivência', icone: 'cube' },
  { k: 'empresa', titulo: 'Hotelaria / empresa', desc: 'Hotéis, clubes, escritórios e projetos corporativos', icone: 'gem' },
];
export const PERFIL_NOME: Record<string, string> = {
  residencial: 'Residencial 3 em 1', sala_jogos: 'Sala de jogos', condominio: 'Condomínio', empresa: 'Hotelaria / empresa',
};

const INV_CORP = ['Até R$ 15.000', 'De R$ 15.000 a R$ 30.000', 'De R$ 30.000 a R$ 50.000', 'Acima de R$ 50.000', 'Orçamento ainda não definido'];
export const PERGUNTAS: Record<Perfil, Pergunta[]> = {
  residencial: [
    { id: 'investimento', titulo: 'Qual faixa de investimento você planeja?', opcoes: ['Até R$ 10.000', 'De R$ 10.000 a R$ 15.000', 'De R$ 15.000 a R$ 25.000', 'Acima de R$ 25.000', 'Ainda não defini'] },
    { id: 'prazo', titulo: 'Quando pretende adquirir sua mesa?', opcoes: ['Até 30 dias', 'De 1 a 3 meses', 'De 3 a 6 meses', 'Ainda estou pesquisando'] },
  ],
  sala_jogos: [
    { id: 'jogos', titulo: 'Quais jogos deseja incluir?', opcoes: ['Bilhar + jantar + ping pong', 'Bilhar + pebolim', 'Bilhar + poker / cartas', 'Projeto com vários jogos'] },
    { id: 'investimento', titulo: 'Qual investimento previsto para o projeto?', opcoes: ['Até R$ 15.000', 'De R$ 15.000 a R$ 30.000', 'De R$ 30.000 a R$ 50.000', 'Acima de R$ 50.000', 'Ainda não defini'] },
    { id: 'prazo', titulo: 'Quando pretende realizar o projeto?', opcoes: ['Até 30 dias', 'De 1 a 3 meses', 'De 3 a 6 meses', 'Ainda estou planejando'] },
  ],
  condominio: [
    { id: 'papel', titulo: 'Qual a sua participação no projeto?', opcoes: ['Síndico(a)', 'Construtora / incorporadora', 'Administradora', 'Morador(a) / conselheiro(a)'] },
    { id: 'investimento', titulo: 'Qual o investimento estimado?', opcoes: INV_CORP },
    { id: 'prazo', titulo: 'Em qual fase está a aquisição?', opcoes: ['Compra aprovada', 'Orçamentos para aprovação', 'Projeto em planejamento'] },
  ],
  empresa: [
    { id: 'papel', titulo: 'Qual a sua participação no projeto?', opcoes: ['Proprietário(a)', 'Gestor(a) / compras', 'Arquiteto(a) / especificador(a)', 'Outro'] },
    { id: 'investimento', titulo: 'Qual o investimento estimado?', opcoes: INV_CORP },
    { id: 'prazo', titulo: 'Em qual fase está o projeto?', opcoes: ['Compra autorizada', 'Cotação em andamento', 'Planejamento futuro'] },
  ],
};
export const corporativo = (p?: string | null) => p === 'condominio' || p === 'empresa';

/* CNPJ: o PDF pede obrigatório, mas a decisão está pendente (seção 13).
   false = campo opcional com "informo depois". Mude para true para exigir. */
export const CNPJ_OBRIGATORIO = false;

/* ---------------- Classificação (seção 9 do PDF) ---------------- */
export type Classe = 'prioritario' | 'avaliacao' | 'nutricao';
export const CLASSES: Record<Classe, { label: string; cor: string; acao: string }> = {
  prioritario: { label: 'Prioritário', cor: '#16a34a', acao: 'Aviso imediato ao comercial' },
  avaliacao: { label: 'Em avaliação', cor: '#d97706', acao: 'Atendimento consultivo' },
  nutricao: { label: 'Nutrição', cor: '#6b7280', acao: 'Acompanhamento posterior' },
};
const SEM_VERBA = ['Ainda não defini', 'Orçamento ainda não definido'];
export function classificar(perfil: Perfil, r: Record<string, string>): Classe {
  const prazo = r.prazo || '';
  if (corporativo(perfil)) {
    if (['Compra aprovada', 'Compra autorizada'].includes(prazo)) return 'prioritario';
    if (['Orçamentos para aprovação', 'Cotação em andamento'].includes(prazo)) return 'avaliacao';
    return 'nutricao';
  }
  const verba = !SEM_VERBA.includes(r.investimento || '');
  if (prazo === 'Até 30 dias') return verba ? 'prioritario' : 'avaliacao';
  if (prazo === 'De 1 a 3 meses') return 'avaliacao';
  return 'nutricao';
}

/* ---------------- Status do atendimento (painel) ---------------- */
export const STATUS: { k: string; label: string; cor: string }[] = [
  { k: 'novo', label: 'Novo', cor: '#c6a15b' },
  { k: 'atendimento', label: 'Em atendimento', cor: '#2563eb' },
  { k: 'orcamento', label: 'Orçamento enviado', cor: '#7c3aed' },
  { k: 'negociacao', label: 'Em negociação', cor: '#d97706' },
  { k: 'venda', label: 'Venda fechada', cor: '#16a34a' },
  { k: 'semresposta', label: 'Sem resposta', cor: '#9ca3af' },
  { k: 'perdido', label: 'Perdido', cor: '#dc2626' },
];
export const statusDe = (k: string) => STATUS.find((s) => s.k === k) || STATUS[0];

/* ---------------- Origem (UTM, ids de clique, referrer) ---------------- */
export type Origem = Partial<Record<'utm_source' | 'utm_medium' | 'utm_campaign' | 'utm_term' | 'utm_content' | 'gclid' | 'gbraid' | 'wbraid' | 'fbclid' | 'referrer' | 'landing_page', string>>;
const CHAVES = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid'] as const;

/** Guarda a origem da PRIMEIRA página da visita (o anúncio costuma cair na home ou num modelo). */
export function capturarOrigem() {
  try {
    if (sessionStorage.getItem('sp_origem')) return;
    const u = new URL(location.href);
    const o: Origem = {};
    CHAVES.forEach((k) => { const v = u.searchParams.get(k); if (v) o[k] = v.slice(0, 200); });
    if (document.referrer && !document.referrer.startsWith(location.origin)) o.referrer = document.referrer.slice(0, 300);
    o.landing_page = (u.pathname + u.search).slice(0, 300);
    sessionStorage.setItem('sp_origem', JSON.stringify(o));
  } catch { /* navegação privada sem storage: segue sem origem */ }
}
export function lerOrigem(): Origem {
  try { return JSON.parse(sessionStorage.getItem('sp_origem') || '{}'); } catch { return {}; }
}

export const CANAIS: Record<string, { label: string; cor: string }> = {
  meta: { label: 'Meta Ads', cor: '#1877f2' },
  google: { label: 'Google Ads', cor: '#ea4335' },
  pago: { label: 'Pago (outro)', cor: '#9333ea' },
  instagram: { label: 'Instagram', cor: '#e1306c' },
  social: { label: 'Social', cor: '#0ea5e9' },
  organico: { label: 'Orgânico', cor: '#16a34a' },
  ia: { label: 'ChatGPT e IAs', cor: '#0d9488' },
  whatsapp: { label: 'WhatsApp', cor: '#22c55e' },
  direto: { label: 'Direto', cor: '#6b7280' },
};
type LinhaOrigem = Origem & { origem_manual?: string | null };
export function canal(l: LinhaOrigem): string {
  if (l.origem_manual && CANAIS[l.origem_manual]) return l.origem_manual;
  const src = (l.utm_source || '').toLowerCase();
  const med = (l.utm_medium || '').toLowerCase();
  const ref = (l.referrer || '').toLowerCase();
  const pago = /(cpc|ppc|paid|ads|cpm)/.test(med);
  if (l.fbclid || (/(facebook|fb|instagram|ig|meta)/.test(src) && (pago || !med))) return 'meta';
  if (l.gclid || l.gbraid || l.wbraid || (src === 'google' && pago)) return 'google';
  if (pago) return 'pago';
  if (/(chatgpt|openai|perplexity|gemini|copilot|claude)/.test(src + ref)) return 'ia';
  if (/instagram/.test(src + ref)) return 'instagram';
  if (/(whatsapp|wa\.me)/.test(src + ref)) return 'whatsapp';
  if (/(facebook|linkedin|tiktok|pinterest|youtube|t\.co|twitter)/.test(src + ref)) return 'social';
  if (src || /(google|bing|yahoo|duckduckgo)/.test(ref)) return 'organico';
  return 'direto';
}

/* ---------------- Telefone / CNPJ ---------------- */
export const soDigitos = (s: string) => (s || '').replace(/\D/g, '');
export function mascaraFone(v: string) {
  const d = soDigitos(v).slice(0, 11);
  if (d.length <= 2) return d ? `(${d}` : '';
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}
export const foneValido = (v: string) => /^[1-9]{2}9?\d{8}$/.test(soDigitos(v));
export function mascaraCnpj(v: string) {
  const d = soDigitos(v).slice(0, 14);
  return d.replace(/^(\d{2})(\d)/, '$1.$2').replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3').replace(/\.(\d{3})(\d)/, '.$1/$2').replace(/(\d{4})(\d)/, '$1-$2');
}
export function cnpjValido(v: string) {
  const c = soDigitos(v);
  if (c.length !== 14 || /^(\d)\1+$/.test(c)) return false;
  const dv = (base: string) => {
    const pesos = base.length === 12 ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const s = base.split('').reduce((acc, n, i) => acc + Number(n) * pesos[i], 0);
    const r = s % 11;
    return r < 2 ? 0 : 11 - r;
  };
  return dv(c.slice(0, 12)) === Number(c[12]) && dv(c.slice(0, 13)) === Number(c[13]);
}
export const UFS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

/* ---------------- Gravação ---------------- */
export type NovoLead = Record<string, unknown> & { nome: string; telefone: string };

/** Grava o lead (somente insert). Devolve o id, gerado aqui para o clique do WhatsApp. */
export async function gravarLead(dados: NovoLead): Promise<{ id: string; ok: boolean; erro?: string }> {
  const id = crypto.randomUUID();
  if (!supaConfigurado) return { id, ok: false, erro: 'Supabase não configurado' };
  const o = lerOrigem();
  const row = { id, ...o, ...dados, origem: canal(o) };
  const { error } = await supa().from('leads').insert(row);
  return error ? { id, ok: false, erro: error.message } : { id, ok: true };
}
export async function registrarCliqueWhatsapp(id: string) {
  if (!supaConfigurado) return;
  try { await supa().rpc('registrar_clique_whatsapp', { p_id: id }); } catch { /* medição não pode travar o clique */ }
}

/* ---------------- Meta Pixel (opcional) ---------------- */
export function pixel(evento: 'Lead' | 'Contact' | 'ViewContent', params?: Record<string, unknown>) {
  const w = window as unknown as { fbq?: (...a: unknown[]) => void };
  try { w.fbq?.('track', evento, params); } catch { /* sem pixel */ }
}
