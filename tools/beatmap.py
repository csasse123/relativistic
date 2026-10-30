#!/usr/bin/env python3
"""Beat map for a song: tempo, beats, downbeats, kicks, section boundaries.

  pip install librosa
  python3 tools/beatmap.py assets/song.mp3 [--vocals vocals.wav] [-o assets/song.beats.json]

Downbeats assume 4/4: the bar phase is the one whose beats carry the most low-end energy.
Sections come from structural segmentation (librosa) and are snapped to downbeats.
--vocals (a Suno or Demucs vocal stem) adds the start times of each vocal phrase.
"""
import argparse, json, numpy as np, librosa

ap = argparse.ArgumentParser()
ap.add_argument("audio"); ap.add_argument("--vocals"); ap.add_argument("-o"); ap.add_argument("--sections", type=int, default=10)
a = ap.parse_args()
y, sr = librosa.load(a.audio, sr=22050, mono=True)
hop = 512
dur = len(y) / sr

# beats
tempo, beats = librosa.beat.beat_track(y=y, sr=sr, hop_length=hop, units="frames")
bt = librosa.frames_to_time(beats, sr=sr, hop_length=hop)

# kicks: peaks of low-band (30–150 Hz) spectral flux at 3 ms resolution, ≥0.2 s apart
S = np.abs(librosa.stft(y, n_fft=2048, hop_length=64))
f = librosa.fft_frequencies(sr=sr, n_fft=2048)
fl = np.maximum(0, np.diff(S[(f > 30) & (f < 150)].sum(0))); fl /= fl.max()
ft = librosa.frames_to_time(np.arange(len(fl)), sr=sr, hop_length=64)
kt = []
for i in np.flatnonzero((fl[1:-1] > 0.12) & (fl[1:-1] >= fl[:-2]) & (fl[1:-1] >= fl[2:])) + 1:
    if not kt or ft[i] - kt[-1][0] > 0.2: kt.append((ft[i], fl[i]))
    elif fl[i] > kt[-1][1]: kt[-1] = (ft[i], fl[i])
kt = np.array([t for t, _ in kt])
d = np.diff(kt); d = d[(d > 0.3) & (d < 0.6)]
if len(d) > 8: tempo = 60 / np.median(d)  # kick grid is more exact than the beat tracker's tempo
env = librosa.onset.onset_strength(S=librosa.amplitude_to_db(np.abs(librosa.stft(y, n_fft=2048, hop_length=hop))[(f > 30) & (f < 150)]), sr=sr, hop_length=hop)

# downbeats: pick the 4/4 phase with the most low-end energy on its beats
le = env[np.clip(beats, 0, len(env) - 1)]
phase = int(np.argmax([le[p::4].sum() for p in range(4)])) if len(beats) >= 8 else 0
db = bt[phase::4]

# sections: agglomerative segmentation on beat-synced chroma + MFCC, snapped to downbeats
feat = np.vstack([librosa.feature.chroma_cqt(y=y, sr=sr, hop_length=hop), librosa.feature.mfcc(y=y, sr=sr, hop_length=hop, n_mfcc=13)])
sync = librosa.util.sync(feat, beats, aggregate=np.median)
bnd = librosa.segment.agglomerative(sync, min(a.sections, sync.shape[1]))
bnd_t = sorted({float(db[np.argmin(np.abs(db - bt[min(b, len(bt) - 1)]))]) for b in bnd} | {0.0}) if len(db) else [0.0]
rms = librosa.feature.rms(y=y, hop_length=hop)[0]
sections = []
for i, t0 in enumerate(bnd_t):
    t1 = bnd_t[i + 1] if i + 1 < len(bnd_t) else dur
    fr = slice(*librosa.time_to_frames([t0, t1], sr=sr, hop_length=hop))
    sections.append({"t": round(t0, 3), "end": round(t1, 3), "energy": round(float(rms[fr].mean() / rms.max()), 3) if t1 > t0 else 0})

out = {"file": a.audio, "duration": round(dur, 3), "bpm": round(float(np.atleast_1d(tempo)[0]), 2),
       "beats": [round(float(t), 3) for t in bt], "downbeats": [round(float(t), 3) for t in db],
       "kicks": [round(float(t), 3) for t in kt], "sections": sections}

if a.vocals:  # phrase starts: vocal energy rising after ≥0.35 s of near-silence
    v, _ = librosa.load(a.vocals, sr=sr, mono=True)
    vr = librosa.feature.rms(y=v, hop_length=hop)[0]; on = vr > 0.08 * vr.max()
    gap = int(0.35 * sr / hop); starts, quiet = [], gap
    for i, o in enumerate(on):
        if o and quiet >= gap: starts.append(round(float(librosa.frames_to_time(i, sr=sr, hop_length=hop)), 3))
        quiet = 0 if o else quiet + 1
    out["vocal_phrases"] = starts

dst = a.o or a.audio.rsplit(".", 1)[0] + ".beats.json"
json.dump(out, open(dst, "w"), indent=1)
print(f"{dst}: {out['bpm']} BPM, {len(bt)} beats, {len(db)} bars, {len(kt)} kicks, {len(sections)} sections")
for s in sections: print(f"  {s['t']:7.2f}–{s['end']:7.2f}  energy {s['energy']:.2f}")
