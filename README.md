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
| **Click-drag on the canvas** | Look around (release mouse anytime) |
| **W A S D** | Move (thrust) |
| **Space / C** | Up / down (altitude) |
| **Scroll on canvas** | FOV |
| **Right panel** | Always free — change β, optics, teleports without Esc |
| **β presets** | 0 · 0.3 · 0.6 · 0.9 · 0.99 |
| **Teleports** | Gate · Plaza · Shape garden · Bridge · Flyover |

**No pointer lock.** Looking only happens while you hold the mouse button on the scenery; the settings panel never steals control.

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

## Versions

1. **v0.1** — village + free flight + cubemap aberration + Doppler  
2. **v0.2** — richer town (church, silo, bridge, train, windmill, …)  
3. **v0.3** — click-drag look (no pointer lock), shape garden, β presets, teleports  

Next: light-travel-time façades, recorded paths, night mode, optional VR.

## License

MIT for code; cite the classic papers when teaching from this.
