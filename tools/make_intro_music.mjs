// Quiet instrumental underscore for the intro film via ElevenLabs Music (model music_v1, a composition plan with one section per scene).
// Writes assets/intro/music.mp3, as long as the film (assets/intro/durations.json) plus a short tail for the fade-out.
// Same key rules as make_intro_voice.mjs (ELEVENLABS_API_KEY, or the macOS Keychain entry "elevenlabs"); the key needs music generation enabled.
//   node tools/make_intro_music.mjs [--force]
import fs from "fs"; import path from "path"; import { execFileSync } from "child_process";
const root = path.resolve(new URL("..", import.meta.url).pathname), dir = path.join(root, "assets/intro"), out = path.join(dir, "music.mp3");
const base = process.env.ELEVENLABS_API_BASE || "https://api.elevenlabs.io";
let key = process.env.ELEVENLABS_API_KEY;
if (!key && process.platform === "darwin") { try { key = execFileSync("security", ["find-generic-password", "-s", "elevenlabs", "-w"], { stdio: ["ignore", "pipe", "ignore"] }).toString().trim(); } catch (e) { /* no keychain entry */ } }
if (!key) { console.error("No ElevenLabs key found (ELEVENLABS_API_KEY or the Keychain entry \"elevenlabs\")."); process.exit(1); }
if (fs.existsSync(out) && !process.argv.includes("--force")) { console.log("assets/intro/music.mp3 exists (use --force to regenerate)"); process.exit(0); }
const dur = JSON.parse(fs.readFileSync(path.join(dir, "durations.json"), "utf8")).scene_dur;
// one mood per scene, in the order of assets/intro/script.json; the tail is appended to the last section
const MOOD = [
  ["soft fade in", "rising warm pads", "a simple hopeful piano motif", "awe"],
  ["gentle slowly quickening pulse", "soft pads", "sparse piano"],
  ["curious", "shimmering soft arpeggiated synth", "light and glassy"],
  ["deep warm low strings", "slow swelling pads", "wonder"],
  ["luminous shimmering synth", "calm and mysterious", "sparse piano"],
  ["calm", "steady warm pads", "very sparse piano"],
  ["quietly cautious", "a little darker", "slow low strings", "restrained"],
  ["hopeful", "open warm pads", "gentle piano resolving", "inviting", "slow fade out"],
];
const TAIL_MS = 3000;
const plan = {
  positive_global_styles: ["quiet cinematic ambient", "space documentary underscore", "warm evolving synth pads", "sparse soft piano", "gentle low strings", "sense of wonder", "spacious reverb", "instrumental", "sits under narration"],
  negative_global_styles: ["drums", "percussion", "vocals", "choir", "electric guitar", "loud", "busy melody", "abrupt changes"],
  sections: dur.map((d, i) => ({ section_name: `Scene ${i + 1}`, positive_local_styles: MOOD[i], negative_local_styles: ["drums", "vocals"], duration_ms: Math.round(d * 1000) + (i === dur.length - 1 ? TAIL_MS : 0), lines: [] })),
};
const total = plan.sections.reduce((a, s) => a + s.duration_ms, 0);
console.log(`composing ${(total / 1000).toFixed(1)} s in ${plan.sections.length} sections …`);
const r = await fetch(`${base}/v1/music?output_format=mp3_44100_128`, { method: "POST", headers: { "xi-api-key": key, "Content-Type": "application/json", Accept: "audio/mpeg" },
  body: JSON.stringify({ composition_plan: plan, model_id: "music_v1", respect_sections_durations: true }) });
if (!r.ok) { console.error(`ElevenLabs music error ${r.status}: ${(await r.text()).slice(0, 400)}`); process.exit(1); }
fs.writeFileSync(out, Buffer.from(await r.arrayBuffer()));
console.log(`wrote assets/intro/music.mp3 (${execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", out]).toString().trim()} s)`);
