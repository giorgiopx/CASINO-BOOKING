# CasinoBooking — database isolation QA (15 October 2026)

## Test method

A transaction-scoped, **ROLLBACK-only** SQL integration probe was run against the existing Lovable/Supabase PostgreSQL database. Three synthetic temporary auth.users identities were inserted (customer A, customer B and administrator) with non-deliverable example.invalid email addresses. The existing PostgreSQL registration trigger created their profiles and customer references. All changes were rolled back.

During the transaction the session assumed PostgreSQL role `authenticated` and set `request.jwt.claim.sub` to A, B or admin. These impersonations test the actual **database RLS and trigger rules**, not Supabase's password authentication API or the browser UI.

## Passed checks

- [x] Three distinct non-empty customer refs were generated automatically by PostgreSQL.
- [x] Under A's auth identity, A could read their profile; B's profile was hidden.
- [x] A inserted a synthetic request including Bellagio Las Vegas, departure and return dates, two travellers, and casino/flight/hotel/transfer services.
- [x] The database created a unique CB- request reference and new status.
- [x] Under B's auth identity, A's request was not visible, and status updates affected zero rows.
- [x] Under an admin role, A's request was visible, the status could be changed to reviewing and the status audit event was recorded.
- [x] An explicit ROLLBACK ran. A subsequent read-only check confirmed **0 synthetic auth.users and 0 synthetic enquiries remained**.

## Not yet tested

- [ ] Real `signUp` / email confirmation / `signInWithPassword` through Supabase Auth.
- [ ] Browser UI registration, persistence across reload, customer dashboard and CRM screen rendering.
- [ ] Actual admin account provisioning, current session browser authorization and permission audit.
- [ ] Image presence and SHA256, responsive browser visual review.
- [ ] Domain ownership/DNS SSL, Cloudflare/Netlify deployment, production backups.

**Release gate:** these SQL results do NOT justify going live or accepting real personal data. Keep PR draft until GitHub image check, true staging browser/auth test and deployment review pass. Email/WhatsApp Business remain explicitly deferred.
