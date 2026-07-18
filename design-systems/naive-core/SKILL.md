# Naive Core Design System

> Dark-first product design system (core subset — 24 components covering the dashboard UI Kit). Tokens authored verbatim from **naive-ui**'s official dark theme; component/UI-Kit references derived from naïve-ui's source.

## Library Layout

> The library root directory shown below is named `naive-core/` for documentation. The **deployed location is consumer-defined** — it can be `node_modules/@naive/core/`, `packages/design/naive-core/`, a CDN base URL, or anywhere else. All paths in this document are **relative to the library root**; treat the root prefix as `{NAIVE_CORE_ROOT}` and resolve it from your consumer project.

```
{NAIVE_CORE_ROOT}/                 # naive-core library root (location is consumer-defined)
├── SKILL.md                       # This file (design specification, concise)
├── README.md                      # Human-friendly guide with Downstream Consumption Guide
├── colors_and_type.css            # Authoritative token source (verbatim, dark-only)
├── css.json                       # Machine-readable token projection (auto-generated)
├── components.css                 # Aggregated component class definitions — AUTO-GENERATED
├── icons.js                       # Optional inline icon sprite renderer
├── uikit-plan.json                # Component whitelist + slot assignments + screen blueprint
├── library-consumption.json       # Recommended downstream read order for agents
├── assets/
│   └── icons/                     # 115+ bundled SVG icons (default + tinted variants)
├── components/                    # Component layer (24 JSON contracts, one per slug)
│   ├── index.json
│   ├── alert.json · atoms.json · avatar.json · badge.json · breadcrumb.json
│   ├── button-group.json · buttons.json · card.json · dialog.json · dropdown.json
│   ├── empty.json · form.json · forms.json · input-number.json · menu.json
│   ├── notification.json · pagination.json · popover.json · progress.json · select.json
│   ├── table.json · tabs.json · tag.json · tooltip.json
├── preview/                       # 24 component preview pages (1 HTML per slug — includes atoms)
└── ui_kits/
    └── dashboard/
        ├── index.html              # React 18 single-file showcase
        └── quality-report.json
```

> `components.css` is **regenerated** by `.agents/skills/design-library-creator/scripts/extract-components-css.mjs`, which scans every `preview/component-*.html` for the CSS between `/* @component-css-start */` and `/* @component-css-end */` markers inside its `<style>` block and aggregates the result.

## Brand Essentials

- **Surface**: dark canvas `--bodyColor rgb(16, 16, 20)`, layered with `--cardColor rgb(24, 24, 28)` / `--modalColor rgb(44, 44, 50)` and four `--bg-overlay-l1..l4` tints.
- **Primary text**: `--textColor1 rgba(255, 255, 255, 0.9)`; muted: `--textColor2` / `--textColor3`.
- **Brand accent**: `--primaryColor #63e2b7` (green), with `--primaryColorHover` and `--primaryColorPressed` variants.
- **Status palette**: primary / info / success / warning / error each provide `default | hover | pressed | suppl`. Note: success aliases primary (green) in naive-ui.
- **Typography**: Inter body, JetBrains Mono for code; body scale `--fontSizeTiny..Huge` (12–16px) matching the **5-tier t-shirt sizing** for component heights (22 / 28 / 34 / 40 / 46 px).
- **Radii**: `2 / 3 / 4 / 6 / 8` px (`--borderRadiusTiny..Huge`).
- **Spacers**: `--spacer-0/4/8/12/16/24/32/40`.

## Token Naming Convention

Tokens preserve their **naive-ui source naming verbatim**. There are no portable aliases — components consume the source variables directly:

- `--primaryColor` / `--infoColor` / `--successColor` / `--warningColor` / `--errorColor` semantic brand keys (note: success ≡ primary)
- `--text-1..3` / `--icon-*` content tokens (mirroring opacity states)
- `--borderColor` / `--dividerColor` borders
- `--bodyColor` / `--cardColor` / `--modalColor` / `--popoverColor` surface fills
- `--tableHeaderColor` / `--tableColorHover` / `--tableColorStriped` table variants
- `--hoverColor` / `--pressedColor` / `--buttonColor2` interaction states
- `--inputColor` / `--inputColorDisabled` / `--actionColor` form & surface variants
- Typography: `--body-{xs|sm|md|base}-{font-family|font-size|font-weight|line-height}` (+ `*-strong`)
- Code: `--fontFamilyMono`, `--codeColor`

> Components reference tokens directly via `var(--token-name)`. Do **not** rename tokens (e.g., do not invent `--bg-brand`); do **not** introduce new color scales.

## Components (24)

| Slug | Type | Notes |
|------|------|-------|
| alert | feedback | 4 tones × simple/complex layouts with optional icon + close |
| atoms | layout | Shared atoms (.row, .col, .grid-*, .stack-*, .h1/.h2/.h3, .eyebrow, .ds-code, .mono) |
| avatar | data | sm/md/lg × circle/square, primary tinted or default avatarColor |
| badge | data | Numbered sup + dot indicator (error/primary/info/success/warning) |
| breadcrumb | navigation | Path indicator with separator / > → |
| button-group | general | Segmented control (shared borders, 1 active) |
| buttons | general | 7 types × 4 sizes × 5 states; max 1 primary per page |
| card | data | Bordered / embedded / hover surface container |
| dialog | feedback | Centered overlay with header + body + footer structure |
| dropdown | navigation | Popover menu (trigger + floating items + danger variants) |
| empty | feedback | Centered placeholder (icon + title + description + optional action) |
| form | form | Vertical form with required indicator + validation feedback |
| forms | form | Input + Textarea + Checkbox + Radio + Switch |
| input-number | form | Numeric input with +/− stepper (small/medium/large) |
| menu | navigation | Horizontal + vertical menus with active indicator line |
| notification | feedback | Floating toast card with status-colored left border |
| pagination | navigation | Numeric pages with prev/next + optional page jumper |
| popover | feedback | Floating panel with header + body slots + arrow |
| progress | feedback | Linear bar (small/medium/large) + status colors + label |
| select | form | Dropdown selection control with ✓ indicator |
| table | data | Header + data rows with hover, stripe, bordered variants |
| tabs | navigation | 3 styles — line / card / segment |
| tag | data | Inline status pill — 6 types × 3 sizes, optional round |
| tooltip | feedback | Hover-triggered hint bubble with arrow (CSS-only) |

## UI Kits (1)

| Type | Composition |
|------|-------------|
| dashboard | KPI stats (4 cards w/ badge + delta) + recent-activity table (w/ progress bars + pagination) + 3 quick-action cards (Storage / API / Support) |

Each UI Kit is a single self-contained interactive React 18 `index.html` that links `../../colors_and_type.css` and `../../components.css`. The shell is capped at `max-width: 1184px` per design-library-creator skill spec — UI Kits are showcases, not real-canvas page templates (see README → "Downstream Consumption Guide").

## Icons

Bundled SVG icons live at `assets/icons/`. Optional runtime sprite renderer at `icons.js` (when present).

## Authoring Rules

1. **Never hardcode hex / rem / px.** Always reference `var(--token)`.
2. **Status color is local.** Tag/cell-level colorization only — never tint full table rows.
3. **Surface lifts.** Use `--bodyColor` (base) and `--cardColor` (raised) for layered surfaces.
4. **Borders stay neutral.** `--borderColor` for default chrome; only state-specific borders use status/brand.
5. **Dark-only** by default. Remove `/* @dark-only */` from `colors_and_type.css` only when explicitly producing a light theme.
6. **No `transform: scale`** in UIKit — the `max-width: 1184px` cap is a hard constraint.
7. **Brand button cap.** At most **one** `.ds-btn--primary` per screen; use `.ds-btn--default` for the rest.
8. **Status aliases primary.** Both `--primaryColor` and `--successColor` map to `#63e2b7`; the dashboard uses both keys to keep naive-ui semantics.

## Out of Scope (Not Generated)

- **Token-only previews** (`colors`, `typography`, `spacing`, `radius`): foundational previews are NOT included; tokens are represented purely by `colors_and_type.css` + `css.json`.
- **Light theme**: source tokens are dark-only (`/* @dark-only */`).
- **Interactive library landing page**: this is a static design library, not a VitePress site.
- **Changelog / version tracking**: handled via downstream consumers.
- **Less common naïve-ui components** (e.g., highlight, equation, marquee, mention, qr-code, watermark, dynamic-input, transfer, tree-select): the 24 covered here handle the dashboard scenario; expand via `expand-components` if needed.

## Conversation Continuity

- Add components: `expand-components`
- Refine tokens or rename groups: `refine-library`
- Generate an additional kit (mobile, dev-explorer, marketing): `generate-additional-kit`