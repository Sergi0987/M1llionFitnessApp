# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: prospective coaching clients — predominantly women — evaluating whether to train with Carolina (@linageovania), a certified trainer. They arrive from Instagram or word of mouth, usually on a phone, deciding whether this coach is serious, credible, and a fit for them.

Secondary: existing clients returning to reach the portal login.

## Product Purpose

M1LLION is Carolina's coaching brand and platform. The public site earns the inquiry; the private portal (out of scope for the homepage work) delivers programs, weekly check-ins, and workout tracking. Success for the homepage is a qualified coaching inquiry or class booking.

## Positioning

Strength training framed as stewardship rather than aesthetics. M1LLION's stated identity is "Editorial Theology × Performance" — a Christ-centered view of the body combined with real programming and education. The brand's own words: faith is "foundational, not decorative." A neighboring fitness coach could copy the workouts but not the theology or the editorial discipline.

## Operating Context

- Coaching runs in two modes: 1:1 online coaching (custom training, macros, weekly check-ins delivered through the private portal) and in-person group classes.
- 1:1 inquiries route to the site's contact form (Formspree). Group classes book through Setmore at https://m1llionfitness.setmore.com/ (confirmed to keep).
- Instagram is the main top-of-funnel; the site embeds the feed via an Elfsight widget.
- Deployed on Render free tier; the API cold-starts, so the public page must not depend on the backend.

## Capabilities and Constraints

- Stack is fixed: React 19 + Vite + Tailwind, client/ and server/ workspaces. Homepage is `client/src/pages/PublicHome.jsx`.
- A light/dark theme toggle exists site-wide and must keep working on the homepage.
- Login and the client/admin dashboards are explicitly out of scope for this work.
- Apparel: no store exists yet. Confirmed direction is to tease it as upcoming with a contact/notify path — never link to a storefront or imply one is live.
- Footer links `/privacy` and `/terms` have no pages behind them.

## Brand Commitments

Binding source of truth: `M1LLION_Editorial_Theology_Performance_Brand_Bible_v2.pdf` (Working Edition 02, 2026).

- Identity: EDITORIAL × THEOLOGY × PERFORMANCE. "It should feel like a theological art journal and premium athletic campaign belong to the same world."
- Personality: disciplined, reverent, intelligent, strong, artful, restrained, timeless, purposeful.
- Faith is foundational and visible on the public homepage (confirmed by the user this session), expressed reverently — never as decoration or motivational cliché.
- Signature language (verbatim, approved): "Strength Is Stewardship." / "Movement Is Worship." / "Built on Purpose." / "Train the body. Renew the mind. Serve the King." / "Work. Worship. Witness." / "FROM ONE TO MANY." / "THE BODY MATTERS. THE SOUL MATTERS MORE. THE ORDER MATTERS."
- Explicit prohibitions: generic beige luxury, fitness-influencer graphics, neon gym culture, random religious decoration, hyper-polished corporate design, trend chasing, bright primary yellow, script as body text, motivational clichés, oversaturated photos.
- Existing logo assets: `client/public/logoBlack.png`, `client/public/logoWhite.png`.

## Evidence on Hand

- Real photography: `client/public/C14.jpeg` (Carolina in the gym), `client/public/headshot.png` (Carolina with clients).
- Two additional editorial performance photographs exist but are not yet in the repo; the user must save them into `client/public/`.
- Real Instagram account @linageovania with a live embedded feed.
- No testimonials, client results, certifications by name, pricing, or press are confirmed. Future work must not fabricate any of these. Carolina is described as a "certified trainer" — the specific certification is not on record.

## Product Principles

1. Faith is load-bearing, not ornamental — every theological line must carry an idea, never fill space.
2. Claim nothing that does not exist: no fake testimonials, results, pricing, credentials, or storefronts.
3. The page is read on a phone first; editorial restraint must survive a small screen.
4. Restraint over volume — one dominant idea per section, then stop.
5. The public site must render fully without the backend awake.

## Accessibility & Inclusion

Keyboard focus states and skip-to-content already exist and must be preserved. Text must stay legible in both light and dark themes; the brand's muted palette makes contrast a live risk that has to be checked rather than assumed.
