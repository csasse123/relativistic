// Frame-exact export of the intro film: neutron-star.html?export=intro → H.264 + AAC MP4 (1920×1080, 30 fps).
// Needs: Google Chrome, ffmpeg, and once: npm i -D playwright. Run tools/make_intro_voice.mjs first for the narration
// (without it you get a silent film with subtitles).
// Usage: node tools/render_intro.mjs [out=exports/neutron-star-intro_1080p.mp4]
// Env: FPS (30), SIZE (1920x1080), HEADLESS=1 (bundled Chromium, software GL; slow), HEADLESS=chrome (installed Chrome, headless, real GPU; no window to disturb), MAXSEC (render only the first N seconds, to test).
import { chromium } from "playwright"; import http from "http"; import fs from "fs"; import path from "path"; import { spawn } from "child_process";
const root = path.resolve(new URL("..", import.meta.url).pathname), out = process.argv[2] || "exports/neutron-star-intro_1080p.mp4";
const fps = +(process.env.FPS || 30), [W, H] = (process.env.SIZE || "1920x1080").split("x").map(Number), MAXSEC = +(process.env.MAXSEC || 0);
fs.mkdirSync(path.dirname(path.join(root, out)), { recursive: true });
const types = { ".html": "text/html", ".js": "text/javascript", ".json": "application/json", ".mp3": "audio/mpeg", ".png": "image/png", ".jpg": "image/jpeg" };
const server = http.createServer((q, r) => { const p = path.join(root, decodeURIComponent(q.url.split("?")[0])); fs.readFile(p, (e, b) => { if (e) { r.writeHead(404); r.end(); return; } r.writeHead(200, { "content-type": types[path.extname(p)] || "application/octet-stream" }); r.end(b); }); }).listen(8766);
const headless = !!process.env.HEADLESS;
const browser = await chromium.launch(process.env.HEADLESS === "chrome" ? { channel: "chrome", headless: true, args: [`--window-size=${W},${H}`] } : headless ? { args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] } : { channel: "chrome", headless: false, args: [`--window-size=${W},${H}`] });
const page = await browser.newPage({ viewport: { width: W, height: H } });
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto("http://localhost:8766/neutron-star.html?export=intro&nowelcome"); await page.waitForFunction(() => window.__introReady, null, { timeout: 60000 });
const info = await page.evaluate(() => window.__introInfo());
const total = MAXSEC ? Math.min(MAXSEC, info.total) : info.total, N = Math.ceil(total * fps);
console.log(`${N} frames at ${fps} fps (${total.toFixed(1)} s)  narration: ${info.voice ? "yes" : "NO (silent film)"}`);
const args = ["-y", "-f", "image2pipe", "-framerate", String(fps), "-c:v", "mjpeg", "-i", "-"];
let filter = "";
if (info.voice) {
  const n = info.durs.length, lead = Math.round(info.lead * 1000);
  info.durs.forEach((_, i) => args.push("-i", path.join(root, `assets/intro/s${i + 1}.mp3`)));
  filter = info.durs.map((d, i) => `[${i + 1}:a]adelay=${lead}:all=1,apad=whole_dur=${d.toFixed(3)}[a${i}]`).join(";") + ";" + info.durs.map((_, i) => `[a${i}]`).join("") + `concat=n=${n}:v=0:a=1[aout]`;
  args.push("-filter_complex", filter, "-map", "0:v", "-map", "[aout]", "-c:a", "aac", "-b:a", "192k", "-ar", "48000");
}
args.push("-c:v", "libx264", "-preset", "slow", "-crf", "17", "-profile:v", "high", "-pix_fmt", "yuv420p", "-r", String(fps), "-t", total.toFixed(3), "-movflags", "+faststart", path.join(root, out));
const ff = spawn("ffmpeg", args, { stdio: ["pipe", "inherit", "inherit"] });
const t0 = Date.now();
for (let i = 0; i < N; i++) {
  await page.evaluate((t) => window.__introFrame(t), i / fps);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
  const buf = await page.screenshot({ type: "jpeg", quality: 93 });
  if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
  if (i % fps === 0) { const el = (Date.now() - t0) / 1000, eta = el / (i + 1) * (N - i - 1); process.stdout.write(`\r${(i / fps).toFixed(0)}s / ${total.toFixed(0)}s · ETA ${Math.round(eta / 60)} min   `); }
}
ff.stdin.end(); await new Promise((r) => ff.on("close", r)); await browser.close(); server.close();
console.log(`\ndone → ${out}  (${(fs.statSync(path.join(root, out)).size / 1e6).toFixed(0)} MB)`);
