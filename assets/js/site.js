// ============================================================
// site.js — 모든 페이지가 공유하는 "설비"
//  1) 상단바·푸터 자동 삽입   2) 인트로·페이지 전환 모션
//  3) 스크롤 등장 모션·패럴랙스   4) 커서   5) 페이지별 내용 그리기
//  6) 메인 히어로 모션아트(매스 와이어프레임)
// ============================================================

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const PAGE = document.body.dataset.page; // home | projects | project | about
const ROOT = document.body.dataset.root || ""; // 하위 폴더 페이지에서 경로 보정용
const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;

// 이미지 또는 자리표시
const media = (src, label = "Image") =>
  src ? `<img src="${ROOT}${src}" alt="" loading="lazy" />` : `<div class="ph">${label}</div>`;

// 단어 단위로 쪼개서 한 단어씩 올라오게
const split = (text) =>
  text.split(" ").map((w) => `<span class="w"><i>${w}</i></span>`).join(" ");

// ---------- 1) 상단바·푸터 ----------
function chrome() {
  const links = [
    ["projects.html", "Projects", "projects"],
    ["about.html", "About", "about"],
  ];
  document.body.insertAdjacentHTML(
    "afterbegin",
    `<nav class="nav"><a class="logo" href="${ROOT}index.html">${SITE.name}</a><ul>${links
      .map(([h, t, k]) => `<li><a href="${ROOT}${h}" ${PAGE === k || (k === "projects" && PAGE === "project") ? 'aria-current="page"' : ""}>${t}</a></li>`)
      .join("")}</ul></nav><div class="curtain"></div><div class="cursor"></div>`
  );
  document.body.insertAdjacentHTML(
    "beforeend",
    `<footer><p class="label" style="color:#9a978f">Contact</p>
     <a class="big" href="mailto:${SITE.email}">Let's talk →</a>
     <div class="row"><span>© ${new Date().getFullYear()} ${SITE.owner} · ${SITE.name}</span>
     <span>${SITE.email}${SITE.instagram ? ` · <a href="${SITE.instagram}">Instagram</a>` : ""}</span></div></footer>`
  );
}

// ---------- 2) 인트로 & 페이지 전환 ----------
function intro() {
  let seen = false;
  try { seen = sessionStorage.getItem("intro") === "1"; sessionStorage.setItem("intro", "1"); } catch (e) {}
  if (PAGE !== "home" || seen || REDUCED) return;
  const el = document.createElement("div");
  el.className = "loader";
  el.innerHTML = `<span>${[...SITE.name].map((c, i) => `<i style="animation-delay:${i * 0.06}s">${c}</i>`).join("")}</span><b class="pct">0%</b>`;
  document.body.appendChild(el);
  // 0% → 100% 카운트
  const pct = el.querySelector(".pct"), t0 = performance.now(), dur = 1200;
  (function count(now) {
    const k = Math.min(1, (now - t0) / dur);
    pct.textContent = Math.round((1 - Math.pow(1 - k, 3)) * 100) + "%";
    if (k < 1) requestAnimationFrame(count);
    else { el.classList.add("done"); setTimeout(() => el.remove(), 1400); }
  })(t0);
}
function transitions() {
  const curtain = $(".curtain");
  // 뒤로가기로 돌아왔을 때 커튼이 덮여 있지 않게
  addEventListener("pageshow", () => curtain.classList.remove("in"));
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (!a || a.target || e.metaKey || e.ctrlKey || REDUCED) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.protocol === "mailto:" || (url.pathname === location.pathname && url.hash)) return;
    e.preventDefault();
    curtain.classList.add("in");
    setTimeout(() => (location.href = a.href), 550);
  });
}

// ---------- 3) 스크롤 모션 ----------
function reveals() {
  const io = new IntersectionObserver(
    (es) => es.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = en.target.__wipe || en.target; // wipe는 잘린 상태라 부모를 대신 관찰
      el.classList.add("in");
      io.unobserve(en.target);
    }),
    { threshold: 0.1, rootMargin: "0px 0px -5% 0px" }
  );
  $$(".rv, .split").forEach((el) => io.observe(el));
  $$(".wipe").forEach((el) => {
    const proxy = document.createElement("span");
    proxy.style.cssText = "position:absolute;inset:0;pointer-events:none";
    proxy.__wipe = el;
    if (getComputedStyle(el.parentElement).position === "static") el.parentElement.style.position = "relative";
    el.parentElement.appendChild(proxy);
    io.observe(proxy);
  });
}
function parallax() {
  if (REDUCED) return;
  const items = $$("[data-speed]");
  const tick = () => {
    const vh = innerHeight;
    items.forEach((el) => {
      const r = el.parentElement.getBoundingClientRect();
      const p = (r.top + r.height / 2 - vh / 2) / vh; // 화면 중앙 기준 -1 ~ 1
      el.style.transform = `translateY(${p * el.dataset.speed * -100}px) scale(1.12)`;
    });
    requestAnimationFrame(tick);
  };
  tick();
}

// ---------- 4) 커서 ----------
function cursor() {
  const c = $(".cursor");
  if (!matchMedia("(hover: hover)").matches) return;
  let x = innerWidth / 2, y = innerHeight / 2, cx = x, cy = y;
  addEventListener("mousemove", (e) => { x = e.clientX; y = e.clientY; });
  (function loop() {
    cx += (x - cx) * 0.18; cy += (y - cy) * 0.18;
    c.style.left = cx + "px"; c.style.top = cy + "px";
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", (e) => {
    const t = e.target.closest("[data-cursor]");
    c.classList.toggle("big", !!t);
    c.textContent = t ? t.dataset.cursor : "";
  });
}

// ---------- 5) 페이지별 내용 ----------
const workCard = (p, i) => `
  <a class="work rv" href="project.html?p=${p.slug}" data-cursor="View">
    <div class="img wipe">${media(p.cover, p.title)}</div>
    <div class="cap"><div><h3>[ ${p.title} ]</h3><p>${p.program}</p></div><span>${p.year}</span></div>
  </a>`;

const render = {
  home() {
    $("#hero-title").innerHTML = split(SITE.name);
    $("#hero-tag").textContent = SITE.tagline;
    $("#intro").innerHTML = split(SITE.intro);
    $("#process").innerHTML = PROCESS.map(
      (s, i) => `<li class="rv"><span class="n">(${i + 1})</span><span class="t"><small>${s.k}</small>${s.t}</span><span class="d">${s.d}</span></li>`
    ).join("");
    $("#works").innerHTML = PROJECTS.slice(0, 3).map(workCard).join("");
    if (SITE.heroVideo) {
      $("#hero-media").outerHTML = `<video src="${SITE.heroVideo}" autoplay muted loop playsinline></video>`;
    } else heroArt($("#hero-media"));
    requestAnimationFrame(() => $(".hero .split").classList.add("in"));
  },
  projects() {
    $("#works").innerHTML = PROJECTS.map(workCard).join("");
    $("#count").textContent = `(${PROJECTS.length})`;
    $("#index").innerHTML = PROJECTS.map(
      (p, i) => `<a href="project.html?p=${p.slug}" data-cover="${p.cover}" data-title="${p.title}">
        <span class="m">${String(i + 1).padStart(2, "0")}</span><span class="t">${p.title}</span>
        <span class="m hide-s">${p.program}</span><span class="m hide-s">${p.studio}</span><span class="m">${p.year}</span></a>`
    ).join("");
    // 목록에 마우스를 올리면 따라다니는 미리보기
    const pv = $(".hover-preview");
    $$("#index a").forEach((a) => {
      a.addEventListener("mouseenter", () => { pv.innerHTML = media(a.dataset.cover, a.dataset.title); pv.classList.add("on"); });
      a.addEventListener("mouseleave", () => pv.classList.remove("on"));
    });
    addEventListener("mousemove", (e) => { pv.style.left = e.clientX + 170 + "px"; pv.style.top = e.clientY + "px"; });
  },
  project() {
    const slug = new URLSearchParams(location.search).get("p");
    const i = Math.max(0, PROJECTS.findIndex((p) => p.slug === slug));
    const p = PROJECTS[i];
    const next = PROJECTS[(i + 1) % PROJECTS.length];
    document.title = `${p.title} — ${SITE.name}`;
    $("#project").innerHTML = `
      <header class="p-head"><p class="label rv">${String(i + 1).padStart(2, "0")} / ${p.tags.join(" · ")}</p>
        <h1 class="split">${split(p.title)}</h1><p class="sub rv">${p.subtitle}</p></header>
      <div class="p-cover wipe"><div data-speed="0.6" style="height:100%">${media(p.cover, "Cover")}</div></div>
      <dl class="facts rv">${[["Year", p.year], ["Studio", p.studio], ["Program", p.program], ["Site", p.site], ["Area", p.area]]
        .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
      <section class="section" style="padding-bottom:0"><p class="label rv">Overview</p><p class="p-summary rv" style="margin-top:20px">${p.summary}</p></section>
      ${p.sections.map((s) => `
        <section class="p-sec"><div class="grid12">
          <div class="txt rv"><h2>${s.heading}</h2><p>${s.text}</p></div>
          <div class="imgs n${Math.min(s.images.length, 3)}">${s.images.map((src) => `<figure class="wipe">${media(src)}</figure>`).join("")}</div>
        </div></section>`).join("")}
      <a class="next" href="project.html?p=${next.slug}" data-cursor="Next"><span class="label">Next project</span><b>${next.title} →</b></a>`;
  },
  about() {
    $("#about-intro").innerHTML = split(SITE.intro);
    $("#cv").innerHTML = `
      <div class="rv"><h3>Education</h3><ul>${CV.education.map(([y, t]) => `<li><span>${y}</span>${t}</li>`).join("")}</ul></div>
      <div class="rv"><h3>Awards</h3><ul>${CV.awards.map(([y, t]) => `<li><span>${y}</span>${t}</li>`).join("")}</ul></div>
      <div class="rv"><h3>Skills</h3><ul class="chips">${CV.skills.map((s) => `<li>${s}</li>`).join("")}</ul></div>`;
  },
};

// ---------- 6) 히어로 모션아트 ----------
// 도시 매스를 선으로만 그린 축측투상(액소노메트릭). 높이가 천천히 호흡하고, 마우스에 따라 시점이 살짝 돌아가요.
function heroArt(canvas) {
  const ctx = canvas.getContext("2d");
  let W, H, dpr, mx = 0, my = 0, t = 0;
  const N = 9; // 9 x 9 블록
  const blocks = [];
  for (let i = 0; i < N; i++)
    for (let j = 0; j < N; j++) {
      const d = Math.hypot(i - N / 2, j - N / 2);
      blocks.push({ i, j, base: Math.max(0.15, 1.6 - d * 0.28) * (0.5 + Math.random()), ph: Math.random() * 6.28, empty: Math.random() < 0.18 });
    }
  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
  };
  resize(); addEventListener("resize", resize);
  addEventListener("mousemove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });

  const draw = () => {
    t += REDUCED ? 0 : 0.008;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const s = Math.min(W, H) / 13; // 블록 크기
    const ang = Math.PI / 4 + mx * 0.5 + Math.sin(t * 0.3) * 0.08;
    const tilt = 0.5 + my * 0.15;
    const ox = W * 0.62, oy = H * 0.42;
    const P = (x, y, z) => {
      const rx = x * Math.cos(ang) - y * Math.sin(ang);
      const ry = x * Math.sin(ang) + y * Math.cos(ang);
      return [ox + rx * s, oy + ry * s * tilt - z * s];
    };
    // 바닥 그리드
    ctx.strokeStyle = "rgba(21,21,19,0.08)"; ctx.lineWidth = 1;
    for (let k = -1; k <= N + 1; k++) {
      ctx.beginPath(); ctx.moveTo(...P(k - N / 2, -1 - N / 2, 0)); ctx.lineTo(...P(k - N / 2, N + 1 - N / 2, 0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(...P(-1 - N / 2, k - N / 2, 0)); ctx.lineTo(...P(N + 1 - N / 2, k - N / 2, 0)); ctx.stroke();
    }
    // 매스 (뒤에서 앞으로 정렬해서 그리기)
    const sorted = blocks.slice().sort((a, b) => P(a.i, a.j, 0)[1] - P(b.i, b.j, 0)[1]);
    sorted.forEach((b) => {
      if (b.empty) return;
      const h = b.base * (1 + 0.35 * Math.sin(t * 1.2 + b.ph)) * 2.2;
      const x = b.i - N / 2 + 0.12, y = b.j - N / 2 + 0.12, w = 0.76;
      const c = [[x, y], [x + w, y], [x + w, y + w], [x, y + w]];
      const top = c.map(([a, bb]) => P(a, bb, h));
      const bot = c.map(([a, bb]) => P(a, bb, 0));
      ctx.fillStyle = "rgba(250,250,248,0.94)";
      ctx.beginPath(); top.forEach((p, k) => (k ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath(); ctx.fill();
      for (let k = 0; k < 4; k++) {
        const k2 = (k + 1) % 4;
        ctx.beginPath(); ctx.moveTo(...bot[k]); ctx.lineTo(...bot[k2]); ctx.lineTo(...top[k2]); ctx.lineTo(...top[k]); ctx.closePath(); ctx.fill();
      }
      ctx.strokeStyle = `rgba(21,21,19,${0.3 + Math.min(h / 6, 0.45)})`;
      ctx.beginPath();
      top.forEach((p, k) => (k ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath();
      for (let k = 0; k < 4; k++) { ctx.moveTo(...bot[k]); ctx.lineTo(...top[k]); }
      ctx.stroke();
    });
    requestAnimationFrame(draw);
  };
  draw();
}

// ---------- 실행 ----------
chrome();
intro();
render[PAGE] && render[PAGE]();
transitions();
reveals();
parallax();
cursor();
