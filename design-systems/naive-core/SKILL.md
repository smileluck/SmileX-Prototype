# Naive Core Design System

> Dark-first product design system — **full coverage: 95 naive-ui components + atoms (96 total)**, plus 4 UI Kits (dashboard / dev-explorer / mobile / marketing). Tokens authored verbatim from **naive-ui**'s official dark theme.

## Library Layout

> The library root directory shown below is named `naive-core/` for documentation. The **deployed location is consumer-defined**. All paths are **relative to the library root**; treat the root prefix as `{NAIVE_CORE_ROOT}`.

```
{NAIVE_CORE_ROOT}/
├── SKILL.md                       # This file (design specification, concise)
├── README.md                      # Human-friendly guide with Downstream Consumption Guide
├── colors_and_type.css            # Authoritative token source (verbatim, dark-only)
├── css.json                       # Machine-readable token projection
├── components.css                 # Aggregated component classes — AUTO-GENERATED (96 blocks)
├── uikit-plan.json                # Component whitelist (2 core + 94 support) + slots
├── library-consumption.json       # Downstream read order
├── components/                    # 96 JSON contracts (96 × {slug}.json + index.json)
├── preview/                       # 96 component preview pages (component-{slug}.html)
└── ui_kits/                       # 4 page-level showcases
    ├── dashboard/   (index.html + quality-report.json)
    ├── dev-explorer/ (index.html + quality-report.json)
    ├── mobile/      (index.html + quality-report.json)
    └── marketing/   (index.html + quality-report.json)
```

> `components.css` is **regenerated** by `design-library-creator/scripts/extract-components-css.mjs`, scanning every `preview/component-*.html` for CSS between `/* @component-css-start */` and `/* @component-css-end */` markers. Edit component CSS in the preview HTML, then re-run the script — never edit `components.css` directly.

## Brand Essentials

- **Surface**: dark canvas `--bodyColor rgb(16, 16, 20)`, layered with `--cardColor rgb(24, 24, 28)` / `--modalColor rgb(44, 44, 50)` / `--popoverColor rgb(72, 72, 78)`.
- **Primary text**: `--textColor1 rgba(255, 255, 255, 0.9)`; muted: `--textColor2` / `--textColor3`.
- **Brand accent**: `--primaryColor #63e2b7` (green), with `--primaryColorHover` / `--primaryColorPressed`.
- **Status palette**: primary / info / success / warning / error each provide `default | hover | pressed | suppl`. Note: success aliases primary (green) in naive-ui.
- **Typography**: Inter body, JetBrains Mono for code; `--fontSizeTiny..Huge` (12–16px) matching the 5-tier component heights (22 / 28 / 34 / 40 / 46 px).
- **Radii**: `2 / 3 / 4 / 6 / 8` px. **Spacers**: `--spacer-0/4/8/12/16/24/32/40`.

## Token Naming Convention

Tokens preserve their **naive-ui source naming verbatim** — no portable aliases:

- `--primaryColor` / `--infoColor` / `--successColor` / `--warningColor` / `--errorColor` (success ≡ primary)
- `--textColor1..3` / `--iconColor*` content tokens
- `--borderColor` / `--dividerColor` borders
- `--bodyColor` / `--cardColor` / `--modalColor` / `--popoverColor` surfaces
- `--tableHeaderColor` / `--tableColorHover` / `--tableColorStriped` table variants
- `--hoverColor` / `--pressedColor` / `--buttonColor2*` interaction states
- `--inputColor` / `--inputColorDisabled` / `--actionColor` / `--tagColor` / `--avatarColor` / `--codeColor`
- Typography: `--fontFamily` / `--fontFamilyMono` / `--fontSize*` / `--heading-*`

> Components reference tokens directly via `var(--token-name)`. Do **not** rename tokens; do **not** introduce new color scales.

## Components (96)

| Slug | Category | Render notes |
|------|----------|--------------|
| affix | navigation | horizontal + vertical, active indicator |
| alert | feedback | 4 status variants |
| anchor | navigation | horizontal + vertical, active indicator |
| atoms | layout | grid / flex / stack helpers |
| auto-complete | form | sizes + states + label/feedback |
| avatar-group | data | 6 types × 3 sizes |
| avatar | data | 6 types × 3 sizes |
| back-top | navigation | horizontal + vertical, active indicator |
| badge | general | 6 types × 3 sizes |
| breadcrumb | navigation | horizontal + vertical, active indicator |
| button-group | general | type × size × state matrix |
| button | general | type × size × state matrix |
| calendar | data | striped table / list rows |
| card | data | striped table / list rows |
| carousel | data | striped table / list rows |
| cascader | form | sizes + states + label/feedback |
| checkbox | form | domain-specific render |
| code | data | domain-specific render |
| collapse | feedback | 4 status variants |
| color-picker | form | domain-specific render |
| countdown | data | striped table / list rows |
| data-table | data | striped table / list rows |
| date-picker | form | sizes + states + label/feedback |
| descriptions | data | striped table / list rows |
| dialog | feedback | 4 status variants |
| divider | general | 6 types × 3 sizes |
| drawer | feedback | 4 status variants |
| dropdown | navigation | horizontal + vertical, active indicator |
| dynamic-input | form | sizes + states + label/feedback |
| dynamic-tags | form | sizes + states + label/feedback |
| ellipsis | data | striped table / list rows |
| empty | feedback | 4 status variants |
| equation | data | striped table / list rows |
| flex | layout | grid / flex / stack helpers |
| float-button-group | data | 6 types × 3 sizes |
| float-button | data | 6 types × 3 sizes |
| form | form | sizes + states + label/feedback |
| gradient-text | general | 6 types × 3 sizes |
| grid | layout | grid / flex / stack helpers |
| heatmap | data | striped table / list rows |
| highlight | data | domain-specific render |
| icon-wrapper | general | 6 types × 3 sizes |
| icon | general | 6 types × 3 sizes |
| image | data | domain-specific render |
| infinite-scroll | data | domain-specific render |
| input-number | form | sizes + states + label/feedback |
| input-otp | form | sizes + states + label/feedback |
| input | form | sizes + states + label/feedback |
| layout | layout | grid / flex / stack helpers |
| legacy-grid | layout | grid / flex / stack helpers |
| legacy-transfer | form | domain-specific render |
| list | data | striped table / list rows |
| loading-bar | feedback | 4 status variants |
| log | data | domain-specific render |
| marquee | data | domain-specific render |
| mention | form | sizes + states + label/feedback |
| menu | navigation | horizontal + vertical, active indicator |
| message | feedback | 4 status variants |
| modal | feedback | 4 status variants |
| notification | feedback | 4 status variants |
| number-animation | data | striped table / list rows |
| page-header | navigation | horizontal + vertical, active indicator |
| pagination | navigation | type × size × state matrix |
| popconfirm | feedback | 4 status variants |
| popover | feedback | 4 status variants |
| popselect | feedback | 4 status variants |
| progress | feedback | 4 status variants |
| qr-code | data | domain-specific render |
| radio | form | domain-specific render |
| rate | form | domain-specific render |
| result | feedback | 4 status variants |
| scrollbar | data | domain-specific render |
| select | form | sizes + states + label/feedback |
| skeleton | feedback | 4 status variants |
| slider | form | domain-specific render |
| space | layout | grid / flex / stack helpers |
| spin | feedback | 4 status variants |
| split | layout | grid / flex / stack helpers |
| statistic | data | striped table / list rows |
| steps | navigation | horizontal + vertical, active indicator |
| switch | form | domain-specific render |
| table | data | striped table / list rows |
| tabs | navigation | horizontal + vertical, active indicator |
| tag | general | 6 types × 3 sizes |
| thing | data | striped table / list rows |
| time-picker | form | sizes + states + label/feedback |
| time | data | striped table / list rows |
| timeline | data | striped table / list rows |
| tooltip | feedback | 4 status variants |
| transfer | form | domain-specific render |
| tree-select | form | sizes + states + label/feedback |
| tree | data | striped table / list rows |
| typography | data | domain-specific render |
| upload | form | domain-specific render |
| virtual-list | data | domain-specific render |
| watermark | feedback | domain-specific render |

## UI Kits (4)

| Type | Composition |
|------|-------------|
| dashboard | KPI stats + recent-activity table + quick-action cards |
| dev-explorer | IDE shell — titlebar / activity-bar / file tree / editor tabs / AI chat |
| mobile | 3 phone screens — home / project list / settings |
| marketing | landing hero + feature grid + pricing table |

Each UI Kit is a single self-contained interactive React 18 `index.html` linking `../../colors_and_type.css` and `../../components.css`, capped at `max-width: 1184px` — showcases, not page templates (see README → Downstream Consumption Guide).

## Authoring Rules

1. **Never hardcode hex / rem / px** in component CSS — always `var(--token)`.
2. **Status color is local** — tag/cell-level only, never full-row tints.
3. **Surface lifts** — `--bodyColor` base, `--cardColor` raised.
4. **Dark-only** by default (`/* @dark-only */` in `colors_and_type.css`).
5. **No `transform: scale`** in UIKit — `max-width: 1184px` is a hard constraint.
6. **Brand button cap** — at most one `.ds-btn--primary` per screen.
7. **Preview chrome stays out of markers** — `.pv-*` above `@component-css-start`, `.ds-*` inside.

## Out of Scope (Not Generated)

- Token-only previews (`colors`, `typography`, `spacing`, `radius`) — represented purely by `colors_and_type.css` + `css.json`.
- Light theme (dark-only source tokens).
- Interactive library landing page (static design library, not a VitePress site).
- Bundled SVG icon set (`assets/icons/` + `icons.js` are optional add-ons).

## Conversation Continuity

- Add components: `expand-components`
- Refine tokens: `refine-library`
- Generate an additional kit: `generate-additional-kit`
