/** Prefixo do site (GitHub Pages usa /seletto-prime; Vercel usa vazio). */
export const BASE = process.env.NEXT_PUBLIC_BASE_PATH || '';
/** Caminho de imagem em /public/img. */
export const img = (p: string) => `${BASE}/img/${p}`;
