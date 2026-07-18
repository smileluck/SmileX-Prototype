# 三层契约详细规范

> 本文档详细说明生成的设计库每个文件的字段、必填性、约束。
> 参考样例：`references/trae-ui-example/`

## 目录结构

```
<lib-root>/
├── colors_and_type.css         # 必填：token 权威源
├── css.json                    # 必填：token 机器可读投影
├── components.css              # 必填：聚合组件 CSS（脚本生成）
├── icons.js                    # 可选：图标 sprite 渲染器
├── uikit-plan.json             # 必填：组件白名单 + kit 计划
├── library-consumption.json    # 必填：下游消费顺序
├── assets/
│   └── icons/                  # 必填：SVG 图标（默认 115 个）
├── components/
│   ├── index.json              # 必填：组件清单 + ui-kit 索引
│   ├── {slug}.json             # 必填：每个组件 1 个 JSON 契约
│   └── atoms.json              # 推荐：共享 atoms（layout 助手）
├── preview/
│   └── component-{slug}.html   # 必填：每个组件 1 个预览页（含 atoms）
└── ui_kits/
    └── {type}/
        ├── index.html          # 必填：单文件 React 18 showcase
        └── quality-report.json # 必填：质量报告
```

---

## 第 1 层：Tokens（`colors_and_type.css` + `css.json`）

### `colors_and_type.css`

**头部注释（必须）**：
```css
/* @dark-only */
/* @group-priority: brand-green, status, brand-blue, brand-purple, brand-yellow */
:root {
  /* === Brand Green === */
  --bg-brand: #32f08c;
  ...

  /* === Status === */
  --status-primary-default: #...;
  ...

  /* === Brand Blue === */
  ...

  /* === Typography === */
  --body-base-font-family: 'SF Pro Text', ...;
  --body-base-font-size: 14px;
  ...

  /* === Radius === */
  --radius-2: 2px;
  --radius-4: 4px;
  ...

  /* === Spacing === */
  --spacer-0: 0;
  --spacer-4: 4px;
  ...
}
```

**命名规范**：
- ✅ 来源 token 名 verbatim（不重命名）
- ❌ 不引入 `--color-*` 等便携别名
- ❌ 不新增色彩刻度

### `css.json`

**结构**：
```json
{
  "color": {
    "bg-brand": { "bg-brand": { "hex": "#32f08c", "opacity": "1" } },
    "bg": { "bg-base-default": { "hex": "#1a1b1d", "opacity": "1" }, ... },
    "icon": { ... },
    "text": { ... },
    "border": { ... },
    "status": { ... }
  },
  "font": {
    "body-base-font-family": { "value": "'SF Pro Text', sans-serif" },
    ...
  },
  "radius": {
    "radius-2": { "value": "2px" },
    ...
  },
  "spacing": {
    "spacer-0": { "value": "0" },
    ...
  },
  "shadow": {},   // 保留空桶
  "size": {}      // 保留空桶
}
```

**必填字段**：`color`、`font`、`radius`、`spacing`
**保留空桶**：`shadow`、`size`（即使无值也要存在）

---

## 第 2 层：Components（`components/{slug}.json` + `preview/component-{slug}.html`）

### `components/{slug}.json`（schemaVersion: 2）

**必填字段**：
- `schemaVersion`: 固定 `2`
- `slug`: 字符串，与文件名一致
- `name`: 中文 / 英文显示名（如 `"Button"`）
- `category`: 分类，常见值：
  - `general` / `navigation` / `data` / `form` / `feedback` / `layout` / `ide` / `ai`
- `tokensConsumed`: 数组，列出所有用到的 token（必须存在于 css.json）
- `domAnatomy.root`: 至少 `{ "tag": "...", "class": "..." }`
- `provenance.preview`: 字符串，预览文件相对路径
- `provenance.source`: 字符串，组件来源（哪个文件 / 哪个库）

**推荐字段**：
- `sourceKind`: `"structured-spec"` / `"html-screenshot"` / `"library-port"`
- `confidence`: `"high"` / `"medium"` / `"low"`
- `semanticTypeCandidates`: 数组
- `variantDimensions`: 对象（如 `{ "intent": [...], "size": [...] }`）
- `representativeVariants`: 数组
- `anatomy`: 数组（leading-icon / label / trailing-icon 等）
- `structurePatterns`: 数组（如 "matrix of intent x size x state"）
- `usageHints`: 数组
- `doNotInvent`: 数组（明确禁止发明的变体）
- `unknowns`: 数组

**完整示例**：参考 `references/trae-ui-example/components/buttons.json`

### `preview/component-{slug}.html`

**必须结构**：
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Button</title>
  <link rel="stylesheet" href="../colors_and_type.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" />
  <link rel="stylesheet" href="../components.css" />
  <style>
    /* ── preview-page chrome (reset + body + .pv-*, preview-only) ───────── */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: var(--bg-base-default); ... }
    body { padding: var(--spacer-32); }
    .pv-header { ... }
    /* ... 其他 preview-only CSS ... */

    /* @component-css-start */
    /* ===== Buttons =====
     * 组件 CSS 注释...
     */
    .ds-btn { ... }
    .ds-btn--brand { ... }
    /* ... */
    /* @component-css-end */
  </style>
</head>
<body>
  <!-- 实际预览内容 -->
</body>
</html>
```

**硬约束**：
- ✅ `<head>` 必须包含 `colors_and_type.css` link
- ✅ JetBrains Mono 通过 Google Fonts `<link>`（不下载本地）
- ✅ preview chrome 在 `@component-css-start` **之上**
- ✅ `.ds-*` 组件 CSS 在两个标记**之间**
- ❌ 不允许外部 API 调用（fetch / XHR）
- ❌ 不允许第三方 JS 库（仅 Babel Standalone 例外）

### `components/index.json`

```json
{
  "schemaVersion": 2,
  "library": "<lib-name>",
  "components": [
    { "slug": "buttons", "name": "Button", "preview": "preview/component-buttons.html" },
    ...
  ],
  "uiKits": [
    { "type": "dashboard", "entry": "ui_kits/dashboard/index.html" },
    ...
  ]
}
```

---

## 第 3 层：UI Kits（`ui_kits/{type}/index.html` + `quality-report.json`）

### `ui_kits/{type}/index.html`

**结构**：单文件 React 18 showcase，使用 Babel Standalone CDN

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Dashboard</title>
  <link rel="stylesheet" href="../../colors_and_type.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" />
  <link rel="stylesheet" href="../../components.css" />
  <style>
    .uikit-shell { max-width: 1184px; margin: 0 auto; padding: var(--spacer-32); }
    /* ... */
  </style>
</head>
<body>
  <div id="root"></div>
  <script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script type="text/babel" data-presets="env,react">
    // React 组件代码（仅使用 useState，无后端）
  </script>
</body>
</html>
```

**硬约束**：
- ✅ `.uikit-shell` 必须 `max-width: 1184px`（**这是硬约束**）
- ✅ 引用 `../../colors_and_type.css` + `../../components.css`
- ✅ 仅 React 18 + Babel Standalone（无其他 CDN 库）
- ❌ 不允许 `transform: scale`
- ❌ 不允许 `inventedComponents`（只能用现有 `.ds-*`）

### `ui_kits/{type}/quality-report.json`

```json
{
  "kitType": "dashboard",
  "screensGenerated": 2,
  "coreComponentsUsed": ["buttons", "nav-list", "page-header", "stat-card", "tag", "table", "pagination", "forms"],
  "supportComponentsUsed": [...],
  "previewClassReuseRate": 0.82,
  "inventedComponents": [],
  "interactiveStatesRendered": ["hover", "disabled", "selected", "active"],
  "primaryActionPerScreen": true,
  "mockDataDensity": { "tableRows": 8, "chartPoints": 12 },
  "warnings": []
}
```

---

## 聚合层：`components.css`

- **禁止手改**，必须由 `scripts/extract-components-css.mjs` 生成
- 顶部必须包含 `/* AUTO-GENERATED ... do not edit by hand */` 注释
- 按 preview 文件名排序（保证输出稳定）
- 跳过无 `@component-css-start/end` 标记的文件（warn）

---

## Meta 层

### `uikit-plan.json`

```json
{
  "schemaVersion": 1,
  "headBoilerplate": "<link rel=\"stylesheet\" href=\"../../colors_and_type.css\">",
  "corePreviewComponents": [
    { "slug": "buttons", "reason": "fixed slot \"button\"", "evidenceFile": "components/buttons.json", "priority": 1, "slot": "button" },
    { "slug": "nav-list", "reason": "fixed slot \"navigation\"", "evidenceFile": "components/nav-list.json", "priority": 2, "slot": "navigation" }
  ],
  "supportEvidenceComponents": [...],
  "allowedComponents": ["buttons", "nav-list", ...]
}
```

### `library-consumption.json`

```json
{
  "schemaVersion": 1,
  "recommendedReadOrder": [
    "colors_and_type.css",
    "css.json",
    "components/index.json",
    "components/{slug}.json",
    "preview/component-{slug}.html",
    "components.css",
    "ui_kits/{type}/index.html"
  ],
  "downstreamNotes": "..."
}
```