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

## Orbital Heat Budget (v0.8) — `space-dc/`

Live: [csasse123.github.io/relativistic/space-dc](https://csasse123.github.io/relativistic/space-dc/)

3D thermal model of a MW-class data center satellite (solar array + radiator keel + compute core) in three orbits:

| Orbit | What it shows |
|------|---------------|
| LEO 550 km · 53° | ~36 min shadow every ~96 min → ~5,000 thermal cycles/yr, batteries or throttling |
| Dawn–dusk SSO 650 km (Google Suncatcher) | near-constant sun, constant full heat load, June eclipse season |
| GEO | eclipses only near equinoxes, cold sky for radiators, ~240 ms latency |

Views: **Satellite** (false-colour IR or visible, coolant flow, exaggerated CTE expansion), **Orbit** (shadow cylinder, sunlit/eclipse arcs), **Cluster** (hex formation, laser links, radiator view-factor penalty).
Live lumped thermal sim (array, radiator, bypassed panels, GPU), module sizing per MW and per GW, briefing tabs on radiators, cycling/CTE, solar panels, coupling, and what is solved vs open.

## Develop

```bash
cd relativistic && python3 -m http.server 8765
```

## Versions

- **v0.5** — guided tour; adaptive frustum (too zoom-like)  
- **v0.6** — free look + velocity-fixed boost + full-sphere capture  
- **v0.7** — prebaked village light field  
- **v0.8** — new `space-dc/` Orbital Heat Budget: space data center thermal cycling in 3D  

## License

MIT · cite Terrell, Penrose, Savage et al., Weiskopf, OpenRelativity when teaching.
