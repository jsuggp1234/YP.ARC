/* 끌어서 앞뒤 페이지로 (2026-11-24 요청)
   · 뒤로: 화면 왼쪽 35% 안에서 마우스 왼쪽 버튼을 누른 채 왼쪽 → 오른쪽으로 잡아당기면 이전 페이지로.
   · 앞으로: 화면 오른쪽 35% 안에서 오른쪽 → 왼쪽으로 잡아당기면 다음 페이지로(브라우저 '앞으로').
     앞으로 갈 기록이 없을 때 작품 상세에서는 next case로 가요.
   당기는 동안 커서 뒤쪽(당기는 반대편)에 간격을 두고 동그라미가 따라오며, 당긴 만큼 테두리가 차오르고,
   끝까지 당겨 놓으면 넘어가요. 동그라미는 먹색으로 채워지고 안의 작은 화살표만 뚫려 있어서(마스크) 뒤 화면이 비쳐요.
   다른 기능을 쓰는 곳(버튼·입력칸·캔버스·가로 띠·도면 장면·메뉴 등)에서 시작한 끌기는 건드리지 않아요.
   site.js 없이도 혼자 돌아가서 lab/tide-sim 같은 페이지에도 그대로 붙일 수 있어요. */
(function () {
  if (window.__ypPull) return; window.__ypPull = true;
  var D = document, root = D.documentElement;
  var REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var ZONE = 0.35; // 왼쪽(뒤로)·오른쪽(앞으로) 가장자리에서 화면 폭의 35% 안에서만 시작
  var SKIP = "button,input,select,textarea,label,summary,video,canvas,iframe,svg a,[contenteditable],[role=slider],[draggable=true],[data-nodrag]," +
    ".cs,.cs-gd,.sl,.sl-a,.sb-edge,#menu,.mn,.ct,.cg,.seq-stage,.pan,.pan-loop,.mv-ui,.fp-n,.cx-cv video,.hud,.ybar,.top,.yt-ctl,.ctl,.btns,.lk-bar,.dial,.md-sw";
  var homeHref = function () { return /\/lab\/[^/]+\//.test(location.pathname) ? "../../lab.html" : "index.html"; };
  // 뒤로: 사이트 안에서 왔으면 history.back, 아니면 첫 화면으로(첫 화면에서는 없음)
  var backMode = function () {
    try { if (D.referrer && new URL(D.referrer).origin === location.origin && history.length > 1) return "back"; } catch (e) {}
    var p = location.pathname;
    if (/\/(index\.html)?$/.test(p) && !/\/lab\//.test(p)) return "";
    return "home";
  };
  // 앞으로: 브라우저가 알려 주면 그대로, 모르면 일단 시도. 작품 상세는 앞으로 기록이 없으면 next case
  var nextCase = function () { var a = D.querySelector(".cx-nx a[href]"); return a ? a.getAttribute("href") : ""; };
  var fwdMode = function () {
    var nav = window.navigation;
    if (nav && typeof nav.canGoForward === "boolean") return nav.canGoForward ? "fwd" : (nextCase() ? "next" : "");
    return "try";
  };

  // 동그라미: 먹색 원에서 화살표 모양만 뚫어요(SVG mask) + 바깥 진행 테두리. 앞으로일 때는 화살표가 →
  var R = 26, C = 2 * Math.PI * (R + 5);
  var el = D.createElement("div");
  el.className = "pb"; el.setAttribute("aria-hidden", "true");
  el.innerHTML =
    '<svg viewBox="-36 -36 72 72" width="72" height="72">' +
      '<defs><mask id="pb-m" maskUnits="userSpaceOnUse" x="-36" y="-36" width="72" height="72">' +
        '<circle r="' + R + '" fill="#fff"/>' +
        '<path class="pb-ar" d="M9 0H-9M-2 -7L-9 0L-2 7" fill="none" stroke="#000" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>' +
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
    "html.pb-go body>main,html.pb-go body>#main{transform:translate3d(calc(var(--pbg,1)*18vw),0,0);opacity:0;transition:transform .32s cubic-bezier(.7,0,.84,0),opacity .32s}";
  D.head.appendChild(css);
  var add = function () { D.body.appendChild(el); };
  if (D.body) add(); else D.addEventListener("DOMContentLoaded", add);
  var ring = function () { return el.querySelector(".pb-ring"); };
  var arrow = function (dir) { var a = el.querySelector(".pb-ar"); if (a) a.setAttribute("transform", dir < 0 ? "scale(-1 1)" : ""); };

  var st = null; // { dir(+1 뒤로·오른쪽으로 당김 / -1 앞으로·왼쪽으로 당김), id, x0, y0, on, d, v, xl, tl }
  var setVars = function (x, y, k, d, dir) {
    // 동그라미는 당기는 반대편(뒤로는 커서 왼쪽, 앞으로는 커서 오른쪽)에 간격을 두고 따라오고, 당길수록 커져요
    var cx = dir > 0 ? Math.max(44, x - 80) : Math.min(innerWidth - 44, x + 80);
    root.style.setProperty("--pbx", cx + "px");
    root.style.setProperty("--pby", y + "px");
    root.style.setProperty("--pbs", (0.45 + 0.55 * Math.min(1, k) + (k >= 1 ? 0.08 : 0)).toFixed(3));
    root.style.setProperty("--pbd", d * dir + "px");
    root.style.setProperty("--pbg", dir);
    var r = ring(); if (r) r.setAttribute("stroke-dashoffset", (C * (1 - Math.min(1, k))).toFixed(1));
    root.classList.toggle("pb-ready", k >= 1);
  };
  var need = function () { return Math.max(140, Math.min(320, innerWidth * 0.22)); };

  D.addEventListener("pointerdown", function (e) {
    if (e.button !== 0 || e.pointerType === "touch" || !e.isPrimary) return;
    var dir = e.clientX <= innerWidth * ZONE ? 1 : e.clientX >= innerWidth * (1 - ZONE) ? -1 : 0;
    if (!dir) return;
    if (root.classList.contains("mn-on") || root.classList.contains("sb-on")) return;
    var t = e.target; if (t && t.closest && t.closest(SKIP)) return;
    if (dir > 0 ? !backMode() : !fwdMode()) return;
    st = { dir: dir, id: e.pointerId, x0: e.clientX, y0: e.clientY, on: false, d: 0, v: 0, xl: e.clientX, tl: performance.now() };
  }, true);

  D.addEventListener("pointermove", function (e) {
    if (!st || e.pointerId !== st.id) return;
    var dx = (e.clientX - st.x0) * st.dir, dy = e.clientY - st.y0;
    if (!st.on) {
      if (Math.abs(dy) > 14 && Math.abs(dy) > Math.abs(dx)) { st = null; return; } // 세로로 움직이면 평소대로(글 고르기·스크롤)
      if (dx < 12 || dx < Math.abs(dy) * 1.4) { if (dx < -12) st = null; return; }
      st.on = true; arrow(st.dir); root.classList.remove("pb-back", "pb-go"); root.classList.add("pb-on");
      try { var s = getSelection(); s && s.removeAllRanges(); } catch (er) {}
    }
    e.preventDefault();
    var now = performance.now(); if (now > st.tl) { st.v = (e.clientX - st.xl) * st.dir / (now - st.tl); st.xl = e.clientX; st.tl = now; }
    st.d = Math.max(0, dx);
    setVars(e.clientX, e.clientY, st.d / need(), st.d, st.dir);
  }, true);

  var reset = function () { root.classList.remove("pb-on", "pb-go", "pb-back", "pb-ready"); };
  var end = function (e) {
    if (!st || (e && e.pointerId !== st.id)) return;
    var s = st; st = null; if (!s.on) return;
    var go = s.d >= need() || (s.v > 0.9 && s.d > 70);
    if (go) {
      root.classList.add("pb-go");
      var mode = s.dir > 0 ? backMode() : fwdMode();
      setTimeout(function () {
        if (mode === "back") history.back();
        else if (mode === "home") location.href = homeHref();
        else if (mode === "fwd") history.forward();
        else if (mode === "next") location.href = nextCase();
        else if (mode === "try") { // 앞으로 기록을 알 수 없는 브라우저: 시도해 보고, 안 넘어가면 작품 상세는 next case
          var here = location.href; history.forward();
          setTimeout(function () { if (location.href === here && nextCase()) location.href = nextCase(); }, 450);
        }
        setTimeout(reset, 900); // 이동이 막혔을 때 되돌림
      }, REDUCED ? 0 : 300);
    } else {
      root.classList.add("pb-back"); root.classList.remove("pb-ready");
      setVars(s.xl, s.y0, 0, 0, s.dir);
      setTimeout(function () { root.classList.remove("pb-on", "pb-back"); }, 360);
    }
  };
  // 사진·글 위에서 시작해도 브라우저 기본 끌기(그림 끌어 옮기기)가 가로채지 않게
  D.addEventListener("dragstart", function (e) { if (st) e.preventDefault(); }, true);
  D.addEventListener("pointerup", end, true);
  D.addEventListener("pointercancel", end, true);
  // 끌기가 시작되면 이어지는 click(링크 눌림 등)은 막아요 — 링크 위에서 시작한 끌기도 페이지 넘기기로 쓰고, 그냥 누르면 링크 그대로
  D.addEventListener("click", function (e) { if (root.classList.contains("pb-on")) { e.preventDefault(); e.stopPropagation(); } }, true);
  addEventListener("pageshow", reset);
})();
