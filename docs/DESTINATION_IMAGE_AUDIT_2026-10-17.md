# Destination image audit — 17 October 2026

Historical baseline: the later owner-authorized image renders supersede the display-source findings below. Originals remain preserved; current delivery assets and test results are documented in [VERIFICATION_2026-10-19.md](VERIFICATION_2026-10-19.md).

## Local assets and provenance

The repository has no `public/countries/` directory. The available local assets are the 13 original approved WebP crops in `public/design-reference/` and the separately supplied `public/images/mediterranean-casino-sunset.jpg`.

The WebP files come from the user's approved design handoff. As recorded in `AGENTS.md`, these are illustrative design crops, not independently verified photographs of particular venues. They are preserved byte for byte. No new rights or real-location claims are made for them.

The sunset is the user's supplied image, preserved in full without image processing. Its SHA256 is `c961e9f3a046bd3bcebce852f02eef5ab42a32dd73eee037780d90a082194a02`. It measures 1280 × 720 pixels and contains 304,468 bytes.

| Original asset        | Dimensions |   Bytes |
| --------------------- | ---------- | ------: |
| `hero-reference.webp` | 1136 × 265 | 109,994 |
| `monaco.webp`         | 232 × 144  |  16,534 |
| `cyprus.webp`         | 232 × 144  |  16,108 |
| `greece.webp`         | 232 × 144  |  17,970 |
| `italy.webp`          | 232 × 144  |  16,320 |
| `france.webp`         | 233 × 144  |   9,414 |
| `spain.webp`          | 232 × 144  |  16,058 |
| `portugal.webp`       | 232 × 137  |  16,514 |
| `serbia.webp`         | 232 × 137  |  14,234 |
| `romania.webp`        | 232 × 137  |  14,770 |
| `slovenia.webp`       | 232 × 137  |  17,912 |
| `bulgaria.webp`       | 233 × 137  |  15,658 |
| `croatia.webp`        | 232 × 137  |  14,428 |

All 14 image files decoded successfully with Pillow. `node scripts/import-approved-design.mjs` passed every original SHA256 check plus the separate supplied-sunset check. The 12 country crops are thumbnail resolution; large cards or full-width banners cannot recover detail absent from these sources. Natural colors should be preserved without saturation, contrast or hue filters.

## External sources and precise access constraint

`src/lib/global-casino-catalog.ts` contains 12 Wikimedia Commons source records, with filename, author, license label and source-page URL. `src/lib/approved-casino-directory.ts` adds country-level links for the United States, Russia and UAE. The Russia record does not supply an author/license. These are pre-existing metadata, not licenses or image availability independently reverified by this audit.

The current managed environment reports an enforced restricted network policy with package-manager hosts only; `commons.wikimedia.org` and `upload.wikimedia.org` are absent. A single bounded request to the existing Las Vegas `Special:FilePath` URL returned curl exit 7, `Failed to connect to proxy port 8080`, before any remote HTTP response. Thus this audit cannot distinguish missing Commons files from network unavailability, verify current licensing, or download approved originals. No proxy bypass or further blocked-host attempts were made.

No new destination photos were downloaded, generated, substituted, or presented as verified location photography. No new author/license attribution was invented. To complete full-resolution real destination photography, obtain source files together with their source pages, creator names and reusable licenses through permitted access or an owner-supplied handoff, then verify subject/location and image decoding before adding local copies.

## Resilient display

The global directory, country directory and country detail pages now use the existing shared `DestinationImage` component. Failed sources display a bilingual, explicitly labeled unavailable state instead of silently disappearing into an empty banner. Loading and unavailable accessibility labels are distinct. Images decoded before React attaches its load handler are recognized when their element mounts, preventing a cached image from remaining invisible during hydration. Valid sources still render the actual image, and the existing source credits remain available. Placeholder labels describe missing photography; they are not replacement photographs or evidence of a destination's appearance.
