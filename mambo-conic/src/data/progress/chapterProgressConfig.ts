export interface ProgressPointConfig {
  sceneId: string;
  label: string;
  units?: number;
}

/**
 * 自定义进度配置（白名单模式）：
 * - 只显示这里写到的节点，没写的场景不会出现在进度条中
 * - 顺序就是显示顺序
 * - units 可选，>1 表示该节点占多个进度单位
 */
export const CHAPTER_PROGRESS_CONFIG: Record<string, ProgressPointConfig[]> = {
  chapter01: [
    { sceneId: 'ch01_s01_topic', label: '章节引入：圆锥曲线之旅' },
    { sceneId: 'ch01_s03_quiz', label: '热身测验：圆与距离关系' },
    { sceneId: 'ch01_s04_transition', label: '切圆锥原理：角度决定曲线' },
    { sceneId: 'ch01_s05_lab_start', label: '实验一：动态切割观察', units: 2 },
    { sceneId: 'ch01_s06_define', label: '结论一：椭圆出现条件' },
    { sceneId: 'ch01_s07_intro', label: '实验二：逼近临界角' },
    { sceneId: 'ch01_s08_define', label: '结论二：抛物线' },
    { sceneId: 'ch01_s09_intro', label: '实验三：越过临界角' },
    { sceneId: 'ch01_s10_define', label: '结论三：双曲线' },
    { sceneId: 'ch01_s11_quiz', label: '核心回顾：椭圆角度条件', units: 2 },
    { sceneId: 'ch01_s12_history', label: '数学史补充：阿波罗尼斯' },
    { sceneId: 'ch01_s13_descartes', label: '承上启下：走向坐标法' },
    { sceneId: 'ch01_s13_end', label: '第一章完成' },
  ],
  chapter02: [
    { sceneId: 'ch02_s01_logic', label: '方法论：定义要可检验' },
    { sceneId: 'ch02_s02_question', label: '问题提出：单定点可行吗' },
    { sceneId: 'ch02_s03_lab_start', label: '实验一：否定单定点方案', units: 2 },
    { sceneId: 'ch02_s04_lab_start', label: '实验二：两定点四则检验', units: 2 },
    { sceneId: 'ch02_s04_quiz', label: '关键发现：距离和不变' },
    { sceneId: 'ch02_s04_conjecture', label: '形成猜想：两焦点距离和' },
    { sceneId: 'ch02_s05_intro', label: '严谨性检验：常数取值范围' },
    { sceneId: 'ch02_s05_impossible', label: '边界讨论：退化与不存在' },
    { sceneId: 'ch02_s06_definition', label: '椭圆定义正式确立', units: 2 },
    { sceneId: 'ch02_s06_video', label: '定义可视化验证' },
    { sceneId: 'ch02_s07_foci', label: '术语建立：焦点与焦距' },
    { sceneId: 'ch02_s07_end', label: '第二章完成' },
  ],
  chapter03: [
    { sceneId: 'ch03_s01_intro', label: '任务开启：从定义到方程' },
    { sceneId: 'ch03_s01_quiz', label: '历史点：笛卡尔与坐标系' },
    { sceneId: 'ch03_s02_correct', label: '坐标法四步流程建立' },
    { sceneId: 'ch03_s03_intro', label: '实验：利用对称性建系', units: 2 },
    { sceneId: 'ch03_s03_quiz2', label: '建系策略确认' },
    { sceneId: 'ch03_s04_quiz2', label: '列式：椭圆定义代数化' },
    { sceneId: 'ch03_s05_correct', label: '双根号方程成型' },
    { sceneId: 'ch03_s06_correct', label: '化简策略：移项再平方', units: 2 },
    { sceneId: 'ch03_s06_step3', label: '两次平方后得到中间式' },
    { sceneId: 'ch03_s07_correct', label: '参数关系：b² = a² - c²' },
    { sceneId: 'ch03_s08_reveal', label: '标准方程正式揭晓', units: 2 },
    { sceneId: 'ch03_s08_quiz', label: '焦点轴与分母大小判定' },
    { sceneId: 'ch03_s09_summary', label: '全章总结：两种标准式' },
    { sceneId: 'ch03_s09_end', label: '第三章完成' },
  ],
};
