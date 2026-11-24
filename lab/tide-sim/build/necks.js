// 핀 #344: 기단과 기단을 잇는 목 — 졸업설계 배치도처럼 두 원에 접하는 오목한 필렛 곡선으로 매끈하게 이어 하나의 덩어리로 읽히게.
// pads: [{x, z, R}] (큰 기단 = 0번). 가까운 것끼리 잇는 나무(MST). 목의 높이는 연결 변수(이음목 높이 g.C)를 따라 물에 잠기고 드러나요.
function neckEdges(pads) {
  const inT = [0], E = [];
  while (inT.length < pads.length) { let best = null; for (const a of inT) pads.forEach((b, j) => { if (inT.includes(j)) return; const d = Math.hypot(b.x - pads[a].x, b.z - pads[a].z) - pads[a].R - b.R; if (!best || d < best[2]) best = [a, j, d]; }); inT.push(best[1]); E.push(best); }
  return E;
}
// 두 원 A, B 사이 목의 윤곽: 필렛 원 둘(c+, c−)과 접점. 허리 너비 waist(m)
function neckShape(A, B, waist) {
  const dx = B.x - A.x, dz = B.z - A.z, d = Math.hypot(dx, dz) || 1, ux = dx / d, uz = dz / d, vx = -uz, vz = ux;
  const geo = rf => { const a = A.R + rf, b = B.R + rf, xx = (a * a - b * b + d * d) / (2 * d), h2 = a * a - xx * xx; return h2 > 0 ? [xx, Math.sqrt(h2)] : null; };
  const tgt = Math.min(waist / 2, 0.42 * Math.min(A.R, B.R));
  let lo = 0.05, hi = 6 * d + 60;
  for (let i = 0; i < 48; i++) { const mid = (lo + hi) / 2, q = geo(mid); if (!q || q[1] - mid < tgt) lo = mid; else hi = mid; }
  const rf = hi, q = geo(rf); if (!q) return null;
  const side = sg => { const cx = A.x + ux * q[0] + sg * vx * q[1], cz = A.z + uz * q[0] + sg * vz * q[1];
    const ta = [A.x + (cx - A.x) * A.R / (A.R + rf), A.z + (cz - A.z) * A.R / (A.R + rf)], tb = [B.x + (cx - B.x) * B.R / (B.R + rf), B.z + (cz - B.z) * B.R / (B.R + rf)];
    return { cx, cz, ta, tb }; };
  return { rf, P: side(1), M: side(-1), A, B };
}
// 짧은 쪽 호를 점으로
function arcPts(cx, cz, r, p0, p1, n) {
  const a0 = Math.atan2(p0[1] - cz, p0[0] - cx); let da = Math.atan2(p1[1] - cz, p1[0] - cx) - a0;
  while (da > Math.PI) da -= 2 * Math.PI; while (da < -Math.PI) da += 2 * Math.PI;
  const out = []; for (let i = 0; i <= n; i++) { const t = a0 + da * i / n; out.push([cx + r * Math.cos(t), cz + r * Math.sin(t)]); } return out;
}
// 목의 닫힌 윤곽 (두 원 바깥만): 필렛 c+ → 원 B(마주 보는 쪽) → 필렛 c− → 원 A(마주 보는 쪽)
function neckOutline(N, n) {
  n = n || 24; const { rf, P, M, A, B } = N;
  return [].concat(arcPts(P.cx, P.cz, rf, P.ta, P.tb, n), arcPts(B.x, B.z, B.R, P.tb, M.tb, Math.ceil(n / 2)).slice(1),
    arcPts(M.cx, M.cz, rf, M.tb, M.ta, n).slice(1), arcPts(A.x, A.z, A.R, M.ta, P.ta, Math.ceil(n / 2)).slice(1, -1));
}
// 큰 기단 + 둘레 기단의 목 목록 (평면·3D가 같은 값을 써요)
function neckList(g, cl) {
  if (!cl || !cl.length || !(g.C > g.ground + 0.15)) return [];
  const Rf = g.R + g.L, pads = [{ x: 0, z: 0, R: Rf }].concat(cl.map(c => ({ x: c.x, z: c.z, R: c.R }))), H = g.C - g.ground, waist = Math.max(4.5, 1.6 * H);
  return neckEdges(pads).map(([a, b]) => neckShape(pads[a], pads[b], waist)).filter(Boolean);
}
// 평면 그림: 목을 칠하고 굵은 윤곽, 안쪽에 필렛을 따라 이어지는 등고선
function drawNecks(x, N, X, Y, sc, fill, ink) {
  for (const nk of N) {
    const pts = neckOutline(nk, 28); x.save(); x.beginPath(); pts.forEach(([px, pz], i) => i ? x.lineTo(X(px), Y(pz)) : x.moveTo(X(px), Y(pz))); x.closePath();
    x.fillStyle = fill; x.fill(); x.clip();
    x.strokeStyle = ink; x.globalAlpha = .35; x.lineWidth = .5;
    const half = Math.hypot(nk.P.cx - nk.M.cx, nk.P.cz - nk.M.cz) / 2 - nk.rf, st = Math.max(0.5, half / 4);
    for (let k = 1; k * st < half; k++) for (const S of [nk.P, nk.M]) { x.beginPath(); x.arc(X(S.cx), Y(S.cz), (nk.rf + k * st) * sc, 0, 2 * Math.PI); x.stroke(); }
    x.restore();
    // 굵은 윤곽은 두 필렛 곡선만 (원 쪽은 기단 윤곽이 이어받아요)
    x.save(); x.strokeStyle = ink; x.lineWidth = 1.6; x.lineCap = 'round';
    for (const [S, a, b] of [[nk.P, nk.P.ta, nk.P.tb], [nk.M, nk.M.ta, nk.M.tb]]) { const q = arcPts(S.cx, S.cz, nk.rf, a, b, 28); x.beginPath(); q.forEach(([px, pz], i) => i ? x.lineTo(X(px), Y(pz)) : x.moveTo(X(px), Y(pz))); x.stroke(); }
    x.restore();
  }
}
