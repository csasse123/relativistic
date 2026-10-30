# Publish "Five Atoms Thick" on explorables.io

For the Claude Code CLI on Christian's Mac, which has the `explorables` rclone remote. The cloud session can't reach explorables.io.

## Files (on `main`)

| File | What |
|---|---|
| `release/five-atoms-thick_1080p_X.mp4` | Final video: 1920×1080, 30 fps, H.264 High + AAC, 1:31.6. The first frame is the poster. |
| `release/five-atoms-thick_thumbnail.jpg` | Thumbnail, 1920×1080 |
| `release/five-atoms-thick_thumbnail_1280.jpg` | Thumbnail, 1280×720 |
| `tunnel.html` | The live page (3D + clips + song), if the site has a page per music video |

- Title: **Five Atoms Thick**
- Subtitle: **A music video about quantum tunneling**
- Short text: *The walls inside every chip are now a few atoms thick, so electrons tunnel straight through them. Most bounce back, some leak through: that's quantum tunneling, and it's in every chip, every phone and every star. Song: Suno. Clips: Runway. Lyrics, direction, live Schrödinger solver and every equation: Claude.*

## Steps

1. `cd ~/relativistic && git pull --no-rebase --no-edit origin main`
2. Look at the site **before** changing anything. Find where the other music video, **Thirty-Two Clocks**, lives:
   - `rclone lsf explorables: --max-depth 3 | grep -i -E "clock|satell|music|video|mp4|thumb"`
   - Download the page that lists it (the index or a music/videos page) into `~/explorables-backup/<date>/`, and read how its entry is built: markup, thumbnail size, file names, and the order of the entries.
3. Add Five Atoms Thick **the same way** as Thirty-Two Clocks:
   - Same kind of entry (video file, page, or both), same thumbnail size and naming, same text layout.
   - Put it where the existing order says it goes. If the list is newest first, put it first. If it is chronological, put it right after Thirty-Two Clocks.
   - If Thirty-Two Clocks is shown as a page (`satellites.html` + `assets/`), publish `tunnel.html` with the files it needs the same way: `assets/five-atoms-thick.mp3` and `assets/clips/q_*.mp4`.
4. Upload with `rclone copy` only. **Never** use `rclone sync`, `delete` or `purge`. Keep the backup of every file you edit.
5. Check it live with `curl -sI` on the new video, thumbnail and page URLs (expect 200) and open the listing page. Report the URLs.
6. Never print or commit credentials.
