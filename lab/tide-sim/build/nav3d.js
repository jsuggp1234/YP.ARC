  // 핀 #293: SketchUp처럼 — 가운데 끌기 돌리기, Shift + 가운데 끌기 옮기기, 휠은 커서 쪽으로 확대, 가운데 두 번 누르기 처음 모습.
  // 트랙패드: Alt + 왼쪽 끌기 돌리기, Shift + 왼쪽 끌기 옮기기. 왼쪽 끌기만 해도 돌아가고(예전처럼), 왼쪽 클릭은 고르기에 그대로 써요. 손가락 둘은 확대.
  const pts = new Map(); let pinch = 0, lastMid = 0;
  const dmin = o.min || 20, dmax = o.max || 600, ray = new THREE.Raycaster(), ndc = new THREE.Vector2(), hit = new THREE.Vector3();
  const pan = (dx, dy) => { const k = orb.dist * 0.0016, ca = Math.cos(orb.az), sa = Math.sin(orb.az), se = Math.sin(orb.el);
    orb.tx -= dx * ca * k - dy * sa * se * k; orb.tz += dx * sa * k + dy * ca * se * k; orb.ty = clamp(orb.ty + dy * Math.cos(orb.el) * k, -40, 80); };
  const spin = (dx, dy) => { orb.az -= dx * 0.008; orb.el = clamp(orb.el + dy * 0.006, 0.04, 1.5); };
  const toward = (x, y, f) => { // 커서 아래 땅(목표 높이의 수평면)을 향해 f만큼 다가가기
    const r = canvas.getBoundingClientRect(); ndc.set((x - r.left) / r.width * 2 - 1, -((y - r.top) / r.height) * 2 + 1);
    place(); cam.updateMatrixWorld(); ray.setFromCamera(ndc, cam);
    const pl = new THREE.Plane(new THREE.Vector3(0, 1, 0), -orb.ty);
    if (ray.ray.intersectPlane(pl, hit)) { orb.tx += (hit.x - orb.tx) * f; orb.tz += (hit.z - orb.tz) * f; } };
  canvas.addEventListener('pointerdown', e => {
    if (e.button === 1) { e.preventDefault(); const t = performance.now(); if (t - lastMid < 380) { Object.assign(orb, home); req(); lastMid = 0; return; } lastMid = t; }
    pts.set(e.pointerId, [e.clientX, e.clientY]); try { canvas.setPointerCapture(e.pointerId); } catch (_) {} canvas.style.cursor = 'grabbing'; });
  canvas.addEventListener('pointermove', e => {
    if (!pts.has(e.pointerId)) return; const p = pts.get(e.pointerId), dx = e.clientX - p[0], dy = e.clientY - p[1]; pts.set(e.pointerId, [e.clientX, e.clientY]);
    if (pts.size === 1) {
      const mid = (e.buttons & 4) !== 0, right = (e.buttons & 2) !== 0;
      if ((mid && e.shiftKey) || right || (!mid && e.shiftKey)) pan(dx, dy);
      else spin(dx, dy);
    }
    else if (pts.size === 2) { const [a, b] = [...pts.values()], d = Math.hypot(a[0] - b[0], a[1] - b[1]); if (pinch) orb.dist = clamp(orb.dist * pinch / d, dmin, dmax); pinch = d; }
    touched = 1; req();
  });
  const up = e => { pts.delete(e.pointerId); if (pts.size < 2) pinch = 0; canvas.style.cursor = ''; };
  canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
  canvas.addEventListener('mousedown', e => { if (e.button === 1) e.preventDefault(); });
  canvas.addEventListener('auxclick', e => { if (e.button === 1) e.preventDefault(); });
  canvas.setAttribute('data-lenis-prevent', '');
  canvas.addEventListener('wheel', e => { e.preventDefault(); const d0 = orb.dist, d1 = clamp(d0 * Math.exp(e.deltaY * 0.0012), dmin, dmax);
    if (d1 < d0) toward(e.clientX, e.clientY, 1 - d1 / d0); orb.dist = d1; touched = 1; req(); }, { passive: false });
  canvas.addEventListener('dblclick', () => { Object.assign(orb, home); req(); });
  canvas.addEventListener('contextmenu', e => e.preventDefault());
  { const box = canvas.parentElement; if (box && !box.querySelector('.nav-lg')) { const g = document.createElement('span'); g.className = 'nav-lg'; g.textContent = NAV_LG; box.appendChild(g); } }
