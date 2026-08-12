# Design

Recorded from the built public site (`client/src/pages/PublicHome.jsx` and its plate components). The portal and admin dashboards are a separate, older visual world and are **not** described here.

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
| `sand` | `#DDD3C6` | Figure margin on light; body ink on charcoal |
| `sage` | `#AEB1A2` | Secondary ink on charcoal |
| `olive` | `#6C6A45` | Accent: captions, small labels |
| `darkolive` | `#454733` | Callout numerals on sand (6.6:1) |
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
- **`PlateStudy.jsx`** — the figure and its legend as one unit. Tick positions in the figure's printed margin are *measured* against each legend term (`useLayoutEffect` + `ResizeObserver` + `document.fonts.ready`) so a numeral physically aligns with the entry it refers to. Below `lg` the margin is hidden entirely — stacked, it would key nothing, and the legend's own numerals carry the reference.
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

## Known open items

- The callout key refers a numeral to a legend row; it does not annotate a region of the photograph. Per-photo coordinates were deliberately deferred because the editorial photographs are supplied by the client and not yet in the repo.
- The marginal plate rail is desktop-only; on phones the running head carries the plate reference.
- `client/index.html` ships the direction contract as an HTML comment, visible in view-source, pending the owner's decision.
- `/privacy` and `/terms` are linked from nowhere on this page now, but no pages exist behind those routes.
