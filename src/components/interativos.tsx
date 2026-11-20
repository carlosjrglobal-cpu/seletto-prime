'use client';
import { useEffect, useRef, useState } from 'react';
import { img } from '@/lib/paths';
import { Icon } from './Icon';

const reduzido = () => typeof window !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Hero com slideshow ---------- */
export function Hero({ fotos, texto, rodape }: { fotos: string[]; texto: React.ReactNode; rodape: React.ReactNode }) {
  const [i, setI] = useState(0);
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (reduzido()) return;
    const t = setInterval(() => { if (!document.hidden) setI((n) => (n + 1) % fotos.length); }, 6500);
    return () => clearInterval(t);
  }, [fotos.length, tick]);
  return (
    <section className="hero" aria-label="Destaque">
      <div className="hero__media" aria-hidden="true">
        {fotos.map((f, n) => (
          <div key={f} className={`hero__slide${n === i ? ' is-on' : ''}`}>
            <img src={img(f)} alt="" width={1050} height={1400} {...(n === 0 ? { fetchPriority: 'high' as const } : { loading: n === (i + 1) % fotos.length ? ('eager' as const) : ('lazy' as const) })} />
          </div>
        ))}
      </div>
      <div className="wrap hero__body">
        <div className="hero__text">
          {texto}
          <div className="hero__ctrl">
            <div className="hero__dots" role="tablist" aria-label="Fotos em destaque">
              {fotos.map((f, k) => (
                <button key={f + (k === i ? tick : '')} type="button" role="tab" aria-label={`Foto ${k + 1}`} aria-selected={k === i} className={k === i ? 'is-on' : ''} onClick={() => { setI(k); setTick((t) => t + 1); }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      {rodape}
    </section>
  );
}

/* ---------- Comparador bilhar × jantar ---------- */
export function Compare({ antes, depois, altAntes, altDepois }: { antes: string; depois: string; altAntes: string; altDepois: string }) {
  const [pos, setPos] = useState(50);
  const ref = useRef<HTMLDivElement>(null);
  const tocou = useRef(false);
  useEffect(() => {
    if (reduzido() || !ref.current) return;
    const el = ref.current;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return;
      io.disconnect();
      const seq = [50, 28, 72, 50];
      const dur = 900;
      let k = 0;
      let t0 = 0;
      const step = (now: number) => {
        if (tocou.current) return;
        if (!t0) t0 = now;
        const p = Math.min(1, (now - t0 - k * dur) / dur);
        const e = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
        setPos(seq[k] + (seq[k + 1] - seq[k]) * Math.max(0, e));
        if (p >= 1) k++;
        if (k < seq.length - 1) requestAnimationFrame(step);
      };
      setTimeout(() => requestAnimationFrame(step), 500);
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div className="compare" ref={ref} style={{ '--pos': pos + '%' } as React.CSSProperties}>
      <img src={img(depois)} alt={altDepois} loading="lazy" width={777} height={518} />
      <img className="compare__top" src={img(antes)} alt={altAntes} loading="lazy" width={777} height={518} />
      <span className="compare__bar" />
      <span className="compare__knob"><Icon n="swap" /></span>
      <span className="compare__tag compare__tag--l">Bilhar</span>
      <span className="compare__tag compare__tag--r">Jantar</span>
      <input type="range" min={0} max={100} value={Math.round(pos)} aria-label="Arraste para comparar a versão bilhar e a versão jantar"
        onPointerDown={() => { tocou.current = true; }}
        onChange={(e) => { tocou.current = true; setPos(+e.target.value); }} />
    </div>
  );
}

/* ---------- Carrossel horizontal ---------- */
export function Rail({ titulo, eyebrow, label, children }: { titulo: React.ReactNode; eyebrow: string; label: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [st, setSt] = useState({ prev: false, next: true, w: 20, x: 0, show: true });
  useEffect(() => {
    const r = ref.current!;
    const upd = () => {
      const max = r.scrollWidth - r.clientWidth;
      const w = Math.max(8, (r.clientWidth / r.scrollWidth) * 100);
      setSt({ prev: r.scrollLeft > 4, next: r.scrollLeft < max - 4, w, x: max > 0 ? (r.scrollLeft / max) * ((100 - w) / w) * 100 : 0, show: max > 4 });
    };
    upd();
    r.addEventListener('scroll', upd, { passive: true });
    window.addEventListener('resize', upd);
    return () => { r.removeEventListener('scroll', upd); window.removeEventListener('resize', upd); };
  }, []);
  const mover = (d: number) => {
    const r = ref.current!;
    const card = (r.firstElementChild?.getBoundingClientRect().width || 300) + 24;
    r.scrollBy({ left: card * d, behavior: reduzido() ? 'auto' : 'smooth' });
  };
  return (
    <>
      <div className="rail-head">
        <div><span className="eyebrow">{eyebrow}</span><h2 className="h-lg mt-s">{titulo}</h2></div>
        <div className="rail-nav" style={{ visibility: st.show ? undefined : 'hidden' }}>
          <button type="button" disabled={!st.prev} aria-label="Anteriores" onClick={() => mover(-1)}><Icon n="arrowL" /></button>
          <button type="button" disabled={!st.next} aria-label="Próximos" onClick={() => mover(1)}><Icon n="arrow" /></button>
        </div>
      </div>
      <div className="rail" ref={ref} tabIndex={0} aria-label={label}>{children}</div>
      <div className="rail-progress"><span style={{ width: st.w + '%', transform: `translateX(${st.x}%)` }} /></div>
    </>
  );
}

/* ---------- Grupo de opções (chips / amostras) com teclado ---------- */
export type Opcao = { value: string; label?: React.ReactNode; title?: string; style?: React.CSSProperties; sub?: string };
export function Opcoes({ opcoes, valor, onChange, className, labelledBy, item = 'chip' }: {
  opcoes: Opcao[]; valor: string | null; onChange: (v: string) => void; className: string; labelledBy: string; item?: 'chip' | 'sw';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const idx = opcoes.findIndex((o) => o.value === valor);
  const key = (e: React.KeyboardEvent) => {
    const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key];
    if (!d) return;
    e.preventDefault();
    const n = (Math.max(idx, 0) + d + opcoes.length) % opcoes.length;
    onChange(opcoes[n].value);
    (ref.current?.children[n] as HTMLElement)?.focus();
  };
  return (
    <div className={className} role="radiogroup" aria-labelledby={labelledBy} ref={ref} onKeyDown={key}>
      {opcoes.map((o, n) => (
        <button key={o.value} type="button" className={item} role="radio" aria-checked={o.value === valor}
          tabIndex={o.value === valor || (idx < 0 && n === 0) ? 0 : -1}
          title={o.title} aria-label={o.title} style={o.style} onClick={() => onChange(o.value)}>
          {o.label}{o.sub && <small>{o.sub}</small>}
        </button>
      ))}
    </div>
  );
}
