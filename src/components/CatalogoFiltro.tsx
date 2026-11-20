'use client';
import { useEffect, useMemo, useState } from 'react';
import { linhas, modelos, wa } from '@/data/site';
import { CardModelo } from './blocos';
import { Icon } from './Icon';

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export default function CatalogoFiltro({ precos }: { precos: Record<string, number | null> }) {
  const [filtro, setFiltro] = useState('todas');
  const [q, setQ] = useState('');

  useEffect(() => {
    const h = location.hash.slice(1);
    if (linhas.some((l) => l.id === h)) setFiltro(h);
  }, []);

  const visiveis = useMemo(() => {
    const t = norm(q.trim());
    return modelos.filter((m) => (filtro === 'todas' || m.linha === filtro) && (!t || norm(m.nome).includes(t)));
  }, [filtro, q]);

  const escolher = (id: string) => {
    setFiltro(id);
    history.replaceState(null, '', id === 'todas' ? location.pathname : '#' + id);
    if (id !== 'todas') document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="cat-bar">
        <div className="wrap cat-bar__in">
          <div className="tabs" role="group" aria-label="Filtrar por linha">
            <button type="button" className="tab" aria-pressed={filtro === 'todas'} onClick={() => escolher('todas')}>Todas <span>{modelos.length}</span></button>
            {linhas.map((l) => (
              <button key={l.id} type="button" className="tab" aria-pressed={filtro === l.id} onClick={() => escolher(l.id)}>
                {l.nome} <span>{modelos.filter((m) => m.linha === l.id).length}</span>
              </button>
            ))}
          </div>
          <label className="search">
            <Icon n="search" /><span className="sr-only">Buscar modelo</span>
            <input type="search" placeholder="Buscar modelo" value={q} onChange={(e) => setQ(e.target.value)} autoComplete="off" />
          </label>
        </div>
      </div>
      <div className="wrap" style={{ paddingBottom: 'var(--sec)' }}>
        {linhas.map((l) => {
          const lista = visiveis.filter((m) => m.linha === l.id);
          return (
            <section key={l.id} className="cat-group" id={l.id} hidden={!lista.length} aria-labelledby={`t-${l.id}`}>
              <div className="cat-group__head">
                <h2 id={`t-${l.id}`}><span className="it">linha</span>{l.nome}</h2>
                <p className="lead">{l.resumo}</p>
              </div>
              <div className="grid-m">{lista.map((m) => <CardModelo key={m.slug} m={m} preco={precos[m.slug]} />)}</div>
            </section>
          );
        })}
        {!visiveis.length && (
          <p className="empty">Nenhum modelo encontrado. <a className="link-arrow" href={wa('Olá! Vim do site e procuro um modelo de mesa específico.')} target="_blank" rel="noopener">Fale com a gente</a></p>
        )}
      </div>
    </>
  );
}
