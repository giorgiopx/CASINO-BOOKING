<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

## CasinoBooking.com scope — approved 14 October 2026

- STRICT DESIGN LOCK: the user's approved screenshot is the exact visual model. `src/components/casino/visual-home.tsx` and matching CSS are staged in this branch; the twelve approved image crops plus hero MUST be copied from the downloadable handoff ZIP to `public/design-reference/` before release. Do not replace these photo crops with others. Photos from the generated design are illustrative and not proof of a particular venue's appearance.
- UPDATE 17 October 2026: the user explicitly replaced the hero design with their supplied Mediterranean sunset JPG. Use `public/images/mediterranean-casino-sunset.jpg` in full without cropping on every viewport; keep real bilingual text and controls. Preserve the thirteen earlier WebP files unchanged. This user instruction supersedes the hero part of the strict design lock above.
- There are **NO paid memberships, Stripe, crypto, payments, checkouts or subscriptions**. All destination browsing and travel coordination enquiries are free. A gold VIP-style CTA in artwork means free concierge enquiry, not a paid plan.
- Public pages should advertise casino destinations with verifiable active venues only. Keep planned, closed or unverified casino venue records off verified public lists; never fabricate casino counts, formal partnerships, inventory, 24/7 service or security guarantees.
- Booking engine means multi-service TRAVEL ENQUIRIES pending manual supplier arrangements, NOT live flight/hotel/casino inventory or ticket issuance. Services: casino, flight, hotel, transfer, cruise and bundles; support groups, companies, adults, travel dates and preferences.
- Supabase cloud has authenticated accounts, unique generated customer refs and enquiry refs, RLS-protected profiles, enquiries, status history, itinerary_segments, admin notes and CRM tasks. DB changes from 14 Oct are in `supabase/migrations/20261014_travel_crm.sql`; don't regrant broad anon/auth privileges. Always test policy enforcement with two independent user sessions and admin session.
- Only admins via server-verified roles may read all client information, add CRM notes, create itinerary segments and change request statuses. A hidden UI link alone is never sufficient authorization. Keep private notes invisible to clients.
- Email and WhatsApp Business API notifications are deliberately POSTPONED to the final phase until the owner creates a business address and approved WhatsApp Business phone/account. UI MUST show correct not-yet-connected message. No fake successful sending.
- `src/routes/portal.tsx` is redirected to authenticated dashboard, to close the old public demo CRM.
- Stack: React 19, TanStack Start, Vite, TypeScript, Supabase. GitHub repository `giorgiopx/CASINO-BOOKING`, feature branch `feature/restore-lovable-casinobooking`, draft PR #1. Lovable project ID `6a0edc79-9b33-4814-81bd-abcd323cb86e`, not confirmed to sync with GitHub branch.
- CI runs Bun install, type-check, build, unit test and formatting/lint. A passing CI does NOT mean auth/RLS/payment/notification end-to-end testing passed; do not merge before E2E, privacy and image-asset verification.
- NEVER commit .env secrets, service-role keys, signed customer documents or real customer datasets. Use fake examples for previews.
