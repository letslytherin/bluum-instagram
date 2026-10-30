# DESIGN.md: Bluum no Instagram

> Fonte de verdade visual das peças em `motion/`. Feito em 30/10/2026 com o processo da skill ui-humanizer (gabrielgreco1/skills) e as regras de ritmo da motion-designer. Decisões da Leticia vencem este arquivo.

## Leitura
Peças de Instagram (feed 4:5, Stories e Reels 9:16) de uma loja física de beleza em Olinda, a 8 dias da inauguração. O público é local, rola o feed rápido e deve entender em 3 segundos **o que é, onde fica e quando abre**. A intenção é **convencer**.
- **Variação:** média.
- **Movimento:** baixo. O ritmo é calmo, sem efeito chamando atenção.
- **Densidade:** baixa. Uma ideia por tela.

## Material real (é ele que deve aparecer)
- A arte do logo: lótus dourado com opalas, BLUUM em relevo e a tagline. Arquivo `assets/logo.jpg`, fundo #6DC8BF.
- Fatos de `data/fatos.md`: endereço, data (sábado, 7 de novembro), WhatsApp e preço a partir de R$ 4,99.
- O texto-manifesto do Guilherme (30/10), que é a voz da marca escrita por uma pessoa. Use as frases dele.
- **Ainda falta:** fotos reais da fachada, dos produtos e das pessoas. Quando chegarem, elas passam a ser a imagem principal das peças. Enquanto isso, a imagem é o próprio logo. Não preencher o vazio com ícones ou efeitos.

## Tokens
| Token | Valor | Uso |
|---|---|---|
| fundo | `#6DC8BF` liso | igual ao cartão da marca; sem degradê, raios, partículas, vinheta ou brilho |
| tinta | `#0D4C46` | todo o texto |
| ouro | relevo metálico (`.gold` em `brand.css`) | **um elemento por peça**: a data, o número ou o preço. Nunca palavras de uma frase |
| fio | 2px sólido `#A8770F` | separador opcional, no máximo um por peça |
| display | Cinzel 700 | data, número, nomes curtos. É a fonte mais próxima da tagline do logo |
| texto | Cormorant Garamond 600, **reto** | frases. Sem o truque de terminar o título em itálico |
| info | Montserrat 500/600 | endereço, @, WhatsApp |
| raio | 0 | nada de pílula ou botão falso; CTA é texto ("Siga @lojabluum") |

## Composição
- Frases longas alinhadas à **esquerda**, com margem de 110px. Logo, data e número ficam centralizados.
- Nada de rótulo em caixa alta acima do título, "ARRASTA →", contador "01/03" ou selo acima do título.
- Texto dentro da área segura: no Reels/Stories, y de 270 a 1250; no feed, margem de 90px.

## Movimento (Reels)
- Entrada: aparece subindo 28px com ease-out em 0,6s, sem efeito de mola. Saída: some em 0,35s.
- A câmera faz um zoom lento no quadro inteiro (1,00 → 1,04) durante o vídeo, em vez de efeitos extras.
- Cada texto fica na tela pelo menos (número de palavras ÷ 3 + 1) segundos.
- Nada de flash branco, número rolando, brilho passando ou explosão de partículas.
- A trilha continua original (`audio.js`), com impactos mais suaves.

## Texto
- Use as frases do manifesto e fatos concretos (data, endereço, preço).
- Evite frase genérica ("o toque final do look", "experiência única", "pensado para você"), pergunta retórica e tríade de frases curtas.
- Emoji só na legenda do post, e com moderação. Nunca dentro da arte.

## Registro de decisões
- **23/10:** fundo turquesa claro; trocar "lama" por "fundo das águas".
- **30/10:** usar o logo novo em alta resolução; remover as marcas de "cara de IA" apontadas pelo detector (gradiente em texto, serifa com itálico no fim, pílulas, efeitos de fundo, rótulos acima do título).
- **30/10:** os vídeos `index.html` e `index-data.html` saem de uso. O anúncio da data e o anúncio do Meta passam a sair do motor `reel.html`.
