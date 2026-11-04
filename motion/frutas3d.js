// Pitanga e caju em 3D (three.js): corpo brilhante, rosto expressivo, boca que abre com a voz,
// braços por pose, pernas que andam e acessórios da compra (laço, brinco, batom, sacolas da Bluum).
import * as THREE from 'three';

const M = {
  ink: new THREE.MeshStandardMaterial({ color: '#2a1414', roughness: 0.5 }),
  white: new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.15, clearcoat: 1 }),
  pupil: new THREE.MeshPhysicalMaterial({ color: '#1a0e0e', roughness: 0.1, clearcoat: 1 }),
  shine: new THREE.MeshBasicMaterial({ color: '#ffffff' }),
  mouth: new THREE.MeshStandardMaterial({ color: '#5a0f12', roughness: 0.6 }),
  lips: new THREE.MeshPhysicalMaterial({ color: '#c2185b', roughness: 0.25, clearcoat: 1 }),
  cheek: new THREE.MeshStandardMaterial({ color: '#ff7f98', roughness: 0.8, transparent: true, opacity: 0.55 }),
  tear: new THREE.MeshPhysicalMaterial({ color: '#9fdcff', roughness: 0.05, transmission: 0.3, clearcoat: 1 }),
  glove: new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.4, clearcoat: 0.4 }),
  gold: new THREE.MeshPhysicalMaterial({ color: '#e8b92f', metalness: 1, roughness: 0.22 }),
  pink: new THREE.MeshPhysicalMaterial({ color: '#ff6fa8', roughness: 0.35, clearcoat: 0.8 }),
  teal: new THREE.MeshPhysicalMaterial({ color: '#6dc8bf', roughness: 0.45, clearcoat: 0.3 }),
  tealDark: new THREE.MeshStandardMaterial({ color: '#0d4c46', roughness: 0.5 }),
  star: new THREE.MeshPhysicalMaterial({ color: '#f2c94c', metalness: 0.6, roughness: 0.2, emissive: '#7a5200', emissiveIntensity: 0.4 }),
};

const sph = (r, mat, seg = 32) => new THREE.Mesh(new THREE.SphereGeometry(r, seg, Math.round(seg * 0.75)), mat);
function cast(o) { o.traverse(m => { if (m.isMesh) { m.castShadow = true; } }); return o; }

function starShape() {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) { const a = i / 10 * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 0.026 : 0.06; s[i ? 'lineTo' : 'moveTo'](Math.cos(a) * r, Math.sin(a) * r); }
  return new THREE.ExtrudeGeometry(s, { depth: 0.02, bevelEnabled: true, bevelSize: 0.006, bevelThickness: 0.006, bevelSegments: 2 });
}
const STAR = starShape();

// rosto montado sobre a frente do corpo; cy = altura dos olhos, cz = profundidade da superfície
function buildFace(cy, cz, spread = 0.16) {
  const f = new THREE.Group();
  const eyes = [-1, 1].map(s => {
    const g = new THREE.Group(); g.position.set(s * spread, cy, cz);
    const w = sph(0.105, M.white); w.scale.set(1, 1.15, 0.55); g.add(w);
    const pup = new THREE.Group(); pup.position.z = 0.045;
    const pp = sph(0.052, M.pupil); pp.scale.z = 0.5; pup.add(pp);
    const hl = sph(0.016, M.shine, 12); hl.position.set(-0.018, 0.022, 0.03); pup.add(hl);
    const st = new THREE.Mesh(STAR, M.star); st.position.z = 0.02; st.visible = false; pup.add(st);
    g.add(pup); f.add(g);
    return { g, pup, pp, hl, st };
  });
  const brows = [-1, 1].map(s => {
    const b = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.1, 4, 10), M.ink);
    b.rotation.z = Math.PI / 2; const g = new THREE.Group(); g.add(b); g.position.set(s * spread, cy + 0.17, cz + 0.02); f.add(g); return g;
  });
  const mouthOpen = sph(0.1, M.mouth); mouthOpen.position.set(0, cy - 0.2, cz + 0.02); f.add(mouthOpen);
  const arc = new THREE.Mesh(new THREE.TorusGeometry(0.07, 0.017, 10, 28, Math.PI), M.ink); arc.position.set(0, cy - 0.18, cz + 0.03); f.add(arc);
  const cheeks = [-1, 1].map(s => { const c = sph(0.06, M.cheek, 20); c.scale.set(1, 0.6, 0.3); c.position.set(s * (spread + 0.11), cy - 0.14, cz - 0.03); f.add(c); return c; });
  const tears = [-1, 1].map(s => { const d = sph(0.026, M.tear, 16); d.scale.y = 1.35; d.position.set(s * spread, cy - 0.12, cz + 0.03); d.visible = false; f.add(d); return d; });
  return { group: f, eyes, brows, mouthOpen, arc, cheeks, tears, cy, cz };
}

function limb(r, mat) { const m = new THREE.Mesh(new THREE.CylinderGeometry(r, r, 1, 14), mat); m.castShadow = true; return m; }
function setLimb(m, a, b) {
  const d = new THREE.Vector3().subVectors(b, a), len = d.length();
  m.position.copy(a).addScaledVector(d, 0.5); m.scale.set(1, len, 1);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), d.normalize());
}

function buildBag() {
  const g = new THREE.Group();
  const b = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.24, 0.08), M.teal); b.position.y = -0.16; g.add(b);
  const h = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.012, 8, 20, Math.PI), M.tealDark); h.position.y = -0.04; g.add(h);
  const l = new THREE.Mesh(STAR, M.gold); l.scale.setScalar(0.9); l.position.set(-0.002, -0.15, 0.04); g.add(l);
  g.visible = false; return cast(g);
}

function base(k, { body, faceY, faceZ, shoulder, hip, legLen }) {
  const root = new THREE.Group(), rig = new THREE.Group(); root.add(rig);
  rig.add(cast(body));
  const face = buildFace(faceY, faceZ); rig.add(face.group);
  const arms = [-1, 1].map(() => limb(0.028, M.ink)), hands = [-1, 1].map(() => cast(sph(0.065, M.glove)));
  arms.forEach(a => rig.add(a)); hands.forEach(h => rig.add(h));
  const legs = [-1, 1].map(s => {
    const g = new THREE.Group(); g.position.set(s * hip[0], hip[1], 0);
    const l = limb(0.03, M.ink); setLimb(l, new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -legLen, 0)); g.add(l);
    const shoe = sph(0.085, M.ink); shoe.scale.set(1.25, 0.55, 1.7); shoe.position.set(s * 0.02, -legLen - 0.02, 0.05); shoe.castShadow = true; g.add(shoe);
    rig.add(g); return g;
  });
  const bags = [buildBag(), buildBag()]; bags.forEach(b => rig.add(b));
  const glow = new THREE.PointLight('#ffe6a0', 0, 2.5); glow.position.set(0, 0.9, 0.8); rig.add(glow);
  return { k, root, rig, body, face, arms, hands, legs, bags, glow, shoulder };
}

export function makePitanga() {
  const g = new THREE.SphereGeometry(0.5, 128, 96), pos = g.attributes.position, v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const th = Math.atan2(v.x, v.z), lat = 1 - Math.pow(v.y / 0.5, 2);
    const r = 1 + 0.085 * Math.cos(8 * th) * Math.pow(Math.max(lat, 0), 0.6);
    v.x *= r; v.z *= r; v.y *= 0.9;
    if (v.y > 0.38) v.y -= (v.y - 0.38) * 0.6; // covinha do cabinho
    pos.setXYZ(i, v.x, v.y, v.z);
  }
  g.computeVertexNormals();
  const mat = new THREE.MeshPhysicalMaterial({ color: '#c4101c', roughness: 0.28, clearcoat: 1, clearcoatRoughness: 0.1 });
  const body = new THREE.Group(); const b = new THREE.Mesh(g, mat); b.position.y = 0.76; body.add(b);
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.026, 0.14, 10), new THREE.MeshStandardMaterial({ color: '#5b4320', roughness: 0.8 }));
  stem.position.set(0.01, 1.2, 0); stem.rotation.z = -0.25; body.add(stem);
  const leafMat = new THREE.MeshPhysicalMaterial({ color: '#5e8f2a', roughness: 0.5, clearcoat: 0.5 });
  for (let i = 0; i < 4; i++) { const l = sph(0.05, leafMat, 16); l.scale.set(0.5, 0.2, 1.4); const a = i / 4 * Math.PI * 2 + 0.6; l.position.set(Math.sin(a) * 0.05, 1.135, Math.cos(a) * 0.05); l.rotation.y = a; body.add(l); }
  const c = base('P', { body, faceY: 0.83, faceZ: 0.47, shoulder: [0.47, 0.74], hip: [0.15, 0.32], legLen: 0.25 });
  // acessórios da compra
  const bow = new THREE.Group();
  [-1, 1].forEach(s => { const cn = new THREE.Mesh(new THREE.ConeGeometry(0.075, 0.16, 20), M.pink); cn.rotation.z = s * Math.PI / 2; cn.position.x = s * 0.08; cn.scale.z = 0.5; bow.add(cn); });
  bow.add(sph(0.04, M.gold, 16)); bow.position.set(-0.27, 1.1, 0.16); bow.rotation.z = 0.35; bow.visible = false; c.rig.add(cast(bow));
  const ears = [-1, 1].map(s => { const e = new THREE.Mesh(new THREE.TorusGeometry(0.045, 0.012, 10, 24), M.gold); e.position.set(s * 0.54, 0.64, 0.02); e.rotation.y = Math.PI / 2; e.visible = false; c.rig.add(e); return e; });
  Object.assign(c, { bow, ears });
  return c;
}

export function makeCaju() {
  const prof = new THREE.SplineCurve([[0, 0.22], [0.27, 0.25], [0.4, 0.38], [0.44, 0.56], [0.41, 0.8], [0.35, 1.02], [0.27, 1.2], [0.16, 1.31], [0.001, 1.34]].map(([x, y]) => new THREE.Vector2(x, y)));
  const g = new THREE.LatheGeometry(prof.getPoints(60), 96), pos = g.attributes.position, col = [];
  const lo = new THREE.Color('#d6301c'), mid = new THREE.Color('#f28a14'), hi = new THREE.Color('#ffd21f'), c3 = new THREE.Color();
  for (let i = 0; i < pos.count; i++) { const k = (pos.getY(i) - 0.22) / 1.12; c3.copy(k < 0.5 ? lo.clone().lerp(mid, k * 2) : mid.clone().lerp(hi, (k - 0.5) * 2)); col.push(c3.r, c3.g, c3.b); }
  g.setAttribute('color', new THREE.Float32BufferAttribute(col, 3));
  g.computeVertexNormals();
  const body = new THREE.Group();
  body.add(new THREE.Mesh(g, new THREE.MeshPhysicalMaterial({ vertexColors: true, roughness: 0.32, clearcoat: 0.9, clearcoatRoughness: 0.15 })));
  const nutCurve = new THREE.CatmullRomCurve3([[-0.19, 0], [-0.12, 0.11], [0.03, 0.13], [0.16, 0.07], [0.19, -0.03], [0.09, -0.05], [0.01, 0.0], [-0.1, -0.05]].map(([x, y]) => new THREE.Vector3(x, y, 0)), true);
  const nut = new THREE.Mesh(new THREE.TubeGeometry(nutCurve, 80, 0.085, 20, true), new THREE.MeshPhysicalMaterial({ color: '#9c7a52', roughness: 0.55, clearcoat: 0.3 }));
  nut.position.set(0.04, 1.44, -0.02); nut.rotation.set(0.25, 0.5, -0.3); body.add(nut);
  return base('C', { body, faceY: 0.86, faceZ: 0.37, shoulder: [0.42, 0.72], hip: [0.15, 0.3], legLen: 0.24 });
}

// [altura da sobrancelha, rotação esq, rotação dir, boca parada, escala do olho, olhar para baixo]
const EMO = {
  triste:  { by: 0, rl: 0.38, rr: -0.38, mouth: 'frown', es: 0.9, down: 0.03 },
  raiva:   { by: -0.02, rl: -0.4, rr: 0.4, mouth: 'frown', es: 1 },
  duvida:  { by: 0.02, rl: 0.1, rr: -0.3, mouth: 'flat', es: 1.05 },
  surpresa:{ by: 0.05, rl: 0.15, rr: -0.15, mouth: 'o', es: 1.18 },
  brilho:  { by: 0.05, rl: 0.2, rr: -0.2, mouth: 'smile', es: 1.15 },
  feliz:   { by: 0.03, rl: 0.1, rr: -0.1, mouth: 'smile', es: 1 },
};
const pop = k => (k <= 0 ? 0 : k >= 1 ? 1 : 1 + 2.70158 * Math.pow(k - 1, 3) + 1.70158 * Math.pow(k - 1, 2));

// poses: posição das mãos (x, y) em metros, relativas ao chão do personagem
function hands(pose, t, step) {
  const w = Math.sin(t * 7);
  return {
    baixo: [[-0.46, 0.36], [0.46, 0.36]],
    anda: [[-0.55, 0.5 + 0.1 * step], [0.55, 0.5 - 0.1 * step]],
    fala: [[-0.62, 0.72 + 0.06 * w], [0.62, 0.8 - 0.06 * w]],
    alto: [[-0.6, 1.25 + 0.05 * w], [0.6, 1.25 - 0.05 * w]],
    sacolas: [[-0.6, 0.55 + 0.03 * w], [0.6, 0.55 - 0.03 * w]],
    tchau: [[-0.5, 0.4], [0.62, 1.28 + 0.08 * w]],
  }[pose];
}

export function updateChar(c, t, o) {
  const { x = 0, z = 0, s = 1, emo = 'feliz', env = 0, talking = false, pose = 'baixo', walk = 0, acc = {}, glow = 0, tears = 0, look = 0, turn = 0 } = o;
  const e = EMO[emo], sad = emo === 'triste';
  const step = walk ? Math.sin(t * 11) : 0;
  const bob = walk ? Math.abs(step) * 0.05 : talking ? Math.abs(Math.sin(t * 9)) * 0.035 : Math.sin(t * 2.4 + (c.k === 'C' ? 1.3 : 0)) * 0.012;
  c.root.position.set(x, bob - (sad ? 0.02 : 0), z);
  c.root.scale.setScalar(s);
  c.root.rotation.y = turn + (talking ? Math.sin(t * 3) * 0.06 : 0);
  const sq = 1 + (talking ? 0.022 * Math.sin(t * 18) : 0.01 * Math.sin(t * 2.4));
  c.rig.scale.set(1 / Math.sqrt(sq), sq, 1 / Math.sqrt(sq));
  c.rig.rotation.z = (talking ? Math.sin(t * 5) * 0.04 : 0) + (walk ? Math.sin(t * 11) * 0.04 : 0);
  c.rig.rotation.x = sad && !walk ? 0.12 : 0;
  c.legs.forEach((l, i) => { l.rotation.x = (i ? -1 : 1) * step * 0.55; });
  // olhos
  const ph = (t + (c.k === 'C' ? 1.1 : 0)) % 2.8, blink = ph < 0.13 ? 0.1 : 1;
  c.face.eyes.forEach(ey => {
    ey.g.scale.set(e.es, e.es * blink * (sad ? 0.8 : 1), e.es);
    ey.pup.position.x = look * 0.03; ey.pup.position.y = -(e.down || 0);
    const star = emo === 'brilho';
    ey.pp.visible = !star; ey.hl.visible = !star; ey.st.visible = star;
    if (star) { ey.st.rotation.z = t * 1.6; ey.st.scale.setScalar(1 + 0.15 * Math.sin(t * 10)); }
  });
  c.face.brows.forEach((b, i) => { b.position.y = c.face.cy + 0.17 + e.by + (talking ? 0.015 * env : 0); b.rotation.z = i ? e.rr : e.rl; });
  // boca
  const open = talking && env > 0.04, F = c.face, lips = (acc.lips || 0) > 0.5;
  F.mouthOpen.visible = open || e.mouth === 'o';
  F.mouthOpen.material = lips ? M.lips : M.mouth;
  if (open) F.mouthOpen.scale.set(0.8 + 0.3 * env, 0.12 + 0.75 * env, 0.32);
  else if (e.mouth === 'o') F.mouthOpen.scale.set(0.45, 0.5, 0.32);
  F.arc.visible = !open && e.mouth !== 'o';
  F.arc.material = lips ? M.lips : M.ink;
  F.arc.rotation.z = e.mouth === 'frown' ? 0 : Math.PI;
  F.arc.scale.set(e.mouth === 'flat' ? 0.7 : 1, e.mouth === 'flat' ? 0.25 : 1, 1);
  F.arc.position.y = F.cy - (e.mouth === 'frown' ? 0.24 : 0.17);
  F.tears.forEach((d, i) => { d.visible = tears > 0.5; d.position.y = F.cy - 0.12 - ((t * 0.18 + i * 0.07) % 0.18); });
  F.cheeks.forEach(ch => { ch.material.opacity = 0.55 + 0.3 * (acc.lips || 0); });
  // braços e mãos
  const [shx, shy] = c.shoulder, H = hands(pose, t, step);
  [-1, 1].forEach((sd, i) => {
    const a = new THREE.Vector3(sd * shx, shy, 0.05), h = new THREE.Vector3(H[i][0], H[i][1], 0.14);
    setLimb(c.arms[i], a, h); c.hands[i].position.copy(h);
    const kb = pop(acc.bags || 0); c.bags[i].visible = kb > 0;
    c.bags[i].position.copy(h); c.bags[i].scale.setScalar(Math.max(kb, 0.001)); c.bags[i].rotation.z = Math.sin(t * 5 + i) * 0.1;
  });
  if (c.bow) { const k = pop(acc.bow || 0); c.bow.visible = k > 0; c.bow.scale.setScalar(Math.max(k, 0.001)); }
  if (c.ears) { const k = pop(acc.ear || 0); c.ears.forEach(er => { er.visible = k > 0; er.scale.setScalar(Math.max(k, 0.001)); er.rotation.x = Math.sin(t * 6) * 0.2; }); }
  c.glow.intensity = glow * (2.2 + 0.6 * Math.sin(t * 4));
}
