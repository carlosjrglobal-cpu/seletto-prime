'use client';
import Link from 'next/link';
import { useState } from 'react';
import { brl, config, feltros, fotosDe, linhaDe, tecidos, usosDe, USO_NOME, wa, type Modelo } from '@/data/site';
import { img } from '@/lib/paths';
import { Icon } from './Icon';
import { Opcoes } from './interativos';

export default function Pdp({ m, precos }: { m: Modelo; precos: (number | null)[] }) {
  const l = linhaDe(m.linha);
  const base = `mesas/${m.slug}/`;
  const fotos = fotosDe(m);
  const [k, setK] = useState('capa');
  const [fade, setFade] = useState(false);
  const [tam, setTam] = useState(m.tamanhos[0]);
  const [feltro, setFeltro] = useState<string | null>(null);
  const [tecido, setTecido] = useState(tecidos[0]);
  const foto = fotos.find((f) => f.k === k)!;
  const iTam = m.tamanhos.indexOf(tam);
  const temPreco = precos.some(Boolean);
  const precoAtual = precos[iTam];

  const mostrar = (nk: string) => {
    if (nk === k) return;
    setFade(true);
    const pre = new Image();
    pre.src = img(base + nk + '.webp');
    const troca = () => setTimeout(() => { setK(nk); setFade(false); }, 180);
    (pre.decode ? pre.decode() : Promise.resolve()).then(troca, troca);
  };
  const ampliar = () => window.dispatchEvent(new CustomEvent('lightbox', { detail: { grupo: 'modelo', idx: fotos.findIndex((f) => f.k === k) } }));

  const msg = [
    'Olá! Vim do site e gostaria de um orçamento:',
    `• Modelo: ${m.nome} (${l.titulo})`,
    `• Tamanho: ${tam}`,
    `• Cor do feltro: ${feltro || 'a definir'}`,
    `• ${tecido}`,
  ].join('\n');

  return (
    <div className="pdp__grid">
      <div className="gal">
        <div className="gal__main" onClick={(e) => { if (!(e.target as Element).closest('button')) ampliar(); }}>
          <img className={fade ? 'is-out' : ''} src={img(base + k + '.webp')} alt={`Mesa de bilhar ${m.nome} — ${foto.label.toLowerCase()}`} width={1004} height={620} fetchPriority="high" />
          {m.jantarReal && (
            <div className="gal__toggle" role="group" aria-label="Ver versão">
              <button type="button" aria-pressed={k !== 'jantar'} onClick={() => mostrar('bilhar')}><Icon n="bilhar" /> Bilhar</button>
              <button type="button" aria-pressed={k === 'jantar'} onClick={() => mostrar('jantar')}><Icon n="jantar" /> Jantar</button>
            </div>
          )}
          <button type="button" className="gal__expand" aria-label="Ampliar foto" onClick={ampliar}><Icon n="expand" /></button>
        </div>
        {fotos.length > 1 && (
          <div className="gal__thumbs">
            {fotos.map((f) => (
              <button key={f.k} type="button" aria-current={f.k === k} aria-label={f.label} onClick={() => mostrar(f.k)}>
                <img src={img(base + f.k + '-sm.webp')} alt="" loading="lazy" width={560} height={420} />
              </button>
            ))}
          </div>
        )}
        {fotos.map((f) => <a key={f.k} href={img(base + f.k + '.webp')} data-lb="modelo" data-alt={`Mesa ${m.nome} — ${f.label.toLowerCase()}`} hidden aria-hidden="true" tabIndex={-1} />)}
      </div>

      <div className="pdp__info">
        <p className="pdp__line">{l.titulo}{m.novo && <> · <span className="pill">Novo</span></>}</p>
        <h1 className="pdp__name"><small>Mesa de bilhar</small>{m.nome}</h1>
        <p className="pdp__tag">{m.descricao[0]}</p>
        <ul className="uses">{usosDe(m).map((u) => <li key={u}><Icon n={u} /> {USO_NOME[u]}</li>)}</ul>
        {temPreco && (
          <p className="pdp__price mt-s">
            <span>{precoAtual ? tam + ' —' : 'a partir de'}</span>{' '}
            <strong>{brl(precoAtual || Math.min(...precos.filter((p): p is number => !!p)))}</strong>
          </p>
        )}

        <div className="mt-s">
          <div className="opt">
            <div className="opt__label" id="lbl-tam">Tamanho <output>{tam}</output></div>
            <Opcoes className="chips" labelledBy="lbl-tam" valor={tam} onChange={setTam}
              opcoes={m.tamanhos.map((t, i) => ({ value: t, label: t.replace(' m', ''), sub: precos[i] ? brl(precos[i]!) : undefined }))} />
          </div>
          <div className="opt">
            <div className="opt__label" id="lbl-fel">Cor do feltro <output>{feltro || 'A definir'}</output></div>
            <Opcoes className="swatches" item="sw" labelledBy="lbl-fel" valor={feltro} onChange={setFeltro}
              opcoes={feltros.map((x) => ({ value: x.nome, title: x.nome, style: { backgroundImage: `url(${img(`feltros/${x.id}.webp`)})`, backgroundColor: x.hex } }))} />
          </div>
          <div className="opt">
            <div className="opt__label" id="lbl-tc">Tecido do jogo</div>
            <Opcoes className="chips" labelledBy="lbl-tc" valor={tecido} onChange={setTecido} opcoes={tecidos.map((t) => ({ value: t, label: t }))} />
          </div>
        </div>

        <div className="pdp__ctas">
          <Link className="btn btn--gold btn--block" href={`/orcamento/?modelo=${m.slug}`}>Pedir orçamento <Icon n="arrow" /></Link>
          <a className="btn btn--wa btn--block" href={wa(msg)} target="_blank" rel="noopener"><Icon n="whatsapp" /> Enviar esta configuração no WhatsApp</a>
          <a className="btn btn--line btn--block" href={`tel:${config.telefoneLink}`}><Icon n="phone" /> Ligar {config.telefone}</a>
        </div>
        <ul className="pdp__assure">
          <li><Icon n="truck" /> Enviamos para todo o Brasil</li>
          <li><Icon n="chat" /> Atendimento personalizado do conceito à instalação</li>
          <li><Icon n="shield" /> Fabricação própria com acabamento premium</li>
        </ul>
      </div>
    </div>
  );
}
