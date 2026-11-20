import type { Metadata } from 'next';
import Link from 'next/link';
import { CtaBand, JsonLd, ldNegocio, PageHero, Passos } from '@/components/blocos';
import { Icon } from '@/components/Icon';
import { config } from '@/data/site';
import { img } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Sobre nós — mesas de jogos com design exclusivo',
  description: 'A Seletto Prime cria mesas de bilhar com design único e sofisticado, com atendimento do conceito à instalação. Canoas/RS, com envio para todo o Brasil.',
  alternates: { canonical: '/sobre/' },
};

export default function Sobre() {
  return (
    <>
      <JsonLd data={ldNegocio} />
      <PageHero crumb="Sobre" eyebrow="Sobre a Seletto Prime" foto="galeria/g03.webp" titulo={<>Design que <span className="it">transforma</span></>}
        lead="Mais que uma mesa de bilhar: uma peça de alto padrão para ambientes exclusivos." />

      <section className="sec">
        <div className="wrap split">
          <div className="split__media rv"><img src={img('galeria/g01.webp')} alt="Mesa de bilhar preta em sala com iluminação embutida" loading="lazy" width={1600} height={2133} /></div>
          <div className="split__body">
            <span className="eyebrow rv">Quem somos</span>
            <h2 className="h-lg rv">Mesas de jogos <span className="it">com alma</span></h2>
            <p className="rv">A Seletto Prime cria mesas de bilhar com design único e sofisticado, projetadas para oferecer uma experiência de jogo incomparável.</p>
            <p className="rv">Acreditamos que cada mesa deve refletir o estilo e a paixão de quem a utiliza. Por isso, trabalhamos de perto com nossos clientes em todas as etapas, do conceito à instalação — e as suas ideias se tornam realidade de forma colaborativa, em uma mesa que combina estética, funcionalidade e qualidade.</p>
            <p className="rv">De {config.cidade}, no Rio Grande do Sul, enviamos para todo o Brasil.</p>
            <div className="rv"><Link className="link-arrow" href="/catalogo/">Conheça o catálogo <Icon n="arrow" /></Link></div>
          </div>
        </div>
      </section>

      <section className="sec sec--tight paper-2">
        <div className="wrap">
          <div className="sec-head sec-head--center"><span className="eyebrow rv">No que acreditamos</span><h2 className="h-md rv">O que torna uma mesa <span className="it">Seletto</span></h2></div>
          <div className="vals">
            <div className="val rv"><Icon n="pencil" /><h3>Design exclusivo</h3><p>Peças autorais, com desenho próprio, criadas para serem protagonistas do ambiente.</p></div>
            <div className="val rv rv-d1"><Icon n="palette" /><h3>Personalização</h3><p>Tamanho, acabamento e cor do tecido escolhidos para harmonizar com a sua decoração.</p></div>
            <div className="val rv rv-d2"><Icon n="gem" /><h3>Acabamento premium</h3><p>Materiais nobres e cuidado em cada detalhe — inclusive no tampo multiuso.</p></div>
            <div className="val rv rv-d3"><Icon n="heart" /><h3>Atendimento próximo</h3><p>Um time comercial dedicado para acompanhar você do primeiro contato à entrega.</p></div>
          </div>
        </div>
      </section>

      <section className="sec dark">
        <div className="wrap split split--rev">
          <div className="split__media rv"><img src={img('mesas/ravena/jantar.webp')} alt="Mesa Ravena na versão jantar" loading="lazy" width={875} height={582} style={{ aspectRatio: '4/4.4' }} /></div>
          <div className="split__body">
            <span className="eyebrow rv">3 em 1</span>
            <h2 className="h-lg rv">Uma peça que acompanha <span className="it">a rotina da casa</span></h2>
            <p className="rv">Nossas mesas são pensadas para viver o dia inteiro: bilhar para os momentos de lazer, mesa de jantar para receber e tênis de mesa para a família toda. O tampo multiuso é feito com o mesmo material e acabamento da mesa, para manter o padrão do design em qualquer versão.</p>
            <div className="rv"><Link className="btn btn--gold" href="/#tres-em-um">Ver a transformação <Icon n="arrow" /></Link></div>
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="wrap">
          <div className="sec-head sec-head--split">
            <div><span className="eyebrow rv">Como trabalhamos</span><h2 className="h-lg mt-s rv">Do conceito <span className="it">à instalação</span></h2></div>
            <p className="lead rv">Cada projeto é acompanhado de perto pelo nosso time.</p>
          </div>
          <Passos />
          <div className="collage mt-l">
            <img className="a rv" src={img('galeria/g06-sm.webp')} alt="Mesa de bilhar com estrutura cinza em sala com adega" loading="lazy" />
            <img className="b rv rv-d1" src={img('galeria/g04-sm.webp')} alt="Mesa de bilhar branca com feltro claro" loading="lazy" />
            <img className="c rv rv-d2" src={img('galeria/g10-sm.webp')} alt="Mesa de bilhar com bancos de madeira na varanda" loading="lazy" />
            <img className="d rv" src={img('galeria/g16-sm.webp')} alt="Mesa de bilhar com base em Z" loading="lazy" />
          </div>
        </div>
      </section>
      <CtaBand foto="galeria/g12.webp" />
    </>
  );
}
