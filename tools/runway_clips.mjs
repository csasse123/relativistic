// Generate the mission-control clips with the Runway API.
// Usage (on a machine where RUNWAY_API_KEY is set):  node tools/runway_clips.mjs [clipId ...]
// gen4_image (text→still) → gen4_turbo (still→5 s video) → assets/clips/<id>.mp4. Existing files are skipped.
import fs from "fs";
const KEY = process.env.RUNWAY_API_KEY; if (!KEY) { console.error("RUNWAY_API_KEY is not set"); process.exit(1); }
const API = "https://api.dev.runwayml.com/v1", H = { Authorization: `Bearer ${KEY}`, "X-Runway-Version": "2024-11-06", "Content-Type": "application/json" };
const { style, clips } = JSON.parse(fs.readFileSync(new URL("../docs/ai_clips.json", import.meta.url)));
const only = process.argv.slice(2), outDir = new URL("../assets/clips/", import.meta.url); fs.mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function call(path, body) { const r = await fetch(API + path, { method: body ? "POST" : "GET", headers: H, body: body && JSON.stringify(body) }); const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${path} → HTTP ${r.status}: ${JSON.stringify(j)}`); return j; }
async function run(path, body) { const { id } = await call(path, body); for (;;) { await sleep(5000); const t = await call(`/tasks/${id}`);
  if (t.status === "SUCCEEDED") return t.output[0]; if (t.status === "FAILED" || t.status === "CANCELLED") throw new Error(`task ${id} ${t.status}: ${t.failure || ""}`); process.stdout.write("."); } }
for (const c of clips) {
  if (only.length && !only.includes(c.id)) continue; const file = new URL(`${c.id}.mp4`, outDir); if (fs.existsSync(file)) { console.log(`skip ${c.id} (exists)`); continue; }
  try { console.log(`\n${c.id}: image`); const img = await run("/text_to_image", { model: "gen4_image", promptText: `${c.image}. ${style}`.slice(0, 1000), ratio: "1920:1080" });
    console.log(`\n${c.id}: video`); const vid = await run("/image_to_video", { model: "gen4_turbo", promptImage: img, promptText: `${c.motion}. ${style}`.slice(0, 1000), ratio: "1280:720", duration: 5 });
    fs.writeFileSync(file, Buffer.from(await (await fetch(vid)).arrayBuffer())); fs.writeFileSync(new URL(`${c.id}.jpg`, outDir), Buffer.from(await (await fetch(img)).arrayBuffer())); console.log(`\n✓ ${c.id}`); }
  catch (e) { console.error(`\n✗ ${c.id}: ${e.message}`); if (/credit|insufficient|402/i.test(e.message)) { console.error("Out of Runway credits — top up at dev.runwayml.com and re-run."); process.exit(2); } }
}
