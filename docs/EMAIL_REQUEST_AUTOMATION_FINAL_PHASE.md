# CasinoBooking — secure request email automation handoff (NOT enabled)

Status: **design specification only**. No outgoing email provider, business inbox, API key or delivery automation is currently verified or enabled. Do not send production emails until dedicated staging CRM/RLS end-to-end tests pass and the owner supplies verified sending/receiving addresses.

## Required owner/provider decisions

- Verified sender domain and address (e.g. requests@**verified-owned-domain**) and monitored operations inbox. Do not guess the address or create DNS records without owner control.
- Pick a transactional email provider supporting verified domains, delivery webhooks, bounce handling, rate limits, and EU data-processing terms. Configure API credentials only in server-side secret storage, **not** GitHub files, frontend VITE_ variables, client JS or public logs.
- Establish privacy notice, lawful purpose/retention and data-processing settings. Do not include sensitive travel documents or unnecessary personal data in email bodies.

## Safe architecture

1. Customer A authenticates and submits the existing **free enquiry** in the database; the database issues its unique request `ref`. Successful persistence is independent of email delivery.
2. A trusted backend service registers one **pending outbox record** keyed by immutable event `enquiry-created:<enquiry_uuid>`; idempotent unique index prevents duplicate sends on refresh, retry or webhook replay. Never trust caller-provided role.
3. Server-only worker fetches the record with least-privilege credentials, checks feature flag `EMAIL_NOTIFICATIONS_ENABLED=true` plus verified provider settings, sends one admin notification referencing `ref` and dashboard URL and one customer receipt stating _request received, not a booking_. No casino partnership or confirmation claim.
4. Store each message's provider ID, delivery status, attempts, next retry, and redacted error. Exponential retries for transient faults; dead-letter after limit; avoid logging full PII or credentials.
5. Apply strong authentication and RLS to all private CRM and outbox views; customer B may never read A's requests; public clients may not change request status or emails. Admin dashboard uses existing trusted `user_roles` policies.
6. Audit admin status updates; email queue creation must not depend on the admin manually opening the dashboard. Customer can see request status even if email provider is unavailable.
7. Test exactly-once-ish delivery under replay, provider 429/500, permanent 4xx, expired token, bad destination, high volume, and database rollback. Document evidence and send test messages only to verified dedicated testing inboxes.

## Minimal staged acceptance checks

- [ ] Dedicated Supabase staging project: two **real** authenticated synthetic customer signups and distinct `customer_ref` values.
- [ ] A's travel request is persisted with unique `ref`, visible after logout/relogin/refresh; B cannot read/update A's private records; anonymous access denied.
- [ ] Trusted test admin signs in, sees A/B requests, changes status, creates note/task; audit entries persist.
- [ ] Outbox exactly one logical event per new request; replay does not generate duplicate notifications.
- [ ] Provider staging deliveries verified in recipient mailboxes (admin notification and customer acknowledgement); sender DNS SPF/DKIM and error handling verified.
- [ ] No notifications sent unless feature flag and sender/inbox configurations are validated.
- [ ] Owner signs off before production enablement; WhatsApp Business remains separately deferred.

## Preconditions and deployment

Never merge PR #1 or deploy this design-only spec as if email were live. Use the verified tested CRM schema, secure environment-specific secrets and backups. Send a separate approval request to owner when domain/provider, verified addresses and staging evidence are available. Payments and subscriptions are out of scope.
