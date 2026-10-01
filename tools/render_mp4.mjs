// Frame-exact export of satellites.html → MP4 for X / YouTube (H.264 High + AAC, 1920×1080, 30 fps).
// Needs: Google Chrome, ffmpeg (brew install ffmpeg), and once: npm i -D playwright
// Usage: node tools/render_mp4.mjs [fps=30] [out=exports/thirty-two-clocks_1080p.mp4]
import { chromium } from "playwright"; import http from "http"; import fs from "fs"; import path from "path"; import { spawn } from "child_process";
const root = path.resolve(new URL("..", import.meta.url).pathname), fps = +(process.argv[2] || 30), out = process.argv[3] || "exports/thirty-two-clocks_1080p.mp4";
fs.mkdirSync(path.dirname(path.join(root, out)), { recursive: true });
const types = { ".html": "text/html", ".js": "text/javascript", ".mjs": "text/javascript", ".json": "application/json", ".jpg": "image/jpeg", ".png": "image/png", ".mp3": "audio/mpeg", ".mp4": "video/mp4", ".glb": "model/gltf-binary", ".wasm": "application/wasm" };
const server = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" }); r.end(b); }); }).listen(8765);
const browser = await chromium.launch({ channel: "chrome", headless: false, args: ["--autoplay-policy=no-user-gesture-required", "--window-size=1920,1080"] });
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto("http://localhost:8765/satellites.html?q=1080"); await page.waitForFunction(() => window.__ready, null, { timeout: 180000 });
await page.waitForTimeout(3000); // let clips buffer
const dur = await page.evaluate(() => { const a = document.getElementById("au"); return isFinite(a.duration) ? a.duration : 132.07; });
const N = Math.ceil(dur * fps); console.log(`rendering ${N} frames at ${fps} fps (${dur.toFixed(2)} s) → ${out}`);
const ff = spawn("ffmpeg", ["-y", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-", "-i", path.join(root, "assets/thirty-two-clocks.mp3"),
  "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", String(fps), "-c:a", "aac", "-b:a", "192k", "-ar", "48000", "-shortest", "-movflags", "+faststart", path.join(root, out)], { stdio: ["pipe", "inherit", "inherit"] });
const t0 = Date.now();
for (let i = 0; i < N; i++) { const url = await page.evaluate((t) => window.__frame(t), i / fps); const buf = Buffer.from(url.split(",")[1], "base64");
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % fps === 0) { const el = (Date.now() - t0) / 1000, eta = el / (i + 1) * (N - i - 1); process.stdout.write(`\r${(i / fps).toFixed(0)}s / ${dur.toFixed(0)}s  ·  ETA ${Math.round(eta / 60)} min   `); } }
ff.stdin.end(); await new Promise((r) => ff.on("close", r)); await browser.close(); server.close();
console.log(`\ndone → ${out}  (${(fs.statSync(path.join(root, out)).size / 1e6).toFixed(0)} MB)`);
