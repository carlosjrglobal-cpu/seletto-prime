/* =====================================================================
   SELETTO PRIME — configuração e dados do site
   Textos e catálogo: src/data/catalogo.json
   Preços (opcional, fora do Git): precos.local.json na raiz do projeto
   ===================================================================== */
import catalogo from './catalogo.json';

export const config = {
  nome: 'Seletto Prime',
  siteUrl: 'https://selettoprime.com.br',

  // O catálogo 2026 é "Catálogo Interno — utilização exclusiva time de vendas".
  // true = exibe preços (só funciona se existir o precos.local.json).
  mostrarPrecos: false,

  whatsapp: '5548999102369',
  whatsappExibicao: '(48) 99910-2369',
  whatsappMensagem: 'Olá! Vim do site e gostaria de mais informações sobre as mesas.',
  telefone: '(48) 99910-2369',
  telefoneLink: '+5548999102369',
  endereco: 'Rua Vereador Antônio Ferreira Alves, 477',
  cidade: 'Canoas',
  uf: 'RS',
  horarios: [
    ['Segunda a sexta', '08:00 – 17:00'],
    ['Plantões aos sábados', '09:00 – 13:00'],
  ] as [string, string][],
  instagram: 'https://www.instagram.com/selettomesasoficial',
  instagramUsuario: '@selettomesasoficial',
  facebook: 'https://www.facebook.com/profile.php?id=61572834043533',
};

export type Linha = { id: string; nome: string; titulo: string; resumo: string; capa: string };
export type Feltro = { id: string; nome: string; hex: string };
export type Modelo = {
  slug: string; nome: string; linha: string; tamanhos: string[]; descricao: string[];
  temPar: boolean; jantarReal: boolean; foraDoCatalogo?: boolean; novo?: boolean;
};
export type Jogo = { id: string; nome: string; detalhe: string; medida: string };
export type Acessorio = { nome: string; img?: string };

export const linhas = catalogo.linhas as Linha[];
export const feltros = catalogo.feltros as Feltro[];
export const tecidos = catalogo.tecidos as string[];
export const acompanha = catalogo.acompanha as { icone: string; nome: string }[];
export const modelos = catalogo.modelos as Modelo[];
export const jogos = catalogo.jogos as Jogo[];
export const acessorios = catalogo.acessorios as Acessorio[];
export const galeria = catalogo.galeria as [string, number, number][];

export const ACABAMENTOS = [
  { nome: 'Preto laca', hex: '#151515', madeira: false },
  { nome: 'Branco laca', hex: '#ece9e3', madeira: false },
  { nome: 'Grafite', hex: '#4b4947', madeira: false },
  { nome: 'Bege', hex: '#d3c4ab', madeira: false },
  { nome: 'Madeira clara', hex: '#b98a5a', madeira: true },
  { nome: 'Madeira escura', hex: '#5b3a26', madeira: true },
];

export const linhaDe = (id: string) => linhas.find((l) => l.id === id)!;
export const modelosDa = (id: string) => modelos.filter((m) => m.linha === id);
export const modeloPorSlug = (slug: string) => modelos.find((m) => m.slug === slug);
export const rotaModelo = (slug: string) => `/modelo-${slug}/`;
export const usosDe = (m: Modelo) => (m.foraDoCatalogo ? ['bilhar', 'jantar'] : ['bilhar', 'jantar', 'pingpong']);
export const USO_NOME: Record<string, string> = { bilhar: 'Bilhar', jantar: 'Jantar', pingpong: 'Tênis de mesa' };

export const wa = (msg: string = config.whatsappMensagem) => `https://wa.me/${config.whatsapp}?text=${encodeURIComponent(msg)}`;
export const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });

/** Espaço livre sugerido: medida + taco de 1,45 m em cada lado. */
export function espaco(medida: string) {
  const [c, l] = medida.replace(' m', '').split(' x ').map((v) => parseFloat(v.replace(',', '.')));
  const f = (n: number) => n.toFixed(2).replace('.', ',');
  return `${f(c + 2.9)} x ${f(l + 2.9)} m`;
}

/** Fotos de um modelo, na ordem da galeria da página. */
export function fotosDe(m: Modelo) {
  const f: { k: string; label: string }[] = [{ k: 'capa', label: 'Destaque' }];
  if (m.temPar && m.slug !== 'eleganza') f.push({ k: 'bilhar', label: 'Versão bilhar' });
  if (m.temPar) f.push({ k: 'jantar', label: m.jantarReal ? 'Versão jantar' : 'Detalhe' });
  return f;
}
