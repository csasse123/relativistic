// Narration for the intro film via ElevenLabs. Reads assets/intro/script.json, writes assets/intro/s1.mp3 … sN.mp3
// and assets/intro/durations.json (scene lengths = narration + padding), which the page and tools/render_intro.mjs both read.
// Run it on your own computer (Node 18+, ffprobe from ffmpeg). The key is read from, in this order:
//   1. the ELEVENLABS_API_KEY environment variable, or
//   2. the macOS Keychain entry with service name "elevenlabs" (set it once, without the key ever appearing in a chat or history:
//        security add-generic-password -a "$USER" -s elevenlabs -w          # it prompts for the key)
// Pick the voice with ELEVENLABS_VOICE_ID, or ELEVENLABS_VOICE_NAME (looked up in your voice library; needs the voices_read permission).
//   node tools/make_intro_voice.mjs [--force] [--yes]
//     --force  re-generate scenes that already have an mp3     --yes  go ahead even if the character quota looks too small
// Optional: ELEVENLABS_MODEL (default eleven_v4; falls back to eleven_multilingual_v2 if the model is refused),
//           ELEVENLABS_API_BASE (default https://api.elevenlabs.io), ELEVENLABS_STABILITY / _SIMILARITY / _STYLE (unset = the voice's own defaults).
// The key needs the permissions: text_to_speech, voices_read (for the name lookup), user_read (for the quota check).
import fs from "fs"; import path from "path"; import { execFileSync } from "child_process";
const root = path.resolve(new URL("..", import.meta.url).pathname), dir = path.join(root, "assets/intro");
const base = process.env.ELEVENLABS_API_BASE || "https://api.elevenlabs.io";
let key = process.env.ELEVENLABS_API_KEY;
if (!key && process.platform === "darwin") { try { key = execFileSync("security", ["find-generic-password", "-s", "elevenlabs", "-w"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch (e) { /* no keychain entry */ } }
if (!key) { console.error("No ElevenLabs key found. Set ELEVENLABS_API_KEY, or on a Mac store it once with:\n  security add-generic-password -a \"$USER\" -s elevenlabs -w"); process.exit(1); }
const H = { "xi-api-key": key };
const api = async (p, init = {}) => fetch(`${base}${p}`, { ...init, headers: { ...H, ...(init.headers || {}) } });
let voiceId = process.env.ELEVENLABS_VOICE_ID;
if (!voiceId && process.env.ELEVENLABS_VOICE_NAME) {
  const r = await api("/v1/voices"); if (!r.ok) { console.error(`Could not list voices (${r.status}): enable voices_read on the key, or set ELEVENLABS_VOICE_ID.`); process.exit(1); }
  const v = (await r.json()).voices.find((x) => x.name.toLowerCase() === process.env.ELEVENLABS_VOICE_NAME.toLowerCase());
  if (!v) { console.error(`No voice named "${process.env.ELEVENLABS_VOICE_NAME}" in your library.`); process.exit(1); }
  voiceId = v.voice_id; console.log(`voice "${v.name}" (${v.category || "?"})`);
}
if (!voiceId) { console.error("Set ELEVENLABS_VOICE_ID (or ELEVENLABS_VOICE_NAME) to choose the voice."); process.exit(1); }
let model = process.env.ELEVENLABS_MODEL || "eleven_v4";
const force = process.argv.includes("--force"), yes = process.argv.includes("--yes"), LEAD = 0.3, TAIL = 0.9;
const script = JSON.parse(fs.readFileSync(path.join(dir, "script.json"), "utf8"));
const probe = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
// quota check: only the scenes that will actually be generated count
const todo = script.scenes.filter((_, i) => force || !fs.existsSync(path.join(dir, `s${i + 1}.mp3`)));
const need = todo.reduce((a, s) => a + s.text.length, 0);
try {
  const r = await api("/v1/user/subscription");
  if (r.ok) { const u = await r.json(), left = u.character_limit - u.character_count; console.log(`quota: ${left.toLocaleString()} characters left of ${u.character_limit.toLocaleString()}; this run needs ${need.toLocaleString()}`);
    if (need > left && !yes) { console.error("Not enough characters left for this run. Top up, or re-run with --yes to try anyway."); process.exit(1); } }
  else console.log(`(quota check skipped: ${r.status}; add the user_read permission to the key to see it)`);
} catch (e) { console.log("(quota check skipped)"); }
async function speak(i, sc) {
  const body = { text: sc.text, model_id: model };
  const prev = script.scenes[i - 1], next = script.scenes[i + 1];
  if (prev) body.previous_text = prev.text; if (next) body.next_text = next.text;           // neighbouring scenes for continuity
  const vs = {}; for (const [k, e] of [["stability", "ELEVENLABS_STABILITY"], ["similarity_boost", "ELEVENLABS_SIMILARITY"], ["style", "ELEVENLABS_STYLE"]]) if (process.env[e]) vs[k] = +process.env[e];
  if (Object.keys(vs).length) body.voice_settings = vs;
  const url = `/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, init = (b) => ({ method: "POST", headers: { "Content-Type": "application/json", Accept: "audio/mpeg" }, body: JSON.stringify(b) });
  let r = await api(url, init(body));
  if (r.status === 400 && (body.previous_text || body.next_text)) { delete body.previous_text; delete body.next_text; r = await api(url, init(body)); }   // continuity text refused: retry without
  if (!r.ok && model !== "eleven_multilingual_v2" && [400, 404, 422].includes(r.status) && /model/i.test(await r.clone().text())) { console.log(`\n(model ${model} refused, using eleven_multilingual_v2)`); model = "eleven_multilingual_v2"; body.model_id = model; r = await api(url, init(body)); }
  if (!r.ok) { console.error(`\nElevenLabs error ${r.status}: ${(await r.text()).slice(0, 300)}`); process.exit(1); }
  return Buffer.from(await r.arrayBuffer());
}
const audio = [], sceneDur = [];
for (const [i, sc] of script.scenes.entries()) {
  const file = path.join(dir, `s${i + 1}.mp3`);
  if (force || !fs.existsSync(file)) { process.stdout.write(`scene ${i + 1}/${script.scenes.length} “${sc.title}” … `); fs.writeFileSync(file, await speak(i, sc)); console.log("ok"); }
  else console.log(`scene ${i + 1}: keeping existing ${path.basename(file)} (use --force to redo)`);
  const d = probe(file); audio.push(+d.toFixed(3)); sceneDur.push(+Math.max(sc.min || 6, d + LEAD + TAIL).toFixed(2));
}
fs.writeFileSync(path.join(dir, "durations.json"), JSON.stringify({ voice: voiceId, model, lead: LEAD, audio_dur: audio, scene_dur: sceneDur, total: +sceneDur.reduce((a, b) => a + b, 0).toFixed(2) }, null, 2));
console.log(`\ndone: ${sceneDur.reduce((a, b) => a + b, 0).toFixed(1)} s total → assets/intro/durations.json.\nNext: node tools/render_intro.mjs   (renders the film with this narration)`);
