# 8 类组件差异化渲染模板

> Phase 3 必须按 `renderCategory` 选对应模板。每个模板给出**预览 HTML 骨架** + **典型 CSS 模式** + **核心 DOM 契约**。
> 严格遵循 5 条强制规则：
> 1. `@component-css-start` / `@component-css-end` 标记必须夹住 `.ds-*` 组件 CSS
> 2. 预览 chrome（reset + body + `.pv-*`）在标记之上
> 3. 头部必须链接 `colors_and_type.css` + JetBrains Mono
> 4. `.ds-*` 类前缀 + BEM 变体
> 5. 仅用 `var(--token)`，禁止硬编码 hex/rem/px

---

## 目录

1. **button** —— 按钮 / 按钮组 / 分页
2. **form** —— 输入 / 选择 / 表单
3. **data** —— 表格 / 列表 / 描述 / 日历 / 树
4. **feedback** —— 警告 / 对话框 / 通知 / 加载 / 进度 / 提示
5. **navigation** —— 菜单 / 标签页 / 步骤 / 面包屑 / 下拉
6. **general** —— 图标 / 徽章 / 标签 / 分割线
7. **layout** —— 容器 / 网格 / 间距 / 弹性 / 分页头
8. **special** —— 上传 / 代码 / 排版 / 二维码 / 数学公式 / 滚动列表 / 滑块 / 评分 / 颜色选择 / 折叠 / 轮播

---

## 1. button 模板

**适用组件**：button / button-group / pagination / segmented-control

**DOM 契约**：元素 ≤ 5 列矩阵（type × size × state）

**典型 markup**：

```html
<section class="pv-section">
  <div class="pv-section__title">Type matrix</div>
  <div class="ds-btn-row">
    <button class="ds-btn ds-btn--primary ds-btn--md">Primary</button>
    <button class="ds-btn ds-btn--default ds-btn--md">Default</button>
    <button class="ds-btn ds-btn--tertiary ds-btn--md">Tertiary</button>
  </div>
  <div class="pv-section__title">Sizes</div>
  <div class="ds-btn-row">
    <button class="ds-btn ds-btn--primary ds-btn--tiny">Tiny</button>
    <button class="ds-btn ds-btn--primary ds-btn--small">Small</button>
    <button class="ds-btn ds-btn--primary ds-btn--medium">Medium</button>
    <button class="ds-btn ds-btn--primary ds-btn--large">Large</button>
  </div>
  <div class="pv-section__title">States</div>
  <div class="ds-btn-row">
    <button class="ds-btn ds-btn--primary ds-btn--medium">Default</button>
    <button class="ds-btn ds-btn--primary ds-btn--medium" disabled>Disabled</button>
  </div>
</section>
```

**核心 CSS 模式**：

```css
/* @component-css-start */
.ds-btn { display: inline-flex; align-items: center; justify-content: center;
  gap: var(--spacer-4); padding: 0 var(--spacer-12);
  height: var(--heightMedium); border-radius: var(--borderRadiusMedium);
  border: 1px solid transparent; cursor: pointer;
  font-family: var(--fontFamily); font-size: var(--fontSizeMedium);
  font-weight: var(--fontWeightStrong);
  transition: background 0.12s, color 0.12s, border-color 0.12s;
}
.ds-btn--primary { background: var(--primaryColor); color: var(--invertedColor); border-color: var(--primaryColor); }
.ds-btn--primary:hover { background: var(--primaryColorHover); }
.ds-btn--primary:disabled { opacity: 0.5; cursor: not-allowed; }
.ds-btn--default { background: var(--buttonColor2); color: var(--textColor1); border-color: var(--borderColor); }
/* sizes + states... */
/* @component-css-end */
```

**强制规则**：
- 至少展示 4 种 type（primary / default / tertiary / 1 个 status）
- 至少展示 4 种 size
- 至少展示 default + disabled

---

## 2. form 模板

**适用组件**：input / input-number / textarea / select / cascader / tree-select / auto-complete / date-picker / time-picker / color-picker / mention / form / dynamic-input / dynamic-tags

**DOM 契约**：单字段 + 完整表单（含 label + 验证反馈 + actions）

**典型 markup**：

```html
<section class="pv-section">
  <div class="pv-section__title">Input variants</div>
  <div class="stack-12">
    <input class="ds-input ds-input--medium" placeholder="Default" />
    <input class="ds-input ds-input--medium" placeholder="Focused" />
    <input class="ds-input ds-input--medium" placeholder="Disabled" disabled />
    <input class="ds-input ds-input--medium ds-input--error" value="Invalid" />
  </div>
</section>
<section class="pv-section">
  <div class="pv-section__title">Complete form</div>
  <form class="ds-form">
    <div class="ds-form__field">
      <label class="ds-form__label">Name <span class="ds-form__required">*</span></label>
      <input class="ds-input ds-input--medium" />
      <span class="ds-form__feedback ds-form__feedback--success">✓ Available</span>
    </div>
    <div class="ds-form__field">
      <label class="ds-form__label">Email <span class="ds-form__required">*</span></label>
      <input class="ds-input ds-input--medium ds-input--error" />
      <span class="ds-form__feedback ds-form__feedback--error">✕ Invalid email</span>
    </div>
  </form>
</section>
```

**强制规则**：
- 展示 default + focus + disabled + error 状态
- 完整表单至少 3 个 field，含 1 个成功反馈 + 1 个错误反馈

---

## 3. data 模板

**适用组件**：table / data-table / list / descriptions / tree / tree-select / statistic / thing / timeline / calendar / heatmap / equation / list / ellipsis

**DOM 契约**：表格（≥ 5 行）/ 列表（≥ 5 项）/ 网格 / 树形 / 时间线

**典型 markup**（table 风格）：

```html
<section class="pv-section">
  <div class="pv-section__title">Striped + hover</div>
  <div class="ds-table-wrap">
    <table class="ds-table ds-table--striped">
      <thead>
        <tr><th>Name</th><th>Status</th><th>Owner</th><th>Updated</th></tr>
      </thead>
      <tbody>
        <tr>
          <td>Marketing site</td>
          <td><span class="ds-tag ds-tag--success ds-tag--small">Active</span></td>
          <td>Alice</td>
          <td class="text-secondary">2h ago</td>
        </tr>
        <!-- 至少 5 行 -->
      </tbody>
    </table>
  </div>
</section>
```

**典型 markup**（list 风格）：

```html
<section class="pv-section">
  <div class="pv-section__title">List with avatars</div>
  <ul class="ds-list">
    <li class="ds-list-item">
      <span class="ds-avatar ds-avatar--medium ds-avatar--primary">A</span>
      <div>
        <div class="ds-list-item__title">Project Alpha</div>
        <div class="ds-list-item__meta text-secondary">Updated 2h ago</div>
      </div>
    </li>
    <!-- 至少 5 项 -->
  </ul>
</section>
```

**典型 markup**（descriptions 风格）：

```html
<section class="pv-section">
  <div class="pv-section__title">Descriptions</div>
  <dl class="ds-descriptions">
    <dt class="ds-descriptions__label">Name</dt>
    <dd class="ds-descriptions__value">Marketing site redesign</dd>
    <!-- 至少 5 行 -->
  </dl>
</section>
```

**强制规则**：
- 表格 / 列表 ≥ **5 行/项**
- 表格至少 1 列用 tag / status 显示
- descriptions ≥ 5 行
- calendar / heatmap 用 mock 月数据

---

## 4. feedback 模板

**适用组件**：alert / dialog / drawer / message / notification / popover / popconfirm / tooltip / spin / skeleton / result / progress / loading-bar / empty / watermark / modal / popselect

**DOM 契约**：状态行 + 弹出层 + 加载态

**典型 markup**（alert 风格）：

```html
<section class="pv-section">
  <div class="pv-section__title">Status variants</div>
  <div class="stack-12">
    <div class="ds-alert ds-alert--info">ℹ Info message</div>
    <div class="ds-alert ds-alert--success">✓ Success message</div>
    <div class="ds-alert ds-alert--warning">⚠ Warning message</div>
    <div class="ds-alert ds-alert--error">✕ Error message</div>
  </div>
</section>
```

**典型 markup**（dialog 风格）：

```html
<section class="pv-section">
  <div class="pv-section__title">Modal (static preview)</div>
  <div class="ds-dialog-overlay">
    <div class="ds-dialog">
      <div class="ds-dialog__header"><span class="ds-dialog__title">Title</span></div>
      <div class="ds-dialog__body">Content</div>
      <div class="ds-dialog__footer">
        <button class="ds-btn ds-btn--default ds-btn--medium">Cancel</button>
        <button class="ds-btn ds-btn--primary ds-btn--medium">OK</button>
      </div>
    </div>
  </div>
</section>
```

**典型 markup**（progress 风格）：

```html
<section class="pv-section">
  <div class="pv-section__title">Progress</div>
  <div class="stack-12">
    <div class="ds-progress"><div class="ds-progress__rail"><div class="ds-progress__indicator" style="width: 45%"></div></div></div>
    <div class="ds-progress"><div class="ds-progress__rail"><div class="ds-progress__indicator ds-progress__indicator--success" style="width: 100%"></div></div></div>
    <div class="ds-progress"><div class="ds-progress__rail"><div class="ds-progress__indicator ds-progress__indicator--warning" style="width: 70%"></div></div></div>
  </div>
</section>
```

**强制规则**：
- alert/message/notification 必须展示 **4 种 status**
- progress 必须展示 default + success + warning + error 4 种颜色

---

## 5. navigation 模板

**适用组件**：menu / tabs / steps / breadcrumb / pagination / dropdown / anchor / page-header / back-top / affix

**DOM 契约**：横/竖菜单 + 选中态指示器

**典型 markup**（menu 风格）：

```html
<section class="pv-section">
  <div class="pv-section__title">Horizontal menu</div>
  <nav class="ds-menu ds-menu--horizontal">
    <div class="ds-menu__item ds-menu__item--active">Home</div>
    <div class="ds-menu__item">Products</div>
    <div class="ds-menu__item">Pricing</div>
    <div class="ds-menu__item">Docs</div>
  </nav>
</section>
<section class="pv-section">
  <div class="pv-section__title">Vertical menu</div>
  <nav class="ds-menu ds-menu--vertical">
    <div class="ds-menu__item ds-menu__item--active">Dashboard</div>
    <!-- 4+ items -->
  </nav>
</section>
```

**典型 markup**（tabs 风格）：

```html
<section class="pv-section">
  <div class="ds-tabs">
    <div class="ds-tabs__bar ds-tabs__bar--line">
      <div class="ds-tabs__item ds-tabs__item--active">Overview</div>
      <div class="ds-tabs__item">Activity</div>
      <div class="ds-tabs__item">Settings</div>
    </div>
    <div class="ds-tabs__pane">Pane content</div>
  </div>
</section>
```

**强制规则**：
- 至少 4 项，含 active 态
- menu 必须同时展示 horizontal + vertical
- tabs 必须有 active + pane

---

## 6. general 模板

**适用组件**：icon / icon-wrapper / badge / tag / divider

**DOM 契约**：简单集合展示

**典型 markup**：

```html
<section class="pv-section">
  <div class="pv-section__title">Tags</div>
  <div class="row" style="gap: var(--spacer-8);">
    <span class="ds-tag ds-tag--default">Default</span>
    <span class="ds-tag ds-tag--primary">Primary</span>
    <span class="ds-tag ds-tag--info">Info</span>
    <span class="ds-tag ds-tag--success">Success</span>
    <span class="ds-tag ds-tag--warning">Warning</span>
    <span class="ds-tag ds-tag--error">Error</span>
  </div>
</section>
<section class="pv-section">
  <div class="pv-section__title">Badges</div>
  <div class="row" style="gap: var(--spacer-16);">
    <div class="ds-badge-wrap">
      <button class="ds-btn ds-btn--default ds-btn--medium">Inbox</button>
      <span class="ds-badge__sup ds-badge__sup--error">5</span>
    </div>
    <!-- 4+ variants -->
  </div>
</section>
<section class="pv-section">
  <div class="pv-section__title">Divider</div>
  <div class="ds-divider"></div>
  <div class="ds-divider ds-divider--vertical"></div>
</section>
```

---

## 7. layout 模板

**适用组件**：layout / grid / space / flex / page-header / collapse-transition / split

**DOM 契约**：容器 + 网格 + 间距

**典型 markup**：

```html
<section class="pv-section">
  <div class="pv-section__title">Grid (3 cols)</div>
  <div class="ds-grid ds-grid--3">
    <div class="ds-atom-card">Col 1</div>
    <div class="ds-atom-card">Col 2</div>
    <div class="ds-atom-card">Col 3</div>
  </div>
</section>
<section class="pv-section">
  <div class="pv-section__title">Flex (space-between)</div>
  <div class="ds-flex ds-flex--justify-between ds-flex--align-center">
    <span>Left</span>
    <span>Right</span>
  </div>
</section>
<section class="pv-section">
  <div class="pv-section__title">Space (vertical, 16)</div>
  <div class="ds-space ds-space--vertical ds-space--16">
    <div>Item 1</div>
    <div>Item 2</div>
  </div>
</section>
```

**强制规则**：
- grid 至少展示 2 列布局
- space 必须展示 1 个 vertical + 1 个 horizontal

---

## 8. special 模板（领域专用）

**适用组件**：upload / code / typography / marquee / qr-code / equation / infinite-scroll / virtual-list / scrollbar / slider / rate / switch / radio / checkbox / highlight / number-animation / float-button / float-button-group / log / countdown / image / collapse

每个特殊组件**单独写一个迷你模板**。以下是重点 8 个：

### 8.1 upload

```html
<section class="pv-section">
  <div class="pv-section__title">Upload (button)</div>
  <div class="ds-upload ds-upload--text">
    <button class="ds-btn ds-btn--default ds-btn--medium">
      <span>Click to upload</span>
    </button>
  </div>
</section>
<section class="pv-section">
  <div class="pv-section__title">Upload (drag & drop)</div>
  <div class="ds-upload ds-upload--drag">
    <div class="ds-upload__trigger">
      <div class="ds-upload__icon">⇪</div>
      <div class="ds-upload__text">Drag file here or click to upload</div>
    </div>
  </div>
</section>
```

### 8.2 code

```html
<section class="pv-section">
  <div class="pv-section__title">Inline code</div>
  <p>Use <code class="ds-code-inline">var(--primaryColor)</code> for token.</p>
</section>
<section class="pv-section">
  <div class="pv-section__title">Code block</div>
  <pre class="ds-code-block"><code>.btn { background: var(--primaryColor); }</code></pre>
</section>
```

### 8.3 typography

```html
<section class="pv-section">
  <div class="ds-typo">
    <h1>h1. Heading</h1>
    <h2>h2. Heading</h2>
    <h3>h3. Heading</h3>
    <h4>h4. Heading</h4>
    <h5>h5. Heading</h5>
    <h6>h6. Heading</h6>
    <p>Body paragraph with <strong>strong</strong>, <em>em</em>, <a href="#">link</a>.</p>
    <ul><li>List item 1</li><li>List item 2</li></ul>
    <blockquote>Blockquote</blockquote>
  </div>
</section>
```

### 8.4 qr-code

```html
<section class="pv-section">
  <div class="pv-section__title">QR Code</div>
  <div class="ds-qrcode">
    <div class="ds-qrcode__placeholder">
      <div class="ds-qrcode__pattern"></div>
    </div>
    <p class="ds-qrcode__caption">Scan to verify</p>
  </div>
</section>
```

（实际 QR pattern 用 CSS grid 16x16 黑白色块模拟；真实场景由 JS 库生成。）

### 8.5 slider

```html
<section class="pv-section">
  <div class="pv-section__title">Slider</div>
  <div class="ds-slider">
    <div class="ds-slider__track">
      <div class="ds-slider__fill" style="width: 40%"></div>
      <div class="ds-slider__thumb" style="left: 40%"></div>
    </div>
  </div>
</section>
<section class="pv-section">
  <div class="pv-section__title">Range slider</div>
  <div class="ds-slider ds-slider--range">
    <div class="ds-slider__track">
      <div class="ds-slider__fill" style="left: 20%; width: 40%"></div>
      <div class="ds-slider__thumb" style="left: 20%"></div>
      <div class="ds-slider__thumb" style="left: 60%"></div>
    </div>
  </div>
</section>
```

### 8.6 rate

```html
<section class="pv-section">
  <div class="pv-section__title">Rate</div>
  <div class="ds-rate">
    <span class="ds-rate__star ds-rate__star--filled">★</span>
    <span class="ds-rate__star ds-rate__star--filled">★</span>
    <span class="ds-rate__star ds-rate__star--filled">★</span>
    <span class="ds-rate__star">★</span>
    <span class="ds-rate__star">★</span>
  </div>
  <div class="ds-rate">
    <span class="ds-rate__star ds-rate__star--half">★</span>
    <!-- half stars -->
  </div>
</section>
```

### 8.7 color-picker

```html
<section class="pv-section">
  <div class="pv-section__title">Color picker</div>
  <div class="ds-color-picker">
    <div class="ds-color-picker__swatch" style="background: var(--primaryColor);"></div>
    <input class="ds-color-picker__input" value="#63e2b7" />
    <div class="ds-color-picker__panel">
      <div class="ds-color-picker__hue"></div>
      <div class="ds-color-picker__alpha"></div>
      <div class="ds-color-picker__presets">
        <button style="background: #63e2b7"></button>
        <button style="background: #70c0e8"></button>
        <button style="background: #f2c97d"></button>
        <button style="background: #e88080"></button>
      </div>
    </div>
  </div>
</section>
```

### 8.8 infinite-scroll / virtual-list

```html
<section class="pv-section">
  <div class="pv-section__title">Infinite scroll list</div>
  <div class="ds-infinite-scroll" style="height: 240px; overflow-y: auto;">
    <!-- mock items -->
    <div class="ds-list-item">Item 1</div>
    <div class="ds-list-item">Item 2</div>
    ...
    <div class="ds-infinite-scroll__trigger">Loading...</div>
  </div>
</section>
```

---

## 模板选择决策表

按 source-brief 中每个组件的 `renderCategory` 字段：

| renderCategory | 适用组件 |
|---|---|
| `button` | button, button-group, pagination, segmented-control |
| `form` | input, input-number, input-otp, textarea, select, cascader, tree-select, auto-complete, date-picker, time-picker, color-picker, mention, form, dynamic-input, dynamic-tags |
| `data` | table, data-table, list, descriptions, statistic, thing, timeline, calendar, heatmap, equation, ellipsis |
| `feedback` | alert, dialog, drawer, message, notification, popover, popconfirm, tooltip, spin, skeleton, result, progress, loading-bar, empty, watermark, modal, popselect |
| `navigation` | menu, tabs, steps, breadcrumb, dropdown, anchor, page-header, back-top, affix |
| `general` | icon, icon-wrapper, badge, tag, divider |
| `layout` | layout, grid, space, flex, collapse-transition, split |
| `special` | upload, code, typography, marquee, qr-code, infinite-scroll, virtual-list, scrollbar, slider, rate, switch, radio, checkbox, highlight, number-animation, float-button, float-button-group, log, countdown, image, collapse, transfer, legacy-transfer, avatar-group, gradient-text, equation |

---

## 通用预览 HTML 框架（所有模板共用）

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>{Name}</title>
  <link rel="stylesheet" href="../colors_and_type.css" />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&display=swap" />
  <link rel="stylesheet" href="../components.css" />
  <style>
    /* ── preview-page chrome (preview-only) ─────────────────── */
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body { background: var(--bodyColor); color: var(--textColor1); font-family: var(--fontFamily); font-size: var(--fontSizeMedium); line-height: var(--lineHeightMedium); min-height: 100%; }
    body { padding: var(--spacer-32); }
    .pv-header { margin-bottom: var(--spacer-32); padding-bottom: var(--spacer-16); border-bottom: 1px solid var(--dividerColor); }
    .pv-header h1 { font-size: var(--heading-lg-font-size); font-weight: var(--heading-base-font-weight); margin-bottom: var(--spacer-4); }
    .pv-header p { color: var(--textColor2); font-size: var(--fontSizeSmall); }
    .pv-section { margin-bottom: var(--spacer-32); }
    .pv-section__title { font-size: var(--heading-sm-font-size); font-weight: var(--heading-base-font-weight); margin-bottom: var(--spacer-12); color: var(--textColor1); }

    /* @component-css-start */
    /* ===== {Name} ===== */
    /* ... 组件 CSS ... */
    /* @component-css-end */
  </style>
</head>
<body>
  <header class="pv-header">
    <h1>{Name}</h1>
    <p>{description}</p>
  </header>
  <section class="pv-section">
    <!-- ... 组件 markup ... -->
  </section>
</body>
</html>
```
