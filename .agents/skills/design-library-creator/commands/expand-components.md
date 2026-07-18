# expand-components

> 追加新组件到已有设计库。

## Usage

```
/design-library-creator expand <lib-path> <slug> [--source <hint>]
/design-library-creator expand <lib-path> <slug> --from <url|file|library>
/design-library-creator expand <lib-path> <slug> --from-image <png>
```

**参数说明**：
- `<slug>`：组件 slug（英文短横线，如 `tooltip`、`split-button`）
- `--source <hint>`：组件来源提示（哪个文件 / 哪个库 / 哪个 URL 段落）
- `--from <source>`：与主命令相同的 source 语法，仅提取该组件相关部分

---

## 必走流程

### 1. 校验库根与 slug 唯一性
- 检查 `<lib-path>` 存在且为有效设计库
- 检查 `<lib-path>/components/{slug}.json` 不存在（避免覆盖）
- 检查 `<lib-path>/preview/component-{slug}.html` 不存在

### 2. 复用现有 token
- 读取 `css.json` 与 `colors_and_type.css` 当前所有 token
- **禁止**为新组件新增 token（除非用户显式 `--new-token <name:value>`）
- 新组件的 `tokensConsumed` 必须全部来自现有 token 集合

### 3. 生成新组件契约
- `components/{slug}.json`：
  - `schemaVersion: 2`
  - `category`：从已有分类中选（`general` / `navigation` / `data` / `form` / `feedback` / `layout` / `ide` / `ai` 等）
  - `tokensConsumed`：列出所有用到的 token
  - `domAnatomy`：至少 root 节点
  - `provenance.preview`：`preview/component-{slug}.html`
  - `provenance.source`：原始来源（--source 参数值）
  - 其他推荐字段：`variantDimensions` / `representativeVariants` / `structurePatterns` / `usageHints` / `doNotInvent` / `unknowns`

- `preview/component-{slug}.html`：
  - `<head>`：`<link rel="stylesheet" href="../colors_and_type.css" />` + `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" />` + `<link rel="stylesheet" href="../components.css" />`
  - `<style>` 第一块（preview chrome）：在 `@component-css-start` **之上**
  - `<style>` 第二块（`.ds-*` 组件 CSS）：在 `@component-css-start` 与 `@component-css-end` **之间**

### 4. 更新聚合文件
- 追加 `components/index.json` 的 `components` 数组
- 重跑 `scripts/extract-components-css.mjs` 重新生成 `components.css`
- 不动 `uikit-plan.json`（组件扩展默认不调整 ui-kit 白名单）
- 不动 `library-consumption.json`（除非用户额外指定）

### 5. 报告
输出：
- 新增/修改的文件清单
- 新组件用到的 token 数
- components.css 行数变化（before / after）

---

## 🔴 硬约束

- ❌ **禁止**新增 token（除非用户显式 `--new-token`）
- ❌ **禁止**覆盖已有组件
- ❌ **禁止**修改既有组件 JSON（这是 `refine-library` 的职责）
- ✅ `tokensConsumed` 必须全部来自现有 token
- ✅ `preview/component-{slug}.html` 必须严格遵守标记位置（chrome 在 start 上，组件 CSS 在 start/end 之间）
- ❌ **禁止**外部 API 调用

---

## 错误处理

| 场景 | 行为 |
|---|---|
| 组件已存在 | 报错，提示用户先删除或使用不同 slug |
| `tokensConsumed` 引用未定义 token | 报错，列出未定义 token，建议使用 `refine-library --add-color` 先加 token |
| preview 缺少 `@component-css-start` 标记 | 报错，阻止写入 |
| 从图片提取时图片模糊 / 不可读 | 终止，提示用户提供更清晰的源 |

---

## 示例

```
# 从 Element Plus 提取 tooltip 组件
/design-library-creator expand ./design-systems/nimbus-core tooltip \
  --from https://element-plus.org/en-US/component/tooltip.html

# 从本地源码提取
/design-library-creator expand ./design-systems/nimbus-core split-button \
  --source ./src/components/SplitButton.tsx

# 从图片提取
/design-library-creator expand ./design-systems/nimbus-core breadcrumb \
  --from-image ./breadcrumb-mockup.png

# 追加时新增 token（罕见情况）
/design-library-creator expand ./design-systems/nimbus-core rating \
  --source ./rating.html --new-token status-rating-default:#FFB400
```