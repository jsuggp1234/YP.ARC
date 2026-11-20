// ============================================================
// hero2d.js — WebGL(3D)을 못 쓰는 환경을 위한 2D 대체 장면.
// 같은 작품 매스를 선으로 그린 액소노메트릭으로 보여주고, hero3d와 같은 방식으로 동작해요.
// ============================================================
window.hero2D = function hero2D(host, ui) {
  const canvas = document.createElement("canvas");
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);
  const ctx = canvas.getContext("2d");
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
  let C = {};
  const theme = () => { C = { ink: css("--ink"), model: css("--model"), model2: css("--model-2"), hi: css("--model-hi") }; };
  theme();
  document.addEventListener("yp:theme", theme);

  let W, H, dpr, mx = 0, my = 0, t = 0, hoverC = -1, hoverUi = -1, px = -1, py = -1, started = false, t0 = 0;
  const G = 7;
  const works = PROJECTS.filter((p) => p.mass && p.pos).map((p, k) => ({
    p, k, lift: 0,
    boxes: p.mass.map(([x, y, w, d, h]) => ({ x: p.pos[0] + x, y: p.pos[1] + y, w, d, h })),
  }));
  const taken = (i, j) => works.some((wk) => wk.boxes.some((b) => i + 1 > b.x - 0.6 && i < b.x + b.w + 0.6 && j + 1 > b.y - 0.6 && j < b.y + b.d + 0.6));
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const city = [];
  for (let i = -G; i < G; i++) for (let j = -G; j < G; j++) {
    const dist = Math.hypot(i + 0.5, j + 0.5);
    if (dist > G - 0.6 || (i + G) % 4 === 3 || (j + G) % 5 === 4 || taken(i, j) || rnd() < 0.22) continue;
    city.push({ x: i + 0.14, y: j + 0.14, w: 0.72, d: 0.72, h: (0.22 + rnd() * 1.1) * Math.max(0.18, 1 - dist / G) * 1.5, ph: rnd() * 6.28 });
  }
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = host.clientWidth; H = host.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
    canvas.style.width = "100%"; canvas.style.height = "100%";
  };
  resize();
  new ResizeObserver(resize).observe(host);
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  canvas.addEventListener("pointermove", (e) => { const r = canvas.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; ui.coords([(px - W / 2) / 6, (py - H / 2) / 6], [e.clientX, e.clientY]); });
  canvas.addEventListener("pointerleave", () => { px = py = -1; hoverC = -1; ui.coords(null); });
  canvas.addEventListener("click", () => { if (hoverC >= 0) ui.open(hoverC); });
  ui.whenReady(() => { started = true; t0 = performance.now(); });

  let P;
  const corners = (b, h) => {
    const c = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.d], [b.x, b.y + b.d]];
    return { bot: c.map(([a, q]) => P(a, q, 0)), top: c.map(([a, q]) => P(a, q, h)) };
  };
  const inside = (poly, x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const drawBox = (b, h, fill, stroke, lw) => {
    const { bot, top } = corners(b, h);
    const face = (pts) => { ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fill(); ctx.stroke(); };
    ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = "round";
    [0, 1, 2, 3].map((k) => { const k2 = (k + 1) % 4; return { pts: [bot[k], bot[k2], top[k2], top[k]], y: (bot[k][1] + bot[k2][1]) / 2 }; })
      .sort((a, c) => a.y - c.y).forEach((f) => face(f.pts));
    face(top);
    return { bot, top };
  };
  const ease = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));

  (function draw(now) {
    t = started ? (now - t0) / 1000 : 0;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const wide = W > 900;
    const s = Math.min(W * (wide ? 0.6 : 0.95), H * 1.1) / (G * 2.5);
    const ang = Math.PI / 4 + mx * 0.22 + (REDUCED ? 0 : Math.sin(t * 0.15) * 0.04);
    const tilt = 0.5 + my * 0.08;
    const ox = W * (wide ? 0.62 : 0.5), oy = H * (wide ? 0.48 : 0.42);
    P = (x, y, z) => {
      const rx = x * Math.cos(ang) - y * Math.sin(ang), ry = x * Math.sin(ang) + y * Math.cos(ang);
      return [ox + rx * s, oy + ry * s * tilt - z * s];
    };
    ctx.strokeStyle = C.ink; ctx.globalAlpha = 0.07; ctx.lineWidth = 1;
    for (let k = -G; k <= G; k++) {
      ctx.beginPath(); ctx.moveTo(...P(k, -G, 0)); ctx.lineTo(...P(k, G, 0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(...P(-G, k, 0)); ctx.lineTo(...P(G, k, 0)); ctx.stroke();
    }
    ctx.globalAlpha = 1;
    // 판정
    hoverC = -1;
    if (px >= 0) works.forEach((w) => w.boxes.forEach((b) => {
      const g = ease(Math.max(0, (t - 0.6 - w.k * 0.14) / 1.2));
      const { bot, top } = corners(b, b.h * g);
      if (inside(bot.slice(0, 2).concat(top.slice(1, 4)).concat([bot[3], bot[2]]), px, py) || inside(top, px, py)) hoverC = w.k;
    }));
    const hover = hoverUi >= 0 ? hoverUi : hoverC;
    ui.cursor(hoverC >= 0 ? works[hoverC].p : null);
    canvas.style.cursor = hoverC >= 0 ? "pointer" : "";

    const items = [];
    city.forEach((b, i) => {
      const g = REDUCED ? 1 : ease(Math.max(0, (t - Math.hypot(b.x, b.y) * 0.045) / 1.1));
      items.push({ b, kind: 0, h: Math.max(0.001, b.h * g * (REDUCED ? 1 : 1 + 0.1 * Math.sin(t * 0.7 + b.ph))) });
    });
    works.forEach((w) => {
      w.lift += ((w.k === hover ? 1 : 0) - w.lift) * 0.15;
      const g = REDUCED ? 1 : ease(Math.max(0, (t - 0.6 - w.k * 0.14) / 1.2));
      w.g = g;
      w.boxes.forEach((b) => items.push({ b, kind: 1, w, h: Math.max(0.001, b.h * g * (1 + w.lift * 0.1)) }));
    });
    const depth = (b) => P(b.x + b.w / 2, b.y + b.d / 2, 0)[1];
    items.sort((a, c) => depth(a.b) - depth(c.b));
    const tops = {};
    items.forEach((it) => {
      if (it.kind === 0) { ctx.globalAlpha = 1; drawBox(it.b, it.h, C.model2, hexA(C.ink, 0.18), 1); return; }
      const on = it.w.k === hover;
      const { top } = drawBox(it.b, it.h, on ? C.hi : C.model, hexA(C.ink, hover >= 0 && !on ? 0.45 : 0.9), on ? 1.4 : 1.1);
      const y = Math.min(...top.map((p) => p[1]));
      if (!tops[it.w.k] || y < tops[it.w.k][1]) tops[it.w.k] = [top.reduce((a, p) => a + p[0], 0) / 4, y];
    });
    works.forEach((w) => { const tp = tops[w.k]; if (tp) ui.place(w.k, tp[0], tp[1], w.k === hover, w.g > 0.92); });
    requestAnimationFrame(draw);
  })(performance.now());

  function hexA(c, a) {
    const ctx2 = hexA.c || (hexA.c = document.createElement("canvas").getContext("2d"));
    ctx2.fillStyle = c;
    const v = ctx2.fillStyle;
    if (v[0] === "#") { const r = parseInt(v.slice(1, 3), 16), g = parseInt(v.slice(3, 5), 16), b = parseInt(v.slice(5, 7), 16); return `rgba(${r},${g},${b},${a})`; }
    return v;
  }
  return { setHover(k) { hoverUi = k; } };
};
