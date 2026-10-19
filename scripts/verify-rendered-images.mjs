/** Checks generated delivery assets without modifying the preserved originals. */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync, statSync } from "node:fs";
import { resolve } from "node:path";

const expectedSlugs = [
  "mediterranean-casino-sunset",
  "monaco",
  "cyprus",
  "greece",
  "italy",
  "france",
  "spain",
  "portugal",
  "serbia",
  "romania",
  "slovenia",
  "bulgaria",
  "croatia",
  "usa",
  "russia",
  "uae",
  "region-las-vegas",
  "region-miami",
  "region-tampa",
  "region-southern-california",
  "region-northern-california",
  "region-new-york",
  "region-atlantic-city",
  "region-connecticut",
  "region-national-harbor",
  "region-biloxi",
  "region-durant",
  "cruise-mediterranean",
  "cruise-islands",
  "cruise-ocean",
];

export const renderedImages = [
  "main-manifest.json",
  "regional-manifest.json",
].flatMap((name) => {
  const manifest = JSON.parse(
    readFileSync(resolve("public/images/rendered", name), "utf8"),
  );
  assert.ok(Array.isArray(manifest.images), `${name}: missing images`);
  return manifest.images;
});

assert.deepEqual(
  renderedImages.map((item) => item.slug).sort(),
  expectedSlugs.sort(),
  "All 30 distinct delivery illustrations must be present",
);

function webpDimensions(bytes) {
  assert.equal(bytes.toString("ascii", 0, 4), "RIFF");
  assert.equal(bytes.toString("ascii", 8, 12), "WEBP");
  assert.equal(
    bytes.readUInt32LE(4) + 8,
    bytes.length,
    "Complete WebP RIFF container",
  );
  for (let offset = 12; offset + 8 <= bytes.length;) {
    const type = bytes.toString("ascii", offset, offset + 4);
    const length = bytes.readUInt32LE(offset + 4);
    const data = offset + 8;
    assert.ok(data + length <= bytes.length, "Complete WebP chunk");
    if (type === "VP8X")
      return [
        bytes.readUIntLE(data + 4, 3) + 1,
        bytes.readUIntLE(data + 7, 3) + 1,
      ];
    if (type === "VP8L") {
      assert.equal(bytes[data], 0x2f, "Lossless WebP signature");
      const bits = bytes.readUInt32LE(data + 1);
      return [(bits & 0x3fff) + 1, ((bits >>> 14) & 0x3fff) + 1];
    }
    if (type === "VP8 ")
      return [
        bytes.readUInt16LE(data + 6) & 0x3fff,
        bytes.readUInt16LE(data + 8) & 0x3fff,
      ];
    offset = data + length + (length % 2);
  }
  throw new Error("WebP dimensions missing");
}

let totalBytes = 0;
for (const item of renderedImages) {
  assert.equal(
    item.file,
    `/images/rendered/${item.slug}.webp`,
    "Local asset path matches slug",
  );
  const file = resolve("public", item.file.slice(1));
  const bytes = readFileSync(file);
  assert.equal(statSync(file).size, item.bytes, `${item.slug}: byte count`);
  assert.equal(
    createHash("sha256").update(bytes).digest("hex"),
    item.sha256,
    `${item.slug}: SHA256`,
  );
  assert.deepEqual(
    webpDimensions(bytes),
    [item.width, item.height],
    `${item.slug}: actual dimensions`,
  );
  assert.ok(
    item.width >= 1500 && item.height >= 800,
    `${item.slug}: native resolution`,
  );
  totalBytes += bytes.length;
}
console.log(
  `PASS: ${renderedImages.length} generated WebPs verified: hashes, dimensions and complete containers (${(totalBytes / 1024 / 1024).toFixed(1)} MiB total, lazy loaded in the UI).`,
);
