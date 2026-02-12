# 圆锥曲线实验室

基于 React + Vite 的交互式圆锥曲线教学应用。

## 项目结构

```
mambo-conic/
├── src/
│   ├── components/
│   │   ├── Blackboard/           # 黑板区域
│   │   │   ├── Blackboard.tsx     # 黑板主组件（处理 image/video/math/lab 类型）
│   │   │   └── labs/             # 实验组件目录
│   │   │       └── Lab01_Ellipse.tsx  # 椭圆实验
│   ├── data/
│   │   └── scenes/              # 场景配置（JSON）
│   ├── types/                   # TypeScript 类型定义
│   └── ...
└── public/
    ├── labimage/                # 图片资源
    ├── labvideo/                # 视频资源
    └── labmusic/                # 音频资源
        ├── backmusic.mp3         # 背景音乐
        └── ch01/                # 第一章场景语音
            └── ch01_s1_welcome.mp3
```

## 黑板内容类型

黑板支持以下以下内容类型：

| 类型 | 用途 | 存放位置 |
|------|------|----------|
| `image` | 静态图片 | `public/labimage/` |
| `video` | 视频 | `public/labvideo/` |
| `math` | 数学公式 | JSON 中直接写 |
| `lab` | 交互实验 | `src/components/Blackboard/labs/` |

## 音频系统

### 目录结构

```
public/labmusic/
├── backmusic.mp3                 # 背景音乐（标题页使用）
├── ch01/                        # 第一章场景语音
│   ├── ch01_s1_welcome.mp3
│   ├── ch01_s1_challenge.mp3
│   ├── ch01_s1_quiz.mp3
│   ├── ch01_s2_start.mp3
│   └── ...
├── ch02/                        # 第二章场景语音
│   └── ...
└── ...
```

### 场景语音命名规范

- 文件名必须与**场景 ID** 完全匹配
- 放在对应的章节文件夹内
- 文件路径：`labmusic/{章节ID}/{场景ID}.{扩展名}`
- 示例：`labmusic/ch01/ch01_s1_welcome.mp3`
- 支持的音频格式：`.mp3`（优先）、`.wav`、`.m4a`、`.ogg`

### 背景音乐

- 文件名固定为 `backmusic.mp3`
- 路径：`labmusic/backmusic.mp3`
- 默认**不自动播放**，需要用户手动开启
- 循环播放，音量默认为 0.5

### 自动播放规则

- 有语音文件的场景会自动播放语音
- 没有语音文件的场景静默运行（不会报错）
- 切换场景时自动停止上一场景语音
- 背景音乐与场景语音独立控制

## 实验组件命名规范

实验组件文件命名格式：**`Lab{序号}_{实验名称}.tsx`**

- 序号：两位数字，如 01、02、03...
- 名称：英文，PascalCase 风格

| 文件名 | 说明 |
|--------|------|
| `Lab01_Ellipse.tsx` | 椭圆实验 |
| `Lab02_Hyperbola.tsx` | 双曲线实验 |
| `Lab03_Parabola.tsx` | 抛物线实验 |

在 JSON 中引用时使用小写：
```json
{
  "blackboard": {
    "type": "lab",
    "labType": "lab01_ellipse"
  }
}
```

## 技术栈

- React 18
- TypeScript
- Vite
- Tailwind CSS

## 开发和运行

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 新增实验步骤

1. 在 `src/components/Blackboard/labs/` 创建新组件，命名如 `Lab02_Hyperbola.tsx`
2. 在 `Blackboard.tsx` 的 `LAB_MAP` 中添加：
   ```ts
   'lab02_hyperbola': lazy(() => import('./labs/Lab02_Hyperbola')),
   ```
3. 在场景 JSON 中引用：
   ```json
   {
     "blackboard": {
       "type": "lab",
       "labType": "lab02_hyperbola"
     }
   }
   ```

## 新增章节语音步骤

1. 在 `public/labmusic/` 下创建章节文件夹（如 `ch02/`）
2. 将语音文件按场景 ID 命名放入对应章节文件夹
3. 例如场景 `ch02_s1_welcome` 对应文件 `labmusic/ch02/ch02_s1_welcome.mp3`
