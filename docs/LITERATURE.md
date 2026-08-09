# Literature: what do you *see* at near-light speed?

This project is about the **visual appearance** of a 3D village when the camera
moves at a large fraction of *c* — not just “length contraction on a textbook
diagram.”

## 1. The central distinction

| Concept | Meaning | What the eye / camera records |
|--------|---------|--------------------------------|
| **Length contraction** | Proper lengths of objects in relative motion shrink along the boost (Lorentz) | *Not* simply a squashed photograph |
| **What you see** | Light that arrives simultaneously at the eye | Mixture of geometry, finite *c*, and Doppler |

Classic result (Terrell 1959; Penrose 1959): a relativistically moving sphere
still *looks* circular; a cube appears **rotated** (Terrell–Penrose rotation),
not merely flattened. Length contraction is real in the rest-frame of the
ruler; the optical appearance is dominated by **which light rays arrive
together**.

Key papers / reviews:

- J. Terrell, *Invisibility of the Lorentz Contraction*, Phys. Rev. **116**, 1041 (1959).
- R. Penrose, *The Apparent Shape of a Relativistically Moving Sphere*, Math. Proc. Camb. Phil. Soc. **55**, 137 (1959).
- D. Weiskopf et al., surveys of special-relativistic visualization (SciViz / IEEE Viz family).
- C. M. Savage & A. C. Searle, *Visualising Special Relativity* — ray-tracer “Backlight”; finite light travel time + Doppler + aberration.
- Savage, Searle & McPhedran, *Real Time Relativity*, arXiv:physics/0607223 — GPU, photon 4-vectors, free-flight through a virtual world.

Related demos / systems: *Through Einstein’s Eyes*, *Real Time Relativity* (ANU),
*OpenRelativity* (MIT Game Lab), Weiskopf image-based cubemap methods, “Einstein’s
Playground” planetarium show.

## 2. Physical effects that must enter a “what you see” renderer

### 2.1 Relativistic aberration

Direction of light rays depends on the boost between the lab and the camera.
As β → 1, the forward sky **compresses** into a narrowing cone (“searchlight
tunnel”); the rear expands. This is the dominant *geometric* warping of the
village as you fly down a road.

Vector form (boost of the observer at velocity **β** = **v**/*c* relative to the
lab; **n** unit propagation direction of a ray in one frame → **n′** in the
other) is the standard decomposition into components parallel / perpendicular
to **β** with factors γ and (1 ± β · n). See RTR / any SR textbook “aberration
of light.”

### 2.2 Light travel time (retardation)

You never photograph a single simultaneous 3D slice of an extended house.
Different surface points emit photons that arrive at the same reception event
from **different emission times**. That is the microscopic origin of Terrell
rotation for opaque bodies.

Full offline ray tracers (Backlight, academic papers) integrate this.
Real-time systems often approximate with **instantaneous** geometry + aberration
(still stunning, and pedagogically clear).

### 2.3 Relativistic Doppler shift + headlight effect

Frequency transforms with a Doppler factor *D*. Approaching surfaces blueshift
and brighten; receding surfaces redshift and dim. Often intensity is scaled by
a power of *D* (headlight / searchlight effect). This is what paints the
village in cold blue ahead and warm red behind.

### 2.4 Time dilation

Clocks on porches tick slowly in the lab when the traveler is fast — usually
shown as HUD / side clocks, not as mesh warping.

## 3. How literature renders this (taxonomy)

From Weiskopf’s survey and RTR:

1. **Object-space polygon methods**  
   Lorentz-transform vertices in a vertex shader. Fast. Good for multiple
   differently moving objects. Harder for correct light-travel-time.

2. **Image-based / cubemap methods** (Weiskopf and followers)  
   - Render the world to a cubemap (or environment) at the camera *position*
     as if at rest in the lab.  
   - For each screen pixel, take the camera-frame ray, **inverse-aberrate** to
     a lab direction, sample the cubemap.  
   - Doppler as a post color warp.  
   Excellent for a **static village** + fast traveler — our first choice.

3. **Full relativistic ray tracing**  
   Trace null geodesics (in SR: straight lines with Lorentz-transformed
   directions) with emission-time constraints. Highest fidelity; offline or
   heavy GPU.

4. **Hybrid local ray tracing**  
   Polygon distortion + local rays for reflections / accurate silhouette.

## 4. Design choice for *this* project

**Village at rest in the lab.** Traveler (you) moves with controllable **β**
(where |β| = 1 would be *c*; we cap near 0.99). Motion free in **x, y, z**
(roads + altitude).

**Phase 1 (shipping now):**  
Three.js village + free flight + **cubemap aberration** + Doppler/headlight +
HUD that teaches the difference between naive “squash” and true optics.

**Phase 2:**  
Optional light-travel-time for façades (Terrell rotation of house cubes more
explicitly); spectral Doppler on textured bricks; path recording; VR.

**Phase 3:**  
Compare modes: (A) pure length contraction of meshes, (B) aberration only,
(C) full optical stack — so the student *sees* why textbooks and photographs
disagree.

## 5. Coordinates and the “z = 1 is light speed” metaphor

We use **β = |v|/c ∈ [0, 1)** as the physical speed parameter.  
UI copy: “β → 1 is light speed; we never reach 1.”  

World axes:

- **x, y** — ground plane roads of the village  
- **z** — altitude (fly above roofs)  
- **Velocity vector** can point any direction in 3D (not only along a road)

The boost for aberration is always along the **instantaneous velocity**, not
along the look direction (unless the user locks “look = thrust”).

## 6. References (starting set)

1. Terrell (1959); Penrose (1959) — optical appearance ≠ simple contraction.  
2. Savage, Searle & McPhedran, *Real Time Relativity*, Eur. J. Phys. / arXiv:physics/0607223.  
3. Weiskopf et al., image-based special-relativistic visualization; SciViz survey chapter.  
4. MIT OpenRelativity / Game Lab materials.  
5. Compadre “Through Einstein’s Eyes.”  
6. Hsiung, Thibadeau, et al. early relativistic ray tracing (1990s).  
7. Recent GPU local-ray / hybrid SR visualization papers (2000s–2020s).

Internal rule for the product: **numbers argue; eyes decide** — every effect
toggle must change the picture in a way a careful viewer can name.
