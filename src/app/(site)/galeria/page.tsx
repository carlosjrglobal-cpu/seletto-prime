import type { Metadata } from 'next';
import { CtaBand, PageHero } from '@/components/blocos';
import { Icon } from '@/components/Icon';
import { config, galeria, modelos } from '@/data/site';
import { img } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Galeria de mesas de bilhar',
  description: 'Fotos de mesas de bilhar Seletto Prime em ambientes reais, nas versões bilhar e jantar.',
  alternates: { canonical: '/galeria/' },
};

type Foto = { src: string; sm: string; w: number; h: number; alt: string };

export default function Galeria() {
  const projetos: Foto[] = galeria.map(([id, w, h]) => ({ src: `galeria/${id}.webp`, sm: `galeria/${id}-sm.webp`, w, h, alt: 'Mesa de bilhar Seletto Prime instalada em ambiente residencial' }));
  const pares: Foto[] = modelos.filter((m) => m.temPar).flatMap((m) => {
    const o: Foto[] = [];
    if (m.slug !== 'eleganza') o.push({ src: `mesas/${m.slug}/bilhar.webp`, sm: `mesas/${m.slug}/bilhar-sm.webp`, w: 4, h: 3, alt: `Mesa ${m.nome} na versão bilhar` });
    o.push({ src: `mesas/${m.slug}/jantar.webp`, sm: `mesas/${m.slug}/jantar-sm.webp`, w: 4, h: 3, alt: m.jantarReal ? `Mesa ${m.nome} na versão jantar` : `Mesa ${m.nome}` });
    return o;
  });
  const todas: Foto[] = [];
  for (let i = 0; i < Math.max(projetos.length, pares.length); i++) {
    if (projetos[i]) todas.push(projetos[i]);
    if (pares[i * 2]) todas.push(pares[i * 2]);
    if (pares[i * 2 + 1]) todas.push(pares[i * 2 + 1]);
  }
  return (
    <>
      <PageHero crumb="Galeria" eyebrow="Galeria de fotos" foto="galeria/g13.webp" titulo={<>Projetos <span className="it">que inspiram</span></>}
        lead="Mesas Seletto em ambientes reais — nas versões bilhar e jantar. Toque nas fotos para ampliar." />
      <section className="sec">
        <div className="wrap">
          <div className="masonry">
            {todas.map((f) => (
              <a key={f.src} className="rv" href={img(f.src)} data-lb="galeria">
                <img src={img(f.sm)} alt={f.alt} loading="lazy" width={f.w} height={f.h} />
                <span className="zoom"><Icon n="expand" /></span>
              </a>
            ))}
          </div>
          <div className="mt-l center">
            <p className="lead" style={{ marginInline: 'auto' }}>Acompanhe novos projetos no nosso Instagram.</p>
            <div className="flex-c mt-s"><a className="btn btn--line" href={config.instagram} target="_blank" rel="noopener"><Icon n="instagram" /> {config.instagramUsuario}</a></div>
          </div>
        </div>
      </section>
      <CtaBand foto="galeria/g05.webp" />
    </>
  );
}
