'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { config, linhas, modelosDa, rotaModelo, wa } from '@/data/site';
import { img } from '@/lib/paths';
import { Icon, Logo } from './Icon';

export default function Header() {
  const path = usePathname();
  const home = path === '/';
  const [solid, setSolid] = useState(!home);
  const [mega, setMega] = useState(false);
  const [mnav, setMnav] = useState(false);
  const megaRef = useRef<HTMLLIElement>(null);
  const burgerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMega(false);
    setMnav(false);
    if (!home) { setSolid(true); return; }
    const on = () => setSolid(window.scrollY > 40);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [home, path]);

  useEffect(() => {
    const out = (e: MouseEvent) => { if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMega(false); };
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMega(false); setMnav(false); } };
    document.addEventListener('click', out);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('click', out); document.removeEventListener('keydown', esc); };
  }, []);

  useEffect(() => { document.body.style.overflow = mnav ? 'hidden' : ''; }, [mnav]);

  const ativo = (p: string) => (path.startsWith(p) ? 'page' : undefined);
  const emMesa = path.startsWith('/modelo-');

  return (
    <>
      <header className={`hdr${solid ? ' is-solid' : ''}`}>
        <div className="wrap hdr__in">
          <Link className="hdr__logo" href="/" aria-label="Seletto Prime — página inicial"><Logo /></Link>
          <nav aria-label="Principal">
            <ul className="nav">
              <li className={`has-mega${mega ? ' is-open' : ''}`} ref={megaRef} onMouseLeave={() => setMega(false)}>
                <button className="nav__a" type="button" aria-expanded={mega} aria-controls="mega" aria-current={emMesa ? 'page' : undefined} onClick={(e) => { e.stopPropagation(); setMega(!mega); }}>
                  Mesas <Icon n="chevron" />
                </button>
                <div className="mega" id="mega">
                  <div className="wrap mega__in">
                    {linhas.map((l) => (
                      <div className="mega__col" key={l.id}>
                        <h3>{l.titulo} <span>{modelosDa(l.id).length}</span></h3>
                        <ul>{modelosDa(l.id).map((m) => <li key={m.slug}><Link href={rotaModelo(m.slug)}>{m.nome}</Link></li>)}</ul>
                      </div>
                    ))}
                    <Link className="mega__feat" href="/catalogo/">
                      <img src={img('catalogo-capa-sm.webp')} alt="" loading="lazy" width={640} height={453} />
                      <span>Ver catálogo completo <Icon n="arrow" /></span>
                    </Link>
                  </div>
                </div>
              </li>
              <li><Link className="nav__a" href="/catalogo/" aria-current={ativo('/catalogo')}>Catálogo</Link></li>
              <li><Link className="nav__a" href="/#tres-em-um">3 em 1</Link></li>
              <li><Link className="nav__a" href="/galeria/" aria-current={ativo('/galeria')}>Galeria</Link></li>
              <li><Link className="nav__a" href="/sobre/" aria-current={ativo('/sobre')}>Sobre</Link></li>
              <li><Link className="nav__a" href="/contato/" aria-current={ativo('/contato')}>Contato</Link></li>
            </ul>
          </nav>
          <Link className="btn btn--gold btn--sm hdr__cta" href="/orcamento/">Orçamento <Icon n="arrow" /></Link>
          <button ref={burgerRef} className="hdr__burger" type="button" aria-label="Abrir menu" aria-controls="mnav" aria-expanded={mnav} onClick={() => setMnav(true)}>
            <Icon n="menu" />
          </button>
        </div>
      </header>

      <div className={`mnav${mnav ? ' is-open' : ''}`} id="mnav" role="dialog" aria-modal="true" aria-label="Menu">
        <div className="wrap">
          <div className="mnav__top">
            <Link className="hdr__logo" href="/" aria-label="Seletto Prime — página inicial"><Logo /></Link>
            <button className="mnav__close" type="button" aria-label="Fechar menu" onClick={() => { setMnav(false); burgerRef.current?.focus(); }}><Icon n="close" /></button>
          </div>
          <ul className="mnav__list">
            <li>
              <details>
                <summary>Mesas <Icon n="chevron" /></summary>
                <div className="mnav__sub">
                  {linhas.map((l) => (
                    <div key={l.id}><h4>{l.titulo}</h4><ul>{modelosDa(l.id).map((m) => <li key={m.slug}><Link href={rotaModelo(m.slug)}>{m.nome}</Link></li>)}</ul></div>
                  ))}
                </div>
              </details>
            </li>
            <li><Link href="/catalogo/">Catálogo <Icon n="arrow" /></Link></li>
            <li><Link href="/orcamento/">Orçamento <Icon n="arrow" /></Link></li>
            <li><Link href="/#tres-em-um">3 em 1 <Icon n="arrow" /></Link></li>
            <li><Link href="/galeria/">Galeria <Icon n="arrow" /></Link></li>
            <li><Link href="/sobre/">Sobre <Icon n="arrow" /></Link></li>
            <li><Link href="/contato/">Contato <Icon n="arrow" /></Link></li>
          </ul>
          <div className="mnav__foot">
            <a className="btn btn--wa btn--block" href={wa()} target="_blank" rel="noopener"><Icon n="whatsapp" /> Falar no WhatsApp</a>
            <a className="btn btn--ghost btn--block" href={`tel:${config.telefoneLink}`}><Icon n="phone" /> {config.telefone}</a>
          </div>
        </div>
      </div>
    </>
  );
}
