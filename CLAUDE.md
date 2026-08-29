# CLAUDE.md

Guidance for any Claude (or other AI coding agent) session working in this repository. Read this in full before writing or modifying code.

> **Security review note (2026-08-23):** the Security Requirements section below was audited against OWASP Top 10:2025, the OWASP Top 10 for LLM Applications 2026, and PCI DSS 4.0.1 — several gaps from the first draft are now filled in. Re-run this kind of review periodically; these lists change.

## Project scope

**AI ProServices** (`aiproservicescorp.com` — name finalized, domain owned) builds websites and AI agents for small businesses that don't have either yet, starting in Indiana and starting with a small portfolio before scaling niches. The company is a solo operation run by a software developer/entrepreneur, so code quality and security have to hold up without a team behind them.

### What this codebase delivers

- **Marketing site** — homepage splitting into two paths: "Build My Website" (niche picker: food truck, contractor, more later) and "Get an AI Agent" (niche picker: Window & Door Estimator, Messaging Agent, general Estimator Agent). Service pages, portfolio/gallery, testimonials, blog.
- **Booking** — an embedded scheduler (Calendly/Cal.com or equivalent) synced two-way with the business Microsoft 365 calendar on `aiproservicescorp.com`. Do not build a custom calendar/availability engine unless the embedded option is explicitly abandoned — see the launch plan's rationale.
- **Payments** — Stripe Checkout/Elements for deposit-or-full payment at time of booking. See Security Requirements below before touching any payment code.
- **Flagship package: food truck ordering + AI agent** — an ordering site with Stripe/Apple Pay/Google Pay checkout, an AI messaging agent across Instagram, WhatsApp, and Facebook Messenger (FAQ/hours/location/specials), order-delivery integration, and a traffic/revenue dashboard.
- **Estimator agents** — interactive quote calculators (Window & Door Estimator now, general Estimator Agent for other trades later). Build this as a pluggable pricing-rules engine, not one-off per-client code — see SOLID section.
- **Client portal** — authenticated area where clients see their appointments, estimates, and invoices.
- **Meeting tracking** — a simple calendar view is the system of record; no separate CRM in scope yet.

Full business context, pricing, registration steps, and the visual/brand direction live in the project's launch plan — consult it for anything not covered here (naming, pricing, timeline, palette/type choices).

## Tech stack

**Current state (2026-08-28):** the marketing site (homepage, niche-picker pages, pricing, portfolio, blog, about, contact, and the two draft legal pages) is live as static HTML/CSS/JS in [`site/`](site/) — no framework, no build step. This was the fastest path to a real, viewable deliverable while Stripe, Calendly/Cal.com, Microsoft 365 + Entra ID, and Meta Business Manager accounts are still being set up per the launch plan's week-by-week timeline. It deliberately does not implement booking, payments, the client portal, or the messaging agent — those need the real accounts below before they can be built for real, per this file's own definition of done. The stack below is the target for those pieces once the accounts exist; whether they get added as an API layer around the existing static site or as a full migration to Next.js is not decided yet.

Suggested defaults for that future work, adjust freely and update this section the moment a real decision is made — an out-of-date CLAUDE.md is worse than none:

- **Framework**: Next.js (TypeScript) — one codebase for the marketing site, portal, and API routes/webhooks.
- **Hosting**: Vercel or Netlify (per the launch plan).
- **Database**: Postgres (e.g. via Supabase or Neon) for bookings, client portal accounts, estimate records.
- **Payments**: Stripe (Checkout or Elements — never a custom card form).
- **Email & calendar**: Microsoft 365 Business Basic on `aiproservicescorp.com` (~$7/user/mo, annual commitment).
- **Calendar sync**: Microsoft Graph API via **Entra ID (formerly Azure AD)** — the work/school account flow, *not* the consumer Outlook.com flow. See the Entra ID section below before writing any calendar code.
- **Messaging**: Meta's Graph API for Instagram/WhatsApp/Messenger, behind a single internal messaging abstraction (see SOLID).
- **Scheduler**: Calendly or Cal.com, embedded, connected to Outlook via its native integration where possible.

Whatever is chosen, keep it boring and well-documented — this is a one-person team; exotic tooling is a liability, not a flex.

## Microsoft Graph via Entra ID — calendar integration

The business runs on Microsoft 365 Business Basic, so calendar access goes through a **work/school account**, not a personal Microsoft account. This changes the auth flow, the app registration, and the consent model compared to the consumer path. Get this right before writing calendar code.

- **App registration** happens in the Microsoft Entra admin center under App registrations, inside the `aiproservicescorp.com` tenant. Record the Application (client) ID, Directory (tenant) ID, and a client secret. Store all three in environment variables — never in source.
- **Single-tenant** is the correct setting. Only accounts in the AI ProServices tenant need access; do not register as multi-tenant "just in case."
- **Delegated vs application permissions:** for a scheduler acting on the owner's behalf, delegated (`Calendars.ReadWrite`) is usually right. Application permissions grant tenant-wide mailbox access and are overkill for a one-person calendar — pick the narrower one and document why.
- **Admin consent** is granted by the owner as tenant admin, in the Entra portal. This is a one-time action, not something to script.
- **Token handling:** access tokens are short-lived; use the refresh token flow via MSAL (`@azure/msal-node`) rather than hand-rolling token refresh. Store refresh tokens encrypted, never in plaintext columns (see A04).
- **Prefer the scheduler's native integration.** Calendly and Cal.com both connect to Microsoft 365 work accounts directly. If that covers the booking flow, do not write custom Graph code at all — a direct Graph integration is only justified if the embedded scheduler proves insufficient.
- **Secrets expire.** Entra client secrets have an expiry date (24 months max). Calendar the renewal at registration time; a silently expired secret breaks booking sync with no warning (see A09 — fail loudly).

Note that the business `michaelflores@aiproservicescorp.com` account and any personal Outlook.com account are separate identities — the same address cannot exist in both. Do not assume a single sign-in covers both.

## Architecture — SOLID, applied to this project

These aren't abstract rules here — they map directly onto the parts of this system that will otherwise turn into copy-pasted, unmaintainable code as more niches and clients are added.

- **Single Responsibility** — Keep booking, payments, messaging, and estimation as separate modules/services, each owning one concern. A Stripe webhook handler should not also contain calendar-sync logic. A niche's estimator config should not live inside UI components.
- **Open/Closed** — The estimator engine must support adding a new trade (landscaping, cleaning, etc.) by adding a new pricing-rules config, not by editing the core calculation code. Same for adding a new website niche or a new messaging channel — extend, don't modify.
- **Liskov Substitution** — Any concrete payment provider, messaging channel, or calendar provider must be fully substitutable for another implementing the same interface, with no caller-side special-casing. If swapping Stripe for another processor someday requires touching booking code, the abstraction is wrong.
- **Interface Segregation** — Define narrow, focused interfaces: e.g. a `MessagingChannel` interface (send message, receive webhook, verify signature) implemented separately by Instagram/WhatsApp/Messenger adapters, rather than one bloated interface every channel must partially implement.
- **Dependency Inversion** — Business logic (booking flow, estimate calculation, order processing) depends on abstractions (`PaymentProcessor`, `CalendarProvider`, `MessagingChannel`), never directly on the Stripe SDK, Graph API client, or Meta SDK. Inject concrete implementations at the edges. This is also what makes the codebase testable without hitting real APIs.

## Security requirements

This handles client payments and personal data — treat security as a requirement, not a nice-to-have. Organized around **OWASP Top 10:2025**, plus payment- and AI-agent-specific rules this project needs on top of it.

### A01 — Broken access control
- Every data access must check that the authenticated user owns the resource requested (no IDOR — a client must not view another client's appointments or invoices by guessing an ID).
- Default deny: authorization checks happen server-side on every request, never inferred from a hidden form field, client-side route guard, or "the UI doesn't show that button."
- Admin/owner-only actions (issuing refunds, editing prices, viewing all clients) live behind their own explicit role check, separate from "logged in."

### A02 — Security misconfiguration
- Set security headers on every response: `Content-Security-Policy`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY` (or CSP `frame-ancestors`), `Referrer-Policy`, `Permissions-Policy`, and `Strict-Transport-Security` with a real max-age.
- Disable verbose error pages, stack traces, and framework debug modes in production. Generic error messages to users; full detail only in server-side logs.
- Lock down CORS on API routes to known origins — never `*` on anything that accepts credentials or writes data.
- Review default configs on every managed service (database, hosting platform, storage buckets) — no public buckets, no default admin credentials left in place.

### A03 — Software supply chain failures
- Commit the lockfile; install with `npm ci` (or equivalent) in CI so builds are reproducible, not `npm install`.
- Run `npm audit` (or equivalent) and keep dependencies patched; enable Dependabot/Renovate so this happens continuously, not manually when remembered.
- Before adding a new dependency, check it's actively maintained and reasonably popular — small, abandoned packages are a common supply-chain entry point.
- Any third-party script loaded on the site (analytics, chat widgets, A/B testing tools) needs the same scrutiny as a dependency — see the payment-page script rule below, which applies with extra force.

### A04 — Cryptographic failures
- Enforce TLS 1.2+ everywhere; redirect all HTTP to HTTPS.
- Encrypt sensitive data at rest where the platform supports it (database-level encryption at minimum); never store secrets or tokens in plaintext columns.
- Use a cryptographically secure random source for any token (session IDs, password-reset tokens, API keys you issue) — never `Math.random()` for anything security-relevant.
- Don't invent your own encryption or signing scheme; use maintained libraries for everything (JWT/session libs, HMAC for webhook verification, etc.).

### A05 — Injection
- Use parameterized queries/an ORM — no raw string-concatenated SQL, anywhere.
- Validate and sanitize all input server-side, even for fields already validated client-side. Never trust the client.
- Encode output to prevent XSS; treat any user-supplied content (reviews, chat messages, estimate notes) as untrusted when rendering it back.

### A06 — Insecure design
- Think through abuse cases up front, not just happy paths: can the estimator be scraped/spammed by bots? Can a promo code be brute-forced? Can someone submit a booking request loop to exhaust your calendar or Stripe rate limits?
- Add CAPTCHA or equivalent bot mitigation on public unauthenticated forms (contact, estimator, booking request) once abuse is observed, and design the form to make it easy to add later even if skipped at launch.

### A07 — Authentication failures
- Hash passwords with a modern algorithm (bcrypt/argon2) if using password auth; consider passwordless (magic link) instead to reduce attack surface entirely.
- Rate-limit and lock out repeated failed login attempts; don't let auth endpoints be brute-forced.
- Password reset flows must not reveal whether an email exists in the system (same response either way) and reset tokens must be single-use and short-lived.
- Expire sessions; use secure/HttpOnly/SameSite cookies; invalidate the session server-side on logout, not just client-side.

### A08 — Software or data integrity failures
- Protect the main branch: no direct pushes, require the build/lint/test pipeline to pass before merge, even as a solo developer — the pipeline is the review.
- **PCI DSS 4.0.1 requirements 6.4.3 and 11.6.1 apply to your payment page even though Stripe handles the card fields.** Stripe's iframe protects card entry, but you're still responsible for every script that loads on the page around it (analytics, chat widget, A/B testing). Maintain a written inventory of every script on the checkout page with a stated business reason for each, and monitor that page for unauthorized/tampered scripts (weekly at minimum). If you can't attest to this, you fall out of SAQ A eligibility.
- Use Subresource Integrity (SRI) hashes on any third-party script loaded from a CDN.

### A09 — Security logging and alerting failures
- Log security-relevant events (logins, failed logins, password resets, payment webhook failures, permission denials) — but never log sensitive data itself: no full tokens, no card details, no passwords, even at debug level.
- Set up alerting (even a simple one, e.g. email/Slack webhook) for anomalies: repeated failed logins, webhook signature failures, a spike in failed payments, third-party API errors from Meta or Microsoft.
- Assume Meta and Microsoft can change API/webhook requirements without notice — fail loudly (alert/log) rather than silently when an integration breaks.

### A10 — Mishandling of exceptional conditions
- Fail closed, not open: if a permission check, payment verification, or webhook signature check throws an unexpected error, treat it as "deny," never "allow."
- Handle third-party API failures (Stripe, Meta, Microsoft Graph) gracefully — a booking or payment should not silently "succeed" client-side if the server-side confirmation actually failed.
- Never surface internal error details, stack traces, or database errors to the end user.

### Payments (beyond A08 above)
- Never handle, log, or store raw card numbers. Use Stripe Checkout or Elements so card data never touches this server.
- Verify every Stripe webhook's signature (`Stripe-Signature` header) before trusting its payload. Reject unsigned or invalid requests.
- Make payment amounts server-derived from the actual service/estimate, never trusted from client input.
- Use Stripe's test mode and test card numbers for all development; never test with real cards.

### Secrets & configuration
- All API keys, webhook secrets, and OAuth credentials live in environment variables, never in source. Add `.env*` (except `.env.example`) to `.gitignore` before the first commit.
- Use separate keys for dev/staging/production; rotate immediately if a secret is ever exposed (committed, logged, pasted into a chat).
- Request the minimum OAuth scopes needed from Microsoft Graph (Entra ID) and Meta's Graph API — no broad "manage everything" permissions.

### AI messaging agent — OWASP Top 10 for LLM Applications 2026
The messaging agent (Instagram/WhatsApp/Messenger) is a distinct attack surface from the rest of the site. Design it assuming it will be prompted adversarially by real customers, not just used as intended.

- **Prompt injection (top LLM risk):** assume the model can be tricked by crafted customer messages. Don't try to make the model unfoolable — constrain what it's *able* to do so a successful trick can't cause real damage (see Excessive Agency below).
- **Excessive agency:** the agent should not autonomously issue refunds, change prices, promise discounts, or take irreversible actions. Anything beyond answering FAQs and taking an order within pre-approved parameters needs a human-in-the-loop or a hard-coded business rule, not model judgment.
- **Sensitive information disclosure:** the agent must never reveal its system prompt, internal business logic, other customers' data, or backend details, even if asked directly or indirectly. Keep any sensitive context out of the prompt entirely if it doesn't need to be there.
- **Misinformation:** ground hours, menu items, prices, and specials in your actual database — don't let the model free-generate factual claims about the business. If it's not confident, it should say so or hand off to a human, not guess.
- Rate-limit the agent per user/conversation to control API cost abuse as well as spam.

## Development workflow & verification rules

- **Never mark work done without verifying it.** Run the build, run the linter, run the test suite. A task is not complete if any of these fail, even if "the feature looks right" in manual testing.
- Write tests for anything touching money, auth, or data ownership (booking → payment → confirmation; portal access checks; estimator calculations) before considering that code shippable.
- After implementing a feature, do a self-review of the actual diff — not just a description of what was intended — before calling it finished.
- Test the full critical path end-to-end after any change that touches it: a client can book → pay → see the appointment on Outlook → see it in the portal.
- Check mobile responsiveness and basic accessibility (keyboard focus states, contrast) for anything customer-facing — the brand direction (dark background, custom palette) makes contrast easy to get wrong; verify it explicitly.
- Confirm no secrets, API keys, or `.env` files are present in any diff before committing.
- When a stack, provider, or architectural decision changes, update this file in the same change — don't let it drift out of date.

## Definition of done

A feature or fix is done when: it builds cleanly, tests pass, it's been manually verified against the actual acceptance criteria (not just "compiles"), no secrets or debug logging were introduced, and — for anything touching payments, auth, or third-party webhooks — the relevant Security Requirements above have been explicitly checked, not assumed. For anything touching the payment page specifically, confirm the script inventory (A08/PCI 6.4.3) is still accurate. For anything touching the messaging agent, confirm it still can't take actions outside its approved scope (Excessive Agency).
