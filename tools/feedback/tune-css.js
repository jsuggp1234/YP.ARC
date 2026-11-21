// ============================================================
// tools/feedback/tune-css.js — "디자인 조정" 값(JSON) → CSS 글로 바꾸기
//   서버(node)와 피드백 페이지(브라우저)가 같은 규칙을 써요.
//   조정 하나 = { id, page, slug, media, sel, props:{css 속성: 값}, label }
//     page  : body의 data-page (home, about, project …)
//     slug  : 작품 상세에서 "이 작품에만"일 때 작품 주소 이름, 아니면 ""
//     media : "d" 데스크톱만(761px 이상) · "m" 모바일만(760px 이하) · "all" 둘 다
// ============================================================
(function (root) {
  // 바꿀 수 있는 속성만 받아요 (사진 상자·사진 안쪽·글자)
  const PROPS = [
    "width", "max-width", "height", "aspect-ratio", "margin-left", "margin-top", "margin-bottom", "border-radius", "overflow",
    "object-fit", "object-position", "scale", "transform-origin",
    "font-size", "font-weight", "font-style", "text-align", "text-align-last", "line-height", "letter-spacing", "text-transform", "color", "hyphens", "word-break",
  ];
  const okVal = (v) => typeof v === "string" && v.length <= 80 && /^[\w\s.%(),#\-/+*]+$/.test(v) && !/expression|url\s*\(|javascript/i.test(v);
  const okSel = (s) => typeof s === "string" && s.length > 0 && s.length <= 400 && /^[\w\s.#:()>+~\-=\["'\]*,]+$/.test(s) && !/[{}<;@]/.test(s);
  const okName = (s) => typeof s === "string" && /^[\w-]{0,80}$/.test(s);

  function clean(list) {
    return (Array.isArray(list) ? list : []).slice(0, 2000).map((r) => {
      if (!r || !okName(r.page) || !r.page || !okName(r.slug || "") || !okSel(r.sel)) return null;
      const props = {};
      Object.keys(r.props || {}).forEach((k) => { if (PROPS.includes(k) && okVal(r.props[k])) props[k] = r.props[k]; });
      if (!Object.keys(props).length) return null;
      return {
        id: okName(String(r.id || "")) && r.id ? String(r.id) : Math.random().toString(36).slice(2, 9),
        page: r.page, slug: r.slug || "", media: ["d", "m", "all"].includes(r.media) ? r.media : "all",
        sel: r.sel.trim(), props, label: typeof r.label === "string" ? r.label.slice(0, 120) : "",
      };
    }).filter(Boolean);
  }

  const scope = (r) => (r.slug ? `html[data-slug="${r.slug}"] ` : "") + `body[data-page="${r.page}"] `;
  function css(list) {
    const blocks = { all: [], d: [], m: [] };
    clean(list).forEach((r) => {
      const sel = r.sel.split(",").map((s) => scope(r) + s.trim()).join(",\n");
      const body = Object.entries(r.props).map(([k, v]) => `  ${k}: ${v} !important;`).join("\n");
      blocks[r.media].push(`/* ${String(r.label || r.id).replace(/\*\//g, "")} */\n${sel} {\n${body}\n}`);
    });
    const ind = (a) => a.join("\n").replace(/^/gm, "  ");
    return [
      "/* 이 파일은 피드백 페이지의 \"디자인 조정\"이 자동으로 만들어요. 직접 고치지 말고 tune.json이나 피드백 페이지에서 바꿔요. */",
      blocks.all.join("\n"),
      blocks.d.length ? `@media (min-width: 761px) {\n${ind(blocks.d)}\n}` : "",
      blocks.m.length ? `@media (max-width: 760px) {\n${ind(blocks.m)}\n}` : "",
    ].filter(Boolean).join("\n\n") + "\n";
  }

  const api = { PROPS, clean, css };
  if (typeof module === "object" && module.exports) module.exports = api; else root.TuneCSS = api;
})(this);
