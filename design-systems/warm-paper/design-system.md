---
version: alpha
name: warm-paper
description: A warm, paper-feel editorial tool interface. The system is built on a cream canvas, warm white cards, a terracotta-orange primary action color, serif display accents, and very light warm shadows — like a calm Notion-style document workspace rather than a cold console.
colors:
  primary: "#c2410c"
  primary-soft: "#fff7ed"
  primary-border: "#fed7aa"
  primary-strong: "#9a3412"
  canvas: "#faf9f7"
  surface: "#ffffff"
  surface-soft: "#f5f3ef"
  surface-hover: "#faf7f2"
  border: "#e7e5e4"
  border-strong: "#d6d3d1"
  divider: "#f0eeeb"
  text: "#292524"
  text-strong: "#1c1917"
  text-muted: "#78716c"
  text-secondary: "#57534e"
  success: "#4d7c0f"
  success-text: "#3f6212"
  success-bg: "#f7fee7"
  warning: "#b45309"
  warning-text: "#92400e"
  warning-bg: "#fffbeb"
  danger: "#b91c1c"
  info: "#78716c"
  chart-blue: "#c2410c"
  chart-indigo: "#d97706"
  chart-emerald: "#65a30d"
  chart-orange: "#b91c1c"
  chart-purple: "#92400e"
typography:
  display-lg:
    fontFamily: "Georgia, Charter, Bitstream Charter, Sitka Text, Cambria, serif"
    fontSize: 26px
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: 0.005em
  title-md:
    fontFamily: "Georgia, Charter, Bitstream Charter, Sitka Text, Cambria, serif"
    fontSize: 17px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0.005em
  title-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 14px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 15px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
  body-sm:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
  caption:
    fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, PingFang SC, Microsoft YaHei, sans-serif"
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
  sm: 5px
  md: 8px
  lg: 10px
  xl: 14px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 18px
  xl: 26px
  xxl: 36px
  page: 26px
  section: 36px
shadows:
  card: "0 1px 2px rgba(120, 72, 20, 0.06)"
  card-hover: "0 3px 10px rgba(120, 72, 20, 0.1)"
  nav: "0 1px 6px rgba(120, 72, 20, 0.05)"
  media: "0 8px 18px rgba(120, 72, 20, 0.12)"
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
    height: 38px
  filter-pill:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text-secondary}"
    activeBackgroundColor: "{colors.primary-soft}"
    activeTextColor: "{colors.primary-strong}"
    rounded: "{rounded.pill}"
  dataset-card:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    border: "1px solid {colors.border}"
    hoverBorder: "1px solid {colors.primary-border}"
  code-panel:
    backgroundColor: "{colors.surface-soft}"
    rounded: "{rounded.lg}"
    codeTypography: "{typography.code}"
---

# Overview

This is a warm, paper-feel interface for an editorial, document-like tool. It should feel like a calm writing desk: cream canvas, warm white pages, quiet warm-gray borders, and a single confident terracotta accent. The product opens directly into the work surface — dashboards, dataset grids, filters, tabs, tables, and form controls — but reads softer and more human than a cold enterprise console.

The visual system is anchored by three choices:

- A warm cream application canvas (`#faf9f7`) that separates the workspace from pure warm white cards.
- Warm white cards with 10px radius and extremely light warm-tinted shadows (`rgba(120,72,20,…)`), used for statistics, charts, filter panels, dataset listings, file trees, and detail sections.
- A terracotta orange primary color (`#c2410c`) for navigation state, primary actions, selected filters, active borders, links, and identity marks.

Serif type (Georgia/Charter) appears only at display and section-title level to give the interface a document/editorial character; everything else stays on the system sans stack. Avoid marketing-site composition: the tool surface comes first, warmth comes from color and texture, not decoration.

# Colors

## Brand & Action

- **Primary Terracotta** (`#c2410c`): Main brand/action color. Use for selected nav items, primary buttons, links, focused states, and compact identity blocks.
- **Primary Strong** (`#9a3412`): Hover or pressed state when a deeper, burnt-orange action color is needed.
- **Primary Soft** (`#fff7ed`): Soft peach tint for subtle selected backgrounds, active filter pills, empty states, and icon tiles.
- **Primary Border** (`#fed7aa`): Focused outline, low-emphasis selected borders, and dataset-card hover borders.

## Surfaces

- **Canvas** (`#faf9f7`): Global page background — warm cream paper.
- **Surface** (`#ffffff`): Cards, top nav, filter panel, detail header, data list cards, chart containers.
- **Surface Soft** (`#f5f3ef`): Low-emphasis panels, secondary content blocks, and code-adjacent backgrounds — a slightly darker beige that reads as a paper layer.
- **Surface Hover** (`#faf7f2`): Row hover and subtle list item hover — barely warmer than the card itself.
- **Border** (`#e7e5e4`): Standard card and input border — warm gray, never blue-gray.
- **Border Strong** (`#d6d3d1`): Metric-card border and stronger dividers.
- **Divider** (`#f0eeeb`): List separators inside cards — keep them nearly invisible.

## Text

- **Text** (`#292524`): Default body and primary UI text — warm near-black (stone), never pure neutral gray.
- **Text Strong** (`#1c1917`): Large metric numbers and display headings.
- **Text Muted** (`#78716c`): Captions, helper text, dates, metadata, table secondary values.
- **Text Secondary** (`#57534e`): Unselected filter chip text and secondary labels.

## Semantic & Charts

- **Success** (`#4d7c0f`, text `#3f6212`, bg `#f7fee7`): Olive-lime success states, published tags, positive deltas — earthy, not neon.
- **Warning** (`#b45309`, text `#92400e`, bg `#fffbeb`): Amber-brown pending, processing, attention states.
- **Danger/Error** (`#b91c1c`): Deep terracotta-red destructive and offline states; harmonizes with the primary rather than clashing with it.
- **Info** (`#78716c`): Neutral warm-gray info tags.
- **Chart Series** (warm palette): terracotta `#c2410c`, amber `#d97706`, olive `#65a30d`, clay red `#b91c1c`, warm brown `#92400e`.

# Typography

Body text uses the system sans stack with CJK fallbacks. Serif type (Georgia/Charter) is reserved for `display-lg` page titles and `title-md` section/card titles to give the interface its editorial, document-like voice. Do not use serif for buttons, tables, or metadata.

| Token | Size | Weight | Line Height | Use |
|---|---:|---:|---:|---|
| `display-lg` | 26px | 700 | 1.3 | Page titles, detail dataset title, login product name — serif |
| `title-md` | 17px | 700 | 1.4 | Card section headers, chart titles, nav brand text — serif |
| `title-sm` | 14px | 600 | 1.4 | Dataset card title, list row title, active nav — sans |
| `body-md` | 15px | 400 | 1.6 | Form fields, body copy — slightly roomier leading suits the paper feel |
| `body-sm` | 14px | 400 | 1.55 | Default UI text, filters, metadata rows |
| `caption` | 12px | 400 | 1.45 | Dates, sizes, role labels, status metadata |
| `code` | 13px | 400 | 1.6 | Code examples, storage tree examples, command snippets |

Numbers in KPI cards use 24px, weight 700, in warm near-black `#1c1917` — sans, never serif, so figures stay precise. Labels and units stay muted at 14px or 12px. Serif tokens may use a slight positive letter spacing (`0.005em`); everything else stays at `0`.

# Layout

## Application Shell

- Top navigation is fixed, 64px high, warm white, full width, with a hairline warm-gray bottom border and a barely-there warm shadow.
- Content starts below the nav at 64px and uses centered max-width containers.
- Dashboard pages use `max-width: 1440px` and 26px horizontal padding.
- Dataset list pages use `max-width: 1360px`.
- Dataset detail pages use `max-width: 1080px` — narrower than a console, closer to a readable document column.

## Spacing

Use a 4px base scale, with a slightly more generous rhythm than a dense console so the warmth can breathe.

- Tight inline gaps: 4px, 8px, 12px.
- Card padding: 18px, 22px, or 26px.
- Page gutters: 26px.
- Major vertical rhythm: 26px to 36px between panels.
- Still avoid large empty hero whitespace; this remains an operational product, just a warmer one.

## Grid Patterns

- Dashboard metrics: five equal cards in one desktop row, each with a colored 3px left border.
- Dashboard charts: two-column row, flexible line chart plus fixed-width pie chart around 440px.
- Dataset list: left filter sidebar at 300px, content grid on the right.
- Dataset cards: three to four columns on wide desktop with 24px gaps.
- Detail pages: single centered column with a summary header, tabs, and stacked content cards.

# Components

## Top Navigation

The nav contains a compact rounded brand mark, product name in serif, page links, user identity, and logout action.

- Brand mark: 34px square, terracotta `#c2410c` background, 8px radius, white bold initials.
- Nav height: 64px.
- Horizontal padding: 28px.
- Active nav item: terracotta text, 15px, weight 600.
- Inactive nav item: 14px muted stone, hover to terracotta.
- User avatar: 38px circle, terracotta fill, 2px soft peach `#fed7aa` ring.

## Cards

Cards are warm white with 10px radius and extremely light warm shadows.

- Base shadow: `0 1px 2px rgba(120, 72, 20, 0.06)`.
- Hover shadow: `0 3px 10px rgba(120, 72, 20, 0.1)`.
- Standard border when precision is needed: `1px solid #e7e5e4`.
- Shadows must always be warm-tinted — never use blue or pure-black shadow rgba values.
- Use cards for actual content blocks, not nested decorative wrappers.

## KPI Cards

KPI cards are compact and data-first.

- Warm white background, 10px radius, 20px padding.
- 1px `#d6d3d1` border plus a 3px colored left border drawn from the warm chart palette.
- Label: muted 13px.
- Value: warm near-black 24px, weight 700 (sans).
- Unit: muted 13px aligned to the baseline.
- Delta badge: 12px text, olive or amber semantic tint.

## Dataset Cards

Dataset cards combine a fixed-height thumbnail with compact metadata.

- Card radius: 10px, overflow hidden.
- Border: `#e7e5e4`; hover border changes to soft peach `#fed7aa`.
- Thumbnail height: 150px, object-cover.
- Thumbnail hover: image scales to `1.06`; optional warm shimmer overlay may run across the image.
- Body padding: 16px.
- Tags: small warm-tinted tags, primary-soft peach for scene/type.
- Metadata: 12px muted text with small icons for robot, size, and date.

## Filter Sidebar

The dataset filter sidebar is a warm white operational panel.

- Width: 300px.
- Padding: 20px.
- Radius: 10px.
- Sections separated by a `#f0eeeb` bottom border or 30px vertical spacing.
- Section labels: 13px, semibold, muted/secondary text with small terracotta icons.
- Filter pills: 12px text, 12px horizontal padding, 6px vertical padding, pill radius.
- Selected pill: soft peach `#fff7ed` fill, deep terracotta `#9a3412` text, `#fed7aa` border.
- Unselected pill: white fill, `#57534e` text, `#e7e5e4` border; hover border soft peach.

## Forms & Inputs

Form controls follow the same warm, quiet logic.

- Primary buttons use terracotta `#c2410c`, hover to `#9a3412`; height 38px, 8px radius.
- Large login button height: 42px, full width, 15px text.
- Search input uses a large size with a prefix icon.
- Inputs: white fill, `#e7e5e4` border, 8px radius; focus ring in soft peach `#fed7aa` with terracotta border.
- Form labels should remain compact and top-aligned.
- Disabled states use the `surface-soft` beige fill, never a cold gray.

## Tabs

Detail tabs are quiet text tabs with a terracotta underline.

- Labels combine a small icon, text, and optional danger tag.
- Active tab uses a 2px terracotta underline and terracotta text.
- Tab content transitions with a simple opacity fade.
- Do not wrap each tab panel in extra decorative containers unless it contains a real card section.

## Charts

Charts live inside warm white cards.

- Keep chart title text dark and straightforward (serif `title-md` is welcome here).
- Use roomy chart grids so labels do not crowd card edges.
- Prefer smooth line charts for growth trends.
- Pie charts can use donut radius around `40%` to `60%`, centered with legend at bottom.
- Reuse the warm chart palette: terracotta, amber, olive, clay red, warm brown — never introduce cool blues or purples into series colors.

## Code & File Panels

Docs and intro pages use code/file panels for examples and storage format previews.

- Put code in a 10px rounded, overflow-hidden container on the `surface-soft` beige background — code on paper, not on a black terminal.
- Use warm-tinted syntax highlighting (terracotta keywords, olive strings, amber numbers).
- File tree rows should preserve long file names without breaking layout; truncate or wrap intentionally.
- Use muted metadata for branch, size, author, commit, and history information.

# Motion & Interaction

Motion is subtle and utility-driven, slightly softer than a console.

- General transitions: 0.25s ease.
- Card hover shadow transitions: 0.3s ease.
- Thumbnail zoom: 0.5s ease-out.
- Back link icon moves left by 2px and scales slightly on hover.
- Route content fade: 0.4s opacity transition.
- Avoid elaborate page transitions or decorative animation outside hover feedback.

# Responsive Behavior

Current desktop layouts should be preserved first, but new work should handle smaller screens deliberately.

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Stack nav content or collapse secondary nav; dashboard metrics become one column; dataset sidebar stacks above grid; dataset grid becomes one column; detail action buttons become full-width row/stack. |
| `768-1024px` | Metrics use two columns; dataset grid uses two columns; chart rows stack if width is constrained. |
| `1024-1440px` | Main desktop layout; dataset grid can use three columns depending on available width. |
| `> 1440px` | Use max-width containers; do not stretch text or cards indefinitely — extra width should read as generous cream margin, like a page on a desk. |

Touch targets should stay at least 38px high for buttons, inputs, tab labels, and pagination controls.

# Do's and Don'ts

## Do

- Use the cream canvas plus warm white cards as the default page rhythm.
- Keep the UI operational: labels, metadata, status, dates, sizes, and icons should remain visible.
- Use terracotta sparingly and consistently for selected/primary/action states; prefer `primary-soft` peach for selected backgrounds.
- Keep every border, divider, and shadow warm-tinted — stone grays and `rgba(120,72,20,…)` shadows only.
- Let serif type appear at page-title and section-title level to carry the editorial character.
- Keep cards and panels aligned to shared widths and 24–26px gaps.
- Prefer real dataset thumbnails, file trees, code snippets, tags, and metadata over abstract decoration.

## Don't

- Do not turn the product into a marketing landing page or an editorial magazine — the tool surface still comes first.
- Do not use cool grays, blue-tinted borders, or neutral-black shadows anywhere; cold tones break the paper illusion instantly.
- Do not introduce a second dominant brand color that competes with terracotta.
- Do not add heavy shadows, glassmorphism, dark terminal-style code blocks, or nested card-on-card compositions.
- Do not set body text, tables, buttons, or numbers in the serif stack — serif is a display accent only.
- Do not use rounded pills for everything; reserve pill shapes for filters, tags, and avatars.
- Do not hide operational metadata for visual simplicity.
- Do not use negative letter spacing or viewport-scaled font sizes.

# Agent Prompt Guide

When building new UI in this project, follow this short prompt:

> Build a warm, paper-feel tool interface. Use a cream `#faf9f7` app canvas, warm white 10px cards, warm gray `#e7e5e4` borders, extremely light warm-tinted shadows (`rgba(120,72,20,0.06)` family), system sans typography with Georgia/Charter serif only for page and section titles, and terracotta `#c2410c` (hover `#9a3412`, soft tint `#fff7ed`) for primary actions and selected states. Charts use a warm palette of terracotta, amber, olive, clay red, and warm brown. Keep layouts operational and data-first. Avoid cool grays, blue-tinted borders, dark code blocks, marketing hero sections, and decorative gradients.

Quick token reference:

- Canvas: `#faf9f7`
- Card: `#ffffff`
- Surface soft: `#f5f3ef`
- Primary: `#c2410c` (hover `#9a3412`, soft `#fff7ed`, border `#fed7aa`)
- Text: `#292524`
- Muted text: `#78716c`
- Border: `#e7e5e4`
- Divider: `#f0eeeb`
- Radius: `10px` cards, `8px` controls, `9999px` pills
- Shadow: `0 1px 2px rgba(120,72,20,0.06)`
- Charts: `#c2410c` / `#d97706` / `#65a30d` / `#b91c1c` / `#92400e`
