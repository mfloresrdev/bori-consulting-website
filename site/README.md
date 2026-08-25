# Crossroads Digital — marketing site

Static HTML/CSS/JS, no build step. See [`../CLAUDE.md`](../CLAUDE.md) for the full project context and the stack decision behind building this as static files first.

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
├── contact.html                 Phone CTA (booking/payments not wired up yet)
├── favicon.svg                  Placeholder mark — swap for a real logo when one exists
├── robots.txt / sitemap.xml     Update the placeholder domain once it's live
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

## What's intentionally not built yet

Booking, payments, the client portal, and the messaging agent all need real third-party accounts (Stripe, Calendly/Cal.com, Outlook, Meta) and finalized business registration that don't exist yet — see `../interview-notes.md` "Still to gather." Those are marked "coming soon" in the UI. Do not wire up fake/non-functional versions of these; build them for real once the accounts exist, per `../CLAUDE.md`'s security and definition-of-done rules.

## Viewing locally

```
python3 -m http.server 8000
```
then open `http://localhost:8000/`.
