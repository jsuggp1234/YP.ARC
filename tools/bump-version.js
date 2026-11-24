// 인터넷 사이트에 올리기 전에 실행: 모든 페이지의 CSS·JS 주소 끝에 ?v=<시각>을 붙여서
// 브라우저가 예전 파일(10분 캐시)을 쓰지 않고 새 파일을 바로 받게 해요.
//   node tools/bump-version.js
const fs = require("fs"), path = require("path");
const ROOT = path.join(__dirname, "..");
const v = new Date().toISOString().replace(/\D/g, "").slice(0, 12);
const files = fs.readdirSync(ROOT).filter((f) => f.endsWith(".html"));
let n = 0;
for (const f of files) {
  const p = path.join(ROOT, f);
  const s = fs.readFileSync(p, "utf8");
  const t = s.replace(/((?:href|src)="assets\/(?:css|js)\/[\w.-]+\.(?:css|js))(?:\?v=\w+)?"/g, (m, a) => { n++; return `${a}?v=${v}"`; });
  if (t !== s) fs.writeFileSync(p, t);
}
console.log(`v=${v} · ${files.length} pages · ${n} links`);
