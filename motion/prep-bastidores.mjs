// Corta os vídeos reais da montagem da loja (assets/bastidores) em sequências de quadros 1080×1920
// que o vemai.html usa. Rode uma vez antes de renderizar: node prep-bastidores.mjs
import { spawnSync } from 'node:child_process';
import { mkdirSync, rmSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const FFMPEG = process.env.FFMPEG || 'ffmpeg';

// ss = início no vídeo original, speed = aceleração, dur = segundos de saída
export const SHOTS = {
  vitrine:     { src: 'montagem-2.mp4', ss: 0.0,  speed: 1.0, dur: 2.1 },
  prateleiras: { src: 'montagem-1.mp4', ss: 0.0,  speed: 1.5, dur: 1.1 },
  ripado:      { src: 'montagem-2.mp4', ss: 2.3,  speed: 1.5, dur: 1.1 },
  balcao:      { src: 'montagem-1.mp4', ss: 4.8,  speed: 1.2, dur: 1.05 },
  parede:      { src: 'montagem-2.mp4', ss: 15.0, speed: 1.5, dur: 1.1 },
};

for (const [name, s] of Object.entries(SHOTS)) {
  const dir = join(here, 'footage', name);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
  const r = spawnSync(FFMPEG, ['-y', '-v', 'error', '-ss', String(s.ss), '-i', join(here, 'assets', 'bastidores', s.src),
    '-vf', `setpts=PTS/${s.speed},fps=30,scale=1080:1920:flags=lanczos,unsharp=5:5:0.7:5:5:0,eq=contrast=1.06:saturation=1.15:brightness=0.01`,
    '-frames:v', String(Math.ceil(s.dur * 30)), '-q:v', '3', join(dir, '%04d.jpg')], { stdio: 'inherit' });
  if (r.status !== 0) process.exit(1);
  console.log(name, readdirSync(dir).length, 'quadros');
}
