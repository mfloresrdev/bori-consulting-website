# Company Launch Plan

**Company:** AI ProServices — *Build, Optimize, Run, Integrate*
**Domain:** aiproservicescorp.com (owned)
**Owner:** Michael — solo software developer/entrepreneur
**Service area:** Indiana, US — open to remote work in other states
**Phone:** 317-695-3403
**Plan start date:** Aug 24, 2026

---

## 1. Business identity

| Item | Status |
|---|---|
| Company name | **AI ProServices** — locked |
| Acronym | Build, Optimize, Run, Integrate |
| Domain | **aiproservicescorp.com** — purchased via Vercel Domains (DNS managed by Vercel, not GoDaddy) |
| Business email | `michaelflores@aiproservicescorp.com` — Microsoft 365 Business Basic (pending setup) |
| Aliases planned | `hello@` (contact page), `billing@` (invoices, Stripe receipts) |
| Logo / brand assets | None yet |
| Portfolio material | One food truck project photo referenced; not yet successfully uploaded |

**Remaining blockers:** email setup, INBiz filing, portfolio photos.

---

## 2. Target customer & strategy

Small businesses that don't yet have a website or AI agents.

Strategy: complete a handful of projects first to build a portfolio, then scale up services and niches. Launch only with niches there's already proof for (food truck, contractor / window & door); add more as case studies accumulate.

---

## 3. Services

- AI Agent consultations
- Website consultations
- Food truck websites
- Window & Door Estimator Agent
- Estimator Agent (general)
- Messaging Agent

**Site concept — two paths from the homepage:**

- **"Build My Website"** → visitor picks a business niche (food truck, contractor, more later)
- **"Get an AI Agent"** → visitor picks an agent type (Window & Door Estimator, Messaging Agent, general Estimator)

---

## 4. Pricing

### Flagship package — Food truck ordering site + AI agent

| Component | One-time |
|---|---|
| Ordering website + Stripe / Apple Pay / Google Pay checkout, mobile-first | $2,000–4,000 |
| AI agent across Instagram, WhatsApp & Facebook Messenger (FAQ, hours, location, specials) | $1,500–3,000 |
| Order-delivery integration + traffic/revenue dashboard | $500–1,500 |
| **Total build** | **$4,000–8,000** |

Monthly retainer (hosting, monitoring all three messaging integrations, agent tuning, admin support for updates): **$150–500/mo**

### Other services

| Service | Price |
|---|---|
| Website consultation | $75–150/session |
| AI Agent consultation | $75–150/session |
| Small business website (non-food-truck) | $800–2,000 |
| Window & Door Estimator Agent | $500–1,500 + $50–100/mo |
| Estimator Agent (general) | $500–1,500 + $50–100/mo |
| Messaging Agent (single channel) | $400–900 + $50–150/mo |

**Pricing posture:** priced to win early portfolio work. Move toward the higher end — and toward $1,500–8,000/site, $80–200/hr generally — once case studies exist.

---

## 5. Brand & design direction

- **Visual style:** modern contractor — dark forest-green-to-black background, subtle dot-grid/pattern texture (Airbyte.com-inspired), warm amber accent
- **Typography:** Fraunces (display/headlines), IBM Plex Sans (body), IBM Plex Mono (data, prices, dates)
- **Palette:**
  - Base `#0A100C`
  - Surface `#1A251D`
  - Accent green `#6CC492`
  - Amber `#E3A857`
  - Text `#EDF2ED`

Contrast needs explicit verification on the dark background — easy to get wrong.

---

## 6. Scope & features

**Purpose:** full self-service — clients can learn about services, book, and pay online with no manual follow-up.

- Service pages with interactive estimator tools
- Live chat / messaging agent widget
- Client portal (login area: appointments, past estimates/invoices, documents)
- Testimonials, gallery, blog, project portfolio
- **Booking:** embedded live scheduler (Calendly / Cal.com style) — *not* custom-built, for reliable Outlook sync and availability handling
- **Client tracking:** simple calendar view; no separate CRM for now
- **Calendar:** Microsoft 365 Business Basic on `aiproservicescorp.com` — calendar sync goes through **Entra ID (work account) Graph scopes**, not the consumer Outlook.com flow. Prefer Calendly/Cal.com's native Microsoft 365 integration over custom Graph code
- **Payments:** Stripe; payment or deposit collected online at time of booking
- **Build approach:** custom-built and owned outright, not a no-code platform. Needs hosting (Vercel/Netlify) plus backend for portal, estimator, and payments

---

## 7. Business registration — Indiana

*Informational only; not legal or tax advice.*

- [ ] Create an **Access Indiana** account first — this is the personal SSO login for INBiz (Michael the individual, not the company)
- [ ] Run the INBiz business search for "AI ProServices" to confirm no conflict
- [x] Entity type decided: **C-Corporation** (AI ProServices Corp.), not the LLC originally planned here — update: this section's filing details below are corrected for a corporation, verified against the Indiana Secretary of State's current forms (Aug 2026) rather than left as the stale LLC-specific steps
- [ ] Optional: reserve name via INBiz — $10, holds 120 days
- [ ] Designate registered agent — can be Michael personally with an Indiana address, but **the business cannot be its own agent**, and the agent address is public record. Commercial agent services run ~$50–150/yr if the home address should stay private
- [ ] File **Articles of Incorporation for a Domestic Corporation (State Form 4159)** via INBiz — **$100**, ~24hr online processing. (This replaces the LLC's Form 49459 "Articles of Organization" originally planned here — a corporation files a different form.)
- [ ] If working from home: check the remote-business box on the Articles and file State Form 9900382 alongside it, so the principal office address serves as a contact address
- [ ] Get EIN — free, instant, at irs.gov
- [ ] Enter `michaelflores@aiproservicescorp.com` as the business email on the filing — the state sends entity-report reminders and change notices there, which is the early warning for business identity theft
- [ ] Open business bank account (after EIN)
- [ ] Check local/industry licenses via INBiz
- [ ] Calendar the Biennial Business Entity Report — every 2 years, in anniversary month

---

## 8. Nine-week launch timeline

### Week 1 — Aug 24–30 · Business foundation
- [x] Pick final company name — **AI ProServices**
- [x] Confirm domain availability and purchase — **aiproservicescorp.com** via Vercel Domains
- [ ] Set up Microsoft 365 Business Basic, create `michaelflores@aiproservicescorp.com`, add MX/TXT records in Vercel's DNS records panel for the domain (not GoDaddy — Vercel is the DNS host)
- [ ] Run INBiz business search for name conflicts
- [ ] Create Access Indiana account
- [x] Decide entity type — **C-Corporation**

### Week 2 — Aug 31–Sep 6 · Legal & financial setup
- [ ] File Articles of Incorporation (Form 4159) on INBiz ($100), listing `michaelflores@aiproservicescorp.com` as the business email
- [ ] Get EIN at irs.gov
- [ ] Open business bank account
- [ ] Add `hello@` and `billing@` aliases

### Week 3 — Sep 7–13 · Core service accounts
- [ ] Confirm the Microsoft 365 calendar is live and connect Calendly/Cal.com to it via the native Microsoft 365 integration
- [ ] Calendly / Cal.com signup
- [ ] Stripe signup
- [ ] **Meta for Developers + Business Manager — start Instagram/WhatsApp/Messenger app review now; approval can take days to weeks**
- [ ] GitHub repo + Vercel account; assign aiproservicescorp.com to the Vercel project (DNS is already on Vercel, so this is just a domain assignment in the project settings — no external A/CNAME records needed)
- [ ] Register the app in the **Entra admin center** (single-tenant) and record client ID, tenant ID, and secret — only needed if custom Graph code turns out to be necessary

### Week 4 — Sep 14–20 · Brand & content
- [ ] Lock palette and background pattern
- [ ] Gather portfolio photos (including the food truck project)
- [ ] Write service descriptions and pricing
- [ ] Settle on a tagline

### Week 5 — Sep 21–27 · Site structure & copy
- [ ] Sitemap
- [ ] Homepage copy
- [ ] Niche page copy

### Week 6 — Sep 28–Oct 4 · Core build
- [ ] Homepage
- [ ] Niche-picker pages
- [ ] Portfolio / gallery

### Week 7 — Oct 5–11 · Booking, payments & estimators
- [ ] Calendly / Cal.com embed, synced to the Microsoft 365 business calendar
- [ ] Stripe checkout
- [ ] Estimator forms

### Week 8 — Oct 12–18 · Messaging agent & client portal
- [ ] Build against approved Meta APIs
- [ ] Client login area
- [ ] Testimonials and blog

### Week 9 — Oct 19–25 · QA & soft launch
- [ ] End-to-end test: book → pay → Outlook → portal
- [ ] Mobile test
- [ ] Outside feedback
- [ ] Founding-client offer

### Ongoing — Oct 26+
- [ ] Land first 1–2 client projects (possibly discounted) for the portfolio
- [ ] Collect testimonials and case studies
- [ ] Begin local outreach

---

## 9. Open items / next steps

- [ ] Stand up `michaelflores@aiproservicescorp.com` and verify send/receive both directions
- [ ] Re-upload the food truck project photo and any other portfolio material
- [ ] Confirm entity choice with an accountant, including the multi-member structure once the partner is identified
- [ ] Draft an operating agreement covering ownership split, decision-making, and buyout terms
- [ ] Begin the site build — homepage, niche-picker pages, estimators

---

## 10. Critical path risks

1. **Email is now the near-term bottleneck** — the INBiz filing should list the business address, so email setup gates the incorporation filing, which gates the EIN, which gates the bank account. This is also the likely root cause of the AADSTS90019 error seen when signing into Microsoft Bookings: Microsoft 365 for `aiproservicescorp.com` (step in Week 1, still unchecked above) needs to be fully set up and the domain verified via DNS before a real work-account sign-in exists to use Bookings with.
2. **Meta app review is the long pole on the technical side** — started in Week 3 but not needed until Week 8. If it slips, the messaging agent slips with it. Start it early and treat any delay as a scheduling signal, not a surprise.
3. **No portfolio assets yet** — the food truck photo is currently the only proof of past work referenced, and it hasn't been successfully attached anywhere.
4. **Entra client secret expiry** — if custom Graph code is used, the secret expires within 24 months and booking sync breaks silently. Calendar the renewal at registration time.
