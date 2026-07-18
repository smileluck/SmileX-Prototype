# 库配套文档模板

> 每次 Phase 4 完成时，按本模板为新库生成专属的 `<lib-root>/SKILL.md` 和 `<lib-root>/README.md`。
> trae-ui-example 是**范本**（Nimbus Core 那一份），不是新生成库的内容。新库的内容必须来自：
> - `source-brief.json`（Phase 1）
> - `colors_and_type.css` + `css.json`（Phase 2）
> - `components/index.json`（Phase 3）
> - 所有 `preview/component-{slug}.html`
> - 所有 `ui_kits/*/`

---

## SKILL.md 模板（简洁版"设计规范"）

```markdown
# <库名> Design System

> Dark-first product design system (core subset — <N> components covering both UI Kits). Tokens authored verbatim from the source `<source-location>`; component/UI-Kit references derived from `<source-evidence>`.

## Library Layout

> The library root directory shown below is named `<lib-name>/` for documentation. The **deployed location is consumer-defined** — it can be `node_modules/@<scope>/<lib>/`, `packages/design/<lib>/`, a CDN base URL, or anywhere else. All paths in this document are **relative to the library root**; treat the root prefix as `{<LIB>_ROOT}` and resolve it from your consumer project.

\`\`\`
{<LIB>_ROOT}/                 # <lib-name> library root (location is consumer-defined)
├── colors_and_type.css        # Authoritative token source (verbatim, dark-only)
├── css.json                   # Machine-readable token projection (auto-generated)
├── components.css             # Aggregated component class definitions — AUTO-GENERATED
├── icons.js                   # Inline icon sprite renderer
├── uikit-plan.json            # Component whitelist + slot assignments + screen blueprint
├── library-consumption.json   # Recommended downstream read order for agents
├── assets/
│   └── icons/                 # <N> bundled SVG icons
├── components/                # Component layer (<N> JSON contracts, one per slug)
│   ├── index.json
│   └── <slug>.json
├── preview/                   # <N> component preview pages (1 HTML per slug)
└── ui_kits/                   # Page-level showcases
    └── <type>/index.html
\`\`\`

> `components.css` is **regenerated** by `scripts/extract-components-css.mjs` ... 

## Brand Essentials

- **Surface**: dark canvas `--bodyColor #<hex>`, layered with `--bodyColor` / `--cardColor` ...
- **Primary text**: `--textColor1 #<hex>`; muted: `--textColor2` / `--textColor3` ...
- **Brand accent**: `--<brand-key>` #<hex> ...
- **Status palette**: primary / success / warning / error each provide `default | hover | active | surface-l1..l3` (or single-key variant)
- **Typography**: `<body-font>` body, `<mono-font>` for code; heading scale `<scale>`; body scale `<scale>` ...
- **Radii**: `<list>` **Spacers**: `<list>`

## Token Naming Convention

Tokens preserve their source naming verbatim. There are no portable aliases — components consume the source variables directly:

- `--bg-*` surface fills
- `--text-*` and `--icon-*` content tokens
- `--border-*` borders
- `--status-{type}-{state}` status colors
- `--<brand-key>` / `--accent-*` accents
- Typography: `--<body|heading>-<size>-<font-prop>`
- Code: `--code-*` syntax hues

> Components reference tokens directly via `var(--token-name)`. Do **not** rename tokens; do **not** introduce new color scales.

## Components (<N>)

| Slug | Type | Notes |
|------|------|-------|
| <slug> | <type> | <notes> |
| ... | ... | ... |

## UI Kits (<N>)

| Type | Composition |
|------|-------------|
| <type> | <composition> |

## Icons

Bundled SVG icons live at `assets/icons/` (<N> files). Optional runtime sprite renderer at `icons.js`.

## Authoring Rules

1. **Never hardcode hex/rem values.** Always reference `var(--token)`.
2. **Status color is local.** Tag/cell-level colorization only.
3. **Surface lifts.** Use `--<surface-2>` (regular) and `--<surface-3>` (raised).
4. **Borders stay neutral.** `<rules>`
5. **Icons are <stroke-width>px stroke** rendered through `icons.js`; size via `data-size`.

## Out of Scope (Not Generated)

- <what-is-deliberately-out-of-scope>

## Conversation Continuity

- Add components: `expand-components`
- Refine tokens or rename groups: `refine-library`
- Generate an additional kit: `generate-additional-kit`
```

**字段填充规则**：
- `<库名>` → 取自 `--name` 参数或源库名（如 `naive-core`）
- `<N>` → 从 `components/index.json` 数组 length / `ui_kits` 数组 length
- `<source-location>` → `source-brief.json` 中的 `sourceLocator`（如 `naive-ui`）
- `<source-evidence>` → 同上

---

## README.md 模板（人类友好版"指南"）

```markdown
# <库名>

<one-sentence description that calls out source library + theme + coverage>

## Open the Showcases

All HTML files reference `colors_and_type.css` via relative paths and run as static pages.

| Showcase | Path |
|----------|------|
| Component — <name> | `preview/component-<slug>.html` |
| ... | ... |
| UI Kit — <name> | `ui_kits/<type>/index.html` |
| ... | ... |

## What's Inside

- `colors_and_type.css` — authoritative token source ...
- `css.json` — machine-readable token projection ...
- `components/` — <N> component slugs ...
- `preview/` — <N> component preview pages ...
- `ui_kits/` — <N> page-level showcases ...
- `components.css` — aggregated ...
- `<other-meta-files>` ...
- `assets/icons/` — <N> bundled SVG icons.
- `icons.js` — optional inline icon-sprite renderer.

## Token Highlights

| Group | Examples |
|-------|----------|
| Surface | `--bodyColor` ... |
| Brand | `--<key>` ... |
| Status | `--status-*` ... |
| Text / Icon | `--text-default`, `--text-secondary`, `--icon-tertiary` |
| Border | `--border-*` ... |
| Type — body | `--body-*-*` ... |
| Type — heading | `--heading-*` ... |
| Code | `--code-*` ... |
| Radii | `--<radius-key>` ... |
| Spacers | `--spacer-*` ... |

## Naming Convention

Tokens **preserve the source naming verbatim** — there are no `--color-*` portable aliases. Components consume `var(--bg-*)`, `var(--text-*)`, `var(--status-*-*)` directly. Do not rename, scale-up, or invent values; if a missing variant is needed, run `refine-library` to extend the source first.

## Generation Notes

- HTML structures from the original `<source>` were preserved unchanged ...
- One <differentiation note>...
- One <ui-kit note> ...
- UI Kits ship as interactive <tech-stack> showcases ...

## Downstream Consumption Guide (重要)

本设计系统三层契约，下游消费时**按场景挑文件**，不要盲目复制 UIKit。

### 三层契约

| 层 | 文件 | 用途 | 是否可直接复制 |
|---|---|---|---|
| **Tokens** | `colors_and_type.css` + `css.json` | 颜色/字号/圆角/间距等设计语言 | ✅ 直接 link 或读 css.json |
| **Components** | `components.css` + `preview/component-*.html` | 单个组件的 markup + class | ✅ 复制 markup，引用 components.css |
| **UIKit Showcase** | `ui_kits/{type}/index.html` | 页面级**样品展示**（max-width 1184px） | ❌ **不要直接复制根容器** |

### UIKit 是 Showcase，不是 Page Template

UIKit 受 design-library-creator skill 硬约束：`max-width: 1184px` + 不允许 `transform: scale`。

### 正确的下游消费流程

\`\`\`
你要做：在自己画布上生成一个 <use-case> 页面
  ↓
1. 读 ui_kits/<type>/index.html → 看页面"结构骨架"
2. 看每个 region 用了哪些 .ds-* 类
3. 进 preview/component-{slug}.html 拿干净的组件 markup
4. 在你自己的画布上写外层 grid
   - 不要继承 UIKit 的 .uikit-shell (max-width: 1184)
   - 不要继承 UIKit 的根 grid-template-columns（那是为 1184 调的比例）
   - 只继承组件层级的 markup + class
   - 顶层用 100vw / 100% / auto-fit grid 自适应你的画布
\`\`\`

### 快速参考表

| 你想做什么 | 应该读 |
|---|---|
| 用品牌色/字号/间距 token | `colors_and_type.css` 或 `css.json` |
| 写一个按钮 / 表单 / 表格 | `preview/component-{slug}.html` + `components.css` |
| 写一个完整的页面（自定义画布） | UIKit 看**结构思路** + preview 拿组件 markup + 自己写外层 grid |
| 看有哪些组件可用 | `components/index.json` |

### UIKit 内层组件其实是流体的

注意：UIKit 的 1184 限制只在**最外层 `.uikit-shell` 容器**。内层所有 `.ds-*` 组件都是 fluid 的（`min-width: 0` + `1fr` + `minmax(0, 1fr)`）。所以正确做法是：把内层 region 整段 copy 出来，外层换成你自己的画布尺寸 grid。

## Icons

Bundled SVG icons live at `assets/icons/` (<N> files). Optional runtime sprite renderer at `icons.js`.

## Next Steps

- Refine or extend tokens → `refine-library` workflow.
- Add new components → `expand-components` workflow.
- Spin up an additional kit type → `generate-additional-kit` workflow.
```

---

## 关键反模式（必须避免）

❌ **直接复制 `trae-ui-example/SKILL.md` 或 `README.md` 的内容**到新生成的库。

❌ **让新库的 SKILL.md 描述"nimbus-core"或"trae-ui-example"**。它必须描述**当前生成的设计库**（如 naive-core / element-core / ide-minimal）。

❌ **省略 Downstream Consumption Guide** —— 这是 trae-ui-example 范本的核心价值，教导下游消费者按层使用而不是直接复制 UIKit。

❌ **省略"Next Steps"子命令** —— 引导消费者用技能自身的子命令扩展。

---

## 字段提取辅助（Phase 4 执行时）

```javascript
// 从 source-brief.json 提取
const source = brief.sourceLocator;             // e.g., "naive-ui"

// 从 components/index.json 提取
const components = brief.components || index.components;
const uiKits = index.uiKits || [];

// 从 colors_and_type.css 提取
//   头注释解析 brand-green / status / brand-blue / brand-yellow
//   通过 grep 提取所有 --<token>: 统计数量 / 抓取 sample

// 从每个 components/{slug}.json 提取
//   notes 字段 → 写入 SKILL.md Components 表的 "Notes" 列
```