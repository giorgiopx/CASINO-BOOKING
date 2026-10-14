# CODEX — Complete CasinoBooking before main merge (requires user's ZIP and staging access)

Repo: giorgiopx/CASINO-BOOKING
Work only on: feature/restore-lovable-casinobooking
PR: https://github.com/giorgiopx/CASINO-BOOKING/pull/1
Source of truth: existing Lovable project 6a0edc79-9b33-4814-81bd-abcd323cb86e; its GitHub synchronization is NOT verified.
DO NOT merge or publish automatically unless every listed gate is confirmed and user approves.

## Critical asset import (FIRST)

The user will attach `CasinoBooking_Design_and_GitHub_Handoff_2026-10-14.zip` containing EXACT approved photos. From repository root run:

```bash
node scripts/import-approved-design.mjs /path/to/CasinoBooking_Design_and_GitHub_Handoff_2026-10-14.zip
git add public/design-reference
git commit -m "Import exact approved CasinoBooking design photos"
git push origin feature/restore-lovable-casinobooking
```

Script SHA256-validates all 13 WebP photos. Do not change visual design or crop selection. Never replace with unrelated stock images.

## Review gates

1. `bun install && bun run build && bunx tsc --noEmit && bun run lint && bun run test`
2. Inspect `/global-casinos`, `/request`, `/auth`, `/dashboard`, `/admin` and 12 original European photo cards on desktop/tablet/phone; capture screenshots.
3. Confirm all 18 US operating venue rows and Wynn Al Marjan planned-only record, with official links and region photo attribution; no partnership claims or invented inventory.
4. Create separate staging Supabase project and three synthetic verified accounts (Customer A, Customer B, Admin). Provision admin role using trusted DB role assignment, never client-side. Configure GitHub environment `casino-staging` secrets listed in `.github/workflows/staging-crm-e2e.yml`. Manually run that workflow and require passing role isolation, request insert, admin status history, unique IDs. Never pass real customer PII or live service keys.
5. Real browser test against staging app: signup email verification, customer profile save, create trip request (casino+flights+hotel+transfer), verify dashboard, admin task/note/status, access rejection for B, logout/session rotation. Resolve all errors.
6. Confirm consent/age UI, privacy policy, regulated travel and land casino promotional restrictions, original photo rights, monitoring, backups, abuse/rate limits, secret handling, HTTPS, domain ownership, custom-domain DNS, Search Console.
7. Confirm production platform and domain `casinobooking.com` owner control; no connection has been verified. Do not deploy the older Lovable version as if it contained GitHub changes.
8. Email/WhatsApp Business remain for the final phase. Absolutely no payments/subscriptions.

## Publishing rule

Only after passing every gate and confirming deploy target: require explicit owner release approval; merge PR #1 then deploy exactly the tested commit to verified hosting. Smoke-test live URL; add Google Search Console DNS verification, sitemap. Google indexing is not guaranteed.
