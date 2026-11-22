/* 도시 미니게임 "Air & Light" (핀 #75, 2026-11-22)
   9×9 대지에 층을 쌓고 공원을 놓아요. 목표: 120명을 살게 하면서 햇빛 70% 이상 지키기.
   - 사람 = 층 수 × 4
   - 햇빛 = 아침·정오·오후 세 번의 해에서 그림자에 묻히지 않은 층의 비율 (평균)
   - 녹지 = 공원에서 두 칸 안에 있는 건물의 비율
   색은 사이트 변수(--bg, --ink)를 섞어 무채색만 써요. 다크 모드도 따라가요.
   window.CityGame.open() 으로 열고, Esc·Close로 닫아요. */
(function () {
  "use strict";
  const N = 9, MAXF = 6, BUDGET = 36, PARKS = 6, GOAL_P = 120, GOAL_L = 70;
  const FH = 0.62; // 한 층 높이 (칸 폭 기준)
  let root, cv, g, W = 0, H = 0, S = 40, OX = 0, OY = 0, dpr = 1;
  let hgt, park, tool = "build", sun = 0.5, hover = null, raf = 0, open = false, won = false, walkers = [], last = 0;
  const $ = (s, el = document) => el.querySelector(s);
  const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
  const rgb = (h) => { const m = (h || "").match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i); return m ? [1, 2, 3].map((i) => parseInt(m[i], 16)) : null; };
  let mix = (a) => `rgba(0,0,0,${a})`;
  const colors = () => { const bg = rgb(css("--bg")) || [255, 255, 255], ink = rgb(css("--ink")) || [17, 17, 17]; mix = (a) => `rgb(${bg.map((v, i) => Math.round(v + (ink[i] - v) * a)).join(",")})`; };

  // ---------- 해와 그림자 ----------
  const sunAt = (t) => { // t 0 = 아침(동), 0.5 = 정오(남), 1 = 오후(서)
    const az = (t - 0.5) * Math.PI * 0.95, el = (22 + 38 * Math.sin(Math.PI * t)) * Math.PI / 180;
    return { sx: -Math.sin(az), sy: Math.cos(az), tanE: Math.tan(el) }; // 해가 있는 쪽 (격자: +i 동, +j 남)
  };
  const shaded = (i, j, z, s) => { // 높이 z(층 단위, 바닥=0)의 점이 해 쪽 건물에 가려지는지
    for (let d = 0.5; d <= 12; d += 0.5) {
      const a = Math.round(i + s.sx * d), b = Math.round(j + s.sy * d);
      if (a < 0 || b < 0 || a >= N || b >= N) return false;
      if (a === i && b === j) continue;
      if (hgt[a][b] * FH > z * FH + d * s.tanE) return true;
    }
    return false;
  };
  const score = () => {
    let floors = 0, lit = 0, bld = 0, green = 0;
    const suns = [0.18, 0.5, 0.82].map(sunAt);
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const h = hgt[i][j]; if (!h) continue;
      floors += h; bld++;
      for (let k = 0; k < h; k++) lit += suns.reduce((a, s) => a + (shaded(i, j, k + 0.5, s) ? 0 : 1), 0) / suns.length;
      let near = false; for (let a = i - 2; a <= i + 2 && !near; a++) for (let b = j - 2; b <= j + 2; b++) if (a >= 0 && b >= 0 && a < N && b < N && park[a][b]) { near = true; break; }
      if (near) green++;
    }
    const parks = park.flat().filter(Boolean).length;
    return { floors, people: floors * 4, light: floors ? Math.round((lit / floors) * 100) : 100, green: bld ? Math.round((green / bld) * 100) : 0, parks };
  };

  // ---------- 그리기 ----------
  const iso = (i, j, z) => [OX + (i - j) * S, OY + (i + j) * S * 0.5 - z * S * FH * 1.15];
  const poly = (pts, fill, stroke) => { g.beginPath(); pts.forEach(([x, y], k) => (k ? g.lineTo(x, y) : g.moveTo(x, y))); g.closePath(); if (fill) { g.fillStyle = fill; g.fill(); } if (stroke) { g.strokeStyle = stroke; g.stroke(); } };
  const tile = (i, j, z) => [iso(i, j, z), iso(i + 1, j, z), iso(i + 1, j + 1, z), iso(i, j + 1, z)];
  const draw = (t) => {
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.clearRect(0, 0, W, H);
    const s = sunAt(sun), line = mix(0.55), thin = mix(0.18);
    g.lineWidth = 1; g.lineJoin = "round";
    // 땅: 그림자 진 칸은 회색, 공원은 옅은 회색 + 나무
    for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) {
      const sh = !hgt[i][j] && shaded(i, j, 0.02, s);
      poly(tile(i, j, 0), park[i][j] ? mix(sh ? 0.16 : 0.08) : sh ? mix(0.1) : mix(0.015), thin);
    }
    if (hover && tool !== "erase") poly(tile(hover[0], hover[1], hgt[hover[0]][hover[1]]), null, mix(0.9));
    // 건물·나무: 뒤에서 앞으로
    const cells = []; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) cells.push([i, j]);
    cells.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
    cells.forEach(([i, j]) => {
      const h = hgt[i][j];
      if (park[i][j]) { // 나무 세 그루
        [[0.3, 0.35], [0.68, 0.4], [0.5, 0.72]].forEach(([u, v], k) => {
          const [x, y] = iso(i + u, j + v, 0), r = S * 0.2, sw = Math.sin(t / 900 + i + j + k) * 1.2;
          g.beginPath(); g.moveTo(x, y); g.lineTo(x + sw * 0.3, y - r * 1.3); g.strokeStyle = line; g.stroke();
          g.beginPath(); g.arc(x + sw, y - r * 1.6, r, 0, Math.PI * 2); g.fillStyle = mix(0.12); g.fill(); g.strokeStyle = line; g.stroke();
        });
      }
      for (let k = 0; k < h; k++) {
        const lt = !shaded(i, j, k + 0.5, s), top = k === h - 1;
        const a = iso(i, j + 1, k), b = iso(i + 1, j + 1, k), c = iso(i + 1, j, k), a2 = iso(i, j + 1, k + 1), b2 = iso(i + 1, j + 1, k + 1), c2 = iso(i + 1, j, k + 1);
        poly([a, b, b2, a2], mix(lt ? 0.09 : 0.24), line); // 남서면
        poly([b, c, c2, b2], mix(lt ? 0.04 : 0.2), line);   // 남동면
        // 창 띠
        g.beginPath(); const m1 = [(a[0] + a2[0]) / 2, (a[1] + a2[1]) / 2], m2 = [(b[0] + b2[0]) / 2, (b[1] + b2[1]) / 2], m3 = [(c[0] + c2[0]) / 2, (c[1] + c2[1]) / 2];
        g.moveTo(m1[0], m1[1]); g.lineTo(m2[0], m2[1]); g.lineTo(m3[0], m3[1]); g.strokeStyle = thin; g.stroke();
        if (top) poly(tile(i, j, k + 1), mix(lt ? 0.02 : 0.14), line);
      }
      if (hover && hover[0] === i && hover[1] === j && tool === "build" && h < MAXF && !park[i][j]) poly(tile(i, j, h + 1), null, mix(0.45)); // 다음 층 미리보기
    });
    // 사람: 공원과 빈 땅을 천천히 걸어요
    const dt = Math.min(0.05, (t - (last || t)) / 1000); last = t;
    walkers.forEach((w) => {
      const dx = w.tx - w.x, dy = w.ty - w.y, d = Math.hypot(dx, dy);
      if (d < 0.05) { const c = freeCell(); if (c) { w.tx = c[0] + 0.2 + Math.random() * 0.6; w.ty = c[1] + 0.2 + Math.random() * 0.6; } }
      else { w.x += (dx / d) * dt * 0.6; w.y += (dy / d) * dt * 0.6; }
      const cx = Math.floor(w.x), cy = Math.floor(w.y);
      if (cx >= 0 && cy >= 0 && cx < N && cy < N && hgt[cx][cy]) return; // 건물 속이면 안 그려요
      const [x, y] = iso(w.x, w.y, 0), bob = Math.abs(Math.sin(t / 160 + w.p)) * 1.5;
      g.fillStyle = mix(0.85); g.fillRect(x - 1.2, y - 6 - bob, 2.4, 5); g.beginPath(); g.arc(x, y - 7.5 - bob, 1.5, 0, Math.PI * 2); g.fill();
    });
    // 해: 화면 위 원호 위의 점
    const sx = W * 0.5 + Math.sin((sun - 0.5) * Math.PI * 0.95) * Math.min(W, 900) * 0.42, sy = H * 0.2 - Math.sin(Math.PI * sun) * H * 0.08;
    g.beginPath(); g.arc(sx, sy, 7, 0, Math.PI * 2); g.fillStyle = mix(0); g.fill(); g.strokeStyle = mix(0.8); g.stroke();
    if (open) raf = requestAnimationFrame(draw);
  };
  const freeCell = () => { const c = []; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) if (!hgt[i][j]) c.push([i, j, park[i][j] ? 3 : 1]); if (!c.length) return null; const tot = c.reduce((a, x) => a + x[2], 0); let r = Math.random() * tot; for (const x of c) { r -= x[2]; if (r <= 0) return x; } return c[0]; };
  const syncWalkers = (sc) => {
    const want = Math.min(28, sc.parks * 3 + Math.floor(sc.floors / 3));
    while (walkers.length < want) { const c = freeCell(); if (!c) break; walkers.push({ x: c[0] + 0.5, y: c[1] + 0.5, tx: c[0] + 0.5, ty: c[1] + 0.5, p: Math.random() * 6 }); }
    walkers.length = Math.min(walkers.length, want);
  };

  // ---------- 고르기 (화면 → 칸) ----------
  const inPoly = (x, y, P) => { let o = false; for (let a = 0, b = P.length - 1; a < P.length; b = a++) { const [xa, ya] = P[a], [xb, yb] = P[b]; if (ya > y !== yb > y && x < ((xb - xa) * (y - ya)) / (yb - ya) + xa) o = !o; } return o; };
  const pick = (x, y) => {
    const cells = []; for (let i = 0; i < N; i++) for (let j = 0; j < N; j++) cells.push([i, j]);
    cells.sort((a, b) => b[0] + b[1] - (a[0] + a[1])); // 앞에 있는 칸부터
    for (const [i, j] of cells) {
      const h = hgt[i][j];
      const P = h ? [iso(i, j, h), iso(i + 1, j, h), iso(i + 1, j, 0), iso(i + 1, j + 1, 0), iso(i, j + 1, 0), iso(i, j + 1, h)] : tile(i, j, 0);
      if (inPoly(x, y, P)) return [i, j];
    }
    return null;
  };

  // ---------- 화면 ----------
  const hud = () => {
    const sc = score(), left = BUDGET - sc.floors;
    $(".cg-p b", root).textContent = sc.people; $(".cg-l b", root).textContent = sc.light + "%"; $(".cg-g b", root).textContent = sc.green + "%";
    $(".cg-p", root).classList.toggle("ok", sc.people >= GOAL_P); $(".cg-l", root).classList.toggle("ok", sc.light >= GOAL_L && sc.floors > 0); $(".cg-l", root).classList.toggle("bad", sc.floors > 0 && sc.light < GOAL_L);
    $(".cg-left", root).textContent = `${left} floors · ${PARKS - sc.parks} parks left`;
    syncWalkers(sc);
    const ok = sc.people >= GOAL_P && sc.light >= GOAL_L;
    if (ok && !won) { won = true; root.classList.add("won"); }
    if (!ok && won) { won = false; root.classList.remove("won"); }
  };
  const act = (i, j, erase) => {
    const sc = score();
    if (erase || tool === "erase") { if (hgt[i][j]) hgt[i][j]--; else park[i][j] = false; }
    else if (tool === "park") { if (!hgt[i][j] && !park[i][j] && sc.parks < PARKS) park[i][j] = true; else if (park[i][j]) park[i][j] = false; else return nope(); }
    else { if (park[i][j]) return nope(); if (hgt[i][j] < MAXF && sc.floors < BUDGET) hgt[i][j]++; else return nope(); }
    hud();
  };
  const nope = () => { const el = $(".cg-left", root); el.classList.remove("shake"); void el.offsetWidth; el.classList.add("shake"); };
  const fit = () => {
    dpr = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight;
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    S = Math.max(16, Math.min(W / (N * (W < 760 ? 2.08 : 2.3)), H / (N * 1.0 + MAXF * FH * 1.15 * 1.1)));
    OX = W / 2; OY = H * 0.5 - (N * S) / 2 + (MAXF * S * FH * 1.15) * 0.45;
  };
  const build = () => {
    root = document.createElement("div"); root.className = "cg"; root.setAttribute("role", "dialog"); root.setAttribute("aria-label", "Air and Light — a block-building game");
    root.innerHTML = `
      <canvas class="cg-cv" aria-hidden="true"></canvas>
      <div class="cg-hd">
        <p class="cg-t"><b>Air &amp; Light</b> <span class="mid">— build a block</span></p>
        <p class="cg-r mid">House ${GOAL_P} people and keep ${GOAL_L}% of the floors in daylight, morning to afternoon.<br>Click to add a floor, choose Park to plant, right-click to take one away.</p>
      </div>
      <button type="button" class="cg-x">Close <span aria-hidden="true">×</span></button>
      <dl class="cg-st">
        <div class="cg-p"><dt>People</dt><dd><b>0</b><span class="mid"> / ${GOAL_P}</span></dd></div>
        <div class="cg-l"><dt>Daylight</dt><dd><b>100%</b><span class="mid"> / ${GOAL_L}%</span></dd></div>
        <div class="cg-g"><dt>Green</dt><dd><b>0%</b></dd></div>
        <p class="cg-left mid"></p>
      </dl>
      <div class="cg-ft">
        <div class="cg-tl" role="group" aria-label="Tool">
          <button type="button" data-t="build" aria-pressed="true">Floor</button><button type="button" data-t="park" aria-pressed="false">Park</button><button type="button" data-t="erase" aria-pressed="false">Erase</button><button type="button" data-t="reset">Reset</button>
        </div>
        <label class="cg-sun mid">Sun <input type="range" min="0" max="100" value="50" aria-label="Time of day"><span class="num">12:00</span></label>
      </div>
      <div class="cg-win"><p class="mid">Built — ${GOAL_P}+ people, all in daylight.</p><p class="cg-q">${(window.SITE && SITE.manifesto && SITE.manifesto.en) || "Architecture is an answer before an image."}</p><button type="button" class="cg-more lnk">Keep building</button></div>`;
    document.body.appendChild(root);
    cv = $(".cg-cv", root); g = cv.getContext("2d");
    cv.addEventListener("pointermove", (e) => { const r = cv.getBoundingClientRect(); hover = pick(e.clientX - r.left, e.clientY - r.top); });
    cv.addEventListener("pointerleave", () => (hover = null));
    cv.addEventListener("pointerdown", (e) => { const r = cv.getBoundingClientRect(), c = pick(e.clientX - r.left, e.clientY - r.top); if (c) act(c[0], c[1], e.button === 2); });
    cv.addEventListener("contextmenu", (e) => e.preventDefault());
    root.querySelectorAll("[data-t]").forEach((b) => b.addEventListener("click", () => {
      const t = b.dataset.t;
      if (t === "reset") { reset(); return; }
      tool = t; root.querySelectorAll("[data-t]").forEach((x) => x.dataset.t !== "reset" && x.setAttribute("aria-pressed", String(x.dataset.t === t)));
    }));
    const rg = $(".cg-sun input", root), lab = $(".cg-sun span", root);
    rg.addEventListener("input", () => { sun = rg.value / 100; const m = Math.round((7 + sun * 10) * 60); lab.textContent = `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; });
    $(".cg-x", root).addEventListener("click", close);
    $(".cg-more", root).addEventListener("click", () => root.classList.add("more"));
    addEventListener("resize", () => open && fit());
    addEventListener("keydown", (e) => { if (open && e.key === "Escape") close(); });
  };
  const reset = () => { hgt = [...Array(N)].map(() => Array(N).fill(0)); park = [...Array(N)].map(() => Array(N).fill(false)); walkers = []; won = false; if (root) { root.classList.remove("won", "more"); hud(); } };
  const openGame = () => {
    if (!root) { build(); reset(); }
    colors(); open = true; root.classList.add("on"); document.documentElement.classList.add("cg-open");
    fit(); hud(); cancelAnimationFrame(raf); raf = requestAnimationFrame(draw);
    $(".cg-x", root).focus({ preventScroll: true });
  };
  const close = () => { open = false; cancelAnimationFrame(raf); if (root) root.classList.remove("on"); document.documentElement.classList.remove("cg-open"); const b = document.querySelector(".yi-play"); if (b) b.focus({ preventScroll: true }); };
  window.CityGame = { open: openGame, close };
})();
