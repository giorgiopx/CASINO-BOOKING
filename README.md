# CasinoBooking.com

The existing React 19 / TanStack Start / TypeScript / Supabase application on `feature/restore-lovable-casinobooking`, reviewed in [PR #1](https://github.com/giorgiopx/CASINO-BOOKING/pull/1). No production merge or deployment is authorized by this preview work.

## Current implementation

- Shared responsive navy, champagne gold and ivory interface based on the existing `visual-home` and `visual-more` design. All 13 approved WebP files are preserved byte-for-byte and checked with SHA256.
- The user-supplied Mediterranean sunset JPG is the full-width, uncropped 16:9 homepage background, with live bilingual text and icons. On screens up to 900px, copy sits beneath the whole photograph to preserve legibility and every image edge. The original JPG bytes are verified separately by SHA256.
- English and Greek public interface, persistent language preference, working navigation and validated search-to-enquiry defaults.
- 15 countries, 51 operator-listed venue candidates, plus one separately marked planned UAE project. Russia is informational; planned and restricted venues are excluded from enquiry choices. Official source links and research dates are retained; listings are not live inventory.
- Free enquiries for concierge, hotels, flights, transfers, cruises and packages. No Stripe, cryptocurrency, paid memberships, checkout or subscriptions.
- Existing Supabase profiles, requests, auth, RLS and CRM code preserved. No database migration or customer-data changes were made in this update.

## Preview limitations

A preview without the existing Supabase public URL and publishable key remains fully browsable and explicitly disables account/submission actions. It does not simulate successful requests. The current connection cannot access that project's public deployment configuration. Actual signup, saved requests, customer isolation and admin CRM require separate authenticated staging verification. Email/WhatsApp automation remains deferred.

The user’s 17 October photo instruction supersedes the original hero composition. The earlier `Luxury Casino Travel Homepage.png` is not present in this checkout. The implementation preserves the existing approved components and exact 13 crops; pixel-identical comparison to that full reference has not been performed. Supplementary homepage region/cruise panels use deliberate graphics instead of broken external image links. Supplemental directory images have an explicit unavailable fallback.

## Run and verify

```sh
bun install --frozen-lockfile
bun run dev
bun run build
bun run typecheck
bun run lint
bun run test
bun run test:assets
```

For Vercel output: `NITRO_PRESET=vercel bun run build`. The existing Lovable config also detects Vercel automatically.

For real public browser checks, run the local app on port 4173, install Chromium with `bunx playwright install chromium`, then run `bun run test:browser`. An installed system Chromium can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Screenshots and a structured report are saved under `artifacts/browser-smoke/`. The suite blocks write requests and does **not** certify authenticated Supabase or CRM behavior.

Use `.env.example` for public Supabase settings only. Never commit `.env`, service-role keys or customer information. Search indexing defaults to disabled until release review; set `VITE_PUBLIC_INDEXING=true` only for an approved production release.

See [the latest verification record](docs/VERIFICATION_2026-10-17.md) and [Issue #2](https://github.com/giorgiopx/CASINO-BOOKING/issues/2) for remaining release gates.
