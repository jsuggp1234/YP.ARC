// 핀 #354 (← #344): 졸업설계 배치도 읽기 — 기단과 목은 따로 놓인 물건이 아니라 하나의 매끈한 지형이에요.
// 기단(원뿔·단)들과 이음 능선을 '부드러운 최댓값'(smooth-max)으로 합쳐 하나의 높이장으로 만들고,
// 굵은 선은 그 지형을 지금 물높이에서 자른 등고선 = 물가선이에요. 물이 오르면 목이 가늘어지다 끊겨 섬으로 나뉘어요.
// 능선 마루 높이 = 연결 변수(이음목 높이 g.C). 높이는 모두 절대 높이(m).
function neckEdges(pads) {
  const inT = [0], E = [];
  while (inT.length < pads.length) { let best = null; for (const a of inT) pads.forEach((b, j) => { if (inT.includes(j)) return; const d = Math.hypot(b.x - pads[a].x, b.z - pads[a].z) - pads[a].R - b.R; if (!best || d < best[2]) best = [a, j, d]; }); inT.push(best[1]); E.push(best); }
  return E;
}
const smax = (a, b, k) => { const h = Math.max(k - Math.abs(a - b), 0) / k; return Math.max(a, b) + h * h * k * 0.25; };
// 기단 하나의 높이 단면: 단(고리)들은 그 높이, 자락은 아래로, 바깥은 1 : 3으로 갯벌까지
function padProfile(rings, skirt, gr) {
  // rings: [[z, r0, r1]] 바깥으로 갈수록 낮아짐, skirt: [R0, z0, R1, z1] 또는 null
  const last = rings[rings.length - 1];
  return d => {
    for (const [z, r0, r1] of rings) if (d <= r1) return z;
    let R = last[2], z = last[0];
    if (skirt && d <= skirt[2]) return skirt[1] + (skirt[3] - skirt[1]) * (d - skirt[0]) / Math.max(1e-6, skirt[2] - skirt[0]);
    if (skirt) { R = skirt[2]; z = skirt[3]; }
    return Math.max(gr, z - (d - R) / 3);
  };
}
// 지형 모형: 기단들 + 이음 능선. 평면(물가선)과 3D(갯벌 높이장)가 같은 것을 써요
function siteField(g, cl) {
  cl = cl || []; const gr = g.ground, Rf = g.R + g.L;
  const mainR = g.T.map(t => [t.z, t.r0, t.r1]);
  const pads = [{ x: 0, z: 0, R: Rf, f: padProfile(mainR, g.L > 0.1 ? [g.R, g.zl, Rf, g.P] : null, gr) }]
    .concat(cl.map(c => { const lr = c.p.rings[c.p.rings.length - 1]; return { x: c.x, z: c.z, R: c.R, f: padProfile(c.p.rings, c.L > 0.5 ? [lr[2], lr[0], lr[2] + c.L, gr] : null, gr) }; }));
  const H = g.C, on = cl.length && H > gr + 0.15, run = Math.max(3, 3 * (H - gr)), wc = Math.max(2, 0.9 * (H - gr));
  const ridges = on ? neckEdges(pads).map(([a, b]) => ({ A: pads[a], B: pads[b] })) : [];
  const ridgeZ = (px, pz) => { let h = gr;
    for (const { A, B } of ridges) { const dx = B.x - A.x, dz = B.z - A.z, L2 = dx * dx + dz * dz || 1, t = Math.max(0, Math.min(1, ((px - A.x) * dx + (pz - A.z) * dz) / L2)), d = Math.hypot(px - A.x - t * dx, pz - A.z - t * dz);
      const p = d <= wc ? H : d < wc + run ? gr + (H - gr) * 0.5 * (1 + Math.cos(Math.PI * (d - wc) / run)) : gr; h = smax(h, p, 1.2); }
    return h; };
  // 기단 안쪽(단·자락은 3D에서 따로 지어요)인지
  const inPad = (px, pz) => pads.some(q => Math.hypot(px - q.x, pz - q.z) < q.R - 0.3);
  const at = (px, pz) => { let h = ridgeZ(px, pz); for (const q of pads) { const d = Math.hypot(px - q.x, pz - q.z); if (d < q.R + 3 * (H - gr) + 30) h = smax(h, q.f(d), 3); } return h; };
  return { at, ridgeZ, inPad, pads, ridges, on, gr };
}
// 격자 위 등고선 (marching squares) → 선분 [x0, z0, x1, z1]
function isoSegs(F, NX, NZ, x0, z0, st, lv) {
  const out = [], P = (i, j) => F[j * NX + i];
  for (let j = 0; j < NZ - 1; j++) for (let i = 0; i < NX - 1; i++) {
    const a = P(i, j), b = P(i + 1, j), c = P(i + 1, j + 1), d = P(i, j + 1), k = (a > lv) | ((b > lv) << 1) | ((c > lv) << 2) | ((d > lv) << 3);
    if (k === 0 || k === 15) continue;
    const X = i * st + x0, Z = j * st + z0, e = [];
    const ip = (p, q) => (lv - p) / ((q - p) || 1e-9);
    if ((a > lv) !== (b > lv)) e.push([X + st * ip(a, b), Z]);
    if ((b > lv) !== (c > lv)) e.push([X + st, Z + st * ip(b, c)]);
    if ((d > lv) !== (c > lv)) e.push([X + st * ip(d, c), Z + st]);
    if ((a > lv) !== (d > lv)) e.push([X, Z + st * ip(a, d)]);
    if (e.length === 2) out.push([e[0][0], e[0][1], e[1][0], e[1][1]]);
    else if (e.length === 4) { out.push([e[0][0], e[0][1], e[1][0], e[1][1]]); out.push([e[2][0], e[2][1], e[3][0], e[3][1]]); }
  }
  return out;
}
const FIELD_C = new Map();
// 평면 그림용 높이 격자 (바뀔 때만 한 번 계산해 두어요)
function fieldGrid(key, g, cl, xa, xb, za, zb) {
  const hit = FIELD_C.get(key); if (hit) return hit;
  const S = siteField(g, cl), st = Math.max(0.4, (xb - xa) / 360), NX = Math.ceil((xb - xa) / st) + 1, NZ = Math.ceil((zb - za) / st) + 1, F = new Float32Array(NX * NZ), R = new Float32Array(NX * NZ);
  for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { const px = xa + i * st, pz = za + j * st; F[j * NX + i] = S.at(px, pz); R[j * NX + i] = S.inPad(px, pz) ? -99 : S.ridgeZ(px, pz); }
  const out = { S, F, R, NX, NZ, st, xa, za, lines: {} };
  if (FIELD_C.size > 24) FIELD_C.clear(); FIELD_C.set(key, out); return out;
}
// 평면: 마른 능선 칠 + 가는 등고선 (기단 그림 아래에)
function drawFieldUnder(x, G, w, X, Y, sc, dry, ink) {
  const { R, NX, NZ, st, xa, za } = G; if (!G.S.on) return;
  x.save(); x.fillStyle = dry;
  for (let j = 0; j < NZ; j++) for (let i = 0; i < NX; i++) { const r = R[j * NX + i]; if (r > w && r > G.S.gr + 0.05) x.fillRect(X(xa + i * st) - 0.3, Y(za + j * st) - 0.3, st * sc + 0.6, st * sc + 0.6); }
  x.strokeStyle = ink; x.globalAlpha = .28; x.lineWidth = .5; x.beginPath();
  if (G.top == null) { let m = G.S.gr; for (const v of R) if (v > m) m = v; G.top = m; } const top = G.top;
  for (let lv = Math.ceil((G.S.gr + 0.25) * 4) / 4; lv < top - 0.05; lv += 0.25) { const L = G.lines['r' + lv] || (G.lines['r' + lv] = isoSegs(R, NX, NZ, xa, za, st, lv)); for (const [a, b, c, d] of L) { x.moveTo(X(a), Y(b)); x.lineTo(X(c), Y(d)); } }
  x.stroke(); x.restore();
}
// 평면: 지금 물높이의 등고선 = 굵은 물가선 (기단 위까지 하나로 이어져요)
function drawWaterline(x, G, w, X, Y, ink) {
  const k = 'w' + w.toFixed(3), L = G.lines[k] || (G.lines[k] = isoSegs(G.F, G.NX, G.NZ, G.xa, G.za, G.st, w));
  x.save(); x.strokeStyle = ink; x.lineWidth = 1.8; x.lineCap = 'round'; x.beginPath(); for (const [a, b, c, d] of L) { x.moveTo(X(a), Y(b)); x.lineTo(X(c), Y(d)); } x.stroke(); x.restore();
  if (Object.keys(G.lines).length > 400) G.lines = {};
}
