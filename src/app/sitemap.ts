import type { MetadataRoute } from 'next';
import { config, modelos, rotaModelo } from '@/data/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const rotas = ['/', '/catalogo/', '/orcamento/', '/galeria/', '/sobre/', '/contato/', ...modelos.map((m) => rotaModelo(m.slug))];
  return rotas.map((r) => ({ url: config.siteUrl + r }));
}
