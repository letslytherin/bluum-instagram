# Bluum · Instagram da inauguração

Material de marketing da **Bluum**, loja de make, cosméticos e acessórios na Estrada de Águas Compridas, 392, em Olinda-PE (@lojabluum). **A inauguração é no sábado, 7 de novembro.**

## Por onde começar
| Para… | Abra |
|---|---|
| Saber **o que postar, quando, com qual arquivo e qual legenda** | [GUIA-DE-POSTAGEM.md](GUIA-DE-POSTAGEM.md) |
| Ver e marcar o andamento (status, checklist, legenda com botão de copiar) | [Painel Instagram](https://claude.ai/artifact/61AikGiPMCodm7XJBbZXL4). O painel é a versão mais atual do calendário |
| Ver as artes prontas | [motion/out/posts/](motion/out/posts/) (imagens) e [motion/out/reels/](motion/out/reels/) (vídeos) |
| Ver tudo de uma vez | [prévia do feed](motion/out/previa-feed.png) e [prévia dos stories](motion/out/previa-stories.png) |
| Entender a estratégia | [docs/ESTRATEGIA.md](docs/ESTRATEGIA.md) |
| Seguir o visual da marca em peças novas | [DESIGN.md](DESIGN.md) |
| Conferir o que pode ser dito (preço, endereço, WhatsApp) | [data/fatos.md](data/fatos.md) |
| Anúncio pago (Meta Ads) | [motion/ANUNCIO.md](motion/ANUNCIO.md) |

## Para baixar um vídeo ou imagem
Entre na pasta, clique no arquivo e use o botão **Download raw file** (ícone de seta para baixo), no canto direito.

## Regras rápidas
- Preço: **"a partir de R$ 4,99"**. A Bluum não é loja de preço fixo.
- Só postar fato confirmado em `data/fatos.md`. Nada de "últimas unidades" se não for verdade.
- Pessoa em foto ou vídeo só com autorização.
- Em todo post: marcar a localização em Olinda e usar #BluumFloresce.

## Como as peças são feitas (para quem for editar)
As artes e os vídeos são gerados por código, com JavaScript, Playwright e FFmpeg, a partir de `motion/`:
```bash
cd motion
npm install
npx playwright install chromium-headless-shell
node render-posts.mjs                                   # gera as imagens em out/posts/
node render.mjs --page "reel.html?v=data" --out reels/reel-data.mp4   # gera um Reel
```
Os textos das imagens ficam em `posts.html` e os dos vídeos em `reel.html`. Para rodar, é preciso ter o FFmpeg instalado.

`data/calendario-atual.json` é uma cópia do painel feita em 30/10. Se houver diferença, vale o painel.
