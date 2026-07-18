# AGENTS.md — SmileX Prototype 项目规范

## 项目概述

SmileX Prototype 是一个 HTML 原型管理与展示平台。用户导入需求文档后，系统生成/管理可交互的 HTML 原型，支持标注、预览、导出。

## 技能

- **prototype-review** (`.agents/skills/prototype-review/SKILL.md`) — 根据需求创建/审查 HTML 原型
  - 当用户提供需求文档要求创建原型、分析需求生成 HTML、审查原型完整性时，invoke the Skill tool with `skill: "prototype-review"` before doing anything else.
  - 当用户明确输入 `/prototype-review` 时，同样 invoke the Skill tool with `skill: "prototype-review"`.
- **design-library-creator** (`.agents/skills/design-library-creator/SKILL.md`) — 从任意 UI 来源（本地源码 / 网站 / 图片 / 主流组件库）解析并生成符合 Trae Design 契约的设计系统包
  - 当用户希望基于某个 UI 风格/组件库/截图/网站生成一套独立的设计系统（tokens + components + ui_kits）时，invoke the Skill tool with `skill: "design-library-creator"` before doing anything else.
  - 子命令：`design-library-creator`（主）/ `refine-library` / `expand-components` / `generate-additional-kit`。
  - 只读参考：`references/trae-ui-example/`（Nimbus Core 样例，已嵌入技能内）；产出到 `./design-systems/{name}/`。

## 项目结构

```
src/
  App.tsx                          # 主入口，项目列表 + 预览 + 导入导出
  types/index.ts                   # Prototype, Annotation 接口
  services/storage.ts              # 通过 /api/projects 读写 website/ 文件
  hooks/usePrototype.ts            # 原型 CRUD 状态管理
  hooks/useAnnotations.ts          # 标注 CRUD
  components/
    layout/Header.tsx              # 顶栏：模式切换（原型/预览）
    layout/MainLayout.tsx          # 三栏布局
    sidebar/ProjectList.tsx        # 左侧项目列表
    sidebar/AnnotationSidebar.tsx  # 右侧标注列表
    prototype/PrototypeView.tsx    # 标注模式容器
    prototype/SandboxRenderer.tsx  # iframe 渲染原型 HTML
    prototype/AnnotationOverlay.tsx # 标注点覆盖层
    annotation/AnnotationItem.tsx  # 标注条目
    annotation/MarkerPin.tsx       # 标注钉
    shared/EmptyState.tsx          # 空状态
    shared/LoadingSpinner.tsx      # 加载态
    documents/DocumentsModal.tsx   # SRS/手册文档查看
  utils/export.ts                  # JSON 下载、文件读取
  utils/id.ts                      # nanoid
```

## 数据流

```
website/{slug}/          →  Vite middleware  →  /api/projects/:slug  →  storage.ts  →  React 组件
  index.html                  (vite.config.ts)     (GET/POST/DELETE)
  index.json
  srs.md
  handbook.md
  images/
```

- **读取**：`GET /api/projects` 扫描 `website/*/index.json` 返回列表；`GET /api/projects/:slug` 返回 index.json + index.html + hasSrs + hasHandbook
- **写入**：`POST /api/projects/:slug` 写 index.html + index.json
- **删除**：`DELETE /api/projects/:slug` 删除整个目录
- **文档**：`GET /api/projects/:slug/srs.md` 返回需求规格说明书；`GET /api/projects/:slug/handbook.md` 返回用户手册

## 关键类型

```typescript
interface Prototype {
  id: string              // 英文 slug，对应 website/ 下的目录名
  name: string            // 中文显示名
  prompt: string          // 需求摘要或原始需求文本
  generatedCode: string   // 原型 HTML 全文
  annotations: Annotation[]
  mode: 'prototype' | 'preview'
  hasSrs?: boolean        // 是否有需求规格说明书
  hasHandbook?: boolean   // 是否有用户手册
  createdAt: number
  updatedAt: number
}

interface Annotation {
  id: string
  markerNumber: number
  selector: string        // CSS 选择器，平台通过 querySelector 定位目标元素放置 marker（不支持 x/y 坐标）
  description: string     // 标注说明
  scope: 'global' | 'page' // 通用型（跨页面元素如侧边栏/头部）或页面型
  page?: string           // 归属页面 ID（如 "map"、"loginPage"），scope === 'page' 时必填
  createdAt: number
  updatedAt: number
}

interface PageInfo {
  id: string              // 页面标识
  name: string            // 页面显示名
}
```

## 文件存储结构

```
website/{slug}/
  index.html      # 单文件 HTML 原型（CSS+JS 内联，模拟数据，无外部依赖）
  index.json      # { slug, name, prompt, annotations, mode, createdAt, updatedAt }
  srs.md          # 软件需求规格说明书（prototype-review 技能生成）
  handbook.md     # 用户手册（prototype-review 技能生成）
  images/         # 流程图等图片（flow-auth.md, flow-core.md 等）
```

## 平台边界

- **平台负责**：项目管理、标注工具、预览模式、导入导出、流程图工具
- **原型负责**：业务页面 UI、交互逻辑、模拟数据、导航表单
- 原型在 `<iframe sandbox="allow-scripts allow-same-origin allow-forms">` 中渲染，通过桥接脚本与平台通信（页面发现、导航、标注定位）

## 原型 HTML 规范

- 单文件自包含：CSS 在 `<style>`，JS 在 `<script>`
- 页面切换：`<div class="page-section" id="page-xxx">` + `display` 控制
- 模拟数据：覆盖所有分支状态（正常/异常/边界值/空状态）
- 所有按钮有交互反馈（至少 Toast）
- 表单有基础验证（必填、字数限制、禁用条件）
- 无外部 API 调用

### 页面识别规范（标注分页必需）

平台通过注入桥接脚本自动发现原型页面。为确保标注按页分组正确，原型 HTML 需遵循以下规范：

**标准页面（主功能区）：**
```html
<div class="page-section active" id="page-map">...</div>
<div class="page-section" id="page-robots">...</div>
```
- 使用 `.page-section` 类 + `id="page-{slug}"` 命名
- 通过切换 `.active` class 控制可见性
- 页面名称优先级：`data-page-name` 属性 > JS 中 `pageNames` 对象 > 导航项 `.nav-item[data-page]` 文本 > slug

**独立页面（登录页等）：**
```html
<div id="loginPage" data-page-name="登录页">...</div>
```
- 作为 `<body>` 直接子元素，不使用 `.page-section` 类
- **必须添加 `data-page-name` 属性**指定中文显示名
- 通过 `style.display` 控制显隐
- ID 建议以 `Page` 结尾以便自动发现

**完整示例：**
```html
<body>
  <div id="loginPage" data-page-name="登录页">
    <!-- 登录表单 -->
  </div>
  <div id="app" style="display: none;">
    <div class="page-section active" id="page-map">...</div>
    <div class="page-section" id="page-task">...</div>
  </div>
  <script>
    const pageNames = { 'map': '地图管理', 'task': '任务管理' };
    function showPage(page) { /* 切换 active class */ }
  </script>
</body>
```

## 开发命令

```bash
npm run dev       # 启动 Vite 开发服务器（含 /api 中间件）
npm run build     # TypeScript 编译 + Vite 构建
```