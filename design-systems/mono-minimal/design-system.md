---
version: alpha
name: mono-minimal
description: A monochrome, editorial minimal interface in the spirit of Linear. The system is built on a near-white canvas, pure white cards, black text, hairline borders, near-invisible shadows, small radii, and a single restrained blue-violet accent used only for links and selected states. The product should feel calm, precise, and quietly confident.
colors:
  primary: "#18181b"
  primary-soft: "#f4f4f5"
  primary-border: "#d4d4d8"
  primary-strong: "#27272a"
  canvas: "#fafafa"
  surface: "#ffffff"
  surface-soft: "#f6f6f7"
  surface-hover: "#f7f7f8"
  border: "#e4e4e7"
  border-strong: "#d4d4d8"
  divider: "#efeff0"
  text: "#09090b"
  text-strong: "#000000"
  text-muted: "#71717a"
  text-secondary: "#3f3f46"
  success: "#2f9e5f"
  success-text: "#1d7a45"
  success-bg: "#f0faf3"
  warning: "#c98a2e"
  warning-text: "#a66a14"
  warning-bg: "#fdf6ec"
  danger: "#d64545"
  info: "#71717a"
  chart-blue: "#5e6ad2"
  chart-indigo: "#8b93e0"
  chart-emerald: "#3f9d6e"
  chart-orange: "#d97742"
  chart-purple: "#8b6fc7"
typography:
  display-lg:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 22px
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: -0.01em
  title-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 15px
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: -0.01em
  title-sm:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 13px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  body-md:
    fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.5
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
    lineHeight: 1.4
    letterSpacing: 0
  code:
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace"
    fontSize: 13px
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: 0
rounded:
  sm: 4px
  md: 6px
  lg: 8px
  xl: 12px
  pill: 9999px
spacing:
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 20px
  xxl: 28px
  page: 20px
  section: 24px
shadows:
  card: "0 1px 2px rgba(0, 0, 0, 0.04)"
  card-hover: "0 2px 8px rgba(0, 0, 0, 0.06)"
  nav: "0 1px 2px rgba(0, 0, 0, 0.03)"
  media: "0 4px 12px rgba(0, 0, 0, 0.08)"
components:
  app-canvas:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.text}"
  top-nav:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.text}"
    height: 56px
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
    height: 36px
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

This is a monochrome, editorial-minimal product UI. It should feel like a precision instrument: quiet, exact, and free of decorative noise. The interface earns attention through alignment, spacing, and typographic contrast — not through color.

The visual system is anchored by three choices:

- A near-white application canvas (`#fafafa`) that barely separates the workspace from pure white cards.
- White cards with 8px radius, hairline 1px borders (`#e4e4e7`), and shadows so soft they are felt rather than seen.
- A near-black primary (`#18181b`) for buttons and selected states — black fill, white text — plus exactly one accent: a restrained blue-violet (`#5e6ad2`) reserved for links, focus rings, and active indicators.

Avoid marketing-site composition. This product should open directly into the tool surface: dashboards, dataset grids, filters, tabs, tables, trees, charts, and form controls — all rendered with calm, editorial restraint.

# Colors

## Brand & Action

- **Primary Ink** (`#18181b`): Main action color. Use for primary buttons (black fill, white text), selected filter chips, active borders, and compact identity blocks.
- **Primary Strong** (`#27272a`): Hover or pressed state for primary actions.
- **Primary Soft** (`#f4f4f5`): Neutral zinc tint for subtle selected backgrounds, empty states, and icon tiles.
- **Primary Border** (`#d4d4d8`): Avatar ring, focused outline, and low-emphasis selected borders.
- **Accent** (`#5e6ad2`): The only saturated color in the system. Use strictly for text links, focus rings, and small selected-state indicators (nav underline, checkbox check). Never use it for fills larger than a tag.

## Surfaces

- **Canvas** (`#fafafa`): Global page background.
- **Surface** (`#ffffff`): Cards, top nav, filter panel, detail header, data list cards, chart containers.
- **Surface Soft** (`#f6f6f7`): Low-emphasis secondary content blocks, light code-adjacent backgrounds.
- **Surface Hover** (`#f7f7f8`): Row hover and subtle list item hover.
- **Border** (`#e4e4e7`): Standard card and input border — always 1px.
- **Border Strong** (`#d4d4d8`): Metric-card border and stronger dividers.
- **Divider** (`#efeff0`): List separators inside cards.

## Text

- **Text** (`#09090b`): Default body and primary UI text — near-black everywhere.
- **Text Strong** (`#000000`): Large metric numbers.
- **Text Muted** (`#71717a`): Captions, helper text, dates, metadata, table secondary values.
- **Text Secondary** (`#3f3f46`): Unselected filter chip text.

## Semantic & Charts

- **Success** (`#2f9e5f`, text `#1d7a45`, bg `#f0faf3`): Published states, positive deltas, success tags — kept muted so they never shout.
- **Warning** (`#c98a2e`, text `#a66a14`, bg `#fdf6ec`): Pending, processing, attention states.
- **Danger/Error** (`#d64545`): Offline devices, destructive states — a flat, desaturated red, no glow.
- **Info** (`#71717a`): Neutral tags, identical to muted text.
- **Chart Series**: blue-violet `#5e6ad2`, light indigo `#8b93e0`, muted emerald `#3f9d6e`, muted orange `#d97742`, muted purple `#8b6fc7`.

# Typography

Use `Inter` as the project default, with system sans fallbacks. Typography is compact and slightly tighter than typical admin UIs. Headings may use `-0.01em` letter spacing for a refined, editorial feel; body text stays at `0`. Do not introduce decorative display fonts or oversized editorial headlines.

| Token | Size | Weight | Line Height | Use |
|---|---:|---:|---:|---|
| `display-lg` | 22px | 600 | 1.3 | Page titles, detail dataset title, login product name |
| `title-md` | 15px | 600 | 1.4 | Card section headers, chart titles, nav brand text |
| `title-sm` | 13px | 500 | 1.4 | Dataset card title, list row title, active nav |
| `body-md` | 14px | 400 | 1.5 | Form fields, body copy when needed |
| `body-sm` | 13px | 400 | 1.45 | Default UI text, filters, metadata rows |
| `caption` | 12px | 400 | 1.4 | Dates, sizes, role labels, status metadata |
| `code` | 13px | 400 | 1.6 | Highlight.js examples, storage tree examples, command snippets |

Numbers in KPI cards use 22px, weight 600, pure black, with `-0.01em` letter spacing. Labels and units stay muted at 13px or 12px.

# Layout

## Application Shell

- Top navigation is fixed, 56px high, white, full width, with a 1px bottom border and a nearly invisible shadow.
- Content starts below the nav at 56px and uses centered max-width containers.
- Dashboard pages use `max-width: 1440px` and 20px horizontal padding.
- Dataset list pages use `max-width: 1360px`.
- Dataset detail pages use `max-width: 1080px`.

## Spacing

Use a 4px base scale, applied with restraint.

- Tight inline gaps: 4px, 8px, 12px.
- Card padding: 16px or 20px — rarely more.
- Page gutters: 20px.
- Major vertical rhythm: 20px to 24px between panels.
- Avoid large empty hero whitespace; this is an operational product.

## Grid Patterns

- Dashboard metrics: five equal cards in one desktop row, each with a hairline border and a 2px near-black top border accent instead of a colored stripe.
- Dashboard charts: two-column row, flexible line chart plus fixed-width pie chart around 460px.
- Dataset list: left filter sidebar at 300px, content grid on the right.
- Dataset cards: four columns on wide desktop with 20px gaps.
- Detail pages: single centered column with a summary header, tabs, and stacked content cards.

# Components

## Top Navigation

The nav contains a compact square brand mark, product name, page links, user identity, and logout action.

- Brand mark: 28px square, near-black fill, 6px radius, white bold initials.
- Nav height: 56px.
- Horizontal padding: 24px.
- Active nav item: near-black text, 13px, weight 500, with a 2px accent-blue-violet (`#5e6ad2`) underline.
- Inactive nav item: 13px muted gray, hover to near-black.
- User avatar: 32px circle, near-black fill, hairline border.

## Cards

Cards are white with 8px radius and shadows so subtle they read as borders.

- Base shadow: `0 1px 2px rgba(0, 0, 0, 0.04)`.
- Hover shadow: `0 2px 8px rgba(0, 0, 0, 0.06)` — a gentle lift, never a dramatic pop.
- Standard border: `1px solid #e4e4e7` — prefer borders over shadows for separation.
- Use cards for actual content blocks, not nested decorative wrappers.

## KPI Cards

KPI cards are compact and data-first.

- White background, 8px radius, 16px padding.
- 1px `#d4d4d8` border plus a 2px near-black top border.
- Label: muted 13px.
- Value: black 22px, weight 600, `-0.01em` letter spacing.
- Unit: muted 13px aligned to the baseline.
- Delta badge: 12px text, muted green or muted orange semantic tint.

## Dataset Cards

Dataset cards combine a fixed-height thumbnail with compact metadata.

- Card radius: 8px, overflow hidden.
- Border: `#e4e4e7`; hover border changes to near-black.
- Thumbnail height: 132px, object-cover, rendered in grayscale by default with color restored on hover.
- Thumbnail hover: image scales to `1.04` — a restrained zoom, not a dramatic one.
- Body padding: 14px.
- Tags: small hairline-bordered tags, usually neutral zinc; at most one accent-colored tag per card.
- Metadata: 12px muted text with small monochrome icons for robot, size, and date.

## Filter Sidebar

The dataset filter sidebar is a white operational panel.

- Width: 300px.
- Padding: 16px.
- Radius: 8px.
- Sections separated by hairline bottom borders or 24px vertical spacing.
- Section labels: 12px, weight 500, muted text, uppercase optional at `0.04em` letter spacing.
- Filter pills: 12px text, 12px horizontal padding, 5px vertical padding, pill radius.
- Selected pill: near-black fill, white text, near-black border.
- Unselected pill: white fill, `#3f3f46` text, `#e4e4e7` border; hover border darkens to `#d4d4d8`.

## Forms & Inputs

Form controls are minimal rectangles with hairline borders and 6px radius.

- Primary buttons: near-black fill (`#18181b`), white text, 6px radius, 36px height; hover darkens to `#27272a`.
- Large login button height: 40px, full width, 14px text.
- Search input uses a hairline border and a muted prefix icon.
- Form labels should remain compact and top-aligned, 12px muted or 13px secondary.
- Focus states use a 2px accent-blue-violet (`#5e6ad2`) outline or a darkened border — never a colored glow.

## Tabs

Tabs are text-only with a hairline indicator.

- Labels combine a small monochrome icon and text; optional muted danger tag for admin-only tabs.
- Active tab: near-black text with a 2px near-black (or accent-blue-violet) underline.
- Inactive tabs: muted gray, hover to near-black.
- Tab content transitions with a simple opacity fade.
- Do not wrap each tab panel in extra decorative containers unless it contains a real card section.

## Charts

Charts live inside cards and stay monochrome-friendly.

- Keep chart title text near-black and straightforward, 15px weight 600.
- Use roomy chart grids so labels do not crowd card edges.
- Prefer smooth line charts with 2px strokes for growth trends; the primary series uses the accent blue-violet, secondary series use zinc grays.
- Pie charts can use donut radius around `40%` to `60%`, centered with legend at bottom.
- Reuse the chart palette: blue-violet, light indigo, muted emerald, muted orange, muted purple — all desaturated so no series screams.

## Code & File Panels

Dataset docs and intro pages use code/file panels for examples and storage format previews.

- Put code in an 8px rounded, overflow-hidden container with a hairline border.
- Use Highlight.js with a light, low-contrast theme; avoid saturated syntax colors.
- File tree rows should preserve long file names without breaking layout; truncate or wrap intentionally.
- Use muted metadata for branch, size, author, commit, and history information.

# Motion & Interaction

Motion is minimal and utility-driven — short, linear-feeling, never playful.

- General transitions: 0.15s ease.
- Card hover border/shadow transitions: 0.2s.
- Thumbnail zoom: 0.4s ease, capped at `1.04` scale.
- Back link icon moves left by 2px on hover.
- Route content fade: 0.3s opacity transition.
- Avoid elaborate page transitions, bouncy easings, or decorative animation outside hover feedback.

# Responsive Behavior

Current desktop layouts should be preserved first, but new work should handle smaller screens deliberately.

| Breakpoint | Behavior |
|---|---|
| `< 768px` | Stack nav content or collapse secondary nav; dashboard metrics become one column; dataset sidebar stacks above grid; dataset grid becomes one column; detail action buttons become full-width row/stack. |
| `768-1024px` | Metrics use two columns; dataset grid uses two columns; chart rows stack if width is constrained. |
| `1024-1440px` | Main desktop layout; dataset grid can use three columns depending on available width. |
| `> 1440px` | Use max-width containers; do not stretch text or cards indefinitely. |

Touch targets should stay at least 36px high for buttons, inputs, tab labels, and pagination controls.

# Do's and Don'ts

## Do

- Use the near-white canvas plus white hairline-bordered cards as the default page rhythm.
- Keep the UI dense enough for operations: labels, metadata, status, dates, sizes, and icons should remain visible.
- Use near-black for every primary action and selected state; let black do the work that color does elsewhere.
- Reserve the accent blue-violet (`#5e6ad2`) for links, focus rings, and small active indicators — nothing larger.
- Prefer 1px borders over shadows to separate surfaces.
- Keep radii small and consistent: 8px cards, 6px controls, pills only for filters and tags.
- Keep letter spacing tight on headings (`-0.01em`) and zero everywhere else.
- Prefer real dataset thumbnails, file trees, code snippets, tags, and metadata over abstract decoration.

## Don't

- Do not turn the product into a marketing landing page.
- Do not use oversized hero typography, decorative gradients, or full-screen promotional sections.
- Do not introduce a second saturated color — the accent blue-violet is the only one.
- Do not add visible shadows, glassmorphism, glows, or nested card-on-card compositions.
- Do not use large border radii (above 12px) except pills; softness is not the goal.
- Do not hide operational metadata for visual simplicity.
- Do not use colored button fills other than near-black; no colored CTAs.

# Agent Prompt Guide

When building new UI in this project, follow this short prompt:

> Build a monochrome, editorial-minimal interface. Use a near-white `#fafafa` app canvas, pure white cards with 1px `#e4e4e7` borders and 8px radius, Inter/system sans typography, near-invisible shadows, and near-black `#18181b` for all primary buttons and selected states (black fill, white text). Use exactly one accent — blue-violet `#5e6ad2` — only for links, focus rings, and small active indicators. Keep layouts dense, operational, and precise. Avoid marketing hero sections, gradients, saturated colors, and visible shadows.

Quick token reference:

- Canvas: `#fafafa`
- Card: `#ffffff`
- Primary: `#18181b`
- Accent (links/focus only): `#5e6ad2`
- Text: `#09090b`
- Muted text: `#71717a`
- Border: `#e4e4e7`
- Divider: `#efeff0`
- Radius: `8px` cards, `6px` controls, `9999px` pills
- Shadow: `0 1px 2px rgba(0,0,0,0.04)`
