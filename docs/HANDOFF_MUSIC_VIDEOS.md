# Handover: music videos (for Claude on Christian's Mac)

From now on this work runs **locally on the Mac** (`~/relativistic`, plus `~/Star Explorer VR` for the Quest site). No cloud sessions. Read this first, then `git log --oneline -30`.

## The productions

| Song | Page | Audio | Released |
|---|---|---|---|
| Thirty-Two Clocks (GPS, relativity, 2:12) | `satellites.html` | `assets/thirty-two-clocks.mp3` | `release/thirty-two-clocks_1080p_X.mp4` |
| Five Atoms Thick (quantum tunneling, 1:31.6) | `tunnel.html` | `assets/five-atoms-thick.mp3` (Suno take, cut on the kick grid) | `release/five-atoms-thick_1080p_X.mp4`, thumbnails `release/five-atoms-thick_thumbnail*.jpg` |

- Suno sheets: `docs/SUNO.md`, `docs/SUNO_TUNNEL.md`
- Runway shot lists: `docs/ai_clips.json`, `docs/ai_clips_tunnel.json`
- Clips: `assets/clips/*.mp4`

## Tools (run on the Mac)

- Runway: `node tools/runway_clips.mjs [--spec docs/ai_clips_tunnel.json] --stills 4 [ids]`, then `--animate id:take …`. `RUNWAY_API_KEY` lives in `~/.zshrc`. Never print it.
- Flat 1080p render: `PAGE=tunnel.html node tools/render_mp4.mjs` (or `satellites.html`). The first frame is the poster (`COVER`).
- 360 render for YouTube VR and the Quest: `VR=1 PAGE=satellites.html node tools/render_mp4.mjs` → `exports/<song>_360_5760.mp4`, tagged 360 by `tools/inject360.mjs`. Runs at about 5 frames per second on the Mac.
- Beat map: `python3 tools/beatmap.py song.mp3`

## The 360 editions

- `?vr` in both pages: a cube camera renders to 5760×2880 equirectangular, and each shot keeps its starting direction.
- **Thirty-Two Clocks (immersive edition, v1.46.0):**
  - A spacetime lattice bent by Earth all around the viewer.
  - GPS satellites flying past.
  - Clips as oval "visions" blended into space in different directions, never on a screen.
  - A ray-traced black hole for "bent time".
  - Christian likes this direction best. **The next productions must be fully 3D and immersive like this.**
- **Five Atoms Thick:** still uses a curved 110° screen for clips. Upgrade it to the same immersive style.

## Quest site (`~/Star Explorer VR`, repo csasse123/star-explorer-vr)

- `trips/music-360.html?v=five-atoms-thick|thirty-two-clocks` is the 360 player (headset plus drag-to-look on the computer). It reads films from `film-360/<id>_360_5760.mp4`, which is gitignored.
- Start the site with `nohup python3 serve_vr.py > server.out 2>&1 &`, then open http://localhost:8080. On the Quest it's https://<Mac IP>:8443.

## explorables.io

- Uploads use the SFTP settings in `~/Star Explorer VR/tools/deploy_explorables.sh` (DreamHost, SSH key). Copy only: never sync or delete. Back up any page before editing it.
- Five Atoms Thick (flat 1080p plus the 1280 thumbnail) goes next to Thirty-Two Clocks, in the same style and order (`docs/EXPLORABLES_FIVE_ATOMS.md`).

## Open items (as of 31 Oct 2026)

1. Finish and verify the explorables.io upload of Five Atoms Thick.
2. Re-render the immersive Thirty-Two Clocks 360 (`VR=1 PAGE=satellites.html node tools/render_mp4.mjs`), copy it to `~/Star Explorer VR/film-360/`, and watch it on the Quest.
3. Optional: upload both 360 files to YouTube (`docs/YOUTUBE_360.md`).
4. Next: bring Five Atoms Thick to the immersive standard, or start the next fully immersive production.

## How Christian works

- Short answers, coding only.
- Always bump the build number (`BUILD` in `index.html`, `satellites.html`, `video.html`, `tunnel.html`).
- Commit, push, PR, then merge to `main`.
- Give exact commands to paste.
- Never ask for passwords or keys in chat.
