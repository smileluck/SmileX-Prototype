# SmileX Prototype

HTML 原型管理与展示平台。导入需求文档后，系统生成可交互的 HTML 原型，支持标注、预览、导出。

## 前置条件

### Node.js 安装

本项目需要 **Node.js 18+**。推荐使用 LTS 版本。

**Windows：**

```bash
# 方式一：winget（推荐）
winget install OpenJS.NodeJS.LTS

# 方式二：从官网下载安装包
# https://nodejs.org/ → 下载 LTS 版本 MSI 安装包，双击安装
```

**macOS：**

```bash
# 方式一：Homebrew（推荐）
brew install node@22

# 方式二：从官网下载安装包
# https://nodejs.org/ → 下载 LTS 版本 PKG 安装包，双击安装

# 方式三：nvm（方便管理多版本）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install --lts
```

**Linux：**

```bash
# Ubuntu / Debian
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora / RHEL
curl -fsSL https://rpm.nodesource.com/setup_22.x | sudo bash -
sudo dnf install -y nodejs

# 通用方式：nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
nvm install --lts
```

安装后重启终端，确认版本：

```bash
node -v      # 应显示 v18+ 或更高
npm -v       # 应显示 9+ 或更高
```

## 快速开始

```bash
npm install          # 安装依赖（必要）
npm run dev          # 启动开发服务器 → http://localhost:5173
npm run share        # 启动开发服务器 + 生成外网访问链接（cloudflared）
npm run build        # 构建
```

`npm run share` 会在终端输出一个 `https://xxx.trycloudflare.com` 地址，发给他人即可在线查看原型。

**前置条件 — 安装 cloudflared：**

```bash
# Windows
winget install Cloudflare.cloudflared

# macOS
brew install cloudflared

# Linux
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64 -o /usr/local/bin/cloudflared && chmod +x /usr/local/bin/cloudflared
```

安装后重启终端，确认 `cloudflared --version` 可执行。

## AI 工作流

本项目内置 AI 技能（位于 `.agents/skills/`），用于与 AI 编程助手协作生成、审查、标注原型。

> **本项目不绑定任何特定 AI 工具。** 技能是通用的 Markdown 指令文件，任何能读取项目文件的 AI 编程助手都可以使用——Claude Code、Kimi Code、Cursor、GitHub Copilot、Windsurf、Trae 等均可，不限于 Claude。

### 工作原理

```
AGENTS.md                        # 项目级指令文件（开放标准，绝大多数 AI 工具自动读取）
CLAUDE.md                        # 仅一行 @AGENTS.md 引用，用于兼容 Claude Code，不代表只能使用 Claude
.agents/skills/<name>/SKILL.md   # 技能定义：描述 AI 应执行的完整流程与产出规范
```

### 如何使用

**支持技能 / 斜杠命令的工具**（如 Claude Code、Kimi Code）——直接输入技能命令：

```
/prototype-review create docs/robot-requirements.md
```

**其他 AI 工具**（Cursor、Copilot、Windsurf 等）——用自然语言描述需求即可，AI 读取 `AGENTS.md` 与对应 `SKILL.md` 后会自动按技能流程执行：

```
根据 docs/robot-requirements.md 创建一个原型
审查 robot-mgmt-v2 这个原型并补全标注
```

如果 AI 没有自动加载技能，可在对话中直接引用技能文件：

```
请按照 .agents/skills/prototype-review/SKILL.md 的流程，根据 docs/robot-requirements.md 创建原型
```

### 内置技能

| 技能 | 用途 |
|------|------|
| `prototype-review` | 需求文档 → 原型 HTML + 标注 + SRS + 用户手册；或审查已有原型并补全 |
| `design-library-creator` | 从任意 UI 来源（源码 / 网站 / 图片 / 组件库）生成设计系统包 |

### 方向一：需求文档 → 原型 HTML + 标注

从需求文档出发，AI 自动生成完整原型（HTML + 标注 + 流程图 + SRS + 用户手册）。

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
5. 生成软件需求规格说明书（SRS）与用户手册

生成的文件结构：
```
website/<project-slug>/
  index.html      # 原型 HTML
  index.json      # 元数据 + 标注
  srs.md          # 软件需求规格说明书
  handbook.md     # 用户手册
  images/         # 流程图（Mermaid .md）
```

### 方向二：原型 HTML → 需求文档 + 标注

从已有原型 HTML 出发，AI 倒推需求描述并补全标注。

**用法：**

```
/prototype-review <slug>                   # 审查原型，输出差距报告
/prototype-review <slug> --annotate        # 审查 + 自动补全标注
/prototype-review <slug> --flows           # 审查 + 制作流程图
/prototype-review <slug> --full            # 审查 + 标注 + 流程图 + SRS + 手册 + 模拟数据补全
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
    srs.md                         # 软件需求规格说明书
    handbook.md                    # 用户手册
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
