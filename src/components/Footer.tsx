import Link from 'next/link';
import { config, linhas, wa } from '@/data/site';
import { Icon, Logo } from './Icon';

export default function Footer() {
  return (
    <>
      <footer className="ftr">
        <div className="wrap ftr__top">
          <div className="ftr__brand">
            <Link className="hdr__logo" href="/" aria-label="Seletto Prime — página inicial"><Logo /></Link>
            <p>Mesas de jogos com design exclusivo. Bilhar, jantar e tênis de mesa em uma única peça, do conceito à instalação.</p>
            <div className="ftr__social">
              <a href={config.instagram} target="_blank" rel="noopener" aria-label="Instagram"><Icon n="instagram" /></a>
              <a href={config.facebook} target="_blank" rel="noopener" aria-label="Facebook"><Icon n="facebook" /></a>
              <a href={wa()} target="_blank" rel="noopener" aria-label="WhatsApp"><Icon n="whatsapp" /></a>
            </div>
          </div>
          <div>
            <h4>Coleção</h4>
            <ul>
              {linhas.map((l) => <li key={l.id}><Link href={`/catalogo/#${l.id}`}>{l.titulo}</Link></li>)}
              <li><Link href="/catalogo/#jogos">Outras opções de jogos</Link></li>
              <li><Link href="/catalogo/#acessorios">Acessórios</Link></li>
              <li><Link href="/orcamento/">Pedir orçamento</Link></li>
            </ul>
          </div>
          <div>
            <h4>Contato</h4>
            <ul className="ftr__contact">
              <li><Icon n="pin" /><span>{config.endereco}<br />{config.cidade} – {config.uf}</span></li>
              <li><Icon n="phone" /><a href={`tel:${config.telefoneLink}`}>{config.telefone}</a></li>
              <li><Icon n="whatsapp" /><a href={wa()} target="_blank" rel="noopener">{config.whatsappExibicao}</a></li>
            </ul>
          </div>
          <div>
            <h4>Funcionamento</h4>
            <ul className="ftr__contact">
              {config.horarios.map(([dia, h]) => <li key={dia}><Icon n="clock" /><span>{dia}<br />{h}</span></li>)}
            </ul>
          </div>
        </div>
        <div className="ftr__line">
          <div className="wrap ftr__bot">
            <span>© {new Date().getFullYear()} {config.nome}. Todos os direitos reservados.</span>
            <span><Link href="/privacidade/">Política de privacidade</Link> · Enviamos para todo o Brasil</span>
          </div>
        </div>
      </footer>
      <a className="wa-float" href={wa()} target="_blank" rel="noopener" aria-label="Fale conosco pelo WhatsApp"><Icon n="whatsapp" /><span>Fale conosco</span></a>
    </>
  );
}
