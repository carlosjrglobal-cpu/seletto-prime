'use client';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { ACABAMENTOS, feltros, tecidos, wa } from '@/data/site';
import { img } from '@/lib/paths';
import { Icon } from './Icon';
import { Opcoes } from './interativos';

const sombra = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (c: number) => Math.round(c * k);
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

/* Elementos fixos da mesa (veios, bolas, diamantes), calculados uma vez. */
function geometria() {
  let seed = 7;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  const veios = Array.from({ length: 46 }, (_, i) => {
    const y = 4 + i * 10 + rnd() * 4; const a = rnd() * 6 - 3; const b = rnd() * 6 - 3;
    return { d: `M0 ${y.toFixed(1)} C 200 ${(y + a).toFixed(1)}, 520 ${(y + b).toFixed(1)}, 800 ${(y + a / 2).toFixed(1)}`, w: (0.6 + rnd() * 1.4).toFixed(2) };
  });
  const cores = ['#f2c200', '#1d4fb8', '#c8102e', '#5b2a86', '#f26a1b', '#0b7a3b', '#7a1e1e', '#111111', '#f2c200', '#1d4fb8', '#c8102e', '#5b2a86', '#f26a1b', '#0b7a3b', '#7a1e1e'];
  const ordem = [0, 9, 1, 10, 7, 2, 11, 3, 12, 4, 13, 5, 14, 6, 8];
  const bolas: { cx: number; cy: number; cor: string; listra: boolean; k: number }[] = [];
  let k = 0;
  for (let row = 0; row < 5; row++) for (let j = 0; j <= row; j++) {
    const n = ordem[k++];
    bolas.push({ cx: 548 + row * 17.6, cy: 230 - row * 10.2 + j * 20.4, cor: cores[n], listra: n >= 8, k });
  }
  const dia: [number, number][] = [];
  [1, 2, 3, 5, 6, 7].forEach((i) => { const x = 60 + (680 * i) / 8; dia.push([x, 22], [x, 438]); });
  [1, 2, 3].forEach((i) => { const y = 60 + (340 * i) / 4; dia.push([22, y], [778, y]); });
  return { veios, bolas, dia };
}

export default function Configurador() {
  const [feltro, setFeltro] = useState('Verde');
  const [acab, setAcab] = useState('Madeira clara');
  const [tecido, setTecido] = useState(tecidos[0]);
  const g = useMemo(geometria, []);
  const f = feltros.find((x) => x.nome === feltro)!;
  const a = ACABAMENTOS.find((x) => x.nome === acab)!;
  const claro = ['#ece9e3', '#d3c4ab'].includes(a.hex);
  const msg = `Olá! Vim do site e montei esta combinação:\n• Cor do feltro: ${feltro}\n• Acabamento: ${acab}\n• ${tecido}\nGostaria de ajuda para escolher o modelo e receber um orçamento.`;
  const pockets: [number, number][] = [[52, 52], [400, 46], [748, 52], [52, 408], [400, 414], [748, 408]];

  return (
    <div className="wrap cfg" id="cfg">
      <div className="rv">
        <div className="cfg__stage">
          <svg viewBox="0 0 800 460" role="img" aria-label={`Simulação da mesa com feltro ${feltro} e acabamento ${acab}`}>
            <defs>
              <radialGradient id="luz" cx="50%" cy="48%" r="62%"><stop offset="0" stopColor="#fff" stopOpacity=".16" /><stop offset=".55" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".38" /></radialGradient>
              <linearGradient id="brilho" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#fff" stopOpacity=".22" /><stop offset=".45" stopColor="#fff" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity=".28" /></linearGradient>
              <radialGradient id="ballHi" cx="35%" cy="32%" r="70%"><stop offset="0" stopColor="#fff" stopOpacity=".75" /><stop offset=".25" stopColor="#fff" stopOpacity=".12" /><stop offset="1" stopColor="#000" stopOpacity=".35" /></radialGradient>
              <radialGradient id="pocket" cx="50%" cy="50%" r="50%"><stop offset=".55" stopColor="#050505" /><stop offset="1" stopColor="#1c1c1c" /></radialGradient>
              <filter id="grao" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves={3} seed={4} /><feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .32 0" /></filter>
              <clipPath id="aro"><path fillRule="evenodd" d="M22 0h756a22 22 0 0 1 22 22v416a22 22 0 0 1-22 22H22A22 22 0 0 1 0 438V22A22 22 0 0 1 22 0zM44 44v372h712V44z" /></clipPath>
              {g.bolas.filter((b) => b.listra).map((b) => <clipPath key={b.k} id={`bc${b.k}`}><circle cx={b.cx} cy={b.cy} r="10" /></clipPath>)}
            </defs>
            <rect className="cfg__frame" width="800" height="460" rx="22" fill={a.hex} />
            <g clipPath="url(#aro)" stroke="#000" fill="none" opacity={a.madeira ? 0.22 : 0}>
              {g.veios.map((v, i) => <path key={i} d={v.d} strokeWidth={v.w} />)}
            </g>
            <rect width="800" height="460" rx="22" fill="url(#brilho)" />
            <rect className="cfg__cushion" x="40" y="40" width="720" height="380" rx="5" fill={sombra(f.hex, 0.72)} />
            <rect className="cfg__felt" x="58" y="58" width="684" height="344" fill={f.hex} />
            <rect x="58" y="58" width="684" height="344" filter="url(#grao)" />
            <rect x="40" y="40" width="720" height="380" rx="5" fill="url(#luz)" />
            <path d="M230 58V402" stroke="#fff" strokeOpacity=".16" strokeWidth="1.5" />
            <circle cx="230" cy="230" r="2.6" fill="#fff" fillOpacity=".45" />
            <circle cx="548" cy="230" r="2.6" fill="#fff" fillOpacity=".45" />
            {pockets.map(([x, y]) => <circle key={x + '-' + y} cx={x} cy={y} r="21" fill="url(#pocket)" />)}
            <g fill={claro ? '#8a7650' : '#d9c08a'}>{g.dia.map(([x, y]) => <path key={x + '-' + y} d={`M${x} ${y - 4}l4 4-4 4-4-4z`} />)}</g>
            {g.bolas.map((b) => (
              <g key={b.k}>
                <circle cx={b.cx} cy={b.cy + 2} r="10" fill="#000" opacity=".35" />
                <circle cx={b.cx} cy={b.cy} r="10" fill={b.listra ? '#f4f1ea' : b.cor} />
                {b.listra && <rect x={b.cx - 10} y={b.cy - 5} width="20" height="10" fill={b.cor} clipPath={`url(#bc${b.k})`} />}
                <circle cx={b.cx} cy={b.cy} r="10" fill="url(#ballHi)" />
              </g>
            ))}
            <g><circle cx="230" cy="232" r="10" fill="#000" opacity=".35" /><circle cx="230" cy="230" r="10" fill="#f7f5ef" /><circle cx="230" cy="230" r="10" fill="url(#ballHi)" /></g>
            <g opacity=".95">
              <path d="M24 352 L214 236" stroke="#000" strokeOpacity=".35" strokeWidth="9" strokeLinecap="round" transform="translate(3 5)" />
              <path d="M24 352 L120 293" stroke="#2a1a10" strokeWidth="9" strokeLinecap="round" />
              <path d="M120 293 L212 237" stroke="#d9b98a" strokeWidth="6" strokeLinecap="round" />
              <path d="M212 237 L216 234.5" stroke="#3a6ea5" strokeWidth="5" strokeLinecap="round" />
            </g>
          </svg>
          <span className="cfg__note">Simulação ilustrativa</span>
        </div>
      </div>
      <div>
        <span className="eyebrow rv">Personalize</span>
        <h2 className="h-lg mt-s rv">A cor certa <span className="it">para o seu</span> ambiente</h2>
        <p className="lead mt-s rv">A elegância mora nos detalhes que você escolhe. Combine a cor do tecido e o acabamento para harmonizar com a sua decoração — e envie a sua combinação para o nosso time.</p>
        <div className="mt-m">
          <div className="opt">
            <div className="opt__label" id="lbl-feltro">Cor do feltro <output>{feltro}</output></div>
            <Opcoes className="swatches" item="sw" labelledBy="lbl-feltro" valor={feltro} onChange={setFeltro}
              opcoes={feltros.map((x) => ({ value: x.nome, title: x.nome, style: { backgroundImage: `url(${img(`feltros/${x.id}.webp`)})`, backgroundColor: x.hex } }))} />
          </div>
          <div className="opt">
            <div className="opt__label" id="lbl-acab">Acabamento <output>{acab}</output></div>
            <Opcoes className="swatches frames" item="sw" labelledBy="lbl-acab" valor={acab} onChange={setAcab}
              opcoes={ACABAMENTOS.map((x) => ({ value: x.nome, title: x.nome, style: { background: x.madeira ? `repeating-linear-gradient(100deg, ${x.hex} 0 5px, rgba(0,0,0,.18) 5px 6px, ${x.hex} 6px 11px)` : x.hex } }))} />
          </div>
          <div className="opt">
            <div className="opt__label" id="lbl-tec">Tecido do jogo</div>
            <Opcoes className="chips" labelledBy="lbl-tec" valor={tecido} onChange={setTecido} opcoes={tecidos.map((t) => ({ value: t, label: t }))} />
          </div>
          <div className="flex-c mt-s" style={{ justifyContent: 'flex-start' }}>
            <a className="btn btn--gold" href={wa(msg)} target="_blank" rel="noopener"><Icon n="whatsapp" /> Enviar minha combinação</a>
            <Link className="btn btn--ghost" href="/orcamento/">Pedir orçamento <Icon n="arrow" /></Link>
          </div>
        </div>
      </div>
    </div>
  );
}
