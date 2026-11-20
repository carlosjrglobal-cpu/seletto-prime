import 'server-only';
import fs from 'node:fs';
import path from 'node:path';
import { config, type Modelo } from './site';

/* Preços ficam em precos.local.json (fora do Git). Sem o arquivo, ou com
   config.mostrarPrecos = false, o site é gerado sem nenhum preço. */
type Precos = { modelos?: Record<string, number[]>; jogos?: Record<string, number>; acessorios?: Record<string, number> };

let cache: Precos | null = null;
function ler(): Precos {
  if (cache) return cache;
  if (!config.mostrarPrecos) return (cache = {});
  try {
    cache = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'precos.local.json'), 'utf8')) as Precos;
  } catch {
    cache = {};
  }
  return cache;
}

export const precosModelo = (m: Modelo): (number | null)[] => m.tamanhos.map((_, i) => ler().modelos?.[m.slug]?.[i] ?? null);
export const precoMin = (m: Modelo): number | null => {
  const p = precosModelo(m).filter((v): v is number => !!v);
  return p.length ? Math.min(...p) : null;
};
export const precoJogo = (id: string) => ler().jogos?.[id] ?? null;
export const precoAcessorio = (nome: string) => ler().acessorios?.[nome] ?? null;
