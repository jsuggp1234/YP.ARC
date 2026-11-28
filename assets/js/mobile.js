/* 모바일(≤760px) 전용 정리 — 2026-11-28 사용자 요청 (wangeunji.xyz 벤치마킹)
   참고 사이트처럼: 이름 하나 + 펼쳐 둔 짧은 메뉴, 넓은 여백, 작은 회색 글, 폭이 다른 이미지가 왼쪽 정렬로 쌓임.
   데스크톱은 건드리지 않아요. site.js가 화면을 다 그린 뒤 실행돼요.
   1) 상단바: 로고 + Works · Lab · Info · Contact (Menu 버튼·시각·다이얼·Light/Dark·아래 표시줄은 숨김)
   2) studio(works)·lab: 옆으로 잘리는 띠 대신 세로 목록 */
(() => {
  const D = document, HTML = D.documentElement, BODY = D.body;
  const mq = matchMedia("(max-width: 760px)");
  const $ = (s, r = D) => r.querySelector(s), $$ = (s, r = D) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pad = (n) => String(n).padStart(2, "0");
  const S = typeof SITE !== "undefined" ? SITE : {};
  const P = typeof PROJECTS !== "undefined" ? PROJECTS : [];
  const PAGE = BODY.dataset.page;
  const sync = () => HTML.classList.toggle("m-on", mq.matches);
  sync();
  mq.addEventListener ? mq.addEventListener("change", sync) : mq.addListener(sync);

  // ---------- 1) 상단바: 펼쳐 둔 메뉴 ----------
  const hdr = $("#hdr");
  if (hdr) {
    const cur = { works: "works", project: "works", projects: "works", lab: "lab", about: "info" }[PAGE] || "";
    const items = [["works", "Works", "works.html"], ["lab", "Lab", "lab.html"], ["info", "Info", "about.html"], ["contact", "Contact", "#contact"]];
    const nav = D.createElement("nav");
    nav.className = "m-nav"; nav.setAttribute("aria-label", "Main (mobile)");
    nav.innerHTML = items.map(([k, t, h]) => `<a href="${h}"${k === cur ? ' class="on" aria-current="page"' : ""}${k === "contact" ? " data-m-contact" : ""}>${t}</a>`).join("");
    hdr.appendChild(nav);
    nav.addEventListener("click", (e) => {
      const a = e.target.closest("[data-m-contact]"); if (!a) return;
      e.preventDefault(); const c = $(".hdr [data-contact]"); if (c) c.click(); // 원래 연락 패널을 열어요
    });
  }

  // ---------- 2) studio · lab: 세로 목록 ----------
  const M = S.manifesto || {};
  if (PAGE === "works") {
    const list = P.filter((p) => !p.draft);
    const media = $$(".cs-gd .cs-gc .media").map((m) => m.innerHTML);
    // 2026-11-28 사용자: 사진 크기는 모두 같게, 글은 제목·연도만, 글씨는 최대한 작게
    const sec = D.createElement("section");
    sec.className = "ml"; sec.setAttribute("aria-label", "Selected works");
    sec.innerHTML = `
      <header class="ml-hd">
        <p class="ml-note">${esc(M.en || "Selected works")}</p>
        <p class="ml-cat">Selected works<br><span class="num">(${pad(list.length)})</span></p>
      </header>
      <ol class="ml-l">${list.map((p, i) => `
        <li><a class="ml-it" href="project.html#${esc(p.slug)}">
          <div class="ml-m media">${media[i] || ""}</div>
          <div class="ml-cap"><span class="ml-t">${esc(p.title)}</span><span class="ml-y num">${esc(p.year || "")}</span></div>
        </a></li>`).join("")}
      </ol>
      <a class="ml-ix" href="projects.html">Index of works</a>`;
    $("#main").appendChild(sec);
  }
  if (PAGE === "lab") {
    const L = S.lab || {}, items = L.items || [];
    const sec = D.createElement("section");
    sec.className = "ml ml-lab"; sec.setAttribute("aria-label", "Lab");
    sec.innerHTML = `
      <header class="ml-hd">
        <p class="ml-note">${esc(L.note || "")}</p>
        <p class="ml-cat">Lab<br><span class="num">(${pad(items.length)})</span></p>
      </header>
      <ol class="ml-r">${items.map((it, i) => `
        <li><a class="ml-row${it.soon ? " soon" : ""}" ${it.href ? `href="${esc(it.href)}"` : 'aria-disabled="true"'}>
          <span class="ml-t">${esc(it.title)}</span>
          <span class="ml-y num">${it.soon ? "Soon" : esc(it.year || "")}</span>
        </a></li>`).join("")}
      </ol>`;
    $("#main").appendChild(sec);
  }
  if (PAGE === "works" || PAGE === "lab") {
    // 띠의 휠 처리(세로 스크롤 막기)는 모바일 목록에서 끄고, 첫 방문 로딩 인트로도 건너뛰어요
    addEventListener("wheel", (e) => { if (mq.matches) e.stopImmediatePropagation(); }, { capture: true, passive: true });
    if (mq.matches) { const hi = $(".hi"); if (hi) hi.remove(); HTML.classList.remove("hi-on"); }
  }
})();
