// Generate the video's AI clips with the Runway API.
// Usage (RUNWAY_API_KEY must be set):
//   node tools/runway_clips.mjs                 → every clip whose mp4 is missing
//   node tools/runway_clips.mjs sat_beauty      → only these ids (skipped if they exist)
//   node tools/runway_clips.mjs --redo          → also regenerate clips marked "redo": true
//   node tools/runway_clips.mjs --force drop_a  → regenerate these ids even if they exist
// Pipeline per clip: gen4_image (text + optional reference images, e.g. our own render or the cast) → gen4_turbo (still → video).
import fs from "fs";
const KEY = process.env.RUNWAY_API_KEY; if (!KEY) { console.error("RUNWAY_API_KEY is not set"); process.exit(1); }
const API = "https://api.dev.runwayml.com/v1", H = { Authorization: `Bearer ${KEY}`, "X-Runway-Version": "2024-11-06", "Content-Type": "application/json" };
const root = new URL("../", import.meta.url), spec = JSON.parse(fs.readFileSync(new URL("docs/ai_clips.json", root)));
const args = process.argv.slice(2), force = args.includes("--force"), redo = args.includes("--redo"), only = args.filter((a) => !a.startsWith("--"));
const outDir = new URL("assets/clips/", root); fs.mkdirSync(outDir, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dataUri = (rel) => { const b = fs.readFileSync(new URL(rel, root)); return `data:image/${rel.endsWith(".png") ? "png" : "jpeg"};base64,${b.toString("base64")}`; };
async function call(path, body) { const r = await fetch(API + path, { method: body ? "POST" : "GET", headers: H, body: body && JSON.stringify(body) }); const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${path} → HTTP ${r.status}: ${JSON.stringify(j)}`); return j; }
async function run(path, body) { const { id } = await call(path, body); for (;;) { await sleep(5000); const t = await call(`/tasks/${id}`);
  if (t.status === "SUCCEEDED") return t.output[0]; if (t.status === "FAILED" || t.status === "CANCELLED") throw new Error(`task ${id} ${t.status}: ${t.failure || ""}`); process.stdout.write("."); } }
const org = await call("/organization").catch(() => null); if (org && org.creditBalance != null) console.log(`credits before: ${org.creditBalance}`);
for (const c of spec.clips) {
  if (only.length && !only.includes(c.id)) continue; const file = new URL(`${c.id}.mp4`, outDir);
  const want = !fs.existsSync(file) || (force && only.includes(c.id)) || (redo && c.redo); if (!want) { console.log(`skip ${c.id}`); continue; }
  const style = spec.styles?.[c.style || "crew"] || spec.style || "";
  try { console.log(`\n${c.id}: image`); const body = { model: "gen4_image", promptText: `${c.image}. ${style}`.slice(0, 1000), ratio: "1920:1080" };
    if (c.refs) body.referenceImages = c.refs.map((r) => ({ uri: dataUri(r.file), tag: r.tag }));
    const img = await run("/text_to_image", body);
    console.log(`\n${c.id}: video`); const vid = await run("/image_to_video", { model: "gen4_turbo", promptImage: img, promptText: `${c.motion}. ${style}`.slice(0, 1000), ratio: "1280:720", duration: c.duration || 5 });
    fs.writeFileSync(file, Buffer.from(await (await fetch(vid)).arrayBuffer())); fs.writeFileSync(new URL(`${c.id}.jpg`, outDir), Buffer.from(await (await fetch(img)).arrayBuffer())); console.log(`\n✓ ${c.id}`); }
  catch (e) { console.error(`\n✗ ${c.id}: ${e.message}`); if (/credit|insufficient|402/i.test(e.message)) { console.error("Out of Runway credits — top up at dev.runwayml.com and re-run."); process.exit(2); } }
}
const org2 = await call("/organization").catch(() => null); if (org2 && org2.creditBalance != null) console.log(`\ncredits after: ${org2.creditBalance}`);
