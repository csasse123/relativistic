# Relativistic Village

**A guided 3D tour of a village as light would look near *c*.**

Live: [csasse123.github.io/relativistic](https://csasse123.github.io/relativistic/)

## Sit back and ride (v0.5)

On load, a **guided street tour** runs by itself:

- Gentle speed (**~0.22×** — experience, not a race)
- Path through streets **with turns** (loop)
- You can **drag to look**; the tour keeps moving
- **β** starts at **0.5** so optics are already on

| Dial | Meaning |
|------|---------|
| **Guided tour** | Automatic route through the village |
| **Town speed** | How fast the tour moves (keep low) |
| **β = v/c** | Optics only (aberration / Doppler) — **not** “drive faster” |
| **γ** | Computed from β (not a control) |

## Why high β no longer looks like a blurry zoom

At large β the whole screen maps into a **narrow cone** in the lab. Stretching a
cubemap of that cone used the whole screen’s pixels on a tiny texture patch →
soft “zoom mush.”

**v0.5** renders a **high-resolution adaptive perspective** (up to **2048px**)
aimed along your look, with FOV matched to that lab cone, then samples it with
the Lorentz map. Full pixel budget on what you actually see.

## Stack

- Static `index.html` + Three.js
- Lab-frame village (houses, landmarks, shape garden, poles/rings)
- Adaptive lab capture → Lorentz + Doppler post pass
- Guided Catmull-Rom street tour

## Develop

```bash
cd relativistic
python3 -m http.server 8765
# http://localhost:8765
```

## Versions

1. **v0.1–0.3** — village, look UX, shape garden  
2. **v0.4** — Lorentz cubemap attempt  
3. **v0.5** — **guided tour + adaptive high-res frustum** (quality fix)

Next: richer path, more landmarks, light-travel-time façades, night mode.

## License

MIT for code; cite Terrell, Penrose, Savage et al., Weiskopf when teaching.
