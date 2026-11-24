import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";

// One line: a kind, funny fortune for the houseplant on the windowsill.
// Chosen against the judge's brief, in its own order: it is squarely a
// fortune for this plant, in this window ("your sill", not any plant in
// any room); it sounds like a prediction, with the cadence of a fortune
// ("This week brings ... and ..."); it is kind and warm — extra sun,
// water on time, a new leaf — with no doom, no withering and no mockery;
// and its joke lands at the end rather than as a groaned-at pun: the new
// leaf is so fine the other plants will gossip, a small, plant-world
// vanity the keeper can laugh at. It explains nothing: the sun, the
// water and the gossiping neighbours are the whole fortune.
// Alternatives weighed and set aside: "Your future is sunny: a longer
// afternoon on the sill, water right on time, and a brand-new leaf by
// Sunday." reads as a schedule, not a fortune, and its twist is only a
// date; "Good news from your windowsill: ..." opens like a caption, not
// a prediction. The chosen line keeps the fortune's voice throughout and
// spends its laugh on the last clause, so it stands.
const text =
  "This week brings extra sun to your sill, water exactly on time, and a new leaf so fine the other plants will gossip.";

// The bounty requires 1-120 characters, not only white space, and a single
// line: fail loudly instead of writing an entry the judge would refuse.
// The gate is strict on purpose — the entry file must be exactly this one
// line, byte for byte: no carriage return (a second kind of line break),
// no leading or trailing padding (the judge reads the file as submitted),
// and no control characters.
const codePoints = [...text].length;
if (codePoints < 1 || codePoints > 120 || text.trim().length === 0) {
  throw new Error(
    `entry must be 1-120 characters of non-blank text, got ${codePoints}`,
  );
}
if (text.includes("\n") || text.includes("\r")) {
  throw new Error("entry must be a single line");
}
if (text !== text.trim()) {
  throw new Error("entry must not start or end with whitespace");
}
if (/[\u0000-\u001f\u007f]/.test(text)) {
  throw new Error("entry must not contain control characters");
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", text, "utf8");
chmodSync("/output/entry.txt", 0o644);

// Read it back and prove the file on disk is exactly the line: a write
// that silently truncated, re-encoded or padded the entry would otherwise
// ship a different text to the judge than the one gated above.
const written = readFileSync("/output/entry.txt", "utf8");
if (written !== text) {
  throw new Error("entry file does not match the gated line");
}
