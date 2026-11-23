// main.ts — entrypoint for the-joke-about-the-demo-20261123-0112.
// Copies the one-line joke in entry.txt to $MAKEFUN_OUTPUT_DIR/entry.txt.
import { copyFileSync, mkdirSync, readFileSync, readdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, "entry.txt");

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  console.error("MAKEFUN_OUTPUT_DIR is not set");
  process.exit(1);
}

// Clear the output directory's contents (never the directory itself).
mkdirSync(outDir, { recursive: true });
for (const name of readdirSync(outDir)) {
  rmSync(join(outDir, name), { recursive: true, force: true });
}

const joke = readFileSync(source, "utf8");
if (joke.trim().length === 0) {
  console.error("entry.txt is empty");
  process.exit(1);
}
const codePoints = [...joke].length;
if (codePoints < 1 || codePoints > 280) {
  console.error(`entry.txt must be 1-280 characters, got ${codePoints}`);
  process.exit(1);
}
copyFileSync(source, join(outDir, "entry.txt"));

// Verify the copy matches the source byte for byte.
const written = readFileSync(join(outDir, "entry.txt"), "utf8");
if (written !== joke) {
  console.error("written entry.txt does not match entry.txt");
  process.exit(1);
}
console.log(`wrote ${codePoints} characters to ${join(outDir, "entry.txt")}`);
