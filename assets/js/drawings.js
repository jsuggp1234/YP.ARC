// ============================================================
// drawings.js — 작품 사진이 없을 때 보여줄 "도면형 자리표시"를 코드로 그려요.
// 같은 작품은 항상 같은 그림이 나오도록 작품 이름을 씨앗(seed)으로 써요.
// 색은 CSS 변수(--ink 등)를 따라가서 라이트/다크 모드에 자동으로 맞춰져요.
//   Drawing.svg(kind, seed, 가로, 세로, mass)
//   kind: plan · section · elevation · axon · site · concept · portrait
// ============================================================
(function () {
  let uid = 0;
  const hash = (s) => {
    let h = 2166136261;
    for (const ch of String(s)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); }
    return h >>> 0;
  };
  const rng = (seed) => {
    let a = hash(seed);
    return () => {
      a = (a + 0x6d2b79f5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  };
  const n = (v) => Math.round(v * 10) / 10;
  const L = (x1, y1, x2, y2, c = "dk") => `<line class="${c}" x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}"/>`;
  const R = (x, y, w, h, c = "dk") => `<rect class="${c}" x="${n(x)}" y="${n(y)}" width="${n(w)}" height="${n(h)}"/>`;
  const PG = (pts, c = "dk") => `<polygon class="${c}" points="${pts.map((p) => n(p[0]) + "," + n(p[1])).join(" ")}"/>`;
  const C = (cx, cy, r, c = "dk") => `<circle class="${c}" cx="${n(cx)}" cy="${n(cy)}" r="${n(r)}"/>`;
  const T = (x, y, s, fs, a = "start", c = "dtx") => `<text class="${c}" x="${n(x)}" y="${n(y)}" font-size="${n(fs)}" text-anchor="${a}">${s}</text>`;
  const ARC = (x1, y1, x2, y2, r, sw, c = "dthin") => `<path class="${c}" d="M${n(x1)} ${n(y1)} A${n(r)} ${n(r)} 0 0 ${sw} ${n(x2)} ${n(y2)}"/>`;

  const north = (x, y, s, fs) =>
    C(x, y, s, "dthin") + PG([[x, y - s * 0.8], [x + s * 0.32, y + s * 0.5], [x, y + s * 0.22], [x - s * 0.32, y + s * 0.5]], "df") + T(x, y - s * 1.25, "N", fs * 0.8, "middle");

  const scaleBar = (x, y, unit, fs, labels = ["0", "5", "10", "20m"]) => {
    let o = "";
    const segs = [1, 1, 2];
    let cx = x;
    segs.forEach((s, i) => { o += R(cx, y, unit * s, unit * 0.18, i % 2 ? "dbgk" : "df"); cx += unit * s; });
    let tx = x;
    o += T(tx, y - fs * 0.5, labels[0], fs * 0.7, "middle");
    segs.forEach((s, i) => { tx += unit * s; o += T(tx, y - fs * 0.5, labels[i + 1], fs * 0.7, "middle"); });
    return o;
  };

  // ---------- 평면 ----------
  function plan(W, H, r, fs) {
    let o = "";
    const bx = 5 + Math.floor(r() * 3), by = 3 + Math.floor(r() * 2);
    const cell = Math.min((W * 0.62) / bx, (H * 0.5) / by);
    const ox = (W - bx * cell) / 2, oy = (H - by * cell) / 2 + fs * 0.4;
    const X = (i) => ox + i * cell, Y = (j) => oy + j * cell;
    const t = cell * 0.09; // 외벽 두께
    const br = fs * 0.85;

    // 그리드 축선 + 버블
    for (let i = 0; i <= bx; i++) {
      o += L(X(i), oy - cell * 0.5, X(i), Y(by) + cell * 0.32, "dax");
      o += C(X(i), oy - cell * 0.5 - br, br, "dthin") + T(X(i), oy - cell * 0.5 - br + fs * 0.32, i + 1, fs * 0.8, "middle");
    }
    for (let j = 0; j <= by; j++) {
      o += L(ox - cell * 0.5, Y(j), X(bx) + cell * 0.32, Y(j), "dax");
      o += C(ox - cell * 0.5 - br, Y(j), br, "dthin") + T(ox - cell * 0.5 - br, Y(j) + fs * 0.32, "ABCDEFG"[j], fs * 0.8, "middle");
    }

    // 실 나누기
    const rooms = [];
    const split = (x, y, w, h, d) => {
      if (d === 0 || (w < 2 && h < 2) || (d < 2 && r() < 0.3)) return rooms.push([x, y, w, h]);
      const v = w > h ? true : w < h ? false : r() < 0.5;
      if (v && w >= 2) { const s = 1 + Math.floor(r() * (w - 1)); split(x, y, s, h, d - 1); split(x + s, y, w - s, h, d - 1); }
      else if (!v && h >= 2) { const s = 1 + Math.floor(r() * (h - 1)); split(x, y, w, s, d - 1); split(x, y + s, w, h - s, d - 1); }
      else rooms.push([x, y, w, h]);
    };
    split(0, 0, bx, by, 3);

    // 외벽 포셰
    o += R(X(0) - t / 2, Y(0) - t / 2, bx * cell + t, by * cell + t, "df");
    o += R(X(0) + t / 2, Y(0) + t / 2, bx * cell - t, by * cell - t, "dbgf");
    // 창: 외벽 일부를 비우고 유리선
    for (let i = 0; i < bx; i++) {
      [[Y(0), 0], [Y(by), 1]].forEach(([yy]) => {
        if (r() < 0.62) {
          const a = X(i) + cell * 0.18, b = X(i + 1) - cell * 0.18;
          o += R(a, yy - t / 2 - 0.5, b - a, t + 1, "dbgf") + L(a, yy - t * 0.15, b, yy - t * 0.15, "dthin") + L(a, yy + t * 0.15, b, yy + t * 0.15, "dthin");
        }
      });
    }
    for (let j = 0; j < by; j++) {
      if (r() < 0.5) {
        const a = Y(j) + cell * 0.22, b = Y(j + 1) - cell * 0.22, xx = X(bx);
        o += R(xx - t / 2 - 0.5, a, t + 1, b - a, "dbgf") + L(xx - t * 0.15, a, xx - t * 0.15, b, "dthin") + L(xx + t * 0.15, a, xx + t * 0.15, b, "dthin");
      }
    }
    // 내벽
    rooms.forEach(([x, y, w, h]) => { o += R(X(x), Y(y), w * cell, h * cell, "dwall"); });
    // 문 + 열림 호
    const dw = cell * 0.42;
    rooms.forEach(([x, y, w, h], k) => {
      if (x > 0) {
        const my = Y(y) + (h * cell) / 2, xx = X(x);
        o += R(xx - t * 0.35, my - dw / 2, t * 0.7, dw, "dbgf") + L(xx, my - dw / 2, xx + dw, my - dw / 2, "dthin") + ARC(xx + dw, my - dw / 2, xx, my + dw / 2, dw, 1);
      } else if (y > 0) {
        const mx = X(x) + (w * cell) / 2, yy = Y(y);
        o += R(mx - dw / 2, yy - t * 0.35, dw, t * 0.7, "dbgf") + L(mx - dw / 2, yy, mx - dw / 2, yy + dw, "dthin") + ARC(mx - dw / 2, yy + dw, mx + dw / 2, yy, dw, 0);
      }
      // 실 번호 + 면적 (1칸 = 7.2m)
      const area = (w * h * 51.84).toFixed(1);
      const cx = X(x) + (w * cell) / 2, cy = Y(y) + (h * cell) / 2;
      if (w * h >= 1) o += T(cx, cy, `R${String(k + 1).padStart(2, "0")}`, fs * 0.72, "middle") + T(cx, cy + fs * 0.95, `${area}㎡`, fs * 0.62, "middle", "dtx2");
    });
    // 계단
    const st = rooms.find(([, , w, h]) => w * h >= 2) || rooms[0];
    if (st) {
      const sx = X(st[0]) + cell * 0.12, sy = Y(st[1]) + cell * 0.12, sw = cell * 0.36, sh = cell * 0.76;
      for (let k = 0; k <= 10; k++) o += L(sx, sy + (sh * k) / 10, sx + sw, sy + (sh * k) / 10, "dthin");
      o += R(sx, sy, sw, sh, "dthin") + L(sx + sw / 2, sy + sh * 0.9, sx + sw / 2, sy + sh * 0.12, "dthin") + PG([[sx + sw / 2, sy + sh * 0.06], [sx + sw / 2 - 4, sy + sh * 0.16], [sx + sw / 2 + 4, sy + sh * 0.16]], "df");
    }
    // 기둥
    for (let i = 0; i <= bx; i++) for (let j = 0; j <= by; j++) { const s = cell * 0.075; o += R(X(i) - s / 2, Y(j) - s / 2, s, s, "df"); }
    // 치수선
    const dy = Y(by) + cell * 0.62;
    o += L(X(0), dy, X(bx), dy, "dthin");
    for (let i = 0; i <= bx; i++) {
      o += L(X(i) - 4, dy + 4, X(i) + 4, dy - 4, "dk") + L(X(i), dy - 8, X(i), dy + 8, "dthin");
      if (i < bx) o += T((X(i) + X(i + 1)) / 2, dy - fs * 0.45, "7200", fs * 0.66, "middle");
    }
    o += T((X(0) + X(bx)) / 2, dy + fs * 1.3, String(7200 * bx), fs * 0.66, "middle");
    o += north(W - fs * 4, fs * 4.2, fs * 1.4, fs);
    o += scaleBar(fs * 2.4, H - fs * 4.4, cell * 0.35, fs);
    return o;
  }

  // ---------- 단면 ----------
  function section(W, H, r, fs, id) {
    let o = "";
    const floors = 3 + Math.floor(r() * 3), bays = 5 + Math.floor(r() * 3);
    const bw = W * 0.6, fh = Math.min((H * 0.5) / floors, (bw / bays) * 0.62);
    const x0 = (W - bw) / 2 - fs, gy = H * 0.52 + (floors * fh) / 2;
    const st = Math.max(fh * 0.09, 3);
    o += `<defs><pattern id="e${id}" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="dh" x1="0" y1="0" x2="0" y2="10"/></pattern></defs>`;
    o += `<rect x="${n(x0 - bw * 0.18)}" y="${n(gy)}" width="${n(bw * 1.36)}" height="${n(fh * 0.9)}" fill="url(#e${id})"/>`;
    // 지하층
    if (r() < 0.55) { o += R(x0 + bw * 0.12, gy + 2, bw * 0.6, fh * 0.75, "dbgf") + R(x0 + bw * 0.12, gy, bw * 0.6, fh * 0.75, "dk"); }
    // 나무, 사람
    const tree = (tx) => { o += L(tx, gy, tx, gy - fh * 0.55, "dp") + C(tx, gy - fh * 0.85, fh * 0.42, "dp"); };
    tree(x0 - bw * 0.1); if (r() < 0.6) tree(x0 + bw * 1.08);
    const person = (px, py) => { const h = fh * 0.34; o += C(px, py - h, h * 0.13, "dthin") + L(px, py - h * 0.86, px, py - h * 0.38, "dthin") + L(px, py - h * 0.38, px - h * 0.1, py, "dthin") + L(px, py - h * 0.38, px + h * 0.1, py, "dthin"); };
    // 보이드
    const vk = 1 + Math.floor(r() * Math.max(1, floors - 2)), vb = 1 + Math.floor(r() * (bays - 2));
    const bx = (i) => x0 + (bw / bays) * i;
    // 빛 (단면에서 빛을 먼저 그린다)
    o += `<line class="dr" x1="${n(bx(vb) - fh * 1.6)}" y1="${n(gy - (floors + 1.2) * fh)}" x2="${n(bx(vb + 0.6))}" y2="${n(gy - (vk - 0.6) * fh)}"/>`;
    // 기둥(보이는 선)
    for (let i = 1; i < bays; i++) o += L(bx(i), gy, bx(i), gy - floors * fh, "dp");
    // 슬래브
    for (let k = 1; k <= floors; k++) {
      const y = gy - k * fh;
      if (k === vk) { o += R(x0, y, bx(vb) - x0, st, "df") + R(bx(vb + 1), y, x0 + bw - bx(vb + 1), st, "df"); }
      else o += R(x0, y, bw, st, "df");
    }
    // 외벽 유리
    [x0, x0 + bw].forEach((xx) => { o += L(xx, gy, xx, gy - floors * fh, "dk") + L(xx + (xx === x0 ? 3 : -3), gy, xx + (xx === x0 ? 3 : -3), gy - floors * fh + st, "dthin"); });
    // 파라펫
    o += R(x0, gy - floors * fh - fh * 0.16, st, fh * 0.16, "df") + R(x0 + bw - st, gy - floors * fh - fh * 0.16, st, fh * 0.16, "df");
    // 사람
    for (let k = 0; k < floors; k++) if (r() < 0.75) person(x0 + bw * (0.15 + r() * 0.7), gy - k * fh);
    // 지반선
    o += L(x0 - bw * 0.22, gy, x0 + bw * 1.22, gy, "dk2");
    // 레벨
    const lx = x0 + bw + fs * 1.6;
    for (let k = 0; k <= floors; k++) {
      const y = gy - k * fh;
      o += PG([[lx, y], [lx - fs * 0.38, y - fs * 0.6], [lx + fs * 0.38, y - fs * 0.6]], "dthin") + L(lx - fs * 0.6, y, lx + fs * 3.6, y, "dthin");
      o += T(lx + fs * 0.6, y - fs * 0.3, k === 0 ? "±0.00" : "+" + (k * 3.6).toFixed(2), fs * 0.66);
    }
    return o;
  }

  // ---------- 입면 ----------
  function elevation(W, H, r, fs) {
    let o = "";
    const floors = 3 + Math.floor(r() * 3), bays = 6 + Math.floor(r() * 4);
    const bw = W * 0.62, fh = Math.min((H * 0.5) / floors, (bw / bays) * 0.7);
    const x0 = (W - bw) / 2, gy = H * 0.53 + (floors * fh) / 2, cw = bw / bays;
    o += R(x0, gy - floors * fh, bw, floors * fh, "dk");
    for (let k = 0; k < floors; k++) {
      const yb = gy - k * fh, yt = yb - fh;
      o += L(x0, yt, x0 + bw, yt, "dthin");
      const kind = k === 0 ? "ground" : ["ribbon", "punched", "fins"][Math.floor(r() * 3)];
      if (kind === "ground") {
        o += R(x0 + cw * 0.2, yt + fh * 0.18, bw - cw * 0.4, fh * 0.82, "dthin");
        for (let i = 1; i < bays; i++) o += L(x0 + i * cw, yt + fh * 0.18, x0 + i * cw, yb, "dthin");
        const d = Math.floor(bays / 2); o += R(x0 + d * cw + cw * 0.2, yt + fh * 0.35, cw * 0.6, fh * 0.65, "dk");
      } else if (kind === "ribbon") {
        o += R(x0 + cw * 0.3, yt + fh * 0.3, bw - cw * 0.6, fh * 0.42, "dthin");
        for (let i = 1; i < bays; i++) o += L(x0 + i * cw, yt + fh * 0.3, x0 + i * cw, yt + fh * 0.72, "dthin");
      } else if (kind === "punched") {
        for (let i = 0; i < bays; i++) o += R(x0 + i * cw + cw * 0.28, yt + fh * 0.22, cw * 0.44, fh * 0.56, "dthin");
      } else {
        for (let i = 0; i <= bays * 3; i++) o += L(x0 + (i * cw) / 3, yt, x0 + (i * cw) / 3, yb, "dp");
      }
    }
    o += R(x0 - 2, gy - floors * fh - fh * 0.12, bw + 4, fh * 0.12, "dk");
    o += L(x0 - bw * 0.22, gy, x0 + bw * 1.22, gy, "dk2");
    const tree = (tx, s) => { o += L(tx, gy, tx, gy - fh * 0.6 * s, "dp") + C(tx, gy - fh * 0.95 * s, fh * 0.45 * s, "dp"); };
    tree(x0 - bw * 0.1, 1.1); tree(x0 + bw * 1.1, 0.9);
    return o;
  }

  // ---------- 액소노메트릭 ----------
  const CS = Math.cos(Math.PI / 6), SN = 0.5;
  const proj = (x, y, z) => [(x - y) * CS, (x + y) * SN - z];
  function hull(pts) {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of pts.reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  function bounds(boxes) {
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    boxes.forEach((b) => [[b.x, b.y, 0], [b.x + b.w, b.y, 0], [b.x, b.y + b.d, 0], [b.x + b.w, b.y + b.d, 0], [b.x, b.y, b.h], [b.x + b.w, b.y, b.h], [b.x, b.y + b.d, b.h], [b.x + b.w, b.y + b.d, b.h]].forEach(([x, y, z]) => {
      const [px, py] = proj(x, y, z); x0 = Math.min(x0, px); x1 = Math.max(x1, px); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
    }));
    return { x0, y0, x1, y1 };
  }
  function axonDraw(boxes, rx, ry, rw, rh, opt = {}) {
    let o = "";
    const B = opt.fit || bounds(boxes.concat(opt.ground === false ? [] : []));
    const s = Math.min(rw / (B.x1 - B.x0), rh / (B.y1 - B.y0)) * (opt.pad || 0.84);
    const cx = rx + rw / 2 - ((B.x0 + B.x1) / 2) * s, cy = ry + rh / 2 - ((B.y0 + B.y1) / 2) * s;
    const P = (x, y, z) => { const [a, b] = proj(x, y, z); return [cx + a * s, cy + b * s]; };
    // 바닥 그리드
    if (opt.grid !== false) {
      let gx0 = Infinity, gy0 = Infinity, gx1 = -Infinity, gy1 = -Infinity;
      boxes.forEach((b) => { gx0 = Math.min(gx0, b.x); gy0 = Math.min(gy0, b.y); gx1 = Math.max(gx1, b.x + b.w); gy1 = Math.max(gy1, b.y + b.d); });
      gx0 = Math.floor(gx0) - 2; gy0 = Math.floor(gy0) - 2; gx1 = Math.ceil(gx1) + 2; gy1 = Math.ceil(gy1) + 2;
      for (let i = gx0; i <= gx1; i++) { const a = P(i, gy0, 0), b = P(i, gy1, 0); o += L(a[0], a[1], b[0], b[1], "dh"); }
      for (let j = gy0; j <= gy1; j++) { const a = P(gx0, j, 0), b = P(gx1, j, 0); o += L(a[0], a[1], b[0], b[1], "dh"); }
    }
    // 그림자
    if (opt.shadow !== false) boxes.forEach((b) => {
      const base = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.d], [b.x, b.y + b.d]];
      const pts = base.concat(base.map(([x, y]) => [x + b.h * 0.7, y - b.h * 0.15])).map(([x, y]) => P(x, y, 0));
      o += PG(hull(pts), "dsh");
    });
    // 매스 (뒤에서 앞으로)
    boxes.slice().sort((a, b) => a.x + a.w / 2 + a.y + a.d / 2 - (b.x + b.w / 2 + b.y + b.d / 2) || a.h - b.h).forEach((b) => {
      const { x, y, w, d, h } = b;
      o += PG([P(x + w, y, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x + w, y, h)], "dface2");
      o += PG([P(x, y + d, 0), P(x + w, y + d, 0), P(x + w, y + d, h), P(x, y + d, h)], "dface1");
      if (opt.floors !== false) for (let z = 0.5; z < h - 0.05; z += 0.5) {
        const a = P(x + w, y, z), c = P(x + w, y + d, z), e = P(x, y + d, z);
        o += `<polyline class="dfl" points="${n(a[0])},${n(a[1])} ${n(c[0])},${n(c[1])} ${n(e[0])},${n(e[1])}"/>`;
      }
      o += PG([P(x, y, h), P(x + w, y, h), P(x + w, y + d, h), P(x, y + d, h)], "dface0");
    });
    return o;
  }
  const toBoxes = (mass) => mass.map(([x, y, w, d, h]) => ({ x, y, w, d, h }));
  const randomMass = (r) => {
    const m = [[0, 0, 2 + r() * 1.5, 1 + r(), 0.8 + r()]];
    m.push([r() * 1.5, 0.6 + r(), 1 + r(), 1 + r() * 0.8, 1.2 + r() * 1.4]);
    return m;
  };
  function axon(W, H, r, fs, mass) {
    const boxes = toBoxes(mass || randomMass(r));
    return axonDraw(boxes, W * 0.08, H * 0.1, W * 0.84, H * 0.74);
  }

  // ---------- 개념 다이어그램 (3단계) ----------
  function concept(W, H, r, fs, mass) {
    const boxes = toBoxes(mass || randomMass(r));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity, hm = 0;
    boxes.forEach((b) => { x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.d); hm = Math.max(hm, b.h); });
    const env = [{ x: x0, y: y0, w: x1 - x0, d: y1 - y0, h: hm * 0.62 }];
    const cut = boxes.map((b) => ({ ...b, h: Math.min(b.h, hm * 0.62) }));
    const fit = bounds(env.concat(boxes));
    const pw = W / 3;
    let o = "";
    const steps = [[env, "01  Volume"], [cut, "02  Carve"], [boxes, "03  Lift"]];
    steps.forEach(([bx, label], i) => {
      o += axonDraw(bx, pw * i + pw * 0.08, H * 0.2, pw * 0.84, H * 0.52, { fit, grid: false, pad: 0.86, floors: false });
      o += T(pw * i + pw / 2, H * 0.82, label, fs * 0.82, "middle");
      if (i < 2) { const ax = pw * (i + 1), ay = H * 0.5; o += L(ax - fs * 1.2, ay, ax + fs * 1.2, ay, "dthin") + PG([[ax + fs * 1.4, ay], [ax + fs * 0.9, ay - fs * 0.3], [ax + fs * 0.9, ay + fs * 0.3]], "df"); }
    });
    return o;
  }

  // ---------- 배치도 (figure-ground) ----------
  function site(W, H, r, fs, mass, id) {
    let o = "";
    const c = Math.max(W, H) / 15, st = c * 0.55;
    const cxm = W / 2, cym = H / 2;
    o += `<defs><pattern id="s${id}" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line class="dk" x1="0" y1="0" x2="0" y2="7"/></pattern></defs>`;
    o += `<g transform="rotate(-14 ${n(cxm)} ${n(cym)})">`;
    // 등고선
    for (let k = 0; k < 5; k++) { const y = H * (0.1 + k * 0.22); o += `<path class="dh" d="M${n(-W * 0.3)} ${n(y)} C ${n(W * 0.2)} ${n(y - c * 1.5)}, ${n(W * 0.7)} ${n(y + c * 1.4)}, ${n(W * 1.3)} ${n(y - c * 0.4)}"/>`; }
    const xs = [], ys = [];
    for (let x = -W * 0.4; x < W * 1.4; ) { const w = c * (2.2 + Math.floor(r() * 3)); xs.push([x, w]); x += w + st; }
    for (let y = -H * 0.4; y < H * 1.4; ) { const h = c * (1.8 + Math.floor(r() * 3)); ys.push([y, h]); y += h + st; }
    let best = null, bd = Infinity;
    xs.forEach(([x, w]) => ys.forEach(([y, h]) => { const d = Math.hypot(x + w / 2 - cxm, y + h / 2 - cym); if (d < bd) { bd = d; best = [x, y, w, h]; } }));
    xs.forEach(([x, w]) => ys.forEach(([y, h]) => {
      if (best && x === best[0] && y === best[1]) return;
      // 필지 나누기
      const cols = 1 + Math.floor(r() * 3), rows = 1 + Math.floor(r() * 2);
      for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
        if (r() < 0.14) continue;
        const pw = w / cols, ph = h / rows, ins = c * 0.08;
        const fw = pw * (0.6 + r() * 0.36), fh = ph * (0.55 + r() * 0.4);
        o += R(x + i * pw + ins, y + j * ph + ins, fw - ins, fh - ins, "df");
      }
    }));
    // 대지 + 계획안
    const [sx, sy, sw, sh] = best;
    o += `<rect class="dr dashed" x="${n(sx)}" y="${n(sy)}" width="${n(sw)}" height="${n(sh)}"/>`;
    const boxes = toBoxes(mass || randomMass(r));
    let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
    boxes.forEach((b) => { x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.d); });
    const k = Math.min((sw * 0.7) / (x1 - x0), (sh * 0.7) / (y1 - y0));
    const ox = sx + (sw - (x1 - x0) * k) / 2, oy = sy + (sh - (y1 - y0) * k) / 2;
    boxes.forEach((b) => { o += `<rect x="${n(ox + (b.x - x0) * k)}" y="${n(oy + (b.y - y0) * k)}" width="${n(b.w * k)}" height="${n(b.d * k)}" fill="url(#s${id})" class="dk"/>`; });
    o += `</g>`;
    o += north(W - fs * 4, fs * 4.2, fs * 1.4, fs);
    o += scaleBar(fs * 2.4, H - fs * 4.4, c * 0.6, fs, ["0", "10", "20", "50m"]);
    return o;
  }

  function portrait(W, H, r, fs) {
    return L(W / 2, 0, W / 2, H, "dh") + L(0, H / 2, W, H / 2, "dh") + C(W / 2, H * 0.4, W * 0.16, "dthin") + `<path class="dthin" d="M${n(W * 0.22)} ${n(H)} C ${n(W * 0.24)} ${n(H * 0.66)}, ${n(W * 0.76)} ${n(H * 0.66)}, ${n(W * 0.78)} ${n(H)}"/>`;
  }

  const META = {
    plan: ["Floor Plan", "1:200", plan],
    section: ["Section A–A′", "1:200", section],
    elevation: ["Elevation", "1:200", elevation],
    axon: ["Axonometric", "NTS", axon],
    site: ["Site Plan", "1:1000", site],
    concept: ["Concept Diagram", "NTS", concept],
    portrait: ["Portrait", "3:4", portrait],
  };

  window.Drawing = {
    META,
    svg(kind, seed, W = 1200, H = 900, mass = null) {
      const [title, scale, fn] = META[kind] || META.axon;
      const r = rng(kind + ":" + seed);
      const fs = Math.max(W, H) / 70;
      const id = ++uid;
      const m = fs * 1.9;
      const body = fn(W, H, r, fs, mass, id);
      return `<svg class="dw" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${title} (sample drawing)">` +
        `<rect class="dbg" width="${W}" height="${H}"/>` + body +
        T(m, H - m, title.toUpperCase(), fs * 0.8) + T(W - m, H - m, "SAMPLE · " + scale, fs * 0.8, "end") +
        `</svg>`;
    },
  };
})();
