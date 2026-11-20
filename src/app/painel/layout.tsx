import type { Metadata } from 'next';
import '@/styles/painel.css';

export const metadata: Metadata = {
  title: 'Painel',
  robots: { index: false, follow: false },
};

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return children;
}
