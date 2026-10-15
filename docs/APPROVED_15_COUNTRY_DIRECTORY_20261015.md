# CasinoBooking.com — APPROVED 15-country editorial directory (2026-10-15)

## Business and design decisions
The owner expressly approved exactly **15 destination countries; 51 selected non-planned gaming venues; 1 planned UAE project**. These are selected **listings** (not total casino counts per country, not live booking inventory, and no operator partnerships).

**DO NOT CHANGE** the previously owner-approved midnight navy/champagne gold/ivory visual design and the original 12 European countries/images; the international (USA, Russia, UAE) section follows directly underneath the existing European photo cards.

- No paid membership, Stripe, crypto, checkout or charges.
- Free travel coordination enquiries only: flights, hotels, transfers, cruises, entire trip.
- Enquiry submission is **NOT** confirmation of any hotel/flight/casino visit.
- The user postponed the remaining CRM and email/WhatsApp Business automations to later milestones.

## Approved countries and counts (selection, not nationwide totals)

| Group | Country | Selected non-planned venues |
| --- | --- | ---: |
| Europe | Monaco | 2 |
| Europe | Cyprus | 4 |
| Europe | Greece | 3 |
| Europe | Italy | 3 |
| Europe | France | 2 |
| Europe | Spain | 4 |
| Europe | Portugal | 4 |
| Europe | Serbia | 1 |
| Europe | Romania | 1 |
| Europe | Slovenia | 4 |
| Europe | Bulgaria | 1 |
| Europe | Croatia | 1 |
| International | United States | 18 |
| International | Russia | 3 |
| International | United Arab Emirates | 0 active + 1 planned (Wynn Al Marjan Island, expected 2027) |
| | **Totals** | **51 selected non-planned + 1 future** |

## App implementation in this change
1. `src/lib/approved-casino-directory.ts` — canonical typed country and venue catalogue. 30 European listings, 3 Russia, imported existing 18 USA records, plus a separate Wynn planned record, all with direct operator sources and source-checked date.
2. `src/routes/destinations.tsx` — bilingual, searchable fifteen-country directory in owner-approved colors and card style. Original European image paths retained; USA/Russia/UAE use distinct independent, attributed landscape imagery.
3. `src/routes/casino-country.$slug.tsx` — country pages listing related casinos, operator links, city and status and links to the existing free travel request form. UAE has no active casino request link.
4. `src/components/casino/visual-home.tsx` — original European twelve cards and photos remain, but their 'Explore' links now lead to country/casino details. Appends exactly three global-country image cards (USA/Russia/UAE) below existing cards.
5. `src/components/casino/request.tsx` and `src/lib/casino-request-schema.ts` — only approved non-planned country names or operating-candidate casino names are selectable and accepted.
6. `src/test/approved-directory.test.ts` — asserts totals and country order, operator source links and valid enquiry choices, ensuring Wynn and unapproved planned projects cannot be requested as an operating casino.

## Reality and legal notices
- USA uses the existing independent casino research catalogue, not any commercial partnership.
- Some locations (e.g., Yonkers) are electronic gaming, not identical to a traditional casino.
- UAE Wynn Al Marjan Island is a **future 2027** development, not a current casino: https://www.newsroom.wynnresorts.com/en/wynnalmarjan/
- Russian venues: Casino Sochi (https://en.krasnayapolyana.game/place/casinosochi), Sobranie (https://www.sobranie-casino.com/en/), Shambala (https://www.shambalacasino.ru/main-eng). Require separate legal sanctions, transport, payment and travel-safety eligibility review prior to offering coordination to a specific user.
- Cyprus satellites and all operating hours/regulatory licences must be reconfirmed directly with the operator prior to travel; historical site listings are not proof of real-time availability.
- The official operator URLs are informational and do not imply permission to reuse their proprietary photos. New regional photos are editorial Wikimedia Commons references; review exact licensing/attribution before public release. **No claim** of genuine individual venue photographs unless specifically cleared.
- Design screenshot images for original twelve European country cards are still required in `public/design-reference/*.webp`. Their original ZIP lives in the conversation/handoff, but the GitHub branch must have those binary assets committed separately. Do not substitute other stock photos.

## Deployment gates
This is a **feature branch**, not a production release. Existing `feature/restore-lovable-casinobooking` main development branch was already missing some approved binary image files, so its dedicated design check still fails. Lovable production runs in a separate codebase not proven to sync from GitHub. Do not merge into `main` or publish to `casino-booking-com.lovable.app` until design images, browser smoke tests, Supabase end-to-end permissions and deployment targets are verified.
