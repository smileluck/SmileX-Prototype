# design-library-creator

> 从任意 UI 来源生成符合 Nimbus Core 契约的设计系统包（tokens + components + ui_kits）。

一个多子命令技能，能把以下来源转成统一结构的设计系统库：

| 来源类型 | 示例 |
|---|---|
| 本地源码 | `./previews/`、`./node_modules/naive-ui` |
| URL / 网站 | `https://element-plus.org` |
| 图片 | 设计稿、截图、风格图 |
| 主流组件库 | `element-plus` · `ant-design` · `mui` · `tailwind` · `unocss` · `chakra-ui` · `naive-ui` |

输出完全符合 `trae-ui-example/` 的契约（`colors_and_type.css` + `components.css` + `components/*.json` + `preview/*.html` + `ui_kits/*/`），可直接被下游消费。

## 快速开始

```
# 主命令：从零创建
/design-library-creator <source> [--name <lib-name>] [--output <path>] [--kit <type1,type2>]

# 示例 1：从 Element Plus 官网 URL 生成 element-core
/design-library-creator https://element-plus.org --name element-core --kit dashboard

# 示例 2：从图片生成最小化 IDE 风格库
/design-library-creator ./screenshot.png --name ide-minimal --kit dev-explorer

# 示例 3：从本地 previews 目录生成 nimbus-core
/design-library-creator ./previews/ --name nimbus-core

# 示例 4：从 naive-ui 库标识生成 naive-core
/design-library-creator naive-ui --name naive-core --kit dashboard
```

## 子命令

| 子命令 | 用途 | 示例 |
|---|---|---|
| `design-library-creator` | 从零生成整套 | `/design-library-creator ./previews/` |
| `refine-library` | 修改 token（颜色/字体/命名） | `/design-library-creator refine ./design-systems/nimbus-core --add-color status-info-default:#387BFF` |
| `expand-components` | 追加新组件 | `/design-library-creator expand ./design-systems/nimbus-core tooltip` |
| `generate-additional-kit` | 追加 ui-kit | `/design-library-creator kit ./design-systems/nimbus-core mobile` |

## 输出位置

默认生成到 `./design-systems/{name}/`，与 `trae-ui-example/` 同级但独立。

```
design-systems/
├── naive-core/
│   ├── colors_and_type.css
│   ├── css.json
│   ├── components.css
│   ├── components/
│   │   ├── index.json
│   │   ├── buttons.json / forms.json / tag.json ...
│   │   └── atoms.json
│   ├── preview/
│   │   ├── component-buttons.html
│   │   └── ...
│   ├── ui_kits/
│   │   └── dashboard/
│   │       ├── index.html
│   │       └── quality-report.json
│   └── ...
```

## 技能工作流（4 阶段）

```
Phase 1: 来源解析     → source-brief.json（主动枚举所有组件）
Phase 2: Token 规范化  → colors_and_type.css + css.json
Phase 3: 组件拆解     → components/*.json + preview/component-*.html（24+ 组件）
Phase 4: 聚合 + UIKit → components.css（脚本生成） + ui_kits/{type}/
```

**关键**：Phase 1 必须**主动遍历来源的所有组件**（不是用户提供列表）—— 例如 naive-ui 有 95 个组件，技能从中按优先级筛选 24+ 核心组件生成。

完整工作流见 `SKILL.md`，契约规范见 `references/contract.md`。

## 工具依赖

**零额外安装**：使用现有工具即可：
- `Read` / `Grep` / `Glob`：本地源码解析
- `integrated_browser` MCP：URL / 网站解析（navigate + screenshot + DOM 取值）
- 内置多模态视觉：图片解析
- Node.js：仅 `scripts/extract-components-css.mjs` 脚本需要

## 文件清单

```
design-library-creator/
├── SKILL.md                       # 主命令入口
├── README.md                      # 本文件（人类快速指南）
├── commands/
│   ├── refine-library.md          # 子命令 1
│   ├── expand-components.md       # 子命令 2
│   └── generate-additional-kit.md # 子命令 3
├── scripts/
│   └── extract-components-css.mjs # 聚合脚本（Node）
├── references/
│   ├── contract.md                # 三层契约详细规范
│   ├── source-adapters.md         # 4 类来源适配器详解
│   └── trae-ui-example-mapping.md # 字段一一映射
└── examples/
    └── source-brief.example.json  # Phase 1 产出样例
```

## 命名约定（与 Nimbus Core 一致）

Token **verbatim 保留源命名** —— 不重命名、不缩放、不发明。
- ✅ `--bg-*`、`--text-*`、`--status-*-*`、`--brand-*-*`
- ❌ `--color-*`（便携别名）
- ❌ 新增色彩刻度

组件直接消费 `var(--bg-*)`、`var(--text-*)`、`var(--status-*-*)` 等。组件类前缀 `.ds-*`，变体用 BEM：`--{intent}`、`--{size}`、`--{state}`。

## 与 trae-ui-example 的关系

`trae-ui-example/` 是**只读示例**（Nimbus Core 样板）。本技能生成**新的、独立的**设计库到 `design-systems/{name}/`，**绝不修改** `trae-ui-example/`。

## Generation Notes

- HTML 类名 `.ds-*` 全部组件统一前缀
- `preview/component-*.html` 的 `<style>` 由两部分组成：
  - **chrome**（preview-only）：reset + body + `.pv-*` —— 在 `@component-css-start` **之上**
  - **component CSS**（`.ds-*`）：在两个标记**之间**，被 `extract-components-css.mjs` 提取到 `components.css`
- UIKit 是 **showcase，不是 page template**：`max-width: 1184px` 硬约束（仅最外层 `.uikit-shell` 容器）

## 下游消费指南

```
你要做：在自己画布上生成一个深色 IDE 风格页面
  ↓
1. 读 design-systems/{name}/components/index.json
   → 看有哪些 .ds-* 组件可用
  ↓
2. 读 preview/component-{slug}.html
   → 拿组件的 markup（preview 不带 1184 容器，组件级 fluid）
  ↓
3. 在自己的画布上写外层 grid
   - 不要继承 UIKit 的 .uikit-shell (max-width: 1184)
   - 不要继承 UIKit 的根 grid-template-columns（那是为 1184 调的比例）
   - 只继承组件层级的 markup + class
   - 顶层用 100vw / 100% / auto-fit grid 自适应你的画布
```

## 完整文档

- 技能主入口：`SKILL.md`
- 契约规范：`references/contract.md`
- 来源适配器：`references/source-adapters.md`
- 字段映射：`references/trae-ui-example-mapping.md`
- 库文档模板：`references/library-doc-template.md`
- 设计文档：`docs/superpowers/specs/2026-07-17-design-library-creator-design.md`
- 参考产出：`design-systems/naive-core/`（naive-core 完整 24 组件 + dashboard showcase）