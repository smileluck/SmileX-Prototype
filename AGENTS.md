# AGENTS.md — SmileX Prototype 项目规范

## 项目概述

SmileX Prototype 是一个 HTML 原型管理与展示平台。用户导入需求文档后，系统生成/管理可交互的 HTML 原型，支持标注、预览、导出。

## 技能

- **prototype-review** (`.claude/skills/prototype-review/SKILL.md`) — 根据需求创建/审查 HTML 原型
  - 当用户提供需求文档要求创建原型、分析需求生成 HTML、审查原型完整性时，invoke the Skill tool with `skill: "prototype-review"` before doing anything else.
  - 当用户明确输入 `/prototype-review` 时，同样 invoke the Skill tool with `skill: "prototype-review"`.

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
  utils/export.ts                  # JSON 下载、文件读取
  utils/id.ts                      # nanoid
```

## 数据流

```
website/{slug}/          →  Vite middleware  →  /api/projects/:slug  →  storage.ts  →  React 组件
  index.html                  (vite.config.ts)     (GET/POST/DELETE)
  index.json
  images/
```

- **读取**：`GET /api/projects` 扫描 `website/*/index.json` 返回列表；`GET /api/projects/:slug` 返回 index.json + index.html
- **写入**：`POST /api/projects/:slug` 写 index.html + index.json
- **删除**：`DELETE /api/projects/:slug` 删除整个目录

## 关键类型

```typescript
interface Prototype {
  id: string              // 英文 slug，对应 website/ 下的目录名
  name: string            // 中文显示名
  prompt: string          // 需求摘要或原始需求文本
  generatedCode: string   // 原型 HTML 全文
  annotations: Annotation[]
  mode: 'prototype' | 'preview'
  createdAt: number
  updatedAt: number
}

interface Annotation {
  id: string
  markerNumber: number
  x: number               // 0~1 相对比例
  y: number               // 0~1 相对比例
  description: string     // 标注说明
  createdAt: number
  updatedAt: number
}
```

## 文件存储结构

```
website/{slug}/
  index.html      # 单文件 HTML 原型（CSS+JS 内联，模拟数据，无外部依赖）
  index.json      # { slug, name, prompt, annotations, mode, createdAt, updatedAt }
  images/         # 流程图等图片（flow-auth.png, flow-core.png 等）
```

## 平台边界

- **平台负责**：项目管理、标注工具、预览模式、导入导出、流程图工具
- **原型负责**：业务页面 UI、交互逻辑、模拟数据、导航表单
- 原型在 `<iframe sandbox="allow-scripts allow-same-origin">` 中渲染，不依赖平台 JS

## 原型 HTML 规范

- 单文件自包含：CSS 在 `<style>`，JS 在 `<script>`
- 页面切换：`<div class="page-section" id="page-xxx">` + `display` 控制
- 模拟数据：覆盖所有分支状态（正常/异常/边界值/空状态）
- 所有按钮有交互反馈（至少 Toast）
- 表单有基础验证（必填、字数限制、禁用条件）
- 无外部 API 调用

## 开发命令

```bash
npm run dev       # 启动 Vite 开发服务器（含 /api 中间件）
npm run build     # TypeScript 编译 + Vite 构建
```
