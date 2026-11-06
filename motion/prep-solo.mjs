// Prepara os vídeos da loja pronta (WhatsApp de 06/11) para o solo.html: quadros 1080×1920 a 30 fps.
// Os brutos ficam em bruto-0611/clipN.mp4 (fora do git). Rode: node prep-solo.mjs
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

for (let i = 1; i <= 6; i++) {
  const dir = join(here, 'footage', `solo${i}`);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const r = spawnSync(FFMPEG, ['-y', '-v', 'error', '-i', join(here, 'bruto-0611', `clip${i}.mp4`),
    '-vf', 'fps=30,scale=1080:1920:flags=lanczos,unsharp=5:5:0.8:5:5:0,eq=contrast=1.05:saturation=1.12:brightness=0.015',
    '-q:v', '2', join(dir, '%04d.jpg')], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(1);
  console.log(`solo${i}`, readdirSync(dir).length, 'quadros');
}
