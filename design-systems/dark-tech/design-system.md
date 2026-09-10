---
version: alpha
name: dark-tech
description: A dark, tech-forward data-platform interface. The system is built on a deep slate canvas, elevated dark cards, a cyan primary accent with purple support, glowing borders and layered shadows, Inter typography, and dense operational layouts in the spirit of Vercel/Railway dark dashboards. The product should feel precise, luminous, data-dense, and work-focused.
colors:
  primary: "#22d3ee"
  primary-soft: "#164e63"
  primary-border: "#0891b2"
  primary-strong: "#06b6d4"
  canvas: "#0f172a"
  surface: "#1e293b"
  surface-soft: "#172033"
  surface-hover: "#263447"
  border: "#334155"
  border-strong: "#475569"
  divider: "#24303f"
  text: "#f1f5f9"
  text-strong: "#ffffff"
  text-muted: "#94a3b8"
  text-secondary: "#cbd5e1"
  success: "#4ade80"
  success-text: "#86efac"
  success-bg: "#14532d"
  warning: "#fbbf24"
  warning-text: "#fcd34d"
  warning-bg: "#78350f"
  danger: "#f87171"
  info: "#7dd3fc"
  chart-blue: "#38bdf8"
  chart-indigo: "#818cf8"
  chart-emerald: "#34d399"
  chart-orange: "#fb923c"
  chart-purple: "#c084fc"
typography:
  display-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 26px
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  title-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.35
    letterSpacing: 0
  title-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  caption:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0.01em"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
rounded:
  sm: 6px
  md: 8px
  lg: 12px
  xl: 16px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  page: 24px
  section: 28px
shadows:
  card: "0 4px 16px rgba(0, 0, 0, 0.4)"
  card-hover: "0 8px 24px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(34, 211, 238, 0.25)"
  nav: "0 4px 20px rgba(0, 0, 0, 0.45)"
  media: "0 12px 32px rgba(0, 0, 0, 0.55), 0 0 20px rgba(34, 211, 238, 0.12)"
components:
  app-canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
  top-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    height: 64px
    border: "1px solid {colors.border}"
    shadow: "{shadows.nav}"
  card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    rounded: "{rounded.lg}"
    shadow: "{shadows.card}"
    hoverShadow: "{shadows.card-hover}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#0f172a"
    rounded: "{rounded.md}"
    height: 38px
  filter-pill:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.text-secondary}"
    activeBackgroundColor: "{colors.primary}"
    activeTextColor: "#0f172a"
    rounded: "{rounded.pill}"
  dataset-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
    hoverBorder: "1px solid {colors.primary}"
  code-panel:
    backgroundColor: "{colors.surface-soft}"
    rounded: "{rounded.lg}"
    codeTypography: "{typography.code}"
---

# Overview

This is a dark, tech-forward data-platform UI. It should look like a developer-grade operational console: luminous, sortable, scannable, and built for repeated use by engineers, operators, and data analysts — in the spirit of Vercel and Railway dark dashboards.

The visual system is anchored by three choices:

- A deep slate application canvas (`#0f172a`) that pushes content forward and lets elevated dark cards float above it.
- Dark cards (`#1e293b`) with 12px radius, deep layered shadows, and subtle cyan-glowing hover borders, used for statistics, charts, filter panels, dataset listings, file trees, and detail sections.
- A cyan primary accent (`#22d3ee`) for navigation state, primary actions, selected filters, active borders, focus rings, and identity marks, with purple (`#a78bfa` family) reserved for secondary highlights and one chart series.

Avoid marketing-site composition. This product should open directly into the tool surface: dashboards, dataset grids, filters, tabs, tables, trees, charts, and form controls.

# Colors

## Brand & Action

- **Primary Cyan** (`#22d3ee`): Main brand/action color. Use for selected nav items, primary buttons, selected filter chips, active borders, links, focus rings, and compact identity blocks.
- **Primary Strong** (`#06b6d4`): Hover or pressed state when a deeper action color is needed.
- **Primary Soft** (`#164e63`): Muted cyan tint for subtle selected backgrounds, empty states, and icon tiles — dark enough to sit on slate surfaces.
- **Primary Border** (`#0891b2`): Avatar ring, focused outline, and low-emphasis selected borders.
- **Secondary Purple** (`#a78bfa` family): Supporting accent for secondary highlights, gradient pairings with cyan, and the purple chart series. Never use as a competing primary action color.

## Surfaces

- **Canvas** (`#0f172a`): Global page background.
- **Surface** (`#1e293b`): Cards, top nav, filter panel, detail header, data list cards, chart containers.
- **Surface Soft** (`#172033`): Low-emphasis panels, code-adjacent backgrounds, recessed content blocks that sit slightly below card level.
- **Surface Hover** (`#263447`): Row hover and subtle list item hover — a visibly lifted slate step, not a near-invisible shift.
- **Border** (`#334155`): Standard card and input border.
- **Border Strong** (`#475569`): Metric-card border and stronger dividers.
- **Divider** (`#24303f`): List separators inside cards, barely lighter than the card itself.

## Text

- **Text** (`#f1f5f9`): Default body and primary UI text — near-white for contrast on slate.
- **Text Strong** (`#ffffff`): Large metric numbers and the highest-emphasis headings.
- **Text Muted** (`#94a3b8`): Captions, helper text, dates, metadata, table secondary values.
- **Text Secondary** (`#cbd5e1`): Unselected filter chip text and mid-emphasis labels.

## Semantic & Charts

Semantic colors are brightened for legibility on dark backgrounds.

- **Success** (`#4ade80`, text `#86efac`, bg `#14532d`): Published states, positive deltas, success tags.
- **Warning** (`#fbbf24`, text `#fcd34d`, bg `#78350f`): Pending annotation, processing, attention states.
- **Danger/Error** (`#f87171`): Offline devices, admin-danger tags, destructive states.
- **Info** (`#7dd3fc`): Neutral info tags and informational accents, harmonized with the cyan accent.
- **Chart Series**: sky `#38bdf8`, indigo `#818cf8`, emerald `#34d399`, orange `#fb923c`, purple `#c084fc` — all luminous tints tuned for dark backgrounds.

# Typography

Use `Inter` as the project default, with system sans fallbacks. Typography is utilitarian and compact, with a slightly tighter, more engineered feel than neutral grotesques. Do not introduce decorative display fonts or oversized editorial headlines.

| Token | Size | Weight | Line Height | Use |
|---|---:|---:|---:|---|
| `display-lg` | 26px | 600 | 1.2 | Page titles, detail dataset title, login product name |
| `title-md` | 16px | 600 | 1.35 | Card section headers, chart titles, nav brand text |
| `title-sm` | 14px | 500 | 1.4 | Dataset card title, list row title, active nav |
| `body-md` | 15px | 400 | 1.55 | Form fields, body copy when needed |
| `body-sm` | 13px | 400 | 1.45 | Default UI text, filters, metadata rows |
| `caption` | 12px | 400 | 1.35 | Dates, sizes, role labels, status metadata |
| `code` | 13px | 400 | 1.6 | Code examples, storage tree examples, command snippets |

Numbers in KPI cards use 26px, weight 600, pure white. Labels and units stay muted at 13px or 12px. Letter spacing stays at `0` except a slight `-0.01em` tightening on display text and a `0.01em` opening on captions.

# Layout

## Application Shell

- Top navigation is fixed, 64px high, dark slate, full width, with a subtle bottom border and a deep drop shadow that separates it from the canvas.
- Content starts below the nav at 64px and uses centered max-width containers.
- Dashboard pages use `max-width: 1600px` and 24px horizontal padding.
- Dataset list pages use `max-width: 1500px`.
- Dataset detail pages use `max-width: 1200px`.

## Spacing

Use a 4px base scale.

- Tight inline gaps: 4px, 8px, 12px.
- Card padding: 16px, 20px, or 24px.
- Page gutters: 24px.
- Major vertical rhythm: 24px to 28px between panels — slightly tighter than light themes, since dark surfaces need less whitespace to read as separated.
- Avoid large empty hero whitespace; this is an operational product.

## Grid Patterns

- Dashboard metrics: five equal cards in one desktop row, each with a colored 3px left accent bar or a small glowing status dot.
- Dashboard charts: two-column row, flexible line chart plus fixed-width donut chart around 480px.
- Dataset list: left filter sidebar at 320px, content grid on the right.
- Dataset cards: four columns on wide desktop with 20px gaps.
- Detail pages: single centered column with a summary header, tabs, and stacked content cards.

# Components

## Top Navigation

The nav contains a compact square brand mark, product name, page links, user identity, and logout action.

- Brand mark: 34px square, cyan-to-purple gradient or solid cyan background, 8px radius, dark slate bold initials, with a faint cyan glow (`0 0 12px rgba(34, 211, 238, 0.35)`).
- Nav height: 64px.
- Horizontal padding: 32px.
- Active nav item: cyan text, 14px, weight 500, optionally with a 2px cyan underline indicator.
- Inactive nav item: 13px muted slate, hover to near-white.
- User avatar: 36px circle, cyan fill with dark text, 2px `#0891b2` border.

## Cards

Cards are dark slate with 12px radius and deep layered shadows.

- Base shadow: `0 4px 16px rgba(0, 0, 0, 0.4)`.
- Hover shadow: `0 8px 24px rgba(0, 0, 0, 0.5)` plus a cyan ring `0 0 0 1px rgba(34, 211, 238, 0.25)`.
- Standard border: `1px solid #334155` — always present on dark themes, since shadows alone do not separate dark surfaces.
- Use cards for actual content blocks, not nested decorative wrappers.

## KPI Cards

KPI cards are compact and data-first.

- Dark slate background, 12px radius, 20px padding.
- 1px `#475569` border plus a 3px colored left accent bar or glowing status dot.
- Label: muted 13px.
- Value: white 26px, weight 600.
- Unit: muted 13px aligned to the baseline.
- Delta badge: 12px text, brightened green or amber semantic tint on a dark tinted background.

## Dataset Cards

Dataset cards combine a fixed-height thumbnail with compact metadata.

- Card radius: 12px, overflow hidden.
- Border: `#334155`; hover border changes to primary cyan with a soft cyan glow.
- Thumbnail height: 140px, object-cover; thumbnails may sit on a `#172033` recessed backdrop.
- Thumbnail hover: image scales to `1.06`; optional subtle cyan shimmer overlay may run across the image.
- Body padding: 16px.
- Tags: small dark tags with brightened semantic text colors for scene/type.
- Metadata: 12px muted text with small icons for robot, size, and date.

## Filter Sidebar

The dataset filter sidebar is a dark operational panel.

- Width: 320px.
- Padding: 20px.
- Radius: 12px.
- Sections separated by a `#24303f` bottom border or 28px vertical spacing.
- Section labels: 12px, semibold, muted/secondary text with small cyan icons.
- Filter pills: 12px text, 12px horizontal padding, 6px vertical padding, pill radius.
- Selected pill: cyan fill, dark slate text, cyan border, faint cyan glow.
- Unselected pill: `#172033` fill, `#cbd5e1` text, `#334155` border; hover border cyan.

## Forms & Inputs

Inputs, selects, checkboxes, pagination, tabs, buttons, and dialogs follow dark-console conventions.

- Input background: `#172033` with a `1px solid #334155` border; focus border turns cyan with a soft outer glow (`0 0 0 3px rgba(34, 211, 238, 0.15)`).
- Primary buttons use cyan `#22d3ee` with dark slate text for contrast.
- Large login button height: 44px, full width, 15px text.
- Search input uses a large size and a prefix icon in muted slate.
- Form labels should remain compact and top-aligned.
- Placeholder text uses `#64748b`-range muted slate, never darker than the input background allows to read.

## Tabs

Detail tabs are dark tabs with custom labels.

- Labels combine a small icon, text, and optional `Admin` danger tag in brightened red.
- Active tab uses a cyan underline and cyan text.
- Tab content transitions with a simple opacity fade.
- Do not wrap each tab panel in extra decorative containers unless it contains a real card section.

## Charts

Charts live inside dark cards and must be themed for dark backgrounds.

- Keep chart title text near-white and straightforward; axis labels and grid lines in muted slate (`#475569` grid, `#94a3b8` labels).
- Use roomy chart grids so labels do not crowd card edges.
- Prefer smooth line charts with a soft cyan area gradient fill for growth trends.
- Donut charts can use radius around `40%` to `60%`, centered with legend at bottom.
- Reuse the luminous chart palette: sky, indigo, emerald, orange, purple.
- Tooltips use a `#1e293b` background with a `#475569` border.

## Code & File Panels

Docs and intro pages use code/file panels for examples and storage format previews.

- Put code in a 12px rounded, overflow-hidden container on the recessed `#172033` background — code panels read slightly darker than cards.
- Use syntax highlighting tuned for dark backgrounds (brightened keywords, cyan strings, purple functions).
- File tree rows should preserve long file names without breaking layout; truncate or wrap intentionally.
- Use muted metadata for branch, size, author, commit, and history information.

# Motion & Interaction

Motion is subtle and utility-driven, with glow feedback replacing shadow-only feedback.

- General transitions: 0.2s.
- Card hover shadow and glow transitions: 0.25s.
- Thumbnail zoom: 0.5s cubic-bezier motion.
- Back link icon moves left by 2px and scales slightly on hover.
- Route content fade: 0.4s opacity transition.
- Focus and active states may animate a soft cyan glow in over 0.2s; keep glows soft, never pulsing or blinking.
- Avoid elaborate page transitions or decorative animation outside hover feedback.

# Responsive Behavior

Current desktop layouts should be preserved first, but new work should handle smaller screens deliberately.

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Stack nav content or collapse secondary nav; dashboard metrics become one column; dataset sidebar stacks above grid; dataset grid becomes one column; detail action buttons become full-width row/stack. |
| `768-1024px` | Metrics use two columns; dataset grid uses two columns; chart rows stack if width is constrained. |
| `1024-1440px` | Main desktop layout; dataset grid can use three columns depending on available width. |
| `> 1440px` | Use max-width containers; do not stretch text or cards indefinitely. |

Touch targets should stay at least 40px high for buttons, inputs, tab labels, and pagination controls. On small screens, reduce hover glows and rely on the cyan border for state feedback, since shadow detail is harder to perceive on mobile displays.

# Do's and Don'ts

## Do

- Use the deep slate canvas plus elevated dark cards as the default page rhythm.
- Keep the UI dense enough for operations: labels, metadata, status, dates, sizes, and icons should remain visible.
- Use cyan sparingly and consistently for selected/primary/action states, with purple only as a supporting accent.
- Always pair dark surfaces with a visible border; shadows alone do not separate dark-on-dark layers.
- Brighten every semantic color for dark-background legibility, and place semantic text on dark tinted backgrounds rather than light pastel chips.
- Use glowing cyan borders and rings for hover, focus, and active feedback.
- Keep cards and panels aligned to shared widths and 20px gaps.
- Prefer real dataset thumbnails, file trees, code snippets, tags, and metadata over abstract decoration.

## Don't

- Do not turn the product into a marketing landing page.
- Do not use oversized hero typography, full-screen promotional sections, or large decorative gradient meshes.
- Do not let purple compete with cyan as a primary action color.
- Do not use pure black (`#000000`) backgrounds or pure white cards anywhere in the system.
- Do not reuse light-theme pastel semantic backgrounds (`#f0fdf4`-style); they glare on dark canvases.
- Do not add glassmorphism, blurs over imagery, or nested card-on-card compositions.
- Do not use rounded pills for everything; reserve pill shapes for filters, tags, and avatars.
- Do not hide operational metadata for visual simplicity.
- Do not let glows pulse, blink, or animate continuously; glow is a state indicator, not decoration.

# Agent Prompt Guide

When building new UI in this project, follow this short prompt:

> Build a dark tech-console data-platform interface. Use a deep slate `#0f172a` app canvas, dark slate `#1e293b` 12px cards with `#334155` borders, deep layered shadows, cyan `#22d3ee` for primary actions and selected states with soft cyan glow feedback, purple as a supporting accent, Inter/system sans typography, and brightened semantic colors on dark tinted backgrounds. Keep layouts dense, operational, and data-first. Avoid marketing hero sections, pure black backgrounds, pastel light-theme chips, and continuous glow animation.

Quick token reference:

- Canvas: `#0f172a`
- Card: `#1e293b`
- Primary: `#22d3ee`
- Text: `#f1f5f9`
- Muted text: `#94a3b8`
- Border: `#334155`
- Divider: `#24303f`
- Radius: `12px` cards, `8px` controls, `9999px` pills
- Shadow: `0 4px 16px rgba(0,0,0,0.4)`, hover adds cyan ring `0 0 0 1px rgba(34,211,238,0.25)`
