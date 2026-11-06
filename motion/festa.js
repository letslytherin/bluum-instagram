// Trilha de inauguração (original, sintetizada): pop alegre em Ré maior, I–V–vi–IV a 112 BPM.
// Intro de 2 compassos só com pluck e pad, groove leve com palma, e acorde final que soa até sumir.
// A página define window.FESTA = { bars: compassos de groove, dur: segundos totais }.
async function renderAudio() {
  const F = window.FESTA || {};
  const SR = 44100, BPM = 112, B = 60 / BPM, BAR = 4 * B, BARS = F.bars || 10, DUR = F.dur || BARS * BAR + 3.6;
  const ctx = new OfflineAudioContext(2, Math.ceil(SR * DUR), SR);
  const mtof = m => 440 * Math.pow(2, (m - 69) / 12);

  const master = ctx.createGain(); master.gain.value = 0.85;
  const comp = ctx.createDynamicsCompressor();
  comp.threshold.value = -14; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.2;
  master.connect(comp); comp.connect(ctx.destination);

  const noise = (() => { const b = ctx.createBuffer(2, SR * 3, SR); for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } return b; })();
  const rev = ctx.createConvolver();
  { const len = SR * 2.6, b = ctx.createBuffer(2, len, SR); for (let c = 0; c < 2; c++) { const d = b.getChannelData(c); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3); } rev.buffer = b; }
  const revOut = ctx.createGain(); revOut.gain.value = 0.35; rev.connect(revOut); revOut.connect(master);
  const dly = ctx.createDelay(2); dly.delayTime.value = B * 0.75;
  const fb = ctx.createGain(); fb.gain.value = 0.3; const dlf = ctx.createBiquadFilter(); dlf.type = 'lowpass'; dlf.frequency.value = 3000;
  dly.connect(dlf); dlf.connect(fb); fb.connect(dly); const dOut = ctx.createGain(); dOut.gain.value = 0.22; dlf.connect(dOut); dOut.connect(master);

  const CH = [
    { b: 38, n: [62, 66, 69, 74] }, // D
    { b: 45, n: [61, 64, 69, 73] }, // A
    { b: 47, n: [62, 66, 71, 74] }, // Bm
    { b: 43, n: [62, 67, 71, 74] }, // G
  ];
  const FIM = { b: 38, n: [62, 66, 69, 74, 78] };

  function pad(notes, t0, len, g = 0.022, rel = 0.8) {
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1500; lp.Q.value = 0.4;
    const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, t0); e.gain.linearRampToValueAtTime(g, t0 + 0.35);
    e.gain.setValueAtTime(g, t0 + len - 0.1); e.gain.linearRampToValueAtTime(0, t0 + len + rel);
    lp.connect(e); e.connect(master); e.connect(rev);
    for (const m of notes) for (const det of [-7, 7]) {
      const o = ctx.createOscillator(); o.type = 'sawtooth'; o.frequency.value = mtof(m); o.detune.value = det;
      o.connect(lp); o.start(t0); o.stop(t0 + len + rel + 0.1);
    }
  }
  function pluck(m, t0, g = 0.1, dec = 0.4) {
    const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(g, t0 + 0.006); e.gain.exponentialRampToValueAtTime(0.0001, t0 + dec);
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.setValueAtTime(5200, t0); lp.frequency.exponentialRampToValueAtTime(1400, t0 + dec);
    const pan = ctx.createStereoPanner(); pan.pan.value = ((m * 37) % 9) / 9 - 0.45;
    for (const [mul, type, gg] of [[1, 'triangle', 1], [2, 'sine', 0.35]]) {
      const o = ctx.createOscillator(); o.type = type; o.frequency.value = mtof(m) * mul; const og = ctx.createGain(); og.gain.value = gg;
      o.connect(og); og.connect(lp); o.start(t0); o.stop(t0 + dec + 0.05);
    }
    lp.connect(e); e.connect(pan); pan.connect(master); pan.connect(dly); pan.connect(rev);
  }
  function bell(m, t0, g = 0.045, dec = 2.4) {
    for (const [r, gg] of [[1, 1], [2.76, 0.4], [5.4, 0.18]]) {
      const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(m) * r;
      const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(g * gg, t0 + 0.005); e.gain.exponentialRampToValueAtTime(0.0001, t0 + dec / r);
      o.connect(e); e.connect(master); e.connect(rev); o.start(t0); o.stop(t0 + dec + 0.05);
    }
  }
  function bass(m, t0, len, g = 0.2) {
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(m);
    const o2 = ctx.createOscillator(); o2.type = 'triangle'; o2.frequency.value = mtof(m + 12); const g2 = ctx.createGain(); g2.gain.value = 0.25;
    const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(g, t0 + 0.01); e.gain.setValueAtTime(g * 0.8, t0 + len * 0.7); e.gain.exponentialRampToValueAtTime(0.0001, t0 + len);
    o.connect(e); o2.connect(g2); g2.connect(e); e.connect(master); o.start(t0); o2.start(t0); o.stop(t0 + len + 0.02); o2.stop(t0 + len + 0.02);
  }
  function kick(t0, g = 0.55) {
    const o = ctx.createOscillator(); o.frequency.setValueAtTime(130, t0); o.frequency.exponentialRampToValueAtTime(45, t0 + 0.18);
    const e = ctx.createGain(); e.gain.setValueAtTime(g, t0); e.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.32);
    o.connect(e); e.connect(master); o.start(t0); o.stop(t0 + 0.34);
  }
  function hit(t0, { f = 1500, type = 'bandpass', q = 0.8, g = 0.2, dec = 0.15, revSend = true } = {}) {
    const s = ctx.createBufferSource(); s.buffer = noise; const bp = ctx.createBiquadFilter(); bp.type = type; bp.frequency.value = f; bp.Q.value = q;
    const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, t0); e.gain.exponentialRampToValueAtTime(g, t0 + 0.003); e.gain.exponentialRampToValueAtTime(0.0001, t0 + dec);
    s.connect(bp); bp.connect(e); e.connect(master); if (revSend) e.connect(rev); s.start(t0, Math.random() * 2); s.stop(t0 + dec + 0.02);
  }
  const clap = t0 => { for (const d of [0, 0.011, 0.023]) hit(t0 + d, { f: 1400, g: 0.16, dec: 0.12 }); };

  const ARP = [0, 1, 2, 3, 2, 1, 2, 3];
  for (let bar = 0; bar < BARS; bar++) {
    const t = bar * BAR, c = CH[bar % 4], groove = bar >= 2, last = bar === BARS - 1;
    pad(c.n, t, BAR, groove ? 0.02 : 0.026);
    ARP.forEach((i, k) => pluck(c.n[i] + 12, t + k * B / 2, k % 2 ? 0.07 : 0.1));
    if (bar % 2 === 0) bell(c.n[3] + 12, t, groove ? 0.04 : 0.05);
    if (groove) {
      bass(c.b, t, B * 1.4); bass(c.b, t + B * 1.5, B * 0.45, 0.14); bass(c.b, t + B * 2, B * 1.8);
      for (let k = 0; k < 4; k++) kick(t + k * B, k % 2 ? 0.38 : 0.5);
      if (bar >= 3) { clap(t + B); clap(t + 3 * B); }
      for (let k = 0; k < 8; k++) hit(t + k * B / 2, { f: 8000, type: 'highpass', q: 0.5, g: k % 2 ? 0.05 : 0.025, dec: 0.045, revSend: false });
    }
    if (last) for (let k = 0; k < 4; k++) hit(t + 3 * B + k * B / 4, { f: 1800, g: 0.05 + 0.03 * k, dec: 0.1 }); // virada suave
  }
  // final: acorde de Ré que soa até sumir, sino e brilho
  const tf = BARS * BAR;
  kick(tf, 0.45);
  { // baixo final: desce aos poucos até o fim do vídeo, sem queda brusca
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = mtof(FIM.b);
    const e = ctx.createGain(); e.gain.setValueAtTime(0.0001, tf); e.gain.exponentialRampToValueAtTime(0.16, tf + 0.01); e.gain.linearRampToValueAtTime(0, DUR);
    o.connect(e); e.connect(master); o.start(tf); o.stop(DUR); }
  pad(FIM.n, tf, 1.4, 0.026, 3.2);   // acorde final desce devagar, sem corte
  FIM.n.forEach((m, i) => pluck(m + 12, tf + i * 0.06, 0.09, 2.2));
  bell(86, tf + 0.02, 0.06, 4); bell(90, tf + 0.3, 0.035, 3.6);
  hit(tf, { f: 6000, type: 'highpass', q: 0.4, g: 0.05, dec: 4.4 });

  return encodeWav(await ctx.startRendering());
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
  for (let i = 0; i < len; i++) for (let c = 0; c < ch; c++) { const v = Math.max(-1, Math.min(1, chans[c][i])); data.setInt16(o, v < 0 ? v * 0x8000 : v * 0x7fff, true); o += 2; }
  const bytes = new Uint8Array(data.buffer); let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
  return btoa(bin);
}
window.renderAudio = renderAudio;
