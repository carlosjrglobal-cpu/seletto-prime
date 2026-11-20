import type { Metadata } from 'next';
import { config } from '@/data/site';

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description: 'Como a Seletto Prime coleta, usa e protege os dados enviados pelo site.',
  alternates: { canonical: '/privacidade/' },
};

/* Revisar com o responsável jurídico: incluir razão social, CNPJ e e-mail do encarregado (DPO). */
export default function Privacidade() {
  return (
    <section className="pdp" style={{ paddingBottom: 'var(--sec)' }}>
      <div className="wrap" style={{ maxWidth: 820 }}>
        <span className="eyebrow">LGPD</span>
        <h1 className="h-lg mt-s">Política de privacidade</h1>
        <div className="feat__text mt-m">
          <p>Esta política explica como a {config.nome} trata os dados pessoais enviados pelo site, em conformidade com a Lei Geral de Proteção de Dados (Lei 13.709/2018).</p>
          <h2 className="h-sm mt-m">Quais dados coletamos</h2>
          <p>Nos formulários de orçamento e contato: nome, telefone/WhatsApp, cidade e UF, e as respostas sobre o projeto (tipo de ambiente, faixa de investimento, prazo, modelo de interesse). Em projetos corporativos e de condomínio, também o nome da empresa ou condomínio e, se informado, o CNPJ. Registramos ainda a origem da visita (por exemplo, o anúncio que trouxe você ao site).</p>
          <h2 className="h-sm mt-m">Para que usamos</h2>
          <p>Exclusivamente para o atendimento comercial: entrar em contato, preparar orçamentos, acompanhar o seu projeto e medir quais campanhas trazem mais interessados. Não vendemos nem compartilhamos os seus dados com terceiros para fins de marketing.</p>
          <h2 className="h-sm mt-m">Onde ficam guardados</h2>
          <p>Os dados ficam em banco de dados com acesso restrito à equipe da {config.nome}, protegido por login. O contato pelo WhatsApp segue também a política de privacidade do próprio WhatsApp.</p>
          <h2 className="h-sm mt-m">Seus direitos</h2>
          <p>Você pode pedir a qualquer momento acesso, correção ou exclusão dos seus dados, ou revogar o consentimento, pelo WhatsApp {config.whatsappExibicao} ou pelo telefone {config.telefone}.</p>
          <p className="pdp__note mt-m">Última atualização: novembro de 2026.</p>
        </div>
      </div>
    </section>
  );
}
