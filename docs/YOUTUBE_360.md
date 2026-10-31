# 360° versions for YouTube VR (Quest 3S)

Both music videos have a 360 mode (`?vr`):
- The 3D world is rendered all around you as a 5760×2880 equirectangular sphere. A cube camera sits at the camera position.
- The Runway clips and all text, formulas and the electron cartoon play on a curved screen 110° wide in front of you.
- Each shot keeps its starting direction and the camera only moves, so nothing swings around your head.
- In Five Atoms Thick you stand closer to the subjects, with Schrödinger's equations floating all around you.
- In Thirty-Two Clocks, Earth, the GPS orbits and the formula rain surround you.

Preview in Chrome: `tunnel.html?vr&vrw=2048` or `satellites.html?vr&vrw=2048`.

## Render on the Mac (Chrome + its graphics card)

```
cd ~/relativistic && git pull --no-rebase --no-edit origin main && npm i && VR=1 PAGE=tunnel.html node tools/render_mp4.mjs && VR=1 PAGE=satellites.html node tools/render_mp4.mjs
```

Output:
- `exports/five-atoms-thick_360_5760.mp4`
- `exports/thirty-two-clocks_360_5760.mp4`

Both are H.264 High, CRF 18 (at most 90 Mb/s), AAC, 30 fps, and already tagged as 360 equirectangular by `tools/inject360.mjs`. Keep the Chrome window open while it runs. `VRW=3840` renders a faster 4K version.

## Upload to YouTube

1. Go to YouTube Studio, choose **Create → Upload video**, and pick the `_360_5760.mp4` file. YouTube detects the 360 tag by itself.
2. After processing, the player shows a 360 control (drag to look around). 4K and higher can take a few hours to appear after the upload.
3. On the Quest 3S: open the **YouTube** app, find the video in your library, and look around.
4. Titles:
   - *Five Atoms Thick · Quantum Tunneling · 360° VR music video*
   - *Thirty-Two Clocks · GPS & General Relativity · 360° VR music video*
5. Thumbnail: for Five Atoms Thick, upload `release/five-atoms-thick_thumbnail.jpg` as a custom thumbnail (custom thumbnails need a verified YouTube account).
