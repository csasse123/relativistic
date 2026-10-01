# AI video clips

These clips are cut into `satellites.html` at the times below. Generate them with `node tools/runway_clips.mjs` (needs `RUNWAY_API_KEY`). Each clip is one Gen-4 still, which can use reference images (our own 3D render, or the cast faces `@maya` and `@leo`), followed by a Gen-4 Turbo video. If a clip is missing, the 3D shot plays instead.

- New clips: `node tools/runway_clips.mjs`
- Re-roll the ones marked redo (drop_a, pre_wide): `node tools/runway_clips.mjs --redo`
- Re-roll specific clips: `node tools/runway_clips.mjs --force pre_close`

The script prints your credit balance before and after each run. A clip costs about 33 credits (about $0.33); the 10 s approach shot costs about 58 credits.

**Style `crew`:** photorealistic cinematic film still, shot on ARRI Alexa 65, anamorphic 40mm, shallow depth of field, dark modern mission control room lit by wall-sized screens of orbit tracks and a glowing Earth plus warm amber practical desk lamps, teal and amber color grade, subtle film grain, private-spaceflight aesthetic, no logos, no brand names, any on-screen text soft and unreadable

**Style `space`:** photorealistic NASA documentary photograph from orbit, shot on 70mm, real spacecraft materials: crinkled gold and silver multi-layer insulation, mirrored radiator tiles, deep blue solar cells with fine silver grid lines, bolts and cabling; hard direct sunlight, pure black space, Earth with real clouds and atmosphere glow; no text, no logos

## `lookup` · 0:10.1–0:12.6 · style crew
- **Image:** A young female flight engineer in a fitted black technical jacket, headset around her neck, sits at a console in a dark mission control room; her face is lit cyan by screens; she slowly looks up toward a huge wall display of satellite orbits
- **Motion:** slow push-in on her face as she lifts her eyes to the wall screen, screen light flickers across her face, subtle handheld

## `drop_a` · 0:37.5–0:39.3 · style crew · redo · refs: @maya, @leo
- **Image:** Wide shot of a sleek mission control room staffed by stylish engineers in their twenties, among them @maya and @leo, a mixed crew (Black, white, South Asian, Latina, East Asian, women and men), at curved consoles under a giant wall screen showing Earth with glowing orbit lines
- **Motion:** fast lateral dolly along the console row, engineers typing, screens pulse to the beat, energetic

## `drop_b` · 0:41.1–0:43.2 · style crew
- **Image:** Close-up of hands on a backlit keyboard and a monitor showing streaming green and cyan numbers and orbital plots, a young male engineer with rolled-up sleeves leaning in
- **Motion:** rapid rack focus from the fingers to his intense eyes reflected in the monitor, numbers scroll, kinetic

## `pre_wide` · 1:13.1–1:15.0 · style crew · redo · refs: @maya, @leo
- **Image:** Moody wide shot from the back of a dark mission control room: a young, mixed crew in their twenties (women and men of different ethnicities, casual-technical clothes, one in a hoodie) seen from behind at consoles, warm amber desk lamps, a wall-sized screen with a world map and sine-wave satellite ground tracks
- **Motion:** slow crane down from ceiling height toward the consoles, calm, atmospheric haze in the screen light

## `pre_close` · 1:15.0–1:17.0 · style crew · refs: @maya
- **Image:** Extreme close-up of @maya wearing glasses; reflected in her lenses are two analog clocks drifting apart
- **Motion:** very slow push-in, she blinks, the reflected numbers tick, shallow focus, quiet

## `pre_board` · 1:17.0–1:19.0 · style crew
- **Image:** Two young engineers, a man and a woman, at a glass whiteboard covered in handwritten relativity equations and orbit sketches, one of them writing with a marker
- **Motion:** handheld arc around them as she writes and he points at the equation, they exchange a quick look and a smile

## `chorus_cheer` · 1:19.0–1:20.7 · style crew
- **Image:** A mission control team of young engineers jumps up from their consoles celebrating, high-fives, the wall screen behind them shows a satellite lock on a glowing Earth
- **Motion:** explosive cheer and high-fives in slow motion, camera pushes through the group toward the wall screen, euphoric

## `sat_approach` · 0:20.0–0:28.6 · style space · refs: @render
- **Image:** Photorealistic photograph of the satellite in @render, same satellite design, same camera angle and composition: a GPS navigation satellite with a gold-foil box body and two long solar wings, drifting in medium Earth orbit
- **Motion:** slow, steady push-in toward the satellite, sunlight glints travel across the gold foil and the solar cells, stars stay fixed, majestic

## `sat_beauty` · 0:28.6–0:30.4 · style space · refs: @render
- **Image:** Photorealistic close photograph of the satellite in @render, same design and framing: gold multi-layer insulation, silver radiators, deep-blue solar wings
- **Motion:** fast orbiting camera move around the satellite, a lens flare sweeps as the Sun passes behind a solar wing, punchy

## `iss_limb` · 0:32.0–0:33.8 · style space · refs: @render
- **Image:** Photorealistic photograph of the International Space Station as in @render, same composition, above the curved limb of Earth with a thin blue atmosphere line and clouds below
- **Motion:** the station glides forward over the Earth's limb, the terminator line slides across the clouds, camera tracks alongside

## `gps_helix` · 0:35.5–0:37.3 · style space · refs: @render
- **Image:** Photorealistic macro photograph of the Earth-facing antenna panel in @render: twelve white helical L-band antennas in a ring on a dark plate, gold-foil satellite body beside them
- **Motion:** slow macro slide across the helical antennas with shallow depth of field, rack focus from the near helix to the far ones, Earth glow reflects on the metal

## `hubble_orbit` · 0:39.1–0:40.9 · style space · refs: @render
- **Image:** Photorealistic photograph of the Hubble Space Telescope as in @render, same framing, silver foil body and solar arrays against the glowing limb of Earth
- **Motion:** the telescope rotates slowly as the camera arcs around it, sunlight rakes across its silver insulation, serene

