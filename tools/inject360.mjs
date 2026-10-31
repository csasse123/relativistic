// Marks an MP4 as 360° mono equirectangular for YouTube (Spherical Video V1: an XML uuid box in the video track).
//   node tools/inject360.mjs in.mp4 out.mp4
// Handles faststart files (moov before mdat) by shifting stco/co64 chunk offsets.
import fs from "fs";
const [inp, out] = process.argv.slice(2); if (!inp || !out) { console.error("usage: node tools/inject360.mjs in.mp4 out.mp4"); process.exit(1); }
const buf = fs.readFileSync(inp);
const UUID = Buffer.from("ffcc8263f8554a938814587a02521fdd", "hex");
const XML = Buffer.from('<?xml version="1.0"?><rdf:SphericalVideo xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:GSpherical="http://ns.google.com/videos/1.0/spherical/">' +
  "<GSpherical:Spherical>true</GSpherical:Spherical><GSpherical:Stitched>true</GSpherical:Stitched><GSpherical:StitchingSoftware>relativistic tools/inject360.mjs</GSpherical:StitchingSoftware>" +
  "<GSpherical:ProjectionType>equirectangular</GSpherical:ProjectionType></rdf:SphericalVideo>");
const box = Buffer.concat([Buffer.alloc(4), Buffer.from("uuid"), UUID, XML]); box.writeUInt32BE(box.length, 0);

// box list of a range: { type, start, size, hdr }
function boxes(b, from, to) { const out = []; let p = from;
  while (p + 8 <= to) { let size = b.readUInt32BE(p), hdr = 8; const type = b.toString("latin1", p + 4, p + 8);
    if (size === 1) { size = Number(b.readBigUInt64BE(p + 8)); hdr = 16; } else if (size === 0) size = to - p;
    if (size < hdr || p + size > to) throw new Error(`bad box ${type} at ${p}`); out.push({ type, start: p, size, hdr }); p += size; }
  return out; }
const kids = (b, x) => boxes(b, x.start + x.hdr, x.start + x.size);
const find = (b, x, path) => { let cur = [x]; for (const t of path) { const n = cur.flatMap((c) => kids(b, c)).filter((k) => k.type === t); if (!n.length) return []; cur = n; } return cur; };

const top = boxes(buf, 0, buf.length), moov = top.find((x) => x.type === "moov"), mdat = top.find((x) => x.type === "mdat");
if (!moov) throw new Error("no moov box");
const traks = kids(buf, moov).filter((x) => x.type === "trak");
const vtrak = traks.find((tr) => find(buf, tr, ["mdia", "hdlr"]).some((h) => buf.toString("latin1", h.start + h.hdr + 8, h.start + h.hdr + 12) === "vide"));
if (!vtrak) throw new Error("no video track");
if (kids(buf, vtrak).some((k) => k.type === "uuid" && buf.subarray(k.start + 8, k.start + 24).equals(UUID))) { fs.copyFileSync(inp, out); console.log("already 360-tagged"); process.exit(0); }

const add = box.length, shift = mdat && moov.start < mdat.start ? add : 0;
const res = Buffer.concat([buf.subarray(0, vtrak.start + vtrak.size), box, buf.subarray(vtrak.start + vtrak.size)]);
const grow = (x) => { if (x.hdr === 16) res.writeBigUInt64BE(BigInt(x.size + add), x.start + 8); else res.writeUInt32BE(x.size + add, x.start); };
grow(moov); grow(vtrak); // both start before the insert point, so their offsets are unchanged
if (shift) for (const tr of traks) { const st = tr.start >= vtrak.start + vtrak.size ? add : 0; // traks after the insert moved by `add`
  for (const s of find(buf, tr, ["mdia", "minf", "stbl", "stco"])) { const p = s.start + st + s.hdr + 4, n = res.readUInt32BE(p); for (let i = 0; i < n; i++) res.writeUInt32BE(res.readUInt32BE(p + 4 + i * 4) + shift, p + 4 + i * 4); }
  for (const s of find(buf, tr, ["mdia", "minf", "stbl", "co64"])) { const p = s.start + st + s.hdr + 4, n = res.readUInt32BE(p); for (let i = 0; i < n; i++) res.writeBigUInt64BE(res.readBigUInt64BE(p + 4 + i * 8) + BigInt(shift), p + 4 + i * 8); } }
fs.writeFileSync(out, res); console.log(`${out}: tagged 360° equirectangular (${add} bytes${shift ? ", chunk offsets shifted" : ""})`);
