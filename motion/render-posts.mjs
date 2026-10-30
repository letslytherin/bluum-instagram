// Gera os PNGs de carrosséis, stories e capas de destaque definidos em posts.html.
//   node render-posts.mjs              -> out/posts/*.png (todos)
//   node render-posts.mjs story-vip-1  -> só os ids pedidos
import { chromium } from 'playwright';
import { mkdirSync, existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'out', 'posts');
mkdirSync(outDir, { recursive: true });

const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = createServer((req, res) => {
  const p = normalize(join(here, decodeURIComponent(req.url.split('?')[0])));
  if (!p.startsWith(here) || !existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('console', m => m.type() === 'error' && console.error('[page]', m.text()));
await page.goto(`http://127.0.0.1:${server.address().port}/posts.html`, { waitUntil: 'networkidle' });
await page.evaluate(() => window.ready);

const wanted = process.argv.slice(2);
const ids = wanted.length ? wanted : await page.evaluate(() => window.SLIDE_IDS);
for (const id of ids) {
  const size = await page.evaluate(id => window.show(id), id);
  await page.setViewportSize(size);
  await page.screenshot({ path: join(outDir, `${id}.png`), clip: { x: 0, y: 0, ...size } });
  console.log(id);
}
await browser.close();
server.close();
