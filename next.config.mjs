/**
 * Exportação estática (pasta `out/`).
 * - GitHub Pages: o workflow define NEXT_PUBLIC_BASE_PATH=/seletto-prime
 * - Vercel / domínio próprio: deixe NEXT_PUBLIC_BASE_PATH vazio.
 * Ao migrar para a Vercel, dá para remover `output: 'export'` e ganhar
 * recursos de servidor (API routes, revalidação do catálogo etc.).
 * @type {import('next').NextConfig}
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
