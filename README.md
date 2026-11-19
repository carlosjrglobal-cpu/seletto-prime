# Seletto Prime — site

Site estático (HTML, CSS e JS puros, sem dependências) recriado a partir de selettoprime.com.br e do *Catálogo Seletto 2026*.

## Como ver
Abra `index.html` no navegador. Funciona direto do computador, sem servidor.

## Estrutura
```
index.html              Home
catalogo/               Catálogo com filtros (Standard / Plus / Master), busca, jogos e acessórios
modelo-<nome>/          Uma página por mesa (mesmas URLs do WordPress atual: /modelo-comodo/ ...)
galeria/  sobre/  contato/
assets/css/style.css    Estilos
assets/js/main.js       Interações
assets/img/             Fotos otimizadas em WebP, logo vetorial, favicons, imagens de compartilhamento
_build/dados.js         TODOS os textos, modelos, tamanhos, preços, cores e contatos
_build/build.js         Gerador das páginas
sitemap.xml  robots.txt
```

## Como editar
1. Altere `_build/dados.js` (ou textos de página em `_build/build.js`).
2. Rode `node _build/build.js` (precisa do Node.js instalado).

As páginas `.html` são geradas: alterações feitas direto nelas são sobrescritas na próxima geração.

### Chaves importantes em `_build/dados.js`
| Chave | Padrão | O que faz |
|---|---|---|
| `mostrarPrecos` | `false` | Exibe "a partir de" nos cards e o preço por tamanho. Está desligado porque o catálogo 2026 é marcado como *"Catálogo Interno — utilização exclusiva time de vendas"*. |

### Preços
Os preços ficam em `_build/precos.local.js`, que **não vai para o GitHub** (está no `.gitignore`, assim como o PDF do catálogo). Sem esse arquivo, o site é gerado normalmente, só que sem preços.
| `urlsLimpas` | `false` | `false` = links com `index.html` (funciona abrindo do PC). Use `true` ao publicar no servidor para links como `/modelo-comodo/`. |

## Publicação
O site está publicado pelo **GitHub Pages**: cada `git push` na branch `main` atualiza o site em alguns minutos. Gere as páginas (`node _build/build.js`) antes de enviar.

Para outra hospedagem, suba a pasta inteira (sem `_build/` e sem o PDF, se preferir) para qualquer hospedagem estática. As URLs dos modelos são as mesmas do WordPress atual, então os links já indexados no Google continuam funcionando.

## Pontos para confirmar
- **Telefone/WhatsApp:** o site usa um único número, (48) 99910-2369, para ligação e WhatsApp (definido em `config` no `dados.js`).
- **Rustic e Pisa:** estão no site, mas não no catálogo 2026. Coloquei Rustic na Linha Standard e Pisa na Plus. Os dois ficam sem preço.
- **Eleganza:** está no catálogo, mas não tinha página no site. A descrição foi escrita para o site novo e precisa de revisão.
- **Medidas:** usei as medidas padrão do site (1,80×1,00 / 2,00×1,20 / 2,30×1,30 / 2,70×1,45). O catálogo traz pequenas variações: Verona 1,80×1,10; Comodo e Novara 2,30×1,20; Milano 2,70×1,34; Iron e Sofisticatto 2,70×1,44. Bergamo e Eleganza não têm 2,70 no catálogo.
- **Cores de feltro:** as 14 cores vêm da tabela oficial do site, mas os nomes (Areia, Lavanda, Azul-petróleo…) foram dados por mim.
- **Simulador "Personalize":** os acabamentos (preto, branco, grafite, bege, madeiras) são ilustrativos.
- **Outras opções de jogos:** interpretei "Mesa Zeus com versão em Carmello" como *Pebolim base Carmello*.
- **"Espaço ideal" nas páginas dos modelos:** é a medida da mesa + 1,45 m de taco em cada lado (regra prática).
