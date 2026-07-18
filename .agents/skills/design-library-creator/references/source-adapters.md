# 来源适配器详解

> 本文档详细说明 4 类来源适配器的工作机制、工具栈、输出格式。
> 实际执行由 AI 主导（SKILL.md 仅约束原则），本参考提供具体策略。

## A. `source-local`：本地源码

**触发条件**：
- source 是本地目录路径（如 `./node_modules/element-plus`、`./previews/`）
- source 是本地文件路径（如 `./previews/buttons.html`）

**工具栈**：
- Read / Grep / Glob（基础工具）
- Node 脚本（可选）：`postcss` 解析 CSS vars、`@babel/parser` 解析 JSX/TSX

**解析流程**：

1. **识别类型**：
   - 包含 `package.json` + `dist/` → 组件库
   - 包含 `tailwind.config.js` → Tailwind 项目
   - 包含 `*.html` → 静态原型
   - 包含 `uno.config.ts` → UnoCSS 项目

2. **提取 token**：
   - CSS vars：grep `--[a-z-]+:` 收集
   - Tailwind config：parse `theme.extend.colors / spacing / fontSize`
   - JS 主题对象：parse `theme.ts` / `tokens.ts`

3. **识别组件**：
   - 扫描目录树，匹配常见组件名（Button / Form / Table 等）
   - 读取组件源码，提取 props 推断 variantDimensions
   - 若有 demo 文件（HTML / Storybook），提取 markup 作为 preview 参考

**输出**：写入 `source-brief.json`

---

## B. `source-url`：URL / 网站

**触发条件**：
- source 以 `http://` 或 `https://` 开头

**工具栈**：
- `integrated_browser` MCP：
  - `browser_navigate`：打开 URL
  - `browser_snapshot`：获取页面 DOM 结构
  - `browser_take_screenshot`：截图
  - `browser_evaluate`：执行 JS 取 CSSOM

**解析流程**：

1. **打开主页**：
   ```
   browser_navigate(url)
   browser_take_screenshot(fullPage=true)
   ```

2. **提取 tokens**：
   ```
   browser_evaluate(() => {
     const styles = getComputedStyle(document.documentElement);
     const tokens = {};
     // 遍历所有 CSS 变量
     for (const sheet of document.styleSheets) {
       try {
         for (const rule of sheet.cssRules) {
           if (rule.style) {
             for (const prop of rule.style) {
               if (prop.startsWith('--')) {
                 tokens[prop] = rule.style.getPropertyValue(prop).trim();
               }
             }
           }
         }
       } catch (e) { /* CORS */ }
     }
     return tokens;
   })
   ```

3. **识别组件**：
   - 截图后由 AI 视觉识别（多模态）
   - 访问组件文档子页面（如 `https://element-plus.org/en-US/component/button.html`）

4. **取色 fallback**：
   - 若 CSSOM 提取失败，从截图取色（视觉理解 + 抽样）

---

## C. `source-image`：图片

**触发条件**：
- source 是 `.png` / `.jpg` / `.jpeg` / `.webp` / `.svg`

**工具栈**：
- Read 工具读图（内置多模态视觉理解）
- 可选：Playwright / sharp（如果需要像素级取色，但通常不需要）

**解析流程**：

1. **读图 + 视觉理解**：
   - 用 Read 工具读取图片（会自动启用多模态）
   - AI 视觉识别：主色、辅助色、字体、布局、组件类型

2. **取色策略**：
   - 从图中明显色块提取（如按钮背景、卡片边框、文字颜色）
   - 输出 HEX 格式（部分颜色可能需要透明度估算 → opacity 字段）

3. **组件识别**：
   - 视觉分类：按钮、表单、表格、卡片、导航等
   - 每个组件给出 variantDimensions（基于图中可见状态）

4. **不确定性**：
   - 模糊 / 低分辨率 → 标注 `confidence: low`
   - 复杂渐变 / 阴影 → 标注 `unknowns`

---

## D. `source-library`：主流组件库

**触发条件**：
- source 是已知库标识字符串

**支持库**（内置适配器）：

| 标识 | 包名 | 适配策略 |
|---|---|---|
| `element-plus` | element-plus | 读 `theme-chalk/src/*.scss` + 组件 props |
| `ant-design` | antd | 读 `components/theme/interface/*.ts` + tokens |
| `mui` | @mui/material | 读 `material-ui/src/styles/` + theme |
| `tailwind` | tailwindcss | 读 `stubs/config.full.js` 或用户的 `tailwind.config.js` |
| `unocss` | unocss | 读 `uno.config.ts` 的 theme |
| `chakra-ui` | @chakra-ui/react | 读 `theme/foundations/` + `theme/components/` |
| `naive-ui` | naive-ui | 读 `src/theme/` + `src/_styles/transitions/` |

**解析流程**：

1. **定位库目录**：
   - 默认查找 `./node_modules/<package>`
   - 若不存在，提示用户安装或提供路径

2. **提取 tokens**：
   - 根据库类型选择读取路径
   - 统一转为 CSS vars 格式（`--{name}: {value};`）

3. **提取组件清单**：
   - 扫描 `src/components/` 或 `lib/components/`
   - 每个组件读取 props.ts / types.ts 推断 variantDimensions

4. **映射命名**：
   - ✅ 默认 verbatim 保留源命名
   - ⚠️ 若源使用驼峰（如 `colorPrimary`），提示用户是否转为 kebab-case

---

## 通用：`source-brief.json` 格式

无论哪种来源，Phase 1 都产出统一格式的 `source-brief.json`：

```json
{
  "sourceType": "url | local | image | library",
  "sourceLocator": "<原始 source>",
  "capturedAt": "ISO-8601 timestamp",
  "tokens": {
    "color": {
      "bg-brand": "#32f08c",
      "bg-base-default": "#1a1b1d",
      ...
    },
    "font": { ... },
    "radius": { ... },
    "spacing": { ... }
  },
  "components": [
    {
      "slug": "buttons",
      "name": "Button",
      "confidence": "high",
      "variantDimensions": { "intent": [...], "size": [...] },
      "tokensConsumed": ["--bg-brand", ...],
      "sourceEvidence": "https://... or file path"
    },
    ...
  ],
  "visualAnchors": {
    "primaryColor": "#32f08c",
    "textColor": "#D1D3DB",
    "backgroundColor": "#1A1B1D",
    "fontFamily": "SF Pro Text",
    "density": "compact | regular | spacious"
  },
  "notes": "..."
}
```

**位置**：`<lib-output>/.cache/source-brief.json`（不进库，Phase 2-4 完成后可清理）