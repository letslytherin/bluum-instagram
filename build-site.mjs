// Gera index.html (o site do time no GitHub Pages) a partir de data/calendario-atual.json
// e dos arquivos em motion/out/. Rode `node build-site.mjs` depois de atualizar o calendário ou as peças.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';

const cal = JSON.parse(readFileSync('data/calendario-atual.json', 'utf8'));
const INA = cal.inauguracao;
const REPO = 'https://github.com/letslytherin/bluum-instagram/blob/main/';
const PAINEL = 'https://claude.ai/artifact/61AikGiPMCodm7XJBbZXL4';
const WD = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const FMT = { reels: 'Reels', carrossel: 'Carrossel', stories: 'Stories', post: 'Post no feed' };

const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const addDays = (s, n) => { const d = new Date(s + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
const postsDir = existsSync('motion/out/posts') ? readdirSync('motion/out/posts') : [];

function mediaOf(p) {
  const found = new Set();
  for (const m of (p.roteiro || []).join(' ').matchAll(/motion\/out\/(posts|reels)\/([\w.-]+\.(?:png|mp4))/g)) {
    const series = m[2].match(/^(carrossel-[a-z-]+?)-1\.png$/);
    if (series) postsDir.filter(f => f.startsWith(series[1] + '-')).sort().forEach(f => found.add(`motion/out/posts/${f}`));
    else found.add(`motion/out/${m[1]}/${m[2]}`);
  }
  return [...found].filter(f => existsSync(f));
}

const posts = cal.posts.map(p => ({ ...p, d: p.date || (p.rel != null ? addDays(INA, p.rel) : null) }));
const agenda = posts.filter(p => p.d).sort((a, b) => (a.d + a.hora).localeCompare(b.d + b.hora));
const ideias = posts.filter(p => !p.d);

function postHtml(p, n) {
  const media = mediaOf(p);
  const legenda = p.legenda ? p.legenda + (p.hashtags ? '\n\n' + p.hashtags : '') : '';
  const passos = (p.roteiro || []).map(s => s.replace(/motion\/out\/(posts|reels)\//g, ''));
  return `<article class="post" id="${esc(p.id)}">
    <div class="meta"><span class="n">${n}</span><span class="hora">${esc(p.hora)}</span><span class="fmt">${esc(FMT[p.formato] || p.formato)}</span><span class="st st-${esc(p.status)}">${esc(p.status)}</span></div>
    <h3>${esc(p.titulo)}</h3>
    ${media.length ? `<div class="media">${media.map(f => f.endsWith('.mp4')
      ? `<figure><video src="${f}" controls preload="metadata" playsinline></video><figcaption><a href="${f}" download>Baixar ${esc(f.split('/').pop())}</a></figcaption></figure>`
      : `<figure><a href="${f}"><img src="${f}" loading="lazy" alt="${esc(p.titulo)}"></a><figcaption><a href="${f}" download>Baixar ${esc(f.split('/').pop())}</a></figcaption></figure>`).join('')}</div>`
      : '<p class="sem">Sem arte pronta: gravar ou montar na hora.</p>'}
    ${legenda ? `<div class="legenda"><div class="lh"><span>Legenda</span><button type="button" data-copy>Copiar legenda</button></div><pre>${esc(legenda)}</pre></div>` : ''}
    ${passos.length ? `<details><summary>Como postar</summary><ul>${passos.map(s => `<li>${esc(s)}</li>`).join('')}</ul></details>` : ''}
    ${(p.precisa || []).length ? `<p class="falta">Falta: ${esc(p.precisa.join('; '))}</p>` : ''}
  </article>`;
}

let n = 0, day = '', body = '';
for (const p of agenda) {
  if (p.d !== day) {
    if (day) body += '</section>';
    day = p.d;
    const dt = new Date(p.d + 'T12:00:00');
    body += `<section class="dia${p.d === INA ? ' dday' : ''}" data-date="${p.d}"><h2>${WD[dt.getDay()]}, ${dt.getDate()} de ${MES[dt.getMonth()]}${p.d === INA ? ' · inauguração' : ''}</h2>`;
  }
  body += postHtml(p, ++n);
}
if (day) body += '</section>';

const html = `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bluum · Instagram da inauguração</title>
<meta name="robots" content="noindex">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600&family=Montserrat:wght@400;500;600&display=swap" rel="stylesheet">
<style>
  /* Visual de DESIGN.md: turquesa liso da marca, tinta escura, sem enfeite. */
  :root { --fundo: #6dc8bf; --papel: #f4fbfa; --tinta: #0d4c46; --suave: #3d7a73; --fio: rgba(13,76,70,.18); --ouro: #8c5f08; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--papel); color: var(--tinta); font: 16px/1.55 Montserrat, system-ui, sans-serif; }
  header { background: var(--fundo); padding: 28px max(20px, env(safe-area-inset-left)) 30px; }
  .wrap { max-width: 980px; margin: 0 auto; }
  header img { width: min(420px, 90%); display: block; }
  header h1 { font: 600 34px/1.15 'Cormorant Garamond', Georgia, serif; margin: 18px 0 6px; }
  header p { margin: 4px 0; }
  .conta { font-weight: 600; font-size: 18px; }
  .links { margin-top: 14px; display: flex; flex-wrap: wrap; gap: 8px 18px; }
  a { color: var(--tinta); }
  main { padding: 8px max(20px, env(safe-area-inset-left)) 60px; }
  .aviso { font-size: 14px; color: var(--suave); margin: 18px 0 0; }
  .dia { border-top: 2px solid var(--tinta); margin-top: 36px; padding-top: 6px; }
  .dia.dday h2 { color: var(--ouro); }
  .dia.passado { opacity: .55; }
  h2 { font: 600 28px/1.2 'Cormorant Garamond', Georgia, serif; margin: 6px 0 4px; text-transform: none; }
  .post { padding: 20px 0; border-bottom: 1px solid var(--fio); }
  .meta { display: flex; flex-wrap: wrap; gap: 6px 14px; font-size: 14px; color: var(--suave); }
  .meta .n { font-weight: 600; color: var(--tinta); }
  .meta .hora { font-weight: 600; color: var(--tinta); }
  h3 { font: 600 24px/1.25 'Cormorant Garamond', Georgia, serif; margin: 4px 0 12px; }
  .media { display: flex; gap: 12px; overflow-x: auto; padding-bottom: 6px; }
  figure { margin: 0; flex: none; width: 220px; }
  figure img, figure video { width: 100%; display: block; background: var(--fundo); border: 1px solid var(--fio); }
  figcaption { font-size: 13px; margin-top: 4px; word-break: break-all; }
  .sem { font-size: 14px; color: var(--suave); }
  .legenda { margin-top: 14px; border: 1px solid var(--fio); background: #fff; }
  .lh { display: flex; justify-content: space-between; align-items: center; padding: 8px 12px; border-bottom: 1px solid var(--fio); font-size: 14px; font-weight: 600; }
  button { font: 600 14px Montserrat, sans-serif; color: #fff; background: var(--tinta); border: 0; padding: 7px 12px; cursor: pointer; }
  button:focus-visible, a:focus-visible, summary:focus-visible { outline: 2px solid var(--ouro); outline-offset: 2px; }
  pre { margin: 0; padding: 12px; white-space: pre-wrap; font: 15px/1.5 Montserrat, sans-serif; }
  details { margin-top: 10px; font-size: 15px; }
  summary { cursor: pointer; font-weight: 600; }
  .falta { margin: 10px 0 0; font-size: 14px; font-weight: 600; color: #8a4b00; }
  .ideias li { margin: 6px 0; }
  footer { font-size: 13px; color: var(--suave); padding: 30px 20px; text-align: center; }
  @media (max-width: 600px) { figure { width: 70vw; } header h1 { font-size: 28px; } }
</style>
</head>
<body>
<header><div class="wrap">
  <img src="motion/assets/logo.jpg" alt="Bluum: make, cosméticos e acessórios">
  <h1>Instagram da inauguração</h1>
  <p class="conta" id="conta">Inauguração: sábado, 7 de novembro</p>
  <p>Estrada de Águas Compridas, 392 · Olinda · @lojabluum</p>
  <div class="links">
    <a href="${PAINEL}">Painel (marcar o que foi postado)</a>
    <a href="${REPO}docs/ESTRATEGIA.md">Estratégia</a>
    <a href="${REPO}DESIGN.md">Visual da marca</a>
    <a href="${REPO}data/fatos.md">Fatos da loja</a>
  </div>
</div></header>
<main><div class="wrap">
  <p class="aviso">Calendário copiado do painel em ${esc(cal.exportado)}. Se algo mudou no painel, vale o painel. Preço: sempre "a partir de R$ 4,99".</p>
  ${body}
  <section class="dia"><h2>Banco de ideias</h2><ul class="ideias">${ideias.map(p => `<li><strong>${esc(p.titulo)}</strong>${p.gancho ? ` · ${esc(p.gancho)}` : ''}</li>`).join('')}</ul></section>
</div></main>
<footer>Bluum · Olinda-PE</footer>
<script>
  // contagem até a inauguração e dias já passados esmaecidos
  const hoje = new Date(); hoje.setHours(12, 0, 0, 0);
  const dias = Math.round((new Date('${INA}T12:00:00') - hoje) / 864e5);
  document.getElementById('conta').textContent = dias > 1 ? 'Faltam ' + dias + ' dias para a inauguração (sábado, 7 de novembro)'
    : dias === 1 ? 'A inauguração é amanhã, sábado, 7 de novembro' : dias === 0 ? 'Hoje é a inauguração!' : 'Inauguração: sábado, 7 de novembro';
  const iso = hoje.toISOString().slice(0, 10);
  document.querySelectorAll('.dia[data-date]').forEach(s => { if (s.dataset.date < iso) s.classList.add('passado'); });
  document.querySelectorAll('[data-copy]').forEach(b => b.addEventListener('click', async () => {
    const txt = b.closest('.legenda').querySelector('pre').textContent;
    try { await navigator.clipboard.writeText(txt); b.textContent = 'Copiado'; }
    catch (e) { const r = document.createRange(); r.selectNodeContents(b.closest('.legenda').querySelector('pre')); getSelection().removeAllRanges(); getSelection().addRange(r); b.textContent = 'Selecionado: Ctrl+C'; }
    setTimeout(() => { b.textContent = 'Copiar legenda'; }, 2000);
  }));
</script>
</body>
</html>
`;
writeFileSync('index.html', html);
console.log(`index.html: ${agenda.length} posts na agenda, ${ideias.length} ideias`);
