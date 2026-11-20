import '@/styles/site.css';
import Effects from '@/components/Effects';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import MetaPixel from '@/components/MetaPixel';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <a className="skip" href="#conteudo">Pular para o conteúdo</a>
      <Header />
      <main id="conteudo">{children}</main>
      <Footer />
      <Effects />
      <MetaPixel />
    </>
  );
}
