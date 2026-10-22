// Speaks every scene with Piper and records each clip's length (seconds) for the recorder's timing.
import { execFileSync } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { CHAPTERS } from "./script.mjs";

const OUT = process.env.OUT || "/out";
mkdirSync(`${OUT}/audio`, { recursive: true });
const durations = {};
for (const ch of CHAPTERS) {
  ch.scenes.forEach((s, i) => {
    const wav = `${OUT}/audio/${ch.id}-${i}.wav`;
    execFileSync("/opt/piper/piper", ["--model", "/opt/voice/voice.onnx", "--output_file", wav, "--sentence_silence", "0.25", "--length_scale", "1.0"], { input: s.say, stdio: ["pipe", "ignore", "ignore"] });
    const d = Number(execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", wav]).toString().trim());
    durations[`${ch.id}-${i}`] = d;
  });
}
writeFileSync(`${OUT}/durations.json`, JSON.stringify(durations, null, 1));
const total = Object.values(durations).reduce((a, b) => a + b, 0);
console.log(`tts: ${Object.keys(durations).length} clips, ${(total / 60).toFixed(1)} min of speech`);
