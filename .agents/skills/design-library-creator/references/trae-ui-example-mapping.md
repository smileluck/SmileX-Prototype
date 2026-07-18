# trae-ui-example 字段映射

> 本文档是设计库生成的"字段字典"——每个 JSON 文件每个字段的类型、必填性、示例值。
> 所有约束来自 `trae-ui-example/` 实际产物。

---

## `colors_and_type.css`

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `/* @dark-only */` | 注释 | ✅ | 头部第一行（除非 light 主题） |
| `/* @group-priority: ... */` | 注释 | ✅ | 分组优先级，逗号分隔 |
| `:root { ... }` | CSS 块 | ✅ | 包裹所有 token |
| `--bg-*` | CSS vars | ✅ | 背景色（base / overlay / brand / menu / tooltip / invert） |
| `--text-*` | CSS vars | ✅ | 文字色（default / secondary / tertiary / disabled / onbrand 等） |
| `--icon-*` | CSS vars | ✅ | 图标色（与 text 对齐） |
| `--border-*` | CSS vars | ✅ | 边框（neutral-l1..l3 / brand / contrast / status） |
| `--status-{type}-{state}` | CSS vars | ✅ | 状态色（primary / success / alert / warning / error × default/hover/active/surface-l1..l3） |
| `--accent-*` | CSS vars | 推荐 | 强调色 |
| `--brand-{color}-100..1000` | CSS vars | 推荐 | 品牌色刻度 |
| `--body-{xs\|sm\|md\|base}-{font-family\|font-size\|font-weight\|line-height}` | CSS vars | ✅ | 正文字体 |
| `--body-{size}-strong-*` | CSS vars | 推荐 | 加粗字重对 |
| `--heading-{3xs..3xl}-{font-size\|font-weight\|line-height}` | CSS vars | ✅ | 标题字号 |
| `--code-editor-*` | CSS vars | 推荐 | 代码编辑字体 |
| `--code-terminal-*` | CSS vars | 推荐 | 终端字体 |
| `--radius-{2\|4\|6\|8\|10\|full}` | CSS vars | ✅ | 圆角刻度 |
| `--spacer-{0\|4\|6\|8\|12\|16\|24\|32\|40}` | CSS vars | ✅ | 间距刻度 |

---

## `css.json`

### 顶层字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `color` | object | ✅ | 颜色 token 分组（bg / text / icon / border / status / brand / accent / viz） |
| `font` | object | ✅ | 字体 token 分组（body / heading / code） |
| `radius` | object | ✅ | 圆角 token |
| `spacing` | object | ✅ | 间距 token |
| `shadow` | object | ✅（可空） | 阴影 token（保留空桶） |
| `size` | object | ✅（可空） | 尺寸 token（保留空桶） |

### `color` 子字段

每个 token 格式：
```json
{
  "bg-brand": {
    "hex": "#32f08c",
    "opacity": "1"
  }
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `hex` | string | HEX 颜色（如 `#32f08c`） |
| `opacity` | string | 不透明度（如 `"1"`、`"0.12"`） |

### `font` / `radius` / `spacing` 子字段

每个 token 格式：
```json
{
  "body-base-font-family": { "value": "'SF Pro Text', sans-serif" },
  "radius-4": { "value": "4px" },
  "spacer-16": { "value": "16px" }
}
```

| 字段 | 类型 | 说明 |
|---|---|---|
| `value` | string | 字面值 |

---

## `components/{slug}.json`（schemaVersion: 2）

### 必填字段

| 字段 | 类型 | 说明 |
|---|---|---|
| `schemaVersion` | number | 固定 `2` |
| `slug` | string | 英文短横线 slug（如 `"buttons"`、`"file-tree"`） |
| `name` | string | 显示名（如 `"Button"`、`"File Tree"`） |
| `category` | string | 分类：`general` / `navigation` / `data` / `form` / `feedback` / `layout` / `ide` / `ai` |
| `sourceKind` | string | 来源类型：`structured-spec` / `html-screenshot` / `library-port` |
| `confidence` | string | 置信度：`high` / `medium` / `low` |
| `semanticTypeCandidates` | string[] | 候选语义类型 |
| `variantDimensions` | object | 变体维度（如 `{ "intent": [...], "size": [...] }`） |
| `representativeVariants` | array | 代表性变体（用于 preview 默认展示哪些） |
| `anatomy` | string[] | 组件解剖（如 `["leading-icon", "label", "trailing-icon"]`） |
| `structurePatterns` | string[] | 结构模式描述 |
| `usageHints` | string[] | 使用提示（含 token 引用） |
| `doNotInvent` | string[] | 明确禁止发明的变体 |
| `unknowns` | string[] | 不确定的点 |
| `tokensConsumed` | string[] | **必填**——用到的所有 token 名（必须存在于 css.json） |
| `domAnatomy` | object | **必填**——DOM 结构描述 |
| `provenance` | object | **必填**——来源溯源 |

### `domAnatomy` 子字段

```json
{
  "root": {
    "tag": "div",
    "class": "stack-12",
    "children": [
      { "tag": "div", "class": "row", "children": [...] },
      ...
    ]
  }
}
```

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `root.tag` | string | ✅ | HTML 标签名 |
| `root.class` | string | ✅ | 主类名 |
| `root.children` | array | 推荐 | 子节点列表（递归结构） |
| 子节点的 `text` | string | 可选 | 文本内容 |

### `provenance` 子字段

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `preview` | string | ✅ | 预览文件相对路径（如 `"preview/component-buttons.html"`） |
| `source` | string | ✅ | 原始来源（URL / 文件路径 / 库名） |
| `css.file` | string | 推荐 | 聚合 CSS 文件名（如 `"components.css"`） |
| `css.marker` | string | 推荐 | 区块标记（如 `"── Buttons ──"`） |

---

## `components/index.json`

```json
{
  "schemaVersion": 2,
  "library": "<lib-name>",
  "components": [
    {
      "slug": "buttons",
      "name": "Button",
      "preview": "preview/component-buttons.html"
    },
    ...
  ],
  "uiKits": [
    {
      "type": "dashboard",
      "entry": "ui_kits/dashboard/index.html"
    },
    ...
  ]
}
```

| 字段 | 类型 | 必填 |
|---|---|---|
| `schemaVersion` | number | ✅（固定 `2`） |
| `library` | string | ✅ |
| `components` | array | ✅ |
| `components[].slug` | string | ✅ |
| `components[].name` | string | ✅ |
| `components[].preview` | string | ✅ |
| `uiKits` | array | ✅（可空） |
| `uiKits[].type` | string | ✅ |
| `uiKits[].entry` | string | ✅ |

---

## `uikit-plan.json`

```json
{
  "schemaVersion": 1,
  "headBoilerplate": "<link rel=\"stylesheet\" href=\"../../colors_and_type.css\">",
  "corePreviewComponents": [
    {
      "slug": "buttons",
      "reason": "fixed slot \"button\"; semantic=button:0.75; policy=fixed-slots-first",
      "evidenceFile": "components/buttons.json",
      "priority": 1,
      "slot": "button"
    },
    ...
  ],
  "supportEvidenceComponents": [
    { "slug": "menu", "reason": "...", "evidenceFile": "...", "priority": 3 }
  ],
  "allowedComponents": ["buttons", "nav-list", ...]
}
```

| 字段 | 类型 | 必填 |
|---|---|---|
| `schemaVersion` | number | ✅（固定 `1`） |
| `headBoilerplate` | string | ✅（默认 link 标签） |
| `corePreviewComponents` | array | ✅ |
| `corePreviewComponents[].slug` | string | ✅ |
| `corePreviewComponents[].reason` | string | ✅ |
| `corePreviewComponents[].evidenceFile` | string | ✅ |
| `corePreviewComponents[].priority` | number | ✅ |
| `corePreviewComponents[].slot` | string | 推荐 |
| `supportEvidenceComponents` | array | ✅ |
| `allowedComponents` | array | ✅ |

---

## `library-consumption.json`

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

| 字段 | 类型 | 必填 |
|---|---|---|
| `schemaVersion` | number | ✅ |
| `recommendedReadOrder` | string[] | ✅ |
| `downstreamNotes` | string | 推荐 |

---

## `ui_kits/{type}/index.html`

### 容器

```css
.uikit-shell {
  max-width: 1184px;   /* ⚠️ 硬约束 */
  margin: 0 auto;
  padding: var(--spacer-32);
}
```

### 引用

```html
<link rel="stylesheet" href="../../colors_and_type.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" />
<link rel="stylesheet" href="../../components.css" />
```

### React 加载

```html
<script crossorigin src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
<script type="text/babel" data-presets="env,react">
  // React 代码
</script>
```

---

## `ui_kits/{type}/quality-report.json`

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `kitType` | string | ✅ | kit 类型（dashboard / dev-explorer / mobile / ...） |
| `screensGenerated` | number | ✅ | 屏幕数量 |
| `coreComponentsUsed` | string[] | ✅ | 核心组件 slug |
| `supportComponentsUsed` | string[] | ✅ | 支持组件 slug |
| `previewClassReuseRate` | number | ✅ | 0-1 之间，复用 preview class 的比例 |
| `inventedComponents` | string[] | ✅（**必须 `[]`**） | 不允许发明新组件 |
| `interactiveStatesRendered` | string[] | ✅ | 渲染的交互状态（hover / disabled / selected / active） |
| `primaryActionPerScreen` | boolean | ✅ | 每屏 1 个主操作 |
| `mockDataDensity.tableRows` | number | ✅ | 表格行数 |
| `mockDataDensity.chartPoints` | number | ✅ | 图表点数 |
| `warnings` | string[] | ✅（可空） | 警告 |

---

## `components.css`

| 字段 | 类型 | 必填 | 说明 |
|---|---|---|---|
| `/* AUTO-GENERATED ... */` | 注释 | ✅ | 顶部警告 |
| `/* ===== Buttons ===== */` | 注释 | 推荐 | 每个组件区块标题 |
| `.ds-*` | CSS | ✅ | 组件类（来自 preview HTML 标记区间） |

**禁止**：
- ❌ 手改 components.css
- ❌ preview chrome 出现在 components.css（应在 `@component-css-start` 之外）