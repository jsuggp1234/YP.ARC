// ============================================================
// tools/feedback/tune.js — 피드백 페이지의 "디자인 조정" 모드 (T)
//   일러스트레이터·인디자인처럼 사이트 위의 사진·다이어그램·글자를 클릭해서
//   크기·비율·마스크 안 사진 크기/위치·글자 크기·굵기·정렬·행간·자간·글줄 길이를 바로 바꿔요.
//   바꾼 값은 assets/css/tune.json → assets/css/tune.css 로 저장되고 실제 사이트에도 그대로 적용돼요.
// ============================================================
(() => {
  "use strict";
  const FB = window.FB, T = window.TuneCSS;
  if (!FB || !T) return;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const panel = $("#tp"), layer = FB.layer;
  let rules = [], on = false, hov = null, cur = null, stack = [], undo = [], saveT = 0, groupT = 0, grouping = false;
  const st = { scope: "one", only: true, both: false }; // 적용 범위
  try { Object.assign(st, JSON.parse(localStorage.getItem("fb-tune-scope") || "{}")); } catch (e) {}

  const W = () => FB.win(), DOC = () => { try { return W().document; } catch (e) { return null; } };
  const pageName = () => { const d = DOC(); return d && d.body ? d.body.dataset.page || "" : ""; };
  const slugName = () => { const d = DOC(); return d ? d.documentElement.dataset.slug || "" : ""; };
  const media = () => (st.both ? "all" : FB.getMode() === "mobile" ? "m" : "d");

  // ---------- 저장된 조정 불러오기 / 미리보기 / 저장 ----------
  fetch("/api/tune").then((r) => r.json()).then((j) => { rules = Array.isArray(j) ? j : []; apply(); list(); }).catch(() => {});
  function apply() {
    const d = DOC(); if (!d || !d.head) return;
    const link = d.getElementById("tune-css"); if (link) link.disabled = true; // 파일 대신 지금 값으로 바로 보여줘요
    let s = d.getElementById("fb-tune-live");
    if (!s) { s = d.createElement("style"); s.id = "fb-tune-live"; d.head.appendChild(s); }
    s.textContent = T.css(rules);
  }
  const status = (t) => { const e = $(".tp-save", panel); if (e) e.textContent = t; };
  function save() {
    clearTimeout(saveT); status("저장 중…");
    saveT = setTimeout(async () => {
      try {
        const r = await fetch("/api/tune", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rules }) });
        status(r.ok ? "저장됨 ✓ (사이트에도 적용)" : "저장 실패");
      } catch (e) { status("저장 실패 — 서버 확인"); }
    }, 450);
  }
  // 되돌리기(Ctrl+Z): 손을 뗀 단위로 한 번씩
  const snap = () => { if (grouping) return; undo.push(JSON.stringify(rules)); if (undo.length > 80) undo.shift(); grouping = true; clearTimeout(groupT); groupT = setTimeout(() => (grouping = false), 500); };
  function doUndo() { if (!undo.length) return FB.toast("더 되돌릴 게 없어요"); rules = JSON.parse(undo.pop()); grouping = false; apply(); save(); draw(); list(); }

  // ---------- 고를 대상 찾기 ----------
  const DYN = /^(on|in|hov|lr|hl|rv|past|pre|js-pin|mn-cur|cur|active|open|show|seen|done|drop-hl|is-[\w-]+|lr-[\w-]+)$/;
  const cls = (el) => [...el.classList].filter((c) => !DYN.test(c) && /^[A-Za-z_][\w-]*$/.test(c));
  function pathSel(el) {
    const parts = [];
    while (el && el.nodeType === 1 && el.tagName !== "BODY" && el.tagName !== "HTML") {
      if (el.id && /^[A-Za-z][\w-]*$/.test(el.id)) { parts.unshift("#" + el.id); break; }
      let s = el.tagName.toLowerCase();
      const c = cls(el).slice(0, 2); if (c.length) s += "." + c.join(".");
      const sib = el.parentElement ? [...el.parentElement.children].filter((x) => x.tagName === el.tagName) : [];
      if (sib.length > 1) s += `:nth-of-type(${sib.indexOf(el) + 1})`;
      parts.unshift(s);
      el = el.parentElement;
    }
    return parts.join(" > ");
  }
  function kindSel(el) { // "같은 종류 전부": 클래스 이름으로
    const c = cls(el), tag = el.tagName.toLowerCase();
    if (c.length) return (c.length > 1 ? tag + "." + c.slice(0, 2).join(".") : "." + c[0]);
    const p = el.parentElement, pc = p ? cls(p) : [];
    return pc.length ? `.${pc[0]} > ${tag}` : pathSel(el);
  }
  const selOf = (el) => (st.scope === "kind" ? kindSel(el) : pathSel(el));
  const isMedia = (el) => el && /^(IMG|VIDEO|CANVAS|svg)$/.test(el.tagName);
  function outerSvg(el) { let s = el.closest("svg"); while (s && s.parentElement && s.parentElement.closest("svg")) s = s.parentElement.closest("svg"); return s; }
  function pick(t) {
    if (!t || t.nodeType !== 1) return null;
    const svg = t.closest("svg") ? outerSvg(t) : null;
    const m = svg || (isMedia(t) ? t : null) || (t.matches(".media, .mz, .mp") ? t.querySelector("img, video, canvas, svg") : null);
    if (m) {
      // 사진을 감싼 껍데기(.mz, .mp처럼 자식이 하나뿐인 상자)를 지나 실제 "액자"까지 올라가요
      let box = m.parentElement;
      while (box.parentElement && box.parentElement.children.length === 1 && !/^(BODY|MAIN|SECTION|ARTICLE|A)$/.test(box.parentElement.tagName)) box = box.parentElement;
      if (/^(A)$/.test(box.tagName) || box === m) box = m.parentElement;
      return { box, inner: m, kind: "media" };
    }
    const w = W(); let el = t;
    while (el && el.parentElement && el.tagName !== "BODY" && /^inline/.test(w.getComputedStyle(el).display)) el = el.parentElement;
    return { box: el, inner: null, kind: (el.innerText || "").trim() ? "text" : "box" };
  }
  const kindName = (c) => c.kind === "media" ? (c.inner.tagName === "svg" ? "다이어그램(벡터)" : c.inner.tagName === "CANVAS" ? "시뮬레이션" : c.inner.tagName === "VIDEO" ? "영상" : "사진") : c.kind === "text" ? "글자" : "상자";

  // ---------- 규칙 읽고 쓰기 ----------
  const keyOf = (el) => ({ page: pageName(), slug: st.only ? slugName() : "", media: media(), sel: selOf(el) });
  const same = (a, b) => a.page === b.page && a.slug === b.slug && a.media === b.media && a.sel === b.sel;
  const ruleOf = (el, make) => {
    const k = keyOf(el); let r = rules.find((x) => same(x, k));
    if (!r && make) { r = { id: Math.random().toString(36).slice(2, 9), ...k, props: {}, label: `${pageName()}${k.slug ? "#" + k.slug : ""} · ${labelOf(el)}` }; rules.push(r); }
    return r;
  };
  const labelOf = (el) => { const t = (el.innerText || el.getAttribute("alt") || "").trim().replace(/\s+/g, " ").slice(0, 28); return (cls(el)[0] || el.tagName.toLowerCase()) + (t ? ` “${t}”` : ""); };
  function setProp(el, k, v) {
    snap();
    const r = ruleOf(el, v !== "");
    if (r) { if (v === "") delete r.props[k]; else r.props[k] = v; if (!Object.keys(r.props).length) rules = rules.filter((x) => x !== r); }
    if (!T.clean([{ ...keyOf(el), id: "x", props: { [k]: v || "0" } }]).length && v !== "") { FB.toast("이 요소는 저장할 수 없는 이름이에요 — 바깥 상자를 골라 보세요"); }
    apply(); save(); list();
  }
  const getProp = (el, k) => { const r = ruleOf(el, false); return r ? r.props[k] : undefined; };

  // ---------- 화면 위 표시 (마우스 올린 것, 고른 것) ----------
  const hovBox = document.createElement("div"); hovBox.className = "t-hov";
  const selBox = document.createElement("div"); selBox.className = "t-sel"; selBox.innerHTML = "<b></b>";
  const innBox = document.createElement("div"); innBox.className = "t-inn";
  const place = (el, b) => {
    if (!on || !el || !el.isConnected) { b.style.display = "none"; return; }
    const r = el.getBoundingClientRect(); b.style.display = "block";
    b.style.transform = `translate(${r.left}px, ${r.top}px)`; b.style.width = r.width + "px"; b.style.height = r.height + "px";
    return r;
  };
  (function loop() {
    if (on) {
      if (!layer.contains(hovBox)) layer.append(hovBox, innBox, selBox);
      place(hov && (!cur || hov.box !== cur.box) ? hov.box : null, hovBox);
      const r = place(cur && cur.box, selBox);
      place(cur && cur.inner, innBox);
      if (r) selBox.firstChild.textContent = `${kindName(cur)} · ${Math.round(r.width)}×${Math.round(r.height)}`;
    }
    requestAnimationFrame(loop);
  })();

  // ---------- 사이트(iframe) 안에서 마우스 ----------
  function bind() {
    const d = DOC(); if (!d || d.__tuneBound) { apply(); return; }
    d.__tuneBound = true;
    d.addEventListener("pointermove", (e) => { if (on) hov = pick(e.target); }, true);
    d.addEventListener("pointerleave", () => (hov = null));
    // 조정 모드에서는 링크·버튼이 눌리지 않고 "고르기"만 돼요
    const block = (e) => { if (!on) return; e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation(); };
    ["pointerdown", "mousedown", "pointerup", "mouseup", "dblclick", "auxclick"].forEach((t) => d.addEventListener(t, block, true));
    d.addEventListener("click", (e) => { if (!on) return; block(e); const c = pick(e.target); if (c) select(c); }, true);
    d.addEventListener("keydown", onKey, true);
    apply();
  }
  FB.onLoad.push(() => { cur = null; hov = null; stack = []; bind(); draw(); list(); });

  function select(c) { cur = c; stack = []; draw(); }
  function goOut() { if (!cur || !cur.box.parentElement || cur.box.parentElement.tagName === "BODY") return; stack.push(cur); const p = cur.box.parentElement; cur = { box: p, inner: cur.inner, kind: cur.inner ? "media" : (p.innerText || "").trim() ? "text" : "box" }; draw(); }
  function goIn() { if (stack.length) { cur = stack.pop(); draw(); } }

  // ---------- 켜고 끄기 ----------
  function setOn(v) {
    on = v;
    document.getElementById("main").classList.toggle("tuning", on);
    $("#tunebtn").classList.toggle("on", on);
    if (on) { FB.setPinning(false); bind(); } else { hov = null; [hovBox, selBox, innBox].forEach((b) => (b.style.display = "none")); }
    draw(); list();
  }
  FB.onPin.push(() => { if (on) setOn(false); });
  $("#tunebtn").addEventListener("click", () => setOn(!on));
  function onKey(e) {
    const t = e.target;
    if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT")) return;
    if ((e.key === "t" || e.key === "T") && !e.metaKey && !e.ctrlKey && !e.altKey) { e.preventDefault(); setOn(!on); return; }
    if (!on) return;
    if ((e.ctrlKey || e.metaKey) && (e.key === "z" || e.key === "Z")) { e.preventDefault(); doUndo(); }
    if (e.key === "Escape") { cur = null; draw(); }
  }
  addEventListener("keydown", onKey);

  // ---------- 조정판 그리기 ----------
  const num = (v, d = 0) => { const n = parseFloat(v); return Number.isFinite(n) ? n : d; };
  const cs = (el) => W().getComputedStyle(el);
  function slider(label, el, k, o) {
    // o: { min, max, step, unit, read(): 지금 값(숫자), write(n): css 값, hint }
    const has = getProp(el, k) !== undefined, v = o.read();
    return `<div class="tr${has ? " set" : ""}" data-k="${k}"><label>${label}</label><input type="range" min="${o.min}" max="${o.max}" step="${o.step}" value="${v}"><input type="number" min="${o.min}" max="${o.max}" step="${o.step}" value="${+(+v).toFixed(3)}"><span class="u">${o.unit || ""}</span><button class="x" title="원래대로" type="button">×</button>${o.hint ? `<small>${o.hint}</small>` : ""}</div>`;
  }
  function seg(label, el, k, opts, curV) {
    const has = getProp(el, k) !== undefined;
    return `<div class="tr seg2${has ? " set" : ""}" data-k="${k}"><label>${label}</label><div class="sg">${opts.map(([v, t]) => `<button type="button" data-v="${esc(v)}" class="${String(curV) === String(v) ? "on" : ""}">${t}</button>`).join("")}</div><button class="x" title="원래대로" type="button">×</button></div>`;
  }
  const H = {}; // 속성마다 숫자 → css 값 바꾸는 함수
  function draw() {
    if (!on) { panel.hidden = true; return; }
    panel.hidden = false;
    const scopeHtml = `
      <div class="tp-scope">
        <div class="sg" data-st="scope"><button type="button" data-v="one" class="${st.scope === "one" ? "on" : ""}">이 요소만</button><button type="button" data-v="kind" class="${st.scope === "kind" ? "on" : ""}">같은 종류 전부</button></div>
        <label><input type="checkbox" data-st="both" ${st.both ? "checked" : ""}> 데스크톱·모바일 둘 다</label>
        ${pageName() === "project" ? `<label><input type="checkbox" data-st="only" ${st.only ? "checked" : ""}> 이 작품에만</label>` : ""}
      </div>`;
    if (!cur || !cur.box.isConnected) {
      cur = null;
      panel.innerHTML = `<div class="tp-hd"><b>디자인 조정</b><span class="tp-save"></span></div>${scopeHtml}
        <p class="tp-help">사이트 위에서 사진·다이어그램·글자를 클릭하세요. 링크는 눌리지 않고 골라지기만 해요.<br>
        <kbd>T</kbd> 켜기/끄기 · <kbd>Esc</kbd> 선택 해제 · <kbd>Ctrl</kbd>+<kbd>Z</kbd> 되돌리기<br>
        지금 화면(${FB.getMode() === "mobile" ? "모바일" : "데스크톱"})에만 적용돼요. 둘 다 바꾸려면 위 체크를 켜세요.</p>
        <div class="tp-list"></div>`;
      list(); return;
    }
    const b = cur.box, inn = cur.inner, w = W();
    const pr = b.parentElement ? b.parentElement.getBoundingClientRect() : { width: w.innerWidth };
    const br = b.getBoundingClientRect(), bc = cs(b);
    let h = `<div class="tp-hd"><b>${kindName(cur)}</b><span class="tp-save"></span></div>${scopeHtml}
      <div class="tp-nav"><button type="button" data-a="out">↑ 바깥 상자</button><button type="button" data-a="in" ${stack.length ? "" : "disabled"}>↓ 안쪽</button><button type="button" data-a="reset">이 요소 모두 원래대로</button></div>
      <p class="tp-what">${esc(labelOf(b))}</p>`;
    // 상자: 크기·형태
    H.width = (n) => n + "%"; H["aspect-ratio"] = (n) => String(n); H.height = (n) => (n ? n + "svh" : "");
    H["border-radius"] = (n) => n + "px"; H["margin-left"] = (n) => n + "%"; H["margin-top"] = (n) => n + "px";
    h += `<h4>상자 — 크기·형태</h4>`;
    h += slider("폭", b, "width", { min: 5, max: 100, step: 0.5, unit: "%", read: () => (getProp(b, "width") ? num(getProp(b, "width")) : Math.round((br.width / Math.max(1, pr.width)) * 1000) / 10), hint: "바깥 상자 폭에 대한 비율" });
    const ar = getProp(b, "aspect-ratio") ? num(getProp(b, "aspect-ratio")) : Math.round((br.width / Math.max(1, br.height)) * 1000) / 1000;
    h += slider("비율", b, "aspect-ratio", { min: 0.3, max: 3.5, step: 0.005, unit: "가로/세로", read: () => ar });
    const nat = inn && inn.naturalWidth ? inn.naturalWidth / inn.naturalHeight : 0;
    h += `<div class="tr chips" data-k="aspect-ratio"><label></label><div class="sg">${[["1", "1:1"], ["0.8", "4:5"], ["0.75", "3:4"], ["0.6667", "2:3"], ["1.5", "3:2"], ["1.3333", "4:3"], ["1.7778", "16:9"], ["2.3333", "21:9"]].concat(nat ? [[String(Math.round(nat * 10000) / 10000), "원본"]] : []).map(([v, t]) => `<button type="button" data-v="${v}">${t}</button>`).join("")}</div></div>`;
    h += slider("높이", b, "height", { min: 0, max: 100, step: 1, unit: "% 화면", read: () => num(getProp(b, "height"), 0), hint: "0 = 자동(비율을 따름)" });
    h += slider("모서리", b, "border-radius", { min: 0, max: 80, step: 1, unit: "px", read: () => num(bc.borderTopLeftRadius) });
    h += slider("왼쪽 이동", b, "margin-left", { min: -50, max: 80, step: 0.5, unit: "%", read: () => num(getProp(b, "margin-left"), 0) });
    h += slider("위 간격", b, "margin-top", { min: -300, max: 600, step: 2, unit: "px", read: () => num(getProp(b, "margin-top"), num(bc.marginTop)) });
    // 안쪽 사진(마스크)
    if (inn) {
      const ic = cs(inn), svgLike = inn.tagName === "svg" || inn.tagName === "CANVAS";
      H.scale = (n) => String(n / 100); H["object-position"] = null;
      h += `<h4>${svgLike ? "안쪽 그림" : "마스크 안 사진"}</h4>`;
      if (!svgLike) h += seg("채우기", inn, "object-fit", [["cover", "꽉 채우기"], ["contain", "전체 보이기"], ["none", "원래 크기"]], getProp(inn, "object-fit") || ic.objectFit);
      h += slider("확대", inn, "scale", { min: 30, max: 300, step: 1, unit: "%", read: () => Math.round(num(getProp(inn, "scale"), 1) * 100) });
      const posK = svgLike ? "transform-origin" : "object-position";
      const pos = (getProp(inn, posK) || (svgLike ? "50% 50%" : ic.objectPosition)).split(/\s+/).map((x) => num(x, 50));
      h += `<div class="tr${getProp(inn, posK) ? " set" : ""}" data-k="${posK}" data-xy="x"><label>가로 위치</label><input type="range" min="0" max="100" step="0.5" value="${pos[0]}"><input type="number" min="0" max="100" step="0.5" value="${pos[0]}"><span class="u">%</span><button class="x" type="button" title="원래대로">×</button></div>`;
      h += `<div class="tr${getProp(inn, posK) ? " set" : ""}" data-k="${posK}" data-xy="y"><label>세로 위치</label><input type="range" min="0" max="100" step="0.5" value="${pos[1] ?? 50}"><input type="number" min="0" max="100" step="0.5" value="${pos[1] ?? 50}"><span class="u">%</span><button class="x" type="button" title="원래대로">×</button></div>`;
      h += `<p class="tp-note">${svgLike ? "확대의 기준점이 가로·세로 위치예요." : "마스크(상자) 크기는 그대로, 안의 사진만 움직이고 커져요."}</p>`;
    }
    // 글자
    const tEl = cur.kind === "media" ? null : b;
    if (tEl && (tEl.innerText || "").trim()) {
      const tc = cs(tEl);
      H["font-size"] = (n) => n + "px"; H["line-height"] = (n) => String(n); H["letter-spacing"] = (n) => n + "em"; H["max-width"] = (n) => (n ? n + "em" : "none");
      const fs = num(tc.fontSize, 12);
      h += `<h4>글자</h4>`;
      h += `<div class="tr chips${getProp(tEl, "font-size") ? " set" : ""}" data-k="font-size"><label>크기 단계</label><div class="sg">${["xs", "s", "m", "l", "xl", "xxl"].map((k) => `<button type="button" data-v="var(--t-${k})" class="${getProp(tEl, "font-size") === `var(--t-${k})` ? "on" : ""}">${k}</button>`).join("")}</div></div>`;
      h += slider("크기", tEl, "font-size", { min: 7, max: 140, step: 0.5, unit: "px", read: () => fs, hint: "위 단계(사이트 글자 크기 표)를 쓰면 다른 글자와 맞아요" });
      h += seg("굵기", tEl, "font-weight", [["300", "라이트"], ["400", "보통"], ["500", "미디엄"], ["600", "세미볼드"], ["700", "볼드"]], getProp(tEl, "font-weight") || tc.fontWeight);
      h += seg("기울임", tEl, "font-style", [["normal", "보통"], ["italic", "이탤릭"]], getProp(tEl, "font-style") || tc.fontStyle);
      h += seg("정렬", tEl, "text-align", [["left", "왼쪽"], ["center", "가운데"], ["right", "오른쪽"], ["justify", "양쪽"]], getProp(tEl, "text-align") || (tc.textAlign === "start" ? "left" : tc.textAlign));
      h += slider("행간", tEl, "line-height", { min: 0.7, max: 2.6, step: 0.01, unit: "배", read: () => Math.round((tc.lineHeight === "normal" ? 1.2 : num(tc.lineHeight) / fs) * 100) / 100 });
      h += slider("자간", tEl, "letter-spacing", { min: -0.12, max: 0.4, step: 0.002, unit: "em", read: () => Math.round((tc.letterSpacing === "normal" ? 0 : num(tc.letterSpacing) / fs) * 1000) / 1000 });
      h += slider("글줄 길이", tEl, "max-width", { min: 0, max: 120, step: 0.5, unit: "em", read: () => (getProp(tEl, "max-width") ? num(getProp(tEl, "max-width")) : tc.maxWidth === "none" ? 0 : Math.round((num(tc.maxWidth) / fs) * 10) / 10), hint: "한 줄에 들어가는 길이 · 0 = 제한 없음" });
      h += seg("대소문자", tEl, "text-transform", [["none", "그대로"], ["uppercase", "대문자"], ["lowercase", "소문자"]], getProp(tEl, "text-transform") || tc.textTransform);
      h += seg("색", tEl, "color", [["var(--ink)", "진하게"], ["var(--mid)", "중간"], ["var(--soft)", "흐리게"]], getProp(tEl, "color") || "");
    }
    h += `<div class="tp-list"></div>`;
    panel.innerHTML = h;
    list();
  }

  // 조정판 입력 → 규칙
  const targetOf = (row) => {
    const k = row.dataset.k;
    if (["scale", "object-fit", "object-position", "transform-origin"].includes(k)) return cur.inner;
    return cur.box;
  };
  function commit(row, n) {
    const el = targetOf(row), k = row.dataset.k;
    if (row.dataset.xy) {
      const other = [...panel.querySelectorAll(`[data-k="${k}"][data-xy]`)].map((r) => r.querySelector("input[type=number]").value);
      return setProp(el, k, `${other[0]}% ${other[1]}%`);
    }
    let v = H[k] ? H[k](n) : String(n);
    if (k === "aspect-ratio") { setProp(cur.box, "height", getProp(cur.box, "height") || "auto"); }
    if (k === "height" && v && getProp(cur.box, "aspect-ratio")) setProp(cur.box, "aspect-ratio", "");
    if (k === "scale" && n > 100) setProp(cur.box, "overflow", "hidden");
    setProp(el, k, v);
    row.classList.add("set");
  }
  panel.addEventListener("input", (e) => {
    const row = e.target.closest(".tr"); if (!row || !cur) return;
    const n = parseFloat(e.target.value); if (!Number.isFinite(n)) return;
    row.querySelectorAll("input").forEach((i) => i !== e.target && (i.value = n));
    commit(row, n);
  });
  panel.addEventListener("change", (e) => {
    const s = e.target.dataset.st; if (!s) return;
    st[s] = e.target.checked; try { localStorage.setItem("fb-tune-scope", JSON.stringify(st)); } catch (er) {}
    draw();
  });
  panel.addEventListener("click", (e) => {
    const bt = e.target.closest("button"); if (!bt) return;
    const sg = bt.closest("[data-st]");
    if (sg) { st[sg.dataset.st] = bt.dataset.v; try { localStorage.setItem("fb-tune-scope", JSON.stringify(st)); } catch (er) {} return draw(); }
    const a = bt.dataset.a;
    if (a === "out") return goOut();
    if (a === "in") return goIn();
    if (a === "reset") { snap(); [cur.box, cur.inner].filter(Boolean).forEach((el) => { const k = keyOf(el); rules = rules.filter((x) => !same(x, k)); }); apply(); save(); return draw(); }
    if (a === "del") { snap(); rules = rules.filter((x) => x.id !== bt.dataset.id); apply(); save(); return draw(); }
    if (a === "pick") { const r = rules.find((x) => x.id === bt.dataset.id); const d = DOC(); const el = r && d && d.querySelector(r.sel.split(",")[0]); if (!el) return FB.toast("지금 화면에서 그 요소를 찾지 못했어요"); el.scrollIntoView({ block: "center" }); return select(pick(el) || { box: el, inner: null, kind: "box" }); }
    const row = bt.closest(".tr"); if (!row || !cur) return;
    if (bt.classList.contains("x")) { const el = targetOf(row); setProp(el, row.dataset.k, ""); if (row.dataset.k === "aspect-ratio") setProp(cur.box, "height", ""); return draw(); }
    if (bt.dataset.v !== undefined) {
      const el = targetOf(row);
      if (row.dataset.k === "aspect-ratio") { setProp(cur.box, "height", "auto"); }
      setProp(el, row.dataset.k, bt.dataset.v);
      return draw();
    }
  });

  // 이 페이지에 저장된 조정 목록
  function list() {
    const box = $(".tp-list", panel); if (!box) return;
    const pg = pageName(), mine = rules.filter((r) => r.page === pg && (!r.slug || r.slug === slugName()));
    box.innerHTML = `<h4>이 페이지에 저장된 조정 <span>(${mine.length})</span></h4>` + (mine.length ? mine.map((r) => `
      <div class="tl"><div><b>${esc(r.label || r.sel)}</b><small>${r.media === "all" ? "데스크톱·모바일" : r.media === "m" ? "모바일" : "데스크톱"}${r.slug ? " · 이 작품만" : ""} · ${esc(Object.entries(r.props).map(([k, v]) => `${k}: ${v}`).join(", "))}</small></div>
      <span><button type="button" data-a="pick" data-id="${r.id}">고르기</button><button type="button" data-a="del" data-id="${r.id}">삭제</button></span></div>`).join("") : `<p class="tp-help">아직 없어요.</p>`);
  }
})();
