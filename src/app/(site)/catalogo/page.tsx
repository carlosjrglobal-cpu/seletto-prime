import type { Metadata } from 'next';
import { CtaBand, GameCard, JsonLd, PageHero } from '@/components/blocos';
import CatalogoFiltro from '@/components/CatalogoFiltro';
import { Icon } from '@/components/Icon';
import { precoAcessorio, precoJogo, precoMin } from '@/data/precos';
import { acessorios, brl, config, feltros, jogos, modelos, rotaModelo, wa } from '@/data/site';
import { img } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Catálogo de mesas de bilhar 2026',
  description: `Conheça os ${modelos.length} modelos de mesas de bilhar Seletto Prime nas linhas Standard, Plus e Master — todos com versão jantar. Também pebolim, poker, cartas e acessórios.`,
  alternates: { canonical: '/catalogo/' },
};

export default function Catalogo() {
  const precos = Object.fromEntries(modelos.map((m) => [m.slug, precoMin(m)]));
  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'ItemList', name: 'Catálogo Seletto Prime',
        itemListElement: modelos.map((m, i) => ({ '@type': 'ListItem', position: i + 1, url: config.siteUrl + rotaModelo(m.slug), name: 'Mesa de bilhar ' + m.nome })),
      }} />
      <PageHero crumb="Catálogo" eyebrow="Catálogo 2026" foto="catalogo-capa.webp"
        titulo={<>Mesas de <span className="it">bilhar</span></>}
        lead={`${modelos.length} modelos em três linhas — todos com tampo para refeição, até quatro tamanhos e ${feltros.length} cores de feltro em tecido acrílico ou lã.`} />
      <CatalogoFiltro precos={precos} />

      <section className="sec dark-2" id="jogos">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div><span className="eyebrow">Outras opções de jogos</span><h2 className="h-lg mt-s">Mais formas de <span className="it">jogar</span></h2></div>
            <p className="lead">Várias opções de jogos disponíveis para você aplicar no seu ambiente. Personalizamos com o modelo de base que desejar.</p>
          </div>
          <div className="games">{jogos.map((g) => <GameCard key={g.id} g={g} preco={precoJogo(g.id)} />)}</div>
        </div>
      </section>

      <section className="sec" id="acessorios">
        <div className="wrap acc">
          <div className="acc__imgs rv">
            <img src={img('acessorios/taqueira-painel-sm.webp')} alt="Taqueira painel iluminada com tacos e bolas" loading="lazy" width={480} height={720} />
            <img src={img('acessorios/bancos-sm.webp')} alt="Mesa de bilhar preta com bancos" loading="lazy" width={412} height={549} />
          </div>
          <div>
            <span className="eyebrow">Acessórios</span>
            <h2 className="h-lg mt-s">Monte o seu <span className="it">ambiente</span></h2>
            <p className="lead mt-s">Complete o espaço da maneira que desejar, com o seu estilo e um design original.</p>
            <ul className="acc-list mt-m">
              {acessorios.map((a) => { const p = precoAcessorio(a.nome); return <li key={a.nome}><span>{a.nome}</span>{p ? <span>{brl(p)}</span> : null}</li>; })}
            </ul>
            <a className="btn btn--ink mt-m" href={wa('Olá! Vim do site e gostaria de saber mais sobre os acessórios.')} target="_blank" rel="noopener"><Icon n="whatsapp" /> Consultar acessórios</a>
          </div>
        </div>
      </section>
      <CtaBand titulo={<>Não encontrou <span className="it">o que procura?</span></>} texto="Desenvolvemos a mesa ideal para o seu espaço. Conte para o nosso time o que você imagina." foto="galeria/g07.webp" />
    </>
  );
}
