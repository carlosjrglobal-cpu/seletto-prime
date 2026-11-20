import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { config } from '@/data/site';
import { BASE } from '@/lib/paths';

const jost = Jost({ subsets: ['latin'], weight: ['300', '400', '500'], variable: '--font-jost', display: 'swap' });
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500'], style: ['italic'], variable: '--font-cormorant', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(config.siteUrl),
  title: { default: 'Seletto Prime — Mesas de bilhar de alto padrão', template: '%s | Seletto Prime' },
  description: 'Mesas de bilhar com design exclusivo que se transformam em mesa de jantar e tênis de mesa.',
  openGraph: { type: 'website', locale: 'pt_BR', siteName: config.nome, images: ['/img/og/seletto-prime.jpg'] },
  twitter: { card: 'summary_large_image' },
  icons: {
    icon: [
      { url: `${BASE}/img/logo/favicon-32.png`, sizes: '32x32', type: 'image/png' },
      { url: `${BASE}/img/logo/favicon-48.png`, sizes: '48x48', type: 'image/png' },
    ],
    apple: `${BASE}/img/logo/apple-touch-icon.png`,
  },
};

export const viewport: Viewport = { themeColor: '#121110' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${jost.variable} ${cormorant.variable}`}>
      <head>
        {/* esconde elementos .rv até o JS revelar; se o JS falhar, o CSS mostra tudo em 2,5 s */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
