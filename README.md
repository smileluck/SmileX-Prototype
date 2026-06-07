# SmileX Prototype

HTML 原型管理与展示平台。导入需求文档后，系统生成可交互的 HTML 原型，支持标注、预览、导出。

## 快速开始

```bash
npm install
npm run dev          # 启动开发服务器 → http://localhost:5173
npm run share        # 启动开发服务器 + 生成外网访问链接（localtunnel）
npm run build        # 构建
```

`npm run share` 会在终端输出一个 `https://xxx.trycloudflare.com` 地址，发给他人即可在线查看原型。

## AI 工作流

本项目使用 Claude Code 的 `/prototype-review` 技能与 AI 协作，支持两个方向的工作流。

### 方向一：需求文档 → 原型 HTML + 标注

从需求文档出发，AI 自动生成完整原型（HTML + 标注 + 流程图）。

**用法：**

```
/prototype-review create <需求文件路径>
/prototype-review create <需求文件路径> --name <项目名>
```

**示例：**

```
/prototype-review create docs/robot-requirements.md
/prototype-review create docs/robot-requirements.md --name 机器人管理
```

**AI 会自动完成：**
1. 分析需求文档，提取页面清单、功能点、数据结构、业务流程
2. 生成单文件 HTML 原型（CSS + JS 内联，模拟数据覆盖所有状态）
3. 为每个按钮、弹窗、Tab、表单生成标注（CSS 选择器定位）
4. 制作 Mermaid 流程图（认证、核心流程、状态机、异常处理）

生成的文件结构：
```
website/<project-slug>/
  index.html      # 原型 HTML
  index.json      # 元数据 + 标注
  images/         # 流程图（Mermaid .md）
```

### 方向二：原型 HTML → 需求文档 + 标注

从已有原型 HTML 出发，AI 倒推需求描述并补全标注。

**用法：**

```
/prototype-review <slug>                   # 审查原型，输出差距报告
/prototype-review <slug> --annotate        # 审查 + 自动补全标注
/prototype-review <slug> --flows           # 审查 + 制作流程图
/prototype-review <slug> --full            # 审查 + 标注 + 流程图 + 模拟数据补全
```

**示例：**

```
/prototype-review robot-mgmt-v2
/prototype-review robot-mgmt-v2 --annotate
/prototype-review robot-mgmt-v2 --full
```

**AI 会分析原型并输出：**
- 页面完整性检查（是否遗漏 `data-page-name`、`pageNames` 等）
- 功能点逐项对照（按钮、弹窗、表单验证）
- 标注覆盖率报告（按钮覆盖率 > 90%、弹窗零遗漏）
- z-index 合规检查（标注保留层 199–200 未被占用）
- 模拟数据覆盖检查（多状态、异常、空状态）
- 桥接导航兼容性检查（iframe 页面切换是否正常）

**倒推需求的做法：** 将 `--full` 审查的报告作为需求文档的基础，AI 在审查过程中会完整枚举原型的所有功能点和交互逻辑，等同于生成了一份逆向需求规格说明。

## 项目结构

```
src/
  App.tsx                          # 主入口
  types/index.ts                   # Prototype, Annotation 类型定义
  services/storage.ts              # API 层（/api/projects CRUD）
  hooks/usePrototype.ts            # 原型状态管理
  hooks/useAnnotations.ts          # 标注状态管理
  components/
    layout/                        # 顶栏、三栏布局
    sidebar/                       # 项目列表、标注列表
    prototype/                     # SandboxRenderer（iframe 渲染）、AnnotationOverlay
    annotation/                    # 标注条目、标注钉
    shared/                        # 空状态、加载态
website/                           # 原型数据存储
  {slug}/
    index.html                     # 单文件 HTML 原型
    index.json                     # 元数据 + 标注
    images/                        # 流程图
```

## 数据流

```
website/{slug}/ → Vite 中间件 → /api/projects/:slug → React 组件
```

- `GET /api/projects` — 列表
- `GET /api/projects/:slug` — 读取原型 + 元数据
- `POST /api/projects/:slug` — 保存
- `DELETE /api/projects/:slug` — 删除

## 技术栈

React 19 + TypeScript + Vite + Tailwind CSS 4 + DaisyUI 5
