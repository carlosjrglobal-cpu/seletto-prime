/* =====================================================================
   SELETTO PRIME — gerador do site estático
   Uso:  node _build/build.js
   Gera: index.html, catalogo/, galeria/, sobre/, contato/,
         modelo-<slug>/ (uma página por mesa), sitemap.xml e robots.txt
   ===================================================================== */
const fs = require('fs');
const path = require('path');
const D = require('./dados');

const ROOT = path.resolve(__dirname, '..');
const C = D.config;
const ANO = new Date().getFullYear();

/* ---------------- helpers ---------------- */
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const brl = (n) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 2 });
const wa = (msg = C.whatsappMensagem) => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(msg)}`;
const linhaDe = (id) => D.linhas.find((l) => l.id === id);
const modelosDa = (id) => D.modelos.filter((m) => m.linha === id);
const minPreco = (m) => { const p = m.tamanhos.map((t) => t.preco).filter(Boolean); return p.length ? Math.min(...p) : null; };
const primeiraFrase = (m) => m.descricao[0];
const write = (rel, html) => {
  const file = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
};

// Rotas (mantêm as URLs do site WordPress atual: /modelo-comodo/, /sobre/ ...)
const ROTAS = {
  home: '',
  catalogo: 'catalogo/',
  galeria: 'galeria/',
  sobre: 'sobre/',
  contato: 'contato/',
};
const rotaModelo = (slug) => `modelo-${slug}/`;
// link relativo a partir de uma página com profundidade `d` (0 = raiz)
const L = (d, rota, hash = '') => {
  const pre = d ? '../'.repeat(d) : '';
  if (C.urlsLimpas) return (pre + rota || './') + hash;
  return pre + rota + 'index.html' + hash;
};
const A = (d, p) => (d ? '../'.repeat(d) : '') + 'assets/' + p;
const img = (d, p) => A(d, 'img/' + p);

/* ---------------- ícones ---------------- */
const I = {
  arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  arrowL: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  chevron: '<path d="m6 9 6 6 6-6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>',
  pin: '<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/>',
  facebook: '<path d="M14 21v-7.5h2.6l.4-3H14V8.6c0-.9.3-1.5 1.6-1.5H17V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9v2.3H8.5v3H11V21"/>',
  truck: '<path d="M2.5 6.5h11v9h-11zM13.5 9.5h4l3 3v3h-7"/><circle cx="6.5" cy="17" r="1.8"/><circle cx="17" cy="17" r="1.8"/>',
  shield: '<path d="M12 3 5 6v5c0 4.5 3 8.3 7 10 4-1.7 7-5.5 7-10V6z"/><path d="m9 12 2 2 4-4"/>',
  ruler: '<path d="M3 15 15 3l6 6L9 21z"/><path d="m7 11 2 2M10 8l2 2M13 5l2 2"/>',
  palette: '<path d="M12 3a9 9 0 1 0 0 18c1 0 1.6-.8 1.6-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.2 0-.9.8-1.7 1.7-1.7H16a5 5 0 0 0 5-5C21 6.6 17 3 12 3z"/><circle cx="7.5" cy="11" r="1"/><circle cx="10" cy="7" r="1"/><circle cx="15" cy="7.5" r="1"/>',
  layers: '<path d="m12 3 9 4.5-9 4.5-9-4.5z"/><path d="m3 12 9 4.5 9-4.5"/><path d="m3 16.5 9 4.5 9-4.5"/>',
  pencil: '<path d="M4 20l4-1 11-11-3-3L5 16z"/><path d="m14 6 3 3"/>',
  cube: '<path d="m12 3 8 4.5v9L12 21l-8-4.5v-9z"/><path d="M4 7.5 12 12l8-4.5M12 12v9"/>',
  chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9.5h8M8 12.5h5"/>',
  gem: '<path d="M6 4h12l3 5-9 11L3 9z"/><path d="M3 9h18M12 20 8.5 9 10 4M12 20l3.5-11L14 4"/>',
  heart: '<path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/>',
  expand: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  swap: '<path d="M9 7 4 12l5 5M15 7l5 5-5 5"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="m3 7 9 6 9-6"/>',
  bilhar: '<circle cx="12" cy="6" r="2.4"/><circle cx="9.5" cy="10.4" r="2.4"/><circle cx="14.5" cy="10.4" r="2.4"/><circle cx="7" cy="14.8" r="2.4"/><circle cx="12" cy="14.8" r="2.4"/><circle cx="17" cy="14.8" r="2.4"/><path d="M3.5 19.5h17"/>',
  jantar: '<circle cx="12" cy="12" r="5.5"/><path d="M3.5 4v5a2 2 0 0 0 2 2v9M3.5 4v4M5.5 4v4M7.5 4v5a2 2 0 0 1-2 2"/><path d="M20.5 4c-1.6 0-2.6 2-2.6 5s1 3.5 2.6 3.5V20"/>',
  pingpong: '<circle cx="10" cy="10" r="6"/><path d="m14.3 14.3 5.2 5.2"/><circle cx="19" cy="5.5" r="1.6"/>',
  taco: '<path d="M3 21 16 8"/><path d="m16 8 2.2-2.2" stroke-width="3"/><circle cx="20" cy="4" r="1.6"/>',
  suporte: '<path d="M4 3v18M20 3v18M4 7h16M4 17h16M8.5 4v15M12 4v15M15.5 4v15"/>',
  tampo: '<rect x="2.5" y="7.5" width="19" height="4" rx="1"/><path d="M5 11.5V20M19 11.5V20"/>',
  'suporte-tampo': '<rect x="5" y="3" width="14" height="11" rx="1"/><path d="M8 14l-2 7M16 14l2 7M12 14v7"/>',
  bolas: '<circle cx="7" cy="15.5" r="4"/><circle cx="17" cy="15.5" r="4"/><circle cx="12" cy="7.5" r="4"/>',
  triangulo: '<path d="M12 4 21 19H3z"/><path d="M12 9.6 16.2 16.8H7.8z"/>',
  giz: '<path d="M6 9h12v11H6z"/><path d="M6 9l2-4h8l2 4"/><path d="M10 9a2 1 0 0 0 4 0"/>',
  whatsapp: '<path d="M3.6 20.4 4.9 16A8.5 8.5 0 1 1 8.1 19z" fill="none"/><path d="M9 8.6c.2-.5.5-.6.8-.6h.5c.2 0 .4.1.5.4l.7 1.6c.1.2 0 .5-.1.6l-.5.6c-.1.2-.1.4 0 .6.6 1 1.5 1.9 2.6 2.5.2.1.4.1.6-.1l.6-.6c.2-.2.4-.2.6-.1l1.6.7c.3.1.4.3.4.5v.5c0 .3-.2.6-.6.8-.6.3-1.6.5-2.9-.1-1.6-.7-3-2.1-3.8-3.6-.6-1.2-.4-2.1-.1-2.7z" fill="currentColor" stroke="none"/>',
};
const ic = (n, cls = '') => `<svg${cls ? ` class="${cls}"` : ''} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${I[n]}</svg>`;

const LOGO = fs.readFileSync(path.join(ROOT, 'assets/img/logo/logo-seletto-prime.svg'), 'utf8')
  .replace('<svg ', '<svg aria-hidden="true" focusable="false" ')
  .replace(/ role="img" aria-label="[^"]*"/, '');

/* ---------------- partes compartilhadas ---------------- */
function header(d, ativo, solido) {
  const cols = D.linhas.map((l) => `
          <div class="mega__col">
            <h3>${esc(l.titulo)} <span>${modelosDa(l.id).length}</span></h3>
            <ul>${modelosDa(l.id).map((m) => `<li><a href="${L(d, rotaModelo(m.slug))}">${esc(m.nome)}</a></li>`).join('')}</ul>
          </div>`).join('');
  const item = (id, rota, txt, hash = '') => `<li><a class="nav__a" href="${L(d, rota, hash)}"${ativo === id ? ' aria-current="page"' : ''}>${txt}</a></li>`;
  return `
<header class="hdr${solido ? ' hdr--solid' : ''}">
  <div class="wrap hdr__in">
    <a class="hdr__logo" href="${L(d, ROTAS.home)}" aria-label="Seletto Prime — página inicial">${LOGO}</a>
    <nav aria-label="Principal">
      <ul class="nav">
        <li class="has-mega">
          <button class="nav__a" type="button" aria-expanded="false" aria-controls="mega"${ativo === 'mesas' ? ' aria-current="page"' : ''}>Mesas ${ic('chevron')}</button>
          <div class="mega" id="mega">
            <div class="wrap mega__in">${cols}
              <a class="mega__feat" href="${L(d, ROTAS.catalogo)}">
                <img src="${img(d, 'catalogo-capa-sm.webp')}" alt="" loading="lazy" width="640" height="453">
                <span>Ver catálogo completo ${ic('arrow')}</span>
              </a>
            </div>
          </div>
        </li>
        ${item('catalogo', ROTAS.catalogo, 'Catálogo')}
        ${item('3em1', ROTAS.home, '3 em 1', '#tres-em-um')}
        ${item('galeria', ROTAS.galeria, 'Galeria')}
        ${item('sobre', ROTAS.sobre, 'Sobre')}
        ${item('contato', ROTAS.contato, 'Contato')}
      </ul>
    </nav>
    <a class="btn btn--gold btn--sm hdr__cta" href="${wa()}" target="_blank" rel="noopener">${ic('whatsapp')} Orçamento</a>
    <button class="hdr__burger" type="button" aria-label="Abrir menu" aria-controls="mnav" aria-expanded="false">${ic('menu')}</button>
  </div>
</header>
<div class="mnav" id="mnav" role="dialog" aria-modal="true" aria-label="Menu">
  <div class="wrap">
    <div class="mnav__top">
      <a class="hdr__logo" href="${L(d, ROTAS.home)}" aria-label="Seletto Prime — página inicial">${LOGO}</a>
      <button class="mnav__close" type="button" aria-label="Fechar menu">${ic('close')}</button>
    </div>
    <ul class="mnav__list">
      <li><details><summary>Mesas ${ic('chevron')}</summary>
        <div class="mnav__sub">${D.linhas.map((l) => `
          <div><h4>${esc(l.titulo)}</h4><ul>${modelosDa(l.id).map((m) => `<li><a href="${L(d, rotaModelo(m.slug))}">${esc(m.nome)}</a></li>`).join('')}</ul></div>`).join('')}
        </div></details></li>
      <li><a href="${L(d, ROTAS.catalogo)}">Catálogo ${ic('arrow')}</a></li>
      <li><a href="${L(d, ROTAS.home, '#tres-em-um')}">3 em 1 ${ic('arrow')}</a></li>
      <li><a href="${L(d, ROTAS.galeria)}">Galeria ${ic('arrow')}</a></li>
      <li><a href="${L(d, ROTAS.sobre)}">Sobre ${ic('arrow')}</a></li>
      <li><a href="${L(d, ROTAS.contato)}">Contato ${ic('arrow')}</a></li>
    </ul>
    <div class="mnav__foot">
      <a class="btn btn--wa btn--block" href="${wa()}" target="_blank" rel="noopener">${ic('whatsapp')} Falar no WhatsApp</a>
      <a class="btn btn--ghost btn--block" href="tel:${C.telefoneLink}">${ic('phone')} ${esc(C.telefone)}</a>
    </div>
  </div>
</div>`;
}

function footer(d) {
  return `
<footer class="ftr">
  <div class="wrap ftr__top">
    <div class="ftr__brand">
      <a class="hdr__logo" href="${L(d, ROTAS.home)}" aria-label="Seletto Prime — página inicial">${LOGO}</a>
      <p>Mesas de jogos com design exclusivo. Bilhar, jantar e tênis de mesa em uma única peça, do conceito à instalação.</p>
      <div class="ftr__social">
        <a href="${C.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${ic('instagram')}</a>
        <a href="${C.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${ic('facebook')}</a>
        <a href="${wa()}" target="_blank" rel="noopener" aria-label="WhatsApp">${ic('whatsapp')}</a>
      </div>
    </div>
    <div>
      <h4>Coleção</h4>
      <ul>
        ${D.linhas.map((l) => `<li><a href="${L(d, ROTAS.catalogo, '#' + l.id)}">${esc(l.titulo)}</a></li>`).join('')}
        <li><a href="${L(d, ROTAS.catalogo, '#jogos')}">Outras opções de jogos</a></li>
        <li><a href="${L(d, ROTAS.catalogo, '#acessorios')}">Acessórios</a></li>
      </ul>
    </div>
    <div>
      <h4>Contato</h4>
      <ul class="ftr__contact">
        <li>${ic('pin')}<span>${esc(C.endereco)}<br>${esc(C.cidade)} – ${esc(C.uf)}</span></li>
        <li>${ic('phone')}<a href="tel:${C.telefoneLink}">${esc(C.telefone)}</a></li>
        <li>${ic('whatsapp')}<a href="${wa()}" target="_blank" rel="noopener">${esc(C.whatsappExibicao)}</a></li>
      </ul>
    </div>
    <div>
      <h4>Funcionamento</h4>
      <ul class="ftr__contact">
        ${C.horarios.map(([dia, h]) => `<li>${ic('clock')}<span>${esc(dia)}<br>${esc(h)}</span></li>`).join('')}
      </ul>
    </div>
  </div>
  <div class="ftr__line"><div class="wrap ftr__bot">
    <span>© ${ANO} ${esc(C.nome)}. Todos os direitos reservados.</span>
    <span>Site seguro · Enviamos para todo o Brasil</span>
  </div></div>
</footer>
<a class="wa-float" href="${wa()}" target="_blank" rel="noopener" aria-label="Fale conosco pelo WhatsApp">${ic('whatsapp')}<span>Fale conosco</span></a>`;
}

function layout({ d, id, titulo, descricao, rota, og, corpo, solido = false, jsonld = [] }) {
  const url = C.siteUrl + '/' + rota;
  const ogImg = C.siteUrl + '/assets/img/' + (og || 'og/seletto-prime.jpg');
  return `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(titulo)}</title>
<meta name="description" content="${esc(descricao)}">
<link rel="canonical" href="${url}">
<meta property="og:type" content="website">
<meta property="og:locale" content="pt_BR">
<meta property="og:site_name" content="${esc(C.nome)}">
<meta property="og:title" content="${esc(titulo)}">
<meta property="og:description" content="${esc(descricao)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${ogImg}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#121110">
<link rel="icon" type="image/png" sizes="32x32" href="${img(d, 'logo/favicon-32.png')}">
<link rel="icon" type="image/png" sizes="48x48" href="${img(d, 'logo/favicon-48.png')}">
<link rel="apple-touch-icon" href="${img(d, 'logo/apple-touch-icon.png')}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@1,400;1,500&family=Jost:wght@300;400;500&display=swap">
<link rel="stylesheet" href="${A(d, 'css/style.css')}">
<script>document.documentElement.classList.add('js')</script>
${jsonld.map((j) => `<script type="application/ld+json">${JSON.stringify(j)}</script>`).join('\n')}
</head>
<body data-wa="${C.whatsapp}" data-page="${id}">
<a class="skip" href="#conteudo">Pular para o conteúdo</a>
${header(d, id, solido)}
<main id="conteudo">
${corpo}
</main>
${footer(d)}
<script src="${A(d, 'js/main.js')}" defer></script>
</body>
</html>
`;
}

/* ---------------- componentes ---------------- */
function cardModelo(m, d) {
  const l = linhaDe(m.linha);
  const base = `mesas/${m.slug}/`;
  const alt = m.jantarReal ? 'jantar' : (m.temPar && m.slug !== 'eleganza' ? 'bilhar' : null);
  const preco = C.mostrarPrecos && minPreco(m);
  const usos = m.foraDoCatalogo ? 'Bilhar · Jantar' : 'Bilhar · Jantar · Tênis de mesa';
  return `
<article class="mcard" data-linha="${m.linha}" data-nome="${esc(m.nome)}">
  <a class="mcard__img" href="${L(d, rotaModelo(m.slug))}" tabindex="-1" aria-hidden="true">
    <img src="${img(d, base + 'capa-sm.webp')}" alt="" loading="lazy" width="560" height="346">
    ${alt ? `<img class="alt" src="${img(d, base + alt + '-sm.webp')}" alt="" loading="lazy" width="560" height="420">` : ''}
    ${m.novo ? '<span class="mcard__badge">Novo</span>' : ''}
    ${m.jantarReal ? '<span class="mcard__hint">Versão jantar</span>' : ''}
  </a>
  <div class="mcard__row">
    <div>
      <h3 class="mcard__name"><a href="${L(d, rotaModelo(m.slug))}">${esc(m.nome)}</a></h3>
      <p class="mcard__line">${esc(l.titulo)}</p>
      <p class="mcard__meta">${usos}</p>
    </div>
    ${preco ? `<p class="mcard__price">a partir de<strong>${brl(preco)}</strong></p>` : `<span class="mcard__go" aria-hidden="true">${ic('arrow')}</span>`}
  </div>
</article>`;
}

function gameCard(g, d) {
  return `
<article class="game rv">
  <div class="game__img"><img src="${img(d, 'jogos/' + g.id + '-sm.webp')}" alt="${esc(g.detalhe)}" loading="lazy" width="480" height="360"></div>
  <h3>${esc(g.nome)}</h3>
  <p><span>${esc(g.medida)}</span>${C.mostrarPrecos && g.preco ? `<span>${brl(g.preco)}</span>` : ''}</p>
</article>`;
}

function incluso() {
  return `<ul class="incl">${D.acompanha.map((a) => `<li class="rv">${ic(a.icone)}<span>${esc(a.nome)}</span></li>`).join('')}</ul>`;
}

function ctaBand(d, { titulo = 'Vamos projetar a mesa <span class="it">do seu espaço?</span>', texto = 'Fale com o nosso time comercial e receba um atendimento personalizado — da escolha do modelo à cor do tecido.', foto = 'galeria/g14.webp', msg } = {}) {
  return `
<section class="cta">
  <div class="cta__bg"><img src="${img(d, foto)}" alt="" loading="lazy"></div>
  <div class="wrap">
    <div class="cta__in rv">
      <span class="eyebrow">Atendimento personalizado</span>
      <h2 class="h-lg">${titulo}</h2>
      <p class="lead">${texto}</p>
      <div class="cta__actions">
        <a class="btn btn--wa" href="${wa(msg)}" target="_blank" rel="noopener">${ic('whatsapp')} Falar no WhatsApp</a>
        <a class="btn btn--ghost" href="tel:${C.telefoneLink}">${ic('phone')} ${esc(C.telefone)}</a>
      </div>
    </div>
  </div>
</section>`;
}

const sw = (f, i, sel = 0) => `<button type="button" class="sw" role="radio" aria-checked="${i === sel}" tabindex="${i === sel ? 0 : -1}" data-value="${esc(f.nome)}" data-hex="${f.hex}" title="${esc(f.nome)}" aria-label="${esc(f.nome)}" style="background-image:url(__FELT__${f.id}.webp);background-color:${f.hex}"></button>`;
const feltroSwatches = (d, sel) => D.feltros.map((f, i) => sw(f, i, sel)).join('').replaceAll('__FELT__', img(d, 'feltros/'));

/* ---------------- configurador (SVG mesa vista de cima) ---------------- */
const ACABAMENTOS = [
  { nome: 'Preto laca', hex: '#151515', madeira: false },
  { nome: 'Branco laca', hex: '#ece9e3', madeira: false },
  { nome: 'Grafite', hex: '#4b4947', madeira: false },
  { nome: 'Bege', hex: '#d3c4ab', madeira: false },
  { nome: 'Madeira clara', hex: '#b98a5a', madeira: true },
  { nome: 'Madeira escura', hex: '#5b3a26', madeira: true },
];
function mesaSVG() {
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const veios = Array.from({ length: 46 }, (_, i) => {
    const y = 4 + i * 10 + rnd() * 4; const a = rnd() * 6 - 3; const b = rnd() * 6 - 3;
    return `<path d="M0 ${y.toFixed(1)} C 200 ${(y + a).toFixed(1)}, 520 ${(y + b).toFixed(1)}, 800 ${(y + a / 2).toFixed(1)}" stroke-width="${(0.6 + rnd() * 1.4).toFixed(2)}"/>`;
  }).join('');
  const bolas = ['#f2c200', '#1d4fb8', '#c8102e', '#5b2a86', '#f26a1b', '#0b7a3b', '#7a1e1e', '#111111', '#f2c200', '#1d4fb8', '#c8102e', '#5b2a86', '#f26a1b', '#0b7a3b', '#7a1e1e'];
  const ordem = [0, 9, 1, 10, 7, 2, 11, 3, 12, 4, 13, 5, 14, 6, 8];
  let k = 0; let balls = '';
  for (let row = 0; row < 5; row++) {
    for (let j = 0; j <= row; j++) {
      const cx = 548 + row * 17.6; const cy = 230 - row * 10.2 + j * 20.4; const n = ordem[k++];
      const listra = n >= 8 && n !== 7;
      balls += `<g><circle cx="${cx.toFixed(1)}" cy="${(cy + 2).toFixed(1)}" r="10" fill="#000" opacity=".35"/><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="10" fill="${listra ? '#f4f1ea' : bolas[n]}"/>${listra ? `<rect x="${(cx - 10).toFixed(1)}" y="${(cy - 5).toFixed(1)}" width="20" height="10" fill="${bolas[n]}" clip-path="url(#bc${k})"/><clipPath id="bc${k}"><circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="10"/></clipPath>` : ''}<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="10" fill="url(#ballHi)"/></g>`;
    }
  }
  const dia = [];
  [1, 2, 3, 5, 6, 7].forEach((i) => { const x = 60 + (680 * i) / 8; dia.push([x, 22], [x, 438]); });
  [1, 2, 3].forEach((i) => { const y = 60 + (340 * i) / 4; dia.push([22, y], [778, y]); });
  const pockets = [[52, 52], [400, 46], [748, 52], [52, 408], [400, 414], [748, 408]];
  return `
<svg viewBox="0 0 800 460" role="img" aria-label="Simulação da mesa vista de cima com as cores escolhidas">
  <defs>
    <radialGradient id="luz" cx="50%" cy="48%" r="62%"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>
    <linearGradient id="brilho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
    <radialGradient id="ballHi" cx="35%" cy="32%" r="70%"><stop offset="0" stop-color="#fff" stop-opacity=".75"/><stop offset=".25" stop-color="#fff" stop-opacity=".12"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></radialGradient>
    <radialGradient id="pocket" cx="50%" cy="50%" r="50%"><stop offset=".55" stop-color="#050505"/><stop offset="1" stop-color="#1c1c1c"/></radialGradient>
    <filter id="grao" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" seed="4"/><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .32 0"/></filter>
    <clipPath id="aro"><path fill-rule="evenodd" d="M22 0h756a22 22 0 0 1 22 22v416a22 22 0 0 1-22 22H22A22 22 0 0 1 0 438V22A22 22 0 0 1 22 0zM44 44v372h712V44z"/></clipPath>
  </defs>
  <rect class="cfg__frame" width="800" height="460" rx="22" fill="#151515"/>
  <g class="cfg__wood" clip-path="url(#aro)" stroke="#000" fill="none" opacity="0">${veios}</g>
  <rect width="800" height="460" rx="22" fill="url(#brilho)"/>
  <rect class="cfg__cushion" x="40" y="40" width="720" height="380" rx="5" fill="#0a6b3f"/>
  <rect class="cfg__felt" x="58" y="58" width="684" height="344" fill="#0e8852"/>
  <rect x="58" y="58" width="684" height="344" filter="url(#grao)"/>
  <rect x="40" y="40" width="720" height="380" rx="5" fill="url(#luz)"/>
  <path d="M230 58V402" stroke="#fff" stroke-opacity=".16" stroke-width="1.5"/>
  <circle cx="230" cy="230" r="2.6" fill="#fff" fill-opacity=".45"/>
  <circle cx="548" cy="230" r="2.6" fill="#fff" fill-opacity=".45"/>
  ${pockets.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="21" fill="url(#pocket)"/>`).join('')}
  <g class="cfg__dia" fill="#d9c08a">${dia.map(([x, y]) => `<path d="M${x} ${y - 4}l4 4-4 4-4-4z"/>`).join('')}</g>
  ${balls}
  <g><circle cx="230" cy="232" r="10" fill="#000" opacity=".35"/><circle cx="230" cy="230" r="10" fill="#f7f5ef"/><circle cx="230" cy="230" r="10" fill="url(#ballHi)"/></g>
  <g opacity=".95"><path d="M24 352 L214 236" stroke="#000" stroke-opacity=".35" stroke-width="9" stroke-linecap="round" transform="translate(3 5)"/><path d="M24 352 L120 293" stroke="#2a1a10" stroke-width="9" stroke-linecap="round"/><path d="M120 293 L212 237" stroke="#d9b98a" stroke-width="6" stroke-linecap="round"/><path d="M212 237 L216 234.5" stroke="#3a6ea5" stroke-width="5" stroke-linecap="round"/></g>
</svg>`;
}

/* ---------------- JSON-LD ---------------- */
const ldNegocio = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: C.nome,
  url: C.siteUrl,
  image: C.siteUrl + '/assets/img/og/seletto-prime.jpg',
  logo: C.siteUrl + '/assets/img/logo/icon-512.png',
  telephone: C.telefoneLink,
  address: { '@type': 'PostalAddress', streetAddress: C.endereco, addressLocality: C.cidade, addressRegion: C.uf, addressCountry: 'BR' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
  ],
  sameAs: [C.instagram, C.facebook],
  areaServed: 'BR',
};

/* =====================================================================
   PÁGINAS
   ===================================================================== */

/* ---------------- HOME ---------------- */
function home() {
  const d = 0;
  const heroes = [1, 2, 3, 4];
  const ordem = ['standard', 'plus', 'master'].flatMap((l) => modelosDa(l));
  const jogosHome = ['tenis-de-mesa', 'pebolim-zeus', 'poker', 'aero-hockey', 'sextavada-cartas', 'redonda-cartas'].map((id) => D.jogos.find((g) => g.id === id));
  // galeria "bento": [foto, formato]
  const galHome = [['g04', 'b-big'], ['g03', 'b-tall'], ['g02', ''], ['g05', ''], ['g10', 'b-wide'], ['g13', ''], ['g16', '']];

  const corpo = `
<section class="hero" aria-label="Destaque">
  <div class="hero__media" aria-hidden="true">
    ${heroes.map((n, i) => `<div class="hero__slide${i === 0 ? ' is-on' : ''}"><img src="${img(d, `hero/h${n}.webp`)}" alt="" ${i === 0 ? 'fetchpriority="high"' : 'loading="lazy"'} width="1050" height="1400"></div>`).join('')}
  </div>
  <div class="wrap hero__body">
    <div class="hero__text">
      <span class="eyebrow">Somos exclusivos</span>
      <h1 class="h-xl">Mesas<br>de jogos <span class="it">exclusivas</span></h1>
      <p class="lead">Criamos mesas de bilhar com design único e sofisticado, que se transformam em mesa de jantar e de tênis de mesa. Do conceito à instalação, trabalhamos ao seu lado para que cada peça reflita o seu estilo.</p>
      <div class="hero__ctas">
        <a class="btn btn--gold" href="${L(d, ROTAS.catalogo)}">Explorar catálogo ${ic('arrow')}</a>
        <a class="btn btn--ghost" href="${wa('Olá! Vim do site e quero um atendimento personalizado para escolher minha mesa.')}" target="_blank" rel="noopener">${ic('whatsapp')} Atendimento personalizado</a>
      </div>
      <div class="hero__ctrl"><div class="hero__dots" role="tablist" aria-label="Fotos em destaque">${heroes.map((_, i) => `<button type="button" role="tab" aria-label="Foto ${i + 1}" aria-selected="${i === 0}"${i === 0 ? ' class="is-on"' : ''}></button>`).join('')}</div></div>
    </div>
  </div>
  <div class="hero__facts">
    <div class="wrap"><ul>
      <li>${ic('layers')}<span><strong>3 em 1</strong>Bilhar, jantar e tênis de mesa</span></li>
      <li>${ic('ruler')}<span><strong>Até 4 tamanhos</strong>De 1,80 m a 2,70 m</span></li>
      <li>${ic('palette')}<span><strong>${D.feltros.length} cores de feltro</strong>Em tecido acrílico ou lã</span></li>
      <li>${ic('truck')}<span><strong>Todo o Brasil</strong>Enviamos para todo o país</span></li>
    </ul></div>
  </div>
</section>

<section class="sec">
  <div class="wrap intro">
    <div><span class="eyebrow rv">Seletto Prime</span></div>
    <div>
      <p class="intro__quote rv">Acreditamos que cada mesa deve refletir o estilo e a paixão de quem a utiliza. Por isso, trabalhamos de perto com você em todas as etapas — e suas ideias se tornam realidade <span class="it">com estética, funcionalidade e qualidade.</span></p>
      <div class="intro__grid mt-m">
        <div class="pillar rv">${ic('pencil')}<h3>Design autoral</h3><p>Peças com desenho próprio, criadas para serem protagonistas em qualquer ambiente.</p></div>
        <div class="pillar rv rv-d1">${ic('gem')}<h3>Acabamento premium</h3><p>Laca, madeira e ferro com acabamento refinado — e o tampo no mesmo padrão da mesa.</p></div>
        <div class="pillar rv rv-d2">${ic('heart')}<h3>Atendimento próximo</h3><p>Acompanhamos cada etapa com você, do conceito à instalação.</p></div>
      </div>
    </div>
  </div>
</section>

<section class="sec dark" id="tres-em-um">
  <div class="wrap trio">
    <div class="rv">
      <div class="compare" style="--pos:50%">
        <img src="${img(d, 'mesas/coliseu/jantar.webp')}" alt="Mesa Coliseu na versão mesa de jantar" loading="lazy" width="777" height="518">
        <img class="compare__top" src="${img(d, 'mesas/coliseu/bilhar.webp')}" alt="Mesa Coliseu na versão bilhar" loading="lazy" width="777" height="518">
        <span class="compare__bar"></span>
        <span class="compare__knob">${ic('swap')}</span>
        <span class="compare__tag compare__tag--l">Bilhar</span>
        <span class="compare__tag compare__tag--r">Jantar</span>
        <input type="range" min="0" max="100" value="50" aria-label="Arraste para comparar a versão bilhar e a versão jantar">
      </div>
      <p class="compare-cap"><span>Modelo Coliseu · Linha Master</span><span>← Arraste para transformar →</span></p>
    </div>
    <div>
      <span class="eyebrow rv">3 em 1</span>
      <h2 class="h-lg mt-s rv">Uma mesa.<br><span class="it">Três</span> experiências.</h2>
      <p class="lead mt-s rv">Com o tampo multiuso — feito no mesmo material e acabamento da mesa — o bilhar vira mesa de jantar em instantes e recebe também o jogo de tênis de mesa.</p>
      <div class="modes">
        <div class="mode rv"><span class="mode__n">01</span><div><h3>Bilhar</h3><p>Feltro em tecido acrílico ou lã, em ${D.feltros.length} cores, com tacos, bolas, triângulo e giz.</p></div></div>
        <div class="mode rv"><span class="mode__n">02</span><div><h3>Jantar</h3><p>Tampo para refeição com suporte próprio, para receber com elegância.</p></div></div>
        <div class="mode rv"><span class="mode__n">03</span><div><h3>Tênis de mesa</h3><p>Marcação em fita ou pintura de pingue-pongue no tampo.</p></div></div>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head sec-head--split">
      <div><span class="eyebrow rv">Coleção 2026</span><h2 class="h-lg mt-s rv">Três linhas, <span class="it">um só</span> padrão de excelência</h2></div>
      <p class="lead rv">Do design de linhas retas às formas esculturais, cada linha traduz uma personalidade — todas com o mesmo cuidado no acabamento e no atendimento.</p>
    </div>
    <div class="lines">
      ${D.linhas.map((l, i) => `
      <a class="line-card rv${i ? ' rv-d' + i : ''}" href="${L(d, ROTAS.catalogo, '#' + l.id)}">
        <img src="${img(d, `mesas/${l.capa}/capa.webp`)}" alt="" loading="lazy" width="1004" height="620">
        <div class="line-card__body">
          <span class="line-card__k">linha</span>
          <h3>${esc(l.nome)}</h3>
          <p>${esc(l.resumo)}</p>
          <span class="line-card__meta"><span>${modelosDa(l.id).length} modelos${C.mostrarPrecos && modelosDa(l.id).some(minPreco) ? ` · a partir de ${brl(Math.min(...modelosDa(l.id).map(minPreco).filter(Boolean)))}` : ''}</span>${ic('arrow')}</span>
        </div>
      </a>`).join('')}
    </div>
  </div>
</section>

<section class="sec white" aria-labelledby="t-modelos">
  <div class="wrap">
    <div class="rail-head">
      <div><span class="eyebrow rv">Modelos</span><h2 class="h-lg mt-s rv" id="t-modelos">Escolha a sua <span class="it">protagonista</span></h2></div>
      <div class="rail-nav" data-rail-nav="modelos">
        <button type="button" data-dir="-1" aria-label="Modelos anteriores">${ic('arrowL')}</button>
        <button type="button" data-dir="1" aria-label="Próximos modelos">${ic('arrow')}</button>
      </div>
    </div>
    <div class="rail" data-rail="modelos" tabindex="0" aria-label="Lista de modelos">
      ${ordem.map((m) => cardModelo(m, d)).join('')}
    </div>
    <div class="rail-progress" data-rail-progress="modelos"><span></span></div>
    <div class="mt-m"><a class="link-arrow" href="${L(d, ROTAS.catalogo)}">Ver catálogo completo ${ic('arrow')}</a></div>
  </div>
</section>

<section class="sec dark" id="personalize">
  <div class="wrap cfg" id="cfg">
    <div class="rv">
      <div class="cfg__stage">${mesaSVG()}<span class="cfg__note">Simulação ilustrativa</span></div>
    </div>
    <div>
      <span class="eyebrow rv">Personalize</span>
      <h2 class="h-lg mt-s rv">A cor certa <span class="it">para o seu</span> ambiente</h2>
      <p class="lead mt-s rv">A elegância mora nos detalhes que você escolhe. Combine a cor do tecido e o acabamento para harmonizar com a sua decoração — e envie a sua combinação para o nosso time.</p>
      <div class="mt-m">
        <div class="opt">
          <div class="opt__label" id="lbl-feltro">Cor do feltro <output data-out="feltro">Verde</output></div>
          <div class="swatches" role="radiogroup" aria-labelledby="lbl-feltro" data-opt="feltro">${feltroSwatches(d, 13)}</div>
        </div>
        <div class="opt">
          <div class="opt__label" id="lbl-acab">Acabamento <output data-out="acabamento">Madeira clara</output></div>
          <div class="swatches frames" role="radiogroup" aria-labelledby="lbl-acab" data-opt="acabamento">${ACABAMENTOS.map((a, i) => `<button type="button" class="sw" role="radio" aria-checked="${i === 4}" tabindex="${i === 4 ? 0 : -1}" data-value="${a.nome}" data-hex="${a.hex}" data-madeira="${a.madeira ? 1 : 0}" title="${a.nome}" aria-label="${a.nome}" style="background:${a.madeira ? `repeating-linear-gradient(100deg, ${a.hex} 0 5px, rgba(0,0,0,.18) 5px 6px, ${a.hex} 6px 11px)` : a.hex}"></button>`).join('')}</div>
        </div>
        <div class="opt">
          <div class="opt__label" id="lbl-tec">Tecido do jogo</div>
          <div class="chips" role="radiogroup" aria-labelledby="lbl-tec" data-opt="tecido">${D.tecidos.map((t, i) => `<button type="button" class="chip" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-value="${t}">${t}</button>`).join('')}</div>
        </div>
        <a class="btn btn--gold mt-s" data-wa-cfg href="${wa()}" target="_blank" rel="noopener">${ic('whatsapp')} Enviar minha combinação</a>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head sec-head--split">
      <div><span class="eyebrow rv">Como trabalhamos</span><h2 class="h-lg mt-s rv">Do conceito <span class="it">à instalação</span></h2></div>
      <p class="lead rv">Trabalhamos de perto com nossos clientes em todas as etapas. Assim, suas ideias se tornam realidade de forma colaborativa.</p>
    </div>
    <ol class="steps">
      <li class="step rv"><h3>Conversa</h3><p>Entendemos o seu espaço, o seu estilo e como a mesa vai ser usada no dia a dia.</p></li>
      <li class="step rv rv-d1"><h3>Projeto</h3><p>Definimos juntos o modelo, o tamanho, o acabamento e a cor do tecido.</p></li>
      <li class="step rv rv-d2"><h3>Fabricação</h3><p>Sua mesa é produzida com acabamento premium e atenção a cada detalhe.</p></li>
      <li class="step rv rv-d3"><h3>Entrega</h3><p>Enviamos para todo o Brasil e entregamos a mesa pronta para o primeiro jogo.</p></li>
    </ol>
  </div>
</section>

<section class="sec sec--tight white">
  <div class="wrap">
    <div class="sec-head sec-head--center">
      <span class="eyebrow rv">Acompanha sua mesa</span>
      <h2 class="h-md rv">Tudo pronto para <span class="it">o primeiro jogo</span></h2>
    </div>
    ${incluso()}
  </div>
</section>

<section class="sec dark-2">
  <div class="wrap">
    <div class="sec-head sec-head--split">
      <div><span class="eyebrow rv">Outras opções de jogos</span><h2 class="h-lg mt-s rv">Pebolim, poker, cartas <span class="it">e muito mais</span></h2></div>
      <p class="lead rv">Várias opções de jogos para você aplicar no seu ambiente. Personalizamos com o modelo de base que desejar.</p>
    </div>
    <div class="games">${jogosHome.map((g) => gameCard(g, d)).join('')}</div>
    <div class="mt-m"><a class="link-arrow" href="${L(d, ROTAS.catalogo, '#jogos')}">Ver todas as opções ${ic('arrow')}</a></div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head sec-head--split">
      <div><span class="eyebrow rv">Galeria</span><h2 class="h-lg mt-s rv">Mesas Seletto <span class="it">em casa</span></h2></div>
      <p class="lead rv">Projetos entregues em ambientes reais. Toque nas fotos para ampliar.</p>
    </div>
    <div class="bento">
      ${galHome.map(([id, cls], i) => `<a class="rv${cls ? ' ' + cls : ''}${i % 3 ? ' rv-d' + (i % 3) : ''}" href="${img(d, `galeria/${id}.webp`)}" data-lb="home"><img src="${img(d, `galeria/${id}${cls === 'b-big' || cls === 'b-wide' ? '' : '-sm'}.webp`)}" alt="Mesa de bilhar Seletto Prime instalada em ambiente residencial" loading="lazy"><span class="zoom">${ic('expand')}</span></a>`).join('')}
    </div>
    <div class="mt-m center"><a class="btn btn--line" href="${L(d, ROTAS.galeria)}">Ver galeria completa ${ic('arrow')}</a></div>
  </div>
</section>
${ctaBand(d)}`;

  write('index.html', layout({
    d, id: 'home', rota: '',
    titulo: 'Seletto Prime — Mesas de bilhar de alto padrão | Bilhar, jantar e tênis de mesa',
    descricao: 'Mesas de bilhar com design exclusivo que se transformam em mesa de jantar e tênis de mesa. Linhas Standard, Plus e Master. Fabricação em Canoas/RS com envio para todo o Brasil.',
    corpo, jsonld: [ldNegocio],
  }));
}

/* ---------------- CATÁLOGO ---------------- */
function catalogo() {
  const d = 1;
  const total = D.modelos.length;
  const corpo = `
<section class="phero">
  <div class="phero__bg"><img src="${img(d, 'catalogo-capa.webp')}" alt="" width="1200" height="849"></div>
  <div class="wrap phero__in">
    <ol class="crumbs"><li><a href="${L(d, ROTAS.home)}">Início</a></li><li>Catálogo</li></ol>
    <span class="eyebrow">Catálogo 2026</span>
    <h1 class="h-xl">Mesas de <span class="it">bilhar</span></h1>
    <p class="lead">${total} modelos em três linhas — todos com tampo para refeição, até quatro tamanhos e ${D.feltros.length} cores de feltro em tecido acrílico ou lã.</p>
  </div>
</section>

<div class="cat-bar">
  <div class="wrap cat-bar__in">
    <div class="tabs" role="group" aria-label="Filtrar por linha">
      <button type="button" class="tab" data-filter="todas" aria-pressed="true">Todas <span>${total}</span></button>
      ${D.linhas.map((l) => `<button type="button" class="tab" data-filter="${l.id}" aria-pressed="false">${esc(l.nome)} <span>${modelosDa(l.id).length}</span></button>`).join('')}
    </div>
    <label class="search">${ic('search')}<span class="sr-only">Buscar modelo</span><input type="search" placeholder="Buscar modelo" data-search autocomplete="off"></label>
  </div>
</div>

<div class="wrap" style="padding-bottom:var(--sec)">
  ${D.linhas.map((l) => `
  <section class="cat-group" id="${l.id}" data-group="${l.id}" aria-labelledby="t-${l.id}">
    <div class="cat-group__head">
      <h2 id="t-${l.id}"><span class="it">linha</span>${esc(l.nome)}</h2>
      <p class="lead">${esc(l.resumo)}</p>
    </div>
    <div class="grid-m">${modelosDa(l.id).map((m) => cardModelo(m, d)).join('')}</div>
  </section>`).join('')}
  <p class="empty" data-empty hidden>Nenhum modelo encontrado. <a class="link-arrow" href="${wa('Olá! Vim do site e procuro um modelo de mesa específico.')}" target="_blank" rel="noopener">Fale com a gente</a></p>
</div>

<section class="sec dark-2" id="jogos">
  <div class="wrap">
    <div class="sec-head sec-head--split">
      <div><span class="eyebrow">Outras opções de jogos</span><h2 class="h-lg mt-s">Mais formas de <span class="it">jogar</span></h2></div>
      <p class="lead">Várias opções de jogos disponíveis para você aplicar no seu ambiente. Personalizamos com o modelo de base que desejar.</p>
    </div>
    <div class="games">${D.jogos.map((g) => gameCard(g, d)).join('')}</div>
  </div>
</section>

<section class="sec" id="acessorios">
  <div class="wrap acc">
    <div class="acc__imgs rv">
      <img src="${img(d, 'acessorios/taqueira-painel-sm.webp')}" alt="Taqueira painel iluminada com tacos e bolas" loading="lazy" width="480" height="720">
      <img src="${img(d, 'acessorios/bancos-sm.webp')}" alt="Mesa de bilhar preta com bancos" loading="lazy" width="412" height="549">
    </div>
    <div>
      <span class="eyebrow">Acessórios</span>
      <h2 class="h-lg mt-s">Monte o seu <span class="it">ambiente</span></h2>
      <p class="lead mt-s">Complete o espaço da maneira que desejar, com o seu estilo e um design original.</p>
      <ul class="acc-list mt-m">${D.acessorios.map((a) => `<li><span>${esc(a.nome)}</span>${C.mostrarPrecos && a.preco ? `<span>${brl(a.preco)}</span>` : ''}</li>`).join('')}</ul>
      <a class="btn btn--ink mt-m" href="${wa('Olá! Vim do site e gostaria de saber mais sobre os acessórios.')}" target="_blank" rel="noopener">${ic('whatsapp')} Consultar acessórios</a>
    </div>
  </div>
</section>
${ctaBand(d, { titulo: 'Não encontrou <span class="it">o que procura?</span>', texto: 'Desenvolvemos a mesa ideal para o seu espaço. Conte para o nosso time o que você imagina.', foto: 'galeria/g07.webp' })}`;

  write('catalogo/index.html', layout({
    d, id: 'catalogo', rota: ROTAS.catalogo, solido: true,
    titulo: 'Catálogo de mesas de bilhar 2026 | Seletto Prime',
    descricao: `Conheça os ${total} modelos de mesas de bilhar Seletto Prime nas linhas Standard, Plus e Master — todos com versão jantar. Também pebolim, poker, cartas e acessórios.`,
    corpo,
    jsonld: [{
      '@context': 'https://schema.org', '@type': 'ItemList', name: 'Catálogo Seletto Prime',
      itemListElement: D.modelos.map((m, i) => ({ '@type': 'ListItem', position: i + 1, url: C.siteUrl + '/' + rotaModelo(m.slug), name: 'Mesa de bilhar ' + m.nome })),
    }],
  }));
}

/* ---------------- MODELO ---------------- */
function espaco(medida) {
  const [c, l] = medida.replace(' m', '').split(' x ').map((v) => parseFloat(v.replace(',', '.')));
  const f = (n) => n.toFixed(2).replace('.', ',');
  return `${f(c + 2.9)} x ${f(l + 2.9)} m`;
}
function modelo(m) {
  const d = 1;
  const l = linhaDe(m.linha);
  const base = `mesas/${m.slug}/`;
  const fotos = [{ k: 'capa', label: 'Destaque', w: 1004, h: 620 }];
  if (m.temPar && m.slug !== 'eleganza') fotos.push({ k: 'bilhar', label: 'Versão bilhar' });
  if (m.temPar) fotos.push({ k: 'jantar', label: m.jantarReal ? 'Versão jantar' : 'Detalhe' });
  const outros = D.modelos.filter((x) => x.linha === m.linha && x.slug !== m.slug);
  const usos = m.foraDoCatalogo ? ['bilhar', 'jantar'] : ['bilhar', 'jantar', 'pingpong'];
  const usoNome = { bilhar: 'Bilhar', jantar: 'Jantar', pingpong: 'Tênis de mesa' };
  const precoMin = C.mostrarPrecos && minPreco(m);
  const msgBase = `Olá! Vim do site e gostaria de um orçamento da Mesa ${m.nome} (${l.titulo}).`;
  const tagline = primeiraFrase(m);

  const corpo = `
<section class="pdp" data-pdp data-modelo="${esc(m.nome)}" data-linha="${esc(l.titulo)}">
  <div class="wrap">
    <ol class="crumbs crumbs--light"><li><a href="${L(d, ROTAS.home)}">Início</a></li><li><a href="${L(d, ROTAS.catalogo)}">Catálogo</a></li><li><a href="${L(d, ROTAS.catalogo, '#' + l.id)}">${esc(l.titulo)}</a></li><li aria-current="page">${esc(m.nome)}</li></ol>
    <div class="pdp__grid">
      <div class="gal">
        <div class="gal__main" data-gal-main>
          <img src="${img(d, base + fotos[0].k + '.webp')}" alt="Mesa de bilhar ${esc(m.nome)} — ${fotos[0].label.toLowerCase()}" width="1004" height="620" fetchpriority="high">
          ${m.jantarReal ? `<div class="gal__toggle" role="group" aria-label="Ver versão">
            <button type="button" aria-pressed="true" data-mode="bilhar">${ic('bilhar')} Bilhar</button>
            <button type="button" aria-pressed="false" data-mode="jantar">${ic('jantar')} Jantar</button>
          </div>` : ''}
          <button type="button" class="gal__expand" aria-label="Ampliar foto" data-gal-expand>${ic('expand')}</button>
        </div>
        ${fotos.length > 1 ? `<div class="gal__thumbs">${fotos.map((f, i) => `<button type="button" data-src="${img(d, base + f.k + '.webp')}" data-k="${f.k}" data-alt="Mesa de bilhar ${esc(m.nome)} — ${f.label.toLowerCase()}"${i === 0 ? ' aria-current="true"' : ''} aria-label="${f.label}"><img src="${img(d, base + f.k + '-sm.webp')}" alt="" loading="lazy" width="560" height="420"></button>`).join('')}</div>` : ''}
        ${fotos.map((f) => `<a href="${img(d, base + f.k + '.webp')}" data-lb="modelo" hidden aria-hidden="true" tabindex="-1"></a>`).join('')}
      </div>

      <div class="pdp__info">
        <p class="pdp__line">${esc(l.titulo)}${m.novo ? ' · <span class="pill">Novo</span>' : ''}</p>
        <h1 class="pdp__name"><small>Mesa de bilhar</small>${esc(m.nome)}</h1>
        <p class="pdp__tag">${esc(tagline)}</p>
        <ul class="uses">${usos.map((u) => `<li>${ic(u)} ${usoNome[u]}</li>`).join('')}</ul>
        ${precoMin ? `<p class="pdp__price mt-s"><span data-price-label>a partir de</span> <strong data-price>${brl(precoMin)}</strong></p>` : ''}

        <div class="mt-s">
          <div class="opt">
            <div class="opt__label" id="lbl-tam">Tamanho <output data-out="tamanho">${esc(m.tamanhos[0].medida)}</output></div>
            <div class="chips" role="radiogroup" aria-labelledby="lbl-tam" data-opt="tamanho">${m.tamanhos.map((t, i) => `<button type="button" class="chip" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-value="${esc(t.medida)}"${C.mostrarPrecos && t.preco ? ` data-preco="${brl(t.preco)}"` : ''}>${esc(t.medida.replace(' m', ''))}${C.mostrarPrecos && t.preco ? `<small>${brl(t.preco)}</small>` : ''}</button>`).join('')}</div>
          </div>
          <div class="opt">
            <div class="opt__label" id="lbl-fel">Cor do feltro <output data-out="feltro">A definir</output></div>
            <div class="swatches" role="radiogroup" aria-labelledby="lbl-fel" data-opt="feltro" data-optional>${feltroSwatches(d, -1).replace('tabindex="-1"', 'tabindex="0"')}</div>
          </div>
          <div class="opt">
            <div class="opt__label" id="lbl-tc">Tecido do jogo</div>
            <div class="chips" role="radiogroup" aria-labelledby="lbl-tc" data-opt="tecido">${D.tecidos.map((t, i) => `<button type="button" class="chip" role="radio" aria-checked="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-value="${t}">${t}</button>`).join('')}</div>
          </div>
        </div>

        <div class="pdp__ctas">
          <a class="btn btn--wa btn--block" data-wa-pdp href="${wa(msgBase)}" target="_blank" rel="noopener">${ic('whatsapp')} Solicitar orçamento</a>
          <a class="btn btn--line btn--block" href="tel:${C.telefoneLink}">${ic('phone')} Ligar ${esc(C.telefone)}</a>
        </div>
        <ul class="pdp__assure">
          <li>${ic('truck')} Enviamos para todo o Brasil</li>
          <li>${ic('chat')} Atendimento personalizado do conceito à instalação</li>
          <li>${ic('shield')} Fabricação própria com acabamento premium</li>
        </ul>
      </div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap feat">
    <div class="feat__text rv">
      <span class="eyebrow">Sobre o modelo</span>
      <h2 class="h-md">O design <span class="it">em detalhes</span></h2>
      ${m.descricao.slice(1).map((p) => `<p>${esc(p)}</p>`).join('\n      ')}
    </div>
    <div class="rv rv-d1">
      <table class="specs">
        <caption>Ficha técnica</caption>
        <tbody>
          <tr><th scope="row">Linha</th><td>${esc(l.titulo)}</td></tr>
          <tr><th scope="row">Funções</th><td>${usos.map((u) => usoNome[u]).join(' · ')}</td></tr>
          <tr><th scope="row">Tampo</th><td>Multiuso, no mesmo material e acabamento da mesa</td></tr>
          <tr><th scope="row">Tecido do jogo</th><td>Acrílico ou lã — ${D.feltros.length} cores</td></tr>
          <tr><th scope="row">Entrega</th><td>Para todo o Brasil</td></tr>
        </tbody>
      </table>
      <table class="specs mt-m">
        <caption>Medidas</caption>
        <thead class="sr-only"><tr><th>Tamanho da mesa</th><th>Espaço ideal</th>${C.mostrarPrecos ? '<th>Preço</th>' : ''}</tr></thead>
        <tbody>
          ${m.tamanhos.map((t) => `<tr><th scope="row">${esc(t.medida)}</th><td>Espaço ideal ≈ ${espaco(t.medida)}</td>${C.mostrarPrecos ? `<td class="num">${t.preco ? brl(t.preco) : 'Sob consulta'}</td>` : ''}</tr>`).join('')}
        </tbody>
      </table>
      <p class="pdp__note mt-s">Espaço ideal calculado para jogar com tacos de 1,45 m em todos os lados. Para ambientes menores, consulte nosso time sobre tacos mais curtos.</p>
    </div>
  </div>
</section>

${m.jantarReal ? `
<section class="sec white">
  <div class="wrap">
    <div class="sec-head sec-head--split">
      <div><span class="eyebrow rv">3 em 1</span><h2 class="h-lg mt-s rv">Uma mesa, <span class="it">duas</span> versões</h2></div>
      <p class="lead rv">Com o tampo multiuso, a ${esc(m.nome)} passa de mesa de bilhar a mesa de jantar em instantes — sem perder o padrão do design.</p>
    </div>
    <div class="pairs">
      <figure class="rv"><img src="${img(d, base + 'bilhar.webp')}" alt="Mesa ${esc(m.nome)} na versão bilhar" loading="lazy"><figcaption>Versão bilhar</figcaption></figure>
      <figure class="rv rv-d1"><img src="${img(d, base + 'jantar.webp')}" alt="Mesa ${esc(m.nome)} na versão jantar" loading="lazy"><figcaption>Versão jantar</figcaption></figure>
    </div>
  </div>
</section>` : ''}

<section class="sec sec--tight dark">
  <div class="wrap">
    <div class="tiles">
      <div class="tile rv">${ic('tampo')}<h3>Tampo multiuso</h3><p>Feito com o mesmo material e acabamento da mesa, para um padrão de design impecável.</p></div>
      <div class="tile rv rv-d1">${ic('palette')}<h3>Personalize o tecido</h3><p>Escolha entre ${D.feltros.length} cores, em tecido acrílico ou lã, para harmonizar com a sua decoração.</p></div>
      <div class="tile rv rv-d2">${ic('truck')}<h3>Receba em casa</h3><p>Enviamos para todo o Brasil, com acompanhamento do nosso time em cada etapa.</p></div>
    </div>
  </div>
</section>

<section class="sec sec--tight">
  <div class="wrap">
    <div class="sec-head sec-head--center">
      <span class="eyebrow rv">Acompanhamento</span>
      <h2 class="h-md rv">Sua ${esc(m.nome)} chega <span class="it">completa</span></h2>
    </div>
    ${incluso()}
  </div>
</section>

<section class="sec white" aria-labelledby="t-outros">
  <div class="wrap">
    <div class="rail-head">
      <div><span class="eyebrow">${esc(l.titulo)}</span><h2 class="h-md mt-s" id="t-outros">Outros modelos <span class="it">da linha</span></h2></div>
      <div class="rail-nav" data-rail-nav="rel">
        <button type="button" data-dir="-1" aria-label="Anteriores">${ic('arrowL')}</button>
        <button type="button" data-dir="1" aria-label="Próximos">${ic('arrow')}</button>
      </div>
    </div>
    <div class="rail" data-rail="rel" tabindex="0" aria-label="Outros modelos">${outros.map((x) => cardModelo(x, d)).join('')}</div>
    <div class="rail-progress" data-rail-progress="rel"><span></span></div>
  </div>
</section>
${ctaBand(d, { titulo: `Gostou da <span class="it">${esc(m.nome)}?</span>`, texto: 'Receba um orçamento personalizado com o tamanho, o acabamento e a cor de tecido ideais para o seu espaço.', foto: base + 'capa.webp', msg: msgBase })}`;

  const ofertas = C.mostrarPrecos ? m.tamanhos.filter((t) => t.preco) : [];
  write(`${rotaModelo(m.slug)}index.html`, layout({
    d, id: 'mesas', rota: rotaModelo(m.slug), solido: true,
    og: `og/${m.slug}.jpg`,
    titulo: `Mesa de Bilhar ${m.nome} — ${l.titulo} | Seletto Prime`,
    descricao: `${tagline} Versão bilhar e jantar${m.foraDoCatalogo ? '' : ' e tênis de mesa'}, tamanhos de ${m.tamanhos[0].medida.replace(' m', '')} a ${m.tamanhos[m.tamanhos.length - 1].medida}. Seletto Prime, Canoas/RS.`,
    corpo,
    jsonld: [
      {
        '@context': 'https://schema.org', '@type': 'Product',
        name: `Mesa de Bilhar ${m.nome}`, brand: { '@type': 'Brand', name: C.nome },
        category: 'Mesa de bilhar', description: m.descricao.join(' '),
        image: fotos.map((f) => `${C.siteUrl}/assets/img/${base}${f.k}.webp`),
        ...(ofertas.length ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'BRL', lowPrice: Math.min(...ofertas.map((o) => o.preco)), highPrice: Math.max(...ofertas.map((o) => o.preco)), offerCount: ofertas.length } } : {}),
      },
      {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: C.siteUrl + '/' },
          { '@type': 'ListItem', position: 2, name: 'Catálogo', item: C.siteUrl + '/' + ROTAS.catalogo },
          { '@type': 'ListItem', position: 3, name: m.nome, item: C.siteUrl + '/' + rotaModelo(m.slug) },
        ],
      },
    ],
  }));
}

/* ---------------- GALERIA ---------------- */
function galeria() {
  const d = 1;
  const itens = D.galeria.map(([id, w, h]) => ({ src: `galeria/${id}.webp`, sm: `galeria/${id}-sm.webp`, w, h, alt: 'Mesa de bilhar Seletto Prime instalada em ambiente residencial' }));
  const pares = D.modelos.filter((m) => m.temPar).flatMap((m) => {
    const out = [];
    if (m.slug !== 'eleganza') out.push({ src: `mesas/${m.slug}/bilhar.webp`, sm: `mesas/${m.slug}/bilhar-sm.webp`, w: 4, h: 3, alt: `Mesa ${m.nome} na versão bilhar` });
    out.push({ src: `mesas/${m.slug}/jantar.webp`, sm: `mesas/${m.slug}/jantar-sm.webp`, w: 4, h: 3, alt: m.jantarReal ? `Mesa ${m.nome} na versão jantar` : `Mesa ${m.nome}` });
    return out;
  });
  // intercala fotos de projetos e fotos do catálogo
  const todas = [];
  for (let i = 0; i < Math.max(itens.length, pares.length); i++) { if (itens[i]) todas.push(itens[i]); if (pares[i * 2]) todas.push(pares[i * 2]); if (pares[i * 2 + 1]) todas.push(pares[i * 2 + 1]); }
  const corpo = `
<section class="phero">
  <div class="phero__bg"><img src="${img(d, 'galeria/g13.webp')}" alt="" width="1280" height="960"></div>
  <div class="wrap phero__in">
    <ol class="crumbs"><li><a href="${L(d, ROTAS.home)}">Início</a></li><li>Galeria</li></ol>
    <span class="eyebrow">Galeria de fotos</span>
    <h1 class="h-xl">Projetos <span class="it">que inspiram</span></h1>
    <p class="lead">Mesas Seletto em ambientes reais — nas versões bilhar e jantar. Toque nas fotos para ampliar.</p>
  </div>
</section>
<section class="sec">
  <div class="wrap">
    <div class="masonry">
      ${todas.map((f) => `<a class="rv" href="${img(d, f.src)}" data-lb="galeria"><img src="${img(d, f.sm)}" alt="${esc(f.alt)}" loading="lazy" width="${f.w}" height="${f.h}"><span class="zoom">${ic('expand')}</span></a>`).join('\n      ')}
    </div>
    <div class="mt-l center">
      <p class="lead" style="margin-inline:auto">Acompanhe novos projetos no nosso Instagram.</p>
      <div class="flex-c mt-s"><a class="btn btn--line" href="${C.instagram}" target="_blank" rel="noopener">${ic('instagram')} ${esc(C.instagramUsuario)}</a></div>
    </div>
  </div>
</section>
${ctaBand(d, { foto: 'galeria/g05.webp' })}`;
  write('galeria/index.html', layout({
    d, id: 'galeria', rota: ROTAS.galeria, solido: true,
    titulo: 'Galeria de mesas de bilhar | Seletto Prime',
    descricao: 'Fotos de mesas de bilhar Seletto Prime em ambientes reais, nas versões bilhar e jantar.',
    corpo,
  }));
}

/* ---------------- SOBRE ---------------- */
function sobre() {
  const d = 1;
  const corpo = `
<section class="phero">
  <div class="phero__bg"><img src="${img(d, 'galeria/g03.webp')}" alt="" width="1320" height="1447"></div>
  <div class="wrap phero__in">
    <ol class="crumbs"><li><a href="${L(d, ROTAS.home)}">Início</a></li><li>Sobre</li></ol>
    <span class="eyebrow">Sobre a Seletto Prime</span>
    <h1 class="h-xl">Design que <span class="it">transforma</span></h1>
    <p class="lead">Mais que uma mesa de bilhar: uma peça de alto padrão para ambientes exclusivos.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap split">
    <div class="split__media rv"><img src="${img(d, 'galeria/g01.webp')}" alt="Mesa de bilhar preta em sala com iluminação embutida" loading="lazy" width="1600" height="2133"></div>
    <div class="split__body">
      <span class="eyebrow rv">Quem somos</span>
      <h2 class="h-lg rv">Mesas de jogos <span class="it">com alma</span></h2>
      <p class="rv">A Seletto Prime cria mesas de bilhar com design único e sofisticado, projetadas para oferecer uma experiência de jogo incomparável.</p>
      <p class="rv">Acreditamos que cada mesa deve refletir o estilo e a paixão de quem a utiliza. Por isso, trabalhamos de perto com nossos clientes em todas as etapas, do conceito à instalação — e as suas ideias se tornam realidade de forma colaborativa, em uma mesa que combina estética, funcionalidade e qualidade.</p>
      <p class="rv">De ${esc(C.cidade)}, no Rio Grande do Sul, enviamos para todo o Brasil.</p>
      <div class="rv"><a class="link-arrow" href="${L(d, ROTAS.catalogo)}">Conheça o catálogo ${ic('arrow')}</a></div>
    </div>
  </div>
</section>

<section class="sec sec--tight paper-2">
  <div class="wrap">
    <div class="sec-head sec-head--center"><span class="eyebrow rv">No que acreditamos</span><h2 class="h-md rv">O que torna uma mesa <span class="it">Seletto</span></h2></div>
    <div class="vals">
      <div class="val rv">${ic('pencil')}<h3>Design exclusivo</h3><p>Peças autorais, com desenho próprio, criadas para serem protagonistas do ambiente.</p></div>
      <div class="val rv rv-d1">${ic('palette')}<h3>Personalização</h3><p>Tamanho, acabamento e cor do tecido escolhidos para harmonizar com a sua decoração.</p></div>
      <div class="val rv rv-d2">${ic('gem')}<h3>Acabamento premium</h3><p>Materiais nobres e cuidado em cada detalhe — inclusive no tampo multiuso.</p></div>
      <div class="val rv rv-d3">${ic('heart')}<h3>Atendimento próximo</h3><p>Um time comercial dedicado para acompanhar você do primeiro contato à entrega.</p></div>
    </div>
  </div>
</section>

<section class="sec dark">
  <div class="wrap split split--rev">
    <div class="split__media rv"><img src="${img(d, 'mesas/ravena/jantar.webp')}" alt="Mesa Ravena na versão jantar" loading="lazy" width="875" height="582" style="aspect-ratio:4/4.4"></div>
    <div class="split__body">
      <span class="eyebrow rv">3 em 1</span>
      <h2 class="h-lg rv">Uma peça que acompanha <span class="it">a rotina da casa</span></h2>
      <p class="rv">Nossas mesas são pensadas para viver o dia inteiro: bilhar para os momentos de lazer, mesa de jantar para receber e tênis de mesa para a família toda. O tampo multiuso é feito com o mesmo material e acabamento da mesa, para manter o padrão do design em qualquer versão.</p>
      <div class="rv"><a class="btn btn--gold" href="${L(d, ROTAS.home, '#tres-em-um')}">Ver a transformação ${ic('arrow')}</a></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head sec-head--split">
      <div><span class="eyebrow rv">Como trabalhamos</span><h2 class="h-lg mt-s rv">Do conceito <span class="it">à instalação</span></h2></div>
      <p class="lead rv">Cada projeto é acompanhado de perto pelo nosso time.</p>
    </div>
    <ol class="steps">
      <li class="step rv"><h3>Conversa</h3><p>Entendemos o seu espaço, o seu estilo e como a mesa vai ser usada no dia a dia.</p></li>
      <li class="step rv rv-d1"><h3>Projeto</h3><p>Definimos juntos o modelo, o tamanho, o acabamento e a cor do tecido.</p></li>
      <li class="step rv rv-d2"><h3>Fabricação</h3><p>Sua mesa é produzida com acabamento premium e atenção a cada detalhe.</p></li>
      <li class="step rv rv-d3"><h3>Entrega</h3><p>Enviamos para todo o Brasil e entregamos a mesa pronta para o primeiro jogo.</p></li>
    </ol>
    <div class="collage mt-l">
      <img class="a rv" src="${img(d, 'galeria/g06-sm.webp')}" alt="Mesa de bilhar com estrutura cinza em sala com adega" loading="lazy">
      <img class="b rv rv-d1" src="${img(d, 'galeria/g04-sm.webp')}" alt="Mesa de bilhar branca com feltro claro" loading="lazy">
      <img class="c rv rv-d2" src="${img(d, 'galeria/g10-sm.webp')}" alt="Mesa de bilhar com bancos de madeira na varanda" loading="lazy">
      <img class="d rv" src="${img(d, 'galeria/g16-sm.webp')}" alt="Mesa de bilhar com base em Z" loading="lazy">
    </div>
  </div>
</section>
${ctaBand(d, { foto: 'galeria/g12.webp' })}`;
  write('sobre/index.html', layout({
    d, id: 'sobre', rota: ROTAS.sobre, solido: true,
    titulo: 'Sobre a Seletto Prime | Mesas de jogos com design exclusivo',
    descricao: 'A Seletto Prime cria mesas de bilhar com design único e sofisticado, com atendimento do conceito à instalação. Canoas/RS, com envio para todo o Brasil.',
    corpo, jsonld: [ldNegocio],
  }));
}

/* ---------------- CONTATO ---------------- */
function contato() {
  const d = 1;
  const mapa = encodeURIComponent(`${C.endereco}, ${C.cidade} - ${C.uf}`);
  const corpo = `
<section class="phero">
  <div class="phero__bg"><img src="${img(d, 'galeria/g09.webp')}" alt="" width="960" height="1280"></div>
  <div class="wrap phero__in">
    <ol class="crumbs"><li><a href="${L(d, ROTAS.home)}">Início</a></li><li>Contato</li></ol>
    <span class="eyebrow">Contato</span>
    <h1 class="h-xl">Vamos falar <span class="it">da sua mesa</span></h1>
    <p class="lead">Quer um atendimento personalizado? Fale com o nosso time comercial.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap contact">
    <div>
      <ul class="cinfo">
        <li><span class="cinfo__ic">${ic('whatsapp')}</span><div><h3>WhatsApp</h3><a href="${wa()}" target="_blank" rel="noopener">${esc(C.whatsappExibicao)}</a></div></li>
        <li><span class="cinfo__ic">${ic('phone')}</span><div><h3>Telefone</h3><a href="tel:${C.telefoneLink}">${esc(C.telefone)}</a></div></li>
        <li><span class="cinfo__ic">${ic('pin')}</span><div><h3>Endereço</h3><p>${esc(C.endereco)}<br>${esc(C.cidade)} – ${esc(C.uf)}</p><a class="link-arrow mt-s" style="font-size:12px" href="https://www.google.com/maps/search/?api=1&query=${mapa}" target="_blank" rel="noopener">Como chegar ${ic('arrow')}</a></div></li>
        <li><span class="cinfo__ic">${ic('clock')}</span><div><h3>Funcionamento</h3><p>${C.horarios.map(([a, b]) => `${esc(a)}: ${esc(b)}`).join('<br>')}</p></div></li>
        <li><span class="cinfo__ic">${ic('instagram')}</span><div><h3>Instagram</h3><a href="${C.instagram}" target="_blank" rel="noopener">${esc(C.instagramUsuario)}</a></div></li>
      </ul>
    </div>
    <form class="form" data-wa-form novalidate>
      <div>
        <span class="eyebrow eyebrow--plain">Pedido de orçamento</span>
        <h2 class="h-md mt-s">Conte o que <span class="it">você imagina</span></h2>
      </div>
      <div class="form__row">
        <div class="field"><label for="f-nome">Nome</label><input id="f-nome" name="nome" autocomplete="name" required></div>
        <div class="field"><label for="f-cidade">Cidade / UF</label><input id="f-cidade" name="cidade" autocomplete="address-level2"></div>
      </div>
      <div class="form__row">
        <div class="field"><label for="f-modelo">Modelo de interesse</label>
          <select id="f-modelo" name="modelo"><option value="">Ainda não sei</option>${D.linhas.map((l) => `<optgroup label="${esc(l.titulo)}">${modelosDa(l.id).map((m) => `<option>${esc(m.nome)}</option>`).join('')}</optgroup>`).join('')}<option>Outras opções de jogos</option></select></div>
        <div class="field"><label for="f-tam">Tamanho</label>
          <select id="f-tam" name="tamanho"><option value="">Ainda não sei</option>${['1,80 x 1,00 m', '2,00 x 1,20 m', '2,30 x 1,30 m', '2,70 x 1,45 m'].map((t) => `<option>${t}</option>`).join('')}</select></div>
      </div>
      <div class="field"><label for="f-msg">Mensagem</label><textarea id="f-msg" name="mensagem" placeholder="Fale um pouco sobre o ambiente, cores e acabamentos que você imagina."></textarea></div>
      <button class="btn btn--wa btn--block" type="submit">${ic('whatsapp')} Enviar pelo WhatsApp</button>
      <small>Ao enviar, o WhatsApp abre com a sua mensagem pronta para o nosso time comercial.</small>
    </form>
  </div>
</section>
<iframe class="map" title="Mapa: ${esc(C.endereco)}, ${esc(C.cidade)}" src="https://www.google.com/maps?q=${mapa}&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
  write('contato/index.html', layout({
    d, id: 'contato', rota: ROTAS.contato, solido: true,
    titulo: 'Contato | Seletto Prime — Canoas/RS',
    descricao: `Fale com a Seletto Prime: WhatsApp ${C.whatsappExibicao}, telefone ${C.telefone}. ${C.endereco}, ${C.cidade}/${C.uf}.`,
    corpo, jsonld: [ldNegocio],
  }));
}

/* ---------------- sitemap / robots ---------------- */
function extras() {
  const urls = ['', ROTAS.catalogo, ROTAS.galeria, ROTAS.sobre, ROTAS.contato, ...D.modelos.map((m) => rotaModelo(m.slug))];
  write('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url><loc>${C.siteUrl}/${u}</loc></url>`).join('\n')}\n</urlset>\n`);
  write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /_build/\n\nSitemap: ${C.siteUrl}/sitemap.xml\n`);
}

/* ---------------- run ---------------- */
home();
catalogo();
galeria();
sobre();
contato();
D.modelos.forEach(modelo);
extras();
console.log(`OK — ${5 + D.modelos.length} páginas geradas (preços ${C.mostrarPrecos ? 'VISÍVEIS' : 'ocultos'}, urls ${C.urlsLimpas ? 'limpas' : 'com index.html'}).`);
