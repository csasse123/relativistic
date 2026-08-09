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

## Develop

```bash
cd relativistic && python3 -m http.server 8765
```

## Versions

- **v0.5** — guided tour; adaptive frustum (too zoom-like)  
- **v0.6** — free look + velocity-fixed boost + full-sphere capture  

## License

MIT · cite Terrell, Penrose, Savage et al., Weiskopf, OpenRelativity when teaching.
