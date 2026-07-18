---
name: design-library-creator
description: "从任意 UI 来源（本地源码 / 任意网站 / 图片 / 主流组件库）扫描全部组件并生成符合 Trae Design 契约的设计系统包。技能主动遍历来源所有组件（不依赖用户列清单），按 8 类差异化模板渲染预览。当用户提出'从 X 风格生成一套设计系统'、'把某个组件库转成我们的设计 token'、'新建一套 design system'、'/design-library-creator' 时自动生效。"
---

# /design-library-creator

> 从任意 UI 来源扫描全部组件，生成符合 Trae Design 契约的设计系统包（tokens + components + ui_kits）。

**核心能力**：技能不是"用户给啥我生成啥"，而是**主动遍历来源所有组件**（naive-ui 有 95 个、antd 有 70+ 个、element-plus 有 80+ 个）。同时对每类组件用**差异化的预览模板**（按钮 ≠ 表格 ≠ 日历 ≠ 上传器），保证真实形态。

`trae-ui-example/` 是**只读参考示例**。本技能产出独立的设计库到 `./design-systems/{name}/`。

## Usage

```
/design-library-creator <source> [--name <lib-name>] [--output <path>] [--kit <type1,type2,...>] [--coverage full|standard]
/design-library-creator refine <lib-path>                       # 子命令：refine-library
/design-library-creator expand <lib-path> <slug> [--source <hint>] # 子命令：expand-components
/design-library-creator kit <lib-path> <type>                   # 子命令：generate-additional-kit
```

**Source 类型**：
- 本地路径：`./node_modules/element-plus`、`./previews/buttons.html`、`./src/`
- URL：`https://element-plus.org`
- 图片：`./screenshot.png`、`./mockup.fig.png`
- 库标识：`element-plus` · `ant-design` · `mui` · `tailwind` · `unocss` · `chakra-ui` · `naive-ui`

**Coverage**：
- `standard`（默认）：筛核心 24 组件（覆盖 dashboard 场景），与 Nimbus Core 持平
- `full`：枚举来源**全部组件**（naive-ui 95 个 / antd 70+ / element-plus 80+），覆盖 4 类 UI Kit

**示例**：
```
/design-library-creator ./previews/ --name nimbus-core                              # standard
/design-library-creator https://element-plus.org --name element-core --kit dashboard  # standard
/design-library-creator ./screenshot.png --name ide-minimal --kit dev-explorer          # standard
/design-library-creator naive-ui --name naive-core --kit dashboard --coverage full    # full（95 组件）
/design-library-creator ant-design --name antd-core --coverage full                    # full
/design-library-creator refine ./design-systems/nimbus-core
/design-library-creator expand ./design-systems/nimbus-core tooltip
/design-library-creator kit ./design-systems/nimbus-core mobile
```

---

## 4 阶段流水线（必走，不可跳）

```
Phase 1: 来源解析      → source-brief.json（主动枚举所有组件 + token 候选值 + 视觉锚点）
Phase 2: Token 规范化  → colors_and_type.css + css.json
Phase 3: 组件拆解      → components/*.json + preview/component-*.html（按 8 类差异化渲染）
Phase 4: 聚合 + UIKit  → components.css（脚本生成） + components/index.json + uikit-plan.json
                          + library-consumption.json + ui_kits/{type}/ × N
                          + 库专属 SKILL.md + README.md
```

每个阶段都必须**主动**推进 —— 详见各 Phase 子章节。

---

## 🔴 硬约束（必须遵守，违反 = 拒绝写入）

### 1. Token 命名 verbatim
- ✅ Token **保留源命名**（不重命名、不缩放、不发明）
- ❌ **禁止**引入 `--color-*` 等便携别名
- ❌ **禁止**新增色彩刻度（除非用户明确要求）
- ✅ 组件直接消费 `var(--bg-*)`、`var(--text-*)`、`var(--status-*-*)`、`var(--brand-*-*)`

### 2. colors_and_type.css 头部
- ✅ 必须包含 `/* @dark-only */` 标记（除非用户明确要 light 主题）
- ✅ 必须包含分组优先级注释：`/* @group-priority: brand-green, status, brand-blue, brand-purple, brand-yellow */`

### 3. css.json 字段
- ✅ 必填字段：`color`、`font`、`radius`、`spacing`
- ✅ 保留空桶：`shadow`、`size`（按 spec 保留，即使无值）

### 4. 组件 JSON 契约（schemaVersion: 2）
- ✅ 必填字段：`schemaVersion`、`slug`、`name`、`category`、`tokensConsumed`、`domAnatomy`、`provenance`
- ✅ `domAnatomy.root.tag/class` 必填
- ✅ `tokensConsumed` 必须是 Phase 2 已定义的 token（不允许引用未定义 token）

### 5. preview HTML 结构（**严格**）
- ✅ `<head>` 必须包含 `<link rel="stylesheet" href="../colors_and_type.css" />`
- ✅ JetBrains Mono 通过 Google Fonts `<link>` 引入（不下载到本地）
- ✅ `<style>` 必须有 `/* @component-css-start */` 与 `/* @component-css-end */` 标记
- ✅ **预览页 chrome**（reset、body padding、`.pv-*`）必须在 `@component-css-start` **之上**
- ✅ **组件 CSS**（`.ds-*` 类）必须在两个标记**之间**
- ❌ **禁止**外部 API 调用（fetch / XHR / 第三方 CDN JS 库，仅允许 Babel Standalone + JetBrains Mono Google Fonts）
- ❌ **禁止**将 preview chrome 放进 `@component-css-start` 内（会污染 components.css）

### 6. 组件 CSS 命名
- ✅ 类前缀统一 `.ds-*`（design system）
- ✅ 变体用 BEM：`--{intent}`、`--{size}`、`--{state}`
- ❌ **禁止**硬编码 hex / rem / px（必须用 `var(--token)`）

### 7. components.css
- ❌ **禁止**手改 `components.css`
- ✅ 必须由 `scripts/extract-components-css.mjs` 生成
- ✅ 顶部必须包含 `/* AUTO-GENERATED ... do not edit by hand */` 注释

### 8. ui_kits
- ✅ 容器必须 `max-width: 1184px`（**硬约束**：UIKit 是 showcase，不是 page template）
- ✅ 引用 `../../colors_and_type.css` + `../../components.css`
- ✅ React 18 + Babel Standalone CDN（仅这一个 CDN 例外）
- ✅ 每个 ui-kit 必须有 `quality-report.json`

### 9. trae-ui-example 只读
- ❌ **禁止**修改、追加、删除 `trae-ui-example/` 下任何文件
- ❌ **禁止**把生成结果写到 `trae-ui-example/`

### 10. 输出目录
- 默认 `./design-systems/{name}/`
- 已存在且非空 → 询问 `--force` 后覆盖；默认拒绝

### 11. 全量组件覆盖（**新增**）
- `--coverage full` 时必须**穷尽**扫描来源所有真实组件
- 内置库清单 ≥ 80% 时直接采用（如 naive-ui 95 / antd 70+ / element-plus 80+）
- 不足 80% 时通过 GitHub tree API 重新枚举

---

## Phase 1: 来源解析（详）—— 主动全量扫描

**目标**：穷尽来源的所有真实组件，**不依赖用户提供清单**。

### 1.1 识别 source 类型（A/B/C/D）

### 1.2 主动枚举组件（详策略见 `references/scanning-strategies.md`）

| Source 类型 | 主动扫描策略 | 预期产出 |
|---|---|---|
| **A. 本地源码**（目录） | 扫 `src/<component>/` 完整子目录树 | 全部组件 slug 列表 |
| **B. URL**（组件库官网） | navigate → snapshot 抓左侧导航树 → 列出每个组件链接 | 全部组件页面 URL |
| **C. 图片** | 视觉识别每个 UI 区域（按钮/表单/表格/卡片/导航/...） | 可区分的控件清单 |
| **D. 库标识** | 内置源清单（naive-ui 95 / antd 70+ / element-plus 80+） | 全量组件清单 |

### 1.3 按 coverage 决定最终集合
- `standard`：24 个核心组件
- `full`：源全部组件（无上限）

### 1.4 提取每个组件的元数据
- `name`（中英文）
- `category`（general / layout / navigation / data / form / feedback）
- `variantDimensions`（type / size / state / shape / placement / trigger / direction）
- `renderCategory`（**关键**：用于 Phase 3 选模板 — 8 类之一）
- `tokensConsumed`
- `sourceEvidence`

### 1.5 提取 token 候选值
- 颜色变量（背景、文字、图标、边框、状态、品牌）
- 字号、间距、圆角、组件高度

### 1.6 写入 source-brief.json
- 临时文件，路径 `<output>/.cache/source-brief.json`
- 必须含 `selectionRationale`（让用户知道为什么是这些组件）

---

## Phase 2: Token 规范化

1. 读取 `source-brief.json`
2. 生成 `colors_and_type.css`：
   - 头部加 `/* @dark-only */` 与分组优先级注释
   - token 按 group 顺序排列（surface → brand → status → text → border → font → radius → spacer）
   - verbatim 命名（不重命名）
3. 生成 `css.json`：4 个必填桶（`color`/`font`/`radius`/`spacing`）+ 2 个保留空桶
4. 自检：所有 `--bg-*`、`--text-*`、`--status-*` 必须出现在 css.json 的 color 组

---

## Phase 3: 组件拆解（按 8 类差异化渲染）

> 详见 `references/component-render-templates.md` —— 8 类组件的预览 HTML 骨架 + 差异化 CSS 模式。

**关键**：每类组件有专属模板，**不强制统一**。

### 3.1 8 类组件模板（renderCategory）

| renderCategory | 典型组件 | 预览结构 |
|---|---|---|
| **button** | button, button-group, pagination | 矩阵（type × size × state） |
| **form** | input, select, date-picker, form | 单字段 + 完整表单 |
| **data** | table, list, descriptions, calendar, tree | 表格 / 列表 / 网格 |
| **feedback** | alert, dialog, message, notification, spin, skeleton, progress | 状态行 / 弹出层 / 加载态 |
| **navigation** | menu, tabs, steps, breadcrumb, dropdown, anchor, page-header | 横/竖菜单 / 面包屑 |
| **general** | icon, badge, tag, divider | 简单集合展示 |
| **layout** | layout, grid, space, flex, page-header | 容器布局 |
| **special** | upload, code, typography, marquee, qr-code, equation, heatmap, infinite-scroll, virtual-list, scrollbar, slider, rate, color-picker, switch, radio, checkbox | 领域专用（每个独立模板） |

### 3.2 强制流程（每个组件）

1. 从 `source-brief.json` 取组件清单
2. 按 `renderCategory` 选模板
3. 生成 `components/{slug}.json`（schemaVersion=2，所有必填字段）
4. 生成 `preview/component-{slug}.html`：
   - 头部链接 `colors_and_type.css` + `components.css` + JetBrains Mono
   - 预览 chrome 在 `@component-css-start` 之上
   - 组件 CSS 在两个标记之间
   - `.ds-*` 类前缀 + BEM 变体
5. 必须包含 `atoms` 组件（共享 layout 助手：`.row`、`.col`、`.grid-*`、`.stack-*`、`.h1/.h2/.h3`）

### 3.3 渲染规则（防止 preview HTML 失真）

- **数据组件**（table/list/calendar/heatmap）必须有**真实数据行**（≥ 5 行），不能只是空 markup
- **表单组件**（input/form/select）必须展示 default + focus + disabled + error 状态
- **反馈组件**（alert/dialog/message/notification）必须展示 4 种 status（info/success/warning/error）
- **导航组件**（menu/tabs/steps）必须展示 ≥ 4 项，含 active 态
- **特殊组件**（upload/code/qr-code/equation）按其领域特性各自处理

---

## Phase 4: 聚合 + UIKit + 库专属设计规范

### 4.1 聚合 components.css
```
node .agents/skills/design-library-creator/scripts/extract-components-css.mjs <lib-root>
```
扫描所有 `preview/component-*.html` 的 `@component-css-start`/`@component-css-end` 标记之间的 CSS，按字母排序聚合成 `components.css`。

### 4.2 生成 5 个 meta JSON
- `components/index.json` —— 组件清单（按 slug 排序）+ uiKits 索引
- `uikit-plan.json` —— 2 核心组件 + 剩余为支持 + allowedComponents 白名单
- `library-consumption.json` —— 下游消费顺序

### 4.3 生成 UI Kits

**根据用户 `--kit` 参数生成对应 showcase，每个 1 个 React 18 单文件 HTML + quality-report.json**：

| Kit | 场景 | 核心组件（≥ 6 个） |
|---|---|---|
| `dashboard` | KPI + 表格 + 状态卡 | buttons, menu, table, tag, card, pagination, badge, progress |
| `dev-explorer` | IDE 风格（titlebar + activity-bar + explorer + editor + chat） | menu, tabs, breadcrumb, button, card, dropdown, tooltip, badge |
| `mobile` | 移动端页面（home / detail / settings） | button, tab-bar, list, card, avatar, switch, modal |
| `marketing` | 营销页（landing / pricing） | button, hero, card, feature-grid, pricing-table |

### 4.4 库专属 SKILL.md + README.md

详见 `references/library-doc-template.md`。**强制要求**：
- `<lib-root>/SKILL.md`（简洁版设计规范）
- `<lib-root>/README.md`（含 Downstream Consumption Guide）
- 内容**按本库实际 token / 组件 / 主题**填充，不直接复制 trae-ui-example

---

## 4 类来源适配器

### A. 本地源码（`source-local`）
- **触发**：source 是目录路径
- **工具**：Read / Grep / Glob + Node 脚本
- **扫描策略**：扫 `src/<component>/` 子目录 → 列出全部组件 slug

### B. URL / 网站（`source-url`）
- **触发**：source 以 `http://` 开头
- **工具**：`integrated_browser` MCP（navigate → snapshot → 抓导航 → 列出组件页面）

### C. 图片（`source-image`）
- **触发**：source 是 `.png`/`.jpg`/`.svg`
- **工具**：Read 多模态视觉 + 区域识别

### D. 主流组件库（`source-library`）
- **触发**：source 是已知库标识
- **工具**：内置源清单（naive-ui 95 / antd 70+ / element-plus 80+）
- **GitHub tree API 兜底**：内置清单缺失时自动调 `https://api.github.com/repos/<owner>/<repo>/contents/<src-dir>`

**完整扫描策略**：见 `references/scanning-strategies.md`

---

## 子命令

- `refine-library`：见 `commands/refine-library.md`
- `expand-components`：见 `commands/expand-components.md`
- `generate-additional-kit`：见 `commands/generate-additional-kit.md`

---

## 错误处理

| 场景 | 行为 |
|---|---|
| 来源无法解析（URL 404 / 图片损坏 / 路径不存在） | 终止 Phase 1，列出可修复项 |
| Token 命名与契约冲突 | 拒绝写入，要求二选一：verbatim / 重命名 |
| 组件 CSS 缺少 `@component-css-start` 标记 | 警告并跳过该组件，但保留 preview HTML |
| 已有库根但 components.css 缺失 | 提示先运行 `refine-library` 重生成 |
| 输出目录非空 | 询问 `--force` 后覆盖；默认拒绝 |
| `tokensConsumed` 引用未定义 token | 报错，列出未定义 token，阻止写入 |
| UIKit 缺少 quality-report.json | 报错，UIKit 不算完成 |
| `--coverage full` 但内置清单 < 80% 真实组件数 | 自动调 GitHub tree API 重扫 |

---

## 与 trae-ui-example 的字段映射

详见 `references/trae-ui-example-mapping.md` —— 包含每个 JSON 字段的类型、必填性、示例值。

## 参考文档

- `references/contract.md`：三层契约详细规范
- `references/source-adapters.md`：4 类来源适配器详解
- `references/scanning-strategies.md`：**4 类来源的全量组件扫描策略**
- `references/component-render-templates.md`：**8 类组件的差异化预览模板**
- `references/trae-ui-example-mapping.md`：字段一一映射
- `references/library-doc-template.md`：库专属 SKILL.md / README.md 模板
- `examples/source-brief.example.json`：Phase 1 产出样例
- `README.md`：人类快速指南