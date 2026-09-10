---
version: alpha
name: fresh-emerald
description: A fresh, friendly emerald-green SaaS interface. The system is built on a near-white mint canvas, generously rounded white cards, emerald primary actions, soft green-tinted shadows, and a clean Inter/system sans typographic voice. The product should feel approachable, modern, light, and quietly confident — like the tidy side of Shopify or Notion — while staying an operational tool first.
colors:
  primary: "#10b981"
  primary-soft: "#ecfdf5"
  primary-border: "#a7f3d0"
  primary-strong: "#059669"
  canvas: "#f7faf8"
  surface: "#ffffff"
  surface-soft: "#f4faf6"
  surface-hover: "#f0faf4"
  border: "#e3ece7"
  border-strong: "#d3e2d9"
  divider: "#eef4f0"
  text: "#1f2937"
  text-strong: "#111827"
  text-muted: "#6b7280"
  text-secondary: "#374151"
  success: "#10b981"
  success-text: "#047857"
  success-bg: "#ecfdf5"
  warning: "#f59e0b"
  warning-text: "#b45309"
  warning-bg: "#fffbeb"
  danger: "#ef4444"
  info: "#64748b"
  chart-blue: "#0ea5e9"
  chart-indigo: "#14b8a6"
  chart-emerald: "#10b981"
  chart-orange: "#f59e0b"
  chart-purple: "#84cc16"
typography:
  display-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: -0.01em
  title-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 16px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: 0
  title-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.45
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
rounded:
  sm: 6px
  md: 10px
  lg: 16px
  xl: 20px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 36px
  page: 28px
  section: 36px
shadows:
  card: "0 1px 2px rgba(31, 41, 55, 0.04), 0 2px 8px rgba(16, 185, 129, 0.05)"
  card-hover: "0 4px 16px rgba(16, 185, 129, 0.1), 0 2px 4px rgba(31, 41, 55, 0.05)"
  nav: "0 1px 4px rgba(16, 185, 129, 0.06)"
  media: "0 10px 28px rgba(5, 150, 105, 0.14)"
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
    textColor: "#ffffff"
    rounded: "{rounded.md}"
    height: 40px
  filter-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    activeBackgroundColor: "{colors.primary}"
    activeTextColor: "#ffffff"
    rounded: "{rounded.pill}"
  dataset-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
    hoverBorder: "1px solid {colors.primary-border}"
  code-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    codeTypography: "{typography.code}"
---

# Overview

This is a light, friendly emerald-green SaaS UI. It should look like a modern operational console with a welcoming tone: calm, organized, scannable, and built for repeated daily use by operators, managers, and analysts — but softer and more approachable than a cold enterprise tool.

The visual system is anchored by three choices:

- A near-white mint application canvas (`#f7faf8`) that separates the workspace from white cards with a barely-there green cast.
- White cards with a generous 16px radius and soft green-tinted shadows, used for statistics, charts, filter panels, dataset listings, file trees, and detail sections.
- Emerald primary color (`#10b981`) for navigation state, primary actions, selected filters, active borders, and identity marks, with a deeper emerald (`#059669`) for hover and pressed states.

Avoid marketing-site composition. This product should open directly into the tool surface: dashboards, dataset grids, filters, tabs, tables, trees, charts, and form controls. Friendliness comes from radius, tint, and breathing room — not from hero banners or illustration.

# Colors

## Brand & Action

- **Primary Emerald** (`#10b981`): Main brand/action color. Use for selected nav items, primary buttons, selected filter chips, active borders, links, and compact identity blocks.
- **Primary Strong** (`#059669`): Hover or pressed state when a deeper action color is needed.
- **Primary Soft** (`#ecfdf5`): Soft mint tint for subtle selected backgrounds, empty states, icon tiles, and success-adjacent surfaces.
- **Primary Border** (`#a7f3d0`): Avatar ring, focused outline, hover border on dataset cards, and low-emphasis selected borders.

## Surfaces

- **Canvas** (`#f7faf8`): Global page background, a near-white with a faint green breath.
- **Surface** (`#ffffff`): Cards, top nav, filter panel, detail header, data list cards, chart containers.
- **Surface Soft** (`#f4faf6`): Low-emphasis demo account panel, secondary content blocks, light code-adjacent backgrounds.
- **Surface Hover** (`#f0faf4`): Row hover and subtle list item hover with a warm green tint.
- **Border** (`#e3ece7`): Standard card and input border.
- **Border Strong** (`#d3e2d9`): Metric-card border and stronger dividers.
- **Divider** (`#eef4f0`): List separators inside cards.

## Text

- **Text** (`#1f2937`): Default body and primary UI text, a deep gray-green.
- **Text Strong** (`#111827`): Large metric numbers and high-emphasis headings.
- **Text Muted** (`#6b7280`): Captions, helper text, dates, metadata, table secondary values.
- **Text Secondary** (`#374151`): Unselected filter chip text.

## Semantic & Charts

- **Success** (`#10b981`, text `#047857`, bg `#ecfdf5`): Published states, positive deltas, success tags. Shares the brand emerald family on purpose.
- **Warning** (`#f59e0b`, text `#b45309`, bg `#fffbeb`): Pending annotation, processing, attention states.
- **Danger/Error** (`#ef4444`): Offline devices, admin-danger tags, destructive states.
- **Info** (`#64748b`): Neutral info tags.
- **Chart Series**: sky `#0ea5e9`, teal `#14b8a6`, emerald `#10b981`, amber `#f59e0b`, lime `#84cc16`. Emerald leads; the others support as fresh, nature-adjacent companions.

# Typography

Use `Inter` as the project default, with system sans fallbacks. Typography is clean, friendly, and compact. Do not introduce decorative display fonts or oversized editorial headlines.

| Token | Size | Weight | Line Height | Use |
|---|---:|---:|---:|---|
| `display-lg` | 26px | 700 | 1.3 | Page titles, detail dataset title, login product name |
| `title-md` | 16px | 600 | 1.45 | Card section headers, chart titles, nav brand text |
| `title-sm` | 14px | 600 | 1.45 | Dataset card title, list row title, active nav |
| `body-md` | 15px | 400 | 1.6 | Form fields, body copy when needed |
| `body-sm` | 14px | 400 | 1.55 | Default UI text, filters, metadata rows |
| `caption` | 12px | 400 | 1.45 | Dates, sizes, role labels, status metadata |
| `code` | 13px | 400 | 1.6 | Highlight.js examples, storage tree examples, command snippets |

Numbers in KPI cards use 26px, weight 700, in `text-strong` (`#111827`). Labels and units stay muted at 14px or 12px. Only `display-lg` carries a slight `-0.01em` letter spacing; keep everything else at `0`.

# Layout

## Application Shell

- Top navigation is fixed, 64px high, white, full width, with a subtle bottom border and a faint green-tinted shadow.
- Content starts below the nav at 64px and uses centered max-width containers.
- Dashboard pages use `max-width: 1600px` and 28px horizontal padding.
- Dataset list pages use `max-width: 1500px`.
- Dataset detail pages use `max-width: 1200px`.

## Spacing

Use a 4px base scale, with slightly roomier rhythm than a dense enterprise console.

- Tight inline gaps: 4px, 8px, 12px.
- Card padding: 20px or 24px.
- Page gutters: 28px.
- Major vertical rhythm: 28px to 36px between panels.
- Avoid large empty hero whitespace; this is an operational product. The extra breathing room lives inside cards and between panels, not in empty banner zones.

## Grid Patterns

- Dashboard metrics: five equal cards in one desktop row, each with a colored 4px left border or a soft tinted icon tile.
- Dashboard charts: two-column row, flexible line chart plus fixed-width donut chart around 480px.
- Dataset list: left filter sidebar at 320px, content grid on the right.
- Dataset cards: four columns on wide desktop with 24px gaps.
- Detail pages: single centered column with a summary header, tabs, and stacked content cards.

# Components

## Top Navigation

The nav contains a compact rounded brand mark, product name, page links, user identity, and logout action.

- Brand mark: 36px square, emerald background, 10px radius, white bold initials.
- Nav height: 64px.
- Horizontal padding: 32px.
- Active nav item: emerald text, 15px, weight 600, optionally with a soft `#ecfdf5` pill background.
- Inactive nav item: 14px muted gray, hover to emerald.
- User avatar: 38px circle, emerald fill, soft `#a7f3d0` ring.

## Cards

Cards are white with 16px radius and soft green-tinted shadow.

- Base shadow: `0 1px 2px rgba(31, 41, 55, 0.04), 0 2px 8px rgba(16, 185, 129, 0.05)`.
- Hover shadow: `0 4px 16px rgba(16, 185, 129, 0.1), 0 2px 4px rgba(31, 41, 55, 0.05)`.
- Standard border when precision is needed: `1px solid #e3ece7`.
- Use cards for actual content blocks, not nested decorative wrappers.

## KPI Cards

KPI cards are compact and data-first.

- White background, 16px radius, 20px padding.
- 1px `#d3e2d9` border plus a 4px colored left border, or a 40px soft-tinted icon tile in `primary-soft`.
- Label: muted 14px.
- Value: `#111827` 26px, weight 700.
- Unit: muted 14px aligned to the baseline.
- Delta badge: 12px text, green or amber semantic tint on a matching soft background.

## Dataset Cards

Dataset cards combine a fixed-height thumbnail with compact metadata.

- Card radius: 16px, overflow hidden.
- Border: `#e3ece7`; hover border changes to `#a7f3d0` and hover shadow lifts gently.
- Thumbnail height: 150px, object-cover.
- Thumbnail hover: image scales to `1.06`; optional shimmer overlay may run across the image.
- Body padding: 16px.
- Tags: small rounded tags, usually emerald-tinted for scene/type.
- Metadata: 12px muted text with small icons for robot, size, and date.

## Filter Sidebar

The dataset filter sidebar is a white operational panel.

- Width: 320px.
- Padding: 20px.
- Radius: 16px.
- Sections separated by bottom border or 32px vertical spacing.
- Section labels: 13px, weight 600, muted/secondary text with small emerald icons.
- Filter pills: 12px text, 12px horizontal padding, 6px vertical padding, pill radius.
- Selected pill: emerald fill, white text, emerald border.
- Unselected pill: white fill, `#374151` text, `#e3ece7` border; hover border emerald.

## Forms & Inputs

Inputs and controls follow the same rounded, friendly geometry.

- Primary buttons use emerald `#10b981`, hover to `#059669`, 10px radius, 40px height.
- Large login button height: 44px, full width, 16px text, weight 600.
- Search input uses a large size and a prefix icon, 10px radius, `#e3ece7` border.
- Form labels should remain compact and top-aligned.
- Focus states use a `#10b981` border plus a soft `#a7f3d0` focus ring.

## Tabs

Detail tabs are simple underline tabs with friendly labels.

- Labels combine a small icon, text, and optional `Admin` danger tag.
- Active tab uses an emerald underline and emerald text, weight 600.
- Tab content transitions with a simple opacity fade.
- Do not wrap each tab panel in extra decorative containers unless it contains a real card section.

## Charts

Charts live inside white 16px cards.

- Keep chart title text dark and straightforward.
- Use roomy chart grids so labels do not crowd card edges.
- Prefer smooth line charts with soft area fills in `primary-soft` for growth trends.
- Donut charts can use radius around `40%` to `60%`, centered with legend at bottom.
- Reuse the chart palette in order: emerald `#10b981`, teal `#14b8a6`, sky `#0ea5e9`, lime `#84cc16`, amber `#f59e0b`.

## Code & File Panels

Dataset docs and intro pages use code/file panels for examples and storage format previews.

- Put code in a 16px rounded, overflow-hidden container with a `surface-soft` background.
- Use syntax highlighting with a light theme that keeps emerald accents for keywords where possible.
- File tree rows should preserve long file names without breaking layout; truncate or wrap intentionally.
- Use muted metadata for branch, size, author, commit, and history information.

# Motion & Interaction

Motion is subtle and utility-driven, with a slightly springier, friendlier feel than a strict enterprise console.

- General transitions: 0.2s ease.
- Card hover shadow transitions: 0.25s ease.
- Thumbnail zoom: 0.5s cubic-bezier motion.
- Back link icon moves left by 2px and scales slightly on hover.
- Route content fade: 0.4s opacity transition.
- Selected filter pills may animate their background with a quick 0.15s color transition.
- Avoid elaborate page transitions or decorative animation outside hover feedback.

# Responsive Behavior

Current desktop layouts should be preserved first, but new work should handle smaller screens deliberately.

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Stack nav content or collapse secondary nav; dashboard metrics become one column; dataset sidebar stacks above grid; dataset grid becomes one column; detail action buttons become full-width row/stack. |
| `768-1024px` | Metrics use two columns; dataset grid uses two columns; chart rows stack if width is constrained. |
| `1024-1440px` | Main desktop layout; dataset grid can use three columns depending on available width. |
| `> 1440px` | Use max-width containers; do not stretch text or cards indefinitely. |

Touch targets should stay at least 40px high for buttons, inputs, tab labels, and pagination controls.

# Do's and Don'ts

## Do

- Use the near-white mint canvas plus white 16px cards as the default page rhythm.
- Keep the UI dense enough for operations: labels, metadata, status, dates, sizes, and icons should remain visible.
- Use emerald consistently for selected/primary/action states, and reach for `#059669` on hover.
- Lean on soft green-tinted shadows and generous radius to create warmth without decoration.
- Keep charts in the emerald/teal/sky/lime/amber family so analytics feel on-brand.
- Keep cards and panels aligned to shared widths and 24px gaps.
- Prefer real dataset thumbnails, file trees, code snippets, tags, and metadata over abstract decoration.

## Don't

- Do not turn the product into a marketing landing page, even though the palette feels friendly.
- Do not use oversized hero typography, decorative gradients, illustration banners, or full-screen promotional sections.
- Do not introduce a second dominant brand color that competes with emerald.
- Do not use dark mode surfaces, heavy shadows, glassmorphism, or nested card-on-card compositions.
- Do not shrink radius back to sharp enterprise corners; 16px cards and 10px controls are part of the identity.
- Do not hide operational metadata for visual simplicity.
- Do not use saturated forest greens darker than `#059669` for large fills; the palette stays light and fresh.

# Agent Prompt Guide

When building new UI in this project, follow this short prompt:

> Build a fresh, friendly emerald-green SaaS interface. Use a near-white mint `#f7faf8` app canvas, white 16px cards, soft green-tinted shadows, Inter/system sans typography, 10px control radius, and emerald `#10b981` (hover `#059669`) for primary actions and selected states. Keep layouts dense, operational, and data-first. Avoid marketing hero sections, decorative gradients, and excessive whitespace.

Quick token reference:

- Canvas: `#f7faf8`
- Card: `#ffffff`
- Primary: `#10b981` (strong `#059669`, soft `#ecfdf5`)
- Text: `#1f2937`
- Muted text: `#6b7280`
- Border: `#e3ece7`
- Divider: `#eef4f0`
- Radius: `16px` cards, `10px` controls, `9999px` pills
- Shadow: `0 1px 2px rgba(31,41,55,0.04), 0 2px 8px rgba(16,185,129,0.05)`
