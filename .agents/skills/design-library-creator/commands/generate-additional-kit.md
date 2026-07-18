# generate-additional-kit

> 追加新的 ui-kit（页面级 showcase）到已有设计库。

## Usage

```
/design-library-creator kit <lib-path> <type> [--screen <name1,name2>]
/design-library-creator kit <lib-path> mobile --screen home,detail,settings
/design-library-creator kit <lib-path> marketing --screen landing,pricing,blog
```

**常用 kit type**（仅约定俗成，不强制）：
- `dashboard`：KPI + 表格 + 图表
- `dev-explorer`：IDE 外壳（titlebar + activity-bar + explorer + editor + chat + status-bar）
- `mobile`：移动端页面（home / detail / settings）
- `marketing`：营销页（landing / pricing / blog / docs）

---

## 必走流程

### 1. 校验库根与 kit type 唯一性
- 检查 `<lib-path>` 存在
- 检查 `<lib-path>/ui_kits/{type}/` 不存在
- 检查 `<lib-path>/uikit-plan.json` 的 `allowedComponents` 列出可用组件

### 2. 选择该 kit 的核心 + 支持组件
- 核心组件（必须有，否则报错）：
  - `dashboard`：`buttons` / `nav-list` / `page-header` / `stat-card` / `tag` / `table` / `pagination` / `forms`
  - `dev-explorer`：`workbench-titlebar` / `activity-rail` / `file-tree` / `editor-tabs` / `chat-composer` / `status-bar`
  - `mobile`：`nav-list` / `page-header` / `tabs` / `cards` / `buttons`
  - `marketing`：`page-header` / `buttons` / `cards` / `tag`
- 支持组件：从 `<lib-path>/uikit-plan.json` 的 `allowedComponents` 中选

### 3. 生成 ui-kit 单文件 React 18 showcase
- `ui_kits/{type}/index.html`：
  - 引用 `../../colors_and_type.css` + `../../components.css`
  - 图标通过 `../../assets/icons/*.svg`
  - 容器 `.uikit-shell` 必须 `max-width: 1184px; margin: 0 auto;`
  - 使用 React 18 + Babel Standalone CDN
  - 状态管理用 `useState`（无后端）

### 4. 生成 quality-report.json
- `ui_kits/{type}/quality-report.json` 必填字段：
  - `kitType`：`<type>`
  - `screensGenerated`：screens 数量
  - `coreComponentsUsed`：核心组件 slug 数组
  - `supportComponentsUsed`：支持组件 slug 数组
  - `previewClassReuseRate`：0-1 之间的小数（复用 preview class 的比例）
  - `inventedComponents`：空数组 `[]`（**禁止**发明新组件）
  - `interactiveStatesRendered`：状态数组，如 `["hover", "disabled", "selected", "active"]`
  - `primaryActionPerScreen`：每屏 1 个主操作（true/false）
  - `mockDataDensity`：`{"tableRows": N, "chartPoints": N}`
  - `warnings`：警告数组 `[]`

### 5. 更新聚合文件
- 追加 `components/index.json` 的 `uiKits` 数组
- 追加 `uikit-plan.json` 的 `kitType` 索引（如有该字段）
- 不动 `components.css`

---

## 🔴 硬约束

- ❌ **禁止** `max-width` 大于 1184px（**这是硬约束**）
- ❌ **禁止** `transform: scale`（不能缩放展示）
- ❌ **禁止** `inventedComponents` 非空（不允许发明新组件，全部用现有 `.ds-*`）
- ❌ **禁止**每屏超过 1 个 brand 按钮
- ❌ **禁止**引用 UIKit 之外的其他 React 库（仅 React 18 + Babel Standalone）
- ✅ 必须使用 `var(--token)`，不允许硬编码 hex
- ✅ 必须输出 quality-report.json
- ✅ `primaryActionPerScreen: true`

---

## 错误处理

| 场景 | 行为 |
|---|---|
| ui_kits/{type}/ 已存在 | 报错，提示用户先删除或使用不同 type |
| 核心组件缺失 | 报错，列出缺失组件，建议使用 `expand-components` 先添加 |
| 缺少 quality-report.json | 报错，UIKit 不算完成 |
| 引用了未定义组件（不在 uikit-plan 中） | 报错，列出未授权组件 |

---

## 示例

```
# 添加 dashboard kit
/design-library-creator kit ./design-systems/nimbus-core dashboard

# 添加 dev-explorer kit
/design-library-creator kit ./design-systems/nimbus-core dev-explorer

# 添加 mobile kit（指定 screens）
/design-library-creator kit ./design-systems/nimbus-core mobile \
  --screen home,detail,settings,profile

# 添加 marketing kit
/design-library-creator kit ./design-systems/nimbus-core marketing \
  --screen landing,pricing
```

---

## UIKit 设计指南

### 容器结构（max-width: 1184px）
```html
<div class="uikit-shell">
  <!-- 顶部：page-header 或 workbench-titlebar -->
  <header>...</header>
  <!-- 主体：grid 布局 -->
  <main class="grid">
    <aside>...</aside>  <!-- sidebar / activity-bar -->
    <section>...</section>  <!-- 主内容 -->
  </main>
  <!-- 底部（可选）：status-bar / pagination -->
</div>
```

### 状态展示要求
- 每个交互组件至少展示 `default` + 1 个其他状态（hover / active / disabled / selected）
- 表格至少 8 行 mock data
- 图表至少 12 个数据点

### 不要做的事
- ❌ 不要把 UIKit 当作真实页面模板（外层 grid 写死 1920 比例）
- ❌ 不要在 UIKit 内引入新组件（用现有 `.ds-*` 组合）
- ❌ 不要硬编码颜色或字号