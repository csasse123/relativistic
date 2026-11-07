# 3D Night Sky — intro music (DRAFT 2, 7 Nov 2026)

Christian, 7 Nov: no mountain and no drama. A few short spoken words, then beautiful instrumental music to explore by. About 1 minute. It opens **3D Night Sky**, then hands over the controls.

## Suno settings (v6)

| Setting | Value |
|---|---|
| Mode | **Custom** |
| Model | **v6** |
| Variety | **Off** |
| Duration | **1:05** |
| Title | `3D Night Sky` |

### Style (paste as-is)

```
short soft female spoken intro then instrumental, dreamy cinematic electronic, warm and uplifting, sense of wonder, 120 BPM, D major, lush shimmering pads, glassy arpeggios, gentle pulsing analog bass, airy piano motif, soft four-on-the-floor kick from the middle, wide reverb, space ambient, smooth build, gentle resolved ending
```

### Exclude Styles

```
male vocals, rap, sung chorus, choir, aggressive, dark, heavy drop, distorted, fade out
```

## Lyrics (paste as-is)

```
[Intro]
[Soft Spoken Word]
Three-D Night Sky.
Look up.
Billions of billions of stars.
Go and explore.

[Instrumental]

[Instrumental Build]

[Instrumental]

[Instrumental Outro]

[End]
```

The facts check out: the observable universe holds roughly 10²² to 10²⁴ stars, so "billions of billions" (10¹⁸) is, if anything, an understatement. In the app you can fly to any star.

## Picture (one timeline, two outputs)

Fully 3D and immersive. The camera flies through **the real app**; Runway clips appear as oval visions in the sky, never on a flat screen. **Every vision shows something the app really does** (`docs/ai_clips_nightsky.json`, each with its `app` field).

| Music | In the app (real engine) | Runway vision → app feature |
|---|---|---|
| Spoken intro (about 0:00–0:10) | Black, then the live sky fades in over the star party; "Look up" tilts the view to the stars | Someone puts on a headset and the room dissolves into stars → **headset mode** |
| Instrumental, gentle | The climb from the ground into space; the stars turn 3D from 80 km | Star party under the Milky Way → **star party** |
| Build | A star dive to a bright star, with its card | The Great Pyramid in 2560 BC under the stars → **Skies of history: Giza** |
| Main instrumental | The Milky Way stack and star trails, a slow sweep of the whole sky | A rocky world under a dim red sun → **Exoplanet skies: Proxima** |
| Outro | The camera settles and the controls appear | — |

The cue times come from the beat map of the chosen take.

**Decided 7 Nov: both outputs.** (1) **In the app:** the intro flow runs live on first open, synced to the music, and then the user takes over. (2) **Video:** the same timeline rendered frame-exact, as a flat 1080p version (X, YouTube, explorables.io) and a 5760 360° version (YouTube VR, the Quest).

## Steps

1. Christian generates takes in Suno from this sheet and picks one.
2. Check the vocal (Demucs plus Whisper), beat-map it (`tools/beatmap.py`), and set the cue times.
3. Animate the chosen Runway stills to fit the cues.
4. The app side belongs to the 3D Night Sky session (`~/Star Explorer VR`): the cue runner and the flat path, built from the cue sheet.
5. Render, check the frames by eye, and release.

## App integration (agreed with the 3D Night Sky session, 7 Nov; live build 166)

| Beat | App call (origin-vr-src/app.js unless noted) |
|---|---|
| Dark start, then the live sky over the star party (the default place) | `buildPlace` for the party place; set the time with `simT`; fade with `fadeBall` |
| The climb | drive `lift.s` per frame, with h = 2(e^(s/1.25) − 1). The height HUD and the 3D stars (~80 km) follow automatically. |
| Polaris dive and card | `flyToStar(i)`. Its duration comes from the distance, so it needs a duration hook. |
| Toward M31 | `flyToDso(DSOS.find(d=>d.id==='M31'))` |
| Milky Way stack and star trails | `trStart()` (features.js); in flat mode, sweep the view with `setLook()` |
| Visions' features | Skies of history `hisGo(ev)` (Giza 2560 BC); Exoplanet skies `exsGo(host)` (Proxima); star party `buildPlace` |
| Explore (end) | `goHome()`, then `showMenu()` or `summonPanel()` |

- **Intro hook:** it runs before or instead of `welcomeOnce()` (features.js, localStorage `originWelcomed`). In flat mode it starts from the start button. On the Quest, the song starts from the ENTER VR gesture (`auInit()` → `AU.ctx`), and the timeline runs on `AU.ctx.currentTime`.
- **Skip:** B (`homeAction`) or a stick push jumps to the end of the intro. There's also a "Skip intro" button on the panel.
- **Headset:** the intro never drives the head. It turns the seat (`seatTurn`) or the scene. In flat mode it drives yaw and pitch.
- **Film (already built):** `?film=1` exposes `window.__film`: `init(W, face)` for the 360 equirect, `step(dt)` at a fixed dt from t = 0, `frame(q)` returns a JPEG, plus `card()` and `api`. It's driven over CDP the same way as render_mp4.mjs.
- **Still to build (3D Night Sky session, after the cue sheet):** the cue runner with fixed durations; a duration parameter for flyToStar, flyToDso and the climb; and `F.flat(w,h)` for 1080p.

## History

- Draft 1 (dark electroclash, spoken verses, a sung chorus, Maunakea) gave take 1 on 7 Nov. Christian didn't want the mountain or the drama, so it was replaced by draft 2.
