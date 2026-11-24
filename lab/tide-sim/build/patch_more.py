# build.py에서 불러요: 핀 #297 (화살표 끝 잡아 돌리기). R은 build() 안의 바꾸기 함수.
def patch_more(R, T):
    # 그릴 때 화살표 끝 위치 기억
    R("    let px = cx, py = cy;\n    ph.forEach(([A, th], i) => {",
      "    let px = cx, py = cy; PH.geo = { cx, cy, tips: [] };\n    ph.forEach(([A, th], i) => {", 1)
    R("      px += dx; py += dy;\n", "      px += dx; py += dy; PH.geo.tips.push([px, py]);\n", 1)
    # 왼쪽 버튼으로 끝을 잡고 원을 따라 끌면 시각이 바뀌어요 (M2가 한 바퀴 = 12시간 25분)
    R("    $('#c-ph-play').addEventListener('click', () => PH.play ? this.pause() : this.start());\n",
      "    $('#c-ph-play').addEventListener('click', () => PH.play ? this.pause() : this.start());\n"
      "    { const c = $('#c-ph'); let g = null; const loc = e => { const r = c.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };\n"
      "      const near = p => PH.geo && PH.geo.tips.some(q => Math.hypot(q[0] - p[0], q[1] - p[1]) < 22);\n"
      "      const ang = p => Math.atan2(p[0] - PH.geo.cx, -(p[1] - PH.geo.cy));\n"
      "      c.addEventListener('pointerdown', e => { if (e.button !== 0) return; const p = loc(e); if (!near(p)) return; e.preventDefault(); this.pause(); g = ang(p); try { c.setPointerCapture(e.pointerId); } catch (_) {} c.style.cursor = 'grabbing'; });\n"
      "      c.addEventListener('pointermove', e => { const p = loc(e); if (g == null) { c.style.cursor = near(p) ? 'grab' : ''; return; }\n"
      "        const a = ang(p); let d = a - g; d -= Math.round(d / (2 * Math.PI)) * 2 * Math.PI; g = a;\n"
      "        PH.t = ((PH.t + d / (2 * Math.PI) * TIDE.period('M2') * 60) % 21240 + 21240) % 21240; inval('collect'); });\n"
      "      const up = () => { if (g == null) return; g = null; c.style.cursor = 'grab'; }; c.addEventListener('pointerup', up); c.addEventListener('pointercancel', up); c.style.touchAction = 'pan-y'; }\n", 1)

# 핀 #298: 단면을 실제 비율로 — 가로·세로 축척을 같게(3D의 높이 ×1 / ×2 버튼과 같은 배율), 땅 높이는 3D·평면과 같은 F.Z
def patch_sec(R, T):
    R("const { x, w, h } = cv('s-sec'), L = 44, R = w - 10, T = 26, B = h - 46, X = lin(0, 100, L, R), Y = lin(-1, 11.5, B, T);",
      "const { x, w, h } = cv('s-sec'), L = 44, R = w - 10, B = h - 46, X = lin(0, 100, L, R), VE = C2.ve || 1, sy = (R - L) / 100 * VE, Y = z => B - (z + 1) * sy, T = Math.max(14, Y(11.5));", 1)
    R("for (const v of [0, 2, 4, 6, 8, 10]) { hline(x, L, R, Y(v), K.line2); txt(x, fH(v, 0), L - 6, Y(v), { align: 'right', font: FS(10.5, true) }); }",
      "for (const v of [0, 2, 4, 6, 8, 10]) { if (Y(v) < 8) continue; hline(x, L, R, Y(v), K.line2); txt(x, fH(v, 0), L - 6, Y(v), { align: 'right', font: FS(10.5, true) }); }", 1)
    R("txt(x, '높이 2배 · 0.5 m 간격의 땅 높이', L, h - 6, { font: FS(10), color: K.faint });",
      "txt(x, (VE === 1 ? '세로 축척 = 가로 축척 (실제 비율)' : '세로 ×' + VE) + ' · 3D·평면과 같은 땅 높이', L, h - 6, { font: FS(10), color: K.faint });", 1)
    R("if (k >= 2) txt(x, '호안 약 1/4', X(22.5) + 8, Y(8.9), {", "if (k >= 2) txt(x, '호안 약 1/4', X(22.5) + 8, Y(8.9) - 10, {", 1)
    R("txt(x, '약 1/14로 낮아짐 · 기복과 물결 자국', X(58), Y(4.8) - 12,", "txt(x, '약 1/14로 낮아짐 · 기복과 물결 자국', X(58), Y(4.8) - 18,", 1)
    R("segBind('s-ve', 'v', val => { C2.ve = +val; this.mesh(); this.water(); });", "segBind('s-ve', 'v', val => { C2.ve = +val; this.mesh(); this.water(); inval('site'); });", 1)
    R("<small>대지의 y = 30 m 선을 따라 자른 모습, 높이 2배</small>", "<small>대지의 y = 30 m 선을 따라 자른 모습, 세로 축척은 3D와 같음</small>", 1)

# 핀 #300: 실험 대지 3D — 처음 모습과 '처음 모습으로'는 대지 전체가 꽉 차게 (화면 비율에 맞춰 거리 계산)
def patch_fit(R, T):
    R("  let pend = 0, w0 = 0, h0 = 0, env = null;", "  let pend = 0, w0 = 0, h0 = 0, env = null, touched = 0;", 1)
    R("cam.aspect = w0 / h0; cam.updateProjectionMatrix(); }",
      "cam.aspect = w0 / h0; cam.updateProjectionMatrix(); if (o.fit) { const vf = cam.fov * Math.PI / 360, hf = Math.atan(Math.tan(vf) * cam.aspect), d = o.fit / Math.sin(Math.min(vf, hf)); home.dist = d; if (!touched) orb.dist = d; } }", 1)
    R("View3D($('#s-cv'), { tx: 2, ty: 4, tz: 0, az: 0.62, el: 0.5, dist: 150, min: 25, max: 500, only: 'wire' })",
      "View3D($('#s-cv'), { tx: 0, ty: 3, tz: 0, az: 0.62, el: 0.55, dist: 150, min: 25, max: 500, only: 'wire', fit: 60 })", 1)

# 핀 #306·#310: 평면을 무채색 도면처럼 + 축척 막대·북쪽 화살표, 시뮬레이션 평면은 기단 범위로 확대
def patch_plan(R, T):
    R("const full = o.dims !== false && !o.sc, x0 = full ? -PS.Wr - 4 : Math.max(CORE.XL, XC - Rf - 2),",
      "const full = o.dims !== false && !o.sc, x0 = o.tight ? XC - Rf - 6 : full ? -PS.Wr - 4 : Math.max(CORE.XL, XC - Rf - 2),", 1)
    R("if (full) { const el = document.getElementById(cvId), Wd = el.getBoundingClientRect().width || 600; el.style.height = Math.round(clamp((Wd - 38) * 2 * yH / (x1 - x0) + 46, 300, 780)) + 'px'; }",
      "if (full) { const el = document.getElementById(cvId), Wd = el.getBoundingClientRect().width || 600; el.style.height = Math.round(clamp((Wd - 38) * 2 * yH / (x1 - x0) + 46, 300, o.tight ? 640 : 780)) + 'px'; }", 1)
    R("const CX = X(XC), CY = Y(0);\n", "const CX = X(XC), CY = Y(0); PLAN_SC = sc;\n", 1)
    R("plan(w) { drawPlan('w-plan', ST.sea, w, { zones: W5.zones, dims: W5.dims, cluster: clusterOf(ST.sea) }); },",
      "plan(w) { drawPlan('w-plan', ST.sea, w, { zones: W5.zones, dims: W5.dims, cluster: clusterOf(ST.sea), tight: true }); },", 1)
    R("function seaStats(id) {",
      "let PLAN_SC = 1;\n"
      "{ const _dp = drawPlan; drawPlan = function (cvId, id, w, o = {}) { _dp(cvId, id, w, o); const el = document.getElementById(cvId); if (!el) return; const x = el.getContext('2d'), dpr = el.width / Math.max(1, el.getBoundingClientRect().width);\n"
      "  x.save(); x.setTransform(1, 0, 0, 1, 0, 0); x.globalCompositeOperation = 'saturation'; x.fillStyle = '#808080'; x.fillRect(0, 0, el.width, el.height); x.globalCompositeOperation = 'source-over';\n"
      "  x.setTransform(dpr, 0, 0, dpr, 0, 0); const Wc = el.width / dpr, Hc = el.height / dpr, ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#111';\n"
      "  x.fillStyle = ink; x.strokeStyle = ink; x.lineWidth = 1; x.font = '10px ' + getComputedStyle(document.body).fontFamily; x.textAlign = 'center'; const nx = Wc - 64, ny = 24; x.beginPath(); x.moveTo(nx, ny - 10); x.lineTo(nx + 5, ny + 6); x.lineTo(nx, ny + 3); x.closePath(); x.fill(); x.beginPath(); x.moveTo(nx, ny - 10); x.lineTo(nx - 5, ny + 6); x.lineTo(nx, ny + 3); x.closePath(); x.stroke(); x.fillText('N', nx, ny - 13);\n"
      "  x.restore(); }; }\n"
      "function seaStats(id) {", 1)

# 핀 #306: 평면 색을 무채색 도면 색으로 바꿔 그린 뒤 되돌려요
def patch_plan2(R, T):
    R("{ const _dp = drawPlan; drawPlan = function (cvId, id, w, o = {}) { _dp(cvId, id, w, o);",
      "{ const _dp = drawPlan; drawPlan = function (cvId, id, w, o = {}) { const dk = isDark(), G = dk ? { mudLo: '#2a2a2a', con: '#4a4a4a', rev: '#333333', land: '#3a3a3a' } : { mudLo: '#e2e2e2', con: '#cfcfcf', rev: '#dedede', land: '#ececec' }, GK = dk ? { water: '#6a6a6a', water2: '#3c3c3c' } : { water: '#c4c4c4', water2: '#dcdcdc' };\n"
      "  const s3 = {}, sk = {}; for (const k in G) { s3[k] = C3[k]; C3[k] = G[k]; } for (const k in GK) { sk[k] = K[k]; K[k] = GK[k]; } try { _dp(cvId, id, w, o); } finally { Object.assign(C3, s3); Object.assign(K, sk); }", 1)

def patch_plan3(R, T):
    R("x1 = XC + ext + (full ? 15 : 3), yH = ey + (full ? 7 : 2);", "x1 = o.tight ? XC + Rf + 6 : XC + ext + (full ? 15 : 3), yH = o.tight ? Rf + 5 : ey + (full ? 7 : 2);", 1)

# 핀 #315: 큰 제목이 스크롤을 따라 맨 위로 올라가 작아지며 얇은 줄에 붙어요 (움직임 줄이기면 그대로 지나감)
def patch_dock(R, T):
    R("  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paint);\n",
      "  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', paint);\n"
      "  { const h = document.querySelector('.brand h1'), RM = matchMedia('(prefers-reduced-motion: reduce)'); if (h) { const bg = document.createElement('div'); bg.className = 'dock-bg'; bg.setAttribute('aria-hidden', 'true'); document.body.appendChild(bg);\n"
      "    let top0 = 0, fs = 64, q = 0; const px = n => parseFloat(getComputedStyle(document.documentElement).getPropertyValue(n)) || 0;\n"
      "    const measure = () => { h.style.transform = ''; top0 = h.getBoundingClientRect().top + scrollY; fs = parseFloat(getComputedStyle(h).fontSize) || 64; upd(); };\n"
      "    const upd = () => { q = 0; if (RM.matches) { h.style.transform = ''; bg.style.opacity = 0; document.documentElement.classList.remove('docked'); return; }\n"
      "      const hdr = px('--hdr') || 40, dock = px('--dock') || 40, small = innerWidth <= 760 ? 13 : 17, s = Math.min(1, small / fs), tgt = hdr + (dock - fs * s) / 2, D = Math.max(1, top0 - tgt), y = scrollY, p = Math.min(1, Math.max(0, y / D));\n"
      "      h.style.transform = `translateY(${Math.max(0, y - D).toFixed(1)}px) scale(${(1 + (s - 1) * p).toFixed(4)})`; bg.style.opacity = p >= 1 ? 1 : 0; document.documentElement.classList.toggle('docked', p >= 1); };\n"
      "    addEventListener('scroll', () => { if (!q) q = requestAnimationFrame(upd); }, { passive: true }); addEventListener('resize', measure); RM.addEventListener('change', measure); if (document.fonts) document.fonts.ready.then(measure); measure(); } }\n", 1)

def patch_icons(R, T):
    R("const LK = {\n", open(os.path.join(HERE, "icons.js"), encoding="utf8").read() + "const LK = {\n", 1)
    R("""aria-pressed="false">${n[2]}</button>""", """aria-pressed="false" title="${[n[2], n[3]].filter(Boolean).join(' — ')}" aria-label="${n[2]}">${icn(n[0])}<span>${n[2]}</span></button>""", 1)
    R('<div class="gh"><span><span class="gnum">${M.n}</span>', '<div class="gh"><span>${icn(M.k)}<span class="gnum">${M.n}</span>', 1)
