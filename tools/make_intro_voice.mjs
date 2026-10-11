// Narration for the intro film via ElevenLabs. Reads assets/intro/script.json, writes assets/intro/s1.mp3 … sN.mp3
// and assets/intro/durations.json (scene lengths = narration + padding), which the page and tools/render_intro.mjs both read.
// Needs: Node 18+, ffprobe (comes with ffmpeg), and an ElevenLabs key.
//   export ELEVENLABS_API_KEY=...            # your key
//   export ELEVENLABS_VOICE_ID=...           # the voice you want (copy the id from the ElevenLabs voice library)
//   node tools/make_intro_voice.mjs [--force]   # --force re-generates scenes that already have an mp3
// Optional: ELEVENLABS_MODEL (default eleven_multilingual_v2), ELEVENLABS_API_BASE (default https://api.elevenlabs.io).
import fs from "fs"; import path from "path"; import { execFileSync } from "child_process";
const root = path.resolve(new URL("..", import.meta.url).pathname), dir = path.join(root, "assets/intro");
const key = process.env.ELEVENLABS_API_KEY, voiceId = process.env.ELEVENLABS_VOICE_ID;
if (!key || !voiceId) { console.error("Set ELEVENLABS_API_KEY and ELEVENLABS_VOICE_ID first (see the header of this file)."); process.exit(1); }
const base = process.env.ELEVENLABS_API_BASE || "https://api.elevenlabs.io", model = process.env.ELEVENLABS_MODEL || "eleven_multilingual_v2";
const force = process.argv.includes("--force"), LEAD = 0.3, TAIL = 0.9;
const script = JSON.parse(fs.readFileSync(path.join(dir, "script.json"), "utf8"));
const probe = (f) => parseFloat(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", f]).toString());
const audio = [], sceneDur = [];
for (const [i, sc] of script.scenes.entries()) {
  const file = path.join(dir, `s${i + 1}.mp3`);
  if (force || !fs.existsSync(file)) {
    process.stdout.write(`scene ${i + 1}/${script.scenes.length} “${sc.title}” … `);
    const r = await fetch(`${base}/v1/text-to-speech/${voiceId}?output_format=mp3_44100_128`, {
      method: "POST", headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
      body: JSON.stringify({ text: sc.text, model_id: model, voice_settings: { stability: 0.5, similarity_boost: 0.8, style: 0.15, use_speaker_boost: true } }) });
    if (!r.ok) { console.error(`\nElevenLabs error ${r.status}: ${(await r.text()).slice(0, 300)}`); process.exit(1); }
    fs.writeFileSync(file, Buffer.from(await r.arrayBuffer())); console.log("ok");
  } else console.log(`scene ${i + 1}: keeping existing ${path.basename(file)} (use --force to redo)`);
  const d = probe(file); audio.push(+d.toFixed(3)); sceneDur.push(+Math.max(sc.min || 6, d + LEAD + TAIL).toFixed(2));
}
fs.writeFileSync(path.join(dir, "durations.json"), JSON.stringify({ voice: voiceId, model, lead: LEAD, audio_dur: audio, scene_dur: sceneDur, total: +sceneDur.reduce((a, b) => a + b, 0).toFixed(2) }, null, 2));
console.log(`\ndone: ${sceneDur.reduce((a, b) => a + b, 0).toFixed(1)} s total → assets/intro/durations.json.\nNext: node tools/render_intro.mjs   (renders the film with this narration)`);
