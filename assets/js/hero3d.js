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
  Object.assign(sun.shadow.camera, { left: -16, right: 16, top: 16, bottom: -16, near: 1, far: 80 });
  sun.shadow.bias = -0.0006;
  scene.add(sun);

  // ---------- 바닥: 격자 텍스처 + 그림자 받는 면 ----------
  const G = 8; // 격자 반경(칸)
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
  function box(x, z, w, d, h, mat, emat) {
    const m = new T.Mesh(unit, mat);
    m.position.set(x + w / 2, 0, z + d / 2);
    m.scale.set(w, 0.0001, d);
    m.castShadow = m.receiveShadow = true;
    m.add(new T.LineSegments(unitEdges, emat));
    return m;
  }

  // 작품 매스
  const works = PROJECTS.filter((p) => p.mass && p.pos).map((p, k) => {
    const grp = new T.Group();
    const mat = faceMat(col("--model"));
    const emat = new T.LineBasicMaterial({ color: col("--ink"), transparent: true, opacity: 0.88 });
    let top = 0, ax = 0, az = 0;
    const meshes = p.mass.map(([x, y, w, d, h]) => {
      const m = box(p.pos[0] + x, p.pos[1] + y, w, d, h, mat, emat);
      m.userData = { k, h };
      grp.add(m);
      if (h >= top) { top = h; ax = p.pos[0] + x + w / 2; az = p.pos[1] + y + d / 2; }
      return m;
    });
    scene.add(grp);
    const dist = Math.hypot(p.pos[0], p.pos[1]);
    return { p, k, grp, mat, emat, meshes, anchor: new T.Vector3(ax, top, az), lift: 0, glow: 0, delay: 0.55 + k * 0.14, dist };
  });
  const pickables = works.flatMap((w) => w.meshes);

  // 주변 도시 블록 (매번 같은 배치가 되도록 고정 씨앗)
  let seed = 7;
  const rnd = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const taken = (i, j) => works.some((wk) => wk.p.mass.some(([x, y, w, d]) => {
    const X = wk.p.pos[0] + x, Y = wk.p.pos[1] + y;
    return i + 1 > X - 0.7 && i < X + w + 0.7 && j + 1 > Y - 0.7 && j < Y + d + 0.7;
  }));
  const city = [];
  for (let i = -G; i < G; i++) for (let j = -G; j < G; j++) {
    const dist = Math.hypot(i + 0.5, j + 0.5);
    if (dist > G - 0.6 || (i + G) % 4 === 3 || (j + G) % 5 === 4 || taken(i, j) || rnd() < 0.22) continue;
    const h = (0.22 + rnd() * 1.15) * Math.max(0.18, 1 - dist / G) * 1.5;
    const ins = 0.1 + rnd() * 0.08;
    const m = box(i + ins, j + ins, 1 - ins * 2, 1 - ins * 2, h, ctxMat, ctxEdge);
    m.userData = { h, ph: rnd() * 6.28, delay: 0.05 + dist * 0.045 };
    scene.add(m);
    city.push(m);
  }

  // ---------- 테마 색 반영 ----------
  let modelC = col("--model"), hiC = col("--model-hi");
  function retheme() {
    modelC = col("--model"); hiC = col("--model-hi");
    ctxMat.color = col("--model-2");
    ctxEdge.color = col("--ink");
    works.forEach((w) => { w.emat.color = col("--ink"); });
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
    el = lerp(el, 0.6155 - my * 0.08 + scrollP * 0.22, k * 0.5);
    zoom = lerp(zoom, 1 + scrollP * 0.45, k);
    const R = 60;
    cam.position.set(target.x + R * Math.cos(el) * Math.cos(az), target.y + R * Math.sin(el), target.z + R * Math.cos(el) * Math.sin(az));
    cam.lookAt(target);
    const F = (wide ? 6.4 : Math.max(7.2, 10.5 * (H / W) * 0.62)) / zoom;
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
      w.meshes.forEach((m) => { m.scale.y = Math.max(0.0001, m.userData.h * g * (1 + w.lift * 0.1)); });
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
