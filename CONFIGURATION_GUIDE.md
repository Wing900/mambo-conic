# 曼波圆锥曲线 - 配置与资源指南 📚

> 详细说明如何配置剧情、管理资源、添加语音和新章节

---

## 📋 目录

- [快速开始](#快速开始)
- [章节配置](#章节配置)
- [场景脚本编写](#场景脚本编写)
- [资源文件管理](#资源文件管理)
- [语音系统配置](#语音系统配置)
- [实验室配置](#实验室配置)
- [状态管理](#状态管理)

---

## 🚀 快速开始

### 项目结构概览

```
mambo-conic/
├── public/                          # 静态资源根目录
│   ├── images/                      # 人物立绘
│   │   ├── mambo_normal.png        # 曼波-普通表情
│   │   ├── mambo_happy.png         # 曼波-开心表情
│   │   ├── mambo_sad.png           # 曼波-难过表情
│   │   ├── mambo_thinking.png      # 曼波-思考表情
│   │   ├── mambo_excited.png       # 曼波-兴奋表情
│   │   └── mambo_surprised.png     # 曼波-惊讶表情
│   ├── videos/                      # 教学视频
│   └── audio/                       # 语音文件（需创建）
│       ├── voice/                   # 角色语音
│       │   ├── scene_001.mp3
│       │   └── ...
│       ├── bgm/                     # 背景音乐
│       │   ├── menu.mp3
│       │   └── game.mp3
│       └── sfx/                     # 音效
│           ├── click.mp3
│           └── correct.mp3
│
├── src/
│   ├── data/scenes/                 # 剧情脚本
│   │   ├── chapter01.json          # 第一章：椭圆入门
│   │   ├── chapter02.json          # 第二章：双曲线（待添加）
│   │   └── chapter03.json          # 第三章：抛物线（待添加）
│   │
│   ├── components/
│   │   ├── Mambo/                   # 角色系统
│   │   ├── Dialogue/                # 对话框
│   │   ├── Blackboard/              # 黑板系统
│   │   │   └── labs/                # 交互实验
│   │   └── Screens/                 # 界面
│   │       ├── TitleScreen.tsx     # 开始界面
│   │       └── ChapterSelect.tsx   # 章节选择
│   │
│   └── store/
│       └── useGameStore.ts          # 全局状态管理
```

---

## 📖 章节配置

### 添加新章节

#### 1. 创建章节JSON文件

在 `src/data/scenes/` 创建新文件，例如 `chapter02.json`：

```json
{
  "chapter": "双曲线的秘密",
  "scenes": [
    {
      "id": "start",
      "type": "dialogue",
      "mambo": {
        "expression": "happy",
        "action": "bounce"
      },
      "dialogue": {
        "speaker": "曼波",
        "text": "欢迎来到第二章！今天我们要探索双曲线～",
        "speed": 50,
        "voiceFile": "chapter02_start.mp3"
      },
      "blackboard": {
        "type": "image",
        "src": "/assets/images/hyperbola_intro.png"
      },
      "next": "scene_002"
    }
  ]
}
```

#### 2. 在章节选择界面注册

编辑 `src/components/Screens/ChapterSelect.tsx`：

```typescript
const chapters = [
  {
    id: 'chapter01',
    title: '第一章：椭圆入门',
    description: '什么是椭圆？它和圆有什么关系？让我们切开圆锥看一看！',
    startScene: 'start',
    locked: false,
  },
  {
    id: 'chapter02',
    title: '第二章：双曲线的秘密',
    description: '双曲线的性质和应用，探索这条神奇的曲线！',
    startScene: 'start',
    locked: false,  // 改为 false 解锁章节
  },
  // 添加更多章节...
];
```

#### 3. 在App中导入章节数据

编辑 `src/App.tsx`：

```typescript
import chapter01Data from './data/scenes/chapter01.json';
import chapter02Data from './data/scenes/chapter02.json';

// 在组件中根据章节ID选择数据
const [engine] = useState(() => {
  const chapterData = currentChapter === 'chapter01' ? chapter01Data : chapter02Data;
  return new SceneEngine(chapterData as any);
});
```

---

## ✍️ 场景脚本编写

### 场景类型

#### 1. 对话场景 (dialogue)

普通对话，点击继续到下一个场景。

```json
{
  "id": "scene_001",
  "type": "dialogue",
  "mambo": {
    "expression": "happy",      // 表情：normal|happy|sad|thinking|excited|surprised
    "action": "bounce"          // 动作：bounce|shake|idle|excited
  },
  "dialogue": {
    "speaker": "曼波",           // 说话人名字（可选）
    "text": "你好呀！",          // 对话文本
    "speed": 50,                // 打字速度（毫秒/字）
    "voiceFile": "scene_001.mp3" // 语音文件（可选）
  },
  "blackboard": {
    "type": "image",            // 黑板类型
    "src": "/assets/images/intro.png"
  },
  "next": "scene_002"           // 下一个场景ID
}
```

#### 2. 选择场景 (choice)

提供多个选项，根据选择跳转到不同场景。

```json
{
  "id": "question_01",
  "type": "choice",
  "mambo": {
    "expression": "thinking"
  },
  "dialogue": {
    "text": "这是一个问题，你选择哪个答案呢？"
  },
  "blackboard": {
    "type": "image",
    "src": "/assets/images/question.png"
  },
  "options": [
    {
      "text": "选项A",
      "correct": true,           // 是否正确（可选）
      "next": "correct_path",    // 跳转场景
      "scoreChange": 10          // 分数变化（可选）
    },
    {
      "text": "选项B",
      "correct": false,
      "next": "hint_path",
      "scoreChange": -5
    }
  ]
}
```

### 黑板内容类型

#### 1. 图片 (image)

```json
{
  "type": "image",
  "src": "/assets/images/diagram.png",
  "alt": "示意图"  // 可选
}
```

#### 2. 视频 (video)

```json
{
  "type": "video",
  "src": "/assets/videos/cone_cutting.mp4",
  "autoplay": true,  // 可选，默认false
  "loop": false      // 可选，默认false
}
```

#### 3. 数学公式 (math)

使用LaTeX语法：

```json
{
  "type": "math",
  "content": "\\frac{x^2}{a^2} + \\frac{y^2}{b^2} = 1"
}
```

#### 4. 交互实验 (lab)

```json
{
  "type": "lab",
  "labType": "ellipse"  // 实验类型：ellipse|parabola|hyperbola
}
```

---

## 📁 资源文件管理

### 图片资源

**位置**：`public/images/` 或 `public/assets/images/`

**命名规范**：
- 人物立绘：`mambo_[expression].png`（例如：`mambo_happy.png`）
- 教学图片：`[chapter]_[scene]_[description].png`（例如：`ch01_ellipse_definition.png`）
- 背景图：`bg_[name].png`

**推荐尺寸**：
- 人物立绘：800×1200px，PNG透明背景
- 教学图片：1920×1080px
- 图标按钮：128×128px

### 视频资源

**位置**：`public/videos/` 或 `public/assets/videos/`

**格式要求**：
- 格式：MP4 (H.264编码)
- 分辨率：1920×1080 或 1280×720
- 比特率：建议 2-5 Mbps
- 时长：建议不超过2分钟

**示例**：
```
public/videos/
├── cone_cutting.mp4          # 圆锥切割动画
├── ellipse_draw.mp4          # 椭圆绘制过程
└── real_world_example.mp4    # 实际应用案例
```

### 语音资源

**位置**：`public/audio/voice/`

**命名规范**：`[sceneId].mp3` 或 `[chapter]_[sceneId].mp3`

**格式要求**：
- 格式：MP3
- 比特率：128kbps
- 采样率：44.1kHz
- 声道：单声道（Mono）

**示例**：
```
public/audio/
├── voice/
│   ├── chapter01_start.mp3
│   ├── chapter01_scene_002.mp3
│   └── ...
├── bgm/
│   ├── menu.mp3              # 菜单背景音乐
│   ├── game.mp3              # 游戏背景音乐
│   └── ending.mp3            # 结束音乐
└── sfx/
    ├── click.mp3             # 点击音效
    ├── correct.mp3           # 答对音效
    └── wrong.mp3             # 答错音效
```

---

## 🔊 语音系统配置

### 1. 场景中配置语音

在场景JSON的 `dialogue` 中添加 `voiceFile` 字段：

```json
{
  "dialogue": {
    "text": "你好呀！",
    "voiceFile": "chapter01_start.mp3"
  }
}
```

### 2. 语音播放控制

在 `src/store/useGameStore.ts` 中已提供音频开关：

```typescript
const { isAudioEnabled, toggleAudio } = useGameStore();

// 在组件中使用
if (isAudioEnabled && dialogue.voiceFile) {
  const audio = new Audio(`/audio/voice/${dialogue.voiceFile}`);
  audio.play();
}
```

### 3. 创建语音播放组件（建议）

创建 `src/components/Audio/VoicePlayer.tsx`：

```typescript
import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';

interface VoicePlayerProps {
  voiceFile?: string;
}

export default function VoicePlayer({ voiceFile }: VoicePlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isAudioEnabled } = useGameStore();

  useEffect(() => {
    if (voiceFile && isAudioEnabled && audioRef.current) {
      audioRef.current.play();
    }
  }, [voiceFile, isAudioEnabled]);

  if (!voiceFile) return null;

  return (
    <audio 
      ref={audioRef} 
      src={`/audio/voice/${voiceFile}`}
      preload="auto"
    />
  );
}
```

### 4. 背景音乐配置

创建 `src/components/Audio/BGMPlayer.tsx`：

```typescript
import { useEffect, useRef } from 'react';
import { useGameStore } from '../../store/useGameStore';

interface BGMPlayerProps {
  track: 'menu' | 'game' | 'ending';
}

export default function BGMPlayer({ track }: BGMPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const { isAudioEnabled } = useGameStore();

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isAudioEnabled) {
      audio.play();
    } else {
      audio.pause();
    }
  }, [isAudioEnabled]);

  return (
    <audio 
      ref={audioRef}
      src={`/audio/bgm/${track}.mp3`}
      loop
      volume={0.3}
      preload="auto"
    />
  );
}
```

---

## 🧪 实验室配置

### 创建新实验

#### 1. 创建实验组件

在 `src/components/Blackboard/labs/` 创建新文件，例如 `HyperbolaLab.tsx`：

```typescript
import { useEffect, useRef } from 'react';
import JSXGraph from 'jsxgraph';

export default function HyperbolaLab() {
  const boardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!boardRef.current) return;

    const board = JSXGraph.initBoard(boardRef.current, {
      boundingbox: [-10, 10, 10, -10],
      axis: true,
      showNavigation: false,
      showCopyright: false,
    });

    // 绘制双曲线
    const hyperbola = board.create('functiongraph', [
      (x: number) => Math.sqrt(x * x - 1),
      -10, 10
    ], {
      strokeColor: '#FF6B9D',
      strokeWidth: 3,
    });

    return () => {
      JSXGraph.freeBoard(board);
    };
  }, []);

  return (
    <div ref={boardRef} className="w-full h-full" />
  );
}
```

#### 2. 注册实验

在 `src/components/Blackboard/LabNode.tsx` 注册：

```typescript
import HyperbolaLab from './labs/HyperbolaLab';

const labComponents = {
  ellipse: EllipseLab,
  hyperbola: HyperbolaLab,  // 新增
  parabola: ParabolaLab,
};
```

#### 3. 在场景中使用

```json
{
  "blackboard": {
    "type": "lab",
    "labType": "hyperbola"
  }
}
```

---

## 🎮 状态管理

### 全局状态（useGameStore）

```typescript
// 获取和设置状态
const {
  // 应用阶段
  appPhase,              // 'title' | 'chapters' | 'game'
  setAppPhase,
  
  // 音频控制
  isAudioEnabled,
  toggleAudio,
  
  // 场景导航
  currentSceneId,
  goToScene,
  goBack,
  sceneHistory,
  
  // 游戏模式
  gameMode,              // 'dialogue' | 'experiment'
  setGameMode,
  
  // 玩家状态
  playerState,           // { score, favorability, completedScenes }
  updatePlayerState,
  markSceneCompleted,
  
  // 角色
  characterName,
  setCharacterName,
  
  // 重置
  resetGame,
} = useGameStore();
```

### 使用示例

```typescript
// 跳转场景
goToScene('scene_002');

// 更新分数
updatePlayerState({ score: playerState.score + 10 });

// 标记场景完成
markSceneCompleted('scene_001');

// 切换音频
toggleAudio();
```

---

## 📝 最佳实践

### 1. 场景ID命名规范

```
chapter[章节号]_[场景类型]_[序号]

示例：
- chapter01_start
- chapter01_question_01
- chapter01_lab_ellipse
- chapter02_intro
```

### 2. 分支管理

复杂的选择分支建议绘制流程图：

```
question_01
├── correct_path → explanation_01 → next_question
├── hint_01 → question_01 (回到问题)
└── hint_02 → question_01 (回到问题)
```

### 3. 资源优化

- 图片使用 WebP 格式可减小体积
- 视频建议分段，每段不超过2分钟
- 语音文件压缩至 128kbps
- 使用懒加载避免一次性加载所有资源

### 4. 测试检查清单

- [ ] 所有场景ID唯一
- [ ] 所有 `next` 指向的场景存在
- [ ] 资源文件路径正确
- [ ] 语音文件与对话同步
- [ ] 选择题分数计算正确
- [ ] 返回功能正常工作

---

## 🛠️ 常见问题

### Q: 如何添加新的曼波表情？

1. 在 `public/images/` 添加图片 `mambo_[expression].png`
2. 在 `src/components/Mambo/Mambo.tsx` 的 `expressionImages` 中注册
3. 在 `src/types/scene.types.ts` 的 `MamboExpression` 类型中添加

### Q: 视频不播放怎么办？

检查：
- 视频格式是否为 MP4 (H.264)
- 路径是否正确（`/assets/videos/...`）
- 浏览器控制台是否有错误
- 视频文件是否过大（建议 < 50MB）

### Q: 如何实现章节解锁？

在 `playerState.completedScenes` 中检查前置章节是否完成：

```typescript
const isChapterUnlocked = (chapterId: string) => {
  if (chapterId === 'chapter01') return true;
  if (chapterId === 'chapter02') {
    return playerState.completedScenes.includes('chapter01_end');
  }
  // 更多章节...
};
```

### Q: 如何添加自动保存？

使用 `localStorage` 保存状态：

```typescript
// 保存
localStorage.setItem('gameState', JSON.stringify(playerState));

// 读取
const savedState = localStorage.getItem('gameState');
if (savedState) {
  updatePlayerState(JSON.parse(savedState));
}
```

---

## 📚 参考资源

- [JSXGraph文档](https://jsxgraph.uni-bayreuth.de/docs/)
- [KaTeX支持的函数](https://katex.org/docs/supported.html)
- [Framer Motion动画](https://www.framer.com/motion/)
- [Zustand状态管理](https://github.com/pmndrs/zustand)

---

## 🎉 开始创作

现在你已经掌握了所有配置方法，开始创作你的数学课件吧！

如有问题，欢迎提Issue或查看项目Wiki。

**祝你创作愉快！** 🚀