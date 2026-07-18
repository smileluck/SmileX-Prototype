# 4 类来源的全量组件扫描策略

> Phase 1 强制要求"主动遍历来源所有组件"。本参考文档给出 4 类来源（A 本地源码 / B URL / C 图片 / D 主流组件库）的具体扫描算法、组件清单来源、GitHub tree API 兜底逻辑。

## 目录

- A. 本地源码（`source-local`）
- B. URL / 网站（`source-url`）
- C. 图片（`source-image`）
- D. 主流组件库（`source-library`）
- 通用兜底：GitHub tree API

---

## A. 本地源码（`source-local`）

**触发条件**：source 是本地目录路径（如 `./node_modules/naive-ui`、`./previews/`、`./src/`）。

**扫描算法**：

1. **目录识别**：
   ```bash
   # 优先扫 src/，如果不存在则扫整个根目录
   ls {source}/src/ || ls {source}/
   ```

2. **目录结构判定**：
   - 如果存在 `src/<component>/` 子目录（Vue/React 组件库标准结构）→ 直接扫这些目录
   - 如果存在 `lib/<component>.js` 或 `es/<component>/`（打包后的 dist）→ 扫这些
   - 如果是 Storybook 工程（存在 `.storybook/`）→ 扫 `src/stories/`

3. **筛选有效组件目录**（排除内部工具）：
   ```
   排除以 _ 开头的目录（_internal / _mixins / _styles / _utils / _utils / _locale 等）
   排除已知非组件目录：composables · config-consumer · config-provider · discrete · global-style · legacy-* · locales · theme-editor · themes · element · icons · typings
   ```

4. **每个组件目录扫内部**：
   - 读 `<component>/index.ts` 或 `<component>/<Name>.vue` → 提取 props → 推断 `variantDimensions`
   - 读 `<component>/styles/index.ts` 或 `<component>/src/styles` → 提取私有 token
   - 读 `<component>/README.md` → 提取使用示例、anatomy

5. **输出 component 数组**：每项 `{slug, name, category, renderCategory, variants, tokensConsumed, sourceEvidence}`

---

## B. URL / 网站（`source-url`）

**触发条件**：source 以 `http://` 或 `https://` 开头。

**扫描算法**（用 `integrated_browser` MCP）：

1. **navigate 到主页**：`browser_navigate(url)` + `browser_take_screenshot(fullPage=true)`

2. **抓取导航树**（核心）：
   ```yaml
   # snapshot 找 sidebar / nav / menu，列出所有链接
   nav.sidebar  ul li a[href*="/component/"]
   ```
   收集 → 去重 → 按 href 排序

3. **遍历每个组件页面**（每个 link）：
   ```
   browser_navigate(component_url)
   browser_snapshot → 提取示例 markup
   browser_evaluate → 取 CSSOM token（如 --color-primary）
   ```

4. **DOM 取 token**：
   ```javascript
   () => {
     const styles = getComputedStyle(document.documentElement);
     const tokens = {};
     for (const sheet of document.styleSheets) {
       try {
         for (const rule of sheet.cssRules) {
           if (rule.style) for (const prop of rule.style) {
             if (prop.startsWith('--')) tokens[prop] = rule.style.getPropertyValue(prop).trim();
           }
         }
       } catch (e) {}
     }
     return tokens;
   }
   ```

5. **输出 component 数组**（每个 link → 1 个 component）

6. **注意**：网页可能分页加载，**翻 2-3 页**直到列表稳定。

---

## C. 图片（`source-image`）

**触发条件**：source 是 `.png`/`.jpg`/`.jpeg`/`.webp`/`.svg`。

**扫描算法**：

1. **Read 工具读图**（自动启用多模态视觉）。

2. **视觉分区**：从大图左上→右下扫描，每个区域识别控件类型：
   - 圆形/方形头像 + 名字 → avatar
   - 矩形彩色徽章 + 文字 → tag / badge
   - 矩形带边框按钮 → button
   - 横线列表 + 多行 → list
   - 多列网格 → card-grid
   - 表格 → table
   - 横/竖向菜单 + 选中态 → menu
   - 弹层 + 圆角阴影 → dialog / popover / drawer
   - 输入框 → input / select / textarea
   - 进度条 → progress
   - ...

3. **取色**（按区域）：
   - 主要背景色 → `--body-*`
   - 卡片背景 → `--card-*`
   - 主品牌色 → `--primary-*`
   - 文字色 → `--text-1/2/3`
   - 边框色 → `--border-*`

4. **不确定性**：
   - 模糊 / 低分辨率 → 标 `confidence: low`
   - 复杂渐变 / 阴影 → 标 `unknowns`

---

## D. 主流组件库（`source-library`）

**触发条件**：source 是已知库标识字符串（如 `naive-ui`）。

### D.1 内置源清单（第一选择）

技能内置主流组件库的**完整清单**，按 slug 列表：

| 库 | 总数 | 内置 URL 来源 |
|---|---|---|
| `naive-ui` | **95** | `tusen-ai/naive-ui` GitHub tree |
| `ant-design` | 70+ | `ant-design/ant-design` GitHub tree |
| `element-plus` | 80+ | `element-plus/element-plus` GitHub tree |
| `mui` (Material UI) | 70+ | `mui/material-ui` GitHub tree |
| `tailwind` | 不适用 | 提供 token + 工具类，不生成组件库（告知用户） |
| `unocss` | 不适用 | 提供 token + preset，不生成组件库 |
| `chakra-ui` | 30+ | `chakra-ui/chakra-ui` GitHub tree |

**调用方式**：技能加载时直接读取 `references/library-catalogs/{name}.json`。

### D.2 GitHub tree API 兜底（第二选择）

如果内置清单缺失（如遇到小众库），用 `GitHub Contents API`：

```bash
GET https://api.github.com/repos/{owner}/{repo}/contents/{src-dir}
```

**已知 owner/repo 对照**：
```
naive-ui:    tusen-ai/naive-ui → src/
ant-design:  ant-design/ant-design → components/
element-plus: element-plus/element-plus → packages/
mui:         mui/material-ui → packages/mui-material/src/
chakra-ui:   chakra-ui/chakra-ui → packages/components/src/
```

**调用方式**（PowerShell）：
```powershell
$j = Invoke-RestMethod 'https://api.github.com/repos/{owner}/{repo}/contents/{dir}'
$list = $j | Where-Object { $_.type -eq 'dir' -and $_.name -notmatch '^_' } | ForEach-Object { $_.name }
```

**过滤规则**：
- 排除 `_` 前缀目录（_internal / _utils）
- 排除已知非组件：composables / config-* / discrete / global-style / legacy-* / locales / theme-editor / themes / element / icons

**注意**：
- GitHub API rate limit：未认证 60/小时，认证后 5000/小时
- 大型仓库可能需要分页（per_page=100）
- 如果超过 100 个子目录 → 用 tree API with recursive=1（但要先尝试非递归）

### D.3 内置清单文件位置

技能应在以下路径维护源清单：

```
.agents/skills/design-library-creator/references/library-catalogs/
├── naive-ui.json
├── ant-design.json
├── element-plus.json
├── mui.json
└── chakra-ui.json
```

每个文件格式：
```json
{
  "library": "naive-ui",
  "github": { "owner": "tusen-ai", "repo": "naive-ui", "srcDir": "src" },
  "totalCount": 95,
  "components": ["affix", "alert", "anchor", ...],
  "excludedDirs": ["_internal", "_mixins", "_styles", "_utils", "composables", "config-consumer", "config-provider", "discrete", "global-style", "legacy-grid", "legacy-transfer", "locales", "theme-editor", "themes", "element"],
  "notes": "Vue 3 component library, uses JS theme object (not CSS vars). 95 real components."
}
```

**优先用内置**（快、稳、无 API 限制），**GitHub 兜底**（覆盖未入库的小众库）。

---

## 输出统一格式（source-brief.json）

无论哪种 source 类型，最终都产出：

```json
{
  "sourceType": "library | local | url | image",
  "sourceLocator": "naive-ui",
  "capturedAt": "ISO-8601",
  "tokens": { "color": {...}, "font": {...}, "radius": {...}, "spacing": {...} },
  "components": [
    {
      "slug": "button",
      "name": "Button",
      "category": "general | layout | navigation | data | form | feedback",
      "renderCategory": "button | form | data | feedback | navigation | general | layout | special",
      "variantDimensions": { "type": [...], "size": [...], "state": [...] },
      "confidence": "high | medium | low",
      "tokensConsumed": ["--primaryColor", ...],
      "sourceEvidence": "URL or file path"
    }
  ],
  "visualAnchors": { ... },
  "selectionRationale": {
    "totalAvailable": 95,
    "filteredOut": ["..."],
    "selected": 95,
    "criteria": "..."
  },
  "notes": "..."
}
```

**`renderCategory` 是关键字段** —— Phase 3 据此选 8 类差异化模板。

---

## 通用守则

1. **不依赖用户提供清单** —— 主动穷尽
2. **内置清单优先** —— GitHub API 限流时优先用内置
3. **过滤规则一致** —— 所有 source 类型都用同一套"非组件目录黑名单"
4. **`renderCategory` 必须填** —— 否则 Phase 3 退回默认模板（降低质量）
5. **失败透明** —— 列出过滤掉的目录名，让用户可审查
