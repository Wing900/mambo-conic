# 曼波实验室web技术文档

<div style="background-color: #fefdf5; border: 1px solid #d3c6a6; padding: 40px; color: #3d3428; font-family: serif; display: block; border-radius: 4px;">
<div align="center" style="margin-bottom: 25px;">
<svg width="240" height="80" viewBox="0 0 240 80" xmlns="http://www.w3.org/2000/svg"><ellipse cx="40" cy="45" rx="35" ry="20" fill="#fefdf5" stroke="#FFAB91" stroke-width="4" transform="rotate(-15 40 45)" /><circle cx="25" cy="42" r="4" fill="#5D4E37" /><circle cx="55" cy="38" r="4" fill="#5D4E37" /><path d="M38 48 Q40 52 42 48" fill="none" stroke="#5D4E37" stroke-width="2" stroke-linecap="round" /><text x="90" y="55" font-family="Arial, sans-serif" font-weight="900" font-size="24" fill="#5D4E37">Mambo Lab</text></svg>
<div style="width: 100%; height: 1px; background: linear-gradient(to right, transparent, #d3c6a6, transparent); margin: 15px 0;"></div>
<h3 style="margin: 10px 0; color: #5d4e37; font-size: 1.3em; letter-spacing: 2px; font-weight: bold;">我们的设计理念</h3>
</div>
<p style="text-indent: 2em; margin: 0 0 1.5em 0;">圆锥曲线作为高中数学的重难点，不应只是冰冷的公式堆砌。在本项目中，我们思考的核心命题是：<b>如何让严谨的知识在有温度的交互中自然教授？</b></p>
<p style="text-indent: 2em; margin: 0 0 1em 0;">本作品试图构建一个数字互动教室，从三个维度回应当前的教学痛点：</p>
<div style="margin: 20px 0; padding-left: 20px; border-left: 3px solid #ffab91;">
<p style="margin: 10px 0;"><b>其一，交互的重构</b>。打破传统演示文稿“被动观看”的局限，让每一项数学结论都诞生于学生的自主实验之中。</p>
<p style="margin: 10px 0;"><b>其二，情感的纽带</b>。引入陪伴式角色，将畏难情绪转化为探索动力，让数学学习不再是一场孤独的计算。</p>
<p style="margin: 10px 0;"><b>其三，普适的愿景</b>。依托底层引擎的模板化设计，内容和模板分离，即便是非技术背景的教育者，未来也能实现课件的创新生产。</p>
</div>
<p style="text-indent: 2em; margin: 0;">用现代的,流畅的，美观的，清晰的，可爱的技术手段，去致敬那些最朴素的教育理想：<b>启发、引导、陪伴。</b></p>
<div align="right" style="margin-top: 40px; color: #8a7e6a; font-size: 0.9em;">
 Bin & Wjszbd<br>二〇二六年二月
</div>
</div>


接下来我将为你介绍我们曼波实验室web的技术和思路。你也可以在[这里](https://github.com/Wing900/mambo-conic)看到本项目的完整代码和资源文件。

它是一个课件，也是一个课件模版，随时可以替换内容变成新课。

## 目录

[TOC]

## 前言

我将从技术架构、资源制作、功能实现和难点问题与解决展开论述。首先我们阐释清楚我们的制作灵感和思路。以及不足。

### 灵感

本网站实验室的架构灵感来源于Gal Game游戏，主题选择来自于中文互联网流行梗“曼波”，她是日本动漫赛马娘的一个角色（名为诗歌剧），它与“哈基米”等流行梗一样，是中文互联网年轻一代喜闻乐见的。

### 思路

为什么是Galgame？

如果从巧合角度来说，是因为作者偶然刷到了网络上各种Galgame的梗视频，然后在一个失眠的夜晚突然灵光一闪。

从优势的角度说，传统的课件（PPT、Flash、或者死板的微课视频）最大的问题是**素材嵌入不自由，并且没有交互灵魂**。

就PPT来说，视频和图片的插入显示还算兼容灵活；但关于GeoGebra的数学动画和实验却极其难以嵌入，这是由微软PPT文件格式本身的限制决定的。交互上，PPT本质是线性文档，如果要让学生沉浸在课件交互里面，PPT所需要的付出的控制成本（各种跳转宏）是巨大的。许多互动，也需要牺牲沉浸体验，跳转到浏览器或其他软件中。

那么什么技术对于各类素材以及互动支持是最好的呢？无疑是**网页应用web**，它支持各种图片，视频，以及动画实验，世界上成千上万网页技术开发者已经为我们扫清了各种障碍。因此我们采用了以网页为核心技术，而非PPT或者Flash。以网页为架构的课件，其中嵌入的各种动画，也真正做到了转场丝滑，避免了任何PPT可能的卡顿。

还有一点，从美观度上说，我们采用了可爱柔和的奶油色作为主色系，网页开发的统一风格避免了各种乱七八糟的配色危险，另外各种排版和样式的规整统一，也是一般PPT所达不到的。

那以怎么样一个讲课形式才能保证互动和沉浸呢？无疑是**类视觉小说**，因此我们模仿了以情节和交互为核心的Galgame游戏。Galgame 有剧情、有情绪起色、有角色互动。当曼波用可爱的语气问：“这道题的离心率  𝑒  到底是大于1还是小于1呢？”的时候，这已经不是在做题了，这是在推进剧情。学生从被迫学习者变成了游戏主角。

为什么是"曼波"？

事实上，完全可以把曼波替换成"猪猪侠"和"喜羊羊"等动画角色，这是网站作者的喜好，具有一定娱乐性。

以上就是曼波实验室的基本设计和开发思路。

### 不足

在选型网站来作为课件之前，我们团队担心的首要问题是会不会难以开发？正如你所见，这个问题已经被解决。但有人或许会说，这种用网站开发一个课件的思路毫无借鉴性，因为一个普通的数学老师不懂任何编程技术，如何开发这种网站呢？

对于这个问题的回答，我们看到了一些往届参赛的优秀PPT课件作品，他们为了实现精彩的互动也投入了大量的制作成本，他们同样几乎是不可复刻开发的，对于一个普通的数学老师而言。所以我并不认为这是一个巨大的不足。

在目前来说，开发难度是一个不足，因为普通人凭借AI几乎只能写一个普通的HTML网页，不可能写出一个完整的课件网站。

但五年前，我们连HTML的一段代码都写不出来——AI的编程能力在迅速进步，所有人有目共睹。我相信在五年后，甚至十五年后，只要你想，AI便能一键生成想曼波实验室这样的网站式课件。这个不足就解决了。

而PPT类型呢？我想不一定。

## 网站技术架构

曼波实验室是一个单页应用（SPA），采用数据驱动的设计思路：所有教学内容以 JSON 文件描述，前端根据 JSON 动态渲染对话、选择题、黑板内容和交互实验，新增或修改教学内容不需要改动前端代码。

### 技术选型

| 类别 | 技术 | 说明 |
|------|------|------|
| 语言 | TypeScript | 全项目强类型，包含场景、黑板、对话等完整类型定义 |
| 前端框架 | React 19 | 组件化 UI，函数式组件 + Hooks |
| 构建工具 | Vite | 开发热更新，生产环境打包优化 |
| 样式 | Tailwind CSS 4 | 原子化 CSS，手绘风格的自定义主题 |
| 动画 | Framer Motion | 页面过渡、角色表情切换、UI 进出场动画 |
| 状态管理 | Zustand | 全局状态（场景、得分、音频开关），配合 localStorage 持久化存档 |
| 公式渲染 | KaTeX | 黑板区域的 LaTeX 数学公式渲染 |
| 语音合成 | Fish Audio TTS | 通过 Python 脚本调用服务批量生成 MP3(本项目使用了本地代理) |

### 自研模块

- **场景引擎（SceneEngine）**：解析 JSON 场景数据，场景之间通过 ID 形成有向图，支持跳转、分支选择和错误降级。
- **黑板系统（Blackboard）**：统一渲染五种内容类型——静态图片、视频、LaTeX 公式、交互实验（iframe）、外部嵌入页面。
- **实验加载器（LabRunner）**：以 iframe 加载独立实验页面，通过 postMessage 实现父子页面双向通信，内置 ResizeObserver 自适应缩放。
- **音频管理器（AudioManager）**：场景语音和背景音乐两个独立单例，自动跟随场景切换，遵守浏览器 autoplay 策略。
- **TTS 文本转写**：对含数学公式的场景提供 tts_text 字段，将符号转为口语（如 a² → "a的平方"），语音生成脚本优先读取该字段。

### 依赖的个人项目

| 项目 | 地址 | 用途 |
|------|------|------|
| GGBPuppy | https://github.com/Wing900/GGBPuppy | GeoGebra 反向代理，解决国内访问不稳定的问题，交互实验通过它嵌入 |
| ManimCat | https://github.com/Wing900/ManimCat | 基于 Manim 社区版的数学动画工具，项目中的教学视频由它生成 |

幸运的是，这两个项目均是我开发的，他们的源代码也完全开源。

### 关于 AI 辅助

本项目在开发过程中我们使用了 AI 辅助编程。但由于项目涉及场景设计、交互逻辑、音频处理、实验嵌入等多个维度的交叉工作，开发过程中的提示词高度依赖上下文和持续迭代，几乎不可能完整复现提示词——但我们的源代码是完全开源的。

## 资源制作

几乎全部资源都是我们的原创和自制作！

### 图片

本项目的图片资源分为三种：

- 网络图片：数学历史的数学家介绍图片（均来自网络百科）
- 曼波立绘：使用b站up主一根华仔制作的形象结合AI生成
- 自制作图片：各种图形绘图和数学公式图片

我们的多数图片都是自己制作的，制作图形和绘图数学公式图片的方法是使用python语言的matplotlib绘图库。

这是一个简单示例：

``` python
import numpy as np
import matplotlib.pyplot as plt
import matplotlib.gridspec as gridspec
from matplotlib.patches import Ellipse, FancyArrowPatch, FancyBboxPatch
import os

# --- 全局环境配置 ---
plt.rcParams['font.sans-serif'] = ['LXGW WenKai', 'Microsoft YaHei', 'SimHei']
plt.rcParams['axes.unicode_minus'] = False
plt.rcParams['mathtext.fontset'] = 'stix'

# 配色系统
BG_COLOR = '#fefdf5'
INK_COLOR = '#5D4E37'
COLOR_X = '#E8927C'  # 珊瑚红
COLOR_Y = '#4A90D9'  # 科技蓝

def draw_standard_eq_axes_v2():
    # 增加高度以防止重叠
    fig = plt.figure(figsize=(14, 9), facecolor=BG_COLOR)
    # 增加子图间距 hspace
    gs = gridspec.GridSpec(1, 2, wspace=0.2, left=0.08, right=0.92, top=0.8, bottom=0.15)

    a_val, b_val = 2.4, 1.4
    c_val = np.sqrt(a_val**2 - b_val**2)

    def setup_ax(ax):
        ax.set_aspect('equal')
        ax.set_xlim(-4, 4)
        ax.set_ylim(-4, 4)
        # 极简坐标轴
        ax.axhline(0, color=INK_COLOR, lw=0.8, alpha=0.3)
        ax.axvline(0, color=INK_COLOR, lw=0.8, alpha=0.3)
        ax.axis('off')

    # --- 1. 左图: 焦点在 x 轴 ---
    ax1 = fig.add_subplot(gs[0])
    setup_ax(ax1)
    # 绘制椭圆与焦点
    ax1.add_patch(Ellipse((0, 0), a_val*2, b_val*2, fc='none', ec=COLOR_X, lw=3))
    ax1.plot([-c_val, c_val], [0, 0], 'o', color=COLOR_X, markersize=8)
    ax1.text(0, 3.2, "焦点在 $x$ 轴", ha='center', fontsize=20, color=COLOR_X, fontweight='bold')
    
    # 标注方程 (位置下移，避免重叠)
    eq_x = r'$\frac{x^2}{a^2} + \frac{y^2}{b^2} = 1$'
    ax1.text(0, -5.0, eq_x, ha='center', fontsize=36, color=INK_COLOR)
    
    # 可爱的小箭头：从 a^2 指向 x 轴方向
    arrow_x = FancyArrowPatch((-0.4, -4.5), (-1.5, -0.5), 
                              connectionstyle="arc3,rad=0.3", 
                              arrowstyle='->,head_width=4,head_length=8', 
                              color=COLOR_X, lw=2, linestyle='--')
    ax1.add_artist(arrow_x)
    ax1.text(-1.8, -2.5, "分母更大", ha='right', fontsize=14, color=COLOR_X, rotation=20)

    # --- 2. 右图: 焦点在 y 轴 ---
    ax2 = fig.add_subplot(gs[1])
    setup_ax(ax2)
    # 绘制椭圆与焦点
    ax2.add_patch(Ellipse((0, 0), b_val*2, a_val*2, fc='none', ec=COLOR_Y, lw=3))
    ax2.plot([0, 0], [-c_val, c_val], 'o', color=COLOR_Y, markersize=8)
    ax2.text(0, 3.2, "焦点在 $y$ 轴", ha='center', fontsize=20, color=COLOR_Y, fontweight='bold')
    
    # 标注方程
    eq_y = r'$\frac{y^2}{a^2} + \frac{x^2}{b^2} = 1$'
    ax2.text(0, -5.0, eq_y, ha='center', fontsize=36, color=INK_COLOR)

    # 可爱的小箭头：从 a^2 指向 y 轴方向
    arrow_y = FancyArrowPatch((-0.4, -4.5), (0, 1.5), 
                              connectionstyle="arc3,rad=-0.2", 
                              arrowstyle='->,head_width=4,head_length=8', 
                              color=COLOR_Y, lw=2, linestyle='--')
    ax2.add_artist(arrow_y)
    ax2.text(0.3, -2.5, "分母更大", ha='left', fontsize=14, color=COLOR_Y)

    # --- 3. 顶部判定条件 (气泡设计) ---
    # 核心约束
    fig.text(0.5, 0.9, r'核心判定：$(a > b > 0)$', ha='center', fontsize=24, 
             color=INK_COLOR, bbox=dict(boxstyle="round4,pad=0.6", fc='#F7F5EC', ec=INK_COLOR, lw=1))
    
    fig.text(0.5, 0.05, "“ $a^2$ 在谁下面，焦点就在哪个轴上 ”", ha='center', 
             fontsize=22, color=INK_COLOR, style='italic', fontweight='bold')

    # 保存文件
    name = "standard_eq_axes"
    for fmt in ['png', 'svg']:
        folder = f"{fmt}"
        if not os.path.exists(folder): os.makedirs(folder)
        plt.savefig(f"{folder}/{name}.{fmt}", dpi=1200, bbox_inches='tight')
    plt.close()

if __name__ == "__main__":
    draw_standard_eq_axes_v2()
    print("标准方程对比图已生成：解决了重叠问题，并增加了可爱的逻辑指向箭头。")

```



生成的图像如下：

![下载](D:/%E6%9B%BE%E8%89%BA%E5%BD%AC/Documents/%E4%B8%8B%E8%BD%BD.png)

### 视频制作

视频制作完全是自主制作的，使用了网站项目[ManimCat](https://manimcat.5051001.xyz/)，其原理也是python语言代码利用manim数学动画库生成数学动画。

![image-20260215190537524](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215190537524.png)

![image-20260215190619256](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215190619256.png)

### GeoGebra实验资源

我们使用GeoGebra软件制作，并且设计和制作完全原创。

![image-20260215191422833](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215191422833.png)

### 音频资源

音频资源分为：

- 背景音乐：哈基米版本的《出山》，由网络博主制作（网络下载）
- 曼波语音：自调用Fish Audio AI生成

![image-20260215214542979](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215214542979.png)

### 课设思路和对话脚本

完全根据课本内容和课标要求原创，无任何借鉴和模仿。

![image-20260215214735990](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215214735990.png)

### 资源替换

你可以替换以上资源，包括对话脚本，然后变成新课的课件。我们网站在技术上兼容完全新的内容，并且配置操作是很简单的。它不仅仅是一个课件，更是一个课件工具和模板。

## 难点和问题解决

### GGB实验嵌入

GeoGebra 官方服务在国内访问不稳定，直接嵌入会白屏或加载超时。我们制作了一个编译器GGBPuppy网站，同时作为代理，使得GGB实验可以轻松嵌入网页中。

![image-20260215220507947](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215220507947.png)

### 场景引擎的状态管理

  网站不是简单的线性播放，而是一个有向图。对话、选择题、实验三种场景类型交叉出现，选错了要走错误分支再回来，选对了走正确分支。还要支持前进、后退、跳转、存档恢复，每个操作都要保证场景历史栈、当前场景、音频状态三者同步

我们用 JSON 有向图描述场景关系，SceneEngine 用 Map 做 O(1)查找，每次跳转都入栈历史记录，回退就出栈，存档直接序列化当前场景 ID + 历史栈，解决了这个问题。同时json配置使得配置新课更易于使用。

![image-20260215221551835](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215221551835.png)

### 动态视频生成                                                                                                    
普通课件的局限:在于教学动画要么找素材要么用 AE 手做，成本高并且风格混乱，不符合教学要求。我们的解决方案用自建的 ManimCat 工具通过代码生成数学动画，专业并且美观。风格对齐，改参数重新跑就是新视频。

![image-20260215190619256](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215190619256.png)

### 数学公式渲染

普通课件 PPT/Word 里公式是图片，放大模糊，不能交互；纯公式编辑过于繁琐难以修改。我们用 KaTeX 实时渲染 LaTeX，矢量输出，任意缩放不失真，和文本混排无缝衔接。

![image-20260215221443842](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215221443842.png)

### 无障碍与分发

 由于采用纯前端静态部署（Cloudflare/Vercel），该课件支持全平台（iOS/Android/PC）访问，且**无需安装任何插件**，点击链接即学。这是网页课件杀手级的优势。

###  分支式教学路径

普通课件课件是线性的，所有人看到同样的内容，答错了也只能翻到下一页。我们的解决方案: 选择题答错走错误分支给提示再回来，答对走正确分支继续推进，每个学生的路径不同

![image-20260215222415003](C:/Users/%E6%9B%BE%E8%89%BA%E5%BD%AC/AppData/Roaming/Typora/typora-user-images/image-20260215222415003.png)

## AI提示词和资源

### 部分提示词

在使用matplotlib生成图片的过程中，我们使用了如下原创提示词：

```

# 数学可视化大师 (Mathematical Visualization Master)

## 知识层：工作领域 (拥有什么)

### 核心能力定义集
*   **领域：** 抽象数学概念的逻辑可视化。
*   **核心技术栈：** Python 的 `matplotlib` (核心可视化)、`numpy` (数据处理)、`mpl_toolkits.mplot3d` (3D 绘图)。
*   **专业身份：** 专家级“数学思想翻译官”，擅长将纯粹的数学属性转化为严密的视觉逻辑。

## 目标层：工作目标 (应该做什么)

### 输入内容预期集
*   **预期输入：** 抽象的数学概念、公式、动态演化过程或复杂的拓扑需求。
*   **首要任务：** 在编写任何代码前，必须输出一份《数学逻辑-视觉映射报告》，证明设计的每一个元素都直接源于数学逻辑的必然性。
*   **用户意图：** 优先创建具有逻辑解释力的可视化，确保核心数学洞见在图形中是“自明”的。

### 产出内容要求集
*   **产出目标：** 交付一份具备高度数学一致性、美感和可运行性的 Python 脚本。
*   **文件系统要求：** 必须在工作目录下创建 `png/` 和 `svg/` ,`pdf`文件夹。
*   **静态图交付要求：** 脚本运行后必须同时保存为 `png` 和 `svg` 格式，以及`pdf`矢量图格式。分辨率默认为1200.

## 行为层：工作流程 (怎么做)

### 工作流与思维链集
1.  **【数学逻辑拆解】** 剖析输入的数学对象：识别自变量与因变量的关系、对称性、奇点、极值点、收敛域或周期性。
2.  **【视觉编码映射】** 建立数学属性与视觉变量的对应关系。每一项视觉决策（如：为何使用极坐标、为何此处线条变细、为何使用透明度渐变）都必须有明确的数学理由。
3.  **【结构自然涌现】** 使用 `matplotlib.gridspec` 搭建承载这些逻辑映射的布局。布局应体现数学叙事的优先级（如：全局视图 -> 局部细节 -> 参数扰动）。
4.  **【代码具象化】** 编写逻辑清晰、注释完备的绘图代码。
5.  **【回顾与自检】** 检查视觉产出是否消除了所有非数学性的装饰冗余。

### 工作原则与工具集
*   **布局工具：** 仅使用 `matplotlib.gridspec` 确保布局的逻辑严密性。
*   **坐标稳定性：** 必须使用相对坐标系 (`ax.transAxes`) 放置所有逻辑注解，确保布局不随数据范围变化而坍塌。
*   **交互实现原则：** 交互组件（Slider/Button）必须直接对应数学公式中的参数（Parameters），通过 `update(val)` 函数实时重绘逻辑结果。
*   **注解原则：** 注解是数学逻辑的补充，必须通过计算来放置，严禁遮挡关键的数学奇点或轨迹。

## 规范层：工作禁区 (不要做什么)

### 渲染稳定性禁区
*   **绝对禁止：** 在任何文本元素中使用 `fontweight='bold'` 或 `weight='bold'`。
*   **绝对禁止：** 使用任何 `\begin{...}...\end{...}` 形式的 LaTeX 环境语法。
*   **禁止使用：** `\newcommand`、`\def` 或标准 LaTeX 宏包（如 `amsmath`）的特定命令。
*   **字符串控制：** 禁止在未被 `$` 包围的字符串中出现未配对的 `$` 符号。
*   **字符限制：** 禁止直接嵌入特殊的非 ASCII 数学字符，必须使用标准的 LaTeX 命令。
*   **文件命名**：同一任务多次代码，只使用一个命名，不得多个命名图片文件

### 实践与逻辑禁区
*   **禁止装饰性冗余：** 禁止添加任何没有数学逻辑支撑的视觉元素（如纯装饰边框、无意义的阴影）。
*   **禁止自动布局：** 禁止在 `plt.savefig()` 中使用 `bbox_inches='tight'`，所有间距必须在代码内精确定义。
*   **禁止直觉盲目：** 禁止在未完成《数学逻辑-视觉映射报告》前直接给出布局和颜色决定。

## 协议层：工作风格 (遵循哪些风格特点)

### 渲染与美学风格集 (影响功能实现，不可随意替换)
*   **数学文本引擎：** `mathtext.fontset` 必须设置为 `'stix'`。
*   **全局字体 (LXGW WenKai)：** 必须设置 `rcParams['font.sans-serif'] = ['LXGW WenKai', 'Microsoft YaHei', 'SimHei']`。
*   **负号修正：** `rcParams['axes.unicode_minus'] = False`。
*   **字符串前缀：** 所有包含 LaTeX 语法或路径的字符串**必须**使用原始字符串前缀 `r''`。注意，是所有！！
*   **数学格式一致性：** 文本中所有单字母变量必须包裹在 `$...$` 中（如 `r'$f(x)$'`），且中文必须位于数学环境之外。

### 视觉与色彩规范集
*   **背景色设定：** 所有的 `figure.facecolor` 和 `axes.facecolor` 必须统一设置为 `#FDFDFD`。
*   **整体设计语言：** 追求极致的理性美学，受 Apple 设计启发，线条纤细（`0.8`-`1.2`），追求精确与轻盈。
*   **色彩系统：** 严格遵守《双模式理性柔和色系规范 (V2.1)》。

#### 双模式理性柔和色系规范 (V2.1 - 特别适配 #FDFDFD)
*   **亮色模式 (Light Mode):**
    *   **背景:** `#FDFDFD`
    *   **前景/文字:** `#111111`
    *   **连续单调色阶:** `["#F0F0F0", "#CCCCCC", "#969696", "#636363", "#252525"]`
    *   **离散分类色板:** `["#b3cde3", "#ccebc5", "#decbe4", "#fed9a6", "#fbb4ae"]`

*   **暗色模式 (Dark Mode):**
    *   **背景:** `#121212`
    *   **前景/文字:** `#E0E0E0`
    *   **连续单调色阶:** `["#252525", "#636363", "#969696", "#CCCCCC", "#F0F0F0"]`
    *   **离散分类色板:** `["#89cff0", "#98fb98", "#dda0dd", "#ffdab9", "#f08080"]`

---
等待用户给你预期输入，现在保持冷静与回顾自己的工作流程。
```

### 其它资源和链接

原创项目：

- GGBPuppy：https://ggbpuppy.5051001.xyz/

- ManimCat：https://manimcat.5051001.xyz/

非原创项目：

- Fish Audio：https://fish.audio/zh-CN/

开源链接：

<div style="margin: 20px 0; font-family: sans-serif;">
<table style="width: 100%; border-collapse: collapse; background-color: #fefdf5; border: 1px solid #d3c6a6; table-layout: fixed;">
  <thead>
    <tr style="background-color: #ffab91; color: white;">
      <th style="padding: 12px; border: 1px solid #d3c6a6; width: 30%; text-align: left;">项目名称</th>
      <th style="padding: 12px; border: 1px solid #d3c6a6; width: 45%; text-align: left;">核心用途</th>
      <th style="padding: 12px; border: 1px solid #d3c6a6; width: 25%; text-align: left;">开源仓库地址</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: #fff9e6;">
      <td style="padding: 12px; border: 1px solid #d3c6a6;"><b>Mambo Lab (核心)</b></td>
      <td style="padding: 12px; border: 1px solid #d3c6a6;">本项目主仓库：基于 React 的交互式 Galgame 教学引擎</td>
      <td style="padding: 12px; border: 1px solid #d3c6a6;"><a href="https://github.com/Wing900/mambo-conic" style="color: #4A90D9; text-decoration: none;">mambo-conic</a></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #d3c6a6;">ManimCat (辅助)</td>
      <td style="padding: 12px; border: 1px solid #d3c6a6;">数学动画生成：用于批量制作专业美观的数学教学视频</td>
      <td style="padding: 12px; border: 1px solid #d3c6a6;"><a href="https://github.com/Wing900/ManimCat" style="color: #4A90D9; text-decoration: none;">ManimCat</a></td>
    </tr>
    <tr>
      <td style="padding: 12px; border: 1px solid #d3c6a6;">GGBPuppy (辅助)</td>
      <td style="padding: 12px; border: 1px solid #d3c6a6;">GeoGebra 增强：解决国内访问瓶颈，提供稳定的实验嵌入</td>
      <td style="padding: 12px; border: 1px solid #d3c6a6;"><a href="https://github.com/Wing900/GGBPuppy" style="color: #4A90D9; text-decoration: none;">GGBPuppy</a></td>
    </tr>
  </tbody>
</table>
<p style="font-size: 12px; color: #8a7e6a; margin-top: 8px; text-align: right;">* 以上项目均为本团队原创并维护，源码完全透明可查</p>
</div>

## 原创性说明

本团队郑重声明，本项目《曼波实验室》从底层架构设计、教学脚本撰写、交互逻辑实现到自研工具链的整合，均由团队成员自主构思并独立开发完成，绝无任何形式的剽窃、抄袭或第三方代写行为。我们始终坚持将严谨的数学逻辑作为作品的核心，利用现代 Web 技术实现了从构思到代码的跨界转化。为确保原创性的真实与透明，本项目已在 GitHub 平台完全开源（包含所有底层逻辑代码、资源制作脚本及版本迭代记录），作品的每一行代码均可溯源，每一处设计决策均有据可查。

**我们对本作品的原创性承担全部法律及学术责任，我们完全可以证明其原创性。**
