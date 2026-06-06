---
name: prototype-review
description: "根据需求文档创建 HTML 原型，或对比需求文档与已有原型进行审查/完善/标注/流程图制作。当用户提供需求文档要求创建原型、分析需求生成 HTML、根据HTML生成标注、审查原型完整性时自动生效，不仅限于 /prototype-review 命令。"
---

# /prototype-review

根据需求文档创建 HTML 原型，或对已有原型进行审查、完善、标注、流程图制作。

## Usage

```
/prototype-review create <需求文件路径>                    # 根据需求文档创建新原型
/prototype-review create <需求文件路径> --name <项目名>     # 指定项目名（默认从需求提取）
/prototype-review <slug>                                   # 审查已有原型与需求的差距
/prototype-review <slug> --annotate                        # 审查并自动添加标注
/prototype-review <slug> --flows                           # 审查并制作流程图
/prototype-review <slug> --full                            # 审查 + 标注 + 流程图 + 模拟数据补全
```

---

## 模式 A：根据需求创建原型

### Phase 1: 需求分析
1. 读取需求文档（md/txt/doc/pdf）
2. 提取以下信息：
   - **页面清单**：所有需要实现的页面/视图，包括独立页面（登录、欢迎等）
   - **功能点表**：每个模块的功能、操作步骤、交互说明
   - **数据结构**：涉及的数据实体和字段
   - **角色权限**：不同角色看到的不同内容
   - **业务流程**：核心流程、异常流程、自动化流程
   - **非功能性需求**：技术约束、接口要求、部署要求
3. 生成项目 slug（英文，从需求标题提取）

### Phase 2: 项目创建
1. 创建 `website/{slug}/` 目录
2. 生成 `index.json`（项目信息，prompt 存放需求摘要）
3. 生成 `index.html`（原型 HTML）

### Phase 3: 原型 HTML 生成规则

#### 页面结构（严格遵循）

**HTML 骨架必须如下：**

```html
<body>
  <!-- 独立页面：登录/欢迎等，必须带 data-page-name -->
  <div id="loginPage" data-page-name="登录页">
    <!-- 登录表单内容 -->
  </div>

  <!-- 主应用容器 -->
  <div id="app" style="display: none;">
    <!-- 侧边栏导航 -->
    <aside class="sidebar">
      <div class="nav-item active" data-page="map" onclick="showPage('map')">地图管理</div>
      <div class="nav-item" data-page="robots" onclick="showPage('robots')">机器人列表</div>
      <!-- ... -->
    </aside>

    <!-- 每个功能模块对应一个 page-section -->
    <div class="page-section active" id="page-map">...</div>
    <div class="page-section" id="page-robots">...</div>
    <!-- ... -->
  </div>

  <script>
    // 页面名称映射（平台桥接脚本依赖此变量）
    const pageNames = {
      'map': '地图管理',
      'robots': '机器人列表',
      // ...
    };

    function showPage(page) {
      document.querySelectorAll('.page-section').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
      document.getElementById('page-' + page).classList.add('active');
      document.querySelector('.nav-item[data-page="' + page + '"]').classList.add('active');
      document.getElementById('pageTitle').textContent = pageNames[page];
    }
  </script>
</body>
```

**页面识别规范（标注分页必需）：**

| 页面类型 | 要求 | 示例 |
|---------|------|------|
| 标准功能区 | `.page-section` 类 + `id="page-{slug}"` | `<div class="page-section" id="page-map">` |
| 独立页面 | `<body>` 直接子元素 + `data-page-name` 属性 | `<div id="loginPage" data-page-name="登录页">` |
| 登录页 | **必须**加 `data-page-name="登录页"` | 见上 |
| 弹窗/对话框 | **不要**作为 page-section，用 modal overlay | `<div class="modal-overlay">` |

**页面名称优先级**：`data-page-name` 属性 > `pageNames` JS 对象 > `.nav-item` 导航文本 > ID

**强制要求：**
- 独立页面（登录等）**必须**添加 `data-page-name` 属性
- JS 中**必须**定义 `pageNames` 对象，覆盖所有 `.page-section` 页面的中文名
- 默认活动页加 `.active` class
- 登录→主应用的切换用 `style.display` 控制

#### 样式规范
- 所有 CSS 在 `<style>` 标签内
- 使用 CSS 变量统一颜色：`--primary`, `--secondary`, `--warning`, `--danger`
- 卡片圆角 16px，阴影 `0 2px 12px rgba(0,0,0,0.08)`
- 按钮 `padding: 12px 24px; border-radius: 10px`
- 页面切换动画：`.page-section.active { display: block; animation: fadeIn 0.4s ease; }`
- 页面隐藏：`.page-section { display: none; }`

#### 模拟数据要求
**关键原则**：如果需求中存在不同分支/状态，模拟数据必须覆盖所有情况：
- **多状态同时展示**：任务列表同时出现"待执行""执行中""已完成""已失败"
- **正常与异常并存**：机器人列表同时有"在线""充电中""故障""离线"
- **边界值**：电量 5%/50%/95%，速度正常/慢速/低速
- **空状态与满状态**：空列表引导文案、有数据时的列表内容

#### 交互实现
- 所有按钮有 click 事件处理，至少用 Toast 反馈
- 表单有基础验证（必填、字数限制等），不合规时有提示
- Tab 切换、弹窗开关等交互需完整实现
- 页面间无死链接，所有导航项都可跳转

### Phase 4: 标注生成
创建时即为关键元素生成标注，写入 `index.json` 的 annotations 数组。

**标注数据结构：**
```json
{
  "id": "唯一ID",
  "markerNumber": 1,
  "x": 0.5,
  "y": 0.3,
  "description": "标注说明",
  "page": "map",
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000
}
```

**字段说明：**
- `x` / `y`：0~1 相对比例，指向目标元素的视觉位置
- `page`：**必填**，标注所属页面的 ID（如 `"map"`、`"robots"`、`"loginPage"`）

**必须标注的元素（每页至少 2 个标注）：**
- **按钮**：功能说明、触发条件、点击后行为
- **弹窗/对话框**：弹出时机、表单字段、确认/取消后续
- **分支逻辑**：条件判断点、每条分支走向和结果
- **状态切换**：标签含义、触发条件、界面变化
- **表单验证**：校验规则、不合规提示、按钮禁用条件
- **关键数据展示**：指标含义、异常阈值、颜色变化条件

**标注 page 字段取值规则：**
- 登录页的标注：`page: "loginPage"`
- 标准 page-section 的标注：`page: "map"` / `page: "robots"` 等（不含 `page-` 前缀）
- 必须与 HTML 中的页面 ID 一致

### Phase 5: 流程图制作
为项目制作流程图，使用 Mermaid 语法生成，保存到 `website/{slug}/images/`。

**流程图生成规则：**
1. 使用 Mermaid flowchart 语法
2. 每个流程图保存为 `.md` 文件（含 Mermaid 代码块）
3. 文件命名规范：

| 类型 | 文件名 | 必须包含的分支 |
|------|--------|---------------|
| 认证流程 | flow-auth.md | 成功、失败、超时、锁定、退出 |
| 核心业务流程 | flow-core.md | 成功、失败、超时路径 |
| 状态生命周期 | flow-state-{entity}.md | 所有状态、转换、终态 |
| 异常处理 | flow-error.md | 检测→重试→恢复/降级/告警 |
| 自动化流程 | flow-auto.md | 触发条件、执行、中断恢复 |

**Mermaid 模板：**

```mermaid
flowchart TD
    A([开始]) --> B[处理步骤]
    B --> C{判断条件}
    C -->|条件A| D[处理A]
    C -->|条件B| E[处理B]
    D --> F([成功结束])
    E --> G[异常处理] --> H([失败结束])
```

**分支要求：**
- 每个判断节点标明条件、不允许悬空
- 失败分支说明后续处理（重试/降级/告警/人工介入）
- 状态节点使用 `([圆形])` 表示，处理步骤使用 `[矩形]`
- 异常路径使用红色样式 `:::error`，成功路径使用绿色 `:::success`

**附带文字说明**：流程图下方写状态转换表、验证规则、边界情况

---

## 模式 B：审查已有原型

### Phase 1: 读取素材
1. 读取 `website/{slug}/index.html`（原型）
2. 读取 `website/{slug}/index.json`（项目信息和已有标注）
3. 查找需求文档（项目中或 index.json 的 prompt 字段）

### Phase 2: 逐项对比（输出差距报告）

#### A. 页面完整性
- 需求中每个页面/视图是否在原型中都有对应
- 侧边栏/导航项是否与需求结构一致
- 是否有需求提到的独立页面被遗漏
- 独立页面是否添加了 `data-page-name` 属性
- `pageNames` 对象是否覆盖所有页面

#### B. 页面识别规范检查
- 所有 `<body>` 直接子元素的独立页面是否有 `data-page-name`
- 所有 `.page-section` 的 ID 是否遵循 `page-{slug}` 格式
- `pageNames` 对象的 key 是否与页面 ID 一致
- 默认活动页是否正确标记 `.active`

#### C. 功能点逐项对照
- 需求表格每行功能在原型中的实现情况
- 表单字段验证规则、操作按钮交互反馈

#### D. 标注完整性
- 每个页面是否至少有 2 个标注
- 标注的 `page` 字段是否与 HTML 页面 ID 一致
- 登录页标注的 page 是否为 `"loginPage"`
- 关键交互元素是否都有标注覆盖

#### E. 模拟数据覆盖
- 多状态展示、异常场景、边界值、空状态

#### F. 流程图完整性
- 核心流程是否有对应流程图
- 异常分支是否都有覆盖

#### G. 易遗漏的设计盲区
- 离线/网络中断、多设备冲突、并发排队、紧急停止
- 充电/自动恢复、状态机完整性、权限角色、交互细节

### Phase 3: 输出差距报告

```markdown
## 原型审查报告：{项目名}

### 差距总览
| # | 差距 | 优先级 | 类型 |
|---|------|--------|------|

### 页面规范检查
| 检查项 | 状态 | 说明 |
|--------|------|------|
| 独立页面 data-page-name | ✅/❌ | |
| pageNames 覆盖度 | ✅/❌ | |
| page-section ID 格式 | ✅/❌ | |

### 标注覆盖检查
| 页面 | 标注数 | 覆盖关键元素 | 缺失项 |
|------|--------|-------------|--------|

### 详细说明
#### 差距 N: xxx
- **需求描述**: ...
- **当前原型状态**: ...
- **建议修复**: ...

### 模拟数据检查
- [ ] 已覆盖 / 缺失
```

### Phase 4: 标注/流程图/补全
同模式 A 的 Phase 4-5，根据 `--annotate` / `--flows` / `--full` 参数执行。

审查时如发现页面缺少 `data-page-name` 或 `pageNames` 条目，应自动补全并写回 HTML。

---

## 通用规范

### 平台边界原则
- **平台功能**（不要放进 HTML 原型）：标注/预览切换、流程图工具、项目管理、AI 生成
- **原型功能**（在 HTML 中实现）：业务页面 UI、业务导航表单、业务数据展示操作

### index.json 格式
```json
{
  "slug": "project-slug",
  "name": "中文项目名",
  "prompt": "需求摘要文本",
  "annotations": [
    {
      "id": "唯一ID",
      "markerNumber": 1,
      "x": 0.5,
      "y": 0.3,
      "description": "标注说明",
      "page": "map",
      "createdAt": 1700000000000,
      "updatedAt": 1700000000000
    }
  ],
  "mode": "preview",
  "createdAt": 1700000000000,
  "updatedAt": 1700000000000
}
```

### 文件存储结构
```
website/
  {project-slug}/
    index.html      # 原型（单文件，CSS+JS 内联）
    index.json      # 项目元数据 + 标注数据
    images/         # 流程图（Mermaid .md 文件）
      flow-auth.md
      flow-core.md
```

### 技术约束
- 单 HTML 文件，CSS 在 `<style>`，JS 在 `<script>`
- 渲染在 `<iframe sandbox="allow-scripts allow-same-origin allow-forms">`
- 页面切换用 `.page-section` + `.active` class
- 独立页面用 `data-page-name` 标识 + `style.display` 切换
- 不依赖外部文件，无外部 API 调用
- 目录名用英文 slug，中文项目名存 index.json
- 所有标注必须包含 `page` 字段
