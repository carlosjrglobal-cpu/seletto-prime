'use client';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { linhas, modelosDa, wa } from '@/data/site';
import { foneValido, gravarLead, mascaraFone, pixel, registrarCliqueWhatsapp, soDigitos } from '@/lib/leads';
import { Icon } from './Icon';

export default function ContatoForm() {
  const [f, setF] = useState({ nome: '', telefone: '', cidade: '', modelo: '', tamanho: '', mensagem: '', aceite: false, site: '' });
  const [erro, setErro] = useState('');
  const t0 = useRef(Date.now());
  const set = (k: keyof typeof f, v: string | boolean) => setF((o) => ({ ...o, [k]: v }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (f.nome.trim().length < 3) return setErro('Informe seu nome.');
    if (!foneValido(f.telefone)) return setErro('Informe um WhatsApp com DDD.');
    if (!f.aceite) return setErro('É preciso aceitar a política de privacidade.');
    setErro('');
    const linhasMsg = [`Olá! Meu nome é ${f.nome.trim()}.`];
    if (f.cidade) linhasMsg.push(`• Cidade: ${f.cidade}`);
    if (f.modelo) linhasMsg.push(`• Modelo de interesse: ${f.modelo}`);
    if (f.tamanho) linhasMsg.push(`• Tamanho: ${f.tamanho}`);
    if (f.mensagem) linhasMsg.push('', f.mensagem);
    // abre o WhatsApp já no clique (bloqueador de pop-up exige isso) e grava em paralelo
    const janela = window.open(wa(linhasMsg.join('\n')), '_blank', 'noopener');
    if (f.site || Date.now() - t0.current < 3000) return;
    const r = await gravarLead({
      formulario: 'contato', nome: f.nome.trim(), telefone: '+55' + soDigitos(f.telefone), cidade: f.cidade.trim() || null,
      modelo: f.modelo || null, tamanho: f.tamanho || null, mensagem: f.mensagem.trim() || null,
      aceite_privacidade_at: new Date().toISOString(),
    });
    if (r.ok) registrarCliqueWhatsapp(r.id);
    pixel('Lead', { content_name: 'Contato' });
    pixel('Contact');
    if (!janela) location.href = wa(linhasMsg.join('\n'));
  };

  return (
    <form className="form" onSubmit={enviar} noValidate>
      <div>
        <span className="eyebrow eyebrow--plain">Fale com a gente</span>
        <h2 className="h-md mt-s">Conte o que <span className="it">você imagina</span></h2>
      </div>
      <div className="form__row">
        <div className="field"><label htmlFor="f-nome">Nome</label><input id="f-nome" value={f.nome} onChange={(e) => set('nome', e.target.value)} autoComplete="name" /></div>
        <div className="field"><label htmlFor="f-fone">WhatsApp</label><input id="f-fone" value={f.telefone} inputMode="tel" placeholder="(00) 00000-0000" onChange={(e) => set('telefone', mascaraFone(e.target.value))} autoComplete="tel-national" /></div>
      </div>
      <div className="form__row">
        <div className="field"><label htmlFor="f-cidade">Cidade / UF</label><input id="f-cidade" value={f.cidade} onChange={(e) => set('cidade', e.target.value)} autoComplete="address-level2" /></div>
        <div className="field"><label htmlFor="f-modelo">Modelo de interesse</label>
          <select id="f-modelo" value={f.modelo} onChange={(e) => set('modelo', e.target.value)}>
            <option value="">Ainda não sei</option>
            {linhas.map((l) => <optgroup key={l.id} label={l.titulo}>{modelosDa(l.id).map((m) => <option key={m.slug}>{m.nome}</option>)}</optgroup>)}
            <option>Outras opções de jogos</option>
          </select>
        </div>
      </div>
      <div className="field"><label htmlFor="f-tam">Tamanho</label>
        <select id="f-tam" value={f.tamanho} onChange={(e) => set('tamanho', e.target.value)}>
          <option value="">Ainda não sei</option>
          {['1,80 x 1,00 m', '2,00 x 1,20 m', '2,30 x 1,30 m', '2,70 x 1,45 m'].map((t) => <option key={t}>{t}</option>)}
        </select>
      </div>
      <div className="field"><label htmlFor="f-msg">Mensagem</label><textarea id="f-msg" value={f.mensagem} onChange={(e) => set('mensagem', e.target.value)} placeholder="Fale um pouco sobre o ambiente, cores e acabamentos que você imagina." /></div>
      <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.site} onChange={(e) => set('site', e.target.value)} name="site" />
      <label className="quiz__check"><input type="checkbox" checked={f.aceite} onChange={(e) => set('aceite', e.target.checked)} /><span>Li e aceito a <Link href="/privacidade/">política de privacidade</Link>.</span></label>
      {erro && <small className="quiz__err" role="alert">{erro}</small>}
      <button className="btn btn--wa btn--block" type="submit"><Icon n="whatsapp" /> Enviar pelo WhatsApp</button>
      <small>Ao enviar, o WhatsApp abre com a sua mensagem pronta para o nosso time comercial.</small>
    </form>
  );
}
