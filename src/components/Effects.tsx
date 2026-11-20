'use client';
/* Efeitos globais do site: revelação ao rolar (.rv) e lightbox (a[data-lb]).
   Roda a cada troca de página (navegação do Next não recarrega a página). */
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { capturarOrigem } from '@/lib/leads';
import { Icon } from './Icon';

export default function Effects() {
  const path = usePathname();
  const [items, setItems] = useState<{ src: string; alt: string }[]>([]);
  const [i, setI] = useState(-1);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lastFocus = useRef<Element | null>(null);

  // origem da visita (UTM / id de clique) para atribuir o lead ao anúncio
  useEffect(() => { capturarOrigem(); }, []);

  // reveal
  useEffect(() => {
    const doc = document.documentElement;
    doc.classList.add('js', 'js-ready');
    const els = Array.from(document.querySelectorAll('.rv:not(.in)'));
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!('IntersectionObserver' in window) || reduce) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [path]);

  // lightbox
  useEffect(() => {
    const abrir = (grupo: string, idx: number) => {
      const as = Array.from(document.querySelectorAll<HTMLAnchorElement>(`a[data-lb="${grupo}"]`));
      if (!as.length) return;
      lastFocus.current = document.activeElement;
      setItems(as.map((a) => ({ src: a.getAttribute('href') || '', alt: a.querySelector('img')?.alt || a.dataset.alt || '' })));
      setI(Math.max(0, idx));
    };
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.('a[data-lb]') as HTMLAnchorElement | null;
      if (!a || a.hidden) return;
      e.preventDefault();
      const g = a.dataset.lb!;
      abrir(g, Array.from(document.querySelectorAll(`a[data-lb="${g}"]`)).indexOf(a));
    };
    const onOpen = (e: Event) => { const d = (e as CustomEvent).detail; abrir(d.grupo, d.idx); };
    document.addEventListener('click', onClick);
    window.addEventListener('lightbox', onOpen);
    return () => { document.removeEventListener('click', onClick); window.removeEventListener('lightbox', onOpen); };
  }, []);

  const open = i >= 0 && items.length > 0;
  const go = (n: number) => setI((n + items.length) % items.length);
  const close = () => { setI(-1); (lastFocus.current as HTMLElement | null)?.focus?.(); };

  useEffect(() => {
    if (!open) { document.body.style.overflow = ''; return; }
    document.body.style.overflow = 'hidden';
    closeRef.current?.focus();
    const k = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowRight') go(i + 1);
      if (e.key === 'ArrowLeft') go(i - 1);
    };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  });

  const x0 = useRef<number | null>(null);
  return (
    <div
      className={`lb${open ? ' is-open' : ''}`}
      role="dialog" aria-modal="true" aria-label="Foto ampliada" aria-hidden={!open}
      onClick={(e) => { if (e.target === e.currentTarget) close(); }}
      onTouchStart={(e) => { x0.current = e.touches[0].clientX; }}
      onTouchEnd={(e) => { if (x0.current == null) return; const dx = e.changedTouches[0].clientX - x0.current; if (Math.abs(dx) > 40) go(i + (dx < 0 ? 1 : -1)); x0.current = null; }}
    >
      {open && <img className="lb__img" src={items[i].src} alt={items[i].alt} />}
      <button ref={closeRef} className="lb__btn lb__close" type="button" aria-label="Fechar" onClick={close}><Icon n="close" /></button>
      {items.length > 1 && <>
        <button className="lb__btn lb__prev" type="button" aria-label="Foto anterior" onClick={() => go(i - 1)}><Icon n="arrowL" /></button>
        <button className="lb__btn lb__next" type="button" aria-label="Próxima foto" onClick={() => go(i + 1)}><Icon n="arrow" /></button>
      </>}
      {open && <p className="lb__count" aria-live="polite">{i + 1} / {items.length}</p>}
    </div>
  );
}
