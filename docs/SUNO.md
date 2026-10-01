# Thirty-Two Clocks — Suno sheet

Satellites only. 32 GPS clocks falling around the Earth: special relativity slows them, general relativity speeds them up, and they are detuned on the ground so they tick true in orbit.

## Suno settings (v6)

| Setting | Value |
|---|---|
| Mode | **Custom** |
| Model | **v6** (or v6-wild for a stranger take) |
| Variety | **Off**, so the Style text is used exactly as written |
| Duration | **2:10**. The lyrics fill about 2:05. A shorter slider hard-cuts the outro. |
| Max Mode | On if you have credits (cleaner mix on tracks over 2 min) |
| Title | `Thirty-Two Clocks` |

### Style (paste as-is)

```
female vocals, deadpan spoken-word verses, soaring sung trance chorus, dark electroclash, 132 BPM, A minor, analog FM bass, supersaw lead, arpeggiator, riser sweeps, punchy four-on-the-floor kick, tape hiss intro, cold clipped delivery, euphoric lift
```

### Exclude Styles

```
male vocals, rap, acoustic guitar
```

## Lyrics (paste as-is)

```
[Intro]
[Spoken Word]
Attention.
Look up.
Thirty-two clocks are falling on you. Right now.
None of them land.

[Build]
[Spoken Word]
Fall.

[Drop]

[Verse 1]
[Spoken Word]
Twenty thousand klicks up. Fourteen thousand an hour.
Falling every second. Missing every second.
The Earth curves away as fast as they drop.
That's not floating. That's a fall that never ends.
Cesium heart. Nine billion ticks a second.
Shouting the time at the speed of light.
Four birds. Four spheres. X, Y, Z, and when.
Miss by a nanosecond, thirty centimetres.

[Pre-Chorus]
[Spoken Word]
But up there,
time is not your time.

[Chorus]
Thirty-two clocks in the dark and you never look up
Screaming out the time and they never shut up
Bent time, fast light, thirty-eight a day
Without Einstein in orbit you'd be miles away

[Verse 2]
[Spoken Word]
Speed first.
Moving clocks run slow.
Gamma. One over root of one minus v squared over c squared.
Minus seven microseconds. Every single day.

[Verse 3]
[Spoken Word]
Then height.
Less gravity. Less pull on time.
Phi over c squared. The high clock runs fast.
Plus forty-five. Net thirty-eight.
Times light, eleven klicks a day.
So they build it slow on the ground.
Ten point two two nine nine nine nine nine nine five four three.
Born slow. To tick true in the sky.

[Chorus]
Thirty-two clocks in the dark and you never look up
Screaming out the time and they never shut up
Bent time, fast light, thirty-eight a day
Without Einstein in orbit you'd be miles away

[Drop]
[Chant]
Minus seven. Plus forty-five. Net thirty-eight.
Fall. Miss. Tick. Fix. Fall. Miss. Tick. Fix.

[Outro]
[Spoken Word]
You opened a map.
You used relativity.
They're still falling.

[End]
```

Tips:
- Generate 4–6 takes and keep the one where the verses are spoken and the chorus is sung.
- If a take sings the verses, regenerate. Adding `deadpan spoken-word verses` a second time at the front of Style usually fixes it.
- Don't add parentheses. Suno sings whatever is inside them.

## Planned structure (132 BPM, 1 bar ≈ 1.82 s)

| Section | Bars | Planned time | Picture |
|---|---|---|---|
| Intro (spoken, no beat) | 8 | 0:00–0:14 | Berlin at night from orbit → "Look up" tilt → 32 satellites revealed |
| Build "Fall." | 2 | 0:14–0:18 | Rush at a GPS satellite |
| Drop + Verse 1 | 16 | 0:18–0:47 | Chase cam over Earth with the imaging swath, Newton's cannon, cesium close-up, light wavefronts, 4-sphere fix on Berlin, 1 ns = 30 cm |
| Pre-Chorus | 4 | 0:47–0:54 | Ground clock vs sky clock, τ ≠ t |
| Chorus | 8 | 0:54–1:08 | Flythrough of the full 6-plane constellation, formulas hanging in orbit, beat pulses |
| Verse 2 (special relativity) | 8 | 1:09–1:22 | Speed tunnel, γ, the clock falls to −7.2 μs/day |
| Verse 3 (general relativity) | 8 | 1:22–1:37 | Gravity well, Φ/c², +45.7 → net +38.6; satellite-imagery dive with an 11 km ghost pin; factory detune counter; panels unfold |
| Chorus | 8 | 1:38–1:52 | Constellation again |
| Chant | 4 | 1:52–2:00 | Cut on every beat: −7.2 / +45.7 / +38.6, FALL MISS TICK FIX |
| Outro | 4 | 2:00–2:07 | "You are here", Δf/f formula, pull back, black card |

## The take we used (2:12)

Suno sang the intro, verse 1, the pre-chorus, one chorus, verse 2 and "Then height. Less gravity, less pull on time." It left out the rest of verse 3, the second chorus, the chant and the outro. Those ideas now play as pictures over the instrumental drop (114–125 s): +45.7, net +38.6, × c ≈ 11 km, and the 10.22999999543 MHz detune.

| Event | Time |
|---|---|
| Attention / Look up / 32 clocks / None of them land | 7.1 / 10.1 / 12.8 / 18.9 s |
| Drop (kick) | 28.6 s |
| Verse 1 | 43.2 s |
| Kick returns on "Cesium heart" | 57.1 s |
| Pre-chorus "But up there" | 73.1 s |
| Chorus | 79.0 s |
| Verse 2 "Speed first" | 93.3 s |
| Drop 2 + "Then height" | 107.5 / 108.0 s |
| Breakdown / final hit / fade | 121.5 / 125.0 / 126–132 s |

## Putting the song on the video

1. Open `satellites.html` (live: https://csasse123.github.io/relativistic/satellites.html).
2. Drag the Suno mp3 onto the page, or use **load song**. Cue times stretch to the song length automatically.
3. For frame-exact lines, open `satellites.html?sync`, load the song and press Space at the first word of each line. The times are saved in this browser for that song.
4. Press **R** (or **export webm**) to record the finished video with audio. Use Chrome and keep the tab in front for the whole song.
5. Optional: commit the mp3 as `assets/thirty-two-clocks.mp3` and it loads by itself.

## Physics behind every line

Values were checked against Ashby (Living Reviews in Relativity 2003), IS-GPS-200 and the Galileo redshift tests (PRL 121, 2018).

| Line | Value |
|---|---|
| Thirty-two clocks | 32 operational GPS satellites (GPS III SV10 launched Apr 2026) |
| Twenty thousand klicks / fourteen thousand an hour | 20,200 km altitude, 26,561 km orbital radius, 3.874 km/s ≈ 13,950 km/h, period 11 h 58 min |
| The Earth curves away as fast as they drop | Anything falls 4.9 m in the first second. The ground curves away 4.9 m over about 8 km. At about 8 km/s you never land. |
| Nine billion ticks | Cesium-133: 9,192,631,770 Hz defines the SI second |
| Speed of light | 67 ms (overhead) to 86 ms (horizon) from satellite to you |
| Four birds, X Y Z and when | 4 unknowns need 4 satellites |
| Nanosecond = thirty centimetres | c × 1 ns = 29.98 cm |
| Minus seven | Special relativity: v²/2c² → −7.2 μs/day |
| Plus forty-five | General relativity: ΔΦ/c² → +45.7 μs/day |
| Net thirty-eight | +38.6 μs/day |
| Eleven klicks a day | 38.6 μs × c ≈ 11.6 km. This is an illustration: in reality receivers absorb part of the shared clock error, but time and positions would fail fast. |
| Ten point two two nine nine nine nine nine nine five four three | 10.23 MHz detuned on the ground to 10.22999999543 MHz (−4.4647×10⁻¹⁰) |
| Born slow | 1977: NTS-2 carried the first cesium clock into orbit. It ran +442.5 parts in 10¹² fast, as Einstein predicted. |
