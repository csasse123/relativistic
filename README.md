# Relativistic Village

**Fly a 3D village near the speed of light — and see what optics actually does.**

Live (GitHub Pages): after first push → `https://csasse123.github.io/relativistic/`

β = |v|/c. β → 1 is light speed (we never reach it). Free motion in **x, y, z**.

## What this is

A browser WebGL lab: a small town of roads and houses, free-flight camera, and a
**special-relativistic optical stack** grounded in the literature (Terrell–Penrose,
aberration, Doppler / headlight, image-based cubemap methods à la Weiskopf /
Real Time Relativity).

**Length contraction is real.** It is **not** what a photograph looks like by
itself. What you *see* is dominated by **aberration of light** (forward sky
squeezes into a tunnel), **Doppler + searchlight**, and — at higher fidelity —
**light travel time** (Terrell rotation).

See [docs/LITERATURE.md](docs/LITERATURE.md) for the detailed survey and design
rationale.

## Controls

| Input | Action |
|-------|--------|
| **W A S D** | Move on the ground plane (thrust) |
| **Space / C** | Up / down (altitude) |
| **Mouse drag** | Look |
| **Scroll** | FOV |
| **β slider** | Speed as fraction of *c* |
| **Toggles** | Aberration · Doppler · Headlight · Naive squash |

## Stack

- Static `index.html` + Three.js (CDN) — same spirit as Orbitals Studio
- Lab-frame village mesh
- CubeCamera capture → fullscreen pass with **inverse Lorentz aberration** + Doppler
- HUD: β, γ, velocity vector, mode legend

## Develop

Open `index.html` locally (or any static server). No build step.

```bash
cd relativistic
python3 -m http.server 8765
# http://localhost:8765
```

## Roadmap

1. **v0.1** — village + free flight + cubemap aberration + Doppler (this commit)
2. **v0.2** — explicit Terrell comparison mode, better materials, night village
3. **v0.3** — recorded paths, shareable β presets, optional VR

## License

MIT for code; cite the classic papers when teaching from this.
