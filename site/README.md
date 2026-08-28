# BORI Consulting — marketing site

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
├── favicon.svg                  Placeholder "B" mark — swap for a real logo when one exists
├── robots.txt / sitemap.xml     Point at boriconsulting.com; update if the domain ever changes
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

`privacy-policy.html` and `terms-of-service.html` are drafts written to accurately describe the site as it exists today (no cookies/analytics, no live booking/payments yet) plus the services described in the launch plan. Both carry a visible "DRAFT — pending attorney review" banner and `<meta name="robots" content="noindex">` so they aren't indexed before that review happens. Once BORI Consulting's entity structure (sole prop vs. LLC) is finalized and an attorney has reviewed them, remove the draft banner and noindex tag, and update the "last updated" date.

## What's intentionally not built yet

Booking, payments, the client portal, and the messaging agent all need real third-party accounts and setup that aren't done yet, per `../launch-plan.md`: Microsoft 365 Business Basic + Entra ID app registration, Stripe, Calendly/Cal.com, Meta Business Manager app review (can take days–weeks), and the INBiz business registration. Those are marked "coming soon" in the UI rather than faked. Do not wire up non-functional versions of these; build them for real once the accounts exist, per `../CLAUDE.md`'s security and definition-of-done rules.

## Viewing locally

```
python3 -m http.server 8000
```
then open `http://localhost:8000/`. To view from another device on the same WiFi network, find this machine's LAN IP (`ipconfig getifaddr en0` or similar) and open `http://<that-ip>:8000/` instead.

## Deploying

The repo root is a git repo; this site lives in `site/`. Push to GitHub and connect the repo to Vercel with **Root Directory** set to `site` (framework preset: Other / no build step). `boriconsulting.com` was purchased through Vercel Domains, so DNS is already hosted there — assigning the domain to the project in Vercel's dashboard is enough, no external registrar DNS records needed.
