/* RE:TIDE 조석 다이어그램 두 개를 직접 그려요 (핀 #52, #53)
   - springneap: 1년 365일 조위 곡선. 그래프 위에서 스크롤하면 날짜가 넘어가요.
   - moon: 달이 0° → 15° → 30° … 돌며 바닷물 부풀음과 조차가 바뀌는 고리 시뮬레이션.
   숫자는 포트폴리오 값: M2 12.42 h · S2 12.00 h · 사리 조차 8.65 m · 조금 조차 3.11 m · 평균해면 +4.75 m */
(() => {
  const MSL = 4.75, AM = (8.65 + 3.11) / 4, AS = (8.65 - 3.11) / 4; // 2.94, 1.385
  const TM = 12.42, TS = 12.0, CYCLE = 1 / (1 / TS - 1 / TM) / 24; // 사리–조금 주기 ≈ 14.77일
  const NS = "http://www.w3.org/2000/svg";
  const DAY0 = Date.UTC(2026, 0, 1);
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = (d) => { const t = new Date(DAY0 + d * 864e5); return `${MON[t.getUTCMonth()]} ${t.getUTCDate()}`; };
  const hhmm = (d) => { const m = Math.round((d - Math.floor(d)) * 1440) % 1440; return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
  const OFF = 1.6; // 첫 사리가 1월 2일쯤 오도록 위상 이동 (일)
  const h = (d) => { const t = (d - OFF) * 24; return MSL + AM * Math.cos((2 * Math.PI * t) / TM) + AS * Math.cos((2 * Math.PI * t) / TS); };
  const range = (d) => 2 * Math.sqrt(AM * AM + AS * AS + 2 * AM * AS * Math.cos((2 * Math.PI * (d - OFF)) / CYCLE));
  const el = (tag, at = {}, par) => { const e = document.createElementNS(NS, tag); for (const k in at) e.setAttribute(k, at[k]); if (par) par.appendChild(e); return e; };
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  // 스크롤(휠)·드래그·키보드를 하나의 '목표값'으로 모아서 부드럽게 따라가게 해요
  const driver = (box, { get, set, min = -Infinity, max = Infinity, perWheel, perPx, onFrame, ease = 0.14 }) => {
    let tv = get(), cv = tv, raf = 0;
    const clamp = (v) => Math.min(max, Math.max(min, v));
    const loop = () => {
      cv += (tv - cv) * (reduce ? 1 : ease);
      if (Math.abs(tv - cv) < 1e-4) cv = tv;
      set(cv); onFrame && onFrame(cv);
      raf = cv !== tv ? requestAnimationFrame(loop) : 0;
    };
    const go = (v) => { tv = clamp(v); if (!raf) raf = requestAnimationFrame(loop); };
    box.addEventListener("wheel", (e) => {
      const d = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * (e.deltaMode === 1 ? 33 : 1);
      const next = clamp(tv + (d / 100) * perWheel);
      if (next === tv && (tv === min || tv === max)) return; // 끝에 닿으면 페이지가 계속 내려가요
      e.preventDefault(); go(next);
    }, { passive: false });
    let px = null;
    box.addEventListener("pointerdown", (e) => { if (e.pointerType === "mouse") return; px = e.clientX; });
    box.addEventListener("pointermove", (e) => { if (px == null) return; go(tv - (e.clientX - px) * perPx(box)); px = e.clientX; });
    addEventListener("pointerup", () => { px = null; });
    box.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); go(tv + perWheel); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); go(tv - perWheel); }
    });
    return { go, get tv() { return tv; } };
  };

  /* ---------- 1. 사리와 조금, 365일 ---------- */
  const springNeap = (root) => {
    const W = 1000, H = 400, L = 54, R = 150, T = 18, B = 40, VIEW = 15;
    const X = (d, s) => L + ((d - s) / VIEW) * (W - L - R), Y = (m) => T + ((11 - m) / 12.5) * (H - T - B);
    root.innerHTML = `
      <div class="tw-head"><span class="num"><b class="tw-days"></b></span><span class="mid tw-hint">Scroll over the graph — 365 days</span></div>
      <div class="tw-box" tabindex="0" aria-label="Tide over the year, scroll to move through the days"></div>
      <div class="tw-read num"><span class="tw-r"></span><span class="mid tw-p"></span></div>
      <div class="tw-year" aria-hidden="true"></div>`;
    const box = root.querySelector(".tw-box");
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "tw-svg" }, box);
    // 영역 띠: 위에서부터 늘 마름 / 사리 때만 젖음 / 매일 젖음 / 늘 젖음
    const nHW = MSL + AM - AS, sHW = MSL + AM + AS, nLW = MSL - AM + AS;
    [[11, sHW, "always dry"], [sHW, nHW, "wet near spring"], [nHW, nLW, "wet every day"], [nLW, -1.5, "always wet"]].forEach(([a, b, t], i) => {
      el("rect", { x: L, y: Y(a), width: W - L - R, height: Y(b) - Y(a), class: `tw-z z${i}` }, svg);
      const tx = el("text", { x: W - R + 12, y: (Y(a) + Y(b)) / 2 + 4, class: "tw-zt" }, svg); tx.textContent = t;
    });
    [0, 2, 4, 6, 8, 10].forEach((m) => {
      el("line", { x1: L, x2: W - R, y1: Y(m), y2: Y(m), class: "tw-g" }, svg);
      const t = el("text", { x: L - 8, y: Y(m) + 4, class: "tw-ax", "text-anchor": "end" }, svg); t.textContent = (m ? "+" : "") + m;
    });
    const msl = el("line", { x1: L, x2: W - R, y1: Y(MSL), y2: Y(MSL), class: "tw-msl" }, svg);
    const mslT = el("text", { x: L + 4, y: Y(MSL) - 5, class: "tw-ax" }, svg); mslT.textContent = "MSL +4.75";
    const days = el("g", {}, svg);
    // 물: 곡선 아래를 채우고 수면이 천천히 일렁여요 (안쪽 물결선 두 줄)
    const gid = "twg" + Math.random().toString(36).slice(2, 7), defs = el("defs", {}, svg), lg = el("linearGradient", { id: gid, x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
    el("stop", { offset: "0", class: "tw-ws0" }, lg); el("stop", { offset: "1", class: "tw-ws1" }, lg);
    const water = el("path", { class: "tw-water", fill: `url(#${gid})` }, svg), wl1 = el("path", { class: "tw-wl" }, svg), wl2 = el("path", { class: "tw-wl w2" }, svg);
    let base = [];
    const wave = (now) => {
      const t = now / 1000; let a = "", b = "", c = "";
      for (let i = 0; i < base.length; i++) {
        const [x, y] = base[i], r1 = reduce ? 0 : 1.6 * Math.sin(x * 0.045 + t * 1.7) + 1.1 * Math.sin(x * 0.11 - t * 1.15);
        a += (i ? "L" : "M") + x.toFixed(1) + " " + (y + r1).toFixed(1);
        b += (i ? "L" : "M") + x.toFixed(1) + " " + (y + 12 + (reduce ? 0 : 1.4 * Math.sin(x * 0.06 - t * 1.3))).toFixed(1);
        c += (i ? "L" : "M") + x.toFixed(1) + " " + (y + 26 + (reduce ? 0 : 1.2 * Math.sin(x * 0.08 + t * 0.9))).toFixed(1);
      }
      if (base.length) { water.setAttribute("d", a + `L${W - R} ${H - B}L${L} ${H - B}Z`); wl1.setAttribute("d", b); wl2.setAttribute("d", c); }
    };
    let vis = false, wraf = 0;
    const tick = (now) => { wave(now); wraf = vis && !reduce ? requestAnimationFrame(tick) : 0; };
    new IntersectionObserver(([e]) => { vis = e.isIntersecting; if (vis && !wraf) wraf = requestAnimationFrame(tick); }).observe(box);
    const envU = el("path", { class: "tw-env" }, svg), envD = el("path", { class: "tw-env" }, svg);
    const curve = el("path", { class: "tw-c" }, svg);
    const marks = el("g", {}, svg);
    const cur = el("g", { class: "tw-cur", style: "opacity:0" }, svg);
    el("line", { y1: T, y2: H - B, class: "tw-cl" }, cur); const dot = el("circle", { r: 4 }, cur); const ct = el("text", { y: T + 10, class: "tw-ax" }, cur);
    const year = root.querySelector(".tw-year");
    // 아래 1년 띠: 날마다 조차 막대 + 지금 보는 15일 창
    const ys = el("svg", { viewBox: `0 0 ${W} 46`, preserveAspectRatio: "none", class: "tw-ys" }, year);
    let bars = ""; for (let d = 0; d < 365; d += 0.5) { const r = range(d), x = L + (d / 365) * (W - L - R); bars += `M${x.toFixed(1)} ${(40 - r * 4).toFixed(1)}V40`; }
    el("path", { d: bars, class: "tw-yb" }, ys);
    for (let m = 0; m < 12; m++) { const d = (Date.UTC(2026, m, 1) - DAY0) / 864e5, x = L + (d / 365) * (W - L - R); el("line", { x1: x, x2: x, y1: 40, y2: 46, class: "tw-g" }, ys); }
    const win = el("rect", { y: 0, height: 46, width: (VIEW / 365) * (W - L - R), class: "tw-win" }, ys);
    const ml = document.createElement("div"); ml.className = "tw-mon num mid"; ml.innerHTML = MON.map((m) => `<span>${m}</span>`).join(""); year.appendChild(ml);
    const rd = root.querySelector(".tw-r"), pd = root.querySelector(".tw-p"), dd = root.querySelector(".tw-days");
    let s0 = 0;
    const draw = (s) => {
      s0 = s;
      let c = "", u = "", lo = "";
      for (let i = 0; i <= 900; i++) { const d = s + (i / 900) * VIEW; c += (i ? "L" : "M") + X(d, s).toFixed(1) + " " + Y(h(d)).toFixed(1); }
      for (let i = 0; i <= 90; i++) { const d = s + (i / 90) * VIEW, r = range(d) / 2; u += (i ? "L" : "M") + X(d, s).toFixed(1) + " " + Y(MSL + r).toFixed(1); lo += (i ? "L" : "M") + X(d, s).toFixed(1) + " " + Y(MSL - r).toFixed(1); }
      curve.setAttribute("d", c); envU.setAttribute("d", u); envD.setAttribute("d", lo);
      base = []; for (let i = 0; i <= 300; i++) { const d = s + (i / 300) * VIEW; base.push([X(d, s), Y(h(d))]); } wave(performance.now());
      // 날짜 눈금
      let g = ""; for (let d = Math.ceil(s); d <= s + VIEW; d++) {
        const x = X(d, s).toFixed(1);
        g += `<line x1="${x}" x2="${x}" y1="${T}" y2="${H - B}" class="tw-g"/>`;
        if (d % 2 === 0 || VIEW < 10) g += `<text x="${x}" y="${H - B + 16}" class="tw-ax" text-anchor="middle">${date(d)}</text>`;
      }
      days.innerHTML = g;
      // 사리(S)·조금(N) 표시
      let mk = ""; const k0 = Math.floor((s - OFF) / (CYCLE / 2)) - 1;
      for (let k = k0; k < k0 + 4; k++) {
        const d = OFF + k * (CYCLE / 2); if (d < s || d > s + VIEW) continue;
        const sp = k % 2 === 0, x = X(d, s).toFixed(1);
        mk += `<line x1="${x}" x2="${x}" y1="${Y(10.6)}" y2="${Y(sp ? sHW : nHW) - 6}" class="tw-mk"/><text x="${x}" y="${Y(10.6) - 4}" class="tw-ax tw-b" text-anchor="middle">${sp ? "SPRING" : "NEAP"} · ${range(d).toFixed(2)} m</text>`;
      }
      marks.innerHTML = mk;
      win.setAttribute("x", L + (s / 365) * (W - L - R));
      const mid = s + VIEW / 2, r = range(mid);
      dd.textContent = `Day ${Math.floor(s) + 1}–${Math.min(365, Math.floor(s) + VIEW)} / 365 · ${date(s)} – ${date(s + VIEW - 1)}`;
      rd.textContent = `Range ${r.toFixed(2)} m`;
      const ph = (((mid - OFF) / CYCLE) % 1 + 1) % 1;
      pd.textContent = ph < 0.15 || ph > 0.85 ? "near spring — the two pulls in line" : ph > 0.35 && ph < 0.65 ? "near neap — the two pulls at right angles" : ph < 0.5 ? "falling to neap" : "rising to spring";
      if (hx != null) hover(hx);
    };
    let hx = null;
    const hover = (cx) => {
      hx = cx; const r = box.getBoundingClientRect(), vx = ((cx - r.left) / r.width) * W;
      if (vx < L || vx > W - R) { cur.style.opacity = 0; return; }
      const d = s0 + ((vx - L) / (W - L - R)) * VIEW, m = h(d);
      cur.style.opacity = 1; cur.querySelectorAll("line").forEach((l) => { l.setAttribute("x1", vx); l.setAttribute("x2", vx); });
      dot.setAttribute("cx", vx); dot.setAttribute("cy", Y(m));
      ct.setAttribute("x", vx + (vx > W - R - 150 ? -8 : 8)); ct.setAttribute("text-anchor", vx > W - R - 150 ? "end" : "start");
      ct.textContent = `${date(d)} ${hhmm(d - OFF + OFF)} · ${m >= 0 ? "+" : ""}${m.toFixed(2)} m`;
    };
    box.addEventListener("mousemove", (e) => hover(e.clientX));
    box.addEventListener("mouseleave", () => { hx = null; cur.style.opacity = 0; });
    const drv = driver(box, { get: () => 0, set: draw, min: 0, max: 365 - VIEW, perWheel: 1.2, perPx: (b) => VIEW / b.getBoundingClientRect().width });
    year.addEventListener("click", (e) => { const r = year.getBoundingClientRect(), f = ((e.clientX - r.left) / r.width * W - L) / (W - L - R); drv.go(f * 365 - VIEW / 2); });
    draw(0);
  };

  /* ---------- 2. 달: 0° → 15° → 30° … 고리 ---------- */
  const moon = (root) => {
    const W = 1000, H = 460, EX = 330, EY = 230, RO = 175, RE = 58;
    root.innerHTML = `
      <div class="tw-head"><span class="num"><b class="tw-ang"></b></span><span class="mid tw-hint">Scroll over the drawing — the moon goes round</span></div>
      <div class="tw-box" tabindex="0" aria-label="Moon and tide, scroll to turn the moon"></div>
      <div class="tw-read num"><span class="tw-r"></span><span class="mid tw-p"></span></div>`;
    const box = root.querySelector(".tw-box");
    const svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "tw-svg" }, box);
    // 해: 왼쪽에서 오는 평행광
    for (let i = -4; i <= 4; i++) el("line", { x1: 18, x2: 92, y1: EY + i * 34, y2: EY + i * 34, class: "tw-ray" }, svg);
    const st = el("text", { x: 18, y: EY - 4 * 34 - 12, class: "tw-ax tw-b" }, svg); st.textContent = "SUN";
    el("circle", { cx: EX, cy: EY, r: RO, class: "tw-orb" }, svg);
    for (let a = 0; a < 360; a += 15) {
      const r = (a * Math.PI) / 180, x = EX - Math.cos(r) * RO, y = EY + Math.sin(r) * RO;
      el("line", { x1: x, y1: y, x2: EX - Math.cos(r) * (RO + (a % 90 ? 5 : 10)), y2: EY + Math.sin(r) * (RO + (a % 90 ? 5 : 10)), class: "tw-tk" }, svg);
      if (a % 90 === 0) { const t = el("text", { x: EX - Math.cos(r) * (RO + 24), y: EY + Math.sin(r) * (RO + 24) + 4, class: "tw-ax", "text-anchor": "middle" }, svg); t.textContent = a + "°"; }
    }
    const sea = el("path", { class: "tw-sea" }, svg);
    el("circle", { cx: EX, cy: EY, r: RE + 5, class: "tw-atm" }, svg);
    el("circle", { cx: EX, cy: EY, r: RE, class: "tw-earth" }, svg);
    const cid = "twe" + Math.random().toString(36).slice(2, 7), cp = el("clipPath", { id: cid }, el("defs", {}, svg));
    el("circle", { cx: EX, cy: EY, r: RE }, cp);
    const globe = el("g", { "clip-path": `url(#${cid})` }, svg);
    [-60, -30, 0, 30, 60].forEach((la) => { const y = EY - RE * Math.sin((la * Math.PI) / 180), w = RE * Math.cos((la * Math.PI) / 180); el("ellipse", { cx: EX, cy: y, rx: w, ry: w * 0.14, class: "tw-lat" + (la ? "" : " eq") }, globe); });
    const mer = el("g", {}, globe);
    // 대륙은 단순화한 윤곽(경도·위도 점) — 자전에 맞춰 옆으로 흘러가요
    const LAND = [
      [[100,72],[140,72],[178,66],[160,58],[142,52],[135,43],[127,38],[121,31],[110,20],[104,10],[98,16],[92,22],[80,8],[72,20],[60,25],[50,30],[40,40],[30,46],[28,60],[40,68],[70,72]],
      [[-10,36],[10,37],[32,31],[43,12],[51,11],[40,-15],[32,-28],[20,-35],[12,-17],[9,4],[-8,5],[-17,15],[-15,28]],
      [[-165,65],[-140,70],[-95,72],[-75,62],[-60,47],[-75,35],[-81,25],[-97,19],[-105,22],[-117,32],[-125,48],[-150,60]],
      [[-80,10],[-60,8],[-35,-6],[-40,-22],[-58,-38],[-70,-52],[-73,-38],[-70,-18],[-81,-5]],
      [[114,-22],[130,-12],[142,-11],[153,-27],[146,-39],[135,-35],[115,-34]],
    ];
    const land = el("g", { class: "tw-land" }, globe);
    const site = el("circle", { r: 2.6, class: "tw-site" }, globe);
    const spin = (rot) => {
      // 정사영: 보이는 반구(경도 차 ±90°)만 그려요
      const pr = (lo, la) => { const l = ((lo + rot + 540) % 360) - 180, a = (l * Math.PI) / 180, p = (la * Math.PI) / 180; return [Math.cos(p) * Math.sin(a), Math.sin(p), Math.cos(p) * Math.cos(a)]; };
      let m = ""; for (let lo = 0; lo < 180; lo += 30) { const l = (((lo + rot) % 180) + 180) % 180 - 90, rx = Math.abs(RE * Math.sin((l * Math.PI) / 180)); m += `<ellipse cx="${EX}" cy="${EY}" rx="${rx.toFixed(1)}" ry="${RE}" class="tw-lon"/>`; }
      mer.innerHTML = m;
      let g = "";
      LAND.forEach((poly) => {
        const pts = poly.map(([lo, la]) => pr(lo, la)); if (!pts.some((q) => q[2] > 0)) return;
        g += `<path d="${pts.map(([x, y, z], i) => { const k = z > 0 ? 1 : 1 / (Math.hypot(x, y) || 1); return (i ? "L" : "M") + (EX + RE * x * k).toFixed(1) + " " + (EY - RE * y * k).toFixed(1); }).join("")}Z"/>`;
      });
      land.innerHTML = g;
      const [sx, sy, sz] = pr(126.6, 37.5); site.setAttribute("cx", EX + RE * sx); site.setAttribute("cy", EY - RE * sy); site.style.opacity = sz > 0 ? 1 : 0;
    };
    el("path", { d: `M${EX} ${EY - RE}A${RE} ${RE} 0 0 1 ${EX} ${EY + RE}Z`, class: "tw-night" }, svg);
    el("line", { x1: EX - 6, y1: EY - RE - 12, x2: EX + 6, y2: EY + RE + 12, class: "tw-axis" }, svg);
    const pull = el("line", { class: "tw-pull" }, svg);
    const mg = el("g", {}, svg);
    el("circle", { r: 15, class: "tw-mn" }, mg);
    el("path", { d: "M0 -15A15 15 0 0 1 0 15Z", class: "tw-night" }, mg);
    // 오른쪽: 각도에 따른 조차 곡선 (0–360°, 고리로 이어짐)
    const GX = 610, GW = 350, GY = 120, GH = 220;
    const gy = (r) => GY + GH - ((r - 2.5) / 7) * GH;
    el("rect", { x: GX, y: GY, width: GW, height: GH, class: "tw-gb" }, svg);
    [3.11, 8.65].forEach((r) => {
      el("line", { x1: GX, x2: GX + GW, y1: gy(r), y2: gy(r), class: "tw-g" }, svg);
      const t = el("text", { x: GX - 8, y: gy(r) + 4, class: "tw-ax", "text-anchor": "end" }, svg); t.textContent = r.toFixed(2) + " m";
    });
    let gc = ""; for (let a = 0; a <= 360; a += 3) { const r = 2 * Math.sqrt(AM * AM + AS * AS + 2 * AM * AS * Math.cos((2 * a * Math.PI) / 180)); gc += (a ? "L" : "M") + (GX + (a / 360) * GW).toFixed(1) + " " + gy(r).toFixed(1); }
    el("path", { d: gc, class: "tw-c" }, svg);
    [[0, "new"], [90, "first q."], [180, "full"], [270, "last q."], [360, "new"]].forEach(([a, n]) => {
      const x = GX + (a / 360) * GW; el("line", { x1: x, x2: x, y1: GY + GH, y2: GY + GH + 5, class: "tw-tk" }, svg);
      const t = el("text", { x, y: GY + GH + 18, class: "tw-ax", "text-anchor": "middle" }, svg); t.textContent = a + "°";
      const t2 = el("text", { x, y: GY + GH + 18, dy: "1.3em", class: "tw-ax tw-m", "text-anchor": "middle" }, svg); t2.textContent = n;
    });
    const gt = el("text", { x: GX, y: GY - 12, class: "tw-ax tw-b" }, svg); gt.textContent = "TIDAL RANGE BY THE MOON'S ANGLE";
    const gl = el("line", { y1: GY, y2: GY + GH, class: "tw-cl" }, svg), gd = el("circle", { r: 4.5, class: "tw-gd" }, svg);
    const ang = root.querySelector(".tw-ang"), rd = root.querySelector(".tw-r"), pd = root.querySelector(".tw-p");
    const NAME = (a) => a < 7.5 || a >= 352.5 ? "New moon" : a < 82.5 ? "Waxing crescent" : a < 97.5 ? "First quarter" : a < 172.5 ? "Waxing gibbous" : a < 187.5 ? "Full moon" : a < 262.5 ? "Waning gibbous" : a < 277.5 ? "Last quarter" : "Waning crescent";
    const draw = (deg) => {
      const a = ((deg % 360) + 360) % 360, r = (a * Math.PI) / 180;
      const mx = EX - Math.cos(r) * RO, my = EY + Math.sin(r) * RO;
      mg.setAttribute("transform", `translate(${mx.toFixed(1)} ${my.toFixed(1)})`);
      pull.setAttribute("x1", EX); pull.setAttribute("y1", EY); pull.setAttribute("x2", mx); pull.setAttribute("y2", my);
      // 바닷물: 달 방향 부풀음 + 해 방향 부풀음 (과장해서 그림)
      const phiM = Math.atan2(-(my - EY), mx - EX); let d = "";
      for (let i = 0; i <= 120; i++) {
        const f = (i / 120) * Math.PI * 2, rr = RE + 16 + 15 * Math.cos(2 * (f - phiM)) + 7 * Math.cos(2 * (f - Math.PI));
        d += (i ? "L" : "M") + (EX + Math.cos(f) * rr).toFixed(1) + " " + (EY - Math.sin(f) * rr).toFixed(1);
      }
      sea.setAttribute("d", d + "Z");
      spin(-(deg * 29.53) % 360);
      const R = 2 * Math.sqrt(AM * AM + AS * AS + 2 * AM * AS * Math.cos(2 * r));
      const x = GX + (a / 360) * GW; gl.setAttribute("x1", x); gl.setAttribute("x2", x); gd.setAttribute("cx", x); gd.setAttribute("cy", gy(R));
      ang.textContent = `${String(Math.round(a)).padStart(3, "0")}° · day ${((a / 360) * 29.53).toFixed(1)} of 29.5`;
      rd.textContent = `Range ${R.toFixed(2)} m`;
      const c = Math.cos(2 * r);
      pd.textContent = `${NAME(a)} — ${c > 0.7 ? "spring: sun and moon pull in line" : c < -0.7 ? "neap: the pulls at right angles cancel" : c > 0 ? "towards spring" : "towards neap"}`;
    };
    // 휠 한 칸 = 15°, 끝없이 이어지는 고리
    driver(box, { get: () => 0, set: draw, perWheel: 15, perPx: () => 0.6 });
    draw(0);
  };

  /* ---------- 3. 한 프레임, 100년 — 휠로 돌리는 고리 ---------- */
  const STAGES = [
    ["Design", "One grid, one node, one catalogue. Every post lands on a node of the 4,500 grid at FTF 3,300; home cells are catalogue modules, 4,480 square and 3,280 high."],
    ["Factory", "A moving line under cover, while the base is cast. Frames are welded in a jig, then floor, pod, walls, ceiling and facade go in; each module is tested, labelled and wrapped."],
    ["Road", "One module, one trip. Numbered by block, level and cell, lashed at its corner fittings, it rides a low-bed under the 4.0 m limit, timed to the crane."],
    ["Crane", "Cores first, then lift, pin, bolt, tie. Each module lands on taper pins, one tie plate and M24 bolts close every node: 12 to 15 modules a day."],
    ["Live + adapt", "Two cells become one home. The party-wall cassette is unscrewed and taken out while posts, beams and nodes stay. Hand tools, no crane."],
    ["Renew", "The facade and pod go, the frame stays. Cassettes leave their brackets by mobile crane with no scaffold. Skins last 25 to 30 years, pods 15 to 20."],
    ["Take apart", "The assembly in reverse, nothing cut. Each module lifts off its pins whole, top storey first. Only sealants and fire-stops are waste."],
    ["Use again", "Checked, re-coated, stacked again. Back in the jig each frame is blast-cleaned, re-coated and given new bolts, seals and a passport for its next address."],
  ];
  const loop = (root) => {
    const src = root.dataset.src, A0 = 24, CX = 50, CY = 49.4;
    root.innerHTML = `
      <div class="tw-lw" tabindex="0" aria-label="The loop, scroll to turn through the eight stages">
        <img src="${src}" alt="The loop, eight stages" decoding="async">
        <svg viewBox="0 0 100 100" aria-hidden="true"><path class="tw-lv" fill-rule="evenodd"/><line class="tw-lh" x1="${CX}" y1="${CY}"/><circle class="tw-lc" r=".9"/></svg>
      </div>
      <div class="tw-lt">
        <p class="num tw-ln"><b>01</b> / 08</p>
        <h3 class="tw-lk"></h3><p class="tw-ld"></p>
        <ol class="tw-ll">${STAGES.map(([t], i) => `<li><span class="num mid">0${i + 1}</span> ${t}</li>`).join("")}</ol>
        <p class="mid tw-hint">Scroll over the loop to turn it</p>
      </div>`;
    const box = root.querySelector(".tw-lw"), v = root.querySelector(".tw-lv"), h = root.querySelector(".tw-lh"), c = root.querySelector(".tw-lc");
    const n = root.querySelector(".tw-ln b"), k = root.querySelector(".tw-lk"), d = root.querySelector(".tw-ld"), lis = [...root.querySelectorAll(".tw-ll li")];
    const P = (a, r) => { const t = (a * Math.PI) / 180; return [CX + r * Math.sin(t), CY - r * Math.cos(t)]; };
    let cur = -1;
    const draw = (x) => {
      const a = A0 + x * 45, [p1, q1] = P(a - 22.5, 75), [p2, q2] = P(a + 22.5, 75), [hx, hy] = P(a, 17);
      v.setAttribute("d", `M0 0H100V100H0Z M${CX} ${CY}L${p1} ${q1}A75 75 0 0 1 ${p2} ${q2}Z`);
      h.setAttribute("x2", hx); h.setAttribute("y2", hy); c.setAttribute("cx", hx); c.setAttribute("cy", hy);
      const i = Math.round(x);
      if (i !== cur) {
        cur = i; n.textContent = "0" + (i + 1); k.textContent = STAGES[i][0]; d.textContent = STAGES[i][1];
        lis.forEach((l, j) => l.classList.toggle("on", j === i));
        root.classList.add("chg"); requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("chg")));
      }
    };
    const drv = driver(box, { get: () => 0, set: draw, min: 0, max: 7, perWheel: 0.25, perPx: (b) => 8 / b.getBoundingClientRect().width });
    lis.forEach((l, j) => l.addEventListener("click", () => drv.go(j)));
    draw(0);
  };

  /* ---------- 4. 한 번의 조석을 시계로 (12시간 25분 = 한 바퀴) ---------- */
  const T1 = 12.42, LOW = 2.43, HIGH = 7.04;
  const hAt = (t) => (LOW + HIGH) / 2 - ((HIGH - LOW) / 2) * Math.cos((2 * Math.PI * t) / T1);
  const hm = (t) => `${Math.floor(t)} h ${String(Math.round((t % 1) * 60)).padStart(2, "0")} min`;
  const dial = (root) => {
    const S = 500, C = 250, R0 = 70, K = 22, RING = 214;
    root.innerHTML = `
      <div class="tw-head"><span class="num"><b class="tw-dt"></b></span><span class="mid tw-hint">Scroll over the dial — one tide, 12 h 25 min</span></div>
      <div class="tw-box tw-dbox" tabindex="0" aria-label="One tide as a dial, scroll to turn the hour"></div>
      <div class="tw-read num"><span class="tw-r"></span><span class="mid tw-p"></span></div>`;
    const box = root.querySelector(".tw-box"), svg = el("svg", { viewBox: `0 0 ${S} ${S}`, class: "tw-svg" }, box);
    const P = (t, r) => { const a = (2 * Math.PI * t) / T1; return [C + r * Math.sin(a), C - r * Math.cos(a)]; };
    // 높이 고리(눈금 원) + 시각 눈금
    [2, 4, 6, 8].forEach((m) => el("circle", { cx: C, cy: C, r: R0 + K * m, class: "tw-grid" }, svg));
    for (let hr = 0; hr < 12.4; hr += 1) {
      const [x1, y1] = P(hr, RING - 6), [x2, y2] = P(hr, RING + 4), [tx, ty] = P(hr, RING + 20);
      el("line", { x1, y1, x2, y2, class: "tw-tick" }, svg);
      const tt = el("text", { x: tx, y: ty + 4, class: "tw-hr" }, svg); tt.textContent = hr || "0";
    }
    el("circle", { cx: C, cy: C, r: RING, class: "tw-ring" }, svg);
    // 한 바퀴 동안의 수위 곡선(연하게) + 지금까지 쓸고 지나간 부분(진하게)
    let full = ""; for (let i = 0; i <= 240; i++) { const t = (T1 * i) / 240, [x, y] = P(t, R0 + K * hAt(t)); full += (i ? "L" : "M") + x.toFixed(1) + " " + y.toFixed(1); }
    el("path", { d: full + "Z", class: "tw-dfull" }, svg);
    const sweep = el("path", { class: "tw-dsweep" }, svg);
    const hand = el("line", { x1: C, y1: C, class: "tw-hand" }, svg), dot = el("circle", { r: 5, class: "tw-dot" }, svg);
    el("circle", { cx: C, cy: C, r: R0 - 8, class: "tw-hole" }, svg);
    const big = el("text", { x: C, y: C - 2, class: "tw-big" }, svg), sub = el("text", { x: C, y: C + 18, class: "tw-sub" }, svg);
    const dt = root.querySelector(".tw-dt"), rr = root.querySelector(".tw-r"), rp = root.querySelector(".tw-p");
    const draw = (t) => {
      let d = `M${C} ${C}`; const n = Math.max(2, Math.round((t / T1) * 240));
      for (let i = 0; i <= n; i++) { const u = (t * i) / n, [x, y] = P(u, R0 + K * hAt(u)); d += "L" + x.toFixed(1) + " " + y.toFixed(1); }
      sweep.setAttribute("d", d + "Z");
      const [x, y] = P(t, R0 + K * hAt(t)), [hx, hy] = P(t, RING);
      hand.setAttribute("x2", hx); hand.setAttribute("y2", hy); dot.setAttribute("cx", x); dot.setAttribute("cy", y);
      const h = hAt(t), rising = t < T1 / 2;
      big.textContent = `+${h.toFixed(2)} m`; sub.textContent = hm(t);
      dt.textContent = hm(t) + " / 12 h 25 min";
      rr.textContent = `+${h.toFixed(2)} m`; rp.textContent = t < 0.05 ? "low water" : Math.abs(t - T1 / 2) < 0.08 ? "high water" : rising ? "flood — the sea is rising" : "ebb — the sea is falling";
    };
    driver(box, { get: () => 0, set: draw, min: 0, max: T1, perWheel: 0.32, perPx: (b) => T1 / b.getBoundingClientRect().width });
    draw(0);
  };

  /* ---------- 5. 12분의 1 법칙과 사인곡선 ---------- */
  const sine = (root) => {
    const W = 1010, H = 290, CX = 120, CY = 145, RA = 100, X0 = 260, X1 = 980;
    const X = (t) => X0 + (t / T1) * (X1 - X0), Y = (t) => CY + RA * Math.cos((2 * Math.PI * t) / T1);
    const TW = [1, 2, 3, 3, 2, 1, 1, 2, 3, 3, 2, 1];
    root.innerHTML = `
      <div class="tw-head"><span class="num"><b class="tw-st"></b></span><span class="mid tw-hint">Scroll over the curve — hour by hour</span></div>
      <div class="tw-box" tabindex="0" aria-label="Rule of twelfths, scroll to move through the hours"></div>
      <div class="tw-read num"><span class="tw-r"></span><span class="mid tw-p"></span></div>`;
    const box = root.querySelector(".tw-box"), svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "tw-svg" }, box);
    el("circle", { cx: CX, cy: CY, r: RA, class: "tw-ring" }, svg);
    for (let k = 0; k < 12; k++) { const a = (k / 12) * 2 * Math.PI; el("line", { x1: CX, y1: CY, x2: CX + RA * Math.sin(a), y2: CY + RA * Math.cos(a), class: "tw-grid" }, svg); }
    el("line", { x1: 20, y1: CY, x2: W - 10, y2: CY, class: "tw-grid" }, svg);
    [["+A", CY - RA], ["Z₀", CY], ["−A", CY + RA]].forEach(([t, y]) => { const tx = el("text", { x: X0 - 12, y: y + 4, class: "tw-ax" }, svg); tx.textContent = t; el("line", { x1: X0, y1: y, x2: X1 + 10, y2: y, class: "tw-guide" }, svg); });
    // 시간마다 오르는 양(12분의 몇) 막대 — 지나간 시간은 진하게
    const steps = TW.map((n, k) => { const t0 = (k * T1) / 12, t1 = ((k + 1) * T1) / 12; const g = el("g", { class: "tw-tw" }, svg);
      el("path", { d: `M${X(t0)} ${Y(t0)}H${X(t1)}V${Y(t1)}`, class: "tw-step" }, g);
      const tx = el("text", { x: X(t1) + 5, y: (Y(t0) + Y(t1)) / 2 + 4, class: "tw-twn" }, g); tx.textContent = n; return g; });
    let d = ""; for (let i = 0; i <= 240; i++) { const t = (T1 * i) / 240; d += (i ? "L" : "M") + X(t).toFixed(1) + " " + Y(t).toFixed(1); }
    el("path", { d, class: "tw-curve" }, svg);
    const lab = [["0  low water", 0], ["T/2  high water", T1 / 2], ["T = 12 h 25 min", T1]];
    lab.forEach(([t, u], i) => { const tx = el("text", { x: X(u), y: H - 6, class: "tw-ax" + (i === 2 ? " end" : i === 1 ? " mid" : "") }, svg); tx.textContent = t; });
    const proj = el("line", { class: "tw-proj" }, svg), arm = el("line", { x1: CX, y1: CY, class: "tw-hand" }, svg);
    const pd = el("circle", { r: 5, class: "tw-dot" }, svg), cd = el("circle", { r: 5, class: "tw-dot" }, svg);
    const st = root.querySelector(".tw-st"), rr = root.querySelector(".tw-r"), rp = root.querySelector(".tw-p");
    const draw = (t) => {
      const a = (2 * Math.PI * t) / T1, px = CX - RA * Math.sin(a), py = CY + RA * Math.cos(a), x = X(t), y = Y(t);
      arm.setAttribute("x2", px); arm.setAttribute("y2", py); pd.setAttribute("cx", px); pd.setAttribute("cy", py);
      cd.setAttribute("cx", x); cd.setAttribute("cy", y);
      proj.setAttribute("x1", px); proj.setAttribute("y1", py); proj.setAttribute("x2", x); proj.setAttribute("y2", y);
      const k = Math.min(11, Math.floor((t / T1) * 12));
      steps.forEach((g, j) => g.classList.toggle("on", j < k || (j === k && t > 0.01)));
      steps.forEach((g, j) => g.classList.toggle("now", j === k && t > 0.01));
      st.textContent = `hour ${k + 1} of 12`;
      rr.textContent = `${TW[k]}/12 of the range`;
      rp.textContent = k < 6 ? "this hour, rising — slow at the ends, fastest in the middle" : "this hour, falling — the same twelfths in reverse";
    };
    driver(box, { get: () => 0, set: draw, min: 0, max: T1, perWheel: 0.3, perPx: (b) => T1 / b.getBoundingClientRect().width });
    draw(0);
  };

  /* ---------- 6. 흐름 층 다섯 개 ↔ 프로그램 21개 링크 다이어그램 (핀 #104) ---------- */
  const flow = (root) => {
    const P = { 1: "Aquarium", 2: "Ferry pier", 3: "Sea-pool programs", 4: "Open-air theater", 5: "Food & beverage", 6: "Intertidal library", 7: "Public library", 8: "Waterfront dining & bar", 9: "Public plaza", 10: "Maritime museum", 11: "Dye-plant workshop", 12: "Water-taxi stop", 13: "Aquarium", 14: "Fish market", 15: "Sea pool", 16: "Tidal energy plaza", 17: "Floating market", 18: "Market", 19: "Reef observatory", 20: "Marine research", 21: "Marine activity center" };
    // [이름, 중앙 높이, 면적, 폭, 설명, 바로 닿는 프로그램, 옅게 이어지는 프로그램]
    const LY = [
      ["Flow layer 1", 1.7, "7,346 m²", "6.0 m", "The low outer edge, dry 9.7 % of the year: a shore that opens at low water, where the boats, the reef and the tide's energy meet the site; it wraps one mound, M12.", [1, 2, 4, 5, 9, 14, 18, 21], [10, 11, 16, 17, 19, 20]],
      ["Flow layer 2", 5.14, "10,512 m²", "7.5 m", "The widest strip, at mean sea level and dry about half the year: the daily route between seven mounds, from the plaza and theater to the libraries and markets.", [4, 5, 7, 8, 9, 12, 13, 15, 18], [6, 10, 11, 16, 17, 19, 20]],
      ["Flow layer 3", 7.0, "7,039 m²", "5.0 m", "Just under mean high water, dry four days in five: a loop around seven mounds that keeps the libraries, the markets and the reef's research rooms within reach.", [7, 9, 12, 13, 14, 18, 21], [6, 16, 17, 19, 20]],
      ["Flow layer 4", 9.44, "4,235 m²", "3.9 m", "Above all but the highest tides and the narrowest: a ridge path over six mounds to the water-taxi stop, the sea pool and the markets.", [12, 13, 15, 18, 21], [16, 17]],
      ["Flow layer 5", 10.07, "5,128 m²", "5.3 m", "The high inner ground on the mound tops, never under water: the dry crowns of M01 to M07 that hold the museum, the workshop and the sea pools.", [3, 8, 14, 15, 21], [10, 11, 19, 20]],
    ];
    const W = 1000, H = 560, LX = 150, PX = 600, Y0 = 500, Y1 = 70;
    const ly = (m) => Y0 - ((m - 1.7) / (10.07 - 1.7)) * (Y0 - Y1);
    // 프로그램 순서: 이어진 층 높이의 평균이 높은 것이 위
    const ids = Object.keys(P).map(Number);
    const avg = {}; ids.forEach((id) => { const ls = LY.map((l, i) => (l[5].includes(id) || l[6].includes(id) ? i : null)).filter((v) => v != null); avg[id] = ls.reduce((a, b) => a + LY[b][1], 0) / ls.length; });
    ids.sort((a, b) => avg[b] - avg[a] || a - b);
    const py = {}; ids.forEach((id, k) => { py[id] = 40 + (k * (H - 70)) / (ids.length - 1); });
    root.innerHTML = `
      <div class="tw-head"><span class="num"><b class="tw-fn"></b></span><span class="mid tw-hint">Scroll over the diagram — layer by layer, low to high</span></div>
      <div class="tw-fg">
        <div class="tw-box" tabindex="0" aria-label="Flow layers and programs, scroll to step through the layers"></div>
        <div class="tw-fside"><div class="tw-fplan"><img src="assets/img/re-tide/flow-layers.jpg" alt="" decoding="async"></div><p class="tw-fd"></p></div>
      </div>
      <div class="tw-read num"><span class="tw-r"></span><span class="mid tw-p"></span></div>`;
    const box = root.querySelector(".tw-box"), svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "tw-svg" }, box);
    // 높이 눈금
    [2.43, 4.75, 7.04, 9.5].forEach((m) => { el("line", { x1: 60, x2: LX - 14, y1: ly(m), y2: ly(m), class: "tw-guide" }, svg); const t = el("text", { x: 56, y: ly(m) + 4, class: "tw-ax end" }, svg); t.textContent = "+" + m.toFixed(2); });
    el("line", { x1: 60, x2: 60, y1: Y1 - 20, y2: Y0 + 20, class: "tw-tick" }, svg);
    const ht = el("text", { x: 60, y: Y1 - 32, class: "tw-ax mid" }, svg); ht.textContent = "GROUND, m";
    const links = el("g", {}, svg), lnk = [];
    LY.forEach((l, i) => [[l[5], 0], [l[6], 1]].forEach(([arr, weak]) => arr.forEach((id) => {
      const y1 = ly(l[1]), y2 = py[id], mx = (LX + PX) / 2;
      lnk.push({ i, id, e: el("path", { d: `M${LX} ${y1}C${mx} ${y1} ${mx} ${y2} ${PX} ${y2}`, class: "tw-fl" + (weak ? " weak" : "") }, links) });
    })));
    const lyg = LY.map((l, i) => { const g = el("g", { class: "tw-fly" }, svg), y = ly(l[1]);
      el("circle", { cx: LX, cy: y, r: 7 }, g); const t = el("text", { x: LX + 14, y: y - 10, class: "tw-ax" }, g); t.textContent = `0${i + 1}  +${l[1].toFixed(2)}`;
      g.addEventListener("mouseenter", () => drv.go(i)); return g; });
    const pg = {}; ids.forEach((id) => { const g = el("g", { class: "tw-fp" }, svg);
      el("circle", { cx: PX, cy: py[id], r: 3.5 }, g); const t = el("text", { x: PX + 12, y: py[id] + 4, class: "tw-ax" }, g); t.textContent = `${String(id).padStart(2, "0")}  ${P[id]}`;
      g.addEventListener("mouseenter", () => hot(id)); g.addEventListener("mouseleave", () => hot(null)); pg[id] = g; });
    const fn = root.querySelector(".tw-fn"), rr = root.querySelector(".tw-r"), rp = root.querySelector(".tw-p"), fd = root.querySelector(".tw-fd"), img = root.querySelector(".tw-fplan img");
    let cur = -1, over = null;
    const paint = () => {
      lnk.forEach((k) => { k.e.classList.toggle("on", over ? k.id === over : k.i === cur); k.e.classList.toggle("off", over ? k.id !== over : k.i !== cur); });
      lyg.forEach((g, i) => g.classList.toggle("on", over ? LY[i][5].includes(over) || LY[i][6].includes(over) : i === cur));
      ids.forEach((id) => { const l = LY[cur]; pg[id].classList.toggle("on", over ? id === over : l[5].includes(id)); pg[id].classList.toggle("half", !over && l[6].includes(id)); });
    };
    const hot = (id) => { over = id; paint(); };
    const set = (v) => {
      const i = Math.max(0, Math.min(4, Math.round(v))); if (i === cur) return; cur = i; const l = LY[i];
      fn.textContent = `0${i + 1} ${l[0]} · median +${l[1].toFixed(2)} m`;
      rr.textContent = `${l[5].length + l[6].length} links · ${l[2]} · ${l[3]} wide`;
      rp.textContent = `${l[5].length} programs on the strip, ${l[6].length} reached across it`;
      fd.textContent = l[4]; img.style.transform = `translateX(${-i * 20}%)`;
      paint();
    };
    const drv = driver(box, { get: () => 0, set, min: 0, max: 4, perWheel: 0.34, perPx: (b) => 4 / b.getBoundingClientRect().width });
    set(0);
  };

  /* ---------- 7. Motorism 원형 도착: 차는 정해진 고리를 돌고, 부스가 차에게 다가와요 (핀 #112) ---------- */
  const orbit = (root) => {
    const W = 1000, H = 440, CX = 230, CY = 220, RC = 46, RR = 140, RB = 196, RIN = 160, N = 12;
    root.innerHTML = `
      <div class="tw-head"><span class="num"><b class="tw-oa"></b></span><span class="mid tw-hint">Scroll over the drawing — drive the loop</span></div>
      <div class="tw-box" tabindex="0" aria-label="Circular arrival, scroll to drive around the loop"></div>
      <div class="tw-read num"><span class="tw-r"></span><span class="mid tw-p"></span></div>`;
    const box = root.querySelector(".tw-box"), svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "tw-svg" }, box);
    for (let r = 60; r <= 215; r += 7) el("circle", { cx: CX, cy: CY, r, class: "tw-om" }, svg);
    [RC, RC - 12, RC - 24].forEach((r) => el("circle", { cx: CX, cy: CY, r, class: "tw-ring" }, svg));
    el("circle", { cx: CX, cy: CY, r: 4, class: "tw-dot" }, svg);
    const ct = el("text", { x: CX, y: CY - RC - 10, class: "tw-ax mid" }, svg); ct.textContent = "CORE";
    el("circle", { cx: CX, cy: CY, r: RR, class: "tw-ring tw-oroute" }, svg);
    el("circle", { cx: CX, cy: CY, r: RB + 14, class: "tw-dfull" }, svg);
    const P = (a, r) => [CX + r * Math.sin(a), CY - r * Math.cos(a)];
    // 펼친 경로 (01 직선 찾기와 같은 줄)
    const UX0 = 520, UX1 = 960, UY = 300;
    el("line", { x1: UX0, x2: UX1, y1: UY, y2: UY, class: "tw-ring" }, svg);
    const ut = el("text", { x: UX0, y: UY + 34, class: "tw-ax" }, svg); ut.textContent = "THE SAME LOOP, UNROLLED — 0° → 360°";
    const booths = [];
    for (let k = 0; k < N; k++) {
      const a = (k / N) * Math.PI * 2 + 0.2, g = el("g", { class: "tw-ob" }, svg);
      const tie = el("line", { class: "tw-otie" }, g), sq = el("rect", { width: 20, height: 20, x: -10, y: -10 }, g);
      const ux = UX0 + ((a / (Math.PI * 2)) % 1) * (UX1 - UX0), u = el("rect", { x: ux - 5, y: UY - 26, width: 10, height: 10, class: "tw-ou" }, svg);
      booths.push({ a, g, tie, sq, u });
    }
    const car = el("g", { class: "tw-car" }, svg); el("rect", { x: -9, y: -5, width: 18, height: 10, rx: 2 }, car);
    const uc = el("circle", { cy: UY, r: 5, class: "tw-dot" }, svg);
    const oa = root.querySelector(".tw-oa"), rr = root.querySelector(".tw-r"), rp = root.querySelector(".tw-p");
    const set = (deg) => {
      const a = (deg * Math.PI) / 180, [x, y] = P(a, RR);
      car.setAttribute("transform", `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg % 360})`);
      uc.setAttribute("cx", UX0 + ((deg % 360) / 360) * (UX1 - UX0));
      let near = 0;
      booths.forEach((b) => {
        let d = Math.abs(((((a - b.a) % (2 * Math.PI)) + 3 * Math.PI) % (2 * Math.PI)) - Math.PI); // 차와 부스의 각도 차
        const k = Math.max(0, 1 - d / 0.75), e = k * k * (3 - 2 * k), r = RB - (RB - RIN) * e;
        const [bx, by] = P(b.a, r), [tx, ty] = P(b.a, RR + 4);
        b.g.setAttribute("transform", ""); b.sq.setAttribute("transform", `translate(${bx.toFixed(1)} ${by.toFixed(1)}) rotate(${(b.a * 180) / Math.PI})`);
        b.tie.setAttribute("x1", bx); b.tie.setAttribute("y1", by); b.tie.setAttribute("x2", tx); b.tie.setAttribute("y2", ty);
        b.g.classList.toggle("on", e > 0.15); b.tie.style.opacity = e; b.u.classList.toggle("on", e > 0.15);
        if (e > 0.5) near++;
      });
      const lap = Math.floor(deg / 360) + 1;
      oa.textContent = `Lap ${lap} · ${String(Math.round(deg % 360)).padStart(3, "0")}°`;
      rr.textContent = near ? `${near} booth${near > 1 ? "s" : ""} pulled in to the route` : "between booths";
      rp.textContent = "the car keeps its line; the content comes to it — space approaches the user";
    };
    driver(box, { get: () => 0, set, min: 0, max: 720, perWheel: 14, perPx: () => 0.8 });
    set(0);
  };

  /* ---------- 8. Motorism 조닝: 교차 → 겹침 → 안에서 퍼짐 → 부스 (핀 #113) ---------- */
  const zoning = (root) => {
    const W = 1000, H = 500, R = 92;
    const C1 = [250, 160], C2 = [470, 160], C3 = [250, 380];
    const ST = [["01 Cross configuration", "Two one-way elliptical ramps, A up and B down, cross one point."], ["02 Overlapping space", "Where they meet, a shared centre to gather and interact."], ["03 Circulating from inside", "Movement starts at the centre and spreads onto both loops."], ["04 Ramp side space", "The outer curves hold booths, each tied back to the centre."]];
    root.innerHTML = `
      <div class="tw-head"><span class="num"><b class="tw-zs"></b></span><span class="mid tw-hint">Scroll over the drawing — four moves</span></div>
      <div class="tw-box" tabindex="0" aria-label="Zoning in four moves, scroll to step through"></div>
      <div class="tw-read num"><span class="tw-r"></span><span class="mid tw-p"></span></div>`;
    const box = root.querySelector(".tw-box"), svg = el("svg", { viewBox: `0 0 ${W} ${H}`, class: "tw-svg" }, box);
    [C1, C2, C3].forEach(([x, y]) => { for (let r = R + 12; r <= R + 36; r += 8) el("circle", { cx: x, cy: y, r, class: "tw-om" }, svg); el("circle", { cx: x, cy: y, r: R * 0.55, class: "tw-dfull" }, svg); });
    // 고리 A (오른쪽, 시계방향) · 고리 B (아래, 반시계방향): 원 둘레를 길이로 그려 나가요
    const ring = (c, cw) => { const [x, y] = c; return `M${x} ${y - R}A${R} ${R} 0 1 ${cw ? 1 : 0} ${x} ${y + R}A${R} ${R} 0 1 ${cw ? 1 : 0} ${x} ${y - R}`; };
    const la = el("path", { d: ring(C2, 1), class: "tw-zl", pathLength: 100 }, svg), lb = el("path", { d: ring(C3, 0), class: "tw-zl", pathLength: 100 }, svg);
    const ra = el("path", { d: `M${C1[0] - 70} ${C1[1] + 70}L${C1[0] + 70} ${C1[1] - 70}L${C2[0] - R * 0.7} ${C2[1] - R * 0.7}`, class: "tw-zl", pathLength: 100 }, svg);
    const rb = el("path", { d: `M${C1[0] + 70} ${C1[1] + 70}L${C1[0] - 70} ${C1[1] - 70}M${C1[0] + 70} ${C1[1] + 70}L${C3[0] + R * 0.7} ${C3[1] - R * 0.7}`, class: "tw-zl", pathLength: 100 }, svg);
    const hub = el("circle", { cx: C1[0], cy: C1[1], r: 46, class: "tw-zhub" }, svg);
    const links = el("path", { d: `M${C1[0]} ${C1[1]}H${C2[0]}M${C1[0]} ${C1[1]}V${C3[1]}`, class: "tw-zlink", pathLength: 100 }, svg);
    [C2, C3].forEach(([x, y]) => el("circle", { cx: x, cy: y, r: 5, class: "tw-dot" }, svg));
    const lab = (x, y, t, a = "") => { const e = el("text", { x, y, class: "tw-ax tw-b " + a }, svg); e.textContent = t; return e; };
    const L = [lab(C1[0] + 40, C1[1] - 112, "CROSSING"), lab(C2[0] + R + 20, C2[1] + 4, "LOOP A — up"), lab(C3[0] + R + 20, C3[1] + 4, "LOOP B — down"), lab(C1[0] - 150, C1[1] + 4, "SHARED CENTRE")];
    const movers = [0, 1, 2, 3, 4, 5].map(() => el("circle", { r: 4.5, class: "tw-zm" }, svg));
    const bt = [];
    [[C2, 0.15, 0.62], [C3, 0.4, 0.9]].forEach(([c, a0, a1]) => { for (let i = 0; i < 8; i++) { const a = (a0 + ((a1 - a0) * i) / 7) * 2 * Math.PI, x = c[0] + (R + 46) * Math.sin(a), y = c[1] - (R + 46) * Math.cos(a);
      const g = el("g", { class: "tw-zb" }, svg); el("line", { x1: x, y1: y, x2: c[0] + R * Math.sin(a), y2: c[1] - R * Math.cos(a), class: "tw-otie" }, g);
      el("rect", { x: x - 8, y: y - 8, width: 16, height: 16, transform: `rotate(${(a * 180) / Math.PI} ${x} ${y})` }, g); bt.push(g); } });
    // 오른쪽 단계 목록
    const list = ST.map(([t, s], i) => { const g = el("g", { class: "tw-zi" }, svg), y = 90 + i * 92;
      el("line", { x1: 700, x2: 980, y1: y - 22, y2: y - 22, class: "tw-g" }, g); const a = el("text", { x: 700, y, class: "tw-zt" }, g); a.textContent = t;
      const words = s.split(" "); let line = "", ly = y + 22; words.forEach((w) => { if ((line + w).length > 42) { const b = el("text", { x: 700, y: ly, class: "tw-ax tw-zd" }, g); b.textContent = line.trim(); line = ""; ly += 17; } line += w + " "; });
      const b = el("text", { x: 700, y: ly, class: "tw-ax tw-zd" }, g); b.textContent = line.trim(); return g; });
    const on = (p, f) => { p.style.strokeDasharray = "100 100"; p.style.strokeDashoffset = 100 - 100 * Math.max(0, Math.min(1, f)); };
    const zs = root.querySelector(".tw-zs"), rr = root.querySelector(".tw-r"), rp = root.querySelector(".tw-p");
    const set = (v) => {
      const k = Math.min(3, Math.floor(v)), f = (x) => Math.max(0, Math.min(1, v - x));
      on(ra, f(0) * 1.6); on(rb, f(0) * 1.6 - 0.3); on(la, f(0) * 1.4 - 0.2); on(lb, f(0) * 1.4 - 0.3);
      hub.style.opacity = f(1); hub.setAttribute("r", 20 + 34 * f(1)); on(links, f(1) * 1.5);
      const sp = f(2); // 가운데서 출발해 두 고리로 퍼지며 돌아요
      movers.forEach((m, i) => { const A = i % 2 === 0, c = A ? C2 : C3, ph = (i >> 1) / 3, t = Math.max(0, sp * 1.4 - ph * 0.3);
        let x, y; if (t < 0.35) { const u = t / 0.35; x = C1[0] + (A ? u * (c[0] - R - C1[0]) : 0); y = C1[1] + (A ? 0 : u * (c[1] - R - C1[1])); }
        else { const a = (A ? 1 : -1) * ((t - 0.35) * 2 * Math.PI + v * 1.2) + (A ? -Math.PI / 2 : 0); x = c[0] + R * Math.sin(a); y = c[1] - R * Math.cos(a); }
        m.setAttribute("cx", x); m.setAttribute("cy", y); m.style.opacity = sp > 0 ? 1 : 0; });
      bt.forEach((g, i) => { const o = Math.max(0, Math.min(1, f(3) * 1.6 - (i % 8) * 0.07)); g.style.opacity = o; });
      L[0].style.opacity = 1; L[3].style.opacity = f(1); L[1].style.opacity = L[2].style.opacity = Math.min(1, f(0) * 2);
      list.forEach((g, i) => g.classList.toggle("on", i === k));
      zs.textContent = ST[k][0]; rr.textContent = ["A up 11 % · B down 9 %", "one hub, two loops", "start at the centre", "booths on the outer curves"][k]; rp.textContent = ST[k][1];
    };
    driver(box, { get: () => 0, set, min: 0, max: 3.999, perWheel: 0.11, ease: 0.07, perPx: (b) => 2 / b.getBoundingClientRect().width }); // 핀 #89: 천천히
    set(0);
  };

  /* ---------- 9. Motorism 파라메트릭 스킨: 입력값을 움직이면 패턴이 다시 계산돼요 (핀 #116) ---------- */
  const skin = (root) => {
    const C = 27, R = 9, CW = 36, PAD = 4, W = C * CW, H = R * CW;
    const IN = [["wH", "height", 0.6], ["wA", "views", 0.4], ["wS", "sun", 0.4], ["wN", "grain", 0.1]];
    const FACE = [["south", 180], ["west", 270], ["north", 0], ["east", 90]];
    root.innerHTML = `
      <div class="tw-head"><span class="num"><b class="tw-sk"></b></span><span class="mid tw-hint">Move an input — bay 05 is re-computed by the same rule</span></div>
      <div class="tw-skg">
        <div class="tw-box" aria-label="Parametric skin, one bay of 27 by 9 cassettes"></div>
        <div class="tw-skc">
          ${IN.map(([k, n, v]) => `<label class="tw-skr"><span><b>${k}</b> ${n}</span><input type="range" min="0" max="1" step="0.05" value="${v}" data-k="${k}"><output class="num">${v.toFixed(2)}</output></label>`).join("")}
          <div class="tw-skf"><span><b>facing</b></span>${FACE.map(([n, d], i) => `<button type="button" data-f="${d}"${i ? "" : ' class="on"'}>${n}</button>`).join("")}</div>
          <button type="button" class="tw-skreset">as built</button>
        </div>
      </div>
      <div class="tw-read num"><span class="tw-r"></span><span class="mid tw-p"></span></div>`;
    const box = root.querySelector(".tw-box"), svg = el("svg", { viewBox: `-2 -2 ${W + 4} ${H + 4}`, class: "tw-svg" }, box);
    el("rect", { x: 0, y: 0, width: W, height: H, class: "tw-skframe" }, svg);
    for (let i = 1; i < C; i++) el("line", { x1: i * CW, x2: i * CW, y1: 0, y2: H, class: "tw-skl" }, svg);
    for (let j = 1; j < R; j++) el("line", { y1: j * CW, y2: j * CW, x1: 0, x2: W, class: "tw-skl" }, svg);
    const tris = []; for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) tris.push(el("path", { class: "tw-skt" }, svg));
    // 고정된 바탕 값: 높이(위로 갈수록), 조망(창 밖으로 열리는 두 지점), 결(셀마다 작은 흔들림)
    const hash = (i, j) => { const s = Math.sin(i * 127.1 + j * 311.7) * 43758.5453; return s - Math.floor(s); };
    const height = (i, j) => 1 - j / (R - 1);
    const views = (i, j) => Math.max(Math.exp(-((i - 9) ** 2 / 30 + (j - 2) ** 2 / 10)), Math.exp(-((i - 22) ** 2 / 20 + (j - 5) ** 2 / 14)));
    const st = { wH: 0.6, wA: 0.4, wS: 0.4, wN: 0.1, face: 180 };
    const sk = root.querySelector(".tw-sk"), rr = root.querySelector(".tw-r"), rp = root.querySelector(".tw-p");
    const draw = () => {
      const sun = (1 - Math.cos((st.face * Math.PI) / 180)) / 2; // 남향 1, 북향 0
      const side = Math.sin((st.face * Math.PI) / 180);          // 동(+)·서(−)로 기울면 햇빛이 한쪽으로 쏠려요
      const f = (i, j) => st.wH * height(i, j) + st.wA * views(i, j) + st.wS * sun * (0.55 + 0.45 * (side >= 0 ? 1 - i / (C - 1) : i / (C - 1)) * Math.abs(side) + 0.45 * (1 - Math.abs(side))) + st.wN * hash(i, j);
      const tot = st.wH + st.wA + st.wS + st.wN || 1;
      let sum = 0, lo = 1, hi = 0; const files = new Set();
      for (let j = 0; j < R; j++) for (let i = 0; i < C; i++) {
        const v = f(i, j) / tot, o = 0.1 + 0.41 * Math.min(1, Math.max(0, v)); // 개구율 10–51 %
        // 방향: 바탕 값이 커지는 쪽(기울기)의 모서리를 향해 열려요
        const gx = f(Math.min(C - 1, i + 1), j) - f(Math.max(0, i - 1), j), gy = f(i, Math.min(R - 1, j + 1)) - f(i, Math.max(0, j - 1));
        const cx = gx + (hash(j, i) - 0.5) * 0.02 >= 0 ? 1 : 0, cy = gy + (hash(i + 3, j) - 0.5) * 0.02 >= 0 ? 1 : 0;
        const s = (CW - PAD * 2) * Math.sqrt(o / 0.51), x0 = i * CW + PAD, y0 = j * CW + PAD, ax = cx ? x0 + CW - PAD * 2 : x0, ay = cy ? y0 + CW - PAD * 2 : y0, dx = cx ? -s : s, dy = cy ? -s : s;
        tris[j * C + i].setAttribute("d", `M${ax.toFixed(1)} ${ay.toFixed(1)}h${dx.toFixed(1)}L${ax.toFixed(1)} ${(ay + dy).toFixed(1)}Z`);
        sum += o; lo = Math.min(lo, o); hi = Math.max(hi, o); files.add(Math.round((o * 100) / 6) + "-" + cx + cy);
      }
      const n = Math.min(28, files.size);
      sk.textContent = `wH ${st.wH.toFixed(2)} · wA ${st.wA.toFixed(2)} · wS ${st.wS.toFixed(2)} · wN ${st.wN.toFixed(2)} · facing ${st.face}°`;
      rr.textContent = `mean o ${Math.round((sum / (C * R)) * 100)} % · ${Math.round(lo * 100)}–${Math.round(hi * 100)} %`;
      rp.textContent = `${n} of 28 cutting files · 243 cassettes, one rule`;
    };
    root.querySelectorAll("input[type=range]").forEach((r) => r.addEventListener("input", () => { st[r.dataset.k] = +r.value; r.nextElementSibling.textContent = (+r.value).toFixed(2); draw(); }));
    root.querySelectorAll("[data-f]").forEach((b) => b.addEventListener("click", () => { st.face = +b.dataset.f; root.querySelectorAll("[data-f]").forEach((x) => x.classList.toggle("on", x === b)); draw(); }));
    root.querySelector(".tw-skreset").addEventListener("click", () => {
      IN.forEach(([k, , v]) => { st[k] = v; const r = root.querySelector(`[data-k=${k}]`); r.value = v; r.nextElementSibling.textContent = v.toFixed(2); });
      st.face = 180; root.querySelectorAll("[data-f]").forEach((x, i) => x.classList.toggle("on", i === 0)); draw();
    });
    draw();
  };

  /* 도면 안 글자를 화면에서 늘 같은 크기로: 그림이 얼마나 줄고 늘든 --fs로 되돌려요 (글자 위계 통일) */
  const fitText = (root) => {
    const fit = () => root.querySelectorAll("svg.tw-svg").forEach((svg) => {
      const vb = svg.viewBox.baseVal; if (!vb || !vb.width || !svg.clientWidth) return;
      const k = Math.min(svg.clientWidth / vb.width, (svg.clientHeight || 1e9) / vb.height);
      if (k > 0) svg.style.setProperty("--fs", (1 / k).toFixed(4));
    });
    fit(); requestAnimationFrame(fit);
    if ("ResizeObserver" in window) new ResizeObserver(fit).observe(root);
  };

  window.TideWidgets = { mount: (el, kind) => { const r = ({ moon, loop, dial, sine, flow, orbit, zoning, skin }[kind] || springNeap)(el); fitText(el); return r; } };
})();
