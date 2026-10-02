# Spinning Neutron Star: literature and formula check

This is the physics reference for `neutron-star.html`. It covers the effects the
renderer models, gives each one's size for the fiducial star, compares related
codes, lists measured pulsar parameters and checks the formulas the renderer
uses.

**Fiducial star:** M = 1.4 M☉, R_eq = 12 km, f = 700 Hz. Its derived quantities:

- r_s = 2GM/c² = 4.135 km, so u ≡ r_s/R = 0.3446
- x ≡ GM/(R c²) = u/2 = 0.1723
- Ω = 4398 s⁻¹ and Ω̄ = Ω (R_eq³/GM)^½ = 0.424, so Ω̄² = 0.180
- P = 1.43 ms and R/c = 40.0 µs

All numbers were recomputed with `scipy` (quadrature of the exact Schwarzschild integrals).

> **How the sources were checked (Oct 2026).** The egress proxy blocked arxiv.org, ar5iv,
> aanda.org, iopscience, ADS, pure.uva.nl, zenodo and semanticscholar, so I could not
> read the paper full texts. Each statement below is tagged with how it was checked:
> - **[code]**: verified against the public source of **X-PSI** (`xpsi-group/xpsi`) or
>   **bender** (`natj/bender`). Their comments cite the papers' equation numbers.
> - **[snip]**: taken from web-search abstract snippets.
> - **[der]**: derived here from the metric.
> - **[mem]**: from memory and not re-checked. Treat these as unverified.
>
> Equation numbers are given only when a code comment states them.

---

## 1. Physics stack (from simplest to most complete)

| Level | Spacetime | Star shape | What it captures | Used by |
|---|---|---|---|---|
| **S+D** (Schwarzschild + Doppler) | Schwarzschild | sphere | Light bending, gravitational redshift, SR Doppler, aberration and time delays. Rotation enters only through the surface velocity. | Miller & Lamb 1998; Poutanen & Gierliński 2003; Poutanen & Beloborodov 2006 (PB06) |
| **OS** (oblate Schwarzschild) | Schwarzschild | oblate R(θ), with a tilted normal | S+D plus the shape of the surface. Oblateness is the dominant rotational correction above about 300 Hz. | Morsink et al. 2007; AlGendy & Morsink 2014; **X-PSI**; the NICER pulse-profile pipelines |
| **Hartle–Thorne / Butterworth–Ipser O(Ω²)** | Metric with J (frame dragging) and quadrupole q | oblate | OS plus frame dragging ω(r), the quadrupole and the exact ZAMO kinematics | Cadeau et al. 2007; Psaltis & Özel 2014; Nättilä & Pihajoki 2018 (**bender**/Arcmancer); Monk-NS 2026 |
| **Full numerical** | RNS / LORENE stationary-axisymmetric solution | exact | Everything | Cadeau et al. 2007 (reference runs); Silva+21 and Ngo, Amason & Morsink 2026 (shape tests) |

The literature agrees on the size of the effects that the simple models leave out:

- **Neglecting oblateness** gives errors of about 5–30% in pulse profiles. Neglecting the
  **quadrupole** gives errors of about 1–5% at ~600 Hz (Psaltis & Özel 2014) [snip].
- **Frame dragging** has a negligible effect on bending and arrival times. It is enough to
  use Schwarzschild geodesics with an oblate surface (Cadeau et al. 2007) [snip].
- **Second-order quadrupole effects** cannot produce narrow spectral features for realistic
  parameters (Nättilä & Pihajoki 2018) [snip].
- **The three NICER codes** (X-PSI, Illinois–Maryland, Alberta) agree to ≤1.1–1.7% maximum
  fractional difference for complex hot-spot geometries (Choudhury et al. 2024) [snip].

---

## 2. Effects: formulas and their size for the fiducial star

### 2.1 Oblate surface (OS shape function) [code]

```
R(θ)/R_eq = 1 + o₂ cos²θ ,   o₂ = Ω̄² (−0.788 + 1.030 x)
Ω̄² = Ω² R_eq³/(GM) ,  x = GM/(R_eq c²)
```

- **Sources.** X-PSI `cellmesh/mesh_tools.pyx::radiusNormalised` cites "AlGendy & Morsink
  (2014), Eq. 20 and Table 1". Bender `julia/strig.jl::Rgmf` has the same form. The
  definitions of x and Ω̄ are Morsink et al. (2007), Eqs. (1)/(9) and (2)/(10).
- **R is the circumferential radius** (Schwarzschild r), and θ is colatitude.
- **Surface-normal tilt** (Morsink+07 Eq. 3, X-PSI `f_theta`):
  `f(θ) = (1/R)(dR/dθ)/√(1−r_s/R)`, with `cos γ = 1/√(1+f²)`. Here γ is the angle between the normal and the radial
  direction, measured in the **static orthonormal frame**.
- **Older fit.** Morsink+07 used a Legendre series `1 + a₀ + a₂P₂ + a₄P₄`, with
  `a₀ = −0.18ε+0.23xε−0.05ε²`, `a₂ = −0.39ε+0.29xε+0.13ε²` and `a₄ = 0.04ε−0.15xε+0.07ε²` (ε = Ω̄²).
  These coefficients are from bender's `Rgmf3`, labelled "Cadeau 2007" [code].
- **Fiducial values.**
  - o₂ = −0.110, so R_pole = 10.68 km and R_pole/R_eq = 0.890.
  - The maximum normal tilt is 8.3° (at θ ≈ 45°).
  - The older Legendre fit gives R_pole/R_eq = 0.918 for the same star. The two fits differ
    by about 3% in polar radius.
  - Ngo, Amason & Morsink (2026, arXiv:2608.27744) show that the current shape functions err
    by ≲1% in radius but by more in the limb projection.
- **X-PSI prior validity cuts** [code]:
  - `R_pole/R_eq ≥ 1.505 r_s/R_eq` (the pole stays outside the photon sphere).
  - `−3 o₂ ≤ 1` (the meridional cross-section stays convex).
- **Effective gravity**, if gravity darkening is wanted (AGM14 Eq. 21, Table 5) [code]:
  `g/g₀ = 1 + (c_e+d_e+f_e)Ω̄² sin²θ + (c_p+d_p+f_p−d₆₀)Ω̄² cos²θ + d₆₀Ω̄²|cosθ|`
  - `g₀ = GM/(R_eq²√(1−2x))`
  - `c_e = −0.791+0.776x`, `c_p = 1.138−1.431x`
  - `d_e = (−1.315+2.431x)Ω̄²x`, `d_p = (0.653−2.864x)Ω̄²x`, `d₆₀ = (13.47−27.13x)Ω̄²x`
  - `f_e = −1.172xΩ̄⁴`, `f_p = 0.975xΩ̄⁴`

### 2.2 Surface velocity [code + der]

Seen by a static observer (X-PSI `cellmesh/integrator.pyx` l.301):

```
β = Ω R sinθ / (c √(1 − r_s/R)) ,   γ = (1−β²)^−½
```

With frame dragging, the speed is measured by the zero-angular-momentum observer (ZAMO). This
is Cadeau+07, and bender `img.jl` "isoradial zamo":

```
β_Z = (Ω − ω) R sinθ / (c √(1 − r_s/R))
```

- **Fiducial values.**
  - At the equator, ΩR/c = 0.176, β = 0.2175 and γ = 1.0245.
  - With dragging, β_Z = 0.1907.

### 2.3 Doppler, aberration and intensity transfer [code + der]

```
δ = 1/(γ(1 − β cos ξ))           ξ = angle between photon and surface velocity (static frame)
cos α' = δ cos α                 comoving emission angle to the normal (PB06; X-PSI "ABB = mu*eta")
g ≡ E_obs/E_em = δ √(1 − r_s/R)  (X-PSI "Z = eta*Grav_z", observer at ∞)
I_E(obs) = g³ I'_{E/g}(α')       ⇒ a blackbody of T appears as a blackbody of gT
I_bol(obs) = g⁴ I'_bol
```

- **For a spherical star**, PB06 gives `cos ξ = −(sin α/sin ψ) sin i sin φ` [snip].
  X-PSI uses `+sinα sin i sinφ/sinψ` with `1+β cosξ`, which is the same thing with the
  opposite sign convention.
- **For the oblate star**, measure α from the *tilted normal*. This is X-PSI `mu`, which
  includes the cos γ and sin γ terms.
- **Flux formulas carry extra Jacobian factors.** The flux expressions (e.g. PB06
  `dF ∝ (1−u)^{Γ/2} δ^{Γ+3} I' cosα (dcosα/dcosψ) dS'/D²`) include `dS' = γ dS` and the
  lensing factor. An image-plane renderer must apply **only** `g³` (specific) or `g⁴`
  (bolometric) per pixel. The pixel solid angle supplies the rest.
- **Exact identity [der]** (Cunningham–Bardeen; it is what bender codes). Let `ℓ = L_z/E`
  be the conserved photon impact parameter about the spin axis. For a distant observer at
  inclination i, `ℓ = x_img sin i`. For any stationary axisymmetric metric:

  ```
  g = 1 / (u^t (1 − Ω ℓ/c)) = √(−g_tt − 2Ω g_tφ − Ω² g_φφ) / (1 − Ω ℓ/c)
  ```

  - In Schwarzschild, `Ωℓ/c = β cos ξ_static` exactly, so this equals δ√(1−u).
  - With dragging, `g = √(1−u)·√(1−β_Z²)/(1 − Ωℓ/c)`. The full Ω appears in the
    denominator and **only γ uses Ω−ω**.
- **Fiducial values.**
  - Approaching limb: δ = 1.247, g = 1.010 and g⁴ = 1.040.
  - Receding limb: δ = 0.802, g = 0.649 and g⁴ = 0.177.
  - The bolometric brightness contrast across the disc from Doppler alone is therefore about 5.9×.

### 2.4 Light bending [code + snip + der]

```
b = R sin α / √(1 − r_s/R)       ⇔  sin α = (b/R) √(1 − r_s/R)     (X-PSI rays.pyx: b/r_s = sinα/((r_s/R)√(1−r_s/R)))
ψ(b) = ∫_R^∞ dr/r² [1/b² − (1/r²)(1 − r_s/r)]^−½                 (exact, Pechenick et al. 1983)
1 − cos α ≈ (1 − cos ψ)(1 − r_s/R)                                (Beloborodov 2002; ~1% at R = 3r_s, worse for u ≳ 0.5)
```

| α (deg) | ψ exact | ψ Beloborodov |
|---|---|---|
| 30 | 37.29° | 37.29° |
| 60 | 76.23° | 76.28° |
| 80 | 104.73° | 105.11° |
| 90 (limb) | **120.64°** | 121.7° |

- **Visible fraction.** (1−cosψ_max)/2 = **0.755** (exact) vs 0.763 (Beloborodov).
- **Photon sphere.** It lies at 1.5 r_s = 6.2 km, inside the star, so there are no multiple
  images unless R < 1.5 r_s.

### 2.5 Geodesic integration in Cartesian form [der]

The orbit equation is `d²u/dφ² + u = (3/2) r_s u²` (u = 1/r). With `h = r² dφ/dλ = L`, this is
**exactly** equivalent to

```
d²x/dλ² = −(3/2) r_s h² x / r⁵ ,   h = |x × dx/dλ| ,   dt/dλ = E/(1 − r_s/r) ,  E = 1
```

λ is then the affine parameter, because `|dx/dλ|² − r_s h²/r³ = E²` reproduces
`(dr/dλ)² + (L²/r²)(1 − r_s/r) = E²`.

**Initial condition for a static camera at finite r_c.** Take a unit direction n in the
camera frame. The coordinate "velocity" is then

```
v = E [ n_r r̂ + n_⊥ / √(1 − r_s/r_c) ]
```

It is not n itself. Conversely, the static-frame direction at the surface is
`k ∝ v_r r̂ + v_⊥ √(1 − r_s/R)`.

### 2.6 Light-travel time and retardation [snip + der]

```
c Δt(b) = ∫_R^∞ dr/(1 − r_s/r) { [1 − (b²/r²)(1 − r_s/r)]^−½ − 1 }    (PB06; X-PSI rays.pyx "outLag")
c Δt ≈ R (1 − cos ψ)                                                  (straight-line approximation)
radial ray:  c t = Δr + r_s ln[(r₂ − r_s)/(r₁ − r_s)]                  (Shapiro log term)
```

PB06 also give a more accurate polynomial fit. I could not read it (paywall/egress), so it is not transcribed.

| α (deg) | Δt exact | Δt ≈ R(1 − cos ψ) | Rotation-phase lag at 700 Hz |
|---|---|---|---|
| 30 | 8.3 µs | 8.2 µs | 2.1° |
| 60 | 31.8 µs | 30.5 µs | 8.0° |
| 80 | 54.8 µs | 50.2 µs | 13.8° |
| 90 (limb) | **68.4 µs** | 60.3 µs | **17.2°** |

The limb delay is 4.8% of P. For comparison, 2πfR/c = 0.176 rad = 10.1°.

### 2.7 Moment of inertia and frame dragging [snip + code]

```
I ≈ (0.237 ± 0.008) M R² [1 + 4.2 (M/M☉)(km/R) + 90 ((M/M☉)(km/R))⁴]     (Lattimer & Schutz 2005)
  ≡ 0.237 M R² [1 + 2.84 β + 18.9 β⁴],  β = GM/(Rc²)                     (same; 4.2/1.4766 = 2.844)
I/(M R²) ≈ √x (1.136 − 2.53 x + 5.6 x²)                                  (AlGendy & Morsink 2014; X-PSI Spacetime.a)
ω(r) = 2 G J /(c² r³) ,  J = I Ω                                          (Lense–Thirring, O(Ω) exterior)
```

- **Moment of inertia.** I = 1.431×10⁴⁵ g cm² (LS05: I/MR² = 0.357). AGM14 gives 0.360, a
  difference of 0.7%.
- **Spin parameter.** χ = cJ/(GM²) = **0.365**.
- **Dragging rate at the surface.** ω(R) = 541 s⁻¹, or 86 Hz, which is ω/Ω = **0.123**.
- **Image twist from dragging.** About ωR/(2c) ≈ 0.011 rad = 0.6°. This is small, in line
  with Cadeau+07.
- **Effect on the redshift factor g [der].** The exact ZAMO formula (§2.3) changes g by a
  **uniform +0.57%** (g⁴ by +2.3%) at both limbs.

### 2.8 Kepler (break-up) frequency [snip]

```
f_K = C (M/M☉)^½ (R/10 km)^−3/2 ,  R = radius of the NON-rotating star of the same M
C = 1.045 kHz (Lattimer & Prakash 2004) ;  C = 1.08 kHz for NSs, 1.15 kHz for strange stars (Haensel+09, valid 0.5 M☉ < M < 0.9 M_max)
```

- **Fiducial value**, with 12 km taken as the static radius: f_K = 941 Hz (C = 1.045) or
  **972 Hz** (C = 1.08). So 700 Hz is about 0.72 f_K.
- **In terms of R_eq.** The test-particle orbital frequency at R_eq, (GM/R_eq³)^½/2π, is
  1650 Hz. That is exact for circular orbits in Schwarzschild coordinate time [der]. Mass
  shedding occurs at Ω̄ ≈ 1 (the Roche-model value; GR and the quadrupole shift it slightly) [mem],
  but R_eq swells to about 1.4 R_static first.

### 2.9 Atmosphere beaming [snip + code]

- **Electron-scattering atmosphere** (Chandrasekhar–Sobolev, pure Thomson). I(μ) ∝ H(μ) ≈ **1 + 2.06 μ**
  [snip]. Normalized, I(0)/I(1) = 0.327, against 0.344 from the exact H function [mem]. The
  Eddington approximation is 1 + 1.5 μ.
- **Hydrogen atmospheres** (NSATMOS, Heinke+06; **NSX**, Ho & Lai 2001 / Ho & Heinke 2009) are
  more strongly and energy-dependently limb-darkened, and are what NICER fits use.
- **X-PSI's parametric option** [code] (`hot_wrapper.pyx`):
  `I = I_BB (1 + a E^c μ + b E^d μ²)`, optionally normalized by
  `0.5/(0.5 + a E^c/3 + b E^d/4)`.
- **Comptonized spectra.** PB06 / Poutanen & Gierliński 2003 use `I' ∝ E^{1−Γ}(1 − h μ')`,
  with h ≈ 0.5–0.7 [mem].

---

## 3. Codes and papers

| Code / paper | What it does | Public? |
|---|---|---|
| **bender** (Nättilä & Pihajoki 2018, arXiv:1709.07292) | Ray traces rapidly rotating oblate NSs in a Butterworth–Ipser O(Ω²) metric: bending, frame dragging, quadrupole, Doppler, aberration and time delays. Produces images, spectra and pulse profiles. Has `tools/movie.sh` (ffmpeg frame-to-mp4). | Yes, `github.com/natj/bender` (Python + Julia + C++) |
| **Arcmancer** (Pihajoki+2018, arXiv:1804.04670) | General-purpose C++/Python library for geodesics and polarized radiative transfer in arbitrary spacetimes. It is bender's back end. | Yes (bitbucket) [mem] |
| **Psaltis & Özel 2014** (arXiv:1305.6615) | Pulse profiles in Hartle–Thorne, with an oblate surface and quadrupole | Algorithm described; code not public [mem] |
| **X-PSI** (Riley, Watts+; `xpsi-group/xpsi`) | OS (Schwarzschild + AGM14 shape), Doppler, aberration, lags, NSX/BB atmospheres, polarization, Bayesian inference. **Animated specific-intensity sky maps since v0.7 (2020)**. No frame dragging. | Yes (Python/Cython) |
| **Choudhury+2024** (ApJ 975, 202; arXiv:2406.07285) | Compares X-PSI, IM and Alberta on 5 complex spot geometries; max differences 1.13–1.67%. The Zenodo package (10.5281/zenodo.13133749) has "animation sets showing the spot geometries as the star rotates". | Data and notebooks yes |
| **gpu_ppm** (arXiv:2510.07764) | CUDA pulse-profile generator for an oblate star with lensing tables, lags, Doppler/aberration and NSX | Yes, `github.com/zhoutz/gpu_ppm` |
| **Monk-NS** (arXiv:2603.20870) | Monte Carlo GR radiative transfer from NS surfaces in Kerr or Hartle–Thorne, with polarization | [snip] |
| **PB06** (astro-ph/0608663), **Beloborodov 2002** (astro-ph/0201117) | Analytic S+D: cosine bending formula, δ, cos α′ = δ cos α, lag formulas | Analytic |
| **Poutanen & Gierliński 2003** (MNRAS 343, 1301) | S+D model for SAX J1808 | Analytic |
| **Cadeau+2007** (ApJ 654, 458; astro-ph/0609325) | Exact numerical metrics compared with approximations. Conclusion: oblateness dominates and dragging is negligible for light curves. | No |
| **Morsink+2007** (ApJ 663, 1244; astro-ph/0703123) | Defines the OS approximation | No |
| **AlGendy & Morsink 2014** (ApJ 791, 78; arXiv:1404.0609) | Universal fits for shape, gravity, I and q | Fits |
| **DNGR** (James+2015, arXiv:1502.03808) | Kerr ray-bundle renderer for *Interstellar*. Its appendix gives the camera-in-FIDO (fiducial observer) frame aberration and Doppler. | No |
| **GRay** (Chan+2013, arXiv:1303.5057) | GPU (CUDA) Kerr geodesic integrator in Cartesian Kerr–Schild coordinates | Yes [mem] |
| **RAPTOR** (Bronzwaer+2018, arXiv:1801.10452) | GPU/CPU GR radiative transfer in arbitrary metrics, for GRMHD imaging | Yes [mem] |
| **Geokerr** (Dexter & Agol 2009, arXiv:0903.0620) | Semi-analytic Kerr geodesics via elliptic integrals | Yes (Fortran) [mem] |
| **Real Time Relativity** (Savage+2007, physics/0701200) | GPU first-person SR (aberration, Doppler, headlight) via cube-map environment mapping. No gravity. | Yes (Windows binary) |
| **OpenRelativity** (MIT Game Lab) | Unity SR toolkit: Lorentz contraction in shaders, Doppler colour shift, time dilation. Repo has no Schwarzschild or Kerr code [code]. | Yes (GitHub) |
| **Kraus 1998 / spacetimetravel.org**; **Nemiroff 1993** (AJP, astro-ph/9312003) | Ray-traced images and movies of *non-rotating* NSs in Schwarzschild: lensing, sometimes redshift | Movies online |

---

## 4. Source parameters

| Source | f (Hz) | M (M☉) | R_eq (km) | Inclination i | Spots |
|---|---|---|---|---|---|
| **PSR J0030+0451** | 205.53 | Riley+19 (ST+PST): **1.34 +0.15/−0.16**. Miller+19: 1.44 +0.15/−0.14. Vinciguerra+24 (ST+PDT): 1.40 [snip] | **12.71 +1.14/−1.19** (Riley+19). 13.02 +1.24/−1.06 (Miller+19). 11.71 +0.88/−0.83 (Vinciguerra+24 ST+PDT) [mem]. PDT-U: ~1.7 M☉ / 14.4 km | Search snippets conflict (~1.0–1.23 rad). **Verify from Riley+19 Table.** Updated ML solutions: i ≈ 74° (ST+PDT), 82° (PDT-U) [snip] | All spots in the hemisphere *away* from the observer. Miller+19 oval colatitudes θ₁ = 2.25 rad (129°), θ₂ = 2.42 rad (138°) [snip]. Riley+19: a small circular spot plus a crescent. Six-year update: arXiv:2602.23743. |
| **PSR J0740+6620** | 346.53 | **2.08 ± 0.07** (Fonseca+21). 2.073 ± 0.069 (Salmi+24) | **12.39 +1.30/−0.98** (Riley+21). 13.7 +2.6/−1.5 (Miller+21). **12.49 +1.28/−0.88** (Salmi+24) | Orbital ≈ 87.4–87.6° (Shapiro delay; Cromartie+20, Fonseca+21) | Two spots near the equator region [mem] |
| **PSR J0437−4715** | 173.69 | **1.418 ± 0.037** (Reardon+24 prior) | **11.36 +0.95/−0.63** (Choudhury+24) | Orbital 137.506° ± 0.016° (Reardon+24), i.e. 42.49° from the other pole | Two overlapping-circle regions (CST+PDT) [snip] |
| **PSR J1748−2446ad** (Ter 5) | **716.36** (Hessels+06; fastest known) | unknown | < 16 km if M < 2 M☉ (spin limit) | n/a | Radio only: no thermal X-ray pulse modelling |

---

## 5. Novelty assessment (brief search, Oct 2026)

**What already exists**

- **Offline ray-traced animations of rotating oblate NSs with Doppler, aberration, lensing
  and time delays.**
  - X-PSI animated sky maps (OS, so no frame dragging).
  - bender's image pipeline and `movie.sh` (includes frame dragging and quadrupole).
  - Both are monoscopic and made for a fixed distant observer. Effects can be switched only
    by editing code or configuration, not as a UI ladder.
- **Choudhury+24 Zenodo animations.** These show hot-spot *geometries* rotating for the
  code-comparison test cases. I could not confirm whether they are relativistically
  ray-traced images. Treat them as geometry visualizations.
- **NASA Goddard (Conceptual Image Lab / SVS 13240, 20267; Dec 2019 J0030 release).** Artist
  animations show the far-side hot spots brought into view by light bending. They are
  conceptual. I found no documentation that they are quantitative ray traces with Doppler or
  aberration.
- **Non-rotating NS lensing movies.** Kraus 1998 (spacetimetravel.org) and Nemiroff 1993.
- **Real-time WebGL Kerr black-hole tracers** (many on GitHub) and **SR games** (Real Time
  Relativity, A Slower Speed of Light / OpenRelativity) cover lensing, or SR
  Doppler/aberration, but not a rotating NS surface.

**What I did not find:** any interactive, real-time, browser or stereo renderer of a *rotating*
NS that adds the effects one at a time, with each one switchable. The effects in question are
light-travel-time retardation, aberration, Doppler, beaming, bending, redshift, Shapiro delay,
oblateness and frame dragging, with a live pulse profile alongside.

**Suggested wording:** *"To our knowledge, the first interactive, real-time (WebGL) and
stereoscopic ray-traced visualization of a rapidly rotating neutron star in which each
relativistic effect can be switched on individually. Offline ray-traced sky-map animations
exist in research codes (X-PSI, bender)."*

- Avoid "first ray-traced movie of a rotating NS". That is false: X-PSI and bender both
  produce them.
- Avoid "with all effects", because there is no quadrupole in the metric.

---

## 6. Discrepancies vs renderer assumptions (`neutron-star.html`)

> **Status in v1.13.0: all fixed.**
> - **A:** `shadeHit` now uses g = N√(1−β_Z²)/(1 − β_Ω cos ξ), and the Numbers panel uses the same δ.
> - **B:** the tangential part of the normal is divided by √(1−r_s/r).
> - **C:** C = 1.08 kHz, labelled "≈".
> - **D:** the caption calls contraction a convention.
> - **F:** the caption credits AlGendy & Morsink 2014 and says that NICER fits omit frame dragging.
>
> Line numbers below refer to the pre-fix draft.

### Verified correct

| # | Assumption | Status |
|---|---|---|
| 1 | o₂ = Ω̄²(−0.788 + 1.030x), with Ω̄² = Ω²R_eq³/GM and x = GM/(R_eq c²) | **Correct.** Coefficients are identical to X-PSI and bender. Attribute to **AlGendy & Morsink 2014 (Eq. 20, Table 1)**. Morsink+07 defined OS, x and Ω̄ but used the Legendre fit. |
| 2 | β = ΩR sinθ/(c√(1−r_s/R)) | **Correct** (X-PSI l.301). |
| 3 | δ = 1/(γ(1−β cos ξ)), cos α′ = δ cos α, I = g³I′(E/g), g = δ√(1−u), bolometric g⁴ | **Correct** (X-PSI Z = ηΓ, ABB = μη). The extra factor `/√(1−r_s/r_cam)` (l.381) is correct for a static camera at finite distance. |
| 4 | sin α = (b/R)√(1−u); Beloborodov formula; exact ψ integral | **Correct.** Beloborodov over-predicts ψ_max by 1.1° here. |
| 5 | Cartesian `a = −(3/2) r_s h² x/r⁵`, `dt/dλ = 1/(1−r_s/r)` | **Exact**, with λ the affine parameter (§2.5). The camera-velocity rescaling at l.277 and the static-frame direction at l.360 are also correct. |
| 6 | Retardation reference `Tref = Δr + r_s ln[(r_c−r_s)/(R−r_s)]` | **Correct** (exact radial-ray time). |
| 7 | I = 0.237MR²[1 + 4.2(M/R) + 90(M/R)⁴]; ω = 2GJ/(c²r³) | **Correct** (≡ 2.84β + 18.9β⁴). J in geometric km² is κ(r_s/2)R²Ω_km, as the code has it. |
| 9 | (1 + 2.06μ)/3.06 | **Correct** as the electron-scattering approximation. Note that NICER fits use hydrogen atmospheres (NSX). |

### Problems found

**A. (HIGH) Frame dragging is applied in the wrong place in the Doppler factor (l.368–372).**

- **What the code does.** It sets β = (Ω−ω)ρ/√(1−u) and then uses `δ = 1/(γ(1 − β k·e_φ))`
  with k in the **static** frame.
- **Why that is wrong.** The ZAMO speed must be paired with the ZAMO-frame cos ξ. The exact
  result (§2.3) is

  ```
  δ_eff = √(1−β_Z²) / (1 − β_Ω k·e_φ)
  β_Ω = Ωρ/(c√(1−u))   (full Ω, static frame)
  β_Z = (Ω−ω)ρ/(c√(1−u))   (enters only through γ)
  ```

  Use the same δ_eff in cos α′ = δ_eff cos α.
- **Size of the error at the fiducial star.**
  - The current code changes g at the limbs by **−2.8% (approaching) and +2.8% (receding)**.
    That is ∓11% in g⁴, and it weakens the Doppler asymmetry.
  - The correct dragging effect is a **uniform +0.57%** (+2.3% in g⁴).
  - So the "frame dragging" step currently shows a spurious and wrongly signed brightness change.
- **The numbers panel (l.638, l.701).** It shows the ZAMO speed β_GR. That is fine as a label,
  but the displayed δ = 1/(γ(1∓β_GR)) has the same issue.

**B. (LOW) The oblate-surface normal ignores the √(1−u) factor (l.363).**

- The normal is the Euclidean gradient of r − R(θ). That gives a tilt tan γ = R′/R instead of
  Morsink's f = (R′/R)/√(1−u).
- At the fiducial star, the maximum tilt is 6.8° instead of 8.3°, which is a sub-percent
  change in cos α.
- **Fix:** scale the tangential part of n by 1/√(1−r_s/r) before normalizing, since k is in
  the static orthonormal frame.

**C. (LOW/MED) The Kepler limit uses R_eq in a formula defined for the non-rotating R (l.631).**

- Haensel+09 recommend **C = 1.08 kHz**, not 1.045 kHz.
- Because R_eq > R_static, plugging in R_eq slightly underestimates f_K (conservative). Label
  it as "≈ estimate".
- **Alternative:** clamp on Ω̄ (mass shedding at Ω̄ ≈ 1; AGM14 fits are trustworthy well below that).

**D. (INFO) The "length contraction" toggle (l.311–318, l.379) narrows painted features by 1/γ along e_φ.**

- This is a defensible Ehrenfest-style convention (features have a fixed proper size
  co-rotating).
- Research codes (X-PSI) define spot sizes as **coordinate** angular radii in the static frame
  and add the γ only via `dS′ = γ dS` in flux integrals.
- Say this explicitly in the UI text, so that it is not read as an observable "contraction".

**E. (INFO) The dragging rotation of rays (l.300, l.305: rotate x and v by −ω dt each step) is a leading-order gravitomagnetic approximation.**

- Its size (~0.6°) is consistent with §2.7.
- It leaves h unchanged and has no quadrupole term. Both are acceptable, per Cadeau+07 and
  Psaltis & Özel.

**F. (INFO) The "Everything" text (l.517) cites "Morsink et al. 2007" for the bulge.**

- Better: "oblate Schwarzschild (Morsink+07) with the AlGendy & Morsink 2014 shape fit".
- "The full stack used for NICER pulse fits" is accurate for OS, but NICER fits do **not**
  include frame dragging. Rephrase as "NICER's OS stack plus frame dragging".

---

## 6b. Magnetic field model (added in v1.15)

**What the renderer draws**

1. **Rotating point dipole in vacuum, exact retarded field.**
   - The field, with c = 1 and the magnetic moment m evaluated at the retarded time t − r:

     ```
     B = [3n(n·m) − m]/r³ + [3n(n·ṁ) − ṁ]/r² + [n(n·m̈) − m̈]/r
     ```

     (Jackson §9.3, the magnetic analogue).
   - Outside the star this matches Deutsch's (1955) vacuum solution, apart from finite-size multipoles.
   - The pattern is stationary in the frame rotating with Ω. Lines sweep back and wind into a spiral beyond the light cylinder R_LC = c/Ω. That is 67 km at 716 Hz.
2. **Schwarzschild dipole near the star.** The static term is replaced by the Schwarzschild dipole (Wasserman & Shapiro 1983):
   - Flux function Ψ = sin²θ F(r), with F(r) = −(3r²/(8M³))[ln(1 − 2M/r) + 2M/r + 2M²/r²].
   - Equivalently F(r) = (3/r) Σ_{k≥3} (r_s/r)^{k−3}/k, which tends to 1/r far from the star.
   - At the surface of a 1.4 M☉, 12 km star the radial field is about 1.36× the flat-space value.
3. **Viewing the lines.** They are seen through the same physics as the surface:
   - Each point's image is found from a fan of Binet-equation rays: u'' + u = 3Mu² in the plane through the eye, the centre and the point.
   - The point is placed at its retarded emission time t_obs − (T_ray − T_ref).
   - Points behind the star are hidden unless bent rays reach them.

**Two separate switches (v1.16)**

- **Retarded B field (Maxwell):** the field itself.
- **Light-travel time:** only when each piece is seen.

Numerical check at v_eq = 0.5c, where R_LC = 2R = 24 km:

| r / R_LC | \|B_ret − B_static\| / \|B_static\| | ∇·B · r / \|B\| |
|---|---|---|
| 0.5 | 0.09 | 5e-8 |
| 1.0 | 0.39 | 1e-8 |
| 2.0 | 1.72 | 2e-9 |
| 4.0 | 7.4 | 5e-10 |

- **Near and far zone.** Near the star the corrections are second order, O((Ωr)²). Beyond R_LC the field is transverse 1/r radiation of magnitude ≈ μΩ² sinα/(c² r). Its Poynting flux is the magnetic-dipole spin-down luminance, L = 2μ²Ω⁴ sin²α / (3c³).
- **The "off" state.** The instantaneous (magnetostatic) field is only an approximation for r ≪ R_LC. Maxwell's equations always give the retarded field.

**What it leaves out**

- **Plasma.** Real pulsars have plasma-filled, force-free magnetospheres (Goldreich & Julian 1969; Contopoulos, Kazanas & Fendt 1999; Spitkovsky 2006). There the field lines that cross the light cylinder open into a wind with a current sheet. The vacuum picture keeps the near zone right but not the open-field geometry.
- **Frame dragging.** Its effect on the field (Muslimov & Tsygan 1992) is ignored.
- **Combining GR with retardation.** The GR correction is evaluated with the retarded moment, as a near-zone approximation.

## 7. References

(arXiv IDs for Lattimer & Schutz, Lattimer & Prakash, Poutanen & Gierliński, Fonseca+21 and Hessels+06 are from memory [mem]; the rest appeared in search results.)

- Nättilä & Pihajoki 2018, A&A 615, A50 — https://arxiv.org/abs/1709.07292 ; code https://github.com/natj/bender
- Pihajoki et al. 2018 (Arcmancer), ApJ 863, 8 — https://arxiv.org/abs/1804.04670
- Psaltis & Özel 2014, ApJ 792, 87 — https://arxiv.org/abs/1305.6615
- X-PSI — https://github.com/xpsi-group/xpsi , docs https://xpsi-group.github.io/xpsi/
- Choudhury et al. 2024, ApJ 975, 202 — https://arxiv.org/abs/2406.07285 ; Zenodo https://zenodo.org/records/13133749
- James, von Tunzelmann, Franklin & Thorne 2015, CQG 32, 065001 (DNGR) — https://arxiv.org/abs/1502.03808
- Chan, Psaltis & Özel 2013 (GRay) — https://arxiv.org/abs/1303.5057
- Bronzwaer et al. 2018 (RAPTOR) — https://arxiv.org/abs/1801.10452
- Dexter & Agol 2009 (Geokerr) — https://arxiv.org/abs/0903.0620
- McGrath, Savage et al. 2007 (Real Time Relativity) — https://arxiv.org/abs/physics/0701200 ; OpenRelativity https://github.com/MITGameLab/OpenRelativity
- Beloborodov 2002, ApJ 566, L85 — https://arxiv.org/abs/astro-ph/0201117
- Poutanen & Beloborodov 2006, MNRAS 373, 836 — https://arxiv.org/abs/astro-ph/0608663
- Cadeau, Morsink, Leahy & Campbell 2007, ApJ 654, 458 — https://arxiv.org/abs/astro-ph/0609325
- Morsink, Leahy, Cadeau & Braga 2007, ApJ 663, 1244 — https://arxiv.org/abs/astro-ph/0703123
- AlGendy & Morsink 2014, ApJ 791, 78 — https://arxiv.org/abs/1404.0609
- Silva, Pappas, Yunes & Yagi 2021, PRD 103, 063038 — https://arxiv.org/abs/2008.05565
- Ngo, Amason & Morsink 2026 (shape-function errors) — https://arxiv.org/abs/2608.27744
- Poutanen & Gierliński 2003, MNRAS 343, 1301 — https://arxiv.org/abs/astro-ph/0303084
- Lattimer & Schutz 2005, ApJ 629, 979 — https://arxiv.org/abs/astro-ph/0411470
- Lattimer & Prakash 2004, Science 304, 536 — https://arxiv.org/abs/astro-ph/0405262
- Haensel, Zdunik, Bejger & Lattimer 2009, A&A 502, 605 — https://arxiv.org/abs/0901.1268
- Riley et al. 2019 (J0030) — https://arxiv.org/abs/1912.05702 ; Miller et al. 2019 — https://arxiv.org/abs/1912.05705
- Vinciguerra et al. 2024 (J0030 update) — https://arxiv.org/abs/2308.09469 ; six-year update https://arxiv.org/abs/2602.23743
- Riley et al. 2021 / Miller et al. 2021 (J0740); Salmi et al. 2024 — https://arxiv.org/abs/2406.14466 ; Fonseca et al. 2021 — https://arxiv.org/abs/2104.00880
- Choudhury et al. 2024 (J0437) — https://arxiv.org/abs/2407.06789 ; Reardon et al. 2024 — https://arxiv.org/abs/2407.07132
- Hessels et al. 2006 (716 Hz), Science 311, 1901 — https://arxiv.org/abs/astro-ph/0601337
- Kraus 1998, light deflection near neutron stars — https://www.spacetimetravel.org/licht ; Nemiroff 1993 — https://arxiv.org/abs/astro-ph/9312003
- gpu_ppm — https://github.com/zhoutz/gpu_ppm (arXiv:2510.07764) ; Monk-NS — https://arxiv.org/abs/2603.20870
- NASA SVS NICER J0030 — https://svs.gsfc.nasa.gov/13240 ; NICER neutron-star animations https://svs.gsfc.nasa.gov/20267
