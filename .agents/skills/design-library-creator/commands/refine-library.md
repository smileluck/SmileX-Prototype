# refine-library

> 修改已有设计库的 token（颜色 / 字体 / 圆角 / 间距 / 命名 / 分组）。

## Usage

```
/design-library-creator refine <lib-path>
/design-library-creator refine <lib-path> --rename <old:new>
/design-library-creator refine <lib-path> --add-color <name:hex>
/design-library-creator refine <lib-path> --add-spacing <name:rem>
/design-library-creator refine <lib-path> --theme light
```

**参数说明**：
- `--rename <old:new>`：批量重命名 token（自动更新 css.json + 所有 components/*.json + preview HTML + components.css）
- `--add-color <name:hex>`：追加单个颜色 token
- `--add-spacing <name:rem>`：追加单个间距 token
- `--theme light`：切换为 light 主题（移除 `/* @dark-only */` 标记）

---

## 必走流程

### 1. 校验库根
- 检查 `<lib-path>/colors_and_type.css` 存在
- 检查 `<lib-path>/css.json` 存在
- 检查 `<lib-path>/components/` 目录存在
- 任何一个缺失 → 报错并提示先运行主命令创建

### 2. 加载当前契约
- 读取 `css.json` 当前所有 token
- 读取所有 `components/*.json` 的 `tokensConsumed`
- 读取所有 `preview/component-*.html` 引用

### 3. 应用修改
按参数类型分别处理：

**A. `--rename`**：
1. 在 `colors_and_type.css` 替换 `--old` 为 `--new`
2. 在 `css.json` 替换所有出现 `old` 的 key
3. 在所有 `components/*.json` 的 `tokensConsumed` 数组替换
4. 在所有 `preview/component-*.html` 的 CSS 与 HTML 替换 `var(--old)` 为 `var(--new)`
5. 重跑 `scripts/extract-components-css.mjs` 重新生成 components.css

**B. `--add-color` / `--add-spacing`**：
1. 在 `colors_and_type.css` 合适分组下追加 `--{name}: {value};`
2. 在 `css.json` 对应桶（color / spacing）追加条目
3. 不修改 components（除非用户额外指定 `--bind <slug>`）

**C. `--theme light`**：
1. 移除 `colors_and_type.css` 头部的 `/* @dark-only */` 注释
2. 提示用户：token 颜色值不变，仍是源 verbatim；如需重新调色，使用 `--add-color` 覆盖

### 4. 校验一致性
- `css.json` 中所有 token 必须出现在 `colors_and_type.css`
- `components/*.json` 的 `tokensConsumed` 必须全部在 `css.json` 中有定义
- `components.css` 必须与最新 preview 区块一致（重跑脚本后行数变化应在 ±2 内）

### 4.5 同步 design-system.md
- `<lib-path>/design-system.md` 存在时：
  - `--rename`：同步替换 frontmatter 中的 token 名与正文引用
  - `--add-color` / `--add-spacing`：在 frontmatter 对应表（colors / spacing）追加条目
  - `--theme light`：更新 description 与正文中关于主题的表述
- 不存在时：按主命令 Phase 4.5 的格式基于当前 token 补齐生成

### 5. 报告变更
输出：
- 影响的文件清单
- 新增 / 修改 / 删除的 token 数
- 影响到的组件数（用到该 token 的）

---

## 🔴 硬约束

- ❌ **禁止**重命名后留下旧 token 引用（grep 必须为 0 命中）
- ❌ **禁止**新增 token 后不更新 css.json（两文件必须同步）
- ❌ **禁止**token 变更后 `design-system.md` 与 `css.json` 不同步（frontmatter 取值必须一致）
- ✅ 所有重命名必须先 grep `--old` 列出影响范围，再批量替换
- ✅ `--theme light` **不**自动反转颜色（仅移除标记）

---

## 错误处理

| 场景 | 行为 |
|---|---|
| 库根不存在 | 报错，提示先运行主命令 |
| `--rename` 旧名不存在 | 报错，列出当前所有 token |
| 重命名后仍有引用 | 报错，列出文件 + 行号，阻止完成 |
| `--theme` 与其他 `--rename` 冲突 | 提示用户分开两次执行 |

---

## 示例

```
# 重命名主品牌色
/design-library-creator refine ./design-systems/nimbus-core \
  --rename bg-brand:bg-accent,bg-accent-hover:bg-accent-hover

# 追加新颜色
/design-library-creator refine ./design-systems/nimbus-core \
  --add-color status-info-default:#387BFF \
  --add-color status-info-surface-l1:#387BFF:opacity-0.12

# 切换 light 主题
/design-library-creator refine ./design-systems/nimbus-core --theme light
```