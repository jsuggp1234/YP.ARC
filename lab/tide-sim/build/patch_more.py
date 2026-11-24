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
      "{ const _dp = drawPlan; drawPlan = function (cvId, id, w, o = {}) { const dk = isDark(), G = dk ? { mudLo: '#2a2a2a', con: '#4a4a4a', rev: '#333333', land: '#3a3a3a' } : { mudLo: '#e2e2e2', con: '#cfcfcf', rev: '#dedede', land: '#ececec' }, GK = dk ? { water: '#727272', water2: '#444444' } : { water: '#b6b6b6', water2: '#d2d2d2' };\n"
      "  const s3 = {}, sk = {}; for (const k in G) { s3[k] = C3[k]; C3[k] = G[k]; } for (const k in GK) { sk[k] = K[k]; K[k] = GK[k]; } try { _dp(cvId, id, w, o); } finally { Object.assign(C3, s3); Object.assign(K, sk); }", 1)

def patch_plan3(R, T):
    # 핀 #340·#346: 도면 보기 3D의 바닷물 회색을 진하게 (무채색)
    R("if (kind === 'water') return new THREE.MeshBasicMaterial({ color: pal.water, transparent: true, opacity: 0.07,", "if (kind === 'water') return new THREE.MeshBasicMaterial({ color: pal.water, transparent: true, opacity: 0.15,", 1)
    # 핀 #346: 도면 보기에서 물가선(물과 기단이 만나는 띠)을 진하게
    R("if (kind === 'foam') return new THREE.MeshBasicMaterial({ color: pal.ink, transparent: true, opacity: 0.25,", "if (kind === 'foam') return new THREE.MeshBasicMaterial({ color: pal.ink, transparent: true, opacity: 0.72,", 1)
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

# 핀 #305: 변수를 맞춘 뒤 조작판 끝 '물 흘려 보기' — 같은 3D에서 물이 차고 빠져요 (1초에 20분)
def patch_playwater(R, T):
    R("const lv = { lo: s.q[0], T2: r.T2, C: g.C, T1: r.T1 }, w = lv[U3.w];", "const lv = { lo: s.q[0], T2: r.T2, C: g.C, T1: r.T1 }, w = U3.t != null ? wAt(id, U3.t) : lv[U3.w];", 1)
    pl, st = T("Play water", "물 흘려 보기"), T("Pause water", "멈추기")
    R("      + '<div class=\"btns\" style=\"margin-top:12px\"><button class=\"btn\" id=\"u-reset\">",
      "      + '<div class=\"u-play\"><button class=\"btn\" id=\"u-play\" aria-pressed=\"false\"><svg viewBox=\"0 0 12 12\" width=\"11\" height=\"11\" aria-hidden=\"true\"><path d=\"M2 1.5L10.5 6L2 10.5Z\" fill=\"currentColor\"/></svg><span>" + pl + "</span></button><span class=\"u-play-t num\" id=\"u-play-t\"></span></div>'\n"
      "      + '<div class=\"btns\" style=\"margin-top:12px\"><button class=\"btn\" id=\"u-reset\">", 1)
    R("    $('#u-reset').addEventListener('click', () => { ST.V = Object.assign({}, CORE.DEF); this.sync(); onModel(); });",
      "    $('#u-reset').addEventListener('click', () => { ST.V = Object.assign({}, CORE.DEF); this.sync(); onModel(); });\n"
      "    { const b = $('#u-play'), lab = b.querySelector('span'), ic = b.querySelector('path'), out = $('#u-play-t'); let raf = 0, last = 0;\n"
      "      const stop = () => { cancelAnimationFrame(raf); raf = 0; b.setAttribute('aria-pressed', 'false'); lab.textContent = '" + pl + "'; ic.setAttribute('d', 'M2 1.5L10.5 6L2 10.5Z'); };\n"
      "      const f = now => { if (ST.view !== 'rules' && ST.view !== 'derive') { stop(); return; } const dt = Math.min(.1, (now - last) / 1000); last = now; U3.t = ((U3.t || 0) + dt * 20) % 525590;\n"
      "        const w = wAt(ST.sea, U3.t); if (U3.p3) { U3.p3.setWater(w, null); U3.wl = w; U3.v && U3.v.req && U3.v.req(); } out.textContent = fDate(U3.t) + ' · ' + fH(w) + ' m'; raf = requestAnimationFrame(f); };\n"
      "      b.addEventListener('click', () => { if (raf) { stop(); return; } if (U3.t == null) U3.t = 0; last = performance.now(); b.setAttribute('aria-pressed', 'true'); lab.textContent = '" + st + "'; ic.setAttribute('d', 'M2.5 1.5H5V10.5H2.5ZM7 1.5H9.5V10.5H7Z'); raf = requestAnimationFrame(f); });\n"
      "      $('#u3-w').addEventListener('click', () => { stop(); U3.t = null; out.textContent = ''; }); }", 1)

# 핀 #301·#309: 기록에서 찾은 점 → 그 높이가 만드는 기단 부분까지 점선이 끝까지 '찍~' 그어지고, 끝에 점과 이름
def patch_guides(R, T):
    R("const zz = mk.to != null ? mk.to : mk.z; x.save(); x.setLineDash([2, 3]); x.strokeStyle = K.water; x.beginPath(); x.moveTo(px, Y(zz)); x.lineTo(Xs(CORE.XL), Y(zz)); x.stroke(); x.restore();",
      "const zz = mk.to != null ? mk.to : mk.z, tg = guideTo(g, zz), tx = Xs(tg[0]), f = D4.scan >= 1 ? 1 : clamp((scanZ - mk.z) / ((zhi - zlo) * 0.12), 0, 1), ex = px + (tx - px) * f;\n"
      "      x.save(); x.setLineDash([4, 3]); x.strokeStyle = K.water; x.lineWidth = 1.1; x.beginPath(); x.moveTo(px, Y(zz)); x.lineTo(ex, Y(zz)); x.stroke(); x.restore();\n"
      "      if (f >= 1) { x.fillStyle = K.water; x.beginPath(); x.arc(tx, Y(zz), 3.4, 0, 7); x.fill(); x.strokeStyle = K.surface; x.lineWidth = 1; x.stroke(); txt(x, '→ ' + tg[1] + ' ' + fH(zz), Math.min(tx + 7, SR - 4), Y(zz) - 8, { align: tx + 120 > SR ? 'right' : 'left', font: FS(10, true), color: K.water, halo: K.surface }); }", 1)
    R("VIEWS.rules = {", "function guideTo(g, z) { const XC = CORE.XC, NM = { p99: '둘째 바닥', p50: '아래 바닥', step: '수변 단' };\n"
      "  const t = g.T.find(t => Math.abs(t.z - z) < 0.03); if (t) return [XC + (t.r0 + t.r1) / 2, NM[t.k] || '맨 위 바닥'];\n"
      "  if (Math.abs(g.C - z) < 0.03 && g.xn1 > g.xn0) return [(g.xn0 + g.xn1) / 2, '이음목'];\n"
      "  if (g.L > 0.1 && Math.abs(g.P - z) < 0.05) return [(g.xs0 + g.xs1) / 2, '자락 끝'];\n"
      "  const n = g.T.reduce((a, t) => Math.abs(t.z - z) < Math.abs(a.z - z) ? t : a, g.T[0]); return [XC + (n.r0 + n.r1) / 2, NM[n.k] || '맨 위 바닥']; }\n"
      "VIEWS.rules = {", 1)

# 핀 #307: 기단이 4–5개면 이웃끼리 낮고 매끈한 모래톱 목(스커트)으로 이어요. 등성이 높이 = 연결 변수(이음목 높이 g.C)라 섬이 되는 날 함께 잠겨요
def patch_skirts(R, T):
    # 핀 #307 → #344: 기단 사이 목을 필렛 곡선으로 매끈하게 잇는 판 (평면 모양을 그대로 세운 것, 윗면 = 이음목 높이)
    R("function plinth3D(g, o = {}) {", open(os.path.join(HERE, "necks.js"), encoding="utf8").read() + "function plinth3D(g, o = {}) {", 1)
    R("  const pads = [{ x: 0, z: 0, R: Rf }].concat(cl.map(c => ({ x: c.x, z: c.z, R: c.R })));\n",
      "  const pads = [{ x: 0, z: 0, R: Rf }].concat(cl.map(c => ({ x: c.x, z: c.z, R: c.R })));\n"
      "  { const H = g.C - gr; for (const nk of neckList(g, cl)) { const pts = neckOutline(nk, o.draft ? 10 : 24), sh = new THREE.Shape(pts.map(([px, pz]) => new THREE.Vector2(px, pz)));\n"
      "      const geo = new THREE.ExtrudeGeometry(sh, { depth: H + 0.4, bevelEnabled: false, curveSegments: 1 }), uv = geo.attributes.uv; for (let i = 0; i < uv.count; i++) uv.setXY(i, uv.getX(i) / 2, uv.getY(i) / 2);\n"
      "      const m = new THREE.Mesh(geo, matTop(g.C)); m.rotation.x = Math.PI / 2; m.position.y = H; add(m, g.C, 'neck'); edges(geo, m); } }\n", 1)
    R("const SEG = o.coarse ? 96 : 180;", "const SEG = o.draft ? 48 : o.coarse ? 96 : 180;", 1)
    R("TH = 2.5, fine = o.coarse ? 1 : 0.5;", "TH = 2.5, fine = o.draft ? 2 : o.coarse ? 1 : 0.5;", 1)
    R("const tp = new THREE.Mesh(ringTop(r0, r1, H, 120, 2), matTop(zz)), wl = new THREE.Mesh(ringWall(r1, -0.4, H, 120, 2), matWall(zz));", "const NS = o.draft ? 40 : 120, tp = new THREE.Mesh(ringTop(r0, r1, H, NS, 2), matTop(zz)), wl = new THREE.Mesh(ringWall(r1, -0.4, H, NS, 2), matWall(zz));", 1)
    # 평면 자락 고리에서 바깥 원 끝과 안쪽 원 시작이 이어져 그어지던 사선 없애기 (#341과 같은 원인)
    R("if (g.L > 0.1) { x.beginPath(); x.arc(CX, CY, Rf * sc, 0, 7); x.arc(CX, CY, g.R * sc, 7, 0, true);", "if (g.L > 0.1) { x.beginPath(); x.arc(CX, CY, Rf * sc, 0, 2 * Math.PI); x.moveTo(CX + g.R * sc, CY); x.arc(CX, CY, g.R * sc, 2 * Math.PI, 0, true);", 1)
    # 평면: 목을 다른 기단보다 먼저 칠하고 굵은 필렛 윤곽
    R("    // 다른 기단들\n    CL.forEach(c => {", "    drawNecks(x, neckList(g, CL), v => X(XC + v), Y, sc, con(g.C), K.ink);\n    // 다른 기단들\n    CL.forEach(c => {", 1)

# 핀 #345: 변수 3D가 막대에 바로 따라오게 — 끄는 동안은 한 장면에 한 번 거친 모형, 멈추면 고운 모형. 화면 밖·숨은 탭에서는 그리기를 멈춰요
def patch_perf(R, T):
    R("    U3.tm = setTimeout(() => { dispose3(v, U3.p3); U3.p3 = plinth3D(g, { coarse: true, cluster: clusterOf(id) }); v.scene.add(U3.p3.grp); U3.key = key; U3.wl = null; rules3D(); }, U3.p3 ? 160 : 0);\n    if (!U3.p3) return;\n",
      "    const build = dr => { dispose3(v, U3.p3); U3.p3 = plinth3D(g, { coarse: true, draft: dr, cluster: clusterOf(id) }); v.scene.add(U3.p3.grp); U3.key = key; U3.wl = null; };\n"
      "    cancelAnimationFrame(U3.raf);\n"
      "    if (!U3.p3) build(false); else { U3.raf = requestAnimationFrame(() => { build(true); rules3D(); }); U3.tm = setTimeout(() => { U3.key = ''; build(false); rules3D(); }, 300); return; }\n", 1)
    R("  function play() { if (!loopOn && anims.length) { last = 0; loopOn = requestAnimationFrame(loop); } }",
      "  let onScr = true; try { new IntersectionObserver(es => { onScr = es[0].isIntersecting; if (onScr) play(); }).observe(canvas); } catch (_) {} document.addEventListener('visibilitychange', () => { if (!document.hidden) play(); });\n"
      "  function play() { if (!loopOn && anims.length && onScr) { last = 0; loopOn = requestAnimationFrame(loop); } }", 1)
    R("    if (!anims.length || r.width < 2 || document.hidden) { loopOn = 0; return; }", "    if (!anims.length || r.width < 2 || document.hidden || !onScr) { loopOn = 0; return; }", 1)

# 핀 #348: 네 바다는 다섯 기단 보기로 시작 / 핀 #349: 실감(렌더) 보기의 하늘색 그라데이션 대신 무채색 바탕(--bg, 다크 모드 따라감)
def patch_bg(R, T):
    R("const W6 = { t: 0, play: 0, speed: 6, mode: 'one',", "const W6 = { t: 0, play: 0, speed: 6, mode: 'five',", 1)
    R("    else { scene.background = skyTex(dark); scene.fog = null; }", "    else { scene.background = new THREE.Color(pal.bg); scene.fog = null; }", 1)

# 핀 #347: 시뮬레이션 단계 오른쪽 판에도 변수 표(#u-ctl)를 — 같은 판을 그 단계로 옮겨 와 물 조작과 함께 써요 (변수체계로 가면 되돌아가요)
def patch_wvars(R, T):
    R("  ST.view = view;\n  $$('.view').forEach(", "  ST.view = view;\n  { const uc = $('#u-ctl'); if (uc) { if (!uc._home) uc._home = [uc.parentElement, uc.nextElementSibling]; const st = $$('#v-water .stack').pop();\n    if (view === 'water' && st) { if (uc.parentElement !== st) st.insertBefore(uc, st.children[1] || null); } else if (uc.parentElement !== uc._home[0]) uc._home[0].insertBefore(uc, uc._home[1]); } }\n  $$('.view').forEach(", 1)

# 핀 #303: 변수체계 3D 자리에 평면 + 단면 그림 (diag.js)
def patch_diag(R, T):
    R("<h3>3D로 보기 · 찾은 높이가 기단의 어느 부분이 되나", "<h3>평면과 단면 · 변수마다 바뀌는 부분", 1)
    R("function drawLinks() {", "const PLAN_T = " + repr(T("Plan", "평면")) + ", SEC_T = " + repr(T("Section", "단면")) + ";\n" + open(os.path.join(HERE, "diag.js"), encoding="utf8").read() + "function drawLinks() {", 1)
    R("  $$('.lk-bar button').forEach(b => {", "  drawDiag(); $$('.lk-bar button').forEach(b => {", 1)
    R('<span class="tag" id="d3-tag"></span></div>', '<span class="tag" id="d3-tag"></span><canvas id="d-diag" aria-label="' + T("Plan and section of the plinth: the part the chosen variable changes", "기단 평면과 단면: 고른 변수가 바꾸는 부분") + '"></canvas></div><p class="note d-cap" id="d-cap" aria-live="polite"></p>', 1)
    R("window.addEventListener('hashchange', route); route();", "window.addEventListener('hashchange', route); route();\n  { const d = document.getElementById('d-diag'); if (d) { let w0 = 0; new ResizeObserver(() => { const w = d.clientWidth; if (w && w !== w0) { w0 = w; drawDiag(); } }).observe(d); new MutationObserver(() => drawDiag()).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }); } }", 1)

# 핀 #343: 변수 조작판을 짧은 표로 — 한 줄에 변수 하나: 아이콘·이름(아래 작은 회색 읽기→만들기) | 슬라이더 | 값. 바탕은 옅은 회색 판
def patch_vtable(R, T):
    import json
    VS = {'layer': (T('Layer', '층위'), T('time above water → floors', '물 위의 시간 → 바닥')),
          'edge': (T('Edge', '경계'), T('days flooded → steps', '잠기는 날 → 수변 단')),
          'connect': (T('Link', '연결'), T('daily high → neck', '날마다의 만조 → 이음목')),
          'stay': (T('Stay', '머묾'), T('dry by day → apron', '낮에 마른 시간 → 자락')),
          'slope': (T('Slope', '경사'), T('rising speed → step width', '오르는 빠르기 → 단 너비')),
          'zone': (T('Zone', '영역'), T('days flooded → ground edges', '잠기는 날 → 땅의 경계')),
          'noon': (T('Noon', '시각'), T('noon water → parts open', '정오의 물 → 열린 곳'))}
    js = 'const VS = ' + json.dumps({k: list(v) for k, v in VS.items()}, ensure_ascii=False) + ';\n'
    old_g = """    const grpH = ([gname, items, M]) => `<div class="group${M.read ? ' read' : ''}" data-k="${M.k}"><div class="gh"><span>${icn(M.k)}<span class="gnum">${M.n}</span>${M.read ? '읽기 지표 · ' : ''}${gname}</span></div>`
      + `<div class="gio">읽는 열: ${M.col} → ${M.read ? '읽는 값' : '만드는 값'}: ${M.out}<br><b id="u-out-${M.k}"></b></div>`
      + items.filter(it => !AUX.includes(it[0])).map(sl).join('') + '</div>';"""
    new_g = "    " + js + """    const vn = M => `<div class="vn">${icn(M.k)}<span class="vt"><b><i>${M.n}</i>${VS[M.k][0]}</b><small>${VS[M.k][1]}</small></span></div>`;
    const grpH = ([gname, items, M]) => { const main = items.filter(it => !AUX.includes(it[0]));
      if (!main.length) return `<div class="group vrow ro${M.read ? ' read' : ''}" data-k="${M.k}" title="${gname}">${vn(M)}<span class="vo" id="u-out-${M.k}"></span></div>`;
      return main.map(([k, lab, a, b, st]) => `<div class="group vrow ctl" data-k="${M.k}" title="${gname} — ${lab}">${vn(M)}<input type="range" id="u-${k}" min="${a}" max="${b}" step="${st}" aria-label="${lab}"><span class="v" id="u-${k}-v"></span><b id="u-out-${M.k}" hidden></b></div>`).join(''); };"""
    R(old_g, new_g, 1)
    R("if (e) e.innerHTML = '지금 값: ' + t;", "if (e) e.innerHTML = t;", 1)
    R("set('noon', `바닥과 단 ${rd.nParts}곳 가운데 ${rd.openMin}~${rd.openMax}곳`);", "set('noon', `${rd.openMin}~${rd.openMax} / ${rd.nParts}" + T(" open", "곳") + "`);", 1)
