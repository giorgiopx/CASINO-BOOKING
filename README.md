# CasinoBooking.com — Free European Casino Travel Enquiry Platform

This is the **existing** Lovable CasinoBooking.com React + TanStack Start + TypeScript + Supabase application, restored on GitHub as a **draft feature branch**, not a finished production deployment.

**Latest business decision:** NO subscriptions, VIP payments, online checkout, Stripe, cryptocurrency payments, online gambling or customer charges. Browsing and travel-coordination requests are free.

## Approved design

The user-approved midnight-navy + champagne-gold screenshot is immutable as the design reference. The React code in `src/components/casino/visual-home.tsx` and its CSS are committed. **CRITICAL**: exact approved image crops must still be copied from `CasinoBooking_Phase3_Final_Handoff_2026-10-14.zip` to `public/design-reference/*.webp` before the visual page works. Image crops are illustrative editorial mockups, NOT verified casino-property photographs. Public venue listings must use verifiable official sources and image rights.

## User and CRM features (code implemented; end-to-end verification pending)

- Supabase Auth; server-generated customer refs and enquiry refs.
- RLS-protected customer profiles, individual/corporate details and status dashboards.
- Multi-service enquiry form: casino, flights, hotel, transfers, cruise and packages with dates, traveler count and travel preferences.
- Admin CRM with customer files, status tracking, segments of travel itinerary, private notes and internal tasks.
- The old public demo CRM route /portal redirects to authenticated /dashboard.
- Supabase migration `supabase/migrations/20261014_travel_crm.sql` has been applied on Lovable Cloud. Do not rerun it blindly in another environment or loosen access grants.
- Professional email and WhatsApp Business automation are **intentionally deferred** until last stage and owner provides business accounts/number. Do not claim messages were delivered or bookings confirmed.

## Source and testing

Repository: https://github.com/giorgiopx/CASINO-BOOKING
Review branch: `feature/restore-lovable-casinobooking`
Draft PR: https://github.com/giorgiopx/CASINO-BOOKING/pull/1
Lovable editor: https://lovable.dev/projects/6a0edc79-9b33-4814-81bd-abcd323cb86e

CI currently runs Bun install, TypeScript check, build, existing single unit test, prettier and lint. **Successful CI is not proof of real account/RLS/browser E2E tests or readiness for live customer data**.

## Before launch

Copy photo assets, test 2 independent accounts + admin role, confirm RLS, request submission and CRUD in browser; verify compliance/privacy/official casino sources/age requirements, choose hosting and env secrets, backups and proper domain/DNS, then deploy ONLY after user approves. This system coordinates **enquiries**, not automated supplier booking inventory/flight ticket issuance.

Installation: `bun install`; local dev `bun run dev`; checks `bunx tsc --noEmit && bun run build && bun run test && bunx prettier --write . && bunx eslint . --fix && bun run lint`. Never commit a real `.env` file or service-role credentials.
