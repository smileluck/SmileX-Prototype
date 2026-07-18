# Naive Core

A dark-first design system distilled from naïve-ui's official dark theme — **core subset (24 components)** retained to cover the dashboard UI Kit. The canonical token source is `colors_and_type.css` (+ `css.json`).

## Open the Showcases

All HTML files reference `colors_and_type.css` via relative paths and run as static pages.

| Showcase | Path |
|----------|------|
| Component — Alert | `preview/component-alert.html` |
| Component — Atoms (shared utilities) | `preview/component-atoms.html` |
| Component — Avatar | `preview/component-avatar.html` |
| Component — Badge | `preview/component-badge.html` |
| Component — Breadcrumb | `preview/component-breadcrumb.html` |
| Component — Button Group | `preview/component-button-group.html` |
| Component — Buttons | `preview/component-buttons.html` |
| Component — Card | `preview/component-cards.html` |
| Component — Dialog | `preview/component-dialog.html` |
| Component — Dropdown | `preview/component-dropdown.html` |
| Component — Empty State | `preview/component-empty.html` |
| Component — Form | `preview/component-form.html` |
| Component — Form Controls | `preview/component-forms.html` |
| Component — Input Number | `preview/component-input-number.html` |
| Component — Menu | `preview/component-menu.html` |
| Component — Notification | `preview/component-notification.html` |
| Component — Pagination | `preview/component-pagination.html` |
| Component — Popover | `preview/component-popover.html` |
| Component — Progress Bar | `preview/component-progress.html` |
| Component — Select | `preview/component-select.html` |
| Component — Data Table | `preview/component-table.html` |
| Component — Tabs | `preview/component-tabs.html` |
| Component — Tag | `preview/component-tag.html` |
| Component — Tooltip | `preview/component-tooltip.html` |
| UI Kit — Dashboard | `ui_kits/dashboard/index.html` |

## What's Inside

- `colors_and_type.css` — authoritative token source (verbatim from naïve-ui dark theme, marked `/* @dark-only */` with `/* @group-priority: brand-green, status, brand-blue, brand-yellow, brand-red */`).
- `css.json` — machine-readable token projection (`color`, `font`, `radius`, `spacing`, plus empty `shadow` / `size` buckets reserved by spec).
- `components/` — 24 component slugs (`{slug}.json` + a shared `index.json`). Each contract carries `category`, `tokensConsumed`, `domAnatomy`, and `provenance`.
- `preview/` — 24 component preview pages (`component-{slug}.html`). Each page (a) self-contains its preview-page chrome (reset, body padding, `.pv-*`) above the `@component-css-start` marker so it never leaks downstream, (b) embeds the canonical CSS for its `.ds-*` classes inside `<style>` between `/* @component-css-start */` and `/* @component-css-end */` markers, and (c) loads JetBrains Mono via a `<link rel="stylesheet" href="https://fonts.googleapis.com/...">` in `<head>`.
- `ui_kits/` — 1 page-level showcase (`dashboard`) as a single interactive React 18 `index.html` with a sibling `quality-report.json`.
- `components.css` — aggregated component class definitions, **auto-generated** from the marker blocks above by `design-library-creator/scripts/extract-components-css.mjs`. Do not edit by hand — regenerate after editing the corresponding `preview/component-*.html` file.
- `uikit-plan.json` — component whitelist (2 core + 22 support) and slot assignments.
- `library-consumption.json` — recommended downstream read order for agents.
- `assets/icons/` — bundled SVG icons (default + status-tinted variants).
- `icons.js` — optional inline icon-sprite renderer.

## Token Highlights

| Group | Examples |
|-------|----------|
| Brand | `--primaryColor #63e2b7`, `--primaryColorHover #7fe7c4`, `--primaryColorPressed #5acea7` |
| Status — Info | `--infoColor #70c0e8`, `--infoColorHover #8acbec`, `--infoColorSuppl rgb(56, 137, 197)` |
| Status — Warning | `--warningColor #f2c97d`, `--warningColorSuppl rgb(240, 138, 0)` |
| Status — Error | `--errorColor #e88080`, `--errorColorSuppl rgb(208, 58, 82)` |
| Surface | `--bodyColor rgb(16, 16, 20)`, `--cardColor rgb(24, 24, 28)`, `--modalColor rgb(44, 44, 50)`, `--popoverColor rgb(72, 72, 78)` |
| Text / Icon | `--textColor1 rgba(255, 255, 255, 0.9)`, `--textColor2`, `--iconColor` |
| Border | `--borderColor rgba(255, 255, 255, 0.24)`, `--dividerColor rgba(255, 255, 255, 0.09)` |
| Table | `--tableHeaderColor`, `--tableColorHover rgba(255, 255, 255, 0.09)`, `--tableColorStriped` |
| Interaction | `--hoverColor`, `--pressedColor`, `--buttonColor2` |
| Type — body | Inter 12–16px, weights 400 / 600 |
| Type — heading | `--heading-3xs..3xl-font-size` scale, 600 weight |
| Radii | `2 / 3 / 4 / 6 / 8 px` (`--borderRadiusTiny..Huge`) |
| Spacers | `--spacer-0/4/8/12/16/24/32/40` plus `--heightTiny..Huge` (22/28/34/40/46) |

## Naming Convention

Tokens **preserve naïve-ui source naming verbatim** — there are no `--color-*` portable aliases. Components consume `var(--primaryColor)`, `var(--text-*)`, `var(--status-*-*)`, `var(--buttonColor2)` directly. Do not rename, scale-up, or invent values; if a missing variant is needed, run `refine-library` to extend the source first.

## Generation Notes

- HTML structures from naïve-ui's official demos were preserved unchanged; the only rewrite is the relative paths to `colors_and_type.css` / `components.css` / icon assets.
- Component slugs follow naïve-ui's own naming (e.g., `data-table` → `table`, `notification` stays as is).
- `components/atoms.json` bundles shared layout helpers, typography scale, and one-shot atoms — these are picked up into `components.css` like any other component.
- Foundational token-preview pages (`colors`, `typography`, `spacing`, `radius`) are intentionally **not** present — they are represented by `colors_and_type.css` + `css.json` only.
- UI Kit ships as an interactive React 18 single-file showcase (`<script type="text/babel">` + Babel Standalone CDN), capped at `max-width: 1184px`.

## Downstream Consumption Guide (重要)

本设计系统三层契约，下游消费时**按场景挑文件**，不要盲目复制 UIKit。

### 三层契约

| 层 | 文件 | 用途 | 是否可直接复制 |
|---|---|---|---|
| **Tokens** | `colors_and_type.css` + `css.json` | 颜色/字号/圆角/间距等设计语言 | ✅ 直接 link 或读 css.json |
| **Components** | `components.css` + `preview/component-*.html` | 单个组件的 markup + class | ✅ 复制 markup，引用 components.css |
| **UIKit Showcase** | `ui_kits/{type}/index.html` | 页面级**样品展示**（max-width 1184px） | ❌ **不要直接复制根容器** |

### UIKit 是 Showcase，不是 Page Template

UIKit 受 design-library-creator skill 硬约束：`max-width: 1184px` + 不允许 `transform: scale`。它是**给设计师看产品长什么样的样品**，不是给开发抄到 1920/2560 真实画布的母版。直接 copy 会导致两侧大片留白。

### 正确的下游消费流程

```
你要做：在自己画布上生成一个深色 dashboard 风格页面
  ↓
1. 读 ui_kits/dashboard/index.html → 看页面"结构骨架"
   （header w/ breadcrumb + sidebar (menu) + main stat-grid + recent table + quick-actions）
  ↓
2. 看每个 region 用了哪些 .ds-* 类
   （sidebar 用 .ds-menu--vertical · stat-card 用 .ds-card · table 用 .ds-table--striped · 进度用 .ds-progress）
  ↓
3. 进 preview/component-{slug}.html 拿干净的组件 markup
   （preview 不带 1184 容器，组件级是 fluid 的）
  ↓
4. 在你自己的画布上写外层 grid
   - 不要继承 UIKit 的 .uikit-shell (max-width: 1184)
   - 不要继承 UIKit 的根 grid-template-columns（那是为 1184 调的比例）
   - 只继承组件层级的 markup + class
   - 顶层用 100vw / 100% / auto-fit grid 自适应你的画布
```

### 快速参考表

| 你想做什么 | 应该读 |
|---|---|
| 用品牌色/字号/间距 token | `colors_and_type.css` 或 `css.json` |
| 写一个按钮 / 表单 / 表格 | `preview/component-{slug}.html` + `components.css` |
| 写一个完整的 dashboard / 表格页 | UIKit 看**结构思路** + preview 拿组件 markup + 自己写外层 grid |
| 看有哪些组件可用 | `components/index.json` |
| 加新组件 | `expand-components` workflow（用 `preview/component-{slug}.html` 格式） |

### UIKit 内层组件其实是流体的

注意：UIKit 的 1184 限制只在**最外层 `.uikit-shell` 容器**。内层所有 `.ds-*` 组件都是 fluid 的（`min-width: 0` + `1fr` + `minmax(0, 1fr)`）。所以正确做法是：把内层 region 整段 copy 出来，外层换成你自己的画布尺寸 grid。

## Icons

Bundled SVG icons live at `assets/icons/`. Optional runtime sprite renderer at `icons.js` (when present).

## Next Steps

- Refine or extend tokens → `refine-library` workflow (e.g., add a secondary success tint or `--primaryColorSurface`).
- Add new components → `expand-components` workflow (e.g., append `tree-select`, `cascader`, `data-table`).
- Spin up an additional kit (mobile / dev-explorer / marketing) → `generate-additional-kit` workflow.