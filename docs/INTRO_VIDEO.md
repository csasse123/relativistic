# The introduction film: how it works and how to make the narrated MP4

The intro is a ~2.5 minute film for complete beginners. It is not a recording: every scene runs on the live renderer
(`neutron-star.html`), so what viewers see is exactly what the controls do. The same timeline plays in the page
(**▶ Watch the intro**, key **I**) and renders to a video file.

## What it covers (8 scenes, text in `assets/intro/script.json`)

| # | Scene | What you see | What it says |
|---|---|---|---|
| 1 | A star the size of a city | the star, slowly turning | what a neutron star is: 24 km, 1.4 Suns, teaspoon = billions of tonnes |
| 2 | And it spins | 716 turns/s | the fastest known; equator ≈ 0.2 c (for a typical size) |
| 3 | Einstein, one effect at a time | ladder: Newton → light delay → Doppler (spun to 0.5 c, stated) | the physics ladder |
| 4 | Gravity bends light | straight beam, then bent beam focusing behind the star | light bending, ¾ of the surface visible |
| 5 | The strongest magnets | vacuum dipole → plasma-filled field + current sheet → beam through the field | field strength, the light cylinder, the wind; the field does not bend light |
| 6 | How we know | the brightness curve | NICER, pulse profiles |
| 7 | Where to be careful | the red warning at 0.9 c, then a dimmed "?" | what is exact, approximate, schematic; the unknown interior |
| 8 | Your turn | the panel slides in | hover tips, speed dial, interactive tour |

## Change the words

Edit `assets/intro/script.json` (`text` is both the subtitle and the narration; `min` is a minimum scene length in
seconds). Visuals per scene are in `SCN` / `CAM` in the intro block at the end of `neutron-star.html`.

## Make the narration (ElevenLabs, your own voice)

**Run this on your own computer, not in a cloud session.** A cloud Claude session cannot reach `api.elevenlabs.io` and has no
key; a *local* session (or a plain Terminal on your Mac) can. That is why the Origin tutorial session can narrate: it runs
on the Mac, with the key in the macOS Keychain.

One-time setup (the key never appears in a chat or in shell history, because `-w` prompts for it):

```bash
security add-generic-password -a "$USER" -s elevenlabs -w      # paste the key at the prompt
```

The key needs these permissions (ElevenLabs web UI: Developers > API Keys): `text_to_speech`, `voices_read`, `user_read`.
On other systems set `ELEVENLABS_API_KEY` instead.

```bash
git clone https://github.com/csasse123/relativistic && cd relativistic     # or git pull in your clone
ELEVENLABS_VOICE_NAME="Christian" node tools/make_intro_voice.mjs         # your cloned voice, looked up by name
# (or ELEVENLABS_VOICE_ID=<id> to skip the lookup)
```

- Each scene is one request, with the neighbouring scenes sent as `previous_text` / `next_text` for continuity (retried without
  them if refused). Model `eleven_v4` by default (falls back to `eleven_multilingual_v2` if refused; override with
  `ELEVENLABS_MODEL`). No voice settings are sent, so your voice's own defaults apply (`ELEVENLABS_STABILITY`,
  `ELEVENLABS_SIMILARITY`, `ELEVENLABS_STYLE` override).
- It first checks your quota. The whole script is about **2,060 characters**; it stops if too few are left (`--yes` to try anyway).
- Re-running skips scenes that already have an mp3, so you can regenerate just one (delete its mp3, or `--force` for all) and
  not pay twice. Format is `mp3_44100_128` (the 192 kbps format needs a higher plan).
- `durations.json` makes every scene exactly as long as its narration plus 0.3 s lead-in and 0.9 s tail. The page reads it too:
  once the mp3s and `durations.json` are committed, the intro on the live page plays with your voice.
- Tip from the Origin project: if a number or name is read oddly (digit by digit, say), spell it as you want to hear it in
  `script.json` (the subtitle then shows the same words).

## Render the MP4

```bash
npm i -D playwright                  # first time only; needs Google Chrome and ffmpeg
node tools/render_intro.mjs          # → exports/neutron-star-intro_1080p.mp4 (H.264 + AAC, 1080p, 30 fps)
```

Frame-exact (the page exposes `__introFrame(t)`); about 4,500 frames, on a laptop GPU roughly 15 to 30 minutes.
Without narration files it renders a silent film with subtitles. Test quickly with
`MAXSEC=20 FPS=10 SIZE=960x540 node tools/render_intro.mjs exports/test.mp4`.
Then commit the mp3s and `durations.json` so the live page narrates too.

## Without ElevenLabs

The intro always works with subtitles. If the browser supports speech synthesis, the **🗣** button reads the subtitles
aloud with the browser's own voice (a preview only: quality and accent depend on the device).

## The interactive tour (key T)

A spotlight tour of the 14 controls that matter most (`GST` in the same block). Each stop switches something on so the
effect is visible and, when the tour ends, every setting is restored. The first visit shows a welcome card with both
options; panel sections are collapsible (and remembered).
