---
version: alpha
name: design-system
description: A light enterprise data-platform interface. The system is built on a cool gray canvas, white operational cards, indigo primary actions, Element Plus form controls, UnoCSS utility layout, and ECharts-based analytics panels. The product should feel precise, calm, data-dense, and work-focused.
colors:
  primary: "#6366f1"
  primary-soft: "#eef2ff"
  primary-border: "#c7d2fe"
  primary-strong: "#4f46e5"
  canvas: "#f3f4f6"
  surface: "#ffffff"
  surface-soft: "#fafafc"
  surface-hover: "#f8fafc"
  border: "#e5e7eb"
  border-strong: "#e2e8f0"
  divider: "#f1f5f9"
  text: "#1e293b"
  text-strong: "#000000"
  text-muted: "#64748b"
  text-secondary: "#333333"
  success: "#67c23a"
  success-text: "#16a34a"
  success-bg: "#f0fdf4"
  warning: "#e6a23c"
  warning-text: "#f97316"
  warning-bg: "#fff7ed"
  danger: "#f56c6c"
  info: "#909399"
  chart-blue: "#3b82f6"
  chart-indigo: "#6366f1"
  chart-emerald: "#10b981"
  chart-orange: "#f97316"
  chart-purple: "#a855f7"
typography:
  display-lg:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 24px
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: 0
  title-md:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 16px
    fontWeight: 700
    lineHeight: 1.4
    letterSpacing: 0
  title-sm:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.45
    letterSpacing: 0
  caption:
    fontFamily: "Roboto, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: 0
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.55
    letterSpacing: 0
rounded:
  sm: 4px
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
  section: 32px
shadows:
  card: "0 1px 3px rgba(0, 0, 0, 0.05)"
  card-hover: "0 2px 10px 4px rgba(0, 0, 0, 0.1)"
  nav: "0 0 10px rgba(0, 0, 0, 0.06)"
  media: "0 8px 20px rgba(0, 0, 0, 0.1)"
components:
  app-canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
  top-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    height: 68px
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
    hoverBorder: "1px solid {colors.primary}"
  code-panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.lg}"
    codeTypography: "{typography.code}"
---

# Overview

This is a light, enterprise-grade data-platform UI. It should look like an operational console: calm, sortable, scannable, and built for repeated use by administrators, researchers, and data operators.

The visual system is anchored by three choices:

- A cool gray application canvas (`#f3f4f6`) that separates the workspace from white cards.
- White cards with 12px radius and soft shadows, used for statistics, charts, filter panels, dataset listings, file trees, and detail sections.
- Indigo primary color (`#6366f1`) for navigation state, primary actions, selected filters, active borders, and identity marks.

Avoid marketing-site composition. This product should open directly into the tool surface: dashboards, dataset grids, filters, tabs, tables, trees, charts, and form controls.

# Colors

## Brand & Action

- **Primary Indigo** (`#6366f1`): Main brand/action color. Use for selected nav items, primary Element Plus buttons, selected filter chips, active borders, links, and compact identity blocks.
- **Primary Strong** (`#4f46e5`): Hover or pressed state when a darker action color is needed.
- **Primary Soft** (`#eef2ff`): Soft indigo tint for subtle selected backgrounds, empty states, and icon tiles.
- **Primary Border** (`#c7d2fe`): Avatar ring, focused outline, and low-emphasis selected borders.

## Surfaces

- **Canvas** (`#f3f4f6`): Global page background.
- **Surface** (`#ffffff`): Cards, top nav, filter panel, detail header, data list cards, chart containers.
- **Surface Soft** (`#fafafc`): Low-emphasis demo account panel, secondary content blocks, light code-adjacent backgrounds.
- **Surface Hover** (`#f8fafc`): Row hover and subtle list item hover.
- **Border** (`#e5e7eb`): Standard card and input border.
- **Border Strong** (`#e2e8f0`): Metric-card border and stronger dividers.
- **Divider** (`#f1f5f9`): List separators inside cards.

## Text

- **Text** (`#1e293b`): Default body and primary UI text.
- **Text Strong** (`#000000`): Large metric numbers.
- **Text Muted** (`#64748b`): Captions, helper text, dates, metadata, table secondary values.
- **Text Secondary** (`#333333`): Unselected filter chip text.

## Semantic & Charts

- **Success** (`#67c23a`, text `#16a34a`, bg `#f0fdf4`): Published states, positive deltas, success tags.
- **Warning** (`#e6a23c`, text `#f97316`, bg `#fff7ed`): Pending annotation, processing, attention states.
- **Danger/Error** (`#f56c6c`): Offline devices, admin-danger tags, destructive states.
- **Info** (`#909399`): Neutral Element Plus info tags.
- **Chart Series**: blue `#3b82f6`, indigo `#6366f1`, emerald `#10b981`, orange `#f97316`, purple `#a855f7`.

# Typography

Use `Roboto` as the project default, with system sans fallbacks. Typography is utilitarian and compact. Do not introduce decorative display fonts or oversized editorial headlines.

| Token | Size | Weight | Line Height | Use |
|---|---:|---:|---:|---|
| `display-lg` | 24px | 700 | 1.25 | Page titles, detail dataset title, login product name |
| `title-md` | 16px | 700 | 1.4 | Card section headers, chart titles, nav brand text |
| `title-sm` | 14px | 500 | 1.4 | Dataset card title, list row title, active nav |
| `body-md` | 16px | 400 | 1.5 | Form fields, body copy when needed |
| `body-sm` | 14px | 400 | 1.45 | Default UI text, filters, metadata rows |
| `caption` | 12px | 400 | 1.4 | Dates, sizes, role labels, status metadata |
| `code` | 13px | 400 | 1.55 | Highlight.js examples, storage tree examples, command snippets |

Numbers in KPI cards use 24px, weight 700, black. Labels and units stay muted at 14px or 12px. Keep letter spacing at `0`.

# Layout

## Application Shell

- Top navigation is fixed, 68px high, white, full width, with a subtle bottom border and shadow.
- Content starts below the nav at 68px and uses centered max-width containers.
- Dashboard pages use `max-width: 1600px` and 24px horizontal padding.
- Dataset list pages use `max-width: 1500px`.
- Dataset detail pages use `max-width: 1200px`.

## Spacing

Use a 4px base scale through UnoCSS and the configured rem-to-px preset.

- Tight inline gaps: 4px, 8px, 12px.
- Card padding: 16px, 20px, or 24px.
- Page gutters: 24px.
- Major vertical rhythm: 24px to 32px between panels.
- Avoid large empty hero whitespace; this is an operational product.

## Grid Patterns

- Dashboard metrics: five equal cards in one desktop row, each with a colored 4px left border.
- Dashboard charts: two-column row, flexible line chart plus fixed-width pie chart around 500px.
- Dataset list: left filter sidebar at 332px, content grid on the right.
- Dataset cards: four columns on wide desktop with 24px gaps.
- Detail pages: single centered column with a summary header, tabs, and stacked content cards.

# Components

## Top Navigation

The nav contains a compact square brand mark, product name, page links, user identity, and logout action.

- Brand mark: 36px square, indigo background, 8px radius, white bold initials.
- Nav height: 68px.
- Horizontal padding: 32px.
- Active nav item: indigo text, 15px, weight 500.
- Inactive nav item: 14px muted gray, hover to indigo.
- User avatar: 40px circle, indigo fill, 8px soft blue border.

## Cards

Cards are white with 12px radius and soft shadow.

- Base shadow: `0 1px 3px rgba(0, 0, 0, 0.05)`.
- Hover shadow: `0 2px 10px 4px rgba(0, 0, 0, 0.1)`.
- Standard border when precision is needed: `1px solid #e5e7eb`.
- Use cards for actual content blocks, not nested decorative wrappers.

## KPI Cards

KPI cards are compact and data-first.

- White background, 12px radius, 20px padding.
- 1px `#e2e8f0` border plus a 4px colored left border.
- Label: muted 14px.
- Value: black 24px, weight 700.
- Unit: muted 14px aligned to the baseline.
- Delta badge: 12px text, green or orange semantic tint.

## Dataset Cards

Dataset cards combine a fixed-height thumbnail with compact metadata.

- Card radius: 12px, overflow hidden.
- Border: `#e5e7eb`; hover border changes to primary indigo.
- Thumbnail height: 144px, object-cover.
- Thumbnail hover: image scales to `1.1`; optional shimmer overlay may run across the image.
- Body padding: 16px.
- Tags: Element Plus small tags, usually primary for scene/type.
- Metadata: 12px muted text with small icons for robot, size, and date.

## Filter Sidebar

The dataset filter sidebar is a white operational panel.

- Width: 332px.
- Padding: 20px.
- Radius: 12px.
- Sections separated by bottom border or 32px vertical spacing.
- Section labels: 13px, semibold, muted/secondary text with small indigo icons.
- Filter pills: 12px text, 12px horizontal padding, 6px vertical padding, pill radius.
- Selected pill: indigo fill, white text, indigo border.
- Unselected pill: white fill, `#333333` text, `#e0e0e0` border; hover border indigo.

## Forms & Inputs

Use Element Plus as the source of truth for input, select, checkbox, pagination, tabs, buttons, and dialog behavior.

- Primary buttons use Element Plus primary color `#6366f1`.
- Large login button height: 44px, full width, 16px text.
- Search input uses `size="large"` and a prefix icon.
- Form labels should remain compact and top-aligned.
- Focus states should use indigo borders or Element Plus native focus rings.

## Tabs

Dataset detail tabs are Element Plus tabs with custom labels.

- Labels combine a small icon, text, and optional `Admin` danger tag.
- Active tab should rely on Element Plus primary underline and primary text.
- Tab content transitions with a simple opacity fade.
- Do not wrap each tab panel in extra decorative containers unless it contains a real card section.

## Charts

Charts use ECharts inside cards.

- Keep chart title text dark and straightforward.
- Use roomy chart grids so labels do not crowd card edges.
- Prefer smooth line charts for growth trends.
- Pie charts can use donut radius around `40%` to `60%`, centered with legend at bottom.
- Reuse the chart palette: blue, indigo, emerald, orange, purple.

## Code & File Panels

Dataset docs and intro pages use code/file panels for LeRobot examples and storage format previews.

- Put code in a 12px rounded, overflow-hidden container.
- Use Highlight.js for code styling.
- File tree rows should preserve long file names without breaking layout; truncate or wrap intentionally.
- Use muted metadata for branch, size, author, commit, and history information.

# Motion & Interaction

Motion is subtle and utility-driven.

- General transitions: 0.25s.
- Card hover shadow transitions: 0.3s.
- Thumbnail zoom: 0.6s cubic-bezier motion.
- Back link icon moves left by 2px and scales slightly on hover.
- Route content fade: 0.5s opacity transition.
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

- Use the gray canvas plus white cards as the default page rhythm.
- Keep the UI dense enough for operations: labels, metadata, status, dates, sizes, and icons should remain visible.
- Use indigo sparingly and consistently for selected/primary/action states.
- Let Element Plus define form controls and interaction behavior.
- Use ECharts for analytics rather than custom chart drawings.
- Keep cards and panels aligned to shared widths and 24px gaps.
- Prefer real dataset thumbnails, file trees, code snippets, tags, and metadata over abstract decoration.

## Don't

- Do not turn the product into a marketing landing page.
- Do not use oversized hero typography, decorative gradients, or full-screen promotional sections.
- Do not introduce a second dominant brand color that competes with indigo.
- Do not add heavy shadows, glassmorphism, or nested card-on-card compositions.
- Do not use rounded pills for everything; reserve pill shapes for filters, tags, and avatars.
- Do not hide operational metadata for visual simplicity.
- Do not use negative letter spacing or viewport-scaled font sizes.

# Agent Prompt Guide

When building new UI in this project, follow this short prompt:

> Build a light enterprise data-platform interface. Use a cool gray `#f3f4f6` app canvas, white 12px cards, subtle borders, soft shadows, Roboto/system sans typography, Element Plus controls, UnoCSS utilities, and indigo `#6366f1` for primary actions and selected states. Keep layouts dense, operational, and data-first. Avoid marketing hero sections, decorative gradients, and excessive whitespace.

Quick token reference:

- Canvas: `#f3f4f6`
- Card: `#ffffff`
- Primary: `#6366f1`
- Text: `#1e293b`
- Muted text: `#64748b`
- Border: `#e5e7eb`
- Divider: `#f1f5f9`
- Radius: `12px` cards, `8px` controls, `9999px` pills
- Shadow: `0 1px 3px rgba(0,0,0,0.05)`
