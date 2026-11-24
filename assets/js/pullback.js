/* 끌어서 뒤로 가기 (2026-11-24 요청)
   화면 왼쪽 35% 안에서 마우스 왼쪽 버튼을 누른 채 왼쪽 → 오른쪽으로 잡아당기면(2026-11-24 방향 수정),
   커서 앞에 동그라미가 생기며 당긴 만큼 테두리가 차오르고, 끝까지 당겨 놓으면 이전 페이지로 가요.
   동그라미는 먹색으로 채워지고 안의 작은 화살표만 뚫려 있어서(마스크) 화살표 사이로 뒤 화면이 비쳐요.
   다른 기능을 쓰는 곳(링크·버튼·입력칸·캔버스·가로 띠·도면 장면·메뉴 등)에서 시작한 끌기는 건드리지 않아요.
   site.js 없이도 혼자 돌아가서 lab/tide-sim 같은 페이지에도 그대로 붙일 수 있어요. */
(function () {
  if (window.__ypPull) return; window.__ypPull = true;
  var D = document, root = D.documentElement;
  var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var SKIP = "a,button,input,select,textarea,label,summary,video,canvas,iframe,svg a,[contenteditable],[role=slider],[draggable=true],[data-nodrag]," +
    ".cs,.cs-gd,.sl,.sl-a,.sb-edge,#menu,.mn,.ct,.cg,.seq-stage,.pan,.pan-loop,.mv-ui,.fp-n,.cx-cv video,.hud,.ybar,.top,.yt-ctl,.ctl,.btns,.lk-bar,.dial,.md-sw";
  var isBackOk = function () {
    try { if (D.referrer && new URL(D.referrer).origin === location.origin && history.length > 1) return "back"; } catch (e) {}
    var p = location.pathname;
    if (/\/(index\.html)?$/.test(p) && !/\/lab\//.test(p)) return ""; // 첫 화면은 더 갈 곳이 없어요
    return "home";
  };
  var homeHref = function () { return /\/lab\/[^/]+\//.test(location.pathname) ? "../../lab.html" : "index.html"; };

  // 동그라미: 먹색 원에서 화살표 모양만 뚫어요(SVG mask) + 바깥 진행 테두리
  var R = 26, C = 2 * Math.PI * (R + 5);
  var el = D.createElement("div");
  el.className = "pb"; el.setAttribute("aria-hidden", "true");
  el.innerHTML =
    '<svg viewBox="-36 -36 72 72" width="72" height="72">' +
      '<defs><mask id="pb-m" maskUnits="userSpaceOnUse" x="-36" y="-36" width="72" height="72">' +
        '<circle r="' + R + '" fill="#fff"/>' +
        '<path d="M9 0H-9M-2 -7L-9 0L-2 7" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
      '</mask></defs>' +
      '<circle class="pb-dot" r="' + R + '" mask="url(#pb-m)"/>' +
      '<circle class="pb-ring" r="' + (R + 5) + '" stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + C.toFixed(1) + '" transform="rotate(-90)"/>' +
    '</svg>';
  var css = D.createElement("style");
  css.textContent =
    ".pb{position:fixed;left:0;top:0;width:72px;height:72px;margin:-36px 0 0 -36px;z-index:9000;pointer-events:none;opacity:0;transform:translate3d(var(--pbx,0),var(--pby,0),0) scale(var(--pbs,.4));transition:opacity .2s}" +
    ".pb svg{display:block;overflow:visible}" +
    ".pb-dot{fill:var(--ink,#111);fill-opacity:.82;transition:fill-opacity .2s}" +
    ".pb-ring{fill:none;stroke:var(--ink,#111);stroke-width:1;stroke-opacity:.5}" +
    "html.pb-on .pb{opacity:1}" +
    "html.pb-on,html.pb-on *{user-select:none!important;-webkit-user-select:none!important;cursor:grabbing!important}" +
    "html.pb-ready .pb-dot{fill-opacity:1}" +
    "html.pb-ready .pb-ring{stroke-opacity:1}" +
    "html.pb-on body>main,html.pb-on body>#main{transform:translate3d(calc(var(--pbd,0px)*.12),0,0);transition:none}" +
    "html.pb-back body>main,html.pb-back body>#main{transform:translate3d(0,0,0);transition:transform .35s cubic-bezier(.16,1,.3,1)}" +
    "html.pb-go .pb{transition:transform .32s cubic-bezier(.7,0,.84,0),opacity .32s;opacity:0}" +
    "html.pb-go body>main,html.pb-go body>#main{transform:translate3d(18vw,0,0);opacity:0;transition:transform .32s cubic-bezier(.7,0,.84,0),opacity .32s}";
  D.head.appendChild(css);
  var add = function () { D.body.appendChild(el); };
  if (D.body) add(); else D.addEventListener("DOMContentLoaded", add);
  var ring = function () { return el.querySelector(".pb-ring"); };

  var st = null; // { id, x0, y0, on, d, v, xl, tl }
  var setVars = function (x, y, k, d) {
    // 동그라미는 커서 왼쪽에 간격을 두고 따라오고(사용자 요청), 당길수록 커져요
    var cx = Math.max(44, x - 80);
    root.style.setProperty("--pbx", cx + "px");
    root.style.setProperty("--pby", y + "px");
    root.style.setProperty("--pbs", (0.45 + 0.55 * Math.min(1, k) + (k >= 1 ? 0.08 : 0)).toFixed(3));
    root.style.setProperty("--pbd", d + "px");
    var r = ring(); if (r) r.setAttribute("stroke-dashoffset", (C * (1 - Math.min(1, k))).toFixed(1));
    root.classList.toggle("pb-ready", k >= 1);
  };
  var need = function () { return Math.max(140, Math.min(320, innerWidth * 0.22)); };

  D.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 || e.pointerType === "touch" || !e.isPrimary) return;
    if (e.clientX > innerWidth * 0.35) return; // 왼쪽 절반보다 조금 더 왼쪽에서만
    if (root.classList.contains("mn-on") || root.classList.contains("sb-on")) return;
    var t = e.target; if (t && t.closest && t.closest(SKIP)) return;
    if (!isBackOk()) return;
    st = { id: e.pointerId, x0: e.clientX, y0: e.clientY, on: false, d: 0, v: 0, xl: e.clientX, tl: performance.now() };
  }, true);

  D.addEventListener("pointermove", function (e) {
    if (!st || e.pointerId !== st.id) return;
    var dx = e.clientX - st.x0, dy = e.clientY - st.y0;
    if (!st.on) {
      if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) { st = null; return; } // 세로로 움직이면 평소대로(글 고르기·스크롤)
      if (dx < 12 || dx < Math.abs(dy) * 1.4) { if (dx < -12) st = null; return; }
      st.on = true; root.classList.remove("pb-back", "pb-go"); root.classList.add("pb-on");
      try { var s = getSelection(); s && s.removeAllRanges(); } catch (er) {}
    }
    e.preventDefault();
    var now = performance.now(); if (now > st.tl) { st.v = (e.clientX - st.xl) / (now - st.tl); st.xl = e.clientX; st.tl = now; }
    st.d = Math.max(0, dx);
    setVars(e.clientX, e.clientY, st.d / need(), st.d);
  }, true);

  var end = function (e) {
    if (!st || (e && e.pointerId !== st.id)) return;
    var s = st; st = null; if (!s.on) return;
    var go = s.d >= need() || (s.v > 0.9 && s.d > 70);
    if (go) {
      root.classList.add("pb-go");
      var mode = isBackOk();
      setTimeout(function () {
        if (mode === "back") history.back(); else location.href = homeHref();
        setTimeout(function () { root.classList.remove("pb-on", "pb-go", "pb-ready"); }, 900); // 이동이 막혔을 때 되돌림
      }, REDUCED ? 0 : 300);
    } else {
      root.classList.add("pb-back"); root.classList.remove("pb-ready");
      setVars(s.xl, s.y0, 0, 0);
      setTimeout(function () { root.classList.remove("pb-on", "pb-back"); }, 360);
    }
  };
  // 사진·글 위에서 시작해도 브라우저 기본 끌기(그림 끌어 옮기기)가 가로채지 않게
  D.addEventListener("dragstart", function (e) { if (st) e.preventDefault(); }, true);
  D.addEventListener("pointerup", end, true);
  D.addEventListener("pointercancel", end, true);
  // 끌기가 시작되면 이어지는 click(링크 눌림 등)은 막아요
  D.addEventListener("click", function (e) { if (root.classList.contains("pb-on")) { e.preventDefault(); e.stopPropagation(); } }, true);
  addEventListener("pageshow", function () { root.classList.remove("pb-on", "pb-go", "pb-back", "pb-ready"); });
})();
