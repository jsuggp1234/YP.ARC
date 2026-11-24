// 핀 #303: 변수체계 — 3D 대신 평면 + 단면 그림. 아이콘을 누르면 그 변수가 바꾸는 부분만 먹색, 나머지는 옅은 회색.
const DG_VARS = ['layer', 'edge', 'connect', 'stay', 'slope', 'zone', 'noon'], DG_PART = { floors: 'layer', steps: 'edge', neck: 'connect', ramp: 'stay', widths: 'slope', zones: 'zone', open: 'noon' };
function dgVar(k) {
  if (DG_VARS.includes(k)) return k; if (DG_PART[k]) return DG_PART[k];
  for (const [a, b] of LK.links) if (a === k && DG_VARS.includes(b)) return b;
  for (const [a, b] of LK.links) if (a === k) { const v = dgVar(b); if (v) return v; }
  return 'layer';
}
function dgCaption(sel, v) {
  const nm = k => (LK.nodes.find(n => n[0] === k) || [])[2] || k, col = (LK.links.find(l => l[1] === v && !l[2] && LK.nodes.some(n => n[0] === l[0] && n[1] === 1)) || [])[0];
  const part = (LK.links.find(l => l[0] === v && !l[2]) || [])[1], q = sel && sel[0] === 'q' && /^q\d$/.test(sel) ? nm(sel) + ' → ' : '';
  return q + (col ? nm(col) + ' → ' : '') + '<b>' + nm(v) + '</b>' + (part ? ' → ' + nm(part) : '');
}
function drawDiag() {
  const el = document.getElementById('d-diag'); if (!el || el.getBoundingClientRect().width < 10 || typeof model !== 'function' || !DATA) return;
  let g; try { g = model(ST.sea).g; } catch (_) { return; }
  const v = dgVar(LK.sel), XC = CORE.XC, { x, w, h } = cv('d-diag'), narrow = w < 560;
  const ink = K.ink, faint = K.faint, on = k => k === v || v === 'zone' || v === 'noon';
  // 평면 (왼쪽, 휴대폰은 위)
  const PW = narrow ? w : Math.min(w * 0.24, h + 20), PH = narrow ? h * 0.48 : h, Rf = g.R + (g.L > 0.1 ? g.L : 0), xl = Math.min(XC - Rf, g.xn0 != null ? g.xn0 : XC - Rf, ...(g.stairs || []).map(s => s[0]));
  const ext = Math.max(Rf, XC - xl), ps = Math.min((PW - 24) / (ext + Rf), (PH - 40) / (2 * Rf)), cx = 4 + (XC - xl) * ps, cy = 22 + (PH - 30) / 2, PX = a => cx + (a - XC) * ps;
  txt(x, PLAN_T, 12, 10, { font: FS(10.5, true), color: K.muted });
  const shape = (draw, act, fill) => { x.save(); draw(); if (act) { x.fillStyle = ink; x.globalAlpha = fill == null ? .16 : fill; x.fill('evenodd'); x.globalAlpha = 1; x.strokeStyle = ink; x.lineWidth = 1.8; } else { x.strokeStyle = faint; x.lineWidth = .8; } x.stroke(); x.restore(); };
  if (g.L > 0.1) shape(() => { x.beginPath(); x.arc(cx, cy, Rf * ps, 0, 2 * Math.PI); x.moveTo(cx + g.R * ps, cy); x.arc(cx, cy, g.R * ps, 2 * Math.PI, 0, true); }, on('stay'));
  for (let i = g.T.length - 1; i >= 0; i--) { const t = g.T[i], st = t.k === 'step'; shape(() => { x.beginPath(); x.arc(cx, cy, t.r1 * ps, 0, 2 * Math.PI); if (t.r0 > 0.01) { x.moveTo(cx + t.r0 * ps, cy); x.arc(cx, cy, t.r0 * ps, 2 * Math.PI, 0, true); } }, st ? (on('edge') || on('slope')) : on('layer'), st ? .1 : .2); }
  const nw = CORE.NECK_W * ps;
  if (g.xn1 > g.xn0) shape(() => { x.beginPath(); x.rect(PX(g.xn0), cy - nw / 2, (g.xn1 - g.xn0) * ps, nw); }, on('connect'), .3);
  for (const [a, b] of g.stairs || []) shape(() => { x.beginPath(); x.rect(PX(a), cy - nw / 2, (b - a) * ps, nw); }, false);
  // 단면 (오른쪽, 휴대폰은 아래)
  const SL = narrow ? 36 : PW + 40, SR = w - 8, T0 = narrow ? PH + 30 : 30, B = h - 16, zlo = g.ground - 0.8, zhi = Math.max(g.land, g.top) + 0.5, xMax = Math.max(CORE.XE, g.xs1 + 3);
  const X = lin(CORE.XL, xMax, SL, SR), Y = lin(zlo, zhi, B, T0), P = (a, b) => [X(a), Y(b)];
  txt(x, SEC_T, SL, T0 - 18, { font: FS(10.5, true), color: K.muted });
  for (const z of ticks(zlo, zhi, 4)) txt(x, fH(z, 0), SL - 6, Y(z), { align: 'right', font: FS(10), color: faint });
  x.save(); x.globalAlpha = .28; drawSection(x, g, P, {}); x.globalAlpha = 1; x.restore();
  if (v === 'zone' || v === 'noon') { x.save(); x.globalAlpha = .9; drawSection(x, g, P, {}); x.restore(); } else partLines(x, g, P, v, ink);
  const cap = document.getElementById('d-cap'); if (cap) cap.innerHTML = dgCaption(LK.sel, v);
}
