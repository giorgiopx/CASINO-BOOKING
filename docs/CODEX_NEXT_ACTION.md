# CasinoBooking continuation — 19 October 2026

Continue the existing `giorgiopx/CASINO-BOOKING` repository on `feature/restore-lovable-casinobooking`, PR #1. Do not recreate the site or rewrite published Git history. The latest owner instruction prioritizes the frontend and leaves hosted CRM activation for the following phase.

## Already prepared

- Responsive EN/EL frontend with the complete sunset hero, 30 local generated travel illustrations, 15 countries and 51 operator-listed candidates plus the separately planned UAE project.
- All 13 original WebPs and the uploaded JPG are already present and hash-verified; another ZIP upload is not needed.
- Free enquiry forms and locally tested customer/staff CRM code, additive migration, and an isolated PostgreSQL permission test harness.
- Read [VERIFICATION_2026-10-19.md](VERIFICATION_2026-10-19.md) and [CRM_WORKFLOW.md](CRM_WORKFLOW.md) for exact test evidence and limitations. Do not substitute older summaries for the current record.

## Preview gate

Lovable still reports an older commit and must not be presented as the updated branch. Vercel classified an explicit staging build as production; that build was canceled. Automatic approval review rejected retrying the same deployment method. Do not repeat it unchanged. A deployment restricted to the existing protected `casinobooking-review` container even if labelled production requires the owner's specific approval, or a materially different verified preview mechanism. No custom domain, real customer data or automatic Git deployment belongs in that review container.

## Next CRM phase

1. Obtain authorized public app configuration and staging Auth/API access for the existing Supabase project. The direct Supabase connector returns no accessible projects, but the Lovable connector successfully reads schema metadata. Seven existing CRM tables have RLS enabled; the prepared new profile columns are absent. Never expose service-role credentials or change customer data to make a preview work.
2. Inspect the real schema and migration history before applying the prepared additive migration. Preserve existing data, roles and restrictive grants; never reset or replay broad initial grants.
3. Use dedicated synthetic staging customer A/B and administrator accounts. Verify real signup/email verification, immutable customer IDs, profile edits, persisted requests after refresh/relogin, customer isolation, staff status/history/notes/tasks and anonymous denial through Auth/API and actual browsers.
4. Complete verified business/contact/privacy details. Email automation remains a design specification in [EMAIL_REQUEST_AUTOMATION_FINAL_PHASE.md](EMAIL_REQUEST_AUTOMATION_FINAL_PHASE.md); no emails or WhatsApp messages are currently sent.
5. Select and verify ownership of the final domain; availability checks do not reserve it. Purchase, DNS configuration, production merge and publication remain separate release actions after applicable tests and owner authorization.

Use the existing CI and asset/browser checks on every release candidate. Local SQL policy tests and mocked component tests must not be described as hosted Auth or fully operational CRM certification.
