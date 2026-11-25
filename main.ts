// make.fun entry: "The Meeting That Should Have Been an Email"
// Writes one deterministic joke line to <OUTPUT_DIR>/entry.txt.
// Node 22, standard library only, no network, no randomness, no secrets.
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// The entry: the email that could have replaced the meeting shows up
// halfway through the meeting itself. Fresh angle (not a duration
// complaint, never says "could have been an email"), turn lands on the
// last word, and anyone who has sat in that meeting recognises it.
const ENTRY =
  "Halfway through the meeting, the email the meeting was about finally arrived.";

const outputDir = process.env.OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
const outPath = join(outputDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Gate validation, mirroring the harness: 1-200 characters counted per
// code point, a single line, not whitespace-only, no trailing newline.
const chars = [...ENTRY];
if (chars.length < 1 || chars.length > 200) {
  throw new Error(`entry must be 1-200 characters, got ${chars.length}`);
}
if (ENTRY.trim().length === 0) {
  throw new Error("entry must not be whitespace-only");
}
if (ENTRY.includes("\n") || ENTRY.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (ENTRY.endsWith("\n")) {
  throw new Error("entry must not end with a trailing newline");
}

// Read-back self-check: the file on disk must be byte-identical to ENTRY.
const onDisk = readFileSync(outPath, "utf8");
if (onDisk !== ENTRY) {
  throw new Error("read-back mismatch: entry.txt differs from ENTRY");
}
const byteLength = Buffer.byteLength(ENTRY, "utf8");
if (Buffer.byteLength(onDisk, "utf8") !== byteLength) {
  throw new Error("read-back mismatch: byte length differs");
}
console.log(
  `wrote ${outPath} (${chars.length} characters, ${byteLength} bytes)`,
);
