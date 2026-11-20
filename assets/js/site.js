// ============================================================
// site.js — 모든 페이지가 공유하는 "설비"와 페이지별 화면 그리기
//   1) 공통: 상단바, 메뉴, 라이트/다크, 서울 시간, 커서, 로딩, 페이지 전환, 부드러운 스크롤
//   2) 등장 모션, 패럴랙스
//   3) 페이지: home(메인) · projects(작품 목록) · project(작품 상세) · about(소개)
// 내용은 data.js, 도면 자리표시는 drawings.js, 첫 화면 3D는 hero3d.js가 맡아요.
// ============================================================
(() => {
  "use strict";
  const D = document, HTML = D.documentElement, BODY = D.body;
  const $ = (s, el = D) => el.querySelector(s);
  const $$ = (s, el = D) => [...el.querySelectorAll(s)];
  const PAGE = BODY.dataset.page;
  const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(hover: hover) and (pointer: fine)").matches;
  const store = (s) => ({
    get: (k) => { try { return s().getItem(k); } catch (e) { return null; } },
    set: (k, v) => { try { s().setItem(k, v); } catch (e) {} },
    del: (k) => { try { s().removeItem(k); } catch (e) {} },
  });
  const ss = store(() => sessionStorage), ls = store(() => localStorage);
  const pad = (n, l = 2) => String(n).padStart(l, "0");
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  let wi = 0;
  const words = (text) => String(text).split(" ").map((w) => `<span class="w"><i style="--i:${wi++}">${esc(w)}</i></span>`).join(" ");
  const N = PROJECTS.length;
  const hasGsap = !!(window.gsap && window.ScrollTrigger);
  if (hasGsap) gsap.registerPlugin(ScrollTrigger);

  // ---------- 준비 신호 (로딩이 끝나면 첫 화면 연출 시작) ----------
  const ready = {
    done: false, fns: [],
    when(f) { this.done ? f() : this.fns.push(f); },
    fire() { if (this.done) return; this.done = true; this.fns.splice(0).forEach((f) => f()); },
  };
  const first = !ss.get("yp-seen");
  ss.set("yp-seen", "1");
  const fromVeil = ss.get("yp-veil");
  const showLoader = first && !REDUCED && !fromVeil;
  HTML.style.setProperty("--d0", showLoader ? "1.9s" : fromVeil ? "0.35s" : "0.05s");

  // ---------- 시트 번호 (도면 세트처럼 페이지마다 번호) ----------
  const norm = (p) => p.replace(/index\.html$/, "");
  function sheetOf(url = location) {
    const path = url.pathname;
    if (/projects\.html$/.test(path)) return ["A-100", "Index of Works"];
    if (/about\.html$/.test(path)) return ["A-900", "Profile"];
    if (/project\.html$/.test(path)) {
      const slug = decodeURIComponent((url.hash || "").slice(1));
      const i = Math.max(0, PROJECTS.findIndex((p) => p.slug === slug));
      return ["A-1" + pad(i + 1), PROJECTS[i].title];
    }
    return ["A-000", "Cover"];
  }
  const labelFor = (url) => sheetOf(url).join(" — ");

  // ---------- 도면/이미지 ----------
  const art = (src, kind, seed, w, h, mass, alt) =>
    src ? `<img src="${esc(src)}" alt="${esc(alt || "")}" loading="lazy" decoding="async">` : Drawing.svg(kind, seed, w, h, mass);
  const mz = (inner) => `<div class="mz">${inner}</div>`;
  const mpar = (inner) => `<div class="mp">${mz(inner)}</div>`;
  const cover = (p, w, h) => art(p.cover, "axon", p.slug, w, h, p.mass, p.title);
  const capOf = (im) => im.caption || (Drawing.META[im.kind] ? Drawing.META[im.kind][0] + ", " + Drawing.META[im.kind][1] : "");

  // ============================================================
  // 1) 공통 크롬: 상단바, 메뉴, 푸터, 전환막
  // ============================================================
  const NAV = PAGE === "home"
    ? [["#philosophy", "Philosophy"], ["#works", "Works"], ["#process", "Process"], ["about.html", "About"], ["#contact", "Contact"]]
    : [["index.html#philosophy", "Philosophy"], ["projects.html", "Works"], ["index.html#process", "Process"], ["about.html", "About"], ["#contact", "Contact"]];

  function chrome() {
    const [sheet, sheetName] = sheetOf();
    const navHtml = NAV.map(([h, t]) => {
      const on = (PAGE === "projects" && t === "Works") || (PAGE === "about" && t === "About") || (PAGE === "project" && t === "Works");
      return `<a class="lnk${on ? " on" : ""}" href="${h}">${t}</a>`;
    }).join("");
    BODY.insertAdjacentHTML("afterbegin", `
      <header class="hdr wrap mono" id="hdr">
        <a class="logo" href="index.html" aria-label="${esc(SITE.name)} home"><b>${esc(SITE.name)}</b><span class="mid">${esc(SITE.role)}</span></a>
        <nav class="nav" aria-label="Main">${navHtml}</nav>
        <div class="hdr-r">
          <span class="clock mid num">Seoul --:--</span>
          <button class="mode" type="button" aria-label="Switch light or dark"><i></i><span>Dark</span></button>
          <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu">Menu</button>
        </div>
      </header>
      <div class="menu wrap" id="menu" aria-hidden="true">
        <ol>${NAV.map(([h, t], i) => `<li><a href="${h}"><span class="mono mid">${pad(i + 1)}</span>${t}</a></li>`).join("")}<li><a href="projects.html"><span class="mono mid">${pad(NAV.length + 1)}</span>Index</a></li></ol>
        <div class="mono mid" style="display:flex;justify-content:space-between"><span class="clock num">Seoul --:--</span><span>${esc(SITE.coords)}</span></div>
      </div>
      <div class="veil wrap" aria-hidden="true"><span class="mono vl"></span><span class="bar"></span></div>`);

    const links = SITE.links.length
      ? SITE.links.map((l) => `<a class="lnk" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")
      : `<span class="soft">Instagram · GitHub (준비 중)</span>`;
    BODY.insertAdjacentHTML("beforeend", `
      <footer class="ftr wrap" id="contact">
        <div class="sec-hd mono"><span>Contact</span><span class="mid">함께 일할 곳을 찾고 있어요</span><span class="mid">${esc(SITE.based)}</span></div>
        <h2 class="ftr-big" data-reveal="words">${words("Let's talk")}<br>${words("about space.")}</h2>
        <button class="ftr-mail" type="button" data-copy="${esc(SITE.email)}"><span class="addr">${esc(SITE.email)}</span><span class="mono">Copy</span></button>
        <div class="ftr-grid grid mono">
          <div><span class="mid">Based</span><span>${esc(SITE.based)}</span><span class="mid num">${esc(SITE.coords)}</span></div>
          <div><span class="mid">Status</span><span>${esc(SITE.status)}</span></div>
          <div><span class="mid">Elsewhere</span>${links}</div>
          <dl class="tblock">
            <dt>Sheet</dt><dd>${sheet}</dd><dt>Title</dt><dd class="tb-title">${esc(sheetName)}</dd>
            <dt>Scale</dt><dd>NTS</dd><dt>Rev.</dt><dd>${esc(SITE.rev)}</dd><dt>Date</dt><dd class="num">${esc(SITE.updated)}</dd>
          </dl>
        </div>
        <div class="ftr-bot mono mid"><span>© ${new Date().getFullYear()} ${esc(SITE.owner)} — ${esc(SITE.name)}</span><span class="clock num">Seoul --:--</span><button class="lnk" type="button" data-top>Back to top ↑</button></div>
      </footer>`);
  }

  // ---------- 라이트/다크 ----------
  function modeUi() {
    const set = (m) => {
      HTML.dataset.mode = m;
      $$(".mode span").forEach((s) => (s.textContent = m === "dark" ? "Light" : "Dark"));
      D.dispatchEvent(new Event("yp:theme"));
    };
    set(HTML.dataset.mode === "dark" ? "dark" : "light");
    D.addEventListener("click", (e) => {
      if (!e.target.closest(".mode")) return;
      const m = HTML.dataset.mode === "dark" ? "light" : "dark";
      ls.set("yp-mode", m);
      set(m);
    });
  }

  // ---------- 서울 시간 ----------
  function clock() {
    let f;
    try { f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hour12: false }); } catch (e) { return; }
    const tick = () => $$(".clock").forEach((c) => (c.textContent = "Seoul " + f.format(new Date())));
    tick();
    setInterval(tick, 15000);
  }

  // ---------- 부드러운 스크롤 ----------
  let lenis = null;
  function smooth() {
    if (!window.Lenis || REDUCED) return;
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (hasGsap) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((t) => lenis.raf(t * 1000));
      gsap.ticker.lagSmoothing(0);
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    }
  }
  const hdrH = () => parseFloat(getComputedStyle(HTML).getPropertyValue("--hdr")) || 64;
  function scrollToY(y, immediate) {
    if (lenis) lenis.scrollTo(y, { immediate: !!immediate, duration: 1.5 });
    else window.scrollTo({ top: y, behavior: immediate || REDUCED ? "auto" : "smooth" });
  }
  function scrollToEl(target, immediate) {
    const el = typeof target === "string" ? (target.length > 1 ? D.querySelector(target) : null) : target;
    if (!el) return;
    scrollToY(el.getBoundingClientRect().top + scrollY - hdrH() - 12, immediate);
  }

  // ---------- 커서 ----------
  const CUR = (() => {
    if (!FINE) return { set() {}, cross() {} };
    BODY.classList.add("has-cur");
    const c = D.createElement("div");
    c.className = "cur hide";
    c.innerHTML = '<i class="dot"></i><i class="ring"><b></b></i>';
    BODY.appendChild(c);
    const dot = c.firstChild, ring = c.lastChild, lab = ring.firstChild;
    let x = -100, y = -100, rx = -100, ry = -100, forced = null, over = null, link = false;
    addEventListener("pointermove", (e) => { if (e.pointerType !== "mouse") return; x = e.clientX; y = e.clientY; c.classList.remove("hide"); }, { passive: true });
    HTML.addEventListener("pointerleave", () => c.classList.add("hide"));
    D.addEventListener("pointerover", (e) => {
      const t = e.target.closest && e.target.closest("[data-cursor]");
      over = t ? t.dataset.cursor : null;
      link = !t && !!(e.target.closest && e.target.closest("a,button,[role=button]"));
      apply();
    });
    function apply() {
      const l = forced || over;
      c.classList.toggle("label", !!l);
      c.classList.toggle("link", !l && link);
      if (l) lab.textContent = l;
    }
    (function loop() {
      rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
      dot.style.transform = `translate3d(${x}px,${y}px,0)`;
      ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
      requestAnimationFrame(loop);
    })();
    return {
      set(l) { if (forced !== l) { forced = l; apply(); } },
      cross(on) { c.classList.toggle("cross", on); },
    };
  })();

  // ---------- 로딩 화면 (세션 첫 방문만) ----------
  function loader(done) {
    const el = D.createElement("div");
    el.className = "loader wrap";
    el.setAttribute("aria-hidden", "true");
    el.innerHTML = `
      <svg viewBox="0 0 240 150">
        <path class="thin" pathLength="1" d="M20 4V146M80 4V146M140 4V146M220 4V146M6 20H234M6 130H234"/>
        <path pathLength="1" d="M20 20H220V130H20Z"/>
        <path pathLength="1" d="M80 20V88M80 112V130M140 20V62M140 86V130M140 74H220"/>
        <path class="thin" pathLength="1" d="M80 88A24 24 0 0 1 104 112M140 62A24 24 0 0 0 116 86"/>
      </svg>
      <div class="row"><div class="mono"><div>${esc(SITE.name)} — Architecture Portfolio</div><div class="mid">Drawing sheets A-000 — A-900</div></div><div class="count">000</div></div>`;
    BODY.appendChild(el);
    const cnt = $(".count", el), t0 = performance.now(), dur = 1500;
    (function step(now) {
      const k = clamp((now - t0) / dur, 0, 1);
      cnt.textContent = pad(Math.round((1 - Math.pow(1 - k, 3)) * 100), 3);
      if (k < 1) return requestAnimationFrame(step);
      el.classList.add("out");
      done();
      setTimeout(() => el.remove(), 1200);
    })(t0);
  }

  // ---------- 페이지 전환 ----------
  let veil;
  function veilOut() {
    veil.className = "veil wrap cover instant";
    requestAnimationFrame(() => requestAnimationFrame(() => {
      veil.classList.remove("instant", "cover");
      veil.classList.add("leave");
      setTimeout(() => veil.classList.remove("leave"), 1100);
    }));
  }
  function go(href, label) {
    const url = new URL(href, location.href);
    if (REDUCED) { location.href = url.href; return; }
    $(".vl", veil).textContent = label || labelFor(url);
    veil.classList.remove("leave");
    veil.classList.add("cover");
    closeMenu();
    const samePage = norm(url.pathname) === norm(location.pathname) && PAGE === "project";
    if (!samePage) ss.set("yp-veil", label || "1");
    setTimeout(() => {
      if (samePage) location.hash = url.hash;
      else location.href = url.href;
    }, 760);
  }
  window.YP = { go };
  function links() {
    D.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest("a[href]");
      if (!a || e.defaultPrevented || a.target === "_blank" || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const url = new URL(a.getAttribute("href"), location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      const same = norm(url.pathname) === norm(location.pathname);
      if (same && url.hash && PAGE !== "project") { e.preventDefault(); closeMenu(); scrollToEl(url.hash); return; }
      if (same && url.hash === "#contact") { e.preventDefault(); closeMenu(); scrollToEl("#contact"); return; }
      e.preventDefault();
      go(url.href, labelFor(url));
    });
    addEventListener("pageshow", (e) => { if (e.persisted) veil.className = "veil wrap"; });
  }

  // ---------- 메뉴 (모바일) ----------
  function closeMenu() {
    const m = $("#menu");
    if (!m || !m.classList.contains("open")) return;
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
    $(".menu-btn").setAttribute("aria-expanded", "false");
    $(".menu-btn").textContent = "Menu";
    lenis && lenis.start();
  }
  function menu() {
    $(".menu-btn").addEventListener("click", () => {
      const m = $("#menu");
      if (m.classList.contains("open")) return closeMenu();
      m.classList.add("open");
      m.setAttribute("aria-hidden", "false");
      $(".menu-btn").setAttribute("aria-expanded", "true");
      $(".menu-btn").textContent = "Close";
      lenis && lenis.stop();
    });
    addEventListener("keydown", (e) => { if (e.key === "Escape") closeMenu(); });
  }

  // ---------- 상단바: 내리면 숨고, 올리면 나타남 ----------
  function headerScroll() {
    const h = $("#hdr");
    let lastY = scrollY;
    const on = () => {
      const y = scrollY;
      h.classList.toggle("solid", y > 40);
      if (!$("#menu").classList.contains("open")) h.classList.toggle("hide", y > 240 && y > lastY + 2);
      if (y < lastY - 2 || y < 240) h.classList.remove("hide");
      lastY = y;
    };
    addEventListener("scroll", on, { passive: true });
    on();
  }

  // ---------- 복사 / 맨 위로 ----------
  function utils() {
    D.addEventListener("click", (e) => {
      const cp = e.target.closest("[data-copy]");
      if (cp) {
        const v = cp.dataset.copy, lab = $(".mono", cp);
        const done = (ok) => { lab.textContent = ok ? "Copied" : "Select & copy"; setTimeout(() => (lab.textContent = "Copy"), 1800); };
        const sel = () => { const r = D.createRange(); r.selectNodeContents($(".addr", cp)); const s = getSelection(); s.removeAllRanges(); s.addRange(r); done(false); };
        try { navigator.clipboard.writeText(v).then(() => done(true), sel); } catch (err) { sel(); }
      }
      if (e.target.closest("[data-top]")) scrollToY(0);
    });
  }

  // ============================================================
  // 2) 등장 모션 + 패럴랙스
  // ============================================================
  let io = null;
  function reveals(root = D) {
    const els = $$("[data-reveal]:not(.rv)", root);
    els.forEach((el) => el.classList.add("rv"));
    if (REDUCED || !("IntersectionObserver" in window)) return;
    io = io || new IntersectionObserver((es) => es.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    }), { rootMargin: "0px 0px -8% 0px", threshold: 0.01 });
    const vh = innerHeight;
    els.forEach((el) => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.9 && r.bottom > 0) return; // 첫 화면에 보이는 건 숨기지 않아요
      el.classList.add("pre");
      io.observe(el);
    });
  }
  function parallax(root = D) {
    if (!hasGsap || REDUCED) return;
    $$("[data-par] .mp", root).forEach((el) => {
      gsap.fromTo(el, { yPercent: -5 }, { yPercent: 5, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
    });
  }

  // ============================================================
  // 3) 페이지
  // ============================================================
  const render = {};

  // ---------- 메인 ----------
  render.home = () => {
    const types = ["All", ...new Set(PROJECTS.map((p) => p.type))];
    const procIcons = [
      `<path class="s" pathLength="1" d="M8 10h34v24H8zM50 10h22v34H50zM8 42h34v26H8zM128 10h44v30h-44zM80 76h36v26H80zM124 58h48v44h-48zM8 76h62v26H8zM80 10h40v18H80z"/><path class="r" d="M80 36h40v32H80z"/>`,
      `<path pathLength="1" d="M30 72L90 42L150 72L90 102ZM30 72V44L90 14L150 44V72M90 102V74M30 44L90 74L150 44"/><path class="s" pathLength="1" d="M90 74L120 59V31"/>`,
      `<path class="s" pathLength="1" d="M20 6V104M70 6V104M120 6V104M170 6V104M8 18H178M8 60H178M8 100H178"/><path pathLength="1" d="M20 18H170V100H20ZM70 18V48M70 72V100M120 60H170M70 48A24 24 0 0 1 94 72"/>`,
      `<path pathLength="1" d="M10 6H170V104H10ZM10 84H170M118 84V104M24 18H86V72H24ZM98 18H156V44H98ZM98 52H156V72H98Z"/><path class="s" pathLength="1" d="M24 18L86 72M86 18L24 72"/>`,
    ];
    wi = 0;
    const hl = SITE.hero.lines.map((l) => `<span>${words(l)}</span>`).join("");
    const M = SITE.manifesto, PL = SITE.pillars, NT = SITE.philosophy, AH = SITE.approachHead;
    const odo = (list) => `<span class="odo num" aria-hidden="true"><span class="odo-col">${list.map((t) => `<i>${t}</i>`).join("")}</span></span>`;
    const fws = M.en.split(" ").map((w) => `<span class="fw">${esc(w)}</span>`).join(" ");
    $("#main").innerHTML = `
      <section class="hero" id="top">
        <div class="stage" id="stage"></div>
        <div class="xh" id="xh" aria-hidden="true"><i class="h"></i><i class="v"></i><span class="rd mono num"></span></div>
        <div class="labels" id="labels" style="position:absolute;inset:0;pointer-events:none"></div>
        <div class="hero-ui wrap">
          <div class="hero-h"><p class="hero-tag mono"><span>${esc(SITE.hero.tag[0])}</span><span class="mid">${esc(SITE.hero.tag[1])}</span></p><h1 class="intro-play">${hl}</h1><p>${esc(SITE.hero.sub)}</p></div>
          <nav class="hero-list mono" aria-label="Selected works">
            ${PROJECTS.map((p, i) => `<a href="project.html#${p.slug}" data-k="${i}"><span class="mid num">${pad(i + 1)}</span><span class="t">${esc(p.title)}</span><span class="mid num">${p.year}</span></a>`).join("")}
          </nav>
          <div class="hero-foot mono mid"><span class="num">${esc(SITE.coords)}</span><span class="motto">${esc(SITE.hero.motto)}</span><span class="scroll-cue">Scroll to discover</span></div>
        </div>
      </section>

      <section class="mf story" id="philosophy">
        <div class="mf-stick wrap">
          <div class="sec-hd mono"><span>Philosophy</span><span class="mid">무엇을 믿고 설계하는가</span><span class="mid num"><span class="mf-pct">000</span> / 100</span></div>
          <div class="mf-body grid">
            <div class="mf-side"><p class="mono mid">(Manifesto)</p><figure><svg class="pf mf-fig" viewBox="0 0 400 300" aria-hidden="true">${Drawing.fig("site")}</svg><figcaption class="mono mid">Fig. 00 — ${Drawing.FIGCAP.site}</figcaption></figure></div>
            <div class="mf-main"><p class="mf-txt">${fws}</p><p class="mf-ko">${esc(M.ko)}</p></div>
          </div>
          <ol class="mf-steps mono"><span class="bar" aria-hidden="true"></span>${M.steps.map((t, i) => `<li><span class="num">${pad(i + 1)}</span>${esc(t)}</li>`).join("")}</ol>
        </div>
      </section>

      <section class="pl story" id="principles" aria-label="Principles">
        <div class="pl-stick wrap">
          <div class="sec-hd mono"><span>Principles</span><span class="mid">설계의 세 가지 기준</span><span class="mid">${esc(PL.map((p) => p.k).join(" · "))}</span></div>
          <div class="pl-body grid">
            <div class="pl-side">
              <div class="pl-count">${odo(PL.map((_, i) => pad(i + 1)))}<span class="mono mid num">/ ${pad(PL.length)}</span></div>
              <ol class="pl-idx mono">${PL.map((p, i) => `<li><span class="num">${pad(i + 1)}</span>${esc(p.k)}</li>`).join("")}</ol>
            </div>
            <div class="pl-words">${PL.map((p) => `
              <article class="pl-it"><h3><span>${esc(p.k)}.</span></h3><p class="en">${esc(p.en)}</p><p class="ko">${esc(p.d)}</p></article>`).join("")}
            </div>
            <div class="pl-figs" aria-hidden="true">${PL.map((p, i) => `
              <figure class="pl-fig"><div class="sheet"><svg class="pf" viewBox="0 0 400 500">${Drawing.fig(p.fig)}</svg></div><figcaption class="mono mid"><span class="num">Fig. P-${pad(i + 1)}</span><span>${esc(Drawing.FIGCAP[p.fig] || "")}</span></figcaption></figure>`).join("")}
            </div>
          </div>
          <div class="pl-foot mono mid"><span>Scroll</span><span class="pl-bar"><i></i></span><span class="num pl-pct">01 / ${pad(PL.length)}</span></div>
        </div>
      </section>

      <section class="sec wrap nt" id="notes">
        <div class="sec-hd mono"><span>Notes</span><span class="mid">건축에 대한 메모</span><span class="mid num">${pad(NT.length)} notes</span></div>
        <div class="grid">
          <div class="nt-side">${odo(NT.map((_, i) => pad(i)))}<p class="mono mid">Notes on architecture</p></div>
          <ol class="nt-list">${NT.map((t, i) => `<li data-i="${i}" data-reveal><span class="mono mid num">Note ${pad(i)}</span><p>${esc(t)}</p></li>`).join("")}</ol>
        </div>
      </section>

      <section class="sec wrap" id="approach">
        <div class="sec-hd mono"><span>Approach</span><span class="mid">설계에 접근하는 네 가지 방식</span><span class="mid">Click to expand</span></div>
        <div class="ap-hd grid">
          <p class="ap-cyc mono mid">Measured in <span class="cyc"><span class="cyc-col">${AH.cycle.concat(AH.cycle[0]).map((w) => `<i>${esc(w)}</i>`).join("")}</span></span></p>
          <h3 class="ap-h" data-reveal="words">${words(AH.line1)}<br>${words(AH.line2)}</h3>
          <p class="ap-intro" data-reveal>${esc(AH.intro)}</p>
        </div>
        <div class="acc">${SITE.approach.map((a, i) => `
          <div class="acc-i${i === 0 ? " open" : ""}" data-reveal style="--d:${i * 0.06}s">
            <button class="acc-b" type="button" aria-expanded="${i === 0}" aria-controls="acc-${i}" id="accb-${i}">
              <span class="n mono mid num">${pad(i + 1)}</span><span class="t">${esc(a.t)}</span><span class="s">${esc(a.s)}</span><span class="pm" aria-hidden="true"></span>
            </button>
            <div class="acc-p" id="acc-${i}" role="region" aria-labelledby="accb-${i}"><div><p>${esc(a.d)}</p></div></div>
          </div>`).join("")}
        </div>
      </section>

      <section class="sec wrap" id="works">
        <div class="sec-hd mono"><span>Selected Works</span><div class="filters" role="group" aria-label="Filter works">${types.map((t, i) => `<button type="button" class="${i ? "" : "on"}" data-f="${t}">${t}<sup class="num">${t === "All" ? N : PROJECTS.filter((p) => p.type === t).length}</sup></button>`).join("")}</div><a class="lnk" href="projects.html">Index of works (${pad(N)}) →</a></div>
        <div class="wgrid">${PROJECTS.map((p, i) => `
          <a class="wcard" href="project.html#${p.slug}" data-type="${esc(p.type)}" data-cursor="View" data-reveal="wipe" style="--d:${(i % 3) * 0.1}s">
            <div class="media" data-par>${mpar(cover(p, 800, 1140))}<div class="ov mono"><span>${esc(p.site)}</span><span class="num">${esc(p.area)}</span></div></div>
            <div class="cap"><span class="mono mid num">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><span class="mono mid num">${p.year}</span><p>${esc(p.type)} — ${esc(p.titleKo)}</p></div>
          </a>`).join("")}
        </div>
        <div class="more" hidden><button type="button" class="mono">Load more</button></div>
      </section>

      <section class="sec wrap" id="process">
        <div class="sec-hd mono"><span>Process</span><span class="mid">한 프로젝트가 진행되는 순서</span><span class="mid">${pad(SITE.process.length)} stages</span></div>
        <ol class="proc" data-reveal>
          <span class="bar" aria-hidden="true"></span>
          ${SITE.process.map((s, i) => `<li style="--i:${i}"><span class="mono mid num">Stage ${pad(i + 1)}</span><h3>${esc(s.t)}</h3><p>${esc(s.d)}</p><svg viewBox="0 0 180 110" aria-hidden="true">${procIcons[i % 4]}</svg></li>`).join("")}
        </ol>
      </section>

      <section class="sec wrap" id="toolkit">
        <div class="sec-hd mono"><span>Toolkit</span><span class="mid">다루는 도구</span><span class="mid">${Object.values(SITE.toolkit).flat().length} tools</span></div>
        <div class="kit">${Object.entries(SITE.toolkit).map(([g, list], i) => `
          <div data-reveal style="--d:${i * 0.08}s"><h3 class="mono mid">${esc(g)}</h3><ul>${list.map((t) => `<li>${esc(t)}</li>`).join("")}</ul></div>`).join("")}
        </div>
      </section>

      <section class="sec wrap prof" id="about">
        <div class="sec-hd mono"><span>Profile</span><span class="mid">${esc(SITE.owner)} — ${esc(SITE.role)}</span><a class="lnk" href="about.html">Full profile →</a></div>
        <div class="grid">
          <div class="media" data-reveal="wipe">${mz(art(SITE.portrait, "portrait", "me", 900, 1200, null, SITE.owner))}</div>
          <div class="txt">
            <p class="lead" data-reveal>${esc(CV.intro)}</p>
            <dl class="facts mono" data-reveal>
              <div><dt>Based</dt><dd>${esc(SITE.based)}</dd></div>
              <div><dt>Focus</dt><dd>${esc([...new Set(PROJECTS.map((p) => p.type))].join(", "))}</dd></div>
              <div><dt>Status</dt><dd>${esc(SITE.status)}</dd></div>
              <div><dt>Language</dt><dd>${esc(CV.languages.join(", "))}</dd></div>
            </dl>
          </div>
        </div>
      </section>`;

    story();
    cycler();

    // 첫 화면 3D
    const ui = heroUI();
    const api = (window.hero3D && window.hero3D($("#stage"), ui)) || window.hero2D($("#stage"), ui);
    ui.attach(api);

    // 아코디언
    $$(".acc-b").forEach((b) => b.addEventListener("click", () => {
      const it = b.parentElement, open = !it.classList.contains("open");
      it.classList.toggle("open", open);
      b.setAttribute("aria-expanded", open);
      setTimeout(() => hasGsap && ScrollTrigger.refresh(), 750);
    }));

    // 작품 필터 + 더보기
    let filter = "All", shown = 6;
    const more = $("#works .more");
    const apply = () => {
      let n = 0;
      $$(".wcard").forEach((c) => {
        const ok = filter === "All" || c.dataset.type === filter;
        c.classList.toggle("off", !(ok && n < shown));
        if (ok) n++;
      });
      more.hidden = n <= shown;
      hasGsap && ScrollTrigger.refresh();
    };
    $$("#works .filters button").forEach((b) => b.addEventListener("click", () => {
      filter = b.dataset.f;
      $$("#works .filters button").forEach((x) => x.classList.toggle("on", x === b));
      apply();
    }));
    $("button", more).addEventListener("click", () => { shown += 6; apply(); });
    apply();

    // 프로세스 진행선
    const proc = $(".proc"), steps = $$("li", proc);
    const onProc = () => {
      const r = proc.getBoundingClientRect();
      const p = clamp((innerHeight * 0.8 - r.top) / (r.height + innerHeight * 0.25), 0, 1);
      proc.style.setProperty("--p", p.toFixed(3));
      steps.forEach((s, i) => s.classList.toggle("on", p >= i / steps.length + 0.02 || p > 0.98));
    };
    addEventListener("scroll", onProc, { passive: true });
    onProc();

    // 다른 페이지에서 #섹션 링크로 들어온 경우
    if (location.hash && location.hash.length > 1) setTimeout(() => scrollToEl(location.hash, true), 60);
  };

  // ---------- Philosophy 장면: 고정된 화면에서 스크롤로 진행 ----------
  function story() {
    const mf = $(".mf"), pl = $(".pl"), nt = $(".nt");
    if (!mf || !pl) return;
    if (REDUCED) HTML.classList.add("rm");
    const prog = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
    const draw = (svg, t, step, span) => svg && $$("[data-g]", svg).forEach((g) => g.style.setProperty("--o", (1 - clamp((t - +g.dataset.g * step) / span, 0, 1)).toFixed(3)));

    // 선언문: 단어가 하나씩 채워지고, 배치도가 그려져요
    const fw = $$(".fw", mf), steps = $$(".mf-steps li", mf), pct = $(".mf-pct", mf), fig = $(".mf-fig", mf), ko = $(".mf-ko", mf), bar = $(".mf-steps .bar", mf);
    let lastN = -1;
    const upMf = () => {
      const p = REDUCED ? 1 : prog(mf), t = clamp(p / 0.8, 0, 1);
      const n = Math.round(t * fw.length);
      if (n !== lastN) { fw.forEach((w, i) => w.classList.toggle("on", i < n)); lastN = n; }
      pct.textContent = pad(Math.round(p * 100), 3);
      steps.forEach((s, i) => s.classList.toggle("on", t > i / steps.length + 0.01 || t > 0.99));
      bar.style.transform = `scaleX(${t.toFixed(4)})`;
      ko.classList.toggle("on", t > 0.88);
      draw(fig, t, 0.2, 0.4);
    };

    // 세 키워드: 한 장면씩 넘어가며 도면이 그려져요
    const its = $$(".pl-it", pl), figs = $$(".pl-fig", pl), idx = $$(".pl-idx li", pl), col = $(".pl-count .odo-col", pl), pbar = $(".pl-bar i", pl), ppct = $(".pl-pct", pl);
    const flat = () => REDUCED || innerWidth <= 760;
    let lastK = -1;
    const upPl = () => {
      if (flat()) {
        if (lastK !== -2) { its.forEach((it) => { it.classList.add("on"); it.classList.remove("past"); }); figs.forEach((f) => draw($("svg", f), 1, 0.2, 0.4)); lastK = -2; }
        return;
      }
      const p = prog(pl), n = its.length;
      const k = Math.min(n - 1, Math.floor(p * n)), local = clamp(p * n - k, 0, 1);
      if (k !== lastK) {
        its.forEach((it, i) => { it.classList.toggle("on", i === k); it.classList.toggle("past", i < k); });
        figs.forEach((f, i) => f.classList.toggle("on", i === k));
        idx.forEach((li, i) => li.classList.toggle("on", i === k));
        col.style.setProperty("--k", k);
        ppct.textContent = pad(k + 1) + " / " + pad(n);
        lastK = k;
      }
      draw($("svg", figs[k]), clamp(local * 1.6, 0, 1), 0.18, 0.4);
      pbar.style.transform = `scaleX(${p.toFixed(4)})`;
    };

    let busy = false;
    const on = () => { if (busy) return; busy = true; requestAnimationFrame(() => { busy = false; upMf(); upPl(); }); };
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    on();

    // 메모: 지나갈 때마다 번호가 굴러가요
    const ncol = $(".nt-side .odo-col", nt);
    if (ncol && "IntersectionObserver" in window) {
      const nio = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) ncol.style.setProperty("--k", en.target.dataset.i); }), { rootMargin: "-42% 0px -52% 0px" });
      $$(".nt-list li", nt).forEach((li) => nio.observe(li));
    }
  }

  // 돌아가며 바뀌는 단어
  function cycler() {
    const c = $(".cyc-col");
    if (!c || REDUCED) return;
    const n = c.children.length - 1;
    let i = 0;
    setInterval(() => {
      i++;
      c.style.transition = "";
      c.style.transform = `translateY(${-i * 1.5}em)`;
      if (i === n) setTimeout(() => { c.style.transition = "none"; c.style.transform = "translateY(0)"; i = 0; }, 850);
    }, 2200);
  }

  // 첫 화면 이름표/십자선/목록 연결
  function heroUI() {
    const labels = $("#labels"), xh = $("#xh"), rd = $(".rd", xh), hl = $(".h", xh), vl = $(".v", xh);
    labels.innerHTML = PROJECTS.map((p, i) => `
      <a class="mlabel" href="project.html#${p.slug}" data-k="${i}" aria-label="${esc(p.title)}, ${p.year}">
        <span class="tag mono"><span class="num">${pad(i + 1)}</span><span class="nm">${esc(p.title)} · ${p.year}</span></span><span class="stem"></span>
      </a>`).join("");
    const L = $$(".mlabel", labels), items = $$(".hero-list a");
    let api = null;
    const setUi = (k) => { api && api.setHover(k); };
    [...L, ...items].forEach((a) => {
      const k = +a.dataset.k;
      a.addEventListener("pointerenter", () => setUi(k));
      a.addEventListener("pointerleave", () => setUi(-1));
      a.addEventListener("focus", () => setUi(k));
      a.addEventListener("blur", () => setUi(-1));
    });
    const fmt = (v) => (v >= 0 ? "+" : "−") + Math.abs(v).toFixed(2).padStart(6, "0");
    return {
      attach(a) { api = a; },
      whenReady: (f) => ready.when(f),
      place(k, x, y, on, show) {
        const el = L[k];
        if (!el) return;
        el.style.transform = `translate3d(${x.toFixed(1)}px,${y.toFixed(1)}px,0)`;
        el.classList.toggle("on", on);
        el.classList.toggle("ready", show);
        if (items[k]) items[k].classList.toggle("on", on);
      },
      cursor(p) { CUR.set(p ? "View" : null); },
      coords(c, ptr) {
        if (!c || !ptr) { xh.classList.remove("on"); CUR.cross(false); return; }
        const r = xh.getBoundingClientRect(), x = ptr[0] - r.left, y = ptr[1] - r.top;
        xh.classList.add("on");
        CUR.cross(true);
        hl.style.transform = `translate3d(0,${y}px,0)`;
        vl.style.transform = `translate3d(${x}px,0,0)`;
        rd.style.transform = `translate3d(${x + 14}px,${y + 12}px,0)`;
        rd.textContent = `X ${fmt(c[0])}  Y ${fmt(c[1])} m`;
      },
      open(k) { const p = PROJECTS[k]; go(`project.html#${p.slug}`, "A-1" + pad(k + 1) + " — " + p.title); },
    };
  }

  // ---------- 작품 목록 ----------
  render.projects = () => {
    const types = ["All", ...new Set(PROJECTS.map((p) => p.type))];
    wi = 0;
    $("#main").innerHTML = `
      <div class="pg wrap">
        <header class="pg-hd grid">
          <p class="crumb mono mid">A-100 — Index of Works</p>
          <h1 class="intro-play">${words("Index of Works")}<sup>(${pad(N)})</sup></h1>
          <div class="tools mono">
            <div class="filters" role="group" aria-label="Filter works">${types.map((t, i) => `<button type="button" class="${i ? "" : "on"}" data-f="${t}">${t}<sup class="num">${t === "All" ? N : PROJECTS.filter((p) => p.type === t).length}</sup></button>`).join("")}</div>
            <div class="views" role="group" aria-label="View"><button type="button" data-v="list">List</button><button type="button" data-v="grid">Grid</button></div>
          </div>
        </header>
        <div class="ix" id="ix">
          <div class="ix-head mono"><span>No.</span><span>Project</span><span>Program</span><span>Site</span><span>Area</span><span>Year</span></div>
          ${PROJECTS.map((p, i) => `
          <a class="ix-row" href="project.html#${p.slug}" data-k="${i}" data-type="${esc(p.type)}" data-cursor="View" data-reveal style="--d:${i * 0.05}s">
            <span class="mono mid num">${pad(i + 1)}</span>
            <span class="t">${esc(p.title)}<small>${esc(p.titleKo)}</small></span>
            <span class="m hs">${esc(p.program)}</span><span class="m hs">${esc(p.site)}</span><span class="m hs num">${esc(p.area)}</span>
            <span class="mono num">${p.year}</span>
          </a>`).join("")}
        </div>
        <div class="wgrid" id="gx" hidden style="margin-top:48px">${PROJECTS.map((p, i) => `
          <a class="wcard" href="project.html#${p.slug}" data-type="${esc(p.type)}" data-cursor="View" data-reveal="wipe" style="--d:${(i % 3) * 0.1}s">
            <div class="media">${mz(cover(p, 800, 1000))}<div class="ov mono"><span>${esc(p.site)}</span><span class="num">${esc(p.area)}</span></div></div>
            <div class="cap"><span class="mono mid num">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><span class="mono mid num">${p.year}</span><p>${esc(p.type)} — ${esc(p.titleKo)}</p></div>
          </a>`).join("")}
        </div>
      </div>
      <div class="pv" id="pv" aria-hidden="true"><div class="media"><div class="mz"></div></div></div>`;

    // 필터
    let filter = "All";
    const apply = () => {
      $$(".ix-row, #gx .wcard").forEach((r) => r.classList.toggle("off", !(filter === "All" || r.dataset.type === filter)));
      hasGsap && ScrollTrigger.refresh();
    };
    $$(".filters button").forEach((b) => b.addEventListener("click", () => {
      filter = b.dataset.f;
      $$(".filters button").forEach((x) => x.classList.toggle("on", x === b));
      apply();
    }));
    // 보기 전환 (기억해 둠)
    const setView = (v) => {
      $("#ix").hidden = v !== "list";
      $("#gx").hidden = v !== "grid";
      $$(".views button").forEach((b) => { b.classList.toggle("on", b.dataset.v === v); b.setAttribute("aria-pressed", b.dataset.v === v); });
      ls.set("yp-view", v);
      reveals($("#main"));
      hasGsap && ScrollTrigger.refresh();
    };
    $$(".views button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.v)));
    setView(ls.get("yp-view") === "grid" ? "grid" : "list");

    // 마우스를 따라오는 미리보기
    const pv = $("#pv"), pvm = $(".mz", pv), cache = {};
    let x = 0, y = 0, px = 0, py = 0, on = false;
    $$(".ix-row").forEach((r) => {
      r.addEventListener("pointerenter", () => {
        const p = PROJECTS[+r.dataset.k];
        pvm.innerHTML = cache[p.slug] || (cache[p.slug] = cover(p, 800, 1000));
        on = true; pv.classList.add("on");
      });
      r.addEventListener("pointerleave", () => { on = false; pv.classList.remove("on"); });
    });
    addEventListener("pointermove", (e) => { x = e.clientX; y = e.clientY; }, { passive: true });
    (function loop() {
      const vx = x - px;
      px += (x - px) * 0.14; py += (y - py) * 0.14;
      if (on || pv.classList.contains("on")) pv.style.transform = `translate3d(${px + 36}px,${py - pv.offsetHeight / 2}px,0) rotate(${clamp(vx * 0.04, -6, 6).toFixed(2)}deg)`;
      requestAnimationFrame(loop);
    })();
  };

  // ---------- 작품 상세 ----------
  render.project = () => {
    const draw = () => {
      if (hasGsap) ScrollTrigger.getAll().forEach((t) => t.kill());
      const slug = decodeURIComponent(location.hash.slice(1));
      let i = PROJECTS.findIndex((p) => p.slug === slug);
      if (i < 0) i = 0;
      const p = PROJECTS[i], ni = (i + 1) % N, nx = PROJECTS[ni];
      document.title = `${p.title} — ${SITE.name}`;
      const tb = $(".tb-title"); if (tb) tb.textContent = p.title;
      $$(".tblock dd")[0] && ($$(".tblock dd")[0].textContent = "A-1" + pad(i + 1));
      let fig = 1;
      const figure = (im, seed, w, h) => `
        <figure data-reveal="wipe"><div class="media">${mz(art(im.src, im.kind || "axon", seed, w, h, p.mass, im.caption))}</div>
        <figcaption class="figcap mono"><span>Fig. ${pad(fig++)}</span><span>${esc(capOf(im))}</span></figcaption></figure>`;
      const facts = [["Year", p.year], ["Studio", p.studio], ["Type", p.type], ["Program", p.program], ["Site", p.site], ["Area", p.area], ["Team", p.team], ["Tools", p.tools]].filter((f) => f[1]);
      wi = 0;
      const title = words(p.title);
      $("#main").innerHTML = `
        <article class="pg">
          <header class="pj-hd wrap grid">
            <div class="crumb mono"><a class="lnk mid" href="projects.html">← Index of Works</a><span class="mid num">A-1${pad(i + 1)} · ${pad(i + 1)} / ${pad(N)}</span></div>
            <div class="ttl"><h1 class="intro-play">${title}</h1>
              <div class="sub"><span>${esc(p.titleKo)}</span><span class="mono">${esc(p.type)} · ${esc(p.site)} · ${p.year}</span></div></div>
          </header>
          <figure class="pj-cover wrap" data-reveal="wipe">
            <div class="media" data-par>${mpar(cover(p, 1600, 970))}</div>
            <figcaption class="figcap mono"><span>Fig. ${pad(fig++)} — ${p.cover ? "Cover" : "Axonometric, NTS"}</span><span>${esc(p.subtitle)}</span></figcaption>
          </figure>
          <div class="pj-body wrap grid">
            <aside class="pj-aside">
              <dl class="mono">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
              <nav class="toc mono" aria-label="On this page"></nav>
            </aside>
            <div class="pj-main">
              <section class="pj-sec" id="s0" data-toc="Overview">
                <div class="hd"><span class="mono mid num">00</span><h2>Overview</h2></div>
                <p class="lead" data-reveal>${esc(p.summary)}</p>
              </section>
              ${p.sections.map((s, si) => `
              <section class="pj-sec" id="s${si + 1}" data-toc="${esc(s.heading)}">
                <div class="hd"><span class="mono mid num">${pad(si + 1)}</span><h2>${esc(s.heading)}</h2></div>
                <p class="txt" data-reveal>${esc(s.text)}</p>
                <div class="figs n${Math.min(3, s.images.length)}">${s.images.map((im, ii) => {
                  const big = s.images.length === 1 || (s.images.length === 3 && ii === 0);
                  return figure(im, `${p.slug}-${si}-${ii}`, big ? 1600 : 1200, s.images.length === 1 ? 1000 : 900);
                }).join("")}</div>
              </section>`).join("")}
            </div>
          </div>
          ${p.drawings && p.drawings.length ? `
          <section class="dwg" id="sd" data-toc="Drawing set">
            <div class="dwg-hd wrap mono"><span>Drawings <span class="mid num">(${pad(p.drawings.length)})</span></span><span class="mid">Scroll →</span></div>
            <div class="dwg-vp wrap"><div class="dwg-track">${p.drawings.map((d, di) => `
              <figure><div class="media">${mz(art(d.src, d.kind, `${p.slug}-d${di}`, 1500, 1000, p.mass, d.caption))}</div>
              <figcaption class="figcap mono"><span>Dwg. ${pad(di + 1)}</span><span>${esc(capOf(d))}</span></figcaption></figure>`).join("")}
            </div></div>
          </section>` : ""}
          <a class="nx wrap" href="project.html#${nx.slug}" data-cursor="Next">
            <div class="row"><span class="mono mid">Next project — ${pad(ni + 1)} / ${pad(N)}</span><span class="t">${esc(nx.title)}</span><div class="media">${mz(cover(nx, 800, 1000))}</div></div>
          </a>
        </article>`;

      // 목차 + 현재 위치 표시
      const secs = $$("[data-toc]");
      const toc = $(".toc");
      toc.innerHTML = secs.map((s) => `<button type="button" data-t="${s.id}">${esc(s.dataset.toc)}</button>`).join("");
      $$("button", toc).forEach((b) => b.addEventListener("click", () => scrollToEl("#" + b.dataset.t)));
      const spy = new IntersectionObserver((es) => es.forEach((en) => {
        if (en.isIntersecting) $$("button", toc).forEach((b) => b.classList.toggle("on", b.dataset.t === en.target.id));
      }), { rootMargin: "-35% 0px -60% 0px" });
      secs.forEach((s) => spy.observe(s));

      // 도면 띠: 세로 스크롤로 가로 이동
      const sec = $(".dwg");
      if (sec && hasGsap && !REDUCED && innerWidth > 760) {
        const track = $(".dwg-track", sec), vp = $(".dwg-vp", sec);
        sec.classList.add("js-pin");
        const dist = () => Math.max(0, track.scrollWidth - vp.clientWidth + parseFloat(getComputedStyle(vp).paddingLeft) + parseFloat(getComputedStyle(vp).paddingRight));
        gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: sec, start: () => "top " + (hdrH() + 8), end: () => "+=" + dist(), pin: true, scrub: 0.8, invalidateOnRefresh: true },
        });
      }
      reveals($("#main"));
      parallax($("#main"));
      hasGsap && ScrollTrigger.refresh();
    };
    draw();
    addEventListener("hashchange", () => {
      draw();
      scrollToY(0, true);
      veilOut();
    });
  };

  // ---------- 소개 ----------
  render.about = () => {
    const list = (rows) => rows.map(([a, b]) => `<li><span class="mono">${esc(a)}</span><span>${esc(b)}</span></li>`).join("");
    wi = 0;
    $("#main").innerHTML = `
      <div class="pg wrap ab">
        <header class="pg-hd grid">
          <p class="crumb mono mid">A-900 — Profile</p>
          <h1 class="intro-play">${words(SITE.owner)}</h1>
          <div class="tools mono mid"><span>${esc(SITE.role)}</span><span>${esc(SITE.based)}</span></div>
        </header>
        <div class="grid" style="margin-top:clamp(48px,8vh,96px);align-items:start">
          <div class="media" data-reveal="wipe">${mz(art(SITE.portrait, "portrait", "me", 900, 1200, null, SITE.owner))}</div>
          <div class="txt">
            <p class="lead">${esc(CV.intro)}</p>
            <dl class="facts mono">
              <div><dt>Based</dt><dd>${esc(SITE.based)}</dd></div>
              <div><dt>Status</dt><dd>${esc(SITE.status)}</dd></div>
              <div><dt>Email</dt><dd>${esc(SITE.email)}</dd></div>
              <div><dt>Language</dt><dd>${esc(CV.languages.join(", "))}</dd></div>
            </dl>
            <section class="cv-sec" data-reveal><h2 class="mono mid">Education</h2><ul>${list(CV.education)}</ul></section>
            <section class="cv-sec" data-reveal><h2 class="mono mid">Experience</h2><ul>${list(CV.experience)}</ul></section>
            <section class="cv-sec" data-reveal><h2 class="mono mid">Awards</h2><ul>${list(CV.awards)}</ul></section>
            <section class="cv-sec" data-reveal><h2 class="mono mid">Exhibitions</h2><ul>${list(CV.exhibitions)}</ul></section>
            <section class="cv-sec" data-reveal><h2 class="mono mid">Toolkit</h2><ul>${list(Object.entries(SITE.toolkit).map(([g, l]) => [g, l.join(", ")]))}</ul></section>
            <section class="cv-sec" data-reveal><h2 class="mono mid">Works</h2><ul>${PROJECTS.map((p, i) => `<li><span class="mono">${p.year}</span><a class="lnk" href="project.html#${p.slug}">${esc(p.title)} — ${esc(p.titleKo)}</a></li>`).join("")}</ul></section>
          </div>
        </div>
      </div>`;
  };

  // ============================================================
  // 실행
  // ============================================================
  chrome();
  veil = $(".veil");
  modeUi();
  clock();
  smooth();
  menu();
  links();
  utils();
  headerScroll();
  (render[PAGE] || render.home)();
  if (PAGE !== "project") { reveals(); parallax(); } else reveals($("footer"));
  if (showLoader) loader(() => ready.fire());
  else {
    if (fromVeil) { ss.del("yp-veil"); $(".vl", veil).textContent = fromVeil; veilOut(); }
    setTimeout(() => ready.fire(), fromVeil ? 300 : 0);
  }
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => hasGsap && ScrollTrigger.refresh());
  addEventListener("load", () => hasGsap && ScrollTrigger.refresh());
})();
