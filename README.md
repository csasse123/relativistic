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

## Spinning Neutron Star (v1.15)

`neutron-star.html` · [live](https://csasse123.github.io/relativistic/neutron-star.html)

A real-time WebGL2 ray tracer for a rapidly spinning neutron star. It has no dependencies.

**How it works:**
- Every pixel is a photon traced backwards along a Schwarzschild null geodesic: RK4 on d²x/dλ² = −3/2 r_s h² x/r⁵.
- The trace runs back to an oblate surface, where it picks up the light-travel-time rotation phase, aberration, Doppler and redshift.

**Physics ladder** (keys 0–8, or Guided):
1. Newton
2. Length contraction
3. Light-travel time
4. Aberration (Terrell–Penrose)
5. Doppler
6. Beaming
7. Light bending
8. Gravitational redshift and Shapiro delay
9. Oblateness (AlGendy & Morsink 2014) and frame dragging

Each effect can also be switched on and off on its own.

**Views:** mono, split screen (Newton beside the current physics), and two eyes (red/cyan anaglyph, cross-eye or parallel), each eye ray-traced from its own position.

**Live pulse profile:** a 64² flux trace using the same physics, the observable that NICER fits.

**Look (v1.15):**
- **Surface:** a NASA-style blue wireframe. The grid hue is a Doppler-shifted 490 nm line. The hot caps are coloured by observed brightness on NASA's red→yellow scale.
- **Brightness curve:** shown on screen, with a moving dot and the Newton curve for reference.
- **Ghost grid:** shows the previous step, so you can see what each new effect moves.
- **Surface maps:** the Doppler × redshift factor g, or the light delay.
- **Magnetic field lines:** a rotating vacuum dipole with retarded fields (Deutsch), which sweeps back toward the light cylinder. Near the star it uses the Schwarzschild dipole shape (Wasserman & Shapiro 1983). The lines are seen through the same lensing and light delay as the surface.

**Speed:** the **v/c** dial (0–0.97 c, or the 0.1c–0.9c chips) sets the spin f = βcN/(2πR). **Playback** only sets the slow-motion rate.

**Presets:** J1748−2446ad (716 Hz), J0030+0451, J0740+6620, J0437−4715, and a hypothetical 2 kHz star.

Colours are false-colour blackbody: X-ray temperatures ×1/400. A blackbody at T is seen as one at gT.

The physics and the formula check are in [`docs/NEUTRON_STAR_LITERATURE.md`](docs/NEUTRON_STAR_LITERATURE.md).

## Thirty-Two Clocks (v1.1)

v1.1 adds:
- **Real NASA satellites:** ISS, Hubble, Landsat 8, Aqua, ICESat-2, GRACE, Sentinel-6 and GOES (`assets/models`, from NASA-3D-Resources), each at its true altitude.
- **Orbit ladder:** clock rate against altitude, computed live, with a bisection that finds the 3,174 km crossover.
- **Einstein field equations:** a step-by-step derivation to Schwarzschild, then Simpson integration of ∫GM/r² dr converging to +45.7 μs/day, with an RK4 geodesic streaming alongside.
- **Mission control:** the NASA JSC Mission Control Room model with a live GPS wall display.
- **AI clip slots:** see `docs/AI_VIDEO_PROMPTS.md` and `tools/runway_clips.mjs`.

## Thirty-Two Clocks (v1.0)

v1.0 is locked to the Suno take `assets/thirty-two-clocks.mp3` (2:12). Cue times come from a Whisper transcription and kick-drum onset detection. The look cuts between photographic and engineering-drawing styles: NASA Blue Marble imagery, night lights, a GPS III-style satellite with MLI foil, solar cells and a 12-helix L-band array, bloom, ACES tone mapping and lens flare, and a scan-line wipe into a blueprint view with callouts. Add `?q=720` on slower machines.

### v0.9

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

## Export for X / YouTube

`node tools/render_mp4.mjs` renders `satellites.html` frame by frame, with every AI clip seeked exactly, and encodes `exports/thirty-two-clocks_1080p.mp4`: H.264 High, AAC 192k, 1920×1080, 30 fps, faststart. It needs Google Chrome and ffmpeg (`brew install ffmpeg`), and `npm i -D playwright` the first time.
