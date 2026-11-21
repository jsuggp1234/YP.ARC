// Claude가 핀 코멘트 상태/답글을 바꿀 때 쓰는 도우미.
//   node tools/feedback/reply.js <id> <open|working|done> [답글 텍스트 또는 @utf8파일경로]
// 한글이 깨지지 않도록 @파일 형태(UTF-8 텍스트 파일)를 권장해요.
const fs = require("fs");
const [id, status, text = ""] = process.argv.slice(2);
if (!id || !["open", "working", "done"].includes(status)) { console.error("usage: reply.js <id> <open|working|done> [text|@file]"); process.exit(1); }
const reply = text.startsWith("@") ? fs.readFileSync(text.slice(1), "utf8").trim() : text;
const body = { status, by: "claude" };
if (reply) body.reply = reply;
fetch(`http://127.0.0.1:${process.env.PORT || 8000}/api/pins/${id}`, {
  method: "POST", headers: { "Content-Type": "application/json; charset=utf-8" }, body: JSON.stringify(body),
}).then((r) => r.json()).then((p) => console.log(`#${p.id} → ${p.status}`), (e) => { console.error("server not reachable:", e.message); process.exit(1); });
