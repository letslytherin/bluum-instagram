// Renderiza index.html quadro a quadro com Playwright e codifica com FFmpeg.
//   node render.mjs                -> out/bluum-meta-9x16.mp4
//   node render.mjs --stills 0.4,3.5,6,13.5,18   -> out/stills/*.png (revisão rápida)
//   --page index-data.html --out bluum-inauguracao-0711.mp4   -> outra peça
import { chromium } from 'playwright';
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync, readdirSync, readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, dirname, extname, normalize } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, 'out');
mkdirSync(outDir, { recursive: true });

function findFfmpeg() {
  if (process.env.FFMPEG) return process.env.FFMPEG;
  const base = join(process.env.LOCALAPPDATA || '', 'Microsoft', 'WinGet', 'Packages');
  if (existsSync(base)) {
    for (const pkg of readdirSync(base).filter(d => d.startsWith('Gyan.FFmpeg')).sort().reverse()) {
      for (const sub of readdirSync(join(base, pkg))) {
        const exe = join(base, pkg, sub, 'bin', 'ffmpeg.exe');
        if (existsSync(exe)) return exe;
      }
    }
  }
  return 'ffmpeg';
}
const FFMPEG = findFfmpeg();

const args = process.argv.slice(2);
const stillsArg = args.includes('--stills') ? args[args.indexOf('--stills') + 1] : null;
const pageArg = args.includes('--page') ? args[args.indexOf('--page') + 1] : 'index.html';
const outArg = args.includes('--out') ? args[args.indexOf('--out') + 1] : 'bluum-meta-9x16.mp4';

// http local: em file:// o canvas fica "tainted" e não dá para recortar o logo
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png' };
const server = createServer((req, res) => {
  const p = normalize(join(here, decodeURIComponent(req.url.split('?')[0]) === '/' ? 'index.html' : decodeURIComponent(req.url.split('?')[0])));
  if (!p.startsWith(here) || !existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { 'Content-Type': MIME[extname(p)] || 'application/octet-stream' });
  res.end(readFileSync(p));
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const url = `http://127.0.0.1:${server.address().port}/${pageArg}`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
page.on('console', m => m.type() === 'error' && console.error('[page]', m.text()));
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => window.ready);
const { DURATION, FPS } = await page.evaluate(() => ({ DURATION: window.DURATION, FPS: window.FPS }));

if (stillsArg) {
  const dir = join(outDir, 'stills');
  mkdirSync(dir, { recursive: true });
  for (const t of stillsArg.split(',').map(Number)) {
    await page.evaluate(t => window.render(t), t);
    await page.screenshot({ path: join(dir, `t${t.toFixed(2)}.png`) });
  }
  console.log('stills em', dir);
  await browser.close();
  server.close();
  process.exit(0);
}

console.log('trilha…');
const wavPath = join(outDir, `trilha-${process.pid}.wav`);
writeFileSync(wavPath, Buffer.from(await page.evaluate(() => window.renderAudio()), 'base64'));

const outFile = join(outDir, outArg);
mkdirSync(dirname(outFile), { recursive: true });
const ff = spawn(FFMPEG, [
  '-y', '-hide_banner', '-loglevel', 'error',
  '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'png', '-i', '-',
  '-i', wavPath,
  '-vf', 'noise=alls=2:allf=t,format=yuv420p',
  '-af', `afade=t=out:st=${DURATION - 1.2}:d=1.2,loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000`,
  '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-profile:v', 'high', '-r', String(FPS),
  '-c:a', 'aac', '-b:a', '192k',
  '-t', String(DURATION), '-movflags', '+faststart',
  outFile,
], { stdio: ['pipe', 'inherit', 'inherit'] });
const done = new Promise((res, rej) => ff.on('close', c => (c === 0 ? res() : rej(new Error('ffmpeg saiu com ' + c)))));

const total = DURATION * FPS;
for (let f = 0; f < total; f++) {
  await page.evaluate(t => window.render(t), f / FPS);
  const png = await page.screenshot({ type: 'png' });
  if (!ff.stdin.write(png)) await new Promise(r => ff.stdin.once('drain', r));
  if (f % 60 === 0) console.log(`quadro ${f}/${total}`);
}
ff.stdin.end();
await done;
await browser.close();
server.close();
console.log('pronto:', outFile);
