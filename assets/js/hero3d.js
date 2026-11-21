// ============================================================
// hero3d.js — 첫 화면: 작품들을 "흰 모형"처럼 보여주는 3D 장면 (Three.js)
//  - 주변엔 흐린 도시 블록, 가운데엔 data.js의 작품 매스
//  - 마우스를 올리면 매스가 솟고 이름표가 펼쳐짐, 클릭하면 작품 페이지로
//  - 십자선 커서가 모형 위의 실제 좌표(m)를 읽어줌
//  - WebGL이 안 되면 false를 돌려주고, site.js가 2D 버전으로 대신 그려요.
// ============================================================
window.hero3D = function hero3D(host, ui) {
  const T = window.THREE;
  if (!T) return null;
  let renderer;
  try {
    renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    if (!renderer.getContext()) return null;
  } catch (e) {
    return null;
  }
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
  const col = (k) => new T.Color(css(k) || "#000");

  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = T.PCFSoftShadowMap;
  renderer.setClearColor(0x000000, 0);
  const canvas = renderer.domElement;
  canvas.setAttribute("aria-hidden", "true");
  host.appendChild(canvas);

  const scene = new T.Scene();
  const cam = new T.OrthographicCamera(-1, 1, 1, -1, 0.1, 300);
  const hemi = new T.HemisphereLight(0xffffff, 0xd4d4d4, 0.85);
  scene.add(hemi);
  const sun = new T.DirectionalLight(0xffffff, 0.48);
  sun.position.set(-16, 26, 10);
  sun.castShadow = true;
  sun.shadow.mapSize.set(2048, 2048);
  Object.assign(sun.shadow.camera, { left: -20, right: 20, top: 20, bottom: -20, near: 1, far: 90 });
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  // ---------- 바닥: 격자 텍스처 + 그림자 받는 면 ----------
  const G = 12; // 격자 반경(칸) — 도시를 넓게 (핀 #214)
  const MS = 0.62; // 작품 매스 축척 (핀 #213: 전체 크기 축소)
  const sm = (b) => b.map((v, i) => (i < 6 && typeof v === "number" ? v * MS : v));
  const gridCanvas = document.createElement("canvas");
  gridCanvas.width = gridCanvas.height = 2048;
  const gridTex = new T.CanvasTexture(gridCanvas);
  gridTex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  function paintGrid() {
    const g = gridCanvas.getContext("2d"), S = 2048, n = G * 2, c = S / n;
    g.clearRect(0, 0, S, S);
    g.strokeStyle = css("--ink");
    for (let k = 0; k <= n * 4; k++) {
      const major = k % 4 === 0;
      g.globalAlpha = major ? 0.13 : 0.045;
      g.lineWidth = major ? 2 : 1.2;
      const p = (k * c) / 4;
      g.beginPath(); g.moveTo(p, 0); g.lineTo(p, S); g.moveTo(0, p); g.lineTo(S, p); g.stroke();
    }
    g.globalAlpha = 1;
    g.globalCompositeOperation = "destination-in";
    const rg = g.createRadialGradient(S / 2, S / 2, S * 0.12, S / 2, S / 2, S / 2);
    rg.addColorStop(0, "rgba(0,0,0,1)"); rg.addColorStop(0.7, "rgba(0,0,0,.55)"); rg.addColorStop(1, "rgba(0,0,0,0)");
    g.fillStyle = rg; g.fillRect(0, 0, S, S);
    g.globalCompositeOperation = "source-over";
    gridTex.needsUpdate = true;
  }
  paintGrid();
  const grid = new T.Mesh(new T.PlaneGeometry(G * 2, G * 2), new T.MeshBasicMaterial({ map: gridTex, transparent: true, depthWrite: false }));
  grid.rotation.x = -Math.PI / 2;
  scene.add(grid);
  const shadowMat = new T.ShadowMaterial({ opacity: 0.1 });
  const ground = new T.Mesh(new T.PlaneGeometry(80, 80), shadowMat);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = 0.002;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---------- 상자 만들기 ----------
  const unit = new T.BoxGeometry(1, 1, 1);
  unit.translate(0, 0.5, 0); // 바닥 기준 → scale.y = 높이
  const unitEdges = new T.EdgesGeometry(unit);
  const faceMat = (c) => new T.MeshLambertMaterial({ color: c, polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits: 1 });
  const ctxMat = faceMat(col("--model-2"));
  const ctxEdge = new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.16 });
  // 상자 말고도 실제 작품 형태를 위한 모양들 (data.js mass의 7번째 값):
  //  "cyl" 기둥·타원 판, "cone" 나무, "flare" 버섯 기둥머리, "dome" 둔덕, "gable" 박공지붕(용마루가 깊이 방향)
  //  8번째 값은 평면 회전 각도(도)
  const shapes = { box: { g: unit, e: unitEdges } };
  function shape(t) {
    if (shapes[t]) return shapes[t];
    if (!["cyl", "cone", "flare", "dome", "gable", "ball", "wedge"].includes(t)) return shapes.box;
    let g;
    if (t === "cyl") g = new T.CylinderGeometry(0.5, 0.5, 1, 28).translate(0, 0.5, 0);
    else if (t === "cone") g = new T.CylinderGeometry(0, 0.5, 1, 14).translate(0, 0.5, 0);
    else if (t === "flare") g = new T.CylinderGeometry(0.5, 0.1, 1, 24).translate(0, 0.5, 0);
    else if (t === "wedge") { // 직각삼각기둥: 직각은 (x0, y0) 모서리, 빗변은 (x0+w, y0)–(x0, y0+d)
      const sh = new T.Shape(); sh.moveTo(-0.5, 0.5); sh.lineTo(0.5, 0.5); sh.lineTo(-0.5, -0.5); sh.lineTo(-0.5, 0.5);
      g = new T.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false }).rotateX(-Math.PI / 2);
    }
    else if (t === "ball") g = new T.SphereGeometry(0.5, 16, 12).translate(0, 0.5, 0);
    else if (t === "dome") g = new T.SphereGeometry(0.5, 32, 10, 0, Math.PI * 2, 0, Math.PI / 2).scale(1, 2, 1);
    else {
      const sh = new T.Shape(); sh.moveTo(-0.5, 0); sh.lineTo(0.5, 0); sh.lineTo(0, 1); sh.lineTo(-0.5, 0);
      g = new T.ExtrudeGeometry(sh, { depth: 1, bevelEnabled: false }).translate(0, 0, -0.5);
    }
    return (shapes[t] = { g, e: new T.EdgesGeometry(g, 28) });
  }
  // 층 선 (핀 #301): 단위 상자 둘레에 n개 층의 수평선
  const FH = 0.085, ringCache = {};
  function rings(n) {
    if (ringCache[n]) return ringCache[n];
    const v = [], q = [[-0.5, -0.5], [0.5, -0.5], [0.5, 0.5], [-0.5, 0.5]];
    for (let i = 1; i < n; i++) { const y = i / n; for (let e = 0; e < 4; e++) { const a = q[e], b = q[(e + 1) % 4]; v.push(a[0] * 1.002, y, a[1] * 1.002, b[0] * 1.002, y, b[1] * 1.002); } }
    const g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(v, 3));
    return (ringCache[n] = g);
  }
  // 세로 창살: 긴 면에 일정 간격(MW)으로 세로선
  const MW = 0.11;
  function mullions(w, d) {
    const nx = Math.max(0, Math.round(w / MW)), nz = Math.max(0, Math.round(d / MW)), key = nx + "x" + nz;
    if (ringCache[key]) return ringCache[key];
    const v = [];
    for (let i = 1; i < nx; i++) { const x = -0.5 + i / nx; v.push(x, 0, 0.501, x, 1, 0.501, x, 0, -0.501, x, 1, -0.501); }
    for (let i = 1; i < nz; i++) { const z = -0.5 + i / nz; v.push(0.501, 0, z, 0.501, 1, z, -0.501, 0, z, -0.501, 1, z); }
    const g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(v, 3));
    return (ringCache[key] = g);
  }
  function box(x, z, w, d, h, mat, emat, t, rot, fmat, mmat) {
    const sh = shape(t);
    const m = new T.Mesh(sh.g, mat);
    m.position.set(x + w / 2, 0, z + d / 2);
    m.scale.set(w, 0.0001, d);
    if (rot) m.rotation.y = (-rot * Math.PI) / 180;
    m.castShadow = m.receiveShadow = true;
    m.add(new T.LineSegments(sh.e, emat));
    if (fmat && (!t || t === "box") && h > FH * 1.6) m.add(new T.LineSegments(rings(Math.round(h / FH)), fmat));
    if (mmat && (!t || t === "box") && h > FH * 2.5 && w > MW * 2.5 && d > MW * 2.5) m.add(new T.LineSegments(mullions(w, d), mmat));
    return m;
  }

  // 둔덕 조직 (RE:TIDE): 둔덕 [cx, cy, r, h] 들과 그 사이를 잇는 목 [i, j, 반폭] 으로 높이장을 만들고
  // 등고선을 그어 지형 모형처럼 보여요. data.js 의 terrain 값.
  const bumpF = (d) => (d >= 1 ? 0 : d < 0.3 ? 1 : 0.5 * (1 + Math.cos((Math.PI * (d - 0.3)) / 0.7)));
  window.tideHeight = (tr, x, y) => {
    let v = 0;
    for (const [cx, cy, r, h] of tr.m) v = Math.max(v, h * bumpF(Math.hypot(x - cx, y - cy) / r));
    for (const [i, j, w] of tr.links) {
      const [ax, ay, , ah] = tr.m[i], [bx, by, , bh] = tr.m[j];
      const dx = bx - ax, dy = by - ay, L2 = dx * dx + dy * dy;
      const u = Math.max(0, Math.min(1, ((x - ax) * dx + (y - ay) * dy) / L2));
      const d = Math.hypot(x - ax - u * dx, y - ay - u * dy) / w;
      if (d < 1) v = Math.max(v, (ah + (bh - ah) * u) * 0.55 * 0.5 * (1 + Math.cos(Math.PI * d)));
    }
    return v;
  };
  function terrainMesh(p, mat, emat) {
    const tr = p.terrain;
    let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [cx, cy, r] of tr.m) { x0 = Math.min(x0, cx - r); y0 = Math.min(y0, cy - r); x1 = Math.max(x1, cx + r); y1 = Math.max(y1, cy + r); }
    const NX = 150, NY = Math.round((150 * (y1 - y0)) / (x1 - x0)), E = 0.004;
    const H = [], pos = [], idx = [];
    for (let j = 0; j <= NY; j++) for (let i = 0; i <= NX; i++) {
      const lx = x0 + ((x1 - x0) * i) / NX, ly = y0 + ((y1 - y0) * j) / NY, h = tideHeight(tr, lx, ly);
      H.push(h);
      pos.push(p.pos[0] + lx * MS, Math.max(0, h) * MS, p.pos[1] + ly * MS);
    }
    const at = (i, j) => j * (NX + 1) + i;
    for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const a = at(i, j), b = at(i + 1, j), c = at(i, j + 1), d = at(i + 1, j + 1);
      if (H[a] > E || H[b] > E || H[c] > E || H[d] > E) idx.push(a, c, b, b, c, d);
    }
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    const m = new T.Mesh(g, mat);
    m.castShadow = m.receiveShadow = true;
    // 등고선 (가장자리 + 일정 간격)
    const seg = [], lv = [E * 2]; for (let L = tr.step; L < 1; L += tr.step) lv.push(L);
    const P = (i, j, k) => [p.pos[0] + (x0 + ((x1 - x0) * i) / NX) * MS, k * MS, p.pos[1] + (y0 + ((y1 - y0) * j) / NY) * MS];
    for (const L of lv) for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
      const cs = [[i, j], [i + 1, j], [i + 1, j + 1], [i, j + 1]], pts = [];
      for (let e = 0; e < 4; e++) {
        const [ai, aj] = cs[e], [bi, bj] = cs[(e + 1) % 4], ha = H[at(ai, aj)], hb = H[at(bi, bj)];
        if ((ha - L) * (hb - L) < 0) { const t = (L - ha) / (hb - ha); pts.push(P(ai + (bi - ai) * t, aj + (bj - aj) * t, L + 0.002)); }
      }
      if (pts.length >= 2) seg.push(...pts[0], ...pts[1]);
      if (pts.length === 4) seg.push(...pts[2], ...pts[3]);
    }
    const lg = new T.BufferGeometry(); lg.setAttribute("position", new T.Float32BufferAttribute(seg, 3));
    m.add(new T.LineSegments(lg, new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.32 })));
    return m;
  }

  // 작품 매스
  const works = PROJECTS.filter((p) => (p.mass || p.terrain) && p.pos).map((p, k) => {
    const grp = new T.Group();
    const mat = faceMat(col("--model"));
    const emat = new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.88 });
    const fmat = new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.3 });
    let top = 0, ax = 0, az = 0;
    const meshes = (p.mass || []).map((b) => sm(b)).map(([x, y, w, d, h, z = 0, t, rot]) => {
      const m = box(p.pos[0] + x, p.pos[1] + y, w, d, h, mat, emat, t, rot, fmat);
      m.userData = { k, h, z };
      grp.add(m);
      if (z + h >= top) { top = z + h; ax = p.pos[0] + x + w / 2; az = p.pos[1] + y + d / 2; }
      return m;
    });
    if (p.terrain) { const m = terrainMesh(p, mat, emat); m.userData = { k, h: 1, z: 0 }; grp.add(m); meshes.push(m); }
    // 물 (RE:TIDE, 핀 #222): 둔덕 아래로 옅은 회색 수면 + 물결 해칭
    if (p.terrain && p.terrain.water && !p.terrain.sea) {
      let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const wm = p.terrain.water;
      for (const [cx, cy, r] of p.terrain.m) { x0 = Math.min(x0, cx - r); y0 = Math.min(y0, cy - r); x1 = Math.max(x1, cx + r); y1 = Math.max(y1, cy + r); }
      x0 = (x0 - wm) * MS; y0 = (y0 - wm) * MS; x1 = (x1 + wm) * MS; y1 = (y1 + wm) * MS;
      const wmat = new T.MeshBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.06, depthWrite: false });
      const wp = new T.Mesh(new T.PlaneGeometry(x1 - x0, y1 - y0), wmat);
      wp.rotation.x = -Math.PI / 2; wp.position.set(p.pos[0] + (x0 + x1) / 2, 0.012, p.pos[1] + (y0 + y1) / 2);
      grp.add(wp);
      const hs = [];
      for (let y = y0 + 0.06; y < y1; y += 0.09) { let x = x0; while (x < x1) { const L = 0.08 + ((x * 13.7 + y * 7.3) % 1 + 1) % 1 * 0.22; hs.push(p.pos[0] + x, 0.014, p.pos[1] + y, p.pos[0] + Math.min(x1, x + L), 0.014, p.pos[1] + y); x += L + 0.06; } }
      const hg = new T.BufferGeometry(); hg.setAttribute("position", new T.Float32BufferAttribute(hs, 3));
      grp.add(new T.LineSegments(hg, new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.18 })));
    }
    scene.add(grp);
    const dist = Math.hypot(p.pos[0], p.pos[1]);
    return { p, k, grp, mat, emat, fmat, meshes, anchor: new T.Vector3(ax, top, az), lift: 0, glow: 0, delay: 0.55 + k * 0.14, dist };
  });
  const pickables = works.flatMap((w) => w.meshes);

  // 바다 (RE:TIDE 주변, 핀 #269): 작품 중심에서 반지름 sea 안쪽, 해안선은 부드럽게 출렁여요
  const seas = works.filter((w) => w.p.terrain && w.p.terrain.sea).map((w) => {
    const tr = w.p.terrain; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
    for (const [cx, cy, r] of tr.m) { x0 = Math.min(x0, cx - r); y0 = Math.min(y0, cy - r); x1 = Math.max(x1, cx + r); y1 = Math.max(y1, cy + r); }
    // 중심을 도시 바깥쪽(원점 반대편)으로 조금 밀어 바다가 가장자리로 열리게
    const cx = w.p.pos[0] + ((x0 + x1) / 2) * MS, cz = w.p.pos[1] + ((y0 + y1) / 2) * MS, L = Math.hypot(cx, cz) || 1;
    return { cx: cx + (cx / L) * 2.6, cz: cz + (cz / L) * 2.6, R: tr.sea };
  });
  const seaR = (sx, th) => sx.R * (1 + 0.1 * Math.sin(3 * th + 0.7) + 0.06 * Math.sin(7 * th + 2.1));
  const inSea = (x, z, pad = 0) => seas.some((sx) => Math.hypot(x - sx.cx, z - sx.cz) < seaR(sx, Math.atan2(z - sx.cz, x - sx.cx)) + pad);
  seas.forEach((sx) => {
    const sh = new T.Shape(), N = 160;
    for (let i = 0; i <= N; i++) { const th = (i / N) * Math.PI * 2, r = seaR(sx, th); const x = sx.cx + r * Math.cos(th), z = sx.cz + r * Math.sin(th); i ? sh.lineTo(x, -z) : sh.moveTo(x, -z); }
    const wmat = new T.MeshBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.05, depthWrite: false });
    const wp = new T.Mesh(new T.ShapeGeometry(sh), wmat); wp.rotation.x = -Math.PI / 2; wp.position.y = 0.011; scene.add(wp);
    // 해안선 + 물결 해칭
    const cl = []; for (let i = 0; i < N; i++) { const a = (i / N) * Math.PI * 2, b = ((i + 1) / N) * Math.PI * 2, ra = seaR(sx, a), rb = seaR(sx, b); cl.push(sx.cx + ra * Math.cos(a), 0.016, sx.cz + ra * Math.sin(a), sx.cx + rb * Math.cos(b), 0.016, sx.cz + rb * Math.sin(b)); }
    const hs = [];
    for (let z = sx.cz - sx.R * 1.2; z < sx.cz + sx.R * 1.2; z += 0.16) { let x = sx.cx - sx.R * 1.2; while (x < sx.cx + sx.R * 1.2) { const Lh = 0.12 + (((x * 13.7 + z * 7.3) % 1) + 1) % 1 * 0.35; if (inSea(x, z, -0.15) && inSea(x + Lh, z, -0.15)) hs.push(x, 0.014, z, x + Lh, 0.014, z); x += Lh + 0.1; } }
    const g1 = new T.BufferGeometry(); g1.setAttribute("position", new T.Float32BufferAttribute(cl, 3));
    const g2 = new T.BufferGeometry(); g2.setAttribute("position", new T.Float32BufferAttribute(hs, 3));
    scene.add(new T.LineSegments(g1, new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.35 })));
    scene.add(new T.LineSegments(g2, new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.16 })));
  });

  // 주변 도시 블록 (매번 같은 배치가 되도록 고정 씨앗)
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const taken = (i, j) => works.some((wk) => (wk.p.mass || []).concat(wk.p.terrain ? wk.p.terrain.m.map(([cx, cy, r]) => [cx - r, cy - r, 2 * r, 2 * r]) : []).map(sm).some(([x, y, w, d]) => {
    const X = wk.p.pos[0] + x, Y = wk.p.pos[1] + y;
    return i + 1 > X - 0.7 && i < X + w + 0.7 && j + 1 > Y - 0.7 && j < Y + d + 0.7;
  }));
  const city = [];
  const ctxFloor = new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.07 });
  const ctxMull = new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.045 });
  const plotV = [];
  const isStreet = (i, j) => (i + G) % 4 === 3 || (j + G) % 5 === 4;
  for (let i = -G; i < G; i++) for (let j = -G; j < G; j++) {
    const dist = Math.hypot(i + 0.5, j + 0.5);
    if (dist > G - 0.6 || isStreet(i, j) || taken(i, j) || inSea(i + 0.5, j + 0.5, 0.75)) continue;
    const empty = rnd() < 0.22;
    // 필지선 (블록 경계, 보도 안쪽)
    const pi = 0.06;
    plotV.push(i + pi, 0.006, j + pi, i + 1 - pi, 0.006, j + pi, i + 1 - pi, 0.006, j + pi, i + 1 - pi, 0.006, j + 1 - pi, i + 1 - pi, 0.006, j + 1 - pi, i + pi, 0.006, j + 1 - pi, i + pi, 0.006, j + 1 - pi, i + pi, 0.006, j + pi);
    if (empty) continue;
    const base = (0.22 + rnd() * 1.15) * Math.max(0.18, 1 - dist / G) * 0.6;
    const ins = 0.1 + rnd() * 0.05;
    // 블록을 1–3개 필지로 나눔 (가로 또는 세로)
    const n = 1 + Math.floor(rnd() * 3), vert = rnd() < 0.5, L = 1 - ins * 2, gap = 0.05;
    let off = 0;
    for (let k = 0; k < n; k++) {
      const part = k === n - 1 ? L - off : (L - gap * (n - 1)) * (0.25 + rnd() * 0.5) / (n === 2 ? 1 : 1.6);
      const h = Math.max(0.05, base * (0.55 + rnd() * 0.9));
      const [bx, bz, bw, bd] = vert ? [i + ins + off, j + ins, part, L] : [i + ins, j + ins + off, L, part];
      if (part > 0.08) {
        const m = box(bx, bz, bw, bd, h, ctxMat, ctxEdge, undefined, 0, ctxFloor, ctxMull);
        m.userData = { h, ph: rnd() * 6.28, delay: 0.05 + dist * 0.045 };
        scene.add(m);
        city.push(m);
      }
      off += part + gap;
      if (off >= L - 0.08) break;
    }
  }
  {
    const g = new T.BufferGeometry(); g.setAttribute("position", new T.Float32BufferAttribute(plotV, 3));
    scene.add(new T.LineSegments(g, new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.09 })));
  }
  // 길: 차선 가운데 점선 + 양쪽 보도 경계선 (작품 대지·바다·바깥은 건너뜀)
  {
    const lane = [], curb = [], R = G - 0.9, ok = (x, z) => Math.hypot(x, z) < R && !taken(Math.floor(x), Math.floor(z)) && !inSea(x, z, 0.3);
    const run = (fixed, horiz) => {
      for (let t = -G; t < G; t += 0.25) {
        const [x0, z0, x1, z1] = horiz ? [t, fixed, t + 0.25, fixed] : [fixed, t, fixed, t + 0.25];
        if (!ok((x0 + x1) / 2, (z0 + z1) / 2)) continue;
        if ((Math.round(t * 4) & 1) === 0) lane.push(x0, 0.008, z0, horiz ? x0 + 0.13 : x1, 0.008, horiz ? z1 : z0 + 0.13);
        for (const o of [-0.4, 0.4]) curb.push(horiz ? x0 : x0 + o, 0.008, horiz ? z0 + o : z0, horiz ? x1 : x1 + o, 0.008, horiz ? z1 + o : z1);
      }
    };
    for (let i = -G; i < G; i++) if ((i + G) % 4 === 3) run(i + 0.5, false);
    for (let j = -G; j < G; j++) if ((j + G) % 5 === 4) run(j + 0.5, true);
    const g1 = new T.BufferGeometry(); g1.setAttribute("position", new T.Float32BufferAttribute(lane, 3));
    const g2 = new T.BufferGeometry(); g2.setAttribute("position", new T.Float32BufferAttribute(curb, 3));
    scene.add(new T.LineSegments(g1, new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.12 })));
    scene.add(new T.LineSegments(g2, new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.1 })));
    // 가로수: 보도 위에 일정 간격 (한 번에 그리는 InstancedMesh)
    const spots = [];
    const trees = (fixed, horiz) => { for (let t = -G + 0.3; t < G; t += 0.42) { for (const o of [-0.46, 0.46]) { const x = horiz ? t : fixed + o, z = horiz ? fixed + o : t; if (ok(x, z) && rnd() < 0.8) spots.push([x, z, 0.75 + rnd() * 0.5]); } } };
    for (let i = -G; i < G; i++) if ((i + G) % 4 === 3) trees(i + 0.5, false);
    for (let j = -G; j < G; j++) if ((j + G) % 5 === 4) trees(j + 0.5, true);
    const crown = new T.SphereGeometry(0.075, 10, 8).translate(0, 0.17, 0);
    const tmat = new T.MeshLambertMaterial({ color: col("--model-2") });
    const im = new T.InstancedMesh(crown, tmat, spots.length);
    const M4 = new T.Matrix4(), trunk = [];
    spots.forEach(([x, z, k], n) => { M4.makeScale(k, k, k).setPosition(x, 0, z); im.setMatrixAt(n, M4); trunk.push(x, 0, z, x, 0.12 * k, z); });
    im.castShadow = true;
    scene.add(im);
    const tg = new T.BufferGeometry(); tg.setAttribute("position", new T.Float32BufferAttribute(trunk, 3));
    scene.add(new T.LineSegments(tg, new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.25 })));
    window.__ypTrees = { tmat };
  }

  // ---------- 테마 색 반영 ----------
  let modelC = col("--model"), hiC = col("--model-hi");
  function retheme() {
    modelC = col("--model"); hiC = col("--model-hi");
    ctxMat.color = col("--model-2");
    ctxEdge.color = col("--ink");
    works.forEach((w) => { w.emat.color = col("--ink"); w.fmat.color = col("--ink"); });
    ctxFloor.color = col("--ink"); ctxMull.color = col("--ink");
    if (window.__ypTrees) window.__ypTrees.tmat.color = col("--model-2");
    const dark = document.documentElement.dataset.mode === "dark";
    hemi.intensity = dark ? 0.55 : 0.85;
    sun.intensity = dark ? 0.32 : 0.48;
    shadowMat.opacity = dark ? 0.32 : 0.1;
    ctxEdge.opacity = dark ? 0.22 : 0.16;
    paintGrid();
  }
  retheme();
  document.addEventListener("yp:theme", retheme);

  // ---------- 카메라 ----------
  let W = 1, H = 1, mx = 0, my = 0, az = Math.PI / 4, el = 0.6155, zoom = 1, scrollP = 0;
  const target = new T.Vector3(0, 0.4, 0);
  function resize() {
    W = host.clientWidth; H = host.clientHeight;
    renderer.setSize(W, H, false);
    canvas.style.width = "100%"; canvas.style.height = "100%";
  }
  resize();
  new ResizeObserver(resize).observe(host);

  // ---------- 입력 ----------
  const ray = new T.Raycaster();
  const ndc = new T.Vector2();
  const plane = new T.Plane(new T.Vector3(0, 1, 0), 0);
  const hitP = new T.Vector3();
  let pointer = null, hoverCanvas = -1, hoverUi = -1, touchSel = -1;
  function pick(cx, cy) {
    const r = canvas.getBoundingClientRect();
    ndc.set(((cx - r.left) / r.width) * 2 - 1, -((cy - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(ndc, cam);
    const hit = ray.intersectObjects(pickables, false)[0];
    let coord = null;
    if (ray.ray.intersectPlane(plane, hitP)) coord = [hitP.x * 7.2, hitP.z * 7.2];
    return { k: hit ? hit.object.userData.k : -1, coord };
  }
  addEventListener("pointermove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  canvas.addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") pointer = [e.clientX, e.clientY]; }, { passive: true });
  canvas.addEventListener("pointerleave", () => { pointer = null; hoverCanvas = -1; ui.coords(null); });
  let lastType = "mouse";
  canvas.addEventListener("pointerdown", (e) => { lastType = e.pointerType; }, { passive: true });
  canvas.addEventListener("click", (e) => {
    const { k } = pick(e.clientX, e.clientY);
    if (k < 0) { touchSel = -1; return; }
    // 터치: 첫 탭은 이름표 보기, 같은 매스를 한 번 더 탭하면 이동
    if (lastType !== "mouse" && touchSel !== k) { touchSel = k; return; }
    ui.open(k);
  });

  // ---------- 그리기 ----------
  const easeOut = (x) => (x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
  const lerp = (a, b, t) => a + (b - a) * t;
  let running = true, t0 = null, started = false, last = performance.now();
  const v = new T.Vector3();
  new IntersectionObserver((es) => { running = es[0].isIntersecting; if (running) loop(); }, { threshold: 0 }).observe(host);
  // 첫 화면 모션 아트가 걷히기 시작하면 도시 모형이 다시 솟아올라요(같은 매스가 이어지는 느낌)
  document.addEventListener("yp:works", () => { if (started && !REDUCED) { t0 = performance.now(); handoff = 1; } });
  let handoff = 0;
  document.addEventListener("visibilitychange", () => { if (!document.hidden && running) loop(); });
  ui.whenReady(() => { started = true; t0 = performance.now(); });
  let raf = 0;
  function loop() {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }
  function frame(now) {
    if (!running || document.hidden) return;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const t = started ? (now - t0) / 1000 : 0;
    const k = 1 - Math.pow(0.0015, dt); // 부드러운 추종 계수

    // 스크롤에 따라 살짝 다가가며 기울기 변화
    const r = host.getBoundingClientRect();
    scrollP = Math.min(1, Math.max(0, -r.top / Math.max(1, r.height)));
    const wide = W > 900;
    az = lerp(az, Math.PI / 4 + mx * 0.24 + (REDUCED ? 0 : Math.sin(t * 0.12) * 0.035) + scrollP * 0.25, k * 0.5);
    handoff = Math.max(0, handoff - dt * 0.45);
    el = lerp(el, 0.6155 - my * 0.08 + scrollP * 0.22 + handoff * 0.75, k * 0.5);
    zoom = lerp(zoom, 1 + scrollP * 0.45 + handoff * 0.35, k);
    const R = 60;
    cam.position.set(target.x + R * Math.cos(el) * Math.cos(az), target.y + R * Math.sin(el), target.z + R * Math.cos(el) * Math.sin(az));
    cam.lookAt(target);
    const F = (wide ? 7.6 : Math.max(8.6, 12.5 * (H / W) * 0.62)) / zoom;
    const asp = W / H;
    cam.left = -F * asp; cam.right = F * asp; cam.top = F; cam.bottom = -F;
    if (wide) cam.setViewOffset(W, H, -W * 0.13, H * 0.02, W, H); else cam.setViewOffset(W, H, 0, H * 0.06, W, H);
    cam.updateProjectionMatrix();

    // 포인터 판정
    if (pointer) {
      const { k: hk, coord } = pick(pointer[0], pointer[1]);
      hoverCanvas = hk;
      ui.coords(coord, pointer);
    }
    const hover = hoverUi >= 0 ? hoverUi : hoverCanvas >= 0 ? hoverCanvas : touchSel;
    ui.cursor(hoverCanvas >= 0 ? works[hoverCanvas].p : null);
    canvas.style.cursor = hoverCanvas >= 0 ? "pointer" : "";

    // 도시 블록: 자라나기 + 숨쉬기
    city.forEach((m) => {
      const g = started ? easeOut(Math.max(0, (t - m.userData.delay) / 1.1)) : REDUCED ? 1 : 0;
      const b = REDUCED ? 1 : 1 + 0.1 * Math.sin(t * 0.7 + m.userData.ph);
      m.scale.y = Math.max(0.0001, m.userData.h * (REDUCED ? 1 : g) * b);
    });
    // 작품 매스
    works.forEach((w) => {
      const g = REDUCED ? 1 : started ? easeOut(Math.max(0, (t - w.delay) / 1.2)) : 0;
      const on = w.k === hover;
      w.lift = lerp(w.lift, on ? 1 : 0, k);
      w.meshes.forEach((m) => { const s = g * (1 + w.lift * 0.1); m.scale.y = Math.max(0.0001, m.userData.h * s); m.position.y = m.userData.z * s; });
      w.grp.position.y = w.lift * 0.12;
      w.mat.color.copy(modelC).lerp(hiC, w.lift);
      w.emat.opacity = lerp(w.emat.opacity, hover >= 0 && !on ? 0.4 : 0.92, k);
      // 이름표 위치
      v.copy(w.anchor);
      v.y = w.anchor.y * g * (1 + w.lift * 0.1) + w.grp.position.y;
      v.project(cam);
      ui.place(w.k, ((v.x + 1) / 2) * W, ((1 - v.y) / 2) * H, on, g > 0.92);
    });
    renderer.render(scene, cam);
    raf = requestAnimationFrame(frame);
  }
  loop();

  return {
    setHover(k) { hoverUi = k; },
  };
};
