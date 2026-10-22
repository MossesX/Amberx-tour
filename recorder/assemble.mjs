// Turns the raw chapter recordings + voice clips into the published walkthrough: one 720p MP4 with the
// narration, a WebVTT caption file and a chapter list, all in $OUT/publish.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

const OUT = process.env.OUT || "/out";
const PUB = `${OUT}/publish`;
const TMP = `${OUT}/tmp`;
mkdirSync(PUB, { recursive: true });
mkdirSync(TMP, { recursive: true });
const timeline = JSON.parse(readFileSync(`${OUT}/timeline.json`, "utf8"));
const ff = (args) => execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-y", ...args], { stdio: "inherit" });

const vttTime = (t) => {
  const ms = Math.round(t * 1000), h = Math.floor(ms / 3600000), m = Math.floor(ms / 60000) % 60, s = Math.floor(ms / 1000) % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms % 1000).padStart(3, "0")}`;
};

const parts = [];
const cues = [];
const chapters = [];
let offset = 0;
for (const ch of timeline) {
  const first = ch.scenes[0].start;
  const last = ch.scenes.at(-1).end;
  const length = last - first;
  // Each scene's clip, padded with silence to the scene's real on-screen length, then joined.
  const inputs = [], filters = [];
  ch.scenes.forEach((s, k) => {
    const span = (k + 1 < ch.scenes.length ? ch.scenes[k + 1].start : s.end) - s.start;
    inputs.push("-i", `${OUT}/audio/${ch.id}-${s.i}.wav`);
    filters.push(`[${k}:a]aresample=48000,apad,atrim=0:${span.toFixed(3)},asetpts=N/SR/TB[a${k}]`);
  });
  filters.push(`${ch.scenes.map((_, k) => `[a${k}]`).join("")}concat=n=${ch.scenes.length}:v=0:a=1[a]`);
  const wav = `${TMP}/${ch.id}.wav`;
  ff([...inputs, "-filter_complex", filters.join(";"), "-map", "[a]", wav]);
  const mp4 = `${TMP}/${ch.id}.mp4`;
  ff(["-ss", first.toFixed(3), "-t", length.toFixed(3), "-i", `${OUT}/raw/${ch.id}.webm`, "-i", wav,
    "-map", "0:v", "-map", "1:a", "-vf", "fps=25,scale=1280:720,format=yuv420p", "-c:v", "libx264", "-preset", "veryfast", "-crf", "26",
    "-c:a", "aac", "-b:a", "128k", "-ar", "48000", "-shortest", mp4]);
  parts.push(mp4);
  chapters.push({ id: ch.id, title: ch.title, start: Math.round(offset * 10) / 10 });
  // Captions: one cue per sentence, spread over the clip in proportion to its length.
  for (const s of ch.scenes) {
    const sentences = s.say.match(/[^.!?]+[.!?]+(\s|$)/g)?.map((x) => x.trim()) ?? [s.say];
    const total = sentences.reduce((n, x) => n + x.length, 0);
    let t = offset + (s.start - first);
    for (const x of sentences) {
      const d = (s.dur * x.length) / total;
      cues.push(`${vttTime(t)} --> ${vttTime(t + d)}\n${x}`);
      t += d;
    }
  }
  offset += length;
}

writeFileSync(`${TMP}/list.txt`, parts.map((p) => `file '${p}'`).join("\n"));
ff(["-f", "concat", "-safe", "0", "-i", `${TMP}/list.txt`, "-c", "copy", "-movflags", "+faststart", `${PUB}/walkthrough.mp4`]);
writeFileSync(`${PUB}/walkthrough.vtt`, `WEBVTT\n\n${cues.join("\n\n")}\n`);
writeFileSync(`${PUB}/chapters.json`, JSON.stringify({ duration: Math.round(offset), chapters }, null, 1));
console.log(`walkthrough: ${(offset / 60).toFixed(1)} min, ${chapters.length} chapters, ${cues.length} captions`);
