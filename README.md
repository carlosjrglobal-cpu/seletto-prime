# Seletto Prime — site + painel de leads (Next.js)

Site institucional e catálogo da Seletto Prime, formulário de qualificação de leads e painel comercial.

- **Site:** home, catálogo filtrável, uma página por mesa (`/modelo-comodo/` …, mesmas URLs do WordPress antigo), galeria, sobre, contato, política de privacidade.
- **`/orcamento`:** formulário de qualificação (spec "Formulário de qualificação de leads v1.0"): 4 perfis, perguntas por caminho, CNPJ validado, classificação automática (Prioritário / Em avaliação / Nutrição) e tela final com WhatsApp pré-preenchido.
- **`/painel`:** login, Leads (filtros, ficha, anotações, exportar CSV), Funil (arrastar entre etapas), Clientes e Relatórios (CPL, ROAS, ROI, ciclo de venda, formulário → WhatsApp). Aviso em tempo real de lead novo. Demonstração sem banco: `/painel/?demo=1`.

## Rodar no computador
```bash
npm install
cp .env.example .env.local   # preencha as chaves do Supabase
npm run dev                  # http://localhost:3000
```
`npm run build` gera o site estático na pasta `out/`.

## Estrutura
```
src/app/(site)/       páginas do site (layout com cabeçalho e rodapé)
src/app/painel/       painel de leads (login Supabase)
src/components/       componentes do site; painel/ = telas do painel
src/data/catalogo.json  modelos, textos, cores de feltro, jogos, acessórios
src/data/site.ts      contatos, WhatsApp, endereço, configurações
src/lib/leads.ts      perguntas do formulário, classificação, status, origem
supabase/migrations/  SQL do banco
public/img/           fotos (WebP), logo, favicons
```

## Configurar o banco (Supabase) — uma vez
1. Crie um projeto em supabase.com (plano gratuito, região São Paulo).
2. **SQL Editor** → rode `supabase/migrations/001_inicial.sql`.
3. **Authentication → Providers → Email:** desative "Allow new users to sign up".
4. **Authentication → Users → Add user:** crie o login da equipe.
5. **Project Settings → API:** copie *Project URL* e a chave *anon public*.
6. No GitHub: **Settings → Secrets and variables → Actions → Variables** → crie `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` (opcional: `NEXT_PUBLIC_META_PIXEL_ID`). Depois rode o workflow de novo (aba Actions → "Publicar no GitHub Pages" → Run workflow).

A chave *anon* é pública por natureza: o banco só deixa o visitante **inserir** lead (não lê nem edita). Ler e editar exige login.

## Publicação
- **Agora:** GitHub Pages, automático a cada `git push` na `main` (`.github/workflows/pages.yml`).
- **Depois, Vercel:** importe o repositório na Vercel, cadastre as mesmas variáveis (sem `NEXT_PUBLIC_BASE_PATH`) e aponte o domínio. Na Vercel dá para remover `output: 'export'` do `next.config.mjs` e ganhar rotas de servidor.

## Preços
O catálogo 2026 é interno, então os preços **não ficam no código**. Para exibir: crie `precos.local.json` na raiz (fora do Git) e mude `mostrarPrecos` para `true` em `src/data/site.ts`. Só aparece em builds feitos onde esse arquivo existe.

## Próxima fase — robô e campanhas de WhatsApp
Depende da **API oficial do WhatsApp (Cloud API da Meta)**: app no Meta for Developers, número conectado, token permanente. A parte de servidor (receber mensagens, responder, disparar campanhas) vai em **Supabase Edge Functions**, então funciona igual no GitHub Pages e na Vercel.

## Pontos para confirmar
- **CNPJ:** opcional, com "informo depois" (`CNPJ_OBRIGATORIO` em `src/lib/leads.ts`). O PDF deixa a decisão pendente.
- **"Orçamento compatível" (Prioritário):** prazo de até 30 dias com faixa de investimento definida; condomínio e empresa: compra aprovada ou autorizada (`classificar()` em `src/lib/leads.ts`).
- **Política de privacidade:** falta a razão social, o CNPJ e o e-mail do encarregado de dados.
- **Endereço:** Canoas/RS com WhatsApp (48). Confirmar se o endereço mudou.
- Rustic e Pisa estão fora do catálogo 2026. Eleganza tem descrição nova. Os nomes das cores de feltro foram dados por nós.
