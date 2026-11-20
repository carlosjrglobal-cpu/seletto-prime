import type { Metadata } from 'next';
import OrcamentoQuiz from '@/components/OrcamentoQuiz';
import { Icon } from '@/components/Icon';
import { img } from '@/lib/paths';

export const metadata: Metadata = {
  title: 'Peça seu orçamento',
  description: 'Responda 4 perguntas rápidas e fale com um especialista da Seletto Prime sobre a sua mesa de bilhar 3 em 1, sala de jogos ou projeto corporativo.',
  alternates: { canonical: '/orcamento/' },
};

export default function Orcamento() {
  return (
    <section className="orc">
      <div className="orc__bg"><img src={img('hero/h1.webp')} alt="" /></div>
      <div className="wrap orc__in">
        <div className="orc__intro">
          <span className="eyebrow">Orçamento personalizado</span>
          <h1 className="h-lg">Vamos encontrar <span className="it">a sua mesa</span></h1>
          <p className="lead">Leva menos de um minuto. Com as suas respostas, o nosso time já chega no WhatsApp sabendo como ajudar.</p>
          <ul className="orc__list">
            <li><Icon n="check" /> Atendimento do conceito à instalação</li>
            <li><Icon n="check" /> Bilhar, jantar e tênis de mesa em uma peça</li>
            <li><Icon n="check" /> Enviamos para todo o Brasil</li>
          </ul>
        </div>
        <OrcamentoQuiz />
      </div>
    </section>
  );
}
