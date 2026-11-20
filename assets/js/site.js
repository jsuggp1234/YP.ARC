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

// ---------- 6) 히어로: 작품 아이소 매스 ----------
// 작품마다 data.js의 mass(상자 목록)를 액소노메트릭으로 그려요.
// 주변엔 흐린 도시 매스가 숨 쉬듯 움직이고, 작품에 마우스를 올리면 강조 + 이름표, 클릭하면 작품 페이지로 가요.
function heroArt(canvas) {
  const ctx = canvas.getContext("2d");
  const cur = $(".cursor");
  let W, H, dpr, mx = 0, my = 0, t = 0, hover = -1, px = -1, py = -1;
  const G = 6; // 격자 반경 (-6 ~ 6)

  // 작품 상자들
  const works = PROJECTS.filter((p) => p.mass && p.pos).map((p) => ({
    p, lift: 0,
    boxes: p.mass.map(([x, y, w, d, h]) => ({ x: p.pos[0] + x, y: p.pos[1] + y, w, d, h })),
  }));
  // 작품 자리를 피해서 흐린 주변 매스 배치
  const taken = (i, j) => works.some((wk) => wk.boxes.some((b) => i + 1 > b.x - 0.5 && i < b.x + b.w + 0.5 && j + 1 > b.y - 0.5 && j < b.y + b.d + 0.5));
  const ctxBlocks = [];
  for (let i = -G; i < G; i++)
    for (let j = -G; j < G; j++)
      if (!taken(i, j) && Math.random() < 0.55)
        ctxBlocks.push({ x: i + 0.15, y: j + 0.15, w: 0.7, d: 0.7, base: 0.15 + Math.random() * 0.9 * Math.max(0.2, 1 - Math.hypot(i, j) / 8), ph: Math.random() * 6.28 });

  const resize = () => {
    dpr = Math.min(devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = W * dpr; canvas.height = H * dpr;
  };
  resize(); addEventListener("resize", resize);
  addEventListener("mousemove", (e) => { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; });
  canvas.addEventListener("mousemove", (e) => { const r = canvas.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top; });
  canvas.addEventListener("mouseleave", () => { px = py = -1; });
  canvas.addEventListener("click", (e) => {
    const r = canvas.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top;
    const k = pick();
    if (k < 0) return;
    $(".curtain").classList.add("in");
    setTimeout(() => (location.href = `project.html?p=${works[k].p.slug}`), REDUCED ? 0 : 550);
  });

  let P; // 3D → 화면 좌표 변환 (매 프레임 갱신)
  const corners = (b, h) => {
    const c = [[b.x, b.y], [b.x + b.w, b.y], [b.x + b.w, b.y + b.d], [b.x, b.y + b.d]];
    return { bot: c.map(([a, q]) => P(a, q, 0)), top: c.map(([a, q]) => P(a, q, h)) };
  };
  // 점들을 감싸는 볼록 다각형 (클릭 판정용)
  const hull = (pts) => {
    pts = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const p of pts) { while (lo.length > 1 && cr(lo[lo.length - 2], lo[lo.length - 1], p) <= 0) lo.pop(); lo.push(p); }
    for (const p of pts.reverse()) { while (up.length > 1 && cr(up[up.length - 2], up[up.length - 1], p) <= 0) up.pop(); up.push(p); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  };
  const inside = (poly, x, y) => {
    let c = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
      const [xi, yi] = poly[i], [xj, yj] = poly[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
    }
    return c;
  };
  const pick = () => {
    if (px < 0 || !P) return -1;
    let best = -1, depth = -Infinity;
    works.forEach((wk, k) => wk.boxes.forEach((b) => {
      const { bot, top } = corners(b, b.h * (1 + wk.lift * 0.12));
      if (inside(hull(bot.concat(top)), px, py) && bot[2][1] > depth) { depth = bot[2][1]; best = k; }
    }));
    return best;
  };

  // 면을 뒤에서 앞 순서로 하나씩 칠하고 테두리를 그려서, 가려진 선이 보이지 않게 해요.
  const drawBox = (b, h, fill, stroke, lw) => {
    const { bot, top } = corners(b, h);
    const face = (pts) => {
      ctx.beginPath(); pts.forEach((p, k) => (k ? ctx.lineTo(...p) : ctx.moveTo(...p))); ctx.closePath();
      ctx.fill(); ctx.stroke();
    };
    ctx.fillStyle = fill; ctx.strokeStyle = stroke; ctx.lineWidth = lw; ctx.lineJoin = "round";
    [0, 1, 2, 3]
      .map((k) => { const k2 = (k + 1) % 4; return { pts: [bot[k], bot[k2], top[k2], top[k]], y: (bot[k][1] + bot[k2][1]) / 2 }; })
      .sort((m, n) => m.y - n.y)
      .forEach((f) => face(f.pts));
    face(top);
    return top;
  };

  const draw = () => {
    t += REDUCED ? 0 : 0.008;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const wide = W > 820;
    const s = Math.min(W * (wide ? 0.62 : 0.95), H) / (G * 2.4);
    const ang = Math.PI / 4 + mx * 0.25 + Math.sin(t * 0.3) * 0.05;
    const tilt = 0.5 + my * 0.08;
    const ox = W * (wide ? 0.6 : 0.5), oy = H * (wide ? 0.44 : 0.4);
    P = (x, y, z) => {
      const rx = x * Math.cos(ang) - y * Math.sin(ang);
      const ry = x * Math.sin(ang) + y * Math.cos(ang);
      return [ox + rx * s, oy + ry * s * tilt - z * s];
    };

    // 바닥 그리드
    ctx.strokeStyle = "rgba(21,21,19,0.07)"; ctx.lineWidth = 1;
    for (let k = -G; k <= G; k++) {
      ctx.beginPath(); ctx.moveTo(...P(k, -G, 0)); ctx.lineTo(...P(k, G, 0)); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(...P(-G, k, 0)); ctx.lineTo(...P(G, k, 0)); ctx.stroke();
    }

    hover = pick();
    canvas.style.cursor = hover >= 0 ? "pointer" : "";
    if (cur) { cur.classList.toggle("big", hover >= 0); if (hover >= 0) cur.textContent = "View"; else if (cur.textContent === "View" && !document.querySelector("[data-cursor]:hover")) cur.textContent = ""; }
    works.forEach((wk, k) => (wk.lift += ((k === hover ? 1 : 0) - wk.lift) * 0.15));

    // 앞뒤 순서대로 그리기 (뒤에 있는 것부터)
    const items = [];
    ctxBlocks.forEach((b) => items.push({ b, kind: 0, h: b.base * (1 + 0.3 * Math.sin(t * 1.2 + b.ph)) }));
    works.forEach((wk, k) => wk.boxes.forEach((b) => items.push({ b, kind: 1, k, h: b.h * (1 + wk.lift * 0.12) })));
    const depth = (b) => P(b.x + b.w / 2, b.y + b.d / 2, 0)[1];
    items.sort((a, c) => depth(a.b) - depth(c.b));
    const tops = {};
    items.forEach((it) => {
      if (it.kind === 0) drawBox(it.b, it.h, "rgba(250,250,248,0.96)", "rgba(21,21,19,0.16)", 1);
      else {
        const on = it.k === hover;
        const top = drawBox(it.b, it.h, on ? "rgb(234,232,226)" : "rgb(250,250,248)", on ? "rgba(21,21,19,1)" : "rgba(21,21,19,0.78)", on ? 1.6 : 1.2);
        const y = Math.min(...top.map((p) => p[1]));
        if (!tops[it.k] || y < tops[it.k][1]) tops[it.k] = [top.reduce((a, p) => a + p[0], 0) / 4, y];
      }
    });

    // 작품 이름표: 평소엔 번호, 마우스 올리면 이름
    ctx.textAlign = "center"; ctx.textBaseline = "bottom";
    works.forEach((wk, k) => {
      const [x, y] = tops[k] || [0, 0];
      const on = k === hover;
      ctx.strokeStyle = "rgba(21,21,19,0.35)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x, y - 6); ctx.lineTo(x, y - 22 - wk.lift * 6); ctx.stroke();
      ctx.fillStyle = on ? "#151513" : "rgba(21,21,19,0.6)";
      ctx.font = `${on ? 500 : 400} 11px ${getComputedStyle(document.body).fontFamily}`;
      const no = String(PROJECTS.indexOf(wk.p) + 1).padStart(2, "0");
      ctx.fillText(on ? `[ ${wk.p.title} ]  ${wk.p.year}` : no, x, y - 26 - wk.lift * 6);
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
