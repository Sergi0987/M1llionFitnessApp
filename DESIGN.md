# Design

Recorded from the built public site (`client/src/pages/PublicHome.jsx` and its plate components) and extended to the login page, the admin dashboard, and the client portal. One brand, two modes: the public site is Persuade (the full plate ritual — grain, folios, marginal numbering); the dashboards are Operate (the same tokens, restrained — no grain, no Anton in controls, no fluid type). See "Operate extension" below for what changes between them and what doesn't.

## Visual world

**The anatomical plate.** The public site is built as a page from an anatomical atlas: a studied figure, numbered callouts printed in a paper margin, a legend that explains them, plate folios, running heads, and hairline rules. It exists to argue that strength is stewardship — the body as something designed, studied, and worth keeping well — which is why the atlas is the carrier rather than the usual coach landing page of feature cards over a gym photo.

Source of truth for palette, type, and finish: `M1LLION_Editorial_Theology_Performance_Brand_Bible_v2.pdf` (Working Edition 02).

## Color

Tokens live in `client/tailwind.config.js`. Balance follows the brand bible: roughly 65–70% bone/paper/charcoal, 20–25% imagery, 5–10% accent.

| Token | Hex | Role |
|---|---|---|
| `bone` | `#F5F2EC` | Light ground |
| `paper` | `#EFEAE2` | Secondary light ground |
| `charcoal` | `#1F1F1D` | Dark ground; hero and inquire are always charcoal |
| `graphite` | `#353432` | Body ink on bone; dark figure margin |
| `sand` | `#DDD3C6` | Body ink on charcoal |
| `sage` | `#AEB1A2` | Secondary ink on charcoal |
| `olive` | `#6C6A45` | Accent: captions, small labels |
| `darkolive` | `#454733` | Legend numerals and figure captions on bone |
| `forest` | `#394337` | The commentary band only |
| `butter` | `#E7D48B` | Single highlight; dark-theme focus ring; primary hover |
| `bronze`, `clay`, `stone` | — | Declared, unused on this surface |

Rules that hold:
- Accents carry numbering, captions, and labels. **Running copy never wears an accent** — it is graphite on light, sand on dark.
- Butter highlights exactly one phrase on the page ("The order matters.").
- `stone` is not used for text; it fails contrast on charcoal.
- Focus rings are picked per *ground*, not per theme: charcoal-on-bone in light regions, butter-on-charcoal in the always-dark hero and inquire sections.

## Type

Three families, pinned by the brand bible.

- **Anton** (`font-display`) — headlines only, uppercase, `leading-[0.92–0.96]`. Hero at `clamp(2.6rem, 9vw, 6rem)`; plate headings at `clamp(2rem, 5.5vw, 3.75rem)`.
- **Cormorant Garamond** (`font-serif`) — the reflective voice: creed lines, plate intros, figure captions, folios. Light weight, frequently italic.
- **DM Sans** (`font-sans`) — body copy, legends, labels, forms.

Scale discipline: body `0.95rem/1.7`, measure capped at `52–66ch`. Labels and running heads are uppercase at `0.68–0.74rem` with `0.2em` tracking; document furniture (running heads, baseline marks) may go to `0.62rem` but **form labels may not** — they sit at `0.72rem`.

## Material and finish

- **Paper grain** — `.m1-grain` in `styles.css`, an inline SVG `feTurbulence` at 14% opacity. It multiplies on light grounds; dark grounds must use `.m1-grain-light` (screen) or the texture renders as nothing on charcoal.
- **Photography** — `.m1-photo` applies the bible's finish: `saturate(0.86) contrast(0.93) sepia(0.09)`. Every photograph on the site carries it.
- **Rules** — one hairline weight throughout: `border-charcoal/20` on light, `border-bone/25` on dark, with `/10` and `/12` for internal dividers.
- **No shadows, no gradients on type, no rounded corners.** Buttons and inputs are square. Depth comes from ground changes, not elevation.

## Components

- **`Plate.jsx`** — a section of the atlas. Renders a running head (plate reference left, subject right) above a hairline, a sticky margin folio on `lg`+, and the heading. The running head is document furniture, not an eyebrow: **no label is ever stacked directly above a heading.**
- **`PlateStudy.jsx`** — the figure and its legend as one unit. The photograph is shown whole and unmarked; all numbering lives in the legend beside it. (An earlier build printed keyed tick marks down a margin on the figure itself; the owner asked for them removed — do not reintroduce marks over the photography.)
- **`ThemeToggle.jsx`** — `variant="plate"` for this surface; the default variant belongs to the portal.

## Motion

One authored moment. Legend entries and their ticks key in on first view (`useReveal.js`), staggered 90ms via `--key-index`, on an exponential ease-out. Content is visible by default: the hidden state only applies while the observer is live, and `prefers-reduced-motion` skips it entirely. Nothing else on the page animates beyond color transitions on hover.

## Layout and rhythm

- Container `max-w-[86rem]`, padding `px-5 sm:px-8`.
- Ground alternates deliberately: charcoal hero → bone plate → forest commentary → bone plates → charcoal inquire. The brand bible calls this the feed rhythm; keep it.
- Section rhythm `py-16 sm:py-24`; more space above a heading than below it.
- Plate order carries meaning — Pl. I Frontispiece, II The study, III The coach, IV The feed, V Apparel, VI Inquire. Adding a section means renumbering.

## Honesty rules

These are design constraints here, not just copy rules:

- No testimonials, results, pricing, named certifications, or storefront exist. Do not invent them or design a slot that implies them.
- Apparel is marked "in preparation" and says "Nothing is for sale yet."
- Faith is foundational and visible, expressed through the brand's own approved lines. **Do not add Scripture citations** that the client has not approved.
- The inquiry form states what actually happens ("Your inquiry goes straight to Carolina") and its error names a recovery that exists.

## Operate extension (login, dashboards, portal)

Same tokens as the public site, applied per `operate.md`'s rules for product UI: one family (DM Sans; Anton is reserved for page-level H1s only — never buttons, badges, table data, or nav labels), a fixed (non-fluid) scale, and Restrained color — the accent carries primary actions and status only, never decoration.

**Files:** `App.jsx` (the `Shell`/nav), `pages/Login.jsx`, `pages/AdminDashboard.jsx`, `pages/AdminClients.jsx`, `pages/AdminClientDetails.jsx`, `pages/AdminPrograms.jsx`, `pages/ClientPortal.jsx`, `pages/ClientWorkouts.jsx`, `pages/AccountSettings.jsx`, and the shared `utils/themeClasses.js`, `components/Button.jsx`, `components/Badge.jsx`, `components/ThemeToggle.jsx`, `components/WeightChart.jsx`.

**Ground/panel relationship** (`getThemeClasses`, mirrors the plate's own ground/panel logic):
- Page: charcoal (dark) / bone (light).
- Panel (cards, forms): graphite (dark) / paper (light) — one step off the page.
- subPanel / inputs: recess back to the page tone (charcoal / bone) — a "sunken field" look inside a panel.
- All borders `/20` (dark: bone; light: charcoal); faint internal dividers `/12` (dark) `/10` (light).

**Button** (`Button.jsx`): primary is a *fixed* `bg-olive text-bone`, deliberately theme-independent — since it supplies its own fill, it reads correctly on both page grounds without an `isDark` prop, and its ~5.5:1 contrast holds for both. Secondary and danger sit directly on the page ground, so those two variants take `isDark` explicitly. Every button in the codebase passes `isDark={classes.isDark}` (or omits it for primary, which doesn't need it) — do the same for new ones. Square corners, no shadow. Focus ring is `ring-olive` universally (validated ≥3:1 against both bone and charcoal, so it never needs to know the theme either).

**Badge** (`Badge.jsx`): client status (Active/Paused/Completed) keeps real semantic color — green/amber/blue — because that's a functional signal a coach triages at a glance, not brand decoration. Program difficulty (Beginner/Intermediate/Advanced) ties to the brand's earth palette instead (sage/olive → bronze/clay → a solid inverted chip for Advanced), since it isn't a status that needs the same urgency read. Needs `isDark` — it has no theme-independent fixed-color option like Button does, because both its light and dark tints are translucent overlays meant to sit on the *panel*, and panel color itself changes per theme.

**WeightChart** (`WeightChart.jsx`): SVG can't consume Tailwind classes, so its colors are hardcoded hex matching the token table above (olive/butter line, sand/graphite labels, bone/charcoal tooltip) — keep them in sync by hand if the token hexes ever change.

**ThemeToggle**: one look now, no `variant` prop — the public site, login, and dashboards all render the same control.

**`:root` in `styles.css`**: the font-family and pre-paint background fallback were updated to DM Sans / charcoal, replacing a stale Inter/near-black-slate default that predated this extension and no longer matches anything the app actually renders.

## Known open items

- The marginal plate rail is desktop-only; on phones the running head carries the plate reference.
- The hero photograph is full-bleed atmosphere, not a portrait: dimmed to 80%, anchored `object-top`, under a vertical wash that stays light at the top so the subject's head reads and deepens to solid charcoal at the baseline, plus a left-to-right wash that carries the type. A wide viewport crops a portrait image hard, so anchoring to the top is what keeps the head in frame — a replacement image needs its subject in the upper third.
- `client/index.html` ships the direction contract as an HTML comment, visible in view-source, pending the owner's decision.
- `/privacy` and `/terms` are linked from nowhere on this page now, but no pages exist behind those routes.
- `components/BodyProgressVisual.jsx` is unused dead code (not imported anywhere) and was left on the old slate/pink palette rather than retoned, since it isn't part of any rendered surface.
- The Logout button in `App.jsx` is solid-filled (bone-on-charcoal / charcoal-on-bone) rather than outlined like the rest of the nav — a deliberate exception so it reads as a distinct, terminal action, not another destination link.
