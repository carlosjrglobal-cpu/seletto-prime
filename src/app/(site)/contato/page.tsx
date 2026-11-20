import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd, ldNegocio, PageHero } from '@/components/blocos';
import ContatoForm from '@/components/ContatoForm';
import { Icon } from '@/components/Icon';
import { config, wa } from '@/data/site';

export const metadata: Metadata = {
  title: 'Contato — Canoas/RS',
  description: `Fale com a Seletto Prime: WhatsApp ${config.whatsappExibicao}. ${config.endereco}, ${config.cidade}/${config.uf}.`,
  alternates: { canonical: '/contato/' },
};

export default function Contato() {
  const mapa = encodeURIComponent(`${config.endereco}, ${config.cidade} - ${config.uf}`);
  return (
    <>
      <JsonLd data={ldNegocio} />
      <PageHero crumb="Contato" eyebrow="Contato" foto="galeria/g09.webp" titulo={<>Vamos falar <span className="it">da sua mesa</span></>}
        lead="Quer um atendimento personalizado? Fale com o nosso time comercial." />
      <section className="sec">
        <div className="wrap contact">
          <div>
            <ul className="cinfo">
              <li><span className="cinfo__ic"><Icon n="layers" /></span><div><h3>Orçamento</h3><Link href="/orcamento/">Responder 4 perguntas rápidas</Link></div></li>
              <li><span className="cinfo__ic"><Icon n="whatsapp" /></span><div><h3>WhatsApp e telefone</h3><a href={wa()} target="_blank" rel="noopener">{config.whatsappExibicao}</a></div></li>
              <li><span className="cinfo__ic"><Icon n="pin" /></span><div><h3>Endereço</h3><p>{config.endereco}<br />{config.cidade} – {config.uf}</p>
                <a className="link-arrow mt-s" style={{ fontSize: 12 }} href={`https://www.google.com/maps/search/?api=1&query=${mapa}`} target="_blank" rel="noopener">Como chegar <Icon n="arrow" /></a></div></li>
              <li><span className="cinfo__ic"><Icon n="clock" /></span><div><h3>Funcionamento</h3><p>{config.horarios.map(([a, b]) => <span key={a}>{a}: {b}<br /></span>)}</p></div></li>
              <li><span className="cinfo__ic"><Icon n="instagram" /></span><div><h3>Instagram</h3><a href={config.instagram} target="_blank" rel="noopener">{config.instagramUsuario}</a></div></li>
            </ul>
          </div>
          <ContatoForm />
        </div>
      </section>
      <iframe className="map" title={`Mapa: ${config.endereco}, ${config.cidade}`} src={`https://www.google.com/maps?q=${mapa}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
    </>
  );
}
