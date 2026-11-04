// Personagens das historinhas (pitanga e caju) em SVG, com rosto expressivo, boca que abre com a voz,
// braços por pose, pernas que andam e acessórios (laço, brinco, batom, sacolas da Bluum).
const SVGNS = 'http://www.w3.org/2000/svg';

function lobed(r0, n, amp, sy = 0.93) {
  let d = '';
  for (let i = 0; i <= 96; i++) { const a = i / 96 * Math.PI * 2, r = r0 * (1 + amp * Math.cos(n * a)); d += (i ? 'L' : 'M') + (r * Math.sin(a)).toFixed(1) + ',' + (-r * Math.cos(a) * sy).toFixed(1); }
  return d + 'Z';
}
function faceSvg(id) {
  const eye = s => `<g id="${id}eye${s}" transform="translate(${s * 44},-12)"><g class="lid"><ellipse rx="27" ry="31" fill="#fff" stroke="#2a1414" stroke-width="5"/>
      <g class="pup"><circle r="14" fill="#2a1414"/><circle cx="-5" cy="-6" r="5" fill="#fff"/></g>
      <path class="star" d="M0,-20 L6,-6 L20,-6 L9,3 L13,18 L0,9 L-13,18 L-9,3 L-20,-6 L-6,-6Z" fill="#f2c94c" stroke="#a8770f" stroke-width="3" opacity="0"/></g></g>`;
  return `${eye(-1)}${eye(1)}
    <rect id="${id}browL" x="-24" y="-6" width="48" height="12" rx="6" fill="#2a1414"/>
    <rect id="${id}browR" x="-24" y="-6" width="48" height="12" rx="6" fill="#2a1414"/>
    <ellipse id="${id}blushL" cx="-74" cy="30" rx="18" ry="11" fill="#ff8fa3" opacity=".7"/><ellipse id="${id}blushR" cx="74" cy="30" rx="18" ry="11" fill="#ff8fa3" opacity=".7"/>
    <g id="${id}tears" opacity="0"><path class="tear" d="M-50,22 q-9,16 0,22 q9,-6 0,-22Z" fill="#8fd3ff" stroke="#3a7fb0" stroke-width="3"/><path class="tear" d="M50,22 q-9,16 0,22 q9,-6 0,-22Z" fill="#8fd3ff" stroke="#3a7fb0" stroke-width="3"/></g>
    <g transform="translate(0,46)"><ellipse id="${id}mo" rx="24" ry="4" fill="#5a0f12" stroke="#2a1414" stroke-width="5"/>
      <path id="${id}mi" d="" fill="none" stroke="#2a1414" stroke-width="7" stroke-linecap="round"/></g>`;
}
const LOTUS_MARK = `<path d="M0,-14 C6,-6 6,4 0,10 C-6,4 -6,-6 0,-14Z M0,10 C-10,8 -16,0 -16,-8 C-8,-6 -3,0 0,10Z M0,10 C10,8 16,0 16,-8 C8,-6 3,0 0,10Z" fill="#f2c94c" stroke="#a8770f" stroke-width="1.5"/>`;
function bagSvg(id) {
  return `<g id="${id}" opacity="0"><path d="M-16,-34 Q0,-56 16,-34" fill="none" stroke="#0d4c46" stroke-width="5"/>
    <rect x="-30" y="-34" width="60" height="66" rx="5" fill="#6dc8bf" stroke="#0d4c46" stroke-width="5"/><g transform="translate(0,2) scale(1.2)">${LOTUS_MARK}</g></g>`;
}

const CHAR = {
  P: { // pitanga: gomos fundos, vermelho-alaranjado, cabinho
    shoulder: [112, 10], hips: [38, 112],
    svg: `<defs><radialGradient id="gP" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#ff8a5c"/><stop offset=".45" stop-color="#f0402a"/><stop offset="1" stop-color="#b3121a"/></radialGradient></defs>
      <path d="${lobed(128, 8, 0.065)}" fill="url(#gP)" stroke="#7a0d12" stroke-width="5"/>
      ${[-100, -58, -20, 20, 58, 100].map(dx => `<path d="M0,-112 Q${dx},0 0,114" fill="none" stroke="rgba(100,0,10,.42)" stroke-width="6"/>`).join('')}
      <ellipse cx="-50" cy="-70" rx="30" ry="16" fill="#fff" opacity=".28" transform="rotate(-30 -50 -70)"/>
      <g transform="translate(0,-110)">${[0, 90, 180, 270].map(a => `<ellipse rx="6" ry="14" cy="-8" fill="#6b8a2e" stroke="#3d5418" stroke-width="3" transform="rotate(${a + 45})"/>`).join('')}<path d="M0,-6 L4,-30" stroke="#5b4320" stroke-width="7" stroke-linecap="round"/></g>`,
    acc: `<g id="Pbow" opacity="0" transform="translate(-70,-96) rotate(-18)"><path d="M0,0 C-30,-26 -54,-6 -44,14 C-36,30 -12,14 0,0Z M0,0 C30,-26 54,-6 44,14 C36,30 12,14 0,0Z" fill="#ff7eb3" stroke="#a3164f" stroke-width="5"/><circle r="11" fill="#f2c94c" stroke="#a8770f" stroke-width="4"/></g>
      <g id="Pear" opacity="0"><circle cx="-124" cy="34" r="15" fill="none" stroke="#e8b92f" stroke-width="7"/><circle cx="124" cy="34" r="15" fill="none" stroke="#e8b92f" stroke-width="7"/></g>`,
  },
  C: { // caju: fruto em pera amarelo-vermelho com a castanha de chapéu
    shoulder: [104, 20], hips: [38, 122],
    svg: `<defs><linearGradient id="gC" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe066"/><stop offset=".5" stop-color="#f7a32b"/><stop offset="1" stop-color="#e2452a"/></linearGradient></defs>
      <path d="M0,-118 C72,-118 96,-58 102,2 C110,82 70,132 0,132 C-70,132 -110,82 -102,2 C-96,-58 -72,-118 0,-118Z" fill="url(#gC)" stroke="#9a3a12" stroke-width="5"/>
      <ellipse cx="-46" cy="-62" rx="26" ry="14" fill="#fff" opacity=".35" transform="rotate(-30 -46 -62)"/>
      <g transform="translate(14,-138) rotate(-14)"><path d="M-62,4 C-70,-42 -4,-60 30,-44 C64,-30 66,10 42,20 C26,26 14,8 -2,10 C-22,12 -54,34 -62,4Z" fill="#c9a77c" stroke="#7a5a35" stroke-width="5"/>
        <path d="M-40,-10 C-20,-30 10,-34 30,-26" fill="none" stroke="#e6cfa8" stroke-width="5" stroke-linecap="round"/></g>`,
    acc: '',
  },
};

function makeChar(k, parent) {
  const g = document.createElementNS(SVGNS, 'svg');
  g.setAttribute('class', 'char'); g.setAttribute('width', '1'); g.setAttribute('height', '1');
  const [hx, hy] = CHAR[k].hips;
  const leg = s => `<g id="${k}leg${s}" transform="translate(${s * hx},${hy})"><path d="M0,0 L${s * 4},56" stroke="#2a1414" stroke-width="10" stroke-linecap="round"/><ellipse cx="${s * 12}" cy="62" rx="26" ry="12" fill="#2a1414"/></g>`;
  g.innerHTML = `<g id="${k}root"><ellipse id="${k}glow" cx="0" cy="0" rx="230" ry="230" fill="url(#glow${k})" opacity="0"/>
    <defs><radialGradient id="glow${k}"><stop offset="0" stop-color="#fff6c8" stop-opacity=".9"/><stop offset="1" stop-color="#fff6c8" stop-opacity="0"/></radialGradient></defs>
    <g id="${k}body">${leg(-1)}${leg(1)}<path id="${k}armL" fill="none" stroke="#2a1414" stroke-width="10" stroke-linecap="round"/><path id="${k}armR" fill="none" stroke="#2a1414" stroke-width="10" stroke-linecap="round"/>
    ${CHAR[k].svg}<g id="${k}face">${faceSvg(k)}</g>${CHAR[k].acc}
    <circle id="${k}hL" r="16" fill="#fff" stroke="#2a1414" stroke-width="5"/><circle id="${k}hR" r="16" fill="#fff" stroke="#2a1414" stroke-width="5"/>
    <g id="${k}bagWrapL">${bagSvg(k + 'bagL')}</g><g id="${k}bagWrapR">${bagSvg(k + 'bagR')}</g></g></g>`;
  parent.appendChild(g);
  const q = s => g.querySelector('#' + k + s);
  return { k, svg: g, root: q('root'), body: q('body'), eyes: [q('eye-1'), q('eye1')], browL: q('browL'), browR: q('browR'), mo: q('mo'), mi: q('mi'),
    armL: q('armL'), armR: q('armR'), hL: q('hL'), hR: q('hR'), legL: q('leg-1'), legR: q('leg1'), tears: q('tears'), glow: q('glow'),
    bow: q('bow'), ear: q('ear'), bagL: q('bagL'), bagR: q('bagR'), bagWrapL: q('bagWrapL'), bagWrapR: q('bagWrapR'), blush: [q('blushL'), q('blushR')] };
}

const EMO = {
  triste:  { by: -50, rl: -22, rr: 22, idle: 'M-22,12 Q0,-6 22,12', es: 0.92, look: 0, lookY: 6 },
  raiva:   { by: -50, rl: 24, rr: -24, idle: 'M-26,10 Q0,-12 26,10', es: 1.0 },
  duvida:  { by: -56, rl: -6, rr: 18, idle: 'M-20,4 Q2,-2 22,6', es: 1.05 },
  surpresa:{ by: -70, rl: -10, rr: 10, idle: 'o', es: 1.18 },
  brilho:  { by: -70, rl: -12, rr: 12, idle: 'M-34,-6 Q0,34 34,-6', es: 1.15 },
  feliz:   { by: -62, rl: -6, rr: 6, idle: 'M-30,-4 Q0,26 30,-4', es: 1.0 },
};
const popK = (k) => k <= 0 ? 0 : eBack(Math.min(1, k));

function drawChar(c, t, o) {
  const { x, y, s = 1, emo = 'feliz', env = 0, talking = false, pose = 'baixo', look = 0, sh = [0, 0], walk = 0, flip = 1, acc = {}, glow = 0, tears = 0 } = o;
  const e = EMO[emo];
  const step = walk ? Math.sin(t * 11) : 0;
  const bob = walk ? -Math.abs(step) * 14 : talking ? -Math.abs(Math.sin(t * 9)) * 10 : Math.sin(t * 2.4 + (c.k === 'C' ? 1.3 : 0)) * 4;
  const sad = emo === 'triste';
  const sq = 1 + (talking ? 0.025 * Math.sin(t * 18) : 0.012 * Math.sin(t * 2.4));
  c.root.setAttribute('transform', `translate(${x + sh[0]},${y + bob + sh[1] + (sad ? 8 : 0)}) scale(${s * flip},${s})`);
  c.body.setAttribute('transform', `scale(${1 / sq},${sq}) rotate(${(talking ? Math.sin(t * 5) * 2.5 : 0) + (sad && !walk ? 4 : 0)})`);
  c.legL.setAttribute('transform', `translate(${-CHAR[c.k].hips[0]},${CHAR[c.k].hips[1]}) rotate(${step * 22})`);
  c.legR.setAttribute('transform', `translate(${CHAR[c.k].hips[0]},${CHAR[c.k].hips[1]}) rotate(${-step * 22})`);
  const ph = (t + (c.k === 'C' ? 1.1 : 0)) % 2.8, blink = ph < 0.13 ? 0.12 : 1;
  c.eyes.forEach(ey => {
    ey.querySelector('.lid').setAttribute('transform', `scale(${e.es},${e.es * blink * (sad ? 0.82 : 1)})`);
    ey.querySelector('.pup').setAttribute('transform', `translate(${(e.look ?? look) * 9},${e.lookY || 0})`);
    const star = emo === 'brilho';
    ey.querySelector('.pup').setAttribute('opacity', star ? 0 : 1);
    ey.querySelector('.star').setAttribute('opacity', star ? 1 : 0);
    ey.querySelector('.star').setAttribute('transform', `rotate(${t * 90}) scale(${1 + 0.15 * Math.sin(t * 10)})`);
  });
  c.browL.setAttribute('transform', `translate(-44,${e.by + (talking ? -4 * env : 0)}) rotate(${e.rl})`);
  c.browR.setAttribute('transform', `translate(44,${e.by + (talking ? -4 * env : 0)}) rotate(${e.rr})`);
  // lágrimas escorrendo
  c.tears.setAttribute('opacity', tears);
  c.tears.querySelectorAll('.tear').forEach((tr, i) => tr.setAttribute('transform', `translate(0,${((t * 40 + i * 25) % 50)})`));
  // boca (com batom quando a pitanga já comprou)
  const lips = acc.lips || 0;
  const open = talking && env > 0.04;
  c.mo.setAttribute('ry', open ? 4 + 30 * env : (e.idle === 'o' ? 14 : 0.01));
  c.mo.setAttribute('rx', open ? 22 + 8 * env : (e.idle === 'o' ? 14 : 0.01));
  c.mo.setAttribute('fill', lips > 0.5 ? '#9b0f3a' : '#5a0f12');
  c.mo.setAttribute('stroke', lips > 0.5 ? '#d81b60' : '#2a1414');
  c.mi.setAttribute('d', open || e.idle === 'o' ? '' : e.idle);
  c.mi.setAttribute('stroke', lips > 0.5 ? '#d81b60' : '#2a1414');
  c.mi.setAttribute('stroke-width', lips > 0.5 ? 10 : 7);
  if (c.bow) { const k = popK(acc.bow || 0); c.bow.setAttribute('opacity', k > 0 ? 1 : 0); c.bow.setAttribute('transform', `translate(-70,-96) rotate(-18) scale(${k})`); }
  if (c.ear) { const k = popK(acc.ear || 0); c.ear.setAttribute('opacity', k > 0 ? 1 : 0); c.ear.setAttribute('transform', `translate(0,${Math.sin(t * 6) * 2}) scale(1,${k})`); }
  c.blush.forEach(b => b.setAttribute('opacity', 0.7 + 0.3 * (acc.lips || 0)));
  c.glow.setAttribute('opacity', glow * (0.75 + 0.25 * Math.sin(t * 4)));
  // braços
  const [sx, sy] = CHAR[c.k].shoulder, w = Math.sin(t * 7);
  const P = {
    aponta:  [[-122, 70], [158, -96 + 8 * w]],
    cintura: [[-124, 66], [124, 66]],
    fala:    [[-150, 10 + 16 * w], [150, -10 - 16 * w]],
    alto:    [[-150, -120 + 14 * w], [150, -120 - 14 * w]],
    baixo:   [[-118, 104], [118, 104]],
    sacolas: [[-150, 60 + 6 * w], [150, 60 - 6 * w]],
    tchau:   [[-128, 92], [158, -110 + 20 * w]],
    anda:    [[-140, 70 + 30 * step], [140, 70 - 30 * step]],
  }[pose];
  const arm = (el, h, side, [hx, hy]) => { el.setAttribute('d', `M${side * sx},${sy} Q${side * (sx + 30)},${(sy + hy) / 2 + 20} ${hx},${hy}`); h.setAttribute('cx', hx); h.setAttribute('cy', hy); };
  arm(c.armL, c.hL, -1, P[0]); arm(c.armR, c.hR, 1, P[1]);
  const bk = popK(acc.bags || 0);
  [[c.bagL, c.bagWrapL, P[0]], [c.bagR, c.bagWrapR, P[1]]].forEach(([b, wr, [hx, hy]]) => {
    b.setAttribute('opacity', bk > 0 ? 1 : 0);
    wr.setAttribute('transform', `translate(${hx},${hy + 52}) rotate(${Math.sin(t * 5 + hx) * 6}) scale(${bk})`);
  });
}
