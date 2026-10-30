# Five Atoms Thick — Suno sheet

Quantum tunneling everywhere. The walls inside every chip are now so thin that electrons go straight through them. That leak sets the limit on CPUs, GPUs and phones, it is how your phone's flash memory saves photos, and it is why the Sun shines. Schrödinger's cat is the face of the song: here and not here until you open the box.

Same recipe as Thirty-Two Clocks: deadpan spoken verses, a sung trance chorus, 132 BPM electroclash.

## Suno settings (v6)

| Setting | Value |
|---|---|
| Mode | **Custom** |
| Model | **v6** |
| Variety | **Off** |
| Duration | **1:40**. The lyrics fill about 1:35. A shorter slider hard-cuts the outro. |
| Max Mode | On if you have credits |
| Title | `Five Atoms Thick` |

### Style (paste as-is)

```
female vocals, deadpan spoken-word verses, soaring sung trance chorus, dark electroclash, 132 BPM, B minor, analog FM bass, supersaw lead, arpeggiator, glitch stutter fx, riser sweeps, punchy four-on-the-floor kick, tape hiss intro, cold clipped delivery, euphoric lift
```

### Exclude Styles

```
male vocals, rap, acoustic guitar
```

## Lyrics (paste as-is)

```
[Intro]
[Spoken Word]
Knock knock.
Who's there?
Both.
There's a wall in your phone. A few atoms thick.
The electrons walk right through.

[Build]
[Spoken Word]
Leak.

[Drop]

[Verse 1]
[Spoken Word]
Billions of switches. Every one a wall.
Close the gate. The current should stop.
It doesn't.
An electron is not a ball. It's a wave.
And a wave doesn't stop at a wall. It fades.
Halve the wall. Fifty million times the leak.
Your photos? Electrons pushed through glass.

[Pre-Chorus]
[Spoken Word]
Open the box.

[Chorus]
Through the wall, through the wall, and it never knocks
Here and not here like the cat in the box
I go through walls you said I couldn't climb
Five atoms thick and I'm through every time

[Verse 2]
[Spoken Word]
The Sun is too cold to burn.
Fifteen million degrees. Not enough.
Protons tunnel anyway.
That's daylight.
A needle one atom sharp.
A current through nothing.
That's how we see atoms.

[Chorus]
Through the wall, through the wall, and it never knocks
Here and not here like the cat in the box
I go through walls you said I couldn't climb
Five atoms thick and I'm through every time

[Outro]
[Spoken Word]
Every phone. Every chip. Every star in the sky.
You're reading this on a leak.
Open the box.

[End]
```

Tips:
- Make 4–6 takes. Keep one where the verses are spoken, the chorus is sung, and **both** choruses are there. The lyrics are short so Suno shouldn't drop sections this time.
- If a take sings the verses, put `deadpan spoken-word verses` at the front of Style a second time.
- No parentheses (Suno sings them).
- Upload the chosen mp3 here and I'll transcribe it and lock every cut to the real words and kicks.

## Beat map

After export: `python3 tools/beatmap.py assets/five-atoms-thick.mp3 --vocals vocals.wav` writes tempo, beats, downbeats, kicks, section starts and vocal phrase starts to `assets/five-atoms-thick.beats.json`. Whisper word times go on top.

## Planned structure (132 BPM, 1 bar ≈ 1.82 s, about 50 bars)

| Section | Bars | Planned time | Picture |
|---|---|---|---|
| Intro (spoken, no beat) | 8 | 0:00–0:14 | Box on a lab bench, cat's eyes in the gap → macro into the cat's eye → phone in a hand, dive into the chip |
| Build "Leak." | 2 | 0:14–0:18 | Wafer in a cleanroom, rush into the die |
| Drop | 4 | 0:18–0:25 | Fast montage on the kick: fab rails, GPU hall, die macro, gate-all-around transistor explodes open |
| Verse 1 | 8 | 0:25–0:40 | 3D: a glowing particle bounces off a dark wall, slow push in. Then electron wave packet hits the gate barrier, part of it comes out the other side. Live formula T ≈ e^(−2κd) with d sliding 2 → 1 nm and the counter climbing to ×50,000,000. Flash cell: electrons tunnel through the oxide into the trap layer, photos fill a phone |
| Pre-Chorus | 2 | 0:40–0:43 | The wave starts to ripple and the wall turns see-through. Paw on the lid, light leaking through the cracks |
| Chorus | 8 | 0:43–0:58 | Downbeat: whip pan to the far side of the wall, the wave weaker but still there. Club / crowd with phones up, ghosted cat walking through a laser wall, Schrödinger equation iħ ∂ψ/∂t = Ĥψ falling as rain |
| Verse 2 | 6 | 0:58–1:09 | The Sun (SDO-style), proton–proton Coulomb barrier, tunneling probability graph. Then the STM tip scanning single atoms |
| Chorus | 8 | 1:05–1:20 | Constellation of chips: phone, GPU rack, SSD, quantum-computer chandelier, Sun |
| Outro | 4 | 1:20–1:30 | The box opens: empty, only glowing static. End card |

## Physics behind every line

Fact-checked against the sources listed. Where a number is rounded for the lyric, the note says so.

| Line | Value |
|---|---|
| Knock knock. Who's there? Both. | Superposition: like the cat, the electron is on both sides of the wall until you look. Sets up the chorus "it never knocks". |
| A wall a few atoms thick | The gate insulator separates the control gate from the channel. Intel's 90 and 65 nm chips used 1.2 nm SiO₂, about **5 atomic layers** (EDN, bit-tech). Since 2007 (Intel 45 nm, hafnium high-k/metal gate) the oxide is physically thicker but electrically equivalent to about 1 nm, and roadmaps go to about 0.9 nm. |
| I go through walls you said I couldn't climb | The electron never has the energy to get over the barrier (classically forbidden) and still ends up on the other side. |
| Five atoms thick (chorus) | The 1.2 nm SiO₂ gate oxide above: the moment tunneling forced the industry to change materials. Gordon Moore called high-k/metal gate the biggest transistor change in about 40 years. |
| The electrons walk right through | Direct tunneling through the gate oxide is gate leakage. Since high-k it is >10× lower, but it is still there. |
| Billions of switches | Modern CPUs, GPUs and phone chips carry tens of billions of transistors. |
| Close the gate, it doesn't stop | Off-state leakage. Most of it today is thermal (subthreshold), but the tunneling parts are gate leakage, band-to-band tunneling (GIDL) and, at gate lengths near **5 nm**, source-to-drain tunneling, the hard scaling limit (Kawaura & Sakamoto 2001). Real gate lengths in "2 nm" chips are about 12–14 nm. "2 nm" is a name, not a size. |
| Not a ball, a wave | Electron wavelength in silicon at room temperature is about 6–12 nm, the same size as the transistor. |
| A wave fades | Inside a barrier the wavefunction decays as e^(−κx), κ = √(2m(V−E))/ħ, so T ≈ e^(−2κd). |
| Halve the wall, fifty million times the leak | Free electron, 3 eV barrier: T = 4×10⁻¹⁶ at 2 nm and 2×10⁻⁸ at 1 nm, a factor of about 5×10⁷. For real Si/SiO₂ (effective mass 0.5) it is about 3.5× per ångström. |
| Photos, electrons through glass | NAND flash writes and erases by Fowler–Nordheim tunneling through a silicon-oxide ("glass") layer. Charge slowly tunnels back out, which is why flash is rated for about 10 years. SK hynix makes 321-layer 3D NAND (since Nov 2024). |
| Gates on every side (picture) | Gate-all-around nanosheets: Samsung 3 nm (2022), TSMC N2 (Q4 2025), Intel 18A RibbonFET with 4 stacked ribbons (2026). The gate wraps the channel to fight leakage. |
| Here and not here, the cat in the box | Schrödinger, 1935: a cat, a Geiger counter and a radioactive atom with a 50% chance to decay in an hour. A critique of superposition at everyday scale, not tunneling. The link is real though: alpha decay is tunneling (Gamow; Gurney & Condon, 1928). |
| Too cold to burn, fifteen million degrees | Core about 1.5×10⁷ K, thermal energy about 1.3 keV vs. a proton–proton Coulomb barrier of about 0.5–1 MeV. Classically fusion would need about 10¹⁰ K, roughly 700× hotter. Tunneling makes it possible. |
| Every star in the sky | Every main-sequence star burns by tunneling. |
| Picture: quantum computer | 2025 Nobel Prize in Physics (Clarke, Devoret, Martinis): macroscopic quantum tunneling in a Josephson-junction circuit, the basis of superconducting qubits. |
| A needle one atom sharp, a current through nothing | Scanning tunneling microscope (Binnig & Rohrer, 1981; Nobel 1986): current changes about 10× per 0.1 nm, so it sees single atoms. |
| Picture: tunnel diode | Esaki, 1957/58; Nobel 1973 with Giaever and Josephson. |
| Picture: hard disks, MRAM | Every hard-disk read head and every MRAM bit is a magnetic tunnel junction with an oxide barrier about 1 nm thick. |
| You're reading this on a leak | The device you're watching on stores, switches and loses charge by tunneling. |

Sources: Intel press releases (Jan and Nov 2007), EDN, IEEE TechNav gate leakage, IRDS / arXiv 2007.14448 and 2509.17617, IEICE (Kawaura 2001), NASA NEPP flash retention (Oldham 2011), SK hynix (Nov 2024), Samsung (Jun 2022), Tom's Hardware (TSMC N2), EPFL (Nobel 2025), Gerber (STM), UNM ASTR 421 (stellar fusion), plus.maths.org (Schrödinger 1935).

## The take we used (cut to 1:31.6)

The Suno take ran 1:49.6. It sang the intro, verse 1, the pre-chorus, one chorus and the outro. It skipped "Leak" mostly into the build, and left out verse 2 (Sun, STM) and the second chorus. Those become pictures over the instrumental drop.

We cut 18.0 s of instrumental between the intro and verse 1, on the kick grid (133.5 BPM, 1 bar = 1.797 s), with 12 ms equal-power crossfades:
- source 19.909 → 27.112 (4 bars of build): the intro now runs straight into the riser
- source 30.737 → 41.511 (6 bars of the first drop): one bar of drop hit, then the bar that leads into the verse

Cut song `assets/five-atoms-thick.mp3`, beat map `assets/five-atoms-thick.beats.json`.

| Event | Time in the cut song |
|---|---|
| Knock knock / Who's there / Both | 0.0 / 4.0 / 6.5 s |
| There's a wall in your phone / walk right through | 10.5 / 15.0–19.0 s |
| Riser / drop | 19.9 / 21.7 s |
| Verse 1 "Billions of switches" | 25.3 s |
| Pre-chorus "Open the box" | about 48 s |
| Chorus | about 52 s |
| Instrumental drop (Sun, STM, quantum computer) | about 66.5–74 s |
| Outro "Every phone, every chip" / "Open the box" | about 74 / 82 s |
| Final hit / end | about 84.4 / 91.6 s |

## Formulas and diagrams for the 3D parts

- Time-dependent Schrödinger equation iħ ∂Ψ/∂t = −(ħ²/2m) ∇²Ψ + VΨ, and the stationary form ĤΨ = EΨ
- Inside the barrier: ψ(x) = A e^(−κx), κ = √(2m(V₀−E))/ħ
- Exact rectangular barrier: T = [1 + V₀² sinh²(κd) / (4E(V₀−E))]⁻¹
- WKB: T ≈ exp(−(2/ħ) ∫ √(2m(V(x)−E)) dx)
- Fowler–Nordheim (flash writes): J = (A E²/φ) exp(−B φ^(3/2)/E)
- Gamow factor (the Sun, alpha decay): P ≈ exp(−2π Z₁Z₂e²/(4πε₀ħv))
- Probability current j = (ħ/m) Im(ψ* ∇ψ), normalisation ∫|ψ|² dx = 1
- Superposition |ψ⟩ = α|alive⟩ + β|dead⟩, |α|² + |β|² = 1
- Live counter: d sliding 2 nm → 1 nm, T × 50,000,000
- Zoom with scale bars: phone 15 cm → chip 1 cm → transistor 50 nm → nanosheet 5 nm → gate oxide 1.2 nm → silicon atoms 0.235 nm apart (Si–Si bond)
- Electron wave packets hitting the gate oxide: most reflect, a faint part comes out the other side
