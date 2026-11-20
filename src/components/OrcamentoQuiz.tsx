'use client';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { modeloPorSlug, wa } from '@/data/site';
import {
  CNPJ_OBRIGATORIO, classificar, cnpjValido, corporativo, foneValido, gravarLead, mascaraCnpj, mascaraFone,
  PERFIL_NOME, PERFIS, PERGUNTAS, pixel, registrarCliqueWhatsapp, soDigitos, UFS, type Perfil,
} from '@/lib/leads';
import { Icon } from './Icon';

type Etapa = { tipo: 'perfil' } | { tipo: 'pergunta'; idx: number } | { tipo: 'empresa' } | { tipo: 'contato' } | { tipo: 'fim' };

export default function OrcamentoQuiz() {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [resp, setResp] = useState<Record<string, string>>({});
  const [passo, setPasso] = useState(0);
  const [modelo, setModelo] = useState<string | null>(null);
  const [f, setF] = useState({ nome: '', telefone: '', cidade: '', uf: '', empresa: '', cnpj: '', cnpjDepois: false, aceite: false, site: '' });
  const [erro, setErro] = useState<Record<string, string>>({});
  const [enviando, setEnviando] = useState(false);
  const [leadId, setLeadId] = useState<string | null>(null);
  const t0 = useRef(Date.now());
  const topo = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const s = new URLSearchParams(location.search).get('modelo');
    if (s && modeloPorSlug(s)) setModelo(modeloPorSlug(s)!.nome);
  }, []);

  const etapas: Etapa[] = useMemo(() => {
    const e: Etapa[] = [{ tipo: 'perfil' }];
    if (perfil) {
      PERGUNTAS[perfil].forEach((_, idx) => e.push({ tipo: 'pergunta', idx }));
      if (corporativo(perfil)) e.push({ tipo: 'empresa' });
    }
    e.push({ tipo: 'contato' }, { tipo: 'fim' });
    return e;
  }, [perfil]);
  const etapa = etapas[Math.min(passo, etapas.length - 1)];
  const total = perfil ? etapas.length - 1 : 4; // antes de escolher o perfil, mostra o caminho mais comum (residencial)
  const ir = (n: number) => {
    setPasso(n);
    setErro({});
    requestAnimationFrame(() => topo.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  };

  const set = (k: keyof typeof f, v: string | boolean) => setF((o) => ({ ...o, [k]: v }));

  const validarEmpresa = () => {
    const e: Record<string, string> = {};
    if (!f.empresa.trim()) e.empresa = 'Informe o nome do condomínio ou da empresa.';
    const temCnpj = soDigitos(f.cnpj).length > 0;
    if (temCnpj && !cnpjValido(f.cnpj)) e.cnpj = 'CNPJ inválido. Confira os 14 números.';
    if (!temCnpj && (CNPJ_OBRIGATORIO || !f.cnpjDepois)) e.cnpj = CNPJ_OBRIGATORIO ? 'Informe o CNPJ.' : 'Informe o CNPJ ou marque “informo depois”.';
    setErro(e);
    return !Object.keys(e).length;
  };

  const enviar = async () => {
    const e: Record<string, string> = {};
    if (f.nome.trim().length < 3) e.nome = 'Informe seu nome completo.';
    if (!foneValido(f.telefone)) e.telefone = 'Informe um WhatsApp com DDD.';
    if (!f.cidade.trim()) e.cidade = 'Informe a cidade da instalação.';
    if (!f.uf) e.uf = 'Escolha a UF.';
    if (!f.aceite) e.aceite = 'É preciso aceitar a política de privacidade.';
    setErro(e);
    if (Object.keys(e).length || !perfil) return;
    // antispam: campo invisível preenchido ou envio rápido demais
    if (f.site || Date.now() - t0.current < 3000) { ir(etapas.length - 1); return; }
    setEnviando(true);
    const respostas: Record<string, string> = { perfil: PERFIL_NOME[perfil] };
    PERGUNTAS[perfil].forEach((q) => { respostas[q.titulo] = resp[q.id]; });
    const r = await gravarLead({
      formulario: 'orcamento',
      nome: f.nome.trim(),
      telefone: '+55' + soDigitos(f.telefone),
      cidade: f.cidade.trim(),
      uf: f.uf,
      perfil,
      investimento: resp.investimento || null,
      prazo: resp.prazo || null,
      papel: resp.papel || null,
      jogos: resp.jogos || null,
      empresa: corporativo(perfil) ? f.empresa.trim() : null,
      cnpj: corporativo(perfil) && soDigitos(f.cnpj) ? soDigitos(f.cnpj) : null,
      modelo,
      respostas,
      classificacao: classificar(perfil, resp),
      aceite_privacidade_at: new Date().toISOString(),
    });
    if (!r.ok) console.warn('Lead não gravado:', r.erro);
    setLeadId(r.id);
    pixel('Lead', { content_name: PERFIL_NOME[perfil] });
    setEnviando(false);
    ir(etapas.length - 1);
  };

  // Resumo para o WhatsApp — sem CNPJ (seção 10 do PDF)
  const msgWa = () => {
    if (!perfil) return wa();
    const l = ['Olá! Acabei de preencher o formulário no site da Seletto Prime.', `• Projeto: ${PERFIL_NOME[perfil]}`];
    if (resp.jogos) l.push(`• Jogos: ${resp.jogos}`);
    if (resp.papel) l.push(`• Participação: ${resp.papel}`);
    if (resp.investimento) l.push(`• Investimento: ${resp.investimento}`);
    if (resp.prazo) l.push(`• ${corporativo(perfil) ? 'Fase' : 'Prazo'}: ${resp.prazo}`);
    if (modelo) l.push(`• Modelo de interesse: ${modelo}`);
    if (f.empresa && corporativo(perfil)) l.push(`• ${perfil === 'condominio' ? 'Condomínio' : 'Empresa'}: ${f.empresa}`);
    l.push(`• Local: ${f.cidade}/${f.uf}`, '', `Meu nome é ${f.nome.trim().split(' ')[0]}.`);
    return wa(l.join('\n'));
  };

  const progresso = Math.round((Math.min(passo, total) / total) * 100);

  return (
    <div className="quiz" ref={topo}>
      {etapa.tipo !== 'fim' && (
        <div className="quiz__top">
          <button type="button" className="quiz__back" onClick={() => ir(Math.max(0, passo - 1))} disabled={passo === 0} aria-label="Voltar"><Icon n="arrowL" /> Voltar</button>
          <span className="quiz__step">Etapa {passo + 1} de {total}</span>
        </div>
      )}
      {etapa.tipo !== 'fim' && <div className="quiz__bar" aria-hidden="true"><span style={{ width: progresso + '%' }} /></div>}
      {modelo && etapa.tipo !== 'fim' && <p className="quiz__modelo"><Icon n="check" /> Modelo de interesse: <b>{modelo}</b></p>}

      {etapa.tipo === 'perfil' && (
        <fieldset className="quiz__q" key="perfil">
          <legend className="h-md">O que você <span className="it">procura?</span></legend>
          <div className="quiz__perfis">
            {PERFIS.map((p) => (
              <button key={p.k} type="button" className={`quiz__perfil${perfil === p.k ? ' on' : ''}`} onClick={() => { if (p.k !== perfil) setResp({}); setPerfil(p.k); ir(1); }}>
                <Icon n={p.icone} />
                <span><b>{p.titulo}</b><small>{p.desc}</small></span>
                <Icon n="arrow" className="quiz__go" />
              </button>
            ))}
          </div>
        </fieldset>
      )}

      {etapa.tipo === 'pergunta' && perfil && (() => {
        const q = PERGUNTAS[perfil][etapa.idx];
        return (
          <fieldset className="quiz__q" key={q.id + perfil}>
            <legend className="h-md">{q.titulo}</legend>
            <div className="quiz__ops">
              {q.opcoes.map((o) => (
                <button key={o} type="button" className={`quiz__op${resp[q.id] === o ? ' on' : ''}`} onClick={() => { setResp((r) => ({ ...r, [q.id]: o })); ir(passo + 1); }}>
                  <span>{o}</span><Icon n="arrow" />
                </button>
              ))}
            </div>
          </fieldset>
        );
      })()}

      {etapa.tipo === 'empresa' && perfil && (
        <div className="quiz__q" key="empresa">
          <h2 className="h-md">{perfil === 'condominio' ? <>Qual o <span className="it">condomínio?</span></> : <>Qual a <span className="it">empresa?</span></>}</h2>
          <div className="quiz__form">
            <Campo id="q-emp" label={perfil === 'condominio' ? 'Nome do condomínio ou da empresa' : 'Razão social / nome da empresa'} erro={erro.empresa}>
              <input id="q-emp" value={f.empresa} onChange={(e) => set('empresa', e.target.value)} autoComplete="organization" />
            </Campo>
            <Campo id="q-cnpj" label={`CNPJ${CNPJ_OBRIGATORIO ? '' : ' (opcional)'}`} erro={erro.cnpj}>
              <input id="q-cnpj" value={f.cnpj} inputMode="numeric" placeholder="00.000.000/0000-00" disabled={f.cnpjDepois}
                onChange={(e) => set('cnpj', mascaraCnpj(e.target.value))} />
            </Campo>
            {!CNPJ_OBRIGATORIO && (
              <label className="quiz__check"><input type="checkbox" checked={f.cnpjDepois} onChange={(e) => { set('cnpjDepois', e.target.checked); if (e.target.checked) set('cnpj', ''); }} /> Não tenho o CNPJ agora — informo depois ao time comercial</label>
            )}
            {perfil === 'condominio' && <p className="quiz__hint">Use o CNPJ do condomínio ou da empresa responsável pela compra. Ele costuma estar no boleto do condomínio ou com a administradora.</p>}
            <button type="button" className="btn btn--gold btn--block" onClick={() => validarEmpresa() && ir(passo + 1)}>Continuar <Icon n="arrow" /></button>
          </div>
        </div>
      )}

      {etapa.tipo === 'contato' && (
        <form className="quiz__q" key="contato" onSubmit={(e) => { e.preventDefault(); enviar(); }} noValidate>
          <h2 className="h-md">Para quem enviamos <span className="it">a proposta?</span></h2>
          <div className="quiz__form">
            <Campo id="q-nome" label="Nome completo" erro={erro.nome}><input id="q-nome" value={f.nome} onChange={(e) => set('nome', e.target.value)} autoComplete="name" /></Campo>
            <Campo id="q-fone" label="WhatsApp com DDD" erro={erro.telefone}><input id="q-fone" value={f.telefone} inputMode="tel" placeholder="(00) 00000-0000" onChange={(e) => set('telefone', mascaraFone(e.target.value))} autoComplete="tel-national" /></Campo>
            <div className="quiz__row">
              <Campo id="q-cid" label="Cidade da instalação" erro={erro.cidade}><input id="q-cid" value={f.cidade} onChange={(e) => set('cidade', e.target.value)} autoComplete="address-level2" /></Campo>
              <Campo id="q-uf" label="UF" erro={erro.uf}>
                <select id="q-uf" value={f.uf} onChange={(e) => set('uf', e.target.value)}><option value="">—</option>{UFS.map((u) => <option key={u}>{u}</option>)}</select>
              </Campo>
            </div>
            <input className="sr-only" tabIndex={-1} autoComplete="off" aria-hidden="true" value={f.site} onChange={(e) => set('site', e.target.value)} name="site" />
            <label className={`quiz__check${erro.aceite ? ' err' : ''}`}>
              <input type="checkbox" checked={f.aceite} onChange={(e) => set('aceite', e.target.checked)} />
              <span>Li e aceito a <Link href="/privacidade/" target="_blank">política de privacidade</Link>. Meus dados serão usados apenas para o atendimento comercial da Seletto Prime.</span>
            </label>
            {erro.aceite && <small className="quiz__err">{erro.aceite}</small>}
            <button type="submit" className="btn btn--gold btn--block" disabled={enviando}>{enviando ? 'Enviando…' : <>Ver próximo passo <Icon n="arrow" /></>}</button>
          </div>
        </form>
      )}

      {etapa.tipo === 'fim' && (
        <div className="quiz__fim" key="fim">
          <span className="quiz__ok"><Icon n="check" /></span>
          <h2 className="h-lg">Seu projeto <span className="it">começa aqui!</span></h2>
          <p className="lead">Obrigado por compartilhar suas informações com a Seletto Prime. Nossa equipe está preparada para ajudar você a encontrar a solução ideal para seu ambiente. Continue para o WhatsApp e fale com um especialista.</p>
          <a className="btn btn--wa" href={msgWa()} target="_blank" rel="noopener"
            onClick={() => { if (leadId) registrarCliqueWhatsapp(leadId); pixel('Contact'); }}>
            <Icon n="whatsapp" /> Falar com um especialista
          </a>
          <Link className="link-arrow mt-s" href="/catalogo/">Enquanto isso, veja o catálogo <Icon n="arrow" /></Link>
        </div>
      )}
    </div>
  );
}

function Campo({ id, label, erro, children }: { id: string; label: string; erro?: string; children: React.ReactNode }) {
  return (
    <div className={`field${erro ? ' err' : ''}`}>
      <label htmlFor={id}>{label}</label>
      {children}
      {erro && <small className="quiz__err" role="alert">{erro}</small>}
    </div>
  );
}
