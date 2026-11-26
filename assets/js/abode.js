/* LUMINOUS ABODE (12번 작품) 시뮬레이션 — 2026-11-26
   data.js 그림에 sim: "la-..."를 주면 그림 자리에 캔버스로 들어가요 (church.js의 MVSims에 종류를 더해요).
   - la-climate : 8,760시간 기온 · 전략 히트맵, 날짜를 고르면 하루 곡선 · 그달 바람장미 · 그달 전략 비율
   - la-cluster : 열 채의 배치도 위 그림자, 날짜 · 시각 · 엇갈림/나란히, 북쪽 줄 남쪽 면의 일조
   - la-float   : 하중을 더하면 수위가 얼마나 오르는지 (수선면 72.25 m², 1 t = 13.8 mm), 밸러스트 조절
   - la-wall    : 벽체 두 안의 온도 · 수증기압(Glaser), 바깥 온도 · 실내 습도 조절
   - la-sun     : 북위 37.3° 태양 궤적 + 남쪽 단면의 처마 · 창 · 바닥에 드는 해
   - la-air     : 굴뚝 환기 · 맞통풍 · 열회수 환기 단면 흐름과 숫자
   - la-pv      : 네 경사면 28장 패널의 시간별 일사, 달별 발전량
   - la-rain    : 2014–2023 강수로 저수조 수위 · 넘침 · 상수 보충
   - la-carbon  : 전 과정 탄소 단계 · 재료 바꾸기 · 목재 저장 탄소
   - la-balance : 팀 에너지 계산의 수요 · 생산 · 1차 에너지 수지
   기상 자료는 assets/img/luminous-abode/sim.json (팀이 쓴 인천 IWEC 표준 기상년, scratchpad prep_data.py로 만듦).
   무채색 + 빛(해 · 일사 · 태양광)만 따뜻한 색. 글자는 사이트 토큰(--t-xs, --t-s) 크기. */
(() => {
  const root = document.documentElement;
  const css = (k) => getComputedStyle(root).getPropertyValue(k).trim();
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rgb = (h) => { const m = (h || "").match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i); return m ? [1, 2, 3].map((i) => parseInt(m[i], 16)) : null; };
  const RAMP = [[251, 243, 228], [244, 222, 178], [234, 191, 106], [220, 153, 61], [198, 106, 53], [163, 71, 47]]; // 빛 색 (LT_GLOW → LT_R)
  let C = {};
  const colors = () => {
    const bg = rgb(css("--bg")) || [255, 255, 255], ink = rgb(css("--ink")) || [17, 17, 17];
    const arr = (a) => bg.map((v, i) => Math.round(v + (ink[i] - v) * a));
    const ramp = (v) => { v = cl(v) * (RAMP.length - 1); const i = Math.min(RAMP.length - 2, Math.floor(v)), f = v - i; return RAMP[i].map((a, k) => Math.round(a + (RAMP[i + 1][k] - a) * f)); };
    C = {
      bg: `rgb(${bg})`, dark: bg[0] + bg[1] + bg[2] < 384, mix: (a, o = 1) => `rgba(${arr(a)},${o})`,
      warm: (v, o = 1) => `rgba(${ramp(v)},${o})`,
      // 0에서 바탕색, 1에서 가장 진한 빛 색 (다크 모드에서도 낮은 값이 바탕에 가라앉게)
      heat: (v, o = 1) => { v = cl(v); if (v < 0.18) { const t = v / 0.18; return `rgba(${bg.map((b, k) => Math.round(b + (RAMP[0][k] - b) * t))},${o})`; } return `rgba(${ramp((v - 0.18) / 0.82)},${o})`; },
      xs: parseFloat(css("--t-xs")) || 10, s: parseFloat(css("--t-s")) || 11, m: parseFloat(css("--t-m")) || 12.5,
      font: getComputedStyle(document.body).fontFamily || "Inter, sans-serif",
    };
  };
  const cl = (x, a = 0, b = 1) => (x < a ? a : x > b ? b : x);
  const lerp = (a, b, t) => a + (b - a) * t;
  const font = (px, w = 400) => `${w} ${px}px ${C.font}`;
  const rnd = (seed) => () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const fmt = (v, d = 0) => v.toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d }).replace("-", "−");
  const sg = (v, d = 0) => (v > 0 ? "+" : v < 0 ? "−" : "±") + Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: d, maximumFractionDigits: d });
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const ML = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  const MD0 = ML.reduce((a, v, i) => (a.push(i ? a[i - 1] + ML[i - 1] : 0), a), []);
  const mOf = (d) => { let m = 11; while (m > 0 && MD0[m] > d) m--; return m; };
  const hhmm = (h) => { const m = Math.round(h * 60); return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
  const COMPASS = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const themed = [];
  document.addEventListener("yp:theme", () => { colors(); themed.forEach((f) => f()); });

  // ── 그리기 도구 ──
  const tx = (g, s, x, y, o = {}) => { g.font = font(o.z || C.xs, o.w || 400); g.fillStyle = o.c || C.mix(o.a == null ? 0.85 : o.a); g.textAlign = o.al || "left"; g.textBaseline = o.bl || "alphabetic"; g.fillText(s, x, y); return g.measureText(s).width; };
  const tw = (g, s, z, w = 400) => { g.font = font(z || C.xs, w); return g.measureText(s).width; };
  const ln = (g, x0, y0, x1, y1, c, w = 1, d) => { g.strokeStyle = c; g.lineWidth = w; if (d) g.setLineDash(d); g.beginPath(); g.moveTo(x0, y0); g.lineTo(x1, y1); g.stroke(); if (d) g.setLineDash([]); };
  const path = (g, pts, close) => { g.beginPath(); pts.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y))); if (close) g.closePath(); };
  const head = (g, s, x, y, o = {}) => tx(g, s, x, y, { z: C.s, w: 600, a: 0.95, ...o });
  // [이름, 값, 굵게?] 줄들: 이름은 왼쪽 회색, 값은 오른쪽 끝 맞춤
  const kv = (g, x, y, w, rows, lh) => { rows.forEach(([k, v, b], i) => { const yy = y + i * lh; tx(g, k, x, yy, { a: 0.55 }); tx(g, v, x + w, yy, { al: "right", w: 600, a: 0.95, z: b ? C.s : C.xs }); }); return y + rows.length * lh; };
  const wrapT = (g, s, x, y, w, lh, o = {}) => { g.font = font(o.z || C.xs, o.w || 400); let line = "", yy = y; s.split(" ").forEach((wd) => { const t = line ? line + " " + wd : wd; if (line && g.measureText(t).width > w) { tx(g, line, x, yy, o); line = wd; yy += lh; } else line = t; }); if (line) tx(g, line, x, yy, o); return yy + lh; };
  const wrapN = (g, s, w, z) => { g.font = font(z || C.xs); let n = 1, line = ""; s.split(" ").forEach((wd) => { const t = line ? line + " " + wd : wd; if (line && g.measureText(t).width > w) { n++; line = wd; } else line = t; }); return n; };
  // 범례: [{t, c, k: "box"|"line"|"dash"|"out"}], 폭을 넘으면 다음 줄로. draw=false면 높이만 재요
  const legend = (g, items, x, y, w, draw = true) => {
    const lh = C.xs * 1.8; let cx = x, cy = y; g.font = font(C.xs);
    items.forEach((it) => {
      const iw = 14 + g.measureText(it.t).width + 14;
      if (cx > x && cx + iw - 14 > x + w) { cx = x; cy += lh; }
      if (draw) {
        const my = cy + lh / 2;
        if (it.k === "line" || it.k === "dash") ln(g, cx, my, cx + 10, my, it.c, it.lw || 1.2, it.k === "dash" ? [3, 2] : null);
        else { g.fillStyle = it.c; g.fillRect(cx, my - 4, 10, 8); if (it.k === "out") { g.strokeStyle = C.mix(0.55); g.lineWidth = 0.7; g.strokeRect(cx + 0.35, my - 3.65, 9.3, 7.3); } }
        tx(g, it.t, cx + 14, my, { bl: "middle", a: 0.7 });
      }
      cx += iw;
    });
    return cy - y + lh;
  };
  const loading = (g, W, H) => { tx(g, "Loading the weather year …", W / 2, H / 2, { al: "center", bl: "middle", a: 0.45 }); return false; };

  // ── 무대 · 조절 막대 ──
  const stage = (el, draw, opt = {}) => {
    const cv = document.createElement("canvas"), g = cv.getContext("2d");
    cv.className = "mv-cv"; el.appendChild(cv);
    let W = 0, H = 0, live = false, raf = 0, t0 = performance.now(), hover = null;
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = el.clientWidth; H = el.clientHeight; cv.width = Math.round(W * d); cv.height = Math.round(H * d); g.setTransform(d, 0, 0, d, 0, 0); };
    const loop = (now) => { raf = 0; if (!W) size(); g.clearRect(0, 0, W, H); const more = draw(g, W, H, (now - t0) / 1000, hover); if (live && more !== false) raf = requestAnimationFrame(loop); };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    new ResizeObserver(() => { size(); kick(); }).observe(el);
    new IntersectionObserver(([e]) => { live = e.isIntersecting; if (live) kick(); }).observe(el);
    if (opt.hover) {
      const at = (e) => { const r = cv.getBoundingClientRect(); hover = { x: e.clientX - r.left, y: e.clientY - r.top, down: e.buttons > 0 || e.pointerType === "touch" }; kick(); };
      cv.addEventListener("pointermove", at); cv.addEventListener("pointerdown", at);
      cv.addEventListener("pointerleave", () => { hover = null; kick(); });
    }
    themed.push(kick);
    return { cv, kick };
  };
  const ui = (el, html) => { el.insertAdjacentHTML("beforeend", `<div class="mv-ui">${html}</div>`); return el.querySelector(".mv-ui"); };
  const uiTop = (el) => { const u = el.querySelector(".mv-ui"); return u ? u.offsetHeight + Math.round(C.xs * 2) : 0; };
  const group = (U, sel, cb) => { const bs = [...U.querySelectorAll(sel)]; bs.forEach((b) => b.addEventListener("click", () => { bs.forEach((x) => x.classList.toggle("on", x === b)); cb(b); })); };
  const rg = (name, k, min, max, step, val, label) => `<label class="mv-rg" data-r="${name}"><span class="mv-k">${k}</span><input type="range" min="${min}" max="${max}" step="${step}" value="${val}" aria-label="${label || k}"><b></b></label>`;
  const range = (U, name, show, cb) => { const L = U.querySelector(`[data-r="${name}"]`), i = L.querySelector("input"), b = L.querySelector("b"); const f = () => { const v = +i.value; b.textContent = show(v); cb(v); }; i.addEventListener("input", f); b.textContent = show(+i.value); return { set: (v) => { i.value = v; b.textContent = show(+i.value); }, el: i }; };
  // 그림 비율: 넓은 화면 rD, 좁은 화면 rM (글자가 겹치지 않게 모바일은 세로로 길게)
  const fit = (el, rD, rM) => { const m = el.closest(".media"); if (!m) return; const box = m.parentElement || m; const f = () => { const r = box.clientWidth >= 700 ? rD : rM; if (m.dataset.lr !== String(r)) { m.dataset.lr = r; m.style.aspectRatio = String(r); m.style.setProperty("--r", r); } }; f(); new ResizeObserver(f).observe(box); };

  // ── 기상 자료 (필요할 때 한 번만 불러요) ──
  const SRC = "assets/img/luminous-abode/sim.json";
  let DATA = null, pend = null;
  const need = (cb) => { if (DATA) return cb(); if (!pend) { pend = []; fetch(SRC).then((r) => r.json()).then((d) => { d.t = Float32Array.from(d.T, (v) => v / 10); DATA = d; pend.forEach((f) => f()); }).catch(() => {}); } pend.push(cb); };

  // ── 해의 위치 (북위 37.3°, 태양시) ──
  const RAD = Math.PI / 180, LAT = 37.3;
  const N21 = MD0.map((d) => d + 20); // 매달 21일
  const decl = (n) => 23.45 * Math.sin(RAD * (360 * (284 + n + 1)) / 365);
  const sun = (dec, h) => {
    const p = LAT * RAD, d = dec * RAD, H = (h - 12) * 15 * RAD;
    const sa = Math.sin(p) * Math.sin(d) + Math.cos(p) * Math.cos(d) * Math.cos(H), alt = Math.asin(cl(sa, -1, 1));
    let az = Math.acos(cl((Math.sin(d) - sa * Math.sin(p)) / (Math.cos(alt) * Math.cos(p) || 1e-9), -1, 1)) / RAD;
    if (H > 0) az = 360 - az;
    return { alt: alt / RAD, az };
  };
  const dayLen = (dec) => { const c = -Math.tan(LAT * RAD) * Math.tan(dec * RAD); return c <= -1 ? 24 : c >= 1 ? 0 : (2 * Math.acos(c)) / RAD / 15; };

  // ════════ 1. 기후 (LA-02) ════════
  const ZN = { h: "Active heating", s: "Passive solar gain", i: "Internal gains", c: "Comfort", v: "Natural ventilation", d: "Dehumidify · cool" };
  const ZA = { h: 0.7, s: 0.5, i: 0.35, c: 0.05, v: 0.2, d: 0.92 }; // 시트 LA-02와 같은 여섯 단계 회색
  const ZK = ["h", "s", "i", "c", "v", "d"];
  const tA = (T) => 0.04 + 0.86 * cl((T + 12) / 45);
  const climate = (el) => {
    fit(el, 2.05, 0.5);
    const U = ui(el, `<button type="button" data-v="t" class="on">Temperature</button><button type="button" data-v="z">Strategy</button><span class="sep"></span><button type="button" data-play${reduce ? "" : ' class="on"'}>Play</button>`);
    let view = "t", play = !reduce, day = 15, hour = 14, last = null, img = null, key = "", sh = null, shM = null, wmax = 0;
    const kick = () => st && st.kick();
    group(U, "[data-v]", (b) => { view = b.dataset.v; kick(); });
    const pb = U.querySelector("[data-play]");
    pb.addEventListener("click", () => { play = !play; pb.classList.toggle("on", play); last = null; kick(); });
    const bake = () => {
      const D = DATA, c = document.createElement("canvas"); c.width = 365; c.height = 24; const x = c.getContext("2d");
      for (let i = 0; i < 8760; i++) { x.fillStyle = view === "t" ? C.mix(tA(D.t[i])) : C.mix(ZA[D.Z[i]]); x.fillRect((i / 24) | 0, i % 24, 1, 1); }
      img = c; key = view + C.bg;
      if (!sh) { sh = {}; ZK.forEach((k) => (sh[k] = 0)); for (const z of D.Z) sh[z]++; ZK.forEach((k) => (sh[k] = (sh[k] / 8760) * 100));
        shM = MON.map((_, m) => { const o = {}; ZK.forEach((k) => (o[k] = 0)); for (let i = MD0[m] * 24; i < (MD0[m] + ML[m]) * 24; i++) o[D.Z[i]]++; ZK.forEach((k) => (o[k] = (o[k] / (ML[m] * 24)) * 100)); return o; });
        wmax = Math.max(...D.rose.flat()); }
    };
    const st = stage(el, (g, W, H, t, hv) => {
      if (!DATA) return loading(g, W, H);
      const D = DATA; if (key !== view + C.bg) bake();
      const dt = last == null ? 0 : Math.min(0.1, t - last); last = t;
      const top = uiTop(el), wide = W >= 700, ax = C.xs * 2.6, lh = C.xs * 1.75;
      const legI = view === "t" ? [{ t: "−12 °C", c: C.mix(tA(-12)), k: "out" }, { t: "0 °C", c: C.mix(tA(0)) }, { t: "10 °C", c: C.mix(tA(10)) }, { t: "20 °C", c: C.mix(tA(20)) }, { t: "33 °C", c: C.mix(tA(33)) }]
        : ZK.map((k) => ({ t: `${ZN[k]} ${Math.round(sh[k])} %`, c: C.mix(ZA[k]), k: k === "c" ? "out" : "box" }));
      const M = { x: ax, y: top, w: (wide ? W * 0.6 : W) - ax };
      const legH = legend(g, legI, M.x, 0, M.w, false);
      M.h = wide ? H - top - C.xs * 2.6 - legH - 4 : Math.round((H - top) * 0.24);
      if (hv && hv.x >= M.x && hv.x <= M.x + M.w && hv.y >= M.y && hv.y <= M.y + M.h) {
        day = cl(Math.floor(((hv.x - M.x) / M.w) * 365), 0, 364); hour = cl(Math.floor(((hv.y - M.y) / M.h) * 24), 0, 23);
        if (play) { play = false; pb.classList.remove("on"); }
      } else if (play) day = (day + dt * 9) % 365;
      const di = Math.floor(day), mi = mOf(di);
      // 히트맵 (가로 365일 × 세로 24시)
      g.imageSmoothingEnabled = false; g.drawImage(img, M.x, M.y, M.w, M.h); g.imageSmoothingEnabled = true;
      g.strokeStyle = C.mix(0.45); g.lineWidth = 0.6; g.strokeRect(M.x + 0.3, M.y + 0.3, M.w - 0.6, M.h - 0.6);
      [0, 6, 12, 18, 24].forEach((h) => tx(g, String(h).padStart(2, "0"), M.x - 5, M.y + (M.h * h) / 24, { al: "right", bl: h === 0 ? "top" : h === 24 ? "bottom" : "middle", a: 0.5 }));
      MON.forEach((m, k) => { const x = M.x + (M.w * MD0[k]) / 365; if (k) ln(g, x, M.y + M.h, x, M.y + M.h + 4, C.mix(0.4), 0.6); tx(g, m, M.x + (M.w * (MD0[k] + ML[k] / 2)) / 365, M.y + M.h + C.xs * 1.5, { al: "center", a: k === mi ? 0.95 : 0.5, w: k === mi ? 600 : 400 }); });
      const cx = M.x + (M.w * (di + 0.5)) / 365, cy = M.y + (M.h * (hour + 0.5)) / 24;
      ln(g, cx, M.y - 3, cx, M.y + M.h + 3, C.bg, 3); ln(g, cx, M.y - 3, cx, M.y + M.h + 3, C.mix(0.95), 1);
      g.fillStyle = C.bg; g.beginPath(); g.arc(cx, cy, 3.5, 0, 7); g.fill(); g.strokeStyle = C.mix(0.95); g.lineWidth = 1; g.stroke();
      legend(g, legI, M.x, M.y + M.h + C.xs * 2.4, M.w, true);
      // 오른쪽(넓은 화면) 또는 아래(좁은 화면): 그날
      const P = wide ? { x: W * 0.655, y: top, w: W * 0.345 } : { x: 0, y: M.y + M.h + C.xs * 2.4 + legH + C.xs * 1.6, w: W };
      const i0 = di * 24, Th = D.t[i0 + hour], RH = D.RH[i0 + hour], zc = D.Z[i0 + hour];
      let y = P.y + C.s;
      head(g, `${di - MD0[mi] + 1} ${MON[mi]} · ${String(hour).padStart(2, "0")}:00`, P.x, y);
      tx(g, `${fmt(Th, 1)} °C · RH ${RH} % · ${ZN[zc]}`, P.x, y + C.xs * 1.7, { a: 0.6 });
      // 하루 곡선
      const CB = { x: P.x + ax, y: y + C.xs * 4.8, w: P.w - ax - C.xs * 3.2, h: wide ? (H - P.y) * 0.34 : (H - P.y) * 0.3 };
      const Y = (v) => CB.y + CB.h - ((v + 15) / 50) * CB.h, X = (h) => CB.x + (h / 23) * CB.w, YR = (r) => CB.y + CB.h - (r / 100) * CB.h;
      g.fillStyle = C.mix(0.07); g.fillRect(CB.x, Y(26), CB.w, Y(20) - Y(26));
      [-10, 0, 10, 20, 30].forEach((v) => { ln(g, CB.x, Y(v), CB.x + CB.w, Y(v), C.mix(v === 0 ? 0.3 : 0.1), 0.6); tx(g, `${v}`, CB.x - 5, Y(v), { al: "right", bl: "middle", a: 0.5 }); });
      [0, 50, 100].forEach((r) => tx(g, `${r}`, CB.x + CB.w + 5, YR(r), { bl: "middle", a: 0.4 }));
      tx(g, "°C", CB.x - 5, CB.y - C.xs * 0.9, { al: "right", a: 0.5 }); tx(g, "RH %", CB.x + CB.w + 5, CB.y - C.xs * 0.9, { a: 0.4 });
      [0, 6, 12, 18, 23].forEach((h) => tx(g, String(h).padStart(2, "0"), X(h), CB.y + CB.h + 14 + C.xs * 0.9, { al: "center", bl: "top", a: 0.5 }));
      // 전략 띠 (그날 24시간)
      for (let h = 0; h < 24; h++) { g.fillStyle = C.mix(ZA[D.Z[i0 + h]]); g.fillRect(X(h) - CB.w / 46, CB.y + CB.h + 6, CB.w / 23 + 0.5, 6); }
      g.strokeStyle = C.mix(0.4); g.lineWidth = 0.5; g.strokeRect(X(0) - CB.w / 46, CB.y + CB.h + 6, CB.w + CB.w / 23, 6);
      g.setLineDash([3, 2]); g.strokeStyle = C.mix(0.45); g.lineWidth = 1; path(g, [...Array(24)].map((_, h) => [X(h), YR(D.RH[i0 + h])])); g.stroke(); g.setLineDash([]);
      g.strokeStyle = C.mix(0.95); g.lineWidth = 1.4; path(g, [...Array(24)].map((_, h) => [X(h), Y(D.t[i0 + h])])); g.stroke();
      ln(g, X(hour), CB.y, X(hour), CB.y + CB.h, C.mix(0.35), 0.6, [2, 2]);
      g.fillStyle = C.mix(0.95); g.beginPath(); g.arc(X(hour), Y(Th), 3, 0, 7); g.fill();
      y = CB.y + CB.h + 14 + C.xs * 2.4;
      y += legend(g, [{ t: "air temperature", c: C.mix(0.95), k: "line" }, { t: "relative humidity", c: C.mix(0.45), k: "dash" }, { t: "comfort 20–26 °C", c: C.mix(0.07), k: "out" }], P.x + ax, y, P.w - ax) + C.xs * 1.2;
      // 그달 바람장미
      const room = H - y - 4, R = Math.max(30, Math.min(wide ? P.w * 0.24 : P.w * 0.22, (room - C.xs * 3.4) / 2));
      const rx = P.x + C.xs * 1.6 + R, ry = y + C.xs * 1.6 + R, r0 = R * 0.12, rose = D.rose[mi];
      [5, 10, 15, 20, 25].filter((p) => p <= Math.ceil(wmax / 5) * 5).forEach((p) => { g.strokeStyle = C.mix(0.12); g.lineWidth = 0.6; g.beginPath(); g.arc(rx, ry, r0 + ((R - r0) * p) / (Math.ceil(wmax / 5) * 5), 0, 7); g.stroke(); });
      rose.forEach((p, k) => { const a0 = (k * 22.5 - 9 - 90) * RAD, a1 = (k * 22.5 + 9 - 90) * RAD, rr = r0 + ((R - r0) * p) / (Math.ceil(wmax / 5) * 5); g.fillStyle = C.mix(0.62); g.beginPath(); g.arc(rx, ry, rr, a0, a1); g.arc(rx, ry, r0, a1, a0, true); g.closePath(); g.fill(); });
      g.strokeStyle = C.mix(0.45); g.lineWidth = 0.6; g.beginPath(); g.arc(rx, ry, r0, 0, 7); g.stroke();
      [["N", 0], ["E", 90], ["S", 180], ["W", 270]].forEach(([s, a]) => tx(g, s, rx + Math.sin(a * RAD) * (R + C.xs * 0.9), ry - Math.cos(a * RAD) * (R + C.xs * 0.9), { al: "center", bl: "middle", a: 0.6, w: s === "N" ? 600 : 400 }));
      const pk = rose.indexOf(Math.max(...rose)), rxT = rx + R + C.xs * 2.6, rwT = P.x + P.w - rxT;
      let yy = y + C.xs * 1.2;
      head(g, `Wind · ${MON[mi]}`, rxT, yy); yy += C.xs * 1.9;
      yy = kv(g, rxT, yy, rwT, [["mostly from", COMPASS[pk]], ["mean speed", `${fmt(D.ws[mi], 1)} m/s`], ["calm hours", `${fmt(D.calm[mi], 1)} %`], ["rings", "every 5 % of hours"]], lh) + C.xs * 0.8;
      head(g, `Strategy · ${MON[mi]}`, rxT, yy); yy += C.xs * 1.0;
      const sb = rwT; let sx = rxT; ZK.forEach((k) => { const w = (sb * shM[mi][k]) / 100; g.fillStyle = C.mix(ZA[k]); g.fillRect(sx, yy, w, 7); sx += w; }); g.strokeStyle = C.mix(0.45); g.lineWidth = 0.5; g.strokeRect(rxT, yy, sb, 7);
      yy += 7 + C.xs * 1.6;
      ZK.filter((k) => shM[mi][k] >= 0.5).sort((a, b) => shM[mi][b] - shM[mi][a]).slice(0, Math.max(1, Math.floor((H - yy) / lh))).forEach((k, i) => { tx(g, ZN[k], rxT, yy + i * lh, { a: 0.55 }); tx(g, `${Math.round(shM[mi][k])} %`, rxT + rwT, yy + i * lh, { al: "right", w: 600, a: 0.95 }); });
      return play || !!hv;
    }, { hover: true });
    need(kick);
  };

  // ════════ 2. 클러스터 그림자 (LA-04) ════════
  const HB = [{ x0: -1.32, x1: 10.31, y0: -1.34, y1: 10.27, z: 6.95 }, { x0: 1.45, x1: 7.55, y0: 1.45, y1: 7.55, z: 8.25 }]; // 처마 상자 + 랜턴
  const homes = (s) => [...[0, 1, 2, 3, 4].map((i) => ({ x: 20 * i, y: 20, n: `N${i + 1}` })), ...[0, 1, 2, 3, 4].map((i) => ({ x: 10 * s + 20 * i, y: 0, n: `S${i + 1}` }))];
  const blocked = (px, py, pz, ux, uy, k, hs, me) => {
    for (const h of hs) { if (h === me) continue;
      for (const b of HB) {
        let t0 = 0, t1 = 1e9; const X0 = h.x + b.x0, X1 = h.x + b.x1, Y0 = h.y + b.y0, Y1 = h.y + b.y1;
        if (Math.abs(ux) < 1e-9) { if (px < X0 || px > X1) continue; } else { let a = (X0 - px) / ux, c = (X1 - px) / ux; if (a > c) [a, c] = [c, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, c); }
        if (Math.abs(uy) < 1e-9) { if (py < Y0 || py > Y1) continue; } else { let a = (Y0 - py) / uy, c = (Y1 - py) / uy; if (a > c) [a, c] = [c, a]; t0 = Math.max(t0, a); t1 = Math.min(t1, c); }
        if (t0 <= t1 && pz + k * t0 < b.z) return true;
      } }
    return false;
  };
  const FZ = [0.6, 1.4, 2.2, 4.0, 4.9, 5.8];
  const facade = (h, hs, s) => { // 남쪽 면 10칸 × 6높이 중 해가 닿는 비율
    const none = { f: 0, f1: 0, f2: 0, col: Array(10).fill(0) };
    if (s.alt <= 0.5) return none;
    const ux = Math.sin(s.az * RAD), uy = Math.cos(s.az * RAD), k = Math.tan(s.alt * RAD);
    if (uy >= -0.02) return none;
    const col = []; let n1 = 0, n2 = 0;
    for (let i = 0; i < 10; i++) { let c = 0; const px = h.x + 0.45 + 0.9 * i, py = h.y - 0.27; FZ.forEach((z, j) => { if (!blocked(px, py, z, ux, uy, k, hs, h)) { c++; if (j < 3) n1++; else n2++; } }); col.push(c / FZ.length); }
    return { f: (n1 + n2) / 60, f1: n1 / 30, f2: n2 / 30, col };
  };
  const hull = (pts) => { pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]); const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]); const lo = [], up = []; for (const p of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); } for (let i = pts.length - 1; i >= 0; i--) { const p = pts[i]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); } up.pop(); lo.pop(); return lo.concat(up); };
  const cluster = (el) => {
    fit(el, 2.8, 0.7);
    const U = ui(el, `${rg("m", "date", 0, 11, 1, 11, "Month, 21st day")}${rg("h", "solar time", 6, 18, 0.25, 12, "Solar time")}<span class="sep"></span><button type="button" data-m="1" class="on">Staggered</button><button type="button" data-m="0">Aligned</button><span class="sep"></span><button type="button" data-play>Play</button>`);
    let mon = 11, hr = 12, mode = 1, shift = 1, play = false, last = null, cache = {};
    const kick = () => st && st.kick();
    range(U, "m", (v) => `21 ${MON[v]}`, (v) => { mon = v; kick(); });
    const hR = range(U, "h", (v) => hhmm(v), (v) => { hr = v; if (play) { play = false; pb.classList.remove("on"); } kick(); });
    group(U, "[data-m]", (b) => { mode = +b.dataset.m; kick(); });
    const pb = U.querySelector("[data-play]");
    pb.addEventListener("click", () => { play = !play; pb.classList.toggle("on", play); last = null; kick(); });
    // 하루 동안 북쪽 줄 남쪽 벽에 닿는 직달 일사 (맑은 날 Meinel 모델로 가중), 그늘이 없을 때 = 100 %
    const daily = (m, s) => { const k = m + "|" + s; if (cache[k]) return cache[k]; const dec = decl(N21[m]), L = dayLen(dec), hs = homes(s); let e1 = 0, e2 = 0, e0 = 0;
      for (let h = 12 - L / 2; h <= 12 + L / 2; h += 0.25) { const p = sun(dec, h); if (p.alt <= 0.5) continue; const c = Math.cos(p.alt * RAD) * Math.cos((p.az - 180) * RAD); if (c <= 0) continue; const w = 1353 * 0.7 ** ((1 / Math.sin(p.alt * RAD)) ** 0.678) * c; e0 += w * 5; hs.slice(0, 5).forEach((o) => { const r = facade(o, hs, p); e1 += r.f1 * w; e2 += r.f2 * w; }); }
      return (cache[k] = { f1: e0 ? (e1 / e0) * 100 : 0, f2: e0 ? (e2 / e0) * 100 : 0 }); };
    const st = stage(el, (g, W, H, t) => {
      const dt = last == null ? 0 : Math.min(0.1, t - last); last = t;
      const dec = decl(N21[mon]), L = dayLen(dec), sr = 12 - L / 2, ss = 12 + L / 2;
      if (play) { hr += dt * 1.2; if (hr > Math.min(18, ss)) hr = Math.max(6, sr); hR.set(Math.round(hr * 4) / 4); }
      shift += (mode - shift) * Math.min(1, dt * 5 || 1); if (Math.abs(mode - shift) < 0.002) shift = mode;
      const s = sun(dec, hr), hs = homes(shift), top = uiTop(el), wide = W >= 700;
      // 배치도 상자
      const B = wide ? { x: 0, y: top, w: W * 0.66, h: H - top } : { x: 0, y: top, w: W, h: Math.min((H - top) * 0.42, W * 0.42) };
      const X0 = -5, X1 = 105, Y0 = -8, Y1 = 34, sc = Math.min(B.w / (X1 - X0), (B.h - C.xs * 3) / (Y1 - Y0));
      const ox = B.x + (B.w - (X1 - X0) * sc) / 2 - X0 * sc, oy = B.y + (B.h - C.xs * 3 + (Y1 - Y0) * sc) / 2 + Y0 * sc;
      const P = (x, y) => [ox + x * sc, oy - y * sc];
      g.save(); g.beginPath(); g.rect(ox + X0 * sc, oy - Y1 * sc, (X1 - X0) * sc, (Y1 - Y0) * sc); g.clip();
      g.fillStyle = C.mix(0.035); g.fillRect(ox + X0 * sc, oy - Y1 * sc, (X1 - X0) * sc, (Y1 - Y0) * sc);
      // 데크
      hs.forEach((h) => { const a = P(h.x - 3.1, h.y + 9.97), b = P(h.x + 12.1, h.y - 3.28); g.fillStyle = C.bg; g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); g.strokeStyle = C.mix(0.3); g.lineWidth = 0.6; g.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); });
      // 그림자 (겹쳐도 한 번만 어둡게)
      if (s.alt > 0.5) {
        const k = 1 / Math.tan(s.alt * RAD), dx = -Math.sin(s.az * RAD) * k, dy = -Math.cos(s.az * RAD) * k;
        g.beginPath();
        hs.forEach((h) => { const pts = []; [[-0.25, -0.25], [9.25, -0.25], [9.25, 9.25], [-0.25, 9.25]].forEach(([x, y]) => pts.push([h.x + x, h.y + y])); [[-1.32, -1.34], [10.31, -1.34], [10.31, 10.27], [-1.32, 10.27]].forEach(([x, y]) => pts.push([h.x + x + dx * 6.95, h.y + y + dy * 6.95])); [[1.45, 1.45], [7.55, 1.45], [7.55, 7.55], [1.45, 7.55]].forEach(([x, y]) => pts.push([h.x + x + dx * 8.25, h.y + y + dy * 8.25])); hull(pts).forEach(([x, y], i) => { const q = P(x, y); i ? g.lineTo(q[0], q[1]) : g.moveTo(q[0], q[1]); }); g.closePath(); });
        g.fillStyle = C.mix(0.2); g.fill("nonzero");
      }
      // 집 (지붕 평면)
      const now = hs.slice(0, 5).map((h) => facade(h, hs, s));
      hs.forEach((h, j) => {
        const e = [[-1.32, -1.34], [10.31, -1.34], [10.31, 10.27], [-1.32, 10.27]].map(([x, y]) => P(h.x + x, h.y + y)), c = [[1.45, 1.45], [7.55, 1.45], [7.55, 7.55], [1.45, 7.55]].map(([x, y]) => P(h.x + x, h.y + y));
        path(g, e, true); g.fillStyle = C.bg; g.fill(); g.strokeStyle = C.mix(0.85); g.lineWidth = 1; g.stroke();
        e.forEach((p, i) => ln(g, p[0], p[1], c[i][0], c[i][1], C.mix(0.45), 0.6));
        path(g, c, true); g.strokeStyle = C.mix(0.6); g.lineWidth = 0.6; g.stroke();
        const m = P(h.x + 4.5, h.y + 4.5); tx(g, h.n, m[0], m[1], { al: "center", bl: "middle", a: 0.7, w: 600 });
        if (j < 5) { // 북쪽 줄 남쪽 면: 칸마다 해 닿는 정도
          now[j].col.forEach((v, i) => { const a = P(h.x + 0.9 * i, h.y - 1.8), b = P(h.x + 0.9 * (i + 1), h.y - 1.8); g.strokeStyle = v > 0 ? C.warm(0.25 + 0.6 * v) : C.mix(0.3); g.lineWidth = Math.max(2.5, sc * 0.55); g.beginPath(); g.moveTo(a[0] + 0.5, a[1]); g.lineTo(b[0] - 0.5, b[1]); g.stroke(); });
        }
      });
      g.restore();
      // 방위 · 해 · 축척
      const nx = ox + X1 * sc - 18, ny = oy - Y1 * sc + 20;
      g.strokeStyle = C.mix(0.5); g.lineWidth = 0.6; g.beginPath(); g.arc(nx, ny, 12, 0, 7); g.stroke(); tx(g, "N", nx, ny - 15, { al: "center", bl: "bottom", w: 600, a: 0.8 });
      if (s.alt > 0) { const sx = nx + Math.sin(s.az * RAD) * 12, sy = ny - Math.cos(s.az * RAD) * 12; ln(g, nx, ny, sx, sy, C.warm(0.8), 1); g.fillStyle = C.warm(0.75); g.beginPath(); g.arc(sx, sy, 3.2, 0, 7); g.fill(); }
      const sb0 = ox + X0 * sc + 8, sby = oy - Y0 * sc + C.xs * 1.4;
      ln(g, sb0, sby, sb0 + 20 * sc, sby, C.mix(0.8), 1); [0, 10, 20].forEach((m) => { ln(g, sb0 + m * sc, sby - 3, sb0 + m * sc, sby + 3, C.mix(0.8), 0.8); tx(g, m === 20 ? "20 m" : `${m}`, sb0 + m * sc, sby + 4, { al: "center", bl: "top", a: 0.55 }); });
      // 읽기 값
      const R = wide ? { x: W * 0.7, y: top + C.s, w: W * 0.3 } : { x: 0, y: B.y + B.h + C.xs * 1.4, w: W };
      const lh = C.xs * 1.85, dayN = daily(mon, 1), dayA = daily(mon, 0);
      let y = R.y; head(g, `21 ${MON[mon]} · ${hhmm(Math.round(hr * 4) / 4)} solar time`, R.x, y); y += C.xs * 2;
      const colW = wide ? R.w : (R.w - 16) / 2;
      const y1 = kv(g, R.x, y, colW, [["sun altitude", s.alt > 0 ? `${fmt(s.alt, 1)}°` : "below horizon"], ["azimuth", s.alt > 0 ? `${fmt(s.az, 0)}° · ${COMPASS[Math.round(s.az / 22.5) % 16]}` : "—"], ["shadow / height", s.alt > 0.5 ? `${fmt(1 / Math.tan(s.alt * RAD), 2)} ×` : "—"]], lh);
      let y2 = wide ? y1 + C.xs : y; const bx = wide ? R.x : R.x + colW + 16;
      tx(g, "North row, 1F south wall in sun now", bx, y2, { a: 0.55 }); y2 += C.xs * 0.9;
      const bw = colW, gap = 4, cw = (bw - gap * 4) / 5;
      now.forEach((v, i) => { const x = bx + i * (cw + gap), hh = C.xs * 3.2; g.fillStyle = C.mix(0.08); g.fillRect(x, y2, cw, hh); g.fillStyle = C.warm(0.6); g.fillRect(x, y2 + hh * (1 - v.f1), cw, hh * v.f1); tx(g, `N${i + 1}`, x + cw / 2, y2 + hh + 3, { al: "center", bl: "top", a: 0.55 }); tx(g, `${Math.round(v.f1 * 100)}`, x + cw / 2, y2 + hh + 3 + C.xs * 1.3, { al: "center", bl: "top", a: 0.95, w: 600 }); });
      y2 += C.xs * 3.2 + C.xs * 3.2 + C.xs * 0.6; tx(g, "% of the wall", bx + bw, y2 - C.xs * 0.2, { al: "right", a: 0.45 });
      let y3 = Math.max(y1, y2) + C.xs * 1.6;
      head(g, `Direct sun on the north row, 21 ${MON[mon]}`, R.x, y3); y3 += C.xs * 1.1;
      const lx = tw(g, "2F staggered", C.xs, 600) + 12, bww = R.w - lx - tw(g, "100 %", C.xs, 600) - 10;
      [["1F staggered", dayN.f1, 1], ["1F aligned", dayA.f1, 0], ["2F staggered", dayN.f2, 1], ["2F aligned", dayA.f2, 0]].forEach(([n, v, m], i) => { const yy = y3 + i * C.xs * 1.9 + (i > 1 ? C.xs * 0.6 : 0), on2 = m === mode; tx(g, n, R.x, yy + C.xs * 0.95, { a: on2 ? 0.95 : 0.5, w: on2 ? 600 : 400 }); g.fillStyle = C.mix(0.07); g.fillRect(R.x + lx, yy, bww, C.xs * 1.1); g.fillStyle = on2 ? C.warm(0.62) : C.mix(0.35); g.fillRect(R.x + lx, yy, (bww * v) / 100, C.xs * 1.1); tx(g, `${Math.round(v)} %`, R.x + R.w, yy + C.xs * 0.95, { al: "right", w: 600, a: 0.95 }); });
      y3 += C.xs * 8.6;
      if (wide || H - y3 > C.xs * 4) wrapT(g, "Clear-day beam sun on the south walls, % of an unshaded wall. Each house is read as its eave box and lantern; the staggered row lets the noon sun through its 10 m gaps.", R.x, y3, R.w, C.xs * 1.5, { a: 0.5 });
      return play || shift !== mode;
    });
  };

  // ════════ 3. 부력 (LA-06) ════════
  const LOADS = [["p", "6 people home", 0.42], ["w", "Tank full 5 m³", 5.0], ["s", "Snow 0.5 kN/m²", 6.9], ["l", "Full live load 2 kN/m²", 33.0]];
  const MMT = 1000 / 72.25; // 1 t당 mm
  const float = (el) => {
    fit(el, 2.3, 0.66);
    const U = ui(el, `<span class="mv-k">add</span>${LOADS.map(([k, n]) => `<button type="button" data-k="${k}">${n}</button>`).join("")}<span class="sep"></span><button type="button" data-b>Trim ballast</button>`);
    const on = {}; let trim = false, dn = 0, last = null;
    const kick = () => st && st.kick();
    U.querySelectorAll("[data-k]").forEach((b) => b.addEventListener("click", () => { on[b.dataset.k] = !on[b.dataset.k]; b.classList.toggle("on", on[b.dataset.k]); kick(); }));
    const bb = U.querySelector("[data-b]"); bb.addEventListener("click", () => { trim = !trim; bb.classList.toggle("on", trim); kick(); });
    const st = stage(el, (g, W, H, t) => {
      const dt = last == null ? 1 : Math.min(0.1, t - last); last = t;
      const add = LOADS.reduce((a, [k, , v]) => a + (on[k] ? v : 0), 0), target = trim ? 0 : add * MMT;
      dn += (target - dn) * Math.min(1, dt * 4); if (Math.abs(target - dn) < 0.2) dn = target;
      const top = uiTop(el), wide = W >= 700, lh = C.xs * 1.85;
      const S = wide ? { x: 0, y: top, w: W * 0.42, h: H - top } : { x: 0, y: top, w: W, h: (H - top) * 0.42 };
      const G = wide ? { x: W * 0.44, y: top + C.s, w: W * 0.2, h: H - top - C.s * 3 } : { x: 0, y: S.y + S.h + C.s * 1.6, w: W * 0.47, h: (H - top) * 0.33 };
      // 단면 (m): 왼쪽 레벨 글자 자리만큼 넓혀서 그림과 겹치지 않게
      const LV = wide ? [[6.95, "+6,950 eave"], [3.4, "+3,400 2F"], [0.15, "FL ±0"]] : [[6.95, "+6,950"], [3.4, "+3,400"], [0.15, "FL ±0"]];
      const Lw = Math.max(...LV.map(([, s]) => tw(g, s))) + 8, xb = 12.4, za = -4.6, zb = 8.9;
      let xa = -3.4, sc = 1; for (let i = 0; i < 4; i++) { sc = Math.min(S.w / (xb - xa), (S.h - 8) / (zb - za)); xa = Math.min(-3.4, -1.6 - Lw / sc); }
      const ox = S.x + (S.w - (xb - xa) * sc) / 2 - xa * sc, oy = S.y + 4 + zb * sc, P = (x, z) => [ox + x * sc, oy - z * sc];
      const wl = -0.36 + dn / 1000;
      // 물
      const [wx0, wy] = P(xa, wl), [wx1] = P(xb, wl), [, by] = P(0, za + 0.5);
      g.fillStyle = C.mix(0.06); g.fillRect(wx0, wy, wx1 - wx0, by - wy);
      g.strokeStyle = C.mix(0.6); g.lineWidth = 0.8; g.beginPath(); for (let x = wx0; x <= wx1; x += 2) { const yy = wy + Math.sin(x * 0.12 + t * 2.4) * (reduce ? 0 : 0.8); x === wx0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke();
      // 저수지 바닥
      ln(g, wx0, by, wx1, by, C.mix(0.7), 1); g.save(); g.beginPath(); g.rect(wx0, by, wx1 - wx0, 6); g.clip(); for (let x = wx0; x < wx1 + 6; x += 7) ln(g, x, by, x - 5, by + 5, C.mix(0.35), 0.5); g.restore();
      // 가이드 파일
      [-0.55, 9.55].forEach((x) => { const a = P(x - 0.15, 1.1), b = P(x + 0.15, za + 0.5); g.fillStyle = C.mix(0.55); g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); const r = P(x, -0.3); g.strokeStyle = C.mix(0.95); g.lineWidth = 1.6; g.strokeRect(r[0] - 0.35 * sc, r[1] - 2, 0.7 * sc, 4); });
      // 헐
      const h0 = P(0.25, -0.3), h1 = P(8.75, -2.7);
      g.fillStyle = C.mix(0.22); g.fillRect(h0[0], h0[1], h1[0] - h0[0], h1[1] - h0[1]); g.strokeStyle = C.mix(0.9); g.lineWidth = 1; g.strokeRect(h0[0], h0[1], h1[0] - h0[0], h1[1] - h0[1]);
      g.save(); g.beginPath(); g.rect(h0[0], h0[1], h1[0] - h0[0], h1[1] - h0[1]); g.clip(); for (let x = h0[0] - 60; x < h1[0]; x += 6) ln(g, x, h1[1], x + (h1[1] - h0[1]), h0[1], C.mix(0.3), 0.4); g.restore();
      // 데크 · 집
      [[-3.1, -0.25], [9.25, 12.1]].forEach(([a, b]) => { const p = P(a, -0.3), q = P(b, -0.5); g.fillStyle = C.mix(0.45); g.fillRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); });
      const f0 = P(-0.25, 0), f1 = P(9.25, -0.3); g.fillStyle = C.mix(0.7); g.fillRect(f0[0], f0[1], f1[0] - f0[0], f1[1] - f0[1]);
      g.strokeStyle = C.mix(0.9); g.lineWidth = 1; path(g, [P(-0.25, 0), P(-0.25, 6.95), P(9.25, 6.95), P(9.25, 0)]); g.stroke();
      ln(g, ...P(-0.25, 3.4), ...P(9.25, 3.4), C.mix(0.8), 1.4);
      g.strokeStyle = C.mix(0.9); g.lineWidth = 1; path(g, [P(-1.32, 6.95), P(1.45, 7.95), P(1.45, 8.25), P(7.55, 8.25), P(7.55, 7.95), P(10.31, 6.95)]); g.stroke();
      // 부력 화살표
      const aw = (x, z0, z1) => { const a = P(x, z0), b = P(x, z1); ln(g, a[0], a[1], b[0], b[1], C.mix(0.75), 1); g.strokeStyle = C.mix(0.75); path(g, [[b[0] - 3, b[1] + 5], [b[0], b[1]], [b[0] + 3, b[1] + 5]]); g.stroke(); };
      [1.5, 7.5].forEach((x) => aw(x, -3.9, -2.85));
      tx(g, "buoyancy", P(4.5, -3.4)[0], P(4.5, -3.4)[1], { al: "center", bl: "middle", a: 0.55 });
      LV.forEach(([z, s]) => { const [x, y] = P(xa + 0.1, z); tx(g, s, x, y - 3, { a: 0.6 }); });
      { const [x, y] = P(xb - 0.1, -2.7); tx(g, wide ? "−2,700 hull" : "−2,700", x, y - 3, { al: "right", a: 0.6 }); }
      // 확대 눈금 −450 ~ +120 mm: 고정 레벨은 왼쪽, 지금 수위는 오른쪽
      const zA = -450, zB = 120, gy = (mm) => G.y + G.h - ((mm - zA) / (zB - zA)) * G.h;
      const FX = [[0, "FL ±0"], [-300, "hull top −300"], [-360, "design water −360"]], fw = Math.max(...FX.map(([, s]) => tw(g, s))) + 10;
      const gx = G.x + fw, gw = Math.min(28, G.w * 0.18), wmm = -360 + dn;
      g.fillStyle = C.mix(0.1); g.fillRect(gx, gy(Math.min(zB, wmm)), gw, gy(zA) - gy(Math.min(zB, wmm)));
      g.fillStyle = C.mix(0.3); g.fillRect(gx, gy(-300), gw, gy(zA) - gy(-300));
      g.fillStyle = C.mix(0.7); g.fillRect(gx, gy(0), gw, gy(-300) - gy(0));
      g.strokeStyle = C.mix(0.8); g.lineWidth = 0.6; g.strokeRect(gx, gy(zB), gw, gy(zA) - gy(zB));
      FX.forEach(([mm, s]) => { ln(g, gx - 6, gy(mm), gx, gy(mm), C.mix(0.8), 0.8); tx(g, s, gx - 9, gy(mm), { al: "right", bl: "middle", a: 0.6 }); });
      const wy2 = gy(Math.min(zB, wmm)); ln(g, gx - 2, wy2, gx + gw + 6, wy2, C.mix(0.95), 1.6);
      tx(g, `water ${sg(Math.round(wmm))}`, gx + gw + 9, wy2, { bl: "middle", w: 600, a: 0.95 });
      tx(g, "mm, zoomed", gx + gw / 2, G.y + G.h + C.xs * 1.4, { al: "center", a: 0.45 });
      // 읽기 값
      const R = wide ? { x: W * 0.66, y: top + C.s, w: W * 0.34 } : { x: W * 0.52, y: S.y + S.h + C.s * 1.6, w: W * 0.48 };
      const res = 60 - (trim ? 0 : add * MMT);
      let y = R.y; head(g, add > 0 ? `+${fmt(add, 2)} t on board` : "Design state", R.x, y); y += C.xs * 2;
      y = kv(g, R.x, y, R.w, [["water-plane area", "72.25 m²"], ["per tonne", "13.8 mm"], ["house sinks by", `${fmt(trim ? 0 : add * MMT, 0)} mm`, 1], ["water line", `${sg(Math.round(-360 + (trim ? 0 : add * MMT)))} mm`], [res >= 0 ? "to the hull top" : "hull top under by", `${fmt(Math.abs(res), 0)} mm`], ["ballast out", trim ? `${fmt(add, 2)} t` : add * MMT > 60 ? `≥ ${fmt(add - 60 / MMT, 2)} t` : "none"]], lh) + C.xs * 0.6;
      // 배수량 막대
      const Bx = wide ? R : { x: 0, y: Math.max(y, G.y + G.h + C.xs * 3), w: W };
      let by2 = wide ? y : Bx.y;
      head(g, "Displacement 169 t", Bx.x, by2); by2 += C.xs * 1.0;
      const parts = [["Timber frame", 39.5, 0.75], ["Finishes · skin · services", 28.8, 0.5], ["People · rainwater", 5.4, 0.3], ["Hull · ballast · plant", 95.3, 0.12]];
      let x = Bx.x; const tot = 169 + (trim ? 0 : add);
      parts.forEach(([, v, a]) => { const w = (Bx.w * v) / tot; g.fillStyle = C.mix(a); g.fillRect(x, by2, w, 9); x += w; });
      if (!trim && add) { g.fillStyle = C.mix(0.95); g.fillRect(x, by2, (Bx.w * add) / tot, 9); }
      g.strokeStyle = C.mix(0.6); g.lineWidth = 0.5; g.strokeRect(Bx.x, by2, Bx.w, 9); by2 += 9 + C.xs * 1.8;
      const twoCol = !wide, cw = twoCol ? (Bx.w - 16) / 2 : Bx.w;
      [...parts, ...(add && !trim ? [["Added now", add, 0.95]] : [])].forEach(([n, v, a], i) => { const cx = Bx.x + (twoCol ? (i % 2) * (cw + 16) : 0), yy = by2 + (twoCol ? Math.floor(i / 2) : i) * lh; g.fillStyle = C.mix(a); g.fillRect(cx, yy - 7, 8, 7); if (a < 0.2) { g.strokeStyle = C.mix(0.5); g.lineWidth = 0.5; g.strokeRect(cx, yy - 7, 8, 7); } tx(g, n, cx + 12, yy, { a: 0.6 }); tx(g, `${fmt(v, 1)} t`, cx + cw, yy, { al: "right", w: 600, a: 0.95 }); });
      return dn !== target || !reduce;
    });
  };

  // ════════ 4. 벽체 (LA-07): 온도 · Glaser ════════
  const WALLS = [
    [["Timber cladding", 25, 0, 0, 0.55, "v"], ["Ventilated cavity", 30, 0, 0, 0, "v"], ["Mineral wool", 100, 0.035, 1, 0.12, "mw"], ["Air layer", 50, 0, 1, 0, "air"], ["OSB", 15, 0.13, 200, 0.45, ""], ["CLT", 140, 0.13, 50, 0.3, "clt"], ["Gypsum board", 25, 0.25, 10, 0.15, ""]],
    [["Timber cladding", 25, 0, 0, 0.55, "v"], ["Ventilated cavity", 30, 0, 0, 0, "v"], ["Rigid EPS", 150, 0.038, 60, 0.1, "eps"], ["OSB", 15, 0.13, 200, 0.45, ""], ["CLT", 140, 0.13, 50, 0.3, "clt"], ["Gypsum board", 25, 0.25, 10, 0.15, ""]],
  ];
  const psat = (T) => (T >= 0 ? 610.5 * Math.exp((17.269 * T) / (237.3 + T)) : 610.5 * Math.exp((21.875 * T) / (265.5 + T)));
  const wall = (el) => {
    fit(el, 2.3, 0.62);
    const U = ui(el, `<button type="button" data-w="0">Before · mineral wool 100</button><button type="button" data-w="1" class="on">Final · EPS 150</button><span class="sep"></span>${rg("o", "outside", -15, 15, 0.1, -11.4, "Outdoor temperature")}${rg("r", "inside RH", 30, 80, 1, 50, "Indoor relative humidity")}`);
    let w = 1, To = -11.4, RHi = 50;
    const kick = () => st && st.kick();
    group(U, "[data-w]", (b) => { w = +b.dataset.w; kick(); });
    range(U, "o", (v) => `${fmt(v, 1)} °C`, (v) => { To = v; kick(); });
    range(U, "r", (v) => `${v} %`, (v) => { RHi = v; kick(); });
    const calc = () => {
      const L = WALLS[w], Ti = 20, Rsi = 0.13, Rse = 0.13;
      const th = L.filter((l) => l[5] !== "v"), R = th.map((l) => (l[5] === "air" ? 0.18 : l[1] / 1000 / l[2]));
      const Rt = Rsi + Rse + R.reduce((a, b) => a + b, 0), Uv = 1 / Rt, q = Uv * (Ti - To);
      // 바깥 → 안 순서로 경계 온도
      const Tb = [To + q * Rse]; R.forEach((r) => Tb.push(Tb[Tb.length - 1] + q * r));
      const sd = th.map((l) => (l[3] * l[1]) / 1000), S = sd.reduce((a, b) => a + b, 0);
      const pe = (0.8 * psat(To)), pi = (RHi / 100) * psat(Ti);
      const pts = [[0, pe]]; let acc = 0; sd.forEach((d, i) => { acc += d; if (i < sd.length - 1) pts.push([acc, psat(Tb[i + 1])]); }); pts.push([S, pi]);
      // 안쪽 · 바깥 끝은 고정, 가운데 psat 점들 아래로 팽팽한 줄 (아래쪽 볼록 껍질)
      const lo = []; pts.forEach((p) => { while (lo.length >= 2) { const a = lo[lo.length - 2], b = lo[lo.length - 1]; if ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) <= 0) lo.pop(); else break; } lo.push(p); });
      let cond = null;
      for (let i = 1; i < lo.length - 1; i++) { const [sc, pc] = lo[i], gi = 2e-10 * ((pi - pc) / (S - sc) - (pc - pe) / (sc || 1e-6)); const k = pts.findIndex((p) => p === lo[i]); if (gi > 0 && (!cond || gi > cond.g)) cond = { g: gi * 1000 * 86400, k, sd: sc }; }
      let a2 = 0; const ps = [[0, psat(Tb[0])], ...sd.map((d, i) => [(a2 += d), psat(Tb[i + 1])])];
      return { L, th, R, Uv, q, Tb, sd, S, pe, pi, pts, ps, lo, cond, Tsi: Ti - q * Rsi };
    };
    const st = stage(el, (g, W, H) => {
      const r = calc(), top = uiTop(el), wide = W >= 700, lh = C.xs * 1.85;
      const tot = r.L.reduce((a, l) => a + l[1], 0);
      // 왼쪽: 벽 단면 + 온도, 가운데: Glaser, 오른쪽: 숫자 (좁은 화면은 위아래)
      const A = wide ? { x: C.xs * 3, y: top + C.s * 2.2, w: W * 0.3 - C.xs * 3, h: H - top - C.s * 2.2 - C.xs * 8 } : { x: C.xs * 3, y: top + C.s * 2.2, w: W - C.xs * 6, h: (H - top) * 0.3 };
      const B = wide ? { x: W * 0.36 + C.xs * 3.2, y: A.y, w: W * 0.3 - C.xs * 3.2, h: A.h } : { x: C.xs * 3.6, y: A.y + A.h + C.xs * 9.2, w: W - C.xs * 6.6, h: (H - top) * 0.22 };
      head(g, "Wall section · temperature", A.x - C.xs * 3, A.y - C.s * 1.2); tx(g, "outside", A.x, A.y - 3, { a: 0.45 }); tx(g, "inside", A.x + A.w, A.y - 3, { al: "right", a: 0.45 });
      const xs = (mm) => A.x + (mm / tot) * A.w, Ty = (T) => A.y + A.h - ((T + 16) / 38) * A.h;
      let mm = 0, k = 0;
      r.L.forEach((l, i) => {
        const x0 = xs(mm), x1 = xs(mm + l[1]); mm += l[1];
        g.fillStyle = C.mix(l[4]); g.fillRect(x0, A.y, x1 - x0, A.h);
        g.save(); g.beginPath(); g.rect(x0, A.y, x1 - x0, A.h); g.clip();
        if (l[5] === "mw") { g.strokeStyle = C.mix(0.4); g.lineWidth = 0.6; g.beginPath(); for (let y = A.y; y < A.y + A.h; y += 6) { g.moveTo(x0, y); g.quadraticCurveTo(x0 + (x1 - x0) * 0.25, y - 3, x0 + (x1 - x0) * 0.5, y); g.quadraticCurveTo(x0 + (x1 - x0) * 0.75, y + 3, x1, y); } g.stroke(); }
        if (l[5] === "eps") { g.fillStyle = C.mix(0.35); for (let y = A.y + 3; y < A.y + A.h; y += 6) for (let x = x0 + 3 + ((y / 6) % 2) * 3; x < x1; x += 6) g.fillRect(x, y, 1, 1); }
        if (l[5] === "clt") { for (let j = 1; j < 5; j++) ln(g, x0 + ((x1 - x0) * j) / 5, A.y, x0 + ((x1 - x0) * j) / 5, A.y + A.h, C.mix(0.45), 0.5); }
        if (l[5] === "v" && l[4] === 0) { for (let y = A.y; y < A.y + A.h; y += 10) ln(g, (x0 + x1) / 2, y, (x0 + x1) / 2, y + 4, C.mix(0.3), 0.5); }
        g.restore();
        ln(g, x0, A.y, x0, A.y + A.h, C.mix(0.6), 0.5);
        tx(g, String(i + 1), (x0 + x1) / 2, A.y + A.h + 4, { al: "center", bl: "top", a: 0.7, w: 600 });
      });
      g.strokeStyle = C.mix(0.6); g.lineWidth = 0.5; g.strokeRect(A.x, A.y, A.w, A.h);
      [-10, 0, 10, 20].forEach((T) => { ln(g, A.x - 3, Ty(T), A.x, Ty(T), C.mix(0.5), 0.6); tx(g, `${T}`, A.x - 5, Ty(T), { al: "right", bl: "middle", a: 0.5 }); });
      tx(g, "°C", A.x - 5, A.y + A.h + 4, { al: "right", bl: "top", a: 0.45 });
      // 온도선: 바깥 공기 → 표면 → 각 켜 → 실내
      const vent = r.L.filter((l) => l[5] === "v").reduce((a, l) => a + l[1], 0);
      const tl = [[A.x, Ty(To)], [xs(vent), Ty(r.Tb[0])]]; let m2 = vent; r.th.forEach((l, i) => { m2 += l[1]; tl.push([xs(m2), Ty(r.Tb[i + 1])]); }); tl.push([A.x + A.w, Ty(20)]);
      g.strokeStyle = C.bg; g.lineWidth = 3.4; path(g, tl); g.stroke(); g.strokeStyle = C.mix(0.95); g.lineWidth = 1.4; path(g, tl); g.stroke();
      tl.forEach(([x, y], i) => { if (i && i < tl.length - 1) { g.fillStyle = C.mix(0.95); g.beginPath(); g.arc(x, y, 2, 0, 7); g.fill(); } });
      // Glaser: 가로 = 수증기 확산 등가 두께 sd (m), 바깥 0
      head(g, "Glaser · vapour pressure", B.x - C.xs * 3.2, B.y - C.s * 1.2);
      const pmax = Math.max(2400, r.pi * 1.1), px = (s) => B.x + (s / r.S) * B.w, py = (p) => B.y + B.h - (p / pmax) * B.h;
      let s0 = 0; r.sd.forEach((d, i) => { const x0 = px(s0), x1 = px(s0 + d); s0 += d; g.fillStyle = C.mix(r.th[i][4] * 0.5 + 0.03); g.fillRect(x0, B.y, x1 - x0, B.h); ln(g, x0, B.y, x0, B.y + B.h, C.mix(0.4), 0.5); });
      g.strokeStyle = C.mix(0.6); g.lineWidth = 0.5; g.strokeRect(B.x, B.y, B.w, B.h);
      [0, 1000, 2000].forEach((p) => { ln(g, B.x - 3, py(p), B.x, py(p), C.mix(0.5), 0.6); tx(g, fmt(p), B.x - 5, py(p), { al: "right", bl: "middle", a: 0.5 }); });
      tx(g, "Pa", B.x - 5, B.y, { al: "right", bl: "top", a: 0.45 });
      tx(g, "0", B.x, B.y + B.h + 4, { al: "center", bl: "top", a: 0.5 }); tx(g, `${fmt(r.S, 1)} m sd`, B.x + B.w, B.y + B.h + 4, { al: "right", bl: "top", a: 0.5 });
      g.strokeStyle = C.mix(0.95); g.lineWidth = 1.2; path(g, r.ps.map(([s, p]) => [px(s), py(p)])); g.stroke();
      g.setLineDash([4, 3]); g.strokeStyle = C.mix(0.7); g.lineWidth = 1.2; path(g, r.lo.map(([s, p]) => [px(s), py(p)])); g.stroke(); g.setLineDash([]);
      if (r.cond) { const [s, p] = r.pts[r.cond.k]; g.strokeStyle = C.mix(0.95); g.lineWidth = 1.4; g.beginPath(); g.arc(px(s), py(p), 5, 0, 7); g.stroke(); }
      legend(g, [{ t: "saturation pressure", c: C.mix(0.95), k: "line" }, { t: "vapour pressure", c: C.mix(0.7), k: "dash" }], B.x, B.y + B.h + C.xs * 2.2, B.w);
      // 켜 목록 + 숫자
      const R = wide ? { x: W * 0.7, y: top + C.s * 1.0, w: W * 0.3 } : { x: 0, y: B.y + B.h + C.xs * 5.4, w: W };
      let y = R.y;
      const cond = r.cond ? `${fmt(r.cond.g, 1)} g/m²·day` : "none";
      const at = r.cond ? `${r.th[r.cond.k - 1][0]} | ${r.th[r.cond.k][0]}` : "";
      const rows = [["U-value", `${fmt(r.Uv, 3)} W/m²K`, 1], ["heat loss", `${fmt(r.q, 1)} W/m²`], ["inner surface", `${fmt(r.Tsi, 1)} °C`], ["condensation", cond]];
      if (wide) { y = kv(g, R.x, y, R.w, rows, lh); if (at) { tx(g, `at ${at}`, R.x + R.w, y - C.xs * 0.3, { al: "right", a: 0.55 }); y += lh; } y += C.xs * 0.6; }
      else { const cw = (R.w - 16) / 2; kv(g, R.x, y, cw, rows.slice(0, 2), lh); kv(g, R.x + cw + 16, y, cw, rows.slice(2), lh); y += lh * 2; if (at) { tx(g, `at ${at}`, R.x + R.w, y - C.xs * 0.3, { al: "right", a: 0.55 }); y += lh * 0.8; } y += C.xs * 0.4; }
      const two = !wide, cw = two ? (R.w - 16) / 2 : R.w;
      r.L.forEach((l, i) => { const cx = R.x + (two ? (i % 2) * (cw + 16) : 0), yy = y + (two ? Math.floor(i / 2) : i) * lh * 0.92; tx(g, String(i + 1), cx, yy, { w: 600, a: 0.9 }); tx(g, l[0], cx + C.xs * 1.4, yy, { a: 0.6 }); tx(g, `${l[1]}${l[5] === "v" ? " · vent." : l[2] ? ` · λ ${l[2]}` : ""}`, cx + cw, yy, { al: "right", a: 0.85 }); });
      y += Math.ceil(r.L.length / (two ? 2 : 1)) * lh * 0.92 + C.xs * 0.4;
      if (wide) wrapT(g, `${tot} mm wall. Rsi = Rse = 0.13 m²K/W, outside 80 % RH. Team result: U 0.220 → 0.184.`, R.x, y + C.xs * 0.4, R.w, C.xs * 1.5, { a: 0.5 });
      return false;
    });
  };

  // ════════ 5. 해와 그늘 (LA-08) ════════
  const sunSim = (el) => {
    fit(el, 2.3, 0.54);
    const U = ui(el, `${rg("m", "date", 0, 11, 1, 11, "Month, 21st day")}${rg("h", "solar time", 5, 19, 0.25, 12, "Solar time")}<span class="sep"></span><button type="button" data-play>Play</button>`);
    let mon = 11, hr = 12, play = false, last = null;
    const kick = () => st && st.kick();
    range(U, "m", (v) => `21 ${MON[v]}`, (v) => { mon = v; kick(); });
    const hR = range(U, "h", (v) => hhmm(v), (v) => { hr = v; if (play) { play = false; pb.classList.remove("on"); } kick(); });
    const pb = U.querySelector("[data-play]"); pb.addEventListener("click", () => { play = !play; pb.classList.toggle("on", play); last = null; kick(); });
    const st = stage(el, (g, W, H, t) => {
      const dt = last == null ? 0 : Math.min(0.1, t - last); last = t;
      const dec = decl(N21[mon]), L = dayLen(dec), sr = 12 - L / 2, ss = 12 + L / 2;
      if (play) { hr += dt * 1.1; if (hr > Math.min(19, ss)) hr = Math.max(5, sr); hR.set(Math.round(hr * 4) / 4); }
      const s = sun(dec, hr), top = uiTop(el), wide = W >= 700, lh = C.xs * 1.85;
      // 태양 궤적 (등거리 극좌표, 북쪽 위)
      const R = wide ? Math.min(W * 0.16, (H - top) / 2 - C.xs * 2.6) : Math.min(W * 0.36, (H - top) * 0.18);
      const cx = wide ? C.xs * 2.4 + R * 1.1 : W / 2, cy = top + C.xs * 2.2 + R;
      const pp = (alt, az) => { const r = ((90 - alt) / 90) * R; return [cx + Math.sin(az * RAD) * r, cy - Math.cos(az * RAD) * r]; };
      [0, 30, 60].forEach((a) => { g.strokeStyle = C.mix(a ? 0.12 : 0.5); g.lineWidth = a ? 0.6 : 0.8; g.beginPath(); g.arc(cx, cy, ((90 - a) / 90) * R, 0, 7); g.stroke(); if (a) tx(g, `${a}°`, cx + 3, cy - ((90 - a) / 90) * R + 2, { bl: "top", a: 0.4 }); });
      for (let a = 0; a < 360; a += 30) { const [x, y] = pp(0, a), [x2, y2] = pp(80, a); ln(g, x, y, x2, y2, C.mix(0.08), 0.5); }
      [["N", 0], ["E", 90], ["S", 180], ["W", 270]].forEach(([n, a]) => { const [x, y] = pp(-9, a); tx(g, n, x, y, { al: "center", bl: "middle", w: n === "S" ? 600 : 400, a: 0.65 }); });
      const arc = (m, c, w) => { const d = decl(N21[m]), Ld = dayLen(d), pts = []; for (let h = 12 - Ld / 2; h <= 12 + Ld / 2 + 1e-6; h += 0.1) { const p = sun(d, h); if (p.alt >= 0) pts.push(pp(p.alt, p.az)); } g.strokeStyle = c; g.lineWidth = w; path(g, pts); g.stroke(); };
      for (let h = 6; h <= 18; h++) { const pts = []; for (let m = 0; m < 12; m++) { const p = sun(decl(N21[m]), h); if (p.alt > 0) pts.push(pp(p.alt, p.az)); } if (pts.length > 1) { g.strokeStyle = C.mix(0.1); g.lineWidth = 0.5; path(g, pts); g.stroke(); } }
      arc(5, C.mix(0.55), 1); arc(2, C.mix(0.4), 0.8); arc(11, C.mix(0.55), 1); if (![2, 5, 8, 11].includes(mon)) arc(mon, C.mix(0.3), 0.8);
      arc(mon, C.warm(0.7), 1.6);
      [[5, "21 Jun"], [2, "21 Mar · Sep"], [11, "21 Dec"]].forEach(([m, n]) => { const p = sun(decl(N21[m]), 12), [x, y] = pp(p.alt, p.az); tx(g, n, x + 5, y - 3, { a: 0.6 }); });
      [9, 15].forEach((h) => { const p = sun(decl(N21[5]), h), [x, y] = pp(p.alt, p.az); tx(g, `${h}h`, x, y - 4, { al: "center", bl: "bottom", a: 0.4 }); });
      if (s.alt > 0) { const [x, y] = pp(s.alt, s.az); g.fillStyle = C.warm(0.62); g.beginPath(); g.arc(x, y, 5, 0, 7); g.fill(); g.strokeStyle = C.warm(0.95); g.lineWidth = 1; g.stroke(); }
      // 남쪽 단면 (남쪽이 왼쪽). 오른쪽 레벨 글자 자리만큼 넓혀요
      const S = wide ? { x: W * 0.37, y: top + C.s * 1.5, w: W * 0.37, h: H - top - C.s * 1.5 - C.xs * 2.4 } : { x: 0, y: cy + R + C.xs * 3.2, w: W, h: (H - top) * 0.3 };
      const Lw = tw(g, "+6,950") + 8, xa = -3.0, za = -0.9, zb = 8.9; let xb = 10.4, sc = 1;
      for (let i = 0; i < 4; i++) { sc = Math.min(S.w / (xb - xa), S.h / (zb - za)); xb = 10.4 + Lw / sc; }
      const ox = S.x + (S.w - (xb - xa) * sc) / 2 - xa * sc, oy = S.y + (S.h - (zb - za) * sc) / 2 + zb * sc, P = (x, z) => [ox + x * sc, oy - z * sc];
      const dz = s.az - 180, front = s.alt > 0 && Math.abs(dz) < 90, pa = front ? Math.atan(Math.tan(s.alt * RAD) / Math.cos(dz * RAD)) : 0, tp = Math.tan(pa);
      const win = [[0, 0.05, 2.62, 3.4, 0.35, 2.95], [3.4, 3.45, 6.45, 6.95, 1.07, 6.84]]; // [바닥, 창턱, 창 머리, 차양 높이, 내밀기, 천장]
      const D = 8.75;
      const res = win.map(([fl, sill, head0, shz, proj]) => {
        if (!front) return null;
        const hd = Math.min(head0, shz - proj * tp);
        if (hd <= sill) return { d0: 0, d1: 0, shade: 1, hd: sill };
        return { d0: (sill - fl) / tp, d1: (hd - fl) / tp, shade: 1 - (hd - sill) / (head0 - sill), hd };
      });
      g.save(); g.beginPath(); g.rect(S.x, S.y, S.w, S.h); g.clip();
      // 물
      const w0 = P(xa, -0.36), w1 = P(xb, za); g.fillStyle = C.mix(0.06); g.fillRect(w0[0], w0[1], w1[0] - w0[0], w1[1] - w0[1]); ln(g, w0[0], w0[1], w1[0], w0[1], C.mix(0.5), 0.8);
      // 방 안에 드는 빛 (창 → 바닥, 깊으면 북쪽 벽까지)
      res.forEach((r, i) => {
        if (!r || r.d1 <= 0) return; const [fl, sill, , , , ceil] = win[i];
        const hit = (z0) => { const d = (z0 - fl) / tp; return d <= D ? [d, fl] : [D, z0 - D * tp]; };
        const a = hit(sill), b = hit(r.hd), poly = [P(0, r.hd), P(0, sill), P(...a)];
        if (a[0] < D && b[0] >= D) poly.push(P(D, fl));
        poly.push(P(...b));
        g.fillStyle = C.warm(0.45, 0.32); path(g, poly, true); g.fill();
        if (a[0] < D) { const e1 = Math.min(r.d1, D), p = P(a[0], fl), q = P(e1, fl); ln(g, p[0], p[1] - 1.5, q[0], q[1] - 1.5, C.warm(0.8), 3); }
        // 빛살: 바깥에서 창 머리 · 창턱을 지나 바닥까지
        [[r.hd, b], [sill, a]].forEach(([z0, end]) => { const o = P(xa, z0 + (0 - xa) * tp), m = P(0, z0), e = P(...end); ln(g, o[0], o[1], m[0], m[1], C.warm(0.7, 0.75), 0.8); ln(g, m[0], m[1], e[0], e[1], C.warm(0.7, 0.75), 0.8, [3, 2]); });
        void ceil;
      });
      // 집 단면 선
      const k1 = C.mix(0.92);
      const sl = (z0, z1) => { const a = P(-0.25, z0), b = P(9.0, z1); g.fillStyle = C.mix(0.85); g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); };
      sl(0, -0.3); sl(3.4, 3.1); sl(6.95, 6.84);
      [[2.62, 2.95], [6.45, 6.84]].forEach(([hd, c2]) => { const a = P(-0.1, c2), b = P(0.1, hd); g.fillStyle = C.mix(0.85); g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); });
      ln(g, ...P(0, 0.05), ...P(0, 2.62), C.mix(0.6), 0.6); ln(g, ...P(0, 3.45), ...P(0, 6.45), C.mix(0.6), 0.6);
      const n0 = P(8.75, 0), n1 = P(9.0, 6.95); g.fillStyle = C.mix(0.85); g.fillRect(n0[0], n1[1], n1[0] - n0[0], n0[1] - n1[1]);
      g.strokeStyle = k1; g.lineWidth = 1.2; path(g, [P(-1.07, 6.95), P(-1.07, 7.07), P(2.6, 8.05), P(6.4, 8.05), P(10.07, 7.07)]); g.stroke(); ln(g, ...P(-1.07, 6.95), ...P(0, 6.95), k1, 1.2);
      const lg = P(-0.35, 3.4), lg2 = P(0, 3.28); g.fillStyle = k1; g.fillRect(lg[0], lg[1], lg2[0] - lg[0], lg2[1] - lg[1]);
      [[6.95, "+6,950"], [3.4, "+3,400"], [0, "±0"]].forEach(([z, s2]) => { const [x, y] = P(10.4, z); ln(g, ...P(9.1, z), x - 3, y, C.mix(0.3), 0.5); tx(g, s2, x, y, { bl: "middle", a: 0.55 }); });
      tx(g, "south", P(xa, 0)[0] + 2, P(0, -0.62)[1], { bl: "middle", a: 0.45 }); tx(g, "north", P(9.0, 0)[0], P(0, -0.62)[1], { al: "right", bl: "middle", a: 0.45 });
      g.restore();
      // 숫자
      const Q = wide ? { x: W * 0.77, y: top + C.s, w: W * 0.23 } : { x: 0, y: S.y + S.h + C.xs * 1.8, w: W };
      let y = Q.y; head(g, `21 ${MON[mon]} · ${hhmm(Math.round(hr * 4) / 4)}`, Q.x, y); y += C.xs * 2;
      const rows = [["altitude", s.alt > 0 ? `${fmt(s.alt, 1)}°` : "below horizon"], ["azimuth", s.alt > 0 ? `${fmt(s.az, 0)}°` : "—"], ["profile angle, south", front ? `${fmt(pa / RAD, 1)}°` : "—"], ["sun on the 2F floor", res[1] && res[1].d1 > 0 ? `to ${fmt(Math.min(res[1].d1, 8.75), 2)} m` : "none"], ["sun on the 1F floor", res[0] && res[0].d1 > 0 ? `to ${fmt(Math.min(res[0].d1, 8.75), 2)} m` : "none"], ["2F window shaded by eave", front ? `${Math.round(cl(res[1].shade) * 100)} %` : "—"], ["day length", `${fmt(L, 1)} h`]];
      if (wide) y = kv(g, Q.x, y, Q.w, rows, lh) + C.xs;
      else { const cw = (Q.w - 16) / 2; kv(g, Q.x, y, cw, rows.slice(0, 4), lh); kv(g, Q.x + cw + 16, y, cw, rows.slice(4), lh); y += lh * 4 + C.xs * 0.4; }
      if (!front && s.alt > 0) tx(g, "The sun is behind the south face.", Q.x, y, { a: 0.6 });
      else if (wide) wrapT(g, "The 1.1 m eave cuts the high summer sun above the 2F window; the low winter sun runs under it, more than 5 m into the room.", Q.x, y, Q.w, C.xs * 1.5, { a: 0.5 });
      return play;
    });
  };

  // ════════ 6. 공기 (LA-10) ════════
  const AIRM = [
    { n: "Summer · stack", k: "ΔT inside − out", min: 1, max: 6, step: 0.5, v: 3, u: (v) => `${fmt(v, 1)} K` },
    { n: "Summer · cross", k: "wind", min: 0.5, max: 5, step: 0.1, v: 2.5, u: (v) => `${fmt(v, 1)} m/s` },
    { n: "Winter · HRV", k: "outside", min: -15, max: 10, step: 0.1, v: -11.4, u: (v) => `${fmt(v, 1)} °C` },
  ];
  const air = (el) => {
    fit(el, 2.3, 0.62);
    const U = ui(el, `${AIRM.map((m, i) => `<button type="button" data-m="${i}"${i ? "" : ' class="on"'}>${m.n}</button>`).join("")}<span class="sep"></span>${rg("v", AIRM[0].k, AIRM[0].min, AIRM[0].max, AIRM[0].step, AIRM[0].v, "Value")}`);
    let mode = 0, val = AIRM[0].v; const keep = AIRM.map((m) => m.v);
    const kick = () => st && st.kick();
    const L = U.querySelector('[data-r="v"]'), inp = L.querySelector("input"), kb = L.querySelector(".mv-k"), vb = L.querySelector("b");
    const setM = () => { const m = AIRM[mode]; kb.textContent = m.k; inp.min = m.min; inp.max = m.max; inp.step = m.step; inp.value = keep[mode]; val = keep[mode]; vb.textContent = m.u(val); };
    inp.addEventListener("input", () => { val = +inp.value; keep[mode] = val; vb.textContent = AIRM[mode].u(val); kick(); });
    group(U, "[data-m]", (b) => { mode = +b.dataset.m; setM(); kick(); });
    setM();
    // 흐름 길 (단면 B–B′, 남쪽 왼쪽, m)
    const PATHS = [
      [[[-1.6, 1.2], [0, 1.2], [3.2, 1.0], [4.5, 2.4], [4.5, 7.2], [3.0, 8.05], [1.4, 8.1], [-1.2, 8.6]], [[10.6, 1.4], [9, 1.4], [5.8, 1.0], [4.5, 2.6], [4.5, 7.2], [6.0, 8.05], [7.6, 8.1], [10.2, 8.6]], [[-1.6, 4.9], [0, 4.9], [3.3, 4.6], [4.2, 5.4], [4.4, 7.2], [3.0, 8.05], [1.4, 8.1], [-1.2, 8.6]]],
      [[[-2.0, 1.5], [0, 1.4], [4.5, 1.6], [9, 1.4], [11, 1.3]], [[-2.0, 4.9], [0, 4.9], [4.5, 5.1], [9, 4.9], [11, 4.8]], [[-2.0, 2.3], [0, 2.2], [4.5, 2.5], [9, 2.2], [11, 2.0]]],
      [[[-2.0, 7.55], [3.3, 7.55], [3.6, 7.45], [1.6, 7.3], [1.6, 6.1], [1.6, 5.2]], [[1.6, 6.1], [1.4, 3.1], [1.6, 2.2]], [[7.4, 2.2], [7.4, 3.2], [7.4, 5.2], [7.4, 6.6], [7.4, 7.3], [5.4, 7.45], [5.7, 7.55], [11.0, 7.55]]],
    ];
    const pre = PATHS.map((ps) => ps.map((p) => { const L2 = [0]; for (let i = 1; i < p.length; i++) L2.push(L2[i - 1] + Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1])); return { p, L: L2, T: L2[L2.length - 1] }; }));
    const at = (q, u) => { const s = u * q.T; let i = 1; while (i < q.L.length - 1 && q.L[i] < s) i++; const f = (s - q.L[i - 1]) / (q.L[i] - q.L[i - 1] || 1); return [lerp(q.p[i - 1][0], q.p[i][0], f), lerp(q.p[i - 1][1], q.p[i][1], f)]; };
    const VOL = 326, NEED = 180;
    const num = () => {
      if (mode === 0) { const Q = 0.6 * (1 / Math.SQRT2) * Math.sqrt((2 * 9.81 * 6.9 * val) / 300) * 3600; return { Q, rows: [["flow", `${fmt(Q, 0)} m³/h`, 1], ["air changes", `${fmt(Q / VOL, 1)} per hour`], ["fresh air needed", `${NEED} m³/h · 6 × 30`], ["openings", "1 m² in + 1 m² out"], ["stack height", "6.9 m, 1F window → lantern"]], note: "Q = Cd · A/√2 · √(2g · h · ΔT / T), Cd 0.6, T 300 K. My estimate." }; }
      if (mode === 1) { const Q = 0.6 * (1 / Math.SQRT2) * val * Math.sqrt(0.8) * 3600; return { Q, rows: [["flow", `${fmt(Q, 0)} m³/h`, 1], ["air changes", `${fmt(Q / VOL, 1)} per hour`], ["fresh air needed", `${NEED} m³/h · 6 × 30`], ["openings", "1 m² south + 1 m² north"], ["July mean wind", `${fmt(DATA ? DATA.ws[6] : 2.5, 1)} m/s · from the south`]], note: "Q = Cd · A/√2 · v · √ΔCp, ΔCp 0.8 assumed. My estimate." }; }
      const sup = val + 0.95 * (20 - val), ex = 20 - 0.95 * (20 - val), K = (NEED / 3600) * 1.2 * 1005;
      return { Q: NEED, sup, ex, rows: [["supply air", `${fmt(sup, 1)} °C`, 1], ["exhaust out", `${fmt(ex, 1)} °C`], ["flow", `${NEED} m³/h, windows shut`], ["heat kept", `${fmt(K * 0.95 * (20 - val), 0)} W`], ["heat lost", `${fmt(K * 0.05 * (20 - val), 0)} W`]], note: "Supply = outside + 0.95 × (inside − outside). Team: 95 % HRV, heating load 8.57 W/m²." };
    };
    const parts = []; for (let i = 0; i < 90; i++) parts.push({ q: i % 3, u: Math.random(), o: Math.random() });
    let last = null;
    const st = stage(el, (g, W, H, t) => {
      const dt = last == null ? 0 : Math.min(0.1, t - last); last = t;
      const top = uiTop(el), wide = W >= 700, lh = C.xs * 1.85, n = num();
      const S = wide ? { x: 0, y: top, w: W * 0.6, h: H - top - 6 } : { x: 0, y: top, w: W, h: (H - top) * 0.55 };
      const xa = -2.6, xb = 11.6, za = -1.2, zb = 9.2, sc = Math.min(S.w / (xb - xa), S.h / (zb - za));
      const ox = S.x + (S.w - (xb - xa) * sc) / 2 - xa * sc, oy = S.y + (S.h - (zb - za) * sc) / 2 + zb * sc, P = (x, z) => [ox + x * sc, oy - z * sc];
      // 물 · 단면
      const w0 = P(xa, -0.36), w1 = P(xb, za); g.fillStyle = C.mix(0.06); g.fillRect(w0[0], w0[1], w1[0] - w0[0], w1[1] - w0[1]); ln(g, w0[0], w0[1], w1[0], w0[1], C.mix(0.5), 0.8);
      const k1 = C.mix(0.88), slab = (x0, x1, z0, z1) => { const a = P(x0, z0), b = P(x1, z1); g.fillStyle = k1; g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); };
      slab(-0.25, 9.25, 0, -0.3); slab(-0.25, 3.0, 3.4, 3.15); slab(6.0, 9.25, 3.4, 3.15); slab(-0.25, 3.0, 6.95, 6.84); slab(6.0, 9.25, 6.95, 6.84);
      // 벽: 창 자리 비움
      const wallv = (x, open) => { let z = 0; open.forEach(([a, b]) => { slab(x - 0.12, x + 0.12, a, z); z = b; }); slab(x - 0.12, x + 0.12, 6.95, z); };
      const winOpen = mode === 2 ? [] : [[0.4, 2.62], [3.75, 6.45]];
      wallv(-0.13, winOpen.length ? winOpen : [[3.4, 3.4]]); wallv(9.13, winOpen.length ? [[0.6, 2.4], [3.9, 6.2]] : [[3.4, 3.4]]);
      // 창: 겨울은 닫힌 3중 유리(두 줄), 여름은 열린 창(창짝이 안으로 젖혀짐)
      [[-0.13, [[0.4, 2.62], [3.75, 6.45]]], [9.13, [[0.6, 2.4], [3.9, 6.2]]]].forEach(([x, ws]) => ws.forEach(([a, b]) => { const p = P(x, a), q = P(x, b);
        if (mode === 2) { ln(g, p[0] - 1.2, p[1], q[0] - 1.2, q[1], C.mix(0.55), 0.6); ln(g, p[0] + 1.2, p[1], q[0] + 1.2, q[1], C.mix(0.55), 0.6); }
        else { const d = x < 4 ? 1 : -1, hinge = P(x, b), tip = P(x + d * 0.55, b - 0.7); ln(g, hinge[0], hinge[1], tip[0], tip[1], C.mix(0.55), 0.8); ln(g, p[0], p[1], p[0] + d * 4, p[1], C.mix(0.55), 0.8); } }));
      // 계단 (보이드 안, 1층 → 2층)
      g.strokeStyle = C.mix(0.35); g.lineWidth = 0.7; g.beginPath(); for (let i = 0; i <= 12; i++) { const x = 3.25 + (i / 12) * 2.5, z = (i / 12) * 3.4, [X, Y] = P(x, z); i ? (g.lineTo(X, Y + (sc * 3.4) / 12), g.lineTo(X, Y)) : g.moveTo(X, Y); } g.stroke();
      // 부유 데크
      [[-3.1, -0.25], [9.25, 12.1]].forEach(([a, b]) => { const p = P(Math.max(a, xa), -0.3), q = P(Math.min(b, xb), -0.45); g.fillStyle = C.mix(0.4); g.fillRect(p[0], p[1], q[0] - p[0], q[1] - p[1]); });
      g.strokeStyle = k1; g.lineWidth = 1.2; path(g, [P(-1.32, 6.95), P(1.45, 7.95)]); g.stroke(); path(g, [P(7.55, 7.95), P(10.31, 6.95)]); g.stroke();
      // 랜턴: 여름엔 환기창 열림
      const lo = mode === 0 ? 8.0 : 7.95; path(g, [P(1.45, 7.95), P(1.45, mode === 0 ? 8.0 : 8.25)]); g.stroke(); path(g, [P(7.55, 7.95), P(7.55, mode === 0 ? 8.0 : 8.25)]); g.stroke();
      path(g, [P(1.45, 8.25), P(7.55, 8.25)]); g.stroke(); if (mode === 0) { ln(g, ...P(1.45, 8.25), ...P(1.45, 8.2), k1, 1.2); ln(g, ...P(7.55, 8.25), ...P(7.55, 8.2), k1, 1.2); }
      // 계단 보이드 표시
      ln(g, ...P(3.0, 0), ...P(3.0, 6.84), C.mix(0.25), 0.5, [3, 3]); ln(g, ...P(6.0, 0), ...P(6.0, 6.84), C.mix(0.25), 0.5, [3, 3]);
      if (mode === 2) { const a = P(3.3, 7.65), b = P(5.7, 7.25); g.fillStyle = C.bg; g.fillRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); g.strokeStyle = C.mix(0.9); g.lineWidth = 1; g.strokeRect(a[0], a[1], b[0] - a[0], b[1] - a[1]); ln(g, a[0], a[1], b[0], b[1], C.mix(0.5), 0.6); ln(g, a[0], b[1], b[0], a[1], C.mix(0.5), 0.6); tx(g, "HRV", (a[0] + b[0]) / 2, a[1] - 3, { al: "center", bl: "bottom", w: 600, a: 0.8 }); }
      // 흐르는 공기
      const ps = pre[mode], sp = mode === 2 ? 0.12 : 0.04 + 0.11 * cl(n.Q / 3000), cnt = mode === 2 ? 60 : Math.round(40 + 50 * cl(n.Q / 3000));
      ps.forEach((q) => { g.strokeStyle = C.mix(0.14); g.lineWidth = 0.8; path(g, q.p.map(([x, z]) => P(x, z))); g.stroke(); });
      parts.slice(0, cnt).forEach((p) => { const q = ps[p.q % ps.length]; if (!reduce) p.u = (p.u + (dt * sp * 10) / q.T) % 1; const [x, z] = at(q, p.u), [X, Y] = P(x, z); const warmEnd = mode === 2 ? (p.q === 2 ? 1 - p.u : p.q === 0 ? p.u : 0.9) : p.u; g.fillStyle = C.mix(0.35 + 0.55 * (1 - warmEnd)); g.beginPath(); g.arc(X, Y, 1.7, 0, 7); g.fill(); });
      // 화살촉 (끝)
      ps.forEach((q) => { const a = q.p[q.p.length - 2], b = q.p[q.p.length - 1], A = P(...a), B2 = P(...b), an = Math.atan2(B2[1] - A[1], B2[0] - A[0]); g.strokeStyle = C.mix(0.6); g.lineWidth = 1; path(g, [[B2[0] - 6 * Math.cos(an - 0.45), B2[1] - 6 * Math.sin(an - 0.45)], B2, [B2[0] - 6 * Math.cos(an + 0.45), B2[1] - 6 * Math.sin(an + 0.45)]]); g.stroke(); });
      if (mode === 2) { const s1 = P(1.6, 2.2); tx(g, `supply ${fmt(n.sup, 1)} °C`, s1[0] + 6, s1[1], { bl: "middle", a: 0.9, w: 600 }); const e1 = P(7.4, 2.2); tx(g, "extract 20.0 °C", e1[0] - 6, e1[1], { al: "right", bl: "middle", a: 0.9, w: 600 }); }
      // 숫자
      const R = wide ? { x: W * 0.65, y: top + C.s, w: W * 0.35 } : { x: 0, y: S.y + S.h + C.xs * 1.6, w: W };
      let y = R.y; head(g, AIRM[mode].n, R.x, y); y += C.xs * 2;
      y = kv(g, R.x, y, R.w, n.rows, lh) + C.xs * 0.4;
      if (mode < 2) { const mx = Math.max(n.Q, 3600), bw = R.w; g.fillStyle = C.mix(0.07); g.fillRect(R.x, y, bw, 8); g.fillStyle = C.mix(0.6); g.fillRect(R.x, y, (bw * n.Q) / mx, 8); const nx = R.x + (bw * NEED) / mx; ln(g, nx, y - 3, nx, y + 11, C.mix(0.95), 1.2); tx(g, "need", nx + 4, y + 8 + C.xs * 1.3, { a: 0.6 }); tx(g, `${fmt(n.Q / NEED, 1)} × the need`, R.x + R.w, y + 8 + C.xs * 1.3, { al: "right", w: 600, a: 0.95 }); y += 8 + C.xs * 3.2; }
      else { const bw = R.w, x0 = R.x, a = (v) => x0 + (bw * (v + 15)) / 35; g.fillStyle = C.mix(0.07); g.fillRect(x0, y, bw, 8); g.fillStyle = C.mix(0.55); g.fillRect(a(val), y, a(n.sup) - a(val), 8); ln(g, a(20), y - 3, a(20), y + 11, C.mix(0.95), 1.2); tx(g, "−15", x0, y + 8 + C.xs * 1.3, { a: 0.45 }); tx(g, "20 °C", R.x + R.w, y + 8 + C.xs * 1.3, { al: "right", a: 0.45 }); y += 8 + C.xs * 3.2; }
      wrapT(g, n.note, R.x, y, R.w, C.xs * 1.5, { a: 0.5 });
      return !reduce;
    });
    need(kick);
  };

  // ════════ 7. 태양광 (LA-11) ════════
  const PVK = ["S", "E", "W", "N"], PVN = { S: "South", E: "East", W: "West", N: "North" }, PVF = 7 * 1.953 * 0.23 * 0.86; // 경사면 하나 kWh = PVF × kWh/m²
  const PVC = { S: 0.88, E: 0.62, W: 0.45, N: 0.22 };
  const pv = (el) => {
    fit(el, 2.3, 0.7);
    const U = ui(el, `${rg("m", "month", 0, 11, 1, 5, "Month")}${rg("h", "hour", 4, 20, 0.25, 12, "Hour")}<span class="sep"></span><button type="button" data-play${reduce ? "" : ' class="on"'}>Play</button>`);
    let mon = 5, hr = 12, play = !reduce, last = null;
    const kick = () => st && st.kick();
    const mR = range(U, "m", (v) => MON[v], (v) => { mon = v; kick(); });
    const hR = range(U, "h", (v) => hhmm(v), (v) => { hr = v; if (play) { play = false; pb.classList.remove("on"); } kick(); });
    const pb = U.querySelector("[data-play]"); pb.addEventListener("click", () => { play = !play; pb.classList.toggle("on", play); last = null; kick(); });
    const G = (k, m, h) => { const a = DATA.pv[k].hr[m], i = Math.floor(h), f = h - i; return lerp(a[i % 24], a[(i + 1) % 24], f); };
    const st = stage(el, (g, W, H, t) => {
      if (!DATA) return loading(g, W, H);
      const dt = last == null ? 0 : Math.min(0.1, t - last); last = t;
      if (play) { hr += dt * 2.2; if (hr > 20) { hr = 4; mon = (mon + 1) % 12; mR.set(mon); } hR.set(Math.round(hr * 4) / 4); }
      const top = uiTop(el), wide = W >= 700, lh = C.xs * 1.85;
      // 지붕 평면 (m): 처마 11.6 각, 꼭대기 랜턴 6.1 각
      const Rb = wide ? { x: 0, y: top, w: W * 0.34, h: H - top } : { x: 0, y: top, w: W * 0.56, h: Math.min(W * 0.56, (H - top) * 0.36) };
      const sz = Math.min(Rb.w - C.xs * 7, Rb.h - C.xs * 4.4), sc = sz / 11.6, cx = Rb.x + Rb.w / 2, cy = Rb.y + (Rb.h + C.xs * 0.6) / 2, P = (x, y) => [cx + x * sc, cy - y * sc];
      const rot = (k, x, y) => (k === "S" ? [x, y] : k === "N" ? [-x, -y] : k === "E" ? [-y, x] : [y, -x]);
      PVK.forEach((k) => {
        const tr = [[-5.8, -5.8], [5.8, -5.8], [3.05, -3.05], [-3.05, -3.05]].map(([x, y]) => P(...rot(k, x, y)));
        path(g, tr, true); g.fillStyle = C.mix(0.04); g.fill(); g.strokeStyle = C.mix(0.6); g.lineWidth = 0.8; g.stroke();
        const v = G(k, mon, hr) / 950;
        const panel = (x0, y0) => { const q = [[x0, y0], [x0 + 1.722, y0], [x0 + 1.722, y0 + 0.997], [x0, y0 + 0.997]].map(([x, y]) => P(...rot(k, x, y))); path(g, q, true); g.fillStyle = C.heat(v); g.fill(); g.strokeStyle = C.mix(0.75); g.lineWidth = 0.6; g.stroke(); };
        for (let i = 0; i < 4; i++) panel(-3.5 + i * 1.75 - 0.0, -5.45); for (let i = 0; i < 3; i++) panel(-2.62 + i * 1.75, -4.3);
        const s2 = `${k} ${Math.round(G(k, mon, hr))}`, e2 = P(...rot(k, 0, -5.8)), dd = k === "S" ? [0, 1] : k === "N" ? [0, -1] : k === "E" ? [1, 0] : [-1, 0], off = dd[0] ? tw(g, s2, C.xs, 600) / 2 + 6 : C.xs; tx(g, s2, e2[0] + dd[0] * off, e2[1] + dd[1] * off, { al: "center", bl: "middle", a: 0.8, w: 600 });
      });
      const l0 = P(-3.05, 3.05), l1 = P(3.05, -3.05); g.strokeStyle = C.mix(0.6); g.lineWidth = 0.6; g.strokeRect(l0[0], l0[1], l1[0] - l0[0], l1[1] - l0[1]); ln(g, l0[0], l0[1], l1[0], l1[1], C.mix(0.2), 0.5); ln(g, l1[0], l0[1], l0[0], l1[1], C.mix(0.2), 0.5);
      tx(g, "lantern", cx, cy, { al: "center", bl: "middle", a: 0.45 });
            // 하루 곡선 · 달별 막대
      const A = wide ? { x: W * 0.4, y: top + C.s * 2, w: W * 0.33, h: (H - top) * 0.36 } : { x: W * 0.6 + C.xs * 2.4, y: top + C.s * 2, w: W * 0.4 - C.xs * 3.6, h: Rb.h - C.s * 2 - C.xs * 2.4 };
      head(g, `Mean day · ${MON[mon]} · W/m²`, A.x - (wide ? 0 : C.xs * 2.4), A.y - C.s * 1.1);
      const X = (h) => A.x + ((h - 4) / 16) * A.w, Y = (v) => A.y + A.h - (v / 1000) * A.h;
      [0, 500, 1000].forEach((v) => { ln(g, A.x, Y(v), A.x + A.w, Y(v), C.mix(0.1), 0.6); tx(g, `${v}`, A.x - 4, Y(v), { al: "right", bl: "middle", a: 0.45 }); });
      [4, 8, 12, 16, 20].forEach((h) => tx(g, `${h}`, X(h), A.y + A.h + 4, { al: "center", bl: "top", a: 0.45 }));
      PVK.forEach((k) => { g.strokeStyle = C.warm(PVC[k]); g.lineWidth = 1.3; const pts = []; for (let h = 4; h <= 20; h += 0.25) pts.push([X(h), Y(G(k, mon, h))]); path(g, pts); g.stroke(); });
      ln(g, X(hr), A.y, X(hr), A.y + A.h, C.mix(0.5), 0.6, [2, 2]);
      const lgY = wide ? A.y + A.h + C.xs * 2.2 : Rb.y + Rb.h + C.xs * 0.6, lg = legend(g, PVK.map((k) => ({ t: PVN[k], c: C.warm(PVC[k]), k: "line", lw: 2 })), wide ? A.x : 0, lgY, wide ? A.w : W);
      const Bx = wide ? { x: W * 0.4, y: lgY + lg + C.s * 2.2, w: W * 0.33 } : { x: C.xs * 2.4, y: lgY + lg + C.s * 2.2, w: W - C.xs * 2.4 };
      Bx.h = wide ? H - Bx.y - C.xs * 2.2 : (H - top) * 0.2;
      head(g, "kWh per month, four slopes", Bx.x - (wide ? 0 : C.xs * 2.4), Bx.y - C.s * 0.6);
      const by0 = Bx.y + C.s * 0.8, bh = Bx.h - C.s * 0.8, mx = Math.max(...MON.map((_, m) => PVK.reduce((a, k) => a + DATA.pv[k].mon[m] * PVF, 0)));
      const bw = Bx.w / 12;
      MON.forEach((mm, m) => { let yb = by0 + bh; PVK.forEach((k) => { const v = DATA.pv[k].mon[m] * PVF, h = (v / mx) * bh; g.fillStyle = C.warm(PVC[k], m === mon ? 1 : 0.45); g.fillRect(Bx.x + m * bw + 1, yb - h, bw - 2, h); yb -= h; }); tx(g, wide ? mm : mm[0], Bx.x + (m + 0.5) * bw, by0 + bh + 4, { al: "center", bl: "top", a: m === mon ? 0.95 : 0.45, w: m === mon ? 600 : 400 }); });
      // 숫자
      const R = wide ? { x: W * 0.78, y: top + C.s, w: W * 0.22 } : { x: 0, y: Bx.y + Bx.h + C.xs * 2.6, w: W };
      const now = PVK.reduce((a, k) => a + (G(k, mon, hr) * PVF) / 1000, 0), mE = PVK.reduce((a, k) => a + DATA.pv[k].mon[mon] * PVF, 0), yE = PVK.reduce((a, k) => a + DATA.pv[k].yr * PVF, 0);
      let y = R.y; head(g, `${MON[mon]} · ${hhmm(Math.round(hr * 4) / 4)}`, R.x, y); y += C.xs * 2;
      const rows = [["power now (month mean)", `${fmt(now, 1)} kW`, 1], ["this month", `${fmt(mE, 0)} kWh`], ["year", `${fmt(yE, 0)} kWh`], ["per kWp", `${fmt(yE / 12.6, 0)} kWh`], ["north ÷ south, year", `${Math.round((DATA.pv.N.yr / DATA.pv.S.yr) * 100)} %`]];
      if (wide) { y = kv(g, R.x, y, R.w, rows, lh) + C.xs; wrapT(g, "28 × 450 W (12.6 kWp), 7 a slope at 28.5°. Typical-year sun, 23 % modules, 14 % system losses — my estimate. Cloud evens out the slopes: north gets far more than the clear-sky 57 %.", R.x, y, R.w, C.xs * 1.5, { a: 0.5 }); }
      else { const cw = (R.w - 16) / 2; kv(g, R.x, y, cw, rows.slice(0, 3), lh); kv(g, R.x + cw + 16, y, cw, rows.slice(3), lh); }
      return play;
    });
    need(kick);
  };

  // ════════ 8. 빗물 (LA-12) ════════
  const YRS = [2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  const RTOT = [1189.0, 959.8, 1289.1, 982.4, 1437.0, 1184.4, 1629.9, 1244.5, 1150.4, 1746.0];
  const RSEA = [[221.5, 228.0, 315.2, 124.9, 383.5, 175.0, 173.7, 330.5, 154.9, 284.5], [608.6, 390.9, 454.8, 612.7, 620.6, 508.2, 1037.6, 612.8, 672.8, 1018.5], [296.1, 248.8, 382.8, 177.9, 351.3, 440.8, 270.4, 256.4, 290.9, 278.5], [77.0, 112.0, 110.0, 75.2, 68.7, 168.8, 47.8, 13.3, 71.6, 236.7]];
  const NORM = [20.8, 25.1, 40.2, 77.5, 94.8, 128.4, 362.2, 289.7, 146.3, 52.6, 47.9, 22.2]; // 수원 월 평년값(근사) — 계절 안에서 나누는 비율로만 씀
  const RDAYS = [5, 6, 7, 8, 9, 10, 16, 15, 9, 6, 8, 7];
  const SEA = [3, 3, 0, 0, 0, 1, 1, 1, 2, 2, 2, 3];
  const daysOf = (yi) => {
    const r = rnd(9001 + YRS[yi]), sum = RSEA.reduce((a, s) => a + s[yi], 0), out = new Float32Array(365);
    for (let m = 0; m < 12; m++) {
      const se = SEA[m], inS = NORM.reduce((a, v, j) => a + (SEA[j] === se ? v : 0), 0), tot = ((RSEA[se][yi] * NORM[m]) / inS) * (RTOT[yi] / sum);
      const ds = new Set(); while (ds.size < RDAYS[m]) ds.add(Math.floor(r() * ML[m]));
      const w = [...ds].map(() => (-Math.log(r() + 1e-9)) ** 1.3), ws = w.reduce((a, b) => a + b, 0);
      [...ds].forEach((d, k) => (out[MD0[m] + d] = (tot * w[k]) / ws));
    }
    return out;
  };
  const rain = (el) => {
    fit(el, 2.5, 0.8);
    const U = ui(el, `${rg("y", "year", 2014, 2023, 1, 2023, "Year")}<span class="sep"></span><span class="mv-k">tank</span><button type="button" data-c="2">2 m³</button><button type="button" data-c="5" class="on">5 m³</button><button type="button" data-c="10">10 m³</button><span class="sep"></span><button type="button" data-play${reduce ? "" : ' class="on"'}>Play</button>`);
    let yi = 9, cap = 5, play = !reduce, cur = reduce ? 364 : 0, last = null, simC = null, key = "";
    const kick = () => st && st.kick();
    range(U, "y", (v) => `${v}`, (v) => { yi = v - 2014; cur = play ? 0 : 364; kick(); });
    group(U, "[data-c]", (b) => { cap = +b.dataset.c; kick(); });
    const pb = U.querySelector("[data-play]"); pb.addEventListener("click", () => { play = !play; pb.classList.toggle("on", play); if (play && cur >= 364) cur = 0; last = null; kick(); });
    const AREA = 135, CR = 0.9, USE = 0.18;
    const run = () => { const R = daysOf(yi), lv = new Float32Array(365), ov = new Float32Array(365), tp = new Float32Array(365); let L = cap; for (let d = 0; d < 365; d++) { L += (R[d] * AREA * CR) / 1000; if (L > cap) { ov[d] = L - cap; L = cap; } if (L >= USE) L -= USE; else { tp[d] = USE - L; L = 0; } lv[d] = L; } return { R, lv, ov, tp }; };
    const st = stage(el, (g, W, H, t) => {
      if (key !== yi + "|" + cap) { simC = run(); key = yi + "|" + cap; }
      const dt = last == null ? 0 : Math.min(0.1, t - last); last = t;
      if (play) { cur += dt * 40; if (cur >= 364) { cur = 364; play = false; pb.classList.remove("on"); } }
      const top = uiTop(el), wide = W >= 700, lh = C.xs * 1.85, d1 = Math.floor(cur), S = simC;
      const A = wide ? { x: C.xs * 3, y: top + C.s * 1.6, w: W * 0.68 - C.xs * 3, h: H - top - C.s * 1.6 - C.xs * 5 } : { x: C.xs * 3, y: top + C.s * 1.6, w: W - C.xs * 3, h: (H - top) * 0.46 };
      const rh = A.h * 0.42, gap = A.h * 0.1, th = A.h - rh - gap, ty = A.y + rh + gap, X = (d) => A.x + ((d + 0.5) / 365) * A.w, bw = Math.max(1, A.w / 365 - 0.2);
      const rmax = Math.max(60, Math.ceil(Math.max(...S.R) / 20) * 20);
      head(g, `Rain · ${YRS[yi]} · ${fmt(RTOT[yi], 0)} mm · bars in mm a day`, A.x - C.xs * 3, A.y - C.s * 0.9);
      [0, rmax / 2, rmax].forEach((v) => { const y = A.y + rh - (v / rmax) * rh; ln(g, A.x, y, A.x + A.w, y, C.mix(0.08), 0.5); tx(g, `${v}`, A.x - 4, y, { al: "right", bl: "middle", a: 0.45 }); });
      for (let d = 0; d < 365; d++) { if (!S.R[d]) continue; const h = (S.R[d] / rmax) * rh; g.fillStyle = C.mix(d <= d1 ? 0.75 : 0.18); g.fillRect(X(d) - bw / 2, A.y + rh - h, bw, h); }
      // 저수조 수위
      const Y = (v) => ty + th - (v / cap) * th;
      g.fillStyle = C.mix(0.04); g.fillRect(A.x, ty, A.w, th); g.strokeStyle = C.mix(0.5); g.lineWidth = 0.5; g.strokeRect(A.x, ty, A.w, th);
      g.beginPath(); g.moveTo(X(0), Y(0)); for (let d = 0; d <= d1; d++) g.lineTo(X(d), Y(S.lv[d])); g.lineTo(X(d1), Y(0)); g.closePath(); g.fillStyle = C.mix(0.28); g.fill();
      g.strokeStyle = C.mix(0.9); g.lineWidth = 1; g.beginPath(); for (let d = 0; d <= d1; d++) d ? g.lineTo(X(d), Y(S.lv[d])) : g.moveTo(X(d), Y(S.lv[d])); g.stroke();
      for (let d = 0; d <= d1; d++) { if (S.ov[d] > 0.05) ln(g, X(d), ty - 2, X(d), ty - 2 - Math.min(10, 2 + S.ov[d] * 0.6), C.mix(0.55), 1); if (S.tp[d] > 0) ln(g, X(d), ty + th + 2, X(d), ty + th + 6, C.mix(0.95), 1); }
      [0, cap].forEach((v) => tx(g, `${v}`, A.x - 4, Y(v), { al: "right", bl: "middle", a: 0.45 })); tx(g, "m³", A.x - 4, ty + th / 2, { al: "right", bl: "middle", a: 0.45 });
      MON.forEach((m, k) => tx(g, wide ? m : m[0], A.x + (A.w * (MD0[k] + ML[k] / 2)) / 365, ty + th + 8, { al: "center", bl: "top", a: 0.5 }));
      ln(g, X(d1), A.y, X(d1), ty + th, C.mix(0.6), 0.6, [2, 2]);
      const lgI = [{ t: `tank level, ${cap} m³`, c: C.mix(0.28) }, { t: "overflow to the wetland", c: C.mix(0.55), k: "line" }, { t: "mains top-up", c: C.mix(0.95), k: "line" }], lgH = legend(g, lgI, A.x, ty + th + 8 + C.xs * 1.8, A.w);
      // 합계 (지금 날짜까지)
      let hv = 0, ov = 0, tp = 0, dry = 0; for (let d = 0; d <= d1; d++) { hv += (S.R[d] * AREA * CR) / 1000; ov += S.ov[d]; tp += S.tp[d]; if (S.tp[d] > 0) dry++; }
      const need2 = USE * (d1 + 1), R = wide ? { x: W * 0.73, y: top + C.s, w: W * 0.27 } : { x: 0, y: ty + th + 8 + C.xs * 1.8 + lgH + C.s * 1.6, w: W };
      const dd = d1 - MD0[mOf(d1)] + 1;
      let y = R.y; head(g, `1 Jan → ${dd} ${MON[mOf(d1)]}`, R.x, y); y += C.xs * 2;
      const rows = [["roof harvest", `${fmt(hv, 1)} m³`, 1], ["WC · cleaning use", `${fmt(need2, 1)} m³`], ["from rain", `${Math.round(((need2 - tp) / need2) * 100)} %`, 1], ["mains top-up", `${fmt(tp, 1)} m³ · ${dry} days`], ["overflow", `${fmt(ov, 1)} m³`]];
      if (wide) { y = kv(g, R.x, y, R.w, rows, lh) + C.xs; wrapT(g, "Roof 135 m² × 0.9, 6 people × 30 L a day. Season totals are the record; the daily pattern inside each season is synthetic — my approximation.", R.x, y, R.w, C.xs * 1.5, { a: 0.5 }); }
      else { const cw = (R.w - 16) / 2; kv(g, R.x, y, cw, rows.slice(0, 3), lh); kv(g, R.x + cw + 16, y, cw, rows.slice(3), lh); y += lh * 3 + C.xs * 0.2; wrapT(g, "Season totals are the record; the daily pattern is synthetic (my approximation).", R.x, y, R.w, C.xs * 1.5, { a: 0.5 }); }
      return play;
    });
  };

  // ════════ 9. 탄소 (LA-14) ════════
  const SWAPS = [["PVC floor tile", "PVC flooring tile, less of it", 1.1, 0.54, "a"], ["Glazing frame", "Al stick curtain wall → coated IGU 28 mm", 1.3, 0.84, "a"], ["Site works", "A5 construction", 0.06, 0, "c"], ["Wood floor", "solid wood flooring, less of it", 0.09, 0.047, "a"], ["Recycled EPS", "EPS 45 % → 100 % recycled", 0.04, 0.018, "a"]];
  const carbon = (el) => {
    fit(el, 4.4, 0.74);
    const U = ui(el, `<span class="mv-k">swap</span>${SWAPS.map(([n], i) => `<button type="button" data-s="${i}">${n}</button>`).join("")}<span class="sep"></span><button type="button" data-all>Team after</button><button type="button" data-none class="on">Before</button>`);
    const on = SWAPS.map(() => false), cur = { a: 24.1, c: 4.51 }; let last = null;
    const kick = () => st && st.kick();
    const sync = () => { const all = on.every(Boolean), none = !on.some(Boolean); U.querySelectorAll("[data-s]").forEach((b, i) => b.classList.toggle("on", on[i])); U.querySelector("[data-all]").classList.toggle("on", all); U.querySelector("[data-none]").classList.toggle("on", none); kick(); };
    U.querySelectorAll("[data-s]").forEach((b, i) => b.addEventListener("click", () => { on[i] = !on[i]; sync(); }));
    U.querySelector("[data-all]").addEventListener("click", () => { on.fill(true); sync(); });
    U.querySelector("[data-none]").addEventListener("click", () => { on.fill(false); sync(); });
    const st = stage(el, (g, W, H, t) => {
      const dt = last == null ? 1 : Math.min(0.1, t - last); last = t;
      const cut = SWAPS.reduce((a, s, i) => a + (on[i] && s[4] === "a" ? s[2] - s[3] : 0), 0), cutC = on[2] ? 0.06 : 0;
      const ta = 24.1 - cut, tc = 4.51 - cutC; cur.a += (ta - cur.a) * Math.min(1, dt * 6); cur.c += (tc - cur.c) * Math.min(1, dt * 6);
      if (Math.abs(ta - cur.a) < 1e-3) cur.a = ta; if (Math.abs(tc - cur.c) < 1e-3) cur.c = tc;
      const top = uiTop(el), wide = W >= 700, lh = C.xs * 1.85;
      const ST = [["A1–A3 materials", cur.a, 0.82], ["A4 transport", 0.697, 0.6], ["A5 construction", cur.c, 0.45], ["B6 operational energy", 16.8, 0.25], ["C1–C4 end of life", 0.015, 0.1]];
      const tot = ST.reduce((a, s) => a + s[1], 0), base = 24.1 + 0.697 + 4.51 + 16.8 + 0.015;
      const A = wide ? { x: 0, y: top + C.s, w: W * 0.56 } : { x: 0, y: top + C.s, w: W };
      head(g, "Life-cycle emissions · t CO₂e", A.x, A.y);
      tx(g, `${fmt(tot, 1)} t`, A.x + A.w, A.y, { al: "right", z: C.s, w: 600, a: 0.95 });
      const sc = A.w / 150; let x = A.x, y = A.y + C.xs * 1.2; const bh = 16;
      ST.forEach(([, v, a]) => { const w = v * sc; g.fillStyle = C.mix(a); g.fillRect(x, y, w, bh); x += w; });
      g.strokeStyle = C.mix(0.6); g.lineWidth = 0.5; g.strokeRect(A.x, y, tot * sc, bh);
      const b46 = A.x + 46.1 * sc; ln(g, b46, y - 3, b46, y + bh + 3, C.mix(0.95), 1, [2, 2]);
      y += bh + C.xs * 1.6;
      // 목재 저장 탄소 (같은 축척)
      g.fillStyle = C.mix(0.04); g.fillRect(A.x, y, 142 * sc, bh); g.strokeStyle = C.mix(0.75); g.lineWidth = 0.8; g.strokeRect(A.x + 0.4, y + 0.4, 142 * sc - 0.8, bh - 0.8);
      g.save(); g.beginPath(); g.rect(A.x, y, 142 * sc, bh); g.clip(); for (let q = A.x - bh; q < A.x + 142 * sc; q += 5) ln(g, q, y + bh, q + bh, y, C.mix(0.3), 0.5); g.restore();
      tx(g, "142 t held in the timber · biogenic, reported apart", A.x + 6, y + bh / 2, { bl: "middle", a: 0.85, w: 600, c: C.mix(0.9) });
      y += bh + C.xs * 1.4; const two = !wide && A.w > 320, cw = two ? (A.w - 16) / 2 : A.w * 0.62;
      ST.forEach(([n, v, a], i) => { const cx = A.x + (two ? (i % 2) * (cw + 16) : 0), yy = y + (two ? Math.floor(i / 2) : i) * lh + C.xs; g.fillStyle = C.mix(a); g.fillRect(cx, yy - 7, 8, 7); if (a < 0.2) { g.strokeStyle = C.mix(0.5); g.lineWidth = 0.5; g.strokeRect(cx, yy - 7, 8, 7); } tx(g, n, cx + 12, yy, { a: 0.6 }); tx(g, `${fmt(v, v < 1 ? 2 : 1)} · ${Math.round((v / tot) * 100)} %`, cx + cw, yy, { al: "right", w: 600, a: 0.95 }); });
      y += (two ? Math.ceil(ST.length / 2) : ST.length) * lh + C.xs * 1.4;
      const gia = (cur.a + 0.697 + cur.c) / 162 * 1000;
      if (wide) { const kx = A.x + A.w * 0.68, kw = A.w * 0.32; let ky = A.y + C.xs * 1.2 + bh * 2 + C.xs * 3.0 + C.xs; kv(g, kx, ky, kw, [["A1–A5 per m² GIA", `${fmt(gia, 0)} kg`, 1], ["vs before", `${sg(tot - base, 2)} t`], ["social cost of carbon", `€${fmt(2307 - ((2307 - 2248) * (base - tot)) / (base - 44.977), 0)}`], ["timber stores", `${fmt(142 / tot, 1)} × the emissions`]], lh); }
      else { kv(g, A.x, y, A.w, [["A1–A5 per m² GIA", `${fmt(gia, 0)} kg CO₂e`, 1], ["vs before", `${sg(tot - base, 2)} t · ${sg(((tot - base) / base) * 100, 1)} %`]], lh); y += lh * 2 + C.xs; }
      // 재료 핫스폿
      const B = wide ? { x: W * 0.62, y: top + C.s, w: W * 0.38 } : { x: 0, y, w: W };
      head(g, "A1–A3 by material · t CO₂e", B.x, B.y);
      const HOT = [["MDF 19 mm", 7.6], ["Softwood beam", 5.3], ["Softwood board", 4.9], ["IGU 36 mm, argon", 3.8], [on[1] ? "Coated IGU 28 mm" : "Al curtain wall", on[1] ? 0.84 : 1.3, 1.3, 1], ["PVC flooring tile", on[0] ? 0.54 : 1.1, 1.1, 0], ["Solid wood floor", on[3] ? 0.047 : 0.09, 0.09, 3], ["EPS insulation", on[4] ? 0.018 : 0.04, 0.04, 4]];
      const nw = Math.min(B.w * 0.42, tw(g, "IGU 36 mm, argon") + 14), bx0 = B.x + nw, bww = B.w - nw - C.xs * 3.6, hs = bww / 8, rhh = wide ? Math.min(lh * 1.2, (H - B.y - C.xs * 4) / HOT.length) : lh;
      let hy = B.y + C.xs * 1.6;
      HOT.forEach(([n, v, b0, si]) => { const swapped = si != null && on[si]; tx(g, n, B.x, hy + rhh * 0.6, { a: swapped ? 0.95 : 0.6, w: swapped ? 600 : 400 }); if (b0) { g.strokeStyle = C.mix(0.45); g.lineWidth = 0.6; g.setLineDash([2, 2]); g.strokeRect(bx0 + 0.3, hy + rhh * 0.18, b0 * hs, rhh * 0.5); g.setLineDash([]); } g.fillStyle = C.mix(swapped ? 0.95 : 0.6); g.fillRect(bx0, hy + rhh * 0.18, Math.max(1, v * hs), rhh * 0.5); tx(g, fmt(v, v < 1 ? 2 : 1), B.x + B.w, hy + rhh * 0.6, { al: "right", w: 600, a: 0.95 }); hy += rhh; });
      tx(g, "dashed = before", B.x + B.w, hy + C.xs * 0.9, { al: "right", a: 0.45 });
      if (wide) wrapT(g, "Team One Click LCA, EN 15978. MDF, beams, boards and the IGU make 89 % of A1–A3 — the next cut. B6 does not yet count the roof PV.", B.x, hy + C.xs * 2.6, B.w, C.xs * 1.5, { a: 0.5 });
      return cur.a !== ta || cur.c !== tc;
    });
  };

  // ════════ 10. 에너지 수지 (LA-11, 팀 에너지 계산) ════════
  const DEM = [["Heating", 10.24, 5.5, 0.9, "solar thermal"], ["Hot water", 55.89, 42.03, 0.9, "solar thermal"], ["Electricity", 61.78, 103.09, 2.7, "PV"], ["Cooling", 41.25, 0, 0.9, ""]];
  const balance = (el) => {
    fit(el, 3.0, 0.68);
    const U = ui(el, `<button type="button" data-v="0" class="on">Demand vs solar</button><button type="button" data-v="1">Primary energy</button>`);
    let v = 0, k = 1, last = null, hot = -1;
    const kick = () => st && st.kick();
    group(U, "[data-v]", (b) => { v = +b.dataset.v; k = 0; kick(); });
    const st = stage(el, (g, W, H, t, hv) => {
      const dt = last == null ? 1 : Math.min(0.1, t - last); last = t; k = Math.min(1, k + dt * (reduce ? 10 : 1.4));
      const top = uiTop(el), wide = W >= 700, lh = C.xs * 1.85, e = (x) => 1 - (1 - x) ** 3;
      const A = wide ? { x: C.xs * 7.6, y: top + C.s * 1.6, w: W * 0.62 - C.xs * 7.6, h: H - top - C.s * 1.6 - C.xs * 4 } : { x: C.xs * 6.4, y: top + C.s * 1.6, w: W - C.xs * 6.4, h: (H - top) * 0.6 };
      hot = -1;
      if (v === 0) {
        head(g, "Final energy · kWh/m²·yr", 0, A.y - C.s * 0.6);
        const rows = [...DEM, ["Total", 169.16, 150.63]], rh2 = A.h / rows.length, sc = (A.w - C.xs * 4) / 175;
        rows.forEach(([n, d, s], i) => { const y = A.y + i * rh2 + C.xs * 0.6, bh = Math.min(12, rh2 * 0.28), tot = n === "Total";
          if (hv && hv.y > y - 2 && hv.y < y + bh * 2 + 6) hot = i;
          tx(g, n, A.x - 8, y + bh, { al: "right", bl: "middle", a: tot ? 0.95 : 0.7, w: tot ? 600 : 400 });
          g.fillStyle = C.mix(tot ? 0.85 : 0.6); g.fillRect(A.x, y, d * sc * e(k), bh); tx(g, fmt(d, 2), A.x + d * sc * e(k) + 5, y + bh / 2, { bl: "middle", a: 0.85, w: 600 });
          if (s) { g.fillStyle = C.warm(tot ? 0.85 : 0.62); g.fillRect(A.x, y + bh + 3, s * sc * e(k), bh); tx(g, fmt(s, 2), A.x + s * sc * e(k) + 5, y + bh * 1.5 + 3, { bl: "middle", a: 0.85, w: 600 }); }
          if (i < rows.length - 1) ln(g, A.x - C.xs * 6, y + rh2 - C.xs * 0.3, A.x + A.w, y + rh2 - C.xs * 0.3, C.mix(0.06), 0.5); });
        legend(g, [{ t: "demand (heat pump, power)", c: C.mix(0.6) }, { t: "made by the sun", c: C.warm(0.62) }], A.x, A.y + A.h + C.xs, A.w);
      } else {
        head(g, "Primary energy · kWh/m²·yr", 0, A.y - C.s * 0.6);
        const SN = wide ? ["Heating", "Hot water", "Electricity", "Cooling", "Solar thermal", "PV"] : ["Heat", "Hot water", "Power", "Cool", "Solar heat", "PV"];
        const steps = [...DEM.map(([, d, , f], i) => [SN[i], d * f, `${fmt(d, 2)} × ${f}`]), [SN[4], -(5.5 + 42.03) * 0.9, "47.53 × 0.9"], [SN[5], -103.09 * 2.7, "103.09 × 2.7"]];
        const lo = -110, hi = 270, Y = (q) => A.y + A.h - ((q - lo) / (hi - lo)) * A.h, cw = A.w / (steps.length + 1);
        [-100, 0, 100, 200].forEach((q) => { ln(g, A.x, Y(q), A.x + A.w, Y(q), C.mix(q ? 0.08 : 0.5), q ? 0.5 : 0.8); tx(g, `${q}`, A.x - 6, Y(q), { al: "right", bl: "middle", a: 0.5 }); });
        let run = 0; const kk = e(k) * (steps.length + 1);
        steps.forEach(([n, q, f], i) => { const p = cl(kk - i), x = A.x + i * cw + cw * 0.18, w = cw * 0.64, a = run, b = run + q * p; run += q;
          if (hv && hv.x > A.x + i * cw && hv.x < A.x + (i + 1) * cw) hot = i;
          g.fillStyle = q > 0 ? C.mix(hot === i ? 0.85 : 0.6) : C.warm(hot === i ? 0.85 : 0.62); g.fillRect(x, Y(Math.max(a, b)), w, Math.abs(Y(a) - Y(b)));
          if (i < steps.length - 1) ln(g, x + w, Y(run), x + cw, Y(run), C.mix(0.4), 0.5, [2, 2]);
          if (p > 0.9) tx(g, sg(q, wide ? 2 : 1), x + w / 2, q > 0 ? Y(Math.max(a, b)) - 4 : Y(Math.min(a, b)) + 4, { al: "center", bl: q > 0 ? "bottom" : "top", w: 600, a: 0.9 });
          const lines = wide ? [n] : n.split(" "); lines.forEach((s, j) => tx(g, s, x + w / 2, A.y + A.h + 4 + j * C.xs * 1.2, { al: "center", bl: "top", a: hot === i ? 0.95 : 0.55 })); });
        const x = A.x + steps.length * cw + cw * 0.18, w = cw * 0.64, fin = e(k) >= 0.99;
        if (fin) { g.fillStyle = C.mix(0.95); g.fillRect(x, Y(0), w, Y(-57.67) - Y(0)); tx(g, wide ? "−57.67" : "−57.7", x + w / 2, Y(-57.67) + 4, { al: "center", bl: "top", w: 600, a: 0.95 }); }
        tx(g, wide ? "Balance" : "Net", x + w / 2, A.y + A.h + 4, { al: "center", bl: "top", a: 0.7, w: 600 });
        if (hot >= 0) { const [n, q, f] = steps[hot]; tx(g, `${n}: ${f} = ${sg(q, 2)}`, A.x + A.w, A.y - C.s * 0.6, { al: "right", a: 0.8, w: 600 }); }
      }
      const R = wide ? { x: W * 0.68, y: top + C.s, w: W * 0.32 } : { x: 0, y: A.y + A.h + C.xs * (v ? 5.2 : 4), w: W };
      let y = R.y; head(g, "Team energy model", R.x, y); y += C.xs * 2;
      const rows = [["demand", "169.16 kWh/m²·yr"], ["solar made", "150.63 · 89 %"], ["primary balance", "−57.67 kWh/m²·yr", 1], ["heating load", "8.57 W/m², passive < 10"]];
      if (wide) { y = kv(g, R.x, y, R.w, rows, lh) + C.xs; wrapT(g, "Heat pump for heating, hot water and cooling; primary-energy factors 0.9 for heat-pump energy, 2.7 for power. Hover a bar for its sum.", R.x, y, R.w, C.xs * 1.5, { a: 0.5 }); }
      else kv(g, R.x, y, R.w, rows, lh);
      return k < 1 || !!hv;
    }, { hover: true });
  };

  const KIND = { "la-climate": climate, "la-cluster": cluster, "la-float": float, "la-wall": wall, "la-sun": sunSim, "la-air": air, "la-pv": pv, "la-rain": rain, "la-carbon": carbon, "la-balance": balance };
  const base = window.MVSims;
  window.MVSims = { mount: (el, kind) => { if (KIND[kind]) { if (el.dataset.on) return; el.dataset.on = 1; colors(); KIND[kind](el); } else if (base) base.mount(el, kind); } };
})();
