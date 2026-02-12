# 曼波带你学圆锥曲线 🎓

> 一个将Galgame体验与严谨数学教学完美结合的交互式Web课件

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![React](https://img.shields.io/badge/React-19-blue)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF)](https://vitejs.dev/)

---

## 📖 项目简介

**曼波带你学圆锥曲线**是一个创新的数学教学应用，通过可爱的IP角色"曼波"，用剧情化的方式引导学生学习圆锥曲线知识。

### ✨ 核心特色

- 🎭 **Galgame风格**：沉浸式剧情体验，让数学学习充满乐趣
- 📐 **严谨教学**：基于原生JS+Canvas的交互式实验，数学逻辑严密
- 🎨 **手绘美学**：淡黄粉色调，温馨的视觉设计
- 🚀 **纯前端**：无需后端，部署简单，访问快速
- 📱 **响应式**：完美适配桌面端与移动端
- 🧩 **模块化实验**：iFrame架构实现实验与主框架解耦

---

## 🎯 项目目标

1. **教学目标**：让高中生能轻松理解圆锥曲线的概念与应用
2. **体验目标**：比传统课堂更有趣，比纯游戏更有价值
3. **技术目标**：探索交互式教学的最佳实践

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 安装

```bash
# 克隆项目
git clone https://github.com/your-username/mambo-conic.git
cd mambo-conic

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

### 构建

```bash
# 生产构建
npm run build

# 预览构建结果
npm run preview
```

---

## 📚 文档导航

### 开发文档
- 📋 [**总体规划**](mambo-conic/PROJECT_MASTER_PLAN.md) - 项目的战略规划与技术选型
- 🔧 [**任务分解**](mambo-conic/MVP_TASK_BREAKDOWN.md) - 三人团队的详细开发任务
- ⚡ [**快速启动**](mambo-conic/QUICK_START.md) - 立即开工的操作指南
- 🎨 [**资源清单**](mambo-conic/ASSETS_CHECKLIST.md) - 所需的静态资源列表

### 核心概念

#### 1. 数据驱动架构
所有课程内容通过JSON配置，播放引擎负责解析与渲染：

```json
{
  "id": "scene_001",
  "type": "dialogue",
  "mambo": { "expression": "happy" },
  "dialogue": { "text": "你好呀！" },
  "blackboard": { "type": "image", "src": "/intro.png" },
  "next": "scene_002"
}
```

#### 2. 万能黑板系统
支持多种内容类型，动态切换：
- 📊 数学公式（KaTeX）
- 🎬 教学视频
- 🖼️ 示意图片（支持自定义样式）
- 🧪 交互实验（iFrame + 独立HTML）

#### 3. 角色表情系统
曼波可根据剧情切换不同表情与动作：
```jsx
<Mambo expression="happy" action="bounce" />
```

---

## 🏗️ 技术架构

### 技术栈

```
├─ 框架层
│  ├─ React 19          - 核心UI框架
│  ├─ Vite 7            - 构建工具
│  └─ React Router      - 路由管理（未来）
│
├─ 状态管理
│  └─ Zustand           - 轻量级状态管理
│
├─ 动画与交互
│  ├─ Framer Motion     - 动画引擎
│  ├─ 原生 Canvas 2D   - 实验绘图
│  └─ JSXGraph          - 数学几何可视化（可选）
│
├─ 样式方案
│  └─ Tailwind CSS      - 实用优先的CSS框架
│
├─ 数学渲染
│  ├─ KaTeX             - LaTeX公式渲染
│  └─ react-katex       - React集成
│
└─ 部署
   └─ Cloudflare Pages  - 静态站点托管
```

### 实验架构设计

本项目采用 **iFrame + 独立HTML** 的实验架构，实现实验与主框架的完全解耦：

| 项目 | 方案 |
|-----|------|
| 实验技术栈 | 原生 JS + Canvas 2D |
| 逻辑分辨率 | 800x600 |
| HMR 方式 | 静态文件集成（public/labs）|
| 共享库 | JSXGraph + KaTeX |
| Bridge 通信 | ready + result |
| UI 样式共享 | 颜色、字体、按钮样式 |

**优势：**
- 实验代码独立，不依赖 React 构建流程
- 支持独立调试和运行
- 便于移植和复用
- 降低主框架复杂度

### 目录结构

```
mambo-conic/
├── public/                    # 静态资源
│   ├── labs/                  # 独立实验目录 ⭐ 新架构
│   │   ├── lib/
│   │   │   ├── bridge.js      # 通信协议
│   │   │   ├── theme.css      # 共享样式
│   │   │   ├── jsxgraph.min.js
│   │   │   └── katex.min.js
│   │   └── lab01-ellipse/
│   │       └── index.html     # 椭圆实验（独立HTML）
│   │
│   ├── images/               # 立绘、背景、示意图
│   ├── videos/               # 教学视频
│   └── audio/               # 音效（可选）
│
├── src/
│   ├── components/            # React组件
│   │   ├── Mambo/           # 角色系统
│   │   ├── Dialogue/        # 对话框
│   │   ├── Blackboard/      # 黑板容器
│   │   ├── LabRunner/       # iFrame加载器 ⭐ 新增
│   │   └── UI/             # 通用UI组件
│   │
│   ├── data/                # 课程数据
│   │   └── scenes/         # JSON剧本
│   │       └── chapter01.json
│   │
│   ├── store/               # Zustand状态
│   │   └─ useGameStore.js
│   │
│   ├── utils/               # 工具函数
│   │   └─ SceneEngine.js   # 剧情引擎
│   │
│   ├── App.jsx              # 主应用
│   ├── main.jsx             # 入口文件
│   └─ index.css            # 全局样式
│
├── tailwind.config.js       # Tailwind配置
├── vite.config.js           # Vite配置
└─ package.json
```

---

## 🎨 UI设计规范

### 色彩系统

```css
/* 主色调 */
--warm-yellow: #FFF9E6;      /* 背景 - 淡黄 */
--soft-pink: #FFE4E1;        /* 强调 - 柔粉 */
--coral: #FFAB91;            /* 按钮 - 珊瑚 */
--warm-brown: #5D4E37;       /* 文字 - 暖棕 */

/* 功能色 */
--success: #A8E6CF;          /* 正确提示 */
--error: #FFAAA5;            /* 错误提示 */
--info: #B4E7F5;             /* 信息提示 */
```

### 字体规范

- **标题**：思源宋体 / Ma Shan Zheng（手写体）
- **正文**：Noto Sans SC / 苹方
- **数学**：KaTeX默认字体

### 组件风格

- 手绘边框：不规则圆角，模拟手绘线条
- 纸张纹理：淡淡的噪点背景
- 柔和阴影：`box-shadow: 0 2px 8px rgba(0,0,0,0.05)`

---

## 🧪 核心功能展示

### 1. 剧情对话系统

```jsx
// 打字机效果的对话框
<Dialogue
  content={{
    speaker: "曼波",
    text: "让我们来探索圆锥曲线的秘密吧！",
    speed: 50
  }}
  onNext={handleNext}
/>
```

### 2. 选择题分支

```jsx
// 多选项菜单
<ChoiceMenu
  options={[
    { text: "椭圆", correct: true, next: "correct_01" },
    { text: "圆形", correct: false, next: "hint_01" }
  ]}
  onChoice={handleChoice}
/>
```

### 3. 交互式数学实验（iFrame 架构）

```jsx
// 椭圆焦点拖拽实验
<Blackboard
  content={{
    type: "lab",
    labType: "lab01-ellipse",
    config: { fixedMode: true }
  }}
/>
```

实验通过 `LabRunner` 组件加载独立 HTML 文件，使用 postMessage 进行通信：

```javascript
// 实验侧（HTML内）
LabBridge.ready();              // 通知主框架实验就绪
LabBridge.result({ success: true });  // 发送实验结果

// 主框架侧（React）
<LabRunner
  labType="lab01-ellipse"
  config={{ fixedMode: true }}
  onReady={() => console.log('实验就绪')}
  onResult={(data) => console.log('结果:', data)}
/>
```

### 4. 带自定义样式的图片/视频

支持通过 `style` 和 `className` 属性自定义显示效果：

```json
{
  "blackboard": {
    "type": "image",
    "src": "/path/to/image.png",
    "className": "w-3/4 h-3/4 object-contain",
    "style": { "borderRadius": "12px", "opacity": "0.9" }
  }
}
```

可用属性：
- `className` - 覆盖默认的 Tailwind 类名
- `style` - 自定义内联样式（React.CSSProperties）

### 5. 数学公式渲染

```jsx
// LaTeX公式展示
<Blackboard
  content={{
    type: "math",
    content: "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1"
  }}
/>
```

---

## 👥 团队分工

本项目采用**三人并行开发**模式：

| 角色 | 负责范围 | 核心技能 |
|------|---------|---------|
| **开发者A** | 架构、状态管理、剧情引擎 | React、Zustand |
| **开发者B** | 角色系统、对话框、UI组件 | Framer Motion、CSS |
| **开发者C** | 实验开发、数学可视化 | 原生JS、Canvas、JSXGraph |

详见 [**任务分解文档**](mambo-conic/MVP_TASK_BREAKDOWN.md)

---

## 📅 开发进度

### MVP阶段（3周）

- ✅ **Week 1**：基础架构搭建
  - [x] 项目初始化
  - [x] Tailwind配置
  - [x] 状态管理系统
  - [x] 组件框架

- 🔄 **Week 2**：核心功能开发
  - [ ] 角色动画系统
  - [ ] 对话打字机效果
  - [ ] 黑板内容渲染
  - [x] 实验架构（iFrame方案）

- ⏳ **Week 3**：测试与部署
  - [ ] 编写完整剧本
  - [ ] UI美化打磨
  - [ ] 准备静态资源
  - [ ] Cloudflare部署

---

## 🧑‍💻 开发指南

### 本地开发

```bash
# 启动开发服务器
npm run dev

# 访问 http://localhost:5173
```

### 添加新场景

1. 编辑 `mambo-conic/src/data/scenes/chapter01.json`
2. 添加场景对象
3. 配置曼波表情、对话内容、黑板内容
4. 设置跳转逻辑

示例：
```json
{
  "id": "new_scene",
  "type": "dialogue",
  "mambo": { "expression": "thinking" },
  "dialogue": { "text": "思考一下这个问题..." },
  "blackboard": { "type": "image", "src": "/diagram.png" },
  "next": "next_scene"
}
```

### 创建新实验 ⭐ iFrame 架构

采用**iFrame + 独立HTML**架构，每个实验都是完全独立的 HTML 文件。

#### 1. 创建实验目录

在 `mambo-conic/public/labs/` 下创建新目录，例如 `lab02-parabola/`：

```
public/labs/lab02-parabola/
└── index.html    # 独立的实验HTML文件
```

#### 2. 编写实验代码

实验是纯原生 HTML/JS/CSS，使用共享资源：

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Lab02 - 抛物线实验</title>
  <link rel="stylesheet" href="../../lib/theme.css">
  <script src="../../lib/bridge.js"></script>
  <!-- 可选：引入 JSXGraph 或 KaTeX -->
  <script src="../../lib/jsxgraph.min.js"></script>
  <script src="../../lib/katex.min.js"></script>
</head>
<body>
  <div id="lab-container" style="width: 800px; height: 600px;">
    <canvas id="canvas" width="800" height="600"></canvas>
  </div>
  <script>
    // 实验逻辑代码
    // 800x600 逻辑分辨率
    // 使用原生 Canvas 2D 或 JSXGraph

    // 初始化完成后通知主框架
    LabBridge.ready();

    // 实验完成后发送结果
    // LabBridge.result({ data: ... });
  </script>
</body>
</html>
```

**实验规范：**
- 逻辑分辨率固定为 800x600
- 使用 Canvas 2D 或 JSXGraph 进行绘图
- 初始化完成后调用 `LabBridge.ready()`
- 实验完成后调用 `LabBridge.result(data)`
- 监听 `LAB_CONFIG` 消息接收配置更新

#### 3. 在 JSON 中调用

```json
{
  "id": "scene_01",
  "blackboard": {
    "type": "lab",
    "labType": "lab02-parabola",
    "step": 1,
    "config": {
      "param1": "value1"
    }
  },
  "dialogue": { "text": "看好了，点P要动了！" }
}
```

#### 4. 共享资源说明

| 文件 | 用途 |
|-----|------|
| `bridge.js` | 通信协议：`LabBridge.ready()`, `LabBridge.result(data)` |
| `theme.css` | 共享样式：颜色、字体、组件样式 |
| `jsxgraph.min.js` | JSXGraph 数学可视化库 |
| `katex.min.js` | KaTeX 公式渲染库 |

#### 5. 调试实验

**独立调试：**
```bash
# 直接访问实验文件
# http://localhost:5173/labs/lab02-parabola/
```

**集成调试：**
```bash
# 通过主游戏触发实验
# 场景 JSON 中配置 labType
```

---

## 🐛 调试技巧

### React DevTools
```bash
# Chrome扩展：React Developer Tools
# 查看组件树、Props、State
```

### Zustand状态调试
```javascript
// 浏览器控制台
window.store = useGameStore.getState();
console.log(window.store.currentSceneId);
```

### 实验调试（iFrame 内）

```javascript
// 在实验 HTML 的控制台直接调试
console.log(STATE);  // 查看实验状态
console.log(canvas); // 查看 Canvas 对象
```

---

## 📦 构建与部署

### 本地构建

```bash
npm run build
# 输出到 dist/ 目录
```

### Cloudflare Pages部署

1. 登录 [Cloudflare Pages](https://pages.cloudflare.com/)
2. 连接GitHub仓库
3. 配置构建：
   - 构建命令：`npm run build`
   - 输出目录：`dist`
   - Node版本：18
4. 自动部署

每次push到`main`分支，自动触发部署。

---

## 🤝 贡献指南

欢迎贡献！请遵循以下流程：

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'feat: Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启Pull Request

### Commit规范

```
feat: 新功能
fix: Bug修复
docs: 文档更新
style: 代码格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具配置
```

---

## 📄 许可证

本项目采用 [MIT许可证](LICENSE)

---

## 🙏 致谢

### 开源项目
- [React](https://react.dev/) - UI框架
- [Vite](https://vitejs.dev/) - 构建工具
- [JSXGraph](https://jsxgraph.org/) - 数学可视化
- [Framer Motion](https://www.framer.com/motion/) - 动画引擎
- [Tailwind CSS](https://tailwindcss.com/) - CSS框架

### 设计灵感
- Galgame经典作品的交互设计
- Khan Academy的教学理念
- 3Blue1Brown的数学动画美学

---

## 📞 联系方式

- **项目主页**：https://github.com/your-username/mambo-conic
- **问题反馈**：[Issues](https://github.com/your-username/mambo-conic/issues)
- **讨论交流**：[Discussions](https://github.com/your-username/mambo-conic/discussions)

---

## 🌟 项目愿景

我们相信，**学习可以是快乐的**。通过将游戏化体验与严谨教学结合，我们希望：

1. 让更多学生爱上数学
2. 探索交互式教育的可能性
3. 为教育科技领域贡献开源力量

**如果这个项目对你有帮助，请给我们一个⭐️！**

---

<div align="center">

**用❤️和📐制作**

[开始使用资料](mambo-conic/QUICK_START.md) · [查看演示](#) · [报告问题](https://github.com/your-username/mambo-conic/issues)

</div>
