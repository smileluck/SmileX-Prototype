# design-library-creator

> 从任意 UI 来源扫描全部组件，生成符合 Trae Design 契约的设计系统包（tokens + components + ui_kits）。

## 核心能力（与同类技能的本质差异）

| 维度 | 普通技能 | **design-library-creator** |
|---|---|---|
| 组件枚举 | 依赖用户提供清单 | **主动遍历来源**所有组件（naive-ui 95 / antd 70+ / element-plus 80+） |
| 预览渲染 | 单一通用模板 | **8 类差异化模板**（按钮 ≠ 表格 ≠ 日历 ≠ 上传器） |
| 库适配 | 写死的适配器 | **内置库清单** + GitHub tree API 兜底 |
| 覆盖度 | 单 cover 模式 | **standard / full** 双档（24 vs 全量） |

---

## 快速开始

```
# 主命令：从零创建
/design-library-creator <source> [--name <lib-name>] [--output <path>] [--kit <type1,type2,...>] [--coverage full|standard]

# 示例 1：standard 模式（24 组件）—— 与 Nimbus Core 持平
/design-library-creator ./previews/ --name nimbus-core

# 示例 2：full 模式（95 组件）—— 覆盖 naive-ui 全部
/design-library-creator naive-ui --name naive-core --coverage full --kit dashboard,dev-explorer,mobile,marketing

# 示例 3：ant-design 全量
/design-library-creator ant-design --name antd-core --coverage full --kit dashboard

# 示例 4：从图片生成（standard 模式，视觉识别后筛）
/design-library-creator ./screenshot.png --name ide-minimal --kit dev-explorer

# 子命令
/design-library-creator refine ./design-systems/nimbus-core
/design-library-creator expand ./design-systems/nimbus-core tooltip
/design-library-creator kit ./design-systems/nimbus-core mobile
```

---

## 4 阶段流水线（不可跳）

```
Phase 1: 来源解析      → source-brief.json（主动枚举所有组件 + token 候选值 + 视觉锚点）
Phase 2: Token 规范化  → colors_and_type.css + css.json
Phase 3: 组件拆解      → components/*.json + preview/component-*.html（按 8 类差异化渲染）
Phase 4: 聚合 + UIKit  → components.css（脚本生成） + components/index.json + uikit-plan.json
                          + library-consumption.json + ui_kits/{type}/ × N
                          + 库专属 SKILL.md + README.md
```

### 关键差异化特性

**Phase 1: 主动遍历**
- 4 类来源（本地 / URL / 图片 / 库标识）→ 各自专属扫描策略
- 内置 7 个主流组件库的完整清单（naive-ui 95 / antd 70+ / element-plus 80+ / mui 70+ / chakra-ui 30+）
- 缺失时用 GitHub tree API 自动兜底

**Phase 3: 8 类差异化预览**

| renderCategory | 组件数 | 模板特征 |
|---|---|---|
| **button** | ~5 | 矩阵（type × size × state） |
| **form** | ~15 | 单字段 + 完整表单（含 label + 验证反馈） |
| **data** | ~12 | 表格（≥5 行） / 列表（≥5 项） / 时间线 / 日历 |
| **feedback** | ~15 | 状态行 + 弹出层 + 加载态 + 进度 |
| **navigation** | ~9 | 横/竖菜单 + 选中态指示器 |
| **general** | ~5 | 简单集合展示（icon / tag / badge / divider） |
| **layout** | ~5 | 容器 + 网格 + 间距 + 弹性 |
| **special** | ~29 | 领域专用模板（upload / code / qr-code / slider / rate / color-picker 等） |

---

## 4 类来源适配器

| 类型 | 触发 | 工具 | 扫描策略 |
|---|---|---|---|
| A. **本地源码** | 目录路径 | Read/Grep/Glob | 扫 `src/<component>/` 子目录，过滤内部工具 |
| B. **URL** | http(s)://... | integrated_browser MCP | navigate → snapshot 抓导航 → 列组件页面 |
| C. **图片** | .png/.jpg/.svg | Read 多模态视觉 | 区域识别 + 取色 |
| D. **库标识** | `naive-ui` / `ant-design` / 等 | 内置清单 + GitHub tree API | 直接取 95 / 70+ / 80+ 完整清单 |

详细算法：见 `references/scanning-strategies.md`

---

## 文件清单

```
design-library-creator/
├── SKILL.md                                # 主命令入口（11 条硬约束 + 4 阶段）
├── README.md                               # 本文件
├── commands/
│   ├── refine-library.md                   # 子命令 1
│   ├── expand-components.md                # 子命令 2
│   └── generate-additional-kit.md          # 子命令 3
├── scripts/
│   └── extract-components-css.mjs          # 聚合脚本（Node，0 依赖）
├── references/
│   ├── contract.md                         # 三层契约详细规范
│   ├── source-adapters.md                  # 4 类来源适配器详解
│   ├── scanning-strategies.md              # 4 类来源的「全量组件扫描策略」+ GitHub API 兜底
│   ├── component-render-templates.md       # 8 类组件的差异化预览模板（含 upload / code / qr-code 等 special 模板）
│   ├── trae-ui-example-mapping.md          # 字段一一映射
│   ├── trae-ui-example/                    # 完整范本副本（嵌入技能内，188 文件）
│   └── library-doc-template.md             # 库专属 SKILL.md / README.md 模板
└── examples/
    └── source-brief.example.json           # Phase 1 产出样例
```

---

## 子命令

| 子命令 | 用途 | 示例 |
|---|---|---|
| `design-library-creator` | 从零生成整套 | `/design-library-creator naive-ui --coverage full --kit dashboard,dev-explorer` |
| `refine-library` | 修改 token（颜色/字体/命名） | `/design-library-creator refine ./design-systems/nimbus-core --add-color status-info-default:#387BFF` |
| `expand-components` | 追加新组件 | `/design-library-creator expand ./design-systems/nimbus-core tooltip` |
| `generate-additional-kit` | 追加 ui-kit | `/design-library-creator kit ./design-systems/nimbus-core mobile` |

---

## 库适配覆盖度（内置清单）

| 库 | 总组件数 | coverage=standard | coverage=full |
|---|---|---|---|
| `naive-ui` | **95** | 24 核心 | **全部 95** |
| `ant-design` | 70+ | 24 核心 | 全部 70+ |
| `element-plus` | 80+ | 24 核心 | 全部 80+ |
| `mui` (Material UI) | 70+ | 24 核心 | 全部 70+ |
| `chakra-ui` | 30+ | 24 核心 | 全部 30+ |
| `tailwind` / `unocss` | 不适用 | 仅生成 token + 工具类清单 | — |

---

## 命名约定（与 Trae Design 一致）

Token **verbatim 保留源命名** —— 不重命名、不缩放、不发明。
- ✅ `--bg-*`、`--text-*`、`--status-*-*`、`--brand-*-*`
- ❌ `--color-*`（便携别名）
- ❌ 新增色彩刻度

组件直接消费 `var(--bg-*)`、`var(--text-*)`、`var(--status-*-*)` 等。组件类前缀 `.ds-*`，变体用 BEM：`--{intent}`、`--{size}`、`--{state}`。

## 与 trae-ui-example 的关系

`references/trae-ui-example/` 是**只读范本**（已嵌入技能内，188 文件），代表 Nimbus Core 样板。本技能生成**新的、独立的**设计库到 `design-systems/{name}/`，**绝不修改** `references/trae-ui-example/` 或任何外部位置。

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
- 全量扫描策略：`references/scanning-strategies.md`
- 8 类预览模板：`references/component-render-templates.md`
- 字段映射：`references/trae-ui-example-mapping.md`
- 库文档模板：`references/library-doc-template.md`
- 设计文档：`docs/superpowers/specs/2026-07-17-design-library-creator-design.md`
- 参考产出：`design-systems/naive-core/`（24-95 组件 + 4 个 dashboard/dev-explorer/mobile/marketing showcase）