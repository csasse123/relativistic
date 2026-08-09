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

## How the experience works

Two separate dials (this is the usual confusion):

| Control | Meaning |
|---------|---------|
| **Hold W / Auto-cruise** | You *move through the village* (gameplay) |
| **Town speed** | How fast that map motion is |
| **β = v/c** | Physics for *what light does* (aberration tunnel, Doppler colors) |
| **γ** | Not a slider — computed from β |

**Recipe:** Start at gate → hold **W** → set **β ≈ 0.8** → drag to look. You should see a warped tunnel of streets, not a white screen.

| Input | Action |
|-------|--------|
| **Hold W** | Fly forward |
| **Auto-cruise** | Keep flying without holding W |
| **Click-drag canvas** | Look / steer (release for the panel) |
| **A D Space C** | Strafe / up / down |
| **β slider** | Relativistic optics (capped ~0.95 for visibility) |
| **Aberration** | Main geometric warp — keep on |
| **Doppler color** | Blue ahead / red behind (no white-out) |
| **Headlight** | Optional mild glow (off by default) |

**No pointer lock.** Panel is always usable when you release the mouse.

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

1. **v0.1** — first village + early cubemap  
2. **v0.2–0.3** — richer town, click-drag look, shape garden  
3. **v0.3.1** — fly UX (W / auto-cruise vs β)  
4. **v0.4** — **correct Lorentz cubemap** (RTR / Weiskopf): FOV rays, 1024³ cube no mip blur,
   boost along look, bright poles + rings so the tunnel is obvious; mild Doppler without white-out  

Next: light-travel-time façades, recorded paths, night mode, optional VR.

## License

MIT for code; cite the classic papers when teaching from this.
