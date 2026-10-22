// Runway pipeline for the video's AI clips (needs RUNWAY_API_KEY).
//   node tools/runway_clips.mjs                     → every clip whose mp4 is missing (still → 5 s video)
//   node tools/runway_clips.mjs --force a b         → regenerate clips a, b
//   node tools/runway_clips.mjs --redo              → also clips marked "redo": true
// Director workflow (best quality):
//   node tools/runway_clips.mjs --stills 4 [ids]    → 4 candidate stills per clip → assets/clips/takes/<id>_1..4.jpg (≈8 credits each)
//   node tools/runway_clips.mjs --animate id:2 ...  → animate take 2 of <id> as a 10 s clip → assets/clips/<id>.mp4 (+ .jpg)
//   --duration 5|10 overrides the clip length (default 10 for --animate)
import fs from "fs";
const KEY = process.env.RUNWAY_API_KEY; if (!KEY) { console.error("RUNWAY_API_KEY is not set"); process.exit(1); }
const API = "https://api.dev.runwayml.com/v1", H = { Authorization: `Bearer ${KEY}`, "X-Runway-Version": "2024-11-06", "Content-Type": "application/json" };
const root = new URL("../", import.meta.url), spec = JSON.parse(fs.readFileSync(new URL("docs/ai_clips.json", root)));
const argv = process.argv.slice(2), flag = (f) => argv.includes(f), val = (f) => { const i = argv.indexOf(f); return i >= 0 ? argv[i + 1] : null; };
const force = flag("--force"), redo = flag("--redo"), nStills = +(val("--stills") || 0), dur = +(val("--duration") || 0);
const animate = argv.includes("--animate") ? argv.slice(argv.indexOf("--animate") + 1).filter((a) => /^[a-z_]+:\d+$/.test(a)) : [];
const only = argv.filter((a, i) => !a.startsWith("--") && !/^\d+$/.test(a) && !/:\d+$/.test(a) && argv[i - 1] !== "--stills" && argv[i - 1] !== "--duration");
const outDir = new URL("assets/clips/", root), takes = new URL("assets/clips/takes/", root); fs.mkdirSync(takes, { recursive: true });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dataUri = (rel) => { const b = fs.readFileSync(new URL(rel, root)); return `data:image/${rel.endsWith(".png") ? "png" : "jpeg"};base64,${b.toString("base64")}`; };
async function call(path, body) { const r = await fetch(API + path, { method: body ? "POST" : "GET", headers: H, body: body && JSON.stringify(body) }); const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`${path} → HTTP ${r.status}: ${JSON.stringify(j)}`); return j; }
async function run(path, body, tries = 2) { for (let k = 0; ; k++) { try { const { id } = await call(path, body); for (;;) { await sleep(5000); const t = await call(`/tasks/${id}`);
  if (t.status === "SUCCEEDED") return t.output[0]; if (t.status === "FAILED" || t.status === "CANCELLED") throw new Error(`task ${id} ${t.status}: ${t.failure || ""}`); process.stdout.write("."); } }
  catch (e) { if (k >= tries || /credit|insufficient|402/i.test(e.message)) throw e; console.log(`\n  retry (${e.message.slice(0, 80)})`); } } }
const save = async (url, file) => fs.writeFileSync(file, Buffer.from(await (await fetch(url)).arrayBuffer()));
const styleOf = (c) => spec.styles?.[c.style || "crew"] || spec.style || "";
const still = (c) => { const b = { model: "gen4_image", promptText: `${c.image}. ${styleOf(c)}`.slice(0, 1000), ratio: "1920:1080" }; const refs = (c.refs || []).filter((r) => fs.existsSync(new URL(r.file, root))); if (refs.length) b.referenceImages = refs.map((r) => ({ uri: dataUri(r.file), tag: r.tag }));
  else b.promptText = b.promptText.replace(/,? ?(like )?@\w+/g, ""); return run("/text_to_image", b); };
const video = (c, img, d) => run("/image_to_video", { model: "gen4_turbo", promptImage: img, promptText: `${c.motion}. ${styleOf(c)}`.slice(0, 1000), ratio: "1280:720", duration: d });
const bal = async (w) => { const o = await call("/organization").catch(() => null); if (o && o.creditBalance != null) console.log(`credits ${w}: ${o.creditBalance}`); };
const fail = (id, e) => { console.error(`\n✗ ${id}: ${e.message}`); if (/credit|insufficient|402/i.test(e.message)) { console.error("Out of Runway credits — top up at dev.runwayml.com and re-run."); process.exit(2); } };
await bal("before");
const byId = Object.fromEntries(spec.clips.map((c) => [c.id, c]));
if (nStills) { for (const c of spec.clips) { if (only.length && !only.includes(c.id)) continue;
    for (let k = 1; k <= nStills; k++) { try { process.stdout.write(`\n${c.id} take ${k}`); await save(await still(c), new URL(`${c.id}_${k}.jpg`, takes)); } catch (e) { fail(`${c.id}_${k}`, e); } } }
  console.log("\nstills in assets/clips/takes — pick one per clip, then: node tools/runway_clips.mjs --animate <id>:<take> ..."); }
else if (animate.length) { for (const a of animate) { const [id, k] = a.split(":"), c = byId[id]; if (!c) { console.error(`unknown clip ${id}`); continue; }
    try { const f = `assets/clips/takes/${id}_${k}.jpg`; process.stdout.write(`\n${id}: animating take ${k}`); const v = await video(c, dataUri(f), dur || 10);
      await save(v, new URL(`${id}.mp4`, outDir)); fs.copyFileSync(new URL(f, root), new URL(`${id}.jpg`, outDir)); console.log(`\n✓ ${id}`); } catch (e) { fail(id, e); } } }
else { for (const c of spec.clips) { if (only.length && !only.includes(c.id)) continue; const file = new URL(`${c.id}.mp4`, outDir);
    if (fs.existsSync(file) && !(force && only.includes(c.id)) && !(redo && c.redo)) { console.log(`skip ${c.id}`); continue; }
    try { console.log(`\n${c.id}: still`); const img = await still(c); console.log(`\n${c.id}: video`); const v = await video(c, img, dur || c.duration || 5);
      await save(v, file); await save(img, new URL(`${c.id}.jpg`, outDir)); console.log(`\n✓ ${c.id}`); } catch (e) { fail(c.id, e); } } }
await bal("after");
