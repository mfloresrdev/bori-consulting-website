# AI ProServices — marketing site

Static HTML/CSS/JS, no build step. See [`../CLAUDE.md`](../CLAUDE.md) and [`../launch-plan.md`](../launch-plan.md) for the full project context and the stack decision behind building this as static files first.

## Structure

```
site/
├── index.html                   Homepage — two-path split (Build My Website / Get an AI Agent)
├── build-my-website.html        Niche picker: food truck, contractor (+ coming soon)
├── get-an-ai-agent.html         Agent picker: estimator, messaging agent (+ coming soon)
├── estimator-window-door.html   Live demo of the Window & Door Estimator
├── pricing.html                 Full pricing table for every service
├── portfolio.html               Project case studies + testimonials
├── blog.html                    Blog index (empty-state until first posts)
├── about.html                   Company story
├── contact.html                 Phone CTA (booking/payments/email not wired up yet)
├── privacy-policy.html          DRAFT — pending attorney review, see below
├── terms-of-service.html        DRAFT — pending attorney review, see below
├── favicon.svg                  Placeholder "A" mark — swap for a real logo when one exists
├── vercel.json                  Security headers (CSP, HSTS, etc.) — must live here, inside site/,
│                                 not the repo root, since Vercel's Root Directory is set to `site`
├── robots.txt / sitemap.xml     Point at aiproservicescorp.com; update if the domain ever changes
├── css/styles.css               Shared design system (palette, type, components)
└── js/
    ├── nav.js                   Mobile nav toggle + active-link highlighting
    ├── estimator-engine.js      Generic pricing-rules engine (trade-agnostic)
    ├── estimator-ui.js          Generic form/results renderer for any estimator config
    └── estimators/
        └── window-door.config.js   Pricing rules for the Window & Door Estimator
```

## Adding a new estimator trade

Per the Open/Closed principle in `../CLAUDE.md`, add a new trade (landscaping, cleaning, etc.) by writing a new config file in `js/estimators/`, shaped like `window-door.config.js`. Never edit `estimator-engine.js` or `estimator-ui.js` to special-case a trade — if the existing config shape can't express it, extend the shape for every trade, not just one.

## Legal pages — attorney review needed

`privacy-policy.html` and `terms-of-service.html` are drafts written to accurately describe the site as it exists today (no cookies/analytics, no live booking/payments yet) plus the services described in the launch plan. Both carry a visible "DRAFT — pending attorney review" banner and `<meta name="robots" content="noindex">` so they aren't indexed before that review happens. Entity structure is now decided (AI ProServices Corp., a C-Corporation) and reflected in both pages' "who we are" language. Once an attorney has reviewed them, remove the draft banner and noindex tag, and update the "last updated" date.

## What's intentionally not built yet

Booking, payments, the client portal, and the messaging agent all need real third-party accounts and setup that aren't done yet, per `../launch-plan.md`: Microsoft 365 Business Basic + Entra ID app registration, Stripe, Calendly/Cal.com, Meta Business Manager app review (can take days–weeks), and the INBiz business registration. Those are marked "coming soon" in the UI rather than faked. Do not wire up non-functional versions of these; build them for real once the accounts exist, per `../CLAUDE.md`'s security and definition-of-done rules.

## Viewing locally

```
python3 -m http.server 8000
```
then open `http://localhost:8000/`. To view from another device on the same WiFi network, find this machine's LAN IP (`ipconfig getifaddr en0` or similar) and open `http://<that-ip>:8000/` instead.

## Deploying

- **GitHub repo:** [`mfloresrdev/ai-proservices-corpwebsite`](https://github.com/mfloresrdev/ai-proservices-corpwebsite) — the repo root is a git repo; the actual site lives in `site/`.
- **Vercel project:** `ai-proservices-corpwebsite`, connected to that repo with **Root Directory** set to `site` (framework preset: Other / no build step). Its default `*.vercel.app` URL follows the project name — currently `ai-proservices-corpwebsite.vercel.app`.
- **Domains:** `aiproservicescorp.com` is the primary domain (purchased through Vercel Domains, so DNS is already hosted there — no external registrar records needed). `boriconsulting.com` is the retired former domain, also on Vercel DNS; whether it stays assigned as a redirect or gets fully detached is a standing decision, not yet made.
- Both the GitHub repo and the Vercel project were renamed to match the current brand — if either one drifts from the other again, that's a sign to re-sync them.
