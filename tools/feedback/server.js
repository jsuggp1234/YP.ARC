// ============================================================
// tools/feedback/server.js — 로컬 미리보기 + 핀 코멘트 서버
//   실행:  node tools/feedback/server.js      (Python 없이 Node만 있으면 돼요)
//   사이트:   http://localhost:8000/
//   피드백:   http://localhost:8000/feedback
//
// 하는 일
//   1) 사이트 파일을 그대로 보여줘요 (python -m http.server 대신).
//   2) 피드백 페이지에서 남긴 핀 코멘트를 .feedback/pins.json 에 저장하고,
//      .feedback/events.log 에 한 줄씩 기록해요 → Claude Code가 이 줄을 실시간으로 읽어요.
//   3) assets/ 나 *.html 이 바뀌면 피드백 페이지에 "새로고침" 신호를 보내요.
// 이 컴퓨터(127.0.0.1)에서만 열려요. 외부로 공개되지 않아요.
// ============================================================
const http = require("http"), fs = require("fs"), path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const PORT = +process.env.PORT || 8000;
const DIR = path.join(ROOT, ".feedback"), DB = path.join(DIR, "pins.json"), LOG = path.join(DIR, "events.log");
const UP = path.join(DIR, "uploads"); // 끌어다 놓은 이미지가 임시로 쌓이는 곳 (Claude가 assets/img로 옮겨요)
fs.mkdirSync(UP, { recursive: true });
const IMG_EXT = { "image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif", "image/avif": ".avif", "video/mp4": ".mp4", "video/webm": ".webm", "video/quicktime": ".mov" };
const MAX_UPLOAD = 80 * 1024 * 1024; // 영상(mp4·webm·mov)까지 받아요
// 핀에 붙일 수 있는 건 우리가 저장한 업로드 파일뿐이에요
const imgList = (v) => (Array.isArray(v) ? v : [])
  .filter((s) => typeof s === "string" && /^\.feedback\/uploads\/[\w.-]+$/.test(s) && fs.existsSync(path.join(ROOT, s)))
  .slice(0, 20);
if (!fs.existsSync(LOG)) fs.writeFileSync(LOG, "");

// 디자인 조정: assets/css/tune.json(원본 값) → assets/css/tune.css(사이트가 읽는 CSS)
const Tune = require("./tune-css.js");
const TUNE_JSON = path.join(ROOT, "assets/css/tune.json"), TUNE_CSS = path.join(ROOT, "assets/css/tune.css");
let tune = [];
try { tune = Tune.clean(JSON.parse(fs.readFileSync(TUNE_JSON, "utf8"))); } catch (e) {}
const saveTune = () => { fs.writeFileSync(TUNE_JSON, JSON.stringify(tune, null, 2) + "\n"); fs.writeFileSync(TUNE_CSS, Tune.css(tune)); };
if (!fs.existsSync(TUNE_CSS)) saveTune();

let pins = [];
try { pins = JSON.parse(fs.readFileSync(DB, "utf8")); } catch (e) {}
const save = () => fs.writeFileSync(DB, JSON.stringify(pins, null, 2));
const log = (o) => fs.appendFileSync(LOG, JSON.stringify(o) + "\n");

// 실시간 연결 (Server-Sent Events)
const clients = new Set();
const send = (type, data) => {
  const m = `event: ${type}\ndata: ${JSON.stringify(data)}\n\n`;
  clients.forEach((r) => r.write(m));
};
setInterval(() => clients.forEach((r) => r.write(": ping\n\n")), 25000);

const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json", ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp",
  ".svg": "image/svg+xml", ".gif": "image/gif", ".mp4": "video/mp4", ".webm": "video/webm", ".mov": "video/quicktime", ".woff2": "font/woff2", ".ico": "image/x-icon",
};
const str = (v, n) => (typeof v === "string" ? v.slice(0, n) : "");
const num = (v) => (Number.isFinite(+v) ? Math.round(+v) : 0);
const body = (req) => new Promise((ok, bad) => {
  let s = "";
  req.on("data", (c) => { s += c; if (s.length > 1e6) req.destroy(); });
  req.on("end", () => { try { ok(JSON.parse(s || "{}")); } catch (e) { bad(e); } });
});

http.createServer(async (req, res) => {
  const u = new URL(req.url, "http://localhost");
  const p = decodeURIComponent(u.pathname);
  const json = (code, o) => { res.writeHead(code, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" }); res.end(JSON.stringify(o)); };

  // ---- API ----
  if (p === "/api/events") {
    res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" });
    res.write(`event: pins\ndata: ${JSON.stringify(pins)}\n\n`);
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }
  if (p === "/api/pins" && req.method === "GET") return json(200, pins);
  if (p === "/api/tune" && req.method === "GET") return json(200, tune);
  if (p === "/api/tune" && req.method === "POST") {
    try {
      const b = await body(req);
      tune = Tune.clean(b.rules); saveTune();
      log({ event: "tune", count: tune.length, at: new Date().toISOString() });
      return json(200, { ok: true, count: tune.length });
    } catch (e) { return json(400, { error: "bad json" }); }
  }

  // 이미지 업로드: 파일 내용을 그대로 받아 .feedback/uploads/ 에 저장
  if (p === "/api/upload" && req.method === "POST") {
    const ext = IMG_EXT[(req.headers["content-type"] || "").split(";")[0].trim().toLowerCase()];
    if (!ext) return json(415, { error: "이미지(jpg, png, webp, gif, avif)나 영상(mp4, webm, mov)만 올릴 수 있어요." });
    const chunks = []; let size = 0, tooBig = false;
    req.on("data", (c) => { size += c.length; if (size > MAX_UPLOAD) { tooBig = true; chunks.length = 0; } else if (!tooBig) chunks.push(c); });
    req.on("end", () => {
      if (tooBig) return json(413, { error: "25MB보다 큰 파일은 올릴 수 없어요." });
      const base = (u.searchParams.get("name") || "image").replace(/\.[^.]+$/, "").normalize("NFC")
        .replace(/[^\w-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 40) || "image";
      const name = `${Date.now().toString(36)}-${base}${ext}`;
      fs.writeFile(path.join(UP, name), Buffer.concat(chunks), (err) => {
        if (err) return json(500, { error: "save failed" });
        json(201, { path: `.feedback/uploads/${name}`, url: `/api/uploads/${name}`, bytes: size });
      });
    });
    return;
  }
  const up = p.match(/^\/api\/uploads\/([\w.-]+)$/);
  if (up && req.method === "GET") {
    const file = path.join(UP, up[1]);
    return fs.readFile(file, (err, data) => {
      if (err) { res.writeHead(404); return res.end(); }
      res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
      res.end(data);
    });
  }
  if (p === "/api/pins" && req.method === "POST") {
    try {
      const b = await body(req);
      const images = imgList(b.images);
      if (!str(b.comment, 4000).trim() && !images.length) return json(400, { error: "empty comment" });
      const pin = {
        id: String(pins.reduce((m, x) => Math.max(m, +x.id || 0), 0) + 1),
        status: "open", reply: "", created: new Date().toISOString(),
        page: str(b.page, 300), mode: b.mode === "mobile" ? "mobile" : "desktop",
        x: num(b.x), y: num(b.y), vw: num(b.vw), vh: num(b.vh), sy: num(b.sy),
        sel: str(b.sel, 400), txt: str(b.txt, 200),
        comment: str(b.comment, 4000).trim() || "이 자리에 이미지 넣어줘", images,
      };
      pins.push(pin); save(); log({ event: "new", ...pin }); send("pins", pins);
      return json(201, pin);
    } catch (e) { return json(400, { error: "bad json" }); }
  }
  const m = p.match(/^\/api\/pins\/(\d+)$/);
  if (m && req.method === "POST") {
    const pin = pins.find((x) => x.id === m[1]);
    if (!pin) return json(404, { error: "not found" });
    const b = await body(req).catch(() => ({}));
    if (["open", "working", "done"].includes(b.status)) pin.status = b.status;
    if (typeof b.reply === "string") pin.reply = b.reply.slice(0, 4000);
    if (typeof b.comment === "string" && b.comment.trim()) pin.comment = b.comment.slice(0, 4000);
    const add = imgList(b.addImages);
    if (add.length) { pin.images = [...(pin.images || []), ...add].slice(0, 20); if (b.by !== "claude") pin.status = "open"; }
    pin.updated = new Date().toISOString();
    save();
    if (b.by !== "claude") log({ event: "update", ...pin }); // 사용자가 다시 열거나 고친 경우에만 Claude에게 알려요
    send("pins", pins);
    return json(200, pin);
  }
  if (m && req.method === "DELETE") {
    pins = pins.filter((x) => x.id !== m[1]); save(); send("pins", pins);
    return json(200, { ok: true });
  }

  // ---- 정적 파일 ----
  let file;
  if (p === "/feedback" || p === "/feedback/") file = path.join(__dirname, "index.html");
  else {
    if (p.split("/").some((seg) => seg.startsWith("."))) { res.writeHead(403); return res.end(); }
    file = path.join(ROOT, p.endsWith("/") ? p + "index.html" : p);
    if (!file.startsWith(ROOT)) { res.writeHead(403); return res.end(); }
  }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("404"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file).toLowerCase()] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  });
}).listen(PORT, "127.0.0.1", () => console.log(`ready  site: http://localhost:${PORT}/   feedback: http://localhost:${PORT}/feedback`));

// 사이트 파일이 바뀌면 피드백 페이지를 새로고침해요
let t = null, changed = new Set();
try {
  fs.watch(ROOT, { recursive: true }, (ev, f) => {
    if (!f) return;
    f = f.replace(/\\/g, "/");
    if (/^(\.|node_modules\/|tools\/)/.test(f) || /^assets\/css\/tune\./.test(f) || !/\.(html|css|js|png|jpe?g|webp|svg)$/i.test(f)) return;
    changed.add(f);
    clearTimeout(t);
    t = setTimeout(() => { send("reload", { files: [...changed] }); changed.clear(); }, 350);
  });
} catch (e) { console.log("file watching unavailable:", e.message); }
