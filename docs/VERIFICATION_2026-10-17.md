# CasinoBooking verification — 17 October 2026

Scope: existing `giorgiopx/CASINO-BOOKING`, branch `feature/restore-lovable-casinobooking`, PR #1. This update changes the application, not the production database.

## Completed code changes

- Unified visual-home/visual-more branding across public pages; responsive navigation, keyboard focus, Greek/English persistence and translated public copy.
- Integrated the user’s latest 1280×720 Mediterranean sunset JPG as the whole homepage background, with real bilingual typography and responsive text placement. No image generation, cropping, or recompression was used. SHA256: `c961e9f3a046bd3bcebce852f02eef5ab42a32dd73eee037780d90a082194a02`.
- Preserved all 13 approved image bytes and SHA256 checks. Fixed broken supplementary homepage image presentation without substituting different destination photos.
- Preserved the approved directory: 15 countries, 51 operator-listed candidates + 1 planned UAE project, clearly separated. Added bilingual search/locality labels and consistent request eligibility.
- Correct service defaults and complete date/traveller propagation from home links and direct URLs. Invalid dates, past dates, missing consent, invalid phones and unavailable venues are rejected.
- Preserved database-compatible service and request keys. Save success requires a returned server request reference; profile-refresh failure no longer prompts a duplicate submission. Auth/network failures are handled without crashing public browsing.
- Removed stale prototype wording that incorrectly described database-backed requests as memory-only. Account availability is explicit when backend configuration is missing.
- Added pinned browser tooling, a portable frozen Bun lockfile using the public npm registry, read-only CI checks, and noindex-by-default preview metadata. Automated formatting no longer writes commits onto the tested branch.

## Verification

- Frozen Bun install: passed after replacing inaccessible Lovable mirror URLs with public registry URLs, retaining versions and integrity hashes.
- Vercel-target build: passed locally.
- TypeScript: passed.
- ESLint: passed with 0 errors; 8 existing React Fast Refresh warnings remain.
- Unit tests: 35 passed across 4 files.
- Asset checks: all 13 original WebP files and the new, separate JPG passed SHA256 verification.
- Real Chromium: 10/10 public-flow groups passed locally at 1536, 768 and 390px, including Greek/English persistence and the new image decoding at 1280×720, uncropped 16:9 rendering, navigation, request defaults and validation. Zero uncaught page errors or attempted network writes. Desktop/tablet/mobile screenshots were also visually inspected. CI reruns these checks and attaches screenshots plus a structured report. These tests do not certify Supabase writes.
- Payment audit: no payment SDK, checkout, subscription billing or crypto integration was found in app/dependency code. Auth subscription cleanup and negative test strings are unrelated.

## Explicitly unverified / blocked

1. The Supabase connector exposes no accessible projects and denies the existing project ref `msombydwrpmjjmekypvt`. Lovable confirms its database is enabled, but existing public deployment configuration is not available through the tested connection. No database or customer data was modified. A preview without configuration disables account/submission actions honestly.
2. Real signup/email verification, login, persisted requests, separate customer sessions, admin CRM and role isolation are not certified by public UI tests. CRM certification is deferred as requested.
3. Email and WhatsApp Business automation remain unconnected. No notification delivery is claimed.
4. The latest user-supplied JPG is available and integrated. The earlier full reference PNG was unavailable here, so no pixel-difference certification against that older template is claimed. Original crops are intact. Supplementary directory photography remains dependent on external availability and licensing verification.
5. Legal/controller contact details, production domain/DNS, backup/monitoring and release review remain production gates. No merge or change to the existing live domain or Lovable publication was performed. See the temporary-hosting incident below.
6. The old Lovable preview is not proof of this branch. Vercel preview must be checked against its exact Git SHA; the PR records the resulting preview and deployment state.

## Temporary hosting scope and corrected target

The same existing repository is hosted in the separate Vercel preview container `casinobooking-preview`; it has no customer database settings or custom domain. The first deployment call omitted `target`, which Vercel unexpectedly classified as production for this new container. It was not a release to `casinobooking.com`. The temporary container’s production serving was subsequently paused. A protected HTTP fetch of its initial deployment returned **503 `DEPLOYMENT_PAUSED`**, confirming the block. Do not unpause it to create a preview.

All subsequent review deployments explicitly use `target: "staging"`. The latest staging URL, tested Git SHA and CI links are recorded in PR #1. Preview metadata defaults to `noindex`; temporary review links expire. Local real-browser checks and authenticated hosted HTTP checks are separate evidence, not a claim of a hosted authenticated CRM test.

This is a verified frontend increment with explicit integration gates, not a claim of 100% end-to-end readiness.
