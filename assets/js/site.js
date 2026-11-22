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
    if (/archive\.html$/.test(path)) return ["A-200", "Archive"];
    if (/works\.html$/.test(path)) return ["A-010", "Studio"];
    if (/philosophy\.html$/.test(path)) return ["A-001", "Philosophy"];
    if (/project\.html$/.test(path)) {
      const slug = decodeURIComponent((url.hash || "").slice(1));
      const i = Math.max(0, PROJECTS.findIndex((p) => p.slug === slug));
      return ["A-1" + pad(i + 1), PROJECTS[i].title];
    }
    return ["A-000", "Cover"];
  }
  const labelFor = (url) => sheetOf(url).join(" — ");

  // ---------- 도면/이미지 ----------
  const art = (src, kind, seed, w, h, mass, alt, pos) =>
    src ? `<img src="${esc(src)}" alt="${esc(alt || "")}"${pos ? ` style="object-position:${esc(pos)}"` : ""} loading="lazy" decoding="async">` : Drawing.svg(kind, seed, w, h, mass);
  const mz = (inner) => `<div class="mz">${inner}</div>`;
  const mpar = (inner) => `<div class="mp">${mz(inner)}</div>`;
  const cover = (p, w, h) => art(p.cover, "axon", p.slug, w, h, p.mass, p.title, p.coverPos);
  // 카드·목록·다음 작품에 쓰는 이미지: thumb가 있으면 그것, 없으면 cover
  const card = (p, w, h) => (p.thumb ? art(p.thumb, "axon", p.slug, w, h, p.mass, p.title, p.thumbPos) : cover(p, w, h));
  const capOf = (im) => im.caption || (Drawing.META[im.kind] ? Drawing.META[im.kind][0] + ", " + Drawing.META[im.kind][1] : "");

  // ============================================================
  // 1) 공통 크롬: 상단바, 메뉴, 푸터, 전환막
  // ============================================================
  // [주소, 이름, 8칸 그리드에서 놓일 칸]
  const NAV = PAGE === "home"
    ? [["#intro", "Index", 2], ["#works", "Works", 4], ["#about", "About", 6], ["#contact", "Contact", 7]]
    : [["index.html", "Index", 2], ["projects.html", "Works", 4], ["about.html", "About", 6], ["#contact", "Contact", 7]];

  // 글자 굴리기(roll): 화면 읽기 프로그램은 한 번만 읽도록 두 번째 줄은 CSS ::after로만 그려요
  const roll = (t) => `<span class="roll"><span data-t="${esc(t)}">${esc(t)}</span></span>`;
  const setRoll = (el, t) => { const sp = el && $(".roll > span", el); if (sp) { sp.textContent = t; sp.dataset.t = t; } else if (el) el.textContent = t; };
  function chrome() {
    const [sheet, sheetName] = sheetOf();
    const navHtml = NAV.map(([h, t, c]) => {
      const on = (PAGE === "projects" && t === "Works") || (PAGE === "about" && t === "About") || (PAGE === "project" && t === "Works");
      return `<a class="${on ? "on" : ""}" href="${h}" style="grid-column:${c}">${t}</a>`;
    }).join("");
    BODY.insertAdjacentHTML("afterbegin", `
      <!-- v2 상단바 (docs/redesign-plan.md 1단계): 4칸 — 1 로고 · 2 다크 토글 · 3 Menu/Contact · 4 서울 시각 -->
      <header class="hdr g4" id="hdr">
        <a class="logo" href="index.html" aria-label="${esc(SITE.name)} home">${roll(SITE.name)}</a>
        <div class="hdr-m"><div class="md-sw" role="group" aria-label="화면 밝기"><button type="button" data-m="light" aria-pressed="true">Light</button><button type="button" data-m="dark" aria-pressed="false">Dark</button></div><div class="dial" role="slider" tabindex="0" aria-label="Time travel — 점을 돌리면 시각이 바뀌어요. 누르면 라이트/다크 전환" aria-valuemin="-720" aria-valuemax="720" aria-valuenow="0"><svg viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="25.5"/></svg><span class="dial-dot"></span></div></div>
        <nav class="hdr-n" aria-label="Main">
          <button class="menu-btn" type="button" aria-expanded="false" aria-controls="menu">${roll("Menu")}</button>
          <a href="#contact" data-contact aria-haspopup="dialog">${roll("Contact")}</a>
        </nav>
        <div class="hdr-t"><span class="mid tt-l"><span class="tt-a">Local time</span><button type="button" class="tt-x" aria-label="지금 시각으로 돌아가기" hidden>Time travel <span aria-hidden="true">×</span></button></span><span class="clock num">Seoul --:--</span></div>
        <span class="hdr-line" aria-hidden="true"><i></i></span>
      </header>
      <div class="hud g8" aria-hidden="true">
        <span class="hud-l clock num">Seoul --:--</span>
        <span class="hud-r"><span class="hud-s num">${sheet}</span><span class="hud-n">${esc(sheetName)}</span><span class="hud-c num" hidden><span class="odo"><span class="odo-col"></span></span><b></b><span class="hud-t"></span></span></span>
      </div>
      <div class="mn" id="menu" hidden role="dialog" aria-modal="true" aria-label="Menu">
        ${(SITE.pages || []).map((pg, i) => `<a class="mn-card${i === MN_CUR ? " mn-cur" : ""}" href="${esc(pg.href)}"${pg.contact ? " data-contact" : ""} data-i="${i}" aria-label="${esc(pg.title)}"${i === MN_CUR ? ' aria-current="page"' : ""}><div class="mn-pg">${miniHtml(pg)}</div></a>`).join("")}
      </div>
      <div class="veil wrap" aria-hidden="true"><span class="mono vl"></span><span class="bar"></span></div>`);

    const links = SITE.links.length
      ? SITE.links.map((l) => `<a class="lnk" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.label)} ↗</a>`).join("")
      : `<span class="soft">Instagram · GitHub (준비 중)</span>`;
    BODY.insertAdjacentHTML("beforeend", `
      <footer class="ftr" id="contact" data-ind="Contact">
        <div class="ftr-mid g8">
          <div class="ftr-h"></div>
          <div class="ftr-c5"><span class="lab">Enquire</span>
            <button class="ftr-mail" type="button" data-copy="${esc(SITE.email)}"><span class="addr">${esc(SITE.email)}</span><span class="cp">Copy</span></button>
            <span class="sub">Email</span><div class="ftr-links">${links}</div></div>
          <div class="ftr-c6"><span class="lab">Based</span><span>${esc(SITE.based)}</span><span class="sub num">${esc(SITE.coords)}</span></div>
          <dl class="tblock">
            <dt>Sheet</dt><dd>${sheet}</dd><dt>Title</dt><dd class="tb-title">${esc(sheetName)}</dd>
            <dt>Scale</dt><dd>NTS</dd><dt>Rev.</dt><dd>${esc(SITE.rev)}</dd><dt>Date</dt><dd class="num">${esc(SITE.updated)}</dd>
          </dl>
        </div>
        <div class="ftr-bot g8"><span class="fb1">© ${new Date().getFullYear()} ${esc(SITE.owner)} — ${esc(SITE.name)}</span><span class="fb5 num mid">${esc(SITE.coords)}</span><span class="fb6 mid">${esc(SITE.role)}</span><button class="fb8 lnk" type="button" data-top>Back to top ↑</button></div>
      </footer>`);
  }

  // ---------- v2 Contact 패널 (계획 4단계) ----------
  // 페이지가 어두워지고 가운데 큰 패널이 아래에서 올라와요. 위쪽 탭은 아래 줄 하나를 강조해요.
  // 닫기: CLOSE, Esc, 어두운 바깥 누르기. 열려 있는 동안 페이지 스크롤은 멈춰요.
  function contactPanel() {
    const C = SITE.contact || {};
    const ig = SITE.links.find((l) => /instagram/i.test(l.label));
    const igName = ig ? "@" + ig.href.replace(/\/+$/, "").split("/").pop() : "";
    const rows = [
      ["email", "Email", `<button class="ct-big" type="button" data-copy="${esc(SITE.email)}"><span class="addr">${esc(SITE.email)}</span><span class="cp">Copy</span></button><a class="lnk" href="mailto:${esc(SITE.email)}">Write a mail ↗</a>`],
      ig ? ["instagram", "Instagram", `<a class="ct-big" href="${esc(ig.href)}" target="_blank" rel="noopener">${esc(igName)} <span aria-hidden="true">↗</span></a>`] : null,
      ["pdf", "Portfolio PDF", C.pdf ? `<a class="ct-big" href="${esc(C.pdf)}" target="_blank" rel="noopener">Download PDF <span aria-hidden="true">↓</span></a>` : `<span class="ct-big soft">Coming soon</span><span class="mid">${esc(C.pdfNote || "")}</span>`],
    ].filter(Boolean);
    BODY.insertAdjacentHTML("beforeend", `
      <div class="ct" id="ct" hidden>
        <div class="ct-dim" data-ct-close></div>
        <div class="ct-p" role="dialog" aria-modal="true" aria-labelledby="ct-h" data-lenis-prevent tabindex="-1">
          <div class="ct-top">
            <div class="ct-tabs">${rows.map(([k, t], i) => `<button type="button" class="${i ? "" : "on"}" data-k="${k}">${esc(t)}</button>`).join("")}</div>
            <button type="button" class="ct-x" data-ct-close>Close</button>
          </div>
          <div class="ct-hd">
            <h2 id="ct-h" class="ct-h">${esc(C.title || "Contact")}</h2>
            <p class="ct-note">${(C.note || [SITE.status]).map(esc).join("<br>")}</p>
          </div>
          <div class="ct-body">
            <p class="ct-lead">${esc(C.lead || "")}</p>
            <ol class="ct-rows">${rows.map(([k, t, html], i) => `<li class="ct-row${i ? "" : " on"}" data-k="${k}"><span class="ct-n num">${pad(i + 1)}.</span><span class="ct-t">${esc(t)}</span><div class="ct-v">${html}</div></li>`).join("")}</ol>
          </div>
        </div>
      </div>`);
    const box = $("#ct"), panel = $(".ct-p", box);
    let back = null, timer = 0;
    const open = () => {
      if (!box.hidden && box.classList.contains("open")) return;
      closeMenu(true);
      back = D.activeElement;
      clearTimeout(timer);
      box.hidden = false;
      HTML.classList.add("ct-lock");
      lenis && lenis.stop();
      requestAnimationFrame(() => requestAnimationFrame(() => { box.classList.add("open"); panel.focus({ preventScroll: true }); }));
    };
    const close = () => {
      if (!box.classList.contains("open")) return;
      box.classList.remove("open");
      HTML.classList.remove("ct-lock");
      lenis && lenis.start();
      timer = setTimeout(() => (box.hidden = true), REDUCED ? 0 : 900);
      back && back.focus && back.focus({ preventScroll: true });
    };
    // 캡처 단계에서 먼저 잡아서, 페이지 전환·스크롤 이동보다 앞서 패널을 열어요
    D.addEventListener("click", (e) => {
      const a = e.target.closest && e.target.closest("[data-contact]");
      if (a && a.closest(".st-mn, .sl, #menu") && !REDUCED) return; // 첫 화면 contact 글자·메뉴 카드는 각자 처리 — @ → contact 철자 모션이 끝난 뒤 열어요
      if (a) { e.preventDefault(); open(); return; }
      if (e.target.closest && e.target.closest("[data-ct-close]")) { e.preventDefault(); close(); return; }
      const tab = e.target.closest && e.target.closest(".ct-tabs button");
      if (tab) {
        $$(".ct-tabs button", box).forEach((b) => b.classList.toggle("on", b === tab));
        $$(".ct-row", box).forEach((row) => row.classList.toggle("on", row.dataset.k === tab.dataset.k));
        const row = $(`.ct-row[data-k="${tab.dataset.k}"]`, box);
        row && row.scrollIntoView({ block: "nearest", behavior: REDUCED ? "auto" : "smooth" });
      }
    }, true);
    addEventListener("keydown", (e) => {
      if (!box.classList.contains("open")) return;
      if (e.key === "Escape") { e.stopPropagation(); close(); }
      if (e.key === "Tab") { // 패널 안에서만 포커스가 돌아요
        const f = $$("button, a[href]", panel);
        if (!f.length) return;
        if (e.shiftKey && (D.activeElement === f[0] || D.activeElement === panel)) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && D.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    }, true);
    // 다른 페이지에서 ...#contact 로 들어오면 바로 열어요
    if (location.hash === "#contact") setTimeout(open, PAGE === "works" ? 3200 : PAGE === "home" ? 1400 : 600);
  }

  // ---------- 라이트/다크 ----------
  const setMode = (m) => {
    if (HTML.dataset.mode === m) return;
    HTML.dataset.mode = m;
    $$(".mode span").forEach((s) => (s.textContent = m === "dark" ? "Light" : "Dark"));
    $$(".md-sw button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.m === m)));
    D.dispatchEvent(new Event("yp:theme"));
  };
  function modeUi() {
    HTML.dataset.mode = HTML.dataset.mode === "dark" ? "dark" : "light";
    D.addEventListener("click", (e) => {
      if (!e.target.closest(".mode")) return;
      const m = HTML.dataset.mode === "dark" ? "light" : "dark";
      ls.set("yp-mode", m);
      setMode(m);
    });
    // 다이얼 옆 작은 버튼: 누른 쪽으로 바로 (시간 여행 중이면 지금 시각으로 돌아오며)
    D.addEventListener("click", (e) => {
      const b = e.target.closest(".md-sw button"); if (!b) return;
      ls.set("yp-mode", b.dataset.m);
      if (TT.off && TT.paint) { TT.off = 0; TT.paint(); }
      setMode(b.dataset.m);
    });
    $$(".md-sw button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.m === HTML.dataset.mode)));
    dial();
  }

  // ---------- Time travel 다이얼 (핀 #2, 2026-11-22) ----------
  // 원 둘레의 점을 돌리면 시각이 앞뒤로 움직여요(한 바퀴 = 12시간). 바뀐 시각이 밤이면 배경이 점점 어두워지고(무채색),
  // 절반을 넘으면 글자·도면도 다크 모드로 바뀌어요. 그냥 누르면 예전처럼 라이트/다크 전환, × 또는 Esc로 지금 시각으로.
  const TT = { off: 0 }; // 분 단위로 얼마나 여행했는지
  const seoulNow = () => { try { const p = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "numeric", minute: "numeric", hour12: false }).formatToParts(new Date()); return (+p.find((x) => x.type === "hour").value % 24) * 60 + +p.find((x) => x.type === "minute").value; } catch (e) { return new Date().getHours() * 60 + new Date().getMinutes(); } };
  function dial() {
    const el = $(".dial"), dot = $(".dial-dot"), x = $(".tt-x"), lab = $(".tt-a");
    if (!el) return;
    const sm = (a, b, v) => { const t = clamp((v - a) / (b - a), 0, 1); return t * t * (3 - 2 * t); };
    const dark = (min) => { const h = (((min / 60) % 24) + 24) % 24; return h < 12 ? 1 - sm(4.5, 7, h) : sm(17.5, 20, h); }; // 0 낮 ~ 1 밤
    const paint = () => {
      const on = Math.abs(TT.off) >= 1;
      dot.style.transform = `rotate(${(TT.off / 2).toFixed(2)}deg)`;
      el.setAttribute("aria-valuenow", Math.round(TT.off));
      x.hidden = !on; lab.hidden = on;
      HTML.classList.toggle("tt-on", on);
      if (!on) { HTML.style.removeProperty("--bg"); setMode(ls.get("yp-mode") === "dark" ? "dark" : "light"); }
      else {
        const t = dark(seoulNow() + TT.off), v = Math.round(255 + (13 - 255) * t);
        HTML.style.setProperty("--bg", `rgb(${v}, ${v}, ${v})`);
        setMode(t >= 0.5 ? "dark" : "light");
      }
      $$(".clock").forEach((c) => (c.textContent = "Seoul " + hm(seoulNow() + TT.off)));
    };
    const hm = (min) => { const m = ((Math.round(min) % 1440) + 1440) % 1440; return pad(Math.floor(m / 60)) + ":" + pad(m % 60); };
    TT.paint = paint;
    let drag = null;
    const ang = (e) => { const b = el.getBoundingClientRect(); return Math.atan2(e.clientY - (b.top + b.height / 2), e.clientX - (b.left + b.width / 2)) * 180 / Math.PI; };
    el.addEventListener("pointerdown", (e) => { if (e.button) return; drag = { a: ang(e), moved: 0 }; el.setPointerCapture(e.pointerId); el.classList.add("grab"); e.preventDefault(); });
    el.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const a = ang(e); let d = a - drag.a; if (d > 180) d -= 360; if (d < -180) d += 360;
      drag.a = a; drag.moved += Math.abs(d);
      if (drag.moved > 4) { TT.off = clamp(TT.off + d * 2, -1440 * 7, 1440 * 7); paint(); }
    });
    const up = () => {
      if (!drag) return;
      const click = drag.moved <= 4; drag = null; el.classList.remove("grab");
      if (click) { if (TT.off) { TT.off = 0; paint(); } else { const m = HTML.dataset.mode === "dark" ? "light" : "dark"; ls.set("yp-mode", m); setMode(m); } }
    };
    el.addEventListener("pointerup", up); el.addEventListener("pointercancel", up);
    el.addEventListener("keydown", (e) => {
      const k = e.key, step = e.shiftKey ? 60 : 15;
      if (k === "ArrowRight" || k === "ArrowUp") TT.off += step; else if (k === "ArrowLeft" || k === "ArrowDown") TT.off -= step;
      else if (k === "Enter" || k === " ") { const m = HTML.dataset.mode === "dark" ? "light" : "dark"; ls.set("yp-mode", m); TT.off = 0; paint(); setMode(m); e.preventDefault(); return; }
      else if (k === "Escape" || k === "Home") TT.off = 0; else return;
      e.preventDefault(); paint();
    });
    x.addEventListener("click", () => { TT.off = 0; paint(); el.focus(); });
  }

  // ---------- 서울 시간 ----------
  function clock() {
    let f;
    try { f = new Intl.DateTimeFormat("en-GB", { timeZone: "Asia/Seoul", hour: "2-digit", minute: "2-digit", hour12: false }); } catch (e) { return; }
    const tick = () => (TT.off && TT.paint ? TT.paint() : $$(".clock").forEach((c) => (c.textContent = "Seoul " + f.format(new Date()))));
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
    c.innerHTML = '<i class="gh"></i><i class="gv"></i><span class="gr num"></span><i class="dot"></i><i class="ring"><b></b></i>';
    BODY.appendChild(c);
    // 사이트 전체 좌표 십자선: 페이지 위 위치를 도면 좌표처럼 (10px = 1 m)
    const gh = c.children[0], gv = c.children[1], gr = c.children[2], dot = c.children[3], ring = c.children[4], lab = ring.firstChild;
    const f4 = (v) => (v / 10).toFixed(1).padStart(6, "0");
    let lastTxt = "";
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
      gh.style.transform = `translate3d(0,${y}px,0)`; gv.style.transform = `translate3d(${x}px,0,0)`;
      const fx = x + 14 + 150 > innerWidth ? x - 14 - gr.offsetWidth : x + 14, fy = y + 12 + 24 > innerHeight ? y - 26 : y + 12;
      gr.style.transform = `translate3d(${fx}px,${fy}px,0)`;
      const txt = `X ${f4(x + scrollX)}  Y ${f4(y + scrollY)} m`; if (txt !== lastTxt) { gr.textContent = txt; lastTxt = txt; }
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

  // ---------- v2 메뉴 (계획 5단계): 페이지 카드 세 장 ----------
  // 카드 하나 = 그 페이지 첫 화면의 축소판(화면 전체 크기로 그린 뒤 75%로 줄이고 왼쪽 일부만 보여요).
  // 열 때: 지금 페이지 카드가 화면 전체 크기에서 카드 크기로 줄어들고, 나머지 카드가 옆에서 들어와요.
  // 카드를 누르면 그 카드가 다시 화면 전체로 커진 다음 그 페이지로 이동해요.
  const MN_CUR = (SITE.pages || []).findIndex((pg) => pg.key === PAGE);
  const EASE_IO = "cubic-bezier(0.76, 0, 0.24, 1)";
  const mImg = (src) => (typeof src === "string" && src ? `<img src="${esc(src)}" alt="" loading="lazy" decoding="async">` : "");
  function miniHtml(pg) {
    const top = `<div class="mn-top">${esc(SITE.name)}</div><h2 class="mn-t">${esc(pg.title)}</h2>`;
    if (pg.key === "works") {
      const list = PROJECTS.filter((p) => !p.draft).slice(0, 7); // Works 페이지 첫 화면과 같은 장수·배치 (커진 카드 = Works 화면 그대로)
      const strip = (cls) => `<div class="mn-strip${cls}">${list.map((p) => `<div class="mn-c"><span>${esc(p.title)}</span><div class="mn-im">${mImg(p.thumb || p.cover)}</div></div>`).join("")}</div>`;
      // 첫 화면(glyph 있음): 사진 줄은 숨겨 두고 글자 모듈 S. 누르면 S가 흩어지며 사진 줄이 드러나요
      if (pg.glyph) return top + `<p class="mn-note mn-ph">${esc(pg.note || "")}</p>` + strip(" st-hide") + `<canvas class="mn-art" data-g="${esc(pg.glyph)}" aria-hidden="true"></canvas>`;
      return top + `<div class="mn-strip">${list.map((p) => `<div class="mn-c"><span>${esc(p.title)}</span><div class="mn-im">${mImg(p.thumb || p.cover)}</div></div>`).join("")}</div>`;
    }
    if (pg.key === "archive") {
      const A = SITE.archive || {};
      return top + `<p class="mn-note">${(A.lines || []).map(esc).join("<br>")}<span>${esc(A.years || "")}</span></p><div class="mn-row">${(SITE.reel || []).slice(0, 6).map(([, src, ra]) => `<div class="mn-ar" style="aspect-ratio:${ra || 1}">${mImg(src)}</div>`).join("")}</div>`;
    }
    // 첫 화면의 yeop 카드는 philosophy처럼 글자 모듈 Y (메뉴창의 yeop 카드는 glyph가 없어 사진 그대로)
    if (pg.key === "about" && pg.glyph) return top + `<p class="mn-note mn-ph">${esc(pg.note || "")}</p><canvas class="mn-art" data-g="${esc(pg.glyph)}" aria-hidden="true"></canvas>`;
    if (pg.key === "philosophy") return top + `<p class="mn-note mn-ph">${esc(SITE.manifesto.en)}</p>` + (pg.glyph ? `<canvas class="mn-art" data-g="${esc(pg.glyph)}" aria-hidden="true"></canvas>` : "");
    if (pg.key === "contact") { const CT = SITE.contact || {}; return top + `<p class="mn-note mn-ph">${esc(SITE.email || CT.email || "")}<span>Instagram · Portfolio PDF</span></p>` + (pg.glyph ? `<canvas class="mn-art" data-g="${esc(pg.glyph)}" aria-hidden="true"></canvas>` : ""); }
    if (pg.key === "philosophy" || pg.key === "contact") return top;
    return top + `<div class="mn-pt">${mImg(SITE.portrait)}</div>`;
  }
  let mnOff = 0, mnBusy = false, mnHover = -1;
  const mnCards = () => $$(".mn-card");
  const mnGeo = () => {
    const vw = innerWidth, vh = innerHeight, mob = vw <= 760;
    const sc = mob ? 0.6 : 0.75, W = mob ? vw * 0.6 : vw * 0.2806, step = mob ? W + 30 : vw * 0.3222; // 모바일은 레퍼런스처럼 60%
    return { vw, vh, sc, W, step, x0: mob ? (vw - W) / 2 : vw * 0.12, y: (vh - vh * sc) / 2, R: Math.max(0, vw - W / sc) };
  };
  const mnRange = (g) => { const n = mnCards().length, b = Math.max(0, MN_CUR); return [-(n - 1 - b) * g.step, b * g.step]; };
  const mnPlace = () => {
    const g = mnGeo(), b = Math.max(0, MN_CUR);
    mnCards().forEach((c, i) => {
      const x = g.x0 + (i - b) * g.step + mnOff, h = i === mnHover ? 1.025 : 1;
      c.style.width = g.vw + "px"; c.style.height = g.vh + "px";
      c.style.transform = `translate(${x}px, ${g.y}px) scale(${g.sc * h})`;
      c.style.clipPath = `inset(0px ${g.R}px 0px 0px)`;
    });
  };
  const FULL = { transform: "translate(0px, 0px) scale(1)", clipPath: "inset(0px 0px 0px 0px)" };
  const mnBtn = () => $(".menu-btn");
  function openMenu() {
    const m = $("#menu");
    if (!m || !m.hidden || mnBusy) return;
    mnOff = 0; mnHover = -1;
    m.hidden = false;
    HTML.classList.add("mn-on");
    lenis && lenis.stop();
    mnBtn().setAttribute("aria-expanded", "true"); setRoll(mnBtn(), "Close");
    $$(".mn-card img", m).forEach((im) => (im.loading = "eager"));
    mnPlace();
    const cards = mnCards();
    requestAnimationFrame(() => m.classList.add("open"));
    (cards[MN_CUR] || cards[0]).focus({ preventScroll: true });
    if (REDUCED) return;
    mnBusy = true;
    cards.forEach((c, i) => {
      if (i === MN_CUR) c.animate([{ ...FULL, opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: c.style.transform, clipPath: c.style.clipPath, opacity: 1 }], { duration: 1000, easing: EASE_IO });
      else c.animate([{ translate: "140px 0", opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: 900, delay: 380 + Math.abs(i - Math.max(0, MN_CUR)) * 90, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" });
    });
    setTimeout(() => (mnBusy = false), 1000);
  }
  function closeMenu(instant) {
    const m = $("#menu");
    if (!m || m.hidden) return;
    const done = () => {
      mnCards().forEach((c) => c.getAnimations().forEach((a) => a.cancel()));
      m.hidden = true; m.classList.remove("open"); HTML.classList.remove("mn-on");
      lenis && lenis.start(); mnBusy = false;
    };
    mnBtn().setAttribute("aria-expanded", "false"); setRoll(mnBtn(), "Menu");
    if (instant === true || REDUCED) return done();
    mnBusy = true;
    m.classList.remove("open");
    const c = mnCards()[MN_CUR];
    mnCards().forEach((o) => { if (o !== c) o.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 350, fill: "forwards" }); });
    if (c) c.animate([{ transform: c.style.transform, clipPath: c.style.clipPath, opacity: 1 }, { ...FULL, opacity: 1, offset: 0.8 }, { ...FULL, opacity: 0 }], { duration: 1000, easing: EASE_IO, fill: "forwards" }).finished.then(done, done);
    else m.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 450 }).finished.then(done, done);
  }
  function menu() {
    const m = $("#menu");
    mnBtn().addEventListener("click", () => (m.hidden ? openMenu() : closeMenu()));
    addEventListener("keydown", (e) => {
      if (m.hidden) return;
      if (e.key === "Escape") closeMenu();
      if (/^Arrow(Left|Right)$/.test(e.key)) { // ← → 로 카드 사이 이동
        const cards = mnCards(), k = cards.indexOf(D.activeElement), n = clamp((k < 0 ? Math.max(0, MN_CUR) : k) + (e.key === "ArrowRight" ? 1 : -1), 0, cards.length - 1);
        e.preventDefault(); cards[n].focus({ preventScroll: true });
        const [lo, hi] = mnRange(mnGeo()); mnOff = clamp(-(n - Math.max(0, MN_CUR)) * mnGeo().step, lo, hi); mnPlace();
      }
    });
    // 카드 누르기: 지금 페이지면 닫고, 다른 페이지면 커진 다음 이동
    m.addEventListener("click", (e) => {
      const c = e.target.closest(".mn-card");
      e.preventDefault();
      if (!c) return closeMenu();
      if (mnBusy || mnMoved) return;
      const i = +c.dataset.i;
      if (i === MN_CUR) return closeMenu();
      if (c.hasAttribute("data-contact")) { closeMenu(true); setTimeout(() => { const b = $(".hdr [data-contact]"); if (b) b.click(); }, 0); return; }
      mnBusy = true;
      c.style.zIndex = 2;
      if (c.getAttribute("href") === "works.html") ss.set("yp-hi", "1"); // 메뉴로 홈에 가면 로딩 인트로는 건너뛰어요
      const go2 = () => location.assign(c.href);
      if (REDUCED) return go2();
      c.animate([{ transform: c.style.transform, clipPath: c.style.clipPath }, FULL], { duration: 900, easing: EASE_IO, fill: "forwards" }).finished.then(go2, go2);
    });
    m.addEventListener("pointerover", (e) => { const c = e.target.closest(".mn-card"); const i = c ? +c.dataset.i : -1; if (i !== mnHover && !mnBusy) { mnHover = i; mnPlace(); } });
    m.addEventListener("pointerleave", () => { mnHover = -1; if (!mnBusy) mnPlace(); });
    // 휠·끌기로 카드 줄을 옆으로
    m.addEventListener("wheel", (e) => {
      e.preventDefault();
      if (mnBusy) return;
      const g = mnGeo(), [lo, hi] = mnRange(g);
      mnOff = clamp(mnOff - (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY), lo, hi); mnPlace();
    }, { passive: false });
    let down = null, mnMoved = false;
    m.addEventListener("pointerdown", (e) => { if (!e.button) { down = { x: e.clientX, o: mnOff, id: e.pointerId }; mnMoved = false; } });
    m.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!mnMoved && Math.abs(dx) > 5) { mnMoved = true; m.setPointerCapture(down.id); m.classList.add("drag"); }
      if (mnMoved) { const [lo, hi] = mnRange(mnGeo()); mnOff = clamp(down.o + dx, lo, hi); mnPlace(); }
    });
    const up = () => { down = null; m.classList.remove("drag"); setTimeout(() => (mnMoved = false), 0); };
    m.addEventListener("pointerup", up); m.addEventListener("pointercancel", up);
    addEventListener("resize", () => { if (!m.hidden) mnPlace(); });
    // 뒤로 가기로 돌아왔을 때(페이지 보관) 메뉴가 열린 채로 남지 않게
    addEventListener("pageshow", (e) => { if (e.persisted) closeMenu(true); });
  }

  // ---------- 아래쪽 고정 표시: 지금 보고 있는 구간 이름 + 01 | 03 번호 ----------
  const makeHud = () => {
    const r = $(".hud-r");
    if (!r) return { set() {} };
    const nm = $(".hud-n", r), cnt = $(".hud-c", r), col = $(".odo-col", r), tot = $(".hud-t", r);
    const base = nm.textContent;
    let last = "";
    return {
      set(name, k = 0, n = 1) {
        const key = name + "|" + k + "|" + n;
        if (key === last) return;
        last = key;
        nm.textContent = name || base;
        if (n > 1) {
          if (col.children.length !== n) col.innerHTML = Array.from({ length: n }, (_, i) => `<i>${pad(i + 1)}</i>`).join("");
          col.style.setProperty("--k", k);
          tot.textContent = pad(n);
          cnt.hidden = false;
        } else cnt.hidden = true;
      },
    };
  };

  // ---------- 상단바 진행선 + 지금 구간 표시 ----------
  // 선은 메뉴 이름 아래 눈금을 따라 자라요: Philosophy 구간이면 Philosophy 눈금까지, Works면 Works까지…
  function chromeScroll() {
    const HUD = makeHud();
    const line = $(".hdr-line i"), navA = $$(".nav a");
    const inds = () => $$("[data-ind]");
    const targets = PAGE === "home" ? navA.map((a) => $(a.getAttribute("href"))) : [];
    const on = () => {
      const W = innerWidth, y = scrollY + innerHeight * 0.5, max = D.documentElement.scrollHeight - innerHeight;
      let x;
      if (targets.length && targets.every(Boolean) && innerWidth > 760) {
        const tops = targets.map((t) => t.getBoundingClientRect().top + scrollY);
        const xs = navA.map((a) => a.getBoundingClientRect().left);
        let i = tops.findIndex((t) => y < t);
        if (scrollY >= max - 2) x = W;
        else if (i === 0) x = xs[0] * clamp(y / tops[0], 0, 1);
        else if (i === -1) { const a = tops[tops.length - 1]; x = xs[xs.length - 1] + (W - xs[xs.length - 1]) * clamp((scrollY - (a - innerHeight * 0.5)) / Math.max(1, max - (a - innerHeight * 0.5)), 0, 1); }
        else x = xs[i - 1] + (xs[i] - xs[i - 1]) * clamp((y - tops[i - 1]) / (tops[i] - tops[i - 1]), 0, 1);
        navA.forEach((a, j) => a.classList.toggle("on", i === -1 ? j === navA.length - 1 : j === i - 1));
      } else x = W * clamp(scrollY / Math.max(1, max), 0, 1);
      line.style.transform = `scaleX(${(x / W).toFixed(4)})`;

      // 화면 가운데를 지나는 구간의 이름을 아래쪽에 보여줘요
      const c = innerHeight * 0.5;
      const s = inds().find((el) => { const r = el.getBoundingClientRect(); return r.top <= c && r.bottom > c; });
      if (s) HUD.set(s.dataset.ind, s._k || 0, s._n || 1);
      else HUD.set("");
    };
    let busy = false;
    const req = () => { if (busy) return; busy = true; requestAnimationFrame(() => { busy = false; on(); }); };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", req);
    on();
    return req;
  }

  // ---------- 복사 / 맨 위로 ----------
  function utils() {
    D.addEventListener("click", (e) => {
      const cp = e.target.closest("[data-copy]");
      if (cp) {
        const v = cp.dataset.copy, lab = $(".cp", cp);
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

  // ---------- 표지 다음 화면: 휘어진 무한 이미지 띠 (2026-11-21 채팅 요청) ----------
  // 제목 → 띠 → 설계 철학 한 줄 + Works·About. 띠 위아래 곡선 마스크(var(--bg))로 가운데가 오목하게 보여요.
  const reelHtml = () => {
    const list = (SITE.reel || []).map(([slug, src, r]) => ({ p: PROJECTS.find((q) => q.slug === slug && !q.draft), src, r })).filter((x) => x.p);
    if (!list.length) return "";
    const cards = (k) => list.map(({ p, src, r }) => `<a class="fl-card" href="project.html#${p.slug}" draggable="false"${r ? ` style="aspect-ratio:${r}"` : ""}${k ? ' aria-hidden="true" tabindex="-1"' : ""}><img src="${esc(src)}" alt="${esc(p.title)}" draggable="false" decoding="async"></a>`).join("");
    const mask = (dd, c) => `<svg class="fl-m ${c}" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="${dd}"/></svg>`;
    return `
      <section class="fl" id="reel" data-ind="YP.STUDIO" aria-label="Works in images">
        <h2 class="fl-h">${esc(SITE.name)} <span class="mid">— ${esc(SITE.owner)}</span></h2>
        <div class="fl-band" data-flow>
          <div class="fl-track">${cards(0)}${cards(1)}</div>
          ${mask("M0 0H1440V50C1440 50 1200 100 720 100C240 100 0 50 0 50V0Z", "fl-t")}
          ${mask("M0 100H1440V50C1440 50 1200 0 720 0C240 0 0 50 0 50V100Z", "fl-b")}
        </div>
        <p class="fl-p">${esc(SITE.manifesto.en)}</p>
        <p class="fl-lk"><a class="fl-u" href="#works">Works</a><a class="fl-u" href="about.html">About</a></p>
      </section>`;
  };
  function reel() {
    const band = $("[data-flow]"); if (!band) return;
    const track = $(".fl-track", band);
    let x = 0, v = 0, half = 0, raf = 0, vis = false, drag = null, block = false;
    const AUTO = REDUCED ? 0 : -0.8; // 매 프레임 왼쪽으로 0.8px (움직임 줄이기 설정이면 자동 흐름 없음)
    const measure = () => { half = track.scrollWidth / 2; };
    const wrap = () => { if (half > 0) { while (x <= -half) x += half; while (x > 0) x -= half; } };
    const paint = () => { track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`; };
    const frame = () => {
      raf = 0;
      if (!drag) { x += AUTO + v; v *= 0.95; if (Math.abs(v) < 0.02) v = 0; }
      wrap(); paint();
      // 화면 밖이거나 탭이 숨으면 멈춰요
      if (vis && !document.hidden && (AUTO || v || drag)) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf && vis && !document.hidden) raf = requestAnimationFrame(frame); };
    band.addEventListener("pointerdown", (e) => {
      if (e.button !== 0) return;
      drag = { id: e.pointerId, x0: e.clientX, lx: e.clientX, lt: performance.now(), cap: false }; v = 0; block = false; kick();
    });
    band.addEventListener("pointermove", (e) => {
      if (!drag || e.pointerId !== drag.id) return;
      const dx = e.clientX - drag.lx, now = performance.now(), dt = Math.max(1, now - drag.lt);
      // 5px 넘게 끌어야 '끌기'로 보고 포인터를 붙잡아요(그 전에는 보통 클릭)
      if (!drag.cap && Math.abs(e.clientX - drag.x0) >= 5) { drag.cap = true; block = true; try { band.setPointerCapture(e.pointerId); } catch (_) {} band.classList.add("grabbing"); }
      if (drag.cap) { x += dx; v = dx * (16.7 / dt); wrap(); paint(); }
      drag.lx = e.clientX; drag.lt = now;
    });
    const up = (e) => {
      if (!drag || (e && e.pointerId !== drag.id)) return;
      if (performance.now() - drag.lt > 80) v = 0; // 멈췄다 놓으면 미끄러지지 않아요
      drag = null; band.classList.remove("grabbing"); kick();
    };
    band.addEventListener("pointerup", up); band.addEventListener("pointercancel", up); band.addEventListener("lostpointercapture", up);
    // 끌었다 놓은 건 클릭으로 치지 않아요
    band.addEventListener("click", (e) => { if (block) { e.preventDefault(); e.stopPropagation(); block = false; } }, true);
    band.addEventListener("dragstart", (e) => e.preventDefault());
    $$("img", track).forEach((im) => im.addEventListener("load", measure, { once: true }));
    addEventListener("resize", () => { measure(); wrap(); paint(); });
    document.addEventListener("visibilitychange", kick);
    measure();
    if ("IntersectionObserver" in window) new IntersectionObserver(([en]) => { vis = en.isIntersecting; measure(); kick(); }).observe(band);
    else { vis = true; kick(); }
  }

  // ---------- 메인 ----------
  // 화면 가운데의 가로선(.lines b)을 기준선 삼아, 제목은 선 바로 아래에 걸리게 배치해요 (santalarch 방식).
  // ---------- v2 홈 (docs/redesign-plan.md 2단계): 가로로 끝없이 도는 작품 카드 띠 ----------
  // 휠·끌기·화살표 키로 옆으로 흘러요. 움직이는 동안 카드가 0.9배까지 작아지며(그래서 간격이 벌어져 보여요)
  // 멈추면 돌아와요. 카드 안 사진은 1.15배로 키워 두고 화면 위치에 따라 살짝 반대로 밀려요(사진 속 시차).
  // ---------- studio 보기 전환 (2026-11-22): 슬라이드 ↔ 그리드(3열) ----------
  // 그리드로 바꾸면 띠에 보이던 사진들이 제자리에서 그리드 칸으로 날아가 앉고, 나머지는 아래에서 차례로 떠올라요(사진은 네모 조각으로 열려요).
  // 슬라이드로 돌아가면 반대로 그리드 사진이 띠 자리로 돌아가요. 고른 보기는 기억해요(이 브라우저에서만).
  function csView() {
    const sec = $(".cs"), gd = $(".cs-gd", sec), btns = $$(".cs-vw button", sec);
    if (!sec || !gd) return;
    { const vw = $(".cs-vw", sec); if (vw) D.body.appendChild(vw); } // 섹션 바깥(맨 위 층)에 둬야 상단바에 가리지 않아요
    let busy = false;
    const visibleStrip = () => { const m = new Map(); $$(".cs-track .cs-card", sec).forEach((c) => { const b = c.getBoundingClientRect(); if (b.right > 0 && b.left < innerWidth && !m.has(c.dataset.i)) m.set(c.dataset.i, b); }); return m; };
    const mediaOf = (c) => $(".media", c);
    const press = (v) => btns.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.vw === v)));
    function toGrid(anim) {
      if (HTML.classList.contains("cs-grid") || busy) return;
      const src = visibleStrip();
      // 띠 카드 미디어 위치(사진만)
      const srcM = new Map(); $$(".cs-track .cs-card", sec).forEach((c) => { const m = mediaOf(c).getBoundingClientRect(); if (m.right > 0 && m.left < innerWidth && !srcM.has(c.dataset.i)) srcM.set(c.dataset.i, m); });
      gd.hidden = false; gd.scrollTop = 0; HTML.classList.add("cs-grid"); press("grid"); try { ls.set("yp-vw", "grid"); } catch (e) {}
      if (!anim || REDUCED) return;
      busy = true;
      const cards = $$(".cs-gc", gd); let last = null;
      cards.forEach((c, k) => {
        const m = mediaOf(c), to = m.getBoundingClientRect(), from = srcM.get(c.dataset.i);
        const lab = $(".cs-lab", c);
        if (from && to.top < innerHeight) {
          const dx = from.left - to.left, dy = from.top - to.top, sx = from.width / to.width, sy = from.height / to.height;
          last = m.animate([{ transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: "0 0" }, { transform: "none", transformOrigin: "0 0" }], { duration: 1000, delay: k * 45, easing: EASE_IO, fill: "backwards" });
        } else {
          // 새로 나타나는 칸: 아래에서 떠오르며 네모 조각(계단식 clip)으로 열려요
          const d = 250 + k * 70;
          last = m.animate([{ transform: "translateY(60px)", opacity: 0, clipPath: "inset(100% 0 0 0)" }, { transform: "translateY(0)", opacity: 1, clipPath: "inset(0% 0 0 0)" }], { duration: 900, delay: d, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" });
        }
        if (lab) lab.animate([{ opacity: 0, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], { duration: 600, delay: 500 + k * 45, easing: "ease-out", fill: "backwards" });
      });
      // 바탕 모눈 조각이 한 번 스치고 사라져요
      tiles();
      (last ? last.finished : Promise.resolve()).catch(() => {}).then(() => (busy = false));
    }
    function toSlide(anim) {
      if (!HTML.classList.contains("cs-grid") || busy) return;
      const done = () => { gd.hidden = true; HTML.classList.remove("cs-grid"); press("slide"); try { ls.set("yp-vw", "slide"); } catch (e) {} busy = false; };
      if (!anim || REDUCED) return done();
      busy = true;
      // 그리드 칸 위치 → 띠의 같은 작품 자리로
      gd.style.visibility = "hidden"; HTML.classList.remove("cs-grid"); const dst = new Map(); $$(".cs-track .cs-card", sec).forEach((c) => { const m = mediaOf(c).getBoundingClientRect(); if (m.right > 0 && m.left < innerWidth && !dst.has(c.dataset.i)) dst.set(c.dataset.i, m); }); HTML.classList.add("cs-grid"); gd.style.visibility = "";
      const strip = $(".cs-track", sec); let last = null;
      $$(".cs-gc", gd).forEach((c, k) => {
        const m = mediaOf(c), from = m.getBoundingClientRect(), to = dst.get(c.dataset.i);
        if (from.bottom < 0 || from.top > innerHeight) return;
        const kf = to ? [{ transform: "none", transformOrigin: "0 0" }, { transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width}, ${to.height / from.height})`, transformOrigin: "0 0" }]
          : [{ opacity: 1 }, { opacity: 0, transform: "translateY(40px)" }];
        last = m.animate(kf, { duration: 850, delay: k * 30, easing: EASE_IO, fill: "forwards" });
      });
      $$(".cs-gc .cs-lab", gd).forEach((l) => l.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, fill: "forwards" }));
      (last ? last.finished : Promise.resolve()).catch(() => {}).then(() => { done(); $$(".cs-gc .media, .cs-gc .cs-lab", gd).forEach((m) => m.getAnimations().forEach((a) => a.cancel())); if (strip) strip.animate([{ opacity: 0.6 }, { opacity: 1 }], { duration: 300 }); });
    }
    // 바탕 모듈: 정사각 조각들이 대각선으로 한 번 반짝이며 지나가요
    function tiles() {
      const cv = D.createElement("canvas"), dpr = Math.min(2, devicePixelRatio || 1), W = innerWidth, H = innerHeight;
      cv.className = "cs-tiles"; cv.width = W * dpr; cv.height = H * dpr; sec.appendChild(cv);
      const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      const C = Math.max(14, Math.round(W / 64)), ink = getComputedStyle(HTML).getPropertyValue("--line").trim() || "#ddd", t0 = performance.now();
      const frame = (now) => {
        const t = (now - t0) / 1000; g.clearRect(0, 0, W, H); g.fillStyle = ink;
        for (let y = 0; y < H; y += C) for (let x = 0; x < W; x += C) {
          const d = (x / W) * 0.6 + (y / H) * 0.4, q = (t - d * 0.7) / 0.45; if (q <= 0 || q >= 1) continue;
          const a = Math.sin(q * Math.PI); g.globalAlpha = a * 0.55; const sz = (C - 2) * a; g.fillRect(x + (C - sz) / 2, y + (C - sz) / 2, sz, sz);
        }
        if (t < 1.4) requestAnimationFrame(frame); else cv.remove();
      };
      requestAnimationFrame(frame);
    }
    btns.forEach((b) => b.addEventListener("click", () => (b.dataset.vw === "grid" ? toGrid(true) : toSlide(true))));
    addEventListener("keydown", (e) => { if (e.key === "Escape" && HTML.classList.contains("cs-grid") && !HTML.classList.contains("ct-lock") && !$("#menu.open")) toSlide(true); });
    let saved = null; try { saved = ls.get("yp-vw"); } catch (e) {}
    if (saved === "grid") toGrid(false);
    cardFx();
  }

  render.works = () => {
    HTML.classList.add("v2-home");
    const list = PROJECTS.filter((p) => !p.draft);
    const one = list.map((p, i) => `
      <a class="cs-card" href="project.html#${p.slug}" draggable="false" data-i="${i}">
        <span class="cs-lab"><span class="cs-no num">${i + 1}.</span> ${esc(p.title)}${p.blurb ? ` <span class="cs-sub">${esc(p.blurb)}</span>` : ""}</span>
        <div class="media">${mz(card(p, 800, 1060))}</div>
      </a>`).join("");
    $("#main").innerHTML = `
      <section class="cs" id="cases" data-ind="Cases" aria-label="Studio">
        <h1 class="sr">${esc(SITE.name)} — Selected works</h1>
        <div class="cs-vw" role="group" aria-label="View">
          <button type="button" data-vw="slide" aria-pressed="true" aria-label="Slide view" title="Slide"><svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0.5" y="0.5" width="4.5" height="11"/><rect x="6.75" y="0.5" width="4.5" height="11"/><rect x="13" y="0.5" width="4.5" height="11"/></svg></button>
          <button type="button" data-vw="grid" aria-pressed="false" aria-label="Grid view" title="Grid"><svg viewBox="0 0 18 12" aria-hidden="true"><rect x="0.5" y="0.5" width="4.5" height="4.5"/><rect x="6.75" y="0.5" width="4.5" height="4.5"/><rect x="13" y="0.5" width="4.5" height="4.5"/><rect x="0.5" y="7" width="4.5" height="4.5"/><rect x="6.75" y="7" width="4.5" height="4.5"/><rect x="13" y="7" width="4.5" height="4.5"/></svg></button>
        </div>
        <div class="cs-gd" data-lenis-prevent hidden><div class="cs-gd-in">${one.replace(/class="cs-card"/g, 'class="cs-card cs-gc"')}</div></div>
        <div class="cs-track">${[0, 1, 2].map((k) => k === 1 ? `<div class="cs-set">${one}</div>` : `<div class="cs-set" aria-hidden="true">${one.replace(/<a /g, '<a tabindex="-1" ')}</div>`).join("")}</div>
      </section>`;
    // 인트로는 탭(세션)마다 홈에 처음 왔을 때 한 번만. 움직임 줄이기 설정이면 건너뛰어요
    const playIntro = !REDUCED && !ss.get("yp-hi");
    if (playIntro) HTML.classList.add("hi-on");
    caseStrip();
    cardFx();
    csView();
    if (playIntro) { ss.set("yp-hi", "1"); homeIntro(list); }
  };

  // ---------- v2 로딩 인트로 (계획 3단계) ----------
  function homeIntro(list) {
    const srcs = list.map((p) => p.thumb || p.cover).filter((x) => typeof x === "string");
    const firstCard = $(".cs-set:nth-child(2) .cs-card");
    const done = () => { HTML.classList.remove("hi-on"); HTML.classList.add("hi-end"); setTimeout(() => HTML.classList.remove("hi-end"), 1400); };
    if (!srcs.length || !firstCard) return done();
    // 마지막 장면은 첫 카드 사진이 되도록 순서를 거꾸로 돌려요
    const seq = [...srcs.slice(1).reverse(), ...srcs.slice(1).reverse(), srcs[0]];
    const box = D.createElement("div");
    box.className = "hi";
    box.setAttribute("aria-hidden", "true");
    box.innerHTML = `<img alt="" decoding="async" src="${esc(seq[0])}">`;
    BODY.appendChild(box);
    seq.forEach((u) => { const im = new Image(); im.src = u; }); // 미리 불러오기
    const img = $("img", box);
    let k = 0;
    const flip = setInterval(() => {
      k++;
      if (k < seq.length) { img.src = seq[k]; return; }
      clearInterval(flip);
      expand();
    }, 115);
    const expand = () => {
      const media = $(".media", firstCard), a = box.getBoundingClientRect(), b = media.getBoundingClientRect();
      const dx = b.left + b.width / 2 - (a.left + a.width / 2), dy = b.top + b.height / 2 - (a.top + a.height / 2), sc = b.width / a.width;
      const ease = "cubic-bezier(0.76, 0, 0.24, 1)";
      box.animate([{ transform: "translate(-50%, -50%)" }, { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(${sc})` }], { duration: 1100, easing: ease, fill: "forwards" })
        .finished.then(() => {
          firstCard.classList.add("hi-in");
          // 나머지 카드: 첫 카드 뒤에 겹쳐 있다가 제자리로 미끄러져 나와요
          const x0 = firstCard.getBoundingClientRect().left;
          $$(".cs-card").forEach((c) => {
            if (c === firstCard) return;
            const l = c.getBoundingClientRect().left;
            if (l < -50 || l > innerWidth + 50) { c.classList.add("hi-in"); return; }
            c.classList.add("hi-in");
            c.animate([{ translate: `${x0 - l}px 0`, opacity: 0 }, { translate: "0 0", opacity: 1, offset: 0.25 }, { translate: "0 0", opacity: 1 }], { duration: 1200, easing: "cubic-bezier(0.16, 1, 0.3, 1)" });
          });
          requestAnimationFrame(() => box.remove());
          done();
        });
    };
  }


  // ---------- 첫 화면 (핀 #35): 메뉴 카드 네 장 — philosophy · works · about · contact ----------
  // 카드마다 글자 하나가 작은 정사각 모듈로 쪼개져 아래에서 조립돼요(모션 아트). 마우스를 대면 모듈이 비켜서며 45° 돌아요.
  // 카드를 누르면 화면 전체로 커진 다음 그 페이지로 가고, contact는 연락 패널을 열어요.
  render.home = () => {
    HTML.classList.add("st-home", "sl-home");
    const ST = SITE.start || [], N = 24, SETS = 1;
    const item = (pg, i, k) => `<a class="sl-a" draggable="false" href="${esc(pg.href)}"${pg.contact ? " data-contact" : ""} data-i="${i}"${k ? ' aria-hidden="true" tabindex="-1"' : ` aria-label="${esc(pg.title)}"`}><span class="sl-t" aria-hidden="true">${esc(pg.title)}</span><span class="sl-g"></span></a>`;
    $("#main").innerHTML = `
      <h1 class="sr">${esc(SITE.name)} — ${esc(SITE.owner)} Architecture Portfolio</h1>
      <nav class="sl" aria-label="Start"><div class="sl-tr">${[...Array(SETS)].map((_, k) => ST.map((pg, i) => item(pg, i, k)).join("")).join("")}</div></nav>`;
    const nav = $(".sl"), tr = $(".sl-tr", nav), as = $$(".sl-a", nav);
    as.forEach((a) => $(".sl-g", a).appendChild(stGlyph(ST[+a.dataset.i].glyph, N)));
    // 들어올 때: 층이 아래부터 쌓이고, 글자는 왼쪽부터 차례로
    if (!REDUCED) as.forEach((a, j) => {
      $$(".st-b", a).forEach((b, k) => b.animate([{ translate: "0 0.14em", opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: 1000, delay: 250 + j * 90 + (N - 1 - k) * 22, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }));
      $(".sl-t", a).animate([{ opacity: 0, translate: "0 8px" }, { opacity: 1, translate: "0 0" }], { duration: 800, delay: 800 + j * 90, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" });
    });

    // 스크롤 모션 아트 (2026-11-22 요청): 글자는 가운데에 서 있고, 스크롤하면 왼쪽 글자부터 한 자씩 왼쪽으로 밀리며 옅어져요.
    // 글자의 가로 층 24장은 위층일수록 더 멀리 밀려 층이 어긋나며 흩어지고, 다 사라지면 새 글자가 오른쪽에서 아래층부터 쌓이며 다시 서요.
    // (2026-11-22 4차) 사라지는 대신: 스크롤하면 글자들이 흥분해 화면 안을 종종걸음으로 도망 다니고, 멈추면 집으로 돌아와요 — 아래 actors()
    let ph = 0, tg = 0, dir = 1, hovering = false, busy = false, mx = -1e4, my = -1e4, last = 0, lastIn = 0;
    let geo = [];
    const clamp = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const eIn = (v) => v * v * v, eOut = (v) => 1 - Math.pow(1 - v, 3);
    const measure = () => {
      tr.style.fontSize = ""; const e = parseFloat(getComputedStyle(HTML).getPropertyValue("--g4-e")) || 16;
      const fit = Math.min(1, (innerWidth - 2 * e) / (tr.scrollWidth || 1)); // 한 화면 폭 안에 들어오게
      if (fit < 1) tr.style.fontSize = parseFloat(getComputedStyle(tr).fontSize) * fit + "px";
      geo = as.map((a) => { const g = $(".st-gl", a), fs = parseFloat(getComputedStyle(g).fontSize), rc = g.getBoundingClientRect();
        return { a, g, fs, hw: rc.width / 2, x0: rc.left + rc.width / 2 - (parseFloat(a.style.translate) || 0), by: rc.bottom, bs: $$(".st-b", a), sl: $$(".st-b > i", a).map((el, k) => ({ el, y: rc.top + ((k + 0.5) / N) * rc.height, cur: 0 })) }; });
    };
    measure(); addEventListener("resize", measure);
    let msp = 0, pmT = 0, pmx = 0, pmy = 0; // 커서 빠르기(px/s): 빠르면 놀라고, 느리면 궁금해해요
    addEventListener("pointermove", (e) => { const n = performance.now(); if (pmT) { const v = (Math.hypot(e.clientX - pmx, e.clientY - pmy) / Math.max(8, n - pmT)) * 1000; msp += (v - msp) * 0.35; } pmx = e.clientX; pmy = e.clientY; pmT = n; mx = e.clientX; my = e.clientY; last = n; }, { passive: true });
    D.addEventListener("pointerleave", () => { if (!nav.classList.contains("holding")) mx = my = -1e4; });
    nav.addEventListener("pointerover", (e) => { hovering = !!e.target.closest(".sl-a"); });
    nav.addEventListener("pointerleave", () => { hovering = false; });
    const push = (d) => { if (busy || REDUCED || !d) return; lastIn = performance.now(); }; // 스크롤·끌기·키 = 글자들이 흥분해요
    nav.addEventListener("wheel", (e) => { e.preventDefault(); push((Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) / (innerHeight * 4)); }, { passive: false });
    let down = null, moved = false;
    nav.addEventListener("pointerdown", (e) => { if (!e.button) { const a = e.target.closest(".sl-a"); down = { x: e.clientX, y: e.clientY, id: e.pointerId, j: a && !REDUCED ? as.indexOf(a) : -1 }; moved = false; } });
    nav.addEventListener("pointermove", (e) => {
      if (!down || busy) return; const dx = e.clientX - down.x, dy = e.clientY - down.y, d = Math.abs(dx) > Math.abs(dy) ? dx : dy;
      if (!moved && Math.abs(d) > 5) { moved = true; nav.setPointerCapture(down.id); nav.classList.add("drag"); if (down.j >= 0) { mx = e.clientX; my = e.clientY; grab(down.j, down.x, down.y); down.held = true; } }
      if (down.held) { mx = e.clientX; my = e.clientY; return; } // 잡는 동안엔 커서 위치를 여기서 직접 (포인터 캡처 중 바깥 이벤트가 위치를 지워서)
      if (moved) { push(-d / (innerHeight * 2.4)); down.x = e.clientX; down.y = e.clientY; }
    });
    const up = () => { if (down && down.held) letGo(down.j); down = null; nav.classList.remove("drag"); setTimeout(() => (moved = false), 0); };
    nav.addEventListener("pointerup", up); nav.addEventListener("pointercancel", up);
    nav.addEventListener("dragstart", (e) => e.preventDefault());
    const dropAll = () => { CH.forEach((c, j) => { if (c.mode === "held") letGo(j); }); if (down && down.held) { down = null; nav.classList.remove("drag"); setTimeout(() => (moved = false), 0); } };
    nav.addEventListener("lostpointercapture", dropAll);
    addEventListener("pointerup", dropAll); addEventListener("blur", dropAll);
    addEventListener("pointermove", (e) => { if (!e.buttons && CH.some((c) => c.mode === "held")) dropAll(); }, { passive: true }); // 버튼이 이미 떼어져 있으면 바로 놓아요 // 링크 기본 끌기를 막아야 글자를 잡을 수 있어요
    addEventListener("keydown", (e) => { if (!busy && /^(Arrow(Left|Right|Up|Down)|PageDown|PageUp| )$/.test(e.key) && $("#menu").hidden) { e.preventDefault(); push(1); } });

    // 글자 j의 층 k: 떠날 때(0~0.5)와 다시 설 때(0.5~1) 진행률
    const n = as.length, LW = 0.22, LS = n > 1 ? (0.5 - LW - 0.04) / (n - 1) : 0;
    // 바퀴 c, 글자 j마다 정해진 무작위 경로: 떠날 때는 왼쪽 위·아래로 휘어 가고, 돌아올 때는 오른쪽 위·아래에서 휘어 들어와요
    const rnd = (c, j, q) => { const x = Math.sin(c * 127.1 + j * 311.7 + q * 74.7) * 43758.5453; return x - Math.floor(x); };
    const path = (c, j, out) => {
      const th = (out ? Math.PI : 0) + (rnd(c, j, out ? 1 : 5) - 0.5) * 2.0; // 왼쪽(또는 오른쪽) ±57°
      return { th, D: 0.55 + rnd(c, j, out ? 2 : 6) * 0.45, bend: (rnd(c, j, out ? 3 : 7) - 0.5) * 0.5, rot: (rnd(c, j, out ? 4 : 8) - 0.5) * 50 };
    };
    const draw = (f, c = 0) => {
      const vw = innerWidth, vh = innerHeight, R = Math.hypot(vw, vh) * 0.5;
      geo.forEach((g, j) => {
        let op = 1;
        if (f > 0.0005 && f < 0.9995) {
          const out = f < 0.5, P = path(out ? c : c + 0, j, out);
          const o = out ? clamp((f - j * LS) / LW) : clamp((f - 0.5 - j * LS) / LW);
          op = out ? 1 - clamp(o * 1.05) : clamp(o * 1.1);
          const cs = Math.cos(P.th), sn = Math.sin(P.th), nx = -sn, ny = cs; // 진행 방향과 그 수직
          g.bs.forEach((b, k) => {
            const kk = k / (N - 1) - 0.5; // 위층 -0.5 … 아래층 +0.5
            // 떠날 때는 위층부터, 돌아올 때는 아래층부터
            const u = out ? eIn(clamp((o - (k / N) * 0.3) / 0.7)) : 1 - eOut(clamp((o - ((N - 1 - k) / N) * 0.3) / 0.7));
            const d = u * P.D * R * (1 + kk * 0.35);               // 층마다 조금씩 다른 거리
            const sw = Math.sin(u * Math.PI) * P.bend * R + u * kk * g.fs * 1.4; // 곡선으로 휘고, 층이 부채처럼 벌어져요
            const x = cs * d + nx * sw, y = sn * d + ny * sw;
            b.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) rotate(${(u * P.rot * (0.6 + kk)).toFixed(2)}deg)`;
          });
        } else g.bs.forEach((b) => { if (b.style.transform) b.style.transform = ""; });
        g.a.style.opacity = op < 0.999 ? op.toFixed(3) : "";
        g.a.style.pointerEvents = op < 0.5 ? "none" : "";
      });
    };

    // 캐릭터 (2026-11-22 요청): 글자들이 서 있는 동안 저마다 성격이 있는 것처럼 움직여요.
    // 점(.)은 장난꾸러기 — 다른 글자 위로 뛰어올라 앉았다 내려와요. Y·P는 제자리에서 뛰거나 몇 걸음 걷고, 커서나 점 쪽으로 몸을 기울여 쳐다봐요.
    // STUDIO는 무거워서 작게 뛰거나 몸을 떨어요. 점이 날면 다른 글자들이 고개(기울기)로 따라가고, 점이 내려앉은 글자는 살짝 눌려요.
    const CH = as.map((a) => ({ el: $(".sl-g", a), x: 0, y: 0, base: 0, sx: 1, sy: 1, rot: 0, act: null, q: [], imp: 0, on: -1, look: 0, lookT: 0, mode: "home", tx: 0, ty: 0, gp: 0, dirx: 0 }));
    const DOT = ST.findIndex((pg) => pg.glyph === "."), WORD = ST.findIndex((pg) => (pg.glyph || "").length > 1);
    let nextAt = 0;
    const hop = (c, x1, y1, h, dur, t0) => ({ k: "hop", t0, dur, x0: c.x, y0: c.base, x1, y1, h });
    const later = (c, t, x1, y1, h, dur) => { const last = c.q.length ? c.q[c.q.length - 1] : c.act; const t0 = last ? last.t0 + last.dur + 40 : t; c.q.push(hop({ x: last ? last.x1 : c.x, base: last ? last.y1 : c.base }, x1, y1, h, dur, t0)); };
    const pick = (t) => {
      const fs0 = geo[0] ? geo[0].fs : 100, r = Math.random();
      const who = r < 0.34 ? DOT : r < 0.66 ? 0 : r < 0.86 ? 1 : WORD;
      const c = CH[who]; if (!c || c.act || c.q.length || c.mode !== "home") return;
      if (who === DOT) {
        if (c.on >= 0 && Math.random() < 0.55) { later(c, t, 0, 0, fs0 * 0.45, 820); c.on = -1; return; } // 집으로
        const tg = [0, 1, WORD].filter((j) => j !== c.on && geo[j] && CH[j].mode === "home")[Math.floor(Math.random() * 2.999)];
        if (tg == null || !geo[tg] || !geo[DOT]) return;
        const gt = geo[tg], dx = gt.x0 + CH[tg].x + (Math.random() - 0.5) * gt.hw * (tg === WORD ? 1.4 : 0.6) - geo[DOT].x0;
        later(c, t, dx, -gt.fs * 0.73, fs0 * (0.5 + Math.random() * 0.25), 900 + Math.abs(dx) / fs0 * 120); c.on = tg; c.tgt = tg;
        if (Math.random() < 0.35) later(c, t, dx, -gt.fs * 0.73, fs0 * 0.12, 380); // 올라가서 한 번 더 통통
        return;
      }
      if (CH[DOT] && CH[DOT].on === who) { if (who === WORD) c.shake = t; else c.lookT = t + 1500; return; } // 점이 올라앉아 있으면 뛰지 않고 몸만
      if (who === WORD) {
        if (Math.random() < 0.55) later(c, t, 0, 0, fs0 * 0.09, 620); else { c.shake = t; }
        return;
      }
      if (who === 0 && Math.random() < 0.5) { // Y: 화면 왼쪽을 천천히 돌아다니다가 돌아와요
        const g = geo[0]; if (!g) return;
        const away = Math.abs(c.x) > g.fs * 0.3;
        c.mode = "wander"; c.ty = 0;
        c.tx = away && Math.random() < 0.55 ? 0 : Math.max(-g.x0 + g.hw + 16, Math.min(g.fs * 0.2, -g.fs * (0.4 + Math.random() * 2.4)));
        return;
      }
      const m = Math.random();
      if (m < 0.35) later(c, t, c.x, 0, fs0 * (0.18 + Math.random() * 0.12), 700); // 제자리 뛰기
      else if (m < 0.7) { // 몇 걸음 걷기 (작은 뜀 2~3번), 집에서 너무 멀어지면 돌아와요
        const dir = Math.abs(c.x) > fs0 * 0.08 ? -Math.sign(c.x) : Math.random() < 0.5 ? -1 : 1, n = 2 + (Math.random() < 0.5 ? 1 : 0);
        let x = c.x; for (let i = 0; i < n; i++) { x = Math.max(-fs0 * 0.14, Math.min(fs0 * 0.14, x + dir * fs0 * 0.05)); later(c, t, x, 0, fs0 * 0.05, 300); }
      } else { c.lookT = t + 1500; } // 쳐다보기
    };
    const pose = (c, t) => { // 진행 중인 뜀의 자세: 웅크림 → 날기(늘어남) → 착지(눌림)
      const a = c.act, p = clamp((t - a.t0) / a.dur);
      let sx = 1, sy = 1, x = a.x0, y = a.y0;
      if (p < 0.22) { const w = Math.sin((Math.PI * p) / 0.22); sy = 1 - 0.13 * w; sx = 1 + 0.07 * w; }
      else if (p < 0.8) { const q = (p - 0.22) / 0.58, w = Math.sin(Math.PI * q); x = a.x0 + (a.x1 - a.x0) * eOut(q); y = a.y0 + (a.y1 - a.y0) * q - a.h * 4 * q * (1 - q); sy = 1 + 0.08 * w; sx = 1 - 0.05 * w; }
      else { const w = Math.sin((Math.PI * (p - 0.8)) / 0.2); x = a.x1; y = a.y1; sy = 1 - 0.11 * w; sx = 1 + 0.06 * w; }
      c.x = x; c.y = y; c.sx = sx; c.sy = sy;
      return p >= 1;
    };
    // 잡기 (2026-11-22 요청): 누른 자리가 축이 되어 커서에 매달려요. 커서가 움직이면 그 가속도로 흔들리고, 아래쪽을 잡으면 뒤집혀 매달려요
    const GV = 2600;
    const grab = (j, px0, py0) => {
      const c = CH[j]; if (!c) return;
      const el = c.el, pt = el.style.transform; el.style.transform = "none"; const r = el.getBoundingClientRect(); el.style.transform = pt;
      const w = r.width, h = r.height, px = Math.max(0, Math.min(w, px0 - (r.left + c.x))), py = Math.max(0, Math.min(h, py0 - (r.top + c.y)));
      const rx = w / 2 - px, ry = h * 0.55 - py;
      c.act = null; c.q = []; c.on = -1; c.mode = "held";
      c.hold = { px, py, L: r.left, T: r.top, rx, ry, I: rx * rx + ry * ry + (w * w + h * h) / 12, mx: px0, my: py0, vx: 0, vy: 0, ax: 0, ay: 0 };
      c.th = (c.rot * Math.PI) / 180; c.w = 0; c.rot = 0; c.sx = c.sy = 1; c.heldT = performance.now(); c.maxW = 0;
      el.style.transformOrigin = px.toFixed(1) + "px " + py.toFixed(1) + "px";
      nav.classList.add("holding");
      CH.forEach((o, k) => { if (k !== j && o.on === j) { o.on = -1; o.mode = "back"; o.tx = 0; o.ty = 0; } }); // 위에 앉아 있던 점은 떨어져 나가요
    };
    const letGo = (j) => {
      const c = CH[j]; if (!c || c.mode !== "held") return;
      c.mode = "drop"; c.vx = Math.max(-1500, Math.min(1500, c.hold.vx)); c.vy = Math.max(-1500, Math.min(1500, c.hold.vy)); c.bn = 0;
      nav.classList.remove("holding");
    };
    const physics = (c, j, dt) => {
      const P = c.hold, g = geo[j];
      if (c.mode === "held") {
        const vx = (mx - P.mx) / Math.max(dt, 0.008), vy = (my - P.my) / Math.max(dt, 0.008);
        P.ax += (Math.max(-9000, Math.min(9000, (vx - P.vx) / Math.max(dt, 0.008))) - P.ax) * 0.35;
        P.ay += (Math.max(-9000, Math.min(9000, (vy - P.vy) / Math.max(dt, 0.008))) - P.ay) * 0.35;
        P.vx = vx; P.vy = vy; P.mx = mx; P.my = my;
        c.x = mx - (P.L + P.px); c.y = c.base = my - (P.T + P.py);
        const cs = Math.cos(c.th), sn = Math.sin(c.th), rxr = P.rx * cs - P.ry * sn, ryr = P.rx * sn + P.ry * cs;
        c.w += ((rxr * (GV - P.ay) + ryr * P.ax) / P.I) * dt; // 중력과 커서 가속도가 만드는 돌림힘
        const kick = Math.max(0, 1 - (performance.now() - c.heldT) / 1800); c.w += Math.sin(performance.now() / 70) * 9 * kick * dt; // 버둥대다 체념
        c.w *= Math.exp(-1.3 * dt); c.w = Math.max(-25, Math.min(25, c.w)); c.th += c.w * dt; c.maxW = Math.max(c.maxW || 0, Math.abs(c.w));
        return;
      }
      // 떨어지기: 던진 속도 그대로 + 중력, 몸은 바로 서려 하고, 바닥(원래 줄)에 닿으면 통통
      c.vy += GV * dt; c.vx *= Math.exp(-0.6 * dt);
      c.x += c.vx * dt; c.y += c.vy * dt;
      if (g) { const lo = -g.x0 + g.hw + 8, hi = innerWidth - g.x0 - g.hw - 8; if (c.x < lo) { c.x = lo; c.vx = Math.abs(c.vx) * 0.5; } if (c.x > hi) { c.x = hi; c.vx = -Math.abs(c.vx) * 0.5; } }
      c.w += (-c.th * 40 - c.w * 7) * dt; c.th += c.w * dt;
      if (c.y >= 0 && c.vy > 0) {
        c.y = 0; c.imp = 1; c.bn++;
        if (c.bn < 3 && c.vy > 260) { c.vy = -c.vy * 0.32; c.vx *= 0.6; }
        else { const n = performance.now(); c.th = 0; c.w = 0; c.base = 0; c.el.style.transformOrigin = ""; c.mode = "back"; c.tx = 0; c.ty = 0; c.dirx = 0;
          if ((c.maxW || 0) > 6) { c.dizzy = n + 2200; c.wait = n + 2200; } else { c.shake = n + 150; c.wait = n + 900; c.huff = n; } } // 어지러우면 비틀비틀, 아니면 투덜대며 몸을 털고 출발
      }
      c.base = c.y;
    };

    // 도망칠 곳: 화면 안 임의의 점 네 개 중 커서에서 가장 먼 곳 (한 번에 화면 폭의 45%까지만)
    const fleeTo = (c, g) => { // 수평선 위에서만: 커서 반대쪽으로 화면 폭의 15–40% 달려가요. 벽에 막히면 돌아서요
      const vw = innerWidth, m = 16, cx = g.x0 + c.x, lo = -g.x0 + g.hw + m, hi = vw - g.x0 - g.hw - m;
      let dir = mx > -1e3 ? (cx >= mx ? 1 : -1) : Math.random() < 0.5 ? -1 : 1;
      let tx = c.x + dir * vw * (0.15 + Math.random() * 0.25);
      if (tx < lo || tx > hi) { tx = Math.max(lo, Math.min(hi, tx)); if (Math.abs(tx - c.x) < vw * 0.08) tx = Math.max(lo, Math.min(hi, c.x - dir * vw * (0.15 + Math.random() * 0.2))); }
      c.tx = tx; c.ty = 0;
    };
    const actors = (t, dt, calm) => {
      if (REDUCED) return true;
      if (busy) { CH.forEach((c) => { if (c.act || c.q.length || c.x || c.base || c.y) { c.act = null; c.q = []; c.x = c.y = c.base = 0; c.on = -1; c.mode = "home"; c.el.style.transform = ""; c.el.style.transformOrigin = ""; } }); nextAt = t + 1200; return true; }
      // 흥분: 입력이 들어오면 모두 도망, 1.1초 조용하면 진정하고 집으로
      CH.forEach((c, j) => {
        if (c.mode === "held" || c.mode === "drop") return;
        if (!calm && c.mode !== "run" && geo[j]) { c.mode = "run"; c.act = null; c.q = []; c.on = -1; c.lookT = 0; fleeTo(c, geo[j]); c.gp = Math.random() * 6; c.wait = t + Math.random() * 260; }
        else if (calm && c.mode === "run") { c.mode = "back"; c.tx = 0; c.ty = 0; c.wait = t + Math.random() * 400; }
      });
      let rest = true;
      CH.forEach((c, j) => {
        const g = geo[j]; if (!g || c.mode === "home") return;
        if (c.mode !== "wander") rest = false;
        if (c.mode === "held" || c.mode === "drop") { physics(c, j, dt); return; }
        const run = c.mode === "run", vmax = run ? (j === WORD ? 260 : 340) : c.mode === "back" ? 300 : 120, acc = run ? 950 : 650;
        if (t < (c.wait || 0)) { if (c.dizzy > t || c.huff > t - 900) { c.vx = 0; c.ax = 0; return; } c.crouch = Math.min(1, (c.crouch || 0) + dt * 6); c.vx = 0; c.ax = 0; c.tdir = Math.sign(c.tx - c.x); return; } // 출발 전: 반대쪽으로 웅크려요
        c.crouch = Math.max(0, (c.crouch || 0) - dt * 7);
        { // 늘 바닥(수평선)으로 — 다른 글자와 겹치려 하면 그 위로 뛰어넘어요
          let lift = 0; const cx = g.x0 + c.x; if (j !== WORD) // STUDIO는 무거워서 뛰어넘지 않고, 작은 글자들이 STUDIO 위로 올라타 넘어가요
          CH.forEach((o, k) => { const go = geo[k]; if (k === j || !go || o.mode === "held" || o.mode === "drop") return;
            const d = Math.abs(cx - (go.x0 + o.x)), span = g.hw + go.hw; if (d >= span) return;
            const hgt = (k === DOT ? 0.2 : 0.78) * go.fs; lift = Math.max(lift, hgt * Math.min(1, ((span - d) / (span * 0.35)))); });
          c.base += (-lift - c.base) * Math.min(1, dt * (lift > -c.base ? 14 : 9));
        }
        const dx = c.tx - c.x, dist = Math.abs(dx);
        if (dist < 1.5 && Math.abs(c.vx || 0) < 25) {
          c.x = c.tx; c.vx = 0; c.ax = 0; c.base = 0;
          if (run) { fleeTo(c, g); c.wait = t + 150 + Math.random() * 500; } // 아직 흥분 중이면 잠깐 두리번 → 다른 곳으로
          else { const wasBack = c.mode === "back"; if (c.mode === "wander") c.lookT = t + 1200; c.mode = "home"; if (!c.tx && !c.ty) c.x = c.base = 0;
            if (wasBack) { const fz = g.fs; later(c, t + 120, c.x, 0, fz * (j === WORD ? 0.06 : 0.12), 420); later(c, t, c.x, 0, fz * (j === WORD ? 0.04 : 0.08), 340); } } // 집에 오면 기뻐서 통통
          return;
        }
        const vt = Math.sign(dx) * Math.min(vmax, Math.sqrt(2 * acc * 0.9 * dist)); // 목표 속도: 가까워질수록 줄어요(제동)
        const v0 = c.vx || 0, dv = Math.max(-acc * dt, Math.min(acc * dt, vt - v0));
        c.vx = v0 + dv; c.ax += (dv / Math.max(dt, 0.008) - (c.ax || 0)) * 0.25;
        c.x += c.vx * dt;
        if ((c.tx - c.x) * dx < 0) { c.x = c.tx; c.vx = 0; } // 지나치지 않게
        c.dirx = c.vx / 340;
        c.gp += (Math.abs(c.vx) * dt) / (g.fs * (run ? 0.1 : 0.13)); // 보폭: 빨리 달릴수록 걸음이 빨라져요
      });
      if (calm && t > nextAt) { pick(t); nextAt = t + 900 + Math.random() * 1900; }
      const dotC = CH[DOT], dotG = geo[DOT], dotAir = dotC && dotC.act && dotC.act.t0 <= t;
      const HJ = CH.findIndex((c) => c.mode === "held");
      // 감정: 졸음(9초 넘게 아무 입력 없으면 서서히 꾸벅) → 깨면 깜짝 / 커서가 빠르게 스치면 깜짝 놀라 물러섬 / 천천히 다가오면 궁금해 까치발
      msp *= Math.exp(-dt * 5);
      const sleep = clamp((t - Math.max(last, lastIn) - 9000) / 2500);
      if (slp > 0.5 && sleep < 0.05) CH.forEach((c, j) => { if (c.mode === "home" && !c.act && !c.q.length) { later(c, t + j * 110, c.x, 0, g0(j).fs * 0.17, 520); c.trem = t + j * 110; } });
      slp = sleep;
      CH.forEach((c, j) => {
        if (c.mode === "held" || c.mode === "drop") {
          c.imp *= 0.88; const kick = c.mode === "held" ? Math.max(0, 1 - (t - (c.heldT || 0)) / 1800) : 0; const sq = (c.mode === "drop" ? 1 - 0.1 * c.imp : 1) + Math.sin(t / 45) * 0.05 * kick;
          c.el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) rotate(${c.th.toFixed(4)}rad) scale(${(2 - sq).toFixed(3)}, ${sq.toFixed(3)})`;
          return;
        }
        if (!c.act && c.q.length && c.q[0].t0 <= t) c.act = c.q.shift();
        if (c.act && c.act.t0 <= t) {
          if (pose(c, t)) { c.base = c.act.y1; c.x = c.act.x1; c.y = c.base; c.sx = c.sy = 1; if (j === DOT && c.on >= 0 && CH[c.on]) CH[c.on].imp = 1; c.act = null; }
        } else if (c.mode !== "home") { // 종종걸음: 발을 디딜 때마다 살짝 눌리고, 가는 쪽으로 몸을 기울이며 좌우로 흔들려요
          const ab = Math.abs(Math.sin(c.gp)), sp = Math.min(1, Math.abs(c.vx || 0) / 300), cr = c.crouch || 0;
          c.y = c.base - ab * g0(j).fs * 0.065 * sp; c.sy = 1 - 0.07 * (1 - ab) * sp - 0.12 * cr; c.sx = 1 + 0.04 * (1 - ab) * sp + 0.07 * cr;
        } else {
          c.sx += (1 - c.sx) * 0.2; c.sy += (1 - c.sy) * 0.2; c.y = c.base;
          const gq = g0(j), cx = (gq.x0 || 0) + c.x, cy = (gq.by || 0) - gq.fs * 0.4 + c.base, dm = mx > -1e3 ? Math.hypot(mx - cx, my - cy) : 1e9;
          if (c.mode === "home" && !c.act && !c.q.length && dm < gq.fs * 1.1 && msp > 1300 && t > (c.fearT || 0) + 1400) { // 깜짝: 움찔하며 한 발 물러서요
            c.fearT = t; c.trem = t; const away = Math.sign(cx - mx) || 1;
            later(c, t, Math.max(-gq.fs * 0.2, Math.min(gq.fs * 0.2, c.x + away * gq.fs * 0.09)), c.base, gq.fs * 0.1, 360);
          }
          const want = c.mode === "home" && dm < gq.fs * 2.4 && msp < 260 && sleep < 0.3 ? 1 : 0; c.cur = (c.cur || 0) + (want - (c.cur || 0)) * 0.06; // 궁금함
          c.bp = (c.bp || j * 1.7) + dt * ((Math.PI * 2) / (1.25 + j * 0.17)) * (1 - 0.45 * sleep); // 숨: 잠들면 느리고 깊게
          const br = Math.sin(c.bp), amp = (j === WORD ? 0.007 : 0.013) * (1 + sleep * 1.3);
          c.sy *= 1 + amp * br + 0.035 * c.cur - 0.035 * sleep; c.sx *= 1 - amp * 0.5 * br - 0.012 * c.cur;
        }
        // 쳐다보기: 점이 날고 있으면 점 쪽으로, 아니면 쳐다보기 중일 때 커서 쪽으로 (바닥을 축으로 기울어요)
        const g = geo[j]; let want = 0;
        if (g && j !== DOT && dotAir && dotG) want = Math.max(-7, Math.min(7, ((dotG.x0 + dotC.x - g.x0) / g.fs) * 5));
        else if (g && t < c.lookT && mx > -1e3) want = Math.max(-9, Math.min(9, ((mx - g.x0) / g.fs) * 6));
        if (HJ >= 0 && j !== HJ && g && geo[HJ]) want = Math.max(-8, Math.min(8, ((geo[HJ].x0 + CH[HJ].x - g.x0) / g.fs) * 5));
        if (c.mode !== "home") want = Math.max(-16, Math.min(16, ((c.vx || 0) / 340) * 9 + ((c.ax || 0) / 950) * 6 + Math.sin(c.gp * 2) * 1.5 * Math.min(1, Math.abs(c.vx || 0) / 300) - (c.crouch || 0) * (c.tdir || 0) * 5));
        if (c.shake && t - c.shake > 0 && t - c.shake < 700) want += Math.sin((t - c.shake) / 28) * (c.huff && t - c.huff < 1500 ? 3.2 : 1.6) * (1 - (t - c.shake) / 700);
        if (g && (c.cur || 0) > 0.02 && mx > -1e3) want += Math.max(-11, Math.min(11, ((mx - g.x0 - c.x) / g.fs) * 8)) * c.cur; // 궁금하면 커서 쪽으로 몸을 내밀어요
        if (c.trem && t - c.trem > 0 && t - c.trem < 900) want += Math.sin((t - c.trem) / 22) * 2.2 * (1 - (t - c.trem) / 900); // 놀라서 부들부들
        if (c.mode === "home") want += slp * ((j % 2 ? 4 : -3.5) + Math.sin(t / 1700 + j) * 1.5); // 졸면 고개를 꾸벅
        if (c.dizzy > t) want = Math.sin(t / 150 + j) * 8 * Math.min(1, (c.dizzy - t) / 1200); // 어지러워 비틀비틀
        if (HJ >= 0 && j !== HJ) want += Math.sin(t / 26 + j * 2) * 0.9; // 친구가 잡혀 있으면 불안해서 떨어요
        if (j === WORD) want *= 0.4; // STUDIO는 넓어서 조금만 기울어요
        c.rot += (want - c.rot) * (c.mode !== "home" ? 0.18 : 0.08);
        c.imp *= 0.88; // 점이 앉으면 살짝 눌렸다 펴져요
        const sy = c.sy * (1 - 0.07 * c.imp), sx = c.sx * (1 + 0.035 * c.imp);
        const tf = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0) rotate(${c.rot.toFixed(2)}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
        if (c.el.style.transform !== tf) c.el.style.transform = tf;
      });
      return rest;
    };
    const g0 = (j) => geo[j] || { fs: 100 };
    let slp = 0;

    let prev = 0;
    const tick = (t) => {
      if (busy || !D.body.contains(tr)) return;
      const dt = Math.min(0.05, (t - (prev || t)) / 1000); prev = t;
      if (!D.hidden) {
        const rest = actors(t, dt, !down && t - lastIn > 1100), idle = t - last > 2500;
        geo.forEach((g, j) => {
          const cx = g.x0, A = g.fs * 0.16, sg = g.fs * 0.14, dxm = mx - cx, near = Math.exp(-Math.max(0, Math.abs(dxm) - g.hw + g.fs * 0.3) / (g.fs * 0.9)), dir = dxm > 0 ? -1 : 1;
          g.sl.forEach((o, k) => {
            const dy = o.y - my;
            let to = REDUCED || !rest ? 0 : dir * A * Math.exp(-(dy * dy) / (2 * sg * sg)) * near; // 서 있을 때만 커서를 피해 밀려요
            if (idle && rest && !REDUCED) to += g.fs * 0.018 * Math.sin(t / 900 - k * 0.11 - j * 1.1); // 가만히 있으면 잔물결
            o.cur += (to - o.cur) * 0.12;
            o.el.style.translate = `${o.cur.toFixed(2)}px 0`;
          });
        });
      }
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);

    // 누르기: 다른 글자는 층이 흩어지며 떨어지고, 누른 글자에서 단어가 써진 뒤 사라지고 이동 (contact는 연락 패널)
    nav.addEventListener("click", (e) => {
      const a = e.target.closest(".sl-a"); if (!a) return;
      if (moved) { e.preventDefault(); return; }
      const isC = a.hasAttribute("data-contact"), pg = ST[+a.dataset.i] || {};
      if (isC && REDUCED) return;
      e.preventDefault(); if (busy) return;
      if (a.getAttribute("href") === "works.html") ss.set("yp-hi", "1");
      if (REDUCED) return location.assign(a.href);
      busy = true; tg = ph = Math.round(ph); draw(0); CH.forEach((c) => { c.act = null; c.q = []; c.x = c.y = c.base = 0; c.on = -1; c.mode = "home"; c.el.style.transform = ""; }); HTML.classList.add("sl-go"); a.classList.add("on");
      geo.forEach((g) => g.sl.forEach((o) => { o.el.style.translate = ""; o.cur = 0; }));
      const A = [];
      as.forEach((o) => { if (o === a) return;
        $$(".st-b", o).forEach((b) => A.push(b.animate([{ translate: "0 0", rotate: "0deg", opacity: 1 }, { translate: `${(Math.random() - 0.5) * 0.3}em ${0.5 + Math.random() * 0.8}em`, rotate: `${(Math.random() - 0.5) * 14}deg`, opacity: 0 }], { duration: 700 + Math.random() * 300, delay: Math.random() * 220, easing: "cubic-bezier(0.55, 0, 0.75, 0.3)", fill: "forwards" })));
      });
      $$(".sl-t", nav).forEach((t) => A.push(t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: "forwards" })));
      setTimeout(() => stSpell(a, pg).then(() => {
        if (!isC) { ss.set("yp-st", JSON.stringify({ t: Date.now(), k: "blank" })); return location.assign(a.href); }
        A.forEach((x) => x.cancel()); HTML.classList.remove("sl-go"); a.classList.remove("on"); const g0 = $(".st-gl", a); if (g0) g0.style.visibility = "";
        const btn = $(".hdr [data-contact]") || $("[data-contact]:not(.sl-a)"); if (btn) btn.click();
        busy = false; prev = 0; requestAnimationFrame(tick);
        $$(".st-b", a).forEach((x, k) => x.animate([{ translate: "0 0.14em", opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: 900, delay: 400 + (N - 1 - k) * 20, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }));
      }), 380);
    });
  };
  // 예전 카드형 첫 화면 (2026-11-22까지) — 쓰지 않아요
  render.homeCards = () => {
    HTML.classList.add("st-home");
    const ST = SITE.start || [];
    $("#main").innerHTML = `
      <h1 class="sr">${esc(SITE.name)} — ${esc(SITE.owner)} Architecture Portfolio</h1>
      <nav class="mn st-mn open" aria-label="Start"><canvas class="st-bg" aria-hidden="true"></canvas>${ST.map((pg, i) => `<a class="mn-card" href="${esc(pg.href)}"${pg.contact ? " data-contact" : ""} data-i="${i}" aria-label="${esc(pg.title)}"><div class="mn-pg">${miniHtml(pg)}</div></a>`).join("")}</nav>`;
    const m = $(".st-mn"), cards = $$(".mn-card", m);
    let off = 0, hov = -1, busy = false;
    // 카드 위 이름(대문자, 메뉴와 같은 크기) — 카드와 같은 칸 왼쪽에 붙어 함께 움직여요
    const caps = cards.map((c, i) => { const t = D.createElement("span"); t.className = "st-cap"; t.setAttribute("aria-hidden", "true"); t.textContent = (ST[i] || {}).title || ""; m.appendChild(t); return t; });
    // 2026-11-22 벤치마킹 배치: 카드 한 장 = 상단바 한 칸 폭, 칸 시작선에 맞춰 놓고(넷째 장은 화면 밖으로 이어짐), 화면 위 40%쯤은 비워요
    const stGeo = () => {
      const vw = innerWidth, vh = innerHeight, mob = vw <= 760, cs = getComputedStyle(HTML);
      const e = parseFloat(cs.getPropertyValue("--g4-e")) || 16, gap = 8;
      const W = mob ? vw * 0.62 : vw * 0.28125 - gap, step = W + gap, y = Math.round(vh * (mob ? 0.34 : 0.4)), hgt = vh - y - e, sc = hgt / vh;
      return { vw, vh, sc, W, step, x0: e, y, R: Math.max(0, vw - W / sc), e };
    };
    const range = (g) => [Math.min(0, g.vw - g.e - (g.x0 + (cards.length - 1) * g.step + g.W)), 0];
    const mnGeo = stGeo; // 아래 끌기·휠·키보드 코드도 같은 배치를 써요
    const place = () => {
      const g = stGeo();
      m.style.setProperty("--stw", g.W / g.sc + "px");
      cards.forEach((c, i) => {
        const x = g.x0 + i * g.step + off;
        c.style.width = g.vw + "px"; c.style.height = g.vh + "px";
        c.style.transform = `translate(${x}px, ${g.y}px) scale(${g.sc})`;
        c.style.clipPath = `inset(0px ${g.R}px 0px 0px)`;
        caps[i].style.transform = `translate(${x}px, ${g.y}px)`;
      });
    };
    place();
    // 들어올 때: 카드가 오른쪽에서 차례로 미끄러져 들어와요 (메뉴 열림과 같은 움직임)
    if (!REDUCED) [...cards, ...caps].forEach((c, k) => { const i = k % cards.length; c.animate([{ translate: "0 28px", opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: 1100, delay: 150 + i * 90 + (k >= cards.length ? 120 : 0), easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }); });
    if (false) cards.forEach((c, i) => c.animate([{ translate: "160px 0", opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: 1000, delay: 200 + i * 110, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }));
    // 2026-11-22 벤치마킹: 바탕 재질(stConcrete · stPlaster)은 쓰지 않아요 — 평평한 연회색
    // 2026-11-22 "훨씬 심플하게": 네모 모듈 모션아트(stArt)는 쓰지 않아요 — 캔버스를 지우고 가는 글자 하나 + 작은 이름만
    $$(".mn-card", m).forEach((c, i) => {
      const pg = ST[+c.dataset.i] || {}, cv = $(".mn-art", c); if (cv) cv.remove();
      // 2026-11-22: 카드 속은 글자 하나 — 가로 층(슬래브)으로 쪼개 아래층부터 쌓여요
      if (!pg.glyph) return;
      const L = stGlyph(pg.glyph); c.appendChild(L);
      if (!REDUCED) $$(".st-b", L).forEach((b, k, all) => b.animate([{ translate: "0 0.12em", opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: 1100, delay: 420 + +c.dataset.i * 110 + (all.length - 1 - k) * 28, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "backwards" }));
    });

    m.addEventListener("pointerover", (e) => { const c = e.target.closest(".mn-card"); const i = c ? +c.dataset.i : -1; if (i !== hov && !busy) { hov = i; place(); } });
    m.addEventListener("pointerleave", () => { hov = -1; if (!busy) place(); });
    m.addEventListener("wheel", (e) => { e.preventDefault(); if (busy) return; const [lo, hi] = range(mnGeo()); off = clamp(off - (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY), lo, hi); place(); }, { passive: false });
    let down = null, moved = false;
    m.addEventListener("pointerdown", (e) => { if (!e.button) { down = { x: e.clientX, o: off, id: e.pointerId }; moved = false; } });
    m.addEventListener("pointermove", (e) => {
      if (!down) return; const dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) > 5) { moved = true; m.setPointerCapture(down.id); m.classList.add("drag"); }
      if (moved) { const [lo, hi] = range(mnGeo()); off = clamp(down.o + dx, lo, hi); place(); }
    });
    const up = () => { down = null; m.classList.remove("drag"); setTimeout(() => (moved = false), 0); };
    m.addEventListener("pointerup", up); m.addEventListener("pointercancel", up);
    addEventListener("keydown", (e) => {
      if (!/^Arrow(Left|Right)$/.test(e.key) || !$("#menu").hidden) return;
      const k = cards.indexOf(D.activeElement), n = clamp((k < 0 ? 0 : k) + (e.key === "ArrowRight" ? 1 : -1), 0, cards.length - 1);
      e.preventDefault(); cards[n].focus({ preventScroll: true }); const [lo, hi] = range(mnGeo()); off = clamp(-n * mnGeo().step, lo, hi); place();
    });
    addEventListener("resize", place);
    // 카드 누르기: 화면 전체로 커진 다음 이동 (contact는 연락 패널)
    m.addEventListener("click", (e) => {
      const c = e.target.closest(".mn-card"); if (!c) return;
      if (moved || busy) { e.preventDefault(); e.stopPropagation(); return; }
      const isC = c.hasAttribute("data-contact");
      if (isC && REDUCED) return; // 움직임 줄이기: 주소 #contact로 패널만 열려요
      e.preventDefault(); e.stopPropagation();
      if (c.getAttribute("href") === "works.html") ss.set("yp-hi", "1");
      const A = []; // contact는 패널을 연 뒤 첫 화면을 되돌려야 해서 움직임을 모아 둬요
      const go2 = isC ? () => {
        A.forEach((a) => a.cancel()); c.classList.remove("solid", "st-on"); c.style.zIndex = ""; busy = false;
        const g0 = $(".st-gl", c); if (g0) g0.style.visibility = "";
        const b = $(".hdr [data-contact]") || $("[data-contact]:not(.mn-card)"); if (b) b.click();
      } : () => location.assign(c.href);
      if (REDUCED) return go2();
      busy = true; c.style.zIndex = 2; c.classList.add("solid", "st-on"); // 커지면서 불투명한 흰 종이로 → 다음 페이지와 그대로 이어져요
      // 2026-11-22 넘김 모션: 다른 카드와 이름은 차례로 가라앉고, 누른 카드의 사진은 커지는 동안 살짝 확대됐다 제자리로
      cards.forEach((o, k) => { if (o !== c) A[A.length] = o.animate([{ translate: "0 0", opacity: 1 }, { translate: "0 60px", opacity: 0 }], { duration: 650, delay: Math.abs(k - +c.dataset.i) * 50, easing: EASE_IO, fill: "forwards" }); });
      $$(".st-cap", m).forEach((t) => A.push(t.animate([{ opacity: 1 }, { opacity: 0, translate: "0 -10px" }], { duration: 400, easing: "ease-out", fill: "forwards" })));
      const studio = false; // 2026-11-22: 네 카드 모두 같은 글자 넘김
      const cv = c.querySelector(".mn-art"), word = (ST[+c.dataset.i] || {}).title;
      const gA = c.animate([{ transform: c.style.transform, clipPath: c.style.clipPath }, FULL], { duration: 900, easing: EASE_IO, fill: "forwards" }); A.push(gA);
      const grow = gA.finished.catch(() => {});
      // 글자 모듈 → 단어: P 조각들이 왼쪽으로 밀리며 philosophy 철자가 이어서 완성돼요. 다음 페이지가 같은 자리에서 이어받아요
      const spell = cv && cv._mods && word ? new Promise((res) => { const src = cv._mods(); cv._hide(); TX.leave(word, src, studio, res); }) : Promise.resolve();
      Promise.all([grow, spell]).then(() => stSpell(c, ST[+c.dataset.i] || {})).then(() => {
        if (!isC) ss.set("yp-st", JSON.stringify({ t: Date.now(), k: "blank" })); // 흰 화면으로 끝나요 → 다음 페이지가 흰 막을 걷으며 시작
        go2();
      });
    }, true);
  };
  // ---------- 카드 → 페이지 넘김 (2026-11-22): 글자 모듈이 단어로 이어지고, 다음 페이지에서 흩어져요 ----------
  const TX = {
    FONT: "Helvetica, Arial, sans-serif", // 두 페이지에서 똑같은 모양이 나오게 시스템 글꼴로
    box(top) {
      const vw = innerWidth, vh = innerHeight, e = parseFloat(getComputedStyle(HTML).getPropertyValue("--g4-e")) || 16, hd = hdrH();
      if (top) { const h = Math.min(vh * 0.15, 160); return [e, hd + vh * 0.03, vw - 2 * e, h]; } // studio: 사진 줄 위
      const h = Math.min(vh * 0.3, vw * 0.2, 300); return [e, (vh - h) / 2, vw - 2 * e, h];
    },
    layout(word, top) {
      const [bx, by, bw, bh] = this.box(top), vw = Math.ceil(innerWidth), vh = Math.ceil(innerHeight);
      const o = D.createElement("canvas"); o.width = vw; o.height = vh; const og = o.getContext("2d", { willReadFrequently: true });
      og.font = `700 100px ${this.FONT}`; const m = og.measureText(word);
      const asc = m.actualBoundingBoxAscent || 74, desc = m.actualBoundingBoxDescent || 22, fs = Math.min((100 * bw) / m.width, (100 * bh) / (asc + desc));
      og.font = `700 ${fs}px ${this.FONT}`; og.textBaseline = "alphabetic"; og.fillStyle = "#000";
      og.fillText(word, bx, by + (bh - ((asc + desc) * fs) / 100) / 2 + (asc * fs) / 100);
      const C = Math.max(4, Math.round(fs / 19)), d = og.getImageData(0, 0, vw, vh).data, out = [];
      for (let y = by - C * 2; y < by + bh + C * 2; y += C) for (let x = bx; x < bx + bw + C; x += C) {
        const cx = (x + C / 2) | 0, cy = (y + C / 2) | 0;
        if (cx >= 0 && cy >= 0 && cx < vw && cy < vh && d[(cy * vw + cx) * 4 + 3] >= 140) out.push({ x: x + C / 2, y: y + C / 2 });
      }
      return { mods: out, C };
    },
    canvas() {
      const cv = D.createElement("canvas"), dpr = Math.min(2, devicePixelRatio || 1);
      cv.className = "tx-cv"; cv.setAttribute("aria-hidden", "true"); BODY.appendChild(cv);
      cv.width = innerWidth * dpr; cv.height = innerHeight * dpr; const g = cv.getContext("2d"); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      return [cv, g];
    },
    col(v, f) { return getComputedStyle(HTML).getPropertyValue(v).trim() || f; },
    ez: (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2),
    // 떠나기: 카드의 글자 모듈(src, 화면 좌표)이 단어 첫 글자 자리로 밀려가고, 나머지 글자가 왼쪽부터 차례로 생겨요
    leave(word, src, top, done, keep) {
      const L = this.layout(word, top), T = L.mods.slice().sort((a, b) => a.x - b.x || a.y - b.y), S = src.slice().sort((a, b) => a.x - b.x || a.y - b.y);
      const n = Math.min(S.length, T.length), x0 = T[0] ? T[0].x : 0, x1 = T.length ? T[T.length - 1].x : 1, xn = T[Math.max(0, n - 1)] ? T[Math.max(0, n - 1)].x : x0;
      const P = T.map((t, i) => i < n ? { f: S[i], t, d: (i / n) * 0.18, k: 0 } : { f: null, t, d: 0.5 + ((t.x - xn) / Math.max(1, x1 - xn)) * 0.75, k: 1 });
      const extra = S.slice(n).map((f, i) => ({ f, t: T[(i * 7) % Math.max(1, T.length)] || f, d: 0, k: 2 })); // 남는 조각은 단어 속으로 스며들며 사라져요
      const all = P.concat(extra), [cv, g] = this.canvas(), ink = this.col("--ink", "#111"), sz = L.C - 1, t0 = performance.now(), END = 1.75;
      const frame = (now) => {
        const t = (now - t0) / 1000; g.clearRect(0, 0, innerWidth, innerHeight); g.fillStyle = ink;
        for (const p of all) {
          if (p.k === 1) { // 새 글자: 왼쪽 이웃에서 밀려 나오듯 미끄러져 들어와요
            const q = this.ez((t - p.d) / 0.5); if (q <= 0) continue;
            const s = sz * (0.4 + 0.6 * q); g.globalAlpha = q; g.fillRect(p.t.x - (1 - q) * L.C * 5 - s / 2, p.t.y - s / 2, s, s); continue;
          }
          const q = this.ez((t - p.d) / 0.95), x = p.f.x + (p.t.x - p.f.x) * q, y = p.f.y + (p.t.y - p.f.y) * q, s = p.f.s + (sz - p.f.s) * q, r = (p.f.r || 0) * (1 - q);
          g.globalAlpha = p.k === 2 ? 1 - q : 1;
          if (r > 0.01) { g.save(); g.translate(x, y); g.rotate(r); g.fillRect(-s / 2, -s / 2, s, s); g.restore(); } else g.fillRect(x - s / 2, y - s / 2, s, s);
        }
        g.globalAlpha = 1;
        if (t < END) requestAnimationFrame(frame); else { if (!keep) { /* 페이지가 바뀔 때까지 마지막 장면 유지 */ } done({ L, cvg: [cv, g] }); }
      };
      requestAnimationFrame(frame);
    },
    // 도착: 떠난 페이지의 마지막 장면(흰 바탕 + 단어)을 그대로 그린 뒤, 단어가 왼쪽부터 위로 흩어지며 페이지가 드러나요
    arrive() {
      let st = null; try { st = JSON.parse(ss.get("yp-tx") || "null"); } catch (e) {}
      if (!st) return; ss.del("yp-tx");
      if (Date.now() - st.t > 6000 || REDUCED || !st.word) return;
      this.dissolve(this.layout(st.word, st.top), st.bg);
    },
    // 흩어지기: 단어 모듈이 왼쪽부터 위로 날아가며 사라져요 (bg면 흰 종이도 함께 걷혀요)
    dissolve(L, withBg, done, cvg) {
      const [cv, g] = cvg || this.canvas(), ink = this.col("--ink", "#111"), bg = this.col("--bg", "#fff"), sz = L.C - 1, t0 = performance.now(), st = { bg: withBg };
      const W = innerWidth, H = innerHeight, x0 = L.mods.length ? Math.min(...L.mods.map((m) => m.x)) : 0, x1 = L.mods.length ? Math.max(...L.mods.map((m) => m.x)) : 1;
      L.mods.forEach((m) => { const h = Math.sin(m.x * 12.9898 + m.y * 78.233) * 43758.5453; m.d = 0.12 + ((m.x - x0) / Math.max(1, x1 - x0)) * 0.45 + (h - Math.floor(h)) * 0.15; });
      const frame = (now) => {
        const t = (now - t0) / 1000; g.clearRect(0, 0, W, H);
        if (st.bg) { g.globalAlpha = 1 - this.ez((t - 0.35) / 0.7); g.fillStyle = bg; g.fillRect(0, 0, W, H); }
        g.fillStyle = ink; let live = false;
        for (const m of L.mods) {
          const q = this.ez((t - m.d) / 0.75); if (q < 1) live = true; if (q >= 1) continue;
          const s = sz * (1 - q * 0.6); g.globalAlpha = 1 - q;
          g.save(); g.translate(m.x, m.y - q * H * 0.22); g.rotate(q * Math.PI / 4); g.fillRect(-s / 2, -s / 2, s, s); g.restore();
        }
        g.globalAlpha = 1;
        if (live || t < 1.1) requestAnimationFrame(frame); else { cv.remove(); if (done) done(); }
      };
      requestAnimationFrame(frame);
    },
  };
  // 첫 화면 배경: 큰 회색 모듈 몇 개가 아주 천천히 떠다녀요. 반투명 카드 너머로 흐릿하게 비쳐 재질이 느껴지게
  function stBg(cv) {
    if (!cv) return;
    const g = cv.getContext("2d"); let W = 0, H = 0, raf = 0, col = "#ccc", hi = "#fff";
    const B = Array.from({ length: 9 }, (_, i) => { const h = Math.sin(i * 91.7) * 43758.5453, r = h - Math.floor(h); return { x: (i * 0.137 + r * 0.3) % 1, y: (r * 0.83 + i * 0.29) % 1, s: 0.08 + r * 0.16, v: 0.006 + r * 0.01, a: r * 6.28, k: i % 3 }; });
    const size = () => { const dpr = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * dpr; cv.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const frame = (now) => {
      raf = 0; const t = now / 1000; g.clearRect(0, 0, W, H);
      for (const b of B) {
        const x = ((b.x + t * b.v) % 1.2 - 0.1) * W, y = (b.y + Math.sin(t * 0.2 + b.a) * 0.04) * H, s = b.s * Math.min(W, H) * 1.6;
        g.save(); g.translate(x, y); g.rotate(Math.sin(t * 0.1 + b.a) * 0.15);
        g.globalAlpha = b.k ? 0.35 : 0.6; g.fillStyle = b.k === 2 ? hi : col; g.fillRect(-s / 2, -s / 2, s, s); g.restore();
      }
      if (!REDUCED && !D.hidden) raf = requestAnimationFrame(frame);
    };
    const paint = () => { const dk = HTML.dataset.mode === "dark"; col = dk ? "#262626" : "#bdbdbd"; hi = dk ? "#141414" : "#ffffff"; if (!raf) raf = requestAnimationFrame(frame); }; // 다크: 밝은 판 대신 아주 옅은 회색
    addEventListener("resize", size); D.addEventListener("visibilitychange", paint); D.addEventListener("yp:theme", paint);
    size(); paint();
  }
  // ---------- 첫 화면 → 페이지 도착 (2026-11-22): 바탕색 막이 위로 걷히고, 본문이 살짝 아래에서 올라와요 ----------
  // 카드 글자 → 단어: 가운데 글자 뒤로 한 자씩 써지며 단어 전체가 늘 가운데에 오도록 앞 글자가 왼쪽으로 밀려요. 다 쓰면 층이 들려 사라져요
  function stSpell(c, pg) {
    const g0 = $(".st-gl", c); if (!g0 || !pg.glyph) return Promise.resolve();
    const t = pg.title || "", word = pg.word || (pg.glyph === "@" ? "@" + t : pg.glyph + t.slice(1));
    const b = g0.getBoundingClientRect(), fsz = parseFloat(getComputedStyle(g0).fontSize), vw = innerWidth;
    const e = parseFloat(getComputedStyle(HTML).getPropertyValue("--g4-e")) || 16;
    const W = D.createElement("div"); W.className = "st-wd"; W.setAttribute("aria-hidden", "true");
    W.style.cssText = `top:${b.top}px;height:${b.height}px;font-size:${fsz}px`;
    const Ls = (word.startsWith(pg.glyph) ? [pg.glyph, ...word.slice(pg.glyph.length)] : [...word]).map((ch) => { const L = stGlyph(ch); L.classList.add("st-wl"); W.appendChild(L); return L; });
    BODY.appendChild(W);
    const ws = Ls.map((L) => L.offsetWidth), at = (i) => { // i번째 글자까지 보일 때 단어 자리: 가운데 정렬, 넘치면 줄여요
      const w = ws.slice(0, i + 1).reduce((a, x) => a + x, 0), k = Math.min(1, (vw - 2 * e) / w);
      return `translate(${vw / 2 - (w * k) / 2}px, ${innerHeight / 2 - (b.top + b.height / 2)}px) scale(${k})`;
    };
    W.style.transition = "none"; W.style.transform = `translate(${b.left}px, 0px) scale(1)`; g0.style.visibility = "hidden";
    Ls.forEach((L, i) => { if (i) $$(".st-b", L).forEach((x) => (x.style.opacity = 0)); });
    void W.offsetWidth; W.style.transition = ""; W.style.transform = at(0);
    const STEP = 75, SOFT = "cubic-bezier(0.16, 1, 0.3, 1)";
    return new Promise((done) => {
      Ls.forEach((L, i) => { if (!i) return; setTimeout(() => {
        W.style.transform = at(i);
        $$(".st-b", L).forEach((x, k, all) => x.animate([{ translate: "0 0.14em", opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: 620, delay: (all.length - 1 - k) * 8, easing: SOFT, fill: "forwards" }));
      }, 120 + i * STEP); });
      const T = 120 + (Ls.length - 1) * STEP + 620 + 260; // 다 쓰고 잠깐 머문 뒤
      setTimeout(() => {
        const out = []; Ls.forEach((L, i) => $$(".st-b", L).forEach((x, k) => out.push(x.animate([{ translate: "0 0", opacity: 1 }, { translate: "0 -0.22em", opacity: 0 }], { duration: 640, delay: i * 30 + k * 10, easing: "cubic-bezier(0.76, 0, 0.24, 1)", fill: "forwards" }).finished)));
        Promise.all(out).catch(() => {}).then(() => { W.remove(); done(); });
      }, T);
    });
  }
  // 글자 하나를 N장의 가로 층으로: 층마다 같은 글자를 겹쳐 놓고 그 높이만 보이게 잘라요(clip-path)
  function stGlyph(g, n = 24) {
    const L = D.createElement("div"); L.className = "st-gl"; L.dataset.g = g; L.setAttribute("aria-hidden", "true");
    let h = `<span class="st-g0">${esc(g)}</span>`;
    for (let k = 0; k < n; k++) h += `<span class="st-b" style="--k:${k};clip-path:inset(${k ? (k * 100) / n - 0.25 : -30}% -60% ${k < n - 1 ? 100 - ((k + 1) * 100) / n - 0.25 : -30}% -60%)"><i>${esc(g)}</i></span>`;
    L.innerHTML = h; return L;
  }
  function stArrive() {
    let st = null; try { st = JSON.parse(ss.get("yp-st") || "null"); } catch (e) {}
    ss.set("yp-st", ""); if (!st || Date.now() - st.t > 6000 || REDUCED) return;
    const FLOW = "cubic-bezier(0.76, 0, 0.24, 1)", SOFT = "cubic-bezier(0.16, 1, 0.3, 1)";
    let lift = 0;
    if (st.k === "blank") { // 앞 페이지가 흰 화면으로 끝났어요 → 흰 막이 위로 걷히며 본문이 떠올라요
      const v = D.createElement("div"); v.className = "st-veil st-flow st-flow-g"; BODY.appendChild(v); lift = 160;
      v.animate([{ clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)" }], { duration: 950, delay: 60, easing: FLOW, fill: "forwards" }).finished.catch(() => {}).then(() => v.remove());
    } else if (st.k === "glyph" && st.g && st.fs) {
      const v = D.createElement("div"); v.className = "st-veil st-flow st-flow-g"; const L = stGlyph(st.g);
      L.style.cssText = `left:${st.x}px;top:${st.y}px;bottom:auto;font-size:${st.fs}px`; v.appendChild(L); BODY.appendChild(v); lift = 520;
      $$(".st-b", L).forEach((b, k) => b.animate([{ translate: "0 0", opacity: 1 }, { translate: "0 -0.25em", opacity: 0 }], { duration: 800, delay: 120 + k * 24, easing: FLOW, fill: "forwards" }));
      v.animate([{ clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)" }], { duration: 1000, delay: 520, easing: FLOW, fill: "forwards" }).finished.catch(() => {}).then(() => v.remove());
    } else if (st.k === "img" && st.src) {
      // 앞 페이지 마지막 장면(화면 가득한 그림)으로 시작 → 그림은 위로 걷히고, 그림 속 내용은 반대로 조금 덜 움직여(시차) 물 흐르듯 빠져요
      const v = D.createElement("div"); v.className = "st-veil st-flow"; v.innerHTML = `<img src="${esc(st.src)}" alt="">`; BODY.appendChild(v);
      const img = $("img", v); lift = 380;
      v.animate([{ clipPath: "inset(0 0 0% 0)" }, { clipPath: "inset(0 0 100% 0)" }], { duration: 1250, delay: 220, easing: FLOW, fill: "forwards" }).finished.catch(() => {}).then(() => v.remove());
      img.animate([{ transform: "translateY(0) scale(1)" }, { transform: "translateY(-22%) scale(1.06)" }], { duration: 1250, delay: 220, easing: FLOW, fill: "forwards" });
    }
    // 본문: 큰 덩어리(섹션·머리글)를 차례로 아래에서 떠오르게 해요
    const main = $("#main"); if (!main) return;
    let parts = [...main.children].filter((e) => e.offsetHeight > 0 && e.getBoundingClientRect().top < innerHeight * 1.2);
    if (parts.length === 1) parts = [...parts[0].children].filter((e) => e.offsetHeight > 0 && e.getBoundingClientRect().top < innerHeight * 1.2);
    (parts.length ? parts.slice(0, 8) : [main]).forEach((e, i) => e.animate([{ translate: "0 70px", opacity: 0 }, { translate: "0 0", opacity: 1 }], { duration: 1300, delay: lift + i * 90, easing: SOFT, fill: "backwards" }));
  }

  // ---------- 첫 화면 카드 재질: 고운 회반죽 결 (2026-11-22) ----------
  // 작은 타일(256px)에 아주 옅은 입자와 결을 그려 카드 바탕에 반복해 깔아요(--plas). 무채색만
  function stPlaster(m) {
    const N = 256, c = D.createElement("canvas"); c.width = c.height = N; const g = c.getContext("2d"), id = g.createImageData(N, N), d = id.data;
    let seed = 11; const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    for (let i = 0; i < d.length; i += 4) { const v = rnd() < 0.5 ? 0 : 255; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = Math.round(rnd() * 9); }
    g.putImageData(id, 0, 0);
    for (let k = 0; k < 40; k++) { const x = rnd() * N, y = rnd() * N, w = 20 + rnd() * 70; g.strokeStyle = "rgba(0,0,0," + (0.008 + rnd() * 0.012) + ")"; g.lineWidth = 0.6; g.beginPath(); g.moveTo(x, y); g.quadraticCurveTo(x + w / 2, y + (rnd() - 0.5) * 8, x + w, y + (rnd() - 0.5) * 4); g.stroke(); } // 흙손 자국
    m.style.setProperty("--plas", "url(" + c.toDataURL("image/png") + ")");
  }

  // ---------- 첫 화면 바탕: 노출콘크리트 (2026-11-22) ----------
  // 거푸집 한 판(1800×900을 화면에 맞춘 크기)마다 줄눈 · 폼타이 구멍 6개 · 판마다 조금 다른 농도, 그 위에 큰 얼룩과 고운 입자, 작은 기포.
  // 무채색만 써요. 다크 모드면 어두운 콘크리트로 다시 그려요. 결과는 그림 한 장(--conc)으로 바탕에 깔려요.
  function stConcrete(m) {
    let seed = 7;
    const rnd = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
    const draw = () => {
      seed = 7;
      const W = Math.min(2400, Math.ceil(innerWidth)), H = Math.min(1600, Math.ceil(innerHeight)), dk = HTML.dataset.mode === "dark";
      const c = D.createElement("canvas"); c.width = W; c.height = H; const g = c.getContext("2d");
      const base = dk ? 30 : 226, sh = (v) => "rgb(" + v + "," + v + "," + v + ")";
      g.fillStyle = sh(base); g.fillRect(0, 0, W, H);
      // 거푸집 판: 폭은 화면 폭을 4.5판쯤, 높이는 폭의 절반
      const pw = Math.max(560, Math.round(W / 1.7)), ph = Math.round(pw / 2), offY = Math.round((H % ph) / 2) - ph;
      for (let y = offY, row = 0; y < H; y += ph, row++) for (let x = (row % 2 ? -pw / 2 : 0) - pw / 4; x < W; x += pw) { // 판마다 농도 ±
        const k = (rnd() - 0.5) * (dk ? 6 : 7); g.fillStyle = k > 0 ? "rgba(255,255,255," + k / 255 * 2.2 + ")" : "rgba(0,0,0," + -k / 255 * 2.2 + ")"; g.fillRect(x, y, pw, ph);
      }
      // 큰 얼룩(물 자국 · 레이턴스)
      for (let i = 0; i < 90; i++) {
        const x = rnd() * W, y = rnd() * H, rr = 60 + rnd() * 300, a = 0.008 + rnd() * 0.022, dark = rnd() < 0.5;
        const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, dark ? "rgba(0,0,0," + a + ")" : "rgba(255,255,255," + a * 1.2 + ")"); gr.addColorStop(1, "rgba(0,0,0,0)");
        g.fillStyle = gr; g.fillRect(x - rr, y - rr, rr * 2, rr * 2);
      }
      // 세로 흘러내린 자국 몇 줄
      for (let i = 0; i < 14; i++) { const x = rnd() * W, y = rnd() * H * 0.6, h = 80 + rnd() * 300, w = 2 + rnd() * 10, gr = g.createLinearGradient(0, y, 0, y + h); gr.addColorStop(0, "rgba(0,0,0," + (0.01 + rnd() * 0.018) + ")"); gr.addColorStop(1, "rgba(0,0,0,0)"); g.fillStyle = gr; g.fillRect(x, y, w, h); }
      // 고운 입자 (픽셀마다 ±)
      const id = g.getImageData(0, 0, W, H), d = id.data;
      for (let i = 0; i < d.length; i += 4) { const n = (rnd() - 0.5) * (dk ? 7 : 9) + (rnd() < 0.002 ? -(8 + rnd() * 14) : 0); d[i] = d[i + 1] = d[i + 2] = Math.max(0, Math.min(255, d[i] + n)); }
      g.putImageData(id, 0, 0);
      // 기포(작은 구멍)
      for (let i = 0; i < W * H / 9000; i++) { const x = rnd() * W, y = rnd() * H, rr = 0.5 + rnd() * 1.2; g.fillStyle = "rgba(0,0,0," + (0.08 + rnd() * 0.12) + ")"; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); g.fillStyle = "rgba(255,255,255,0.25)"; g.beginPath(); g.arc(x + rr * 0.5, y + rr * 0.5, rr * 0.6, 0, 7); g.fill(); }
      // 줄눈 + 폼타이 구멍
      for (let y = offY, row = 0; y < H + ph; y += ph, row++) {
        g.fillStyle = "rgba(0,0,0," + (dk ? 0.3 : 0.07) + ")"; g.fillRect(0, y, W, 1); g.fillStyle = "rgba(255,255,255," + (dk ? 0.05 : 0.35) + ")"; g.fillRect(0, y + 1, W, 1);
        for (let x = (row % 2 ? -pw / 2 : 0) - pw / 4; x < W + pw; x += pw) {
          g.fillStyle = "rgba(0,0,0," + (dk ? 0.26 : 0.06) + ")"; g.fillRect(x, y, 1, ph); g.fillStyle = "rgba(255,255,255," + (dk ? 0.04 : 0.3) + ")"; g.fillRect(x + 1, y, 1, ph);
          for (const fx of [1 / 4, 3 / 4]) for (const fy of [1 / 4, 3 / 4]) {
            const cx = x + pw * fx, cy = y + ph * fy, R = Math.max(3, pw / 150);
            const gr = g.createRadialGradient(cx - R * 0.25, cy - R * 0.25, 0, cx, cy, R * 1.6); gr.addColorStop(0, "rgba(0,0,0," + (dk ? 0.45 : 0.22) + ")"); gr.addColorStop(0.55, "rgba(0,0,0," + (dk ? 0.22 : 0.09) + ")"); gr.addColorStop(1, "rgba(0,0,0,0)");
            g.fillStyle = gr; g.beginPath(); g.arc(cx, cy, R * 1.6, 0, 7); g.fill();
            g.strokeStyle = "rgba(255,255,255," + (dk ? 0.06 : 0.4) + ")"; g.lineWidth = 1; g.beginPath(); g.arc(cx, cy, R * 1.05, 0.1 * Math.PI, 0.75 * Math.PI); g.stroke(); // 아래쪽 밝은 테
          }
        }
      }
      // 전체를 바탕색으로 한 겹 덮어 어렴풋하게 — "오, 노출콘크리트 같다" 정도만
      g.globalAlpha = dk ? 0.4 : 0.55; g.fillStyle = sh(base); g.fillRect(0, 0, W, H); g.globalAlpha = 1;
      m.style.setProperty("--conc", "url(" + c.toDataURL("image/jpeg", 0.86) + ")");
    };
    let tm = 0; const later = () => { clearTimeout(tm); tm = setTimeout(draw, 250); };
    draw(); addEventListener("resize", later); D.addEventListener("yp:theme", draw);
  }

  // 글자 모듈 모션아트 v3 (2026-11-22 "훨씬 디테일, 더 강렬하고 극적으로")
  //  · 모듈: 더 촘촘하게(짧은 변의 1/46). 가장자리 모듈은 테두리 선, 일부는 4조각으로 나뉘고, 농도가 모듈마다 조금씩 달라요
  //  · 조립(2026-11-22 얌전하게): 아래 줄부터 한 켜씩, 제자리 바로 아래에서 조용히 미끄러져 올라와 앉아요. 앉은 모듈은 옅게 솟아 45° 그림자를 드리워요
  //  · 작도: 모눈 점·십자 표시, 글자 상자 작도선과 모듈 간격 눈금자가 그어져요
  //  · 평소: 6.5초마다 빛 띠 하나가 위에서 아래로 천천히 지나가며 모듈을 살짝 들어 올려요. 아주 가끔 한두 개가 천천히 뒤집혀요
  //  · 마우스: 부드럽게 비켜서며 돌고 조금 솟아 옆면이 보여요. 들어온 자리에서 옅은 물결
  function stArt(card, cv, glyph, delay) {
    const g = cv.getContext("2d");
    let W = 0, H = 0, C = 6, mods = [], dots = [], box = [0, 0, 0, 0], mx = -1e4, my = -1e4, raf = 0, live = true, t0 = performance.now() + delay, sc = 0, rip = null, gone = false;
    let ink = "#111", line = "#ddd", mid = "#888", bgc = "#fff", fam = "sans-serif";
    // 이름표: 카드 순서대로 글자 오른쪽 아래(Y·S) / 왼쪽 아래(P·@)에 아주 작게
    const ci = +(card.dataset.i || 0), label = ((SITE.start || [])[ci] || {}).title || "", right = ci % 2 === 0;
    const hash = (x) => { const h = Math.sin(x) * 43758.5453; return h - Math.floor(h); };
    const build = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      C = Math.max(4, Math.round(Math.min(W, H) / 46));
      const o = D.createElement("canvas"); o.width = W; o.height = H; const og = o.getContext("2d"); fam = getComputedStyle(BODY).fontFamily;
      og.font = `700 100px ${fam}`; const m = og.measureText(glyph), fs = Math.min((100 * W * 0.78) / m.width, H * 1.18);
      og.font = `700 ${fs}px ${fam}`; og.textAlign = "center"; og.textBaseline = "alphabetic"; og.fillStyle = "#000";
      og.fillText(glyph, W / 2, H / 2 + fs * 0.36);
      const d = og.getImageData(0, 0, W, H).data, cols = Math.floor(W / C), rows = Math.floor(H / C), ox = (W - cols * C) / 2, oy = (H - rows * C) / 2;
      const on = new Set(); mods = []; dots = []; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = ox + (i + 0.5) * C, y = oy + (j + 0.5) * C, rn = hash(i * 127.1 + j * 311.7);
        if (d[((y | 0) * W + (x | 0)) * 4 + 3] < 140) { dots.push({ x, y, rn, i, j }); continue; }
        on.add(i + "," + j);
        x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y);
        const r2 = hash(i * 12.9898 + j * 78.233), ang = r2 * Math.PI * 2, far = Math.max(W, H) * (0.75 + rn * 0.7);
        mods.push({ x, y, i, j, rn, r2,
          d: (1 - j / rows) * 1.1 + rn * 0.25, // 아래 줄부터 한 켜씩 쌓여요
          sx: x, sy: y + C * 5, s0: 0.6, r0: 0, bend: 0, far, ang,
          tone: 0.9 + rn * 0.1, quad: r2 < 0.035, ox: 0, oy: 0, r: 0, z: 0, px: x, py: y });
      }
      for (const m of mods) m.edge = !(on.has(m.i - 1 + "," + m.j) && on.has(m.i + 1 + "," + m.j) && on.has(m.i + "," + (m.j - 1)) && on.has(m.i + "," + (m.j + 1)));
      box = [x0 - C * 1.5, y0 - C * 1.5, x1 + C * 1.5, y1 + C * 1.5];
      dots = dots.filter((p) => p.x > box[0] - C * 4 && p.x < box[2] + C * 4 && p.y > box[1] - C * 4 && p.y < box[3] + C * 4);
      kick();
    };
    const ez = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));
    const ex5 = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(2, -10 * x));
    const back = (x) => { if (x <= 0) return 0; if (x >= 1) return 1; const c1 = 1.7, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); };
    const bell = (x) => (x <= 0 || x >= 1 ? 0 : Math.sin(x * Math.PI));
    const ASM = 0.3, FLY = 1.4; // 조립 시작, 모듈 하나가 날아오는 시간
    let land = 0; // 모든 모듈이 박히는 시각(초)
    const frame = (now) => {
      raf = 0; if (!W) return;
      if (gone) { g.clearRect(0, 0, W, H); return; }
      const t = REDUCED ? 99 : (now - t0) / 1000;
      if (!land && mods.length) land = ASM + Math.max(...mods.map((m) => m.d)) + FLY * 0.8;
      g.clearRect(0, 0, W, H);
      // 착지 충격: 흔들림 + 번쩍
      const it = t - land, shock = 0;
      const shx = shock ? Math.sin(it * 70) * C * 0.5 * shock * shock : 0, shy = shock ? Math.cos(it * 55) * C * 0.35 * shock * shock : 0;
      g.save(); g.translate(shx, shy);
      // 0) 도면 시트: 가는 테두리, 아래 표제란 칸 선, 오른쪽 아래 방위 표시 (글자 없음)
      { const sa = REDUCED ? 1 : ez(t / 0.9), mg = C * 1.2;
        if (sa > 0) {
          g.globalAlpha = 0.5 * sa; g.strokeStyle = mid; g.lineWidth = 0.7;
          g.strokeRect(mg + 0.5, mg + 0.5, (W - mg * 2) * sa, H - mg * 2);
          const tb = H - mg - C * 3.2; g.beginPath(); g.moveTo(mg, tb); g.lineTo(mg + (W - mg * 2) * sa, tb);
          for (const f of [0.5, 0.75]) { g.moveTo(mg + (W - mg * 2) * f, tb); g.lineTo(mg + (W - mg * 2) * f, H - mg); } g.stroke();
          const nx = W - mg - C * 1.6, ny = tb - C * 2.2, nr = C * 0.9; g.beginPath(); g.arc(nx, ny, nr, 0, 7); g.moveTo(nx, ny + nr); g.lineTo(nx, ny - nr * 1.6); g.stroke();
          g.fillStyle = mid; g.beginPath(); g.moveTo(nx, ny - nr * 1.6); g.lineTo(nx - nr * 0.35, ny - nr * 0.7); g.lineTo(nx + nr * 0.35, ny - nr * 0.7); g.fill();
          g.globalAlpha = 1;
        } }
      // 1) 모눈 점 · 십자 · 작도선 · 눈금자
      const gp = ez(t / 1.0);
      if (gp > 0) {
        g.fillStyle = mid;
        for (const p of dots) if (p.rn < gp) {
          if (p.i % 4 === 0 && p.j % 4 === 0) { g.globalAlpha = 0.45 * gp; g.fillRect(p.x - 2.5, p.y - 0.4, 5, 0.8); g.fillRect(p.x - 0.4, p.y - 2.5, 0.8, 5); }
          else { g.globalAlpha = 0.25 * gp; g.fillRect(p.x - 0.5, p.y - 0.5, 1, 1); }
        }
        const lp = clamp((t - 0.1) / 1.6, 0, 1), la = REDUCED ? 0.35 : lp < 1 ? Math.max(0.35, Math.sin(lp * Math.PI)) : 0.35;
        const [x0, y0, x1, y1] = box, e = REDUCED ? 1 : ex5(lp * 1.4);
        g.globalAlpha = 0.55 * la; g.strokeStyle = mid; g.lineWidth = 0.6; g.beginPath();
        g.moveTo(0, y0); g.lineTo(W * e, y0); g.moveTo(W, y1); g.lineTo(W - W * e, y1);
        g.moveTo(x0, 0); g.lineTo(x0, H * e); g.moveTo(x1, H); g.lineTo(x1, H - H * e);
        // 눈금자: 글자 상자 위·왼쪽 바깥에 모듈 간격 눈금 (5칸마다 길게)
        const ry = y0 - C * 1.6, rx = x0 - C * 1.6;
        g.moveTo(x0, ry); g.lineTo(x0 + (x1 - x0) * e, ry); g.moveTo(rx, y0); g.lineTo(rx, y0 + (y1 - y0) * e);
        for (let k = 0, X = x0; X <= x0 + (x1 - x0) * e; X += C, k++) { const L = k % 5 ? C * 0.35 : C * 0.8; g.moveTo(X, ry); g.lineTo(X, ry - L); }
        for (let k = 0, Y = y0; Y <= y0 + (y1 - y0) * e; Y += C, k++) { const L = k % 5 ? C * 0.35 : C * 0.8; g.moveTo(rx, Y); g.lineTo(rx - L, Y); }
        g.stroke(); g.globalAlpha = 1;
      }
      // 충격파 고리
      if (shock) {
        const R0 = ex5(it / 1.2) * Math.max(W, H) * 1.1;
        g.strokeStyle = ink; g.globalAlpha = shock * 0.5; g.lineWidth = C * 0.5 * shock; g.beginPath(); g.arc(W / 2, H / 2, R0, 0, Math.PI * 2); g.stroke();
        g.globalAlpha = shock * 0.25; g.lineWidth = 1; g.beginPath(); g.arc(W / 2, H / 2, R0 * 0.72, 0, Math.PI * 2); g.stroke(); g.globalAlpha = 1;
      }
      // 2) 평소 사건 (착지 1.6초 뒤부터 3.6초마다)
      const et = t - land - 1.2, ev = REDUCED || et < 0 ? -1 : 0, u = et < 0 ? 0 : (et % 6.5) / 3.2; // u: 0→1 사건 진행, 1 넘으면 쉼
      const evx = W * (0.3 + hash(Math.floor(et / 3.6) * 9.1) * 0.4), evy = H * (0.35 + hash(Math.floor(et / 3.6) * 3.7) * 0.3);
      // 3) 모듈
      const R = C * 10, rr = rip ? (now - rip.t) / 1000 * Math.max(W, H) * 1.1 : -1;
      if (rip && rr > Math.max(W, H) * 1.6) rip = null;
      const sx = Math.cos(t * 0.5) * 0.6 + 0.8;
      const pass = [];
      for (const m of mods) {
        const raw = REDUCED ? 1 : (t - ASM - m.d) / FLY; if (raw <= 0) continue;
        const p = Math.min(1, raw), pe = ez(p), pp = ex5(p);
        // 마우스 · 물결
        const dx = m.x - mx, dy = m.y - my, dd = Math.hypot(dx, dy) || 1, f = Math.max(0, 1 - dd / R), f2 = f * f;
        let rz = 0; if (rip && rr > 0) { const k = 1 - Math.min(1, Math.abs(Math.hypot(m.x - rip.x, m.y - rip.y) - rr) / (C * 4)); rz = k * 0.5; }
        const tx = (dx / dd) * f2 * C * 1.6, ty = (dy / dd) * f2 * C * 1.6, tr = f2 * Math.PI / 4, tz = Math.max(f * 1.3, rz);
        m.ox += (tx - m.ox) * 0.08; m.oy += (ty - m.oy) * 0.08; m.r += (tr - m.r) * 0.08; m.z += (tz - m.z) * 0.1;
        // 사건별 변형
        let ex = 0, ey = 0, er = 0, ez2 = 0, es = 1, inv = 0, flipE = 1;
        if (ev >= 0 && u < 1.3) {
          if (ev === 0) { // 훑기: 위→아래 띠
            const band = u * 1.3 * (H + C * 20) - C * 10, k = Math.max(0, 1 - Math.abs(m.y - band) / (C * 6));
            ez2 = k * k * 0.9;
          } else if (ev === 1) { // 산산조각
            const k = u < 0.45 ? ez(u / 0.45) : 1 - back((u - 0.45) / 0.6), a = Math.atan2(m.y - evy, m.x - evx), dist = (1 - Math.min(1, Math.hypot(m.x - evx, m.y - evy) / Math.max(W, H))) * C * 9 * (0.5 + m.rn);
            ex = Math.cos(a + m.bend) * dist * k; ey = Math.sin(a + m.bend) * dist * k; er = (m.r2 - 0.5) * Math.PI * 2 * k; ez2 = k * 1.5; es = 1 - k * 0.35;
          } else if (ev === 2) { // 맥동 고리 (반전색)
            const ring = u * Math.max(W, H) * 1.2, k = Math.max(0, 1 - Math.abs(Math.hypot(m.x - evx, m.y - evy) - ring) / (C * 5));
            es = 1 - k * 0.55; inv = k; ez2 = k * 2; er = k * Math.PI / 2;
          } else { // 낙하: 세로줄이 왼쪽부터 차례로 떨어졌다 튀어올라요
            const lu = u * 1.3 - (m.x / W) * 0.55, k = bell(clamp(lu / 0.6, 0, 1));
            ey = k * C * 6 * (0.6 + m.rn * 0.4); er = k * (m.r2 - 0.5) * 1.2; ez2 = k;
          }
        }
        // 날아오는 길: 출발점 → 휘어진 길 → 제자리
        const bx = m.sx + (m.x - m.sx) * pp, by = m.sy + (m.y - m.sy) * pp, nx = -(m.y - m.sy), ny = m.x - m.sx, bn = Math.sin(pp * Math.PI) * m.bend * 0.35;
        const q = sc ? ez((now - sc) / 520 - m.d * 0.5) : 0;
        const fx = bx + nx * bn + m.ox + ex + (q ? (m.x - W / 2) * q * 0.3 : 0), fy = by + ny * bn + m.oy + ey - q * H * 0.6;
        const scl = (m.s0 + (1 - m.s0) * pe) * es * (1 - q * 0.6), rot = m.r0 * (1 - pp) + m.r + er + q * m.r0 * 0.3;
        const pop = 0;
        const E = Math.max(m.z, ez2, 0.4 * Math.min(1, raw));
        m.px = fx; m.py = fy;
        pass.push([m, fx, fy, scl, rot, E, ez(Math.min(1, raw * 1.6)) * (1 - q), inv, flipE, p]);
      }
      // 3-a) 잔상(날아오는 중) + 옆면을 먼저, 3-b) 윗면을 나중에 → 블록이 겹쳐도 입체가 맞아요
      g.fillStyle = mid;
      for (const [m, x, y, scl, rot, E, al, , , p] of pass) {
        const sz = (C - 1) * scl, dz = E * C * 0.5;
        if (false) { // 잔상(뺐어요): 지나온 길 위에 옅은 네모 세 개
          for (let k = 1; k <= 3; k++) { const pb = ex5(Math.max(0, p - k * 0.05)), xx = m.sx + (m.x - m.sx) * pb, yy = m.sy + (m.y - m.sy) * pb; g.globalAlpha = al * (0.16 - k * 0.04); const s2 = sz * (1 - k * 0.15); g.fillRect(xx - s2 / 2, yy - s2 / 2, s2, s2); }
        }
        if (dz > 0.4) { for (let k = 3; k >= 1; k--) { g.globalAlpha = al * 0.16 * (4 - k) / 3 + al * 0.08; g.save(); g.translate(x + dz * k / 3, y + dz * k / 3); g.rotate(rot); g.fillRect(-sz / 2, -sz / 2, sz, sz); g.restore(); } }
      }
      for (const [m, x, y, scl, rot, E, al, inv, flipE] of pass) {
        const sz = (C - 1) * scl, lift = E * C * 0.22;
        const wave = REDUCED ? 0 : Math.sin((m.x * sx + m.y) / (C * 14) - t * 0.9);
        const ft = REDUCED || t < land ? 1 : ((t * 0.05 + m.rn * 29.7) % 60) / 0.9, flip = (ft < 1 ? Math.abs(Math.cos(ft * Math.PI)) : 1) * flipE;
        g.save(); g.translate(x - lift, y - lift); g.rotate(rot); g.scale(Math.abs(flip) < 0.05 ? 0.05 : flip, 1);
        g.globalAlpha = al * m.tone * (0.86 + 0.14 * (wave * 0.5 + 0.5)) * (shock ? 1 - shock * 0.35 * bell(clamp(it / 0.25, 0, 1)) : 1);
        g.fillStyle = inv > 0.5 ? (bgc) : ink;
        if (m.quad && E < 0.6) { const h2 = sz / 2 - 0.5; g.fillRect(-sz / 2, -sz / 2, h2, h2); g.fillRect(0.5, -sz / 2, h2, h2); g.fillRect(-sz / 2, 0.5, h2, h2); g.fillRect(0.5, 0.5, h2, h2); }
        else g.fillRect(-sz / 2, -sz / 2, sz, sz);
        if (inv > 0.5) { g.strokeStyle = ink; g.lineWidth = 1; g.strokeRect(-sz / 2 + 0.5, -sz / 2 + 0.5, sz - 1, sz - 1); }
        // 가장자리 모듈: 안쪽 가는 선 · 빛 받은 윗변
        if (m.edge && sz > 5) { g.globalAlpha *= 0.55; g.strokeStyle = line; g.lineWidth = 0.6; g.strokeRect(-sz / 2 + 1.2, -sz / 2 + 1.2, sz - 2.4, sz - 2.4); }
        if (wave > 0.82 || E > 0.8) { g.globalAlpha = al * Math.max((wave - 0.82) / 0.18, Math.min(1, (E - 0.8) / 1.2)) * 0.6; g.fillStyle = line; g.fillRect(-sz / 2, -sz / 2, sz, Math.max(1, sz * 0.16)); g.fillRect(-sz / 2, -sz / 2, Math.max(1, sz * 0.12), sz); }
        g.restore();
      }
      // 4) 이름표: 착지 뒤 한 글자씩 써져요. 화면에서 --t-xs 크기가 되도록 카드 축소 비율을 되돌려요
      if (label && !sc) {
        const la = REDUCED ? 1 : clamp((t - land - 0.15) / 0.5, 0, 1);
        if (la > 0) {
          const bb = cv.getBoundingClientRect(), k = bb.width && W ? bb.width / W : 1, px = (parseFloat(getComputedStyle(HTML).getPropertyValue("--t-xs")) || 10) / k;
          const n = REDUCED ? label.length : Math.ceil(label.length * clamp((t - land - 0.15) / 0.7, 0, 1)), txt = label.slice(0, n);
          const [x0, , x1, y1] = box, yy = y1 - C * 1.5 + C * 0.5 + px * 1.6, xx = right ? x1 - C * 1.5 + C * 0.5 : x0 + C * 1.5 - C * 0.5;
          g.font = "500 " + px + "px " + fam; g.textBaseline = "alphabetic"; g.textAlign = right ? "right" : "left";
          g.globalAlpha = la; g.fillStyle = ink; g.fillText(txt, xx, yy);
          // 글자 모서리에서 이름표까지 가는 눈금 하나
          g.globalAlpha = la * 0.5; g.fillStyle = mid; g.fillRect(right ? xx - 0.5 : xx, yy - px * 1.5, 1, px * 0.5);
        }
      }
      g.restore(); g.globalAlpha = 1;
      if ((live && !REDUCED) || sc || rip) kick();
    };
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }
    const paint = () => { const cs = getComputedStyle(HTML); ink = cs.getPropertyValue("--ink").trim() || "#111"; line = cs.getPropertyValue("--line").trim() || "#ddd"; mid = cs.getPropertyValue("--mid").trim() || "#888"; bgc = cs.getPropertyValue("--bg").trim() || "#fff"; kick(); };
    const pos = (e) => { const b = cv.getBoundingClientRect(), k = b.width ? cv.clientWidth / b.width : 1; return [(e.clientX - b.left) * k, (e.clientY - b.top) * k]; };
    card.addEventListener("pointermove", (e) => { [mx, my] = pos(e); kick(); });
    card.addEventListener("pointerenter", (e) => { const [x, y] = pos(e); rip = { x, y, t: performance.now() }; kick(); });
    card.addEventListener("pointerleave", () => { mx = my = -1e4; kick(); });
    cv._scatter = () => { sc = performance.now(); kick(); };
    // 넘김용: 지금 보이는(박힌) 모듈의 화면 좌표와 크기
    cv._mods = () => { const b = cv.getBoundingClientRect(), k = b.width / (W || 1), t = (performance.now() - t0) / 1000;
      return mods.filter((m) => REDUCED || t - ASM - m.d > FLY * 0.6).map((m) => ({ x: b.left + m.px * k, y: b.top + m.py * k, s: (C - 1) * k, r: m.r })); };
    cv._hide = () => { gone = true; kick(); };
    cv._show = () => { gone = false; t0 = performance.now(); land = 0; kick(); }; // 다시 조립돼요
    new IntersectionObserver(([e]) => { live = e.isIntersecting && !D.hidden; kick(); }).observe(cv);
    D.addEventListener("visibilitychange", () => { live = !D.hidden; kick(); });
    D.addEventListener("yp:theme", paint);
    new ResizeObserver(() => { land = 0; build(); }).observe(cv);
    paint();
  }


  // ---------- Philosophy (핀 #35): YP.STUDIO 모션 아트 → 설계 철학 문장 → 세 가지 키워드 ----------
  render.philosophy = () => {
    const M = SITE.manifesto, PL = SITE.pillars || [];
    $("#main").innerHTML = `
      <section class="yi" id="intro" data-ind="YP.STUDIO" aria-label="YP.STUDIO">
        <div class="yi-stick">
          <canvas class="yi-cv" aria-hidden="true"></canvas>
          <div class="yi-ui">
            <p class="yi-tl">A-001 <span class="mid">Philosophy</span></p>
            <p class="yi-tr mid num"><span class="yi-xy">X 000.0 · Y 000.0</span></p>
            <p class="yi-bl mid">${esc(SITE.owner)} — Architecture Portfolio</p>
            <button type="button" class="yi-go mid">Scroll <span aria-hidden="true">↓</span></button>
            ${window.CityGame ? `<button type="button" class="yi-play">Play — build a block</button>` : ""}
          </div>
        </div>
      </section>
      <section class="phl g4" data-ind="Philosophy">
        <p class="phl-k mid">Philosophy</p>
        <h1 class="phl-s">${esc(M.en)}</h1>
        <p class="phl-ko mid">${esc(M.ko)}</p>
        <ol class="phl-p">${PL.map((p, i) => `<li data-reveal><span class="num mid">${pad(i + 1)}</span><b>${esc(p.k)}</b><span>${esc(p.en)}</span></li>`).join("")}</ol>
        <p class="phl-nx"><a class="lnk" href="works.html">Works →</a><a class="lnk" href="about.html">About →</a></p>
      </section>`;
    intro();
    lineRise($(".phl-s"));
    { const pb = $(".yi-play"); if (pb) pb.addEventListener("click", () => window.CityGame.open()); } // 핀 #75: 도시 미니게임
  };

  // ---------- v2 Archive (계획 6단계): 홈과 같은 가로 무한 띠(caseStrip)를 써요. 이미지는 높이가 같고 폭은 사진 비율대로 ----------
  render.archive = () => {
    HTML.classList.add("v2-home");
    const A = SITE.archive || {};
    const pg = (SITE.pages || []).find((x) => x.key === "archive") || { title: "archive" };
    const one = (A.items || []).map(([slug, src, ra]) => {
      const p = PROJECTS.find((q) => q.slug === slug && !q.draft);
      return p ? `<a class="cs-card ar-it" href="project.html#${slug}" draggable="false" style="--r:${ra}" aria-label="${esc(p.title)}"><div class="media">${mz(`<img src="${esc(src)}" alt="${esc(p.title)}" loading="lazy" decoding="async">`)}</div><span class="ar-cap">${esc(p.title)}</span></a>` : "";
    }).join("");
    $("#main").innerHTML = `
      <section class="ar-hd g4">
        <h1 class="ar-h">${esc(pg.title)}</h1>
        <p class="ar-note">${(A.lines || []).map(esc).join("<br>")}<span class="num">${esc(A.years || "")}</span></p>
      </section>
      <section class="cs ar" aria-label="Archive images">
        <div class="cs-track">${[0, 1, 2].map((k) => k === 1 ? `<div class="cs-set">${one}</div>` : `<div class="cs-set" aria-hidden="true">${one.replace(/<a /g, '<a tabindex="-1" ')}</div>`).join("")}</div>
      </section>`;
    caseStrip();
  };

  function caseStrip() {
    const sec = $(".cs"), track = $(".cs-track", sec), sets = $$(".cs-set", track);
    let W = 1, x = 0, tx = 0, px = 0, sc = 1, raf = 0, live = true, items = [];
    // 저절로 흐르기 (2026-11-22 요청): 초당 DRIFT px, dir = 마지막으로 굴린 방향, hov = 사진 위에 있으면 멈춤
    const DRIFT = 60; let spd = 0, dir = 1, hov = false, last = 0;
    const still = () => REDUCED || hov || down || HTML.classList.contains("cs-grid") || $("#menu.open") || HTML.classList.contains("hi-on") || HTML.classList.contains("ct-lock");
    const measure = () => {
      W = sets[1].offsetLeft - sets[0].offsetLeft || 1;
      items = $$(".cs-card", track).map((c) => ({ c, img: $(".mz", c), l: c.offsetLeft, w: c.offsetWidth }));
    };
    const wrap = (v) => ((v % W) + W) % W;
    const frame = (now) => {
      raf = 0;
      const dt = last && now ? Math.min(0.05, (now - last) / 1000) : 0; last = now || 0;
      spd += ((still() ? 0 : DRIFT * dir) - spd) * Math.min(1, dt * 2.5); // 부드럽게 출발·정지
      if (Math.abs(spd) > 0.01) tx += spd * dt;
      x += REDUCED ? tx - x : (tx - x) * 0.09;
      const v = x - px; px = x;
      const goal = REDUCED ? 1 : 1 - Math.min(Math.abs(v) / 30, 1) * 0.1;
      sc += (goal - sc) * 0.12;
      const off = -W - wrap(x);
      track.style.transform = `translate3d(${off}px,0,0)`;
      track.style.setProperty("--s", sc.toFixed(4));
      if (!REDUCED) {
        const vw = innerWidth;
        for (const it of items) {
          const cx = it.l + off + it.w / 2;
          if (cx < -it.w || cx > vw + it.w) continue;
          it.img.style.transform = `translate3d(${(((cx - vw / 2) / vw) * -6).toFixed(2)}%,0,0) scale(1.15)`;
        }
      }
      if (live && (!REDUCED || Math.abs(tx - x) > 0.1 || Math.abs(sc - 1) > 0.001)) raf = requestAnimationFrame(frame); else last = 0;
    };
    const kick = () => { if (!raf && live) raf = requestAnimationFrame(frame); };
    // 휠: 세로로 굴려도 옆으로 흘러요(이 화면은 세로 스크롤이 없어요)
    addEventListener("wheel", (e) => {
      if (e.target.closest && e.target.closest(".ct, #menu")) return;
      if (HTML.classList.contains("cs-grid")) return; // 그리드 보기: 세로 스크롤
      e.preventDefault();
      if ($("#menu.open") || HTML.classList.contains("hi-on") || HTML.classList.contains("ct-lock")) return;
      const dv = (Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY) * (e.deltaMode === 1 ? 32 : 1);
      tx += dv; if (Math.abs(dv) > 2) dir = Math.sign(dv);
      kick();
    }, { passive: false });
    // 끌기: 5px 넘게 움직였을 때만 끌기로 보고, 그보다 짧으면 카드 링크가 그대로 눌려요
    let down = null, moved = false;
    sec.addEventListener("pointerover", (e) => { hov = !!(e.target.closest && e.target.closest(".cs-card .media")) && e.pointerType !== "touch"; });
    sec.addEventListener("pointerleave", () => { hov = false; });
    sec.addEventListener("pointerdown", (e) => { if (e.button || HTML.classList.contains("hi-on")) return; down = { x: e.clientX, tx, id: e.pointerId }; moved = false; });
    sec.addEventListener("pointermove", (e) => {
      if (!down) return;
      const dx = e.clientX - down.x;
      if (!moved && Math.abs(dx) > 5) { moved = true; sec.setPointerCapture(down.id); sec.classList.add("drag"); }
      if (moved) { tx = down.tx - dx * 1.4; kick(); }
    });
    const up = () => { if (down && moved) { const d = tx - down.tx; if (Math.abs(d) > 5) dir = Math.sign(d); } down = null; sec.classList.remove("drag"); };
    sec.addEventListener("pointerup", up); sec.addEventListener("pointercancel", up);
    sec.addEventListener("click", (e) => { if (moved) { e.preventDefault(); moved = false; } }, true);
    // 키보드: ← → 로 한 칸씩
    addEventListener("keydown", (e) => {
      if ($("#menu.open") || HTML.classList.contains("hi-on") || HTML.classList.contains("ct-lock") || !/^Arrow(Left|Right)$/.test(e.key)) return;
      tx += (e.key === "ArrowRight" ? 1 : -1) * (items[0] ? items[0].w + 8 : 300); kick();
    });
    // 링크에 탭으로 들어가면 그 카드가 보이게
    sec.addEventListener("focusin", (e) => { const c = e.target.closest(".cs-card"); if (!c || down || !c.matches(":focus-visible")) return; /* 마우스로 누를 때 띠가 움직여 클릭이 빗나가던 문제: 키보드(Tab)로 왔을 때만 맞춰요 */ const it = items.find((q) => q.c === c); if (it) { tx = it.l - sets[1].offsetLeft + W - 16; kick(); } });
    D.addEventListener("visibilitychange", () => { live = !D.hidden; last = 0; kick(); });
    addEventListener("resize", () => { measure(); kick(); });
    measure();
    $$("img", track).forEach((im) => im.complete || im.addEventListener("load", measure, { once: true }));
    sc = 1; frame(); kick();
  }

  render.homeV1 = () => {
    const types = ["All", ...new Set(PROJECTS.map((p) => p.type))];
    wi = 0;
    const hl = SITE.hero.lines.map((l) => `<span>${words(l)}</span>`).join("");
    const M = SITE.manifesto, PL = SITE.pillars;
    const odo = (list) => `<span class="odo num" aria-hidden="true"><span class="odo-col">${list.map((t) => `<i>${t}</i>`).join("")}</span></span>`;
    const keys = (M.keys || []).map((k) => k.toLowerCase());
    const fws = M.en.split(" ").map((w) => `<span class="fw${keys.includes(w.toLowerCase().replace(/[^a-z&]/g, "")) ? " key" : ""}">${esc(w)}</span>`).join(" ");
    const ratio = ["4 / 5", "3 / 4", "5 / 6", "4 / 5.4", "1 / 1.1", "3 / 4"];
    $("#main").innerHTML = `
      <section class="yi" id="intro" data-ind="YP.STUDIO" aria-label="YP.STUDIO">
        <div class="yi-stick">
          <canvas class="yi-cv" aria-hidden="true"></canvas>
          <div class="yi-ui">
            <p class="yi-tl">A-000 <span class="mid">Cover</span></p>
            <p class="yi-tr mid num"><span class="yi-xy">X 000.0 · Y 000.0</span></p>
            <p class="yi-bl mid">${esc(SITE.owner)} — Architecture Portfolio</p>
            <button type="button" class="yi-go mid">Scroll to Works <span aria-hidden="true">↓</span></button>
          </div>
        </div>
      </section>

      <!-- 3D 작품 모형(#top)은 핀 #432로 뺐어요. 원래 마크업은 git 이전 버전에 있어요 -->
      ${reelHtml()}
      <section class="wk" id="works" data-ind="Works">
        <div class="wk-hd g8">
          <h2 class="wk-h">Selected Works <sup class="num">(${pad(N)})</sup></h2>
          <div class="filters" role="group" aria-label="Filter works">${types.map((t, i) => `<button type="button" class="${i ? "" : "on"}" data-f="${t}">${t}<sup class="num">${t === "All" ? N : PROJECTS.filter((p) => p.type === t).length}</sup></button>`).join("")}</div>
          <a class="wk-ix lnk" href="projects.html">Index of works →</a>
        </div>
        <!-- 휴대폰: 긴 목록 전에 9개를 한눈에 고르는 3×3 썸네일 -->
        <nav class="wk-pick" aria-label="Works at a glance">${PROJECTS.map((p, i) => `<a href="project.html#${p.slug}"><div class="media">${mz(card(p, 400, 400))}</div><span class="num mid">${pad(i + 1)}</span><b>${esc(p.title)}</b></a>`).join("")}</nav>
        <div class="wcols"><div class="wcol"></div><div class="wcol"></div><div class="wcol"></div></div>
        <div class="wpool" hidden>${PROJECTS.map((p, i) => `
          <a class="wcard" href="project.html#${p.slug}" data-type="${esc(p.type)}" data-cursor="View" data-reveal="wipe">
            <div class="media" style="aspect-ratio:${ratio[i % ratio.length]}">${mz(card(p, 800, 1100))}<div class="ov"><span>${esc(p.site)}</span><span class="num">${esc(p.area)}</span></div></div>
            <div class="cap"><span class="mid num">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><span class="mid num">${p.year}</span><p>${esc(p.type)} — ${esc(p.titleKo)}</p></div>
          </a>`).join("")}
        </div>
        <div class="more g8" hidden><button type="button" class="lnk">Load more</button></div>
      </section>

      <section class="pr" id="about" data-ind="Profile">
        <div class="wk-hd pr-hd g8"><h2 class="wk-h">Profile</h2></div>
        <div class="pr-body g8">
          <div class="media" data-reveal="wipe">${mz(art(SITE.portrait, "portrait", "me", 900, 1200, null, SITE.owner))}</div>
          <div class="txt">
            <p class="pr-k mid">${esc(SITE.ownerKo || "")} ${esc(SITE.owner)} — ${esc(SITE.role)}</p>
            <dl class="facts" data-reveal>
              <div><dt>Birth</dt><dd class="num">${esc(SITE.birth)}</dd></div>
              <div><dt>Based</dt><dd>${esc(SITE.based)}</dd></div>
              <div><dt>Focus</dt><dd>${esc([...new Set(PROJECTS.map((p) => p.type))].join(", "))}</dd></div>
              <div><dt>Status</dt><dd>${esc(SITE.status)}</dd></div>
              <div><dt>Language</dt><dd>${esc(CV.languages.join(", "))}</dd></div>
            </dl>
            <a class="lnk" href="about.html">Full profile →</a>
          </div>
        </div>
      </section>`;

    scenes();
    intro();
    reel();
    cardFx();
    // worksHandoff(); — 표지와 Works 사이에 이미지 띠(#reel)가 들어와 모듈이 사진 위로 날아가서 꺼 뒀어요(코드는 남김, #440에서 다시)
    profileAxes();

    // 첫 화면 3D
    if ($("#stage")) { const ui = heroUI(); const api = (window.hero3D && window.hero3D($("#stage"), ui)) || window.hero2D($("#stage"), ui); keyPlan(); ui.attach(api); } // 핀 #432: 모형을 뺐으면 건너뛰어요

    // 작품: 3열로 나눠 담고(열마다 다른 속도로 흐름), 필터 + 더보기
    let filter = "All", shown = 9;
    const more = $("#works .more"), cols = $$(".wcol"), cards = $$(".wpool .wcard");
    const apply = () => {
      let n = 0;
      const ncol = innerWidth <= 760 ? 1 : 3;
      cards.forEach((c) => {
        const ok = filter === "All" || c.dataset.type === filter;
        const vis = ok && n < shown;
        if (ok) n++;
        c.classList.toggle("off", !vis);
        if (vis) cols[(n - 1) % ncol].appendChild(c);
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
    let wasNarrow = innerWidth <= 760;
    addEventListener("resize", () => { const nw = innerWidth <= 760; if (nw !== wasNarrow) { wasNarrow = nw; apply(); } });
    apply();

    // 다른 페이지에서 #섹션 링크로 들어온 경우
    if (location.hash && location.hash.length > 1) setTimeout(() => scrollToEl(location.hash, true), 60);
  };

  // ---------- 스크롤 장면들 ----------
  // 고정된 화면(position: sticky) 안에서 스크롤 진행률로 장면을 넘겨요.
  // 폭 760px 이하와 동작 줄이기 설정에서는 일반 목록으로 펼쳐져요.
  // ---------- 첫 화면: YP.STUDIO 모션 아트 (설계 순서 그대로) ----------
  // 1 구조 그리드(통심선·번호)가 그어지고 → 2 글자가 평면(모듈 칸)으로 놓이고 →
  // 3 화면이 기울며 매스 모형으로 솟아올라요. 마우스는 해: 그림자와 면의 밝기가 따라 움직이고,
  // 가까운 매스는 조금 더 솟아요. 클릭하면 매스 높이 계획이 바뀌고, 스크롤하면 다시 평면으로 눌려요.
  // 작품 카드 사진 위 모션: 사진 속 날씨와 사람을 이어서 움직여요 (핀 #384–386)
  // 좌표는 원본 사진에 대한 비율(0–1). walk: 사람이 걷는 바닥 띠 [y, x0, x1, 사람 키]
  // 핀 #437: 대표사진에 마우스를 올리면 사용자가 만든 대표 영상이 자연스럽게 겹쳐 재생돼요 (원본: portfolio-source/대표사진 영상/)
  const CARD_FX = {
    "re-tide/card-frame.jpg": { video: "assets/img/re-tide/card-loop.mp4" },
    "modular-o-housing/card-frame.jpg": { video: "assets/img/modular-o-housing/card-loop.mp4" },
    "campus-renovation/card-frame.jpg": { video: "assets/img/campus-renovation/card-loop.mp4" },
    "motorism/card-frame.jpg": { video: "assets/img/motorism/card-loop.mp4" },
    "samgakji-residential/card-frame.jpg": { video: "assets/img/samgakji-residential/card-loop.mp4" },
    "timteam-work/card-frame.jpg": { video: "assets/img/timteam-work/card-loop.mp4" },
    "metaverse-church/cover.jpg": { video: "assets/img/metaverse-church/card-loop.mp4" },
  };
  // 프로필: 사진 오른쪽 위 모서리를 원점으로 X·Y 축선이 그려지며 교차해요 (핀 #393)
  function profileAxes() {
    const sec = $("#about"), media = sec && $(".pr-body > .media", sec);
    if (!media) return;
    const ax = document.createElement("div"); ax.className = "pr-axes"; ax.setAttribute("aria-hidden", "true");
    ax.innerHTML = '<i class="pr-ax x"></i><i class="pr-ax y"></i><b class="pr-o"></b><span class="pr-ol num">X 0.000  Y 0.000</span>';
    sec.appendChild(ax);
    const place = () => {
      const r = sec.getBoundingClientRect(), m = media.getBoundingClientRect();
      ax.style.setProperty("--ox", (m.right - r.left).toFixed(1) + "px");
      ax.style.setProperty("--oy", (m.top - r.top).toFixed(1) + "px");
      // 핀 #428: 세로선은 프로필 아래(Contact)를 지나 페이지 끝까지 이어져요
      ax.style.setProperty("--ext", Math.max(0, document.documentElement.scrollHeight - (r.bottom + scrollY)).toFixed(0) + "px");
    };
    place(); addEventListener("resize", place); new ResizeObserver(place).observe(sec);
    // 스크롤에 맞춰 그려져요: 사진 윗변이 화면 아래 85%에 닿으면 시작, 40%에 오면 다 그려짐
    let tick = 0;
    const draw = () => { tick = 0; const m = media.getBoundingClientRect(), vh = innerHeight, k = clamp((vh * 0.85 - m.top) / (vh * 0.45), 0, 1);
      ax.style.setProperty("--ax", k.toFixed(4)); ax.style.setProperty("--ay", clamp(k * 1.15 - 0.15, 0, 1).toFixed(4)); ax.classList.toggle("on", k > 0.92); };
    addEventListener("scroll", () => { if (!tick) tick = requestAnimationFrame(draw); }, { passive: true }); draw();
  }

  // 키 플랜 (핀 #395): 작품 모형이 첫 화면 YP.STUDIO 글자 도시의 'O' 안쪽 한 블록이라는 걸 작은 위치도로 보여요.
  // 화면에 들어오면 글자 전체를 둘러싼 틀이 'O' 안의 한 칸으로 좁혀 들어가요(줌 인).
  function keyPlan() {
    const fig = $(".keyplan"); if (!fig) return;
    const cv = $("canvas", fig), g = cv.getContext("2d");
    let cells = [], spot = null, W = 0, H = 0, t0 = 0, raf = 0;
    const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
    const build = () => {
      const d = Math.min(2, devicePixelRatio || 1); W = cv.clientWidth; H = cv.clientHeight; if (!W) return;
      cv.width = W * d; cv.height = H * d; g.setTransform(d, 0, 0, d, 0, 0);
      const o = document.createElement("canvas"), C = 3, cols = Math.floor(W / C), rows = Math.floor(H / C); o.width = cols; o.height = rows;
      const og = o.getContext("2d"), fam = css("--sans") || "Helvetica, Arial, sans-serif"; og.font = `700 40px ${fam}`;
      const fs = Math.floor((40 * cols * 0.96) / og.measureText("YP.STUDIO").width); og.font = `700 ${fs}px ${fam}`; og.textAlign = "center"; og.textBaseline = "middle"; og.fillText("YP.STUDIO", cols / 2, rows / 2 + 1);
      const px = og.getImageData(0, 0, cols, rows).data; cells = [];
      const on = (i, j) => i >= 0 && j >= 0 && i < cols && j < rows && px[(j * cols + i) * 4 + 3] > 110;
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) if (on(i, j)) cells.push([i * C, j * C]);
      // 'O'의 안뜰: 마지막 글자 가운데, 비어 있는 칸
      let ox = cols - 1; while (ox > 0 && ![...Array(rows).keys()].some((j) => on(ox, j))) ox--;
      let ol = ox; for (let i = ox; i > 0; i--) { if ([...Array(rows).keys()].some((j) => on(i, j))) ol = i; else break; }
      const ci = Math.round((ol + ox) / 2), cj = Math.round(rows / 2);
      spot = { x: ci * C, y: cj * C, C, all: [Math.min(...cells.map((c) => c[0])), Math.min(...cells.map((c) => c[1])), Math.max(...cells.map((c) => c[0])) + C, Math.max(...cells.map((c) => c[1])) + C] };
    };
    const ease = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : 1 - Math.pow(1 - x, 3));
    const draw = (now) => {
      raf = 0; if (!spot) return;
      const t = REDUCED ? 9 : (now - t0) / 1000, ink = css("--ink") || "#111", mid = css("--mid") || "#888";
      g.clearRect(0, 0, W, H);
      g.fillStyle = mid; g.globalAlpha = 0.35; cells.forEach(([x, y]) => g.fillRect(x + 0.4, y + 0.4, spot.C - 0.8, spot.C - 0.8)); g.globalAlpha = 1;
      // 줌 틀: 글자 전체 → 'O' 안 한 칸
      const k = ease((t - 0.3) / 1.4), [a0, b0, a1, b1] = spot.all, sz = spot.C * 2.2;
      const x0 = a0 + (spot.x - sz / 2 - a0) * k, y0 = b0 + (spot.y - sz / 2 - b0) * k, x1 = a1 + (spot.x + sz / 2 - a1) * k, y1 = b1 + (spot.y + sz / 2 - b1) * k;
      g.strokeStyle = ink; g.lineWidth = 0.75; g.setLineDash(k < 1 ? [3, 2] : []); g.strokeRect(x0, y0, x1 - x0, y1 - y0); g.setLineDash([]);
      if (k >= 1) { const p = 0.5 + 0.5 * Math.sin(t * 3); g.fillStyle = ink; g.fillRect(spot.x - spot.C / 2, spot.y - spot.C / 2, spot.C, spot.C);
        g.globalAlpha = 0.5 * (1 - p); g.strokeRect(spot.x - sz / 2 - p * 4, spot.y - sz / 2 - p * 4, sz + p * 8, sz + p * 8); g.globalAlpha = 1;
        g.beginPath(); g.moveTo(spot.x + sz / 2, spot.y - sz / 2); g.lineTo(W - 1, 2); g.stroke(); }
      if (!REDUCED && t < 1.9 || k >= 1) raf = requestAnimationFrame(draw);
    };
    const go = () => { t0 = performance.now(); if (!raf) raf = requestAnimationFrame(draw); };
    build(); new ResizeObserver(() => { const w = W; build(); if (W !== w) go(); }).observe(cv);
    document.addEventListener("yp:theme", () => { if (!raf) raf = requestAnimationFrame(draw); });
    let seen = false;
    new IntersectionObserver(([e]) => { if (e.isIntersecting && !seen) { seen = true; go(); } else if (!e.isIntersecting) { seen = false; cancelAnimationFrame(raf); raf = 0; } }, { threshold: 0.6 }).observe(fig);
  }

  function cardFx() {
    if (REDUCED) return;
    $$(".wcard .media img, .cs-card .media img").forEach((im) => {
      if (im.dataset.fx) return; im.dataset.fx = "1";
      const key = Object.keys(CARD_FX).find((k) => (im.getAttribute("src") || "").includes(k));
      if (!key) return;
      // 실제 영상이 있으면(같은 폴더의 cover-loop.mp4 등, CARD_FX의 video) 마우스를 올렸을 때 영상을 재생해요
      if (CARD_FX[key].video) {
        const mz = im.parentElement, card = mz.closest(".wcard, .cs-card"), v = document.createElement("video");
        Object.assign(v, { muted: true, loop: true, playsInline: true, preload: "none", src: CARD_FX[key].video }); v.className = "cvid"; v.setAttribute("aria-hidden", "true");
        mz.appendChild(v);
        // 핀 #437·#438: 영상은 사진과 같은 비율·같은 장면이라, 사진의 자르기 위치를 그대로 따라가면 겹쳐도 어긋나지 않아요
        const sync = () => { const cs = getComputedStyle(im); v.style.objectPosition = cs.objectPosition; v.style.objectFit = cs.objectFit; v.style.scale = cs.scale; v.style.transformOrigin = cs.transformOrigin; }; // 디자인 조정의 확대(scale)까지 사진과 똑같이 // 확대(hover scale)는 CSS가 사진·영상에 똑같이 줘요
        sync(); addEventListener("resize", sync);
        card.addEventListener("pointerenter", (e) => { if (e.pointerType === "touch") return; v.preload = "auto"; sync(); if (!v.classList.contains("on") && v.paused) try { v.currentTime = 0; } catch (er) {} v.play().then(() => v.classList.add("on")).catch(() => {}); });
        card.addEventListener("pointerleave", () => { v.classList.remove("on"); setTimeout(() => { if (!v.classList.contains("on")) { v.pause(); try { v.currentTime = 0; } catch (er) {} } }, 700); }); // 다음에 올릴 때도 사진과 같은 첫 장면부터
        return;
      }
      const fx = CARD_FX[key], mz = im.parentElement, cv = document.createElement("canvas");
      cv.className = "cfx"; cv.setAttribute("aria-hidden", "true"); mz.appendChild(cv);
      const g = cv.getContext("2d");
      let W = 0, H = 0, map = null, live = false, raf = 0, last = 0, parts = null;
      const size = () => {
        const b = mz.getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
        W = b.width; H = b.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d); g.setTransform(d, 0, 0, d, 0, 0);
        const iw = im.naturalWidth || 1, ih = im.naturalHeight || 1, k = Math.max(W / iw, H / ih), dw = iw * k, dh = ih * k;
        const op = getComputedStyle(im).objectPosition.split(" ").map((v) => (v.endsWith("%") ? parseFloat(v) / 100 : 0.5));
        const ox = (W - dw) * op[0], oy = (H - dh) * (op[1] ?? 0.5);
        map = (x, y) => [ox + x * dw, oy + y * dh]; map.k = dh; // 사진 비율 좌표 → 화면
        if (!parts) init();
      };
      const init = () => {
        parts = { p: [], f: [], b: [], sp: [] };
        for (let n = 0; n < (fx.people || 0); n++) { const L = fx.walk[n % fx.walk.length]; parts.p.push({ umb: Math.random() < (fx.umb || 0), L, x: L[1] + Math.random() * (L[2] - L[1]), dir: Math.random() < 0.5 ? -1 : 1, sp: 0.006 + Math.random() * 0.008, ph: Math.random() * 6.28, h: L[3] * (0.85 + Math.random() * 0.3), wait: 0, shade: Math.random() }); }
        const nf = fx.rain || fx.snow || 0;
        for (let n = 0; n < nf; n++) parts.f.push({ x: Math.random(), y: Math.random(), z: 0.3 + Math.random() * 0.7, ph: Math.random() * 6.28 });
        if (fx.birds) { const [x0, y0, x1, y1, nb] = fx.birds; for (let n = 0; n < nb; n++) parts.b.push({ x: x0 + Math.random() * (x1 - x0), y: y0 + Math.random() * (y1 - y0), ph: Math.random() * 6.28, sp: 0.012 + Math.random() * 0.01 }); }
      };
      const tone = (a) => `rgba(${fx.tone},${fx.tone},${fx.tone + 4},${a})`;
      const frame = (now) => {
        raf = 0; if (!live || !map || (!hov && !stopT)) return;
        const dt = Math.min(0.05, (now - (last || now)) / 1000); last = now;
        g.clearRect(0, 0, W, H);
        // 사람: 엉덩이·무릎·발 관절로 걷고 팔을 반대로 흔들어요. 렌더 속 사람처럼 잔상이 살짝 남아요
        const person = (x, y, h, st, c, umb, coat) => {
          const w = h * 0.24, hip = y - h * 0.5, sh = y - h * 0.8, sw = st * w * 0.55;
          g.fillStyle = c; g.strokeStyle = c; g.lineCap = "round"; g.lineJoin = "round";
          // 다리 (허벅지 → 무릎 → 발), 뒷다리는 조금 밝게
          [[-1, 0.85], [1, 1]].forEach(([sg, a]) => {
            const kx = x + sg * sw * 0.45, ky = y - h * 0.26, fx2 = x + sg * sw, fy = y - (sg * st > 0.6 ? h * 0.015 : 0);
            g.globalAlpha = a * 0.8; g.lineWidth = w * 0.3; g.beginPath(); g.moveTo(x + sg * w * 0.1, hip); g.lineTo(kx, ky); g.stroke();
            g.lineWidth = w * 0.22; g.beginPath(); g.moveTo(kx, ky); g.lineTo(fx2, fy); g.lineTo(fx2 + w * 0.22 * (st >= 0 ? 1 : 1), fy); g.stroke();
          });
          g.globalAlpha = 0.82;
          // 몸통: 둥근 어깨에서 허리로 (외투면 무릎까지)
          const bot = coat ? y - h * 0.3 : hip + h * 0.02, bw = coat ? w * 0.55 : w * 0.42;
          g.beginPath(); g.moveTo(x - w * 0.5, sh + h * 0.03); g.quadraticCurveTo(x - w * 0.52, sh - h * 0.02, x - w * 0.25, sh - h * 0.03);
          g.lineTo(x + w * 0.25, sh - h * 0.03); g.quadraticCurveTo(x + w * 0.52, sh - h * 0.02, x + w * 0.5, sh + h * 0.03);
          g.lineTo(x + bw, bot); g.lineTo(x - bw, bot); g.closePath(); g.fill();
          // 목·머리
          g.fillRect(x - w * 0.09, sh - h * 0.07, w * 0.18, h * 0.05);
          g.beginPath(); g.ellipse(x, sh - h * 0.115, w * 0.27, h * 0.062, 0, 0, 7); g.fill();
          // 팔: 다리와 반대로 흔들어요 (우산을 들면 한 팔은 위로)
          g.lineWidth = w * 0.17;
          g.beginPath(); g.moveTo(x - w * 0.46, sh + h * 0.03); g.quadraticCurveTo(x - w * 0.5 - sw * 0.2, sh + h * 0.17, x - w * 0.45 - sw * 0.45, sh + h * 0.3); g.stroke();
          if (umb) {
            g.beginPath(); g.moveTo(x + w * 0.46, sh + h * 0.03); g.lineTo(x + w * 0.35, sh - h * 0.02); g.stroke();
            g.lineWidth = Math.max(0.5, w * 0.05); g.beginPath(); g.moveTo(x + w * 0.35, sh); g.lineTo(x + w * 0.3, sh - h * 0.36); g.stroke();
            g.beginPath(); g.moveTo(x + w * 0.3 - w * 1.5, sh - h * 0.24); g.quadraticCurveTo(x + w * 0.3, sh - h * 0.52, x + w * 0.3 + w * 1.5, sh - h * 0.24);
            for (let k = 3; k >= -3; k--) g.quadraticCurveTo(x + w * 0.3 + k * w * 0.5 + w * 0.25, sh - h * 0.21, x + w * 0.3 + k * w * 0.5 - w * 0.25 + (k === -3 ? 0 : 0), sh - h * 0.24);
            g.closePath(); g.fill();
          } else { g.beginPath(); g.moveTo(x + w * 0.46, sh + h * 0.03); g.quadraticCurveTo(x + w * 0.5 + sw * 0.2, sh + h * 0.17, x + w * 0.45 + sw * 0.45, sh + h * 0.3); g.stroke(); }
        };
        for (const p of parts.p) {
          if (p.wait > 0) p.wait -= dt; else { p.x += p.dir * p.sp * dt; p.ph += dt * 6.5; if (p.x < p.L[1] || p.x > p.L[2]) p.dir *= -1; if (Math.random() < dt * 0.05) p.wait = 1.2 + Math.random() * 2.5; }
          const [x, y] = map(p.x, p.L[0]), h = p.h * map.k, st = p.wait > 0 ? 0 : Math.sin(p.ph), v = 26 + p.shade * 38 | 0, c = `rgb(${v},${v},${v + 4})`;
          g.save();
          g.globalAlpha = 0.16; g.fillStyle = "#000"; g.beginPath(); g.ellipse(x, y + 0.5, h * 0.17, h * 0.022, 0, 0, 7); g.fill(); // 발밑 그림자
          if (fx.rain) { g.globalAlpha = 0.12; g.save(); g.translate(x, y); g.scale(1, -0.35); g.translate(-x, -y); g.filter = "blur(1.5px)"; person(x, y + 1, h, st, c, p.umb, fx.coat); g.restore(); } // 젖은 바닥 반사
          g.filter = `blur(${Math.max(0.35, h * 0.008).toFixed(2)}px)`;
          if (p.wait <= 0) { g.save(); g.globalAlpha = 0.3; g.translate(-p.dir * h * 0.05, 0); person(x, y, h, Math.sin(p.ph - 0.5), c, p.umb, fx.coat); g.restore(); } // 잔상
          person(x, y, h, st, c, p.umb, fx.coat);
          g.restore();
        }
        // 비: 깊이별 빗줄기(먼 비는 짧고 흐리게) + 바닥에 닿으면 작은 물튀김 고리
        if (fx.rain) {
          g.lineCap = "round";
          for (const q of parts.f) {
            q.y += dt * (1.6 + q.z * 1.8); q.x += dt * 0.16 * q.z;
            const gy = (fx.ground || 1) * H + (q.z - 0.5) * H * 0.08;
            if (q.y * H > gy) { if (q.z > 0.45) parts.sp.push({ x: q.x * W, y: gy, t: 0, z: q.z }); q.y = -0.05 - Math.random() * 0.2; q.x = Math.random() * 1.1 - 0.05; }
            const x = q.x * W, y = q.y * H, L = 6 + q.z * 22, a = 0.08 + q.z * 0.3;
            const gr = g.createLinearGradient(x, y - L, x, y); gr.addColorStop(0, "rgba(240,243,247,0)"); gr.addColorStop(1, `rgba(240,243,247,${a})`);
            g.strokeStyle = gr; g.lineWidth = 0.4 + q.z * 0.8; g.beginPath(); g.moveTo(x - L * 0.14, y - L); g.lineTo(x, y); g.stroke();
          }
          parts.sp = parts.sp.filter((sp) => (sp.t += dt) < 0.35);
          for (const sp of parts.sp) { const k = sp.t / 0.35, rr = (2 + sp.z * 5) * k; g.strokeStyle = `rgba(235,238,242,${(1 - k) * 0.45})`; g.lineWidth = 0.6; g.beginPath(); g.ellipse(sp.x, sp.y, rr, rr * 0.28, 0, 0, 7); g.stroke(); }
        }
        if (fx.snow) {
          for (const q of parts.f) {
            q.y += dt * (0.025 + q.z * 0.09); q.ph += dt * (0.6 + q.z); if (q.y > 1.04) { q.y = -0.04; q.x = Math.random(); }
            const x = (q.x + Math.sin(q.ph) * 0.012 * q.z) * W, y = q.y * H, rr = 0.5 + q.z * q.z * 3.2;
            if (q.z > 0.85) { const gr = g.createRadialGradient(x, y, 0, x, y, rr * 1.8); gr.addColorStop(0, "rgba(255,255,255,.55)"); gr.addColorStop(1, "rgba(255,255,255,0)"); g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr * 1.8, 0, 7); g.fill(); }
            else { g.fillStyle = `rgba(255,255,255,${0.35 + q.z * 0.5})`; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill(); }
          }
        }
        // 새: 몸통·날개(어깨→손목→끝)·꼬리, 날갯짓 위상은 새마다 달라요
        for (const b of parts.b) {
          b.x += b.sp * dt; b.ph += dt * (7 + b.sp * 200); b.y += Math.sin(b.ph * 0.12) * dt * 0.006;
          if (b.x > 1.05) { b.x = -0.05; b.y = fx.birds[1] + Math.random() * (fx.birds[3] - fx.birds[1]); }
          const [x, y] = map(b.x, b.y), s2 = map.k * 0.011, f2 = Math.sin(b.ph), up = f2 * s2 * 0.9;
          g.fillStyle = g.strokeStyle = "rgba(34,36,40,.82)"; g.lineCap = "round"; g.lineJoin = "round";
          g.beginPath(); g.ellipse(x, y, s2 * 0.42, s2 * 0.12, -0.08, 0, 7); g.fill(); // 몸통
          g.beginPath(); g.moveTo(x - s2 * 0.42, y); g.lineTo(x - s2 * 0.7, y - s2 * 0.08); g.lineTo(x - s2 * 0.66, y + s2 * 0.1); g.closePath(); g.fill(); // 꼬리
          g.lineWidth = Math.max(0.6, s2 * 0.16);
          [-1, 1].forEach((sg) => { const wy = sg < 0 ? 1 : 0.75; g.beginPath(); g.moveTo(x + s2 * 0.05, y - s2 * 0.04); g.lineTo(x - s2 * 0.1, y - up * 0.6 * wy - s2 * 0.1); g.lineTo(x - s2 * 0.35, y - up * wy - s2 * 0.05 * f2); g.stroke(); });
        }
        raf = requestAnimationFrame(frame);
      };
      let hov = false, stopT = 0; const card = mz.closest(".wcard");
      const start = () => { if (!raf && live && (hov || stopT)) { last = 0; raf = requestAnimationFrame(frame); } };
      card.addEventListener("pointerenter", (e) => { if (e.pointerType === "touch") return; hov = true; clearTimeout(stopT); stopT = 0; cv.classList.add("on"); start(); });
      card.addEventListener("pointerleave", () => { hov = false; cv.classList.remove("on"); clearTimeout(stopT); stopT = setTimeout(() => { stopT = 0; }, 700); });
      if (im.complete) size(); else im.addEventListener("load", size, { once: true });
      new ResizeObserver(size).observe(mz);
      new IntersectionObserver(([e]) => { live = e.isIntersecting; start(); }).observe(mz);
    });
  }

  // ── 모션 아트 → Selected Works (채팅 요청 '자연스럽고 재밌게'): 도시의 모듈들이 떠올라 날아가 첫 작품 카드들의 자리를
  // 타일처럼 채우고, 다 내려앉으면 그 자리에서 사진이 드러나요. 스크롤에 묶여 있어 되감으면 다시 도시로 돌아가요.
  const HAND = { pts: [], C: 8 };
  function worksHandoff() {
    const sec = $("#intro"), works = $("#works"); if (!sec || !works || REDUCED) return;
    const cv = document.createElement("canvas"); cv.className = "hand-cv"; cv.setAttribute("aria-hidden", "true"); document.body.appendChild(cv);
    const g = cv.getContext("2d"); let W = 0, H = 0, D = 1, raf = 0, start = null, tiles = null, cards = [];
    const size = () => { D = Math.min(2, devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * D; cv.height = H * D; tiles = null; };
    size(); addEventListener("resize", size);
    const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const hsh = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
    // 받을 카드: 열마다 첫 카드 (화면에 보이는 열만)
    const pick = () => $$(".wcol").map((c) => $(".wcard", c)).filter((c) => c && c.offsetParent).slice(0, innerWidth <= 760 ? 1 : 3);
    const setCards = (q) => cards.forEach((c) => { const mz = $(".mz", c); if (mz) mz.style.opacity = q >= 1 ? "" : String(ease(Math.max(0, (q - 0.78) / 0.22))); });
    const build = () => {
      cards = pick(); if (!cards.length || !HAND.pts.length) return false;
      // 카드마다 칸을 나누고(가로 9칸), 모듈 하나가 칸 하나로 날아가요
      const cells = [];
      cards.forEach((c, ci) => { const m = $(".media", c) || c, b = m.getBoundingClientRect(), n = 9, cs = b.width / n, rows = Math.ceil(b.height / cs);
        for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++) cells.push({ ci, x: x * cs, y: y * cs, w: cs, h: Math.min(cs, b.height - y * cs), m }); });
      const P = HAND.pts.slice().sort((a, b) => a[0] - b[0]);
      // 왼쪽 모듈은 왼쪽 카드로: 칸을 카드 순서·가로 위치로 정렬해 순서대로 짝지어요
      const order = cells.map((c, k) => k).sort((a, b) => cells[a].ci - cells[b].ci || cells[a].x - cells[b].x || cells[a].y - cells[b].y);
      tiles = order.map((k, n) => ({ c: cells[k], s: P[Math.floor((n / order.length) * P.length)], d: hsh(n) * 0.35 }));
      return true;
    };
    const draw = () => {
      raf = 0;
      const sr = sec.getBoundingClientRect(), y0 = scrollY + sr.top + 0.5 * (sr.height - innerHeight);
      const first = pick()[0]; if (!first) return;
      const y1 = scrollY + first.getBoundingClientRect().top - innerHeight * 0.18;
      const q = clamp((scrollY - y0) / Math.max(1, y1 - y0), 0, 1);
      g.setTransform(D, 0, 0, D, 0, 0); g.clearRect(0, 0, W, H);
      if (q <= 0 || q >= 1) { cv.style.opacity = "0"; tiles = q >= 1 ? tiles : null; setCards(q <= 0 ? 0 : 1); if (q <= 0) cards = pick(); return; }
      if (!tiles && !build()) return;
      cv.style.opacity = "1"; setCards(q);
      const ink = getComputedStyle(document.documentElement).getPropertyValue("--ink").trim() || "#111";
      const top = $(".yi-cv") ? $(".yi-cv").getBoundingClientRect().top : 0, C0 = HAND.C;
      const rects = cards.map((c) => (($(".media", c) || c).getBoundingClientRect()));
      g.fillStyle = ink; g.strokeStyle = ink;
      for (const t of tiles) {
        const k = ease(clamp((q - t.d * 0.5) / 0.62, 0, 1)), b = rects[t.c.ci];
        const sx = t.s[0], sy = t.s[1] + top, ex = b.left + t.c.x + t.c.w / 2, ey = b.top + t.c.y + t.c.h / 2;
        // 살짝 떠올랐다가(위로 호를 그리며) 칸으로 내려앉아요
        const x = sx + (ex - sx) * k, y = sy + (ey - sy) * k - Math.sin(Math.PI * k) * innerHeight * 0.12;
        const w = C0 + (t.c.w - C0) * k, h = C0 + (t.c.h - C0) * k, a = clamp(k < 0.08 ? k / 0.08 : 1, 0, 1) * (1 - ease(clamp((q - 0.8) / 0.2, 0, 1)));
        if (a <= 0.01) continue;
        g.globalAlpha = a * (0.18 + 0.32 * (1 - k * 0.5));
        if (k > 0.85) { g.lineWidth = 0.6; g.strokeRect(x - w / 2 + 0.5, y - h / 2 + 0.5, w - 1, h - 1); g.globalAlpha *= 0.15; }
        g.fillRect(x - w / 2 + 0.5, y - h / 2 + 0.5, w - 1, h - 1);
      }
      g.globalAlpha = 1;
    };
    addEventListener("scroll", () => { if (!raf) raf = requestAnimationFrame(draw); }, { passive: true });
    draw();
  }
  function intro() {
    const sec = $(".yi"); if (!sec) return;
    const cv = $(".yi-cv", sec), g = cv.getContext("2d"), xy = $(".yi-xy", sec);
    { // 모든 선을 60% 굵기로 (핀 #394): lineWidth를 넣을 때마다 자동으로 줄여요
      const LW = 0.6, d0 = Object.getOwnPropertyDescriptor(CanvasRenderingContext2D.prototype, "lineWidth");
      Object.defineProperty(g, "lineWidth", { get() { return d0.get.call(this) / LW; }, set(v) { d0.set.call(this, v * LW); } });
    }
    let W = 0, H = 0, C = 8, mods = [], map = new Map(), cols = 0, rows = 0, ox = 0, oy = 0;
    const cache = { c: document.createElement("canvas"), ok: false }; // 건물·나무가 멈추면 한 장으로 저장 → 사람·차만 다시 그려요
    let drag = null, dragged = false; // 핀 #421: 누른 채 위로 끌면 그 근처 건물이 늘어나요
    let t0 = performance.now(), mx = -1e4, my = -1e4, sun = 0.35, sunT = 0.35, live = true, raf = 0, seed = 1, col = {};
    const css = (k) => getComputedStyle(document.documentElement).getPropertyValue(k).trim();
    const rgb = (h) => { const m = (h || "").match(/^#?([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i); return m ? [1, 2, 3].map((i) => parseInt(m[i], 16)) : null; };
    const colors = () => {
      const bg = rgb(css("--bg")) || [255, 255, 255], ink = rgb(css("--ink")) || [17, 17, 17];
      const mix = (a) => `rgb(${bg.map((v, i) => Math.round(v + (ink[i] - v) * a)).join(",")})`;
      col = { bg: mix(0), mix, ink: css("--ink") || "#111", mid: css("--mid") || "#777", line: css("--line") || "#ddd", dark: css("--bg") !== "#ffffff" && document.documentElement.dataset.mode === "dark" };
    };
    const hash = (a, b, c) => { const s = Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453; return s - Math.floor(s); };
    const heights = () => mods.forEach((m) => {
      // 3×3 칸 묶음마다 층수를 정해 계단처럼 (도시 매스처럼) 나뉘게
      const q = hash(Math.floor(m.i / 3), Math.floor(m.j / 3), seed), base = hash(m.L || 0, 3, seed) * 3;
      m.H = C * (0.45 + Math.floor(q * 3 + base) * 0.4);
      const k = hash(m.i, m.j, seed + 5);
      m.roof = k < 0.05 ? "unit" : k < 0.11 ? "tree" : k < 0.15 ? "solar" : "";
    });

    const build = () => {
      const dpr = Math.min(2, devicePixelRatio || 1);
      W = cv.clientWidth; H = cv.clientHeight; if (!W || !H) return;
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      cache.c.width = cv.width; cache.c.height = cv.height; cache.ok = false; build.dpr = dpr;
      const two = W < 760, fam = css("--sans") || "Helvetica, Arial, sans-serif";
      C = Math.max(5, Math.round(two ? W / 60 : W / 130));
      const o = document.createElement("canvas"); o.width = W; o.height = H; const og = o.getContext("2d");
      const lines = two ? ["YP.", "STUDIO"] : ["YP.STUDIO"];
      og.font = `700 100px ${fam}`;
      const fs = Math.floor((100 * W * (two ? 0.82 : 0.84)) / Math.max(...lines.map((l) => og.measureText(l).width)));
      og.font = `700 ${fs}px ${fam}`; og.textAlign = "center"; og.fillStyle = "#000";
      const lh = fs * 0.92, top = H * 0.5 - (lh * lines.length) / 2 + fs * 0.74;
      lines.forEach((l, i) => og.fillText(l, W / 2, top + i * lh));
      const d = og.getImageData(0, 0, W, H).data;
      cols = Math.floor(W / C); rows = Math.floor(H / C); ox = (W - cols * C) / 2; oy = (H - rows * C) / 2;
      const old = new Map(mods.map((m) => [m.i + "," + m.j, m]));
      mods = []; map = new Map();
      for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
        const x = ox + (i + 0.5) * C, y = oy + (j + 0.5) * C;
        if (d[((y | 0) * W + (x | 0)) * 4 + 3] < 140) continue;
        const p = old.get(i + "," + j);
        const m = { i, j, u: ox + i * C, v: oy + j * C, z: p ? p.z : 0, vz: 0, lift: 0, H: 0, dl: (i / cols) * 0.8 + hash(i, j, 9) * 0.25 };
        mods.push(m); map.set(i + "," + j, m);
      }
      heights();
      // 칸이 있는 범위 (그리드·치수선용)
      let i0 = 1e9, i1 = -1, j0 = 1e9, j1 = -1; mods.forEach((m) => { i0 = Math.min(i0, m.i); i1 = Math.max(i1, m.i); j0 = Math.min(j0, m.j); j1 = Math.max(j1, m.j); });
      build.ext = [i0, i1, j0, j1];
      // 글자마다(=동마다) 칸 범위: 치수 체인·레벨 표시용
      const has = new Set(mods.map((m) => m.i)); build.grp = [];
      for (let i = i0; i <= i1 + 1; i++) { const last = build.grp[build.grp.length - 1]; if (has.has(i)) { if (last && last[1] === i - 1) last[1] = i; else build.grp.push([i, i]); } }
      mods.forEach((m) => { m.L = build.grp.findIndex(([a, b]) => m.i >= a && m.i <= b); });
      // 작은 공원: 좌우·위아래 가까이(6칸 안)에 매스가 있는 빈 칸 = 글자 안쪽과 글자 사이 틈
      const occ = (i, j) => map.has(i + "," + j), near = (i, j, di, dj) => { for (let k = 1; k <= 6; k++) if (occ(i + di * k, j + dj * k)) return true; return false; };
      const cells = new Map();
      for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) if (!occ(i, j) && near(i, j, -1, 0) && near(i, j, 1, 0)) cells.set(i + "," + j, { i, j });
      // 공원 연장 (핀 #424): 글자 바깥으로도 녹지가 자연스럽게 번져요. 부드러운 잡음으로 가장자리를 들쭉날쭉하게, 멀어질수록 드물게
      { const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), fx = x - xi, fy = y - yi, s2 = (q) => q * q * (3 - 2 * q), h = (a, b) => hash(a, b, 61 + seed * 0);
          const a = h(xi, yi), b = h(xi + 1, yi), c = h(xi, yi + 1), d = h(xi + 1, yi + 1), u = s2(fx), v = s2(fy); return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v; };
        const nearRoad = (i, j) => Math.abs(j + 0.5 - (j0 - 2.7)) < 1.2 || Math.abs(j + 0.5 - (j1 + 1 + 2.7)) < 1.2 || Math.abs(i + 0.5 - (i0 - 2.7)) < 1.2 || Math.abs(i + 0.5 - (i1 + 1 + 2.7)) < 1.2;
        for (let j = Math.max(0, j0 - 10); j <= Math.min(rows - 1, j1 + 10); j++) for (let i = Math.max(0, i0 - 10); i <= Math.min(cols - 1, i1 + 10); i++) {
          if (occ(i, j) || cells.has(i + "," + j) || nearRoad(i, j)) continue;
          const dI = Math.max(0, i0 - i, i - i1), dJ = Math.max(0, j0 - j, j - j1), dd = Math.hypot(dI, dJ * 1.3);
          const inside = i >= i0 && i <= i1 && j >= j0 && j <= j1;
          if (vn(i / 5, j / 4) - dd * 0.028 - (inside ? 0 : 0.02) > 0.4) cells.set(i + "," + j, { i, j });
        } }
      // 이어진 칸끼리 묶어 공원 하나로
      build.parks = []; const seen = new Set(), INS = (c) => c.i >= i0 && c.i <= i1 && c.j >= j0 && c.j <= j1; // 핀 #427: 대지 안/밖 공원은 따로 묶어요
      for (const [k, c0] of cells) {
        if (seen.has(k)) continue; const st = [c0], grp = []; seen.add(k);
        while (st.length) { const c = st.pop(); grp.push(c); [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([a, b]) => { const kk = c.i + a + "," + (c.j + b); if (cells.has(kk) && !seen.has(kk) && INS(cells.get(kk)) === INS(c0)) { seen.add(kk); st.push(cells.get(kk)); } }); }
        if (grp.length < 4) continue;
        const pk = { cells: grp, trees: [], play: null, out: !INS(c0) };
        grp.forEach((c) => { const n = Math.floor(hash(c.i, c.j, 21) * 4.2); for (let k = 0; k < n; k++) { const ty = hash(c.i, c.j, 52 + k); pk.trees.push({ u: ox + (c.i + 0.12 + hash(c.i, c.j, 22 + k) * 0.76) * C, v: oy + (c.j + 0.12 + hash(c.i, c.j, 32 + k) * 0.76) * C, r: C * (ty < 0.22 ? 0.07 + hash(c.i, c.j, 42 + k) * 0.05 : 0.1 + hash(c.i, c.j, 42 + k) * 0.09), t: ty < 0.22 ? 2 : ty < 0.4 ? 1 : 0, s: hash(c.i, c.j, 62 + k) * 6.28 }); } });
        const js = grp.map((c) => c.j).sort((a, b) => a - b), is = grp.map((c) => c.i).sort((a, b) => a - b);
        const jm = js[js.length >> 1], im = is[is.length >> 1];
        pk.path = grp.filter((c) => c.j === jm || c.i === im);
        const onPath = (u, v) => pk.path.some((c) => (c.j === jm && Math.abs(v - (oy + (c.j + 0.5) * C)) < C * 0.45 && u >= ox + c.i * C && u <= ox + (c.i + 1) * C) || (c.i === im && Math.abs(u - (ox + (c.i + 0.5) * C)) < C * 0.45 && v >= oy + c.j * C && v <= oy + (c.j + 1) * C));
        pk.trees = pk.trees.filter((t) => !onPath(t.u, t.v)); pk.jm = jm; pk.im = im;
        if (false) { const c = grp[Math.floor(grp.length / 2)]; pk.play = { u: ox + (c.i + 0.5) * C, v: oy + (c.j + 0.5) * C }; pk.trees = pk.trees.filter((t) => Math.hypot(t.u - pk.play.u, t.v - pk.play.v) > C * 1.3); }
        pk.set = new Set(grp.map((c) => c.i + "," + c.j));
        pk.people = [];
        const np = Math.max(1, Math.round(grp.length / 3));
        for (let k = 0; k < np; k++) {
          const c = grp[Math.floor(Math.random() * grp.length)], a = Math.random() * 6.28, sp = C * (0.12 + Math.random() * 0.14);
          const base = { u: ox + (c.i + Math.random()) * C, v: oy + (c.j + Math.random()) * C, a, sp, ph: Math.random() * 6.28, wait: 0, h: 0.9 + Math.random() * 0.25 };
          pk.people.push(base);
          if (Math.random() < 0.3) pk.people.push({ ...base, u: base.u + C * 0.18, v: base.v + C * 0.12, buddy: base, ph: base.ph + 1, h: 0.85 + Math.random() * 0.25 });
        }
        build.parks.push(pk);
      }
      // 순환 도로와 차
      const RO = C * 2.7; build.road = { u0: ox + i0 * C - RO, u1: ox + (i1 + 1) * C + RO, v0: oy + j0 * C - RO, v1: oy + (j1 + 1) * C + RO, w: C * 0.75 };
      // 도로망(핀 #409): 대지 둘레 네 길 + 글자 사이 골목. 모두 화면 밖까지 뻗어요
      const rd = build.road, FU = [-W * 0.3, W * 1.3], FV = [-H * 0.7, H * 1.7], mid = [];
      { let run = []; for (let i = i0; i <= i1 + 1; i++) { let empty = i <= i1; for (let j = j0; j <= j1 && empty; j++) if (map.has(i + "," + j)) empty = false;
          if (empty) run.push(i); else { if (run.length && run[0] > i0) mid.push(run[Math.floor(run.length / 2)]); run = []; } } }
      build.streets = [
        { a: [FU[0], rd.v0], b: [FU[1], rd.v0] }, { a: [FU[0], rd.v1], b: [FU[1], rd.v1] },
        { a: [rd.u0, FV[0]], b: [rd.u0, FV[1]] }, { a: [rd.u1, FV[0]], b: [rd.u1, FV[1]] },
        ...mid.map((i) => ({ a: [ox + (i + 0.5) * C, FV[0]], b: [ox + (i + 0.5) * C, FV[1]] })),
      ].map((q) => ({ ...q, vert: q.a[0] === q.b[0], len: Math.hypot(q.b[0] - q.a[0], q.b[1] - q.a[1]) }));
      // 골목이 지나는 칸은 공원에서 비워요
      mid.forEach((i) => (build.parks || []).forEach((pk) => {
        [...pk.set].forEach((k) => { if (+k.split(",")[0] === i) pk.set.delete(k); });
        pk.cells = pk.cells.filter((c) => c.i !== i); pk.trees = pk.trees.filter((t) => Math.floor((t.u - ox) / C) !== i);
        (pk.people || []).forEach((pp) => { if (Math.floor((pp.u - ox) / C) === i) pp.u += C * (Math.random() < 0.5 ? -1 : 1); });
      }));
      build.spawn = (c, any) => { const k = Math.floor(Math.random() * build.streets.length); Object.assign(c, { k, dir: Math.random() < 0.5 ? 1 : -1, sp: C * (1.8 + Math.random() * 1.6), len: C * (0.5 + Math.random() * 0.25), tone: Math.random(), s: any ? Math.random() * build.streets[k].len : 0 }); return c; };
      // 주변 매스 (핀 #425·#426): 대지 바깥 빈 블록마다 아주 연한 반투명 건물. 도로·골목·공원은 피해요
      { const inPark = (i, j) => (build.parks || []).some((pk) => pk.set.has(i + "," + j));
        const road = (i, j) => Math.abs(j + 0.5 - (j0 - 2.7)) < 1.4 || Math.abs(j + 0.5 - (j1 + 1 + 2.7)) < 1.4 || Math.abs(i + 0.5 - (i0 - 2.7)) < 1.4 || Math.abs(i + 0.5 - (i1 + 1 + 2.7)) < 1.4 || mid.some((m) => Math.abs(i - m) < 1.5);
        build.ctx = [];
        const J0 = j0 - 3 - Math.ceil(H / C), J1 = j1 + 3 + Math.ceil(H / C), I0 = i0 - 3 - Math.ceil(W / C / 3), I1 = i1 + 3 + Math.ceil(W / C / 3);
        for (let bj0 = J0; bj0 <= J1; bj0 += 3) for (let bi0 = I0; bi0 <= I1; bi0 += 3) {
          const w = hash(bi0, bj0, 71) < 0.35 ? 1 : 2, d = hash(bi0, bj0, 72) < 0.4 ? 1 : 2, bi = bi0 + (hash(bi0, bj0, 74) < 0.5 ? 0 : 3 - w - 1 + 1) * (w === 1 ? 1 : 0), bj = bj0 + (d === 1 && hash(bi0, bj0, 75) < 0.5 ? 1 : 0), siteBox = bi + w > i0 - 1 && bi < i1 + 2 && bj + d > j0 - 1 && bj < j1 + 2;
          if (siteBox || hash(bi0, bj0, 73) < 0.45) continue;
          let ok = true; for (let j = bj; j < bj + d && ok; j++) for (let i = bi; i < bi + w && ok; i++) if (map.has(i + "," + j) || inPark(i, j) || road(i, j)) ok = false;
          if (!ok) continue;
          const far = Math.hypot(Math.max(0, i0 - bi, bi - i1) / 6, Math.max(0, j0 - bj, bj - j1) / 3);
          build.ctx.push({ u: ox + bi * C + C * 0.15, v: oy + bj * C + C * 0.15, w: w * C - C * 0.3, d: d * C - C * 0.3, h: C * (0.35 + hash(bi, bj, 79) * 1.3) / (1 + far * 0.25), dl: hash(bi, bj, 83) * 0.6 });
        }
        build.ctx.sort((a, b) => a.v - b.v); }
      build.cars = Array.from({ length: Math.max(12, build.streets.length * 3) }, () => build.spawn({}, true));
      build.edges = null; // 평면 윤곽은 처음 그릴 때 다시 계산
      heights();
      // 뒤에서 앞으로, 같은 줄은 오른쪽부터 (가려지는 순서)
      mods.sort((a, b) => a.j - b.j || b.i - a.i);
    };

    const prog = () => { const r = sec.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };


    const ease = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

    const frame = (now) => {
      raf = 0; if (!live || !W) return;
      const tr = REDUCED ? 12 : (now - t0) / 1000, p = REDUCED ? 0 : ease(prog());
      // 서사 시간 (핀 '10초 정도'): 도면 0–2.6초, 측량·기초 2.6–4.2초, 현장 시공 4.2–10초, 그 뒤 도시
      const t = tr < 2.6 ? (tr / 2.6) * 1.9 : tr < 4.2 ? 1.9 + ((tr - 2.6) / 1.6) * 0.7 : tr < 10 ? 2.6 + ((tr - 4.2) / 5.8) * 2.6 : 5.2 + (tr - 10);
      const gA = ease(t / 0.9), pA = 1, tilt = ease((t - 2.35) / 1.1) + p * 1.6, rise = 1;
      const RISE = (m) => 2.6 + (m.i / Math.max(1, cols)) * 1.0 + hash(m.i, m.j, 77) * 0.45, DUR = 1.1; // 올라오기 시작하는 때(왼쪽부터), 걸리는 시간
      const K = 1 - 0.2 * tilt, S = 0.24 * tilt, CY = H * 0.5;
      // 평면 좌표(u,v) → 화면: 평면은 그대로 두고 앞뒤를 눌러 기울인 평면 사투상(plan oblique)
      const P = (u, v, z) => [u + (v - CY) * S, CY + (v - CY) * K - z];
      sun += (sunT - sun) * 0.08;
      g.clearRect(0, 0, W, H);
      const [i0, i1, j0, j1] = build.ext || [0, 0, 0, 0];
      const fade = clamp((0.92 - p) / 0.32, 0, 1);
      // Works로 넘기기: 건물 윗면(정사각 모듈) 화면 위치를 handoff에 넘겨요
      if (p > 0.3 && mods.length) { const st = Math.max(1, Math.ceil(mods.length / 700)); HAND.C = C; HAND.pts = []; for (let k = 0; k < mods.length; k += st) { const m = mods[k]; HAND.pts.push(P(m.u + C / 2, m.v + C / 2, m.z)); } }
      if (cache.ok && Math.abs(p - cache.p) > 0.0005) cache.ok = false;
      const yt = clamp((p - 0.62) / 0.3, 0, 1);
      sec.style.setProperty("--yt", yt.toFixed(3)); sec.classList.toggle("yi-off", p > 0.9);
      if (p > 0.6 && !frame.handed) { frame.handed = true; document.dispatchEvent(new CustomEvent("yp:works")); } else if (p < 0.3) frame.handed = false;
      const dt = Math.min(0.05, (now - (frame.last || now)) / 1000);
      const lxs0 = (sun - 0.5) * 2;
      const dyn = () => {
        if (fade <= 0.01 || t < 5.3) return;
        g.globalAlpha = fade * ease((t - 5.3) / 0.8);
        const lxs = lxs0;
        // 차
        const rd = build.road;
        if (rd && build.streets) {
          // 길 위의 위치: 한쪽 끝에서 다른 끝까지 달리고, 화면 밖으로 나가면 다른 길에서 다시 출발해요
          let cur = null;
          const at = (ps, off) => { const st = build.streets[cur.k], q = ps / st.len, u = st.a[0] + (st.b[0] - st.a[0]) * q, v = st.a[1] + (st.b[1] - st.a[1]) * q; return st.vert ? [u + off, v, 1] : [u, v - off, 0]; };
          for (const car of build.cars) {
            car.s += car.sp * dt; if (car.s > build.streets[car.k].len) build.spawn(car, false);
            cur = car; const ps = car.dir > 0 ? car.s : build.streets[car.k].len - car.s;
            const off = car.dir > 0 ? -rd.w * 0.5 : rd.w * 0.5, [u, v, vert] = at(ps, off);
            const L = car.len, Wc = C * 0.28, hc = C * 0.2, du = vert ? Wc / 2 : L / 2, dv = vert ? L / 2 : Wc / 2;
            const u0 = u - du, u1 = u + du, v0 = v - dv, v1 = v + dv;
            const q = (a) => { g.beginPath(); g.moveTo(a[0][0], a[0][1]); for (let k = 1; k < a.length; k++) g.lineTo(a[k][0], a[k][1]); g.closePath(); };
            q([P(u0 - lxs * hc, v0 + hc * 0.5, 0), P(u1 - lxs * hc, v0 + hc * 0.5, 0), P(u1 - lxs * hc, v1 + hc * 0.5, 0), P(u0 - lxs * hc, v1 + hc * 0.5, 0)]); g.fillStyle = col.dark ? "rgba(0,0,0,.5)" : col.mix(0.08); g.fill();
            const body = col.mix(col.dark ? 0.35 + car.tone * 0.3 : 0.15 + car.tone * 0.35);
            q([P(u0, v1, 0), P(u1, v1, 0), P(u1, v1, hc), P(u0, v1, hc)]); g.fillStyle = body; g.fill();
            q([P(u0, v0, 0), P(u0, v1, 0), P(u0, v1, hc), P(u0, v0, hc)]); g.fillStyle = body; g.fill();
            q([P(u0, v0, hc), P(u1, v0, hc), P(u1, v1, hc), P(u0, v1, hc)]); g.fillStyle = col.mix(col.dark ? 0.55 : 0.08 + car.tone * 0.2); g.fill();
            // 앞유리
            const wf = vert ? [P(u0 + 1, v + (car.dir > 0 ? 1 : -1) * dv * 0.2, hc), P(u1 - 1, v + (car.dir > 0 ? 1 : -1) * dv * 0.2, hc)] : [P(u + (car.dir > 0 ? 1 : -1) * du * 0.2, v0 + 1, hc), P(u + (car.dir > 0 ? 1 : -1) * du * 0.2, v1 - 1, hc)];
            g.strokeStyle = col.mix(col.dark ? 0.2 : 0.5); g.lineWidth = 0.8; g.beginPath(); g.moveTo(wf[0][0], wf[0][1]); g.lineTo(wf[1][0], wf[1][1]); g.stroke();
            if (col.dark) {
              // 전조등: 달리는 방향 앞쪽으로 퍼지는 빛 + 두 개의 등, 뒤에는 희미한 미등
              const [nu, nv] = at(ps + car.dir * 2, off), fx = Math.sign(nu - u), fy = Math.sign(nv - v);
              const fu = u + fx * L / 2, fv = v + fy * L / 2, side = [fy, -fx], bl = C * 1.6, bw = C * 0.55;
              const A = P(fu + side[0] * Wc * 0.4, fv + side[1] * Wc * 0.4, 0), B = P(fu - side[0] * Wc * 0.4, fv - side[1] * Wc * 0.4, 0);
              const A2 = P(fu + fx * bl + side[0] * bw, fv + fy * bl + side[1] * bw, 0), B2 = P(fu + fx * bl - side[0] * bw, fv + fy * bl - side[1] * bw, 0);
              const m0 = P(fu, fv, 0), m1 = P(fu + fx * bl, fv + fy * bl, 0), gr = g.createLinearGradient(m0[0], m0[1], m1[0], m1[1]);
              gr.addColorStop(0, "rgba(255,255,245,.45)"); gr.addColorStop(1, "rgba(255,255,245,0)");
              g.beginPath(); g.moveTo(A[0], A[1]); g.lineTo(A2[0], A2[1]); g.lineTo(B2[0], B2[1]); g.lineTo(B[0], B[1]); g.closePath(); g.fillStyle = gr; g.fill();
              g.shadowColor = "rgba(255,255,255,.9)"; g.shadowBlur = 6; g.fillStyle = "rgba(255,255,250,.95)";
              [A, B].forEach((p0) => { g.beginPath(); g.arc(p0[0], p0[1] - hc * 0.4, 1.1, 0, 7); g.fill(); });
              g.shadowBlur = 0;
              const bu = u - fx * L / 2, bv = v - fy * L / 2, T = P(bu, bv, hc * 0.4); g.fillStyle = "rgba(255,255,255,.35)"; g.fillRect(T[0] - 0.8, T[1] - 0.6, 1.6, 1.2);
            }
          }
        }
        // 사람
        for (const pk of build.parks || []) {
          // 사람들: 녹지와 산책길을 걸어 다니다 가끔 멈춰 서요
          const inPark = (u, v) => pk.set.has(Math.floor((u - ox) / C) + "," + Math.floor((v - oy) / C));
          const aP = g.globalAlpha; g.globalAlpha = aP * (pk.out ? 0.3 : 1);
          for (const pp of pk.people) {
            if (pp.buddy) { const b = pp.buddy; pp.u += (b.u + C * 0.18 - pp.u) * 0.2; pp.v += (b.v + C * 0.12 - pp.v) * 0.2; pp.ph += dt * 5; }
            else if (pp.wait > 0) pp.wait -= dt;
            else {
              const nu = pp.u + Math.cos(pp.a) * pp.sp * dt, nv = pp.v + Math.sin(pp.a) * pp.sp * dt;
              if (inPark(nu, nv)) { pp.u = nu; pp.v = nv; pp.ph += dt * 5; if (Math.random() < dt * 0.25) pp.a += (Math.random() - 0.5) * 1.6; if (Math.random() < dt * 0.08) pp.wait = 0.8 + Math.random() * 2; }
              else pp.a = Math.random() * 6.28;
            }
            const [x, y] = P(pp.u, pp.v, 0), hh = C * 0.19 * pp.h, step = pp.wait > 0 && !pp.buddy ? 0 : Math.sin(pp.ph) * 0.8;
            g.fillStyle = col.dark ? "rgba(0,0,0,.5)" : col.mix(0.1); g.beginPath(); g.ellipse(x - (sun - 0.5) * 2 * hh * 0.4, y + 0.3, hh * 0.25, hh * 0.1, 0, 0, 7); g.fill();
            g.strokeStyle = col.mix(col.dark ? 0.5 : 0.36); g.lineWidth = 0.6; g.beginPath();
            g.moveTo(x - step * 0.6, y); g.lineTo(x, y - hh * 0.45); g.lineTo(x + step * 0.6, y);   // 다리
            g.moveTo(x, y - hh * 0.45); g.lineTo(x, y - hh * 0.85);                                   // 몸
            g.stroke();
            g.fillStyle = col.mix(col.dark ? 0.5 : 0.36); g.beginPath(); g.arc(x, y - hh, hh * 0.15 + 0.35, 0, 7); g.fill(); // 머리
          }
          g.globalAlpha = aP;
        }
        g.globalAlpha = 1;
      };
      if (cache.ok && !REDUCED) {
        g.save(); g.setTransform(1, 0, 0, 1, 0, 0); g.globalAlpha = 1; g.clearRect(0, 0, cv.width, cv.height); g.drawImage(cache.c, 0, 0); g.restore();
        sec.style.setProperty("--yp", p.toFixed(3));
        dyn(); frame.last = now;
        if (p < 0.95) raf = requestAnimationFrame(frame);
        return;
      }
      g.globalAlpha = fade;

      // 1) 구조 그리드: 6칸마다 통심선, 위에 번호 원·왼쪽에 문자 원
      const B = 6, gi0 = Math.floor(i0 / B) * B, gi1 = Math.ceil((i1 + 1) / B) * B, gj0 = Math.floor(j0 / B) * B, gj1 = Math.ceil((j1 + 1) / B) * B;
      const U = (i) => ox + i * C, V = (j) => oy + j * C, ext = C * 4;
      g.lineWidth = 1; g.strokeStyle = col.line; g.fillStyle = col.mid; g.font = `${W < 760 ? 7 : 10}px ${css("--sans") || "sans-serif"}`; g.textAlign = "center"; g.textBaseline = "middle";
      g.setLineDash([C * 1.2, C * 0.5, C * 0.2, C * 0.5]);
      g.beginPath();
      let n = 0;
      const X = C * 9, xi0 = gi0 - B * 2, xi1 = gi1 + B * 2, xj0 = gj0 - B, xj1 = gj1 + B; // 확장된 그리드 범위
      for (let i = xi0; i <= xi1; i += B, n++) { const a = P(U(i), V(xj0) - X, 0), b = P(U(i), V(xj0) - X + (V(xj1) - V(xj0) + X * 2) * gA, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      for (let j = xj0; j <= xj1; j += B) { const a = P(U(xi0) - X, V(j), 0), b = P(U(xi0) - X + (U(xi1) - U(xi0) + X * 2) * gA, V(j), 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      g.stroke(); g.setLineDash([]);
      // 보조 그리드: 반 스팬(3.6 m)마다 아주 연한 점선
      g.save(); g.globalAlpha *= 0.55; g.setLineDash([1, C * 0.6]); g.beginPath();
      for (let i = xi0 + B / 2; i < xi1; i += B) { const a = P(U(i), V(xj0), 0), b = P(U(i), V(xj0) + (V(xj1) - V(xj0)) * gA, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      for (let j = xj0 + B / 2; j < xj1; j += B) { const a = P(U(xi0), V(j), 0), b = P(U(xi0) + (U(xi1) - U(xi0)) * gA, V(j), 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
      g.stroke(); g.restore(); g.setLineDash([]);
      if (gA > 0.6) {
        g.globalAlpha = fade * ease((gA - 0.6) / 0.4) * (1 - tilt * 0.6);
        const r = W < 760 ? 6 : 8; let k = 1;
        for (let i = xi0; i <= xi1; i += B * (W < 760 ? 2 : 1), k++) { const [x, y] = P(U(i), V(xj0) - X - r, 0); g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.fillText(String(k), x, y + 0.5); }
        k = 0;
        for (let j = xj0; j <= xj1; j += B, k++) { const [x, y] = P(U(xi0) - X - r, V(j), 0); g.beginPath(); g.arc(x, y, r, 0, 7); g.stroke(); g.fillText("ABCDEFGHJK"[k] || "", x, y + 0.5); }
        // 스팬 치수: 원 아래 한 줄로 7,200 이 이어지고, 바깥에 전체 길이
        const fsm = W < 760 ? 5.5 : 8, fsb = W < 760 ? 6.5 : 9;
        g.save(); g.font = `${fsm}px ${css("--sans") || "sans-serif"}`; g.beginPath();
        const dv1 = V(xj0) - X * 0.55, dv2 = V(xj0) - X * 0.25;
        for (let i = xi0; i <= xi1; i += B) { const a = P(U(i), dv1 - C * 0.3, 0), b = P(U(i), dv2 + C * 0.3, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); const t1 = P(U(i), dv1, 0), t2 = P(U(i), dv2, 0); g.moveTo(t1[0] - 2.5, t1[1] + 2.5); g.lineTo(t1[0] + 2.5, t1[1] - 2.5); g.moveTo(t2[0] - 2.5, t2[1] + 2.5); g.lineTo(t2[0] + 2.5, t2[1] - 2.5); }
        { const a = P(U(xi0), dv1, 0), b = P(U(xi1), dv1, 0), c2 = P(U(xi0), dv2, 0), d2 = P(U(xi1), dv2, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.moveTo(c2[0], c2[1]); g.lineTo(d2[0], d2[1]); }
        g.stroke();
        for (let i = xi0; i < xi1; i += B * (W < 760 ? 2 : 1)) { const m0 = P(U(i + B / 2), dv2, 0); g.fillText((B * 1200).toLocaleString("en-US"), m0[0], m0[1] - fsm * 0.7); }
        { const m0 = P((U(xi0) + U(xi1)) / 2, dv1, 0); g.font = `${fsb}px ${css("--sans") || "sans-serif"}`; g.fillText(((xi1 - xi0) * 1200).toLocaleString("en-US"), m0[0], m0[1] - fsb * 0.75); }
        // 왼쪽 세로 치수: 줄 간격
        g.font = `${fsm}px ${css("--sans") || "sans-serif"}`; g.beginPath();
        const du = U(xi0) - X * 0.45;
        for (let j = xj0; j <= xj1; j += B) { const t1 = P(du, V(j), 0); g.moveTo(t1[0] - 2.5, t1[1] + 2.5); g.lineTo(t1[0] + 2.5, t1[1] - 2.5); }
        { const a = P(du, V(xj0), 0), b = P(du, V(xj1), 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
        g.stroke(); g.textAlign = "right";
        for (let j = xj0; j < xj1; j += B) { const m0 = P(du, V(j + B / 2), 0); g.fillText((B * 1200).toLocaleString("en-US"), m0[0] - 4, m0[1]); }
        g.restore();
        // 전체 치수선
        const yy = V(gj1) + ext + 4, a = P(U(i0), yy, 0), b = P(U(i1 + 1), yy, 0);
        g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]);
        [a, b].forEach(([x, y]) => { g.moveTo(x - 4, y + 4); g.lineTo(x + 4, y - 4); });
        g.stroke(); g.fillText(`${((i1 + 1 - i0) * 1.2).toFixed(1)} m — ${i1 + 1 - i0} modules × 1.2 m`, (a[0] + b[0]) / 2, a[1] - 9);
        g.globalAlpha = fade;
      }

      // 1.5) 대지: 경계선과 포장 줄눈 (도로·가로수는 핀 #368로 뺐어요)
      if (pA > 0.01) {
        const ga = fade * ease((t - 0.9) / 1);
        g.globalAlpha = ga; g.lineWidth = 0.75;
        const Ln = (u0, v0, u1, v1) => { const a = P(u0, v0, 0), b = P(u1, v1, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); };
        const ra = U(gi0) - ext * 1.2, rb = U(gi1) + ext * 1.2, r0 = V(gj0) - ext - C * 6.2, r1 = r0 + C * 2.6, sw = r1 + C * 1.1;
        // 대지 경계선(일점쇄선)과 포장 줄눈(아주 옅게)
        g.setLineDash([C, 3, 2, 3]); g.strokeStyle = col.mix(col.dark ? 0.35 : 0.25); g.beginPath();
        const bu0 = U(i0) - C * 1.5, bu1 = U(i1 + 1) + C * 1.5, bv0 = V(j0) - C * 1.5, bv1 = V(j1 + 1) + C * 1.5;
        Ln(bu0, bv0, bu1, bv0); Ln(bu1, bv0, bu1, bv1); Ln(bu1, bv1, bu0, bv1); Ln(bu0, bv1, bu0, bv0); g.stroke(); g.setLineDash([]);
        g.strokeStyle = col.mix(col.dark ? 0.16 : 0.06); g.beginPath();
        for (let u = bu0; u <= bu1; u += C * 2) Ln(u, bv0, u, bv1);
        for (let v = bv0; v <= bv1; v += C * 2) Ln(bu0, v, bu1, v);
        g.stroke();
        g.globalAlpha = fade; g.lineWidth = 1;
      }

      // 1.6) 대지 둘레 순환 도로: 아주 연하게 (차선 경계 + 가운데 점선)
      if (build.road && gA > 0.5) {
        const rd = build.road, ga = fade * ease((t - 5.15) / 1);
        if (ga > 0.01) {
          g.globalAlpha = ga; g.lineWidth = 0.6;
          const band = (st, o) => { const n = st.vert ? [1, 0] : [0, 1], a = P(st.a[0] + n[0] * o, st.a[1] + n[1] * o, 0), b = P(st.b[0] + n[0] * o, st.b[1] + n[1] * o, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); };
          const fillB = (st) => { const n = st.vert ? [1, 0] : [0, 1], w = rd.w, q = [P(st.a[0] - n[0] * w, st.a[1] - n[1] * w, 0), P(st.b[0] - n[0] * w, st.b[1] - n[1] * w, 0), P(st.b[0] + n[0] * w, st.b[1] + n[1] * w, 0), P(st.a[0] + n[0] * w, st.a[1] + n[1] * w, 0)]; g.moveTo(q[0][0], q[0][1]); q.slice(1).forEach((p0) => g.lineTo(p0[0], p0[1])); g.closePath(); };
          g.beginPath(); build.streets.forEach(fillB); g.fillStyle = col.mix(col.dark ? 0.018 : 0.014); g.fill("nonzero");
          g.strokeStyle = col.mix(col.dark ? 0.16 : 0.09); g.beginPath(); build.streets.forEach((st) => { band(st, rd.w); band(st, -rd.w); }); g.stroke();
          g.setLineDash([C * 0.5, C * 0.5]); g.strokeStyle = col.mix(col.dark ? 0.18 : 0.12); g.beginPath(); build.streets.forEach((st) => band(st, 0)); g.stroke(); g.setLineDash([]);
          g.globalAlpha = fade;
        }
      }

      // 1.7) 작은 공원과 놀이터 (매스가 솟을 때 같이 자라나요)
      const pg = ease((t - 5.2) / 1) * fade;
      if (pg > 0.01 && build.parks) {
        g.globalAlpha = pg;
        const quad = (u0, v0, u1, v1) => { const q = [P(u0, v0, 0), P(u1, v0, 0), P(u1, v1, 0), P(u0, v1, 0)]; g.moveTo(q[0][0], q[0][1]); for (let k = 1; k < 4; k++) g.lineTo(q[k][0], q[k][1]); g.closePath(); };
        for (const pk of build.parks) {
          g.globalAlpha = pg * (pk.out ? 0.28 : 1); // 핀 #427: 대지 바깥 조경은 훨씬 연하게
          // 잔디: 아주 옅은 면 + 점점이 풀 무늬
          g.beginPath(); pk.cells.forEach((c) => quad(ox + c.i * C + 0.6, oy + c.j * C + 0.6, ox + (c.i + 1) * C - 0.6, oy + (c.j + 1) * C - 0.6));
          g.fillStyle = col.mix(col.dark ? 0.035 : 0.05); g.fill();
          g.fillStyle = col.mix(col.dark ? 0.25 : 0.2);
          pk.cells.forEach((c) => { for (let k = 0; k < 3; k++) { const [x, y] = P(ox + (c.i + hash(c.i, c.j, 30 + k)) * C, oy + (c.j + hash(c.i, c.j, 40 + k)) * C, 0); g.fillRect(x, y, 0.9, 0.9); } });
          // 산책길: 밝은 띠 + 양쪽 가는 경계선, 매스 사이를 이어요
          if (pk.path) {
            const w = C * 0.28;
            g.beginPath();
            pk.path.forEach((c) => { const cu = ox + (c.i + 0.5) * C, cv = oy + (c.j + 0.5) * C;
              if (c.j === pk.jm) quad(ox + c.i * C, cv - w, ox + (c.i + 1) * C, cv + w);
              if (c.i === pk.im) quad(cu - w, oy + c.j * C, cu + w, oy + (c.j + 1) * C); });
            g.fillStyle = col.bg; g.fill();
            g.beginPath();
            pk.path.forEach((c) => { const cu = ox + (c.i + 0.5) * C, cv = oy + (c.j + 0.5) * C;
              const L2 = (u0, v0, u1, v1) => { const a = P(u0, v0, 0), b = P(u1, v1, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); };
              if (c.j === pk.jm) { L2(ox + c.i * C, cv - w, ox + (c.i + 1) * C, cv - w); L2(ox + c.i * C, cv + w, ox + (c.i + 1) * C, cv + w); }
              if (c.i === pk.im) { L2(cu - w, oy + c.j * C, cu - w, oy + (c.j + 1) * C); L2(cu + w, oy + c.j * C, cu + w, oy + (c.j + 1) * C); } });
            g.strokeStyle = col.mix(col.dark ? 0.35 : 0.22); g.lineWidth = 0.5; g.stroke();
          }
          // 놀이터: 모래밭(점 원) + 그네 틀 + 미끄럼틀
          if (pk.play) {
            const { u, v } = pk.play, rr = C * 0.75;
            const [x, y] = P(u, v, 0);
            g.beginPath(); g.ellipse(x, y, rr, rr * K, 0, 0, 7); g.fillStyle = col.bg; g.fill(); g.strokeStyle = col.mix(col.dark ? 0.45 : 0.35); g.lineWidth = 0.6; g.stroke();
            g.fillStyle = col.mix(col.dark ? 0.4 : 0.3); for (let k = 0; k < 16; k++) { const a = k * 2.4, d = rr * 0.75 * Math.sqrt((k + 0.5) / 16); g.fillRect(x + Math.cos(a) * d, y + Math.sin(a) * d * K, 0.8, 0.8); }
            const sw0 = P(u - rr * 0.55, v - rr * 0.1, 0), sw1 = P(u + rr * 0.15, v - rr * 0.1, 0), hz = C * 0.55;
            g.beginPath(); g.moveTo(sw0[0], sw0[1]); g.lineTo(sw0[0], sw0[1] - hz); g.lineTo(sw1[0], sw1[1] - hz); g.lineTo(sw1[0], sw1[1]);
            [0.3, 0.7].forEach((k) => { const sx = sw0[0] + (sw1[0] - sw0[0]) * k; g.moveTo(sx, sw0[1] - hz); g.lineTo(sx, sw0[1] - hz * 0.25); });
            g.strokeStyle = col.mix(col.dark ? 0.55 : 0.45); g.stroke();
            const s0 = P(u + rr * 0.25, v + rr * 0.35, 0), s1 = P(u + rr * 0.75, v + rr * 0.35, 0);
            g.beginPath(); g.moveTo(s0[0], s0[1]); g.lineTo(s0[0], s0[1] - C * 0.45); g.lineTo(s1[0], s1[1]); g.stroke();
          }
          // 나무: 해 방향 그림자 → 둥근 수관
          const lxs = (sun - 0.5) * 2;
          pk.trees.sort((a, b) => a.v - b.v);
          const shade = (a) => col.mix(col.dark ? 0.06 + a * 0.45 : a);
          for (const tr of pk.trees) {
            const [x, y] = P(tr.u, tr.v, 0), R0 = tr.r;
            // 그림자: 해 반대쪽으로 길게
            const sl = tr.t === 2 ? 0.5 : tr.t === 1 ? 2.2 : 1.6;
            g.beginPath(); g.ellipse(x - lxs * R0 * sl, y + R0 * 0.25, R0 * (tr.t === 1 ? 0.7 : 1.1) + Math.abs(lxs) * R0 * sl * 0.5, R0 * K * 0.6, 0, 0, 7);
            g.fillStyle = col.dark ? "rgba(0,0,0,.5)" : col.mix(0.08); g.fill();
            if (tr.t === 2) {
              // 관목: 바닥에 붙은 작은 덤불 3덩이
              for (let k = 0; k < 3; k++) { const a = tr.s + k * 2.1; g.beginPath(); g.arc(x + Math.cos(a) * R0 * 0.7, y - R0 * 0.6 + Math.sin(a) * R0 * 0.3, R0 * 0.75, 0, 7); g.fillStyle = shade(0.2 - k * 0.03); g.fill(); }
            } else if (tr.t === 1) {
              // 침엽수: 줄기 + 두 단 원뿔, 해 쪽 반은 밝게
              const H1 = R0 * 3.4, w = R0 * 0.85;
              g.fillStyle = shade(0.45); g.fillRect(x - 0.35, y - R0 * 0.8, 0.7, R0 * 0.8);
              [[0, 1], [0.45, 0.72]].forEach(([o, sc]) => { const b = y - R0 * 0.7 - H1 * o, tp = b - H1 * 0.62 * sc;
                g.beginPath(); g.moveTo(x - w * sc, b); g.lineTo(x, tp); g.lineTo(x + w * sc, b); g.closePath(); g.fillStyle = shade(0.26); g.fill();
                g.beginPath(); g.moveTo(x, b); g.lineTo(x, tp); g.lineTo(x + (lxs >= 0 ? -1 : 1) * w * sc, b); g.closePath(); g.fillStyle = shade(0.15); g.fill(); });
            } else {
              // 활엽수: 줄기 + 겹친 뭉게 수관 (아래·그늘 쪽 진하게, 해 쪽 밝게)
              const hh = R0 * 1.9;
              g.fillStyle = shade(0.45); g.fillRect(x - 0.4, y - hh, 0.8, hh);
              const cx = x, cy = y - hh - R0 * 0.2;
              for (let k = 0; k < 4; k++) { const a = tr.s + k * 1.57; g.beginPath(); g.arc(cx + Math.cos(a) * R0 * 0.45, cy + Math.sin(a) * R0 * 0.3, R0 * 0.72, 0, 7); g.fillStyle = shade(0.24); g.fill(); }
              g.beginPath(); g.arc(cx + lxs * R0 * 0.25 - R0 * 0.1, cy - R0 * 0.25, R0 * 0.62, 0, 7); g.fillStyle = shade(0.15); g.fill();
              g.beginPath(); g.arc(cx + lxs * R0 * 0.35 - R0 * 0.2, cy - R0 * 0.42, R0 * 0.3, 0, 7); g.fillStyle = shade(0.08); g.fill();
            }
          }
        }
        g.globalAlpha = fade; g.lineWidth = 1;
      }

      // 1.9) 도면 → 건물 (핀 #408): 펜으로 평면 윤곽을 긋고 → 빗금(포셰) → 기둥 → 그 자리에서 건물이 올라와요
      const plA = REDUCED ? 0 : fade * (1 - ease((t - 4.6) / 0.9));
      if (plA > 0.01) {
        if (!build.edges) {
          const has = (i, j) => map.has(i + "," + j), E = [], I = [], cs = new Map();
          for (const m of mods) { const u0 = m.u, v0 = m.v, u1 = u0 + C, v1 = v0 + C;
            (has(m.i, m.j - 1) ? I : E).push([u0, v0, u1, v0]); if (!has(m.i, m.j + 1)) E.push([u0, v1, u1, v1]);
            (has(m.i - 1, m.j) ? I : E).push([u0, v0, u0, v1]); if (!has(m.i + 1, m.j)) E.push([u1, v0, u1, v1]);
            [[u0, v0], [u1, v0], [u0, v1], [u1, v1]].forEach(([u, v]) => cs.set(Math.round(u) + "," + Math.round(v), [u, v])); }
          const byU = (a, b) => a[0] + a[2] - b[0] - b[2]; E.sort(byU); I.sort(byU);
          build.edges = E; build.inner = I; build.cols = [...cs.values()];
          build.eu = [E.length ? E[0][0] : 0, E.length ? E[E.length - 1][2] : 1];
        }
        const [ua, ub] = build.eu, pen = ease((t - 0.45) / 1.6), su = ua + (ub - ua + C) * pen;
        const seg = (list) => { g.beginPath(); for (const e of list) { if ((e[0] + e[2]) / 2 > su) break; const a = P(e[0], e[1], 0), b = P(e[2], e[3], 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); } g.stroke(); };
        g.globalAlpha = plA * 0.5; g.strokeStyle = col.mix(0.3); g.lineWidth = 0.5; seg(build.inner);
        // 포셰: 윤곽 안을 45° 빗금으로
        const ha = ease((t - 1.6) / 0.6) * plA * (1 - ease((t - 2.8) / 0.8));
        if (ha > 0.01) {
          g.save(); g.beginPath(); for (const m of mods) { const q = [P(m.u, m.v, 0), P(m.u + C, m.v, 0), P(m.u + C, m.v + C, 0), P(m.u, m.v + C, 0)]; g.moveTo(q[0][0], q[0][1]); q.slice(1).forEach((p0) => g.lineTo(p0[0], p0[1])); g.closePath(); }
          g.clip(); g.globalAlpha = ha * 0.55; g.strokeStyle = col.mix(0.45); g.lineWidth = 0.5; g.beginPath();
          for (let x = -H; x < W + H; x += 5) { g.moveTo(x, 0); g.lineTo(x + H, H); } g.stroke(); g.restore();
        }
        g.globalAlpha = plA; g.strokeStyle = col.mix(col.dark ? 0.85 : 0.8); g.lineWidth = 1.3; seg(build.edges);
        // 펜 끝
        if (pen > 0 && pen < 1) { const tip = P(su, oy + (rows / 2) * C, 0); g.fillStyle = col.mix(0.9); g.beginPath(); g.arc(tip[0], tip[1], 2, 0, 7); g.fill(); }
        // 기둥: 모듈 모서리마다 작은 사각 기둥
        const ca = ease((t - 2.05) / 0.5) * plA;
        if (ca > 0.01) { g.globalAlpha = ca; g.fillStyle = col.mix(0.85); const cz = 1.6; for (const [u, v] of build.cols) { const [x, y] = P(u, v, 0); g.fillRect(x - cz / 2, y - cz / 2, cz, cz); } }
        g.globalAlpha = fade;
      }
      // 단계 자막: 도면 → 구조 → 건축 → 도시
      if (!REDUCED && t < 7.8) {
        const PH = [[0.3, "01 — DRAWING · 도면"], [1.9, "02 — SETTING OUT · 측량·기초"], [2.6, "03 — CONSTRUCTION · 현장 시공"], [5.3, "04 — CITY · 도시"]];
        let k = PH.length - 1; while (k > 0 && t < PH[k][0]) k--;
        const t0k = PH[k][0], t1k = k < PH.length - 1 ? PH[k + 1][0] : 7.4, al = Math.min(ease((t - t0k) / 0.3), 1 - ease((t - (t1k - 0.25)) / 0.25)) * fade;
        if (al > 0.01) { g.globalAlpha = al; g.font = `500 10px ${getComputedStyle(document.body).fontFamily}`; g.textAlign = "center"; g.textBaseline = "alphabetic"; g.fillStyle = col.mix(0.6); g.fillText(PH[k][1], W / 2, H - 46); g.globalAlpha = fade; }
      }


      // 1.95) 현장 (핀 #415): 측량 말뚝 → 가설 울타리 → 타워크레인·비계가 층마다 건물을 올려요
      const site = REDUCED ? 0 : fade * ease((t - 1.9) / 0.5) * (1 - ease((t - 5.3) / 0.7));
      const FLs = C * 0.4, sfont = `${W < 760 ? 5 : 7.5}px ${css("--sans") || "sans-serif"}`;
      if (!build.cranes) build.cranes = (build.grp || []).map(([a0, a1], n) => { let jt = 1e9; for (const m of mods) if (m.i >= a0 && m.i <= a1) jt = Math.min(jt, m.j); return { a0, a1, u: U((a0 + a1 + 1) / 2) + C * (n % 2 ? 1.5 : -1.5), v: V(jt) - C * 2, ph: n * 1.37, side: n % 2 ? Math.PI : 0, L: Math.max(C * 5.5, (a1 + 1 - a0) * C * 0.9) }; });
      const sm3 = (x) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x)), seg = (f, a, b) => sm3((f - a) / (b - a));
      const crane = (k, Hc) => {
        let top = 0; for (const m of mods) if (m.i >= k.a0 && m.i <= k.a1 && m.z > top) top = m.z;
        const f = (((tr + k.ph * 1.9) % 6.5) + 6.5) % 6.5 / 6.5, sgn = k.side ? -1 : 1, hi = Hc * 0.78;
        const aP = k.side - sgn * 0.22, aD = k.side + sgn * 0.3, rP = k.L * 0.5, rD = k.L * 0.78, zD = Math.min(hi, top + C * 0.45);
        // 0 내림(집기) · 0.12 걸기 · 0.18 들어 올림 · 0.32 선회 · 0.55 내림(놓기) · 0.67 풀기 · 0.73 올림 · 0.85 되돌아감
        const sw = f < 0.32 ? 0 : f < 0.55 ? seg(f, 0.32, 0.55) : f < 0.85 ? 1 : 1 - seg(f, 0.85, 1);
        const z = f < 0.12 ? hi * (1 - seg(f, 0, 0.12)) : f < 0.18 ? 0 : f < 0.32 ? hi * seg(f, 0.18, 0.32) : f < 0.55 ? hi : f < 0.67 ? hi + (zD - hi) * seg(f, 0.55, 0.67) : f < 0.73 ? zD : f < 0.85 ? zD + (hi - zD) * seg(f, 0.73, 0.85) : hi;
        const a = aP + (aD - aP) * sw, ca = Math.cos(a), sa = Math.sin(a);
        return { ca, sa, tro: rP + (rD - rP) * sw, hz: Math.max(0, z), load: f >= 0.12 && f < 0.7, J: (d, zz, o = 0) => P(k.u + ca * d - sa * o, k.v + sa * d + ca * o, zz) };
      };
      const siteDraw = (late) => {
        if (site <= 0.01) return;
        g.lineWidth = 0.6;
        const Hc = C * 5.6 * ease((t - 2.2) / 0.7) + 0.01, cr = 0; /* 핀 #423: 타워크레인은 뺐어요 (코드는 남겨 둠) */
        if (!late) {
          // 측량 말뚝: 통심선 교점마다 십자와 말뚝, 좌표
          const pk = ease((t - 1.9) / 0.6) * (1 - ease((t - 3.0) / 0.6)) * site;
          if (pk > 0.01) {
            g.globalAlpha = pk; g.strokeStyle = col.mix(0.7); g.beginPath();
            for (let i = gi0; i <= gi1; i += B) for (let j = gj0; j <= gj1; j += B) { const [x, y] = P(U(i), V(j), 0); g.moveTo(x - 4, y); g.lineTo(x + 4, y); g.moveTo(x, y - 4); g.lineTo(x, y + 4); g.moveTo(x + 1.5, y - 1.5); g.lineTo(x + 1.5, y - 7); }
            g.stroke();
            if (W >= 760) { g.font = sfont; g.fillStyle = col.mix(0.5); g.textAlign = "left";
              for (let i = gi0; i <= gi1; i += B * 2) { const [x, y] = P(U(i), V(gj0), 0); g.fillText(`X ${((i - gi0) * 1.2).toFixed(3)}`, x + 4, y - 9); } }
          }
          // 가설 울타리(가림막)와 정문
          g.globalAlpha = site * 0.9; g.strokeStyle = col.mix(col.dark ? 0.5 : 0.42);
          const fu0 = U(i0) - C * 1.6, fu1 = U(i1 + 1) + C * 1.6, fv0 = V(j0) - C * 3.2, fv1 = V(j1 + 1) + C * 1.6, fh = C * 0.35, gate = (fu0 + fu1) / 2;
          const fence = (a, b) => { const n = Math.max(2, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / (C * 1.2))); g.beginPath();
            for (let k = 0; k <= n; k++) { const u = a[0] + ((b[0] - a[0]) * k) / n, v = a[1] + ((b[1] - a[1]) * k) / n, p0 = P(u, v, 0), p1 = P(u, v, fh); g.moveTo(p0[0], p0[1]); g.lineTo(p1[0], p1[1]); }
            [fh, fh * 0.5].forEach((z) => { const A = P(a[0], a[1], z), Bq = P(b[0], b[1], z); g.moveTo(A[0], A[1]); g.lineTo(Bq[0], Bq[1]); }); g.stroke(); };
          fence([fu0, fv0], [fu1, fv0]); fence([fu0, fv0], [fu0, fv1]); fence([fu1, fv0], [fu1, fv1]); fence([fu0, fv1], [gate - C * 2, fv1]); fence([gate + C * 2, fv1], [fu1, fv1]);
          if (W >= 760) { g.font = sfont; g.fillStyle = col.mix(0.55); g.textAlign = "center"; const [x, y] = P(gate, fv1, 0); g.fillText("SITE ENTRANCE · 가설 울타리 H 1,800", x, y + 11); }
          // 크레인 마스트 (매스 뒤라서 먼저 그려 가려지게): 정사각 격자 기둥이 기초 위에서 한 단씩 올라가요
          if (cr > 0.01) { g.globalAlpha = cr;
            for (const k of build.cranes) {
              const w = C * 0.3, Q = (du, dv, z) => P(k.u + du, k.v + dv, z), L2 = (a, b) => { g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); };
              // 기초 패드
              const f0 = Q(-w * 3, -w * 3, 0), f1 = Q(w * 3, -w * 3, 0), f2 = Q(w * 3, w * 3, 0), f3 = Q(-w * 3, w * 3, 0);
              g.beginPath(); g.moveTo(f0[0], f0[1]); [f1, f2, f3].forEach((q) => g.lineTo(q[0], q[1])); g.closePath(); g.fillStyle = col.mix(col.dark ? 0.08 : 0.06); g.fill(); g.strokeStyle = col.mix(0.45); g.lineWidth = 0.5; g.stroke();
              g.strokeStyle = col.mix(col.dark ? 0.8 : 0.68); g.lineWidth = 0.8; g.beginPath();
              [[-w, -w], [w, -w], [w, w], [-w, w]].forEach(([a, b]) => L2(Q(a, b, 0), Q(a, b, Hc)));
              g.stroke(); g.lineWidth = 0.4; g.beginPath();
              const st = w * 2;
              for (let z = 0; z + st <= Hc + 0.01; z += st) {
                // 앞면(+v)과 오른쪽 면(+u)의 마름모 가새
                L2(Q(-w, w, z), Q(w, w, z + st / 2)); L2(Q(w, w, z + st / 2), Q(-w, w, z + st));
                L2(Q(w, -w, z), Q(w, w, z + st / 2)); L2(Q(w, w, z + st / 2), Q(w, -w, z + st));
                if ((z / st) % 3 < 1) { L2(Q(-w, w, z), Q(w, w, z)); L2(Q(w, -w, z), Q(w, w, z)); }
              }
              g.stroke();
            } }
          // 기둥 주석 (구조 단계): 지시선 + 규격
          const la = site * ease((t - 2.1) / 0.4) * (1 - ease((t - 3.4) / 0.5));
          if (la > 0.01 && build.cols && build.cols.length && W >= 760) {
            g.globalAlpha = la; g.strokeStyle = col.mix(0.55); g.fillStyle = col.mix(0.6); g.font = sfont; g.textAlign = "left";
            const pick = (fu, fv) => build.cols.reduce((b, c) => (Math.hypot(c[0] - fu, c[1] - fv) < Math.hypot(b[0] - fu, b[1] - fv) ? c : b));
            [[U(i0) + (U(i1) - U(i0)) * 0.12, V(j0), "GLT COLUMN □300 @ 1,200", -1], [U(i0) + (U(i1) - U(i0)) * 0.55, V(j1 + 1), "FOOTING F1 1,500 × 1,500 × 600", 1], [U(i0) + (U(i1) - U(i0)) * 0.86, V(j0), "ANCHOR BOLT M24 × 4", -1]].forEach(([fu, fv, txt, dir]) => {
              const [cu, cv2] = pick(fu, fv), [x, y] = P(cu, cv2, 0), ex = x + C * 1.5, ey = y + dir * C * 2.4;
              g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.moveTo(x, y); g.lineTo(ex, ey); g.lineTo(ex + C * 1.2, ey); g.stroke(); g.fillText(txt, ex + C * 1.4, ey + 0.5); });
          }
        } else {
          // 비계: 올라가는 중인 매스 앞면에 층마다 발판, 위로 한 층 더 솟은 기둥
          g.globalAlpha = site * 0.85; g.strokeStyle = col.mix(col.dark ? 0.55 : 0.45); g.lineWidth = 0.5; g.beginPath();
          for (const m of mods) { const ds = RISE(m), q = (t - ds) / DUR; if (q <= 0 || q >= 1.15 || map.has(m.i + "," + (m.j + 1))) continue;
            const v1 = m.v + C + C * 0.12, top = m.z + FLs * 0.9;
            [m.u, m.u + C].forEach((u) => { const a = P(u, v1, 0), b = P(u, v1, top); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); });
            for (let h = FLs; h <= top; h += FLs) { const a = P(m.u, v1, h), b = P(m.u + C, v1, h); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
            const a = P(m.u, v1, 0), b = P(m.u + C, v1, Math.min(top, FLs)); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
          g.stroke(); g.lineWidth = 0.6;
          // 크레인 위쪽 (매스 위로): 운전실·탑두·삼각 트러스 지브·카운터 지브·평형추·인장 케이블·트롤리·훅·자재
          const up = cr * ease((t - 2.75) / 0.35); // 마스트가 다 선 뒤에 지브가 얹혀요
          if (up > 0.01) {
            build.cranes.forEach((k, n) => {
              const S = crane(k, Hc), { J } = S, Lf = k.L, Lb = k.L * 0.3, hj = C * 0.34, wj = C * 0.17, peak = C * 1.4, L2 = (a, b) => { g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); };
              const ink = col.mix(col.dark ? 0.82 : 0.7), thin = col.mix(col.dark ? 0.6 : 0.5);
              g.globalAlpha = up;
              // 지브: 아래 두 현재 + 위 현재 (끝으로 갈수록 가늘게)
              g.strokeStyle = ink; g.lineWidth = 0.7; g.beginPath();
              L2(J(0, Hc, -wj), J(Lf, Hc, -wj * 0.3)); L2(J(0, Hc, wj), J(Lf, Hc, wj * 0.3)); L2(J(0, Hc + hj), J(Lf, Hc + hj * 0.25));
              // 카운터 지브: 평평한 두 현재 + 난간
              L2(J(0, Hc, -wj * 1.2), J(-Lb, Hc, -wj * 1.2)); L2(J(0, Hc, wj * 1.2), J(-Lb, Hc, wj * 1.2)); L2(J(-Lb, Hc, -wj * 1.2), J(-Lb, Hc, wj * 1.2));
              // 탑두 A형 프레임
              L2(J(-C * 0.2, Hc, -wj), J(0, Hc + peak)); L2(J(C * 0.2, Hc, wj), J(0, Hc + peak)); L2(J(-C * 0.2, Hc, wj), J(0, Hc + peak));
              g.stroke();
              // 지브 래티스: 위 현재에서 아래 현재로 번갈아 지그재그
              g.lineWidth = 0.35; g.strokeStyle = thin; g.beginPath();
              const nseg = Math.max(6, Math.round(Lf / (C * 0.38)));
              for (let q = 0; q < nseg; q++) { const d0 = (Lf * q) / nseg, d1 = (Lf * (q + 1)) / nseg, tp = (d) => J(d, Hc + hj * (1 - 0.75 * (d / Lf))), sd = q % 2 ? 1 : -1, bt = (d) => J(d, Hc, sd * wj * (1 - 0.7 * (d / Lf)));
                L2(tp(d0), bt(d1)); L2(bt(d1), tp(d1)); }
              for (let d = C * 0.3; d < Lb; d += C * 0.3) L2(J(-d, Hc, -wj * 1.2), J(-d, Hc, wj * 1.2));
              // 인장 케이블: 탑두 꼭대기 → 지브 0.6 지점, → 카운터 지브 끝
              L2(J(0, Hc + peak), J(Lf * 0.62, Hc + hj * 0.53)); L2(J(0, Hc + peak), J(-Lb, Hc, 0));
              g.stroke();
              // 평형추 블록 3개
              g.fillStyle = col.mix(col.dark ? 0.55 : 0.48);
              for (let b = 0; b < 3; b++) { const c0 = J(-Lb + C * 0.12 + b * C * 0.26, Hc, 0); g.fillRect(c0[0] - 1.6, c0[1] - 3.2, 3.2, 4.2); }
              // 운전실 (마스트 꼭대기 옆 작은 상자, 창 한 줄)
              { const c0 = J(C * 0.15, Hc - C * 0.32, wj * 2.2); g.fillStyle = col.bg; g.fillRect(c0[0] - 3, c0[1] - 3, 6, 4.5); g.lineWidth = 0.5; g.strokeStyle = ink; g.strokeRect(c0[0] - 3, c0[1] - 3, 6, 4.5); g.fillStyle = thin; g.fillRect(c0[0] - 2.2, c0[1] - 2.2, 4.4, 1.3); }
              // 트롤리 + 두 가닥 와이어 + 훅 블록
              const tp = J(S.tro, Hc), hk = J(S.tro, S.hz + C * 0.28);
              g.fillStyle = ink; g.fillRect(tp[0] - 2.2, tp[1] - 0.8, 4.4, 2);
              g.lineWidth = 0.35; g.strokeStyle = ink; g.beginPath(); g.moveTo(tp[0] - 1, tp[1] + 1); g.lineTo(hk[0] - 1, hk[1]); g.moveTo(tp[0] + 1, tp[1] + 1); g.lineTo(hk[0] + 1, hk[1]); g.stroke();
              g.beginPath(); g.moveTo(hk[0] - 2, hk[1]); g.lineTo(hk[0] + 2, hk[1]); g.lineTo(hk[0] + 1.2, hk[1] + 2.6); g.lineTo(hk[0] - 1.2, hk[1] + 2.6); g.closePath(); g.fillStyle = ink; g.fill();
              // 자재 (모듈 한 칸): 슬링 두 줄 + 작은 상자
              if (S.load) {
                const lz = S.hz, bw = C * 0.5, bd = C * 0.32, bh = C * 0.2, Bx = (du, dv, z) => P(k.u + S.ca * S.tro + du, k.v + S.sa * S.tro + dv, z);
                const t0q = [Bx(-bw, -bd, lz + bh), Bx(bw, -bd, lz + bh), Bx(bw, bd, lz + bh), Bx(-bw, bd, lz + bh)], fr = [Bx(-bw, bd, lz), Bx(bw, bd, lz), Bx(bw, bd, lz + bh), Bx(-bw, bd, lz + bh)];
                g.beginPath(); g.moveTo(hk[0], hk[1] + 2.6); g.lineTo(t0q[0][0], t0q[0][1]); g.moveTo(hk[0], hk[1] + 2.6); g.lineTo(t0q[1][0], t0q[1][1]); g.strokeStyle = thin; g.stroke();
                [[fr, col.mix(col.dark ? 0.3 : 0.22)], [t0q, col.bg]].forEach(([q, fc]) => { g.beginPath(); g.moveTo(q[0][0], q[0][1]); q.slice(1).forEach((p0) => g.lineTo(p0[0], p0[1])); g.closePath(); g.fillStyle = fc; g.fill(); g.lineWidth = 0.5; g.strokeStyle = ink; g.stroke(); });
              }
              if (W >= 760) { const top = J(0, Hc + peak); g.globalAlpha = up * 0.9; g.font = sfont; g.fillStyle = col.mix(0.55); g.textAlign = "left"; g.fillText(`TC-${String(n + 1).padStart(2, "0")} · R ${((Lf / C) * 1.2).toFixed(1)} m · H ${((Hc / FLs) * 3.3).toFixed(1)} m`, top[0] + 5, top[1] - 3); }
            });
          }
        }
        g.globalAlpha = fade; g.lineWidth = 1;
      };
      siteDraw(false);
      // 주변 매스: 도시 단계에서 아주 연하게 솟아요 (반투명 면 + 옅은 선)
      if (build.ctx && fade > 0.01) {
        const ca = REDUCED ? 1 : ease((t - 5.15) / 1.1);
        if (ca > 0.01) {
          g.lineWidth = 0.5;
          for (const b of build.ctx) {
            const k = REDUCED ? 1 : ease((t - 5.15 - b.dl) / 1.0); if (k <= 0) continue;
            const h = b.h * k * (1 - p), u0 = b.u, u1 = b.u + b.w, v0 = b.v, v1 = b.v + b.d;
            const q = (pts) => { g.beginPath(); pts.forEach(([u, v, z], n) => { const [x, y] = P(u, v, z); n ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); };
            g.globalAlpha = fade * k * 0.55;
            q([[u0, v0, h], [u1, v0, h], [u1, v1, h], [u0, v1, h]]); g.fillStyle = col.dark ? "rgba(255,255,255,.025)" : "rgba(255,255,255,.55)"; g.fill(); g.strokeStyle = col.mix(col.dark ? 0.14 : 0.1); g.stroke();
            q([[u0, v1, 0], [u1, v1, 0], [u1, v1, h], [u0, v1, h]]); g.fillStyle = col.mix(col.dark ? 0.03 : 0.025); g.fill(); g.stroke();
            q([[u0, v0, 0], [u0, v1, 0], [u0, v1, h], [u0, v0, h]]); g.fillStyle = col.mix(col.dark ? 0.02 : 0.04); g.fill(); g.stroke();
          }
          g.globalAlpha = fade; g.lineWidth = 1;
        }
      }

      // 2) 매스: 그림자 → (뒤에서 앞으로) 앞면·옆면·윗면
      const R = Math.max(80, W * 0.08), lx = (sun - 0.5) * 2;
      const sdx = -lx * 0.9, sdy = 0.55; // 그림자 방향 (평면 위)
      let moving = Math.abs(sunT - sun) > 0.002;
      for (const m of mods) {
        const on = 1, ds = RISE(m), q = (t - ds) / DUR;
        const [sx, sy] = P(m.u + C / 2, m.v + C / 2, m.z);
        const dd = Math.hypot(sx - mx, sy - my);
        const lt = dd < R && p < 0.5 ? (1 - dd / R) ** 2 : 0;
        m.hd = (m.hd || 0) + (lt - (m.hd || 0)) * 0.15; if (Math.abs(lt - m.hd) > 0.01) moving = true;
        if (drag) { const [bx, by] = P(m.u + C / 2, m.v + C / 2, 0), d = Math.hypot(bx - drag.x, by - drag.y), Rd = C * 9;
          if (d < Rd) { const f = (1 - d / Rd) ** 1.6, want = Math.max(-m.H * 0.85, (drag.y - my) * 1.15 * f); if (Math.abs(want) > Math.abs(m.ext || 0) || Math.sign(want) !== Math.sign(m.ext || 0)) m.ext = want; } }
        else if (m.ext) { m.ext *= 0.997; if (Math.abs(m.ext) < 0.3) m.ext = 0; }
        if (m.ext) moving = true;
        const tz = (m.H * rise * on + lt * C * 4 + (m.ext || 0)) * (1 - p);
        m.vz = (m.vz + (tz - m.z) * 0.12) * 0.74; m.z += m.vz;
        if (REDUCED) m.z = tz;
        else if (q < 1) {
          // 공사: 도면 위 자리에서 한 층(FL)씩 올라와요. 층마다 빠르게 오르고 잠깐 멈춰요
          const hz = m.H * (1 - p), n = Math.max(1, Math.round(hz / (C * 0.4))), sq = Math.max(0, q) * n, k = Math.floor(sq);
          m.z = q <= 0 ? 0 : (hz * (k + ease(Math.min(1, (sq - k) * 2.2)))) / n;
          m.vz = 0; moving = true; m.base = 0;
        } else if (m.base) { m.base = 0;
        }
        if (Math.abs(m.vz) > 0.02 || Math.abs(tz - m.z) > 0.05) moving = true;
      }
      // 그림자 (한 경로로 모아서 옅게)
      if (rise > 0) {
        const sh = new Path2D();
        for (const m of mods) {
          if (m.z < 0.5 || m.base) continue;
          const L = m.z / C * 0.9, dx = sdx * L * C, dy = sdy * L * C;
          const q = [[m.u, m.v], [m.u + C, m.v], [m.u + C, m.v + C], [m.u, m.v + C]].map(([u, v]) => [u, v]);
          const pts = q.concat(q.map(([u, v]) => [u + dx, v + dy])).map(([u, v]) => P(u, v, 0));
          pts.sort((a, b) => a[0] - b[0] || a[1] - b[1]);
          const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
          const lo = [], up = [];
          for (const pt of pts) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], pt) <= 0) lo.pop(); lo.push(pt); }
          for (let k = pts.length - 1; k >= 0; k--) { const pt = pts[k]; while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], pt) <= 0) up.pop(); up.push(pt); }
          const hull = lo.slice(0, -1).concat(up.slice(0, -1));
          sh.moveTo(hull[0][0], hull[0][1]); for (let k = 1; k < hull.length; k++) sh.lineTo(hull[k][0], hull[k][1]); sh.closePath();
        }
        g.fillStyle = col.dark ? "rgba(0,0,0,.55)" : col.mix(0.07); g.fill(sh, "nonzero");
      }
      // 평면 칸 (아직 솟기 전)과 매스
      const fFront = col.mix(col.dark ? 0.15 : 0.2 + 0.08 * Math.max(0, -lx)), fLeft = col.mix(col.dark ? 0.09 : 0.08 + 0.16 * Math.max(0, lx)), fTop = col.bg;
      g.lineWidth = 0.5; g.strokeStyle = col.mix(col.dark ? 0.45 : 0.4); g.lineJoin = "round";
      // 다크 모드: 층마다 창에 불이 켜져요 (켜진 창은 칸·층마다 정해져 있고, 클릭하면 바뀌어요)
      const lights = (m, ua, ub, va, vb, zb, z, side) => {
        const FL = C * 0.4;
        for (let h = 0, fl = 0; h + FL <= z + 0.5; h += FL, fl++) {
          if (h < zb) continue;
          for (let w = 0; w < 2; w++) {
            const q = hash(m.i * 3 + w, m.j * 5 + fl, seed + side * 17);
            if (q > 0.42) continue;
            const a0 = 0.12 + w * 0.5, a1 = a0 + 0.3, h0 = h + FL * 0.28, h1 = h + FL * 0.78;
            const L = (k) => [ua + (ub - ua) * k, va + (vb - va) * k];
            const pa = L(a0), pb = L(a1);
            const pts = [P(pa[0], pa[1], h0), P(pb[0], pb[1], h0), P(pb[0], pb[1], h1), P(pa[0], pa[1], h1)];
            const lit = q < 0.12 ? 0.95 : 0.7;
            g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < 4; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath();
            if (col.dark) {
              g.shadowColor = "rgba(255,255,255,.55)"; g.shadowBlur = 6;
              g.fillStyle = `rgba(245,245,240,${lit * (side ? 0.8 : 1)})`; g.fill();
              g.shadowBlur = 0;
            } else {
              // 핀 #431: 라이트 모드에서도 창에서 빛이 새어 나와요. 회색 벽 위에 흰 창 + 흰 번짐, 창 아래 얇은 창턱 그림자
              g.shadowColor = "rgba(255,255,255,.95)"; g.shadowBlur = lit > 0.9 ? 9 : 5;
              g.fillStyle = `rgba(255,255,255,${lit * (side ? 0.85 : 1)})`; g.fill(); g.fill();
              g.shadowBlur = 0;
              g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); g.lineTo(pts[1][0], pts[1][1]); g.strokeStyle = col.mix(0.45); g.lineWidth = 0.4; g.stroke(); g.strokeStyle = col.mix(0.4); g.lineWidth = 0.5;
            }
          }
        }
      };
      // 마우스 근처 매스: 커튼월 상세가 서서히 드러나요
      const detail = (m, ua, ub, va, vb, zb, z) => {
        const FL = C * 0.4, L = (k) => [ua + (ub - ua) * k, va + (vb - va) * k];
        g.globalAlpha = fade * Math.min(1, m.hd * 1.6);
        // 유리면: 층마다 위쪽이 살짝 밝은 판
        for (let h = Math.max(zb, 0); h + 0.5 < z; h += FL) {
          const h0 = h + FL * 0.12, h1 = Math.min(z, h + FL) - FL * 0.08; if (h1 <= h0) continue;
          const a = L(0.04), b = L(0.96), pts = [P(a[0], a[1], h0), P(b[0], b[1], h0), P(b[0], b[1], h1), P(a[0], a[1], h1)];
          const gr = g.createLinearGradient(pts[0][0], pts[3][1], pts[0][0], pts[0][1]);
          gr.addColorStop(0, col.dark ? "rgba(255,255,255,.10)" : "rgba(255,255,255,.55)"); gr.addColorStop(1, col.dark ? "rgba(255,255,255,.02)" : "rgba(0,0,0,.05)");
          g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < 4; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); g.fillStyle = gr; g.fill();
        }
        g.beginPath();
        // 멀리언 (세로 4칸)
        for (let k = 1; k < 4; k++) { const q = L(k / 4), a = P(q[0], q[1], Math.max(zb, 0)), b = P(q[0], q[1], z); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
        // 트랜섬 (층마다 두 줄: 슬래브 + 창턱)
        for (let h = Math.max(zb, 0) + FL; h < z - 0.5; h += FL) { const a = L(0), b = L(1); [h, h - FL * 0.12].forEach((hh) => { const p1 = P(a[0], a[1], hh), p2 = P(b[0], b[1], hh); g.moveTo(p1[0], p1[1]); g.lineTo(p2[0], p2[1]); }); }
        g.lineWidth = 0.45; g.strokeStyle = col.mix(col.dark ? 0.5 : 0.42); g.stroke();
        g.lineWidth = 0.5; g.strokeStyle = col.mix(col.dark ? 0.45 : 0.4); g.globalAlpha = fade;
      };
      const poly = (pts, fill) => { g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let k = 1; k < pts.length; k++) g.lineTo(pts[k][0], pts[k][1]); g.closePath(); g.fillStyle = fill; g.fill(); g.stroke(); };
      for (const m of mods) {
        const a = REDUCED || t >= RISE(m) ? 1 : 0;
        if (a <= 0.01) continue;
        g.globalAlpha = fade * Math.min(1, a);
        const z = m.z, u0 = m.u, u1 = m.u + C, v0 = m.v, v1 = m.v + C;
        if (z > 0.5) {
          const b0 = m.base || 0, fr0 = map.get(m.i + "," + (m.j + 1)), le0 = map.get(m.i - 1 + "," + m.j), fr = fr0 && !fr0.base && !b0 ? fr0 : null, le = le0 && !le0.base && !b0 ? le0 : null;
          const FL = C * 0.4; // 한 층 높이
          if (!fr || fr.z < z - 0.5) {
            poly([P(u0, v1, b0), P(u1, v1, b0), P(u1, v1, z), P(u0, v1, z)], fFront);
            const zb = fr ? Math.max(0, fr.z) : b0; g.beginPath();
            for (let h = FL; h < z - 1; h += FL) if (h > zb) { const a = P(u0, v1, h), b = P(u1, v1, h); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
            if (C > 7 && z > FL) { const a = P(u0 + C / 2, v1, Math.max(zb, 0) + 1), b = P(u0 + C / 2, v1, z - 1); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
            g.strokeStyle = col.mix(col.dark ? 0.55 : 0.3); g.stroke(); g.strokeStyle = col.mix(col.dark ? 0.45 : 0.4);
            lights(m, u0, u1, v1, v1, zb, z, 0);
            if (m.hd > 0.04) detail(m, u0, u1, v1, v1, zb, z);
          }
          if (S > 0.01 && (!le || le.z < z - 0.5)) {
            poly([P(u0, v0, b0), P(u0, v1, b0), P(u0, v1, z), P(u0, v0, z)], fLeft);
            const zb = le ? Math.max(0, le.z) : b0; g.beginPath();
            for (let h = FL; h < z - 1; h += FL) if (h > zb) { const a = P(u0, v0, h), b = P(u0, v1, h); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
            g.strokeStyle = col.mix(col.dark ? 0.55 : 0.3); g.stroke(); g.strokeStyle = col.mix(col.dark ? 0.45 : 0.4);
            lights(m, u0, u0, v0, v1, zb, z, 1);
            if (m.hd > 0.04) detail(m, u0, u0, v0, v1, zb, z);
          }
        }
        // 윗면: 칸 선 없이 채우고, 글자 바깥 테두리만 진하게 (글자가 또렷하게 읽히도록)
        const tp = [P(u0, v0, z), P(u1, v0, z), P(u1, v1, z), P(u0, v1, z)];
        g.beginPath(); g.moveTo(tp[0][0], tp[0][1]); for (let k = 1; k < 4; k++) g.lineTo(tp[k][0], tp[k][1]); g.closePath(); g.fillStyle = fTop; g.fill();
        g.strokeStyle = col.mix(col.dark ? 0.25 : 0.14); g.stroke();
        if (m.hd > 0.04 && z > 1) {
          // 파라펫: 윗면 안쪽으로 한 번 더 그은 선 + 옥상 바닥 줄눈
          g.globalAlpha = fade * Math.min(1, m.hd * 1.6);
          const e = Math.min(1.6, C * 0.12), tq = [P(u0 + e, v0 + e, z), P(u1 - e, v0 + e, z), P(u1 - e, v1 - e, z), P(u0 + e, v1 - e, z)];
          g.beginPath(); g.moveTo(tq[0][0], tq[0][1]); for (let k = 1; k < 4; k++) g.lineTo(tq[k][0], tq[k][1]); g.closePath();
          const l1 = P(u0 + e, (v0 + v1) / 2, z), l2 = P(u1 - e, (v0 + v1) / 2, z), l3 = P((u0 + u1) / 2, v0 + e, z), l4 = P((u0 + u1) / 2, v1 - e, z);
          g.moveTo(l1[0], l1[1]); g.lineTo(l2[0], l2[1]); g.moveTo(l3[0], l3[1]); g.lineTo(l4[0], l4[1]);
          g.lineWidth = 0.5; g.strokeStyle = col.mix(col.dark ? 0.4 : 0.28); g.stroke();
          g.globalAlpha = fade;
        }
        const nb = (di, dj) => { const q = map.get(m.i + di + "," + (m.j + dj)); return !q || Math.abs(q.z - z) > 0.5; };
        g.beginPath();
        if (nb(0, -1)) { g.moveTo(tp[0][0], tp[0][1]); g.lineTo(tp[1][0], tp[1][1]); }
        if (nb(1, 0)) { g.moveTo(tp[1][0], tp[1][1]); g.lineTo(tp[2][0], tp[2][1]); }
        if (nb(0, 1)) { g.moveTo(tp[2][0], tp[2][1]); g.lineTo(tp[3][0], tp[3][1]); }
        if (nb(-1, 0)) { g.moveTo(tp[3][0], tp[3][1]); g.lineTo(tp[0][0], tp[0][1]); }
        g.lineWidth = 0.75; g.strokeStyle = col.mix(col.dark ? 0.42 : 0.5); g.stroke();
        // 옥상 파라펫·난간 (핀 #429): 바깥 테두리마다 낮은 벽(파라펫, 두께가 보이는 띠 + 안쪽 두겁선).
        // 옥상정원·테라스 동(약 1/3)은 파라펫 대신 기둥이 촘촘한 금속 난간을 둘러요
        if (z > C * 0.3 && C > 5) {
          const pz = C * 0.06, ei = C * 0.06, rail = !m.roof && hash(m.i >> 1, m.j >> 1, 91) < 0.34, rh = C * 0.17;
          const edges = [[0, -1, [u0, v0], [u1, v0], [0, 1]], [1, 0, [u1, v0], [u1, v1], [-1, 0]], [0, 1, [u1, v1], [u0, v1], [0, -1]], [-1, 0, [u0, v1], [u0, v0], [1, 0]]];
          for (const [di, dj, A, B, [ni, nj]] of edges) {
            if (!nb(di, dj)) continue;
            const q = map.get(m.i + di + "," + (m.j + dj)); if (q && q.z > z - C * 0.4) continue; // 더 높거나 한 층 미만 차이인 이웃 쪽은 생략 (외곽·단차 테두리에만)
            const vis = dj === 1 || di === -1, Lp = (pt, zz, inn = 0) => P(pt[0] + ni * inn, pt[1] + nj * inn, zz);
            if (!rail) {
              if (vis) { const f = [Lp(A, z), Lp(B, z), Lp(B, z + pz), Lp(A, z + pz)]; g.beginPath(); g.moveTo(f[0][0], f[0][1]); for (let k = 1; k < 4; k++) g.lineTo(f[k][0], f[k][1]); g.closePath(); g.fillStyle = dj === 1 ? fFront : fLeft; g.fill(); }
              const c = [Lp(A, z + pz), Lp(B, z + pz), Lp(B, z + pz, ei), Lp(A, z + pz, ei)];
              g.beginPath(); g.moveTo(c[0][0], c[0][1]); for (let k = 1; k < 4; k++) g.lineTo(c[k][0], c[k][1]); g.closePath(); g.fillStyle = fTop; g.fill();
              g.lineWidth = 0.4; g.strokeStyle = col.mix(col.dark ? 0.4 : 0.34); g.stroke();
              const i0p = Lp(A, z, ei), i1p = Lp(B, z, ei); g.beginPath(); g.moveTo(i0p[0], i0p[1]); g.lineTo(i1p[0], i1p[1]); g.lineWidth = 0.3; g.strokeStyle = col.mix(col.dark ? 0.25 : 0.14); g.stroke();
            } else {
              const n = Math.max(3, Math.round(C / 3.2)); g.beginPath();
              for (let k = 0; k <= n; k++) { const f = k / n, pt = [A[0] + (B[0] - A[0]) * f, A[1] + (B[1] - A[1]) * f], b0 = Lp(pt, z, ei * 0.4), b1 = Lp(pt, z + rh, ei * 0.4); g.moveTo(b0[0], b0[1]); g.lineTo(b1[0], b1[1]); }
              [rh, rh * 0.5].forEach((hh) => { const r0 = Lp(A, z + hh, ei * 0.4), r1 = Lp(B, z + hh, ei * 0.4); g.moveTo(r0[0], r0[1]); g.lineTo(r1[0], r1[1]); });
              g.lineWidth = 0.35; g.strokeStyle = col.mix(col.dark ? 0.5 : 0.45); g.stroke();
            }
          }
        }
        g.lineWidth = 0.5; g.strokeStyle = col.mix(col.dark ? 0.45 : 0.4);
      }
      siteDraw(true);
      // 높이 치수 (핀 #416): 가장 높은 동 오른쪽에 층마다 눈금, 3,300 반복과 레벨이 건물과 함께 자라요
      const hd = REDUCED ? 1 : fade * ease((t - 2.8) / 0.5);
      if (hd > 0.01 && W >= 760) {
        let tm = null; for (const m of mods) if (!tm || m.z > tm.z) tm = m;
        if (tm && tm.z > 2) {
          const du = U(i1 + 1) + C * 2.2, dv = V(j1 + 1), fs3 = 7, nF = Math.floor(tm.z / FLs + 0.01);
          g.globalAlpha = hd; g.strokeStyle = col.mix(col.dark ? 0.45 : 0.35); g.fillStyle = col.mix(0.55); g.lineWidth = 0.5; g.font = `${fs3}px ${css("--sans") || "sans-serif"}`;
          const a = P(du, dv, 0), b = P(du, dv, tm.z), c0 = P(du + C * 1.6, dv, 0), c1 = P(du + C * 1.6, dv, tm.z);
          g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.moveTo(c0[0], c0[1]); g.lineTo(c1[0], c1[1]);
          for (let k = 0; k <= nF; k++) { const q = P(du, dv, k * FLs); g.moveTo(q[0] - 2.5, q[1] + 2.5); g.lineTo(q[0] + 2.5, q[1] - 2.5); }
          [c0, c1].forEach((q) => { g.moveTo(q[0] - 3, q[1] + 3); g.lineTo(q[0] + 3, q[1] - 3); });
          const e0 = P(tm.u + C, tm.v + C, tm.z), e1 = P(du + C * 2, dv, tm.z); g.setLineDash([2, 2]); g.moveTo(e0[0] + 3, e0[1]); g.lineTo(e1[0], e1[1]); g.stroke(); g.setLineDash([]);
          g.textAlign = "right";
          const dense = FLs < 9, every = dense ? Math.max(2, Math.ceil(9 / FLs)) : 1;
          if (dense) { const q = P(du, dv, tm.z / 2); g.fillText(`3,300 × ${nF}`, q[0] - 5, q[1] + 2); } else for (let k = 0; k < nF; k++) { const q = P(du, dv, (k + 0.5) * FLs); g.fillText("3,300", q[0] - 4, q[1] + 2); }
          g.textAlign = "left";
          for (let k = 0; k <= nF; k++) { if (k && k < nF && k % every) continue; const q = P(du, dv, k * FLs); g.fillText(k === nF ? "RF" : k ? k + 1 + "F" : "1F ±0", q[0] + 5, q[1] + 2); }
          const mid = P(du + C * 1.6, dv, tm.z / 2); g.save(); g.translate(mid[0] + 4, mid[1]); g.rotate(-Math.PI / 2); g.textAlign = "center"; g.fillText(`${(nF * 3300).toLocaleString("en-US")} (GL+${(nF * 3.3).toFixed(1)})`, 0, 7); g.restore();
          g.globalAlpha = fade; g.lineWidth = 1;
        }
      }
      // 좌표 점선 (핀 #422): 마우스 아래 매스에서 X축(위 치수 줄)·Y축(왼쪽 치수 줄)·높이 치수까지 점선이 이어지고 좌표가 떠요
      if (!REDUCED && mx > -1e3 && p < 0.4 && t > 5.2) {
        let hm = null, best = C * 3.2;
        for (const m of mods) { const [x, y] = P(m.u + C / 2, m.v + C / 2, m.z), d = Math.hypot(x - mx, y - my); if (d < best) { best = d; hm = m; } }
        if (hm) {
          const cu = hm.u + C / 2, cvv = hm.v + C / 2, z = hm.z, ax = V(xj0) - X * 0.25; let ay = U(xi0) - X * 0.45; const hu = U(i1 + 1) + C * 2.2, hv = V(j1 + 1);
          const xs = ((cu - U(xi0)) / C) * 1200, ys = ((cvv - V(xj0)) / C) * 1200, zs = (z / (C * 0.4)) * 3300;
          const L2 = (a, b) => { g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }, base = P(cu, cvv, 0), topP = P(cu, cvv, z);
          // 핀 #430: Y축 끝이 화면 밖이면 화면 안(왼쪽 여백)에서 멈추게 해 점선과 좌표가 늘 보여요
          { const dxu = P(cu + 1, cvv, 0)[0] - base[0], want = Math.max(W < 760 ? 40 : 90, P(ay, cvv, 0)[0]); if (dxu > 0.01) ay = cu + (want - base[0]) / dxu; }
          g.globalAlpha = fade * 0.9; g.strokeStyle = col.mix(col.dark ? 0.7 : 0.55); g.lineWidth = 0.6; g.setLineDash([3, 3]); g.lineDashOffset = -tr * 12; g.beginPath();
          L2(base, P(cu, ax, 0)); L2(base, P(ay, cvv, 0)); L2(base, topP); L2(topP, P(hu, hv, z)); g.stroke(); g.setLineDash([]); g.lineDashOffset = 0;
          g.fillStyle = col.mix(0.85);
          [P(cu, ax, 0), P(ay, cvv, 0), P(hu, hv, z)].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 2.2, 0, 7); g.fill(); });
          g.beginPath(); g.arc(base[0], base[1], 2.6, 0, 7); g.strokeStyle = col.mix(0.85); g.stroke(); g.beginPath(); g.arc(topP[0], topP[1], 2, 0, 7); g.fill();
          g.font = `${W < 760 ? 6 : 8}px ${css("--sans") || "sans-serif"}`; g.fillStyle = col.mix(0.75); g.textBaseline = "middle";
          { const [x, y] = P(cu, ax, 0); g.textAlign = "center"; g.fillText("X " + Math.round(xs).toLocaleString("en-US"), x, y - 9); }
          { const [x, y] = P(ay, cvv, 0); g.textAlign = "right"; g.fillText("Y " + Math.round(ys).toLocaleString("en-US"), x - 6, y); }
          { const [x, y] = P(hu, hv, z); g.textAlign = "left"; g.fillText(`Z +${(zs / 1000).toFixed(1)} · ${Math.max(1, Math.round(z / (C * 0.4)))}F`, x + 6, y); }
          { g.textAlign = "left"; g.fillText(`(${(xs / 1000).toFixed(1)}, ${(ys / 1000).toFixed(1)}, ${(zs / 1000).toFixed(1)})`, topP[0] + 7, topP[1] - 8); }
          g.textBaseline = "alphabetic"; g.globalAlpha = fade; g.lineWidth = 1;
          moving = true;
        }
      }
      // 3) 도면 주석 (매스가 솟은 뒤 나타나요)
      const an = ease((t - 5.4) / 0.9) * fade;
      if (an > 0.01) {
        g.globalAlpha = an; g.lineWidth = 0.75; g.strokeStyle = col.mix(col.dark ? 0.5 : 0.35); g.fillStyle = col.mid;
        g.font = `${W < 760 ? 6.5 : 10}px ${css("--sans") || "sans-serif"}`; g.textAlign = "center"; g.textBaseline = "middle";
        const tick = (x, y) => { g.moveTo(x - 3, y + 3); g.lineTo(x + 3, y - 3); };
        // 동(글자)별 치수 체인
        const cy2 = V(gj1) + ext + 4 + C * 2.2;
        g.beginPath();
        (build.grp || []).forEach(([a0, a1], n) => {
          const a = P(U(a0), cy2, 0), b = P(U(a1 + 1), cy2, 0);
          g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); tick(a[0], a[1]); tick(b[0], b[1]);
          for (let i = a0 + 1; i <= a1; i++) { const q = P(U(i), cy2, 0); g.moveTo(q[0], q[1] - 1.5); g.lineTo(q[0], q[1] + 1.5); }
          const top = P(U(a0), V(j1 + 1), 0); g.moveTo(a[0], a[1] + 4); g.lineTo(top[0], top[1] + 3);
          if (W >= 760 || n % 2 === 0) { g.fillText(((a1 + 1 - a0) * 1200).toLocaleString("en-US"), (a[0] + b[0]) / 2, a[1] + 9); g.save(); g.font = `${W < 760 ? 5 : 7.5}px ${css("--sans") || "sans-serif"}`; g.fillStyle = col.soft || col.mid; g.fillText(`${a1 + 1 - a0} × 1,200`, (a[0] + b[0]) / 2, a[1] + (W < 760 ? 16 : 20)); g.restore(); }
        });
        g.stroke();
        // 더 촘촘한 치수 (핀 #416): 동 사이 간격, 1,200 모듈 눈금 줄, 치수 보조선, 모서리 레벨
        { const fs2 = W < 760 ? 5 : 7, cy3 = cy2 + C * 1.7, G = build.grp || [];
          g.save(); g.font = `${fs2}px ${css("--sans") || "sans-serif"}`; g.strokeStyle = col.mix(col.dark ? 0.4 : 0.28); g.lineWidth = 0.5; g.beginPath();
          for (let n = 0; n < G.length - 1; n++) { const a = P(U(G[n][1] + 1), cy2, 0), b = P(U(G[n + 1][0]), cy2, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
          { const a = P(U(i0), cy3, 0), b = P(U(i1 + 1), cy3, 0); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); }
          for (let i = i0; i <= i1 + 1; i++) { const q = P(U(i), cy3, 0), k = (i - i0) % B === 0 ? 2.8 : 1.4; g.moveTo(q[0] - k, q[1] + k); g.lineTo(q[0] + k, q[1] - k); }
          G.forEach(([a0, a1]) => [a0, a1 + 1].forEach((i) => { const s0 = P(U(i), V(j1 + 1) + C * 0.5, 0), e = P(U(i), cy3 + C * 0.5, 0); g.moveTo(s0[0], s0[1]); g.lineTo(e[0], e[1]); }));
          g.stroke(); g.fillStyle = col.mix(0.5); g.textAlign = "center";
          for (let n = 0; n < G.length - 1; n++) { const a = P(U(G[n][1] + 1), cy2, 0), b = P(U(G[n + 1][0]), cy2, 0); if (b[0] - a[0] > 16) g.fillText(((G[n + 1][0] - G[n][1] - 1) * 1200).toLocaleString("en-US"), (a[0] + b[0]) / 2, a[1] - 6); }
          if (C >= 10) for (let i = i0; i <= i1; i++) { const q = P(U(i + 0.5), cy3, 0); g.fillText("12", q[0], q[1] + 7); }
          for (let i = i0; i < i1 + 1; i += B) { const q = P(U(i), cy3, 0); g.fillText(String(Math.round((i - i0) * 1.2 * 10) / 10), q[0], q[1] - 6); }
          g.textAlign = "left"; { const q = P(U(i1 + 1), cy3, 0); g.fillText("MODULE 1,200 (×100 mm)", q[0] + 8, q[1] + 2); }
          // 동 모서리 레벨: 바닥 ±0, 대지 경계까지 이격 거리
          if (W >= 760) G.forEach(([a0], n) => { if (n % 2) return; const q = P(U(a0), V(j0) - C * 0.6, 0); g.fillText(`▽ GL ±0 · SETBACK ${(((a0 - gi0) * 1.2) + 4.8).toFixed(1)} m`, q[0], q[1]); });
          g.restore(); }
        // 단면 표시 A—A: 가운데 줄을 가로지르는 일점쇄선 + 원 + 보는 방향 삼각형
        const jm = Math.round((j0 + j1) / 2), vs = V(jm) + C / 2, sa = P(U(gi0) - ext * 1.6, vs, 0), sb = P(U(gi1) + ext * 1.6, vs, 0);
        g.setLineDash([10, 4, 2, 4]); g.beginPath(); g.moveTo(sa[0] + 10, sa[1]); g.lineTo(sb[0] - 10, sb[1]); g.stroke(); g.setLineDash([]);
        [sa, sb].forEach(([x, y]) => { g.beginPath(); g.arc(x, y, 7, 0, 7); g.stroke(); g.fillText("A", x, y + 0.5); g.beginPath(); g.moveTo(x - 4, y - 9); g.lineTo(x + 4, y - 9); g.lineTo(x, y - 15); g.closePath(); g.fillStyle = col.mid; g.fill(); });
        // 레벨: 동마다 가장 높은 매스 위에 +00.0
        (build.grp || []).forEach(([a0, a1], n) => {
          if (W < 760 && n % 2) return;
          let top = null; for (const m of mods) if (m.i >= a0 && m.i <= a1 && (!top || m.z > top.z)) top = m;
          if (!top || top.z < 2) return;
          const [x, y] = P(top.u + C / 2, top.v, top.z);
          g.beginPath(); g.moveTo(x, y - 2); g.lineTo(x, y - C * 1.6); g.lineTo(x + 5, y - C * 1.6); g.moveTo(x - 3, y - 5); g.lineTo(x, y - 2); g.lineTo(x + 3, y - 5); g.stroke();
          const fl = Math.max(1, Math.round(top.z / (C * 0.4)));
          g.textAlign = "left"; g.fillText("+" + (fl * 3.3).toFixed(1), x + 7, y - C * 1.6);
          g.save(); g.font = `${W < 760 ? 5 : 7.5}px ${css("--sans") || "sans-serif"}`; g.fillText(`${fl}F · FL 3,300`, x + 7, y - C * 1.6 + (W < 760 ? 7 : 10)); g.restore(); g.textAlign = "center";
        });
        // 방위표와 축척 막대 (오른쪽 아래)
        const nx = U(gi1) + ext * 0.6, ny = V(gj1) + ext + C * 7.5;
        const [px, py] = P(nx, ny, 0);
        g.beginPath(); g.arc(px, py, 11, 0, 7); g.stroke();
        g.beginPath(); g.moveTo(px, py - 11); g.lineTo(px + 4, py + 5); g.lineTo(px, py + 2); g.closePath(); g.fillStyle = col.mid; g.fill();
        g.fillText("N", px, py - 18);
        const [qx, qy] = P(U(gi0) - ext, ny, 0), u5 = C * 5 / 1.2 * K;
        for (let k = 0; k < 4; k++) { g.fillStyle = k % 2 ? col.bg : col.mix(col.dark ? 0.6 : 0.4); g.fillRect(qx + k * u5, qy - 2, u5, 4); g.strokeRect(qx + k * u5, qy - 2, u5, 4); }
        g.fillStyle = col.mid; g.textAlign = "left"; g.fillText("0", qx - 2, qy + 11); g.fillText("10", qx + u5 * 2 - 5, qy + 11); g.fillText("20 m", qx + u5 * 4 - 5, qy + 11);
        g.save(); g.font = `${W < 760 ? 5 : 7.5}px ${css("--sans") || "sans-serif"}`; g.fillText("SITE PLAN / MASSING — 1 : 500", qx, qy - (W < 760 ? 8 : 11)); g.restore();
        g.textAlign = "center";
      }
      g.globalAlpha = 1;
      sec.style.setProperty("--yp", p.toFixed(3));
      if (!REDUCED && !moving && t >= 7.6) { const cg = cache.c.getContext("2d"); cg.setTransform(1, 0, 0, 1, 0, 0); cg.clearRect(0, 0, cache.c.width, cache.c.height); cg.drawImage(cv, 0, 0); cache.ok = true; cache.p = p; }
      if (!REDUCED) dyn();
      frame.last = now;
      if (!REDUCED && (moving || t < 7.8 || p < 0.95)) raf = requestAnimationFrame(frame);
    };
    const kick = () => { cache.ok = false; if (!raf && live) raf = requestAnimationFrame(frame); };

    colors(); build();
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => { build(); colors(); t0 = performance.now(); /* 서사는 첫 그림부터 */ kick(); });
    addEventListener("resize", () => { build(); kick(); });
    addEventListener("scroll", kick, { passive: true });
    document.addEventListener("yp:theme", () => { colors(); kick(); });
    sec.addEventListener("pointermove", (e) => {
      const r = cv.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; sunT = clamp(mx / W, 0, 1); cache.ok = false;
      if (xy) xy.textContent = `SUN ${Math.round(sunT * 180).toString().padStart(3, "0")}° · X ${((mx / W) * 100).toFixed(1).padStart(5, "0")} · Y ${((1 - my / H) * 100).toFixed(1).padStart(5, "0")}`;
      kick();
    });
    sec.addEventListener("pointerleave", () => { mx = my = -1e4; cache.ok = false; kick(); });
    cv.addEventListener("click", () => { if (dragged) { dragged = false; return; } seed++; heights(); kick(); });
    cv.addEventListener("pointerdown", (e) => { if (e.button !== 0 || e.pointerType === "touch") return; const r = cv.getBoundingClientRect(); drag = { x: e.clientX - r.left, y: e.clientY - r.top }; dragged = false; try { cv.setPointerCapture(e.pointerId); } catch (_) {} kick(); });
    cv.addEventListener("pointermove", (e) => { if (!drag) return; const r = cv.getBoundingClientRect(); if (Math.abs(e.clientY - r.top - drag.y) > 5) { dragged = true; cv.style.cursor = "ns-resize"; } mx = e.clientX - r.left; my = e.clientY - r.top; kick(); });
    const endDrag = () => { if (!drag) return; drag = null; cv.style.cursor = ""; kick(); };
    cv.addEventListener("pointerup", endDrag); cv.addEventListener("pointercancel", endDrag);
    // 전환 동안 3D 작품 모형을 화면 맨 위에 붙잡아 둬요(미끄러져 올라오지 않고, 모션 아트가 걷히면 그 자리에 있어요)
    const heroEl = sec.nextElementSibling, stick = $(".yi-stick", sec), mqT = matchMedia("(min-width: 761px) and (prefers-reduced-motion: no-preference)");
    const pinHero = () => {
      if (!heroEl || !heroEl.classList.contains("hero")) return;
      if (!mqT.matches) { heroEl.style.transform = ""; return; }
      const hT = sec.getBoundingClientRect().bottom - stick.offsetHeight;
      heroEl.style.transform = hT > 0.5 ? `translate3d(0,${(-hT).toFixed(1)}px,0)` : "";
    };
    addEventListener("scroll", pinHero, { passive: true }); addEventListener("resize", pinHero); pinHero();
    const go = $(".yi-go", sec);
    go && go.addEventListener("click", () => { const el = $("#works") || sec.nextElementSibling; if (lenis) lenis.scrollTo(el); else el.scrollIntoView({ behavior: REDUCED ? "auto" : "smooth" }); });
    if ("IntersectionObserver" in window) new IntersectionObserver(([e]) => { live = e.isIntersecting; kick(); }).observe(sec);
    kick();
  }

  function scenes() {
    if (REDUCED) HTML.classList.add("rm");
    const flat = () => REDUCED || innerWidth <= 760;
    const prog = (el) => { const r = el.getBoundingClientRect(); return clamp(-r.top / Math.max(1, r.height - innerHeight), 0, 1); };
    const draw = (svg, t, step, span) => svg && $$("[data-g]", svg).forEach((g) => g.style.setProperty("--o", (1 - clamp((t - +g.dataset.g * step) / span, 0, 1)).toFixed(3)));
    const ups = [];

    // 선언문: 단어가 하나씩 채워지고, 배치도가 그려져요
    const mf = $(".mf");
    if (mf) {
      const fw = $$(".fw", mf), steps = $$(".mf-steps li", mf), pct = $(".mf-pct", mf), fig = $(".mf-fig", mf), ko = $(".mf-ko", mf), bar = $(".mf-steps .bar", mf);
      let lastN = -1;
      ups.push(() => {
        const p = REDUCED ? 1 : prog(mf), t = clamp(p / 0.8, 0, 1);
        const n = Math.round(t * fw.length);
        if (n !== lastN) { fw.forEach((w, i) => w.classList.toggle("on", i < n)); lastN = n; }
        pct.textContent = pad(Math.round(p * 100), 3);
        const k = Math.min(steps.length - 1, Math.floor(t * steps.length));
        steps.forEach((s, i) => s.classList.toggle("on", t > i / steps.length + 0.01 || t > 0.99));
        mf._k = k; mf._n = steps.length;
        bar.style.transform = `scaleX(${t.toFixed(4)})`;
        ko.classList.toggle("on", t > 0.88);
        draw(fig, t, 0.2, 0.4);
      });
    }

    // 여러 장(slide)으로 된 장면의 공통 동작: 지금 몇 번째 장인지(k)와 그 장 안에서의 진행(local)
    const slides = (sec, items, onK, onT) => {
      let lastK = -1;
      ups.push(() => {
        if (flat()) {
          if (lastK !== -2) { items.forEach((it) => { it.classList.add("on"); it.classList.remove("past"); }); onK && onK(-1); onT && onT(-1, 1, 1); lastK = -2; }
          sec._k = 0; sec._n = 1;
          return;
        }
        const p = prog(sec), n = items.length;
        const k = Math.min(n - 1, Math.floor(p * n)), local = clamp(p * n - k, 0, 1);
        if (k !== lastK) {
          items.forEach((it, i) => { it.classList.toggle("on", i === k); it.classList.toggle("past", i < k); });
          onK && onK(k);
          lastK = k;
        }
        sec._k = k; sec._n = n;
        onT && onT(k, local, p);
      });
    };

    // 세 키워드: 단어가 가운데 선 아래로 올라오고, 도면이 그려져요
    const pl = $(".pl"), plFigs = pl ? $(".pl-fig", pl) : [];
    if (pl) slides(pl, $$(".pl-it", pl),
      (k) => plFigs.forEach((f, i) => f.classList.toggle("on", k === -1 || i === k)),
      (k, local) => k < 0 ? plFigs.forEach((f) => draw($("svg", f), 1, 0.2, 0.4)) : draw($("svg", plFigs[k]), clamp(local * 1.6, 0, 1), 0.18, 0.4));

    // 목록: 화면 가운데에서 멀어질수록 흐려져요
    const fades = $$(".fade");
    ups.push(() => {
      if (REDUCED) return;
      const vc = innerHeight / 2;
      fades.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < -200 || r.top > innerHeight + 200) return;
        const d = Math.abs(r.top + Math.min(r.height, 160) / 2 - vc);
        el.style.opacity = (1 - clamp((d - innerHeight * 0.18) / (innerHeight * 0.32), 0, 1) * 0.82).toFixed(3);
      });
    });

    // Works: 가운데 열은 빠르게, 오른쪽 열은 조금 느리게 흘러요
    const wcols = $(".wcols"), wc = $$(".wcol");
    ups.push(() => {
      if (REDUCED || innerWidth <= 760) { wc.forEach((c) => (c.style.transform = "")); return; }
      const r = wcols.getBoundingClientRect();
      if (r.bottom < 0 || r.top > innerHeight) return;
      const p = clamp((innerHeight - r.top) / (innerHeight + r.height), 0, 1) - 0.5;
      [0, -1, -0.45].forEach((a, i) => (wc[i].style.transform = `translate3d(0,${(p * a * innerHeight * 0.5).toFixed(1)}px,0)`));
    });

    let busy = false;
    const on = () => { if (busy) return; busy = true; requestAnimationFrame(() => { busy = false; ups.forEach((f) => f()); }); };
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", () => { on(); });
    on();
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
  // ---------- v2 작품 이름 목록 (계획 7단계) ----------
  render.projects = () => {
    const I = SITE.index || {}, list = PROJECTS.filter((p) => !p.draft);
    const src = (p) => (typeof (p.thumb || p.cover) === "string" ? p.thumb || p.cover : "");
    $("#main").innerHTML = `
      <section class="ar-hd cl-hd g4">
        <h1 class="ar-h">${esc(I.title || "index")}</h1>
        <p class="ar-note">${esc(I.note || "")}<span class="num">(${pad(list.length)})</span></p>
      </section>
      <ol class="cl">${list.map((p, i) => `
        <li><a class="cl-row g4" href="project.html#${p.slug}" data-i="${i}">
          <span class="cl-t"><span class="cl-n num">${pad(i + 1)}</span>${esc(p.title)}</span>
          <span class="cl-m">${esc(p.type)} — ${esc(p.titleKo || "")}</span>
          <span class="cl-y num">${esc(p.year)}</span>
          <span class="cl-th" aria-hidden="true">${src(p) ? `<img src="${esc(src(p))}" alt="" loading="lazy" decoding="async">` : ""}</span>
        </a></li>`).join("")}
      </ol>
      <div class="cl-pv" aria-hidden="true">${list.map((p) => `<img data-src="${esc(src(p))}" alt="">`).join("")}</div>`;
    const pv = $(".cl-pv"), imgs = $$("img", pv);
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, on = -1, raf = 0, loaded = false;
    const load = () => { if (loaded) return; loaded = true; imgs.forEach((im) => (im.src = im.dataset.src)); };
    const frame = () => {
      raf = 0;
      const k = REDUCED ? 1 : 0.16;
      x += (tx - x) * k; y += (ty - y) * k;
      pv.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
      if (Math.abs(tx - x) + Math.abs(ty - y) > 0.3) raf = requestAnimationFrame(frame);
    };
    const show = (i) => { on = i; imgs.forEach((im, j) => im.classList.toggle("on", j === i)); pv.classList.toggle("on", i >= 0); };
    $(".cl").addEventListener("pointerenter", load, { once: true });
    $$(".cl-row").forEach((a) => {
      a.addEventListener("pointerenter", (e) => { if (e.pointerType === "touch") return; if (on < 0) { x = tx = e.clientX; y = ty = e.clientY; } show(+a.dataset.i); });
      a.addEventListener("focus", () => { load(); const b = a.getBoundingClientRect(); x = tx = b.left + b.width * 0.55; y = ty = b.top + b.height / 2; show(+a.dataset.i); frame(); });
      a.addEventListener("blur", () => show(-1));
    });
    $(".cl").addEventListener("pointerleave", () => show(-1));
    addEventListener("pointermove", (e) => { if (on < 0) return; tx = e.clientX; ty = e.clientY; if (!raf) raf = requestAnimationFrame(frame); }, { passive: true });
  };

  render.projectsV1 = () => {
    const types = ["All", ...new Set(PROJECTS.map((p) => p.type))];
    wi = 0;
    $("#main").innerHTML = `
      <div class="pg wrap">
        <header class="pg-hd grid">
          <p class="crumb mono mid">A-100 — Index of Works</p>
          <h1 class="intro-play">${words("Index of Works")}<sup>(${pad(N)})</sup></h1>
          <div class="tools mono">
            <div class="filters" role="group" aria-label="Filter works">${types.map((t, i) => `<button type="button" class="${i ? "" : "on"}" data-f="${t}">${t}<sup class="num">${t === "All" ? N : PROJECTS.filter((p) => p.type === t).length}</sup></button>`).join("")}</div>
            <div class="views" role="group" aria-label="View"><button type="button" data-v="grid">Grid</button><button type="button" data-v="list">List</button></div>
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
        <div id="gx" hidden>
        <div class="wov">${PROJECTS.map((p, i) => `<a class="wth" href="#w-${p.slug}" data-type="${esc(p.type)}" data-cursor="View"><div class="media">${mz(card(p, 480, 320))}</div><span class="mono mid num">${pad(i + 1)}</span><b>${esc(p.title)}</b></a>`).join("")}</div>
        <div class="wgrid wbig">${PROJECTS.map((p, i) => `
          <a class="wcard" id="w-${p.slug}" href="project.html#${p.slug}" data-type="${esc(p.type)}" data-cursor="View" data-reveal="wipe" style="--d:${(i % 3) * 0.1}s">
            <div class="media">${mz(card(p, 1600, 900))}<div class="ov mono"><span>${esc(p.site)}</span><span class="num">${esc(p.area)}</span></div></div>
            <div class="cap"><span class="mono mid num">${pad(i + 1)}</span><h3>${esc(p.title)}</h3><span class="mono mid num">${p.year}</span><p>${esc(p.type)} — ${esc(p.titleKo)}</p></div>
          </a>`).join("")}
        </div></div>
      </div>
      <div class="pv" id="pv" aria-hidden="true"><div class="media"><div class="mz"></div></div></div>`;

    // 필터
    let filter = "All";
    const apply = () => {
      $$(".ix-row, #gx .wcard, #gx .wth").forEach((r) => r.classList.toggle("off", !(filter === "All" || r.dataset.type === filter)));
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
      ls.set("yp-view2", v);
      reveals($("#main"));
      hasGsap && ScrollTrigger.refresh();
    };
    $$(".views button").forEach((b) => b.addEventListener("click", () => setView(b.dataset.v)));
    $$("#gx .wth").forEach((t) => t.addEventListener("click", (e) => { e.preventDefault(); scrollToEl(t.getAttribute("href")); }));
    setView(ls.get("yp-view2") === "list" ? "list" : "grid"); // 기본은 대표 사진 보기

    // 마우스를 따라오는 미리보기
    const pv = $("#pv"), pvm = $(".mz", pv), cache = {};
    let x = 0, y = 0, px = 0, py = 0, on = false;
    $$(".ix-row").forEach((r) => {
      r.addEventListener("pointerenter", () => {
        const p = PROJECTS[+r.dataset.k];
        pvm.innerHTML = cache[p.slug] || (cache[p.slug] = card(p, 800, 1000));
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
  // 물 차오르는 평면 시뮬레이션: 여섯 장의 평면을 수위에 따라 겹쳐 보여요
  const simHtml = (sim) => `
    <div class="sim" data-sim>
      <div class="media sim-view" style="aspect-ratio:${sim.r}" data-lenis-prevent tabindex="0" aria-label="Scroll over the plan to raise and lower the water">${sim.frames.map((f, i) => `<img src="${esc(f.src)}"${f.dry ? ` data-dry="${esc(f.dry)}"` : ""} alt="Plan at +${f.level} m" style="opacity:${i ? 0 : 1}" decoding="async">`).join("")}${sim.flood ? `<canvas class="sim-fl" aria-hidden="true"></canvas>` : ""}
        <span class="sim-lv num">+${sim.frames[0].level.toFixed(2)} m</span></div>
      <div class="sim-ui">
        <button type="button" class="sim-play lnk" aria-pressed="false">Play tide</button>
        <div class="sim-clk" aria-hidden="true">
          <svg viewBox="0 0 220 90"><g transform="translate(42 45)"><circle r="33" class="ck-f"/><line y1="-33" y2="-26" transform="rotate(0)" class="ck-t"/><line y1="-33" y2="-29" transform="rotate(30)" class="ck-t"/><line y1="-33" y2="-29" transform="rotate(60)" class="ck-t"/><line y1="-33" y2="-26" transform="rotate(90)" class="ck-t"/><line y1="-33" y2="-29" transform="rotate(120)" class="ck-t"/><line y1="-33" y2="-29" transform="rotate(150)" class="ck-t"/><line y1="-33" y2="-26" transform="rotate(180)" class="ck-t"/><line y1="-33" y2="-29" transform="rotate(210)" class="ck-t"/><line y1="-33" y2="-29" transform="rotate(240)" class="ck-t"/><line y1="-33" y2="-26" transform="rotate(270)" class="ck-t"/><line y1="-33" y2="-29" transform="rotate(300)" class="ck-t"/><line y1="-33" y2="-29" transform="rotate(330)" class="ck-t"/><line y2="-17" class="ck-h"/><line y2="-27" class="ck-m"/><circle r="2" class="ck-c"/></g>
            <g transform="translate(150 45)"><ellipse rx="36" ry="25" class="ck-w"/><circle r="19" class="ck-e"/><g class="ck-rot"><line y1="0" y2="-19" class="ck-t"/><circle cy="-19" r="3.2" class="ck-p"/></g><circle cx="58" r="5" class="ck-mo"/><text x="58" y="20" text-anchor="middle" class="ck-l">moon</text></g></svg>
          <span class="num"><b class="ck-d">06:00</b><span class="mid ck-s">low water</span></span>
        </div>
        <input type="range" min="0" max="${sim.frames.length - 1}" step="0.01" value="0" aria-label="Water level">
        <div class="sim-ticks num mid">${sim.frames.map((f) => `<span>+${f.level}</span>`).join("")}</div>
      </div>
      <p class="sim-d"><b class="num"></b> <span class="mid"></span><br><span class="sim-t"></span></p>
      ${(sim.sections || []).map((q) => `<figure class="sim-sec"${q.w ? ` style="width:${q.w}"` : ""}>
        <div class="media" style="aspect-ratio:${q.r}"><img src="${esc(q.src)}" alt="${esc(q.cap)}" loading="lazy" decoding="async">${q.hi ? `<img class="sim-hi" src="${esc(q.hi)}" alt="" loading="lazy" decoding="async">` : ""}<i class="sim-w"${q.wr ? ` style="right:${q.wr}"` : ""}></i><span class="sim-wl num"></span></div>
        <figcaption class="mid">${esc(q.cap)}</figcaption></figure>`).join("")}
    </div>`;
  // 정방형 지도 + 주변 글자 (Site)
  const mapHtml = (m) => {
    const rows = (a) => a.map(([t, x]) => `<li><b>${esc(t)}</b><span>${esc(x)}</span></li>`).join("");
    const k = m.mark;
    return `<figure class="mapp${m.left.length ? "" : " mapp-wide"}" data-reveal>
      <ul class="mapp-l">${rows(m.left)}</ul>
      <div class="mapp-sq media"${m.r || m.w ? ` style="${m.r ? `aspect-ratio:${m.r};` : ""}${m.w ? `width:${m.w};justify-self:center;` : ""}"` : ""}><img src="${esc(m.src)}" alt="Site map" decoding="async">
        ${k ? `<svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><rect x="${k.x - k.w / 2}" y="${k.y - k.h / 2}" width="${k.w}" height="${k.h}" transform="rotate(${k.rot} ${k.x} ${k.y})" /></svg>` : ""}</div>
      <ul class="mapp-r">${rows(m.right)}</ul>
      <div class="mapp-f"><ul class="mapp-n">${rows(m.notes)}</ul><ul class="mapp-k">${m.legend.map(([a, b]) => `<li><i>${esc(a)}</i>${esc(b)}</li>`).join("")}</ul><figcaption class="mid">${esc(m.cap)}</figcaption></div>
    </figure>`;
  };
  // 스크롤로 넘기는 단계 그림 (frames: 한 장씩 / wipe: 한 장 위에 지시선·글자가 띠로 드러남)
  const seqHtml = (q) => {
    const N = q.steps.length;
    const lead = () => `<img src="${esc(q.src)}" alt="${esc(q.steps[0].t)}" decoding="async">${q.L.map(([sd, y, x]) => { const a = sd === "l" ? 23.5 : x, w = Math.abs((sd === "l" ? x : 76.5) - (sd === "l" ? 23.5 : x)); return `<i class="seq-ln ${sd}" style="top:${y}%;left:${a}%;width:${w.toFixed(2)}%"></i>`; }).join("")}${q.L.map(([sd, y, x]) => `<i class="seq-dt" style="left:${x}%;top:${y}%"></i>`).join("")}${q.L.map(([sd, y, , t, , pg]) => `<span class="seq-lb ${sd}${pg ? " pgm" : ""}" style="top:${y}%">${esc(t)}</span>`).join("")}`;
    const stage = q.kind === "lead" ? lead() : q.kind === "wipe"
      ? `<img class="seq-base" src="${esc(q.src)}" alt="" decoding="async"><img class="seq-top" src="${esc(q.src)}" alt="${esc(q.steps[0].t)}" decoding="async">`
      : q.steps.map((f, i) => `<img src="${esc(f.src)}" alt="${esc(f.t)}" decoding="async"${i ? "" : ' class="on"'}${f.x ? ` style="translate:${esc(f.x)} 0"` : ""}>`).join("");
    return `<div class="seq seq-${q.kind}${q.lite ? " seq-lite" : ""}${q.fade ? " seq-fade" : ""}${q.below ? " seq-below" : ""}${q.drop ? " seq-drop" : ""}" data-seq style="--n:${q.n || N};--k:${q.k || 1}${q.cols ? `;--c:${q.cols}` : ""}${q.len ? `;--len:${q.len}` : ""}">
      <div class="seq-pin">
        <div class="seq-stage media" style="aspect-ratio:${q.r};--r:${q.r}">${stage}${q.tag ? `<p class="ssn-tag seq-tag"><b>${esc(q.steps[0].t)}</b><span>${esc(q.steps[0].s || "")}</span></p>` : ""}</div>
        <div class="seq-side">
          <p class="seq-ctr num"><b>01</b> / ${pad(N)}</p>
          <ol>${q.steps.map((f, i) => `<li${i ? "" : ' class="on"'}><span class="num mid">${pad(i + 1)}</span><div><b>${esc(f.t)}</b> <span class="mid">${esc(f.s || "")}</span>${f.d ? `<p>${esc(f.d)}</p>` : ""}${f.k ? `<dl>${f.k.map(([a, b]) => `<div><dt>${esc(a)}</dt><dd class="num">${esc(b)}</dd></div>`).join("")}</dl>` : ""}</div></li>`).join("")}</ol>
          <div class="seq-bar"><i></i></div>
        </div>
      </div>
    </div>`;
  };
  // 계절 시뮬레이션: 같은 자리를 여름 비 → 가을 → 겨울 → 밤으로, 스크롤하면 장소가 하나씩 바뀌어요
  const SSN = { rain: ["Summer", "rain"], autumn: ["Autumn", "ginkgo"], winter: ["Winter", "snow"], night: ["Night", "media facade"] };
  const SSN_K = Object.keys(SSN);
  const ssnHtml = (q) => `<div class="ssn" data-ssn style="--n:${q.places.length}">
      <div class="ssn-pin">
        <div class="ssn-stage media" style="aspect-ratio:${q.r}">${q.places.map((pl, i) => `<div class="ssn-pl${i ? "" : " on"}">${SSN_K.filter((k) => pl.imgs[k]).map((k, j) => `<img data-src="${esc(pl.imgs[k])}" data-k="${k}" alt="${esc(pl.t)} — ${SSN[k][0]}" decoding="async" style="opacity:${j ? 0 : 1}">`).join("")}</div>`).join("")}
          <p class="ssn-tag"><b></b><span></span></p>
        </div>
        <div class="ssn-side">
          <p class="seq-ctr num"><b>01</b> / ${pad(q.places.length)}</p>
          <div class="ssn-ks">${SSN_K.map((k) => `<button type="button" data-k="${k}"><b>${SSN[k][0]}</b><span class="mid">${SSN[k][1]}</span><i></i></button>`).join("")}</div>
          <ol>${q.places.map((pl, i) => `<li${i ? "" : ' class="on"'}><span class="num mid">${pad(i + 1)}</span><div><b>${esc(pl.t)}</b> <span class="mid">${esc(pl.s || "")}</span>${pl.d ? `<p>${esc(pl.d)}</p>` : ""}</div></li>`).join("")}</ol>
          <div class="seq-bar"><i></i></div>
        </div>
      </div>
    </div>`;
  const ssnInit = (p) => {
    const qs = p.sections.filter((x) => x.seasons).map((x) => x.seasons);
    $$("[data-ssn]").forEach((el, n) => {
      const q = qs[n], N = q.places.length, pls = $$(".ssn-pl", el), lis = $$(".ssn-side li", el), bs = $$(".ssn-ks button", el);
      const ctr = $(".seq-ctr b", el), bar = $(".seq-bar i", el), tagB = $(".ssn-tag b", el), tagS = $(".ssn-tag span", el);
      const ease = (x) => x * x * (3 - 2 * x);
      const load = (i) => { if (pls[i]) $$("img", pls[i]).forEach((im) => { if (!im.src) im.src = im.dataset.src; }); };
      let cur = -1;
      const span = () => { const r = el.getBoundingClientRect(); return { r, h: r.height - innerHeight }; };
      // 한 장소 안에서: 앞뒤 8%는 멈춰 있고 그 사이에서 계절이 차례로 섞여요
      const local = (u, S) => Math.max(0, Math.min(S - 1, ((u - 0.08) / 0.84) * (S - 1)));
      const upd = () => {
        const { r, h } = span(), t = h > 0 ? Math.min(0.99999, Math.max(0, -r.top / h)) : 0;
        bar.style.transform = `scaleX(${t})`;
        const i = Math.min(N - 1, Math.floor(t * N)), u = t * N - i;
        if (i !== cur) { cur = i; pls.forEach((d, j) => d.classList.toggle("on", j === i)); lis.forEach((li, j) => li.classList.toggle("on", j === i)); ctr.textContent = pad(i + 1); tagB.textContent = q.places[i].t; load(i); load(i + 1); load(i - 1); }
        const ims = $$("img", pls[i]), S = ims.length, v = local(u, S), a = Math.min(S - 2, Math.floor(v)), f = S > 1 ? ease(v - a) : 0;
        ims.forEach((im, j) => { im.style.opacity = j === a ? 1 : j === a + 1 ? f : 0; });
        const k = ims[Math.round(v)].dataset.k; tagS.textContent = SSN[k][0];
        bs.forEach((b) => { const j = ims.findIndex((im) => im.dataset.k === b.dataset.k); b.classList.toggle("na", j < 0); b.classList.toggle("on", b.dataset.k === k);
          b.querySelector("i").style.transform = `scaleX(${j < 0 ? 0 : Math.max(0, Math.min(1, v - j + 1))})`; });
      };
      const go = (i, u) => { const { r, h } = span(); scrollTo({ top: scrollY + r.top + h * ((i + u) / N), behavior: "smooth" }); };
      lis.forEach((li, j) => li.addEventListener("click", () => go(j, 0.02)));
      bs.forEach((b) => b.addEventListener("click", () => { const ims = $$("img", pls[cur]), j = ims.findIndex((im) => im.dataset.k === b.dataset.k); if (j < 0) return; const S = ims.length; go(cur, S > 1 ? 0.08 + (j / (S - 1)) * 0.84 : 0.5); }));
      addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); load(0); load(1); upd();
    });
  };
  // 옆으로 흐르는 띠: 화면에 걸린 채 스크롤하면 그림이 왼쪽으로 지나가요
  const panHtml = (q) => q.loop
    ? `<figure class="pan-loop${q.solid ? " solid" : ""}" data-panloop data-lenis-prevent${q.h ? ` style="--ph:${q.h}"` : ""}><div class="pan-win" tabindex="0" aria-label="${esc(q.cap || "")}, scroll to move"><div class="pan-belt">${[0, 1, 2].map((k) => { const img = `<img src="${esc(q.src)}" alt="${k ? "" : esc(q.cap || "")}"${k ? " aria-hidden=\"true\"" : ""} decoding="async">`; return q.labels ? `<span class="pan-cell"${k ? " aria-hidden=\"true\"" : ""}>${img}${q.labels.map(([x, c, t, d]) => `<span class="pan-lb" style="left:${x}%"><b><span class="mid num">${esc(c)}</span> ${esc(t)}</b><span class="mid">${esc(d)}</span></span>`).join("")}</span>` : img; }).join("")}</div></div><figcaption class="mid"><span>${esc(q.cap || "")}</span><span>Scroll over the strip — it runs on, C1 back to V1</span></figcaption></figure>`
    : `<figure class="pan${q.build ? " pan-build" : ""}" data-pan${q.build ? " data-build" : ""} style="--r:${q.r}${q.h ? `;--ph:${q.h}` : ""}${q.w ? `;--pw:${q.w}` : ""}"><div class="pan-pin"><div class="pan-win"><img src="${esc(q.src)}" alt="${esc(q.cap || "")}" decoding="async"></div><figcaption class="mid"><span>${esc(q.cap || "")}</span><span class="pan-bar"><i></i></span></figcaption></div></figure>`;
  const panInit = () => {
    // 끝없는 띠: 마우스를 올리고 휠을 굴리면 옆으로 흐르고, C1 다음엔 다시 V1이 이어져요
    $$("[data-panloop]").forEach((el) => {
      const belt = $(".pan-belt", el), win = $(".pan-win", el), img = $("img", el);
      let x = 0, tx = 0, raf = 0;
      const W = () => img.offsetWidth || 1;
      const loop = () => { x += (tx - x) * 0.12; if (Math.abs(tx - x) < 0.3) x = tx; const w = W(), m = ((x % w) + w) % w; belt.style.transform = `translate3d(${-m}px,0,0)`; raf = x !== tx ? requestAnimationFrame(loop) : 0; };
      const go = (d) => { tx += d; if (!raf) raf = requestAnimationFrame(loop); };
      win.addEventListener("wheel", (e) => { e.preventDefault(); go((Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * (e.deltaMode === 1 ? 33 : 1) * 1.1); }, { passive: false });
      let px = null; win.addEventListener("pointerdown", (e) => { px = e.clientX; }); addEventListener("pointerup", () => { px = null; });
      win.addEventListener("pointermove", (e) => { if (px == null) return; go(px - e.clientX); px = e.clientX; });
      win.addEventListener("keydown", (e) => { if (e.key === "ArrowRight") go(160); if (e.key === "ArrowLeft") go(-160); });
    });
    $$("[data-pan]").forEach((el) => {
      let img = $("img", el), parts = null, VW = 1;
      const win = $(".pan-win", el), bar = $(".pan-bar i", el);
      const upd = () => {
        const r = el.getBoundingClientRect(), span = r.height - innerHeight, t = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        const iw = img.getBoundingClientRect().width / (img._sc || 1), ww = win.clientWidth; // 축소한 만큼 되돌려 원래 폭
        // 핀 #5(2026-11-22): 짓는 띠(build)는 앞 82%에서 왼쪽부터 지어지며 흐르고, 남은 18%에서 전체가 줄어들며 한 화면에 다 보여요
        const build = el.hasAttribute("data-build"), k = build ? 0.82 : 1, tb = Math.min(1, t / k), z = build ? Math.max(0, (t - k) / (1 - k)) : 0;
        const ez = z * z * (3 - 2 * z), fit = Math.min(1, ww / Math.max(1, iw)), sc = 1 + (fit - 1) * ez;
        // 핀 #93: 짓는 띠는 창이 화면 양끝까지 열려 있어 지나간 부분이 흰 칸에서 잘려 사라지지 않고 화면 밖으로 밀려나요 (시작은 본문 칸에서)
        let off = 0; if (build) { const L = el.getBoundingClientRect().left, R = document.documentElement.clientWidth - el.getBoundingClientRect().right; win.style.marginLeft = -L + "px"; win.style.marginRight = -R + "px"; off = L; }
        const ww2 = win.clientWidth, xp = build ? off + tb * Math.min(0, ww2 - iw - off) : -tb * Math.max(0, iw - ww);
        const x = xp * (1 - ez) + (ww2 - iw * sc) / 2 * ez * (fit < 1 ? 0 : 1);
        img.style.transformOrigin = "0 50%"; img._sc = sc;
        img.style.transform = `translate3d(${x.toFixed(1)}px,0,0) scale(${sc.toFixed(4)})`; bar.style.transform = `scaleX(${t})`;
        // 알고리즘 생성 (핀 #245): 스크롤에 따라 왼쪽부터 컴포넌트가 하나씩 놓이고, 양 끝이 놓이면 선이 이어져요
        if (parts) { const edge = Math.min(1, tb * 1.04 + 0.02) * VW; parts.forEach(([e, a, b]) => e.classList.toggle("on", (b == null ? a : b) <= edge)); }
      };
      if (el.hasAttribute("data-build") && /\.svg$/.test(img.getAttribute("src"))) {
        fetch(img.getAttribute("src")).then((r) => r.text()).then((txt) => {
          const box = document.createElement("div"); box.innerHTML = txt; const sv = box.querySelector("svg"); if (!sv) return;
          sv.removeAttribute("width"); sv.removeAttribute("height"); sv.setAttribute("role", "img"); sv.setAttribute("aria-label", img.alt);
          VW = sv.viewBox.baseVal.width || 1;
          img.replaceWith(sv); img = sv;
          parts = [...sv.querySelectorAll(".gn, .gg, .gw")].map((e) => [e, +e.dataset.x, e.dataset.x2 != null ? +e.dataset.x2 : null]);
          upd();
        }).catch(() => {});
      }
      addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); img.addEventListener("load", upd); upd();
    });
  };
  // 핀 #4(2026-11-22): 장면 넘김 그림 위를 달리는 빨간 네모. 단계마다 한 구간씩 — 직선 → 램프 → 원 한 바퀴.
  // 좌표는 그림(2000×691 비율) 기준. 원은 반시계 방향(그림의 화살표 방향)으로 한 바퀴 돌고 들어온 자리에서 멈춰요.
  // 핀 #19(2026-11-22): 그림 칸마다 힘이 흐르는 길(흐르는 방향으로 그림). 좌표는 그림 2000×754 기준
  const FLOW_PATHS = {
    bridge: { vb: "0 0 2000 754", cols: [
      ["M145 425 L145 620", "M322 425 L322 592"],
      ["M749 525 L660 524", "M749 525 L838 527"],
      [1200, 1220, 1240, 1260, 1280, 1300, 1320, 1338].map((x) => `M${x} 527 L${x} 500`),
      ["M1767 500 L1700 500 Q1687 500 1687 488 L1687 427", "M1767 500 L1835 500 Q1847 500 1847 488 L1847 427", "M1767 556 L1700 556 Q1687 556 1687 568 L1687 617", "M1767 556 L1835 556 Q1847 556 1847 568 L1847 595"],
    ] },
  };
  const flowSvg = (k) => { const f = FLOW_PATHS[k]; if (!f) return ""; return `<svg class="flow-ov" viewBox="${f.vb}" preserveAspectRatio="none" aria-hidden="true">${f.cols.map((ps, j) => `<g class="fl-c" data-j="${j}">${ps.map((p) => `<path class="fl-p" d="${p}" pathLength="1"/>`).join("")}</g>`).join("")}</svg>`; };
  const CAR_PATHS = {
    strategy: {
      vb: "0 0 2000 691",
      legs: ["M75 342 L610 342", "M610 342 L720 342 C772 342 800 55 885 55 C958 55 975 250 1022 380 C1080 510 1150 625 1270 625 C1380 625 1420 503 1525 503", "M1525 503 A178 178 0 0 0 1525 147 A178 178 0 0 0 1525 503"],
    },
  };
  const seqCar = (stage, kind) => {
    const P = CAR_PATHS[kind]; if (!stage || !P) return null;
    const NS = "http://www.w3.org/2000/svg", sv = document.createElementNS(NS, "svg");
    sv.setAttribute("viewBox", P.vb); sv.setAttribute("class", "seq-car"); sv.setAttribute("aria-hidden", "true"); sv.setAttribute("preserveAspectRatio", "xMidYMid meet");
    const full = P.legs.map((d, i) => (i ? d.replace(/^M[^A-LN-Z]+/, "") : d)).join(" "); // 한 줄로 이어야 점선(지나간 길)이 끊기지 않아요
    sv.innerHTML = `<path class="sc-trail" d="${full}"/><g class="sc-box"><rect x="-13" y="-13" width="26" height="26"/></g>`;
    stage.appendChild(sv);
    const trail = sv.querySelector(".sc-trail"), box = sv.querySelector(".sc-box");
    const tmp = document.createElementNS(NS, "path"); sv.appendChild(tmp);
    const lens = P.legs.map((d) => { tmp.setAttribute("d", d); return tmp.getTotalLength(); }); tmp.remove();
    const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0)), tot = lens.reduce((a, b) => a + b, 0);
    trail.style.strokeDasharray = `0 ${tot + 10}`;
    const ease = (u) => (u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2);
    let last = -1;
    return (t, N) => {
      const n = P.legs.length, f = Math.min(n - 1e-6, t * n), i = Math.floor(f), u = Math.min(1, (f - i) / 0.85);
      let d = starts[i] + lens[i] * ease(u); if (t >= 0.999) d = tot; if (Math.abs(d - last) < 0.05) return; last = d;
      const a = trail.getPointAtLength(Math.min(tot, d)), b = trail.getPointAtLength(Math.min(tot, d + 2)), c = trail.getPointAtLength(Math.max(0, d - 2));
      const ang = Math.atan2(b.y - c.y, b.x - c.x) * 180 / Math.PI;
      box.setAttribute("transform", `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)})`);
      trail.style.strokeDasharray = `${d.toFixed(1)} ${tot + 10}`;
      sv.classList.toggle("end", d >= tot - 0.5);
    };
  };
  // 핀 #8(2026-11-22): 여러 칸으로 된 그림을 스크롤에 따라 왼쪽부터 한 칸씩 드러내요 (data.js 그림의 reveal: 칸 수)
  // 핀 #11(2026-11-22): 왼쪽 디테일 줄 + 오른쪽 고정 키. 지금 화면 가운데에 온 디테일의 자리를 키 위에 고리로 표시해요
  const keyedHtml = (q) => `<div class="kj" data-kj><div class="kj-list">${q.items.map((it, i) => `<figure class="kj-it" data-i="${i}"><div class="media" style="aspect-ratio:${it.r}"><img class="dg" src="${esc(it.src)}" alt="${esc(it.t)}" loading="lazy" decoding="async"></div>${it.notes ? `<figcaption class="kj-nt"><b><span class="num mid">J${i + 1}</span> ${esc(it.t)}</b><ol>${it.notes.map(([n, t]) => `<li><span class="num">${esc(n)}</span>${esc(t)}</li>`).join("")}</ol></figcaption>` : ""}</figure>`).join("")}</div><div class="kj-key"><figure><div class="media" style="aspect-ratio:${q.key.r}"><img class="dg" src="${esc(q.key.src)}" alt="${esc(q.key.caption || "")}" decoding="async">${q.items.map((it, i) => `<span class="kj-ring" data-i="${i}" style="left:${it.x}%;top:${it.y}%"><b>${i + 1}</b></span>`).join("")}</div><figcaption class="mid"><span class="kj-n">01</span> ${esc(q.items[0].t)} <span class="kj-c">— ${esc(q.key.caption || "")}</span></figcaption></figure></div></div>`;
  const keyedInit = () => $$("[data-kj]").forEach((el) => {
    const its = $$(".kj-it", el), rings = $$(".kj-ring", el), n = $(".kj-n", el), cap = $(".kj-key figcaption", el), names = its.map((f) => $("img", f).alt);
    let cur = -1;
    const set = (i) => { if (i === cur) return; cur = i; rings.forEach((r, j) => r.classList.toggle("on", j === i)); n.textContent = pad(i + 1); cap.childNodes[1].nodeValue = " " + names[i] + " "; };
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) e.target.classList.add("in"); }), { rootMargin: "0px 0px -12% 0px" });
    its.forEach((f) => io.observe(f));
    const upd = () => { const mid = innerHeight * 0.5; let best = 0, bd = 1e9; its.forEach((f, i) => { const b = f.getBoundingClientRect(), d = Math.abs(b.top + b.height / 2 - mid); if (d < bd) { bd = d; best = i; } }); set(best); };
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  });
  // 핀 #14(2026-11-22): 태양 궤적 시뮬레이션. 그래프 좌표(그림 2000×459 기준): 방위 E 90°→x 85, W 270°→x 741 / 고도 0°→y 411, 80°→y 57
  const sunInit = () => $$(".sun-ov").forEach((sv) => {
    const media = sv.parentElement, lb = $(".sun-lb", media), dot = $(".sun-dot", sv), tr = $(".sun-tr", sv), col = $(".sun-col", sv), hl = $(".sun-h", sv);
    media.after(lb); // 이름표는 그림 바로 아래 한 줄로
    const R = Math.PI / 180, PHI = 38.07 * R, MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const decl = (m) => 23.44 * Math.sin(((360 / 365) * (284 + [21, 52, 80, 111, 141, 172, 202, 233, 264, 294, 325, 355][m])) * R) * R;
    const pos = (m, hr) => { const dl = decl(m), H = (hr - 12) * 15 * R;
      const alt = Math.asin(Math.sin(PHI) * Math.sin(dl) + Math.cos(PHI) * Math.cos(dl) * Math.cos(H));
      const az = Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(PHI) - Math.tan(dl) * Math.cos(PHI)) / R + 180;
      return [85 + ((az - 90) / 180) * 656, 411 - (alt / R) * 4.425, alt / R]; };
    const rise = (m) => { const c = -Math.tan(PHI) * Math.tan(decl(m)); return 12 - Math.acos(Math.max(-1, Math.min(1, c))) / R / 15; };
    const DAY = 3.2; // 한 달(하루 궤적)에 3.2초
    let t = 0, last = 0, raf = 0, live = false, done = false, lastM = -1;
    const draw = () => {
      const m = Math.min(11, Math.floor(t / DAY)), u = done ? 0.5 : (t % DAY) / DAY, r0 = rise(m), hr = r0 + (24 - 2 * r0) * u, [x, y, alt] = pos(m, hr);
      if (m !== lastM) { lastM = m; let p = ""; for (let k = 0; k <= 40; k++) { const q = pos(m, r0 + ((24 - 2 * r0) * k) / 40); p += (k ? "L" : "M") + q[0].toFixed(1) + " " + Math.min(411, q[1]).toFixed(1); } tr.setAttribute("d", p); col.setAttribute("x", 1013 + m * 82); }
      dot.setAttribute("cx", x.toFixed(1)); dot.setAttribute("cy", Math.min(411, y).toFixed(1));
      hl.setAttribute("x1", x.toFixed(1)); hl.setAttribute("x2", x.toFixed(1)); hl.setAttribute("y1", Math.min(411, y).toFixed(1)); hl.setAttribute("y2", 411);
      const hh = Math.floor(hr), mm = Math.floor((hr - hh) * 60);
      lb.textContent = `21 ${MON[m]} · ${pad(hh)}:${pad(mm)} solar · altitude ${Math.max(0, alt).toFixed(1)}°`;
    };
    const loop = (now) => { raf = 0; const dt = last ? Math.min(0.05, (now - last) / 1000) : 0; last = now; if (!done) { t += dt; if (t >= 12 * DAY) { t = 12 * DAY - 0.001; done = true; } } draw(); media.classList.toggle("sun-done", done); if (live && !done) raf = requestAnimationFrame(loop); };
    const kick = () => { last = 0; if (!raf) raf = requestAnimationFrame(loop); };
    if (REDUCED) { t = 5 * DAY + 1.6; done = true; draw(); return; }
    new IntersectionObserver(([e]) => { live = e.isIntersecting; if (live) kick(); }, { threshold: 0.3 }).observe(media);
    media.addEventListener("click", () => { if (!done) return; done = false; t = 0; kick(); });
    draw();
  });
  const revealCols = () => {
    const els = $$(".media:has(> .rv-c)"); if (!els.length || REDUCED) return;
    const upd = () => els.forEach((m) => {
      const r = m.getBoundingClientRect(), vh = innerHeight, cs = $$(".rv-c", m), n = cs.length;
      const t = clamp((vh * 0.88 - r.top) / (vh * 0.5), 0, 1);
      cs.forEach((c, j) => { const u = clamp(t * n - j, 0, 1); c.style.clipPath = `inset(${(u * 100).toFixed(1)}% 0 0 0)`; });
      $$(".fl-c", m).forEach((g, j) => { const v = clamp((t * n - j - 0.35) / 0.65, 0, 1); $$(".fl-p", g).forEach((p) => (p.style.strokeDashoffset = (1 - v).toFixed(3))); g.classList.toggle("live", v >= 1); });
    });
    // 흐르는 점: 길마다 세 개, 2.4초에 한 번 끝까지
    $$(".flow-ov").forEach((sv) => {
      const NS = "http://www.w3.org/2000/svg", dots = [];
      $$(".fl-p", sv).forEach((p) => { const L = p.getTotalLength(), g = p.parentNode; for (let k = 0; k < 3; k++) { const c = document.createElementNS(NS, "circle"); c.setAttribute("r", 6); c.setAttribute("class", "fl-d"); g.appendChild(c); dots.push([c, p, L, k / 3]); } });
      let raf = 0, live = false;
      const loop = (now) => { raf = 0; const tt = now / 2400; dots.forEach(([c, p, L, o]) => { const q = (tt + o) % 1, pt = p.getPointAtLength(q * L); c.setAttribute("cx", pt.x.toFixed(1)); c.setAttribute("cy", pt.y.toFixed(1)); c.style.opacity = Math.min(1, q * 6, (1 - q) * 6).toFixed(2); }); if (live) raf = requestAnimationFrame(loop); };
      new IntersectionObserver(([e]) => { live = e.isIntersecting; if (live && !raf) raf = requestAnimationFrame(loop); }).observe(sv);
    });
    addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
  };
  // 핀 #107: 분해 아이소 — 조각마다 clip-path로 오려 맨 뒤 조각 자리로 모였다가 펼쳐져요
  const xpHtml = (im) => {
    const { w, h, base, parts, k = 0.08 } = im.xp, P = (pts) => `polygon(${pts.map(([x, y]) => `${((x / w) * 100).toFixed(2)}% ${((y / h) * 100).toFixed(2)}%`).join(",")})`;
    const end = parts[parts.length - 1][0], src = esc(im.src);
    return `<div class="xp" data-xp>${base ? `<img src="${src}" alt="" style="clip-path:${P(base)}" decoding="async">` : ""}${parts.map((pt, i) => `<img src="${src}" alt="" decoding="async" style="clip-path:${P(pt)};z-index:${parts.length - i};--dx:${(((end[0] - pt[0][0]) / w) * 100 * (1 - k)).toFixed(2)}%;--dy:${(((end[1] - pt[0][1]) / h) * 100 * (1 - k)).toFixed(2)}%;--i:${i}">`).join("")}</div>`;
  };
  const xpInit = () => $$("[data-xp]").forEach((el) => { const io = new IntersectionObserver(([en]) => el.classList.toggle("on", en.isIntersecting), { threshold: 0.35 }); io.observe(el); });
  // 핀 #106: 전/후 비교 — 끌거나 ←→로 선을 옮기고, 처음 보일 때 한 번 저절로 쓸고 지나가요
  const baInit = () => $$("[data-ba]").forEach((el) => {
    let p = 50, anim = 0;
    const set = (v) => { p = Math.max(0, Math.min(100, v)); el.style.setProperty("--p", p + "%"); el.setAttribute("aria-valuenow", Math.round(p)); };
    const at = (e) => { const r = el.getBoundingClientRect(); set(((e.clientX - r.left) / r.width) * 100); };
    el.addEventListener("pointerdown", (e) => { cancelAnimationFrame(anim); el.setPointerCapture(e.pointerId); at(e); el.classList.add("drag"); });
    el.addEventListener("pointermove", (e) => { if (el.classList.contains("drag")) at(e); });
    el.addEventListener("pointerup", () => el.classList.remove("drag"));
    el.addEventListener("pointercancel", () => el.classList.remove("drag"));
    el.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft" || e.key === "ArrowRight") { e.preventDefault(); cancelAnimationFrame(anim); set(p + (e.key === "ArrowLeft" ? -5 : 5)); } });
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting) return; io.disconnect();
      const t0 = performance.now(), K = [[0, 50], [0.35, 96], [0.75, 4], [1, 50]];
      const step = (now) => { const t = Math.min(1, (now - t0) / 3200); let k = 1; while (K[k][0] < t) k++; const [a, va] = K[k - 1], [b, vb] = K[k], u = (t - a) / (b - a), e = u < 0.5 ? 2 * u * u : 1 - Math.pow(-2 * u + 2, 2) / 2; set(va + (vb - va) * e); if (t < 1) anim = requestAnimationFrame(step); };
      anim = requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
  });
  const seqInit = (p) => {
    const qs = p.sections.filter((x) => x.seq).map((x) => x.seq);
    $$("[data-seq]").forEach((el, k) => {
      const q = qs[k], N = q.steps.length, lis = $$(".seq-side li", el), ctr = $(".seq-ctr b", el), bar = $(".seq-bar i", el);
      const imgs = q.kind === "frames" ? $$(".seq-stage img", el) : [], top = $(".seq-top", el);
      const car = q.car ? seqCar($(".seq-stage", el), q.car) : null;
      const M = q.L ? q.L.length : 0, lds = q.L ? [$$(".seq-ln", el), $$(".seq-dt", el), $$(".seq-lb", el)] : null;
      // 핀 #139: 지시선은 정보 위계 순서로 — 층 구분(프로그램) → 주요 구조체(기둥·슬래브·보·아치) → 외피·접합부 → 마감·설비. 같은 위계 안에서는 위에서부터
      const tier = (l) => (l[5] ? 0 : /foot|shoe/i.test(l[3]) ? 2 : /column|slab|girder|core|arch|frame/i.test(l[3]) ? 1 : /facade|curtain wall|parapet/i.test(l[3]) ? 2 : 3);
      const ord = q.L ? q.L.map((l, j) => j).sort((a, b) => tier(q.L[a]) - tier(q.L[b]) || q.L[a][1] - q.L[b][1]) : [], rank = []; ord.forEach((j, n) => (rank[j] = n));
      let cur = -1, vis = -1;
      const show = (i) => {
        if (i === cur) return; const prev = cur; cur = i;
        lis.forEach((li, j) => li.classList.toggle("on", j === i));
        // 이전 단계는 아래에 잠시 남고, 새 단계가 바닥에서부터 자라 올라와요
        imgs.forEach((im, j) => { im.classList.remove("was", "gone"); if (j === prev) im.classList.add("was"); im.classList.toggle("on", j === i); });
        if (imgs[prev]) { const w = imgs[prev]; requestAnimationFrame(() => w.classList.add("gone")); }
        if (top) top.style.clipPath = `inset(0 0 ${100 - q.steps[i].y}% 0)`;
        ctr.textContent = pad(i + 1);
        if (q.tag) { const tg = $(".seq-tag", el); if (tg) { $("b", tg).textContent = q.steps[i].t; $("span", tg).textContent = q.steps[i].s || ""; tg.animate([{ opacity: 0, translate: "0 6px" }, { opacity: 1, translate: "0 0" }], { duration: 450, easing: "cubic-bezier(0.16, 1, 0.3, 1)" }); } }
      };
      const upd = () => {
        const r = el.getBoundingClientRect(), span = r.height - innerHeight;
        const t = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        bar.style.transform = `scaleX(${t})`;
        if (car) car(t, N);
        if (lds) {
          // 지시선은 위계 순서로 하나씩: 처음 한 칸은 엑소노만
          const v = Math.max(0, Math.min(M, Math.floor(t * (M + 2)) - 1));
          if (v !== vis) { vis = v; lds.forEach((g) => g.forEach((e, j) => e.classList.toggle("on", rank[j] < v)));
            if (innerWidth <= 760) { // 핀 #73: 모바일에선 글자가 겹치면 덜 중요한(나중에 나온) 이름표와 그 지시선을 숨겨요
              const keep = { l: [], r: [] }, lb = lds[2];
              lb.map((e, j) => j).filter((j) => rank[j] < v).sort((p, q2) => (q.L[q2][5] ? 1 : 0) - (q.L[p][5] ? 1 : 0) || rank[p] - rank[q2]).forEach((j) => {
                const e = lb[j], c = e.offsetTop, h = e.offsetHeight / 2 + 1, side = keep[q.L[j][0]] || keep.r;
                if (side.some(([c2, h2]) => Math.abs(c - c2) < h + h2)) lds.forEach((g) => g[j].classList.remove("on")); else side.push([c, h]);
              });
            } }
          show(v ? q.L[ord[v - 1]][4] : 0);
        } else show(Math.min(N - 1, Math.floor(t * N)));
      };
      addEventListener("scroll", upd, { passive: true }); addEventListener("resize", upd); upd();
      lis.forEach((li, j) => li.addEventListener("click", () => {
        const r = el.getBoundingClientRect(), span = r.height - innerHeight;
        scrollTo({ top: scrollY + r.top + span * ((j + 0.5) / N), behavior: "smooth" });
      }));
    });
  };
  const simInit = (p) => {
    $$("[data-sim]").forEach((el, k) => {
      const sim = p.sections.filter((x) => x.sim)[k].sim, F = sim.frames;
      const imgs = $$(".sim-view img", el), range = $("input", el), lv = $(".sim-lv", el), play = $(".sim-play", el);
      const db = $(".sim-d b", el), ds = $(".sim-d .mid", el), dt = $(".sim-t", el);
      const secs = [...$$(".sim-sec", el)].map((fig, j) => ({ w: $(".sim-w", fig), t: $(".sim-wl", fig), k: sim.sections[j].ticks, hi: $(".sim-hi", fig), hiTop: sim.sections[j].hiTop }));
      // 부드럽게: 목표값(tv)을 향해 현재값(cv)이 따라가고, 두 장 사이는 S자 곡선으로 섞여요
      let shown = -1, raf = 0, t0 = 0, playing = false, tv = 0, cv = 0, lastV = 0, dir = 1;
      // 작은 시계 + 지구 자전 (핀 #237): 간조 06:00 기준, 한 번의 조석 12 h 25 min 동안 지구는 달에 대해 반 바퀴 돌아요
      const ckH = $(".ck-h", el), ckM = $(".ck-m", el), ckR = $(".ck-rot", el), ckD = $(".ck-d", el), ckS = $(".ck-s", el);
      const clock = (v) => {
        if (!ckH) return;
        if (Math.abs(v - lastV) > 1e-4) dir = v > lastV ? 1 : -1;
        lastV = v;
        let ph = Math.acos(Math.max(-1, Math.min(1, 1 - (2 * v) / (F.length - 1)))) / (Math.PI * 2);
        if (dir < 0) ph = 1 - ph;
        const mins = ph * 745, tm = 360 + mins; // 06:00 + 경과 분
        const hh = Math.floor(tm / 60) % 24, mm = Math.floor(tm % 60);
        ckH.setAttribute("transform", `rotate(${((tm / 60) % 12) * 30})`);
        ckM.setAttribute("transform", `rotate(${(tm % 60) * 6})`);
        ckR.setAttribute("transform", `rotate(${-90 + ph * 180 + 180})`);
        ckD.textContent = String(hh).padStart(2, "0") + ":" + String(mm).padStart(2, "0");
        const e = Math.round(mins), lab = ph < 0.04 || ph > 0.96 ? "low water" : Math.abs(ph - 0.5) < 0.04 ? "high water" : ph < 0.5 ? "flood" : "ebb";
        ckS.textContent = `${lab} · LW + ${Math.floor(e / 60)} h ${String(e % 60).padStart(2, "0")}`;
      };
      const ease = (x) => x * x * (3 - 2 * x);
      // 핀 #83: 물이 차오르는 순서 지도(flood)가 있으면 물을 캔버스로 직접 그려, 물가가 실제로 번져 나가요. 평면은 물 없는 판(dry)끼리 겹쳐요
      const fl = sim.flood && $(".sim-fl", el); let FT = null, FG = null, fctx = null, fimg = null, fw = 0, fh = 0, lastFv = -1;
      const TINT = sim.tint || [198, 208, 218], EDGE = sim.edge || [70, 86, 98];
      const flDraw = (v) => {
        if (!FT || Math.abs(v - lastFv) < 0.002) return; lastFv = v;
        const d = fimg.data, tv = v * 48 + 1, n = fw * fh;
        for (let i = 0, o = 0; i < n; i++, o += 4) {
          const t = FT[i]; let a, e;
          if (t <= 0) { a = 1; e = 0; } else if (t >= 255) { a = 0; e = 0; } else { const g = FG[i], z = (tv - t) / g; a = z > 1 ? 1 : z < -1 ? 0 : (z + 1) / 2; e = z > 1.6 || z < -1.6 ? 0 : 1 - Math.abs(z) / 1.6; }
          const r = 255 - (255 - TINT[0]) * a, gg = 255 - (255 - TINT[1]) * a, b = 255 - (255 - TINT[2]) * a;
          d[o] = r + (EDGE[0] - r) * e; d[o + 1] = gg + (EDGE[1] - gg) * e; d[o + 2] = b + (EDGE[2] - b) * e; d[o + 3] = 255;
        }
        fctx.putImageData(fimg, 0, 0);
      };
      if (fl) {
        const im = new Image(); im.src = sim.flood;
        im.decode().then(() => {
          fw = im.naturalWidth; fh = im.naturalHeight; fl.width = fw; fl.height = fh;
          fctx = fl.getContext("2d"); fctx.drawImage(im, 0, 0); const raw = fctx.getImageData(0, 0, fw, fh).data, n = fw * fh;
          FT = new Float32Array(n); for (let i = 0; i < n; i++) FT[i] = raw[i * 4];
          // 계단 없애기: 단계 값끼리만 살짝 흐리고, 물가 폭(픽셀 1.3칸)이 어디서나 같게 기울기를 구해요
          const T2 = new Float32Array(FT); for (let p = 0; p < 2; p++) for (let y = 1; y < fh - 1; y++) for (let x = 1; x < fw - 1; x++) { const i = y * fw + x; if (FT[i] <= 0 || FT[i] >= 255) continue; let s2 = 0, c = 0; for (const j of [i - 1, i + 1, i - fw, i + fw, i]) if (FT[j] > 0 && FT[j] < 255) { s2 += T2[j]; c++; } T2[i] = s2 / c; }
          FG = new Float32Array(n); for (let y = 0; y < fh; y++) for (let x = 0; x < fw; x++) { const i = y * fw + x, tx = (T2[Math.min(i + 1, n - 1)] - T2[Math.max(i - 1, 0)]) / 2, ty = (T2[Math.min(i + fw, n - 1)] - T2[Math.max(i - fw, 0)]) / 2; FG[i] = Math.max(0.35, Math.min(8, Math.hypot(tx, ty))) * 1.3; }
          FT = T2; fimg = fctx.createImageData(fw, fh);
          imgs.forEach((x) => { if (x.dataset.dry) x.src = x.dataset.dry; });
          el.classList.add("fl-on"); lastFv = -1; set(cv);
        }).catch(() => {});
      }
      const set = (v) => {
        const i = Math.min(F.length - 2, Math.floor(v)), f = v - i, g = ease(f);
        flDraw(v);
        imgs.forEach((im, j) => { im.style.opacity = j === i ? 1 : j === i + 1 ? g : 0; });
        const L = F[i].level + (F[i + 1].level - F[i].level) * f;
        lv.textContent = "+" + L.toFixed(2) + " m";
        clock(v);
        // 단면들: 같은 수위의 물선을 그림 속 높이 눈금(ticks: [m, 위에서부터 비율])에 맞춰 올려요
        secs.forEach(({ w, t, k, hi, hiTop }) => {
          const yAt = (h) => {
            let j = 0; while (j < k.length - 2 && h > k[j + 1][0]) j++;
            const [h0, y0] = k[j], [h1, y1] = k[j + 1];
            return Math.max(0, Math.min(1, y0 + ((h - h0) / (h1 - h0)) * (y1 - y0))) * 100;
          };
          const y = yAt(L);
          t.style.top = y.toFixed(2) + "%"; t.textContent = "+" + L.toFixed(2) + " m";
          w.style.top = y.toFixed(2) + "%";
          if (hi) {
            // 만조 그림(설계자가 그린 물)을 지금 수위 아래만 보이게 잘라 붙여요. 만조선 위로는 같은 물빛을 더해요.
            const yh = yAt(Math.min(L, hiTop));
            hi.style.clipPath = `inset(${yh.toFixed(2)}% 0 0 0)`;
            w.style.bottom = (100 - (L > hiTop ? yAt(hiTop) : y)).toFixed(2) + "%";
          }
        });
        const n = Math.round(v);
        if (n !== shown) {
          shown = n; el.classList.add("chg");
          setTimeout(() => { db.textContent = "+" + F[n].level + " m"; ds.textContent = F[n].share; dt.textContent = F[n].d; el.classList.remove("chg"); }, 180);
        }
      };
      const PERIOD = 22000; // 한 번의 밀물·썰물을 22초로
      const loop = (now) => {
        if (playing) { const ph = ((now - t0) / PERIOD) % 1; tv = (1 - Math.cos(ph * Math.PI * 2)) / 2 * (F.length - 1); range.value = tv; }
        cv += (tv - cv) * (playing ? 0.25 : 0.075);
        if (Math.abs(tv - cv) < 0.0005) cv = tv;
        set(cv);
        raf = playing || cv !== tv ? requestAnimationFrame(loop) : 0;
      };
      const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
      const stop = () => { playing = false; play.textContent = "Play tide"; play.setAttribute("aria-pressed", "false"); };
      range.addEventListener("input", () => { stop(); tv = +range.value; kick(); });
      // 평면 위에서 휠을 굴리면 물이 오르내려요 (맨 아래·맨 위에 닿으면 페이지가 다시 움직여요)
      const view = $(".sim-view", el), MAX = F.length - 1;
      view.addEventListener("wheel", (e) => {
        const d = (Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX) * (e.deltaMode === 1 ? 33 : 1);
        const next = Math.min(MAX, Math.max(0, tv + (d / 100) * 0.18));
        if (next === tv && (tv === 0 || tv === MAX)) return;
        e.preventDefault(); stop(); tv = next; range.value = tv; kick();
      }, { passive: false });
      play.addEventListener("click", () => {
        if (playing) return stop();
        const ph = Math.acos(1 - (2 * cv) / (F.length - 1)) / (Math.PI * 2);
        t0 = performance.now() - ph * PERIOD; playing = true; play.textContent = "Pause"; play.setAttribute("aria-pressed", "true"); kick();
      });
      set(0);
    });
  };

  render.project = () => {
    const draw = () => {
      if (hasGsap) ScrollTrigger.getAll().forEach((t) => t.kill());
      const slug = decodeURIComponent(location.hash.slice(1));
      let i = PROJECTS.findIndex((p) => p.slug === slug);
      if (i < 0) i = 0;
      const p = PROJECTS[i], LIVE = PROJECTS.filter((q) => !q.draft), li = LIVE.indexOf(p);
      const nx = li >= 0 ? LIVE[(li + 1) % LIVE.length] : PROJECTS[(i + 1) % N], ni = PROJECTS.indexOf(nx);
      document.title = `${p.title} — ${SITE.name}`;
      HTML.dataset.slug = p.slug; // 디자인 조정(tune.css)에서 "이 작품에만" 규칙이 쓰는 이름
      const tb = $(".tb-title"); if (tb) tb.textContent = p.title;
      $$(".tblock dd")[0] && ($$(".tblock dd")[0].textContent = "A-1" + pad(i + 1));
      const hs = $(".hud-s"), hn = $(".hud-n"); if (hs) hs.textContent = "A-1" + pad(i + 1); if (hn) hn.textContent = p.title; // 작품을 넘겨도 아래 표시가 따라오게
      let fig = 1;
      // 핀 #68: 번호 점에서 오른쪽 이름표까지 지시선. 이름표는 위에서부터 겹치지 않게 내려 놓아요
      const leadHtml = (im) => {
        const m = (100 - im.lead) / 100, G = im.leadGap || 3.4;
        const pts = (im.tags || []).filter(([, , , al, k]) => /\bpt\b/.test(`${al} ${k}`)).map(([x, y, t]) => {
          const n = (im.notes || []).find((q) => q[0] === t); return { x, y, t, nm: n ? n[1] : "" };
        }).sort((a, b) => a.y - b.y);
        pts.forEach((p, i) => { p.ly = Math.max(p.y, i ? pts[i - 1].ly + G : 2); });
        for (let i = pts.length - 1; i >= 0; i--) { const hi = i === pts.length - 1 ? 98 : pts[i + 1].ly - G; if (pts[i].ly > hi) pts[i].ly = hi; }
        const X = (x) => x * m * 10, E1 = m * 1000 + 8, E2 = m * 1000 + 26, E3 = m * 1000 + 34;
        return `<svg class="ld-svg" viewBox="0 0 1000 1000" preserveAspectRatio="none" aria-hidden="true">${pts.map((p) => `<path d="M${X(p.x).toFixed(1)} ${(p.y * 10).toFixed(1)}H${E1.toFixed(1)}L${E2.toFixed(1)} ${(p.ly * 10).toFixed(1)}H${E3.toFixed(1)}"/>`).join("")}</svg>`
          + pts.map((p) => `<i class="ld-dot" style="left:${(p.x * m).toFixed(2)}%;top:${p.y}%"></i><span class="ld-lb" style="left:calc(${(m * 100).toFixed(2)}% + 3.6%);top:${p.ly.toFixed(2)}%"><b class="num">${esc(p.t)}</b>${esc(p.nm)}</span>`).join("");
      };
      const figure = (im, seed, w, h) => `
        <figure data-reveal="wipe"${im.span ? " style=\"grid-column:1/-1\"" : ""}>${im.lead ? `<div class="ldw" style="--lw:${im.lead}%">` : ""}<div class="media${im.lite ? " lite" : ""}${im.tall ? " tall" : ""}"${im.r ? ` style="--r:${im.r};aspect-ratio:${im.r}${im.lead ? ";width:calc(100% - var(--lw))" : im.w ? `;width:${im.w}` : ""}"` : ""}>${im.xp ? xpHtml(im) : im.ba ? `<div class="ba" data-ba tabindex="0" role="slider" aria-label="Before and after" aria-valuemin="0" aria-valuemax="100" aria-valuenow="50" style="--p:50%"><img src="${esc(im.ba[1])}" alt="After" decoding="async" draggable="false"><div class="ba-b"><img src="${esc(im.ba[0])}" alt="Before" decoding="async" draggable="false"></div><i class="ba-h" aria-hidden="true"></i><span class="ba-t ba-tl">${esc(im.baL ? im.baL[0] : "Before")}</span><span class="ba-t ba-tr">${esc(im.baL ? im.baL[1] : "After")}</span></div>` : im.sim ? `<div class="mz"><div class="mv-sim mv-${im.sim}" data-mv="${im.sim}" data-bg="${esc(im.src || "")}" data-lenis-prevent></div></div>` : mz(art(im.src, im.kind || "axon", seed, w, h, p.mass, im.caption))}${im.flow ? flowSvg(im.flow) : ""}${im.sun ? `<svg class="sun-ov" viewBox="0 0 2000 459" preserveAspectRatio="none" aria-hidden="true"><path class="sun-tr"/><rect class="sun-col" y="40" width="82" height="380"/><line class="sun-h"/><circle class="sun-dot" r="9"/></svg><span class="sun-lb"></span>` : ""}${im.reveal ? Array.from({ length: im.reveal }, (_, j) => `<i class="rv-c" style="--j:${j};--n:${im.reveal}" aria-hidden="true"></i>`).join("") : ""}${im.tags ? im.tags.map(([x, y, t, al, k]) => `<span class="ftag${al ? ` ${al}` : ""}${k ? ` ${k}` : ""}${im.lead && /\bpt\b/.test(`${al} ${k}`) ? " ld-alt" : ""}" style="left:${x}%;top:${y}%">${esc(t)}</span>`).join("") : ""}</div>${im.lead ? leadHtml(im) + "</div>" : ""}
        ${im.notes ? `<ol class="fnotes${im.ln ? " ld-m" : ""}" style="--n:${im.nc || im.notes.length}${im.w ? `;width:${im.w}` : ""}">${im.notes.map(([n, t, d]) => `<li><b><span class="mid num">${esc(n)}</span> ${esc(t)}</b>${d ? `<span class="mid">${esc(d)}</span>` : ""}</li>`).join("")}</ol>` : ""}
        <figcaption class="figcap mono"><span>${esc(capOf(im))}</span></figcaption></figure>`;
      // 렌더 장면 줄 나누기: 가로(r ≥ 1.3)는 한 줄 한 장, 이어지는 세로·정사각은 두 장씩(남는 셋은 세 장 한 줄)
      const scenesHtml = (sec, si) => {
        const rows = [], im = sec.images; let i = 0;
        while (i < im.length) {
          if (im[i].r >= 1.3) { rows.push([im[i]]); i++; continue; }
          let j = i; while (j < im.length && im[j].r < 1.3) j++;
          let run = im.slice(i, j); i = j;
          while (run.length) { const k = run.length === 3 ? 3 : Math.min(2, run.length); rows.push(run.slice(0, k)); run = run.slice(k); }
        }
        let ii = 0;
        return `<div class="scn">${rows.map((row) => `<div class="scn-r" style="--n:${row.length}">${row.map((m) => figure(m, `${p.slug}-${si}-${ii++}`, 1600, 900)).join("")}</div>`).join("")}</div>`;
      };
      const facts = [["Year", p.year], ["Studio", p.studio], ["Award", p.award !== "A+" && p.award], ["Type", p.type], ["Program", p.program], ["Site", p.site], ["Area", p.area], ["Team", p.team], ["Tools", p.tools]].filter((f) => f[1]);
      wi = 0;
      const title = words(p.title);
      $("#main").innerHTML = `
        <article class="pg cx">
          <header class="cx-hd g4 ${(p.coverR || 0.8) >= 1.2 ? "cx-w" : "cx-t"}" style="--r:${p.coverR || 0.8}">
            <div class="cx-l">
              <div class="cx-tt">
                <h1 class="cx-h">${esc(p.title)}</h1>
                <div class="cx-meta">
                  <p><span>${esc(p.titleKo || p.title)}</span><span class="num">${esc(p.year)}</span></p>
                  <p>${[p.type, p.studio, p.award && p.award !== "A+" ? p.award : ""].filter(Boolean).map((t) => `<span>${esc(t)}</span>`).join("")}</p>
                </div>
              </div>
            </div>
            <figure class="cx-cv"><div class="media">${p.coverVideo && !REDUCED ? `<video class="cx-vid" src="${esc(p.coverVideo)}" poster="${esc(p.cover)}" autoplay muted loop playsinline preload="auto" aria-label="${esc(p.title)}"></video>` : cover(p, 2400, Math.round(2400 / (p.coverR || 0.8)))}</div></figure>
            <div class="cx-lead">
              <p class="cx-big">${esc(p.summary)}</p>
              <dl class="pj-facts cx-facts">${facts.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join("")}</dl>
            </div>
          </header>
          <div class="pj-body cx-body g4">
            <div class="pj-main">
              ${p.sections.map((s, si) => `
              <section class="pj-sec${s.big || /scene|render|view|interior|exterior/i.test(s.heading) ? " ph" : ""}${s.beside ? " bes" : ""}" id="s${si + 1}" data-toc="${esc(s.heading)}" data-v="${s.v != null ? s.v : si % 4}">
                <div class="hd"><span class="num">${pad(si + 1)}.</span><h2>${esc(s.heading)}</h2></div>
                <p class="txt" data-reveal>${esc(s.text)}</p>
                ${s.sim ? simHtml(s.sim) : ""}${s.panel ? mapHtml(s.panel) : ""}${s.widget && s.seq ? `<div class="tw tw-${s.widget}" data-tw="${s.widget}"${s.wsrc ? ` data-src="${esc(s.wsrc)}"` : ""} data-lenis-prevent data-reveal></div>` : ""}${s.seq ? seqHtml(s.seq) : ""}${s.seasons ? ssnHtml(s.seasons) : ""}${s.keyed ? keyedHtml(s.keyed) : ""}${s.pan && !s.pan.after ? panHtml(s.pan) : ""}${s.widget && !s.seq ? `<div class="tw tw-${s.widget}" data-tw="${s.widget}"${s.wsrc ? ` data-src="${esc(s.wsrc)}"` : ""} data-lenis-prevent data-reveal></div>` : ""}
                ${s.scenes ? scenesHtml(s, si) : s.images.length ? `<div class="figs ${s.cols ? "gc" : s.stack ? "n1 stk" : `n${Math.min(3, s.images.length)}`}"${s.cols ? ` style="--c:${s.cols}${s.cw ? `;grid-template-columns:${s.cw.map((x) => x + "fr").join(" ")}` : ""}${s.gap ? `;column-gap:${s.gap}` : ""}"` : ""}>${s.images.map((im, ii) => {
                  const big = s.stack || s.images.length === 1 || (s.images.length === 3 && ii === 0);
                  return figure(im, `${p.slug}-${si}-${ii}`, big ? 1600 : 1200, s.images.length === 1 ? 1000 : 900);
                }).join("")}</div>` : ""}${s.pan && s.pan.after ? panHtml(s.pan) : ""}
              </section>`).map((h, si, all) => p.sections[si].pair ? `<div class="pj-pair">${h}` : si && p.sections[si - 1].pair ? `${h}</div>` : h).join("")}
            </div>
          </div>
          ${p.drawings && p.drawings.length ? `
          <section class="dwg" id="sd" data-toc="Drawing set">
            <div class="dwg-hd wrap mono"><span>Drawings <span class="mid num">(${pad(p.drawings.length)})</span></span><span class="mid">Scroll →</span></div>
            <div class="dwg-vp wrap"><div class="dwg-track">${p.drawings.map((d, di) => `
              <figure${d.r ? ` class="r" style="--r:${d.r}"` : ""}><div class="media">${mz(art(d.src, d.kind, `${p.slug}-d${di}`, 1500, 1000, p.mass, d.caption))}${d.tags ? d.tags.map(([x, y, t, al, k]) => `<span class="ftag${al ? ` ${al}` : ""}${k ? ` ${k}` : ""}" style="left:${x}%;top:${y}%">${esc(t)}</span>`).join("") : ""}</div>
              <figcaption class="figcap mono"><span>Dwg. ${pad(di + 1)}</span><span>${esc(capOf(d))}</span></figcaption></figure>`).join("")}
            </div></div>
          </section>` : ""}
          <a class="cx-nx g4" href="project.html#${nx.slug}" aria-label="Next case: ${esc(nx.title)}">
            <span class="cx-nt"><span class="cx-nl">next case</span><span class="cx-nn">${esc(nx.title)}</span></span>
            <span class="cx-nm"><span class="media">${mz(card(nx, 600, 800))}</span></span>
          </a>
        </article>`;

      simInit(p);
      baInit(); xpInit(); seqInit(p); ssnInit(p); panInit(); revealCols(); keyedInit(); sunInit();
      if (window.TideWidgets) $$("[data-tw]").forEach((w) => TideWidgets.mount(w, w.dataset.tw));
      if (window.MVSims) $$("[data-mv]").forEach((w) => MVSims.mount(w, w.dataset.mv));
      // 목차 + 현재 위치 표시
      const secs = $$("[data-toc]");
      const toc = $(".toc");
      if (toc) toc.innerHTML = secs.map((s) => `<button type="button" data-t="${s.id}">${esc(s.dataset.toc)}</button>`).join("");
      if (toc) {
        $$("button", toc).forEach((b) => b.addEventListener("click", () => scrollToEl("#" + b.dataset.t)));
        const spy = new IntersectionObserver((es) => es.forEach((en) => {
          if (en.isIntersecting) $$("button", toc).forEach((b) => b.classList.toggle("on", b.dataset.t === en.target.id));
        }), { rootMargin: "-35% 0px -60% 0px" });
        secs.forEach((s) => spy.observe(s));
      }
      lineRise($(".cx-big"));

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
  // ---------- v2 About (계획 8–10단계) ----------
  // 큰 문장: 단어를 줄 단위로 묶어 화면에 들어올 때 한 줄씩 아래에서 올라와요
  function lineRise(el) {
    if (!el) return;
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map((w) => `<span class="lr-w">${esc(w)}</span>`).join(" ");
    const ws = $$(".lr-w", el), lines = [];
    let top = null;
    ws.forEach((w) => { if (w.offsetTop !== top) { lines.push([]); top = w.offsetTop; } lines[lines.length - 1].push(w.textContent); });
    el.innerHTML = lines.map((l, i) => `<span class="lr-l"><span class="lr-i" style="--i:${i}">${l.map(esc).join(" ")}</span></span>`).join(" ");
    el.classList.add("lr");
    if (REDUCED || !("IntersectionObserver" in window)) return el.classList.add("in");
    const o = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { el.classList.add("in"); o.disconnect(); } }), { threshold: 0.2 });
    o.observe(el);
  }
  const draftTag = (x) => (x && x.draft ? ` <span class="dr" title="초안 — data.js에서 draft를 지우면 사라져요">Draft</span>` : "");

  render.about = () => {
    const AB = SITE.about || {}, PL = SITE.pillars || [], steps = (AB.process && AB.process.steps) || [];
    const list = (rows) => rows.map(([a, b, c, e]) => `<li><span class="mono">${esc(a)}</span><span>${esc(b)}${c ? ` <span class="aw-w">${esc(c)}</span>` : ""}${e ? `<small class="mid">${esc(e)}</small>` : ""}</span></li>`).join("");
    const sec = (t, rows) => rows && rows.length ? `<section class="cv-sec" data-reveal><h2 class="mono mid">${t}</h2><ul>${list(rows)}</ul></section>` : "";
    const fig = (k) => `<svg class="pf" viewBox="0 0 400 500" aria-hidden="true">${Drawing.fig(k)}</svg>`;
    $("#main").innerHTML = `
      <div class="ab2 ab3">
        <section class="ab-st g4"><h1 class="ab-big">${esc(SITE.owner)}</h1><p class="ab-sub mid">${esc(SITE.ownerKo || "")} — ${esc(SITE.role)}, ${esc(SITE.based)}. ${esc(SITE.status)}.</p></section>

        <section class="ab-me g4">
          <div class="ab-pic">${mz(art(SITE.portrait, "portrait", "me", 900, 1200, null, SITE.owner))}</div>
          <div class="ab-col">
            <h2 class="ab-lab">About me</h2>
            <p class="ab-p">${esc(CV.intro)}</p>
            <h2 class="ab-lab">${esc(AB.toolkitTitle || "Toolkit")}</h2>
            <p class="ab-p">${CV.skills.map(([t]) => esc(t)).join(", ")}</p>
            <section class="ab-cv"> <!-- 핀 #76: Profile/CV를 사진 옆 칸 안으로 넣어 사진이 끝까지 따라와요 -->
          <h2 class="ab-lab">${esc(AB.cvTitle || "Profile")}</h2>
          <div class="txt ab-cvb">
            <dl class="facts mono">
              <div><dt>Birth</dt><dd class="num">${esc(SITE.birth)}</dd></div>
              <div><dt>Based</dt><dd>${esc(SITE.based)}</dd></div>
              <div><dt>Status</dt><dd>${esc(SITE.status)}</dd></div>
              <div><dt>Email</dt><dd><a class="lnk" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></dd></div>
              ${SITE.links.map((l) => `<div><dt>${esc(l.label)}</dt><dd><a class="lnk" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.href.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@"))}</a></dd></div>`).join("")}
              <div><dt>Language</dt><dd>${esc(CV.languages.join(", "))}</dd></div>
            </dl>
            ${sec("Education", CV.education)}
            ${sec("Experience", CV.experience)}
            <section class="cv-sec" data-reveal><h2 class="mono mid">Awards</h2><ul>${CV.awards.map(([t, c, prize, w]) => `<li><span class="mono">${esc(t)}</span><span>${esc(c)} <b class="prize">${esc(prize)}</b> <span class="aw-w">${esc(w)}</span></span></li>`).join("")}</ul></section>
            ${sec("Activities", CV.activities)}
            ${sec("Certification", CV.certification)}
            ${sec("Course", CV.courses)}
            ${sec("Design Studio", CV.studios)}
            ${sec("Military", CV.military)}
            </div>
            </section>
          </div>
        </section>
      </div>`;
    lineRise($(".ab-big"));
  };
  render.aboutV2 = () => {
    const AB = SITE.about || {}, PL = SITE.pillars || [], steps = (AB.process && AB.process.steps) || [];
    const list = (rows) => rows.map(([a, b, c, e]) => `<li><span class="mono">${esc(a)}</span><span>${esc(b)}${c ? ` <span class="aw-w">${esc(c)}</span>` : ""}${e ? `<small class="mid">${esc(e)}</small>` : ""}</span></li>`).join("");
    const sec = (t, rows) => rows && rows.length ? `<section class="cv-sec" data-reveal><h2 class="mono mid">${t}</h2><ul>${list(rows)}</ul></section>` : "";
    const fig = (k) => `<svg class="pf" viewBox="0 0 400 500" aria-hidden="true">${Drawing.fig(k)}</svg>`;
    $("#main").innerHTML = `
      <div class="ab2">
        <section class="ab-st g4"><h1 class="ab-big">${esc(SITE.manifesto.en)}</h1></section>

        <section class="ab-me g4">
          <div class="ab-pic">${mz(art(SITE.portrait, "portrait", "me", 900, 1200, null, SITE.owner))}</div>
          <div class="ab-col">
            <h2 class="ab-lab">About me</h2>
            <p class="ab-p">${esc(CV.intro)}</p>
            <p class="ab-p mid">${esc(SITE.ownerKo || "")} ${esc(SITE.owner)} — ${esc(SITE.role)}, ${esc(SITE.based)}. ${esc(SITE.status)}.</p>
          </div>
        </section>

        <section class="ab-do g4">
          <div class="ab-pic ab-pic2">${AB.image2 ? mz(`<img src="${esc(AB.image2)}" alt="" loading="lazy" decoding="async">`) : ""}</div>
          <div class="ab-col">
            <h2 class="ab-lab">${esc(AB.doTitle || "What I do")}${draftTag(AB.approach)}</h2>
            <ol class="ab-ol">${((AB.approach && AB.approach.items) || []).map((t, i) => `<li><span class="num">${pad(i + 1)}.</span>${esc(t)}</li>`).join("")}</ol>
            <h2 class="ab-lab">${esc(AB.toolkitTitle || "Toolkit")}</h2>
            <p class="ab-p">${CV.skills.map(([t]) => esc(t)).join(", ")}</p>
          </div>
        </section>

        <section class="ab-lead g4"><p class="ab-big2">${esc((AB.valuesLead || {}).text || "")}</p>${draftTag(AB.valuesLead)}</section>
        <section class="cvx g4" aria-label="Core values">
          <div class="cvx-bg" aria-hidden="true">${PL.map((p, i) => `<div class="cvx-f" data-i="${i}">${fig(p.fig)}</div>`).join("")}</div>
          ${PL.map((p, i) => `
          <article class="cvx-c" data-i="${i}" tabindex="0">
            <h3 class="cvx-t"><span class="num">${pad(i + 1)}.</span> ${esc(p.k)}</h3>
            <div class="cvx-fig">${fig(p.fig)}</div>
            <div class="cvx-tx"><p class="cvx-en">${esc(p.en)}</p><p class="cvx-d">${esc(p.d)}</p></div>
          </article>`).join("")}
        </section>

        <section class="ab-lead g4"><p class="ab-big2">${esc((AB.processLead || {}).text || "")}</p>${draftTag(AB.processLead)}</section>
        <section class="pcx" style="--n:${steps.length}" aria-label="Process">
          <div class="pcx-st g4">
            <h2 class="ab-lab pcx-lab">Process${draftTag(AB.process)}</h2>
            <div class="pcx-row">${steps.map((st, i) => `<span class="pcx-k" data-i="${i}"><span class="num">${pad(i + 1)}.</span>${esc(st.k)}</span>`).join("")}</div>
            <div class="pcx-d">${steps.map((st, i) => `<div class="pcx-di" data-i="${i}"><p class="ab-p">${esc(st.d)}</p><p class="pcx-tg">${esc(st.t)}</p></div>`).join("")}</div>
            <p class="pcx-c num" aria-hidden="true"><span class="pcx-ci">01</span> / ${pad(steps.length)}</p>
          </div>
        </section>

        <section class="ab-cv g4">
          <h2 class="ab-lab">${esc(AB.cvTitle || "Profile")}</h2>
          <div class="txt ab-cvb">
            <dl class="facts mono">
              <div><dt>Birth</dt><dd class="num">${esc(SITE.birth)}</dd></div>
              <div><dt>Based</dt><dd>${esc(SITE.based)}</dd></div>
              <div><dt>Status</dt><dd>${esc(SITE.status)}</dd></div>
              <div><dt>Email</dt><dd><a class="lnk" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></dd></div>
              ${SITE.links.map((l) => `<div><dt>${esc(l.label)}</dt><dd><a class="lnk" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.href.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@"))}</a></dd></div>`).join("")}
              <div><dt>Language</dt><dd>${esc(CV.languages.join(", "))}</dd></div>
            </dl>
            ${sec("Education", CV.education)}
            ${sec("Experience", CV.experience)}
            <section class="cv-sec" data-reveal><h2 class="mono mid">Awards</h2><ul>${CV.awards.map(([t, c, prize, w]) => `<li><span class="mono">${esc(t)}</span><span>${esc(c)} <b class="prize">${esc(prize)}</b> <span class="aw-w">${esc(w)}</span></span></li>`).join("")}</ul></section>
            ${sec("Activities", CV.activities)}
            ${sec("Certification", CV.certification)}
            ${sec("Course", CV.courses)}
            ${sec("Design Studio", CV.studios)}
            ${sec("Military", CV.military)}
          </div>
        </section>
      </div>`;
    lineRise($(".ab-big"));
    $$(".ab-big2").forEach(lineRise);
    coreValues();
    processPin();
  };

  // Core values: 카드에 올리면(또는 키보드로 들어가면) 그 선 도면이 화면 전체에 그려져요
  function coreValues() {
    const sec = $(".cvx");
    if (!sec) return;
    const set = (i) => {
      sec.classList.toggle("hov", i >= 0);
      $$(".cvx-c", sec).forEach((c) => c.classList.toggle("on", +c.dataset.i === i));
      $$(".cvx-f", sec).forEach((f) => f.classList.toggle("on", +f.dataset.i === i));
    };
    $$(".cvx-c", sec).forEach((c) => {
      c.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") set(+c.dataset.i); });
      c.addEventListener("focus", () => set(+c.dataset.i));
      c.addEventListener("blur", () => set(-1));
    });
    sec.addEventListener("pointerleave", () => set(-1));
  }

  // Process: 구간이 화면에 고정되고, 스크롤 진행에 따라 단계 이름 줄이 옆으로 한 칸씩 밀려요.
  // 지금 단계는 셋째 칸 시작점에 오고 진하게, 나머지는 흐리게. 스크롤이 멈추면 가까운 단계에 맞춰 멈춰요.
  function processPin() {
    const sec = $(".pcx");
    if (!sec) return;
    const row = $(".pcx-row", sec), ks = $$(".pcx-k", sec), ds = $$(".pcx-di", sec), ci = $(".pcx-ci", sec), n = ks.length;
    if (!n) return;
    let cur = -1, snapT = 0, curX = 0;
    const anchor = () => { const c = $(".pcx-d", sec).getBoundingClientRect(); return c.left; };
    const setStep = (i) => {
      if (i === cur) return;
      cur = i;
      ks.forEach((k, j) => k.classList.toggle("on", j === i));
      ds.forEach((dd, j) => dd.classList.toggle("on", j === i));
      ci.textContent = pad(i + 1);
      curX = $(".pcx-d", sec).offsetLeft - row.offsetLeft - (ks[i].offsetLeft - ks[0].offsetLeft); // offsetLeft는 밀기(transform)와 상관없는 원래 자리
      row.style.transform = `translate3d(${curX.toFixed(1)}px,0,0)`;
    };
    const place = () => { // 크기가 바뀌면 처음부터 다시 계산
      row.style.transition = "none"; row.style.transform = "none"; curX = 0;
      const i = cur < 0 ? 0 : cur; cur = -1; setStep(i);
      requestAnimationFrame(() => (row.style.transition = ""));
    };
    const prog = () => {
      const b = sec.getBoundingClientRect(), len = sec.offsetHeight - innerHeight;
      return { p: clamp(-b.top / Math.max(1, len), 0, 1), top: b.top + scrollY, len };
    };
    const on = () => {
      const { p } = prog();
      setStep(Math.min(n - 1, Math.floor(p * n * 0.9999)));
      if (REDUCED) return;
      clearTimeout(snapT);
      snapT = setTimeout(() => { // 단계 사이에서 멈추면 가까운 단계의 가운데로
        const { p: q, top, len } = prog();
        if (q <= 0 || q >= 1) return;
        const target = top + ((Math.min(n - 1, Math.floor(q * n)) + 0.5) / n) * len;
        if (Math.abs(target - scrollY) < 8) return;
        if (lenis) lenis.scrollTo(target, { duration: 0.6 }); else scrollTo({ top: target, behavior: "smooth" });
      }, 180);
    };
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", place);
    place(); on();
  }

  render.aboutV1 = () => {
    // [기간, 이름, 보조 설명, 자세한 내용]
    const list = (rows) => rows.map(([a, b, c, e]) => `<li><span class="mono">${esc(a)}</span><span>${esc(b)}${c ? ` <span class="aw-w">${esc(c)}</span>` : ""}${e ? `<small class="mid">${esc(e)}</small>` : ""}</span></li>`).join("");
    const sec = (t, rows) => rows && rows.length ? `<section class="cv-sec" data-reveal><h2 class="mono mid">${t}</h2><ul>${list(rows)}</ul></section>` : "";
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
            <dl class="facts mono">
              <div><dt>Birth</dt><dd class="num">${esc(SITE.birth)}</dd></div>
              <div><dt>Based</dt><dd>${esc(SITE.based)}</dd></div>
              <div><dt>Status</dt><dd>${esc(SITE.status)}</dd></div>
              <div><dt>Email</dt><dd><a class="lnk" href="mailto:${esc(SITE.email)}">${esc(SITE.email)}</a></dd></div>
              ${SITE.links.map((l) => `<div><dt>${esc(l.label)}</dt><dd><a class="lnk" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.href.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@"))}</a></dd></div>`).join("")}
              <div><dt>Language</dt><dd>${esc(CV.languages.join(", "))}</dd></div>
            </dl>
            ${sec("Education", CV.education)}
            ${sec("Experience", CV.experience)}
            <section class="cv-sec" data-reveal><h2 class="mono mid">Awards</h2><ul>${CV.awards.map(([t, c, prize, w]) => `<li><span class="mono">${esc(t)}</span><span>${esc(c)} <b class="prize">${esc(prize)}</b> <span class="aw-w">${esc(w)}</span></span></li>`).join("")}</ul></section>
            ${sec("Activities", CV.activities)}
            ${sec("Certification", CV.certification)}
            ${sec("Course", CV.courses)}
            ${sec("Design Studio", CV.studios)}
            <section class="cv-sec" data-reveal><h2 class="mono mid">Skills</h2><ul class="sk">${CV.skills.map(([t, n]) => `<li><span>${esc(t)}</span><span class="sk-bar" role="img" aria-label="${n} / 5">${[1, 2, 3, 4, 5].map((k) => `<i class="${k <= n ? "on" : ""}"></i>`).join("")}</span><span class="mid num">${n}/5</span></li>`).join("")}</ul></section>
            ${sec("Military", CV.military)}
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
  contactPanel();
  links();
  utils();
  (render[PAGE] || render.home)();
  TX.arrive(); // 첫 화면 카드에서 넘어왔으면 단어 모듈이 흩어지며 페이지가 드러나요
  stArrive();
  chromeScroll();
  if (PAGE !== "project") { reveals(); parallax(); } else reveals($("footer"));
  if (showLoader && PAGE !== "home" && PAGE !== "works") loader(() => ready.fire());
  else {
    if (fromVeil) { ss.del("yp-veil"); $(".vl", veil).textContent = fromVeil; veilOut(); }
    setTimeout(() => ready.fire(), fromVeil ? 300 : 0);
  }
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(() => hasGsap && ScrollTrigger.refresh());
  addEventListener("load", () => hasGsap && ScrollTrigger.refresh());

  // 다크 모드: 흰 바탕 선 도면만 골라 표시(.dg) → CSS에서 색을 뒤집어 검은 바탕·흰 선으로
  // 판별: 작게 줄여 보았을 때 흰 픽셀이 많고 색이 거의 없으면 도면, 아니면 렌더 사진
  const SKIP = ".seq-lead, .tw-lw, .pan-win, .tw-fplan, .pan-belt, .hero, #top, .wcard, .pr-body, .ab";
  const cv = D.createElement("canvas"); cv.width = cv.height = 48;
  const cx = cv.getContext("2d", { willReadFrequently: true });
  const judge = (img) => {
    if (img.dataset.dg || !img.naturalWidth || img.closest(SKIP)) return;
    img.dataset.dg = "0";
    try {
      cx.clearRect(0, 0, 48, 48); cx.drawImage(img, 0, 0, 48, 48);
      const p = cx.getImageData(0, 0, 48, 48).data;
      let white = 0, color = 0, n = 0;
      for (let i = 0; i < p.length; i += 4) {
        if (p[i + 3] < 20) { white++; n++; continue; } // 투명(SVG 바탕)도 흰색으로
        const mx = Math.max(p[i], p[i + 1], p[i + 2]), mn = Math.min(p[i], p[i + 1], p[i + 2]);
        if (mn > 232) white++;
        if (mx - mn > 60) color++;
        n++;
      }
      if (white / n > 0.3 && color / n < 0.08) { img.dataset.dg = "1"; img.classList.add("dg"); }
    } catch (e) {}
  };
  const scan = () => D.querySelectorAll("img").forEach((im) => (im.complete ? judge(im) : null));
  D.addEventListener("load", (e) => { if (e.target.tagName === "IMG") judge(e.target); }, true);
  addEventListener("load", scan);
  setTimeout(scan, 1500);
})();
