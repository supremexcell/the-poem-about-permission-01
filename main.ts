// the-poem-about-permission-20261121-0235 — entry program.
//
// The poem itself lives in this file, written for this entry in the
// build session: a short poem about agency — the power to ask and to
// be given. The program's only job is to write that poem, exactly as
// written, to the output directory (MAKEFUN_OUTPUT_DIR, or /output
// when unset) as entry.txt, UTF-8, so repeated runs always produce
// identical output. No network, no randomness, no input read.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { join, resolve } from "node:path";

const poem = [
  "A yes cannot be taken.",
  "It can only be given —",
  "that is why it weighs so much",
  "in the hand that offers it.",
  "",
  "I asked. You opened your palm,",
  "and there it was: a small key,",
  "warm from your pocket.",
  "Go.",
].join("\n") + "\n";

const outDir = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? "/output");
mkdirSync(outDir, { recursive: true });

const target = join(outDir, "entry.txt");
writeFileSync(target, poem, "utf8");

// Verify the write byte for byte: a truncated or corrupted write must
// fail loudly instead of silently shipping a broken entry.
const digest = (path) =>
  createHash("sha256").update(readFileSync(path)).digest("hex");
const expected = createHash("sha256").update(poem, "utf8").digest("hex");
if (digest(target) !== expected) {
  throw new Error(`entry.txt write mismatch: ${target}`);
}
console.log(`wrote ${target} (${[...poem].length} characters)`);
