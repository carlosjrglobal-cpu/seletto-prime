/* =====================================================================
   SELETTO PRIME — DADOS DO SITE
   Edite este arquivo e rode:  node _build/build.js
   ===================================================================== */

const config = {
  nome: 'Seletto Prime',
  siteUrl: 'https://selettoprime.com.br',

  // O catálogo 2026 é marcado como "Catálogo Interno — utilização exclusiva
  // time de vendas". Por isso os preços ficam OCULTOS por padrão.
  // Mude para true para exibir "a partir de" nos cards e o preço por tamanho.
  mostrarPrecos: false,

  // false = links com "index.html" (funciona abrindo os arquivos direto no PC).
  // true  = links limpos "/modelo-comodo/" (use ao publicar num servidor).
  urlsLimpas: false,

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
  ],
  instagram: 'https://www.instagram.com/selettomesasoficial',
  instagramUsuario: '@selettomesasoficial',
  facebook: 'https://www.facebook.com/profile.php?id=61572834043533',
};

const linhas = [
  {
    id: 'standard',
    nome: 'Standard',
    titulo: 'Linha Standard',
    resumo: 'Linhas retas, bases geométricas e acabamentos versáteis em laca e madeira. Design contemporâneo para conviver com o dia a dia da casa.',
    capa: 'verona',
  },
  {
    id: 'plus',
    nome: 'Plus',
    titulo: 'Linha Plus',
    resumo: 'Bases escultóricas e materiais mistos — ferro, madeira e laca — para quem quer uma peça com mais personalidade e presença.',
    capa: 'ravena',
  },
  {
    id: 'master',
    nome: 'Master',
    titulo: 'Linha Master',
    resumo: 'O ápice do design Seletto: formas curvas, volumes esculturais e acabamentos exclusivos para projetos de alto padrão.',
    capa: 'coliseu',
  },
];

// Cores oficiais de feltro (tabela "tecidos oficial" do site).
const feltros = [
  { id: 'preto', nome: 'Preto', hex: '#1d1d26' },
  { id: 'cinza', nome: 'Cinza', hex: '#998c95' },
  { id: 'chocolate', nome: 'Chocolate', hex: '#4c3840' },
  { id: 'caramelo', nome: 'Caramelo', hex: '#cb935a' },
  { id: 'areia', nome: 'Areia', hex: '#c9a084' },
  { id: 'amarelo', nome: 'Amarelo', hex: '#feb501' },
  { id: 'bordo', nome: 'Bordô', hex: '#871832' },
  { id: 'vermelho', nome: 'Vermelho', hex: '#c50118' },
  { id: 'vinho', nome: 'Vinho', hex: '#66123b' },
  { id: 'lavanda', nome: 'Lavanda', hex: '#636299' },
  { id: 'azul-marinho', nome: 'Azul-marinho', hex: '#1c3279' },
  { id: 'azul-petroleo', nome: 'Azul-petróleo', hex: '#02487c' },
  { id: 'azul-royal', nome: 'Azul royal', hex: '#034ba3' },
  { id: 'verde', nome: 'Verde', hex: '#0e8852' },
];

const tecidos = ['Tecido acrílico', 'Tecido lã'];

// Itens que acompanham todas as mesas de bilhar.
const acompanha = [
  { icone: 'taco', nome: '4 tacos' },
  { icone: 'suporte', nome: 'Suporte para tacos' },
  { icone: 'tampo', nome: 'Tampo para refeição' },
  { icone: 'suporte-tampo', nome: 'Suporte para o tampo' },
  { icone: 'bolas', nome: 'Jogo de 15 bolas numeradas' },
  { icone: 'triangulo', nome: 'Triângulo' },
  { icone: 'giz', nome: 'Kit giz' },
];

// Preços ficam em _build/precos.local.js (fora do Git). Sem esse arquivo, o site gera sem preços.
let PRECOS = {};
try { PRECOS = require('./precos.local'); } catch (e) { PRECOS = {}; }

const TAM = ['1,80 x 1,00 m', '2,00 x 1,20 m', '2,30 x 1,30 m', '2,70 x 1,45 m'];
const t = (slug, medidas = TAM) => medidas.map((m, i) => ({ medida: m, preco: (PRECOS.modelos && PRECOS.modelos[slug] && PRECOS.modelos[slug][i]) || null }));

/* Descrições: textos das páginas de cada modelo no site atual.
   (Eleganza não tinha página no site — texto novo, revise.) */
const modelos = [
  // ---------------- LINHA STANDARD ----------------
  {
    slug: 'comodo', nome: 'Comodo', linha: 'standard',
    tamanhos: t('comodo'),
    descricao: [
      'A Mesa Comodo é a expressão máxima do encontro entre arte e funcionalidade.',
      'Criada para ser protagonista em qualquer cenário, carrega em seu design contemporâneo linhas precisas e volumes que evocam equilíbrio e imponência. Sua superfície refinada, combinada a detalhes sutis e elegantes, transmite movimento e modernidade sem perder a atemporalidade.',
      'Versátil, a Comodo dialoga com ambientes clássicos ou urbanos, sempre imprimindo presença e exclusividade. Mais do que uma mesa de jogos, é um ícone de design que traduz status e personalidade, transformando cada momento de lazer em uma experiência sofisticada e memorável.',
    ],
  },
  {
    slug: 'milano', nome: 'Milano', linha: 'standard',
    tamanhos: t('milano'),
    descricao: [
      'A Mesa Milano é puro design italiano em cada detalhe.',
      'Inspirada nos traços da cidade que dita tendências ao mundo, ela une elegância, precisão e autenticidade em uma só peça. Suas linhas minimalistas e proporções equilibradas refletem o espírito de Milão — sofisticado, moderno e cheio de personalidade.',
      'A combinação de materiais nobres e acabamento impecável transforma a Milano em muito mais que uma mesa de bilhar: é uma obra de design que celebra o estilo, a arte e o prazer de viver bem.',
    ],
  },
  {
    slug: 'verona', nome: 'Verona', linha: 'standard',
    tamanhos: t('verona'),
    descricao: [
      'A Mesa Verona é a harmonia entre tradição e design italiano.',
      'Com madeira clara e linhas retas que revelam simplicidade e sofisticação, ela carrega a essência da elegância atemporal. Seu visual sereno e equilibrado transforma qualquer ambiente em um espaço acolhedor, onde o clássico encontra o contemporâneo de forma natural.',
      'A Verona é feita para quem aprecia a beleza do essencial — o luxo discreto, o conforto visual e o prazer de estar em torno de algo genuinamente bem feito. Mais do que uma mesa de bilhar, é uma celebração do estilo italiano e da arte de viver com classe.',
    ],
  },
  {
    slug: 'fontana', nome: 'Fontana', linha: 'standard',
    tamanhos: t('fontana'),
    descricao: [
      'A Mesa Fontana é a definição do clássico que nunca sai de moda.',
      'Com estrutura em tons suaves de bege e feltro preto profundo, ela traduz equilíbrio, sofisticação e requinte em cada traço. Seu design harmoniza tradição e contemporaneidade, criando uma presença imponente sem perder a leveza visual.',
      'A Fontana foi criada para ambientes que valorizam o bom gosto e a permanência do belo — móveis que atravessam gerações. Mais do que uma mesa de bilhar, é uma peça de arte funcional, feita para transformar o lazer em um momento de elegância e contemplação.',
    ],
  },
  {
    slug: 'carmello', nome: 'Carmello', linha: 'standard',
    tamanhos: t('carmello'),
    descricao: [
      'A Mesa Carmello é o encontro perfeito entre poder e sofisticação.',
      'Com estrutura em preto profundo e feltro vermelho intenso, ela impõe presença em qualquer ambiente. Seu design elegante carrega um toque de ousadia, equilibrando linhas modernas e acabamento impecável.',
      'Cada detalhe foi pensado para traduzir exclusividade, estilo e paixão pelo jogo. A Carmello é mais que uma mesa de bilhar — é uma declaração de personalidade, feita para quem aprecia o requinte, o contraste e o prazer de viver momentos marcantes em grande estilo.',
    ],
  },
  {
    slug: 'salvatore', nome: 'Salvatore', linha: 'standard',
    tamanhos: t('salvatore'),
    descricao: [
      'A Mesa Salvatore é a elegância em sua forma mais pura.',
      'Com nuances de cinza que refletem equilíbrio e modernidade, ela se destaca pela harmonia entre linhas limpas e presença imponente. Cada detalhe da Salvatore foi pensado para expressar sutileza e bom gosto — um design que fala baixo, mas diz muito.',
      'Sua estética neutra e refinada dialoga com qualquer ambiente, do clássico ao contemporâneo, sempre acrescentando um toque de exclusividade. Mais do que uma mesa de bilhar, a Salvatore é uma peça de design que inspira serenidade, sofisticação e uma beleza atemporal.',
    ],
  },
  {
    // Está no site, mas não aparece no catálogo 2026.
    slug: 'rustic', nome: 'Rustic', linha: 'standard', foraDoCatalogo: true,
    tamanhos: t('rustic'),
    descricao: [
      'A Mesa Rustic é pura essência da natureza transformada em design.',
      'Feita com madeira rústica de textura marcante e veios únicos, ela carrega a alma do artesanal em cada detalhe. Seu visual imponente e acolhedor traz o calor da madeira em contraste com o refinamento das linhas modernas, criando um equilíbrio perfeito entre o rústico e o sofisticado.',
      'A Rustic é mais que uma mesa de bilhar — é um convite à convivência, à pausa e aos bons momentos compartilhados. Um móvel que transforma o ambiente com presença, autenticidade e a beleza do que é feito para durar.',
    ],
  },

  // ---------------- LINHA PLUS ----------------
  {
    slug: 'iron', nome: 'Iron', linha: 'plus',
    tamanhos: t('iron'),
    descricao: [
      'A Mesa Iron é a tradução da força em forma de elegância.',
      'Inspirada no estilo clássico, ela une a robustez do ferro à delicadeza dos detalhes artesanais, criando um equilíbrio perfeito entre tradição e requinte. Sua estrutura sólida transmite segurança e presença, enquanto o acabamento refinado revela o cuidado em cada linha e proporção.',
      'A Iron é feita para quem aprecia o valor das coisas duradouras — móveis que atravessam o tempo sem perder o charme. Mais do que uma mesa de bilhar, é um símbolo de bom gosto e autenticidade, capaz de transformar qualquer ambiente em um espaço de convivência nobre e acolhedor.',
    ],
  },
  {
    slug: 'vittorio', nome: 'Vittorio', linha: 'plus',
    tamanhos: t('vittorio'),
    descricao: [
      'A Mesa Vittorio é a expressão máxima da sofisticação clássica.',
      'Com estrutura e feltro em preto profundo, ela impõe respeito e presença em qualquer ambiente. Seu design é puro equilíbrio entre tradição e modernidade, revelando linhas sólidas, acabamento primoroso e uma aura de exclusividade.',
      'A Vittorio não busca chamar atenção — ela a conquista naturalmente, com sua elegância silenciosa e seu charme atemporal. Mais do que uma mesa de bilhar, é um símbolo de requinte e poder, criada para quem valoriza o luxo em sua forma mais discreta e refinada.',
    ],
  },
  {
    slug: 'otello', nome: 'Otello', linha: 'plus',
    tamanhos: t('otello'),
    descricao: [
      'A Mesa Otello é a essência do natural transformada em design.',
      'Feita em madeira crua, ela exibe com orgulho a beleza das imperfeições e o calor das texturas autênticas. Seu visual leve e contemporâneo revela um equilíbrio raro entre simplicidade e sofisticação, tornando-se o centro de atenção sem precisar de excessos.',
      'A Otello é feita para quem valoriza o real — o toque da madeira, o traço artesanal e a verdade dos materiais. Mais do que uma mesa de bilhar, é uma celebração da natureza em sua forma mais elegante e atemporal.',
    ],
  },
  {
    slug: 'ravena', nome: 'Ravena', linha: 'plus',
    tamanhos: t('ravena'),
    descricao: [
      'A Mesa Ravena é a síntese da elegância contemporânea.',
      'Com estrutura em preto absoluto e feltro azul intenso, ela exala estilo e personalidade. Seu design refinado e proporções precisas criam um visual imponente, enquanto o contraste das cores transmite modernidade e distinção.',
      'A Ravena é feita para quem aprecia o luxo discreto — aquele que se revela nos detalhes e na atitude. Mais do que uma mesa de bilhar, é uma peça de design marcante, criada para transformar o lazer em uma experiência sofisticada e irresistível.',
    ],
  },
  {
    slug: 'zeus', nome: 'Zeus', linha: 'plus',
    tamanhos: t('zeus'),
    descricao: [
      'A Mesa Zeus é o poder transformado em design.',
      'Com estrutura branca marcada por uma linha preta elegante, ela se impõe com presença e personalidade. Seus pés em formato de “Z” revelam um traço ousado e arquitetônico, símbolo de força e identidade.',
      'A Zeus é feita para quem aprecia o extraordinário — um móvel que não segue tendências, as cria. Mais do que uma mesa de bilhar, é uma obra de design contemporâneo que combina equilíbrio, estilo e imponência em cada detalhe.',
    ],
  },
  {
    // Está no site, mas não aparece no catálogo 2026.
    slug: 'pisa', nome: 'Pisa', linha: 'plus', foraDoCatalogo: true,
    tamanhos: t('pisa'),
    descricao: [
      'A Mesa Pisa é o equilíbrio perfeito entre arte e tradição.',
      'Feita em madeira de lei, ela impressiona pela nobreza do material e pela elegância das proporções. Inspirada na célebre Torre de Pisa, suas linhas revelam leve inclinação e movimento sutil — um toque de ousadia em meio à harmonia clássica.',
      'Cada detalhe expressa a força do artesanal e o encanto do design italiano. A Pisa é feita para quem valoriza autenticidade, história e sofisticação. Mais do que uma mesa de bilhar, é uma obra-prima em equilíbrio, criada para transformar qualquer ambiente em um espaço de admiração.',
    ],
  },

  // ---------------- LINHA MASTER ----------------
  {
    slug: 'palatino', nome: 'Palatino', linha: 'master',
    tamanhos: t('palatino'),
    descricao: [
      'A Mesa Palatino é o encontro da tradição com o luxo contemporâneo.',
      'Inspirada na imponência das formas clássicas, ela combina proporções equilibradas, acabamentos impecáveis e uma presença que impõe respeito. Seu design revela sutileza e força ao mesmo tempo — linhas elegantes, superfícies refinadas e um visual que transmite nobreza.',
      'A Palatino é feita para quem valoriza o requinte sem exageros, o design que atravessa o tempo e o prazer de viver momentos com classe. Mais do que uma mesa de bilhar, é um tributo à elegância eterna.',
    ],
  },
  {
    slug: 'novara', nome: 'Novara', linha: 'master',
    tamanhos: t('novara'),
    descricao: [
      'A Mesa Novara é a tradução do design suave e sofisticado.',
      'Com traços curvos e cores neutras em tons de cinza, ela combina equilíbrio visual e elegância natural. Seus chanfros na madeira revelam cuidado artesanal e atenção aos detalhes, criando um jogo de luz e sombra que realça suas formas.',
      'A Novara é feita para ambientes que respiram estilo e serenidade — peças que encantam pela sutileza. Mais do que uma mesa de bilhar, é um símbolo de harmonia contemporânea, capaz de transformar qualquer espaço em um refúgio de bom gosto e conforto estético.',
    ],
  },
  {
    slug: 'sofisticatto', nome: 'Sofisticatto', linha: 'master',
    tamanhos: t('sofisticatto'),
    descricao: [
      'A Mesa Sofisticatto é o ponto de encontro entre arte e design contemporâneo.',
      'Com traços curvos e acabamento em branco puro, ela exala leveza, movimento e personalidade. Seu visual escultural transforma o ambiente em uma verdadeira galeria de estilo, onde o moderno ganha alma e presença.',
      'Cada detalhe da Sofisticatto reflete a harmonia entre inovação e elegância — um convite para viver o lazer com requinte e originalidade. Mais do que uma mesa de bilhar, é uma peça de design autoral que redefine o conceito de sofisticação.',
    ],
  },
  {
    slug: 'coliseu', nome: 'Coliseu', linha: 'master',
    tamanhos: t('coliseu'),
    descricao: [
      'A Mesa Coliseu é a perfeita fusão entre força e elegância.',
      'Com estrutura em preto intenso e linhas curvas que evocam movimento, ela traduz imponência e sofisticação em cada detalhe. Seu design escultural remete à grandiosidade das formas clássicas, reinterpretadas sob uma ótica contemporânea.',
      'A Coliseu é feita para ambientes que valorizam presença e estilo — um móvel que não apenas decora, mas domina o espaço. Mais do que uma mesa de bilhar, é um monumento ao design, criado para quem enxerga o lazer como uma expressão de poder e bom gosto.',
    ],
  },
  {
    // Não tinha página no site atual — descrição nova, revise.
    slug: 'eleganza', nome: 'Eleganza', linha: 'master', novo: true,
    tamanhos: t('eleganza', TAM.slice(0, 3)),
    descricao: [
      'A Mesa Eleganza é a delicadeza do clássico em versão contemporânea.',
      'Com estrutura em laca clara e pés de linhas curvas e esguias, ela traz leveza e refinamento ao ambiente. Seus detalhes remetem ao mobiliário clássico, reinterpretado com proporções atuais e acabamento impecável.',
      'A Eleganza é feita para quem valoriza a sofisticação discreta — uma peça que encanta pelo traço, não pelo excesso. Mais do que uma mesa de bilhar, é um móvel de presença serena, pensado para receber, jogar e celebrar.',
    ],
  },
  {
    slug: 'bergamo', nome: 'Bergamo', linha: 'master',
    tamanhos: t('bergamo', TAM.slice(0, 3)),
    descricao: [
      'A Mesa Bergamo é o luxo da leveza.',
      'Com tons claros que variam entre o bege e o quase branco, ela traz uma sensação de pureza e harmonia visual. Seu design elegante e minimalista valoriza cada detalhe, transformando simplicidade em sofisticação.',
      'A Bergamo é feita para quem busca equilíbrio entre beleza e serenidade — uma peça que ilumina o ambiente e inspira conforto. Mais do que uma mesa de bilhar, é um símbolo de elegância suave, capaz de transformar o espaço com sutileza e presença.',
    ],
  },
  {
    slug: 'florenca', nome: 'Florença', linha: 'master',
    tamanhos: t('florenca'),
    descricao: [
      'A Mesa Florença foi desenvolvida para quem busca sofisticação, imponência e integração perfeita com ambientes contemporâneos.',
      'Seu design elegante combina linhas suaves, estrutura robusta e acabamento refinado, transformando a peça em um verdadeiro elemento de destaque na decoração. Com visual moderno, entrega presença estética sem abrir mão da funcionalidade, proporcionando uma experiência de jogo confortável e envolvente.',
      'Seus detalhes foram cuidadosamente projetados para oferecer acabamento premium, alta durabilidade e excelente harmonia visual em espaços residenciais de alto padrão. Mais do que uma mesa de bilhar, a Florença representa exclusividade, requinte e personalidade.',
    ],
  },
];

// Fotos: capa (foto principal do site) + versão bilhar e versão jantar (catálogo 2026).
const temPar = new Set(['verona', 'comodo', 'fontana', 'salvatore', 'milano', 'carmello', 'iron', 'vittorio', 'otello', 'ravena', 'zeus', 'coliseu', 'novara', 'palatino', 'sofisticatto', 'florenca', 'bergamo', 'eleganza']);
modelos.forEach((m) => {
  m.temPar = temPar.has(m.slug);
  // Eleganza: as duas fotos do catálogo são da versão bilhar.
  m.jantarReal = m.temPar && m.slug !== 'eleganza';
});

const jogos = [
  { id: 'tenis-de-mesa', nome: 'Tênis de mesa', detalhe: 'Mesa com versão em tênis de mesa', medida: '2,74 x 1,52 m' },
  { id: 'pebolim-zeus', nome: 'Pebolim base Zeus', detalhe: 'Mesa Zeus com versão em pebolim', medida: '1,35 x 1,00 m' },
  { id: 'pebolim-carmello', nome: 'Pebolim base Carmello', detalhe: 'Mesa com versão em pebolim', medida: '1,35 x 1,00 m' },
  { id: 'pebolim-iron', nome: 'Pebolim base Iron', detalhe: 'Mesa Iron com versão em pebolim', medida: '1,35 x 1,00 m' },
  { id: 'poker', nome: 'Poker', detalhe: 'Mesa com versão em poker', medida: '2,00 x 1,20 m' },
  { id: 'aero-hockey', nome: 'Aero hockey', detalhe: 'Mesa com versão em aero hockey', medida: '2,00 x 1,20 m' },
  { id: 'redonda-cartas', nome: 'Mesa redonda de cartas', detalhe: 'Mesa redonda com versão em cartas', medida: '1,30 m de diâmetro' },
  { id: 'sextavada-cartas', nome: 'Mesa sextavada de cartas', detalhe: 'Mesa sextavada com versão em cartas', medida: '1,30 x 1,30 m' },
  { id: 'redonda-iron-cartas', nome: 'Mesa de cartas base Iron', detalhe: 'Mesa Iron redonda com versão em cartas', medida: '2,00 x 1,20 m' },
];

const acessorios = [
  { nome: 'Tacos tradicionais' },
  { nome: 'Tacos profissionais' },
  { nome: 'Taqueira painel', img: 'taqueira-painel' },
  { nome: 'Bancos tradicionais (par)' },
  { nome: 'Bancos porta-tacos', img: 'bancos' },
  { nome: 'Gaveta Spazio' },
  { nome: 'Sistema Roller' },
  { nome: 'Marcação em fita de pingue-pongue' },
  { nome: 'Pintura de pingue-pongue' },
];

jogos.forEach((g) => { g.preco = (PRECOS.jogos && PRECOS.jogos[g.id]) || null; });
acessorios.forEach((a) => { a.preco = (PRECOS.acessorios && PRECOS.acessorios[a.nome]) || null; });

// Galeria (fotos do site atual). Proporção usada para o layout em mosaico.
const galeria = [
  ['g01', 1600, 2133], ['g02', 1280, 720], ['g03', 1320, 1447], ['g04', 1280, 960],
  ['g05', 1280, 822], ['g06', 1187, 1280], ['g07', 1280, 960], ['g08', 1170, 962],
  ['g09', 960, 1280], ['g10', 1280, 788], ['g11', 1280, 932], ['g12', 1150, 1280],
  ['g13', 1280, 960], ['g14', 1280, 923], ['g15', 1053, 1280], ['g16', 1280, 745],
  ['g17', 960, 1280], ['g18', 979, 814],
];

module.exports = { config, linhas, feltros, tecidos, acompanha, modelos, jogos, acessorios, galeria };
