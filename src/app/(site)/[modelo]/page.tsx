import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CardModelo, CtaBand, Incluso, JsonLd } from '@/components/blocos';
import { Icon } from '@/components/Icon';
import { Rail } from '@/components/interativos';
import Pdp from '@/components/Pdp';
import { precoMin, precosModelo } from '@/data/precos';
import { brl, config, espaco, feltros, fotosDe, linhaDe, modeloPorSlug, modelos, rotaModelo, usosDe, USO_NOME } from '@/data/site';
import { img } from '@/lib/paths';

/* URLs iguais às do site WordPress: /modelo-comodo/, /modelo-zeus/ ... */
export const dynamicParams = false;
export function generateStaticParams() {
  return modelos.map((m) => ({ modelo: `modelo-${m.slug}` }));
}

type Props = { params: Promise<{ modelo: string }> };
const achar = async (params: Props['params']) => modeloPorSlug((await params).modelo.replace(/^modelo-/, ''));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const m = await achar(params);
  if (!m) return {};
  const l = linhaDe(m.linha);
  return {
    title: `Mesa de Bilhar ${m.nome} — ${l.titulo}`,
    description: `${m.descricao[0]} Versão bilhar e jantar${m.foraDoCatalogo ? '' : ' e tênis de mesa'}, tamanhos de ${m.tamanhos[0].replace(' m', '')} a ${m.tamanhos[m.tamanhos.length - 1]}. Seletto Prime, Canoas/RS.`,
    alternates: { canonical: rotaModelo(m.slug) },
    openGraph: { images: [`/img/og/${m.slug}.jpg`] },
  };
}

export default async function ModeloPage({ params }: Props) {
  const m = await achar(params);
  if (!m) notFound();
  const l = linhaDe(m.linha);
  const base = `mesas/${m.slug}/`;
  const precos = precosModelo(m);
  const outros = modelos.filter((x) => x.linha === m.linha && x.slug !== m.slug);
  const usos = usosDe(m);
  const comPreco = precos.filter((p): p is number => !!p);

  return (
    <>
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'Product', name: `Mesa de Bilhar ${m.nome}`,
        brand: { '@type': 'Brand', name: config.nome }, category: 'Mesa de bilhar', description: m.descricao.join(' '),
        image: fotosDe(m).map((f) => `${config.siteUrl}/img/${base}${f.k}.webp`),
        ...(comPreco.length ? { offers: { '@type': 'AggregateOffer', priceCurrency: 'BRL', lowPrice: Math.min(...comPreco), highPrice: Math.max(...comPreco), offerCount: comPreco.length } } : {}),
      }} />
      <JsonLd data={{
        '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: config.siteUrl + '/' },
          { '@type': 'ListItem', position: 2, name: 'Catálogo', item: config.siteUrl + '/catalogo/' },
          { '@type': 'ListItem', position: 3, name: m.nome, item: config.siteUrl + rotaModelo(m.slug) },
        ],
      }} />

      <section className="pdp">
        <div className="wrap">
          <ol className="crumbs crumbs--light">
            <li><Link href="/">Início</Link></li><li><Link href="/catalogo/">Catálogo</Link></li>
            <li><Link href={`/catalogo/#${l.id}`}>{l.titulo}</Link></li><li aria-current="page">{m.nome}</li>
          </ol>
          <Pdp m={m} precos={precos} />
        </div>
      </section>

      <section className="sec">
        <div className="wrap feat">
          <div className="feat__text rv">
            <span className="eyebrow">Sobre o modelo</span>
            <h2 className="h-md">O design <span className="it">em detalhes</span></h2>
            {m.descricao.slice(1).map((p) => <p key={p.slice(0, 20)}>{p}</p>)}
          </div>
          <div className="rv rv-d1">
            <table className="specs">
              <caption>Ficha técnica</caption>
              <tbody>
                <tr><th scope="row">Linha</th><td>{l.titulo}</td></tr>
                <tr><th scope="row">Funções</th><td>{usos.map((u) => USO_NOME[u]).join(' · ')}</td></tr>
                <tr><th scope="row">Tampo</th><td>Multiuso, no mesmo material e acabamento da mesa</td></tr>
                <tr><th scope="row">Tecido do jogo</th><td>Acrílico ou lã — {feltros.length} cores</td></tr>
                <tr><th scope="row">Entrega</th><td>Para todo o Brasil</td></tr>
              </tbody>
            </table>
            <table className="specs mt-m">
              <caption>Medidas</caption>
              <tbody>
                {m.tamanhos.map((t, i) => (
                  <tr key={t}><th scope="row">{t}</th><td>Espaço ideal ≈ {espaco(t)}</td>{comPreco.length ? <td className="num">{precos[i] ? brl(precos[i]!) : 'Sob consulta'}</td> : null}</tr>
                ))}
              </tbody>
            </table>
            <p className="pdp__note mt-s">Espaço ideal calculado para jogar com tacos de 1,45 m em todos os lados. Para ambientes menores, consulte nosso time sobre tacos mais curtos.</p>
          </div>
        </div>
      </section>

      {m.jantarReal && (
        <section className="sec white">
          <div className="wrap">
            <div className="sec-head sec-head--split">
              <div><span className="eyebrow rv">3 em 1</span><h2 className="h-lg mt-s rv">Uma mesa, <span className="it">duas</span> versões</h2></div>
              <p className="lead rv">Com o tampo multiuso, a {m.nome} passa de mesa de bilhar a mesa de jantar em instantes — sem perder o padrão do design.</p>
            </div>
            <div className="pairs">
              <figure className="rv"><img src={img(base + 'bilhar.webp')} alt={`Mesa ${m.nome} na versão bilhar`} loading="lazy" /><figcaption>Versão bilhar</figcaption></figure>
              <figure className="rv rv-d1"><img src={img(base + 'jantar.webp')} alt={`Mesa ${m.nome} na versão jantar`} loading="lazy" /><figcaption>Versão jantar</figcaption></figure>
            </div>
          </div>
        </section>
      )}

      <section className="sec sec--tight dark">
        <div className="wrap">
          <div className="tiles">
            <div className="tile rv"><Icon n="tampo" /><h3>Tampo multiuso</h3><p>Feito com o mesmo material e acabamento da mesa, para um padrão de design impecável.</p></div>
            <div className="tile rv rv-d1"><Icon n="palette" /><h3>Personalize o tecido</h3><p>Escolha entre {feltros.length} cores, em tecido acrílico ou lã, para harmonizar com a sua decoração.</p></div>
            <div className="tile rv rv-d2"><Icon n="truck" /><h3>Receba em casa</h3><p>Enviamos para todo o Brasil, com acompanhamento do nosso time em cada etapa.</p></div>
          </div>
        </div>
      </section>

      <section className="sec sec--tight">
        <div className="wrap">
          <div className="sec-head sec-head--center">
            <span className="eyebrow rv">Acompanhamento</span>
            <h2 className="h-md rv">Sua {m.nome} chega <span className="it">completa</span></h2>
          </div>
          <Incluso />
        </div>
      </section>

      <section className="sec white" aria-label="Outros modelos">
        <div className="wrap">
          <Rail eyebrow={l.titulo} label="Outros modelos" titulo={<>Outros modelos <span className="it">da linha</span></>}>
            {outros.map((x) => <CardModelo key={x.slug} m={x} preco={precoMin(x)} />)}
          </Rail>
        </div>
      </section>
      <CtaBand titulo={<>Gostou da <span className="it">{m.nome}?</span></>} texto="Responda 4 perguntas rápidas e receba um orçamento personalizado com o tamanho, o acabamento e a cor de tecido ideais para o seu espaço." foto={base + 'capa.webp'} />
    </>
  );
}
