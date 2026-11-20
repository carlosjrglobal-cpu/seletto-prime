import { classificar, PERGUNTAS, type Perfil } from '@/lib/leads';
import { supa } from '@/lib/supabase';
import type { Gasto, Lead } from './util';

/* Acesso ao banco. No modo demonstração (?demo=1) nada é gravado. */
let demo = false;
export const setDemo = (v: boolean) => { demo = v; };
export const emDemo = () => demo;
type R<T = null> = Promise<{ data?: T; error: { message: string } | null }>;

export async function atualizarLead(id: string, patch: Partial<Lead>): R {
  if (demo) return { error: null };
  const { error } = await supa().from('leads').update(patch).eq('id', id);
  return { error };
}
export async function excluirLead(id: string): R {
  if (demo) return { error: null };
  const { error } = await supa().from('leads').delete().eq('id', id);
  return { error };
}
export async function inserirLead(row: Partial<Lead>): R<Lead> {
  if (demo) return { data: { ...vazio(), ...row, id: crypto.randomUUID(), created_at: new Date().toISOString() } as Lead, error: null };
  const { data, error } = await supa().from('leads').insert(row).select().single();
  return { data: data as Lead, error };
}
export async function salvarGasto(row: Gasto): R {
  if (demo) return { error: null };
  const { error } = await supa().from('ad_spend').upsert(row);
  return { error };
}

const vazio = (): Partial<Lead> => ({ status: 'novo', orcamento: 0, venda: 0, notas: [], respostas: {}, venda_at: null, wa_clicked_at: null });

/* ---------- dados fictícios para a demonstração ---------- */
export function leadsDemo(): { leads: Lead[]; gastos: Gasto[] } {
  let s = 42;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const pick = <T,>(a: T[]) => a[Math.floor(r() * a.length)];
  const nomes = ['Mariana Costa', 'Ricardo Alves', 'Fernanda Lima', 'Paulo Henrique', 'Juliana Rocha', 'Eduardo Martins', 'Camila Souza', 'Roberto Nunes', 'Aline Ferreira', 'Gustavo Pereira', 'Patrícia Gomes', 'Marcelo Dias', 'Beatriz Ramos', 'Thiago Barros', 'Luciana Pinto', 'André Carvalho', 'Renata Moraes', 'Felipe Teixeira', 'Vanessa Duarte', 'Carlos Eduardo'];
  const cidades: [string, string][] = [['Porto Alegre', 'RS'], ['Canoas', 'RS'], ['Florianópolis', 'SC'], ['Curitiba', 'PR'], ['São Paulo', 'SP'], ['Gramado', 'RS'], ['Balneário Camboriú', 'SC'], ['Novo Hamburgo', 'RS']];
  const modelos = ['Zeus', 'Coliseu', 'Comodo', 'Ravena', 'Bergamo', 'Milano', 'Iron', 'Sofisticatto', null];
  const perfis: Perfil[] = ['residencial', 'residencial', 'residencial', 'residencial', 'sala_jogos', 'condominio', 'empresa'];
  const fontes: Record<string, string | null>[] = [
    { utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'video-institucional', utm_content: 'video-3em1', fbclid: 'demo' },
    { utm_source: 'facebook', utm_medium: 'paid', utm_campaign: 'video-institucional', utm_content: 'video-coliseu', fbclid: 'demo' },
    { gclid: 'demo', utm_source: 'google', utm_medium: 'cpc' }, { referrer: 'https://www.google.com/' }, { referrer: 'https://l.instagram.com/' }, {},
  ];
  const leads: Lead[] = [];
  for (let i = 0; i < 46; i++) {
    const perfil = pick(perfis);
    const resp: Record<string, string> = {};
    PERGUNTAS[perfil].forEach((q) => { resp[q.id] = pick(q.opcoes); });
    const criado = new Date(Date.now() - r() * 58 * 86400000);
    const classe = classificar(perfil, resp);
    const st = pick(classe === 'prioritario' ? ['atendimento', 'orcamento', 'negociacao', 'venda', 'venda'] : classe === 'avaliacao' ? ['novo', 'atendimento', 'orcamento', 'semresposta', 'venda'] : ['novo', 'semresposta', 'perdido', 'atendimento']);
    const [cidade, uf] = pick(cidades);
    const orc = ['orcamento', 'negociacao', 'venda', 'perdido'].includes(st) ? Math.round((9000 + r() * 14000) / 100) * 100 : 0;
    const respostas: Record<string, string> = {};
    PERGUNTAS[perfil].forEach((q) => { respostas[q.titulo] = resp[q.id]; });
    leads.push({
      ...(vazio() as Lead), ...pick(fontes),
      id: 'demo-' + i, created_at: criado.toISOString(), nome: nomes[i % nomes.length], telefone: '+55' + pick(['51', '48', '41', '11']) + '9' + String(Math.floor(10000000 + r() * 89999999)),
      cidade, uf, formulario: r() > 0.15 ? 'orcamento' : 'contato', perfil, investimento: resp.investimento || null, prazo: resp.prazo || null,
      papel: resp.papel || null, jogos: resp.jogos || null, empresa: perfil === 'condominio' ? 'Residencial Jardins' : perfil === 'empresa' ? 'Hotel Serra Azul' : null,
      cnpj: null, modelo: pick(modelos), respostas, classificacao: classe, wa_clicked_at: r() > 0.3 ? criado.toISOString() : null,
      status: st, orcamento: orc, venda: st === 'venda' ? orc : 0, venda_at: st === 'venda' ? new Date(criado.getTime() + r() * 20 * 86400000).toISOString() : null,
      notas: st !== 'novo' ? [{ ts: new Date(criado.getTime() + 3600000).toISOString(), txt: 'Primeiro contato pelo WhatsApp.' }] : [],
    } as Lead);
  }
  leads.sort((a, b) => b.created_at.localeCompare(a.created_at));
  const m = (d: number) => new Date(Date.now() - d * 86400000).toISOString().slice(0, 7);
  return { leads, gastos: [{ month: m(0), meta: 3200, google: 800, outros: 0 }, { month: m(31), meta: 2800, google: 600, outros: 0 }] };
}
