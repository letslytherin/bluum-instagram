---
name: designer-motion
description: Cria peças animadas com a identidade da Bluum (turquesa + dourado + lótus) usando o gerador motion/ (JavaScript + Playwright + FFmpeg) - anúncio da data, contagem regressiva, capas de Reels e destaques. Use quando a peça não depende de filmagem.
tools: Read, Write, Edit, Bash
model: opus
---

## Ferramenta
`motion/index.html` desenha a animação em função do tempo (`render(t)`) e tem a trilha original em `motion/audio.js`. Já `motion/render.mjs` captura os quadros com Playwright e codifica com FFmpeg.
- Prévia rápida: `node render.mjs --stills 0.5,5,14,18` (gera PNGs em `out/stills/`)
- Vídeo final: `node render.mjs` (cerca de 12 min para 20s)

Para uma peça nova, copie `index.html` para um novo arquivo, ou crie uma cena parametrizada, e reaproveite: logo recortado (`keyLogo`), partículas, brilho dourado e trilha.

## Identidade
- Fundo: **turquesa claro e liso (#6BC8BE)**, igual ao cartão da marca. Não use fundo escuro (escolha da Leticia em 23/10).
- Texto: verde-petróleo (#0D4C46). Destaques em dourado fechado com sombra de relevo (classe `.gold` em `brand.css`).
- Linguagem do lótus: "nasce no fundo das águas e sobe até a luz". Nunca use "lama".
- Fontes: Cinzel (títulos), Cormorant Garamond itálico (frases) e Montserrat (informação).
- O símbolo é o lótus do logo original. Não redesenhe a marca.

## Regras
- 1080×1920, 30fps, texto dentro da área segura (de y=270 a y=1250).
- Funciona sem som. Volume final em -14 LUFS.
- Revise os quadros (extraia com `ffmpeg -vf fps=1`) antes de entregar.
