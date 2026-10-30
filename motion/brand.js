// Kit de marca Bluum compartilhado por reel.html e posts.html:
// easing, posicionamento, logo recortado do JPG, partículas douradas e ícones.
const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const p = (t, a, b) => clamp((t - a) / (b - a));
const lerp = (a, b, k) => a + (b - a) * k;
const eOut = k => 1 - Math.pow(1 - k, 3);
const eInOut = k => k < .5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
const eBack = k => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
const eExpo = k => k === 1 ? 1 : 1 - Math.pow(2, -10 * k);

function place(el, { x = 540, y = 960, s = 1, o = 1, blur = 0, r = 0 } = {}) {
  el.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) rotate(${r}deg) scale(${s})`;
  el.style.opacity = o;
  const base = el.dataset.filter || '';
  el.style.filter = (base + (blur > 0.05 ? ` blur(${blur}px)` : '')).trim();
  el.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
}
const shineAt = (el, k) => { el.style.backgroundPosition = `${lerp(110, -10, k)}% 0`; };

const GOLD_DEFS = `<svg width="0" height="0" style="position:absolute"><defs><linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#e2b955"/><stop offset=".35" stop-color="#b5830d"/><stop offset=".7" stop-color="#84580a"/><stop offset="1" stop-color="#cf9f38"/>
  </linearGradient></defs></svg>`;

// ícones em traço dourado (viewBox 0 0 200 200), mesmos do vídeo principal
const ICONS = {
  make: '<path pathLength="1" d="M66 112 h68 v70 a4 4 0 0 1 -4 4 h-60 a4 4 0 0 1 -4 -4 z"/><path pathLength="1" d="M66 126 h68 M66 170 h68"/><path pathLength="1" d="M76 112 v-30 h48 v30"/><path pathLength="1" d="M82 82 v-36 q0 -16 18 -26 l18 14 q6 6 6 16 v32"/>',
  cosmeticos: '<path pathLength="1" d="M64 96 q0 -12 12 -12 h48 q12 0 12 12 v80 q0 12 -12 12 h-48 q-12 0 -12 -12 z"/><path pathLength="1" d="M84 84 v-14 h32 v14"/><path pathLength="1" d="M88 70 v-22 q0 -22 12 -26 q12 4 12 26 v22"/><path pathLength="1" d="M78 118 h44 v38 h-44 z"/>',
  acessorios: '<path pathLength="1" d="M100 18 q20 0 18 20 q-2 16 -18 20"/><circle pathLength="1" cx="100" cy="70" r="11"/><path pathLength="1" d="M100 86 q34 42 0 92 q-34 -50 0 -92 z"/><path pathLength="1" d="M100 112 q14 18 0 40 q-14 -22 0 -40 z"/>',
  caixa: '<path pathLength="1" d="M40 78 L100 50 L160 78 L100 106 Z"/><path pathLength="1" d="M40 78 V146 L100 174 L160 146 V78"/><path pathLength="1" d="M100 106 V174"/><path pathLength="1" d="M70 64 L130 92 V118"/>',
  etiqueta: '<path pathLength="1" d="M104 30 H164 V90 L94 160 Q86 168 78 160 L34 116 Q26 108 34 100 Z"/><circle pathLength="1" cx="138" cy="56" r="10"/><path pathLength="1" d="M78 104 h34 M86 122 h18"/>',
  pin: '<path pathLength="1" d="M100 178 C100 178 44 116 44 78 C44 46 70 22 100 22 C130 22 156 46 156 78 C156 116 100 178 100 178 Z"/><circle pathLength="1" cx="100" cy="78" r="22"/>',
  estrela: '<path pathLength="1" d="M100 24 L120 78 L176 80 L132 114 L148 170 L100 138 L52 170 L68 114 L24 80 L80 78 Z"/>',
  relogio: '<circle pathLength="1" cx="100" cy="104" r="64"/><path pathLength="1" d="M100 64 V104 L128 122"/><path pathLength="1" d="M78 24 h44 M100 24 v16"/>',
  coracao: '<path pathLength="1" d="M100 170 C40 126 28 96 36 70 C44 44 78 36 100 62 C122 36 156 44 164 70 C172 96 160 126 100 170 Z"/>',
};
const iconSvg = (name, size = 200, cls = 'icon-line') => `<svg class="${cls}" width="${size}" height="${size}" viewBox="0 0 200 200" style="overflow:visible">${ICONS[name]}</svg>`;

async function fontsReady() {
  await Promise.all([
    document.fonts.load('700 100px Cinzel'), document.fonts.load('600 100px "Cormorant Garamond"'),
    document.fonts.load('italic 600 100px "Cormorant Garamond"'), document.fonts.load('600 40px Montserrat'),
    document.fonts.load('700 40px Montserrat'), document.fonts.load('500 40px Montserrat'),
  ]);
}

// Remove o fundo turquesa do JPG do logo e devolve lótus, wordmark e tagline como PNG transparente.
async function keyLogo(src = 'assets/logo.jpg') {
  const img = new Image();
  img.src = src;
  await img.decode();
  const cv = document.createElement('canvas');
  cv.width = img.naturalWidth; cv.height = img.naturalHeight;
  const cx = cv.getContext('2d', { willReadFrequently: true });
  cx.drawImage(img, 0, 0);
  const d = cx.getImageData(0, 0, cv.width, cv.height);
  const px = d.data;
  let br = 0, bgc = 0, bb = 0, n = 0;
  for (let x = 0; x < cv.width; x += 7) for (const y of [4, cv.height - 5]) {
    const i = (y * cv.width + x) * 4; br += px[i]; bgc += px[i + 1]; bb += px[i + 2]; n++;
  }
  br /= n; bgc /= n; bb /= n;
  for (let i = 0; i < px.length; i += 4) {
    const dist = Math.hypot(px[i] - br, px[i + 1] - bgc, px[i + 2] - bb);
    let a = clamp((dist - 44) / 76);
    a = a * a * (3 - 2 * a);
    if (a < 0.01) { px[i + 3] = 0; continue; }
    px[i] = clamp((px[i] - br * (1 - a)) / a, 0, 255);
    px[i + 1] = clamp((px[i + 1] - bgc * (1 - a)) / a, 0, 255);
    px[i + 2] = clamp((px[i + 2] - bb * (1 - a)) / a, 0, 255);
    px[i + 3] = Math.round(a * 255);
  }
  cx.putImageData(d, 0, 0);
  function crop(x0, y0, x1, y1) {
    let minX = x1, minY = y1, maxX = x0, maxY = y0;
    for (let y = y0; y < y1; y++) for (let x = x0; x < x1; x++) {
      if (px[(y * cv.width + x) * 4 + 3] > 60) {
        if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y;
      }
    }
    const pad = 6;
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(cv.width - 1, maxX + pad); maxY = Math.min(cv.height - 1, maxY + pad);
    const o = document.createElement('canvas');
    o.width = maxX - minX + 1; o.height = maxY - minY + 1;
    o.getContext('2d').drawImage(cv, minX, minY, o.width, o.height, 0, 0, o.width, o.height);
    return { url: o.toDataURL('image/png'), w: o.width, h: o.height };
  }
  // recortes para o logo em alta (1600×879, enviado em 30/10)
  return { lotus: crop(560, 100, 1040, 455), word: crop(40, 455, 1560, 680), tag: crop(300, 680, 1300, 770) };
}

// Partículas douradas determinísticas: a posição é função do tempo, então qualquer quadro pode ser refeito.
function rng(seed) { return () => (seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296; }
function makeParticles(canvas, { count = 90, seed = 7 } = {}) {
  const W = canvas.width, H = canvas.height, R = rng(seed);
  const ctx = canvas.getContext('2d');
  const dust = Array.from({ length: count }, () => ({
    x: R() * W, y: R() * H, sp: 18 + R() * 55, sz: 1.5 + Math.pow(R(), 3) * 9, ph: R() * 6.28,
    sw: 10 + R() * 30, tw: 0.6 + R() * 2.2, depth: R(),
  }));
  const burst = Array.from({ length: 70 }, () => ({ ang: R() * 6.28, v: 260 + R() * 900, sz: 2 + R() * 6, life: 0.9 + R() * 1.3 }));
  function dot(x, y, r, a) {
    const g = ctx.createRadialGradient(x, y, 0, x, y, r * 3);
    g.addColorStop(0, `rgba(255,255,250,${a})`);
    g.addColorStop(0.3, `rgba(250,225,150,${a * .6})`);
    g.addColorStop(1, 'rgba(244,205,110,0)');
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 3, 0, 6.283); ctx.fill();
  }
  // bursts: [[t0, cx, cy], ...]
  return function draw(t, bursts = []) {
    ctx.clearRect(0, 0, W, H);
    for (const q of dust) {
      const y = ((q.y - t * q.sp * (0.6 + q.depth)) % H + H) % H;
      const x = q.x + Math.sin(t * 0.7 + q.ph) * q.sw;
      const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * q.tw + q.ph));
      dot(x, y, q.sz * (0.6 + q.depth * 0.6), a * 0.8);
    }
    for (const [t0, cx, cy] of bursts) {
      const dt = t - t0;
      if (dt < 0 || dt > 2.4) continue;
      for (const b of burst) {
        if (dt > b.life) continue;
        const k = dt / b.life;
        const dist = b.v * eExpo(Math.min(1, dt / 1.1)) * 0.75;
        dot(cx + Math.cos(b.ang) * dist, cy + Math.sin(b.ang) * dist * 0.9 + 60 * k * k, b.sz * (1 - k * .5), (1 - k) * 0.9);
      }
    }
  };
}
