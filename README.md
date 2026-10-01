# Relativistic Village

**Guided 3D fly-through of a village as light would look near *c*.**

Live: [csasse123.github.io/relativistic](https://csasse123.github.io/relativistic/)

## Experience (v0.6)

1. **Guided tour** runs by itself (slow, streets + turns).  
2. **Free look** — drag to look **left / right / behind** while you keep moving forward.  
3. **β** sets optics. Boost axis is always **velocity** (the road), never the camera look.  

So when you look **ahead** vs **side** vs **rear**, aberration and Doppler differ by angle to velocity (cool forward, warm behind). That is not a telephoto zoom.

### Why older builds “zoomed”

An adaptive narrow frustum shrank with β and filled the screen → pure zoom mush.  
**v0.6** uses a **full-sphere high-res cubemap** (angle remapping only; capture FOV does not shrink with β). See DESY / RTR / Weiskopf / OpenRelativity.

| Dial | Meaning |
|------|---------|
| Guided tour | Automatic path |
| Town speed | How fast you move (keep ~0.2×) |
| Free look | Look around; tour still flies |
| β = v/c | Optics strength |
| Doppler | Color vs angle to velocity |

## Thirty-Two Clocks (v0.9)

`satellites.html`: a satellites-only music video. It has real coastlines and city lights (`assets/earth_*.jpg`), a 32-satellite GPS constellation, Newton's cannon, a 4-sphere position fix, special relativity (−7.2 μs), general relativity (+45.7 μs), the factory detune and an imaging dive over Berlin.
The Suno style, lyrics and settings are in [`docs/SUNO.md`](docs/SUNO.md). Drop the Suno mp3 onto the page; `?sync` gives exact line timing and R exports a WebM.

## Music video (v0.8)

`video.html` — 118.8 s 3D physics music video locked to `assets/the-math-never-sleeps.mp3`.
Formula rain, always-moving satellites, GPS clocks (−7 +45 = +38 μs), windshield Schwarzschild, microwave dipoles, smoke-detector alphas, MRI precession.

- Cues cover only lines actually in the audio (intro, V1, pre, chorus, V2, V3, chorus, V4 + stacked drop). Defaults are estimated from the loudness envelope.
- `video.html?sync` — tap **Space** at each line start while it plays; times are saved and used on reload.
- **R** / button — export WebM (real-time capture with audio).

## Develop

```bash
cd relativistic && python3 -m http.server 8765
```

## Versions

- **v0.5** — guided tour; adaptive frustum (too zoom-like)  
- **v0.6** — free look + velocity-fixed boost + full-sphere capture  

## License

MIT · cite Terrell, Penrose, Savage et al., Weiskopf, OpenRelativity when teaching.
