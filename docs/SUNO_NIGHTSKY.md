# 3D Night Sky — intro song (DRAFT 1, 7 Nov 2026)

About 1 minute, in the same family as Thirty-Two Clocks: deadpan spoken verses, one big sung chorus. It's the opening of **3D Night Sky**: the song plays while the camera takes you from a dark mountain up into real 3D space, then hands you the controls.

## Suno settings (v6)

| Setting | Value |
|---|---|
| Mode | **Custom** |
| Model | **v6** |
| Variety | **Off** |
| Duration | **1:05**. The lyrics fill about 1:00. A shorter slider hard-cuts the last line. |
| Title | `3D Night Sky` |

### Style (paste as-is)

```
female vocals, deadpan spoken-word verses, soaring sung trance chorus, dark electroclash, 128 BPM, D minor, analog FM bass, supersaw lead, glassy arpeggiator, long riser into the drop, punchy four-on-the-floor kick, wide reverb, starry shimmer pads, cold clipped delivery, euphoric lift, clean ending on the last word
```

### Exclude Styles

```
male vocals, rap, acoustic guitar, fade out
```

## Lyrics (paste as-is)

```
[Intro]
[Spoken Word]
Lights off.
Look up.
Every point of light up there is a sun.
And every one of them is somewhere.

[Build]
[Spoken Word]
A mountain. Four thousand two hundred metres.
Clear night. No Moon.
Now leave.

[Drop]

[Verse]
[Spoken Word]
Above the air, the blue runs out.
Keep climbing. The ceiling breaks.
The stars get depth.
Polaris. That light left before anyone owned a telescope.
Andromeda. Two and a half million years on the road.
Every star exactly where it is.

[Chorus]
Every star in the dark is a sun with a place
Light that left before you were born just landed on your face
Climb till the blue runs out and the ceiling is gone
Three-D Night Sky, the universe, switch it on

[Outro]
[Spoken Word]
Three-D Night Sky.
Your turn.

[End]
```

### Facts behind the lines

| Line | Fact |
|---|---|
| Four thousand two hundred metres | Maunakea summit is 4,207 m. It's the walkable 3D world in the app (build 161). |
| Above the air, the blue runs out | The sky goes black above the atmosphere, roughly 100 km up. |
| The stars get depth | In the app, the stars turn 3D on the climb from 80 to 1,500 km. |
| Polaris … before anyone owned a telescope | Polaris is about 430 light-years away, so its light left in the 1590s. The first telescope patent was in 1608. |
| Andromeda … two and a half million years | M31 is about 2.5 million light-years away. |

## Picture (one timeline, two outputs)

Fully 3D and immersive, like the Thirty-Two Clocks 360 edition. The camera flies through **the real app**; Runway clips appear as oval visions in the sky, never on a flat screen.

**Rule: every Runway vision shows something the app really does.** Each one names its feature. No invented scenes.

| Section | In the app (real engine) | Runway vision → app feature |
|---|---|---|
| Lights off / Look up | Black, then the live sky fades in over the Maunakea photo landscape | Someone in a dark room puts on a headset, and the room dissolves into stars → **headset mode** (Quest) |
| Mountain / Now leave | Standing in the walkable Maunakea world, domes around you | Maunakea's observatory domes at dusk above the clouds → **observatory sites** |
| Drop: the blue runs out | The one continuous climb, with the height display running from metres to km | — (the app alone) |
| The ceiling breaks / stars get depth | Passing 80 km and up: the stars turn 3D | — (the app alone) |
| Polaris | A star dive to Polaris, with its card | The Great Pyramid in 2560 BC, with the stars wheeling above it (the builders' pole star was Thuban, not Polaris) → **Skies of history: Giza** |
| Andromeda | A flight toward M31 | — (the app alone) |
| Chorus | The Milky Way stack (Blake's mosaic), star trails, a sweep of the whole sky | A star party: telescopes, red flashlights and people under the Milky Way → **star party ground**; a rocky world under a dim red sun, where one small star overhead is our Sun → **Exoplanet skies: Proxima** |
| Your turn | The camera settles and the controls appear | — |

Before Runway, I check each vision against the running app (the site, the landscape, the feature) and drop any that doesn't match.

**Decided 7 Nov: both outputs.**

**Output 1, in the app:** the intro flow itself. It runs live on first open, synced to the song, and on "Your turn" the user takes over.

**Output 2, video:** the same timeline rendered frame-exact. A flat 1080p version goes to X, YouTube and explorables.io; a 5760 360° version goes to YouTube VR and the Quest.

## Steps

1. Christian generates takes in Suno from this sheet and picks the best one.
2. Cut it on the kick grid (`python3 tools/beatmap.py`) and set the cue times.
3. Runway: the spec is `docs/ai_clips_nightsky.json`, with each vision's app feature written in its `app` field and checked against `origin-vr-src` (features.js, world.js, party.js). Stills first, then animate the chosen take (`tools/runway_clips.mjs --spec docs/ai_clips_nightsky.json`).
4. Add a film mode to the app (a scripted camera and `__frame(t)`), coordinated with the 3D Night Sky session, which owns that repo.
5. Render, check the frames by eye, and release.
