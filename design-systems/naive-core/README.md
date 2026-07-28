# Naive Core

A dark-first design system distilled from naïve-ui's official dark theme — **full coverage: 95 naive-ui components + atoms (96 total)** plus **4 UI Kits** (dashboard / dev-explorer / mobile / marketing). The canonical token source is `colors_and_type.css` (+ `css.json`).

## Open the Showcases

All HTML files reference `colors_and_type.css` via relative paths and run as static pages.

| Showcase | Path |
|----------|------|
| Component — Affix | `preview/component-affix.html` |
| Component — Alert | `preview/component-alert.html` |
| Component — Anchor | `preview/component-anchor.html` |
| Component — Shared Atoms | `preview/component-atoms.html` |
| Component — Auto Complete | `preview/component-auto-complete.html` |
| Component — Avatar Group | `preview/component-avatar-group.html` |
| Component — Avatar | `preview/component-avatar.html` |
| Component — Back Top | `preview/component-back-top.html` |
| Component — Badge | `preview/component-badge.html` |
| Component — Breadcrumb | `preview/component-breadcrumb.html` |
| Component — Button Group | `preview/component-button-group.html` |
| Component — Button | `preview/component-button.html` |
| Component — Calendar | `preview/component-calendar.html` |
| Component — Card | `preview/component-card.html` |
| Component — Carousel | `preview/component-carousel.html` |
| Component — Cascader | `preview/component-cascader.html` |
| Component — Checkbox | `preview/component-checkbox.html` |
| Component — Code | `preview/component-code.html` |
| Component — Collapse | `preview/component-collapse.html` |
| Component — Color Picker | `preview/component-color-picker.html` |
| Component — Countdown | `preview/component-countdown.html` |
| Component — Data Table | `preview/component-data-table.html` |
| Component — Date Picker | `preview/component-date-picker.html` |
| Component — Descriptions | `preview/component-descriptions.html` |
| Component — Dialog | `preview/component-dialog.html` |
| Component — Divider | `preview/component-divider.html` |
| Component — Drawer | `preview/component-drawer.html` |
| Component — Dropdown | `preview/component-dropdown.html` |
| Component — Dynamic Input | `preview/component-dynamic-input.html` |
| Component — Dynamic Tags | `preview/component-dynamic-tags.html` |
| Component — Ellipsis | `preview/component-ellipsis.html` |
| Component — Empty | `preview/component-empty.html` |
| Component — Equation | `preview/component-equation.html` |
| Component — Flex | `preview/component-flex.html` |
| Component — Float Button Group | `preview/component-float-button-group.html` |
| Component — Float Button | `preview/component-float-button.html` |
| Component — Form | `preview/component-form.html` |
| Component — Gradient Text | `preview/component-gradient-text.html` |
| Component — Grid | `preview/component-grid.html` |
| Component — Heatmap | `preview/component-heatmap.html` |
| Component — Highlight | `preview/component-highlight.html` |
| Component — Icon Wrapper | `preview/component-icon-wrapper.html` |
| Component — Icon | `preview/component-icon.html` |
| Component — Image | `preview/component-image.html` |
| Component — Infinite Scroll | `preview/component-infinite-scroll.html` |
| Component — Input Number | `preview/component-input-number.html` |
| Component — Input OTP | `preview/component-input-otp.html` |
| Component — Input | `preview/component-input.html` |
| Component — Layout | `preview/component-layout.html` |
| Component — Legacy Grid | `preview/component-legacy-grid.html` |
| Component — Legacy Transfer | `preview/component-legacy-transfer.html` |
| Component — List | `preview/component-list.html` |
| Component — Loading Bar | `preview/component-loading-bar.html` |
| Component — Log | `preview/component-log.html` |
| Component — Marquee | `preview/component-marquee.html` |
| Component — Mention | `preview/component-mention.html` |
| Component — Menu | `preview/component-menu.html` |
| Component — Message | `preview/component-message.html` |
| Component — Modal | `preview/component-modal.html` |
| Component — Notification | `preview/component-notification.html` |
| Component — Number Animation | `preview/component-number-animation.html` |
| Component — Page Header | `preview/component-page-header.html` |
| Component — Pagination | `preview/component-pagination.html` |
| Component — Popconfirm | `preview/component-popconfirm.html` |
| Component — Popover | `preview/component-popover.html` |
| Component — Popselect | `preview/component-popselect.html` |
| Component — Progress | `preview/component-progress.html` |
| Component — QR Code | `preview/component-qr-code.html` |
| Component — Radio | `preview/component-radio.html` |
| Component — Rate | `preview/component-rate.html` |
| Component — Result | `preview/component-result.html` |
| Component — Scrollbar | `preview/component-scrollbar.html` |
| Component — Select | `preview/component-select.html` |
| Component — Skeleton | `preview/component-skeleton.html` |
| Component — Slider | `preview/component-slider.html` |
| Component — Space | `preview/component-space.html` |
| Component — Spin | `preview/component-spin.html` |
| Component — Split | `preview/component-split.html` |
| Component — Statistic | `preview/component-statistic.html` |
| Component — Steps | `preview/component-steps.html` |
| Component — Switch | `preview/component-switch.html` |
| Component — Table | `preview/component-table.html` |
| Component — Tabs | `preview/component-tabs.html` |
| Component — Tag | `preview/component-tag.html` |
| Component — Thing | `preview/component-thing.html` |
| Component — Time Picker | `preview/component-time-picker.html` |
| Component — Time | `preview/component-time.html` |
| Component — Timeline | `preview/component-timeline.html` |
| Component — Tooltip | `preview/component-tooltip.html` |
| Component — Transfer | `preview/component-transfer.html` |
| Component — Tree Select | `preview/component-tree-select.html` |
| Component — Tree | `preview/component-tree.html` |
| Component — Typography | `preview/component-typography.html` |
| Component — Upload | `preview/component-upload.html` |
| Component — Virtual List | `preview/component-virtual-list.html` |
| Component — Watermark | `preview/component-watermark.html` |
| UI Kit — dashboard | `ui_kits/dashboard/index.html` |
| UI Kit — dev-explorer | `ui_kits/dev-explorer/index.html` |
| UI Kit — mobile | `ui_kits/mobile/index.html` |
| UI Kit — marketing | `ui_kits/marketing/index.html` |

## What's Inside

- `colors_and_type.css` — authoritative token source (verbatim, `/* @dark-only */`, `/* @group-priority: brand-green, status, brand-blue, brand-yellow, brand-red */`).
- `css.json` — machine-readable token projection (`color` / `font` / `radius` / `spacing` + reserved empty `shadow` / `size`).
- `components/` — 96 component slugs (`{slug}.json` + `index.json`), each with `category`, `tokensConsumed`, `domAnatomy`, `provenance`.
- `preview/` — 96 preview pages. Each (a) keeps preview chrome above `@component-css-start`, (b) embeds canonical `.ds-*` CSS between the markers, (c) links JetBrains Mono via Google Fonts.
- `ui_kits/` — 4 showcases (dashboard / dev-explorer / mobile / marketing), each with `quality-report.json`.
- `components.css` — **auto-generated** aggregation of all 96 marker blocks. Do not edit by hand.
- `uikit-plan.json` — component whitelist (2 core + 94 support) and slot assignments.
- `library-consumption.json` — recommended downstream read order.

## Token Highlights

| Group | Examples |
|-------|----------|
| Brand | `--primaryColor #63e2b7`, `--primaryColorHover #7fe7c4` |
| Status | `--infoColor #70c0e8`, `--warningColor #f2c97d`, `--errorColor #e88080` |
| Surface | `--bodyColor rgb(16,16,20)`, `--cardColor rgb(24,24,28)`, `--popoverColor rgb(72,72,78)` |
| Text / Icon | `--textColor1 rgba(255,255,255,0.9)`, `--textColor2`, `--iconColor` |
| Border | `--borderColor rgba(255,255,255,0.24)`, `--dividerColor rgba(255,255,255,0.09)` |
| Table | `--tableHeaderColor`, `--tableColorHover`, `--tableColorStriped` |
| Interaction | `--hoverColor`, `--pressedColor`, `--buttonColor2` |
| Radii | `2 / 3 / 4 / 6 / 8 px` |
| Spacers & Heights | `--spacer-0..40`, `--heightTiny..Huge` (22/28/34/40/46) |

## Naming Convention

Tokens **preserve naïve-ui source naming verbatim** — no `--color-*` portable aliases. Components consume `var(--primaryColor)`, `var(--textColor*)`, `var(--buttonColor2)` directly. Do not rename, scale, or invent values; run `refine-library` to extend the source first.

## Generation Notes

- Coverage: **full** — all 95 real naive-ui components (GitHub tree scan of `tusen-ai/naive-ui/src/`, excluding `_internal` / composables / config / legacy / theme dirs) + 1 shared `atoms` component.
- 8 render templates applied: button / form / data / feedback / navigation / general / layout / special — see the skill's `references/component-render-templates.md`.
- UI Kits ship as interactive React 18 single-file showcases (Babel Standalone CDN), capped at `max-width: 1184px`.

## Downstream Consumption Guide (重要)

本设计系统三层契约，下游消费时**按场景挑文件**，不要盲目复制 UIKit。

### 三层契约

| 层 | 文件 | 用途 | 可直接复制 |
|---|---|---|---|
| **Tokens** | `colors_and_type.css` + `css.json` | 设计语言 | ✅ link 或读 css.json |
| **Components** | `components.css` + `preview/component-*.html` | 单组件 markup + class | ✅ 复制 markup，引用 components.css |
| **UIKit Showcase** | `ui_kits/{type}/index.html` | 页面级样品（max-width 1184px） | ❌ 不要复制根容器 |

### UIKit 是 Showcase，不是 Page Template

UIKit 受硬约束 `max-width: 1184px` + 禁止 `transform: scale`。直接抄到 1920/2560 画布会两侧留白。

### 正确的下游消费流程

```
1. 读 ui_kits/<type>/index.html → 看页面结构骨架
2. 看每个 region 用了哪些 .ds-* 类
3. 进 preview/component-{slug}.html 拿干净的组件 markup
4. 在自己画布写外层 grid（100vw / auto-fit），不继承 .uikit-shell
```

### 快速参考表

| 你想做什么 | 应该读 |
|---|---|
| 用品牌色/字号/间距 token | `colors_and_type.css` 或 `css.json` |
| 写一个按钮 / 表单 / 表格 | `preview/component-{slug}.html` + `components.css` |
| 写完整页面（自定义画布） | UIKit 看结构思路 + preview 拿 markup + 自己写外层 grid |
| 看有哪些组件可用 | `components/index.json`（96 个） |
| 加新组件 | `expand-components` workflow |

## Next Steps

- Refine or extend tokens → `refine-library` workflow.
- Add new components → `expand-components` workflow.
- Spin up an additional kit → `generate-additional-kit` workflow.
