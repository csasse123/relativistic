# Handoff: Spinning Neutron Star (read this first in a new session)

**Project:** `neutron-star.html`, a single-file WebGL2 ray tracer of a spinning neutron star with a switchable physics ladder
(Newton → length contraction → light travel time → aberration → Doppler → beaming → light bending → redshift/Shapiro →
oblateness + frame dragging), stereo views, a magnetosphere model (vacuum dipole and plasma-filled), a brightness curve,
an incoming-light beam, reality-check warnings, hover tips, an intro film and a guided tour.
**Live:** https://csasse123.github.io/relativistic/neutron-star.html (GitHub Pages, deploys from `main`). **Version:** v1.31.1.

## Working rules from the owner (follow these)
- Be efficient and concise. **Always bump the build number** (`BUILD` in the page, the `build` div, and the other pages' version strings).
- **Run locally by default.** The owner is on a Mac; sessions should run on it (Claude Desktop app → Code → New → Local, or
  `claude remote-control` in the folder). Cloud sessions cannot reach ElevenLabs or the Mac.
- Physics must be correct: cross-check against papers and exact integrations; flag anything that goes beyond real physics with a visible warning.
- Aesthetics matter (NASA-style blue wireframe, soft lensed glow, calm field lines). Do not make the picture busy.
- Never put API keys in chat or files. The ElevenLabs key is in the macOS Keychain, service `elevenlabs`.
- Commit and push to the working branch; merge to `main` via PR when the owner wants it live.

## Protection and deploy (v1.31.1)
- Licence: CC BY-NC-ND 4.0 (`LICENSE`, `NOTICE.md`), shown as a small credit bottom-right on every page.
- The live site is a **build**: `npm ci && node tools/build.mjs --assets` → `dist/` (minified inline JS/CSS, compacted shaders, licence mark, host check). CI (`pages.yml`) runs it and deploys `dist/`; `dist/` is gitignored. Develop and test on the readable source; `node tools/build.mjs` (no `--assets`) builds just the pages.
- Host check: pages run only on `csasse123.github.io`, `explorables.io`, localhost and file://; elsewhere they show "This is a copy" with a link. Add a host to `HOSTS` in `tools/build.mjs` (custom domain, a friend's mirror).
- Marker `cs-rel-7f3a91` appears in the meta tag and the code banner, to identify copies.
- Still open: the repo itself is public, so the readable source is public. Fix = make it private and publish `dist/` from a second public repo (or Cloudflare Pages / Netlify); needs the owner's go-ahead because a private repo cannot serve Pages on a free plan.

## Deploying to the website (explorables.io)
The page carries a "Work in progress" pill. Deploy = `EXPLORABLES_URL=https://host/path/neutron-star.html sh tools/deploy.sh`: builds `dist-site/`,
`rclone copy` to the rclone remote `explorables` (credentials live in the rclone config, never in the repo or chat), then `tools/smoke_test.mjs` on the live URL.
Mark's Claude produces the access details (protocol, host, user, folder, URL); the secret goes to Christian via a password manager.
Handover package for Mark: Dropbox `Christian Sasse/Relativistic/For Mark - Neutron Star v1.31.1/` (CLAUDE.md for his Claude).

## Where things are
- `docs/AUDIT_2026-10.md`: the October physics audit (what is exact, what was fixed). `docs/NEUTRON_STAR_LITERATURE.md`: references and formula checks. `docs/INTRO_VIDEO.md`: the intro film pipeline.
- `assets/intro/script.json`: the 8-scene narration (also the subtitles). Scene visuals: `SCN` / `CAM` in the last `<script>` block of `neutron-star.html`.
- `tools/make_intro_voice.mjs`, `tools/render_intro.mjs`: narration and MP4 export. Test pages with Playwright (`?export=intro`, `?nowelcome`).

## Intro film: done (v1.27.1), plays by default (v1.28.0), with quiet music (v1.31.1)
First visit: the intro autostarts (`nsIntroSeen` in localStorage); returning visitors land on the page. `?intro` forces it, `?nointro` / `?nowelcome` suppress it. "Skip intro ▸ interactive tour" ends it and starts the spotlight tour; "Skip ✕" / Esc just leaves. Browsers block sound until a touch, so a "Click anywhere for sound" pill appears and the narration resumes mid-scene on the first touch.
Narration (ElevenLabs voice "Christian") is committed: `assets/intro/s1.mp3 … s8.mp3`, `durations.json` (154.8 s). The page narrates it.
The MP4 is rendered locally (not committed): `HEADLESS=chrome node tools/render_intro.mjs` (headless Chrome, real GPU, no window; about 7 min; `npm i` first).
A visible-window render can be disturbed by anything touching that window; use `HEADLESS=chrome`.
Redo a clip: respell in `script.json`, delete its mp3, rerun `ELEVENLABS_VOICE_NAME="Christian" node tools/make_intro_voice.mjs`, re-render.

## Open items
- The owner has not yet reviewed the magnetic field lines on the live page; expect comments.
- Optional, only if asked: a "mirror star" (light reflecting off the spinning surface, double Doppler).
- Known approximations (all labelled in the UI): frame dragging is first order (~25% low for limb-grazing rays); the plasma magnetosphere is schematic;
  beyond ~0.3c the gravity model is a what-if (the warning box says so).
