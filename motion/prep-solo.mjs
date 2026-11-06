// Prepara os vídeos da loja pronta (WhatsApp de 06/11) para o solo.html: quadros 1080×1920 a 30 fps.
// Os brutos ficam em bruto-0611/<nome>.mp4 (fora do git). Rode: node prep-solo.mjs novo1 novo2 novo3
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

for (const name of process.argv.slice(2).length ? process.argv.slice(2) : ['clip1', 'clip2', 'clip3', 'clip4', 'clip5', 'clip6']) {
  const dir = join(here, 'footage', name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const r = spawnSync(FFMPEG, ['-y', '-v', 'error', '-i', join(here, 'bruto-0611', `${name}.mp4`),
    '-vf', 'fps=30,scale=1080:1920:flags=lanczos,unsharp=5:5:0.8:5:5:0,eq=contrast=1.05:saturation=1.12:brightness=0.015',
    '-q:v', '2', join(dir, '%04d.jpg')], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(1);
  console.log(name, readdirSync(dir).length, 'quadros');
}
