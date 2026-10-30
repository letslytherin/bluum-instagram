// Trilha original sintetizada (sem música de terceiros): pad elegante + pluck com delay,
// batida leve a 96 BPM e impactos sincronizados com os cortes do vídeo.
async function renderAudio() {
  // window.AUDIO_SPEC (opcional) adapta a trilha a outras peças: dur, drums, booms, chimes, whooshes, riser, quietBar
  const S = window.AUDIO_SPEC || {};
  const SR = 44100, DUR = S.dur || 20, B = 60 / 96;
  const ctx = new OfflineAudioContext(2, SR * DUR, SR);
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  const master = ctx.createGain(); master.gain.value = 0.9;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -16; comp.ratio.value = 3; comp.attack.value = 0.008; comp.release.value = 0.25;
  master.connect(comp); comp.connect(ctx.destination);

  function noiseBuf(sec) {
    const b = ctx.createBuffer(2, SR * sec, SR);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
    return b;
  }
  const rev = ctx.createConvolver();
  {
    const len = SR * 3, b = ctx.createBuffer(2, len, SR);
    for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    rev.buffer = b;
  }
  const revOut = ctx.createGain(); revOut.gain.value = 0.42; rev.connect(revOut); revOut.connect(master);

  const dly = ctx.createDelay(2); dly.delayTime.value = B * 0.75;
  const fb = ctx.createGain(); fb.gain.value = 0.38;
  const dlf = ctx.createBiquadFilter(); dlf.type = 'lowpass'; dlf.frequency.value = 3200;
  dly.connect(dlf); dlf.connect(fb); fb.connect(dly);
  const dlyOut = ctx.createGain(); dlyOut.gain.value = 0.32; dlf.connect(dlyOut); dlyOut.connect(master); dlyOut.connect(rev);

  const NOISE = noiseBuf(2);

  // ---- harmonia: 8 compassos de 2.5s ----
  const chords = [
    { bass: 41, n: [57, 60, 64, 67] },   // Fmaj9
    { bass: 45, n: [57, 60, 64, 67] },   // Am7
    { bass: 46, n: [58, 62, 65, 69] },   // Bbmaj7
    { bass: 48, n: [60, 62, 67, 64] },   // Cadd9
    { bass: 38, n: [57, 60, 62, 65] },   // Dm7
    { bass: 41, n: [57, 60, 64, 69] },   // Fmaj7 (revelação da marca)
    { bass: 46, n: [58, 62, 65, 69] },   // Bbmaj7
    { bass: 48, n: [60, 64, 67, 62] },   // Cadd9
  ];
  const BAR = B * 4;

  function pad(m, t0, dur, g) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1100; lp.Q.value = 0.4;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, t0);
    env.gain.linearRampToValueAtTime(g, t0 + 0.5);
    env.gain.setValueAtTime(g, t0 + dur);
    env.gain.exponentialRampToValueAtTime(0.0001, t0 + dur + 1.2);
    for (const det of [-8, 7]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = det;
      o.connect(lp); o.start(t0); o.stop(t0 + dur + 1.3);
    }
    lp.connect(env); env.connect(master); env.connect(rev);
  }
  function bass(m, t0, dur) {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(m);
    const e = ctx.createGain();
    e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(0.22, t0 + 0.05);
    e.gain.setValueAtTime(0.22, t0 + dur - 0.1); e.gain.linearRampToValueAtTime(0, t0 + dur);
    o.connect(e); e.connect(master); o.start(t0); o.stop(t0 + dur + 0.05);
  }
  function pluck(m, t0, g) {
    const e = ctx.createGain();
    e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(g, t0 + 0.005);
    e.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
    for (const [type, mul, gg] of [['triangle', 1, 1], ['sine', 2, 0.35]]) {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = mtof(m) * mul;
      const og = ctx.createGain(); og.gain.value = gg;
      o.connect(og); og.connect(e); o.start(t0); o.stop(t0 + 0.6);
    }
    e.connect(master); e.connect(dly); e.connect(rev);
  }
  function chime(m, t0, g) {
    for (const [mul, gg, dec] of [[1, 1, 2.4], [2.76, 0.35, 1.2], [5.4, 0.15, 0.6]]) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(m) * mul;
      const e = ctx.createGain();
      e.gain.setValueAtTime(0, t0); e.gain.linearRampToValueAtTime(g * gg, t0 + 0.004);
      e.gain.exponentialRampToValueAtTime(0.0001, t0 + dec);
      o.connect(e); e.connect(master); e.connect(rev); e.connect(dly); o.start(t0); o.stop(t0 + dec);
    }
  }
  function kick(t0, g = 0.55) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(150, t0); o.frequency.exponentialRampToValueAtTime(44, t0 + 0.13);
    const e = ctx.createGain(); e.gain.setValueAtTime(g, t0); e.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.38);
    o.connect(e); e.connect(master); o.start(t0); o.stop(t0 + 0.4);
  }
  function noiseHit(t0, { type = 'highpass', f = 8000, q = 0.7, g = 0.08, dec = 0.05, toRev = false } = {}) {
    const s = ctx.createBufferSource(); s.buffer = NOISE;
    const fl = ctx.createBiquadFilter(); fl.type = type; fl.frequency.value = f; fl.Q.value = q;
    const e = ctx.createGain(); e.gain.setValueAtTime(g, t0); e.gain.exponentialRampToValueAtTime(0.0001, t0 + dec);
    s.connect(fl); fl.connect(e); e.connect(master); if (toRev) e.connect(rev);
    s.start(t0, Math.random()); s.stop(t0 + dec + 0.02);
  }
  function boom(t0, g) {
    const o = ctx.createOscillator(); o.type = 'sine';
    o.frequency.setValueAtTime(90, t0); o.frequency.exponentialRampToValueAtTime(30, t0 + 1.1);
    const e = ctx.createGain(); e.gain.setValueAtTime(g, t0); e.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.4);
    o.connect(e); e.connect(master); o.start(t0); o.stop(t0 + 1.5);
    noiseHit(t0, { type: 'lowpass', f: 1800, g: g * 0.5, dec: 0.9, toRev: true });
  }
  function whoosh(t0, dur = 0.45, g = 0.16) {
    const s = ctx.createBufferSource(); s.buffer = NOISE;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 1.2;
    bp.frequency.setValueAtTime(400, t0); bp.frequency.exponentialRampToValueAtTime(4500, t0 + dur);
    const e = ctx.createGain();
    e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(g, t0 + dur * 0.7); e.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    s.connect(bp); bp.connect(e); e.connect(master); e.connect(rev); s.start(t0); s.stop(t0 + dur + 0.02);
  }
  function riser(t0, t1) {
    const s = ctx.createBufferSource(); s.buffer = NOISE; s.loop = true;
    const bp = ctx.createBiquadFilter(); bp.type = 'bandpass'; bp.Q.value = 2;
    bp.frequency.setValueAtTime(300, t0); bp.frequency.exponentialRampToValueAtTime(7000, t1);
    const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(0.22, t1 - 0.02); e.gain.linearRampToValueAtTime(0, t1);
    s.connect(bp); bp.connect(e); e.connect(master); s.start(t0); s.stop(t1 + 0.05);
  }

  const arp = [0, 1, 2, 3, 2, 1, 3, 2];
  chords.forEach((c, i) => {
    const t0 = i * BAR;
    c.n.forEach(m => pad(m, t0, BAR, 0.018));
    bass(c.bass, t0, BAR);
    if (i === (S.quietBar ?? 4)) return; // compasso do riser fica mais limpo
    arp.forEach((ix, j) => pluck(c.n[ix] + 12, t0 + j * B / 2, j % 2 ? 0.05 : 0.075));
  });

  const drums = (a, b) => t => t >= a - 1e-6 && t < b - 1e-6;
  const on = (S.drums || [[2.5, 11.875], [15.0, 19.375]]).map(([a, b]) => drums(a, b));
  for (let k = 0; k * B < DUR; k++) {
    const t = k * B;
    if (on.some(f => f(t))) {
      kick(t);
      noiseHit(t + B / 2, { g: 0.07, dec: 0.06 });
      if (k % 2 === 1) noiseHit(t, { type: 'bandpass', f: 1900, q: 0.8, g: 0.09, dec: 0.14, toRev: true });
    }
  }

  // impactos sincronizados com o vídeo
  (S.booms || [[0.05, 0.45], [12.5, 0.7]]).forEach(([t, g]) => boom(t, g));
  (S.chimes || [[84, 0.3, 0.12], [89, 0.3, 0.06], [77, 12.5, 0.14], [84, 12.55, 0.1], [89, 12.6, 0.07], [81, 16.85, 0.08], [84, 17.0, 0.06]])
    .forEach(([m, t, g]) => chime(m, t, g));
  (S.whooshes || [2.42, 4.92, 7.42, 9.92, 15.55]).forEach(t => whoosh(t));
  (S.riser === null ? [] : [S.riser || [10.5, 12.5]]).forEach(([a, b]) => riser(a, b));

  const buf = await ctx.startRendering();
  return encodeWav(buf);
}

function encodeWav(buf) {
  const ch = buf.numberOfChannels, len = buf.length, sr = buf.sampleRate;
  const data = new DataView(new ArrayBuffer(44 + len * ch * 2));
  const str = (o, s) => { for (let i = 0; i < s.length; i++) data.setUint8(o + i, s.charCodeAt(i)); };
  str(0, 'RIFF'); data.setUint32(4, 36 + len * ch * 2, true); str(8, 'WAVE'); str(12, 'fmt ');
  data.setUint32(16, 16, true); data.setUint16(20, 1, true); data.setUint16(22, ch, true);
  data.setUint32(24, sr, true); data.setUint32(28, sr * ch * 2, true); data.setUint16(32, ch * 2, true);
  data.setUint16(34, 16, true); str(36, 'data'); data.setUint32(40, len * ch * 2, true);
  const chans = [...Array(ch)].map((_, c) => buf.getChannelData(c));
  let o = 44;
  for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) {
    const v = Math.max(-1, Math.min(1, chans[c][i]));
    data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2;
  }
  const bytes = new Uint8Array(data.buffer);
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
window.renderAudio = renderAudio;
