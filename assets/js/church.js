/* Moduleverse Church(미래교회) 시뮬레이션 — 핀 #401~#405
   - cross:  정면 입면을 3D 모델로. 정면·측면·배면·아이소로 돌려 보고, 수면 아래 트윈도 켜고 끌 수 있어요.
   - layers: 다섯 수직 레이어를 30 m씩 띄운 3D 모델. 끌어서 360° 돌리고, 레이어 번호에 올리면 그 층만 보여요.
   - clock:  접속 시계. 바늘이 하루(KST)를 돌며 깨어 있는 도시·예배 시간·현장/트윈 인원이 바뀌어요.
   - plan:   세계지도 판 평면. 도시마다 현지 시각에 맞춰 아바타가 모였다 흩어지고 SYNC가 오가요.
   - steps:  발자국. UTC 하루 동안 서울·런던·뉴욕의 발자국이 모듈 바닥에 남았다가 10시간에 걸쳐 옅어져요.
   모듈 좌표 원본이 없어서 3D는 시트의 수치(모듈 3 m, 줄기 31 m, 가로대 219 m, 높이 297 m, 레이어별 모듈 수)로 만들어요.
   글자 크기는 사이트 토큰(--t-xs, --t-s)을 그대로 읽어 화면에서 같은 크기로 보여요. */
(() => {
  const root = document.documentElement;
  const css = (k) => getComputedStyle(root).getPropertyValue(k).trim();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rgb = (h) => { const m = (h || "").match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i); return m ? [1, 2, 3].map((i) => parseInt(m[i], 16)) : null; };
  let C = {};
  const colors = () => {
    const bg = rgb(css("--bg")) || [255, 255, 255], ink = rgb(css("--ink")) || [17, 17, 17];
    const arr = (a) => bg.map((v, i) => Math.round(v + (ink[i] - v) * a));
    const dark = bg[0] + bg[1] + bg[2] < 384;
    C = { bg: `rgb(${bg})`, red: (o = 1) => (dark ? `rgba(236,86,92,${o})` : `rgba(192,53,58,${o})`), mix: (a, o = 1) => `rgba(${arr(a)},${o})`, hex: (a) => (arr(a)[0] << 16) | (arr(a)[1] << 8) | arr(a)[2],
      xs: parseFloat(css("--t-xs")) || 10, s: parseFloat(css("--t-s")) || 11, m: parseFloat(css("--t-m")) || 12.5,
      font: getComputedStyle(document.body).fontFamily || "Inter, sans-serif" };
  };
  colors();
  const sm = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const gauss = (x, m, s) => Math.exp(-((x - m) * (x - m)) / (2 * s * s));
  const wrap24 = (h) => ((h % 24) + 24) % 24;
  const hhmm = (h) => { const m = Math.floor(wrap24(h) * 60); return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
  const rnd = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const font = (px, w = 400) => `${w} ${px}px ${C.font}`;
  const themed = [];
  document.addEventListener("yp:theme", () => { colors(); themed.forEach((f) => f()); });

  // 2D 캔버스 무대: 화면에 보일 때만 그리고, 크기가 바뀌면 다시 맞춰요
  const stage = (el, draw, opt = {}) => {
    const cv = document.createElement("canvas"), g = cv.getContext("2d");
    cv.className = "mv-cv"; el.appendChild(cv);
    let W = 0, H = 0, live = false, raf = 0, t0 = performance.now(), hover = null;
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = el.clientWidth; H = el.clientHeight; cv.width = Math.round(W * d); cv.height = Math.round(H * d); g.setTransform(d, 0, 0, d, 0, 0); };
    const loop = (now) => { raf = 0; if (!W) size(); g.clearRect(0, 0, W, H); const more = draw(g, W, H, reduce ? 6 : (now - t0) / 1000, hover); if (live && !reduce && more !== false) raf = requestAnimationFrame(loop); };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    new ResizeObserver(() => { size(); kick(); }).observe(el);
    new IntersectionObserver(([e]) => { live = e.isIntersecting; if (live) kick(); }).observe(el);
    if (opt.hover) {
      cv.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); hover = { x: e.clientX - r.left, y: e.clientY - r.top }; kick(); });
      cv.addEventListener("pointerleave", () => { hover = null; kick(); });
    }
    themed.push(kick);
    return { cv, kick };
  };

  // ── 접속 시계 (핀 #401) ──
  const CITIES = [
    { n: "SEOUL", off: 9, w: 412 }, { n: "MANILA", off: 8, w: 268 }, { n: "NAIROBI", off: 3, w: 121 }, { n: "LAGOS", off: 1, w: 197 },
    { n: "LONDON", off: 0, w: 86 }, { n: "SÃO PAULO", off: -3, w: 110 }, { n: "LOS ANGELES", off: -8, w: 150 },
  ];
  const act = (local) => { local = wrap24(local); const awake = local >= 7 && local < 23; return awake ? 0.3 + 0.7 * Math.max(gauss(local, 11, 0.8), gauss(local, 20, 0.8)) : 0.04; };
  const occ = (h) => { h = wrap24(h); return h < 6 ? 0.03 : 0.12 + 0.88 * Math.max(gauss(h, 11, 1.1), 0.72 * gauss(h, 19.8, 1.0)) + 0.15 * gauss(h, 15, 2.5); };
  const clock = (el) => {
    let scrub = null;
    stage(el, (g, W, H, t, hv) => {
      const cx = W * 0.5, cy = H * 0.52, R = Math.min(W, H) * 0.42;
      const ang = (h) => -Math.PI / 2 + (wrap24(h) / 24) * Math.PI * 2;
      let h = wrap24(6 + t * 1.2);
      if (hv) { const a = Math.atan2(hv.y - cy, hv.x - cx), d = Math.hypot(hv.x - cx, hv.y - cy); if (d < R * 1.15) { scrub = wrap24(((a + Math.PI / 2) / (Math.PI * 2)) * 24); } else scrub = null; } else scrub = null;
      if (scrub != null) h = scrub;
      // 시각 눈금
      g.textAlign = "center"; g.textBaseline = "middle";
      for (let k = 0; k < 24; k++) {
        const a = ang(k), big = k % 6 === 0, r0 = R * 1.03, r1 = R * (big ? 1.08 : 1.05);
        g.strokeStyle = C.mix(big ? 0.6 : 0.3); g.lineWidth = big ? 1 : 0.6;
        g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * r1, cy + Math.sin(a) * r1); g.stroke();
        if (k % 3 === 0) { g.fillStyle = C.mix(big ? 0.9 : 0.45); g.font = font(big ? C.s : C.xs, big ? 600 : 400); g.fillText(String(k).padStart(2, "0"), cx + Math.cos(a) * R * 1.15, cy + Math.sin(a) * R * 1.15); }
      }
      // 도시 고리: 깨어 있는 시간(현지 07~23시)을 서울 시간으로
      const th = R * 0.05, awakeN = [];
      let twin = 0;
      CITIES.forEach((c, i) => {
        const r = R * (0.97 - i * 0.075), local = h - 9 + c.off, on = wrap24(local) >= 7 && wrap24(local) < 23;
        twin += c.w * act(local);
        if (on) awakeN.push(c.n);
        g.lineWidth = th; g.lineCap = "butt";
        g.strokeStyle = C.mix(0.035); g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.stroke();
        const s0 = 7 + 9 - c.off, tone = 0.5 - i * 0.045;
        g.strokeStyle = C.mix(on ? tone : tone * 0.45); g.beginPath(); g.arc(cx, cy, r, ang(s0), ang(s0) + (16 / 24) * Math.PI * 2); g.stroke();
        // 예배 칸: 현지 10:30, 19:30 (1시간)
        [10.5, 19.5].forEach((sv) => {
          const k0 = sv + 9 - c.off, inS = wrap24(h - k0) < 1;
          g.strokeStyle = inS ? C.mix(0.95) : C.bg; g.lineWidth = th * (inS ? 1 : 0.7);
          g.beginPath(); g.arc(cx, cy, r, ang(k0), ang(k0 + 1)); g.stroke();
          if (!inS) { g.setLineDash([2, 2]); g.lineWidth = 0.6; g.strokeStyle = C.mix(0.45); [r - th / 2, r + th / 2].forEach((rr) => { g.beginPath(); g.arc(cx, cy, rr, ang(k0), ang(k0 + 1)); g.stroke(); }); g.setLineDash([]); }
        });
        c._lab = [ang(s0 + 0.6), r, on];
      });
      // 이름표는 모든 고리를 그린 뒤에 (안쪽 고리에 가려지지 않게)
      CITIES.forEach((c) => { const [la, r, on] = c._lab; g.font = font(C.xs, on ? 600 : 500); const x = cx + Math.cos(la) * r, y = cy + Math.sin(la) * r, w = g.measureText(c.n).width;
        g.fillStyle = C.bg; g.fillRect(x - w / 2 - 3, y - C.xs * 0.7, w + 6, C.xs * 1.4); g.fillStyle = C.mix(on ? 0.95 : 0.4); g.fillText(c.n, x, y); });
      // 안쪽: 현장(서울) 인원 — 지나온 시간만 진하게
      const rIn = R * 0.43, r0 = R * 0.14;
      g.strokeStyle = C.mix(0.8); g.lineWidth = 0.8; g.beginPath(); g.arc(cx, cy, rIn, 0, Math.PI * 2); g.stroke();
      const blob = (from, to, fill) => { g.beginPath(); g.moveTo(cx, cy); for (let k = 0; k <= 96; k++) { const hh = from + ((to - from) * k) / 96, rr = r0 + (rIn - r0) * 0.95 * occ(hh); g.lineTo(cx + Math.cos(ang(hh)) * rr, cy + Math.sin(ang(hh)) * rr); } g.closePath(); g.fillStyle = fill; g.fill(); };
      blob(0, 24, C.mix(0.12)); blob(0, h, C.mix(0.5));
      g.fillStyle = C.bg; g.beginPath(); g.arc(cx, cy, r0, 0, Math.PI * 2); g.fill(); g.strokeStyle = C.mix(0.5); g.lineWidth = 0.6; g.stroke();
      g.fillStyle = C.mix(0.95); g.font = font(C.m, 600); g.fillText("KST " + hhmm(h), cx, cy - C.xs * 0.6);
      g.font = font(C.xs); g.fillStyle = C.mix(0.55); g.fillText("트윈은 잠들지 않는다", cx, cy + C.xs * 0.9);
      // 바늘
      const a = ang(h);
      g.strokeStyle = C.mix(0.95); g.lineWidth = 1; g.beginPath(); g.moveTo(cx + Math.cos(a) * r0, cy + Math.sin(a) * r0); g.lineTo(cx + Math.cos(a) * R * 1.06, cy + Math.sin(a) * R * 1.06); g.stroke();
      g.fillStyle = C.mix(0.95); g.beginPath(); g.arc(cx + Math.cos(a) * R * 1.06, cy + Math.sin(a) * R * 1.06, 2.5, 0, Math.PI * 2); g.fill();
      // 읽기 값
      g.textAlign = "left"; g.textBaseline = "alphabetic";
      const rows = [["현장(서울)", `${Math.round(occ(h) * 420)}명`], ["트윈 접속", `${Math.round(twin).toLocaleString()}명`], ["깨어 있는 도시", `${awakeN.length} / 7`]];
      rows.forEach(([k, v], i) => { const y = H - 12 - (rows.length - 1 - i) * (C.xs * 1.7); g.font = font(C.xs); g.fillStyle = C.mix(0.5); g.fillText(k, 4, y); g.font = font(C.xs, 600); g.fillStyle = C.mix(0.95); g.fillText(v, 4 + C.xs * 7.5, y); });
      g.font = font(C.xs); g.fillStyle = C.mix(0.45); g.textAlign = "right";
      g.fillText(scrub != null ? "시계 위에서 마우스를 돌려 시각을 고르세요" : "마우스를 올리면 시각을 직접 돌려 볼 수 있어요", W - 4, H - 12);
    }, { hover: true });
  };

  // ── 세계지도 판 평면 (핀 #402) ──
  const plan = (el) => {
    const bg = new Image(); bg.src = el.dataset.bg;
    const P = [ // 바탕 그림 기준 위치(0~1)
      { n: "SEOUL", off: 9, w: 412, x: 0.79, y: 0.395 }, { n: "MANILA", off: 8, w: 268, x: 0.789, y: 0.505 }, { n: "LAGOS", off: 1, w: 197, x: 0.5, y: 0.555 },
      { n: "NAIROBI", off: 3, w: 121, x: 0.566, y: 0.6 }, { n: "LONDON", off: 0, w: 86, x: 0.49, y: 0.31 },
    ];
    P.forEach((c, k) => { const r = rnd(31 + k); c.dots = Array.from({ length: Math.ceil(c.w / 3) }, () => { const a = r() * 6.28, d = Math.sqrt(-2 * Math.log(r() + 1e-6)) * 0.35; return { a, d, s: r() }; }); c.c = 0; });
    let last = 0;
    const s = stage(el, (g, W, H, t) => {
      if (bg.complete && bg.naturalWidth) g.drawImage(bg, 0, 0, W, H);
      const dt = Math.min(0.1, t - last); last = t;
      const u = wrap24(t * 1.6), R = W * 0.03;
      let tot = 0;
      P.forEach((c) => {
        const target = c.w * act(u + c.off); c.c += (target - c.c) * Math.min(1, dt * 2); tot += c.c;
        const x = c.x * W, y = c.y * H, n = Math.round((c.c / c.w) * c.dots.length);
        // 원 크기 = 지금 접속 수
        const rr = R * 0.35 + R * 0.9 * Math.sqrt(c.c / 412);
        g.strokeStyle = C.mix(0.85); g.lineWidth = 0.8; g.beginPath(); g.arc(x, y, rr, 0, Math.PI * 2); g.stroke();
        g.setLineDash([2, 2]); g.strokeStyle = C.mix(0.4); g.beginPath(); g.arc(x, y, rr * (1.25 + 0.1 * Math.sin(t * 3)), 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
        c.dots.forEach((d, i) => {
          if (i >= n) return;
          const jitter = Math.sin(t * 2 + d.s * 40) * 0.08;
          const px = x + Math.cos(d.a + jitter) * d.d * R * 1.6, py = y + Math.sin(d.a + jitter) * d.d * R * 1.6;
          g.fillStyle = C.mix(0.35 + d.s * 0.5); g.beginPath(); g.arc(px, py, 1.3, 0, Math.PI * 2); g.fill();
        });
        g.font = font(C.xs, 600); g.fillStyle = C.mix(0.95); g.textAlign = "left"; g.textBaseline = "middle";
        g.fillText(`LIVE ${Math.round(c.c)}`, x + rr + 4, y - rr - 2);
      });
      // 도시 사이 만남: 깨어 있는 도시끼리 호를 그리며 아바타가 오가요 (핀 #27)
      const on = P.filter((c) => c.c > c.w * 0.25);
      on.forEach((a, i) => on.slice(i + 1).forEach((b, j) => {
        const ax = a.x * W, ay = a.y * H, bx = b.x * W, by = b.y * H, mx = (ax + bx) / 2, my = Math.min(ay, by) - Math.hypot(bx - ax, by - ay) * 0.28, k = Math.min(a.c / a.w, b.c / b.w);
        g.strokeStyle = C.red(0.18 + 0.4 * k); g.lineWidth = 0.8; g.beginPath(); g.moveTo(ax, ay); g.quadraticCurveTo(mx, my, bx, by); g.stroke();
        for (let q = 0; q < 3; q++) { const f = (t * 0.45 + q / 3 + (i + j) * 0.21) % 1, dir = (q % 2 ? f : 1 - f), x = (1 - dir) * (1 - dir) * ax + 2 * (1 - dir) * dir * mx + dir * dir * bx, y = (1 - dir) * (1 - dir) * ay + 2 * (1 - dir) * dir * my + dir * dir * by;
          g.fillStyle = C.red(Math.sin(f * Math.PI)); g.beginPath(); g.arc(x, y, 2.2, 0, Math.PI * 2); g.fill(); }
      }));
      // 접속 파동: 도시마다 접속이 늘 때 퍼지는 원
      P.forEach((c, k) => { const ph = (t * 0.7 + k * 0.37) % 1, rr = R * (0.4 + 2.2 * ph); g.strokeStyle = C.red((1 - ph) * 0.5 * (c.c / c.w)); g.lineWidth = 1; g.beginPath(); g.arc(c.x * W, c.y * H, rr, 0, Math.PI * 2); g.stroke(); });
      // 새로 들어오는 아바타: 판 바깥에서 자기 도시로 날아와 앉아요
      P.forEach((c, k) => { for (let q = 0; q < 2; q++) { const f = (t * 0.6 + q * 0.5 + k * 0.29) % 1; if (c.c < c.w * 0.2) continue; const sx = c.x * W + (k % 2 ? 1 : -1) * W * 0.12, sy = -H * 0.05, e = 1 - Math.pow(1 - f, 3), x = sx + (c.x * W - sx) * e, y = sy + (c.y * H - sy) * e; g.fillStyle = C.mix(0.9, Math.sin(f * Math.PI) * 0.9); g.beginPath(); g.arc(x, y, 1.8, 0, Math.PI * 2); g.fill(); } });
      // SYNC: 현장 ↔ 트윈 0.2 s 마다 오가는 점
      [0.279, 0.53, 0.779].forEach((yy, k) => {
        for (let q = 0; q < 3; q++) {
          const f = (t * 1.6 + q / 3 + k * 0.17) % 1, dir = (q + k) % 2 ? 1 : -1, x0 = 0.4, x1 = 0.444;
          const x = (dir > 0 ? x0 + (x1 - x0) * f : x1 - (x1 - x0) * f) * W;
          g.fillStyle = C.mix(0.9, Math.sin(f * Math.PI)); g.beginPath(); g.arc(x, yy * H, 2, 0, Math.PI * 2); g.fill();
        }
      });
      // 읽기 값 (오른쪽 위)
      g.textAlign = "right"; g.textBaseline = "alphabetic";
      g.font = font(C.s, 600); g.fillStyle = C.mix(0.95); g.fillText(`UTC ${hhmm(u)}`, W * 0.975, H * 0.045);
      g.font = font(C.xs); g.fillStyle = C.mix(0.55); g.fillText(`트윈 접속 ${Math.round(tot).toLocaleString()}명 · SYNC 0.2 s`, W * 0.975, H * 0.045 + C.xs * 1.6);
    });
    bg.onload = s.kick;
  };

  // ── 발자국: 다른 시간대의 만남 (핀 #404) ──
  const steps = (el) => {
    const CT = [
      { n: "서울", en: "SEOUL UTC+9", off: 9, visit: 23, svc: 2, path: [[0.12, 0.9], [0.3, 0.6], [0.52, 0.38]], tone: 0.8 },
      { n: "런던", en: "LONDON UTC+0", off: 0, visit: 10, svc: 11, path: [[0.9, 0.92], [0.72, 0.68], [0.66, 0.4]], tone: 0.6 },
      { n: "뉴욕", en: "NEW YORK UTC-5", off: -5, visit: 17, svc: 16, path: [[0.14, 0.08], [0.45, 0.2], [0.8, 0.24]], tone: 0.4 },
    ];
    const along = (pts, f) => { const seg = pts.length - 1, k = Math.min(seg - 1, Math.floor(f * seg)), q = f * seg - k, a = pts[k], b = pts[k + 1]; return [a[0] + (b[0] - a[0]) * q, a[1] + (b[1] - a[1]) * q, Math.atan2(b[1] - a[1], b[0] - a[0])]; };
    let scrub = null;
    stage(el, (g, W, H, t, hv) => {
      const S = Math.min(H * 0.78, W * 0.26), px = W * 0.02, py = (H - S) / 2 - C.xs * 0.6;
      const x0 = W * 0.38, x1 = W * 0.975, X = (u) => x0 + ((x1 - x0) * u) / 24, top = H * 0.2, rowH = (H * 0.66) / 3;
      scrub = hv && hv.x > x0 && hv.x < x1 ? ((hv.x - x0) / (x1 - x0)) * 24 : null;
      const u = scrub != null ? scrub : wrap24(t * 1.1);
      // 모듈 바닥 3 × 3 m
      g.strokeStyle = C.mix(0.85); g.lineWidth = 1; g.strokeRect(px, py, S, S);
      g.fillStyle = C.mix(0.05); g.fillRect(px + S * 0.04, py + S * 0.04, S * 0.92, S * 0.92);
      g.strokeStyle = C.mix(0.18); g.lineWidth = 0.6; [1 / 3, 2 / 3].forEach((f) => { g.beginPath(); g.moveTo(px + S * f, py + S * 0.04); g.lineTo(px + S * f, py + S * 0.96); g.stroke(); });
      g.font = font(C.xs); g.fillStyle = C.mix(0.6); g.textAlign = "center"; g.fillText("모듈 바닥 평면 · 3 × 3 m", px + S / 2, py + S + C.xs * 1.8);
      // 시간 축
      g.textAlign = "center"; g.textBaseline = "alphabetic";
      for (let k = 0; k <= 24; k += 3) { g.strokeStyle = C.mix(0.1); g.lineWidth = 0.6; g.beginPath(); g.moveTo(X(k), top - 4); g.lineTo(X(k), top + rowH * 3); g.stroke(); g.font = font(C.xs, k % 6 ? 400 : 600); g.fillStyle = C.mix(0.6); g.fillText(k === 0 ? "UTC 00" : String(k).padStart(2, "0"), X(k), top - 10); }
      const vis = [];
      CT.forEach((c, i) => {
        const y = top + rowH * i + rowH * 0.3, bh = rowH * 0.36;
        g.textAlign = "right"; g.font = font(C.s, 600); g.fillStyle = C.mix(0.95); g.fillText(c.n, x0 - 12, y + bh * 0.45);
        g.font = font(C.xs); g.fillStyle = C.mix(0.5); g.fillText(c.en, x0 - 12, y + bh * 0.45 + C.xs * 1.5);
        const band = (a, len, fill) => { const s0 = wrap24(a); if (s0 + len <= 24) { g.fillStyle = fill; g.fillRect(X(s0), y, X(s0 + len) - X(s0), bh); } else { band(s0, 24 - s0, fill); band(0, len - (24 - s0), fill); } };
        band(6 - c.off, 17, C.mix(0.07)); // 깨어 있는 시간 (현지 06~23시)
        // 방문과 발자국 잔상 (10시간에 걸쳐 옅어짐)
        for (let k = 0; k < 40; k++) band(c.visit + k * 0.25, 0.26, C.mix(c.tone * 0.35 * (1 - k / 40)));
        const age = wrap24(u - c.visit);
        if (age < 10) for (let k = 0; k < age * 4; k++) band(c.visit + k * 0.25, 0.26, C.mix(c.tone * (1 - k / 40)));
        g.fillStyle = C.mix(0.9); g.fillRect(X(c.visit) - 0.75, y - 3, 1.5, bh + 6);
        // 현지 11시 예배
        const sx = X(wrap24(c.svc)), inS = wrap24(u - c.svc) < 1;
        g.beginPath(); g.arc(sx, y + bh / 2, inS ? 5 : 4, 0, Math.PI * 2); g.fillStyle = inS ? C.mix(0.95) : C.bg; g.fill(); g.strokeStyle = C.mix(0.8); g.lineWidth = 1; g.stroke();
        // 바닥 위 발자국
        if (age < 10) {
          vis.push(c.n);
          const N = 12, shown = Math.min(N, Math.floor((age / 0.8) * N) + 1), o = 1 - age / 10;
          for (let k = 0; k < shown; k++) {
            const [fx, fy, a] = along(c.path, k / (N - 1)), side = k % 2 ? 1 : -1;
            const nx = -Math.sin(a) * side * 0.022, ny = Math.cos(a) * side * 0.022;
            g.save(); g.translate(px + S * (0.04 + 0.92 * (fx + nx)), py + S * (0.04 + 0.92 * (fy + ny))); g.rotate(a);
            g.fillStyle = C.red(Math.max(0.25, o)); g.beginPath(); g.ellipse(0, 0, S * 0.026, S * 0.011, 0, 0, Math.PI * 2); g.fill(); g.restore(); // 핀 #24: 다크 모드에서도 보이게 빨강
          }
          const [lx, ly] = c.path[0]; g.font = font(C.xs, 600); g.fillStyle = C.mix(0.95, Math.max(0.35, o)); g.textAlign = "left";
          g.fillText(c.n, px + S * (0.04 + 0.92 * lx) + 4, py + S * (0.04 + 0.92 * ly) + (ly > 0.5 ? -6 : 12));
        }
      });
      // 지금 시각
      g.strokeStyle = C.mix(0.95); g.lineWidth = 1; g.beginPath(); g.moveTo(X(u), top - 4); g.lineTo(X(u), top + rowH * 3 - 4); g.stroke();
      g.textAlign = "center"; g.font = font(C.xs, 600); g.fillStyle = C.mix(0.95); g.fillText(`UTC ${hhmm(u)}`, X(u), top + rowH * 3 + C.xs);
      g.textAlign = "left"; g.font = font(C.xs); g.fillStyle = C.mix(0.6);
      g.fillText(vis.length > 1 ? `${vis.join(" · ")} — 서로 다른 시간에 같은 방에서 만나는 중` : vis.length ? `${vis[0]}의 발자국만 남아 있어요` : "", px, H - 4);
    }, { hover: true });
  };

  // ── 3D 모델: 정면 입면(cross) / 다섯 레이어(layers) (핀 #403, #405) ──
  const LAYERS = [
    { n: "출입/전도 공간", en: "Entry / Mission", k: [0, 8], N: 800, el: "EL +0 – +24" },
    { n: "유희/전이 공간", en: "Play / Transition", k: [8, 15], N: 700, el: "EL +24 – +45" },
    { n: "교육 공간", en: "Education", k: [15, 62], N: 4648, el: "EL +45 – +186" },
    { n: "만남/소통 공간", en: "Meeting / Communion", k: [62, 76], N: 6607, el: "EL +186 – +228", arm: true },
    { n: "성전/예배당", en: "Sanctuary / Worship", k: [76, 99], N: 2182, el: "EL +228 – +297" },
  ];
  let MODEL = null, LAND = null;
  const MAP_SRC = "assets/img/metaverse-church/cross-worldmap.jpg", MAP_BOX = [58, 437, 1672, 1196]; // 원본 1800×2571 기준 지도 영역
  const landMask = () => LAND || (LAND = new Promise((res) => {
    const im = new Image(); im.onerror = () => res(null);
    im.onload = () => {
      const [x0, y0, x1, y1] = MAP_BOX, k = im.naturalWidth / 1800, CW = 151, CH = 73, c = document.createElement("canvas"); c.width = CW * 4; c.height = CH * 4;
      const g = c.getContext("2d"); g.fillStyle = "#fff"; g.fillRect(0, 0, c.width, c.height); g.drawImage(im, x0 * k, y0 * k, (x1 - x0) * k, (y1 - y0) * k, 0, 0, c.width, c.height);
      const d = g.getImageData(0, 0, c.width, c.height).data, m = [];
      for (let row = 0; row < CH; row++) for (let col = 0; col < CW; col++) { let dark = 0; for (let yy = 0; yy < 4; yy++) for (let xx = 0; xx < 4; xx++) { const i = ((row * 4 + yy) * c.width + col * 4 + xx) * 4; dark += 255 - (d[i] + d[i + 1] + d[i + 2]) / 3; } m.push(dark / 16 / 255); }
      res({ CW, CH, m });
    };
    im.src = MAP_SRC;
  }));
  const model = (land) => {
    if (MODEL) return MODEL;
    const r = rnd(7), ph = Array.from({ length: 8 }, () => r() * 6.28);
    const val = (x, y, z) => Math.sin(x * 0.55 + ph[0]) * Math.sin(z * 0.23 + ph[1]) + 0.8 * Math.sin(y * 0.37 + ph[2]) * Math.sin(x * 0.29 + z * 0.15 + ph[3]) + 0.6 * Math.sin(z * 0.09 + y * 0.2 + ph[4]) - 1.6 * Math.max(0, Math.abs(z - 75) - 55) / 20 + 1.25 * r();
    MODEL = LAYERS.map((L) => {
      if (L.arm && land) {
        const out = [], { CW, CH, m } = land;
        for (let row = 0; row < CH; row++) for (let col = 0; col < CW; col++) { const v = m[row * CW + col]; if (v < 0.09) continue; const lv = Math.min(L.k[1] - L.k[0], 1 + Math.round(v * 9)); for (let q = 0; q < lv; q++) out.push([(row - 36) * 3, (L.k[0] + q) * 3, -226.5 + col * 3]); }
        L.N = out.length; return out;
      }
      const ix0 = L.arm ? -36 : -5, ix1 = L.arm ? 36 : 4, cand = [];
      for (let k = L.k[0]; k < L.k[1]; k++) for (let iz = 0; iz < 151; iz++) for (let ix = ix0; ix <= ix1; ix++) {
        let v = val(ix, k, iz);
        if (L.arm) v += 0.9 * (1 - Math.abs(ix) / 37) - 0.4 * Math.abs(iz - 75) / 75; // 가로대는 가운데가 촘촘하게
        if (L.k[0] < 15) v -= 0.012 * iz; // 아래 두 층은 진입 쪽(앞)에 모여요
        cand.push([v, ix, k, iz]);
      }
      cand.sort((a, b) => b[0] - a[0]);
      return cand.slice(0, L.N).map(([, ix, k, iz]) => [ix * 3, k * 3, -226.5 + iz * 3]);
    });
    return MODEL;
  };
  const three = (el, mode) => { landMask().then((land) => three0(el, mode, land)); };
  const three0 = (el, mode, land) => {
    const T = window.THREE; if (!T) { el.textContent = ""; return; }
    let ren; try { ren = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true }); } catch (e) { return; }
    const M = model(land), prog = mode === "prog", elev = mode === "cross" || prog;
    el.insertAdjacentHTML("beforeend", `<div class="mv-ui"></div><div class="mv-lb"></div>`);
    el.prepend(ren.domElement); ren.domElement.className = "mv-cv";
    const ui = el.querySelector(".mv-ui"), lb = el.querySelector(".mv-lb");
    const scene = new T.Scene(), cam = new T.OrthographicCamera(-1, 1, 1, -1, -5000, 5000);
    const amb = new T.AmbientLight(0xffffff, 0.7), sun = new T.DirectionalLight(0xffffff, 0.45); sun.position.set(-0.6, 1, -0.8); scene.add(amb, sun);
    const box = new T.BoxGeometry(2.9, 2.9, 2.9); box.translate(1.5, 1.5, 1.5);
    const eg = new T.EdgesGeometry(box).attributes.position.array, M4 = new T.Matrix4();
    const groups = M.map((mods, li) => {
      const grp = new T.Group(), mat = new T.MeshLambertMaterial({ color: 0xffffff, transparent: true }), lm = new T.LineBasicMaterial({ transparent: true });
      const im = new T.InstancedMesh(box, mat, mods.length); mods.forEach(([x, y, z], k) => { M4.makeTranslation(x, y, z); im.setMatrixAt(k, M4); });
      const v = new Float32Array(mods.length * eg.length); mods.forEach(([x, y, z], k) => { for (let q = 0; q < eg.length; q += 3) { v[k * eg.length + q] = x + eg[q]; v[k * eg.length + q + 1] = y + eg[q + 1]; v[k * eg.length + q + 2] = z + eg[q + 2]; } });
      const lg = new T.BufferGeometry(); lg.setAttribute("position", new T.BufferAttribute(v, 3));
      const ln = new T.LineSegments(lg, lm); im.frustumCulled = ln.frustumCulled = false; grp.add(im, ln); scene.add(grp);
      return { grp, mat, lm, lg, li, a: 1, aT: 1, off: 0 };
    });
    // 수면과 둑길, 수면 아래 트윈 (정면 입면 모드)
    const water = new T.Mesh(new T.PlaneGeometry(4000, 4000), new T.MeshBasicMaterial({ transparent: true, opacity: 0.75, depthWrite: false }));
    water.rotation.x = -Math.PI / 2; water.position.y = -0.2; scene.add(water);
    const cw = new T.Mesh(new T.BoxGeometry(40, 1, 1400), new T.MeshLambertMaterial({ color: 0xffffff })); cw.position.set(0, -0.5, -500); scene.add(cw);
    const twin = new T.Group(); twin.scale.y = -1; twin.visible = elev && !prog;
    const tm = new T.LineBasicMaterial({ transparent: true, opacity: 0.1, depthWrite: false });
    groups.forEach((G) => { const t = new T.LineSegments(G.lg, tm); t.frustumCulled = false; twin.add(t); }); scene.add(twin);
    const paint = () => {
      scene.background = new T.Color(C.hex(0)); const dark = root.dataset.mode === "dark";
      groups.forEach((G) => { G.mat.color.setHex(C.hex(dark ? 0.12 : 0.0)); G.lm.color.setHex(C.hex(dark ? 0.55 : 0.48)); });
      water.material.color.setHex(C.hex(0.035)); cw.material.color.setHex(C.hex(dark ? 0.1 : 0.02)); tm.color.setHex(C.hex(0.6));
      amb.intensity = dark ? 0.9 : 0.7; kick();
    };
    // 카메라: az(돌림), el(내려다봄), 보이는 높이 fh, 바라보는 높이 ty
    const V = elev
      ? { front: [0, 0, 700, 0], side: [Math.PI / 2, 0, 700, 0], back: [Math.PI, 0, 700, 0], axo: [-0.62, 0.42, 760, 60], top: [Math.PI / 2, 1.45, 700, 0], map: [Math.PI / 2, 1.5, 700, 0] }
      : { axo: [-0.95, 0.42, 620, 200], front: [0, 0.02, 560, 200], side: [Math.PI / 2, 0.02, 600, 200], top: [-0.95, 1.35, 700, 0] };
    const cur = { az: 0, el: 0, fh: 700, ty: 0 }, goal = { ...cur };
    const go = (k) => { mapV = k === "map"; if (mapV && twin.visible) { twin.visible = false; const tb = ui.querySelector("[data-t]"); if (tb) tb.classList.remove("on"); } const [az, e, fh, ty] = V[k]; const d = ((az - goal.az + Math.PI) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2) - Math.PI; Object.assign(goal, { az: goal.az + d, el: e, fh, ty }); sel(k); kick(); };
    const btn = (k, label) => `<button type="button" data-v="${k}">${label}</button>`;
    ui.innerHTML = elev
      ? (prog ? "" : `${btn("front", "정면 Front")}${btn("side", "측면 Side")}${btn("back", "배면 Back")}${btn("axo", "아이소 Axo")}${btn("top", "위 Top")}${btn("map", "세계지도 World map")}<span class="sep"></span><button type="button" data-t class="on">트윈 Twin</button>`)
      : `${btn("axo", "아이소 Axo")}${btn("front", "정면 Front")}${btn("side", "측면 Side")}${btn("top", "위 Top")}<span class="sep"></span><button type="button" data-x class="on">30 m 띄우기</button>`;
    const sel = (k) => ui.querySelectorAll("[data-v]").forEach((b) => b.classList.toggle("on", b.dataset.v === k));
    ui.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      if (b.dataset.v) go(b.dataset.v);
      if (b.hasAttribute("data-t")) { twin.visible = !twin.visible; b.classList.toggle("on", twin.visible); kick(); }
      if (b.hasAttribute("data-x")) { exp = exp ? 0 : 1; b.classList.toggle("on", !!exp); kick(); }
    });
    let exp = elev ? 0 : 1, expC = exp, spin = !elev && !reduce, idle = 0, mapV = false, progT = 0, progI = -1;
    // 레이어 이름표 (레이어 모드) / 높이 표시 (입면 모드)
    const labels = prog
      ? LAYERS.map((L, i) => ({ y: ((L.k[0] + L.k[1]) / 2) * 3, t: `<b>${i + 1}</b> ${L.n} <em>${L.en}</em><i>${L.el} · 모듈 ${L.N.toLocaleString()}개</i>`, li: i }))
      : elev
      ? [[297, "+297"], [228, "+228"], [186, "+186"], [45, "+45"], [24, "+24"], [0, "±0 수면"], [-150, "DIGITAL TWIN 1:1"]].map(([y, t]) => ({ y, t, li: -1 }))
      : LAYERS.map((L, i) => ({ y: 0, t: `<b>${i + 1}</b> ${L.n}<i>${L.el} · 모듈 ${L.N.toLocaleString()}개</i>`, li: i }));
    lb.innerHTML = labels.map((l, i) => `<span data-i="${i}"${l.li >= 0 ? ` data-li="${l.li}"` : ""}>${l.t}</span>`).join("");
    const spans = [...lb.children]; if (prog) el.classList.add("mv-prog");
    let focus = -1;
    lb.addEventListener("pointerover", (e) => { const s = e.target.closest("[data-li]"); focus = s ? +s.dataset.li : -1; kick(); });
    lb.addEventListener("pointerleave", () => { focus = -1; kick(); });
    // 끌어서 돌리기
    let drag = null;
    ren.domElement.addEventListener("pointerdown", (e) => { drag = { x: e.clientX, y: e.clientY }; spin = false; ren.domElement.setPointerCapture(e.pointerId); });
    ren.domElement.addEventListener("pointermove", (e) => {
      if (!drag) return;
      goal.az -= (e.clientX - drag.x) * 0.008; goal.el = Math.max(elev ? -0.7 : -0.1, Math.min(1.45, goal.el + (e.clientY - drag.y) * 0.005));
      drag = { x: e.clientX, y: e.clientY }; sel(""); idle = performance.now(); kick();
    });
    ren.domElement.addEventListener("pointerup", () => { drag = null; idle = performance.now(); });
    let W = 0, H = 0, raf = 0, live = false, last = performance.now();
    const size = () => { W = el.clientWidth; H = el.clientHeight; if (!W || !H) return; ren.setPixelRatio(Math.min(2, devicePixelRatio || 1)); ren.setSize(W, H, false); kick(); };
    const P = new T.Vector3();
    const frame = (now) => {
      raf = 0; if (!W) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (!elev && !drag && !spin && now - idle > 4000 && !reduce) spin = true;
      let hold = false;
      if (prog && !reduce) { progT += dt; const i = Math.floor(progT / 2.6) % LAYERS.length; if (i !== progI) progI = i; hold = true; }
      const fo = mapV ? 3 : prog ? (focus >= 0 ? focus : progI) : focus;
      if (spin) goal.az += dt * 0.18;
      let moving = spin;
      for (const k of ["az", "el", "fh", "ty"]) { const d = goal[k] - cur[k]; cur[k] += d * (reduce ? 1 : 0.09); if (Math.abs(d) > 1e-3) moving = true; }
      expC += (exp - expC) * (reduce ? 1 : 0.08); if (Math.abs(exp - expC) > 1e-3) moving = true;
      groups.forEach((G) => {
        G.grp.position.y = G.li * 30 * expC;
        G.aT = fo < 0 || fo === G.li ? 1 : prog ? 0.14 : 0.06; G.a += (G.aT - G.a) * 0.15; if (Math.abs(G.aT - G.a) > 0.01) moving = true;
        G.mat.opacity = G.a; G.lm.opacity = G.a * 0.5; G.mat.depthWrite = G.a > 0.5;
      });
      water.visible = cw.visible = cur.el > -0.02 || elev;
      // 보는 각도에 맞춰 모델 전체(트윈 포함)가 틀 안에 들어오게 자동으로 맞춰요
      const asp = W / H, ca = Math.cos(cur.az), sa = Math.sin(cur.az), ce = Math.cos(cur.el), se = Math.sin(cur.el);
      const fw = [-sa * ce, -se, ca * ce], rt = [ca, 0, sa], up = [-sa * se, ce, ca * se]; // 오른쪽·위 방향
      const y1 = 297 + (elev ? 0 : 4 * 30 * expC), y0 = elev && twin.visible ? -297 : 0;
      let r0 = 1e9, r1 = -1e9, u0 = 1e9, u1 = -1e9;
      for (const x of [-110, 110]) for (const y of [y0, y1]) for (const z of [-227, 227]) { const a = x * rt[0] + z * rt[2], b = x * up[0] + y * up[1] + z * up[2]; r0 = Math.min(r0, a); r1 = Math.max(r1, a); u0 = Math.min(u0, b); u1 = Math.max(u1, b); }
      let fh = Math.max(u1 - u0, (r1 - r0) / asp) * 1.1, cr = (r0 + r1) / 2; const cu = (u0 + u1) / 2;
      if (prog) { fh = Math.max(u1 - u0, (r1 - r0) / (asp * 0.56)) * 1.12; cr -= fh * asp * 0.2; } // 십자가는 왼쪽, 이름표는 오른쪽
      cam.left = (-fh * asp) / 2; cam.right = (fh * asp) / 2; cam.top = fh / 2; cam.bottom = -fh / 2; cam.updateProjectionMatrix();
      const tx = cr * rt[0] + cu * up[0], ty = cu * up[1], tz = cr * rt[2] + cu * up[2];
      cam.position.set(tx - fw[0] * 1500, ty - fw[1] * 1500, tz - fw[2] * 1500);
      cam.lookAt(tx, ty, tz);
      ren.render(scene, cam);
      // 이름표 위치
      labels.forEach((l, i) => {
        const s = spans[i];
        if (prog) { P.set(0, l.y, 0).project(cam); s.style.transform = `translate(0, ${((1 - P.y) / 2) * H}px) translateY(-50%)`; s.classList.toggle("on", fo === l.li); return; }
        if (elev) { P.set(0, l.y, 0).project(cam); s.style.transform = `translate(0, ${((1 - P.y) / 2) * H}px) translateY(-50%)`; s.style.opacity = (l.y < 0 && !twin.visible) || mapV || cur.el > 1 ? 0 : 1; return; }
        const L = LAYERS[l.li]; P.set(0, ((L.k[0] + L.k[1]) / 2) * 3 + l.li * 30 * expC, 0).project(cam);
        s.style.transform = `translate(0, ${((1 - P.y) / 2) * H}px) translateY(-50%)`; s.classList.toggle("on", focus === l.li);
      });
      if ((moving || hold) && live) raf = requestAnimationFrame(frame);
    };
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    new ResizeObserver(size).observe(el);
    new IntersectionObserver(([e]) => { live = e.isIntersecting; if (live) { last = performance.now(); kick(); } }).observe(el);
    themed.push(paint); paint();
    const k0 = elev ? "front" : "axo"; Object.assign(cur, { az: V[k0][0] + (elev ? 0 : -1.2), el: V[k0][1], fh: V[k0][2] * (elev ? 1 : 1.15), ty: V[k0][3] }); go(k0);
  };


  // ── 네 입면 펼침도: 화살표가 왼쪽에서 오른쪽으로 흐르며 지나간 자리에 나무가 심어져요 (Tim(team) Work, 핀 #189·#413) ──
  // 좌표는 그림(1210 기준) 위의 두 흐름선. 바탕 입면은 옅게 깔리고, 머리가 지나간 곳부터 원 모양으로 '심어지듯' 진하게 드러나요.
  const plant = (el) => {
    const bg = new Image(); bg.src = el.dataset.bg;
    const PATHS = [
      [[80, 318], [130, 290], [165, 245], [210, 210], [265, 193], [320, 200], [370, 220], [410, 248], [450, 272], [490, 300], [530, 322], [580, 335], [620, 333], [660, 312], [690, 285], [720, 262], [760, 240], [800, 235], [850, 232], [890, 230], [930, 212], [960, 190], [985, 160], [1010, 128]],
      [[80, 522], [140, 540], [200, 550], [270, 552], [340, 548], [390, 535], [430, 510], [470, 480], [510, 453], [560, 440], [610, 438], [650, 432], [700, 415], [740, 390], [770, 370], [800, 348], [850, 345], [890, 342], [930, 320], [960, 290], [1000, 270], [1050, 265], [1100, 265], [1150, 268]],
    ];
    // 흐름선을 촘촘한 점으로 (x 순서대로)
    const SAMP = PATHS.map((P) => { const o = []; for (let k = 0; k < P.length - 1; k++) { const [a, b] = [P[k], P[k + 1]], n = Math.ceil(Math.hypot(b[0] - a[0], b[1] - a[1]) / 6); for (let i = 0; i < n; i++) o.push([a[0] + ((b[0] - a[0]) * i) / n, a[1] + ((b[1] - a[1]) * i) / n]); } o.push(P[P.length - 1]); return o; });
    const X0 = 80, X1 = 1150, RUN = 6.2, LOOP = 12.5, POP = 0.7;
    // 핀 #60: 흐름이 지나가면 그 자리에 나무가 하나씩 '자라나요' — 줄기가 올라오고 수관이 톡 열려요
    const TREES = []; { let s = 7; const rr = () => ((s = (s * 16807) % 2147483647) / 2147483647); SAMP.forEach((S) => { let acc = 0; for (let i = 1; i < S.length; i++) { acc += Math.hypot(S[i][0] - S[i - 1][0], S[i][1] - S[i - 1][1]); if (acc >= 30 + rr() * 16 && S[i][0] > 100 && S[i][0] < 1110 && S[i][1] > 175) { acc = 0; TREES.push({ x: S[i][0] + (rr() - 0.5) * 10, y: S[i][1] - 6, s: 0.75 + rr() * 0.6, k: rr() < 0.5 }); } } }); }
    const tree = (g, P, u, tr, a, ink, fill) => {
      if (a <= 0) return; const [bx, by] = P(tr.x, tr.y), h = 26 * tr.s * u, grow = Math.min(1, a / 0.45), cr = 11 * tr.s * u * pop(Math.max(0, (a - 0.3) / 0.7));
      g.strokeStyle = ink; g.lineWidth = Math.max(0.8, 1.2 * u); g.beginPath(); g.moveTo(bx, by); g.lineTo(bx, by - h * grow); g.stroke();
      if (cr <= 0) return; const cy = by - h * 0.95;
      g.fillStyle = "rgba(0,0,0,.08)"; g.beginPath(); g.ellipse(bx + cr * 0.5, by, cr * 0.9, cr * 0.22, 0, 0, 6.2832); g.fill(); // 발밑 그림자
      g.fillStyle = fill; g.beginPath(); if (tr.k) { g.arc(bx, cy, cr, 0, 6.2832); } else { g.arc(bx - cr * 0.45, cy + cr * 0.15, cr * 0.75, 0, 6.2832); g.arc(bx + cr * 0.45, cy + cr * 0.1, cr * 0.8, 0, 6.2832); g.arc(bx, cy - cr * 0.4, cr * 0.8, 0, 6.2832); } g.fill(); g.stroke();
    };
    const off = document.createElement("canvas"), og = off.getContext("2d");
    const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));
    const pop = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 + 2.2 * Math.pow(x - 1, 3) + 1.2 * Math.pow(x - 1, 2)); // 살짝 넘쳤다 돌아오는 '심김'
    let T0 = null; // 처음 화면에 들어온 때부터 흐름이 시작돼요
    stage(el, (g, W, H, t) => {
      if (!(bg.complete && bg.naturalWidth)) return;
      if (T0 === null) T0 = t; t -= T0;
      const iw = bg.naturalWidth, ih = bg.naturalHeight, sc = Math.min(W / iw, H / ih), dw = iw * sc, dh = ih * sc, ox = (W - dw) / 2, oy = (H - dh) / 2;
      const u = dw / 1210, P = (x, y) => [ox + x * u, oy + y * (dh / (ih * 1210 / iw))];
      const dark = root.dataset.mode === "dark", FULL = dark ? 0.85 : 0.72;
      const tt = reduce ? RUN + 3 : t % LOOP, head = X0 + (X1 - X0) * Math.min(1, tt / RUN);
      const settle = ease((tt - RUN) / 1.4), out = reduce ? 0 : ease((tt - (LOOP - 1.1)) / 1.0);
      g.save(); if (dark) g.filter = "invert(.92) hue-rotate(180deg)";
      // 1) 옅은 바탕 입면 (끝나면 전체가 진해져요)
      g.globalAlpha = FULL * (0.18 + 0.82 * settle * (1 - out)); g.drawImage(bg, ox, oy, dw, dh);
      // 2) 글자·층 표시·방위는 처음부터 또렷하게
      g.globalAlpha = FULL; g.save(); g.beginPath();
      [[0, 0, 1210, 136], [0, 625, 1210, 100], [0, 0, 92, 720], [1130, 0, 90, 720]].forEach(([x, y, w, h]) => { const [a, b] = P(x, y); g.rect(a, b, w * u, h * u); });
      g.clip(); g.drawImage(bg, ox, oy, dw, dh); g.restore();
      // 3) 흐름이 지나간 자리: 원이 톡 커지며 나무·화분이 진하게 드러나요
      if (settle < 1 || out > 0) {
        off.width = Math.ceil(W); off.height = Math.ceil(H); og.clearRect(0, 0, W, H);
        og.drawImage(bg, ox, oy, dw, dh); og.globalCompositeOperation = "destination-in"; og.fillStyle = "#000"; og.beginPath();
        SAMP.forEach((S) => S.forEach(([x, y], i) => { if (i % 2) return; const age = (tt - ((x - X0) / (X1 - X0)) * RUN) / POP; if (age <= 0) return; const r = 50 * u * pop(age); const [a, b] = P(x, y - 16); og.moveTo(a + r, b); og.arc(a, b, r, 0, 6.2832); }));
        og.fill(); og.globalCompositeOperation = "source-over";
        g.globalAlpha = FULL * (1 - out); g.drawImage(off, 0, 0, W, H);
      }
      g.restore();
      // 3-1) 자라나는 나무 (흐름이 끝나고 그림이 다 드러나면 천천히 옅어져 원본 나무에 겹쳐요)
      { const ink = C.mix(0.8, 0.9 * (1 - out) * (1 - 0.55 * settle)), fill = dark ? "rgba(20,20,20,.75)" : "rgba(255,255,255,.82)"; g.save(); g.globalAlpha = 1 - out;
        TREES.forEach((tr) => tree(g, P, u, tr, (tt - ((tr.x - X0) / (X1 - X0)) * RUN - 0.15) / 0.9, ink, fill)); g.restore(); }
      // 4) 흐름의 머리: 진한 점과 짧은 꼬리
      if (!reduce && tt < RUN + 0.4) {
        const fade = 1 - ease((tt - RUN) / 0.4);
        SAMP.forEach((S) => {
          let k = S.findIndex(([x]) => x > head); if (k < 0) k = S.length - 1; if (k === 0) return;
          g.strokeStyle = C.mix(0.9, 0.55 * fade); g.lineWidth = 1.4; g.beginPath();
          for (let i = Math.max(0, k - 14); i <= k; i++) { const [a, b] = P(...S[i]); i === Math.max(0, k - 14) ? g.moveTo(a, b) : g.lineTo(a, b); }
          g.stroke(); const [a, b] = P(...S[k]), [pa, pb] = P(...S[Math.max(0, k - 3)]), an = Math.atan2(b - pb, a - pa);
          g.fillStyle = C.mix(0.95, fade); g.save(); g.translate(a, b); g.rotate(an); g.beginPath(); g.moveTo(7, 0); g.lineTo(-5, -5); g.lineTo(-2, 0); g.lineTo(-5, 5); g.closePath(); g.fill(); g.restore(); // 화살촉
          g.strokeStyle = C.mix(0.95, 0.35 * fade); g.lineWidth = 1; g.beginPath(); g.arc(a, b, 7 + 3 * Math.sin(t * 6), 0, 6.2832); g.stroke();
        });
      }
    });
  };


  // ── 연무장길 횡단 (Motorism, 핀 #334·#420): 원본 다이어그램을 벡터로 다시 그려 옆으로 끝없이 이어 붙여요.
  // 서쪽에서 사람들이 팝업 밀도를 따라 걸어오다 성수이로를 지나 '문턱'에서 흩어지고, 대지(SITE)에는 동쪽에서 차가 들어와요.
  // 띠는 천천히 흐르고, 페이지를 스크롤하면 그만큼 더 흘러가요.
  const transect = (el) => {
    const TW = 2000, RED = "#c0353a";
    const CURVE = [[16, 246], [60, 244], [150, 262], [220, 232], [300, 212], [380, 228], [450, 234], [580, 215], [650, 180], [720, 120], [790, 80], [860, 74], [930, 90], [990, 140], [1040, 190], [1100, 215], [1170, 230], [1230, 212], [1290, 203], [1340, 222], [1400, 240], [1450, 242], [1500, 240], [1560, 242], [1620, 242], [1680, 255], [1740, 264], [1800, 254], [1850, 245], [1900, 252], [1962, 268]];
    const DOTS = [[50, 7], [280, 6], [298, 6], [413, 7], [518, 4], [548, 4], [611, 4], [670, 6], [708, 6], [738, 6], [752, 4], [778, 6], [792, 6], [843, 11], [897, 7], [925, 6], [943, 11], [980, 4], [997, 4], [1002, 4], [1068, 4], [1122, 7], [1243, 6], [1292, 7], [1339, 6], [1486, 7], [1625, 7], [1852, 7]];
    const dens = (x) => { for (let i = 0; i < CURVE.length - 1; i++) { const [a, b] = [CURVE[i], CURVE[i + 1]]; if (x <= b[0]) { const k = (x - a[0]) / (b[0] - a[0]); return (272 - (a[1] + (b[1] - a[1]) * k)) / 198; } } return 0.02; };
    const r = rnd(9), people = [], cars = [], glow = DOTS.map(() => 0);
    // 핀 #3(2026-11-22): 끝없이 돌지 않고 세 바퀴(사람이 서쪽 끝에서 대지까지 걷는 시간 × 3)만 움직인 뒤 멈춰요.
    // 멈춘 뒤에는 스크롤할 때만 한 장씩 다시 그리고, 그림을 누르면 처음부터 다시 세 바퀴.
    const ROUNDS = 3, ROUND_S = 15;
    let last = 0, scrollOff = 0, lastY = scrollY, run = 0, done = false, st = null;
    addEventListener("scroll", () => { scrollOff += (scrollY - lastY) * 1.4; lastY = scrollY; if (done && st) st.kick(); }, { passive: true });
    el.addEventListener("click", () => { if (!done) return; done = false; run = 0; if (st) st.kick(); });
    const pats = {}; // 점 무늬: 매 프레임 수천 개 점을 찍는 대신 한 번 만든 무늬로 채워요
    const dotPat = (g, sc, col) => { const k = sc.toFixed(3) + col; if (pats[k]) return pats[k]; const c = document.createElement("canvas"), n = Math.max(2, Math.round(9 * sc * 2)) , s = 9 * sc; c.width = Math.ceil(s * 2 * 2); c.height = Math.ceil(s * 2 * 2); const x = c.getContext("2d"); x.scale(2, 2); x.fillStyle = col; const d = Math.max(0.8, sc * 1.6); x.fillRect(0, 0, d, d); x.fillRect(s / 2, s, d, d); x.fillRect(s, 0, d, d); x.fillRect(s * 1.5, s, d, d); const p = g.createPattern(c, "repeat"); if (p && p.setTransform) p.setTransform(new DOMMatrix().scale(0.5)); return (pats[k] = p || col); };
    st = stage(el, (g, W, H, t) => {
      const dt = done ? 0 : Math.min(0.05, t - last); last = t;
      run += dt; if (!done && run >= ROUNDS * ROUND_S) { done = true; people.length = 0; cars.length = 0; glow.fill(0); }
      const sc = H / 544, tw = TW * sc, off = ((run * 38 + scrollOff) % TW + TW) % TW; // 띠가 흐르는 양 (원본 단위)
      const X = (x) => x * sc, Y = (y) => y * sc, dark = root.dataset.mode === "dark";
      // 사람: 서쪽 끝에서 생겨 동쪽으로 걸어요. 밀도가 낮은 곳일수록 많이 흩어져요(빠져나가요)
      if (!reduce && !done) {
        const spawn = 14 * (run < (ROUNDS - 0.7) * ROUND_S ? dt : 0); // 마지막 바퀴엔 새 사람이 안 생겨요 for (let k = 0; k < Math.floor(spawn + r()); k++) { let x = 16; for (let n = 0; n < 6; n++) { const q = 16 + r() * 1080; if (r() < dens(q) + 0.15) { x = q; break; } } people.push({ x, y: 296 + r() * 18, v: 70 + r() * 60, a: 0, life: 1, ph: r() * 6 }); }
        for (const p of people) { p.x += p.v * dt; p.ph += dt * 6; const d = dens(p.x); if (p.a < 1) p.a = Math.min(1, p.a + dt * 2);
          if (r() < dt * (p.x > 1095 ? 0.55 : 0.08) * (1.25 - d) * 1.6) p.leave = p.leave || r() < 0.5; // 문턱을 넘으면 흐름이 끊겨요
          if (p.leave) { p.life -= dt * 1.6; p.y += dt * 14 * (p.ph % 2 > 1 ? 1 : -1); }
          DOTS.forEach(([dx], i) => { if (Math.abs(p.x - dx) < 3) glow[i] = 1; }); }
        for (let i = people.length - 1; i >= 0; i--) if (people[i].life <= 0 || people[i].x > 1540) people.splice(i, 1);
        // 차: 동쪽 끝에서 대지로 들어와 잠깐 머물렀다가 사라져요
        if (r() < dt * 0.55) cars.push({ x: 1965, y: 300 + r() * 12, st: 0, wait: 1.5 + r() * 2 });
        for (const c of cars) { if (c.st === 0) { c.x -= dt * 120; if (c.x <= 1575) { c.x = 1575; c.st = 1; } } else if (c.st === 1) { c.wait -= dt; if (c.wait <= 0) c.st = 2; } else c.life = (c.life ?? 1) - dt * 1.5; }
        for (let i = cars.length - 1; i >= 0; i--) if ((cars[i].life ?? 1) <= 0) cars.splice(i, 1);
        glow.forEach((v, i) => (glow[i] = Math.max(0, v - dt * 1.4)));
      }
      const ink = C.mix(0.88), soft = C.mix(0.55), faint = C.mix(0.3);
      const fnt = (px, w = 400) => font(px, w);
      // 타일을 화면 폭만큼 반복해서 그려요
      for (let ox = -off * sc; ox < W; ox += tw) {
        g.save(); g.translate(ox, 0);
        if (ox + tw < 0) { g.restore(); continue; }
        // 밀도 곡선 + 점 채움
        g.beginPath(); g.moveTo(X(16), Y(272)); { const Pt = CURVE.map(([x, y]) => [x, 272 - (272 - y) * (1 + 0.035 * Math.sin(run * 1.2 + x / 160))]); g.lineTo(X(Pt[0][0]), Y(Pt[0][1])); for (let i = 1; i < Pt.length - 1; i++) { const mxp = (Pt[i][0] + Pt[i + 1][0]) / 2, myp = (Pt[i][1] + Pt[i + 1][1]) / 2; g.quadraticCurveTo(X(Pt[i][0]), Y(Pt[i][1]), X(mxp), Y(myp)); } const e = Pt[Pt.length - 1]; g.lineTo(X(e[0]), Y(e[1])); } g.lineTo(X(1962), Y(272)); g.closePath();
        g.save(); g.clip(); g.fillStyle = dotPat(g, sc, soft); g.fillRect(0, Y(56), X(1962), Y(220)); g.restore();
        g.strokeStyle = ink; g.lineWidth = Math.max(1, sc * 2.4); g.stroke();
        g.beginPath(); g.moveTo(X(16), Y(272)); g.lineTo(X(1962), Y(272)); g.lineWidth = Math.max(1, sc * 2); g.stroke();
        // 팝업 점 (사람이 지나가면 잠깐 부풀어요)
        DOTS.forEach(([x, rr], i) => { g.beginPath(); g.arc(X(x), Y(305), X(rr * (1 + glow[i] * 0.6)), 0, 6.283); g.fillStyle = ink; g.fill(); if (glow[i] > 0.05) { g.beginPath(); g.arc(X(x), Y(305), X(rr + 4 + (1 - glow[i]) * 14), 0, 6.283); g.strokeStyle = C.mix(0.6, glow[i] * 0.6); g.lineWidth = 1; g.stroke(); } });
        // 성수이로
        g.setLineDash([X(14), X(5), X(2), X(5)]); g.strokeStyle = soft; g.lineWidth = 1; g.beginPath(); g.moveTo(X(1095), Y(57)); g.lineTo(X(1095), Y(395)); g.stroke(); g.setLineDash([]);
        // 아래 띠: 개발됨(점) · 문턱(점선) · 미개발(빗금)
        g.strokeStyle = soft; g.lineWidth = 1; g.strokeRect(X(16), Y(349), X(1155), Y(39));
        g.save(); g.beginPath(); g.rect(X(16), Y(349), X(1155), Y(39)); g.clip(); g.fillStyle = dotPat(g, sc, faint); g.fillRect(X(16), Y(349), X(1155), Y(39)); g.restore();
        g.setLineDash([X(6), X(5)]); g.beginPath(); g.moveTo(X(1171), Y(349)); g.lineTo(X(1598), Y(349)); g.moveTo(X(1171), Y(388)); g.lineTo(X(1598), Y(388)); g.stroke(); g.setLineDash([]);
        g.strokeRect(X(1598), Y(349), X(364), Y(39)); g.save(); g.beginPath(); g.rect(X(1598), Y(349), X(364), Y(39)); g.clip(); g.beginPath(); for (let x = 1598; x < 2000; x += 22) { g.moveTo(X(x), Y(388)); g.lineTo(X(x + 39), Y(349)); } g.strokeStyle = soft; g.stroke(); g.restore();
        // 사람
        for (const p of people) { g.globalAlpha = p.a * Math.max(0, p.life); g.fillStyle = C.mix(0.7); g.beginPath(); g.arc(X(p.x), Y(p.y + Math.sin(p.ph) * 0.8), Math.max(1.1, X(2.6)), 0, 6.283); g.fill(); }
        g.globalAlpha = 1;
        // 대지: 빨간 틀이 숨 쉬고, 차가 들어와 머물러요
        const pulse = done ? 0.5 : 0.5 + 0.5 * Math.sin(run * 2.2);
        g.fillStyle = `rgba(192,53,58,${dark ? 0.16 + 0.08 * pulse : 0.1 + 0.06 * pulse})`; g.fillRect(X(1528), Y(57), X(65), Y(337)); g.strokeStyle = RED; g.lineWidth = Math.max(1, sc * 2); g.strokeRect(X(1528), Y(57), X(65), Y(337));
        for (const c of cars) { g.globalAlpha = Math.max(0, c.life ?? 1); g.fillStyle = RED; const cx = X(c.x), cy = Y(c.y), cw = X(22), ch = X(10); g.fillRect(cx - cw / 2, cy - ch / 2, cw, ch); g.fillStyle = C.bg; g.fillRect(cx - cw * 0.32, cy - ch * 0.3, cw * 0.22, ch * 0.6); g.globalAlpha = 1; }
        // 글자 (사이트 토큰 크기, 자간 넓게)
        g.textBaseline = "middle"; g.fillStyle = soft; g.font = fnt(C.xs, 500);
        const sp = (txt, x, y, al = "left", fill = soft) => { g.fillStyle = fill; g.textAlign = al; if ("letterSpacing" in g) g.letterSpacing = "0.12em"; g.fillText(txt, x, y); if ("letterSpacing" in g) g.letterSpacing = "0px"; };
        sp("POP-UP DENSITY", X(16), Y(25)); sp("SEONGSU-IRO", X(1110), Y(70)); sp("SITE", X(1560), Y(30), "center", RED);
        sp("DEVELOPED", X(22), Y(420)); sp("THRESHOLD", X(1375), Y(420), "center", RED); sp("YET DEVELOPED", X(1817), Y(420), "center");
        // 거리 화살표
        const arrow = (x0, x1, col, head) => { g.strokeStyle = col; g.lineWidth = 1; g.beginPath(); g.moveTo(X(x0), Y(480)); g.lineTo(X(x1), Y(480)); const hx = head < 0 ? X(x0) : X(x1), d = head < 0 ? 1 : -1; g.moveTo(hx + d * X(14), Y(472)); g.lineTo(hx, Y(480)); g.lineTo(hx + d * X(14), Y(488)); g.stroke(); };
        arrow(16, 1082, faint, -1); arrow(1095, 1185, RED, -1); arrow(1438, 1530, RED, 1); arrow(1605, 1962, faint, 1);
        sp("approx. 260 m", X(1307), Y(482), "center", RED); sp("W", X(22), Y(517)); sp("E", X(1943), Y(517));
        g.restore();
      }
      el.classList.toggle("mv-done", done);
      return !done;
    });
  };


  // ── 핀 #23 Four Stops: 방이 줄기를 따라 340 mm씩 네 자리에 멈추고, 멈출 때마다 고정 핀이 들어가요 (입면 1:200)
  const stops = (el) => {
    const ST = [[0, "±0", "home · FL +5.00"], [-340, "−340", ""], [-680, "−680", "ramp neighbour"], [-1020, "−1,020", "build · storm park · FL +3.98"]];
    const HOLD = 1.6, SEQ = [0, 1, 2, 3, 2, 1], LAPSE = 40; // 시간 압축 ×40
    // 조절: 정지 자리 버튼(누르면 자동 순환 멈추고 그 자리로) · 드릴 속도 · 자동
    el.insertAdjacentHTML("beforeend", `<div class="mv-ui"><span class="mv-k">stop</span>${ST.map(([, l], i) => `<button type="button" data-s="${i}">${l}</button>`).join("")}<span class="sep"></span><button type="button" data-auto class="on">auto</button><span class="sep"></span><label class="mv-rg"><span class="mv-k">drill</span><input type="range" min="100" max="600" step="10" value="300" aria-label="Drill speed, rpm"><b>300 rpm</b></label></div>`);
    const bts = [...el.querySelectorAll("[data-s]")], au = el.querySelector("[data-auto]"), rg = el.querySelector(".mv-rg input"), rl = el.querySelector(".mv-rg b");
    let lv = 0, tgt = 0, auto = true, k = 0, hold = 0, last = 0, rpm = 300, settled = 0;
    const mark = () => { bts.forEach((x, i) => x.classList.toggle("on", !auto && i === tgt)); au.classList.toggle("on", auto); };
    bts.forEach((x, i) => x.addEventListener("click", () => { auto = false; tgt = i; mark(); st.kick(); }));
    au.addEventListener("click", () => { auto = !auto; if (auto) { k = SEQ.indexOf(tgt); if (k < 0) k = 0; hold = 0; } mark(); st.kick(); });
    rg.addEventListener("input", () => { rpm = +rg.value; rl.textContent = rpm + " rpm"; st.kick(); });
    const st = stage(el, (g, W, H, t) => {
      const dt = last ? Math.min(0.05, t - last) : 0; last = t;
      // 움직임: 200바퀴 = 340 mm → 1바퀴 1.7 mm, 화면에선 ×LAPSE
      const want = ST[tgt][0], v = (rpm / 60) * 1.7 * LAPSE, d = want - lv;
      if (Math.abs(d) > 0.01) { lv += Math.sign(d) * Math.min(Math.abs(d), v * dt); settled = 0; } else { lv = want; settled += dt; }
      const moving = Math.abs(want - lv) > 0.01;
      if (auto && !moving) { hold += dt; if (hold > HOLD) { hold = 0; k = (k + 1) % SEQ.length; tgt = SEQ[k]; } }
      const a = ST.findIndex((x) => Math.abs(x[0] - lv) < 0.5);
      // 높이(m) → 화면: 땅 0 ~ 나무 끝 10.4 m
      const top = H * 0.09, bot = H * 0.9, Y = (m) => bot - ((bot - top) * m) / 10.4, u = (bot - top) / 10.4, cx = W * 0.36;
      g.lineCap = "butt";
      g.strokeStyle = C.mix(0.8); g.lineWidth = 1.2; g.beginPath(); g.moveTo(cx - u * 2.6, Y(0)); g.lineTo(cx + u * 2.6, Y(0)); g.stroke();
      const tw = (m) => u * (0.26 - 0.012 * m);
      g.fillStyle = C.mix(0.06); g.strokeStyle = C.mix(0.55); g.lineWidth = 0.8;
      g.beginPath(); g.moveTo(cx - tw(0), Y(0)); g.lineTo(cx - tw(10.2), Y(10.2)); g.lineTo(cx + tw(10.2), Y(10.2)); g.lineTo(cx + tw(0), Y(0)); g.closePath(); g.fill(); g.stroke();
      const sw = u * 0.34;
      g.fillStyle = C.mix(0.12); g.fillRect(cx - sw, Y(8.8), sw * 2, Y(3.3) - Y(8.8)); g.strokeStyle = C.mix(0.7); g.lineWidth = 0.9; g.strokeRect(cx - sw, Y(8.8), sw * 2, Y(3.3) - Y(8.8));
      g.save(); g.beginPath(); g.rect(cx - sw, Y(8.8), sw * 2, Y(3.3) - Y(8.8)); g.clip(); g.strokeStyle = C.mix(0.35); g.lineWidth = 0.6;
      const rot = (lv / 340) * 3 * 0.34 * u;
      for (let y = Y(8.8) - u + (rot % (u * 0.34)); y < Y(3.3) + u; y += u * 0.34) { g.beginPath(); g.moveTo(cx - sw, y); g.lineTo(cx + sw, y - u * 0.18); g.stroke(); }
      g.restore();
      const tx = cx + u * 2.2;
      ST.forEach(([mm, lab, note], i) => {
        const y = Y(5 + mm / 1000), ly = Y(6.3) + i * C.s * 3.6, on = !moving && i === a, go = moving && i === tgt;
        g.strokeStyle = on ? C.red(0.9) : go ? C.red(0.45) : C.mix(0.3); g.lineWidth = on ? 1.2 : 0.7; g.setLineDash(on ? [] : [2, 3]); g.beginPath(); g.moveTo(cx + sw + 4, y); g.lineTo(tx - u * 0.5, y); g.lineTo(tx - 6, ly); g.stroke(); g.setLineDash([]);
        g.textAlign = "left"; g.textBaseline = "middle"; g.font = font(C.s, 600); g.fillStyle = on || go ? C.red() : C.mix(0.9); g.fillText(lab, tx, ly);
        if (note) { g.font = font(C.xs); g.fillStyle = C.mix(0.55); g.fillText(note, tx, ly + C.s * 1.2); }
      });
      const fl = 5 + lv / 1000, rw = u * 1.45, rh = u * 2.3;
      g.fillStyle = C.bg; g.fillRect(cx - rw, Y(fl) - rh, rw * 2, rh);
      g.strokeStyle = C.mix(0.85); g.lineWidth = 1; g.strokeRect(cx - rw, Y(fl) - rh, rw * 2, rh);
      g.fillStyle = C.mix(0.95); g.fillRect(cx - rw, Y(fl) - u * 0.1, rw * 2, u * 0.12); g.fillRect(cx - rw, Y(fl) - rh, rw * 2, u * 0.12);
      g.fillStyle = C.mix(0.12); g.fillRect(cx - tw(fl + 1), Y(fl) - rh + u * 0.12, tw(fl + 1) * 2, rh - u * 0.22);
      g.fillStyle = C.mix(0.85); g.fillRect(cx - sw * 1.25, Y(fl), sw * 2.5, u * 0.16);
      const pin = moving ? 0 : Math.min(1, settled / 0.35);
      g.fillStyle = C.red(0.25 + 0.75 * pin); g.fillRect(cx + sw * 1.25 - u * 0.45 * pin, Y(fl) + u * 0.02, u * 0.45, u * 0.1);
      const dx = cx - rw - u * 0.55, dy = Y(fl) - u * 0.5, ang = (lv / 340) * Math.PI * 2 * 200;
      g.strokeStyle = moving ? C.red(0.9) : C.mix(0.4); g.lineWidth = 1; g.beginPath(); g.arc(dx, dy, u * 0.22, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.moveTo(dx, dy); g.lineTo(dx + Math.cos(ang) * u * 0.22, dy + Math.sin(ang) * u * 0.22); g.stroke();
      // 아래 읽기: 바퀴 수 · 걸리는 실제 시간
      const turns = Math.round((Math.abs(lv) / 340) * 200), secs = Math.round(((Math.abs(want - lv) / 1.7) / rpm) * 60);
      g.textAlign = "left"; g.textBaseline = "alphabetic"; g.font = font(C.xs); g.fillStyle = C.mix(0.55);
      g.fillText("drill turns", W * 0.02, H * 0.97); g.font = font(C.xs, 600); g.fillStyle = C.mix(0.95); g.fillText(`${turns} / 600`, W * 0.02 + C.xs * 6, H * 0.97);
      g.font = font(C.xs); g.fillStyle = C.mix(0.55);
      g.fillText(moving ? `moving · ${secs} s left at ${rpm} rpm · worm self-locks if the drill stops` : "held · lock pin in", W * 0.02 + C.xs * 13, H * 0.97);
    });
    mark();
  };

  // ── 핀 #23 Room to Grow: 20년 동안 자작나무가 굵어지고, 해마다 가을이면 잭 8개가 2 mm씩 물러나요 (평면 1:20)
  const grow = (el) => {
    const Y0 = 2026, YRS = 20, SPAN = 14, END = 3;
    stage(el, (g, W, H, t) => {
      const tt = t % (SPAN + END), yr = Math.min(YRS, (tt / SPAN) * YRS), year = Y0 + yr, out = sm((tt - SPAN) / 1.2);
      const cx = W * 0.42, cy = H * 0.5, R = Math.min(W * 0.36, H * 0.42), mm = R / 420; // 슬리브 바깥 날개 Ø820 → R
      const trunk = (440 + 4 * yr) / 2 * mm, sleeve = 330 * mm, flight = 410 * mm;
      // 날개 끝 원 (점선) · 슬리브
      g.globalAlpha = 1 - out;
      g.setLineDash([2, 4]); g.strokeStyle = C.mix(0.35); g.lineWidth = 0.7; g.beginPath(); g.arc(cx, cy, flight, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
      g.strokeStyle = C.mix(0.95); g.lineWidth = Math.max(2, mm * 14); g.beginPath(); g.arc(cx, cy, sleeve, 0, Math.PI * 2); g.stroke();
      g.globalAlpha = 1;
      // 2036 · 2046 한계 원
      [[480, "2036", 0.25], [520, "2046 limit", 0.75]].forEach(([d, lab, q]) => { g.setLineDash([3, 3]); g.strokeStyle = C.mix(0.3); g.lineWidth = 0.7; g.beginPath(); g.arc(cx, cy, (d / 2) * mm, 0, Math.PI * 2); g.stroke(); g.setLineDash([]);
        g.font = font(C.xs); g.fillStyle = C.mix(0.5); g.textAlign = "left"; g.textBaseline = "middle"; const ay = (d / 2) * mm * Math.sin(q), ax = (d / 2) * mm * Math.cos(q); g.fillText(lab, cx + R * 1.06, cy + ay + (q > 0.5 ? C.s : 0)); g.strokeStyle = C.mix(0.25); g.beginPath(); g.moveTo(cx + ax, cy + ay); g.lineTo(cx + R * 1.04, cy + ay + (q > 0.5 ? C.s : 0)); g.stroke(); });
      // 줄기: 나이테가 한 해에 한 줄씩
      g.fillStyle = C.mix(0.1); g.beginPath(); g.arc(cx, cy, trunk, 0, Math.PI * 2); g.fill();
      g.strokeStyle = C.mix(0.22); g.lineWidth = 0.5; for (let k = 1; k <= Math.floor(yr); k++) { g.beginPath(); g.arc(cx, cy, (440 + 4 * k) / 2 * mm - 2 * mm, 0, Math.PI * 2); g.stroke(); }
      for (let r0 = 40; r0 < 220; r0 += 22) { g.beginPath(); g.arc(cx, cy, r0 * mm, 0, Math.PI * 2); g.stroke(); }
      g.strokeStyle = C.mix(0.8); g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, trunk, 0, Math.PI * 2); g.stroke();
      // 가을마다 잭 8개가 물러나요: 해 바뀔 때 빨갛게
      const fall = 1 - Math.min(1, (yr % 1) / 0.12), flash = yr > 0.2 && yr < YRS ? fall : 0;
      g.globalAlpha = 1 - out;
      for (let j = 0; j < 8; j++) {
        const a = (j / 8) * Math.PI * 2 + Math.PI / 8, c = Math.cos(a), sn = Math.sin(a), r1 = trunk + 3 * mm + (1 - fall) * 2 * mm;
        g.strokeStyle = flash > 0.05 ? C.red(0.4 + 0.6 * flash) : C.mix(0.85); g.lineWidth = Math.max(2, mm * 16);
        g.beginPath(); g.moveTo(cx + c * r1, cy + sn * r1); g.lineTo(cx + c * (sleeve - mm * 8), cy + sn * (sleeve - mm * 8)); g.stroke();
        g.fillStyle = C.mix(0.5); g.beginPath(); g.arc(cx + c * r1, cy + sn * r1, Math.max(1.5, mm * 9), 0, Math.PI * 2); g.fill(); // 고무 패드
      }
      g.globalAlpha = 1;
      // 남은 틈 (빨간 치수)
      const gap = Math.max(0, 330 - (440 + 4 * yr) / 2 - 0);
      g.strokeStyle = C.red(0.9); g.lineWidth = 1; g.beginPath(); g.moveTo(cx - trunk, cy); g.lineTo(cx - sleeve, cy); g.stroke();
      [cx - trunk, cx - sleeve].forEach((x) => { g.beginPath(); g.moveTo(x, cy - 4); g.lineTo(x, cy + 4); g.stroke(); });
      g.font = font(C.s, 600); g.fillStyle = C.red(); g.textAlign = "center"; g.textBaseline = "bottom"; g.fillText(`${Math.round(gap)}`, cx - (trunk + sleeve) / 2, cy - 5);
      // 가운데: 연도 · 지름
      g.textBaseline = "middle"; g.font = font(C.s, 600); g.fillStyle = C.mix(0.95); g.fillText(String(Math.floor(year)), cx + trunk * 0.15, cy - C.s * 0.7);
      g.font = font(C.xs); g.fillStyle = C.mix(0.6); g.fillText(`Ø${Math.round(440 + 4 * yr)}`, cx + trunk * 0.15, cy + C.s * 0.7);
      // 아래 읽기
      g.textAlign = "left"; g.textBaseline = "alphabetic"; g.font = font(C.xs); g.fillStyle = C.mix(0.55);
      g.fillText(out > 0.02 ? "after about twenty years the kit moves on — three Ø38 holes, walled off by new wood" : "every autumn the eight jacks back off 2 mm", W * 0.02, H * 0.97);
      if (out > 0.02) { g.textAlign = "center"; g.font = font(C.xs, 600); g.fillStyle = C.mix(0.95, out); g.fillText("the kit moves on", cx, cy + R * 0.92); }
    });
  };

  // ── 가변 투과 루버 (Campus J′, 핀 #108): 해가 움직이면 위 판의 루버는 햇빛 방향으로 열려 빛이 바닥까지 들어오고,
  // 아래 판의 루버는 햇빛에 맞서 닫혀 빛을 밖으로 되돌려요. 두 판이 같은 해를 같이 봐요. (평면, 위가 실내)
  const louver = (el) => {
    const N = 5, SUN = (o) => `rgba(240,196,60,${o})`;
    stage(el, (g, W, H, t) => {
      const dark = root.dataset.mode === "dark", a = ((reduce ? 38 : 38 + 16 * Math.sin(t * 0.45)) * Math.PI) / 180;
      const dx = -Math.cos(a), dy = -Math.sin(a); // 햇빛 방향 (오른쪽 아래 → 왼쪽 위)
      const ph = H / 2, X0 = W * 0.05, X1 = W * 0.95, bay = (X1 - X0) / N, ink = C.mix(0.85), soft = C.mix(0.45), faint = C.mix(0.14);
      [0, 1].forEach((k) => {
        const top = k * ph + ph * 0.08, F = k * ph + ph * 0.56, LY = F + ph * 0.1, L = bay * 0.42;
        // 방 바닥 격자
        g.fillStyle = dark ? "rgba(255,255,255,.03)" : "rgba(0,0,0,.025)"; g.fillRect(X0, top, X1 - X0, F - top);
        g.strokeStyle = faint; g.lineWidth = 1; g.beginPath();
        for (let x = X0; x <= X1 + 1; x += bay / 4) { g.moveTo(x, top); g.lineTo(x, F); }
        for (let y = top; y <= F + 1; y += bay / 4) { g.moveTo(X0, y); g.lineTo(X1, y); }
        g.stroke(); g.strokeStyle = soft; g.strokeRect(X0, top, X1 - X0, F - top);
        // 들어온 빛 (열린 판만): 창마다 햇빛 방향으로 방 안쪽까지 평행사변형
        if (k === 0) {
          g.save(); g.beginPath(); g.rect(X0, top, X1 - X0, F - top); g.clip(); g.fillStyle = SUN(dark ? 0.22 : 0.3);
          for (let i = 0; i < N; i++) { const o0 = X0 + bay * i + bay * 0.3, o1 = o0 + bay * 0.4, kk = (F - top) / -dy; g.beginPath(); g.moveTo(o0, F); g.lineTo(o1, F); g.lineTo(o1 + dx * kk, F + dy * kk); g.lineTo(o0 + dx * kk, F + dy * kk); g.closePath(); g.fill(); }
          g.restore();
        } else { g.fillStyle = dark ? "rgba(0,0,0,.25)" : "rgba(0,0,0,.05)"; g.fillRect(X0, top, X1 - X0, F - top); }
        // 벽과 창
        for (let i = 0; i < N; i++) { const x = X0 + bay * i; g.fillStyle = C.mix(0.6); g.fillRect(x, F - 3, bay * 0.3, 6); g.fillRect(x + bay * 0.7, F - 3, bay * 0.3, 6); g.fillStyle = C.mix(0.2); g.fillRect(x + bay * 0.3, F - 1, bay * 0.4, 2); }
        // 루버와 햇빛
        for (let i = 0; i < N; i++) {
          const cx = X0 + bay * (i + 0.5), cy = LY, ang = k === 0 ? Math.atan2(dy, dx) : Math.atan2(dy, dx) + Math.PI / 2 + 0.45;
          const ux = Math.cos(ang) * L / 2, uy = Math.sin(ang) * L / 2;
          // 들어오는 햇빛 (실선)
          const sx = cx - dx * ph * 0.3, sy = cy - dy * ph * 0.3;
          g.strokeStyle = ink; g.lineWidth = 1; g.beginPath(); g.moveTo(sx, sy); g.lineTo(cx - dx * 6, cy - dy * 6); g.stroke();
          if (k === 0) { // 열림: 루버 사이로 지나가 실내로 (점선 화살표)
            g.setLineDash([4, 4]); g.strokeStyle = soft; g.beginPath(); g.moveTo(cx, cy); g.lineTo(cx + dx * ph * 0.34, cy + dy * ph * 0.34); g.stroke(); g.setLineDash([]);
          } else { // 닫힘: 루버 면에 반사되어 밖으로
            const nx = Math.cos(ang + Math.PI / 2), ny = Math.sin(ang + Math.PI / 2), dot = dx * nx + dy * ny, rx = dx - 2 * dot * nx, ry = dy - 2 * dot * ny;
            const ex = cx + rx * ph * 0.26, ey = cy + ry * ph * 0.26;
            g.setLineDash([4, 4]); g.strokeStyle = soft; g.beginPath(); g.moveTo(cx, cy); g.lineTo(ex, ey); g.stroke(); g.setLineDash([]);
            const ah = Math.atan2(ry, rx); g.fillStyle = soft; g.beginPath(); g.moveTo(ex, ey); g.lineTo(ex - 7 * Math.cos(ah - 0.4), ey - 7 * Math.sin(ah - 0.4)); g.lineTo(ex - 7 * Math.cos(ah + 0.4), ey - 7 * Math.sin(ah + 0.4)); g.fill();
          }
          g.strokeStyle = ink; g.lineWidth = 3; g.lineCap = "round"; g.beginPath(); g.moveTo(cx - ux, cy - uy); g.lineTo(cx + ux, cy + uy); g.stroke(); g.lineCap = "butt"; g.lineWidth = 1;
        }
        // 해
        const sr = Math.max(8, ph * 0.04), sx = Math.min(X1 - sr, X0 + bay * (N - 0.5) - dx * ph * 0.34), sy = Math.min(k * ph + ph - sr, LY - dy * ph * 0.34);
        const gr = g.createRadialGradient(sx, sy, 0, sx, sy, sr * 2.2); gr.addColorStop(0, SUN(0.95)); gr.addColorStop(0.45, SUN(0.6)); gr.addColorStop(1, SUN(0)); g.fillStyle = gr; g.beginPath(); g.arc(sx, sy, sr * 2.2, 0, 6.2832); g.fill();
        // 이름
        g.fillStyle = ink; g.font = font(C.xs, 600); g.textBaseline = "top"; g.textAlign = "left";
        g.fillText(k === 0 ? "OPEN — the louvers follow the sun" : "FLAT — the louvers face the sun", X0, k * ph + ph * 0.01);
        g.fillStyle = soft; g.font = font(C.xs); g.textAlign = "right";
        g.fillText(k === 0 ? "low sun reaches deep into the room" : "the light is thrown back out, the room stays shaded", X1, k * ph + ph * 0.01);
      });
      g.fillStyle = soft; g.textAlign = "left"; g.textBaseline = "bottom"; g.font = font(C.xs);
      g.fillText(`sun ${Math.round((a * 180) / Math.PI)}° to the facade`, X0, H - 2);
    });
  };

  // ── 열두 마운드 (RE:TIDE, 핀 #81): 바닷물이 차오르면 바깥 등고선부터 잠겨 마운드가 섬이 되고,
  // 물이 오를 때 파빌리온·전망대가 하나씩 마운드에서 들려 분해돼요(물이 빠지면 차례로 내려앉음). 높이 지도는 원본 등고선을 겹쳐 만든 것.
  const mounds = (el) => {
    const D = "assets/img/re-tide/", ld = (n) => { const i = new Image(); i.src = D + n; i.onload = () => k && k(); return i; };
    const land = ld("mounds-land.jpg"), pav = ld("mounds-pav.png"), ex = ld("mounds-explode.png"), hm = ld("mounds-height.png");
    // 파빌리온 여섯 채 [x0, y0, x1, y1] (그림 비율 0–1), 들리는 순서
    const P = [[0.125, 0.1, 0.345, 0.5], [0.43, 0.255, 0.64, 0.645], [0.7, 0.005, 0.9, 0.38], [0.46, 0.025, 0.575, 0.276], [0.12, 0.452, 0.192, 0.7], [0.795, 0.465, 0.875, 0.76]];
    let hd = null, mk = null, mg = null, lastL = -1, k = null;
    const build = () => { if (hd || !hm.complete || !hm.naturalWidth) return; const c = document.createElement("canvas"); c.width = hm.naturalWidth; c.height = hm.naturalHeight; const x = c.getContext("2d"); x.drawImage(hm, 0, 0); hd = x.getImageData(0, 0, c.width, c.height); mk = document.createElement("canvas"); mk.width = c.width; mk.height = c.height; mg = mk.getContext("2d"); };
    const water = (L) => { // L 0(간조)–1(만조): 밝은(낮은) 땅부터 잠겨요
      if (Math.abs(L - lastL) < 0.004) return; lastL = L; const thr = 246 - L * 205, o = mg.createImageData(mk.width, mk.height), s = hd.data, d = o.data;
      for (let i = 0; i < s.length; i += 4) { const a = Math.max(0, Math.min(1, (s[i] - thr) / 10)); d[i] = 120; d[i + 1] = 148; d[i + 2] = 166; d[i + 3] = a * 120; }
      mg.putImageData(o, 0, 0);
    };
    const { kick } = stage(el, (g, W, H, t) => {
      build(); if (!land.complete || !hd) return true;
      const r = land.naturalWidth / land.naturalHeight, w = Math.min(W, H * r), h = w / r, x0 = (W - w) / 2, y0 = (H - h) / 2;
      const ph = ((t % 16) / 16), L = reduce ? 0.55 : 0.5 - 0.5 * Math.cos(ph * Math.PI * 2); // 16초에 한 번 밀물·썰물
      g.drawImage(land, x0, y0, w, h);
      water(L); g.save(); g.globalCompositeOperation = "multiply"; g.imageSmoothingQuality = "high"; g.drawImage(mk, x0, y0, w, h); g.restore();
      // 파빌리온: 물이 오를수록 하나씩 들림 (0 = 마운드 위에 내려앉음, 1 = 분해되어 떠 있음)
      const es = P.map((p, i) => sm((L - 0.12 - i * 0.1) / 0.22));
      if (ex.complete) { g.globalAlpha = Math.max(...es) * 0.9; g.drawImage(ex, x0, y0, w, h); g.globalAlpha = 1; }
      if (pav.complete) P.forEach(([a, b, c, d], i) => {
        const e = reduce ? 1 : es[i], pw = pav.naturalWidth, ph2 = pav.naturalHeight, sq = 0.62 + 0.38 * e;
        g.save(); g.translate(x0, y0 + d * h * (1 - sq) + (1 - e) * h * 0.05); g.scale(w / pw, (h / ph2) * sq);
        // 자기 칸에서 겹치는 이웃 칸은 빼고 오려요 (이웃이 두 번 그려지지 않게)
        g.beginPath(); g.rect(a * pw, b * ph2, (c - a) * pw, (d - b) * ph2);
        P.forEach(([a2, b2, c2, d2], j) => { if (j !== i && (c2 - a2) * (d2 - b2) < (c - a) * (d - b) && a2 < c && c2 > a && b2 < d && d2 > b) g.rect(Math.max(a, a2) * pw, Math.max(b, b2) * ph2, (Math.min(c, c2) - Math.max(a, a2)) * pw, (Math.min(d, d2) - Math.max(b, b2)) * ph2); });
        g.clip("evenodd"); g.globalAlpha = 0.55 + 0.45 * e; g.drawImage(pav, 0, 0); g.restore();
      });
      const lv = 2.43 + L * (9.24 - 2.43);
      g.font = font(C.xs, 600); g.fillStyle = C.mix(0.85); g.textBaseline = "bottom"; g.textAlign = "left";
      g.fillText(`Sea +${lv.toFixed(2)} m`, x0 + 8, y0 + h - 8);
      g.font = font(C.xs); g.fillStyle = C.mix(0.5);
      g.fillText(L > 0.55 ? "flood — the mounds become islands, the pavilions lift" : "ebb — the mounds join, the pavilions settle", x0 + 8 + g.measureText(`Sea +${lv.toFixed(2)} m`).width * 1.15 + 14, y0 + h - 8);
    });
    k = kick;
  };

  // ── 마운드 배치 평면 (RE:TIDE, 핀 #113): 원본 벡터 평면 위로 밀물·썰물. 높이 지도(-h.png, 1 m = 15)는 평면의 등고선 숫자·지점 높이·마운드 꼭대기와
  // 굵은 윤곽선(땅 경계)으로 만들어서 물가가 평면 선에 딱 맞아요. 물에 잠긴 마운드의 이름표는 옅어져요.
  const tideplan = (el) => {
    const src = el.dataset.bg, base = new Image(), hm = new Image();
    let hd = null, mk = null, mg = null, lastL = -1, k = null;
    base.onload = hm.onload = () => k && k();
    base.src = src; hm.src = src.replace(/\.jpg$/, "-h.png");
    const media = el.closest(".media"), tags = media ? [...media.querySelectorAll(".ftag")].map((t) => { const m = /^M\d\d\n\+([\d.]+)/.exec(t.textContent); return m && { t, top: +m[1] }; }).filter(Boolean) : [];
    const build = () => { if (hd || !hm.complete || !hm.naturalWidth) return; const c = document.createElement("canvas"); c.width = hm.naturalWidth; c.height = hm.naturalHeight; const x = c.getContext("2d"); x.drawImage(hm, 0, 0); hd = x.getImageData(0, 0, c.width, c.height); mk = document.createElement("canvas"); mk.width = c.width; mk.height = c.height; mg = mk.getContext("2d"); };
    const water = (lv) => {
      if (Math.abs(lv - lastL) < 0.02) return; lastL = lv; const o = mg.createImageData(mk.width, mk.height), s = hd.data, d = o.data;
      for (let i = 0; i < s.length; i += 4) { const dep = lv - s[i] / 15, a = Math.max(0, Math.min(1, dep / 0.25)) * (0.32 + 0.4 * Math.min(1, Math.max(0, dep) / 5)); d[i] = 110; d[i + 1] = 140; d[i + 2] = 160; d[i + 3] = a * 255; }
      mg.putImageData(o, 0, 0);
      tags.forEach(({ t, top }) => t.classList.toggle("sub", lv > top));
    };
    const { kick } = stage(el, (g, W, H, t) => {
      build(); if (!base.complete || !base.naturalWidth || !hd) return true;
      const r = base.naturalWidth / base.naturalHeight, w = Math.min(W, H * r), h = w / r, x0 = (W - w) / 2, y0 = (H - h) / 2;
      const ph = (t % 18) / 18, L = reduce ? 0.6 : 0.5 - 0.5 * Math.cos(ph * Math.PI * 2), lv = 2.43 + L * (9.24 - 2.43); // 18초에 한 번 간조 +2.43 → 만조 +9.24
      g.imageSmoothingQuality = "high"; g.drawImage(base, x0, y0, w, h);
      water(lv); g.save(); g.globalCompositeOperation = "multiply"; g.drawImage(mk, x0, y0, w, h); g.restore();
      const under = tags.filter((q) => lv > q.top).length;
      g.font = font(C.xs, 600); g.fillStyle = C.mix(0.85); g.textBaseline = "bottom"; g.textAlign = "left";
      const lab = `Sea +${lv.toFixed(2)} m`, bx = x0 + w * 0.035, by = y0 + h - 8;
      g.fillText(lab, bx, by);
      g.font = font(C.xs); g.fillStyle = C.mix(0.5);
      g.fillText(lv < 4 ? "ebb — the flats are dry, every path is open" : under ? `flood — ${under} of 12 mounds under water, their programs close` : "the flats fill, the mounds stay connected", bx + g.measureText(lab).width * 1.15 + 14, by);
    });
    k = kick;
  };

  const KIND = { mounds, tideplan, louver, clock, plan, steps, plant, transect, stops, grow, cross: (el) => three(el, "cross"), prog: (el) => three(el, "prog"), layers: (el) => three(el, "layers") };
  window.MVSims = { mount: (el, kind) => { if (el.dataset.on) return; el.dataset.on = 1; colors(); (KIND[kind] || (() => {}))(el); } };
})();
