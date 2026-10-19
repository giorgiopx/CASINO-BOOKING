# CasinoBooking verification — 19 October 2026

Scope: the existing `giorgiopx/CASINO-BOOKING` application, branch `feature/restore-lovable-casinobooking`, PR #1. No replacement website, production merge, domain purchase, hosted database migration or customer-data change was made in this update.

## Delivered code and imagery

- The homepage immediately shows the full Mediterranean sunset composition. The generated derivative is 1672×941 with native proportions, eager loading and preload. Real bilingual text and controls overlay it on desktop and sit below the complete image on mobile/tablet.
- Thirty local AI editorial illustrations cover the hero, 15 countries, 11 US regions and three cruise scenes. They replace low-resolution display crops, external photo dependencies and graphic placeholder panels. The original 13 WebPs and the owner's 1280×720 JPG remain byte-identical.
- Generated delivery images are 1536–1672 pixels wide, not 4K. Their total payload is 66,129,588 bytes (63.1 MiB), predominantly loaded lazily. Native PNG-to-WebP conversion was lossless with zero pixel differences for every asset. This preserves visual detail but is not a measured mobile-network performance budget; field Core Web Vitals and bandwidth optimization remain unverified.
- Image loading and failure states are visible and translated. AI provenance is explicit; generated scenes are not presented as verified photographs of actual casino properties. The manifests record dimensions, bytes, hashes and local generation provenance.
- The directory retains 15 countries and 51 operator-listed candidates, plus the separately marked planned UAE project. Source links and research dates remain; these are not claims of current live inventory or supplier partnerships.
- The EN/EL interface includes navigation, filters, destination pages, service choices, search-to-request defaults and validated free enquiry forms. Business requests require a company name. Confirmed request references remain successful if later cache/profile refreshes fail, and in-flight duplicate submissions are blocked. No payments, Stripe, crypto, paid memberships or checkout are connected.

## Local checks

| Check                                  | Result                                                                                                         |
| -------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Bun 1.3.2 frozen lockfile install      | Passed; lockfile unchanged                                                                                     |
| Vercel-target production build         | Passed with all generated assets present                                                                       |
| TypeScript                             | Passed                                                                                                         |
| ESLint                                 | Zero errors; eight pre-existing React Fast Refresh warnings                                                    |
| Prettier source/package/browser script | Passed                                                                                                         |
| Unit/component tests                   | 54 tests across 10 files passed                                                                                |
| Original image checks                  | 13 WebP SHA256 checks and exact uploaded JPG passed                                                            |
| Generated image checks                 | All 30 hashes, actual WebP dimensions and complete RIFF containers passed                                      |
| Isolated PostgreSQL policy tests       | 26 checks passed                                                                                               |
| Public Chromium suite                  | 12/12 groups passed at 1536/768/390px in EN/EL; zero uncaught browser errors and zero attempted network writes |

The browser suite checks every displayed homepage illustration, all 30 native delivery images plus preserved originals, the full uncropped hero, social/search landing URLs, language persistence, keyboard-focus navigation to the enquiry form, directory filters, request defaults and company validation, anonymous account guards, public links and absence of payment controls. A failed-image hydration defect found during verification was fixed and retested: images that fail before React attaches handlers now display a visible unavailable state and recover on reload after the source returns.

Review the real [desktop](preview/home-desktop-el.png), [tablet](preview/home-tablet-el.png), [mobile](preview/home-mobile-el.png) and [country-grid](preview/country-grid-en.png) screenshots. The machine-readable [browser report](verification/browser-2026-10-19.json) records the exact run and scope. These show the running local application, not design mockups.

The component tests use synthetic adapters. They test form behavior, cache updates and failure handling, not connectivity to hosted Supabase. The PostgreSQL harness runs real SQL privileges and RLS in a disposable Docker container with no network or exposed port. It simulates SQL Auth identity contexts for two customers and an administrator. It is **not** a Supabase Auth/PostgREST sign-in test.

## CRM handoff

CRM code is prepared and locally tested: immutable customer references, individual/company category, first/last name, mobile, Auth-derived read-only email, country, six service choices, searchable staff customer/request lists, 100-row load-more pagination, status history, private notes and tasks. Profile and request status cache writes remain scoped to the signed-in account. Existing full names, country text and IDs are preserved.

The additive migration `20261018112418_customer_profile_details.sql` is local only. The owner's latest 19 October instruction leaves hosted CRM activation/certification for the next phase. See [CRM_WORKFLOW.md](CRM_WORKFLOW.md) for the precise contract, local test coverage and remaining hosted checks.

The direct Supabase connector was rechecked on 19 October and returned `{"projects":[]}`. A later read-only check through the existing Lovable connector confirmed that Supabase is enabled and exposed schema metadata for `profiles`, `enquiries`, `user_roles`, `enquiry_status_events`, `itinerary_segments`, `crm_notes` and `crm_tasks`. All seven have RLS enabled. The new profile columns `first_name`, `last_name`, `email` and `services` are absent, confirming the prepared migration is not applied. No customer records were read and no remote writes were performed.

This metadata inspection does not certify full schema/migration-history reconciliation, policy enforcement, security-advisor review, actual signup, persisted requests, two-customer/admin API isolation or authenticated CRM browser flows. Public app configuration remains unavailable. An unconfigured preview explicitly disables account/submission actions and never simulates a successful save. Email/WhatsApp delivery remains disconnected.

## Remote preview and publication

**There is no certified remote preview URL for this revision.** The functioning local app and real-browser screenshots are the reviewable frontend evidence.

Lovable was rechecked on 19 October and still reports commit `d2e60fc270c5e269bb0e5d3a39b7ef3dacfc8455`, last edited 16 October. Its existing preview is not this branch's new frontend.

Vercel's protected review deployment `dpl_HpC2cN1dZ3zauN4kekJrVvoGstwR` was rechecked and remains **CANCELED**. It had unexpectedly received target `production` despite an explicit staging request. The automatic approval review rejected repeating the unchanged deployment method because it could create another unapproved production-target deployment. No retry or workaround of that rejection was performed. A deployment limited to the isolated protected `casinobooking-review` project, even if labelled production by Vercel, still requires the owner's specific approval or a materially different verified preview method. No custom domain, real customer data or automatic Git deployment is part of that prepared review container. Earlier hosting evidence is retained in [the 17 October record](VERIFICATION_2026-10-17.md).

Production release also needs verified business contact/data-controller details and domain selection. On the read-only 18 October availability check, `.com` was unavailable, `.net` and `.info` were available, and `.gr` was not determined by the provider. Availability is time-sensitive; no reservation or purchase was made.

Passing local or GitHub public-frontend checks does not establish a fully operational hosted business system. Do not merge or claim 100% end-to-end completion on this evidence.
