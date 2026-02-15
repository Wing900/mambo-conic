# Mabo Lab — 圆锥曲线探索实验室

面向高中生的交互式圆锥曲线教学应用。通过对话引导、动手实验和选择题，完成从圆锥截面到椭圆标准方程的完整学习路径。

线上地址：https://mambo.5051001.xyz/

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | React 19 + TypeScript |
| 构建 | Vite |
| 样式 | Tailwind CSS 4 |
| 动画 | Framer Motion |
| 状态管理 | Zustand（localStorage 持久化） |
| 公式渲染 | KaTeX |
| 几何画板 | GeoGebra（iframe）+ JSXGraph（本地） |
| 语音生成 | Fish TTS（Python 脚本，见 `voice-gen/`） |

## 项目结构

```
mambo-conic/
├── src/
│   ├── components/
│   │   ├── Blackboard/          # 黑板组件（image/video/math/lab/iframe）
│   │   ├── Dialogue/            # 对话气泡
│   │   ├── Game/                # 游戏主界面（GameMain, GameHeader, DialogueArea, BlackboardArea）
│   │   ├── LabRunner/           # 实验 iframe 加载器（自适应缩放）
│   │   ├── Mambo/               # 角色组件（6 种表情 + 动作动画）
│   │   ├── Screens/             # 标题页、章节选择页
│   │   └── UI/                  # Button, ChoiceMenu, ProgressBar, SettingsButton
│   ├── constants/
│   │   ├── chapters.ts          # 章节元数据（标题、起始场景、锁定状态）
│   │   └── mamboAssets.ts       # 角色表情图片映射
│   ├── data/
│   │   ├── scenes/              # 场景数据（JSON）
│   │   │   ├── chapter01/       # 第一章（part1~3.json）
│   │   │   ├── chapter02/       # 第二章（part1~3.json）
│   │   │   └── chapter03/       # 第三章（part1~4.json）
│   │   └── progress/            # 章节进度配置
│   ├── hooks/
│   │   ├── useChapterProgress.ts    # 计算当前场景在章节内的进度
│   │   ├── useGameEntryPreloader.ts # 进入游戏前预加载资源
│   │   └── useSceneLoader.ts        # 加载章节 JSON 数据
│   ├── store/
│   │   └── useGameStore.ts      # Zustand 全局状态（场景、得分、音频、存档）
│   ├── types/                   # TypeScript 类型定义
│   └── utils/
│       ├── SceneEngine.ts       # 场景引擎（Map 查找 + 错误场景降级）
│       ├── audioManager.ts      # 音频管理器（场景语音 + 背景音乐双单例）
│       ├── scenePreload.ts      # 场景资源预加载
│       ├── logger.ts            # 分模块日志系统
│       └── animations.ts        # 角色动画配置
├── public/
│   ├── images/                  # 角色表情图片（mambo_*.png）
│   ├── labimage/                # 黑板图片资源（按章节分目录）
│   │   ├── ch01/
│   │   ├── ch02/
│   │   └── ch03/
│   ├── labvideo/                # 视频资源
│   │   └── ch02/
│   ├── labmusic/                # 音频资源
│   │   ├── backmusic.mp3        # 背景音乐
│   │   ├── ch01/                # 第一章语音（41 个）
│   │   ├── ch02/                # 第二章语音（22 个）
│   │   └── ch03/                # 第三章语音（56 个）
│   └── labs/                    # 交互实验（独立 HTML 页面）
│       ├── lab-conic-section/   # 圆锥截面实验
│       ├── lab-single-point/    # 单点定义实验
│       ├── lab-four-ops/        # 四种运算实验
│       ├── lab-symmetry/        # 对称性翻折实验
│       ├── lab-classify/        # 方程分类实验
│       └── lib/                 # 实验公共库（bridge.js, jsxgraph, katex, theme）
```

## 核心架构

### 场景引擎

所有教学内容以 JSON 描述，每个场景包含：

```json
{
  "id": "ch01_s01_welcome",
  "type": "dialogue | choice",
  "mambo": { "expression": "happy", "action": "bounce" },
  "dialogue": { "text": "显示给用户的文本" },
  "blackboard": { "type": "math", "content": "LaTeX 公式" },
  "options": [
    { "text": "选项A", "correct": true, "next": "下一场景ID", "scoreChange": 10 }
  ],
  "next": "下一场景ID",
  "tts_text": "语音朗读的替代文本（用于公式场景）"
}
```

场景之间通过 `next` 和 `options[].next` 形成有向图，`SceneEngine` 负责查找和跳转。

### 黑板类型

| 类型 | 用途 | 数据来源 |
|------|------|----------|
| `image` | SVG/PNG 图片 | `public/labimage/{chapter}/` |
| `video` | 视频播放 | `public/labvideo/{chapter}/` |
| `math` | LaTeX 公式（KaTeX 渲染） | JSON `content` 字段 |
| `lab` | 交互实验（iframe 加载） | `public/labs/{labType}/index.html` |
| `iframe` | 外部嵌入页面 | JSON `src` 字段 |

### 实验系统

实验以独立 HTML 页面存放在 `public/labs/` 下，通过 `LabRunner` 组件用 iframe 加载。父页面与实验之间通过 `bridge.js` 的 postMessage 通信。实验页面内使用 GeoGebra 或 JSXGraph 实现交互。

5 个实验：

| labType | 章节 | 内容 |
|---------|------|------|
| `lab-conic-section` | 第一章 | 平面截圆锥，观察不同截面形状 |
| `lab-single-point` | 第二章 | 验证单点是否满足椭圆定义 |
| `lab-four-ops` | 第二章 | 探究距离和/差/积/商的不变量 |
| `lab-symmetry` | 第三章 | 翻折椭圆，发现对称性 |
| `lab-classify` | 第三章 | 调整参数，观察焦点位置与分母大小关系 |

### 音频系统

两个独立的全局单例管理器：

- `SceneAudioManager`：按场景 ID 加载对应 MP3，切换场景时自动停止/播放
- `BackgroundMusicManager`：循环播放背景音乐，音量 0.5，遵守浏览器 autoplay 策略

语音文件路径规则：`labmusic/{章节ID}/{场景ID}.mp3`

`tts_text` 字段用于公式场景的语音替代文本，例如将 `a²` 读作"a的平方"。

### 存档系统

- 每次场景切换自动保存到 `localStorage`
- 保存内容：当前场景 ID、历史栈、得分、已完成场景
- 带版本号（`SAVE_VERSION`），版本不匹配时自动清除旧存档

## 开发

```bash
npm install
npm run dev       # 启动开发服务器
npm run build     # 构建生产版本
```

## 语音生成

语音通过 `voice-gen/` 目录下的 Python 脚本生成，依赖本地 Fish TTS 代理服务。

```bash
cd voice-gen

# 启动 Fish TTS 代理（需要提前配置）
uvicorn fish_tts_proxy:app --host 127.0.0.1 --port 8000

# 生成指定章节的语音
python generate.py ../mambo-conic/src/data/scenes/chapter01/part1.json
```

配置文件 `voice-gen/config.json`：

```json
{
  "tts_url": "http://127.0.0.1:8000/v1/tts",
  "model_id": "模型ID",
  "output_dir": "../mambo-conic/public/labmusic"
}
```

脚本会跳过已存在的 MP3 文件，支持增量生成。

## 新增内容指南

### 新增场景

在 `src/data/scenes/{chapter}/` 对应的 JSON 文件中添加场景对象，确保 `id` 唯一，`next` 指向有效场景。

### 新增实验

1. 在 `public/labs/` 下创建目录，放入 `index.html`
2. 引入 `../lib/bridge.js` 实现与父页面通信
3. 在场景 JSON 中通过 `"blackboard": { "type": "lab", "labType": "目录名" }` 引用

### 新增语音

1. 在 `public/labmusic/{章节ID}/` 下放入 MP3 文件
2. 文件名与场景 ID 完全一致，如 `ch01_s01_welcome.mp3`
3. 含公式的场景需在 JSON 中添加 `tts_text` 字段提供读音文本

## 相关项目

- [GGBPuppy](https://github.com/Wing900/GGBPuppy) — GeoGebra 反向代理，本项目的交互实验通过它嵌入
- [ManimCat](https://github.com/Wing900/ManimCat) — 基于 Manim 的数学动画生成工具，本项目的教学视频由它制作
