# AI video clips: mission control

Seven 5-second clips cut into `satellites.html` at the times below. Generate them with `node tools/runway_clips.mjs`, which needs `RUNWAY_API_KEY`. Each run makes one Gen-4 still and then one Gen-4 Turbo 5 s video per clip, and writes the video to `assets/clips/<id>.mp4`. Any clip that's missing falls back to the 3D mission-control set.

**House style (appended to every prompt):** photorealistic cinematic film still, shot on ARRI Alexa 65, anamorphic 40mm, shallow depth of field, dark modern mission control room lit by wall-sized screens of orbit tracks and a glowing Earth, teal and amber color grade, subtle film grain, private-spaceflight aesthetic, no logos, no brand names, no readable text

## `lookup` · 0:10.1–0:12.6
- **Image:** A young female flight engineer in a fitted black technical jacket, headset around her neck, sits at a console in a dark mission control room; her face is lit cyan by screens; she slowly looks up toward a huge wall display of satellite orbits
- **Motion:** slow push-in on her face as she lifts her eyes to the wall screen, screen light flickers across her face, subtle handheld

## `drop_a` · 0:37.5–0:39.3
- **Image:** Wide shot of a sleek mission control room: rows of young engineers (mixed genders and ethnicities, stylish, in their twenties) at curved consoles, a giant wall screen showing Earth with 32 glowing orbit lines
- **Motion:** fast lateral dolly along the console row, engineers typing, screens pulse to the beat, energetic

## `drop_b` · 0:41.1–0:43.2
- **Image:** Close-up of hands on a backlit keyboard and a monitor showing streaming green and cyan numbers and orbital plots, a young male engineer with rolled-up sleeves leaning in
- **Motion:** rapid rack focus from the fingers to his intense eyes reflected in the monitor, numbers scroll, kinetic

## `pre_wide` · 1:13.1–1:15.0
- **Image:** Moody wide shot from the back of a dark mission control room, silhouettes of young engineers in front of a wall-sized screen showing a world map with sine-wave satellite ground tracks
- **Motion:** slow crane down from ceiling height toward the consoles, calm, atmospheric haze in the screen light

## `pre_close` · 1:15.0–1:17.0
- **Image:** Extreme close-up of a young woman engineer with glasses; reflected in her lenses are two clocks drifting apart and the number +38.6 microseconds per day
- **Motion:** very slow push-in, she blinks, the reflected numbers tick, shallow focus, quiet

## `pre_board` · 1:17.0–1:19.0
- **Image:** Two young engineers, a man and a woman, at a glass whiteboard covered in handwritten relativity equations and orbit sketches, one of them writing with a marker
- **Motion:** handheld arc around them as she writes and he points at the equation, they exchange a quick look and a smile

## `chorus_cheer` · 1:19.0–1:20.7
- **Image:** A mission control team of young engineers jumps up from their consoles celebrating, high-fives, the wall screen behind them shows a satellite lock on a glowing Earth
- **Motion:** explosive cheer and high-fives in slow motion, camera pushes through the group toward the wall screen, euphoric

Re-run a single clip: `node tools/runway_clips.mjs pre_close` (delete the old mp4 first). Expected cost is roughly 7 stills plus 7 × 5 s Gen-4 Turbo videos, so check your balance at dev.runwayml.com.
