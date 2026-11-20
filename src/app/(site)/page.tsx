import type { Metadata } from 'next';
import Link from 'next/link';
import Configurador from '@/components/Configurador';
import { CardModelo, CtaBand, GameCard, Incluso, JsonLd, ldNegocio, Passos } from '@/components/blocos';
import { Icon } from '@/components/Icon';
import { Compare, Hero, Rail } from '@/components/interativos';
import { precoJogo, precoMin } from '@/data/precos';
import { brl, feltros, jogos, linhas, modelosDa } from '@/data/site';
import { img } from '@/lib/paths';

export const metadata: Metadata = {
  title: { absolute: 'Seletto Prime — Mesas de bilhar de alto padrão | Bilhar, jantar e tênis de mesa' },
  description: 'Mesas de bilhar com design exclusivo que se transformam em mesa de jantar e tênis de mesa. Linhas Standard, Plus e Master. Fabricação em Canoas/RS com envio para todo o Brasil.',
  alternates: { canonical: '/' },
};

const GAL_HOME: [string, string][] = [['g04', 'b-big'], ['g03', 'b-tall'], ['g02', ''], ['g05', ''], ['g10', 'b-wide'], ['g13', ''], ['g16', '']];
const JOGOS_HOME = ['tenis-de-mesa', 'pebolim-zeus', 'poker', 'aero-hockey', 'sextavada-cartas', 'redonda-cartas'];

export default function Home() {
  const ordem = ['standard', 'plus', 'master'].flatMap((l) => modelosDa(l));
  return (
    <>
      <JsonLd data={ldNegocio} />
      <Hero
        fotos={['hero/h1.webp', 'hero/h2.webp', 'hero/h3.webp', 'hero/h4.webp']}
        texto={<>
          <span className="eyebrow">Somos exclusivos</span>
          <h1 className="h-xl">Mesas<br />de jogos <span className="it">exclusivas</span></h1>
          <p className="lead">Criamos mesas de bilhar com design único e sofisticado, que se transformam em mesa de jantar e de tênis de mesa. Do conceito à instalação, trabalhamos ao seu lado para que cada peça reflita o seu estilo.</p>
          <div className="hero__ctas">
            <Link className="btn btn--gold" href="/orcamento/">Quero minha mesa <Icon n="arrow" /></Link>
            <Link className="btn btn--ghost" href="/catalogo/">Explorar catálogo</Link>
          </div>
        </>}
        rodape={
          <div className="hero__facts">
            <div className="wrap"><ul>
              <li><Icon n="layers" /><span><strong>3 em 1</strong>Bilhar, jantar e tênis de mesa</span></li>
              <li><Icon n="ruler" /><span><strong>Até 4 tamanhos</strong>De 1,80 m a 2,70 m</span></li>
              <li><Icon n="palette" /><span><strong>{feltros.length} cores de feltro</strong>Em tecido acrílico ou lã</span></li>
              <li><Icon n="truck" /><span><strong>Todo o Brasil</strong>Enviamos para todo o país</span></li>
            </ul></div>
          </div>
        }
      />

      <section className="sec">
        <div className="wrap intro">
          <div><span className="eyebrow rv">Seletto Prime</span></div>
          <div>
            <p className="intro__quote rv">Acreditamos que cada mesa deve refletir o estilo e a paixão de quem a utiliza. Por isso, trabalhamos de perto com você em todas as etapas — e suas ideias se tornam realidade <span className="it">com estética, funcionalidade e qualidade.</span></p>
            <div className="intro__grid mt-m">
              <div className="pillar rv"><Icon n="pencil" /><h3>Design autoral</h3><p>Peças com desenho próprio, criadas para serem protagonistas em qualquer ambiente.</p></div>
              <div className="pillar rv rv-d1"><Icon n="gem" /><h3>Acabamento premium</h3><p>Laca, madeira e ferro com acabamento refinado — e o tampo no mesmo padrão da mesa.</p></div>
              <div className="pillar rv rv-d2"><Icon n="heart" /><h3>Atendimento próximo</h3><p>Acompanhamos cada etapa com você, do conceito à instalação.</p></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec dark" id="tres-em-um">
        <div className="wrap trio">
          <div className="rv">
            <Compare antes="mesas/coliseu/bilhar.webp" depois="mesas/coliseu/jantar.webp" altAntes="Mesa Coliseu na versão bilhar" altDepois="Mesa Coliseu na versão mesa de jantar" />
            <p className="compare-cap"><span>Modelo Coliseu · Linha Master</span><span>← Arraste para transformar →</span></p>
          </div>
          <div>
            <span className="eyebrow rv">3 em 1</span>
            <h2 className="h-lg mt-s rv">Uma mesa.<br /><span className="it">Três</span> experiências.</h2>
            <p className="lead mt-s rv">Com o tampo multiuso — feito no mesmo material e acabamento da mesa — o bilhar vira mesa de jantar em instantes e recebe também o jogo de tênis de mesa.</p>
            <div className="modes">
              <div className="mode rv"><span className="mode__n">01</span><div><h3>Bilhar</h3><p>Feltro em tecido acrílico ou lã, em {feltros.length} cores, com tacos, bolas, triângulo e giz.</p></div></div>
              <div className="mode rv"><span className="mode__n">02</span><div><h3>Jantar</h3><p>Tampo para refeição com suporte próprio, para receber com elegância.</p></div></div>
              <div className="mode rv"><span className="mode__n">03</span><div><h3>Tênis de mesa</h3><p>Marcação em fita ou pintura de pingue-pongue no tampo.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div><span className="eyebrow rv">Coleção 2026</span><h2 className="h-lg mt-s rv">Três linhas, <span className="it">um só</span> padrão de excelência</h2></div>
            <p className="lead rv">Do design de linhas retas às formas esculturais, cada linha traduz uma personalidade — todas com o mesmo cuidado no acabamento e no atendimento.</p>
          </div>
          <div className="lines">
            {linhas.map((l, i) => {
              const min = modelosDa(l.id).map(precoMin).filter((v): v is number => !!v);
              return (
                <Link key={l.id} className={`line-card rv${i ? ' rv-d' + i : ''}`} href={`/catalogo/#${l.id}`}>
                  <img src={img(`mesas/${l.capa}/capa.webp`)} alt="" loading="lazy" width={1004} height={620} />
                  <div className="line-card__body">
                    <span className="line-card__k">linha</span>
                    <h3>{l.nome}</h3>
                    <p>{l.resumo}</p>
                    <span className="line-card__meta"><span>{modelosDa(l.id).length} modelos{min.length ? ` · a partir de ${brl(Math.min(...min))}` : ''}</span><Icon n="arrow" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="sec white" aria-label="Modelos">
        <div className="wrap">
          <Rail eyebrow="Modelos" label="Lista de modelos" titulo={<>Escolha a sua <span className="it">protagonista</span></>}>
            {ordem.map((m) => <CardModelo key={m.slug} m={m} preco={precoMin(m)} />)}
          </Rail>
          <div className="mt-m"><Link className="link-arrow" href="/catalogo/">Ver catálogo completo <Icon n="arrow" /></Link></div>
        </div>
      </section>

      <section className="sec dark" id="personalize"><Configurador /></section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div><span className="eyebrow rv">Como trabalhamos</span><h2 className="h-lg mt-s rv">Do conceito <span className="it">à instalação</span></h2></div>
            <p className="lead rv">Trabalhamos de perto com nossos clientes em todas as etapas. Assim, suas ideias se tornam realidade de forma colaborativa.</p>
          </div>
          <Passos />
        </div>
      </section>

      <section className="sec sec--tight white">
        <div className="wrap">
          <div className="sec-head sec-head--center">
            <span className="eyebrow rv">Acompanha sua mesa</span>
            <h2 className="h-md rv">Tudo pronto para <span className="it">o primeiro jogo</span></h2>
          </div>
          <Incluso />
        </div>
      </section>

      <section className="sec dark-2">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div><span className="eyebrow rv">Outras opções de jogos</span><h2 className="h-lg mt-s rv">Pebolim, poker, cartas <span className="it">e muito mais</span></h2></div>
            <p className="lead rv">Várias opções de jogos para você aplicar no seu ambiente. Personalizamos com o modelo de base que desejar.</p>
          </div>
          <div className="games">{JOGOS_HOME.map((id) => jogos.find((g) => g.id === id)!).map((g) => <GameCard key={g.id} g={g} preco={precoJogo(g.id)} />)}</div>
          <div className="mt-m"><Link className="link-arrow" href="/catalogo/#jogos">Ver todas as opções <Icon n="arrow" /></Link></div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div><span className="eyebrow rv">Galeria</span><h2 className="h-lg mt-s rv">Mesas Seletto <span className="it">em casa</span></h2></div>
            <p className="lead rv">Projetos entregues em ambientes reais. Toque nas fotos para ampliar.</p>
          </div>
          <div className="bento">
            {GAL_HOME.map(([id, cls], i) => (
              <a key={id} className={`rv${cls ? ' ' + cls : ''}${i % 3 ? ' rv-d' + (i % 3) : ''}`} href={img(`galeria/${id}.webp`)} data-lb="home">
                <img src={img(`galeria/${id}${cls === 'b-big' || cls === 'b-wide' ? '' : '-sm'}.webp`)} alt="Mesa de bilhar Seletto Prime instalada em ambiente residencial" loading="lazy" />
                <span className="zoom"><Icon n="expand" /></span>
              </a>
            ))}
          </div>
          <div className="mt-m center"><Link className="btn btn--line" href="/galeria/">Ver galeria completa <Icon n="arrow" /></Link></div>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
