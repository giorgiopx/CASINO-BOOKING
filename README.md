# CasinoBooking.com

The existing React 19 / TanStack Start / TypeScript / Supabase application on `feature/restore-lovable-casinobooking`, reviewed in [PR #1](https://github.com/giorgiopx/CASINO-BOOKING/pull/1). No production merge or deployment is authorized by this preview work.

## Current implementation

- Shared responsive navy, champagne gold and ivory interface based on the existing `visual-home` and `visual-more` design. All 13 approved WebP files are preserved byte-for-byte and checked with SHA256.
- The full-composition Mediterranean sunset render is the homepage background, with live bilingual text and controls. Its native size is 1672×941, not 4K. On screens up to 900px, copy sits beneath the whole image to preserve legibility and every edge. The original uploaded JPG is preserved separately and verified by SHA256.
- Country, regional and cruise imagery is served from local WebP assets with explicit AI editorial provenance. Generated images are travel illustrations, not verified photographs of the named casinos. Asset manifests record actual dimensions, byte counts and SHA256 hashes; original-to-delivery lossless encoding is checked separately.
- English and Greek public interface, persistent language preference, working navigation and validated search-to-enquiry defaults.
- 15 countries, 51 operator-listed venue candidates, plus one separately marked planned UAE project. Russia is informational; planned and restricted venues are excluded from enquiry choices. Official source links and research dates are retained; listings are not live inventory.
- Free enquiries for concierge, hotels, flights, transfers, cruises and packages. No Stripe, cryptocurrency, paid memberships, checkout or subscriptions.
- Prepared CRM additions include individual/company customer cards, immutable IDs, contact details, country and service selections, staff customer/request lists, status history, notes and tasks. The migration is additive and local only; no hosted customer data or schema was changed. Per the owner's latest instruction, hosted CRM activation and certification remain the next phase. See [CRM workflow and verification limits](docs/CRM_WORKFLOW.md).

## Preview limitations

A preview without the existing Supabase public URL and publishable key remains fully browsable and explicitly disables account/submission actions. It does not simulate successful requests. The current connection cannot access that project's public deployment configuration. Actual signup, saved requests, customer isolation and admin CRM require separate authenticated staging verification. Email/WhatsApp automation remains deferred.

The user's later photo/render instructions supersede the original hero and photo display lock. The earlier `Luxury Casino Travel Homepage.png` is not present in this checkout. The implementation preserves the existing approved components and original 13 assets; pixel-identical comparison to that full reference has not been performed. Visible destination images have loading and unavailable states.

No current remote preview URL is certified for these changes. Lovable still reports an older commit. The Vercel review build was canceled after the API unexpectedly assigned the production target despite a staging request; repeating that method was rejected by automatic approval review. No production merge or further deployment was performed. Local browser screenshots and the branch are the reviewable deliverables until that hosting gate is resolved.

## Run and verify

```sh
bun install --frozen-lockfile
bun run dev
bun run build
bun run typecheck
bun run lint
bun run test
bun run test:assets
bun run test:crm:local # Docker; disposable local PostgreSQL, synthetic SQL auth contexts
```

For Vercel output: `NITRO_PRESET=vercel bun run build`. The existing Lovable config also detects Vercel automatically.

For real public browser checks, run the local app on port 4173, install Chromium with `bunx playwright install chromium`, then run `bun run test:browser`. An installed system Chromium can be selected with `PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium`. Screenshots and a structured report are saved under `artifacts/browser-smoke/`. The suite blocks write requests and does **not** certify authenticated Supabase or CRM behavior.

Use `.env.example` for public Supabase settings only. Never commit `.env`, service-role keys or customer information. Search indexing defaults to disabled until release review; set `VITE_PUBLIC_INDEXING=true` only for an approved production release.

See [the latest verification record](docs/VERIFICATION_2026-10-19.md) and [Issue #2](https://github.com/giorgiopx/CASINO-BOOKING/issues/2) for remaining release gates. The local SQL harness is not hosted Supabase Auth/PostgREST or authenticated-browser E2E certification.
