import Link from 'next/link';
import { acompanha, brl, config, linhaDe, rotaModelo, wa, type Jogo, type Modelo } from '@/data/site';
import { img } from '@/lib/paths';
import { Icon } from './Icon';

export function CardModelo({ m, preco }: { m: Modelo; preco?: number | null }) {
  const l = linhaDe(m.linha);
  const base = `mesas/${m.slug}/`;
  const alt = m.jantarReal ? 'jantar' : m.temPar && m.slug !== 'eleganza' ? 'bilhar' : null;
  const href = rotaModelo(m.slug);
  return (
    <article className="mcard" data-linha={m.linha} data-nome={m.nome}>
      <Link className="mcard__img" href={href} tabIndex={-1} aria-hidden="true">
        <img src={img(base + 'capa-sm.webp')} alt="" loading="lazy" width={560} height={346} />
        {alt && <img className="alt" src={img(`${base}${alt}-sm.webp`)} alt="" loading="lazy" width={560} height={420} />}
        {m.novo && <span className="mcard__badge">Novo</span>}
        {m.jantarReal && <span className="mcard__hint">Versão jantar</span>}
      </Link>
      <div className="mcard__row">
        <div>
          <h3 className="mcard__name"><Link href={href}>{m.nome}</Link></h3>
          <p className="mcard__line">{l.titulo}</p>
          <p className="mcard__meta">{m.foraDoCatalogo ? 'Bilhar · Jantar' : 'Bilhar · Jantar · Tênis de mesa'}</p>
        </div>
        {preco ? <p className="mcard__price">a partir de<strong>{brl(preco)}</strong></p> : <span className="mcard__go" aria-hidden="true"><Icon n="arrow" /></span>}
      </div>
    </article>
  );
}

export function GameCard({ g, preco }: { g: Jogo; preco?: number | null }) {
  return (
    <article className="game rv">
      <div className="game__img"><img src={img(`jogos/${g.id}-sm.webp`)} alt={g.detalhe} loading="lazy" width={480} height={360} /></div>
      <h3>{g.nome}</h3>
      <p><span>{g.medida}</span>{preco ? <span>{brl(preco)}</span> : null}</p>
    </article>
  );
}

export function Incluso() {
  return (
    <ul className="incl">
      {acompanha.map((a) => <li className="rv" key={a.nome}><Icon n={a.icone} /><span>{a.nome}</span></li>)}
    </ul>
  );
}

export function CtaBand({
  titulo = <>Vamos projetar a mesa <span className="it">do seu espaço?</span></>,
  texto = 'Responda 4 perguntas rápidas e receba um atendimento personalizado do nosso time — da escolha do modelo à cor do tecido.',
  foto = 'galeria/g14.webp',
}: { titulo?: React.ReactNode; texto?: string; foto?: string }) {
  return (
    <section className="cta">
      <div className="cta__bg"><img src={img(foto)} alt="" loading="lazy" /></div>
      <div className="wrap">
        <div className="cta__in rv">
          <span className="eyebrow">Atendimento personalizado</span>
          <h2 className="h-lg">{titulo}</h2>
          <p className="lead">{texto}</p>
          <div className="cta__actions">
            <Link className="btn btn--gold" href="/orcamento/">Pedir orçamento <Icon n="arrow" /></Link>
            <a className="btn btn--ghost" href={wa()} target="_blank" rel="noopener"><Icon n="whatsapp" /> Falar no WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PageHero({ crumb, eyebrow, titulo, lead, foto }: { crumb: string; eyebrow: string; titulo: React.ReactNode; lead: string; foto: string }) {
  return (
    <section className="phero">
      <div className="phero__bg"><img src={img(foto)} alt="" /></div>
      <div className="wrap phero__in">
        <ol className="crumbs"><li><Link href="/">Início</Link></li><li>{crumb}</li></ol>
        <span className="eyebrow">{eyebrow}</span>
        <h1 className="h-xl">{titulo}</h1>
        <p className="lead">{lead}</p>
      </div>
    </section>
  );
}

export function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export const ldNegocio = {
  '@context': 'https://schema.org',
  '@type': 'FurnitureStore',
  name: config.nome,
  url: config.siteUrl,
  image: config.siteUrl + '/img/og/seletto-prime.jpg',
  logo: config.siteUrl + '/img/logo/icon-512.png',
  telephone: config.telefoneLink,
  address: { '@type': 'PostalAddress', streetAddress: config.endereco, addressLocality: config.cidade, addressRegion: config.uf, addressCountry: 'BR' },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'], opens: '08:00', closes: '17:00' },
    { '@type': 'OpeningHoursSpecification', dayOfWeek: 'Saturday', opens: '09:00', closes: '13:00' },
  ],
  sameAs: [config.instagram, config.facebook],
  areaServed: 'BR',
};

export function Passos() {
  return (
    <ol className="steps">
      <li className="step rv"><h3>Conversa</h3><p>Entendemos o seu espaço, o seu estilo e como a mesa vai ser usada no dia a dia.</p></li>
      <li className="step rv rv-d1"><h3>Projeto</h3><p>Definimos juntos o modelo, o tamanho, o acabamento e a cor do tecido.</p></li>
      <li className="step rv rv-d2"><h3>Fabricação</h3><p>Sua mesa é produzida com acabamento premium e atenção a cada detalhe.</p></li>
      <li className="step rv rv-d3"><h3>Entrega</h3><p>Enviamos para todo o Brasil e entregamos a mesa pronta para o primeiro jogo.</p></li>
    </ol>
  );
}
